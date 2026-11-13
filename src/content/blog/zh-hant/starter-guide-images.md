---
tags: ['anglefeint', 'starter']
title: '使用指南 3：給文章和碎片添加圖片'
subtitle: '放入原圖，寫對路徑，準備回應式檔案，再設定封面和分享預覽。'
description: '說明文章內文、封面、Fragments 和分享圖片的實際處理區別，以及圖片準備、Git 提交和部署排錯。'
pubDate: '2026-11-13'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/cyber-03.webp'
---

本篇是入門教學的第 3 / 8 篇。[檢視完整教學順序](/zh-hant/blog/starter-guide-1-configure-your-site/#tutorial-order) · [依欄位查設定字典](/zh-hant/blog/config-reference/)。

你不需要手動制作多套尺寸，也不用把文章連結改成生成檔案名。先放好原圖，在文章或碎片中引用，再讓本機開發服務準備需要的回應式檔案即可。

本文按 starter 預設的 `src/`、`public/` 目錄說明。先分清圖片用在哪裡：

| 用途         | 寫在哪裡                                          | 目前處理方式                                                  |
| ------------ | ------------------------------------------------- | ------------------------------------------------------------- |
| 文章內文配圖 | Markdown 圖片，或 MDX 中的圖片                    | 使用原有 Markdown／MDX 圖片流程，不屬於下面的持久封面準備範圍 |
| 文章封面     | 文章 frontmatter 的 `heroImage`                   | 本機準備回應式檔案，列表和文章詳情共用                        |
| 碎片配圖     | 碎片內文的 Markdown 圖片、引用式圖片或 HTML `img` | 支援的本機圖片使用同一套持久回應式檔案，列表和首頁預覽共用    |
| 分享預覽圖   | 文章 `ogImage` 或網站 `site.ogImage`              | 獨立的分享圖片邏輯，不等同于封面縮圖                          |

## 1. 先把原圖放進專案

只在一篇文章中使用的圖片，可以放在文章旁邊：

```text
src/content/blog/zh/
  my-first-post.md
  photo.jpg
  cover.jpg
```

碎片也可以采用相同方式，將圖片放在對應 Markdown 旁邊。多個頁面共用的圖片可以放到 `public/images/`：

```text
public/images/
  shared-photo.jpg
  fragments/
    my-photo.png
```

這些目錄不存在時可以自己建立。檔案名建議使用簡單英文、數字和連字號，避免大小寫混淆。網址路徑使用 `/`，不要寫電腦上的 `C:\...`、`D:\...` 或反斜線路徑。部署到區分大小寫的系統時，`Photo.jpg` 和 `photo.jpg` 不一定是同一個檔案。

原圖必須保留。後面生成的 WebP 是顯示用的衍生檔案，不是原圖的替代備份。

## 2. 在文章內文中插圖

打開文章 Markdown，在需要的位置插入：

```md
![这张照片里有什么](./photo.jpg)
```

`./photo.jpg` 相對於目前文章檔案。上面的目錄範例中，它指向同目錄的 `photo.jpg`。使用 public 裡的檔案則寫：

```md
![这张照片里有什么](/images/shared-photo.jpg)
```

它對應 `public/images/shared-photo.jpg`，網址中不寫 `public`。方括號內是圖片的替代文字，建議描述實際內容，不要只寫“图片”。

文章內文的一般圖片支援點選放大，或聚焦後按 Enter／空格打開；Esc、關閉按鈕或蒙版收起。封面和連結、按鈕內部的圖片不參與這個預覽。放大使用瀏覽器已選擇的圖片來源，不會自動下載更高清的原圖，也不是相冊切換。

不要因為執行過 `prepare-covers` 就認為所有內文圖片都已壓縮。該指令處理的是封面來源池、文章封面引用和碎片本機圖片；一般文章內文中的 public 圖片仍可能直接下載原檔案。內文配圖應選擇適合顯示的體積，尤其避免直接放入數 MB 的擷圖。

## 3. 設定文章封面

把 `cover.jpg` 放在文章旁邊，然後在現有 frontmatter 中加入或修改：

```yaml
heroImage: ./cover.jpg
```

`heroImage` 可省略；使用時必須引用專案內的本機圖片檔案，不能直接填寫 HTTPS 圖片地址。不要把 `/images/cover.jpg` 當成這個欄位的 public 網址寫法，它與內文圖片的路徑規則不同。

如果希望集中管理新封面，可放到 `src/assets/blog/covers/originals/`。例如文章在 `src/content/blog/zh/my-first-post.md`，原圖在 `src/assets/blog/covers/originals/my-cover.jpg`，則填寫：

```yaml
heroImage: ../../../assets/blog/covers/originals/my-cover.jpg
```

封面不會自動插入文章內文。它用於部落格／標籤列表和文章詳情的封面區域；頁面可能按布局裁切可見部分，但生成圖片本身保持原比例，不會自動替你選擇人物或主體焦點。

`new-post` 自動挑選封面時，只從 `src/assets/blog/default-covers/` 中選取，不會因為你把圖片放入 `covers/originals/` 就自動選擇它。新 originals 需要自己在文章中引用。

## 4. 在碎片中添加圖片

`theme.fragments.enabled: false` 時，dev、build 和 prepare-covers／doctor 跳過碎片正文的圖片引用；僅透過這些引用納入處理的圖片不再要求原圖或衍生檔案存在。文章封面引用，以及 `src/assets/blog/default-covers/`、`src/assets/blog/covers/originals/` 兩個來源池仍會準備與驗證，即使圖片只用於碎片。關閉不刪檔，重新開啟後恢復碎片圖片處理。

**版本說明：** 上述圖片隔離從 0.36.1 起提供，0.36.0 未包含；不要視為舊版已有的行為。

將原圖放到 `public/images/fragments/my-photo.png`，在已有碎片 Markdown 內文中寫：

```md
![这条碎片的配图说明](/images/fragments/my-photo.png)
```

也可以將 `photo.png` 放在碎片檔案旁邊，用 `![配图说明](./photo.png)`。只往 public 目錄放一張圖不會觸發通用圖片庫掃描，需要在實際碎片中引用它。

引用式圖片同樣支援：

```md
![配图说明][photo]

[photo]: /images/fragments/my-photo.png
```

需要手動尺寸時可以使用 HTML：

```html
<img src="/images/fragments/my-photo.png" alt="配图说明" width="640" height="360" />
```

這裡的寬高是範例，實際使用時按自己圖片的比例填寫。支援的本機圖片會補齊缺少的寬高；已有尺寸保留，只寫一邊時按來源比例計算另一邊。寫錯已有寬高不會被自動糾正。

碎片列表每頁首圖預設優先載入，其他圖片和首頁縮圖懶載入。首頁只顯示限高預覽，超出部分裁切；它不是完整圖片檢視器，點卡片進入原碎片。建立碎片、穩定 ID 和評論設定見[發佈碎片](/zh-hant/blog/starter-guide-5-fragments/)。

## 5. 讓本機準備回應式檔案

首次引用圖片或替換原圖後，在專案根目錄執行本機開發服務：

```bash
npm run dev
```

dev 會準備缺少或過期的檔案，相關原始檔案和引用變化也會觸發更新。本機 `npm run doctor` 也會先準備，再檢查和建置。如果只想準備圖片，不啟動頁面或完整檢查，可以在停止 dev 後執行：

```bash
npx @anglefeint/astro-theme prepare-covers
```

只檢查現有檔案、不補生成時使用：

```bash
npx @anglefeint/astro-theme prepare-covers --check
```

不必每次重複編碼所有圖片。準備流程根據原圖、處理規則和輸出檔案的哈希判斷是否可重複使用；原圖改變會更新其衍生檔案，單份缺少或被修改時只修復需要的部分。不要手動改清單、改生成檔案名或把生成網址寫回文章。

目前準備規則是：

- 靜態柵格圖片生成 WebP，質量參數為 80；這是有損編碼目標，不保證無損像素。
- 候選寬度為 400、640、800、960、1200px；根據原圖寬度保留適用尺寸，必要時補入不超過 1200px 的來源寬，不放大小圖。
- 按 EXIF 方向轉正，保持原始比例，不生成不同構圖的裁剪版本。
- SVG 和多幀動畫保留原格式，不轉成靜態 WebP。單幀 GIF 可以按靜態圖片處理，不能單憑擴展名判斷是否保留。
- 預設封面池、originals 池和實際引用定義處理範圍；不會把 public 中所有圖片都轉換一遍。

瀏覽器根據頁面的 `srcset`、`sizes`、屏幕及像素密度選擇候選，不需要用戶維護多尺寸目錄。最大候選為 1200px，因此不保證大屏高像素密度下始終使用原圖級細節。

## 6. 提交哪些檔案，部署時做什麼？

準備後，相關檔案位於：

```text
src/assets/blog/covers/
  originals/      # 如果使用这个原图目录
  manifest.json  # 来源、尺寸、规则与输出哈希
  generated/     # 持久响应式文件
```

把以下內容一起提交到 Git：

1. 文章或碎片 Markdown，以及新增或替換的原圖。
2. 整個 `src/assets/blog/covers/`，包括清單和生成檔案。

原圖如果放在 public 或文章旁邊，也要提交對應位置的檔案，不要只提交 originals。即使清單目錄叫 blog/covers，碎片衍生檔案也保存在這裡。

發佈前停止 dev，執行本機 `npm run doctor`；成功後可以執行 `npm run preview` 檢視建置結果。doctor 已包含建置，無需緊接著再執行 build。託管平臺仍使用 `npm run build`、輸出目錄 `dist`，部署其中全部檔案。

**部署建置只驗證並複製已準備的回應式檔案，不在平臺上補生成。** CI 環境中的 doctor 同樣只驗證。缺少、過期或被修改時會失敗，應回到本機準備、提交，再重新部署。這套持久圖片流程不相依部署平臺保留 Astro 圖片快取。

目前使用的衍生檔案會複製到建置產物的 `_blog-covers/`。不要只上傳 HTML 或遺漏這個目錄。舊版本、不再使用的 generated 檔案不會自動刪除；清理前先確認引用，避免刪除仍需要的原圖。

圖片欄位的區別可查[文章 heroImage／ogImage](/zh-hant/blog/config-article/#frontmatter)與[碎片預覽規則](/zh-hant/blog/config-fragments/#preview-and-links)。

## 7. 分享連結時顯示哪張圖？

分享圖片是連結卡片使用的預覽，不等於頁面裡的封面。

預設情況下，文章會在建置時生成 1200×630 PNG，包含文章標題、作者和網站名稱，無需圖片服務或瀏覽器生成。修改這些資訊後重新建置和部署。`theme.footer.showCredits` 也控制自動分享圖片中的主題署名，不改變你上傳的自訂圖片。

### 為一篇文章指定分享圖片

把 `share.png` 放在文章旁邊，在 frontmatter 填寫：

```yaml
ogImage: ./share.png
```

或把檔案放到 `public/images/share.png`，使用 `ogImage: /images/share.png`。這個欄位也支援 HTTPS 圖片直鏈。相對本機圖會由文章圖片 schema 處理，public 路徑會檢查檔案是否存在；外鏈可用性取決於對方伺服器。

### 為沒有專屬圖片的頁面設定預設圖

在 `src/site.config.ts` 現有的頂層 `site` 中合併：

```ts
site: {
  ogImage: '/images/site-share.jpg',
},
```

先將檔案放到 `public/images/site-share.jpg`。`site.ogImage` 也支援 HTTPS 圖片地址；省略或留空使用主題內建的 1200×630 預設圖。這裡不能使用文章相對路徑。

目前優先級為：

1. 文章明確填寫的 `ogImage`。
2. 開啟自動生成時的文章分享圖片。
3. 關閉 `theme.socialImage.enabled` 後的文章 `heroImage`。
4. 頁面沒有專屬圖片時的 `site.ogImage`，最後是主題內建預設圖。

因此只改 `site.ogImage` 不會替換文章自動分享圖片。Fragments 頁面和它的各條 `#ID` 連結共用網站預設分享圖片，不會為每條碎片單獨生成卡片。

自動分享圖片在 `dist/_social/` 中。分享平臺抓取的是已部署頁面的中繼資訊，可能快取舊圖；本機看到新圖不代表平臺預覽會立即刷新。

## 8. 圖片不對時，按這裡排查

| 現象                                      | 先檢查什麼                                                                                 |
| ----------------------------------------- | ------------------------------------------------------------------------------------------ |
| 圖片不顯示                                | 檔案是否存在、大小寫是否一致、相對路徑是否從目前 Markdown 出發；public 網址不要帶 `public` |
| 封面準備失敗                              | `heroImage` 是否是專案內本機檔案，是否誤寫為外鏈或 public 網址；完整錯誤見終端機           |
| 提示 missing／stale／modified derivatives | 停止 dev，執行本機 prepare-covers，提交原圖、清單和 generated，再重新建置                  |
| 放進 public 卻沒有生成尺寸                | 是否在碎片內文實際引用；一般文章內文 public 圖片不屬於這套衍生掃描                         |
| GIF 或 SVG 仍然很大                       | 多幀／矢量保留原檔案，準備指令不會替你轉影片或壓縮動畫                                     |
| 遠程碎片圖片很慢或跳動                    | 外鏈不參與本機轉換，主題不能自動推斷遠程尺寸；自行最佳化原圖並填寫正確寬高                 |
| 本機有圖，發佈後沒有                      | 原圖和 generated 是否提交，部署是否包含整個 dist，資源路徑是否被改寫                       |
| 分享圖片仍舊                              | 是否重新建置並部署，文章專屬圖是否優先于網站預設圖，以及分享平臺是否快取                   |

如果自訂了 Astro 的 srcDir、publicDir 或帶 base 的來源路徑，用該專案設定下的 dev 準備；獨立 prepare-covers 指令使用預設目錄。圖片處理支援部分 base 路徑，並不代表整個主題已支援任意子目錄部署。

需要安裝或升級主題時，參見[安裝部落格，換成自己的資訊](/zh-hant/blog/starter-guide-1-configure-your-site/)；文章欄位和內文寫法見[寫第一篇文章](/zh-hant/blog/starter-guide-2-languages-and-routing/)。

## 教學導覽與設定查閱

[上一篇：寫第一篇文章](/zh-hant/blog/starter-guide-2-languages-and-routing/) · [下一篇：發佈一條碎片](/zh-hant/blog/starter-guide-5-fragments/) · [八篇教學總入口](/zh-hant/blog/starter-guide-1-configure-your-site/#tutorial-order)。

本篇相關欄位：[文章封面與分享圖片](/zh-hant/blog/config-article/)、[碎片圖片預覽](/zh-hant/blog/config-fragments/)、[網站預設分享圖片](/zh-hant/blog/config-site-chrome/)。完整路徑、預設值和限制見[設定字典總入口](/zh-hant/blog/config-reference/)。
