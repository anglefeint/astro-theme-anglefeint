---
tags: ['anglefeint', 'config']
title: '設定字典：網站名稱、網域、公共導覽、社交和頁尾'
subtitle: '全站身分、環境覆寫、固定導覽與公共連結。'
description: '以實際程式碼查閱 site、social、footer 和導覽文字，列出型別、預設值、限制、環境覆寫以及相容和未生效設定。'
pubDate: '2026-11-13'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/matrix-01.webp'
---

第一次替換自己的資訊，先看[安裝與網站資訊](/zh-hant/blog/starter-guide-1-configure-your-site/)；網域部署操作見[發佈教學](/zh-hant/blog/starter-guide-deployment/)。其他模組從[設定字典總入口](/zh-hant/blog/config-reference/)進入。

以下設定寫在 src/site.config.ts，預設值來自主題套件，不是 demo 的個人名稱、帳號或網域。保留現有 defineThemeConfig({...}) 的 import、export 和其他模組，合併片段即可。

<a id="identity"></a>

## site：全站身分的六個欄位

site 是物件，所有欄位都可在部分設定中省略。表中的狀態均為條件生效：實際頁面讀取該資訊時使用，且環境覆寫或頁面自身更具體的參數可能優先。

| 完整路徑           | 型別           | 主題預設值                                                                              | 作用、限制與例值                                                                                                                                                                               |
| ------------------ | -------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `site.title`       | string         | `"My Blog"`                                                                             | 頁頭品牌名、頁尾版權名稱、RSS 標題、結構化資料中的網站名稱，以及部分頁面和自動分享圖片的網站資訊；不等於首頁大標題。沒有統一的空字串回退；例值 `"我的博客"`                                    |
| `site.description` | string         | `"Cinematic web interfaces, AI-era engineering notes, and system architecture essays."` | 全站描述與機器閱讀索引描述的來源之一；首頁優先用 messages.siteDescription，About、列表等有各自描述，不會逐頁全部替換；例值 `"記錄專案、閱讀和生活。"`                                          |
| `site.url`         | string         | `"https://example.com"`                                                                 | 網站公開絕對地址，用於 Astro site、canonical、RSS、sitemap 和公開導出地址。填寫真實 HTTP(S) 地址，不使用某篇文章 URL；不負責購買網域、DNS、證書或發佈程式碼；例值 `"https://blog.example.com"` |
| `site.author`      | string         | `"Your Name"`                                                                           | 預設作者與結構化資料；文章 author 可單獨覆寫。頁尾版權使用 site.title，不使用 author；About 內文和郵箱也不會自動隨它改變；例值 `"小林"`                                                        |
| `site.tagline`     | string         | `""`                                                                                    | 頁尾附加短句，呈現時 trim；空值不顯示。trim 後恰為舊預設 Built with Astro. 時也隱藏，以避免與連結署名重複；例值 `"保持好奇，持續建構。"`                                                       |
| `site.ogImage`     | string，可省略 | `""`                                                                                    | 沒有頁面或文章優先圖片時使用的全站分享圖片。空白使用主題自帶分享圖片；本機 public 路徑或 HTTPS URL，不是首頁頭像或文章封面批量替換；例值 `"/images/share.webp"`                                |

site.title 與 `i18n.locales.<locale>.site.homeTitle` 的角色不同：前者是全站名稱，後者只改對應語言首頁的可見大標題。後者按語言鏈找非空值，最後才回到全站名稱；見[首頁標題](/zh-hant/blog/config-home/#home-title)。messages.siteTitle 目前不用於標準全站身分或首頁大標題，不要填寫它期待品牌名稱變化。

site.description 也不等於首頁可見介紹；可見介紹使用 `i18n.locales.<locale>.site.hero`，首頁中繼描述還有 messages.siteDescription。具體優先級見[首頁字典](/zh-hant/blog/config-home/#site-fallbacks)。改全站身分不會自動修改 About 裡已經填寫的個人介紹。

### 分享圖片的優先級與路徑

site.ogImage 在公共 head 缺少頁面圖片時才使用。文章自己的 ogImage、自動生成分享圖片或文章封面可以先于它生效，詳見[文章字典](/zh-hant/blog/config-article/#frontmatter)。開啟全域自動分享圖片時，不能指望 site.ogImage 覆寫每篇文章。

本機範例 /images/share.webp 對應 public/images/share.webp；需要提前放好檔案。缺檔案、路徑越出 publicDir 或無效路徑會在解析該備用圖時報錯。本機圖片會加上發佈 base 和內容版本參數；HTTPS 圖片保持遠程地址，主題不下載驗證。空值或純空白繼續用主題圖，不是刪除分享中繼資訊。

site.ogImage 是字串欄位，不直接填寫 Astro image import 物件；文章 frontmatter.ogImage 支援的型別不同。這個欄位沒有 PUBLIC_SITE_OG_IMAGE 環境覆寫，也不改變文章 heroImage。

<a id="environment"></a>

## 環境覆寫與網域生效順序

以下不是新的 site.config 欄位，而是主題目前讀取的環境變數。值均為 string；沒有設定時使用相應 site 欄位。讀取使用空值合併，不會把空字串自動當成「未設定」。

| 環境變數                | 優先覆寫         | 範例                                     |
| ----------------------- | ---------------- | ---------------------------------------- |
| PUBLIC_SITE_TITLE       | site.title       | PUBLIC_SITE_TITLE=我的部落格             |
| PUBLIC_SITE_DESCRIPTION | site.description | PUBLIC_SITE_DESCRIPTION=專案與學習筆記   |
| PUBLIC_SITE_AUTHOR      | site.author      | PUBLIC_SITE_AUTHOR=小林                  |
| PUBLIC_SITE_TAGLINE     | site.tagline     | PUBLIC_SITE_TAGLINE=保持好奇             |
| PUBLIC_SITE_URL         | site.url         | PUBLIC_SITE_URL=https://blog.example.com |

建置集成會按 dev/build 與 --mode 對應的 Vite dotenv 模式讀取 PUBLIC_SITE_URL，使 Astro site 與頁面公開地址保持一致。已有進程環境覆寫同名 dotenv 值；不要只改 site.url 卻忘記部署平臺仍設定了 PUBLIC_SITE_URL。空字串可能清空文字或使地址無效，不是還原設定預設值的方法。

頁面側 SITE_URL 還保留 import.meta.env.SITE 的中間最終備援：PUBLIC_SITE_URL → SITE → site.url。標準集成的 Astro site 以 PUBLIC_SITE_URL 或設定 URL 設定，頁面 head 又優先 Astro.site；SITE 是調整層相容最終備援，不建議作為另一套獨立網域設定。

網域和發佈子路徑不是同一個欄位。Astro 的 base、託管輸出與 DNS/HTTPS 設定仍需要按部署教學設定；把子目錄隨意塞進 site.url 不會自動移動所有路由。改值後重啟開發服務，線上重新建置部署；不會替你設定伺服器重新導向。

<a id="navigation"></a>

## 公共導覽：固定入口加功能開關

沒有公開 nav 陣列、選單排序或自訂選單項欄位。標準頁頭的入口按實作組合：

| 位置                    | 目前來源和限制                                                                                       |
| ----------------------- | ---------------------------------------------------------------------------------------------------- |
| 品牌名                  | site.title / 環境覆寫，點選進入目前語言首頁                                                          |
| 首頁、Blog              | 始終保留這兩個標準入口；名稱用 messages.nav.home / blog，不靠文字改變目標地址                        |
| About                   | theme.enableAboutPage，boolean，預設 true；如 theme: { enableAboutPage: false } 會關閉頁面及對應入口 |
| Frontier 下的 Decoder   | theme.enableDecoderPage，boolean，預設 true；該頁頭入口文字固定 Decoder Lab                          |
| Frontier 下的 Fragments | theme.fragments.enabled，boolean，預設 false；標籤用 messages.fragments.title                        |
| Frontier 下的 Contact   | About 開啟時出現，標籤用 messages.about.contact，跳到目前語言 /about/#contact；與 Decoder 開關獨立   |
| 搜尋                    | theme.search.enabled，boolean，預設 true；見[搜尋字典](/zh-hant/blog/config-search/#enabled)         |
| 語言與狀態              | 啟用語言、meta.label 和下表靜態狀態文字；語言選項不是任意連結列表                                    |

Frontier 的標題和名稱由組件固定，所有子項都沒有時才不呈現。更改 messages.decoderPage.fullTool 會影響完整工具頁面及頁尾工具連結，目前不會替換頁頭固定的 Decoder Lab。

語言和地址規則見[語言字典](/zh-hant/blog/config-languages/#content-and-seo)，About、Fragments、Decoder 各自的欄位仍在對應字典。不要靠設定空標籤來關導覽，會保留地址或留下不清楚的按鈕名稱。

<a id="chrome-messages"></a>

### 頁頭與頁尾的七項文字

完整前綴為 `i18n.locales.<locale>.messages`，欄位均為可省略 string。預設取內建目前語言文字和回退鏈；下表只列中文 / 英文。狀態均為條件生效：對應導覽或署名區域存在時使用。文字按文字呈現，不解析 Markdown 或任意 HTML。

| 相對欄位           | 簡體中文 / 英文預設值           | 作用與限制                                         | 範例值       |
| ------------------ | ------------------------------- | -------------------------------------------------- | ------------ |
| `nav.home`         | 首页 / Home                     | 首頁導覽文字，不改路由                             | `"首頁"`     |
| `nav.blog`         | 博客 / Blog                     | Blog 入口文字，不改路由                            | `"文章"`     |
| `nav.about`        | 关于 / About                    | About 導覽文字，也被內文視窗重新打開入口使用       | `"關于我"`   |
| `nav.status`       | system: online / system: online | 頁頭狀態文字，靜態顯示，不檢測網路、API 或服務健康 | `"系統在線"` |
| `nav.statusAria`   | 系统状态 / System status        | 狀態區域無障礙名稱，不是服務檢測開關               | `"站點狀態"` |
| `footer.theme`     | 主题： / Theme by               | 主題署名前綴；Anglefeint 連結文字及目標固定        | `"主題來自"` |
| `footer.builtWith` | 构建工具： / Built with         | Astro 署名前綴；Astro 連結文字及目標固定           | `"使用"`     |

messages.langLabel 用於語言控制項，選項名用 meta.label，見[語言文字](/zh-hant/blog/config-languages/#common-messages)。Contact、Fragments 等引用各模組文字，不在 messages.nav 中另造欄位。

<a id="social"></a>

## social.links：頁頭和頁尾共用的社交連結

- **型別 / 預設值：** SocialLink[] / []，每項五個欄位見下表。
- **狀態與作用：** 生效，按陣列順序在頁頭與頁尾使用同一份連結。陣列整體替換，沒有公開條數上限或按語言分別設定的入口。
- **限制：** [] 不表示完全隱藏區域；標準組件會顯示 Mastodon、Twitter、GitHub 三個不可點選的佔位圖標。dev 還顯示設定提示。已有條目裡 href 為空不會變成這種佔位，而是仍輸出連結。
- **範例值：** [{ label: 'GitHub', href: 'https://github.com/yourname', icon: 'github' }]。

About 的郵箱、GitHub 聯絡連結與這裡獨立；改社交陣列不會自動改 About 聯絡段落。目前沒有 theme.social.enabled 或 hidePlaceholders 之類 site.config 開關；組件的 showPlaceholdersWhenEmpty 是布局參數。

<a id="social-fields"></a>

### 每個 SocialLink 的五項欄位

完整前綴為 social.links[]。必填欄位沒有自動補值；即使設定輸入的部分型別允許部分物件，也應填寫完整有效條目。

| 欄位    | 型別 / 預設值                                           | 狀態、作用與限制                                                                                                                               | 範例值                        |
| ------- | ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| href    | string，必填 / 無                                       | 生效：實際連結地址；目前解析器不統一驗證協議、可達性或非空，也不自動加 BASE_URL。使用完整 HTTPS 地址或正確的站內路徑，不把它當成經過驗證的帳號 | 'https://github.com/yourname' |
| label   | string，必填 / 無                                       | 生效：連結無障礙名稱；沒有圖標時也是可見文字。不自動取平臺名或目標頁標題，填寫清楚的非空名稱                                                   | 'GitHub'                      |
| rel     | string，可省略 / 未設定，最終至少含 noopener noreferrer | 生效：空白分隔的關系標記，轉小寫、去重、移除 opener，並保留新視窗保護；不會因為寫空字串取消保護。非字串報錯                                    | 'me nofollow'                 |
| icon    | 內建 SocialIcon，可省略 / 未設定                        | 條件生效：下方十二個名字之一；沒有 iconSrc 時使用，未知的非空名字報錯，不按網址自動識別平臺。省略且沒有自訂圖則用 label 文字                   | 'github'                      |
| iconSrc | string，可省略 / 未設定                                 | 條件生效：自訂 publicDir 內本機 SVG/PNG/WebP 路徑；有效非空路徑優先于 icon。純空白視為沒設定，非字串或不符合規則會報錯                         | '/icons/community.svg'        |

所有真實條目都以新標籤頁打開；自訂 rel 會與保護標記合併。文字標籤不解析 HTML。內建圖標名稱精確且區分大小寫：

```text
mastodon
twitter
github
youtube
bluesky
linkedin
discord
telegram
instagram
facebook
whatsapp
line
```

### 自訂圖標的檔案限制

例如 public/icons/community.svg 對應 iconSrc: '/icons/community.svg'。設定的是實際 publicDir 中的檔案，不是包內資源或 src/assets 路徑。路徑必須以單個 / 開頭，不能是 URL、協議相對地址、帶查詢/片段的地址、百分號編碼路徑或含 . / .. 段的路徑；反斜線、冒號和控制字元也不接受。

建置時檢查檔案存在、是檔案且解析後的真實路徑仍在 publicDir 內；通過符號連結越出目錄也不接受。一般空格和中文檔案名可由組件編碼，不要提前寫百分號編碼。輸出圖標路徑自動加 Astro base，圖標優先級不影響 href 的原樣處理。其他圖片格式如 JPG、GIF 不在這裡支援的擴展名內。

如果已有有效 iconSrc，內建 icon 不參與選擇；圖標尺寸與間距是組件布局參數，不是 SocialLink 欄位。

<a id="footer"></a>

## theme.footer：頁尾連結與署名

| 完整路徑                   | 型別 / 預設值                          | 狀態、作用與限制                                                                                                                      | 範例值                                                    |
| -------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| theme.footer.showCredits   | boolean / true                         | 生效：是否顯示主題與 Astro 的連結署名；不刪除版權、社交、短句或其他連結。也參與目前自動文章分享圖片的署名參數，不改變已提供的自訂圖片 | false                                                     |
| theme.footer.links         | { label: string; href: string }[] / [] | 生效：按陣列順序顯示自訂頁尾連結，陣列整體替換；不改變公共頁頭。布局還可能追加 Decoder 連結，因此 [] 不保證頁尾沒有連結               | [{ label: '專案', href: 'https://example.com/project/' }] |
| theme.footer.links[].label | string，必填 / 無                      | 條件生效：連結可見名稱，按文字輸出，不自動從目標頁獲取                                                                                | '專案'                                                    |
| theme.footer.links[].href  | string，必填 / 無                      | 條件生效：原樣連結地址；目前沒有與社交自訂圖片同樣的路徑驗證或自動 base 前綴，站內地址需自己填寫正確。預設在目前標籤頁導覽            | 'https://example.com/project/'                            |

主題會把自訂連結放在布局追加連結之前，不去重；Decoder 開啟時公共框架自動追加指向完整工具頁的連結，標籤用 messages.decoderPage.fullTool。若不需要獨立 Decoder 應改對應功能開關，不是靠清空 footer.links 移除它。

頁尾版權固定顯示建置時的年份與有效 SITE_TITLE，沒有獨立 copyright/year 設定。site.tagline 在署名之外獨立顯示；trim 後等於舊預設 Built with Astro. 時會省略這句相容文字。showCredits: false 不影響其他短句，也不自動刪除網站上已有的圖片署名。

<a id="examples"></a>

## 可合併的網站與公共連結範例

先保留目前設定中的個人資訊，僅合併需要修改的欄位：

```ts
site: {
  title: '小林的部落格',
  description: '記錄專案、閱讀和生活。',
  url: 'https://blog.example.com',
  author: '小林',
  tagline: '保持好奇，持續構建。',
},
social: {
  links: [
    { label: 'GitHub', href: 'https://github.com/yourname', icon: 'github' },
    { label: '專案主頁', href: 'https://example.com/project/' },
  ],
},
theme: {
  footer: {
    showCredits: true,
    links: [{ label: '專案', href: 'https://example.com/project/' }],
  },
},
```

範例帳號、網域和連結必須替換為自己的；主題不聯網驗證它們。需要自訂社交圖標或全站分享圖片時，先準備對應 public 檔案，再填寫 iconSrc 或 site.ogImage。

只改繁體中文導覽與署名前綴可以合併：

```ts
i18n: {
  locales: {
    'zh-hant': {
      messages: {
        nav: { home: '首頁', blog: '文章', about: '關于我' },
        footer: { theme: '主題來自', builtWith: '使用' },
      },
    },
  },
},
```

<a id="legacy-site-title"></a>

## 目前未使用：messages.siteTitle

完整路徑是 `i18n.locales.<locale>.messages.siteTitle`。型別為可省略的 string 覆寫；中文 / 英文內建預設值均為 'Angle Feint'。目前標準首頁大標題和公共網站身分均不讀取它，狀態為「目前未使用」；例如填 siteTitle: '我的部落格' 不會改變這些名稱。

首頁大標題使用 `i18n.locales.<locale>.site.homeTitle`，公共品牌名稱使用頂層 site.title；兩者具體作用分別見[首頁標題](/zh-hant/blog/config-home/#home-title)和[網站身分](#identity)。無需為了改名填寫這個保留欄位。

<a id="boundaries"></a>

## 相容與未生效欄位邊界

- 目前六個 site 欄位、社交與頁尾欄位及上述七項文字都有消費位置，但圖片優先級、環境覆寫和入口開關會決定具體頁面效果。
- site.tagline 的 Built with Astro. 是明確相容舊預設的特殊值；它會被抑制，不應當成任意短句都被停用。
- messages.siteTitle 的未使用狀態見上節，型別接受不等於頁面讀取。
- homeHref、localeHrefs、extraLinks、showPlaceholdersWhenEmpty、iconSize 等是組件參數，不是 site.config 欄位。型別中沒有公開的 nav 陣列、社交佔位開關、版權模板或獨立狀態檢測設定。

保存設定、準備檔案後重新建置部署；環境變數變化需要重新讀取對應模式。網域、連結可達性、遠端帳號和線上頁面效果需在自己的部署中確認，不能僅憑本機型別檢查判斷成功。返回[設定字典總入口](/zh-hant/blog/config-reference/)查其他模組。
