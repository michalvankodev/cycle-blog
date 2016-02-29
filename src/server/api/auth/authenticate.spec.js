import test from 'tape'
import co from 'co'
import app from '../index'
import supertest from 'supertest'

let request = supertest.agent(app.callback())

test(
  'Authenticate API 404 when cant find user',
  co.wrap(function* authenticate404(t) {
    let requestBody = {
      username: 'dumbuser',
      password: 'wrong password'
    }
    request
      .post('/authenticate')
      .send(requestBody)
      .expect(404)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .end((err, res) => {
        if (err) {
          t.error(err, err.message)
        }

        t.notOk(res.body.hasOwnProperty('token'), 'No token should be sent.')
        t.notOk(res.body.success, 'API should tell you about failed request.')
        t.ok(res.body.message, 'Message about should be provided.')
        t.end()
      })
  })
)

test(
  'Authenticate API 400 with wrong password',
  co.wrap(function* authenticate400(t) {
    let requestBody = {
      username: 'michal',
      password: 'wrong password'
    }
    request
      .post('/authenticate')
      .send(requestBody)
      .expect(400)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .end((err, res) => {
        if (err) {
          t.error(err, err.message)
        }

        t.notOk(res.body.hasOwnProperty('token'), 'No token should be sent.')
        t.notOk(res.body.success, 'API should tell you about failed request.')
        t.ok(res.body.message, 'Message about should be provided.')
        t.end()
      })
  })
)

test(
  'Authenticate API 200 success with token',
  co.wrap(function* authenticate400(t) {
    let requestBody = {
      username: 'michal',
      password: 'admin'
    }
    request
      .post('/authenticate')
      .send(requestBody)
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .end((err, res) => {
        if (err) {
          t.error(err, err.message)
        }

        t.ok(res.body.hasOwnProperty('token'), 'Token should be sent.')
        t.ok(res.body.success, 'API should tell you about successful request.')
        t.ok(res.body.message, 'Message about should be provided.')
        t.end()
      })
  })
)
