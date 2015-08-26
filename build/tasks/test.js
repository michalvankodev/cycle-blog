import gulp from 'gulp';
import karma from 'karma';
import path from 'path';
import paths from '../paths';

/**
 * Test client front end js files (Unit tests)
 */

// Run once
gulp.task('test', function(done) {
  new karma.Server({
    configFile: path.join(__dirname, paths.karmaConf),
    singleRun: true
  }, done).start();
});

// Watch for file changes and re-run tests on each change
gulp.task('tdd', function (done) {
  new karma.Server({
    configFile: path.join(__dirname, paths.karmaConf)
  }, done).start();
});
