import gulp from 'gulp';
import paths from '../paths';
import eslint from 'gulp-eslint';

// runs jshint on all .js files
gulp.task('lint', function() {
  return gulp.src([paths.js, paths.spec])
    .pipe(eslint())
    .pipe(eslint.format());
});
