---
id: 'pJ4FPf5l'
pubDate: '2026-11-12T18:08:59.000Z'
title: '03 · Text, image and code'
---

A green trace from a late-night terminal. This note combines prose, an image and code.

![Pixel character wearing headphones](/images/fragment-demo-edge/avatar-square.png)

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
