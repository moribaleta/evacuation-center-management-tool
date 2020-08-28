var gulp = require('gulp');
//var ts = require('gulp-typescript');

var run = require('gulp-run');
var connect = require('gulp-connect')
var shell = require('gulp-shell')
    //gulp.src(['src/**/*.tsc'])



gulp.task('default', function () {
  gulp.watch('src/**/*.ts',(done)=>{
    console.log('building files!'); 
    run('npm start').exec('file', () => {
      console.log("building end")
    })
    done();
  });
});

gulp.task('build', function (done) { 
  console.log('Working!'); 
  done();
});


//gulp.task('default', function() {
  //gulp.watch('./myFileToWatch.txt', ['script']);
  //gulp.watch('src/**/*.tsc', run('npm run start'))
//})