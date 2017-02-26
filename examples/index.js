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
                    label: '姓名',
                    fieldName: 'name'
                },
                {
                    label: '年龄',
                    fieldName: 'age'
                }
            ]
        }
    },
    components: {
        'table-component': tableComponent,
        'table-widget-text': vstTextPlugin,
        'table-widget-number': vstNumberPlugin
    }
});