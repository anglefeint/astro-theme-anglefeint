[English](README.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Português (Brasil)](README.pt-BR.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [繁體中文](README.zh-Hant.md)

<p align="center">
  <a href="https://demo.anglefeint.com/zh-hant/">
    <img src="public/images/theme-previews/anglefeint-brand.webp" alt="Anglefeint — Matrix / Cyberpunk / Hacker / AI" width="1600" />
  </a>
</p>

<p align="center">為人類讀者與 AI 智慧代理打造，具有多種電影氛圍的 Astro 個人內容發佈主題。</p>

自動生成 `llms.txt`、多語言索引、全文合集與文章 Markdown，方便 AI Agent 讀取和引用內容，支援 GEO（生成式引擎最佳化）。

<p align="center">
  <a href="https://demo.anglefeint.com/">線上展示</a>
  ·
  <a href="https://github.com/anglefeint/astro-theme-anglefeint">程式碼儲存庫</a>
</p>

<p align="center">
  <a href="#ai-assistant">AI 助手</a> · <a href="#installation">安裝</a> · <a href="#setup">網站設定</a> · <a href="#writing">寫文章</a> · <a href="#upgrade">升級</a> · <a href="#deployment">建置與部署</a>
</p>

<p align="center">
  <img alt="Astro" src="https://img.shields.io/badge/Astro-7.3.7-BC52EE?logo=astro&logoColor=white" />
  <img alt="Node" src="https://img.shields.io/badge/Node.js-22.12%2B-339933?logo=node.js&logoColor=white" />
  <img alt="Locales" src="https://img.shields.io/badge/i18n-9%20languages-0A7EA4" />
  <img alt="Deployment" src="https://img.shields.io/badge/Deploy-Static%20Hosting-0A7EA4" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT-2EA043" />
</p>

## Anglefeint 能做什麼？

用 Markdown／MDX 寫文章，用 Fragments 記錄短想法；內建多語言、搜尋、標籤、目錄、程式碼複製、圖片預覽、數學公式和自動文章分享圖片。評論、音樂與 GA4 可依需求啟用。

| 頁面             | 視覺氛圍                               |
| ---------------- | -------------------------------------- |
| 首頁             | Matrix：綠色程式碼雨、終端機與像素頭像 |
| 部落格及標籤列表 | Cyberpunk：霓虹、雨幕與城市光束        |
| About            | Hacker：個人介紹、虛擬終端機和互動工具 |
| 文章詳情         | AI：網路背景、監視器與 OUTPUT 閱讀面板 |

建置還會生成公開文章、About 和 Fragments 的 Markdown、`llms.txt` 及多語言全文合集，方便 AI 工具讀取，不需要另設正式環境伺服器；不保證模型收錄或引用。

<a id="ai-assistant"></a>

## 用 AI 助手協作

可讓 Cursor、Codex 或 Claude Code 按目前專案的 `AGENTS.md` 設定網站和管理內容；已有的 `CLAUDE.md`、Cursor 規則會指向對應指引。先說明要改什麼，讓助手查實際設定和本文相應章節，需要欄位細節時再進入 demo 字典。

參與主題開發請從儲存庫的 [AGENTS.md](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/AGENTS.md) 和[貢獻指南](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/CONTRIBUTING.md)進入；部落格使用者不需要先學習維護者發佈流程。

<a id="installation"></a>

## 1. 安裝並啟動

需要 **Node.js 22.12.0 或更新版本**，模板基于 **Astro 7**。在準備存放部落格的目錄執行：

```bash
npm create astro@latest -- my-blog --template anglefeint/astro-theme-anglefeint#starter --no-ai
cd my-blog
npm run dev
```

建立精靈詢問是否安裝相依套件時，請選 Yes；只有主動略過安裝時，才需要在啟動前執行 `npm install`。`--no-ai` 略過額外產生的通用 AI 助手指引檔；主題自己的協作指引已包含在 starter 中。

打開終端機輸出的網址。已有專案只需在原目錄執行 `npm run dev`，不用重新建立部落格。尚未安裝或相依套件變更時，才需要執行 `npm install`。停止服務按 Ctrl+C；後續指令在專案根目錄執行，可停止 dev 後執行，或另開終端機。

新專案也可使用 `pnpm install`、`pnpm dev`；一個專案保持使用同一種套件管理工具。下文以 npm 為例，自動升級工具目前僅支援 npm 專案。

詳細步驟：[安裝部落格，換成自己的資訊](https://demo.anglefeint.com/zh-hant/blog/starter-guide-1-configure-your-site/)。

<a id="setup"></a>

## 2. 首次設定：換成自己的資訊

安裝後的專案已經帶有 `src/site.config.ts`，**直接打開這個檔案修改，不需要新建設定檔案或宣告新的設定物件**。

在檔案現有的 `defineThemeConfig({ ... })` 內加入下面的 `site` 設定，把名稱、作者、介紹和網域換成自己的。starter 預設省略了 `site`，使用主題預設值；如果你的檔案已經有 `site`，直接修改其中的欄位，保留其他設定，不要重複添加同名物件。檔案原有的 import、export 和其他設定保持不動。

```ts
site: {
  title: '我的部落格',
  author: '你的名字',
  description: '記錄專案、閱讀和生活。',
  url: 'https://your-domain.example',
},
```

這段設定只修改全站資訊，不改變語言設定。沒有單獨設定在地化 `homeTitle` 時，首頁大標題會使用全站 `title`。首頁介紹、About 內容和社交連結也可以換成自己的，具體欄位見本節末尾的教學和字典。

`site.url` 是正式網站的公開地址，不是本機 dev 地址。部署環境中的 `PUBLIC_SITE_URL` 會覆寫它；改了設定卻仍使用舊網域時，先檢查這一項。

初始設定啟用九種語言，預設語言為英文，訪問 `/` 會進入 `/en/`。閱讀繁體中文 README 並不需要將部落格改為繁體中文。若想調整預設語言或只發佈部分語言，再按[語言教學](https://demo.anglefeint.com/zh-hant/blog/starter-guide-languages/)設定；省略某種語言不會關閉它，預設語言始終啟用，系統不會自動翻譯文章。範例文章可在備份或提交 Git 後刪除，不要刪掉仍被內容引用的圖片。

操作教學：[安裝與首次設定](https://demo.anglefeint.com/zh-hant/blog/starter-guide-1-configure-your-site/)、[選擇語言和首頁地址](https://demo.anglefeint.com/zh-hant/blog/starter-guide-languages/)。欄位參考：[網站與公共介面](https://demo.anglefeint.com/zh-hant/blog/config-site-chrome/)、[首頁](https://demo.anglefeint.com/zh-hant/blog/config-home/)。

<a id="writing"></a>

## 3. 寫第一篇文章

在專案根目錄建立文章：

```bash
npm run new-post -- my-first-post
```

未指定 `--locales` 或 `ANGLEFEINT_LOCALES` 時，讀取專案中全部已啟用的語言，為每種語言生成同名文章範本。初始設定啟用九種語言，因此會建立九份檔案；如果你已調整語言開關，就按調整後的啟用語言生成。它不會自動翻譯內文，已有檔案不會被覆寫。

檔案位於 `src/content/blog/<語言>/my-first-post.md`，訪問路徑為 `/<語言>/blog/my-first-post/`，列表為 `/<語言>/blog/`。例如英文檔案是 `src/content/blog/en/my-first-post.md`，中文檔案是 `src/content/blog/zh/my-first-post.md`。打開自己需要的檔案，修改標題、描述和內文，不需要手動建立路由。一個最小內容範例：

```md
---
title: '我的第一篇文章'
description: '記錄這次開始寫部落格的想法。'
pubDate: '2026-11-13'
---

在這裡開始撰寫內文。
```

上面只展示必需欄位，生成檔案已有的封面和其他選用欄位可繼續保留。一般文章名使用小寫英文字母、數字和連字號，如 `my-first-post`。

如果只想建立指定語言的檔案，再使用 `--locales`。下面是選用用法，不必逐條執行：

```bash
# 只產生英文
npm run new-post -- my-first-post --locales en

# 只產生中文
npm run new-post -- my-first-post --locales zh

# 產生指定的多種語言
npm run new-post -- my-first-post --locales en,zh
```

`--locales` 只選擇生成檔案，不會啟用語言；對應語言需在網站設定中啟用才能生成其頁面。同一次調用的新檔案共用一張隨機預設封面（來源池有圖片時），已有檔案仍不會被覆寫。

也可使用 `ANGLEFEINT_LOCALES` 環境變數選擇語言，優先級為 `--locales` → 環境變數 → 專案已啟用語言。Bash 可寫 `ANGLEFEINT_LOCALES=zh,en npm run new-post -- my-first-post`；PowerShell 直接使用上面的 `--locales` 指令即可。

**目前沒有草稿或未來日期自動隱藏功能。** 生成的各語言範本也會隨建置公開，發佈前應完成需要的內容，並將未準備公開的檔案移出內容集合。`draft: true` 和 `search: false` 都不能讓內容變成私密文章。

操作教學：[寫第一篇文章](https://demo.anglefeint.com/zh-hant/blog/starter-guide-2-languages-and-routing/)、[添加圖片](https://demo.anglefeint.com/zh-hant/blog/starter-guide-images/)。欄位參考：[文章詳情與 frontmatter](https://demo.anglefeint.com/zh-hant/blog/config-article/)。

## 4. 發佈一條碎片

Fragments 適合簡短文字、圖片或程式碼。**主題和新建 starter 預設關閉碎片功能，展示站單獨開啟了它。** 要在自己的部落格啟用，請在 `src/site.config.ts` 現有 `theme` 物件中設定 `fragments.enabled: true`。下面展示合併後的結構，不要重複建立 theme：

```ts
theme: {
  fragments: { enabled: true },
},
```

如果已有 `enabled: true`，無需重複添加；如果是 false，將其改成 true 即可。這個開關控制碎片列表和首頁預覽入口，評論仍預設關閉。

然後建立一條碎片，預設為專案中全部已啟用語言生成同一條內容的範本：

```bash
npm run new-fragment
```

只想生成指定語言時，再選擇相應參數：

```bash
# 只產生中文
npm run new-fragment -- --locales zh

# 產生指定的多種語言
npm run new-fragment -- --locales en,zh
```

每次執行都會新建一條；上面是不同用法，依需求選擇，不必逐條執行。CLI 語言選擇不自動修改網站語言開關。

檔案生成在 `src/content/fragments/<語言>/`，檔案名類似 `2026-11-13-aB3dE6gH.md`，終端機會印出實際路徑。編輯該檔案內文即可，保留生成的八位字母數字 ID；同次生成的譯文共享 ID 和發佈時間。繼續修改同一條內容時不要再次執行建立指令。

列表地址為 `/<語言>/fragments/`，例如英文 `/en/fragments/`、中文 `/zh/fragments/`；對應語言首頁有碎片時顯示頭像預覽入口。穩定分享地址使用 `/<語言>/fragments/#ID`，不要把頁碼當成內容身分；改 ID 會影響連結和評論關聯。碎片評論預設關閉。

操作教學：[發佈一條碎片](https://demo.anglefeint.com/zh-hant/blog/starter-guide-5-fragments/)。欄位參考：[Fragments](https://demo.anglefeint.com/zh-hant/blog/config-fragments/)。

## 5. 建立自訂頁面

文章用 `new-post`；專案介紹、作品頁等獨立頁面用 `new-page`：

```bash
npm run new-page -- projects
```

生成 `src/pages/[lang]/projects.astro`，預設使用 `base` 主題。打開這個檔案修改內容，然後訪問 `/<語言>/projects/`，例如 `/en/projects/`；一個檔案為所有啟用語言生成頁面，不會自動翻譯內容，也不會自動添加導覽入口。

需要指定視覺風格時可添加 `--theme`，選用 `base`、`matrix`、`cyber`、`hacker`、`ai`；例如 `npm run new-page -- portfolio --theme cyber` 建立另一個 Cyberpunk 頁面。

支援嵌套路徑，例如：

```bash
npm run new-page -- projects/labs --theme hacker
```

路徑每段使用小寫英文字母、數字和連字號；不使用大寫、下劃線或首尾斜杠。已有檔案不會被覆寫，主題保留的標準頁面路徑也不能用這個指令重建。

詳細步驟：[頁面自訂教學](https://demo.anglefeint.com/zh-hant/blog/starter-guide-3-comments-about-and-theme-toggles/)。

## 6. 準備圖片並保留生成檔案

文章內文使用一般 Markdown 圖片；例如把 `photo.jpg` 放在文章旁邊，寫 `![圖片描述](./photo.jpg)`。封面在 frontmatter 中設定 `heroImage: ./cover.jpg`，先放好對應檔案；public 圖片網址不帶 public 前綴。

封面和支援處理的碎片本機圖片需要持久化的響應式檔案。在本機明確準備，或只檢查目前產物：

```bash
npx @anglefeint/astro-theme prepare-covers
npx @anglefeint/astro-theme prepare-covers --check
```

一般 dev、build 和 doctor（包含 CI）會自動補齊缺少、過期或損壞的衍生圖片，並重用正確的既有檔案。原圖缺失、無效圖片或不安全路徑仍會報錯。明確執行的 `prepare-covers --check` 與設定同步只驗證、不修復。將原圖及整個 `src/assets/blog/covers/` 提交到 Git 可以重用產物，不依賴部署平台保留圖片快取。 **版本說明：** build 與 CI doctor 的自動圖片準備從 0.36.2 起支援；使用 0.36.1 時，請先透過 dev 或 `prepare-covers` 準備圖片。

這個指令不代表所有一般文章內文圖片都已壓縮；具體支援範圍、圖片路徑和分享圖片規則見[圖片教學](https://demo.anglefeint.com/zh-hant/blog/starter-guide-images/)。

<a id="reference"></a>

## 依需求要設定功能

常用指令和首次操作在本頁即可完成；要調整功能，再打開對應教學或欄位說明。設定字典逐項解釋型別、預設值、限制、範例和目前未使用狀態。

| 想做什麼                             | 操作教學                                                                                                                                                                                            | 設定字典                                                                                                                                                                                                  |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 調整首頁、網站資訊、導覽、社交和頁尾 | [頁面與功能自訂](https://demo.anglefeint.com/zh-hant/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                                                        | [首頁](https://demo.anglefeint.com/zh-hant/blog/config-home/)、[網站與公共介面](https://demo.anglefeint.com/zh-hant/blog/config-site-chrome/)                                                             |
| 改列表條數、標籤和分頁               | [頁面與功能自訂](https://demo.anglefeint.com/zh-hant/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                                                        | [Blog List 與標籤列表](https://demo.anglefeint.com/zh-hant/blog/config-blog-list/)                                                                                                                        |
| 改文章目錄、數學、OUTPUT 或搜尋收錄  | [寫第一篇文章](https://demo.anglefeint.com/zh-hant/blog/starter-guide-2-languages-and-routing/)                                                                                                     | [文章詳情](https://demo.anglefeint.com/zh-hant/blog/config-article/)、[搜尋與內容發現](https://demo.anglefeint.com/zh-hant/blog/config-search/)                                                           |
| 設定 About、終端機或 Decoder         | [頁面與功能自訂](https://demo.anglefeint.com/zh-hant/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                                                        | [About](https://demo.anglefeint.com/zh-hant/blog/config-about/)、[終端機](https://demo.anglefeint.com/zh-hant/blog/config-terminal/)、[Decoder](https://demo.anglefeint.com/zh-hant/blog/config-decoder/) |
| 開啟音樂或評論                       | [音樂設定](https://demo.anglefeint.com/zh-hant/blog/starter-guide-3-comments-about-and-theme-toggles/)、[讓讀者留下評論](https://demo.anglefeint.com/zh-hant/blog/starter-guide-4-giscus-comments/) | [音樂](https://demo.anglefeint.com/zh-hant/blog/config-music/)、[Giscus 與多語言討論共享](https://demo.anglefeint.com/zh-hant/blog/config-comments/)                                                      |
| 調整語言、統計或公開文本補充         | [多語言](https://demo.anglefeint.com/zh-hant/blog/starter-guide-languages/)、[發佈教學](https://demo.anglefeint.com/zh-hant/blog/starter-guide-deployment/)                                         | [語言與回退](https://demo.anglefeint.com/zh-hant/blog/config-languages/)、[GA4 與 AI 補充](https://demo.anglefeint.com/zh-hant/blog/config-analytics-ai/)                                                 |

不確定欄位在哪裡，從[設定字典總入口](https://demo.anglefeint.com/zh-hant/blog/config-reference/)查找。只修改目前語言的文字不會自動翻譯內容；設定和內容改動都需要重新建置部署。

<a id="upgrade"></a>

## 7. 升級已有部落格

新安裝的部落格無需執行這一節，可直接進入下面的[檢查、預覽和第一次部署](#deployment)。

先保存自己的改動，例如提交到 Git；停止開發服務和 preview，在原專案根目錄先檢查相容性，再執行升級：

```bash
npx @anglefeint/astro-theme@latest upgrade --check
npx @anglefeint/astro-theme@latest upgrade
```

`--check` 不修改檔案、不安裝或建置。實際升級適用於使用 npm、帶 `package-lock.json` 且 `anglefeint.projectSchema: 1` 的整合版 starter；pnpm／yarn／bun 專案不能通過刪除鎖檔案繞過限制。

升級工具更新主題相依並執行 doctor，保留文章、個人設定、音樂、圖片和自訂頁面。它會將兩個相依檔案備份到 `.anglefeint/backups/`；這不是整站備份。安裝或檢查失敗時會還原相依檔案並嘗試重裝舊相依；失敗後不要部署遺留的 `dist/`。

選擇特定版本可用 `npx @anglefeint/astro-theme@latest upgrade --to <版本号>`，使用時將占位替換為相容的明確版本；不支援自動降級。升級成功已完成檢查和建置，可直接 `npm run preview`，不必馬上再 build。升級不會自動發佈網站，也不會自動遷移不相容的 Astro 版本。

0.27 之前的複製式舊範本需要另建 starter、保留舊專案並遷移個人內容與資源，不支援直接原地升級。不要複製舊標準路由或介接器實現。

詳細步驟與還原方法：[已有專案如何升級](https://demo.anglefeint.com/zh-hant/blog/starter-guide-1-configure-your-site/)、[升級指南](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md)、[版本記錄](https://github.com/anglefeint/astro-theme-anglefeint/releases)。

<a id="deployment"></a>

## 8. 檢查、預覽和第一次部署

在專案根目錄停止 dev，先檢查並建置，再預覽生成的網站：

```bash
npm run doctor
npm run preview
```

`npm run doctor` 包含檢查和建置，`npm run check` 是它的同義指令，選擇一個即可；成功後不需要立即再執行 check 或 build。只檢查 Astro／TypeScript、不建置時可用 `npm run check:no-build`。preview 只在本機展示建置產物，按 Ctrl+C 停止，不會上傳網站。真實搜尋也要在建置後的 preview 中使用；dev 只顯示開發提示。

如果只需要建置、不執行完整檢查，可改用下面這一組；兩組選擇其一：

```bash
npm run build
npm run preview
```

pnpm 專案對應使用 `pnpm run doctor`／`pnpm preview`，或 `pnpm build`／`pnpm preview`。檢查指令不要簡寫為 `pnpm doctor`，以免調用 pnpm 自身的診斷指令。兩組選擇其一，無需重複建置。

首次部署到靜態託管平臺時：

1. 將 `site.url` 或 `PUBLIC_SITE_URL` 設定為正式地址，提交源內容、圖片原圖及生成檔案。
2. 託管平臺建置指令設定為 `npm run build`，發佈目錄設定為 `dist`；本機手動上傳時，上傳已成功建置的 **整個 dist 內容**。
3. 保留 `_astro/`、`pagefind/`、`_social/`、公開文本等生成產物，不要只上傳 HTML。
4. 使用網域根部署，並支援目錄 index 路由；任意子路徑部署仍需額外調整，不能只設定 Astro base 就認為整站都已支援。
5. 按託管平臺完成網域和 HTTPS 綁定，再檢查首頁、文章、語言入口、圖片和搜尋。

網站是靜態產物，不需要正式環境 Node.js 服務或額外託管介接器。終端機 JSON 的 noindex 響應頭會合併到建置後的 `dist/_headers`；相容平臺會應用它，其他平臺需要等效設定，Astro preview 不會模擬託管響應頭。內容或設定改動後，重新建置並完整部署。

詳細步驟：[把部落格發佈到自己的網域](https://demo.anglefeint.com/zh-hant/blog/starter-guide-deployment/)。

## 授權條款

本主題采用 [MIT License](LICENSE)。

## 預覽

![Anglefeint — Four cinematic worlds](public/images/theme-previews/promo-overview.jpg)

![Anglefeint — Cyberpunk Cards and List](public/images/theme-previews/promo-cyberpunk.jpg)

![Anglefeint — Hacker About and Decoder Lab](public/images/theme-previews/promo-hacker.jpg)

![Anglefeint — AI reading and GEO](public/images/theme-previews/promo-ai.jpg)

### 分享預覽

![Anglefeint 預設分享圖片](https://raw.githubusercontent.com/anglefeint/astro-theme-anglefeint/main/packages/theme/src/assets/theme/social/anglefeint-og.jpg)

### 頁面擷圖

| 首頁                                                           | 部落格列表                                                                |
| -------------------------------------------------------------- | ------------------------------------------------------------------------- |
| ![Home preview](public/images/theme-previews/preview-home.jpg) | ![Blog Cards preview](public/images/theme-previews/preview-blog-list.jpg) |

| Blog · 列表模式                                                            |
| -------------------------------------------------------------------------- |
| ![Blog List view](public/images/theme-previews/preview-blog-list-mode.jpg) |

| 文章頁                                                                   |
| ------------------------------------------------------------------------ |
| ![Blog post preview](public/images/theme-previews/preview-blog-post.jpg) |

| About                                                            |
| ---------------------------------------------------------------- |
| ![About preview](public/images/theme-previews/preview-about.jpg) |

| 部落格分頁                                                                   | 文章相關推薦                                                                |
| ---------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| ![部落格分頁](public/images/theme-previews/preview-blog-list-pagination.jpg) | ![文章相關推薦](public/images/theme-previews/preview-blog-post-related.jpg) |

| Decoder Lab                                                      |
| ---------------------------------------------------------------- |
| ![Decoder Lab](public/images/theme-previews/preview-decoder.jpg) |

| Decoder Lab · 密碼朋克資源                                                           |
| ------------------------------------------------------------------------------------ |
| ![Decoder Lab resources](public/images/theme-previews/preview-decoder-resources.jpg) |
