import browserify from 'browserify'
import browserifyHMR from 'browserify-hmr'
import babelify from 'babelify'
import watchify from 'watchify'
import watchifyMiddleWare from 'koa-watchify'
import config from './config'

let entry = './src/client.js'

if (!config.serverRendering) {
  entry = './src/client-restartable.js'
}

let bundle = browserify({
  entries: [entry],
  fullPaths: true,
  packageCache: {},
  cache: {},
  debug: true
}).transform(babelify, {sourceMaps: false}).plugin(browserifyHMR)

if (process.env.NODE_ENV === 'development') {
  bundle = watchify(bundle)
}

export default watchifyMiddleWare(bundle)
