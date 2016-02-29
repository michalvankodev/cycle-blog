import User from './user-model'
import encryptPassword from './encrypt-password'
import {pick} from 'ramda'

// TODO Get User
/**
 * Get a single user by quering his username/
 *
 * @param {Function} next koa next middleware
 */
export function* getUser(next) {
  let query = 'michal' // TODO
  let user = yield User.findByUsername(query)
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

  let validPassword = User.validatePassword(password)

  if (validPassword) {
    usefullData.hashedPassword = yield encryptPassword(password)
    let user = yield User.create(usefullData)
    //TODO VALIDATION
    this.status = 200
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
