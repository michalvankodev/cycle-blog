import mongoose from 'mongoose'
import config from './config'
import seed from './seed'
import winston from 'winston'

export default function connectDB() {
  mongoose.connect(config.mongo.uri, config.mongo.options, () => {
    winston.log(`Connected to DB at: ${config.mongo.uri}`)

    if (config.seedDB) {
      winston.log('Seeding DB')
      seed().then(function completed() {
        winston.log('Completed seeding DB')
      })
    }
  })

  mongoose.connection.on('error', err => {
    winston.log(err.message)
  })
}
