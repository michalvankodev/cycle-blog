import {Schema, default as mongoose} from 'mongoose'
import bcrypt from 'bcrypt'

let User = new Schema({
  username: {type: String, required: true, unique: true},
  hashedPassword: String,
  email: {type: String, lowercase: true, required: true},
  role: {type: String, enum: ['admin', 'moderator']}
})

/**
 * Validates if the enteredPwd is the same as stored hashedPassword.
 *
 * @param {string} enteredPwd Password to be validated
 *
 * @return {Promise<boolean, Error} Promise resolved with true if
 *  passwords match
 */
User.methods.validatePassword = function authenticateUser(enteredPwd) {
  let hashedPwd = this.hashedPassword
  return new Promise(function authPromise(resolve, reject) {
    bcrypt.compare(
      enteredPwd,
      hashedPwd,
      function compareCb(err, same) {
        if (err) { reject(err) }
        resolve(same)
      }
    )
  })
}

/**
 * Query for a user based on his username
 *
 * @param {string} username Username of the user queried
 * @param {Function} cb Callback to be called when query is done
 *
 * @return {mongoose.Query} Mongoose Query which is mapping username to username
 */
User.statics.findByUsername = function findByUsername(username, ...rest) {
  return this.findOne({username}, ...rest)
}

User.statics.isStrongPassword = function isStrongPassword(password) {
  let match = password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{6,}$/)
  if (match === null) {
    return false
  }
  return true
}

/**
 * Get profile information of the user.
 *
 * @param {[type]} 'profile' [description]
 *
 * @return {[type]} [description]
 */
User.virtual('profile').get(function getUserProfile() {
  return {
    username: this.username,
    email: this.email,
    role: this.role
  }
})

/**
 * Get information that is going to be tokenized
 *
 * @return {Object} Object that is going to be tokenized
 */
User.virtual('token').get(function getToken() {
  return {
    _id: this._id,
    role: this.role
  }
})

/**
 * Email validation
 *
 * @param {string} email Email of a user.
 *
 * @return {boolean} Indication if the provided value is valid.
 */
User.path('email').validate(email => {
  const match = email.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)
  if (match === null) {
    return false
  }
  return true
})

export default mongoose.model('User', User)
