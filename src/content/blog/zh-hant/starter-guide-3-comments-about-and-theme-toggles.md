---
tags:
  - anglefeint
  - starter
title: 使用指南 3：選用功能
subtitle: 音樂、留言、關於頁、分頁與視覺設定。
description: 音樂、留言、關於頁、分頁與視覺設定。
pubDate: '2026-03-07'
updatedDate: '2026-11-12'
heroImage: ../../../assets/blog/default-covers/matrix-02.webp
---

## 支援 AI 閱讀的內容

建置會將公開文章、已啟用的 Fragments 和 About 頁面納入 `/llms.txt`、語言索引與全文合集。文章 Markdown 網址維持不變；各語言另有 `/zh-hant/fragments/index.md` 和 `/zh-hant/about/index.md`（依實際語言替換）。Fragments 檔案合併所有公開分頁，保留每則 ID、發布時間、正文及穩定的 `/<locale>/fragments/#ID` 連結。HTML 頁面提供對應 Markdown 的探索連結。檔案在 `npm run build` 後及 preview 中可用，部署整個 `dist/` 即可。

About 匯出公開簡介、聯絡連結及可開啟的 AI 文字彈窗，排除終端設定、工具與裝飾介面；不匯出留言。停用的頁面／語言、已刪除內容、noindex 頁面與站外 canonical 頁面不匯出；重新建置會清除過期產物與探索連結，保護使用者自有檔案，遇到衝突時停止建置。網站／語言補充說明適用所有匯出文件。JSON-LD 包含頁面語言，About 使用 AboutPage。不需新增設定、伺服器或 UI 依賴，也不保證 AI 收錄或引用。

## 音樂

把音檔放在 public/music/，並合併：

```ts
theme: {
  music: { enabled: true, tracks: [{ title: 'My Song', src: '/music/my-song.mp3' }] },
},
```

每首曲目包含 title、src 與選填 artist，空清單會隱藏播放器。首次播放需點擊。分頁工作階段會記住曲目、進度與音量，但恢復播放取決於瀏覽器政策，跨頁可能有短暫中斷。最後一首結束後回到第一首。

播放器先下載完整音檔再播放，大檔案會增加等待與記憶體使用。外部音檔需要 CORS；本機檔案沒有這項要求。enabled: false 可停用播放器。

## Giscus 留言

[留言設定教學](/zh-hant/blog/starter-guide-4-giscus-comments/)

## 關於頁

About 正文段落與簽名保留設定字串中的換行：`\n` 換行，`\n\n` 留一空行，長句仍自動換行。內容仍是純文字，不解析 Markdown 或 HTML，請勿插入 `<br>`。

編輯 i18n.locales['zh-hant'].about：sections（who、what、ethos、now、contactLead、signature）、contact（email、githubUrl、githubLabel）、sidebar、labels、modals、effects。ethos 是陣列，其他語言需分別編輯。頁面工具只是視覺示範，不是真實 AI 服務。email 空白可隱藏連結；theme.enableAboutPage: false 會移除頁面與導覽入口。

### Decoder Lab：致敬密碼龐克

Decoder Lab 的視覺風格致敬 **Cypherpunk（密碼龐克）**，紀念他們為人類自由、隱私與開放程式碼作出的貢獻。點對點網路意象與本機處理方式，呼應了讓工具與資料掌握在個人手中的理念。

我們認同這樣的信念：**隱私和自由不能只靠掌權者的善意。** 個人應當有能力保護自己的通訊，自主決定向誰透露什麼，並在可能時親自驗證，而不必把信任全部交給政府、平台或其他第三方。

**「Cypherpunks write code.」——密碼龐克寫程式。** [《密碼龐克宣言》](https://www.activism.net/cypherpunk/manifesto.html)中的這句話，也代表了一種行動方式：把理念變成可用的軟體，公開程式碼，讓其他人能夠檢查、使用和繼續建設。我們向這種用技術守護個人自主權的精神致敬。

Decoder Lab 以本機處理、可檢視的原始碼和點對點網路意象回應這份精神。

完整的 **Decoder Lab** 位於 `/<locale>/decoder/`，支援本機文字處理鏈路、EVM／HyperEVM／TRON 的 ERC-20／TRC-20 呼叫解讀及 EVM／TRON／Bitcoin 地址檢查。從 About 解碼視窗開啟；在 `src/site.config.ts` 設定 `theme.enableDecoderPage: false` 可獨立關閉頁面與入口。無需 RPC、錢包連線或 API Key。

## 數量與功能開關

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

## 更多語言與首頁網址

在 i18n.locales 新增代碼，提供 meta（label、hreflang、ogLocale、enabled、fallback）、site.hero、messages、about，再用 --locales 建立文章。fallback 補足缺少的設定文字，不會翻譯文章或混合列表語言；必要時會加入預設語言。label 只改選單名稱。

defaultLocalePrefix: 'always' 讓 / 導向語言首頁；'never' 對預設語言反向處理。文章仍保留語言路徑。

## 頁尾與驗證

footer.showCredits: false 隱藏主題與 Astro 連結，保留建置年份及 site.title。site.tagline 是獨立文字。舊值 Built with Astro. 會視為內建署名，避免重複顯示。

首頁開關：`theme.home.showInitialize` 控制 Initialize/done，`showFollow` 控制 Wake Up/Follow，`showTrace` 控制右下角狀態。於 `src/site.config.ts` 設定，預設皆為 `true`，設為 `false` 可獨立隱藏。

可選的 `theme.footer.links` 在頁尾增加一行，每項填寫 `label` 與 `href`，連結以中間點分隔；省略或空陣列隱藏該行。標籤在各語言中保留設定原文，獨立於社群圖示與 `showCredits`。

```ts
theme: {
  home: { showInitialize: true, showFollow: true, showTrace: true },
  footer: {
    links: [{ label: "Source", href: "https://github.com/your-name/your-repo" }],
  },
},
```

自動分享圖使用主題內附的代碼雨、終端與霓虹網路背景，網站名稱、標題和作者仍使用你的內容。右下角的小字 `Theme by Anglefeint` 沿用 `theme.footer.showCredits`（預設 `true`）；設為 `false` 會同時隱藏頁尾與圖片署名，修改後請重新建置部署。自訂 `ogImage` 不會被修改。背景離線使用，不增加瀏覽器 JavaScript。

所有設定合併在同一個 theme 或 i18n，陣列會整份取代。開發時檢查，執行 npm run doctor，再以 npm run preview 測試搜尋。重新建置與部署才會套用到線上。

- [使用指南 1：設定你的部落格](/zh-hant/blog/starter-guide-1-configure-your-site/)
- [使用指南 2：撰寫與整理內容](/zh-hant/blog/starter-guide-2-languages-and-routing/)
- [使用指南 3：選用功能](/zh-hant/blog/starter-guide-3-comments-about-and-theme-toggles/)

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

$C_{saved}$

$$
\frac{a}{b} = x_1 + x_2 + x_3 + x_4 + x_5 + x_6 + x_7 + x_8 + x_9 + x_{10}
$$

---

## 升級主題

集成版 starter 的標準頁面、設定預設值、翻譯與建置功能由主題套件維護。文章、`src/site.config.ts`、音樂、圖片與自訂頁面留在使用者專案。

使用 npm 的集成版專案在根目錄執行下列指令。工具檢查專案、Node 與 Astro 相容性、備份依賴檔案、安裝確切主題版本並執行 doctor；失敗時還原依賴檔案並嘗試重裝原依賴。完成後依原流程部署，不會自動發布網站。

```bash
npx @anglefeint/astro-theme@latest upgrade
```

0.27 以前的專案需一次重新安裝遷移：在新目錄建立範本，複製文章與資源，將個人設定合併至新的 site config。不要複製舊標準路由、adapter 或 defaults/schema/runtime 輔助檔。保留 slug、語言路徑、音樂與圖片 URL、網域及部署設定。

自動升級目前僅支援 npm，遇到 pnpm/yarn/bun 鎖檔會停止。`--check` 僅檢查，`--to 0.27.1` 指定版本。請參閱[升級指南](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md)與 [GitHub Releases](https://github.com/anglefeint/astro-theme-anglefeint/releases)。

升級失敗時不要部署 `dist/`：相依套件回復不會還原舊建置產物。修正錯誤並成功執行 `npm run doctor` 後再部署。pnpm 使用者先確認版本相容，再以 `pnpm add @anglefeint/astro-theme@latest` 和 `pnpm run doctor` 手動更新，保留自己的鎖定檔。
