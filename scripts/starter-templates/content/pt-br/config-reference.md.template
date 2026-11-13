---
tags: ['anglefeint', 'config']
title: 'Referência de configuração: onde alterar o que preciso?'
subtitle: 'Índice de campos por página, função e caminho'
description: 'Entrada dos dicionários de configuração, caminhos completos, estados de suporte e regras de mescla.'
pubDate: '2026-11-13'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/hacker-01.webp'
---

**Nota de versão:** O dicionário segue o código atual. Resposta a movimento reduzido, validação estrita de `blogPageSize` e isolamento com Fragments desativado exigem 0.36.1 ou posterior; não estão em 0.36.0. Instalação e CLI padrão não mudam.

Se sabe o que deseja fazer, comece pelos tutoriais. Para encontrar significado, padrão ou limite de um campo, use este dicionário. Ambos seguem o código atual do tema, sem exigir leitura prévia de documentos do repositório.

No primeiro uso, siga os [oito tutoriais](/pt-br/blog/starter-guide-1-configure-your-site/#tutorial-order): instalar → escrever → adicionar imagens → publicar fragments → ajustar páginas e recursos → comentários → idiomas → implantação. Não precisa ativar todos os recursos opcionais. Consulte os campos quando necessário, sem ler toda a tabela de caminhos de uma vez.

Estão disponíveis [página inicial](/pt-br/blog/config-home/), [Blog List e tags](/pt-br/blog/config-blog-list/), [detalhes da publicação](/pt-br/blog/config-article/), [Fragments](/pt-br/blog/config-fragments/), [About](/pt-br/blog/config-about/), [Decoder](/pt-br/blog/config-decoder/), [player de música](/pt-br/blog/config-music/), [Giscus](/pt-br/blog/config-comments/), [idiomas e fallback](/pt-br/blog/config-languages/), [busca e descoberta](/pt-br/blog/config-search/), [GA4 e complementos de leitura por IA](/pt-br/blog/config-analytics-ai/), [site e interface pública](/pt-br/blog/config-site-chrome/) e [terminal](/pt-br/blog/config-terminal/).

## Encontrar por página ou recurso

| Quero alterar                                                        | Dicionário                                                  | Tutorial                                                                                                                                                              |
| -------------------------------------------------------------------- | ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Título, apresentação, recentes, avisos, terminal e travessia inicial | [Página inicial](/pt-br/blog/config-home/)                  | [Páginas e recursos](/pt-br/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                                                   |
| Nome, domínio, navegação pública, redes e rodapé                     | [Site e interface pública](/pt-br/blog/config-site-chrome/) | [Instalação e informações do site](/pt-br/blog/starter-guide-1-configure-your-site/), [personalização](/pt-br/blog/starter-guide-3-comments-about-and-theme-toggles/) |
| Blog List, tags e paginação                                          | [Listas](/pt-br/blog/config-blog-list/)                     | [Listas e paginação](/pt-br/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                                                   |
| Detalhes da publicação, sumário, matemática e efeitos de leitura     | [Publicações](/pt-br/blog/config-article/)                  | [Primeira publicação](/pt-br/blog/starter-guide-2-languages-and-routing/)                                                                                             |
| Lista e prévia Fragments                                             | [Fragments](/pt-br/blog/config-fragments/)                  | [Publique um fragment](/pt-br/blog/starter-guide-5-fragments/)                                                                                                        |
| Corpo About, contato, barra lateral e ferramentas                    | [About](/pt-br/blog/config-about/)                          | [Páginas e recursos](/pt-br/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                                                   |
| Terminal About, mensagens e leitor somente leitura                   | [Terminal](/pt-br/blog/config-terminal/)                    | [Páginas e recursos](/pt-br/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                                                   |
| Página Decoder e cards de leitura                                    | [Decoder](/pt-br/blog/config-decoder/)                      | [Páginas e recursos](/pt-br/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                                                   |
| Player de música                                                     | [Player de música](/pt-br/blog/config-music/)               | [Música](/pt-br/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                                                               |
| Giscus e compartilhamento de discussões entre idiomas                | [Comentários Giscus](/pt-br/blog/config-comments/)          | [Permita comentários](/pt-br/blog/starter-guide-4-giscus-comments/)                                                                                                   |
| Idiomas ativos, URLs, tradução de interface e fallback               | [Idiomas](/pt-br/blog/config-languages/)                    | [Idiomas](/pt-br/blog/starter-guide-languages/)                                                                                                                       |
| Busca e descoberta de conteúdo                                       | [Busca](/pt-br/blog/config-search/)                         | [Escrita](/pt-br/blog/starter-guide-2-languages-and-routing/), [publicação](/pt-br/blog/starter-guide-deployment/)                                                    |
| Estatísticas GA4 e complementos de leitura por IA                    | [GA4 e complementos IA](/pt-br/blog/config-analytics-ai/)   | [Publique em seu domínio](/pt-br/blog/starter-guide-deployment/)                                                                                                      |

Cada campo tem uma referência principal; outros módulos apontam para ela. Por exemplo, a página inicial usa o controle de fragments, mas ele também afeta a lista completa e não é exclusivo da página inicial.

## Encontrar pelo caminho completo

O índice segue os tipos públicos atuais, incluindo campos não usados. Abra a referência principal; diferenças entre páginas são explicadas por links nos módulos. `<locale>` é placeholder: substitua por zh, en ou outro código real. Frontmatter é listado separadamente de site.config.

| Caminho completo                                                      | Referência                                                                                   |
| --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `i18n.locales.<locale>.site.homeTitle`                                | [Título grande inicial](/pt-br/blog/config-home/#home-title)                                 |
| `i18n.locales.<locale>.site.hero`                                     | [Apresentação inicial visível](/pt-br/blog/config-home/#home-hero)                           |
| `i18n.locales.<locale>.messages.siteDescription`                      | [Metadescrição inicial](/pt-br/blog/config-home/#home-description)                           |
| `theme.homeLatestCount`                                               | [Quantidade de recentes](/pt-br/blog/config-home/#latest-count)                              |
| `theme.home.showInitialize`                                           | [Controles de avisos de inicialização](/pt-br/blog/config-home/#startup-switches)            |
| `theme.home.showFollow`                                               | [Controles de avisos de inicialização](/pt-br/blog/config-home/#startup-switches)            |
| `theme.home.showTrace`                                                | [Controles de avisos de inicialização](/pt-br/blog/config-home/#startup-switches)            |
| `theme.effects.enableHomePassage`                                     | [Travessia por clique](/pt-br/blog/config-home/#home-passage)                                |
| `i18n.locales.<locale>.messages.home.latest`                          | [Textos da página inicial](/pt-br/blog/config-home/#home-messages)                           |
| `i18n.locales.<locale>.messages.home.viewAll`                         | [Textos da página inicial](/pt-br/blog/config-home/#home-messages)                           |
| `i18n.locales.<locale>.messages.home.noPosts`                         | [Textos da página inicial](/pt-br/blog/config-home/#home-messages)                           |
| `i18n.locales.<locale>.messages.home.openDoor`                        | [Textos da página inicial](/pt-br/blog/config-home/#home-messages)                           |
| `i18n.locales.<locale>.messages.home.transmission`                    | [Texto do terminal em tela larga](/pt-br/blog/config-home/#home-transmission)                |
| `i18n.locales.<locale>.messages.home.hero`                            | [Texto alternativo de apresentação](/pt-br/blog/config-home/#message-hero)                   |
| `theme.fragments.enabled`                                             | [Ativar fragments](/pt-br/blog/config-fragments/#enabled)                                    |
| `i18n.locales.<locale>.messages.blog.allPosts`                        | [Entrada compartilhada de publicações e tags](/pt-br/blog/config-blog-list/#tag-messages)    |
| `i18n.locales.<locale>.messages.fragments.title`                      | [Textos dos fragments](/pt-br/blog/config-fragments/#fragment-messages)                      |
| `i18n.locales.<locale>.messages.fragments.close`                      | [Textos dos fragments](/pt-br/blog/config-fragments/#fragment-messages)                      |
| `i18n.locales.<locale>.messages.siteTitle`                            | [Campo de título não usado atualmente](/pt-br/blog/config-site-chrome/#legacy-site-title)    |
| `theme.blogPageSize`                                                  | [Publicações por página](/pt-br/blog/config-blog-list/#page-size)                            |
| `theme.tags.enabled`                                                  | [Ativar tags](/pt-br/blog/config-blog-list/#tags-enabled)                                    |
| `theme.pagination.windowSize`                                         | [Janela de páginas](/pt-br/blog/config-blog-list/#pagination-window)                         |
| `theme.pagination.showJumpThreshold`                                  | [Limite para salto](/pt-br/blog/config-blog-list/#jump-threshold)                            |
| `theme.pagination.jump.enabled`                                       | [Ativar salto](/pt-br/blog/config-blog-list/#jump-enabled)                                   |
| `theme.pagination.jump.enterToGo`                                     | [Salto por Enter](/pt-br/blog/config-blog-list/#jump-enter)                                  |
| `theme.pagination.style.enabled`                                      | [Ativar estilos de paginação](/pt-br/blog/config-blog-list/#style-enabled)                   |
| `theme.pagination.style.mode`                                         | [Estratégia de variantes](/pt-br/blog/config-blog-list/#style-mode)                          |
| `theme.pagination.style.variants`                                     | [Quantidade de variantes](/pt-br/blog/config-blog-list/#style-variants)                      |
| `theme.pagination.style.fixedVariant`                                 | [Variante fixa](/pt-br/blog/config-blog-list/#style-fixed)                                   |
| `i18n.locales.<locale>.messages.blog.title`                           | [Título e descrição das listas](/pt-br/blog/config-blog-list/#archive-messages)              |
| `i18n.locales.<locale>.messages.blog.pageTitle`                       | [Título e descrição das listas](/pt-br/blog/config-blog-list/#archive-messages)              |
| `i18n.locales.<locale>.messages.blog.archiveDescription`              | [Título e descrição das listas](/pt-br/blog/config-blog-list/#archive-messages)              |
| `i18n.locales.<locale>.messages.blog.pageDescription`                 | [Título e descrição das listas](/pt-br/blog/config-blog-list/#archive-messages)              |
| `i18n.locales.<locale>.messages.blog.previous`                        | [Textos de paginação](/pt-br/blog/config-blog-list/#pagination-messages)                     |
| `i18n.locales.<locale>.messages.blog.next`                            | [Textos de paginação](/pt-br/blog/config-blog-list/#pagination-messages)                     |
| `i18n.locales.<locale>.messages.blog.paginationAria`                  | [Textos de paginação](/pt-br/blog/config-blog-list/#pagination-messages)                     |
| `i18n.locales.<locale>.messages.blog.jumpTo`                          | [Textos de paginação](/pt-br/blog/config-blog-list/#pagination-messages)                     |
| `i18n.locales.<locale>.messages.blog.jumpInputLabel`                  | [Textos de paginação](/pt-br/blog/config-blog-list/#pagination-messages)                     |
| `i18n.locales.<locale>.messages.blog.jumpGo`                          | [Textos de paginação](/pt-br/blog/config-blog-list/#pagination-messages)                     |
| `i18n.locales.<locale>.messages.blog.tags`                            | [Textos de tags](/pt-br/blog/config-blog-list/#tag-messages)                                 |
| `i18n.locales.<locale>.messages.blog.noTags`                          | [Textos de tags](/pt-br/blog/config-blog-list/#tag-messages)                                 |
| `i18n.locales.<locale>.messages.blog.taggedPosts`                     | [Textos de tags](/pt-br/blog/config-blog-list/#tag-messages)                                 |
| `theme.toc.enabled`                                                   | [Recursos de publicações](/pt-br/blog/config-article/#feature-switches)                      |
| `theme.math.enabled`                                                  | [Recursos de publicações](/pt-br/blog/config-article/#feature-switches)                      |
| `theme.effects.enableRedQueen`                                        | [Recursos de publicações](/pt-br/blog/config-article/#feature-switches)                      |
| `theme.search.enabled`                                                | [Ativar busca interna](/pt-br/blog/config-search/#enabled)                                   |
| `theme.socialImage.enabled`                                           | [Recursos de publicações](/pt-br/blog/config-article/#feature-switches)                      |
| `site.author`                                                         | [Site e interface pública](/pt-br/blog/config-site-chrome/#identity)                         |
| `site.ogImage`                                                        | [Site e interface pública](/pt-br/blog/config-site-chrome/#identity)                         |
| `theme.enableAboutPage`                                               | [Ativar About](/pt-br/blog/config-about/#page-enabled)                                       |
| `theme.footer.showCredits`                                            | [Site e interface pública](/pt-br/blog/config-site-chrome/#footer)                           |
| `theme.comments.enabled`                                              | [Comentários Giscus](/pt-br/blog/config-comments/#controls)                                  |
| `i18n.locales.<locale>.messages.blog.rqBadge`                         | [Textos de publicações](/pt-br/blog/config-article/#article-messages)                        |
| `i18n.locales.<locale>.messages.blog.rqReplayAria`                    | [Textos de publicações](/pt-br/blog/config-article/#article-messages)                        |
| `i18n.locales.<locale>.messages.blog.backToTop`                       | [Textos de publicações](/pt-br/blog/config-article/#article-messages)                        |
| `i18n.locales.<locale>.messages.blog.toastP10`                        | [Textos de publicações](/pt-br/blog/config-article/#article-messages)                        |
| `i18n.locales.<locale>.messages.blog.toastP30`                        | [Textos de publicações](/pt-br/blog/config-article/#article-messages)                        |
| `i18n.locales.<locale>.messages.blog.toastP60`                        | [Textos de publicações](/pt-br/blog/config-article/#article-messages)                        |
| `i18n.locales.<locale>.messages.blog.toastDone`                       | [Textos de publicações](/pt-br/blog/config-article/#article-messages)                        |
| `i18n.locales.<locale>.messages.blog.metaPublished`                   | [Textos de publicações](/pt-br/blog/config-article/#article-messages)                        |
| `i18n.locales.<locale>.messages.blog.metaAuthor`                      | [Textos de publicações](/pt-br/blog/config-article/#article-messages)                        |
| `i18n.locales.<locale>.messages.blog.metaUpdated`                     | [Textos de publicações](/pt-br/blog/config-article/#article-messages)                        |
| `i18n.locales.<locale>.messages.blog.systemStatusAria`                | [Textos de publicações](/pt-br/blog/config-article/#article-messages)                        |
| `i18n.locales.<locale>.messages.blog.systemModelLabel`                | [Textos de publicações](/pt-br/blog/config-article/#article-messages)                        |
| `i18n.locales.<locale>.messages.blog.systemModeLabel`                 | [Textos de publicações](/pt-br/blog/config-article/#article-messages)                        |
| `i18n.locales.<locale>.messages.blog.systemStateLabel`                | [Textos de publicações](/pt-br/blog/config-article/#article-messages)                        |
| `i18n.locales.<locale>.messages.blog.promptContextLabel`              | [Textos de publicações](/pt-br/blog/config-article/#article-messages)                        |
| `i18n.locales.<locale>.messages.blog.heroMonitor`                     | [Textos de publicações](/pt-br/blog/config-article/#article-messages)                        |
| `i18n.locales.<locale>.messages.blog.heroSignalSync`                  | [Textos de publicações](/pt-br/blog/config-article/#article-messages)                        |
| `i18n.locales.<locale>.messages.blog.heroModelOnline`                 | [Textos de publicações](/pt-br/blog/config-article/#article-messages)                        |
| `i18n.locales.<locale>.messages.blog.toc`                             | [Textos de publicações](/pt-br/blog/config-article/#article-messages)                        |
| `i18n.locales.<locale>.messages.blog.responseOutput`                  | [Textos de publicações](/pt-br/blog/config-article/#article-messages)                        |
| `i18n.locales.<locale>.messages.blog.statsWords`                      | [Textos de publicações](/pt-br/blog/config-article/#article-messages)                        |
| `i18n.locales.<locale>.messages.blog.statsTokens`                     | [Textos de publicações](/pt-br/blog/config-article/#article-messages)                        |
| `i18n.locales.<locale>.messages.blog.copySectionLink`                 | [Textos de publicações](/pt-br/blog/config-article/#article-messages)                        |
| `i18n.locales.<locale>.messages.blog.regenerate`                      | [Textos de publicações](/pt-br/blog/config-article/#article-messages)                        |
| `i18n.locales.<locale>.messages.blog.relatedAria`                     | [Textos de publicações](/pt-br/blog/config-article/#article-messages)                        |
| `i18n.locales.<locale>.messages.blog.related`                         | [Textos de publicações](/pt-br/blog/config-article/#article-messages)                        |
| `i18n.locales.<locale>.messages.blog.backToBlogAria`                  | [Textos de publicações](/pt-br/blog/config-article/#article-messages)                        |
| `i18n.locales.<locale>.messages.blog.backToBlog`                      | [Textos de publicações](/pt-br/blog/config-article/#article-messages)                        |
| `i18n.locales.<locale>.messages.blog.comments`                        | [Textos de publicações](/pt-br/blog/config-article/#article-messages)                        |
| `i18n.locales.<locale>.messages.blog.metaReadMinutes`                 | [Textos de publicações, não usados atualmente](/pt-br/blog/config-article/#article-messages) |
| `i18n.locales.<locale>.messages.blog.latencyLabel`                    | [Textos de publicações, não usados atualmente](/pt-br/blog/config-article/#article-messages) |
| `i18n.locales.<locale>.messages.blog.confidenceLabel`                 | [Textos de publicações, não usados atualmente](/pt-br/blog/config-article/#article-messages) |
| `i18n.locales.<locale>.messages.codeCopy.copy`                        | [Textos de interação de leitura](/pt-br/blog/config-article/#interaction-messages)           |
| `i18n.locales.<locale>.messages.codeCopy.copied`                      | [Textos de interação de leitura](/pt-br/blog/config-article/#interaction-messages)           |
| `i18n.locales.<locale>.messages.codeCopy.failed`                      | [Textos de interação de leitura](/pt-br/blog/config-article/#interaction-messages)           |
| `i18n.locales.<locale>.messages.imagePreview.open`                    | [Textos de interação de leitura](/pt-br/blog/config-article/#interaction-messages)           |
| `i18n.locales.<locale>.messages.imagePreview.close`                   | [Textos de interação de leitura](/pt-br/blog/config-article/#interaction-messages)           |
| `theme.fragments.pageSize`                                            | [Fragments por página](/pt-br/blog/config-fragments/#page-size)                              |
| `theme.fragments.comments.enabled`                                    | [Comentários dos fragments](/pt-br/blog/config-fragments/#comments-enabled)                  |
| `i18n.locales.<locale>.messages.fragments.description`                | [Textos dos fragments](/pt-br/blog/config-fragments/#fragment-messages)                      |
| `i18n.locales.<locale>.messages.fragments.empty`                      | [Textos dos fragments](/pt-br/blog/config-fragments/#fragment-messages)                      |
| `i18n.locales.<locale>.messages.fragments.comments`                   | [Textos dos fragments](/pt-br/blog/config-fragments/#fragment-messages)                      |
| `i18n.locales.<locale>.messages.fragments.previous`                   | [Textos de fragments não usados atualmente](/pt-br/blog/config-fragments/#fragment-messages) |
| `i18n.locales.<locale>.messages.fragments.next`                       | [Textos de fragments não usados atualmente](/pt-br/blog/config-fragments/#fragment-messages) |
| `i18n.locales.<locale>.messages.fragments.loading`                    | [Textos dos fragments](/pt-br/blog/config-fragments/#fragment-messages)                      |
| `i18n.locales.<locale>.messages.fragments.error`                      | [Textos dos fragments](/pt-br/blog/config-fragments/#fragment-messages)                      |
| `i18n.locales.<locale>.messages.fragments.retry`                      | [Textos dos fragments](/pt-br/blog/config-fragments/#fragment-messages)                      |
| `i18n.locales.<locale>.messages.fragments.copyLink`                   | [Textos dos fragments](/pt-br/blog/config-fragments/#fragment-messages)                      |
| `i18n.locales.<locale>.messages.fragments.linkCopied`                 | [Textos dos fragments](/pt-br/blog/config-fragments/#fragment-messages)                      |
| `i18n.locales.<locale>.messages.fragments.copyLinkFailed`             | [Textos dos fragments](/pt-br/blog/config-fragments/#fragment-messages)                      |
| `i18n.locales.<locale>.messages.fragments.notFound`                   | [Textos dos fragments](/pt-br/blog/config-fragments/#fragment-messages)                      |
| `i18n.locales.<locale>.messages.fragments.indexError`                 | [Textos dos fragments](/pt-br/blog/config-fragments/#fragment-messages)                      |
| `theme.comments.repo`                                                 | [Comentários Giscus](/pt-br/blog/config-comments/#connection)                                |
| `theme.comments.repoId`                                               | [Comentários Giscus](/pt-br/blog/config-comments/#connection)                                |
| `theme.comments.category`                                             | [Comentários Giscus](/pt-br/blog/config-comments/#connection)                                |
| `theme.comments.categoryId`                                           | [Comentários Giscus](/pt-br/blog/config-comments/#connection)                                |
| `i18n.locales.<locale>.about.metaLine`                                | [Corpo About](/pt-br/blog/config-about/#body-fields)                                         |
| `i18n.locales.<locale>.about.sections.who`                            | [Corpo About](/pt-br/blog/config-about/#body-fields)                                         |
| `i18n.locales.<locale>.about.sections.what`                           | [Corpo About](/pt-br/blog/config-about/#body-fields)                                         |
| `i18n.locales.<locale>.about.sections.ethos`                          | [Corpo About](/pt-br/blog/config-about/#body-fields)                                         |
| `i18n.locales.<locale>.about.sections.now`                            | [Corpo About](/pt-br/blog/config-about/#body-fields)                                         |
| `i18n.locales.<locale>.about.sections.contactLead`                    | [Corpo About](/pt-br/blog/config-about/#body-fields)                                         |
| `i18n.locales.<locale>.about.sections.signature`                      | [Corpo About](/pt-br/blog/config-about/#body-fields)                                         |
| `i18n.locales.<locale>.about.contact.email`                           | [Contato About](/pt-br/blog/config-about/#contact-fields)                                    |
| `i18n.locales.<locale>.about.contact.githubUrl`                       | [Contato About](/pt-br/blog/config-about/#contact-fields)                                    |
| `i18n.locales.<locale>.about.contact.githubLabel`                     | [Contato About](/pt-br/blog/config-about/#contact-fields)                                    |
| `i18n.locales.<locale>.about.sidebar.dlData`                          | [Entradas de ferramentas About](/pt-br/blog/config-about/#tool-fields)                       |
| `i18n.locales.<locale>.about.sidebar.ai`                              | [Entradas de ferramentas About](/pt-br/blog/config-about/#tool-fields)                       |
| `i18n.locales.<locale>.about.sidebar.decryptor`                       | [Entradas de ferramentas About](/pt-br/blog/config-about/#tool-fields)                       |
| `i18n.locales.<locale>.about.sidebar.help`                            | [Entradas de ferramentas About](/pt-br/blog/config-about/#tool-fields)                       |
| `i18n.locales.<locale>.about.sidebar.allScripts`                      | [Entradas de ferramentas About](/pt-br/blog/config-about/#tool-fields)                       |
| `i18n.locales.<locale>.about.scriptsPath`                             | [Entradas de ferramentas About](/pt-br/blog/config-about/#tool-fields)                       |
| `i18n.locales.<locale>.about.labels.modalOutput`                      | [Textos gerais About: observe o estado](/pt-br/blog/config-about/#label-fields)              |
| `i18n.locales.<locale>.about.labels.modalClose`                       | [Textos gerais About](/pt-br/blog/config-about/#label-fields)                                |
| `i18n.locales.<locale>.about.labels.responseOutput`                   | [Textos gerais About](/pt-br/blog/config-about/#label-fields)                                |
| `i18n.locales.<locale>.about.labels.contactEmailLead`                 | [Textos gerais About](/pt-br/blog/config-about/#label-fields)                                |
| `i18n.locales.<locale>.about.labels.contactConnectLead`               | [Textos gerais About](/pt-br/blog/config-about/#label-fields)                                |
| `i18n.locales.<locale>.about.labels.backToTop`                        | [Textos gerais About](/pt-br/blog/config-about/#label-fields)                                |
| `i18n.locales.<locale>.about.labels.quickAccess`                      | [Textos gerais About](/pt-br/blog/config-about/#label-fields)                                |
| `i18n.locales.<locale>.about.labels.contactEmailLabel`                | [Textos gerais About](/pt-br/blog/config-about/#label-fields)                                |
| `i18n.locales.<locale>.about.modals.dlData.title`                     | [Janelas de ferramentas About](/pt-br/blog/config-about/#modal-fields)                       |
| `i18n.locales.<locale>.about.modals.dlData.subtitle`                  | [Janelas de ferramentas About](/pt-br/blog/config-about/#modal-fields)                       |
| `i18n.locales.<locale>.about.modals.ai.title`                         | [Janelas de ferramentas About](/pt-br/blog/config-about/#modal-fields)                       |
| `i18n.locales.<locale>.about.modals.ai.lines`                         | [Janelas de ferramentas About](/pt-br/blog/config-about/#modal-fields)                       |
| `i18n.locales.<locale>.about.modals.decryptor.title`                  | [Janelas de ferramentas About](/pt-br/blog/config-about/#modal-fields)                       |
| `i18n.locales.<locale>.about.modals.decryptor.header`                 | [Janelas About: observe o estado](/pt-br/blog/config-about/#modal-fields)                    |
| `i18n.locales.<locale>.about.modals.decryptor.keysLabel`              | [Janelas About: observe o estado](/pt-br/blog/config-about/#modal-fields)                    |
| `i18n.locales.<locale>.about.modals.decryptor.currentPassphraseLabel` | [Janelas About: observe o estado](/pt-br/blog/config-about/#modal-fields)                    |
| `i18n.locales.<locale>.about.modals.decryptor.masterKeyLabel`         | [Janelas About: observe o estado](/pt-br/blog/config-about/#modal-fields)                    |
| `i18n.locales.<locale>.about.modals.decryptor.transientKeyLabel`      | [Janelas About: observe o estado](/pt-br/blog/config-about/#modal-fields)                    |
| `i18n.locales.<locale>.about.modals.help.title`                       | [Janelas de ferramentas About](/pt-br/blog/config-about/#modal-fields)                       |
| `i18n.locales.<locale>.about.modals.help.statsLabel`                  | [Janelas de ferramentas About](/pt-br/blog/config-about/#modal-fields)                       |
| `i18n.locales.<locale>.about.modals.help.typedPrefix`                 | [Janelas de ferramentas About](/pt-br/blog/config-about/#modal-fields)                       |
| `i18n.locales.<locale>.about.modals.help.typedSuffix`                 | [Janelas de ferramentas About](/pt-br/blog/config-about/#modal-fields)                       |
| `i18n.locales.<locale>.about.modals.allScripts.title`                 | [Janelas de ferramentas About](/pt-br/blog/config-about/#modal-fields)                       |
| `i18n.locales.<locale>.about.effects.backgroundLines`                 | [Efeitos About: observe o estado](/pt-br/blog/config-about/#effect-fields)                   |
| `i18n.locales.<locale>.about.effects.scrollToasts.p30`                | [Efeitos About](/pt-br/blog/config-about/#effect-fields)                                     |
| `i18n.locales.<locale>.about.effects.scrollToasts.p60`                | [Efeitos About](/pt-br/blog/config-about/#effect-fields)                                     |
| `i18n.locales.<locale>.about.effects.scrollToasts.p90`                | [Efeitos About](/pt-br/blog/config-about/#effect-fields)                                     |
| `i18n.locales.<locale>.messages.about.title`                          | [About e controles compartilhados](/pt-br/blog/config-about/#about-messages)                 |
| `i18n.locales.<locale>.messages.about.description`                    | [About e controles compartilhados](/pt-br/blog/config-about/#about-messages)                 |
| `i18n.locales.<locale>.messages.about.who`                            | [About e controles compartilhados](/pt-br/blog/config-about/#about-messages)                 |
| `i18n.locales.<locale>.messages.about.what`                           | [About e controles compartilhados](/pt-br/blog/config-about/#about-messages)                 |
| `i18n.locales.<locale>.messages.about.ethos`                          | [About e controles compartilhados](/pt-br/blog/config-about/#about-messages)                 |
| `i18n.locales.<locale>.messages.about.now`                            | [About e controles compartilhados](/pt-br/blog/config-about/#about-messages)                 |
| `i18n.locales.<locale>.messages.about.contact`                        | [About e controles compartilhados](/pt-br/blog/config-about/#about-messages)                 |
| `i18n.locales.<locale>.messages.about.regenerate`                     | [About e controles compartilhados](/pt-br/blog/config-about/#about-messages)                 |
| `i18n.locales.<locale>.messages.windowControls.collapse`              | [About e controles compartilhados](/pt-br/blog/config-about/#about-messages)                 |
| `i18n.locales.<locale>.messages.windowControls.expand`                | [About e controles compartilhados](/pt-br/blog/config-about/#about-messages)                 |
| `i18n.locales.<locale>.messages.windowControls.restore`               | [About e controles compartilhados](/pt-br/blog/config-about/#about-messages)                 |
| `i18n.locales.<locale>.messages.windowControls.fullscreen`            | [About e controles compartilhados](/pt-br/blog/config-about/#about-messages)                 |
| `i18n.locales.<locale>.messages.scriptFolders.copyTitle`              | [About e controles compartilhados](/pt-br/blog/config-about/#about-messages)                 |
| `i18n.locales.<locale>.messages.scriptFolders.copied`                 | [About e controles compartilhados](/pt-br/blog/config-about/#about-messages)                 |
| `i18n.locales.<locale>.messages.scriptFolders.failed`                 | [About e controles compartilhados](/pt-br/blog/config-about/#about-messages)                 |
| `theme.enableDecoderPage`                                             | [Ativar Decoder](/pt-br/blog/config-decoder/#page-enabled)                                   |
| `i18n.locales.<locale>.messages.nav.about`                            | [Site e interface pública](/pt-br/blog/config-site-chrome/#chrome-messages)                  |
| `i18n.locales.<locale>.messages.decoder.input`                        | [Textos Decoder](/pt-br/blog/config-decoder/#text-messages)                                  |
| `i18n.locales.<locale>.messages.decoder.placeholder`                  | [Textos Decoder](/pt-br/blog/config-decoder/#text-messages)                                  |
| `i18n.locales.<locale>.messages.decoder.format`                       | [Textos Decoder](/pt-br/blog/config-decoder/#text-messages)                                  |
| `i18n.locales.<locale>.messages.decoder.auto`                         | [Textos Decoder](/pt-br/blog/config-decoder/#text-messages)                                  |
| `i18n.locales.<locale>.messages.decoder.decode`                       | [Textos Decoder](/pt-br/blog/config-decoder/#text-messages)                                  |
| `i18n.locales.<locale>.messages.decoder.clear`                        | [Textos Decoder](/pt-br/blog/config-decoder/#text-messages)                                  |
| `i18n.locales.<locale>.messages.decoder.copy`                         | [Textos Decoder](/pt-br/blog/config-decoder/#text-messages)                                  |
| `i18n.locales.<locale>.messages.decoder.reuse`                        | [Textos Decoder](/pt-br/blog/config-decoder/#text-messages)                                  |
| `i18n.locales.<locale>.messages.decoder.supported`                    | [Textos Decoder](/pt-br/blog/config-decoder/#text-messages)                                  |
| `i18n.locales.<locale>.messages.decoder.html`                         | [Textos Decoder](/pt-br/blog/config-decoder/#text-messages)                                  |
| `i18n.locales.<locale>.messages.decoder.unicode`                      | [Textos Decoder](/pt-br/blog/config-decoder/#text-messages)                                  |
| `i18n.locales.<locale>.messages.decoder.jwtWarning`                   | [Textos Decoder](/pt-br/blog/config-decoder/#text-messages)                                  |
| `i18n.locales.<locale>.messages.decoder.copied`                       | [Textos Decoder](/pt-br/blog/config-decoder/#text-messages)                                  |
| `i18n.locales.<locale>.messages.decoder.copyFailed`                   | [Textos Decoder](/pt-br/blog/config-decoder/#text-messages)                                  |
| `i18n.locales.<locale>.messages.decoder.output`                       | [Textos Decoder](/pt-br/blog/config-decoder/#text-messages)                                  |
| `i18n.locales.<locale>.messages.decoder.local`                        | [Textos Decoder](/pt-br/blog/config-decoder/#text-messages)                                  |
| `i18n.locales.<locale>.messages.decoder.ready`                        | [Textos Decoder](/pt-br/blog/config-decoder/#text-messages)                                  |
| `i18n.locales.<locale>.messages.decoder.running`                      | [Textos Decoder](/pt-br/blog/config-decoder/#text-messages)                                  |
| `i18n.locales.<locale>.messages.decoder.done`                         | [Textos Decoder](/pt-br/blog/config-decoder/#text-messages)                                  |
| `i18n.locales.<locale>.messages.decoder.empty`                        | [Textos Decoder](/pt-br/blog/config-decoder/#text-messages)                                  |
| `i18n.locales.<locale>.messages.decoder.tooLong`                      | [Textos Decoder](/pt-br/blog/config-decoder/#text-messages)                                  |
| `i18n.locales.<locale>.messages.decoder.invalid`                      | [Textos Decoder](/pt-br/blog/config-decoder/#text-messages)                                  |
| `i18n.locales.<locale>.messages.decoder.binary`                       | [Textos Decoder](/pt-br/blog/config-decoder/#text-messages)                                  |
| `i18n.locales.<locale>.messages.decoder.unknown`                      | [Textos Decoder](/pt-br/blog/config-decoder/#text-messages)                                  |
| `i18n.locales.<locale>.messages.decoder.ambiguous`                    | [Textos Decoder](/pt-br/blog/config-decoder/#text-messages)                                  |
| `i18n.locales.<locale>.messages.decoder.example`                      | [Textos Decoder](/pt-br/blog/config-decoder/#text-messages)                                  |
| `i18n.locales.<locale>.messages.decoderPage.description`              | [Textos Decoder](/pt-br/blog/config-decoder/#page-messages)                                  |
| `i18n.locales.<locale>.messages.decoderPage.fullTool`                 | [Textos Decoder](/pt-br/blog/config-decoder/#page-messages)                                  |
| `i18n.locales.<locale>.messages.decoderPage.task`                     | [Textos Decoder](/pt-br/blog/config-decoder/#page-messages)                                  |
| `i18n.locales.<locale>.messages.decoderPage.textTask`                 | [Textos Decoder](/pt-br/blog/config-decoder/#page-messages)                                  |
| `i18n.locales.<locale>.messages.decoderPage.callTask`                 | [Textos Decoder](/pt-br/blog/config-decoder/#page-messages)                                  |
| `i18n.locales.<locale>.messages.decoderPage.addressTask`              | [Textos Decoder](/pt-br/blog/config-decoder/#page-messages)                                  |
| `i18n.locales.<locale>.messages.decoderPage.addressHint`              | [Textos Decoder](/pt-br/blog/config-decoder/#page-messages)                                  |
| `i18n.locales.<locale>.messages.decoderPage.chain`                    | [Textos Decoder](/pt-br/blog/config-decoder/#page-messages)                                  |
| `i18n.locales.<locale>.messages.decoderPage.decimals`                 | [Textos Decoder](/pt-br/blog/config-decoder/#page-messages)                                  |
| `i18n.locales.<locale>.messages.decoderPage.precisionHint`            | [Textos Decoder](/pt-br/blog/config-decoder/#page-messages)                                  |
| `i18n.locales.<locale>.messages.decoderPage.network`                  | [Textos Decoder](/pt-br/blog/config-decoder/#page-messages)                                  |
| `i18n.locales.<locale>.messages.decoderPage.history`                  | [Textos Decoder](/pt-br/blog/config-decoder/#page-messages)                                  |
| `i18n.locales.<locale>.messages.decoderPage.back`                     | [Textos Decoder](/pt-br/blog/config-decoder/#page-messages)                                  |
| `i18n.locales.<locale>.messages.decoderPage.export`                   | [Textos Decoder](/pt-br/blog/config-decoder/#page-messages)                                  |
| `i18n.locales.<locale>.messages.decoderPage.limits`                   | [Textos Decoder](/pt-br/blog/config-decoder/#page-messages)                                  |
| `i18n.locales.<locale>.messages.decoderPage.callNotice`               | [Textos Decoder](/pt-br/blog/config-decoder/#page-messages)                                  |
| `i18n.locales.<locale>.messages.decoderPage.addressNotice`            | [Textos Decoder](/pt-br/blog/config-decoder/#page-messages)                                  |
| `i18n.locales.<locale>.messages.decoderPage.unsupported`              | [Textos Decoder](/pt-br/blog/config-decoder/#page-messages)                                  |
| `i18n.locales.<locale>.messages.decoderPage.checksum`                 | [Textos Decoder](/pt-br/blog/config-decoder/#page-messages)                                  |
| `i18n.locales.<locale>.messages.decoderPage.length`                   | [Textos Decoder](/pt-br/blog/config-decoder/#page-messages)                                  |
| `i18n.locales.<locale>.messages.decoderPage.wrongNetwork`             | [Textos Decoder](/pt-br/blog/config-decoder/#page-messages)                                  |
| `i18n.locales.<locale>.messages.decoderPage.stepLimit`                | [Textos Decoder](/pt-br/blog/config-decoder/#page-messages)                                  |
| `i18n.locales.<locale>.messages.decoderPage.budget`                   | [Textos Decoder](/pt-br/blog/config-decoder/#page-messages)                                  |
| `i18n.locales.<locale>.messages.decoderPage.addressParse`             | [Textos Decoder](/pt-br/blog/config-decoder/#page-messages)                                  |
| `i18n.locales.<locale>.messages.decoderPage.addressCheck`             | [Textos Decoder](/pt-br/blog/config-decoder/#page-messages)                                  |
| `i18n.locales.<locale>.messages.decoderPage.addressResult`            | [Textos Decoder](/pt-br/blog/config-decoder/#page-messages)                                  |
| `i18n.locales.<locale>.messages.decoderPage.callParse`                | [Textos Decoder](/pt-br/blog/config-decoder/#page-messages)                                  |
| `i18n.locales.<locale>.messages.decoderPage.rawOnly`                  | [Textos Decoder](/pt-br/blog/config-decoder/#page-messages)                                  |
| `i18n.locales.<locale>.messages.decoderPage.amountResult`             | [Textos Decoder](/pt-br/blog/config-decoder/#page-messages)                                  |
| `i18n.locales.<locale>.messages.decoderPage.inputHint`                | [Textos Decoder](/pt-br/blog/config-decoder/#page-messages)                                  |
| `i18n.locales.<locale>.messages.decoderPage.loadFailed`               | [Textos Decoder](/pt-br/blog/config-decoder/#page-messages)                                  |
| `i18n.locales.<locale>.messages.decoderPage.readings.tribute`         | [Leitura Decoder](/pt-br/blog/config-decoder/#readings)                                      |
| `i18n.locales.<locale>.messages.decoderPage.readings.links`           | [Leitura Decoder](/pt-br/blog/config-decoder/#readings)                                      |
| `i18n.locales.<locale>.messages.decoderPage.readings.links[].title`   | [Leitura Decoder](/pt-br/blog/config-decoder/#readings)                                      |
| `i18n.locales.<locale>.messages.decoderPage.readings.links[].href`    | [Leitura Decoder](/pt-br/blog/config-decoder/#readings)                                      |
| `i18n.locales.<locale>.messages.decoderPage.readings.links[].author`  | [Leitura Decoder](/pt-br/blog/config-decoder/#readings)                                      |
| `i18n.locales.<locale>.messages.decoderPage.readings.links[].year`    | [Leitura Decoder](/pt-br/blog/config-decoder/#readings)                                      |
| `i18n.locales.<locale>.messages.decoderPage.readings.links[].cover`   | [Leitura Decoder](/pt-br/blog/config-decoder/#readings)                                      |
| `theme.music.enabled`                                                 | [Player de música](/pt-br/blog/config-music/#enabled)                                        |
| `theme.music.tracks`                                                  | [Player de música](/pt-br/blog/config-music/#tracks)                                         |
| `theme.music.tracks[].title`                                          | [Player de música](/pt-br/blog/config-music/#track-fields)                                   |
| `theme.music.tracks[].artist`                                         | [Player de música](/pt-br/blog/config-music/#track-fields)                                   |
| `theme.music.tracks[].src`                                            | [Player de música](/pt-br/blog/config-music/#track-fields)                                   |
| `i18n.locales.<locale>.messages.music.label`                          | [Textos do player](/pt-br/blog/config-music/#music-messages)                                 |
| `i18n.locales.<locale>.messages.music.play`                           | [Textos do player](/pt-br/blog/config-music/#music-messages)                                 |
| `i18n.locales.<locale>.messages.music.pause`                          | [Textos do player](/pt-br/blog/config-music/#music-messages)                                 |
| `i18n.locales.<locale>.messages.music.prev`                           | [Textos do player](/pt-br/blog/config-music/#music-messages)                                 |
| `i18n.locales.<locale>.messages.music.next`                           | [Textos do player](/pt-br/blog/config-music/#music-messages)                                 |
| `i18n.locales.<locale>.messages.music.open`                           | [Textos do player](/pt-br/blog/config-music/#music-messages)                                 |
| `i18n.locales.<locale>.messages.music.close`                          | [Textos do player](/pt-br/blog/config-music/#music-messages)                                 |
| `i18n.locales.<locale>.messages.music.progress`                       | [Textos do player](/pt-br/blog/config-music/#music-messages)                                 |
| `i18n.locales.<locale>.messages.music.volume`                         | [Textos do player](/pt-br/blog/config-music/#music-messages)                                 |
| `i18n.locales.<locale>.messages.music.queue`                          | [Textos do player](/pt-br/blog/config-music/#music-messages)                                 |
| `i18n.locales.<locale>.messages.music.mute`                           | [Textos do player](/pt-br/blog/config-music/#music-messages)                                 |
| `i18n.locales.<locale>.messages.music.unmute`                         | [Textos do player](/pt-br/blog/config-music/#music-messages)                                 |
| `i18n.locales.<locale>.messages.music.idle`                           | [Textos do player](/pt-br/blog/config-music/#music-messages)                                 |
| `i18n.locales.<locale>.messages.music.loading`                        | [Textos do player](/pt-br/blog/config-music/#music-messages)                                 |
| `i18n.locales.<locale>.messages.music.playing`                        | [Textos do player](/pt-br/blog/config-music/#music-messages)                                 |
| `i18n.locales.<locale>.messages.music.paused`                         | [Textos do player](/pt-br/blog/config-music/#music-messages)                                 |
| `i18n.locales.<locale>.messages.music.blocked`                        | [Textos do player](/pt-br/blog/config-music/#music-messages)                                 |
| `i18n.locales.<locale>.messages.music.error`                          | [Textos do player](/pt-br/blog/config-music/#music-messages)                                 |
| `i18n.locales.<locale>.messages.music.noScript`                       | [Textos do player](/pt-br/blog/config-music/#music-messages)                                 |
| `theme.comments.shareAcrossLocales`                                   | [Comentários Giscus](/pt-br/blog/config-comments/#sharing)                                   |
| `theme.comments.mapping`                                              | [Comentários Giscus](/pt-br/blog/config-comments/#mapping)                                   |
| `theme.comments.term`                                                 | [Comentários Giscus](/pt-br/blog/config-comments/#mapping)                                   |
| `theme.comments.number`                                               | [Comentários Giscus](/pt-br/blog/config-comments/#mapping)                                   |
| `theme.comments.strict`                                               | [Comentários Giscus](/pt-br/blog/config-comments/#mapping)                                   |
| `theme.comments.reactionsEnabled`                                     | [Comentários Giscus](/pt-br/blog/config-comments/#appearance)                                |
| `theme.comments.emitMetadata`                                         | [Comentários Giscus](/pt-br/blog/config-comments/#appearance)                                |
| `theme.comments.inputPosition`                                        | [Comentários Giscus](/pt-br/blog/config-comments/#appearance)                                |
| `theme.comments.theme`                                                | [Comentários Giscus](/pt-br/blog/config-comments/#appearance)                                |
| `theme.comments.lang`                                                 | [Comentários Giscus](/pt-br/blog/config-comments/#appearance)                                |
| `theme.comments.loading`                                              | [Comentários Giscus](/pt-br/blog/config-comments/#appearance)                                |
| `theme.comments.crossorigin`                                          | [Comentários Giscus](/pt-br/blog/config-comments/#appearance)                                |
| `i18n.defaultLocale`                                                  | [Idiomas e fallback](/pt-br/blog/config-languages/#registry)                                 |
| `i18n.locales`                                                        | [Idiomas e fallback](/pt-br/blog/config-languages/#registry)                                 |
| `i18n.locales.<locale>`                                               | [Idiomas e fallback](/pt-br/blog/config-languages/#registry)                                 |
| `i18n.routing.defaultLocalePrefix`                                    | [Idiomas e fallback](/pt-br/blog/config-languages/#routing)                                  |
| `i18n.locales.<locale>.meta`                                          | [Idiomas e fallback](/pt-br/blog/config-languages/#meta)                                     |
| `i18n.locales.<locale>.meta.label`                                    | [Idiomas e fallback](/pt-br/blog/config-languages/#meta)                                     |
| `i18n.locales.<locale>.meta.hreflang`                                 | [Idiomas e fallback](/pt-br/blog/config-languages/#meta)                                     |
| `i18n.locales.<locale>.meta.ogLocale`                                 | [Idiomas e fallback](/pt-br/blog/config-languages/#meta)                                     |
| `i18n.locales.<locale>.meta.enabled`                                  | [Idiomas e fallback](/pt-br/blog/config-languages/#meta)                                     |
| `i18n.locales.<locale>.meta.fallback`                                 | [Idiomas e fallback](/pt-br/blog/config-languages/#fallback)                                 |
| `i18n.locales.<locale>.site`                                          | [Idiomas e fallback](/pt-br/blog/config-languages/#overrides)                                |
| `i18n.locales.<locale>.messages`                                      | [Idiomas e fallback](/pt-br/blog/config-languages/#overrides)                                |
| `i18n.locales.<locale>.about`                                         | [Idiomas e fallback](/pt-br/blog/config-languages/#overrides)                                |
| `i18n.locales.<locale>.messages.langLabel`                            | [Idiomas e fallback](/pt-br/blog/config-languages/#common-messages)                          |
| `i18n.locales.<locale>.aiReadableContent`                             | [GA4 e complementos de leitura por IA](/pt-br/blog/config-analytics-ai/#locale-supplement)   |
| `i18n.locales.<locale>.aiReadableContent.notes`                       | [GA4 e complementos de leitura por IA](/pt-br/blog/config-analytics-ai/#locale-supplement)   |
| `i18n.locales.<locale>.aiReadableContent.links`                       | [GA4 e complementos de leitura por IA](/pt-br/blog/config-analytics-ai/#locale-supplement)   |
| `i18n.locales.<locale>.aiReadableContent.links[].label`               | [GA4 e complementos de leitura por IA](/pt-br/blog/config-analytics-ai/#locale-supplement)   |
| `i18n.locales.<locale>.aiReadableContent.links[].href`                | [GA4 e complementos de leitura por IA](/pt-br/blog/config-analytics-ai/#locale-supplement)   |
| `i18n.locales.<locale>.messages.search.label`                         | [Textos de busca](/pt-br/blog/config-search/#messages)                                       |
| `i18n.locales.<locale>.messages.search.close`                         | [Textos de busca](/pt-br/blog/config-search/#messages)                                       |
| `i18n.locales.<locale>.messages.search.placeholder`                   | [Textos de busca](/pt-br/blog/config-search/#messages)                                       |
| `i18n.locales.<locale>.messages.search.hint`                          | [Textos de busca](/pt-br/blog/config-search/#messages)                                       |
| `i18n.locales.<locale>.messages.search.loading`                       | [Textos de busca](/pt-br/blog/config-search/#messages)                                       |
| `i18n.locales.<locale>.messages.search.empty`                         | [Textos de busca](/pt-br/blog/config-search/#messages)                                       |
| `i18n.locales.<locale>.messages.search.error`                         | [Textos de busca](/pt-br/blog/config-search/#messages)                                       |
| `i18n.locales.<locale>.messages.search.retry`                         | [Textos de busca](/pt-br/blog/config-search/#messages)                                       |
| `i18n.locales.<locale>.messages.search.more`                          | [Textos de busca](/pt-br/blog/config-search/#messages)                                       |
| `i18n.locales.<locale>.messages.search.results`                       | [Textos de busca](/pt-br/blog/config-search/#messages)                                       |
| `i18n.locales.<locale>.messages.search.dev`                           | [Textos de busca](/pt-br/blog/config-search/#messages)                                       |
| `analytics`                                                           | [GA4 e complementos de leitura por IA](/pt-br/blog/config-analytics-ai/#analytics)           |
| `analytics.googleAnalyticsId`                                         | [GA4 e complementos de leitura por IA](/pt-br/blog/config-analytics-ai/#analytics)           |
| `aiReadableContent`                                                   | [GA4 e complementos de leitura por IA](/pt-br/blog/config-analytics-ai/#supplement)          |
| `aiReadableContent.notes`                                             | [GA4 e complementos de leitura por IA](/pt-br/blog/config-analytics-ai/#supplement)          |
| `aiReadableContent.links`                                             | [GA4 e complementos de leitura por IA](/pt-br/blog/config-analytics-ai/#supplement)          |
| `aiReadableContent.links[].label`                                     | [GA4 e complementos de leitura por IA](/pt-br/blog/config-analytics-ai/#supplement)          |
| `aiReadableContent.links[].href`                                      | [GA4 e complementos de leitura por IA](/pt-br/blog/config-analytics-ai/#supplement)          |
| `site.title`                                                          | [Site e interface pública](/pt-br/blog/config-site-chrome/#identity)                         |
| `site.description`                                                    | [Site e interface pública](/pt-br/blog/config-site-chrome/#identity)                         |
| `site.url`                                                            | [Site e interface pública](/pt-br/blog/config-site-chrome/#identity)                         |
| `site.tagline`                                                        | [Site e interface pública](/pt-br/blog/config-site-chrome/#identity)                         |
| `social.links`                                                        | [Site e interface pública](/pt-br/blog/config-site-chrome/#social)                           |
| `social.links[].href`                                                 | [Site e interface pública](/pt-br/blog/config-site-chrome/#social-fields)                    |
| `social.links[].label`                                                | [Site e interface pública](/pt-br/blog/config-site-chrome/#social-fields)                    |
| `social.links[].rel`                                                  | [Site e interface pública](/pt-br/blog/config-site-chrome/#social-fields)                    |
| `social.links[].icon`                                                 | [Site e interface pública](/pt-br/blog/config-site-chrome/#social-fields)                    |
| `social.links[].iconSrc`                                              | [Site e interface pública](/pt-br/blog/config-site-chrome/#social-fields)                    |
| `theme.footer.links`                                                  | [Site e interface pública](/pt-br/blog/config-site-chrome/#footer)                           |
| `theme.footer.links[].label`                                          | [Site e interface pública](/pt-br/blog/config-site-chrome/#footer)                           |
| `theme.footer.links[].href`                                           | [Site e interface pública](/pt-br/blog/config-site-chrome/#footer)                           |
| `i18n.locales.<locale>.messages.nav.home`                             | [Site e interface pública](/pt-br/blog/config-site-chrome/#chrome-messages)                  |
| `i18n.locales.<locale>.messages.nav.blog`                             | [Site e interface pública](/pt-br/blog/config-site-chrome/#chrome-messages)                  |
| `i18n.locales.<locale>.messages.nav.status`                           | [Site e interface pública](/pt-br/blog/config-site-chrome/#chrome-messages)                  |
| `i18n.locales.<locale>.messages.nav.statusAria`                       | [Site e interface pública](/pt-br/blog/config-site-chrome/#chrome-messages)                  |
| `i18n.locales.<locale>.messages.footer.theme`                         | [Site e interface pública](/pt-br/blog/config-site-chrome/#chrome-messages)                  |
| `i18n.locales.<locale>.messages.footer.builtWith`                     | [Site e interface pública](/pt-br/blog/config-site-chrome/#chrome-messages)                  |
| `i18n.locales.<locale>.messages.terminal.commandInput`                | [Textos de terminal](/pt-br/blog/config-terminal/#messages)                                  |
| `i18n.locales.<locale>.messages.terminal.hint`                        | [Textos de terminal](/pt-br/blog/config-terminal/#messages)                                  |
| `i18n.locales.<locale>.messages.terminal.help`                        | [Textos de terminal](/pt-br/blog/config-terminal/#messages)                                  |
| `i18n.locales.<locale>.messages.terminal.syntax`                      | [Textos de terminal](/pt-br/blog/config-terminal/#messages)                                  |
| `i18n.locales.<locale>.messages.terminal.usage`                       | [Textos de terminal](/pt-br/blog/config-terminal/#messages)                                  |
| `i18n.locales.<locale>.messages.terminal.unknown`                     | [Textos de terminal](/pt-br/blog/config-terminal/#messages)                                  |
| `i18n.locales.<locale>.messages.terminal.notFound`                    | [Textos de terminal](/pt-br/blog/config-terminal/#messages)                                  |
| `i18n.locales.<locale>.messages.terminal.notDirectory`                | [Textos de terminal](/pt-br/blog/config-terminal/#messages)                                  |
| `i18n.locales.<locale>.messages.terminal.isDirectory`                 | [Textos de terminal](/pt-br/blog/config-terminal/#messages)                                  |
| `i18n.locales.<locale>.messages.terminal.failed`                      | [Textos de terminal](/pt-br/blog/config-terminal/#messages)                                  |
| `i18n.locales.<locale>.messages.terminal.tooLarge`                    | [Textos de terminal](/pt-br/blog/config-terminal/#messages)                                  |
| `i18n.locales.<locale>.messages.terminal.empty`                       | [Textos de terminal](/pt-br/blog/config-terminal/#messages)                                  |
| `i18n.locales.<locale>.messages.terminal.loading`                     | [Textos de terminal](/pt-br/blog/config-terminal/#messages)                                  |
| `i18n.locales.<locale>.messages.terminal.readerTitle`                 | [Textos de terminal não usados atualmente](/pt-br/blog/config-terminal/#messages)            |
| `i18n.locales.<locale>.messages.terminal.readerHint`                  | [Textos de terminal](/pt-br/blog/config-terminal/#messages)                                  |
| `i18n.locales.<locale>.messages.terminal.readerCommand`               | [Textos de terminal](/pt-br/blog/config-terminal/#messages)                                  |

## Consultar campos de publicações separadamente

Frontmatter não entra na tabela de site.config acima. Veja [conteúdo, datas e imagens](/pt-br/blog/config-article/#frontmatter), [estatísticas e estado OUTPUT](/pt-br/blog/config-article/#output-fields) e [compatibilidade e campos não usados](/pt-br/blog/config-article/#legacy-frontmatter).

Os três campos de fragments ficam em [campos de conteúdo](/pt-br/blog/config-fragments/#content-fields), sem misturar com os de publicações.

A inclusão individual na busca está no [campo search](/pt-br/blog/config-search/#article-search). Não é site.config nem controle de privacidade.

## Como ler as explicações

Cada dicionário fornece caminho completo, tipo, padrão do tema, efeito real, limites, condições e exemplo. Um campo aceito pelo tipo mas sem código consumidor não deve ser apresentado como recurso ativo.

| Estado                      | Significado                                                                                            |
| --------------------------- | ------------------------------------------------------------------------------------------------------ |
| Ativo                       | A implementação atual tem efeito correspondente                                                        |
| Condicional                 | Exige recurso ativo, condições da página ou ausência de substituição de maior prioridade               |
| Não usado atualmente        | O tipo aceita, mas o código atual não consome para esse efeito. Não preencha esperando mudar a página  |
| Mantido por compatibilidade | Tem finalidade de compatibilidade explícita; cada campo explica o que preserva e se aparece atualmente |

Os padrões vêm da configuração do pacote ou textos integrados. O starter pode substituí-los e o demo tem configurações pessoais. Autor, título e playlist do demo não são padrões de todo novo blog.

Padrões de idioma dependem do idioma e fallback. O dicionário identifica valores não definidos, textos integrados atuais ou valores específicos. Exemplos só em chinês simplificado/inglês são explicitados, sem fingir que são fixos para todos os idiomas.

## Onde escrever e como mesclar?

Mescle os trechos ao `defineThemeConfig({...})` existente em `src/site.config.ts`. Preserve import, export e configurações pessoais; não duplique theme ou i18n no mesmo objeto.

Objetos mesclam recursivamente, campos omitidos mantêm padrões, arrays substituem tudo e undefined é ignorado. String vazia, array vazio e false dependem do campo, sem regra universal de restaurar padrão. Por exemplo, hero vazio limpa explicitamente, mas homeTitle em branco continua o fallback.

Confira a página correspondente em dev após alterar. Substituições de ambiente exigem reiniciar o servidor. Produção precisa ser recompilada e publicada; salvar configuração local não muda o site online.

Frontmatter, configuração Astro e variáveis de ambiente ficam em lugares diferentes. O dicionário explica suas relações, sem chamá-los de campos site.config. Veja instalação e atualização no [primeiro tutorial](/pt-br/blog/starter-guide-1-configure-your-site/) e validação local/implantação no [guia de publicação](/pt-br/blog/starter-guide-deployment/).
