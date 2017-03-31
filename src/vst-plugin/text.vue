<template>
    <div>
        {{data}}
    </div>
</template>
<script>
    export default {
        props: {
            data: String,
            lineData: Object,
            tableData: Array,
            columnOptions: Object
        },
        data: function () {
            return {};
        }
    };
</script>
