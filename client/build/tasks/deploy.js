var gulp = require('gulp'),
    uglify = require('gulp-uglify-es').default,
    plumber = require('gulp-plumber'),
    runSequence = require('run-sequence'),
    js_obfuscator = require('gulp-js-obfuscator');

gulp.task('default', function () {
    return 0;
});

gulp.task('deploy-all', function(callback) {
  return runSequence(
    'deploy-app',
    ['deploy-utils', 'deploy-admin', 'deploy-checkout', 'deploy-login'],
    callback
  );
});

gulp.task('deploy-app', function () {
    return gulp.src('./src/*.js')
        .pipe(uglify())
        // .pipe(js_obfuscator({}, ["**/jquery-*.js"]))
        .pipe(gulp.dest('./dist/src/'))
        .pipe(gulp.dest('./src/'))
});

gulp.task('deploy-utils', function () {
    return gulp.src('./src/utils/*.js')
        .pipe(uglify())
        // .pipe(js_obfuscator({}, ["**/jquery-*.js"]))
        .pipe(gulp.dest('./dist/src/utils/'))
        .pipe(gulp.dest('./src/utils/'))
});

gulp.task("deploy-admin", function () {
    return gulp.src("./src/components/admin/*.js")
        .pipe(uglify())
        // .pipe(obfuscate(/* options */))
        // .pipe(rename("bundle.min.js"))
        .pipe(gulp.dest("./dist/src/components/admin/"))
        .pipe(gulp.dest('./src/components/admin/'));
});

gulp.task("deploy-checkout", function () {
    return gulp.src("./src/components/checkout/*.js")
        .pipe(uglify())
        // .pipe(obfuscate(/* options */))
        // .pipe(rename("bundle.min.js"))
        .pipe(gulp.dest("./dist/src/components/checkout/"))
        .pipe(gulp.dest('./src/components/checkout/'));
});

gulp.task("deploy-login", function () {
    return gulp.src("src/components/login/*.js")
        //.pipe(uglify())
        .pipe(js_obfuscator({}, ["./src/components/login/*.js"]))
        // .pipe(obfuscate(/* options */))
        // .pipe(rename("bundle.min.js"))
        .pipe(gulp.dest("dist/src/components/login/"))
        .pipe(gulp.dest('src/components/login/'));
})

gulp.task("deploy-configuration", function () {
    return gulp.src("./config/Configuration.js")
        //.pipe(uglify())
        .pipe(js_obfuscator({}, ["./config/Configuration.js"]))
        // .pipe(obfuscate(/* options */))
        // .pipe(rename("bundle.min.js"))
        .pipe(gulp.dest("dist/config/"))
        .pipe(gulp.dest('config/'));
})