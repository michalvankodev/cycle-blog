import co from 'co'
import Article from './articles/articles-model'
import User from './users/user-model'
import encryptPassword from './users/encrypt-password'

let adminInfo = {
  username: 'michal',
  password: 'admin',
  email: 'mklakakilli@gmail.com',
  role: 'admin'
}

let moderatorInfo = {
  username: 'sarka',
  password: 'moderator',
  email: 'no@email.com',
  role: 'moderator'
}

let seedArticle1 = {
  title: 'Testing Article 1',
  seoTitle: 'testing-article',
  createdDate: new Date(2000, 5, 1, 15, 30, 0),
  lastUpdated: new Date(2000, 5, 1, 20, 45, 0),
  body: '<p>This is a testing article</p>',
  state: 'Published'
}

let seedArticleComment1 = {
  body: 'A nice first comment.',
  author: {
    name: 'Testing machine',
    email: 'testing.machine@awesome.net'
  },
  date: new Date(2002, 5, 5, 19, 25, 0)
}

let seedArticleComment2 = {
  body: 'A reply to first comment.',
  author: {
    name: 'Admin',
    email: 'admin@testthat.com'
  },
  date: new Date(2002, 5, 5, 22, 33, 0)
}

let seedArticleComment3 = {
  body: 'Third comment.',
  author: {
    name: 'Automated machine',
    email: 'automated.machine@awesome.net'
  },
  date: new Date(2003, 4, 4, 14, 25, 0)
}

let seedArticle2 = {
  title: 'Testing Article 2',
  seoTitle: 'testing-article-two',
  createdDate: new Date(2009, 5, 1, 15, 30, 0),
  lastUpdated: new Date(2009, 5, 1, 20, 45, 0),
  body: '<p>This is a second testing article with comments</p>',
  state: 'Published'
}

let seedArticle3 = {
  title: 'Draft Article',
  seoTitle: 'just-draft-article',
  createdDate: new Date(2009, 1, 1, 15, 30, 0),
  lastUpdated: new Date(2009, 1, 1, 20, 45, 0),
  body: '<p>This is a testing draft article</p>',
  state: 'Draft'
}

export default co.wrap(function* seed() {
  // remove all users
  yield User.remove()
  // create admin and save his password
  let admin = new User(adminInfo)
  admin.hashedPassword = yield encryptPassword(adminInfo.password)
  yield admin.save()
  let moderator = new User(moderatorInfo)
  moderator.hashedPassword = yield encryptPassword(moderatorInfo.password)
  yield moderator.save()

  seedArticle1.author = admin._id
  seedArticle2.author = admin._id
  seedArticle3.author = admin._id

  yield Article.remove()
  yield Article.create(seedArticle1, seedArticle2, seedArticle3)
  let secondArticle = yield Article.findBySeoTitle('testing-article-two')
  secondArticle.comments.push(seedArticleComment1)
  let firstComment = secondArticle.comments[0]
  seedArticleComment2.isReplyTo = firstComment._id
  secondArticle.comments.push(seedArticleComment2)
  secondArticle.comments.push(seedArticleComment3)
  yield secondArticle.save()
})
