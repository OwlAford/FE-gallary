'use strict'
const del = require('del')
const gulp = require('gulp')
const sass = require('gulp-sass')
const concat = require('gulp-concat') 
const uglify = require('gulp-uglify') 
const rename = require('gulp-rename')
const minifycss = require('gulp-clean-css')

gulp.task('sass', () => 
  gulp.src('./sass/**/*.scss')
  .pipe(sass({
    // outputStyle: 'compressed'
    outputStyle: 'expanded'
  })
  .on('error', sass.logError))
  .pipe(gulp.dest('./css'))
)

gulp.task('sass:watch', () =>
  gulp.watch('./sass/**/*.scss', ['sass'])
)

gulp.task('minifyjs', () =>
  gulp.src('./js/*.js')
  // .pipe(concat('main.js'))
  .pipe(rename({suffix: '.min'}))
  .pipe(uglify())
  .pipe(gulp.dest('./js'))
)

gulp.task('minifycss', () =>  
  gulp.src('./css/*.css')
  .pipe(rename({suffix: '.min'}))
  .pipe(minifycss())
  .pipe(gulp.dest('./css')) 
)

gulp.task('clean', cb => 
  del(['css/*.min.css', 'js/*.min.js'], cb)
)

gulp.task('minify', ['clean', 'minifyjs', 'minifycss'])