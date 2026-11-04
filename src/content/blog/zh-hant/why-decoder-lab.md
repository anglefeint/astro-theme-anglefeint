---
title: '為什麼我做了 Decoder Lab'
subtitle: '致敬密碼龐克，再把理念做成實用工具'
description: 'Decoder Lab 首先致敬密碼龐克對人類自由與隱私的貢獻，再提供本機解碼與可自訂資源連結。'
pubDate: '2026-11-04'
heroImage: '../../../assets/blog/default-covers/hacker-02.webp'
tags: ['Cypherpunk', 'Decoder Lab', 'Anglefeint']
---

我做 Decoder Lab，首先是為了致敬密碼龐克（Cypherpunk）與數位自由先行者對全人類的貢獻：他們以思想和程式碼推動加密通訊、個人隱私與自由，以及數位貨幣的發展，讓更多人擁有保護資訊、自由交流與自主協作的工具。

其次，我希望這份致敬也有實際用途，因此把文字解碼、支援的代幣呼叫解析與位址格式檢查做成部落格裡的小工具；處理在瀏覽器本機完成，不需要連接錢包、API Key 或 RPC，也呼應主題的終端機與網路意象。

[Decoder Lab](/zh-hant/decoder/) 底部的資源連結全部可以修改，在 `src/site.config.ts` 的 `i18n.locales.<code>.messages.decoderPage.readings.links` 設定每項的 `title` 與 `href`，即可替換整份清單或用空陣列隱藏，整理自己的閱讀推薦。
