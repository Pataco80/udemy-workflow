// VARIABLES
var gulp = require('gulp');
var sass = require('gulp-sass');


// TASKS

// Styles
gulp.task('sass', function(){
  return gulp.src('src/scss/app.scss')
    .pipe(sass({outputStyle:'expanded'}).on('error', sass.logError))
    .pipe(gulp.dest('dist/css/app.css'));
});


// Default
gulp.task('default', ['sass']);