# text-map

> 键值转换插件。

## 使用方法

    // 引用
    import textMap from '../src/vst-plugin/text-map';
    
    // props 说明
    
    // 模板
    <text-map
            :data-map="dataMap"
            :value="value"
            :empty-str="-"
            :style-class="['a-class', 'b-class']">
    </text-map>

## props 说明

data-map，必要参数，键值的对应数据，形式如下：

    [
        {
            text: '文字一',
            value: 1
        },
        {
            text: '文二',
            value: 2
        }
    ]

value，必要参数，值。

empty-str，可选参数，默认值 `-`，没有匹配项时文本值。

style-class，可选参数，样式。
