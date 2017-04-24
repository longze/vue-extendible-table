# time-format

> 时间格式化插件。

## 使用方法

    // 引用
    import timeFormat from '../src/vst-plugin/time-format';
    
    // 模板
    <time-format
            :value="value"
            :format="dataMap"
            :empty-str="-"
            :style-class="['a-class', 'b-class']">
    </time-format>

## props 说明

format，非必要参数，默认值...

    

value，必要参数，值。

empty-str，可选参数，默认值 `-`，没有匹配项时文本值。

style-class，可选参数，样式。
