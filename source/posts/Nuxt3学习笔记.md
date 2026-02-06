---
title: Nuxt3学习笔记
date: 2022-04-29
tags:
  - 学习笔记
  - Vue3
  - Nuxt3
categories: 学习笔记
---

# NUXT3笔记

## 安装

    npx nuxi init nuxt3-test
    (npx创建nuxt3项目)
    npm install
    (npm安装node包)

## 目录结构

    .nuxt不需要动
    app.vue 项目入口文件
    pages 开发时的页面文件夹
    layout是布局文件夹
    components 项目组件文件夹
    assets 静态资源文件夹

### 小坑

    如果有pages文件夹需要添加index.vue不然不正常显示

## nuxt3路由

### 规则式开发

    约定大于配置
    只要写在pages里就是一个页面

    在APP.VUE中添加标签<NuxtPage></NuxtPage>
    表示路由

### 页面跳转

    nuxt不建议使用a标签跳转
    应当使用以下标签
    <NuxtLink to="/dome1">
      target Dome1
    </NuxtLink>

### 动态路由的使用

    新建文件或者文件夹
    dome2-[id]
    其中的id就是动态路由传递的参数

    跳转页面时传参
    <NuxtLink to="/dome2-38">
      target Dome2
    </NuxtLink>

    页面接收参数
    const $route = useRoute()
    const id  = ref($route.params.id)
    dome2{{id}}

#### 传参特点

    路由pages内的所有下级文件,
    都能够接收所有上级文件夹传递的参数

### 子页面创建

    如果需要使用嵌套页面,可以使用
    <NuxtChild></NuxtChild>标签

### 使用布局模板

    在Layout文件夹内建立文件
    文件内使用<slot name="head" />来标记插槽位置

    <NuxtLayout name="nav"></NuxtLayout>
    (name属性对应layout内的文件名)
    NuxtLayout内使用<template #插槽名></template>进行插入元素
