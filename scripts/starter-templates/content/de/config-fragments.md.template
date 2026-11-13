---
tags: ['anglefeint', 'config']
title: 'Konfigurationsverzeichnis: Fragments'
subtitle: 'Schalter, Seiteneinteilung, Texte, Kommentare und stabile Eintragsfelder.'
description: 'Alle Fragment-Felder mit Typen, Standards, Grenzen und festen Vorschau- und Freigaberegeln.'
pubDate: '2026-11-13'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

Zum ersten Veröffentlichen lies [Ein Fragment veröffentlichen](/de/blog/starter-guide-5-fragments/); hier schlägst du Einstellungen nach. Installation und Konfigurationsort erklärt [Teil 1](/de/blog/starter-guide-1-configure-your-site/), alle Module findest du im [Gesamtverzeichnis](/de/blog/config-reference/).

Vorgaben beziehen sich auf das Theme-Paket, nicht die Demo. Vereinige Ausschnitte mit dem bestehenden `defineThemeConfig({...})` in `src/site.config.ts` und lege theme oder i18n nicht doppelt an.

## Zuerst den gewünschten Bereich finden

| Ziel                                        | Konfigurationspfad oder Ort                                          |
| ------------------------------------------- | -------------------------------------------------------------------- |
| Liste und Startseiteneinstieg aktivieren    | `theme.fragments.enabled`                                            |
| Einträge je vollständiger Listenseite       | `theme.fragments.pageSize`                                           |
| Eigene Fragment-Kommentare                  | `theme.fragments.comments.enabled`; Verbindung über `theme.comments` |
| Titel, Beschreibung, Hinweise und Schließen | `i18n.locales.<语言>.messages.fragments`                             |
| Seitennummern und Springen                  | `theme.pagination` und Texte in `messages.blog`                      |
| ID, Zeit und Titel eines Eintrags           | Markdown-frontmatter, nicht site.config                              |
| Startseitenanzahl, Vorschauhöhe und Avatar  | Derzeit keine öffentlichen Felder                                    |

<a id="enabled"></a>

## theme.fragments.enabled: Fragments aktivieren

- **Typ / Standard:** boolean / `false`.
- **Status / Wirkung:** wirksam. Lädt `src/content/fragments/<语言>/**/*.md` und erzeugt Listen und Positionsindizes aktiver Sprachen. Die Startseite zeigt den Einstieg bei Inhalten dieser Sprache.
- **Grenzen:** Deaktiviert lädt es die Sammlung nicht und erzeugt keine Listenrouten; Dateien bleiben erhalten. Aktiv ohne Inhalte erscheint ein Leerzustand, aber kein Startseiteneinstieg. Nur `.md`, kein `.mdx`.
- **Beispiel:** `theme: { fragments: { enabled: true } }`.

Die erste Seite ist `/<语言>/fragments/`, danach etwa `/<语言>/fragments/2/`, nicht `/1/`. Die Sprache muss aktiv sein, siehe [Sprachentutorial](/de/blog/starter-guide-languages/).

Bei `theme.fragments.enabled: false` überspringen dev, build und prepare-covers/doctor Bildverweise im Fragments-Inhalt. Nur über diese Verweise aufgenommene Bilder benötigen dann keine Originale oder Ableitungen. Artikel-Cover-Verweise und die Pools `src/assets/blog/default-covers/` und `src/assets/blog/covers/originals/` werden weiterhin vorbereitet und geprüft, auch bei ausschließlich für Fragments verwendeten Bildern. Dateien bleiben erhalten; erneutes Aktivieren setzt die Fragments-Verarbeitung fort.

**Versionshinweis:** Bildisolierung bei deaktivierten Fragments erfordert mindestens 0.36.1 und fehlt in 0.36.0. Setze dieses Verhalten in älteren Versionen nicht voraus.

<a id="page-size"></a>

## theme.fragments.pageSize: Einträge je Listenseite

- **Typ / Standard:** number / `20`.
- **Status / Wirkung:** wirksam für Seiteneinteilung und ID-zu-Seite-Index.
- **Grenzen:** **Sichere Ganzzahl von 1 bis 100**. Brüche, 0, negative und zu große Werte sind Fehler, keine automatische Begrenzung. Auch deaktivierte Fragments validieren gesetztes pageSize. Startseitenvorschauen bleiben höchstens drei, unabhängig hiervon und von `theme.homeLatestCount`.
- **Beispiel:** `theme: { fragments: { pageSize: 10 } }`.

Innerhalb einer Sprache sortiert pubDate absteigend, bei Gleichstand ID per `localeCompare`. Dateinamen sortieren nicht, zukünftige Daten werden nicht ausgefiltert. Seitengrößenänderungen verschieben Einträge; teile stabile Links unten.

<a id="comments-enabled"></a>

## theme.fragments.comments.enabled: Fragment-Kommentare

- **Typ / Standard:** boolean / `false`.
- **Status / Wirkung:** bedingt. Bei aktiven Fragments zeigt jede vollständige Listenkarte einen Kommentar-Knopf. Er öffnet einen gemeinsamen Dialog mit ihrer Diskussion. Startseitenvorschauen haben keinen solchen Knopf.
- **Grenzen:** Unabhängig von `theme.comments.enabled` für Artikel. Gemeinsame Giscus-Verbindungswerte sind erforderlich; fehlende Werte scheitern beim Seitengenerieren auch bei leerer Liste. Giscus-Dienst und Repository-Rechte müssen stimmen.
- **Beispiel:** `theme: { fragments: { enabled: true, comments: { enabled: true } } }`.

Fragments ohne Kommentare:

```ts
theme: {
  fragments: {
    enabled: true,
    pageSize: 10,
    comments: { enabled: false },
  },
},
```

Nur Fragment-Kommentare dürfen Artikel false lassen, brauchen aber repo, repoId, category und categoryId. Typen, Vorgaben und Validierung stehen unter [Giscus-Verbindung](/de/blog/config-comments/#connection), ein vollständiges Beispiel unter [nur Fragment-Kommentare](/de/blog/config-comments/#fragment-overrides). Lokale Prüfungen beweisen keine Remote-Rechte oder echten IDs.

Fragmente binden mit `fragment/<稳定ID>`. Gleiche IDs mehrerer Sprachen teilen Diskussionen. Artikel-mapping, term, number und shareAcrossLocales gelten nicht. Fest sind specific, strict `'1'` und emitMetadata `'1'`. Die Sprache folgt der Seite statt `theme.comments.lang`. Gleichzeitig aktive Artikel führen ihre eigenen Prüfungen weiterhin aus.

Farbschema, Reaktionen und Eingabeposition bleiben gemeinsame Giscus-Werte, siehe Kommentartutorial. Erst der erste Klick fügt das Skript ein. Festes loading eager meint sofort nach Klick, nicht im ersten Seitenbild. Schließen erhält das iframe; Eintragswechsel wechseln die Diskussion. Nach etwa 15 Sekunden ohne gültige Antwort erscheint Fehler/Wiederholen. Es gibt kein öffentliches Timeout-Feld.

<a id="fragment-messages"></a>

## Fragment-Texte: messages.fragments

Präfix: `i18n.locales.<语言>.messages.fragments`. Jedes Feld ist **string** und ändert nur Text. Vorgaben kommen aus aktueller integrierter Sprache und Fallbacks. Die Tabelle zeigt nur vereinfachtes Chinesisch/Englisch. Weglassen erhält Vorgaben, leer überschreibt ausdrücklich und entfernt nicht unbedingt den Knopf. Beispiele gehören in fragments.

| Feld             | Standard vereinfachtes Chinesisch / Englisch                                                                              | Status, Wirkung und Grenzen                                                                              | Beispiel                                |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| `title`          | 碎片 / Fragments                                                                                                          | Bedingt: Listenüberschrift, Teil des Seitentitels und zugänglicher Startseiteneinstieg, kein Einzeltitel | `title: '随手记'`                       |
| `description`    | 沿途记录的几句话。 / Brief thoughts, kept along the way.                                                                  | Bedingt: sichtbare Listeneinführung und Metabeschreibung, nicht im Startseitenfenster                    | `description: '记录工作与生活的小事。'` |
| `empty`          | 还没有碎片。 / No fragments yet.                                                                                          | Bedingt: Hinweis bei leerer vollständiger Liste; erzwingt keinen Startseiteneinstieg                     | `empty: '稍后再来看看。'`               |
| `comments`       | 评论 / Comments                                                                                                           | Bedingt: Knopftext bei aktiven Kommentaren                                                               | `comments: '参与讨论'`                  |
| `close`          | 关闭 / Close                                                                                                              | Bedingt: Dialog-Schließtext und zugänglicher Schließname im Startseitenfenster                           | `close: '关闭窗口'`                     |
| `previous`       | 上一页 / Previous                                                                                                         | **Derzeit ungenutzt**: Typ akzeptiert, echte Seitennavigation nutzt messages.blog.previous               | `previous: '上一页'`                    |
| `next`           | 下一页 / Next                                                                                                             | **Derzeit ungenutzt**: echte Navigation nutzt messages.blog.next                                         | `next: '下一页'`                        |
| `loading`        | 正在加载评论… / Loading comments…                                                                                         | Bedingt: Kommentar-Ladezustand                                                                           | `loading: '正在连接讨论…'`              |
| `error`          | 评论未能加载，请检查网络或评论配置后重试。 / Unable to load comments. Check your network or comment settings, then retry. | Bedingt: Kommentar-Ladefehler, kein Positionsindexfehler                                                 | `error: '讨论暂时不可用，请重试。'`     |
| `retry`          | 重试 / Retry                                                                                                              | Bedingt: Wiederholen nach Kommentarfehler                                                                | `retry: '重新连接'`                     |
| `copyLink`       | 复制碎片链接 / Copy fragment link                                                                                         | Bedingt: Titel und zugänglicher Name des vom Skript aktivierten Freigabeknopfs                           | `copyLink: '复制本条链接'`              |
| `linkCopied`     | 链接已复制 / Link copied                                                                                                  | Bedingt: Kopiererfolg                                                                                    | `linkCopied: '已复制'`                  |
| `copyLinkFailed` | 未能自动复制，请复制下方链接。 / Unable to copy automatically. Copy the link below.                                       | Bedingt: Hinweis zum manuellen Kopieren nach Zwischenablagefehler                                        | `copyLinkFailed: '请手动复制此链接。'`  |
| `notFound`       | 找不到这条碎片，它可能已被移除。 / Fragment not found. It may have been removed.                                          | Bedingt: stabile ID nicht gefunden, kein allgemeiner 404-Text                                            | `notFound: '这条记录已不存在。'`        |
| `indexError`     | 暂时无法定位这条碎片，请刷新页面后重试。 / Unable to locate this fragment. Refresh the page and try again.                | Bedingt: Anfrage oder Validierung des Positionsindex gescheitert                                         | `indexError: '定位失败，请刷新重试。'`  |

Nur chinesischen Titel und Beschreibung überschreiben:

```ts
i18n: {
  locales: {
    zh: {
      messages: {
        fragments: {
          title: '随手记',
          description: '记录工作与生活的小事。',
        },
      },
    },
  },
},
```

<a id="shared-settings"></a>

## Weitere gemeinsame Einstellungen

| Pfad                                                                                                         | Standard und Wirkung                                                  | Grenzen, Beispiel und Beschreibung                                                                                                                                                                   |
| ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `theme.pagination.*`                                                                                         | Acht gemeinsame Blog-List-Felder mit denselben Vorgaben               | Erst bei mehreren Seiten; etwa `theme: { pagination: { windowSize: 5 } }`. Typen, Bereiche und Beispiele unter [Seiteneinteilung](/de/blog/config-blog-list/#pagination-window) und Folgeabschnitten |
| `i18n.locales.<语言>.messages.blog.previous`、`next`、`paginationAria`、`jumpTo`、`jumpInputLabel`、`jumpGo` | string, integrierte Sprache für sichtbare und zugängliche Seitentexte | Etwa `previous: '上一页'`; [Seitentexte](/de/blog/config-blog-list/#pagination-messages), nicht gleichnamige fragments-Felder ändern                                                                 |
| `i18n.locales.<语言>.messages.blog.backToTop`                                                                | string, integrierte Sprache                                           | Nach-oben-Knopf der Liste, etwa `backToTop: '回到顶部'`; [Artikeltexte](/de/blog/config-article/#article-messages)                                                                                   |
| `i18n.locales.<语言>.messages.home.viewAll`                                                                  | string, integrierte Sprache                                           | Zugänglicher Archivlink unten kombiniert den Fragment-Titel; etwa `viewAll: '查看全部'`, [Startseitentexte](/de/blog/config-home/#home-messages)                                                     |
| `theme.math.enabled`                                                                                         | boolean / `true`                                                      | Die aktuelle Listenseite bestimmt benötigte Math-Stile; etwa `theme: { math: { enabled: false } }`, [Mathematik](/de/blog/config-article/#feature-switches)                                          |

Alle gemeinsamen `theme.comments`-Parameter stehen im [Giscus-Verzeichnis](/de/blog/config-comments/). Die Verbindungsfelder und Abweichungen hier machen Artikel-Mapping nicht zu Fragment-Konfiguration. `theme.toc.enabled`, OUTPUT, Red Queen und andere Artikelfunktionen steuern die Liste nicht. Fragments haben auch keinen Cards/List-Wechsel.

<a id="content-fields"></a>

## Drei frontmatter-Felder pro Fragment

Sie gehören in Markdown unter `src/content/fragments/<语言>/`, **nicht in site.config**. Das öffentliche Schema umfasst genau diese drei, keine zusätzlichen Kompatibilitätsfelder.

| Feld      | Typ / Standard                                       | Wirkung, Status und Grenzen                                                                                                           | Beispiel                              |
| --------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| `id`      | string / keiner, Pflicht                             | Wirksam. Genau acht ASCII-Buchstaben/Ziffern, pro Sprache einmalig. Links und Kommentare hängen daran; nach Veröffentlichung erhalten | `id: 'aB3dE6gH'`                      |
| `pubDate` | Zu Date konvertierbarer Datumswert / keiner, Pflicht | Wirksam. Parsebares Datum für Sortierung, UTC-Anzeige. ISO mit Zeitzone vermeidet Mehrdeutigkeit                                      | `pubDate: '2026-11-13T08:00:00.000Z'` |
| `title`   | string, optional / nicht gesetzt                     | Bedingt. Karten- und Vorschautitel; auch ohne veröffentlichbar. Kein automatischer Dateiname als Titel                                | `title: '今天的小发现'`               |

```md
---
id: 'aB3dE6gH'
pubDate: '2026-11-13T08:00:00.000Z'
title: '今天的小发现'
---

这里写正文。图片和代码直接放在 Markdown 正文中。
```

`npm run new-fragment -- --locales zh,en` erzeugt Dateien mit gemeinsamer neuer ID und aktueller Zeit. Jeder Aufruf erzeugt eine neue ID. Für Übersetzungen bestehender Fragments erhalte die ursprüngliche Identität. Verschiedene Sprachen dürfen dieselbe ID haben, innerhalb einer Sprache sind Duplikate Fehler. Dateinamen dürfen sich ändern, IDs nicht mit Namen oder Seite. Alte Formate migrieren nicht automatisch; Änderungen verschieben Kommentarzuordnung und Freigabeadresse.

`description`, `heroImage`, `tags`, `draft` und einzelnes `comments` haben keinen Fragment-Verbraucher. Übertrage Artikel-frontmatter nicht blind. Besonders `draft: true` schafft keinen Entwurf. Nicht öffentliche Inhalte gehören nicht in die aktivierte Sammlung.

<a id="preview-and-links"></a>

## Feste Vorschau-, Bild- und Linkregeln

Diese Regeln kommen aus der Implementierung, ohne weitere öffentliche Felder:

- **Startseitenanzahl:** Neueste drei der aktuellen Sprache, bei weniger tatsächliche Anzahl. Unten steht ein Archivlink „angezeigt / Gesamtzahl dieser Sprache“. Andere Sprachen füllen nicht auf.
- **Zusammenfassung:** Aus gerendertem Inhalt: Text, erstes geeignetes HTTP(S)-Bild, erster Codeblock. Höchstens 180 Unicode-Codepunkte Text, acht Zeilen und 800 Codepunkte Code, danach Auslassungszeichen. Vorschaukarten schneiden Überhang ab; vollständige Inhalte bleiben in der Liste. Titel erscheint separat. Kein vollständiges Markdown und keine previewCount-/previewHeight-Felder.
- **Bilder:** Unterstützte lokale Dateien erhalten Maße und srcset aus dem Manifest. Externe oder nicht unterstützte Bilder sind nicht garantiert optimiert. Erstes Bild jeder vollständigen Listenseite eager/high, weitere lazy, alle asynchron dekodiert. Originale und Vorbereitung erklärt das [Bildertutorial](/de/blog/starter-guide-images/). Ein Fragment-heroImage ist nicht nötig.
- **Stabile Links:** `/<语言>/fragments/#<ID>`. Das Skript sucht die aktuelle Seite im Index und wechselt nötigenfalls. Neue Inhalte und pageSize-Änderungen behalten ID-Ortung, Löschungen und ID-Änderungen nicht. Ohne JavaScript bleiben normale Seiten bedienbar, nicht automatische Cross-Page-Ortung und Kopierknopf.
- **Sprachwechsel:** Führt zur Fragment-Startseite der Zielsprache, nicht garantiert zur gleichen ID.
- **Öffentliche Inhalte:** Markdown-Sammelausgabe unter `/<语言>/fragments/index.md`. Kein Schalter für Suche oder Artikel-RSS. Keine sensiblen Informationen veröffentlichen.

Avatar, Hover-Animationen, Fensterrahmen und Code-Vorschauhöhe sind derzeit keine site.config-Felder. Dieses Verzeichnis bietet keine erfundenen Optionen. Weitere Module im [Gesamtverzeichnis](/de/blog/config-reference/).
