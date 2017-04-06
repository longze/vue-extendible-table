<template>
    <span :class="styleClass">{{text}}</span>
</template>
<script>
    /**
     * 经常有后端提供 value，前端通过一个 map 转成对应的 text 的需求，
     * 这个组件可以用在表格中，也可以单独使用
     */
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
                default: () => {
                    return [];
                }
            }
        },
        data: function () {
            let text = this.emptyStr;

            // 按 map 将 value 转换成 text
            if (Array.isArray(this.dataMap)) {
                this.dataMap.some((item) => {
                    if (item.value === this.value) {
                        text = item.text;
                        return true;
                    }
                });
            }

            return {
                text
            };
        }
    };
</script>