<template>
    <table class="vst-table">
        <thead>
        <tr>
            <th v-for="item in options.columns">
                {{item.label}}
            </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in data">
            <td v-for="column in options.columns">
                <slot :name="column.fieldName"
                      :data="item[column.fieldName]"
                      :lineData="item"
                      :tableData="data"
                      :columnOptions="column"
                      :table="table">
                </slot>
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
