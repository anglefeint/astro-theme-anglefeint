---
tags: ['anglefeint', 'config']
title: 'Konfigurationsverzeichnis: About'
subtitle: 'Vorstellung, Kontakt, Werkzeugdialoge, Effekte und Seitentexte.'
description: 'Alle About-Felder einschließlich exakter Standardarrays, Fallbacks und derzeit ungenutzter Kompatibilitätstexte.'
pubDate: '2026-11-13'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/hacker-01.webp'
---

Für eine eigene Vorstellung lies [Seiten und Funktionen anpassen](/de/blog/starter-guide-3-comments-about-and-theme-toggles/), für Installation und Konfigurationsort [Teil 1](/de/blog/starter-guide-1-configure-your-site/). Andere Module im [Gesamtverzeichnis](/de/blog/config-reference/).

About liest seinen Text nicht aus einem Markdown-Artikel. Inhalte stehen unter `i18n.locales.<Sprachcode>.about` in `src/site.config.ts`, Seiten-/Kapiteltitel unter derselben Sprache in `messages.about`. Vorgaben stammen aus dem Paket, nicht der persönlichen Demo.

<a id="page-enabled"></a>

## theme.enableAboutPage: Seitenschalter

- **Typ / Standard:** boolean / true.
- **Status und Wirkung:** wirksam. Erzeugt `/<Sprachcode>/about/` für aktive Sprachen. Deaktiviert entfallen Standardseite sowie entsprechende Navigation und Contact-Ziele.
- **Grenzen:** Kein einzelner Abschnittsschalter oder Löschen von Inhalten. Geschlossene Seiten leiten nicht automatisch zur Startseite. Änderungen brauchen Build/Deployment und garantieren keine Entfernung alter Hosting-Dateien oder öffentlicher Daten.
- **Beispiel:** `theme: { enableAboutPage: false }`.

<a id="about-content"></a>

## About-Inhalte und Werkzeuge

Tabellenpräfix **`i18n.locales.<Sprachcode>.about.`**, etwa `i18n.locales.de.about.sections.who`. Typen beschreiben erlaubte Überschreibungen vor dem Vereinigen. Alle optional; Fallbacks und Theme-Basis ergänzen sie. zh/en nutzen dieselben englischen Platzhalter, daher eine gemeinsame Standardspalte. Andere Sprachen können eigene Übersetzungen haben; übertrage englische Vorgaben nicht ungeprüft.

Kein allgemeines Längen- oder URL-Validierungssystem für Strings. Verwende passende kurze Texte, E-Mail und Links. Arrays sind string[] und ersetzen vollständig. Leer ist kein allgemeines Abschalten; siehe Zeilen. Beispiele sind Feldwerte in der passenden Objekthierarchie.

<a id="body-fields"></a>

### Haupttext

| Feld                   | Typ      | Standard zh/en                                                                                       | Status, Wirkung und Grenzen                                                  | Beispiel                                                                   |
| ---------------------- | -------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `metaLine`             | string   | `"$ profile booted \| mode: builder"`                                                                | Wirksam: Statuszeile über Titel, leer verbirgt sie                           | `"profile ready"`                                                          |
| `sections.who`         | string   | `"Write a short introduction about yourself, your background, and your primary focus areas."`        | Wirksam: Who-Text, kein Kapiteltitel                                         | `"Ich entwickle Frontends."`                                               |
| `sections.what`        | string   | `"Describe what you build, your core skills, and the kinds of projects you want to be known for."`   | Wirksam: What-Text                                                           | `"Ich arbeite an meinem Blog und an Open-Source-Werkzeugen."`              |
| `sections.ethos`       | string[] | sections.ethos unter [Array-Vorgaben](#array-defaults)                                               | Wirksam: ein Prinzip je Element. [] leert Einträge, nicht Kapitelüberschrift | `["Klarheit zuerst.","Regelmäßig kleine Verbesserungen veröffentlichen."]` |
| `sections.now`         | string   | `"Share what you are currently building, shipping, or learning."`                                    | Wirksam: Now-Text                                                            | `"Ich lerne gerade Astro."`                                                |
| `sections.contactLead` | string   | `"Add a short collaboration note (for example: open to freelance, consulting, or full-time roles)."` | Wirksam: Kontaktbeginn vor Hinweis und Links                                 | `"Ich freue mich auf den Austausch."`                                      |
| `sections.signature`   | string   | `"> Replace with your own signature."`                                                               | Wirksam: unterer Zitatblock und virtuelles about.md                          | `"Bleib neugierig."`                                                       |

<a id="contact-fields"></a>

### Kontakt

| Feld                  | Typ    | Standard zh/en                  | Status, Wirkung und Grenzen                                                                                               | Beispiel                        |
| --------------------- | ------ | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| `contact.email`       | string | `"you@example.com"`             | Bedingt: nach trim leer ohne Mail-Link und contactEmailLead. Link nutzt Originalstring, keine Rand-Leerzeichen            | `"hello@example.com"`           |
| `contact.githubUrl`   | string | `"https://github.com/yourname"` | Wirksam: Kontaktziel unabhängig von social.links. Leer verbirgt nicht automatisch den Link, vollständiges HTTPS empfohlen | `"https://github.com/yourname"` |
| `contact.githubLabel` | string | `"GitHub"`                      | Wirksam: sichtbarer Linktext, nicht auf GitHub als Namen beschränkt                                                       | `"Mein GitHub"`                 |

<a id="tool-fields"></a>

### Werkzeugeinstiege

| Feld                 | Typ    | Standard zh/en         | Status, Wirkung und Grenzen                                                                        | Beispiel              |
| -------------------- | ------ | ---------------------- | -------------------------------------------------------------------------------------------------- | --------------------- |
| `sidebar.dlData`     | string | `"DL Data"`            | Wirksam: DL-Data-Knopf und zugänglicher Name, keine Funktionsänderung                              | `"Datenübersicht"`    |
| `sidebar.ai`         | string | `"AI"`                 | Wirksam: AI-Knopf und zugänglicher Name                                                            | `"Meine Werkzeuge"`   |
| `sidebar.decryptor`  | string | `"Decryptor"`          | Wirksam: Decoder-Einstieg, keine internen Werkzeugtexte                                            | `"Decoder-Werkzeuge"` |
| `sidebar.help`       | string | `"Help"`               | Wirksam: Tastaturpanel-Einstieg                                                                    | `"Tastatur"`          |
| `sidebar.allScripts` | string | `"All Scripts"`        | Wirksam: Verzeichnis aktueller Sprachartikel                                                       | `"Alle Artikel"`      |
| `scriptsPath`        | string | `"/root/bash/scripts"` | Wirksam: sichtbarer Verzeichnispfad, virtueller Präfix und Startordner, kein Server-/Laufwerkspfad | `"/home/me/notes"`    |

<a id="label-fields"></a>

### Gemeinsame Texte

| Feld                        | Typ    | Standard zh/en    | Status, Wirkung und Grenzen                                                                                             | Beispiel             |
| --------------------------- | ------ | ----------------- | ----------------------------------------------------------------------------------------------------------------------- | -------------------- |
| `labels.modalOutput`        | string | `"Output"`        | Nicht als geöffneter Werkzeugtitel verwendet; nur anfänglicher HTML-Platzhalter, beim Öffnen durch modals-title ersetzt | `"Ausgabe"`          |
| `labels.modalClose`         | string | `"Close"`         | Wirksam: zugänglicher Name von Werkzeug-/Textfenster-Schließen, kein Funktions-Aus                                      | `"Schließen"`        |
| `labels.responseOutput`     | string | `"Output"`        | Wirksam: OUTPUT-Label über Textpanel                                                                                    | `"OUTPUT"`           |
| `labels.contactEmailLead`   | string | `"Reach me via"`  | Bedingt: vor nichtleerem Mail-Link                                                                                      | `"E-Mail:"`          |
| `labels.contactConnectLead` | string | `"or connect on"` | Wirksam: immer vor Kontaktlink, auch ohne E-Mail. Satzanschluss beachten                                                | `"oder besuche"`     |
| `labels.backToTop`          | string | `"Back to top"`   | Bedingt: Tooltip/zugänglicher Nach-oben-Name, keine Schwelle                                                            | `"Nach oben"`        |
| `labels.quickAccess`        | string | `"Quick access"`  | Wirksam: zugänglicher Werkzeugnavigationsname                                                                           | `"Schnellwerkzeuge"` |
| `labels.contactEmailLabel`  | string | `"email"`         | Bedingt: sichtbarer E-Mail-Linktext, nicht Adresse; nur mit E-Mail                                                      | `"E-Mail senden"`    |

<a id="modal-fields"></a>

### Werkzeugdialoge

| Feld                                      | Typ      | Standard zh/en                                          | Status, Wirkung und Grenzen                                                                    | Beispiel                                    |
| ----------------------------------------- | -------- | ------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------- |
| `modals.dlData.title`                     | string   | `"Downloading..."`                                      | Bedingt: Datenanimationsdialog-Titel                                                           | `"Datenübertragung"`                        |
| `modals.dlData.subtitle`                  | string   | `"Critical Data"`                                       | Bedingt: Untertitel, nur Animation statt Dateidownload                                         | `"Demodaten"`                               |
| `modals.ai.title`                         | string   | `"AI"`                                                  | Bedingt: KI-Textpanel-Titel                                                                    | `"Werkzeuge und Arbeitsabläufe"`            |
| `modals.ai.lines`                         | string[] | modals.ai.lines unter [Array-Vorgaben](#array-defaults) | Bedingt: statischer Klartext zeilenweise, keine KI. [] ergibt leeres pre, Panel bleibt öffnbar | `["~ $ tools --list","Astro / TypeScript"]` |
| `modals.decryptor.title`                  | string   | `"Hacker Decryptor"`                                    | Bedingt: aktueller Decoder-Dialogtitel, weiterhin verwendet                                    | `"Lokaler Decoder"`                         |
| `modals.decryptor.header`                 | string   | `"Calculating Hashes"`                                  | Derzeit ungenutzt: alter Rechnertext, DecoderForm liest nicht                                  | `"Wird berechnet"`                          |
| `modals.decryptor.keysLabel`              | string   | `"keys tested"`                                         | Derzeit ungenutzt, ändert Decoder nicht                                                        | `"Getestete Schlüssel"`                     |
| `modals.decryptor.currentPassphraseLabel` | string   | `"Current passphrase:"`                                 | Derzeit ungenutzt, ändert Decoder nicht                                                        | `"Aktuelle Passphrase"`                     |
| `modals.decryptor.masterKeyLabel`         | string   | `"Master key"`                                          | Derzeit ungenutzt, ändert Decoder nicht                                                        | `"Hauptschlüssel"`                          |
| `modals.decryptor.transientKeyLabel`      | string   | `"Transient key"`                                       | Derzeit ungenutzt, ändert Decoder nicht                                                        | `"Temporärer Schlüssel"`                    |
| `modals.help.title`                       | string   | `"Help"`                                                | Bedingt: Tastaturpanel-Titel                                                                   | `"Tastaturbereich"`                         |
| `modals.help.statsLabel`                  | string   | `"Stats & Achievements"`                                | Bedingt: Statistiküberschrift, leer fällt auf Englisch zurück                                  | `"Eingabestatistik"`                        |
| `modals.help.typedPrefix`                 | string   | `"You typed:"`                                          | Bedingt: Eingabezählpräfix, leer fällt auf Englisch zurück                                     | `"Eingegeben:"`                             |
| `modals.help.typedSuffix`                 | string   | `"characters"`                                          | Bedingt: Eingabezählsuffix, leer fällt auf Englisch zurück                                     | `"Zeichen"`                                 |
| `modals.allScripts.title`                 | string   | `"/root/bash/scripts"`                                  | Bedingt: Artikeldialog-Titel unabhängig von scriptsPath, kein automatisches Mitändern          | `"Artikelverzeichnis"`                      |

<a id="effect-fields"></a>

### Effekte

| Feld                       | Typ      | Standard zh/en                                                  | Status, Wirkung und Grenzen                                                                                   | Beispiel                |
| -------------------------- | -------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ----------------------- |
| `effects.backgroundLines`  | string[] | effects.backgroundLines unter [Array-Vorgaben](#array-defaults) | Standard-About zeigt es nicht. Nur Fallback-Zweig ohne interaktive Terminal-session, kein Hintergrundschalter | `["~ $ hello","ready"]` |
| `effects.scrollToasts.p30` | string   | `"context parsed"`                                              | Bedingt: Hinweis bei 30% Scrollfortschritt, leer fällt auf context parsed                                     | `"Bis hierher gelesen"` |
| `effects.scrollToasts.p60` | string   | `"inference stable"`                                            | Bedingt: Hinweis bei 60%, leer fällt auf inference stable                                                     | `"Weiter erkunden"`     |
| `effects.scrollToasts.p90` | string   | `"output finalized"`                                            | Bedingt: Hinweis bei 90%, leer fällt auf output finalized                                                     | `"Danke fürs Lesen"`    |

Text wird als Klartext gerendert, nicht Markdown/HTML. Stile erhalten Zeilenumbrüche. **Fett**, Linksyntax und HTML ergeben keine entsprechenden Rich-Text-Elemente. Leerer Text entfernt weder Überschriften noch Inhaltsverzeichnis. Reihenfolge und Anker who/what/ethos/now/contact sind fest.

`scriptsPath` sollte ein kurzer absoluter virtueller Pfad wie /home/me/notes sein, ohne Zeilenumbrüche, Nullzeichen und Dateikonflikte. Das Terminal normalisiert ., .. und wiederholte Schrägstriche. Über 1024 Zeichen oder ungültige Steuerzeichen können die virtuelle Dateisysteminitialisierung scheitern lassen. Es führt keine Shell aus und liest keine beliebigen Serverordner. Dateien stammen aus generierten Sprachartikeln und `about.md`. All Scripts ist keine frei ausführbare Skriptliste.

DL Data ist eine Fortschrittsanimation, kein Download. model/latency im KI-Panel sind statisch, keine Echtzeitdaten. Ersetze sie durch tatsächliche Angaben oder kennzeichne sie als Demo.

Die drei Help-Statistiktexte werden per Skript in Panel-HTML eingesetzt. Verwende nur vertrauenswürdigen kurzen Klartext, keine externen Eingaben. Leer fällt bei diesen dreien auf Englisch zurück statt Labels zu leeren. Andere About- und KI-Zeilen werden anders gerendert; nicht alle Konfiguration ist HTML.

Scrollhinweise folgen dem gesamten Dokumentfortschritt. Nach Scrollbeginn erscheint jede Schwelle höchstens einmal pro Initialisierung. Keine gelesenen Wörter oder KI-Verarbeitung. Keine öffentlichen Schwellen-/Dauerfelder; leer deaktiviert Hinweise nicht.

<a id="array-defaults"></a>

### Vorgaben der drei Arrays

Vollständige tatsächliche zh/en-Arrays. Reihenfolge und Leerzeilen haben Bedeutung; neue Arrays ersetzen alle Elemente.

**sections.ethos**

```json
[
  "Prioritize clarity before complexity.",
  "Favor maintainable systems over one-off solutions.",
  "Ship in small iterations and learn from feedback.",
  "Communicate directly and document decisions."
]
```

**modals.ai.lines**

```json
[
  "~ $ ai --status --verbose",
  "",
  "model: anglefeint-core",
  "mode: reasoning + builder",
  "context window: 128k",
  "tools: codex / cursor / claude-code",
  "latency: 120-220ms",
  "safety: guardrails enabled",
  "",
  ">> system online",
  ">> ready for execution"
]
```

**effects.backgroundLines**

```json
[
  "~ $ ls -la",
  "total 42",
  "drwxr-xr-x  12 user  staff   384  Jan 12  about  blog  projects",
  "drwxr-xr-x   8 user  staff   256  Jan 11  .config  .ssh  keys",
  "-rw-r--r--   1 user  staff  2048  Jan 10  README.md  .env.gpg",
  "-rwxr-xr-x   1 user  staff   512  Jan  9  deploy.sh  script",
  "~ $ cat .motd",
  ">> welcome | access granted"
]
```

<a id="about-messages"></a>

## Seitentitel und gemeinsame Steuertexte

Unter `i18n.locales.<Sprachcode>.messages`, nicht im about-Inhaltsobjekt. Optionale string mit integrierter aktueller Sprache und Fallback. Tabelle zeigt vereinfachtes Chinesisch/Englisch. Texte wechseln keine Funktionen oder Kapitel-IDs.

### messages.about

| Feld                | Standard vereinfachtes Chinesisch / Englisch                                                            | Wirkung und Grenzen                                                                           | Beispiel                                                 |
| ------------------- | ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `about.title`       | About — Hacker Ethos / About — Hacker Ethos                                                             | Bedingt: Seitentitel, Text-h1, Fenster- und virtuelles about.md-title                         | `"Über mich"`                                            |
| `about.description` | 我是谁、我在做什么，以及背后的黑客精神。 / Who I am, what I build, and the hacker ethos behind my work. | Bedingt: Metabeschreibung, keine automatische Einführung unter h1                             | `"Mein Hintergrund, meine Arbeit und meine Interessen."` |
| `about.who`         | 我是谁 / Who I Am                                                                                       | Bedingt: Who-Überschrift und Inhaltsverzeichnis, keine Anker-/Textänderung                    | `"Wer ich bin"`                                          |
| `about.what`        | 我在构建什么 / What I Build                                                                             | Bedingt: What-Überschrift und Verzeichnis                                                     | `"Was ich mache"`                                        |
| `about.ethos`       | 黑客精神 / Hacker Ethos                                                                                 | Bedingt: Ethos-Überschrift und Verzeichnis                                                    | `"Meine Grundsätze"`                                     |
| `about.now`         | 现在 / Now                                                                                              | Bedingt: Now-Überschrift und Verzeichnis                                                      | `"Woran ich gerade arbeite"`                             |
| `about.contact`     | 联系 / Contact                                                                                          | Bedingt: Contact-Überschrift und Verzeichnis, Anker bleibt contact                            | `"Kontakt"`                                              |
| `about.regenerate`  | 重播扫描 / Replay scan                                                                                  | Bedingt: Text/Tooltip/Name des unteren Scan-Knopfs. Nur visuell, keine KI und kein neuer Text | `"Erneut scannen"`                                       |

### messages.windowControls

| Feld                        | Standard vereinfachtes Chinesisch / Englisch | Wirkung und Grenzen                                             | Beispiel             |
| --------------------------- | -------------------------------------------- | --------------------------------------------------------------- | -------------------- |
| `windowControls.collapse`   | 折叠内容 / Collapse content                  | Bedingt: Textfenster minimieren und Werkzeuge einklappen        | `"Minimieren"`       |
| `windowControls.expand`     | 放大窗口 / Expand window                     | Bedingt: Werkzeug vergrößern; Textfenster nutzt fullscreen      | `"Vergrößern"`       |
| `windowControls.restore`    | 还原窗口 / Restore window                    | Bedingt: Wiederherstellung und Wiederöffnung                    | `"Wiederherstellen"` |
| `windowControls.fullscreen` | 全屏阅读 / Full screen                       | Bedingt: Browser-Vollbild für Textfenster, keine Rechteänderung | `"Vollbild"`         |

### messages.scriptFolders

| Feld                      | Standard vereinfachtes Chinesisch / Englisch                                                                 | Wirkung und Grenzen                                              | Beispiel                                            |
| ------------------------- | ------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------- | --------------------------------------------------- |
| `scriptFolders.copyTitle` | 复制文章标题 / Copy article title                                                                            | Bedingt: All-Scripts-Knopf für Artikeltitelkopie, nicht Volltext | `"Titel kopieren"`                                  |
| `scriptFolders.copied`    | 标题已复制。 / Title copied.                                                                                 | Bedingt: Kopiererfolg                                            | `"Titel kopiert"`                                   |
| `scriptFolders.failed`    | 无法自动复制，已选中完整标题，请手动复制。 / Copy unavailable. The full title is selected; copy it manually. | Bedingt: Kopierfehler; leer kann im Skript auf Englisch fallen   | `"Kopieren fehlgeschlagen, bitte manuell kopieren"` |

<a id="example"></a>

## Ein Beispiel zum Vereinigen

Vereinige mit bestehendem `defineThemeConfig({...})` in `src/site.config.ts`, erhalte import, export und persönliche Werte. Kein doppeltes theme/i18n.

```ts
theme: { enableAboutPage: true },
i18n: {
  locales: {
    de: {
      about: {
        metaLine: '$ profile ready',
        sections: {
          who: 'Ich entwickle Frontends.',
          what: 'Ich arbeite an meinem Blog und an Open-Source-Werkzeugen.',
          ethos: ['Klarheit zuerst.', 'Regelmäßig kleine Verbesserungen veröffentlichen.'],
          now: 'Ich lerne gerade Astro.',
          contactLead: 'Ich freue mich auf den Austausch.',
          signature: 'Bleib neugierig.',
        },
        contact: {
          email: 'hello@example.com',
          githubUrl: 'https://github.com/yourname',
          githubLabel: 'GitHub',
        },
        scriptsPath: '/home/me/notes',
        modals: {
          allScripts: { title: 'Artikelverzeichnis' },
          ai: { lines: ['~ $ tools --list', 'Astro / TypeScript'] },
        },
      },
      messages: {
        about: { title: 'Über mich', description: 'Mein Hintergrund, meine Arbeit und meine Interessen.' },
      },
    },
  },
},
```

Konfiguration wird entlang der Sprachkette von niedriger zu hoher Priorität rekursiv vereinigt, aktuelle Sprache überschreibt Fallback, Basis-About ergänzt. Arrays ersetzen, undefined überschreibt nicht. Nur zh zu setzen ändert nicht alle Sprachen. Aktivierung/Fallbacks im [Sprachentutorial](/de/blog/starter-guide-languages/).

<a id="boundaries"></a>

## Verwandte und nicht verfügbare Einstellungen

- **Navigation und Verzeichnis:** `i18n.locales.<Sprachcode>.messages.nav.about` steuert öffentlichen Einstieg und Wiederöffnen nach Schließen. string, Standard vereinfachtes Chinesisch „关于“/Englisch „About“, etwa „Über mich“. `messages.blog.toc` steuert Verzeichnistitel und zugänglichen Namen: string, „文章目录“/„On this page“, etwa „Seiteninhalt“. Gilt auch für Artikel, siehe [Artikeltexte](/de/blog/config-article/#article-messages).
- **Vollständiger Decoder:** `theme.enableDecoderPage` ist boolean, Standard true. `theme: { enableDecoderPage: false }` entfernt eigenständige Seite und Dialoglink zum vollständigen Tool, nicht den eingebetteten About-Decoder. Interne Texte verwenden messages.decoder/messages.decoderPage im [Decoder-Verzeichnis](/de/blog/config-decoder/), nicht die fünf alten decryptor-Textfelder.
- **Terminal:** messages.terminal ist gemeinsame Interaktionssprache, nicht about.effects.backgroundLines. Das Terminal ist ein begrenztes virtuelles Webdateisystem; Konfiguration autorisiert keine lokalen Programme. Sechzehn Felder, Platzhalter und Status im [Terminalverzeichnis](/de/blog/config-terminal/).
- **Fenster und Animationen:** Keine öffentlichen About-Panelmaße, Anfangs-Schließzustände, Text-Fade-ins, Werkzeugverstecken, Verzeichnisreihenfolge oder Oracle-Umbenennung/-Einzelschalter. Laufzeit und lokaler Speicher verwalten Fenster. Ohne JavaScript bleibt Text lesbar, Werkzeuge nicht garantiert nutzbar. Text ist sofort sichtbar ohne Scrollobserver. System-Reduced-Motion folgt der Laufzeit, kein neuer Schalter hier.
- **Kontakt:** About-contact ist unabhängig von social.links. Fußzeilenänderungen ersetzen keine About-Kontakte.

Fünf alte decryptor-Textfelder sind typakzeptiert, aber ungenutzt. backgroundLines hat nur Fallback-Verwendung, modalOutput ist initialer Platzhalter. Konfiguriere aktuelle Werkzeuge nicht über diese Werte und ändere die Implementierung nicht zur Anpassung an alte Texte.
