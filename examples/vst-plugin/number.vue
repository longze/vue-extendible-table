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
            this.table.testFn();
            return {};
        }
    };
</script>
