<template>
    <div class="container-vst">
        <table class="vst-table">
            <thead>
            <tr>
                <th v-for="item in options.columns">
                    {{item.title}}
                </th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in data">
                <td v-for="column in options.columns">
                    <slot v-if="column.slot" :name="column.slot"
                          :data="item[column.field]"
                          :lineData="item"
                          :tableData="data"
                          :columnOptions="column"
                          :table="table">
                    </slot>
                    <template v-else>
                        {{item[column.field]}}
                    </template>
                </td>
            </tr>
            </tbody>
        </table>
        <div class="vst-text" v-show="isShowText">
            {{text}}
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            options: Object
        },
        mounted () {
            this.loadData();
        },
        data () {
            return {
                data: this.options.data || [],
                table: this,
                isShowText: false,
                text: ''
            }
        },
        methods: {
            reloadData () {
                this.loadData();
            },
            loadData () {
                this.data = [];
                if (this.options.url) {
                    this.isShowText = true;
                    this.text = '加载中...';
                    this.$http.get(this.options.url, {
                        params: this.options.params || {}
                    }).then(res => {
                        this.isShowText = false;
                        this.data = res.body.data;
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
