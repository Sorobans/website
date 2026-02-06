---
title: MongoDB学习
date: 2022-03-26
tags:
  - 数据库
  - MongoDB
  - node.js
categories: 学习笔记
---

# MonggoDB

## 简介

    MonggoDB是文档型数据库,非关联型数据库

    MongoDB是一个介于关系数据库和非关系数据库之间的产品
    严格来讲,MangoDB是非关系数据库中最像关系型数据库的数据库了

    MangoDB将数据存储为一个文档.
    数据结构为键值对对象.MongDB文档类似于JSON对象

    MongDB查询功能非常强大

    MongDB对处理大量低价值数据,且对数据处理性能有较高要求
    (比如,聊天软件)

## 下载

    下载Zip压缩包

## 打开

    命令行执行mongod.exe
    配置环境变量,把mongod.exe文件的路劲
    配置到path环境变量中

## 查看版本

    mongod --version

## 启动服务

    mongod --dbpath="C:\Soft\mongodb-win32-x86_64-windows-5.0.6\data"
    // 表示将mongdb数据库服务创建到这个目录,数据文件也存储在这个目录

    使用mongod命令,不使用--dbpath,会在命令符根目录,找到data/db进行存储。

## 连接服务

    开启新的命令执行符
    mongo

## 管理mongodb

    使用mongoShell进行管理数据库
    mongo --verion 查看mongoShell版本

    mongo链接本地mongoDb服务
    mongoShell提供了js执行环境

    默认链接27017端口,本地连接指定端口使用 --port 28015

    远程连接:
    mongo "mongodb://xxxxxxxxxxxxxx:28015"

### mongoShell执行环境

    提供了JavaScript执行环境
    内置了一些数据库操作命令
    show dbs // 查看有多少数据库
    db // 查看当前所处数据库
    show collections // 查看数据库集合
    db.users(集合名称).insert({}) // 当前数据库创建json对象
    db.users.find()  // 查看集合数据

## 退出连接

    exit
    quit()
    ctrl+c

## 数据存储结构

    MongoDB是文档型数据库,其中存储的数据就是熟悉的JSON
    数据格式
    你可以把MongoDB理解为一个超级大对象
    对象里面有不同的集合
    集合中有不同的文档
    MongoDB对数据结构没有要求。非常灵活,没有约束
    (好处: 不需要对结构做任何修改)
    (缺点: 太灵活,带来一些麻烦)

### 数据库

    在MongoDB中,数据库包含一个或多个文档集合

#### 进入数据库

    use 数据库名称

#### 创建数据库

    use 创建数据库名称
    插入数据
    db.users.insert({name: 'jack', age: 15})
    查看数据库集合内的数据
    db.users.find()

#### 删除数据库

    db.dropDatabase()
    // 删除数据库-当前数据库下运行

### 集合

    集合类似于关系数据库中的表,MongoDB将文档存储在集合中

#### 创建集合

    db.集合名称.insert({})插入的一条数据
    集合尽量以字母开头,不能包含$与其他特殊符号

#### 删除集合

    db.集合名称.drop()

### 文档

    MongoDB将数据记录为BSON文档
    BSON是JSON文档的二进制表现形式,
    它比JSON包含更多的数据类型

#### 字段限制

    字段名称,_id保留用作主键。
    它的值在集合中必须是唯一的(默认的ID),
    不可变的。
    并且可以使数组以外的任何类型

#### 数据类型

    字段的值可以使任何BSON数据类型,
    包含其他文档,数组和文档数组,
    例如，以下文档包含各种数据类型的值

    _id 保存一个ObjectID类型

#### 常用数据类型

    Double、String、Array、Binary data(二进制数据)
    ObjectId(唯一ID)，Boolean、Date、null

## MongoDB可视化管理工具

### CRUD增删改查

    Create 创建
    Read 读取
    Update 更新
    Delete 删除

### 图形管理软件

    Robo 3T
    Studio 3T
    Navicat

## 创建文档

    db.集合名称.insert() // 将一个或多个文档插入到集合中
    db.集合名称.insertMany([]) // 将多个文档到集合中
    db.集合名称.insertOne() // 将一个文档插入到集合中
    (尽量使用insertOne或者insertMany.这两个方法能够返回id)

### 插入行为

    在MongoDB中,存储在集合的每个文档都需要一个唯一的_id
    字段作为主键。如果插入的文档省略_id字段，则MongoDB驱动
    程序会自动为_id字段生成ObjectId

## 查询文档

    db.collection.find(query, projection)
    query: 可选,使用查询操作符指定查询条件
    projection: 可选,使用投影操作符指定返回的键。查询返回文档所有键值。只需省略该参数即可。

    db.collection.findOne()
    只返回满足条件的第一个

    查询所有文档
    db.集合.find({})

### 指定文档返回字段

    db.users.find({},{
        name: 1,
        age: 1
    })

### 相等条件查询

    db.users.find(
        {
            sex: 'fomale'
        },
        {
            name: 1,
            age: 1
        }
    )

### 指定AND条件

    db.users.find(
        {
            sex: 'fomale',
            name: '王小美'
        },
        {
            name: 1,
            age: 1
        }
    )

### 指令OR条件

    db.users.find(
        {
            $or: [
                {sex: 'fomale'},
                {sex: 'male'}
            ]
        },
        {
            name: 1,
            age: 1
        }
    )

### 指定OR和AND查询

    db.users.find(
        {
            sex: 'fomale',
            $or: [
                {
                    age: { $lt: 18 }
                },
                {
                    age: 3000
                }
            ]
        },
        {
            name: 1,
            age: 1
        }
    )

    { $lt: 18 }条件表示小于

### 查询运算符

#### 比较运算符

    $eq 匹配等于指定值的值
    $gt 匹配大雨指定值的值
    $gte 匹配大雨或等于指定值的值
    $in 匹配数组中指定的任何值
    $lt 匹配小于指定值的值
    $lte 匹配小于或等于指定值的值
    $ne 匹配所有不等于指定值的值
    $nin 不匹配数组中指定的任何值

#### 逻辑运算符

    $and 将查询子句与逻辑连接,返回满足里面所有条件的文档
    $not 反转查询表达式效果,返回不匹配的内容
    $nor 用逻辑NOR连接查询子句,返回所有不能匹配这两个子句的文档
    $or 用逻辑连接查询子句,或返回与任一子句条件匹配的所有文档

## 查询嵌套文档

    db.users.find(
        {
            "lovely": [
                "萤",
                "可莉",
                "阿贝多"
            ]
        },
        {
            _id: 0,
            name: 1
        }
    )

    整个嵌入式文档上的相等匹配要求,要求与指定的value完全匹配.
    包括字段顺序。

### 在嵌套字段上指定相等匹配

    db.users.find(
        {
            "lovely.0": '萤'
        },
        {
            _id: 0,
            name: 1
        }
    )

    表示查询lovely字段中,0成员为萤的文档。

## 查询数组

### 匹配一个数组

    db.集合.find(
        {
            tags: ['123', '456']
        }
    )

### $all运算符

    如何希望找到一个同时包含的数组,而不考虑顺序
    应该使用$all运算符
    db.集合.find({
        tags: {
            $all: ['123', '456']
        }
    })

### 查询数组包含某个字段

    db.users.find(
        {
            lovely: '萤'
        },
        {
            _id: 0,
            name: 1
        }
    )

    db.users.find(
        {
            lovely: {
                $all : ['萤']
            }
        },
        {
            _id: 0,
            name: 1
        }
    )

### 数组复合条件查询

    db.users.find(
        {
            age: {
                $gt: 10,
                $lt: 800
            }
        },
        {
            _id: 0,
            name: 1
        }
    )
    // 表示数组中,任一元素满足一条件就行了

#### 满足多条件运算符

    db.users.find(
        {
            age: {
                $eleMatch: {
                    $gt: 10,
                    $lt: 800
                }
            }
        },
        {
            _id: 0,
            name: 1
        }
    )
    // 表示数组中,任一元素满足所有条件

### 通过数组索引查询元素

    db.集合.find({
        'age.0': '123'
    })

### 通过数组长度查询数组

    db.集合.find({
        'tags': {
            $size: 3
        }
    })

## 查询嵌入文档数组

### 查询数组的元素与指定文档匹配的所有文档

    db.集合.find({
        'instock': {
            qty: 5,
            warehouse: 'a'
        }
    })

### 在数组中的字段上指定查询条件

    db.集合.find({
        'instock.qty': {
            $lte: 20
        }
    })

    // 查询instock数组内的文档满足qty小于20的

### 单个嵌套文档在嵌套字段上满足多个查询条件

    db.集合.find({
        'instock': {
            $elemMatch: {
                qty: {
                    $gt: 10,
                    $lte: 20
                },
                warehouse: 'A'
            }
        }
    })

## 指定从查询返回的项目字段

    db.集合.find(
        {
        },
        {
            _id: 1,// 1要,0不要
        }

    )

### 返回嵌入式文档中的特定字段

db.集合.find({},{
name: 1,
age: 1,
\_id: 0,
lovely.0: 1
})
或者
db.集合.find({}, {
name: 1,
age: 1,
\_id: 0,
love: {
0: 1
}
})

### 返回数组中特定的数组元素

    db.集合.find({
        item: 1,
        status: 1,
        instock: {
            // $slice: -1操作符表示返回数组最后一个
            // 正数表示数组第几个
            // 负数表示后n个
            $slice: -1
        }
    })

## 查询空字段或缺少字段

    空字段: 值为Null
    缺少字段,没有这个字段

### 相等过滤器

    db.集合.find({
        item: null
    })

    查询包含item为null,或没有item的文档

### 类型检查

    db.集合.find({
        item: {
            $type: 10
        }
        // 使用$type类型编号10
        // 10是null类型的编号
    })

    只会返回带有item字段且为null的文档

### 存在检查

    查询不包含字段的文档
    db.集合.find({
        item: {
            $exists: false
        }
        $exists存在检查字段
    })

## 更新文档

    // 更新单个
    db.集合.updateOne()
    // 更新多个
    db.集合.updateMany()
    // 替换操作
    db.集合.replaceOne()

### 更新单个文档

    $set // 操作符,更新操作符
    $currentDate // 操作符,将字段更新为当前日期

    db.users.updateOne(
        {
            _id: ObjectId('623f4d425a979225ccd28ef1')
        },
        {
            $set: {
                sex: 'fomale'
            },
            $currentDate: {
                birthday: true
            }
        }
    )

### 更新多个文档

    db.集合.updateMany()
    方法来更新数量小于50的所有文档
    db.users.updateMany(
        {
            'age': {
                $lt: 18
            }
        },
        {
            $set: {
                'type': '萝莉'
            }
        }
    )

    // 更新所有文档,就不要指定条件

### 替换文档

    db.users.replaceOne(
        {
            _id: ObjectId('623fdddccb580000580013a2')
        },
        {
            name: '张晓梅'
        }
    )

## 删除文档

    // 删除被匹配到的多个文档
    db.集合.deleteMany()
    // 删除被匹配到的第一个文档
    db.集合.deleteOne()

### 删除所有文档

    db.集合.deleteMany({})

### 删除匹配到条件的所有文档

    db.users.deleteMany({
        _id: ObjectId('623fdddccb580000580013a2')
    })

## 在Node.js中连接MongoDB

    在MongoDB官网下载Node.js的驱动包

    npm init -y 初始化npm包管理
    npm install mongodb 安装mongodb
