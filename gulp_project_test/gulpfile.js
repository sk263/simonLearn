var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	sass=require('gulp-sass'),
  plumber = require('gulp-plumber'),
  livereload = require('gulp-livereload'),
  imagemin = require('gulp-imagemin'),
  prefix = require('gulp-autoprefixer'),
  nunjucksRender = require('gulp-nunjucks-render'),
  concat = require ('gulp-concat');

var cssPaths = [
  'node_modules/normalize.css/normalize.css',
  'css/app/color.css',
  'css/app/app.css'
];

//Uglifies
//Errow with plumber

gulp.task('scripts', function(){
  gulp.src('js/**/*.js')
  .pipe(plumber())
  .pipe(uglify())
  .pipe(gulp.dest('build/minjs'))
  .pipe(livereload());
});

//Sass
//Error without plumber

gulp.task('styles', function(){
  gulp.src('scss/*.scss')
  .pipe(plumber())
  .pipe(sass({
      style: 'expanded'
  }))
  .on('error' , console.log.bind(console))
  .pipe(prefix('last 2 versions')) // Prefix
  .pipe(gulp.dest('css/app/'))

  .pipe(livereload());
});

//Imagemin
gulp.task('image', function(){
  gulp.src('img/*') // Imagemin
  .pipe(imagemin())
  .pipe(gulp.dest('img/compressed/')) 
  .on('error' , console.log.bind(console)) // Error
});


//Nunjacks
gulp.task('nunjacks', function () {
  return gulp.src('src/templates/*.+(html|nunjucks)')
    .pipe(nunjucksRender({
      path: 'src/templates'
    }))
    .pipe(gulp.dest('dist'));
});

//Concat
gulp.task('spajanje', function () {
  return gulp.src(cssPaths)
    .pipe(concat('main.css'))
    .pipe(gulp.dest('css/'));
});

//Watch
gulp.task('watch', function() {

  var server = livereload();

  gulp.watch('js/*.js', ['scripts']);
  gulp.watch('scss/**/*.scss', ['styles'])
});

gulp.task('default', ['scripts' , 'styles' , 'watch' ,'image' , 'nunjacks' , 'spajanje']);
