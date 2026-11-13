---
tags: ['anglefeint', 'starter']
title: '使用指南 4：發佈一條碎片'
subtitle: '用 Markdown 記錄簡短想法，添加圖片或程式碼，再分享穩定連結；需要時開啟評論。'
description: '從開啟 Fragments、建立和編輯 Markdown，到首頁預覽、分頁分享、多語言與選用 Giscus 評論。'
pubDate: '2026-11-11'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

本篇是入門教學的第 4 / 8 篇。[檢視完整教學順序](/zh-hant/blog/starter-guide-1-configure-your-site/#tutorial-order) · [依欄位查設定字典](/zh-hant/blog/config-reference/)。

想記錄一句想法、一張圖片或一段程式碼，不必為它寫一篇完整文章。Fragments 將這些內容按時間放在獨立列表裡，也會在首頁提供最近內容的預覽入口。

本篇面向目前整合版 starter。如果已有專案缺少相關指令或功能，先按[安裝部落格，換成自己的資訊](/zh-hant/blog/starter-guide-1-configure-your-site/)中的升級說明處理，再繼續操作。

## 1. 開啟碎片列表

打開 `src/site.config.ts`，把下面的 `fragments` 合併到現有 `theme` 物件中。已有 `theme` 時直接添加或修改其欄位，不要重複建立同名物件：

```ts
theme: {
  fragments: {
    enabled: true,
    pageSize: 20,
    comments: { enabled: false },
  },
},
```

| 欄位                               | 預設值與實際作用                                                             |
| ---------------------------------- | ---------------------------------------------------------------------------- |
| `theme.fragments.enabled`          | 預設 `false`；開啟後為已啟用語言生成碎片列表，並允許有內容的首頁顯示預覽入口 |
| `theme.fragments.pageSize`         | 預設 `20`；每頁碎片數量，必須是 1–100 的整數，與部落格每頁文章數獨立         |
| `theme.fragments.comments.enabled` | 預設 `false`；開啟碎片的評論彈窗，還需要填寫後文的 Giscus 儲存庫設定         |

本機執行 `npm run dev`，打開終端機地址下的 `/<locale>/fragments/`，例如 `/en/fragments/` 或 `/zh/fragments/`。前提是對應語言已在專案中啟用；沒有內容時顯示空列表，不需要先建立頁面檔案。碎片關閉時不生成該列表，首頁也不會顯示碎片入口，但不會刪除你的 Markdown 檔案。

## 2. 按預設流程建立碎片

在專案根目錄執行：

```bash
npm run new-fragment
```

未指定 `--locales` 或 `ANGLEFEINT_LOCALES` 時，指令為專案全部已啟用語言生成同一條碎片的範本；初始設定會生成九份。檔案位於 `src/content/fragments/<locale>/`，同次呼叫共用 ID 和發佈時間，但不會自動翻譯。終端機會印出實際路徑，檔案名類似 `2026-11-13-q8Lm3XzP.md`，包含 UTC 日期和隨機 ID；打開自己剛生成的檔案，不必手動建立這個範例檔案名。

只想建立中文時，可改用 `npm run new-fragment -- --locales zh`；指定多種語言可用 `--locales en,zh`。這些是替代用法，依需求選擇一個，不必全部執行，也不會自動啟用相應語言。發佈前將未完成的其他語言範本移出碎片內容目錄。

**每執行一次指令都會建立一條新碎片。** 修改現有內容時直接編輯原檔案，不要為了繼續寫同一條內容再執行建立指令。指令不要求給碎片起 slug，也不會覆寫已有檔案。

目前 starter 自帶 `new-fragment` 腳本。如果舊專案沒有這個腳本，先確認主題已升級，再使用專案中的 CLI：

```bash
npx @anglefeint/astro-theme new-fragment
```

這是上一條建立指令的替代寫法，不要把兩條都執行來建立「同一條」碎片。

## 3. 替換佔位內文，保留 ID

生成檔案的頂部是 frontmatter，內文從第二條 `---` 後開始。保留生成的 `id` 和 `pubDate`，把內文裡的佔位內容換成自己的想法。下面僅顯示格式，不要用範例 ID 覆寫自己的 ID：

```md
---
id: 'q8Lm3XzP'
pubDate: '2026-11-13T09:00:00+08:00'
---

今天把一個困擾很久的問題解決了，記下這個小進展。
```

碎片目前支援三個 frontmatter 欄位：

| 欄位      | 怎麼填寫                                                                           |
| --------- | ---------------------------------------------------------------------------------- |
| `id`      | 必填，恰好 8 位英文字母和數字，區分大小寫。建立指令會生成並檢查已有 ID，無需自己編 |
| `pubDate` | 必填，可解析的發佈日期；建議保留指令生成的 ISO 時間，或填寫帶時間和時區的值        |
| `title`   | 選用字串，填寫後作為列表卡片標題顯示；不填也可以正常發佈                           |

添加標題時，在同一個 frontmatter 中補 `title: '一個小進展'` 即可。碎片不要求文章使用的 `description`，也沒有文章封面 `heroImage` 欄位；配圖寫在內文中。

列表按 `pubDate` 從新到舊排序，同一時間再按 ID 排序，不按檔案名排列。頁面顯示 UTC 時間，與你填寫的本機時區時間可能不同。只改內文或檔案名不會改變評論和分享身分；修改日期會改變排序及所在分頁。

**發佈後請保留 ID。** 同一語言出現重複 ID 會報錯，不同碎片不要重複使用 ID。舊 UUID 或長 ID 不符合目前格式；保留原內容備份後再處理相容，主題不提供舊 ID、分享連結或評論的自動遷移。不要把批量改 ID 當成一般檔案整理。

目前只收集 `src/content/fragments/` 下的 `.md`，不支援用 `.mdx` 建立碎片。沒有草稿或未來日期過濾：`draft: true` 和未來時間都不能隱藏內容，未準備公開的碎片放在該目錄之外。

## 4. 添加圖片、程式碼和公式

一般 Markdown 段落、連結、列表和引用都可以使用。圖片例如：

```md
![這次進展的截圖](/images/fragments/progress.png)
```

先把實際圖片放到 `public/images/fragments/progress.png`；也可以在碎片旁放 `photo.png`，用 `![圖片說明](./photo.png)` 引用。更多寫法、檔案尺寸和 Git 提交要求見[給文章和碎片添加圖片](/zh-hant/blog/starter-guide-images/)。

程式碼保留 Markdown 圍欄和縮進：

````md
```js
const progress = {
  done: true,
};
```
````

程式碼塊是內容顯示，不會因為寫了 JavaScript 就執行其中程式碼。不要假定文章頁的程式碼複製按鈕或點選圖片放大也應用於碎片；目前碎片列表沒有整合那兩套文章互動。

全站數學開啟時，碎片同樣支援 `$x_1$` 行內公式和兩行 `$$` 之間的獨立公式。它們在建置時呈現，錯誤公式會導致編譯或建置失敗；關閉 `theme.math.enabled` 會關閉數學處理。公式寫法可參見[寫第一篇文章](/zh-hant/blog/starter-guide-2-languages-and-routing/)。

一般 dev、build 和 doctor（包含 CI）會自動補齊缺少、過期或損壞的衍生圖片，並重用正確的既有檔案。原圖缺失、無效圖片或不安全路徑仍會報錯。明確執行的 `prepare-covers --check` 與設定同步只驗證、不修復。將原圖及整個 `src/assets/blog/covers/` 提交到 Git 可以重用產物，不依賴部署平台保留圖片快取。 請連同碎片 Markdown 一起提交，勿遺漏原圖。build 新行為的版本範圍見[圖片教學](/zh-hant/blog/starter-guide-images/)。

## 5. 首頁預覽和列表分頁

開啟碎片且目前語言存在內容時，首頁 header 下方會顯示像素頭像入口，打開後預覽最新的最多三條。不需要另開一個首頁設定，也不受 `homeLatestCount` 的文章數量設定控制。

預覽可以包含文字、第一張可用圖片和第一段程式碼的摘要，不是完整內文。圖片與程式碼限高，超出部分裁切；多張圖片或多個程式碼塊不會全部顯示。點選整張卡片進入對應碎片；底部的「預覽條數 / 目前語言總條數 →」進入完整列表。例如有兩條時顯示 `2 / 2`，不是固定顯示三條。空列表不顯示首頁入口。

完整列表按 `theme.fragments.pageSize` 分頁。首頁為 `/zh/fragments/`，第二頁為 `/zh/fragments/2/`。分頁外觀和跳頁行為共用 `theme.pagination`，但部落格的 `blogPageSize` 不決定碎片每頁數量。

切換列表語言時進入目標語言第一頁，不保證停在同一條譯文或同一頁碼。翻譯數量可以不同，各語言總條數獨立計算。

## 6. 分享一條碎片

碎片在列表中顯示，沒有為每一條生成獨立的詳情頁。對外分享使用卡片的日期連結，或旁邊的複製連結按鈕，例如：

```text
https://your-domain.example/zh/fragments/#q8Lm3XzP
```

將網域和 ID 替換成真實值。日期連結和複製按鈕使用列表根路徑加 ID，不相依這條內容當時位於第幾頁。新增內容、修改日期或 pageSize 後重新建置和部署，定位索引也會更新。

目標碎片不在目前頁時，頁面用 JavaScript 依需求讀取目前語言的靜態索引，跳到其所在分頁再定位。沒有 JavaScript 時仍可瀏覽分頁，但跨頁自動定位和複製按鈕不可用。複製受剪貼板權限限制時，會提供選用擇的連結供手動複製。

不要把帶 `/2/` 的地址欄連結當成長期分享地址。仍存在的舊分頁可以糾正過時錨點，但如果某個舊頁碼已經不存在，會進入原有 404；定位腳本不接管 404。內容已刪除、ID 不存在或索引載入失敗時會提示，不會自動還原已刪除的碎片。

所有碎片分享連結共用該語言碎片列表的頁面分享圖片，不會按每條 ID 單獨生成。修改預設圖可檢視[圖片教學的分享圖片說明](/zh-hant/blog/starter-guide-images/)。

## 7. 給同一條碎片補譯文

如果只準備為中文和英文建立範本，可以用下面的指令代替前面的預設指令：

```bash
npm run new-fragment -- --locales zh,en
```

同一次指令生成的各語言檔案共享 ID 和時間戳，內文需要自己翻譯。`--locales` 只選擇建立哪些檔案，不會啟用語言。語言優先級是 `--locales` → `ANGLEFEINT_LOCALES` 環境變數 → 專案已啟用語言；省略參數時沒有自動翻譯能力。

後續為已有中文碎片補英文版，應把原檔案複製到 `src/content/fragments/en/`，保留 `id` 和 `pubDate`，再翻譯標題與內文。不要重新執行建立指令來補「同一條」的譯文，那會分配另一個 ID。同一條的翻譯可以跨語言共用 ID，但同一語言不能放兩份同 ID 檔案。

相同 ID 的譯文會共用碎片評論；不同 ID 不會因為文字或檔案名相同就自動關聯。

## 8. 依需求開啟評論

只想記錄內容可以保持評論關閉。需要讀者留言時，先按[Giscus 評論教學](/zh-hant/blog/starter-guide-4-giscus-comments/)準備公開儲存庫、Discussions、Giscus 應用和討論分類，取得真實 ID，再合併到現有設定：

```ts
theme: {
  fragments: {
    enabled: true,
    comments: { enabled: true },
  },
  comments: {
    repo: 'yourname/your-repository',
    repoId: 'REPLACE_WITH_REPO_ID',
    category: 'Announcements',
    categoryId: 'REPLACE_WITH_CATEGORY_ID',
  },
},
```

替換帳號、儲存庫、分類以及兩個 ID 佔位值；已有 `theme.comments` 時保留其他設定。四個儲存庫／分類欄位缺少會報設定錯誤，填了佔位值也不代表遠程設定有效。無需粘貼 Giscus script，也無需安裝額外的 Giscus npm 包。

碎片評論開關是 `theme.fragments.comments.enabled`。不需要為了它把文章評論的 `theme.comments.enabled` 設為 true；已經開啟文章評論時，也可以繼續保留自己的設定。

碎片評論固定使用 `specific`、嚴格匹配及 `fragment/<id>`。它不使用文章的 mapping、term、number、shareAcrossLocales 或固定 lang；評論介面跟隨目前頁面語言，相同 ID 的譯文共用討論和表情，評論內文不自動翻譯。其他共享外觀設定仍來自 `theme.comments`。

點選列表卡片的評論按鈕後才載入客戶端；關閉彈窗保留實例，再打開或切換碎片時重複使用。客戶端失敗或約 15 秒仍未就緒時會顯示重試，不能把網路載入提示當成評論已經成功連線。訪客發表評論需要 GitHub 授權。

修改 ID 不會搬遷舊評論，刪除碎片也不會替你刪除 GitHub 上的討論。需要遷移討論時自行評估處理，不要期待主題自動合併。

## 9. 發佈前確認

在 dev 頁面檢查內容、時間、首頁預覽和分頁。發佈前停止 dev，再執行：

```bash
npm run doctor
npm run preview
```

doctor 包含本機圖片準備、檢查和建置，成功後不必立即重複執行 build。用建置後的 preview 檢查分享定位和圖片，設定了評論時再檢查對應彈窗。預覽不會發佈網站；需要將更新的靜態產物重新部署，線上內容才會改變。

碎片不加入文章全文搜尋或文章 RSS。建置時會生成本語言的 `/zh/fragments/index.md`（其他語言替換 `zh`），合併該語言的公開碎片並保留 ID、時間、內文和穩定連結；也會加入 AI 可讀索引。它是公開輸出，不是私密備份，評論不包含在其中。

- 找不到列表：檢查 fragments 開關和目標語言是否啟用。
- 首頁沒有頭像：檢查目前語言是否確有碎片，其他語言有內容不代表目前語言也有。
- 建立指令因舊檔案失敗：檢查已有碎片 frontmatter 的 ID 格式；建立器會讀取已有 Markdown ID 查重。
- 建置報告重複 ID：檢查同一語言是否複製了兩份；補譯檔案應放到另一個語言目錄。
- 圖片建置失敗：按[圖片教學](/zh-hant/blog/starter-guide-images/)準備並提交原圖、清單與衍生檔案。
- 評論失敗：檢查真實儲存庫 ID、應用授權、分類、網路與瀏覽器攔截，不要反復改碎片 ID。

需要升級時檢視[第一篇的升級說明](/zh-hant/blog/starter-guide-1-configure-your-site/)。

## 教學導覽與設定查閱

[上一篇：給文章和碎片添加圖片](/zh-hant/blog/starter-guide-images/) · [下一篇：把頁面和功能調整成自己喜歡的樣子](/zh-hant/blog/starter-guide-3-comments-about-and-theme-toggles/) · [八篇教學總入口](/zh-hant/blog/starter-guide-1-configure-your-site/#tutorial-order)。

本篇相關欄位：[碎片開關、分頁和內容欄位](/zh-hant/blog/config-fragments/)、[碎片評論](/zh-hant/blog/config-comments/)。完整路徑、預設值和限制見[設定字典總入口](/zh-hant/blog/config-reference/)。
