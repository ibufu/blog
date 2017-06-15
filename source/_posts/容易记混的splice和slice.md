---
title: 容易记混的splice和slice
date: 2016-11-16
tag: JavaScript
category: 知识碎片
---

### Array.prototype.splice

splice(拼接) 方法用新元素替换旧元素，以此修改数组的内容。 <!--more-->

```js
let myFish = ["angel", "clown", "mandarin", "sturgeon"];

myFish.splice(2, 0, "drum");
// myFish is ["angel", "clown", "drum", "mandarin", "sturgeon"]

myFish.splice(2, 1);
// myFish is ["angel", "clown", "sturgeon"]

myFish.splice(2, 1, "splice", "parrot");
// myFish is ["angel", "clown", "splice", "parrot", "sturgeon"]
```

#### 语法
``` js
array.splice(start, deleteCount[, item1[, item2[, ...]]])
```
#### 参数

** start **​
从数组的哪一位开始修改内容。如果超出了数组的长度，则从数组末尾开始添加内容；如果是负值，则表示从数组末位开始的第几位。

** deleteCount **
整数，表示要移除的数组元素的个数。如果`deleteCount`是 0，则不移除元素。这种情况下，至少应添加一个新元素。如果`deleteCount`大于`start`之后的元素的总数，则从`start` 后面的元素都将被删除（含第 `start` 位）。

** itemN **
要添加进数组的元素。如果不指定，则`splice`只删除数组元素。

** 返回值 **
由被删除的元素组成的一个数组。如果只删除了一个元素，则返回只包含一个元素的数组。如果没有删除元素，则返回空数组。

** 描述 **
如果添加进数组的元素个数不等于被删除的元素个数，数组的长度会发生相应的改变。

** 提示 **
请注意，`splice` 方法与 `slice` 方法的作用是不同的，`splice` 方法会直接对数组进行修改。

### Array.prototype.slice
slice(切片) 方法会浅复制（shallow copy）数组的一部分到一个新的数组，并返回这个新数组。

``` js
let a = ['zero', 'one', 'two', 'three'];
let sliced = a.slice(1, 3);
console.log(a);
// ['zero', 'one', 'two', 'three']
console.log(sliced);
// ['one', 'two']
```

#### 语法
``` JavaScript
arr.slice([begin[,end]])
```

#### 参数

** begin **
从该索引处开始提取原数组中的元素（从0开始）。
如果该参数为负数，则表示从原数组中的倒数第几个元素开始提取，```slice(-2)```表示提取原数组中的倒数第二个元素到最后一个元素（包含最后一个元素）。
如果省略```begin```，则```slice```从索引 0 开始。

** end **
在该索引处结束提取原数组元素（从0开始）。```slice```会提取原数组中索引从 ```begin``` 到 ```end``` 的所有元素（包含```begin```，但不包含```end```）。
```slice(1,4)``` 提取原数组中的第二个元素开始直到第四个元素的所有元素 （索引为 1, 2, 3的元素）。
如果该参数为负数， 则它表示在原数组中的倒数第几个元素结束抽取。 ```slice(-2,-1)```表示抽取了原数组中的倒数第二个元素到最后一个元素（不包含最后一个元素，也就是只有倒数第二个元素）。
如果 ```end``` 被省略，则```slice``` 会一直提取到原数组末尾。
如果 ```end``` 大于数组长度，```slice``` 也会一直提取到原数组末尾。
