import bcrypt from 'bcrypt'

/**
 * Encrypts password with bcrypt.
 *
 * @param {string} password Password to be encrypted
 *
 * @return {Promise<string, Error>} Promise resolved with encrypted password
 */
export default function encryptPassword(password) {
  return new Promise(function genPwdPromise(resolve, reject) {
    bcrypt.hash(password, 10, function hashCb(err, encrypted) {
      if (err) { reject(err) }
      resolve(encrypted)
    })
  })
}
