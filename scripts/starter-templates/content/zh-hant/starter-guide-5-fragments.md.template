---
tags: ['anglefeint', 'starter']
title: '使用者指南 5：發布碎片'
description: '以 Markdown 記錄簡短感想，可選彈窗留言。'
pubDate: '2026-11-11'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
updatedDate: '2026-11-13'
---

## 支援 AI 閱讀的內容

建置會將公開文章、已啟用的 Fragments 和 About 頁面納入 `/llms.txt`、語言索引與全文合集。文章 Markdown 網址維持不變；各語言另有 `/zh-hant/fragments/index.md` 和 `/zh-hant/about/index.md`（依實際語言替換）。Fragments 檔案合併所有公開分頁，保留每則 ID、發布時間、正文及穩定的 `/<locale>/fragments/#ID` 連結。HTML 頁面提供對應 Markdown 的探索連結。檔案在 `npm run build` 後及 preview 中可用，部署整個 `dist/` 即可。

About 匯出公開簡介、聯絡連結及可開啟的 AI 文字彈窗，排除終端設定、工具與裝飾介面；不匯出留言。停用的頁面／語言、已刪除內容、noindex 頁面與站外 canonical 頁面不匯出；重新建置會清除過期產物與探索連結，保護使用者自有檔案，遇到衝突時停止建置。網站／語言補充說明適用所有匯出文件。JSON-LD 包含頁面語言，About 使用 AboutPage。不需新增設定、伺服器或 UI 依賴，也不保證 AI 收錄或引用。

從 0.33.2 起，Fragments 共用文章頁的返回頂部按鈕：捲動後顯示，並遵循減少動態效果偏好，無需額外設定。

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
id: 'q8Lm3XzP'
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

碎片仍獨立於文章搜尋和 RSS，但建置時會產生自己的 AI 可讀 Markdown 匯出。圖片可放在 `public/images/`，以 `/images/...` 引用。

先升級至主題 0.29.0 或更新版本，再主動開啟。保留個人內容、設定、音樂及圖片；個人教程不會被替換，請參閱最新 demo。不會合併或刪除 GitHub 討論。

留言從遠端載入；Giscus 就緒前保留載入提示，失敗或超過 15 秒會顯示重試。請檢查網路或 Giscus 設定。彈窗共用文章的 Giscus 整合，無需另外安裝 Giscus npm 套件，也不改變文章既有對應。

```bash
npm run build
```

0.32.0 起的分頁改進：碎片與 Blog 共用頁碼、霓虹樣式及依門檻顯示的跳頁入口。`theme.pagination` 統一控制兩處分頁；`theme.fragments.pageSize` 仍獨立設定每頁碎片數量。

## 穩定分享連結（0.32.0 起）

0.32.0 起的分享功能：日期連結定位列表中的這則碎片，旁邊提供複製連結。對外分享使用 `/zh-hant/fragments/#ID`，其中 ID 是 Markdown frontmatter 的 id。目前頁面沒有該則時，才讀取本語言的輕量靜態索引，自動跳至對應分頁。新增內容、修改日期或 pageSize 後重新建置即可，保留原 ID。跨頁定位和複製需要啟用 JavaScript。

實際瀏覽網址可能帶頁碼；分享請使用日期連結或複製按鈕，不要手動複製帶頁碼的網址列。仍存在的舊分頁可修正過時錨點，已消失的舊頁碼仍進入網站原有 404，本功能不接管 404 頁面。

碎片不存在或網路失敗時會顯示提示，不會反覆跳頁。剪貼簿受限時會顯示可選取並手動複製的連結。此功能需要主題 0.32.0 或更新版本，使用自動定位前請先升級。

## 預設分享圖與 Fragment 短 ID（0.33.0+）

在 src/site.config.ts 既有 site 設定中合併 site.ogImage，可填 public 根路徑（如 /images/share.jpg，對應 public/images/share.jpg）或 HTTPS 圖片網址。留空使用內建的 1200×630 Anglefeint 分享圖。Fragments 及所有 #ID 分享連結共用此圖。文章專屬圖、自動產生的文章圖維持優先；停用自動產生時，文章封面也優先於網站預設圖。更換後重新建置並部署，分享平台仍可能快取預覽。

```ts
export const THEME_CONFIG = defineThemeConfig({
  site: { ogImage: '/images/share.jpg' },
});
```

new-fragment 使用區分大小寫的字母與數字產生 8 位 Nano ID，檢查各語言既有 Markdown ID，衝突時重試。同一次命令的所有語言共用 ID 與發佈時間。Fragment 僅接受恰好 8 位英數字 ID，不相容舊 UUID 或長 ID；舊內容請刪除後重新發佈，不提供遷移或舊連結相容。新內容發佈後請保留 ID，修改會改變留言關聯。

## 首頁 Fragment 預覽（0.35.0+）

目前原始碼中，啟用 `theme.fragments.enabled` 且目前語言有碎片時，首頁 header 下方會顯示像素頭像入口。展開後預覽最近三則；整張卡片連到原碎片，底部數量與箭頭連到完整列表。數量代表目前語言的預覽則數 / 總則數。圖片與程式碼採限高預覽，超出部分裁切；停用或沒有內容時不顯示入口。不需新增設定。需要主題 0.35.0 或更新版本。

## 本機圖片與部署（0.36.0+）

需要主題 0.36.0 或更新版本，已發布的 0.35.0 不包含此功能。保留現有路徑：`/images/fragments/photo.png` 對應 `public/images/fragments/photo.png`；也可在碎片 Markdown 旁放 `photo.png`，使用 `./photo.png`。支援 Markdown 圖片、參照式圖片與 HTML `img`，原圖不移動、不覆寫。

升級後，本機 dev 或本機 doctor 會自動準備響應式檔案，也可手動執行：

```bash
npx @anglefeint/astro-theme prepare-covers
```

提交原圖及整個 `src/assets/blog/covers/`（manifest.json 與 generated/）。建置及 CI doctor 只驗證，檔案缺少或過期時會停止，不在部署平台重新產生。列表與首頁預覽共用檔案並補齊缺少的寬高；列表首圖優先，其餘圖片與首頁縮圖延遲載入。動畫與 SVG 保留原格式，遠端圖片不在本機轉換。
