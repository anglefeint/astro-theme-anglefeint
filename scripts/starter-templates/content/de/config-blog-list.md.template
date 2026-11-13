---
tags: ['anglefeint', 'config']
title: 'Konfigurationsverzeichnis: Blog List und Taglisten'
subtitle: 'Artikelanzahl, Tags, Seiteneinteilung und gemeinsame Listentexte.'
description: 'Alle öffentlichen Listen- und Pagination-Felder, Vorgaben, Grenzen und Cards/List-Verhalten.'
pubDate: '2026-11-13'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/cyber-03.webp'
---

**Versionshinweis:** Die strenge `blogPageSize`-Prüfung erfordert mindestens 0.36.1 und fehlt in 0.36.0. Verwende auch in älteren Versionen eine sinnvolle positive Ganzzahl.

[Zurück zum Gesamtverzeichnis](/de/blog/config-reference/). Hier geht es um Blogarchiv, Tagverzeichnis, Artikel eines Tags und gemeinsame Seiteneinteilung. Maßgeblich ist der aktuelle Code, nicht Artikelzahlen oder Farben der Demo.

Der chinesische Blog liegt unter `/zh/blog/`, Seite 2 unter `/zh/blog/2/`, das Tagverzeichnis unter `/zh/tags/`. Verwende erzeugte Links zu einzelnen Tags. Andere Sprachen ersetzen zh. Der Startseitenmodus entfernt diese Sprachpräfixe nicht.

Vereinige TypeScript-Beispiele mit bestehendem defineThemeConfig in `src/site.config.ts`. Ändere vorhandene theme-, i18n- oder pagination-Felder und erhalte andere Werte, ohne Objekte zu verdoppeln.

## 1. Artikel je Seite

<a id="page-size"></a>

### `theme.blogPageSize`

- **Typ:** `number`.
- **Theme-Standard:** `10`.
- **Wirkung:** Gemeinsame Artikelanzahl pro Blogarchiv- und Taglistenseite. Zuerst Sprachfilter, dann pubDate absteigend.
- **Status:** wirksam.
- **Grenzen:** Muss eine positive sichere Ganzzahl sein. 0, negative Zahlen, Brüche, NaN, Infinity und Werte außerhalb des sicheren Ganzzahlbereichs führen beim Auflösen der Konfiguration ausdrücklich zu einem Fehler. Keine Abrundung oder Rücksetzung auf den Standard; 0 deaktiviert die Paginierung nicht.
- **Umfang:** Weder Startseitenartikel noch Fragments betroffen; das Tagverzeichnis selbst wird hiermit nicht paginiert.

```ts
theme: { blogPageSize: 12 },
```

Ohne Blogartikel entsteht trotzdem Seite 1. Bei nur einer Seite gibt es keine Pagination-Komponente. Größenänderungen brauchen Build und Deployment. Höhere alte Seiten können verschwinden, ohne automatische Weiterleitung.

Sortierung nutzt nicht updatedDate, Dateiname oder Klickzahl. Es gibt keine Entwurfs-/Zukunftsfilter oder Sortierfelder, siehe [Beiträge schreiben](/de/blog/starter-guide-2-languages-and-routing/).

## 2. Tag-Einstiege und Tagseiten

<a id="tags-enabled"></a>

### `theme.tags.enabled`

- **Typ:** `boolean`.
- **Theme-Standard:** `true`.
- **Wirkung:** Theme-Tag-Einstiege, Verzeichnis, Taglisten sowie Taglinks auf Artikelkarten und im Artikel.
- **Status:** wirksam.
- **Grenzen:** false löscht weder frontmatter-tags noch Artikel oder bereits veröffentlichte Dateien. Kein Filter für die Blogliste. Der Blog-Schnelleinstieg braucht tatsächliche Tags der aktuellen Sprache. Aktiv ohne Tags zeigt das Verzeichnis einen Leerhinweis.

```ts
theme: { tags: { enabled: false } },
```

Tags stammen aus frontmatter-`tags`, ohne manuell gepflegtes site.config-Register. Rand-Leerraum, leere Werte und Duplikate desselben Artikels werden entfernt. Großschreibung bleibt relevant: Astro und astro sind verschieden.

Das Verzeichnis sortiert nach Artikelanzahl absteigend und bei Gleichstand nach Tagstring. Sonderzeichen, Chinesisch, reservierte und lange Namen erhalten stabile Kodierung. Verwende die erzeugten Links. Umbenennung kann Pfade ändern, ohne alte Adressen zu erhalten.

Karten zeigen derzeit höchstens zwei Tags, ohne Anzahlkonfiguration. Das begrenzt weder tatsächliche Artikel-Tags noch gültige Tags im Verzeichnis.

## 3. Seitenfenster und Seitensprung

<a id="pagination-window"></a>

### `theme.pagination.windowSize`

- **Typ:** `number`.
- **Theme-Standard:** `7`.
- **Wirkung:** Sichtbare Seitennummern, Randseiten und Auslassungen, nicht Artikel je Seite.
- **Status:** bedingt bei mehr als einer Seite.
- **Grenzen:** Normale Werte werden abgerundet und auf 5–21 begrenzt. Strategieparameter, keine Garantie, dass alle Zahlen, Vor/Zurück und Auslassungen zusammen genau diesen Wert ergeben. Verwende endliche Ganzzahlen.

<a id="jump-threshold"></a>

### `theme.pagination.showJumpThreshold`

- **Typ:** `number`.
- **Theme-Standard:** `12`.
- **Wirkung:** Sprungfeld nur bei strikt mehr Gesamtseiten als Schwelle und aktivem jump.enabled.
- **Status:** bedingt.
- **Grenzen:** Normale Werte werden abgerundet und mindestens 1. Bei 12 Seiten unsichtbar, ab 13 sichtbar. Keine Artikelschwelle; 0 zeigt es nicht bedingungslos.

<a id="jump-enabled"></a>

### `theme.pagination.jump.enabled`

- **Typ:** `boolean`.
- **Theme-Standard:** `true`.
- **Wirkung:** Erlaubt das Sprungformular.
- **Status und Grenzen:** bedingt durch überschrittene Schwelle. false entfernt nur das Formular, nicht normale Links. Springen braucht JavaScript, gewöhnliche Pagination nicht.

<a id="jump-enter"></a>

### `theme.pagination.jump.enterToGo`

- **Typ:** `boolean`.
- **Theme-Standard:** `true`.
- **Wirkung:** Erlaubt Enter im Sprungfeld.
- **Status und Grenzen:** nur bei vorhandenem Formular. false blockiert Enter, erlaubt aber den Knopf. Der Client entfernt Nichtziffern und begrenzt auf vorhandene Seiten. Keine beliebige URL-Navigation.

Gemeinsames Beispiel:

```ts
theme: {
  pagination: {
    windowSize: 9,
    showJumpThreshold: 8,
    jump: { enabled: true, enterToGo: false },
  },
},
```

Diese Einstellungen gelten auch für Fragments, deren pageSize bleibt eigenständig. Änderungen betreffen nicht nur einen einzelnen Tag.

## 4. Strategie für das Pagination-Aussehen

<a id="style-enabled"></a>

### `theme.pagination.style.enabled`

- **Typ:** `boolean`.
- **Theme-Standard:** `true`.
- **Wirkung:** Variantenstrategie für Container und Knöpfe.
- **Status und Grenzen:** bedingt. false nutzt Basisvariante 1, entfernt keine Pagination, ändert keine Artikelzahl und deaktiviert keine gesamten Cyberpunk-Effekte. Karten- und Cards/List-Zufallsfarben sind unabhängig.

<a id="style-mode"></a>

### `theme.pagination.style.mode`

- **Typ:** `'random' | 'sequential' | 'fixed'`.
- **Theme-Standard:** `'random'`.
- **Wirkung:** Auswahl der visuellen Variante.
- **Status und Grenzen:** bedingt bei style.enabled true. Modi:

| Modus      | Aktuelles Verhalten                                                                                                                      |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| random     | Stabiler Anfangsstil beim Build; Client wählt Container und Knöpfe neu zufällig. Wiederholungen möglich, keine laufende Wechselanimation |
| sequential | Container nach Seitennummer, Knöpfe nach eigener Position. Nicht zwingend gleiche Farben, kein zeitlicher Wechsel                        |
| fixed      | Container und Knöpfe teilen fixedVariant                                                                                                 |

Ohne JavaScript bleibt der anfängliche HTML-Stil ohne Client-Zufallsauswahl.

<a id="style-variants"></a>

### `theme.pagination.style.variants`

- **Typ:** `number`.
- **Theme-Standard:** `9`.
- **Wirkung:** Anzahl auswählbarer Varianten 1 bis N, kein Mehrfacharray oder globale Theme-Anzahl.
- **Status und Grenzen:** bedingt. Normale Werte werden abgerundet und auf 1–12 begrenzt. Gemeinsame Neonfarben existieren derzeit nur für 1–9. 10–12 sind keine drei weiteren vollständigen Paletten und können auf geerbte/Basisfarben fallen. Verwende vorzugsweise 1–9, gewöhnlich Standard 9. Die Bereichsangabe schafft keine neuen Farben.

<a id="style-fixed"></a>

### `theme.pagination.style.fixedVariant`

- **Typ:** `number`.
- **Theme-Standard:** `1`.
- **Wirkung:** Feste Variantennummer im fixed-Modus.
- **Status und Grenzen:** bedingt. Normale Werte werden abgerundet und auf 1 bis variants begrenzt. random und sequential fixieren damit nichts. Für vollständige Neonfarben 1–9 und endliche Ganzzahlen wählen.

Für die zweite feste Variante:

```ts
theme: {
  pagination: {
    style: { enabled: true, mode: 'fixed', variants: 9, fixedVariant: 2 },
  },
},
```

Nur Basisstil: `theme: { pagination: { style: { enabled: false } } }`. Wähle die gewünschte Variante, statt beide Beispiele nacheinander zu überschreiben.

## 5. Listentitel, Beschreibung und Seitentexte

<a id="archive-messages"></a>

Präfix `i18n.locales.<Sprachcode>.messages.blog`. Alle sind optionale `string`-Überschreibungen und bedingt bei entsprechender Überschrift, Beschreibung oder Steuerung. Vorgaben werden aus Sprachtexten und Fallbacks aufgelöst. Die Tabelle zeigt vereinfachtes Chinesisch und Englisch; andere Sprachen haben eigene Werte.

| Feld                 | Standard vereinfachtes Chinesisch / Englisch                                                                     | Wirkung und Grenzen                                                                                                           |
| -------------------- | ---------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `title`              | 博客 / Blog                                                                                                      | Seitentitel der ersten Blogseite und versteckte Bereichsüberschrift, kein Artikeltitel und keine Cards/List-Beschriftung      |
| `pageTitle`          | 博客 - 第 / Blog - Page                                                                                          | Titelpräfix späterer Blog- und Tagseiten; Code hängt Seitenzahl an, ohne eigene Platzhalter                                   |
| `archiveDescription` | 关于 AI 时代开发、Web 工程与系统架构的文章。 / Essays on AI-era craft, web engineering, and system architecture. | Metabeschreibung der ersten Blogseite und des Tagverzeichnisses, kein Karten-Auszug                                           |
| `pageDescription`    | 博客归档页 / Blog archive page                                                                                   | Metabeschreibungspräfix späterer Blogseiten mit angehängter Zahl und Punkt; nicht dieselbe Beschreibungsposition der Tagliste |

```ts
i18n: {
  locales: {
    de: {
      messages: {
        blog: {
          title: 'Artikelarchiv',
          pageTitle: 'Artikelarchiv – Seite',
          archiveDescription: 'Projekte, Lektüre und Lernnotizen.',
          pageDescription: 'Seiten des Artikelarchivs',
        },
      },
    },
  },
},
```

<a id="pagination-messages"></a>

Seitentexte haben denselben Präfix und string-Typ:

| Feld             | Standard vereinfachtes Chinesisch / Englisch | Wirkung und Grenzen                                               |
| ---------------- | -------------------------------------------- | ----------------------------------------------------------------- |
| `previous`       | 上一页 / Previous                            | Sichtbarer und zugänglicher Zurück-Link; fehlt auf Seite 1        |
| `next`           | 下一页 / Next                                | Sichtbarer und zugänglicher Weiter-Link; fehlt auf letzter Seite  |
| `paginationAria` | 分页导航 / Pagination                        | Zugänglicher nav-Name, keine zusätzliche sichtbare Überschrift    |
| `jumpTo`         | 跳转到页 / Jump to page                      | Sichtbarer Text am bedingt vorhandenen Sprungfeld                 |
| `jumpInputLabel` | 页码 / Page number                           | Verstecktes zugängliches Eingabelabel, kein anderes Eingabeformat |
| `jumpGo`         | 跳转 / Go                                    | Text des Sprungknopfs, kein anderer Zielpfad                      |

Die Felder gelten auch für Tags und Fragments. Blog-Routen haben zusätzliche englische Reserven für leere jumpTo/jumpInputLabel/jumpGo, Tag-Routen geben aufgelöste Werte direkt weiter. Nutze leer nicht zum seitenübergreifenden Ausblenden. Deaktiviere jump.enabled und erhalte sinnvolle Namen.

```ts
i18n: {
  locales: {
    de: {
      messages: {
        blog: {
          previous: 'Vorherige Seite',
          next: 'Nächste Seite',
          paginationAria: 'Artikelseiten',
          jumpTo: 'Zur Seite springen',
          jumpInputLabel: 'Zielseitennummer',
          jumpGo: 'Los',
        },
      },
    },
  },
},
```

## 6. Tagverzeichnis und gemeinsame Einstiegstexte

<a id="tag-messages"></a>

Weiterhin `i18n.locales.<Sprachcode>.messages.blog` mit optionalen string-Überschreibungen und normalen Fallbacks. Wirkung setzt den jeweiligen Bereich voraus:

| Feld          | Standard vereinfachtes Chinesisch / Englisch | Wirkung und Grenzen                                                                                    |
| ------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `tags`        | 标签 / Tags                                  | Tag-Schnelleinstieg, Verzeichnis, Listenüberschrift und zugängliche Namen; ändert keine Tagtexte/Slugs |
| `allPosts`    | 全部文章 / All posts                         | Zurück-zu-allen-Einstieg und Startseitenbeschreibung, keine Gesamtzahländerung                         |
| `noTags`      | 暂无标签 / No tags yet.                      | Keine gültigen Tags im Verzeichnis, nicht keine Blogartikel                                            |
| `taggedPosts` | 文章 / Posts                                 | Anzahlbeschreibung und Tagseitenbeschreibung, kein manuell gesetzter Zähler                            |

```ts
i18n: {
  locales: {
    de: {
      messages: {
        blog: {
          tags: 'Nach Tags durchsuchen',
          allPosts: 'Zurück zu allen Artikeln',
          noTags: 'Noch keine Tags vorhanden.',
          taggedPosts: 'Artikel',
        },
      },
    },
  },
},
```

Leere Texte deaktivieren nichts und können leere Links oder unvollständige Beschreibungen hinterlassen. Verwende theme.tags.enabled, nicht false oder leer als Textwert.

## 7. Cards/List, Titelbilder und weitere Grenzen

<a id="view-and-limits"></a>

Implementiertes Verhalten, keine neuen Felder:

- Blog und Taglisten teilen Cards/List. Ohne gespeicherte Auswahl gilt cards. JavaScript erlaubt Wechsel; derselbe localStorage-Schlüssel teilt die Wahl über Blog, Tags und Sprachen. Ohne Speicher bleibt Wechsel möglich, Speicherung ungewiss.
- Keine site.config-Felder für Startansicht, Abschalten des Schalters, Ansichtstexte, Spaltennamen oder Kartenfarben. Schalter und Archivleiste nutzen eine interne Sprachtabelle mit Englisch-Fallback für neue Sprachen, nicht messages.blog.title.
- Karten zeigen Titel, Datum, Titelbild und höchstens zwei Tags. Keine Auszugsschalter, Zahl bevorzugter Bildkandidaten oder updatedDate-Sortierung. Eine Listen-Metabeschreibung macht description nicht zum Kartenauszug.
- Erste zwei tatsächlich vorhandene Titelbildkandidaten laden eager/high, weitere lazy. List blendet Bilder aus, verhindert aber nicht sicher deren Download. Vorbereitung und Größen erklärt das [Bildertutorial](/de/blog/starter-guide-images/).
- Blog-Sprachwechsel erhält die Seitennummer, wenn vorhanden, sonst erste Zielseite. Tagwechsel sucht denselben Tagtext und öffnet dessen erste Seite, sonst das Zielverzeichnis. Keine Tagübersetzung oder Synonymerkennung.
- Anzahl und Passage der Startseite stehen im [Startseitenverzeichnis](/de/blog/config-home/). Navigation, Suche, Fußzeile und Kommentare werden hier nicht neu definiert.

Es gibt keine zusätzlich aufzunehmenden alten listenspezifischen Kompatibilitätsfelder. blogView, showExcerpt und cardTheme sind keine akzeptierten Optionen. Beliebige Schlüssel aktivieren keine nicht konfigurierbaren Effekte.

## Wie Änderungen prüfen?

Prüfe in dev erste und spätere Blogseiten, Tagverzeichnis und eine Tagliste. Springen braucht genügend Seiten, fixed muss von random unterscheidbar sein. Metabeschreibungen stehen im head; große sichtbare Texte prüfen keine versteckten Labels oder zugänglichen Namen.

Baue und veröffentliche nach Anzahl- oder Tagänderungen vollständig und beachte alte Seiten-/Tagreste. Stoppe dev, starte npm run doctor und danach npm run preview. doctor enthält den Build; check und build nicht sofort wiederholen. Siehe [Installation](/de/blog/starter-guide-1-configure-your-site/) und [Deployment](/de/blog/starter-guide-deployment/).
