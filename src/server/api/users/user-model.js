import {Schema, default as mongoose} from 'mongoose'
import bcrypt from 'bcrypt'

let User = new Schema({
  username: String,
  hashedPassword: String,
  email: {type: String, lowercase: true},
  role: {type: String, enum: ['admin', 'moderator']}
})

/**
 * Encrypts password with bcrypt.
 *
 * @param {string} password Password to be encrypted
 *
 * @return {Promise<string, Error>} Promise resolved with encrypted password
 */
User.methods.encryptPassword = function generatePassword(password) {
  return new Promise(function genPwdPromise(resolve, reject) {
    bcrypt.hash(password, 10, function hashCb(err, encrypted) {
      if (err) { reject(err) }
      resolve(encrypted)
    })
  })
}

/**
 * Validates if the enteredPwd is the same as stored hashedPassword.
 *
 * @param {string} enteredPwd Password to be validated
 *
 * @return {Promise<boolean, Error} Promise resolved with true if
 *  passwords match
 */
User.methods.validatePassword = function authenticateUser(enteredPwd) {
  return new Promise(function authPromise(resolve, reject) {
    bcrypt.compare(
      enteredPwd,
      this.hashedPassword,
      function compareCb(err, same) {
        if (err) { reject(err) }
        resolve(same)
      }
    )
  })
}

User.statics.findByUsername = function findByUsername(username, cb) {
  return this.findOne({username}, cb)
}

User.virtual('profile').get(function getUserProfile() {
  return {
    username: this.username,
    email: this.email,
    role: this.role
  }
})

export default mongoose.model('User', User)
