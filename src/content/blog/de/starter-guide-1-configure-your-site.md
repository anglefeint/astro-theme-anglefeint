---
tags:
  - anglefeint
  - starter
title: 'Anleitung 1: Deinen Blog einrichten'
subtitle: 'Installation, Website-Daten, Sprachen und Veröffentlichung.'
description: 'Installation, Website-Daten, Sprachen und Veröffentlichung.'
pubDate: '2026-03-07'
updatedDate: '2026-10-03'
heroImage: ../../../assets/blog/default-covers/cyber-02.webp
---

## Installation und lokaler Start

Verwende Node.js ab 22.12.0. Wähle im Assistenten beispielsweise my-blog und passe cd an den tatsächlichen Ordner an. Überspringe npm install, wenn die Abhängigkeiten bereits installiert wurden.

```bash
npm create astro@latest -- --template anglefeint/astro-theme-anglefeint#starter
cd my-blog
npm install
npm run dev
```

Öffne die im Terminal angezeigte Adresse. Für pnpm verwende denselben npm-Erstellungsbefehl, überspringe die Installation im Assistenten und führe pnpm install sowie pnpm dev aus.

## Identität und Startadresse

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

Mit defaultLocalePrefix: 'never' erscheint die Standardstartseite direkt unter /. Der Standard 'always' leitet auf `/<Sprache>/` weiter und kann kurz “Redirecting to home…” anzeigen. Artikel bleiben auch mit 'never' unter /de/blog/.

`social.links` enthält `href`, `label` und einen `icon`-Namen: `github`, `twitter`, `mastodon`, `youtube`, `bluesky`, `linkedin`, `discord`, `telegram`, `instagram`, `facebook`, `whatsapp`, `line`. Eigene lokale SVG/PNG/WebP-Dateien kommen nach `public/icons/`; `iconSrc: "/icons/community.svg"` hat Vorrang vor `icon` und behält die Bildfarben bei. Ohne beide Felder wird Text angezeigt. Pfadregeln und Beispiele stehen in der [README](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/README.de.md). Eine leere Liste zeigt nicht anklickbare Platzhalter. site.tagline ergänzt den Fußzeilentext.

Der Footer trennt Copyright, Theme-/Astro-Verweise und den optionalen Text `site.tagline`; darunter stehen die Social-Media-Symbole. Die Verweise folgen der Seitensprache, eigener Text bleibt in allen Sprachen unverändert. Leerer Text benötigt keinen Platz, langer Text bricht auf Mobilgeräten um. Bestehende Einstellungen und `PUBLIC_SITE_TAGLINE` bleiben gültig; keine Migration ist nötig.

## Sprachen auswählen

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

## Beispiele ersetzen und schreiben

Jede Sprache enthält einen Willkommensbeitrag und drei Anleitungen. Sichere Inhalte und entferne unerwünschte Beispiele; behalte noch verwendete Bilder.

```bash
npm run new-post -- my-first-post
# --locales en,pt-br
```

Der Befehl erstellt je aktiver Sprache eine Vorlage, anfangs also neun. Er übersetzt nicht und überschreibt keine vorhandenen Dateien. Bearbeite Titel, Beschreibung und Text in src/content/blog/de/my-first-post.md.

## Prüfen und veröffentlichen

```bash
npm run doctor
npm run preview
```

doctor enthält Prüfungen und Build. preview zeigt das Ergebnis lokal und veröffentlicht es nicht. Die statische Ausgabe liegt in dist/, einschließlich Suche und Vorschaubildern. Verwende beim Hosting npm run build und das Ausgabeverzeichnis dist. Folge der [Astro-Anleitung](https://docs.astro.build/en/guides/deploy/) und prüfe Seiten, Sprachwechsel, Suche und /de/rss.xml nach der Veröffentlichung.

## Konfigurationsregeln

Behalte jeweils ein theme- und i18n-Objekt. Führe Optionen zusammen; Listen ersetzen vorhandene Listen. Generierte Adapter unter src/config/ nicht direkt bearbeiten. Ein npm-Update aktualisiert lokale Starter-Dateien nicht. Lies vor einer Migration die [Upgrade-Anleitung](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md).

- [Anleitung 1: Deinen Blog einrichten](/de/blog/starter-guide-1-configure-your-site/)
- [Anleitung 2: Inhalte schreiben und ordnen](/de/blog/starter-guide-2-languages-and-routing/)
- [Anleitung 3: Optionale Funktionen](/de/blog/starter-guide-3-comments-about-and-theme-toggles/)
