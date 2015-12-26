import mongoose from 'mongoose';

let ArticleSchema = new mongoose.Schema({
  title: { type: String, required: 'Title is required' },
  seoTitle: { type: String, unique: true },
//  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: 'Author is required' },
  createdDate: { type: Date, default: Date.now },
  lastUpdated: Date,
  body: String,
  comments: [{
    body: { type: String, required: 'Comment body is required' },
    author: {
      name: { type: String, required: 'Author name of the comment is required.' },
      email: { type: String, required: 'Author email of the comment is required.' }
    },
    date: Date,
    isReplyTo: { type: mongoose.Schema.Types.ObjectId }
  }],

  state: { type: String, enum: ['Draft', 'Published'], default: 'Draft'}
});

ArticleSchema.statics.findBySeoTitle = function (seoTitle, cb) {
  return this.findOne({seoTitle}, cb);
}

export default mongoose.model('Article', ArticleSchema);
