---
tags: ['anglefeint', 'starter']
title: 'Anleitung 5: Seiten und Funktionen anpassen'
subtitle: 'Startseite, About, Decoder, soziale Links, Musik und Listen nach eigenen Wünschen gestalten.'
description: 'Häufige Anpassungen, Funktionsschalter und eigene Seiten ohne Änderungen an den Standardabläufen.'
pubDate: '2026-03-07'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

Dies ist Teil 5 von 8 der Einführung. [Reihenfolge aller Tutorials](/de/blog/starter-guide-1-configure-your-site/#tutorial-order) · [Konfiguration nach Feldern](/de/blog/config-reference/).

Wenn dein Blog läuft, beginne mit dem Bereich, den du ändern möchtest. Du musst nicht alle Einstellungen ausfüllen oder sämtliche Beispiele kopieren.

Alle TypeScript-Ausschnitte gehören in das bestehende `defineThemeConfig({...})` von `src/site.config.ts`. Behalte jeweils nur ein `theme`, `i18n` und `social`. Ändere vorhandene Felder und erhalte andere persönliche Werte. Objekte werden mit Vorgaben vereinigt, Arrays dagegen vollständig ersetzt. Erhalte beim Ergänzen von Links, Liedern oder Einträgen alle weiterhin gewünschten Elemente.

Diese Anleitung zeigt häufige Aufgaben, kein vollständiges Feldverzeichnis. Suche den sichtbaren Bereich und lies den passenden Abschnitt.

## 1. Hinweise und Effekte der Startseite anpassen

Website-Name, großer Startseitentitel und Einführung werden in [Teil 1](/de/blog/starter-guide-1-configure-your-site/) unterschieden. Hier geht es um Hinweisabschnitte und Interaktionen:

```ts
theme: {
  home: {
    showInitialize: true,
    showFollow: true,
    showTrace: true,
  },
  effects: { enableHomePassage: false },
},
```

| Feld                              | Standard | Änderung                                                                                                                                     |
| --------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `theme.home.showInitialize`       | `true`   | Zeigt Initialize/done-Starttext; false verbirgt diesen Abschnitt                                                                             |
| `theme.home.showFollow`           | `true`   | Zeigt Wake Up/Follow-Hinweise; false verbirgt sie unabhängig                                                                                 |
| `theme.home.showTrace`            | `true`   | Zeigt PIRATE SIGNAL/TRACE unten auf der Startseite; false verbirgt diesen Bereich                                                            |
| `theme.effects.enableHomePassage` | `false`  | Artikel-Titellinks können eine etwa achtsekündige Matrix-Passage vor Navigation starten; bei reduzierter Bewegung erfolgt direkte Navigation |

Diese Felder schalten weder den gesamten Coderegen ab noch ändern sie das globale Farbschema. `showTrace` steuert auch nicht das Breitbild-Terminal unten rechts.

### Text des Breitbild-Terminals ändern

Das Terminal zeigt standardmäßig `Knock, knock.`. Du kannst zunächst den englischen Wert für Sprachen ohne eigene Überschreibung setzen:

```ts
i18n: {
  locales: {
    de: { messages: { home: { transmission: 'Gedanken festhalten und kleine Hinweise hinterlassen.' } } },
  },
},
```

Eigene Texte einer Sprache stehen in deren `messages.home.transmission`. Die Reihenfolge ist aktuelle Sprachkonfiguration → englische Konfiguration → `Knock, knock.`, nicht die vollständige normale Übersetzungs-Fallback-Kette. Das Terminal erscheint im Breitbildlayout; auf Mobilgeräten ist fehlende Anzeige kein Konfigurationsfehler. Erst der Schlüssellochknopf öffnet die Korridorvorschau.

Der Oracle-Einstieg im About verwendet unabhängig eine Szenenvorschau und wird nicht vom Startseiten-Artikelpassage-Schalter gesteuert. Terminaltexte und unterer Status dienen der Atmosphäre, nicht als echte Maschinen-, Netzwerk- oder Sicherheitsdaten.

Vollständige Definitionen stehen im [Startseitenverzeichnis](/de/blog/config-home/#startup-switches).

## 2. About mit eigener Vorstellung füllen

Unter `/zh/about/` findest du die aktuellen Inhalte. Texte und Kontaktangaben werden pro Sprache konfiguriert, ohne Änderungen an Theme-Seitentemplates:

```ts
i18n: {
  locales: {
    de: {
      about: {
        metaLine: '$ profile | building and learning',
        sections: {
          who: 'Ich bin Alex und entwickle und schreibe gern.',
          what: 'Hier sammle ich meine Projekte und Lernnotizen.',
          ethos: ['Bleib neugierig.', 'Ideen in nützliche Dinge verwandeln.'],
          now: 'Ich überarbeite gerade meinen Blog.',
          contactLead: 'Melde dich gern bei mir.',
          signature: '> Danke für deinen Besuch.',
        },
        contact: {
          email: 'you@example.com',
          githubUrl: 'https://github.com/yourname',
          githubLabel: 'GitHub',
        },
      },
    },
  },
},
```

Ersetze Namen und Adressen. `metaLine` ist die Statuszeile oben im Personenpanel. `who`, `what`, `ethos` und `now` enthalten Vorstellung, Tätigkeit, Haltung und Aktuelles. `contactLead` leitet Kontakt ein, `signature` ist die Unterschrift. `ethos` ist ein String-Array; ein neues Array ersetzt alle bisherigen Einträge.

Absätze und Signatur sind Klartext: `\n` erzeugt einen Umbruch, `\n\n` eine Leerzeile. Markdown und HTML werden nicht ausgewertet; verwende kein `<br>`. Das Beispiel ändert nur vereinfachtes Chinesisch. Andere Sprachen brauchen eigene Texte und werden nicht automatisch übersetzt. Fehlende Felder folgen den Fallback-Regeln der Sprache.

About-Fenster lassen sich schließen, minimieren und maximieren und speichern ihren Zustand lokal im Browser. KI-Ausgaben und Downloadfortschritt sind Theme-Interaktionen, keine durch Textangaben verbundenen KI-Dienste. Der Decoder verarbeitet lokale Browsereingaben.

Mit `enableAboutPage: false` in `theme` deaktivierst du About; Standard ist `true`. Dann entfallen Route, öffentliche Navigation und zugehörige Kontakt-Einstiege. Eigene Links in Texten oder Fußzeile werden nicht gelöscht und müssen geprüft werden.

Weitere Inhalte stehen im [About-Verzeichnis](/de/blog/config-about/#about-content); Befehls- und Reader-Texte im [Terminalverzeichnis](/de/blog/config-terminal/#messages).

## 3. Decoder und Lesekarten anpassen

Decoder Lab liegt unter `/zh/decoder/` und ist standardmäßig aktiv. Sein Erscheinungsbild würdigt Pioniere von Cypherpunk und digitaler Freiheit. Lokale Verarbeitung und Peer-to-Peer-Motive greifen die Idee persönlicher Kontrolle über Werkzeuge und Daten auf.

Die Werkzeuge dekodieren Text, erklären unterstützte Token-Aufrufe und prüfen Adressformate ohne RPC, Wallet-Verbindung oder API Key. Sie fragen keine Guthaben ab, führen keine Transaktionen aus und beweisen keine Adressinhaberschaft. calldata-Eingabe verifiziert kein tatsächliches Vertragsverhalten.

`enableDecoderPage: false` in `theme` deaktiviert Decoder und dessen Theme-Einstiege unabhängig. About und Decoder deaktivieren sich nicht gegenseitig. Eigene Links pflegst du selbst.

Würdigung und Lesekarten sind sprachabhängig, etwa für eine neue deutsche Liste:

```ts
i18n: {
  locales: {
    de: {
      messages: {
        decoderPage: {
          readings: {
            tribute: 'Ideen und Code bringen Privatsphäre und Freiheit voran.',
            links: [
              { title: 'Meine Leseliste', href: 'https://example.com/', author: 'Name des Autors', year: '2026' },
            ],
          },
        },
      },
    },
  },
},
```

`tribute: ''` verbirgt die Würdigung, `links: []` die Karten; Weglassen erhält Vorgaben. Jeder Eintrag braucht `title` und `href`. `author`, `year` und `cover` sind optional. `cover` akzeptiert integrierte Namen wie `privacy-code` oder `bitcoin` sowie public-Bildpfade oder HTTPS-Bilder. Ohne cover erscheint eine bildlose Karte.

`links` ersetzt die gesamte Liste, fügt nicht nur hinzu. Gewünschte alte Einträge müssen enthalten bleiben. Die Liste bietet deine Quellenlinks, lädt oder veröffentlicht Zielartikel aber nicht und validiert externe Ressourcen nicht automatisch.

Typen, integrierte Titelbilder und Standardlisten stehen im [Decoder-Verzeichnis](/de/blog/config-decoder/#readings).

## 4. Soziale Links und Fußzeile anpassen

`social.links` definiert gemeinsame Konten oben und unten in Array-Reihenfolge. Für ein eigenes Symbol lege zuerst `public/icons/community.svg` ab:

```ts
social: {
  links: [
    { href: 'https://github.com/yourname', label: 'GitHub', icon: 'github' },
    { href: 'https://example.com/community', label: 'Meine Community', iconSrc: '/icons/community.svg' },
  ],
},
```

`iconSrc` unterstützt lokale SVG-, PNG- und WebP-Dateien in public. Pfade beginnen mit `/`, ohne Remote-URL, Query, Fragment oder kodierte Zeichen. Es hat Vorrang vor `icon` und erhält die Bildfarben. Ohne beides erscheint Text. `label` ist der zugängliche Name. Fehlende Dateien oder nicht unterstützte integrierte Symbolnamen sind Konfigurationsfehler.

Optionales `rel` beschreibt etwa Identität. Für dein Mastodon-Konto kannst du `rel: 'me'` setzen. Das Theme erhält immer `noopener noreferrer` und ergänzt `me` nicht automatisch je Plattform. Verifikation erfolgt beim Anbieter. Veröffentliche die Website zuerst und trage im Anbieterprofil die echte Seite mit Rücklink ein; das Theme garantiert kein Prüfergebnis.

Auf Mobilbreiten verschwindet die obere Gruppe, die Fußzeile bleibt. `links: []` behält drei nicht klickbare Platzhalter, statt die ganze Gruppe auszublenden.

### Nennung, Erklärung und zusätzliche Links

```ts
site: { tagline: 'Bleib neugierig und schreibe weiter.' },
theme: {
  footer: {
    showCredits: true,
    links: [{ label: 'Quellcode des Projekts', href: 'https://github.com/yourname/your-project' }],
  },
},
```

- `site.tagline` ist eigener Klartext; leer blendet ihn aus und übersetzt nicht automatisch. Die alte Vorgabe `Built with Astro.` gilt als integrierte Nennung, um Doppelung zu vermeiden.
- `theme.footer.showCredits` ist standardmäßig `true` und steuert Theme- und Astro-Nennung. Ausgeschaltet bleiben Copyright, eigener Text und zusätzliche Links. Der Schalter gilt auch für die Theme-Nennung auf automatischen Artikel-Freigabebildern, nicht für eigene Bilder.
- `theme.footer.links` ist standardmäßig leer und zeigt Links zwischen Copyright und Nennung, unabhängig von sozialen Symbolen. Labels bleiben unverändert, werden nicht übersetzt und hängen nicht von showCredits ab.

Das Copyright nutzt den Website-Namen und das Jahr des Builds. Änderungen erfordern einen neuen Build und Deployment.

Pfad- und Linkregeln stehen unter [soziale Felder](/de/blog/config-site-chrome/#social-fields), Fußzeilenregeln unter [Fußzeile](/de/blog/config-site-chrome/#footer).

## 5. Musikplayer aktivieren

Lege deine Audiodatei unter `public/music/my-song.mp3` ab und vereinige:

```ts
theme: {
  music: {
    enabled: true,
    tracks: [{ title: 'Ein Lied von mir', artist: 'Autor', src: '/music/my-song.mp3' }],
  },
},
```

Musik ist standardmäßig deaktiviert, das Theme enthält keine Lieder. Jede Spur braucht `title` und `src`, `artist` ist optional. Eine leere Liste zeigt keinen Player. Erhalte beim Hinzufügen alte Einträge. URLs enthalten kein `public` und sind weder lokale Laufwerkspfade noch Plattform-Freigabeseiten. Direkte HTTPS-Audioadressen funktionieren; keine Leerzeichen oder Backslashes im Pfad. Leere Titel und ungültige Formate verursachen Fehler. Ein korrektes Format garantiert keine erreichbare Datei.

Der Player erscheint auf Seiten mit öffentlichem Theme-Layout, ohne Schalter pro Seite. Neue Seiten beginnen eingeklappt. Beim Erstbesuch lädt Audio erst nach PLAY. Nach dem aktuellen Lied folgt das nächste, nach dem letzten wieder das erste. Auf Mobilgeräten verbirgt der aufgeklappte Player vorübergehend den Nach-oben-Knopf.

Innerhalb derselben Tab-Sitzung bleiben Spur, Position und Lautstärke erhalten. Nach zuvor laufender Wiedergabe versucht der Player nach Navigation oder Reload fortzusetzen; manuelle Pause bleibt Pause. Das ist keine lückenlose Wiedergabe, und Browser können Autoplay blockieren. Ohne Speicher funktioniert manuelles Abspielen, aber keine Sitzungsfortsetzung.

Der Player lädt derzeit das gesamte Lied und spielt einen Blob ab. Positionswechsel benötigen keine Range-Unterstützung des Servers. Große Dateien erhöhen Wartezeit und Speicherbedarf. Fremde Server müssen CORS erlauben; lokale public-Dateien derselben Website brauchen keine Cross-Origin-Einstellung. Prüfe die Erreichbarkeit. Deaktiviere bei Bedarf `theme.music.enabled: false`.

Spurfelder, Statustexte und Fortsetzungsgrenzen erklärt das [Musikverzeichnis](/de/blog/config-music/#track-fields).

## 6. Listenanzahl und Seiteneinteilung ändern

```ts
theme: {
  homeLatestCount: 3,
  blogPageSize: 10,
  pagination: {
    windowSize: 7,
    showJumpThreshold: 12,
    jump: { enabled: true, enterToGo: true },
    style: { enabled: true, mode: 'fixed', variants: 9, fixedVariant: 1 },
  },
},
```

`homeLatestCount` ist standardmäßig 3 für neueste Startseitenartikel. `blogPageSize` ist 10 für Blog- und Taglisten. Verwende sinnvolle positive Ganzzahlen. Beide steuern weder die höchstens drei Fragment-Vorschauen noch die Fragment-Seitengröße `theme.fragments.pageSize`.

`windowSize` ist standardmäßig 7 und begrenzt das sichtbare Seitenfenster beim Rendern auf 5–21, nicht Artikel pro Seite. Der Sprungeinstieg braucht `jump.enabled` und mehr Seiten als `showJumpThreshold`. Standardmäßig erscheint er oberhalb 12 Seiten. `enterToGo` erlaubt oder verhindert Enter zum Springen.

Der Standardstil ist `random`. Das Beispiel nutzt `fixed` für eine feste Variante. `sequential` folgt der Seitenreihenfolge, `random` wählt bei Client-Initialisierung erneut zufällig und kann Wiederholungen ergeben. Ohne JavaScript bleibt ein statischer Build-Stil. `variants` begrenzt die Auswahl beim Rendern auf 1–12, `fixedVariant` auf den vorhandenen Bereich.

`style.enabled: false` verwendet den Basisstil, deaktiviert aber keine Seiteneinteilung. Blog, Tags und Fragments teilen diese Einstellungen; beachte alle drei.

Vollständige Bereiche, Varianten und Texte stehen im [Listenverzeichnis](/de/blog/config-blog-list/#pagination-window).

## 7. Nur nicht benötigte Funktionen deaktivieren

Diese Tabelle beschreibt den Wirkungsbereich. Du musst nicht alle Schalter deaktivieren, um eine Funktion einzurichten.

| Konfigurationspfad             | Standard | Wirkung von false                                                                     |
| ------------------------------ | -------- | ------------------------------------------------------------------------------------- |
| `theme.enableAboutPage`        | `true`   | Keine About-Seite und keine zugehörigen Theme-Einstiege                               |
| `theme.enableDecoderPage`      | `true`   | Keine Decoder-Seite und keine zugehörigen Theme-Einstiege                             |
| `theme.effects.enableRedQueen` | `true`   | Verbirgt den Red-Queen-Monitor, nicht alle AI-Artikeleffekte                          |
| `theme.search.enabled`         | `true`   | Deaktiviert Artikelsuche und Indexerzeugung                                           |
| `theme.toc.enabled`            | `true`   | Deaktiviert das Standard-Inhaltsverzeichnis; einzelnes `toc: true` kann überschreiben |
| `theme.tags.enabled`           | `true`   | Deaktiviert Tag-Einstiege und -Seiten, löscht keine Beiträge                          |
| `theme.math.enabled`           | `true`   | Deaktiviert Markdown-/MDX-Mathematik                                                  |
| `theme.socialImage.enabled`    | `true`   | Stoppt automatische Artikel-Freigabebilder; manuelles ogImage bleibt wirksam          |

Nur für den Monitor reicht `theme: { effects: { enableRedQueen: false } }`. Suche, Musik und About ändern sich dadurch nicht.

Kommentare und Fragments sind standardmäßig aus. Aktiviere sie nicht für andere Funktionen, sondern lies bei Bedarf [Giscus konfigurieren](/de/blog/starter-guide-4-giscus-comments/) und [Ein Fragment veröffentlichen](/de/blog/starter-guide-5-fragments/). Inhaltsverzeichnis, Formeln und Freigabebilder erklären [Teil 2](/de/blog/starter-guide-2-languages-and-routing/) und das [Bildertutorial](/de/blog/starter-guide-images/).

## 8. Eine eigene Portfolio-Seite erstellen

Für eine separate Projektseite führe im Stamm aus:

```bash
npm run new-page -- projects
```

Der Befehl erzeugt `src/pages/[lang]/projects.astro` mit `base`-Layout und Routen `/<Sprachcode>/projects/` für aktive Sprachen, etwa `/en/projects/` oder `/zh/projects/`. Bearbeite den Inhalt der Astro-Datei. Sie wird nicht übersetzt und nicht automatisch in die obere Navigation aufgenommen. Verlinke sie aus Text oder Fußzeile.

Für einen bestimmten Stil verwende `--theme`, etwa `npm run new-page -- portfolio --theme cyber` für eine weitere Cyberpunk-Seite. Erlaubt sind `base`, `ai`, `cyber`, `hacker` und `matrix`. Sie wählen das Layout dieser Seite und wechseln nicht global die vier Atmosphären. Slugs erlauben englische Kleinbuchstaben, Zahlen, Bindestriche und verschachtelte Pfade wie `projects/labs`. Vermeide Standardrouten des Pakets. Existierende Dateien sind Fehler; führe nicht alle fünf Theme-Befehle für denselben Pfad aus.

## 9. Änderungen nach dem Speichern prüfen

Öffne in dev die geänderte Seite und prüfe Inhalte, Links und Funktionseinstiege. Alte Umgebungsüberschreibungen behandelst du nach [Teil 1](/de/blog/starter-guide-1-configure-your-site/). Fehlende Symbole, Audiofehler und externe Links brauchen jeweils Pfad- und Netzwerkprüfung, kein wiederholtes Überschreiben der gesamten Konfiguration.

Stoppe vor Veröffentlichung dev und führe aus:

```bash
npm run doctor
npm run preview
```

doctor enthält lokale Vorbereitung, Prüfungen und Build. Nach Erfolg musst du nicht direkt check oder build wiederholen. Suche prüfst du in der gebauten preview, die selbst nichts veröffentlicht. Die Website benötigt weiterhin das gesamte neue `dist/`; lokales Speichern ändert keine Online-Seite.

## Tutorial-Navigation und Konfiguration

[Zurück: Ein Fragment veröffentlichen](/de/blog/starter-guide-5-fragments/) · [Weiter: Leserkommentare](/de/blog/starter-guide-4-giscus-comments/) · [Alle acht Tutorials](/de/blog/starter-guide-1-configure-your-site/#tutorial-order).

Passende Felder: [Startseite](/de/blog/config-home/), [About](/de/blog/config-about/), [Terminal](/de/blog/config-terminal/), [Decoder](/de/blog/config-decoder/), [Navigation, soziale Links und Fußzeile](/de/blog/config-site-chrome/), [Musik](/de/blog/config-music/), [Listen und Seiteneinteilung](/de/blog/config-blog-list/). Vollständige Pfade, Vorgaben und Grenzen stehen im [Konfigurationsverzeichnis](/de/blog/config-reference/).
