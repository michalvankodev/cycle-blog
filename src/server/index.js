import http from 'http'
import koa from 'koa'
import mount from 'koa-mount'
import logger from 'koa-logger'
import winston from 'winston'
import {serveClient} from './serve-client'
import route from 'koa-route'
import serveBundle from './serve-bundle'
import unless from 'koa-unless'
import favicon from 'koa-favicon'

import apiApp from './api'

let app = koa()

app.use(logger())

app.use(favicon())

// Mount API to the server
app.use(mount('/api', apiApp))

app.use(route.get('/static/bundle.js', serveBundle))

serveClient.unless = unless
app.use(serveClient.unless({path: [/^\/static/, /^\/api\//]}))

// let options = {
//   key: fs.readFileSync(__dirname + '/dummy/localhost.key'),
//   cert: fs.readFileSync(__dirname + '/dummy/localhost.crt')
// };

http.createServer(app.callback()).listen(8000)
winston.info('Listening at 8000')
//app.listen(8000);
