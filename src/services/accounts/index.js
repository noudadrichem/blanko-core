import { Router as router } from 'express';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

import Account from '../../models/account';
import Task from '../../models/task';
import passport from 'passport';
import log from '../../log'
import { generateAccessToken, respond, authenticate } from '../../middlewares/auth'
import config from '../../config'

import {
    registerAccount
} from './actions'

export default function accountsController() {
    const api = router();

    api.post('/register', registerAccount)

    api.post('/login', (req, res, next) => {
        log.info({ message: 'Login in...' })

        passport.authenticate('local', { session: true }, (err, user) => {
            if (err) {
                log.error(err)
                return next(err)
            }

            if (!user) {
                return res.json({
                    success: false,
                    message: 'Wrong username or password.'
                });
            }

            req.login(user, err => err ? res.json(err) : next(err))

        })(req, res, next)
    }, generateAccessToken, respond)

    api.get('/logout', authenticate, (req, res) => {
        req.logout();
        res.status(200).json({ message: 'You have been logged out' })
    })

    api.get('/me', authenticate, (req, res) => {
        res.status(200).json(req.user);
    })

    api.post('/changepassword', authenticate, (req, res) => {
        const { newPassword, username } = req.body

        Account.findByUsername(username).then((userObject) => {
            if (userObject) {
                userObject.setPassword(newPassword, () => {
                    userObject.save()
                    res.status(200).json({ message: 'password reset successful' })
                })
            } else {
                res.status(500).json({ message: 'This user does not exist' })
            }
        }).catch(err => res.json(err))
    })

    api.post('/forgot', (req, res) => {
        const { username } = req.body
        const hexCodeOnUrl = crypto.randomBytes(Math.ceil(20)).toString('hex')

        Account.findOne({ username }).then(acc => {
            if (!acc) {
                res.json({ message: 'This account does not exist' })
            } else {

                acc.resetPasswordToken = hexCodeOnUrl
                acc.resetPasswordExpires = Date.now() + (3600 * 1000)
                acc.save()

                const { resetPasswordToken } = acc
                const htmlMail = `<h3>Hey ${acc.firstName},</h3>

                    <p>Reset your Blanko password using this link:</p>
                    <a href="https://client.blankoapp.com/reset-password/${resetPasswordToken}">
                    https://client.blankoapp.com/reset-password/${resetPasswordToken}
                    </a>`

                const blankoMailSmtp = nodemailer.createTransport({
                    host: 'smtp.blankoapp.com',
                    port: 587,
                    secure: false,
                    auth: {
                        user: config.email,
                        pass: config.emailPassword
                    },
                    tls: {
                        rejectUnauthorized: false
                    }
                })

                const MAIL_SETTINGS = {
                    from: 'noreply@blankoapp.com',
                    to: username,
                    subject: 'Blanko password reset',
                    html: htmlMail
                }

                blankoMailSmtp.sendMail(MAIL_SETTINGS, (err) => {
                    if (err) {
                        res.json(err)
                    } else {
                        log.info({ tok: resetPasswordToken })
                        log.info({ message: 'Mail has been send!' })
                        res.json({ message: 'Mail has been send!' })
                    }
                })
            }
        })
    })

    api.post('/reset/:token', (req, res) => {
        const { token } = req.params
        const { newPassWordValue } = req.body

        console.log('reset token: ' + token, req.body)

        Account.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        }).then(acc => {
            if (!acc) {
                res.json({ message: 'This URL might be out of date, try it again.', succes: false })
            } else {
                acc.setPassword(newPassWordValue, err => {
                    if (err) {
                        log.error(err)
                        res.json({ err, succes: false })
                    } else {
                        acc.resetPasswordToken = undefined
                        acc.resetPasswordExpires = undefined

                        const updatedAcc = acc.save()
                        log.info('Succesfully changed password', updatedAcc)
                        res.json({ message: 'Succesfully changed password', succes: true })
                    }
                })
            }
        })
    })

    api.get('/all-tasks', authenticate, (req, res) => {
        const { accountId } = req.user.id
        Task.find({ createdBy: accountId })
            .then(function returnAllAccountTasks(allAccountTasks) {
                log.info({ allAccountTasks })
                res.json(allAccountTasks)
            })
    })

    return api
}
