const gulp = require('gulp');
const browserSync = require('browser-sync');
const gulpSequence = require('run-sequence');
const bundleFiles = require('gulp-concat-multi');
const vinylfy = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const bower = require('gulp-bower');
const babel = require('gulp-babel');
const babelify = require('babelify');
const browserify = require('browserify');
const nodeJasmine = require('gulp-jasmine-node');
const rename = require('gulp-rename');
const webpack = require('gulp-webpack');
const bowerSrc = require('gulp-bower-src');

let bSyncInstanceApp = browserSync.create();
let bSyncInstanceTest = browserSync.create();

gulp.task('default', () => {
  gulpSequence('load-app', 'load-test', 'watcher');

});

gulp.task('load-app', () => {
  bSyncInstanceApp.init({
    server: {
      baseDir: './public',
      index: 'index.html'
    },
    port: process.env.PORT || 3400,
    open: false,
    ui: {
      port: process.env.PORT || 3800
    }
  });
});

gulp.task('load-test', () => {
  bSyncInstanceTest.init({
    server: {
      baseDir: './jasmine',
      index: 'specRunner.html'
    },
    open: false,
    port: process.env.PORT || 3300,
    ui: {
      port: process.env.PORT || 3900
    }

  });
});

gulp.task('transformAppEs5', () => {
  gulp.src('./src/inverted-index.js')
    .pipe(babel({presets: ['es2015']}))
    .pipe(gulp.dest('./public/js'));

});

gulp.task('transformTestEs5', ['bundleAppSpec'], () => {
  var b = browserify();
  b.add('./jasmine/spec/inverted-index-test.js');
  b.bundle()
    .pipe(vinylfy('inverted-index-test-es5.js'))
    .pipe(gulp.dest('./jasmine/spec'));
});

gulp.task('reloadTest', ['transformTestEs5', 'bundleAppSpec'], () => {
  bSyncInstanceTest.reload();
});


gulp.task('reloadApp', ['transformAppEs5'], () => {
  bSyncInstanceApp.reload();
});

gulp.task('bundleAppSpec', () => gulp.src('./src/inverted-index.js')
  .pipe(babel({presets: ['es2015']}))
  .pipe(rename('inverted-index-es5.js'))
  .pipe(gulp.dest('./jasmine/spec'))
);

gulp.task('bundleBower', () => {
  gulp.src(['bower_lib/**'])
    .pipe(gulp.dest('public/lib'));
});


gulp.task('watcher', () => {
  gulp.watch(['jasmine/spec/inverted-index-test.js', 'src/*.js', 'public/index.html', 'public/js/script.js'], ['reloadApp', 'reloadTest']);
  gulp.watch(['bower.json'], ['bundleBower']);
});


gulp.task('webpack', function() {
  return gulp.src('webpack.js')
    .pipe(webpack(require('./webpack.config.js')));
// .pipe(rename({basename: 'app'}))
// .pipe(gulp.dest('public/'));
});


gulp.task('bundle-app', function() {
  return gulp.src('./src/inverted-index.js')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(rename({basename: 'app'}))
    .pipe(gulp.dest('./public/'));
});
