const express = require('express')
const UsersService = require('./users-service')
const AuthService = require('../auth/auth-service');
const usersRouter = express.Router()
const jsonBodyParser = express.json()

usersRouter
    .post('/new-user', jsonBodyParser, (req, res, next) => {
        const { password, user_name, email, full_name } = req.body

        // make sure all fields are filled
        for (const field of ['full_name', 'email', 'user_name', 'password'])
            if (!req.body[field])
                return res.status(400).json({
                    error: `Missing '${field}' in request body`
                })

        // TODO: check user_name doesn't start with spaces

        const passwordError = UsersService.validatePassword(password)

        if (passwordError)
            return res.status(400).json({ error: passwordError })

        // first check if email is used to ensure no errors
        UsersService.getUsernameWithEmail(
            req.app.get('db'),
            email
        )
            .then(user => {
                if (user) {
                    res.status(400).json({
                        error: "Account already exists"
                    })
                }

            }).catch(error => console.log(error));


        // make sure username doesnt already exist
        UsersService.hasUserWithUserName(
            req.app.get('db'),
            user_name
        )
            .then(hasUserWithUserName => {
                if (hasUserWithUserName)
                    return res.status(400).json({ error: `Username already taken` })

                return UsersService.hashPassword(password)
                    .then(hashedPassword => {
                        const newUser = {
                            user_name,
                            password: hashedPassword,
                            full_name,
                            email,
                            date_created: 'now()',
                        }
                        // insert to db
                        return UsersService.insertUser(
                            req.app.get('db'),
                            newUser
                        )
                            .then(user => {
                                const sub = user.user_name
                                const payload = { user_id: user.id }
                                // send the token
                                res.status(200)
                                    .send({
                                        authToken: AuthService.createJwt(sub, payload),
                                    })
                            })
                    })
            })
            .catch(next)
    })

module.exports = usersRouter