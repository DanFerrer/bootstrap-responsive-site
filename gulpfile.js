var gulp = require('gulp'),
    sass = require('gulp-sass'),
    fontAwesome = require('node-font-awesome'),
    imagemin = require('gulp-imagemin'),
    inject = require('gulp-inject'),
    connect = require('gulp-connect');

var bootstrapDir = './node_modules/bootstrap-sass/',
    source = 'src/',
    dest = 'dist/';

var fonts = {
  in: [fontAwesome.fonts, source + 'fonts/*.*', bootstrapDir + 'assets/fonts/**/*'],
  out: dest + 'fonts'
};

var images = {
  in: [source + 'img/*', source + 'svg/*'],
  out: dest + 'images'
};

var scss = {
  in: source + 'scss/main.scss',
  out: dest + 'css/',
  watch: source + 'scss/**/*',
  opts: {
    outputStyle: 'nested',
    precison: 3,
    errLogToConsole: true,
    includePaths: [bootstrapDir + 'assets/stylesheets']
  }
};

var injectOpts = {
  addRootSlash: false,
  ignorePath: ['src', 'dist']
};

gulp.task('imgs', function() {
  return gulp.src(images.in).pipe(imagemin()).pipe(gulp.dest(images.out));
});

gulp.task('fonts', function() {
  return gulp.src(fonts.in).pipe(gulp.dest(fonts.out));
});

gulp.task('sass', ['fonts'], function() {
  return gulp.src(scss.in)
    .pipe(sass(scss.opts))
    .pipe(gulp.dest(scss.out))
    .pipe(connect.reload());
});

gulp.task('inject', ['sass'], function() {
  return gulp.src(source + 'index.html')
    .pipe(inject(gulp.src(scss.out + '*.css'), injectOpts))
    .pipe(gulp.dest(dest));
});

gulp.task('webserver', function() {
  console.log('Server started on localhost:8080');

  connect.server({
    livereload: true,
    root: ['.', 'dist']
  });
});

gulp.task('default', ['inject', 'webserver'], function () {
  gulp.watch(scss.watch, ['sass']);
});





