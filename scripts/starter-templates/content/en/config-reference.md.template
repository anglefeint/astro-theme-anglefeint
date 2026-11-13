---
tags: ['anglefeint', 'config']
title: 'Configuration Reference: Where Is the Setting I Need?'
subtitle: 'Find site.config settings by page, feature or full configuration path.'
description: 'The configuration-reference entry point, distinguishing field locations, defaults and status, with complete module and field indexes.'
pubDate: '2026-11-13'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/hacker-01.webp'
---

**Version note:** This reference follows current source. Live reduced-motion updates, strict `blogPageSize` validation and image isolation when Fragments is disabled require 0.36.1 or later; 0.36.0 does not include them. Default installation and CLI usage are unchanged.

If you know the task, start with its practical tutorial. To find a field's meaning, default or limits, use this reference. Both follow the current code and do not require reading repository setup documents first.

First-time users can follow [all eight tutorials](/en/blog/starter-guide-1-configure-your-site/#tutorial-order): install → write → images → fragments → customize → comments → languages → deploy. Optional features need not all be enabled. This is a lookup reference, not a requirement to read every field from beginning to end.

Available modules: [homepage](/en/blog/config-home/), [Blog List and tags](/en/blog/config-blog-list/), [article detail](/en/blog/config-article/), [Fragments](/en/blog/config-fragments/), [About](/en/blog/config-about/), [Decoder](/en/blog/config-decoder/), [music](/en/blog/config-music/), [Giscus](/en/blog/config-comments/), [languages and fallback](/en/blog/config-languages/), [search and discovery](/en/blog/config-search/), [GA4 and AI-readable context](/en/blog/config-analytics-ai/), [site and shared interface](/en/blog/config-site-chrome/), and [terminal](/en/blog/config-terminal/).

## Find settings by page or feature

| What I want to change                                                             | Reference                                                           | Practical tutorial                                                                                                                                                |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Homepage title, introduction, latest posts, startup prompts, terminal and passage | [Homepage reference](/en/blog/config-home/)                         | [Page and feature customization](/en/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                                      |
| Site name, domain, navigation, social links and footer                            | [Site and shared-interface reference](/en/blog/config-site-chrome/) | [Installation and site identity](/en/blog/starter-guide-1-configure-your-site/), [Page customization](/en/blog/starter-guide-3-comments-about-and-theme-toggles/) |
| Blog List, tags and pagination                                                    | [List reference](/en/blog/config-blog-list/)                        | [Lists and pagination](/en/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                                                |
| Article details, contents, mathematics and reading effects                        | [Article reference](/en/blog/config-article/)                       | [Write your first post](/en/blog/starter-guide-2-languages-and-routing/)                                                                                          |
| Fragments list and preview                                                        | [Fragments reference](/en/blog/config-fragments/)                   | [Publish a fragment](/en/blog/starter-guide-5-fragments/)                                                                                                         |
| About body, contact, sidebar and tools                                            | [About reference](/en/blog/config-about/)                           | [Page and feature customization](/en/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                                      |
| About terminal, prompts and read-only reader                                      | [Terminal reference](/en/blog/config-terminal/)                     | [Page and feature customization](/en/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                                      |
| Decoder page and reading cards                                                    | [Decoder reference](/en/blog/config-decoder/)                       | [Page and feature customization](/en/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                                      |
| Music player                                                                      | [Music reference](/en/blog/config-music/)                           | [Music setup](/en/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                                                         |
| Giscus comments and translated discussions                                        | [Giscus reference](/en/blog/config-comments/)                       | [Let readers leave comments](/en/blog/starter-guide-4-giscus-comments/)                                                                                           |
| Language switches, addresses, translation and fallback                            | [Language reference](/en/blog/config-languages/)                    | [Language tutorial](/en/blog/starter-guide-languages/)                                                                                                            |
| Search and content discovery                                                      | [Search reference](/en/blog/config-search/)                         | [Writing posts](/en/blog/starter-guide-2-languages-and-routing/), [Deployment](/en/blog/starter-guide-deployment/)                                                |
| GA4 analytics and AI-readable context                                             | [GA4 and AI context reference](/en/blog/config-analytics-ai/)       | [Publish on your own domain](/en/blog/starter-guide-deployment/)                                                                                                  |

Every field has one main reference location; other modules link to it. For example, the homepage uses the Fragments switch, but that switch also controls the full list and is not homepage-only.

## Find settings by full path

This index follows the current public configuration type, including unused fields. Links open their main explanation; module references describe cross-page differences. `<locale>` is a placeholder for a code such as zh or en. Article frontmatter is listed separately from site.config paths.

| Full path                                                             | Reference                                                                            |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `i18n.locales.<locale>.site.homeTitle`                                | [Homepage title](/en/blog/config-home/#home-title)                                   |
| `i18n.locales.<locale>.site.hero`                                     | [Visible introduction](/en/blog/config-home/#home-hero)                              |
| `i18n.locales.<locale>.messages.siteDescription`                      | [Homepage metadata description](/en/blog/config-home/#home-description)              |
| `theme.homeLatestCount`                                               | [Latest-post count](/en/blog/config-home/#latest-count)                              |
| `theme.home.showInitialize`                                           | [Startup switches](/en/blog/config-home/#startup-switches)                           |
| `theme.home.showFollow`                                               | [Startup switches](/en/blog/config-home/#startup-switches)                           |
| `theme.home.showTrace`                                                | [Startup switches](/en/blog/config-home/#startup-switches)                           |
| `theme.effects.enableHomePassage`                                     | [Passage navigation](/en/blog/config-home/#home-passage)                             |
| `i18n.locales.<locale>.messages.home.latest`                          | [Homepage messages](/en/blog/config-home/#home-messages)                             |
| `i18n.locales.<locale>.messages.home.viewAll`                         | [Homepage messages](/en/blog/config-home/#home-messages)                             |
| `i18n.locales.<locale>.messages.home.noPosts`                         | [Homepage messages](/en/blog/config-home/#home-messages)                             |
| `i18n.locales.<locale>.messages.home.openDoor`                        | [Homepage messages](/en/blog/config-home/#home-messages)                             |
| `i18n.locales.<locale>.messages.home.transmission`                    | [Widescreen terminal text](/en/blog/config-home/#home-transmission)                  |
| `i18n.locales.<locale>.messages.home.hero`                            | [Fallback introduction](/en/blog/config-home/#message-hero)                          |
| `theme.fragments.enabled`                                             | [Fragments switch](/en/blog/config-fragments/#enabled)                               |
| `i18n.locales.<locale>.messages.blog.allPosts`                        | [Shared article/tag entry](/en/blog/config-blog-list/#tag-messages)                  |
| `i18n.locales.<locale>.messages.fragments.title`                      | [Fragment messages](/en/blog/config-fragments/#fragment-messages)                    |
| `i18n.locales.<locale>.messages.fragments.close`                      | [Fragment messages](/en/blog/config-fragments/#fragment-messages)                    |
| `i18n.locales.<locale>.messages.siteTitle`                            | [Currently unused title field](/en/blog/config-site-chrome/#legacy-site-title)       |
| `theme.blogPageSize`                                                  | [Posts per page](/en/blog/config-blog-list/#page-size)                               |
| `theme.tags.enabled`                                                  | [Tags switch](/en/blog/config-blog-list/#tags-enabled)                               |
| `theme.pagination.windowSize`                                         | [Page-number window](/en/blog/config-blog-list/#pagination-window)                   |
| `theme.pagination.showJumpThreshold`                                  | [Jump threshold](/en/blog/config-blog-list/#jump-threshold)                          |
| `theme.pagination.jump.enabled`                                       | [Jump switch](/en/blog/config-blog-list/#jump-enabled)                               |
| `theme.pagination.jump.enterToGo`                                     | [Enter to jump](/en/blog/config-blog-list/#jump-enter)                               |
| `theme.pagination.style.enabled`                                      | [Pagination style switch](/en/blog/config-blog-list/#style-enabled)                  |
| `theme.pagination.style.mode`                                         | [Variant strategy](/en/blog/config-blog-list/#style-mode)                            |
| `theme.pagination.style.variants`                                     | [Variant count](/en/blog/config-blog-list/#style-variants)                           |
| `theme.pagination.style.fixedVariant`                                 | [Fixed variant](/en/blog/config-blog-list/#style-fixed)                              |
| `i18n.locales.<locale>.messages.blog.title`                           | [List titles and descriptions](/en/blog/config-blog-list/#archive-messages)          |
| `i18n.locales.<locale>.messages.blog.pageTitle`                       | [List titles and descriptions](/en/blog/config-blog-list/#archive-messages)          |
| `i18n.locales.<locale>.messages.blog.archiveDescription`              | [List titles and descriptions](/en/blog/config-blog-list/#archive-messages)          |
| `i18n.locales.<locale>.messages.blog.pageDescription`                 | [List titles and descriptions](/en/blog/config-blog-list/#archive-messages)          |
| `i18n.locales.<locale>.messages.blog.previous`                        | [Pagination text](/en/blog/config-blog-list/#pagination-messages)                    |
| `i18n.locales.<locale>.messages.blog.next`                            | [Pagination text](/en/blog/config-blog-list/#pagination-messages)                    |
| `i18n.locales.<locale>.messages.blog.paginationAria`                  | [Pagination text](/en/blog/config-blog-list/#pagination-messages)                    |
| `i18n.locales.<locale>.messages.blog.jumpTo`                          | [Pagination text](/en/blog/config-blog-list/#pagination-messages)                    |
| `i18n.locales.<locale>.messages.blog.jumpInputLabel`                  | [Pagination text](/en/blog/config-blog-list/#pagination-messages)                    |
| `i18n.locales.<locale>.messages.blog.jumpGo`                          | [Pagination text](/en/blog/config-blog-list/#pagination-messages)                    |
| `i18n.locales.<locale>.messages.blog.tags`                            | [Tag text](/en/blog/config-blog-list/#tag-messages)                                  |
| `i18n.locales.<locale>.messages.blog.noTags`                          | [Tag text](/en/blog/config-blog-list/#tag-messages)                                  |
| `i18n.locales.<locale>.messages.blog.taggedPosts`                     | [Tag text](/en/blog/config-blog-list/#tag-messages)                                  |
| `theme.toc.enabled`                                                   | [Article feature switches](/en/blog/config-article/#feature-switches)                |
| `theme.math.enabled`                                                  | [Article feature switches](/en/blog/config-article/#feature-switches)                |
| `theme.effects.enableRedQueen`                                        | [Article feature switches](/en/blog/config-article/#feature-switches)                |
| `theme.search.enabled`                                                | [Site-search switch](/en/blog/config-search/#enabled)                                |
| `theme.socialImage.enabled`                                           | [Article feature switches](/en/blog/config-article/#feature-switches)                |
| `site.author`                                                         | [Site and shared-interface settings](/en/blog/config-site-chrome/#identity)          |
| `site.ogImage`                                                        | [Site and shared-interface settings](/en/blog/config-site-chrome/#identity)          |
| `theme.enableAboutPage`                                               | [About switch](/en/blog/config-about/#page-enabled)                                  |
| `theme.footer.showCredits`                                            | [Site and shared-interface settings](/en/blog/config-site-chrome/#footer)            |
| `theme.comments.enabled`                                              | [Giscus settings](/en/blog/config-comments/#controls)                                |
| `i18n.locales.<locale>.messages.blog.rqBadge`                         | [Article messages](/en/blog/config-article/#article-messages)                        |
| `i18n.locales.<locale>.messages.blog.rqReplayAria`                    | [Article messages](/en/blog/config-article/#article-messages)                        |
| `i18n.locales.<locale>.messages.blog.backToTop`                       | [Article messages](/en/blog/config-article/#article-messages)                        |
| `i18n.locales.<locale>.messages.blog.toastP10`                        | [Article messages](/en/blog/config-article/#article-messages)                        |
| `i18n.locales.<locale>.messages.blog.toastP30`                        | [Article messages](/en/blog/config-article/#article-messages)                        |
| `i18n.locales.<locale>.messages.blog.toastP60`                        | [Article messages](/en/blog/config-article/#article-messages)                        |
| `i18n.locales.<locale>.messages.blog.toastDone`                       | [Article messages](/en/blog/config-article/#article-messages)                        |
| `i18n.locales.<locale>.messages.blog.metaPublished`                   | [Article messages](/en/blog/config-article/#article-messages)                        |
| `i18n.locales.<locale>.messages.blog.metaAuthor`                      | [Article messages](/en/blog/config-article/#article-messages)                        |
| `i18n.locales.<locale>.messages.blog.metaUpdated`                     | [Article messages](/en/blog/config-article/#article-messages)                        |
| `i18n.locales.<locale>.messages.blog.systemStatusAria`                | [Article messages](/en/blog/config-article/#article-messages)                        |
| `i18n.locales.<locale>.messages.blog.systemModelLabel`                | [Article messages](/en/blog/config-article/#article-messages)                        |
| `i18n.locales.<locale>.messages.blog.systemModeLabel`                 | [Article messages](/en/blog/config-article/#article-messages)                        |
| `i18n.locales.<locale>.messages.blog.systemStateLabel`                | [Article messages](/en/blog/config-article/#article-messages)                        |
| `i18n.locales.<locale>.messages.blog.promptContextLabel`              | [Article messages](/en/blog/config-article/#article-messages)                        |
| `i18n.locales.<locale>.messages.blog.heroMonitor`                     | [Article messages](/en/blog/config-article/#article-messages)                        |
| `i18n.locales.<locale>.messages.blog.heroSignalSync`                  | [Article messages](/en/blog/config-article/#article-messages)                        |
| `i18n.locales.<locale>.messages.blog.heroModelOnline`                 | [Article messages](/en/blog/config-article/#article-messages)                        |
| `i18n.locales.<locale>.messages.blog.toc`                             | [Article messages](/en/blog/config-article/#article-messages)                        |
| `i18n.locales.<locale>.messages.blog.responseOutput`                  | [Article messages](/en/blog/config-article/#article-messages)                        |
| `i18n.locales.<locale>.messages.blog.statsWords`                      | [Article messages](/en/blog/config-article/#article-messages)                        |
| `i18n.locales.<locale>.messages.blog.statsTokens`                     | [Article messages](/en/blog/config-article/#article-messages)                        |
| `i18n.locales.<locale>.messages.blog.copySectionLink`                 | [Article messages](/en/blog/config-article/#article-messages)                        |
| `i18n.locales.<locale>.messages.blog.regenerate`                      | [Article messages](/en/blog/config-article/#article-messages)                        |
| `i18n.locales.<locale>.messages.blog.relatedAria`                     | [Article messages](/en/blog/config-article/#article-messages)                        |
| `i18n.locales.<locale>.messages.blog.related`                         | [Article messages](/en/blog/config-article/#article-messages)                        |
| `i18n.locales.<locale>.messages.blog.backToBlogAria`                  | [Article messages](/en/blog/config-article/#article-messages)                        |
| `i18n.locales.<locale>.messages.blog.backToBlog`                      | [Article messages](/en/blog/config-article/#article-messages)                        |
| `i18n.locales.<locale>.messages.blog.comments`                        | [Article messages](/en/blog/config-article/#article-messages)                        |
| `i18n.locales.<locale>.messages.blog.metaReadMinutes`                 | [Article messages (currently unused)](/en/blog/config-article/#article-messages)     |
| `i18n.locales.<locale>.messages.blog.latencyLabel`                    | [Article messages (currently unused)](/en/blog/config-article/#article-messages)     |
| `i18n.locales.<locale>.messages.blog.confidenceLabel`                 | [Article messages (currently unused)](/en/blog/config-article/#article-messages)     |
| `i18n.locales.<locale>.messages.codeCopy.copy`                        | [Reading interaction text](/en/blog/config-article/#interaction-messages)            |
| `i18n.locales.<locale>.messages.codeCopy.copied`                      | [Reading interaction text](/en/blog/config-article/#interaction-messages)            |
| `i18n.locales.<locale>.messages.codeCopy.failed`                      | [Reading interaction text](/en/blog/config-article/#interaction-messages)            |
| `i18n.locales.<locale>.messages.imagePreview.open`                    | [Reading interaction text](/en/blog/config-article/#interaction-messages)            |
| `i18n.locales.<locale>.messages.imagePreview.close`                   | [Reading interaction text](/en/blog/config-article/#interaction-messages)            |
| `theme.fragments.pageSize`                                            | [Fragments per page](/en/blog/config-fragments/#page-size)                           |
| `theme.fragments.comments.enabled`                                    | [Fragment comments](/en/blog/config-fragments/#comments-enabled)                     |
| `i18n.locales.<locale>.messages.fragments.description`                | [Fragment messages](/en/blog/config-fragments/#fragment-messages)                    |
| `i18n.locales.<locale>.messages.fragments.empty`                      | [Fragment messages](/en/blog/config-fragments/#fragment-messages)                    |
| `i18n.locales.<locale>.messages.fragments.comments`                   | [Fragment messages](/en/blog/config-fragments/#fragment-messages)                    |
| `i18n.locales.<locale>.messages.fragments.previous`                   | [Fragment messages (currently unused)](/en/blog/config-fragments/#fragment-messages) |
| `i18n.locales.<locale>.messages.fragments.next`                       | [Fragment messages (currently unused)](/en/blog/config-fragments/#fragment-messages) |
| `i18n.locales.<locale>.messages.fragments.loading`                    | [Fragment messages](/en/blog/config-fragments/#fragment-messages)                    |
| `i18n.locales.<locale>.messages.fragments.error`                      | [Fragment messages](/en/blog/config-fragments/#fragment-messages)                    |
| `i18n.locales.<locale>.messages.fragments.retry`                      | [Fragment messages](/en/blog/config-fragments/#fragment-messages)                    |
| `i18n.locales.<locale>.messages.fragments.copyLink`                   | [Fragment messages](/en/blog/config-fragments/#fragment-messages)                    |
| `i18n.locales.<locale>.messages.fragments.linkCopied`                 | [Fragment messages](/en/blog/config-fragments/#fragment-messages)                    |
| `i18n.locales.<locale>.messages.fragments.copyLinkFailed`             | [Fragment messages](/en/blog/config-fragments/#fragment-messages)                    |
| `i18n.locales.<locale>.messages.fragments.notFound`                   | [Fragment messages](/en/blog/config-fragments/#fragment-messages)                    |
| `i18n.locales.<locale>.messages.fragments.indexError`                 | [Fragment messages](/en/blog/config-fragments/#fragment-messages)                    |
| `theme.comments.repo`                                                 | [Giscus settings](/en/blog/config-comments/#connection)                              |
| `theme.comments.repoId`                                               | [Giscus settings](/en/blog/config-comments/#connection)                              |
| `theme.comments.category`                                             | [Giscus settings](/en/blog/config-comments/#connection)                              |
| `theme.comments.categoryId`                                           | [Giscus settings](/en/blog/config-comments/#connection)                              |
| `i18n.locales.<locale>.about.metaLine`                                | [About body](/en/blog/config-about/#body-fields)                                     |
| `i18n.locales.<locale>.about.sections.who`                            | [About body](/en/blog/config-about/#body-fields)                                     |
| `i18n.locales.<locale>.about.sections.what`                           | [About body](/en/blog/config-about/#body-fields)                                     |
| `i18n.locales.<locale>.about.sections.ethos`                          | [About body](/en/blog/config-about/#body-fields)                                     |
| `i18n.locales.<locale>.about.sections.now`                            | [About body](/en/blog/config-about/#body-fields)                                     |
| `i18n.locales.<locale>.about.sections.contactLead`                    | [About body](/en/blog/config-about/#body-fields)                                     |
| `i18n.locales.<locale>.about.sections.signature`                      | [About body](/en/blog/config-about/#body-fields)                                     |
| `i18n.locales.<locale>.about.contact.email`                           | [About contact](/en/blog/config-about/#contact-fields)                               |
| `i18n.locales.<locale>.about.contact.githubUrl`                       | [About contact](/en/blog/config-about/#contact-fields)                               |
| `i18n.locales.<locale>.about.contact.githubLabel`                     | [About contact](/en/blog/config-about/#contact-fields)                               |
| `i18n.locales.<locale>.about.sidebar.dlData`                          | [About tool entries](/en/blog/config-about/#tool-fields)                             |
| `i18n.locales.<locale>.about.sidebar.ai`                              | [About tool entries](/en/blog/config-about/#tool-fields)                             |
| `i18n.locales.<locale>.about.sidebar.decryptor`                       | [About tool entries](/en/blog/config-about/#tool-fields)                             |
| `i18n.locales.<locale>.about.sidebar.help`                            | [About tool entries](/en/blog/config-about/#tool-fields)                             |
| `i18n.locales.<locale>.about.sidebar.allScripts`                      | [About tool entries](/en/blog/config-about/#tool-fields)                             |
| `i18n.locales.<locale>.about.scriptsPath`                             | [About tool entries](/en/blog/config-about/#tool-fields)                             |
| `i18n.locales.<locale>.about.labels.modalOutput`                      | [About common text (check usage status)](/en/blog/config-about/#label-fields)        |
| `i18n.locales.<locale>.about.labels.modalClose`                       | [About common text](/en/blog/config-about/#label-fields)                             |
| `i18n.locales.<locale>.about.labels.responseOutput`                   | [About common text](/en/blog/config-about/#label-fields)                             |
| `i18n.locales.<locale>.about.labels.contactEmailLead`                 | [About common text](/en/blog/config-about/#label-fields)                             |
| `i18n.locales.<locale>.about.labels.contactConnectLead`               | [About common text](/en/blog/config-about/#label-fields)                             |
| `i18n.locales.<locale>.about.labels.backToTop`                        | [About common text](/en/blog/config-about/#label-fields)                             |
| `i18n.locales.<locale>.about.labels.quickAccess`                      | [About common text](/en/blog/config-about/#label-fields)                             |
| `i18n.locales.<locale>.about.labels.contactEmailLabel`                | [About common text](/en/blog/config-about/#label-fields)                             |
| `i18n.locales.<locale>.about.modals.dlData.title`                     | [About tool dialogs](/en/blog/config-about/#modal-fields)                            |
| `i18n.locales.<locale>.about.modals.dlData.subtitle`                  | [About tool dialogs](/en/blog/config-about/#modal-fields)                            |
| `i18n.locales.<locale>.about.modals.ai.title`                         | [About tool dialogs](/en/blog/config-about/#modal-fields)                            |
| `i18n.locales.<locale>.about.modals.ai.lines`                         | [About tool dialogs](/en/blog/config-about/#modal-fields)                            |
| `i18n.locales.<locale>.about.modals.decryptor.title`                  | [About tool dialogs](/en/blog/config-about/#modal-fields)                            |
| `i18n.locales.<locale>.about.modals.decryptor.header`                 | [About tool dialogs (check usage status)](/en/blog/config-about/#modal-fields)       |
| `i18n.locales.<locale>.about.modals.decryptor.keysLabel`              | [About tool dialogs (check usage status)](/en/blog/config-about/#modal-fields)       |
| `i18n.locales.<locale>.about.modals.decryptor.currentPassphraseLabel` | [About tool dialogs (check usage status)](/en/blog/config-about/#modal-fields)       |
| `i18n.locales.<locale>.about.modals.decryptor.masterKeyLabel`         | [About tool dialogs (check usage status)](/en/blog/config-about/#modal-fields)       |
| `i18n.locales.<locale>.about.modals.decryptor.transientKeyLabel`      | [About tool dialogs (check usage status)](/en/blog/config-about/#modal-fields)       |
| `i18n.locales.<locale>.about.modals.help.title`                       | [About tool dialogs](/en/blog/config-about/#modal-fields)                            |
| `i18n.locales.<locale>.about.modals.help.statsLabel`                  | [About tool dialogs](/en/blog/config-about/#modal-fields)                            |
| `i18n.locales.<locale>.about.modals.help.typedPrefix`                 | [About tool dialogs](/en/blog/config-about/#modal-fields)                            |
| `i18n.locales.<locale>.about.modals.help.typedSuffix`                 | [About tool dialogs](/en/blog/config-about/#modal-fields)                            |
| `i18n.locales.<locale>.about.modals.allScripts.title`                 | [About tool dialogs](/en/blog/config-about/#modal-fields)                            |
| `i18n.locales.<locale>.about.effects.backgroundLines`                 | [About effects (check usage status)](/en/blog/config-about/#effect-fields)           |
| `i18n.locales.<locale>.about.effects.scrollToasts.p30`                | [About effects](/en/blog/config-about/#effect-fields)                                |
| `i18n.locales.<locale>.about.effects.scrollToasts.p60`                | [About effects](/en/blog/config-about/#effect-fields)                                |
| `i18n.locales.<locale>.about.effects.scrollToasts.p90`                | [About effects](/en/blog/config-about/#effect-fields)                                |
| `i18n.locales.<locale>.messages.about.title`                          | [About and shared controls](/en/blog/config-about/#about-messages)                   |
| `i18n.locales.<locale>.messages.about.description`                    | [About and shared controls](/en/blog/config-about/#about-messages)                   |
| `i18n.locales.<locale>.messages.about.who`                            | [About and shared controls](/en/blog/config-about/#about-messages)                   |
| `i18n.locales.<locale>.messages.about.what`                           | [About and shared controls](/en/blog/config-about/#about-messages)                   |
| `i18n.locales.<locale>.messages.about.ethos`                          | [About and shared controls](/en/blog/config-about/#about-messages)                   |
| `i18n.locales.<locale>.messages.about.now`                            | [About and shared controls](/en/blog/config-about/#about-messages)                   |
| `i18n.locales.<locale>.messages.about.contact`                        | [About and shared controls](/en/blog/config-about/#about-messages)                   |
| `i18n.locales.<locale>.messages.about.regenerate`                     | [About and shared controls](/en/blog/config-about/#about-messages)                   |
| `i18n.locales.<locale>.messages.windowControls.collapse`              | [About and shared controls](/en/blog/config-about/#about-messages)                   |
| `i18n.locales.<locale>.messages.windowControls.expand`                | [About and shared controls](/en/blog/config-about/#about-messages)                   |
| `i18n.locales.<locale>.messages.windowControls.restore`               | [About and shared controls](/en/blog/config-about/#about-messages)                   |
| `i18n.locales.<locale>.messages.windowControls.fullscreen`            | [About and shared controls](/en/blog/config-about/#about-messages)                   |
| `i18n.locales.<locale>.messages.scriptFolders.copyTitle`              | [About and shared controls](/en/blog/config-about/#about-messages)                   |
| `i18n.locales.<locale>.messages.scriptFolders.copied`                 | [About and shared controls](/en/blog/config-about/#about-messages)                   |
| `i18n.locales.<locale>.messages.scriptFolders.failed`                 | [About and shared controls](/en/blog/config-about/#about-messages)                   |
| `theme.enableDecoderPage`                                             | [Decoder switch](/en/blog/config-decoder/#page-enabled)                              |
| `i18n.locales.<locale>.messages.nav.about`                            | [Site and shared-interface settings](/en/blog/config-site-chrome/#chrome-messages)   |
| `i18n.locales.<locale>.messages.decoder.input`                        | [Decoder messages](/en/blog/config-decoder/#text-messages)                           |
| `i18n.locales.<locale>.messages.decoder.placeholder`                  | [Decoder messages](/en/blog/config-decoder/#text-messages)                           |
| `i18n.locales.<locale>.messages.decoder.format`                       | [Decoder messages](/en/blog/config-decoder/#text-messages)                           |
| `i18n.locales.<locale>.messages.decoder.auto`                         | [Decoder messages](/en/blog/config-decoder/#text-messages)                           |
| `i18n.locales.<locale>.messages.decoder.decode`                       | [Decoder messages](/en/blog/config-decoder/#text-messages)                           |
| `i18n.locales.<locale>.messages.decoder.clear`                        | [Decoder messages](/en/blog/config-decoder/#text-messages)                           |
| `i18n.locales.<locale>.messages.decoder.copy`                         | [Decoder messages](/en/blog/config-decoder/#text-messages)                           |
| `i18n.locales.<locale>.messages.decoder.reuse`                        | [Decoder messages](/en/blog/config-decoder/#text-messages)                           |
| `i18n.locales.<locale>.messages.decoder.supported`                    | [Decoder messages](/en/blog/config-decoder/#text-messages)                           |
| `i18n.locales.<locale>.messages.decoder.html`                         | [Decoder messages](/en/blog/config-decoder/#text-messages)                           |
| `i18n.locales.<locale>.messages.decoder.unicode`                      | [Decoder messages](/en/blog/config-decoder/#text-messages)                           |
| `i18n.locales.<locale>.messages.decoder.jwtWarning`                   | [Decoder messages](/en/blog/config-decoder/#text-messages)                           |
| `i18n.locales.<locale>.messages.decoder.copied`                       | [Decoder messages](/en/blog/config-decoder/#text-messages)                           |
| `i18n.locales.<locale>.messages.decoder.copyFailed`                   | [Decoder messages](/en/blog/config-decoder/#text-messages)                           |
| `i18n.locales.<locale>.messages.decoder.output`                       | [Decoder messages](/en/blog/config-decoder/#text-messages)                           |
| `i18n.locales.<locale>.messages.decoder.local`                        | [Decoder messages](/en/blog/config-decoder/#text-messages)                           |
| `i18n.locales.<locale>.messages.decoder.ready`                        | [Decoder messages](/en/blog/config-decoder/#text-messages)                           |
| `i18n.locales.<locale>.messages.decoder.running`                      | [Decoder messages](/en/blog/config-decoder/#text-messages)                           |
| `i18n.locales.<locale>.messages.decoder.done`                         | [Decoder messages](/en/blog/config-decoder/#text-messages)                           |
| `i18n.locales.<locale>.messages.decoder.empty`                        | [Decoder messages](/en/blog/config-decoder/#text-messages)                           |
| `i18n.locales.<locale>.messages.decoder.tooLong`                      | [Decoder messages](/en/blog/config-decoder/#text-messages)                           |
| `i18n.locales.<locale>.messages.decoder.invalid`                      | [Decoder messages](/en/blog/config-decoder/#text-messages)                           |
| `i18n.locales.<locale>.messages.decoder.binary`                       | [Decoder messages](/en/blog/config-decoder/#text-messages)                           |
| `i18n.locales.<locale>.messages.decoder.unknown`                      | [Decoder messages](/en/blog/config-decoder/#text-messages)                           |
| `i18n.locales.<locale>.messages.decoder.ambiguous`                    | [Decoder messages](/en/blog/config-decoder/#text-messages)                           |
| `i18n.locales.<locale>.messages.decoder.example`                      | [Decoder messages](/en/blog/config-decoder/#text-messages)                           |
| `i18n.locales.<locale>.messages.decoderPage.description`              | [Decoder messages](/en/blog/config-decoder/#page-messages)                           |
| `i18n.locales.<locale>.messages.decoderPage.fullTool`                 | [Decoder messages](/en/blog/config-decoder/#page-messages)                           |
| `i18n.locales.<locale>.messages.decoderPage.task`                     | [Decoder messages](/en/blog/config-decoder/#page-messages)                           |
| `i18n.locales.<locale>.messages.decoderPage.textTask`                 | [Decoder messages](/en/blog/config-decoder/#page-messages)                           |
| `i18n.locales.<locale>.messages.decoderPage.callTask`                 | [Decoder messages](/en/blog/config-decoder/#page-messages)                           |
| `i18n.locales.<locale>.messages.decoderPage.addressTask`              | [Decoder messages](/en/blog/config-decoder/#page-messages)                           |
| `i18n.locales.<locale>.messages.decoderPage.addressHint`              | [Decoder messages](/en/blog/config-decoder/#page-messages)                           |
| `i18n.locales.<locale>.messages.decoderPage.chain`                    | [Decoder messages](/en/blog/config-decoder/#page-messages)                           |
| `i18n.locales.<locale>.messages.decoderPage.decimals`                 | [Decoder messages](/en/blog/config-decoder/#page-messages)                           |
| `i18n.locales.<locale>.messages.decoderPage.precisionHint`            | [Decoder messages](/en/blog/config-decoder/#page-messages)                           |
| `i18n.locales.<locale>.messages.decoderPage.network`                  | [Decoder messages](/en/blog/config-decoder/#page-messages)                           |
| `i18n.locales.<locale>.messages.decoderPage.history`                  | [Decoder messages](/en/blog/config-decoder/#page-messages)                           |
| `i18n.locales.<locale>.messages.decoderPage.back`                     | [Decoder messages](/en/blog/config-decoder/#page-messages)                           |
| `i18n.locales.<locale>.messages.decoderPage.export`                   | [Decoder messages](/en/blog/config-decoder/#page-messages)                           |
| `i18n.locales.<locale>.messages.decoderPage.limits`                   | [Decoder messages](/en/blog/config-decoder/#page-messages)                           |
| `i18n.locales.<locale>.messages.decoderPage.callNotice`               | [Decoder messages](/en/blog/config-decoder/#page-messages)                           |
| `i18n.locales.<locale>.messages.decoderPage.addressNotice`            | [Decoder messages](/en/blog/config-decoder/#page-messages)                           |
| `i18n.locales.<locale>.messages.decoderPage.unsupported`              | [Decoder messages](/en/blog/config-decoder/#page-messages)                           |
| `i18n.locales.<locale>.messages.decoderPage.checksum`                 | [Decoder messages](/en/blog/config-decoder/#page-messages)                           |
| `i18n.locales.<locale>.messages.decoderPage.length`                   | [Decoder messages](/en/blog/config-decoder/#page-messages)                           |
| `i18n.locales.<locale>.messages.decoderPage.wrongNetwork`             | [Decoder messages](/en/blog/config-decoder/#page-messages)                           |
| `i18n.locales.<locale>.messages.decoderPage.stepLimit`                | [Decoder messages](/en/blog/config-decoder/#page-messages)                           |
| `i18n.locales.<locale>.messages.decoderPage.budget`                   | [Decoder messages](/en/blog/config-decoder/#page-messages)                           |
| `i18n.locales.<locale>.messages.decoderPage.addressParse`             | [Decoder messages](/en/blog/config-decoder/#page-messages)                           |
| `i18n.locales.<locale>.messages.decoderPage.addressCheck`             | [Decoder messages](/en/blog/config-decoder/#page-messages)                           |
| `i18n.locales.<locale>.messages.decoderPage.addressResult`            | [Decoder messages](/en/blog/config-decoder/#page-messages)                           |
| `i18n.locales.<locale>.messages.decoderPage.callParse`                | [Decoder messages](/en/blog/config-decoder/#page-messages)                           |
| `i18n.locales.<locale>.messages.decoderPage.rawOnly`                  | [Decoder messages](/en/blog/config-decoder/#page-messages)                           |
| `i18n.locales.<locale>.messages.decoderPage.amountResult`             | [Decoder messages](/en/blog/config-decoder/#page-messages)                           |
| `i18n.locales.<locale>.messages.decoderPage.inputHint`                | [Decoder messages](/en/blog/config-decoder/#page-messages)                           |
| `i18n.locales.<locale>.messages.decoderPage.loadFailed`               | [Decoder messages](/en/blog/config-decoder/#page-messages)                           |
| `i18n.locales.<locale>.messages.decoderPage.readings.tribute`         | [Decoder reading area](/en/blog/config-decoder/#readings)                            |
| `i18n.locales.<locale>.messages.decoderPage.readings.links`           | [Decoder reading area](/en/blog/config-decoder/#readings)                            |
| `i18n.locales.<locale>.messages.decoderPage.readings.links[].title`   | [Decoder reading area](/en/blog/config-decoder/#readings)                            |
| `i18n.locales.<locale>.messages.decoderPage.readings.links[].href`    | [Decoder reading area](/en/blog/config-decoder/#readings)                            |
| `i18n.locales.<locale>.messages.decoderPage.readings.links[].author`  | [Decoder reading area](/en/blog/config-decoder/#readings)                            |
| `i18n.locales.<locale>.messages.decoderPage.readings.links[].year`    | [Decoder reading area](/en/blog/config-decoder/#readings)                            |
| `i18n.locales.<locale>.messages.decoderPage.readings.links[].cover`   | [Decoder reading area](/en/blog/config-decoder/#readings)                            |
| `theme.music.enabled`                                                 | [Music settings](/en/blog/config-music/#enabled)                                     |
| `theme.music.tracks`                                                  | [Music settings](/en/blog/config-music/#tracks)                                      |
| `theme.music.tracks[].title`                                          | [Music settings](/en/blog/config-music/#track-fields)                                |
| `theme.music.tracks[].artist`                                         | [Music settings](/en/blog/config-music/#track-fields)                                |
| `theme.music.tracks[].src`                                            | [Music settings](/en/blog/config-music/#track-fields)                                |
| `i18n.locales.<locale>.messages.music.label`                          | [Music messages](/en/blog/config-music/#music-messages)                              |
| `i18n.locales.<locale>.messages.music.play`                           | [Music messages](/en/blog/config-music/#music-messages)                              |
| `i18n.locales.<locale>.messages.music.pause`                          | [Music messages](/en/blog/config-music/#music-messages)                              |
| `i18n.locales.<locale>.messages.music.prev`                           | [Music messages](/en/blog/config-music/#music-messages)                              |
| `i18n.locales.<locale>.messages.music.next`                           | [Music messages](/en/blog/config-music/#music-messages)                              |
| `i18n.locales.<locale>.messages.music.open`                           | [Music messages](/en/blog/config-music/#music-messages)                              |
| `i18n.locales.<locale>.messages.music.close`                          | [Music messages](/en/blog/config-music/#music-messages)                              |
| `i18n.locales.<locale>.messages.music.progress`                       | [Music messages](/en/blog/config-music/#music-messages)                              |
| `i18n.locales.<locale>.messages.music.volume`                         | [Music messages](/en/blog/config-music/#music-messages)                              |
| `i18n.locales.<locale>.messages.music.queue`                          | [Music messages](/en/blog/config-music/#music-messages)                              |
| `i18n.locales.<locale>.messages.music.mute`                           | [Music messages](/en/blog/config-music/#music-messages)                              |
| `i18n.locales.<locale>.messages.music.unmute`                         | [Music messages](/en/blog/config-music/#music-messages)                              |
| `i18n.locales.<locale>.messages.music.idle`                           | [Music messages](/en/blog/config-music/#music-messages)                              |
| `i18n.locales.<locale>.messages.music.loading`                        | [Music messages](/en/blog/config-music/#music-messages)                              |
| `i18n.locales.<locale>.messages.music.playing`                        | [Music messages](/en/blog/config-music/#music-messages)                              |
| `i18n.locales.<locale>.messages.music.paused`                         | [Music messages](/en/blog/config-music/#music-messages)                              |
| `i18n.locales.<locale>.messages.music.blocked`                        | [Music messages](/en/blog/config-music/#music-messages)                              |
| `i18n.locales.<locale>.messages.music.error`                          | [Music messages](/en/blog/config-music/#music-messages)                              |
| `i18n.locales.<locale>.messages.music.noScript`                       | [Music messages](/en/blog/config-music/#music-messages)                              |
| `theme.comments.shareAcrossLocales`                                   | [Giscus settings](/en/blog/config-comments/#sharing)                                 |
| `theme.comments.mapping`                                              | [Giscus settings](/en/blog/config-comments/#mapping)                                 |
| `theme.comments.term`                                                 | [Giscus settings](/en/blog/config-comments/#mapping)                                 |
| `theme.comments.number`                                               | [Giscus settings](/en/blog/config-comments/#mapping)                                 |
| `theme.comments.strict`                                               | [Giscus settings](/en/blog/config-comments/#mapping)                                 |
| `theme.comments.reactionsEnabled`                                     | [Giscus settings](/en/blog/config-comments/#appearance)                              |
| `theme.comments.emitMetadata`                                         | [Giscus settings](/en/blog/config-comments/#appearance)                              |
| `theme.comments.inputPosition`                                        | [Giscus settings](/en/blog/config-comments/#appearance)                              |
| `theme.comments.theme`                                                | [Giscus settings](/en/blog/config-comments/#appearance)                              |
| `theme.comments.lang`                                                 | [Giscus settings](/en/blog/config-comments/#appearance)                              |
| `theme.comments.loading`                                              | [Giscus settings](/en/blog/config-comments/#appearance)                              |
| `theme.comments.crossorigin`                                          | [Giscus settings](/en/blog/config-comments/#appearance)                              |
| `i18n.defaultLocale`                                                  | [Language and fallback settings](/en/blog/config-languages/#registry)                |
| `i18n.locales`                                                        | [Language and fallback settings](/en/blog/config-languages/#registry)                |
| `i18n.locales.<locale>`                                               | [Language and fallback settings](/en/blog/config-languages/#registry)                |
| `i18n.routing.defaultLocalePrefix`                                    | [Language and fallback settings](/en/blog/config-languages/#routing)                 |
| `i18n.locales.<locale>.meta`                                          | [Language and fallback settings](/en/blog/config-languages/#meta)                    |
| `i18n.locales.<locale>.meta.label`                                    | [Language and fallback settings](/en/blog/config-languages/#meta)                    |
| `i18n.locales.<locale>.meta.hreflang`                                 | [Language and fallback settings](/en/blog/config-languages/#meta)                    |
| `i18n.locales.<locale>.meta.ogLocale`                                 | [Language and fallback settings](/en/blog/config-languages/#meta)                    |
| `i18n.locales.<locale>.meta.enabled`                                  | [Language and fallback settings](/en/blog/config-languages/#meta)                    |
| `i18n.locales.<locale>.meta.fallback`                                 | [Language and fallback settings](/en/blog/config-languages/#fallback)                |
| `i18n.locales.<locale>.site`                                          | [Language and fallback settings](/en/blog/config-languages/#overrides)               |
| `i18n.locales.<locale>.messages`                                      | [Language and fallback settings](/en/blog/config-languages/#overrides)               |
| `i18n.locales.<locale>.about`                                         | [Language and fallback settings](/en/blog/config-languages/#overrides)               |
| `i18n.locales.<locale>.messages.langLabel`                            | [Language and fallback settings](/en/blog/config-languages/#common-messages)         |
| `i18n.locales.<locale>.aiReadableContent`                             | [GA4 and AI-readable context](/en/blog/config-analytics-ai/#locale-supplement)       |
| `i18n.locales.<locale>.aiReadableContent.notes`                       | [GA4 and AI-readable context](/en/blog/config-analytics-ai/#locale-supplement)       |
| `i18n.locales.<locale>.aiReadableContent.links`                       | [GA4 and AI-readable context](/en/blog/config-analytics-ai/#locale-supplement)       |
| `i18n.locales.<locale>.aiReadableContent.links[].label`               | [GA4 and AI-readable context](/en/blog/config-analytics-ai/#locale-supplement)       |
| `i18n.locales.<locale>.aiReadableContent.links[].href`                | [GA4 and AI-readable context](/en/blog/config-analytics-ai/#locale-supplement)       |
| `i18n.locales.<locale>.messages.search.label`                         | [Search messages](/en/blog/config-search/#messages)                                  |
| `i18n.locales.<locale>.messages.search.close`                         | [Search messages](/en/blog/config-search/#messages)                                  |
| `i18n.locales.<locale>.messages.search.placeholder`                   | [Search messages](/en/blog/config-search/#messages)                                  |
| `i18n.locales.<locale>.messages.search.hint`                          | [Search messages](/en/blog/config-search/#messages)                                  |
| `i18n.locales.<locale>.messages.search.loading`                       | [Search messages](/en/blog/config-search/#messages)                                  |
| `i18n.locales.<locale>.messages.search.empty`                         | [Search messages](/en/blog/config-search/#messages)                                  |
| `i18n.locales.<locale>.messages.search.error`                         | [Search messages](/en/blog/config-search/#messages)                                  |
| `i18n.locales.<locale>.messages.search.retry`                         | [Search messages](/en/blog/config-search/#messages)                                  |
| `i18n.locales.<locale>.messages.search.more`                          | [Search messages](/en/blog/config-search/#messages)                                  |
| `i18n.locales.<locale>.messages.search.results`                       | [Search messages](/en/blog/config-search/#messages)                                  |
| `i18n.locales.<locale>.messages.search.dev`                           | [Search messages](/en/blog/config-search/#messages)                                  |
| `analytics`                                                           | [GA4 and AI-readable context](/en/blog/config-analytics-ai/#analytics)               |
| `analytics.googleAnalyticsId`                                         | [GA4 and AI-readable context](/en/blog/config-analytics-ai/#analytics)               |
| `aiReadableContent`                                                   | [GA4 and AI-readable context](/en/blog/config-analytics-ai/#supplement)              |
| `aiReadableContent.notes`                                             | [GA4 and AI-readable context](/en/blog/config-analytics-ai/#supplement)              |
| `aiReadableContent.links`                                             | [GA4 and AI-readable context](/en/blog/config-analytics-ai/#supplement)              |
| `aiReadableContent.links[].label`                                     | [GA4 and AI-readable context](/en/blog/config-analytics-ai/#supplement)              |
| `aiReadableContent.links[].href`                                      | [GA4 and AI-readable context](/en/blog/config-analytics-ai/#supplement)              |
| `site.title`                                                          | [Site and shared-interface settings](/en/blog/config-site-chrome/#identity)          |
| `site.description`                                                    | [Site and shared-interface settings](/en/blog/config-site-chrome/#identity)          |
| `site.url`                                                            | [Site and shared-interface settings](/en/blog/config-site-chrome/#identity)          |
| `site.tagline`                                                        | [Site and shared-interface settings](/en/blog/config-site-chrome/#identity)          |
| `social.links`                                                        | [Site and shared-interface settings](/en/blog/config-site-chrome/#social)            |
| `social.links[].href`                                                 | [Site and shared-interface settings](/en/blog/config-site-chrome/#social-fields)     |
| `social.links[].label`                                                | [Site and shared-interface settings](/en/blog/config-site-chrome/#social-fields)     |
| `social.links[].rel`                                                  | [Site and shared-interface settings](/en/blog/config-site-chrome/#social-fields)     |
| `social.links[].icon`                                                 | [Site and shared-interface settings](/en/blog/config-site-chrome/#social-fields)     |
| `social.links[].iconSrc`                                              | [Site and shared-interface settings](/en/blog/config-site-chrome/#social-fields)     |
| `theme.footer.links`                                                  | [Site and shared-interface settings](/en/blog/config-site-chrome/#footer)            |
| `theme.footer.links[].label`                                          | [Site and shared-interface settings](/en/blog/config-site-chrome/#footer)            |
| `theme.footer.links[].href`                                           | [Site and shared-interface settings](/en/blog/config-site-chrome/#footer)            |
| `i18n.locales.<locale>.messages.nav.home`                             | [Site and shared-interface settings](/en/blog/config-site-chrome/#chrome-messages)   |
| `i18n.locales.<locale>.messages.nav.blog`                             | [Site and shared-interface settings](/en/blog/config-site-chrome/#chrome-messages)   |
| `i18n.locales.<locale>.messages.nav.status`                           | [Site and shared-interface settings](/en/blog/config-site-chrome/#chrome-messages)   |
| `i18n.locales.<locale>.messages.nav.statusAria`                       | [Site and shared-interface settings](/en/blog/config-site-chrome/#chrome-messages)   |
| `i18n.locales.<locale>.messages.footer.theme`                         | [Site and shared-interface settings](/en/blog/config-site-chrome/#chrome-messages)   |
| `i18n.locales.<locale>.messages.footer.builtWith`                     | [Site and shared-interface settings](/en/blog/config-site-chrome/#chrome-messages)   |
| `i18n.locales.<locale>.messages.terminal.commandInput`                | [Terminal messages](/en/blog/config-terminal/#messages)                              |
| `i18n.locales.<locale>.messages.terminal.hint`                        | [Terminal messages](/en/blog/config-terminal/#messages)                              |
| `i18n.locales.<locale>.messages.terminal.help`                        | [Terminal messages](/en/blog/config-terminal/#messages)                              |
| `i18n.locales.<locale>.messages.terminal.syntax`                      | [Terminal messages](/en/blog/config-terminal/#messages)                              |
| `i18n.locales.<locale>.messages.terminal.usage`                       | [Terminal messages](/en/blog/config-terminal/#messages)                              |
| `i18n.locales.<locale>.messages.terminal.unknown`                     | [Terminal messages](/en/blog/config-terminal/#messages)                              |
| `i18n.locales.<locale>.messages.terminal.notFound`                    | [Terminal messages](/en/blog/config-terminal/#messages)                              |
| `i18n.locales.<locale>.messages.terminal.notDirectory`                | [Terminal messages](/en/blog/config-terminal/#messages)                              |
| `i18n.locales.<locale>.messages.terminal.isDirectory`                 | [Terminal messages](/en/blog/config-terminal/#messages)                              |
| `i18n.locales.<locale>.messages.terminal.failed`                      | [Terminal messages](/en/blog/config-terminal/#messages)                              |
| `i18n.locales.<locale>.messages.terminal.tooLarge`                    | [Terminal messages](/en/blog/config-terminal/#messages)                              |
| `i18n.locales.<locale>.messages.terminal.empty`                       | [Terminal messages](/en/blog/config-terminal/#messages)                              |
| `i18n.locales.<locale>.messages.terminal.loading`                     | [Terminal messages](/en/blog/config-terminal/#messages)                              |
| `i18n.locales.<locale>.messages.terminal.readerTitle`                 | [Terminal messages (currently unused)](/en/blog/config-terminal/#messages)           |
| `i18n.locales.<locale>.messages.terminal.readerHint`                  | [Terminal messages](/en/blog/config-terminal/#messages)                              |
| `i18n.locales.<locale>.messages.terminal.readerCommand`               | [Terminal messages](/en/blog/config-terminal/#messages)                              |

## Look up article fields separately

Article frontmatter does not belong in the preceding site.config table: [content, dates and images](/en/blog/config-article/#frontmatter), [OUTPUT statistics/status](/en/blog/config-article/#output-fields), and [compatibility/unused fields](/en/blog/config-article/#legacy-frontmatter).

The three fragment frontmatter fields are documented separately under [fragment content](/en/blog/config-fragments/#content-fields); do not mix them with article fields.

Per-article site-search inclusion uses [search](/en/blog/config-search/#article-search), not a site.config field or privacy switch.

## How to read field entries

Every module follows the same conventions: full path, type, theme default, actual purpose, restrictions, conditions and examples. A field without a consumer must not be described as active merely because its type is accepted.

| Status           | Meaning                                                                                                    |
| ---------------- | ---------------------------------------------------------------------------------------------------------- |
| Active           | Consumed by the current implementation.                                                                    |
| Conditional      | Requires a feature/page condition or no higher-priority override.                                          |
| Currently unused | Accepted by types without a current effect; do not set it expecting a visible change.                      |
| Compatibility    | Retained for an explicit compatibility purpose; the entry states what remains and whether it is displayed. |

Theme defaults come from package configuration or built-in messages. The starter may override them, and the demo has personal overrides again. Demo author names, titles and playlists are not every new blog's defaults.

Language defaults vary by locale and fallback chain. Entries identify unset values, built-in current-language messages or exact values. Tables showing only Simplified Chinese/English say so instead of presenting them as universal defaults.

## Where do settings go, and how are they merged?

Merge fragments into the existing `defineThemeConfig({...})` in `src/site.config.ts`. Keep imports, exports and personal configuration, without duplicating theme/i18n in one object.

Objects merge recursively, omitted fields retain defaults, arrays replace whole arrays, and undefined overrides are skipped. Empty strings, empty arrays and false have field-specific meanings, not a universal “restore default” meaning. Empty homepage hero clears text, while blank homeTitle continues fallback.

Check the affected page in dev after changes; environment overrides require restarting dev. Production changes need a rebuild and deployment, not merely saving local configuration.

Article frontmatter, Astro configuration and environment variables have different locations. References explain relationships without pretending they are site.config fields. See [installation/upgrades](/en/blog/starter-guide-1-configure-your-site/) and [local preview/deployment](/en/blog/starter-guide-deployment/).
