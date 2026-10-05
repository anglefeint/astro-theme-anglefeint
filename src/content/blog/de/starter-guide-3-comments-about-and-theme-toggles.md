---
tags:
  - anglefeint
  - starter
title: 'Anleitung 3: Optionale Funktionen'
subtitle: 'Musik, Kommentare, Profil, Seitennavigation und Darstellung.'
description: 'Musik, Kommentare, Profil, Seitennavigation und Darstellung.'
pubDate: '2026-03-07'
updatedDate: '2026-10-03'
heroImage: ../../../assets/blog/default-covers/matrix-02.webp
---

## Musik

Lege Audio unter public/music/ ab und ergänze:

```ts
theme: {
  music: { enabled: true, tracks: [{ title: 'My Song', src: '/music/my-song.mp3' }] },
},
```

Titel enthalten title, src und optional artist. Ohne Titel bleibt der Player verborgen. Der erste Start braucht einen Klick. Die Sitzung merkt sich Titel, Position und Lautstärke; Fortsetzen hängt vom Browser ab und ist nicht lückenlos. Nach dem letzten Titel beginnt die Liste erneut.

Vor dem Start wird die vollständige Datei geladen. Große Dateien erhöhen Wartezeit und Speicherbedarf. Externe Quellen benötigen CORS. Lokale Dateien vermeiden das. enabled: false deaktiviert den Player.

## Giscus-Kommentare

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

## Profilseite

Bearbeite i18n.locales.de.about: sections (who, what, ethos, now, contactLead, signature), contact (email, githubUrl, githubLabel), sidebar, labels, modals und effects. ethos ist eine Liste. Andere Sprachen separat pflegen. Die Werkzeuge sind visuelle Demonstrationen, keine echten KI-Dienste. Eine leere E-Mail-Adresse verbirgt den Link. theme.enableAboutPage: false entfernt Seite und Navigation.

## Anzahl und Funktionen

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

## Weitere Sprachen und Startadresse

Ergänze in i18n.locales einen Code mit meta (label, hreflang, ogLocale, enabled, fallback), site.hero, messages und about. Erstelle dann Beiträge mit --locales. fallback ergänzt fehlende Konfigurationstexte, übersetzt aber keine Artikel und mischt keine Sprachen in Listen. Die Standardsprache wird bei Bedarf angehängt. label ändert nur den Menünamen.

defaultLocalePrefix: 'always' leitet / zur lokalisierten Startseite weiter; 'never' kehrt dies für die Standardsprache um. Artikelpfade bleiben lokalisiert.

## Fußzeile und Prüfung

footer.showCredits: false verbirgt Theme- und Astro-Verweise; Build-Jahr und site.title bleiben sichtbar. site.tagline ist unabhängig. Der alte Wert Built with Astro. gilt als eingebauter Verweis, um Dopplungen zu vermeiden.

Automatische Vorschaubilder verwenden einen mitgelieferten Hintergrund aus Code-Regen, Terminals und Neon-Netzwerken mit deinem Website-Namen, Titel und Autor. Der kleine Hinweis `Theme by Anglefeint` unten rechts folgt `theme.footer.showCredits` (Standard `true`); `false` blendet die Hinweise im Footer und im Bild aus. Danach neu bauen und veröffentlichen. Eigene `ogImage`-Dateien bleiben unverändert. Der Hintergrund funktioniert offline und fügt kein Browser-JavaScript hinzu.

Alle Optionen im selben theme beziehungsweise i18n zusammenführen. Listen ersetzen Listen. Lokal testen, npm run doctor ausführen und die Suche mit npm run preview prüfen. Änderungen neu bauen und veröffentlichen.

- [Anleitung 1: Deinen Blog einrichten](/de/blog/starter-guide-1-configure-your-site/)
- [Anleitung 2: Inhalte schreiben und ordnen](/de/blog/starter-guide-2-languages-and-routing/)
- [Anleitung 3: Optionale Funktionen](/de/blog/starter-guide-3-comments-about-and-theme-toggles/)
