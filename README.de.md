[English](README.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Português (Brasil)](README.pt-BR.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [繁體中文](README.zh-Hant.md)

<p align="center">
  <a href="https://demo.anglefeint.com/de/">
    <img src="public/images/theme-previews/anglefeint-brand.webp" alt="Anglefeint — Matrix / Cyberpunk / Hacker / AI" width="1600" />
  </a>
</p>

<p align="center">Ein filmisch gestaltetes Astro-Theme mit vielseitigen Atmosphären für persönliche Veröffentlichungen — für menschliche Leser und KI-Agenten.</p>

Erzeugt automatisch `llms.txt`, mehrsprachige Indizes, Volltextsammlungen und Artikel-Markdown für das Lesen und Zitieren durch KI-Agenten und unterstützt GEO (Generative Engine Optimization).

[Demo](https://demo.anglefeint.com/de/) · [GitHub](https://github.com/anglefeint/astro-theme-anglefeint)

<p align="center">
  <a href="#ai-assistant">KI-Assistent</a> · <a href="#installation">Installation</a> · <a href="#setup">Website konfigurieren</a> · <a href="#writing">Beiträge</a> · <a href="#upgrade">Aktualisieren</a> · <a href="#deployment">Bauen und veröffentlichen</a>
</p>

<p align="center">
  <img alt="Astro" src="https://img.shields.io/badge/Astro-7.3.7-BC52EE?logo=astro&logoColor=white" />
  <img alt="Locales" src="https://img.shields.io/badge/i18n-9%20languages-0A7EA4" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT-2EA043" />
</p>

<a id="ai-assistant"></a>

## Mit einem KI-Assistenten arbeiten

Nutze Cursor, Codex oder Claude Code für Website-Einstellungen, Beiträge und eigene Seiten. Lies zuerst die AGENTS.md des aktuellen Projekts; Code und tatsächliche Konfiguration bestimmen das Verhalten. CLAUDE.md und Cursor-Regeln verweisen auf dieselben Anweisungen.

- **Blog-Nutzer (starter)**: Beginne mit [AGENTS.md](https://github.com/anglefeint/astro-theme-anglefeint/blob/starter/AGENTS.md) und lies bei Bedarf die Anleitungen zu [Konfiguration](https://github.com/anglefeint/astro-theme-anglefeint/blob/starter/src/content/blog/de/starter-guide-1-configure-your-site.md) / [Schreiben](https://github.com/anglefeint/astro-theme-anglefeint/blob/starter/src/content/blog/de/starter-guide-2-languages-and-routing.md).
- **Theme-Maintainer (main)**: Lies [AGENTS.md](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/AGENTS.md) → [KI-Workflow](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/docs/AI_WORKFLOW.md). Nutze die [Architekturdokumentation](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/docs/ARCHITECTURE.md) für den Implementierungsaufbau und den [Dokumentationsabgleich](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/docs/DOC_SYNC_WORKFLOW.md), um Dokumentation nach Codeänderungen zu aktualisieren.

<a id="installation"></a>

## Installation

Diese Vorlage basiert auf **Astro 7**.

Verwende Node.js ab 22.12.0. Führe diese Befehle im gewünschten übergeordneten Ordner aus und öffne die vom Entwicklungsserver angezeigte Adresse.

```bash
npm create astro@latest -- my-blog --template anglefeint/astro-theme-anglefeint#starter --no-install --no-ai
cd my-blog
npm install
npm run dev
```

Besteht dein Blog bereits, führe dort `npm install` und `npm run dev` aus, ohne eine zweite Kopie anzulegen. Beende dev mit Ctrl+C oder nutze ein zweites Terminal. Für pnpm nutze `pnpm install` und `pnpm dev`.

<a id="setup"></a>

## Website konfigurieren

Bearbeite das vorhandene Konfigurationsobjekt in `src/site.config.ts`. Hier werden Website-Daten, Social-Links, About und Theme-Optionen eingestellt. Behalte Imports/Exports bei und ergänze das bestehende Objekt.

```ts
export const THEME_CONFIG = defineThemeConfig({
  site: {
    title: 'My Blog',
    author: 'Your Name',
    description: 'My notes and projects.',
    url: 'https://your-domain.example',
  },
});
```

Setze `site.url` auf die tatsächliche Website-Adresse. Ein gesetztes `PUBLIC_SITE_URL` hat Vorrang. Nach Änderungen an Inhalt oder Konfiguration neu bauen und veröffentlichen.

<a id="writing"></a>

## Beiträge schreiben

### Beitrag erstellen

```bash
npm run new-post -- my-first-post --locales de
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

heroImage: ./cover.jpg nutzt ein Bild neben dem Beitrag. Sind Bilder in src/assets/blog/default-covers/ vorhanden, wählt jeder Aufruf zufällig ein Titelbild für alle dabei neu erstellten Sprachversionen. Vorhandene Dateien bleiben erhalten; heroImage lässt sich später ändern. Bilder werden nicht heruntergeladen. Lesezeit und Metriken sind Schätzungen. readMinutes, wordCount, tokenCount, aiLatencyMs und aiConfidence können sie überschreiben; es wird kein KI-Dienst verbunden.

## Eigenständige Seiten

npm run new-page -- projects --theme cyber erstellt src/pages/[lang]/projects.astro. Inhalt selbst bearbeiten; Navigation und Übersetzungen werden nicht ergänzt. Verfügbar sind base, ai, cyber, hacker und matrix. Verschachtelte Slugs wie projects/labs sind erlaubt. Vorhandene Dateien führen zu einem Fehler.

- [Anleitung 2: Inhalte schreiben und ordnen](https://demo.anglefeint.com/de/blog/starter-guide-2-languages-and-routing/)

## Fragmente

Fragmente benötigen Theme 0.29.0 oder neuer. Bestehende Blogs vor Verwendung der folgenden Konfiguration und des Befehls aktualisieren.

Kurze Gedanken als Markdown mit optionalen Kommentaren im Dialog. In das vorhandene theme in src/site.config.ts einfügen. Fragmente und Kommentare sind standardmäßig deaktiviert. Der Menüpunkt steht unter Decoder Lab.

```ts
fragments: { enabled: true, pageSize: 20, comments: { enabled: false } },
```

Die standardmäßige Erstellung für alle aktivierten Sprachen erfordert Theme 0.31.0 oder neuer. Zuerst aktualisieren; bei 0.29–0.30 die Sprachen mit `--locales` explizit angeben.

```bash
npx @anglefeint/astro-theme@latest new-fragment
```

Wie `new-post` erstellt der Befehl standardmäßig Vorlagen für alle aktivierten Projektsprachen mit derselben ID und demselben Zeitstempel; Inhalte werden nicht automatisch übersetzt. Priorität: `--locales` → `ANGLEFEINT_LOCALES` → aktivierte Sprachen. Explizite Listen werden bereinigt, kleingeschrieben und dedupliziert; sie überspringen das Laden der Konfiguration und erstellen nur die gewünschten Sprachverzeichnisse, ohne Sprachen in der Konfiguration zu aktivieren.

```bash
npx @anglefeint/astro-theme@latest new-fragment --locales en,zh
npx @anglefeint/astro-theme@latest new-fragment --locales de
```

Freigabefunktion ab 0.32.0: Das Datum verlinkt zum Fragment in der Liste; daneben lässt sich der Link kopieren. Zum Teilen `/de/fragments/#fragment-ID` mit der id aus dem Markdown-Frontmatter verwenden. Nur wenn das Fragment auf der aktuellen Seite fehlt, lädt ein kleiner sprachbezogener statischer Index seine Seitenposition. Nach neuen Inhalten oder Änderungen an Datum oder pageSize neu bauen und IDs beibehalten. Seitenübergreifendes Auffinden und Kopieren benötigen JavaScript.

Seitennavigation ab 0.32.0: Fragmente verwenden dieselben Seitenzahlen, Neonstile und das ab dem konfigurierten Schwellenwert angezeigte Sprungfeld wie der Blog. `theme.pagination` steuert beide Listen; `theme.fragments.pageSize` legt weiterhin unabhängig die Anzahl der Fragmente pro Seite fest.

[Anleitung 5: Fragmente veröffentlichen](https://demo.anglefeint.com/de/blog/starter-guide-5-fragments/)

<a id="upgrade"></a>

## Theme aktualisieren

Standardseiten, Vorgaben, Übersetzungen und Build-Funktionen gehören zum Theme-Paket. Artikel, `src/site.config.ts`, Musik, Bilder und eigene Seiten bleiben im Projekt.

Im neuen Integration-Starter mit npm führe diesen Befehl im Projektordner aus. Er prüft Kompatibilität, sichert Abhängigkeitsdateien, installiert eine genaue Version und führt doctor aus. Bei Fehlern werden Dateien zurückgesetzt und die bisherigen Abhängigkeiten nach Möglichkeit neu installiert. Anschließend wie gewohnt veröffentlichen; kein automatisches Deployment.

```bash
npx @anglefeint/astro-theme@latest upgrade
```

Projekte vor 0.27 benötigen einmalig einen frischen Starter. Erstelle ihn in einem anderen Ordner, übertrage Artikel/Ressourcen und persönliche Werte in die neue Konfiguration. Alte Standardrouten, Adapter und defaults/schema/runtime-Dateien nicht kopieren. Slugs, Sprachpfade, Musik-/Bild-URLs und Hosting-Einstellungen erhalten.

Automatische Updates unterstützen derzeit nur npm; pnpm/yarn/bun-Lockdateien werden abgelehnt. `--check` prüft ohne Änderungen; `--to 0.27.1` wählt die Version. Siehe [Upgrade-Anleitung](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md) und [GitHub Releases](https://github.com/anglefeint/astro-theme-anglefeint/releases).

<a id="deployment"></a>

## Bauen und veröffentlichen

```bash
npm run build
```

Die statische Website wird in `dist/` erzeugt. Veröffentliche den **gesamten Inhalt** dieses Ordners bei einem beliebigen statischen Hoster. Ein Node.js-Server im Betrieb oder Hosting-Adapter ist nicht erforderlich.

Mit `npm run preview` prüfst du das Ergebnis lokal; es veröffentlicht nichts. Alternativ führt `npm run doctor` Prüfungen und Build zusammen aus.

Veröffentliche im Stammverzeichnis der Domain und liefere die index.html jedes Verzeichnisses aus. Unterpfade benötigen zusätzliche Anpassungen; Astro `base` allein reicht nicht.

Artikel-Sitemaps verwenden `updatedDate`, sonst `pubDate`. Die Integration ergänzt Terminal-JSON-Regeln mit `X-Robots-Tag: noindex` in `dist/_headers` und erhält bestehende Regeln und Quelldateien. Cloudflare Pages/kompatible Hosts wenden sie an; andere benötigen entsprechende Header-Einstellungen. Die veröffentlichte Antwort prüfen: Astro preview verarbeitet Hosting-Regeln nicht.

<a id="reference"></a>

## Funktions- und Konfigurationsreferenz

Blog- und Tag-Archive bieten Karten-/Listenansicht und speichern die Auswahl in diesem Browser.

### Startseiteneffekte und Decoder

Unter `theme.home` in `src/site.config.ts` steuert `showInitialize` Initialize/done, `showFollow` Wake Up/Follow und `showTrace` den Status unten rechts. Alle sind standardmäßig `true`; `false` blendet den jeweiligen Bereich aus. 0.18.1: Die beiden unteren Statusanzeigen sind zunächst verborgen und erscheinen unabhängig bei Maus-Hover oder Textauswahl. Alles auswählen zeigt beide; der leuchtende Cursor folgt nur der rechten Trace-Anzeige.

Die große Startseitenüberschrift lässt sich je Sprache über `i18n.locales.<code>.site.homeTitle` in `src/site.config.ts` setzen, etwa `de: { site: { homeTitle: "Mein digitaler Garten" } }`. Das gilt auch für zusätzlich konfigurierte Sprachen. Fehlende oder leere Werte folgen `meta.fallback`, danach gilt der globale `site.title` oder `PUBLIC_SITE_TITLE`. Nur die sichtbare Überschrift ändert sich; Browser-Titel, Navigation, Footer, RSS und SEO-Seitenname bleiben global. Anschließend neu bauen und bereitstellen.

About bietet ein lokalisiertes Inhaltsverzeichnis und einen hervorgehobenen Kontaktbereich. Auf breiten Bildschirmen steht das Verzeichnis rechts neben dem Lesebereich, auf kleinen darin. Contact im Frontier-Menü öffnet `/<locale>/about/#contact`; beim Deaktivieren von About entfällt dieser Link, Decoder Lab bleibt unabhängig schaltbar.

Die About-Fenstersteuerung schließt, minimiert oder öffnet das Lesefenster im Vollbild, mit lokalem Zustand und Terminalbefehlen. Die Standardseite der Integration wird mit dem Paket aktualisiert; Projekte vor 0.27 benötigen die oben beschriebene einmalige Migration.

About enthält **Hacker Decryptor**: Base64/Base64URL, URL-codierten Text, Hexadezimaltext, HTML-Entitäten, Unicode-Escapes und JWT-Header/Payload lokal im Browser decodieren, mit automatischer Formaterkennung und einer zur Seitenpalette passenden Zahlenanimation. Über Decryptor in der Seitenleiste öffnen; keine API oder zusätzliche Einrichtung nötig.

Der vollständige **Decoder Lab** unter `/<locale>/decoder/` bietet lokale Verarbeitungsschritte, ERC-20/TRC-20-Aufrufinterpretation (EVM/HyperEVM/TRON) und EVM/TRON/Bitcoin-Adressprüfung. Über den About-Dialog öffnen. `theme.enableDecoderPage: false` in `src/site.config.ts` deaktiviert Seite und Link unabhängig von About. Kein RPC, Wallet-Zugriff oder API-Schlüssel nötig.

Seit 0.20.0: Der eigenständige **Frontier**-Pfeil im Header öffnet ebenfalls Decoder Lab. Die Bildkarten verlinken Originaltexte und Ressourcen- oder Projektwebsites; die Texte werden nicht übernommen. `tribute` und die vollständige Liste `links` lassen sich in `src/site.config.ts` unter `i18n.locales.<code>.messages.decoderPage.readings` anpassen. Leerer Text blendet die Würdigung aus, `links: []` die Karten. Alle Einträge erscheinen, auf großen Bildschirmen bis zu acht je Zeile. Siehe [Konfigurationsbeispiel](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/packages/theme/README.md#decoder-reading-configuration).

Das Erscheinungsbild von Decoder Lab ist von der **Cypherpunk**-Bewegung inspiriert und würdigt ihren Beitrag zu menschlicher Freiheit, Privatsphäre und offenem Code. Das Peer-to-Peer-Netzmotiv und die lokale Verarbeitung greifen die Idee auf, Werkzeuge und Daten in den Händen des Einzelnen zu belassen.

Optionaler Matrix-Übergang: `theme.effects.enableHomePassage` ist standardmäßig `false`. Aktiviert zeigen Beitragslinks auf der Startseite vor der Navigation einen grünen Übergang von 8 Sekunden. `Oracle` auf About funktioniert unabhängig: Jeder Klick wählt eine von vier Paletten ohne direkte Wiederholung; nach der Ankunft kannst du dich durch Ziehen umsehen, per Rechtsklick in den Flur zurückgehen und mit Escape oder × schließen. Bei reduzierter Bewegung erfolgt die Navigation direkt und Oracle zeigt eine statische Vorschau.

Ab 1440px Bildschirmbreite zeigt das Terminal unten rechts `Knock, knock.`. Der Text lässt sich auswählen, kopieren und scrollen; die separate Schlüsselloch-Schaltfläche startet die gemeinsame Flurvorschau. Setze `i18n.locales.en.messages.home.transmission` in `src/site.config.ts` für alle Sprachen und überschreibe bei Bedarf `i18n.locales.<code>.messages.home.transmission`. Reihenfolge: Konfiguration der aktuellen Sprache → englische Konfiguration → `Knock, knock.`; unabhängig vom üblichen Fallback der UI-Übersetzungen. Danach neu bauen und bereitstellen.

## KI-lesbare Inhalte

Der passende Starter erzeugt bei `npm run build` automatisch `/llms.txt`, sprachbezogene Indizes und Volltextdateien sowie Markdown-Versionen der Beiträge. Zusätzliche Konfiguration ist nicht nötig; veröffentliche wie gewohnt den gesamten Inhalt von `dist/`. Die Dateien stehen nach dem Build und in preview bereit. Für bestehende Projekte siehe [UPGRADING.md](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md).

Mit `aiReadableContent.notes` (Markdown) und `aiReadableContent.links` (`{ label, href }[]`) in `src/site.config.ts` lassen sich Hinweise in Indizes, Volltextsammlungen und einzelne Markdown-Artikel aufnehmen. Unter `i18n.locales.<code>.aiReadableContent` kann jedes Feld überschrieben werden: fehlende Felder erben den globalen Wert; `notes: ''` / `links: []` blenden ihn aus. [Details](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md#optional-machine-readable-context).

## Social-Links

Konfiguriere `social.links` in `src/site.config.ts`. Kopf- und Fußbereich übernehmen die Reihenfolge des Arrays. Füge nur benötigte Links hinzu:

```ts
// src/site.config.ts — defineThemeConfig({ ... })
social: {
  links: [
    { href: "https://www.youtube.com/@your-channel", label: "YouTube", icon: "youtube" },
    { href: "https://bsky.app/profile/your-handle.bsky.social", label: "Bluesky", icon: "bluesky" },
  ],
},
```

Verfügbare `icon`-Namen: `mastodon`, `twitter`, `github`, `youtube`, `bluesky`, `linkedin`, `discord`, `telegram`, `instagram`, `facebook`, `whatsapp`, `line`.

Das optionale `rel` nimmt durch Leerzeichen getrennte Werte wie `me` oder `me nofollow` an, auch bei eigenen Bildern und Textlinks. Ohne Wert bleibt `noopener noreferrer` erhalten. Werte werden kleingeschrieben und dedupliziert; Schutzattribute bleiben erhalten, `opener` wird ignoriert. Keine Plattform erhält automatisch `me`; verwende es nur für deine eigene Identität. Für die [Mastodon-Verifizierung](https://docs.joinmastodon.org/user/profile/#link-verification) veröffentlichst du die Website und speicherst ihre HTTPS-URL in den Profilfeldern. Nutze eine Seite mit Rücklink, etwa `/en/`; die HTML-Weiterleitung unter `/` enthält ihn möglicherweise nicht. Der Mastodon-Server führt die Prüfung durch.

```ts
{ href: "https://mastodon.social/@yourname", label: "Mastodon", icon: "mastodon", rel: "me" },
```

Für ein eigenes Bild lege `community.svg` unter `public/icons/` ab und setze am Link `iconSrc: "/icons/community.svg"`. Lokale SVG-, PNG- und WebP-Dateien werden unterstützt. Der Pfad beginnt mit `/`; externe URLs, Query-Parameter, Fragmente und codierte Zeichen sind nicht erlaubt. Astros `base` wird automatisch ergänzt. Fehlende Dateien oder unbekannte Icon-Namen führen beim Entwickeln/Build zu einem Konfigurationsfehler.

Priorität: `iconSrc` → `icon` → Text. Integrierte Icons übernehmen die Menüfarbe, eigene Bilder behalten ihre Farben. `label` liefert den zugänglichen Namen. Im Fußbereich brechen Links bei Bedarf um; im Kopfbereich bleiben sie einzeilig und lassen sich bei Platzmangel horizontal scrollen. Bis einschließlich 720px bleiben Social-Links im Kopfbereich ausgeblendet und im Fußbereich sichtbar. Ein leeres `links`-Array behält die drei nicht anklickbaren Platzhalter bei. Nach Änderungen neu bauen und bereitstellen.

## Anleitung 1: Deinen Blog einrichten

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

Absätze und Signatur auf der About-Seite behalten Zeilenumbrüche aus Konfigurationsstrings: `\n` beginnt eine neue Zeile, `\n\n` lässt eine Leerzeile. Lange Sätze werden weiterhin umgebrochen. Es bleibt Klartext, kein Markdown oder HTML; kein `<br>` einfügen.

Der Footer trennt Copyright, Theme-/Astro-Verweise und den optionalen Text `site.tagline`; darunter stehen die Social-Media-Symbole. Die Verweise folgen der Seitensprache, eigener Text bleibt in allen Sprachen unverändert. Leerer Text benötigt keinen Platz, langer Text bricht auf Mobilgeräten um. Bestehende Einstellungen und `PUBLIC_SITE_TAGLINE` bleiben gültig; keine Migration ist nötig.

Optional fügt `theme.footer.links` eine eigene Fußzeile hinzu: Jeder Eintrag enthält `label` und `href`, mit Punkten zwischen den Links. Ohne Einträge wird die Zeile ausgeblendet. Beschriftungen behalten in allen Sprachen den konfigurierten Text; die Zeile ist unabhängig von sozialen Symbolen und `showCredits`.

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
npm run new-post -- my-first-post --locales de
```

Beginne mit einem deutschen Artikel. Ohne `--locales de` erstellt der Befehl Gerüste für alle aktivierten Sprachen (anfangs neun), ohne automatische Übersetzung. Bestehende Dateien bleiben erhalten. Bearbeite Titel, Beschreibung und Text in src/content/blog/de/my-first-post.md.

### Konfigurationsregeln

- [Anleitung 2: Inhalte schreiben und ordnen](https://demo.anglefeint.com/de/blog/starter-guide-2-languages-and-routing/)

## Sprachen

Standardmäßig sind neun Sprachen aktiv: `en`, `ja`, `ko`, `es`, `zh`, `pt-br`, `de`, `ru`, `zh-hant`. `new-post` erstellt anfangs neun Dateien, ohne Inhalte zu übersetzen. Nicht benötigte Sprachen mit `meta.enabled: false` in `src/site.config.ts` deaktivieren; Weglassen genügt nicht. Die Standardsprache bleibt aktiv. Nur Deutsch erstellen: `npm run new-post -- my-post --locales de`.

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

Automatische Vorschaubilder verwenden einen mitgelieferten Hintergrund aus Code-Regen, Terminals und Neon-Netzwerken mit deinem Website-Namen, Titel und Autor. Der kleine Hinweis `Theme by Anglefeint` unten rechts folgt `theme.footer.showCredits` (Standard `true`); `false` blendet die Hinweise im Footer und im Bild aus. Danach neu bauen und veröffentlichen. Eigene `ogImage`-Dateien bleiben unverändert. Der Hintergrund funktioniert offline und fügt kein Browser-JavaScript hinzu.

Ein explizites ogImage hat Vorrang. theme.socialImage.enabled: false stoppt nur die Erzeugung; sonst dienen Titelbild oder Standardbild als Ersatz. Prüfe og:image im HTML und dist/\_social/. Plattformen können alte Vorschauen zwischenspeichern. Nicht alle Emojis und Schriftsysteme sind abgedeckt.

## Anleitung 3: Optionale Funktionen

Die öffentliche Demo verwendet acht Titel von Free Music Archive; im Starter bleibt Musik standardmäßig deaktiviert. Die [Musiknachweise](https://demo.anglefeint.com/music/credits.html) nennen Urheber, Quellen und individuelle Lizenzen (CC0 1.0 oder CC BY 4.0). Die Aufnahmen sind von der MIT-Lizenz des Theme-Codes getrennt und werden weder im npm-Paket noch im Starter verteilt. Beachte beim Hinzufügen oder Wiederverwenden die jeweilige Lizenz und ihre Namensnennungspflichten.

### Musik

Lege Audio unter public/music/ ab und ergänze:

```ts
theme: {
  music: { enabled: true, tracks: [{ title: 'My Song', src: '/music/my-song.mp3' }] },
},
```

0.18.1: Der aktivierte Player startet auf jeder neuen Seite kompakt; OPEN klappt ihn auf. Wiedergabeposition, Lautstärke und Fortsetzen sind unabhängig von der Anfangsgröße.

Titel enthalten title, src und optional artist. Ohne Titel bleibt der Player verborgen. Der erste Start braucht einen Klick. Die Sitzung merkt sich Titel, Position und Lautstärke; Fortsetzen hängt vom Browser ab und ist nicht lückenlos. Nach dem letzten Titel beginnt die Liste erneut.

Vor dem Start wird die vollständige Datei geladen. Große Dateien erhöhen Wartezeit und Speicherbedarf. Externe Quellen benötigen CORS. Lokale Dateien vermeiden das. enabled: false deaktiviert den Player.

### Optional: Google Analytics 4

Ergänze oder bearbeite diese Einstellung auf oberster Ebene im vorhandenen `defineThemeConfig({...})`-Objekt in `src/site.config.ts` (neben `site`, nicht innerhalb von `theme`):

```ts
analytics: {
  googleAnalyticsId: 'G-XXXXXXXXXX',
},
```

Kopiere die **Mess-ID** (`G-...`) aus Google Analytics → Verwaltung → Datenstreams → deinem Webstream. Gemeint ist weder der Property-Name noch die numerische Property-ID. Ein leerer Wert deaktiviert die Messung. Eine ID gilt für alle Sprachen und Theme-Seiten; Sprachen lassen sich anhand des Seitenpfads vergleichen. Neu bauen und bereitstellen, die veröffentlichte Website besuchen und den GA4-Echtzeitbericht prüfen.

Entwicklungsmodus und Vorschauen über localhost/Loopback senden keine Daten. Konfigurierte Remote- und LAN-Vorschauen erfassen Zugriffe. Standardmäßig lädt der Starter kein Google-Skript. Vermeide eine doppelte Einrichtung über GTM, Zaraz oder manuelle Skripte. Einwilligungsbanner und Einwilligungsverwaltung sind nicht enthalten; richte diese bei Bedarf vor dem Aktivieren ein. Blocker können die Erfassung verhindern. Der Integration-Starter stellt diese Anbindung bereit; ältere Projekte folgen der [Upgrade-Anleitung](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md).

### Giscus-Kommentare

`shareAcrossLocales: false` (default) — `mapping: 'pathname'`

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

`shareAcrossLocales: false`: mapping: 'pathname' ordnet Diskussionen dem Pfad zu. 'specific' braucht term, 'number' eine positive Ganzzahl als Zeichenfolge in number. Ungültige Werte erzeugen Fehler. strict und reactionsEnabled verwenden '0' oder '1'. Bei Problemen IDs, Rechte, Verbindung und Browserblockaden prüfen.

Kommentare und sprachübergreifendes Teilen sind standardmäßig aus. Für pfadbezogene Kommentare verwende die Einrichtung oben. Um eine Diskussion zwischen Übersetzungen zu teilen, behalte Repository und Kategorie und ersetze die Zuordnungsoptionen durch:

```ts
theme: {
  comments: {
    // Behalte deine Werte für enabled, repo, repoId, category und categoryId.
    shareAcrossLocales: true,
    mapping: 'specific',
    term: '',
    number: '',
    strict: '1',
    lang: '',
  },
},
```

Teilen erfordert mapping specific, leere term und number sowie strict als Zeichenfolge 1. Jeder Beitrag übergibt seinen vollständigen Slug ohne Sprachpräfix als data-term. Neun Übersetzungen nutzen cypherpunk-ideals-ai-and-the-future-of-crypto; guides/setup und other/setup bleiben getrennt. Ein fehlender Slug führt zu einem Fehler. Übersetzungen müssen denselben Slug verwenden. Ein leeres lang folgt der Seitensprache, ein expliziter Wert bleibt fest. Texte werden nicht übersetzt; Diskussion und Reaktionen werden geteilt.

Ohne Teilen bleiben eigene mapping-, term-, number- und strict-Werte unverändert: specific braucht ein nicht leeres term, number eine positive Ganzzahl als Zeichenfolge. Bei aktivierten Kommentaren und Teilen führen widersprüchliches mapping, nicht leere term/number oder strict ungleich 1 zu einem Konfigurationsfehler. Prüfe zwei Übersetzungen und einen anderen Beitrag. Schreiben erfordert GitHub-Autorisierung. Ergänze das bestehende comments-Objekt, ohne andere Einstellungen zu überschreiben.

Bestehende Diskussionen werden nicht automatisch zusammengeführt, verschoben oder gelöscht. Teilen kann eine andere Diskussion auswählen, in der alte Kommentare fehlen. Sichere vorher mapping, term, number und strict. Zum Wiederherstellen setze shareAcrossLocales: false und stelle die ursprünglichen Werte wieder her. Falls alte Kommentare übertragen werden sollen, prüfe und erledige das manuell auf GitHub; das Theme migriert sie nicht.

[Anleitung für Kommentare](https://demo.anglefeint.com/de/blog/starter-guide-4-giscus-comments/)

### Profilseite

Bearbeite i18n.locales.de.about: sections (who, what, ethos, now, contactLead, signature), contact (email, githubUrl, githubLabel), sidebar, labels, modals und effects. ethos ist eine Liste. Andere Sprachen separat pflegen. Die Werkzeuge sind visuelle Demonstrationen, keine echten KI-Dienste. Eine leere E-Mail-Adresse verbirgt den Link. theme.enableAboutPage: false entfernt Seite und Navigation.

### Anzahl und Funktionen

```ts
theme: {
  homeLatestCount: 3, blogPageSize: 10,
  enableAboutPage: true, effects: { enableRedQueen: true },
  search: { enabled: true }, toc: { enabled: true }, tags: { enabled: true },
  socialImage: { enabled: true }, footer: { showCredits: true },
},
```

false deaktiviert die jeweilige Funktion. enableRedQueen steuert nur den Artikelmonitor. toc: true im Beitrag überschreibt den globalen Standard. socialImage lässt manuelles ogImage weiterhin zu. Atmosphären werden durch Layouts festgelegt, nicht durch einen globalen Schalter.

homeLatestCount steuert neue Beiträge, blogPageSize Listen und Tags. pagination.windowSize liegt zwischen 5 und 21. Der Seitensprung erscheint bei jump.enabled und mehr Seiten als showJumpThreshold, anfangs 12. jump.enterToGo steuert Enter.

Die Modi sind `fixed`, `sequential` und `random`. Mit JavaScript wählt der Standard `random` bei jedem Laden die Farben von Container und Schaltflächen neu; Ergebnisse können sich wiederholen. Ohne JavaScript bleiben die stabile Container-Variante und statische Schaltflächenfarben aus dem erzeugten HTML. `style.enabled: false` nutzt die Basisvariante, ohne die Seitennavigation abzuschalten.

### Weitere Sprachen und Startadresse

Ergänze in i18n.locales einen Code mit meta (label, hreflang, ogLocale, enabled, fallback), site.hero, messages und about. Erstelle dann Beiträge mit --locales. fallback ergänzt fehlende Konfigurationstexte, übersetzt aber keine Artikel und mischt keine Sprachen in Listen. Die Standardsprache wird bei Bedarf angehängt. label ändert nur den Menünamen.

defaultLocalePrefix: 'always' leitet / zur lokalisierten Startseite weiter; 'never' kehrt dies für die Standardsprache um. Artikelpfade bleiben lokalisiert.

### Fußzeile und Prüfung

footer.showCredits: false verbirgt Theme- und Astro-Verweise; Build-Jahr und site.title bleiben sichtbar. site.tagline ist unabhängig. Der alte Wert Built with Astro. gilt als eingebauter Verweis, um Dopplungen zu vermeiden.

Alle Optionen im selben theme beziehungsweise i18n zusammenführen. Listen ersetzen Listen. Lokal testen, npm run doctor ausführen und die Suche mit npm run preview prüfen. Änderungen neu bauen und veröffentlichen.

- [Anleitung 2: Inhalte schreiben und ordnen](https://demo.anglefeint.com/de/blog/starter-guide-2-languages-and-routing/)

## Vorschau

![Anglefeint — Four cinematic worlds](public/images/theme-previews/promo-overview.jpg)

![Anglefeint — Cyberpunk Cards and List](public/images/theme-previews/promo-cyberpunk.jpg)

![Anglefeint — Hacker About and Decoder Lab](public/images/theme-previews/promo-hacker.jpg)

![Anglefeint — AI reading and GEO](public/images/theme-previews/promo-ai.jpg)

### Seiten-Screenshots

![Home](public/images/theme-previews/preview-home.jpg)

![Blog](public/images/theme-previews/preview-blog-list.jpg)

| Blog · Listenansicht                                                       |
| -------------------------------------------------------------------------- |
| ![Blog List view](public/images/theme-previews/preview-blog-list-mode.jpg) |

![Article](public/images/theme-previews/preview-blog-post.jpg)

![About](public/images/theme-previews/preview-about.jpg)

![Blog-Seitennavigation](public/images/theme-previews/preview-blog-list-pagination.jpg)

![Ähnliche Artikel](public/images/theme-previews/preview-blog-post-related.jpg)

![Decoder Lab](public/images/theme-previews/preview-decoder.jpg)

| Decoder Lab · Cypherpunk-Ressourcen                                                  |
| ------------------------------------------------------------------------------------ |
| ![Decoder Lab resources](public/images/theme-previews/preview-decoder-resources.jpg) |

## Lizenz

MIT — [LICENSE](LICENSE).

## Mathematische Formeln

Markdown- und MDX-Artikel unterstützen LaTeX-artige Formeln standardmäßig global. Schreibe `$C_{saved}$` im Text oder eine Formel zwischen zwei eigenen `$$`-Zeilen. Keine Einstellung pro Artikel und keine zusätzliche Plugin-Installation nötig.

```markdown
Inline: $C_{saved}$

$$
\frac{a}{b}
$$
```

Mit `theme: { math: { enabled: false } }` in `src/site.config.ts` deaktivieren. Mehrdeutige Dollarzeichen als `\$` schreiben; Code bleibt unverändert. Ohne Mathematik gelten wieder die normalen MDX-Regeln, einschließlich JavaScript-Ausdrücken in geschweiften Klammern.

Die Ausgabe entsteht beim Build mit lokalen Schriften und Stilen sowie zugänglichem MathML, ohne Formel-Engine im Browser. Lange Formeln lassen sich horizontal scrollen. Fehler stoppen den Build mit Quelle und Ursache. Titel und Beschreibungen bleiben Klartext; Formeln werden nicht indexiert. Unterstützt wird die KaTeX-Mathematiksyntax, nicht vollständige LaTeX-Dokumente.

Im Integration-Starter ab 0.27 verbindet das Theme-Paket den Markdown-Prozessor einschließlich Formeln automatisch. Nur Strukturen vor 0.27 benötigen die einmalige Migration; keine Prozessor- oder Adapterimplementierungen ins neue Projekt kopieren.

## Artikelstatistik

Die Wortzahl ist eine Schätzung aus dem Quelltext: CJK-Zeichen einzeln, sonst hauptsächlich durch Leerraum getrennte Teile. Tokens werden als `round(max(words, 1) × 1.3)` geschätzt, nicht durch einen Modell-Tokenizer oder tatsächlichen KI-Verbrauch. Ab 1.000 erscheint eine Dezimalstelle mit k. Frontmatter-Felder `wordCount`, `tokenCount` und `readMinutes` überschreiben Werte unabhängig; wordCount allein berechnet Tokens nicht neu. Formel- und MDX-Quelltext können die Schätzung beeinflussen.

## Standard-Vorschaubild und kurze Fragment-IDs (0.33.0+)

Ergänze site.ogImage im bestehenden site-Objekt in src/site.config.ts. Unterstützt werden Pfade ab public (/images/share.jpg entspricht public/images/share.jpg) und HTTPS-URLs. Ein leerer Wert verwendet das mitgelieferte Anglefeint-Bild mit 1200×630 Pixeln. Fragments und alle #fragment-ID-Links verwenden dieses Standardbild. Eigene und automatisch erzeugte Artikelbilder behalten Vorrang; bei deaktivierter Erzeugung hat auch das Artikel-Titelbild Vorrang vor dem Website-Standard. Danach neu bauen und bereitstellen; Plattformen können Vorschauen zwischenspeichern.

```ts
site: {
  ogImage: '/images/share.jpg';
}
```

new-fragment erzeugt eine achtstellige Nano ID aus Groß-/Kleinbuchstaben und Ziffern, prüft vorhandene Markdown-IDs aller Sprachen und wiederholt bei Kollisionen. Alle Sprachen eines Aufrufs teilen ID und Zeit. Erlaubt sind genau acht alphanumerische Zeichen. Alte UUIDs und lange IDs werden nicht unterstützt: alte Einträge löschen und neu veröffentlichen. Es gibt keine Migration oder Kompatibilität alter Links. Neue veröffentlichte IDs beibehalten; Änderungen erzeugen eine andere Kommentarzuordnung.
