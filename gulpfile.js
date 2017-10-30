// VARIABLES
var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var autoprefixer = require('gulp-autoprefixer');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var browserify = require('gulp-browserify');
var merge = require('merge-stream');
var newer = require('gulp-newer');
var imagemin = require('gulp-imagemin');


// PATHS
var SOURCEPATHS = {
  htmlSource : 'src/*.html',
  sassSource : 'src/scss/*.scss',
  jsSource :   'src/js/**',
  imgSource :  'src/img/**'
}
var APPPATHS = {
  root :'app/',
  css : 'app/css',
  js :  'app/js',
  fonts:'app/fonts',
  img : 'app/img'
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
  var bootstrapCss = gulp.src('./node_modules/bootstrap/dist/css/bootstrap.css');
  var sassFiles;
  
  sassFiles = gulp.src(SOURCEPATHS.sassSource)
    .pipe(autoprefixer())
    .pipe(sass({outputStyle:'expanded'}).on('error', sass.logError))
    return merge(bootstrapCss, sassFiles)
      .pipe(concat('app.css'))
      .pipe(gulp.dest(APPPATHS.css))
});

//Images
gulp.task('images', function(){
  return gulp.src(SOURCEPATHS.imgSource)
    .pipe(newer(APPPATHS.img))
    .pipe(imagemin())
      .pipe(gulp.dest(APPPATHS.img))
});
// Move fonts
gulp.task('moveFonts', function(){
  gulp.src('./node_modules/bootstrap/dist/fonts/*.{eot,svg,ttf,woff,woff2}')
  .pipe(gulp.dest(APPPATHS.fonts))
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
gulp.task('watch', ['serve', 'clean-html', 'clean-scripts', 'sass', 'scripts', 'images', 'moveFonts', 'copy'], function(){
  gulp.watch([SOURCEPATHS.sassSource], ['sass']);
  gulp.watch([SOURCEPATHS.htmlSource], ['copy']);
  gulp.watch([SOURCEPATHS.jsSource], ['scripts']);
  gulp.watch([SOURCEPATHS.jsSource], ['images']);
});
// Default
gulp.task('default', ['watch']);