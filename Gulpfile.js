'use strict'

const gulp = require('gulp')
const concat = require('gulp-concat')
const terser = require('gulp-terser')
const eslint = require('gulp-eslint-new')
const fancyLog = require('fancy-log')
const colors = require('ansi-colors')
const inject = require('gulp-inject')
const del = require('del')
const randomstring = require('randomstring')
const ngHtml2Js = require('gulp-ng-html2js');


// javascripts -----------------------------
var js_libs = [
  './panel/libs/js/jquery-3.1.1.min.js',
  './panel/libs/js/lodash.min.js',
  './panel/libs/js/moment.min.js',
  './panel/libs/js/socket.io.min.js',
  // angular libs
  './panel/libs/js/angular.min.js',
  './panel/libs/js/angular-animate.min.js',
  './panel/libs/js/angular-duration-format.js',
  './panel/libs/js/angular-google-maps.js',
  './panel/libs/js/angular-moment.min.js',
  './panel/libs/js/angular-route.min.js',
  './panel/libs/js/angular-simple-logger.js',
  './panel/libs/js/angular-socket.min.js',
  './panel/libs/js/angular-toastr.tpls.min.js',
  './panel/libs/js/angular-touch.min.js',
  './panel/libs/js/angular-ui-router.min.js',
  './panel/libs/js/http-auth-interceptor.min.js',
  './panel/libs/js/ui-bootstrap-2.5.0.min.js',
  './panel/libs/js/ui-bootstrap-tpls-2.5.0.min.js',
  './panel/libs/js/angular-loading-bar.min.js',
]

var app_js = [
  './panel/app.js',
  './panel/routes.js',
  './panel/controllers/**/*.js',
  './panel/directives/**/*.js',
  './panel/services/**/*.js',
  './panel/filters/**/*.js',
]

var copy_files = [
  './panel/index.html'
]

function clean() {
  return del(['./dist']);
}

function lint() {
  return gulp.src(app_js, { since: gulp.lastRun(lint) })
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
}

function jsBuild() {
  var filename = 'application-' + randomstring.generate() + '.js';
  var stream = gulp.src(js_libs.concat(app_js))
    .pipe(concat(filename))

  if (process.env.NODE_ENV === 'production') {
    stream = stream
      .pipe(terser())
      .on('error', function (err) { fancyLog(colors.red('[Error]'), err.toString()); })
  }

  return stream.pipe(gulp.dest('./dist/js'))
}

// ------------ CSS -----------------------------

var css_libs = [
  './panel/libs/css/bootstrap.min.css',
  './panel/libs/css/angular-toastr.min.css',
  './panel/libs/css/angular-loading-bar.min.css',
]

var app_css = [
  './panel/css/**/*.css',
]

function cssBuild() {
  var filename = 'application-' + randomstring.generate() + '.css';
  return gulp.src(css_libs.concat(app_css))
    .pipe(concat(filename))
    .pipe(gulp.dest('./dist/css'))
}

function copy() {
  return gulp.src(copy_files)
    .pipe(gulp.dest('./dist'))
}

function templates() {
  return gulp.src('./panel/views/**/*.html')
    .pipe(ngHtml2Js({
      moduleName: 'templates',
      prefix: 'views/',
      standalone: true
    })).pipe(concat('templates.js'))
    .pipe(gulp.dest('./dist/js/'));
}

function injectTask() {
  var target = gulp.src('./dist/index.html');
  var sources = gulp.src(['./dist/**/*.js', './dist/**/*.css'], { read: false });

  return target.pipe(inject(sources, {
    ignorePath: 'dist'
  })).pipe(gulp.dest('./dist'))
}

// ------------- BUILD ----------------------------

const build = gulp.series(
  clean,
  gulp.parallel(lint, jsBuild, cssBuild, templates, copy),
  injectTask
);

function watch() {
  gulp.watch('panel/**/*', build);
}

exports.default = build;
exports.watch = watch;
