---
tags: ['anglefeint', 'starter']
title: 'Anleitung 5: Fragmente veröffentlichen'
description: 'Kurze Gedanken als Markdown mit optionalen Kommentaren im Dialog.'
pubDate: '2026-11-11'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
updatedDate: '2026-11-13'
---

## KI-lesbare Inhalte

Der Build nimmt öffentliche Artikel sowie aktivierte Fragments- und About-Seiten in `/llms.txt`, Sprachindizes und Volltextdateien auf. Artikel-Markdown-URLs bleiben gleich. Pro Sprache entstehen `/de/fragments/index.md` und `/de/about/index.md` (Sprachcode ersetzen). Fragments fasst alle öffentlichen Seiten zusammen und bewahrt ID, Veröffentlichungszeit, Text und stabile Links `/<locale>/fragments/#ID`. HTML verweist auf Markdown. Nach `npm run build` und in preview verfügbar; ganz `dist/` veröffentlichen.

About exportiert öffentliche Biografie, Kontaktlinks und das erreichbare AI-Textfenster, aber keine Terminalkonfiguration, Werkzeuge oder Dekoration. Kommentare werden nicht exportiert. Deaktivierte Seiten/Sprachen, gelöschte Inhalte, noindex und externe Canonicals werden ausgeschlossen; erneute Builds entfernen veraltete erzeugte Dateien und Verweise. Eigene Dateien bleiben geschützt; Konflikte stoppen den Build. Website-/Sprachzusätze gelten für alle Dokumente. JSON-LD enthält die Sprache; About verwendet AboutPage. Keine neue Konfiguration, Server oder UI-Bibliothek und keine Garantie für KI-Indexierung oder Zitate.

Ab 0.33.2 verwendet Fragments denselben Nach-oben-Button wie Artikel: Er erscheint nach dem Scrollen und berücksichtigt die Einstellung für reduzierte Bewegung. Keine Konfiguration erforderlich.

Bei einem bestehenden Blog zuerst auf Theme 0.29.0 oder neuer aktualisieren:

```bash
npx @anglefeint/astro-theme@latest upgrade
```

In das vorhandene theme in `src/site.config.ts` einfügen. Fragmente und Kommentare sind standardmäßig deaktiviert. Der Menüpunkt steht unter Decoder Lab.

```ts
theme: {
  fragments: { enabled: true, pageSize: 20, comments: { enabled: false } },
},
```

Nach dem Aktivieren ist der Feed unter `/<locale>/fragments/` erreichbar. `pageSize` erlaubt ganze Zahlen von 1 bis 100. Dateien verwenden `.md`; Entwürfe und zukünftige Datumsangaben werden nicht herausgefiltert. Noch unveröffentlichte Fragmente außerhalb von `src/content/fragments/` aufbewahren.

Vorlagen desselben Fragments für alle aktivierten Sprachen erstellen:

Die standardmäßige Erstellung für alle aktivierten Sprachen erfordert Theme 0.31.0 oder neuer. Zuerst aktualisieren; bei 0.29–0.30 die Sprachen mit `--locales` explizit angeben.

```bash
npx @anglefeint/astro-theme@latest new-fragment
```

Wie `new-post` erstellt der Befehl standardmäßig Vorlagen für alle aktivierten Projektsprachen mit derselben ID und demselben Zeitstempel; Inhalte werden nicht automatisch übersetzt. Priorität: `--locales` → `ANGLEFEINT_LOCALES` → aktivierte Sprachen. Explizite Listen werden bereinigt, kleingeschrieben und dedupliziert; sie überspringen das Laden der Konfiguration und erstellen nur die gewünschten Sprachverzeichnisse, ohne Sprachen in der Konfiguration zu aktivieren.

Neue Starter bieten auch `npm run new-fragment`; bestehende Projekte können npx ohne neue Skripte verwenden.

```bash
npx @anglefeint/astro-theme@latest new-fragment --locales en,zh
npx @anglefeint/astro-theme@latest new-fragment --locales de
```

Die erzeugte Markdown-Datei unter `src/content/fragments/<locale>/` bearbeiten. Ein Titel ist optional:

Für eine spätere Übersetzung die ursprüngliche Markdown-Datei in den Zielsprachordner kopieren, id beibehalten und den Text übersetzen.

```md
---
id: 'q8Lm3XzP'
pubDate: 2026-11-11T08:30:00+08:00
---

Fragmente.
```

id beim Bearbeiten oder Umbenennen beibehalten. Nur Übersetzungen desselben Fragments teilen eine ID. Doppelte IDs je Sprache führen zum Buildfehler. pubDate enthält Uhrzeit und Zeitzone; Anzeige in UTC, neueste zuerst.

`theme.fragments.comments.enabled` aktivieren und repo, repoId, category, categoryId unter `theme.comments` mit Giscus-Werten ausfüllen. Siehe Anleitung 4. Artikelkommentare dürfen deaktiviert bleiben. [Giscus](https://giscus.app/) · [4](../starter-guide-4-giscus-comments/)

```ts
theme: {
  fragments: { enabled: true, comments: { enabled: true } },
  comments: {
    repo: 'yourname/your-repository',
    repoId: 'R_...',
    category: 'Your category',
    categoryId: 'DIC_...',
  },
},
```

Verwendet specific, strikten Abgleich und `fragment/<id>`. mapping, term, number, shareAcrossLocales und lang der Artikel werden ignoriert; die Oberfläche folgt der Seitensprache. Übersetzungen mit gleicher ID teilen Kommentare und Reaktionen. Artikelzuordnungen bleiben bestehen. Der Kommentar-Client lädt beim ersten Klick. Schließen blendet den Dialog aus; erneutes Öffnen oder der Wechsel zu einem anderen Fragment verwendet dieselbe Kommentarinstanz.

Fragments bleibt von Artikelsuche und RSS getrennt, erzeugt beim Build jedoch eigenes KI-lesbares Markdown. Bilder aus `public/images/` mit `/images/...` einbinden.

Auf Theme 0.29.0 oder neuer aktualisieren und die Option aktivieren. Persönliche Inhalte, Konfiguration, Musik und Bilder bleiben erhalten. Persönliche Anleitungen werden nicht überschrieben; aktuelle Demo lesen. GitHub-Diskussionen werden weder zusammengeführt noch gelöscht.

Kommentare werden extern geladen. Die Ladeanzeige bleibt bis zur Giscus-Bereitschaft sichtbar; Fehler oder 15 Sekunden Wartezeit zeigen Erneut versuchen. Netzwerk oder Einstellungen prüfen. Der Dialog verwendet dieselbe Giscus-Integration wie Artikel; ein zusätzliches Giscus-npm-Paket ist nicht nötig und die Artikelzuordnungen bleiben unverändert.

```bash
npm run build
```

Seitennavigation ab 0.32.0: Fragmente verwenden dieselben Seitenzahlen, Neonstile und das ab dem konfigurierten Schwellenwert angezeigte Sprungfeld wie der Blog. `theme.pagination` steuert beide Listen; `theme.fragments.pageSize` legt weiterhin unabhängig die Anzahl der Fragmente pro Seite fest.

## Stabile Freigabelinks (ab 0.32.0)

Freigabefunktion ab 0.32.0: Das Datum verlinkt zum Fragment in der Liste; daneben lässt sich der Link kopieren. Zum Teilen `/de/fragments/#ID` mit der id aus dem Markdown-Frontmatter verwenden. Nur wenn das Fragment auf der aktuellen Seite fehlt, lädt ein kleiner sprachbezogener statischer Index seine Seitenposition. Nach neuen Inhalten oder Änderungen an Datum oder pageSize neu bauen und IDs beibehalten. Seitenübergreifendes Auffinden und Kopieren benötigen JavaScript.

Die aktuelle Browseradresse kann eine Seitennummer enthalten; zum Teilen den Datumslink oder die Kopierfunktion verwenden. Noch vorhandene alte Seiten können veraltete Anker korrigieren; entfernte Seitennummern zeigen weiterhin die normale 404-Seite. Diese Funktion fängt 404-Seiten nicht ab.

Fehlende Fragmente und Netzwerkfehler zeigen Hinweise statt wiederholter Sprünge. Bei gesperrter Zwischenablage erscheint ein auswählbarer Link zum manuellen Kopieren. Diese Funktion benötigt Theme 0.32.0 oder neuer; vor dem automatischen Auffinden aktualisieren.

## Standard-Vorschaubild und kurze Fragment-IDs (0.33.0+)

Ergänze site.ogImage im bestehenden site-Objekt in src/site.config.ts. Unterstützt werden Pfade ab public (/images/share.jpg entspricht public/images/share.jpg) und HTTPS-URLs. Ein leerer Wert verwendet das mitgelieferte Anglefeint-Bild mit 1200×630 Pixeln. Fragments und alle #ID-Links verwenden dieses Standardbild. Eigene und automatisch erzeugte Artikelbilder behalten Vorrang; bei deaktivierter Erzeugung hat auch das Artikel-Titelbild Vorrang vor dem Website-Standard. Danach neu bauen und bereitstellen; Plattformen können Vorschauen zwischenspeichern.

```ts
export const THEME_CONFIG = defineThemeConfig({
  site: { ogImage: '/images/share.jpg' },
});
```

new-fragment erzeugt eine achtstellige Nano ID aus Groß-/Kleinbuchstaben und Ziffern, prüft vorhandene Markdown-IDs aller Sprachen und wiederholt bei Kollisionen. Alle Sprachen eines Aufrufs teilen ID und Zeit. Erlaubt sind genau acht alphanumerische Zeichen. Alte UUIDs und lange IDs werden nicht unterstützt: alte Einträge löschen und neu veröffentlichen. Es gibt keine Migration oder Kompatibilität alter Links. Neue veröffentlichte IDs beibehalten; Änderungen erzeugen eine andere Kommentarzuordnung.

## Fragment-Vorschau auf der Startseite (0.35.0+)

Im aktuellen Quellcode erscheint unter dem Startseiten-Header ein Pixel-Avatar, wenn `theme.fragments.enabled` aktiviert ist und die aktuelle Sprache Fragmente enthält. Beim Öffnen werden die neuesten drei angezeigt. Jede Karte führt zum Original; Anzahl und Pfeil unten führen zur vollständigen Liste. Die Anzahl bedeutet Vorschauen / Gesamtzahl dieser Sprache. Bilder und Code haben eine begrenzte Höhe; Überlauf wird abgeschnitten. Bei deaktiviertem oder leerem Feed entfällt der Einstieg. Keine neue Konfiguration nötig; Theme 0.35.0 oder neuer erforderlich.
