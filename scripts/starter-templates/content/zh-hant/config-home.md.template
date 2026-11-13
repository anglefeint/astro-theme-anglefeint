---
tags: ['anglefeint', 'config']
title: '設定字典：首頁'
subtitle: '查詢首頁標題、介紹、最新文章、提示文字、寬屏終端機和點選穿越的實際設定。'
description: '首頁設定欄位的型別、主題預設值、生效範圍、限制和可合併範例，並說明共享設定和目前沒有提供的開關。'
pubDate: '2026-11-13'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

[返回設定字典總入口](/zh-hant/blog/config-reference/)。本篇說明實際首頁使用的欄位，不改變主題程式碼，也不把展示站個人設定當成預設值。

下面 `<语言>` 換成專案實際啟用的語言代碼。範例使用 zh；它只修改中文設定，不會自動改變英文或啟用一種語言。所有片段都合併到 `src/site.config.ts` 現有的 defineThemeConfig 物件中，已有 theme、i18n 或 site 時保留其中其他欄位。

## 1. 首頁大標題、介紹和中繼描述

<a id="home-title"></a>

### `i18n.locales.<语言>.site.homeTitle`

- **型別**：選用 `string`。
- **主題預設值**：未設定。各內建語言預設沒有單獨的 homeTitle，最終使用全站名稱（預設 My Blog）。
- **作用**：首頁可見大標題。
- **狀態與限制**：條件生效；依次尋找目前語言及其回退語言去除首尾空白後的非空標題，全部沒有才使用全站名稱。`''` 或空白不能用來隱藏大標題。它不改變瀏覽器標題、導覽、頁尾、RSS 或 SEO 的全站名稱。

<a id="home-hero"></a>

### `i18n.locales.<语言>.site.hero`

- **型別**：選用 `string`。
- **主題預設值**：內建語言各有介紹；簡體中文為“在这里写一段站点简介，并告诉读者你将发布什么类型的内容。”，英文為“Write a short introduction for your site and what readers can expect from your posts.”。其他語言使用各自內建值。
- **作用**：首頁大標題下的可見介紹。
- **狀態與限制**：條件生效；查找目前語言及回退語言的已定義值。`''` 是主動清空，不再繼續回退。這裡是文字，不解析 Markdown 或 HTML，也不改變頁面中繼描述。

<a id="home-description"></a>

### `i18n.locales.<语言>.messages.siteDescription`

- **型別**：選用覆寫，值為 `string`。
- **主題預設值**：內建目前語言文字；簡體中文為“电影感网页界面与 AI 时代工程实践文章。”，英文為“Cinematic web interfaces and AI-era engineering essays.”。
- **作用**：首頁傳給頁面頭部的描述，不是可見介紹。
- **狀態與限制**：條件生效；先解析介面文字及回退，再使用該值，只有解析結果為空字串才回退到全站 description。空字串不是關閉全部頁面描述的開關；空白字串也不會自動 trim 為無描述。

三個欄位可以一起設定，彼此職責獨立：

```ts
i18n: {
  locales: {
    zh: {
      site: {
        homeTitle: '我的数字花园',
        hero: '记录开发、阅读和生活。',
      },
      messages: { siteDescription: '个人项目与学习笔记。' },
    },
  },
},
```

<a id="site-fallbacks"></a>

### 關聯通用欄位：`site.title`、`site.description`

本節只說明首頁關系：site.title 是沒有有效 homeTitle 時的最終標題回退，site.description 是首頁語言中繼描述為空時的備用值。兩者都不是首頁獨占欄位。型別、主題預設值、環境覆寫與完整範例統一見[網站身分字典](/zh-hant/blog/config-site-chrome/#identity)。

## 2. 最新文章數量

<a id="latest-count"></a>

### `theme.homeLatestCount`

- **型別**：`number`。
- **主題預設值**：`3`。
- **作用**：從目前語言按 pubDate 降序排列的文章中，取前 N 篇顯示在首頁。內容少于 N 時只顯示已有文章，旁邊計數顯示實際條數／該語言總條數。
- **狀態與限制**：生效；目前直接使用陣列 slice，沒有專門的正整數驗證。建議合理正整數，不要使用負數、小數、NaN 或 Infinity。`0` 會得到空列表，並顯示“没有文章”的提示，即使該語言已有文章；它不是隱藏整個最新文章區的開關。
- **獨立範圍**：不改變 Blog List 每頁數量，也不改變首頁碎片最多三條的預覽數量。

```ts
theme: { homeLatestCount: 5 },
```

文章標題、日期和摘要來自文章內容，不是這個欄位的子設定。首頁沒有「自動補上已翻譯文章以外的其他語言內容」的自動補齊邏輯。

## 3. 啟動提示和底部狀態

<a id="startup-switches"></a>

下列三個欄位型別均為 `boolean`，主題預設值均為 `true`，狀態均為生效。設為 false 只隱藏對應部分，省略則保留預設。

| 完整路徑                    | 作用                                         | 限制                                                     |
| --------------------------- | -------------------------------------------- | -------------------------------------------------------- |
| `theme.home.showInitialize` | Initialize／done 啟動文欄位                  | 只控制該段顯示，不控制首頁內文或背景載入                 |
| `theme.home.showFollow`     | Wake Up／Follow The White Rabbit 提示段      | 與上一段獨立，不是開啟頁面導覽的條件                     |
| `theme.home.showTrace`      | 首頁底部 PIRATE SIGNAL／TRACE PROGRAM 狀態區 | 不控制寬屏終端機；文字用於氛圍，不表示真實追蹤或網路狀態 |

```ts
theme: {
  home: {
    showInitialize: false,
    showFollow: true,
    showTrace: false,
  },
},
```

同時關閉前兩項會移除對應啟動文字組件。目前沒有 site.config 欄位修改這些固定啟動句、底部固定狀態文字或它們的時間參數；不要猜測 startupText、traceText 等設定名。

## 4. 首頁介面文字

<a id="home-messages"></a>

以下均位於 `i18n.locales.<语言>.messages.home`，是選用的 `string` 覆寫，一般欄位按介面文字回退規則解析。這裡列簡體中文與英文內建預設值，其他內建語言有自己的文字。

| 完整路徑末段 | 簡體中文預設 / 英文預設                                         | 作用與限制                                                               |
| ------------ | --------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `latest`     | 最新 / Latest                                                   | 最新文章區標題；只改文字，不改變排序或條數                               |
| `viewAll`    | 全部 / All                                                      | 首頁文章歸檔入口文字，也用於碎片歸檔連結的無障礙說明；不會改變連結目的地 |
| `noPosts`    | 该语言暂时没有文章。 / No posts available in this language yet. | latestPosts 為空時的提示；不是草稿或發佈控制                             |
| `openDoor`   | 开门 / Open door                                                | 寬屏終端機鑰匙孔按鈕的無障礙名稱及預覽標籤；通常不是一直可見的內文標題   |

這些欄位是條件生效：對應區域存在時才有可見或無障礙效果。空字串可以清空文字，但不會刪除容器或關閉功能，也可能使按鈕失去有意義的名稱；需要控制顯示時使用相應功能開關。

```ts
i18n: {
  locales: {
    zh: {
      messages: {
        home: {
          latest: '最近更新',
          viewAll: '全部文章',
          noPosts: '这里还没有文章。',
          openDoor: '打开走廊预览',
        },
      },
    },
  },
},
```

<a id="home-transmission"></a>

### `i18n.locales.<语言>.messages.home.transmission`

- **型別**：選用的 `string` 覆寫。
- **主題預設值**：`'Knock, knock.'`，包括中文在內，沒有個人覆寫時共用這一句。
- **作用**：寬屏終端機中選用擇、滾動的文字。
- **狀態與限制**：條件生效；終端機在可視區域寬度至少 1440px 時顯示。取值順序單獨固定為目前語言個人設定 → 英文個人設定 → 預設句，不使用其他一般文字的完整回退鏈。`''` 會清空文字，不隱藏終端機或關閉走廊。

例如設定所有沒有單獨覆寫的語言共用的文字：

```ts
i18n: {
  locales: {
    en: { messages: { home: { transmission: '这里留下一点线索。' } } },
  },
},
```

在 zh 的相同位置填寫則只覆寫中文。修改文字不會查詢真實網路信號，也不改變鑰匙孔開啟走廊的行為。

<a id="message-hero"></a>

### `i18n.locales.<语言>.messages.home.hero`

- **型別**：選用的 `string` 覆寫。
- **主題預設值**：內建目前語言介紹，簡體中文和英文分別與上面的 site.hero 預設句相同。
- **作用**：只有 getSiteHero 沒有從目前語言和回退語言取得已定義值時，才作為首頁介紹的備用文字。
- **狀態與限制**：條件生效，不是廢棄欄位。但所有內建語言預設已有 site.hero，所以通常只改這個欄位看不到變化；把 site.hero 改成 `''` 也不會觸發它。一般應直接修改 site.hero。

```ts
i18n: {
  locales: {
    zh: { messages: { home: { hero: '仅在没有可用 site.hero 时使用的介绍。' } } },
  },
},
```

這個例子說明路徑與型別，不會繞過更高優先級的 site.hero。無需為了改首頁介紹刪除預設設定或修改相依原始碼。

## 5. 點選文章時的 Matrix 穿越

<a id="home-passage"></a>

### `theme.effects.enableHomePassage`

- **型別**：`boolean`。
- **主題預設值**：`false`。
- **作用**：在首頁，一般點選最新文章標題以及導覽中帶該效果的部落格入口時，先播放 Matrix 穿越，再導覽。正常時間軸約 8 秒，有完成／異常回退導覽處理。
- **狀態與限制**：條件生效；需要 JavaScript。減少動態效果、修飾鍵點選、非左鍵、下載連結、外站連結或新視窗目標等情況保留原生行為。它不延遲首頁內文出現，也不控制 About Oracle 或寬屏終端機預覽。

```ts
theme: { effects: { enableHomePassage: true } },
```

關閉時這些連結直接導覽。這個布林開關沒有提供時長、場景顏色或目標網址的設定；不要添加 homePassageDuration 等未公開欄位。

## 6. 首頁也會用到的共享設定

<a id="shared-settings"></a>

這些欄位不屬於首頁獨占功能；這裡保留首頁使用關系，完整定義在主字典中查閱。

| 完整路徑                                       | 首頁使用關系                                                         | 主說明                                                        |
| ---------------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------- |
| `theme.fragments.enabled`                      | 目前語言有碎片時顯示頭像入口，同時影響完整碎片列表；預覽固定最多三條 | [Fragments 開關](/zh-hant/blog/config-fragments/#enabled)     |
| `i18n.locales.<语言>.messages.blog.allPosts`   | 最新文章數量的提示和歸檔入口的無障礙名稱                             | [列表共享文字](/zh-hant/blog/config-blog-list/#tag-messages)  |
| `i18n.locales.<语言>.messages.fragments.title` | 頭像入口的無障礙名稱，不是在頭像旁顯示標題                           | [碎片文字](/zh-hant/blog/config-fragments/#fragment-messages) |
| `i18n.locales.<语言>.messages.fragments.close` | 首頁預覽關閉按鈕的無障礙名稱，不改變按鈕圖形                         | [碎片文字](/zh-hant/blog/config-fragments/#fragment-messages) |

開啟後沒有頭像，先檢查目前語言是否確有碎片，不要為了顯示頭像複製已有碎片 ID。圖片、程式碼和限高規則見[Fragments 字典](/zh-hant/blog/config-fragments/#preview-and-links)，發佈步驟見[發佈一條碎片](/zh-hant/blog/starter-guide-5-fragments/)。

## 7. 目前沒有提供的首頁設定

<a id="unsupported-settings"></a>

`messages.siteTitle` 目前不改變標準首頁或公共網站名稱；不要用它替代 homeTitle 或頂層 site.title。欄位的型別、預設值和範例統一見[目前未使用的網站標題欄位](/zh-hant/blog/config-site-chrome/#legacy-site-title)。

程式碼雨密度和顏色、首頁鏡面按鈕、頭像素材、碎片預覽條數、固定啟動句，以及穿越時長目前沒有相應 site.config 欄位。它們屬於現有布局、樣式或腳本實作；不能因為 TypeScript 範例中隨意增加一個名字就讓它生效。Reduced Motion 會影響效果呈現，但不是本篇新增的設定開關。

首頁 `/` 與語言首頁的關系由 i18n.defaultLocale 和 i18n.routing.defaultLocalePrefix 控制，不在本篇重複完整定義，見[語言與地址字典](/zh-hant/blog/config-languages/#routing)。公共導覽、頁尾、音樂和統計同樣不是首頁獨立設定。

## 修改後怎麼確認？

先在 dev 打開目標語言首頁，檢查修改的是標題、介紹、中繼描述還是無障礙說明。終端機文字要在至少 1440px 的可視區域驗證；中繼描述檢視頁面 head，按鈕名稱通過無障礙名稱或 title 確認，不能只看頁面有沒有大字。

環境覆寫值改動後重啟 dev；正式網站需要重新建置和部署。發佈前可停止 dev 後執行 npm run doctor，再執行 npm run preview；doctor 已含建置，不需要立即重複執行 check 和 build。操作步驟見[安裝教學](/zh-hant/blog/starter-guide-1-configure-your-site/)與[部署教學](/zh-hant/blog/starter-guide-deployment/)。
