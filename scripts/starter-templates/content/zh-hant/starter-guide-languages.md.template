---
tags: ['anglefeint', 'starter']
title: '使用指南 7：讓更多語言的讀者使用部落格'
subtitle: '選擇語言、調整首頁地址、填寫在地化文字，再為文章和碎片補上譯文。'
description: '依實際設定解釋語言啟停、預設語言、首頁路由、回退行為、新語言整合及文章和碎片的多語言關聯。'
pubDate: '2026-11-13'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/hacker-01.webp'
---

本篇是入門教學的第 7 / 8 篇。[檢視完整教學順序](/zh-hant/blog/starter-guide-1-configure-your-site/#tutorial-order) · [依欄位查設定字典](/zh-hant/blog/config-reference/)。

你可以先只寫一種語言，以後再添加譯文。主題提供多語言介面和路由，但不負責自動翻譯文章；啟用一個語言、修改介面文字、發佈一篇譯文，是三個不同操作。

下面所有設定都合併到 `src/site.config.ts` 已有的 `defineThemeConfig({...})` 物件中。保留原來的 `i18n` 和其他個人設定，不要重複追加同名物件。

## 1. 先決定需要哪些語言

預設啟用九種語言，預設語言是 `en`：

| 代碼      | 語言               |
| --------- | ------------------ |
| `en`      | English            |
| `zh`      | 简体中文           |
| `zh-hant` | 繁體中文           |
| `ja`      | 日本語             |
| `ko`      | 한국어             |
| `es`      | Español            |
| `pt-br`   | Português (Brasil) |
| `de`      | Deutsch            |
| `ru`      | Русский            |

如果想只保留中文和英文，同時將預設語言改為中文，可以選擇下面的設定；不需要這些調整時保留專案預設值即可：

```ts
i18n: {
  defaultLocale: 'zh',
  locales: {
    zh: { meta: { enabled: true } },
    en: { meta: { enabled: true } },
    ja: { meta: { enabled: false } },
    ko: { meta: { enabled: false } },
    es: { meta: { enabled: false } },
    'pt-br': { meta: { enabled: false } },
    de: { meta: { enabled: false } },
    ru: { meta: { enabled: false } },
    'zh-hant': { meta: { enabled: false } },
  },
},
```

省略一個語言不會將它關閉，因為設定會與預設值合併。必須明確寫 `meta.enabled: false`；預設語言始終啟用，不能一邊指定 `defaultLocale: 'zh'`，一邊期望通過關閉 zh 隱藏它。

關閉語言會移除其主題語言入口並停止生成相應標準頁面，不刪除該目錄中的文章檔案。重新啟用後，保留的內容可以再次生成。改語言代碼則會改變目錄和網址，不等於只改一個顯示名稱；已有網站需要自己處理舊連結。

## 2. 選擇預設語言首頁的網址

在現有 `i18n` 中加入或修改 `routing`：

```ts
i18n: {
  defaultLocale: 'zh',
  routing: { defaultLocalePrefix: 'never' },
},
```

以預設語言 zh 為例：

| 設定                 | `/`               | `/zh/`         | `/en/`             |
| -------------------- | ----------------- | -------------- | ------------------ |
| `'always'`，主題預設 | 靜態跳轉到 `/zh/` | 中文首頁       | 英文首頁（需啟用） |
| `'never'`            | 直接顯示中文首頁  | 靜態跳轉到 `/` | 英文首頁（需啟用） |

預設語言由設定確定，不會根據訪客瀏覽器語言自動改成另一種。跳轉是建置出來的 HTML 跳轉頁，不需要額外的應用伺服器；瀏覽時可能短暫看到跳轉提示。

**這個設定只影響預設語言首頁。** 中文部落格、文章、About、Decoder 和 Fragments 仍保留 `/zh/` 前綴，例如 `/zh/blog/my-first-post/`，不會自動變成 `/blog/my-first-post/`。更改預設語言也不會移動或翻譯已有內容檔案。

## 3. 給不同語言填寫首頁和介面文字

在對應語言下設定自己的文字，例如：

```ts
i18n: {
  locales: {
    zh: {
      meta: { label: '简体中文' },
      site: {
        homeTitle: '小林的数字花园',
        hero: '记录开发、阅读和生活。',
      },
      messages: {
        siteDescription: '小林的个人博客，分享项目和学习笔记。',
        nav: { home: '首页', blog: '文章', about: '关于我' },
      },
    },
    en: {
      site: {
        homeTitle: "Lin's Digital Garden",
        hero: 'Notes on code, books and everyday life.',
      },
      messages: { siteDescription: 'Projects and learning notes by Lin.' },
    },
  },
},
```

- `meta.label` 是語言選單名稱。把“简体中文”改為“中文”，不會把代碼 zh 或網址也改名。
- `site.homeTitle` 只改變目前語言首頁的可見大標題；全站名稱仍由頂層 `site.title` 或環境覆寫值決定。
- `site.hero` 是首頁大標題下面的可見介紹。
- `messages.siteDescription` 是首頁中繼描述，不是可見介紹；只改頂層 `site.description` 不一定替換內建首頁描述。
- `messages.nav` 修改對應介面入口的文字，不改變路由或文章內容。

同樣，`i18n.locales.<locale>.about` 修改該語言的 About 內容，`messages` 下各模組修改對應介面文字。About 和 Decoder 等頁面仍受全站功能開關控制，不會因為寫了譯文就自動開啟。具體內容範例見[頁面與功能自訂](/zh-hant/blog/starter-guide-3-comments-about-and-theme-toggles/)。

語言中繼資料和預設首頁地址可查[語言字典](/zh-hant/blog/config-languages/#registry)；首頁三種文字的區別見[首頁字典](/zh-hant/blog/config-home/#home-title)。

## 4. 理解沒有填寫的欄位從哪裡來

`meta.fallback` 用來選擇設定回退語言。例如希望簡體中文缺少設定時參考英文，可合併：

```ts
i18n: {
  locales: {
    zh: { meta: { fallback: ['en'] } },
  },
},
```

這裡的 en 必須在專案的語言設定中存在。預設語言會被補進非預設語言的必要回退鏈；自己、重複項和不存在的語言會被過濾。陣列會整體替換，所以填寫多個回退語言時，要一次寫出希望使用的順序。

回退的具體規則並非所有欄位都一樣：

| 內容                              | 目前行為                                                                            |
| --------------------------------- | ----------------------------------------------------------------------------------- |
| 一般 `messages`                   | 從內建英文開始，按回退鏈合併內建語言包和個人覆寫，目前語言優先；內建譯文也參與合併  |
| 首頁 `homeTitle`                  | 依次查找目前語言及回退語言的非空、去除首尾空白後的標題，最後使用全站名稱            |
| 首頁 `hero`                       | 查找目前語言及回退語言的已定義值；`''` 是主動清空，不會繼續找下一語言               |
| About 設定                        | 從預設 About 開始，按回退鏈合併對應語言的個人 About 設定                            |
| 首頁 `messages.home.transmission` | 單獨使用目前語言個人設定 → 英文個人設定 → `Knock, knock.`，不走一般文字的完整回退鏈 |

所以，把英文導覽文字改掉，不代表已有中文內建導覽也會變成英文設定裡的文字。要明確改變一種語言的介面，應在該語言下覆寫。關閉某語言的頁面也不等於刪除其設定；仍在回退鏈中的設定可以參與補齊。

回退只補設定和介面文字：不會把英文文章自動放進中文部落格，也不會自動建立另一語言的檔案。不要把它當作內容翻譯服務。

## 5. 添加一個新的語言

例如添加法語，在現有 locales 中加入 fr，保留前面已啟用和關閉的語言設定：

```ts
i18n: {
  locales: {
    fr: {
      meta: {
        label: 'Français',
        hreflang: 'fr',
        ogLocale: 'fr_FR',
        enabled: true,
        fallback: ['en'],
      },
      site: {
        homeTitle: 'Le jardin de Lin',
        hero: 'Notes de lecture et projets.',
      },
      messages: {
        siteDescription: 'Le blog personnel de Lin.',
        nav: { home: 'Accueil', blog: 'Articles', about: 'À propos' },
      },
    },
  },
},
```

fr 是目錄和路由使用的代碼。建議使用規範的小寫代碼；建立指令接受兩到三位字母和選用的一段連字號後綴，例如 `fr`、`pt-br`、`zh-hant`，不能寫路徑或空格。範例沿用現有預設語言，不會把法語自動設為預設。

`hreflang` 是頁面語言替代連結的語言識別碼；省略時使用語言代碼。`ogLocale` 是 Open Graph 使用的語言地區識別碼，格式與路徑代碼不同，範例為 fr_FR。這些中繼資訊不會翻譯內文，也不保證搜尋引擎收錄。

新語言沒有內建完整翻譯包。上面的片段只翻譯幾個入口，其他文字會回退；需要完整法語介面，還需補充自己使用的搜尋、分頁、評論提示、工具和 About 等模組文字。先從實際頁面上會出現的內容開始，不必為了顯示一篇文章先修改主題實作。

## 6. 為文章補一份譯文

同時建立中文和英文文章範本：

```bash
npm run new-post -- my-first-post --locales zh,en
```

在 `src/content/blog/zh/my-first-post.md` 寫中文，在 `src/content/blog/en/my-first-post.md` 寫英文。新語言範例可使用 `npm run new-post -- french-note --locales fr`，生成後自己填寫內容。

已有中文文章要補譯時，也可以複製到目標語言目錄並保留檔案主名，再翻譯標題、簡介和內文。相對圖片路徑從新檔案位置計算，複製到不同目錄層級後需要檢查路徑。同名檔案已存在時建立指令跳過，不覆寫舊稿。

文章譯文依靠語言目錄之外的完整 slug 關聯。例如 zh/my-first-post 與 en/my-first-post 是譯文；把英文檔案名改為 my-story 就成為不同文章，標題相同也不會自動配對。嵌套目錄同樣要一致。

文章頁語言選單中，有同 slug 的目標語言文章時進入譯文；缺少時進入該語言部落格列表。搜尋引擎用的文章語言替代連結只宣告真正存在且已啟用的譯文，不把列表頁假稱為另一種語言的文章。

`--locales` 只建立指定語言檔案，不會啟用語言。省略時先檢查 `ANGLEFEINT_LOCALES` 環境變數，未設定則使用專案啟用語言；明確參數優先于環境變數。建立範本和翻譯內文是分開的步驟。

## 7. 碎片和其他頁面的語言切換

碎片譯文使用相同 frontmatter `id`，不靠相同檔案名關聯。後續補譯時複製原檔案到目標語言目錄，保留 id 和 pubDate，再翻譯標題與內文。再次執行 new-fragment 會建立新身分，不能用來補同一條的譯文。

同一次 `npm run new-fragment -- --locales zh,en` 會為兩種語言生成共享 ID 和時間戳的範本。碎片列表的語言切換始終進入目標語言第一頁，不保證直接定位同一條譯文。完整規則見[發佈一條碎片](/zh-hant/blog/starter-guide-5-fragments/)。

文章評論的多語言共享需要另外啟用 `theme.comments.shareAcrossLocales`，預設關閉；碎片評論則按相同 ID 共享。介面語言和討論關聯是兩件事，評論內文也不會自動翻譯，見[讓讀者留下評論](/zh-hant/blog/starter-guide-4-giscus-comments/)。

`new-page` 生成的自訂 Astro 頁面會為啟用語言生成路由，但只提供一份頁面原始檔案；你需要根據語言提供相應內容，不會自動為每種語言複製或翻譯一套頁面。

## 8. 修改後檢查哪些結果

先在 dev 中逐個打開自己啟用語言的首頁，檢查選單名稱、首頁標題、介紹和 About 內容。再檢查一篇有譯文的文章、一篇沒有譯文的文章，確認語言切換符合預期。語言列表和檔案目錄代碼要完全一致。

發佈前停止 dev，執行：

```bash
npm run doctor
npm run preview
```

doctor 包含檢查和建置，成功後不必立即再執行 check 或 build。用建置後的 preview 驗證各語言文章搜尋；索引搜尋目前語言，不會把全部語言混在一起。每種已啟用語言的 RSS 位於 `/<locale>/rss.xml`，只包含相應語言的文章。

確認網站網域正確後，重新部署整個 `dist/`。語言啟停、預設地址和內容變化都需要重新建置；僅修改本機設定不會改變線上頁面。重新部署要注意清理舊產物，關閉語言不是為舊網址自動建立重新導向。

| 現象                          | 先檢查什麼                                                                     |
| ----------------------------- | ------------------------------------------------------------------------------ |
| 選單仍顯示不需要的語言        | 是否只是從設定刪掉了覆寫項，而沒有明確設定 enabled: false                      |
| 預設語言無法關閉              | 是否仍將它設為 defaultLocale；先選擇新的預設語言                               |
| 建立了檔案卻沒有頁面          | 語言是否啟用，目錄代碼是否一致，是否已經重新建置                               |
| 頁面還有英文                  | 新語言是否只覆寫了部分文字，或缺少對應 About 內容                              |
| 改了標題卻沒有變              | 改的是全站 site.title、首頁 homeTitle、hero，還是頁面 messages；檢查環境覆寫值 |
| 切語言後進入列表              | 目標語言是否缺少同 slug 譯文，這屬於目前回退行為                               |
| 設定 never 後文章仍有語言前綴 | 此開關只改變預設語言首頁，這是預期行為                                         |

網站資訊和升級步驟見[安裝教學](/zh-hant/blog/starter-guide-1-configure-your-site/)，日常寫作見[寫第一篇文章](/zh-hant/blog/starter-guide-2-languages-and-routing/)。

## 教學導覽與設定查閱

[上一篇：讓讀者留下評論](/zh-hant/blog/starter-guide-4-giscus-comments/) · [下一篇：把部落格發佈到自己的網域](/zh-hant/blog/starter-guide-deployment/) · [八篇教學總入口](/zh-hant/blog/starter-guide-1-configure-your-site/#tutorial-order)。

本篇相關欄位：[語言、地址與回退](/zh-hant/blog/config-languages/)、[跨語言評論共享](/zh-hant/blog/config-comments/)。完整路徑、預設值和限制見[設定字典總入口](/zh-hant/blog/config-reference/)。
