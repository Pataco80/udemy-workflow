// VARIABLES
var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

// PATHS
var SOURCEPATHS = {
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
    .pipe(sass({outputStyle:'expanded'}).on('error', sass.logError))
    .pipe(gulp.dest(APPPATHS.css));
});

// Server reload
gulp.task('serve', ['sass'], function(){
  browserSync.init([APPPATHS.root + '/*.html', APPPATHS.css + '/*.css', APPPATHS.js + '/*.js'],{
    server: {
      baseDir : APPPATHS.root
    }
  })
});
// Default
gulp.task('default', ['serve']);