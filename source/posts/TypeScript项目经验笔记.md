---
title: TypeScript项目经验笔记
date: 2023-07-07
tags:
  - 学习笔记
  - TypeScript
categories: 学习笔记
---

# TS

## Vue

### props转ts提示

    import { ExtractPropTypes } from 'vue'
    const props = {
        layout: {
            type: String as PropType<'inline' | 'grid' | 'vertical'>,
            default: 'inline',
        },
        labelWidth: {
            type: [Number, String] as PropType<number | 'auto'>,
            default: 'auto',
        },
        colon: {
            type: Boolean,
        }
    };
    type Props = ExtractPropTypes<typeof props>;
    // 没啥用可以用泛型

### JSDOC-使用vue提示接口方法

    /**
      * @typedef { Object } Props
      * @property { boolean } dialogVisible - 是否显示
      * @property { string } parentId - 联系人所属客户/渠道ID
      * @property { string } companyName - 公司名称
      * @property { string } channelName - 渠道名称
      * @property { boolean } companyHidden - 是否隐藏公司和渠道选择
    */
    /**
      * @type { import('vue').ExtractDefaultPropTypes<Props> }
    */

## 全局类型提示

    .d.ts为后缀的TS文件可以提供全局的TS类型提示

### declare指令

    这个指令可以将.d.ts内的指令抛处，在其他.ts文件内。
    可以不用抛处使用类型注解

### 导入

    .d.ts文件内，导出其他.d.ts未抛处的注解。
    可以使用下面的这种注释的方式进行导入
    // / <reference path="./locale/index.d.ts" />

## TS指令

### 泛型

#### interface

    interface Ref<T = string, A = string> {
        value: T,
        res?: A
    }

#### 方法参数

    function test1<T = number>(a: T) {
        return a
    }

## 取一个函数返回值类型

    type Val = ReturnType<typeof getVal>

## 将ts类型所有转为可选值

    type NewVal = Partial<Val>

## 将ts类型所有值转为必选值

    type NewVal = Required<Val>

## TS描述一个方法的类型

    interface Axios {
        // 参数
        (config: AxiosConfig): Promise<AxiosConfig>;
        // 拦截器
        interceptors: {
            requestBefore: BeforeUse<Base>,
            responseBefore: BeforeUse<any>
        }
    }
    declare const axios: Axios
    export default axios

## TS描述一个类

    declare namespace obj {
        interface Text {
            (str: string): string;
        }
        class Test {
            constructor(a: string)
        }
    }

## 装饰器

    // 类装饰器
    const Animal = (action: string) : Function => {
      return (target: any, readme: any) => {
        target.prototype.call = () => {
          console.log(action)
        }
        return class Dog2 extends target {
          constructor () {
            super()
            this.name = '小汪'
          }
        }
      }
    }
    // 属性装饰器
    const Cons = (age: number) => {
      return (target: any, readme: any) => {
        return (target2: any) => {
          console.log(target, target2, '属性装饰器')
          return age
        }
      }
    }
    // 方法装饰器
    const FunDe = (params: string) => {
      return (target1: any, readme: any) => {
        console.log(target1, readme, params, '方法装饰器')
        return target1.bind({
          age: '33333'
        })
      }
    }
    // Dog被装饰变成了Dog2
    @Animal('汪汪汪')
    class Dog {
      @Cons(17)
      public age : number | undefined = 1;
      @FunDe('你好世界')
      getAge () {
        return this.age
      }
      @FunDe('你好世界123')
      static hellow () {
        // 被装饰前[class Dog2 extends Dog]
        // 被装饰后{ age: '33333' }
        console.log(this, '被装饰过的静态方法')
      }
      constructor() {
      }
    }
    const dog = new Dog()
    Dog.hellow()
    // @ts-ignore
    dog.call()
    console.log(dog)
    // 初始类上的原型有dog
    console.log(Object.getPrototypeOf(Object.getPrototypeOf(dog)))
    console.log(dog.getAge(), '方法装饰器装饰过的')
    // 输出
    //   [Function: getAge] {
    //   kind: 'method',
    //     name: 'getAge',
    //     static: false,
    //     private: false,
    //     access: { has: [Function: has], get: [Function: get] },
    //   metadata: undefined,
    //     addInitializer: [Function (anonymous)]
    // } 你好世界 方法装饰器
    // undefined 1 属性装饰器
    // 汪汪汪
    // Dog2 { age: 17, name: '小汪' }
    // { call: [Function (anonymous)] }
    // 33333 方法装饰器装饰过的

# 严格绑定调用注释

    // With strictBindCallApply on
    给函数加上以上注释后，bind和apply方法去调用函数。
    将会检查函数类型传参是否正确传入或调用。

    如果不加上这个注释。这些函数使用bind和apply能直接调用，并返回any。

## 子组件向父组件Ref模板, 抛出内部方法

    const FooterComponents = forwardRef(({ item, index }, ref) => {
        const [showBottomBar, setShowBottomBar] = useState(true)
        useImperativeHandle(ref, () => {
          return {
            showBottomBar, setShowBottomBar
          }
        })
        return (<div></div>)
    }
