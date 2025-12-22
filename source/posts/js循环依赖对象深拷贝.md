---
title: js循环依赖对象深拷贝
date: 2023-03-07 13:37:26
tags: 技术分享
---

## 循环依赖示例

```javascript
let a = {}
let b = { a }
a.b = b
```

## 经验分享

这样的循环依赖的对象，需要每次递归的时候保留上一次递归的层级。
并判断这次递归的内容中，有没有上一次的内容。
如果有的话，就直接返回上一次的内容就行了。中断了递归。

## 代码实现

```javascript
/**
 * @param { object } obj
 * @returns { object }
 */
const deepCopy = (obj, stack = []) => {
  let target = null
  if (typeof obj === 'object') {
    if(stack.includes(obj)) {
      return obj
    } else {
      stack.push(obj)
    }
    if (Array.isArray(obj)) {
      target = []
      obj.forEach(item => {
        target.push(deepCopy(item, stack))
      })
    } else if (obj) {
      target = {}
      for (const [key, value] of Object.entries(obj)) {
        target[key] = deepCopy(obj[key], stack)
      }
    } else {
      target = obj
    }
  } else {
    target = obj
  }
  return target
}
export default deepCopy
```
