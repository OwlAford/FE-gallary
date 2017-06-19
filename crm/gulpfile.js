'use strict'
const ip = require('ip')
const opn = require('opn')
const del = require('del')
const gulp = require('gulp')
const chalk = require('chalk')
const rollup = require('rollup')
const sass = require('gulp-sass')
const concat = require('gulp-concat')
const uglify = require('gulp-uglify') 
const rename = require('gulp-rename')
const connect = require('gulp-connect')
const gulpBabel = require('gulp-babel')
const minifycss = require('gulp-clean-css')
const autoprefixer = require('gulp-autoprefixer')
const rollupBabel = require('rollup-plugin-babel')
const commonjs = require('rollup-plugin-commonjs')
const resolve = require('rollup-plugin-node-resolve')


gulp.task('sass', () => 
  gulp.src('./sass/**/*.scss')
  .pipe(sass({
    outputStyle: 'expanded'
  })
  .on('error', sass.logError))
  .pipe(autoprefixer({
    browsers: ['last 2 versions'],
    cascade: false
  }))
  .pipe(gulp.dest('./css'))
  // .pipe(connect.reload())
)

gulp.task('es', () =>
  gulp.src('./es/**/*.js')
  .pipe(gulpBabel({
    presets: ['es2015']
  }))
  .pipe(gulp.dest('./js'))
)

gulp.task('rollup', () => 
  rollup.rollup({
    entry: './es/main.js',
    plugins: [
      resolve(),
      commonjs(),
      rollupBabel({
        exclude: 'node_modules/**'
      })
    ],
  })
  .then(bundle =>
    bundle.write({
      format: 'iife',
      // format: 'cjs',
      moduleName: 'main',
      dest: './js/main.js',
      sourceMap: false
    })
  )
)

gulp.task('compile', ['sass', 'es'])

gulp.task('reload', () => {
  gulp.src('./')
  .pipe(connect.reload())
})

gulp.task('sass:watch', () =>
  gulp.watch('./sass/**/*.scss', ['sass'])
)

gulp.task('es:watch', () =>
  gulp.watch('./es/**/*.js', ['es'])
)

gulp.task('file:watch', () => {
  gulp.watch(['./css/*.dev.css', './js/*.dev.js', './images/**/*', './static/**/*'], ['reload'])
})

gulp.task('minifyjs', () =>
  gulp.src(['./js/*.js', '!./js/*min.js', '!./js/*dev.js'])
  // .pipe(concat('main.js'))
  .pipe(rename({suffix: '.min'}))
  .pipe(uglify())
  .pipe(gulp.dest('./js'))
)

gulp.task('mergejs', () =>
  gulp.src(['./dist/js/*min.js'])
  .pipe(concat('core.min.js'))
  .pipe(gulp.dest('./dist/js'))
)

gulp.task('minifycss', () =>
  gulp.src(['./css/*.css', '!./css/*.min.css', '!./css/*.dev.css'])
  .pipe(rename({suffix: '.min'}))
  .pipe(minifycss())
  .pipe(gulp.dest('./css')) 
)

gulp.task('clean', () => del.sync(['./dist/**/*']))

gulp.task('minify', ['minifyjs', 'minifycss'])

gulp.task('server', () => {
  const port = 8888
  const uri = `http://${ip.address()}:${port}`
  connect.server({
    livereload: true,
    // root: 'static',
    port
  })
  console.log(chalk.green(`Server is running at ${uri}`))  
  opn(uri + '/static')
})

gulp.task('devServer', ['sass:watch', 'es:watch', 'file:watch', 'server'])

gulp.task('copycss', () => 
  gulp.src(['./css/*.min.css', './css/*.dev.css'])
  .pipe(gulp.dest('dist/css'))
)

gulp.task('copyjs', () => 
  gulp.src(['./js/*.min.js', './js/*.dev.js'])
  .pipe(gulp.dest('dist/js'))
)

gulp.task('copyimg', () => gulp.src('./images/**/*').pipe(gulp.dest('dist/images')))

gulp.task('copyhtml', () => gulp.src('./static/**/*').pipe(gulp.dest('dist/static')))

gulp.task('dist', ['copycss', 'copyjs', 'copyimg', 'copyhtml'])

gulp.task('build', ['clean', 'minify', 'dist'])