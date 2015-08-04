import gulp from 'gulp';
import inject from 'gulp-inject';
import paths from '../paths';

/**
 * Take all generated css files and inject them into the index.html
 */
gulp.task('inject', ['less'], function() {
  let target = gulp.src(paths.indexHtml);
  let sources = gulp.src(paths.css, {read: false});

  return target
    .pipe(inject(sources))
    .pipe(gulp.dest('./'))
})
