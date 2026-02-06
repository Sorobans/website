---
title: Typescript小试牛刀
date: 2022-02-08
tags:
  - 学习笔记
  - Typescript
categories: 学习笔记
---

# TypeScript基础

## 编译TS文件

初始化ts目录 tsc --init
编译: tsc 01.ts
监视ts文件: tsc --watch 01.ts

## Ts严格编译模式

    tsc --noEmitOnError --watch 01.ts

## 显式类型

    function greet (person: string, date: Date) {
    }

### 类型推断

    let msg = "Hello";
    msg = 123; // erro

    /*很多时候可以不加类型约束*/
    // 如果靠着类型推断,如果后面的传入的值
    // 不符合初始值的类型，便会报错

## 降级编译

    在tsconfig.json内,
    修改target的编译目标。
    可以将ts代码编译为想要的版本、

## 严格模式

    tscconfig.json:
    "strict": true, // 严格类型模式
    "noImplicitAny": true, // 判断any类型错误
    "strictNullChecks": true, // null和undfined无法隐式推断

## 基元类型

    string、number、boolean
    始终使用小写的:
    string、number、boolean

### Array

    数组类型书写方式:
    type[] 、 Array<type>

    type表示任意合法的类型(string、number)

    let arr: number[] = [1,2,3,]
    let arr2: Array<number> = [1,5,6,]

### any

    不希望某个特定值导致类型检查错误
    let obj:any = {
        x:0
    }
    obj.foo()
    obj()
    obj.bar = 100
    obj = 'hello'
    cons n: number = obj

## 编译目标目录配置

    outDir

## 变量类型注释

    let myNmae:string = "雪花"

    // :类型

## 函数

    TypeScript还可以定义函数的返回值类型
    function greet(name: string):void {
    }
    :void标识符，表示函数不允许有返回值。

    const getFavor = ():number=> {
        return 26
    }

### 上下文类型

    const names = ["小千", "小锋"]
    for (let value of names) {
        console.log(value)
    }
    比如这样，TypeScript自动推断出,value的类型。
    这种的类型推断又叫做上下文类型。

### 对象类型

    function printCoord(pt: {x: number,y: number}) {
        console.log('坐标的X值为:'+ pt.x)
        console.log('坐标的X值为:'+ pt.y)
    }
    printCoord({
        x: 3,
        y: 7
    })

    可选类型,表示可传可不传。(不传那就是undfined)
    const printName = (obj: {first: string, last?: string}):void => {
        console.log(`姓${obj.first}${obj.last?.toLocaleLowerCase}`);
    }
    printName({
        first: 'Felix'
    })
    printName({
        first: '雪',
        last: "花"
    })

## 联合类型

    通过管道符 | 可以声明联合类型。
    const printId = (id: number | string)=> {
        console.log('You ID is' + id);
        if(typeof id === 'string') {
            console.log(id.toLocaleLowerCase);
        }
    }
    printId(101)
    printId('202')

    const welcomePeople = (x: string[] | string)=> {
        // if(Array.isArray(x)) {
        //     console.log('hello' + x.join('and'))
        // } else {
        //     console.log(x);
        // }
        return x.slice(0,3)
    }

## 类型别名

    我们可以通过 type 关键字 来声明自定义类型
    type ID = number | string
        const printID = (id: ID) => {
    }
    type UserInputSanitizedString = string

    const sannizeInput = (str: ID):UserInputSanitizedString => {
        return str + 'new Input'
    }

## 接口与extends关键字

    接口通过interface来定义
    // 拓展接口
    interface Animal {
        name: string
    }
    // 通过 extends 关键字实现接口对接口的继承
    interface Bear extends Animal {
        honey: boolean
    }
    const bear:Bear = {
        name: 'winie',
        honey: true
    }

## 类型别名的类型拓展

    type Animal = {
        name: string
    }
    type Bear = Animal & {
        honey: boolean
    }
    const bear: Bear = {
        name: 'winnie',
        honey: true
    }

## 接口与类型别名字段添加

    重复定义两个相同的接口,
    不同的成员。能够实现对接口的拓展

    interface MyWindow {
        count: number
    }
    interface MyWindow {
        title: string
    }
    const w: MyWindow = {
        title: 'h',count: 5
    }

    自定义类型创建以后,是不能更改的。
    也不能够通过同一个名字来拓展。

## interface和type总结

    interface:
        值类型: 只能为对象
        拓展: extends 继承关键字、同名接口声明不同成员
    type:
        值类型: 可以为单类型,也可以为联合类型，也可以为{}
        拓展: 只能够通过 & 来对自定义类型实现拓展

## 类型断言

    const  myCanvas = document.getElementById('main_canvas') as HTMLCanvasElement
    const x = ('hello' as unknown) as number

    当不知道这个值的类型的时候，可以使用 as 关键字将它断言成差不多的类型。

## 文字类型

    let xcy:'123' = '123'
    // xcy的值,只能为文字约束的:'123'
    function printText (direction: 'left' | 'right' | 'center'): -1 | 0 |1 {
        // 文字类型约束,可以将变量值约束为,指定的几个字符串,通过联合符号 | 连接
        // 文字类型,数字类型约束,还可以运动到函数的返回值约束里
        // 函数的返回值,只能为 -1, 0, -1
        return 1
    }
    <!--  -->
    // 值类型约束,与接口的联合应用
    interface Options {
        width: number
    }
    function configGure(x: Options | 'auto'):void {
    }
    configGure({width: 100})
    configGure('auto')

### Ts对象,文字类型,自动类型断言可能遇见的错误

    <!-- Ts对象,可能会在自动类型断言遇见的错误  -->
    //
    const Ajax = (url: string, method: 'GET' | 'POST'):void => {}
    const req = {
        url: 'https://www.baidu.com',
        method: 'GET' as 'GET'
    }
    // Ts类型断言会将req内的method的文字类型约束，断言成String类型约束
    // 后面在Ajax方法内调用,可能会出现,String不是GET | POST的情况
    // 我们可以使用手动类型断言,as,来解决问题,将类型推断错误的,类型给手动细分。
    // 也可以在对象声明的后面,添加as const,将其内部成员常量化(只读)，来解决。
    // const req = {} as const (对象成员常量化)
    Ajax(req.url, req.method)

## null与undefine类型

    function liveUndfined(x?: number | null) {
        // 断言符号,?表示参数可以为undfined、
        // ! 可以将 可能为null或undfined的值,断言不为undfined或null
        console.log(x!.toFixed());
    }

## 枚举

    枚举通过enum关键字来定义
    enum Direction {
        Up = 1,
        Down,
        Left,
        Right,
    }
    <!-- 如何访问枚举的值 -->
    Direction.Up

    <!-- 枚举特性 -->
    <!-- 当设置了Up值为1,Down,Left,Right的值会依次递增1 -->

## bigint和symbol(不太常用的原语)

    // bigint表示非常大的整数
    // bymbol 表示全局唯一引用 (构造函数)

    const onHundred: bigint = BigInt(100)
    const anotherHundred: bigint = 100n
    (// 目标低于ES 2020。bigint特性是不可用的)

    <!-- Symbol -->
    const firstName = Symbol('name')
    const lastName = Symbol('name')
    if (fitstName === lastName) {
        // 因为Symbol特性,firstName和LastName是始终不相等的
        console.log('Ok')
    }

## typeof类型守卫

### 类型缩小

    类型缩小,就是从宽类型转换为窄类型的过程
    常用于处理,联合类型变量的场景

    function cit (paading: number || string[] || ) {
        <!-- 以下特殊的类型检查,成为类型防护,类型守卫 -->
        if (type padding === 'number') {
            // 类型保护,类型缩小
        }
    }

### 真值缩小

    function getUsersOnline(numUserOnline: number) {
        if (numUserOnline) {
            return `现在共有${numUsersOnline}人在线`
        }
        return '现在没有人在线'
    }
    0,NaN,"",On,null,undefined(都为false)
