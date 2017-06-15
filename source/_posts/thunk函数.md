---
title: thunk函数
date: 2016-11-29
tags: JavaScript
category: 知识碎片
---
> 在 JavaScript 语言中，Thunk 函数替换的不是表达式，而是多参数函数，将其替换成单参数的版本，且只接受回调函数作为参数。

<!--more-->

```js
// 正常版本的readFile（多参数版本）
fs.readFile(fileName, callback);

// Thunk版本的readFile（单参数版本）
var readFileThunk = Thunk(fileName);
readFileThunk(callback);

var Thunk = function (fileName){
    return function (callback) {
        return fs.readFile(fileName, callback);
    };
};
```

任何函数，只要参数有回调函数，就能写成 Thunk 函数的形式。下面是一个简单的 Thunk 函数转换器。
```js
var Thunk = function(fn) {
    return function () {
        var args = Array.prototype.slice.call(arguments);
        return function(callback) {
            args.push(callback);
            return fn.apply(this, args);
        }
    };
};
```

使用上面的转换器，生成 fs.readFile 的 Thunk 函数。

```js
var readFileThunk = Thunk(fs.readFile);
readFileThunk(fileA)(callback);
```

> A thunk is a function that wraps an expression to delay its evaluation.

```js
// calculation of 1 + 2 is immediate
// x === 3
let x = 1 + 2;

// calculation of 1 + 2 is delayed
// foo can be called later to perform the calculation
// foo is a thunk!
let foo = () => 1 + 2;
```

**redux-thunk**
```js
function createThunkMiddleware(extraArgument) {
    return ({ dispatch, getState }) => next => action => {
        if (typeof action === 'function') {
            return action(dispatch, getState, extraArgument);
        }

        return next(action);
    };
}

const thunk = createThunkMiddleware();

thunk.withExtraArgument = createThunkMiddleware;

export default thunk;
```
参考：
[Thunk 函数的含义和用法](http://www.ruanyifeng.com/blog/2015/05/thunk.html)  
[redux-thunk](https://github.com/gaearon/redux-thunk)