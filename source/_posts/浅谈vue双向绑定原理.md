---
title: 浅谈vue双向绑定的代码实现
date: 2016-12-09 10:42:55
tags: 
 - Vue
 - JavaScript
category: 知识碎片
---
vue 会把每个实例的data和props都包装成Observer，里面有一个dep实例，包含所有订阅该Observer的watcher。

watcher中的关键参数expOrFn，代表getter，字符串则解析，函数则执行。

初始化的时候，调用get方法，建立订阅关系。还有一个cb参数，代表更新的方法。

Dep类会记录下所有的Watcher，当数据更新的时候，dep会通知所有watcher更新。

watcher访问属性的时候，Dep的静态属性target会指向该watcher，以便在属性的getter中知道是否为watcher的访问。

vm的render方法作为watcher的expOrFn 传入构造函数中。

本质上是一套观察者模式。