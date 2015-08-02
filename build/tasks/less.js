import gulp from 'gulp';
import less from 'gulp-less';
import paths from '../paths';

// Compile less files into CSS
gulp.task('less', function() {
  return gulp.src(paths.less)
    .pipe(less())
    .pipe(gulp.dest(paths.root));
});
