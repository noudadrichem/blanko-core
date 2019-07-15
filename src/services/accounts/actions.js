import passport from 'passport';

import Account from '../../models/account';
import Task from '../../models/tasks';
import {
  generateAccessToken,
  respond,
  authenticate
} from '../../middlewares/auth'
import log from '../../log'


export function registerAccount(request, response) {
  const {
    username,
    firstName,
    lastName
  } = request.body

  const newAccount = new Account({
    username,
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`
  })

  Account.register(
    newAccount,
    request.body.password,
    function handleRegister(err) {
    if (err) {
      response.json({
        message: 'This account already exist, try resetting the password.'
      })
    } else {
      passport.authenticate(
        'local', {
          session: false
        }
      )(request, response, () => {
        response.json({
          message: 'Succesfully created account'
        })
      })
    }
  })
}
