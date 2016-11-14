"use strict"

var gulp = require('gulp'),
  browserSync = require('browser-sync'),
  syncInstance1 = browserSync.create(),
  gulpSequence = require('run-sequence'),
  syncInstance2 = browserSync.create();

gulp.task('default', function() {
  gulpSequence('reload-browser', 'reload-jasmine');
});

gulp.task('reload-jasmine', function() {
  syncInstance1.init({
    server: {
      baseDir: '.',
      index: 'jasmine/specRunner.html'
    },
    port: 3000

  })
});
gulp.task('reload-browser', function() {
  syncInstance2.init({
    server: {
      baseDir: './public',
      index: 'index.html'
    },
    port: 3200
  })
})
gulp.watch('watch-changes', function() {
  gulp.watch(['src/inverted-index.js']).on('change', syncInstance2.reload);
})
