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
var injectPartials = require('gulp-inject-partials');
var minify = require('gulp-minify');
var rename = require('gulp-rename');
var cssmin = require('gulp-cssmin');
var htmlmin = require('gulp-htmlmin');


// PATHS
var SOURCEPATHS = {
  htmlSource : 'src/*.html',
  htmlPartialSource : 'src/partial/*.html',
  sassSource : 'src/scss/*.scss',
  jsSource :   'src/js/**',
  imgSource :  'src/img/**',
  dataSource:  'src/data/**'
}
var APPPATHS = {
  root :'app/',
  css : 'app/css',
  js :  'app/js',
  fonts:'app/fonts',
  img : 'app/img',
  data: 'app/data'
}



// TASKS
//Clean Html
gulp.task('clean-data', function(){
  return gulp.src(APPPATHS.data + '/**', {read:false, force:true})
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
/* PRODUCTION TASKS */
// Compressed CSS
gulp.task('compressCss', function(){
  var bootstrapCss = gulp.src('./node_modules/bootstrap/dist/css/bootstrap.css');
  var sassFiles;
  
  sassFiles = gulp.src(SOURCEPATHS.sassSource)
    .pipe(autoprefixer())
    .pipe(sass({outputStyle:'expanded'}).on('error', sass.logError))
    return merge(bootstrapCss, sassFiles)
      .pipe(concat('app.css'))
      .pipe(cssmin())
      .pipe(rename({suffix:'.min'}))
      .pipe(gulp.dest(APPPATHS.css))
});
// Compressed Scripts
gulp.task('compressScripts', function(){
  gulp.src(SOURCEPATHS.jsSource)
    .pipe(concat('app.js'))
    .pipe(browserify())
    .pipe(minify())
    .pipe(gulp.dest(APPPATHS.js))
});
// compressed Html
gulp.task('minifyHtml', function(){
  return gulp.src(SOURCEPATHS.htmlSource)
    .pipe(injectPartials())
    .pipe(htmlmin({collapseWhitespace:true}))
    .pipe(gulp.dest(APPPATHS.root))
});
/* END PRODUCTION TASKS */

// Inject Partials
gulp.task('html', function(){
  return gulp.src(SOURCEPATHS.htmlSource)
    .pipe(injectPartials())
    .pipe(gulp.dest(APPPATHS.root))
});

//Copy
gulp.task('copy-data', ['clean-data'], function(){
  gulp.src(SOURCEPATHS.dataSource)
  .pipe(gulp.dest(APPPATHS.data))
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
gulp.task('watch', ['serve', 'clean-data', 'clean-scripts', 'html', 'sass', 'scripts', 'images', 'moveFonts', 'copy-data'], function(){
  gulp.watch([SOURCEPATHS.sassSource], ['sass']);
  gulp.watch([SOURCEPATHS.htmlSource], ['copy-data']);
  gulp.watch([SOURCEPATHS.jsSource], ['scripts']);
  gulp.watch([SOURCEPATHS.jsSource], ['images']);
  gulp.watch([SOURCEPATHS.htmlSource, SOURCEPATHS.htmlPartialSource], ['html']);
});
// Default
gulp.task('default', ['watch']);

gulp.task('production', ['compressCss', 'compressScripts', 'minifyHtml']);