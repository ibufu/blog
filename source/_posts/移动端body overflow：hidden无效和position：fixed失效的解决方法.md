---
title: 移动端body overflow：hidden无效和position：fixed失效的解决方法
date: 2016-12-16 14:25:05
tags: css
category: 开发日志
---
## 一、移动端body overflow：hidden无效的解决方法
```css
body, html {
    height: 100%;
    overflow: hidden;
}
```

## 二、移动端position：fixed失效的解决方法
失效的原因是键盘弹出时导致fixed变为absolute。解决方法是不让body超出视口，用其它元素作为滚动的容器。