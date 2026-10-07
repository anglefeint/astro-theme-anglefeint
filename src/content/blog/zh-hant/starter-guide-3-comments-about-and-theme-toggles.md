---
tags:
  - anglefeint
  - starter
title: 使用指南 3：選用功能
subtitle: 音樂、留言、關於頁、分頁與視覺設定。
description: 音樂、留言、關於頁、分頁與視覺設定。
pubDate: '2026-03-07'
updatedDate: '2026-10-03'
heroImage: ../../../assets/blog/default-covers/matrix-02.webp
---

## 音樂

把音檔放在 public/music/，並合併：

```ts
theme: {
  music: { enabled: true, tracks: [{ title: 'My Song', src: '/music/my-song.mp3' }] },
},
```

每首曲目包含 title、src 與選填 artist，空清單會隱藏播放器。首次播放需點擊。分頁工作階段會記住曲目、進度與音量，但恢復播放取決於瀏覽器政策，跨頁可能有短暫中斷。最後一首結束後回到第一首。

播放器先下載完整音檔再播放，大檔案會增加等待與記憶體使用。外部音檔需要 CORS；本機檔案沒有這項要求。enabled: false 可停用播放器。

## Giscus 留言

準備已啟用 Discussions 的公開儲存庫、安裝應用程式，並從 [giscus.app](https://giscus.app/) 取得 ID。

```ts
theme: {
  comments: {
    enabled: true, repo: 'yourname/your-repository',
    repoId: 'REPLACE_WITH_REPO_ID', category: 'Announcements',
    categoryId: 'REPLACE_WITH_CATEGORY_ID', mapping: 'pathname', lang: '',
  },
},
```

替換 ID 與分類，不必在每篇文章貼入指令碼。必要欄位空白會隱藏元件。lang: '' 跟隨文章語言：pt-br 對應 pt、zh-hant 對應 zh-TW、zh 對應 zh-CN；預設是固定英語。

mapping: 'pathname' 依路徑對應討論串；'specific' 需要 term，'number' 需要以字串提供正整數 number。不合法的值會報錯。strict、reactionsEnabled 使用 '0' 或 '1'。無法顯示時檢查 ID、權限、連線與瀏覽器阻擋。

## 關於頁

About 正文段落與簽名保留設定字串中的換行：`\n` 換行，`\n\n` 留一空行，長句仍自動換行。內容仍是純文字，不解析 Markdown 或 HTML，請勿插入 `<br>`。

編輯 i18n.locales['zh-hant'].about：sections（who、what、ethos、now、contactLead、signature）、contact（email、githubUrl、githubLabel）、sidebar、labels、modals、effects。ethos 是陣列，其他語言需分別編輯。頁面工具只是視覺示範，不是真實 AI 服務。email 空白可隱藏連結；theme.enableAboutPage: false 會移除頁面與導覽入口。

## 數量與功能開關

```ts
theme: {
  homeLatestCount: 3, blogPageSize: 9,
  enableAboutPage: true, effects: { enableRedQueen: true },
  search: { enabled: true }, toc: { enabled: true }, tags: { enabled: true },
  socialImage: { enabled: true }, footer: { showCredits: true },
},
```

改成 false 可停用對應功能。enableRedQueen 只控制文章監視器；文章的 toc: true 可覆寫全站設定；socialImage 不會停用手動 ogImage。各頁氛圍由版型決定，沒有全站切換四種主題的單一開關。

homeLatestCount 控制最新文章數，blogPageSize 控制列表與標籤分頁。pagination.windowSize 限於 5–21。jump.enabled 啟用且總頁數超過 showJumpThreshold（預設 12）才顯示跳頁輸入框；jump.enterToGo 控制 Enter。style.mode 支援 fixed、sequential、random；random 對同一頁穩定，不會每次重新整理都變。style.enabled: false 保留基本分頁。

## 更多語言與首頁網址

在 i18n.locales 新增代碼，提供 meta（label、hreflang、ogLocale、enabled、fallback）、site.hero、messages、about，再用 --locales 建立文章。fallback 補足缺少的設定文字，不會翻譯文章或混合列表語言；必要時會加入預設語言。label 只改選單名稱。

defaultLocalePrefix: 'always' 讓 / 導向語言首頁；'never' 對預設語言反向處理。文章仍保留語言路徑。

## 頁尾與驗證

footer.showCredits: false 隱藏主題與 Astro 連結，保留建置年份及 site.title。site.tagline 是獨立文字。舊值 Built with Astro. 會視為內建署名，避免重複顯示。

自動分享圖使用主題內附的代碼雨、終端與霓虹網路背景，網站名稱、標題和作者仍使用你的內容。右下角的小字 `Theme by Anglefeint` 沿用 `theme.footer.showCredits`（預設 `true`）；設為 `false` 會同時隱藏頁尾與圖片署名，修改後請重新建置部署。自訂 `ogImage` 不會被修改。背景離線使用，不增加瀏覽器 JavaScript。

所有設定合併在同一個 theme 或 i18n，陣列會整份取代。開發時檢查，執行 npm run doctor，再以 npm run preview 測試搜尋。重新建置與部署才會套用到線上。

- [使用指南 1：設定你的部落格](/zh-hant/blog/starter-guide-1-configure-your-site/)
- [使用指南 2：撰寫與整理內容](/zh-hant/blog/starter-guide-2-languages-and-routing/)
- [使用指南 3：選用功能](/zh-hant/blog/starter-guide-3-comments-about-and-theme-toggles/)
