---
id: 'HXKeCkjS'
pubDate: '2026-11-13T07:00:00.000Z'
title: '작은 도구'
---

유용한 값은 남기고, 빈 값은 놓아준다.

```js
const notes = ['first', null, 'next', undefined];
const kept = notes.filter((note) => note != null);

console.log(kept); // ["first", "next"]
```
