"use strict";

var gulp = require('gulp'),
  browserSync = require('browser-sync'),
  syncInstance1 = browserSync.create(),
  gulpSequence = require('run-sequence'),
  syncInstance2 = browserSync.create(),
  bundleFiles = require('gulp-concat-multi');


// Define paths variables
var dest_path = './public/lib';
// grab libraries files from bower_components, minify and push in /public



gulp.task('default', function() {
  gulpSequence('bundlejs', 'load-test', 'load-app');
  gulp.watch(['public/js/*.js', 'public/*.html']).on('change', syncInstance2.reload);
  gulp.watch(['bower.json']).on('change', ['bundlejs']);
});

gulp.task('bundlejs', function() {
  bundleFiles({
      'vendor.js': ['./bower_lib/**/*.js', './bower_lib/**/dist/*.js', './bower_lib/**/js/*.js', './bower_lib/**/dist/**/*.js'],
      'vendor.css': ['./bower_lib/**/*.css', './bower_lib/**/dist/*.css', './bower_lib/**/css/*.css', './bower_lib/**/dist/**/*.css']
    })
    .pipe(gulp.dest('public/lib'));
});




gulp.task('load-test', function() {
  syncInstance1.init({
    server: {
      baseDir: './',
      index: 'jasmine/specRunner.html'
    },
    port: 3300,
    ui: {
      port: 3900
    }

  })
});
gulp.task('load-app', function() {
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
