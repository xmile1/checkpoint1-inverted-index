'use strict';

var gulp = require('gulp'),
  browserSync = require('browser-sync'),
  syncInstance1 = browserSync.create(),
  gulpSequence = require('run-sequence'),
  syncInstance2 = browserSync.create(),
  bundleFiles = require('gulp-concat-multi'),
  vinylfy = require('vinyl-source-stream'),
  buffer = require('vinyl-buffer'),
  bower = require('gulp-bower'),
  babelify = require('babelify'),
  browserify = require('browserify');


// Define paths variables
var dest_path = './public/lib';
// grab libraries files from bower_components, minify and push in /public



gulp.task('default', function() {
  gulpSequence('load-test', 'load-app');


  gulp.watch(['public/js/*.js', 'public/*.html']).on('change', syncInstance2.reload);
  gulp.watch(['public/js/*.js', 'public/*.html']).on('change', syncInstance2.reload);
});


gulp.task('bundle-custom-js', function() {
  let source = browserify({ entries: ['./frontend_bundle_config.js'], transform: [babelify] });
  return source.bundle()
    .pipe(vinylfy('custom-module.js'))
    .pipe(gulp.dest('./public/js/'));
});



gulp.task('load-test', function() {
  syncInstance1.init({
    server: {
      baseDir: './jasmine',
      index: 'specRunner.html'
    },
    port: 3300,
    ui: {
      port: 3900
    }

  })
});

gulp.task('load-app', ['bundle-custom-js'], function() {
  syncInstance2.init({
    server: {
      baseDir: './public',
      index: 'index.html'
    },
    port: 3400,
    ui: {
      port: 3800
    }
  })
});
