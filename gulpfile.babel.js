// all gulp tasks are located in the ./build/tasks directory
// gulp configuration is in files in ./build directory
import gulp from 'gulp';
import requireDir from 'require-dir';

requireDir('build/tasks');

/**
 * Run server and watch on save for changes.
 *
 * Test after every save
 */
gulp.task('default', ['watch', 'tdd']);
