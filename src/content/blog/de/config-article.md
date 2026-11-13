---
tags: ['anglefeint', 'config']
title: 'Konfigurationsverzeichnis: Artikeldetailseite'
subtitle: 'Funktionsschalter, 22 Beitragsfelder und Texte der Artikeloberfläche.'
description: 'Typen, Vorgaben, Grenzen und Kompatibilitätsstatus von frontmatter, OUTPUT, Bildern und Artikelinteraktionen.'
pubDate: '2026-11-13'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/ai-02.webp'
---

**Versionshinweis:** Live-Anpassung an reduzierte Bewegung und einheitliche Autoren-/Vorschaubildschlüssel erfordern mindestens 0.36.1; die Korrekturen fehlen in 0.36.0.

[Zurück zum Gesamtverzeichnis](/de/blog/config-reference/). Prüfe zuerst den Ort: Globale Funktionen/Texte gehören nach `src/site.config.ts`, Titel, Datum, Bilder und Kennzahlen eines Artikels ins Markdown-/MDX-frontmatter. Vertausche sie nicht.

Grundlage sind die Standardartikelrouten des Pakets. Sie erzeugen aktive Sprachseiten und liefern je Inhalt Verzeichnis, Kennzahlen, Übersetzungslinks und bis zu drei andere Artikel. Eigene direkte BlogPost-Aufrufe müssen passende Eigenschaften selbst liefern und erhalten nicht automatisch alle Routenfunktionen.

## 1. Globale Funktionsschalter

<a id="feature-switches"></a>

Felder unter theme in site.config, alle `boolean` und standardmäßig `true`. Beispiele je Zeile lassen sich in theme vereinigen; wähle nach Bedarf statt alles abzuschalten.

| Vollständiger Pfad             | Wirkung und Bedingungen                                                                    | Grenzen und Beispiel                                                                                                                  |
| ------------------------------ | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| `theme.toc.enabled`            | Standard-Inhaltsverzeichnis aus Markdown-h2/h3 des Compilers, ohne Überschriften verborgen | Einzelnes toc true/false geht vor. Komponenten/HTML-Titel werden nicht gesammelt; `toc: { enabled: false }`                           |
| `theme.math.enabled`           | Markdown-/MDX-Mathematik, Stile nur bei tatsächlichen Formeln                              | Global ohne Einzel-math. Fehlerhafte Formeln scheitern beim Kompilieren; deaktiviert andere Parserregeln. `math: { enabled: false }`  |
| `theme.effects.enableRedQueen` | Red-Queen-Monitor neben dem Artikel                                                        | false deaktiviert weder Netz, Cover-Canvas noch ganze AI-Atmosphäre; `effects: { enableRedQueen: false }`                             |
| `theme.search.enabled`         | Such-Einstieg und Index, siehe [Suche](/de/blog/config-search/#enabled)                    | Einzelnes search false schließt aus, true aktiviert global ausgeschaltete Suche nicht; `search: { enabled: false }`                   |
| `theme.tags.enabled`           | Taglinks, Tagverzeichnis und Taglisten                                                     | false löscht tags nicht; `tags: { enabled: false }`, [voller Umfang](/de/blog/config-blog-list/#tags-enabled)                         |
| `theme.socialImage.enabled`    | Automatisches 1200×630-Freigabebild ohne explizites ogImage                                | false erhält manuelles ogImage und fällt auf Titelbild/Standard zurück, verbirgt keine Titelbilder; `socialImage: { enabled: false }` |

Alle wirken bedingt durch Inhalt, Bereich und Prioritäten. Etwa nur das Standardverzeichnis abschalten:

```ts
theme: { toc: { enabled: false } },
```

h3 können unter h2 verschachtelt oder einzeln erscheinen; tiefere Ebenen fehlen im Verzeichnis. Text erscheint weiterhin direkt und wartet nicht auf das Verzeichnis.

## 2. Gemeinsame Autor-, Nennungs-, Bild- und Kommentarwerte

<a id="shared-controls"></a>

Hier nur ihr tatsächlicher Artikelbezug:

| Vollständiger Pfad         | Artikelbezug                                                                                    | Hauptbeschreibung                                             |
| -------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `site.author`              | Autor-Fallback bei fehlendem/leerem Einzelautor und Quelle für Freigabebilder                   | [Website](/de/blog/config-site-chrome/#identity)              |
| `theme.enableAboutPage`    | Bei aktivem About und Autor gleich Website-Autor Link zur Sprach-About-Seite, sonst Klartext    | [About](/de/blog/config-about/#page-enabled)                  |
| `theme.footer.showCredits` | Theme-Nennung auf automatischen Freigabebildern, nicht eigenen Bildern                          | [Fußzeile](/de/blog/config-site-chrome/#footer)               |
| `site.ogImage`             | Website-Bild ohne höher priorisiertes Seitenbild                                                | [Identität und Bilder](/de/blog/config-site-chrome/#identity) |
| `theme.comments.enabled`   | Artikel brauchen vollständige Verbindung und gültiges Mapping, kein Einzel-frontmatter-Schalter | [Giscus](/de/blog/config-comments/#controls)                  |

## 3. Beitragsfelder: nicht in site.config

<a id="frontmatter"></a>

Vollständige 22 frontmatter-Felder, keine neuen site.config-Felder. Typen beziehen sich auf Autoreneingaben; Daten werden Date, lokale Bilder Metadaten.

### Inhalt und Metadaten

| Feld          | Typ und Standardverhalten                                | Wirkung, Grenzen und Beispiel                                                                               |
| ------------- | -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `title`       | Pflicht-string, kein Standard                            | Titel und Metadaten, kein Website-Name; `title: '我的笔记'`                                                 |
| `description` | Pflicht-string, kein Standard                            | Metabeschreibung und ohne context Kontextzeile, nicht Volltext; `description: '一次调试的记录。'`           |
| `pubDate`     | Pflicht, parsebares Datum, kein Standard                 | Veröffentlichung, Listenfolge und Metadaten, UTC-Anzeige, Zukunft versteckt nicht; `pubDate: '2026-11-13'`  |
| `updatedDate` | Optionales Datum, nicht gesetzt                          | Aktualisierung sichtbar und Sitemap-priorisiert, keine pubDate-Sortieränderung; `updatedDate: '2026-11-14'` |
| `author`      | Optionaler string, fehlend/Leerraum Website-Autor        | Keine automatische Autorenseite; `author: '另一位作者'`                                                     |
| `subtitle`    | Optionaler string, nicht gesetzt                         | Untertitel, bei gleichem Kontext nicht doppelt; `subtitle: '从现象到定位'`                                  |
| `context`     | Optionaler string, sonst description                     | Kontextzeile, leer verbirgt ohne Metabeschreibung zu leeren; `context: '解决一个具体问题。'`                |
| `tags`        | Optionales string-Array, sonst keine Tags                | Links auch vom globalen Tagschalter abhängig; `tags: ['astro', '笔记']`                                     |
| `heroImage`   | Optionaler lokaler Bildpfad, sonst kein Titelbildbereich | Keine Remote-URL oder public-URL nach Textbildregeln; `heroImage: ./cover.jpg`, Datei vorbereiten           |
| `ogImage`     | Optional lokal/public/HTTPS, sonst Bildfallback          | Kein Texter-/Titelbildersatz; `ogImage: /images/share.png`, Datei vorbereiten                               |
| `toc`         | Optionaler boolean, globale Vorgabe                      | true überschreibt globale Deaktivierung, ohne Überschriften trotzdem unsichtbar; `toc: false`               |
| `search`      | Optionaler boolean, Standard true                        | false schließt interne Suche aus, nicht Artikel, RSS, Sitemap oder KI-Export; `search: false`               |

Beginne mit Pflichtwerten und ergänze später:

```yaml
---
title: '我的笔记'
description: '一次调试的记录。'
pubDate: '2026-11-13'
subtitle: '从现象到定位'
context: '解决一个具体问题。'
tags: ['astro', '笔记']
toc: true
search: true
---
```

Kein draft, geplante Veröffentlichung, Einzel-comments, Einzel-Red-Queen oder Einzel-Mathematikschalter. Unfertiges gehört außerhalb des Inhaltsordners; unbekannte Felder sind keine Privatsphärenkontrolle.

<a id="output-fields"></a>

### OUTPUT-Kennzahlen und Status

| Feld         | Typ und Standardverhalten                                                  | Wirkung, Grenzen und Beispiel                                                 |
| ------------ | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `wordCount`  | Optionale nichtnegative Ganzzahl, aus Textquelle                           | Unabhängige Zählüberschreibung; `wordCount: 800` ändert tokenCount nicht      |
| `tokenCount` | Optionale nichtnegative Ganzzahl, round(max(automatische Anzahl, 1) × 1.3) | Schätzung, kein Tokenizer oder Verbrauch; `tokenCount: 1040`                  |
| `aiModel`    | Optionaler string, sonst kein Label                                        | Titelstatus und OUTPUT ohne Modellverifikation; `aiModel: '作者填写的模型名'` |
| `aiMode`     | Optionaler string, sonst kein Label                                        | Nur Modustext, keine Aufgabe; `aiMode: 'notes'`                               |
| `aiState`    | Optionaler string, sonst kein Label                                        | Nur Statustext, keine Gesundheitsabfrage; `aiState: 'edited'`                 |

Automatische Zählung entfernt Teile von Markdown, Code und Links. CJK, Kana und Koreanisch zählen zeichenweise, anderes hauptsächlich nach Leerraum. Formeln und MDX-Quelle können die Schätzung beeinflussen. Nur wordCount zu setzen berechnet tokenCount nicht neu. Ab 1.000 erscheinen beide mit einer Dezimalstelle und k, ohne Rohwerte zu ändern.

```yaml
wordCount: 800
tokenCount: 1040
aiModel: '作者填写的模型名'
aiMode: 'notes'
aiState: 'edited'
```

<a id="legacy-frontmatter"></a>

### Kompatibilität und derzeit ungenutzte Felder

| Feld             | Typ und Standard                                | Status, Grenzen und Beispiel                                                                                                                                    |
| ---------------- | ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `readMinutes`    | Optionale positive Ganzzahl, nicht gesetzt      | Kompatibilität, Lesedauer nicht gezeigt; `readMinutes: 3` stellt sie nicht wieder her                                                                           |
| `aiLatencyMs`    | Optionale nichtnegative Ganzzahl, nicht gesetzt | Kompatibilität, Latenz nicht gezeigt; `aiLatencyMs: 150` ist keine Messung                                                                                      |
| `aiConfidence`   | Optionale number 0–1, nicht gesetzt             | Kompatibilität, Konfidenz nicht gezeigt; `aiConfidence: 0.9` ist keine Richtigkeitsbewertung                                                                    |
| `canonicalTopic` | Optionaler string, nicht gesetzt                | Derzeit ungenutzt; `canonicalTopic: 'astro'` erzeugt kein Thema oder canonical                                                                                  |
| `sourceLinks`    | Optionales Adressarray, nicht gesetzt           | Nur Validierung/Normalisierung von HTTP(S), nackte Domains plus https; `sourceLinks: ['https://example.com/']` zeigt keine Referenzen und ergänzt keine Exporte |

Sichtbare Quellen gehören als Markdown-Links in den Text. Akzeptierte Altfelder beweisen keine vorhandene Oberfläche; du musst sie auch nicht nur für ein Upgrade löschen.

## 4. Artikel-Oberflächentexte

<a id="article-messages"></a>

Präfix `i18n.locales.<语言>.messages.blog`, optionale string-Überschreibungen mit normaler Sprachauflösung. Tabelle zeigt vereinfachtes Chinesisch/Englisch. Beispiele sind einzelne Mitglieder des blog-Objekts, kein frontmatter.

Wirksame Texte brauchen ihren Bereich. Leer kann Labels leeren, verbirgt nicht die ganze Funktion; zugängliche Namen nicht leeren. Ungenutzte Felder haben keinen Seiteneffekt.

| Feld                 | Standard vereinfachtes Chinesisch / Englisch | Wirkung und Grenzen                                          | Status            | Mitgliedsbeispiel                 |
| -------------------- | -------------------------------------------- | ------------------------------------------------------------ | ----------------- | --------------------------------- |
| `rqBadge`            | 监视器信号 / monitor feed                    | Monitor-Badge bei Red Queen, kein echtes Monitoring          | Bedingt wirksam   | `rqBadge: "监视器信号"`           |
| `rqReplayAria`       | 重放监视器信号 / Replay monitor feed         | Replay-Knopfname ohne Material-/Strategiewechsel             | Bedingt wirksam   | `rqReplayAria: "重放监视器信号"`  |
| `backToTop`          | 返回顶部 / Back to top                       | Nach-oben-Name, sichtbar nach Scrollzustand                  | Bedingt wirksam   | `backToTop: "返回顶部"`           |
| `toastP10`           | 语境解析 10% / context parsed 10%            | Früher Lesehinweis, kein KI-Fortschritt                      | Bedingt wirksam   | `toastP10: "语境解析 10%"`        |
| `toastP30`           | 语境解析 30% / context parsed 30%            | Lesehinweis, kein Semantikergebnis                           | Bedingt wirksam   | `toastP30: "语境解析 30%"`        |
| `toastP60`           | 推理稳定 60% / inference stable 60%          | Lesehinweis, kein Modellzustand                              | Bedingt wirksam   | `toastP60: "推理稳定 60%"`        |
| `toastDone`          | 输出完成 / output finalized                  | Leseabschluss, keine Erzeugungs-/Validierungsgarantie        | Bedingt wirksam   | `toastDone: "输出完成"`           |
| `metaPublished`      | 发布 / published                             | Veröffentlichungslabel, keine Datumsänderung                 | Bedingt wirksam   | `metaPublished: "发布"`           |
| `metaAuthor`         | 作者 / by                                    | Autorenlabel, kein Wertwechsel                               | Bedingt wirksam   | `metaAuthor: "作者"`              |
| `metaUpdated`        | 更新 / updated                               | Aktualisierungslabel nur mit updatedDate                     | Bedingt wirksam   | `metaUpdated: "更新"`             |
| `systemStatusAria`   | 模型状态 / Model status                      | Zugänglicher Titelstatusname mit mindestens einem Statusfeld | Bedingt wirksam   | `systemStatusAria: "模型状态"`    |
| `systemModelLabel`   | 模型 / model                                 | Modelllabel mit aiModel, auch OUTPUT                         | Bedingt wirksam   | `systemModelLabel: "模型"`        |
| `systemModeLabel`    | 模式 / mode                                  | Moduslabel mit aiMode                                        | Bedingt wirksam   | `systemModeLabel: "模式"`         |
| `systemStateLabel`   | 状态 / state                                 | Statuslabel mit aiState                                      | Bedingt wirksam   | `systemStateLabel: "状态"`        |
| `promptContextLabel` | 语境 / Context                               | Kontextlabel mit nichtleerem Kontext                         | Bedingt wirksam   | `promptContextLabel: "语境"`      |
| `heroMonitor`        | 神经监视器 / neural monitor                  | Titelbild-Monitor mit heroImage                              | Bedingt wirksam   | `heroMonitor: "神经监视器"`       |
| `heroSignalSync`     | 信号同步中 / signal sync active              | Statische Titelbildmarkierung, keine Synchronabfrage         | Bedingt wirksam   | `heroSignalSync: "信号同步中"`    |
| `heroModelOnline`    | 模型在线 / model online                      | Statische Titelbildmarkierung, keine Dienstabfrage           | Bedingt wirksam   | `heroModelOnline: "模型在线"`     |
| `toc`                | 文章目录 / On this page                      | Verzeichnisname bei aktivem Verzeichnis und Überschriften    | Bedingt wirksam   | `toc: "文章目录"`                 |
| `responseOutput`     | 输出 / Output                                | Name der OUTPUT-Leiste, kein Inhaltswechsel                  | Bedingt wirksam   | `responseOutput: "输出"`          |
| `statsWords`         | 词 / words                                   | Zähllabel ohne Zahlenänderung                                | Bedingt wirksam   | `statsWords: "词"`                |
| `statsTokens`        | 令牌 / tokens                                | Tokenlabel ohne Schätzungsänderung                           | Bedingt wirksam   | `statsTokens: "令牌"`             |
| `copySectionLink`    | 复制本节链接 / Copy section link             | h2/h3-Linkkopiername ohne Ankeralgorithmuswechsel            | Bedingt wirksam   | `copySectionLink: "复制本节链接"` |
| `regenerate`         | 重播扫描 / Replay scan                       | Scan-Replaytext, nur visueller Effekt                        | Bedingt wirksam   | `regenerate: "重播扫描"`          |
| `relatedAria`        | 相关文章 / Related posts                     | Zugänglicher Empfehlungsname bei anderen Artikeln            | Bedingt wirksam   | `relatedAria: "相关文章"`         |
| `related`            | 相关文章 / Related                           | Empfehlungsüberschrift ohne Algorithmuswechsel               | Bedingt wirksam   | `related: "相关文章"`             |
| `backToBlogAria`     | 返回博客 / Back to blog                      | Zugänglicher Zurück-zum-Blog-Name                            | Bedingt wirksam   | `backToBlogAria: "返回博客"`      |
| `backToBlog`         | 返回博客 / Back to blog                      | Sichtbarer Bloglink ohne Zielwechsel                         | Bedingt wirksam   | `backToBlog: "返回博客"`          |
| `comments`           | 评论 / Comments                              | Zugänglicher Kommentarname bei gültiger Einrichtung          | Bedingt wirksam   | `comments: "评论"`                |
| `metaReadMinutes`    | 分钟阅读 / min read                          | Derzeit ungenutzt, stellt Lesedauer nicht wieder her         | Derzeit ungenutzt | `metaReadMinutes: "分钟阅读"`     |
| `latencyLabel`       | 延迟估计 / latency est                       | Derzeit ungenutzt, stellt Latenz nicht wieder her            | Derzeit ungenutzt | `latencyLabel: "延迟估计"`        |
| `confidenceLabel`    | 置信度 / confidence                          | Derzeit ungenutzt, stellt Konfidenz nicht wieder her         | Derzeit ungenutzt | `confidenceLabel: "置信度"`       |

Status-, Titelbild- und Scrollhinweise dienen der Atmosphäre, nicht echtem KI-Onlinestatus, Netzwerksynchronisation oder Genauigkeitsmessung. regenerate spielt nur Scan-Effekte ab, schreibt keinen Artikel um und ruft keine KI auf.

OUTPUT und Abschnittskopiertext ändern:

```ts
i18n: {
  locales: {
    zh: {
      messages: {
        blog: {
          responseOutput: '正文',
          statsWords: '字词',
          statsTokens: '估算 tokens',
          copySectionLink: '复制这一节的网址',
          regenerate: '重播扫描效果',
        },
      },
    },
  },
},
```

Zurück-zum-Blog bleibt die aktuelle Sprachliste. Empfehlungen sind die neuesten höchstens drei anderen Artikel derselben Sprache, keine KI-Ähnlichkeit. Keine Anzahl-/Ähnlichkeitsfelder. related/relatedAria ändern nur Text/Namen.

<a id="interaction-messages"></a>

### Codekopier- und Bildvorschautexte

Präfix nun `i18n.locales.<语言>.messages`, ebenfalls optionale string und bedingt wirksam. Keine Änderung von Kopierrechten, Quellen oder Funktionsschaltern.

| Letzter Pfadteil     | Standard vereinfachtes Chinesisch / Englisch                        | Wirkung und Grenzen                                         | Mitgliedsbeispiel                                    |
| -------------------- | ------------------------------------------------------------------- | ----------------------------------------------------------- | ---------------------------------------------------- |
| `codeCopy.copy`      | 复制代码 / Copy code                                                | Code-Knopftext, kein Kopierinhaltwechsel                    | `codeCopy: { copy: "复制代码" }`                     |
| `codeCopy.copied`    | 已复制 / Copied                                                     | Erfolg beim Code- und Abschnittslink-Kopieren               | `codeCopy: { copied: "已复制" }`                     |
| `codeCopy.failed`    | 复制失败，请手动选择代码。 / Copy failed. Select the code manually. | Fehler beim Code-/Abschnittskopieren, keine Rechteerteilung | `codeCopy: { failed: "复制失败，请手动选择代码。" }` |
| `imagePreview.open`  | 查看大图 / View image                                               | Zugänglicher Name des Bildvorschau-Einstiegs/Dialogs        | `imagePreview: { open: "查看大图" }`                 |
| `imagePreview.close` | 关闭图片预览 / Close image preview                                  | Schließknopfname ohne Bildquellenwechsel                    | `imagePreview: { close: "关闭图片预览" }`            |

```ts
i18n: {
  locales: {
    zh: {
      messages: {
        codeCopy: { copy: '复制内容', copied: '复制好了', failed: '无法复制，请手动选择。' },
        imagePreview: { open: '放大这张图片', close: '收起图片' },
      },
    },
  },
},
```

Abschnittslinks bekommen nur h2/h3 mit id. Erfolg/Fehler teilen codeCopy.copied/failed. Codekopieren und Bildvorschau brauchen JavaScript. Normale Textbilder ohne Cover oder Link-/Knopfbilder verwenden die Browserquelle, ohne HD-Original nachzuladen. Keine enabled-Felder in site.config.

## 5. Konfigurationsgrenzen und Prüfung

Beitragsseiten reagieren ohne Neuladen auf Änderungen der systemweiten Einstellung für reduzierte Bewegung. Aktiviert bleiben Cover und Hintergrundnetz statisch und Red Queen stoppt und wird ausgeblendet. Nach dem Deaktivieren starten die Effekte wieder mit dem bisherigen Zeitablauf. Lesefortschritt, Code-Kopieren, Abschnittslinks und Bildvorschau werden nicht zurückgesetzt oder neu gebunden. Es gibt keinen neuen site.config-Schalter.

Text und Panel erscheinen direkt und bleiben still. Netz, Titellichtband und Titelbildeffekte sind unabhängig. Keine öffentlichen Felder für globalen AI-Theme-Wechsel, Texteingangsdauer, Panelatmen, Empfehlungsanzahl, Bildvorschau-enabled oder Codecopy-enabled. Erfunden gleichnamige Schlüssel wirken nicht.

locale, articleSlug, headings, filePath, related, localeHrefs und seoLocaleHrefs sind BlogPost-Parameter, weder site.config noch frontmatter. Standardrouten liefern sie; normale neue Artikel brauchen keine manuelle Angabe.

Prüfe in dev Inhalte mit/ohne Überschriften und Titelbild sowie Kopieren, Abschnittslinks und Bildvorschau. Suche prüfst du nach Build in preview. Stoppe dev, starte npm run doctor und npm run preview. Nach Erfolg nicht sofort check/build wiederholen. Online wird erst nach Deployment aktualisiert.

Installation und Updates in [Teil 1](/de/blog/starter-guide-1-configure-your-site/), Schreiben in [Teil 2](/de/blog/starter-guide-2-languages-and-routing/), Veröffentlichung im [Deployment-Tutorial](/de/blog/starter-guide-deployment/).
