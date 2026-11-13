---
tags: ['anglefeint', 'config']
title: 'Diccionario de configuración: ¿dónde cambio lo que necesito?'
subtitle: 'Entrada por página, función y ruta completa'
description: 'Índice de módulos de configuración, rutas completas, estados de los campos y reglas de combinación.'
pubDate: '2026-11-13'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/hacker-01.webp'
---

**Nota de versión:** El diccionario sigue el código actual. La respuesta al movimiento reducido, la validación estricta de `blogPageSize` y el aislamiento con Fragments desactivado requieren 0.36.1 o posterior; no están en 0.36.0. Instalación y CLI predeterminados no cambian.

Si sabes qué quieres conseguir, empieza por los tutoriales. Si buscas el significado, valor predeterminado o límites de un campo, consulta este diccionario. Ambos se basan en el código actual del tema y no requieren leer primero los documentos del repositorio.

Para empezar, sigue la [entrada a los ocho tutoriales](/es/blog/starter-guide-1-configure-your-site/#tutorial-order): instalar → escribir artículos → añadir imágenes → publicar Fragments → ajustar páginas y funciones → comentarios → idiomas → despliegue. No hace falta activar todas las funciones opcionales. El diccionario permite consultar campos cuando los necesites, sin leer toda la tabla de rutas de principio a fin.

Ya están disponibles [inicio](/es/blog/config-home/), [Blog List y etiquetas](/es/blog/config-blog-list/), [detalle del artículo](/es/blog/config-article/), [Fragments](/es/blog/config-fragments/), [About](/es/blog/config-about/), [Decoder](/es/blog/config-decoder/), [música](/es/blog/config-music/), [Giscus](/es/blog/config-comments/), [idiomas y respaldo](/es/blog/config-languages/), [búsqueda y descubrimiento](/es/blog/config-search/), [GA4 y complementos para IA](/es/blog/config-analytics-ai/), [sitio e interfaz compartida](/es/blog/config-site-chrome/) y [terminal](/es/blog/config-terminal/).

## Buscar por página o función

| Quiero cambiar                                                                     | Diccionario                                                 | Tutorial                                                                                                                                                            |
| ---------------------------------------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Título, presentación, artículos recientes, avisos, terminal y transición de inicio | [Inicio](/es/blog/config-home/)                             | [Páginas y funciones](/es/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                                                   |
| Nombre, dominio, navegación, redes y pie de página                                 | [Sitio e interfaz compartida](/es/blog/config-site-chrome/) | [Instalación e información del sitio](/es/blog/starter-guide-1-configure-your-site/), [personalización](/es/blog/starter-guide-3-comments-about-and-theme-toggles/) |
| Blog List, etiquetas y paginación                                                  | [Listas](/es/blog/config-blog-list/)                        | [Listas y paginación](/es/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                                                   |
| Detalle del artículo, índice, matemáticas y efectos de lectura                     | [Artículos](/es/blog/config-article/)                       | [Primer artículo](/es/blog/starter-guide-2-languages-and-routing/)                                                                                                  |
| Lista y vista previa de Fragments                                                  | [Fragments](/es/blog/config-fragments/)                     | [Publicar un Fragment](/es/blog/starter-guide-5-fragments/)                                                                                                         |
| Contenido, contacto, barra lateral y herramientas de About                         | [About](/es/blog/config-about/)                             | [Páginas y funciones](/es/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                                                   |
| Terminal de About, avisos de comandos y lector de solo lectura                     | [Terminal](/es/blog/config-terminal/)                       | [Páginas y funciones](/es/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                                                   |
| Página Decoder y tarjetas de lectura                                               | [Decoder](/es/blog/config-decoder/)                         | [Páginas y funciones](/es/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                                                   |
| Reproductor de música                                                              | [Música](/es/blog/config-music/)                            | [Configurar música](/es/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                                                     |
| Giscus y discusiones compartidas entre idiomas                                     | [Comentarios](/es/blog/config-comments/)                    | [Permitir comentarios](/es/blog/starter-guide-4-giscus-comments/)                                                                                                   |
| Activación de idiomas, direcciones, textos y respaldo                              | [Idiomas](/es/blog/config-languages/)                       | [Idiomas](/es/blog/starter-guide-languages/)                                                                                                                        |
| Búsqueda y descubrimiento de contenido                                             | [Búsqueda](/es/blog/config-search/)                         | [Escribir artículos](/es/blog/starter-guide-2-languages-and-routing/), [desplegar](/es/blog/starter-guide-deployment/)                                              |
| Estadísticas GA4 y complementos públicos para IA                                   | [GA4 y complementos IA](/es/blog/config-analytics-ai/)      | [Publicar en tu dominio](/es/blog/starter-guide-deployment/)                                                                                                        |

Cada campo tiene una explicación principal; los demás módulos enlazan a ella. Por ejemplo, inicio usa el interruptor de Fragments, pero este también afecta a la lista completa y no es exclusivo de inicio.

## Buscar por ruta completa

El índice sigue los tipos públicos actuales e incluye campos sin uso. Abre su explicación principal; las diferencias entre páginas se enlazan desde cada módulo. `<locale>` es un marcador para un código real como zh o en. El frontmatter de artículos se enumera aparte, sin mezclarlo con site.config.

| Ruta completa                                                         | Referencia                                                                                |
| --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `i18n.locales.<locale>.site.homeTitle`                                | [Título principal de inicio](/es/blog/config-home/#home-title)                            |
| `i18n.locales.<locale>.site.hero`                                     | [Presentación visible de inicio](/es/blog/config-home/#home-hero)                         |
| `i18n.locales.<locale>.messages.siteDescription`                      | [Metadescripción de inicio](/es/blog/config-home/#home-description)                       |
| `theme.homeLatestCount`                                               | [Cantidad de artículos recientes](/es/blog/config-home/#latest-count)                     |
| `theme.home.showInitialize`                                           | [Activar avisos de inicio](/es/blog/config-home/#startup-switches)                        |
| `theme.home.showFollow`                                               | [Activar avisos de inicio](/es/blog/config-home/#startup-switches)                        |
| `theme.home.showTrace`                                                | [Activar avisos de inicio](/es/blog/config-home/#startup-switches)                        |
| `theme.effects.enableHomePassage`                                     | [Transición al hacer clic](/es/blog/config-home/#home-passage)                            |
| `i18n.locales.<locale>.messages.home.latest`                          | [Textos de inicio](/es/blog/config-home/#home-messages)                                   |
| `i18n.locales.<locale>.messages.home.viewAll`                         | [Textos de inicio](/es/blog/config-home/#home-messages)                                   |
| `i18n.locales.<locale>.messages.home.noPosts`                         | [Textos de inicio](/es/blog/config-home/#home-messages)                                   |
| `i18n.locales.<locale>.messages.home.openDoor`                        | [Textos de inicio](/es/blog/config-home/#home-messages)                                   |
| `i18n.locales.<locale>.messages.home.transmission`                    | [Texto del terminal en pantalla ancha](/es/blog/config-home/#home-transmission)           |
| `i18n.locales.<locale>.messages.home.hero`                            | [Texto alternativo de presentación](/es/blog/config-home/#message-hero)                   |
| `theme.fragments.enabled`                                             | [Activar Fragments](/es/blog/config-fragments/#enabled)                                   |
| `i18n.locales.<locale>.messages.blog.allPosts`                        | [Entrada compartida de artículos y etiquetas](/es/blog/config-blog-list/#tag-messages)    |
| `i18n.locales.<locale>.messages.fragments.title`                      | [Textos de Fragments](/es/blog/config-fragments/#fragment-messages)                       |
| `i18n.locales.<locale>.messages.fragments.close`                      | [Textos de Fragments](/es/blog/config-fragments/#fragment-messages)                       |
| `i18n.locales.<locale>.messages.siteTitle`                            | [Campo de título sin uso actual](/es/blog/config-site-chrome/#legacy-site-title)          |
| `theme.blogPageSize`                                                  | [Artículos por página](/es/blog/config-blog-list/#page-size)                              |
| `theme.tags.enabled`                                                  | [Activar etiquetas](/es/blog/config-blog-list/#tags-enabled)                              |
| `theme.pagination.windowSize`                                         | [Ventana de páginas](/es/blog/config-blog-list/#pagination-window)                        |
| `theme.pagination.showJumpThreshold`                                  | [Umbral del salto de página](/es/blog/config-blog-list/#jump-threshold)                   |
| `theme.pagination.jump.enabled`                                       | [Activar salto de página](/es/blog/config-blog-list/#jump-enabled)                        |
| `theme.pagination.jump.enterToGo`                                     | [Saltar con Intro](/es/blog/config-blog-list/#jump-enter)                                 |
| `theme.pagination.style.enabled`                                      | [Activar estilos de paginación](/es/blog/config-blog-list/#style-enabled)                 |
| `theme.pagination.style.mode`                                         | [Estrategia de variantes](/es/blog/config-blog-list/#style-mode)                          |
| `theme.pagination.style.variants`                                     | [Cantidad de variantes](/es/blog/config-blog-list/#style-variants)                        |
| `theme.pagination.style.fixedVariant`                                 | [Variante fija](/es/blog/config-blog-list/#style-fixed)                                   |
| `i18n.locales.<locale>.messages.blog.title`                           | [Título y descripción de listas](/es/blog/config-blog-list/#archive-messages)             |
| `i18n.locales.<locale>.messages.blog.pageTitle`                       | [Título y descripción de listas](/es/blog/config-blog-list/#archive-messages)             |
| `i18n.locales.<locale>.messages.blog.archiveDescription`              | [Título y descripción de listas](/es/blog/config-blog-list/#archive-messages)             |
| `i18n.locales.<locale>.messages.blog.pageDescription`                 | [Título y descripción de listas](/es/blog/config-blog-list/#archive-messages)             |
| `i18n.locales.<locale>.messages.blog.previous`                        | [Textos de paginación](/es/blog/config-blog-list/#pagination-messages)                    |
| `i18n.locales.<locale>.messages.blog.next`                            | [Textos de paginación](/es/blog/config-blog-list/#pagination-messages)                    |
| `i18n.locales.<locale>.messages.blog.paginationAria`                  | [Textos de paginación](/es/blog/config-blog-list/#pagination-messages)                    |
| `i18n.locales.<locale>.messages.blog.jumpTo`                          | [Textos de paginación](/es/blog/config-blog-list/#pagination-messages)                    |
| `i18n.locales.<locale>.messages.blog.jumpInputLabel`                  | [Textos de paginación](/es/blog/config-blog-list/#pagination-messages)                    |
| `i18n.locales.<locale>.messages.blog.jumpGo`                          | [Textos de paginación](/es/blog/config-blog-list/#pagination-messages)                    |
| `i18n.locales.<locale>.messages.blog.tags`                            | [Textos de etiquetas](/es/blog/config-blog-list/#tag-messages)                            |
| `i18n.locales.<locale>.messages.blog.noTags`                          | [Textos de etiquetas](/es/blog/config-blog-list/#tag-messages)                            |
| `i18n.locales.<locale>.messages.blog.taggedPosts`                     | [Textos de etiquetas](/es/blog/config-blog-list/#tag-messages)                            |
| `theme.toc.enabled`                                                   | [Funciones de artículos](/es/blog/config-article/#feature-switches)                       |
| `theme.math.enabled`                                                  | [Funciones de artículos](/es/blog/config-article/#feature-switches)                       |
| `theme.effects.enableRedQueen`                                        | [Funciones de artículos](/es/blog/config-article/#feature-switches)                       |
| `theme.search.enabled`                                                | [Activar búsqueda interna](/es/blog/config-search/#enabled)                               |
| `theme.socialImage.enabled`                                           | [Funciones de artículos](/es/blog/config-article/#feature-switches)                       |
| `site.author`                                                         | [Sitio e interfaz compartida](/es/blog/config-site-chrome/#identity)                      |
| `site.ogImage`                                                        | [Sitio e interfaz compartida](/es/blog/config-site-chrome/#identity)                      |
| `theme.enableAboutPage`                                               | [Activar About](/es/blog/config-about/#page-enabled)                                      |
| `theme.footer.showCredits`                                            | [Sitio e interfaz compartida](/es/blog/config-site-chrome/#footer)                        |
| `theme.comments.enabled`                                              | [Comentarios Giscus](/es/blog/config-comments/#controls)                                  |
| `i18n.locales.<locale>.messages.blog.rqBadge`                         | [Textos del artículo](/es/blog/config-article/#article-messages)                          |
| `i18n.locales.<locale>.messages.blog.rqReplayAria`                    | [Textos del artículo](/es/blog/config-article/#article-messages)                          |
| `i18n.locales.<locale>.messages.blog.backToTop`                       | [Textos del artículo](/es/blog/config-article/#article-messages)                          |
| `i18n.locales.<locale>.messages.blog.toastP10`                        | [Textos del artículo](/es/blog/config-article/#article-messages)                          |
| `i18n.locales.<locale>.messages.blog.toastP30`                        | [Textos del artículo](/es/blog/config-article/#article-messages)                          |
| `i18n.locales.<locale>.messages.blog.toastP60`                        | [Textos del artículo](/es/blog/config-article/#article-messages)                          |
| `i18n.locales.<locale>.messages.blog.toastDone`                       | [Textos del artículo](/es/blog/config-article/#article-messages)                          |
| `i18n.locales.<locale>.messages.blog.metaPublished`                   | [Textos del artículo](/es/blog/config-article/#article-messages)                          |
| `i18n.locales.<locale>.messages.blog.metaAuthor`                      | [Textos del artículo](/es/blog/config-article/#article-messages)                          |
| `i18n.locales.<locale>.messages.blog.metaUpdated`                     | [Textos del artículo](/es/blog/config-article/#article-messages)                          |
| `i18n.locales.<locale>.messages.blog.systemStatusAria`                | [Textos del artículo](/es/blog/config-article/#article-messages)                          |
| `i18n.locales.<locale>.messages.blog.systemModelLabel`                | [Textos del artículo](/es/blog/config-article/#article-messages)                          |
| `i18n.locales.<locale>.messages.blog.systemModeLabel`                 | [Textos del artículo](/es/blog/config-article/#article-messages)                          |
| `i18n.locales.<locale>.messages.blog.systemStateLabel`                | [Textos del artículo](/es/blog/config-article/#article-messages)                          |
| `i18n.locales.<locale>.messages.blog.promptContextLabel`              | [Textos del artículo](/es/blog/config-article/#article-messages)                          |
| `i18n.locales.<locale>.messages.blog.heroMonitor`                     | [Textos del artículo](/es/blog/config-article/#article-messages)                          |
| `i18n.locales.<locale>.messages.blog.heroSignalSync`                  | [Textos del artículo](/es/blog/config-article/#article-messages)                          |
| `i18n.locales.<locale>.messages.blog.heroModelOnline`                 | [Textos del artículo](/es/blog/config-article/#article-messages)                          |
| `i18n.locales.<locale>.messages.blog.toc`                             | [Textos del artículo](/es/blog/config-article/#article-messages)                          |
| `i18n.locales.<locale>.messages.blog.responseOutput`                  | [Textos del artículo](/es/blog/config-article/#article-messages)                          |
| `i18n.locales.<locale>.messages.blog.statsWords`                      | [Textos del artículo](/es/blog/config-article/#article-messages)                          |
| `i18n.locales.<locale>.messages.blog.statsTokens`                     | [Textos del artículo](/es/blog/config-article/#article-messages)                          |
| `i18n.locales.<locale>.messages.blog.copySectionLink`                 | [Textos del artículo](/es/blog/config-article/#article-messages)                          |
| `i18n.locales.<locale>.messages.blog.regenerate`                      | [Textos del artículo](/es/blog/config-article/#article-messages)                          |
| `i18n.locales.<locale>.messages.blog.relatedAria`                     | [Textos del artículo](/es/blog/config-article/#article-messages)                          |
| `i18n.locales.<locale>.messages.blog.related`                         | [Textos del artículo](/es/blog/config-article/#article-messages)                          |
| `i18n.locales.<locale>.messages.blog.backToBlogAria`                  | [Textos del artículo](/es/blog/config-article/#article-messages)                          |
| `i18n.locales.<locale>.messages.blog.backToBlog`                      | [Textos del artículo](/es/blog/config-article/#article-messages)                          |
| `i18n.locales.<locale>.messages.blog.comments`                        | [Textos del artículo](/es/blog/config-article/#article-messages)                          |
| `i18n.locales.<locale>.messages.blog.metaReadMinutes`                 | [Textos del artículo sin uso actual](/es/blog/config-article/#article-messages)           |
| `i18n.locales.<locale>.messages.blog.latencyLabel`                    | [Textos del artículo sin uso actual](/es/blog/config-article/#article-messages)           |
| `i18n.locales.<locale>.messages.blog.confidenceLabel`                 | [Textos del artículo sin uso actual](/es/blog/config-article/#article-messages)           |
| `i18n.locales.<locale>.messages.codeCopy.copy`                        | [Textos de interacción de lectura](/es/blog/config-article/#interaction-messages)         |
| `i18n.locales.<locale>.messages.codeCopy.copied`                      | [Textos de interacción de lectura](/es/blog/config-article/#interaction-messages)         |
| `i18n.locales.<locale>.messages.codeCopy.failed`                      | [Textos de interacción de lectura](/es/blog/config-article/#interaction-messages)         |
| `i18n.locales.<locale>.messages.imagePreview.open`                    | [Textos de interacción de lectura](/es/blog/config-article/#interaction-messages)         |
| `i18n.locales.<locale>.messages.imagePreview.close`                   | [Textos de interacción de lectura](/es/blog/config-article/#interaction-messages)         |
| `theme.fragments.pageSize`                                            | [Fragments por página](/es/blog/config-fragments/#page-size)                              |
| `theme.fragments.comments.enabled`                                    | [Comentarios de Fragments](/es/blog/config-fragments/#comments-enabled)                   |
| `i18n.locales.<locale>.messages.fragments.description`                | [Textos de Fragments](/es/blog/config-fragments/#fragment-messages)                       |
| `i18n.locales.<locale>.messages.fragments.empty`                      | [Textos de Fragments](/es/blog/config-fragments/#fragment-messages)                       |
| `i18n.locales.<locale>.messages.fragments.comments`                   | [Textos de Fragments](/es/blog/config-fragments/#fragment-messages)                       |
| `i18n.locales.<locale>.messages.fragments.previous`                   | [Textos de Fragments sin uso actual](/es/blog/config-fragments/#fragment-messages)        |
| `i18n.locales.<locale>.messages.fragments.next`                       | [Textos de Fragments sin uso actual](/es/blog/config-fragments/#fragment-messages)        |
| `i18n.locales.<locale>.messages.fragments.loading`                    | [Textos de Fragments](/es/blog/config-fragments/#fragment-messages)                       |
| `i18n.locales.<locale>.messages.fragments.error`                      | [Textos de Fragments](/es/blog/config-fragments/#fragment-messages)                       |
| `i18n.locales.<locale>.messages.fragments.retry`                      | [Textos de Fragments](/es/blog/config-fragments/#fragment-messages)                       |
| `i18n.locales.<locale>.messages.fragments.copyLink`                   | [Textos de Fragments](/es/blog/config-fragments/#fragment-messages)                       |
| `i18n.locales.<locale>.messages.fragments.linkCopied`                 | [Textos de Fragments](/es/blog/config-fragments/#fragment-messages)                       |
| `i18n.locales.<locale>.messages.fragments.copyLinkFailed`             | [Textos de Fragments](/es/blog/config-fragments/#fragment-messages)                       |
| `i18n.locales.<locale>.messages.fragments.notFound`                   | [Textos de Fragments](/es/blog/config-fragments/#fragment-messages)                       |
| `i18n.locales.<locale>.messages.fragments.indexError`                 | [Textos de Fragments](/es/blog/config-fragments/#fragment-messages)                       |
| `theme.comments.repo`                                                 | [Comentarios Giscus](/es/blog/config-comments/#connection)                                |
| `theme.comments.repoId`                                               | [Comentarios Giscus](/es/blog/config-comments/#connection)                                |
| `theme.comments.category`                                             | [Comentarios Giscus](/es/blog/config-comments/#connection)                                |
| `theme.comments.categoryId`                                           | [Comentarios Giscus](/es/blog/config-comments/#connection)                                |
| `i18n.locales.<locale>.about.metaLine`                                | [Contenido de About](/es/blog/config-about/#body-fields)                                  |
| `i18n.locales.<locale>.about.sections.who`                            | [Contenido de About](/es/blog/config-about/#body-fields)                                  |
| `i18n.locales.<locale>.about.sections.what`                           | [Contenido de About](/es/blog/config-about/#body-fields)                                  |
| `i18n.locales.<locale>.about.sections.ethos`                          | [Contenido de About](/es/blog/config-about/#body-fields)                                  |
| `i18n.locales.<locale>.about.sections.now`                            | [Contenido de About](/es/blog/config-about/#body-fields)                                  |
| `i18n.locales.<locale>.about.sections.contactLead`                    | [Contenido de About](/es/blog/config-about/#body-fields)                                  |
| `i18n.locales.<locale>.about.sections.signature`                      | [Contenido de About](/es/blog/config-about/#body-fields)                                  |
| `i18n.locales.<locale>.about.contact.email`                           | [Contacto de About](/es/blog/config-about/#contact-fields)                                |
| `i18n.locales.<locale>.about.contact.githubUrl`                       | [Contacto de About](/es/blog/config-about/#contact-fields)                                |
| `i18n.locales.<locale>.about.contact.githubLabel`                     | [Contacto de About](/es/blog/config-about/#contact-fields)                                |
| `i18n.locales.<locale>.about.sidebar.dlData`                          | [Accesos a herramientas de About](/es/blog/config-about/#tool-fields)                     |
| `i18n.locales.<locale>.about.sidebar.ai`                              | [Accesos a herramientas de About](/es/blog/config-about/#tool-fields)                     |
| `i18n.locales.<locale>.about.sidebar.decryptor`                       | [Accesos a herramientas de About](/es/blog/config-about/#tool-fields)                     |
| `i18n.locales.<locale>.about.sidebar.help`                            | [Accesos a herramientas de About](/es/blog/config-about/#tool-fields)                     |
| `i18n.locales.<locale>.about.sidebar.allScripts`                      | [Accesos a herramientas de About](/es/blog/config-about/#tool-fields)                     |
| `i18n.locales.<locale>.about.scriptsPath`                             | [Accesos a herramientas de About](/es/blog/config-about/#tool-fields)                     |
| `i18n.locales.<locale>.about.labels.modalOutput`                      | [Textos generales de About: revisar estado](/es/blog/config-about/#label-fields)          |
| `i18n.locales.<locale>.about.labels.modalClose`                       | [Textos generales de About](/es/blog/config-about/#label-fields)                          |
| `i18n.locales.<locale>.about.labels.responseOutput`                   | [Textos generales de About](/es/blog/config-about/#label-fields)                          |
| `i18n.locales.<locale>.about.labels.contactEmailLead`                 | [Textos generales de About](/es/blog/config-about/#label-fields)                          |
| `i18n.locales.<locale>.about.labels.contactConnectLead`               | [Textos generales de About](/es/blog/config-about/#label-fields)                          |
| `i18n.locales.<locale>.about.labels.backToTop`                        | [Textos generales de About](/es/blog/config-about/#label-fields)                          |
| `i18n.locales.<locale>.about.labels.quickAccess`                      | [Textos generales de About](/es/blog/config-about/#label-fields)                          |
| `i18n.locales.<locale>.about.labels.contactEmailLabel`                | [Textos generales de About](/es/blog/config-about/#label-fields)                          |
| `i18n.locales.<locale>.about.modals.dlData.title`                     | [Ventanas de herramientas de About](/es/blog/config-about/#modal-fields)                  |
| `i18n.locales.<locale>.about.modals.dlData.subtitle`                  | [Ventanas de herramientas de About](/es/blog/config-about/#modal-fields)                  |
| `i18n.locales.<locale>.about.modals.ai.title`                         | [Ventanas de herramientas de About](/es/blog/config-about/#modal-fields)                  |
| `i18n.locales.<locale>.about.modals.ai.lines`                         | [Ventanas de herramientas de About](/es/blog/config-about/#modal-fields)                  |
| `i18n.locales.<locale>.about.modals.decryptor.title`                  | [Ventanas de herramientas de About](/es/blog/config-about/#modal-fields)                  |
| `i18n.locales.<locale>.about.modals.decryptor.header`                 | [Ventanas de About: revisar estado](/es/blog/config-about/#modal-fields)                  |
| `i18n.locales.<locale>.about.modals.decryptor.keysLabel`              | [Ventanas de About: revisar estado](/es/blog/config-about/#modal-fields)                  |
| `i18n.locales.<locale>.about.modals.decryptor.currentPassphraseLabel` | [Ventanas de About: revisar estado](/es/blog/config-about/#modal-fields)                  |
| `i18n.locales.<locale>.about.modals.decryptor.masterKeyLabel`         | [Ventanas de About: revisar estado](/es/blog/config-about/#modal-fields)                  |
| `i18n.locales.<locale>.about.modals.decryptor.transientKeyLabel`      | [Ventanas de About: revisar estado](/es/blog/config-about/#modal-fields)                  |
| `i18n.locales.<locale>.about.modals.help.title`                       | [Ventanas de herramientas de About](/es/blog/config-about/#modal-fields)                  |
| `i18n.locales.<locale>.about.modals.help.statsLabel`                  | [Ventanas de herramientas de About](/es/blog/config-about/#modal-fields)                  |
| `i18n.locales.<locale>.about.modals.help.typedPrefix`                 | [Ventanas de herramientas de About](/es/blog/config-about/#modal-fields)                  |
| `i18n.locales.<locale>.about.modals.help.typedSuffix`                 | [Ventanas de herramientas de About](/es/blog/config-about/#modal-fields)                  |
| `i18n.locales.<locale>.about.modals.allScripts.title`                 | [Ventanas de herramientas de About](/es/blog/config-about/#modal-fields)                  |
| `i18n.locales.<locale>.about.effects.backgroundLines`                 | [Efectos de About: revisar estado](/es/blog/config-about/#effect-fields)                  |
| `i18n.locales.<locale>.about.effects.scrollToasts.p30`                | [Efectos de About](/es/blog/config-about/#effect-fields)                                  |
| `i18n.locales.<locale>.about.effects.scrollToasts.p60`                | [Efectos de About](/es/blog/config-about/#effect-fields)                                  |
| `i18n.locales.<locale>.about.effects.scrollToasts.p90`                | [Efectos de About](/es/blog/config-about/#effect-fields)                                  |
| `i18n.locales.<locale>.messages.about.title`                          | [About y controles compartidos](/es/blog/config-about/#about-messages)                    |
| `i18n.locales.<locale>.messages.about.description`                    | [About y controles compartidos](/es/blog/config-about/#about-messages)                    |
| `i18n.locales.<locale>.messages.about.who`                            | [About y controles compartidos](/es/blog/config-about/#about-messages)                    |
| `i18n.locales.<locale>.messages.about.what`                           | [About y controles compartidos](/es/blog/config-about/#about-messages)                    |
| `i18n.locales.<locale>.messages.about.ethos`                          | [About y controles compartidos](/es/blog/config-about/#about-messages)                    |
| `i18n.locales.<locale>.messages.about.now`                            | [About y controles compartidos](/es/blog/config-about/#about-messages)                    |
| `i18n.locales.<locale>.messages.about.contact`                        | [About y controles compartidos](/es/blog/config-about/#about-messages)                    |
| `i18n.locales.<locale>.messages.about.regenerate`                     | [About y controles compartidos](/es/blog/config-about/#about-messages)                    |
| `i18n.locales.<locale>.messages.windowControls.collapse`              | [About y controles compartidos](/es/blog/config-about/#about-messages)                    |
| `i18n.locales.<locale>.messages.windowControls.expand`                | [About y controles compartidos](/es/blog/config-about/#about-messages)                    |
| `i18n.locales.<locale>.messages.windowControls.restore`               | [About y controles compartidos](/es/blog/config-about/#about-messages)                    |
| `i18n.locales.<locale>.messages.windowControls.fullscreen`            | [About y controles compartidos](/es/blog/config-about/#about-messages)                    |
| `i18n.locales.<locale>.messages.scriptFolders.copyTitle`              | [About y controles compartidos](/es/blog/config-about/#about-messages)                    |
| `i18n.locales.<locale>.messages.scriptFolders.copied`                 | [About y controles compartidos](/es/blog/config-about/#about-messages)                    |
| `i18n.locales.<locale>.messages.scriptFolders.failed`                 | [About y controles compartidos](/es/blog/config-about/#about-messages)                    |
| `theme.enableDecoderPage`                                             | [Activar Decoder](/es/blog/config-decoder/#page-enabled)                                  |
| `i18n.locales.<locale>.messages.nav.about`                            | [Sitio e interfaz compartida](/es/blog/config-site-chrome/#chrome-messages)               |
| `i18n.locales.<locale>.messages.decoder.input`                        | [Textos de Decoder](/es/blog/config-decoder/#text-messages)                               |
| `i18n.locales.<locale>.messages.decoder.placeholder`                  | [Textos de Decoder](/es/blog/config-decoder/#text-messages)                               |
| `i18n.locales.<locale>.messages.decoder.format`                       | [Textos de Decoder](/es/blog/config-decoder/#text-messages)                               |
| `i18n.locales.<locale>.messages.decoder.auto`                         | [Textos de Decoder](/es/blog/config-decoder/#text-messages)                               |
| `i18n.locales.<locale>.messages.decoder.decode`                       | [Textos de Decoder](/es/blog/config-decoder/#text-messages)                               |
| `i18n.locales.<locale>.messages.decoder.clear`                        | [Textos de Decoder](/es/blog/config-decoder/#text-messages)                               |
| `i18n.locales.<locale>.messages.decoder.copy`                         | [Textos de Decoder](/es/blog/config-decoder/#text-messages)                               |
| `i18n.locales.<locale>.messages.decoder.reuse`                        | [Textos de Decoder](/es/blog/config-decoder/#text-messages)                               |
| `i18n.locales.<locale>.messages.decoder.supported`                    | [Textos de Decoder](/es/blog/config-decoder/#text-messages)                               |
| `i18n.locales.<locale>.messages.decoder.html`                         | [Textos de Decoder](/es/blog/config-decoder/#text-messages)                               |
| `i18n.locales.<locale>.messages.decoder.unicode`                      | [Textos de Decoder](/es/blog/config-decoder/#text-messages)                               |
| `i18n.locales.<locale>.messages.decoder.jwtWarning`                   | [Textos de Decoder](/es/blog/config-decoder/#text-messages)                               |
| `i18n.locales.<locale>.messages.decoder.copied`                       | [Textos de Decoder](/es/blog/config-decoder/#text-messages)                               |
| `i18n.locales.<locale>.messages.decoder.copyFailed`                   | [Textos de Decoder](/es/blog/config-decoder/#text-messages)                               |
| `i18n.locales.<locale>.messages.decoder.output`                       | [Textos de Decoder](/es/blog/config-decoder/#text-messages)                               |
| `i18n.locales.<locale>.messages.decoder.local`                        | [Textos de Decoder](/es/blog/config-decoder/#text-messages)                               |
| `i18n.locales.<locale>.messages.decoder.ready`                        | [Textos de Decoder](/es/blog/config-decoder/#text-messages)                               |
| `i18n.locales.<locale>.messages.decoder.running`                      | [Textos de Decoder](/es/blog/config-decoder/#text-messages)                               |
| `i18n.locales.<locale>.messages.decoder.done`                         | [Textos de Decoder](/es/blog/config-decoder/#text-messages)                               |
| `i18n.locales.<locale>.messages.decoder.empty`                        | [Textos de Decoder](/es/blog/config-decoder/#text-messages)                               |
| `i18n.locales.<locale>.messages.decoder.tooLong`                      | [Textos de Decoder](/es/blog/config-decoder/#text-messages)                               |
| `i18n.locales.<locale>.messages.decoder.invalid`                      | [Textos de Decoder](/es/blog/config-decoder/#text-messages)                               |
| `i18n.locales.<locale>.messages.decoder.binary`                       | [Textos de Decoder](/es/blog/config-decoder/#text-messages)                               |
| `i18n.locales.<locale>.messages.decoder.unknown`                      | [Textos de Decoder](/es/blog/config-decoder/#text-messages)                               |
| `i18n.locales.<locale>.messages.decoder.ambiguous`                    | [Textos de Decoder](/es/blog/config-decoder/#text-messages)                               |
| `i18n.locales.<locale>.messages.decoder.example`                      | [Textos de Decoder](/es/blog/config-decoder/#text-messages)                               |
| `i18n.locales.<locale>.messages.decoderPage.description`              | [Textos de Decoder](/es/blog/config-decoder/#page-messages)                               |
| `i18n.locales.<locale>.messages.decoderPage.fullTool`                 | [Textos de Decoder](/es/blog/config-decoder/#page-messages)                               |
| `i18n.locales.<locale>.messages.decoderPage.task`                     | [Textos de Decoder](/es/blog/config-decoder/#page-messages)                               |
| `i18n.locales.<locale>.messages.decoderPage.textTask`                 | [Textos de Decoder](/es/blog/config-decoder/#page-messages)                               |
| `i18n.locales.<locale>.messages.decoderPage.callTask`                 | [Textos de Decoder](/es/blog/config-decoder/#page-messages)                               |
| `i18n.locales.<locale>.messages.decoderPage.addressTask`              | [Textos de Decoder](/es/blog/config-decoder/#page-messages)                               |
| `i18n.locales.<locale>.messages.decoderPage.addressHint`              | [Textos de Decoder](/es/blog/config-decoder/#page-messages)                               |
| `i18n.locales.<locale>.messages.decoderPage.chain`                    | [Textos de Decoder](/es/blog/config-decoder/#page-messages)                               |
| `i18n.locales.<locale>.messages.decoderPage.decimals`                 | [Textos de Decoder](/es/blog/config-decoder/#page-messages)                               |
| `i18n.locales.<locale>.messages.decoderPage.precisionHint`            | [Textos de Decoder](/es/blog/config-decoder/#page-messages)                               |
| `i18n.locales.<locale>.messages.decoderPage.network`                  | [Textos de Decoder](/es/blog/config-decoder/#page-messages)                               |
| `i18n.locales.<locale>.messages.decoderPage.history`                  | [Textos de Decoder](/es/blog/config-decoder/#page-messages)                               |
| `i18n.locales.<locale>.messages.decoderPage.back`                     | [Textos de Decoder](/es/blog/config-decoder/#page-messages)                               |
| `i18n.locales.<locale>.messages.decoderPage.export`                   | [Textos de Decoder](/es/blog/config-decoder/#page-messages)                               |
| `i18n.locales.<locale>.messages.decoderPage.limits`                   | [Textos de Decoder](/es/blog/config-decoder/#page-messages)                               |
| `i18n.locales.<locale>.messages.decoderPage.callNotice`               | [Textos de Decoder](/es/blog/config-decoder/#page-messages)                               |
| `i18n.locales.<locale>.messages.decoderPage.addressNotice`            | [Textos de Decoder](/es/blog/config-decoder/#page-messages)                               |
| `i18n.locales.<locale>.messages.decoderPage.unsupported`              | [Textos de Decoder](/es/blog/config-decoder/#page-messages)                               |
| `i18n.locales.<locale>.messages.decoderPage.checksum`                 | [Textos de Decoder](/es/blog/config-decoder/#page-messages)                               |
| `i18n.locales.<locale>.messages.decoderPage.length`                   | [Textos de Decoder](/es/blog/config-decoder/#page-messages)                               |
| `i18n.locales.<locale>.messages.decoderPage.wrongNetwork`             | [Textos de Decoder](/es/blog/config-decoder/#page-messages)                               |
| `i18n.locales.<locale>.messages.decoderPage.stepLimit`                | [Textos de Decoder](/es/blog/config-decoder/#page-messages)                               |
| `i18n.locales.<locale>.messages.decoderPage.budget`                   | [Textos de Decoder](/es/blog/config-decoder/#page-messages)                               |
| `i18n.locales.<locale>.messages.decoderPage.addressParse`             | [Textos de Decoder](/es/blog/config-decoder/#page-messages)                               |
| `i18n.locales.<locale>.messages.decoderPage.addressCheck`             | [Textos de Decoder](/es/blog/config-decoder/#page-messages)                               |
| `i18n.locales.<locale>.messages.decoderPage.addressResult`            | [Textos de Decoder](/es/blog/config-decoder/#page-messages)                               |
| `i18n.locales.<locale>.messages.decoderPage.callParse`                | [Textos de Decoder](/es/blog/config-decoder/#page-messages)                               |
| `i18n.locales.<locale>.messages.decoderPage.rawOnly`                  | [Textos de Decoder](/es/blog/config-decoder/#page-messages)                               |
| `i18n.locales.<locale>.messages.decoderPage.amountResult`             | [Textos de Decoder](/es/blog/config-decoder/#page-messages)                               |
| `i18n.locales.<locale>.messages.decoderPage.inputHint`                | [Textos de Decoder](/es/blog/config-decoder/#page-messages)                               |
| `i18n.locales.<locale>.messages.decoderPage.loadFailed`               | [Textos de Decoder](/es/blog/config-decoder/#page-messages)                               |
| `i18n.locales.<locale>.messages.decoderPage.readings.tribute`         | [Lecturas de Decoder](/es/blog/config-decoder/#readings)                                  |
| `i18n.locales.<locale>.messages.decoderPage.readings.links`           | [Lecturas de Decoder](/es/blog/config-decoder/#readings)                                  |
| `i18n.locales.<locale>.messages.decoderPage.readings.links[].title`   | [Lecturas de Decoder](/es/blog/config-decoder/#readings)                                  |
| `i18n.locales.<locale>.messages.decoderPage.readings.links[].href`    | [Lecturas de Decoder](/es/blog/config-decoder/#readings)                                  |
| `i18n.locales.<locale>.messages.decoderPage.readings.links[].author`  | [Lecturas de Decoder](/es/blog/config-decoder/#readings)                                  |
| `i18n.locales.<locale>.messages.decoderPage.readings.links[].year`    | [Lecturas de Decoder](/es/blog/config-decoder/#readings)                                  |
| `i18n.locales.<locale>.messages.decoderPage.readings.links[].cover`   | [Lecturas de Decoder](/es/blog/config-decoder/#readings)                                  |
| `theme.music.enabled`                                                 | [Reproductor de música](/es/blog/config-music/#enabled)                                   |
| `theme.music.tracks`                                                  | [Reproductor de música](/es/blog/config-music/#tracks)                                    |
| `theme.music.tracks[].title`                                          | [Reproductor de música](/es/blog/config-music/#track-fields)                              |
| `theme.music.tracks[].artist`                                         | [Reproductor de música](/es/blog/config-music/#track-fields)                              |
| `theme.music.tracks[].src`                                            | [Reproductor de música](/es/blog/config-music/#track-fields)                              |
| `i18n.locales.<locale>.messages.music.label`                          | [Textos de música](/es/blog/config-music/#music-messages)                                 |
| `i18n.locales.<locale>.messages.music.play`                           | [Textos de música](/es/blog/config-music/#music-messages)                                 |
| `i18n.locales.<locale>.messages.music.pause`                          | [Textos de música](/es/blog/config-music/#music-messages)                                 |
| `i18n.locales.<locale>.messages.music.prev`                           | [Textos de música](/es/blog/config-music/#music-messages)                                 |
| `i18n.locales.<locale>.messages.music.next`                           | [Textos de música](/es/blog/config-music/#music-messages)                                 |
| `i18n.locales.<locale>.messages.music.open`                           | [Textos de música](/es/blog/config-music/#music-messages)                                 |
| `i18n.locales.<locale>.messages.music.close`                          | [Textos de música](/es/blog/config-music/#music-messages)                                 |
| `i18n.locales.<locale>.messages.music.progress`                       | [Textos de música](/es/blog/config-music/#music-messages)                                 |
| `i18n.locales.<locale>.messages.music.volume`                         | [Textos de música](/es/blog/config-music/#music-messages)                                 |
| `i18n.locales.<locale>.messages.music.queue`                          | [Textos de música](/es/blog/config-music/#music-messages)                                 |
| `i18n.locales.<locale>.messages.music.mute`                           | [Textos de música](/es/blog/config-music/#music-messages)                                 |
| `i18n.locales.<locale>.messages.music.unmute`                         | [Textos de música](/es/blog/config-music/#music-messages)                                 |
| `i18n.locales.<locale>.messages.music.idle`                           | [Textos de música](/es/blog/config-music/#music-messages)                                 |
| `i18n.locales.<locale>.messages.music.loading`                        | [Textos de música](/es/blog/config-music/#music-messages)                                 |
| `i18n.locales.<locale>.messages.music.playing`                        | [Textos de música](/es/blog/config-music/#music-messages)                                 |
| `i18n.locales.<locale>.messages.music.paused`                         | [Textos de música](/es/blog/config-music/#music-messages)                                 |
| `i18n.locales.<locale>.messages.music.blocked`                        | [Textos de música](/es/blog/config-music/#music-messages)                                 |
| `i18n.locales.<locale>.messages.music.error`                          | [Textos de música](/es/blog/config-music/#music-messages)                                 |
| `i18n.locales.<locale>.messages.music.noScript`                       | [Textos de música](/es/blog/config-music/#music-messages)                                 |
| `theme.comments.shareAcrossLocales`                                   | [Comentarios Giscus](/es/blog/config-comments/#sharing)                                   |
| `theme.comments.mapping`                                              | [Comentarios Giscus](/es/blog/config-comments/#mapping)                                   |
| `theme.comments.term`                                                 | [Comentarios Giscus](/es/blog/config-comments/#mapping)                                   |
| `theme.comments.number`                                               | [Comentarios Giscus](/es/blog/config-comments/#mapping)                                   |
| `theme.comments.strict`                                               | [Comentarios Giscus](/es/blog/config-comments/#mapping)                                   |
| `theme.comments.reactionsEnabled`                                     | [Comentarios Giscus](/es/blog/config-comments/#appearance)                                |
| `theme.comments.emitMetadata`                                         | [Comentarios Giscus](/es/blog/config-comments/#appearance)                                |
| `theme.comments.inputPosition`                                        | [Comentarios Giscus](/es/blog/config-comments/#appearance)                                |
| `theme.comments.theme`                                                | [Comentarios Giscus](/es/blog/config-comments/#appearance)                                |
| `theme.comments.lang`                                                 | [Comentarios Giscus](/es/blog/config-comments/#appearance)                                |
| `theme.comments.loading`                                              | [Comentarios Giscus](/es/blog/config-comments/#appearance)                                |
| `theme.comments.crossorigin`                                          | [Comentarios Giscus](/es/blog/config-comments/#appearance)                                |
| `i18n.defaultLocale`                                                  | [Idiomas y respaldo](/es/blog/config-languages/#registry)                                 |
| `i18n.locales`                                                        | [Idiomas y respaldo](/es/blog/config-languages/#registry)                                 |
| `i18n.locales.<locale>`                                               | [Idiomas y respaldo](/es/blog/config-languages/#registry)                                 |
| `i18n.routing.defaultLocalePrefix`                                    | [Idiomas y respaldo](/es/blog/config-languages/#routing)                                  |
| `i18n.locales.<locale>.meta`                                          | [Idiomas y respaldo](/es/blog/config-languages/#meta)                                     |
| `i18n.locales.<locale>.meta.label`                                    | [Idiomas y respaldo](/es/blog/config-languages/#meta)                                     |
| `i18n.locales.<locale>.meta.hreflang`                                 | [Idiomas y respaldo](/es/blog/config-languages/#meta)                                     |
| `i18n.locales.<locale>.meta.ogLocale`                                 | [Idiomas y respaldo](/es/blog/config-languages/#meta)                                     |
| `i18n.locales.<locale>.meta.enabled`                                  | [Idiomas y respaldo](/es/blog/config-languages/#meta)                                     |
| `i18n.locales.<locale>.meta.fallback`                                 | [Idiomas y respaldo](/es/blog/config-languages/#fallback)                                 |
| `i18n.locales.<locale>.site`                                          | [Idiomas y respaldo](/es/blog/config-languages/#overrides)                                |
| `i18n.locales.<locale>.messages`                                      | [Idiomas y respaldo](/es/blog/config-languages/#overrides)                                |
| `i18n.locales.<locale>.about`                                         | [Idiomas y respaldo](/es/blog/config-languages/#overrides)                                |
| `i18n.locales.<locale>.messages.langLabel`                            | [Idiomas y respaldo](/es/blog/config-languages/#common-messages)                          |
| `i18n.locales.<locale>.aiReadableContent`                             | [GA4 y complementos para lectura por IA](/es/blog/config-analytics-ai/#locale-supplement) |
| `i18n.locales.<locale>.aiReadableContent.notes`                       | [GA4 y complementos para lectura por IA](/es/blog/config-analytics-ai/#locale-supplement) |
| `i18n.locales.<locale>.aiReadableContent.links`                       | [GA4 y complementos para lectura por IA](/es/blog/config-analytics-ai/#locale-supplement) |
| `i18n.locales.<locale>.aiReadableContent.links[].label`               | [GA4 y complementos para lectura por IA](/es/blog/config-analytics-ai/#locale-supplement) |
| `i18n.locales.<locale>.aiReadableContent.links[].href`                | [GA4 y complementos para lectura por IA](/es/blog/config-analytics-ai/#locale-supplement) |
| `i18n.locales.<locale>.messages.search.label`                         | [Textos de búsqueda](/es/blog/config-search/#messages)                                    |
| `i18n.locales.<locale>.messages.search.close`                         | [Textos de búsqueda](/es/blog/config-search/#messages)                                    |
| `i18n.locales.<locale>.messages.search.placeholder`                   | [Textos de búsqueda](/es/blog/config-search/#messages)                                    |
| `i18n.locales.<locale>.messages.search.hint`                          | [Textos de búsqueda](/es/blog/config-search/#messages)                                    |
| `i18n.locales.<locale>.messages.search.loading`                       | [Textos de búsqueda](/es/blog/config-search/#messages)                                    |
| `i18n.locales.<locale>.messages.search.empty`                         | [Textos de búsqueda](/es/blog/config-search/#messages)                                    |
| `i18n.locales.<locale>.messages.search.error`                         | [Textos de búsqueda](/es/blog/config-search/#messages)                                    |
| `i18n.locales.<locale>.messages.search.retry`                         | [Textos de búsqueda](/es/blog/config-search/#messages)                                    |
| `i18n.locales.<locale>.messages.search.more`                          | [Textos de búsqueda](/es/blog/config-search/#messages)                                    |
| `i18n.locales.<locale>.messages.search.results`                       | [Textos de búsqueda](/es/blog/config-search/#messages)                                    |
| `i18n.locales.<locale>.messages.search.dev`                           | [Textos de búsqueda](/es/blog/config-search/#messages)                                    |
| `analytics`                                                           | [GA4 y complementos para lectura por IA](/es/blog/config-analytics-ai/#analytics)         |
| `analytics.googleAnalyticsId`                                         | [GA4 y complementos para lectura por IA](/es/blog/config-analytics-ai/#analytics)         |
| `aiReadableContent`                                                   | [GA4 y complementos para lectura por IA](/es/blog/config-analytics-ai/#supplement)        |
| `aiReadableContent.notes`                                             | [GA4 y complementos para lectura por IA](/es/blog/config-analytics-ai/#supplement)        |
| `aiReadableContent.links`                                             | [GA4 y complementos para lectura por IA](/es/blog/config-analytics-ai/#supplement)        |
| `aiReadableContent.links[].label`                                     | [GA4 y complementos para lectura por IA](/es/blog/config-analytics-ai/#supplement)        |
| `aiReadableContent.links[].href`                                      | [GA4 y complementos para lectura por IA](/es/blog/config-analytics-ai/#supplement)        |
| `site.title`                                                          | [Sitio e interfaz compartida](/es/blog/config-site-chrome/#identity)                      |
| `site.description`                                                    | [Sitio e interfaz compartida](/es/blog/config-site-chrome/#identity)                      |
| `site.url`                                                            | [Sitio e interfaz compartida](/es/blog/config-site-chrome/#identity)                      |
| `site.tagline`                                                        | [Sitio e interfaz compartida](/es/blog/config-site-chrome/#identity)                      |
| `social.links`                                                        | [Sitio e interfaz compartida](/es/blog/config-site-chrome/#social)                        |
| `social.links[].href`                                                 | [Sitio e interfaz compartida](/es/blog/config-site-chrome/#social-fields)                 |
| `social.links[].label`                                                | [Sitio e interfaz compartida](/es/blog/config-site-chrome/#social-fields)                 |
| `social.links[].rel`                                                  | [Sitio e interfaz compartida](/es/blog/config-site-chrome/#social-fields)                 |
| `social.links[].icon`                                                 | [Sitio e interfaz compartida](/es/blog/config-site-chrome/#social-fields)                 |
| `social.links[].iconSrc`                                              | [Sitio e interfaz compartida](/es/blog/config-site-chrome/#social-fields)                 |
| `theme.footer.links`                                                  | [Sitio e interfaz compartida](/es/blog/config-site-chrome/#footer)                        |
| `theme.footer.links[].label`                                          | [Sitio e interfaz compartida](/es/blog/config-site-chrome/#footer)                        |
| `theme.footer.links[].href`                                           | [Sitio e interfaz compartida](/es/blog/config-site-chrome/#footer)                        |
| `i18n.locales.<locale>.messages.nav.home`                             | [Sitio e interfaz compartida](/es/blog/config-site-chrome/#chrome-messages)               |
| `i18n.locales.<locale>.messages.nav.blog`                             | [Sitio e interfaz compartida](/es/blog/config-site-chrome/#chrome-messages)               |
| `i18n.locales.<locale>.messages.nav.status`                           | [Sitio e interfaz compartida](/es/blog/config-site-chrome/#chrome-messages)               |
| `i18n.locales.<locale>.messages.nav.statusAria`                       | [Sitio e interfaz compartida](/es/blog/config-site-chrome/#chrome-messages)               |
| `i18n.locales.<locale>.messages.footer.theme`                         | [Sitio e interfaz compartida](/es/blog/config-site-chrome/#chrome-messages)               |
| `i18n.locales.<locale>.messages.footer.builtWith`                     | [Sitio e interfaz compartida](/es/blog/config-site-chrome/#chrome-messages)               |
| `i18n.locales.<locale>.messages.terminal.commandInput`                | [Textos de terminal](/es/blog/config-terminal/#messages)                                  |
| `i18n.locales.<locale>.messages.terminal.hint`                        | [Textos de terminal](/es/blog/config-terminal/#messages)                                  |
| `i18n.locales.<locale>.messages.terminal.help`                        | [Textos de terminal](/es/blog/config-terminal/#messages)                                  |
| `i18n.locales.<locale>.messages.terminal.syntax`                      | [Textos de terminal](/es/blog/config-terminal/#messages)                                  |
| `i18n.locales.<locale>.messages.terminal.usage`                       | [Textos de terminal](/es/blog/config-terminal/#messages)                                  |
| `i18n.locales.<locale>.messages.terminal.unknown`                     | [Textos de terminal](/es/blog/config-terminal/#messages)                                  |
| `i18n.locales.<locale>.messages.terminal.notFound`                    | [Textos de terminal](/es/blog/config-terminal/#messages)                                  |
| `i18n.locales.<locale>.messages.terminal.notDirectory`                | [Textos de terminal](/es/blog/config-terminal/#messages)                                  |
| `i18n.locales.<locale>.messages.terminal.isDirectory`                 | [Textos de terminal](/es/blog/config-terminal/#messages)                                  |
| `i18n.locales.<locale>.messages.terminal.failed`                      | [Textos de terminal](/es/blog/config-terminal/#messages)                                  |
| `i18n.locales.<locale>.messages.terminal.tooLarge`                    | [Textos de terminal](/es/blog/config-terminal/#messages)                                  |
| `i18n.locales.<locale>.messages.terminal.empty`                       | [Textos de terminal](/es/blog/config-terminal/#messages)                                  |
| `i18n.locales.<locale>.messages.terminal.loading`                     | [Textos de terminal](/es/blog/config-terminal/#messages)                                  |
| `i18n.locales.<locale>.messages.terminal.readerTitle`                 | [Textos de terminal sin uso actual](/es/blog/config-terminal/#messages)                   |
| `i18n.locales.<locale>.messages.terminal.readerHint`                  | [Textos de terminal](/es/blog/config-terminal/#messages)                                  |
| `i18n.locales.<locale>.messages.terminal.readerCommand`               | [Textos de terminal](/es/blog/config-terminal/#messages)                                  |

## Consultar los campos de artículos por separado

El frontmatter no forma parte de la tabla site.config anterior: [contenido, fechas e imágenes](/es/blog/config-article/#frontmatter), [estadísticas y estado OUTPUT](/es/blog/config-article/#output-fields), [compatibilidad y campos sin uso](/es/blog/config-article/#legacy-frontmatter).

Los tres campos frontmatter de Fragments están en [campos de contenido](/es/blog/config-fragments/#content-fields). No los confundas con los de artículos.

La inclusión de un artículo en la búsqueda se explica en [search](/es/blog/config-search/#article-search), que no es un campo site.config ni un control de privacidad.

## Cómo leer las explicaciones

Cada diccionario muestra ruta completa, tipo, valor predeterminado del tema, efecto real, límites, condiciones y ejemplo. Si un campo sigue aceptado por el tipo pero no tiene código consumidor, no debe describirse como función activa.

| Estado                        | Significado                                                                                                             |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Activo                        | La implementación actual tiene el efecto correspondiente                                                                |
| Condicional                   | Requiere activar la función, cumplir condiciones de la página o no ser reemplazado por configuración de mayor prioridad |
| Sin uso actual                | El tipo lo acepta, pero actualmente no hay efecto consumidor; no lo rellenes para cambiar la página                     |
| Conservado por compatibilidad | Tiene un propósito explícito; la explicación indica qué conserva y si se muestra actualmente                            |

Los valores predeterminados proceden del paquete o los textos integrados. El starter puede reemplazarlos y el demo tiene configuración personal. Autor, título y lista musical del demo no son los predeterminados de todos los blogs.

Los valores de idioma dependen del idioma y su cadena de respaldo. El diccionario indica «sin definir», «texto integrado del idioma actual» o valores concretos. Si solo muestra chino simplificado e inglés, especifica ese alcance, sin presentarlos como valores fijos de todos los idiomas.

## Dónde escribir y cómo combinar

Combina los ejemplos con `defineThemeConfig({...})` existente en `src/site.config.ts`. Conserva import, export y configuración personal; no dupliques theme ni i18n en el mismo objeto.

Los objetos se combinan recursivamente; los campos omitidos mantienen los valores predeterminados. Los arrays se reemplazan completos y undefined no sobrescribe. El significado de cadenas vacías, arrays vacíos y false depende del campo; no equivalen siempre a restaurar valores. Por ejemplo, hero vacío borra la presentación, mientras homeTitle en blanco continúa el respaldo.

Comprueba la página correspondiente en dev después del cambio. Los cambios de entorno requieren reiniciar el servidor. En producción hay que compilar y desplegar otra vez: guardar configuración local no modifica el sitio público.

Frontmatter, configuración Astro y variables de entorno tienen ubicaciones distintas. El diccionario explica sus relaciones sin presentarlos como campos site.config. Consulta instalación y actualización en el [primer tutorial](/es/blog/starter-guide-1-configure-your-site/), y comprobaciones locales y despliegue en el [tutorial de publicación](/es/blog/starter-guide-deployment/).
