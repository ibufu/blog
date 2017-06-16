---
title: React中的PureRenderMixin和PureComponent
date: 2016-11-28 11:00:28
tags: React
Category: 知识碎片
---
## WHAT
> Under the hood, the mixin implements `shouldComponentUpdate`, in which it compares the current props and state with the next ones and returns `false` if the equalities pass.

实现了 shouldComponentUpdate，比较当前的props和state和将要变化的值，如果一样就返回false。
<!--more-->
## HOW
浅比较（因此有必要用不可变数据，或者复杂结构变化时返回新的引用）。

## WHY
优化性能，避免不必要的渲染。父组件的重新渲染会导致所有子组件的重新渲染。