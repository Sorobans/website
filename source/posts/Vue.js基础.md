---
title: Vue.js基础
date: 2022-02-05
tags:
  - 学习笔记
  - VUE2
categories: 学习笔记
---

# VUE.js基础

## 传统开发

    传统的原生和jQuert开发,DOM操作频繁,
    DOM操作与逻辑代码混合,可维护性差
    不同功能区域书写在一起,可维护性差
    模块之前的依赖关系复杂

## Vue简介

    Vue是渐进式JavaScript框架

## Vue.js核心特性

### 数据驱动视图

    数据变化会自动更新到对应元素中去,无需手动操作dom,这种
    行为称作单向数据绑定

    对于输入框等可输入元素,可设置双向数据绑定
    双向数据绑定是在数据绑定的基础上,可自动将元素输入内容更新给数据,
    实现数据与元素内容的双向绑定。

    Vue.js的数据驱动视图是基于MVVM模型实现的.
    MVVM是一种软件开发思想
        Model 代表数据
        View 代表视图模板
        ViewModel 代表业务逻辑处理代码

    基于MVVM模型实现的数据驱动视图解放了DOM操作
    View与Model处理分离,降低代码耦合度
    但双向绑定时的bug调试难度增大
    大型项目的View与Model过多,维护成本高

### 组件化开发

    组件化开发,允许我们将网页功能封装为自定义HTML标签,
    复用时书写自定义标签名即可。

    组件不仅可以封装结构,还可以封装样式与逻辑代码,大大提高了
    开发效率和可维护性

## Vue.js安装

    本地引入
    cdn引入
    npm安装

    npm install vue@2.6.12

## Vue.js基础语法

### Vue实例

    Vue实例是通过Vue函数创建的对象,
    是使用Vue功能的基础

#### el选项

    用于选取一个DOM元素,作为Vue实例的挂载目标
    只有挂载的元素,内部才会被Vue进行处理.
    外部为普通HTML元素。
    代表MVVM中的View层

    可以为CSS选择器格式的字符串或HTMLElement实例,
    但不能为HTML或body

    let vm = new Vue({
        el: "#app"
    });
    let vm = document.querySelector('#app');

    挂载完毕后,可以通过vm.$el进行访问

    未设置el的vue实例,也可以通过vm.$mount()进行挂载,
    参数形式与el规则相同。

#### 插值表达式

    挂载元素可以使用Vue.js的模板语法,模板中可以通过
    插值表达式为元素进行动态内容设置，写法为{{}}

    注意点: 插值表达式只能书写在标签内容区域,可以与其他内容混合。
        内部只能书写JavaScript表达式,不能书写语句

#### data选项

    用于存储Vue实例需要使用的数据,值为对象类型。
    data中的数据可以通过vm.$data.数据或vm.数据访问。

    data中的数据可以直接在视图中的插值表达式访问。
    data中的数据为响应式数据,在发生改变时,视图会自动更新。

    data中存在数组时,索引操作与length操作无法自动更新视图。
    这时可以借助Vue.set()方法替代操作。
    Vue.set(实例内的data内数组,索引,数据);

#### methods选项

    用于存储需要在Vue实例中使用的函数

    methods中的方法可以通过实例.方法名访问。
    方法中的this为vm实例,可以便捷访问vm数据等功能。
    methods: {
        output() {
            console.log(this.title,this.content);
        }
    }

### 指令

    指令本质就是HTML自定义属性
    Vue.js的指令就是以v-开头的自定义属性。

#### v-once指令

    使元素内部的插值表达式只生效一次
    <p>{{content}}</p>
    <p v-once>{{content}}</p>

#### v-text指令

    元素内容整体替换为纯文本数据
    (不能为html标签结构,其中也不像插值表达式一样能够添加运算符)
    <p v-text="content"></p>
    p.textinner = vue.content;

#### v-html指令

    元素内容整体替换为指定的HTML文本
    (文本内的标签会被生成为真正的元素)
    <p v-html="content"></p>

#### 属性绑定

##### v-bind指令

    用于动态绑定HTML属性
    <p v-bind:title="title"></p>

    v-bind指令简写形式:
        <p :title="title"></p>

    与插值表达式类似,v-bind中也允许使用表达式
    <p :class="'demo'+3"></p> <!-- 能使用基本表达式 -->
    <p :class="prefix + num"></p>
    let vm = new Vue({
        el: "#app",
        data: {
            prefix: "demo",
            num: 5
        }
    });

    v-bind如果需要一次绑定多个属性,还可以绑定对象。
    <p v-bind = "attrObj"></p>
    data: {
        attrObj: {
            id: 'box',
            title: '示例内容'
        }
    }

##### Class绑定

    class是HTML属性,可以通过v-bind进行绑定。
    并且与class属性共存

    对于class绑定,Vue.js中提供了特殊处理方式。
    对象绑定方式:
    <p :class="{b: 'isb',c:'asd'}"></p>
    {b: "isb",'class-d': true} b键名对应的是类名,而后面的键值
    则是代表的data中存储的数据值，为布尔值,让类名是否生效，
    let vm = new Vue({
        el: "#app",
        data: {
            isB: true,
            isC: false
        }
    });

    数组绑定方式:
    <p :class="['a',{b: isB},'c',classC]"></p>
    a,c是传统不用控制的类名,{b: isB}则是需要条件控制的类名。
    ''是字符串数据.不加引号则是Vue对象内data的数据。

##### Style绑定

    style是HTML属性,可以通过v-bind进行绑定,并且可以与
    style属性共存。

    <p style="width: 100px" :style="styleObj"></p>
    let vm = new Vue({
        el: "#app",
        data: {
            styleObj: {
                width: '200px',
                height: '100px',
                color: 'red',
                backgroundColor: green,
                'font-size': "56px"
            }
        }
    });
    style对象的属性名书写方法可以使用驼峰命名法。
    也可以使用""包裹css属性样式。不过,推荐使用驼峰命名法。

    当我们希望给元素绑定多个样式对象时,可以设置为数组。
    <p :style="[styleObj1,styleObj2]">

### 渲染指令

#### v-for指令

    用于遍历数据渲染结构,常用的数组与对象均可遍历
    <li v-for="index in arr">{{index}}</li>
    <li v-for="value in obj">{{value}}</li>

    如果要取出索引值可以这样写:
    <p v-for="(value,index) in obj"></p>

    v-for还可以通过数值来创建元素:
    <p v-for="(value,index) in 5"></p>

##### :key

    通过:key给元素设置:key值。
    可以提高渲染效率
    建议使用item或value、id
    不建议使用索引

##### template标签

    通过<template>标签设置模板占位符。可以将部分元素
    或内容作为整体进行操作。
    <template v-for="item in items">
        <p></p>
        <p></p>
    </template>
    template不能被绑定:key属性.

#### v-show指令

    用于控制元素显示与隐藏,适用于显示隐藏频繁切换时使用。
    <p v-show="true"></p>
    <p v-show="false"></p>

    template 无法使用v-show指令

#### v-if指令

    用于根据条件控制元素的创建与移除
    <p v-if="false">
    <p v-else-if="true">
    <p v-else>

    给v-if的同类型元素绑定不同的:key

    出于性能考虑,应避免将v-if与v-for应用于同一标签。
    (同一标签内,Vue会先渲染v-for再渲染v-if)
    v-if可以放在v-for的父标签里。比如在需要v-for的标签外
    嵌套 v-if 的 template 占位符标签。来进行优化

### v-on指令

    用于进行元素的事件绑定
    <button v-on:click="content='新内容'">

#### v-on使用代码

    <div id="app">
        <p>{{content}}</p>
        <button v-on:click="myfun()">按钮</button>
    </div>

    const ap = new Vue({
        el: "#app",
        data: {
            content: "这是默认内容"
        },
        methods: {
            myfun(){
                alert("123");
            }
        }
    });

#### v-on指令简写

    <button @click="myfun()"></button>

#### v-on指令-事件对象

    事件程序代码较多时,可以在methods中设置函数,并设置
    为事件处理程序。

    如果同一事件绑定了多个DOM,可以通过event参数,来访问事件对象。
    methods: {
        fn(event) {

        }
    }

    在视图中可以通过$event访问事件对象:
    <button @click="fn(content,$event)">按钮</button>
    当我们想使用事件对象,又想自定义参数传参时,Vue有解决方案。
    Vue提供了$event的实参标识符.当输入$event时,vue就知道我们想使用事件对象。
    便会帮我们处理.

### v-model指令

    v-model指令,用于给input、textarea、select元素设置
    双向数据绑定。

    <input type="text" v-model="value">
    new Vue({
        el: "",
        data: {
            value: ""
        }
    })

#### 单选按钮绑定

    <p>radio数据为: {{value3}}</p>
    <input type="radio" name="sex" id="male" value="male" v-model="value3">
    <label for="male">男</label>
    <input type="radio" name="sex" id="famale" value="famale" v-model="value3">
    <label for="famale">女</label>

    data: {
        value3: "famale"
    }

#### 复选框绑定

    复选框绑定分为单个选项与多个选项两种情况。书写方式不同。
    单个复选框可以设置为空字符串.多个复选框可以为对象或数组形式

##### 案例

    对象:
    <div id="app">
        <p>同意协议的值为: {{agree_va}}</p>
        <input type="checkbox" name="agree" value="选项内容" id="agree" v-model="agree_va">
        <label for="agree">我已同意协议</label>

        <p>同意协议的值为: {{hobbily}}</p>
        <input type="checkbox" name="hobbily" value="游泳" id="swim" v-model="hobbily.swim">
        <label for="swim">游泳</label>
        <input type="checkbox" name="hobbily" value="吃饭" id="eat" v-model="hobbily.eat">
        <label for="eat">吃饭</label>
    </div>
    <script>
        const vm = new Vue({
            el: "#app",
            data: {
                agree_va: "",
                hobbily: {
                    swim: "",
                    eat: ""
                }
            }
        });
    </script>

    数组:
    <div id="app">
        <p>同意协议的值为: {{agree_va}}</p>
        <input type="checkbox" name="agree" value="选项内容" id="agree" v-model="agree_va">
        <label for="agree">我已同意协议</label>

        <p>同意协议的值为: {{hobbily2}}</p>
        <input type="checkbox" name="hobbily" value="游泳" id="swim" v-model="hobbily2">
        <label for="swim">游泳</label>
        <input type="checkbox" name="hobbily" value="吃饭" id="eat" v-model="hobbily2">
        <label for="eat">吃饭</label>
    </div>
    <script>
        const vm = new Vue({
            el: "#app",
            data: {
                agree_va: "",
                hobbily: {
                    swim: "",
                    eat: ""
                },
                hobbily2: []
            }
        });
    </script>

#### 选择框绑定

    选择框绑定分为单选框与多选框绑定两种情况，
    书写方式不同。
    单选
    <select v-model"value6">
    data: {value6: ""}

    多选
    <select v-model="value7" multiple>
    data: {value7:[]}

##### 单选选择框

    <div id="app">
        <p>单选框的值为{{sex}}</p>
        <select name="sex" id="" v-model="sex">
            <option value="nano">请选择</option>
            <option value="male">男</option>
            <option value="famele">女</option>
            <option value="male trans famele">跨性别女性</option>
            <option value="famele trans male">跨性别男性</option>
            <option value="quener">酷儿</option>
        </select>
    </div>
    <script>
        const vm = new Vue({
            el: "#app",
            data: {
                sex: "nano",
            }
        });
    </script>

##### 多选选择框

    <p>多选框的值为:{{hobbly}}</p>
    <select style="width: 120px;text-align: center;height: 125px;" name="hobbly" id="" v-model="hobbly" multiple="multiple">
        <option value="吃饭">吃饭</option>
        <option value="睡觉">睡觉</option>
        <option value="篮球">篮球</option>
        <option value="画画">画画</option>
        <option value="其他">其他</option>
    </select>

    <script>
        const vm = new Vue({
            el: "#app",
            data: {
                sex: "nano",
                hobbly: [],
            }
        });
    </script>

##### v-model指令小结

    input输入框: 绑定字符串值
    textarea输入框: 绑定字符串值
    radio: 绑定字符串值
    checkbox: 单个绑定布尔值,多个绑定数组
    select: 单选绑定字符串,多选绑定数组值。

## 修饰符

    修饰符是以点开头的指令后缀,用于给当前指令设置特殊操作。

### 事件修饰符

#### .prevent修饰符

    用于阻止默认事件行为,相当于event.preventDefault()。
    <a @click.prevent="fun()">链接</a>

#### .stop修饰符

    用于阻止事件传播(事件冒泡),相当于event.stopPropagation()。
    <div @click="fn1">
        <a @click.prevent.stop="fun2"></a>
        <!-- Vue.js允许我们在同一指令设置多个修饰符 -->
    </div>

#### .once修饰符

    用于设置事件只触发一次
    <button @click.once="fn"></button>

### 按键修饰符

#### 按键码

    按键码指的是将按键的按键码,作为修饰符以标识按键的操作方式。

#### 内容按键

    <input @keyup.49="fn">
    数字按键,建议使用键码。
    字母按键可以使用别名。

#### 特殊功能按键

    特殊按键指的是键盘中类似的esc、enter、delete等功能按键,为了
    更好兼容性，应首选内置别名。
    <input @keyup.esc="fn">

    .enter
    .tab
    .delete
    .esc
    .space
    .up
    .down
    .left
    .right

#### 按键修饰符连写

    <input @keyup.a.b.c="fn">
    其中.a.b.c表示的是或者,三者其一触发条件。

### 系统修饰符

    系统按键指的是ctrl、alt、shift等按键
    单独点击系统操作符无效。
    系统按键通常与其他按键组合使用。
    <input type="text" @keyup.ctrl.c="fn">
    ctrl+c触发事件fn

### 鼠标修饰符

    用于设置点击事件由鼠标哪个按键来完成
    .left、.right、.middle 三个修饰符
    <button @click.right="fn"></button>

### v-model修饰符

#### .trim修饰符

    用于自动过滤用户输入内容首尾两端的空格
    text,textarea
    <input type="text" v-model.trim="inputValue">

#### .lazy修饰符

    用于将v-model的触发事件触发更改为change事件触发。
    将每次输入进行更新。更改为失去焦点后,进行数据更新
    <input type="text" v-model.lazy="fn">

#### .number修饰符

    用于自动将用户输入的值转换为数值类型,如无法被parseFloat()转换
    则返回原始内容。
    <input type="number" @keyup.+.-="keyFn" v-model.number="inputValue"  >

## 自定义指令

    指令用于简化DOM操作,相当于对基础DOM操作的一种封装。
    当我们希望使用一些内置指令不具备的DOM功能时,
    可以进行自定义指令设置。

### 自定义全局指令

    指的是可以被任意Vue实例或组件使用的指令

    通过Vue.directive 设置自定义全局指令
    Vue.directive('focus',{
        inserted: (el,binding)=>{
            // el表示指令插入的元素
            // inserted表示指令被插入时所执行的事件
            // binding表示的是指令的信息
            el.focus(); // 元素在加载完自定义指令后,自动获取焦点
        }
    });

    <input v-focus>

### 自定义局部指令

    指的是可以在当前Vue实例或组件内使用的指令。
    new Vue({
        directives: {
            focus: {
                inserted(el,binding) {
                    el.focus();
                }
            }
        }
    })

### 钩子函数

    一个指令定义对象可以提供如下几个钩子函数(均为可选)

    bind：只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。

    inserted：被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。

    update：所在组件的 VNode 更新时调用，但是可能发生在其子 VNode 更新之前。指令的值可能发生了改变，也可能没有。但是你可以通过比较更新前后的值来忽略不必要的模板更新 (详细的钩子函数参数见下)。

    componentUpdated：指令所在组件的 VNode 及其子 VNode 全部更新后调用。

    unbind：只调用一次，指令与元素解绑时调用。

## 过滤器

    过滤器用于进行文本内容格式化处理。
    过滤器可以在插值表达式和v-bind中使用。

### 全局过滤器

    全局过滤器可以在任意Vue实例使用
    Vue.filter('过滤器名称',function(value){
        return value+'处理结果';
    });

    过滤器能在插值表达式和v-bind中使用,通过管道符|连接数据。
    过滤器的返回值,就是最终要在内容中展示的处理结果
    <div v-bind:id="id | filterId"></div>
    <div>{{ content | filterContent }}</div>

#### 可以将一个数据传入到多个过滤器中进行处理

    <div>{{ content | filterA | filterB }}</div>

#### 过滤器多参数

    一个过滤器可以传入多个参数
    Vue.filter('过滤器名称',function(value,par1,par2){
        return value+'处理结果';
    });
    <div>{{ content | filterContent(par1,par2) }}</div>

    无论怎么传值,参数一始终是被添加过滤器的那个内容。

### 局部过滤器

    局部过滤器只能在当前Vue实例中使用。
    new Vue({
        filters: {
            过滤器名称: (value)=>{
                return value+'处理结果';
            }
            过滤器名称(value){
                return value+'处理结果';
            }
        }
    })

    如果全局过滤器与局部过滤器重名,则是局部过滤器失效。

## 计算属性

    Vue.js的视图不建议书写复杂逻辑,这样不利于维护。
    封装函数是个很好的解决方式,但有时重复的计算会消耗不必要的性能。
    如果,有多个重复的计算,这时候就到了应用计算属性的时候。

    计算属性使用时为属性形式,访问时会自动执行对应函数。
    new Vue({
        computed: {
            result() {
                return Math.max.apply(null,arr);
            }
        }
    })

    <p>{{ result }}</p>

    计算属性帮我们计算完毕后,会缓存起来。后面有用到的地方时不会再去重新计算。
    如果有中途值发生了改变,则会重新计算,然后再次缓存起来。

### methods与computed区别

    computed具有缓存型,methods没有。
    computed通过属性名访问,methods需要调用
    computed仅适用于计算操作。

    computed不能传参,methods能够传参。

### 计算属性的setter

    计算属性默认只有getter,Vue.js也允许给计算属性设置setter。
    new Vue({
        computed: {
            getResult: {
                get: ()=>{
                    return this.firstName + this.lastName;
                },
                // get() {},
                set: (newValue)=>{
                    let nameArr = newValue.split(' ');
                    this.firstName = nameArr[0];
                    this.lastName = nameArr[1];
                },
                // set() {}
                // vm.getResult = "";
                // 通过Vue实例.计算属性名 = 的方式对计算属性进行set
            }
        }
    })

## 侦听器

    监听器用于监听数据变化并执行指定操作
    new(Vue({
        watch: {
            value(newValue,oldValue) {
                // 逻辑代码
                // nweValue新值,oldValue旧值。
            }
        }
    }))
    value与data内数据同名。方法名与data数据变量名同名。
    // 只要被监听的值变了,就会执行侦听器内的操作。

### 侦听器与对象

    为了监听对象内部值的变化,需要将watch书写为对象,并设置
    选项deep: true,这时通过handler设置处理函数。
    new Vue({
        el: "#app",
        data: {
            obj: {
                content1: '内容1',
                content2: '内容2'
            }
        },
        watch: {
            obj: {
                deep: true, // 数组不需要进行deep设置
                handler(val,oldVal) {
                    console.log(val,oldVal);
                }
            }
        }
    })

    注意: 当更改(非替换)数组或对象时,回调函数中的新值与旧值相同,
    因为它们的引用都指向同一个对象、数组。

### 侦听器与数组

    watch: {
        arr(val,oldVal) {
            console.log('arr修改了',val,oldVal);
        }
    }
    通过length、与索引下标修改数组的数据不会触发侦听器。
    推荐使用Vue.set方法。或者是js自带的Array方法。

## Vue DevTools

    是Vue.js官方提供用来调试Vue应用的工具。

    注意事项:
     网页必须应用了Vue.js功能才能看到Vue DevTools
     网页必须使用Vue.js而不是Vue.min.js
     网页必须是http协议打开,而不是file打开

## Vue.js生命周期

    Vue.js声明周期,指的就是Vue实例的生命周期。
    Vue实例的生命周期,指的是实例从创建到运行,再到销毁的过程。
    https://cn.vuejs.org/v2/guide/instance.html#%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E5%9B%BE%E7%A4%BA

    new 创建阶段 挂载阶段 更新阶段 销毁阶段

### 生命周期函数

    通过设置声明周期函数,可以在生命周期的特定阶段
    执行功能。
    声明周期函数,也称为生命周期钩子

    创建阶段:
        beforeCreate: 实例初始化之前调用。
        created: 实例创建后调用。
        beforeMount: 实例挂载之前调用
        mounted: 实例挂载完毕
    特点: 每个实例只能执行一次

    运行阶段:
        beforeUpdate: 数据更新后,视图更新前调用。
        updated: 视图更新后调用
    特点: 按需调用

    销毁阶段:
        beforeDestroy: 实例销毁之前调用
        destroyed: 实例销毁后调用。

## TdoMVC

    TodoMVC是一个经典项目,让开发者快速实践到框架开发方式。
    功能完备不冗余,多样实现引深思。

## 事项数据持久化

    获取本地存储
    更新本地存储

### 获取本地存储数据

    浏览器本地存储,localStorage内有两个方法分别为,getItem,setItem
    以下为设置缓存的封装的方法
    const TODOS_KEY = 'todus-vue';
    let todoStorage = {
        get () {
            return JSON.parse(localStorage.getItem(TODOS_KEY)) || [];
        },
    	set(todos) {
    		localStorage.setItem(TODOS_KEY,JSON.stringify(todos));
    	}
    };

    搭配Vue监听器,进行数据的监听,发生变化就更新到本地存储:
    watch: {
        todos: {
            deep: true,
            handler: todoStorage.set
            // handler内监听的数据,第一参数,数据会自动传参给.set。
        }
    }

# Vue.js组件

## 概述

    组件用于封装页面的部分功能,将功能的结构,样式、逻辑代码封装为整体。
    提高功能的复用性与可维护性,更好的专注于业务逻辑。

    组件使用时为自定义的HTML标签形式,通过组件名作为自定义标签名。

## 组件注册

### 全局注册

    全局注册的组件在注册后,可以用于任意实例或组件中。
    Vue.component('组件名',{/*选项对象*/});
    注意: 全局注册必须设置在根Vue实例创建之前。
    Vue.component("my-component",{
        template: "<div>这是我们全局注册的组件</div>"
    });

### 组件基础

    本质上,组件是可服用的Vue实例。所以它们可与new Vue接收相同的选项.
    例如data、methods以及生命周期钩子等。
    仅有的例外是像el这样的根实例特有的选项。

#### 组件命名规则

    组件具有两种命名规则:
    kebab-case: "my-component"
    PascalCase: "MyComponment"

    Vue.componment('my-component',{});
    Vue.componment('MyComponent',{});

    无论采用哪种命名规则,在DOM中只有kebab-case可以使用。

#### template选项

    template用于设置组件的结构.最终被引入根实例,或其他组件中。
    Vue.compoonment('my-component',{
        template: `<div>组件A</div>`
    })

#### data选项

    data选项用于存储组件的数据,与根实例不同,组件的data选项必须为函数。
    数据设置在返回值对象中。
    Vue.component('my-component',{
        template:`
        <div>
            <h1>{{title}}</h1>
        </div>
        `,
        data: () {
            return {
                title: "这是标题内容"
            }
        }
        // 这种实现方式是为了确保每个组件实例可以维护一份返回对象的
        // 独立拷贝,不会互相影响。
    });

### 局部注册

    局部注册的组件只能用在当前实例或组件中。
    new Vue({
        components: {
            'my-component-a': {
                template: '<h3>{{ title }}</h3>',
                data() {
                    return {title: 'a 组件实例内容'}
                }
            },
            'my-component-b': {
                template: '<h3>{{ title }}</h3>',
                data() {
                    return {title: 'b 组件实例内容'}
                }
            }
        }
    })

#### 单独配置组件的选项对象

    let MyComponentA = {/**/};
    let MyComponentB = {/**/};
    const ap = new Vue({
        components: {
            'my-component-a': MyComponentA,
            'my-component-b': MyComponentB
            // 也可以使用ES6解构语法像下面这样写
            // MyComponentA,
            // MyComponentB
            // 上面那种ES6语法没有第一种兼容性好
        }
    });

## 组件通信

    在组件间传递数据的操作,成为组件通信。

### 父组件向子组件传值

    通过子组件的props选项接收父组件的传值。
    Vue.component('my-component-a',{
        props: ['title'],
        template: '<h1>{{ title }}</h1>'
    })
    注意: props不要与data存在同名属性。

    父组件设置方式:
    <my-component-a title="示例内容1"></my-component-a>
    <my-component-a :title="示例内容2"></my-component-a>
    <my-component-a :title="item.title"></my-component-a>

    new Vue({
        el: "#app",
        data: {
            item: {
                title: '父组件中的数据'
            }
        }
    })

#### props命名规则

    建议prop命名使用camelCase(驼峰命名法),父组件绑定时使用kebab-case
    Vue.component('my-component',{
        props: ['myTitle'],
        template: "<h3>{{ myTitle }}</h3>"
    });

    <my-component-a :my-title="item.title"></my-component-a>

#### 单向数据流

    父子组件间的所有prop都是单向下行绑定的。
    prop是子组件设置的,接受父组件传输的数据。
    子组件内部的prop不能反向的影响父组件
    prop内的数据是只读的不可操作。

#### 操作prop数据

    如果子组件要处理prop数据,应当存储在data或computed中后操作.
    Vue.component('XhItems',{
        props: ['itemTitle','itemContent'],
        template: `
            <div>
                <h1>{{title}}</h1>
                <p>{{content}}</p>
            </div>
        `,
        // data() {
        //     return {
        //         title: this.itemTitle,
        //         content: this.itemContent
        //     }
        // },
        computed: {
            title() {
                return this.itemTitle;
            },
            content() {
                return this.itemContent;
            }
        }
    });

##### 总结

    // 总结:
    // 通过computed处理的值,父组件值更新后,computed会重新更新一遍。
    // 通过data处理的值,父组件数据更新后,不会更新到子组件。
    // 但是通过data处理的,能够进行双向数据绑定。
    // computed虽然也能实现双向数据绑定。但是,set方法计算属性会影响到props内的属性值。
    // 会导致Vue在控制台报错。

    // 总结2:
    // 如果父组件传入对象到子组件内。由子组件操作对象进行成员进行赋值。
    // 因为对象是引用数据类型,直接将整个数据类型传入子组件.子组件更新数据后
    // 这个影响会传入父组件,会造成父组件的数据更改。
    // 所以,建议将对象中的成员,传入子组件内。而不是整个对象传入子组件,在子组件内操作。

#### props类型

    props接收的属性,默认是不受限制的。

##### prop类型限制

    prop可以设置类型检查,这时需要将props更改为一个带有验证需求的对象,
    并指定对应类型。

    Vue.component('MyComponentA',{
        props: {
            parStr: String,
            parArr: Array,
            parAny: null // 值为任意类型
        }
    });

    prop还可以同时指定多个类型,通过数组方式保存即可。
    Vue.component('MyComponentA',{
        props: {
            parData: [String,Number]
        }
    });

#### props多规则

    当prop需要设置多种规则时,可以将prop的值设置为选项对象。
    Vue.component('MyconponentA',{
        props: {
            parNum: {
                type: Number
            },
            parData: {
                type: [String,Boolean]
            }
        }
    });

##### required非空

    required用于用于设置数据为必填项
    Vue.component('MyComponentA',{
        props: {
            parNum: {
                type: Number,
                // 设置此选项为必填项
                required: true
            }
        }
    });

##### default默认值

    default用于给选项指定默认值,当父组件未传递数据时生效.
    default与required两个规则是相冲突的。
    Vue.component('MyComponentA',{
        props: {
            parNum: {
                type: Number,
                // 设置属性默认值为100
                default: 100
            }
        }
    });

    注意点:
    当默认值为数组或对象时(引用类型),必须为工厂函数返回的形式.
    Vue.component('MyComponent',{
        props: {
            parArr: {
                type: Array,
                default: ()=>{
                    return: [1,2,3];
                }
            },
            parObj: {
                type: Object,
                default: ()=>{
                    return: {c: "123"};
                }
            }
        }
    });

##### validator自定义效验规则

    validator用于给传入prop的设置校验函数,return值为false时
    Vue.js会发出警告

    Vue.component("MyComponent",{
        props: {
            parStr: {
                type: String,
                validator: function(value) {
                    // 传入值的开头为lagou返回真
                    return value.startsWith('lagou');
                }
            }
        }
    });
    // 注意点
    // validator(){}是在实例创建之前进行效验验证的。
    // 所以它不能对data进行验证

#### 非props属性

    当父组件给子组件设置了属性,但此属性在props中不存在,这时会自动绑定到子组件的根元素上。
    <my-component-a>
    </my-component-a>

    如果组件根元素已经存在了对应属性，则会替换组件内部的值。
    class与style是个例外,当内外都设置时,属性会自动合并。

#### inheritAttrs

    如果不希望继承父组件设置的属性,可以设置inheritAttrs:false,
    仅适用于普通属性,class与style不受影响。
    Vue.component('MyComponent',{
        inheritAttrs:false,
        template: ``
    });

### 子组件向父组件传值

    子组件向父组件传值需要通过自定义事件实现。

    案例:
        商品为子组件,购物车为父组件,父组件需要统计商品个数,
        就需要在子组件个数变化时传值给父组件。
    new Vue({
        el: "#app",
        data: {
            products: [
                {id: 1,title: '苹果'},
                {id: 2,title: '西瓜'},
                {id: 3title: '香蕉'},
            ],
            totalCount: 0
        }
    });

#### $emit()触发子组件自定义事件

    子组件数据发生变化时,通过$emit()触发自定义事件。
    Vue.component(
    methods: {
        countIns() {
            this.$emit('count-change');
            this.count++;
        }
    }

    父组件监听子组件的自定义事件,并设置处理程序.
    <component-item @count-change="totalCount++">
    </component>

#### 自定义事件传值

    Vue.component("ShopItme",{
        methods: {
        countAdd(Number){
            this.$emit('count-change',Number);// 第二个事件为事件对象值。event
            // 自定义事件也可以不为对象，为其他的值。
            this.count+=Number;
        }
    },

    父组件在监听事件时需要接收子组件传递的数据(通过event来接收)
    <shop-itme  @count-change="shopCount+=$event">

#### 子组件与v-model

    v-model用于组件时,需要通过props与自定义事件实现。

    <xue-hua v-model="x.value" v-for="x in xh" :type="x.type"></xue-hua>
    Vue.component('XueHua',{
        props: ["Type","value"],
        template: `
            <div>
                <span>{{Type}}</span>
                <input @input="$emit('input',$event.target.value)" :value="value" type="text">
            </div>
        `
    });

    封装到方法内的写法
    <xue-hua v-model="x.value" v-for="x in xh" :type="x.type"></xue-hua>

    Vue.component('XueHua',{
        props: ["Type","value"],
        template: `
            <div>
                <span>{{Type}}</span>
                <input @input="onInput($event)" :value="value" type="text">
            </div>
        `,
        methods: {
            onInput(event) {
                this.$emit('input',event.target.value);
            }
        }
    });

### 非父子组件传值

    非父子组件指的是兄弟组件或完全无关的两个组件。

#### 兄弟组件传值

    兄弟组件可以通过父组件进行数据中转
    <div id="app">
        <!-- 根实例接收子组件A的数据,fvalue(根实例的数据) = $event(内部b通过$emit传出来的数据) -->
        <com-a @value-change="fvalue = $event"></com-a>
        <!-- 根实例将接收B组件数据,fvalue的数据传递给子组件B. -->
        <com-b :value="fvalue"></com-b>
    </div>
    <script src="../node_modules/vue/dist/vue.js"></script>
    <script>
        Vue.component("ComA",{
            template: `
                <div>
                    组件A的内容: {{zvalue}}
                    <button @click="send()">发送</button>
                </div>
            `,
            data() {
                return {zvalue: "组件A的内容"}
            },
            methods: {
                // 通过$emit方法,将组件内的zvalue发送给value-change事件的$event
                send() {
                    this.$emit('value-change',this.zvalue);
                }
            }
        });
        Vue.component("ComB",{
            // 通过props接收自定义属性value内的值。(来源于被A组件赋值的根实例)
            props: ["value"],
            template: `
                <div>组件B接收到: {{value}}</div>
            `,
        });
        const ap = new Vue({
            el: "#app",
            data: {
                // 用于数据中转
                fvalue: ""
            }
        });
    </script>

#### EventBus(其他组件传值)

    当组件嵌套关系复杂时,根据组件关系传值会较为繁琐。
    组件为了数据中专,data中会存在许多与当前组件无关的数据。
    EventBus(事件总线)是一个独立的事件中心,用于管理不同组件的传值操作。

    EventBus通过一个新的Vue实例来管理组件传值操作,组件通过实例助注册事件，调用事件
    来实现数据传递。

    // EventBus.js
    let bus = new Vue;

##### 传递组件值的方法

    发送数据的组件触发bus事件,接收的组件给bus注册对应事件。
    给bus注册对应事件通过$on()操作。
    bus.$on('countChange',(productCount)=>{
        this.totalCount += productCount;
    });

###### 代码案例

    <div id="app">
        <shoping></shoping>
        <count-shop></count-shop>
    </div>
    <script src="../node_modules/vue/dist/vue.js"></script>
    <script>
        Vue.component("shoping",{
            data() {
                return {
                    shSum: 0
                }
            },
            template: `
                <div>
                    <p>商品名称: 苹果，商品个数: {{shSum}}</p>
                    <button @click="shop(1)">+1</button>
                    <button @click="shop(5)">+5</button>
                </div>
            `,
            methods: {
                shop(num){
                    // 通过$emit触发事件,把num当做event传递出去
                    bus.$emit("busNum",num);
                    this.shSum += num;
                }
            }
        })
        Vue.component("countShop",{
            data() {
                return {
                    countShop: 0
                }
            },
            template: `
                <p>商品总个数为: {{countShop}}</p>
            `,
            // 给bus注册事件,需要等bus实例先被创建出来。
            created() {
                // 给bus的事件添加方法。并接收数据
                bus.$on("busNum",(event)=>{
                    // 实例创建完毕可以使用data等功能。
                    this.countShop += event;
                });
            }
        });
        let bus = new Vue({});
        const ap = new Vue({
            el: "#app",
            data: {

            }
        });
    </script>

### 其他通信方式

    这些方式都时可以直接访问到其他组件,对其他组件直接处理。
    这些方式,没有特殊需求不建议使用。

#### $root

    $root用于访问当前组件树的根实例,设置简单的Vue应用时可以
    通过此方式进行组件传值。
    this.$root.data成员 += xx;

#### $parent

    用于访问父组件内的数据。
    this.$parent

#### $children

    用于访问子组件内的数据。
    this.$children

#### $refs

    $refs用于获取设置了ref属性的HTML标签或子组件。
    给普通HTML标签设置ref属性,$refs可以获取DOM对象。
    给子组件设置ref属性,渲染后通过$refs获取子组件实例。
    <com-a ref="comA">
    mounted() {
        this.$refs.comA.value = "修改子组件数据";
    }

#### mounted和created区别

    created创建完vue实例后,但是还没有渲染视图加载到html上。
    mounted是创建完Vue实例,并且在html上面也挂载完毕。

## 组件插槽

    组件插槽可以便捷设置组件内容
    <div id="#app">
        <com-a>
            示例内容
            <span>组件的主体内容</span>
        </com-a>
    </div>

### 单个插槽

    如果希望组件标签可以像HTML标签一样设置内容。
    那么组件的使用灵活度会很高。
    但平常我们书写的组件,组件首尾标签的内容会被抛弃。

#### 插槽使用

    我们需要通过<slot>进行插槽设置。
    Vue.component("ComA",{
        template: `
            <div>
                <h3>组件标题</h3>
                <slot>主体内容</slot>
            </div>
        `
    })
    <com-a>
        这是第二个组件的内容,
        <span></span>
    </com-a>

#### 注意渲染位置

    需要这主意模板内容的渲染位置:
    <com-a>
        这里只能访问父组件的数据
        {{ parValue }}
    </com-a>
    父级模板的内容都只能作用在父级。
    处于父组件结构中,只能用父组件的数据。

#### 插槽默认值

    我们可以在<slot>中为插槽设置默认值,也称为后备内容。
    Vue.component("ComA",{
        template: `
            <slot>这是默认文本</slot>
        `
    })

### 具名插槽

    如果组件中有多个位置需要设置插槽,据需要给<slot>设置
    name,成为具名插槽。
    组件模板设置
    `
        <div>
            <header>
                <slot name="header"></slot>
            </header>
            <main>
                <slot></slot>
                <!-- 未设置name值,默认为default -->
            </main>
            <footer>
                <slot name="footer"></slot>
            </footer>
        </div>
    `
    组件书写在父组件内的设置
    <com-a>
        <template v-slot:header>
            <h1>组件头部内容</h1>
        </template>
        <template v-slot:defalut>
            <h1>组件主体内容</h1>
        </template>
        <template v-slot:footer>
            <h1>组件底部内容</h1>
        </template>
    </com-a>

    <!-- 只有在template内才能使用 v-slot -->

#### v-slot简写

    v-slot可以简写成#
    <template #header></template>

### 作用域插槽

    让插槽可以使用子组件的数据
    组件将需要被插槽使用的数据通过v-bind绑定给<slot>,
    这种用于给插槽传递数据的属性成为prop。
    示例:
    Vue.component("ComA",{
        template: `
            <div>
                <p>组件A</p>
                <slot :value="value"></slot>
            </div>
        `,
        data() {
            return {
                value: "子组件数据"
            }
        }
    });

    组件绑定数据后,插槽中需要通过v-slot接收数据。
    <com-a>
        <template v-slot:default="dataObj">
            {{dataObj.value}}
        </template>
    </com-a>

    可以使用ES6的结构操作进行数据接收:
    <com-a v-slot:default="{value}">
        {{ value }}
    </com-a>

## 内置组件

### 动态组件

    动态组件适用于多个组件频繁切换的处理。
    <component>用于将一个'元组件'渲染为动态组件。
    以is属性值决定渲染哪个组件。
    <component :is="'ComA'"></component>

    用于实现多个组件的快速切换,例如选项卡的效果。
    组件切换时，会将当前组件销毁,然后切换到下一个组件。
    所以,当前组件状态是不会保留的。

### keep-alive组件

    主要用于保留组件状态,或避免组件重新渲染。
    <keep-alive>
        <component :is="currentComA">
        </component>
    <keep-alive>

#### include属性

    include属性用于指定哪些组件会被缓存,具体多种设置方式。
    <keep-alive include="ComA,ComB,ComC">
        <component is:"currnetCom"></component>
    </keep-alive>

    另外两种形式include属性书写方式
    动态绑定数据数组形式:
    <keep-alive :include="['ComA','ComB']">
    正则表达式形式:
    <keep-alive :include="/^Com[ABC]$/">

#### exclude属性

    exclude属性用于指定哪些组件不会被缓存。
    <keep-alive exclude="ComD">
        <component></component>
    </keep-alive>

    另外两种形式exclude属性书写方式
    动态绑定数据数组形式:
    <keep-alive :exclude="['ComD']">
    正则表达式形式:
    <keep-alive :exclude="/^Com[D]$/">

#### max属性

    max属性用于设置最大缓存个数。
    <keep-alive max="2"></keep-alive>

### 过渡组件

    用于在Vue插入,更新或者移除DOM时,提供多种不同方式的
    应用过渡、动画效果。

#### transition组件

    用于给元素和组件添加进入/离开过渡
    条件渲染(使用v-if)
    条件展示(使用v-show)
    动态组件
    组件根节点

    组件提供了6个class，用于设置过渡的具体效果。
    进入的类名:
    v-enter  动画开始
    v-enter-to  动画结束
    v-enter-active  元素入场过渡

    离开的类名:
    v-leave 准备离开
    v-leave-to  离开之后
    v-leave-active  过渡时间

    一般设置v-enter,v-leave-to
    <style>
        .v-enter {
            opacity: 0;
        }
        .v-enter-to {
            opacity: 100;
        }
        .v-leave-to {
            opacity: 0;
        }
        .v-enter-active {
            transition: 1000ms;
            display: none;
        }
        .v-leave-active {
            transition: 1000ms;
        }
    </style>

##### transiton组件的相关属性

    给组件设置name属性，用于给多个元素，组件设置不同的过渡效果。
    这时需要将v-更改为对应name-的形式。
    例如:
    <transition name="demo">的对应类名前缀为:
    设置了name的transition组件,类名需要将V-修改为demo-

    通过appear属性，可以让组件在初始渲染时实现过渡
    <transition appear>

#### 自定义过渡类名

    自定义类名比普通类名优先级更高。
    在使用第三方CSS动画库时非常有用。

    用于设置自定义过渡类名的属性如下:
    enter-class
    enter-active-class
    enter-to-class
    leave-class
    leave-active-class
    leave-to-class

    用于设置初始过渡类名的属性如下:
    appear-class
    appear-to-class
    appear-active-class

    <transiton enter-active-class="test">

    https://animate.style/

    一般使用动画库时只能够用到两种属性:
    入场动画: enter-active-class
    离场动画: leave-active-class

##### 使用动画库案例

    <div id="app">
        <transition leave-active-class="animate__backOutUp" enter-active-class="animate__fadeInLeft">
            <h1 v-show="show" class="animate__animated">An animated element</h1>
        </transition>
        <button @click="show = !show">切换</button>
    </div>

    <script src="../node_modules/vue/dist/vue.js"></script>
    <script>
        const ap = new Vue({
            el: "#app",
            data: {
                show: true
            }
        });
    </script>

##### 动态组件使用案例

    <div id="app">

        <keep-alive :include="/^Com[AB]$/">
            <transition name="xh"  appear enter-active-class="animate__fadeInLeft">
                <component class="animate__animated" :is="current"></component>
            </transition>
        </keep-alive>

            <button v-for="btn in btnTitle" :key="btn.title" @click="currentCom(btn.title)">{{btn.name}}</button>

    </div>
    <script src="../node_modules/vue/dist/vue.js"></script>
    <script>
        Vue.component("ComA",{
            template: `
                <div>
                    组件A
                    <input type="text" v-model="vac">
                </div>
            `,
            data() {
                return {
                    vac: ""
                }
            }
        });
        Vue.component("ComB",{
            template: `
                <div>
                    组件B
                    <input type="text" v-model="vac">
                </div>
            `,
            data() {
                return {
                    vac: ""
                }
            }
        });
        Vue.component("ComC",{
            template: `
                <div>
                    组件C
                    <input type="text" v-model="vac">
                </div>
            `,
            data() {
                return {
                    vac: ""
                }
            }
        });
        const ap = new Vue({
            el: "#app",
            data: {
                btnTitle: [
                    {name: "组件A",title: "ComA"},
                    {name: "组件B",title: "ComB"},
                    {name: "组件C",title: "ComC"}
                ],
                current: "ComB"
            },
            methods: {
                currentCom(value) {
                    this.current = value;
                }
            }
        });
    </script>

#### transition-group组件

    <transition-group> 用于给列表统一设置过渡动画。
     tag属性用于设置容器元素,默认为<span>
     过渡会应用于内部元素,而不是容器
     子节点必须有独立的key,动画才能正常工作。

     <transition-group tag="ul">
     </transition-group>

     当列表元素变更导致元素位移,可以通过.v-move类名设置移动时的效果。
     .v-move {
         transition: all 500ms
     }
     让元素在离场过程中脱离标准流:
     v-leave-active {
         position: absolute;
     }

# VueRouter

## 概述

    Vue Router是Vue.js的官方插件,用来快速实现单页应用。

## 什么是单页应用

    SPA 单页面应用程序,简称单页应用。
    指的是,网站的“所有”功能都在单页页面中进行呈现。
    具有代表性的有后台管理系统、移动端、小程序等。

    优点:
        前后端分离开发,提高了开发效率
        业务场景切换时,局部更新结构
        用于体验好,更加接近本地应用

    缺点:
        不利于SEO
        初次首屏加载速度较慢
        页面复杂度比较高

## 前端路由

    前端路由,指的是URL与内容间的映射关系。
    URL、内容、映射关系

### Hash方式

    通过hashchange事件监听hash变化，并进行网页内容更新。
    window.onhashchange = function(){
        let hash = location.hash.replace("#",'');
        let str = "";
        switch(hash) {
            case "/":
                str = "这是首页功能";
                break;
            case "/category":
                str = "这是分页功能";
                break;
            case "/user":
                str = "这是用户功能";
                break;
        }
        document.getElementById('container').innerHTML = str;
    };

#### 封装hash Router

    let router = {
        routes: {},
        route(path,callback) {
            this.routes[path] = callback;
        },
        init() {
            window.onhashchange = ()=> {
                let hash = location.hash.replace('#','');
                this.routes[hash] && this.routes[hash]();
            };
        }
    };

#### 特点总结

    hash方式兼容性好
    地址中有#，不太美观。
    前进后退功能较为繁琐。

### History方式

    History方式采用HTML5提供的新功能实现前端路由。
    在操作时需要通过history.pushState()变更URL并执行对应操作。
    let router = {
        routes: {},
        route(path,callback) {
            this.routes[path] = callback;
        },
        go(path) {
            history.pushState({path: path},null,path);
            this.routes && this.routes[path]();
        },
        init() {
            window.addEventListener('popstate',(e)=>{
                // popstate时进行前进后退的popstate监听
                // 如果通过浏览器前进后退就执行以下代码
                // 如果e.state通过前进后退跳转为真,就返回地址。为假返回主页。
                let path = e.state ? e.state.path: '/';
                this.routes[path] && this.routes[path]();
            });
        }
    };

#### 总结

    书写简单,兼容性差,刷新会导致404,需要后端程序员配合开发。

## Vue Router概述

    是Vue.js官方的路由管理器,让构建单页面应用变得易如反掌。

## 基本使用

### 安装

    直接下载/CDN
    npm install vue-router

### router-link与router-view

    VueRouter提供了用于进行路由设置的组件<router-link>
    与<router-view>。
    <router-link>默认是A标签，如果希望它在操作中是其他标签。
    可以通过tag来设置。

    <div id="#app">
        <router-link to="/">首页</router-link>
        <router-link to="/category">分类</router-link>
        <router-link to="/user">用户</router-link>
        <router-view></router-view>
    </div>
    router-view是用来显示路由匹配的组件的。

    定义路由中需要的组件,并进行路由规则设置:
    let Index = {
        template: `<div>这是首页的功能</div>`
    };

    路由规则(url对应组件):
    let routers = [
        {path: "/",component: Index},
        {path: "/category",component: Category}
    ];

    创建Vue Router实例,通过routes属性配置路由
    let router = new VueRouter({
        routes: routes;// 可以将规则直接书写在,routes内。
    });

    创建Vue实例,通过router属性注入路由。
    let vm = new Vue({
        el: "#app",
        router: router
    });

#### 代码案例

    <div id="app">
        <!-- 设置用于进行路由操作的组件 -->
        <router-link to="/">首页</router-link>
        <router-link to="/user">首页</router-link>
        <router-view></router-view>
        <h1>Hello,Word</h1>
    </div>
    <script src="../node_modules/vue/dist/vue.js"></script>
    <script src="../node_modules/vue-router/dist/vue-router.js"></script>
    <script>
        // 首页组件
        let Index = {
            template: `
                <h2>首页</h2>
            `
        };
        // 用户组件
        let User = {
            template: `
                <h2>用户</h2>
            `
        };
        // 设置router规则
        let routes = [
            {path: "/",component: Index},
            {path: "/user",component: User}
        ];
        // 创建VueRouter实例
        let router = new VueRouter({
            routes
        });
        // 创建Vue实例,并注入router
        const ap = new Vue({
            el: "#app",
            router
        });
    </script>

### 命名视图

    如果导航后,希望同时在同级展示多个视图,这时就需要进行视图命名。
    <div id="#app">
        <router-link to="/">首页</router-link>
        <router-link to="/user">用户</router-link>
        <router-view name="sidebar"></router-view>
        <router-view></router-view>
    </div>

    路由中通过components属性进行设置不同的对应组件。
    let SideBar = {
        template: `<div>这时侧边栏功能</div>`
    };

    let routes = [
        {
            // 指定路径为/的规则
            path: "/",
            components: {
                // router-view的name为sidebar的指定组件为Sidebar
                sidebar: SideBar,
                // 默认router-view/无name指定组件为Index
                default: Index
            }
        }
    ];

#### 代码案例

    // 设置router规则
    let routes = [
        {path: "/",components: {
            // 默认router-view的在"/"url路径下组件设置
            default: Index,
            // 名称为xhSide的router-view在"/"url的路劲下的组件设置
            xhSide: side
        }},
        {path: "/user",component: User}
    ];

## 动态路由

    当我们需要将某一类URL都映射到同一个组件,
    就需要使用动态路由。
    定义路由规则时将路径中的某个部分使用“：”进行标记,
    即可设置为动态路由。
    let routes = [
        {path: "/user/:id",components:
        {
            default: User
        }}
    ];

    设置为动态路由后,动态部分为任意内容均跳转到同一组件。
    <div id="app">
        <router-link to="/user/1">用户1</router-link>
        <router-link to="/user/2">用户2</router-link>
        <router-link to="/user/3">用户3</router-link>
    </div>

    :部分对应的信息称为路径参数,存储在组件内的$route.params中。
    let user = {
        template: `
            <h1>您好,用户{{user_id}}</h1>
        `,
        computed: {
            user_id() {
                if(this.$route.params.id=="1") {
                    return "一"
                }
            }
        }
    }

### 侦听路由参数

    如果要响应路由的参数变化,可以通过
    watch监听$route。
    let user = {
        template: `
            <div>{{$route.params.id}}</div>
        `,
        watch: {
            $route(route) {
                console.log(route);
            }
        }
    };

### 路由传参处理

    通过路由的props设置数据,并通过组件props接收。
    路由设置:
    let routes = [
        {
            path: '/user/:id',
            components: {
                default: User
            }
        },
        {
            path: '/category/:id',
            component: Category,
            props: true
        }
    ];

    组件设置:
    let User = {
        template: `<div>这是{{$route.params.id}}的功能</div>`
    };
    let Category = {
        props: ['id'],
        template: `<div>这是{{id}}功能</div>`
    };

#### 路由传参处理其他方式

    包含多个命名视图时,需要将路由的props设置为对象。
    let routes = [
        {
            path: '/user/:id',
            components: {
                default: User,
                sidebar: Side
            },
            props: {
                default: true,
                sidebar: false
            }
        }
    ];

    如果希望设置静态数据,可将props中的某个组件对应的选项，
    设置为对象，内部属性会绑定给组件的props。
    let SideBar2 = {
        props: ['a','b'],
        template: `
            <div>
                这是右侧边栏功能{{a}} {{b}}
            </div>
        `
    };
    路由设置:
    let routes = [{
        path: '/category/:id',
        components: {
            default: Catgory,
            sidebar: SideBar,
            sidebar2: SideBar2
        },
        props: {
            default: true,
            sidebar: false,
            // 自定义sidebar2静态数据,将数据传递出去。
            sidebar2: {
                a: '状态一',
                b: '状态2'
            }
        }
    }];

## 嵌套路由

    实际场景中,路由经常由多层嵌套的组件组合而成。这时需要使用嵌套路由的配置。
    使用children来进行嵌套路由中的子路由设置。
    路由设置:
    let routes = [
        {
            path: '/user',
            components: {
                default: User
            },
            children: [
                {
                    path: 'hobby',
                    components: {
                        default: UserHobby
                    }
                }
            ]
        }
    ];
    组件设置
    let User = {
        template: `
            <div>
                <h3>这是User组件的功能</h3>
                <router-link to="/user/hobby">爱好功能</router-link>
                <router-view></router-view>
            </div>
        `
    };

## 编程式导航

    编程式导航,指的是通过方法设置导航。
    可以通过,router.push()用来导航到一个新的URL.
    vm.$router.push('/user');
    vm.$router.push({path: '/user'});

    <router-link>的to属性使用绑定方式时,也可属性对象结构。
    <router-link :to="{path: ''}">

### 命名路由

    设置路由时添加name属性。
    let School = {
        template: `<div>School组件: {{$route.params}}</div>`,
    };
    let routes = [
        {
            path: '/user/:id/info/school',
            name: 'school',
            component: School
        }
    ];
    在push()中通过name导航到对应路由。参数通过params设置。
    vm.$router.push({name: 'school',params: {id: 20,demo: '其他数据'}});

    也可以在<router-link>中使用命名路由
    <router-link :to="{name: 'school',params: {id: 2}}">用户学校</router-link>

### 重定向

    当我们访问到错误url时,可以通过redirect属性来重定向URl
    let routes = [
        {path: '/user/:id',
        component: User},
        {path: '/user',
        redirect: '/'
        }
    ];

### 别名

    别名是一种美化路由的方式。可以缩短url长度
    可以通过alias属性来进行设置
    let routes = [
        {
            path: '/user/:id/info/school/:date',
            name: 'school',
            components: {
                default: School
            },
            alias: '/:id/:date'
        }
    ];

    router-link书写方式:
    <router-link :to="{name: school,params: {
        id: 1,date: 0101
    }}">
    <router-link to="/10/0612">

### 导航守卫

    设置导航守卫后,每个路由在触发url之前都会执行导航守卫功能。
    router.beforeEach((to,from,next)=>{
        if(to.path === '/user') {
            // 如果用户想跳转到用户,直接让她跳转到登录
            next('/onload');
        } else {
            next();
        }
    });
    // to表示跳转到的路由相关信息
    // from表示从哪个路由跳转来的
    // 根据from和to判断,来判断是否符合条件。
    // 可以在next中传入false,可以阻止用户下一步访问。

### History模式

    需要通过Vue Router实例的mode选项来设置,
    这样URL会更加美观。但同样需要后端支持避免问题。
    let router = new VueRouter({
        mode: 'history',
        routes
    });

### 路由元信息

    首先需要在路由规则中设置meta验证
    meta: {
      // 需要进行认证
      requiresAuth: true
    },
    路由守卫部分代码实例:
    // 路由守卫,身份验证
    router.beforeEach((to, from, next) => {
    // 验证to路由,是否需要身份认证
    if (to.matched.some(record => record.meta.requiresAuth)) {
        // 验证Vuex的store中的登录用户信息是否存储
        if (!store.state.user.data.success) {
        // 未登录，跳转到登录页
        return next({
            name: 'login',
            query: {
            // 将本次路由的fullpath传递给loagin
            redirect: to.fullPath
            }
        })
        }
        // 能查找到就登录
        next()
    } else {
        console.log('当前页面不需要认证')
        next()
    }
    })

    query内部记录的状态值在其他VUE实例中获取的方法:
    // 根据用户开始访问,可能存储的 redirect 数据进行跳转设置
    this.$router.push(this.$route.query.redirect || '/home')

# Vue CLI

## Vue CLI介绍

    Vue CLI是一个基于Vue.js进行快速开发的完整系统。
    称为脚手架工具。
    统一项目架构风格
    初始化配置项目依赖
    提供单文件组件

    操作方式: 命令行工具

## 安装

    安装: npm install -g @vue/cli
    查看CLI版本: vue --version
    升级: npm update @vue/cli -g

## 项目搭建

    创建项目:
    vue create project-demo

    选择Preset:

    选择包管理器:
    use NPM/use Yarn

    创建完成后,npm run serve进行运行项目

## 目录与文件

    文件目录介绍:
        public 预览文件目录
        src
            assets 静态资源目录
            components  项目组件目录
            App.vue  根组件
            main.js  入口文件

    单文件组件,可以将组件的功能统一保存在以.vue为拓展名的文件中。
    <template></template>对应了组件的结构,模板
    <script>内负责逻辑代码打包书写,以及模块的规则、逻辑功能功能导出。
        exprot default {
            name: 'HelloWorld',
            props: {
                msg: String
            }
        }
    <style>负责模块样式设置。
    <stlye scoped>标签scoped表示,样式只能被当前组件所引用。

    App.vue根组件内,通过improt 来引入其他组件。

## 打包与部署

    打包就是将VueCLI项目编译为浏览器可识别的文件。
    命令: npm run build

    部署指的是将Vue项目dist目录部署到服务器上
    serve命令进行布著

# VueX

## 概述

    Vuex是一个专门为Vue.js应用程序开发的状态管理工具。
    它采用集中存储管理应用的所有组件的状态。并以相应的
    规则保证状态以一种可预测的方式发生变化。

## Vuex-State

    state用于存储数据.
    在Vue单页面程序中,所有组件都可以通过$store.state.成员，对state
    内部的数据进行访问。

## Vue-Mutation

    更改Vuex的store中的状态的唯一方法是一觉mutation。
    Vuex中的mutation非常类似于事件,每个mutation都有
    一个字符串的事件类型和一个回调函数。
    这个回调函数就是我们实际进行状态更改的地方，
    并且它会接受state作为第一个参数。

    设置mutations:
        mutations: {
            increment (state) {
                state.count++
            }
        }
    使用mutations
    $store.commit('increment')

    mutation载荷
    mutations: {
        increment (state,n) {
            state.count += n
        }
    }
    调用时传入参数:
    $store.commit('increment',2)

    大多数情况下,载荷应该是一个对象，这样可以包含多个字段。
    并且记录的mutation会更易读
    mutations: {
        increment (state,payload) {
            state.count += payload.num
        }
    }
    调用时:
    $store.commit('increment',{ num: 10 })
    对象风格调用方式:
    store.commit({
        type: 'increment',
        num: 10
    })

## Vuex-Action

    Action类似于mutation,不同在于:
        Action提交的是mutation，而不是直接变更状态。
        Action可以包含任意异步操作。

    {
        stete: {
            count: 0
        },
        mutations: {
            jia (state,payload) {
                state.count = payload
            }
        },
        actions: {
            jiaHandle (state,payload) {
                setTimeout(() => {
                    state.commit('jia',payload.count)
                }, payload.delay)
            }
        }
    }
    使用actions的方式:
    this.$store.dispatch('jiaHandle', { count: 5, delay: 2000 })

## modules

    由于使用单一状态树,应用所有状态会集中到一个比较大的对象，当应用
    变得非常复杂时,store对象就有可能变得相当臃肿。
    为了解决以上问题,Vuex允许我们将store分割成模块。每个模块拥有自己的state
    、mutation、action、getter、甚至是嵌套子模块-从上至下进行同样方式
    的分割。

## Getters

    有时候我们需要从store中的state中派生出一些状态，例如对列表进行过滤并计数。
    computend: {
        doneTodosCount () {
            return this.$store.state.todus.filter(todo => todo.done).length
        }
    }

# vue2Render教程

    renderHeader (h, { column }) {
      const that = this
      console.log(that)
      return h('elCheckbox', {
        class: 'tableheader',
        props: {
          value: this.allcheck
        },
        on: {
          input: ($event) => {
            // const ip = document.querySelector('.tableheader input')
            // ip.checked = this.allcheck
            this.allcheck = $event
            if (this.allcheck) {
              for (const value of this.fileTableData.data) {
                value.isChecked = true
              }
            } else {
              for (const value of this.fileTableData.data) {
                value.isChecked = false
              }
            }
          }
        }
      })
    }

    // 监听表格中的选择框,改变表头中的全选状态
    tableData: {
      handler (n, o) {
        for (const value of n) {
          // console.log(value.isChecked)
          if (!value.isLoad) {
            this.allcheck = false
            return ''
          }
        }
        this.allcheck = true
      },
      deep: true
    }
