const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config')

const AuthService = {
    // get user from username
    getUserWithUserName(db, user_name) {
        return db('users')
            .where({ user_name })
            .first()
    },
    // compare hashed passwords
    comparePasswords(password, hash) {
        return bcrypt.compare(password, hash)
    },
    // create a jwt
    createJwt(subject, payload) {
        return jwt.sign(payload, config.JWT_SECRET, {
            subject,
            expiresIn: config.JWT_EXPIRY,
            algorithm: 'HS256',
        })
    },
    // verify the token
    verifyJwt(token) {
        return jwt.verify(token, config.JWT_SECRET, {
            algorithms: ['HS256'],
        })
    },
    // parse the token
    parseBasicToken(token) {
        return Buffer
            .from(token, 'base64')
            .toString()
            .split(':')
    },
}

module.exports = AuthService