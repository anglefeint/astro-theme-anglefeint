---
title: 依路由設計視覺系統
subtitle: 不同閱讀階段，各有氛圍。
description: 不同閱讀階段，各有氛圍。
pubDate: '2026-03-03'
heroImage: ../../../assets/blog/default-covers/cyber-02.webp
aiModel: anglefeint-core
aiMode: analysis
aiState: stable
updatedDate: '2026-11-14'
---

讀者在不同頁面做不同的事，因此路由有各自的氛圍：

- 首頁：Matrix，建立第一印象。
- Blog List 與標籤：Cyberpunk，發現內容。
- 文章詳情：AI，聚焦長文閱讀。
- About：Hacker，介紹作者與工具。
- Fragments：Cyberpunk 的內容瀏覽氛圍。
- Decoder Lab：本機解碼工具與網路背景。

預設首頁帶語言前綴，`/` 轉向預設語言首頁，初始為 `/en/`。`defaultLocalePrefix: 'never'` 只改變該首頁的位置，其他路由仍帶語言前綴。

About、Decoder、標籤和 Fragments 各有開關；Fragments 預設關閉。具體欄位放在設定字典查閱。

延伸閱讀：[Anglefeint 架構：以四層組合兼顧維護與重用](/zh-hant/blog/architecture-of-anglefeint/) · [設定字典：語言啟停、地址、介面翻譯和回退](/zh-hant/blog/config-languages/)
