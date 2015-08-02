import gulp from 'gulp';
import browserify from 'browserify';
import babelify from 'babelify';
import watchify from 'watchify';
import paths from '../paths';
import gutil from 'gulp-util';
import sourcemaps from 'gulp-sourcemaps';
import source  from 'vinyl-source-stream';
import buffer  from 'vinyl-buffer';

export let b = browserify({
  entries: paths.entries,
  debug: true,
  cache: {}, packageCache: {} // needed by watchify
}).transform(babelify.configure({
  stage: 1
}));

export let w = watchify(b);

export function bundle() {
  w.bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('bundle.js'))
    // optional, remove if you don't need to buffer file contents
    .pipe(buffer())
    // optional, remove if you dont want sourcemaps
    .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
       // Add transformation tasks to the pipeline here.
    .pipe(sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest(paths.generated));
}

gulp.task('browserify', bundle);
