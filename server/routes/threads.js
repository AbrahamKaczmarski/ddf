const express = require('express')
const router = express.Router()

const Post = require('../models/post')
const Thread = require('../models/thread')
const User = require('../models/user')

const { verifyToken } = require('../middleware')
const thread = require('../models/thread')
const { findOne } = require('../models/post')

// -- utility

const generateIdentifier = (threadName) =>
{
    return threadName
        .toLowerCase()
        .replace(/[\/ ]/g, "-")
        .replace(/[^a-zżźćńółęąś0-9\-]/g, "")
}

// -- routes

router.route('/')
    .get(async (req, res) =>
    {
        try
        {
            let threadList = await Thread.find().sort({name: 1})

            const nPosts = await Post.aggregate([{
                $group: { _id: '$threadId', count: { $sum: 1 } }
            }])

            let counts = {}

            for(let post of nPosts)
                counts[post._id] = post.count

            for(let thread of threadList)
                thread.nPosts = counts[thread.identifier] || 0

            return res.status(200).send(threadList)
        }
        catch (err)
        {
            console.log(`GET@/threads : ${err}`)
            return res.status(500).end()
        }
    })
    .post(verifyToken, async (req, res) =>
    {
        try
        {
            if(!req.userData.roles.includes('admin'))
                return res.status(401).end()
        
            req.body.identifier = generateIdentifier(req.body.name)
            let isTaken = await Thread.findOne({ identifier: req.body.identifier })

            if(isTaken)
                return res.status(409).end()
            
            if(req.body.coverImage === "")
                delete req.body.coverImage
            
            let thread = new Thread(req.body)

            await thread.save()

            return res.status(200).end()
        }
        catch (err)
        {
            console.log(`POST@/threads : ${err}`)
            return res.status(500).end()
        }
    })

router.route('/posts/:id')
    .delete(verifyToken, async (req, res) =>
    {
        try
        {
            if(!req.userData.roles.includes('gameMaster'))
                return res.status(401).end()
            
            await Post.deleteOne({ _id: req.params.id })
            
            return res.status(200).end()
        }
        catch (err)
        {
            console.log(`DELETE@/threads/posts : ${err}`)
            return res.status(500).end()
        }
    })

router.post('/search', async (req, res) =>
{
    try
    {
        if(!req.body.type)
            return res.status(400).end()

        let posts = []
        
        switch(req.body.type)
        {
            case 'postContent':
            {
                posts = await Post.find({ content: new RegExp(req.body.input, 'i') })

                let authorIds = posts.map(post => post.authorId)
                authorIds = authorIds.filter((x, i, a) => a.indexOf(x) == i)

                let users = await User.find({_id: {$in: authorIds}}, 'name roles')
                let authors = {}

                for(let user of users)
                    authors[user._id] = { name: user.name, roles: user.roles }
                
                for(let post of posts)
                    post.author = authors[post.authorId]

                break
            }
            
            case 'userData':
            {
                let users = await User.find({ $or: [
                    { name: new RegExp(req.body.input, 'i') },
                    { email: new RegExp(req.body.input, 'i') }
                ] })

                let ids = users.map(user => user._id)
                
                posts = await Post.find({ authorId: { $in: ids } })
                let authors = {}

                for(let user of users)
                    authors[user._id] = { name: user.name, roles: user.roles }
                
                for(let post of posts)
                    post.author = authors[post.authorId]
                
                break
            }
            
            default:
                return res.status(400).end()
        }
        
        return res.status(200).send(posts)
    }
    catch (err)
    {
        console.log(`POST@/threads/search : ${err}`)
        return res.status(500).end()
    }
})

router.get('/search/:id', async (req, res) =>
{
    try
    {
        let author = await User.findOne({ _id: req.params.id })        
        let posts = await Post.find({ authorId: req.params.id })

        for(let post of posts)
            post.author = { name: author.name, roles: author.roles }
        
        return res.status(200).send(posts)
    }
    catch (err)
    {
        console.log(`POST@/threads/search : ${err}`)
        return res.status(500).end()
    }
})

router.route('/:id')
    .get((req, res) => res.redirect(`/threads/${req.params.id}/1-10`))
    .post(verifyToken, async (req, res) =>
    {
        try
        {
            if(!req.userData.roles.includes('player'))
                return res.status(401).end()

            req.body.threadId = req.params.id
            req.body.authorId = req.userData.id

            let post = new Post(req.body)
            await post.save()

            return res.status(200).end()
        }
        catch (err)
        {
            console.log(`POST@/threads/${req.params.id} : ${err}`)
            return res.status(500).end()
        }
    })
    .patch(verifyToken, async (req, res) =>
    {
        try
        {
            if(!req.userData.roles.includes('admin'))
                return res.status(401).end()
            
            req.body.identifier = generateIdentifier(req.body.name)
            let isTaken = await Thread.findOne({ identifier: req.body.identifier })

            if(isTaken && req.body.name != isTaken.name)
                return res.status(409).end()
            
            if(req.body.coverImage === "")
                delete req.body.coverImage

            await Post.updateMany({ threadId: req.params.id }, { threadId: req.body.identifier })
            await Thread.updateOne({ identifier: req.params.id }, req.body)

            return res.status(200).end()
        }
        catch (err)
        {
            console.log(`PATCH@/threads/${req.params.id} : ${err}`)
            return res.status(500).end()
        }
    })
    .delete(verifyToken, async (req, res) =>
    {
        try
        {
            if(!req.userData.roles.includes('admin'))
                return res.status(401).end()
                
            await Post.deleteMany({ threadId: req.params.id })
            await Thread.deleteOne({ identifier: req.params.id })

            return res.status(200).end()
        }
        catch (err)
        {
            console.log(`DELETE@/threads/${req.params.id} : ${err}`)
            return res.status(500).end()
        }
    })

router.get('/:id/:page', async (req, res) =>
{
    try
    {
        let range = req.params.page.split('-')
        let offset = parseInt(range[0]) - 1
        let amount = parseInt(range[1])

        offset = offset < 0 ? 0 : offset
        amount = amount < 5 ? 5 : amount

        let nPosts = await Post.countDocuments({ threadId: req.params.id })

        if(nPosts == 0)
            return res.status(200).send({ nPosts, posts: []})

        if(offset >= nPosts)
            offset = Math.floor(nPosts / amount) * amount - 1

        let posts = await Post.find({ threadId: req.params.id })
            .sort({date: -1})
            .skip(offset)
            .limit(amount)

        let authorIds = posts.map(post => post.authorId)
        authorIds = authorIds.filter((x, i, a) => a.indexOf(x) == i)

        let users = await User.find({_id: {$in: authorIds}}, 'name roles')
        let authors = {}

        for(let user of users)
            authors[user._id] = { name: user.name, roles: user.roles }
        
        for(let post of posts)
            post.author = authors[post.authorId]
        
        let threadTitle = await Thread.findOne({ identifier: req.params.id })
        threadTitle = threadTitle.name

        res.status(200).send({
            threadTitle,
            nPosts,
            posts: posts.reverse()
        })
    }
    catch (err)
    {
        console.log(`GET@/threads/${req.params.id} : ${err}`)
        return res.status(500).end()
    }
})

module.exports = router
