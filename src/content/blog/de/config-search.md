---
tags: ['anglefeint', 'config']
title: 'Konfigurationsverzeichnis: Suche und Inhaltsentdeckung'
subtitle: 'Suchindex, Sprachregeln und weitere öffentliche Inhaltseinstiege.'
description: 'Suchfelder, Texte, Indexgrenzen, lokale Vorschau und Abgrenzung zu RSS und Maschinenexporten.'
pubDate: '2026-11-13'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/cyber-02.webp'
---

Zum Schreiben lies [Den ersten Beitrag schreiben](/de/blog/starter-guide-2-languages-and-routing/), für Vorschau und Deployment das [Veröffentlichungstutorial](/de/blog/starter-guide-deployment/). Installation und Konfigurationsort stehen in [Teil 1](/de/blog/starter-guide-1-configure-your-site/), andere Module im [Gesamtverzeichnis](/de/blog/config-reference/).

Unterscheide die Suche in einem Build-Index von anderen Inhaltseinstiegen wie Startseitenartikeln, Tags, Empfehlungen und RSS. Der Suchschalter steuert diese nicht gemeinsam. Vorgaben stammen aus dem Theme-Paket, nicht der Demo.

<a id="enabled"></a>

## theme.search.enabled: globale Suche

- **Typ / Standard:** boolean / true.
- **Status und Wirkung:** wirksam. Such-Einstieg im öffentlichen Header, Indexmarker in teilnehmenden Artikeln und statische Pagefind-Ressourcen nach dem Build.
- **Grenzen:** false deaktiviert den Standardeinstieg und die Indexerzeugung dieses Builds. Ein einzelnes search: true überwindet keine globale Deaktivierung. Es löscht keine Artikel, verbietet keine Suchmaschinenaufnahme und entfernt keine alten Hosting-Indizes.
- **Beispiel:** theme: { search: { enabled: false } }.

Einziges öffentliches Blattfeld von theme.search. Keine Dienstadresse, API key, Indexpfad, Sortierung, Wortgewichtung oder sprachübergreifender Schalter. Pagefind läuft beim Build, ohne zusätzlichen Suchserver nach Deployment.

<a id="article-search"></a>

## search pro Beitrag: kein site.config-Feld

| Ort                                                         | Typ / Standard                                                            | Status, Wirkung und Grenzen                                                                                                                      | Beispiel      |
| ----------------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------- |
| frontmatter.search in `src/content/blog/<语言>/某篇文章.md` | boolean, optional / im Schema nicht gesetzt, Artikellayout verwendet true | Bedingt bei global aktiver Suche: Indexwurzel dieses Artikels. false ändert weder Liste, Empfehlungen, RSS, Maschinenexport noch öffentliche URL | search: false |

Zum Ausschließen nur dieses Artikels ergänze im bestehenden frontmatter:

```yaml
search: false
```

Nicht theme.search: false oder oberstes search: false in site.config verwenden. frontmatter.search ist auch kein Privatschalter. Entwürfe und Zukunftsdaten werden nicht gefiltert; nicht öffentliche Inhalte gehören außerhalb der Sammlung. Alle Felder im [Artikelverzeichnis](/de/blog/config-article/#frontmatter).

### Welche Inhalte gelangen in den Index?

Das Standardlayout emittiert data-anglefeint-search nur, wenn global und einzeln erlaubt. Markiert sind Titel, sichtbarer Untertitel und Text. context gleich dem Untertitel wird nur an dessen Stelle einmal verarbeitet, nicht als eigenes Indexfeld für alle context-Werte.

Navigation, Player, Fußzeile, Kommentare und verwandte Artikel gehören nicht zum Textindex. frontmatter.description ist nicht direkt der Ergebnis-Auszug dieser UI. Tags sind keine konfigurierbaren Suchfilter. Ergebnisse nutzen Pagefind-Titelmetadaten und Textauszüge. Das Theme erkennt keinen Text per OCR aus Bildpixeln und transkribiert keine Videos oder Audios.

Standard-About, Fragments, Decoder, Startseite und Listen haben keine Artikelindexwurzel und werden nicht automatisch Suchtreffer. Eigene Seiten müssen die Markierungskonvention selbst einhalten. Ein erfundenes site.config-Feld aktiviert das nicht.

<a id="messages"></a>

## messages.search: elf Suchtexte

Präfix `i18n.locales.<语言>.messages.search.`. Alle optionale string mit integrierter aktueller Sprache und Fallback-Kette. Die Tabelle zeigt vereinfachtes Chinesisch/Englisch und Feldwerte als Beispiele. Alle wirken bedingt bei vorhandenem Einstieg und entsprechendem UI-Zustand.

| Feld          | Standard vereinfachtes Chinesisch / Englisch                                                                                         | Wirkung, Grenzen und Platzhalter                                                                     | Beispiel                            |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- | ----------------------------------- |
| `label`       | 搜索 / Search                                                                                                                        | Zugänglicher Einstiegsname, Tooltip und Dialogtitel, kein Suchbegriff                                | `"搜索文章"`                        |
| `close`       | 关闭搜索 / Close search                                                                                                              | Zugänglicher Schließname und Tooltip; sichtbares esc und Symbol sind fest                            | `"关闭搜索"`                        |
| `placeholder` | 搜索文章… / Search articles…                                                                                                         | Eingabeplatzhalter und zugängliches Label, keine vorgefüllte Anfrage                                 | `"输入文章关键词"`                  |
| `hint`        | 搜索当前语言的文章。 / Search articles in the current language.                                                                      | Produktionshinweis ohne Anfrage                                                                      | `"搜索当前语言的文章。"`            |
| `loading`     | 正在搜索… / Searching…                                                                                                               | Suche oder Vorbereitung, ohne andere Verzögerung oder Ladestrategie                                  | `"正在查找…"`                       |
| `empty`       | 没有找到匹配的文章。 / No matching articles.                                                                                         | Keine Treffer, auch bei fehlendem Index der aktuellen Sprache möglich                                | `"没有找到相关文章。"`              |
| `error`       | 搜索加载失败，请重试。 / Search could not load. Please try again.                                                                    | Manifest-, Modul- oder Ergebnisladefehler, nicht Index-Build-Fehler                                  | `"搜索暂时不可用，请重试。"`        |
| `retry`       | 重试 / Retry                                                                                                                         | Lädt Suchmaschine erneut, baut keinen Browserindex                                                   | `"重新加载"`                        |
| `more`        | 加载更多 / Load more                                                                                                                 | Weitere Ergebnisse, keine andere Batchgröße                                                          | `"更多结果"`                        |
| `results`     | 找到 {count} 篇文章 / {count} articles found                                                                                         | Gesamtzahl gefundener Ergebnisse, nicht gezeigte Karten. Erste wörtliche {count}-Stelle wird ersetzt | `"共找到 {count} 篇文章"`           |
| `dev`         | 本地完整搜索请先运行 npm run build，再运行 npm run preview。 / To test full search locally, run npm run build, then npm run preview. | dev-Hinweis ohne echte Suche. Andere Texte erzeugen keinen Index                                     | `"请构建后在 preview 中测试搜索。"` |

Klartext ohne HTML-Ausführung. Leer überschreibt Text, verbirgt keine Knöpfe und kann zugängliche Namen entfernen. results hängt {count} nicht automatisch an deine Formulierung an. Erhalte eine Stelle für die Zahl.

### Beispiel zum Vereinigen

Vereinige mit bestehendem defineThemeConfig({...}) in src/site.config.ts, erhalte import, export und persönliche Werte, ohne theme oder i18n zu verdoppeln:

```ts
theme: { search: { enabled: true } },
i18n: {
  locales: {
    zh: {
      messages: {
        search: {
          label: '搜索文章',
          placeholder: '输入文章关键词',
          results: '共找到 {count} 篇文章',
          empty: '没有找到相关文章。',
        },
      },
    },
  },
},
```

<a id="language-and-loading"></a>

## Sprache, Laden und Ergebnisse

- Der Build erzeugt pagefind/ mit Sprachmanifest anglefeint.json und Modulen. Manifest und Suchmaschine laden erst beim Öffnen. Das UI-Skript lädt dagegen mit Seiten, die den Einstieg enthalten; nicht sämtlicher Suchcode wartet auf den Klick.
- Pfade enthalten Astro BASE_URL. Nur HTML, fehlendes pagefind/ oder auf HTML umgeschriebene Ressourcen verursachen Ladefehler. Kein eigener site.config-Indexpfad.
- Der Client vergleicht html lang ohne Großschreibungsunterscheidung mit dem Manifest. Ohne Index der aktuellen Sprache gibt es leere Ergebnisse statt englischer Suche. Es gilt die wirksame Seitensprache, nicht die Fallback-Sprache der Texte.
- Suche nach etwa 200 ms, bei chinesischer IME nach Kompositionsende; Formular absenden kann sofort suchen. Leere Anfrage startet keine Volltextsuche. Verzögerung ist kein Feld und keine Remote-KI-Anfrage.
- Pro Batch bis acht Ergebnisdetails, danach mehr. Kein pageSize. Die Anzeige zählt Gesamtfunde, nicht den Batch. Nur gleichursprüngliche Links; Auszüge nur Text und mark-Hervorhebung statt beliebigem Artikel-HTML.
- Reihenfolge von Pagefind, ohne Theme-Sortierung oder Empfehlungsalgorithmus. Normale Übersetzungs-Fallbacks füllen keine fremdsprachigen Artikel auf.

Metadaten, Aktivierung und Fallback stehen im [Sprachenverzeichnis](/de/blog/config-languages/#meta). Suchtexte ändern keine Artikel oder Indexsprachen.

<a id="preview"></a>

## Warum gibt es in dev keine echte Suche?

Der Index entsteht nach Astros Build, nicht mit npm run dev. Die Umgebung zeigt messages.search.dev und sucht auch bei eingegebenen Begriffen nicht. Das ist vorgesehen, kein Defekt oder fehlendes Feld.

Nach vorbereiteten Inhalten lokal:

```bash
npm run build
npm run preview
```

preview nutzt Build-Dateien. Nach Artikeln, Metadaten, Einzelausschlüssen oder Pfadänderungen brauchst du einen neuen Build für den neuen Index. Stelle Seiten und pagefind zusammen bereit. Textänderungen in dev aktualisieren keinen Online-Index.

Ohne indexierbare Artikel entsteht trotzdem ein gültiges leeres Sprachmanifest, sodass die UI leere Ergebnisse zeigen kann. Indexfehler beim Build werden gemeldet, kein vorgetäuschter Erfolg. Wiederholen liest bestehende Ressourcen neu und repariert keinen Build oder fehlende Artikel im Besucherbrowser.

<a id="discovery"></a>

## Weitere Inhaltseinstiege und ihre Einstellungen

Die Felder und Vorgaben gehören weiter ihren ursprünglichen Modulen. Hier entsteht keine zweite Suchkonfiguration.

| Pfad oder Ort                                   | Typ / Standard                                          | Wirkung, Grenzen und Beispiel                                                                                               | Details                                                   |
| ----------------------------------------------- | ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| theme.homeLatestCount                           | number / 3                                              | Neueste Startseitenartikel, etwa theme: { homeLatestCount: 5 }; keine Suchbatch- oder Empfehlungsanzahl                     | [Startseite](/de/blog/config-home/#latest-count)          |
| theme.blogPageSize                              | number / 10                                             | Blog-/Tagartikel je Seite, etwa theme: { blogPageSize: 8 }; keine Suchergebnisanzahl                                        | [Listen](/de/blog/config-blog-list/#page-size)            |
| theme.tags.enabled                              | boolean / true                                          | Tags und Standardtagseiten, etwa theme: { tags: { enabled: false } }; löscht keine tags und deaktiviert keine Volltextsuche | [Tags](/de/blog/config-blog-list/#tags-enabled)           |
| frontmatter.tags im Artikel                     | string[], optional / nicht gesetzt                      | Tagarchiv und Anzeige, etwa ['Astro', '随笔']; keine Empfehlungsrelevanz oder Such-Whitelist                                | [Artikelfelder](/de/blog/config-article/#frontmatter)     |
| `i18n.locales.<语言>.messages.blog.related`     | string / integrierte Sprache, Chinesisch/Englisch unten | Titel unter dem Artikel, nur Text, etwa '继续阅读'                                                                          | [Artikeltexte](/de/blog/config-article/#article-messages) |
| `i18n.locales.<语言>.messages.blog.relatedAria` | string / integrierte Sprache, Chinesisch/Englisch unten | Zugänglicher Bereichsname, etwa '其他文章'                                                                                  | [Artikeltexte](/de/blog/config-article/#article-messages) |

Empfehlungen sind die neuesten drei anderen Artikel derselben Sprache, nicht anhand gemeinsamer Tags, canonicalTopic oder Textähnlichkeit. Kein relatedCount, separater Schalter oder manuelle Liste in site.config. Ohne andere Artikel fehlt der Bereich. search: false kann weiterhin empfohlen werden.

| Text                      | Standard vereinfachtes Chinesisch / Englisch |
| ------------------------- | -------------------------------------------- |
| messages.blog.related     | 相关文章 / Related                           |
| messages.blog.relatedAria | 相关文章 / Related posts                     |

<a id="public-outputs"></a>

## RSS, SEO und Maschinenexport sind keine interne Suche

| Einstieg                    | Verhalten und Konfigurationsbezug                                                                                                                                                                                                                                                |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/<语言>/rss.xml`           | Zusammenfassungsfeed jeder aktiven Sprache. Website-Name als Titel, messages.blog.archiveDescription als Beschreibung. Artikelwerte title, description, pubDate und öffentlicher Pfad; search: false schließt nicht aus. Kein Volltext-RSS und kein RSS-Schalter in theme.search |
| Metadaten und Suchmaschinen | Unabhängige Ausgabe. search: false setzt kein noindex und deaktiviert keine Sitemap, steuert keine Internetcrawler                                                                                                                                                               |
| Öffentliche Maschinentexte  | Eigene Exporte für Artikel, About und Fragments, unabhängig von Pagefind. Sprachergänzungen im [Sprachenverzeichnis](/de/blog/config-languages/#ai-context). search: false ist kein Privatsphärenfilter                                                                          |

Setze echte Namen, Domains und Feedbeschreibungen. Öffentliche Adressen erklärt [Deployment](/de/blog/starter-guide-deployment/), archiveDescription die [Listentexte](/de/blog/config-blog-list/#archive-messages). Keine internen Ergebnisse bedeutet nicht, dass Inhalte nicht öffentlich sind.

Globaler Schalter, einzelnes search und elf Texte werden aktuell verwendet. Keine alten Such-Kompatibilitätsfelder nötig. Ungenutztes canonicalTopic wird auch nahe der Suche nicht automatisch zur Indexkategorie, siehe [alte Artikelfelder](/de/blog/config-article/#legacy-frontmatter). Keine öffentlichen Optionen für vereinte Sprachsuche, OCR, Suchbegriffanalyse, Gewichtung oder weitere Indextypen.

Weitere Module im [Gesamtverzeichnis](/de/blog/config-reference/).
