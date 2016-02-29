import User from '../users/user-model'
import jwt from 'jsonwebtoken'
import config from '../config'

export function generateToken(payload) {
  return new Promise((resolve) => {
    jwt.sign(
      payload,
      config.tokenSecret,
      {expiresIn: '10h'},
      token => {
        resolve(token)
      }
    )
  })
}

export default function* authenticate(next) {
  let username = this.request.body.username
  let user = yield User.findByUsername(username)
  if (user === null) {
    this.status = 404
    this.body = {
      success: false,
      message: `User ${username} was not found.`
    }
  } else {
    let validPassword = yield user.validatePassword(this.request.body.password)

    if (validPassword) {
      let token = yield generateToken(user.token)
      this.status = 200
      this.body = {
        success: true,
        message: `User ${username} successfully authenticated.`,
        token
      }
    } else {
      this.status = 400
      this.body = {
        success: false,
        message: `Invalid password for user ${username}.`
      }
    }
  }

  yield next
}
