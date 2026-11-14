---
id: 'O4kZhuxr'
pubDate: '2026-11-13T07:00:00.000Z'
title: '一個小工具'
---

留下有用的值，讓空缺自然離開。

```js
const notes = ['first', null, 'next', undefined];
const kept = notes.filter((note) => note != null);

console.log(kept); // ["first", "next"]
```
