import mongoose from 'mongoose';
import config from './config';
import seed from './seed';

export default function connectDB() {
  mongoose.connect(config.mongo.uri, config.mongo.options, () => {
    console.log(`Connected to DB at: ${config.mongo.uri}`);

    if (config.seedDB) {
      console.log('Seeding DB');
      seed().then(function() {
        console.log('Completed seeding DB');
      });
    }
  });

  mongoose.connection.on('error', err => {
    console.log(err.message);
  });
}
