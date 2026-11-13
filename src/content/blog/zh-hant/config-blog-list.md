---
tags: ['anglefeint', 'config']
title: '設定字典：Blog List 與標籤列表'
subtitle: '查詢每頁文章數、標籤開關、分頁視窗、跳頁、樣式和列表介面文字。'
description: '說明部落格歸檔與標籤列表實際使用的設定欄位、主題預設值、範圍限制、共享行為和範例，並區分瀏覽器偏好與網站設定。'
pubDate: '2026-11-13'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/cyber-03.webp'
---

**版本說明：** `blogPageSize` 嚴格驗證從 0.36.1 起提供，0.36.0 未包含。使用舊版時仍應填寫合理的正整數。

[返回設定字典總入口](/zh-hant/blog/config-reference/)。本篇覆寫部落格歸檔、標籤目錄、某個標籤下的文章列表，以及它們共用的分頁。以目前主題程式碼為準，不把展示站的文章數量或顏色當作預設值。

中文部落格入口為 `/zh/blog/`，第二頁為 `/zh/blog/2/`；標籤目錄為 `/zh/tags/`，單個標籤的文章列表使用頁面生成的連結。其他語言替換 zh，預設語言首頁的地址模式不會去掉這些路徑的語言前綴。

所有 TypeScript 範例合併到 `src/site.config.ts` 現有 defineThemeConfig 物件中。已有 theme、i18n、pagination 時修改其中的欄位，保留其他設定，不要重複添加同名物件。

## 1. 每頁顯示多少篇文章

<a id="page-size"></a>

### `theme.blogPageSize`

- **型別**：`number`。
- **主題預設值**：`10`。
- **作用**：部落格歸檔與每個標籤文章列表的每頁文章數，兩處共用。文章先按目前語言篩選，再按 pubDate 從新到舊排列。
- **狀態**：生效。
- **限制**：必須為正的安全整數。0、負數、小數、NaN、Infinity 及超出安全整數範圍的值會在解析設定時明確報錯，不會自動截斷或恢復預設值；0 不是關閉分頁的開關。
- **範圍**：不改變首頁最新文章數量，也不改變 Fragments 每頁條數。標籤目錄本身不按這個欄位分頁。

```ts
theme: { blogPageSize: 12 },
```

部落格沒有文章時仍生成第一頁；只有一頁時不顯示分頁組件。調整每頁數量後需要重新建置部署，原來存在的較大頁碼可能消失，主題不會為它們自動建立重新導向。

排序依據不是 updatedDate、檔案名或點選量。目前沒有 draft／未來日期過濾，也沒有列表排序欄位；文章內容規則見[寫第一篇文章](/zh-hant/blog/starter-guide-2-languages-and-routing/)。

## 2. 標籤入口與標籤頁面

<a id="tags-enabled"></a>

### `theme.tags.enabled`

- **型別**：`boolean`。
- **主題預設值**：`true`。
- **作用**：控制主題提供的標籤入口、標籤目錄和標籤文章列表。文章卡片及內文中的主題標籤連結也受它控制。
- **狀態**：生效。
- **限制**：設為 false 不會刪除 frontmatter 的 tags、文章或已有部署檔案；它也不是按標籤過濾部落格列表的開關。部落格列表中的標籤快捷入口還要求目前語言確實存在標籤；開啟但沒有標籤時，標籤目錄顯示空提示。

```ts
theme: { tags: { enabled: false } },
```

標籤來自文章 frontmatter 的 `tags` 陣列，不存在需要維護的 site.config 標籤注冊表。同篇標籤會去除首尾空白、丟棄空項並去重；大小寫仍區分，Astro 與 astro 不合併。

標籤目錄按包含文章數量降序排列，數量相同按標籤字串順序排列。特殊字元、中文、保留名稱和過長標籤有穩定編碼，使用頁面生成的連結；改標籤名稱可能改變路徑，不會自動保留舊地址。

卡片目前最多顯示兩個標籤，沒有提供控制顯示數量的設定。它不限制文章實際擁有多少標籤，也不限制標籤目錄收錄全部有效標籤。

## 3. 頁碼視窗與跳頁

<a id="pagination-window"></a>

### `theme.pagination.windowSize`

- **型別**：`number`。
- **主題預設值**：`7`。
- **作用**：影響分頁顯示哪些頁碼、邊界頁和省略號，不是每頁文章數。
- **狀態**：條件生效，只有多于一頁才有分頁組件。
- **限制**：正常數值會向下取整並限制在 5–21。它是頁碼視窗策略參數，不保證最終“所有数字、上一页／下一页和省略号加起来”恰好等於該值；請使用有限整數。

<a id="jump-threshold"></a>

### `theme.pagination.showJumpThreshold`

- **型別**：`number`。
- **主題預設值**：`12`。
- **作用**：總頁數嚴格大於臨界值時，才允許出現跳頁輸入；還需要 jump.enabled 為 true。
- **狀態**：條件生效。
- **限制**：正常數值向下取整後至少為 1。預設 12 頁不出現，13 頁才出現；它不是文章條數臨界值，設為 0 也不會被當作無條件顯示。

<a id="jump-enabled"></a>

### `theme.pagination.jump.enabled`

- **型別**：`boolean`。
- **主題預設值**：`true`。
- **作用**：允許顯示跳頁表單。
- **狀態與限制**：條件生效；必須同時滿足總頁數大於臨界值。false 只移除表單，頁碼和上一頁／下一頁連結仍在。跳頁互動需要 JavaScript，一般分頁連結不相依它。

<a id="jump-enter"></a>

### `theme.pagination.jump.enterToGo`

- **型別**：`boolean`。
- **主題預設值**：`true`。
- **作用**：允許在跳頁輸入中按 Enter 導覽。
- **狀態與限制**：條件生效；僅在跳頁表單存在時有作用。false 會阻止輸入欄位 Enter 提交，仍可點選跳轉按鈕。客戶端會去除輸入中的非數字字元，並將目標限制到實際頁碼範圍，不提供任意 URL 跳轉。

這些欄位可以一起設定：

```ts
theme: {
  pagination: {
    windowSize: 9,
    showJumpThreshold: 8,
    jump: { enabled: true, enterToGo: false },
  },
},
```

上述分頁行為也用於 Fragments；碎片每頁數量仍由它自己的 pageSize 決定。不要為了修改一個標籤列表，誤以為分頁設定只作用於該標籤。

## 4. 分頁外觀策略

<a id="style-enabled"></a>

### `theme.pagination.style.enabled`

- **型別**：`boolean`。
- **主題預設值**：`true`。
- **作用**：啟用分頁容器和頁碼按鈕的變體策略。
- **狀態與限制**：條件生效；false 使用基礎變體 1，不刪除分頁，不改變文章數量，也不是關閉整頁 Cyberpunk 效果。它不控制文章卡片或 Cards／List 切換控制項的隨機色。

<a id="style-mode"></a>

### `theme.pagination.style.mode`

- **型別**：`'random' | 'sequential' | 'fixed'`。
- **主題預設值**：`'random'`。
- **作用**：決定分頁外觀變體如何選擇。
- **狀態與限制**：條件生效；style.enabled 為 true 才使用該策略。三種模式如下：

| 模式       | 目前行為                                                                                       |
| ---------- | ---------------------------------------------------------------------------------------------- |
| random     | 建置時給出穩定的初始變體；客戶端初始化後為容器及按鈕重新取隨機變體，可能重複，不是持續輪換動畫 |
| sequential | 容器按頁碼依次選擇，按鈕按各自序號選擇；不同按鈕不一定同色，不按時間輪換                       |
| fixed      | 容器與按鈕使用 fixedVariant 指定的同一變體                                                     |

停用 JavaScript 時，保留靜態 HTML 中的初始樣式，不會執行客戶端隨機選擇。

<a id="style-variants"></a>

### `theme.pagination.style.variants`

- **型別**：`number`。
- **主題預設值**：`9`。
- **作用**：參與變體選擇的數量，使用編號 1 到 N；不是多選陣列，也不是全站主題數量。
- **狀態與限制**：條件生效；組件正常數值向下取整後限制在 1–12。但目前共享霓虹顏色只定義了 1–9，10–12 不應當理解為額外三套完整配色，可能回落到繼承／基礎色。建議使用 1–9，並保留預設 9 作為通常選擇。這個範圍說明不是新增顏色能力。

<a id="style-fixed"></a>

### `theme.pagination.style.fixedVariant`

- **型別**：`number`。
- **主題預設值**：`1`。
- **作用**：fixed 模式下指定變體編號。
- **狀態與限制**：條件生效；正常數值向下取整，並限制在 1 到目前 variants 範圍。random 和 sequential 不使用它來固定樣式；目前完整霓虹顏色建議選擇 1–9。請使用有限整數。

例如固定為第二種分頁外觀：

```ts
theme: {
  pagination: {
    style: { enabled: true, mode: 'fixed', variants: 9, fixedVariant: 2 },
  },
},
```

只想保留基礎分頁樣式，可以合併 `theme: { pagination: { style: { enabled: false } } }`。兩種範例選需要的使用，不必連續複製來回覆寫。

## 5. 列表標題、描述和分頁文字

<a id="archive-messages"></a>

以下完整前綴為 `i18n.locales.<语言>.messages.blog`，型別均為選用的 `string` 覆寫，狀態均為條件生效：只有使用到對應標題、描述或控制項時才出現。預設值經內建語言文字及回退解析；下表只列中文與英文，其他語言有自己的內建值。

| 欄位                 | 簡體中文預設 / 英文預設                                                                                          | 作用與限制                                                                           |
| -------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `title`              | 博客 / Blog                                                                                                      | 部落格第一頁頁面標題及隱藏的區塊標題，不是文章標題，也不替換固定的卡片切換按鈕文字   |
| `pageTitle`          | 博客 - 第 / Blog - Page                                                                                          | 部落格後續分頁標題前綴，也用於標籤後續頁的標題；程式碼追加頁碼，不處理自訂佔位符     |
| `archiveDescription` | 关于 AI 时代开发、Web 工程与系统架构的文章。 / Essays on AI-era craft, web engineering, and system architecture. | 部落格第一頁和標籤目錄的頁面中繼描述，不是每張文章卡片摘要                           |
| `pageDescription`    | 博客归档页 / Blog archive page                                                                                   | 部落格後續分頁的中繼描述前綴，程式碼追加頁碼和句號；不用於標籤文章列表的同一描述位置 |

```ts
i18n: {
  locales: {
    zh: {
      messages: {
        blog: {
          title: '文章归档',
          pageTitle: '文章归档 - 第',
          archiveDescription: '项目、阅读与学习笔记。',
          pageDescription: '文章归档分页',
        },
      },
    },
  },
},
```

<a id="pagination-messages"></a>

分頁相關欄位使用相同前綴和 string 型別：

| 欄位             | 簡體中文預設 / 英文預設 | 作用與限制                                             |
| ---------------- | ----------------------- | ------------------------------------------------------ |
| `previous`       | 上一页 / Previous       | 上一頁連結的可見文字及無障礙名稱；第一頁不顯示該連結   |
| `next`           | 下一页 / Next           | 下一頁連結的可見文字及無障礙名稱；最後一頁不顯示該連結 |
| `paginationAria` | 分页导航 / Pagination   | 分頁 nav 的無障礙名稱，不是額外可見大標題              |
| `jumpTo`         | 跳转到页 / Jump to page | 跳頁輸入旁的可見文字；表單滿足條件才顯示               |
| `jumpInputLabel` | 页码 / Page number      | 輸入欄位隱藏標籤，提供無障礙名稱；不會改變輸入格式     |
| `jumpGo`         | 跳转 / Go               | 跳頁提交按鈕文字，不改變目標路徑                       |

這些欄位也服務于標籤列表和 Fragments 的共享分頁。部落格路由對空 jumpTo／jumpInputLabel／jumpGo 另有英文備用文字，但標籤路由直接傳遞解析後的值；不要用空字串來跨頁面隱藏控制項。需要隱藏跳頁用 jump.enabled，保留有意義的無障礙名稱。

```ts
i18n: {
  locales: {
    zh: {
      messages: {
        blog: {
          previous: '前一页',
          next: '后一页',
          paginationAria: '文章分页',
          jumpTo: '前往第几页',
          jumpInputLabel: '目标页码',
          jumpGo: '前往',
        },
      },
    },
  },
},
```

## 6. 標籤目錄和共享入口文字

<a id="tag-messages"></a>

仍使用 `i18n.locales.<语言>.messages.blog`，型別為選用 string 覆寫，按一般介面文字回退。作用均相依相應區域存在：

| 欄位          | 簡體中文預設 / 英文預設 | 作用與限制                                                                            |
| ------------- | ----------------------- | ------------------------------------------------------------------------------------- |
| `tags`        | 标签 / Tags             | 標籤快捷入口、目錄和標籤列表標題，以及相關無障礙名稱；不修改文章的實際標籤文字或 slug |
| `allPosts`    | 全部文章 / All posts    | 返回全部文章的入口文字，也被首頁用作說明；不改變文章總數                              |
| `noTags`      | 暂无标签 / No tags yet. | 標籤目錄中沒有有效標籤時的提示；不是部落格無文章提示                                  |
| `taggedPosts` | 文章 / Posts            | 標籤所含文章數量的說明及標籤頁描述；不是手動設定計數                                  |

```ts
i18n: {
  locales: {
    zh: {
      messages: {
        blog: {
          tags: '按标签浏览',
          allPosts: '返回全部文章',
          noTags: '暂时没有可浏览的标签。',
          taggedPosts: '篇文章',
        },
      },
    },
  },
},
```

清空文字不會關閉對應功能，可能留下空白連結或不完整描述。關閉標籤用 theme.tags.enabled，而不是將 tags 文字設為 false 或空字串。

## 7. Cards／List、封面和其他邊界

<a id="view-and-limits"></a>

以下是目前實作行為，不是新增設定欄位：

- 部落格和標籤文章列表共用 Cards／List 切換。沒有記憶時預設 cards；啟用 JavaScript 後可切換，瀏覽器 localStorage 使用同一偏好鍵，所以跨部落格、標籤及語言頁面共用選擇。存儲不可用時仍可切換，但不保證記住。
- 目前沒有 site.config 的預設視圖、停用切換按鈕、視圖文字、列表列名或卡片顏色欄位。切換按鈕和歸檔欄使用組件內建語言表，自訂語言沒有專用表項時使用英文；不能用 messages.blog.title 修改它們。
- 目前呈現卡片的標題、日期、封面及最多兩個標籤；沒有設定項開啟卡片摘要、改變封面優先候選數量或指定按 updatedDate 排序。description 不會因改列表中繼描述就成為卡片摘要。
- 列表前兩張實際有封面的候選使用 eager／high，其余 lazy。List 視圖隱藏封面不保證這些候選不會下載；圖片準備與體積控制見[圖片教學](/zh-hant/blog/starter-guide-images/)。
- 主部落格分頁切換語言時，目標語言有相應頁碼就保留頁碼，否則回該語言部落格第一頁。標籤列表切換語言會尋找相同標籤文字，存在則進該標籤第一頁，不存在則進目標語言標籤目錄；不會自動翻譯標籤或匹配近義詞。
- homepage 最新文章數量和穿越效果見[首頁字典](/zh-hant/blog/config-home/)。公共導覽、搜尋開關、頁尾和評論不在本篇重新定義。

本篇未發現需要作為相容保留收錄的列表專用欄位；不要把不存在的 blogView、showExcerpt 或 cardTheme 當作已接受欄位。未提供設定的外觀能力不通過添加任意鍵生效。

## 修改後怎麼確認？

先在 dev 檢查部落格第一頁、後續分頁、標籤目錄和某個標籤列表。跳頁必須有足夠總頁數，樣式 fixed 要與 random 區分；中繼描述檢視頁面 head，隱藏標籤和無障礙名稱不能只憑頁面大字判斷。

修改每頁文章數或標籤名稱後，重新建置並完整部署，注意舊分頁／舊標籤檔案殘留。發佈前停止 dev，執行 npm run doctor 後再用 npm run preview 檢視建置結果；doctor 已含建置，無需立即重複 check 和 build。步驟見[安裝教學](/zh-hant/blog/starter-guide-1-configure-your-site/)和[部署教學](/zh-hant/blog/starter-guide-deployment/)。
