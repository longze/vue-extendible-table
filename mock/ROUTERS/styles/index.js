/**
 * @file mock模拟数据
 *
 * @author liubin29(liubin29@baidu.com)
 * 2016年12月18日
 */

let fs = require('fs');
let path = require('path');
let stylus = require('stylus');

let base = path.resolve(__dirname + '/../../../node_modules');
let bsmlPath = path.resolve(base + '/bsml-yingxiao/default');

module.exports = function* (next) {
    this.type = 'text/css';

    let data = '';
    let tempFile = bsmlPath + '/' + this.params.compname + '/index.styl';
    if (fs.existsSync(tempFile)) {
        data = fs.readFileSync(tempFile, {encoding: 'utf8'});
        data = data.replace(/^[\s\t]*\@import.+/mg, '');

        data = fs.readFileSync(__dirname + '/index.styl', {encoding: 'utf8'}) + '\n\n' + data;

        let style = stylus(data);
        data = yield function (done) {
            return style.render(done);
        };

        this.body = data;
    }
    else {
        yield next;
    }
};
