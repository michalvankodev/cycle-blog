import test from 'tape'
import co from 'co'
import app from '../index'
import supertest from 'supertest'

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

let request = supertest.agent(app.callback())

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
    t.error('not implemented yet')
    t.end()
    const newUser = {
      username: 'Tester',
      email: 'testing@awesome.com',
      role: 'moderator',
      password: 'trickyone'
    }
    t.comment('aspontiu')
    const token = yield getAdminToken()
    t.comment(`token je: ${token}`)
    request.post('/users/')
      .auth(null, null, true, token)
      .send(newUser)
      .expect(201)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .end((err, res) => {
        t.comment('hmm')
        if (err) {
          t.error(err, err.message)
        }
        t.comment('hlhalhahlo')
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
