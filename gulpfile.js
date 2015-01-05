var gulp            = require('gulp');

var clean           = require('gulp-clean');
var concat          = require('gulp-concat');
var header          = require('gulp-header');
var uglify          = require('gulp-uglify');
var stylus          = require('gulp-stylus');
var autoprefixer    = require('gulp-autoprefixer');
var minifyCSS       = require('gulp-minify-css');
var cleanhtml       = require('gulp-cleanhtml');
var imagemin        = require('gulp-imagemin');


gulp.task('clean_js', function () {
    'use strict';

    return gulp.src(
        [
            './static/js/min'
        ],
        {
            read: false
        })
        .pipe(clean());
});

gulp.task('js', ['clean_js'], function () {
    'use strict';

    return gulp.src(
        [
            './static/js/shadowbox.js',
            './static/js/base.js'
        ])
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(header('// enzyme-project.org ' + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + '\n'))
        .pipe(gulp.dest('./static/js/min'));
});


gulp.task('clean_css', function () {
    'use strict';

    return gulp.src(
        [
            './static/css/min'
        ],
        {
            read: false
        })
        .pipe(clean());
});

gulp.task('css', ['clean_css'], function () {
    'use strict';

    return gulp.src(
        [
            './static/css/style.styl'
        ])
        .pipe(concat('all.css'))
        .pipe(stylus({
            use: ['nib']
        }))
        .pipe(autoprefixer('last 1 version', '> 1%', 'ie 8', 'ie 7'))
        .pipe(minifyCSS({
            'removeEmpty': true
        }))
        .pipe(header('/* enzyme-project.org ' + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + '*/\n'))
        .pipe(gulp.dest('./static/css/min'));
});


gulp.task('clean_html', function () {
    'use strict';

    return gulp.src(
        [
            './templates/min'
        ],
        {
            read: false
        })
        .pipe(clean());
});

gulp.task('html', ['clean_html'], function () {
    'use strict';

    return gulp.src('./templates/**/*.html')
        .pipe(cleanhtml())
        .pipe(gulp.dest('./templates/min'));
});


gulp.task('img', function () {
    'use strict';

    return gulp.src('./static/img/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./static/img'));
});


gulp.task('default', [
    'js', 'css', 'html'
]);