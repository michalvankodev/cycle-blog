import User from './user-model'
// TODO Get User
/**
 * Get a single user by quering his username
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
  } else {
    this.status = 404
  }
  yield next
}


// TODO Update User
// TODO Update Password
// TODO Get Multiple users
// TODO Create New User
