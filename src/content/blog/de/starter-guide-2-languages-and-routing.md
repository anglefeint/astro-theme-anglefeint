---
tags:
  - anglefeint
  - starter
title: 'Anleitung 2: Inhalte schreiben und ordnen'
subtitle: 'Beiträge, Bilder, Tags, Inhaltsverzeichnis und Suche.'
description: 'Beiträge, Bilder, Tags, Inhaltsverzeichnis und Suche.'
pubDate: '2026-03-07'
updatedDate: '2026-10-03'
heroImage: ../../../assets/blog/default-covers/cyber-03.webp
---

## Beitrag erstellen

```bash
npm run new-post -- my-first-post
# --locales en,pt-br
```

Nur Deutsch: npm run new-post -- my-first-post --locales de. Slugs bestehen aus Kleinbuchstaben, Zahlen und Bindestrichen. src/content/blog/de/my-first-post.md wird zu /de/blog/my-first-post/. Vorhandene Dateien bleiben erhalten. --locales erstellt Dateien, aktiviert aber keine Sprache.

Übersetzungen verwenden denselben Slug. Fehlt eine Übersetzung, führt das Sprachmenü zur jeweiligen Übersicht; hreflang gibt diese nicht als Artikelübersetzung aus.

## Frontmatter ausfüllen

```yaml
---
title: 'My first post'
description: 'My notes and projects'
pubDate: '2026-10-03'
tags: ['astro', 'notes']
---
```

title, description und pubDate sind Pflicht. subtitle, updatedDate und author sind optional; standardmäßig gilt der Website-Autor. Beiträge werden nach pubDate sortiert. Es gibt keinen Entwurfs- oder Veröffentlichungszeitfilter: draft: true und zukünftige Daten verstecken nichts. Unfertige Texte außerhalb von src/content/blog/ aufbewahren.

heroImage: ./cover.jpg nutzt ein Bild neben dem Beitrag. Bei vorhandenen Dateien in src/assets/blog/default-covers/ wählt der Befehl ein stabiles Titelbild. Bilder werden nicht heruntergeladen. Lesezeit und Metriken sind Schätzungen. readMinutes, wordCount, tokenCount, aiLatencyMs und aiConfidence können sie überschreiben; es wird kein KI-Dienst verbunden.

## Inhaltsverzeichnis und Tags

Verwende Markdown-Überschriften ## und ###. Das Verzeichnis erscheint auf breiten Bildschirmen rechts, auf schmalen vor dem Text. Ohne Überschriften entfällt es. toc: false schaltet es für den Beitrag ab; toc: true hat Vorrang vor dem Website-Standard. Überschriften aus MDX-Komponenten oder HTML werden nicht automatisch erfasst.

tags: ['astro', 'notes'] erzeugt Tag-Seiten unter /de/tags/. Groß- und Kleinschreibung unterscheiden sich. Rand-Leerzeichen und Duplikate werden entfernt. Nicht lateinische Namen erhalten kodierte URLs. Umbenennen ändert den Link. theme.tags.enabled: false deaktiviert Links und Seiten.

## Bilder und Code

Nutze `![Beschreibung](./photo.jpg)` oder `![Beschreibung](/images/photo.jpg)` mit der passenden Datei. Bilder im Text öffnen per Klick oder Enter/Leertaste und schließen mit Escape, Schaltfläche oder Hintergrund. Titelbilder und verlinkte Bilder sind ausgenommen. Die Vorschau verwendet das bereits vom Browser gewählte Bild, ohne ein größeres Original nachzuladen.

Markdown-Codeblöcke mit drei Backticks erhalten eine Kopierschaltfläche. Einrückung und Zeilenumbrüche bleiben erhalten. HTTPS oder localhost ist nötig; bei einem Fehler manuell kopieren.

## Suche

Führe npm run build und npm run preview aus. Gesucht werden Titel und Text in der aktuellen Sprache. dev zeigt nur einen Hinweis. search: false schließt einen Beitrag aus dem Index aus, versteckt ihn aber nicht. theme.search.enabled: false deaktiviert Suche und Index. Nach Inhaltsänderungen neu bauen.

## Vorschaubilder für geteilte Links

Ohne ogImage erzeugt der Build ein PNG mit 1200×630 Pixeln aus Titel, Autor und Website-Name. heroImage bleibt unabhängig. Eigene Bilder: ogImage: ./share.png oder /images/share.png; HTTPS funktioniert ebenfalls. Fehlende lokale Dateien führen zu Fehlern, externe Bilder hängen vom Anbieter ab.

Ein explizites ogImage hat Vorrang. theme.socialImage.enabled: false stoppt nur die Erzeugung; sonst dienen Titelbild oder Standardbild als Ersatz. Prüfe og:image im HTML und dist/\_social/. Plattformen können alte Vorschauen zwischenspeichern. Nicht alle Emojis und Schriftsysteme sind abgedeckt.

## Eigenständige Seiten

npm run new-page -- projects --theme cyber erstellt src/pages/[lang]/projects.astro. Inhalt selbst bearbeiten; Navigation und Übersetzungen werden nicht ergänzt. Verfügbar sind base, ai, cyber, hacker und matrix. Verschachtelte Slugs wie projects/labs sind erlaubt. Vorhandene Dateien führen zu einem Fehler.

- [Anleitung 1: Deinen Blog einrichten](/de/blog/starter-guide-1-configure-your-site/)
- [Anleitung 2: Inhalte schreiben und ordnen](/de/blog/starter-guide-2-languages-and-routing/)
- [Anleitung 3: Optionale Funktionen](/de/blog/starter-guide-3-comments-about-and-theme-toggles/)
