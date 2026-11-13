---
tags: ['anglefeint', 'starter']
title: '使用指南 6：讓讀者留下評論'
subtitle: '連線 Giscus，開啟文章或碎片評論，並選擇多語言版本是否共用討論。'
description: '說明 Giscus 準備、主題設定、文章討論映射、多語言共享、碎片評論差異，以及常見設定和載入問題。'
pubDate: '2026-11-10'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

本篇是入門教學的第 6 / 8 篇。[檢視完整教學順序](/zh-hant/blog/starter-guide-1-configure-your-site/#tutorial-order) · [依欄位查設定字典](/zh-hant/blog/config-reference/)。

Anglefeint 使用 Giscus 提供評論，預設關閉。文章和碎片可以分別開啟，評論與反應保存在你設定的 GitHub Discussions 中，不需要給靜態部落格額外部署評論資料庫。

先完成一次儲存庫設定，再決定是否共享譯文討論即可。不要為了添加評論修改文章模板，也不需要給每篇文章粘貼 script。

## 1. 準備 GitHub 儲存庫和分類

打開 [Giscus 中文設定頁](https://giscus.app/zh-CN)，按頁面檢查並設定：

1. 使用自己的公開 GitHub 儲存庫作為評論存放位置，可以是部落格儲存庫，也可以是單獨的評論儲存庫。
2. 在儲存庫中啟用 Discussions。
3. 為該儲存庫安裝並授權 Giscus 應用。
4. 選擇一個討論分類，記下頁面生成的儲存庫和分類資訊。

設定頁會生成一段 script。主題只需要其中的欄位值：

| Giscus 生成屬性    | 填入主題的位置                                         |
| ------------------ | ------------------------------------------------------ |
| `data-repo`        | `theme.comments.repo`，形如 `yourname/your-repository` |
| `data-repo-id`     | `theme.comments.repoId`，儲存庫 ID，不是儲存庫名稱     |
| `data-category`    | `theme.comments.category`，實際分類名稱                |
| `data-category-id` | `theme.comments.categoryId`，分類 ID，不是分類名稱     |

不要將範例 ID、儲存庫網址或自己的用戶名當作實際 ID。分類不一定叫 Announcements，應該使用你實際選擇的名稱和對應 ID。無需安裝 Giscus npm 包，也不需要額外填寫 GitHub token 或密碼。

評論是外部服務：頁面需要能連線 Giscus 和 GitHub。訪客發表評論需要 GitHub 授權，也可以直接在對應的 GitHub Discussion 中參與；主題本身不提供匿名留言系統。具體外部服務行為以 [Giscus 官方說明](https://giscus.app/zh-CN)為準。

## 2. 先開啟一般文章評論

在 `src/site.config.ts` 的現有 `defineThemeConfig({...})` 物件中合併：

```ts
theme: {
  comments: {
    enabled: true,
    repo: 'yourname/your-repository',
    repoId: 'REPLACE_WITH_REPO_ID',
    category: 'Announcements',
    categoryId: 'REPLACE_WITH_CATEGORY_ID',
    mapping: 'pathname',
    lang: '',
  },
},
```

替換帳號、儲存庫、分類和兩個 ID 佔位值。已有 `theme` 或 `comments` 時直接修改其中的欄位，保留其他設定，不要重複建立同名物件。

這個例子開啟文章評論，按文章網址的路徑關聯討論。`/zh/blog/my-first-post/` 與 `/en/blog/my-first-post/` 是不同路徑，預設不會自動共用同一討論。跨語言共享預設 `false`；如果之前已經開啟過它，需要按後文說明還原對應映射，不能只改這一段範例。

文章頁只有啟用評論且四個儲存庫／分類欄位齊備時，才輸出評論組件。缺少這些欄位時可能沒有評論區域；填寫佔位值通常只能通過本機非空檢查，不能證明遠程儲存庫已設定成功。目前沒有單篇文章的 frontmatter 評論開關，不能靠 `comments: false` 只關閉某一篇。

範例中的 `lang: ''` 讓評論介面跟隨文章語言。主題預設其實是固定 `lang: 'en'`，所以希望跟隨頁面時要明確清空；其中 `zh` 映射為 `zh-CN`、`zh-hant` 為 `zh-TW`、`pt-br` 為 `pt`。它只改變介面文字，不翻譯訪客評論。

## 3. 確認評論真的連線成功

保存設定，在本機開發頁面打開一篇文章，向下找到評論區域。可以檢查它是否顯示正確儲存庫的討論，以及登錄、評論和反應入口是否可用。首次看到空討論不代表失敗：Giscus 可以在首次評論或回應時建立對應討論，打開頁面不一定立刻生成一條記錄。

發佈前停止 dev，再執行：

```bash
npm run doctor
npm run preview
```

doctor 包含檢查和建置，成功後無需緊接著重複執行 build。preview 只在本機顯示建置產物，不會發佈網站；正式網站需要重新部署。建置通過只說明本機設定和頁面能生成，不能代替瀏覽器中對真實儲存庫權限及服務連線的確認。

文章預設使用 `loading: 'lazy'`。這是傳給 Giscus iframe 的載入方式，不代表主題等到滾動時才輸出客戶端 script；文章頁面會輸出非同步的 Giscus 腳本。與之不同，碎片彈窗在點選評論按鈕後才載入客戶端。

所有評論參數的型別、預設值和範例見[Giscus 字典](/zh-hant/blog/config-comments/#connection)，已有評論時尤其要核對映射和共享約束。

## 4. 選擇文章如何關聯討論

一般使用保留 `pathname` 即可。需要改變時，先了解映射依據，已有評論的網站不要隨意切換：

| `mapping` 值 | 討論關聯依據與限制                                                           |
| ------------ | ---------------------------------------------------------------------------- |
| `'pathname'` | 頁面 URL 的路徑，不包含網域；更改文章路徑可能關聯到不同討論                  |
| `'url'`      | 完整頁面 URL；換網域也可能改變關聯                                           |
| `'title'`    | 瀏覽器頁面的 title；修改文章或網站標題可能影響關聯                           |
| `'og:title'` | 頁面的 Open Graph 標題                                                       |
| `'specific'` | 你填寫的固定 `term`；非共享模式必須非空                                      |
| `'number'`   | 已有 discussion 編號，填在 `number`；不是 issue 編號，此模式不會自動建立討論 |

這些映射交由 Giscus 查找討論，主題不在本機建立評論資料庫。嚴格匹配選項 `strict: '1'` 用於減少相似標題的模糊匹配，預設是 `'0'`。

非共享模式下，`term` 和 `number` 都是全站評論設定：把 `mapping` 改為 `specific` 並寫一個固定 term，會讓使用該設定的文章尋找同一討論；`number` 也會指向固定編號。它們不是給每篇文章自動分配不同討論的開關。

主題在文章評論啟用時驗證：`specific` 的 term 必須去除空白後非空；`number` 必須是正整數字串，例如 `'42'`，不能用數字 `42`、`'0'` 或小數。無效參數會使設定檢查失敗，可能阻止 dev 或 build。

## 5. 讓同一篇文章的譯文共享評論

希望中文與英文譯文共用討論，但不同文章各自獨立時，保留真實的儲存庫／分類欄位，並將映射部分合併為：

```ts
theme: {
  comments: {
    // 保留 enabled: true 和自己的 repo、repoId、category、categoryId。
    shareAcrossLocales: true,
    mapping: 'specific',
    term: '',
    number: '',
    strict: '1',
    lang: '',
  },
},
```

共享模式要求 specific、空 term、空 number 和字串 `'1'` 的 strict。空 term 在這裡是有意的：文章頁會用完整、不含語言目錄的 slug 填入它，而不是讓所有文章使用一個固定詞。

例如 `src/content/blog/zh/my-first-post.md` 與 `src/content/blog/en/my-first-post.md` 都使用 `my-first-post`；嵌套內容 `guides/setup` 與 `other/setup` 保留完整路徑，仍是不同討論。譯文必須保持相同 slug，不靠標題或內文相似度識別。

開啟共享且啟用文章評論後，錯誤 mapping、非空 term／number 或不為 `'1'` 的 strict 會明確報錯。一般包路由會提供文章 slug；自訂呼叫 BlogPost 的頁面也必須提供有效 articleSlug。語言介面仍由 lang 決定，不會自動翻譯評論內文。

驗證時打開同一篇的兩種譯文，再打開另一篇文章：前兩者應關聯同一討論，第三篇應獨立。不要只看介面語言或評論框外觀就判斷共享成功。

### 已有評論怎麼辦？

主題不會合併、搬遷或刪除舊討論。開啟共享後選中的討論可能變化，因此原評論可能仍在 GitHub，卻不出現在新的關聯下。

切換前保存原來的儲存庫、分類、mapping、term、number 和 strict。需要還原舊關聯時，設定 `shareAcrossLocales: false`，並還原這些欄位的原值；僅關閉共享但保留空 term 的 specific 設定，會報錯。確需整理討論時，先在 GitHub 檢查現有資料和關聯，主題不提供自動遷移。

## 6. 碎片評論可以獨立開啟

如果只想讓碎片接受評論，填寫同一組儲存庫／分類資訊，再設定：

```ts
theme: {
  fragments: {
    enabled: true,
    comments: { enabled: true },
  },
  comments: {
    enabled: false,
    repo: 'yourname/your-repository',
    repoId: 'REPLACE_WITH_REPO_ID',
    category: 'Announcements',
    categoryId: 'REPLACE_WITH_CATEGORY_ID',
  },
},
```

這裡的 `theme.comments.enabled: false` 只關閉文章評論，碎片使用 `theme.fragments.comments.enabled`。如果文章也需要評論，可以保留 true；不必為了碎片修改文章已有映射。

碎片固定使用 specific、嚴格匹配和 `fragment/<id>`，不使用文章的 mapping、term、number、shareAcrossLocales 或固定 lang。介面跟隨目前頁面語言，相同 ID 的譯文共用討論；反應、顏色主題和輸入欄位位置等仍重複使用共享設定。缺少四個儲存庫／分類欄位時，啟用碎片評論會直接報設定錯誤。

首次點選列表卡片的評論按鈕後才載入；關閉彈窗保留實例，再打開或切換碎片時重複使用。失敗或約 15 秒仍未就緒會提供重試。彈窗載入提示不是連線成功的證明。完整發佈、ID 和分享規則見[發佈一條碎片](/zh-hant/blog/starter-guide-5-fragments/)。

## 依需求調整：顯示和載入選項

下面這些欄位都位於 `theme.comments`；通常保留預設即可。

| 欄位               | 主題預設值    | 用途                                                                                            |
| ------------------ | ------------- | ----------------------------------------------------------------------------------------------- |
| `reactionsEnabled` | `'1'`         | 顯示 discussion 主帖反應；`'0'` 關閉                                                            |
| `inputPosition`    | `'bottom'`    | 評論輸入欄位位置，選用 `'top'`／`'bottom'`                                                      |
| `theme`            | `'dark'`      | 傳給 Giscus 的配色識別碼，支援值按其設定頁選擇；不是切換部落格主題                              |
| `strict`           | `'0'`         | 文章的嚴格匹配；共享文章模式和碎片強制使用 `'1'`                                                |
| `emitMetadata`     | `'0'`         | 讓 Giscus 向父頁面發送討論中繼資料；不是發佈文章的中繼資訊；碎片為判斷就緒狀態強制開啟          |
| `lang`             | `'en'`        | 文章評論介面固定語言；`''` 跟隨頁面；碎片始終跟隨頁面                                           |
| `loading`          | `'lazy'`      | 文章 iframe 可用 `'lazy'`／`'eager'`；碎片彈窗打開後的 iframe 使用 eager                        |
| `crossorigin`      | `'anonymous'` | 客戶端腳本的跨域屬性，選用 `'anonymous'`／`'use-credentials'`；通常無需修改，不替代 GitHub 登錄 |

`enabled`、`shareAcrossLocales` 是布林值 true／false；`strict`、`reactionsEnabled`、`emitMetadata` 使用字串 `'0'`／`'1'`。不要因為外觀相似就混用型別。

## 評論不出現或關聯不對時

| 現象                     | 檢查順序                                                                                                        |
| ------------------------ | --------------------------------------------------------------------------------------------------------------- |
| 文章完全沒有評論區域     | 文章開關是否 true、四個儲存庫／分類欄位是否齊備；碎片開關不控制文章                                             |
| 碎片啟用後直接報設定錯誤 | 是否填了全部儲存庫／分類欄位，不要只打開開關                                                                    |
| 出現遠程錯誤或持續載入   | 是否使用真實 ID、儲存庫公開、Discussions 開啟、應用獲得該儲存庫權限，分類是否匹配，以及網路或攔截器是否阻止請求 |
| 不同文章顯示同一討論     | 是否用了全域固定 term／number，是否缺少正確的共享模式設定；同時檢查 Giscus 的實際匹配結果                       |
| 譯文沒有共享             | shareAcrossLocales 是否開啟、slug 是否相同、共享映射約束是否滿足                                                |
| 切換映射後“评论消失”     | 先到 GitHub 檢視舊討論是否仍在；不要反復改標題、ID 或刪除討論嘗試還原                                           |
| 評論介面一直是英文       | 文章 lang 預設 en，需要跟隨頁面時設為 `''`；這不會翻譯訪客留言                                                  |
| 本機已修改，線上沒變化   | 是否重新建置並部署，線上頁面是否仍使用舊設定                                                                    |

關閉文章評論用 `theme.comments.enabled: false`，關閉碎片評論用 `theme.fragments.comments.enabled: false`。它們只停止相應入口／嵌入，不會替你刪除 GitHub Discussions 中的資料。升級工具不負責遷移討論；升級前保留現有映射，升級後核對關聯，升級步驟見[安裝教學](/zh-hant/blog/starter-guide-1-configure-your-site/)。

## 教學導覽與設定查閱

[上一篇：把頁面和功能調整成自己喜歡的樣子](/zh-hant/blog/starter-guide-3-comments-about-and-theme-toggles/) · [下一篇：讓更多語言的讀者使用部落格](/zh-hant/blog/starter-guide-languages/) · [八篇教學總入口](/zh-hant/blog/starter-guide-1-configure-your-site/#tutorial-order)。

本篇相關欄位：[Giscus 參數和共享討論](/zh-hant/blog/config-comments/)、[碎片評論開關](/zh-hant/blog/config-fragments/)。完整路徑、預設值和限制見[設定字典總入口](/zh-hant/blog/config-reference/)。
