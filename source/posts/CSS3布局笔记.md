---
title: CSS3布局笔记
date: 2021-12-08
tags:
  - 学习笔记
  - CSS
  - CSS3
categories: 学习笔记
---

## 移动端开发基础

### CSS3新增选择器

    ~ 表示为兄弟选择器，选择同级中的所有元素。
    +表示为相邻兄弟选择器,选择紧挨着自己的同级元素。

### 头部meta标签设置

    <meta name="viewport" content="width=device-width, initial-scale=1.0 user-scalable=no, initital-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">

### 特殊样式

    雅虎官网reset样式外，还需要清除一些移动端的默认样式。
    点击高亮需要清除:
    -webkit-tap-highlignt-color:transparent;
    在移动端浏览器默认的外观在IOS上加上这个属性，才能够给按钮和输入框自动以样式
    input {
        -webkit-appearance:none;
    }
    禁用长按页面时的弹出菜单
    img,a {
        -webkit-touch-callout:none;
    }
    页面平滑滚动:
    html, body { scroll-behavior:smooth; }

### CSS初始化normalize.css

    normalize.css。是一个可以定制的CSS文件，它让不同的浏览器。渲染网页时的格式更加统一。
    [官网地址](http://necolas.github.io/normalize.css/)

## 流式布局

### 注意事项

    制作过程中。需要定义页面的最大和最小支持宽度
    max-width、min-width

### 渐变背景效果

    background-image: linear-gradient();

### web图片压缩

    webp,dpg

## flex布局

### flex布局父项常见属性

    flex-direction: 设置主轴的方向;
    justify-content: 设置主轴上的子元素排列方式,space-beeween两贴边，平均分布对齐;
    flex-wrap: 设置子元素是否换行;
    align-content: 设置侧轴上的子元素的排列行方式(多行);
    align-items: 设置侧轴上的子元素的排列方式(单行)，stretch拉伸到最大宽度;
    flex-flow: 复合属性,相当于同时设置了flex-direction和flex-wrap;

### flex布局,子项目的相关属性

    flex: ;flex属性用于定义分配父盒子的剩余空间。用flex来表示占多少份数。用于两边固定,中间占满的流式布局。
    align-self: ;控制子项自己在侧轴上的排列方式
    order: ;order属性定义项目的排列顺序

## rem适配布局

### rem的基准

    rem的基准是参考html元素字号大小的倍速。

### 媒体查询

    @media查询，可以针对不同的媒体类型，定义不同的样式。
    针对不同屏幕尺寸设置不同的样式。

### 语法规范

@meidia开头
mediatype 媒体类型
and not only or 关键字
media feature媒体特性,小括号包裹。
@meidia mediatype and|not|only (mediafeature){

}

### 媒体类型

    将不同的终端设备划分成不同的类型，成为媒体类型。
    值:all(所有设备)、print(打印机)、screen(屏幕)

### 媒体特性

    值:width、min-width、max-width

### 实现思路

    按照从大到小，或者从小答道的思路、顺序进行书写。这样让代码更加的整洁。一般都是从小到大进行书写。

### 媒体查询引入资源

    语法规范:
    <link rel="stylesheet" media="mediatype and|not|only (mediafeature)" href="">

### rem适配布局方案。

    rem适配方案技术使用(市场主流)
    技术方案1:less+@meida+rem
    技术方案2:flexible.js+rem（方案2更加简单）

### flexible.js

    简介高效的rem适配方案,flexible.js布局方案。
    原理是把设备划分为了十等份。比如设计稿是750px。把750/10，即为html根元素大小。
    然后，其他尺寸用设计稿rem单位 / 75.
    [github地址](https://github/amfe/lib-flexible)
    如果需要用媒体查询叠加掉flexible。添加如下格式的媒体查询。!important权重提升关键字。
    @media screen and (min-width: 750px) {
        html {
            font-size: 75px !important;
        }
    }

## less预编译

### CSS弊端

    非程序式语言,没有变量、函数、SCOPE(作用域)等概念
    CSS没有很好的计算能力。
    不方便维护，代码冗余且重复。
    使用REM表示一些单位的时候，需要手动进行运算。CSS不能够进行运算。

### 安装less

    首先需要安装node.js
    node -v;查看node.js平台的版本号
    npm install -g less;进行全局安装less插件.-g是表示全局的意思
    lessc -v;检测less版本号

### less变量

    @变量名:value;
    less变量名区分大小写。不能包含特殊符号，数字不能作为开头。

### less编译

    在less根目录使用CMD命令："lessc style.less>style.css";
    VSC内安装插件。EASY LESS插件。

### less嵌套语法

    ul{
        li {
            a {

            }
        }
    }
    内层选择器的前面没有&符号，则它被解析为父选择器的后代；
    如果有&符号，它就被解析为父元素自身或父元素的伪类。

### less运算

    less提供了+,-,*,/等算术运算。
    less的运算符左右必须加空格。

### less导入文件

    在less里可以这样导入其他的less文件。
    @import "less文件名";//不用附带后缀名

## Bootstrap UI开发框架

### 版本

    为bootstrapV3版本的使用笔记

### 布局容器

    .container类
    响应式布局的容器。固定宽度
    大屏(>=1200px)宽度为1170px
    中屏(>=992px)宽度为970px
    小屏(>=768px)宽度为750px
    超小屏(100%)

    .container-fluid类
    流式布局容器 100vw宽度
    适合于移动端页面的开发。

### 栅格系统

    可以把网页布局划分为等宽的列，然后通过列数定义来模块化页面布局。
    栅格的行必须包含在.container内，以便为其赋予合适的排列。
    行: .row
    列: .col-xs(特小.vw<768px)
        .col-sm-number(小.vw>=768px)
        .col-md-number(大.vw>=992px)
        .col-lg-number(特大.vw>=1200px)

### 列偏移

    col-xl-offset-numer;在特大屏幕内设置偏移份数

### 列排序

    col-xl-push-number;把元素往后退
    col-xl-pull-numer;把元素往前推

### 响应式工具

    hidden-xs;在超小屏内隐藏
    hidden-sm;小屏内隐藏
    hidden-md;中屏内隐藏
    hidden-lg;大屏内隐藏
    (上面那hidden换成visible就是可见。)

## 自定义页面滚动条

    .main {
        // background-color: red;
        width: 100%;
        height: 100vh;
        // x轴隐藏,设置y轴滚动
        overflow-x: hidden;
        z-index: 0;
        margin-right: 12px;
        // 以下滚动条样式
        &::-webkit-scrollbar {
            width: 10px;
            // height: 20px;
            background-color: var(--menu-alive-bgcolor);
            border-radius: 12px;
        }
        &::-webkit-scrollbar-thumb {
            border-radius: 10px;
            // -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
            background: var(--menu-alive-color);
        }
        &::-webkit-scrollbar-track {
            // -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
            // border-radius: 0;
            background: var(--menu-alive-bgcolor);
        }
    }
