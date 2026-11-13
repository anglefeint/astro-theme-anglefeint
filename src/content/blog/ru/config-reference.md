---
tags: ['anglefeint', 'config']
title: 'Справочник настроек: где изменить нужное?'
subtitle: 'Поиск по странице, функции и полному пути'
description: 'Указатель модулей настройки, полных путей, состояний полей и правил объединения.'
pubDate: '2026-11-13'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/hacker-01.webp'
---

**Примечание о версии:** Справочник следует текущему коду. Реакция на уменьшение движения, строгая проверка `blogPageSize` и изоляция при отключённых Fragments доступны с 0.36.1 и отсутствуют в 0.36.0. Установка по умолчанию и CLI не меняются.

Если вы уже знаете, чего хотите добиться, начните с руководств. Если нужно найти смысл поля, его значение по умолчанию или ограничения, используйте этот справочник. Оба источника опираются на текущий код темы и не требуют сначала читать документацию репозитория.

При первом знакомстве следуйте [восьми руководствам](/ru/blog/starter-guide-1-configure-your-site/#tutorial-order): установка → статьи → изображения → Fragments → страницы и функции → комментарии → языки → публикация. Необязательно включать все дополнительные функции. Справочник позволяет находить отдельные поля по мере необходимости, без чтения всей таблицы путей подряд.

Готовы разделы: [главная](/ru/blog/config-home/), [Blog List и списки тегов](/ru/blog/config-blog-list/), [страница статьи](/ru/blog/config-article/), [Fragments](/ru/blog/config-fragments/), [About](/ru/blog/config-about/), [Decoder](/ru/blog/config-decoder/), [музыкальный проигрыватель](/ru/blog/config-music/), [Giscus](/ru/blog/config-comments/), [языки и резервные значения](/ru/blog/config-languages/), [поиск и обнаружение контента](/ru/blog/config-search/), [GA4 и дополнения для ИИ](/ru/blog/config-analytics-ai/), [сайт и общие элементы интерфейса](/ru/blog/config-site-chrome/), [терминал](/ru/blog/config-terminal/).

## Поиск по странице или функции

| Что изменить                                                                        | Справочник                                             | Руководство                                                                                                                                                    |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Заголовок и описание главной, новые статьи, стартовые подсказки, терминал и переход | [Главная](/ru/blog/config-home/)                       | [Страницы и функции](/ru/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                                               |
| Название, домен, общая навигация, социальные ссылки и подвал                        | [Сайт и общий интерфейс](/ru/blog/config-site-chrome/) | [Установка и сведения о сайте](/ru/blog/starter-guide-1-configure-your-site/), [настройка страниц](/ru/blog/starter-guide-3-comments-about-and-theme-toggles/) |
| Blog List, списки тегов и пагинация                                                 | [Списки](/ru/blog/config-blog-list/)                   | [Списки и пагинация](/ru/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                                               |
| Страница статьи, оглавление, формулы и эффекты чтения                               | [Статьи](/ru/blog/config-article/)                     | [Первая статья](/ru/blog/starter-guide-2-languages-and-routing/)                                                                                               |
| Список и предпросмотр Fragments                                                     | [Fragments](/ru/blog/config-fragments/)                | [Публикация Fragment](/ru/blog/starter-guide-5-fragments/)                                                                                                     |
| Текст, контакты, боковая панель и инструменты About                                 | [About](/ru/blog/config-about/)                        | [Страницы и функции](/ru/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                                               |
| Терминал About, сообщения команд и средство чтения без редактирования               | [Терминал](/ru/blog/config-terminal/)                  | [Страницы и функции](/ru/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                                               |
| Страница Decoder и карточки материалов                                              | [Decoder](/ru/blog/config-decoder/)                    | [Страницы и функции](/ru/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                                               |
| Музыкальный проигрыватель                                                           | [Музыка](/ru/blog/config-music/)                       | [Настройка музыки](/ru/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                                                 |
| Giscus и общие обсуждения переводов                                                 | [Комментарии](/ru/blog/config-comments/)               | [Комментарии читателей](/ru/blog/starter-guide-4-giscus-comments/)                                                                                             |
| Включение языков, адреса, переводы интерфейса и резервные значения                  | [Языки](/ru/blog/config-languages/)                    | [Многоязычность](/ru/blog/starter-guide-languages/)                                                                                                            |
| Поиск и обнаружение контента                                                        | [Поиск](/ru/blog/config-search/)                       | [Написание статей](/ru/blog/starter-guide-2-languages-and-routing/), [публикация](/ru/blog/starter-guide-deployment/)                                          |
| Статистика GA4 и публичные дополнения для ИИ                                        | [GA4 и дополнения ИИ](/ru/blog/config-analytics-ai/)   | [Публикация на своём домене](/ru/blog/starter-guide-deployment/)                                                                                               |

У каждого поля есть основное место объяснения; остальные модули ссылаются на него. Например, главная использует переключатель Fragments, но он также влияет на полный список и не является настройкой только главной.

## Поиск по полному пути настройки

Указатель следует текущим публичным типам и включает поля, которые сейчас не используются. Ссылка ведёт к основному объяснению; различия между страницами связаны перекрёстными ссылками в модулях. `<locale>` — заполнитель для реального кода, например zh или en. Frontmatter статей перечислен отдельно от site.config.

| Полный путь                                                           | Где читать                                                                               |
| --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `i18n.locales.<locale>.site.homeTitle`                                | [Крупный заголовок главной](/ru/blog/config-home/#home-title)                            |
| `i18n.locales.<locale>.site.hero`                                     | [Видимое описание главной](/ru/blog/config-home/#home-hero)                              |
| `i18n.locales.<locale>.messages.siteDescription`                      | [Метаописание главной](/ru/blog/config-home/#home-description)                           |
| `theme.homeLatestCount`                                               | [Количество новых статей](/ru/blog/config-home/#latest-count)                            |
| `theme.home.showInitialize`                                           | [Переключатели стартовых подсказок](/ru/blog/config-home/#startup-switches)              |
| `theme.home.showFollow`                                               | [Переключатели стартовых подсказок](/ru/blog/config-home/#startup-switches)              |
| `theme.home.showTrace`                                                | [Переключатели стартовых подсказок](/ru/blog/config-home/#startup-switches)              |
| `theme.effects.enableHomePassage`                                     | [Переход по нажатию](/ru/blog/config-home/#home-passage)                                 |
| `i18n.locales.<locale>.messages.home.latest`                          | [Тексты главной](/ru/blog/config-home/#home-messages)                                    |
| `i18n.locales.<locale>.messages.home.viewAll`                         | [Тексты главной](/ru/blog/config-home/#home-messages)                                    |
| `i18n.locales.<locale>.messages.home.noPosts`                         | [Тексты главной](/ru/blog/config-home/#home-messages)                                    |
| `i18n.locales.<locale>.messages.home.openDoor`                        | [Тексты главной](/ru/blog/config-home/#home-messages)                                    |
| `i18n.locales.<locale>.messages.home.transmission`                    | [Текст терминала на широком экране](/ru/blog/config-home/#home-transmission)             |
| `i18n.locales.<locale>.messages.home.hero`                            | [Запасной текст описания](/ru/blog/config-home/#message-hero)                            |
| `theme.fragments.enabled`                                             | [Включение Fragments](/ru/blog/config-fragments/#enabled)                                |
| `i18n.locales.<locale>.messages.blog.allPosts`                        | [Общий переход к статьям и тегам](/ru/blog/config-blog-list/#tag-messages)               |
| `i18n.locales.<locale>.messages.fragments.title`                      | [Тексты Fragments](/ru/blog/config-fragments/#fragment-messages)                         |
| `i18n.locales.<locale>.messages.fragments.close`                      | [Тексты Fragments](/ru/blog/config-fragments/#fragment-messages)                         |
| `i18n.locales.<locale>.messages.siteTitle`                            | [Поле заголовка, сейчас не используется](/ru/blog/config-site-chrome/#legacy-site-title) |
| `theme.blogPageSize`                                                  | [Статей на странице](/ru/blog/config-blog-list/#page-size)                               |
| `theme.tags.enabled`                                                  | [Включение тегов](/ru/blog/config-blog-list/#tags-enabled)                               |
| `theme.pagination.windowSize`                                         | [Окно номеров страниц](/ru/blog/config-blog-list/#pagination-window)                     |
| `theme.pagination.showJumpThreshold`                                  | [Порог перехода к странице](/ru/blog/config-blog-list/#jump-threshold)                   |
| `theme.pagination.jump.enabled`                                       | [Включение перехода к странице](/ru/blog/config-blog-list/#jump-enabled)                 |
| `theme.pagination.jump.enterToGo`                                     | [Переход по Enter](/ru/blog/config-blog-list/#jump-enter)                                |
| `theme.pagination.style.enabled`                                      | [Включение оформления пагинации](/ru/blog/config-blog-list/#style-enabled)               |
| `theme.pagination.style.mode`                                         | [Стратегия вариантов](/ru/blog/config-blog-list/#style-mode)                             |
| `theme.pagination.style.variants`                                     | [Количество вариантов](/ru/blog/config-blog-list/#style-variants)                        |
| `theme.pagination.style.fixedVariant`                                 | [Фиксированный вариант](/ru/blog/config-blog-list/#style-fixed)                          |
| `i18n.locales.<locale>.messages.blog.title`                           | [Заголовок и описание списков](/ru/blog/config-blog-list/#archive-messages)              |
| `i18n.locales.<locale>.messages.blog.pageTitle`                       | [Заголовок и описание списков](/ru/blog/config-blog-list/#archive-messages)              |
| `i18n.locales.<locale>.messages.blog.archiveDescription`              | [Заголовок и описание списков](/ru/blog/config-blog-list/#archive-messages)              |
| `i18n.locales.<locale>.messages.blog.pageDescription`                 | [Заголовок и описание списков](/ru/blog/config-blog-list/#archive-messages)              |
| `i18n.locales.<locale>.messages.blog.previous`                        | [Тексты пагинации](/ru/blog/config-blog-list/#pagination-messages)                       |
| `i18n.locales.<locale>.messages.blog.next`                            | [Тексты пагинации](/ru/blog/config-blog-list/#pagination-messages)                       |
| `i18n.locales.<locale>.messages.blog.paginationAria`                  | [Тексты пагинации](/ru/blog/config-blog-list/#pagination-messages)                       |
| `i18n.locales.<locale>.messages.blog.jumpTo`                          | [Тексты пагинации](/ru/blog/config-blog-list/#pagination-messages)                       |
| `i18n.locales.<locale>.messages.blog.jumpInputLabel`                  | [Тексты пагинации](/ru/blog/config-blog-list/#pagination-messages)                       |
| `i18n.locales.<locale>.messages.blog.jumpGo`                          | [Тексты пагинации](/ru/blog/config-blog-list/#pagination-messages)                       |
| `i18n.locales.<locale>.messages.blog.tags`                            | [Тексты тегов](/ru/blog/config-blog-list/#tag-messages)                                  |
| `i18n.locales.<locale>.messages.blog.noTags`                          | [Тексты тегов](/ru/blog/config-blog-list/#tag-messages)                                  |
| `i18n.locales.<locale>.messages.blog.taggedPosts`                     | [Тексты тегов](/ru/blog/config-blog-list/#tag-messages)                                  |
| `theme.toc.enabled`                                                   | [Функции статьи](/ru/blog/config-article/#feature-switches)                              |
| `theme.math.enabled`                                                  | [Функции статьи](/ru/blog/config-article/#feature-switches)                              |
| `theme.effects.enableRedQueen`                                        | [Функции статьи](/ru/blog/config-article/#feature-switches)                              |
| `theme.search.enabled`                                                | [Включение поиска по сайту](/ru/blog/config-search/#enabled)                             |
| `theme.socialImage.enabled`                                           | [Функции статьи](/ru/blog/config-article/#feature-switches)                              |
| `site.author`                                                         | [Сайт и общие элементы интерфейса](/ru/blog/config-site-chrome/#identity)                |
| `site.ogImage`                                                        | [Сайт и общие элементы интерфейса](/ru/blog/config-site-chrome/#identity)                |
| `theme.enableAboutPage`                                               | [Включение About](/ru/blog/config-about/#page-enabled)                                   |
| `theme.footer.showCredits`                                            | [Сайт и общие элементы интерфейса](/ru/blog/config-site-chrome/#footer)                  |
| `theme.comments.enabled`                                              | [Комментарии Giscus](/ru/blog/config-comments/#controls)                                 |
| `i18n.locales.<locale>.messages.blog.rqBadge`                         | [Тексты страницы статьи](/ru/blog/config-article/#article-messages)                      |
| `i18n.locales.<locale>.messages.blog.rqReplayAria`                    | [Тексты страницы статьи](/ru/blog/config-article/#article-messages)                      |
| `i18n.locales.<locale>.messages.blog.backToTop`                       | [Тексты страницы статьи](/ru/blog/config-article/#article-messages)                      |
| `i18n.locales.<locale>.messages.blog.toastP10`                        | [Тексты страницы статьи](/ru/blog/config-article/#article-messages)                      |
| `i18n.locales.<locale>.messages.blog.toastP30`                        | [Тексты страницы статьи](/ru/blog/config-article/#article-messages)                      |
| `i18n.locales.<locale>.messages.blog.toastP60`                        | [Тексты страницы статьи](/ru/blog/config-article/#article-messages)                      |
| `i18n.locales.<locale>.messages.blog.toastDone`                       | [Тексты страницы статьи](/ru/blog/config-article/#article-messages)                      |
| `i18n.locales.<locale>.messages.blog.metaPublished`                   | [Тексты страницы статьи](/ru/blog/config-article/#article-messages)                      |
| `i18n.locales.<locale>.messages.blog.metaAuthor`                      | [Тексты страницы статьи](/ru/blog/config-article/#article-messages)                      |
| `i18n.locales.<locale>.messages.blog.metaUpdated`                     | [Тексты страницы статьи](/ru/blog/config-article/#article-messages)                      |
| `i18n.locales.<locale>.messages.blog.systemStatusAria`                | [Тексты страницы статьи](/ru/blog/config-article/#article-messages)                      |
| `i18n.locales.<locale>.messages.blog.systemModelLabel`                | [Тексты страницы статьи](/ru/blog/config-article/#article-messages)                      |
| `i18n.locales.<locale>.messages.blog.systemModeLabel`                 | [Тексты страницы статьи](/ru/blog/config-article/#article-messages)                      |
| `i18n.locales.<locale>.messages.blog.systemStateLabel`                | [Тексты страницы статьи](/ru/blog/config-article/#article-messages)                      |
| `i18n.locales.<locale>.messages.blog.promptContextLabel`              | [Тексты страницы статьи](/ru/blog/config-article/#article-messages)                      |
| `i18n.locales.<locale>.messages.blog.heroMonitor`                     | [Тексты страницы статьи](/ru/blog/config-article/#article-messages)                      |
| `i18n.locales.<locale>.messages.blog.heroSignalSync`                  | [Тексты страницы статьи](/ru/blog/config-article/#article-messages)                      |
| `i18n.locales.<locale>.messages.blog.heroModelOnline`                 | [Тексты страницы статьи](/ru/blog/config-article/#article-messages)                      |
| `i18n.locales.<locale>.messages.blog.toc`                             | [Тексты страницы статьи](/ru/blog/config-article/#article-messages)                      |
| `i18n.locales.<locale>.messages.blog.responseOutput`                  | [Тексты страницы статьи](/ru/blog/config-article/#article-messages)                      |
| `i18n.locales.<locale>.messages.blog.statsWords`                      | [Тексты страницы статьи](/ru/blog/config-article/#article-messages)                      |
| `i18n.locales.<locale>.messages.blog.statsTokens`                     | [Тексты страницы статьи](/ru/blog/config-article/#article-messages)                      |
| `i18n.locales.<locale>.messages.blog.copySectionLink`                 | [Тексты страницы статьи](/ru/blog/config-article/#article-messages)                      |
| `i18n.locales.<locale>.messages.blog.regenerate`                      | [Тексты страницы статьи](/ru/blog/config-article/#article-messages)                      |
| `i18n.locales.<locale>.messages.blog.relatedAria`                     | [Тексты страницы статьи](/ru/blog/config-article/#article-messages)                      |
| `i18n.locales.<locale>.messages.blog.related`                         | [Тексты страницы статьи](/ru/blog/config-article/#article-messages)                      |
| `i18n.locales.<locale>.messages.blog.backToBlogAria`                  | [Тексты страницы статьи](/ru/blog/config-article/#article-messages)                      |
| `i18n.locales.<locale>.messages.blog.backToBlog`                      | [Тексты страницы статьи](/ru/blog/config-article/#article-messages)                      |
| `i18n.locales.<locale>.messages.blog.comments`                        | [Тексты страницы статьи](/ru/blog/config-article/#article-messages)                      |
| `i18n.locales.<locale>.messages.blog.metaReadMinutes`                 | [Тексты статьи, сейчас не используются](/ru/blog/config-article/#article-messages)       |
| `i18n.locales.<locale>.messages.blog.latencyLabel`                    | [Тексты статьи, сейчас не используются](/ru/blog/config-article/#article-messages)       |
| `i18n.locales.<locale>.messages.blog.confidenceLabel`                 | [Тексты статьи, сейчас не используются](/ru/blog/config-article/#article-messages)       |
| `i18n.locales.<locale>.messages.codeCopy.copy`                        | [Тексты взаимодействий при чтении](/ru/blog/config-article/#interaction-messages)        |
| `i18n.locales.<locale>.messages.codeCopy.copied`                      | [Тексты взаимодействий при чтении](/ru/blog/config-article/#interaction-messages)        |
| `i18n.locales.<locale>.messages.codeCopy.failed`                      | [Тексты взаимодействий при чтении](/ru/blog/config-article/#interaction-messages)        |
| `i18n.locales.<locale>.messages.imagePreview.open`                    | [Тексты взаимодействий при чтении](/ru/blog/config-article/#interaction-messages)        |
| `i18n.locales.<locale>.messages.imagePreview.close`                   | [Тексты взаимодействий при чтении](/ru/blog/config-article/#interaction-messages)        |
| `theme.fragments.pageSize`                                            | [Fragments на странице](/ru/blog/config-fragments/#page-size)                            |
| `theme.fragments.comments.enabled`                                    | [Комментарии Fragments](/ru/blog/config-fragments/#comments-enabled)                     |
| `i18n.locales.<locale>.messages.fragments.description`                | [Тексты Fragments](/ru/blog/config-fragments/#fragment-messages)                         |
| `i18n.locales.<locale>.messages.fragments.empty`                      | [Тексты Fragments](/ru/blog/config-fragments/#fragment-messages)                         |
| `i18n.locales.<locale>.messages.fragments.comments`                   | [Тексты Fragments](/ru/blog/config-fragments/#fragment-messages)                         |
| `i18n.locales.<locale>.messages.fragments.previous`                   | [Тексты Fragments, сейчас не используются](/ru/blog/config-fragments/#fragment-messages) |
| `i18n.locales.<locale>.messages.fragments.next`                       | [Тексты Fragments, сейчас не используются](/ru/blog/config-fragments/#fragment-messages) |
| `i18n.locales.<locale>.messages.fragments.loading`                    | [Тексты Fragments](/ru/blog/config-fragments/#fragment-messages)                         |
| `i18n.locales.<locale>.messages.fragments.error`                      | [Тексты Fragments](/ru/blog/config-fragments/#fragment-messages)                         |
| `i18n.locales.<locale>.messages.fragments.retry`                      | [Тексты Fragments](/ru/blog/config-fragments/#fragment-messages)                         |
| `i18n.locales.<locale>.messages.fragments.copyLink`                   | [Тексты Fragments](/ru/blog/config-fragments/#fragment-messages)                         |
| `i18n.locales.<locale>.messages.fragments.linkCopied`                 | [Тексты Fragments](/ru/blog/config-fragments/#fragment-messages)                         |
| `i18n.locales.<locale>.messages.fragments.copyLinkFailed`             | [Тексты Fragments](/ru/blog/config-fragments/#fragment-messages)                         |
| `i18n.locales.<locale>.messages.fragments.notFound`                   | [Тексты Fragments](/ru/blog/config-fragments/#fragment-messages)                         |
| `i18n.locales.<locale>.messages.fragments.indexError`                 | [Тексты Fragments](/ru/blog/config-fragments/#fragment-messages)                         |
| `theme.comments.repo`                                                 | [Комментарии Giscus](/ru/blog/config-comments/#connection)                               |
| `theme.comments.repoId`                                               | [Комментарии Giscus](/ru/blog/config-comments/#connection)                               |
| `theme.comments.category`                                             | [Комментарии Giscus](/ru/blog/config-comments/#connection)                               |
| `theme.comments.categoryId`                                           | [Комментарии Giscus](/ru/blog/config-comments/#connection)                               |
| `i18n.locales.<locale>.about.metaLine`                                | [Основной текст About](/ru/blog/config-about/#body-fields)                               |
| `i18n.locales.<locale>.about.sections.who`                            | [Основной текст About](/ru/blog/config-about/#body-fields)                               |
| `i18n.locales.<locale>.about.sections.what`                           | [Основной текст About](/ru/blog/config-about/#body-fields)                               |
| `i18n.locales.<locale>.about.sections.ethos`                          | [Основной текст About](/ru/blog/config-about/#body-fields)                               |
| `i18n.locales.<locale>.about.sections.now`                            | [Основной текст About](/ru/blog/config-about/#body-fields)                               |
| `i18n.locales.<locale>.about.sections.contactLead`                    | [Основной текст About](/ru/blog/config-about/#body-fields)                               |
| `i18n.locales.<locale>.about.sections.signature`                      | [Основной текст About](/ru/blog/config-about/#body-fields)                               |
| `i18n.locales.<locale>.about.contact.email`                           | [Контакты About](/ru/blog/config-about/#contact-fields)                                  |
| `i18n.locales.<locale>.about.contact.githubUrl`                       | [Контакты About](/ru/blog/config-about/#contact-fields)                                  |
| `i18n.locales.<locale>.about.contact.githubLabel`                     | [Контакты About](/ru/blog/config-about/#contact-fields)                                  |
| `i18n.locales.<locale>.about.sidebar.dlData`                          | [Входы в инструменты About](/ru/blog/config-about/#tool-fields)                          |
| `i18n.locales.<locale>.about.sidebar.ai`                              | [Входы в инструменты About](/ru/blog/config-about/#tool-fields)                          |
| `i18n.locales.<locale>.about.sidebar.decryptor`                       | [Входы в инструменты About](/ru/blog/config-about/#tool-fields)                          |
| `i18n.locales.<locale>.about.sidebar.help`                            | [Входы в инструменты About](/ru/blog/config-about/#tool-fields)                          |
| `i18n.locales.<locale>.about.sidebar.allScripts`                      | [Входы в инструменты About](/ru/blog/config-about/#tool-fields)                          |
| `i18n.locales.<locale>.about.scriptsPath`                             | [Входы в инструменты About](/ru/blog/config-about/#tool-fields)                          |
| `i18n.locales.<locale>.about.labels.modalOutput`                      | [Общие тексты About: проверьте состояние](/ru/blog/config-about/#label-fields)           |
| `i18n.locales.<locale>.about.labels.modalClose`                       | [Общие тексты About](/ru/blog/config-about/#label-fields)                                |
| `i18n.locales.<locale>.about.labels.responseOutput`                   | [Общие тексты About](/ru/blog/config-about/#label-fields)                                |
| `i18n.locales.<locale>.about.labels.contactEmailLead`                 | [Общие тексты About](/ru/blog/config-about/#label-fields)                                |
| `i18n.locales.<locale>.about.labels.contactConnectLead`               | [Общие тексты About](/ru/blog/config-about/#label-fields)                                |
| `i18n.locales.<locale>.about.labels.backToTop`                        | [Общие тексты About](/ru/blog/config-about/#label-fields)                                |
| `i18n.locales.<locale>.about.labels.quickAccess`                      | [Общие тексты About](/ru/blog/config-about/#label-fields)                                |
| `i18n.locales.<locale>.about.labels.contactEmailLabel`                | [Общие тексты About](/ru/blog/config-about/#label-fields)                                |
| `i18n.locales.<locale>.about.modals.dlData.title`                     | [Окна инструментов About](/ru/blog/config-about/#modal-fields)                           |
| `i18n.locales.<locale>.about.modals.dlData.subtitle`                  | [Окна инструментов About](/ru/blog/config-about/#modal-fields)                           |
| `i18n.locales.<locale>.about.modals.ai.title`                         | [Окна инструментов About](/ru/blog/config-about/#modal-fields)                           |
| `i18n.locales.<locale>.about.modals.ai.lines`                         | [Окна инструментов About](/ru/blog/config-about/#modal-fields)                           |
| `i18n.locales.<locale>.about.modals.decryptor.title`                  | [Окна инструментов About](/ru/blog/config-about/#modal-fields)                           |
| `i18n.locales.<locale>.about.modals.decryptor.header`                 | [Окна About: проверьте состояние](/ru/blog/config-about/#modal-fields)                   |
| `i18n.locales.<locale>.about.modals.decryptor.keysLabel`              | [Окна About: проверьте состояние](/ru/blog/config-about/#modal-fields)                   |
| `i18n.locales.<locale>.about.modals.decryptor.currentPassphraseLabel` | [Окна About: проверьте состояние](/ru/blog/config-about/#modal-fields)                   |
| `i18n.locales.<locale>.about.modals.decryptor.masterKeyLabel`         | [Окна About: проверьте состояние](/ru/blog/config-about/#modal-fields)                   |
| `i18n.locales.<locale>.about.modals.decryptor.transientKeyLabel`      | [Окна About: проверьте состояние](/ru/blog/config-about/#modal-fields)                   |
| `i18n.locales.<locale>.about.modals.help.title`                       | [Окна инструментов About](/ru/blog/config-about/#modal-fields)                           |
| `i18n.locales.<locale>.about.modals.help.statsLabel`                  | [Окна инструментов About](/ru/blog/config-about/#modal-fields)                           |
| `i18n.locales.<locale>.about.modals.help.typedPrefix`                 | [Окна инструментов About](/ru/blog/config-about/#modal-fields)                           |
| `i18n.locales.<locale>.about.modals.help.typedSuffix`                 | [Окна инструментов About](/ru/blog/config-about/#modal-fields)                           |
| `i18n.locales.<locale>.about.modals.allScripts.title`                 | [Окна инструментов About](/ru/blog/config-about/#modal-fields)                           |
| `i18n.locales.<locale>.about.effects.backgroundLines`                 | [Эффекты About: проверьте состояние](/ru/blog/config-about/#effect-fields)               |
| `i18n.locales.<locale>.about.effects.scrollToasts.p30`                | [Эффекты About](/ru/blog/config-about/#effect-fields)                                    |
| `i18n.locales.<locale>.about.effects.scrollToasts.p60`                | [Эффекты About](/ru/blog/config-about/#effect-fields)                                    |
| `i18n.locales.<locale>.about.effects.scrollToasts.p90`                | [Эффекты About](/ru/blog/config-about/#effect-fields)                                    |
| `i18n.locales.<locale>.messages.about.title`                          | [About и общие элементы управления](/ru/blog/config-about/#about-messages)               |
| `i18n.locales.<locale>.messages.about.description`                    | [About и общие элементы управления](/ru/blog/config-about/#about-messages)               |
| `i18n.locales.<locale>.messages.about.who`                            | [About и общие элементы управления](/ru/blog/config-about/#about-messages)               |
| `i18n.locales.<locale>.messages.about.what`                           | [About и общие элементы управления](/ru/blog/config-about/#about-messages)               |
| `i18n.locales.<locale>.messages.about.ethos`                          | [About и общие элементы управления](/ru/blog/config-about/#about-messages)               |
| `i18n.locales.<locale>.messages.about.now`                            | [About и общие элементы управления](/ru/blog/config-about/#about-messages)               |
| `i18n.locales.<locale>.messages.about.contact`                        | [About и общие элементы управления](/ru/blog/config-about/#about-messages)               |
| `i18n.locales.<locale>.messages.about.regenerate`                     | [About и общие элементы управления](/ru/blog/config-about/#about-messages)               |
| `i18n.locales.<locale>.messages.windowControls.collapse`              | [About и общие элементы управления](/ru/blog/config-about/#about-messages)               |
| `i18n.locales.<locale>.messages.windowControls.expand`                | [About и общие элементы управления](/ru/blog/config-about/#about-messages)               |
| `i18n.locales.<locale>.messages.windowControls.restore`               | [About и общие элементы управления](/ru/blog/config-about/#about-messages)               |
| `i18n.locales.<locale>.messages.windowControls.fullscreen`            | [About и общие элементы управления](/ru/blog/config-about/#about-messages)               |
| `i18n.locales.<locale>.messages.scriptFolders.copyTitle`              | [About и общие элементы управления](/ru/blog/config-about/#about-messages)               |
| `i18n.locales.<locale>.messages.scriptFolders.copied`                 | [About и общие элементы управления](/ru/blog/config-about/#about-messages)               |
| `i18n.locales.<locale>.messages.scriptFolders.failed`                 | [About и общие элементы управления](/ru/blog/config-about/#about-messages)               |
| `theme.enableDecoderPage`                                             | [Включение Decoder](/ru/blog/config-decoder/#page-enabled)                               |
| `i18n.locales.<locale>.messages.nav.about`                            | [Сайт и общие элементы интерфейса](/ru/blog/config-site-chrome/#chrome-messages)         |
| `i18n.locales.<locale>.messages.decoder.input`                        | [Тексты Decoder](/ru/blog/config-decoder/#text-messages)                                 |
| `i18n.locales.<locale>.messages.decoder.placeholder`                  | [Тексты Decoder](/ru/blog/config-decoder/#text-messages)                                 |
| `i18n.locales.<locale>.messages.decoder.format`                       | [Тексты Decoder](/ru/blog/config-decoder/#text-messages)                                 |
| `i18n.locales.<locale>.messages.decoder.auto`                         | [Тексты Decoder](/ru/blog/config-decoder/#text-messages)                                 |
| `i18n.locales.<locale>.messages.decoder.decode`                       | [Тексты Decoder](/ru/blog/config-decoder/#text-messages)                                 |
| `i18n.locales.<locale>.messages.decoder.clear`                        | [Тексты Decoder](/ru/blog/config-decoder/#text-messages)                                 |
| `i18n.locales.<locale>.messages.decoder.copy`                         | [Тексты Decoder](/ru/blog/config-decoder/#text-messages)                                 |
| `i18n.locales.<locale>.messages.decoder.reuse`                        | [Тексты Decoder](/ru/blog/config-decoder/#text-messages)                                 |
| `i18n.locales.<locale>.messages.decoder.supported`                    | [Тексты Decoder](/ru/blog/config-decoder/#text-messages)                                 |
| `i18n.locales.<locale>.messages.decoder.html`                         | [Тексты Decoder](/ru/blog/config-decoder/#text-messages)                                 |
| `i18n.locales.<locale>.messages.decoder.unicode`                      | [Тексты Decoder](/ru/blog/config-decoder/#text-messages)                                 |
| `i18n.locales.<locale>.messages.decoder.jwtWarning`                   | [Тексты Decoder](/ru/blog/config-decoder/#text-messages)                                 |
| `i18n.locales.<locale>.messages.decoder.copied`                       | [Тексты Decoder](/ru/blog/config-decoder/#text-messages)                                 |
| `i18n.locales.<locale>.messages.decoder.copyFailed`                   | [Тексты Decoder](/ru/blog/config-decoder/#text-messages)                                 |
| `i18n.locales.<locale>.messages.decoder.output`                       | [Тексты Decoder](/ru/blog/config-decoder/#text-messages)                                 |
| `i18n.locales.<locale>.messages.decoder.local`                        | [Тексты Decoder](/ru/blog/config-decoder/#text-messages)                                 |
| `i18n.locales.<locale>.messages.decoder.ready`                        | [Тексты Decoder](/ru/blog/config-decoder/#text-messages)                                 |
| `i18n.locales.<locale>.messages.decoder.running`                      | [Тексты Decoder](/ru/blog/config-decoder/#text-messages)                                 |
| `i18n.locales.<locale>.messages.decoder.done`                         | [Тексты Decoder](/ru/blog/config-decoder/#text-messages)                                 |
| `i18n.locales.<locale>.messages.decoder.empty`                        | [Тексты Decoder](/ru/blog/config-decoder/#text-messages)                                 |
| `i18n.locales.<locale>.messages.decoder.tooLong`                      | [Тексты Decoder](/ru/blog/config-decoder/#text-messages)                                 |
| `i18n.locales.<locale>.messages.decoder.invalid`                      | [Тексты Decoder](/ru/blog/config-decoder/#text-messages)                                 |
| `i18n.locales.<locale>.messages.decoder.binary`                       | [Тексты Decoder](/ru/blog/config-decoder/#text-messages)                                 |
| `i18n.locales.<locale>.messages.decoder.unknown`                      | [Тексты Decoder](/ru/blog/config-decoder/#text-messages)                                 |
| `i18n.locales.<locale>.messages.decoder.ambiguous`                    | [Тексты Decoder](/ru/blog/config-decoder/#text-messages)                                 |
| `i18n.locales.<locale>.messages.decoder.example`                      | [Тексты Decoder](/ru/blog/config-decoder/#text-messages)                                 |
| `i18n.locales.<locale>.messages.decoderPage.description`              | [Тексты Decoder](/ru/blog/config-decoder/#page-messages)                                 |
| `i18n.locales.<locale>.messages.decoderPage.fullTool`                 | [Тексты Decoder](/ru/blog/config-decoder/#page-messages)                                 |
| `i18n.locales.<locale>.messages.decoderPage.task`                     | [Тексты Decoder](/ru/blog/config-decoder/#page-messages)                                 |
| `i18n.locales.<locale>.messages.decoderPage.textTask`                 | [Тексты Decoder](/ru/blog/config-decoder/#page-messages)                                 |
| `i18n.locales.<locale>.messages.decoderPage.callTask`                 | [Тексты Decoder](/ru/blog/config-decoder/#page-messages)                                 |
| `i18n.locales.<locale>.messages.decoderPage.addressTask`              | [Тексты Decoder](/ru/blog/config-decoder/#page-messages)                                 |
| `i18n.locales.<locale>.messages.decoderPage.addressHint`              | [Тексты Decoder](/ru/blog/config-decoder/#page-messages)                                 |
| `i18n.locales.<locale>.messages.decoderPage.chain`                    | [Тексты Decoder](/ru/blog/config-decoder/#page-messages)                                 |
| `i18n.locales.<locale>.messages.decoderPage.decimals`                 | [Тексты Decoder](/ru/blog/config-decoder/#page-messages)                                 |
| `i18n.locales.<locale>.messages.decoderPage.precisionHint`            | [Тексты Decoder](/ru/blog/config-decoder/#page-messages)                                 |
| `i18n.locales.<locale>.messages.decoderPage.network`                  | [Тексты Decoder](/ru/blog/config-decoder/#page-messages)                                 |
| `i18n.locales.<locale>.messages.decoderPage.history`                  | [Тексты Decoder](/ru/blog/config-decoder/#page-messages)                                 |
| `i18n.locales.<locale>.messages.decoderPage.back`                     | [Тексты Decoder](/ru/blog/config-decoder/#page-messages)                                 |
| `i18n.locales.<locale>.messages.decoderPage.export`                   | [Тексты Decoder](/ru/blog/config-decoder/#page-messages)                                 |
| `i18n.locales.<locale>.messages.decoderPage.limits`                   | [Тексты Decoder](/ru/blog/config-decoder/#page-messages)                                 |
| `i18n.locales.<locale>.messages.decoderPage.callNotice`               | [Тексты Decoder](/ru/blog/config-decoder/#page-messages)                                 |
| `i18n.locales.<locale>.messages.decoderPage.addressNotice`            | [Тексты Decoder](/ru/blog/config-decoder/#page-messages)                                 |
| `i18n.locales.<locale>.messages.decoderPage.unsupported`              | [Тексты Decoder](/ru/blog/config-decoder/#page-messages)                                 |
| `i18n.locales.<locale>.messages.decoderPage.checksum`                 | [Тексты Decoder](/ru/blog/config-decoder/#page-messages)                                 |
| `i18n.locales.<locale>.messages.decoderPage.length`                   | [Тексты Decoder](/ru/blog/config-decoder/#page-messages)                                 |
| `i18n.locales.<locale>.messages.decoderPage.wrongNetwork`             | [Тексты Decoder](/ru/blog/config-decoder/#page-messages)                                 |
| `i18n.locales.<locale>.messages.decoderPage.stepLimit`                | [Тексты Decoder](/ru/blog/config-decoder/#page-messages)                                 |
| `i18n.locales.<locale>.messages.decoderPage.budget`                   | [Тексты Decoder](/ru/blog/config-decoder/#page-messages)                                 |
| `i18n.locales.<locale>.messages.decoderPage.addressParse`             | [Тексты Decoder](/ru/blog/config-decoder/#page-messages)                                 |
| `i18n.locales.<locale>.messages.decoderPage.addressCheck`             | [Тексты Decoder](/ru/blog/config-decoder/#page-messages)                                 |
| `i18n.locales.<locale>.messages.decoderPage.addressResult`            | [Тексты Decoder](/ru/blog/config-decoder/#page-messages)                                 |
| `i18n.locales.<locale>.messages.decoderPage.callParse`                | [Тексты Decoder](/ru/blog/config-decoder/#page-messages)                                 |
| `i18n.locales.<locale>.messages.decoderPage.rawOnly`                  | [Тексты Decoder](/ru/blog/config-decoder/#page-messages)                                 |
| `i18n.locales.<locale>.messages.decoderPage.amountResult`             | [Тексты Decoder](/ru/blog/config-decoder/#page-messages)                                 |
| `i18n.locales.<locale>.messages.decoderPage.inputHint`                | [Тексты Decoder](/ru/blog/config-decoder/#page-messages)                                 |
| `i18n.locales.<locale>.messages.decoderPage.loadFailed`               | [Тексты Decoder](/ru/blog/config-decoder/#page-messages)                                 |
| `i18n.locales.<locale>.messages.decoderPage.readings.tribute`         | [Материалы для чтения Decoder](/ru/blog/config-decoder/#readings)                        |
| `i18n.locales.<locale>.messages.decoderPage.readings.links`           | [Материалы для чтения Decoder](/ru/blog/config-decoder/#readings)                        |
| `i18n.locales.<locale>.messages.decoderPage.readings.links[].title`   | [Материалы для чтения Decoder](/ru/blog/config-decoder/#readings)                        |
| `i18n.locales.<locale>.messages.decoderPage.readings.links[].href`    | [Материалы для чтения Decoder](/ru/blog/config-decoder/#readings)                        |
| `i18n.locales.<locale>.messages.decoderPage.readings.links[].author`  | [Материалы для чтения Decoder](/ru/blog/config-decoder/#readings)                        |
| `i18n.locales.<locale>.messages.decoderPage.readings.links[].year`    | [Материалы для чтения Decoder](/ru/blog/config-decoder/#readings)                        |
| `i18n.locales.<locale>.messages.decoderPage.readings.links[].cover`   | [Материалы для чтения Decoder](/ru/blog/config-decoder/#readings)                        |
| `theme.music.enabled`                                                 | [Музыкальный проигрыватель](/ru/blog/config-music/#enabled)                              |
| `theme.music.tracks`                                                  | [Музыкальный проигрыватель](/ru/blog/config-music/#tracks)                               |
| `theme.music.tracks[].title`                                          | [Музыкальный проигрыватель](/ru/blog/config-music/#track-fields)                         |
| `theme.music.tracks[].artist`                                         | [Музыкальный проигрыватель](/ru/blog/config-music/#track-fields)                         |
| `theme.music.tracks[].src`                                            | [Музыкальный проигрыватель](/ru/blog/config-music/#track-fields)                         |
| `i18n.locales.<locale>.messages.music.label`                          | [Тексты проигрывателя](/ru/blog/config-music/#music-messages)                            |
| `i18n.locales.<locale>.messages.music.play`                           | [Тексты проигрывателя](/ru/blog/config-music/#music-messages)                            |
| `i18n.locales.<locale>.messages.music.pause`                          | [Тексты проигрывателя](/ru/blog/config-music/#music-messages)                            |
| `i18n.locales.<locale>.messages.music.prev`                           | [Тексты проигрывателя](/ru/blog/config-music/#music-messages)                            |
| `i18n.locales.<locale>.messages.music.next`                           | [Тексты проигрывателя](/ru/blog/config-music/#music-messages)                            |
| `i18n.locales.<locale>.messages.music.open`                           | [Тексты проигрывателя](/ru/blog/config-music/#music-messages)                            |
| `i18n.locales.<locale>.messages.music.close`                          | [Тексты проигрывателя](/ru/blog/config-music/#music-messages)                            |
| `i18n.locales.<locale>.messages.music.progress`                       | [Тексты проигрывателя](/ru/blog/config-music/#music-messages)                            |
| `i18n.locales.<locale>.messages.music.volume`                         | [Тексты проигрывателя](/ru/blog/config-music/#music-messages)                            |
| `i18n.locales.<locale>.messages.music.queue`                          | [Тексты проигрывателя](/ru/blog/config-music/#music-messages)                            |
| `i18n.locales.<locale>.messages.music.mute`                           | [Тексты проигрывателя](/ru/blog/config-music/#music-messages)                            |
| `i18n.locales.<locale>.messages.music.unmute`                         | [Тексты проигрывателя](/ru/blog/config-music/#music-messages)                            |
| `i18n.locales.<locale>.messages.music.idle`                           | [Тексты проигрывателя](/ru/blog/config-music/#music-messages)                            |
| `i18n.locales.<locale>.messages.music.loading`                        | [Тексты проигрывателя](/ru/blog/config-music/#music-messages)                            |
| `i18n.locales.<locale>.messages.music.playing`                        | [Тексты проигрывателя](/ru/blog/config-music/#music-messages)                            |
| `i18n.locales.<locale>.messages.music.paused`                         | [Тексты проигрывателя](/ru/blog/config-music/#music-messages)                            |
| `i18n.locales.<locale>.messages.music.blocked`                        | [Тексты проигрывателя](/ru/blog/config-music/#music-messages)                            |
| `i18n.locales.<locale>.messages.music.error`                          | [Тексты проигрывателя](/ru/blog/config-music/#music-messages)                            |
| `i18n.locales.<locale>.messages.music.noScript`                       | [Тексты проигрывателя](/ru/blog/config-music/#music-messages)                            |
| `theme.comments.shareAcrossLocales`                                   | [Комментарии Giscus](/ru/blog/config-comments/#sharing)                                  |
| `theme.comments.mapping`                                              | [Комментарии Giscus](/ru/blog/config-comments/#mapping)                                  |
| `theme.comments.term`                                                 | [Комментарии Giscus](/ru/blog/config-comments/#mapping)                                  |
| `theme.comments.number`                                               | [Комментарии Giscus](/ru/blog/config-comments/#mapping)                                  |
| `theme.comments.strict`                                               | [Комментарии Giscus](/ru/blog/config-comments/#mapping)                                  |
| `theme.comments.reactionsEnabled`                                     | [Комментарии Giscus](/ru/blog/config-comments/#appearance)                               |
| `theme.comments.emitMetadata`                                         | [Комментарии Giscus](/ru/blog/config-comments/#appearance)                               |
| `theme.comments.inputPosition`                                        | [Комментарии Giscus](/ru/blog/config-comments/#appearance)                               |
| `theme.comments.theme`                                                | [Комментарии Giscus](/ru/blog/config-comments/#appearance)                               |
| `theme.comments.lang`                                                 | [Комментарии Giscus](/ru/blog/config-comments/#appearance)                               |
| `theme.comments.loading`                                              | [Комментарии Giscus](/ru/blog/config-comments/#appearance)                               |
| `theme.comments.crossorigin`                                          | [Комментарии Giscus](/ru/blog/config-comments/#appearance)                               |
| `i18n.defaultLocale`                                                  | [Языки и резервные значения](/ru/blog/config-languages/#registry)                        |
| `i18n.locales`                                                        | [Языки и резервные значения](/ru/blog/config-languages/#registry)                        |
| `i18n.locales.<locale>`                                               | [Языки и резервные значения](/ru/blog/config-languages/#registry)                        |
| `i18n.routing.defaultLocalePrefix`                                    | [Языки и резервные значения](/ru/blog/config-languages/#routing)                         |
| `i18n.locales.<locale>.meta`                                          | [Языки и резервные значения](/ru/blog/config-languages/#meta)                            |
| `i18n.locales.<locale>.meta.label`                                    | [Языки и резервные значения](/ru/blog/config-languages/#meta)                            |
| `i18n.locales.<locale>.meta.hreflang`                                 | [Языки и резервные значения](/ru/blog/config-languages/#meta)                            |
| `i18n.locales.<locale>.meta.ogLocale`                                 | [Языки и резервные значения](/ru/blog/config-languages/#meta)                            |
| `i18n.locales.<locale>.meta.enabled`                                  | [Языки и резервные значения](/ru/blog/config-languages/#meta)                            |
| `i18n.locales.<locale>.meta.fallback`                                 | [Языки и резервные значения](/ru/blog/config-languages/#fallback)                        |
| `i18n.locales.<locale>.site`                                          | [Языки и резервные значения](/ru/blog/config-languages/#overrides)                       |
| `i18n.locales.<locale>.messages`                                      | [Языки и резервные значения](/ru/blog/config-languages/#overrides)                       |
| `i18n.locales.<locale>.about`                                         | [Языки и резервные значения](/ru/blog/config-languages/#overrides)                       |
| `i18n.locales.<locale>.messages.langLabel`                            | [Языки и резервные значения](/ru/blog/config-languages/#common-messages)                 |
| `i18n.locales.<locale>.aiReadableContent`                             | [GA4 и дополнения для чтения ИИ](/ru/blog/config-analytics-ai/#locale-supplement)        |
| `i18n.locales.<locale>.aiReadableContent.notes`                       | [GA4 и дополнения для чтения ИИ](/ru/blog/config-analytics-ai/#locale-supplement)        |
| `i18n.locales.<locale>.aiReadableContent.links`                       | [GA4 и дополнения для чтения ИИ](/ru/blog/config-analytics-ai/#locale-supplement)        |
| `i18n.locales.<locale>.aiReadableContent.links[].label`               | [GA4 и дополнения для чтения ИИ](/ru/blog/config-analytics-ai/#locale-supplement)        |
| `i18n.locales.<locale>.aiReadableContent.links[].href`                | [GA4 и дополнения для чтения ИИ](/ru/blog/config-analytics-ai/#locale-supplement)        |
| `i18n.locales.<locale>.messages.search.label`                         | [Тексты поиска](/ru/blog/config-search/#messages)                                        |
| `i18n.locales.<locale>.messages.search.close`                         | [Тексты поиска](/ru/blog/config-search/#messages)                                        |
| `i18n.locales.<locale>.messages.search.placeholder`                   | [Тексты поиска](/ru/blog/config-search/#messages)                                        |
| `i18n.locales.<locale>.messages.search.hint`                          | [Тексты поиска](/ru/blog/config-search/#messages)                                        |
| `i18n.locales.<locale>.messages.search.loading`                       | [Тексты поиска](/ru/blog/config-search/#messages)                                        |
| `i18n.locales.<locale>.messages.search.empty`                         | [Тексты поиска](/ru/blog/config-search/#messages)                                        |
| `i18n.locales.<locale>.messages.search.error`                         | [Тексты поиска](/ru/blog/config-search/#messages)                                        |
| `i18n.locales.<locale>.messages.search.retry`                         | [Тексты поиска](/ru/blog/config-search/#messages)                                        |
| `i18n.locales.<locale>.messages.search.more`                          | [Тексты поиска](/ru/blog/config-search/#messages)                                        |
| `i18n.locales.<locale>.messages.search.results`                       | [Тексты поиска](/ru/blog/config-search/#messages)                                        |
| `i18n.locales.<locale>.messages.search.dev`                           | [Тексты поиска](/ru/blog/config-search/#messages)                                        |
| `analytics`                                                           | [GA4 и дополнения для чтения ИИ](/ru/blog/config-analytics-ai/#analytics)                |
| `analytics.googleAnalyticsId`                                         | [GA4 и дополнения для чтения ИИ](/ru/blog/config-analytics-ai/#analytics)                |
| `aiReadableContent`                                                   | [GA4 и дополнения для чтения ИИ](/ru/blog/config-analytics-ai/#supplement)               |
| `aiReadableContent.notes`                                             | [GA4 и дополнения для чтения ИИ](/ru/blog/config-analytics-ai/#supplement)               |
| `aiReadableContent.links`                                             | [GA4 и дополнения для чтения ИИ](/ru/blog/config-analytics-ai/#supplement)               |
| `aiReadableContent.links[].label`                                     | [GA4 и дополнения для чтения ИИ](/ru/blog/config-analytics-ai/#supplement)               |
| `aiReadableContent.links[].href`                                      | [GA4 и дополнения для чтения ИИ](/ru/blog/config-analytics-ai/#supplement)               |
| `site.title`                                                          | [Сайт и общие элементы интерфейса](/ru/blog/config-site-chrome/#identity)                |
| `site.description`                                                    | [Сайт и общие элементы интерфейса](/ru/blog/config-site-chrome/#identity)                |
| `site.url`                                                            | [Сайт и общие элементы интерфейса](/ru/blog/config-site-chrome/#identity)                |
| `site.tagline`                                                        | [Сайт и общие элементы интерфейса](/ru/blog/config-site-chrome/#identity)                |
| `social.links`                                                        | [Сайт и общие элементы интерфейса](/ru/blog/config-site-chrome/#social)                  |
| `social.links[].href`                                                 | [Сайт и общие элементы интерфейса](/ru/blog/config-site-chrome/#social-fields)           |
| `social.links[].label`                                                | [Сайт и общие элементы интерфейса](/ru/blog/config-site-chrome/#social-fields)           |
| `social.links[].rel`                                                  | [Сайт и общие элементы интерфейса](/ru/blog/config-site-chrome/#social-fields)           |
| `social.links[].icon`                                                 | [Сайт и общие элементы интерфейса](/ru/blog/config-site-chrome/#social-fields)           |
| `social.links[].iconSrc`                                              | [Сайт и общие элементы интерфейса](/ru/blog/config-site-chrome/#social-fields)           |
| `theme.footer.links`                                                  | [Сайт и общие элементы интерфейса](/ru/blog/config-site-chrome/#footer)                  |
| `theme.footer.links[].label`                                          | [Сайт и общие элементы интерфейса](/ru/blog/config-site-chrome/#footer)                  |
| `theme.footer.links[].href`                                           | [Сайт и общие элементы интерфейса](/ru/blog/config-site-chrome/#footer)                  |
| `i18n.locales.<locale>.messages.nav.home`                             | [Сайт и общие элементы интерфейса](/ru/blog/config-site-chrome/#chrome-messages)         |
| `i18n.locales.<locale>.messages.nav.blog`                             | [Сайт и общие элементы интерфейса](/ru/blog/config-site-chrome/#chrome-messages)         |
| `i18n.locales.<locale>.messages.nav.status`                           | [Сайт и общие элементы интерфейса](/ru/blog/config-site-chrome/#chrome-messages)         |
| `i18n.locales.<locale>.messages.nav.statusAria`                       | [Сайт и общие элементы интерфейса](/ru/blog/config-site-chrome/#chrome-messages)         |
| `i18n.locales.<locale>.messages.footer.theme`                         | [Сайт и общие элементы интерфейса](/ru/blog/config-site-chrome/#chrome-messages)         |
| `i18n.locales.<locale>.messages.footer.builtWith`                     | [Сайт и общие элементы интерфейса](/ru/blog/config-site-chrome/#chrome-messages)         |
| `i18n.locales.<locale>.messages.terminal.commandInput`                | [Тексты терминала](/ru/blog/config-terminal/#messages)                                   |
| `i18n.locales.<locale>.messages.terminal.hint`                        | [Тексты терминала](/ru/blog/config-terminal/#messages)                                   |
| `i18n.locales.<locale>.messages.terminal.help`                        | [Тексты терминала](/ru/blog/config-terminal/#messages)                                   |
| `i18n.locales.<locale>.messages.terminal.syntax`                      | [Тексты терминала](/ru/blog/config-terminal/#messages)                                   |
| `i18n.locales.<locale>.messages.terminal.usage`                       | [Тексты терминала](/ru/blog/config-terminal/#messages)                                   |
| `i18n.locales.<locale>.messages.terminal.unknown`                     | [Тексты терминала](/ru/blog/config-terminal/#messages)                                   |
| `i18n.locales.<locale>.messages.terminal.notFound`                    | [Тексты терминала](/ru/blog/config-terminal/#messages)                                   |
| `i18n.locales.<locale>.messages.terminal.notDirectory`                | [Тексты терминала](/ru/blog/config-terminal/#messages)                                   |
| `i18n.locales.<locale>.messages.terminal.isDirectory`                 | [Тексты терминала](/ru/blog/config-terminal/#messages)                                   |
| `i18n.locales.<locale>.messages.terminal.failed`                      | [Тексты терминала](/ru/blog/config-terminal/#messages)                                   |
| `i18n.locales.<locale>.messages.terminal.tooLarge`                    | [Тексты терминала](/ru/blog/config-terminal/#messages)                                   |
| `i18n.locales.<locale>.messages.terminal.empty`                       | [Тексты терминала](/ru/blog/config-terminal/#messages)                                   |
| `i18n.locales.<locale>.messages.terminal.loading`                     | [Тексты терминала](/ru/blog/config-terminal/#messages)                                   |
| `i18n.locales.<locale>.messages.terminal.readerTitle`                 | [Тексты терминала, сейчас не используются](/ru/blog/config-terminal/#messages)           |
| `i18n.locales.<locale>.messages.terminal.readerHint`                  | [Тексты терминала](/ru/blog/config-terminal/#messages)                                   |
| `i18n.locales.<locale>.messages.terminal.readerCommand`               | [Тексты терминала](/ru/blog/config-terminal/#messages)                                   |

## Поля статей отдельно от настроек сайта

Frontmatter статьи не входит в таблицу site.config выше: [контент, даты и изображения](/ru/blog/config-article/#frontmatter), [статистика и состояние OUTPUT](/ru/blog/config-article/#output-fields), [совместимость и неиспользуемые поля](/ru/blog/config-article/#legacy-frontmatter).

Три поля frontmatter Fragments описаны в [полях контента](/ru/blog/config-fragments/#content-fields). Не смешивайте их с полями статей.

Включение отдельной статьи в поиск объясняется в [поле search](/ru/blog/config-search/#article-search). Это не поле site.config и не переключатель приватности.

## Как читать описания полей

Каждый раздел указывает полный путь, тип, стандарт темы, реальное действие, ограничения, условия и пример. Если тип принимает поле, но код его не использует, нельзя представлять его как работающую функцию.

| Состояние                   | Значение                                                                                                         |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Действует                   | Текущая реализация имеет соответствующее действие                                                                |
| Действует при условиях      | Требуется включить функцию, выполнить условия страницы или не перекрывать значение более приоритетной настройкой |
| Сейчас не используется      | Тип принимает поле, но соответствующего действия сейчас нет; не заполняйте его ради изменения страницы           |
| Сохранено для совместимости | Есть явное назначение совместимости; описание уточняет, что сохраняется и отображается ли сейчас                 |

Стандарты темы берутся из настроек пакета или встроенных текстов. Starter может их переопределять, а demo имеет личные настройки. Автор, название и список музыки demo не являются стандартами всех новых блогов.

Языковые значения зависят от языка и цепочки резервных значений. Справочник отмечает «не задано», «встроенный текст текущего языка» или конкретное значение. Если приведены только упрощённый китайский и английский, область явно указана; эти примеры не выдаются за фиксированные значения всех языков.

## Где писать и как объединять настройки?

Добавляйте фрагменты в существующий `defineThemeConfig({...})` файла `src/site.config.ts`. Сохраняйте import, export и личные настройки; не создавайте theme или i18n повторно в одном объекте.

Объекты объединяются рекурсивно, пропущенные поля сохраняют стандартную настройку. Массивы заменяются целиком, undefined не переопределяет значение. Смысл пустых строк, пустых массивов и false зависит от поля; это не универсальный сброс. Например, пустой hero явно очищает описание главной, а пустой homeTitle продолжает поиск резервного значения.

После изменения проверьте нужную страницу в dev. Изменение переменных окружения требует перезапуска сервера разработки. Для рабочего сайта нужна новая сборка и публикация; сохранение локальной настройки не меняет страницу в интернете.

Frontmatter, настройки Astro и переменные окружения находятся в разных местах. Справочник объясняет их связи, не называя их полями site.config. Установка и обновление — в [первом руководстве](/ru/blog/starter-guide-1-configure-your-site/), локальная проверка и развёртывание — в [руководстве по публикации](/ru/blog/starter-guide-deployment/).
