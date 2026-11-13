---
tags: ['anglefeint', 'starter']
title: '使用指南 1：安裝部落格，換成自己的資訊'
subtitle: '在本機執行部落格，修改自己的資訊，按預設流程建立文章，再依需求調整語言和首頁文字。'
description: '從安裝啟動到個人資訊、預設建立流程和本機驗證；首頁文字與語言依需求調整，已有專案可檢視文末升級說明。'
pubDate: '2026-03-07'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/cyber-02.webp'
---

本篇是入門教學的第 1 / 8 篇。[檢視完整教學順序](/zh-hant/blog/starter-guide-1-configure-your-site/#tutorial-order) · [依欄位查設定字典](/zh-hant/blog/config-reference/)。

讀完這篇，你可以在自己的電腦上打開部落格，把網站名稱、首頁介紹和聯絡方式換成自己的，並知道接下來在哪裡寫文章。音樂、評論和頁面自訂可以等需要時再設定。

如果你已經有一個使用 Anglefeint 的專案，直接在原專案修改設定；需要更新主題時，檢視文末「已有專案如何升級」，不用重新安裝一份部落格。

<a id="tutorial-order"></a>

## 八篇教學怎麼讀？

第一次使用可以依照下面順序閱讀；碎片、評論和多語言調整都是依需求操作，不需要為了完成安裝而開啟。閱讀繁體中文教學不要求先修改專案的預設語言；需要調整語言時再依照對應章節操作。以後只想改某個欄位時，直接從[設定字典總入口](/zh-hant/blog/config-reference/)查詢。

| 順序 | 教學                                                                                                | 讀完可以做什麼                                     |
| ---- | --------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| 1    | [安裝部落格，換成自己的資訊](/zh-hant/blog/starter-guide-1-configure-your-site/)                    | 執行部落格、修改個人資訊，了解預設流程。           |
| 2    | [寫第一篇文章](/zh-hant/blog/starter-guide-2-languages-and-routing/)                                | 建立文章、填寫日期，使用標題、標籤、程式碼和公式。 |
| 3    | [給文章和碎片添加圖片](/zh-hant/blog/starter-guide-images/)                                         | 放入原圖、設定封面、準備圖片並提交衍生檔案。       |
| 4    | [發佈一條碎片](/zh-hant/blog/starter-guide-5-fragments/)                                            | 建立碎片，保留穩定 ID，添加配圖和程式碼。          |
| 5    | [把頁面和功能調整成自己喜歡的樣子](/zh-hant/blog/starter-guide-3-comments-about-and-theme-toggles/) | 調整頁面內容、音樂和分頁，建立自訂頁面。           |
| 6    | [讓讀者留下評論](/zh-hant/blog/starter-guide-4-giscus-comments/)                                    | 連線 Giscus，選擇文章、碎片及譯文討論的關聯方式。  |
| 7    | [讓更多語言的讀者使用部落格](/zh-hant/blog/starter-guide-languages/)                                | 依需求選擇語言、調整首頁地址並補充譯文。           |
| 8    | [把部落格發佈到自己的網域](/zh-hant/blog/starter-guide-deployment/)                                 | 檢查建置產物、部署完整檔案並綁定網域。             |

可以隨時從各篇開頭或結尾返回這份目錄，繼續下一步或查找需要的內容。

## 1. 安裝並打開部落格

先準備 Node.js 22.12.0 或更新版本和 npm。在終端機執行下面兩條指令，確認它們能輸出版本號：

```bash
node --version
npm --version
```

在你打算存放專案的目錄中建立部落格。下面的指令會建立 `my-blog` 資料夾。建立精靈詢問是否安裝相依套件時，請選 Yes；只有主動略過安裝時，才需要在啟動前執行 `npm install`。`--no-ai` 略過額外產生的通用 AI 指引檔案，主題自己的指引已隨 starter 提供：

```bash
npm create astro@latest -- my-blog --template anglefeint/astro-theme-anglefeint#starter --no-ai
cd my-blog
npm run dev
```

你可以把 `my-blog` 換成其他目錄名，同時修改 `cd` 後的名稱。打開終端機顯示的本機網址；不要假定連接埠一定相同，連接埠被佔用時可能變化。開發服務保持執行，按 `Ctrl+C` 停止。

後續指令都在這個專案根目錄執行，也就是包含 `package.json` 的目錄。再次打開已有專案時，只需進入該目錄執行 `npm run dev`。首次安裝相依或相依發生變化時才需要執行 `npm install`。

這篇使用 npm。使用 pnpm 的新專案可把安裝、啟動指令換成 `pnpm install`、`pnpm dev`，但文末的自動升級工具目前只支援 npm 專案。一個專案保持使用同一種套件管理工具。

## 2. 換成自己的網站資訊和首頁文字

安裝後的專案已經有 `src/site.config.ts`，直接打開這個檔案編輯，不需要新建設定檔案或重新宣告設定物件。starter 預設省略 `site` 並使用主題預設值；在現有的 `defineThemeConfig({ ... })` 內加入下面的欄位即可。如果檔案已經有 `site`，直接修改其中的欄位，保留其他個人設定，不要重複添加同名物件。檔案原有的 import、export 和其他內容保持不動。

```ts
site: {
  title: '小林的部落格',
  description: '記錄開發、閱讀和生活。',
  url: 'https://example.com',
  author: '小林',
  tagline: '保持好奇，持續記錄。',
},
```

這段只顯示現有物件內部的成員，不是一個新的完整設定檔案。把姓名、文字和網域替換成自己的；它不會改變預設語言或啟用語言列表。`site.url` 填最終上線的網域地址，例如 `https://your-domain.example`，不要填本機預覽網址或某篇文章的網址。暫時沒有網域可以先保留範例，在正式部署前換掉。目前主題按網域根目錄部署使用，不能僅設定 Astro `base` 就認為子目錄部署已調整。

這些欄位分別控制：

| 欄位               | 實際作用                                                                                   |
| ------------------ | ------------------------------------------------------------------------------------------ |
| `site.title`       | 全站名稱，用於頁面標題、導覽、頁尾等；沒有單獨設定首頁標題時，也作為首頁大標題的最終回退值 |
| `site.author`      | 未單獨填寫作者的文章所使用的預設作者                                                       |
| `site.url`         | canonical、RSS、sitemap 和分享圖片等輸出使用的網站地址                                     |
| `site.description` | 網站級預設描述；首頁優先使用解析後的 `messages.siteDescription`，為空才使用這個值          |
| `site.tagline`     | 頁尾自訂文字；設為 `''` 不顯示這段文字，主題和 Astro 署名由另一個開關控制                  |

### 依需求修改某種語言的首頁文字

首頁可見介紹和首頁中繼描述需要在對應語言下填寫。下面以專案預設的英文首頁為例，在現有設定物件內添加或合併 `i18n`；已有同名物件時只修改對應欄位：

```ts
i18n: {
  locales: {
    en: {
      site: { hero: 'Notes on projects, reading and everyday life.' },
      messages: { siteDescription: 'Personal projects and learning notes by Lin.' },
    },
  },
},
```

`i18n.locales.en.site.hero` 控制英文首頁大標題下面的可見介紹，`messages.siteDescription` 控制該頁 SEO 描述。前者設為 `''` 可以清空可見介紹，不會清空後者。將 en 換成其他已啟用的語言代碼，就能修改那種語言的文字；這不會改變預設語言，也不會自動翻譯其他語言。

首頁大標題預設使用全站名稱；如果希望它不同，在同一個 `en.site` 中添加 `homeTitle`，保留已有的 `hero`：

```ts
site: {
  homeTitle: "Lin's Digital Garden",
  hero: 'Notes on projects, reading and everyday life.',
},
```

這裡的 `site` 位於 `i18n.locales.en` 內，不是頂層 `site`。`homeTitle` 只修改首頁可見大標題，不會替換瀏覽器標題、導覽、頁尾或 RSS 中的全站名稱。未設定或只有空白時，會沿該語言的回退鏈查找，最後使用全站名稱。完整欄位見[首頁字典](/zh-hant/blog/config-home/#home-title)。

### 放上自己的社交連結

在現有設定物件內添加或修改 `social.links`，把 `yourname` 換成真實帳號：

```ts
social: {
  links: [{ href: 'https://github.com/yourname', label: 'GitHub', icon: 'github' }],
},
```

每條連結填寫 `href`（目標地址）和 `label`（無障礙名稱），`icon` 是選用的內建圖標名。內建圖標支援 `github`、`twitter`、`mastodon`、`youtube`、`bluesky`、`linkedin`、`discord`、`telegram`、`instagram`、`facebook`、`whatsapp`、`line`。

`social.links` 同時用於頂部和頁尾，按陣列順序顯示；手機寬度下頂部社交入口隱藏，頁尾仍保留。陣列會整體替換預設列表，添加新帳號時也要保留希望繼續顯示的條目。暫時不放帳號可以使用 `social: { links: [] }`；空列表會保留三個不可點選的佔位圖標，並非隱藏整個區域。

### 修改了卻沒有變化？

先檢查專案根目錄的 `.env`、其他適用的 `.env.*` 檔案，以及託管平臺建置環境中有沒有舊的覆寫值：

- `PUBLIC_SITE_TITLE` 覆寫網站名稱。
- `PUBLIC_SITE_AUTHOR` 覆寫預設作者。
- `PUBLIC_SITE_URL` 覆寫網站地址。
- `PUBLIC_SITE_DESCRIPTION` 覆寫網站級預設描述，但不會取代非空的首頁語言描述。
- `PUBLIC_SITE_TAGLINE` 覆寫頁尾自訂文字。

不需要這些覆寫時移除對應變數，統一使用設定檔案即可，不必為了使用主題新建 `.env`。修改環境變數後重啟開發服務；發佈的網站需要重新建置和部署，本機保存檔案不會直接修改線上頁面。

## 3. 先保留預設語言，依需求調整

初始設定啟用 `en`、`ja`、`ko`、`es`、`zh`、`pt-br`、`de`、`ru`、`zh-hant` 九種語言，預設語言是 `en`。瀏覽 `/` 會跳轉到 `/en/`；閱讀繁體中文教學不需要先把部落格改為中文，也不需要為了建立第一篇文章關閉其他語言。

如果你想更換預設語言、只保留部分語言，或讓預設語言首頁直接使用根地址 `/`，按[第七篇：讓更多語言的讀者使用部落格](/zh-hant/blog/starter-guide-languages/)操作即可，這是選用設定。省略某種語言不會關閉它，需要明確設定 `meta.enabled: false`；預設語言始終啟用。關閉語言不刪除文章檔案。

語言設定的型別、預設值和地址關系見[語言字典](/zh-hant/blog/config-languages/#registry)。系統不會自動翻譯文章或首頁文字；繼續下面的預設建立流程時，留意生成了哪些語言檔案。

## 4. 用自己的文章替換範例

文章位於 `src/content/blog/<locale>/`。 starter 中的 `welcome-to-anglefeint.md`、`starter-guide-*.md` 和 `config-*.md` 都是一般部落格文章，分別用於歡迎範例、八篇教學和設定字典。備份或提交到 Git 後，可以按語言保留或刪除不需要的內容；只刪歡迎文章與教學，不會同時刪掉字典。不要刪除仍被其他內容引用的圖片。

按預設流程建立文章：

```bash
npm run new-post -- my-first-post
```

沒有指定 `--locales` 或 `ANGLEFEINT_LOCALES` 時，指令會為專案全部已啟用語言生成同名範本；初始設定會生成九份。它不會自動翻譯，同名檔案已存在時會跳過，不覆寫已有內容。

打開 `src/content/blog/<locale>/my-first-post.md`，填寫標題、簡介和內文；對應網址是 `/<locale>/blog/my-first-post/`。例如英文檔案在 en 目錄、網址為 `/en/blog/my-first-post/`，中文對應 zh 目錄和 `/zh/blog/my-first-post/`。發佈前把未完成、不準備公開的範本移出內容目錄，不能把它們當作自動隱藏的草稿。

如果只想建立某種語言，可以改用 `npm run new-post -- my-first-post --locales zh`；指定多種語言可用 `--locales en,zh`。這些是選用用法，不必重複執行全部範例；`--locales` 本身不會啟用語言。

文章欄位、封面、程式碼和數學公式的詳細寫法見[寫文章與管理內容](/zh-hant/blog/starter-guide-2-languages-and-routing/)。

## 5. 在本機確認修改結果

回到開發頁面確認：網站名稱和首頁介紹已經替換、語言選單符合預期、自己的文章可以打開、社交連結指向真實帳號。目錄中的其他語言文章只有在對應語言啟用時才會生成其路由。

檢查建置結果前，先按 `Ctrl+C` 停止開發服務，再執行：

```bash
npm run doctor
npm run preview
```

本機 `doctor` 會準備缺少或過期的回應式圖片檔案、執行 Astro 檢查並建置網站；About 開啟時還會檢查對應執行時設定。成功後不必緊接著重複執行 `check` 或 `build`。任何一步失敗時先處理終端機錯誤，再執行 `doctor`；不要把失敗後殘留的 `dist/` 用於部署。

`preview` 打開的是 `dist/` 中已經建置的靜態網站，瀏覽終端機給出的網址即可；它不會把部落格發佈到互聯網。文章搜尋需要在建置後的預覽中驗證，`dev` 沒有實時全文搜尋。按 `Ctrl+C` 停止預覽。

以後發佈時，託管平臺的建置指令是 `npm run build`，輸出目錄為 `dist`，需要部署其中全部檔案。新增或更換本機圖片後，先在本機執行 dev 或 doctor，提交原圖和生成的整個 `src/assets/blog/covers/` 目錄；一般 dev、build 和 doctor（包含 CI）會自動補齊缺少、過期或損壞的衍生圖片，並重用正確的既有檔案。原圖缺失、無效圖片或不安全路徑仍會報錯。明確執行的 `prepare-covers --check` 與設定同步只驗證、不修復。將原圖及整個 `src/assets/blog/covers/` 提交到 Git 可以重用產物，不依賴部署平台保留圖片快取。 **版本說明：** build 與 CI doctor 的自動圖片準備從 0.36.2 起支援；使用 0.36.1 時，請先透過 dev 或 `prepare-covers` 準備圖片。修改內容或設定後，需要重新建置並部署。

## 已有專案如何升級

新安裝的部落格不需要再執行本節。已有專案先保存自己的改動，例如提交到 Git，然後停止開發服務和預覽，在原專案根目錄執行：

```bash
npx @anglefeint/astro-theme@latest upgrade --check
```

`--check` 會查詢目標版本並檢查專案、Node.js 和 Astro 相容性，不修改專案檔案，也不執行安裝或建置。確認通過後再執行實際升級：

```bash
npx @anglefeint/astro-theme@latest upgrade
```

自動升級適用於使用 npm、帶有 `package-lock.json` 的整合版 starter。專案的 `package.json` 應帶有 `anglefeint.projectSchema: 1`，標準頁面由主題套件提供。檢測到 pnpm、yarn 或 bun 鎖檔案時會停止；不要為了繞過檢查刪除自己的鎖檔案。非 npm 專案需使用原套件管理工具，在確認目標版本相容後更新相依並執行專案的 doctor，自動升級工具不提供這一路徑的回滾。

升級工具更新主題相依並執行 doctor，不重寫你的文章、設定、音樂、圖片或自建頁面。它會把 `package.json`、`package-lock.json` 備份到 `.anglefeint/backups/`，不是整站備份。安裝或 doctor 失敗時會還原這兩個相依檔案並嘗試重新安裝原相依；如果還原安裝也失敗，按終端機錯誤修復相依，再成功執行 `npm run doctor`。舊的建置產物不會一起還原，失敗後不要部署 `dist/`。

Node.js、Astro 或 starter schema 不相容時會停止，不會自動遷移 Astro。`--to` 可指定一個相容的明確主題版本，但不支援自動降級；版本變更說明可查 [GitHub Releases](https://github.com/anglefeint/astro-theme-anglefeint/releases)。升級成功後可直接執行 `npm run preview` 檢查已建置的結果，再按原流程部署，無需為了升級立即再建置一遍。

0.27 之前的複製式舊範本不支援原地自動升級。應在另一個目錄按本文安裝新 starter，保留舊專案，將文章和資源遷入新專案，再將個人設定值合併到新的 `src/site.config.ts`。不要複製舊標準路由、adapter 或 defaults/schema/runtime 輔助檔案；核對文章 slug、語言路徑、音樂和圖片 URL，以及網域和託管設定，再完成本機檢查和部署。

## 教學導覽與設定查閱

[下一篇：寫第一篇文章](/zh-hant/blog/starter-guide-2-languages-and-routing/) · [八篇教學總入口](/zh-hant/blog/starter-guide-1-configure-your-site/#tutorial-order)。

本篇相關欄位：[網站、社交和頁尾](/zh-hant/blog/config-site-chrome/)、[首頁標題與介紹](/zh-hant/blog/config-home/)、[語言設定](/zh-hant/blog/config-languages/)。完整路徑、預設值和限制見[設定字典總入口](/zh-hant/blog/config-reference/)。
