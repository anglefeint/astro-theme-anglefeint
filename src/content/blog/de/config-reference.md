---
tags: ['anglefeint', 'config']
title: 'Konfigurationslexikon: Wo ändere ich was?'
subtitle: 'Einstieg nach Seite, Funktion und vollständigem Pfad'
description: 'Verzeichnis aller Konfigurationsmodule, vollständiger Pfade, Feldstatus und Regeln zum Zusammenführen.'
pubDate: '2026-11-13'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/hacker-01.webp'
---

**Versionshinweis:** Dieses Lexikon folgt dem aktuellen Code. Live-Anpassung an reduzierte Bewegung, strenge `blogPageSize`-Prüfung und Bildisolierung bei deaktivierten Fragments erfordern mindestens 0.36.1; sie fehlen in 0.36.0. Standardinstallation und CLI bleiben gleich.

Wenn du bereits weißt, was du erreichen möchtest, beginne mit den Anleitungen. Wenn du Bedeutung, Standardwert oder Grenzen eines Felds suchst, nutze dieses Konfigurationslexikon. Beide richten sich nach dem aktuellen Theme-Code; du musst vorher keine Repository-Dokumentation lesen.

Beginne beim ersten Einsatz mit dem [Einstieg in die acht Anleitungen](/de/blog/starter-guide-1-configure-your-site/#tutorial-order): installieren → Beiträge schreiben → Bilder hinzufügen → Fragments veröffentlichen → Seiten und Funktionen anpassen → Kommentare → Mehrsprachigkeit → Bereitstellung. Du musst nicht jede optionale Funktion aktivieren. Das Lexikon dient zum Nachschlagen einzelner Felder; die vollständige Pfadtabelle musst du nicht am Stück lesen.

Verfügbar sind [Startseite](/de/blog/config-home/), [Blog List und Tag-Listen](/de/blog/config-blog-list/), [Beitragsansicht](/de/blog/config-article/), [Fragments](/de/blog/config-fragments/), [About](/de/blog/config-about/), [Decoder](/de/blog/config-decoder/), [Musikplayer](/de/blog/config-music/), [Giscus-Kommentare](/de/blog/config-comments/), [Sprachen und Fallback](/de/blog/config-languages/), [Suche und Inhaltsentdeckung](/de/blog/config-search/), [GA4 und Ergänzungen für KI-Leser](/de/blog/config-analytics-ai/), [Website und gemeinsame Oberfläche](/de/blog/config-site-chrome/) sowie [Terminal](/de/blog/config-terminal/).

## Nach Seite oder Funktion suchen

| Ich möchte ändern                                                                      | Konfigurationslexikon                                             | Schrittweise Anleitung                                                                                                                                                 |
| -------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Startseitentitel, Einleitung, neue Beiträge, Startmeldungen, Terminaltext und Übergang | [Startseite](/de/blog/config-home/)                               | [Seiten und Funktionen anpassen](/de/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                                           |
| Website-Name, Domain, gemeinsame Navigation, soziale Links und Fußzeile                | [Website und gemeinsame Oberfläche](/de/blog/config-site-chrome/) | [Installation und Website-Informationen](/de/blog/starter-guide-1-configure-your-site/), [Seiten anpassen](/de/blog/starter-guide-3-comments-about-and-theme-toggles/) |
| Blog List, Tag-Listen und Paginierung                                                  | [Listen](/de/blog/config-blog-list/)                              | [Listen und Paginierung](/de/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                                                   |
| Beitragsansicht, Inhaltsverzeichnis, Mathematik und Leseeffekte                        | [Beiträge](/de/blog/config-article/)                              | [Den ersten Beitrag schreiben](/de/blog/starter-guide-2-languages-and-routing/)                                                                                        |
| Fragments-Liste und Vorschau                                                           | [Fragments](/de/blog/config-fragments/)                           | [Ein Fragment veröffentlichen](/de/blog/starter-guide-5-fragments/)                                                                                                    |
| About-Inhalt, Kontakt, Seitenleiste und Werkzeuge                                      | [About](/de/blog/config-about/)                                   | [Seiten und Funktionen anpassen](/de/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                                           |
| About-Terminal, Befehlsmeldungen und schreibgeschützter Leser                          | [Terminal](/de/blog/config-terminal/)                             | [Seiten und Funktionen anpassen](/de/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                                           |
| Decoder-Seite und Lesekarten                                                           | [Decoder](/de/blog/config-decoder/)                               | [Seiten und Funktionen anpassen](/de/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                                           |
| Musikplayer                                                                            | [Musikplayer](/de/blog/config-music/)                             | [Musik einrichten](/de/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                                                         |
| Giscus-Kommentare und gemeinsame Diskussionen zwischen Sprachen                        | [Giscus-Kommentare](/de/blog/config-comments/)                    | [Lesern Kommentare ermöglichen](/de/blog/starter-guide-4-giscus-comments/)                                                                                             |
| Sprachen aktivieren, Adressen, Oberflächentexte und Fallback                           | [Sprachen](/de/blog/config-languages/)                            | [Mehrsprachigkeit](/de/blog/starter-guide-languages/)                                                                                                                  |
| Suche und Inhaltsentdeckung                                                            | [Suche](/de/blog/config-search/)                                  | [Beiträge schreiben](/de/blog/starter-guide-2-languages-and-routing/), [Bereitstellung](/de/blog/starter-guide-deployment/)                                            |
| GA4-Zugriffsstatistik und öffentliche Ergänzungen für KI-Leser                         | [GA4 und KI-Ergänzungen](/de/blog/config-analytics-ai/)           | [Auf der eigenen Domain veröffentlichen](/de/blog/starter-guide-deployment/)                                                                                           |

Jedes Feld hat einen primären Erklärungsort; andere Module verlinken dorthin. Die Startseite verwendet zum Beispiel den Fragments-Schalter, der aber auch die vollständige Liste betrifft und kein reines Startseitenfeld ist.

## Nach vollständigem Konfigurationspfad suchen

Der folgende Index folgt den öffentlichen Konfigurationstypen und enthält auch derzeit ungenutzte Felder. Links führen zur primären Erklärung; Unterschiede zwischen Seiten werden in den jeweiligen Modulen verknüpft. `<Sprachcode>` ist ein Platzhalter für tatsächliche Codes wie zh oder en. Beitrags-Frontmatter wird getrennt aufgeführt und nicht mit site.config-Pfaden vermischt.

| Vollständiger Pfad                                                        | Nachschlagen                                                                              |
| ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `i18n.locales.<Sprachcode>.site.homeTitle`                                | [Großer Startseitentitel](/de/blog/config-home/#home-title)                               |
| `i18n.locales.<Sprachcode>.site.hero`                                     | [Sichtbare Startseiteneinleitung](/de/blog/config-home/#home-hero)                        |
| `i18n.locales.<Sprachcode>.messages.siteDescription`                      | [Metabeschreibung der Startseite](/de/blog/config-home/#home-description)                 |
| `theme.homeLatestCount`                                                   | [Anzahl neuer Beiträge](/de/blog/config-home/#latest-count)                               |
| `theme.home.showInitialize`                                               | [Startmeldungen aktivieren](/de/blog/config-home/#startup-switches)                       |
| `theme.home.showFollow`                                                   | [Startmeldungen aktivieren](/de/blog/config-home/#startup-switches)                       |
| `theme.home.showTrace`                                                    | [Startmeldungen aktivieren](/de/blog/config-home/#startup-switches)                       |
| `theme.effects.enableHomePassage`                                         | [Übergang beim Klicken](/de/blog/config-home/#home-passage)                               |
| `i18n.locales.<Sprachcode>.messages.home.latest`                          | [Texte der Startseite](/de/blog/config-home/#home-messages)                               |
| `i18n.locales.<Sprachcode>.messages.home.viewAll`                         | [Texte der Startseite](/de/blog/config-home/#home-messages)                               |
| `i18n.locales.<Sprachcode>.messages.home.noPosts`                         | [Texte der Startseite](/de/blog/config-home/#home-messages)                               |
| `i18n.locales.<Sprachcode>.messages.home.openDoor`                        | [Texte der Startseite](/de/blog/config-home/#home-messages)                               |
| `i18n.locales.<Sprachcode>.messages.home.transmission`                    | [Terminaltext auf breiten Bildschirmen](/de/blog/config-home/#home-transmission)          |
| `i18n.locales.<Sprachcode>.messages.home.hero`                            | [Ersatztext der Einleitung](/de/blog/config-home/#message-hero)                           |
| `theme.fragments.enabled`                                                 | [Fragments aktivieren](/de/blog/config-fragments/#enabled)                                |
| `i18n.locales.<Sprachcode>.messages.blog.allPosts`                        | [Gemeinsamer Einstieg für Beiträge und Tags](/de/blog/config-blog-list/#tag-messages)     |
| `i18n.locales.<Sprachcode>.messages.fragments.title`                      | [Fragments-Texte](/de/blog/config-fragments/#fragment-messages)                           |
| `i18n.locales.<Sprachcode>.messages.fragments.close`                      | [Fragments-Texte](/de/blog/config-fragments/#fragment-messages)                           |
| `i18n.locales.<Sprachcode>.messages.siteTitle`                            | [Derzeit ungenutztes Titelfeld](/de/blog/config-site-chrome/#legacy-site-title)           |
| `theme.blogPageSize`                                                      | [Beiträge pro Seite](/de/blog/config-blog-list/#page-size)                                |
| `theme.tags.enabled`                                                      | [Tags aktivieren](/de/blog/config-blog-list/#tags-enabled)                                |
| `theme.pagination.windowSize`                                             | [Seitennummernfenster](/de/blog/config-blog-list/#pagination-window)                      |
| `theme.pagination.showJumpThreshold`                                      | [Schwelle für Seitensprung](/de/blog/config-blog-list/#jump-threshold)                    |
| `theme.pagination.jump.enabled`                                           | [Seitensprung aktivieren](/de/blog/config-blog-list/#jump-enabled)                        |
| `theme.pagination.jump.enterToGo`                                         | [Seitensprung mit Enter](/de/blog/config-blog-list/#jump-enter)                           |
| `theme.pagination.style.enabled`                                          | [Paginierungsstile aktivieren](/de/blog/config-blog-list/#style-enabled)                  |
| `theme.pagination.style.mode`                                             | [Variantenstrategie](/de/blog/config-blog-list/#style-mode)                               |
| `theme.pagination.style.variants`                                         | [Anzahl der Varianten](/de/blog/config-blog-list/#style-variants)                         |
| `theme.pagination.style.fixedVariant`                                     | [Feste Variante](/de/blog/config-blog-list/#style-fixed)                                  |
| `i18n.locales.<Sprachcode>.messages.blog.title`                           | [Listentitel und Beschreibung](/de/blog/config-blog-list/#archive-messages)               |
| `i18n.locales.<Sprachcode>.messages.blog.pageTitle`                       | [Listentitel und Beschreibung](/de/blog/config-blog-list/#archive-messages)               |
| `i18n.locales.<Sprachcode>.messages.blog.archiveDescription`              | [Listentitel und Beschreibung](/de/blog/config-blog-list/#archive-messages)               |
| `i18n.locales.<Sprachcode>.messages.blog.pageDescription`                 | [Listentitel und Beschreibung](/de/blog/config-blog-list/#archive-messages)               |
| `i18n.locales.<Sprachcode>.messages.blog.previous`                        | [Paginierungstexte](/de/blog/config-blog-list/#pagination-messages)                       |
| `i18n.locales.<Sprachcode>.messages.blog.next`                            | [Paginierungstexte](/de/blog/config-blog-list/#pagination-messages)                       |
| `i18n.locales.<Sprachcode>.messages.blog.paginationAria`                  | [Paginierungstexte](/de/blog/config-blog-list/#pagination-messages)                       |
| `i18n.locales.<Sprachcode>.messages.blog.jumpTo`                          | [Paginierungstexte](/de/blog/config-blog-list/#pagination-messages)                       |
| `i18n.locales.<Sprachcode>.messages.blog.jumpInputLabel`                  | [Paginierungstexte](/de/blog/config-blog-list/#pagination-messages)                       |
| `i18n.locales.<Sprachcode>.messages.blog.jumpGo`                          | [Paginierungstexte](/de/blog/config-blog-list/#pagination-messages)                       |
| `i18n.locales.<Sprachcode>.messages.blog.tags`                            | [Tag-Texte](/de/blog/config-blog-list/#tag-messages)                                      |
| `i18n.locales.<Sprachcode>.messages.blog.noTags`                          | [Tag-Texte](/de/blog/config-blog-list/#tag-messages)                                      |
| `i18n.locales.<Sprachcode>.messages.blog.taggedPosts`                     | [Tag-Texte](/de/blog/config-blog-list/#tag-messages)                                      |
| `theme.toc.enabled`                                                       | [Beitragsfunktionen](/de/blog/config-article/#feature-switches)                           |
| `theme.math.enabled`                                                      | [Beitragsfunktionen](/de/blog/config-article/#feature-switches)                           |
| `theme.effects.enableRedQueen`                                            | [Beitragsfunktionen](/de/blog/config-article/#feature-switches)                           |
| `theme.search.enabled`                                                    | [Website-Suche aktivieren](/de/blog/config-search/#enabled)                               |
| `theme.socialImage.enabled`                                               | [Beitragsfunktionen](/de/blog/config-article/#feature-switches)                           |
| `site.author`                                                             | [Website und gemeinsame Oberfläche](/de/blog/config-site-chrome/#identity)                |
| `site.ogImage`                                                            | [Website und gemeinsame Oberfläche](/de/blog/config-site-chrome/#identity)                |
| `theme.enableAboutPage`                                                   | [About-Seite aktivieren](/de/blog/config-about/#page-enabled)                             |
| `theme.footer.showCredits`                                                | [Website und gemeinsame Oberfläche](/de/blog/config-site-chrome/#footer)                  |
| `theme.comments.enabled`                                                  | [Giscus-Kommentare](/de/blog/config-comments/#controls)                                   |
| `i18n.locales.<Sprachcode>.messages.blog.rqBadge`                         | [Texte der Beitragsansicht](/de/blog/config-article/#article-messages)                    |
| `i18n.locales.<Sprachcode>.messages.blog.rqReplayAria`                    | [Texte der Beitragsansicht](/de/blog/config-article/#article-messages)                    |
| `i18n.locales.<Sprachcode>.messages.blog.backToTop`                       | [Texte der Beitragsansicht](/de/blog/config-article/#article-messages)                    |
| `i18n.locales.<Sprachcode>.messages.blog.toastP10`                        | [Texte der Beitragsansicht](/de/blog/config-article/#article-messages)                    |
| `i18n.locales.<Sprachcode>.messages.blog.toastP30`                        | [Texte der Beitragsansicht](/de/blog/config-article/#article-messages)                    |
| `i18n.locales.<Sprachcode>.messages.blog.toastP60`                        | [Texte der Beitragsansicht](/de/blog/config-article/#article-messages)                    |
| `i18n.locales.<Sprachcode>.messages.blog.toastDone`                       | [Texte der Beitragsansicht](/de/blog/config-article/#article-messages)                    |
| `i18n.locales.<Sprachcode>.messages.blog.metaPublished`                   | [Texte der Beitragsansicht](/de/blog/config-article/#article-messages)                    |
| `i18n.locales.<Sprachcode>.messages.blog.metaAuthor`                      | [Texte der Beitragsansicht](/de/blog/config-article/#article-messages)                    |
| `i18n.locales.<Sprachcode>.messages.blog.metaUpdated`                     | [Texte der Beitragsansicht](/de/blog/config-article/#article-messages)                    |
| `i18n.locales.<Sprachcode>.messages.blog.systemStatusAria`                | [Texte der Beitragsansicht](/de/blog/config-article/#article-messages)                    |
| `i18n.locales.<Sprachcode>.messages.blog.systemModelLabel`                | [Texte der Beitragsansicht](/de/blog/config-article/#article-messages)                    |
| `i18n.locales.<Sprachcode>.messages.blog.systemModeLabel`                 | [Texte der Beitragsansicht](/de/blog/config-article/#article-messages)                    |
| `i18n.locales.<Sprachcode>.messages.blog.systemStateLabel`                | [Texte der Beitragsansicht](/de/blog/config-article/#article-messages)                    |
| `i18n.locales.<Sprachcode>.messages.blog.promptContextLabel`              | [Texte der Beitragsansicht](/de/blog/config-article/#article-messages)                    |
| `i18n.locales.<Sprachcode>.messages.blog.heroMonitor`                     | [Texte der Beitragsansicht](/de/blog/config-article/#article-messages)                    |
| `i18n.locales.<Sprachcode>.messages.blog.heroSignalSync`                  | [Texte der Beitragsansicht](/de/blog/config-article/#article-messages)                    |
| `i18n.locales.<Sprachcode>.messages.blog.heroModelOnline`                 | [Texte der Beitragsansicht](/de/blog/config-article/#article-messages)                    |
| `i18n.locales.<Sprachcode>.messages.blog.toc`                             | [Texte der Beitragsansicht](/de/blog/config-article/#article-messages)                    |
| `i18n.locales.<Sprachcode>.messages.blog.responseOutput`                  | [Texte der Beitragsansicht](/de/blog/config-article/#article-messages)                    |
| `i18n.locales.<Sprachcode>.messages.blog.statsWords`                      | [Texte der Beitragsansicht](/de/blog/config-article/#article-messages)                    |
| `i18n.locales.<Sprachcode>.messages.blog.statsTokens`                     | [Texte der Beitragsansicht](/de/blog/config-article/#article-messages)                    |
| `i18n.locales.<Sprachcode>.messages.blog.copySectionLink`                 | [Texte der Beitragsansicht](/de/blog/config-article/#article-messages)                    |
| `i18n.locales.<Sprachcode>.messages.blog.regenerate`                      | [Texte der Beitragsansicht](/de/blog/config-article/#article-messages)                    |
| `i18n.locales.<Sprachcode>.messages.blog.relatedAria`                     | [Texte der Beitragsansicht](/de/blog/config-article/#article-messages)                    |
| `i18n.locales.<Sprachcode>.messages.blog.related`                         | [Texte der Beitragsansicht](/de/blog/config-article/#article-messages)                    |
| `i18n.locales.<Sprachcode>.messages.blog.backToBlogAria`                  | [Texte der Beitragsansicht](/de/blog/config-article/#article-messages)                    |
| `i18n.locales.<Sprachcode>.messages.blog.backToBlog`                      | [Texte der Beitragsansicht](/de/blog/config-article/#article-messages)                    |
| `i18n.locales.<Sprachcode>.messages.blog.comments`                        | [Texte der Beitragsansicht](/de/blog/config-article/#article-messages)                    |
| `i18n.locales.<Sprachcode>.messages.blog.metaReadMinutes`                 | [Texte der Beitragsansicht, derzeit ungenutzt](/de/blog/config-article/#article-messages) |
| `i18n.locales.<Sprachcode>.messages.blog.latencyLabel`                    | [Texte der Beitragsansicht, derzeit ungenutzt](/de/blog/config-article/#article-messages) |
| `i18n.locales.<Sprachcode>.messages.blog.confidenceLabel`                 | [Texte der Beitragsansicht, derzeit ungenutzt](/de/blog/config-article/#article-messages) |
| `i18n.locales.<Sprachcode>.messages.codeCopy.copy`                        | [Texte für Leseinteraktionen](/de/blog/config-article/#interaction-messages)              |
| `i18n.locales.<Sprachcode>.messages.codeCopy.copied`                      | [Texte für Leseinteraktionen](/de/blog/config-article/#interaction-messages)              |
| `i18n.locales.<Sprachcode>.messages.codeCopy.failed`                      | [Texte für Leseinteraktionen](/de/blog/config-article/#interaction-messages)              |
| `i18n.locales.<Sprachcode>.messages.imagePreview.open`                    | [Texte für Leseinteraktionen](/de/blog/config-article/#interaction-messages)              |
| `i18n.locales.<Sprachcode>.messages.imagePreview.close`                   | [Texte für Leseinteraktionen](/de/blog/config-article/#interaction-messages)              |
| `theme.fragments.pageSize`                                                | [Fragments pro Seite](/de/blog/config-fragments/#page-size)                               |
| `theme.fragments.comments.enabled`                                        | [Fragments-Kommentare](/de/blog/config-fragments/#comments-enabled)                       |
| `i18n.locales.<Sprachcode>.messages.fragments.description`                | [Fragments-Texte](/de/blog/config-fragments/#fragment-messages)                           |
| `i18n.locales.<Sprachcode>.messages.fragments.empty`                      | [Fragments-Texte](/de/blog/config-fragments/#fragment-messages)                           |
| `i18n.locales.<Sprachcode>.messages.fragments.comments`                   | [Fragments-Texte](/de/blog/config-fragments/#fragment-messages)                           |
| `i18n.locales.<Sprachcode>.messages.fragments.previous`                   | [Fragments-Texte, derzeit ungenutzt](/de/blog/config-fragments/#fragment-messages)        |
| `i18n.locales.<Sprachcode>.messages.fragments.next`                       | [Fragments-Texte, derzeit ungenutzt](/de/blog/config-fragments/#fragment-messages)        |
| `i18n.locales.<Sprachcode>.messages.fragments.loading`                    | [Fragments-Texte](/de/blog/config-fragments/#fragment-messages)                           |
| `i18n.locales.<Sprachcode>.messages.fragments.error`                      | [Fragments-Texte](/de/blog/config-fragments/#fragment-messages)                           |
| `i18n.locales.<Sprachcode>.messages.fragments.retry`                      | [Fragments-Texte](/de/blog/config-fragments/#fragment-messages)                           |
| `i18n.locales.<Sprachcode>.messages.fragments.copyLink`                   | [Fragments-Texte](/de/blog/config-fragments/#fragment-messages)                           |
| `i18n.locales.<Sprachcode>.messages.fragments.linkCopied`                 | [Fragments-Texte](/de/blog/config-fragments/#fragment-messages)                           |
| `i18n.locales.<Sprachcode>.messages.fragments.copyLinkFailed`             | [Fragments-Texte](/de/blog/config-fragments/#fragment-messages)                           |
| `i18n.locales.<Sprachcode>.messages.fragments.notFound`                   | [Fragments-Texte](/de/blog/config-fragments/#fragment-messages)                           |
| `i18n.locales.<Sprachcode>.messages.fragments.indexError`                 | [Fragments-Texte](/de/blog/config-fragments/#fragment-messages)                           |
| `theme.comments.repo`                                                     | [Giscus-Kommentare](/de/blog/config-comments/#connection)                                 |
| `theme.comments.repoId`                                                   | [Giscus-Kommentare](/de/blog/config-comments/#connection)                                 |
| `theme.comments.category`                                                 | [Giscus-Kommentare](/de/blog/config-comments/#connection)                                 |
| `theme.comments.categoryId`                                               | [Giscus-Kommentare](/de/blog/config-comments/#connection)                                 |
| `i18n.locales.<Sprachcode>.about.metaLine`                                | [About-Inhalt](/de/blog/config-about/#body-fields)                                        |
| `i18n.locales.<Sprachcode>.about.sections.who`                            | [About-Inhalt](/de/blog/config-about/#body-fields)                                        |
| `i18n.locales.<Sprachcode>.about.sections.what`                           | [About-Inhalt](/de/blog/config-about/#body-fields)                                        |
| `i18n.locales.<Sprachcode>.about.sections.ethos`                          | [About-Inhalt](/de/blog/config-about/#body-fields)                                        |
| `i18n.locales.<Sprachcode>.about.sections.now`                            | [About-Inhalt](/de/blog/config-about/#body-fields)                                        |
| `i18n.locales.<Sprachcode>.about.sections.contactLead`                    | [About-Inhalt](/de/blog/config-about/#body-fields)                                        |
| `i18n.locales.<Sprachcode>.about.sections.signature`                      | [About-Inhalt](/de/blog/config-about/#body-fields)                                        |
| `i18n.locales.<Sprachcode>.about.contact.email`                           | [About-Kontakt](/de/blog/config-about/#contact-fields)                                    |
| `i18n.locales.<Sprachcode>.about.contact.githubUrl`                       | [About-Kontakt](/de/blog/config-about/#contact-fields)                                    |
| `i18n.locales.<Sprachcode>.about.contact.githubLabel`                     | [About-Kontakt](/de/blog/config-about/#contact-fields)                                    |
| `i18n.locales.<Sprachcode>.about.sidebar.dlData`                          | [About-Werkzeugeinstiege](/de/blog/config-about/#tool-fields)                             |
| `i18n.locales.<Sprachcode>.about.sidebar.ai`                              | [About-Werkzeugeinstiege](/de/blog/config-about/#tool-fields)                             |
| `i18n.locales.<Sprachcode>.about.sidebar.decryptor`                       | [About-Werkzeugeinstiege](/de/blog/config-about/#tool-fields)                             |
| `i18n.locales.<Sprachcode>.about.sidebar.help`                            | [About-Werkzeugeinstiege](/de/blog/config-about/#tool-fields)                             |
| `i18n.locales.<Sprachcode>.about.sidebar.allScripts`                      | [About-Werkzeugeinstiege](/de/blog/config-about/#tool-fields)                             |
| `i18n.locales.<Sprachcode>.about.scriptsPath`                             | [About-Werkzeugeinstiege](/de/blog/config-about/#tool-fields)                             |
| `i18n.locales.<Sprachcode>.about.labels.modalOutput`                      | [Allgemeine About-Texte: Status beachten](/de/blog/config-about/#label-fields)            |
| `i18n.locales.<Sprachcode>.about.labels.modalClose`                       | [Allgemeine About-Texte](/de/blog/config-about/#label-fields)                             |
| `i18n.locales.<Sprachcode>.about.labels.responseOutput`                   | [Allgemeine About-Texte](/de/blog/config-about/#label-fields)                             |
| `i18n.locales.<Sprachcode>.about.labels.contactEmailLead`                 | [Allgemeine About-Texte](/de/blog/config-about/#label-fields)                             |
| `i18n.locales.<Sprachcode>.about.labels.contactConnectLead`               | [Allgemeine About-Texte](/de/blog/config-about/#label-fields)                             |
| `i18n.locales.<Sprachcode>.about.labels.backToTop`                        | [Allgemeine About-Texte](/de/blog/config-about/#label-fields)                             |
| `i18n.locales.<Sprachcode>.about.labels.quickAccess`                      | [Allgemeine About-Texte](/de/blog/config-about/#label-fields)                             |
| `i18n.locales.<Sprachcode>.about.labels.contactEmailLabel`                | [Allgemeine About-Texte](/de/blog/config-about/#label-fields)                             |
| `i18n.locales.<Sprachcode>.about.modals.dlData.title`                     | [About-Werkzeugfenster](/de/blog/config-about/#modal-fields)                              |
| `i18n.locales.<Sprachcode>.about.modals.dlData.subtitle`                  | [About-Werkzeugfenster](/de/blog/config-about/#modal-fields)                              |
| `i18n.locales.<Sprachcode>.about.modals.ai.title`                         | [About-Werkzeugfenster](/de/blog/config-about/#modal-fields)                              |
| `i18n.locales.<Sprachcode>.about.modals.ai.lines`                         | [About-Werkzeugfenster](/de/blog/config-about/#modal-fields)                              |
| `i18n.locales.<Sprachcode>.about.modals.decryptor.title`                  | [About-Werkzeugfenster](/de/blog/config-about/#modal-fields)                              |
| `i18n.locales.<Sprachcode>.about.modals.decryptor.header`                 | [About-Werkzeugfenster: Status beachten](/de/blog/config-about/#modal-fields)             |
| `i18n.locales.<Sprachcode>.about.modals.decryptor.keysLabel`              | [About-Werkzeugfenster: Status beachten](/de/blog/config-about/#modal-fields)             |
| `i18n.locales.<Sprachcode>.about.modals.decryptor.currentPassphraseLabel` | [About-Werkzeugfenster: Status beachten](/de/blog/config-about/#modal-fields)             |
| `i18n.locales.<Sprachcode>.about.modals.decryptor.masterKeyLabel`         | [About-Werkzeugfenster: Status beachten](/de/blog/config-about/#modal-fields)             |
| `i18n.locales.<Sprachcode>.about.modals.decryptor.transientKeyLabel`      | [About-Werkzeugfenster: Status beachten](/de/blog/config-about/#modal-fields)             |
| `i18n.locales.<Sprachcode>.about.modals.help.title`                       | [About-Werkzeugfenster](/de/blog/config-about/#modal-fields)                              |
| `i18n.locales.<Sprachcode>.about.modals.help.statsLabel`                  | [About-Werkzeugfenster](/de/blog/config-about/#modal-fields)                              |
| `i18n.locales.<Sprachcode>.about.modals.help.typedPrefix`                 | [About-Werkzeugfenster](/de/blog/config-about/#modal-fields)                              |
| `i18n.locales.<Sprachcode>.about.modals.help.typedSuffix`                 | [About-Werkzeugfenster](/de/blog/config-about/#modal-fields)                              |
| `i18n.locales.<Sprachcode>.about.modals.allScripts.title`                 | [About-Werkzeugfenster](/de/blog/config-about/#modal-fields)                              |
| `i18n.locales.<Sprachcode>.about.effects.backgroundLines`                 | [About-Effekte: Status beachten](/de/blog/config-about/#effect-fields)                    |
| `i18n.locales.<Sprachcode>.about.effects.scrollToasts.p30`                | [About-Effekte](/de/blog/config-about/#effect-fields)                                     |
| `i18n.locales.<Sprachcode>.about.effects.scrollToasts.p60`                | [About-Effekte](/de/blog/config-about/#effect-fields)                                     |
| `i18n.locales.<Sprachcode>.about.effects.scrollToasts.p90`                | [About-Effekte](/de/blog/config-about/#effect-fields)                                     |
| `i18n.locales.<Sprachcode>.messages.about.title`                          | [About und gemeinsame Bedienelemente](/de/blog/config-about/#about-messages)              |
| `i18n.locales.<Sprachcode>.messages.about.description`                    | [About und gemeinsame Bedienelemente](/de/blog/config-about/#about-messages)              |
| `i18n.locales.<Sprachcode>.messages.about.who`                            | [About und gemeinsame Bedienelemente](/de/blog/config-about/#about-messages)              |
| `i18n.locales.<Sprachcode>.messages.about.what`                           | [About und gemeinsame Bedienelemente](/de/blog/config-about/#about-messages)              |
| `i18n.locales.<Sprachcode>.messages.about.ethos`                          | [About und gemeinsame Bedienelemente](/de/blog/config-about/#about-messages)              |
| `i18n.locales.<Sprachcode>.messages.about.now`                            | [About und gemeinsame Bedienelemente](/de/blog/config-about/#about-messages)              |
| `i18n.locales.<Sprachcode>.messages.about.contact`                        | [About und gemeinsame Bedienelemente](/de/blog/config-about/#about-messages)              |
| `i18n.locales.<Sprachcode>.messages.about.regenerate`                     | [About und gemeinsame Bedienelemente](/de/blog/config-about/#about-messages)              |
| `i18n.locales.<Sprachcode>.messages.windowControls.collapse`              | [About und gemeinsame Bedienelemente](/de/blog/config-about/#about-messages)              |
| `i18n.locales.<Sprachcode>.messages.windowControls.expand`                | [About und gemeinsame Bedienelemente](/de/blog/config-about/#about-messages)              |
| `i18n.locales.<Sprachcode>.messages.windowControls.restore`               | [About und gemeinsame Bedienelemente](/de/blog/config-about/#about-messages)              |
| `i18n.locales.<Sprachcode>.messages.windowControls.fullscreen`            | [About und gemeinsame Bedienelemente](/de/blog/config-about/#about-messages)              |
| `i18n.locales.<Sprachcode>.messages.scriptFolders.copyTitle`              | [About und gemeinsame Bedienelemente](/de/blog/config-about/#about-messages)              |
| `i18n.locales.<Sprachcode>.messages.scriptFolders.copied`                 | [About und gemeinsame Bedienelemente](/de/blog/config-about/#about-messages)              |
| `i18n.locales.<Sprachcode>.messages.scriptFolders.failed`                 | [About und gemeinsame Bedienelemente](/de/blog/config-about/#about-messages)              |
| `theme.enableDecoderPage`                                                 | [Decoder-Seite aktivieren](/de/blog/config-decoder/#page-enabled)                         |
| `i18n.locales.<Sprachcode>.messages.nav.about`                            | [Website und gemeinsame Oberfläche](/de/blog/config-site-chrome/#chrome-messages)         |
| `i18n.locales.<Sprachcode>.messages.decoder.input`                        | [Decoder-Texte](/de/blog/config-decoder/#text-messages)                                   |
| `i18n.locales.<Sprachcode>.messages.decoder.placeholder`                  | [Decoder-Texte](/de/blog/config-decoder/#text-messages)                                   |
| `i18n.locales.<Sprachcode>.messages.decoder.format`                       | [Decoder-Texte](/de/blog/config-decoder/#text-messages)                                   |
| `i18n.locales.<Sprachcode>.messages.decoder.auto`                         | [Decoder-Texte](/de/blog/config-decoder/#text-messages)                                   |
| `i18n.locales.<Sprachcode>.messages.decoder.decode`                       | [Decoder-Texte](/de/blog/config-decoder/#text-messages)                                   |
| `i18n.locales.<Sprachcode>.messages.decoder.clear`                        | [Decoder-Texte](/de/blog/config-decoder/#text-messages)                                   |
| `i18n.locales.<Sprachcode>.messages.decoder.copy`                         | [Decoder-Texte](/de/blog/config-decoder/#text-messages)                                   |
| `i18n.locales.<Sprachcode>.messages.decoder.reuse`                        | [Decoder-Texte](/de/blog/config-decoder/#text-messages)                                   |
| `i18n.locales.<Sprachcode>.messages.decoder.supported`                    | [Decoder-Texte](/de/blog/config-decoder/#text-messages)                                   |
| `i18n.locales.<Sprachcode>.messages.decoder.html`                         | [Decoder-Texte](/de/blog/config-decoder/#text-messages)                                   |
| `i18n.locales.<Sprachcode>.messages.decoder.unicode`                      | [Decoder-Texte](/de/blog/config-decoder/#text-messages)                                   |
| `i18n.locales.<Sprachcode>.messages.decoder.jwtWarning`                   | [Decoder-Texte](/de/blog/config-decoder/#text-messages)                                   |
| `i18n.locales.<Sprachcode>.messages.decoder.copied`                       | [Decoder-Texte](/de/blog/config-decoder/#text-messages)                                   |
| `i18n.locales.<Sprachcode>.messages.decoder.copyFailed`                   | [Decoder-Texte](/de/blog/config-decoder/#text-messages)                                   |
| `i18n.locales.<Sprachcode>.messages.decoder.output`                       | [Decoder-Texte](/de/blog/config-decoder/#text-messages)                                   |
| `i18n.locales.<Sprachcode>.messages.decoder.local`                        | [Decoder-Texte](/de/blog/config-decoder/#text-messages)                                   |
| `i18n.locales.<Sprachcode>.messages.decoder.ready`                        | [Decoder-Texte](/de/blog/config-decoder/#text-messages)                                   |
| `i18n.locales.<Sprachcode>.messages.decoder.running`                      | [Decoder-Texte](/de/blog/config-decoder/#text-messages)                                   |
| `i18n.locales.<Sprachcode>.messages.decoder.done`                         | [Decoder-Texte](/de/blog/config-decoder/#text-messages)                                   |
| `i18n.locales.<Sprachcode>.messages.decoder.empty`                        | [Decoder-Texte](/de/blog/config-decoder/#text-messages)                                   |
| `i18n.locales.<Sprachcode>.messages.decoder.tooLong`                      | [Decoder-Texte](/de/blog/config-decoder/#text-messages)                                   |
| `i18n.locales.<Sprachcode>.messages.decoder.invalid`                      | [Decoder-Texte](/de/blog/config-decoder/#text-messages)                                   |
| `i18n.locales.<Sprachcode>.messages.decoder.binary`                       | [Decoder-Texte](/de/blog/config-decoder/#text-messages)                                   |
| `i18n.locales.<Sprachcode>.messages.decoder.unknown`                      | [Decoder-Texte](/de/blog/config-decoder/#text-messages)                                   |
| `i18n.locales.<Sprachcode>.messages.decoder.ambiguous`                    | [Decoder-Texte](/de/blog/config-decoder/#text-messages)                                   |
| `i18n.locales.<Sprachcode>.messages.decoder.example`                      | [Decoder-Texte](/de/blog/config-decoder/#text-messages)                                   |
| `i18n.locales.<Sprachcode>.messages.decoderPage.description`              | [Decoder-Texte](/de/blog/config-decoder/#page-messages)                                   |
| `i18n.locales.<Sprachcode>.messages.decoderPage.fullTool`                 | [Decoder-Texte](/de/blog/config-decoder/#page-messages)                                   |
| `i18n.locales.<Sprachcode>.messages.decoderPage.task`                     | [Decoder-Texte](/de/blog/config-decoder/#page-messages)                                   |
| `i18n.locales.<Sprachcode>.messages.decoderPage.textTask`                 | [Decoder-Texte](/de/blog/config-decoder/#page-messages)                                   |
| `i18n.locales.<Sprachcode>.messages.decoderPage.callTask`                 | [Decoder-Texte](/de/blog/config-decoder/#page-messages)                                   |
| `i18n.locales.<Sprachcode>.messages.decoderPage.addressTask`              | [Decoder-Texte](/de/blog/config-decoder/#page-messages)                                   |
| `i18n.locales.<Sprachcode>.messages.decoderPage.addressHint`              | [Decoder-Texte](/de/blog/config-decoder/#page-messages)                                   |
| `i18n.locales.<Sprachcode>.messages.decoderPage.chain`                    | [Decoder-Texte](/de/blog/config-decoder/#page-messages)                                   |
| `i18n.locales.<Sprachcode>.messages.decoderPage.decimals`                 | [Decoder-Texte](/de/blog/config-decoder/#page-messages)                                   |
| `i18n.locales.<Sprachcode>.messages.decoderPage.precisionHint`            | [Decoder-Texte](/de/blog/config-decoder/#page-messages)                                   |
| `i18n.locales.<Sprachcode>.messages.decoderPage.network`                  | [Decoder-Texte](/de/blog/config-decoder/#page-messages)                                   |
| `i18n.locales.<Sprachcode>.messages.decoderPage.history`                  | [Decoder-Texte](/de/blog/config-decoder/#page-messages)                                   |
| `i18n.locales.<Sprachcode>.messages.decoderPage.back`                     | [Decoder-Texte](/de/blog/config-decoder/#page-messages)                                   |
| `i18n.locales.<Sprachcode>.messages.decoderPage.export`                   | [Decoder-Texte](/de/blog/config-decoder/#page-messages)                                   |
| `i18n.locales.<Sprachcode>.messages.decoderPage.limits`                   | [Decoder-Texte](/de/blog/config-decoder/#page-messages)                                   |
| `i18n.locales.<Sprachcode>.messages.decoderPage.callNotice`               | [Decoder-Texte](/de/blog/config-decoder/#page-messages)                                   |
| `i18n.locales.<Sprachcode>.messages.decoderPage.addressNotice`            | [Decoder-Texte](/de/blog/config-decoder/#page-messages)                                   |
| `i18n.locales.<Sprachcode>.messages.decoderPage.unsupported`              | [Decoder-Texte](/de/blog/config-decoder/#page-messages)                                   |
| `i18n.locales.<Sprachcode>.messages.decoderPage.checksum`                 | [Decoder-Texte](/de/blog/config-decoder/#page-messages)                                   |
| `i18n.locales.<Sprachcode>.messages.decoderPage.length`                   | [Decoder-Texte](/de/blog/config-decoder/#page-messages)                                   |
| `i18n.locales.<Sprachcode>.messages.decoderPage.wrongNetwork`             | [Decoder-Texte](/de/blog/config-decoder/#page-messages)                                   |
| `i18n.locales.<Sprachcode>.messages.decoderPage.stepLimit`                | [Decoder-Texte](/de/blog/config-decoder/#page-messages)                                   |
| `i18n.locales.<Sprachcode>.messages.decoderPage.budget`                   | [Decoder-Texte](/de/blog/config-decoder/#page-messages)                                   |
| `i18n.locales.<Sprachcode>.messages.decoderPage.addressParse`             | [Decoder-Texte](/de/blog/config-decoder/#page-messages)                                   |
| `i18n.locales.<Sprachcode>.messages.decoderPage.addressCheck`             | [Decoder-Texte](/de/blog/config-decoder/#page-messages)                                   |
| `i18n.locales.<Sprachcode>.messages.decoderPage.addressResult`            | [Decoder-Texte](/de/blog/config-decoder/#page-messages)                                   |
| `i18n.locales.<Sprachcode>.messages.decoderPage.callParse`                | [Decoder-Texte](/de/blog/config-decoder/#page-messages)                                   |
| `i18n.locales.<Sprachcode>.messages.decoderPage.rawOnly`                  | [Decoder-Texte](/de/blog/config-decoder/#page-messages)                                   |
| `i18n.locales.<Sprachcode>.messages.decoderPage.amountResult`             | [Decoder-Texte](/de/blog/config-decoder/#page-messages)                                   |
| `i18n.locales.<Sprachcode>.messages.decoderPage.inputHint`                | [Decoder-Texte](/de/blog/config-decoder/#page-messages)                                   |
| `i18n.locales.<Sprachcode>.messages.decoderPage.loadFailed`               | [Decoder-Texte](/de/blog/config-decoder/#page-messages)                                   |
| `i18n.locales.<Sprachcode>.messages.decoderPage.readings.tribute`         | [Decoder-Lesebereich](/de/blog/config-decoder/#readings)                                  |
| `i18n.locales.<Sprachcode>.messages.decoderPage.readings.links`           | [Decoder-Lesebereich](/de/blog/config-decoder/#readings)                                  |
| `i18n.locales.<Sprachcode>.messages.decoderPage.readings.links[].title`   | [Decoder-Lesebereich](/de/blog/config-decoder/#readings)                                  |
| `i18n.locales.<Sprachcode>.messages.decoderPage.readings.links[].href`    | [Decoder-Lesebereich](/de/blog/config-decoder/#readings)                                  |
| `i18n.locales.<Sprachcode>.messages.decoderPage.readings.links[].author`  | [Decoder-Lesebereich](/de/blog/config-decoder/#readings)                                  |
| `i18n.locales.<Sprachcode>.messages.decoderPage.readings.links[].year`    | [Decoder-Lesebereich](/de/blog/config-decoder/#readings)                                  |
| `i18n.locales.<Sprachcode>.messages.decoderPage.readings.links[].cover`   | [Decoder-Lesebereich](/de/blog/config-decoder/#readings)                                  |
| `theme.music.enabled`                                                     | [Musikplayer](/de/blog/config-music/#enabled)                                             |
| `theme.music.tracks`                                                      | [Musikplayer](/de/blog/config-music/#tracks)                                              |
| `theme.music.tracks[].title`                                              | [Musikplayer](/de/blog/config-music/#track-fields)                                        |
| `theme.music.tracks[].artist`                                             | [Musikplayer](/de/blog/config-music/#track-fields)                                        |
| `theme.music.tracks[].src`                                                | [Musikplayer](/de/blog/config-music/#track-fields)                                        |
| `i18n.locales.<Sprachcode>.messages.music.label`                          | [Musikplayer-Texte](/de/blog/config-music/#music-messages)                                |
| `i18n.locales.<Sprachcode>.messages.music.play`                           | [Musikplayer-Texte](/de/blog/config-music/#music-messages)                                |
| `i18n.locales.<Sprachcode>.messages.music.pause`                          | [Musikplayer-Texte](/de/blog/config-music/#music-messages)                                |
| `i18n.locales.<Sprachcode>.messages.music.prev`                           | [Musikplayer-Texte](/de/blog/config-music/#music-messages)                                |
| `i18n.locales.<Sprachcode>.messages.music.next`                           | [Musikplayer-Texte](/de/blog/config-music/#music-messages)                                |
| `i18n.locales.<Sprachcode>.messages.music.open`                           | [Musikplayer-Texte](/de/blog/config-music/#music-messages)                                |
| `i18n.locales.<Sprachcode>.messages.music.close`                          | [Musikplayer-Texte](/de/blog/config-music/#music-messages)                                |
| `i18n.locales.<Sprachcode>.messages.music.progress`                       | [Musikplayer-Texte](/de/blog/config-music/#music-messages)                                |
| `i18n.locales.<Sprachcode>.messages.music.volume`                         | [Musikplayer-Texte](/de/blog/config-music/#music-messages)                                |
| `i18n.locales.<Sprachcode>.messages.music.queue`                          | [Musikplayer-Texte](/de/blog/config-music/#music-messages)                                |
| `i18n.locales.<Sprachcode>.messages.music.mute`                           | [Musikplayer-Texte](/de/blog/config-music/#music-messages)                                |
| `i18n.locales.<Sprachcode>.messages.music.unmute`                         | [Musikplayer-Texte](/de/blog/config-music/#music-messages)                                |
| `i18n.locales.<Sprachcode>.messages.music.idle`                           | [Musikplayer-Texte](/de/blog/config-music/#music-messages)                                |
| `i18n.locales.<Sprachcode>.messages.music.loading`                        | [Musikplayer-Texte](/de/blog/config-music/#music-messages)                                |
| `i18n.locales.<Sprachcode>.messages.music.playing`                        | [Musikplayer-Texte](/de/blog/config-music/#music-messages)                                |
| `i18n.locales.<Sprachcode>.messages.music.paused`                         | [Musikplayer-Texte](/de/blog/config-music/#music-messages)                                |
| `i18n.locales.<Sprachcode>.messages.music.blocked`                        | [Musikplayer-Texte](/de/blog/config-music/#music-messages)                                |
| `i18n.locales.<Sprachcode>.messages.music.error`                          | [Musikplayer-Texte](/de/blog/config-music/#music-messages)                                |
| `i18n.locales.<Sprachcode>.messages.music.noScript`                       | [Musikplayer-Texte](/de/blog/config-music/#music-messages)                                |
| `theme.comments.shareAcrossLocales`                                       | [Giscus-Kommentare](/de/blog/config-comments/#sharing)                                    |
| `theme.comments.mapping`                                                  | [Giscus-Kommentare](/de/blog/config-comments/#mapping)                                    |
| `theme.comments.term`                                                     | [Giscus-Kommentare](/de/blog/config-comments/#mapping)                                    |
| `theme.comments.number`                                                   | [Giscus-Kommentare](/de/blog/config-comments/#mapping)                                    |
| `theme.comments.strict`                                                   | [Giscus-Kommentare](/de/blog/config-comments/#mapping)                                    |
| `theme.comments.reactionsEnabled`                                         | [Giscus-Kommentare](/de/blog/config-comments/#appearance)                                 |
| `theme.comments.emitMetadata`                                             | [Giscus-Kommentare](/de/blog/config-comments/#appearance)                                 |
| `theme.comments.inputPosition`                                            | [Giscus-Kommentare](/de/blog/config-comments/#appearance)                                 |
| `theme.comments.theme`                                                    | [Giscus-Kommentare](/de/blog/config-comments/#appearance)                                 |
| `theme.comments.lang`                                                     | [Giscus-Kommentare](/de/blog/config-comments/#appearance)                                 |
| `theme.comments.loading`                                                  | [Giscus-Kommentare](/de/blog/config-comments/#appearance)                                 |
| `theme.comments.crossorigin`                                              | [Giscus-Kommentare](/de/blog/config-comments/#appearance)                                 |
| `i18n.defaultLocale`                                                      | [Sprachen und Fallback](/de/blog/config-languages/#registry)                              |
| `i18n.locales`                                                            | [Sprachen und Fallback](/de/blog/config-languages/#registry)                              |
| `i18n.locales.<Sprachcode>`                                               | [Sprachen und Fallback](/de/blog/config-languages/#registry)                              |
| `i18n.routing.defaultLocalePrefix`                                        | [Sprachen und Fallback](/de/blog/config-languages/#routing)                               |
| `i18n.locales.<Sprachcode>.meta`                                          | [Sprachen und Fallback](/de/blog/config-languages/#meta)                                  |
| `i18n.locales.<Sprachcode>.meta.label`                                    | [Sprachen und Fallback](/de/blog/config-languages/#meta)                                  |
| `i18n.locales.<Sprachcode>.meta.hreflang`                                 | [Sprachen und Fallback](/de/blog/config-languages/#meta)                                  |
| `i18n.locales.<Sprachcode>.meta.ogLocale`                                 | [Sprachen und Fallback](/de/blog/config-languages/#meta)                                  |
| `i18n.locales.<Sprachcode>.meta.enabled`                                  | [Sprachen und Fallback](/de/blog/config-languages/#meta)                                  |
| `i18n.locales.<Sprachcode>.meta.fallback`                                 | [Sprachen und Fallback](/de/blog/config-languages/#fallback)                              |
| `i18n.locales.<Sprachcode>.site`                                          | [Sprachen und Fallback](/de/blog/config-languages/#overrides)                             |
| `i18n.locales.<Sprachcode>.messages`                                      | [Sprachen und Fallback](/de/blog/config-languages/#overrides)                             |
| `i18n.locales.<Sprachcode>.about`                                         | [Sprachen und Fallback](/de/blog/config-languages/#overrides)                             |
| `i18n.locales.<Sprachcode>.messages.langLabel`                            | [Sprachen und Fallback](/de/blog/config-languages/#common-messages)                       |
| `i18n.locales.<Sprachcode>.aiReadableContent`                             | [GA4 und Ergänzungen für KI-Leser](/de/blog/config-analytics-ai/#locale-supplement)       |
| `i18n.locales.<Sprachcode>.aiReadableContent.notes`                       | [GA4 und Ergänzungen für KI-Leser](/de/blog/config-analytics-ai/#locale-supplement)       |
| `i18n.locales.<Sprachcode>.aiReadableContent.links`                       | [GA4 und Ergänzungen für KI-Leser](/de/blog/config-analytics-ai/#locale-supplement)       |
| `i18n.locales.<Sprachcode>.aiReadableContent.links[].label`               | [GA4 und Ergänzungen für KI-Leser](/de/blog/config-analytics-ai/#locale-supplement)       |
| `i18n.locales.<Sprachcode>.aiReadableContent.links[].href`                | [GA4 und Ergänzungen für KI-Leser](/de/blog/config-analytics-ai/#locale-supplement)       |
| `i18n.locales.<Sprachcode>.messages.search.label`                         | [Suchtexte](/de/blog/config-search/#messages)                                             |
| `i18n.locales.<Sprachcode>.messages.search.close`                         | [Suchtexte](/de/blog/config-search/#messages)                                             |
| `i18n.locales.<Sprachcode>.messages.search.placeholder`                   | [Suchtexte](/de/blog/config-search/#messages)                                             |
| `i18n.locales.<Sprachcode>.messages.search.hint`                          | [Suchtexte](/de/blog/config-search/#messages)                                             |
| `i18n.locales.<Sprachcode>.messages.search.loading`                       | [Suchtexte](/de/blog/config-search/#messages)                                             |
| `i18n.locales.<Sprachcode>.messages.search.empty`                         | [Suchtexte](/de/blog/config-search/#messages)                                             |
| `i18n.locales.<Sprachcode>.messages.search.error`                         | [Suchtexte](/de/blog/config-search/#messages)                                             |
| `i18n.locales.<Sprachcode>.messages.search.retry`                         | [Suchtexte](/de/blog/config-search/#messages)                                             |
| `i18n.locales.<Sprachcode>.messages.search.more`                          | [Suchtexte](/de/blog/config-search/#messages)                                             |
| `i18n.locales.<Sprachcode>.messages.search.results`                       | [Suchtexte](/de/blog/config-search/#messages)                                             |
| `i18n.locales.<Sprachcode>.messages.search.dev`                           | [Suchtexte](/de/blog/config-search/#messages)                                             |
| `analytics`                                                               | [GA4 und Ergänzungen für KI-Leser](/de/blog/config-analytics-ai/#analytics)               |
| `analytics.googleAnalyticsId`                                             | [GA4 und Ergänzungen für KI-Leser](/de/blog/config-analytics-ai/#analytics)               |
| `aiReadableContent`                                                       | [GA4 und Ergänzungen für KI-Leser](/de/blog/config-analytics-ai/#supplement)              |
| `aiReadableContent.notes`                                                 | [GA4 und Ergänzungen für KI-Leser](/de/blog/config-analytics-ai/#supplement)              |
| `aiReadableContent.links`                                                 | [GA4 und Ergänzungen für KI-Leser](/de/blog/config-analytics-ai/#supplement)              |
| `aiReadableContent.links[].label`                                         | [GA4 und Ergänzungen für KI-Leser](/de/blog/config-analytics-ai/#supplement)              |
| `aiReadableContent.links[].href`                                          | [GA4 und Ergänzungen für KI-Leser](/de/blog/config-analytics-ai/#supplement)              |
| `site.title`                                                              | [Website und gemeinsame Oberfläche](/de/blog/config-site-chrome/#identity)                |
| `site.description`                                                        | [Website und gemeinsame Oberfläche](/de/blog/config-site-chrome/#identity)                |
| `site.url`                                                                | [Website und gemeinsame Oberfläche](/de/blog/config-site-chrome/#identity)                |
| `site.tagline`                                                            | [Website und gemeinsame Oberfläche](/de/blog/config-site-chrome/#identity)                |
| `social.links`                                                            | [Website und gemeinsame Oberfläche](/de/blog/config-site-chrome/#social)                  |
| `social.links[].href`                                                     | [Website und gemeinsame Oberfläche](/de/blog/config-site-chrome/#social-fields)           |
| `social.links[].label`                                                    | [Website und gemeinsame Oberfläche](/de/blog/config-site-chrome/#social-fields)           |
| `social.links[].rel`                                                      | [Website und gemeinsame Oberfläche](/de/blog/config-site-chrome/#social-fields)           |
| `social.links[].icon`                                                     | [Website und gemeinsame Oberfläche](/de/blog/config-site-chrome/#social-fields)           |
| `social.links[].iconSrc`                                                  | [Website und gemeinsame Oberfläche](/de/blog/config-site-chrome/#social-fields)           |
| `theme.footer.links`                                                      | [Website und gemeinsame Oberfläche](/de/blog/config-site-chrome/#footer)                  |
| `theme.footer.links[].label`                                              | [Website und gemeinsame Oberfläche](/de/blog/config-site-chrome/#footer)                  |
| `theme.footer.links[].href`                                               | [Website und gemeinsame Oberfläche](/de/blog/config-site-chrome/#footer)                  |
| `i18n.locales.<Sprachcode>.messages.nav.home`                             | [Website und gemeinsame Oberfläche](/de/blog/config-site-chrome/#chrome-messages)         |
| `i18n.locales.<Sprachcode>.messages.nav.blog`                             | [Website und gemeinsame Oberfläche](/de/blog/config-site-chrome/#chrome-messages)         |
| `i18n.locales.<Sprachcode>.messages.nav.status`                           | [Website und gemeinsame Oberfläche](/de/blog/config-site-chrome/#chrome-messages)         |
| `i18n.locales.<Sprachcode>.messages.nav.statusAria`                       | [Website und gemeinsame Oberfläche](/de/blog/config-site-chrome/#chrome-messages)         |
| `i18n.locales.<Sprachcode>.messages.footer.theme`                         | [Website und gemeinsame Oberfläche](/de/blog/config-site-chrome/#chrome-messages)         |
| `i18n.locales.<Sprachcode>.messages.footer.builtWith`                     | [Website und gemeinsame Oberfläche](/de/blog/config-site-chrome/#chrome-messages)         |
| `i18n.locales.<Sprachcode>.messages.terminal.commandInput`                | [Terminaltexte](/de/blog/config-terminal/#messages)                                       |
| `i18n.locales.<Sprachcode>.messages.terminal.hint`                        | [Terminaltexte](/de/blog/config-terminal/#messages)                                       |
| `i18n.locales.<Sprachcode>.messages.terminal.help`                        | [Terminaltexte](/de/blog/config-terminal/#messages)                                       |
| `i18n.locales.<Sprachcode>.messages.terminal.syntax`                      | [Terminaltexte](/de/blog/config-terminal/#messages)                                       |
| `i18n.locales.<Sprachcode>.messages.terminal.usage`                       | [Terminaltexte](/de/blog/config-terminal/#messages)                                       |
| `i18n.locales.<Sprachcode>.messages.terminal.unknown`                     | [Terminaltexte](/de/blog/config-terminal/#messages)                                       |
| `i18n.locales.<Sprachcode>.messages.terminal.notFound`                    | [Terminaltexte](/de/blog/config-terminal/#messages)                                       |
| `i18n.locales.<Sprachcode>.messages.terminal.notDirectory`                | [Terminaltexte](/de/blog/config-terminal/#messages)                                       |
| `i18n.locales.<Sprachcode>.messages.terminal.isDirectory`                 | [Terminaltexte](/de/blog/config-terminal/#messages)                                       |
| `i18n.locales.<Sprachcode>.messages.terminal.failed`                      | [Terminaltexte](/de/blog/config-terminal/#messages)                                       |
| `i18n.locales.<Sprachcode>.messages.terminal.tooLarge`                    | [Terminaltexte](/de/blog/config-terminal/#messages)                                       |
| `i18n.locales.<Sprachcode>.messages.terminal.empty`                       | [Terminaltexte](/de/blog/config-terminal/#messages)                                       |
| `i18n.locales.<Sprachcode>.messages.terminal.loading`                     | [Terminaltexte](/de/blog/config-terminal/#messages)                                       |
| `i18n.locales.<Sprachcode>.messages.terminal.readerTitle`                 | [Terminaltexte, derzeit ungenutzt](/de/blog/config-terminal/#messages)                    |
| `i18n.locales.<Sprachcode>.messages.terminal.readerHint`                  | [Terminaltexte](/de/blog/config-terminal/#messages)                                       |
| `i18n.locales.<Sprachcode>.messages.terminal.readerCommand`               | [Terminaltexte](/de/blog/config-terminal/#messages)                                       |

## Beitragsfelder getrennt von der Website-Konfiguration nachschlagen

Beitrags-Frontmatter gehört nicht in die site.config-Tabelle oben: [Inhalte, Daten und Bilder](/de/blog/config-article/#frontmatter), [OUTPUT-Statistik und Status](/de/blog/config-article/#output-fields), [Kompatibilität und derzeit ungenutzte Felder](/de/blog/config-article/#legacy-frontmatter).

Die drei Frontmatter-Felder eines Fragments stehen unter [Fragments-Inhaltsfelder](/de/blog/config-fragments/#content-fields). Verwende sie nicht wie Beitragsfelder.

Ob ein einzelner Beitrag in die Website-Suche aufgenommen wird, erklärt das [Feld search](/de/blog/config-search/#article-search). Es ist weder ein site.config-Feld noch ein Datenschutzschalter.

## Felderklärungen lesen

Alle Lexikonartikel nennen vollständigen Pfad, Typ, Theme-Standardwert, tatsächliche Wirkung, Grenzen, Bedingungen und Beispiel. Ein weiterhin akzeptierter Typ ohne konsumierenden Code darf nicht als wirksame Funktion beschrieben werden.

| Status                         | Bedeutung                                                                                                                        |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| Wirksam                        | Die aktuelle Implementierung hat eine entsprechende Wirkung                                                                      |
| Bedingt wirksam                | Erfordert eine aktivierte Funktion, Seitenbedingungen oder darf nicht von höher priorisierten Werten überlagert werden           |
| Derzeit ungenutzt              | Der Typ akzeptiert das Feld, aktuell gibt es aber keine entsprechende Wirkung. Nicht ausfüllen, um die Seite zu ändern           |
| Für Kompatibilität beibehalten | Hat einen ausdrücklich genannten Kompatibilitätszweck; die Erklärung nennt, was erhalten bleibt und ob es aktuell angezeigt wird |

Theme-Standardwerte stammen aus der Paketkonfiguration oder integrierten Texten. Der Starter kann sie überschreiben, und die Demo hat eigene persönliche Einstellungen. Autor, Titel und Playlist der Demo sind keine Standardwerte für alle neuen Blogs.

Sprachbezogene Standardwerte hängen von Sprache und Fallback-Kette ab. Das Lexikon kennzeichnet „nicht gesetzt“, „integrierte Texte der aktuellen Sprache“ oder konkrete Werte. Werden nur vereinfachtes Chinesisch und Englisch gezeigt, ist der Geltungsbereich ausdrücklich genannt; diese Beispiele sind keine festen Werte für alle Sprachen.

## Wo konfigurieren und wie zusammenführen?

Füge die Beispiele in das vorhandene `defineThemeConfig({...})` in `src/site.config.ts` ein. Behalte import, export und andere persönliche Einstellungen. Lege theme oder i18n im selben Objekt nicht doppelt an.

Objekte werden rekursiv zusammengeführt, ausgelassene Felder behalten die Standardkonfiguration. Arrays werden vollständig ersetzt, undefined überschreibt nicht. Die Bedeutung leerer Strings, leerer Arrays und false hängt vom Feld ab; sie setzen nicht pauschal auf den Standard zurück. Ein leerer Startseiten-hero löscht etwa ausdrücklich den Text, während ein leerer homeTitle den Fallback fortsetzt.

Prüfe die betroffene Seite zunächst in dev. Änderungen an Umgebungswerten erfordern einen Neustart des Entwicklungsservers. Für die veröffentlichte Website musst du neu bauen und bereitstellen; das lokale Speichern der Konfiguration verändert die Online-Seite nicht.

Beitrags-Frontmatter, Astro-Konfiguration und Umgebungsvariablen haben unterschiedliche Orte. Das Lexikon erklärt ihre Beziehungen, behandelt sie aber nicht als site.config-Felder. Installation und Aktualisierung stehen in der [ersten Anleitung](/de/blog/starter-guide-1-configure-your-site/), lokale Prüfung und Bereitstellung in der [Veröffentlichungsanleitung](/de/blog/starter-guide-deployment/).
