// VARIABLES
var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var autoprefixer = require('gulp-autoprefixer');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var browserify = require('gulp-browserify');


// PATHS
var SOURCEPATHS = {
  htmlSource : 'src/*.html',
  sassSource : 'src/scss/*.scss',
  jsSource :   'src/js/**'
}
var APPPATHS = {
  root :'app/',
  css : 'app/css',
  js :  'app/js'
}



// TASKS
//Clean Html
gulp.task('clean-html', function(){
  return gulp.src(APPPATHS.root + '/*.html', {read:false, force:true})
  .pipe(clean())
});

//Clean Scripts
gulp.task('clean-scripts', function(){
  return gulp.src(APPPATHS.js + '/*.js', {read:false, force:true})
  .pipe(clean())
});

// Styles
gulp.task('sass', function(){
  return gulp.src(SOURCEPATHS.sassSource)
    .pipe(autoprefixer())
    .pipe(sass({outputStyle:'expanded'}).on('error', sass.logError))
    .pipe(gulp.dest(APPPATHS.css))
});

// Scripts
gulp.task('scripts', ['clean-scripts'], function(){
  gulp.src(SOURCEPATHS.jsSource)
    .pipe(concat('app.js'))
    .pipe(browserify())
    .pipe(gulp.dest(APPPATHS.js))
});
// Copy
gulp.task('copy', ['clean-html'], function(){
  gulp.src(SOURCEPATHS.htmlSource)
  .pipe(gulp.dest(APPPATHS.root))
});

// Server reload
gulp.task('serve', ['sass'], function(){
  browserSync.init([APPPATHS.root + '/*.html', APPPATHS.css + '/*.css', APPPATHS.js + '/*.js'],{
    server: {
      baseDir : APPPATHS.root
    }
  })
});

//Watch
gulp.task('watch', ['serve', 'clean-html', 'clean-scripts', 'sass', 'scripts', 'copy'], function(){
  gulp.watch([SOURCEPATHS.sassSource], ['sass']);
  gulp.watch([SOURCEPATHS.htmlSource], ['copy']);
  gulp.watch([SOURCEPATHS.jsSource], ['scripts']);
});
// Default
gulp.task('default', ['watch']);