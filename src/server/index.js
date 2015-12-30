import http from 'http'
import koa from 'koa'
import mount from 'koa-mount'
import logger from 'koa-logger'
import winston from 'winston'
import {serveClient} from './serve-client'
import watchify from 'watchify'
import watchifyMiddleWare from 'koa-watchify'
import browserify from 'browserify'
import browserifyHMR from 'browserify-hmr'
import babelify from 'babelify'
import route from 'koa-route'

import apiApp from './api'

let app = koa()

app.use(logger())

// Mount API to the server
app.use(mount('/api', apiApp))


let bundle = browserify({
  entries: ['./src/client.js'],
  fullPaths: true,
  packageCache: {},
  cache: {},
  debug: true
}).transform(babelify, {sourceMaps: false}).plugin(browserifyHMR)

let watchBundle = watchify(bundle)

app.use(route.get('/static/bundle.js', watchifyMiddleWare(bundle)))

app.use(route.get('/', serveClient()))

// let options = {
//   key: fs.readFileSync(__dirname + '/dummy/localhost.key'),
//   cert: fs.readFileSync(__dirname + '/dummy/localhost.crt')
// };

http.createServer(app.callback()).listen(8000)
winston.info('Listening at 8000')
//app.listen(8000);
