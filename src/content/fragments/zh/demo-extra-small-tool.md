---
id: 'Nm9CbnOK'
pubDate: '2026-11-13T07:00:00.000Z'
title: '一个小工具'
---

留下有用的值，让空缺自然离开。

```js
const notes = ['first', null, 'next', undefined];
const kept = notes.filter((note) => note != null);

console.log(kept); // ["first", "next"]
```
