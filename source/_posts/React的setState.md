---
title: React的setState
date: 2016-12-09 11:54:59
tags: React
category: 知识碎片
---
## WHAT
### `setState(nextState, callback)`
> Performs a shallow merge of nextState into current state. This is the primary method you use to trigger UI updates from event handlers and server request callbacks.

将当前state和新的state执行浅合并。触发视图更新的主要方法（另一个方法：`forceUpdate()`）。
<!--more-->
> The first argument can be an object (containing zero or more keys to update) or a function (of state and props) that returns an object containing keys to update( function(state, props) => newState ).

第一个参数可以是object，也可以是一个返回object的function。

> The second parameter is an optional callback function that will be executed once setStateis completed and the component is re-rendered. Generally we recommend using `componentDidUpdate()` for such logic instead.

第二个参数是state更新且组件重新渲染后的回调。

> `setState()` -> 触发re-render( 判断`shouldComponentUpdate()` )

不论state是否变化都会 re-render。

## HOW
### 事务：  
```js
{  
    // 做一些事  
    // 真正的方法  
    // 做一些事  
}
```

react内部有一个事务机制，一个组件触发更新便会进入事务之中，往往子组件的更新都是处于父组件的事务之中。在事务进行中，会合并`state`，把需要更新的组建加入一个队列中。只有在事务结束后，才会批量地更新所有组件。


## WHY
### 为什么异步？

There is no guarantee of synchronous operation of calls to setState and calls may be batched for performance gains.

批量处理以提高性能。
