'use strict'
 
const gulp = require('gulp')
const sass = require('gulp-sass')
const minifycss = require('gulp-minify-css')
const concat = require('gulp-concat') 
const uglify = require('gulp-uglify') 
const rename = require('gulp-rename')
const del = require('del')

gulp.task('sass', () => 
  gulp.src('./sass/**/*.scss')
  .pipe(sass({
    outputStyle: 'compressed'
  })
  .on('error', sass.logError))
  .pipe(gulp.dest('./css'))
)
 
gulp.task('sass:watch', () => {
  gulp.watch('./sass/**/*.scss', ['sass'])
})

gulp.task('minifyjs', () => {  
  gulp.src('./js/*.js')
  // .pipe(concat('main.js'))
  .pipe(rename({suffix: '.min'}))
  .pipe(uglify())
  .pipe(gulp.dest('./js'))
})

gulp.task('minifycss', () =>  
  gulp.src('./css/*.css')
  .pipe(rename({suffix: '.min'}))
  .pipe(minifycss())
  .pipe(gulp.dest('./css')) 
)

gulp.task('clean', cb => del(['css/*.min.css', 'js/*.min.js'], cb))

gulp.task('minify', ['clean', 'minifyjs', 'minifycss'])