---
tags: ['anglefeint', 'config']
title: '設定字典：Fragments'
subtitle: '碎片列表、首頁預覽、獨立評論與穩定連結。'
description: '依實際實作查閱 Fragments 開關、分頁、評論、介面文字和內容欄位，區分有效設定與目前未使用欄位。'
pubDate: '2026-11-13'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

想先發一條內容，讀[發佈一條碎片](/zh-hant/blog/starter-guide-5-fragments/)；這裡用於查設定。安裝與設定檔案的位置見[第一篇教學](/zh-hant/blog/starter-guide-1-configure-your-site/)，所有模組從[設定字典總入口](/zh-hant/blog/config-reference/)進入。

本文預設值指主題套件預設值，不是展示站目前設定。所有設定片段都合併進 `src/site.config.ts` 現有的 `defineThemeConfig({...})`；不要重複建立 theme 或 i18n。

## 先找到要改的位置

| 想改什麼                     | 設定路徑或位置                                                    |
| ---------------------------- | ----------------------------------------------------------------- |
| 開啟碎片列表和首頁入口       | `theme.fragments.enabled`                                         |
| 完整列表每頁條數             | `theme.fragments.pageSize`                                        |
| 碎片獨立評論                 | `theme.fragments.comments.enabled`，連線參數共用 `theme.comments` |
| 標題、描述、提示和關閉文字   | `i18n.locales.<locale>.messages.fragments`                        |
| 頁碼和跳頁互動               | `theme.pagination`，文字使用 `messages.blog`                      |
| 單條內容的 ID、時間和標題    | Markdown frontmatter，不是 site.config                            |
| 首頁顯示幾條、預覽高度、頭像 | 目前沒有對應公開設定欄位                                          |

<a id="enabled"></a>

## theme.fragments.enabled：開啟碎片

- **型別 / 預設值：** boolean / `false`。
- **狀態 / 作用：** 生效。開啟後載入 `src/content/fragments/<locale>/**/*.md`，生成啟用語言的碎片列表和定位索引；首頁有該語言內容時顯示碎片入口。
- **限制：** 關閉後不載入碎片集合，也不生成對應列表路由。檔案仍保留。開啟但沒有內容時，列表顯示空狀態，首頁不顯示入口。唯讀取 `.md`，不讀取 `.mdx`。
- **範例：** `theme: { fragments: { enabled: true } }`。

列表首頁是 `/<locale>/fragments/`，第二頁起是 `/<locale>/fragments/2/` 等；不要自行添加首頁 `/1/`。語言必須先啟用，見[多語言教學](/zh-hant/blog/starter-guide-languages/)。

`theme.fragments.enabled: false` 時，dev、build 和 prepare-covers／doctor 跳過碎片正文的圖片引用；僅透過這些引用納入處理的圖片不再要求原圖或衍生檔案存在。文章封面引用，以及 `src/assets/blog/default-covers/`、`src/assets/blog/covers/originals/` 兩個來源池仍會準備與驗證，即使圖片只用於碎片。關閉不刪檔，重新開啟後恢復碎片圖片處理。

**版本說明：** 上述圖片隔離從 0.36.1 起提供，0.36.0 未包含；不要視為舊版已有的行為。

<a id="page-size"></a>

## theme.fragments.pageSize：完整列表每頁數量

- **型別 / 預設值：** number / `20`。
- **狀態 / 作用：** 生效，控制完整列表分頁和 ID 到頁碼的定位索引。
- **限制：** 必須是 **1–100 的安全整數**，小數、0、負數及超出範圍會報錯，不會自動截斷。即使碎片關閉，填寫的 pageSize 也會被驗證。首頁預覽仍固定取最新三條，不受此欄位或 `theme.homeLatestCount` 影響。
- **範例：** `theme: { fragments: { pageSize: 10 } }`。

同一語言內先按 pubDate 從新到舊排序；時間相同時再按 ID 的 `localeCompare` 結果排序。沒有按檔案名排序，也沒有自動排除未來日期。調整每頁條數會改變內容所在頁，分享時使用下面的穩定連結。

<a id="comments-enabled"></a>

## theme.fragments.comments.enabled：碎片評論

- **型別 / 預設值：** boolean / `false`。
- **狀態 / 作用：** 條件生效。碎片功能開啟後，在完整列表的每條卡片中顯示評論按鈕，點選打開共用彈窗並載入該條討論。首頁預覽不顯示評論按鈕。
- **限制：** 獨立于 `theme.comments.enabled`（文章評論開關）。必須同時設定共用 Giscus 連線參數；缺少會在生成碎片頁面時拋錯，不能靠空列表繞過。Giscus 服務與儲存庫權限仍需正確設定。
- **範例：** `theme: { fragments: { enabled: true, comments: { enabled: true } } }`。

只開碎片、不啟用評論：

```ts
theme: {
  fragments: {
    enabled: true,
    pageSize: 10,
    comments: { enabled: false },
  },
},
```

只開碎片評論時，文章開關可保持 false，但仍須設定公共的 repo、repoId、category、categoryId。四項參數的型別、預設值和驗證統一見[Giscus 連線參數](/zh-hant/blog/config-comments/#connection)；可直接合併的完整範例見[僅開啟碎片評論](/zh-hant/blog/config-comments/#fragment-overrides)。主題本機檢查不能證明遠端權限或 ID 正確。

碎片以 `fragment/<stable-id>` 綁定討論，同 ID 的多語言內容共享討論。此綁定不使用文章的 mapping、term、number 或 shareAcrossLocales 設定；碎片固定 specific 映射、strict 為 `'1'`、emitMetadata 為 `'1'`，語言跟隨頁面，不使用 `theme.comments.lang`。如果同時開啟文章評論，文章設定自身的驗證仍然執行。

評論主題、反應和輸入欄位位置繼續共用 Giscus 設定；完整操作見評論教學。第一次點選才插入 Giscus 腳本；這裡的 loading 固定 eager，指點選之後立即載入，不是首屏提前載入。關閉彈窗保留已建立的 iframe；換一條內容時切換討論。約 15 秒無有效載入回應時顯示失敗與重試介面，沒有公開超時設定。

<a id="fragment-messages"></a>

## 碎片介面文字：messages.fragments

完整前綴是 `i18n.locales.<locale>.messages.fragments`。下面每個欄位都是 **string**，只改文字，不改變功能。預設使用內建目前語言文字，並遵循語言回退；表中只列中文 / 英文預設值。省略欄位保留預設文字，空字串是主動覆寫，不保證對應控制項消失。範例列寫在 fragments 物件內。

| 欄位             | 簡體中文 / 英文預設值                                                                                                     | 狀態、作用與限制                                                         | 範例                                    |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | --------------------------------------- |
| `title`          | 碎片 / Fragments                                                                                                          | 條件生效：列表標題、頁面標題的一部分、首頁入口的無障礙名稱；不是單條標題 | `title: '隨手記'`                       |
| `description`    | 沿途记录的几句话。 / Brief thoughts, kept along the way.                                                                  | 條件生效：列表可見介紹及頁面描述；首頁展開視窗不顯示此介紹               | `description: '記錄工作與生活的小事。'` |
| `empty`          | 还没有碎片。 / No fragments yet.                                                                                          | 條件生效：完整列表沒有內容時的提示，不會強制顯示首頁入口                 | `empty: '稍后再來看看。'`               |
| `comments`       | 评论 / Comments                                                                                                           | 條件生效：開啟碎片評論後的按鈕文字                                       | `comments: '參與討論'`                  |
| `close`          | 关闭 / Close                                                                                                              | 條件生效：評論彈窗關閉文字及首頁視窗關閉按鈕的無障礙名稱                 | `close: '關閉窗口'`                     |
| `previous`       | 上一页 / Previous                                                                                                         | **目前未使用**：型別仍接受，實際分頁使用 messages.blog.previous          | `previous: '上一頁'`                    |
| `next`           | 下一页 / Next                                                                                                             | **目前未使用**：型別仍接受，實際分頁使用 messages.blog.next              | `next: '下一頁'`                        |
| `loading`        | 正在加载评论… / Loading comments…                                                                                         | 條件生效：評論載入狀態                                                   | `loading: '正在連接討論…'`              |
| `error`          | 评论未能加载，请检查网络或评论配置后重试。 / Unable to load comments. Check your network or comment settings, then retry. | 條件生效：評論載入失敗提示，不是定位索引錯誤                             | `error: '討論暫時不可用，請重試。'`     |
| `retry`          | 重试 / Retry                                                                                                              | 條件生效：評論載入失敗後的重試按鈕                                       | `retry: '重新連接'`                     |
| `copyLink`       | 复制碎片链接 / Copy fragment link                                                                                         | 條件生效：分享連結按鈕的標題和無障礙名稱，按鈕由腳本啟用                 | `copyLink: '復制本條連結'`              |
| `linkCopied`     | 链接已复制 / Link copied                                                                                                  | 條件生效：複製成功提示                                                   | `linkCopied: '已復制'`                  |
| `copyLinkFailed` | 未能自动复制，请复制下方链接。 / Unable to copy automatically. Copy the link below.                                       | 條件生效：剪貼板複製失敗，提示手動複製                                   | `copyLinkFailed: '請手動復制此連結。'`  |
| `notFound`       | 找不到这条碎片，它可能已被移除。 / Fragment not found. It may have been removed.                                          | 條件生效：穩定 ID 定位失敗，不是通用 404 文字                            | `notFound: '這條記錄已不存在。'`        |
| `indexError`     | 暂时无法定位这条碎片，请刷新页面后重试。 / Unable to locate this fragment. Refresh the page and try again.                | 條件生效：定位索引請求或驗證失敗                                         | `indexError: '定位失敗，請刷新重試。'`  |

例如只覆寫繁體中文的標題和描述：

```ts
i18n: {
  locales: {
    'zh-hant': {
      messages: {
        fragments: {
          title: '隨手記',
          description: '記錄工作與生活的小事。',
        },
      },
    },
  },
},
```

<a id="shared-settings"></a>

## Fragments 還會用到哪些通用設定？

| 路徑                                                                                                           | 預設值與作用                                             | 限制、範例與完整說明                                                                                                                                               |
| -------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `theme.pagination.*`                                                                                           | 共用 Blog List 的八個分頁欄位及預設值                    | 多于一頁才顯示分頁；如 `theme: { pagination: { windowSize: 5 } }`。型別、範圍和逐欄位範例見[分頁設定](/zh-hant/blog/config-blog-list/#pagination-window)及其後各節 |
| `i18n.locales.<locale>.messages.blog.previous`、`next`、`paginationAria`、`jumpTo`、`jumpInputLabel`、`jumpGo` | string，內建目前語言文字，控制碎片分頁的可見及無障礙文字 | 如 `previous: '上一頁'`；見[分頁文字字典](/zh-hant/blog/config-blog-list/#pagination-messages)，不要改同名 fragments 欄位                                          |
| `i18n.locales.<locale>.messages.blog.backToTop`                                                                | string，內建目前語言文字                                 | 完整列表回到頂端按鈕；如 `backToTop: '回到頂端'`，見[文章介面文字](/zh-hant/blog/config-article/#article-messages)                                                 |
| `i18n.locales.<locale>.messages.home.viewAll`                                                                  | string，內建目前語言文字                                 | 首頁視窗底部歸檔連結的無障礙名稱還會結合碎片標題；如 `viewAll: '查看全部'`，見[首頁文字](/zh-hant/blog/config-home/#home-messages)                                 |
| `theme.math.enabled`                                                                                           | boolean / `true`                                         | 完整列表按目前頁內容決定是否需要數學樣式；如 `theme: { math: { enabled: false } }`，見[數學開關](/zh-hant/blog/config-article/#feature-switches)                   |

`theme.comments` 的完整公共參數見[Giscus 評論字典](/zh-hant/blog/config-comments/)；本篇明確列出碎片需要的連線欄位和綁定差異，不把文章的映射設定當成碎片設定。`theme.toc.enabled`、文章 OUTPUT、Red Queen 等文章功能不控制碎片列表；碎片也沒有 Blog List 的 Cards/List 切換。

<a id="content-fields"></a>

## 單條碎片的三個 frontmatter 欄位

這是 `src/content/fragments/<locale>/` 下 Markdown 檔案的欄位，**不寫進 site.config**。目前公開 schema 只有以下三項，沒有額外的相容欄位。

| 欄位      | 型別 / 預設值                     | 作用、狀態與限制                                                                             | 範例                                  |
| --------- | --------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------- |
| `id`      | string / 無，必填                 | 生效。恰好 8 位 ASCII 英文字母或數字；同一語言內不能重複。連結和評論都相依它，發佈後保持不變 | `id: 'aB3dE6gH'`                      |
| `pubDate` | 可轉換為 Date 的日期值 / 無，必填 | 生效。必須能解析成日期；決定排序，列表按 UTC 顯示。推薦帶時區的 ISO 字串，避免日期歧義       | `pubDate: '2026-11-13T08:00:00.000Z'` |
| `title`   | string，可省略 / 未設定           | 條件生效。選用的卡片標題，同時用於首頁預覽；不填也能發佈，不會自動取檔案名作為標題           | `title: '今天的小發現'`               |

```md
---
id: 'aB3dE6gH'
pubDate: '2026-11-13T08:00:00.000Z'
title: '今天的小發現'
---

這里寫正文。圖片和程式碼直接放在 Markdown 正文中。
```

使用 `npm run new-fragment -- --locales zh,en` 會生成一組共享新 ID 和目前時間的檔案。每次執行都生成新的 ID；補譯已有碎片時應沿用原 ID，不要重新生成身分。不同語言可以使用同一個 ID；同一語言重複會報錯。檔案名可改變，ID 不應隨檔案名或頁碼改變。舊格式 ID 不會自動遷移，隨意改 ID 會改變評論綁定和分享地址。

`description`、`heroImage`、`tags`、`draft`、單條 `comments` 等沒有對應的碎片設定消費邏輯，不要套用文章 frontmatter。特別是添加 `draft: true` 不能讓碎片變成草稿；不要把尚未公開的內容放進啟用的集合。

<a id="preview-and-links"></a>

## 首頁預覽、圖片和連結的固定行為

這些行為由實作決定，目前沒有額外公開欄位：

- **首頁條數：** 目前語言最新三條，不足三條就顯示實際數量。底部是「目前顯示條數 / 目前語言總數」的歸檔連結；不會讀取其他語言補足數量。
- **首頁摘要：** 從呈現後的內容提取文字、第一張可用 HTTP(S) 圖片及第一個程式碼塊。文字最多 180 個 Unicode 碼點；程式碼最多 8 行、800 個碼點，超出追加省略號。視窗卡片限制預覽高度，超出的部分不顯示；完整內容仍在列表中。標題單獨顯示。不是完整 Markdown 呈現，也沒有可設定的 previewCount 或 previewHeight。
- **圖片：** 支援處理的本機圖片通過已有圖片清單提供尺寸和 srcset；遠程或不支援處理的圖片不保證自動最佳化。完整列表每頁第一張圖片 eager / high，其余圖片 lazy，統一非同步解碼。準備原圖、生成尺寸和檢查產物見[圖片教學](/zh-hant/blog/starter-guide-images/)，不需要手動給碎片添加 heroImage。
- **穩定連結：** 分享地址是 `/<locale>/fragments/#<ID>`。腳本通過定位索引找到目前頁，必要時跳轉；新增內容或調整 pageSize 後仍按 ID 定位。刪除內容或改 ID 無法保留原目標。關閉 JavaScript 後一般分頁仍可使用，跨頁自動定位與複製按鈕不可相依。
- **語言切換：** 列表的語言切換連結進入目標語言的碎片首頁，不保證直接定位同 ID 的譯文。
- **公開內容：** 碎片 Markdown 聚合出口是 `/<locale>/fragments/index.md`。它不是站內搜尋或文章 RSS 的啟用開關；公開內容不要放敏感資訊。

首頁頭像、懸停動畫、視窗邊框和程式碼預覽高度目前不是 site.config 設定項；字典不提供不存在的設定。返回[設定總入口](/zh-hant/blog/config-reference/)查其他模組。
