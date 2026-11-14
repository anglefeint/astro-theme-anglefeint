---
id: 'n7wDnXJ0'
pubDate: '2026-11-13T07:00:00.000Z'
title: 'Ein kleines Werkzeug'
---

Die nützlichen Werte behalten. Die leeren weglassen.

```js
const notes = ['first', null, 'next', undefined];
const kept = notes.filter((note) => note != null);

console.log(kept); // ["first", "next"]
```
