---
id: 'Lwg89ajP'
pubDate: '2026-11-13T07:00:00.000Z'
title: 'Небольшой инструмент'
---

Оставить полезные значения, убрать пустые.

```js
const notes = ['first', null, 'next', undefined];
const kept = notes.filter((note) => note != null);

console.log(kept); // ["first", "next"]
```
