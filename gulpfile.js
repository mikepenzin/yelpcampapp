var gulp = require('gulp');
var browserSync = require('browser-sync');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');

// Basic Gulp task syntax
gulp.task('hello', function() {
  console.log('Hello Zell!');
});

// Development Tasks 
// -----------------

// Start browserSync server
gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: '/'
    }
  });
});

// Watchers
gulp.task('watch', function() {
  gulp.watch('../stylesheet/**/*.scss', ['sass']);
  gulp.watch('../*.ejs', browserSync.reload);
  gulp.watch('../js/**/*.js', browserSync.reload);
});

// Optimization Tasks 
// ------------------

// Optimizing CSS and JavaScript 
gulp.task('useref', function() {

  return gulp.src('views/partials/*.ejs')
    .pipe(useref())
    .pipe(gulpIf('views/**/**/*.js', uglify()))
    .pipe(gulpIf('public/stylesheets/*.css', cssnano()))
    .pipe(gulp.dest('public/dist'));
});

// Optimizing Images 
gulp.task('images', function() {
  return gulp.src('/assets/img/**/*.+(png|jpg|jpeg|gif|svg)')
    // Caching images that ran through imagemin
    .pipe(cache(imagemin({
      interlaced: true,
    })))
    .pipe(gulp.dest('dist/images'));
});

// Copying fonts 
// gulp.task('fonts', function() {
//   return gulp.src('app/fonts/**/*')
//     .pipe(gulp.dest('dist/fonts'));
// });

// Cleaning 
gulp.task('clean', function() {
  return del.sync('dist').then(function(cb) {
    return cache.clearAll(cb);
  });
});

gulp.task('clean:dist', function() {
  return del.sync(['dist/**/*', '!dist/images', '!dist/images/**/*']);
});

// Build Sequences
// ---------------

// gulp.task('default', function(callback) {
//   runSequence(['sass', 'browserSync'], 'watch',
//     callback
//   );
// });

gulp.task('build', function(callback) {
  runSequence(
    'clean:dist',
    'sass',
    ['useref', 'images', 'fonts'],
    callback
  );
});