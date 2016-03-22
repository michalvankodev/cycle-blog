import User from './user-model'
import encryptPassword from './encrypt-password'
import {pick} from 'ramda'
import winston from 'winston'

// TODO Get User
/**
 * Get a single user by quering his username
 *
 * @param {Function} next koa next middleware
 */
export function* getUser(next) {
  let user = yield User.findByUsername(this.params.username)
  if (user) {
    this.body = {
      user: user.profile
    }
  }
  else {
    this.status = 404
  }
  yield next
}

/**
 * Create a new user from POST parameters.
 *
 * @param {Function} next koa next middleware
 */
export function* addNewUser(next) {
  const usefullFields = ['username', 'email', 'role']
  let usefullData = pick(usefullFields, this.request.body)
  let password = this.request.body.password

  if (User.isStrongPassword(password)) {
    usefullData.hashedPassword = yield encryptPassword(password)

    let user
    try {
      user = yield User.create(usefullData)
    }
    catch (e) {
      this.status = 400
      this.body = {
        success: false,
        message: `Unable to save user. ${e.message}`
      }
      yield next
      return
    }

    this.status = 201
    this.body = {
      success: true,
      message: `User ${user.username} was successfully created.`,
      user: user.profile
    }
  }
  else {
    this.status = 400
    this.body = {
      success: false,
      message: 'You have provided wrong or a weak password.'
    }
  }

  yield next
}

// TODO Update User
// TODO Update Password
// TODO Get Multiple users
