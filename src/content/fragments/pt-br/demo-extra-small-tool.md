---
id: '2ovIWDyo'
pubDate: '2026-11-13T07:00:00.000Z'
title: 'Uma pequena ferramenta'
---

Guardar os valores úteis. Deixar os vazios para trás.

```js
const notes = ['first', null, 'next', undefined];
const kept = notes.filter((note) => note != null);

console.log(kept); // ["first", "next"]
```
