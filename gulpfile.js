// VARIABLES
var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var autoprefixer = require('gulp-autoprefixer');

// PATHS
var SOURCEPATHS = {
  htmlSource : 'src/*.html',
  sassSource : 'src/scss/*.scss'
}
var APPPATHS = {
  root :'app/',
  css : 'app/css',
  js :  'app/js'
}



// TASKS

// Styles
gulp.task('sass', function(){
  return gulp.src(SOURCEPATHS.sassSource)
    .pipe(autoprefixer())
    .pipe(sass({outputStyle:'expanded'}).on('error', sass.logError))
    .pipe(gulp.dest(APPPATHS.css));
});

// Copy
gulp.task('copy', function(){
  gulp.src(SOURCEPATHS.htmlSource)
  .pipe(gulp.dest(APPPATHS.root));
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
gulp.task('watch', ['serve', 'sass', 'copy'], function(){
  gulp.watch([SOURCEPATHS.sassSource], ['sass']);
  gulp.watch([SOURCEPATHS.htmlSource], ['copy']);
});
// Default
gulp.task('default', ['watch']);