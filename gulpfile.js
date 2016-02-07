'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var nodemon = require('gulp-nodemon');
var browserify = require('gulp-browserify');
var livereload = require('gulp-livereload');

var inWatch = false;

gulp.task('start', function () {
    nodemon({
        script: 'server/bin/www',
        ext: 'js html',
        env: { 'NODE_ENV': 'development' },
        debug: true,
        watch:"./server"
    });
});

gulp.task('sass', function () {
    gulp.src('client/stylesheets/**/*.scss')
      .pipe(sass.sync())
      .on('error', error)
      .pipe(gulp.dest('public/stylesheets'))
});

gulp.task('html', function(){
    gulp.src('client/**/*.html')
      .on('error', error)
      .pipe(gulp.dest('public'))
});

gulp.task('staticAssets', function(){
    gulp.src('client/images/**/*')
      .on('error', error)
      .pipe(gulp.dest('public/images'))
});

gulp.task('scripts', function() {
    gulp.src('client/javascripts/main.js')
      .pipe(browserify({
          debug: true
      }))
      .on('error', error)
      .pipe(gulp.dest('public/javascripts/'))
});


gulp.task('sass:watch', ['sass'], function () {
  inWatch = true;
  gulp.watch('client/stylesheets/**/*.scss', ['sass'])
});

gulp.task('html:watch', ['html'], function () {
  inWatch = true;
  gulp.watch('client/**/*.html', ['html']);
});

gulp.task('staticAssets:watch', ['staticAssets'], function () {
  inWatch = true;
  gulp.watch('client/images/**/*', ['staticAssets']);
});

gulp.task('scripts:watch', ['scripts'], function () {
    inWatch = true;
    gulp.watch('client/**/*.js', ['scripts']);
});

gulp.task('default', ['sass:watch', 'scripts:watch', 'html:watch', 'staticAssets:watch', 'start']);

function error(e){
    if (inWatch) {
        console.log(e.message, e.stack);
    } else {
        throw e;
    }
}