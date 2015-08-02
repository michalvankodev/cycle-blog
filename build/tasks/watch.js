import gulp from 'gulp';
import paths from '../paths';
import browserSync from 'browser-sync';
import {w, bundle} from './bundle';
import gutil from 'gulp-util';

function reloadFile(event) {
  browserSync.reload(event.path);
  gutil.log('Reloading ' + event.path + ', it was ' + event.type);
}

/**
 * This task will watch for changes
 * to js, html, and less files and call the
 * reportChange method. Also, by depending on the
 * serve task, it will instantiate a browserSync session
 */
gulp.task('watch', ['lint', 'serve'], function() {
  w.on('update', bundle);
  gulp.watch(paths.jsBundle).on('change', reloadFile);
  gulp.watch(paths.html, browserSync.reload)
  gulp.watch(paths.indexHtml, browserSync.reload)
  gulp.watch(paths.less, ['less']).on('change', reloadFile);
});
