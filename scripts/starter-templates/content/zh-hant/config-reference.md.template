---
tags: ['anglefeint', 'config']
title: '設定字典：我想改的東西在哪裡？'
subtitle: '按頁面、功能或完整設定路徑，找到 site.config 中的設定。'
description: 'Anglefeint 設定參考總入口，區分設定位置、預設值和生效狀態，並提供已整理模組的欄位索引。'
pubDate: '2026-11-13'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/hacker-01.webp'
---

**版本說明：** 本字典以目前原始碼為準。即時回應減少動態效果、`blogPageSize` 嚴格驗證及關閉 Fragments 後的圖片隔離從 0.36.1 起提供，0.36.0 未包含。預設安裝與 CLI 用法不變。

如果你已經知道想完成什麼，先看操作教學；如果你在找一個欄位的含義、預設值或限制，從這裡查設定字典。兩者都以目前主題程式碼為準，不要求先閱讀儲存庫說明檔案。

第一次使用請從[八篇教學總入口](/zh-hant/blog/starter-guide-1-configure-your-site/#tutorial-order)依序閱讀：安裝 → 寫文章 → 添加圖片 → 發佈碎片 → 調整頁面與功能 → 評論 → 多語言 → 部署。選用功能不必全部啟用；本字典用於隨時查欄位，不要求從頭讀完整份路徑表。

目前已完成[首頁設定](/zh-hant/blog/config-home/)、[Blog List 與標籤列表設定](/zh-hant/blog/config-blog-list/)、[文章詳情頁設定](/zh-hant/blog/config-article/)、[Fragments 設定](/zh-hant/blog/config-fragments/)、[About 設定](/zh-hant/blog/config-about/)、[Decoder 設定](/zh-hant/blog/config-decoder/)、[音樂播放器設定](/zh-hant/blog/config-music/)、[Giscus 評論設定](/zh-hant/blog/config-comments/)、[語言與回退設定](/zh-hant/blog/config-languages/)、[搜尋與內容發現設定](/zh-hant/blog/config-search/)、[GA4 與 AI 閱讀補充設定](/zh-hant/blog/config-analytics-ai/)、[網站與公共介面設定](/zh-hant/blog/config-site-chrome/)和[終端機設定](/zh-hant/blog/config-terminal/)。

## 按頁面或功能查找

| 我想修改                                             | 字典狀態                                                 | 現有操作教學                                                                                                                                      |
| ---------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| 首頁標題、介紹、最新文章、啟動提示、終端機文字與穿越 | [首頁設定字典](/zh-hant/blog/config-home/)               | [頁面與功能自訂](/zh-hant/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                                 |
| 網站名稱、網域、公共導覽、社交和頁尾                 | [網站與公共介面字典](/zh-hant/blog/config-site-chrome/)  | [安裝與網站資訊](/zh-hant/blog/starter-guide-1-configure-your-site/)、[頁面自訂](/zh-hant/blog/starter-guide-3-comments-about-and-theme-toggles/) |
| Blog List、標籤列表和分頁                            | [列表設定字典](/zh-hant/blog/config-blog-list/)          | [列表與分頁設定](/zh-hant/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                                 |
| 文章詳情、目錄、數學和閱讀效果                       | [文章設定字典](/zh-hant/blog/config-article/)            | [寫第一篇文章](/zh-hant/blog/starter-guide-2-languages-and-routing/)                                                                              |
| Fragments 列表與預覽                                 | [Fragments 字典](/zh-hant/blog/config-fragments/)        | [發佈一條碎片](/zh-hant/blog/starter-guide-5-fragments/)                                                                                          |
| About 內文、聯絡、側欄和工具                         | [About 字典](/zh-hant/blog/config-about/)                | [頁面與功能自訂](/zh-hant/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                                 |
| About 終端機、指令提示與唯讀閱讀器                   | [終端機字典](/zh-hant/blog/config-terminal/)             | [頁面與功能自訂](/zh-hant/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                                 |
| Decoder 頁面與閱讀卡片                               | [Decoder 字典](/zh-hant/blog/config-decoder/)            | [頁面與功能自訂](/zh-hant/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                                 |
| 音樂播放器                                           | [音樂播放器字典](/zh-hant/blog/config-music/)            | [音樂設定](/zh-hant/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                                       |
| Giscus 評論和多語言討論共享                          | [Giscus 評論字典](/zh-hant/blog/config-comments/)        | [讓讀者留下評論](/zh-hant/blog/starter-guide-4-giscus-comments/)                                                                                  |
| 語言啟停、地址、介面翻譯和回退                       | [語言設定字典](/zh-hant/blog/config-languages/)          | [多語言教學](/zh-hant/blog/starter-guide-languages/)                                                                                              |
| 搜尋與內容發現                                       | [搜尋設定字典](/zh-hant/blog/config-search/)             | [寫文章](/zh-hant/blog/starter-guide-2-languages-and-routing/)、[部署](/zh-hant/blog/starter-guide-deployment/)                                   |
| GA4 瀏覽統計、AI 閱讀補充說明                        | [GA4 與 AI 補充字典](/zh-hant/blog/config-analytics-ai/) | [發佈到自己的網域](/zh-hant/blog/starter-guide-deployment/)                                                                                       |

同一個欄位會有一個主要說明位置；其他模組引用它時提供連結。例如首頁使用碎片開關，但這個開關還影響完整碎片列表，不能當成首頁專用欄位。

## 按完整設定路徑查找

下面按目前公開設定型別提供路徑索引，包括目前未使用的欄位。點選進入主要說明位置；跨頁面的用法差異在對應模組交叉引用。`<locale>` 是佔位，換成 zh、en 等實際程式碼。文章 frontmatter 另列，不混入 site.config 路徑。

| 完整路徑                                                              | 查閱位置                                                                     |
| --------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `i18n.locales.<locale>.site.homeTitle`                                | [首頁大標題](/zh-hant/blog/config-home/#home-title)                          |
| `i18n.locales.<locale>.site.hero`                                     | [首頁可見介紹](/zh-hant/blog/config-home/#home-hero)                         |
| `i18n.locales.<locale>.messages.siteDescription`                      | [首頁中繼描述](/zh-hant/blog/config-home/#home-description)                  |
| `theme.homeLatestCount`                                               | [最新文章數量](/zh-hant/blog/config-home/#latest-count)                      |
| `theme.home.showInitialize`                                           | [啟動提示開關](/zh-hant/blog/config-home/#startup-switches)                  |
| `theme.home.showFollow`                                               | [啟動提示開關](/zh-hant/blog/config-home/#startup-switches)                  |
| `theme.home.showTrace`                                                | [啟動提示開關](/zh-hant/blog/config-home/#startup-switches)                  |
| `theme.effects.enableHomePassage`                                     | [點選穿越](/zh-hant/blog/config-home/#home-passage)                          |
| `i18n.locales.<locale>.messages.home.latest`                          | [首頁介面文字](/zh-hant/blog/config-home/#home-messages)                     |
| `i18n.locales.<locale>.messages.home.viewAll`                         | [首頁介面文字](/zh-hant/blog/config-home/#home-messages)                     |
| `i18n.locales.<locale>.messages.home.noPosts`                         | [首頁介面文字](/zh-hant/blog/config-home/#home-messages)                     |
| `i18n.locales.<locale>.messages.home.openDoor`                        | [首頁介面文字](/zh-hant/blog/config-home/#home-messages)                     |
| `i18n.locales.<locale>.messages.home.transmission`                    | [寬屏終端機文字](/zh-hant/blog/config-home/#home-transmission)               |
| `i18n.locales.<locale>.messages.home.hero`                            | [介紹的備用文字](/zh-hant/blog/config-home/#message-hero)                    |
| `theme.fragments.enabled`                                             | [碎片總開關](/zh-hant/blog/config-fragments/#enabled)                        |
| `i18n.locales.<locale>.messages.blog.allPosts`                        | [文章與標籤共享入口](/zh-hant/blog/config-blog-list/#tag-messages)           |
| `i18n.locales.<locale>.messages.fragments.title`                      | [碎片介面文字](/zh-hant/blog/config-fragments/#fragment-messages)            |
| `i18n.locales.<locale>.messages.fragments.close`                      | [碎片介面文字](/zh-hant/blog/config-fragments/#fragment-messages)            |
| `i18n.locales.<locale>.messages.siteTitle`                            | [目前未使用的標題欄位](/zh-hant/blog/config-site-chrome/#legacy-site-title)  |
| `theme.blogPageSize`                                                  | [每頁文章數](/zh-hant/blog/config-blog-list/#page-size)                      |
| `theme.tags.enabled`                                                  | [標籤開關](/zh-hant/blog/config-blog-list/#tags-enabled)                     |
| `theme.pagination.windowSize`                                         | [頁碼視窗](/zh-hant/blog/config-blog-list/#pagination-window)                |
| `theme.pagination.showJumpThreshold`                                  | [跳頁臨界值](/zh-hant/blog/config-blog-list/#jump-threshold)                 |
| `theme.pagination.jump.enabled`                                       | [跳頁開關](/zh-hant/blog/config-blog-list/#jump-enabled)                     |
| `theme.pagination.jump.enterToGo`                                     | [Enter跳頁](/zh-hant/blog/config-blog-list/#jump-enter)                      |
| `theme.pagination.style.enabled`                                      | [分頁樣式開關](/zh-hant/blog/config-blog-list/#style-enabled)                |
| `theme.pagination.style.mode`                                         | [變體策略](/zh-hant/blog/config-blog-list/#style-mode)                       |
| `theme.pagination.style.variants`                                     | [變體數量](/zh-hant/blog/config-blog-list/#style-variants)                   |
| `theme.pagination.style.fixedVariant`                                 | [固定變體](/zh-hant/blog/config-blog-list/#style-fixed)                      |
| `i18n.locales.<locale>.messages.blog.title`                           | [列表標題與描述](/zh-hant/blog/config-blog-list/#archive-messages)           |
| `i18n.locales.<locale>.messages.blog.pageTitle`                       | [列表標題與描述](/zh-hant/blog/config-blog-list/#archive-messages)           |
| `i18n.locales.<locale>.messages.blog.archiveDescription`              | [列表標題與描述](/zh-hant/blog/config-blog-list/#archive-messages)           |
| `i18n.locales.<locale>.messages.blog.pageDescription`                 | [列表標題與描述](/zh-hant/blog/config-blog-list/#archive-messages)           |
| `i18n.locales.<locale>.messages.blog.previous`                        | [分頁文字](/zh-hant/blog/config-blog-list/#pagination-messages)              |
| `i18n.locales.<locale>.messages.blog.next`                            | [分頁文字](/zh-hant/blog/config-blog-list/#pagination-messages)              |
| `i18n.locales.<locale>.messages.blog.paginationAria`                  | [分頁文字](/zh-hant/blog/config-blog-list/#pagination-messages)              |
| `i18n.locales.<locale>.messages.blog.jumpTo`                          | [分頁文字](/zh-hant/blog/config-blog-list/#pagination-messages)              |
| `i18n.locales.<locale>.messages.blog.jumpInputLabel`                  | [分頁文字](/zh-hant/blog/config-blog-list/#pagination-messages)              |
| `i18n.locales.<locale>.messages.blog.jumpGo`                          | [分頁文字](/zh-hant/blog/config-blog-list/#pagination-messages)              |
| `i18n.locales.<locale>.messages.blog.tags`                            | [標籤文字](/zh-hant/blog/config-blog-list/#tag-messages)                     |
| `i18n.locales.<locale>.messages.blog.noTags`                          | [標籤文字](/zh-hant/blog/config-blog-list/#tag-messages)                     |
| `i18n.locales.<locale>.messages.blog.taggedPosts`                     | [標籤文字](/zh-hant/blog/config-blog-list/#tag-messages)                     |
| `theme.toc.enabled`                                                   | [文章功能開關](/zh-hant/blog/config-article/#feature-switches)               |
| `theme.math.enabled`                                                  | [文章功能開關](/zh-hant/blog/config-article/#feature-switches)               |
| `theme.effects.enableRedQueen`                                        | [文章功能開關](/zh-hant/blog/config-article/#feature-switches)               |
| `theme.search.enabled`                                                | [站內搜尋開關](/zh-hant/blog/config-search/#enabled)                         |
| `theme.socialImage.enabled`                                           | [文章功能開關](/zh-hant/blog/config-article/#feature-switches)               |
| `site.author`                                                         | [網站與公共介面設定](/zh-hant/blog/config-site-chrome/#identity)             |
| `site.ogImage`                                                        | [網站與公共介面設定](/zh-hant/blog/config-site-chrome/#identity)             |
| `theme.enableAboutPage`                                               | [About 頁面開關](/zh-hant/blog/config-about/#page-enabled)                   |
| `theme.footer.showCredits`                                            | [網站與公共介面設定](/zh-hant/blog/config-site-chrome/#footer)               |
| `theme.comments.enabled`                                              | [Giscus 評論設定](/zh-hant/blog/config-comments/#controls)                   |
| `i18n.locales.<locale>.messages.blog.rqBadge`                         | [文章介面文字](/zh-hant/blog/config-article/#article-messages)               |
| `i18n.locales.<locale>.messages.blog.rqReplayAria`                    | [文章介面文字](/zh-hant/blog/config-article/#article-messages)               |
| `i18n.locales.<locale>.messages.blog.backToTop`                       | [文章介面文字](/zh-hant/blog/config-article/#article-messages)               |
| `i18n.locales.<locale>.messages.blog.toastP10`                        | [文章介面文字](/zh-hant/blog/config-article/#article-messages)               |
| `i18n.locales.<locale>.messages.blog.toastP30`                        | [文章介面文字](/zh-hant/blog/config-article/#article-messages)               |
| `i18n.locales.<locale>.messages.blog.toastP60`                        | [文章介面文字](/zh-hant/blog/config-article/#article-messages)               |
| `i18n.locales.<locale>.messages.blog.toastDone`                       | [文章介面文字](/zh-hant/blog/config-article/#article-messages)               |
| `i18n.locales.<locale>.messages.blog.metaPublished`                   | [文章介面文字](/zh-hant/blog/config-article/#article-messages)               |
| `i18n.locales.<locale>.messages.blog.metaAuthor`                      | [文章介面文字](/zh-hant/blog/config-article/#article-messages)               |
| `i18n.locales.<locale>.messages.blog.metaUpdated`                     | [文章介面文字](/zh-hant/blog/config-article/#article-messages)               |
| `i18n.locales.<locale>.messages.blog.systemStatusAria`                | [文章介面文字](/zh-hant/blog/config-article/#article-messages)               |
| `i18n.locales.<locale>.messages.blog.systemModelLabel`                | [文章介面文字](/zh-hant/blog/config-article/#article-messages)               |
| `i18n.locales.<locale>.messages.blog.systemModeLabel`                 | [文章介面文字](/zh-hant/blog/config-article/#article-messages)               |
| `i18n.locales.<locale>.messages.blog.systemStateLabel`                | [文章介面文字](/zh-hant/blog/config-article/#article-messages)               |
| `i18n.locales.<locale>.messages.blog.promptContextLabel`              | [文章介面文字](/zh-hant/blog/config-article/#article-messages)               |
| `i18n.locales.<locale>.messages.blog.heroMonitor`                     | [文章介面文字](/zh-hant/blog/config-article/#article-messages)               |
| `i18n.locales.<locale>.messages.blog.heroSignalSync`                  | [文章介面文字](/zh-hant/blog/config-article/#article-messages)               |
| `i18n.locales.<locale>.messages.blog.heroModelOnline`                 | [文章介面文字](/zh-hant/blog/config-article/#article-messages)               |
| `i18n.locales.<locale>.messages.blog.toc`                             | [文章介面文字](/zh-hant/blog/config-article/#article-messages)               |
| `i18n.locales.<locale>.messages.blog.responseOutput`                  | [文章介面文字](/zh-hant/blog/config-article/#article-messages)               |
| `i18n.locales.<locale>.messages.blog.statsWords`                      | [文章介面文字](/zh-hant/blog/config-article/#article-messages)               |
| `i18n.locales.<locale>.messages.blog.statsTokens`                     | [文章介面文字](/zh-hant/blog/config-article/#article-messages)               |
| `i18n.locales.<locale>.messages.blog.copySectionLink`                 | [文章介面文字](/zh-hant/blog/config-article/#article-messages)               |
| `i18n.locales.<locale>.messages.blog.regenerate`                      | [文章介面文字](/zh-hant/blog/config-article/#article-messages)               |
| `i18n.locales.<locale>.messages.blog.relatedAria`                     | [文章介面文字](/zh-hant/blog/config-article/#article-messages)               |
| `i18n.locales.<locale>.messages.blog.related`                         | [文章介面文字](/zh-hant/blog/config-article/#article-messages)               |
| `i18n.locales.<locale>.messages.blog.backToBlogAria`                  | [文章介面文字](/zh-hant/blog/config-article/#article-messages)               |
| `i18n.locales.<locale>.messages.blog.backToBlog`                      | [文章介面文字](/zh-hant/blog/config-article/#article-messages)               |
| `i18n.locales.<locale>.messages.blog.comments`                        | [文章介面文字](/zh-hant/blog/config-article/#article-messages)               |
| `i18n.locales.<locale>.messages.blog.metaReadMinutes`                 | [文章介面文字（目前未使用）](/zh-hant/blog/config-article/#article-messages) |
| `i18n.locales.<locale>.messages.blog.latencyLabel`                    | [文章介面文字（目前未使用）](/zh-hant/blog/config-article/#article-messages) |
| `i18n.locales.<locale>.messages.blog.confidenceLabel`                 | [文章介面文字（目前未使用）](/zh-hant/blog/config-article/#article-messages) |
| `i18n.locales.<locale>.messages.codeCopy.copy`                        | [閱讀互動文字](/zh-hant/blog/config-article/#interaction-messages)           |
| `i18n.locales.<locale>.messages.codeCopy.copied`                      | [閱讀互動文字](/zh-hant/blog/config-article/#interaction-messages)           |
| `i18n.locales.<locale>.messages.codeCopy.failed`                      | [閱讀互動文字](/zh-hant/blog/config-article/#interaction-messages)           |
| `i18n.locales.<locale>.messages.imagePreview.open`                    | [閱讀互動文字](/zh-hant/blog/config-article/#interaction-messages)           |
| `i18n.locales.<locale>.messages.imagePreview.close`                   | [閱讀互動文字](/zh-hant/blog/config-article/#interaction-messages)           |
| `theme.fragments.pageSize`                                            | [碎片每頁條數](/zh-hant/blog/config-fragments/#page-size)                    |
| `theme.fragments.comments.enabled`                                    | [碎片評論](/zh-hant/blog/config-fragments/#comments-enabled)                 |
| `i18n.locales.<locale>.messages.fragments.description`                | [碎片介面文字](/zh-hant/blog/config-fragments/#fragment-messages)            |
| `i18n.locales.<locale>.messages.fragments.empty`                      | [碎片介面文字](/zh-hant/blog/config-fragments/#fragment-messages)            |
| `i18n.locales.<locale>.messages.fragments.comments`                   | [碎片介面文字](/zh-hant/blog/config-fragments/#fragment-messages)            |
| `i18n.locales.<locale>.messages.fragments.previous`                   | [碎片文字（目前未使用）](/zh-hant/blog/config-fragments/#fragment-messages)  |
| `i18n.locales.<locale>.messages.fragments.next`                       | [碎片文字（目前未使用）](/zh-hant/blog/config-fragments/#fragment-messages)  |
| `i18n.locales.<locale>.messages.fragments.loading`                    | [碎片介面文字](/zh-hant/blog/config-fragments/#fragment-messages)            |
| `i18n.locales.<locale>.messages.fragments.error`                      | [碎片介面文字](/zh-hant/blog/config-fragments/#fragment-messages)            |
| `i18n.locales.<locale>.messages.fragments.retry`                      | [碎片介面文字](/zh-hant/blog/config-fragments/#fragment-messages)            |
| `i18n.locales.<locale>.messages.fragments.copyLink`                   | [碎片介面文字](/zh-hant/blog/config-fragments/#fragment-messages)            |
| `i18n.locales.<locale>.messages.fragments.linkCopied`                 | [碎片介面文字](/zh-hant/blog/config-fragments/#fragment-messages)            |
| `i18n.locales.<locale>.messages.fragments.copyLinkFailed`             | [碎片介面文字](/zh-hant/blog/config-fragments/#fragment-messages)            |
| `i18n.locales.<locale>.messages.fragments.notFound`                   | [碎片介面文字](/zh-hant/blog/config-fragments/#fragment-messages)            |
| `i18n.locales.<locale>.messages.fragments.indexError`                 | [碎片介面文字](/zh-hant/blog/config-fragments/#fragment-messages)            |
| `theme.comments.repo`                                                 | [Giscus 評論設定](/zh-hant/blog/config-comments/#connection)                 |
| `theme.comments.repoId`                                               | [Giscus 評論設定](/zh-hant/blog/config-comments/#connection)                 |
| `theme.comments.category`                                             | [Giscus 評論設定](/zh-hant/blog/config-comments/#connection)                 |
| `theme.comments.categoryId`                                           | [Giscus 評論設定](/zh-hant/blog/config-comments/#connection)                 |
| `i18n.locales.<locale>.about.metaLine`                                | [About 內文](/zh-hant/blog/config-about/#body-fields)                        |
| `i18n.locales.<locale>.about.sections.who`                            | [About 內文](/zh-hant/blog/config-about/#body-fields)                        |
| `i18n.locales.<locale>.about.sections.what`                           | [About 內文](/zh-hant/blog/config-about/#body-fields)                        |
| `i18n.locales.<locale>.about.sections.ethos`                          | [About 內文](/zh-hant/blog/config-about/#body-fields)                        |
| `i18n.locales.<locale>.about.sections.now`                            | [About 內文](/zh-hant/blog/config-about/#body-fields)                        |
| `i18n.locales.<locale>.about.sections.contactLead`                    | [About 內文](/zh-hant/blog/config-about/#body-fields)                        |
| `i18n.locales.<locale>.about.sections.signature`                      | [About 內文](/zh-hant/blog/config-about/#body-fields)                        |
| `i18n.locales.<locale>.about.contact.email`                           | [About 聯絡](/zh-hant/blog/config-about/#contact-fields)                     |
| `i18n.locales.<locale>.about.contact.githubUrl`                       | [About 聯絡](/zh-hant/blog/config-about/#contact-fields)                     |
| `i18n.locales.<locale>.about.contact.githubLabel`                     | [About 聯絡](/zh-hant/blog/config-about/#contact-fields)                     |
| `i18n.locales.<locale>.about.sidebar.dlData`                          | [About 工具入口](/zh-hant/blog/config-about/#tool-fields)                    |
| `i18n.locales.<locale>.about.sidebar.ai`                              | [About 工具入口](/zh-hant/blog/config-about/#tool-fields)                    |
| `i18n.locales.<locale>.about.sidebar.decryptor`                       | [About 工具入口](/zh-hant/blog/config-about/#tool-fields)                    |
| `i18n.locales.<locale>.about.sidebar.help`                            | [About 工具入口](/zh-hant/blog/config-about/#tool-fields)                    |
| `i18n.locales.<locale>.about.sidebar.allScripts`                      | [About 工具入口](/zh-hant/blog/config-about/#tool-fields)                    |
| `i18n.locales.<locale>.about.scriptsPath`                             | [About 工具入口](/zh-hant/blog/config-about/#tool-fields)                    |
| `i18n.locales.<locale>.about.labels.modalOutput`                      | [About 通用文字（注意生效狀態）](/zh-hant/blog/config-about/#label-fields)   |
| `i18n.locales.<locale>.about.labels.modalClose`                       | [About 通用文字](/zh-hant/blog/config-about/#label-fields)                   |
| `i18n.locales.<locale>.about.labels.responseOutput`                   | [About 通用文字](/zh-hant/blog/config-about/#label-fields)                   |
| `i18n.locales.<locale>.about.labels.contactEmailLead`                 | [About 通用文字](/zh-hant/blog/config-about/#label-fields)                   |
| `i18n.locales.<locale>.about.labels.contactConnectLead`               | [About 通用文字](/zh-hant/blog/config-about/#label-fields)                   |
| `i18n.locales.<locale>.about.labels.backToTop`                        | [About 通用文字](/zh-hant/blog/config-about/#label-fields)                   |
| `i18n.locales.<locale>.about.labels.quickAccess`                      | [About 通用文字](/zh-hant/blog/config-about/#label-fields)                   |
| `i18n.locales.<locale>.about.labels.contactEmailLabel`                | [About 通用文字](/zh-hant/blog/config-about/#label-fields)                   |
| `i18n.locales.<locale>.about.modals.dlData.title`                     | [About 工具彈窗](/zh-hant/blog/config-about/#modal-fields)                   |
| `i18n.locales.<locale>.about.modals.dlData.subtitle`                  | [About 工具彈窗](/zh-hant/blog/config-about/#modal-fields)                   |
| `i18n.locales.<locale>.about.modals.ai.title`                         | [About 工具彈窗](/zh-hant/blog/config-about/#modal-fields)                   |
| `i18n.locales.<locale>.about.modals.ai.lines`                         | [About 工具彈窗](/zh-hant/blog/config-about/#modal-fields)                   |
| `i18n.locales.<locale>.about.modals.decryptor.title`                  | [About 工具彈窗](/zh-hant/blog/config-about/#modal-fields)                   |
| `i18n.locales.<locale>.about.modals.decryptor.header`                 | [About 工具彈窗（注意生效狀態）](/zh-hant/blog/config-about/#modal-fields)   |
| `i18n.locales.<locale>.about.modals.decryptor.keysLabel`              | [About 工具彈窗（注意生效狀態）](/zh-hant/blog/config-about/#modal-fields)   |
| `i18n.locales.<locale>.about.modals.decryptor.currentPassphraseLabel` | [About 工具彈窗（注意生效狀態）](/zh-hant/blog/config-about/#modal-fields)   |
| `i18n.locales.<locale>.about.modals.decryptor.masterKeyLabel`         | [About 工具彈窗（注意生效狀態）](/zh-hant/blog/config-about/#modal-fields)   |
| `i18n.locales.<locale>.about.modals.decryptor.transientKeyLabel`      | [About 工具彈窗（注意生效狀態）](/zh-hant/blog/config-about/#modal-fields)   |
| `i18n.locales.<locale>.about.modals.help.title`                       | [About 工具彈窗](/zh-hant/blog/config-about/#modal-fields)                   |
| `i18n.locales.<locale>.about.modals.help.statsLabel`                  | [About 工具彈窗](/zh-hant/blog/config-about/#modal-fields)                   |
| `i18n.locales.<locale>.about.modals.help.typedPrefix`                 | [About 工具彈窗](/zh-hant/blog/config-about/#modal-fields)                   |
| `i18n.locales.<locale>.about.modals.help.typedSuffix`                 | [About 工具彈窗](/zh-hant/blog/config-about/#modal-fields)                   |
| `i18n.locales.<locale>.about.modals.allScripts.title`                 | [About 工具彈窗](/zh-hant/blog/config-about/#modal-fields)                   |
| `i18n.locales.<locale>.about.effects.backgroundLines`                 | [About 效果（注意生效狀態）](/zh-hant/blog/config-about/#effect-fields)      |
| `i18n.locales.<locale>.about.effects.scrollToasts.p30`                | [About 效果](/zh-hant/blog/config-about/#effect-fields)                      |
| `i18n.locales.<locale>.about.effects.scrollToasts.p60`                | [About 效果](/zh-hant/blog/config-about/#effect-fields)                      |
| `i18n.locales.<locale>.about.effects.scrollToasts.p90`                | [About 效果](/zh-hant/blog/config-about/#effect-fields)                      |
| `i18n.locales.<locale>.messages.about.title`                          | [About 及共用控制項文字](/zh-hant/blog/config-about/#about-messages)         |
| `i18n.locales.<locale>.messages.about.description`                    | [About 及共用控制項文字](/zh-hant/blog/config-about/#about-messages)         |
| `i18n.locales.<locale>.messages.about.who`                            | [About 及共用控制項文字](/zh-hant/blog/config-about/#about-messages)         |
| `i18n.locales.<locale>.messages.about.what`                           | [About 及共用控制項文字](/zh-hant/blog/config-about/#about-messages)         |
| `i18n.locales.<locale>.messages.about.ethos`                          | [About 及共用控制項文字](/zh-hant/blog/config-about/#about-messages)         |
| `i18n.locales.<locale>.messages.about.now`                            | [About 及共用控制項文字](/zh-hant/blog/config-about/#about-messages)         |
| `i18n.locales.<locale>.messages.about.contact`                        | [About 及共用控制項文字](/zh-hant/blog/config-about/#about-messages)         |
| `i18n.locales.<locale>.messages.about.regenerate`                     | [About 及共用控制項文字](/zh-hant/blog/config-about/#about-messages)         |
| `i18n.locales.<locale>.messages.windowControls.collapse`              | [About 及共用控制項文字](/zh-hant/blog/config-about/#about-messages)         |
| `i18n.locales.<locale>.messages.windowControls.expand`                | [About 及共用控制項文字](/zh-hant/blog/config-about/#about-messages)         |
| `i18n.locales.<locale>.messages.windowControls.restore`               | [About 及共用控制項文字](/zh-hant/blog/config-about/#about-messages)         |
| `i18n.locales.<locale>.messages.windowControls.fullscreen`            | [About 及共用控制項文字](/zh-hant/blog/config-about/#about-messages)         |
| `i18n.locales.<locale>.messages.scriptFolders.copyTitle`              | [About 及共用控制項文字](/zh-hant/blog/config-about/#about-messages)         |
| `i18n.locales.<locale>.messages.scriptFolders.copied`                 | [About 及共用控制項文字](/zh-hant/blog/config-about/#about-messages)         |
| `i18n.locales.<locale>.messages.scriptFolders.failed`                 | [About 及共用控制項文字](/zh-hant/blog/config-about/#about-messages)         |
| `theme.enableDecoderPage`                                             | [Decoder 頁面開關](/zh-hant/blog/config-decoder/#page-enabled)               |
| `i18n.locales.<locale>.messages.nav.about`                            | [網站與公共介面設定](/zh-hant/blog/config-site-chrome/#chrome-messages)      |
| `i18n.locales.<locale>.messages.decoder.input`                        | [Decoder 文字](/zh-hant/blog/config-decoder/#text-messages)                  |
| `i18n.locales.<locale>.messages.decoder.placeholder`                  | [Decoder 文字](/zh-hant/blog/config-decoder/#text-messages)                  |
| `i18n.locales.<locale>.messages.decoder.format`                       | [Decoder 文字](/zh-hant/blog/config-decoder/#text-messages)                  |
| `i18n.locales.<locale>.messages.decoder.auto`                         | [Decoder 文字](/zh-hant/blog/config-decoder/#text-messages)                  |
| `i18n.locales.<locale>.messages.decoder.decode`                       | [Decoder 文字](/zh-hant/blog/config-decoder/#text-messages)                  |
| `i18n.locales.<locale>.messages.decoder.clear`                        | [Decoder 文字](/zh-hant/blog/config-decoder/#text-messages)                  |
| `i18n.locales.<locale>.messages.decoder.copy`                         | [Decoder 文字](/zh-hant/blog/config-decoder/#text-messages)                  |
| `i18n.locales.<locale>.messages.decoder.reuse`                        | [Decoder 文字](/zh-hant/blog/config-decoder/#text-messages)                  |
| `i18n.locales.<locale>.messages.decoder.supported`                    | [Decoder 文字](/zh-hant/blog/config-decoder/#text-messages)                  |
| `i18n.locales.<locale>.messages.decoder.html`                         | [Decoder 文字](/zh-hant/blog/config-decoder/#text-messages)                  |
| `i18n.locales.<locale>.messages.decoder.unicode`                      | [Decoder 文字](/zh-hant/blog/config-decoder/#text-messages)                  |
| `i18n.locales.<locale>.messages.decoder.jwtWarning`                   | [Decoder 文字](/zh-hant/blog/config-decoder/#text-messages)                  |
| `i18n.locales.<locale>.messages.decoder.copied`                       | [Decoder 文字](/zh-hant/blog/config-decoder/#text-messages)                  |
| `i18n.locales.<locale>.messages.decoder.copyFailed`                   | [Decoder 文字](/zh-hant/blog/config-decoder/#text-messages)                  |
| `i18n.locales.<locale>.messages.decoder.output`                       | [Decoder 文字](/zh-hant/blog/config-decoder/#text-messages)                  |
| `i18n.locales.<locale>.messages.decoder.local`                        | [Decoder 文字](/zh-hant/blog/config-decoder/#text-messages)                  |
| `i18n.locales.<locale>.messages.decoder.ready`                        | [Decoder 文字](/zh-hant/blog/config-decoder/#text-messages)                  |
| `i18n.locales.<locale>.messages.decoder.running`                      | [Decoder 文字](/zh-hant/blog/config-decoder/#text-messages)                  |
| `i18n.locales.<locale>.messages.decoder.done`                         | [Decoder 文字](/zh-hant/blog/config-decoder/#text-messages)                  |
| `i18n.locales.<locale>.messages.decoder.empty`                        | [Decoder 文字](/zh-hant/blog/config-decoder/#text-messages)                  |
| `i18n.locales.<locale>.messages.decoder.tooLong`                      | [Decoder 文字](/zh-hant/blog/config-decoder/#text-messages)                  |
| `i18n.locales.<locale>.messages.decoder.invalid`                      | [Decoder 文字](/zh-hant/blog/config-decoder/#text-messages)                  |
| `i18n.locales.<locale>.messages.decoder.binary`                       | [Decoder 文字](/zh-hant/blog/config-decoder/#text-messages)                  |
| `i18n.locales.<locale>.messages.decoder.unknown`                      | [Decoder 文字](/zh-hant/blog/config-decoder/#text-messages)                  |
| `i18n.locales.<locale>.messages.decoder.ambiguous`                    | [Decoder 文字](/zh-hant/blog/config-decoder/#text-messages)                  |
| `i18n.locales.<locale>.messages.decoder.example`                      | [Decoder 文字](/zh-hant/blog/config-decoder/#text-messages)                  |
| `i18n.locales.<locale>.messages.decoderPage.description`              | [Decoder 文字](/zh-hant/blog/config-decoder/#page-messages)                  |
| `i18n.locales.<locale>.messages.decoderPage.fullTool`                 | [Decoder 文字](/zh-hant/blog/config-decoder/#page-messages)                  |
| `i18n.locales.<locale>.messages.decoderPage.task`                     | [Decoder 文字](/zh-hant/blog/config-decoder/#page-messages)                  |
| `i18n.locales.<locale>.messages.decoderPage.textTask`                 | [Decoder 文字](/zh-hant/blog/config-decoder/#page-messages)                  |
| `i18n.locales.<locale>.messages.decoderPage.callTask`                 | [Decoder 文字](/zh-hant/blog/config-decoder/#page-messages)                  |
| `i18n.locales.<locale>.messages.decoderPage.addressTask`              | [Decoder 文字](/zh-hant/blog/config-decoder/#page-messages)                  |
| `i18n.locales.<locale>.messages.decoderPage.addressHint`              | [Decoder 文字](/zh-hant/blog/config-decoder/#page-messages)                  |
| `i18n.locales.<locale>.messages.decoderPage.chain`                    | [Decoder 文字](/zh-hant/blog/config-decoder/#page-messages)                  |
| `i18n.locales.<locale>.messages.decoderPage.decimals`                 | [Decoder 文字](/zh-hant/blog/config-decoder/#page-messages)                  |
| `i18n.locales.<locale>.messages.decoderPage.precisionHint`            | [Decoder 文字](/zh-hant/blog/config-decoder/#page-messages)                  |
| `i18n.locales.<locale>.messages.decoderPage.network`                  | [Decoder 文字](/zh-hant/blog/config-decoder/#page-messages)                  |
| `i18n.locales.<locale>.messages.decoderPage.history`                  | [Decoder 文字](/zh-hant/blog/config-decoder/#page-messages)                  |
| `i18n.locales.<locale>.messages.decoderPage.back`                     | [Decoder 文字](/zh-hant/blog/config-decoder/#page-messages)                  |
| `i18n.locales.<locale>.messages.decoderPage.export`                   | [Decoder 文字](/zh-hant/blog/config-decoder/#page-messages)                  |
| `i18n.locales.<locale>.messages.decoderPage.limits`                   | [Decoder 文字](/zh-hant/blog/config-decoder/#page-messages)                  |
| `i18n.locales.<locale>.messages.decoderPage.callNotice`               | [Decoder 文字](/zh-hant/blog/config-decoder/#page-messages)                  |
| `i18n.locales.<locale>.messages.decoderPage.addressNotice`            | [Decoder 文字](/zh-hant/blog/config-decoder/#page-messages)                  |
| `i18n.locales.<locale>.messages.decoderPage.unsupported`              | [Decoder 文字](/zh-hant/blog/config-decoder/#page-messages)                  |
| `i18n.locales.<locale>.messages.decoderPage.checksum`                 | [Decoder 文字](/zh-hant/blog/config-decoder/#page-messages)                  |
| `i18n.locales.<locale>.messages.decoderPage.length`                   | [Decoder 文字](/zh-hant/blog/config-decoder/#page-messages)                  |
| `i18n.locales.<locale>.messages.decoderPage.wrongNetwork`             | [Decoder 文字](/zh-hant/blog/config-decoder/#page-messages)                  |
| `i18n.locales.<locale>.messages.decoderPage.stepLimit`                | [Decoder 文字](/zh-hant/blog/config-decoder/#page-messages)                  |
| `i18n.locales.<locale>.messages.decoderPage.budget`                   | [Decoder 文字](/zh-hant/blog/config-decoder/#page-messages)                  |
| `i18n.locales.<locale>.messages.decoderPage.addressParse`             | [Decoder 文字](/zh-hant/blog/config-decoder/#page-messages)                  |
| `i18n.locales.<locale>.messages.decoderPage.addressCheck`             | [Decoder 文字](/zh-hant/blog/config-decoder/#page-messages)                  |
| `i18n.locales.<locale>.messages.decoderPage.addressResult`            | [Decoder 文字](/zh-hant/blog/config-decoder/#page-messages)                  |
| `i18n.locales.<locale>.messages.decoderPage.callParse`                | [Decoder 文字](/zh-hant/blog/config-decoder/#page-messages)                  |
| `i18n.locales.<locale>.messages.decoderPage.rawOnly`                  | [Decoder 文字](/zh-hant/blog/config-decoder/#page-messages)                  |
| `i18n.locales.<locale>.messages.decoderPage.amountResult`             | [Decoder 文字](/zh-hant/blog/config-decoder/#page-messages)                  |
| `i18n.locales.<locale>.messages.decoderPage.inputHint`                | [Decoder 文字](/zh-hant/blog/config-decoder/#page-messages)                  |
| `i18n.locales.<locale>.messages.decoderPage.loadFailed`               | [Decoder 文字](/zh-hant/blog/config-decoder/#page-messages)                  |
| `i18n.locales.<locale>.messages.decoderPage.readings.tribute`         | [Decoder 閱讀區](/zh-hant/blog/config-decoder/#readings)                     |
| `i18n.locales.<locale>.messages.decoderPage.readings.links`           | [Decoder 閱讀區](/zh-hant/blog/config-decoder/#readings)                     |
| `i18n.locales.<locale>.messages.decoderPage.readings.links[].title`   | [Decoder 閱讀區](/zh-hant/blog/config-decoder/#readings)                     |
| `i18n.locales.<locale>.messages.decoderPage.readings.links[].href`    | [Decoder 閱讀區](/zh-hant/blog/config-decoder/#readings)                     |
| `i18n.locales.<locale>.messages.decoderPage.readings.links[].author`  | [Decoder 閱讀區](/zh-hant/blog/config-decoder/#readings)                     |
| `i18n.locales.<locale>.messages.decoderPage.readings.links[].year`    | [Decoder 閱讀區](/zh-hant/blog/config-decoder/#readings)                     |
| `i18n.locales.<locale>.messages.decoderPage.readings.links[].cover`   | [Decoder 閱讀區](/zh-hant/blog/config-decoder/#readings)                     |
| `theme.music.enabled`                                                 | [音樂播放器設定](/zh-hant/blog/config-music/#enabled)                        |
| `theme.music.tracks`                                                  | [音樂播放器設定](/zh-hant/blog/config-music/#tracks)                         |
| `theme.music.tracks[].title`                                          | [音樂播放器設定](/zh-hant/blog/config-music/#track-fields)                   |
| `theme.music.tracks[].artist`                                         | [音樂播放器設定](/zh-hant/blog/config-music/#track-fields)                   |
| `theme.music.tracks[].src`                                            | [音樂播放器設定](/zh-hant/blog/config-music/#track-fields)                   |
| `i18n.locales.<locale>.messages.music.label`                          | [音樂播放器文字](/zh-hant/blog/config-music/#music-messages)                 |
| `i18n.locales.<locale>.messages.music.play`                           | [音樂播放器文字](/zh-hant/blog/config-music/#music-messages)                 |
| `i18n.locales.<locale>.messages.music.pause`                          | [音樂播放器文字](/zh-hant/blog/config-music/#music-messages)                 |
| `i18n.locales.<locale>.messages.music.prev`                           | [音樂播放器文字](/zh-hant/blog/config-music/#music-messages)                 |
| `i18n.locales.<locale>.messages.music.next`                           | [音樂播放器文字](/zh-hant/blog/config-music/#music-messages)                 |
| `i18n.locales.<locale>.messages.music.open`                           | [音樂播放器文字](/zh-hant/blog/config-music/#music-messages)                 |
| `i18n.locales.<locale>.messages.music.close`                          | [音樂播放器文字](/zh-hant/blog/config-music/#music-messages)                 |
| `i18n.locales.<locale>.messages.music.progress`                       | [音樂播放器文字](/zh-hant/blog/config-music/#music-messages)                 |
| `i18n.locales.<locale>.messages.music.volume`                         | [音樂播放器文字](/zh-hant/blog/config-music/#music-messages)                 |
| `i18n.locales.<locale>.messages.music.queue`                          | [音樂播放器文字](/zh-hant/blog/config-music/#music-messages)                 |
| `i18n.locales.<locale>.messages.music.mute`                           | [音樂播放器文字](/zh-hant/blog/config-music/#music-messages)                 |
| `i18n.locales.<locale>.messages.music.unmute`                         | [音樂播放器文字](/zh-hant/blog/config-music/#music-messages)                 |
| `i18n.locales.<locale>.messages.music.idle`                           | [音樂播放器文字](/zh-hant/blog/config-music/#music-messages)                 |
| `i18n.locales.<locale>.messages.music.loading`                        | [音樂播放器文字](/zh-hant/blog/config-music/#music-messages)                 |
| `i18n.locales.<locale>.messages.music.playing`                        | [音樂播放器文字](/zh-hant/blog/config-music/#music-messages)                 |
| `i18n.locales.<locale>.messages.music.paused`                         | [音樂播放器文字](/zh-hant/blog/config-music/#music-messages)                 |
| `i18n.locales.<locale>.messages.music.blocked`                        | [音樂播放器文字](/zh-hant/blog/config-music/#music-messages)                 |
| `i18n.locales.<locale>.messages.music.error`                          | [音樂播放器文字](/zh-hant/blog/config-music/#music-messages)                 |
| `i18n.locales.<locale>.messages.music.noScript`                       | [音樂播放器文字](/zh-hant/blog/config-music/#music-messages)                 |
| `theme.comments.shareAcrossLocales`                                   | [Giscus 評論設定](/zh-hant/blog/config-comments/#sharing)                    |
| `theme.comments.mapping`                                              | [Giscus 評論設定](/zh-hant/blog/config-comments/#mapping)                    |
| `theme.comments.term`                                                 | [Giscus 評論設定](/zh-hant/blog/config-comments/#mapping)                    |
| `theme.comments.number`                                               | [Giscus 評論設定](/zh-hant/blog/config-comments/#mapping)                    |
| `theme.comments.strict`                                               | [Giscus 評論設定](/zh-hant/blog/config-comments/#mapping)                    |
| `theme.comments.reactionsEnabled`                                     | [Giscus 評論設定](/zh-hant/blog/config-comments/#appearance)                 |
| `theme.comments.emitMetadata`                                         | [Giscus 評論設定](/zh-hant/blog/config-comments/#appearance)                 |
| `theme.comments.inputPosition`                                        | [Giscus 評論設定](/zh-hant/blog/config-comments/#appearance)                 |
| `theme.comments.theme`                                                | [Giscus 評論設定](/zh-hant/blog/config-comments/#appearance)                 |
| `theme.comments.lang`                                                 | [Giscus 評論設定](/zh-hant/blog/config-comments/#appearance)                 |
| `theme.comments.loading`                                              | [Giscus 評論設定](/zh-hant/blog/config-comments/#appearance)                 |
| `theme.comments.crossorigin`                                          | [Giscus 評論設定](/zh-hant/blog/config-comments/#appearance)                 |
| `i18n.defaultLocale`                                                  | [語言與回退設定](/zh-hant/blog/config-languages/#registry)                   |
| `i18n.locales`                                                        | [語言與回退設定](/zh-hant/blog/config-languages/#registry)                   |
| `i18n.locales.<locale>`                                               | [語言與回退設定](/zh-hant/blog/config-languages/#registry)                   |
| `i18n.routing.defaultLocalePrefix`                                    | [語言與回退設定](/zh-hant/blog/config-languages/#routing)                    |
| `i18n.locales.<locale>.meta`                                          | [語言與回退設定](/zh-hant/blog/config-languages/#meta)                       |
| `i18n.locales.<locale>.meta.label`                                    | [語言與回退設定](/zh-hant/blog/config-languages/#meta)                       |
| `i18n.locales.<locale>.meta.hreflang`                                 | [語言與回退設定](/zh-hant/blog/config-languages/#meta)                       |
| `i18n.locales.<locale>.meta.ogLocale`                                 | [語言與回退設定](/zh-hant/blog/config-languages/#meta)                       |
| `i18n.locales.<locale>.meta.enabled`                                  | [語言與回退設定](/zh-hant/blog/config-languages/#meta)                       |
| `i18n.locales.<locale>.meta.fallback`                                 | [語言與回退設定](/zh-hant/blog/config-languages/#fallback)                   |
| `i18n.locales.<locale>.site`                                          | [語言與回退設定](/zh-hant/blog/config-languages/#overrides)                  |
| `i18n.locales.<locale>.messages`                                      | [語言與回退設定](/zh-hant/blog/config-languages/#overrides)                  |
| `i18n.locales.<locale>.about`                                         | [語言與回退設定](/zh-hant/blog/config-languages/#overrides)                  |
| `i18n.locales.<locale>.messages.langLabel`                            | [語言與回退設定](/zh-hant/blog/config-languages/#common-messages)            |
| `i18n.locales.<locale>.aiReadableContent`                             | [GA4 與 AI 閱讀補充](/zh-hant/blog/config-analytics-ai/#locale-supplement)   |
| `i18n.locales.<locale>.aiReadableContent.notes`                       | [GA4 與 AI 閱讀補充](/zh-hant/blog/config-analytics-ai/#locale-supplement)   |
| `i18n.locales.<locale>.aiReadableContent.links`                       | [GA4 與 AI 閱讀補充](/zh-hant/blog/config-analytics-ai/#locale-supplement)   |
| `i18n.locales.<locale>.aiReadableContent.links[].label`               | [GA4 與 AI 閱讀補充](/zh-hant/blog/config-analytics-ai/#locale-supplement)   |
| `i18n.locales.<locale>.aiReadableContent.links[].href`                | [GA4 與 AI 閱讀補充](/zh-hant/blog/config-analytics-ai/#locale-supplement)   |
| `i18n.locales.<locale>.messages.search.label`                         | [搜尋文字](/zh-hant/blog/config-search/#messages)                            |
| `i18n.locales.<locale>.messages.search.close`                         | [搜尋文字](/zh-hant/blog/config-search/#messages)                            |
| `i18n.locales.<locale>.messages.search.placeholder`                   | [搜尋文字](/zh-hant/blog/config-search/#messages)                            |
| `i18n.locales.<locale>.messages.search.hint`                          | [搜尋文字](/zh-hant/blog/config-search/#messages)                            |
| `i18n.locales.<locale>.messages.search.loading`                       | [搜尋文字](/zh-hant/blog/config-search/#messages)                            |
| `i18n.locales.<locale>.messages.search.empty`                         | [搜尋文字](/zh-hant/blog/config-search/#messages)                            |
| `i18n.locales.<locale>.messages.search.error`                         | [搜尋文字](/zh-hant/blog/config-search/#messages)                            |
| `i18n.locales.<locale>.messages.search.retry`                         | [搜尋文字](/zh-hant/blog/config-search/#messages)                            |
| `i18n.locales.<locale>.messages.search.more`                          | [搜尋文字](/zh-hant/blog/config-search/#messages)                            |
| `i18n.locales.<locale>.messages.search.results`                       | [搜尋文字](/zh-hant/blog/config-search/#messages)                            |
| `i18n.locales.<locale>.messages.search.dev`                           | [搜尋文字](/zh-hant/blog/config-search/#messages)                            |
| `analytics`                                                           | [GA4 與 AI 閱讀補充](/zh-hant/blog/config-analytics-ai/#analytics)           |
| `analytics.googleAnalyticsId`                                         | [GA4 與 AI 閱讀補充](/zh-hant/blog/config-analytics-ai/#analytics)           |
| `aiReadableContent`                                                   | [GA4 與 AI 閱讀補充](/zh-hant/blog/config-analytics-ai/#supplement)          |
| `aiReadableContent.notes`                                             | [GA4 與 AI 閱讀補充](/zh-hant/blog/config-analytics-ai/#supplement)          |
| `aiReadableContent.links`                                             | [GA4 與 AI 閱讀補充](/zh-hant/blog/config-analytics-ai/#supplement)          |
| `aiReadableContent.links[].label`                                     | [GA4 與 AI 閱讀補充](/zh-hant/blog/config-analytics-ai/#supplement)          |
| `aiReadableContent.links[].href`                                      | [GA4 與 AI 閱讀補充](/zh-hant/blog/config-analytics-ai/#supplement)          |
| `site.title`                                                          | [網站與公共介面設定](/zh-hant/blog/config-site-chrome/#identity)             |
| `site.description`                                                    | [網站與公共介面設定](/zh-hant/blog/config-site-chrome/#identity)             |
| `site.url`                                                            | [網站與公共介面設定](/zh-hant/blog/config-site-chrome/#identity)             |
| `site.tagline`                                                        | [網站與公共介面設定](/zh-hant/blog/config-site-chrome/#identity)             |
| `social.links`                                                        | [網站與公共介面設定](/zh-hant/blog/config-site-chrome/#social)               |
| `social.links[].href`                                                 | [網站與公共介面設定](/zh-hant/blog/config-site-chrome/#social-fields)        |
| `social.links[].label`                                                | [網站與公共介面設定](/zh-hant/blog/config-site-chrome/#social-fields)        |
| `social.links[].rel`                                                  | [網站與公共介面設定](/zh-hant/blog/config-site-chrome/#social-fields)        |
| `social.links[].icon`                                                 | [網站與公共介面設定](/zh-hant/blog/config-site-chrome/#social-fields)        |
| `social.links[].iconSrc`                                              | [網站與公共介面設定](/zh-hant/blog/config-site-chrome/#social-fields)        |
| `theme.footer.links`                                                  | [網站與公共介面設定](/zh-hant/blog/config-site-chrome/#footer)               |
| `theme.footer.links[].label`                                          | [網站與公共介面設定](/zh-hant/blog/config-site-chrome/#footer)               |
| `theme.footer.links[].href`                                           | [網站與公共介面設定](/zh-hant/blog/config-site-chrome/#footer)               |
| `i18n.locales.<locale>.messages.nav.home`                             | [網站與公共介面設定](/zh-hant/blog/config-site-chrome/#chrome-messages)      |
| `i18n.locales.<locale>.messages.nav.blog`                             | [網站與公共介面設定](/zh-hant/blog/config-site-chrome/#chrome-messages)      |
| `i18n.locales.<locale>.messages.nav.status`                           | [網站與公共介面設定](/zh-hant/blog/config-site-chrome/#chrome-messages)      |
| `i18n.locales.<locale>.messages.nav.statusAria`                       | [網站與公共介面設定](/zh-hant/blog/config-site-chrome/#chrome-messages)      |
| `i18n.locales.<locale>.messages.footer.theme`                         | [網站與公共介面設定](/zh-hant/blog/config-site-chrome/#chrome-messages)      |
| `i18n.locales.<locale>.messages.footer.builtWith`                     | [網站與公共介面設定](/zh-hant/blog/config-site-chrome/#chrome-messages)      |
| `i18n.locales.<locale>.messages.terminal.commandInput`                | [終端機文字](/zh-hant/blog/config-terminal/#messages)                        |
| `i18n.locales.<locale>.messages.terminal.hint`                        | [終端機文字](/zh-hant/blog/config-terminal/#messages)                        |
| `i18n.locales.<locale>.messages.terminal.help`                        | [終端機文字](/zh-hant/blog/config-terminal/#messages)                        |
| `i18n.locales.<locale>.messages.terminal.syntax`                      | [終端機文字](/zh-hant/blog/config-terminal/#messages)                        |
| `i18n.locales.<locale>.messages.terminal.usage`                       | [終端機文字](/zh-hant/blog/config-terminal/#messages)                        |
| `i18n.locales.<locale>.messages.terminal.unknown`                     | [終端機文字](/zh-hant/blog/config-terminal/#messages)                        |
| `i18n.locales.<locale>.messages.terminal.notFound`                    | [終端機文字](/zh-hant/blog/config-terminal/#messages)                        |
| `i18n.locales.<locale>.messages.terminal.notDirectory`                | [終端機文字](/zh-hant/blog/config-terminal/#messages)                        |
| `i18n.locales.<locale>.messages.terminal.isDirectory`                 | [終端機文字](/zh-hant/blog/config-terminal/#messages)                        |
| `i18n.locales.<locale>.messages.terminal.failed`                      | [終端機文字](/zh-hant/blog/config-terminal/#messages)                        |
| `i18n.locales.<locale>.messages.terminal.tooLarge`                    | [終端機文字](/zh-hant/blog/config-terminal/#messages)                        |
| `i18n.locales.<locale>.messages.terminal.empty`                       | [終端機文字](/zh-hant/blog/config-terminal/#messages)                        |
| `i18n.locales.<locale>.messages.terminal.loading`                     | [終端機文字](/zh-hant/blog/config-terminal/#messages)                        |
| `i18n.locales.<locale>.messages.terminal.readerTitle`                 | [終端機文字（目前未使用）](/zh-hant/blog/config-terminal/#messages)          |
| `i18n.locales.<locale>.messages.terminal.readerHint`                  | [終端機文字](/zh-hant/blog/config-terminal/#messages)                        |
| `i18n.locales.<locale>.messages.terminal.readerCommand`               | [終端機文字](/zh-hant/blog/config-terminal/#messages)                        |

## 文章欄位與網站設定分開查

文章 frontmatter 不放入上面的 site.config 路徑表：[內容、日期和圖片欄位](/zh-hant/blog/config-article/#frontmatter)、[OUTPUT 統計與狀態](/zh-hant/blog/config-article/#output-fields)、[相容及目前未使用欄位](/zh-hant/blog/config-article/#legacy-frontmatter)。

碎片的三個 frontmatter 欄位單獨見[碎片內容欄位](/zh-hant/blog/config-fragments/#content-fields)，不與文章欄位混用。

單篇文章是否進入站內搜尋見[search 欄位](/zh-hant/blog/config-search/#article-search)，它不是 site.config 欄位，也不是隱私開關。

## 怎麼閱讀欄位說明

每篇字典使用相同約定：給出完整路徑、型別、主題預設值、實際作用、限制、生效條件和範例。沒有消費程式碼的欄位不能因為型別仍接受就寫成有效功能。

| 狀態       | 含義                                                       |
| ---------- | ---------------------------------------------------------- |
| 生效       | 目前實作有對應作用                                         |
| 條件生效   | 需要開啟功能、滿足頁面條件，或不被更高優先級設定覆寫       |
| 目前未使用 | 型別接受，但目前沒有對應消費效果；不建議為了改變頁面填寫它 |
| 相容保留   | 有明確相容用途，具體說明保留什麼、目前是否顯示             |

主題預設值來自包內預設設定或內建文字；starter 可以覆寫它，demo 又有自己的個人設定。不要把展示站的作者、標題和歌單當作所有新部落格的預設值。

語言欄位的預設值隨語言和回退鏈變化。字典會注明「未設定」「目前語言的內建文字」或具體值；只給中文／英文例子時會標明範圍，不冒充所有語言的固定預設值。

## 設定寫在哪裡，怎麼合併？

範例中的設定片段合併到 `src/site.config.ts` 現有的 `defineThemeConfig({...})` 中；保留 import、export 和其他個人設定，不要在同一物件重複建立 theme 或 i18n。

物件遞歸合併，省略欄位繼續使用預設設定；陣列整體替換；undefined 覆寫會被跳過。空字串、空陣列和 false 的含義由欄位決定，不能統一理解成「恢復預設」。例如首頁 hero 的空字串是主動清空，homeTitle 的空白則繼續回退。

修改後先在 dev 中檢視對應頁面；環境覆寫變化需要重啟開發服務。正式網站要重新建置和部署，單獨保存本機設定不會修改線上頁面。

文章 frontmatter、Astro 設定和環境變數有不同的位置。字典遇到這些關聯會說明，但不會把它們冒充成 site.config 欄位。安裝與升級見[第一篇教學](/zh-hant/blog/starter-guide-1-configure-your-site/)，本機檢查和部署見[發佈教學](/zh-hant/blog/starter-guide-deployment/)。
