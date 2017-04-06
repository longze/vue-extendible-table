/**
 * Created by zhaoxiaoqiang on 2017/2/26.
 */
import Vue from 'vue/dist/vue.common.js';
import VueResource from 'vue-resource';

Vue.use(VueResource);

import tableComponent from '../src/index.vue';
import vstTextPlugin from '../src/vst-plugin/text';
import vstNumberPlugin from '../src/vst-plugin/number';
import vstTextMap from '../src/vst-plugin/text-map';

import ElCheckbox from 'element-ui/lib/checkbox';
import 'element-ui/lib/theme-default/checkbox.css';
import ElPagination from 'element-ui/lib/pagination';
import 'element-ui/lib/theme-default/pagination.css';
import 'element-ui/lib/theme-default/index.css';

new Vue({
    el: '#app',
    data: {
        tableOptions: {
            headers: [
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
                },
                {
                    title: '心情',
                    field: 'mood',
                    width: '180px',
                    slot: 'text-map'
                }
            ],
            // 静态数据
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
            afterGetData (res) {
                return res.body.data.list;
            },
            url: '/users',
            params: {
                name: '固定参数，和搜索条件与页码无关'
            },
            pageConfig: {
                currentPageField: 'currentPage',
                dataTotalField: 'total',
                pageSizeField: 'pageSize',
                pageSize: 11
            },
            moodMap: [
                {
                    value: 1,
                    text: '平静'
                },
                {
                    value: 2,
                    text: '激动'
                }
            ]
        },
        text: 'abc'

    },
    components: {
        'table-component': tableComponent,
        'vst-text-plugin': vstTextPlugin,
        'vst-number-plugin': vstNumberPlugin,
        'vst-text-map': vstTextMap,
        'el-checkbox': ElCheckbox,
        'el-pagination': ElPagination
    },
    methods: {
        // 模拟表单的查询条件
        search () {
            // this.$refs.table.reloadData
            this.$refs.table.search({
                a: 'a',
                b: 'b'
            });
        }
    }
});