# Anglefeint

Ein filmisches Astro-Theme für deinen persönlichen Blog.

[English](README.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Português (Brasil)](README.pt-BR.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [繁體中文](README.zh-Hant.md)

[Demo](https://demo.anglefeint.com/de/) · [GitHub](https://github.com/anglefeint/astro-theme-anglefeint)

```bash
npm create astro@latest -- --template anglefeint/astro-theme-anglefeint#starter
```

## Sprachen

Standardmäßig sind neun Sprachen aktiv: `en`, `ja`, `ko`, `es`, `zh`, `pt-br`, `de`, `ru`, `zh-hant`. `new-post` erstellt anfangs neun Dateien, ohne Inhalte zu übersetzen. Nicht benötigte Sprachen mit `meta.enabled: false` in `src/site.config.ts` deaktivieren; Weglassen genügt nicht. Die Standardsprache bleibt aktiv. Nur Deutsch erstellen: `npm run new-post -- my-post --locales de`.

## Anleitung 1: Deinen Blog einrichten

### Installation und lokaler Start

Verwende Node.js ab 22.12.0. Wähle im Assistenten beispielsweise my-blog und passe cd an den tatsächlichen Ordner an. Überspringe npm install, wenn die Abhängigkeiten bereits installiert wurden.

```bash
npm create astro@latest -- --template anglefeint/astro-theme-anglefeint#starter
cd my-blog
npm install
npm run dev
```

Öffne die im Terminal angezeigte Adresse. Für pnpm verwende denselben npm-Erstellungsbefehl, überspringe die Installation im Assistenten und führe pnpm install sowie pnpm dev aus.

### Identität und Startadresse

Bearbeite das Objekt in src/site.config.ts und behalte Imports und Exports bei. Ersetze Domain, Name, Autor und Texte. Führe das Beispiel mit vorhandenen Einstellungen zusammen.

```ts
export const THEME_CONFIG = defineThemeConfig({
  site: { title: 'My Blog', author: 'Your Name', url: 'https://your-domain.example' },
  i18n: {
    defaultLocale: 'de',
    routing: { defaultLocalePrefix: 'never' },
    locales: {
      de: {
        site: { hero: 'My Blog' },
        messages: { siteDescription: 'My Blog' },
      },
    },
  },
});
```

site.url bestimmt die Domain für Canonical-Links, RSS, Sitemap und Vorschaubilder. PUBLIC_SITE_URL in .env oder der Build-Umgebung hat Vorrang. Nach Änderungen neu starten beziehungsweise bauen. Der sichtbare Startseitentext stammt aus site.hero der Sprache, die Beschreibung aus messages.siteDescription. site.description allein ersetzt diese Texte nicht.

Mit defaultLocalePrefix: 'never' erscheint die Standardstartseite direkt unter /. Der Standard 'always' leitet auf /<Sprache>/ weiter und kann kurz “Redirecting to home…” anzeigen. Artikel bleiben auch mit 'never' unter /de/blog/.

social.links enthält href, label und icon (github, twitter oder mastodon). Eine leere Liste zeigt nicht anklickbare Platzhalter. site.tagline ergänzt den Fußzeilentext.

### Sprachen auswählen

Aktiv sind en, ja, ko, es, zh, pt-br, de, ru und zh-hant; Englisch ist anfangs Standard. Zum Abschalten ergänze beispielsweise:

```ts
i18n: {
  locales: {
    ja: { meta: { enabled: false } },
    ko: { meta: { enabled: false } },
  },
},
```

Weglassen deaktiviert keine Sprache, da Einstellungen mit Vorgaben zusammengeführt werden. Die Standardsprache bleibt aktiv. Für einen einsprachigen Blog schalte die anderen acht ausdrücklich ab. Dateien werden weder gelöscht noch übersetzt.

### Beispiele ersetzen und schreiben

Jede Sprache enthält einen Willkommensbeitrag und drei Anleitungen. Sichere Inhalte und entferne unerwünschte Beispiele; behalte noch verwendete Bilder.

```bash
npm run new-post -- my-first-post
# --locales en,pt-br
```

Der Befehl erstellt je aktiver Sprache eine Vorlage, anfangs also neun. Er übersetzt nicht und überschreibt keine vorhandenen Dateien. Bearbeite Titel, Beschreibung und Text in src/content/blog/de/my-first-post.md.

### Prüfen und veröffentlichen

```bash
npm run doctor
npm run preview
```

doctor enthält Prüfungen und Build. preview zeigt das Ergebnis lokal und veröffentlicht es nicht. Die statische Ausgabe liegt in dist/, einschließlich Suche und Vorschaubildern. Verwende beim Hosting npm run build und das Ausgabeverzeichnis dist. Folge der [Astro-Anleitung](https://docs.astro.build/en/guides/deploy/) und prüfe Seiten, Sprachwechsel, Suche und /de/rss.xml nach der Veröffentlichung.

### Konfigurationsregeln

Behalte jeweils ein theme- und i18n-Objekt. Führe Optionen zusammen; Listen ersetzen vorhandene Listen. Generierte Adapter unter src/config/ nicht direkt bearbeiten. Ein npm-Update aktualisiert lokale Starter-Dateien nicht. Lies vor einer Migration die [Upgrade-Anleitung](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md).

- [Anleitung 2: Inhalte schreiben und ordnen](https://demo.anglefeint.com/de/blog/starter-guide-2-languages-and-routing/)

## Anleitung 2: Inhalte schreiben und ordnen

### Beitrag erstellen

```bash
npm run new-post -- my-first-post
# --locales en,pt-br
```

Nur Deutsch: npm run new-post -- my-first-post --locales de. Slugs bestehen aus Kleinbuchstaben, Zahlen und Bindestrichen. src/content/blog/de/my-first-post.md wird zu /de/blog/my-first-post/. Vorhandene Dateien bleiben erhalten. --locales erstellt Dateien, aktiviert aber keine Sprache.

Übersetzungen verwenden denselben Slug. Fehlt eine Übersetzung, führt das Sprachmenü zur jeweiligen Übersicht; hreflang gibt diese nicht als Artikelübersetzung aus.

### Frontmatter ausfüllen

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

### Inhaltsverzeichnis und Tags

Verwende Markdown-Überschriften ## und ###. Das Verzeichnis erscheint auf breiten Bildschirmen rechts, auf schmalen vor dem Text. Ohne Überschriften entfällt es. toc: false schaltet es für den Beitrag ab; toc: true hat Vorrang vor dem Website-Standard. Überschriften aus MDX-Komponenten oder HTML werden nicht automatisch erfasst.

tags: ['astro', 'notes'] erzeugt Tag-Seiten unter /de/tags/. Groß- und Kleinschreibung unterscheiden sich. Rand-Leerzeichen und Duplikate werden entfernt. Nicht lateinische Namen erhalten kodierte URLs. Umbenennen ändert den Link. theme.tags.enabled: false deaktiviert Links und Seiten.

### Bilder und Code

Nutze `![Beschreibung](./photo.jpg)` oder `![Beschreibung](https://demo.anglefeint.com/images/photo.jpg)` mit der passenden Datei. Bilder im Text öffnen per Klick oder Enter/Leertaste und schließen mit Escape, Schaltfläche oder Hintergrund. Titelbilder und verlinkte Bilder sind ausgenommen. Die Vorschau verwendet das bereits vom Browser gewählte Bild, ohne ein größeres Original nachzuladen.

Markdown-Codeblöcke mit drei Backticks erhalten eine Kopierschaltfläche. Einrückung und Zeilenumbrüche bleiben erhalten. HTTPS oder localhost ist nötig; bei einem Fehler manuell kopieren.

### Suche

Führe npm run build und npm run preview aus. Gesucht werden Titel und Text in der aktuellen Sprache. dev zeigt nur einen Hinweis. search: false schließt einen Beitrag aus dem Index aus, versteckt ihn aber nicht. theme.search.enabled: false deaktiviert Suche und Index. Nach Inhaltsänderungen neu bauen.

### Vorschaubilder für geteilte Links

Ohne ogImage erzeugt der Build ein PNG mit 1200×630 Pixeln aus Titel, Autor und Website-Name. heroImage bleibt unabhängig. Eigene Bilder: ogImage: ./share.png oder /images/share.png; HTTPS funktioniert ebenfalls. Fehlende lokale Dateien führen zu Fehlern, externe Bilder hängen vom Anbieter ab.

Ein explizites ogImage hat Vorrang. theme.socialImage.enabled: false stoppt nur die Erzeugung; sonst dienen Titelbild oder Standardbild als Ersatz. Prüfe og:image im HTML und dist/\_social/. Plattformen können alte Vorschauen zwischenspeichern. Nicht alle Emojis und Schriftsysteme sind abgedeckt.

### Eigenständige Seiten

npm run new-page -- projects --theme cyber erstellt src/pages/[lang]/projects.astro. Inhalt selbst bearbeiten; Navigation und Übersetzungen werden nicht ergänzt. Verfügbar sind base, ai, cyber, hacker und matrix. Verschachtelte Slugs wie projects/labs sind erlaubt. Vorhandene Dateien führen zu einem Fehler.

- [Anleitung 2: Inhalte schreiben und ordnen](https://demo.anglefeint.com/de/blog/starter-guide-2-languages-and-routing/)

## Anleitung 3: Optionale Funktionen

### Musik

Lege Audio unter public/music/ ab und ergänze:

```ts
theme: {
  music: { enabled: true, tracks: [{ title: 'My Song', src: '/music/my-song.mp3' }] },
},
```

Titel enthalten title, src und optional artist. Ohne Titel bleibt der Player verborgen. Der erste Start braucht einen Klick. Die Sitzung merkt sich Titel, Position und Lautstärke; Fortsetzen hängt vom Browser ab und ist nicht lückenlos. Nach dem letzten Titel beginnt die Liste erneut.

Vor dem Start wird die vollständige Datei geladen. Große Dateien erhöhen Wartezeit und Speicherbedarf. Externe Quellen benötigen CORS. Lokale Dateien vermeiden das. enabled: false deaktiviert den Player.

### Giscus-Kommentare

Richte ein öffentliches Repository mit Discussions ein, installiere die App und hole die IDs von [giscus.app](https://giscus.app/).

```ts
theme: {
  comments: {
    enabled: true, repo: 'yourname/your-repository',
    repoId: 'REPLACE_WITH_REPO_ID', category: 'Announcements',
    categoryId: 'REPLACE_WITH_CATEGORY_ID', mapping: 'pathname', lang: '',
  },
},
```

Ersetze IDs und Kategorie. Kein Skript pro Beitrag nötig. Fehlende Pflichtfelder verhindern die Anzeige. lang: '' folgt der Beitragssprache: pt-br wird pt, zh-hant wird zh-TW und zh wird zh-CN. Standardmäßig ist Englisch fest eingestellt.

mapping: 'pathname' ordnet Diskussionen dem Pfad zu. 'specific' braucht term, 'number' eine positive Ganzzahl als Zeichenfolge in number. Ungültige Werte erzeugen Fehler. strict und reactionsEnabled verwenden '0' oder '1'. Bei Problemen IDs, Rechte, Verbindung und Browserblockaden prüfen.

### Profilseite

Bearbeite i18n.locales.de.about: sections (who, what, ethos, now, contactLead, signature), contact (email, githubUrl, githubLabel), sidebar, labels, modals und effects. ethos ist eine Liste. Andere Sprachen separat pflegen. Die Werkzeuge sind visuelle Demonstrationen, keine echten KI-Dienste. Eine leere E-Mail-Adresse verbirgt den Link. theme.enableAboutPage: false entfernt Seite und Navigation.

### Anzahl und Funktionen

```ts
theme: {
  homeLatestCount: 3, blogPageSize: 9,
  enableAboutPage: true, effects: { enableRedQueen: true },
  search: { enabled: true }, toc: { enabled: true }, tags: { enabled: true },
  socialImage: { enabled: true }, footer: { showCredits: true },
},
```

false deaktiviert die jeweilige Funktion. enableRedQueen steuert nur den Artikelmonitor. toc: true im Beitrag überschreibt den globalen Standard. socialImage lässt manuelles ogImage weiterhin zu. Atmosphären werden durch Layouts festgelegt, nicht durch einen globalen Schalter.

homeLatestCount steuert neue Beiträge, blogPageSize Listen und Tags. pagination.windowSize liegt zwischen 5 und 21. Der Seitensprung erscheint bei jump.enabled und mehr Seiten als showJumpThreshold, anfangs 12. jump.enterToGo steuert Enter. style.mode unterstützt fixed, sequential und random. random bleibt je Seite stabil. style.enabled: false behält die einfache Seitennavigation.

### Weitere Sprachen und Startadresse

Ergänze in i18n.locales einen Code mit meta (label, hreflang, ogLocale, enabled, fallback), site.hero, messages und about. Erstelle dann Beiträge mit --locales. fallback ergänzt fehlende Konfigurationstexte, übersetzt aber keine Artikel und mischt keine Sprachen in Listen. Die Standardsprache wird bei Bedarf angehängt. label ändert nur den Menünamen.

defaultLocalePrefix: 'always' leitet / zur lokalisierten Startseite weiter; 'never' kehrt dies für die Standardsprache um. Artikelpfade bleiben lokalisiert.

### Fußzeile und Prüfung

footer.showCredits: false verbirgt Theme- und Astro-Verweise; Build-Jahr und site.title bleiben sichtbar. site.tagline ist unabhängig. Der alte Wert Built with Astro. gilt als eingebauter Verweis, um Dopplungen zu vermeiden.

Alle Optionen im selben theme beziehungsweise i18n zusammenführen. Listen ersetzen Listen. Lokal testen, npm run doctor ausführen und die Suche mit npm run preview prüfen. Änderungen neu bauen und veröffentlichen.

- [Anleitung 2: Inhalte schreiben und ordnen](https://demo.anglefeint.com/de/blog/starter-guide-2-languages-and-routing/)

## Aktualisierung

Beginne mit dem öffentlichen Template. Für kompatible Paketaktualisierungen nutze npm update @anglefeint/astro-theme und danach npm run doctor.

npm update bleibt im Bereich von package.json: ^0.5.1 umfasst 0.6.0 nicht. Lies die Versionshinweise und installiere bei Bedarf eine konkrete Version statt blind @latest. npm ls @anglefeint/astro-theme astro zeigt installierte Versionen.

Das Paket aktualisiert keine lokalen Einstellungen, Routen, Adapter oder Integrationen des Starters. Bei Strukturänderungen erstelle einen neuen Starter in einem anderen Ordner und übertrage Inhalte und persönliche Einstellungen. Neue Hilfsdateien nicht mit alten überschreiben.

doctor enthält bereits Prüfungen und Build. Danach npm run preview verwenden. npm run sync-adapters nur bei Abweichungen zwischen generierten Adaptern und lokalen Vorlagen ausführen; es lädt keine neuen Vorlagen herunter. Alte Projekte können andere Skripte haben.

Bei Astro-Hauptversionen zuerst die offizielle Migration befolgen. Weitere Hinweise stehen in der [Upgrade-Anleitung](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md).

```bash
npm update @anglefeint/astro-theme
npm run doctor
npm run preview
```

## Vorschau

![Home](public/images/theme-previews/preview-home.png)

![Blog](public/images/theme-previews/preview-blog-list.png)

![Article](public/images/theme-previews/preview-blog-post-open.png)

![About](public/images/theme-previews/preview-about.png)

## Lizenz

MIT — [LICENSE](LICENSE).
