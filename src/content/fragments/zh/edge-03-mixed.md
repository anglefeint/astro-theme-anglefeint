---
id: 'pJ4FPf5l'
pubDate: '2026-11-12T18:08:59.000Z'
title: '03 · 文字、图片和代码'
---

夜里的终端留下一点绿色。图片后面还有代码，预览里应该能同时认出它们。

![戴耳机的像素人物](/images/fragment-demo-edge/avatar-square.png)

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
