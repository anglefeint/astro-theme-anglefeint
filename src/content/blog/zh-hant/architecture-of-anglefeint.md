---
title: Anglefeint 架構：以四層組合兼顧維護與重用
subtitle: ThemeFrame → Shell → Layout → Page
description: ThemeFrame → Shell → Layout → Page
pubDate: '2026-03-03'
heroImage: ../../../assets/blog/default-covers/ai-02.webp
aiModel: anglefeint-core
aiMode: analysis
aiState: stable
aiLatencyMs: 168
aiConfidence: 0.96
updatedDate: '2026-10-03'
---

我們先決定架構，再打磨視覺。結構不清楚，每增加一個功能就會更昂貴。

- ThemeFrame：共用框架與全域頁面外殼。
- Shell：路由氛圍與視覺包裝。
- Layout：頁面結構的組合。
- Page：內容與路由資料。

這讓樣式與內容能獨立演進。共用實作放在 @anglefeint/astro-theme，starter 保留內容與設定。相容的更新可透過套件進行，減少手動複製與合併衝突。

site.config.ts 集中使用者設定，介接檔則維持產生或同步，讓只想穩定發布的人不必在散落檔案中尋找選項。

實際收益包括輕量頁面、只在需要處附加行為、視覺與路由及內容之間的低耦合，以及可用於新頁面的共用元件。

表層保有創作表達，底層維持運作穩定，主題才不會只適合展示。
