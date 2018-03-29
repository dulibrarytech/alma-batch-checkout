var gulp = require('gulp'),
    uglify = require('gulp-uglify-es').default,
    plumber = require('gulp-plumber'),
    runSequence = require('run-sequence'),
    js_obfuscator = require('gulp-js-obfuscator');

gulp.task('default', function () {
    return 0;
});

gulp.task('minify-all', function(callback) {
  return runSequence(
    'minify-app',
    ['minify-utils', 'minify-admin', 'minify-checkout', 'minify-login'],
    callback
  );
});

gulp.task('minify-app', function () {
    return gulp.src('./src/*.js')
        .pipe(uglify())
        // .pipe(js_obfuscator({}, ["**/jquery-*.js"]))
        .pipe(gulp.dest('./dist/src/'))
});

gulp.task('minify-utils', function () {
    return gulp.src('./client/src/utils/*.js')
        .pipe(uglify())
        // .pipe(js_obfuscator({}, ["**/jquery-*.js"]))
        .pipe(gulp.dest('./dist/src/utils/'));
});

gulp.task("minify-admin", function () {
    return gulp.src("./client/src/components/admin/*.js")
        .pipe(uglify())
        // .pipe(obfuscate(/* options */))
        // .pipe(rename("bundle.min.js"))
        .pipe(gulp.dest("./dist/src/components/admin/"));
});

gulp.task("minify-checkout", function () {
    return gulp.src("./client/src/components/checkout/*.js")
        .pipe(uglify())
        // .pipe(obfuscate(/* options */))
        // .pipe(rename("bundle.min.js"))
        .pipe(gulp.dest("./dist/src/components/checkout/"));
});

gulp.task("minify-login", function () {
    return gulp.src("./client/src/components/login/*.js")
        .pipe(uglify())
        // .pipe(obfuscate(/* options */))
        // .pipe(rename("bundle.min.js"))
        .pipe(gulp.dest("./dist/src/components/login/"));
});




