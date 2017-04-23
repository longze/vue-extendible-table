/**
 * @file 压缩JS代码
 *
 * @author liubin29@baidu.com
 * 2016年4月17日
 *
 * webpack 插件UglifyJsPlugin压缩代码时，任务被卡死
 */

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var config = require('../config');
var handleErrors = require('../lib/handleErrors');
var suffixSouremap = require('../lib/gulp-suffix-sourcemap');

gulp.task('compress', function () {
    return gulp.src(config.publicDirectory + '/js/*.js')
        .pipe(uglify())
        .on('error', handleErrors)
        .pipe(suffixSouremap())
        .pipe(gulp.dest(config.publicDirectory + '/js/'));
});
