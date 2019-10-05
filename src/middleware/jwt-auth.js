const AuthService = require('../auth/auth-service')

function requireAuth(req, res, next) {
    // get token
    const authToken = req.get('Authorization') || ''
    // usable variable
    let bearerToken
    // check if there is a token
    if (!authToken.toLowerCase().startsWith('bearer ')) {
        return res.status(401).json({ error: 'Missing bearer token' })
    } else {
        // slice at 7 to remove the word bearer
        bearerToken = authToken.slice(7, authToken.length)
    }
    try {
        // veryify payload
        const payload = AuthService.verifyJwt(bearerToken)
        // get user from user name
        AuthService.getUserWithUserName(
            req.app.get('db'),
            payload.sub,
        )
            .then(user => {
                if (!user)
                    return res.status(401).json({ error: 'Unauthorized request' })
                req.user = user
                next()
            })
            .catch(err => {
                console.error(err)
                next(err)
            })
    } catch (error) {
        res.status(401).json({ error: 'Unauthorized request' })
    }
}

module.exports = {
    requireAuth,
}