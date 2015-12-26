import http from 'http'
import koa from 'koa'
import mount from 'koa-mount'
import logger from 'koa-logger'
import winston from 'winston'
import {serveClient} from './serve-client'

import apiApp from './api'

let app = koa()

app.use(logger())

// Mount API to the server
app.use(mount('/api', apiApp))

app.use(serveClient())
// let options = {
//   key: fs.readFileSync(__dirname + '/dummy/localhost.key'),
//   cert: fs.readFileSync(__dirname + '/dummy/localhost.crt')
// };

http.createServer(app.callback()).listen(8000)
winston.info('Listening at 8000')
//app.listen(8000);
