---
tags: ['anglefeint', 'starter']
title: 'Anleitung 1: Blog installieren und eigene Angaben eintragen'
subtitle: 'Den Blog lokal starten, persönliche Angaben ändern und den Standardablauf für Beiträge kennenlernen.'
description: 'Von Installation und persönlichen Angaben bis zu Standardablauf, lokaler Prüfung und optionalen Sprach- und Startseiteneinstellungen.'
pubDate: '2026-03-07'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/cyber-02.webp'
---

Dies ist Teil 1 von 8 der Einführung. [Reihenfolge aller Tutorials](/de/blog/starter-guide-1-configure-your-site/#tutorial-order) · [Konfiguration nach Feldern nachschlagen](/de/blog/config-reference/).

Nach diesem Tutorial kannst du den Blog auf deinem Computer öffnen, Namen, Einführung und Kontaktangaben ersetzen und weißt, wo du anschließend Beiträge schreibst. Musik, Kommentare und individuelle Seiten kannst du später einrichten.

Wenn du bereits ein Anglefeint-Projekt hast, ändere dessen Konfiguration direkt. Für Aktualisierungen lies „Ein vorhandenes Projekt aktualisieren“ am Ende; installiere keinen zweiten Blog.

<a id="tutorial-order"></a>

## In welcher Reihenfolge lese ich die acht Tutorials?

Beim Einstieg hilft diese Reihenfolge. Fragments, Kommentare und Mehrsprachigkeit sind optional und müssen nicht für die Installation aktiviert werden. Die Sprache eines Tutorials erfordert keine Änderung der Standardsprache deines Projekts. Passe Sprachen erst bei Bedarf an. Einzelne Felder findest du später direkt im [Konfigurationsverzeichnis](/de/blog/config-reference/).

| Reihenfolge | Tutorial                                                                                        | Danach kannst du …                                                                                    |
| ----------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| 1           | [Blog installieren und eigene Angaben eintragen](/de/blog/starter-guide-1-configure-your-site/) | den Blog starten, persönliche Angaben ändern und den Standardablauf verstehen.                        |
| 2           | [Den ersten Beitrag schreiben](/de/blog/starter-guide-2-languages-and-routing/)                 | Beiträge erstellen, Daten angeben sowie Überschriften, Tags, Code und Formeln verwenden.              |
| 3           | [Bilder zu Beiträgen und Fragments hinzufügen](/de/blog/starter-guide-images/)                  | Originalbilder ablegen, Titelbilder festlegen, Bilder vorbereiten und abgeleitete Dateien einchecken. |
| 4           | [Ein Fragment veröffentlichen](/de/blog/starter-guide-5-fragments/)                             | Fragments mit stabiler ID erstellen und Bilder und Code ergänzen.                                     |
| 5           | [Seiten und Funktionen anpassen](/de/blog/starter-guide-3-comments-about-and-theme-toggles/)    | Seiteninhalte, Musik und Seiteneinteilung ändern sowie eigene Seiten erstellen.                       |
| 6           | [Lesern Kommentare ermöglichen](/de/blog/starter-guide-4-giscus-comments/)                      | Giscus verbinden und Diskussionen für Beiträge, Fragments und Übersetzungen zuordnen.                 |
| 7           | [Den Blog für weitere Sprachen öffnen](/de/blog/starter-guide-languages/)                       | Sprachen auswählen, die Startseitenadresse anpassen und Übersetzungen ergänzen.                       |
| 8           | [Den Blog auf der eigenen Domain veröffentlichen](/de/blog/starter-guide-deployment/)           | Build-Ergebnisse prüfen, alle Dateien bereitstellen und eine Domain verbinden.                        |

Über Anfang und Ende jedes Artikels kommst du zu diesem Verzeichnis zurück und findest den nächsten Schritt oder ein bestimmtes Thema.

## 1. Blog installieren und öffnen

Installiere Node.js ab 22.12.0 und npm. Prüfe im Terminal, ob beide Befehle eine Versionsnummer ausgeben:

```bash
node --version
npm --version
```

Erstelle den Blog im gewünschten übergeordneten Verzeichnis. Folge dem Einrichtungsassistenten und wähle **Yes**, wenn er die Installation der Abhängigkeiten anbietet:

```bash
npm create astro@latest -- my-blog --template anglefeint/astro-theme-anglefeint#starter --no-ai
cd my-blog
npm run dev
```

Wenn du die Installation bewusst überspringst, führe vor `npm run dev` selbst `npm install` aus. `--no-ai` überspringt zusätzliche allgemeine KI-Agenten-Dateien; der Starter enthält eigene Theme-Hinweise.

Du kannst `my-blog` durch einen anderen Ordnernamen ersetzen; passe auch `cd` an. Öffne die im Terminal angezeigte lokale URL. Der Port kann sich ändern, wenn er bereits belegt ist. Der Entwicklungsserver läuft weiter, bis du ihn mit `Ctrl+C` stoppst.

Alle weiteren Befehle führst du im Projektstamm aus, also dort, wo `package.json` liegt. Um ein vorhandenes Projekt erneut zu öffnen, wechsle dorthin und starte `npm run dev`. `npm install` ist nur bei der ersten Installation oder nach Änderungen an Abhängigkeiten nötig.

Dieses Tutorial verwendet npm. Für neue pnpm-Projekte kannst du Installation und Start durch `pnpm install` und `pnpm dev` ersetzen. Der automatische Upgrader am Artikelende unterstützt derzeit jedoch nur npm-Projekte. Bleibe innerhalb eines Projekts bei einem Paketmanager.

## 2. Eigene Website-Angaben und Startseitentexte eintragen

Das installierte Projekt enthält bereits `src/site.config.ts`. Bearbeite diese Datei; erstelle weder eine neue Konfigurationsdatei noch ein zweites Konfigurationsobjekt. Der Starter lässt `site` standardmäßig weg und verwendet die Theme-Vorgaben. Ergänze folgende Felder innerhalb des vorhandenen `defineThemeConfig({ ... })`. Wenn `site` schon existiert, ändere dessen Felder und erhalte andere persönliche Einstellungen. Lege das Objekt nicht doppelt an. Vorhandene Imports, Exports und übrige Inhalte bleiben erhalten.

```ts
site: {
  title: 'Alex’ Blog',
  description: 'Entwicklung, Lektüre und Alltag.',
  url: 'https://example.com',
  author: 'Alex',
  tagline: 'Bleib neugierig und schreibe weiter.',
},
```

Der Ausschnitt zeigt nur Mitglieder innerhalb des bestehenden Objekts, keine vollständige neue Datei. Ersetze Name, Texte und Domain. Er ändert weder die Standardsprache noch die aktivierten Sprachen. `site.url` ist die spätere öffentliche Domain, etwa `https://your-domain.example`, nicht die lokale Vorschau oder eine einzelne Beitragsadresse. Ohne eigene Domain kannst du vorerst das Beispiel behalten; ersetze es vor der Veröffentlichung. Das Theme ist derzeit für die Bereitstellung im Domain-Stamm ausgelegt. Allein das Setzen von Astro `base` bedeutet nicht, dass Unterverzeichnisse unterstützt sind.

Diese Felder steuern:

| Feld               | Tatsächliche Wirkung                                                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `site.title`       | Website-Name für Seitentitel, Navigation, Fußzeile usw.; letzter Fallback für den großen Startseitentitel, wenn kein eigener gesetzt ist    |
| `site.author`      | Standardautor von Beiträgen ohne eigene Autorenangabe                                                                                       |
| `site.url`         | Öffentliche URL für canonical, RSS, Sitemap und Vorschaubilder                                                                              |
| `site.description` | Globale Standardbeschreibung; die Startseite verwendet zuerst das aufgelöste `messages.siteDescription` und nur bei leerem Wert dieses Feld |
| `site.tagline`     | Eigener Fußzeilentext; `''` blendet diesen Text aus. Theme- und Astro-Nennung haben einen eigenen Schalter                                  |

### Startseitentexte einer Sprache bei Bedarf ändern

Sichtbare Einführung und Metabeschreibung werden pro Sprache angegeben. Das folgende Beispiel gilt für die standardmäßig englische Startseite. Ergänze oder vereinige `i18n` im vorhandenen Objekt; existiert es bereits, ändere nur die jeweiligen Felder:

```ts
i18n: {
  locales: {
    en: {
      site: { hero: 'Notes on projects, reading and everyday life.' },
      messages: { siteDescription: 'Personal projects and learning notes by Lin.' },
    },
  },
},
```

`i18n.locales.en.site.hero` steuert die sichtbare Einführung unter dem englischen Startseitentitel, `messages.siteDescription` die SEO-Beschreibung. `''` beim ersten Feld leert die sichtbare Einführung, nicht die Metabeschreibung. Ersetze en durch einen anderen aktivierten Sprachcode, um dessen Texte zu ändern. Das ändert weder die Standardsprache noch übersetzt es andere Sprachen automatisch.

Der große Startseitentitel verwendet standardmäßig den Website-Namen. Für einen abweichenden Titel ergänze `homeTitle` im selben `en.site` und erhalte `hero`:

```ts
site: {
  homeTitle: "Lin's Digital Garden",
  hero: 'Notes on projects, reading and everyday life.',
},
```

Dieses `site` liegt innerhalb von `i18n.locales.en`, nicht auf oberster Ebene. `homeTitle` ändert nur die sichtbare Hauptüberschrift der Startseite, nicht Browser-Titel, Navigation, Fußzeile oder RSS-Namen. Bei fehlendem oder nur aus Leerraum bestehendem Wert wird die Fallback-Kette der Sprache durchsucht, zuletzt der globale Website-Name verwendet. Alle Felder erklärt das [Startseitenverzeichnis](/de/blog/config-home/#home-title).

### Eigene soziale Links eintragen

Ergänze oder ändere `social.links` und ersetze `yourname` durch dein tatsächliches Konto:

```ts
social: {
  links: [{ href: 'https://github.com/yourname', label: 'GitHub', icon: 'github' }],
},
```

Jeder Eintrag braucht `href` als Zieladresse und `label` als zugänglichen Namen. `icon` ist ein optionaler integrierter Symbolname. Unterstützt sind `github`, `twitter`, `mastodon`, `youtube`, `bluesky`, `linkedin`, `discord`, `telegram`, `instagram`, `facebook`, `whatsapp` und `line`.

`social.links` wird oben und in der Fußzeile in Array-Reihenfolge verwendet. Bei schmalen Mobilansichten verschwindet die obere Gruppe, die Fußzeile bleibt. Das Array ersetzt die Standardliste vollständig. Erhalte beim Hinzufügen weitere gewünschte Einträge. Mit `social: { links: [] }` kannst du vorerst auf Konten verzichten; dann bleiben drei nicht anklickbare Platzhalter, statt den gesamten Bereich auszublenden.

### Änderungen werden nicht sichtbar?

Prüfe zuerst `.env`, passende `.env.*`-Dateien und Build-Umgebungsvariablen deiner Hosting-Plattform auf alte Überschreibungen:

- `PUBLIC_SITE_TITLE` überschreibt den Website-Namen.
- `PUBLIC_SITE_AUTHOR` überschreibt den Standardautor.
- `PUBLIC_SITE_URL` überschreibt die Website-URL.
- `PUBLIC_SITE_DESCRIPTION` überschreibt die globale Standardbeschreibung, nicht eine nichtleere sprachspezifische Startseitenbeschreibung.
- `PUBLIC_SITE_TAGLINE` überschreibt den eigenen Fußzeilentext.

Entferne nicht benötigte Variablen und verwende die Konfigurationsdatei. Für das Theme ist keine neue `.env` nötig. Starte nach Änderungen an Umgebungsvariablen den Entwicklungsserver neu. Die veröffentlichte Website muss neu gebaut und bereitgestellt werden; lokales Speichern ändert keine Online-Seite.

## 3. Standardsprache zunächst behalten, bei Bedarf anpassen

Anfangs sind neun Sprachen aktiv: `en`, `ja`, `ko`, `es`, `zh`, `pt-br`, `de`, `ru` und `zh-hant`. Die Standardsprache ist `en`. `/` leitet zu `/en/` um. Zum Lesen eines anderssprachigen Tutorials musst du den Blog nicht auf diese Sprache umstellen oder andere Sprachen für den ersten Beitrag deaktivieren.

Wenn du die Standardsprache wechseln, weniger Sprachen nutzen oder die Standardstartseite direkt unter `/` zeigen möchtest, folge [Teil 7: Den Blog für weitere Sprachen öffnen](/de/blog/starter-guide-languages/). Das ist optional. Das Weglassen einer Sprache deaktiviert sie nicht; dafür ist `meta.enabled: false` nötig. Die Standardsprache bleibt immer aktiv. Deaktivieren löscht keine Beitragsdateien.

Typen, Vorgaben und URL-Zusammenhänge stehen im [Sprachenverzeichnis](/de/blog/config-languages/#registry). Artikel und Startseitentexte werden nicht automatisch übersetzt. Achte im folgenden Standardablauf darauf, welche Sprachdateien entstehen.

## 4. Beispiele durch eigene Beiträge ersetzen

Beiträge liegen unter `src/content/blog/<Sprachcode>/`. `welcome-to-anglefeint.md`, `starter-guide-*.md` und `config-*.md` sind normale Starter-Beiträge: Willkommensbeispiel, acht Anleitungen und Konfigurationslexikon. Nach Backup oder Git-Commit kannst du Inhalte je Sprache behalten oder entfernen. Das Löschen von Willkommen und Anleitungen entfernt das Lexikon nicht. Lösche keine weiterhin referenzierten Bilder.

Erstelle einen Beitrag im Standardablauf:

```bash
npm run new-post -- my-first-post
```

Ohne `--locales` oder `ANGLEFEINT_LOCALES` erzeugt der Befehl gleichnamige Gerüste für alle aktivierten Sprachen; die Anfangskonfiguration ergibt neun Dateien. Er übersetzt nicht automatisch. Vorhandene gleichnamige Dateien werden übersprungen, nicht überschrieben.

Öffne `src/content/blog/<Sprachcode>/my-first-post.md` und fülle Titel, Beschreibung und Text aus. Die URL lautet `/<Sprachcode>/blog/my-first-post/`. Die englische Datei im Ordner en hat etwa `/en/blog/my-first-post/`, die chinesische im Ordner zh `/zh/blog/my-first-post/`. Entferne unfertige, nicht zur Veröffentlichung bestimmte Gerüste vor dem Deployment aus dem Inhaltsverzeichnis. Sie sind keine automatisch versteckten Entwürfe.

Für nur eine Sprache kannst du `npm run new-post -- my-first-post --locales zh` verwenden; für mehrere `--locales en,zh`. Das sind optionale Varianten, die du nicht alle ausführen musst. `--locales` aktiviert selbst keine Sprache.

Felder, Titelbilder, Code und Formeln erklärt [Beiträge schreiben und Inhalte verwalten](/de/blog/starter-guide-2-languages-and-routing/).

## 5. Änderungen lokal prüfen

Prüfe auf der Entwicklungsseite, ob Website-Name und Einführung ersetzt sind, das Sprachmenü stimmt, dein Beitrag erreichbar ist und soziale Links zu echten Konten führen. Beiträge anderer Sprachen erhalten ihre Routen nur bei aktivierter Sprache.

Stoppe vor der Build-Prüfung den Entwicklungsserver mit `Ctrl+C` und führe aus:

```bash
npm run doctor
npm run preview
```

Der lokale `doctor` bereitet fehlende oder veraltete responsive Bilder vor, führt Astro-Prüfungen aus und baut die Website. Bei aktiviertem About prüft er auch dessen Laufzeitkonfiguration. Nach Erfolg musst du nicht direkt erneut `check` oder `build` ausführen. Behebe bei Fehlern zuerst die Terminalmeldung und starte `doctor` erneut. Verwende kein nach einem Fehler verbliebenes `dist/` für das Deployment.

`preview` zeigt die bereits gebaute statische Website aus `dist/` unter der angezeigten Terminal-URL. Es veröffentlicht nichts im Internet. Die Artikelsuche prüfst du in dieser Build-Vorschau; `dev` hat keine laufend aktualisierte Volltextsuche. `Ctrl+C` beendet die Vorschau.

Die Hosting-Build-Anweisung lautet später `npm run build`, das Ausgabeverzeichnis `dist`. Stelle dessen gesamten Inhalt bereit. Normale Aufrufe von dev, build und doctor, auch in CI, verwenden korrekte Bildvarianten wieder und ergänzen oder reparieren fehlende, veraltete oder veränderte Dateien automatisch. Committe Inhalte und referenzierte Originalbilder. Das Committen von `src/assets/blog/covers/manifest.json` und `generated/` wird zur Wiederverwendung empfohlen, ist aber keine Voraussetzung für die automatische Vorbereitung. Fehlende Originale, unsichere Pfade und ungültige Eingaben führen weiterhin zu Fehlern. Nach Inhalts- oder Konfigurationsänderungen musst du neu bauen und bereitstellen.

**Versionshinweis:** Die automatische Bildvorbereitung bei normalen Builds und doctor in CI erfordert mindestens 0.36.2. Führe mit 0.36.1 zuerst dev oder `prepare-covers` aus, um Bildvarianten vorzubereiten. Explizites `prepare-covers --check` und Konfigurations-Sync bleiben schreibgeschützt.

## Ein vorhandenes Projekt aktualisieren

Neu installierte Blogs brauchen diesen Abschnitt nicht. Sichere im vorhandenen Projekt zuerst eigene Änderungen, etwa mit einem Git-Commit. Stoppe Entwicklungsserver und Vorschau und führe im bisherigen Projektstamm aus:

```bash
npx @anglefeint/astro-theme@latest upgrade --check
```

`--check` ermittelt die Zielversion und prüft Projekt-, Node.js- und Astro-Kompatibilität. Es ändert keine Projektdateien und installiert oder baut nichts. Nach erfolgreicher Prüfung aktualisierst du tatsächlich:

```bash
npx @anglefeint/astro-theme@latest upgrade
```

Automatische Upgrades unterstützen den integrierten npm-Starter mit `package-lock.json`. `package.json` muss `anglefeint.projectSchema: 1` enthalten, Standardseiten werden vom Theme-Paket geliefert. Bei pnpm-, yarn- oder bun-Lockdateien stoppt der Upgrader. Lösche deine Lockdatei nicht zum Umgehen der Prüfung. Aktualisiere Nicht-npm-Projekte nach Kompatibilitätsprüfung mit ihrem bisherigen Paketmanager und starte deren doctor. Dafür bietet der automatische Upgrader keinen Rollback.

Der Upgrader aktualisiert die Theme-Abhängigkeit und startet doctor. Er überschreibt keine Artikel, Konfiguration, Musik, Bilder oder eigenen Seiten. `package.json` und `package-lock.json` werden unter `.anglefeint/backups/` gesichert; das ist kein vollständiges Website-Backup. Scheitern Installation oder doctor, stellt er beide Abhängigkeitsdateien wieder her und versucht, die ursprünglichen Pakete zu installieren. Scheitert auch das, behebe den Abhängigkeitsfehler laut Terminal und führe `npm run doctor` erfolgreich aus. Alte Build-Dateien werden nicht wiederhergestellt; veröffentliche nach einem Fehler kein `dist/`.

Bei inkompatiblen Node.js-, Astro- oder Starter-Schema-Versionen stoppt er und migriert Astro nicht automatisch. `--to` wählt eine ausdrückliche kompatible Theme-Version; automatische Downgrades sind nicht unterstützt. Änderungen findest du in [GitHub Releases](https://github.com/anglefeint/astro-theme-anglefeint/releases). Nach Erfolg kannst du direkt `npm run preview` für den bereits vorhandenen Build nutzen und wie gewohnt veröffentlichen. Ein sofortiger weiterer Build ist unnötig.

Kopierte alte Gerüste vor 0.27 lassen sich nicht direkt automatisch aktualisieren. Installiere den neuen Starter in einem anderen Ordner nach diesem Artikel, erhalte das alte Projekt, übertrage Inhalte und Ressourcen und vereinige persönliche Werte mit der neuen `src/site.config.ts`. Kopiere keine alten Standardrouten, Adapter oder defaults/schema/runtime-Hilfsdateien. Prüfe Slugs, Sprachpfade, Musik- und Bild-URLs sowie Domain und Hosting-Einstellungen, bevor du lokal prüfst und veröffentlichst.

## Tutorial-Navigation und Konfiguration

[Weiter: Den ersten Beitrag schreiben](/de/blog/starter-guide-2-languages-and-routing/) · [Alle acht Tutorials](/de/blog/starter-guide-1-configure-your-site/#tutorial-order).

Passende Felder: [Website, soziale Links und Fußzeile](/de/blog/config-site-chrome/), [Startseitentitel und Einführung](/de/blog/config-home/), [Sprachen](/de/blog/config-languages/). Vollständige Pfade, Vorgaben und Grenzen stehen im [Konfigurationsverzeichnis](/de/blog/config-reference/).
