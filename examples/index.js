/**
 * Created by zhaoxiaoqiang on 2017/2/26.
 */
import Vue from 'vue/dist/vue.common.js';

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
                    label: '年龄',
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
        'table-widget-text': vstTextPlugin,
        'table-widget-number': vstNumberPlugin
    }
});