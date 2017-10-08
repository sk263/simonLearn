var gulp = require('gulp'),
uglify = require('gulp-uglify'),
sass=require('gulp-sass'),
plumber = require('gulp-plumber'),
imagemin = require('gulp-imagemin'),
prefix = require('gulp-autoprefixer'),
nunjucksRender = require('gulp-nunjucks-render'),
concat = require ('gulp-concat');

var cssPaths = [
'node_modules/normalize.css/normalize.css',
'app2_bootstrap/css/app.css'
];

//Uglifies
//Errow with plumber

gulp.task('scripts', function(){
  gulp.src('app2_bootstrap/js/**/*.js')
  .pipe(plumber())
  .pipe(uglify())
  .pipe(gulp.dest('app2_bootstrap/build/minjs'))
});

//Sass
//Error without plumber

/*gulp.task('styles', function(){
  gulp.src('scss/*.scss')
  .pipe(plumber())
  .pipe(sass({
      style: 'expanded'
  }))
  .on('error' , console.log.bind(console))
  .pipe(prefix('last 2 versions')) // Prefix
  .pipe(gulp.dest('css/app/'))

  .pipe(livereload());
});*/


//BrowserSync + SASS
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');

// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {

  browserSync.init({
    server: "app2_bootstrap/"
  });

  gulp.watch("./**/*.scss", ['sass']);
  gulp.watch("./**/*.html").on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
  gulp.src("app2_bootstrap/scss/*.scss")
  .pipe(plumber())
  .pipe(sass())
  .pipe(prefix('last 2 versions'))
  .pipe(gulp.dest("app2_bootstrap/css"))
  .pipe(browserSync.stream())
});



//Imagemin
gulp.task('image', function(){
  gulp.src('app2_bootstrap/img/*') // Imagemin
  .pipe(imagemin())
  .pipe(gulp.dest('app2_bootstrap/img/compressed/')) 
  .on('error' , console.log.bind(console)) // Error
});


//Nunjacks

gulp.task('nunjacks', function () {
  return gulp.src('app2_bootstrap/src/templates/*.+(html|nunjucks)')
  .pipe(nunjucksRender({
    path: 'app2_bootstrap/src/templates'
  }))
  .pipe(gulp.dest('app2_bootstrap/dist'));
});

//Concat
gulp.task('spajanje', function () {
  return gulp.src(cssPaths)
  .pipe(concat('main.css'))
  .pipe(gulp.dest('app2_bootstrap/css/'));
}); 

//Watch
gulp.task('watch', function() {
  // gulp.watch('./*.js', ['scripts']);
  gulp.watch('app2_bootstrap/scss/**/*.scss', ['sass'])
});

gulp.task('default', ['scripts' , 'watch' ,'image' , 'nunjacks' , 'spajanje' , 'serve']);
