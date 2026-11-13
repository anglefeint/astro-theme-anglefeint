---
title: Anglefeint 架構：以四層組合兼顧維護與重用
subtitle: ThemeFrame → Shell → Layout → Page
description: ThemeFrame → Shell → Layout → Page
pubDate: '2026-03-03'
heroImage: ../../../assets/blog/default-covers/ai-02.webp
aiModel: anglefeint-core
aiMode: analysis
aiState: stable
updatedDate: '2026-11-14'
---

Anglefeint 的四層組合是職責劃分：

- ThemeFrame：共用文件、SEO、導覽、頁尾和音樂。
- Shell：選擇頁面樣式與背景氛圍。
- Layout：組織本文、封面和輔助區域。
- Page：讀取內容與設定，再組合頁面。

它不要求每頁逐層巢狀相同元件。共用結構負責一致性，頁面保留各自的資料與互動。

標準路由、預設值和實作由 `@anglefeint/astro-theme` 提供；starter 保留文章、素材、`src/site.config.ts`、自訂頁面和部署設定。更新不必複製標準頁面。設定集中在一個入口，文章與碎片仍在各自的內容目錄維護。

延伸閱讀：[依路由設計視覺系統](/zh-hant/blog/route-visual-system-design/) · [設定字典：網站名稱、網域、公共導覽、社交和頁尾](/zh-hant/blog/config-site-chrome/)
