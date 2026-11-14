---
id: 'ai9xCOO4'
pubDate: '2026-11-13T07:00:00.000Z'
title: '小さな道具'
---

役立つ値を残し、空の値は手放す。

```js
const notes = ['first', null, 'next', undefined];
const kept = notes.filter((note) => note != null);

console.log(kept); // ["first", "next"]
```
