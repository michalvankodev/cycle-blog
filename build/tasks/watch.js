import gulp from 'gulp';
import paths from '../paths';

gulp.task('watch', ['lint', 'serve'], function() {
  gulp.watch(paths.jsFiles, ['lint']);
});
