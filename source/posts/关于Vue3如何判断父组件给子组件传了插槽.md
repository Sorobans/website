---
title: 关于Vue3如何判断父组件给子组件传了插槽
date: 2023-08-03 15:20:21
tags: 技术分享
---

## 问题背景

首先看下面这段代码。

![img.png](../img/img_5.png)

遇见了一个需求，需要在部门选择的时候，名称前面加上一级部门。

但是，很多地方都用到了这个封装的组件。如何让这个地方优雅的处理掉，又不影响到别的地方呢?

## 解决思路

我想到了一个点子。子组件判断父组件有没有传递插槽。如果传了的话，就给elOption传递处理选择显示的插槽。

经过我一番查阅文档和百度，发现setup语法糖没法实现。只能改成setup加return那种。

setup函数里第二个参数中去接收slot插槽。然后利用jsx的灵活性就能够优雅地实现需求了。

## 为什么使用JSX

为啥要用jsx?因为template中给Eloption传递插槽没法用对象的方式，只要对应上了插槽名Eloption就会渲染。

## 代码实现

代码见下图：

![img.png](../img/img_6.png)
![img.png](../img/img_7.png)

[代码详情](https://github.com/XueHua-s/personUntil/blob/main/Vue3Components/requesetEnumSearchSelect.vue)
