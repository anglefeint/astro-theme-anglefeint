[English](README.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Português (Brasil)](README.pt-BR.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [繁體中文](README.zh-Hant.md)

<p align="center">
  <a href="https://demo.anglefeint.com/zh-hant/">
    <img src="public/images/theme-previews/anglefeint-brand.webp" alt="Anglefeint — Matrix / Cyberpunk / Hacker / AI" width="1600" />
  </a>
</p>

<p align="center">為人類讀者與 AI 智慧代理打造的多氛圍電影感 Astro 個人發布主題。</p>

自動產生 `llms.txt`、多語言索引、全文合集與文章 Markdown，方便 AI Agent 讀取和引用內容，支援 GEO（生成式引擎最佳化）。

[Demo](https://demo.anglefeint.com/zh-hant/) · [GitHub](https://github.com/anglefeint/astro-theme-anglefeint)

<p align="center">
  <a href="#ai-assistant">AI 助手</a> · <a href="#installation">安裝</a> · <a href="#setup">網站設定</a> · <a href="#writing">寫文章</a> · <a href="#upgrade">升級</a> · <a href="#deployment">建置與部署</a>
</p>

<p align="center">
  <img alt="Astro" src="https://img.shields.io/badge/Astro-7.3.7-BC52EE?logo=astro&logoColor=white" />
  <img alt="Locales" src="https://img.shields.io/badge/i18n-9%20languages-0A7EA4" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT-2EA043" />
</p>

<a id="ai-assistant"></a>

## 使用 AI 助手

建議用 Cursor、Codex 或 Claude Code 設定站點、撰寫文章和自訂頁面。先讀目前專案的 AGENTS.md，以程式碼和實際設定為準；CLAUDE.md 與 Cursor 規則引用同一套指引。

- **部落格使用者（starter）**: 從 [AGENTS.md](https://github.com/anglefeint/astro-theme-anglefeint/blob/starter/AGENTS.md) 開始，依需要查[設定](https://github.com/anglefeint/astro-theme-anglefeint/blob/starter/src/content/blog/zh-hant/starter-guide-1-configure-your-site.md)／[寫作](https://github.com/anglefeint/astro-theme-anglefeint/blob/starter/src/content/blog/zh-hant/starter-guide-2-languages-and-routing.md)教學。
- **主題維護者（main）**: 從 [AGENTS.md](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/AGENTS.md) → [AI 工作流程](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/docs/AI_WORKFLOW.md) 開始；實作結構查[架構文件](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/docs/ARCHITECTURE.md)，修改程式碼後依[文件同步流程](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/docs/DOC_SYNC_WORKFLOW.md)更新說明。

<a id="installation"></a>

## 安裝

目前範本基於 **Astro 7**。

使用 Node.js 22.12.0 或更新版本。在準備存放部落格的目錄執行以下命令，再開啟開發服務顯示的網址。

```bash
npm create astro@latest -- my-blog --template anglefeint/astro-theme-anglefeint#starter --no-install --no-ai
cd my-blog
npm install
npm run dev
```

已有部落格時，在原專案執行 `npm install` 與 `npm run dev`，無需再建立一份。執行其他命令前以 Ctrl+C 停止 dev，或另開終端。pnpm 使用者使用 `pnpm install` 與 `pnpm dev`。

<a id="setup"></a>

## 網站設定

編輯 `src/site.config.ts` 中既有的設定物件。網站資訊、社群連結、About 內容和主題選項都在這裡設定。保留匯入與匯出，將設定合併到既有物件中。

```ts
export const THEME_CONFIG = defineThemeConfig({
  site: {
    title: 'My Blog',
    author: 'Your Name',
    description: 'My notes and projects.',
    url: 'https://your-domain.example',
  },
});
```

`site.url` 填寫實際網站網址；若設定了 `PUBLIC_SITE_URL`，它會覆蓋此值。文章或設定修改後，重新建置並部署。

<a id="writing"></a>

## 撰寫文章

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

heroImage: ./cover.jpg 使用文章旁的圖片。若 src/assets/blog/default-covers/ 有圖片，每次執行指令會隨機選擇一張封面，本次新建的各語言文章共用這張封面。既有檔案不會覆寫，之後可修改 heroImage；指令不會下載圖片。字詞數與 tokens 都是估計值，可用 wordCount、tokenCount 分別覆寫。文章頁不再顯示閱讀時間、延遲或信心程度；舊文章的相關欄位可以保留，這些資料不代表連接了真實 AI 服務。

## 獨立頁面

npm run new-page -- projects --theme cyber 會建立 src/pages/[lang]/projects.astro，內容需自行編輯，不會自動翻譯或增加導覽項目。可用 base、ai、cyber、hacker、matrix，slug 支援 projects/labs 這類路徑。檔案已存在時會報錯。

- [使用指南 2：撰寫與整理內容](https://demo.anglefeint.com/zh-hant/blog/starter-guide-2-languages-and-routing/)

## 碎片

從 0.33.2 起，Fragments 共用文章頁的返回頂部按鈕：捲動後顯示，並遵循減少動態效果偏好，無需額外設定。

碎片功能需要主題 0.29.0 或更新版本。既有部落格請先升級，再使用以下設定與命令。

以 Markdown 記錄簡短感想，可選彈窗留言。 將下列欄位合併至 src/site.config.ts 現有 theme。碎片與留言預設關閉；開啟後選單位於 Decoder Lab 下方。

```ts
fragments: { enabled: true, pageSize: 20, comments: { enabled: false } },
```

預設為全部啟用語言建立骨架需要主題 0.31.0 或更新版本。請先升級；0.29–0.30 仍需以 `--locales` 明確指定。

```bash
npx @anglefeint/astro-theme@latest new-fragment
```

與 `new-post` 一致，預設讀取專案全部啟用語言，建立共用同一 ID 和時間戳記的骨架，不會自動翻譯。語言優先順序為 `--locales` → `ANGLEFEINT_LOCALES` → 專案啟用語言。明確指定的清單會去除空白、轉為小寫並去重，略過設定讀取，只建立指定語言目錄，不會自動修改設定中的語言開關。

```bash
npx @anglefeint/astro-theme@latest new-fragment --locales en,zh
npx @anglefeint/astro-theme@latest new-fragment --locales zh-hant
```

0.32.0 起的分享功能：日期連結定位列表中的這則碎片，旁邊提供複製連結。對外分享使用 `/zh-hant/fragments/#ID`，其中 ID 是 Markdown frontmatter 的 id。目前頁面沒有該則時，才讀取本語言的輕量靜態索引，自動跳至對應分頁。新增內容、修改日期或 pageSize 後重新建置即可，保留原 ID。跨頁定位和複製需要啟用 JavaScript。

0.32.0 起的分頁改進：碎片與 Blog 共用頁碼、霓虹樣式及依門檻顯示的跳頁入口。`theme.pagination` 統一控制兩處分頁；`theme.fragments.pageSize` 仍獨立設定每頁碎片數量。

[使用者指南 5：發布碎片](https://demo.anglefeint.com/zh-hant/blog/starter-guide-5-fragments/)

<a id="upgrade"></a>

## 升級主題

集成版 starter 的標準頁面、設定預設值、翻譯與建置功能由主題套件維護。文章、`src/site.config.ts`、音樂、圖片與自訂頁面留在使用者專案。

使用 npm 的集成版專案在根目錄執行下列指令。工具檢查專案、Node 與 Astro 相容性、備份依賴檔案、安裝確切主題版本並執行 doctor；失敗時還原依賴檔案並嘗試重裝原依賴。完成後依原流程部署，不會自動發布網站。

```bash
npx @anglefeint/astro-theme@latest upgrade
```

0.27 以前的專案需一次重新安裝遷移：在新目錄建立範本，複製文章與資源，將個人設定合併至新的 site config。不要複製舊標準路由、adapter 或 defaults/schema/runtime 輔助檔。保留 slug、語言路徑、音樂與圖片 URL、網域及部署設定。

自動升級目前僅支援 npm，遇到 pnpm/yarn/bun 鎖檔會停止。`--check` 僅檢查，`--to 0.27.1` 指定版本。請參閱[升級指南](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md)與 [GitHub Releases](https://github.com/anglefeint/astro-theme-anglefeint/releases)。

<a id="deployment"></a>

## 建置與部署

```bash
npm run build
```

建置後的靜態網站位於 `dist/`。將該目錄的**全部內容**發布至任意靜態託管即可，無需線上 Node.js 服務或託管平台介面卡。

可用 `npm run preview` 在本機查看建置結果，它不會發布網站。也可使用 `npm run doctor`，一次完成檢查和建置。

請部署到網域根目錄，並支援各目錄的 index.html。子路徑部署需要額外調整，僅設定 Astro `base` 不足以確保正常使用。

文章 sitemap 採用 `updatedDate`，未填時採用 `pubDate`。集成將終端 JSON 的 `X-Robots-Tag: noindex` 合併至 `dist/_headers`，保留原規則且不改源檔。Cloudflare Pages 等相容平台會套用；其他平台需等效標頭設定。請檢查正式部署回應，Astro preview 不套用託管規則。

<a id="reference"></a>

## 功能與設定參考

部落格與標籤文章頁支援卡片／列表切換，並在目前瀏覽器記住選擇。

### 首頁效果與解碼工具

首頁開關：`theme.home.showInitialize` 控制 Initialize/done，`showFollow` 控制 Wake Up/Follow，`showTrace` 控制右下角狀態。於 `src/site.config.ts` 設定，預設皆為 `true`，設為 `false` 可獨立隱藏。 0.18.1:底部兩項狀態預設隱藏，分別回應滑鼠移入或文字選取；全選時兩項都顯現，發光游標只跟隨右側追蹤文字。

可選的 `theme.footer.links` 在頁尾增加一行，每項填寫 `label` 與 `href`，連結以中間點分隔；省略或空陣列隱藏該行。標籤在各語言中保留設定原文，獨立於社群圖示與 `showCredits`。

首頁大標題可在 `src/site.config.ts` 透過 `i18n.locales.<code>.site.homeTitle` 按語言設定，例如 `"zh-hant": { site: { homeTitle: "我的數位花園" } }`。內建及自行新增的語言都適用。未填或只有空白時，沿 `meta.fallback` 鏈查找，最後使用全域 `site.title`（或 `PUBLIC_SITE_TITLE`）。它只改變首頁可見大標題；瀏覽器標題、導覽列、頁尾、RSS 與 SEO 站點名稱維持全域設定。修改後重新建置並部署。

About 提供在地化目錄與醒目的 Contact 欄目：寬螢幕目錄位於正文框右側，小螢幕回到正文內。頂部 Frontier 選單可直達 `/<locale>/about/#contact`；關閉 About 會移除此入口，Decoder Lab 仍由獨立開關控制。

About 視窗按鈕可關閉、最小化或全螢幕顯示閱讀面板，保留瀏覽器本機狀態並支援對應終端指令。集成版標準頁面隨主題套件更新；0.27 以前的專案請依上述步驟完成一次遷移。

About 頁內建 **Hacker Decryptor**：在瀏覽器本機解碼 Base64/Base64URL、URL 編碼、十六進位、HTML 實體、Unicode 跳脫及 JWT 標頭與酬載，支援自動辨識與頁面配色一致的數字結果動畫。從側邊欄開啟 Decryptor 即可使用，無需設定介面。

完整的 **Decoder Lab** 位於 `/<locale>/decoder/`，支援本機文字處理鏈路、EVM／HyperEVM／TRON 的 ERC-20／TRC-20 呼叫解讀及 EVM／TRON／Bitcoin 地址檢查。從 About 解碼視窗開啟；在 `src/site.config.ts` 設定 `theme.enableDecoderPage: false` 可獨立關閉頁面與入口。無需 RPC、錢包連線或 API Key。

自 0.20.0 起：頂部獨立的 **Frontier** 箭頭也可進入 Decoder Lab。配圖卡片連結原文與資料／專案官網，不轉載文章正文。在 `src/site.config.ts` 的 `i18n.locales.<code>.messages.decoderPage.readings` 設定 `tribute` 文案與完整 `links` 清單；空文案隱藏致敬，`links: []` 隱藏卡片。設定多少項就顯示多少項，寬螢幕每列最多八個。參見[設定範例](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/packages/theme/README.md#decoder-reading-configuration)。

Decoder Lab 的視覺風格致敬 **Cypherpunk（密碼龐克）**，紀念他們為人類自由、隱私與開放程式碼作出的貢獻。點對點網路意象與本機處理方式，呼應了讓工具與資料掌握在個人手中的理念。

可選 Matrix 穿越：`theme.effects.enableHomePassage` 預設為 `false`。啟用後，首頁文章連結播放 8 秒綠色穿越再導覽。About 的 `Oracle` 按鈕獨立可用：每次點擊選擇四種場景配色之一，不連續重複；抵達後可拖曳環顧、按滑鼠右鍵退回走廊，按 Escape 或點擊 × 關閉。減少動態效果時，首頁直接導覽，Oracle 顯示靜態預覽。

寬螢幕（1440px 以上）右下角終端預設顯示 `Knock, knock.`。文字可選取複製及捲動，點擊獨立鑰匙孔按鈕才解鎖共享走廊。在 `src/site.config.ts` 設定 `i18n.locales.en.messages.home.transmission` 即可供全部語言使用；需要不同文字時，再設定 `i18n.locales.<code>.messages.home.transmission`。順序為目前語言設定 → 英文設定 → `Knock, knock.`，與一般介面翻譯的回退規則不同。修改後重新建置並部署。

## 支援 AI 閱讀的內容

建置會將公開文章、已啟用的 Fragments 和 About 頁面納入 `/llms.txt`、語言索引與全文合集。文章 Markdown 網址維持不變；各語言另有 `/zh-hant/fragments/index.md` 和 `/zh-hant/about/index.md`（依實際語言替換）。Fragments 檔案合併所有公開分頁，保留每則 ID、發布時間、正文及穩定的 `/<locale>/fragments/#ID` 連結。HTML 頁面提供對應 Markdown 的探索連結。檔案在 `npm run build` 後及 preview 中可用，部署整個 `dist/` 即可。

About 匯出公開簡介、聯絡連結及可開啟的 AI 文字彈窗，排除終端設定、工具與裝飾介面；不匯出留言。停用的頁面／語言、已刪除內容、noindex 頁面與站外 canonical 頁面不匯出；重新建置會清除過期產物與探索連結，保護使用者自有檔案，遇到衝突時停止建置。網站／語言補充說明適用所有匯出文件。JSON-LD 包含頁面語言，About 使用 AboutPage。不需新增設定、伺服器或 UI 依賴，也不保證 AI 收錄或引用。

可在 `src/site.config.ts` 設定 `aiReadableContent.notes`（Markdown 說明）與 `aiReadableContent.links`（`{ label, href }[]`），自動加入索引、全文合集及單篇 Markdown。語言覆寫放在 `i18n.locales.<code>.aiReadableContent`；未設定欄位沿用全域值，`notes: ''` / `links: []` 明確隱藏。參見[設定與升級說明](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md#optional-machine-readable-context)。

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

### 設定原則

- [使用指南 2：撰寫與整理內容](https://demo.anglefeint.com/zh-hant/blog/starter-guide-2-languages-and-routing/)

## 語言

預設啟用九種語言：`en`、`ja`、`ko`、`es`、`zh`、`pt-br`、`de`、`ru`、`zh-hant`。`new-post` 初始會建立九份骨架，不會自動翻譯。請在 `src/site.config.ts` 以 `meta.enabled: false` 關閉不需要的語言，省略設定不會停用，預設語言會保持啟用。只建立繁體中文：`npm run new-post -- my-post --locales zh-hant`。

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

## 使用指南 3：選用功能

公開 demo 已啟用八首來自 Free Music Archive 的示例音樂，starter 仍預設關閉音樂。作者、來源與各曲目授權（CC0 1.0 或 CC BY 4.0）見[音樂署名與授權說明](https://demo.anglefeint.com/music/credits.html)。音樂不適用主題程式碼的 MIT 授權，也不隨 npm 套件或 starter 分發；新增或重用音樂時，請遵守各自授權與署名要求。

### 音樂

把音檔放在 public/music/，並合併：

```ts
theme: {
  music: { enabled: true, tracks: [{ title: 'My Song', src: '/music/my-song.mp3' }] },
},
```

0.18.1:啟用播放器後，每次進入新頁面預設顯示小播放器，點擊 OPEN 展開；曲目進度、音量與續播不受初始大小影響。

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

`shareAcrossLocales: false` (default) — `mapping: 'pathname'`

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

`shareAcrossLocales: false`: mapping: 'pathname' 依路徑對應討論串；'specific' 需要 term，'number' 需要以字串提供正整數 number。不合法的值會報錯。strict、reactionsEnabled 使用 '0' 或 '1'。無法顯示時檢查 ID、權限、連線與瀏覽器阻擋。

留言與跨語言共用預設皆關閉。一般依路徑對應的留言使用上方設定。若要讓譯文共用討論串，保留自己的儲存庫與分類欄位，將對應選項改為：

```ts
theme: {
  comments: {
    // 保留自己的 enabled、repo、repoId、category、categoryId。
    shareAcrossLocales: true,
    mapping: 'specific',
    term: '',
    number: '',
    strict: '1',
    lang: '',
  },
},
```

共用模式要求 mapping 為 specific、term 和 number 為空、strict 為字串 1，依範例填寫。文章頁以不含語言前綴的完整 slug 作為 data-term。例如九語版本皆使用 cypherpunk-ideals-ai-and-the-future-of-crypto；guides/setup 與 other/setup 仍是不同討論。缺少有效 slug 會報錯，譯文須使用相同 slug。lang 留空時介面跟隨頁面語言，明確填寫則固定語言。留言正文不翻譯，只共用討論與表情。

關閉共用時，自訂 mapping、term、number、strict 行為不變：specific 需要非空 term，number 需要正整數字串。開啟共用且啟用留言時，錯誤 mapping、非空 term/number 或非 1 的 strict 會明確報錯。開啟兩個譯文與另一篇文章確認討論關聯。訪客留言需要 GitHub 授權。將範例合併至既有 comments 物件，不要覆蓋其他設定。

既有討論不會自動合併、搬移或刪除。開啟共用可能對應另一個討論，舊留言不會自動出現在共用區。切換前保存原有 mapping、term、number、strict；要恢復舊關聯，設定 shareAcrossLocales: false 並還原上述原值。確需搬移舊留言時，由站長在 GitHub 評估並手動處理，主題不自動遷移。

[留言設定教學](https://demo.anglefeint.com/zh-hant/blog/starter-guide-4-giscus-comments/)

### 關於頁

編輯 i18n.locales['zh-hant'].about：sections（who、what、ethos、now、contactLead、signature）、contact（email、githubUrl、githubLabel）、sidebar、labels、modals、effects。ethos 是陣列，其他語言需分別編輯。頁面工具只是視覺示範，不是真實 AI 服務。email 空白可隱藏連結；theme.enableAboutPage: false 會移除頁面與導覽入口。

### 數量與功能開關

```ts
theme: {
  homeLatestCount: 3, blogPageSize: 10,
  enableAboutPage: true, effects: { enableRedQueen: true },
  search: { enabled: true }, toc: { enabled: true }, tags: { enabled: true },
  socialImage: { enabled: true }, footer: { showCredits: true },
},
```

改成 false 可停用對應功能。enableRedQueen 只控制文章監視器；文章的 toc: true 可覆寫全站設定；socialImage 不會停用手動 ogImage。各頁氛圍由版型決定，沒有全站切換四種主題的單一開關。

homeLatestCount 控制最新文章數，blogPageSize 控制列表與標籤分頁。pagination.windowSize 限於 5–21。jump.enabled 啟用且總頁數超過 showJumpThreshold（預設 12）才顯示跳頁輸入框；jump.enterToGo 控制 Enter。

樣式模式有 `fixed`、`sequential`、`random`。啟用 JavaScript 時，預設 `random` 在每次頁面載入時重新選擇分頁容器與按鈕顏色，結果可能重複。沒有 JavaScript 時，建置的 HTML 保留穩定的容器樣式與靜態按鈕顏色。`style.enabled: false` 使用基本變體，不會關閉分頁。

### 更多語言與首頁網址

在 i18n.locales 新增代碼，提供 meta（label、hreflang、ogLocale、enabled、fallback）、site.hero、messages、about，再用 --locales 建立文章。fallback 補足缺少的設定文字，不會翻譯文章或混合列表語言；必要時會加入預設語言。label 只改選單名稱。

defaultLocalePrefix: 'always' 讓 / 導向語言首頁；'never' 對預設語言反向處理。文章仍保留語言路徑。

### 頁尾與驗證

footer.showCredits: false 隱藏主題與 Astro 連結，保留建置年份及 site.title。site.tagline 是獨立文字。舊值 Built with Astro. 會視為內建署名，避免重複顯示。

所有設定合併在同一個 theme 或 i18n，陣列會整份取代。開發時檢查，執行 npm run doctor，再以 npm run preview 測試搜尋。重新建置與部署才會套用到線上。

- [使用指南 2：撰寫與整理內容](https://demo.anglefeint.com/zh-hant/blog/starter-guide-2-languages-and-routing/)

## 預覽

![Anglefeint — Four cinematic worlds](public/images/theme-previews/promo-overview.jpg)

![Anglefeint — Cyberpunk Cards and List](public/images/theme-previews/promo-cyberpunk.jpg)

![Anglefeint — Hacker About and Decoder Lab](public/images/theme-previews/promo-hacker.jpg)

![Anglefeint — AI reading and GEO](public/images/theme-previews/promo-ai.jpg)

### 分享預覽

![Anglefeint 預設分享圖](https://raw.githubusercontent.com/anglefeint/astro-theme-anglefeint/main/packages/theme/src/assets/theme/social/anglefeint-og.jpg)

這張內建的 1200×630 圖片用於沒有專屬分享圖的頁面，包括 Fragments。可透過 `site.ogImage` 替換網站預設圖。

文章會在 `npm run build` 時，依照文章標題、作者和網站名稱自動產生獨立的 1200×630 PNG。這是建置時產生；開啟分享連結時使用靜態圖片，不呼叫圖片 API，也不增加瀏覽器 JavaScript。修改這些資訊後，重新建置並部署即可更新。

文章 frontmatter 的 `ogImage` 優先於自動產生圖。將 `theme.socialImage.enabled` 設為 `false` 後，文章的 `heroImage` 優先於網站預設圖；內建圖片是最後的回退。

### 頁面截圖

![Home](public/images/theme-previews/preview-home.jpg)

![Blog](public/images/theme-previews/preview-blog-list.jpg)

| Blog · 清單模式                                                            |
| -------------------------------------------------------------------------- |
| ![Blog List view](public/images/theme-previews/preview-blog-list-mode.jpg) |

![Article](public/images/theme-previews/preview-blog-post.jpg)

![About](public/images/theme-previews/preview-about.jpg)

![部落格分頁](public/images/theme-previews/preview-blog-list-pagination.jpg)

![文章相關推薦](public/images/theme-previews/preview-blog-post-related.jpg)

![Decoder Lab](public/images/theme-previews/preview-decoder.jpg)

| Decoder Lab · 密碼龐克資源                                                           |
| ------------------------------------------------------------------------------------ |
| ![Decoder Lab resources](public/images/theme-previews/preview-decoder-resources.jpg) |

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

0.27+ 整合版 starter 由主題套件自動接入 Markdown 處理器與數學支援。只有 0.27 以前的舊骨架需依升級指南完成一次遷移；新專案無需複製處理器或轉接器實作。

## 文章統計

字詞數是來源正文的概略統計：中日韓字元逐字計算，其他文字主要依空白分割。tokens 預設為 `round(max(words, 1) × 1.3)`，並非模型分詞器結果或實際 AI 用量。達到 1,000 後以一位小數和 k 顯示。frontmatter 的 `wordCount`、`tokenCount` 分別覆蓋各自值；只改 wordCount 不會重算 tokens。公式與 MDX 原始碼也可能影響估算。

## 預設分享圖與 Fragment 短 ID（0.33.0+）

在 src/site.config.ts 既有 site 設定中合併 site.ogImage，可填 public 根路徑（如 /images/share.jpg，對應 public/images/share.jpg）或 HTTPS 圖片網址。留空使用內建的 1200×630 Anglefeint 分享圖。Fragments 及所有 #ID 分享連結共用此圖。文章專屬圖、自動產生的文章圖維持優先；停用自動產生時，文章封面也優先於網站預設圖。更換後重新建置並部署，分享平台仍可能快取預覽。

```ts
export const THEME_CONFIG = defineThemeConfig({
  site: { ogImage: '/images/share.jpg' },
});
```

new-fragment 使用區分大小寫的字母與數字產生 8 位 Nano ID，檢查各語言既有 Markdown ID，衝突時重試。同一次命令的所有語言共用 ID 與發佈時間。Fragment 僅接受恰好 8 位英數字 ID，不相容舊 UUID 或長 ID；舊內容請刪除後重新發佈，不提供遷移或舊連結相容。新內容發佈後請保留 ID，修改會改變留言關聯。

## 首頁 Fragment 預覽（0.35.0+）

目前原始碼中，啟用 `theme.fragments.enabled` 且目前語言有碎片時，首頁 header 下方會顯示像素頭像入口。展開後預覽最近三則；整張卡片連到原碎片，底部數量與箭頭連到完整列表。數量代表目前語言的預覽則數 / 總則數。圖片與程式碼採限高預覽，超出部分裁切；停用或沒有內容時不顯示入口。不需新增設定。需要主題 0.35.0 或更新版本。

文章 OUTPUT 保留字數、tokens 與可選模型名稱；不再顯示閱讀時間、latency 和 confidence，即使 frontmatter 有填寫。舊欄位仍可保留。正文與面板直接出現並保持靜止，背景網路與標題光帶保留。這些顯示調整從 0.35.0 起可用。

## Blog List 持久化封面（0.36.0+）

此原始碼變更需要主題 0.36.0 或更新版本，已發佈的 0.35.0 尚未包含。現有 heroImage 路徑不需更動，也可將新原圖放入 src/assets/blog/covers/originals/ 並由文章引用。本機 dev 與本機 doctor 自動補齊缺少或過期的列表封面尺寸；也可執行 `npx @anglefeint/astro-theme prepare-covers`，加上 `--check` 則僅檢查不寫入。原圖及整個 src/assets/blog/covers/（manifest.json、generated/）都要提交到 Git。建置及 CI doctor 僅驗證，缺少、過期或遭修改時失敗，不在部署端重新生成，也不依賴 Astro 圖片快取。列表採原生響應式圖片，優先載入兩張封面候選。WebP 品質 80 沿用現有編碼目標，並非像素無損保證；原圖不變，SVG/動畫封面保留原格式。

文章詳情頁主封面也使用這些響應式檔案；Canvas 特效重用頁面已選擇的圖片，不再另行下載原圖。

碎片本機圖片也使用相同衍生目錄，包括 public 中的 `/images/...` 和 Markdown／HTML 相對圖片連結。自動補齊缺少的寬高，列表與首頁預覽共用響應式檔案；遠端圖片不做本機轉換。
