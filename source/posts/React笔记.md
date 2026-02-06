---
title: React学习笔记
date: 2022-06-21
tags:
  - 学习笔记
  - React
  - React16
categories: 学习笔记
---

# 简介

    React使用组件构建用户界面
    React是facebook退出的用于构建用户界面的前端框架

## 安装React脚手架

    npm install -g create-react-app

# JSX语法

    JSX可以看作是js语言的拓展,他既不是一个字符串也不是一个HTML
    它具备了JS所有的功能,同时还可以被转为HTML界面上进行展示

    JSX可以动态显示数据 {}
    可以使用jsx调用方法 (使用方法,过滤数据进行显示)
    也可以调用浏览器的内置方法
    支持表达式、支持三元表达式
    支持模板字符串
    jsx注释 /* */

    jsx本身就是一个表达式,
    它可以直接作为一个变量值来使用
    或者是作为一个方法的返回值

    JSX的返回值只能有一个父元素
    当使用单标签的时候必须正确关闭,否则会有语法错误

## jsx的方法调用

    使用箭头函数来返回函数的执行,或者使用bind来执行.
    const handler = (a, b) => {
        console.log(a, b);
    }
    function App() {
        return (
            <div onClick={handler.bind(null, 1, 2)}>{sayHello()}</div>
        );
    }

## jsx的event对象

    通过bind调用方法
    有参数的话,最后一个参数就是event
    无传参,没有event,或者直接传event(第一个参数就是event.)

### 箭头函数接收event

    (event) => handler(event)

## 循环数据

    在react的jsx中,可以将数组中的数据解构

const arr = [
{
name: '小雪花',
age: 18,
salary: 20000
},
{
name: '齐元昊',
age: 21,
salary: 20000
}
]
const ret = arr.map(item => {
return (

<li>
{item.name}
</li>
)
})
function App() {
return (
<ul>
{
ret
}
</ul>
);
}
export default App;
### key
    在遇见了需要去遍历的数据时,需要往被循环的元素身上
    添加唯一的key值。
    return (
        <li key={item.id}>
        {item.name}
        -
        {item.age}
        </li>
    )
## react添加内联样式
    <!-- 设置样式的时候,应该将键值对放在对象中 -->
    const styleObj = {
        width: 100,
        height: 300,
        backgroundColor: 'green'
    }
    function App() {
        return (
            <div style={styleObj}>
            123
            </div>
        );
    }
    export default App;

    <!-- 内联样式无法支持伪类及媒体查询 -->
    需要导入React中的Raidum函数将当前需要支持伪类操作的组件
    包裹之后再导出
    import Radium from 'radium'
    export default Radium(App);

    <!-- 媒体查询 -->
    '@media (max-width: 1000px)': {
        width: 300,
        backgroundColor: 'red'
    }
    需要使用媒体查询时,需要导入
    import { StyleRoot } from 'radium'
    然后使用StyleRoot组件包裹住需要媒体查询的根组件
    <StyleRoot>
      <App />
    </StyleRoot>

### 内联样式数组

    const buttonStyle = {
        base: {
            width: 200,
            height: 100,
            fontSize: 16,
            backgroundColor: '#fff'
        },
        login: {
            backgroundColor: 'green'
        },
        logout: {
            backgroundColor: 'orange'
        }
    }
    <!-- 标签内的style -->
    style={[
        buttonStyle.base,
        isLogin ? buttonStyle.login : buttonStyle.logout
    ]}>
    <!-- 一个数组里面可以给多个样式 -->

## 外联样式

### 全局外联样式

    所有组件当中都可以直接进行使用
    <!-- 给jsx元素添加类名 -->
    <div className={'box'}>
    </div>

    <!-- 使用方式 -->
    直接在index.css中全局导入

### 组件级别的外联样式

    <!-- 只有某一个组件可以使用 -->

    <!-- 命名规则 -->
    组件名.module.css

    <!-- 使用方式 -->
    import style from './test.module.css'
    <p className={style.item}>
        test中的p,组件外联样式
    </p>

### styledJs样式包

    参考npm包官网

## 创建组件

### 创建函数组件

    () => (
      <div></div>
    )

    function App () {
      return (
        <div></div>
      )
    }

### 创建类组件

    <!-- 导入创建方法 -->
    import React , { Component } from 'react'

    <!-- 类声明创建 -->
    class About extends Component{
        render () {
                return (
                        <div>
                            About类组件中的内容
                        </div>
                )
        }
    }

    <!-- 创建类组件必须继承Component render -->
    <!-- 组件名称的首字母必须是大写的,在React当中可以用于区分组件和普通的标记 -->

### 元素占位符

    <!-- 不停的添加根元素,会增加很多元素节点,然后会浪费性能 -->
    <!-- 为了避免有太多的根元素, 我们可以使用元素占位符 -->

    Fragment
    <!-- 默认是不存在的,好处是减少Dom节点. -->
    <!-- 类似于vue中的template -->
    return (
      <Fragment>
          About类组件中的内容
      </Fragment>
    )

## 向组件传递数据

### 组件属性传递

    <!-- 传递方式 -->
    <About name={'拉钩教育'} age={100}></About>
    <!-- 对象方式传递 -->
    const obj = {
      name: '拉钩教育',
      age: 100
    }
    <About {...obj}></About>

    <!-- 接收方法 -->
    <!-- 在类组件中this
    存在一个props属性,外部传递进来的数据都可以用它来进行访问 -->
    class About extends Component{
        render () {
            return (
                <Fragment>
                    <p>
                        {this.props.name}
                    </p>
                    <p>
                        {this.props.age}
                    </p>
                </Fragment>
            )
        }
    }
    <!-- 函数式组件通过函数的第一个参数进行接收数据 -->
    <!-- 也可以通过解构第一个参数的方式接收 -->
    function Test ({name, age})
    function Test (props) {
        return (
            <div
            className={'box'}>
                TestInDiv
                <p className={style.item}>
                    test中的p,组件外联样式
                    {props.name}
                    {props.age}
                </p>
            </div>
        )
    }

## 默认值及类型校验

    <!-- 如果没有通过属性向子组件传递属性值 -->
    <!-- 那么可以通过设置默认值来使用 -->

### 函数式组件设置默认值方式

    Test.defaultProps = {
      name: 'syy',
      age: 123
    }

### 类组件设置默认值方式

    <!-- 在render方法上面,定义static静态属性defaultProps -->
    static defaultProps = {
        name: '拉钩教育',
        age: 10
    }

### props类型属性校验

    <!-- 导入类型校验 -->
    import propTypes from 'prop-types'
    <!-- 设置props属性校验 -->
    Test.propTypes = {
      name: propTypes.number
    }
    <!-- react使用打点的方式进行类型调用 -->
    Test.propTypes = {
      name: propTypes.number.isRequired
    }

## 向组件传递JSX

    <!-- 只有双标签才能够传递JSX -->
    <Test>
        <div>
          tEST中的div
        </div>
    </Test>

    <!-- 使用props中的children拿到传递的jsx -->
    function Test ({name, age, children}) {
        return (
            <div
            className={'box'}>
                TestInDiv
                <p className={style.item}>
                    test中的p,组件外联样式
                    {name}
                    {age}
                    {children}
                </p>
            </div>
        )
    }

## 组件状态(类组件)

    <!-- 组件状态,状态就是数据. -->
    <!-- 组件状态就是指某一个组件自己的数据 -->
    <!-- 数据驱动DOM, 当我们修改某个一个数据的时候。 -->
    <!-- 界面上的DOM中的数据也会自动更新 -->

    <!-- 在类组件当中,默认就存在一个state属性 -->
    <!-- 它是一个对象,可以用于保存当前组件的数据 -->
    <!-- 之后还可以通过setState方法来修改数据的值 -->
    <!-- 最后修改之后的状态会自动展示在DOM界面上 -->
    class About extends Component{
        static defaultProps = {
            name: '拉钩教育',
            age: 10
        }
        state = {
            name: 'zce',
            age: 18
        }
        render () {
            return (
            <Fragment>
                <p>
                    {this.state.name}
                </p>
                <p>
                    {this.state.age}
                </p>
            </Fragment>
            )
        }
    }

    <!-- 在raect中是不能够直接来修改state中的值的 -->
    只能通过this.setState({}) 来进行更新

    <!-- setState是一个异步函数 -->
    <!-- 通过async 和 await 进行等待。 -->
    <!-- 通过 setState({}, val => {}) 拿回调值 -->

    <!-- 通过回调函数,返回拿回调值,来更新state -->
    this.setState(state => ({
    }))

    <!-- setState在使用的时候，既可以传入函数, 也可以传入对象 -->
    <!-- 且两者是有不同点的 -->

    <!-- 使用对象setState会进行合并 -->
    <!-- 如果使用函数式setState不会进行合并 -->

## 组件中的this

    <!-- 如果类组件中是使用了function定义函数 -->
    <!-- 那么调用时如何不让指针指向window -->

    <!-- 在事件中被调用时 -->
    <!-- 使用箭头函数来执行 -->
    <button onClick={() => {this.handler()}}></button>
    <button onClick={() => this.handler()}></button>
    <!-- 使用箭头函数直接调用函数可以, 也可以直接返回函数 -->
    <!-- 也可以使用.bind(this)给函数添加指针 -->

## 单向数据流

    <!-- 何为单向数据流动 -->
    <!-- 单向数据流动如何修改 -->
    <!-- 如果有需要共享的数据,需要放在组件的最外层. -->
    <!-- 单向数据流动自体向下 -->

    <!-- 单向数据流的设计 -->
    <!-- 在类组件中就可以使用state定义状态 -->
    <!-- 子组件想要更改父组件传递过来的数据流,需要父组件提供更改的方法 -->
    class APP extends Component {
      state = {
        name: '123'
      }
      // 定义状态的更新方法
      updateState = (target) => {
        this.setState({
          name: tatget.name
        })
      }
      render () {
        return {
          <div></div>
          <c1 change={updateState}></c1>
        }
      }
    }

### 特点

    单向数据流动,自顶向下,从父组件传到子组件
    基于单向数据流动,要求我们将共享的数据。要求我们将共享的数据,定义在上层组件。
    子组件通过调用父组件传递过来的方法可以更改数据
    当数据发声更改时,React会重新渲染我们的组件树。

## 受控表单绑定与更新

    <!-- 采用类组件 -->
    <!-- 函数组件没有钩子HOOK时,默认是没有状态的. -->

    <!-- 受控表单绑定与数据同步 -->

### 受控表单

    <!-- 表单与元素的值,全部由react进行管理 -->
    <!-- 此时表单元素的值,都放在state里进行管理 -->
    <!-- 表单元素的值,也需要从state中进行获取 -->

### 非受控表单

    <!-- 非受控表单,不受react管理。表单元素的数据 -->
    <!-- 由DOM元素本身进行管理 -->
    <!-- 表单元素的值，也是存放在DOM元素中。获取的时候 -->
    <!-- 需要操作DOM元素 -->

### 受控表单修改

    <input
      type={'text'}
      value={this.state.name}
      onChange={val => this.setState({
        ...this.state,
        name: val.target.value
      })}></input>
    </div>

    <!-- 通过onChange接收event值,来获取输入框输入的值 -->
    <!-- 然后进行更新 -->

    <!-- 通过方法, 获取自定义属性给的值，对受控表单对象进行更新 -->
    changeValue = (val) => {
        // console.log(val.target.value);
        this.setState({
            [val.target.name]: val.target.value
        })
    }

### 只读表单

    <input readOnly />
    <!-- 设置readOnly属性，表示表单只读 -->

### 非受控组件-默认值

    <!-- 通过defalutValue设置的值，就是原生dom的value属性 -->
    <!-- 这样写出来的组件,其value值就是用户输入的内容, 与react没有关系 -->
    <input defaultValue={this.state.name} />

#### 受控表单checkedBox更新

     <input
        id={`checkbox${index}`}
        type={'checkbox'}
        checked={item.checkedValue}
        onChange={
        (event) => this.updataState(event, index)
        }
    />
    updataState =  (event, index) => {
        const updataState = this.state.hobblyList
        updataState[index] = {
            ...updataState[index],
            checkedValue: event.target.checked
        }
        this.setState({
            hobblyList: [
                ...updataState
            ]
        })
    }

### 非受控表单DOM操作

    通过给元素设置ref属性
    <input ref="ref1" />

    cosnt ref1 = this.ref.ref1
    this.res.元素设置ref名,来获取到元素对象
    (新版本react不允许这样操作.这样做会raning)

### 类的构造函数,对函数的指针进行处理

    constructor () {
        super()
        this.updataState = this.updataState.bind(this)
    }

### 子组件计算属性

    render里面可以直接书写变量,进行一些计算.
    (因为state里面的值,setState之后,react组件都会重新render。)
    (计算属性,之类的东西书写在render函数内很好。)
    (state内用于书写多个组件之间共享的数据.非state内的数据,更改后除非组件重新render,
    否则是不会更新。)但是只有setState才会使组件重新render

# Reac生命周期

## 组件生命周期分类

### 挂载

    React挂载阶段.当组件被创建,被插入到DOM当中时,这一阶段称之为挂载组件。

#### 生命周期方法

    constructor  设置组件的初始配置,状态定义,this指向修改
        constructor () {
            super()
            this.state = {}
        }
    render 渲染组件解析JSX,转换为真实DOM
    componentDidMount 组件挂载完成后执行一些操作(类似于vue的onMonted)
        发送网络请求
        添加定时器
        添加事件监听
        获取DOM元素

### 更新

#### 什么是更新组件

    当数据发生改变时,数据时需要重新渲染的。
    比如:
        外部传入的props,以及自身管理的state

#### 生命周期方法

    shouldComponentUpdate (nextProps, nextState) // 现在react不再建议使用了。
        组件是否更新
        默认返回布尔值。如果返回为false,后续不再执行
        应用场景:
            比如父组件更新了数据,子组件也会跟着渲染.
          子组件判断自身数据有没有更新if(this.state === nextState) return false
          然后控制组件是否更新(用于提升性能)
        新的解决方案:
            创建子组件时,使用PureComponent进行继承
            class App extends PureComponent
    render ()
        解析JSX,渲染DOM呈现界面
    componentDidUpdate
        组件更新完之后才执行

### 卸载

#### 什么是组件卸载

    将组件从DOM上删除(
      比如组件是否被渲染,JSX通过三元或者if语句判断。
      或者发生了页面跳转的情况,组件被卸载,便会出发卸载组件的生命周期。
    )

#### 常用方法

    componentWillUnMount ()
    (应用场景, 比如组件的长轮询。短轮询,之类的定时器操作。)
    (为了避免性能的浪费,以及不必要的网络请求,在组件被销毁时,应当被清除。)

# React发送Ajax请求

## 在何时发送网络请求

    在组件被挂载上去的时候,发送网络请求。
    在componentDidMount()生命周期内,比较适合ajax，然后更新组件。

# React进行请求转发

## package.json内配置

    添加下面的字段。
    请求没有host,会默认请求同源服务器。
    同源服务器没有,react会代理请求proxy配置的host。
    "proxy": "http://localhost:3005"
    (缺点,只能够去配置一个服务器地址)

## 使用http-proxy-middleware

    <!-- 使用expres和http-proxy-middleware进行请求转发 -->
    <!-- webpackDevpres(如vue-cli内配置的proxy)
    项目打包后无法进行代理(可以使用nginx反向代理) -->
    <!-- 或者Node.js进行正向转发 -->

    <!-- node进行proxy代理 -->
    <!-- 需要安装express和http-proxy-middleware -->
    const express = require('express');
    cosnt proxy = require('http-proxy-middleware');
    cosnt app = express();<!--  -->
    app.use('/api', proxy({target: 'http://www.example.org', changeOrigin: true}));
    app.listen(3000);

# React中mock数据

在public中新建api文件夹。
内部书写json格式文件
(内部的静态数据,都可以通过,localhost访问到的)
(get请求也可以直接请求到)

# Redux工作流程

## 为什么需要Redux

## Redux是什么

    Redux是一个数据管理框架。
    它提供了一个叫做store的统一数据存储仓库。
    store就像是一个数据管理的中间人，让我们组件之间无需再直接进行数据传递。

## 创建store和reducer

    index.js文件内导入redux
    import { createStore } from 'redux';

### 创建reducer

    const reducer = () => {
      return {
        count: 0
      }
    }

### 创建store

    const store = createStore(reducer)

### 获取store

#### index.js入口中进行设置

    // 组组件中导入react-redux
    import { Provider } from 'react-redux'
    <!-- 使用Provider包裹APP -->
    <Provider
    store={store}>
        <React.StrictMode>
          <App />
        </React.StrictMode>
    </Provider>

#### 组件中获取

    组件内导入方法
    import { connect } from 'react-redux'
