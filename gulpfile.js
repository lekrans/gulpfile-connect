const GULP = require('gulp');
const CONNECT = require('gulp-connect');

//Specify the rootfolders, will be used for the 'watches' and the root of the webserver
const ROOT = './';
const JS_ROOT = ROOT;
const HTML_ROOT = ROOT;
const CSS_ROOT = ROOT;

//You can have as many sources you want
const JS_SOURCES = [
//   JS_ROOT + 'script.js',
];

const CSS_SOURCES = [
//    CSS_ROOT + 'style.css', 
];
const HTML_SOURCES = [
    HTML_ROOT + 'index.html', 
];


GULP.task('js', function() {
   GULP.src(JS_SOURCES)
   .pipe(CONNECT.reload());
});

GULP.task('css', function() {
   GULP.src(CSS_SOURCES)
   .pipe(CONNECT.reload());
});

GULP.task('html', function() {
   GULP.src(HTML_SOURCES)
   .pipe(CONNECT.reload());
});


GULP.task('watch', function() {
   GULP.watch(JS_SOURCES, ['js']);
   GULP.watch(CSS_SOURCES, ['css']);
   GULP.watch(HTML_SOURCES, ['html']);
});

GULP.task('connect', function() {
   CONNECT.server({
       root: ROOT,   //The webserver entrypoint
       livereload: true
   });
});

GULP.task('default', ['js', 'html', 'css', 'connect', 'watch']);