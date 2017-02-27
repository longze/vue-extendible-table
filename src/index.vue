<template>
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
</template>
<script>
    export default {
        props: {
            options: Object
        },
        data: function () {
            return {
                data: this.options.data || [],
                table: this
            }
        },
        methods: {
            testFn: function () {
                console.log('testFn');
            }
        }
    };
</script>
<style src="./index.less" lang="less"></style>
