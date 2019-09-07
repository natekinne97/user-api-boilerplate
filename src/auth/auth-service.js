const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config')

const AuthService = {
    // check user from db
    getUserWithUserName(db, user_name) {
        // insert your db here
        return db('users')
            .where({ user_name })
            .first()
    },
    // compare the passwords
    comparePasswords(password, hash) {
        return bcrypt.compare(password, hash)
    },
    // create a json token
    createJwt(subject, payload) {
        return jwt.sign(payload, config.JWT_SECRET, {
            subject,
            algorithm: 'HS256',
        })
    },
    // verify token
    verifyJwt(token) {
        return jwt.verify(token, config.JWT_SECRET, {
            algorithms: ['HS256'],
        })
    },
    // parse base token
    parseBasicToken(token) {
        return Buffer
            .from(token, 'base64')
            .toString()
            .split(':')
    },
}

module.exports = AuthService