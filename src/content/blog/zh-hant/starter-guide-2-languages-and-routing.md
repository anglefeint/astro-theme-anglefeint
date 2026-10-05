---
tags:
  - anglefeint
  - starter
title: 使用指南 2：撰寫與整理內容
subtitle: 文章、圖片、標籤、目錄、搜尋與分享圖。
description: 文章、圖片、標籤、目錄、搜尋與分享圖。
pubDate: '2026-03-07'
updatedDate: '2026-10-03'
heroImage: ../../../assets/blog/default-covers/cyber-03.webp
---

## 建立文章

```bash
npm run new-post -- my-first-post
# --locales en,pt-br
```

只建立繁體中文可用 npm run new-post -- my-first-post --locales zh-hant。slug 使用小寫英文字母、數字與連字號。src/content/blog/zh-hant/my-first-post.md 對應 /zh-hant/blog/my-first-post/。現有檔案不會被覆寫。--locales 只建立檔案，不會啟用語言。

譯文請使用相同 slug。缺少譯文時，語言選單會導向目標語言的列表；hreflang 不會將列表冒充文章譯文。

## 填寫 frontmatter

```yaml
---
title: 'My first post'
description: 'My notes and projects'
pubDate: '2026-10-03'
tags: ['astro', 'notes']
---
```

title、description、pubDate 必填；subtitle、updatedDate、author 選填，作者預設使用網站作者。列表依 pubDate 排序。目前沒有草稿或排程發布篩選：draft: true 與未來日期都不會隱藏文章。未完成內容請放在 src/content/blog/ 之外。

heroImage: ./cover.jpg 使用文章旁的圖片。若 src/assets/blog/default-covers/ 有圖片，指令會分配固定封面，不會下載圖片。閱讀時間與其他指標都是估計值，可用 readMinutes、wordCount、tokenCount、aiLatencyMs、aiConfidence 覆寫；這些資料不代表連接了真實 AI 服務。

## 目錄與標籤

使用 Markdown 的 ## 與 ### 標題。寬螢幕的目錄在右側，窄螢幕在正文前，沒有標題時不顯示。toc: false 可停用單篇目錄；toc: true 優先於全站設定。MDX 元件或 HTML 產生的標題不會自動收集。

tags: ['astro', 'notes'] 會產生 /zh-hant/tags/ 等頁面。標籤區分大小寫，會去除前後空白與重複項。非拉丁文字採用編碼網址；重新命名會改變連結。theme.tags.enabled: false 停用連結與標籤頁。

## 圖片與程式碼

加入對應檔案後，可使用 `![圖片說明](./photo.jpg)` 或 `![圖片說明](/images/photo.jpg)`。正文一般圖片可點擊或按 Enter／空白鍵放大，按 Escape、關閉按鈕或背景離開。封面及連結或按鈕內的圖片不包含在內。預覽使用瀏覽器已選取的圖片，不會自動載入更高解析度原圖。

以三個反引號建立 Markdown 程式碼區塊，便會出現複製按鈕。複製保留縮排與換行，需要 HTTPS 或 localhost；失敗時請手動複製。

## 搜尋

執行 npm run build 與 npm run preview 後測試。搜尋範圍是目前語言文章的標題與正文，dev 僅顯示提示。search: false 只排除索引，不會隱藏文章或阻止直接存取。theme.search.enabled: false 同時停用入口與索引。修改內容後需重建。

## 分享圖

未指定 ogImage 時，建置會用標題、作者與網站名稱產生 1200×630 PNG，不影響 heroImage。自訂圖片可使用 ogImage: ./share.png 或 /images/share.png，也支援 HTTPS。缺少本機檔案會報錯，外部圖片則依賴外部服務。

自動分享圖使用主題內附的代碼雨、終端與霓虹網路背景，網站名稱、標題和作者仍使用你的內容。右下角的小字 `Theme by Anglefeint` 沿用 `theme.footer.showCredits`（預設 `true`）；設為 `false` 會同時隱藏頁尾與圖片署名，修改後請重新建置部署。自訂 `ogImage` 不會被修改。背景離線使用，不增加瀏覽器 JavaScript。

明確設定的 ogImage 優先。theme.socialImage.enabled: false 只停用自動產生，其他文章回退到封面或預設圖。檢查 HTML 的 og:image 與 dist/\_social/。分享平台可能快取舊圖，不保證支援所有 emoji 與文字系統。

## 獨立頁面

npm run new-page -- projects --theme cyber 會建立 src/pages/[lang]/projects.astro，內容需自行編輯，不會自動翻譯或增加導覽項目。可用 base、ai、cyber、hacker、matrix，slug 支援 projects/labs 這類路徑。檔案已存在時會報錯。

- [使用指南 1：設定你的部落格](/zh-hant/blog/starter-guide-1-configure-your-site/)
- [使用指南 2：撰寫與整理內容](/zh-hant/blog/starter-guide-2-languages-and-routing/)
- [使用指南 3：選用功能](/zh-hant/blog/starter-guide-3-comments-about-and-theme-toggles/)
