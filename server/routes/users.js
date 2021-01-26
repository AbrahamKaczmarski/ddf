const express = require('express')
const router = express.Router()

const User = require('../models/user')

const { verifyToken } = require('../middleware')

router.route('/')
    .get(verifyToken, async (req, res) =>
    {
        try
        {
            if(!req.userData.roles.includes('admin'))
                return res.status(401).end()
                
            let users = await User.find({}).select(['-password'])
            
            return res.status(200).send(users)
        }
        catch (err)
        {
            console.log(`GET@/profile : ${err}`)
            return res.status(500).end()
        }   
    })
    .patch(verifyToken, async (req, res) =>
    {
        try
        {
            if(!req.userData.roles.includes('admin'))
                return res.status(401).end()
                
            for(let user of req.body)
                await User.updateOne({ _id: user.id }, { roles: user.roles })

            return res.status(200).end()
        }
        catch (err)
        {
            console.log(`PATCH@/profile : ${err}`)
            return res.status(500).end()
        } 
    })

router.route('/user')
    .get(verifyToken, async (req, res) =>
    {
        try
        {
            let user = await User.findOne({_id: req.userData.id}).select(['-password'])

            if(!user)
                return res.status(401).end()

            return res.status(200).send(user)
        }
        catch (err)
        {
            console.log(`GET@/profile/user : ${err}`)
            return res.status(500).end()
        }
    })
    .patch(verifyToken, async (req, res) =>
    {
        try
        {
            await User.updateOne({ _id: req.userData.id }, { name: req.body.name })

            return res.status(200).end()
        }
        catch (err)
        {
            console.log(`PATCH@/profile/user : ${err}`)
            return res.status(500).end()
        }
    })

router.route('/:id')
    .get(async (req, res) =>
    {
        try
        {
            let user = await User.findOne({_id: req.params.id}).select(['-password'])

            if(!user)
                return res.status(404).end()

            return res.status(200).send(user)
        }
        catch (err)
        {
            console.log(`GET@/profile/${req.params.id} : ${err}`)
            return res.status(500).end()
        }     
    })

module.exports = router
