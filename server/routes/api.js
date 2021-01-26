const express = require('express')
const router = express.Router()

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/user')
const Thread = require('../models/thread')
const Post = require('../models/post')
const Hero = require('../models/hero')

const { verifyToken } = require('../middleware')

router.get('/threads', async (req, res) =>
{
    try
    {
        const threadList = await Thread.find().sort({name: 1})
        return res.status(200).send(threadList)
    }
    catch (err)
    {
        console.log(`GET@/admin/threads : ${err}`)
        return res.status(500).send("Internal server error")
    }
})

router.post('/register', async (req, res) =>
{
    try
    {
        req.body.password = await bcrypt.hash(userData.password, 10)
        let user = new User(req.body)

        user.save((err, registeredUser) =>
        {
            if(err)
            {
                console.log(`Error registering user : ${err}`)
                return res.status(500).send()
            }

            let payload = { id: registeredUser._id, roles: registeredUser.roles }
            let token = jwt.sign(payload, process.env.JWT_SECRET)

            return res.status(200).send({token})
        })
    }
    catch {
        return res.status(500).send("Internal server error")
    }
})

router.post('/login', async (req, res) =>
{
    try
    {
        let user = await User.findOne({email: req.body.email})

        if(!user)
            return res.status(401).send("Invalid email")

        if(!await bcrypt.compare(req.body.password, user.password))
            return res.status(401).send("Invalid password")
        
        let payload = { id: user._id, roles: user.roles }
        let token = jwt.sign(payload, process.env.JWT_SECRET)
        return res.status(200).send({token})
    }
    catch (err)
    {
        console.log(`POST@/login : ${err}`)
        return res.status(500).send("Internal server error")
    }
})

router.get('/profile', verifyToken, async (req, res) =>
{
    try
    {
        let user = await User.findOne({_id: req.userData.id})

        if(!user)
            return res.status(401).send("Invalid profile")

        return res.json({ "body": `Your profile, ${user.name} (${user.email}) | ${user.roles[0]}` })
    }
    catch (err)
    {
        console.log(`POST@/login : ${err}`)
        return res.status(500).send("Internal server error")
    }     
})

router.get("/threads/:id", async (req, res) =>
{
    try
    {
        let posts = await Post.find({threadId: req.params.id})
            .sort({date: -1})
            .limit(5)

        res.send(posts.reverse())
    }
    catch (err)
    {
        console.log(`GET@/threads/${req.params.id} : ${err}`)
        return res.status(500).send("Internal server error")
    }
})

router.post("/threads/:id", verifyToken, async (req, res) =>
{
    try
    {
        if(!req.userData.roles.includes('player'))
            return res.status(401).send("Unauthorized request")

        req.body.threadId = req.params.id
        req.body.authorId = req.userData.id

        let post = new Post(req.body)
        await post.save()

        return res.status(200).send()
    }
    catch (err)
    {
        console.log(`POST@/threads/${req.params.id} : ${err}`)
        return res.status(500).send("Internal server error")
    }
})

// = Admin

router.get('/admin/threads', verifyToken, async (req, res) =>
{
    try
    {
        if(!req.userData.roles.includes('admin'))
            return res.status(401).send("Unauthorized request")

        const threadList = await Thread.find({}, 'name identifier').sort({identifier: 1})
        return res.status(200).send(threadList)
    }
    catch (err)
    {
        console.log(`GET@/admin/threads : ${err}`)
        return res.status(500).send("Internal server error")
    }
})

router.post('/admin/threads', verifyToken, async (req, res) =>
{
    try
    {
        if(!req.userData.roles.includes('admin'))
            return res.status(401).send("Unauthorized request")
    
        req.body.identifier = req.body.name
            .toLowerCase()
            .replace(/[\/ ]/g, "-")
            .replace(/[^a-zżźćńółęąś0-9\-]/g, "")
        
        let thread = new Thread(req.body)

        await thread.save()

        return res.status(200).send("Thread added")
    }
    catch (err)
    {
        console.log(`POST@/admin/threads : ${err}`)
        return res.status(500).send()
    }
})

module.exports = router
