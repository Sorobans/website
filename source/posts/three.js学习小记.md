---
title: three.js学习小记
date: 2022-12-15
tags:
  - 学习笔记
  - WebGL
  - three.js
categories: 学习笔记
---

# three.js文档

    官方文档地址: https://github.com/mrdoob/three.js
    clone后在本地进行搭建

# Parcel打包工具

## 为什么使用

    急速配置的一个开发

## 安装打包工具

    https://parceljs.org/getting-started/webapp/

## 配置打包路径

    "scripts": {
      "dev": "parcel src/index.html",
      "build": "parcel build src/index.html"
    },

## 安装打包依赖

    npm i parcel-bundler --save-dev

## 安装three.js

    npm i three --save

# Three.js渲染要素

## 创建场景

    // 1.创建场景
    const scene = new THREE.Scene()

## 创建相机

    // 2.创建相机-透视相机
    const camera = new THREE.PerspectiveCamera()

### 透视相机

    // 透视相机特点
    // 视锥体,在视锥体范围内才能被渲染

### 创建几何体

    // 创建几何体
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
    // 基础网格材质
    const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 })
    // 根据几何体和材质,创建物体
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)

### 轨道控制器

    相机只有使用控制器才能够运动起来,在场景中通过不同的角度观看物体
    const controls = new OrbitControls(camera, render.domElement)
    // 设置轨道控制器惯性
    controls.enableDamping = true

    需要在每帧动画中对控制器进行更新
    controls.update()

### H5动画帧监听函数

    每帧动画都会自动调用其参数进行回调.
    // 每帧,把函数传进去让其进行回调
    requestAnimationFrame(renderFun)
    // 每帧对webgl动画进行重新渲染。

### 案例

    // 导入Three.js

    import * as THREE from 'three';
    // console.log(THREE);

    // 导入轨道控制器

    import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

    // 目标: 了解three.js最基础的内容

    // 2.目标: 使用控制器查看3d物体

    // 1.创建场景

    const scene = new THREE.Scene()

    // 2.创建相机-透视相机

    // 透视相机特点

    // 视锥体,在视锥体范围内才能被渲染

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

    // 设置相机x,y,z轴的坐标

    camera.position.set(0, 0, 10)

    // 添加相机到场景中

    scene.add(camera)

    // 添加物体

    // 创建几何体

    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)

    // 基础网格材质

    const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 })

    // 根据几何体和材质,创建物体

    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)

    // 将几何体添加进场景

    scene.add(cube)

    // 初始化渲染器

    const render = new THREE.WebGLRenderer()

    // 设置渲染器尺寸大小

    render.setSize(window.innerWidth, window.innerHeight)

    // 将渲染器添加到body中

    document.body.appendChild(render.domElement)

    // 使用渲染器,通过相机将场景渲染进来

    // render.render(scene, camera)

    // 创建轨道控制器

    // 参数: 相机, 渲染器

    const controls = new OrbitControls(camera, render.domElement)

    // 设置渲染函数

    const renderFun = () => {

      render.render(scene, camera)

      console.log('渲染了');

      // 每帧,把函数传进去让其进行回调

      requestAnimationFrame(renderFun)
    }
    renderFun()

# 坐标辅助器

    // 添加坐标轴辅助器

    // 红: x 绿: y, 蓝: z

    // 参数传size 辅助线长度

    const axesHelperr = new THREE.AxesHelper(5)
    scene.add(axesHelperr)

## 要素

    坐标轴辅助器和相机一样，其实也是存在于场景中的物体.

    都是要用过add方法,添加进场景内。

# 三维向量

## 获取三维向量

    物体.positon

## 设置三维向量

    物体.positon.set(x, y, z)

### 只更改某个坐标

    物体.position.x = 5
    物体.position.y = 5
    物体.position.z = 5

# 物体的缩放与渲染

## 缩放

    对物体xyz进行缩放

    物体.scale.set(3, 2, 1)

    也可以和坐标一样进行单独设置

## 旋转

    对几何体进行旋转
    cube.rotation.set(Math.PI / 4 , 0, 0)

# 处理动画帧

## 为什么会时快时慢?

    requestAnimationFrame()

    此函数在每一帧进行渲染，但是由于不同显示设备，刷新率并不相同。

    所以,会出现在不同的设备上,动画的速度并不相同。

## 帧时间

    requestAnimationFrame(fun)

    此方法回调参数时，回调方法时会给参数回调一个参数

    此参数为帧时间(第一次执行该函数开始计时)

## 获取帧比例

    通过帧时间 / 1000(一秒的毫秒数) 得到帧比例
    const toValue = (time / 1000) % 5
    帧比例乘以每秒应该走的步数
    cube.rotation.x = (toValue * 1)
    cube.position.x = (toValue * 1)

# 通过Clock跟踪时间处理动画

## 创clock对象

    设置时钟
    const clock = new THREE.Clock()

## 通过方法获取时间

    获取这次与上次更新时间的间隔时间(此方法也会导致时间更新,所以写在总时长前面)
    const deltaTime = clock.getDelta()
    获取时钟运行的总时长(获取一次就更新一次时间)
    const time = clock.getElapsedTime()

    都是按照秒数计时
    不需要除以1000, 换算出帧比例

# Gsap动画库的使用

## 安装

    文档: https://greensock.com/docs/
    npm install gsap

## 设置动画

    // 设置动画
    gsap.to(cube.position, { x: 5, duration: 5 })
    第一个参数为需要设置的对象,
    第二个为对象的属性变化与经历的时间

## 设置动画曲线

    通过 第二个参数传入的对象, 添加ease属性进行控制动画曲线
    gsap.to(cube.position, { x: 5, duration: 5, ease: "power1.inOut" })

## 完成动画回调

    gsap.to(cube.position, {
        x: 5, duration: 1, ease: "power1.inOut",
        onComplete: () => {} // 完成动画的回调函数
    })

## 动画开始回调

    gsap.to(cube.position, {
        x: 5, duration: 1, ease: "power1.inOut",
        onStart: () => {} // 开始动画的回调函数
    })

## 设置动画重复次数

    通过repeat属性可以设置动画的额外重复次数
    无限次: -1
    gsap.to(cube.position, { x: 5, duration: 1, ease:       "power1.inOut",
        repeat: 2, // 重复次数
        onComplete: () => {
            console.log('动画完成');
        },
        onStart: () => {
            console.log('动画开始');
        }
    })

## 设置往返运动

    通过yoyo属性可以设置动画的往返, 一来一回默认为一次动画。
    { yoyo: true }

## 动画延迟

    通过delays属性可以设置延迟多少秒后,触发该动画
    { delay: 2, }

## 动画暂停

    将动画对象构造方法，返回的对象存储在变量中后。
    可以使用 pause 方法对对象进行一个暂停
    const animate1 = gsap.to(cube.position, { x: 5, duration: 1, ease: "power1.inOut",
        repeat: 2,
        yoyo: true,
        delay: 2,
        onComplete: () => {
            console.log('动画完成');
        },
        onStart: () => {
            console.log('动画开始');
        }
    })
    // 对动画进行暂停
    animate1.pause()

## 动画开始

    将动画对象构造方法，返回的对象存储在变量中后。
    可以使用 resume 方法对对象进行一个继续运动
    animate1.resume()

## 获取动画运行状态

    将动画对象构造方法，返回的对象存储在变量中后。
    可以使用 isActive 方法获取动画的运行状态
    animate1.isActive()

# 监听windows大小变化进行更新

    // 更新摄像头的宽高比
    camera.aspect = window.innerWidth / window.innerHeight
    // 更新摄像机的投影矩阵(宽高比变化了,矩阵也需要更新)
    camera.updateProjectionMatrix();
    // 更新渲染器的宽高比
    render.setSize(window.innerWidth, window.innerHeight)
    // 设置渲染器的像素比DPI
    render.setPixelRatio(window.devicePixelRatio)

# 使用js-API控制画布全屏

## 全屏对象

    document.fullscreenElement
    这个DOM对象是表示被全屏展示的某个元素。
    一般默认为null，当某个元素被设置为全屏后。
    此元素为被设置为全屏的元素。

## 为DOM设置为全屏

    通过requestFullscreen()方法,可为DOM对象设置为全屏显示
    // 为画布设置为全屏
    render.domElement.requestFullscreen()

## 退出全屏

    document.exitFullscreen()

# Three-GUI属性控制器

## 安装

    npm install dat.gui

## 导入

    import * as dat from 'dat.gui'

## 创建GUI控制器

    const gui = new dat.GUI()

## 添加GUI数值控制属性

    // 添加的属性为int则为数值控制器
    // x坐标是否显示
    gui.add(cube.position, "x")
    .min(0) // 最小范围值
    .max(5) // 最大范围值
    .step(0.1) // 调整的步幅
    .name('x轴')  // 自定义属性名称
    .onChange((value) => {
        // 通过回调获取被修改的属性值
        console.log(value)
    })
    .onFinishChange((value) => {
        console.log('完全停下来');
    })

## 添加GUI颜色控制器

    // 为物体材质的颜色属性,添加控制器
    const params = {
        color: '#fff'
    }
    gui.addColor(params, 'color')
    .onChange(value => {
        cube.material.color.set(value)
    })
    .name('颜色')

## 添加GUI勾选控制器

    // 添加的属性为布尔值,则为勾选控制器

    // 是否显示
    gui.add(cube, 'visible')
    .name('是否显示')

    // 添加线框控制器
    cubeFolder.add(cube.material, 'wireframe')
    .name('是否为线框')

## 添加GUI功能控制器

    // 如果添加的属性为函数类型,则为功能控制器
    const params = {
        color: '#fff',
        fn: () => {
        if (animate1.isActive()) {
            // 暂停
            animate1.pause()
        } else {
            // 恢复
            animate1.resume()
        }
        }
    }
    gui.add(params, 'fn')
    .name('控制暂停')

## 添加GUI折叠文件夹

    // 设置立方体文件夹
    const cubeFolder = gui.addFolder('几何体属性')

### 为文件夹添加控制属性

    // 设置选择是否显示
    cubeFolder.add(cube, 'visible')

# 几何体

## 什么是几何体

    点线面构成了我们的几何体

## 什么是顶点

    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
    cubeGeometry.attributes.positon属性是几何体的顶点。
    一个面一共有四个顶点,所以正方形几何体有24个顶点。
    每个顶点都有自己的坐标,所以顶点坐标一共有72个

## uv

    设置uv,用于材质包裹住几何体。知道平面材质,对应着几何体的那些顶点。
    能够顺利地给几何体上色。

## 法向属性

    法向用于计算光的反射的角度。是当前面的朝向。

# 缓冲几何体

## 创建缓冲区几何体

    const geometry = new THREE.BufferGeometry()

## 创建顶点坐标

    const geometryVertices = Float32Array([
        -1.0, -1.0, 1.0,
        1.0, -1.0, 1.0,
        1.0, 1.0, 1.0
    ])

## 为缓冲几何体设置顶点坐标

    geometry.setAttribute('position', new THREE.BufferAttribute(geometryVertices, 3))

## 通过缓冲几何体创建物体

    const mesh = new Mesh(geometry, cubeMaterial)
    scene.add(mesh)

## 材质透明度

    创建材质时可以使用,transparent,opacity两个属性，对材质设置透明度
    const randomMaterial = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.5 })

## 创建材质颜色

    const color = new THREE.Color(Math.random(), Math.random(), Math.random())

    rbg颜色需要 除以 255。因为, Three的color范围为0-1。

# 常用网格几何体

## 立方缓冲几何体

    const geometry = new THREE.BoxGeometry(1, 1, 1)

## 圆形缓冲几何体

    const geometry = new THREE.CircleGeometry(5, 32)

    顶点越多圆形越圆,但是对性能消耗越大(圆形是由多个三角形构成)

## 圆锥缓冲几何体

    const geometry = new THREE.ConeGeometry(5, 20, 32)

## 圆柱缓冲几何体

    const geometry = new THREE.CylinderGeometry(5, 5, 20, 32)

## 十二面缓冲几何体

    const geometry = new THREE.DodecahedronGeometry(radiu, detail)

## 边缘几何体

    可以作为一个辅助对象来查看geometry的边缘
    const edge = new THREE.EdgesGeometry(5, 5, 20, 32)

## 挤压缓冲几何体

    从一个形状路径中，挤压出一个BufferGeometry
    const geometry = new THREE.ExtrudeGeometry(5, 5, 20, 32)

## 二十面缓冲几何体

    差THREE.JS手册

## 车削缓冲几何体

    const geometry = new THREE.LatheGeometry(points)

## 八面缓冲几何体

## 参数化缓冲几何体

    生成由参数表示其表面的几何体

## 平面缓冲几何体

    const geometry = new THREE.PlanGeometry(1, 1)

## 多面缓冲几何体

    const geometry = new THREE.PolyhedronGeometry(verticesOfCube, indicesOfFaces, 6, 2)

## 圆环缓冲几何体

    const geometry = new THREE.RingGeometry(1, 5, 32)

## 形状缓冲几何体

    const geometry = new THREE.ShapeGeometry(1, 5, 32)

## 球缓冲几何体

    const geometry = new THREE.SphereGeometry(15, 32, 16)

## 四面缓冲几何体

    TetrahedronGeometry 见官网

## 文本缓冲几何体

    TextGeometry 见官网

## 圆环缓冲几何体

    TorusGeometry 圆环缓冲几何体

## 圆环缓冲扭结几何体

    TorousKnotGeometry 见官网

## 管道缓冲几何体

    TubeGeometry 见官网

## 网格几何体

    这个类可以作一个辅助物体,来对geometry以线框的形式进行查看

# 材质与纹理

## 基础网格材质

    MeshBasicMaterial
    一种以简单着色,平面或线框方法来绘制几何体的材质
    这种材质不受光照的影响

## 贴图纹理

    // 创建纹理加载器
    const textureLoader = new THREE.TextureLoader()

    // 加载贴图纹理
    const fameleLuNa = textureLoader.load('./102610940_p0_master1200.jpg')

    // 创建材质时加载贴图
    const basicMaterial = new THREE.MeshBasicMaterial({ color: '#fff', map: fameleLuNa })

### 纹理偏移

    // 导入纹理
    const textureLoader = new THREE.TextureLoader()

    // 加载贴图纹理
    const fameleLuNa = textureLoader.load('./102610940_p0_master1200.jpg')

    // 对贴图纹理进行操作
    fameleLuNa.offset.x = 0.5

### 纹理旋转

    // 纹理旋转
    fameleLuNa.rotation = Math.PI / 4

    // 旋转45度，一个π为180度

### 设置中心点

    // 设置纹理的中心点
    fameleLuNa.center.setX(0.5)
    fameleLuNa.center.setY(0.5)

### 纹理重复

    // 设置纹理重复模式,为贴图复制
    fameleLuNa.wrapS = THREE.RepeatWrapping // X重复
    fameleLuNa.wrapT = THREE.RepeatWrapping // Y重复
    // 重复值默认为拉伸边缘重复。
    // THREE.MirroredRepeatWrapping 镜像复制重复

    // 设置纹理是否重复
    fameleLuNa.repeat.set(10, 10)

### 纹理显示算法

    fameleLuNa.minFilter = THREE.NearestFilter
    fameleLuNa.magFilter = THREE.NearestFilter

    // 设置为最接近纹理像素，而非线性模糊

### 纹理透明

    // 创建基础网格材质
    const basicMaterial = new THREE.MeshBasicMaterial({ color: '#fff', map: fameleLuNa, transparent: true, alphaMap: fameleLuNa })

    // transparent: true
    创建材质时，此参数表示材质是否允许透明。

    // alphaMap: fameleLuNa
    表示灰度贴图,开启允许材质透明后,会根据这张贴图的灰度对图片进行透明。(黑色为完全透明,白色完全不透明,灰色半透明)

### 纹理渲染面

    在创建纹理时,通过side属性,进行设置渲染一面还是两面.

    默认只渲染一面，为了节省性能。

    THREE.DoubleSide // 渲染两面

### 环境光遮挡

    导入环境光贴图后
    在材质创建时,添加aoMap属性,可以创建环境光贴图。通常需要给几何体添加第二组UV
    aoMap: 环境光贴图

    // 设置环境光UV
    planeGeometry.setAttribute('uv2', new THREE.BufferAttribute(planeGeometry.attrtbutes.uv.array, 2))

    (黑色表示加重阴影,白色为正常。)

#### 强度

    aoMapIntensity (0-1) 在创建材质时,可以设置此属性值,来调整环境光的遮挡强度。
    (前提得有环境光遮挡贴图)

# PBR物理渲染

## 什么是PBR

    基于物理渲染
    以前的渲染是在模仿光的外观
    现在是在模仿光的实际行为
    使图形看起来更真实。

## PBR的组成部分

### 灯光属性

    直接照明、间接照明、直接高光、阴影、环境光闭塞

#### 光线类型

##### 入射光

    直接照明、间接照明

##### 反射光

    镜面光、漫发射

### 表面属性

    基础色、法线、高光、粗糙度、金属度

#### 光与表面相互作用类型

##### 直接漫反射

    从源头到四面八方，散发出来的高光

##### 直接高光

    直接来自光源被集中反射的光

##### 间接漫反射

    来自环境的光被表面散射的光

##### 间接高光

    来自环境并被集中反射的光

##### 镜面反射

    来自环境哥哥方向的光。
    反射在一个更集中的方向上
    引擎中使用反射镜头，平面反射，SSR，或涉嫌追踪计算

## 基础色

    定义表面的漫反射颜色
    真实世界材料不会比20暗或者比240 srgb亮
    粗糙表面具有更高的最低 50srgb
    超出范围的值不能正确发光，所以保持在范围内是至关重要的。

    基础色贴图制作注意点:
    不包括任何照明或阴影
    基本颜色纹理应该看起来应该非常平坦

## 法线

    定义曲面的形状每个像素代表一个矢量
    该矢量指向表面所面对的方向即使网格是完全平坦的
    法线贴图会使表面显得凹凸不平
    用于添加表面形状的细节，这里三角形是实现不了的。
    因为他们表示矢量数据，所以法线贴图是无法手工绘制的。

## 镜面

    用于直接和间接镜面照明的叠加
    当直视表面时，定义反射率
    非金属表面反射越4%的光
    0.5代表4%的反射

## 粗糙度

    越粗糙，漫反射就越厉害。
    越光滑，镜面反射就越强。

## 金属度

    两个不同的着色器通过金属度混着他们
    基本色变成高光色，而不是漫反射。
    金属漫反射是黑色的
    在底色下，镜面范围可达100%
    大多数金属的反光性在60%-100%之间
    确保金属颜色值使用真实世界的测量值，并保持他们明亮
    当金属为1时，镜面输入值将被忽略

## 非金属与金属对比

### 非金属

    基础颜色=漫反射
    镜面反射=0-8%

### 金属

    基础颜色= 0-100%的镜面反射
    镜面=0%
    漫反射总是黑色的

## 总结

    PBR是基于物理渲染的着色模型，PBR着色模型分为材质和灯光两个属性
    材质部分由: 基础色、法线、高光、粗糙度、金属度来定义材质表面属性的
    灯光部分是由: 直接照明、间接照明、直接高光、阴影、环境光闭塞来定义照明属性的
    通常我们写材质的时候只需要光柱材质的部分属性即可，灯光属性都是引擎定义好的直接使用即可。
    PBR渲染模型不但指的是PBR材质，还有灯光，两者缺一不可。

# 标准网格材质与光照物理效果

    const gridMatery = new THREE.MeshStandardMaterial({
        color: '#fff',
        displacementMap: textureLoad.load('./textTexre/textTexreAuto.jpg'),
        displacementScale: 0.1,
        roughnessMap: textureLoad.load('./textTexre/roughnessMap.jpg'),
        map: textureLoad.load('./textTexre/textTexre.jpg'),
        metalness: 0.3
    })

## 介绍

    一种基于物理渲染标准的材质
    这种方法与旧方法不同之处在与,不使用近似值来表示光与表面的作用,而是使用物理上的正确的模型。

    这种材质的代价是计算成本更高。

## 环境光

    const ambientLight = new THREE.AmbientLight('#fff', 1)

    // 参数: 光源色, 光源强度

## 置换贴图

    根据颜色对对应高度进行设置。
    黑色为不移动顶点,白色贴图会对面的顶点进行操作。
    新建材质时,使用 displacementMap 属性为材质添加置换贴图。
    使用置换贴图时,几何体的顶点应该充足,不然效果不明显。或者不好。

    通过 displacementScale 属性可以设置置换贴图顶点突出的最大比例

## 粗糙度贴图

    通过 roughness 属性可以对材质的粗糙度进行设置。

    通过 roughnessMap 属性使用粗糙度贴图对粗糙度进行设置
    黑色为光滑, 白色为粗糙

## 金属度贴图

    通过 metalness 属性设置金属度

    通过 metalnessMap 来设置材质的金属度贴图。

## 法线贴图

    通过 normalMap 属性来为材质设置法线贴图

    法线贴图用于设置光线反射程度，能够让物体更好地有着立体的效果。

# 如何获取贴图

    poliigon网站是一个贴图资源网站
    https://www.poliigon.com/

    通过Quixel Bridge软件下载贴图资源

# 获取贴图加载进度

    textureLoad.load('./textTexre/textTexreAuto.jpg', (event) => {
        console.log(event, '加载完成');
    }, (event) => {
        console.log(event, '进度');
    })

## 加载管理器

    用户管理贴图的加载、以及模型的加载

    // 设置加载管理器
    const loadingManger = new THREE.LoadingManager(() => {
        // onLoad 完成
    }, (url, num, total) => {
        // pregress 进度
    }, (error) => {
        // error 错误
    })

    // 创建贴图管理器时传入加载管理器
    const textureLoader = new THREE.TextureLoader(loadingManger)

# 环境贴图

## 创建环境贴图加载器

    const cubeLoader = new THREE.CubeTextureLoader()
    const envMapTexture = cubeLoader.load([
        '各个面的贴图'
    ])

    在创建材质时,使用 envMap 属性来加载环境贴图

# 经纬线映射贴图(HDR全景贴图)

    // 给场景添加背景
    scene.background = envTexture
    // 给场景所有的物体添加默认的环境贴图
    scene.environment = envTexture

## 什么是HDR

    HDR是高动态范围显示的一种技术。

### 数据加载器

    DataTextureLoader 数据加载器。
    用于加载二进制文件格式的rgbe, hdr的抽象类。
    import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
    const rgbeloader = new RGBELoader()
    rgbeloader.loadAsync('./hdr/HdrOutdoorResidentialRiverwalkAfternoonClear001_HDR_2K.hdr')
    .then((texture) => {
        texture.mapping = THREE.EquirectangularRefractionMapping
        scene.background = texture
        scene.environment = texture
    })

# 灯光与阴影的关系

## 平行光

    平行光是沿着特定方向发射的光。这种光的表现是无限远，从它发出的观想都是平行的。

## 点光源

    类似于灯泡发出的光

## 聚光灯

    光线沿着一个方向射出, 类似于圆锥形，类似于手电筒发出的光。

## 平面光源

    平面光源从一个矩形平面，均匀的发射出的光线，用于模拟明亮的窗户。

## Lambert网格材质

    一种非光泽表面的材质, 没有镜面的高光。用于拟造木材。

## Phong网格材质

    用于模拟光泽度更高的物体

## 物理网格材质

    MeshPhysicalMaterial
    比标准网格材质更加逼真，但是会消耗更多的材质。

    平常还是使用标准网格材质更多。

## 灯光阴影

    材质要满足能够对光照有反应
    设置渲染器开启阴影的计算
    设置光照投射阴影
    设置物体投射阴影
    设置物体接受阴影

### 开启阴影计算

    // 开启渲染器阴影计算
    render.shadowMap.enabled = true

### 设置光照投射阴影

    // 给平行光设置光照投射阴影
    directionalLight.castShadow = true

### 设置物体投射阴影

    // 给物体设置投射阴影
    sphere.castShadow = true

### 设置物体接受阴影

    // 给平面设置接收阴影
    plane.receiveShadow = true

# 平行光与阴影属性

## 阴影模糊度

    // 设置光源设置阴影贴图模糊度
    directionaLight.shadow.radius = 20;
    // 设置阴影贴图分辨率
    directionaLight.shadow.mapSize.width = 1024;
    diretionaLight.shadow.mapSize.height = 1024

## 平行光相机投射属性

    // 设置相机投影距离
    directionaLight.shadow.camera.neer = 0.5;
    directionaLight.shadow.camera.far = 0.5;
    directionaLight.shadow.camera.top = 0.5;
    directionaLight.shadow.camera.bottom = 0.5;
    directionaLight.shadow.camera.left = 0.5;
    directionaLight.shadow.camera.right = 0.5;

    // 更新相机投影矩阵。
    directionaLight.shadow.camera.updateProjectionMatrix()

# 详解聚光灯属性

    光线从一个点，沿一个方向射出。如同手电筒一般的光。

## 聚光灯

    // 创建聚光灯
    const spotLight = new THREE.SpotLight(0xffffff, 0.5)

## 设置聚光灯目标

    spotLight.target = 物体

## 设置聚光灯开合角度大小

    spotLight.angle = Math.PI / 6

## 设置聚光灯透视相机

    // 设置光源衰减最大距离(0为不衰减)
    spotLight.distance = 0
    // 设置聚光灯半影衰减(0 - 1)
    spotLight.penumbra = 0
    // 沿着光照距离衰减量(默认为1, 2为显示光衰减)
    spotLight.decay = 1
     (需要给渲染器设置为物理渲染模式)
     render.physicallCorrectLights = true
    // 设置灯光亮度
    spotLight.intensity = 2

# 详解点光源与应用

## 点光源

    类似于萤火虫，繁星点点。

## 创建点光源

    // 创建点光源
    const pointLight = new THREE.PointLight('#fff', 1)
    // 设置光照投射阴影
    pointLight.castShadow = true
    // 设置光源衰减最大距离(0为不衰减)
    spotLight.distance = 0
    // 沿着光照距离衰减量(默认为1, 2为显示光衰减)
    spotLight.decay = 1
    (需要给渲染器设置为物理渲染模式)
    render.physicallCorrectLights = true

## 把光源添加到物体上

    smallBox.add(pointLight)

# 初识Points与点材质

## 创建点材质

    // 创建点材质
    const pointMaterial = new THREE.PointsMaterial()
    // 创建Points物体
    const points = new THREE.Points(几何体, pointMaterial)

## 设置点材质大小

    pointMaterial.size = 0.1

## 设置是否因相机深度而衰减

    // 设置因距离而衰减点大小为否。
    pointMaterial.sizeAttenuation = false

## 设置材质纹理

    pointMaterial.map = texture

## 设置透明贴图

    pointMaterial.alphaMap = texture
    // 允许透明
    pointMaterial.transparent = true

## 设置深度缓冲区

    // 设置深度缓冲区不影响
    pointMaterial.depthWrite = false

## 设置材质混合叠加模式

    pointMaterial.blending = THREE.AdditiveBlending

## 材质启动顶点着色

    pointMaterial.vertexColors = true

# 颜色混合

    color.lerp('用于收敛的颜色', '0-1表示范围')

# 光线投射
