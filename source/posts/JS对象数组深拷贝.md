---
title: JS对象数组深拷贝
date: 2023-02-08 21:52:20
tags: 技术分享
---

```javascript
/**
 * @param { object } obj
 * @returns { object }
 */
const deepCopy = (obj) => {
  let target = null
  if (typeof obj === 'object') {
    if (Array.isArray(obj)) {
      target = []
      obj.forEach(item => {
        target.push(deepCopy(item))
      })
    } else if (obj) {
      target = {}
      for (const [key, value] of Object.entries(obj)) {
        target[key] = deepCopy(obj[key])
      }
    } else {
      target = obj
    }
  } else {
    target = obj
  }
  return target
}
```
