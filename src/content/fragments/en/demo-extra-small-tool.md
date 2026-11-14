---
id: 'ezNufUbH'
pubDate: '2026-11-13T07:00:00.000Z'
title: 'A small tool'
---

Keep the useful values. Let the empty ones go.

```js
const notes = ['first', null, 'next', undefined];
const kept = notes.filter((note) => note != null);

console.log(kept); // ["first", "next"]
```
