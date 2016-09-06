var gulp = require('gulp'),
    //livereload = require('gulp-livereload'),
    //watch = require('gulp-watch'),
    nodemon = require('gulp-nodemon'),
    swagger = require('gulp-swagger');

gulp.task('start', /*['schema'],*/ () => {
    nodemon({
            script: 'index.js',
            ext: 'js yml yaml'
        })
        .on('restart', () => {
            console.log("restarted");
        });
});

gulp.task('schema', () => {
    gulp.src('./swagger/test.yml')
        .pipe(swagger('api-docs.json'))
        .pipe(gulp.dest('./public/swagger'));
});

gulp.task('default', [ /* 'schema',*/ 'start']);
