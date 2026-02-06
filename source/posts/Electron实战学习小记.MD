---
title: Electron实战学习小记
date: 2023-08-04
tags:
  - 学习笔记
  - Node.JS
  - Electron
categories: 学习笔记
---

# Electron_Lern_Record

Electron学习笔记和记录

## Electron大致结构

    JS => 浏览器解释器
    Chrome v8 dom
    NodeJs v8

<table>
<tr>
<td colspan="3" align="center">主进程</td>
</tr>
<tr>
<td colspan="3" align="center">
↑
进程通信(如文件读取，文件压缩)
↓
</td>
</tr>
<tr>
<td>渲染进程</td>
<td>渲染进程</td>
<td>渲染进程</td>
</tr>
</table>

## 配置环境

<table>
<tr>
<td>需要安装的环境</td>
<td>NodeJS</td>
<td>NPM</td>
</tr>
</table>

## path

### resolve

    取目录，不同平台的目录分隔符不一样。
    为了跨平台

### \_\_dirname

    取文件所在目录

### \_\_filename

    取文件所在位置

## 模块管理

    Electron主进程使用CommonJS模块管理。

## 主进程相关

### process

    环境配置

#### platform

    操作系统环境
    process.platform != 'darwin'
    操作系统不为MacOS

### app

#### whenReady

    主进程加载完毕。是一个Promise异步。

#### on

    注册事件
    类似于浏览器里的addEventListener

##### window-all-closed

    用户关闭窗口事件(未关闭前，用于拦截关闭按钮，进行关闭操作)
    app.on('window-all-closed', () => {
        if (process.platform != 'win32') {
            app.quit() // 退出
        }
    })

##### activate

    用户唤醒的事件

### 创建浏览器窗口

    new BrwserWindow

#### 属性

##### width

    窗体宽度

##### height

    窗体高度

##### alwaysOnTop

    窗体是否最顶层
    布尔值

##### x

    窗口定位

##### y

    窗口定位

##### frame

    是否显示标题栏

##### transparent

    窗体是否透明

#### 方法

##### loadURL

    loadURL('')
    给浏览器窗口加载网页

##### webContents.openDevTools

    打开开发者工具

## 特殊技巧

### css控制渲染进程

    html {
      --webkit-app-region: drag;
    }
    textarea {
      --webkit-app-region: no-drag;
    }

### 限制网络请求域名

    HTML , CSP策略

## 通信方式

### 默认情况

    默认情况下，渲染进程js，默认不开放全部Node.js

### 预加载脚本

    默认情况通过预加载脚本充当Node进程和渲染进程之间的桥梁

#### 代码

    创建浏览器窗口时填写如下配置
    webPreferences: {
      preload: path.resolve(__dirname, 'reload.js')
    }

#### 开启Node模块

    nodeIntegration: true

#### 注册主进程事件

    ipcMain.on('saveFile', (e, val) => {
      console.log(val, '123')
    })

##### 主进程接收再给子进程发送

    ipcMain.on('saveFile', (e, val) => {
        console.log(val, '123')
        BrowserWindow.fromWebContents(e.sender).send('msg', '主进程已收到通知')
    })

#### 预加载脚本发送事件

    ipcRenderer.send('saveFile', 123)

#### 预加载脚本给渲染界面暴露函数

    contextBridge.exposeInMainWorld('api', {
        send: (value) => ipcRenderer.send('send', value)
    })
    暴露的函数会在window对象下

#### 主进程向窗口预加载脚本发送事件

    mainWindow.webContents.send()

#### 注册主进程方法

    ipcMain.handle('saveFile', (e, val) => {
      console.log(val, '123')
    })

#### 预加载脚本接收主进程方法

    ipcRenderer.invoke('saveFile')
