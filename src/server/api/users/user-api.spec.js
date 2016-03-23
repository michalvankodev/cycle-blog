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
  // TODO DELETE USER
}))
