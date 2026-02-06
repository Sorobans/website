---
title: JavaScript-ES6笔记
date: 2021-12-26
tags:
  - 学习笔记
  - ES6
  - JavaScript
categories: 学习笔记
---

# JavaScript高级

## 面向对象编程

### 面向对象与面向过程对比

    面向过程是亲力亲为,事无巨细,面面俱到，步步紧跟，有条不絮。
    面向对象就是找一个对象，指绘得结果。
    面向对象将执行者转变为指挥者。
    面向对象不是面向过程的替代，而是面向过程的封装。

### 面向对象的特性

    封装性、继承性、多态性[抽象]

    在面向对象程序开发思想中，每一个对象都是功能中心，具有明确分工，可以完成接受信息、处理数据、发出信息等任务。

    面向对象编程具有灵活、代码可复用、高度模块化等特点，容易维护和开发，比起由一系列函数或指令组成的传统过程式编程，更适合多人合作的大型软件项目。

### 面向对象的设计思想

    抽象出Class(构造函数)
    根据Class(构造函数)创建Instance(实例)
    指绘Instance 得出结果。

### 创建对象的几种方式

    new Object()构造函数
    对象字面量[]
    工厂函数
    自定义构造函数

### constructor属性

    通过构造函数生成的实例是可以找到自己当初的构造函数的。
    每个对象的constructor属性都是生成这个对象的构造函数。

### instanceof语句

    判断一个对象的具体对象类型，需要使用instanceof进行判断。

### 构造函数和实例对象的关系

    构造函数是根据具体的事物抽象出来的抽象模板
    实例对象是根据抽象的构造函数模板得到的具体实例对象
    每一个实例对象都通过一个constructor属性，指向创建该实例的构造函数
        注意:constructor是实例属性的说法并不严谨。
    可以通过constructor属性判断实例和构造函数之间的关系。
        注意:这种方式不严谨，推荐使用instanceof操作符。

### 静态成员和实例成员

    使用构造函数方法创建对象时，可以给构造函数和创建实例对象添加属性和方法。这些属性和方法都叫做成员。
    实例成员： 在构造函数内部添加给this的成员，属于实例对象的成员，在创建实例对象后，必须由对象调用。
    静态成员： 添加给构造函数自身的成员，只能使用构造函数调用，不能使用生成的实例对象调用。静态成员不是由this进行生成的。而是由构造函数本身生成的。

### 构造函数的问题

    重复定义固定的值或方法，造成一种浪费内存的现象。
    解决方法:
        JavaScript规定，每一个构造函数都有一个prototype属性，指向构造函数的原型对象。
        这个原型对象的所有属性和方法，都会被构造函数的实例对象所拥有。
        因此，我们可以把所有对象实例需要共享的属性和方法直接定义在prototype对象上。
        解决浪费内存的问题。

### 原型对象

    任何函数都具有一个prototype属性，该属性是一个对象。
    可以在原型对象上添加属性和方法。
    构造函数的prototype对象默认都有一个construtor属性，指向prototype对象所在函数。
    通过构造函数得到的实例对象内部会包含一个指向构造函数的prototype对象的指针,
    _proto_实例对象属性可以直接访问原型对象成员。
    _proto_属性并不是一个标准的属性，是浏览器自己根据语法自动生成的。

### 原型链

    null(Object原型对象)>Object(构造函数.原型对象的原型对象)>构造函数的原型对象>构造函数

    如果实例对象没有找到方法，会去往原型对象找。如果原型对象没有找到，会往Object原型对象找，
    如果最后找到了null，则会返回一个失败的结果。

    原型链可以帮助实例对象查找原型之上的方法。

### 原型链查找机制

    每当代码读取到某个对象的某个属性时，都会执行一次搜索，目标是具有给定名字的属性:
    1.搜索首先从对象实例本身开始。
    2.如果在实例中找到了具有给定名字的属性，则返回该属性的值。
    3.如果没有找到，则继续搜索指针指向的原型对象，在原型对象中查找具有给定名字的属性。
    4.如果在原型对象中找到了这个属性，则返回该属性的值。
    如果没有找到属性，则会返回一个undefined.

### 实例对象读写原型对象成员

    通过实例对象添加新成员,会直接添加给自己。会屏蔽掉对原型对象的访问。
    通过实例对象无法更改原型对象的成员，只会为自身添加成员。

    通过实例对象更改原型链对象中复杂类型数据中的内容，还是会进行原型链的查找。
    person1.address.city = "上海";

### 更简单的原型语法

    前面在原型对象每添加一个属性和方法就要书写一遍Person.prototype。
    为了减少不必要的输入，更常见的做法是用一个包含所有属性和方法的对象字面量，来重写整个原型对象，将Person。prototype重置道一个新的对象。
    注意:重写原型对象会丢失constructor成员，所以需要手动将constructor指向正确的构造函数。

### 原型对象使用建议

    在定义构造函数时，可以根据成员的功能不同，分别进行设置。
    私有成员(一般就是非函数成员)放到构造函数中
    共享成员(一般就是函数)放到原型对象中
    如果重置了prototype记得修正constructor的指向。

        function Person(name,age,sex){
            this.name = name;
            this.age = age;
            this.sex = sex;
        }
        Person.prototype = {
            constructor:Person,
            show:function(){
                return `姓名:${this.name} 年龄:${this.age} 性别:${this.sex}`;
            }
        }
        let person_1 = new Person("李嘉欣",19,"female");

### 内置构造函数的原型对象。

    不能直接给数组原型对象添加一个对象字面量的值。
    // 能通过成员添加的方法，给数组构造函数添加新的方法。
    // 不允许更改内置构造函数的原型对象。
        Array.prototype.getEvenSum = function(){
            let sum = 0;
            for(let i = 0;i<this.length;i++){
                if(i % 2 === 0){
                    sum += this[i];
                }
            }
            return sum;
        };

### 自调用函数封装类,构造函数

    (function(window,undefined){
        function Class() {

        }
        windows.Class = Class;
    })(window,undefined);
    通过IFEE自调用函数进行作用域封装。
    通过自调用函数的实参，局部映射全局。
    window对象属性添加暴露自身。
    undefied,在低版本浏览器中是有可能会被更改的。
    undefied,防止代码出问题。
    window实参传递,是为了不让自调用函数再跳出局部外到全局。
    减少性能的浪费。

### 键盘按下事件

        document.onkeydown = function(e){
            console.log(e.keyCode); //获取键盘按键编码
        };

## 继承和函数进阶

### 面向对象的特点

    封装、集成、多态(抽象)
    function extend(parent,child){
        for(let key in parent){
            // 子级有的属性不需要继承
            if(child[key]){
                continue;
            }
            child[key] = parent[key];
        }
    } //父对象的成员,拷贝给子对象，就是继承

### 原型继承

    封装的构造函数就是用来创建一类对象
    继承指的是类型和类型之间的集成
    原型对象，可以将自己的属性和方法继承给将来的实例对象使用
    function Person(name,age,sex){
        this.name = name;
        this.age = age;
        this.sex = sex;
    }
    function Student(score){
        this.score = score;
    };
    Student.prototype = new Person("张三",18,"男");
    有弊端，只能指定一次继承属性。

### call方法

    call方法本身是一种执行函数的方法
    call方法在调用时，有两个功能
    1.更改函数内部的this指向
    2.调用函数执行内部代码
    参数: 第一个参数用来指定this
    第二个以及以后，就是传的实参。

### 借用构造函数继承属性

    function Person(name,age,sex) {
        this.name = name;
        this.age = age;
        this.sex = sex;
    }
    function Student(name,age,sex,score) {
        Person.call(this,name,age,sex);
        this.score = score;
    };
    Person普通调用过程中,内部的this指向的是window
    通过call方法更改Person内部的this指向。

### 组合继承法

    通过原型继承
    function Student(name,age,sex,score) {
        Person.call(this,name,age,sex); //通过call进行属性继承
        this.score = score;
    };
    Student.prototype = new Person(); //通过原型继承 Person方法
    Student.constructor = Student; // 更改constructor指向

### 函数的调用方法和this

    普通函数的this默认指向window、
    构造函数this指向的是将来创建的实例对象
    对象的方法,this默认指向的对象自己
    事件函数this指向的触发事件的事件源。
    定时器、延时器this默认指向window

    this的指向是要联系执行的上下文，在调用的时候，
    是按照什么方式调用，指向是不一样的。

### call、apply、bind方法

    函数内部在调用时，this有自己默认的指向
    call方法
    1.功能:第一个可以指定函数的this,第二个可以执行函数并传参
    2.参数:第一个参数,传入一个指定的让this指向的对象。
    第二个参数以及以后，是函数参数的列表。
    3.返回值: 函数自己的返回值.
    应用:{}的对象是没有push方法的，可以将array构造函数的prototype的原型方法中的push,通过call调用到object对象使用。

    apply方法
    1.功能:第一个可以指定函数的this，第二个可以执行函数并传参
    2.参数:第一个参数，传入一个指定让this指定的对象，第二个参数是函数的参数组成的数组
    (将数组值转函数的参数)
    3.返回值: 就是函数自己的返回值
    应用:// apply方法指定一个函数的this,并且通过数字方式进行传参。
        // 利用apply方法,将数组传给max的第二个参数.
        Math.max.apply(Math,arr);


    bind 方法
    1.功能:第一个函数可以指定一个函数的this,bind方法不能执行函数,但是可以传参
    2.参数:第一个参数，传入一个指定让this指向的对象，第二个参数以及以后，是函数参数的列表
    3.返回值:返回一个新的指定了this的函数,可以叫做绑定函数。
    (只更改this指向，但不执行函数.)
    应用:修改定时器函数在对象内的指向(定时器默认指向window对象,需要获取对象内的参数使用this)
        更改事件函数的对象指向
        function Person(name){
            this.name = name;
            // this.setTime = setInterval(function(){
            //     console.log(this.name);
            // }.bind(this),1000);
        }
        Person.prototype.setTime = function(){
            setInterval(function(){
                console.log(this.name);
            }.bind(this),1000);
        }

        let a = new Person("张三");
        a.setTime();

### 函数的其他成员

    arguments 存储的是函数在调用时存储的所有实参组成的类数组对象。
    实际应用中,在函数内部直接使用一个arguments关键字。
    arguments.callee指向的函数本身.

    caller属性,指的是函数的调用者。函数在哪个作用域调用，caller就是谁。
    如果在全局调用，值就是null。

    length 指形参的个数

    name 指函数的名字

### 高阶函数

    函数作为另一个函数的参数
    函数作为一个函数的返回值。

### 闭包

    全局作用域,函数作用域,let有块儿作用域。
    内层作用域可以访问外层作用域，反之外层不行。

    函数定义时天生就能记住自己生成的作用域环境和函数自己，将它们形成一个密闭的环境。
    这就是闭包，不论函数以任何方式在任何地方进行调用。都会回到自己定义时密闭环境进行执行。

    观察闭包:
    从广义上来说，定义在全局的函数也是一个闭包。只是我们没办法将这样的函数拿到更外面的作用域进行
    调用。从而观察闭包的特点。
    闭包是天生存在的，不需要额外的结构，但是我们为了方便观察闭包的特点。需要利用一些特殊机构将
    一个父函数将内部的子函数拿到父函数外部进行调用，从而观察闭包的存在。

### 闭包的理解和应用

    可以在函数外部读取函数内部成员
    让函数内成员始终存活在内存中

    闭包内部会记住外部环境。高阶函数就是利用了闭包的概念。
    闭包里面加闭包,里层闭包会记住外层闭包的环境和变量。
    不会让外层闭包的成员销毁。

### 闭包的问题

    闭包只能记住自己作用域外部环境的值。无法记住当时的值。
    解决问题的方法,可以在函数内部套用一个IFEE自调用匿名函数,封闭这个作用域。
    然后,通过自调用函数的实参形参,让自调用内部的值把把最外层的值给固定住。

## 正则表达式

### 什么是正则

    正则表达式用于匹配规律规则的表达式，正则表达式最初是科学家对人类神经系统工作原理的早期研究。
    现在在编程语言中有广泛应用，正则通常被用来检索、替换那些符合某个模式(规则)的文本。

    正则表达式是对字符串操作的一种逻辑公式，就是用事先定义好的一些特定字符，及这些特定字符的组合。
    组成一个"规则字符串。"这个规则字符串，用来表达对字符串的一种过滤逻辑。

### 正则表达式的作用

    给定的字符串是否符合正则表达式的过滤逻辑(匹配)
    可以通过正则表达式，从字符串中获取我们想要的特定部分(提取)
    强大的字符串替换能力

    在线测试正则: https://c.runoob.com/front-end/854

### 语法

    在JavaScript中，正则表达式也是对象，是一种索引类型。
    使用一个正则表达式字面量是最简单的方式。两个/是正则表达式的定界符。

    正则表达式创建的两种方式：
    使用一个正则表达式字面量创建：
        let reg = /abc/;
    正则表达式在脚本加载后编译，如果正则表达式是常量使用字面量创建法，可以获得更好的性能。
    调用RegExp对象构造函数:
        let reg = new RegExp("abc");

### 正则相关方法

    字符串方法:
    split();根据匹配字符串切割父字符串,返回数组
    match();使用正则表达式,在父字符串中匹配符合的子字符串,返回一个包含匹配结果的数组.
    search();对正则表达式或指定字符串进行搜索,返回第一个出现的匹配项的下标。
    replace();用正则表达式和字符串直接比较，然后用新的子串来替换被匹配的子串。返回替换的字符

    正则表达式方法：
    reg.exec("");在目标字符中执行一次正则匹配操作,输出到一个数组中。
    reg.test("");(用的比较多,字符是否符合正则.)符合正则就返回true。

### 全局修饰符

    //g,如果有全局修饰符g，会在找到所有的匹配字符串后结束。

### 正则表达式的组成

    正则表达式是由一些普通字符和一些特殊字符(元字符)组成的。普通字符包括大小写的字母和数字。
    而元字符则具有特殊的函数以。

    特殊字符:JavaScript中常用的特殊字符有:
    ()、[]、{}、\、^、$、|、?、*、+、.

    如果想匹配这些字符必须用转义符号\如:\(、\^、\\

    预定义特殊字符:
        \t 制表符
        \n 回车符
        \f 换页符
        \d 数组字符
        \D 非数字字符
        \s 空白字符
        \S 非空白字符
        \w 单词字符
        \W 非单词字符

### 字符集

    [] 表示字符串的其中一个字符,多选一的效果。
    简单类:多个可能匹配的字符连续书写在一起，只要其中一个匹配成功即可。
    [abc]

    范围类:将匹配同一类型切连续在一起的字符写到集合中。中间使用-连接。
    [0-9]、[a-z]、

    负向类:[^0-9]取反的意思，不包含字符集内部书写的字符。

    组合类:单一类型或者简单类不能匹配所有结果。可以将多个写法连在一起书写
    [0-9a-z]、书写顺序为:数字,大写字母,小写字母这种顺序。

### 修饰符

    g修饰符用于执行全局匹配(查找所有匹配而非找到第一个匹配后停止)
    /b+/g

    i修饰符,字母大小姐可以不敏感。a可以匹配A或者a。
    /b+/ig

### 边界

    ^ 开头 注意不能紧跟于左中括号的后面
    $ 结尾
    //实际应用中，会同时限制开头和结尾

### 预定义类

    . 除了换行和回车之外的任意字符
    预定义特殊字符:
    \t 制表符
    \n 回车符
    \f 换页符
    \d 数字字符
    \D 非数字字符
    \s 空白字符
    \S 非空白字符
    \w 单词字符
    \W 非单词字符

### 量词

    对应量词其前面的内容。
    {n} 硬性量词,对应0次或者n次
    {n,m} 软硬量词,至少出现n次,不超过m次(中间不能有空格)
    {n,} 软性量词 至少出现n次
    ? 软性量词 出现零次或一次
    * 软性量词 出现零次或多次(任意次)
    + 软硬量词 出现一次或多次(至少一次)

### 分组或操作符

    虽然量词的出现，能帮助我们处理一排紧密相连的同类型字符串。
    我们要用小括号进行分组。
    /(abc)/ 将abc三个字母分为一组。必须连续书写,才能匹配。

    可以使用(|)字符表示或者的关系

### 分组的反向引用

    反向引用表示是对正则表达式中的匹配组捕获的子字符串进行编号。
    通过"\编号(在表达式中)",“$编号(在表达式外)”进行引用。从1开始计算。

    // 正则中通过分组匹配到的字符串，会被进行编号，从1开始
    // 在正则内部可以通过 \1 方式，对字符串进行反向引用
        let str = "123*456".replace(/^(\d{3})\*(\d{3})$/,function(match,$1,$2){
            return `${$1 * 3}/${$2 * 2}`;
        });
        console.log(str);

### 中文字符

    匹配中文: [\u4e00-\u9fa5]

## ES6语法

### ES2015概述

    ES6也泛指未来的新标准。
    http://www.eamc-international.orag/ecma-262/6.0/

    ES2015解决了原有语法的一些问题或者缺陷。
    对原有语法进行增强。
    全新的对象、全新的方法、全新的功能
    全新的数据类型和数据结构

### 前端调试必备三插件

    debugger for Chrome
    brwser Preview
    live server

    配置信息:
    "version": "0.2.0",
        "configurations": [
            {
                "type": "pwa-chrome",
                "request": "launch",
                "name": "Launch pwa-chrome against localhost",
                "url": "http://localhost:5500",
                "webRoot": "${workspaceFolder}"
            }
        ]
    }

### let和块作用域

    通过新的关键字let定义块内部的变量
    let定义的变量在块级作用域内部能够被访问
    非常适合设置在for循环中的变量。通过let定义变量，只在自己的循环中生效。

    除了块作用域,let和var有另外一个区别，let是不会进行变量声明提升。

### const

    在let的基础上增加了只读的效果。
    对象类型的内部成员可以进行再次赋值。
    但是，对象直接赋值空对象清空是不行的。
    数组内的成员可以再次赋值和更改。
    但是，赋值空对象清空也是不行的。

### 数组的解构

    const arr = [100,200,300];
    const [foo,bar,baz] = arr;
    const [,,baz] = arr;

    ...语法解构
    const[foo,...soo] = arr;
    表示获取foo后面的所有的值。
    存储为数组。

    解构默认值:
    const [a1,a2,a3,a4,a4 = 400] = arr;
    在解构赋值的时候,写=就代表设置默认值。

### 对象的解构

    const {log} = console;
    const obj = {name: "张三",age: 18,sex: "male"};
    const {name: newName = 1500} = obj;
    log(newName);

### 模板字符串

    const str = `thi
    s`;//模板字符串内能包含换行，回车
    const str = `${a}`; // 插值表达式能够放入有返回值的js代码，变量。

### 模板字符串标签函数

    const name = "张三";
    const gender = true;
    const str = myTagFunc`my,name is ${name} and my sex is ${gender}`;
    function myTagFunc(strings,name,gender){
        // console.log(strings);
        let sex = gender?"male":"female";
        return strings[0]+name+strings[1]+sex;
    }
    console.log(str);

    模板字符串标签函数,第一个参数接收为string,后面依次填放莫版内出现过的变量。

### 字符串拓展方法

    String.startWith(); // 判断字符串开头字符,返回为布尔值。
    String.endWith(); // 判断字符串结尾字符,返回值为布尔值
    String.includes(); // 判断字符串中有没有出现过这个字符,返回值为布尔值

### 函数参数的默认值

    es6语法中可以直接使用函数默认值语法。
    function foo(bar,enable = true){
        console.log(enable);
    }
    foo();
    // 在书写中，应当把带有默认值的参数往后挪。

### 剩余操作符

    function fun(n,...args){
    }
    剩余操作符的意思是从当前的位置一直往后。

    const arr = [1,2,3];
    console.log(...arr); // 剩余操作符对数组使用的案例。
    自动把数组成员依次进行展开在列表内。

### 箭头函数

    const fun =>(){

    } //箭头函数的声明

### 箭头函数的this

    箭头函数没有this指针。会往上访问寻找this指针。

### 对象字面量的增强

        const bar = "bar";
        const age = "age";
        const obj = {
            name: "tom",
            bar, // 如果变量值,等于属性名与省略不写。
            sayHi(){
                console.log();
            }, // es6对象方法名
            // 计算属性名
            [1+2]: 18
        }
        console.log(obj);

### Object.assign方法

    Object.assign方法可以将多个源对象的属性存放到目标对象内。
    复制对象，克隆对象。
    Object.assign(target,obj2); 参数一为源对象,后面为其他对象。

    应用: 可以在构造函数参数接收时进行见简化。

### Objdect.is 方法

    Object.is(paren1,paren2);
    判断两个值是否相等。
    不太常用

### Class类

    // EcmaScript 2015 Class类声明
    static关键字,声明构造类的静态方法。(不能被实例调用的方法)
    class Person {
        constructor(name,age){
            // 类的构造函数
            this.name = name;
            this.age = age;
        }
        sayHi(){
            // 实例方法,(原型对象方法)
            // this指针指向的是实例
            console.log("你好呀!"+this.name+","+this.age);
        }
        static create(name,age){
            return new Person(name,age);
            // stacic关键词声明类的静态方法。
            // 非实例对象的方法。
            // 静态对象的this指针,指向的不是实例对象。
            // 而是构造类的整体。
        }
    }
    const p1 = Person.create("张三",18);
    console.log(p1);

### Class static声明静态成员

    // EcmaScript 2015 Class类声明
    static关键字,声明构造类的静态方法。(不能被实例调用的方法)
    static声明的属性和方法,不能够被实例对象调用,只能通过声明类打点调用。
    class Person {
        static a = "123";
        static show(){
            alert(this.a);
        }
    }
    console.log(Person.a);
    Person.show();

### Class的私有成员声明

    class Person{
        #privite_a;
        //在constructor外通过#声明一个私有属性
        #privite_fun(){
            console.log("abc");
        };
        // 声明一个私有函数,无法通过class打点调用。也无法被实例函数调用。
        // 只能够被class内部的成员(函数)调用。
        constructor(a){
            this.#privite_a = a;
            // 构造函数可以对私有属性进行赋值。
        }
        show(){
            this.#privite_fun();
            //在原型函数里this打点#调用私有函数。
            return this.#privite_a;
            //私有属性无法直接打点调用,可以声明一个函数进行返回。
        }
    }
    let p = new Person("123");
    console.log(p.show());

### 类的继承

    在ECMASCRIPT 2015中,
    我们可以使用 extends关键字进行类型的属性继承。
    可以通过super()来调用父类的构造函数.
    super.方法名(),来对父类的构造方法进行调用。
        class Person {
            constructor(name, age) {
                // 类的构造函数
                this.name = name;
                this.age = age;
            }
            sayHi() {
                // 实例方法,(原型对象方法)
                // this指针指向的是实例
                console.log("你好呀!" + this.name + "," + this.age);
            }
        }
        class Student extends Person {
            constructor (name,age,number){
                // super()是调用父类的构造函数
                super(name,age);
                this.number = number;
            }
            hello(){
                super.sayHi(); //通过super.方法名.调用父类的构造方法
                console.log("学号是"+this.number);
            }
        }
        const s1 = new Student("张三",18,101);
        s1.hello();

### Set集合

    Set是ECMASCRIPT中的一种新的数据类型。
    通过new进行生成。集合中不允许存在重复的值。
    const s = new Set(); //new关键字生成一个新的集合
    s.add().add().add(); // 对集合内进行多次数据添加。

    s.size //size属性可以返回一个集合的长度,类似于数组的length
    s.has(4); // has方法检测集合内包不包含此项数据。返回布尔值。
    s.delete(3); //delete方法用来删除集合内一项的数据。返回布尔值。
    s.clear(); // clear方法用于清空集合内的所有数据。

    set数据结构用于数组去重。
    const s = new Set(arr);
    const s = new Set([1,1,1,2,2,3,3]);
    // 声明集合时,可以直接传入一个数组
    const b = Array.from(new Set(arr));
    /// 可以通过Array.from();方法将集合转换为数组
    // 可以直接通过剩余操作符,把集合转换成数组。
    const b = [...new Set([1,1,2,2])];

### Map

    Map数据集合类似于对象类型。
    普通的对象类型的键值只能使用字符串类型(会强制转换为字符串)
    const map = new Map();
    // 通过set()方法对Map集合进行添加.
    map.set(key,value);
    // 通过get()方法对Map集合进行数据获取
    map.get(key); // 引用类型应当注意,是否为同一地址。

    // 还存在和Set集合同样的。map.has(),map.delete(),map.clear()

    // 通过map.forEach()循环可以遍历Map集合.
        map.forEach((value,key) => {
            console.log(key,value);
        }) // 遍历map集合的方法

        arr.forEach((value,key,array) => {
            console.log(value);
        }); // foreach遍历数组的格式

### Symbol数据类型

    一种全新的原始数据类型

    // Symbol 是符号的意思。作用是表示一个独一无二的值。
    // 通过Symbol函数创建的函数,每个值都是唯一的。
    const s = Symbol('foo'); // Symbol内部参数是描述文字
    const obj = {
        [Symbol]: 789,
        [Symbol]: 123
        // 可以避免对象属性名重复.
        // Symbol属性名,在对象外部是无法被引用的。
    };

    Symbol.for('');通过for方法设置的描述文本,会与另外一个Symbol.for();相等。
    console.log(Symbol.for("123") === Symbol.for("123")); //返回为true.

    Symbol();数据类型也是引用数据类型。变量、常量互相赋值是传址。传址的话，两个Symbol是相等的。
    // for in,obj.keys(),都是拿不到Symbol的属性名。Symbol适合作为对象的私有属性名。

    Object.getOwnPropertySymbols(obj);获取对象的Symbol属性名。

### for of遍历

    const arr = [100,200,300,400];
    for(let item of arr){
        console.log(item);
    }
    // 能够直接遍历数组的值。

    const m = new Map();
    m.set("foo",1);
    m.set("foo",1);
    for(let [key,value] of m){
        console.log(key,value);
    }
    // for of遍历 map方法

### ES2015其他内容

    可迭代器接口
    迭代器模式
    生成器
    Proxy代理对象
    Reflect同意的对象操作API
    Premise异步解决方案
    ES Modules 语言层面的模块化标准

## ECMAScript 2016

### 数组实例includes方法

    Array.includes("value");
    // 检测数组是否存在某个值，返回布尔值。

### 指数运算符

    指数运算符: **
    相当于: Math.pow(2,3); // 2的3次方
    新的语法: 2 ** 3; //2的3次方
