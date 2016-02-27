import test from 'tape'
import co from 'co'
import app from '../index'
import supertest from 'supertest'

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
        'Passwod should not be visible.'
      )

      t.end()
    })
}))
