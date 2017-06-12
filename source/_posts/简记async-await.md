---
title: 简记async await
date: 2016-08-31 10:42
tags:
- javascript
- async
- await
category: 知识碎片
---
### 简述：

**async** 用于声明一个包含异步操作的函数。
在 async 函数中，用 **await** 表示一个异步操作（**Promise** 对象）。
当函数执行到 **await** 时，函数会暂停，保存上下文环境，等待执行结果。<!--more-->
### 例子1：

``` javascript
function timeout(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}


async function asyncPrint(value, ms) {
    await timeout(ms);
    console.log(value);
}

asyncPrint('hello world', 50);
```
### 例子2：

``` javascript
(async function() {
    const result = await callApi('/directNet/getCampInfo', { campId });
        console.log(result);
}());
```
### 循环:

要在for循环中使用，不能使用forEach。
### 异常:

``` javascript
try {
     await foo();
} catch (e) {
     console.log(e);
}
```
### then操作：

async函数返回的是一个promise对象，所以可以在后面进行链式操作。