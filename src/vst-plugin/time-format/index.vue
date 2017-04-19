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
                let Y = date.getFullYear();
                let M = date.getMonth() + 1;
                let D = date.getDate();

                let h = date.getHours();
                let m = date.getMinutes();
                let s = date.getSeconds();

                M = M < 10 ? '0' + M : M;
                D = D < 10 ? '0' + D : D;
                h = h < 10 ? '0' + h : h;
                m = m < 10 ? '0' + m : m;
                s = s < 10 ? '0' + s : s;

                text = ''
                    // 年月日
                    + Y
                    + '-'
                    + M
                    + '-'
                    + D
                    // 时分秒
                    + ' '
                    + h
                    + ':'
                    + m
                    + ':'
                    + s;
            }

            return {
                text
            };
        }
    };
</script>