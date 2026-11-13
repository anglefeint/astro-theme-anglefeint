---
tags: ['anglefeint', 'starter']
title: '使用指南 5：把頁面和功能調整成自己喜歡的樣子'
subtitle: '按想修改的頁面查找：首頁、About、Decoder、社交連結、頁尾、音樂和分頁。'
description: '通過小範圍設定調整頁面內容和功能，說明實際預設值、生效範圍、合併方式與本機驗證步驟。'
pubDate: '2026-03-07'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

本篇是入門教學的第 5 / 8 篇。[檢視完整教學順序](/zh-hant/blog/starter-guide-1-configure-your-site/#tutorial-order) · [依欄位查設定字典](/zh-hant/blog/config-reference/)。

部落格已經能執行後，可以從自己想改的地方開始。你不需要先填寫所有設定，也不需要把下面的範例全部複製進去。

所有 TypeScript 片段都合併到 `src/site.config.ts` 現有的 `defineThemeConfig({...})` 物件裡。一個物件中只保留一個 `theme`、一個 `i18n`、一個 `social`；同名欄位直接修改，保留其他個人設定。物件與預設值合併，陣列則整體替換，因此增添連結、歌曲或條目時要保留希望繼續顯示的內容。

這篇按操作目標提供常用設定，不是完整欄位字典。先找到頁面上想修改的區域，再選擇對應一節即可。

## 1. 調整首頁提示和效果

網站名稱、首頁大標題和介紹的區別，見[安裝部落格，換成自己的資訊](/zh-hant/blog/starter-guide-1-configure-your-site/)。這裡調整首頁的提示段和互動：

```ts
theme: {
  home: {
    showInitialize: true,
    showFollow: true,
    showTrace: true,
  },
  effects: { enableHomePassage: false },
},
```

| 欄位                              | 預設值  | 改變什麼                                                                              |
| --------------------------------- | ------- | ------------------------------------------------------------------------------------- |
| `theme.home.showInitialize`       | `true`  | 顯示 Initialize／done 啟動文欄位；設為 false 隱藏該段                                 |
| `theme.home.showFollow`           | `true`  | 顯示 Wake Up／Follow 提示段；設為 false 獨立隱藏                                      |
| `theme.home.showTrace`            | `true`  | 顯示首頁底部的 PIRATE SIGNAL／TRACE 狀態區；設為 false 隱藏該區                       |
| `theme.effects.enableHomePassage` | `false` | 開啟後，首頁文章標題連結可觸發約 8 秒的 Matrix 穿越後導覽；減少動態效果時保持直接導覽 |

這些欄位沒有提供關閉整頁程式碼雨或切換全站配色的能力。`showTrace` 也不是右下角寬屏終端機的開關。

### 修改寬屏終端機文字

寬屏終端機預設顯示 `Knock, knock.`。可以先設定英文設定，供沒有單獨覆寫的語言共用：

```ts
i18n: {
  locales: {
    en: { messages: { home: { transmission: '记录想法，也留下一点线索。' } } },
  },
},
```

需要某種語言獨立文字時，在該語言的 `messages.home.transmission` 設定。這一項的取值順序為目前語言設定 → 英文設定 → `Knock, knock.`，不走一般介面文字的完整回退鏈。終端機在寬屏布局中出現，手機上看不到不代表設定失敗；點選鑰匙孔按鈕才打開走廊預覽。

About 的 Oracle 入口獨立使用場景預覽，不受首頁文章穿越開關控制。上述終端機文字和底部狀態用於頁面氛圍，不代表真實機器、網路或安全狀態。

這些開關和寬屏終端機文字的完整定義見[首頁字典](/zh-hant/blog/config-home/#startup-switches)。

## 2. 把 About 換成自己的介紹

打開 `/zh/about/` 可以看到目前內容。內文和聯絡方式按語言設定，無需修改主題頁面模板：

```ts
i18n: {
  locales: {
    zh: {
      about: {
        metaLine: '$ profile | building and learning',
        sections: {
          who: '我是小林，喜欢开发与写作。',
          what: '这里记录我的项目和学习笔记。',
          ethos: ['保持好奇。', '把想法变成可以使用的东西。'],
          now: '最近在整理个人博客。',
          contactLead: '欢迎联系我。',
          signature: '> 谢谢你来这里。',
        },
        contact: {
          email: 'you@example.com',
          githubUrl: 'https://github.com/yourname',
          githubLabel: 'GitHub',
        },
      },
    },
  },
},
```

替換範例姓名和地址。`metaLine` 是個人面板頂部狀態文字；`who`、`what`、`ethos`、`now` 分別填寫自我介紹、所做的事、理念和近況；`contactLead` 是聯絡引導，`signature` 是簽名。`ethos` 是字串陣列，提供新陣列會整體替換原條目。

內文段落和簽名是純文字：字串中的 `\n` 換行，`\n\n` 留空行；不解析 Markdown 或 HTML，不要用 `<br>` 換行。這個範例只修改簡體中文；其他語言需要自己的文字，不會自動翻譯。缺少欄位會根據該語言的設定回退規則補齊。

About 的視窗控制項可以關閉、最小化或全屏面板，並在瀏覽器本機記錄狀態。頁面工具中的 AI 輸出和下載進度是主題互動顯示，不會因為填寫了文字就連線真實 AI 服務；解碼工具處理的是瀏覽器本機輸入。

不需要 About 時，在 `theme` 中設定 `enableAboutPage: false`；預設是 `true`。關閉後不生成 About 路由，公共導覽及相關 About 聯絡入口也隨之隱藏。自己寫在內文或頁尾中的連結不會被自動刪除，應一並檢查。

更多內容欄位見[About 字典](/zh-hant/blog/config-about/#about-content)；指令提示和唯讀閱讀器文字見[終端機字典](/zh-hant/blog/config-terminal/#messages)。

## 3. 調整 Decoder 頁面和閱讀卡片

Decoder Lab 位於 `/zh/decoder/`，預設開啟。它的視覺致敬密碼朋克與數位自由的先行者；本機處理和點對點網路意象呼應個人掌握工具與資料的理念。

工具提供文字解碼、支援的代幣呼叫解釋和地址格式檢查，不需要 RPC、錢包連線或 API Key。它不查詢余額、執行交易或證明地址歸屬；輸入 calldata 也不等於驗證了合約真實行為。

在 `theme` 中設定 `enableDecoderPage: false` 可以獨立關閉 Decoder 頁面和主題提供的相關入口；關閉 About 不等於關閉 Decoder，反過來也一樣。自訂連結仍需自己維護。

閱讀區的致敬文字和卡片按語言設定，例如替換中文列表：

```ts
i18n: {
  locales: {
    zh: {
      messages: {
        decoderPage: {
          readings: {
            tribute: '思想与代码，让隐私和自由更进一步。',
            links: [
              { title: '我的阅读资料', href: 'https://example.com/', author: '作者名', year: '2026' },
            ],
          },
        },
      },
    },
  },
},
```

`tribute: ''` 隱藏致敬文字，`links: []` 隱藏卡片，省略則保留預設內容。每項填寫 `title`、`href`，`author`、`year`、`cover` 選用。`cover` 可用內建名稱（例如 `privacy-code`、`bitcoin`），或 public 圖片路徑／HTTPS 圖片地址；省略則是無圖卡片。

`links` 替換整份列表，不是追加一條；想保留舊條目時把它們一起寫入。這裡是你提供的資料入口，不會抓取或轉載目標文章，也不會自動驗證外部資源。

閱讀條目的逐欄位型別、內建封面與預設列表見[Decoder 字典](/zh-hant/blog/config-decoder/#readings)。

## 4. 調整社交入口和頁尾

基礎社交帳號填寫在 `social.links`，頂部與頁尾共用陣列順序。想加自訂圖標，可以先放入 `public/icons/community.svg`：

```ts
social: {
  links: [
    { href: 'https://github.com/yourname', label: 'GitHub', icon: 'github' },
    { href: 'https://example.com/community', label: '我的社区', iconSrc: '/icons/community.svg' },
  ],
},
```

`iconSrc` 支援 public 內的本機 SVG、PNG、WebP，路徑以 `/` 開始，不填寫遠程 URL、查詢參數、片段或編碼字元。它優先于 `icon`，保留原圖顏色；兩項都省略則顯示文字。`label` 提供無障礙名稱。檔案缺少或填寫不支援的內建圖標名會報設定錯誤。

選用 `rel` 用於身分等連結關系。例如自己的 Mastodon 帳號可以設定 `rel: 'me'`；主題始終保留 `noopener noreferrer`，不會按平臺自動加 `me`。身分驗證由對應平臺處理，網站必須先部署，並在對方資料中填寫包含返回連結的實際頁面地址，主題不保證驗證結果。

手機寬度下頂部社交入口隱藏，頁尾仍顯示。`links: []` 保留三個不可點選的佔位圖標，並不是隱藏整個社交區域。

### 頁尾署名、說明和額外連結

```ts
site: { tagline: '保持好奇，持续记录。' },
theme: {
  footer: {
    showCredits: true,
    links: [{ label: '项目源码', href: 'https://github.com/yourname/your-project' }],
  },
},
```

- `site.tagline` 是自訂純文字，空字串隱藏；不會自動翻譯。舊預設文字 `Built with Astro.` 會視為內建署名，避免重複顯示。
- `theme.footer.showCredits` 預設 `true`，控制主題和 Astro 兩項署名；關閉後仍保留版權行、自訂說明和額外連結。它也控制自動生成的文章分享圖片中的主題署名，不修改自訂圖片。
- `theme.footer.links` 預設空陣列，在版權和署名之間顯示連結，與社交圖標獨立；標籤保留你填寫的文字，不自動翻譯，也不受 showCredits 控制。

版權名稱使用全站名稱，年份在建置時生成。修改文字、署名或年份相關結果後，需要重新建置部署。

圖標路徑、連結欄位和署名規則見[公共介面的社交欄位](/zh-hant/blog/config-site-chrome/#social-fields)與[頁尾欄位](/zh-hant/blog/config-site-chrome/#footer)。

## 5. 開啟音樂播放器

先將自己的音頻放入 `public/music/my-song.mp3`，再合併：

```ts
theme: {
  music: {
    enabled: true,
    tracks: [{ title: '我的一首歌', artist: '作者', src: '/music/my-song.mp3' }],
  },
},
```

音樂預設關閉，主題不附帶歌曲。每首需要 `title`、`src`，`artist` 可省略；空歌單不會顯示播放器。增加歌曲時保留原陣列中的條目。音頻網址不含 `public`，不能使用本機磁磁碟路徑或平臺分享頁面；支援 HTTPS 音頻直鏈，地址不使用空格或反斜線。標題為空或地址格式錯誤會報設定錯誤，但填寫格式正確不保證檔案實際可瀏覽。

播放器出現在使用主題公共布局的頁面，沒有逐頁顯示開關；每個新頁面初始收起。首次瀏覽點選 PLAY 才載入音頻，目前曲目結束後播放下一首，最後一首結束後回到第一首。手機展開播放器時會臨時隱藏回到頂部按鈕。

同一標籤頁會話會記住曲目、進度和音量；此前正在播放時，切頁或刷新會嘗試續播，手動暫停後保持暫停。它不是無縫播放，瀏覽器也可能阻止自動播放；存儲不可用時仍可手動播放，但不保留會話續播。

目前實作會完整下載歌曲，轉成 Blob 後播放，進度跳轉不相依伺服器 Range 支援。大檔案會增加等待和內存佔用；外鏈伺服器必須允許 CORS，同網站 public 檔案無需跨域設定。先確認音頻地址能瀏覽；不需要音樂時設定 `theme.music.enabled: false`。

曲目欄位、狀態文字與續播邊界見[音樂播放器字典](/zh-hant/blog/config-music/#track-fields)。

## 6. 調整列表數量和分頁

```ts
theme: {
  homeLatestCount: 3,
  blogPageSize: 10,
  pagination: {
    windowSize: 7,
    showJumpThreshold: 12,
    jump: { enabled: true, enterToGo: true },
    style: { enabled: true, mode: 'fixed', variants: 9, fixedVariant: 1 },
  },
},
```

`homeLatestCount` 預設 3，控制首頁最新文章數；`blogPageSize` 預設 10，控制部落格及標籤列表每頁文章數。使用合理的正整數。它們不控制首頁最多三條的碎片預覽，碎片列表每頁數量另由 `theme.fragments.pageSize` 設定。

`windowSize` 預設 7，控制頁碼顯示視窗，呈現時限制在 5–21，不是每頁文章數。跳頁入口需要 `jump.enabled` 為 true 且總頁數大於 `showJumpThreshold`；預設超過 12 頁出現，`enterToGo` 決定是否允許Enter跳頁。

樣式預設是 `random`；範例選擇 `fixed` 來固定變體。`sequential` 按頁面順序選變體；`random` 的客戶端初始化會重新隨機選擇樣式，結果可能重複。關閉 JavaScript 時仍有建置出的靜態分頁樣式。`variants` 控制參與選擇的變體數量，呈現時限制在 1–12；`fixedVariant` 限制在目前變體範圍內。

`style.enabled: false` 使用基礎樣式，不會關閉分頁。Blog、標籤和 Fragments 共用這些分頁設定，修改時應留意三處的效果。

分頁欄位的完整範圍、變體和介面文字見[Blog List 與標籤列表字典](/zh-hant/blog/config-blog-list/#pagination-window)。

## 7. 只關閉自己不需要的功能

以下是各開關的影響範圍；不要為了設定一個功能，就把整張表全部關閉。

| 設定路徑                       | 預設值 | 設為 false 後                                       |
| ------------------------------ | ------ | --------------------------------------------------- |
| `theme.enableAboutPage`        | `true` | 不生成 About 頁面並隱藏主題相關入口                 |
| `theme.enableDecoderPage`      | `true` | 不生成 Decoder 頁面並隱藏主題相關入口               |
| `theme.effects.enableRedQueen` | `true` | 隱藏文章頁 Red Queen 監視器，不關閉整個 AI 頁面效果 |
| `theme.search.enabled`         | `true` | 關閉站內文章搜尋入口及索引生成                      |
| `theme.toc.enabled`            | `true` | 關閉預設文章目錄，單篇 `toc: true` 仍可覆寫         |
| `theme.tags.enabled`           | `true` | 關閉標籤入口及標籤頁面生成，不刪除文章              |
| `theme.math.enabled`           | `true` | 關閉 Markdown／MDX 數學處理                         |
| `theme.socialImage.enabled`    | `true` | 停止自動生成文章分享圖片，手動 ogImage 仍有效       |

例如只關閉文章監視器，合併 `theme: { effects: { enableRedQueen: false } }` 即可。它不會改變搜尋、音樂或 About 設定。

評論和碎片預設關閉，不需要為了使用其他功能把它們開啟；需要時分別閱讀[設定 Giscus 評論](/zh-hant/blog/starter-guide-4-giscus-comments/)和[發佈一條碎片](/zh-hant/blog/starter-guide-5-fragments/)。文章目錄、公式和分享圖片細節見[寫第一篇文章](/zh-hant/blog/starter-guide-2-languages-and-routing/)與[圖片教學](/zh-hant/blog/starter-guide-images/)。

## 8. 需要作品頁時建立自訂頁面

要單獨顯示專案，可以在根目錄執行：

```bash
npm run new-page -- projects
```

指令建立 `src/pages/[lang]/projects.astro`，預設使用 `base` 布局，通過目前啟用語言生成 `/<语言代码>/projects/`，例如 `/en/projects/` 或 `/zh/projects/`。編輯這個 Astro 檔案填寫內文；它不會自動翻譯內容，也不會自動增加頂部導覽欄目。可以在內文或頁尾 links 中提供入口。

需要指定風格時再使用 `--theme`，例如 `npm run new-page -- portfolio --theme cyber` 建立另一個 Cyberpunk 頁面。選用值是 `base`、`ai`、`cyber`、`hacker`、`matrix`，控制這個新頁面使用的布局，不會切換全站的四種氛圍。slug 使用小寫英文字母、數字和連字號，可用 `projects/labs` 這樣的嵌套路徑。不要與包提供的標準頁面路徑衝突；同名檔案已經存在時會報錯，不要把同一路徑的五種主題指令連續執行。

## 9. 保存後如何確認生效

先在 dev 中打開剛修改的頁面：檢查內容和連結、功能入口是否按預期出現。環境變數有舊覆寫值時按[第一篇的排查步驟](/zh-hant/blog/starter-guide-1-configure-your-site/)處理。缺少自訂圖標、音頻請求失敗或外鏈異常，應分別檢查路徑和網路，不要靠重複覆寫整份設定排錯。

發佈前停止 dev，執行：

```bash
npm run doctor
npm run preview
```

doctor 已包含本機準備、檢查和建置；成功後不必立即再執行 check 或 build。搜尋需要在建置後的 preview 中驗證；preview 本身不發佈網站。正式網站仍需重新部署整個 `dist/`，本機保存設定不會立即改變線上頁面。

## 教學導覽與設定查閱

[上一篇：發佈一條碎片](/zh-hant/blog/starter-guide-5-fragments/) · [下一篇：讓讀者留下評論](/zh-hant/blog/starter-guide-4-giscus-comments/) · [八篇教學總入口](/zh-hant/blog/starter-guide-1-configure-your-site/#tutorial-order)。

本篇相關欄位：[首頁](/zh-hant/blog/config-home/)、[About](/zh-hant/blog/config-about/)、[終端機](/zh-hant/blog/config-terminal/)、[Decoder](/zh-hant/blog/config-decoder/)、[公共導覽、社交和頁尾](/zh-hant/blog/config-site-chrome/)、[音樂播放器](/zh-hant/blog/config-music/)、[列表和分頁](/zh-hant/blog/config-blog-list/)。完整路徑、預設值和限制見[設定字典總入口](/zh-hant/blog/config-reference/)。
