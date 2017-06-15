---
title: debounce和throttle
date: 2016-07-26
tags: JavaScript
category: 知识碎片
---

## debounce
如果用手指一直按住一个弹簧，它将不会弹起直到你松手为止。
也就是说当调用动作n毫秒后，才会执行该动作，若在这n毫秒内又调用此动作则将重新计算执行时间。
```js
/**
* 空闲控制 返回函数连续调用时，空闲时间必须大于或等于 idle，action 才会执行
* @param idle {number} 空闲时间，单位毫秒
* @param action {function} 请求关联函数，实际应用需要调用的函数
* @return {function} 返回客户调用函数
*/
var debounce = function(idle, action) {
    var last;
    return function() {
        var ctx = this, args = arguments;
        clearTimeout(last);
        last = setTimeout(function(){
            action.apply(ctx, args);
        }, idle);
  }
};
```

## throttle
如果将水龙头拧紧直到水是以水滴的形式流出，那你会发现每隔一段时间，就会有一滴水流出。
也就是会说预先设定一个执行周期，当调用动作的时刻大于等于执行周期则执行该动作，然后进入下一个新周期。
```js

/**
* 频率控制 返回函数连续调用时，action 执行频率限定为 次 / delay
* @param delay {number} 延迟时间，单位毫秒
* @param action {function} 请求关联函数，实际应用需要调用的函数
* @return {function} 返回客户调用函数
*/
var throttle = function(delay, action) {
    var last = 0;
    return function() {
        var curr =+ new Date();
        if (curr - last > delay) {
            action.apply(this, arguments);
            last = curr;
        }
    }
};
```
