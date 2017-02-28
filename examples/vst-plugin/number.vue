<template>
    <div>
        {{data}}
    </div>
</template>
<script>
    export default {
        props: {
            data: Number,
            lineData: Object,
            tableData: Array,
            columnOptions: Object,
            table: Object
        },
        data: function () {
            // 可以直接使用table的方法
            // this.table.testFn();
            return {};
        }
    };
</script>
