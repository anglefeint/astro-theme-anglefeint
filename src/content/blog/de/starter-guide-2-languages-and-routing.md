---
tags: ['anglefeint', 'starter']
title: 'Anleitung 2: Den ersten Beitrag schreiben'
subtitle: 'Beiträge erstellen, Titel und Datum ausfüllen und Inhalte mit Überschriften, Tags, Code und Formeln strukturieren.'
description: 'Vom Standardbefehl zur lokalen Vorschau: Beitragsfelder, Markdown und MDX, Inhaltsverzeichnis, Tags, Suche und Kennzahlen.'
pubDate: '2026-03-07'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/cyber-03.webp'
---

Dies ist Teil 2 von 8 der Einführung. [Reihenfolge aller Tutorials](/de/blog/starter-guide-1-configure-your-site/#tutorial-order) · [Konfiguration nach Feldern](/de/blog/config-reference/).

Nach [Installation und Website-Einrichtung](/de/blog/starter-guide-1-configure-your-site/) arbeitest du hauptsächlich an Artikeln in `src/content/blog/`. Angaben eines Beitrags wie Titel und Datum gehören in dessen frontmatter am Dateianfang. Website-Name, Standardautor und globale Schalter bleiben in `src/site.config.ts`.

Zuerst erstellst und prüfst du einen Beitrag nach dem Standardablauf. Sprachen kannst du danach bei Bedarf auswählen. Die weiteren Feldübersichten dienen als Nachschlagewerk.

## 1. Einen Beitrag nach dem Standardablauf erstellen

Führe im Projektstamm, also im Ordner mit `package.json`, aus:

```bash
npm run new-post -- my-first-post
```

Wenn du diesen Befehl schon in Teil 1 ausgeführt hast, öffne die vorhandenen Dateien. Gleichnamige Dateien werden übersprungen, dein Inhalt nicht überschrieben.

Ohne `--locales` oder `ANGLEFEINT_LOCALES` entsteht für jede aktivierte Sprache `src/content/blog/<语言代码>/my-first-post.md`. Anfangs sind neun Sprachen aktiv, daher entstehen neun Gerüste. Nach Änderungen der Sprachschalter gilt die aktuelle Aktivierungsliste. Der Text wird nicht automatisch übersetzt.

Bearbeite die gewünschte Sprachdatei. Ihr Pfad ist `/<语言代码>/blog/my-first-post/`, die Liste `/<语言代码>/blog/`. Der englische Beitrag unter der Standardstartseite liegt etwa unter `/en/blog/my-first-post/`, der chinesische unter `/zh/blog/my-first-post/`. Die jeweilige Sprache muss aktiv sein. Routen musst du nicht selbst anlegen.

`my-first-post` ist der Slug. Verwende nur englische Kleinbuchstaben, Zahlen und Bindestriche, etwa `learning-astro-1`, keine Leerzeichen, Unterstriche oder `/`. Umbenennen der Datei ändert die URL; eine Weiterleitung für alte Links entsteht nicht automatisch.

Der Befehl setzt Titel, Beschreibung, das aktuelle UTC-Datum und Platzhaltertext. Gibt es WebP-, PNG- oder JPEG-Dateien in `src/assets/blog/default-covers/`, wählt er zufällig ein Titelbild. Ohne Bilder lässt er `heroImage` weg und lädt nichts herunter. Ersetze danach Texte, Datum und Bild.

### Nur bestimmte Sprachen erstellen

Die folgenden Befehle sind optionale Varianten. zh erstellt nur Chinesisch, en,zh Englisch und Chinesisch. Du musst nicht alle Beispiele ausführen:

```bash
# 只创建中文
npm run new-post -- my-first-post --locales zh

# 创建英文和中文
npm run new-post -- my-first-post --locales en,zh
```

Ohne `--locales` verwendet der Befehl die aktivierten Projektsprachen, außer `ANGLEFEINT_LOCALES` ist gesetzt. Die Reihenfolge lautet `--locales` → `ANGLEFEINT_LOCALES` → aktivierte Sprachen. Neue Dateien eines Aufrufs teilen dasselbe ausgewählte Titelbild. Vorhandene Dateien bleiben unverändert.

Der Befehl erstellt nur Dateien; er übersetzt und aktiviert keine Sprache. Übersetzungen liegen mit demselben Slug im jeweiligen Sprachordner. Beim Sprachwechsel auf einer Artikelseite öffnet das Theme eine Übersetzung mit gleichem Slug; fehlt sie, führt es zur Blogliste der Zielsprache.

## 2. Titel, Beschreibung und Datum ausfüllen

Öffne die erzeugte Datei. YAML zwischen den ersten beiden `---`-Zeilen ist frontmatter; danach folgt der Text. Du kannst so beginnen und ein vorhandenes `heroImage` behalten:

```md
---
title: '我的第一篇文章'
description: '记录我用 Anglefeint 搭建博客的过程。'
pubDate: '2026-11-13'
tags: ['astro', '笔记']
---

这是我的第一篇文章。我准备在这里记录学习过程和遇到的问题。

## 为什么开始写博客

写下自己的想法，也给以后的自己留下线索。

### 先从一个小问题开始

今天先记录安装和发布过程。
```

Setze das tatsächliche Veröffentlichungsdatum. `title`, `description` und `pubDate` sind Pflicht, `tags` optional. Die Seite zeigt den Titel bereits an; beginne den Text normalerweise mit `##` und wiederhole ihn nicht als `# 我的第一篇文章`.

- `title` dient als Beitragstitel, Listentitel und für zugehörige Metadaten.
- `description` ist die Kurzbeschreibung und Metabeschreibung. Ohne eigenes `context` erscheint sie auch in der Kontextzeile unter dem Titel.
- `pubDate` sortiert Listen absteigend nach Veröffentlichung.
- Nach wesentlichen Änderungen kannst du ein tatsächliches `updatedDate` ergänzen. Es wird als Aktualisierungsdatum gezeigt und in der Sitemap bevorzugt, ersetzt aber nicht `pubDate` für die Sortierung.

Verwende vorzugsweise ein in Anführungszeichen gesetztes `YYYY-MM-DD`. Für genaue Zeiten nutze ISO mit Zeitzone, etwa `'2026-11-13T09:00:00+08:00'`. Die Artikelseite zeigt UTC-Daten; die Umrechnung kann den Kalendertag verschieben.

**Derzeit gibt es keine Filterung für Entwürfe oder geplante Veröffentlichung.** Auch automatisch erzeugte fremdsprachige Gerüste werden beim Build öffentlich. Stelle benötigte Inhalte fertig und verschiebe nicht öffentliche Dateien aus `src/content/blog/` heraus. `draft: true`, ein zukünftiges `pubDate` und `search: false` machen Beiträge nicht privat.

## 3. Text schreiben und mit Überschriften gliedern

Trenne normale Absätze durch eine Leerzeile. Häufige Markdown-Elemente:

```md
这是一段正文，可以使用 **加粗**、_强调_ 和 `行内代码`。

- 第一个要点
- 第二个要点

[链接文字](https://example.com/)

> 这是一段引用。
```

Mit `##` und `###` entsteht automatisch ein Inhaltsverzeichnis. Auf breiten Bildschirmen steht es rechts, auf schmalen vor dem Text. Ohne Überschriften zweiter oder dritter Ebene bleibt es verborgen. Tiefere Überschriften sind im Text erlaubt, erscheinen aber nicht darin.

Für einen Beitrag ohne Inhaltsverzeichnis ergänze im vorhandenen frontmatter:

```yaml
toc: false
```

Ohne `toc` gilt `theme.toc.enabled` aus `src/site.config.ts`, standardmäßig aktiviert. `toc: true` kann eine globale Deaktivierung überschreiben. Das Verzeichnis nutzt die vom Compiler gelieferten Markdown-Überschriften. Überschriften innerhalb von MDX-Komponenten oder aus rohem HTML/JSX werden nicht automatisch gesammelt.

### Beiträge mit Tags ordnen

`tags: ['astro', '笔记']` im frontmatter erzeugt Tag-Einträge und die Tagliste der aktuellen Sprache ohne manuelle Routen. Bei aktivierten Tags ist etwa `/zh/tags/` erreichbar.

Tags unterscheiden Groß- und Kleinschreibung: `Astro` und `astro` sind verschieden. Rand-Leerraum wird entfernt und doppelte Tags eines Beitrags zählen nur einmal. Verwende die erzeugten Links; chinesische und besondere Zeichen werden stabil kodiert. Errate die Pfade nicht selbst. Das Umbenennen eines Tags ändert seinen Link.

Globales `theme.tags.enabled: false` deaktiviert Einträge und Tagseiten, erhält aber die Beiträge.

## 4. Code und mathematische Formeln einfügen

Codeblöcke verwenden drei Backticks und danach die Sprachbezeichnung:

````md
```js
const message = 'Hello, world!';
console.log(message);
```
````

Codeblöcke im Beitrag erhalten automatisch einen Kopierknopf, der Zeilenumbrüche und Einrückung erhält. Er kopiert Text; JavaScript im Block wird nicht ausgeführt. Bei nicht verfügbarer Zwischenablage erscheint ein Fehlerhinweis, und du kannst manuell markieren und kopieren. Der Knopf braucht aktiviertes JavaScript.

Mathematik ist standardmäßig ohne weitere Plugins aktiv. Inline steht sie in `$...$`, eigenständige Formeln zwischen zwei Zeilen mit `$$`:

```md
保存量为 $C_{saved}$。

$$
\frac{a}{b} = x_1 + x_2
$$
```

Schreibe mehrdeutige Dollarzeichen als `\$`. Inline-Code und Codeblöcke bleiben unverändert. KaTeX rendert Formeln beim Build mit seiner mathematischen Syntax, nicht als vollständige LaTeX-Dokumente. Ungültige Formeln können Kompilierung oder Build mit einer Quellenangabe scheitern lassen. Lange eigenständige Formeln sind horizontal scrollbar.

Vereinige `math: { enabled: false }` mit dem bestehenden `theme` in `src/site.config.ts`, um Mathematik global zu deaktivieren. Titel und Beschreibung bleiben Klartext; verlasse dich dort nicht auf Formel-Markup.

### Wann ist MDX sinnvoll?

Für normale Beiträge reicht `.md`. Wenn du Komponenten importieren und einbetten möchtest, verwende `.mdx`. Das Theme sammelt beide Erweiterungen und unterstützt auch in MDX Mathematik ohne zusätzlichen Prozessor.

`new-post` erzeugt `.md`. Bei Bedarf kannst du es unter Erhalt des frontmatter in `.mdx` umbenennen. Behalte nicht gleichzeitig `.md` und `.mdx` mit gleichem Sprachordner und Dateistamm als zwei Beiträge; beide haben denselben URL-Pfad. MDX-Komponenten und -Ausdrücke müssen der MDX-Syntax folgen; die Datei ist nicht bloß Klartext mit anderer Erweiterung.

## 5. Bilder ergänzen

Bilder im Text können neben der Beitragsdatei oder unter `public/images/` liegen. Lege zuerst die Datei ab und verwende dann den passenden Pfad:

```md
![照片内容的描述](./photo.jpg)

![照片内容的描述](/images/photo.jpg)
```

Der erste Pfad ist relativ zum Beitrag, der zweite entspricht `public/images/photo.jpg`; `public` steht nicht in der URL. Die Beschreibung ist der Alternativtext.

Für ein anderes Titelbild kannst du `cover.jpg` neben den Artikel legen und `heroImage: ./cover.jpg` setzen. `heroImage` akzeptiert lokale Bilder und ist optional. Textbilder, Titelbilder und Freigabe-Vorschaubilder erfüllen verschiedene Zwecke. Ein Titelbild wird nicht automatisch in den Text eingefügt.

Normale Textbilder lassen sich per Klick oder mit Fokus und Enter/Leertaste vergrößern. Esc, Schließen oder Hintergrund schließen die Ansicht. Titelbilder und Bilder in Links oder Knöpfen nehmen nicht teil. Die Vorschau verwendet die bereits gewählte Browser-Quelle, lädt kein höher aufgelöstes Original und bietet keinen Galerie-Wechsel.

Nach neuen oder ersetzten Titelbildern bereiten lokales dev oder doctor responsive Dateien vor. Committe Originale und das vollständige `src/assets/blog/covers/` einschließlich manifest.json und generated/. Deployment-Build und CI doctor validieren nur und scheitern bei fehlenden, veralteten oder veränderten Dateien, statt dort neu zu kodieren. Diese persistenten Varianten gelten für Titelbilder und lokale Fragment-Bilder; normale Beitragsbilder nutzen weiterhin die bisherige Markdown-/MDX-Verarbeitung.

## 6. Lokal prüfen und Veröffentlichung vorbereiten

Starte `npm run dev` und öffne unter der Terminal-URL `/<语言代码>/blog/my-first-post/`, etwa englisch `/en/blog/my-first-post/` oder chinesisch `/zh/blog/my-first-post/`. Prüfe Titel, Datum, Text, Inhaltsverzeichnis, Tags und Bilder. Prüfe bei Übersetzungen auch das Ziel des Sprachwechsels.

Stoppe vor der Veröffentlichung den Entwicklungsserver und führe aus:

```bash
npm run doctor
npm run preview
```

doctor enthält Prüfung und Build. Nach Erfolg musst du nicht direkt check oder build wiederholen. preview zeigt das gebaute `dist/`, veröffentlicht aber nicht. Behebe Build-Fehler und veröffentliche keine Restdateien eines gescheiterten Builds.

### Warum findet die Suche in dev keine Artikel?

Der Volltextindex entsteht beim Build. Die Suche in `npm run dev` zeigt einen Entwicklungshinweis. Suche in der gebauten preview nach einem Satz des Texts, um Suche und Zielseite zu prüfen.

Standardmäßig werden Titel und Text der aktuellen Sprache durchsucht. `search: false` im frontmatter schließt einen Beitrag von der internen Suche aus; ohne Angabe nimmt er teil. Listen, RSS, Sitemap und öffentliche Links bleiben unverändert. Globales `theme.search.enabled: false` deaktiviert sowohl den Einstieg als auch die Indexerzeugung.

Erst nach erneutem Build und Deployment aktualisiert sich die Online-Suche. Formeln und dekorative Oberflächen gehören nicht zum Suchtext.

Typen, Vorgaben und derzeit ungenutzte Felder stehen im [Artikelverzeichnis](/de/blog/config-article/#frontmatter), eigenständige Suchregeln im [Suchverzeichnis](/de/blog/config-search/#article-search). Die folgende Übersicht hilft beim Schreiben.

## Nach Bedarf nachschlagen: weitere Beitragsfelder

Diese Felder gehören zum frontmatter des Beitrags, nicht in `site` oder `theme` von `src/site.config.ts`. Gewöhnliche Beiträge brauchen nicht alle Angaben.

### Titelbereich und Bilder

| Feld        | Aktuelles Verhalten                                                                                                                                                  |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `subtitle`  | Optionaler Untertitel; bei identischem Kontexttext nicht doppelt gezeigt                                                                                             |
| `context`   | Kontextzeile unter dem Titel; ohne Angabe `description`, mit `''` verborgen, ohne Änderung der Metabeschreibung                                                      |
| `author`    | Autor dieses Beitrags; fehlend oder nur Leerraum verwendet den Website-Autor                                                                                         |
| `heroImage` | Lokales Titelbild für Liste und Detailseite; optional                                                                                                                |
| `ogImage`   | Manuelles Freigabe-Vorschaubild vor automatisch erzeugten Bildern; erlaubt relative Beitragspfade, public-Pfade wie `/images/share.png` oder direkte HTTPS-Bild-URLs |

Ohne `ogImage` erzeugt der Build standardmäßig ein 1200×630-Freigabebild aus Titel, Autor und Website-Name. Es ersetzt das Titelbild nicht. `theme.socialImage.enabled: false` stoppt die automatische Erzeugung. Manuelle `ogImage` bleiben wirksam; andere Beiträge fallen auf Titelbild oder Website-Standardbild zurück. Baue und veröffentliche nach Änderungen erneut. Plattformen können alte Bilder zwischenspeichern.

### OUTPUT-Werte und optionale Statustexte

| Feld                | Aktuelles Verhalten                                                     |
| ------------------- | ----------------------------------------------------------------------- |
| `wordCount`         | Überschreibt die automatische Wort-/Zeichenzahl; nichtnegative Ganzzahl |
| `tokenCount`        | Überschreibt unabhängig die Token-Schätzung; nichtnegative Ganzzahl     |
| `aiModel`           | Zeigt deine Modellbezeichnung im Titelstatus und OUTPUT                 |
| `aiMode`、`aiState` | Zeigen deine Modus- und Statustexte im Titelstatus                      |

Ohne Angaben schätzt das Theme aus dem Quelltext: CJK-Ideogramme, Kana und koreanische Zeichen einzeln, sonst hauptsächlich durch Leerraum getrennte Wörter. Standard-Tokens sind `round(max(自动字词数, 1) × 1.3)`, kein tatsächlicher Modell-Tokenizer. Nur `wordCount` zu überschreiben berechnet Tokens nicht neu; setze bei Bedarf beide.

Ein Teil des Markdown wird entfernt, doch es ist keine vollständige Zählung sichtbaren Texts. Formeln und MDX-Quellcode können das Ergebnis beeinflussen. Ab 1.000 werden Zahlen mit einer Dezimalstelle und `k` gezeigt. Modell, Modus und Status sind reine Texte und verbinden keine KI, prüfen keine Herkunft und führen keine Aufgaben aus.

### Kompatibilitätsfelder und derzeit nicht dargestellte Felder

- `readMinutes`, `aiLatencyMs`, `aiConfidence` akzeptieren alte Daten, werden aber nicht als Lesedauer, Latenz oder Konfidenz dargestellt. Ihre Typen bleiben positive Ganzzahl, nichtnegative Ganzzahl beziehungsweise Zahl von 0 bis 1. Neue Beiträge brauchen sie nicht.
- `canonicalTopic` akzeptiert Strings, wird derzeit aber weder von Seiten, canonical noch Exporten verwendet. Es erzeugt keine Themen und ändert keine URL.
- `sourceLinks` akzeptiert ein Array mit HTTP(S)-Adressen, ergänzt bei bloßen Domains `https://` und validiert nur. Es zeigt keine Referenzen und ergänzt keinen Export. Schreibe Quellen direkt als Markdown-Links in den Text, wenn Leser sie sehen sollen.

Eigene nicht unterstützte Felder werden nicht automatisch zu Funktionen; `draft` bietet etwa kein Entwurfsverhalten. Verwende bevorzugt die vorhandenen Felder und Textformen.

## Tutorial-Navigation und Konfiguration

[Zurück: Blog installieren und eigene Angaben eintragen](/de/blog/starter-guide-1-configure-your-site/) · [Weiter: Bilder hinzufügen](/de/blog/starter-guide-images/) · [Alle acht Tutorials](/de/blog/starter-guide-1-configure-your-site/#tutorial-order).

Passende Felder: [Beiträge, Inhaltsverzeichnis und OUTPUT](/de/blog/config-article/), [Tags und Listen](/de/blog/config-blog-list/), [Suchindex](/de/blog/config-search/). Vollständige Pfade, Vorgaben und Grenzen stehen im [Konfigurationsverzeichnis](/de/blog/config-reference/).
