---
title: webpack异步路由的bug
date: 2016-08-30 16:07:19
tags: webpack
category: 开发日志
---
### bug描述：
假设我们为了缓存持久化，而给所有 js 文件名都加上了 chunkhash，当某个路由的js文件内容发生了改变，那么这个路由的 js 文件名的 chunkhash 会因此而变化，但是主入口文件的 js 文件的 chunkhash 并没有因此而改变，最终导致用户在浏览器中拿到的是旧的入口 js ，而这个旧的入口 js 中引用的是旧的路由 js 名。<!--more-->

### 解决方案：
在wenpack的配置文件中，将```output.filename```中的```[chunkhash]```改为```[hash]```。
根据官网的描述：
>[hash] is replaced by the hash of the compilation.
[chunkhash] is replaced by the hash of the chunk.

###### 9.13更新：
改用 hash 的解决方法并不好，因为 hash 是依据“编译”来决定的，而 chunkhash 是依据代码内容决定的。
所以问题的关键是要让打包后的 js 代码中对 entry 文件 hash 能正确更新。
查阅相关资料后，发现 webpack 将这些信息记录在 webpackManifest 这个变量里。
又发现 [chunk-manifest-webpack-plugin](https://github.com/soundcloud/chunk-manifest-webpack-plugin) 这个插件可以把这个变量挂在到 window上，并且在打包的时候生成 entry 的 hash 信息到 json 中。但是这个插件并没有把这段信息自动注入 html 中。
最终，在这个插件的基础稍微增加了几行代码，使它可以配合 [webpack-html-plugin](https://github.com/jantimon/html-webpack-plugin)，自动将信息注入 html 中。
目前可以配合我写的这个插件 [html-file-webpack-plugin](https://github.com/ibufu/html-file-webpack-plugin) 使用,本插件的作用是把 webpack 的产物的源码注入到 html 中。