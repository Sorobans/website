---
title: 关于前端数据库indexDB
date: 2023-06-23 14:25:11
tags: 技术分享
---

## 为什么需要IndexDB

前端加载某些过大的静态文件，而且还是无法被浏览器缓存的资源时。每次都要浪费很多时间。

比如three.js需要使用的建模文件。如果只有几十kb，几MB的话倒还好。如果模型文件十多M，甚至是几百多M的话。每次关闭网页再重新打开，就又重新加载一遍。长时间的重复等待实在是倒人胃口。

这个时候就可以用indexDB将这些大型文件存起来。避免重复加载这些资源，而倒人胃口。

## 使用体验

关于这个问题，我自己钻研了一下，并且封装了一个操作IndexDB的方法(详情见文章下链接)。

有一说一，这个东西比MongoDB难用。不能够直接新建表，必须每次在升级数据版本的时候，触发的周期里才能去新建。实在是，太难受了。

![emj](../img/src=http___img.nga.178.com_attachments_mon_202206_26_i2Q2q-8ns4Z1vT3cSwi-wi.jpg&refer=http___img.nga.178.webp)

## 相关资源

[IndexDB使用方法](https://github.com/XueHua-s/personUntil/blob/main/indexDB.js)
