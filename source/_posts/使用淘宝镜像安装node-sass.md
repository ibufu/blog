---
title: 使用淘宝镜像安装node-sass
date: 2016-03-11 14:03:18
tags: node-sass
category: 知识碎片
---
因为node-sass的安装脚本被墙的缘故，经常会导致node-sass安装失败，可以使用淘宝镜像来安装。
## windows:
```bash
set SASS_BINARY_SITE=https://npm.taobao.org/mirrors/node-sass/
```

## linux:
```bash
export SASS_BINARY_SITE=https://npm.taobao.org/mirrors/node-sass/
```
