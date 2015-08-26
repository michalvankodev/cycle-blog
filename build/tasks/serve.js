import gulp from 'gulp';
import gutil from 'gulp-util';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import config from './../../webpack.config.js';

let devServerConfig = {
  publicPath: config.output.publicPath,
  // webpack HMR can't work with lazy mode yet
  lazy: false,
  filename: config.output.filename,
  hot: true,
  historyApiFallback: true,
  stats: { colors: true },
  quiet: true
};

gulp.task('serve', function(done) {
  new WebpackDevServer(webpack(config), devServerConfig)
    .listen(9000, 'localhost', function(err, result) {
      if (err) {
        throw new gutil.PluginError('webpack-dev-server', err);
      }
      gutil.log('Listening at localhost:9000');
      done();
    });
});
