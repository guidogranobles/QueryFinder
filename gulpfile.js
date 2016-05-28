var gulp = require('gulp');

gulp.task('copy3party', function() {

    gulp.src('node_modules/rxjs/**/*')
   .pipe(gulp.dest('app/scripts/thirdparty/rxjs'));
   
    gulp.src('node_modules/angular2-in-memory-web-api/**/*')
   .pipe(gulp.dest('app/scripts/thirdparty/angular2-in-memory-web-api'));
   
      gulp.src('node_modules/@angular/**/*')
   .pipe(gulp.dest('app/scripts/thirdparty/@angular'));   
   
         gulp.src('node_modules/google-code-prettify/bin/*')
   .pipe(gulp.dest('app/scripts/thirdparty/google-code-prettify'));   
   
});