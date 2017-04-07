/**
 * @file mock模拟数据
 *
 * @author liubin29(liubin29@baidu.com)
 * 2016年12月18日
 */

let fs = require('fs');
let path = require('path');

let base = path.resolve(__dirname + '/../../../node_modules');
let resources = path.resolve(base + '/bsml-yingxiao/default/resources');

module.exports = function* (next) {
    this.type = 'image/png';

    let data = '';
    let tempFile = resources + '/' + this.params.imgPath + '/' + this.params.img;

    if (fs.existsSync(tempFile)) {
        data = fs.readFileSync(tempFile);

        this.body = data;
    }
    else {
        yield next;
    }
};
