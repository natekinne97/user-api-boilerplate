const AuthService = require('../auth/auth-service')
const resestServices = require('./reset-services')
const UserService = require('../users/users-service');
const nodemailer = require('nodemailer')
const config = require('../config')
const express = require('express')
const jsonBodyParser = express.json()
const resRouter = express.Router()


// sends email for the password reset
resRouter
    .route('/forgot')
    .post(jsonBodyParser, (req, res, next) => {
        const { email } = req.body;


        if (!email)
            return res.status(400).json({
                error: 'Incorrect user_name or email',
            })

        //  check user name
        resestServices.getUsernameWithEmail(
            req.app.get('db'),
            email
        )
            .then(dbUser => {
                console.log(dbUser.email)
                if (!dbUser.email)
                    return res.status(400).json({
                        error: 'email not found',
                    })

                // setup token
                const sub = dbUser.user_name
                const payload = { user_id: dbUser.id }
                const token = AuthService.createJwt(sub, payload);
                // console.log(token, 'token');
                const update = {
                    resetpasswordtoken: token,
                    resetpasswordexpires: Date.now() + 36000
                }
                console.log(dbUser.id, 'user id');
                // not sure whats happening here or if it will work
                resestServices.updateUserInfo(
                    req.app.get('db'),
                    dbUser.id,
                    update
                ).then(result => {
                    if (!result.resetpasswordtoken) {
                        console.log('token not created');
                    }
                })

                // transporter for email verification
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: `${config.EMAIL}`,
                        pass: `${config.EMAIL_PASSWORD}`
                    }
                })

                // change user email

                // the actual email
                const mailOptions = {
                    from: 'useremail@gmail.com',
                    to: `${dbUser.email}`,
                    subject: 'Link to password reset.',
                    text:
                        'You are recieving this email because you (or someone else) has requested a reset of the password of your account' +
                        'Please click the following link, or paste this in your browser to complete the process within 1 hour of revieving this email.' +
                        `http://localhost:3000/reset/${token} \n\n` +
                        'If you did not make this request, please ignore this message.'
                }

                // send the email
                transporter.sendMail(mailOptions, function (err, response) {
                    console.log('sending email')
                    if (err) {
                        res.status(400).json({
                            error: 'Unable to send',
                            message: 'Please try again later'
                        })
                    } else {
                        console.log('success')
                        res.status(200).json('recovery email sent');
                    }
                })

            })
            .catch(next)

    });

// double checks the params before loading the remainder of the reset
resRouter.route('/reset-check')
    .post(jsonBodyParser, (req, res, next) => {
        // get user token
        const { resetPasswordToken } = req.body;
        console.log(resetPasswordToken, 'reset token');
        console.log(req.body, 'req.params');
        // find user with token
        resestServices.getUserWithTokens(
            req.app.get('db'),
            resetPasswordToken
        ).then(user => {
            // check if something is returned
            if (user == null) {
                console.log('password reset link is invalid or has expired')
                res.json('password reset link is invalid or has expired')
            } else {

                if (Number(user.resetpasswordexpires) > Date.now()) {
                    console.log('working')
                    res.status(200)
                        .location(`/${user.id}`)
                        .json(user.user_name);
                } else {
                    res.json('password reset link is invalid or has expired');
                }

            }
        }).catch(next);
    })

// update the password
resRouter.route('/reset-password')
    .patch(jsonBodyParser, (req, res, next) => {
        const { user_name, password } = req.body;
        // get the user
        resestServices.getUserWithUserName(
            req.app.get('db'),
            user_name
        ).then(user => {
            // check the new password
            const passwordError = UserService.validatePassword(password);
            if (passwordError)
                return res.status(400).json({ error: passwordError })
            // hash password
            return UserService.hashPassword(password)
                .then(hashedPassword => {
                    // makesure hash password is put into db
                    const updated = {
                        password: hashedPassword
                    }
                    // update info
                    return resestServices.updateUserInfo(
                        req.app.get('db'),
                        user.id,
                        updated
                    ).then(user => {
                        // send successful
                        res
                            .status(201)
                            .json('update succesful')
                    })
                })
        })
    })


module.exports = resRouter;