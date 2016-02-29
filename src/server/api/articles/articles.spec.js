import test from 'tape'
import co from 'co'
import app from '../index'
import supertest from 'supertest'

let request = supertest.agent(app.callback())

test('Articles API lists all articles', co.wrap(function* listAllTest(t) {
  request
    .get('/articles')
    .expect(200)
    .expect('Content-Type', 'application/json; charset=utf-8')
    .end((err, res) => {
      if (err) {
        t.error(err, err.message)
      }

      t.equal(res.body.results.length, 3, 'Should fetch 3 articles')
      t.pass('Successfully fetched all articles')
      t.end()
    })
}))

test('Articles API retrieves article', co.wrap(function* getArticleTest(t) {
  t.plan(2)
  request
    .get('/articles/testing-article')
    .expect(200)
    .expect('Content-Type', 'application/json; charset=utf-8')
    .end((err, res) => {
      if (err) {
        t.error(err, err.message)
      }
      let article = res.body

      t.equal(
        article.seoTitle,
        'testing-article',
        'Seo title should match title in url'
      )
      t.equal(
        article.body,
        '<p>This is a testing article</p>',
        'Article body should be present'
      )
      t.end()
    })
}))
