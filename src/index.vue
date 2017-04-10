<template src="./index.tpl.html"></template>
<script>

    import ElCheckbox from 'element-ui/lib/checkbox';
    import 'element-ui/lib/theme-default/checkbox.css';
    import ElPagination from 'element-ui/lib/pagination';
    import 'element-ui/lib/theme-default/pagination.css';

    export default {
        props: {
            /**
             * 配置示例：
             * options: {
                 mainField: 'id',      // 默认主键为 "id"
                 firstRow: {
                     type: 'checkbox',  // 还有 'number'
                     minChecked: 1,     // 只有 type 为 'checkbox' 时生效
                     maxChecked: 5,     // 只有 type 为 'checkbox' 时生效
                     // 挂 class 方便自定义样式，在表头和表体的单元格上都有，可以通过 th 和 td 来区分它们
                     styleClass: ['a-class']
                 },
                 headers: [
                     {
                         title: '姓名',        // 表格标题
                         field: 'name',        // 字段名，prop
                         width: '50%',         // 宽度同时支持百分比和像素配置
                         slot: 'text',         // 单元格组件的名称
                         // 挂 class 方便自定义样式，在表头和表体的单元格上都有，可以通过 th 和 td 来区分它们
                         styleClass: ['a-class']
                     },
                     {
                         title: '年龄',
                         field: 'age',
                         width: '180px',
                         slot: 'number'
                     }
                 ],
                 // 可以直接展示数据
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
                 // 返回的数据可能是一个复杂结构，可以自定义获取数据的方法，也可以做一些数据加工
                 afterGetData(res) {
                     // 可以对 res 做数据加工
                     return res.body.list;
                 },
                 getData (res) {
                     return res.body.data;
                 },
                 // 也可以通过配置 url 和 params 异步获取数据
                 url: '/users',
                 params: {
                     name: '',
                     pageSize: 10,
                     currentPage: 1
                 },
                 // 页码的配置，不配置此项时不显示页码
                 pageConfig: {
                     currentPageField: 'currentPage',  // 向后台请求时的字段名 -- 请求第几页数据，缺省值 "currentPage"
                     pageSizeField: 'pageSize',   // 向后台请求时的字段名 -- 每页要几条，缺省值 "pageSize"
                     dataTotalField: 'total',     // 后台返回数据总条数的字段设置，缺省值 "total"
                     pageSize: 10                 // 默认每页 10 条
                 },
                 // 还可以添加其他参数，作为插件的数据源，插件中可以用 props.options. 来引用
                ...
            }
            */
            options: {
                type: Object,
                require: true
            }
        },
        mounted() {
            // 处理配置的默认值
            let firstRow = this.options.firstRow;
            if (firstRow && firstRow.type === 'checkbox') {
                const hasSelectAll = firstRow.hasSelectAll;
                firstRow.hasSelectAll = hasSelectAll === undefined ? true : hasSelectAll;

                let dataList = [];
                if (Array.isArray(this.options.data)) {
                    dataList = this._cleanOptionData();
                }

                this._addExtendAttr(dataList);
                this.data = dataList;

                let mainField = this.options.mainField || 'id';
                this._initSelectedItems(mainField);

                if (this.data.length > 0) {
                    this._rewriteCheckedAttr();
                }

                this._computeSelectAll();
            }

            this._loadData();
        },
        components: {
            'el-checkbox': ElCheckbox,
            'el-pagination': ElPagination
        },
        data() {
            return {
                data: [],
                table: this,
                // 加载中，暂无数据等文本展示是否展示的开关
                isShowText: false,
                // 加载中，暂无数据等文本
                text: '',
                // 主键
                mainField: this.options.mainField || 'id',
                // 跨页选中功能 中记录选中项
                selectedItems: [],
                searchData: {},
                page: {
                    dataTotal: 0,
                    currentPage: 1
                },
                // 首列为序号时需要需要此参数，当前页的序号加上此参数就是多页的序号
                pageBase: 0
            };
        },
        computed: {
            // 是否显示页码
            showPage() {
                return typeof this.options.pageConfig === 'object';
            }
        },
        methods: {

            // ##################### 私有方法 ##################### //

            /**
             * 清理配置数据
             * 将双向绑定属性洗白成简单对象数据，
             * 这样就可以触发 this.data 赋值时的双向绑定计算
             *
             * @return {Array} dataList 清理后的配置数据
             */
            _cleanOptionData() {
                let dataList = [];
                this.options.data.forEach(item => {
                    let newItem = {};
                    for (let key in item) {
                        if (item.hasOwnProperty(key)) {
                            newItem[key] = item[key];
                        }
                    }
                    dataList.push(newItem);
                });
                return dataList;
            },

            /**
             * 对回写数据做兼容处理，选中项数组，可以是主键的数组，也可以是选中对象的数组
             * 主键的数组的两种数据类型：
             * [1, 2] 或 ['1', '2']
             * 选中对象的数组：
             * [{id: 1, name: ''}, {id: 2, name: ''}]
             *
             * @param {string} mainField 主键字段
             */
            _initSelectedItems(mainField) {
                let selectedItems;
                let items = this.options.selectedItems;

                if (Array.isArray(items) && items.length > 0) {
                    selectedItems = this._switchSelectedItems(mainField);
                }

                this.selectedItems = selectedItems;
            },

            /**
             * 将主键的数组转换成数据行的数组
             *
             * @param {string} mainField 主键字段名
             * @return {Array} selectedItems 选中项数据的数组
             */
            _switchSelectedItems(mainField) {
                let selectedItems;
                let optionsSelectedItems = this.options.selectedItems;
                let dataType = typeof optionsSelectedItems[0];

                // 直接传入以主键为元素的数组
                if (dataType === 'number' || dataType === 'string') {
                    selectedItems = [];
                    optionsSelectedItems.forEach(item => {
                        selectedItems.push({[mainField]: item});
                    });
                }
                // 传入以对象为元素的数组
                else {
                    selectedItems = this.options.selectedItems;
                }

                return selectedItems;
            },

            /**
             * 添加扩展字段，用于实现表格的操作逻辑
             *
             * @param {Array} dataList 表格数据
             */
            _addExtendAttr(dataList) {
                dataList.forEach(item => {
                    item.checked = false;
                });
            },

            /**
             * 为原数据添加是否选中属性 checked
             */
            _rewriteCheckedAttr() {
                const mainField = this.mainField;

                this.data.forEach(item => {
                    item.checked = this.selectedItems.some((selectedItem, index) => {
                        if (item[mainField] === selectedItem[mainField]) {
                            // 这里用原数据替换之前传入的数据 为了 数据的统一，
                            // 新选中的数据和传入的选中项数据异构时不方便处理
                            // 这里有一个坑，当传入的选中项在第二页并且用户没有翻到第二页时，第二页的那条选中数据不会被替换
                            this.selectedItems[index] = item;
                            return true;
                        }
                    });
                });
            },

            /**
             * 某一行数据的选中状态发生改变
             *
             * @param {Object} item 发生数据改变行的数据对象
             * @param {boolean} doComputeSelectAll 是否做全选状态的计算
             *                  某些情况下批量改变数据状态，没必要每次都计算
             */
            _selectChange(item, doComputeSelectAll) {
                // 移除一条选中数据
                if (item.checked) {
                    this.selectedItems.some((selectedItem, index) => {
                        if (item[this.mainField] === selectedItem[this.mainField]) {
                            this.selectedItems.splice(index, 1);
                        }
                    });
                }
                // 添加一条选中数据
                else {
                    this.selectedItems.push(item);
                }

                // 全选和反选时不需要每次都计算
                if (!doComputeSelectAll) {
                    this._computeSelectAll();
                }
                else {
                    item.checked = !item.checked;
                }
            },

            /**
             * 计算全选和反选状态
             */
            _computeSelectAll() {
                let firstRow = this.options.firstRow;
                if (firstRow.hasSelectAll) {
                    // 全部没选中
                    const noOneChecked = this.data.every(item => item.checked === false);

                    if (noOneChecked) {
                        firstRow.title = '全选';
                    }
                    else if (firstRow.canSwitchSelectInvertion) {
                        firstRow.title = '反选';
                    }
                }
            },

            /**
             * 反选(全选和反选在逻辑上都是反选)，
             * 注：在逻辑处理上只有当前页全不选中才是全选，否则就是反选
             */
            _inverseSelected() {
                this.data.forEach(item => {
                    this._selectChange(item, true);
                });
                this._computeSelectAll();
            },

            /**
             * 加载异步数据，共组件内部调用
             */
            _loadData() {
                if (typeof this.options.url !== 'string') {
                    return;
                }

                this.data = [];
                this.isShowText = true;
                this.text = '加载中...';

                let params = this._getParams();

                // 异步获取数据
                this.$http.get(this.options.url, {
                    params
                }).then(res => {
                    this.isShowText = false;

                    // 对外提供数据加工时机，来应对数据异构的情况
                    if (this.options.afterGetData) {
                        this.options.afterGetData(res);
                    }
                    this._addExtendAttr(res.body.data.list);
                    this.data = res.body.data.list;

                    // 数据条数处理
                    if (this.showPage) {
                        let config = this.options.pageConfig;
                        let dataTotalField = config.dataTotalField ? config.dataTotalField : 'total';
                        this.page.dataTotal = res.body.data[dataTotalField];

                        if (this.options.firstRow && this.options.firstRow.type === 'number') {
                            this.pageBase = (this.page.currentPage - 1) * this.page.pageSize;
                        }
                    }

                    if (this.data.length === 0) {
                        this.isShowText = true;
                        this.text = '暂未找到数据';
                    }

                    this._rewriteCheckedAttr();
                    this._computeSelectAll();
                }, res => {
                    this.isShowText = true;
                    this.text = res.body.statusInfo || '数据加载失败';
                });
            },

            _getParams() {
                // 搜索参数,默认值为空对象
                let params = this.searchData;

                // 固定参数
                if (typeof this.options.params === 'object') {
                    const staticParam = this.options.params;
                    for (let key in staticParam) {
                        if (staticParam.hasOwnProperty(key)) {
                            params[key] = staticParam[key];
                        }
                    }
                }

                // 页码处理
                if (this.showPage) {
                    let config = this.options.pageConfig;
                    let currentPageField = config.currentPageField ? config.currentPageField : 'currentPage';
                    params[currentPageField] = this.page.currentPage;
                    let pageSizeField = config.pageSizeField ? config.pageSizeField : 'pageSize';
                    config.pageSize = config.pageSize || 10;
                    params[pageSizeField] = config.pageSize;
                }

                return params;
            },

            /**
             * 翻页
             *
             * @param {number} currentPage 返到哪一页
             */
            _changePage(currentPage) {
                this.page.currentPage = currentPage;
                this._loadData();
            },

            // ##################### 私有方法 ##################### //

            /**
             * 对外提供搜索接口
             *
             * @param {Object} searchData 收索参数
             */
            search(searchData) {
                // 准备搜索数据
                if (typeof searchData === 'object') {
                    this.searchData = searchData;
                }

                this.page.currentPage = 1; // 重置页码
                this._loadData();
            },

            /**
             * 获取选中的行数据的数组
             *
             * @return {Array} 选中的行数据的数组
             */
            getSelectedItems() {
                return this.selectedItems;
            },

            /**
             * 获取选中的行数据主键的数组
             *
             * @return {Array} result 选中的行数据主键的数组
             */
            getSelectedItemsMainField() {
                let result = [];

                this.selectedItems.forEach(item => {
                    result.push(item[this.mainField]);
                });

                return result;
            },

            /**
             * 刷新当页数据
             */
            reloadData() {
                this._loadData();
            }
        }
    };
</script>
<style src="./index.less" lang="less"></style>