---
title: 'jquery-fileupload IE8IE9无法上传图片的BUG及如何给input[type=file]自定义样式'
date: 2015-12-22 12:45
tags: jquery-fileupload
category: 旧文重忆
---
<!--more-->
先说IE9，点击上传后，浏览器会提示下载内容。

原因：IE9及以下上传文件的响应头的contentType 如果是json，浏览器会以为是文件下载。

处理方法：找后台GG，把contentType改为text/html.

再修改done方法，获得地址

```js
done: function(e, data){
    var result = data.result[0].body ? data.result[0].body.innerHTML : data.result;
    result = JSON.parse(result);
    /* 你自己的代码*/
}
```

再说IE8，点击上传后，出现文件选择框，但是点击确认后，浏览器不会发送ajax请求。

原因：IE8为了安全考虑，只能通过直接点击```<input type="file">```来上传文件。而我的做法是，隐藏input，通过另外一个按钮，来触发input的click事件。

处理方法：把另一个按钮外面套一个label，设置for=""，关联input。

注意：input依然不能设置成display:none,不然IE8还是不认。所以我的做法是把input的宽高都设置成1px ，透明度设为0。或者设置z-index，把它置于最底层，但是这个方法我还没实践过。

[原文](http://www.cnblogs.com/ibufu/p/5066295.html)