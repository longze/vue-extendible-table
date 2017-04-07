/**
 * @file 本地模拟接口数据
 *
 * @author liubin29(liubin29@baidu.com)
 * 2016年12月18日
 */


var styles = require('./styles');
var resources = require('./resources');

function routes(app) {
    app.get('/styles/:compname/index.css', styles)
    app.get('/styles/resources/:imgPath/:img', resources);
}

module.exports = routes;
