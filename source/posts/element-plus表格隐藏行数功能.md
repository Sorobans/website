---
title: element-plus表格隐藏行数功能
date: 2023-07-27 15:42:08
tags: 技术分享
---

![emj](../img/img_1.png)

## 需求背景

如图所示，element-plus中所带的，这些折叠屏折叠行、这些功能可能并不是我们想要的。

最近有一个需求，就是表格如果超出了某行，遍将多余的行数给进行折叠。

那么,有什么办法能够给element-plus添加易于维护的拓展代码吗?

我也自行百度过一番，但是百度上的答案，很明显并不是我想要的。

经过我一番思索，想到了css的序号选择器。序号选择器专门写一个子元素超过3隐藏的类型名。

## CSS样式实现

样式如下：

```css
.el-folding > tr:nth-child(n + 4) {
    display: none;
}
.el-folding-line {
    transition-duration: 200ms;
    cursor: pointer;
    border-bottom: 1px solid var(--el-table-border-color);
}
.el-folding-line:active {
    background-color: #F5F6FB;
}
.el-folding-extends {
    /*cursor: pointer;*/
    transition-duration: 400ms;
}
.el-folding-extends.rotate {
    cursor: pointer;
    transform: rotate(180deg);
}
```

## Vue自定义指令实现

如何让这个功能易于使用和维护，我这里想到了使用vue的自定义指令：

```javascript
// element-table折叠指令
app.directive('elfold', (el, binding) => {
  const elBody = el.querySelector(".el-table__body>tbody")
  const elBodyC = elBody.children
  if (elBodyC.length > 3) {
    // 给表格添加只展示三行的类名
    if (el.querySelector('.rotate')) {
      elBody.classList.remove('el-folding')
    } else {
      elBody.classList.add('el-folding')
    }
    // 判断有没有创建过面板
    const foldingLine = el.querySelector('.el-folding-line')
    if (foldingLine) {
      if (el?.removeElement) {
        el.removeElement(foldingLine)
      }
    }
    if (!foldingLine) {
      // 创建折叠面板元素
      const extendsTop = document.createElement('div')
      extendsTop.className = "flex-ct p5 el-folding-line"
      const extendsTopButton = document.createElement('i')
      extendsTopButton.className = "fa fa-angle-down el-folding-extends"
      extendsTopButton.style.fontSize = "30px"
      extendsTop.append(extendsTopButton)
      el.append(extendsTop)
      // 控制变量
      let controller = true
      extendsTop.addEventListener('click', () => {
        if (controller) {
          extendsTopButton.classList.add('rotate')
          elBody.classList.remove('el-folding')
        } else {
          extendsTopButton.classList.remove('rotate')
          elBody.classList.add('el-folding')
        }
        controller = !controller
      })
    }
  } else {
    elBody.classList.remove('el-folding')
  }
})
```

## 效果展示

诺，最后的效果就如图所示了。

![emj](../img/img_2.png)
![emj](../img/img_3.png)
![emj](../img/img_4.png)
