---
id: '8tBRmhEw'
pubDate: '2026-11-13T07:00:00.000Z'
title: 'Una pequeña herramienta'
---

Conservar los valores útiles. Dejar pasar los vacíos.

```js
const notes = ['first', null, 'next', undefined];
const kept = notes.filter((note) => note != null);

console.log(kept); // ["first", "next"]
```
