---
title: Vue3学习笔记
date: 2022-06-06
tags:
  - 学习笔记
  - Vue
  - Vue3
categories: 学习笔记
---

# Vue3基础

## Volar

    Vue3版本语法插件

## VueDevtools

    用于对Vue进行调试的工具

## Vite

    vite+ts+vue3
    Vue3项目使用Vite进行构建
    npm install

## ESlint

    Vite打包需要使用ESlint
    npm install eslint  --安装
    npx eslint --init  初始化

## 组合式API

    增强可维护性,可读性
    options API(vue2)
    (因为,配置项的分散,可能导致代码查看复杂)

    组合式API就是将同样功能的API书写在一个位置
    组合式API是代码的一种组合形式

### Setup(组合式API)

    Vue2:
    export default {
        name: App,
        data () {
            return {

            }
        }
    }

    setup () {
        const setupValue = 'setup实例内容'
        return {
            setupValue
        }
    }
    // setup内部不能访问组件实例功能(因为被创建时,Vue实例还没创建)
    // 没有this
    // setup内直接声明,不是响应式数据.无法更改

### ref(响应式API)

    // 按需导入响应式API
    import { ref } from 'vue'
    // 响应式数据声明
    const text = ref('')

    // 使用方法内使用ref声明的响应式数据,需要用
    .value..
    text.value
    text.value = '123'

    // vue@事件调用的方法,也直接写在setup之内

    Vue3解决了Vue2里无法通过数组索引、长度加值的问题(正常js规则)

### reactive

    reactive就是基于传入对象创建Proxy实例
    reactive只能存储对象。(数组,set,obj)
    // 内部做了深度响应式处理.
    // 比如三层嵌套的处理
    // 按需导入响应式API
    import { reactive } from 'vue'

    // 使用reactive
    const dataList = reactive({
    })

    reactive调用值不用加value

### shallowReactive

    使用方法与Reactive方法相似
    但是,并不是深层响应式.只能够响应一层
    {}成员内部的对象或数组无法响应
    obj.a.b = '' (二层数据无法修改)

    (比如多层嵌套之类的结构,就不适合shallow)

### readonly与shallowReadonly

    共同点: 都不是响应式数据

    readonly用于创建对象的只读代理
    深层只读,数据冻结,无法修改.
    cosnt text = readonly({})

    shallowReadonly 用于设置浅只读操作
    只有第一层只读.
    text.a = '' (无法修改)
    text.a.c = '' (能修改)

### 检测方法

    isReactive() // 是否reactive
    isReadonly() // 是否只读
    isProxy() // 是否是isProxy对象

    ref()创建的数据,并不是通过Proxy声明的对象

### toRefs

    toRefs用于将响应式对象转换为普通对象
    且属性均为ref类型

    const { count, str } = toRefs(dataList)

    比如 方法内的响应式数据,返回的值 被引入了,不是响应式的。
    可以直接使用 return toRefs()
    使用结构,把返回的对象,结构为 toRefs值

### toRef

    toRef将响应式对象的某个指定属性转换为ref
    toRefs(obj,key)

### computed

    const count = computed(() => {
        return `物品个数为: ${num.value}`
    })


    如果需要修改计算属性,需要传递对象
    const data = computed({
        get: () => {

        },
        set: value => {

        }
    })

### watch

    const dataList = reactLive({
        count: 0,
        num: 10
    })
    // 侦听器使用
    // 侦听器只能监听ref值,reactive
    // 不能为普通数据(reactive内的值)
    watch(
        dataList,
        (new, old) => {
            // 数据变化要做的事儿
        }
    )
    // 监听对象的值时,新旧值都一致.

#### 侦听多个元

    // 侦听多个元,统一进行一个处理
    watch(
        [d1, d2],
        ([n1, n2], [o1, o2]) => {

        }
    )

#### watch配置项

    // 深度监听
    watch(
        data,
        () => {},
        {
            deep: true
        }
    )
    // 默认执行一次,侦听器事件
    // immediate: true

    // flush
    // 当数据变化之后,再执行watch
    (需要操作DOM时使用)
    flush: 'post'

    //

### watchEffect

    自动对回调内的数据,进行依赖收集的一种侦听器
    watchEffect(() => {
        console.log(`count${a}`)
    })
    // 只要内部使用的数据更新了,就再次执行,更新

### props组件传值

    // 子组件通过defineProps方法来接受值
    const props = defineProps({
        data: String
    })

### emit向父组件传值

    // 声明emit方法,内部选用父组件要用的事件
    const emit = defineEmits(['getHtml'])

    // 调用方法
    emit('getHtml', '123')

### 模板ref

    <!-- 登录的模态框 -->
    <u-top-tips ref="uTips"></u-top-tips>

    setup内:
    // 消息框的ref
    const uTips = ref(null)

    // 方法操作DOM,refs
    uTips.value.show({
    	title: '账号或密码格式错误,请检查',
    	type: 'success',
    	duration: '2300'
    })

### 如何使用全局this对象(element plus)

import { ref, shallowReactive, getCurrentInstance } from 'vue'

const instance = getCurrentInstance()

// 全局this
const \_this= instance.appContext.config.globalProperties

### Vue创建Router

    import { createRouter, createWebHashHistory } from 'vue-router'
    const routes = [
        {
            path: '',
            name: 'loagin',
            components: {
                default: () => import('../views/Login/index.vue')
            }
        }
    ]
    const router = createRouter({
        // 路由模式使用hash
        history: createWebHashHistory(), // Vue3中不叫type了
        routes
    })

export default router

### vue router设置404页面配置

    {
        path: '/:pathMatch(.*)*',
        name: '404',
        components: {
            default: () => import('../views/NotFountd/index.vue')
        }
    }

### 移动端插件

    生产依赖:
    "amfe-flexible": "^2.2.1",
    开发依赖:
    "postcss-pxtorem": "^6.0.0",

    postcss.config.js 配置:
    module.exports = {
        plugins: {
            'postcss-pxtorem': {
                rootValue: 37.5,
                propList: ['*']
            }
        }
    }

    // flexiBle适配rem插件
    import 'amfe-flexible'

    <!-- 全局导入rem.js配置 -->
    (() => {
        const initFontSize = 16
        const sreenWidth = 375
        const clienScreenWidth = window.document.documentElement.clientWidth || sreenWidth
        const newFontSize = initFontSize * (clienScreenWidth / sreenWidth)
            document.documentElement.style.fontSize = newFontSize + 'px'
    })()

#### screenAuto.scss

    <!-- 部分情况js存在兼容问题,使用css多媒体响应会更好 -->
    $sreenWidth: 375;
    $initFontSize: 16;
    @for $i from 320 to 1280 {
        $autoWidth: calc($i/$sreenWidth);
        $newFontSize: ($initFontSize * $autoWidth);
        @media screen and (min-width: $i) {
            :root {
            font-size: $newFontSize + 'px';
            }
        }
    }

### Vue3使用引用组件

script setup

<!-- 直接引入 -->

import xxx from 'xxx'

<!-- 然后书写在template内 -->

### 可选链操作符

    return indexData.swiperBg?.default.imgList.list

    在对象属性后面加上  ?  表示这个对象如果是null || undfined
    不再访问后面的属性了,终止操作。避免程序加载白屏,报错

### vue3组件穿透符

:deep(.van-notice-bar\_\_content) {
display: flex !important;
flex-direction: row;
align-items: center;
}

vue2:
::v-deep .xxx {
}

### JSX接scope插槽内容

    // 表格详情按钮
    const Details = (row) => {
        return (
            <SpcButton onClick={() => openDetails(row.row)} size="small" type="primary">
            详情
            </SpcButton>
        )
    }
    <template #default="scope">
        <Details :row="scope.row"/>
    </template>

## Vue3编写JSX文件组件

### 安装插件

    <!-- vueCli创建的Vue3项目不用安装 -->
    npm install @vue/babel-plugin-jsx -D

    <!-- babel.config.js 配置 -->
    module.exports = {
        presets: [
            '@vue/babel-plugin-jsx'
        ]
    }

### 函数式组件

    const App = (props, context) => (
        <div></div>
    )
    export default App

### 默认导出写法

    export default {
        setup(props,context) {
            const root = ref(null);
            return () => <div ref={root}>1221</div>;
        }
    };
    <!-- 可以在render中返回DOM元素,也可以在render中返回Dom元素 -->
    <!-- setup中需要使用箭头函数来返回 -->
    <!-- setup中访问不到this，但是render中可以通过this访问当前vue实例 -->

### JSX组件样式使用

    <!-- 这种是导入是属于全局导入,使用时最好在加上当前组件的根组件类名 -->
    import '../style/index.css'

#### 模块化组件样式

    <!-- 导入与命名标准 -->
    import style '../style/index.module.css'

    <!-- 使用方式 -->
    <div
    className={style.box}
    ></div>

    <!-- 这种模块化样式, 所有的类名都是同级, 但是样式渲染还是尊重类名嵌套 -->
    <p
    className={style.name}>
        <p className={style.te}>123</p> // 生效
      {props.name}
    </p>
    <p className={style.te}>123</p> // 不生效

### props接收

    通过方法的第一个参数,接收props参数

    setup(props) {}

### emit接收

    通过方法第二个参数接收
    setup(props, { emit })

### 插槽

#### 父组件传递插槽

    const slots = {
      test: () => <div>具名插槽</div>,
      default: () => <div>默认插槽</div>,
    };
    <Mycom
      v-slots={slots}
     />

#### 子组件接收插槽

    setup(props, { slots }) {
        // 子组件
        return () => (
            <div>
                <span>插槽</span>
                {slots.default?.()}
                {slots.test?.()}
            </div>
        );
    },
    <!-- 插槽方法调用里, （） 里填写传递给外面插槽的值. -->

## tiny6富文本配置

    "@tinymce/tinymce-vue": "^5.0.0",
    "tinymce": "^6.0.3",
    const init = {
      language: "zh_CN",
      selector: '#basic-conf',
      // width: 600,
      height: 450,
      plugins: [
        'advlist', 'autolink', 'link', 'image', 'lists', 'charmap', 'preview', 'anchor', 'pagebreak',
        'searchreplace', 'wordcount', 'visualblocks', 'code', 'fullscreen', 'insertdatetime', 'media',
        'table', 'emoticons', 'template', 'help'
      ],
      toolbar: 'undo redo | styles | bold italic | alignleft aligncenter alignright alignjustify | ' +
        'bullist numlist outdent indent | link image | print preview media fullscreen | ' +
        'forecolor backcolor emoticons | help',
      menu: {
        favs: { title: 'My Favorites', items: 'code visualaid | searchreplace | emoticons' }
      },
      menubar: 'favs edit view insert format tools table help',
      content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }',
      // images_upload_url: 'https://api-nj-qa.saicmotor.com/portal/admin/api/sys/upload',
      // images_upload_base_path: '/demo',
      // images_upload_credentials: {
      //   apikey: '5mygeeHyOmgi009fySpukiF8TVLTzapG'
      // }
      /* eslint-disable */
      images_upload_handler: (blobInfo : any, progress : any) => new Promise(async (resolve, reject) => {
        const file = blobInfo.blob()
        const data = await proxy.$commonJs.upFile('/admin/api/sys/upload', file)
        if (data) {
          /* eslint-disable */
          // const imgUrl = require('@/assets/3.jpg')
          <!-- 将返回的url链接加入img -->
          resolve(data)
          <!-- 将blobInfo转换为base64,进行插入img -->
          resolve('data:image/Jpeg;base64,' + blobInfo.base64())
          return
        }
        reject(data)
      })
    }

## 快速遍历对象

    const objKeys = Object.keys(obj)
    objKeys.reduce((target, key) => {
      console.log(obj[key]);
      return target
    }, {})

## 对象数组快排

    const objArry = [
        {
            name: '小王',
            sort: 0
        },
        {
            name: '张三',
            sort: 9
        },
        {
            name: '大狗',
            sort: 2
        }
    ]
    objArry.sort((a, b) => a.sort-b.sort)
    console.log(objArry);

## html导出pdf和图片

    const exposePdf = () => {
        nextTick(() => {
            const domElement = pdfExposeRef.value
            html2canvas(domElement, {useCORS: true}).then((canvas) => {
            // pdf导出
            document.body.innerHTML = ''
            document.body.appendChild(canvas)
            // pdf导出高度
            document.body.style.height = canvas.height + 'px'
            window.print()
            location.reload()
            // 导出图片
            // const img = canvas.toDataURL('image/png')
            // const a = document.createElement('a');
            // a.href = img;
            // a.download = `地块巡检导出${dayjs().format('YYYY-MM-DD')}.png`;
            // document.body.appendChild(a);
            // a.click();
            // pdf方案2
            const pdf = new jsPdf({
                unit: 'px'
            })
            pdf.addImage(canvas, 'JPEG', 0, 0, canvas.width * 0.5, canvas.height * 0.5)
            pdf.save('巡检报告导出.pdf')
            })
        })
    }
