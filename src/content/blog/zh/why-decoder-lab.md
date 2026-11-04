---
title: '为什么我做了 Decoder Lab'
subtitle: '致敬密码朋克，再把理念做成可用的小工具'
description: 'Decoder Lab 首先致敬密码朋克对人类自由与隐私的贡献，同时提供本地解码工具和可自定义的资源链接。'
pubDate: '2026-11-04'
heroImage: '../../../assets/blog/default-covers/hacker-02.webp'
tags: ['Cypherpunk', 'Decoder Lab', 'Anglefeint']
---

我做 Decoder Lab，首先是为了致敬密码朋克（Cypherpunk）与数字自由的先行者对全人类的贡献：他们以思想和代码推动加密通信、个人隐私与自由，以及数字货币的发展，让更多人拥有保护信息、自由交流和自主协作的工具。

其次，我希望这份致敬也有实际用途，所以把文本解码、支持的代币调用解析和地址格式检查做成了博客里的小工具；这些处理在浏览器本地完成，不需要连接钱包、API Key 或 RPC，也与主题的终端和网络意象相呼应。

[Decoder Lab](/zh/decoder/) 底部的资源链接全部可以修改，博主可在 `src/site.config.ts` 的 `i18n.locales.<code>.messages.decoderPage.readings.links` 中设置每项的 `title` 和 `href`，替换整份列表或用空数组隐藏，让它成为自己的阅读推荐。
