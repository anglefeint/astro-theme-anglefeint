---
tags: ['anglefeint', 'starter']
title: '使用指南 2：寫第一篇文章'
subtitle: '建立文章、填寫標題和日期、寫內文，再用目錄、標籤、程式碼和公式組織內容。'
description: '從按預設流程建立文章到本機預覽，說明目前支援的文章欄位、Markdown 與 MDX、目錄、標籤、搜尋和統計。'
pubDate: '2026-03-07'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/cyber-03.webp'
---

本篇是入門教學的第 2 / 8 篇。[檢視完整教學順序](/zh-hant/blog/starter-guide-1-configure-your-site/#tutorial-order) · [依欄位查設定字典](/zh-hant/blog/config-reference/)。

完成[安裝與網站設定](/zh-hant/blog/starter-guide-1-configure-your-site/)後，日常寫作主要修改 `src/content/blog/` 中的文章檔案。標題、日期等單篇資訊寫在檔案頂部的 frontmatter 中；網站名稱、預設作者和全站開關仍在 `src/site.config.ts` 設定。

這篇先帶你按專案預設流程建立並預覽文章，再依需求選擇語言。後面的欄位速查依需求閱讀即可。

## 1. 按預設流程建立文章

在專案根目錄，也就是包含 `package.json` 的目錄，執行：

```bash
npm run new-post -- my-first-post
```

如果你在第一篇已經執行過這條指令，直接打開已有檔案繼續寫。同名檔案會跳過，不會覆寫你的內容。

未指定 `--locales` 或 `ANGLEFEINT_LOCALES` 時，指令為專案全部已啟用語言建立 `src/content/blog/<locale>/my-first-post.md`。初始設定啟用九種語言，因此會建立九份範本；調整過語言開關時，按目前啟用列表生成。它不會自動翻譯內文。

選擇自己要編輯的語言檔案，對應網址是 `/<locale>/blog/my-first-post/`，列表是 `/<locale>/blog/`。例如預設英文首頁下的文章為 `/en/blog/my-first-post/`，中文為 `/zh/blog/my-first-post/`，各語言需啟用。無需手動建立路由。

`my-first-post` 是文章的 slug，只使用小寫英文字母、數字和連字號，例如 `learning-astro-1`；不能包含空格、底線或 `/`。更改文章檔案名會改變網址，不會自動為舊連結建立重新導向。

指令會填入標題、簡介、當天的 UTC 日期和佔位內文。如果 `src/assets/blog/default-covers/` 有 WebP、PNG 或 JPEG 圖片，還會隨機選一張作為封面；沒有圖片則不填 `heroImage`，不會下載封面。生成後可以替換文字、日期和圖片。

### 只想建立指定語言時

以下是預設指令的選用用法。只建立中文時指定 zh，建立英文和中文時指定 en,zh；不必把這些範例逐條執行：

```bash
# 只創建中文
npm run new-post -- my-first-post --locales zh

# 創建英文和中文
npm run new-post -- my-first-post --locales en,zh
```

省略 `--locales` 時，指令預設讀取專案啟用的語言；若設定了 `ANGLEFEINT_LOCALES` 環境變數，則優先使用它。完整優先級是 `--locales` → `ANGLEFEINT_LOCALES` → 已啟用語言。同一次指令的新檔案共用所選封面，已有檔案保持不變。

指令只建立檔案，不會翻譯，也不會自動啟用語言。譯文放在對應語言目錄，保持相同 slug。文章詳情頁切換語言時，有同 slug 的譯文才進入譯文，否則前往目標語言的部落格列表。

## 2. 填寫標題、簡介和日期

打開生成的檔案。最頂部兩條 `---` 之間是 YAML frontmatter，後面才是內文。可以先寫成這樣；如果原檔案已有 `heroImage`，可以保留它：

```md
---
title: '我的第一篇文章'
description: '記錄我用 Anglefeint 搭建部落格的過程。'
pubDate: '2026-11-13'
tags: ['astro', '筆記']
---

這是我的第一篇文章。我準備在這里記錄學習過程和遇到的問題。

## 為什么開始寫部落格

寫下自己的想法，也給以后的自己留下線索。

### 先從一個小問題開始

今天先記錄安裝和發布過程。
```

將日期改成真實發佈日期。`title`、`description`、`pubDate` 是必填欄位；`tags` 可省略。標題已由文章頁顯示，內文通常從 `##` 開始，不必再寫一遍 `# 我的第一篇文章`。

- `title` 用於文章標題、列表及相關中繼資訊。
- `description` 是文章簡介，也用於頁面中繼描述；沒有另外填寫 `context` 時，還顯示在文章標題下的上下文行。
- `pubDate` 決定列表排序，按時間從新到舊排列。
- 實質修改已發佈文章後，可以添加真實的 `updatedDate`；它會顯示為更新日期，sitemap 也優先使用它，但不會替代 `pubDate` 進行列表排序。

日期建議用帶引號的 `YYYY-MM-DD`；需要準確時間時寫包含時區的 ISO 日期，例如 `'2026-11-13T09:00:00+08:00'`。文章頁以 UTC 日期顯示，帶時區的時間換算後可能跨日。

**目前沒有草稿或定時發佈過濾。** 預設生成的其他語言範本也會隨建置公開；發佈前完成需要的內容，將未準備公開的檔案移到 `src/content/blog/` 之外。`draft: true`、未來的 `pubDate` 和 `search: false` 都不能讓文章變成私密內容。

## 3. 寫內文，用標題組織內容

一般段落之間留一個空行。常用 Markdown 寫法如下：

```md
這是一段正文，可以使用 **加粗**、_強調_ 和 `行內程式碼`。

- 第一個要點
- 第二個要點

[連結文字](https://example.com/)

> 這是一段引用。
```

正常使用 `##` 和 `###` 後，文章會自動生成目錄。寬屏目錄在內文右側，窄屏在內文前方；沒有二級或三級標題時不顯示。四級及更深標題仍可用於內文，但不進入這個目錄。

單篇不需要目錄時，在已有 frontmatter 中加：

```yaml
toc: false
```

省略 `toc` 時繼承 `src/site.config.ts` 中的 `theme.toc.enabled`，預設開啟；`toc: true` 可以覆寫全站關閉設定。目錄使用編譯器提供的 Markdown 標題，MDX 組件內部或原始 HTML/JSX 生成的標題不屬於自動收集範圍。

### 用標籤整理文章

在 frontmatter 填寫 `tags: ['astro', '筆記']`，即可自動生成標籤入口和目前語言的標籤列表，無需手動添加路由。啟用標籤時可瀏覽 `/zh/tags/` 檢視。

標籤區分大小寫：`Astro` 和 `astro` 是兩個標籤。首尾空白會去掉，同一篇的重複標籤只計一次。直接使用頁面生成的標籤連結，中文和特殊字元有穩定編碼，不要手動猜路徑。重新命名標籤會改變對應連結。

全站 `theme.tags.enabled: false` 會關閉標籤入口和標籤頁面生成；文章本身仍然保留。

## 4. 插入程式碼和數學公式

程式碼塊使用三個反引號圍欄，後面寫語言名稱：

````md
```js
const message = 'Hello, world!';
console.log(message);
```
````

文章內文程式碼塊會自動添加複製按鈕，複製保留程式碼的換行和縮進。它複製文字，不會因為程式碼塊寫了 JavaScript 就執行其中程式碼。剪貼板不可用時會顯示失敗提示，可以手動選擇複製；需要啟用 JavaScript 才有該按鈕。

數學公式預設開啟，無需另外安裝插件。行內用 `$...$`，獨立公式寫在兩行 `$$` 之間：

```md
保存量為 $C_{saved}$。

$$
\frac{a}{b} = x_1 + x_2
$$
```

一般美元符號有歧義時寫成 `\$`；行內程式碼和程式碼塊中的內容保持原樣。公式在建置時用 KaTeX 呈現，支援其數學語法，不是完整 LaTeX 文檔。錯誤公式會使編譯或建置失敗，並提示來源；長獨立公式可以橫向滾動。

在 `src/site.config.ts` 已有的 `theme` 中合併 `math: { enabled: false }` 可以全站關閉數學。標題和簡介保持純文字，不要相依其中的數學標記呈現公式。

### 什麼時候使用 MDX？

一般寫作用 `.md` 即可。需要在文章中導入和使用組件時，可以使用 `.mdx`；主題同時收集這兩種擴展名，數學支援也適用於 MDX，不必自己再整合處理器。

`new-post` 生成的是 `.md`，需要時可將其改為 `.mdx`，保留 frontmatter。不要同時保留相同語言、相同檔案主名的 `.md` 和 `.mdx` 來充當兩篇文章，它們對應相同文章路徑。MDX 的組件和表達式需要遵循 MDX 語法，不要把它當成只改變擴展名的純文字。

## 5. 給文章添加圖片

內文圖片可以使用文章旁邊的檔案，也可以引用 `public/images/` 中的檔案。先放入實際圖片，再寫對應路徑：

```md
![照片內容的描述](./photo.jpg)

![照片內容的描述](/images/photo.jpg)
```

第一種相對於文章檔案；第二種對應 `public/images/photo.jpg`，網址不含 `public`。描述文字用於圖片的替代文字。

如果要更換封面，可以把 `cover.jpg` 放在文章旁邊，在 frontmatter 設定 `heroImage: ./cover.jpg`。`heroImage` 接受本機圖片，也可以省略；內文圖片、封面和分享圖片是不同用途，改封面不會自動把它插入內文。

一般內文圖片可點選，或聚焦後按 Enter／空格放大；Esc、關閉按鈕或蒙版可收起。封面以及連結、按鈕內部的圖片不參與該預覽。預覽使用瀏覽器已選中的圖片來源，不會另外請求更高清的原圖，也不提供相冊切換。

新增或更換封面後，本機 dev 或 doctor 會準備回應式檔案。提交原圖和整個 `src/assets/blog/covers/`（包含 manifest.json 和 generated/）；一般 dev、build 和 doctor（包含 CI）會自動補齊缺少、過期或損壞的衍生圖片，並重用正確的既有檔案。原圖缺失、無效圖片或不安全路徑仍會報錯。明確執行的 `prepare-covers --check` 與設定同步只驗證、不修復。將原圖及整個 `src/assets/blog/covers/` 提交到 Git 可以重用產物，不依賴部署平台保留圖片快取。 build 新行為的版本範圍見[圖片教學](/zh-hant/blog/starter-guide-images/)。此處的持久衍生規則用於封面及碎片本機圖片，一般文章內文圖片仍走原有 Markdown/MDX 圖片處理。

## 6. 在本機預覽，再準備發佈

執行 `npm run dev`，打開終端機地址下的 `/<locale>/blog/my-first-post/`；例如英文 `/en/blog/my-first-post/`、中文 `/zh/blog/my-first-post/`。確認標題、日期、內文、目錄、標籤和圖片符合預期；新增譯文時也檢查語言切換是否進入正確頁面。

發佈前停止開發服務，執行：

```bash
npm run doctor
npm run preview
```

doctor 包含檢查和建置，成功後無需立即再跑 check 或 build。preview 顯示已建置的 `dist/`，不會發佈網站。建置失敗時先修復錯誤，不要部署殘留產物。

### 搜尋為什麼在 dev 中搜不到文章？

全文索引在建置時生成。`npm run dev` 的搜尋入口顯示開發提示；在建置後的 preview 中搜尋一句內文，才能核對完整搜尋和文章跳轉。

預設搜尋目前語言的文章標題和內文。單篇不希望進入站內搜尋時，在 frontmatter 加 `search: false`；省略預設參與。它不阻止文章在列表、RSS、sitemap 或公開連結中出現。全站 `theme.search.enabled: false` 則同時關閉搜尋入口與索引生成。

修改文章後重新建置、部署，線上搜尋才會更新。公式和裝飾介面不作為搜尋內文。

想逐項查型別、預設值和目前未使用狀態，進入[文章設定字典](/zh-hant/blog/config-article/#frontmatter)；站內搜尋的獨立規則見[搜尋字典](/zh-hant/blog/config-search/#article-search)。下面保留寫作時常用的速查。

## 依需求查閱：其他文章欄位

這些都是文章 frontmatter 欄位，不要放進 `src/site.config.ts` 的 `site` 或 `theme` 中。一般文章不必逐項填寫。

### 標題區域與圖片

| 欄位        | 目前行為                                                                                                              |
| ----------- | --------------------------------------------------------------------------------------------------------------------- |
| `subtitle`  | 選用副標題；與上下文行文字相同時不重複顯示                                                                            |
| `context`   | 標題下上下文行的文字；省略時使用 `description`，設為 `''` 隱藏這行，不改變頁面中繼描述                                |
| `author`    | 單篇作者；省略或只有空白時使用網站作者                                                                                |
| `heroImage` | 本機文章封面，影響列表與文章詳情；可省略                                                                              |
| `ogImage`   | 手動指定分享預覽圖，優先于自動分享圖片；可用文章相對圖片路徑、`/images/share.png` 這樣的 public 路徑或 HTTPS 圖片直鏈 |

預設會為未指定 `ogImage` 的文章生成 1200×630 分享圖片，使用標題、作者和網站名稱；它不替換內文封面。設定全站 `theme.socialImage.enabled: false` 後停止自動生成，手動 `ogImage` 仍有效，其余文章回退到封面或網站預設圖。修改後需要重新建置和部署，分享平臺仍可能快取舊圖。

### OUTPUT 統計和選用狀態文字

| 欄位                | 目前行為                                           |
| ------------------- | -------------------------------------------------- |
| `wordCount`         | 覆寫自動字詞數，必須是非負整數                     |
| `tokenCount`        | 獨立覆寫 tokens 估算，必須是非負整數               |
| `aiModel`           | 顯示你填寫的模型標籤，出現在標題狀態區和 OUTPUT 中 |
| `aiMode`、`aiState` | 在標題狀態區顯示你填寫的模式、狀態文字             |

不填寫統計欄位時，主題從內文來源文字估算字詞數：CJK 漢字、假名及韓文字元逐個計數，其余主要按空白分詞。預設 tokens 為 `round(max(自動字詞數, 1) × 1.3)`，不是實際模型分詞器結果。只覆寫 `wordCount` 不會重新計算 tokens，需要時分別填寫。

統計會剔除部分 Markdown 內容，但不是完整的可見文字統計，公式與 MDX 原始碼可能影響結果。數字達到 1,000 時以一位小數的 `k` 顯示。模型、模式和狀態欄位只顯示文字，不會連線 AI 服務、驗證文章來源或執行任務。

### 相容欄位和目前不產生顯示的欄位

- `readMinutes`、`aiLatencyMs`、`aiConfidence`：仍接受舊文章資料，但目前文章頁不顯示閱讀時長、延遲或置信度。保留時型別分別為正整數、非負整數和 0–1 的數字；新文章不需要填寫。
- `canonicalTopic`：接受字串，目前未整合頁面、canonical 或導出邏輯，不會建立專題或改變文章網址。
- `sourceLinks`：接受來源地址陣列，支援 HTTP(S) 地址，裸網域會補 `https://`；目前只有資料驗證，不會自動顯示參考連結或加入導出內容。需要讀者看到來源時，直接在內文寫 Markdown 連結。

自訂未支援的欄位不會自動變成頁面功能；例如 `draft` 不提供草稿行為。優先使用上面已有的欄位和內文寫法。

## 教學導覽與設定查閱

[上一篇：安裝部落格，換成自己的資訊](/zh-hant/blog/starter-guide-1-configure-your-site/) · [下一篇：給文章和碎片添加圖片](/zh-hant/blog/starter-guide-images/) · [八篇教學總入口](/zh-hant/blog/starter-guide-1-configure-your-site/#tutorial-order)。

本篇相關欄位：[文章欄位、目錄和 OUTPUT](/zh-hant/blog/config-article/)、[標籤與列表](/zh-hant/blog/config-blog-list/)、[搜尋收錄](/zh-hant/blog/config-search/)。完整路徑、預設值和限制見[設定字典總入口](/zh-hant/blog/config-reference/)。
