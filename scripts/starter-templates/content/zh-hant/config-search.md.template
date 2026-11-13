---
tags: ['anglefeint', 'config']
title: '設定字典：搜尋與內容發現'
subtitle: '搜尋入口、文章收錄、語言索引與其他內容入口。'
description: '以實際程式碼說明站內搜尋設定、文字和單篇收錄規則，區分搜尋、最新文章、相關文章、標籤、RSS 與機器閱讀出口。'
pubDate: '2026-11-13'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/cyber-02.webp'
---

先寫文章可讀[寫第一篇文章](/zh-hant/blog/starter-guide-2-languages-and-routing/)，本機預覽和部署見[發佈教學](/zh-hant/blog/starter-guide-deployment/)。設定位置與安裝見[第一篇教學](/zh-hant/blog/starter-guide-1-configure-your-site/)，其他模組從[設定字典總入口](/zh-hant/blog/config-reference/)進入。

本篇區分兩件事：搜尋框從建置生成的索引檢索文章；首頁最新文章、標籤、文章底部推薦和 RSS 等是其他內容入口，不由搜尋開關統一控制。預設值來自主題套件，不是 demo 的覆寫值。

<a id="enabled"></a>

## theme.search.enabled：全站搜尋開關

- **型別 / 預設值：** boolean / true。
- **狀態與作用：** 生效。公共頁頭顯示搜尋入口，參與搜尋的文章輸出索引標記，建置完成後生成靜態 Pagefind 資源。
- **限制：** false 同時關閉標準頁頭入口和本次建置的索引生成；單篇 search: true 不能越過全域關閉狀態。關閉不等於刪除文章、停用搜尋引擎收錄或清除託管平臺以前部署的索引檔案。
- **範例：** theme: { search: { enabled: false } }。

這是唯一的 theme.search 公開葉子欄位。沒有公開的搜尋服務地址、API key、索引目錄、結果排序、關鍵詞權重或跨語言檢索開關。主題目前使用建置期 Pagefind，部署後不需要單獨執行搜尋後端。

<a id="article-search"></a>

## 單篇 search：不是 site.config 欄位

| 位置                                                           | 型別 / 預設值                                      | 狀態、作用與限制                                                                                                | 範例          |
| -------------------------------------------------------------- | -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ------------- |
| `src/content/blog/<locale>/some-post.md` 的 frontmatter.search | boolean，可省略 / schema 未設定，文章布局預設 true | 條件生效：全域搜尋開啟時決定是否輸出該篇索引根標記；false 不影響列表、相關文章、RSS、機器閱讀出口或公開文章地址 | search: false |

只排除這篇文章的站內搜尋收錄，可以在已有 frontmatter 中添加：

```yaml
search: false
```

不要把它寫成 theme.search: false，或在 site.config 頂層新增 search: false。也不要把 frontmatter.search 當作私密文章開關。目前沒有 draft 或未來發佈日期過濾；未公開內容應放在內容集合之外。完整文章欄位見[文章字典](/zh-hant/blog/config-article/#frontmatter)。

### 哪些內容進入索引？

標準文章布局在全域與單篇開關同時允許時輸出 data-anglefeint-search 根標記。目前明確標記的內文區域包含文章標題、可見副標題和內文；與副標題相同的 context 只按副標題位置處理一次，不是單獨給所有 context 建欄位索引。

導覽、播放器、頁尾、評論和相關文章不作為文章內文一起收錄。frontmatter.description 不是此搜尋 UI 直接使用的結果摘要，標籤也不是可設定的搜尋過濾器；搜尋結果使用 Pagefind 返回的標題中繼資料與內文摘要。只出現在圖片像素、影片或音頻中的文字不會被主題做 OCR 或轉寫。

預設 About、Fragments、Decoder、首頁和列表沒有文章索引根標記，不因搜尋開關開啟而自動成為搜尋結果。自訂頁面需要自己遵守索引標記約定；這不是添加一個不存在的 site.config 欄位就能啟用的功能。

<a id="messages"></a>

## messages.search：十一項搜尋文字

完整前綴是 `i18n.locales.<locale>.messages.search.`。以下均為可省略的 string，預設取內建目前語言文字與語言回退鏈。表中只列中文 / 英文預設值；每行範例是欄位值。所有欄位條件生效：搜尋入口存在且對應介面或狀態出現時使用。

| 欄位          | 簡體中文 / 英文預設值                                                                                                                | 作用、限制與佔位符                                                                   | 範例值                              |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ | ----------------------------------- |
| `label`       | 搜索 / Search                                                                                                                        | 搜尋入口按鈕的無障礙名稱、提示及彈窗標題；不是要搜尋的關鍵字                         | `"搜索文章"`                        |
| `close`       | 关闭搜索 / Close search                                                                                                              | 關閉按鈕的無障礙名稱和提示；可見 esc 提示及圖標由實作固定                            | `"關閉搜索"`                        |
| `placeholder` | 搜索文章… / Search articles…                                                                                                         | 搜尋框佔位文字及其無障礙標籤；不預填關鍵字                                           | `"輸入文章關鍵詞"`                  |
| `hint`        | 搜索当前语言的文章。 / Search articles in the current language.                                                                      | 正式環境環境中沒有輸入關鍵字時的提示                                                 | `"搜索當前語言的文章。"`            |
| `loading`     | 正在搜索… / Searching…                                                                                                               | 正在檢索或準備檢索的提示，不改變延遲與資源載入策略                                   | `"正在查找…"`                       |
| `empty`       | 没有找到匹配的文章。 / No matching articles.                                                                                         | 沒有結果的提示；目前語言沒有索引時也可能顯示它                                       | `"沒有找到相關文章。"`              |
| `error`       | 搜索加载失败，请重试。 / Search could not load. Please try again.                                                                    | 索引清單、搜尋模組或結果詳情載入失敗的提示；不用於生成建置錯誤                       | `"搜索暫時不可用，請重試。"`        |
| `retry`       | 重试 / Retry                                                                                                                         | 失敗狀態的重試按鈕文字；點選會重試載入搜尋引擎，不會在瀏覽器重建索引                 | `"重新載入"`                        |
| `more`        | 加载更多 / Load more                                                                                                                 | 還有未顯示結果時的繼續載入按鈕；不改變每批數量                                       | `"更多結果"`                        |
| `results`     | 找到 {count} 篇文章 / {count} articles found                                                                                         | 有結果時的數量提示；保留字面佔位符 {count}，腳本替換第一個該佔位符，不是已顯示卡片數 | `"共找到 {count} 篇文章"`           |
| `dev`         | 本地完整搜索请先运行 npm run build，再运行 npm run preview。 / To test full search locally, run npm run build, then npm run preview. | dev 模式提示，開發時不執行真實檢索；不能靠改文字生成索引                             | `"請構建后在 preview 中測試搜索。"` |

文字按文字輸出，不執行設定裡的 HTML。空字串會覆寫文字，不會隱藏相應按鈕；錯誤使用空字串還可能讓控制項失去清楚的無障礙名稱。results 的 {count} 不會自動附加到你自訂的句子中，想顯示數字就保留一次佔位符。

### 可合併的設定範例

合併到 src/site.config.ts 現有 defineThemeConfig({...})，保留 import、export 與其他個人設定，不重複建立 theme 或 i18n：

```ts
theme: { search: { enabled: true } },
i18n: {
  locales: {
    'zh-hant': {
      messages: {
        search: {
          label: '搜索文章',
          placeholder: '輸入文章關鍵詞',
          results: '共找到 {count} 篇文章',
          empty: '沒有找到相關文章。',
        },
      },
    },
  },
},
```

<a id="language-and-loading"></a>

## 語言、資源載入與結果顯示

- 建置輸出 pagefind/，包含語言清單 anglefeint.json 和 Pagefind 模組。瀏覽器打開搜尋時才載入清單及搜尋引擎；搜尋 UI 腳本本身會隨含入口的頁面載入，不是整套搜尋程式碼都等點選才下載。
- 資源路徑自動包含 Astro 的 BASE_URL。只部署 HTML、漏傳 pagefind/，或把路徑錯誤重寫成 HTML，可能導致載入失敗；沒有單獨的 site.config 索引路徑設定。
- 客戶端先用文檔 html lang 對照索引語言清單，比較時不區分大小寫；目前語言沒有索引則返回空結果，不切換到英文搜尋。這裡使用頁面有效語言值，不是根據文字的回退語言查詢文章。
- 輸入約 200 毫秒後檢索；中文輸入法組合輸入結束後再安排檢索，提交表單可立即觸發。空關鍵字不執行全文搜尋。延遲不是設定欄位，也不是請求遠端 AI。
- 每批取最多 8 條結果詳情，再由“更多”繼續載入；沒有 pageSize 設定。數量提示使用找到的結果總數，不是目前批次條數。結果只保留同來源連結，摘要只保留文字和關鍵詞 mark 高亮，不呈現文章裡的任意 HTML。
- 結果順序由 Pagefind 返回；沒有主題級排序或推薦算法參數。一般翻譯回退不會把另一語言的文章補入結果。

語言中繼資料、啟停和回退見[語言字典](/zh-hant/blog/config-languages/#meta)。search 文字只改變介面，不會生成對應語言文章或改變索引語言。

<a id="preview"></a>

## 為什麼 dev 中沒有真實搜尋？

索引在 Astro 建置結束後生成，npm run dev 不執行這一步。開發環境會顯示 messages.search.dev 提示；即使輸入關鍵詞也不會真正檢索。這是目前行為，不是搜尋失效或少填設定。

準備好內容後，在本機執行：

```bash
npm run build
npm run preview
```

preview 使用建置產物；編輯文章、語言中繼資料、單篇收錄開關或網站路徑後，想檢驗新索引需要重新建置。正式網站要一起部署網頁與 pagefind 資源。開著 dev 修改文字不等於線上索引已經更新。

沒有可索引文章時仍會生成可識別的空語言清單，UI 可以顯示空結果。建置期索引失敗會報錯，不會默默發佈一個偽造的成功索引。重試按鈕只重試讀取已有資源，不能在訪客瀏覽器中修復建置或生成缺少文章。

<a id="discovery"></a>

## 其他內容發現入口使用哪些設定？

下面沿用各模組已有欄位與預設值；主說明仍在原字典，不新增另一套搜尋設定。

| 設定路徑或位置                                    | 型別 / 預設值                               | 實際作用與限制、範例                                                                                     | 詳細說明                                                   |
| ------------------------------------------------- | ------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| theme.homeLatestCount                             | number / 3                                  | 首頁最新文章數量；如 theme: { homeLatestCount: 5 }。不改變搜尋結果批次或文章底部相關文章數量             | [首頁數量](/zh-hant/blog/config-home/#latest-count)        |
| theme.blogPageSize                                | number / 10                                 | Blog List 與標籤文章列表每頁數量；如 theme: { blogPageSize: 8 }。不是搜尋結果數量                        | [列表分頁](/zh-hant/blog/config-blog-list/#page-size)      |
| theme.tags.enabled                                | boolean / true                              | 標籤入口與標準標籤頁；如 theme: { tags: { enabled: false } }。關閉不刪除文章 tags，也不關閉站內全文搜尋  | [標籤開關](/zh-hant/blog/config-blog-list/#tags-enabled)   |
| 文章 frontmatter.tags                             | string[]，可省略 / 未設定                   | 用於標籤歸檔與頁面標籤顯示；例值 ['Astro', '隨筆']。不參與目前「相關文章」的相關度計算，也不是搜尋白名單 | [文章欄位](/zh-hant/blog/config-article/#frontmatter)      |
| `i18n.locales.<locale>.messages.blog.related`     | string / 內建目前語言，簡體中文與英文見下表 | 文章底部相關文章標題，只改文字；例值 '繼續閱讀'                                                          | [文章文字](/zh-hant/blog/config-article/#article-messages) |
| `i18n.locales.<locale>.messages.blog.relatedAria` | string / 內建目前語言，簡體中文與英文見下表 | 相關文章區域無障礙名稱；例值 '其他文章'                                                                  | [文章文字](/zh-hant/blog/config-article/#article-messages) |

相關文章實際選取目前語言中排除自身後的最新三篇，不依據共同標籤、canonicalTopic 或內容相似度。沒有獨立 relatedCount、相關文章開關或手動推薦名單的 site.config 欄位；沒有其他文章時不顯示該區域。search: false 的文章仍可能被推薦。

| 文字                      | 簡體中文 / 英文預設值    |
| ------------------------- | ------------------------ |
| messages.blog.related     | 相关文章 / Related       |
| messages.blog.relatedAria | 相关文章 / Related posts |

<a id="public-outputs"></a>

## RSS、SEO 和機器閱讀出口不是站內搜尋

| 入口                   | 目前行為及設定關系                                                                                                                                                                                                                       |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/<locale>/rss.xml`    | 每個啟用語言的文章摘要訂閱；標題使用全站名稱，描述使用該語言 messages.blog.archiveDescription。條目來自該語言文章的 title、description、pubDate 與公開路徑；不因單篇 search: false 排除，也不是全文 RSS。沒有 theme.search 內的 RSS 開關 |
| 頁面中繼資訊與搜尋引擎 | 與站內搜尋索引是不同輸出；search: false 不自動添加 noindex 或關閉 sitemap，不能用它控制互聯網搜尋引擎抓取                                                                                                                                |
| 公開機器閱讀文字       | 文章、About、Fragments 等有自己的導出管線，不相依 Pagefind 收錄；語言級公開補充見[語言字典](/zh-hant/blog/config-languages/#ai-context)。search: false 不作為這些產物的私密過濾器                                                        |

網站名稱、網域和訂閱描述應填寫真實值；部署與公開地址見[發佈教學](/zh-hant/blog/starter-guide-deployment/)，RSS 使用的 archiveDescription 見[列表文字](/zh-hant/blog/config-blog-list/#archive-messages)。不要把「站內沒有結果」理解成「網站沒有公開這個內容」。

目前全域搜尋開關、單篇 search 和十一項搜尋文字都有消費位置，沒有需要填寫的舊搜尋相容欄位。canonicalTopic 等目前不消費的文章欄位，也不會因為放在搜尋附近就自動成為索引分類；相關狀態見[文章字典](/zh-hant/blog/config-article/#legacy-frontmatter)。沒有公開的跨語言合併搜尋、圖片 OCR、搜尋詞分析、搜尋結果權重或新增索引型別設定。

返回[設定字典總入口](/zh-hant/blog/config-reference/)查其他模組。
