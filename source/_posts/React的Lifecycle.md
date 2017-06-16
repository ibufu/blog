---
title: React的Lifecycle
date: 2016-11-28 11:25:31
tags: React
category: 知识碎片
---
## WHAT
### Mounting

> These methods are called when an instance of a component is being created and inserted into the DOM:

当组件实例被创建和插入 dom 时，这些方法会被调用：

- constructor()

- componentWillMount()

- render()

- componentDidMount()
<!--more-->

### Updating
> An update can be caused by changes to props or state. These methods are called when a component is being re-rendered:

`props` 和 `state` 的改变会造成组件的更新。当组件重渲染的时候这些方法会被调用：

- componentWillReceiveProps()

- shouldComponentUpdate()

- componentWillUpdate()

- render()

- componentDidUpdate()

### Unmounting

This method is called when a component is being removed from the DOM:

当组件将被销毁的时候，此方法会被调用：

- componentWillUnmount()

## WHY
为什么事件绑定的函数需要绑定this，而这些生命周期函数不需要绑定this？  
一个猜想，再调用时可能是 组件.func()

## TIPS

### render()
保持pure。不要改变state。

### constructor()
初始化state。

### componentWillMount()
因为还没有渲染，所以不会导致重新渲染。
This is the only lifecycle hook called on server rendering.

### componentWillReceiveProps()
componentWillReceiveProps() is invoked before a mounted component receives new props.
但也有可能props没有变化，一般发生在父组件导致的重新渲染。

### componentWillUpdate()
不要在这里调用setState（）

