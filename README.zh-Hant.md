[English](README.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Português (Brasil)](README.pt-BR.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [繁體中文](README.zh-Hant.md)

<p align="center">
  <a href="https://demo.anglefeint.com/zh-hant/">
    <img src="public/images/theme-previews/anglefeint-brand.webp" alt="Anglefeint — Matrix / Cyberpunk / Hacker / AI" width="1600" />
  </a>
</p>

<p align="center">為個人部落格打造的電影感 Astro 主題。</p>

[Demo](https://demo.anglefeint.com/zh-hant/) · [GitHub](https://github.com/anglefeint/astro-theme-anglefeint)

<p align="center">
  <a href="#installation">安裝</a> · <a href="#setup">設定指南</a>
</p>

<p align="center">
  <img alt="Astro" src="https://img.shields.io/badge/Astro-7.3.7-BC52EE?logo=astro&logoColor=white" />
  <img alt="Locales" src="https://img.shields.io/badge/i18n-9%20languages-0A7EA4" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT-2EA043" />
</p>

<a id="installation"></a>

```bash
npm create astro@latest -- my-blog --template anglefeint/astro-theme-anglefeint#starter --no-install
```

<a id="setup"></a>

## 社群連結

在 `src/site.config.ts` 設定 `social.links`，頂欄與頁尾共用陣列順序。只加入需要的連結：

```ts
// src/site.config.ts — defineThemeConfig({ ... })
social: {
  links: [
    { href: "https://www.youtube.com/@your-channel", label: "YouTube", icon: "youtube" },
    { href: "https://bsky.app/profile/your-handle.bsky.social", label: "Bluesky", icon: "bluesky" },
  ],
},
```

內建 `icon` 名稱： `mastodon`, `twitter`, `github`, `youtube`, `bluesky`, `linkedin`, `discord`, `telegram`, `instagram`, `facebook`, `whatsapp`, `line`.

可選的 `rel` 接受空格分隔的關係值，例如 `me` 或 `me nofollow`，適用於內建圖示、自訂圖片及純文字連結。未填或留空保持 `noopener noreferrer`；值會轉為小寫並去重，安全屬性始終保留，衝突的 `opener` 會被忽略。不會按平台自動加入 `me`，僅用於自己的身分連結。[Mastodon 驗證](https://docs.joinmastodon.org/user/profile/#link-verification)：先部署，再於 Mastodon 個人資料欄位填寫並儲存網站 HTTPS 網址。請用含有返回帳號連結的實際頁面（如 `/en/`）；根路徑 HTML 跳轉頁可能沒有此連結。驗證由 Mastodon 伺服器執行。

```ts
{ href: "https://mastodon.social/@yourname", label: "Mastodon", icon: "mastodon", rel: "me" },
```

自訂圖片：將 `community.svg` 放入 `public/icons/`，再為連結設定 `iconSrc: "/icons/community.svg"`。支援本機 SVG、PNG、WebP，路徑以 `/` 開頭，不使用遠端網址、查詢參數、片段或編碼字元；主題會自動加上 Astro 的 `base`。檔案不存在或圖示名稱不受支援時，開發/建置會回報設定錯誤。

優先順序為 `iconSrc` → `icon` → 文字。內建圖示繼承選單顏色，自訂圖片保留原色；`label` 提供無障礙名稱。頁尾連結過多會換行，頂欄保持單行，空間不足時可橫向捲動；寬度不超過 720px 時仍隱藏頂欄社群入口，頁尾保留。空 `links` 保留原有三個不可點擊的佔位圖示。修改後重新建置、部署。

## 使用指南 1：設定你的部落格

### 安裝並在本機開啟

使用 Node.js 22.12.0 或更新版本。上方指令只需執行一次，會建立新的 `my-blog` 資料夾並略過相依套件安裝。完成其餘精靈提示後繼續下方步驟；若更改資料夾名稱，也要調整 `cd`。

```bash
cd my-blog
npm install
npm run dev
```

開發伺服器會持續執行。執行後續指令前，按 `Ctrl+C` 停止它，或另開終端並進入 `my-blog`。以下指令都在專案資料夾內執行，不必再次建立專案。

開啟終端顯示的網址。若使用 pnpm，仍以相同 npm 指令建立專案，略過精靈的安裝步驟，再執行 pnpm install 與 pnpm dev。

### 網站資料與首頁網址

編輯 src/site.config.ts 裡的設定物件，保留 imports 與 exports。替換網域、名稱、作者與文字，並將範例合併至現有設定。

```ts
export const THEME_CONFIG = defineThemeConfig({
  site: { title: 'My Blog', author: 'Your Name', url: 'https://your-domain.example' },
  i18n: {
    defaultLocale: 'zh-hant',
    routing: { defaultLocalePrefix: 'never' },
    locales: {
      'zh-hant': {
        site: { hero: 'My Blog' },
        messages: { siteDescription: 'My Blog' },
      },
    },
  },
});
```

site.url 影響 canonical、RSS、sitemap 與分享圖網址。建置環境或 .env 中的 PUBLIC_SITE_URL 優先於設定檔；變更後需重啟開發伺服器或重新建置。首頁可見介紹來自該語言的 site.hero，描述來自 messages.siteDescription。只修改 site.description 不會取代它們。

defaultLocalePrefix: 'never' 讓預設語言首頁直接顯示於 /。預設的 'always' 會導向 /<語言>/，可能短暫顯示 “Redirecting to home…”。即使使用 'never'，文章仍位於 /zh-hant/blog/。

social.links 使用 href、label 與 icon（github、twitter 或 mastodon）。空清單會保留不可點擊的裝飾圖示。site.tagline 可增加頁尾文字。

About 正文段落與簽名保留設定字串中的換行：`\n` 換行，`\n\n` 留一空行，長句仍自動換行。內容仍是純文字，不解析 Markdown 或 HTML，請勿插入 `<br>`。

頁尾將版權、佈景主題/Astro 署名及選填的 `site.tagline` 分組呈現，下方保留社群圖示。內建署名隨頁面語言切換，自訂說明在各語言中保留原文；空白說明不占空間，手機上的長文案自動換行。現有設定及 `PUBLIC_SITE_TAGLINE` 覆寫仍有效，無須遷移。

### 選擇語言

預設啟用 en、ja、ko、es、zh、pt-br、de、ru、zh-hant 九種語言，英語是初始預設語言。可合併下列設定停用部分語言：

```ts
i18n: {
  locales: {
    ja: { meta: { enabled: false } },
    ko: { meta: { enabled: false } },
  },
},
```

省略語言不代表停用，因為設定會與預設值合併。預設語言永遠保持啟用。若只需要單一語言，請明確停用另外八種。這不會刪除檔案或翻譯文章。

### 替換範例並撰寫文章

每種語言都有歡迎文章與三篇指南。先備份，再刪除不需要的範例；保留其他文章仍在使用的圖片。

```bash
npm run new-post -- my-first-post --locales zh-hant
```

先建立一篇繁體中文文章。省略 `--locales zh-hant` 才會為所有啟用語言建立骨架（初始共九份），不會自動翻譯，也不會覆寫現有檔案。 請編輯 src/content/blog/zh-hant/my-first-post.md 的標題、描述與正文。

### 檢查與部署

```bash
npm run doctor
npm run preview
```

doctor 包含檢查與建置。preview 僅在本機顯示結果，不會發布到網路。靜態輸出在 dist/，包含搜尋索引與分享圖。託管服務使用 npm run build 建置，以 dist 為輸出目錄。依照 [Astro 部署指南](https://docs.astro.build/en/guides/deploy/) 完成發布，並檢查頁面、語言切換、搜尋及 /zh-hant/rss.xml。

### 設定原則

同一物件只保留一個 theme 與一個 i18n，將選項合併進去。陣列會整份取代舊值。不要直接修改 src/config/ 的產生檔。更新 npm 套件不會更新本機 starter 檔案；遷移前請閱讀[升級指南](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md)。

- [使用指南 2：撰寫與整理內容](https://demo.anglefeint.com/zh-hant/blog/starter-guide-2-languages-and-routing/)

## 語言

預設啟用九種語言：`en`、`ja`、`ko`、`es`、`zh`、`pt-br`、`de`、`ru`、`zh-hant`。`new-post` 初始會建立九份骨架，不會自動翻譯。請在 `src/site.config.ts` 以 `meta.enabled: false` 關閉不需要的語言，省略設定不會停用，預設語言會保持啟用。只建立繁體中文：`npm run new-post -- my-post --locales zh-hant`。

## 使用指南 2：撰寫與整理內容

### 建立文章

```bash
npm run new-post -- my-first-post --locales zh-hant
```

只建立繁體中文可用 npm run new-post -- my-first-post --locales zh-hant。slug 使用小寫英文字母、數字與連字號。src/content/blog/zh-hant/my-first-post.md 對應 /zh-hant/blog/my-first-post/。現有檔案不會被覆寫。--locales 只建立檔案，不會啟用語言。

譯文請使用相同 slug。缺少譯文時，語言選單會導向目標語言的列表；hreflang 不會將列表冒充文章譯文。

### 填寫 frontmatter

```yaml
---
title: 'My first post'
description: 'My notes and projects'
pubDate: '2026-10-03'
tags: ['astro', 'notes']
---
```

title、description、pubDate 必填；subtitle、updatedDate、author 選填，作者預設使用網站作者。列表依 pubDate 排序。目前沒有草稿或排程發布篩選：draft: true 與未來日期都不會隱藏文章。未完成內容請放在 src/content/blog/ 之外。

heroImage: ./cover.jpg 使用文章旁的圖片。若 src/assets/blog/default-covers/ 有圖片，指令會分配固定封面，不會下載圖片。閱讀時間與其他指標都是估計值，可用 readMinutes、wordCount、tokenCount、aiLatencyMs、aiConfidence 覆寫；這些資料不代表連接了真實 AI 服務。

### 目錄與標籤

使用 Markdown 的 ## 與 ### 標題。寬螢幕的目錄在右側，窄螢幕在正文前，沒有標題時不顯示。toc: false 可停用單篇目錄；toc: true 優先於全站設定。MDX 元件或 HTML 產生的標題不會自動收集。

tags: ['astro', 'notes'] 會產生 /zh-hant/tags/ 等頁面。標籤區分大小寫，會去除前後空白與重複項。非拉丁文字採用編碼網址；重新命名會改變連結。theme.tags.enabled: false 停用連結與標籤頁。

### 圖片與程式碼

加入對應檔案後，可使用 `![圖片說明](./photo.jpg)` 或 `![圖片說明](https://demo.anglefeint.com/images/photo.jpg)`。正文一般圖片可點擊或按 Enter／空白鍵放大，按 Escape、關閉按鈕或背景離開。封面及連結或按鈕內的圖片不包含在內。預覽使用瀏覽器已選取的圖片，不會自動載入更高解析度原圖。

以三個反引號建立 Markdown 程式碼區塊，便會出現複製按鈕。複製保留縮排與換行，需要 HTTPS 或 localhost；失敗時請手動複製。

### 搜尋

執行 npm run build 與 npm run preview 後測試。搜尋範圍是目前語言文章的標題與正文，dev 僅顯示提示。search: false 只排除索引，不會隱藏文章或阻止直接存取。theme.search.enabled: false 同時停用入口與索引。修改內容後需重建。

### 分享圖

未指定 ogImage 時，建置會用標題、作者與網站名稱產生 1200×630 PNG，不影響 heroImage。自訂圖片可使用 ogImage: ./share.png 或 /images/share.png，也支援 HTTPS。缺少本機檔案會報錯，外部圖片則依賴外部服務。

自動分享圖使用主題內附的代碼雨、終端與霓虹網路背景，網站名稱、標題和作者仍使用你的內容。右下角的小字 `Theme by Anglefeint` 沿用 `theme.footer.showCredits`（預設 `true`）；設為 `false` 會同時隱藏頁尾與圖片署名，修改後請重新建置部署。自訂 `ogImage` 不會被修改。背景離線使用，不增加瀏覽器 JavaScript。

明確設定的 ogImage 優先。theme.socialImage.enabled: false 只停用自動產生，其他文章回退到封面或預設圖。檢查 HTML 的 og:image 與 dist/\_social/。分享平台可能快取舊圖，不保證支援所有 emoji 與文字系統。

### 獨立頁面

npm run new-page -- projects --theme cyber 會建立 src/pages/[lang]/projects.astro，內容需自行編輯，不會自動翻譯或增加導覽項目。可用 base、ai、cyber、hacker、matrix，slug 支援 projects/labs 這類路徑。檔案已存在時會報錯。

- [使用指南 2：撰寫與整理內容](https://demo.anglefeint.com/zh-hant/blog/starter-guide-2-languages-and-routing/)

## 使用指南 3：選用功能

### 音樂

把音檔放在 public/music/，並合併：

```ts
theme: {
  music: { enabled: true, tracks: [{ title: 'My Song', src: '/music/my-song.mp3' }] },
},
```

每首曲目包含 title、src 與選填 artist，空清單會隱藏播放器。首次播放需點擊。分頁工作階段會記住曲目、進度與音量，但恢復播放取決於瀏覽器政策，跨頁可能有短暫中斷。最後一首結束後回到第一首。

播放器先下載完整音檔再播放，大檔案會增加等待與記憶體使用。外部音檔需要 CORS；本機檔案沒有這項要求。enabled: false 可停用播放器。

### 選用：Google Analytics 4

在 `src/site.config.ts` 現有的 `defineThemeConfig({...})` 物件中新增或修改以下頂層設定（與 `site` 同層，不放在 `theme` 內）：

```ts
analytics: {
  googleAnalyticsId: 'G-XXXXXXXXXX',
},
```

在 Google Analytics → 管理 → 資料串流 → 網站串流中複製 **評估 ID**（`G-...`），不是資源名稱或數字資源 ID。留空即停用。所有語言和主題頁面共用一個 ID，可依頁面路徑區分語言。重新建置部署後，瀏覽線上網站，在 GA4 即時報表中確認資料。

開發模式及 localhost/回環位址預覽不傳送資料；設定後，遠端預覽和區域網路位址預覽會統計。預設範本不載入 Google 指令碼。不要透過 GTM、Zaraz 或手動程式碼重複接入相同統計。本選項不包含 Cookie 同意橫幅或同意管理；有此需求的網站應先完成對應設定，再啟用統計。指令碼封鎖工具可能阻止資料收集。舊專案需要相符的設定輔助檔案與配接器，詳見[升級指南](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md)。

### Giscus 留言

準備已啟用 Discussions 的公開儲存庫、安裝應用程式，並從 [giscus.app](https://giscus.app/) 取得 ID。

```ts
theme: {
  comments: {
    enabled: true, repo: 'yourname/your-repository',
    repoId: 'REPLACE_WITH_REPO_ID', category: 'Announcements',
    categoryId: 'REPLACE_WITH_CATEGORY_ID', mapping: 'pathname', lang: '',
  },
},
```

替換 ID 與分類，不必在每篇文章貼入指令碼。必要欄位空白會隱藏元件。lang: '' 跟隨文章語言：pt-br 對應 pt、zh-hant 對應 zh-TW、zh 對應 zh-CN；預設是固定英語。

mapping: 'pathname' 依路徑對應討論串；'specific' 需要 term，'number' 需要以字串提供正整數 number。不合法的值會報錯。strict、reactionsEnabled 使用 '0' 或 '1'。無法顯示時檢查 ID、權限、連線與瀏覽器阻擋。

### 關於頁

編輯 i18n.locales['zh-hant'].about：sections（who、what、ethos、now、contactLead、signature）、contact（email、githubUrl、githubLabel）、sidebar、labels、modals、effects。ethos 是陣列，其他語言需分別編輯。頁面工具只是視覺示範，不是真實 AI 服務。email 空白可隱藏連結；theme.enableAboutPage: false 會移除頁面與導覽入口。

### 數量與功能開關

```ts
theme: {
  homeLatestCount: 3, blogPageSize: 9,
  enableAboutPage: true, effects: { enableRedQueen: true },
  search: { enabled: true }, toc: { enabled: true }, tags: { enabled: true },
  socialImage: { enabled: true }, footer: { showCredits: true },
},
```

改成 false 可停用對應功能。enableRedQueen 只控制文章監視器；文章的 toc: true 可覆寫全站設定；socialImage 不會停用手動 ogImage。各頁氛圍由版型決定，沒有全站切換四種主題的單一開關。

homeLatestCount 控制最新文章數，blogPageSize 控制列表與標籤分頁。pagination.windowSize 限於 5–21。jump.enabled 啟用且總頁數超過 showJumpThreshold（預設 12）才顯示跳頁輸入框；jump.enterToGo 控制 Enter。style.mode 支援 fixed、sequential、random；random 對同一頁穩定，不會每次重新整理都變。style.enabled: false 保留基本分頁。

### 更多語言與首頁網址

在 i18n.locales 新增代碼，提供 meta（label、hreflang、ogLocale、enabled、fallback）、site.hero、messages、about，再用 --locales 建立文章。fallback 補足缺少的設定文字，不會翻譯文章或混合列表語言；必要時會加入預設語言。label 只改選單名稱。

defaultLocalePrefix: 'always' 讓 / 導向語言首頁；'never' 對預設語言反向處理。文章仍保留語言路徑。

### 頁尾與驗證

footer.showCredits: false 隱藏主題與 Astro 連結，保留建置年份及 site.title。site.tagline 是獨立文字。舊值 Built with Astro. 會視為內建署名，避免重複顯示。

所有設定合併在同一個 theme 或 i18n，陣列會整份取代。開發時檢查，執行 npm run doctor，再以 npm run preview 測試搜尋。重新建置與部署才會套用到線上。

- [使用指南 2：撰寫與整理內容](https://demo.anglefeint.com/zh-hant/blog/starter-guide-2-languages-and-routing/)

## 升級

先使用公開模板建立專案。相容的套件更新可執行 npm update @anglefeint/astro-theme，再執行 npm run doctor。

npm update 遵守 package.json 的版本範圍，^0.5.1 不包含 0.6.0。請閱讀發布說明，必要時安裝明確版本，不要盲目使用 @latest。npm ls @anglefeint/astro-theme astro 可查看安裝版本。

套件不會更新本機 starter 的設定、路由、介接檔與整合。若專案結構改變，請在另一個資料夾建立新 starter，遷移內容與個人設定，不要用舊輔助檔覆蓋新版。

doctor 已包含檢查與建置，通過後使用 npm run preview。只有產生的介接檔與本機範本不同步時才執行 npm run sync-adapters；它不會下載上游範本。舊專案可能有不同指令。

升級 Astro 主版本時先依官方遷移指南處理，其他細節請看[升級指南](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md)。

```bash
npm update @anglefeint/astro-theme
npm run doctor
npm run preview
```

## 預覽

![Home](public/images/theme-previews/preview-home.png)

![Blog](public/images/theme-previews/preview-blog-list.png)

![Article](public/images/theme-previews/preview-blog-post-open.png)

![About](public/images/theme-previews/preview-about.png)

## 授權

MIT — [LICENSE](LICENSE).

## 數學公式

Markdown 和 MDX 文章預設全域支援 LaTeX 風格數學公式。行內寫 `$C_{saved}$`，獨立公式放在單獨兩行 `$$` 之間，不需要逐篇開關或自行安裝外掛。

```markdown
Inline: $C_{saved}$

$$
\frac{a}{b}
$$
```

在 `src/site.config.ts` 設定 `theme: { math: { enabled: false } }` 可關閉。一般美元有歧義時寫成 `\$`；行內程式碼與程式碼區塊保持原樣。關閉後恢復一般 MDX 規則，包括大括號內的 JavaScript 表達式。

公式於建置時渲染，樣式與字型隨網站提供，保留可存取的 MathML，不載入瀏覽器數學引擎。長公式可橫向捲動。錯誤公式會中止建置並提示來源與原因。標題與摘要維持純文字；搜尋索引排除公式。支援 KaTeX 數學語法，並非完整 LaTeX 文件。

舊專案需要依升級指南完成一次 starter／設定遷移，只更新主題套件不會接入 Markdown 處理器。

## 靜態部署

執行 `npm run build`，把 `dist/` 內全部內容上傳到靜態網站根目錄；伺服器需支援目錄下的 `index.html`。不依賴 Cloudflare，也不需要線上 Node.js 程序。建置前設定 `site.url` 與任何 `PUBLIC_SITE_URL` 覆蓋值，修改後重新建置部署。選用留言、GA4 與遠端音訊仍會存取各自服務。

## 文章統計

字詞數是來源正文的概略統計：中日韓字元逐字計算，其他文字主要依空白分割。tokens 預設為 `round(max(words, 1) × 1.3)`，並非模型分詞器結果或實際 AI 用量。達到 1,000 後以一位小數和 k 顯示。frontmatter 的 `wordCount`、`tokenCount`、`readMinutes` 分別覆蓋各自值；只改 wordCount 不會重算 tokens。公式與 MDX 原始碼也可能影響估算。
