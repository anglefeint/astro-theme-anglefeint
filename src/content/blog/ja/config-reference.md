---
tags: ['anglefeint', 'config']
title: '設定リファレンス：変更したい項目はどこにある？'
subtitle: 'ページ、機能、完全な設定パスから site.config の項目を探します。'
description: '設定位置、既定値、有効状態を区別し、整理済みモジュールへの全項目索引を提供する Anglefeint 設定の総合案内。'
pubDate: '2026-11-13'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/hacker-01.webp'
---

**バージョンについて：** この辞典は現在のソースに基づきます。動きの軽減への即時追従、`blogPageSize` の厳密な検証、Fragments 無効時の画像分離は 0.36.1 以降の機能で、0.36.0 には含まれません。既定のインストールと CLI 用法は変わりません。

したいことが決まっていれば操作ガイドへ、意味・既定値・制約を調べるならこのリファレンスへ進んでください。どちらも現在のコードを基準とし、リポジトリの説明ファイルを先に読む必要はありません。

初めては[8本のガイド](/ja/blog/starter-guide-1-configure-your-site/#tutorial-order)を順に読めます。導入 → 執筆 → 画像 → Fragments → ページ・機能 → コメント → 多言語 → 配備です。任意機能を全部有効にする必要はありません。辞書は随時参照用で、全パス表の通読は不要です。

現在、[ホーム設定](/ja/blog/config-home/)、[Blog List とタグ設定](/ja/blog/config-blog-list/)、[記事詳細設定](/ja/blog/config-article/)、[Fragments 設定](/ja/blog/config-fragments/)、[About 設定](/ja/blog/config-about/)、[Decoder 設定](/ja/blog/config-decoder/)、[音楽設定](/ja/blog/config-music/)、[Giscus 設定](/ja/blog/config-comments/)、[言語と補完設定](/ja/blog/config-languages/)、[検索と発見設定](/ja/blog/config-search/)、[GA4 と AI 補足設定](/ja/blog/config-analytics-ai/)、[サイトと共通 UI 設定](/ja/blog/config-site-chrome/)および[ターミナル設定](/ja/blog/config-terminal/)。

## ページや機能から探す

| 変更したいもの                                               | 設定リファレンス                                  | 操作ガイド                                                                                                                            |
| ------------------------------------------------------------ | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| ホーム見出し、紹介、最新記事、起動案内、ターミナル、移動演出 | [ホーム辞書](/ja/blog/config-home/)               | [ページと機能](/ja/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                            |
| サイト名、ドメイン、ナビ、ソーシャル、フッター               | [サイト・公共 UI](/ja/blog/config-site-chrome/)   | [導入と情報](/ja/blog/starter-guide-1-configure-your-site/)、[ページ調整](/ja/blog/starter-guide-3-comments-about-and-theme-toggles/) |
| Blog List、タグ、ページ分割                                  | [一覧辞書](/ja/blog/config-blog-list/)            | [一覧とページ分割](/ja/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                        |
| 記事詳細、目次、数式、読書効果                               | [記事辞書](/ja/blog/config-article/)              | [最初の記事](/ja/blog/starter-guide-2-languages-and-routing/)                                                                         |
| Fragments 一覧・プレビュー                                   | [Fragments 辞書](/ja/blog/config-fragments/)      | [Fragment を投稿](/ja/blog/starter-guide-5-fragments/)                                                                                |
| About 本文・連絡先・側欄・ツール                             | [About 辞書](/ja/blog/config-about/)              | [ページと機能](/ja/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                            |
| About ターミナル・コマンド・リーダー                         | [ターミナル辞書](/ja/blog/config-terminal/)       | [ページと機能](/ja/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                            |
| Decoder と資料カード                                         | [Decoder 辞書](/ja/blog/config-decoder/)          | [ページと機能](/ja/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                            |
| 音楽プレーヤー                                               | [音楽辞書](/ja/blog/config-music/)                | [音楽設定](/ja/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                                |
| Giscus と言語間議論共有                                      | [Giscus 辞書](/ja/blog/config-comments/)          | [読者コメント](/ja/blog/starter-guide-4-giscus-comments/)                                                                             |
| 言語の有効・無効、URL、翻訳、補完                            | [言語辞書](/ja/blog/config-languages/)            | [多言語ガイド](/ja/blog/starter-guide-languages/)                                                                                     |
| 検索と発見                                                   | [検索辞書](/ja/blog/config-search/)               | [執筆](/ja/blog/starter-guide-2-languages-and-routing/)、[配備](/ja/blog/starter-guide-deployment/)                                   |
| GA4、AI 向け公開説明                                         | [GA4・AI 補足辞書](/ja/blog/config-analytics-ai/) | [独自ドメインへ公開](/ja/blog/starter-guide-deployment/)                                                                              |

各項目の主説明は1か所にまとめ、他モジュールはリンクします。たとえば Fragments スイッチはホームでも使いますが、全一覧にも影響するためホーム専用ではありません。

## 完全なパスから探す

現在の公開型に沿った索引で、未使用項目も含みます。リンク先が主説明で、ページごとの違いは各モジュールから参照します。`<语言>` は zh・en など実コードに置き換えます。記事 frontmatter は別記し、site.config に混ぜません。

| 完全パス                                                            | 参照先                                                                          |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `i18n.locales.<语言>.site.homeTitle`                                | [ホーム大見出し](/ja/blog/config-home/#home-title)                              |
| `i18n.locales.<语言>.site.hero`                                     | [ホーム表示紹介](/ja/blog/config-home/#home-hero)                               |
| `i18n.locales.<语言>.messages.siteDescription`                      | [ホームメタ説明](/ja/blog/config-home/#home-description)                        |
| `theme.homeLatestCount`                                             | [最新記事数](/ja/blog/config-home/#latest-count)                                |
| `theme.home.showInitialize`                                         | [起動案内スイッチ](/ja/blog/config-home/#startup-switches)                      |
| `theme.home.showFollow`                                             | [起動案内スイッチ](/ja/blog/config-home/#startup-switches)                      |
| `theme.home.showTrace`                                              | [起動案内スイッチ](/ja/blog/config-home/#startup-switches)                      |
| `theme.effects.enableHomePassage`                                   | [クリック移動演出](/ja/blog/config-home/#home-passage)                          |
| `i18n.locales.<语言>.messages.home.latest`                          | [ホーム UI 文面](/ja/blog/config-home/#home-messages)                           |
| `i18n.locales.<语言>.messages.home.viewAll`                         | [ホーム UI 文面](/ja/blog/config-home/#home-messages)                           |
| `i18n.locales.<语言>.messages.home.noPosts`                         | [ホーム UI 文面](/ja/blog/config-home/#home-messages)                           |
| `i18n.locales.<语言>.messages.home.openDoor`                        | [ホーム UI 文面](/ja/blog/config-home/#home-messages)                           |
| `i18n.locales.<语言>.messages.home.transmission`                    | [ワイドターミナル文面](/ja/blog/config-home/#home-transmission)                 |
| `i18n.locales.<语言>.messages.home.hero`                            | [紹介の予備文面](/ja/blog/config-home/#message-hero)                            |
| `theme.fragments.enabled`                                           | [Fragments 全体スイッチ](/ja/blog/config-fragments/#enabled)                    |
| `i18n.locales.<语言>.messages.blog.allPosts`                        | [記事とタグ共通入口](/ja/blog/config-blog-list/#tag-messages)                   |
| `i18n.locales.<语言>.messages.fragments.title`                      | [Fragments UI 文面](/ja/blog/config-fragments/#fragment-messages)               |
| `i18n.locales.<语言>.messages.fragments.close`                      | [Fragments UI 文面](/ja/blog/config-fragments/#fragment-messages)               |
| `i18n.locales.<语言>.messages.siteTitle`                            | [現在未使用の見出し](/ja/blog/config-site-chrome/#legacy-site-title)            |
| `theme.blogPageSize`                                                | [1ページ記事数](/ja/blog/config-blog-list/#page-size)                           |
| `theme.tags.enabled`                                                | [タグスイッチ](/ja/blog/config-blog-list/#tags-enabled)                         |
| `theme.pagination.windowSize`                                       | [ページ番号窓](/ja/blog/config-blog-list/#pagination-window)                    |
| `theme.pagination.showJumpThreshold`                                | [ジャンプ閾値](/ja/blog/config-blog-list/#jump-threshold)                       |
| `theme.pagination.jump.enabled`                                     | [ジャンプスイッチ](/ja/blog/config-blog-list/#jump-enabled)                     |
| `theme.pagination.jump.enterToGo`                                   | [Enter ジャンプ](/ja/blog/config-blog-list/#jump-enter)                         |
| `theme.pagination.style.enabled`                                    | [ページ外観スイッチ](/ja/blog/config-blog-list/#style-enabled)                  |
| `theme.pagination.style.mode`                                       | [変体の選択方式](/ja/blog/config-blog-list/#style-mode)                         |
| `theme.pagination.style.variants`                                   | [変体数](/ja/blog/config-blog-list/#style-variants)                             |
| `theme.pagination.style.fixedVariant`                               | [固定変体](/ja/blog/config-blog-list/#style-fixed)                              |
| `i18n.locales.<语言>.messages.blog.title`                           | [一覧見出しと説明](/ja/blog/config-blog-list/#archive-messages)                 |
| `i18n.locales.<语言>.messages.blog.pageTitle`                       | [一覧見出しと説明](/ja/blog/config-blog-list/#archive-messages)                 |
| `i18n.locales.<语言>.messages.blog.archiveDescription`              | [一覧見出しと説明](/ja/blog/config-blog-list/#archive-messages)                 |
| `i18n.locales.<语言>.messages.blog.pageDescription`                 | [一覧見出しと説明](/ja/blog/config-blog-list/#archive-messages)                 |
| `i18n.locales.<语言>.messages.blog.previous`                        | [ページ分割文面](/ja/blog/config-blog-list/#pagination-messages)                |
| `i18n.locales.<语言>.messages.blog.next`                            | [ページ分割文面](/ja/blog/config-blog-list/#pagination-messages)                |
| `i18n.locales.<语言>.messages.blog.paginationAria`                  | [ページ分割文面](/ja/blog/config-blog-list/#pagination-messages)                |
| `i18n.locales.<语言>.messages.blog.jumpTo`                          | [ページ分割文面](/ja/blog/config-blog-list/#pagination-messages)                |
| `i18n.locales.<语言>.messages.blog.jumpInputLabel`                  | [ページ分割文面](/ja/blog/config-blog-list/#pagination-messages)                |
| `i18n.locales.<语言>.messages.blog.jumpGo`                          | [ページ分割文面](/ja/blog/config-blog-list/#pagination-messages)                |
| `i18n.locales.<语言>.messages.blog.tags`                            | [タグ文面](/ja/blog/config-blog-list/#tag-messages)                             |
| `i18n.locales.<语言>.messages.blog.noTags`                          | [タグ文面](/ja/blog/config-blog-list/#tag-messages)                             |
| `i18n.locales.<语言>.messages.blog.taggedPosts`                     | [タグ文面](/ja/blog/config-blog-list/#tag-messages)                             |
| `theme.toc.enabled`                                                 | [記事機能スイッチ](/ja/blog/config-article/#feature-switches)                   |
| `theme.math.enabled`                                                | [記事機能スイッチ](/ja/blog/config-article/#feature-switches)                   |
| `theme.effects.enableRedQueen`                                      | [記事機能スイッチ](/ja/blog/config-article/#feature-switches)                   |
| `theme.search.enabled`                                              | [サイト内検索スイッチ](/ja/blog/config-search/#enabled)                         |
| `theme.socialImage.enabled`                                         | [記事機能スイッチ](/ja/blog/config-article/#feature-switches)                   |
| `site.author`                                                       | [サイトと共通 UI 設定](/ja/blog/config-site-chrome/#identity)                   |
| `site.ogImage`                                                      | [サイトと共通 UI 設定](/ja/blog/config-site-chrome/#identity)                   |
| `theme.enableAboutPage`                                             | [About スイッチ](/ja/blog/config-about/#page-enabled)                           |
| `theme.footer.showCredits`                                          | [サイトと共通 UI 設定](/ja/blog/config-site-chrome/#footer)                     |
| `theme.comments.enabled`                                            | [Giscus 設定](/ja/blog/config-comments/#controls)                               |
| `i18n.locales.<语言>.messages.blog.rqBadge`                         | [記事 UI 文面](/ja/blog/config-article/#article-messages)                       |
| `i18n.locales.<语言>.messages.blog.rqReplayAria`                    | [記事 UI 文面](/ja/blog/config-article/#article-messages)                       |
| `i18n.locales.<语言>.messages.blog.backToTop`                       | [記事 UI 文面](/ja/blog/config-article/#article-messages)                       |
| `i18n.locales.<语言>.messages.blog.toastP10`                        | [記事 UI 文面](/ja/blog/config-article/#article-messages)                       |
| `i18n.locales.<语言>.messages.blog.toastP30`                        | [記事 UI 文面](/ja/blog/config-article/#article-messages)                       |
| `i18n.locales.<语言>.messages.blog.toastP60`                        | [記事 UI 文面](/ja/blog/config-article/#article-messages)                       |
| `i18n.locales.<语言>.messages.blog.toastDone`                       | [記事 UI 文面](/ja/blog/config-article/#article-messages)                       |
| `i18n.locales.<语言>.messages.blog.metaPublished`                   | [記事 UI 文面](/ja/blog/config-article/#article-messages)                       |
| `i18n.locales.<语言>.messages.blog.metaAuthor`                      | [記事 UI 文面](/ja/blog/config-article/#article-messages)                       |
| `i18n.locales.<语言>.messages.blog.metaUpdated`                     | [記事 UI 文面](/ja/blog/config-article/#article-messages)                       |
| `i18n.locales.<语言>.messages.blog.systemStatusAria`                | [記事 UI 文面](/ja/blog/config-article/#article-messages)                       |
| `i18n.locales.<语言>.messages.blog.systemModelLabel`                | [記事 UI 文面](/ja/blog/config-article/#article-messages)                       |
| `i18n.locales.<语言>.messages.blog.systemModeLabel`                 | [記事 UI 文面](/ja/blog/config-article/#article-messages)                       |
| `i18n.locales.<语言>.messages.blog.systemStateLabel`                | [記事 UI 文面](/ja/blog/config-article/#article-messages)                       |
| `i18n.locales.<语言>.messages.blog.promptContextLabel`              | [記事 UI 文面](/ja/blog/config-article/#article-messages)                       |
| `i18n.locales.<语言>.messages.blog.heroMonitor`                     | [記事 UI 文面](/ja/blog/config-article/#article-messages)                       |
| `i18n.locales.<语言>.messages.blog.heroSignalSync`                  | [記事 UI 文面](/ja/blog/config-article/#article-messages)                       |
| `i18n.locales.<语言>.messages.blog.heroModelOnline`                 | [記事 UI 文面](/ja/blog/config-article/#article-messages)                       |
| `i18n.locales.<语言>.messages.blog.toc`                             | [記事 UI 文面](/ja/blog/config-article/#article-messages)                       |
| `i18n.locales.<语言>.messages.blog.responseOutput`                  | [記事 UI 文面](/ja/blog/config-article/#article-messages)                       |
| `i18n.locales.<语言>.messages.blog.statsWords`                      | [記事 UI 文面](/ja/blog/config-article/#article-messages)                       |
| `i18n.locales.<语言>.messages.blog.statsTokens`                     | [記事 UI 文面](/ja/blog/config-article/#article-messages)                       |
| `i18n.locales.<语言>.messages.blog.copySectionLink`                 | [記事 UI 文面](/ja/blog/config-article/#article-messages)                       |
| `i18n.locales.<语言>.messages.blog.regenerate`                      | [記事 UI 文面](/ja/blog/config-article/#article-messages)                       |
| `i18n.locales.<语言>.messages.blog.relatedAria`                     | [記事 UI 文面](/ja/blog/config-article/#article-messages)                       |
| `i18n.locales.<语言>.messages.blog.related`                         | [記事 UI 文面](/ja/blog/config-article/#article-messages)                       |
| `i18n.locales.<语言>.messages.blog.backToBlogAria`                  | [記事 UI 文面](/ja/blog/config-article/#article-messages)                       |
| `i18n.locales.<语言>.messages.blog.backToBlog`                      | [記事 UI 文面](/ja/blog/config-article/#article-messages)                       |
| `i18n.locales.<语言>.messages.blog.comments`                        | [記事 UI 文面](/ja/blog/config-article/#article-messages)                       |
| `i18n.locales.<语言>.messages.blog.metaReadMinutes`                 | [記事 UI 文面（現在未使用）](/ja/blog/config-article/#article-messages)         |
| `i18n.locales.<语言>.messages.blog.latencyLabel`                    | [記事 UI 文面（現在未使用）](/ja/blog/config-article/#article-messages)         |
| `i18n.locales.<语言>.messages.blog.confidenceLabel`                 | [記事 UI 文面（現在未使用）](/ja/blog/config-article/#article-messages)         |
| `i18n.locales.<语言>.messages.codeCopy.copy`                        | [読書操作文面](/ja/blog/config-article/#interaction-messages)                   |
| `i18n.locales.<语言>.messages.codeCopy.copied`                      | [読書操作文面](/ja/blog/config-article/#interaction-messages)                   |
| `i18n.locales.<语言>.messages.codeCopy.failed`                      | [読書操作文面](/ja/blog/config-article/#interaction-messages)                   |
| `i18n.locales.<语言>.messages.imagePreview.open`                    | [読書操作文面](/ja/blog/config-article/#interaction-messages)                   |
| `i18n.locales.<语言>.messages.imagePreview.close`                   | [読書操作文面](/ja/blog/config-article/#interaction-messages)                   |
| `theme.fragments.pageSize`                                          | [Fragments 1ページ件数](/ja/blog/config-fragments/#page-size)                   |
| `theme.fragments.comments.enabled`                                  | [Fragments コメント](/ja/blog/config-fragments/#comments-enabled)               |
| `i18n.locales.<语言>.messages.fragments.description`                | [Fragments UI 文面](/ja/blog/config-fragments/#fragment-messages)               |
| `i18n.locales.<语言>.messages.fragments.empty`                      | [Fragments UI 文面](/ja/blog/config-fragments/#fragment-messages)               |
| `i18n.locales.<语言>.messages.fragments.comments`                   | [Fragments UI 文面](/ja/blog/config-fragments/#fragment-messages)               |
| `i18n.locales.<语言>.messages.fragments.previous`                   | [Fragments 文面（現在未使用）](/ja/blog/config-fragments/#fragment-messages)    |
| `i18n.locales.<语言>.messages.fragments.next`                       | [Fragments 文面（現在未使用）](/ja/blog/config-fragments/#fragment-messages)    |
| `i18n.locales.<语言>.messages.fragments.loading`                    | [Fragments UI 文面](/ja/blog/config-fragments/#fragment-messages)               |
| `i18n.locales.<语言>.messages.fragments.error`                      | [Fragments UI 文面](/ja/blog/config-fragments/#fragment-messages)               |
| `i18n.locales.<语言>.messages.fragments.retry`                      | [Fragments UI 文面](/ja/blog/config-fragments/#fragment-messages)               |
| `i18n.locales.<语言>.messages.fragments.copyLink`                   | [Fragments UI 文面](/ja/blog/config-fragments/#fragment-messages)               |
| `i18n.locales.<语言>.messages.fragments.linkCopied`                 | [Fragments UI 文面](/ja/blog/config-fragments/#fragment-messages)               |
| `i18n.locales.<语言>.messages.fragments.copyLinkFailed`             | [Fragments UI 文面](/ja/blog/config-fragments/#fragment-messages)               |
| `i18n.locales.<语言>.messages.fragments.notFound`                   | [Fragments UI 文面](/ja/blog/config-fragments/#fragment-messages)               |
| `i18n.locales.<语言>.messages.fragments.indexError`                 | [Fragments UI 文面](/ja/blog/config-fragments/#fragment-messages)               |
| `theme.comments.repo`                                               | [Giscus 設定](/ja/blog/config-comments/#connection)                             |
| `theme.comments.repoId`                                             | [Giscus 設定](/ja/blog/config-comments/#connection)                             |
| `theme.comments.category`                                           | [Giscus 設定](/ja/blog/config-comments/#connection)                             |
| `theme.comments.categoryId`                                         | [Giscus 設定](/ja/blog/config-comments/#connection)                             |
| `i18n.locales.<语言>.about.metaLine`                                | [About 本文](/ja/blog/config-about/#body-fields)                                |
| `i18n.locales.<语言>.about.sections.who`                            | [About 本文](/ja/blog/config-about/#body-fields)                                |
| `i18n.locales.<语言>.about.sections.what`                           | [About 本文](/ja/blog/config-about/#body-fields)                                |
| `i18n.locales.<语言>.about.sections.ethos`                          | [About 本文](/ja/blog/config-about/#body-fields)                                |
| `i18n.locales.<语言>.about.sections.now`                            | [About 本文](/ja/blog/config-about/#body-fields)                                |
| `i18n.locales.<语言>.about.sections.contactLead`                    | [About 本文](/ja/blog/config-about/#body-fields)                                |
| `i18n.locales.<语言>.about.sections.signature`                      | [About 本文](/ja/blog/config-about/#body-fields)                                |
| `i18n.locales.<语言>.about.contact.email`                           | [About 連絡先](/ja/blog/config-about/#contact-fields)                           |
| `i18n.locales.<语言>.about.contact.githubUrl`                       | [About 連絡先](/ja/blog/config-about/#contact-fields)                           |
| `i18n.locales.<语言>.about.contact.githubLabel`                     | [About 連絡先](/ja/blog/config-about/#contact-fields)                           |
| `i18n.locales.<语言>.about.sidebar.dlData`                          | [About ツール入口](/ja/blog/config-about/#tool-fields)                          |
| `i18n.locales.<语言>.about.sidebar.ai`                              | [About ツール入口](/ja/blog/config-about/#tool-fields)                          |
| `i18n.locales.<语言>.about.sidebar.decryptor`                       | [About ツール入口](/ja/blog/config-about/#tool-fields)                          |
| `i18n.locales.<语言>.about.sidebar.help`                            | [About ツール入口](/ja/blog/config-about/#tool-fields)                          |
| `i18n.locales.<语言>.about.sidebar.allScripts`                      | [About ツール入口](/ja/blog/config-about/#tool-fields)                          |
| `i18n.locales.<语言>.about.scriptsPath`                             | [About ツール入口](/ja/blog/config-about/#tool-fields)                          |
| `i18n.locales.<语言>.about.labels.modalOutput`                      | [About 共通文面（有効状態に注意）](/ja/blog/config-about/#label-fields)         |
| `i18n.locales.<语言>.about.labels.modalClose`                       | [About 共通文面](/ja/blog/config-about/#label-fields)                           |
| `i18n.locales.<语言>.about.labels.responseOutput`                   | [About 共通文面](/ja/blog/config-about/#label-fields)                           |
| `i18n.locales.<语言>.about.labels.contactEmailLead`                 | [About 共通文面](/ja/blog/config-about/#label-fields)                           |
| `i18n.locales.<语言>.about.labels.contactConnectLead`               | [About 共通文面](/ja/blog/config-about/#label-fields)                           |
| `i18n.locales.<语言>.about.labels.backToTop`                        | [About 共通文面](/ja/blog/config-about/#label-fields)                           |
| `i18n.locales.<语言>.about.labels.quickAccess`                      | [About 共通文面](/ja/blog/config-about/#label-fields)                           |
| `i18n.locales.<语言>.about.labels.contactEmailLabel`                | [About 共通文面](/ja/blog/config-about/#label-fields)                           |
| `i18n.locales.<语言>.about.modals.dlData.title`                     | [About ツールダイアログ](/ja/blog/config-about/#modal-fields)                   |
| `i18n.locales.<语言>.about.modals.dlData.subtitle`                  | [About ツールダイアログ](/ja/blog/config-about/#modal-fields)                   |
| `i18n.locales.<语言>.about.modals.ai.title`                         | [About ツールダイアログ](/ja/blog/config-about/#modal-fields)                   |
| `i18n.locales.<语言>.about.modals.ai.lines`                         | [About ツールダイアログ](/ja/blog/config-about/#modal-fields)                   |
| `i18n.locales.<语言>.about.modals.decryptor.title`                  | [About ツールダイアログ](/ja/blog/config-about/#modal-fields)                   |
| `i18n.locales.<语言>.about.modals.decryptor.header`                 | [About ツールダイアログ（有効状態に注意）](/ja/blog/config-about/#modal-fields) |
| `i18n.locales.<语言>.about.modals.decryptor.keysLabel`              | [About ツールダイアログ（有効状態に注意）](/ja/blog/config-about/#modal-fields) |
| `i18n.locales.<语言>.about.modals.decryptor.currentPassphraseLabel` | [About ツールダイアログ（有効状態に注意）](/ja/blog/config-about/#modal-fields) |
| `i18n.locales.<语言>.about.modals.decryptor.masterKeyLabel`         | [About ツールダイアログ（有効状態に注意）](/ja/blog/config-about/#modal-fields) |
| `i18n.locales.<语言>.about.modals.decryptor.transientKeyLabel`      | [About ツールダイアログ（有効状態に注意）](/ja/blog/config-about/#modal-fields) |
| `i18n.locales.<语言>.about.modals.help.title`                       | [About ツールダイアログ](/ja/blog/config-about/#modal-fields)                   |
| `i18n.locales.<语言>.about.modals.help.statsLabel`                  | [About ツールダイアログ](/ja/blog/config-about/#modal-fields)                   |
| `i18n.locales.<语言>.about.modals.help.typedPrefix`                 | [About ツールダイアログ](/ja/blog/config-about/#modal-fields)                   |
| `i18n.locales.<语言>.about.modals.help.typedSuffix`                 | [About ツールダイアログ](/ja/blog/config-about/#modal-fields)                   |
| `i18n.locales.<语言>.about.modals.allScripts.title`                 | [About ツールダイアログ](/ja/blog/config-about/#modal-fields)                   |
| `i18n.locales.<语言>.about.effects.backgroundLines`                 | [About 効果（有効状態に注意）](/ja/blog/config-about/#effect-fields)            |
| `i18n.locales.<语言>.about.effects.scrollToasts.p30`                | [About 効果](/ja/blog/config-about/#effect-fields)                              |
| `i18n.locales.<语言>.about.effects.scrollToasts.p60`                | [About 効果](/ja/blog/config-about/#effect-fields)                              |
| `i18n.locales.<语言>.about.effects.scrollToasts.p90`                | [About 効果](/ja/blog/config-about/#effect-fields)                              |
| `i18n.locales.<语言>.messages.about.title`                          | [About と共通控件の文面](/ja/blog/config-about/#about-messages)                 |
| `i18n.locales.<语言>.messages.about.description`                    | [About と共通控件の文面](/ja/blog/config-about/#about-messages)                 |
| `i18n.locales.<语言>.messages.about.who`                            | [About と共通控件の文面](/ja/blog/config-about/#about-messages)                 |
| `i18n.locales.<语言>.messages.about.what`                           | [About と共通控件の文面](/ja/blog/config-about/#about-messages)                 |
| `i18n.locales.<语言>.messages.about.ethos`                          | [About と共通控件の文面](/ja/blog/config-about/#about-messages)                 |
| `i18n.locales.<语言>.messages.about.now`                            | [About と共通控件の文面](/ja/blog/config-about/#about-messages)                 |
| `i18n.locales.<语言>.messages.about.contact`                        | [About と共通控件の文面](/ja/blog/config-about/#about-messages)                 |
| `i18n.locales.<语言>.messages.about.regenerate`                     | [About と共通控件の文面](/ja/blog/config-about/#about-messages)                 |
| `i18n.locales.<语言>.messages.windowControls.collapse`              | [About と共通控件の文面](/ja/blog/config-about/#about-messages)                 |
| `i18n.locales.<语言>.messages.windowControls.expand`                | [About と共通控件の文面](/ja/blog/config-about/#about-messages)                 |
| `i18n.locales.<语言>.messages.windowControls.restore`               | [About と共通控件の文面](/ja/blog/config-about/#about-messages)                 |
| `i18n.locales.<语言>.messages.windowControls.fullscreen`            | [About と共通控件の文面](/ja/blog/config-about/#about-messages)                 |
| `i18n.locales.<语言>.messages.scriptFolders.copyTitle`              | [About と共通控件の文面](/ja/blog/config-about/#about-messages)                 |
| `i18n.locales.<语言>.messages.scriptFolders.copied`                 | [About と共通控件の文面](/ja/blog/config-about/#about-messages)                 |
| `i18n.locales.<语言>.messages.scriptFolders.failed`                 | [About と共通控件の文面](/ja/blog/config-about/#about-messages)                 |
| `theme.enableDecoderPage`                                           | [Decoder ページスイッチ](/ja/blog/config-decoder/#page-enabled)                 |
| `i18n.locales.<语言>.messages.nav.about`                            | [サイトと共通 UI 設定](/ja/blog/config-site-chrome/#chrome-messages)            |
| `i18n.locales.<语言>.messages.decoder.input`                        | [Decoder 文面](/ja/blog/config-decoder/#text-messages)                          |
| `i18n.locales.<语言>.messages.decoder.placeholder`                  | [Decoder 文面](/ja/blog/config-decoder/#text-messages)                          |
| `i18n.locales.<语言>.messages.decoder.format`                       | [Decoder 文面](/ja/blog/config-decoder/#text-messages)                          |
| `i18n.locales.<语言>.messages.decoder.auto`                         | [Decoder 文面](/ja/blog/config-decoder/#text-messages)                          |
| `i18n.locales.<语言>.messages.decoder.decode`                       | [Decoder 文面](/ja/blog/config-decoder/#text-messages)                          |
| `i18n.locales.<语言>.messages.decoder.clear`                        | [Decoder 文面](/ja/blog/config-decoder/#text-messages)                          |
| `i18n.locales.<语言>.messages.decoder.copy`                         | [Decoder 文面](/ja/blog/config-decoder/#text-messages)                          |
| `i18n.locales.<语言>.messages.decoder.reuse`                        | [Decoder 文面](/ja/blog/config-decoder/#text-messages)                          |
| `i18n.locales.<语言>.messages.decoder.supported`                    | [Decoder 文面](/ja/blog/config-decoder/#text-messages)                          |
| `i18n.locales.<语言>.messages.decoder.html`                         | [Decoder 文面](/ja/blog/config-decoder/#text-messages)                          |
| `i18n.locales.<语言>.messages.decoder.unicode`                      | [Decoder 文面](/ja/blog/config-decoder/#text-messages)                          |
| `i18n.locales.<语言>.messages.decoder.jwtWarning`                   | [Decoder 文面](/ja/blog/config-decoder/#text-messages)                          |
| `i18n.locales.<语言>.messages.decoder.copied`                       | [Decoder 文面](/ja/blog/config-decoder/#text-messages)                          |
| `i18n.locales.<语言>.messages.decoder.copyFailed`                   | [Decoder 文面](/ja/blog/config-decoder/#text-messages)                          |
| `i18n.locales.<语言>.messages.decoder.output`                       | [Decoder 文面](/ja/blog/config-decoder/#text-messages)                          |
| `i18n.locales.<语言>.messages.decoder.local`                        | [Decoder 文面](/ja/blog/config-decoder/#text-messages)                          |
| `i18n.locales.<语言>.messages.decoder.ready`                        | [Decoder 文面](/ja/blog/config-decoder/#text-messages)                          |
| `i18n.locales.<语言>.messages.decoder.running`                      | [Decoder 文面](/ja/blog/config-decoder/#text-messages)                          |
| `i18n.locales.<语言>.messages.decoder.done`                         | [Decoder 文面](/ja/blog/config-decoder/#text-messages)                          |
| `i18n.locales.<语言>.messages.decoder.empty`                        | [Decoder 文面](/ja/blog/config-decoder/#text-messages)                          |
| `i18n.locales.<语言>.messages.decoder.tooLong`                      | [Decoder 文面](/ja/blog/config-decoder/#text-messages)                          |
| `i18n.locales.<语言>.messages.decoder.invalid`                      | [Decoder 文面](/ja/blog/config-decoder/#text-messages)                          |
| `i18n.locales.<语言>.messages.decoder.binary`                       | [Decoder 文面](/ja/blog/config-decoder/#text-messages)                          |
| `i18n.locales.<语言>.messages.decoder.unknown`                      | [Decoder 文面](/ja/blog/config-decoder/#text-messages)                          |
| `i18n.locales.<语言>.messages.decoder.ambiguous`                    | [Decoder 文面](/ja/blog/config-decoder/#text-messages)                          |
| `i18n.locales.<语言>.messages.decoder.example`                      | [Decoder 文面](/ja/blog/config-decoder/#text-messages)                          |
| `i18n.locales.<语言>.messages.decoderPage.description`              | [Decoder 文面](/ja/blog/config-decoder/#page-messages)                          |
| `i18n.locales.<语言>.messages.decoderPage.fullTool`                 | [Decoder 文面](/ja/blog/config-decoder/#page-messages)                          |
| `i18n.locales.<语言>.messages.decoderPage.task`                     | [Decoder 文面](/ja/blog/config-decoder/#page-messages)                          |
| `i18n.locales.<语言>.messages.decoderPage.textTask`                 | [Decoder 文面](/ja/blog/config-decoder/#page-messages)                          |
| `i18n.locales.<语言>.messages.decoderPage.callTask`                 | [Decoder 文面](/ja/blog/config-decoder/#page-messages)                          |
| `i18n.locales.<语言>.messages.decoderPage.addressTask`              | [Decoder 文面](/ja/blog/config-decoder/#page-messages)                          |
| `i18n.locales.<语言>.messages.decoderPage.addressHint`              | [Decoder 文面](/ja/blog/config-decoder/#page-messages)                          |
| `i18n.locales.<语言>.messages.decoderPage.chain`                    | [Decoder 文面](/ja/blog/config-decoder/#page-messages)                          |
| `i18n.locales.<语言>.messages.decoderPage.decimals`                 | [Decoder 文面](/ja/blog/config-decoder/#page-messages)                          |
| `i18n.locales.<语言>.messages.decoderPage.precisionHint`            | [Decoder 文面](/ja/blog/config-decoder/#page-messages)                          |
| `i18n.locales.<语言>.messages.decoderPage.network`                  | [Decoder 文面](/ja/blog/config-decoder/#page-messages)                          |
| `i18n.locales.<语言>.messages.decoderPage.history`                  | [Decoder 文面](/ja/blog/config-decoder/#page-messages)                          |
| `i18n.locales.<语言>.messages.decoderPage.back`                     | [Decoder 文面](/ja/blog/config-decoder/#page-messages)                          |
| `i18n.locales.<语言>.messages.decoderPage.export`                   | [Decoder 文面](/ja/blog/config-decoder/#page-messages)                          |
| `i18n.locales.<语言>.messages.decoderPage.limits`                   | [Decoder 文面](/ja/blog/config-decoder/#page-messages)                          |
| `i18n.locales.<语言>.messages.decoderPage.callNotice`               | [Decoder 文面](/ja/blog/config-decoder/#page-messages)                          |
| `i18n.locales.<语言>.messages.decoderPage.addressNotice`            | [Decoder 文面](/ja/blog/config-decoder/#page-messages)                          |
| `i18n.locales.<语言>.messages.decoderPage.unsupported`              | [Decoder 文面](/ja/blog/config-decoder/#page-messages)                          |
| `i18n.locales.<语言>.messages.decoderPage.checksum`                 | [Decoder 文面](/ja/blog/config-decoder/#page-messages)                          |
| `i18n.locales.<语言>.messages.decoderPage.length`                   | [Decoder 文面](/ja/blog/config-decoder/#page-messages)                          |
| `i18n.locales.<语言>.messages.decoderPage.wrongNetwork`             | [Decoder 文面](/ja/blog/config-decoder/#page-messages)                          |
| `i18n.locales.<语言>.messages.decoderPage.stepLimit`                | [Decoder 文面](/ja/blog/config-decoder/#page-messages)                          |
| `i18n.locales.<语言>.messages.decoderPage.budget`                   | [Decoder 文面](/ja/blog/config-decoder/#page-messages)                          |
| `i18n.locales.<语言>.messages.decoderPage.addressParse`             | [Decoder 文面](/ja/blog/config-decoder/#page-messages)                          |
| `i18n.locales.<语言>.messages.decoderPage.addressCheck`             | [Decoder 文面](/ja/blog/config-decoder/#page-messages)                          |
| `i18n.locales.<语言>.messages.decoderPage.addressResult`            | [Decoder 文面](/ja/blog/config-decoder/#page-messages)                          |
| `i18n.locales.<语言>.messages.decoderPage.callParse`                | [Decoder 文面](/ja/blog/config-decoder/#page-messages)                          |
| `i18n.locales.<语言>.messages.decoderPage.rawOnly`                  | [Decoder 文面](/ja/blog/config-decoder/#page-messages)                          |
| `i18n.locales.<语言>.messages.decoderPage.amountResult`             | [Decoder 文面](/ja/blog/config-decoder/#page-messages)                          |
| `i18n.locales.<语言>.messages.decoderPage.inputHint`                | [Decoder 文面](/ja/blog/config-decoder/#page-messages)                          |
| `i18n.locales.<语言>.messages.decoderPage.loadFailed`               | [Decoder 文面](/ja/blog/config-decoder/#page-messages)                          |
| `i18n.locales.<语言>.messages.decoderPage.readings.tribute`         | [Decoder 資料欄](/ja/blog/config-decoder/#readings)                             |
| `i18n.locales.<语言>.messages.decoderPage.readings.links`           | [Decoder 資料欄](/ja/blog/config-decoder/#readings)                             |
| `i18n.locales.<语言>.messages.decoderPage.readings.links[].title`   | [Decoder 資料欄](/ja/blog/config-decoder/#readings)                             |
| `i18n.locales.<语言>.messages.decoderPage.readings.links[].href`    | [Decoder 資料欄](/ja/blog/config-decoder/#readings)                             |
| `i18n.locales.<语言>.messages.decoderPage.readings.links[].author`  | [Decoder 資料欄](/ja/blog/config-decoder/#readings)                             |
| `i18n.locales.<语言>.messages.decoderPage.readings.links[].year`    | [Decoder 資料欄](/ja/blog/config-decoder/#readings)                             |
| `i18n.locales.<语言>.messages.decoderPage.readings.links[].cover`   | [Decoder 資料欄](/ja/blog/config-decoder/#readings)                             |
| `theme.music.enabled`                                               | [音楽設定](/ja/blog/config-music/#enabled)                                      |
| `theme.music.tracks`                                                | [音楽設定](/ja/blog/config-music/#tracks)                                       |
| `theme.music.tracks[].title`                                        | [音楽設定](/ja/blog/config-music/#track-fields)                                 |
| `theme.music.tracks[].artist`                                       | [音楽設定](/ja/blog/config-music/#track-fields)                                 |
| `theme.music.tracks[].src`                                          | [音楽設定](/ja/blog/config-music/#track-fields)                                 |
| `i18n.locales.<语言>.messages.music.label`                          | [音楽プレーヤー文面](/ja/blog/config-music/#music-messages)                     |
| `i18n.locales.<语言>.messages.music.play`                           | [音楽プレーヤー文面](/ja/blog/config-music/#music-messages)                     |
| `i18n.locales.<语言>.messages.music.pause`                          | [音楽プレーヤー文面](/ja/blog/config-music/#music-messages)                     |
| `i18n.locales.<语言>.messages.music.prev`                           | [音楽プレーヤー文面](/ja/blog/config-music/#music-messages)                     |
| `i18n.locales.<语言>.messages.music.next`                           | [音楽プレーヤー文面](/ja/blog/config-music/#music-messages)                     |
| `i18n.locales.<语言>.messages.music.open`                           | [音楽プレーヤー文面](/ja/blog/config-music/#music-messages)                     |
| `i18n.locales.<语言>.messages.music.close`                          | [音楽プレーヤー文面](/ja/blog/config-music/#music-messages)                     |
| `i18n.locales.<语言>.messages.music.progress`                       | [音楽プレーヤー文面](/ja/blog/config-music/#music-messages)                     |
| `i18n.locales.<语言>.messages.music.volume`                         | [音楽プレーヤー文面](/ja/blog/config-music/#music-messages)                     |
| `i18n.locales.<语言>.messages.music.queue`                          | [音楽プレーヤー文面](/ja/blog/config-music/#music-messages)                     |
| `i18n.locales.<语言>.messages.music.mute`                           | [音楽プレーヤー文面](/ja/blog/config-music/#music-messages)                     |
| `i18n.locales.<语言>.messages.music.unmute`                         | [音楽プレーヤー文面](/ja/blog/config-music/#music-messages)                     |
| `i18n.locales.<语言>.messages.music.idle`                           | [音楽プレーヤー文面](/ja/blog/config-music/#music-messages)                     |
| `i18n.locales.<语言>.messages.music.loading`                        | [音楽プレーヤー文面](/ja/blog/config-music/#music-messages)                     |
| `i18n.locales.<语言>.messages.music.playing`                        | [音楽プレーヤー文面](/ja/blog/config-music/#music-messages)                     |
| `i18n.locales.<语言>.messages.music.paused`                         | [音楽プレーヤー文面](/ja/blog/config-music/#music-messages)                     |
| `i18n.locales.<语言>.messages.music.blocked`                        | [音楽プレーヤー文面](/ja/blog/config-music/#music-messages)                     |
| `i18n.locales.<语言>.messages.music.error`                          | [音楽プレーヤー文面](/ja/blog/config-music/#music-messages)                     |
| `i18n.locales.<语言>.messages.music.noScript`                       | [音楽プレーヤー文面](/ja/blog/config-music/#music-messages)                     |
| `theme.comments.shareAcrossLocales`                                 | [Giscus 設定](/ja/blog/config-comments/#sharing)                                |
| `theme.comments.mapping`                                            | [Giscus 設定](/ja/blog/config-comments/#mapping)                                |
| `theme.comments.term`                                               | [Giscus 設定](/ja/blog/config-comments/#mapping)                                |
| `theme.comments.number`                                             | [Giscus 設定](/ja/blog/config-comments/#mapping)                                |
| `theme.comments.strict`                                             | [Giscus 設定](/ja/blog/config-comments/#mapping)                                |
| `theme.comments.reactionsEnabled`                                   | [Giscus 設定](/ja/blog/config-comments/#appearance)                             |
| `theme.comments.emitMetadata`                                       | [Giscus 設定](/ja/blog/config-comments/#appearance)                             |
| `theme.comments.inputPosition`                                      | [Giscus 設定](/ja/blog/config-comments/#appearance)                             |
| `theme.comments.theme`                                              | [Giscus 設定](/ja/blog/config-comments/#appearance)                             |
| `theme.comments.lang`                                               | [Giscus 設定](/ja/blog/config-comments/#appearance)                             |
| `theme.comments.loading`                                            | [Giscus 設定](/ja/blog/config-comments/#appearance)                             |
| `theme.comments.crossorigin`                                        | [Giscus 設定](/ja/blog/config-comments/#appearance)                             |
| `i18n.defaultLocale`                                                | [言語と補完設定](/ja/blog/config-languages/#registry)                           |
| `i18n.locales`                                                      | [言語と補完設定](/ja/blog/config-languages/#registry)                           |
| `i18n.locales.<语言>`                                               | [言語と補完設定](/ja/blog/config-languages/#registry)                           |
| `i18n.routing.defaultLocalePrefix`                                  | [言語と補完設定](/ja/blog/config-languages/#routing)                            |
| `i18n.locales.<语言>.meta`                                          | [言語と補完設定](/ja/blog/config-languages/#meta)                               |
| `i18n.locales.<语言>.meta.label`                                    | [言語と補完設定](/ja/blog/config-languages/#meta)                               |
| `i18n.locales.<语言>.meta.hreflang`                                 | [言語と補完設定](/ja/blog/config-languages/#meta)                               |
| `i18n.locales.<语言>.meta.ogLocale`                                 | [言語と補完設定](/ja/blog/config-languages/#meta)                               |
| `i18n.locales.<语言>.meta.enabled`                                  | [言語と補完設定](/ja/blog/config-languages/#meta)                               |
| `i18n.locales.<语言>.meta.fallback`                                 | [言語と補完設定](/ja/blog/config-languages/#fallback)                           |
| `i18n.locales.<语言>.site`                                          | [言語と補完設定](/ja/blog/config-languages/#overrides)                          |
| `i18n.locales.<语言>.messages`                                      | [言語と補完設定](/ja/blog/config-languages/#overrides)                          |
| `i18n.locales.<语言>.about`                                         | [言語と補完設定](/ja/blog/config-languages/#overrides)                          |
| `i18n.locales.<语言>.messages.langLabel`                            | [言語と補完設定](/ja/blog/config-languages/#common-messages)                    |
| `i18n.locales.<语言>.aiReadableContent`                             | [GA4 と AI 補足](/ja/blog/config-analytics-ai/#locale-supplement)               |
| `i18n.locales.<语言>.aiReadableContent.notes`                       | [GA4 と AI 補足](/ja/blog/config-analytics-ai/#locale-supplement)               |
| `i18n.locales.<语言>.aiReadableContent.links`                       | [GA4 と AI 補足](/ja/blog/config-analytics-ai/#locale-supplement)               |
| `i18n.locales.<语言>.aiReadableContent.links[].label`               | [GA4 と AI 補足](/ja/blog/config-analytics-ai/#locale-supplement)               |
| `i18n.locales.<语言>.aiReadableContent.links[].href`                | [GA4 と AI 補足](/ja/blog/config-analytics-ai/#locale-supplement)               |
| `i18n.locales.<语言>.messages.search.label`                         | [検索文面](/ja/blog/config-search/#messages)                                    |
| `i18n.locales.<语言>.messages.search.close`                         | [検索文面](/ja/blog/config-search/#messages)                                    |
| `i18n.locales.<语言>.messages.search.placeholder`                   | [検索文面](/ja/blog/config-search/#messages)                                    |
| `i18n.locales.<语言>.messages.search.hint`                          | [検索文面](/ja/blog/config-search/#messages)                                    |
| `i18n.locales.<语言>.messages.search.loading`                       | [検索文面](/ja/blog/config-search/#messages)                                    |
| `i18n.locales.<语言>.messages.search.empty`                         | [検索文面](/ja/blog/config-search/#messages)                                    |
| `i18n.locales.<语言>.messages.search.error`                         | [検索文面](/ja/blog/config-search/#messages)                                    |
| `i18n.locales.<语言>.messages.search.retry`                         | [検索文面](/ja/blog/config-search/#messages)                                    |
| `i18n.locales.<语言>.messages.search.more`                          | [検索文面](/ja/blog/config-search/#messages)                                    |
| `i18n.locales.<语言>.messages.search.results`                       | [検索文面](/ja/blog/config-search/#messages)                                    |
| `i18n.locales.<语言>.messages.search.dev`                           | [検索文面](/ja/blog/config-search/#messages)                                    |
| `analytics`                                                         | [GA4 と AI 補足](/ja/blog/config-analytics-ai/#analytics)                       |
| `analytics.googleAnalyticsId`                                       | [GA4 と AI 補足](/ja/blog/config-analytics-ai/#analytics)                       |
| `aiReadableContent`                                                 | [GA4 と AI 補足](/ja/blog/config-analytics-ai/#supplement)                      |
| `aiReadableContent.notes`                                           | [GA4 と AI 補足](/ja/blog/config-analytics-ai/#supplement)                      |
| `aiReadableContent.links`                                           | [GA4 と AI 補足](/ja/blog/config-analytics-ai/#supplement)                      |
| `aiReadableContent.links[].label`                                   | [GA4 と AI 補足](/ja/blog/config-analytics-ai/#supplement)                      |
| `aiReadableContent.links[].href`                                    | [GA4 と AI 補足](/ja/blog/config-analytics-ai/#supplement)                      |
| `site.title`                                                        | [サイトと共通 UI 設定](/ja/blog/config-site-chrome/#identity)                   |
| `site.description`                                                  | [サイトと共通 UI 設定](/ja/blog/config-site-chrome/#identity)                   |
| `site.url`                                                          | [サイトと共通 UI 設定](/ja/blog/config-site-chrome/#identity)                   |
| `site.tagline`                                                      | [サイトと共通 UI 設定](/ja/blog/config-site-chrome/#identity)                   |
| `social.links`                                                      | [サイトと共通 UI 設定](/ja/blog/config-site-chrome/#social)                     |
| `social.links[].href`                                               | [サイトと共通 UI 設定](/ja/blog/config-site-chrome/#social-fields)              |
| `social.links[].label`                                              | [サイトと共通 UI 設定](/ja/blog/config-site-chrome/#social-fields)              |
| `social.links[].rel`                                                | [サイトと共通 UI 設定](/ja/blog/config-site-chrome/#social-fields)              |
| `social.links[].icon`                                               | [サイトと共通 UI 設定](/ja/blog/config-site-chrome/#social-fields)              |
| `social.links[].iconSrc`                                            | [サイトと共通 UI 設定](/ja/blog/config-site-chrome/#social-fields)              |
| `theme.footer.links`                                                | [サイトと共通 UI 設定](/ja/blog/config-site-chrome/#footer)                     |
| `theme.footer.links[].label`                                        | [サイトと共通 UI 設定](/ja/blog/config-site-chrome/#footer)                     |
| `theme.footer.links[].href`                                         | [サイトと共通 UI 設定](/ja/blog/config-site-chrome/#footer)                     |
| `i18n.locales.<语言>.messages.nav.home`                             | [サイトと共通 UI 設定](/ja/blog/config-site-chrome/#chrome-messages)            |
| `i18n.locales.<语言>.messages.nav.blog`                             | [サイトと共通 UI 設定](/ja/blog/config-site-chrome/#chrome-messages)            |
| `i18n.locales.<语言>.messages.nav.status`                           | [サイトと共通 UI 設定](/ja/blog/config-site-chrome/#chrome-messages)            |
| `i18n.locales.<语言>.messages.nav.statusAria`                       | [サイトと共通 UI 設定](/ja/blog/config-site-chrome/#chrome-messages)            |
| `i18n.locales.<语言>.messages.footer.theme`                         | [サイトと共通 UI 設定](/ja/blog/config-site-chrome/#chrome-messages)            |
| `i18n.locales.<语言>.messages.footer.builtWith`                     | [サイトと共通 UI 設定](/ja/blog/config-site-chrome/#chrome-messages)            |
| `i18n.locales.<语言>.messages.terminal.commandInput`                | [ターミナル文面](/ja/blog/config-terminal/#messages)                            |
| `i18n.locales.<语言>.messages.terminal.hint`                        | [ターミナル文面](/ja/blog/config-terminal/#messages)                            |
| `i18n.locales.<语言>.messages.terminal.help`                        | [ターミナル文面](/ja/blog/config-terminal/#messages)                            |
| `i18n.locales.<语言>.messages.terminal.syntax`                      | [ターミナル文面](/ja/blog/config-terminal/#messages)                            |
| `i18n.locales.<语言>.messages.terminal.usage`                       | [ターミナル文面](/ja/blog/config-terminal/#messages)                            |
| `i18n.locales.<语言>.messages.terminal.unknown`                     | [ターミナル文面](/ja/blog/config-terminal/#messages)                            |
| `i18n.locales.<语言>.messages.terminal.notFound`                    | [ターミナル文面](/ja/blog/config-terminal/#messages)                            |
| `i18n.locales.<语言>.messages.terminal.notDirectory`                | [ターミナル文面](/ja/blog/config-terminal/#messages)                            |
| `i18n.locales.<语言>.messages.terminal.isDirectory`                 | [ターミナル文面](/ja/blog/config-terminal/#messages)                            |
| `i18n.locales.<语言>.messages.terminal.failed`                      | [ターミナル文面](/ja/blog/config-terminal/#messages)                            |
| `i18n.locales.<语言>.messages.terminal.tooLarge`                    | [ターミナル文面](/ja/blog/config-terminal/#messages)                            |
| `i18n.locales.<语言>.messages.terminal.empty`                       | [ターミナル文面](/ja/blog/config-terminal/#messages)                            |
| `i18n.locales.<语言>.messages.terminal.loading`                     | [ターミナル文面](/ja/blog/config-terminal/#messages)                            |
| `i18n.locales.<语言>.messages.terminal.readerTitle`                 | [ターミナル文面（現在未使用）](/ja/blog/config-terminal/#messages)              |
| `i18n.locales.<语言>.messages.terminal.readerHint`                  | [ターミナル文面](/ja/blog/config-terminal/#messages)                            |
| `i18n.locales.<语言>.messages.terminal.readerCommand`               | [ターミナル文面](/ja/blog/config-terminal/#messages)                            |

## 記事項目とサイト設定を分ける

frontmatter は上の site.config 表には含めません。[内容・日時・画像](/ja/blog/config-article/#frontmatter)、[OUTPUT 統計と状態](/ja/blog/config-article/#output-fields)、[互換・未使用](/ja/blog/config-article/#legacy-frontmatter)を参照してください。

Fragments の3項目は[内容項目](/ja/blog/config-fragments/#content-fields)で、記事項目とは混ぜません。

記事の検索収録は[search](/ja/blog/config-search/#article-search)へ。site.config 項目でも非公開スイッチでもありません。

## 項目説明の読み方

各辞書は完全パス、型、テーマ既定値、実作用、制約、条件、例を同じ規則で示します。型で受け付けても使用コードがなければ有効機能とは記しません。

| 状態           | 意味                                                           |
| -------------- | -------------------------------------------------------------- |
| 有効           | 現在の実装に対応する作用があります。                           |
| 条件付きで有効 | 有効化、ページ条件、上位設定に上書きされないことが必要です。   |
| 現在未使用     | 型は受け付けても実効果がなく、変更目的での指定は推奨しません。 |
| 互換保持       | 明確な互換用途があり、保持内容と現表示の有無を説明します。     |

既定値はパッケージの既定・内蔵文面です。starter は上書きでき、デモにも個人設定があります。デモの著者、タイトル、曲を全新ブログの既定とは見なさないでください。

言語設定の既定は言語と補完で異なり、未指定・現在言語の内蔵文面・具体値を区別します。簡体中国語／英語だけの例は範囲を明記し、全言語共通とは扱いません。

## 設定の場所と統合方法

`src/site.config.ts` の既存 defineThemeConfig({...}) に統合し、import・export・個人設定を残し、theme・i18n を重複させません。

オブジェクトは再帰マージ、省略は既定継続、配列は全置換、undefined はスキップします。空文字・空配列・false の意味は項目次第で、統一的な既定復元ではありません。hero の空は消去、homeTitle の空白は補完継続です。

変更後は dev で該当ページを確認し、環境変数は再起動、本番は再ビルド・再配備が必要です。ローカル保存だけではオンラインは変わりません。

frontmatter、Astro 設定、環境変数は別の場所です。関連は説明しますが site.config と偽りません。[導入・更新](/ja/blog/starter-guide-1-configure-your-site/)と[検証・配備](/ja/blog/starter-guide-deployment/)を参照してください。
