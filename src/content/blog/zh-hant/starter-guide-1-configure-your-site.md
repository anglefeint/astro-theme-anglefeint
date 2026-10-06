---
tags:
  - anglefeint
  - starter
title: 使用指南 1：設定你的部落格
subtitle: 安裝、網站資料、語言與部署。
description: 安裝、網站資料、語言與部署。
pubDate: '2026-03-07'
updatedDate: '2026-10-03'
heroImage: ../../../assets/blog/default-covers/cyber-02.webp
---

## 安裝並在本機開啟

使用 Node.js 22.12.0 或更新版本。在精靈中選擇資料夾，例如 my-blog，並讓 cd 指向實際建立的位置。若精靈已安裝相依套件，可略過 npm install。

```bash
npm create astro@latest -- --template anglefeint/astro-theme-anglefeint#starter
cd my-blog
npm install
npm run dev
```

開啟終端顯示的網址。若使用 pnpm，仍以相同 npm 指令建立專案，略過精靈的安裝步驟，再執行 pnpm install 與 pnpm dev。

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

## 設定原則

同一物件只保留一個 theme 與一個 i18n，將選項合併進去。陣列會整份取代舊值。不要直接修改 src/config/ 的產生檔。更新 npm 套件不會更新本機 starter 檔案；遷移前請閱讀[升級指南](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md)。

- [使用指南 1：設定你的部落格](/zh-hant/blog/starter-guide-1-configure-your-site/)
- [使用指南 2：撰寫與整理內容](/zh-hant/blog/starter-guide-2-languages-and-routing/)
- [使用指南 3：選用功能](/zh-hant/blog/starter-guide-3-comments-about-and-theme-toggles/)
