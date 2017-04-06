<template>
    <span :class="styleClass">{{text}}</span>
</template>
<script>
    export default {
        props: {
            /**
             * 键值对数据，数据格式:
             * [{
             *      value: 1,
             *      text: '通过'
             * }]
             */
            dataMap: {
                type: Array,
                required: true
            },
            value: {
                required: true
            },
            // 匹配不到 value 时的 text 值
            emptyStr: {
                type: String,
                default: '-'
            },
            styleClass: {
                type: Array,
                default: []
            }
        },
        data: function () {
            let text = this.emptyStr;
            this.dataMap.some((item) => {
                if (item.value === this.value) {
                    text = item.text;
                    return true;
                }
            });

            return {
                text
            };
        }
    };
</script>