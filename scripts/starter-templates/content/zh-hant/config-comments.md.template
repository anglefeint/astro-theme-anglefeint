---
tags: ['anglefeint', 'config']
title: '設定字典：Giscus 評論和多語言討論共享'
subtitle: '文章與碎片的獨立開關、討論映射、語言和共享規則。'
description: '依實際程式碼查閱全部 Giscus 公共設定，說明預設值、型別、驗證條件、文章譯文共享和碎片評論覆寫規則。'
pubDate: '2026-11-13'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

初次設定先讀[讓讀者留下評論](/zh-hant/blog/starter-guide-4-giscus-comments/)，其中包含儲存庫準備和參數獲取。設定檔案位置見[安裝與網站資訊](/zh-hant/blog/starter-guide-1-configure-your-site/)，其他模組從[設定字典總入口](/zh-hant/blog/config-reference/)進入。

公共設定寫在 src/site.config.ts 的 theme.comments 中；評論預設關閉。下面列主題套件預設值，不以 demo 已連線的個人儲存庫為準。ID 和儲存庫參數會寫入頁面，是公開連線資訊，不要把 GitHub 瀏覽令牌或其他秘密填進去。

<a id="controls"></a>

## 先分清兩個評論開關

| 路徑                             | 型別 / 預設值   | 狀態、作用與限制                                                                                                   | 範例                                                                 |
| -------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------- |
| theme.comments.enabled           | boolean / false | 條件生效：文章評論；不控制碎片按鈕。文章連線參數缺少時可能不輸出評論區，不代表遠端服務已驗證成功                   | theme: { comments: { enabled: true } }                               |
| theme.fragments.comments.enabled | boolean / false | 條件生效：碎片列表評論；還需 theme.fragments.enabled 為 true。獨立于文章開關，必填連線欄位缺少會在生成碎片頁時報錯 | theme: { fragments: { enabled: true, comments: { enabled: true } } } |

文章沒有單篇 comments: false frontmatter 開關。碎片也沒有每條單獨的評論開關；首頁碎片預覽不顯示評論按鈕。碎片其他設定見[Fragments 字典](/zh-hant/blog/config-fragments/#comments-enabled)。

## theme.comments 的全部欄位

下表欄位的完整前綴均為 theme.comments.，例如 repo 的完整路徑是 theme.comments.repo。所有欄位在輸入的部分設定中均可省略，由主題預設值補齊。字串標志必須保留引號，不能寫成 true/false 或數字。

這些欄位都是條件生效：文章評論需要啟用並滿足輸出條件；碎片僅使用其中一部分，其余會覆寫或忽略。沒有通用的“空字符串恢复默认”規則，具體見每行。除明確驗證的映射約束外，型別正確和非空不等於 Giscus 遠端設定正確。

<a id="connection"></a>

### 儲存庫與分類

| 欄位         | 型別   | 預設值 | 作用、條件與限制                                                                                           | 範例值                            |
| ------------ | ------ | ------ | ---------------------------------------------------------------------------------------------------------- | --------------------------------- |
| `repo`       | string | `""`   | GitHub 的 owner/repo。文章側要求值為真才輸出；碎片側還檢查 trim 後非空。不要加首尾空格；主題不檢查遠端權限 | `"your-account/blog-discussions"` |
| `repoId`     | string | `""`   | Giscus 設定工具提供的儲存庫 ID，不是儲存庫名、數字序號或瀏覽令牌；文章與碎片共用                           | `"YOUR_REPOSITORY_ID"`            |
| `category`   | string | `""`   | 討論分類名稱；填寫 Giscus 提供的分類並與 categoryId 配套；不是部落格文章標籤                               | `"Announcements"`                 |
| `categoryId` | string | `""`   | Giscus 提供的分類 ID，不是分類名稱。文章要求值為真；碎片要求 trim 後非空，不驗證遠端真實性                 | `"YOUR_CATEGORY_ID"`              |

<a id="mapping"></a>

### 文章映射與嚴格匹配

| 欄位      | 型別                                                                   | 預設值       | 作用、條件與限制                                                                                                                      | 範例值                  |
| --------- | ---------------------------------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| `mapping` | 'pathname' \| 'url' \| 'title' \| 'og:title' \| 'specific' \| 'number' | `"pathname"` | 文章與討論的關聯方式，逐值含義見下文。共享模式必須 specific；碎片不使用這個欄位                                                       | `"pathname"`            |
| `term`    | string                                                                 | `""`         | 非共享文章在 specific 模式使用，去除首尾空白後必須非空；這是全站固定 term。共享模式必須留空，呈現時按文章 slug 填入；其他模式不傳此項 | `"my-fixed-discussion"` |
| `number`  | string                                                                 | `""`         | 非共享文章在 number 模式使用，trim 後必須為安全範圍內的正整數字串，不允許前導零、正號或小數；共享模式必須留空。其他模式不傳此項       | `"42"`                  |
| `strict`  | '0' \| '1'                                                             | `"0"`        | 文章嚴格匹配標志；是字串而非 boolean。共享模式要求 1；碎片固定覆寫為 1。並非將兩個相同標題的討論自動合併                              | `"1"`                   |

<a id="appearance"></a>

### 顯示、語言和載入

| 欄位               | 型別                             | 預設值        | 作用、條件與限制                                                                                                                       | 範例值        |
| ------------------ | -------------------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| `reactionsEnabled` | '0' \| '1'                       | `"1"`         | 顯示討論主帖的反應區域；文章與碎片共用，不等於停用所有評論操作                                                                         | `"1"`         |
| `emitMetadata`     | '0' \| '1'                       | `"0"`         | 讓 Giscus 向父視窗發送討論中繼資料；文章按設定傳遞，不會因此自動顯示評論統計。碎片固定為 1，供載入及討論切換狀態判斷                   | `"0"`         |
| `inputPosition`    | 'top' \| 'bottom'                | `"bottom"`    | 評論輸入欄位在評論列表上方或下方；文章與碎片共用，不改變整個評論區在頁面的位置                                                         | `"top"`       |
| `theme`            | string                           | `"dark"`      | 傳給 Giscus 的 iframe 主題，不是部落格 Matrix/Cyber/Hacker/AI 場景。文章與碎片共用；主題不驗證服務支援的名稱，也不會自動隨頁面場景切換 | `"dark"`      |
| `lang`             | string                           | `"en"`        | 文章評論介面語言。非空值直接傳給 Giscus；空字串按頁面語言映射。碎片始終跟隨頁面，忽略此項。不翻譯評論內文                              | `""`          |
| `loading`          | 'lazy' \| 'eager'                | `"lazy"`      | 文章 iframe 載入提示；不是延遲輸出整個 client.js。碎片固定 eager，但點選評論按鈕後才插入客戶端                                         | `"lazy"`      |
| `crossorigin`      | 'anonymous' \| 'use-credentials' | `"anonymous"` | 傳給 Giscus 客戶端 script 的 crossorigin 屬性，文章與碎片共用；不是儲存庫登錄憑據、GitHub token 或解決權限問題的開關                   | `"anonymous"` |

<a id="sharing"></a>

## theme.comments.shareAcrossLocales：文章譯文共享

- **型別 / 預設值：** boolean，可省略 / false。
- **狀態與作用：** 條件生效；文章評論開啟後，讓相同完整 slug 的不同語言版本綁定同一個討論。不同 slug 保持分開。
- **限制：** 要求 mapping 為 'specific'，term 和 number 在 trim 後均为空，strict 为字符串 '1'；不滿足會報設定錯誤，不能只打開布林開關。關閉文章評論時跳過這組啟用約束，但碎片仍有自己的連線檢查。
- **範例：** 下方共享設定片段。它不會翻譯評論、合併舊討論或改變碎片綁定方式。

| 文章檔案                             | 共享模式實際 term |
| ------------------------------------ | ----------------- |
| src/content/blog/zh/my-first-post.md | my-first-post     |
| src/content/blog/en/my-first-post.md | my-first-post     |
| src/content/blog/zh/guides/setup.md  | guides/setup      |
| src/content/blog/en/other/setup.md   | other/setup       |

按完整、不含語言目錄的 slug 關聯，不根據文章標題、canonicalTopic 或內文自動識別譯文。共享模式下標準文章路由會傳入 articleSlug；自訂呼叫 BlogPost 也必須提供非空、無首尾空白、無空路徑段及 . / .. 段的完整 slug。這個組件參數不是 site.config 欄位。

同一個儲存庫與分類中，同 slug 的多個網站也可能命中相同討論。它不是按網域額外隔離的資料庫。保留路徑的前提下，改變標題不改變共享 term；改 slug、儲存庫、分類或匹配策略可能關聯到另一條討論。

<a id="mapping-values"></a>

## mapping 各值的含義

| 值       | Giscus 使用的依據    | 限制及例子                                                           |
| -------- | -------------------- | -------------------------------------------------------------------- |
| pathname | 頁面的 URL 路徑      | 預設值；不同語言路徑通常不同，改路徑可能改變關聯                     |
| url      | 完整頁面 URL         | 換網域或地址可能影響關聯                                             |
| title    | 文檔 title           | 更改文章或網站標題可能影響關聯，不是只看內文 h1                      |
| og:title | 頁面 Open Graph 標題 | 取頁面已有中繼資訊，不通過 theme.comments 填標題                     |
| specific | 指定 term            | 非共享時是全站固定詞；共享時由每篇文章 slug 生成                     |
| number   | 已有 Discussion 編號 | 全站指向固定編號，填字串如 '42'；不是 issue 編號，也不會自動建立討論 |

以上關聯與建立行為交給 Giscus：未找到討論時，可在首次評論或反應時建立，單純打開頁面不保證建立。儲存庫需公開、啟用 Discussions 並安裝 Giscus 應用；具體操作見教學與[Giscus 官方設定頁](https://giscus.app/)。主題不在本機保存評論資料庫。

strict 為 '1' 時，Giscus 使用討論內文中的標題哈希做嚴格匹配，不是主題在本機比較兩個標題。早期已有討論可能需要補充匹配標記；參見[Giscus 嚴格匹配說明](https://github.com/giscus/giscus/blob/main/ADVANCED-USAGE.md#data-strict)。啟用共享或更改映射不會自動遷移、合併、刪除舊討論；舊評論可能仍在 GitHub，但不出現在新綁定下。遷移前先確定現有討論與新 term 的對應關系。

非共享時，specific + 一個固定 term 會讓所有使用該設定的文章尋找同一討論；number 也會全站指向同一編號。它們不是“每篇文章自动分配一个 ID”。與目前映射無關的 term/number 不發送給 Giscus；主題仍會對這兩個設定值執行 trim，因此不要用 null 或數字替代字串。

<a id="examples"></a>

## 可合併的設定範例

合併進 src/site.config.ts 現有 defineThemeConfig({...})，保留 import、export 和其他個人設定，不重複建立 theme。四個連線值必須從你自己的 Giscus 設定獲取；下方佔位值只能說明結構，不能用於線上驗證。

### 文章評論按路徑分開

```ts
theme: {
  comments: {
    enabled: true,
    repo: 'your-account/blog-discussions',
    repoId: 'YOUR_REPOSITORY_ID',
    category: 'Announcements',
    categoryId: 'YOUR_CATEGORY_ID',
    shareAcrossLocales: false,
    mapping: 'pathname',
    lang: '',
  },
},
```

### 同一篇文章的譯文共用討論

保留自己的連線參數，並將映射部分合併為：

```ts
theme: {
  comments: {
    enabled: true,
    shareAcrossLocales: true,
    mapping: 'specific',
    term: '',
    number: '',
    strict: '1',
    lang: '',
  },
},
```

預設 lang 實際為 'en'，不是“跟随页面”；上面明確用空字串啟用頁面語言映射。zh 轉為 zh-CN、zh-hant 轉為 zh-TW、pt-br 轉為 pt，其他程式碼直接傳入。語言是否被 Giscus 支援由服務決定；更改語言只改介面，不改變討論身分或翻譯已發評論。theme.comments 是全站設定，不在 i18n.locales 內分別複製。

theme 字串直接傳給 Giscus，常用例值是 'dark' 或 'light'；可用主題以及自訂 CSS 網址由 Giscus 負責，不會改變外層 AI 面板。需要自訂時查[官方主題說明](https://github.com/giscus/giscus/blob/main/ADVANCED-USAGE.md#data-theme)，主題套件不會驗證自訂 CSS 的內容和無障礙功能。

<a id="fragment-overrides"></a>

## 碎片評論使用公共設定的哪些部分？

| 公共欄位                                               | 碎片實際行為                                                                   |
| ------------------------------------------------------ | ------------------------------------------------------------------------------ |
| repo / repoId / category / categoryId                  | 共用；四項 trim 後必須非空。原值繼續傳遞，設定時不要加首尾空白；不驗證遠端權限 |
| theme / reactionsEnabled / inputPosition / crossorigin | 共用原設定                                                                     |
| enabled                                                | 忽略文章開關，使用 theme.fragments.comments.enabled                            |
| shareAcrossLocales                                     | 不使用；同一穩定 ID 本身就綁定同一討論                                         |
| mapping / term / number                                | 固定 specific，term 為 `fragment/<ID>`，不發送 number                          |
| strict / emitMetadata                                  | 固定 '1' / '1'                                                                 |
| lang                                                   | 不使用公共 lang，始終按目前碎片頁面語言映射                                    |
| loading                                                | 固定 eager，但首次點選評論按鈕後才插入客戶端                                   |

例如只開啟碎片評論、關閉文章評論：

```ts
theme: {
  comments: {
    enabled: false,
    repo: 'your-account/blog-discussions',
    repoId: 'YOUR_REPOSITORY_ID',
    category: 'Announcements',
    categoryId: 'YOUR_CATEGORY_ID',
  },
  fragments: { enabled: true, comments: { enabled: true } },
},
```

同 ID 的多語言碎片共享 `fragment/<ID>`，與文章 slug 共享是兩套規則。不要為改變排序或分頁修改穩定 ID。彈窗首次點選才載入；關閉後保留 iframe，切換內容通過 Giscus 設定消息更新討論，約 15 秒沒有有效載入結果會顯示失敗與重試。沒有公開的評論超時或預載入設定。即使只想設定碎片，如果同時啟用文章評論，文章映射驗證仍會執行。

<a id="messages"></a>

## 頁面自身的評論文字

這些是 `i18n.locales.<语言>.messages` 下的 string 欄位，均可省略，預設使用目前語言內建文字與回退鏈。範例值寫到對應物件；只改變外層標籤，不替換 Giscus iframe 內部按鈕。表中僅列中文 / 英文預設值。

| 相對欄位             | 簡體中文 / 英文預設值                                                                                                     | 狀態、作用與限制                                           | 範例值               |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- | -------------------- |
| `blog.comments`      | 评论 / Comments                                                                                                           | 條件生效：文章評論區域的無障礙名稱，不是可見的額外標題     | `"文章讨论"`         |
| `fragments.comments` | 评论 / Comments                                                                                                           | 條件生效：碎片評論按鈕與彈窗標題                           | `"参与讨论"`         |
| `fragments.close`    | 关闭 / Close                                                                                                              | 條件生效：彈窗關閉按鈕；也用於首頁碎片視窗關閉的無障礙名稱 | `"关闭窗口"`         |
| `fragments.loading`  | 正在加载评论… / Loading comments…                                                                                         | 條件生效：碎片評論載入狀態                                 | `"正在加载讨论…"`    |
| `fragments.error`    | 评论未能加载，请检查网络或评论配置后重试。 / Unable to load comments. Check your network or comment settings, then retry. | 條件生效：碎片評論失敗提示                                 | `"讨论暂时不可用。"` |
| `fragments.retry`    | 重试 / Retry                                                                                                              | 條件生效：碎片評論失敗後的重試按鈕                         | `"重新加载"`         |

文章和碎片其他文字分別見[文章字典](/zh-hant/blog/config-article/#article-messages)和[Fragments 字典](/zh-hant/blog/config-fragments/#fragment-messages)。這些欄位不決定 iframe 內部語言，後者使用前文的 lang 規則。

<a id="limits"></a>

## 載入與驗證邊界

文章輸出非同步 client.js；loading: 'lazy' 傳給 Giscus iframe，並不表示主題等滾動到評論區才插入 script。碎片則先輸出模板，點選後才插入客戶端；它的 eager 指點選後的 iframe 行為。[官方載入說明](https://giscus.app/)區分了這兩層。

本機程式碼檢查文章映射約束和碎片必填項，不證明 GitHub 登錄、應用授權、儲存庫可見性、分類、網路或服務端可用。文章連線欄位為空時可能直接不呈現；只含空格的字串仍可能通過文章輸出條件，不能當成正確設定。碎片的非空檢查更嚴格，但同樣不能驗證 ID 真偽。

目前所有 theme.comments 欄位都有消費位置；不是所有欄位都對碎片生效，覆寫關系已列出。不存在公開的單篇評論開關、自託管服務地址、評論排序、管理員 token 或本機資料庫設定；客戶端固定使用 https://giscus.app/client.js。Giscus 自身的儲存庫級設定不等於新增的 site.config 欄位。

修改設定後重新建置部署；建置通過不等於真實評論服務驗收通過。已有討論的遷移和權限操作需在 GitHub/Giscus 側處理，不會在保存 site.config 時自動完成。返回[設定總入口](/zh-hant/blog/config-reference/)查其他模組。
