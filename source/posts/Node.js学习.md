---
title: Node.js笔记
date: 2021-12-30
tags:
  - 学习笔记
  - Node.js
  - JavaScript
categories: 学习笔记
---

# node.js

## node.js基础

### node.js概述

    node.js不是一门编程语言,它是一个执行JavaScript代码的工具。
    工具是指可以安装在计算机操作系统之上的软件。

    浏览器和Node.js都内置了JavaScript V8 Engine
    它可以将JavaScript代码编译为计算机能够识别的机器码

    在内置了JavaScript V8 Engine以后实际上只能执行ECMASciript.
    就是语言中的语法部分。

    和浏览器不同,在node.js中是没有DOM和BOM的。所以在Node.js中
    不能执行和它们相关的代码。比如window.alert();或者document。
    dom和bom是浏览器环境中特有的。

    在Node.js中,有很多系统级别的API。
    比如对操作系统中的文件和文件夹进行操作。
    获取操作系统信息,比如内存总量是多少,系统临时目录在哪，
    对系统进程操作等等

### node.js能做什么

    我们通常使用它来构建服务器端应用和创建前端工程化工具。
    JavaScript运行在浏览器中我们就叫它客户端JavaScript
    JavaScript运行在Node.js中我们就叫它服务端JavaScript

### 系统环境变量

    在开发环境的操作系统中定义NODE_ENV 变量,值为development,
    在生产环境的操作系统定义NODE_ENV变量,值为production。
    webpack在运行时通过process.env.NODE_ENV获取变量的值,
    从而得出当前代码的运行环境是什么。

    环境变量PATH:系统环境变量PATH存储的都是应用程序路径。
    当要求系统运行某一个应用程序又没有告诉它程序的完整路径时,
    此时操作系统会在当前文件夹中查找应用程序，如果查找不到。
    就会去系统环境变量PATH中指定的路径中查找。

### 全局对象

    在node.js环境中是没有window的，所以window对象自然是未定义的。
    在node.js环境中的全局对象为global,在global对象中会存在一些和
    window对象中名字相同且作用相同的地方。

    在Node.js环境中声明的变量不会被添加到全局对象中，变量声明后
    只能在当前文件中使用。

    global对象中会存在一些和window对象中名字相同作用相同的方法。
    global.console.log();
    global.setinterval();
    global.clearinterval();
    global.setTimeout();
    global.clearTimeout();
    global.setinmmediate();

    在Node.js环境中声明的变量不会被添加到全局对象中。变量声明后
    只能在当前文件中使用。

### 模块成员导出与导入

    在Node.js环境中,默认就支持模块系统，该模块系统准寻CommonJS规范。
    一个JavaScript文件就是一个模块,在模块文件中定义的变量和函数默认
    只能在模块文件内部使用。如果需要在其他文件中使用。
    必须显式声明将其进行导出。

    模块成员导出
    在每一个模块文件中,都会存在一个module对象，即为模块对象。在模块对象中保存了和当前模块相关信息。
    在模块对象中有一个属性exports,它的值是一个对象。模块内部需要被导出的成员都应该存储道这个对象中。

    模块成员导入
    在其他文件中通过require方法引入模块，require方法的返回值就是对象模块的module.exports对象。
    在导入模块时,模块文件后缀.js可以省略,文件路劲不可省略。
    require方法属于同步导入模块,模块导入后可以立即使用.
    通过reuqire方法导入模块,模块当中的文件代码会被立即执行。
    const logger = require("./logger");
    const _ = require("lodash");
    (比如console.log())

    在导入其他模块时,建议使用const关键字声明常量。防止模块被重置

    如果只有一个方法的情况下在导出时可以直接将module.exports = ()=>{}
    重置为一个对象.导入被导出的文件,可以直接使用被导出的模块名,直接调用.

### 模块包装函数

    Module Wrapper Function

    Node.js是如何实现模块的,为什么在模块文件内部定义的变量.
    在模块文件外部访问不到?
    每一个模块中都有module和require方法，它们是从哪里来的？

    在模块文件执行之前,模块文件中的代码会被包裹在模块包装函数中。
    这样每个模块文件中的代码都拥有了自己的作用域。所以在模块外部
    就不能访问模块内部的成员了。

    (function(exports,require,module,__filename,__dirname){
        code
    })

    __filename 文件路径
    __dirname 文件目录

    在这个模块包装函数中可以看到,module和require实际上是模块内部成员。不是全局对象
    global下面的成员。
    exports: 引用地址指向了module,exports对象,可以理解为是module.exports对象
    的简写形式.
    在导入模块时最终导入的是module.exports对象,所以在使用exports对象添加导出
    成员时不能修改引用地址。也就是说不能够通过exports重置module.exports

### 内置模块

    node.js会内置一些非常有用的模块。
    Path: 模块内提供了一些和路径操作相关的方法。
    File system (fs): 文件操作系统,提供了和操作文件相关的方法。
    在引入内置模块时,使用的是模块的名字.前面不需要加任何路径。

    path:
    const file = path.parse("./");能够解析一个文件路径,以对象形式返回。

    fs:
    fs.readdirSync(); // 同步方法,得到响应目录所有的文件
    fs.readdir("./",function(error,files){

    }); // 异步方法,得到响应目录所有的文件
    异步方法大多都是通过回调函数来拿结果的。

### NPM概述

    每一个基于Node.js平台开发的应用程序都是Node.js软件包。
    所有Node.js软件包都被托管在www.npmjs.com中。

    什么是NPM
    Node package Manager,Node.js环境中的软件包管理器。
    随Node.js一起被安装。

    它可以将Node软件包添加到我们的应用程序中,并对其进行管理。
    比如下载,删除.更新,查看版本等等。

### package.json

    package.json
    它是应用程序的描述文件,包含应用程序相关信息,比如应用名称.
    应用版本,应用作者等等。

    通过package.json文件可以方便管理应用和发布应用
    创建package.json文件: npm init
    快速创建package.json文件: npm init --yes

    package name: 包名
    version: 版本号
    description: 软件描述
    entry point: 应用入口文件
    test command: 测试命令
    git repository: git地址
    keywoids: 应用关键字
    author: 应用作者
    license: ISC 应用协议
    dependencies: 软件依赖包

### 使用NPM命令下载软件包

    在应用程序的根目录执行命令。
    npm install <pkg>或者npm i <pkg>

    软件包下载完成后会发生三件事:
    软件包会被存储在node_modules文件夹中,如果在应用中不存在此文件夹。
    npm会自动创建。
    软件包会被记录在package.json文件中.包含软件包的名字以及版本号。
    npm会在应用中创建package-lock.json文件。用于记录软件包及
    软件包的依赖包的下载地址及版本。

### 使用Node.js软件包

    在引入第三方软件包时,在require方法中不需要加入路径信息。只需要使用软件包
    的名字即可。require方法会自动去node_modules文件夹中进行查找。

### git与node平台的包

    可以通过.gitignore文件对不需要的文件夹进行配置.
    node_modules/

    git init 创建git仓库
    git status 查看git add文件,包含的提交内容
    git add. 将仓库文件提交到暂存区当中.
    git commit -m 将文件提交到 git仓库中
    git remote add origin 地址 将git仓库文件提交到远端仓库

### git下载源码,回复包

    没有包，但是package.json文件中会包含软件包的名字。
    可以在目录通过npm install进行安装.npm会自动解析package.json
    中的dependencies,查找依赖包.进行下载。

### 语义版本控制说明

    Maior Version主要版本: x.00.00
    添加新功能破坏现有API

    Minor version 次要版本: 1.XX.00
    不会破坏现有API,在现有API的基础上进行添加.

    patch version 补丁版本: 3.56.XX
    用于修复bug

    版本号更新规范:
    ^5.12.5: 主要版本不变,更新次要版本和补丁版本.
    ~5.12.5: 主要版本和次要版本不变,更新补丁版本.
    5.12.5: 使用确切版本,即主要版本,补丁版本固定

### 查看软件包实例版本的两个方法

    通过 npm list

### 如何查看软件包元数据

    通过 npm view name  查看软件包元数据
    npm view name versions 查看软件包元数据版本
    npm view name dist-tags dependencies 查看软件包元数据多项。

### 下载特定版本的软件包和删除软件包

    npm install jq@版本号
    删除软件包:
    npm uninstall jq

### 更新软件包

    通过npm outdated命令可以查看哪些软件包已经过期.对应的新版本是什么。
    通过npm update更新过期的软件包,更新操作遵循语义版本控制规则。

### 项目依赖和开发依赖

    项目依赖:
    无论在应用开发环境还是线上环境,只要程序在运行的过程中,需要使用的软件包
    就是项目依赖。比如lodash,mongoose。

    开发依赖: 在应用开发阶段使用,在生产环境中不需要使用的软件包。
    比如TypeScript中的类型声明文件。比如less预编译

    在下载开发依赖时,项目依赖和开发依赖要分别记录。
    项目依赖被记录在dependencies对象中,开发依赖被记录在devDependencies中,
    使开发者可以在不同的环境中下载不同的依赖软件包。

    在下载开发依赖时,要在命令后面加上 --save-dev或者-D选项。
    比如 npm install less -D

    在开发环境中下载所有的软件依赖包: npm install
    在生产环境中只下载项目依赖软件包: npm install --prod

### 本地安装和全局安装

    本地安装: 将软件包下载到应用根目录下的node_modules文件夹中,软件包只能
    在当前应用中使用。
    全局安装: 将软件包下载到操作系统的指定目录中,可以在任何应用中使用。
    一般来说项目依赖都是本地安装的。开发依赖是安装到全局的。

    通过-g选项将软件包安装到全局: npm install name -g
    查看全局软件包的安装位置: npm root -g
    删除全局中的软件包: npm uninstall -g
    查看全局安装了哪些软件包: npm list -g --depth 0

    nodemon模块:
        能够在编写node代码时,即时预览。它没有提供实质性功能和API属于开发依赖。
        通过nodemon执行nodejs代码和模块.

### 强制更新软件包版本-模块

    npm-check-updates强制更新

    npm-check-updates可以查看有哪些软件包过期了。可以强制更新package.json
    文件中软件包版本。
    1.将npm-check-updates安装到全局: npm install npm-check-updates -g
    2.查看过期的软件包: npm-check-updates
    3.更新package.json: ncu -u
    4.安装软件包: npm install

### 发布软件包

    1.注册npm账号。
    2.创建软件包
        npm init --yes
    3.创建index.js模块
    4.登录npm{npm镜像地址必须氛围npmjs.com}
        npm login
    5.发布软件包
        npm publish

### 更新软件包版本号

    在软件包的源代码发生更改后,是不能直接发布的。应该更新软件包的版本号,然后再进行发布。
    更新主要版本号: npm version major
    更新次要版本号: npm version minor
    更新补丁版本号: npm version ptach

### 撤销已经发布的软件包

    只有在发布软件包的24小时之内才允许被撤销。
    软件包被撤销24小时候,才能够重新发布。
    重新发布需要修改名称和版本号

    npm unpublish name --force 撤销软件包发布

### 更改NPM镜像地址

    由于npmjs.com是国外的网站,大多数时候下载软件包的速度会比较慢。
    可以通过配置的方式更改npm工具的下载地址.

    获取npm配置:
        npm config list -l --json
        -l列表所有默认配置选项。
        --json 以json格式显示配置选项。

    设置npm配置
        获取npm下载地址: npm config get registry
        获取npm用户配置文件: npm config get userconfig

    更改npm镜像地址
        npm config set registry https://registry.npm.taobao.org
        npm config set registry https://registry.npmjs.org/

        .npmrc

### npx命令的两个用途

    npx是npm软件包提供的命令。它是node.js平台下软件包执行器。
    主要用途有两个：
    第一个是临时安装软件包执行后删除它。
    第二个是执行本地安装的提供命令的软件包。

    1.临时安装软件包后删除软件包
    有些提供命令的软件包使用的频率并不高。比如create-react-app
    脚手架工具。我能不能临时下载使用再删掉它。
    npx create-react-app react-test

    2.执行本地安装的软件包
    现在有两个项目都依赖了某个命令工具软件包,但是项目A依赖的是它的1版本，
    项目B依赖的是它的2版本,我在全局到底该安装什么版本。
    该软件包可以在本地进行安装,在A项目中安装它的1版本,在B项目中安装它的2版本，
    在应用中可以通过npx调用node_modules文件夹中安装的命令工具。
    比如:
        在本地安装了命令工具,无法通过命令直接执行。
        本地nodemon无法直接执行。可以使用npm nodemon xxx.js进行执行。

    将所有软件包安装到应用本地是现在最推荐的做法,一是可以防止软件包的版本冲突问题。
    二是,其他开发者在恢复应用依赖时可以恢复全部依赖。
    因为软件包安装到本地后会被package.json文件记录。其他开发者在运行项目时,
    不会因为缺少依赖而报错。

### 配置入口文件的作用

    应用程序的入口文件就是应用程序执行的起点,就是启动应用程序时执行的文件。
    场景一: 其他开发者拿到你的软件包以后,通过该文件可以知道入口文件是谁。
    通过入口文件启动应用。

    场景二: 通过node应用文件夹命令启动应用,node命令会执行package。json文件中
    main选项指定的入口文件。如果没有指定入口文件,则执行index.js

### 模块查找规则

    1.在指定了查找路径的情况下
    require("../server");
    1.查找server.js
    2.查找server.json
    3.查找server文件夹,查看入口文件(package.json->main)
    4.查找server文件夹中的index.js文件

    在没有指定查找路径的情况下:
        require("nice");
        1.查找是不是系统模块
        然后就按照module对象内的paths规则进行查找。
        paths规则查询的步骤又同时遵循上面的规则
        paths: [
            'D:\\大前端的学习\\案例\\Part3\\model1\\node_modules',
            'D:\\大前端的学习\\案例\\Part3\\node_modules',
            'D:\\大前端的学习\\案例\\node_modules',
            'D:\\大前端的学习\\node_modules',
            'D:\\node_modules'
        ]

### CPU与存储器

    目标: 了解程序运行过程中CPU和存储器起到了什么作用或者扮演了什么角色。
    1.CPU
        中央处理器,计算机核心部件,负责运算和指令调用。
        开发者编写的JavaScript代码在被编译为机器码以后就是通过CPU执行的。
    2.存储器

### 输入输出操作及模型介绍

    I/O操作模型有2种。
    第一种是同步I/O操作，也叫做阻塞IO操作
    第二种是异步I/O操作，也叫做非阻塞操作。

    Node.js采用的业务模型是,异步非阻塞IO操作。

### 进程与线程

    进程就是程序运行时的实例对象。
    线程是包含在应用程序中,代办的事情。

### JavaScript是单线程还是多线程的

    在Node.js代码运行环境中,它为JavaScript代码的执行
    提供了一个主线程。我们常说的单线程就指的就是这个主线程。
    主线程用来执行所有的同步代码。但是Node.js代码运行环境
    本身是由C++开发的。在Node.js内部它依赖了一个叫做libuv的
    c++库。在这个库中它维护了一个线城池。默认情况下这个线城池存储了4
    个线程。
    JavaScript中的异步代码就是在这些线程中执行的。所以说JavaScript代码
    运行依靠了不止一个线程。所以JavaScript本质上还是多线程的。

### 什么是回调函数

    回调函数是指通过函数参数的方式将一个函数传递到另一个函数中。
    参数函数就是回调函数。

### 回调函数在异步编程中的应用

    const fs = require("fs");
    let txt;
    fs.readFile("./1.txt","utf-8",function(derr,ata){
        txt = ata;
        console.log(txt);
    });

### 回调地狱问题

    回调地狱是回调函数多层嵌套导致代码难以维护的问题。
    基于回调函数的异步编程,一不小心就会产生回调地狱的问题。

### promise基本用法

    promise是JavaScript中异步编程解决方法,可以解决回调函数方案中的回调地狱问题。
    可以将Promise理解为容器,用于包裹异步API容易。
    当容器中的API执行完成后,Promise允许我们在容器外面获取异步API的执行结果。
    从而避免回调函数嵌套。

    Promise翻译为承诺,表示它承诺帮我们做一些事情，既然它承诺了。它就要去做。
    做就会有一个过程,就会有一个结果，结果要么成功要么是失败。
    所以在Promise中有三种状态,分别为等待(pending),成功(fulfilled),失败(rejected)。
    案例:
    const promise = new Promise(function(resolve,reject){
        // resolve方法的作用将等待状态变成成功状态
        // reject方法的作用将等待状态变成失败状态
        fs.readFile("./x.txt","utf-8",function(error,data){
            if(error) {
                // 如果error为真不为null，则为错误.
                // 则执行reject。把promise返回结果设置为错误。
                reject(error);
            } else {
                // 结果不为错误那么肯定是成功。
                // 调用成功方法resolve,从等待变为成功。
                resolve(data);
            }
        })
    });
    promise.then(function(data){
        // 通过promise对象的.then方法可以接收成功的数据.
        console.log(data);
    }).catch(funtion(error){
        // 通过promise对象的.catch方法可以接收失败的数据。
        console.log(error);
    })

### 通过Promise解决回调地狱

    // Promise回调地狱解决方案
    const fs = require("fs");
    function readFile(path){
        return  new Promise(function(resolve,reject){
            fs.readFile(path,"utf-8",function(error,resule){
                if(error){
                    reject(error);
                } else{
                    resolve(resule);
                }
            });
        });
    }
    readFile("./1.txt")
    .then(function(data){
        console.log(data);
        return readFile("./2.txt");
    })
    .then(function(data){
        console.log(data);
    }).catch(function(error){
        console.log(error);
        // 错误时调用,打印错误信息
    }).finally(function(){
        // 无论错误或成功都会调用
        // finally回调函数是没有参数的
        console.log("finally");
    });

### 使用Promise.all方法执行并发操作

    Promise.all([])方法内放置的就是Promise数组对象;

    const fs = require("fs");
    function readFile(path){
        return  new Promise(function(resolve,reject){
            fs.readFile(path,"utf-8",function(error,resule){
                if(error){
                    reject(error);
                } else{
                    resolve(resule);
                }
            });
        });
    }
    Promise.all([
        readFile("./1.txt"),
        readFile("./2.txt")])
    .then(function(result){
        console.log(result);
    });

### 使用异步函数解决Promise代码臃肿的问题

    const fs = require("fs");
    function readFile(path){
        return  new Promise(function(resolve,reject){
            fs.readFile(path,"utf-8",function(error,resule){
                if(error){
                    reject(error);
                } else{
                    resolve(resule);
                }
            });
        });
    }
    async function run(){
        let x = await readFile("./1.txt");
        let y = await readFile("./2.txt");
        return [x,y];
    }
    run().then(data=>console.log(data));

### 通过promisify方法改造通过回调函数获取结果的异步API

    Promisify函数-异步函数promise化

    const fs = require("fs");
    const promisify = require("util").promisify;
    const readFile = promisify(fs.readFile);
    async function run(){
        let x = await readFile("./1.txt","utf-8");
        let y = await readFile("./2.txt","utf-8");
        return [x,y];
    }
    run().then(data=>console.log(data));

### Event Loop事件循环机制

#### Event Loop事件概述

    为什么要学习事件循环机制
    学习事件循环机制可以让开发者明白JavaScript的运行机制是怎么样的。

    为什么叫做事件循环机制？
    因为Node.js是事件驱动的。事件驱动就是当什么时候做什么事情,做的事情就是
    定义在回调函数中的。可以将API的回调函数理解为事件处理函数。
    所以管理异步API回调函数什么时候回到主线程中调用的机制叫做事件循环机制。

#### 事件循环的六个阶段

    1.Timers: 用于存储定时器的回调函数(setinterval,setTimeout);
    2.Pending callbacks:执行与操作系统相关的回调函数,比如启动服务器端应用时
    监听端口操作的回调函数就在这里调用。
    3.ldle,prepare: 系统内部使用
    4.IO Poll: 存储I/O操作的回调函数队列。比如文件读写操作的回调函数。
    5.Check: 存储了setlmmediate API的回调函数。
    6.Closing callbacks: 执行与关闭事件相关的回调,例如关闭数据库链接的回调函数等。
    循环体会不断运行以检测是否存在没有调用的回调函数,事件循环机制会按照先进先出的方式
    执行。他们直到队列为空。

#### 宏任务与微任务

    宏任务:setInterval、setTimeout、setimmediate、I/O
    微任务: Promise.then、Promise.catch、Promise.finally、process.nextTick

    1.微任务的回调函数被放置在微任务队列中，宏任务的回调函数被放置在宏任务的队列中。
    2.微任务优先级高于宏任务
        在微任务中,nextTick的优先级要高于microTask.
        只有nextTick中的所有回调函数执行完成后才会开始执行microTask。

        在宏任务中是没有优先级的概念的，他们的执行顺序是按照事件循环阶段进行的。
        setTimeout延迟为0，js执行器也会默认+1.所以SetTimeout优先级比Setmmediate优先级高。

#### 通过代码验证事件循环机制

    在Node应用程序启动后,并不会立即进入时间循环,而是先执行输入代码。从上到下开始执行。
    同步API立即执行,异步API交给C++维护的线程执行，异步API的回调函数,被注册到对应的
    事件队列中，当所有代码执行完成后,开始进入事件循环。

    1:
    console.log("start");
    setTimeout(()=>{
        console.log("timeou_1");
    },0);
    setTimeout(()=>{
        console.log("timeou_2");
    },0);
    console.log("end");
    // 运行结果为:
    // start end 1 2

#### nextTick方法

    process.nextTick()方法.
    process.nextTick(callback,[...args])
    callback 回调函数
    args 调用callback时额外传的参数

    此方法的回调函数优先级最高,会在事件循环之前被调用。
    如果你希望异步任务尽早地执行,那就使用process.nextTick。

    const fs = require("fs");
    function readFile(fileName,callback){
        if(typeof fileName !== "string"){
            return callback(new TypeError("filename,必须是字符串类型"));
        }
        fs.readFile(filename,function(error,datas){
            if(error) {
                return callback(error);
            }
            return callback(data);
        });
    }
    // 上述代码的问题在于readFile方法根据传入的参数类型,callback可能会在主线程中
    直接被调用。callback也可能在事件循环的IO轮询阶段直接被调用。
    这可能会导致不可预测的问题发生。如何使用readFile方法变成完全异步呢?
    const fs = require("fs");
    function readFile(fileName,callback){
        if(typeof fileName !== "string"){
            return process.nextTick(callback,new TypeError("filename,必须是字符串类型"));
        }
        fs.readFile(filename,function(error,datas){
            if(error) {
                return callback(error);
            }
            return callback(data);
        });
    }

#### setlmmediate方法

    setlmmediate(ballback,[...args]);
    setimmediate表示立即执行,它是宏任务,回调函数会被放置在事件循环的check阶段。
    在应用中如果有大量的计算型任务,它是不适合放在主线程中执行的。因为计算任务
    会阻塞主线程,主线程一旦被阻塞,其他任务就需要等待。所以这种类型的任务,
    最好交给c++维护的线程去执行。

    可以通过setlmmediate方法将任务放入事件循环中的check阶段,因为代码在这个阶段
    执行不会阻塞主线程,也不会阻塞事件循环。

    setlmmediate();

#### 结论

    Node适合I/O密集型任务，不适合CPU密集型任务，因为主线程一旦阻塞,程序就卡了。

### 网站的概述

#### 网站的组成

    从开发者角度来看,web应用主要由三部分组成:用户界面、业务逻辑、数据
    1.用户界面(视图层): 用于将数据展示给用户的地方,采用HTML、CSS、JavaScript编写。
    2.业务逻辑(控制层): 实现业务逻辑和控制业务流程的地方,可以采用Java、PHP、pyhton、js编写。
    3.数据(模型层): 应用的核心部分,应用业务逻辑的实现,用户界面的战士都是基于数据的。web应用中的数据通常是存储在数据库中的。数据库可以采用Mysql、Mongodb等。

#### 什么是web服务器

    服务器是指能够向外部(局域网或万维网)提供服务的机器(计算机)就是服务器
    在硬件层面,web服务器就是能够向外部提供网站访问服务的计算机。
    在这台计算机中存储了网站运行所必须的代码文件和资源文件。
    在软件层面，web服务器控制着用户如何访问网站中的资源文件，控制着用户如何与网站进行交互。

#### 客户端

    web应用中的客户端是指用户界面的载体,实际上就是浏览器。
    用户可以通过浏览器这个客户端访问网站应用的界面，通过用户界面与网站应用进行交互。

#### 网站的运行

    web应用是基于请求和响应模型的。

#### IP和域名

    IP:互联网协议地址,标识网络中设备的地址，具有唯一性。

    域名: 是由一串用点分隔的字符组成的互联网上某一台计算机或计算机组的名称。
    用于在传输时标识计算机的电子方位。

#### DNS服务器

    域名服务器,互联网域名解析系统。它可以将人类可识别的标识符映射为系统内部
    通常为数字形式的标识码。

#### 端口

    是设备与外界通讯交流的出口。0-65535
    通常web应用占用端口80,在浏览器中访问应用时80可以省略。
    因为默认就访问80.

#### URL

    URL:统一资源定位符,表示我们要访问的资源在哪，以及要访问的资源是什么。

#### 前台和后台,前端与后端

    前台和后台都是指用户界面,前台是为用户准备的,每个人都可以访问的用户界面。
    后台是为网站管理员准备的,只有登录以后才能访问的用户界面,用于管理网站应用
    中的数据。

    前端: 指开发客户端应用的程序员
    后端: 指开发服务器端应用程序的程序员

#### 开发环境说明

    在开发环境中,开发机器既充当了客户端又充当了服务端。
    本机IP: 127.0.0.1
    本机域名: localhost

#### 创建webserver

    创建软件层面的web服务器,用于资源要如何被访问
    在node.js中,环境提供了一个系统模块叫做http.
    可以通过这个模块,创建http协议
    const http = require("http");
    const server = http.createServer((req,res)=>{
        // req请求对象,包含请求信息
        // res响应对象,用于对请求进行响应
        if(req.url === "/"){
            res.write("hellow,node");
            res.end();
        }

    });
    server.listen(3000); // 监听端口
    console.log("服务器启动成功");

## 在Node.js中连接MongoDB

    在MongoDB官网下载Node.js的驱动包

    npm init -y 初始化npm包管理
    npm install mongodb 安装mongodb

### 连接方法

    // 导入客户端函数
    const { MongoClient } = require('mongodb')
    const client =  new MongoClient('mongodb://127.0.0.1:27017')
    const run = async () => {
        try {
            // 开始连接
            await client.connect()
            // 选择数据库
            const dbTest = client.db('jingong')
            // 选择集合
            const users = dbTest.collection('users')
            // 查询集合内的内容,集合需要转换为数组
            const data = await users.find().toArray()
            console.log(data)
        } catch(err) {
            console.log(err)
        } finally {
            //   断开数据库链接
            await client.close()
        }
    }
    run()

### CRUE操作

#### 创建文档

    const { MongoClient } = require('mongodb')
    const client = new MongoClient('mongodb://127.0.0.1:27017')
    const run = async () => {
        try {
            await client.connect()
            const jingong = client.db('jingong')
            const jingongUsers = jingong.collection('users')
            // 创建文档
            const ret = await jingongUsers.insertOne({
                name: '王八蛋',
                age: 20000,
                sex: null,
                lovely: ['123', '456']
            })
            console.log(ret)
        } catch (err) {
            console.log(err)
        } finally {
            await client.close()
        }
    }
    run()

#### 删除文档

     // 删除文档
    const ret = await jingongUsers.deleteOne({
      _id: new ObjectId('62403e7954a8cd389598207d')
    })

#### 更新文档

    const ret = await jingongUsers.updateMany(
      {
        _id: new ObjectId('623fec68cb580000580013a9')
      },
      {
        $set: {
          birthday: new Date()
        }
      }
    )

## 接口设计

    准寻RESTful接口规范

### 创建文章

    请求路径: POST/acticles
    请求参数: Body

### 获取文章列表

    请求路径: GET/acrticles
    请求参数: query

### 获取单个文章

    请求路径: GET/:id

### 删除文章

    DELETE /articles/:id

### 更新文章

    PATCH /acticles/:id

## 创建接口

    安装 express mongodb
    安装nodemon 后端热更新
    nodemon .\app.js

### 实例

    // 导入express
    const express = require('express')
    // 创建app实例
    const app = express()
    // 配置解析请求体解析
    app.use(express.json())
    // 创建app的get请求
    app.get('/', (req, res) => {
      res.send('Hellow,Word')
    })

### GET

    // 获取文章列表
    app.get('/articles/:id', (req, res) => {
      res.send('get /arcicles/:id')
    })

### POST

    // 创建文章
    app.post('/articles', async (req, res, next) => {
        try {
            // 获取客户端的表单数据
            // 数据验证
            // 把验证通过的数据插入数据库中
            // 成功,发送成功,失败发送失败
            const { article } = req.body
            console.log('123', req.body);
            if (!article || !article.title || !article.description || !article.body) {
                res.status(422).json({
                code: 422,
                error: '请求不符合规则要求'
                })
            } else {
                // 连接
                await client.connect()
                const articles = client.db('boker').collection('articles')
                article.createDate = new Date()
                article.lastUpdate = new Date()
                const data = await articles.insertOne(article)
                if (data.acknowledged) {
                // 数据库返回成功后,给客户端响应
                res.status(200).json({
                    content: {
                    ...article
                    },
                    code: 200,
                    succes: '文章创建成功'
                })
                } else {
                    res.status(422).json({
                    code: 422,
                    error: '数据库添加失败'
                    })
                }
        }
        } catch(err) {
            // 错误由错误处理中间件统一处理
            // res.status(500).jsonp({
            //   ...err
            // })
            next(err)
        } finally {
            client.close()
        }
    })

### PATCH

    // 更新列表
    app.patch('/articles/:id', (req, res) => {
      res.send('patch /arcicles/:id')
    })

### DELETE

    // 删除列表
    app.delete('/articles/:id', (req, res) => {
      res.send('delete /arcicles/:id')
    })

### 错误处理中间件

    catch(err) {
        // 错误由错误处理中间件统一处理
        next(err)
    }
    // 它之前的所有路由中传递的next(err)就会进入这里
    // 注意四个参数缺一不可
    app.use((err, req, res, next) => {
      res.status(500).json({
        ...err
      })
    })

### 返回集合中所有文档条数

    // 返回集合内的文档所有条数
    total: await article.countDocuments(),

### 分页查询

    let { current = 1, size = 5 } = req.query
    current = parseInt(current)
    size = parseInt(size)
    await client.connect()
    const article = client.db('boker').collection('articles')
    const data = await article
    .find({},{body: 0})
    .skip((current - 1) * size) // 跳过多少条
    .limit(size) // 拿多少条
    .toArray()

### 通过ID获取文章

    // 通过id获取文章
    app.get('/articles/:_id', async (req, res) => {
        try {
            await client.connect()
            const article = client.db('boker').collection('articles')
            const data = await article.findOne({
            _id: new ObjectId(req.params._id)
            })
            res.status(200).json({
            code: 200,
            status: 'success',
            content: {
                ...data
            }
            })
            console.log(data);
        } catch (err) {
            next(err)
        }
    })

### 完整例子

    const { MongoClient, ObjectId } = require('mongodb')
    const dbUrl = 'mongodb://127.0.0.1:27017'
    const client = new MongoClient(dbUrl)
    // 导入express
    const express = require('express')
    // 创建app实例
    const app = express()
    // 配置解析请求体解析
    app.use(express.json())
        // 创建app的get请求
        app.get('/', (req, res) => {
        res.send('Hellow,Word')
    })
    // 创建文章
    app.post('/articles', async (req, res, next) => {
        try {
            // 获取客户端的表单数据
            // 数据验证
            // 把验证通过的数据插入数据库中
            // 成功,发送成功,失败发送失败
            const { article } = req.body
            console.log('123', req.body);
            if (!article || !article.title || !article.description || !article.body) {
                res.status(422).json({
                code: 422,
                error: '请求不符合规则要求'
                })
            } else {
                // 连接
                await client.connect()
                const articles = client.db('boker').collection('articles')
                article.createDate = new Date()
                article.lastUpdate = new Date()
                const data = await articles.insertOne(article)
                if (data.acknowledged) {
                // 数据库返回成功后,给客户端响应
                res.status(200).json({
                    content: {
                    ...article
                    },
                    code: 200,
                    succes: '文章创建成功'
                })
                } else {
                    res.status(422).json({
                    code: 422,
                    error: '数据库添加失败'
                    })
                }
        }
        } catch(err) {
            // 错误由错误处理中间件统一处理
            // res.status(500).jsonp({
            //   ...err
            // })
            next(err)
        } finally {
            client.close()
        }
    })
    // 获取文章列表
    app.get('/articles', async (req, res) => {
        try {
            let { current = 1, size = 5 } = req.query
            current = parseInt(current)
            size = parseInt(size)
            await client.connect()
            const article = client.db('boker').collection('articles')
            const data = await article
            .find({},{body: 0})
            .skip((current - 1) * size) // 跳过多少条
            .limit(size) // 拿多少条
            .toArray()
            res.status(200).json({
            code: 200,
            status: 'success',
            // 返回集合内的文档所有条数
            total: await article.countDocuments(),
            content: [
                ...data
            ]
            })
        } catch(err) {
            next(err)
        } finally {
            client.close()
        }
    })
    // 通过id获取文章
    app.get('/articles/:_id', async (req, res) => {
        try {
            await client.connect()
            const article = client.db('boker').collection('articles')
            const data = await article.findOne({
            _id: new ObjectId(req.params._id)
            })
            res.status(200).json({
            code: 200,
            status: 'success',
            content: {
                ...data
            }
            })
            console.log(data);
        } catch (err) {
            next(err)
        } finally {
            client.close()
        }
    })
    // 更新列表
    app.patch('/articles/:_id', async (req, res) => {
        try {
            await client.connect()
            const article = await client.db('boker').collection('articles')
            const data = await article.updateOne(
                {
                _id: new ObjectId(req.params._id)
                },
                {
                $set: req.body.article
                }
            )
            if (data.acknowledged) {
            // 更新成功后查询更新的数据,返回给客户端
            const re = await article.findOne({
                _id: new ObjectId(req.params._id)
            })
            res.status(200).json({
                code: 200,
                status: 'success',
                content: {
                ...re
                }
            })
            }
        } catch (err) {
            next(err)
        }
    })
    // 删除列表
    app.delete('/articles/:id', (req, res) => {
        res.send('delete /arcicles/:id')
    })
    // 它之前的所有路由中传递的next(err)就会进入这里
    // 注意四个参数缺一不可
    app.use((err, req, res, next) => {
        res.status(500).json({
            ...err
        })
    })
    app.listen(3000, () => {
        console.log('app listenin port 3000');
    })

## Express

### Express介绍

内部使用的是http模块
请求对象继承自http.IncomingMessage
响应对象继承自http.ServerResponse

很多流行框架基于Express
NestJs

Express特性
简单易学
丰富API
强大路由功能
灵活的中间件
高性能
非常稳定
视图系统支持14以上的主流模板引擎

### Express应用场景

    传统的Web网站Ghost
    接口服务
    服务端渲染中间件(前端服务端渲染)
    开发工具
    JSON Server
    webpack-dev

### 创建Express实例

    const express = require('express')
    const app = express()

### 创建Express路由

    app.get('/', (req, res) => {
      res.send()
    })
    req // 请求对象(客户端请求的参数)
    res // 响应对象(后端给客户端响应的对象)

### 启动路由

    app.listen(3000, () => {
      console.log('Server Run --port: 3000');
    })

### Express路由基础

    路由是指确定应用程序如何响应客户端
    对特定端点的请求,该特点是URL(或路径)和特定的HTTP请求方法
    (GET, POST等)
    每个路由可以具有一个或多个处理程序函数,
    这些函数在匹配该路由时执行

#### 案例

    const express = require('express')
    const app = express()
    app.get('/', (req, res) => {
      res.send('Hellow,World')
    })
    app.post('/', (req, res) => {
      res.send('Hellow,World-POST')
    })
    app.listen(3000, () => {
      console.log('Server Run --port: 3000');
    })

### 请求对象

    express应用使用路由回调函数的参数,
    req和res来处理请求和响应的数据
    express对node.js已有的特性进行二次抽象
    只是在它之上拓展了web应用所需的基本功能
    内部使用的还是http模块

#### 请求对象参数

    req.ip // 获取请求的ip地址
    req.url  // 请求地址
    req.method // 请求方法
    req.headers // 请求头信息
    req.query // 获取url参数(http://xxxx?xxx=123)
    req.param // 获取动态参数(http://wwww.xxx/1)

### 响应对象

    res用于响应用户端的请求

#### 响应对象参数

    res.write('a') // 响应发送数据
    res.end() // 结束响应(结束响应时,可以发送数据)
    res.send() // 发送数据,(可以二进制.文件)
    res.status(201).send() // 设置响应码并发送
    res.status(200).json() // 设置响应码并发送json
    res.cookie() // 发送cookie

### 读取文件

    cosnt fs = require('fs')
    fs.readFile('./db.json', 'utf-8', (err, data) => {
        if (err) {
            res.status(200).json({
                error: err.message
            })
        } else {
            const db = JSON.parse(data)
            res.status(200).json(db.todos)
        }
    })

### 读取文件Promise化

    const { promisify } = require('util')
    const readFile = promisify(fs.readFile)
    const data = await readFile(dbPath, 'utf-8')

### 获取当前路径

    const path = require('path')
    <!-- 当前程序路径下的文件 -->
    const dbPath = path.join(__dirname, './db.json')

### 写入文件

    const writeFile = promisify(fs.writeFile)
    exports.save.ob = async db => {
      const data = JSON.stringdify(db)
      await writeFile('./db.json', data)
    }

### 中间件

    任何请求都能被中间件请求到
    中间件的顺序很重要

#### 日志中间件

    <!--  -->
    app.use((req, res, next) => {
        <!-- 中间件内书写回调函数,用于处理请求对象和响应对象 -->
        // next()下一个中间件,给程序放行
        next()
    })

#### 概念解析

    express的最大特色,就是中间件。一个express应用,就是由许许多多的中间件来完成的

#### AOP

    将日志记录,性能统计,安全控制,事务控制,异常处理等代码从业务逻辑剥离出来。
    利用AOP可以对业务逻辑的各个部分进行隔离

    就是在现有的代码程序中,在程序的生命周期,加入或者删除某个功能。而不影响原本的功能，
    这就是AOP。

#### 中间件函数

    在express中,中间件就是一个可以访问的请求对象、响应对象和
    next方法的一个函数。

    在中间件函数中可以执行以下任何任务:
    执行任何代码,修改request或者response响应对象
    结束请求响应周期，调用下一个中间件。

    如果当前的中间件功能没有结束请求-响应周期,则必须调用next()将控制权
    传递给下一个中间件功能。否则，该请求将被挂起。

#### 中间件分类

    应用程序级别中间件
    路由级别中间件
    错误处理中间件
    内置中间件
    第三方中间件

##### 应用程序级别中间件

    不关心请求路径(日志)
    限定请求路径()
    限定请求路径+请求方法

    配置多个处理函数
    app.use('url', () => {}, () => {})
    (配置多个中间件处理函数后,不会往后找中间件。)
    (而是去找下一个中间件的处理函数)

    可以为同一个路径定义多个中间件
    (next()之后,不能再去发送响应)

    要从路由中间件堆栈中跳过其余中间件,请使用next('route')。
    将控制权传递给下一个路由。
    (app.use()不在其中的范围内。)

    中间件也可以在数组中声明为可重用。

##### 路由器级中间件

    router.js
    const express = require('express')
    // 创建路由实例
    const router = express.Router()
    // 配置路由
    router.get('/foo', () => {})
    // 导出路由
    module.exports = router

    app.js
    // 导入路由规则
    import router = require('router')
    // 挂载路由
    app.use(router)
    <!-- 挂载时添加限定访问前缀 -->
    app.use('/abc', router)

##### 错误处理中间件

    以与其他中间件函数相同的方式定义错误处理中间件函数
    除了,使用四个参数,而不是三个参数之外。
    错误处理中间件始终带有四个参数,您必须提供四个参数以将
    其表示为错误处理中间件函数。即使不需要使用该next（）对象。

    在所有的中间件之后,挂载错误处理中间件
    (缺一不可)
    app.use((err, req, res, next) => {
    })

    其他路由try,catch
    catch(err) {
      next(err)
    }

    next('route') // 跳过当前所有路径的中间件
    next(err) // 跳入报错路由

##### 处理404

    通常会在所有的路由后面,配置处理404的路由
    app.use((req, res, next) => {
      res.status(404).json({
        code: 404,
        title: '未找到路径信息'
      })
    })

##### 内置中间件

    express具有以下内置中间件函数

    express.json()用于解析JSON格式的请求体
    express.urlencoded() 解析请求体格式为url的请求
    express.raw() 解析octet格式的请求体
    express.test() 解析格式为text的请求体
    express.static() 托管静态资源文件

##### express第三方中间件

    在早起的express内置了很多中间件。
    后来express在4之后移除了这些内置的中间件

##### express路由

    路由方法是从http方法之一派生的,并添加到
    express类的实例。
    express支持所有http请求方法相对应的方法

    有一种特殊的路由方法。
    app.all()为所有的http请求方法路径加载中间件功能.
    app.all('/sss', () => {})

###### 路由路径

    路由路径可以是字符串,可以使字符串,
    字符串模式或正则表达式

    res.download() 提示要加载的文件
    res.end() 结束响应
    res.json() 发送json格式的响应
    res.jsonp() 发送带jsonp支持的json格式支持的响应
    res.sendFile() 发送文件流的

###### app.route

    这是定义的链式路由处理程序的示例.
    app.route()

    app.route('/book')
    .get(() => {})

### RESTful接口设计规范

    API与用户的通信协议,尽量使用HTTPs协议。

    域名
    应该尽量将API部署在专用域名之下
    如果API很简单,不会有进一步拓展,可以考虑放在主域名下.

#### 版本

    应该将API的版本号放入URL
    http://api.example.com/v1

#### 路径

    路径又称“终点”,表示api的具体网址

#### HTTP动词

    对于资源的具体操作类型,由HTTP动词表示。
    在RESTful架构中,每个网址代表一种资源。所以,
    网址中不能有动词，只能有名词。而且,所用的名词
    往往与数据库的表格名对应,一般来说。数据库中的表都是
    同种记录的“集合”。所以API中的名词,也应该使用复数。

    常用的http动词有下面五个
    GET,post,put(完整更新),patch(部分更新),delete

#### HTTP状态码

    HTTP状态码就是一个三位数,分成五个类别。
    1xx: 相关信息
    2xx: 操作成功
    3xx: 重定向
    4xx: 客户端错误
    5xx: 服务器错误

##### 常用状态码

    200 GET成功返回用户请求的数据
    201 POST/PUT/PATCH 用户新建或修改成功后
    202 表示一个请求已经进入后台排队(异步任务)
    204 用户删除数据成功
    400 用户发出的请求有错误，服务器没有进行新建
    或修改数据的操作。(参数缺失,密码错误)
    401 表示用户没有权限
    403 表示用户得到授权,但是访问被禁止
    404 表示用户发送的请求是不存在的
    406 表示用户请求的格式不正确
    410 用户请求的资源被永久删除.
    422 创建一个对象时,发生一个验证错误
    500 服务器内部错误.

#### 返回结果

    API返回的数据格式,不应该是纯文本.而应该是一个JSON对象。
    因为这样才能返回标准的结构化数据。所以,服务器回应的HTTP头的
    属性要设置为json

#### 身份认证

    基于JWT接口的权限认证。
    字段名,字段值: bearer token

#### 跨域处理

    可以在服务端设置CORS允许客户端跨域资源请求

### 目录结构

    config  // 配置文件
        config.default.js
    controller 用户解析用户
    model 数据持久层
    middleware 用户编写中间件
    router 用户配置各个接口路由
    util 工具模块
    app.js 入口文件

### 日志中间件

    安装morgan插件
    npm install morgan

    app.use(morgan('dev'))

### cors跨域

    npm install cors
    app.use(cors())

### 路由模块化

#### index.js

    const express = require('express')
    const router = express.Router()
    // 注册用户相关路由
    router.use(require('./user'))
    module.exports = router

#### user.js

    const express = require('express')
    const router = express.Router()
    const routeName = 'users'
    // 用户登录
    router.post(`/${routeName}/login`, async (req, res, next) => {
    try {
        // 处理请求
        res.send('POST-/users/login')
    } catch (err) {
        next(err)
    }
    })
    // 用户注册
    router.post(`/${routeName}`, async (req, res, next) => {
        try {
        // 处理请求
        res.send('POST-/users')
        } catch (err) {
        next(err)
        }
    })
    // 获取当前登录用户
    router.get(`/${routeName}`, async (req, res, next) => {
        try {
        // 处理请求
        res.send('get-/users')
        } catch (err) {
        next(err)
        }
    })
    // 更新用户
    router.patch(`/${routeName}`, async (req, res, next) => {
        try {
        // 处理请求
        res.send('patch-/users')
        } catch (err) {
        next(err)
        }
    })
    module.exports = router

### 提取控制器模块

    将处理函数从路由内提起出来,封装起来,放置在controller文件夹内.

### 错误处理中间件

    在middleware内创建err-handler文件.用于存放错误处理函数
    const util = require('util')
    module.exports = () => {
        return (err, req, res, next) => {
            res.status(500).json({
            code: 500,
            error: util.format(err)
            })
        }
    }

    可以通过util.format方法将对象序列化为字符串

### 将数据添加数据库(mongoose插件)

    添加数据库的方法可以放入model数据模型内
    可以安装这个插件快速管理数据库业务逻辑
    npm install mongoose

#### 链接数据库

    mongoose.connect('mongodb://localhost/test');

#### 注册数据模型

    const mongoose = require('mongoose')
    const userSchema = new mongoose.Schema({
        username: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        bio: {
            type: String,
            default: null
        },
        image: {
            type: String,
            default: null
        },
        createAt: {
            type: Date,
            default: Date.now
        }
    })
    module.exports = userSchema

#### 数据模型入口文件

    const mongoose = require('mongoose');
    const { dbUrl } = require('../config/config.default')
    // 链接mangodb数据库
    mongoose.connect(dbUrl);
    const db = mongoose.connection
    // 当链接失败时
    db.on('error', err => {
        console.log('数据库链接失败', err)
    })
    // 当链接成功时
    db.once('open', () => {
        console.log('数据库链接成功');
    })
    // 组织导出模型类
    module.exports = {
        // 用户表数据
        User: mongoose.model('user', require('./user'))
    }

#### 操作数据库函数方法(controller-控制器)

    // 导入数据模型
    const { User } = require('../model/index')
    // 向数据库注册用户的方法
    exports.userRegister = async (req, res, next) => {
        try {
            // 处理请求
            //   const { body } = await req
            // 基本数据验证
            // 业务数据验证
            // 验证通过将数据保存到数据库
            const user = new User(req.body)
            console.log(req.body)
            // 保存到数据库
            const data = await user.save()
            res.status(200).json({
                ...data._doc
            })
            // 发送成功响应
        } catch (err) {
            next(err)
        }
    }

#### 数据验证插件

    express-validator

#### 数据验证的基本使用

    在router文件夹内的路由文件内导入
    const { body, validationResult } = require('express-validator')

    // 用户注册
    router.post(`/${routeName}`, [ // 配置验证规则
        body('username').notEmpty().withMessage('用户名不能为空'), // 非空
        body('password').notEmpty().withMessage('密码不能为空'),
        body('email')
        .notEmpty().withMessage('邮箱不能为空')
        .isEmail().withMessage('邮箱格式不正确')
        .bail() // 前面存在错误,就不往下走
        // 自定义(唯一验证)
        .custom(async value => {
            const data = await User.findOne({
                email: value
            })
            if (data) {
                return Promise.reject('邮箱已存在')
            }
        })
    ], (req, res, next) => { // 判断验证结果
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: errors.array()
            })
        }
        next()
    }, require('../controller/user').userRegister) // 通过验证,执行具体结果的控制器

#### 数据验证中间件

    将验证结果返回的函数封装在middleware文件夹内(参考express-validator官网)
    将验证规则封装在role文件夹内。(导入返回结果函数,将[]规则书写在返回封装函数内)
    在路由内导入验证规则对象,然后将在路由中间件内调用

#### 数据库密码加密处理

    // 导入md5加密模块
    const crypto = require('crypto')
    module.exports = str => {
      return crypto.createHash('md5')
        .digest('hex')
    }
