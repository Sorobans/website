---
title: Ajax网络编程与Axios库
date: 2022-01-10
tags:
  - ajax
  - axios
  - 网络请求
  - http
categories: 学习笔记
---

# Ajax网络变成与Axios库

## Ajax基础

### Ajax概述

    Google Suggest
    AJAX,最早出现在2005年的GoogleSuggest
    它不像HTML、JavaScript或CSS这样的一种"正式的"技术
    它是在浏览器端进行网络编程(发送请求、接收响应)的技术方案。
    它使我们可以通过JavaScript直接获取服务端最新的内容会而不必重新加载页面
    让Web更能接近桌面应用的用户体验

    AJAX就是浏览器提供的一套API，可以通过JavaScript调用，从而实现通过代码控制请求与响应。
    实现通过JavaScript进行网络变成
    XML:最早在客户端与服务端之间传递数据时所采用的数据格式。

### 应用场景

    按需获取数据
    对用户数据效验
    自动更新页面内容
    提升用户体验，无刷新的体验

### 体验Ajax

    免费数据接口:
    https://jsonplaceholder.typicode.com

    jQuery中的Ajax方法
    $.ajax({
        url: "https://",
        type: "GET",
        dataType: "json",
        data: {"id": 1}, // 对数据筛选,ID为1的项
        success: function(data){
            // 使用请求成功的数据
        }
    });

### 原生Ajax

    发送ajax请求步骤
    1.创建XMLHttpRequest类型的对象
    2.准备发送,打开与一个网址之间的连接
    3.执行发送动作
    4.指定xhr状态变化事件处理函数

    // 创建一个XMLHTTPRequest类型的对象 --- 相当于打开了一个浏览器
    let xhr = new XMLHttpRequest();
    // 打开一个与网址之间的链接,相当于在地址栏输入网址
    xhr.open("GET","https://jsonplaceholder.typicode.com/users");
    // 通过链接发送一次请求 --相当于回车
    xhr.send(null);
    // 指定xhr状态变化事件处理函数 ---相当于处理网页呈现后的操作
    xhr.onreadystatechange = function(){
        // 通过判断xhr的readyState,确定此次请求是否完成
        if(this.readyState === 4){
            console.log(this.responseText);
        }
    };

### xhr对象

    XMLHttpRequest类型对象
    AJAXAPI中核心提供的是一个XMLHttpRequest类型，所有的AJAX操作都需要使用到这个类型。
    let xhr = new XMLhttpRequest();
    IE6兼容写法
    xhr = new ActiveXObject("Microsoft.XMLHTTP");

### open()方法开启请求

    本质上XMLHttpRequest就是JavaScript在Web平台中发送Http请求的手段，
    所以我们发送出去的请求仍然是HTTP请求，同样附和HTTO约定的格式。
    语法: xhr.open(method,url)
    method: 要使用的HTTP方法,比如[GET]、[POST](提交、上传)、[PUT](更改数据)、[DELETE](删除) 等。
    url: 要向其发送请求的URL地址,字符串格式。

### send()方法发送请求

    用于发送HTTP请求
    语法: xhr.send(body)
    body: 在XHR请求中要发送的数据体，根据请求头中的类型进行传参。
    如果是GET方法，无需设置数据体.可以传NULL或者不传参数

     xhr.open("GET","https://jsonplaceholder.typicode.com/users?id=1"); // 打开一个GET请求链接
      // 如果是get方法请求，不需要再send中传参数。如果它想传参数。直接传在网址上.

### setRequestHeader()方法设置请求头

    此方法必须在open()方法和send()之间调用。
    语法: xhr.setRequestHeader(header,value); // POST方法时一定
    header: 一般设置"Content-Type"，传输数据类型,即服务器需要我们传送的数据类型。
    value: 具体的数据类型,常用"application/x-www.form-urlencoded"和"application/json"

    let xhr = new XMLHttpRequest(); // 新建一个请求对象
    xhr.open("POST","https://jsonplaceholder.typicode.com/users"); // 打开一个GET请求链接
    // 设置请求头，一般GET方法不需要设置.而post方法必须设置请求头
    xhr.getResponseHeader("Content-type","application/x-www.form-urlencoded");//设置请求头
    // 如果是get方法请求，不需要再send中传参数。如果它想传参数。直接传在网址上.
    xhr.send("name=harry&age=19"); // 方法发送一次请求
    xhr.onreadystatechange = function(){
        if(this.readyState === 4){
            // 通过xhr.ready.readyState的值判断是否完成发送
            console.log(this.responseText);
        }
    };

### 原生Ajax详解-响应状态分析

    xhr.onreadystatechange = function(){
        // 指xhr对象的readyState状态发生变化时触发。
    };

    readyState属性
    readyState属性返回一个XMLHttpRequest代理当前所处的状态。由于readystatechange事件是
    在xhr对象状态变化时触发(不单是在得到响应时)。也就意味着这个事件会被触发多次。
    所以我们有必要了解每一个状态值所代表的含义:
    readyState
    0 UNSENT 代理XHR被创建，但尚未调用open()方法
    1 OPENED open()方法已经被调用,建立了连接。
    2 HEADERS_RECEIVED send()方法已经被调用.并且已经可以获取状态行和响应头
    3 LOADING 响应体下载中,responseText属性可能已经包含部分数据
    4 DONE 响应体下载完成，可以直接使用reponseText

### 同步和异步

    同步: 一个人在同一个时刻只能做一件事情,在执行一些耗时的操作(不需要看管)不去做
    别的事,只是等待。
    异步: 在执行一些耗时的操作(不需要看管)去做别的事,而不是等待。

    Ajax中的实现。xhr.open()方法的第三个参数传入的是一个Boolean值。其作用就是设置此次
    请求是否采用异步方式执行。
    默认为true异步，如果需要同步执行可以通过传递false实现。
    如果采用同步方式执行，则代码会卡死在xhr.send()这一步。

    为了让这个事件可以更加可靠(一定触发),在发送send()之前,一定是先注册readystatechange
    不论同步或异步都能触发成功
    了解同步模式即可,切记不要使用同步模式.

### XML数据格式

    如果希望服务端返回一个复杂数据，该如何处理?
    关心的问题就是服务端发出何种格式的数据，这种格式如何在客户端用JavaScript解析。

    XML
    一种数据描述手段
    老掉牙的东西，简单演示一下。基本现在的项目不用了。
    淘汰的原因: 数据冗余太多

    <?xml verson="1.0" encoding="utf-8"?>
    <student>
        <name>张三</name>
        <age></age>
    </student>
    <!-- xml就是一种数据格式-元数据 -->
    <!-- 元数据:用来描述数据的数据 -->
    <!-- 这种数据的缺点: 元数据占用的数据量比较大的。不利于大量网络数据传输 -->
    <!-- 在其他语言中，解析数据比较复杂。不利用使用。 -->

### JSON数据格式

    JSON，js对象表示法。
    也是一种数据描述手段,类似于JavaScript字面量方式。
    服务端采用JSON格式返回数据,客户端按照JSON格式解析数据。

    JSON格式的数据,与js对象的区别。
    JSON数据不需要存储到变量中.
    结束时不需要写分号
    JSON数据中的属性名，必须加引号。

    JSON对象
    使用JSON对象的parse方法可以将json格式的字符串转换成对象格式
    具有了属性和方法，方便我们在js中进行使用
    使用JSON对象的stringify(obj);可以将obj对象转换为JSON格式的字符串。

    不管是JSON也好,还是XML,只是在AJAX请求过程种用到.并不代表它们与AJAX
    之间有必然的联系。它们只是数据协议罢了。
    不管服务端是采用XML还是采用JSON本质上都是将数据返回给客户端。
    服务端应该根据相应内容的格式设置一个合理的Content-Type。

### JSON-server的使用

    json-server是一个node模块，运行Express服务器。你可以指定一个json
    文件作为API数据源。

    安装json-server: install -g json-server
    也就是说,我们可以使用它快速搭建一个web服务器。
    网址: https://github.com/typicode/json-server

    终端使用JSON-SERVER把json布著到服务器
    json-server --watch db.json

### json-server文件书写方法

    {
        "users": [
            {"id": 1,"name": "tom","age": 19,"class": 1},
            {"id": 2,"name": "jerry","age": 17,"class": 1},
            {"id": 3,"name": "lucy","age": 15,"class": 1}
        ],
        "posts": [
            {"id": 1000,"userId": 1,"tittle": "JavaScript","content": "JS是一门非常好学的语言"},
            {"id": 1001,"userId": 2,"tittle": "JQ","content": "JQ是一门非常好学的语言"},
            {"id": 1002,"userId": 3,"tittle": "HTML","content": "HTML是一门非常好学的语言"},
            {"id": 1003,"userId": 2,"tittle": "JavCSSaScript","content": "CSS是一门非常好学的语言"}
        ],
        "comments":[
            {"id": 1,"postId": 1000,"content": "good"},
            {"id": 2,"postId": 1002,"content": "good"},
            {"id": 3,"postId": 1003,"content": "good"}
        ]
    }

### 原生Ajax应用-GET方法

    通常在一次GET请求过程中，参数传递都是通过URL地址中的"?"参数传递。
    一般在GET请求中，无需设置请求头。
    xhr.open("GET","http://localhost:3000/users?age=19"); // 查询用户年龄为19的
    xhr.open("GET","http://localhost:3000/posts/1/comments"); // 查询帖子ID为1的的评论

### 原生Ajax应用-POST请求

    POST请求
    POST请求过程中,都是采用请求体承载需要提交的数据。
    需要设置请求头中的Content-Type,以便于服务端接收数据。
    需要提交到服务端的数据可以通过send方法的参数传递
    let xhr = new XMLHttpRequest();
    xhr.open("POST","http://localhost:3000/users");
    xhr.setRequestHeader("Content-type","application/json");
    xhr.send(JSON.stringify(
        {
            "name": "张三",
            "age": 17,
            "class": 2
        }
    ));
    xhr.onreadystatechange = function(){
        if(this.readyState === 4){
            console.log(this.responseText);
        }
    };

### 处理响应数据渲染

    客户端中拿到请求的数据过后最常见的就是把这些数据呈现到界面上。
    如果数据结构简单，可以直接通过字符串操作(拼接)的方式处理。
    如果数据过于复杂，字符串拼接维护成本太大。可以使用模板引擎或者
    ES6提供的模板字符串。

    let tb = document.querySelector("table[border = '1']");
    let xhr = new XMLHttpRequest(); // 创建一个http请求对象
    xhr.open("GET", "http://localhost:3000/users"); //链接一个get请求地址
    xhr.send(null); // 发送请求
    xhr.onreadystatechange = function () {
        if (this.readyState === 4) {
            console.log(JSON.parse(this.responseText)); //打印获取的json文本
            let tx = JSON.parse(this.responseText);
            for(let i = 0;i<tx.length;i++){
                tb.innerHTML +=
                `<tr>
                    <td>${tx[i].id}</td>
                    <td>${tx[i].name}</td>
                    <td>${tx[i].age}</td>
                    <td>${tx[i].class}</td>
                </tr>`;
            }
        }
    };

## Ajax常用库

### jQuery中的ajax方法

    jQuery中有一套专门为ajax封装的函数。
    jQuery.ajax();
    常用选项参数介绍:
    url: 请求地址
    type: 请求方法.默认为'get'
    dataType: 服务端响应数据类型
    contentType: 请求体内容类型.默认"application/x-www-form-urlencoded"
    data: 需要传递到服务端的数据,如果GET则通过URL传递,如果POST则通过请求体传递。
    timeout: 请求超时时间
    beforeSend: 请求发起之前触发
    success: 请求成功之后触发(响应状态码200)
    error: 请求失败触发
    complete: 请求完成触发(不管成功与否)

    $.ajax({
        url: "http://localhost:3000/users",
        type: "GET", // 请求类型
        dataType: "json", // 服务端响应数据类型
        data: {"id": 1}, // 请求体 数据筛选体
        beforeSend: function(xhr) {
            // 发送之前被触发
        },
        success: function(data){
            // 响应成功后触发
        },
        complete: function(){
            // 不管响应还是没响应,都会被触发
        }
    });

### $.get()请求

    $.get();
    get请求快捷方法
    $.get(url,data,callback);
    $.get("http://localhost:3000/users",{"id": 7},function(data){
        console.log(data);
    });

### $.post()请求

    $.ajax({
        url: "http://localhost:3000/users",
        type: "post",
        dataType: "json",
        data: {"name": "李四","age": 46,"class": 4}, // 上传的数据
        success: function(data){
            console.log(data);
        }
    });

    $.post()
    POST请求快捷方法
    $.post(url,data,callback);

    $.post("http://localhost:3000/users",{
        "name": "王二麻子",
        "age": 32,
        "class": 3
    },function(data){
        console.log(data);
    });

### 其他类型请求

    put 更改
    delete 删除

    PUT更新请求:
    $.ajax({
        url: "http://localhost:3000/users/12",
        type: "put",
        dataType: "json",
        data: {"name": "凌菀喵喵","age": 19,"class": "凌菀喵喵会"},
        success: function(data){
            console.log(data);
        }
    });
    // 更改users-ID为12的项目信息

    DELETE数据删除请求:
    $.ajax({
        url: "http://localhost:3000/users/23",
        type: "delete",
        success: function(data){
            console.log(data);
        }
    });
    // 删除数据ID为23的项
    // delete请求没有必要用success和data数据体.

### $.ajaxSetup()

    $.ajaxSetup(); //设置全局AJAX默认参数
            $.ajaxSetup({
            url: "http://localhost:3000/users",
            type: "post"
    });

## Axios

### Axios介绍

    Axios是目前应用最广泛的AJAX封装库
    Axios库
    地址:https://unpkg.com/axios/dist/axios.min.js
    使用 script 标签引入

### 体验Axios

    axios.get("http://localhost:3000/users?id=1")
    .then(function(response){
        console.log(response.data);
        // 成功后获取的数据
    })
    .catch(function(error){
        console.log(error);
        // 请求失败后执行的
    })

### Axios API

    可以通过向axios()传递相关配置来创建请求
    axios(config) config为对象格式的配置选项
    axios(url,config) config可选

    常用配置项
    url 用于请求的服务器的URL,必需
    method 创建请求时使用的方法
    baseURL 传递相对URL前缀,将在前缀加在url前面 (看情况设置)
    headers 即将被发送的自定义请求头(默认为json,不需要设置)
    params 即将与请求一起发送的URL参数 (GET用)
    data 作为请求主体被发送的数据 （POST用)
    timeout 指定请求超市的毫秒数(0表示无超时时间)
    responseType 表示服务器响应的数据类型，默认"json" (通常不需要设置)

    axios({
        url: "/users",
        method: "post",
        baseURL: "http://localhost:3000",
        headers: {
            "Content-type": "application/json"
            // 数据请求头
            // 不配置时也有默认值
        },
        params: {
            id: 1
            // GET方法用的URL参数
        },
        data: {
            "name": "李荣浩",
            "age": 19,
            "class": 5
            // POST请求添加的数据体
        },
        timeout: 1000,
        responseType: "json"
    })
    .then(function(res){
        console.log(res.data);
        // 响应之后打印
    })
    .catch(function(error){
        console.log(error);
        // 超时/错误打印
    });

### 全局配置默认值

    全局默认配置值
    可以将被用在各个请求的配置默认值
    axios.defaults.baseURL = 'https://......';
    axios.defaults.headers.post['Content-type'] = 'application/json';

### axios拦截器

    在请求或响应被then或catch处理前拦截它们

    //使用拦截器,对请求进行拦截处理
    axios.intercetors.request.use(function(config){
        config.params = {
            id: 2
        };
        config.baseURL = "";
        return config;
    })

    // 添加响应拦截器
    // 对响应数据进行拦截
    axios.interceptors.response.use(function(response){
        return response.data;
    });

### 快速请求方法get和post

    快速请求方法
    axios.get(url[,config]);
    axios.post(url[,data[,config]]);
    axios.delete(url[,config]);
    axios.put(url[,datas[,config]]);

    GET请求:
    axios.get("http://localhost:3000/users",{
        params:{
            id: 24
        }
    })
    .then(function(res){
        console.log(res.data);
    })
    .catch(function(error){
        console.log(error);
    });

    POST请求:
    axios.post("http://localhost:3000/users",{
        "name": "阿巴",
        "age": 22,
        "class": 9
    })
    .then(res => {
        console.log(res.data)
    })
    .catch(err => {
        console.error(err);
    })

### XHR 2.0-onload和onprogress事件

    xhr.onload事件: 只在请求完成时触发
    xhr.onprogress 事件: 只在请求进行中触发

    let xhr = mew XMLHttpRequest();
    xhr.open("");
    xhr.onload(
        function(){
            consoloe.log(this.responseText);
        }
    )
    xhr.send(null);

    xhr.onprogress = function(e){
        console.log("progress",this.readyState); // 3

        // 在周期性请求过程中,接收到的数据个数
        console.log(e.loaded);
        // 接受数据的总个数
        console.log(e.total);
    };

### response和responseType属性

    response属性
    以对象的形式表述响应体,其类型取决于responseType的值。你可以尝试
    设置reponseType的值。以便通过特定的类型请求数据

    reponseType要在调用open()初始化请求之后，在调用send()发送请求到
    服务器之前方可生效.
    xhr.responseType = "json";
    xhr.onload(function(){
        console.log(this.responseType);
    });

## 跨域和模板引擎应用

### 跨域请求问题和同源策略

    同源策略是浏览器的一种安全策略。所谓同源是指域名、协议、端口完全相同。
    在同源策略下，只有同源的地址才可以互相通过AJAX的方式请求。
    同源或者不同源说的是两个地址之间的关系。不同源地址之间的请求称之为跨域请求。

### JSONP原理

    JSON with Padding ，是一种借助于script标签发送跨域请求的技巧。
    原理就是在客户端借助script标签请求服务端的一个地址
    地址返回一段带有某个全局函数调用的JavaScript脚本
    在调用函数中，原本需要返回给客户端数据通过参数传递给这个函数
    这样客户端的函数中就可以通过参数得到原本服务端想要的数据

    JSONP只能发送GET请求

    JSONP用的是script标签.和xmlhttp没有任何关系

### jQuery中对jsonp的支持

    jQuery中的jsonp
    jQuery基本使用$.ajax()
    jQuery中使用JSONP就是将dataType设置为jsonp


    $.ajax({
        url: "http://121.5.24.202:3000/users",
        type: "GET",
        dataType: "jsonp",
        jsonp:"", //设置后台接口返回函数名参数名
        jsonCallback: "",// 后台返回回调函数,重命名
        data:{"id":1},
        success: data=>{
            console.log(data);
        }
    });

### CORS跨域

    cors跨域。
    Corss Origin Resource Share,跨域资源共享.
    这种解决方案无需客户端作出任何变化,只是在被请求的服务端相应的时候
    添加一个access-Control-Allow-Origin的响应头,表示这个资源是否允许指定域请求.
    Access-Control-Allow-Origin的值:
                表示允许任意源访问,不安全.

### 模板引擎作用

    减少字符串拼接
    在模板里面解析json,然后跟html内容拼接,性能会更好.

### artTemplate

    art-template是一个简约,超快的模板引擎。
    网址: https://github.com/aui/artTemplate
    中文使用文档: https://aui.github.io/art-template/zh-cn/docs
    常用语法:
    <% %>符号包裹起来的语句则为模板的逻辑表达式
    <%= content %>为输出表达式

### Axios onUploadProgress上传进度检测

    axios({
        method: 'POST',
        url: '/boss/',
        data,
        headers: {
            Content-type': 'multipart/form-data'
        },
        onUploadProgres (event) {
            // 左: 总进度,右: 已经上传的大小
            console.log(event.total, event.loaded)
        }
    })

### 文件上传对象接收(Element的httpRequest)

    const fd = new FormData()
    fd.append('file', option.file)
    uploadFile(param){
    // 获取上传的文件名
    var file = param.file
    //发送请求的参数格式为FormData
    const formData = new FormData();
    formData.append("file",file)
    // 调用param中的钩子函数处理各种情况，这样就可以用在组件中用钩子了。也可以用res.code==200来进行判断处理各种情况
    uploadFile(formData,param).then(res=>{
        param.onSuccess(res)
        }).catch(err=>{
        param.onError(err) }
    ) },

## Axios-request配置

    // 设置Axios拦截器,请求头,token,域名
    import axios from 'axios'
    import { baseUrl } from './baseUrl'
    // Vuex
    // import store from '../store'
    const request = axios.create({
        timeout: 2000
    })
    // Axios拦截器
    request.interceptors.request.use((config) => {
        console.log(baseUrl)
        // 域名头设置
        config.baseURL = baseUrl
        // 读取存储的token
        // const { user } = store.state
        // if (user && JSON.parse(user.data?.token)) {
        //   // 请求头添加Token
        //   config.headers.Authorization = JSON.parse(user.data?.token)
        // }
        return config
    })
    export default request

## 文件下载

    // ECU数据导出
    export const intertableDetailsEcuExport = () => {
        // console.log(params);
        return axios({
        method: 'GET',
        responseType:'blob',
        url: `cdcweb/tmBaselineModuleinfo/export`,
        // headers:{Authorization :'Bearer ' + sessionStorage.getItem('access_token')}
        });
    }
    // ECU数据导出函数
    const ecuExport = async () => {
        const data = await intertableDetailsEcuExport()
        if (data !== undefined) {
            console.log(data, 'data');
            // 存储二进制数据,转8
            // const uint8Array = await new Uint8Array(data)
            // console.log(uint8Array);
            // 创建文件对象,excel
            const blobUrl = await new Blob([data], { type: 'application/vnd.ms-excel' })
            // console.log(blobUrl);
            // 创建下载URL
            const loadLink = await window.URL.createObjectURL(blobUrl)
            // 创建A标签进行下载
            const targetLink = document.createElement('a')
            targetLink.style.display = 'none'
            targetLink.href = loadLink
            await targetLink.setAttribute('download', `${dateTomCat1(new Date())}ECU导出.xlsx`)
            if (typeof targetLink.download === 'undfined') {
            targetLink.setAttribute('target', '_blank')
            }
            document.body.appendChild(targetLink)
            targetLink.click()
            document.body.removeChild(targetLink)
            window.URL.revokeObjectURL(loadLink)
        }
        //   console.log(data);
    }

### 循环多文件下载

    for (const item of this.fileTableData.data) {
        if (item.isChecked) {
          const { data } = await axios({
            method: 'GET',
            url: item.fileUrl,
            responseType: 'blob'
          })
          if (data !== undefined) {
            const blobUrl = await new Blob([data])
            // console.log(blobUrl);
            // 创建下载URL
            const loadLink = await window.URL.createObjectURL(blobUrl)
            // 创建A标签进行下载
            const targetLink = document.createElement('a')
            targetLink.style.display = 'none'
            targetLink.href = loadLink
            await targetLink.setAttribute('download', item.fileName)
            if (typeof targetLink.download === 'undefined') {
              targetLink.setAttribute('target', '_blank')
            }
            document.body.appendChild(targetLink)
            targetLink.click()
            document.body.removeChild(targetLink)
            window.URL.revokeObjectURL(loadLink)
          }
          // sleep阻塞线程,兼容部分浏览器.成功进行下载.
          sleep(100)
        }
    }
