---
tags:
  - anglefeint
  - starter
title: 使用指南 1：設定你的部落格
subtitle: 安裝、網站資料、語言與部署。
description: 安裝、網站資料、語言與部署。
pubDate: '2026-03-07'
updatedDate: '2026-11-10'
heroImage: ../../../assets/blog/default-covers/cyber-02.webp
---

## 安裝並在本機開啟

使用 Node.js 22.12.0 或更新版本。在父目錄執行以下指令，建立 my-blog 並略過相依套件安裝，再安裝並啟動；若換名字，同時修改建立指令與 cd。

```bash
npm create astro@latest -- my-blog --template anglefeint/astro-theme-anglefeint#starter --no-install --no-ai
cd my-blog
npm install
npm run dev
```

開啟終端顯示的網址。使用 pnpm 時保持同一建立指令，再用 pnpm install 與 pnpm dev 取代 npm 的安裝與啟動指令。

## 網站資料與首頁網址

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

在 0.27+ 整合版 starter 中，主題套件讀取專案根目錄 `.env` 或託管建置環境的 `PUBLIC_SITE_URL`，優先於 `site.url`，統一用於 canonical、RSS、sitemap 與分享圖網址。變更後重啟開發伺服器或重新建置。保留 starter 的 `astro.config.mjs` 整合入口，無需維護本機網址解析腳本或複製轉接器。0.27 以前的舊骨架需依升級指南完成一次遷移。

defaultLocalePrefix: 'never' 讓預設語言首頁直接顯示於 /。預設的 'always' 會導向 `/<語言>/`，可能短暫顯示 “Redirecting to home…”。即使使用 'never'，文章仍位於 /zh-hant/blog/。

`social.links` 使用 `href`、`label` 與 `icon`：`github`, `twitter`, `mastodon`, `youtube`, `bluesky`, `linkedin`, `discord`, `telegram`, `instagram`, `facebook`, `whatsapp`, `line`。自訂本機 SVG/PNG/WebP 可放入 `public/icons/`，設定 `iconSrc: "/icons/community.svg"`，優先於 `icon` 並保留原色；兩項都省略則顯示文字。路徑限制與範例見 [README](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/README.zh-Hant.md)。空清單會保留不可點擊的裝飾圖示。site.tagline 可增加頁尾文字。

頁尾將版權、佈景主題/Astro 署名及選填的 `site.tagline` 分組呈現，下方保留社群圖示。內建署名隨頁面語言切換，自訂說明在各語言中保留原文；空白說明不占空間，手機上的長文案自動換行。現有設定及 `PUBLIC_SITE_TAGLINE` 覆寫仍有效，無須遷移。

## 選擇語言

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

## 替換範例並撰寫文章

每種語言都有歡迎文章與三篇指南。先備份，再刪除不需要的範例；保留其他文章仍在使用的圖片。

```bash
npm run new-post -- my-first-post
# --locales en,pt-br
```

指令會為每個啟用的語言建立骨架，初始設定共九份。它不會自動翻譯，也不會覆寫現有檔案。請編輯 src/content/blog/zh-hant/my-first-post.md 的標題、描述與正文。

## 檢查與部署

```bash
npm run doctor
npm run preview
```

doctor 包含檢查與建置。preview 僅在本機顯示結果，不會發布到網路。靜態輸出在 dist/，包含搜尋索引與分享圖。託管服務使用 npm run build 建置，以 dist 為輸出目錄。依照 [Astro 部署指南](https://docs.astro.build/en/guides/deploy/) 完成發布，並檢查頁面、語言切換、搜尋及 /zh-hant/rss.xml。

不需要綁定 Cloudflare。Netlify、Vercel、Cloudflare Pages、GitHub Pages、自建伺服器設定及目前的網域根路徑限制，見 [README 部署說明](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/README.zh-Hant.md#deployment)。

## 設定原則

- [使用指南 1：設定你的部落格](/zh-hant/blog/starter-guide-1-configure-your-site/)
- [使用指南 2：撰寫與整理內容](/zh-hant/blog/starter-guide-2-languages-and-routing/)
- [使用指南 3：選用功能](/zh-hant/blog/starter-guide-3-comments-about-and-theme-toggles/)

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
