---
tags: ['anglefeint', 'starter']
title: '使用者指南 5：發布碎片'
description: '以 Markdown 記錄簡短感想，可選彈窗留言。'
pubDate: '2026-11-11'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

既有部落格請先升級至主題 0.29.0 或更新版本：

```bash
npx @anglefeint/astro-theme@latest upgrade
```

將下列欄位合併至 `src/site.config.ts` 現有 theme。碎片與留言預設關閉；開啟後選單位於 Decoder Lab 下方。

```ts
theme: {
  fragments: { enabled: true, pageSize: 20, comments: { enabled: false } },
},
```

開啟後造訪 `/<locale>/fragments/`。`pageSize` 接受 1–100 的整數。檔案使用 `.md`；沒有草稿或未來日期篩選，尚未準備公開的碎片請放在 `src/content/fragments/` 之外。

為全部已啟用語言建立同一則碎片的骨架：

預設為全部啟用語言建立骨架需要主題 0.31.0 或更新版本。請先升級；0.29–0.30 仍需以 `--locales` 明確指定。

```bash
npx @anglefeint/astro-theme@latest new-fragment
```

與 `new-post` 一致，預設讀取專案全部啟用語言，建立共用同一 ID 和時間戳記的骨架，不會自動翻譯。語言優先順序為 `--locales` → `ANGLEFEINT_LOCALES` → 專案啟用語言。明確指定的清單會去除空白、轉為小寫並去重，略過設定讀取，只建立指定語言目錄，不會自動修改設定中的語言開關。

新 starter 也提供 `npm run new-fragment`；既有專案可直接使用 npx，無須新增腳本。

```bash
npx @anglefeint/astro-theme@latest new-fragment --locales en,zh
npx @anglefeint/astro-theme@latest new-fragment --locales zh-hant
```

編輯 `src/content/fragments/<locale>/` 產生的 Markdown，標題可省略：

之後補譯時，將原 Markdown 複製至目標語言目錄，保留 id，再翻譯內文。

```md
---
id: 550e8400-e29b-41d4-a716-446655440000
pubDate: 2026-11-11T08:30:00+08:00
---

碎片.
```

編輯或改名時保留 id；同一碎片的翻譯共用 id，同語言重複 id 會使建置失敗，不同碎片需不同 ID。pubDate 包含時間與時區，以 UTC 顯示並依時間倒序。

開啟彈窗留言：將 `theme.fragments.comments.enabled` 設為 true，於 `theme.comments` 填入 Giscus 提供的 repo、repoId、category、categoryId。倉庫設定見指南 4；文章留言可維持關閉。 [Giscus](https://giscus.app/) · [4](../starter-guide-4-giscus-comments/)

```ts
theme: {
  fragments: { enabled: true, comments: { enabled: true } },
  comments: {
    repo: 'yourname/your-repository',
    repoId: 'R_...',
    category: 'Your category',
    categoryId: 'DIC_...',
  },
},
```

碎片固定使用 specific、嚴格比對及 `fragment/<id>`，忽略文章 mapping、term、number、shareAcrossLocales、lang。介面隨頁面語言；相同 ID 的翻譯共用留言與表情，文章討論不變。首次點擊才載入留言客戶端。關閉只隱藏彈窗，再次開啟或切換碎片時共用同一個留言實例。

靜態發布：修改 Markdown 後重新建置部署，沒有線上發文後台。碎片不加入文章搜尋、RSS 或文章 Markdown 匯出。圖片可放 `public/images/`，以 `/images/...` 引用。

先升級至主題 0.29.0 或更新版本，再主動開啟。保留個人內容、設定、音樂及圖片；個人教程不會被替換，請參閱最新 demo。不會合併或刪除 GitHub 討論。

留言從遠端載入；Giscus 就緒前保留載入提示，失敗或超過 15 秒會顯示重試。請檢查網路或 Giscus 設定。彈窗共用文章的 Giscus 整合，無需另外安裝 Giscus npm 套件，也不改變文章既有對應。

```bash
npm run build
```

0.32.0 起的分頁改進：碎片與 Blog 共用頁碼、霓虹樣式及依門檻顯示的跳頁入口。`theme.pagination` 統一控制兩處分頁；`theme.fragments.pageSize` 仍獨立設定每頁碎片數量。

## 穩定分享連結（0.32.0 起）

0.32.0 起的分享功能：日期連結定位列表中的這則碎片，旁邊提供複製連結。對外分享使用 `/zh-hant/fragments/#fragment-ID`，其中 ID 是 Markdown frontmatter 的 id。目前頁面沒有該則時，才讀取本語言的輕量靜態索引，自動跳至對應分頁。新增內容、修改日期或 pageSize 後重新建置即可，保留原 ID。跨頁定位和複製需要啟用 JavaScript。

實際瀏覽網址可能帶頁碼；分享請使用日期連結或複製按鈕，不要手動複製帶頁碼的網址列。仍存在的舊分頁可修正過時錨點，已消失的舊頁碼仍進入網站原有 404，本功能不接管 404 頁面。

碎片不存在或網路失敗時會顯示提示，不會反覆跳頁。剪貼簿受限時會顯示可選取並手動複製的連結。此功能需要主題 0.32.0 或更新版本，使用自動定位前請先升級。
