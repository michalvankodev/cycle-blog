import User from './user-model'
import encryptPassword from './encrypt-password'
import {pick} from 'ramda'
import winston from 'winston'
import {getConditions, getOptions} from '../queryparser'

// TODO Get User
/**
 * Get a single user by quering his username
 *
 * @param {Function} next koa next middleware
 */
export function* getUser(next) {
  let user
  try {
    user = yield User.findByUsername(this.params.username)
  }
  catch(e) {
    this.status = 500
    this.body = {
      success: false,
      message: `Unable to find user. ${e.message}`
    }
  }
  if (user) {
    this.body = {
      user: user.profile
    }
  }
  else {
    this.status = 404
    this.body = {
      success: false,
      message: 'Unable to find user.'
    }
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
    catch(e) {
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

/**
 * Update a existing user from POST parameters.
 *
 * @param {Function} next koa next middleware
 */
export function* updateUser(next) {
  const usefullFields = ['username', 'email', 'role']
  let usefullData = pick(usefullFields, this.request.body)
  let user
  const actor = this.state.user

  if (actor.role === 'admin' || actor._id === this.params.id) {
    try {
      user = yield User.findByIdAndUpdate(
        this.params.id,
        usefullData,
        {
          new: true,
          runValidators: true
        }
      )
    }
    catch(e) {
      this.status = 500
      this.body = {
        success: false,
        message: `Unable to save user. ${e.message}`
      }
      yield next
      return
    }

    this.status = 200
    this.body = {
      success: true,
      message: `User ${user.username} was successfully modified.`,
      user: user.profile
    }
  }
  else {
    this.status = 403
    this.body = {
      success: false,
      message: 'You are not permitted to modify other users.'
    }
  }
  yield next
}

/**
 * Delete a existing user from POST parameters.
 *
 * @param {Function} next koa next middleware
 */
export function* deleteUser(next) {
  if (this.state.user.role !== 'admin') {
    this.status = 403
    this.body = {
      success: false,
      message: 'You are not permitted to modify other users.'
    }
    yield next
    return
  }

  let user
  try {
    user = User.findByIdAndRemove(this.params.id)
  }
  catch(e) {
    this.status = 500
    this.body = {
      success: false,
      message: `Unable to delete user. ${e.message}`
    }
  }

  if (user) {
    this.status = 200
    this.body = {
      success: true,
      message: `User ${user.username} was successfully deleted.`
    }
  }
  else {
    this.status = 404
    this.body = {
      success: false,
      message: 'Unable to find user.'
    }
  }
}

/**
 * Get list of users for a given query.
 *
 * @param {Function} next koa next middleware
 */
export function* getUserList(next) {
  let defaultConditions = {}
  let defaultOptions = {
    limit: 10,
    sort: 'username'
  }

  let conditions = getConditions(this.request.query, defaultConditions)
  let query
  try {
    query = yield {
      users: User.find(
        conditions,
        null,
        getOptions(this.request.query, defaultOptions)
      ),
      count: User.count(conditions)
    }
  }
  catch(e) {
    this.status = 500
    this.body = {
      success: false,
      message: `Unable to find users. ${e.message}`
    }
    yield next
    return
  }
  let {users, count} = query
  this.status = 200
  this.body = {
    message: 'Request was successful.',
    count: count, //TODO
    results: users.map(u => u.profile)
  }
  yield next
}

/**
 * Update password for a user.
 *
 * @param {Function} next koa next middleware
 */
export function* updatePassword(next) {
  function* changePassword(user) {
    if (User.isStrongPassword(this.request.body.newPassword)) {
      user.hashedPassword = yield encryptPassword(this.request.body.newPassword)
      try {
        yield user.save()
        this.status = 200
        this.body = {
          success: true,
          message: 'Successfully changed password'
        }
      }
      catch(e) {
        this.status = 500
        this.body = {
          success: false,
          message: `Unable to change password. ${e.message}`
        }
      }
    }
    else {
      this.status = 400
      this.body = {
        success: false,
        message: 'You have provided wrong or a weak password.'
      }
    }
  }

  let actor = this.state.user
  if (actor._id === this.params.id) {
    let user = yield User.findById(this.params.id)
    let validOldPassword = yield user.validatePassword(
      this.request.body.oldPassword
    )
    if (validOldPassword) {
      yield changePassword.call(this, user)
    }
    else {
      this.status = 400
      this.body = {
        success: false,
        message: 'Your password does not match'
      }
    }
  }
  else if (actor.role === 'admin') {
    let user = yield User.findById(this.params.id)
    yield changePassword.call(this, user)
  }
  else {
    this.status = 403
    this.body = {
      success: false,
      message: 'You are not permitted to change password for other users.'
    }
  }
  yield next
}
