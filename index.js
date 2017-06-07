const FS = require('fs');
const READLINE = require('readline');
var gulp = require('gulp');
var path = require('path');



const CSS_DIRS = ['css', 'style', 'styles'];
const JS_DIRS = ['js', 'script', 'scripts'];
const HTML_DIRS = [''];
const ROOT = './';

let rootDir = ROOT;
let cssDir = ROOT;
let jsDir = ROOT;
let htmlDir = ROOT;

let jsFiles = [];
let cssFiles = [];
let htmlFiles = [];

const rl = READLINE.createInterface({
  input: process.stdin,
  output: process.stdout
});


function createGulpFile() {
const gulpfileHead = `
const GULP = require('gulp');
const CONNECT = require('gulp-connect');

//Specify the rootfolders, will be used for the 'watches' and the root of the webserver
const ROOT = './';
const JS_ROOT = "${jsDir}/";
const HTML_ROOT = "${htmlDir}/";
const CSS_ROOT = "${cssDir}/";`;
const  gulpfileMid = `
//You can have as many sources you want
const JS_SOURCES =[${jsFiles}];

const CSS_SOURCES = [${cssFiles}];
const HTML_SOURCES = [${htmlFiles}];


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
       root: "${rootDir}",   //The webserver entrypoint
       livereload: true
   });
});

GULP.task('default', ['js', 'html', 'css', 'connect', 'watch']);    
                `;
    let gfile = gulpfileHead + gulpfileMid;
    return gfile;
}

FS.exists('gulpfile.js', function(exists) {
    // if the gulpfile already exists.. run it
    if (exists === true) {
        console.log('require after exists');
        require('../../gulpfile');
        if (gulp.tasks.default) { 
            gulp.start('default');
        }
        return;
    }
    
    rl.question('ROOT folder?', (answer) => {
        let parentDir = path.basename(__dirname) === 'node_modules' ? '../../' : '';
        console.log('parentDir = ' + parentDir);
        rootDir = answer.length === 0 ? '.' : answer;
        
        rl.question('JS folder?', (answer) => {
            jsDir = answer;
            rl.question('CSS folder?', (answer) => {
                cssDir = answer;
                rl.question('HTML folder?', (answer) => {
                    htmlDir = answer;
                    let dir = parentDir + rootDir + '/' + jsDir;
                    let filesInJS = FS.readdirSync(dir);
                    filesInJS.forEach((file) => {
                        if (path.extname(file) === ".js") {
                            jsFiles.push('"' + dir + file + '"');
                        }
                    });

                    dir = parentDir + rootDir + '/' + cssDir;
                    let filesInCSS = FS.readdirSync(dir);
                    filesInCSS.forEach((file) => {
                        if (path.extname(file) === ".css") {
                            cssFiles.push('"' + dir + file + '"');
                        }
                    });

                    dir = parentDir + rootDir + '/' + htmlDir;
                    let filesInHTML = FS.readdirSync(dir);
                    filesInHTML.forEach((file) => {
                        if (path.extname(file) === ".html") {
                            htmlFiles.push('"' + dir + file + '"');
                        }
                    });
                    const gulpfile = createGulpFile();
                    FS.writeFile('gulpfile.js', gulpfile, (err) => {
                        if (!err) {
                            console.log('require after writefile');
                            require('../../gulpfile');
                            if (gulp.tasks.default) { 
                                gulp.start('default');
                            }
                        }
                    });

                    
                });// rl question 3 -- html
            }); //rl question 2
        });//rl question 1
    });//rl question ROOT
});//FS.exists

//FS.exists('gulpfile.js', (exists) => {
//    console.log('exists = ' + exists);
//});