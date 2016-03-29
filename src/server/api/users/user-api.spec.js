import test from 'tape'
import co from 'co'
import app from '../index'
import supertest from 'supertest'
import User from './user-model'
import seed from '../seed'

let request = supertest.agent(app.callback())

export function getToken(credentials) {
  return new Promise((resolve, reject) => {
    request
    .post('/authenticate')
    .send(credentials)
    .expect(200)
    .expect('Content-Type', 'application/json; charset=utf-8')
    .end((err, res) => {
      if (err) {
        reject()
      }
      resolve(res.body.token)
    })
  })
}

export function getAdminToken() {
  let adminCredentials = {
    username: 'michal',
    password: 'admin'
  }
  return getToken(adminCredentials)
}

export function getModeratorToken() {
  let moderatorCredentials = {
    username: 'sarka',
    password: 'moderator'
  }
  return getToken(moderatorCredentials)
}

test('Users API tests', co.wrap(function* userAPITests(sub) {
  yield seed()

  sub.test('Get single user', co.wrap(function* getSingleUserTest(t) {
    const username = 'michal'
    request
      .get(`/users/${username}`)
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .end((err, res) => {
        if (err) {
          t.error(err, err.message)
        }
        t.equal(
          res.body.user.username,
          username,
          'Username should match fetched user.'
        )
        t.ok(res.body.user.email, 'User has an email.')
        t.notOk(
          res.body.user.hasOwnProperty('hashedPassword'),
          'Hashed password should not be visible.'
        )
        t.notOk(
          res.body.user.hasOwnProperty('password'),
          'Password should not be visible.'
        )
        t.end()
      })
  }))

  sub.test(
    'Get default list of users',
    co.wrap(function* getMultipleUserTest(t) {
      request
        .get(`/users/`)
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .end((err, res) => {
          if (err) {
            t.error(err, err.message)
          }
          t.equal(res.body.count, 2, 'Count property should show 2 users.')
          t.equal(res.body.results.length, 2, '2 users should be displayed.')
          t.notOk(
            res.body.results[1].hasOwnProperty('hashedPassword'),
            'Hashed password should not be visible.'
          )
          t.notOk(
            res.body.results[1].hasOwnProperty('password'),
            'Password should not be visible.'
          )
          t.end()
        })
    })
  )

  sub.test(
    'Get list of users queried by admin role',
    co.wrap(function* getAdminListUserTest(t) {
      request
        .get('/users?role=admin')
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .end((err, res) => {
          if (err) {
            t.error(err, err.message)
          }
          t.equal(res.body.count, 1, 'Count property should show 1 user.')
          t.equal(res.body.results.length, 1, '1 users should be displayed.')
          t.notOk(
            res.body.results[0].hasOwnProperty('hashedPassword'),
            'Hashed password should not be visible.'
          )
          t.notOk(
            res.body.results[0].hasOwnProperty('password'),
            'Password should not be visible.'
          )
          t.equal(
            res.body.results[0].username, 'michal', 'Correct user is shown.'
          )
          t.end()
        })
    })
  )

  sub.test(
    'Get limited list of users',
    co.wrap(function* getAdminListUserTest(t) {
      request
        .get('/users?limit=1')
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .end((err, res) => {
          if (err) {
            t.error(err, err.message)
          }
          t.equal(res.body.count, 2, 'Count property should show 2 users.')
          t.equal(res.body.results.length, 1, '1 users should be displayed.')
          t.notOk(
            res.body.results[0].hasOwnProperty('hashedPassword'),
            'Hashed password should not be visible.'
          )
          t.notOk(
            res.body.results[0].hasOwnProperty('password'),
            'Password should not be visible.'
          )
          t.equal(
            res.body.results[0].username,
            'michal',
            'User is shown because of default ordering by username'
          )
          t.end()
        })
    })
  )

  sub.test(
    'Get limited list of users ordered DESC',
    co.wrap(function* getAdminListUserTest(t) {
      request
        .get('/users?limit=1&sort=-username')
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .end((err, res) => {
          if (err) {
            t.error(err, err.message)
          }
          t.equal(res.body.count, 2, 'Count property should show 2 users.')
          t.equal(res.body.results.length, 1, '1 users should be displayed.')
          t.notOk(
            res.body.results[0].hasOwnProperty('hashedPassword'),
            'Hashed password should not be visible.'
          )
          t.notOk(
            res.body.results[0].hasOwnProperty('password'),
            'Password should not be visible.'
          )
          t.equal(
            res.body.results[0].username,
            'sarka',
            'User is shown because of default ordering is switched'
          )
          t.end()
        })
    })
  )

  sub.test(
    'Admin should be able do add new user with correct data',
    co.wrap(function* addNewUserTest(t) {
      const newUser = {
        username: 'Tester',
        email: 'testing@awesome.com',
        role: 'moderator',
        password: 'TrickyOne31'
      }
      const token = yield getAdminToken()

      request.post('/users/')
        .set('authorization', `Bearer ${token}`)
        .send(newUser)
        .expect(201)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .end((err, res) => {
          if (err) {
            t.error(err, err.message)
            t.end()
          }
          t.ok(res.body.success, 'Should indicate successful request')
          t.ok(res.body.message, 'Message with indication should be visible')
          t.equal(
            res.body.user.username,
            'Tester',
            'Correct user details should be sent back'
          )
          t.notOk(res.body.user.password, 'Password should not be visible')
          t.notOk(
            res.body.user.hashedPassword,
            'Hashed password should not be visible'
          )
          t.end()
        })
    })
  )

  sub.test(
    'Admin should not be able do add new user with incorrect data',
    co.wrap(function* addNewWrongUserTest(t) {
      const incorrectUserData = {
        username: 'GoodTester',
        email: 'testinsome.com', // wrong email
        role: 'moderator',
        password: 'TrickyOne31'
      }
      const token = yield getAdminToken()

      request.post('/users/')
        .set('authorization', `Bearer ${token}`)
        .send(incorrectUserData)
        .expect(400)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .end((err, res) => {
          if (err) {
            t.error(err, err.message)
            t.end()
          }
          t.notOk(res.body.success, 'Should indicate unsuccessful request')
          t.ok(res.body.message, 'Message with indication should be visible')
          t.end()
        })
    })
  )

  sub.test(
    'Admin should not be able do add new user with weak password',
    co.wrap(function* addNewWrongUserTest(t) {
      const userDataWithWeakPassword = {
        username: 'GoodTester',
        email: 'testing@awesome.com',
        role: 'moderator',
        password: 'weakpassword'
      }
      const token = yield getAdminToken()

      request.post('/users/')
        .set('authorization', `Bearer ${token}`)
        .send(userDataWithWeakPassword)
        .expect(400)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .end((err, res) => {
          if (err) {
            t.error(err, err.message)
            t.end()
          }
          t.notOk(res.body.success, 'Should indicate unsuccessful request')
          t.ok(res.body.message, 'Message with indication should be visible')
          t.end()
        })
    })
  )

  sub.test(
    'Admin should be able to modify existing user',
    co.wrap(function* updateUserTest(t) {
      const updatedUser = {
        username: 'sarka',
        email: 'newemail@awesome.com',
        role: 'moderator'
      }
      const token = yield getAdminToken()
      const user = yield User.findByUsername('sarka')

      request.put(`/users/${user.id}`)
        .set('authorization', `Bearer ${token}`)
        .send(updatedUser)
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .end((err, res) => {
          if (err) {
            t.error(err, err.message)
            t.end()
          }
          t.ok(res.body.success, 'Should indicate successful request')
          t.ok(res.body.message, 'Message with indication should be visible')
          t.equal(
            res.body.user.username,
            'sarka',
            'Shoud return same user back'
          )
          t.equal(
            res.body.user.email,
            'newemail@awesome.com',
            'Shoud return same updated user back'
          )
          t.end()
        })
    })
  )

  sub.test(
    'User should be able to modify himself',
    co.wrap(function* updateSelfTest(t) {
      const updatedUser = {
        username: 'sarka',
        email: 'newemail@awesome.com',
        role: 'moderator'
      }
      const token = yield getModeratorToken()
      const user = yield User.findByUsername('sarka')

      request.put(`/users/${user.id}`)
        .set('authorization', `Bearer ${token}`)
        .send(updatedUser)
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .end((err, res) => {
          if (err) {
            t.error(err, err.message)
            t.end()
          }
          t.ok(res.body.success, 'Should indicate successful request')
          t.ok(res.body.message, 'Message with indication should be visible')
          t.equal(
            res.body.user.username,
            'sarka',
            'Shoud return same user back'
          )
          t.equal(
            res.body.user.email,
            'newemail@awesome.com',
            'Shoud return same updated user back'
          )
          t.end()
        })
    })
  )

  sub.test(
    'Moderator should not be able to modify other users',
    co.wrap(function* updateOtherUserTest(t) {
      const updatedUser = {
        username: 'michal',
        email: 'newemail@awesome.com'
      }
      const token = yield getModeratorToken()
      const user = yield User.findByUsername('michal')

      request.put(`/users/${user.id}`)
        .set('authorization', `Bearer ${token}`)
        .send(updatedUser)
        .expect(403)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .end((err, res) => {
          if (err) {
            t.error(err, err.message)
            t.end()
          }
          t.notOk(res.body.success, 'Should indicate unsuccessful request')
          t.ok(res.body.message, 'Message with indication should be visible')
          t.end()
        })
    })
  )

  sub.test(
    'Moderator should not be able to delete other users',
    co.wrap(function* deleteUserByModTest(t) {
      const token = yield getModeratorToken()
      const user = yield User.findByUsername('michal')

      request.delete(`/users/${user.id}`)
        .set('authorization', `Bearer ${token}`)
        .expect(403)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .end((err, res) => {
          if (err) {
            t.error(err, err.message)
            t.end()
          }
          t.notOk(res.body.success, 'Should indicate unsuccessful request')
          t.ok(res.body.message, 'Message with indication should be visible')
          t.end()
        })
    })
  )

  sub.test(
    'Admin should be able to delete other users',
    co.wrap(function* deleteUserByAdminTest(t) {
      const token = yield getAdminToken()
      const user = yield User.findByUsername('sarka')

      request.delete(`/users/${user.id}`)
        .set('authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .end((err, res) => {
          if (err) {
            t.error(err, err.message)
            t.end()
          }
          t.ok(res.body.success, 'Should indicate successful request')
          t.ok(res.body.message, 'Message with indication should be visible')
          t.end()
        })
    })
  )

  sub.test(
    'User should be able to change his password',
    co.wrap(function* userChangePassword(t) {
      const token = yield getModeratorToken()
      const user = yield User.findByUsername('sarka')
      const passwords = {
        oldPassword: 'moderator',
        newPassword: 'HardToDigest123'
      }
      request.put(`/users/${user.id}/password`)
        .set('authorization', `Bearer ${token}`)
        .send(passwords)
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .end((err, res) => {
          if (err) {
            t.error(err, err.message)
            t.end()
          }
          t.ok(res.body.success, 'Should indicate successful request')
          t.ok(res.body.message, 'Message with indication should be visible')
          t.end()
        })
    })
  )

  sub.test(
    'User should not be able to change to a weak password',
    co.wrap(function* userChangeWeakPassword(t) {
      yield seed()
      const token = yield getModeratorToken()
      const user = yield User.findByUsername('sarka')
      const passwords = {
        oldPassword: 'moderator',
        newPassword: 'weakone'
      }
      request.put(`/users/${user.id}/password`)
        .set('authorization', `Bearer ${token}`)
        .send(passwords)
        .expect(400)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .end((err, res) => {
          if (err) {
            t.error(err, err.message)
            t.end()
          }
          t.notOk(res.body.success, 'Should indicate successful request')
          t.ok(res.body.message, 'Message with indication should be visible')
          t.end()
        })
    })
  )

  sub.test(
    'User should not be able to change his password if wrong old pwd is provided',
    co.wrap(function* userChangeWeakPassword(t) {
      yield seed()
      const token = yield getModeratorToken()
      const user = yield User.findByUsername('sarka')
      const passwords = {
        oldPassword: 'wrong',
        newPassword: 'GoodEnough12'
      }
      request.put(`/users/${user.id}/password`)
        .set('authorization', `Bearer ${token}`)
        .send(passwords)
        .expect(400)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .end((err, res) => {
          if (err) {
            t.error(err, err.message)
            t.end()
          }
          t.notOk(res.body.success, 'Should indicate successful request')
          t.ok(res.body.message, 'Message with indication should be visible')
          t.end()
        })
    })
  )

  sub.test(
    'Admin should be able to change others password without knowing old pwd',
    co.wrap(function* userChangeWeakPassword(t) {
      yield seed()
      const token = yield getAdminToken()
      const user = yield User.findByUsername('sarka')
      const passwords = {
        newPassword: 'GoodEnough12'
      }
      request.put(`/users/${user.id}/password`)
        .set('authorization', `Bearer ${token}`)
        .send(passwords)
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .end((err, res) => {
          if (err) {
            t.error(err, err.message)
            t.end()
          }
          t.ok(res.body.success, 'Should indicate successful request')
          t.ok(res.body.message, 'Message with indication should be visible')
          t.end()
        })
    })
  )

  sub.test(
    'Admin should not be able to change others password to a weak pwd',
    co.wrap(function* userChangeWeakPassword(t) {
      yield seed()
      const token = yield getAdminToken()
      const user = yield User.findByUsername('sarka')
      const passwords = {
        newPassword: 'weakagain'
      }
      request.put(`/users/${user.id}/password`)
        .set('authorization', `Bearer ${token}`)
        .send(passwords)
        .expect(400)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .end((err, res) => {
          if (err) {
            t.error(err, err.message)
            t.end()
          }
          t.notOk(res.body.success, 'Should indicate successful request')
          t.ok(res.body.message, 'Message with indication should be visible')
          t.end()
        })
    })
  )

  sub.test(
    'User is not able to change others password.',
    co.wrap(function* userChangeWeakPassword(t) {
      yield seed()
      const token = yield getModeratorToken()
      const user = yield User.findByUsername('michal')
      const passwords = {
        newPassword: 'DoesntMatter'
      }
      request.put(`/users/${user.id}/password`)
        .set('authorization', `Bearer ${token}`)
        .send(passwords)
        .expect(403)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .end((err, res) => {
          if (err) {
            t.error(err, err.message)
            t.end()
          }
          t.notOk(res.body.success, 'Should indicate successful request')
          t.ok(res.body.message, 'Message with indication should be visible')
          t.end()
        })
    })
  )

  sub.end()
}))
