import mongoose from 'mongoose'
import config from './config'
import seed from './seed'
import winston from 'winston'

export default function connectDB() {
  winston.info(`Trying to connect to DB: ${config.mongo.uri}`)
  mongoose.connect(config.mongo.uri, config.mongo.options)

  mongoose.connection.once('open', () => {
    winston.info(`Connected to DB at: ${config.mongo.uri}`)

    if (config.seedDB) {
      winston.info('Seeding DB')
      seed().then(function completed() {
        winston.info('Completed seeding DB')
      })
    }
  })

  mongoose.connection.on('error', err => {
    winston.error(err.message)
  })
}
