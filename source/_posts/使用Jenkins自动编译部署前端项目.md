---
title: 使用Jenkins自动编译部署前端项目
date: 2017-06-27 14:22:04
tags: 工程实践
category: 开发日志
---
## 起因
之前，我们公司的前端项目的部署都是我手动敲命令，用 webpack 编译打包，然后用 FileZilla 或者 scp 到远端的服务器上。
正式上线的时候倒还好，不是特别麻烦，只是偶尔也会手忙脚乱出现小问题。
可是到后来系统变得越来越复杂了，团队的人慢慢变多的时候，这项工作就变得相当耗时和麻烦了。每改完一些bug，我就要重复相同的工作，不胜其烦。<!--more-->

其实我的需求很简单，只要项目的某个特定分支（一个分支对应一个环境，比如dev代表开发服，test代表测试服，release代表预发布服）有提交的时候，就触发构建，并自动将项目拷至服务器上。

ok，很多持续集成工具都能满足我的需求。Github 上很多的项目用的 Travis 应该就能满足我的需求。

后来经过讨论，我们选择了 [Jenkins](https://jenkins.io/)。

## 经过
### 安装 Jenkins
安装很简单，从官网上下载后，往 tomcat 里一扔就搞定了。

之后，需要给 Jenkins 安装 SSH 和 Email（成功或失败后通知相关人员） 的插件：

![SSH](https://ooo.0o0.ooo/2017/06/27/595202b22e7ed.png)
![Email](https://ooo.0o0.ooo/2017/06/27/595202b247306.png)

### Gitlab 配置
给项目添加 Web钩子，链接填写 http://xxxxxxxx/jenkins/gitlab/build_now ，触发里勾选推送事件。
![Gitlab 配置](https://ooo.0o0.ooo/2017/06/27/595203f8553df.png)

### Jenkins 项目配置

首先要为项目配置工作空间，Jenkins 会把项目从 Gitlab 上克隆到这个路径。

然后，根据自己项目的实际情况进行配置，可以参考我的配置：

![Jenkins 项目配置](https://ooo.0o0.ooo/2017/06/27/59520bfd3767b.png)

** 注意url的格式：http://username:password@url **

![Jenkins 项目配置](https://ooo.0o0.ooo/2017/06/27/59520bfd38d49.png)
![Jenkins 项目配置](https://ooo.0o0.ooo/2017/06/27/59520bfd361b0.png)
![Jenkins 项目配置](https://ooo.0o0.ooo/2017/06/27/59520bfd3a386.png)

## 结果
![结果](https://ooo.0o0.ooo/2017/06/27/59520da047d0d.png)

吼吼，大功告成！

除了自动编译部署，我们还用 Jenkins 来跑测试和eslint。

## 优化

编译和部署的脚本最好应该已脚本的形式分离到项目之中，而不是配置到 Jenkins 之中，以便于开发人员自行调整脚本。
