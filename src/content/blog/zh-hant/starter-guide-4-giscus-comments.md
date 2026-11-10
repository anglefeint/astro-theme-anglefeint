---
tags: ['anglefeint', 'starter']
title: '使用指南 4：設定 Giscus 留言'
description: '使用指南 4：設定 Giscus 留言'
pubDate: '2026-11-10'
updatedDate: '2026-11-10'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

在 `src/site.config.ts` 現有的 `defineThemeConfig({...})` 中合併下方 `theme.comments` 設定。保留其他設定；已有 `theme` 或 `comments` 物件時直接補充欄位，不要建立重複鍵。

`shareAcrossLocales: false` — `mapping: 'pathname'`

## 留言設定教學

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

mapping: 'pathname' 依路徑對應討論串；'specific' 需要 term，'number' 需要以字串提供正整數 number。不合法的值會報錯。strict、reactionsEnabled 使用 '0' 或 '1'。無法顯示時檢查 ID、權限、連線與瀏覽器阻擋。

## 讓同篇文章的多語言版本共用留言

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

既有整合版 starter 請先升級至包含此選項的主題版本。修改設定後重新建置並部署，使用正式版預覽確認留言。

```bash
npx @anglefeint/astro-theme@latest upgrade
npm run build
npm run preview
```

[← 使用指南 3](/zh-hant/blog/starter-guide-3-comments-about-and-theme-toggles/)
