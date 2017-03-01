/**
 * Created by zhaoxiaoqiang on 2017/2/26.
 */
import Vue from 'vue/dist/vue.common.js';
import VueResource from 'vue-resource';

Vue.use(VueResource);

import tableComponent from '../src/index.vue';
import vstTextPlugin from './vst-plugin/text';
import vstNumberPlugin from './vst-plugin/number';

new Vue({
    el: '#app',
    data: {
        tableOptions: {
            columns: [
                {
                    title: '姓名',        // 表格标题
                    field: 'name',        // 字段名，prop
                    width: '50%',         // 宽度同时支持百分比和像素配置
                    slot: 'text'          // 单元格组件的名称
                },
                {
                    title: '年龄',
                    field: 'age',
                    width: '180px',
                    slot: 'number'
                }
            ],
            data: [
                {
                    name: 'tom',
                    age: 3
                },
                {
                    name: 'jerry',
                    age: 1
                }
            ],
            /**
             * 返回的数据可能是一个复杂结构，可以自定义获取数据的方法，也可以做一些数据加工
             *
             * @param res {Object} 返回的数据，组件默认使用 vue-resource 加载异步数据，
             *                     默认会在后台返回的数据上加一层 body ，当然你可以全局设置去掉 body
             * @return {Array} 表格的数据
             */
            getData (res) {
                return res.body.data;
            },
            url: '/users',
            params: {
                name: '',
                pageSize: 10,
                currentPage: 1
            }
        }
    },
    components: {
        'table-component': tableComponent,
        'vst-text-plugin': vstTextPlugin,
        'vst-number-plugin': vstNumberPlugin
    }
});