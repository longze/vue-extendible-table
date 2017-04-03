# vue scalable table

> 可扩展的vue表格组件，造这个轮子主要出于两个目的，
第一：表格中的单元格如果样式比较丰富并且需要独立功能(如编辑，数字格式化)的时候不能很优雅的实现，我们希望能用一个独立组件来实现一个单元格的展现和相关功能；
第二：项目中有多处需要表格可以支持跨页选中，但找了几个开源的vue表格组件，它们并没有提供此功能。

## 组件使用方法

该组件要求 vue 版本 >=2.1.0。

### 参数示例 - options

表格的配置一般会比较多，所以我更倾向于使用 js 对象来配置

    options: {
        mainField: 'id',
        headers: [
            {
                title: '姓名',        // 表格标题
                field: 'name',        // 字段名，prop
                width: '50%',         // 宽度同时支持百分比和像素配置
                slot: 'text'          // 单元格组件的名称
            },
            {
                title: '年龄',
                field: 'age',
                width: '180px',
                slot: 'number'
            }
        ],
        // 可以直接展示数据
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
        // 返回的数据可能是一个复杂结构，可以自定义获取数据的方法，也可以做一些数据加工
        afterGetData(res) {
            // 可以对 res 做数据加工
            // 组件期待的格式是这样：
            /*
            {
                "code": 200,
                "msg": "",
                "data": {
                    "list": [
                        {
                            name: 'jerry from service',
                            age: 1
                        },
                        {
                            name: 'tom',
                            age: 3
                        }
                    ],
                    "total": 50
                }
            }
            */
            return res.body.list;
        },
        getData (res) {
            return res.body.data;
        },
        // 也可以通过配置 url 和 params 异步获取数据
        url: '/users',
        params: {
            name: '',
            pageSize: 10,
            currentPage: 1
        }
    }
    
### 插件使用方法

单元格组件需要在模板中进行注册才能生效，需要注意的是必须在组件外面包一层 `template` 标签来传递 `scope`，其中的 `slot` 值和上面 `options.headers` 中数据项的 `slot` 字段对应，需要使用动态组件渲染某列单元格的通过这样一个对应关系来配置。

    <table-component :options="tableOptions">
        <template slot="text" scope="props">
            <vst-text-plugin :data="props.data"></vst-text-plugin>
        </template>
        <template slot="number" scope="props">
            <vst-number-plugin :data="props.data" :table="props.table"></vst-number-plugin>
        </template>
    </table-component>

其中表格的插件需要在表格的父组件中与表格一起声明引用：

    components: {
        'table-component': tableComponent,
        'vst-text-plugin': vstTextPlugin,
        'vst-number-plugin': vstNumberPlugin
    }

## 插件规范

动态组件在原理上使用 vue 在 2.1.0 提供的新特性[作用域插槽](https://cn.vuejs.org/v2/guide/components.html#作用域插槽)。对插件提供了如下数据：

    {
        data,            // 当前单元格的数据
        lineData,        // 当前单元格所在行的数据
        tableData,       // 表格的整体数据
        columnOptions,   // 当前单元格的配置信息
        table            // 表格的引用，可以通过此参数直接使用表格的方法
    }

插件可以直接使用上面的数据实现自身的逻辑。注意：在可扩展表格的设计上给了插件很大的操作空间，可以直接操作表格的数据，这可能影响到其他插件的运行和表格整体的展现。

## 开发方式

格式检验
    
    ./node_modules/.bin/eslint src

