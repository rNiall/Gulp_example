'use strict';

const gulp = require('gulp'),
    pug = require('gulp-pug'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    debug = require('gulp-debug'),
    gulpIf = require('gulp-if'),
    del = require('del'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync').create(),

    path = {
        src: {
            pug: 'src/pug/*.pug',
            style: 'src/assets/styles/styles.scss',
            js:'src/assets/js/**',
        },
        dist: {
            html: 'dist',
            css: 'dist/assets/style/',
            js: 'dist/assets/js',
        },
    };

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

//html
gulp.task('pug', function() {
   return gulp.src(path.src.pug)
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest(path.dist.html))
});

//style
gulp.task('styles', function(){
    return gulp.src(path.src.style)
        .pipe(gulpIf(isDevelopment, sourcemaps.init()))
        .pipe(sass().on('error', sass.logError))
        .pipe(gulpIf(isDevelopment, sourcemaps.write()))
        // .pipe(autoprefixer(['last 3 versions', '> 5%'], { cascade: true }))
        .pipe(gulp.dest(path.dist.css))
});

//js
gulp.task('js', function () {
   return gulp.src(path.src.js)
        .pipe(gulp.dest(path.dist.js))
});

gulp.task('clean', function() {
    return del('dist');
});

gulp.task('build', gulp.series(
    'clean',
    gulp.parallel('pug','styles', 'js'))
);

gulp.task('watch', function() {
    gulp.watch('src/pug/**/*.pug', gulp.series('pug'));
    gulp.watch('src/assets/styles/**/*.*', gulp.series('styles'));
    gulp.watch('src/assets/js/**/*.*', gulp.series('js'));
});

//Server
gulp.task('serve', function() {
    browserSync.init({
        server: 'dist'
    });
    browserSync.watch('dist/**/*.*').on('change', browserSync.reload);
});

gulp.task('dev',
    gulp.series('build', gulp.parallel('watch', 'serve'))
);
