var gulp            = require('gulp');

var clean           = require('gulp-clean');
var concat          = require('gulp-concat');
var header          = require('gulp-header');
var uglify          = require('gulp-uglify');
var stylus          = require('gulp-stylus');
var nib             = require('nib');
var autoprefixer    = require('gulp-autoprefixer');
var minifyCSS       = require('gulp-minify-css');
var cleanhtml       = require('gulp-cleanhtml');
var imagemin        = require('gulp-imagemin');


gulp.task('clean_js', function () {
    'use strict';

    return gulp.src(
        [
            './enzymeproject/static/js/min'
        ],
        {
            read: false
        })
        .pipe(clean());
});

gulp.task('js', ['clean_js'], function () {
    'use strict';

    gulp.src(
        [
            './enzymeproject/static/js/shadowbox.js'
        ])
        .pipe(concat('shadowbox.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./enzymeproject/static/js/min'));

    return gulp.src(
        [
            './enzymeproject/static/js/base.js'
        ])
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(header('// enzyme-project.org ' + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + '\n'))
        .pipe(gulp.dest('./enzymeproject/static/js/min'));
});


gulp.task('clean_css', function () {
    'use strict';

    return gulp.src(
        [
            './enzymeproject/static/css/min'
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
            './enzymeproject/static/css/style.styl'
        ])
        .pipe(stylus({ use: nib(), compress: true }))
        .pipe(concat('all.css'))
        .pipe(autoprefixer('last 1 version', '> 1%', 'ie 8', 'ie 7'))
        .pipe(minifyCSS({
            'removeEmpty': true
        }))
        .pipe(header('/* enzyme-project.org ' + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + '*/\n'))
        .pipe(gulp.dest('./enzymeproject/static/css/min'));
});


gulp.task('clean_html', function () {
    'use strict';

    return gulp.src(
        [
            './enzymeproject/templates/min'
        ],
        {
            read: false
        })
        .pipe(clean());
});

gulp.task('html', ['clean_html'], function () {
    'use strict';

    return gulp.src('./enzymeproject/templates/**/*.html')
        .pipe(cleanhtml())
        .pipe(gulp.dest('./enzymeproject/templates/min'));
});


gulp.task('img', function () {
    'use strict';

    return gulp.src('./enzymeproject/static/img/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./enzymeproject/static/img'));
});


gulp.task('default', [
    'js', 'css', 'html', 'img'
]);