const jwt = require('jsonwebtoken')

function verifyToken(req, res, next)
{
    try
    {
        let token = req.headers.authorization.split(' ')[1]
        let payload = jwt.verify(token, process.env.JWT_SECRET)
        req.userData = { id: payload.id, roles: payload.roles }
        return next()
    }
    catch(err)
    {
        return res.status(401).send('Unauthorized request')
    }
}


module.exports = {
    verifyToken
}
