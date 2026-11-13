---
tags: ['anglefeint', 'config']
title: 'Konfigurationsverzeichnis: Giscus und gemeinsame Diskussionen'
subtitle: 'Verbindung, Zuordnung, Sprache und getrennte Artikel- und Fragment-Kommentare.'
description: 'Alle Giscus-Felder mit Typen, Vorgaben, Teilmodus-Regeln und Fragment-Überschreibungen.'
pubDate: '2026-11-13'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

Für die Einrichtung lies [Lesern Kommentare ermöglichen](/de/blog/starter-guide-4-giscus-comments/) mit Repository-Vorbereitung und Parametern. Den Konfigurationsort erklärt [Installation](/de/blog/starter-guide-1-configure-your-site/), andere Module das [Gesamtverzeichnis](/de/blog/config-reference/).

Gemeinsame Werte stehen unter theme.comments in src/site.config.ts. Kommentare sind standardmäßig aus. Vorgaben stammen aus dem Paket, nicht dem persönlichen Demo-Repository. IDs und Repository-Angaben werden öffentlich im HTML ausgegeben; keine GitHub-Tokens oder Geheimnisse eintragen.

<a id="controls"></a>

## Zwei getrennte Kommentarschalter

| Pfad                             | Typ / Standard  | Status, Wirkung und Grenzen                                                                                                                   | Beispiel                                                             |
| -------------------------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| theme.comments.enabled           | boolean / false | Bedingt: Artikelkommentare, nicht Fragment-Knöpfe. Fehlende Verbindungswerte können den Bereich verhindern; das ist keine Remote-Verifikation | theme: { comments: { enabled: true } }                               |
| theme.fragments.comments.enabled | boolean / false | Bedingt: Fragment-Liste bei aktivem theme.fragments.enabled. Unabhängig von Artikeln; fehlende Pflichtwerte scheitern beim Generieren         | theme: { fragments: { enabled: true, comments: { enabled: true } } } |

Kein einzelnes comments: false im Artikel-frontmatter und kein Kommentarschalter je Fragment. Startseitenvorschauen zeigen keine Kommentar-Knöpfe. Weitere [Fragment-Einstellungen](/de/blog/config-fragments/#comments-enabled).

## Alle Felder von theme.comments

Präfix theme.comments., etwa theme.comments.repo. Alle Felder dürfen in der partiellen Eingabe fehlen und werden aus Theme-Vorgaben ergänzt. String-Flags brauchen Anführungszeichen, keine boolean oder Zahlen.

Alle wirken bedingt: Artikel brauchen Aktivierung und Ausgabebedingungen. Fragments verwenden nur einige und überschreiben/ignorieren andere. Kein allgemeines „leer stellt Standard wieder her“. Neben expliziten Zuordnungsregeln beweisen Typ und Nichtleerheit keine gültige Giscus-Einrichtung.

<a id="connection"></a>

### Repository und Kategorie

| Feld         | Typ    | Standard | Wirkung, Bedingungen und Grenzen                                                                                            | Beispiel                          |
| ------------ | ------ | -------- | --------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| `repo`       | string | `""`     | GitHub owner/repo. Artikel verlangen truthy, Fragments nach trim nichtleer. Keine Rand-Leerzeichen; Remote-Rechte ungeprüft | `"your-account/blog-discussions"` |
| `repoId`     | string | `""`     | ID vom Giscus-Konfigurator, kein Name, numerische Reihenfolge oder Token; gemeinsam für Artikel/Fragments                   | `"YOUR_REPOSITORY_ID"`            |
| `category`   | string | `""`     | Tatsächlicher Diskussionskategoriename passend zu categoryId, kein Blog-Tag                                                 | `"Announcements"`                 |
| `categoryId` | string | `""`     | Giscus-Kategorie-ID, kein Name. Artikel truthy, Fragments nach trim nichtleer; Echtheit ungeprüft                           | `"YOUR_CATEGORY_ID"`              |

<a id="mapping"></a>

### Artikelzuordnung und strenge Treffer

| Feld      | Typ                                                                    | Standard     | Wirkung, Bedingungen und Grenzen                                                                                                                     | Beispiel                |
| --------- | ---------------------------------------------------------------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| `mapping` | 'pathname' \| 'url' \| 'title' \| 'og:title' \| 'specific' \| 'number' | `"pathname"` | Diskussionszuordnung, Werte unten. Teilmodus verlangt specific; Fragments ignorieren es                                                              | `"pathname"`            |
| `term`    | string                                                                 | `""`         | Ohne Teilen bei specific nach trim nichtleer, global fester Begriff. Teilmodus verlangt leer und setzt Artikel-Slug ein. Andere Modi senden es nicht | `"my-fixed-discussion"` |
| `number`  | string                                                                 | `""`         | Ohne Teilen bei number positiver sicherer Ganzzahl-String nach trim, ohne führende Null, Plus oder Dezimalen. Teilmodus leer; sonst nicht gesendet   | `"42"`                  |
| `strict`  | '0' \| '1'                                                             | `"0"`        | Strenge Artikelzuordnung als String, kein boolean. Teilen verlangt 1; Fragments erzwingen 1. Führt keine gleichnamigen Diskussionen zusammen         | `"1"`                   |

<a id="appearance"></a>

### Anzeige, Sprache und Laden

| Feld               | Typ                              | Standard      | Wirkung, Bedingungen und Grenzen                                                                                                              | Beispiel      |
| ------------------ | -------------------------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| `reactionsEnabled` | '0' \| '1'                       | `"1"`         | Hauptbeitragsreaktionen für Artikel/Fragments, kein Abschalten aller Kommentare                                                               | `"1"`         |
| `emitMetadata`     | '0' \| '1'                       | `"0"`         | Sendet Diskussionsmetadaten an Elternfenster. Artikel zeigen dadurch nicht automatisch Zähler; Fragments erzwingen 1 für Bereitschaft/Wechsel | `"0"`         |
| `inputPosition`    | 'top' \| 'bottom'                | `"bottom"`    | Eingabe ober-/unterhalb der Kommentarliste, nicht Position des gesamten Bereichs; gemeinsam                                                   | `"top"`       |
| `theme`            | string                           | `"dark"`      | Giscus-iframe-Theme, keine Matrix/Cyber/Hacker/AI-Szene. Gemeinsam, keine Namensvalidierung oder automatische Szenenumschaltung               | `"dark"`      |
| `lang`             | string                           | `"en"`        | Artikelsprache: nichtleer direkt Giscus, leer Seitensprache-Mapping. Fragments ignorieren und folgen immer der Seite. Keine Textübersetzung   | `""`          |
| `loading`          | 'lazy' \| 'eager'                | `"lazy"`      | Artikel-iframe-Ladehinweis, kein verzögertes client.js. Fragments eager erst nach Klick                                                       | `"lazy"`      |
| `crossorigin`      | 'anonymous' \| 'use-credentials' | `"anonymous"` | Client-script-Attribut, gemeinsam. Kein Login, Token oder Rechte-Reparaturschalter                                                            | `"anonymous"` |

<a id="sharing"></a>

## theme.comments.shareAcrossLocales: Artikelübersetzungen teilen Diskussionen

- **Typ / Standard:** boolean, optional / false.
- **Status und Wirkung:** bedingt bei aktiven Artikelkommentaren. Gleicher vollständiger Slug mehrerer Sprachen teilt eine Diskussion, verschiedene bleiben getrennt.
- **Grenzen:** mapping 'specific', nach trim leere term und number, strict als String '1'. Sonst Konfigurationsfehler; boolean allein reicht nicht. Bei deaktivierten Artikeln entfallen diese Aktivierungsregeln, Fragments prüfen weiter ihre Verbindung.
- **Beispiel:** unten. Keine Übersetzung, Zusammenführung alter Diskussionen oder Änderung der Fragment-Bindung.

| Artikelfile                          | Tatsächlicher term im Teilmodus |
| ------------------------------------ | ------------------------------- |
| src/content/blog/zh/my-first-post.md | my-first-post                   |
| src/content/blog/en/my-first-post.md | my-first-post                   |
| src/content/blog/zh/guides/setup.md  | guides/setup                    |
| src/content/blog/en/other/setup.md   | other/setup                     |

Vollständiger Slug ohne Sprachordner, nicht Titel, canonicalTopic oder Textähnlichkeit. Standardrouten liefern articleSlug. Eigene BlogPost-Aufrufe brauchen einen nichtleeren vollständigen Slug ohne Rand-Leerraum, leere Pfadsegmente oder . / ..-Segmente. Dieser Komponentenparameter ist kein site.config-Feld.

Mehrere Websites im selben Repository und derselben Kategorie mit gleichem Slug können dieselbe Diskussion treffen. Keine zusätzliche Domain-Isolation. Titeländerungen erhalten bei gleichem Pfad den term. Slug, Repository, Kategorie oder Zuordnungsstrategie können andere Diskussionen wählen.

<a id="mapping-values"></a>

## Bedeutung der mapping-Werte

| Wert     | Giscus-Grundlage             | Grenzen und Beispiele                                                                 |
| -------- | ---------------------------- | ------------------------------------------------------------------------------------- |
| pathname | Seiten-URL-Pfad              | Standard, meist je Sprache verschieden; Pfadwechsel kann Zuordnung ändern             |
| url      | Vollständige URL             | Domain-/Adresswechsel können wirken                                                   |
| title    | Dokument-title               | Artikel-/Website-Titel wirken, nicht nur Text-h1                                      |
| og:title | Open-Graph-Titel             | Vorhandene Metadaten, kein Titel in theme.comments                                    |
| specific | Angegebener term             | Ohne Teilen global fest, mit Teilen Artikel-Slug                                      |
| number   | Vorhandene Discussion-Nummer | Global feste Nummer als String wie '42', kein Issue und keine automatische Erstellung |

Zuordnung und Erstellung übernimmt Giscus. Ohne Treffer kann die erste Antwort/Reaktion eine Diskussion erzeugen; bloßes Öffnen garantiert das nicht. Öffentliches Repository, Discussions und Giscus-App sind nötig, siehe Tutorial und [offizielle Konfiguration](https://giscus.app/). Keine lokale Kommentardatenbank.

strict '1' verwendet Giscus-Titelhash im Diskussionstext, keinen lokalen Vergleich. Alte Diskussionen benötigen möglicherweise einen Marker; siehe [strenge Zuordnung](https://github.com/giscus/giscus/blob/main/ADVANCED-USAGE.md#data-strict). Teilen oder Mapping-Wechsel migriert, vereinigt und löscht keine Diskussion. Alte Kommentare können auf GitHub bleiben und unter der neuen Bindung fehlen. Kläre vor Migration die Beziehung alter Diskussionen zu neuen terms.

Ohne Teilen lässt specific mit festem term alle betroffenen Artikel dieselbe Diskussion suchen; number ist ebenfalls global. Keine automatische Einzel-ID. Unpassende term/number werden nicht an Giscus gesendet, aber das Theme trimmt beide trotzdem. Verwende keine null oder Zahlen statt Strings.

<a id="examples"></a>

## Beispiele zum Vereinigen

Vereinige mit bestehendem defineThemeConfig({...}) in src/site.config.ts; erhalte import, export und persönliche Werte ohne doppeltes theme. Die vier Verbindungswerte müssen aus deinem Giscus kommen. Platzhalter zeigen nur Struktur und validieren keine Online-Verbindung.

### Artikel nach Pfad trennen

```ts
theme: {
  comments: {
    enabled: true,
    repo: 'your-account/blog-discussions',
    repoId: 'YOUR_REPOSITORY_ID',
    category: 'Announcements',
    categoryId: 'YOUR_CATEGORY_ID',
    shareAcrossLocales: false,
    mapping: 'pathname',
    lang: '',
  },
},
```

### Übersetzungen eines Artikels teilen eine Diskussion

Erhalte echte Verbindung und vereinige die Zuordnung:

```ts
theme: {
  comments: {
    enabled: true,
    shareAcrossLocales: true,
    mapping: 'specific',
    term: '',
    number: '',
    strict: '1',
    lang: '',
  },
},
```

lang ist standardmäßig 'en', nicht „Seite folgen“. Leer aktiviert ausdrücklich das Sprachmapping: zh → zh-CN, zh-hant → zh-TW, pt-br → pt, andere Codes direkt. Giscus entscheidet über Unterstützung. Sprache ändert nur UI, keine Diskussionsidentität oder Besuchertexte. theme.comments ist global und wird nicht je i18n.locales kopiert.

theme geht direkt an Giscus, etwa 'dark'/'light'. Verfügbare Themes und CSS-URLs bestimmt Giscus, nicht das äußere AI-Panel. Siehe [Theme-Anleitung](https://github.com/giscus/giscus/blob/main/ADVANCED-USAGE.md#data-theme). Das Paket prüft weder Inhalt noch Erreichbarkeit eigenen CSS.

<a id="fragment-overrides"></a>

## Welche gemeinsamen Felder nutzen Fragments?

| Gemeinsames Feld                                       | Fragment-Verhalten                                                                                           |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| repo / repoId / category / categoryId                  | Gemeinsam; alle nach trim nichtleer, Originalwerte weitergegeben. Keine Rand-Leerzeichen oder Remote-Prüfung |
| theme / reactionsEnabled / inputPosition / crossorigin | Gemeinsame Originalwerte                                                                                     |
| enabled                                                | Ignoriert Artikelschalter, verwendet theme.fragments.comments.enabled                                        |
| shareAcrossLocales                                     | Ignoriert; stabile ID bindet bereits dieselbe Diskussion                                                     |
| mapping / term / number                                | Fest specific mit `fragment/<ID>`, keine number                                                              |
| strict / emitMetadata                                  | Fest '1' / '1'                                                                                               |
| lang                                                   | Gemeinsames lang ignoriert, stets aktuelle Fragment-Seitensprache                                            |
| loading                                                | Fest eager, Client aber erst nach erstem Kommentar-Klick                                                     |

Nur Fragment-Kommentare ohne Artikel:

```ts
theme: {
  comments: {
    enabled: false,
    repo: 'your-account/blog-discussions',
    repoId: 'YOUR_REPOSITORY_ID',
    category: 'Announcements',
    categoryId: 'YOUR_CATEGORY_ID',
  },
  fragments: { enabled: true, comments: { enabled: true } },
},
```

Mehrsprachige gleiche IDs teilen `fragment/<ID>` unabhängig vom Artikel-Slug-Teilen. Ändere IDs nicht für Reihenfolge oder Seiten. Dialog lädt erst beim Klick, behält iframe beim Schließen und wechselt Inhalte per Giscus-Konfigurationsnachricht. Nach etwa 15 Sekunden ohne gültiges Ergebnis Fehler/Wiederholen. Keine öffentlichen Timeout-/Preload-Felder. Sind Artikel gleichzeitig aktiv, gelten deren Mapping-Prüfungen auch dann, wenn du nur Fragments einrichten wolltest.

<a id="messages"></a>

## Kommentartexte außerhalb des iframes

Optionale string unter `i18n.locales.<语言>.messages` mit integrierter Sprache und Fallback. Beispiele in das jeweilige Objekt. Nur äußere Labels ändern sich, nicht Giscus-interne Knöpfe. Die Tabelle zeigt vereinfachtes Chinesisch/Englisch.

| Relatives Feld       | Standard vereinfachtes Chinesisch / Englisch                                                                              | Status, Wirkung und Grenzen                                                 | Beispiel             |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | -------------------- |
| `blog.comments`      | 评论 / Comments                                                                                                           | Bedingt: zugänglicher Artikelbereichsname, keine sichtbare Extraüberschrift | `"文章讨论"`         |
| `fragments.comments` | 评论 / Comments                                                                                                           | Bedingt: Fragment-Knopf und Dialogtitel                                     | `"参与讨论"`         |
| `fragments.close`    | 关闭 / Close                                                                                                              | Bedingt: Dialog-Schließen und zugänglicher Startseitenfenstername           | `"关闭窗口"`         |
| `fragments.loading`  | 正在加载评论… / Loading comments…                                                                                         | Bedingt: Fragment-Kommentarzustand                                          | `"正在加载讨论…"`    |
| `fragments.error`    | 评论未能加载，请检查网络或评论配置后重试。 / Unable to load comments. Check your network or comment settings, then retry. | Bedingt: Fragment-Kommentarfehler                                           | `"讨论暂时不可用。"` |
| `fragments.retry`    | 重试 / Retry                                                                                                              | Bedingt: Wiederholknopf nach Fehler                                         | `"重新加载"`         |

Andere Texte unter [Artikel](/de/blog/config-article/#article-messages) und [Fragments](/de/blog/config-fragments/#fragment-messages). Diese Felder bestimmen nicht die iframe-Sprache; dafür gilt lang oben.

<a id="limits"></a>

## Lade- und Validierungsgrenzen

Artikel geben asynchrones client.js aus. loading 'lazy' gilt dem iframe und wartet nicht mit dem Skript bis zum Scrollen. Fragments geben zuerst Templates aus und fügen den Client nach Klick ein. Deren eager beschreibt das iframe danach. Die [Giscus-Dokumentation](https://giscus.app/) unterscheidet beide Ebenen.

Lokaler Code prüft Artikelmapping und Fragment-Pflichtfelder, nicht GitHub-Anmeldung, App-Rechte, Sichtbarkeit, Kategorie, Netzwerk oder Dienstverfügbarkeit. Leere Artikelfelder können das Rendern verhindern; reine Leerzeichen können die Ausgabebedingungen bestehen und sind keine korrekte Konfiguration. Fragments prüfen Nichtleerheit strenger, aber keine ID-Echtheit.

Alle theme.comments-Felder haben Verbraucher, nicht alle gelten für Fragments. Überschreibungen stehen oben. Keine öffentlichen Einzelkommentarschalter, Selfhosting-Adresse, Sortierung, Admin-Tokens oder lokale Datenbank. Der Client ist fest https://giscus.app/client.js. Giscus-Repository-Konfiguration ist kein zusätzliches site.config-Feld.

Nach Änderungen neu bauen und veröffentlichen. Build-Erfolg ist keine Dienstabnahme. Migrationen und Rechte gehören zu GitHub/Giscus und geschehen nicht beim Speichern von site.config. Weitere Module im [Gesamtverzeichnis](/de/blog/config-reference/).
