'use strict';

import gulp from 'gulp';
import browserSync from 'browser-sync';
import handlebars from 'gulp-compile-handlebars';
import rename from 'gulp-rename';
import sass from 'gulp-sass';
import imagemin from 'gulp-imagemin';

const dirs = {
  src: 'src',
  dest: 'dist',
};

//run server
gulp.task('serve', ['vendor', 'sass', 'img', 'templates'], function() {
  browserSync.init({
    server: `${dirs.dest}`
  });
});

//place dependancies from node modules into vendor folder
gulp.task('vendor', function() {
  gulp.src('node_modules/bootstrap/dist/**/*')
    .pipe(gulp.dest(`${dirs.dest}/vendor/bootstrap`));

  gulp.src('node_modules/jquery/dist/jquery.js')
    .pipe(gulp.dest(`${dirs.dest}/vendor/jquery`));

  gulp.src([
    'node_modules/font-awesome/**',
    '!node_modules/font-awesome/**/*.map',
    '!node_modules/font-awesome/.npmignore',
    '!node_modules/font-awesome/*.txt',
    '!node_modules/font-awesome/*.md',
    '!node_modules/font-awesome/*.json'
  ])
    .pipe(gulp.dest(`${dirs.dest}/vendor/font-awesome`));
});

gulp.task('img', function() {
  return gulp.src(`${dirs.src}/img/*`)
    .pipe(imagemin())
    .pipe(gulp.dest(`${dirs.dest}/images`));
});

//compile handlebars templates
gulp.task('templates', function() {
  return gulp.src(`${dirs.src}/index.hbs`)
    .pipe(handlebars({}, {
      batch: [`${dirs.src}/partials`]
    }))
    .pipe(rename('index.html'))
    .pipe(gulp.dest(`${dirs.dest}`));
});

//watch for partial changes
gulp.task('handlebars-watch', ['templates'], browserSync.reload);

//compile sass files
gulp.task('sass', function() {
  return gulp.src(`${dirs.src}/scss/styles.scss`)
    .pipe(sass({
      outputStyle: 'nested',
      precison: 3,
      errLogToConsole: true
    }))
    .pipe(gulp.dest(`${dirs.dest}/css`))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('default', ['serve'], function() {
  gulp.watch(`${dirs.src}/scss/*.scss`, ['sass']);
  gulp.watch([`${dirs.src}/partials/*.hbs`, `${dirs.src}/index.hbs`], ['handlebars-watch']);
});
