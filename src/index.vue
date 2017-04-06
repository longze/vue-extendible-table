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
            this.initSelectedItems();
            this.loadData();
        },
        components: {
            'el-checkbox': ElCheckbox,
            'el-pagination': ElPagination
        },
        data () {
            return {
                data: this.options.data || [],
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
            showPage () {
                return typeof this.options.pageConfig === 'object';
            }
        },
        methods: {
            initSelectedItems () {
                let selectedItems = [];
                let optionsSelectedItems = this.options.selectedItems;

                if (Array.isArray(optionsSelectedItems) && optionsSelectedItems.length > 0) {
                    let dataType = typeof optionsSelectedItems[0];
                    // 直接传入以主键为元素的数组
                    if (dataType === 'number' || dataType === 'string') {
                        selectedItems = [];
                        let mainField = this.mainField;
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
            reloadData () {
                this.loadData();
            },
            search (searchData) {
                // 准备搜索数据
                if (typeof searchData === 'object') {
                    this.searchData = searchData;
                }
                // 重置页码
                this.page.currentPage = 1;
                this.loadData();
            },
            loadData () {
                if (this.options.url) {
                    this.data = [];
                    this.isShowText = true;
                    this.text = '加载中...';

                    // 固定参数
                    let params = (typeof this.options.params === 'object') ? this.options.params : {};

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
                        if (this.options.afterGetData) {
                            this.options.afterGetData(res);
                        }

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


                    }, res => {
                        this.isShowText = true;
                        this.text = res.body.statusInfo || '数据加载失败';
                    });
                }
            },
            changePage (currentPage) {
                this.page.currentPage = currentPage;
                this.loadData();
            }
        }
    };
</script>
<style src="./index.less" lang="less"></style>
