---
tags: ['anglefeint', 'config']
title: '配置字典：我想改的东西在哪里？'
subtitle: '按页面、功能或完整配置路径，找到 site.config 中的设置。'
description: 'Anglefeint 配置参考总入口，区分配置位置、默认值和生效状态，并提供已整理模块的字段索引。'
pubDate: '2026-11-13'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/hacker-01.webp'
---

**版本说明：** 本字典以当前源码为准。实时减弱动画、`blogPageSize` 严格校验和关闭 Fragments 后的图片隔离从 0.36.1 起提供，0.36.0 不包含。默认安装和 CLI 用法不变。

如果你已经知道想完成什么，先看操作教程；如果你在找一个字段的含义、默认值或限制，从这里查配置字典。两者都以当前主题代码为准，不要求先阅读仓库说明文件。

第一次使用请从[八篇教程总入口](/zh/blog/starter-guide-1-configure-your-site/#tutorial-order)按顺序阅读：安装 → 写文章 → 添加图片 → 发布碎片 → 调整页面与功能 → 评论 → 多语言 → 部署。可选功能不必全部启用；本字典用于随时查字段，不要求从头读完整份路径表。

目前已完成[首页配置](/zh/blog/config-home/)、[Blog List 与标签列表配置](/zh/blog/config-blog-list/)、[文章详情页配置](/zh/blog/config-article/)、[Fragments 配置](/zh/blog/config-fragments/)、[About 配置](/zh/blog/config-about/)、[Decoder 配置](/zh/blog/config-decoder/)、[音乐播放器配置](/zh/blog/config-music/)、[Giscus 评论配置](/zh/blog/config-comments/)、[语言与回退配置](/zh/blog/config-languages/)、[搜索与内容发现配置](/zh/blog/config-search/)、[GA4 与 AI 阅读补充配置](/zh/blog/config-analytics-ai/)、[站点与公共界面配置](/zh/blog/config-site-chrome/)和[终端配置](/zh/blog/config-terminal/)。

## 按页面或功能查找

| 我想修改                                           | 字典状态                                            | 现有操作教程                                                                                                                            |
| -------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| 首页标题、介绍、最新文章、启动提示、终端文字与穿越 | [首页配置字典](/zh/blog/config-home/)               | [页面与功能定制](/zh/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                            |
| 站点名称、域名、公共导航、社交和页脚               | [站点与公共界面字典](/zh/blog/config-site-chrome/)  | [安装与站点信息](/zh/blog/starter-guide-1-configure-your-site/)、[页面定制](/zh/blog/starter-guide-3-comments-about-and-theme-toggles/) |
| Blog List、标签列表和分页                          | [列表配置字典](/zh/blog/config-blog-list/)          | [列表与分页设置](/zh/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                            |
| 文章详情、目录、数学和阅读效果                     | [文章配置字典](/zh/blog/config-article/)            | [写第一篇文章](/zh/blog/starter-guide-2-languages-and-routing/)                                                                         |
| Fragments 列表与预览                               | [Fragments 字典](/zh/blog/config-fragments/)        | [发布一条碎片](/zh/blog/starter-guide-5-fragments/)                                                                                     |
| About 正文、联系、侧栏和工具                       | [About 字典](/zh/blog/config-about/)                | [页面与功能定制](/zh/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                            |
| About 终端、命令提示与只读阅读器                   | [终端字典](/zh/blog/config-terminal/)               | [页面与功能定制](/zh/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                            |
| Decoder 页面与阅读卡片                             | [Decoder 字典](/zh/blog/config-decoder/)            | [页面与功能定制](/zh/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                            |
| 音乐播放器                                         | [音乐播放器字典](/zh/blog/config-music/)            | [音乐设置](/zh/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                                  |
| Giscus 评论和多语言讨论共享                        | [Giscus 评论字典](/zh/blog/config-comments/)        | [让读者留下评论](/zh/blog/starter-guide-4-giscus-comments/)                                                                             |
| 语言启停、地址、界面翻译和回退                     | [语言配置字典](/zh/blog/config-languages/)          | [多语言教程](/zh/blog/starter-guide-languages/)                                                                                         |
| 搜索与内容发现                                     | [搜索配置字典](/zh/blog/config-search/)             | [写文章](/zh/blog/starter-guide-2-languages-and-routing/)、[部署](/zh/blog/starter-guide-deployment/)                                   |
| GA4 访问统计、AI 阅读补充说明                      | [GA4 与 AI 补充字典](/zh/blog/config-analytics-ai/) | [发布到自己的域名](/zh/blog/starter-guide-deployment/)                                                                                  |

同一个字段会有一个主要说明位置；其他模块引用它时提供链接。例如首页使用碎片开关，但这个开关还影响完整碎片列表，不能当成首页专用字段。

## 按完整配置路径查找

下面按当前公开配置类型提供路径索引，包括当前未使用的字段。点击进入主要说明位置；跨页面的用法差异在对应模块交叉引用。`<语言>` 是占位，换成 zh、en 等实际代码。文章 frontmatter 另列，不混入 site.config 路径。

| 完整路径                                                            | 查阅位置                                                                |
| ------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `i18n.locales.<语言>.site.homeTitle`                                | [首页大标题](/zh/blog/config-home/#home-title)                          |
| `i18n.locales.<语言>.site.hero`                                     | [首页可见介绍](/zh/blog/config-home/#home-hero)                         |
| `i18n.locales.<语言>.messages.siteDescription`                      | [首页元描述](/zh/blog/config-home/#home-description)                    |
| `theme.homeLatestCount`                                             | [最新文章数量](/zh/blog/config-home/#latest-count)                      |
| `theme.home.showInitialize`                                         | [启动提示开关](/zh/blog/config-home/#startup-switches)                  |
| `theme.home.showFollow`                                             | [启动提示开关](/zh/blog/config-home/#startup-switches)                  |
| `theme.home.showTrace`                                              | [启动提示开关](/zh/blog/config-home/#startup-switches)                  |
| `theme.effects.enableHomePassage`                                   | [点击穿越](/zh/blog/config-home/#home-passage)                          |
| `i18n.locales.<语言>.messages.home.latest`                          | [首页界面文案](/zh/blog/config-home/#home-messages)                     |
| `i18n.locales.<语言>.messages.home.viewAll`                         | [首页界面文案](/zh/blog/config-home/#home-messages)                     |
| `i18n.locales.<语言>.messages.home.noPosts`                         | [首页界面文案](/zh/blog/config-home/#home-messages)                     |
| `i18n.locales.<语言>.messages.home.openDoor`                        | [首页界面文案](/zh/blog/config-home/#home-messages)                     |
| `i18n.locales.<语言>.messages.home.transmission`                    | [宽屏终端文字](/zh/blog/config-home/#home-transmission)                 |
| `i18n.locales.<语言>.messages.home.hero`                            | [介绍的备用文案](/zh/blog/config-home/#message-hero)                    |
| `theme.fragments.enabled`                                           | [碎片总开关](/zh/blog/config-fragments/#enabled)                        |
| `i18n.locales.<语言>.messages.blog.allPosts`                        | [文章与标签共享入口](/zh/blog/config-blog-list/#tag-messages)           |
| `i18n.locales.<语言>.messages.fragments.title`                      | [碎片界面文案](/zh/blog/config-fragments/#fragment-messages)            |
| `i18n.locales.<语言>.messages.fragments.close`                      | [碎片界面文案](/zh/blog/config-fragments/#fragment-messages)            |
| `i18n.locales.<语言>.messages.siteTitle`                            | [当前未使用的标题字段](/zh/blog/config-site-chrome/#legacy-site-title)  |
| `theme.blogPageSize`                                                | [每页文章数](/zh/blog/config-blog-list/#page-size)                      |
| `theme.tags.enabled`                                                | [标签开关](/zh/blog/config-blog-list/#tags-enabled)                     |
| `theme.pagination.windowSize`                                       | [页码窗口](/zh/blog/config-blog-list/#pagination-window)                |
| `theme.pagination.showJumpThreshold`                                | [跳页阈值](/zh/blog/config-blog-list/#jump-threshold)                   |
| `theme.pagination.jump.enabled`                                     | [跳页开关](/zh/blog/config-blog-list/#jump-enabled)                     |
| `theme.pagination.jump.enterToGo`                                   | [回车跳页](/zh/blog/config-blog-list/#jump-enter)                       |
| `theme.pagination.style.enabled`                                    | [分页样式开关](/zh/blog/config-blog-list/#style-enabled)                |
| `theme.pagination.style.mode`                                       | [变体策略](/zh/blog/config-blog-list/#style-mode)                       |
| `theme.pagination.style.variants`                                   | [变体数量](/zh/blog/config-blog-list/#style-variants)                   |
| `theme.pagination.style.fixedVariant`                               | [固定变体](/zh/blog/config-blog-list/#style-fixed)                      |
| `i18n.locales.<语言>.messages.blog.title`                           | [列表标题与描述](/zh/blog/config-blog-list/#archive-messages)           |
| `i18n.locales.<语言>.messages.blog.pageTitle`                       | [列表标题与描述](/zh/blog/config-blog-list/#archive-messages)           |
| `i18n.locales.<语言>.messages.blog.archiveDescription`              | [列表标题与描述](/zh/blog/config-blog-list/#archive-messages)           |
| `i18n.locales.<语言>.messages.blog.pageDescription`                 | [列表标题与描述](/zh/blog/config-blog-list/#archive-messages)           |
| `i18n.locales.<语言>.messages.blog.previous`                        | [分页文案](/zh/blog/config-blog-list/#pagination-messages)              |
| `i18n.locales.<语言>.messages.blog.next`                            | [分页文案](/zh/blog/config-blog-list/#pagination-messages)              |
| `i18n.locales.<语言>.messages.blog.paginationAria`                  | [分页文案](/zh/blog/config-blog-list/#pagination-messages)              |
| `i18n.locales.<语言>.messages.blog.jumpTo`                          | [分页文案](/zh/blog/config-blog-list/#pagination-messages)              |
| `i18n.locales.<语言>.messages.blog.jumpInputLabel`                  | [分页文案](/zh/blog/config-blog-list/#pagination-messages)              |
| `i18n.locales.<语言>.messages.blog.jumpGo`                          | [分页文案](/zh/blog/config-blog-list/#pagination-messages)              |
| `i18n.locales.<语言>.messages.blog.tags`                            | [标签文案](/zh/blog/config-blog-list/#tag-messages)                     |
| `i18n.locales.<语言>.messages.blog.noTags`                          | [标签文案](/zh/blog/config-blog-list/#tag-messages)                     |
| `i18n.locales.<语言>.messages.blog.taggedPosts`                     | [标签文案](/zh/blog/config-blog-list/#tag-messages)                     |
| `theme.toc.enabled`                                                 | [文章功能开关](/zh/blog/config-article/#feature-switches)               |
| `theme.math.enabled`                                                | [文章功能开关](/zh/blog/config-article/#feature-switches)               |
| `theme.effects.enableRedQueen`                                      | [文章功能开关](/zh/blog/config-article/#feature-switches)               |
| `theme.search.enabled`                                              | [站内搜索开关](/zh/blog/config-search/#enabled)                         |
| `theme.socialImage.enabled`                                         | [文章功能开关](/zh/blog/config-article/#feature-switches)               |
| `site.author`                                                       | [站点与公共界面配置](/zh/blog/config-site-chrome/#identity)             |
| `site.ogImage`                                                      | [站点与公共界面配置](/zh/blog/config-site-chrome/#identity)             |
| `theme.enableAboutPage`                                             | [About 页面开关](/zh/blog/config-about/#page-enabled)                   |
| `theme.footer.showCredits`                                          | [站点与公共界面配置](/zh/blog/config-site-chrome/#footer)               |
| `theme.comments.enabled`                                            | [Giscus 评论配置](/zh/blog/config-comments/#controls)                   |
| `i18n.locales.<语言>.messages.blog.rqBadge`                         | [文章界面文案](/zh/blog/config-article/#article-messages)               |
| `i18n.locales.<语言>.messages.blog.rqReplayAria`                    | [文章界面文案](/zh/blog/config-article/#article-messages)               |
| `i18n.locales.<语言>.messages.blog.backToTop`                       | [文章界面文案](/zh/blog/config-article/#article-messages)               |
| `i18n.locales.<语言>.messages.blog.toastP10`                        | [文章界面文案](/zh/blog/config-article/#article-messages)               |
| `i18n.locales.<语言>.messages.blog.toastP30`                        | [文章界面文案](/zh/blog/config-article/#article-messages)               |
| `i18n.locales.<语言>.messages.blog.toastP60`                        | [文章界面文案](/zh/blog/config-article/#article-messages)               |
| `i18n.locales.<语言>.messages.blog.toastDone`                       | [文章界面文案](/zh/blog/config-article/#article-messages)               |
| `i18n.locales.<语言>.messages.blog.metaPublished`                   | [文章界面文案](/zh/blog/config-article/#article-messages)               |
| `i18n.locales.<语言>.messages.blog.metaAuthor`                      | [文章界面文案](/zh/blog/config-article/#article-messages)               |
| `i18n.locales.<语言>.messages.blog.metaUpdated`                     | [文章界面文案](/zh/blog/config-article/#article-messages)               |
| `i18n.locales.<语言>.messages.blog.systemStatusAria`                | [文章界面文案](/zh/blog/config-article/#article-messages)               |
| `i18n.locales.<语言>.messages.blog.systemModelLabel`                | [文章界面文案](/zh/blog/config-article/#article-messages)               |
| `i18n.locales.<语言>.messages.blog.systemModeLabel`                 | [文章界面文案](/zh/blog/config-article/#article-messages)               |
| `i18n.locales.<语言>.messages.blog.systemStateLabel`                | [文章界面文案](/zh/blog/config-article/#article-messages)               |
| `i18n.locales.<语言>.messages.blog.promptContextLabel`              | [文章界面文案](/zh/blog/config-article/#article-messages)               |
| `i18n.locales.<语言>.messages.blog.heroMonitor`                     | [文章界面文案](/zh/blog/config-article/#article-messages)               |
| `i18n.locales.<语言>.messages.blog.heroSignalSync`                  | [文章界面文案](/zh/blog/config-article/#article-messages)               |
| `i18n.locales.<语言>.messages.blog.heroModelOnline`                 | [文章界面文案](/zh/blog/config-article/#article-messages)               |
| `i18n.locales.<语言>.messages.blog.toc`                             | [文章界面文案](/zh/blog/config-article/#article-messages)               |
| `i18n.locales.<语言>.messages.blog.responseOutput`                  | [文章界面文案](/zh/blog/config-article/#article-messages)               |
| `i18n.locales.<语言>.messages.blog.statsWords`                      | [文章界面文案](/zh/blog/config-article/#article-messages)               |
| `i18n.locales.<语言>.messages.blog.statsTokens`                     | [文章界面文案](/zh/blog/config-article/#article-messages)               |
| `i18n.locales.<语言>.messages.blog.copySectionLink`                 | [文章界面文案](/zh/blog/config-article/#article-messages)               |
| `i18n.locales.<语言>.messages.blog.regenerate`                      | [文章界面文案](/zh/blog/config-article/#article-messages)               |
| `i18n.locales.<语言>.messages.blog.relatedAria`                     | [文章界面文案](/zh/blog/config-article/#article-messages)               |
| `i18n.locales.<语言>.messages.blog.related`                         | [文章界面文案](/zh/blog/config-article/#article-messages)               |
| `i18n.locales.<语言>.messages.blog.backToBlogAria`                  | [文章界面文案](/zh/blog/config-article/#article-messages)               |
| `i18n.locales.<语言>.messages.blog.backToBlog`                      | [文章界面文案](/zh/blog/config-article/#article-messages)               |
| `i18n.locales.<语言>.messages.blog.comments`                        | [文章界面文案](/zh/blog/config-article/#article-messages)               |
| `i18n.locales.<语言>.messages.blog.metaReadMinutes`                 | [文章界面文案（当前未使用）](/zh/blog/config-article/#article-messages) |
| `i18n.locales.<语言>.messages.blog.latencyLabel`                    | [文章界面文案（当前未使用）](/zh/blog/config-article/#article-messages) |
| `i18n.locales.<语言>.messages.blog.confidenceLabel`                 | [文章界面文案（当前未使用）](/zh/blog/config-article/#article-messages) |
| `i18n.locales.<语言>.messages.codeCopy.copy`                        | [阅读交互文案](/zh/blog/config-article/#interaction-messages)           |
| `i18n.locales.<语言>.messages.codeCopy.copied`                      | [阅读交互文案](/zh/blog/config-article/#interaction-messages)           |
| `i18n.locales.<语言>.messages.codeCopy.failed`                      | [阅读交互文案](/zh/blog/config-article/#interaction-messages)           |
| `i18n.locales.<语言>.messages.imagePreview.open`                    | [阅读交互文案](/zh/blog/config-article/#interaction-messages)           |
| `i18n.locales.<语言>.messages.imagePreview.close`                   | [阅读交互文案](/zh/blog/config-article/#interaction-messages)           |
| `theme.fragments.pageSize`                                          | [碎片每页条数](/zh/blog/config-fragments/#page-size)                    |
| `theme.fragments.comments.enabled`                                  | [碎片评论](/zh/blog/config-fragments/#comments-enabled)                 |
| `i18n.locales.<语言>.messages.fragments.description`                | [碎片界面文案](/zh/blog/config-fragments/#fragment-messages)            |
| `i18n.locales.<语言>.messages.fragments.empty`                      | [碎片界面文案](/zh/blog/config-fragments/#fragment-messages)            |
| `i18n.locales.<语言>.messages.fragments.comments`                   | [碎片界面文案](/zh/blog/config-fragments/#fragment-messages)            |
| `i18n.locales.<语言>.messages.fragments.previous`                   | [碎片文案（当前未使用）](/zh/blog/config-fragments/#fragment-messages)  |
| `i18n.locales.<语言>.messages.fragments.next`                       | [碎片文案（当前未使用）](/zh/blog/config-fragments/#fragment-messages)  |
| `i18n.locales.<语言>.messages.fragments.loading`                    | [碎片界面文案](/zh/blog/config-fragments/#fragment-messages)            |
| `i18n.locales.<语言>.messages.fragments.error`                      | [碎片界面文案](/zh/blog/config-fragments/#fragment-messages)            |
| `i18n.locales.<语言>.messages.fragments.retry`                      | [碎片界面文案](/zh/blog/config-fragments/#fragment-messages)            |
| `i18n.locales.<语言>.messages.fragments.copyLink`                   | [碎片界面文案](/zh/blog/config-fragments/#fragment-messages)            |
| `i18n.locales.<语言>.messages.fragments.linkCopied`                 | [碎片界面文案](/zh/blog/config-fragments/#fragment-messages)            |
| `i18n.locales.<语言>.messages.fragments.copyLinkFailed`             | [碎片界面文案](/zh/blog/config-fragments/#fragment-messages)            |
| `i18n.locales.<语言>.messages.fragments.notFound`                   | [碎片界面文案](/zh/blog/config-fragments/#fragment-messages)            |
| `i18n.locales.<语言>.messages.fragments.indexError`                 | [碎片界面文案](/zh/blog/config-fragments/#fragment-messages)            |
| `theme.comments.repo`                                               | [Giscus 评论配置](/zh/blog/config-comments/#connection)                 |
| `theme.comments.repoId`                                             | [Giscus 评论配置](/zh/blog/config-comments/#connection)                 |
| `theme.comments.category`                                           | [Giscus 评论配置](/zh/blog/config-comments/#connection)                 |
| `theme.comments.categoryId`                                         | [Giscus 评论配置](/zh/blog/config-comments/#connection)                 |
| `i18n.locales.<语言>.about.metaLine`                                | [About 正文](/zh/blog/config-about/#body-fields)                        |
| `i18n.locales.<语言>.about.sections.who`                            | [About 正文](/zh/blog/config-about/#body-fields)                        |
| `i18n.locales.<语言>.about.sections.what`                           | [About 正文](/zh/blog/config-about/#body-fields)                        |
| `i18n.locales.<语言>.about.sections.ethos`                          | [About 正文](/zh/blog/config-about/#body-fields)                        |
| `i18n.locales.<语言>.about.sections.now`                            | [About 正文](/zh/blog/config-about/#body-fields)                        |
| `i18n.locales.<语言>.about.sections.contactLead`                    | [About 正文](/zh/blog/config-about/#body-fields)                        |
| `i18n.locales.<语言>.about.sections.signature`                      | [About 正文](/zh/blog/config-about/#body-fields)                        |
| `i18n.locales.<语言>.about.contact.email`                           | [About 联系](/zh/blog/config-about/#contact-fields)                     |
| `i18n.locales.<语言>.about.contact.githubUrl`                       | [About 联系](/zh/blog/config-about/#contact-fields)                     |
| `i18n.locales.<语言>.about.contact.githubLabel`                     | [About 联系](/zh/blog/config-about/#contact-fields)                     |
| `i18n.locales.<语言>.about.sidebar.dlData`                          | [About 工具入口](/zh/blog/config-about/#tool-fields)                    |
| `i18n.locales.<语言>.about.sidebar.ai`                              | [About 工具入口](/zh/blog/config-about/#tool-fields)                    |
| `i18n.locales.<语言>.about.sidebar.decryptor`                       | [About 工具入口](/zh/blog/config-about/#tool-fields)                    |
| `i18n.locales.<语言>.about.sidebar.help`                            | [About 工具入口](/zh/blog/config-about/#tool-fields)                    |
| `i18n.locales.<语言>.about.sidebar.allScripts`                      | [About 工具入口](/zh/blog/config-about/#tool-fields)                    |
| `i18n.locales.<语言>.about.scriptsPath`                             | [About 工具入口](/zh/blog/config-about/#tool-fields)                    |
| `i18n.locales.<语言>.about.labels.modalOutput`                      | [About 通用文案（注意生效状态）](/zh/blog/config-about/#label-fields)   |
| `i18n.locales.<语言>.about.labels.modalClose`                       | [About 通用文案](/zh/blog/config-about/#label-fields)                   |
| `i18n.locales.<语言>.about.labels.responseOutput`                   | [About 通用文案](/zh/blog/config-about/#label-fields)                   |
| `i18n.locales.<语言>.about.labels.contactEmailLead`                 | [About 通用文案](/zh/blog/config-about/#label-fields)                   |
| `i18n.locales.<语言>.about.labels.contactConnectLead`               | [About 通用文案](/zh/blog/config-about/#label-fields)                   |
| `i18n.locales.<语言>.about.labels.backToTop`                        | [About 通用文案](/zh/blog/config-about/#label-fields)                   |
| `i18n.locales.<语言>.about.labels.quickAccess`                      | [About 通用文案](/zh/blog/config-about/#label-fields)                   |
| `i18n.locales.<语言>.about.labels.contactEmailLabel`                | [About 通用文案](/zh/blog/config-about/#label-fields)                   |
| `i18n.locales.<语言>.about.modals.dlData.title`                     | [About 工具弹窗](/zh/blog/config-about/#modal-fields)                   |
| `i18n.locales.<语言>.about.modals.dlData.subtitle`                  | [About 工具弹窗](/zh/blog/config-about/#modal-fields)                   |
| `i18n.locales.<语言>.about.modals.ai.title`                         | [About 工具弹窗](/zh/blog/config-about/#modal-fields)                   |
| `i18n.locales.<语言>.about.modals.ai.lines`                         | [About 工具弹窗](/zh/blog/config-about/#modal-fields)                   |
| `i18n.locales.<语言>.about.modals.decryptor.title`                  | [About 工具弹窗](/zh/blog/config-about/#modal-fields)                   |
| `i18n.locales.<语言>.about.modals.decryptor.header`                 | [About 工具弹窗（注意生效状态）](/zh/blog/config-about/#modal-fields)   |
| `i18n.locales.<语言>.about.modals.decryptor.keysLabel`              | [About 工具弹窗（注意生效状态）](/zh/blog/config-about/#modal-fields)   |
| `i18n.locales.<语言>.about.modals.decryptor.currentPassphraseLabel` | [About 工具弹窗（注意生效状态）](/zh/blog/config-about/#modal-fields)   |
| `i18n.locales.<语言>.about.modals.decryptor.masterKeyLabel`         | [About 工具弹窗（注意生效状态）](/zh/blog/config-about/#modal-fields)   |
| `i18n.locales.<语言>.about.modals.decryptor.transientKeyLabel`      | [About 工具弹窗（注意生效状态）](/zh/blog/config-about/#modal-fields)   |
| `i18n.locales.<语言>.about.modals.help.title`                       | [About 工具弹窗](/zh/blog/config-about/#modal-fields)                   |
| `i18n.locales.<语言>.about.modals.help.statsLabel`                  | [About 工具弹窗](/zh/blog/config-about/#modal-fields)                   |
| `i18n.locales.<语言>.about.modals.help.typedPrefix`                 | [About 工具弹窗](/zh/blog/config-about/#modal-fields)                   |
| `i18n.locales.<语言>.about.modals.help.typedSuffix`                 | [About 工具弹窗](/zh/blog/config-about/#modal-fields)                   |
| `i18n.locales.<语言>.about.modals.allScripts.title`                 | [About 工具弹窗](/zh/blog/config-about/#modal-fields)                   |
| `i18n.locales.<语言>.about.effects.backgroundLines`                 | [About 效果（注意生效状态）](/zh/blog/config-about/#effect-fields)      |
| `i18n.locales.<语言>.about.effects.scrollToasts.p30`                | [About 效果](/zh/blog/config-about/#effect-fields)                      |
| `i18n.locales.<语言>.about.effects.scrollToasts.p60`                | [About 效果](/zh/blog/config-about/#effect-fields)                      |
| `i18n.locales.<语言>.about.effects.scrollToasts.p90`                | [About 效果](/zh/blog/config-about/#effect-fields)                      |
| `i18n.locales.<语言>.messages.about.title`                          | [About 及共用控件文案](/zh/blog/config-about/#about-messages)           |
| `i18n.locales.<语言>.messages.about.description`                    | [About 及共用控件文案](/zh/blog/config-about/#about-messages)           |
| `i18n.locales.<语言>.messages.about.who`                            | [About 及共用控件文案](/zh/blog/config-about/#about-messages)           |
| `i18n.locales.<语言>.messages.about.what`                           | [About 及共用控件文案](/zh/blog/config-about/#about-messages)           |
| `i18n.locales.<语言>.messages.about.ethos`                          | [About 及共用控件文案](/zh/blog/config-about/#about-messages)           |
| `i18n.locales.<语言>.messages.about.now`                            | [About 及共用控件文案](/zh/blog/config-about/#about-messages)           |
| `i18n.locales.<语言>.messages.about.contact`                        | [About 及共用控件文案](/zh/blog/config-about/#about-messages)           |
| `i18n.locales.<语言>.messages.about.regenerate`                     | [About 及共用控件文案](/zh/blog/config-about/#about-messages)           |
| `i18n.locales.<语言>.messages.windowControls.collapse`              | [About 及共用控件文案](/zh/blog/config-about/#about-messages)           |
| `i18n.locales.<语言>.messages.windowControls.expand`                | [About 及共用控件文案](/zh/blog/config-about/#about-messages)           |
| `i18n.locales.<语言>.messages.windowControls.restore`               | [About 及共用控件文案](/zh/blog/config-about/#about-messages)           |
| `i18n.locales.<语言>.messages.windowControls.fullscreen`            | [About 及共用控件文案](/zh/blog/config-about/#about-messages)           |
| `i18n.locales.<语言>.messages.scriptFolders.copyTitle`              | [About 及共用控件文案](/zh/blog/config-about/#about-messages)           |
| `i18n.locales.<语言>.messages.scriptFolders.copied`                 | [About 及共用控件文案](/zh/blog/config-about/#about-messages)           |
| `i18n.locales.<语言>.messages.scriptFolders.failed`                 | [About 及共用控件文案](/zh/blog/config-about/#about-messages)           |
| `theme.enableDecoderPage`                                           | [Decoder 页面开关](/zh/blog/config-decoder/#page-enabled)               |
| `i18n.locales.<语言>.messages.nav.about`                            | [站点与公共界面配置](/zh/blog/config-site-chrome/#chrome-messages)      |
| `i18n.locales.<语言>.messages.decoder.input`                        | [Decoder 文案](/zh/blog/config-decoder/#text-messages)                  |
| `i18n.locales.<语言>.messages.decoder.placeholder`                  | [Decoder 文案](/zh/blog/config-decoder/#text-messages)                  |
| `i18n.locales.<语言>.messages.decoder.format`                       | [Decoder 文案](/zh/blog/config-decoder/#text-messages)                  |
| `i18n.locales.<语言>.messages.decoder.auto`                         | [Decoder 文案](/zh/blog/config-decoder/#text-messages)                  |
| `i18n.locales.<语言>.messages.decoder.decode`                       | [Decoder 文案](/zh/blog/config-decoder/#text-messages)                  |
| `i18n.locales.<语言>.messages.decoder.clear`                        | [Decoder 文案](/zh/blog/config-decoder/#text-messages)                  |
| `i18n.locales.<语言>.messages.decoder.copy`                         | [Decoder 文案](/zh/blog/config-decoder/#text-messages)                  |
| `i18n.locales.<语言>.messages.decoder.reuse`                        | [Decoder 文案](/zh/blog/config-decoder/#text-messages)                  |
| `i18n.locales.<语言>.messages.decoder.supported`                    | [Decoder 文案](/zh/blog/config-decoder/#text-messages)                  |
| `i18n.locales.<语言>.messages.decoder.html`                         | [Decoder 文案](/zh/blog/config-decoder/#text-messages)                  |
| `i18n.locales.<语言>.messages.decoder.unicode`                      | [Decoder 文案](/zh/blog/config-decoder/#text-messages)                  |
| `i18n.locales.<语言>.messages.decoder.jwtWarning`                   | [Decoder 文案](/zh/blog/config-decoder/#text-messages)                  |
| `i18n.locales.<语言>.messages.decoder.copied`                       | [Decoder 文案](/zh/blog/config-decoder/#text-messages)                  |
| `i18n.locales.<语言>.messages.decoder.copyFailed`                   | [Decoder 文案](/zh/blog/config-decoder/#text-messages)                  |
| `i18n.locales.<语言>.messages.decoder.output`                       | [Decoder 文案](/zh/blog/config-decoder/#text-messages)                  |
| `i18n.locales.<语言>.messages.decoder.local`                        | [Decoder 文案](/zh/blog/config-decoder/#text-messages)                  |
| `i18n.locales.<语言>.messages.decoder.ready`                        | [Decoder 文案](/zh/blog/config-decoder/#text-messages)                  |
| `i18n.locales.<语言>.messages.decoder.running`                      | [Decoder 文案](/zh/blog/config-decoder/#text-messages)                  |
| `i18n.locales.<语言>.messages.decoder.done`                         | [Decoder 文案](/zh/blog/config-decoder/#text-messages)                  |
| `i18n.locales.<语言>.messages.decoder.empty`                        | [Decoder 文案](/zh/blog/config-decoder/#text-messages)                  |
| `i18n.locales.<语言>.messages.decoder.tooLong`                      | [Decoder 文案](/zh/blog/config-decoder/#text-messages)                  |
| `i18n.locales.<语言>.messages.decoder.invalid`                      | [Decoder 文案](/zh/blog/config-decoder/#text-messages)                  |
| `i18n.locales.<语言>.messages.decoder.binary`                       | [Decoder 文案](/zh/blog/config-decoder/#text-messages)                  |
| `i18n.locales.<语言>.messages.decoder.unknown`                      | [Decoder 文案](/zh/blog/config-decoder/#text-messages)                  |
| `i18n.locales.<语言>.messages.decoder.ambiguous`                    | [Decoder 文案](/zh/blog/config-decoder/#text-messages)                  |
| `i18n.locales.<语言>.messages.decoder.example`                      | [Decoder 文案](/zh/blog/config-decoder/#text-messages)                  |
| `i18n.locales.<语言>.messages.decoderPage.description`              | [Decoder 文案](/zh/blog/config-decoder/#page-messages)                  |
| `i18n.locales.<语言>.messages.decoderPage.fullTool`                 | [Decoder 文案](/zh/blog/config-decoder/#page-messages)                  |
| `i18n.locales.<语言>.messages.decoderPage.task`                     | [Decoder 文案](/zh/blog/config-decoder/#page-messages)                  |
| `i18n.locales.<语言>.messages.decoderPage.textTask`                 | [Decoder 文案](/zh/blog/config-decoder/#page-messages)                  |
| `i18n.locales.<语言>.messages.decoderPage.callTask`                 | [Decoder 文案](/zh/blog/config-decoder/#page-messages)                  |
| `i18n.locales.<语言>.messages.decoderPage.addressTask`              | [Decoder 文案](/zh/blog/config-decoder/#page-messages)                  |
| `i18n.locales.<语言>.messages.decoderPage.addressHint`              | [Decoder 文案](/zh/blog/config-decoder/#page-messages)                  |
| `i18n.locales.<语言>.messages.decoderPage.chain`                    | [Decoder 文案](/zh/blog/config-decoder/#page-messages)                  |
| `i18n.locales.<语言>.messages.decoderPage.decimals`                 | [Decoder 文案](/zh/blog/config-decoder/#page-messages)                  |
| `i18n.locales.<语言>.messages.decoderPage.precisionHint`            | [Decoder 文案](/zh/blog/config-decoder/#page-messages)                  |
| `i18n.locales.<语言>.messages.decoderPage.network`                  | [Decoder 文案](/zh/blog/config-decoder/#page-messages)                  |
| `i18n.locales.<语言>.messages.decoderPage.history`                  | [Decoder 文案](/zh/blog/config-decoder/#page-messages)                  |
| `i18n.locales.<语言>.messages.decoderPage.back`                     | [Decoder 文案](/zh/blog/config-decoder/#page-messages)                  |
| `i18n.locales.<语言>.messages.decoderPage.export`                   | [Decoder 文案](/zh/blog/config-decoder/#page-messages)                  |
| `i18n.locales.<语言>.messages.decoderPage.limits`                   | [Decoder 文案](/zh/blog/config-decoder/#page-messages)                  |
| `i18n.locales.<语言>.messages.decoderPage.callNotice`               | [Decoder 文案](/zh/blog/config-decoder/#page-messages)                  |
| `i18n.locales.<语言>.messages.decoderPage.addressNotice`            | [Decoder 文案](/zh/blog/config-decoder/#page-messages)                  |
| `i18n.locales.<语言>.messages.decoderPage.unsupported`              | [Decoder 文案](/zh/blog/config-decoder/#page-messages)                  |
| `i18n.locales.<语言>.messages.decoderPage.checksum`                 | [Decoder 文案](/zh/blog/config-decoder/#page-messages)                  |
| `i18n.locales.<语言>.messages.decoderPage.length`                   | [Decoder 文案](/zh/blog/config-decoder/#page-messages)                  |
| `i18n.locales.<语言>.messages.decoderPage.wrongNetwork`             | [Decoder 文案](/zh/blog/config-decoder/#page-messages)                  |
| `i18n.locales.<语言>.messages.decoderPage.stepLimit`                | [Decoder 文案](/zh/blog/config-decoder/#page-messages)                  |
| `i18n.locales.<语言>.messages.decoderPage.budget`                   | [Decoder 文案](/zh/blog/config-decoder/#page-messages)                  |
| `i18n.locales.<语言>.messages.decoderPage.addressParse`             | [Decoder 文案](/zh/blog/config-decoder/#page-messages)                  |
| `i18n.locales.<语言>.messages.decoderPage.addressCheck`             | [Decoder 文案](/zh/blog/config-decoder/#page-messages)                  |
| `i18n.locales.<语言>.messages.decoderPage.addressResult`            | [Decoder 文案](/zh/blog/config-decoder/#page-messages)                  |
| `i18n.locales.<语言>.messages.decoderPage.callParse`                | [Decoder 文案](/zh/blog/config-decoder/#page-messages)                  |
| `i18n.locales.<语言>.messages.decoderPage.rawOnly`                  | [Decoder 文案](/zh/blog/config-decoder/#page-messages)                  |
| `i18n.locales.<语言>.messages.decoderPage.amountResult`             | [Decoder 文案](/zh/blog/config-decoder/#page-messages)                  |
| `i18n.locales.<语言>.messages.decoderPage.inputHint`                | [Decoder 文案](/zh/blog/config-decoder/#page-messages)                  |
| `i18n.locales.<语言>.messages.decoderPage.loadFailed`               | [Decoder 文案](/zh/blog/config-decoder/#page-messages)                  |
| `i18n.locales.<语言>.messages.decoderPage.readings.tribute`         | [Decoder 阅读区](/zh/blog/config-decoder/#readings)                     |
| `i18n.locales.<语言>.messages.decoderPage.readings.links`           | [Decoder 阅读区](/zh/blog/config-decoder/#readings)                     |
| `i18n.locales.<语言>.messages.decoderPage.readings.links[].title`   | [Decoder 阅读区](/zh/blog/config-decoder/#readings)                     |
| `i18n.locales.<语言>.messages.decoderPage.readings.links[].href`    | [Decoder 阅读区](/zh/blog/config-decoder/#readings)                     |
| `i18n.locales.<语言>.messages.decoderPage.readings.links[].author`  | [Decoder 阅读区](/zh/blog/config-decoder/#readings)                     |
| `i18n.locales.<语言>.messages.decoderPage.readings.links[].year`    | [Decoder 阅读区](/zh/blog/config-decoder/#readings)                     |
| `i18n.locales.<语言>.messages.decoderPage.readings.links[].cover`   | [Decoder 阅读区](/zh/blog/config-decoder/#readings)                     |
| `theme.music.enabled`                                               | [音乐播放器配置](/zh/blog/config-music/#enabled)                        |
| `theme.music.tracks`                                                | [音乐播放器配置](/zh/blog/config-music/#tracks)                         |
| `theme.music.tracks[].title`                                        | [音乐播放器配置](/zh/blog/config-music/#track-fields)                   |
| `theme.music.tracks[].artist`                                       | [音乐播放器配置](/zh/blog/config-music/#track-fields)                   |
| `theme.music.tracks[].src`                                          | [音乐播放器配置](/zh/blog/config-music/#track-fields)                   |
| `i18n.locales.<语言>.messages.music.label`                          | [音乐播放器文案](/zh/blog/config-music/#music-messages)                 |
| `i18n.locales.<语言>.messages.music.play`                           | [音乐播放器文案](/zh/blog/config-music/#music-messages)                 |
| `i18n.locales.<语言>.messages.music.pause`                          | [音乐播放器文案](/zh/blog/config-music/#music-messages)                 |
| `i18n.locales.<语言>.messages.music.prev`                           | [音乐播放器文案](/zh/blog/config-music/#music-messages)                 |
| `i18n.locales.<语言>.messages.music.next`                           | [音乐播放器文案](/zh/blog/config-music/#music-messages)                 |
| `i18n.locales.<语言>.messages.music.open`                           | [音乐播放器文案](/zh/blog/config-music/#music-messages)                 |
| `i18n.locales.<语言>.messages.music.close`                          | [音乐播放器文案](/zh/blog/config-music/#music-messages)                 |
| `i18n.locales.<语言>.messages.music.progress`                       | [音乐播放器文案](/zh/blog/config-music/#music-messages)                 |
| `i18n.locales.<语言>.messages.music.volume`                         | [音乐播放器文案](/zh/blog/config-music/#music-messages)                 |
| `i18n.locales.<语言>.messages.music.queue`                          | [音乐播放器文案](/zh/blog/config-music/#music-messages)                 |
| `i18n.locales.<语言>.messages.music.mute`                           | [音乐播放器文案](/zh/blog/config-music/#music-messages)                 |
| `i18n.locales.<语言>.messages.music.unmute`                         | [音乐播放器文案](/zh/blog/config-music/#music-messages)                 |
| `i18n.locales.<语言>.messages.music.idle`                           | [音乐播放器文案](/zh/blog/config-music/#music-messages)                 |
| `i18n.locales.<语言>.messages.music.loading`                        | [音乐播放器文案](/zh/blog/config-music/#music-messages)                 |
| `i18n.locales.<语言>.messages.music.playing`                        | [音乐播放器文案](/zh/blog/config-music/#music-messages)                 |
| `i18n.locales.<语言>.messages.music.paused`                         | [音乐播放器文案](/zh/blog/config-music/#music-messages)                 |
| `i18n.locales.<语言>.messages.music.blocked`                        | [音乐播放器文案](/zh/blog/config-music/#music-messages)                 |
| `i18n.locales.<语言>.messages.music.error`                          | [音乐播放器文案](/zh/blog/config-music/#music-messages)                 |
| `i18n.locales.<语言>.messages.music.noScript`                       | [音乐播放器文案](/zh/blog/config-music/#music-messages)                 |
| `theme.comments.shareAcrossLocales`                                 | [Giscus 评论配置](/zh/blog/config-comments/#sharing)                    |
| `theme.comments.mapping`                                            | [Giscus 评论配置](/zh/blog/config-comments/#mapping)                    |
| `theme.comments.term`                                               | [Giscus 评论配置](/zh/blog/config-comments/#mapping)                    |
| `theme.comments.number`                                             | [Giscus 评论配置](/zh/blog/config-comments/#mapping)                    |
| `theme.comments.strict`                                             | [Giscus 评论配置](/zh/blog/config-comments/#mapping)                    |
| `theme.comments.reactionsEnabled`                                   | [Giscus 评论配置](/zh/blog/config-comments/#appearance)                 |
| `theme.comments.emitMetadata`                                       | [Giscus 评论配置](/zh/blog/config-comments/#appearance)                 |
| `theme.comments.inputPosition`                                      | [Giscus 评论配置](/zh/blog/config-comments/#appearance)                 |
| `theme.comments.theme`                                              | [Giscus 评论配置](/zh/blog/config-comments/#appearance)                 |
| `theme.comments.lang`                                               | [Giscus 评论配置](/zh/blog/config-comments/#appearance)                 |
| `theme.comments.loading`                                            | [Giscus 评论配置](/zh/blog/config-comments/#appearance)                 |
| `theme.comments.crossorigin`                                        | [Giscus 评论配置](/zh/blog/config-comments/#appearance)                 |
| `i18n.defaultLocale`                                                | [语言与回退配置](/zh/blog/config-languages/#registry)                   |
| `i18n.locales`                                                      | [语言与回退配置](/zh/blog/config-languages/#registry)                   |
| `i18n.locales.<语言>`                                               | [语言与回退配置](/zh/blog/config-languages/#registry)                   |
| `i18n.routing.defaultLocalePrefix`                                  | [语言与回退配置](/zh/blog/config-languages/#routing)                    |
| `i18n.locales.<语言>.meta`                                          | [语言与回退配置](/zh/blog/config-languages/#meta)                       |
| `i18n.locales.<语言>.meta.label`                                    | [语言与回退配置](/zh/blog/config-languages/#meta)                       |
| `i18n.locales.<语言>.meta.hreflang`                                 | [语言与回退配置](/zh/blog/config-languages/#meta)                       |
| `i18n.locales.<语言>.meta.ogLocale`                                 | [语言与回退配置](/zh/blog/config-languages/#meta)                       |
| `i18n.locales.<语言>.meta.enabled`                                  | [语言与回退配置](/zh/blog/config-languages/#meta)                       |
| `i18n.locales.<语言>.meta.fallback`                                 | [语言与回退配置](/zh/blog/config-languages/#fallback)                   |
| `i18n.locales.<语言>.site`                                          | [语言与回退配置](/zh/blog/config-languages/#overrides)                  |
| `i18n.locales.<语言>.messages`                                      | [语言与回退配置](/zh/blog/config-languages/#overrides)                  |
| `i18n.locales.<语言>.about`                                         | [语言与回退配置](/zh/blog/config-languages/#overrides)                  |
| `i18n.locales.<语言>.messages.langLabel`                            | [语言与回退配置](/zh/blog/config-languages/#common-messages)            |
| `i18n.locales.<语言>.aiReadableContent`                             | [GA4 与 AI 阅读补充](/zh/blog/config-analytics-ai/#locale-supplement)   |
| `i18n.locales.<语言>.aiReadableContent.notes`                       | [GA4 与 AI 阅读补充](/zh/blog/config-analytics-ai/#locale-supplement)   |
| `i18n.locales.<语言>.aiReadableContent.links`                       | [GA4 与 AI 阅读补充](/zh/blog/config-analytics-ai/#locale-supplement)   |
| `i18n.locales.<语言>.aiReadableContent.links[].label`               | [GA4 与 AI 阅读补充](/zh/blog/config-analytics-ai/#locale-supplement)   |
| `i18n.locales.<语言>.aiReadableContent.links[].href`                | [GA4 与 AI 阅读补充](/zh/blog/config-analytics-ai/#locale-supplement)   |
| `i18n.locales.<语言>.messages.search.label`                         | [搜索文案](/zh/blog/config-search/#messages)                            |
| `i18n.locales.<语言>.messages.search.close`                         | [搜索文案](/zh/blog/config-search/#messages)                            |
| `i18n.locales.<语言>.messages.search.placeholder`                   | [搜索文案](/zh/blog/config-search/#messages)                            |
| `i18n.locales.<语言>.messages.search.hint`                          | [搜索文案](/zh/blog/config-search/#messages)                            |
| `i18n.locales.<语言>.messages.search.loading`                       | [搜索文案](/zh/blog/config-search/#messages)                            |
| `i18n.locales.<语言>.messages.search.empty`                         | [搜索文案](/zh/blog/config-search/#messages)                            |
| `i18n.locales.<语言>.messages.search.error`                         | [搜索文案](/zh/blog/config-search/#messages)                            |
| `i18n.locales.<语言>.messages.search.retry`                         | [搜索文案](/zh/blog/config-search/#messages)                            |
| `i18n.locales.<语言>.messages.search.more`                          | [搜索文案](/zh/blog/config-search/#messages)                            |
| `i18n.locales.<语言>.messages.search.results`                       | [搜索文案](/zh/blog/config-search/#messages)                            |
| `i18n.locales.<语言>.messages.search.dev`                           | [搜索文案](/zh/blog/config-search/#messages)                            |
| `analytics`                                                         | [GA4 与 AI 阅读补充](/zh/blog/config-analytics-ai/#analytics)           |
| `analytics.googleAnalyticsId`                                       | [GA4 与 AI 阅读补充](/zh/blog/config-analytics-ai/#analytics)           |
| `aiReadableContent`                                                 | [GA4 与 AI 阅读补充](/zh/blog/config-analytics-ai/#supplement)          |
| `aiReadableContent.notes`                                           | [GA4 与 AI 阅读补充](/zh/blog/config-analytics-ai/#supplement)          |
| `aiReadableContent.links`                                           | [GA4 与 AI 阅读补充](/zh/blog/config-analytics-ai/#supplement)          |
| `aiReadableContent.links[].label`                                   | [GA4 与 AI 阅读补充](/zh/blog/config-analytics-ai/#supplement)          |
| `aiReadableContent.links[].href`                                    | [GA4 与 AI 阅读补充](/zh/blog/config-analytics-ai/#supplement)          |
| `site.title`                                                        | [站点与公共界面配置](/zh/blog/config-site-chrome/#identity)             |
| `site.description`                                                  | [站点与公共界面配置](/zh/blog/config-site-chrome/#identity)             |
| `site.url`                                                          | [站点与公共界面配置](/zh/blog/config-site-chrome/#identity)             |
| `site.tagline`                                                      | [站点与公共界面配置](/zh/blog/config-site-chrome/#identity)             |
| `social.links`                                                      | [站点与公共界面配置](/zh/blog/config-site-chrome/#social)               |
| `social.links[].href`                                               | [站点与公共界面配置](/zh/blog/config-site-chrome/#social-fields)        |
| `social.links[].label`                                              | [站点与公共界面配置](/zh/blog/config-site-chrome/#social-fields)        |
| `social.links[].rel`                                                | [站点与公共界面配置](/zh/blog/config-site-chrome/#social-fields)        |
| `social.links[].icon`                                               | [站点与公共界面配置](/zh/blog/config-site-chrome/#social-fields)        |
| `social.links[].iconSrc`                                            | [站点与公共界面配置](/zh/blog/config-site-chrome/#social-fields)        |
| `theme.footer.links`                                                | [站点与公共界面配置](/zh/blog/config-site-chrome/#footer)               |
| `theme.footer.links[].label`                                        | [站点与公共界面配置](/zh/blog/config-site-chrome/#footer)               |
| `theme.footer.links[].href`                                         | [站点与公共界面配置](/zh/blog/config-site-chrome/#footer)               |
| `i18n.locales.<语言>.messages.nav.home`                             | [站点与公共界面配置](/zh/blog/config-site-chrome/#chrome-messages)      |
| `i18n.locales.<语言>.messages.nav.blog`                             | [站点与公共界面配置](/zh/blog/config-site-chrome/#chrome-messages)      |
| `i18n.locales.<语言>.messages.nav.status`                           | [站点与公共界面配置](/zh/blog/config-site-chrome/#chrome-messages)      |
| `i18n.locales.<语言>.messages.nav.statusAria`                       | [站点与公共界面配置](/zh/blog/config-site-chrome/#chrome-messages)      |
| `i18n.locales.<语言>.messages.footer.theme`                         | [站点与公共界面配置](/zh/blog/config-site-chrome/#chrome-messages)      |
| `i18n.locales.<语言>.messages.footer.builtWith`                     | [站点与公共界面配置](/zh/blog/config-site-chrome/#chrome-messages)      |
| `i18n.locales.<语言>.messages.terminal.commandInput`                | [终端文案](/zh/blog/config-terminal/#messages)                          |
| `i18n.locales.<语言>.messages.terminal.hint`                        | [终端文案](/zh/blog/config-terminal/#messages)                          |
| `i18n.locales.<语言>.messages.terminal.help`                        | [终端文案](/zh/blog/config-terminal/#messages)                          |
| `i18n.locales.<语言>.messages.terminal.syntax`                      | [终端文案](/zh/blog/config-terminal/#messages)                          |
| `i18n.locales.<语言>.messages.terminal.usage`                       | [终端文案](/zh/blog/config-terminal/#messages)                          |
| `i18n.locales.<语言>.messages.terminal.unknown`                     | [终端文案](/zh/blog/config-terminal/#messages)                          |
| `i18n.locales.<语言>.messages.terminal.notFound`                    | [终端文案](/zh/blog/config-terminal/#messages)                          |
| `i18n.locales.<语言>.messages.terminal.notDirectory`                | [终端文案](/zh/blog/config-terminal/#messages)                          |
| `i18n.locales.<语言>.messages.terminal.isDirectory`                 | [终端文案](/zh/blog/config-terminal/#messages)                          |
| `i18n.locales.<语言>.messages.terminal.failed`                      | [终端文案](/zh/blog/config-terminal/#messages)                          |
| `i18n.locales.<语言>.messages.terminal.tooLarge`                    | [终端文案](/zh/blog/config-terminal/#messages)                          |
| `i18n.locales.<语言>.messages.terminal.empty`                       | [终端文案](/zh/blog/config-terminal/#messages)                          |
| `i18n.locales.<语言>.messages.terminal.loading`                     | [终端文案](/zh/blog/config-terminal/#messages)                          |
| `i18n.locales.<语言>.messages.terminal.readerTitle`                 | [终端文案（当前未使用）](/zh/blog/config-terminal/#messages)            |
| `i18n.locales.<语言>.messages.terminal.readerHint`                  | [终端文案](/zh/blog/config-terminal/#messages)                          |
| `i18n.locales.<语言>.messages.terminal.readerCommand`               | [终端文案](/zh/blog/config-terminal/#messages)                          |

## 文章字段与站点配置分开查

文章 frontmatter 不放入上面的 site.config 路径表：[内容、日期和图片字段](/zh/blog/config-article/#frontmatter)、[OUTPUT 统计与状态](/zh/blog/config-article/#output-fields)、[兼容及当前未使用字段](/zh/blog/config-article/#legacy-frontmatter)。

碎片的三个 frontmatter 字段单独见[碎片内容字段](/zh/blog/config-fragments/#content-fields)，不与文章字段混用。

单篇文章是否进入站内搜索见[search 字段](/zh/blog/config-search/#article-search)，它不是 site.config 字段，也不是隐私开关。

## 怎么阅读字段说明

每篇字典使用相同约定：给出完整路径、类型、主题默认值、实际作用、限制、生效条件和示例。没有消费代码的字段不能因为类型仍接受就写成有效功能。

| 状态       | 含义                                                       |
| ---------- | ---------------------------------------------------------- |
| 生效       | 当前实现有对应作用                                         |
| 条件生效   | 需要开启功能、满足页面条件，或不被更高优先级配置覆盖       |
| 当前未使用 | 类型接受，但当前没有对应消费效果；不建议为了改变页面填写它 |
| 兼容保留   | 有明确兼容用途，具体说明保留什么、当前是否显示             |

主题默认值来自包内默认配置或内置文案；starter 可以覆盖它，demo 又有自己的个人配置。不要把演示站的作者、标题和歌单当作所有新博客的默认值。

语言字段的默认值随语言和回退链变化。字典会注明“未设置”“内置当前语言文案”或具体值；只给中文／英文例子时会标明范围，不冒充所有语言的固定默认值。

## 配置写在哪里，怎么合并？

示例中的配置片段合并到 `src/site.config.ts` 现有的 `defineThemeConfig({...})` 中；保留 import、export 和其他个人配置，不要在同一对象重复创建 theme 或 i18n。

对象递归合并，省略字段继续使用默认配置；数组整体替换；undefined 覆盖会被跳过。空字符串、空数组和 false 的含义由字段决定，不能统一理解成“恢复默认”。例如首页 hero 的空字符串是主动清空，homeTitle 的空白则继续回退。

修改后先在 dev 中查看对应页面；环境覆盖变化需要重启开发服务。正式网站要重新构建和部署，单独保存本地配置不会修改线上页面。

文章 frontmatter、Astro 配置和环境变量有不同的位置。字典遇到这些关联会说明，但不会把它们冒充成 site.config 字段。安装与升级见[第一篇教程](/zh/blog/starter-guide-1-configure-your-site/)，本地检查和部署见[发布教程](/zh/blog/starter-guide-deployment/)。
