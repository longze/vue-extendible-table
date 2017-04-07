<template src="./index.tpl.html"></template>
<script>

    import 'element-ui/lib/theme-default/index.css';
    import ElCheckbox from 'element-ui/lib/checkbox';
    import 'element-ui/lib/theme-default/checkbox.css';
    import ElPagination from 'element-ui/lib/pagination';
    import 'element-ui/lib/theme-default/pagination.css';

    export default {
        props: {
            options: {
                type: Object,
                require: true
            }
        },
        mounted () {
            // 处理配置的默认值
            let firstRow = this.options.firstRow;

            if (firstRow && firstRow.type === 'checkbox') {
                firstRow.hasSelectAll = firstRow.hasSelectAll === undefined ? true : firstRow.hasSelectAll;
                let canSI = firstRow.canSwitchSelectInvertion;
                firstRow.canSwitchSelectInvertion = canSI === undefined ? true : canSI;
                firstRow.isOverPage = firstRow.isOverPage === undefined ? true : firstRow.isOverPage;

                let dataList = [];
                // 将双向绑定属性洗白成简单对象数据，
                // 这样就可以触发 this.data 赋值时的双向绑定计算
                if (Array.isArray(this.options.data)) {
                    this.options.data.forEach(item => {
                        let newItem = {};
                        for (let key in item) {
                            if (item.hasOwnProperty(key)) {
                                newItem[key] = item[key];
                            }
                        }
                        dataList.push(newItem);
                    });
                }

                this.addExtendAttr(dataList);
                this.data = dataList;

                let mainField = this.options.mainField || 'id';
                this.initSelectedItems(mainField);

                if (this.data.length > 0) {
                    this.rewriteCheckedAttr();
                }

                this.computeSelectAll();
            }

            this.loadData();
        },
        components: {
            'el-checkbox': ElCheckbox,
            'el-pagination': ElPagination
        },
        data () {
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
            }
        },
        computed: {
            // 是否显示页码
            showPage() {
                return typeof this.options.pageConfig === 'object';
            }
        },
        methods: {
            getSelectedItems() {
                return this.selectedItems;
            },
            getSelectedItemsMainField() {
                let result = [];

                this.selectedItems.forEach(item => {
                   result.push(item[this.mainField]);
                });

                return result;
            },
            /**
             * 对回写数据做兼容处理，选中项数组，可以是主键的数组，也可以是选中对象的数组
             * 主键的数组的两种数据类型：
             * [1, 2] 或 ['1', '2']
             * 选中对象的数组：
             * [{id: 1, name: ''}, {id: 2, name: ''}]
             *
             * @param {String} mainField 主键字段
             */
            initSelectedItems(mainField) {
                let selectedItems = [];
                let optionsSelectedItems = this.options.selectedItems;

                if (Array.isArray(optionsSelectedItems) && optionsSelectedItems.length > 0) {
                    let dataType = typeof optionsSelectedItems[0];

                    // 直接传入以主键为元素的数组
                    if (dataType === 'number' || dataType === 'string') {
                        selectedItems = [];
                        optionsSelectedItems.forEach(item => {
                            selectedItems.push({
                                [mainField]: item
                            });
                        });
                    }
                    // 传入以对象为元素的数组
                    else {
                        selectedItems = this.options.selectedItems;
                    }
                }

                this.selectedItems = selectedItems;
            },
            // 添加扩展字段，用于实现表格的操作逻辑
            addExtendAttr(dataList) {
                dataList.forEach(item => {
                    item.checked = false;
                });
            },
            // 为原数据添加是否选中属性 checked
            rewriteCheckedAttr() {
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
            // 某一行数据的选中状态发生改变
            selectChange(item, doComputeSelectAll) {
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
                item.checked = !item.checked;

                // 全选和反选时不需要每次都计算
                if (!doComputeSelectAll) {
                    this.computeSelectAll();
                }
            },
            // 计算全选和反选状态
            computeSelectAll() {
                let firstRow = this.options.firstRow;
                if (firstRow.hasSelectAll) {
                    // 全部没选中
                    let noOneChecked = this.data.every(item => {
                        return item.checked === false;
                    });

                    if (noOneChecked) {
                        firstRow.title = '全选';
                    }
                    else if (firstRow.canSwitchSelectInvertion) {
                        firstRow.title = '反选';
                    }
                }
            },
            // 反选, 全选和反选在逻辑上都是反选，
            // 注：在逻辑处理上只有当前页全不选中才是全选，否则就是反选
            inverseSelected() {
                this.data.forEach(item => {
                    this.selectChange(item, true);
                });
                this.computeSelectAll();
            },
            // 刷新当页数据
            reloadData() {
                this.loadData();
            },
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
                // 重置页码
                this.page.currentPage = 1;

                this.loadData();
            },
            // 加载异步数据，共组件内部调用
            loadData() {
                if (this.options.url) {
                    this.data = [];
                    this.isShowText = true;
                    this.text = '加载中...';

                    // 固定参数
                    let params = typeof this.options.params === 'object' ? this.options.params : {};

                    // 搜索参数
                    for (let key in this.searchData) {
                        if (this.searchData.hasOwnProperty(key)) {
                            params[key] = this.searchData[key];
                        }
                    }

                    // 页码处理
                    let pageSize;
                    if (this.showPage) {
                        let config = this.options.pageConfig;
                        let currentPageField = config.currentPageField ? config.currentPageField : 'currentPage';
                        params[currentPageField] = this.page.currentPage;
                        let pageSizeField = config.pageSizeField ? config.pageSizeField : 'pageSize';
                        pageSize = config.pageSize || 10;
                        params[pageSizeField] = pageSize;
                    }

                    // 异步获取数据
                    this.$http.get(this.options.url, {
                        params: params
                    }).then(res => {
                        this.isShowText = false;

                        // 对外提供数据加工时机，来应对数据异构的情况
                        if (this.options.afterGetData) {
                            this.options.afterGetData(res);
                        }
                        this.addExtendAttr(res.body.data.list);
                        this.data = res.body.data.list;

                        // 数据条数处理
                        if (this.showPage) {
                            let config = this.options.pageConfig;
                            let dataTotalField = config.dataTotalField ? config.dataTotalField : 'total';
                            this.page.dataTotal = res.body.data[dataTotalField];

                            if (this.options.firstRow && this.options.firstRow.type === 'number') {
                                this.pageBase = (this.page.currentPage - 1) * pageSize;
                            }
                        }

                        if (this.data.length === 0) {
                            this.isShowText = true;
                            this.text = '暂未找到数据';
                        }

                        this.rewriteCheckedAttr();
                        this.computeSelectAll();
                    }, res => {
                        this.isShowText = true;
                        this.text = res.body.statusInfo || '数据加载失败';
                    });
                }
            },
            /**
             * 翻页
             *
             * @param {Number} currentPage 返到哪一页
             */
            changePage(currentPage) {
                this.page.currentPage = currentPage;
                this.loadData();
            }
        }
    };
</script>
<style src="./index.less" lang="less"></style>
