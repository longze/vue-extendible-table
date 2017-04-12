<template>
    <span :class="styleClass">{{text}}</span>
</template>
<script>
    /**
     * ...
     */
    export default {
        props: {
            /**
             * ...
             */
            format: {
                type: String,
                default: ''
            },
            // 值
            value: {
                default() {
                    return new Date().getTime();
                }
            },
            // 匹配不到 value 时的 text 值
            emptyStr: {
                type: String,
                default: '-'
            },
            // 自定义 class 样式，方便自定义格式
            styleClass: {
                type: Array,
                default: () => []
            }
        },
        data() {
            // todo 参考下面来一个全功能的
            // https://github.com/qiqiboy/the_time/blob/master/the_time.js
            let text = this.emptyStr;

            // 按 map 将 value 转换成 text
            if (this.value) {
                let date = new Date(+this.value);
                // todo Invalid Date 判断
                let m = date.getMonth() + 1;
                let d = date.getDate();
                let h = date.getMinutes();

                m = m < 10 ? '0' + m : m;
                d = d < 10 ? '0' + d : d;
                h = h < 10 ? '0' + h : h;


                text = ''
                    + date.getFullYear()
                    + '-'
                    + m
                    + '-'
                    + d
                    + ' '
                    + h
                    + ':'
                    + h;
            }

            return {
                text
            };
        }
    };
</script>