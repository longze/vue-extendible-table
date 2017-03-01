<template src="./index.tpl.html"></template>
<script>
    export default {
        props: {
            options: Object
        },
        mounted () {
            this.initSelectedItems();
            this.loadData();
        },
        data () {
            return {
                data: this.options.data || [],
                table: this,
                isShowText: false,
                text: '',
                mainField: this.options.mainField || 'id',
                selectedItems: [],
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
                            })
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
            loadData () {
                if (this.options.url) {
                    this.data = [];
                    this.isShowText = true;
                    this.text = '加载中...';
                    this.$http.get(this.options.url, {
                        params: this.options.params || {}
                    }).then(res => {
                        this.isShowText = false;
                        if (this.options.getData) {
                            this.data = this.options.getData(res);
                        }
                        else {
                            this.data = res.body.data;
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
            }
        }
    };
</script>
<style src="./index.less" lang="less"></style>
