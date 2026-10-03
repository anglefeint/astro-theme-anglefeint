---
title: 升級方式：先建立 starter，再更新套件
subtitle: 讓初始化與日常維護有清楚的路徑。
description: 讓初始化與日常維護有清楚的路徑。
pubDate: '2026-03-03'
updatedDate: '2026-10-03'
heroImage: ../../../assets/blog/default-covers/hacker-01.webp
aiModel: anglefeint-core
aiMode: analysis
aiState: stable
aiLatencyMs: 165
aiConfidence: 0.97
---

先使用公開模板建立專案。相容的套件更新可執行 npm update @anglefeint/astro-theme，再執行 npm run doctor。

npm update 遵守 package.json 的版本範圍，^0.5.1 不包含 0.6.0。請閱讀發布說明，必要時安裝明確版本，不要盲目使用 @latest。npm ls @anglefeint/astro-theme astro 可查看安裝版本。

套件不會更新本機 starter 的設定、路由、介接檔與整合。若專案結構改變，請在另一個資料夾建立新 starter，遷移內容與個人設定，不要用舊輔助檔覆蓋新版。

doctor 已包含檢查與建置，通過後使用 npm run preview。只有產生的介接檔與本機範本不同步時才執行 npm run sync-adapters；它不會下載上游範本。舊專案可能有不同指令。

升級 Astro 主版本時先依官方遷移指南處理，其他細節請看[升級指南](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md)。
