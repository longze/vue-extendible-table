# vue scalable table

> 可扩展的 vue 表格组件。

## 概述

此 vue 表格组件主要提供两个功能：

### 一、可扩展单元格

表格中的单元格如果样式比较丰富并且需要独立功能(如编辑，数字格式化)的时候不能很优雅的实现，我们希望能用一个独立插件来实现一个单元格的展现和相关功能。这个组件与市面上的其他组件的区别类似于"Angular 和 Vue" 或 "Express 与 Koa" 的区别，Angular 和 Express 是大而全的集成组件，而 Vue 与 Koa 是只提供核心功能和扩展能力。此表格组件当前只提供了一个插件(此插件是具有实际作用的，可被直接使用，不单纯为了展示，欢迎贡献更多的插件，插件的具体介绍放在插件本身的文档中，这里不展开)，插件可以被独立使用，不使用不引用不增加大小。

### 二、提供跨页选中核心功能

这是我们业务中用到的一个功能，发现市面上的表格组件都没有提供此功能，都需要通过业务代码来实现，所以此组件提供了此功能，此功能不适合以插件的形式实现。

## 组件使用方法

该组件要求 vue 版本 >=2.1.0。

### 参数示例 - options

表格的配置一般会比较多，所以我更倾向于使用 js 对象来配置

    options: {
        mainField: 'id',      // 默认主键为 "id"
        firstRow: {
            type: 'checkbox',  // 还有 'number'
            minChecked: 1,     // 只有 type 为 'checkbox' 时生效
            maxChecked: 5,     // 只有 type 为 'checkbox' 时生效
            // 挂 class 方便自定义样式，在表头和表体的单元格上都有，可以通过 th 和 td 来区分它们
            styleClass: ['a-class']
        },
        headers: [
            {
                title: '姓名',        // 表格标题
                field: 'name',        // 字段名，prop
                width: '50%',         // 宽度同时支持百分比和像素配置
                slot: 'text',         // 单元格组件的名称
                // 挂 class 方便自定义样式，在表头和表体的单元格上都有，可以通过 th 和 td 来区分它们
                styleClass: ['a-class']
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
            return res.body.list;
        },
        // 也可以通过配置 url 和 params 异步获取数据
        url: '/users',
        params: {
            name: '',
            pageSize: 10,
            currentPage: 1
        },
        // 页码的配置，不配置此项时不显示页码
        pageConfig: {
            currentPageField: 'currentPage',  // 向后台请求时的字段名 -- 请求第几页数据，缺省值 "currentPage"
            pageSizeField: 'pageSize',   // 向后台请求时的字段名 -- 每页要几条，缺省值 "pageSize"
            dataTotalField: 'total',     // 后台返回数据总条数的字段设置，缺省值 "total"
            pageSize: 10                 // 默认每页 10 条
        },
        // 还可以添加其他参数，作为插件的数据源，插件中可以用 props.options. 来引用
        ... 
    }

### 对外方法

`search` 方法，按搜索条件重新加载表格数据，参数就是要搜索的表单数据。

`reloadData` 方法，用来刷新表格当前页。

`getSelectedItems` 和 `getSelectedItemsMainField` 方法，可用来获取跨页选中的结果。

### 插件使用方法

单元格组件需要在模板中进行注册才能生效，需要注意的是必须在组件外面包一层 `template` 标签来传递 `scope`，其中的 `slot` 值和上面 `options.headers` 中数据项的 `slot` 字段对应，需要使用动态组件渲染某列单元格的通过这样一个对应关系来配置。

    <table-component :options="tableOptions">
        <template slot="text" scope="props">
            <vst-text-plugin :data="props.data"></vst-text-plugin>
        </template>
        <template slot="number" scope="props">
            <vst-number-plugin 
                :data="props.data" 
                :table="props.table" 
                :plugin-data="props.headerOptions.pluginData">
            </vst-number-plugin>
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
        headerOptions,   // 当前单元格的配置信息
        table,           // 表格的引用，可以通过此参数直接使用表格的方法
        options          // 配置 table 的数据，可以用来传递插件特有数据
    }

插件可以直接使用上面的数据实现自身的逻辑。注意：在可扩展表格的设计上给了插件很大的操作空间，可以直接操作表格的数据，这可能影响到其他插件的运行和表格整体的展现。

## 开发方式

安装依赖

    npm install
    
启动运行
    
    gulp

## 开发花絮

*为什么分页和多选不是插件*

如果将分页和多选也以插件的形式传入，每次使用的时候都需要引用分页和多选组件引用，由于多数后台系统对速度不是很敏感，所以在资源大小和使用方便上选择了后者。另外在做跨页选中的时候，多选框以插件的形式传入有一部分逻辑需要写进业务代码，而这部分逻辑是通用的。哪些东西需要内聚哪些东西需要解耦是经过场景定制的(脱离场景谈架构设计是耍流氓)，比如很多表格最后一列是操作按钮，这一列的逻辑是和业务相关的，所以这一列我们希望通过组件的形式来传入。

## 参考

[karma+webpack搭建vue单元测试环境](http://www.jianshu.com/p/a515fbbdd1b2)
