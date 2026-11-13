---
tags: ['anglefeint', 'config']
title: '設定字典：語言啟停、地址、介面翻譯和回退'
subtitle: '語言登記、預設語言、頁面地址與不同內容的回退規則。'
description: '以實際程式碼說明 i18n 欄位的型別、預設值、啟停規則、首頁前綴、介面翻譯、回退鏈及內容和 SEO 邊界。'
pubDate: '2026-11-13'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/hacker-01.webp'
---

想按步驟啟用語言或發佈譯文，先看[多語言教學](/zh-hant/blog/starter-guide-languages/)；設定檔案位置見[安裝與網站資訊](/zh-hant/blog/starter-guide-1-configure-your-site/)。其他模組從[設定字典總入口](/zh-hant/blog/config-reference/)進入。

本篇負責 i18n 的登記、地址和解析規則，不重複每個功能模組的全部文字。首頁、文章、Fragments、About、Decoder、音樂、評論等文字的逐欄位預設值和範例，在對應字典中查閱。下面預設值來自主題套件，不是 demo 的個人覆寫值。

<a id="registry"></a>

## i18n.defaultLocale 與 i18n.locales

| 完整路徑                | 型別 / 主題預設值                                             | 狀態、作用與限制                                                                                                                                            | 範例                                                       |
| ----------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| i18n.defaultLocale      | string / 'en'                                                 | 生效：決定根首頁採用或跳轉到的語言、必要回退和預設語言連結。空字串在正規化時回退 en；不會自動從瀏覽器語言判斷。預設語言始終啟用，不能靠 enabled: false 關閉 | i18n: { defaultLocale: 'zh' }                              |
| i18n.locales            | Record<string, LocaleConfig> / 下表九種內建語言               | 生效：鍵是實際語言代碼，決定目錄和網址；物件遞歸合併，省略某內建語言不會刪除它。新增語言沒有自動翻譯包，需要補自己的文字與內容                              | i18n: { locales: { fr: { meta: { label: 'Français' } } } } |
| `i18n.locales.<locale>` | LocaleConfig，可部分覆寫 / 內建語言已有設定，新代碼無原有設定 | 生效：包含 meta、site、messages、about、aiReadableContent。省略欄位使用合併及回退規則；不能用空物件清除已有語言                                             | locales: { zh: { meta: { enabled: false } } }              |

語言鍵不等於選單名稱或 hreflang。實作不會自動把 EN 轉成 en，或將 zh-CN 目錄變成 zh；建議目錄、設定和生成指令統一使用小寫代碼，例如 zh、en、pt-br、zh-hant。內容專案產生工具接受兩至三位字母、可帶一個連字號分段的代碼；執行時語言正規化不是完整的語言代碼或路徑合法性驗證器，不要填寫路徑或任意標點。

預設語言如果沒有登記，正規化會補入一個以代碼為 label 的設定；這不能代替準備對應內容和翻譯。修改 defaultLocale 不會把已有檔案移動到新語言目錄。

### 內建語言的實際預設值

下面是未覆寫設定時的有效中繼資料：九種語言都啟用，預設語言 en 的回退為空，其他語言回退 en。順序沿用設定物件登記順序，不按 meta.label 排序；也沒有單獨的語言選單排序欄位。

| 代碼      | meta.label         | meta.hreflang | meta.ogLocale | 有效 enabled | 有效 fallback |
| --------- | ------------------ | ------------- | ------------- | ------------ | ------------- |
| `en`      | English            | `en`          | `en_US`       | true         | `[]`          |
| `ja`      | 日本語             | `ja`          | `ja_JP`       | true         | `["en"]`      |
| `ko`      | 한국어             | `ko`          | `ko_KR`       | true         | `["en"]`      |
| `es`      | Español            | `es`          | `es_ES`       | true         | `["en"]`      |
| `zh`      | 简体中文           | `zh-CN`       | `zh_CN`       | true         | `["en"]`      |
| `pt-br`   | Português (Brasil) | `pt-BR`       | `pt_BR`       | true         | `["en"]`      |
| `de`      | Deutsch            | `de`          | `de_DE`       | true         | `["en"]`      |
| `ru`      | Русский            | `ru`          | `ru_RU`       | true         | `["en"]`      |
| `zh-hant` | 繁體中文           | `zh-Hant`     | `zh_TW`       | true         | `["en"]`      |

<a id="meta"></a>

## `i18n.locales.<locale>.meta`：五個中繼資料欄位

以下相對欄位均位於 meta 內；對內建語言的具體預設值見上表。新增語言省略欄位時的正規化規則列在下表。設定輸入支援部分覆寫，型別說明不表示所有欄位每次都必須重寫。

| 相對路徑      | 型別 / 新語言省略時                                   | 狀態、作用與限制                                                                                                                       | 範例值       |
| ------------- | ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| meta.label    | string / 語言代碼                                     | 生效：語言選單顯示名稱；空字串也回退代碼，純空白不做 trim。不會重新命名目錄或網址                                                      | 'Français'   |
| meta.hreflang | string，可省略 / 語言代碼                             | 生效：標準頁面 html lang、hreflang 與部分結構化資料的語言值；不改變路徑鍵。空字串回退代碼，不做格式驗證                                | 'fr'         |
| meta.ogLocale | string，可省略 / 未設定                               | 條件生效：Open Graph 語言及可用的 alternate 中繼資訊；未設定或空字串不輸出對應標籤，不自動推導地區代碼。內建語言覆寫為空字串可清除原值 | 'fr_FR'      |
| meta.enabled  | boolean，可省略 / true                                | 生效：非預設語言只有 false 才關閉，預設語言無論此值如何都啟用。影響標準語言頁面和選單，不刪除檔案或自訂頁面，不是存取權限控制          | false        |
| meta.fallback | string[]，可省略 / 非預設語言補預設語言，預設語言為空 | 生效：設定解析的直接回退鏈。陣列整體替換；過濾自身、重複項、空字串及未登記語言。非預設語言最終總會補上預設語言                         | ['zh', 'en'] |

hreflang 和 ogLocale 是不同欄位，不要用它們替代語言鍵。填寫自訂語言時主題不會自動保證這些中繼資訊符合某個地區的慣例；使用與你實際內容匹配的語言值。

<a id="routing"></a>

## i18n.routing.defaultLocalePrefix：預設首頁地址

- **型別 / 預設值：** 'always' | 'never' / 'always'。
- **狀態與作用：** 生效，但目前只切換預設語言首頁的規範入口；不是所有預設語言頁面去掉前綴。空字串不屬於公開型別，執行時的最終備援會視為 always，不建議相依非法值。
- **限制：** 不會自動生成 /blog/、/about/ 等無語言前綴頁面。切換後需要重新建置部署，也不會自動遷移舊網站連結或託管平臺重新導向規則。
- **範例：** i18n: { routing: { defaultLocalePrefix: 'never' } }。

假設 defaultLocale 是 en：

| 地址              | always                   | never                    |
| ----------------- | ------------------------ | ------------------------ |
| /                 | 靜態 HTML 跳轉到 /en/    | 顯示英文首頁             |
| /en/              | 顯示英文首頁             | 靜態 HTML 跳轉到 /       |
| /en/blog/         | 英文列表                 | 英文列表                 |
| /en/blog/my-post/ | 英文文章                 | 英文文章                 |
| /en/about/        | 英文 About（功能開啟時） | 英文 About（功能開啟時） |
| /zh/              | 中文首頁（語言開啟時）   | 中文首頁（語言開啟時）   |

根首頁與語言首頁之間使用 meta refresh 的靜態跳轉頁，帶 canonical 和 noindex；不是執行時根據訪客位置選擇語言，也不是主題設定的一條伺服器 301。內部語言路徑工具通常仍生成 `/<locale>/.../`；是否轉到根首頁由具體入口處理。

<a id="overrides"></a>

## site、messages、about：覆寫放在哪裡？

完整前綴為 `i18n.locales.<locale>`。物件欄位遞歸合併；陣列整體替換；undefined 不覆寫原值。空字串、false 和空陣列保留，由各欄位定義含義。

| 相對路徑       | 型別 / 預設值                                                            | 作用、限制與範例                                                                                                              | 逐欄位說明                                              |
| -------------- | ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| site           | { homeTitle?: string; hero?: string } / 內建各語言的首頁設定             | 只承載語言相關首頁內容，不取代頂層 site 身分設定；如 site: { homeTitle: '我的部落格' }                                        | [首頁字典](/zh-hant/blog/config-home/#site-fallbacks)   |
| site.homeTitle | string，可省略 / 未設定                                                  | 按目前語言和直接回退語言依次找 trim 後非空標題，最終用全站 SITE_TITLE；例值 '我的博客'。空字串不能阻止繼續回退                | [首頁大標題](/zh-hant/blog/config-home/#home-title)     |
| site.hero      | string，可省略 / 內建各語言介紹；新語言未設定                            | 按回退鏈找第一個已定義值；空字串主動清空，不繼續查回退語言；未找到時首頁還有 messages.home.hero 備用。例值 '記錄專案與生活。' | [首頁介紹](/zh-hant/blog/config-home/#home-hero)        |
| messages       | DeepPartial<Messages> / 語言設定覆寫項通常未設定，執行時疊加內建語言文字 | 用於按鈕、狀態、中繼描述等；如 messages: { nav: { home: '首頁' } }。只改文字，不新增對應功能或翻譯內容                        | [字典總入口](/zh-hant/blog/config-reference/)           |
| about          | DeepPartial<AboutConfig> / 內建各語言 About 設定                         | 從基礎 About 開始按鏈遞歸合併；如 about: { sections: { who: '我是一名開發者。' } }。不從 Markdown 檔案自動讀取內文            | [About 字典](/zh-hant/blog/config-about/#about-content) |

內建各語言 hero 的精確預設值如下；預設設定不提供 homeTitle：

| 語言      | site.hero 預設值                                                                           |
| --------- | ------------------------------------------------------------------------------------------ |
| `en`      | Write a short introduction for your site and what readers can expect from your posts.      |
| `ja`      | このサイトの紹介文と、読者がどんな記事を期待できるかを書いてください。                     |
| `ko`      | 사이트 소개와 방문자가 어떤 글을 기대할 수 있는지 간단히 작성하세요.                       |
| `es`      | Escribe una breve presentación del sitio y qué tipo de contenido encontrarán tus lectores. |
| `zh`      | 在这里写一段站点简介，并告诉读者你将发布什么类型的内容。                                   |
| `pt-br`   | Apresente seu site e conte o que os leitores encontrarão nos seus artigos.                 |
| `de`      | Stelle deine Website kurz vor und beschreibe, was Leser in deinen Beiträgen erwartet.      |
| `ru`      | Кратко представьте свой сайт и расскажите, какие статьи здесь найдут читатели.             |
| `zh-hant` | 簡短介紹你的網站，並告訴讀者這裡會有哪些內容。                                             |

<a id="fallback"></a>

## 回退鏈的精確順序

例如目前語言 fr 的有效 meta.fallback 為 ['zh', 'en']，設定解析鏈是 fr → zh → en，直接按這個列表查找或反向合併。不會繼續展開 zh 自己的 fallback；若想使用 ja，必須直接把 ja 放入 fr 的陣列。

1. 沒寫 fallback 或寫 [] 時，非預設語言仍補預設語言。預設語言允許沒有回退，也可以指定其他已登記語言。
2. 自身、重複項和未登記語言被過濾；檢查的是是否登記，不是是否啟用，因此已關閉的語言仍可參與設定回退。
3. 非預設語言如果沒包含預設語言，末尾追加。若已明確包含，則保留它在陣列中的原位置，不會再挪到最後。
4. 一般 messages 從內建英文起步，按有效鏈的倒序，為每個語言先合併內建包，再合併該語言個人覆寫。因此目前語言的內建翻譯也可能覆寫回退語言的個人文字。

例如 en 的 nav.home 改成 'Start'，不會讓內建 zh 的簡體中文預設「首页」自動變成 'Start'。要改中文，直接覆寫 zh.messages.nav.home。新增沒有內建包的語言，則可從回退語言補介面文字，但不會自動得到完整的該語言譯文。

不同內容不共用同一種回退算法：

| 內容                       | 目前行為                                                                                               |
| -------------------------- | ------------------------------------------------------------------------------------------------------ |
| 一般 messages              | 上述內建英文 → 回退語言內建包及覆寫 → 目前語言內建包及覆寫                                             |
| site.homeTitle             | 按直接鏈找非空且 trim 後的值，再回全站標題                                                             |
| site.hero                  | 按直接鏈找已定義值，空字串停止繼續查找                                                                 |
| about                      | 基礎 DEFAULT_ABOUT_CONFIG 起步，按直接鏈倒序合併各語言設定                                             |
| messages.home.transmission | 特例：目前語言個人值 → 英文個人值 → 內建英文作者文字，不走一般完整回退鏈；目前內建文字為 Knock, knock. |
| aiReadableContent          | 該語言欄位覆寫頂層公共補充，不走 meta.fallback，見下節                                                 |
| 文章和碎片內文             | 不走文字回退；唯讀取對應語言自己的內容                                                                 |

回退不會把英文文章補進中文列表、生成翻譯檔案、搜尋其他語言補齊首頁條數，也不會自動把兩個不同 slug 視為譯文。

<a id="common-messages"></a>

## 語言選擇器和共用文字

這些是 `i18n.locales.<locale>.messages` 下的欄位，均為 string，可省略，按一般文字鏈解析。在地化 siteTitle 目前不改變標準網站身分，其型別、預設值與未使用狀態統一見[網站字典](/zh-hant/blog/config-site-chrome/#legacy-site-title)。

| 相對欄位        | 簡體中文 / 英文預設值                                                                            | 狀態、作用與限制                                                                    | 範例值                 |
| --------------- | ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------- | ---------------------- |
| langLabel       | 语言 / Language                                                                                  | 生效：公共語言選擇器的提示和無障礙文字，不是每種語言的選項名。選項名使用 meta.label | '選擇語言'             |
| siteDescription | 电影感网页界面与 AI 时代工程实践文章。 / Cinematic web interfaces and AI-era engineering essays. | 條件生效：首頁中繼描述，不是可見介紹或所有頁面通用描述；其余頁有自己的描述來源      | '我的專案與學習筆記。' |

功能模組內部文字請進入已有字典；沒有消費位置的欄位不會因為出現在型別裡就生效。評論 iframe 的語言還受 theme.comments.lang 影響，預設固定英文；詳見[評論字典](/zh-hant/blog/config-comments/#appearance)。

<a id="ai-context"></a>

## aiReadableContent：語言級公開補充的特殊回退

語言級補充位於 `i18n.locales.<locale>.aiReadableContent`，只按 notes / links 各自覆寫頂層值，不走 meta.fallback。省略欄位繼承全域值；空 notes 或空 links 陣列主動清空；物件 {} 本身不清空全域內容。

欄位型別、預設值、驗證和完整範例統一見[AI 閱讀補充字典](/zh-hant/blog/config-analytics-ai/#locale-supplement)。它不是頁面翻譯或 About 內文；所有補充均公開。連結相對網站發佈根解析，單個 / 開頭會跳過部署 base，具體對照見[連結解析說明](/zh-hant/blog/config-analytics-ai/#supplement)。

<a id="examples"></a>

## 可合併的設定範例

合併到 src/site.config.ts 現有 defineThemeConfig({...})，保留其他個人設定；不要重複建立 i18n。以下範例的語言物件仍與九種內建語言遞歸合併，不會因為只寫兩種就自動關閉其他語言。

### 只保留中文頁面

```ts
i18n: {
  defaultLocale: 'zh',
  routing: { defaultLocalePrefix: 'always' },
  locales: {
    zh: { meta: { enabled: true, label: '中文' } },
    en: { meta: { enabled: false } },
    ja: { meta: { enabled: false } },
    ko: { meta: { enabled: false } },
    es: { meta: { enabled: false } },
    'pt-br': { meta: { enabled: false } },
    de: { meta: { enabled: false } },
    ru: { meta: { enabled: false } },
    'zh-hant': { meta: { enabled: false } },
  },
},
```

預設語言 zh 無法被關閉；關閉英文頁面後，其登記設定仍可以參與回退。若想使用根路徑首頁，把此範例中的 always 改成 never，文章仍在 /zh/blog/.../。

### 添加法語，並補自己的介面文字

```ts
i18n: {
  locales: {
    fr: {
      meta: {
        label: 'Français',
        hreflang: 'fr',
        ogLocale: 'fr_FR',
        enabled: true,
        fallback: ['zh', 'en'],
      },
      site: {
        homeTitle: 'Mon blog',
        hero: 'Mes projets et mes notes.',
      },
      messages: {
        langLabel: 'Langue',
        nav: { home: 'Accueil', blog: 'Articles', about: 'À propos' },
      },
    },
  },
},
```

這個例子只補了幾項法語，不是完整法語語言包。還需要在 src/content/blog/fr/ 發佈文章；碎片則放 src/content/fragments/fr/。專案產生工具預設按已啟用語言生成佔位檔案，不會自動翻譯內文。

<a id="content-and-seo"></a>

## 地址、內容切換和 SEO 的邊界

- 公共語言選單只列啟用語言，預設保留目前頁面的子路徑；具體路由可以提供自己的選單目標。它不是任意頁面都保證存在的翻譯搜尋器。
- 標準文章頁按完整、不含語言目錄的 slug 查找譯文：存在則跳到對應文章，不存在則選單跳到該語言的 Blog List。SEO 只宣告確實存在的同 slug 文章，不把列表當作文章譯文；預設語言也缺譯文時，不偽造它的 x-default 文章地址。
- Fragments 的語言切換進入目標語言的列表首頁，不按目前碎片 ID 找譯文；同 ID 的討論共享是另一套機制。停用語言不刪除原檔案或 GitHub 討論。
- 改 meta.label 只改選單文字；改語言鍵才會改變網址和內容目錄約定。主題不自動遷移舊連結，也不按 Accept-Language、瀏覽器設定或國家選擇語言。
- 公共消息物件是文字設定，不是任意 HTML 或 Markdown 的統一呈現入口；具體欄位是否支援換行、陣列或格式，應看對應模組。陣列整體替換不會追加選單項或功能。
- 沒有公開的獨立 languageOrder、autoDetect、缺少譯文自動翻譯、全站無前綴路由或按語言更換公共歌單欄位。自訂頁面的 localeHrefs / seoLocaleHrefs 屬於組件參數，不是 site.config 欄位。

保存設定後重新讀取開發設定；正式網站需要重新建置部署。語言關停不應被當作清理託管平臺舊檔案或保護私密內容的手段。返回[設定字典總入口](/zh-hant/blog/config-reference/)繼續查其他模組。
