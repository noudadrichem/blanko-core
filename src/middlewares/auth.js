import jwt from 'jsonwebtoken'
import expressJwt from 'express-jwt'
import conf from '../config'

const secret = conf.authSecret
const authenticate = expressJwt({ secret })

function generateAccessToken(req, res, next) {
  req.token = jwt.sign({
    id: req.user.id,
    success: true
  }, secret);
  next()
}

function respond(req, res) {
  return res.json({
    user: req.user.username,
    token: req.token,
    id: req.user.id,
    success: true
  })
}

export { authenticate, generateAccessToken, respond }
