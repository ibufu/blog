---
title: 【翻译】为什么 web components 如此重要
date: 2016-07-04 17:01
tags: web components
category: 外文翻译
---
这几年，关于 web components 的争论一直不绝于耳。有人说 web components 可以改变我们构建网页的方式，这是为什么呢，是什么让 web components 如此重要？

> web component 是一种创建封装的、可复用的网页UI (user interface) 组件的标准化方式。

#### 不是一个新概念

网页组件其实很早之前就存在了，其目的是构建可复用且可移植的代码，这并没有什么新鲜的。

<figure name="545f" id="545f">

<canvas width="75" height="25"></canvas>

![](http://p0.qhimg.com/t019ea00d2c2a29e4de.png)

</figure><!--more-->

**jQuery 插件**

jQuery 插件可能是最早流行的对构建复用代码的尝试。我们可以很方便地根据它规定的结构来构建一个 jQuery 插件。但是，它存在一些问题。

不同插件之间经常会造成冲突，而且我们还要搞明白哪些样式需要单独地引入。

**AngularJS 指令**

接下来就到了指令，它带来了另外一些好处。隔离每个组件的 JS 作用域，以防止命名冲突。通过良好的框架支持，更加清晰地创建一个指令。但问题依然存在，样式仍然需要单独引入，API 复杂且难以学习。

**框架组件**

目前，以 Angular 2 和 React 为代表的现代框架组件成为了最新的网页组件解决方案。它们基于最新的 JavaScript 特性进行构建，例如classes， 这将提供更加优雅的 API。在 Angular 2 里，开发者可以利用元数据 (metadata) 来装饰组件，以告诉框架其它人应该如何使用这个组件。最后，使用Shadow DOM 为组件提供完整的封装。

* * *

#### 为什么组件化？

想要理解为什么 web components 如此重要，必须要先彻底明白组件化的目的何在。

**封装**

组件在主应用中应该是完全独立的。这样可以增加组件的复用性、可测试性和可靠性，因为组件只需负责它的内部，而无需关心外部应用的状态。

组件的作者和用户都可以轻松地更新组件，而无需担心会影响到应用的其它部分。

**拓展性**

组件之间应该能够互相拓展，比如 web components 和 其它 DOM 元素。这意味着组件作者不需要重复造轮子，并且轻松地复用某些功能。

**组合性**

利用一些组件可以构建更复杂的组件甚至是一个完整的应用。减少对 “global” 的依赖可以使架构设计更加良好，bug 出现的概率更小，因为应用（或是混合组件）的每个独立部分都更好地设计过。

**复用性**

最重要的一点，组件应该具有尽可能少的依赖和定义清晰的 API ，并能够被轻松地复用。

* * *

上面提到的三种组件，只有框架组件拥有所有这些特性，但是这还需要使用 Shadow DOM 进行完整的封装。

<figure name="9135" id="9135">

<canvas width="75" height="50"></canvas>

![](http://p0.qhimg.com/t0174c1a86223330e59.png)

<figcaption>利用 Shadow DOM 封装组件</figcaption>

</figure>

Shadow DOM 通过一个不受外界 style 影响的子 DOM 树来提供完整的组件封装。这意味着，组件作者能够彻底控制组件的外观和用户的操作。

虽然，我们可以幸运地使用 Shadow DOM 来封装 Angular 和 React 组件。
* * *

#### 为什么使用web components？

如果框架组件已经拥有了这些特性，为什么我们还需要 web components 呢？有个很重要的原因：互操作性。

框架组件确实很棒，但是也就仅限于它们的生态之内。你不能（轻松地）在 React里 使用 Angular 组件，反之亦然。

**为什么互操作性很重要？**

前端开发社区是个异常活跃，每天都在创造大量新工具、新框架、新库和新技术的地方。但是，这让我们难以紧跟他们的步伐。

作为开发者，我们需要紧跟潮流，改变我们构建应用的方式，使用那些满足市场或用户需求的最新技术。但是在过去，某些项目可能已经因为一些旧技术而纠缠不清，升级它们要付出昂贵的代价，甚至需要重写整个项目。

因为 web components 仅仅构建于 web 标准，所以它们在任何生态中都能运行良好。这带来了许多好处：

*   互操作性 — 组件超越框架而存在，可以在不同的技术栈中使用
*   寿命 — 因为组件的互操作性，它们将有更长的寿命，基本不需要为了适应新的技术而重写
*   移植性 — 组件可以在任何地方使用，因为很少甚至没有依赖，组件的使用障碍要明显低于依赖库或者框架的组件

不仅仅以上这些优点，一个组件还应该具有如 web components 的交叉兼容性，这在不断前进变化的 web 世界里是至关重要的

#### Web Component 库

web component 的标准暂时还是不稳定的，并且缺少文档、范例、教程，想要入门是一件相当困难的事情，尤其是如果要支持旧式浏览器

<figure name="17d2" id="17d2">

<canvas width="75" height="22"></canvas>

![](http://p0.qhimg.com/t01aec8e7a08c4718a2.png)

<figcaption>流行的 web component 库</figcaption>

</figure>

因为这些 web component 库，让 web component 的使用变得超级简单，流行的有 [Polymer](https://www.polymer-project.org/1.0/)、[X-Tag](http://x-tag.github.io/) 和 [Bosonic](http://bosonic.github.io/documentation/getting-started/getting-the-code.html)。它们提供了一系列能够被使用和拓展的组件。正如所有流行的项目一样，它们有健全的文档、范例和稳定的社区。

但是，这些库会让组件拥有一个重要的依赖，使用这些组件的用户必须去确保这个依赖的存在。

随着 web component 标准的日益清晰，以及一些优秀的例子的出现，我会鼓励任何人去尝试原版的 web components，并让他们确认所需的特性。

#### 总结

Web components 是如此的重要，因为它让我们应用的构建方式可以迅速地适应变化。我们能在项目里使用令人兴奋的前端新技术，只要它能满足市场或客户的需求，而不需要重构我们庞大的应用。

web components 是基于最新的 web 标准，所以它的的互操作性，可以让我们的代码拥有更长的寿命。最终，因为更少的依赖和前置条件，我们的组件可以满足更多人的需求。

Web components 万事俱备只欠东风，让我们**马上**就使用吧。我正在努力写更多的例子和教程，来帮助社区更快地接受 web components。

联系我 [@RevillWeb](https://twitter.com/revillweb) 。

[原文](https://blog.revillweb.com/why-web-components-are-so-important-66ad0bd4807a#.gq0m0tt0q)