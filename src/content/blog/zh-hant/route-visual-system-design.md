---
title: 依路由設計視覺系統
subtitle: 不同閱讀階段，各有氛圍。
description: 不同閱讀階段，各有氛圍。
pubDate: '2026-03-03'
updatedDate: '2026-10-03'
heroImage: ../../../assets/blog/default-covers/cyber-02.webp
aiModel: anglefeint-core
aiMode: analysis
aiState: stable
aiLatencyMs: 171
aiConfidence: 0.95
---

Anglefeint 將氛圍對應到路由：

- `/<locale>/`：Matrix 首頁。
- `/<locale>/blog/`：Cyberpunk 列表。
- `/<locale>/blog/<slug>/`：AI 閱讀介面。
- `/<locale>/about/`：駭客個人介紹。

defaultLocalePrefix: 'always' 讓 / 導向預設首頁，初始為 /en/；'never' 只把該首頁移到 /。文章與關於頁仍保留前綴。About 需要 theme.enableAboutPage，啟用的標籤頁沿用 Cyberpunk。

背景支援閱讀。首頁建立個性，列表鼓勵探索，文章凸顯文字，關於頁提供脈絡，讓鮮明視覺與清楚的內容層級共存。
