import browserify from 'browserify'
import browserifyHMR from 'browserify-hmr'
import babelify from 'babelify'
import watchify from 'watchify'
import watchifyMiddleWare from 'koa-watchify'

let bundle = browserify({
  entries: ['./src/client.js'],
  fullPaths: true,
  packageCache: {},
  cache: {},
  debug: true
}).transform(babelify, {sourceMaps: false}).plugin(browserifyHMR)

if (process.env.NODE_ENV === 'development') {
  bundle = watchify(bundle)
}

export default watchifyMiddleWare(bundle)
