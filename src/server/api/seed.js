import co from 'co';
import Article from './articles/articles-model';

let seedArticle1 = {
  title: 'Testing Article 1',
  seoTitle: 'testing-article',
//  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: 'Author is required' },
  createdDate:  new Date(2000, 5, 1, 15, 30, 0),
  lastUpdated: new Date(2000, 5, 1, 20, 45, 0),
  body: '<p>This is a testing article</p>',
  state: 'Published'
};

let seedArticleComment1 = {
  body: 'A nice first comment.',
  author: {
    name: 'Testing machine',
    email: 'testing.machine@awesome.net'
  },
  date: new Date(2002, 5, 5, 19, 25, 0)
};

let seedArticleComment2 = {
  body: 'A reply to first comment.',
  author: {
    name: 'Admin',
    email: 'admin@testthat.com'
  },
  date: new Date(2002, 5, 5, 22, 33, 0)
};

let seedArticleComment3 = {
  body: 'Third comment.',
  author: {
    name: 'Automated machine',
    email: 'automated.machine@awesome.net'
  },
  date: new Date(2003, 4, 4, 14, 25, 0)
};

let seedArticle2 = {
  title: 'Testing Article 2',
  seoTitle: 'testing-article-two',
//  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: 'Author is required' },
  createdDate:  new Date(2009, 5, 1, 15, 30, 0),
  lastUpdated: new Date(2009, 5, 1, 20, 45, 0),
  body: '<p>This is a second testing article with comments</p>',
  state: 'Published'
};

let seedArticle3 = {
  title: 'Draft Article',
  seoTitle: 'just-draft-article',
//  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: 'Author is required' },
  createdDate:  new Date(2009, 1, 1, 15, 30, 0),
  lastUpdated: new Date(2009, 1, 1, 20, 45, 0),
  body: '<p>This is a testing draft article</p>',
  state: 'Draft'
};

export default co.wrap(function* seed() {
  yield Article.remove();
  yield Article.create(seedArticle1, seedArticle2, seedArticle3);
  let secondArticle = yield Article.findBySeoTitle('testing-article-two');
  secondArticle.comments.push(seedArticleComment1);
  let firstComment = secondArticle.comments[0];
  seedArticleComment2.isReplyTo = firstComment._id;
  secondArticle.comments.push(seedArticleComment2);
  secondArticle.comments.push(seedArticleComment3);
  yield secondArticle.save();

});
