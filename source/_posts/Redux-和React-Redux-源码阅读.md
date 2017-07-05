---
title: Redux 和 React Redux 源码阅读
date: 2017-07-04 18:53:53
tags: 
 - React
 - Redux
category: 知识碎片
---
一年前看过一遍，看完后感觉良好，但是过了一段时间一些细节记不清了，Orz。今年再看一遍，顺便记录下来。
Redux 这方面必须整得明明白白 :D

## Redux
![Redux](https://ooo.0o0.ooo/2017/07/05/595c8e1b90d80.png)

### 目录结构
```
├── utils/
│     ├── warning.js 
├── applyMiddleware.js
├── bindActionCreators.js
├── combineReducers.js
├── compose.js
├── createStore.js
├── index.js # 入口文件
```

### compose(...funcs)

```js
/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */

export default function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}

```