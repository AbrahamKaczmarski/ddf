const express = require('express')
const router = express.Router()

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/user')

const { verifyToken } = require('../middleware')

router.post('/register', async (req, res) =>
{
    try
    {
        let isTaken = await User.findOne({ email: req.body.email })

        if(isTaken)
            return res.status(409).end()

        req.body.password = await bcrypt.hash(req.body.password, 10)
        let user = new User(req.body)

        let registeredUser = await user.save()

        let payload = { id: registeredUser._id, roles: registeredUser.roles }
        let token = jwt.sign(payload, process.env.JWT_SECRET)
        let name = user.name
        let roles = registeredUser.roles

        return res.status(200).send({ token, name, roles })
    }
    catch (err) {
        console.log(`POST@/register : ${err}`)
        return res.status(500).end()
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
        let name = user.name
        let roles = user.roles

        return res.status(200).send({ token, name, roles })
    }
    catch (err)
    {
        console.log(`POST@/login : ${err}`)
        return res.status(500).end()
    }
})

router.post('/verify', verifyToken, async (req, res) =>
{
    try
    {
        let user = await User.findOne({_id: req.userData.id})

        if(!user)
            return res.status(401).end()

        let match = req.body.length < 1 || req.body.some(role => user.roles.includes(role))

        if(!match)
            return res.status(401).end()
        
        return res.status(200).end()
    }
    catch (err)
    {
        console.log(`POST@/verify : ${err}`)
        return res.status(500).end()
    }
})

module.exports = router
