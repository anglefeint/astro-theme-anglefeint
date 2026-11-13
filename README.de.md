[English](README.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Português (Brasil)](README.pt-BR.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [繁體中文](README.zh-Hant.md)

<p align="center">
  <a href="https://demo.anglefeint.com/de/">
    <img src="public/images/theme-previews/anglefeint-brand.webp" alt="Anglefeint — Matrix / Cyberpunk / Hacker / AI" width="1600" />
  </a>
</p>

<p align="center">Ein filmisches Astro-Publishing-Theme mit mehreren Atmosphären für Menschen und KI-Agenten.</p>

Erzeugt automatisch `llms.txt`, mehrsprachige Indizes, Volltextsammlungen und Artikel-Markdown für KI-Agenten und GEO (Generative Engine Optimization).

<p align="center">
  <a href="https://demo.anglefeint.com/">Live-Demo</a>
  ·
  <a href="https://github.com/anglefeint/astro-theme-anglefeint">Repository</a>
</p>

<p align="center">
  <a href="#ai-assistant">KI-Assistent</a> · <a href="#installation">Installation</a> · <a href="#setup">Einrichtung</a> · <a href="#writing">Beiträge</a> · <a href="#upgrade">Upgrade</a> · <a href="#deployment">Build und Deployment</a>
</p>

<p align="center">
  <img alt="Astro" src="https://img.shields.io/badge/Astro-7.3.7-BC52EE?logo=astro&logoColor=white" />
  <img alt="Node" src="https://img.shields.io/badge/Node.js-22.12%2B-339933?logo=node.js&logoColor=white" />
  <img alt="Locales" src="https://img.shields.io/badge/i18n-9%20languages-0A7EA4" />
  <img alt="Deployment" src="https://img.shields.io/badge/Deploy-Static%20Hosting-0A7EA4" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT-2EA043" />
</p>

## Was bietet Anglefeint?

Schreibe Artikel mit Markdown/MDX und kurze Gedanken als Fragments. Integriert sind Mehrsprachigkeit, Suche, Tags, Inhaltsverzeichnis, Codekopieren, Bildvorschau, Formeln und automatische Artikel-Freigabebilder. Kommentare, Musik und GA4 kannst du bei Bedarf aktivieren.

| Seite               | Atmosphäre                                                         |
| ------------------- | ------------------------------------------------------------------ |
| Startseite          | Matrix: grüner Coderegen, Terminal und Pixelavatar                 |
| Blog- und Taglisten | Cyberpunk: Neon, Regen und städtische Lichtstrahlen                |
| About               | Hacker: Vorstellung, virtuelles Terminal und interaktive Werkzeuge |
| Artikeldetail       | AI: Netzwerkhintergrund, Monitor und OUTPUT-Lesepanel              |

Der Build erzeugt Markdown öffentlicher Artikel, About und Fragments sowie `llms.txt` und mehrsprachige Volltextsammlungen für KI-Werkzeuge, ohne zusätzlichen Produktionsserver. Aufnahme oder Zitieren durch Modelle ist nicht garantiert.

<a id="ai-assistant"></a>

## Mit einem KI-Assistenten zusammenarbeiten

Cursor, Codex oder Claude Code können anhand der `AGENTS.md` deines Projekts Einstellungen und Inhalte verwalten. Vorhandene `CLAUDE.md` und Cursor-Regeln verweisen auf passende Anleitungen. Beschreibe die Änderung, lasse tatsächliche Konfiguration und passenden README-Abschnitt prüfen und öffne für Felddetails das Demo-Verzeichnis.

Für Theme-Entwicklung beginne bei [AGENTS.md](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/AGENTS.md) und den [Beitragsrichtlinien](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/CONTRIBUTING.md). Blognutzer müssen den Release-Ablauf der Maintainer nicht zuerst lernen.

<a id="installation"></a>

## 1. Installieren und starten

Erforderlich ist **Node.js ab 22.12.0**; die Vorlage basiert auf **Astro 7**. Führe im übergeordneten Zielordner aus:

```bash
npm create astro@latest -- my-blog --template anglefeint/astro-theme-anglefeint#starter --no-ai
cd my-blog
npm run dev
```

Wähle im Einrichtungsassistenten **Yes**, wenn er die Installation der Abhängigkeiten anbietet. Nur wenn du diesen Schritt bewusst überspringst, führe vor `npm run dev` selbst `npm install` aus. `--no-ai` überspringt das zusätzliche Erstellen allgemeiner KI-Agenten-Anweisungen. Die eigenen Hinweise des Themes sind im Starter enthalten.

Öffne die Terminal-URL. Bestehende Projekte benötigen im bisherigen Ordner nur `npm install` und `npm run dev`, keine Neuerstellung. Ctrl+C stoppt den Server. Weitere Befehle laufen im Projektstamm, nach Stoppen von dev oder in einem zweiten Terminal.

Neue Projekte können auch `pnpm install` und `pnpm dev` verwenden. Bleibe bei einem Paketmanager pro Projekt. Unten gilt npm; der automatische Upgrader unterstützt derzeit nur npm.

Details: [Blog installieren und eigene Angaben eintragen](https://demo.anglefeint.com/de/blog/starter-guide-1-configure-your-site/).

<a id="setup"></a>

## 2. Ersteinrichtung: eigene Angaben

Das Projekt enthält bereits `src/site.config.ts`. **Öffne und bearbeite diese Datei. Erstelle keine neue Datei oder ein zweites Konfigurationsobjekt.**

Ergänze folgendes `site` innerhalb des bestehenden `defineThemeConfig({ ... })` und ersetze Name, Autor, Beschreibung und Domain. Der Starter lässt `site` weg und verwendet Theme-Vorgaben. Falls es bereits existiert, ändere dessen Felder und erhalte weitere Werte, ohne es doppelt anzulegen. Vorhandene Imports, Exports und andere Einstellungen bleiben erhalten.

```ts
site: {
  title: 'Mein Blog',
  author: 'Dein Name',
  description: 'Projekte, Bücher und Alltag.',
  url: 'https://your-domain.example',
},
```

Das ändert nur globale Angaben, keine Sprachen. Ohne eigenen lokalisierten `homeTitle` verwendet die große Startseitenüberschrift das globale `title`. Einführung, About und soziale Links kannst du ebenfalls ändern; Felder findest du in den unten verlinkten Anleitungen.

`site.url` ist die öffentliche Produktionsadresse, nicht dev. `PUBLIC_SITE_URL` der Deployment-Umgebung überschreibt sie. Prüfe diesen Wert, wenn eine alte Domain bleibt.

Anfangs sind neun Sprachen aktiv, Standard ist Englisch. `/` öffnet `/en/`. Ein deutsches README erfordert keinen deutschen Blog. Für andere Standards oder weniger Sprachen folge dem [Sprachentutorial](https://demo.anglefeint.com/de/blog/starter-guide-languages/). Weglassen deaktiviert keine Sprache; Standard bleibt aktiv, Artikel werden nicht automatisch übersetzt. Nach Backup/Git-Commit kannst du Beispiele entfernen, aber keine weiter referenzierten Bilder.

Anleitungen: [Installation und Ersteinrichtung](https://demo.anglefeint.com/de/blog/starter-guide-1-configure-your-site/), [Sprachen und Startseitenadresse](https://demo.anglefeint.com/de/blog/starter-guide-languages/). Referenz: [Website und öffentliche Oberfläche](https://demo.anglefeint.com/de/blog/config-site-chrome/), [Startseite](https://demo.anglefeint.com/de/blog/config-home/).

<a id="writing"></a>

## 3. Den ersten Beitrag schreiben

Erstelle im Projektstamm einen Beitrag:

```bash
npm run new-post -- my-first-post
```

Ohne `--locales` oder `ANGLEFEINT_LOCALES` verwendet der Befehl alle aktiven Projektsprachen und erzeugt gleichnamige Gerüste. Anfangs neun Dateien, nach Sprachänderungen entsprechend der aktiven Liste. Kein automatisches Übersetzen, kein Überschreiben vorhandener Dateien.

Dateien liegen unter `src/content/blog/<locale>/my-first-post.md`, URLs unter `/<locale>/blog/my-first-post/` und Listen unter `/<locale>/blog/`. Englisch etwa `src/content/blog/en/my-first-post.md`, Chinesisch `src/content/blog/zh/my-first-post.md`. Öffne die gewünschte Datei, ändere Titel, Beschreibung und Text. Routen entstehen automatisch. Minimales Beispiel:

```md
---
title: 'Mein erster Beitrag'
description: 'Gedanken zum Start dieses Blogs.'
pubDate: '2026-11-13'
---

Hier beginnt dein Text.
```

Das zeigt nur Pflichtfelder; bestehende Titelbilder und optionale Werte dürfen bleiben. Gewöhnliche Slugs bestehen aus Kleinbuchstaben, Zahlen und Bindestrichen, etwa `my-first-post`.

Für bestimmte Dateien verwende optional `--locales`. Führe nicht jedes Beispiel aus:

```bash
# Nur Englisch erzeugen
npm run new-post -- my-first-post --locales en

# Nur Chinesisch erzeugen
npm run new-post -- my-first-post --locales zh

# Ausgewählte Sprachen erzeugen
npm run new-post -- my-first-post --locales en,zh
```

`--locales` wählt nur Dateien, aktiviert keine Sprache. Seiten entstehen erst bei aktiver Sprache. Neue Dateien desselben Aufrufs teilen ein zufälliges Standard-Titelbild, falls der Pool Bilder enthält. Existierende Dateien bleiben erhalten.

Auch `ANGLEFEINT_LOCALES` kann wählen. Priorität: `--locales` → Umgebung → aktive Sprachen. In Bash: `ANGLEFEINT_LOCALES=zh,en npm run new-post -- my-first-post`. In PowerShell verwende direkt die gezeigten `--locales`-Befehle.

**Es gibt derzeit keine automatische Verbergung für Entwürfe oder zukünftige Daten.** Alle Sprachgerüste werden gebaut und öffentlich. Vervollständige gewünschte Inhalte und verschiebe nicht öffentliche Dateien aus der Sammlung. `draft: true` und `search: false` machen nichts privat.

Anleitungen: [Den ersten Beitrag schreiben](https://demo.anglefeint.com/de/blog/starter-guide-2-languages-and-routing/), [Bilder hinzufügen](https://demo.anglefeint.com/de/blog/starter-guide-images/). Referenz: [Artikel und frontmatter](https://demo.anglefeint.com/de/blog/config-article/).

## 4. Ein Fragment veröffentlichen

Fragments eignen sich für kurze Texte, Bilder und Code. **Theme und neuer Starter haben Fragments standardmäßig deaktiviert; die Demo aktiviert sie separat.** Setze in `src/site.config.ts` im bestehenden `theme` `fragments.enabled: true`. Gezeigt ist die vereinigte Struktur, kein zweites theme:

```ts
theme: {
  fragments: { enabled: true },
},
```

Vorhandenes true musst du nicht ergänzen; false änderst du auf true. Das steuert Liste und Startseiteneinstieg, Kommentare bleiben aus.

Erstelle anschließend ein Fragment, standardmäßig als Gerüst derselben Identität für alle aktiven Sprachen:

```bash
npm run new-fragment
```

Für gewählte Sprachen verwende passende Parameter:

```bash
# Nur Chinesisch erzeugen
npm run new-fragment -- --locales zh

# Ausgewählte Sprachen erzeugen
npm run new-fragment -- --locales en,zh
```

Jeder Aufruf erzeugt einen neuen Eintrag. Wähle eine Variante statt alle auszuführen. CLI-Sprachwahl ändert keine Sprachschalter.

Dateien liegen in `src/content/fragments/<locale>/`, etwa `2026-11-13-aB3dE6gH.md`; tatsächliche Pfade stehen im Terminal. Bearbeite den Text und erhalte die erzeugte achtstellige alphanumerische ID. Übersetzungen desselben Aufrufs teilen ID und Zeit. Für weitere Änderungen nicht erneut erstellen.

Listen liegen unter `/<locale>/fragments/`, etwa `/en/fragments/` oder `/zh/fragments/`. Startseiten mit Fragmenten zeigen den Avatar. Teile stabil `/<locale>/fragments/#ID` statt Seitenzahlen als Identität. ID-Änderungen betreffen Links und Kommentare. Kommentare bleiben standardmäßig aus.

Anleitung: [Ein Fragment veröffentlichen](https://demo.anglefeint.com/de/blog/starter-guide-5-fragments/). Referenz: [Fragments](https://demo.anglefeint.com/de/blog/config-fragments/).

## 5. Eigene Seiten erstellen

Artikel nutzen `new-post`, separate Projekt- oder Portfolio-Seiten `new-page`:

```bash
npm run new-page -- projects
```

Erzeugt `src/pages/[lang]/projects.astro` mit `base`-Theme. Bearbeite die Datei und öffne `/<locale>/projects/`, etwa `/en/projects/`. Eine Quelle erzeugt alle aktiven Sprachseiten, übersetzt aber nichts und ergänzt keine Navigation.

Für einen Stil nutze `--theme` mit `base`, `matrix`, `cyber`, `hacker` oder `ai`. Etwa `npm run new-page -- portfolio --theme cyber` erzeugt eine weitere Cyberpunk-Seite.

Verschachtelte Pfade funktionieren:

```bash
npm run new-page -- projects/labs --theme hacker
```

Segmente verwenden Kleinbuchstaben, Zahlen und Bindestriche, keine Großbuchstaben, Unterstriche oder Anfangs-/Endschrägstriche. Vorhandene Dateien werden nicht überschrieben und reservierte Standardpfade lassen sich nicht so neu anlegen.

Details: [Seiten anpassen](https://demo.anglefeint.com/de/blog/starter-guide-3-comments-about-and-theme-toggles/).

## 6. Bilder vorbereiten und Varianten erhalten

Textbilder verwenden normales Markdown. Lege etwa `photo.jpg` neben den Beitrag und schreibe `![Bildbeschreibung](./photo.jpg)`. Ein Titelbild setzt frontmatter `heroImage: ./cover.jpg` mit vorhandener Datei. public-URLs enthalten kein public-Präfix.

Titelbilder und unterstützte lokale Fragment-Bilder brauchen persistente responsive Dateien. Bereite sie lokal ausdrücklich vor oder prüfe vorhandene Ausgaben:

```bash
npx @anglefeint/astro-theme prepare-covers
npx @anglefeint/astro-theme prepare-covers --check
```

Normale Aufrufe von dev, build und doctor, auch in CI, verwenden korrekte Bildvarianten wieder und ergänzen oder reparieren fehlende, veraltete oder veränderte Dateien automatisch. Committe Inhalte und referenzierte Originalbilder. Das Committen von `src/assets/blog/covers/manifest.json` und `generated/` wird zur Wiederverwendung empfohlen, ist aber keine Voraussetzung für die automatische Vorbereitung. Fehlende Originale, unsichere Pfade und ungültige Eingaben führen weiterhin zu Fehlern. Die explizite Vorbereitung ist optional; `--check` prüft vorhandene Dateien ohne Reparatur.

**Versionshinweis:** Die automatische Bildvorbereitung bei normalen Builds und doctor in CI erfordert mindestens 0.36.2. Führe mit 0.36.1 zuerst dev oder `prepare-covers` aus, um Bildvarianten vorzubereiten. Explizites `prepare-covers --check` und Konfigurations-Sync bleiben schreibgeschützt.

Nicht alle gewöhnlichen Artikelbilder sind dadurch komprimiert. Umfang, Pfade und Freigabebilder erklärt das [Bildertutorial](https://demo.anglefeint.com/de/blog/starter-guide-images/).

<a id="reference"></a>

## Funktionen nach Bedarf konfigurieren

Häufige Befehle und erste Schritte stehen auf dieser Seite. Für Anpassungen öffne passendes Tutorial oder Feldbeschreibung. Das Verzeichnis erklärt Typen, Vorgaben, Grenzen, Beispiele und ungenutzte Felder.

| Ziel                                                          | Anleitung                                                                                                                                                                          | Konfigurationsverzeichnis                                                                                                                                                                    |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Startseite, Identität, Navigation, soziale Links und Fußzeile | [Seiten/Funktionen](https://demo.anglefeint.com/de/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                                         | [Startseite](https://demo.anglefeint.com/de/blog/config-home/), [öffentliche Oberfläche](https://demo.anglefeint.com/de/blog/config-site-chrome/)                                            |
| Listenanzahl, Tags und Seiteneinteilung                       | [Seiten/Funktionen](https://demo.anglefeint.com/de/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                                         | [Blog und Tags](https://demo.anglefeint.com/de/blog/config-blog-list/)                                                                                                                       |
| Inhaltsverzeichnis, Formeln, OUTPUT oder Indexierung          | [Beiträge](https://demo.anglefeint.com/de/blog/starter-guide-2-languages-and-routing/)                                                                                             | [Artikel](https://demo.anglefeint.com/de/blog/config-article/), [Suche](https://demo.anglefeint.com/de/blog/config-search/)                                                                  |
| About, Terminal oder Decoder                                  | [Seiten/Funktionen](https://demo.anglefeint.com/de/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                                         | [About](https://demo.anglefeint.com/de/blog/config-about/), [Terminal](https://demo.anglefeint.com/de/blog/config-terminal/), [Decoder](https://demo.anglefeint.com/de/blog/config-decoder/) |
| Musik oder Kommentare                                         | [Musik](https://demo.anglefeint.com/de/blog/starter-guide-3-comments-about-and-theme-toggles/), [Kommentare](https://demo.anglefeint.com/de/blog/starter-guide-4-giscus-comments/) | [Musik](https://demo.anglefeint.com/de/blog/config-music/), [Giscus und Teilen](https://demo.anglefeint.com/de/blog/config-comments/)                                                        |
| Sprache, Statistik oder öffentliche Ergänzungen               | [Sprachen](https://demo.anglefeint.com/de/blog/starter-guide-languages/), [Deployment](https://demo.anglefeint.com/de/blog/starter-guide-deployment/)                              | [Sprachen/Fallbacks](https://demo.anglefeint.com/de/blog/config-languages/), [GA4/KI](https://demo.anglefeint.com/de/blog/config-analytics-ai/)                                              |

Unklare Felder findest du im [Gesamtverzeichnis](https://demo.anglefeint.com/de/blog/config-reference/). Texte einer Sprache übersetzen keine Inhalte. Änderungen brauchen Build und Deployment.

<a id="upgrade"></a>

## 7. Bestehenden Blog aktualisieren

Neue Installationen können direkt zu [Prüfung, Vorschau und erstem Deployment](#deployment) gehen.

Sichere Änderungen, etwa per Git-Commit. Stoppe dev und preview und prüfe im bisherigen Projektstamm Kompatibilität vor dem Update:

```bash
npx @anglefeint/astro-theme@latest upgrade --check
npx @anglefeint/astro-theme@latest upgrade
```

`--check` ändert keine Dateien, installiert und baut nicht. Tatsächliche Updates unterstützen integrierte npm-Starter mit `package-lock.json` und `anglefeint.projectSchema: 1`. pnpm/yarn/bun-Projekte dürfen Sperren nicht durch Löschen ihrer Lockdateien umgehen.

Der Upgrader aktualisiert die Abhängigkeit und startet doctor; Artikel, Konfiguration, Musik, Bilder und eigene Seiten bleiben. Beide Abhängigkeitsdateien werden unter `.anglefeint/backups/` gesichert, kein vollständiges Backup. Bei Installations-/Prüffehlern stellt er sie wieder her und versucht alte Pakete erneut zu installieren. Veröffentliche nach Fehlern kein Rest-`dist/`.

Eine feste Version wählst du mit `npx @anglefeint/astro-theme@latest upgrade --to <Versionsnummer>`. Ersetze den Platzhalter durch eine kompatible konkrete Version. Keine automatischen Downgrades. Nach erfolgreichem Upgrade sind Prüfung und Build fertig; direkt `npm run preview` reicht ohne sofortigen weiteren build. Das Update veröffentlicht nicht automatisch und migriert keine inkompatiblen Astro-Versionen.

Kopierte Gerüste vor 0.27 benötigen einen neuen Starter unter Erhalt des alten Projekts und Migration persönlicher Inhalte/Ressourcen, kein direktes Upgrade. Kopiere keine alten Standardrouten oder Adapterimplementierungen.

Details und Wiederherstellung: [Vorhandene Projekte aktualisieren](https://demo.anglefeint.com/de/blog/starter-guide-1-configure-your-site/), [Upgrade-Anleitung](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md), [Releases](https://github.com/anglefeint/astro-theme-anglefeint/releases).

<a id="deployment"></a>

## 8. Prüfung, Vorschau und erstes Deployment

Stoppe dev im Projektstamm, prüfe und baue, dann öffne die gebaute Website:

```bash
npm run doctor
npm run preview
```

`npm run doctor` enthält Prüfung und Build. `npm run check` ist ein Synonym; wähle eines. Danach nicht unmittelbar check oder build wiederholen. Nur Astro/TypeScript ohne Build prüft `npm run check:no-build`. preview zeigt lokal Build-Dateien, endet mit Ctrl+C und lädt nichts hoch. Echte Suche funktioniert in der gebauten preview; dev zeigt nur einen Hinweis.

Für nur Build ohne vollständige Prüfung verwende alternativ diese Gruppe, nicht beide:

```bash
npm run build
npm run preview
```

pnpm-Projekte nutzen `pnpm run doctor`/`pnpm preview` oder `pnpm build`/`pnpm preview`. Kürze die Prüfung nicht zu `pnpm doctor` ab, sonst startet pnpm seine eigene Diagnose. Wähle eine Gruppe ohne doppelten Build.

Beim ersten statischen Deployment:

1. Setze `site.url` oder `PUBLIC_SITE_URL` auf die öffentliche Adresse. Committe Inhalte, Originalbilder und Varianten.
2. Hosting-Befehl `npm run build`, Ausgabe `dist`. Bei manuellem Upload den **gesamten Inhalt eines erfolgreichen dist-Builds** hochladen.
3. Erhalte `_astro/`, `pagefind/`, `_social/` und öffentliche Texte. Nicht nur HTML hochladen.
4. Im Domain-Stamm mit Verzeichnis-index-Routen bereitstellen. Beliebige Unterpfade brauchen weitere Anpassungen; Astro base allein genügt nicht.
5. Verbinde Domain und HTTPS im Hosting und prüfe Startseite, Artikel, Sprachen, Bilder und Suche.

Die Website ist statisch, ohne Node.js-Produktionsdienst oder zusätzlichen Hostingadapter. noindex für Terminal-JSON wird in `dist/_headers` vereinigt. Kompatible Plattformen wenden es an, andere brauchen äquivalente Regeln. Astro preview simuliert Hostingheader nicht. Nach Inhalts-/Konfigurationsänderungen neu bauen und vollständig bereitstellen.

Details: [Auf der eigenen Domain veröffentlichen](https://demo.anglefeint.com/de/blog/starter-guide-deployment/).

## Lizenz

Dieses Theme steht unter der [MIT License](LICENSE).

## Vorschau

![Anglefeint — Four cinematic worlds](public/images/theme-previews/promo-overview.jpg)

![Anglefeint — Cyberpunk Cards and List](public/images/theme-previews/promo-cyberpunk.jpg)

![Anglefeint — Hacker About and Decoder Lab](public/images/theme-previews/promo-hacker.jpg)

![Anglefeint — AI reading and GEO](public/images/theme-previews/promo-ai.jpg)

### Freigabevorschau

![Anglefeint-Standardfreigabebild](https://raw.githubusercontent.com/anglefeint/astro-theme-anglefeint/main/packages/theme/src/assets/theme/social/anglefeint-og.jpg)

### Seitenansichten

| Startseite                                                     | Blogliste                                                                 |
| -------------------------------------------------------------- | ------------------------------------------------------------------------- |
| ![Home preview](public/images/theme-previews/preview-home.jpg) | ![Blog Cards preview](public/images/theme-previews/preview-blog-list.jpg) |

| Blog · Listenansicht                                                       |
| -------------------------------------------------------------------------- |
| ![Blog List view](public/images/theme-previews/preview-blog-list-mode.jpg) |

| Artikelseite                                                             |
| ------------------------------------------------------------------------ |
| ![Blog post preview](public/images/theme-previews/preview-blog-post.jpg) |

| About                                                            |
| ---------------------------------------------------------------- |
| ![About preview](public/images/theme-previews/preview-about.jpg) |

| Blog-Seiteneinteilung                                                                   | Verwandte Artikel                                                                |
| --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| ![Blog-Seiteneinteilung](public/images/theme-previews/preview-blog-list-pagination.jpg) | ![Verwandte Artikel](public/images/theme-previews/preview-blog-post-related.jpg) |

| Decoder Lab                                                      |
| ---------------------------------------------------------------- |
| ![Decoder Lab](public/images/theme-previews/preview-decoder.jpg) |

| Decoder Lab · Cypherpunk-Ressourcen                                                  |
| ------------------------------------------------------------------------------------ |
| ![Decoder Lab resources](public/images/theme-previews/preview-decoder-resources.jpg) |
