# vue scalable table

> 可扩展的vue表格组件，造这个轮子主要出于两个目的，第一：表格中的单元格如果样式比较丰富并且需要独立功能(如编辑，数字格式化)的时候不能很优雅的实现，我们希望能用一个独立组件来实现一个单元格的展现和相关功能；第二：项目中有多处需要表格可以支持跨页选中，但找了几个开源的vue表格组件，它们并没有提供此功能。

## 组件使用方法

### 参数示例 - options

表格的配置一般会比较多，所以我更倾向于使用 js 对象来配置

    options: {
        columns: [
            {
                title: '姓名',        // 表格标题
                field: 'name',        // 字段名，prop
                width: '50%',         // 宽度同时支持百分比和像素配置
                slot: 'text'          // 单元格组件的名称
            },
            {
                label: '年龄',
                field: 'age',
                width: '180px',
                slot: 'number'
            }
        ],
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
        url: '/users',
        params: {
            name: '',
            pageSize: 10,
            currentPage: 1
        }
    }
    
### 动态组件

单元格组件需要在模板中进行注册才能生效，需要注意的是必须在组件外面包一层 `template` 标签，其中的 `slot` 值和上面 `options.columns` 中数据项的 `slot` 字段对应，需要使用动态组件渲染某列单元格的通过这样一个对应关系来配置。

    <table-component :options="tableOptions">
        <template slot="text" scope="props">
            <table-widget-text :data="props.data"></table-widget-text>
        </template>
        <template slot="number" scope="props">
            <table-widget-number :data="props.data" :table="props.table"></table-widget-number>
        </template>
    </table-component>

## 表格插件规范

## 设计思路


## 开发方式

格式检验
    
    ./node_modules/.bin/eslint src

