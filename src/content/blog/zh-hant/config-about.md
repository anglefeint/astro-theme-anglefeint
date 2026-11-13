---
tags: ['anglefeint', 'config']
title: '設定字典：About'
subtitle: '個人介紹、聯絡方式、工具面板與 Hacker 終端機。'
description: '以實際程式碼查閱 About 的內容、文字、工具與效果設定，標明預設值、限制和目前未使用的舊欄位。'
pubDate: '2026-11-13'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/hacker-01.webp'
---

想先替換自己的介紹，讀[頁面與功能自訂教學](/zh-hant/blog/starter-guide-3-comments-about-and-theme-toggles/)；設定檔案位置與安裝見[第一篇教學](/zh-hant/blog/starter-guide-1-configure-your-site/)。其他模組從[設定字典總入口](/zh-hant/blog/config-reference/)進入。

About 不從某篇 Markdown 文章讀取內文。內容寫在 `src/site.config.ts` 的 `i18n.locales.<locale>.about` 中；頁面和章節標題則在同一語言的 `messages.about` 中。以下列出主題套件預設值，不能把 demo 的個人介紹當成預設值。

<a id="page-enabled"></a>

## theme.enableAboutPage：頁面開關

- **型別 / 預設值：** boolean / true。
- **狀態與作用：** 生效。開啟時為啟用語言生成 `/<locale>/about/`；關閉時不生成標準 About 頁面，相應公共導覽和 Contact 入口也不再提供 About 目標。
- **限制：** 不是隱藏某一段內文的開關，不刪除內容設定。直接瀏覽已關閉頁面不會自動跳轉到首頁。修改後需重新建置部署；關閉也不能作為刪除舊部署檔案或已公開資料的保證。
- **範例：** `theme: { enableAboutPage: false }`。

<a id="about-content"></a>

## About 內容與工具欄位

以下表格的完整前綴均為 **`i18n.locales.<locale>.about.`**。例如 `sections.who` 的完整路徑是 `i18n.locales.zh-hant.about.sections.who`。型別是合併前允許覆寫的欄位型別，均可省略；省略後通過語言回退和主題預設設定補齊。目前 zh / en 的 about 預設內容均來自同一套英文佔位設定，所以下表對兩者使用同一個預設值。其他語言可能有獨立翻譯，不應照搬這些英文預設值推斷。

字串欄位沒有通用長度或 URL 格式驗證；應按用途填寫短文字、有效郵箱或連結。陣列必須填寫 string[]，覆寫時整組替換，不逐項合併。空字串不是通用的「關閉」方式，具體行為見每行。表中範例是該欄位的值，需要放入對應物件層級。

<a id="body-fields"></a>

### 內文

| 欄位                   | 型別     | zh（簡體中文） / en（英文） 預設值                                                                   | 狀態、作用與限制                                             | 範例值                              |
| ---------------------- | -------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | ----------------------------------- |
| `metaLine`             | string   | `"$ profile booted \| mode: builder"`                                                                | 生效；標題上方狀態行，空字串隱藏這一行                       | `"profile ready"`                   |
| `sections.who`         | string   | `"Write a short introduction about yourself, your background, and your primary focus areas."`        | 生效；Who 段落內文，不修改章節標題                           | `"我是一名前端開發者。"`            |
| `sections.what`        | string   | `"Describe what you build, your core skills, and the kinds of projects you want to be known for."`   | 生效；What 段落內文                                          | `"我在構建個人部落格與開源工具。"`  |
| `sections.ethos`       | string[] | 見[陣列預設值](#array-defaults)中的 sections.ethos                                                   | 生效；每個陣列元素是一項原則；空陣列清空條目，不隱藏章節標題 | `["先保證清晰。","持續小步交付。"]` |
| `sections.now`         | string   | `"Share what you are currently building, shipping, or learning."`                                    | 生效；Now 段落內文                                           | `"最近在學習 Astro。"`              |
| `sections.contactLead` | string   | `"Add a short collaboration note (for example: open to freelance, consulting, or full-time roles)."` | 生效；聯絡段落開頭，與後面的引導文字及連結拼接               | `"歡迎交流。"`                      |
| `sections.signature`   | string   | `"> Replace with your own signature."`                                                               | 生效；底部引用塊，同時進入虛擬 about.md                      | `"保持好奇。"`                      |

<a id="contact-fields"></a>

### 聯絡

| 欄位                  | 型別   | zh（簡體中文） / en（英文） 預設值 | 狀態、作用與限制                                                                                 | 範例值                          |
| --------------------- | ------ | ---------------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------- |
| `contact.email`       | string | `"you@example.com"`                | 條件生效；trim 後為空則不呈現郵件連結及 contactEmailLead；連結實際使用原字串，填寫時勿加首尾空格 | `"hello@example.com"`           |
| `contact.githubUrl`   | string | `"https://github.com/yourname"`    | 生效；聯絡連結地址，不受 social.links 控制；空值不會自動隱藏整個連結，建議使用完整 HTTPS 地址    | `"https://github.com/yourname"` |
| `contact.githubLabel` | string | `"GitHub"`                         | 生效；上述連結的可見文字，名稱不限定為 GitHub                                                    | `"我的 GitHub"`                 |

<a id="tool-fields"></a>

### 工具入口

| 欄位                 | 型別   | zh（簡體中文） / en（英文） 預設值 | 狀態、作用與限制                                                                 | 範例值             |
| -------------------- | ------ | ---------------------------------- | -------------------------------------------------------------------------------- | ------------------ |
| `sidebar.dlData`     | string | `"DL Data"`                        | 生效；側欄 DL Data 按鈕及無障礙名稱；改名不改變功能                              | `"資料面板"`       |
| `sidebar.ai`         | string | `"AI"`                             | 生效；側欄 AI 按鈕及無障礙名稱                                                   | `"我的工具棧"`     |
| `sidebar.decryptor`  | string | `"Decryptor"`                      | 生效；側欄解碼器入口；不是工具內部按鈕文字                                       | `"解碼工具"`       |
| `sidebar.help`       | string | `"Help"`                           | 生效；側欄鍵盤面板入口                                                           | `"鍵盤"`           |
| `sidebar.allScripts` | string | `"All Scripts"`                    | 生效；側欄目前語言文章目錄入口                                                   | `"全部文章"`       |
| `scriptsPath`        | string | `"/root/bash/scripts"`             | 生效；文章目錄顯示路徑、虛擬檔案前綴及終端機初始目錄；不是伺服器或本機磁磁碟路徑 | `"/home/me/notes"` |

<a id="label-fields"></a>

### 通用文字

| 欄位                        | 型別   | zh（簡體中文） / en（英文） 預設值 | 狀態、作用與限制                                                                          | 範例值         |
| --------------------------- | ------ | ---------------------------------- | ----------------------------------------------------------------------------------------- | -------------- |
| `labels.modalOutput`        | string | `"Output"`                         | 目前未用於打開後的工具標題；僅提供彈窗 HTML 的初始佔位，打開時被 modals 中對應 title 覆寫 | `"輸出"`       |
| `labels.modalClose`         | string | `"Close"`                          | 生效；工具彈窗和內文視窗關閉控制項的無障礙文字；不會關閉功能本身                          | `"關閉"`       |
| `labels.responseOutput`     | string | `"Output"`                         | 生效；內文面板上方 OUTPUT 標籤                                                            | `"OUTPUT"`     |
| `labels.contactEmailLead`   | string | `"Reach me via"`                   | 條件生效；郵箱非空時顯示在郵件連結前                                                      | `"郵箱："`     |
| `labels.contactConnectLead` | string | `"or connect on"`                  | 生效；始終顯示在聯絡連結前；郵箱為空也不隱藏，注意句子銜接                                | `"也可以訪問"` |
| `labels.backToTop`          | string | `"Back to top"`                    | 條件生效；返回頂部按鈕的提示和無障礙名稱，不改變出現臨界值                                | `"回到頂端"`   |
| `labels.quickAccess`        | string | `"Quick access"`                   | 生效；工具側欄導覽的無障礙名稱                                                            | `"快捷工具"`   |
| `labels.contactEmailLabel`  | string | `"email"`                          | 條件生效；郵件連結的可見文字，不是郵箱地址；郵箱非空才顯示                                | `"發郵件"`     |

<a id="modal-fields"></a>

### 工具彈窗

| 欄位                                      | 型別     | zh（簡體中文） / en（英文） 預設值                  | 狀態、作用與限制                                                            | 範例值                                      |
| ----------------------------------------- | -------- | --------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------- |
| `modals.dlData.title`                     | string   | `"Downloading..."`                                  | 條件生效；資料動畫彈窗標題                                                  | `"資料傳輸"`                                |
| `modals.dlData.subtitle`                  | string   | `"Critical Data"`                                   | 條件生效；資料動畫彈窗內副標題；只顯示動畫，不下載檔案                      | `"演示資料"`                                |
| `modals.ai.title`                         | string   | `"AI"`                                              | 條件生效；AI 文字面板標題                                                   | `"工具與工作流"`                            |
| `modals.ai.lines`                         | string[] | 見[陣列預設值](#array-defaults)中的 modals.ai.lines | 條件生效；按換行拼接的靜態純文字，不呼叫 AI；空陣列產生空 pre，仍可打開面板 | `["~ $ tools --list","Astro / TypeScript"]` |
| `modals.decryptor.title`                  | string   | `"Hacker Decryptor"`                                | 條件生效；目前解碼器彈窗標題，仍在使用                                      | `"本地解碼工具"`                            |
| `modals.decryptor.header`                 | string   | `"Calculating Hashes"`                              | 目前未使用；舊計算器內文文字，目前 DecoderForm 不讀取                       | `"計算中"`                                  |
| `modals.decryptor.keysLabel`              | string   | `"keys tested"`                                     | 目前未使用；不會改變目前解碼器                                              | `"已嘗試密鑰"`                              |
| `modals.decryptor.currentPassphraseLabel` | string   | `"Current passphrase:"`                             | 目前未使用；不會改變目前解碼器                                              | `"當前口令"`                                |
| `modals.decryptor.masterKeyLabel`         | string   | `"Master key"`                                      | 目前未使用；不會改變目前解碼器                                              | `"主密鑰"`                                  |
| `modals.decryptor.transientKeyLabel`      | string   | `"Transient key"`                                   | 目前未使用；不會改變目前解碼器                                              | `"暫存密鑰"`                                |
| `modals.help.title`                       | string   | `"Help"`                                            | 條件生效；鍵盤面板標題                                                      | `"鍵盤面板"`                                |
| `modals.help.statsLabel`                  | string   | `"Stats & Achievements"`                            | 條件生效；鍵盤統計區標題；空字串回退英文內建值                              | `"輸入統計"`                                |
| `modals.help.typedPrefix`                 | string   | `"You typed:"`                                      | 條件生效；輸入計數前綴；空字串回退英文內建值                                | `"已輸入："`                                |
| `modals.help.typedSuffix`                 | string   | `"characters"`                                      | 條件生效；輸入計數後綴；空字串回退英文內建值                                | `"個字元"`                                  |
| `modals.allScripts.title`                 | string   | `"/root/bash/scripts"`                              | 條件生效；文章目錄彈窗標題，獨立于 scriptsPath，不自動聯動                  | `"文章目錄"`                                |

<a id="effect-fields"></a>

### 效果

| 欄位                       | 型別     | zh（簡體中文） / en（英文） 預設值                          | 狀態、作用與限制                                                                         | 範例值                  |
| -------------------------- | -------- | ----------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ----------------------- |
| `effects.backgroundLines`  | string[] | 見[陣列預設值](#array-defaults)中的 effects.backgroundLines | 目前標準 About 頁面不顯示；僅在缺少互動終端機 session 的降級程式碼分支使用，不是背景開關 | `["~ $ hello","ready"]` |
| `effects.scrollToasts.p30` | string   | `"context parsed"`                                          | 條件生效；滾動進度達到 30% 時的提示；空字串回退 context parsed                           | `"讀到這里了"`          |
| `effects.scrollToasts.p60` | string   | `"inference stable"`                                        | 條件生效；滾動進度達到 60% 時的提示；空字串回退 inference stable                         | `"繼續探索"`            |
| `effects.scrollToasts.p90` | string   | `"output finalized"`                                        | 條件生效；滾動進度達到 90% 時的提示；空字串回退 output finalized                         | `"感謝閱讀"`            |

內文字串通過一般文字呈現，不解析 Markdown 或 HTML。段落的換行由樣式保留；寫 **粗體**、連結語法或 HTML 標籤不會得到對應富文字。清空內文不自動刪除章節標題和目錄項；章節順序與 who / what / ethos / now / contact 這五個錨點是固定的。

`scriptsPath` 建議使用以 / 開頭的簡短絕對虛擬目錄，例如 /home/me/notes，避免換行、空字元及與檔案衝突的路徑。終端機路徑會規範化 .、.. 和重複斜線；超過 1024 字元或含非法控制字元的路徑可能使虛擬檔案系統初始化失敗。它既不執行系統 shell，也不讀取伺服器任意目錄。檔案來自主題生成的目前語言文章和 `about.md`；All Scripts 不是一個可以自訂腳本執行列表的設定。

DL Data 只是進度動畫，不代表真實下載。AI 面板中的 model、latency 等預設文字也是靜態顯示，不是實時模型狀態；請替換為真實的個人資訊，或明確說明為示範。

Help 的三段統計文字由腳本拼入面板 HTML，建議只填可信的短純文字，不把外部輸入拼入設定；這三個欄位的空字串會回退到英文，而不是清空標籤。其他 About 內文和 AI 行文字的呈現方式不同，不能一概認為所有設定都支援 HTML。

滾動提示按整個文檔的滾動進度計算；用戶開始滾動後，每個臨界值在一次初始化中最多觸發一次。它不是已讀字數統計，也不是 AI 處理進度；沒有公開的臨界值或時長設定。填空字串不會關閉提示。

<a id="array-defaults"></a>

### 三個陣列的預設值

以下是 zh / en 實際使用的完整預設陣列，順序和空行均有含義；範例中替換陣列會替換全部元素。

**sections.ethos**

```json
[
  "Prioritize clarity before complexity.",
  "Favor maintainable systems over one-off solutions.",
  "Ship in small iterations and learn from feedback.",
  "Communicate directly and document decisions."
]
```

**modals.ai.lines**

```json
[
  "~ $ ai --status --verbose",
  "",
  "model: anglefeint-core",
  "mode: reasoning + builder",
  "context window: 128k",
  "tools: codex / cursor / claude-code",
  "latency: 120-220ms",
  "safety: guardrails enabled",
  "",
  ">> system online",
  ">> ready for execution"
]
```

**effects.backgroundLines**

```json
[
  "~ $ ls -la",
  "total 42",
  "drwxr-xr-x  12 user  staff   384  Jan 12  about  blog  projects",
  "drwxr-xr-x   8 user  staff   256  Jan 11  .config  .ssh  keys",
  "-rw-r--r--   1 user  staff  2048  Jan 10  README.md  .env.gpg",
  "-rwxr-xr-x   1 user  staff   512  Jan  9  deploy.sh  script",
  "~ $ cat .motd",
  ">> welcome | access granted"
]
```

<a id="about-messages"></a>

## 頁面標題及共用控制項文字

這些欄位寫在 `i18n.locales.<locale>.messages` 下，不在 about 內容物件內。均為 string，可省略，預設使用內建目前語言文字及回退鏈；下表只列中文 / 英文預設值。例值按對應欄位填寫；改文字不會切換功能，也不會更改章節 ID。

### messages.about

| 欄位                | 簡體中文 / 英文預設值                                                                                   | 作用與限制                                                                                   | 範例值                     |
| ------------------- | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | -------------------------- |
| `about.title`       | About — Hacker Ethos / About — Hacker Ethos                                                             | 條件生效：頁面標題、內文 h1、內文視窗標題和虛擬 about.md 標題                                | `"關于我"`                 |
| `about.description` | 我是谁、我在做什么，以及背后的黑客精神。 / Who I am, what I build, and the hacker ethos behind my work. | 條件生效：頁面中繼描述；不在內文標題下自動新增一段介紹                                       | `"我的經歷、工作與興趣。"` |
| `about.who`         | 我是谁 / Who I Am                                                                                       | 條件生效：Who 章節標題和目錄項；不改內文或錨點                                               | `"我是誰"`                 |
| `about.what`        | 我在构建什么 / What I Build                                                                             | 條件生效：What 章節標題和目錄項                                                              | `"我在做什么"`             |
| `about.ethos`       | 黑客精神 / Hacker Ethos                                                                                 | 條件生效：Ethos 章節標題和目錄項                                                             | `"我的原則"`               |
| `about.now`         | 现在 / Now                                                                                              | 條件生效：Now 章節標題和目錄項                                                               | `"最近在忙"`               |
| `about.contact`     | 联系 / Contact                                                                                          | 條件生效：Contact 章節標題和目錄項；錨點仍是 contact                                         | `"聯系我"`                 |
| `about.regenerate`  | 重播扫描 / Replay scan                                                                                  | 條件生效：底部重新掃描按鈕的文字、提示和無障礙名稱；只觸發視覺掃描，不請求 AI 或重新生成內文 | `"重新掃描"`               |

### messages.windowControls

| 欄位                        | 簡體中文 / 英文預設值       | 作用與限制                                               | 範例值     |
| --------------------------- | --------------------------- | -------------------------------------------------------- | ---------- |
| `windowControls.collapse`   | 折叠内容 / Collapse content | 條件生效：內文視窗最小化、工具彈窗折疊的文字             | `"最小化"` |
| `windowControls.expand`     | 放大窗口 / Expand window    | 條件生效：工具彈窗放大文字；內文視窗全屏使用 fullscreen  | `"放大"`   |
| `windowControls.restore`    | 还原窗口 / Restore window   | 條件生效：視窗還原及還原入口文字                         | `"還原"`   |
| `windowControls.fullscreen` | 全屏阅读 / Full screen      | 條件生效：內文視窗請求瀏覽器全屏的文字；不修改瀏覽器權限 | `"全屏"`   |

### messages.scriptFolders

| 欄位                      | 簡體中文 / 英文預設值                                                                                        | 作用與限制                                                                 | 範例值                   |
| ------------------------- | ------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- | ------------------------ |
| `scriptFolders.copyTitle` | 复制文章标题 / Copy article title                                                                            | 條件生效：All Scripts 複製文章標題按鈕的提示及無障礙名稱；不是複製文章全文 | `"復制標題"`             |
| `scriptFolders.copied`    | 标题已复制。 / Title copied.                                                                                 | 條件生效：複製成功狀態                                                     | `"標題已復制"`           |
| `scriptFolders.failed`    | 无法自动复制，已选中完整标题，请手动复制。 / Copy unavailable. The full title is selected; copy it manually. | 條件生效：複製失敗狀態；空字串在腳本中可能回退英文提示                     | `"復制失敗，請手動復制"` |

<a id="example"></a>

## 一個可合併的設定範例

合併到 `src/site.config.ts` 現有的 `defineThemeConfig({...})` 中，保留 import、export 和其他個人設定。不要在同一物件重複建立 theme 或 i18n。

```ts
theme: { enableAboutPage: true },
i18n: {
  locales: {
    'zh-hant': {
      about: {
        metaLine: '$ profile ready',
        sections: {
          who: '我是一名前端開發者。',
          what: '我在構建個人部落格與開源工具。',
          ethos: ['先保證清晰。', '持續小步交付。'],
          now: '最近在學習 Astro。',
          contactLead: '歡迎交流。',
          signature: '保持好奇。',
        },
        contact: {
          email: 'hello@example.com',
          githubUrl: 'https://github.com/yourname',
          githubLabel: 'GitHub',
        },
        scriptsPath: '/home/me/notes',
        modals: {
          allScripts: { title: '文章目錄' },
          ai: { lines: ['~ $ tools --list', 'Astro / TypeScript'] },
        },
      },
      messages: {
        about: { title: '關于我', description: '我的經歷、工作與興趣。' },
      },
    },
  },
},
```

設定以語言回退鏈從低優先級到高優先級遞歸合併，目前語言覆寫回退語言，最終有基礎 About 設定補齊。陣列整體替換，undefined 不覆寫已有值。只寫 zh-hant 不等於更改所有語言；啟用語言與回退鏈見[多語言教學](/zh-hant/blog/starter-guide-languages/)。

<a id="boundaries"></a>

## 關聯設定與未提供的設定

- **導覽與目錄：** `i18n.locales.<locale>.messages.nav.about` 控制公共 About 入口及關閉視窗後的重新打開入口，string，預設中文“关于” / 英文“About”；例值「關於我」。`messages.blog.toc` 控制 About 目錄的標題與無障礙名稱，string，預設中文“文章目录” / 英文“On this page”；例值「本頁目錄」，也影響文章目錄，見[文章文字字典](/zh-hant/blog/config-article/#article-messages)。
- **完整解碼頁面：** `theme.enableDecoderPage` 是 boolean，預設 true；如 `theme: { enableDecoderPage: false }` 會關閉獨立 Decoder 頁面及彈窗的完整工具跳轉入口，不會關閉 About 內嵌解碼器。內部工具欄位使用 `messages.decoder` 和 `messages.decoderPage`，具體欄位見[Decoder 字典](/zh-hant/blog/config-decoder/)，不使用上面五個舊 decryptor 內文欄位。
- **終端機：** `messages.terminal` 是共用終端機互動文字，不屬於 `about.effects.backgroundLines`。終端機是有界的網頁虛擬檔案系統；設定不能授權執行本機程序。十六項欄位、佔位符和未使用狀態見[終端機字典](/zh-hant/blog/config-terminal/)。
- **視窗和動畫：** 沒有公開的 About 專屬面板尺寸、預設關閉狀態、內文淡入、工具隱藏、目錄排序、Oracle 改名或獨立關停設定。視窗狀態由執行時及本機存儲管理；無 JavaScript 時內文仍可閱讀，工具不保證可用。內文預設直接可見，不相依滾動觀察器才顯示。系統減少動態效果偏好由執行時處理，不是本文新增開關。
- **聯絡方式：** About 的 contact 物件與 `social.links` 獨立。改頁尾社交連結不會自動改 About 聯絡段落。

上表五個舊 decryptor 內文欄位仍被型別接受，但目前不消費；`backgroundLines` 僅有降級分支，`modalOutput` 是初始佔位，均已明確標記。不要通過修改這些欄位來設定目前工具，更不需要為了匹配舊文字去改變頁面實作。
