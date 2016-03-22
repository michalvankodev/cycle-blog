import test from 'tape'
import co from 'co'
import app from '../index'
import supertest from 'supertest'

let request = supertest.agent(app.callback())

export function getAdminToken() {
  let requestBody = {
    username: 'michal',
    password: 'admin'
  }
  return new Promise((resolve, reject) => {
    request
    .post('/authenticate')
    .send(requestBody)
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

test('User API get single user', co.wrap(function* getSingleUserTest(t) {
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

test(
  'User API admin should be able do add new user with correct data',
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

test(
  'User API admin should not be able do add new user with incorrect data',
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

test(
  'User API admin should not be able do add new user with weak password',
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
