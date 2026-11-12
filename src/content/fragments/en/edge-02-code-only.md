---
id: 'xpZn3yIu'
pubDate: '2026-11-12T18:09:59.000Z'
title: '02 · Code only, with indentation'
---

```js
const signal = {
  source: 'matrix',
  preview: true,
};

function receive(message) {
  if (!message) return;
  console.log('received', message);
}

receive(signal);
```
