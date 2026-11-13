---
tags: ['anglefeint', 'config']
title: '設定字典：文章詳情頁'
subtitle: '區分全站開關、文章欄位和介面文字，查詢目錄、數學、監視器、OUTPUT 與閱讀互動。'
description: '說明文章詳情設定的型別、預設值、作用和限制，完整標記文章 frontmatter 中的相容與目前未使用欄位。'
pubDate: '2026-11-13'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/ai-02.webp'
---

**版本說明：** 即時回應減少動態效果，以及作者與自動分享圖鍵一致性的修正，從 0.36.1 起提供，0.36.0 未包含。

[返回設定字典總入口](/zh-hant/blog/config-reference/)。先確認欄位寫在哪個檔案：全站功能與文字放在 `src/site.config.ts`，單篇標題、日期、圖片和統計放在 Markdown／MDX 頂部的 frontmatter。不要把兩者互換。

本文基于包提供的標準文章路由。它為啟用語言生成文章頁，依實際內容提供目錄、統計、譯文連結及最多三篇其他文章；自訂直接呼叫 BlogPost 的頁面需要自己傳入相應組件屬性，不能期待它自動具有所有路由行為。

## 1. 全站功能開關

<a id="feature-switches"></a>

以下欄位在 site.config 的 theme 中，型別均為 `boolean`，主題預設值均為 `true`。下面每行都提供一段可合併進 theme 的範例，依需求選用，不是建議全部關閉。

| 完整路徑                       | 作用與生效條件                                                                         | 限制與範例                                                                                                                  |
| ------------------------------ | -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `theme.toc.enabled`            | 預設顯示文章目錄，收集編譯器提供的二級／三級 Markdown 標題；沒有可用標題時不顯示       | 單篇 toc: true／false 優先；組件內部或原始 HTML 標題不自動納入；例 `toc: { enabled: false }`                                |
| `theme.math.enabled`           | 開啟 Markdown／MDX 數學處理；文章內文實際含數學標記時才引入數學樣式                    | 全域設定，沒有單篇 math 開關；錯誤公式會編譯失敗，關閉會改變數學解析行為；例 `math: { enabled: false }`                     |
| `theme.effects.enableRedQueen` | 顯示文章側面的 Red Queen 監視器                                                        | false 不關閉背景網路、封面 Canvas 或整頁 AI 氛圍；例 `effects: { enableRedQueen: false }`                                   |
| `theme.search.enabled`         | 開啟搜尋入口與文章索引生成；完整定義見[搜尋字典](/zh-hant/blog/config-search/#enabled) | 單篇 search: false 可以排除；單篇 true 不能重新開啟全站已關閉的搜尋；例 `search: { enabled: false }`                        |
| `theme.tags.enabled`           | 顯示文章標籤連結，也控制標籤目錄和標籤列表                                             | false 不刪除原 tags 資料；例 `tags: { enabled: false }`；完整範圍見[列表字典](/zh-hant/blog/config-blog-list/#tags-enabled) |
| `theme.socialImage.enabled`    | 未明確填寫 ogImage 的文章自動生成 1200×630 分享圖片                                    | false 不影響手動 ogImage，改為封面或網站預設圖回退；不等於隱藏頁面封面；例 `socialImage: { enabled: false }`                |

這些欄位均為條件生效，受單篇內容、頁面區域和所列優先級影響。例如可以只關閉預設目錄，保留其他預設行為：

```ts
theme: { toc: { enabled: false } },
```

目錄中的三級標題可嵌在二級標題下，孤立三級標題也能作為目錄條目。四級及更深標題不進入此目錄。內文仍然直接顯示，目錄不是必須等待的載入步驟。

## 2. 作者、署名、分享圖片和評論的關聯設定

<a id="shared-controls"></a>

這些屬於通用模組，本節只說明對文章的實際影響：

| 完整路徑                   | 對文章的影響                                                          | 主說明                                                             |
| -------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `site.author`              | 單篇 author 省略或空白時的作者回退，也用於生成分享圖片                | [網站身分](/zh-hant/blog/config-site-chrome/#identity)             |
| `theme.enableAboutPage`    | 開啟且文章作者等於網站作者時，作者連結指向該語言 About；否則是純文字  | [About 開關](/zh-hant/blog/config-about/#page-enabled)             |
| `theme.footer.showCredits` | 影響自動文章分享圖片中的主題署名，不修改自訂圖片                      | [頁尾設定](/zh-hant/blog/config-site-chrome/#footer)               |
| `site.ogImage`             | 頁面沒有更高優先級圖片時的網站分享圖片回退                            | [網站身分與圖片優先級](/zh-hant/blog/config-site-chrome/#identity) |
| `theme.comments.enabled`   | 文章評論還需連線參數完整並滿足映射約束；沒有單篇 frontmatter 評論開關 | [Giscus 評論](/zh-hant/blog/config-comments/#controls)             |

## 3. 單篇文章欄位：不要放進 site.config

<a id="frontmatter"></a>

以下是文章 frontmatter 的完整 22 項，而不是新增的 site.config 欄位。型別描述以作者填寫的值為起點；日期會解析為 Date，本機圖片會解析為圖片中繼資料。

### 內容與中繼資訊

| 欄位          | 型別與預設行為                                       | 作用、限制與範例                                                                                        |
| ------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `title`       | 必填 string，無預設                                  | 文章標題及相關中繼資訊，不是全站名稱；例 `title: '我的笔记'`                                            |
| `description` | 必填 string，無預設                                  | 頁面中繼描述，context 未設定時也用作標題下的上下文；不是整篇內文；例 `description: '一次调试的记录。'`  |
| `pubDate`     | 必填可解析日期，無預設                               | 發佈時間、列表排序及發佈中繼資訊；詳情以 UTC 日期顯示，未來日期不會隱藏文章；例 `pubDate: '2026-11-13'` |
| `updatedDate` | 選用日期，未設定                                     | 顯示更新日期，sitemap 優先使用它；不代替 pubDate 排序；例 `updatedDate: '2026-11-14'`                   |
| `author`      | 選用 string，省略或空白使用網站作者                  | 不自動建立作者頁；例 `author: '另一位作者'`                                                             |
| `subtitle`    | 選用 string，未設定                                  | 顯示副標題；與上下文完全相同時不重複顯示；例 `subtitle: '从现象到定位'`                                 |
| `context`     | 選用 string，省略使用 description                    | 標題下上下文文字；空字串隱藏這行，但不清空中繼描述；例 `context: '解决一个具体问题。'`                  |
| `tags`        | 選用 string 陣列，未設定時無標籤條目                 | 連結顯示還受全站標籤開關控制；例 `tags: ['astro', '笔记']`                                              |
| `heroImage`   | 選用本機圖片路徑，未設定時無封面區                   | 不能直接用遠程 URL 或把 public 網址當作同一規則；例 `heroImage: ./cover.jpg`，先放入檔案                |
| `ogImage`     | 選用本機圖片／public 路徑／HTTPS，省略走分享圖片回退 | 不改變內文封面；例 `ogImage: /images/share.png`，先放入檔案                                             |
| `toc`         | 選用 boolean，繼承全站目錄設定                       | true 可覆寫全站目錄關閉，但沒有標題仍不顯示；例 `toc: false`                                            |
| `search`      | 選用 boolean，預設 true                              | false 排除該篇站內搜尋，不隱藏文章、RSS、sitemap 或 AI 導出；例 `search: false`                         |

開始時可以只寫必填欄位，再依需求補充：

```yaml
---
title: '我的笔记'
description: '一次调试的记录。'
pubDate: '2026-11-13'
subtitle: '从现象到定位'
context: '解决一个具体问题。'
tags: ['astro', '笔记']
toc: true
search: true
---
```

文章沒有 draft、定時發佈、單篇 comments、單篇 Red Queen 或單篇數學開關。未完成的內容放在內容目錄之外，不要把未知欄位當成隱私控制。

<a id="output-fields"></a>

### OUTPUT 統計與狀態文字

| 欄位         | 型別與預設行為                                     | 作用、限制與範例                                                            |
| ------------ | -------------------------------------------------- | --------------------------------------------------------------------------- |
| `wordCount`  | 選用非負整數，預設從內文來源文字計算               | 獨立覆寫字詞數；例 `wordCount: 800`，不改變 tokenCount                      |
| `tokenCount` | 選用非負整數，預設 round(max(自動字詞數, 1) × 1.3) | 估算而非模型分詞器或實際用量；例 `tokenCount: 1040`                         |
| `aiModel`    | 選用 string，未設定時無此標籤                      | 顯示在標題狀態區及 OUTPUT，不驗證真實模型；例 `aiModel: '作者填写的模型名'` |
| `aiMode`     | 選用 string，未設定時無此標籤                      | 僅顯示模式文字，不執行任務；例 `aiMode: 'notes'`                            |
| `aiState`    | 選用 string，未設定時無此標籤                      | 僅顯示狀態文字，不查詢服務健康狀態；例 `aiState: 'edited'`                  |

自動統計會去掉部分 Markdown、程式碼和連結等內容；CJK 漢字、假名及韓文按字元計，其余主要按空白分詞。公式和 MDX 原始碼仍可能影響估算。只手填 wordCount 不會重算 tokenCount；兩者達到 1,000 時以一位小數 k 顯示，不修改原始值。

```yaml
wordCount: 800
tokenCount: 1040
aiModel: '作者填写的模型名'
aiMode: 'notes'
aiState: 'edited'
```

<a id="legacy-frontmatter"></a>

### 相容和目前未使用欄位

| 欄位             | 型別與預設值               | 狀態、限制與範例                                                                                                                  |
| ---------------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `readMinutes`    | 選用正整數，未填寫         | 相容保留，目前不顯示閱讀時長；例 `readMinutes: 3` 不會使頁面重新顯示它                                                            |
| `aiLatencyMs`    | 選用非負整數，未填寫       | 相容保留，目前不顯示延遲；例 `aiLatencyMs: 150` 也不是實際測量                                                                    |
| `aiConfidence`   | 選用 0–1 的 number，未填寫 | 相容保留，目前不顯示置信度；例 `aiConfidence: 0.9` 不代表文章正確性評估                                                           |
| `canonicalTopic` | 選用 string，未填寫        | 目前未使用；例 `canonicalTopic: 'astro'` 不生成專題、不修改 canonical                                                             |
| `sourceLinks`    | 選用地址陣列，未填寫       | 目前只有驗證／規範化；接受 HTTP(S)，裸網域補 https；例 `sourceLinks: ['https://example.com/']` 不會自動顯示參考連結或進入導出內文 |

需要讀者看到引用來源，直接在內文放 Markdown 連結。舊欄位被接受不等於對應介面仍存在，也不需要為了升級刪除原內容。

## 4. 文章介面文字

<a id="article-messages"></a>

下面前綴為 `i18n.locales.<语言>.messages.blog`。欄位型別均為選用 string 覆寫，按一般語言文字規則解析；下表列中文／英文內建預設值。範例列是放入對應 blog 物件的單個成員，不是 frontmatter。

所有有效文字均為條件生效，要求對應區域實際出現。空字串可能清空標籤但不會隱藏整個功能；無障礙名稱不應清空。標記為目前未使用的欄位則沒有頁面效果。

| 欄位                 | 簡體中文預設 / 英文預設              | 作用與限制                                          | 狀態       | 成員範例                          |
| -------------------- | ------------------------------------ | --------------------------------------------------- | ---------- | --------------------------------- |
| `rqBadge`            | 监视器信号 / monitor feed            | 監視器徽標；僅 Red Queen 開啟時出現，不代表真實監測 | 條件生效   | `rqBadge: "监视器信号"`           |
| `rqReplayAria`       | 重放监视器信号 / Replay monitor feed | 監視器重播按鈕名稱；不修改素材或播放策略            | 條件生效   | `rqReplayAria: "重放监视器信号"`  |
| `backToTop`          | 返回顶部 / Back to top               | 返回頂部按鈕名稱；按鈕顯示受滾動狀態影響            | 條件生效   | `backToTop: "返回顶部"`           |
| `toastP10`           | 语境解析 10% / context parsed 10%    | 閱讀進度早期提示，不是 AI 請求進度                  | 條件生效   | `toastP10: "语境解析 10%"`        |
| `toastP30`           | 语境解析 30% / context parsed 30%    | 閱讀進度提示，不是語義解析結果                      | 條件生效   | `toastP30: "语境解析 30%"`        |
| `toastP60`           | 推理稳定 60% / inference stable 60%  | 閱讀進度提示，不是模型推理狀態                      | 條件生效   | `toastP60: "推理稳定 60%"`        |
| `toastDone`          | 输出完成 / output finalized          | 閱讀完成階段提示，不證明生成或驗證完成              | 條件生效   | `toastDone: "输出完成"`           |
| `metaPublished`      | 发布 / published                     | 發佈時間前的標籤，不修改日期                        | 條件生效   | `metaPublished: "发布"`           |
| `metaAuthor`         | 作者 / by                            | 作者前的標籤，不改變作者值                          | 條件生效   | `metaAuthor: "作者"`              |
| `metaUpdated`        | 更新 / updated                       | 更新日期前的標籤，只有提供 updatedDate 才顯示       | 條件生效   | `metaUpdated: "更新"`             |
| `systemStatusAria`   | 模型状态 / Model status              | 標題狀態區無障礙名稱，需要至少一個狀態欄位          | 條件生效   | `systemStatusAria: "模型状态"`    |
| `systemModelLabel`   | 模型 / model                         | 模型標籤，aiModel 存在時使用，也用於 OUTPUT         | 條件生效   | `systemModelLabel: "模型"`        |
| `systemModeLabel`    | 模式 / mode                          | 模式標籤，需要 aiMode                               | 條件生效   | `systemModeLabel: "模式"`         |
| `systemStateLabel`   | 状态 / state                         | 狀態標籤，需要 aiState                              | 條件生效   | `systemStateLabel: "状态"`        |
| `promptContextLabel` | 语境 / Context                       | 上下文前的標籤，需要有非空上下文                    | 條件生效   | `promptContextLabel: "语境"`      |
| `heroMonitor`        | 神经监视器 / neural monitor          | 封面監視器文字，需要 heroImage                      | 條件生效   | `heroMonitor: "神经监视器"`       |
| `heroSignalSync`     | 信号同步中 / signal sync active      | 封面信號標記，靜態裝飾文字，不查詢同步狀態          | 條件生效   | `heroSignalSync: "信号同步中"`    |
| `heroModelOnline`    | 模型在线 / model online              | 封面模型標記，靜態裝飾文字，不查詢服務              | 條件生效   | `heroModelOnline: "模型在线"`     |
| `toc`                | 文章目录 / On this page              | 目錄名稱，需要目錄啟用且有可用標題                  | 條件生效   | `toc: "文章目录"`                 |
| `responseOutput`     | 输出 / Output                        | 內文 OUTPUT 欄名稱，不控制內文內容                  | 條件生效   | `responseOutput: "输出"`          |
| `statsWords`         | 词 / words                           | 字詞數標籤，不修改統計值                            | 條件生效   | `statsWords: "词"`                |
| `statsTokens`        | 令牌 / tokens                        | tokens 標籤，不修改估算                             | 條件生效   | `statsTokens: "令牌"`             |
| `copySectionLink`    | 复制本节链接 / Copy section link     | 內文 h2／h3 章節連結複製名稱，不改變錨點算法        | 條件生效   | `copySectionLink: "复制本节链接"` |
| `regenerate`         | 重播扫描 / Replay scan               | 重播掃描按鈕文字，僅觸發視覺效果                    | 條件生效   | `regenerate: "重播扫描"`          |
| `relatedAria`        | 相关文章 / Related posts             | 相關文章區域的無障礙名稱，需要有其他文章            | 條件生效   | `relatedAria: "相关文章"`         |
| `related`            | 相关文章 / Related                   | 相關文章區標題，不控制推薦算法                      | 條件生效   | `related: "相关文章"`             |
| `backToBlogAria`     | 返回博客 / Back to blog              | 返回部落格導覽的無障礙名稱                          | 條件生效   | `backToBlogAria: "返回博客"`      |
| `backToBlog`         | 返回博客 / Back to blog              | 返回部落格連結的可見文字，不改變連結目標            | 條件生效   | `backToBlog: "返回博客"`          |
| `comments`           | 评论 / Comments                      | 評論區域無障礙名稱，需要文章評論設定有效            | 條件生效   | `comments: "评论"`                |
| `metaReadMinutes`    | 分钟阅读 / min read                  | 目前未使用；改此文字不會還原閱讀時長                | 目前未使用 | `metaReadMinutes: "分钟阅读"`     |
| `latencyLabel`       | 延迟估计 / latency est               | 目前未使用；改此文字不會還原延遲                    | 目前未使用 | `latencyLabel: "延迟估计"`        |
| `confidenceLabel`    | 置信度 / confidence                  | 目前未使用；改此文字不會還原置信度                  | 目前未使用 | `confidenceLabel: "置信度"`       |

這些狀態、封面標記和滾動提示主要表達介面氛圍，不能當作真實 AI 模型在線、網路同步或準確率檢測結果。regenerate 對應的按鈕只重播掃描視覺效果，不改寫文章、不請求 AI 服務。

例如修改 OUTPUT 和複製章節連結的文字：

```ts
i18n: {
  locales: {
    zh: {
      messages: {
        blog: {
          responseOutput: '正文',
          statsWords: '字词',
          statsTokens: '估算 tokens',
          copySectionLink: '复制这一节的网址',
          regenerate: '重播扫描效果',
        },
      },
    },
  },
},
```

返回部落格連結的實際目的地仍是目前語言的部落格列表；修改文字不會改連結。相關文章目前取同語言中排除本篇後的最新最多三篇，不是 AI 相似度推薦，也沒有數量或相似度設定欄位。欄位 related／relatedAria 只改變文字及無障礙名稱。

<a id="interaction-messages"></a>

### 程式碼複製與圖片預覽的文字

前綴改為 `i18n.locales.<语言>.messages`，以下每項也都是選用 string 覆寫和條件生效；不會改變複製權限、圖片來源或添加功能開關。

| 路徑末段             | 簡體中文預設 / 英文預設                                             | 作用與限制                                     | 成員範例                                             |
| -------------------- | ------------------------------------------------------------------- | ---------------------------------------------- | ---------------------------------------------------- |
| `codeCopy.copy`      | 复制代码 / Copy code                                                | 程式碼塊複製按鈕文字，不修改被複製內容         | `codeCopy: { copy: "复制代码" }`                     |
| `codeCopy.copied`    | 已复制 / Copied                                                     | 程式碼及章節連結複製成功提示                   | `codeCopy: { copied: "已复制" }`                     |
| `codeCopy.failed`    | 复制失败，请手动选择代码。 / Copy failed. Select the code manually. | 程式碼及章節連結複製失敗提示，不授予剪貼板權限 | `codeCopy: { failed: "复制失败，请手动选择代码。" }` |
| `imagePreview.open`  | 查看大图 / View image                                               | 圖片預覽入口和彈窗的無障礙名稱                 | `imagePreview: { open: "查看大图" }`                 |
| `imagePreview.close` | 关闭图片预览 / Close image preview                                  | 關閉圖片預覽按鈕名稱，不修改圖片來源           | `imagePreview: { close: "关闭图片预览" }`            |

```ts
i18n: {
  locales: {
    zh: {
      messages: {
        codeCopy: { copy: '复制内容', copied: '复制好了', failed: '无法复制，请手动选择。' },
        imagePreview: { open: '放大这张图片', close: '收起图片' },
      },
    },
  },
},
```

複製章節連結只給內文中有 id 的 h2／h3 添加按鈕，成功／失敗重複使用 codeCopy.copied／failed。程式碼複製和圖片預覽需要 JavaScript；一般內文圖片預覽不包括封面或連結／按鈕裡的圖片，放大重複使用瀏覽器選中的來源，不另外請求高清原圖。它們沒有 site.config 的 enabled 欄位。

## 5. 目前設定邊界與驗證

文章頁會即時回應系統的「減少動態效果」偏好，不必重新整理。開啟後，封面與背景網路採靜態呈現，Red Queen 停止並隱藏；關閉後按原有啟動節奏恢復。切換不會重設閱讀進度或重新綁定程式碼複製、章節連結與圖片預覽，也沒有新增 site.config 開關。

內文和內文面板直接出現並保持靜止；背景網路、標題光帶和封面效果獨立存在。目前沒有全站 AI 主題切換、內文入場時長、面板呼吸、相關文章數量、圖片預覽 enabled 或程式碼複製 enabled 等公開設定。不要靠添加任意同名鍵期待生效。

locale、articleSlug、headings、filePath、related、localeHrefs 和 seoLocaleHrefs 是 BlogPost 組件呼叫屬性，不是 site.config 或文章 frontmatter；標準路由會提供對應資料。新建一般文章不需要手動填寫這些屬性。

先在 dev 檢視有標題／無標題、有封面／無封面等實際內容下的結果；程式碼複製、章節連結和圖片預覽自行檢查互動。搜尋在建置後的 preview 驗證。發佈前停止 dev，執行 npm run doctor 再 npm run preview，成功後無需緊接著重複 check 或 build；重新部署後線上才更新。

安裝和升級見[第一篇教學](/zh-hant/blog/starter-guide-1-configure-your-site/)，文章寫法見[寫第一篇文章](/zh-hant/blog/starter-guide-2-languages-and-routing/)，發佈見[部署教學](/zh-hant/blog/starter-guide-deployment/)。
