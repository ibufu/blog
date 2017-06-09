---
title: 前端模块化实践----使用webpack打包js代码
date: 2015-12-26 19:13
tags: webpack
category: 旧文重忆
---
最近在写一个后台管理页面，前端纯html来写，后台只负责提供接口。
初期的计划是用angular来写，但后来需求要兼容IE6，加之时间有限，所以放弃了框架的使用。
我用了commonJS来打包js模块，其他功能并没有使用。 <!--more-->
### 第一步，安装webpack
```bash
npm install webpack -g
npm install webpack --save-dev
```
### 第二步，修改webpack.config.js
这是我现在项目里用的config.js
```js
var webpack = require("webpack");
var path = require("path");

module.exports = {
    plugins: [
        new webpack.ProvidePlugin({ //这是把jquery挂到全局上，不用每个模块都去require
            "$": 'jquery',
            "jQuery": 'jquery'
        }),
        new webpack.optimize.CommonsChunkPlugin('common.js') //有多个入口文件的话提取公共部分，利用浏览器缓存
    ],
    entry: {
        "price/roomEntry": "./static/js/app/src/price/roomEntry.js", //入口文件的作用是进行页面的初始化，比如一些事件绑定，初始数据加载都是放在这里的。每个页面都可以有一个入口文件
        "inventory/room": "./static/js/app/src/inventory/room.js"
    },
    output: {
        path: path.join(__dirname, 'static/js/app/dist'),  //设置打包后的js的输出位置
        filename: "[name].js",  //和入口文件的名字相同
        publicPath: "./dist/"  //浏览器会从这个目录开始查找模块
    },
    resolve: {
        extensions: ['.js', ""],
        alias: {  //注册模块，以后用的时候可以直接requier("模块名")
            cookie: path.join(__dirname,"./static/js/jquery.cookie.js"),
            jquery: path.join(__dirname,"./static/js/jquery.min.js"),
            header: path.join(__dirname,"./static/js/app/src/common/header.js"),
            leftMenu: path.join(__dirname,"./static/js/app/src/common/leftMenu.js"),
            util: path.join(__dirname,"./static/js/app/src/common/util.js"),
            logout: path.join(__dirname,"./static/js/app/src/common/logout.js"),
            AJAXService: path.join(__dirname,"./static/js/app/src/common/AJAXService.js"),
            laydate: path.join(__dirname,"./static/js/lib/laydate/laydate.js"),
            accommodationPriceList: path.join(__dirname,"./static/js/app/src/price/accommodationPriceList.js"),
            virtualDOM: path.join(__dirname,"./static/js/app/src/common/virtualDOM.js"),
            trToggle: path.join(__dirname,"./static/js/app/src/common/trToggle.js")
        }
    },
    devtool: "sourcemap"  //生成用来调试的map
}
```

模块文件的写法，我用的commonJS

先写一个对象
```js
//module1.js

var object = {

    foo: function(){

       ...

      }

}

module.exports = object;
```

然后别的模块想用里面的方法就可以

```js
var object = require("module1");

object.foo;
```
大概的用法就是这样了，还有些功能可以去官网查查。

[原文](http://www.cnblogs.com/ibufu/p/5078684.html)
