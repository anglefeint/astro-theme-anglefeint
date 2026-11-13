---
tags: ['anglefeint', 'config']
title: 'Konfigurationsverzeichnis: GA4 und KI-Leseergänzungen'
subtitle: 'Zugriffsstatistik und öffentliche Hinweise für maschinenlesbare Ausgaben.'
description: 'Typen, Vorgaben, Validierung, Vererbung und Grenzen von analytics und aiReadableContent.'
pubDate: '2026-11-13'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/ai-02.webp'
---

Für die erste Veröffentlichung lies das [Deployment-Tutorial](/de/blog/starter-guide-deployment/) mit Statistik-ID und öffentlichen Texten. Den Konfigurationsort erklärt [Installation](/de/blog/starter-guide-1-configure-your-site/), andere Module das [Gesamtverzeichnis](/de/blog/config-reference/).

Beide Gruppen stehen auf oberster Ebene von `src/site.config.ts` neben site und theme. analytics ist Zugriffsstatistik, aiReadableContent ergänzt öffentliche Website-Texte. Sie sind unabhängig: Statistik braucht keine KI-Ergänzung, öffentliche Exporte keine Statistik-ID.

<a id="analytics"></a>

## analytics.googleAnalyticsId: GA4-Kennung

| Pfad                        | Typ / Standard                                            | Status, Wirkung und Grenzen                                                                                                                                                                                                    | Beispiel                              |
| --------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------- |
| analytics                   | { googleAnalyticsId: string } / { googleAnalyticsId: '' } | Container für teilweise Überschreibungen, kein zusätzliches enabled                                                                                                                                                            | { googleAnalyticsId: 'G-XXXXXXXXXX' } |
| analytics.googleAnalyticsId | string / ''                                               | Bedingt: gültige ID, Produktionsbuild, keine lokale Ausschlussadresse. Leer/Leerraum deaktiviert, Rand-Leerraum entfällt. Regex ^G-[A-Z0-9]+$ mit großem Präfix und Buchstaben; ungültig wirft bei Komponentenauflösung Fehler | 'G-XXXXXXXXXX'                        |

Dies ist die Measurement ID eines GA4-Web-Datenstreams, keine numerische Property-ID, GTM-ID, alte UA-ID oder API-Schlüssel. Das Beispiel zeigt nur Format und braucht deine echte ID. Keine feste Zeichenanzahl oder Online-Prüfung des Streams. Regex-Erfolg beweist keinen Dateneingang.

```ts
analytics: {
  googleAnalyticsId: 'G-XXXXXXXXXX',
},
```

Zum Deaktivieren vereinige:

```ts
analytics: { googleAnalyticsId: '' },
```

Vereinige mit bestehendem `defineThemeConfig({...})`, ohne analytics zu duplizieren. Eine ID gilt für alle Sprachseiten mit öffentlichem Rahmen. Keine IDs pro Sprache oder Seite.

### Wann wird geladen?

| Umgebung oder Adresse                                   | Aktuelles Verhalten                                                                          |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| npm run dev                                             | Kein Loader, aber Feld wird vorher aufgelöst; Formatfehler werden nicht garantiert ignoriert |
| Produktion, leere ID                                    | Kein Loader                                                                                  |
| Produktion unter localhost oder .localhost-Subdomain    | Frühe Rückkehr ohne Statistikqueue oder Google-Anfrage                                       |
| Produktion unter 127.-Adressen, 0.0.0.0, ::1 oder [::1] | Ebenfalls übersprungen; Adressvergleich zuerst kleingeschrieben                              |
| Produktion unter LAN-IP oder Remote-Vorschaudomain      | Vorschau wird nicht automatisch ausgeschlossen; mit ID Ladeversuch                           |
| Produktion unter öffentlicher Domain mit gültiger ID    | Einmalige gtag-Queue, asynchroner Google-Client                                              |

Das Theme führt js-Initialisierung und config aus, sendet kein zusätzliches manuelles page_view und keine eigenen Such- oder Playerereignisse. Ein Einmalmarker schützt denselben Loader, erkennt aber keine zweite Installation anderer Werkzeuge. Prüfe bei manuellen Skripten oder GTM auf Doppelung.

Vorhandene window.dataLayer und window.gtag bleiben erhalten. Kein Consent-Panel, automatische Zustimmung, Proxy, Domain-Ausschlussliste oder Ereigniskonfiguration. Keine automatische PUBLIC_GA_*-Überschreibung. Umgebungssteuerung musst du in site.config ausdrücklich implementieren; erfundene Variablennamen liest das Theme nicht.

Alte eigene Adapter ohne ANALYTICS-Zweig gelten als unkonfiguriert. Das ist interne Kompatibilität, kein empfohlener anderer Pfad. Setze weiterhin nur analytics.googleAnalyticsId.

<a id="supplement"></a>

## aiReadableContent: globale öffentliche Ergänzung

Optionales MachineReadableSupplement-Objekt, standardmäßig nicht gesetzt. Auch ohne entstehen Maschinenlesedateien, nur ohne diese zusätzlichen Hinweise. {} deaktiviert den Export nicht.

| Vollständiger Pfad              | Typ / Standard                                                           | Status, Wirkung und Grenzen                                                                                                                                 | Beispiel                                                             |
| ------------------------------- | ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| aiReadableContent.notes         | string, optional / nicht gesetzt, leere Ausgabe                          | Bedingt: Markdown-Website-Hinweise in öffentlichen Texten. Leer/Leerraum lässt Abschnitt weg. Kein Textersatz oder privater KI-Prompt                       | 'Dies sind persönliche Lernnotizen, die überarbeitet werden können.' |
| aiReadableContent.links         | { label: string; href: string }[], optional / nicht gesetzt, leere Liste | Bedingt: öffentliche Zusatzlinks. Array ersetzt vollständig, [] leert; keine öffentliche Höchstzahl oder automatisches Laden der Zielinhalte                | [{ label: 'Projektseite', href: 'https://example.com/project/' }]    |
| aiReadableContent.links[].label | string, Pflicht / keiner                                                 | Bedingt: nach trim nichtleer. Zeilenumbrüche werden Leerzeichen, Backslashes und Klammern escaped. Kein automatischer Zieltitel                             | 'Projektseite'                                                       |
| aiReadableContent.links[].href  | string, Pflicht / keiner                                                 | Bedingt: nichtleer, gegen Veröffentlichungswurzel aufgelöst; nur HTTP(S) ohne Benutzer/Passwort. Ungültig ist Fehler; Existenz und Erreichbarkeit ungeprüft | 'https://example.com/project/'                                       |

notes und links haben kein allgemeines Zeichenlimit-Feld. Typen müssen stimmen. Falsche Typen, leere Labels, fremde Protokolle und Zugangsdaten in URLs können den Build stoppen. Das Theme führt keine Ergänzungsbefehle aus und lässt keine Modelle diese Hinweise erzeugen.

### Markdown und relative Links

notes erhält Markdown-Text, Format und Codebeispiele. Erkannte Ziele in Links, Bildern und Referenzdefinitionen werden absolut und gleich auf HTTP(S) ohne Credentials geprüft. Links in Codeblöcken sind Beispiele und werden nicht als echte Ziele umgeschrieben. Kein vollständiger beliebiger HTML-Validator und kein Screenshot-Dienst.

Basis ist die **öffentliche Website-Wurzel einschließlich Astro base**, nicht Artikel-URL oder Sprachordner. Bei https://example.com/project/:

| href oder Markdown-Ziel         | Ergebnis                             |
| ------------------------------- | ------------------------------------ |
| zh/blog/                        | https://example.com/project/zh/blog/ |
| /zh/blog/                       | https://example.com/zh/blog/         |
| https://docs.example.com/guide/ | Externe URL unverändert              |

Ein einzelner Anfangs-/ löst vom Domain-Stamm auf und erhält /project/ nicht automatisch. Das unterscheidet sich von BASE_URL-Ergänzung bei Musik. Vermische die Regeln nicht. mailto:, tel:, file: und javascript: gelten hier nicht. Normale Kontaktlinks im Text haben eigene Exportregeln und erlauben nicht automatisch dieselben Protokolle im Supplement.

### Globales Beispiel

```ts
aiReadableContent: {
  notes: 'Dies sind persönliche Lernnotizen, die überarbeitet werden können. Siehe die [Artikelliste](de/blog/).',
  links: [
    { label: 'Projektseite', href: 'https://example.com/project/' },
  ],
},
```

<a id="locale-supplement"></a>

## aiReadableContent je Sprache überschreiben

Präfix `i18n.locales.<Sprachcode>.aiReadableContent`, ebenfalls optionales MachineReadableSupplement ohne Vorgabe. Gleiche Wirkung, bei fehlenden Feldern jedoch einzelne Vererbung globaler Werte:

| Relatives Feld | Typ / Standard                                                     | Wirkung und Grenzen                                                                                      | Beispiel             |
| -------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- | -------------------- |
| notes          | string, optional / globale notes geerbt                            | Bedingt: öffentliche Spracheergänzung; '' oder Leerraum leert ausdrücklich ohne fremdsprachigen Fallback | '中文内容持续更新。' |
| links          | { label: string; href: string }[], optional / globale links geerbt | Bedingt: ersetzt gesamtes Array, [] leert ausdrücklich, kein Anhängen an global                          | []                   |
| links[].label  | string, Pflicht / keiner                                           | Pflicht eigener Einträge, gleiche Validierungs-/Escape-Regeln wie global                                 | '中文文章'           |
| links[].href   | string, Pflicht / keiner                                           | Pflicht eigener Einträge, Basis bleibt Veröffentlichungswurzel, nicht Sprachordner                       | 'zh/blog/'           |

Nur chinesische Hinweise ändern und Zusatzlinks ausblenden:

```ts
i18n: {
  locales: {
    zh: {
      aiReadableContent: {
        notes: '中文内容持续更新。',
        links: [],
      },
    },
  },
},
```

Nur notes zu ändern erbt weiterhin links; {} erbt beides. undefined wird ignoriert, nicht als Leeren verstanden. Kein meta.fallback und kein Kopieren englischer oder anderer Ergänzungen, siehe [Sprachenverzeichnis](/de/blog/config-languages/#fallback).

Root-llms.txt nutzt immer globale Ergänzungen. Sprachwerte gelten für deren Index, Sammlung und Einzel-Markdown. Ein ungültiger globaler Wert lässt sich nicht durch Leeren aller Sprachwerte umgehen; der Rootindex verarbeitet ihn weiterhin.

<a id="outputs"></a>

## In welchen öffentlichen Ausgaben erscheinen Ergänzungen?

Pfade gelten ab Veröffentlichungswurzel, mit entsprechendem Unterpfad-Präfix. Nur Sprachen mit tatsächlichen Exportinhalten erhalten Index und Sammlung. Ergänzungen erzeugen keine Artikel.

| Ausgabe                           | Position und Inhalt                                                                                                                                 |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| llms.txt                          | Wurzeleinstieg: globale notes vor Sprachverzeichnis, links als Zusatzbereich. Auch ohne exportierbare Inhalte können globale Ergänzungen erscheinen |
| `<Sprachcode>/llms.txt`           | Spracheinstieg mit überschriebenen Hinweisen und Links, vorhandene Dokumente nach Articles/Fragments/About                                          |
| `<Sprachcode>/llms-full.txt`      | Öffentliche Volltextsammlung; Ergänzungen vor den Dokumenttexten                                                                                    |
| Artikel-Markdown wie index.md     | Nach Originaltext mit Trennlinie, Website-Ergänzungsmarker und gültigen Hinweisen; nicht als Autorentext vermischt                                  |
| `<Sprachcode>/about/index.md`     | Öffentliche Vorstellung, Kontakt und erreichbare statische KI-Panels. Gleiche Ergänzung am Ende, nicht gesamte Werkzeugkonfiguration                |
| `<Sprachcode>/fragments/index.md` | Vereinte paginierte Fragments mit stabilen IDs; Ergänzung am Ende, keine doppelte Volltextsammlung pro Seite                                        |

Der Einzelpfad folgt dem Build-HTML: index.html wird index.md. Eigene Astro-Ausgaben können abweichen. Erfinde oder überschreibe keine generierten Pfade. Exportseiten erhalten Entdeckungslinks zu Markdown und Sprachindex.

Der Exporter verarbeitet nur markierte, öffentlich indexierbare Artikel, About und Fragments mit gleichursprünglichem canonical. Startseite, Listen, Decoder-Formulare und Kommentar-iframes werden standardmäßig nicht als Artikel exportiert. Links, Code und Tabellen werden aus gebautem Inhalt konvertiert, nicht beliebige ungerenderte Konfigurationsdateien veröffentlicht. About-KI-Dialoge sind erreichbarer öffentlicher statischer Text und entsprechend zu behandeln.

search: false verlässt nur Pagefind, nicht diese Exporte. notes/links leeren schaltet Textausgabe nicht ab. Kein aiReadableContent.enabled, Einzelausschluss, KI-Dienst, Modellparameter oder API key. Diese Dateien liefern lesbares öffentliches Material, garantieren aber kein Crawling, Zitieren oder Ranking.

Der Generator schützt gleichnamige Dateien außerhalb seines historischen Manifests und meldet Konflikte. Lege keine konkurrierenden llms.txt-/Markdown-Dateien in public oder Build-Verzeichnis. Korrigiere die Quelle, baue neu und veröffentliche alles. Ein erfolgreicher Build beweist keine Online-Aktualisierung oder Modelllektüre.

<a id="boundaries"></a>

## Verwandte Einstellungen und Grenzen

- Öffentliche Adressen hängen von site.url, Umgebung und Astro base ab. Root-Titel und -Beschreibung verwenden den Website-Kontext. Angaben und Deployment im [Veröffentlichungstutorial](/de/blog/starter-guide-deployment/). Eine URL im Ergänzungstext ändert canonical nicht.
- Sprachen beeinflussen Standardseiten; Deaktivierung entfernt keine alten Hosting-Dateien. Ergänzungen erzeugen keine Übersetzung, siehe [Sprachenverzeichnis](/de/blog/config-languages/#ai-context).
- GA4 steuert Statistikladen, nicht Suche, RSS oder Maschinenexport. Statische Ergänzungen haben keine eigenen Knöpfe, UI-Texte oder Statistikschalter.
- GA4-ID und alle Ergänzungsfelder werden verwendet. Keine zusätzlichen veralteten Felder nötig. Fehlender Statistikzweig alter Adapter gilt lediglich kompatibel als deaktiviert.

Nach Änderungen neu bauen und veröffentlichen. Browserblocker, Netzwerk und Dienstkonfiguration können Statistik beeinflussen. Lokale Textgenerierung ersetzt keine Online-Statistikabnahme. Weitere Module im [Gesamtverzeichnis](/de/blog/config-reference/).
