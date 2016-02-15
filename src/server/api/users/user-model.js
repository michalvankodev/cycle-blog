import {Schema, default as mongoose} from 'mongoose'

let User = new Schema({
  username: String,
  hashedPassword: String,
  email: {type: String, lowercase: true},
  role: {type: String, enum: ['admin', 'moderator']}
})

export default mongoose.model(User)
