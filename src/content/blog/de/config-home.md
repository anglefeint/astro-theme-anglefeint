---
tags: ['anglefeint', 'config']
title: 'Konfigurationsverzeichnis: Startseite'
subtitle: 'Titel, Einführung, neueste Artikel, Starthinweise und Matrix-Interaktionen.'
description: 'Typen, Vorgaben, Fallbacks, Einschränkungen und Beispiele der tatsächlich verwendeten Startseitenfelder.'
pubDate: '2026-11-13'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

[Zurück zum Konfigurationsverzeichnis](/de/blog/config-reference/). Dieser Artikel beschreibt tatsächlich verwendete Startseitenfelder. Er ändert keinen Theme-Code und behandelt persönliche Demo-Werte nicht als Vorgaben.

Ersetze `<Sprachcode>` durch einen aktiven Projektcode. Die Beispiele verwenden de und ändern nur Deutsch, nicht die anderen Sprachen oder deren Aktivierung. Vereinige alle Ausschnitte mit dem bestehenden defineThemeConfig in `src/site.config.ts` und erhalte weitere Felder in theme, i18n und site.

## 1. Großer Titel, Einführung und Metabeschreibung

<a id="home-title"></a>

### `i18n.locales.<Sprachcode>.site.homeTitle`

- **Typ:** optionaler `string`.
- **Theme-Standard:** nicht gesetzt. Integrierte Sprachen haben keinen eigenen homeTitle und verwenden zuletzt den globalen Namen, standardmäßig My Blog.
- **Wirkung:** sichtbarer großer Startseitentitel.
- **Status und Grenzen:** bedingt wirksam. Sucht nichtleere getrimmte Titel der aktuellen Sprache und ihrer Fallbacks, zuletzt den globalen Namen. `''` oder Leerraum verbirgt ihn nicht. Browser-Titel, Navigation, Fußzeile, RSS und globaler SEO-Name bleiben unverändert.

<a id="home-hero"></a>

### `i18n.locales.<Sprachcode>.site.hero`

- **Typ:** optionaler `string`.
- **Theme-Standard:** integrierte Einführung pro Sprache; vereinfachtes Chinesisch „在这里写一段站点简介，并告诉读者你将发布什么类型的内容。“, Englisch „Write a short introduction for your site and what readers can expect from your posts.“. Andere Sprachen haben eigene Vorgaben.
- **Wirkung:** sichtbare Einführung unter dem großen Titel.
- **Status und Grenzen:** bedingt wirksam. Sucht definierte Werte entlang aktueller Sprache und Fallbacks. `''` leert ausdrücklich und beendet die Suche. Klartext ohne Markdown/HTML, unabhängig von der Metabeschreibung.

<a id="home-description"></a>

### `i18n.locales.<Sprachcode>.messages.siteDescription`

- **Typ:** optionale `string`-Überschreibung.
- **Theme-Standard:** integrierter Sprachtext; vereinfachtes Chinesisch „电影感网页界面与 AI 时代工程实践文章。“, Englisch „Cinematic web interfaces and AI-era engineering essays.“.
- **Wirkung:** Beschreibung für den Seitenkopf, nicht sichtbare Einführung.
- **Status und Grenzen:** bedingt wirksam. Zuerst werden Oberfläche und Fallback aufgelöst, dann dieser Wert verwendet. Nur ein leeres Ergebnis fällt auf die globale description zurück. Leer ist kein Schalter für sämtliche Seitenbeschreibungen; reiner Leerraum wird nicht automatisch getrimmt.

Die drei Felder sind unabhängig gemeinsam konfigurierbar:

```ts
i18n: {
  locales: {
    de: {
      site: {
        homeTitle: 'Mein digitaler Garten',
        hero: 'Entwicklung, Lektüre und Alltag.',
      },
      messages: { siteDescription: 'Persönliche Projekte und Lernnotizen.' },
    },
  },
},
```

<a id="site-fallbacks"></a>

### Gemeinsame Felder: `site.title` und `site.description`

Hier nur der Startseitenbezug: site.title ist der letzte Titel-Fallback ohne gültigen homeTitle, site.description die Reserve bei leerer Sprachmetabeschreibung. Beide sind nicht startseitenexklusiv. Typen, Vorgaben, Umgebung und Beispiele stehen im [Website-Verzeichnis](/de/blog/config-site-chrome/#identity).

## 2. Anzahl neuester Artikel

<a id="latest-count"></a>

### `theme.homeLatestCount`

- **Typ:** `number`.
- **Theme-Standard:** `3`.
- **Wirkung:** Zeigt die ersten N Artikel der aktuellen Sprache nach absteigendem pubDate. Bei weniger Inhalten nur vorhandene; die Zählung nennt tatsächliche Anzahl/Gesamtanzahl der Sprache.
- **Status und Grenzen:** wirksam; derzeit direktes Array-slice ohne besondere positive-Ganzzahl-Prüfung. Verwende sinnvolle positive Ganzzahlen, keine negativen Werte, Brüche, NaN oder Infinity. `0` ergibt eine leere Liste mit „keine Artikel“, auch bei vorhandenen Artikeln. Es verbirgt nicht den ganzen Bereich.
- **Unabhängiger Umfang:** Ändert weder Blog-Listenseitengröße noch die höchstens drei Fragment-Vorschauen.

```ts
theme: { homeLatestCount: 5 },
```

Titel, Daten und Zusammenfassungen kommen aus Artikeln und sind keine Unterfelder hiervon. Die Startseite ergänzt fehlende Inhalte nicht automatisch aus anderen Sprachen.

## 3. Starthinweise und unterer Status

<a id="startup-switches"></a>

Alle drei Felder sind `boolean`, standardmäßig `true` und wirksam. false verbirgt nur den jeweiligen Teil, Weglassen erhält Vorgaben.

| Vollständiger Pfad          | Wirkung                           | Grenzen                                                                                                 |
| --------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `theme.home.showInitialize` | Initialize/done-Starttext         | Steuert nur diesen Abschnitt, nicht Haupttext oder Hintergrundladen                                     |
| `theme.home.showFollow`     | Wake Up/Follow The White Rabbit   | Unabhängig vom vorherigen Abschnitt, keine Bedingung für Navigation                                     |
| `theme.home.showTrace`      | PIRATE SIGNAL/TRACE PROGRAM unten | Steuert nicht das Breitbild-Terminal; atmosphärischer Text statt echter Verfolgungs- oder Netzwerkdaten |

```ts
theme: {
  home: {
    showInitialize: false,
    showFollow: true,
    showTrace: false,
  },
},
```

Sind beide ersten Werte aus, entfällt die zugehörige Starttextkomponente. site.config bietet keine Felder für feste Startsätze, untere Statustexte oder Zeitparameter. Erfinde keine startupText- oder traceText-Felder.

## 4. Texte der Startseitenoberfläche

<a id="home-messages"></a>

Alle liegen unter `i18n.locales.<Sprachcode>.messages.home` und sind optionale `string`-Überschreibungen. Normale Felder folgen der Oberflächen-Fallback-Regel. Hier stehen integrierte Vorgaben für vereinfachtes Chinesisch und Englisch; andere integrierte Sprachen haben eigene.

| Letztes Pfadsegment | Standard vereinfachtes Chinesisch / Englisch                    | Wirkung und Grenzen                                                                                                  |
| ------------------- | --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `latest`            | 最新 / Latest                                                   | Überschrift der neuesten Artikel, keine Änderung von Reihenfolge oder Anzahl                                         |
| `viewAll`           | 全部 / All                                                      | Artikelarchiv-Linktext und zugängliche Beschreibung des Fragment-Archivlinks, kein anderes Ziel                      |
| `noPosts`           | 该语言暂时没有文章。 / No posts available in this language yet. | Hinweis bei leerem latestPosts, kein Entwurfs- oder Veröffentlichungsschalter                                        |
| `openDoor`          | 开门 / Open door                                                | Zugänglicher Name und Vorschaulabel des Schlüssellochknopfs, normalerweise keine dauerhaft sichtbare Textüberschrift |

Die Felder wirken nur, wenn der Bereich vorhanden ist. Ein leerer String leert Text, entfernt aber keinen Container und deaktiviert keine Funktion. Er kann sinnvolle Knopfnamen entfernen. Verwende zum Verbergen die Funktionsschalter.

```ts
i18n: {
  locales: {
    de: {
      messages: {
        home: {
          latest: 'Neueste Beiträge',
          viewAll: 'Alle Artikel',
          noPosts: 'Hier gibt es noch keine Artikel.',
          openDoor: 'Korridorvorschau öffnen',
        },
      },
    },
  },
},
```

<a id="home-transmission"></a>

### `i18n.locales.<Sprachcode>.messages.home.transmission`

- **Typ:** optionale `string`-Überschreibung.
- **Theme-Standard:** `'Knock, knock.'`, ohne eigene Werte auch für Chinesisch.
- **Wirkung:** auswählbarer, scrollbarer Text im Breitbild-Terminal.
- **Status und Grenzen:** bedingt wirksam ab 1440px Viewport. Feste Reihenfolge aktuelle persönliche Sprachkonfiguration → persönliche englische Konfiguration → Standardsatz. Keine vollständige normale Text-Fallback-Kette. `''` leert nur Text, verbirgt weder Terminal noch Korridor.

Für gemeinsamen Text aller Sprachen ohne eigene Überschreibung:

```ts
i18n: {
  locales: {
    de: { messages: { home: { transmission: 'Hinterlasse hier einen kleinen Hinweis.' } } },
  },
},
```

Die gleiche Stelle unter zh überschreibt nur Chinesisch. Textänderungen messen kein echtes Netzsignal und ändern nicht das Korridoröffnen über das Schlüsselloch.

<a id="message-hero"></a>

### `i18n.locales.<Sprachcode>.messages.home.hero`

- **Typ:** optionale `string`-Überschreibung.
- **Theme-Standard:** integrierte Spracheinführung, für Chinesisch und Englisch dieselben Sätze wie site.hero oben.
- **Wirkung:** Reserveeinführung nur, wenn getSiteHero keinen definierten Wert aus aktueller Sprache und Fallbacks findet.
- **Status und Grenzen:** bedingt wirksam, nicht veraltet. Alle integrierten Sprachen haben bereits site.hero, daher zeigt eine alleinige Änderung normalerweise nichts. Auch site.hero `''` aktiviert es nicht. Ändere gewöhnlich direkt site.hero.

```ts
i18n: {
  locales: {
    de: { messages: { home: { hero: 'Einleitung, die nur ohne verfügbares site.hero verwendet wird.' } } },
  },
},
```

Das Beispiel zeigt Pfad und Typ, umgeht aber nicht site.hero mit höherer Priorität. Lösche keine Vorgaben und ändere keine Abhängigkeiten für die Einführung.

## 5. Matrix-Passage beim Artikel-Klick

<a id="home-passage"></a>

### `theme.effects.enableHomePassage`

- **Typ:** `boolean`.
- **Theme-Standard:** `false`.
- **Wirkung:** Normale Klicks auf aktuelle Artikeltitel und markierte Blog-Navigation spielen vor Navigation eine Matrix-Passage. Der reguläre Ablauf dauert etwa acht Sekunden und besitzt Abschluss-/Fehler-Fallbacks zur Navigation.
- **Status und Grenzen:** bedingt, benötigt JavaScript. Reduzierte Bewegung, Modifikatortasten, andere Maustasten, Downloads, externe Links und neue Fenster behalten natives Verhalten. Verzögert nicht den Haupttext und steuert weder About Oracle noch Breitbild-Vorschau.

```ts
theme: { effects: { enableHomePassage: true } },
```

Deaktiviert navigieren Links direkt. Der Schalter bietet keine Dauer-, Farb- oder Zielkonfiguration. Ergänze keine unveröffentlichten Felder wie homePassageDuration.

## 6. Gemeinsame Einstellungen auf der Startseite

<a id="shared-settings"></a>

Dies sind keine exklusiven Startseitenfunktionen. Hier steht nur ihr Bezug, vollständige Definitionen im Hauptverzeichnis.

| Vollständiger Pfad                                   | Startseitenbezug                                                                                        | Hauptbeschreibung                                                 |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `theme.fragments.enabled`                            | Avatar bei Fragment-Inhalten der aktuellen Sprache und vollständige Liste; Vorschau fest höchstens drei | [Fragments](/de/blog/config-fragments/#enabled)                   |
| `i18n.locales.<Sprachcode>.messages.blog.allPosts`   | Artikelzählung und zugänglicher Archivname                                                              | [Gemeinsame Listentexte](/de/blog/config-blog-list/#tag-messages) |
| `i18n.locales.<Sprachcode>.messages.fragments.title` | Zugänglicher Avatarname, keine Überschrift daneben                                                      | [Fragment-Texte](/de/blog/config-fragments/#fragment-messages)    |
| `i18n.locales.<Sprachcode>.messages.fragments.close` | Zugänglicher Name des Vorschau-Schließknopfs, keine Symboländerung                                      | [Fragment-Texte](/de/blog/config-fragments/#fragment-messages)    |

Fehlt nach Aktivierung der Avatar, prüfe Inhalte der aktuellen Sprache. Kopiere keine IDs nur für die Anzeige. Bilder, Code und Höhenbegrenzung erklärt das [Fragment-Verzeichnis](/de/blog/config-fragments/#preview-and-links), Veröffentlichung [Teil 4](/de/blog/starter-guide-5-fragments/).

## 7. Derzeit nicht verfügbare Startseiteneinstellungen

<a id="unsupported-settings"></a>

`messages.siteTitle` ändert derzeit weder Standardstartseite noch öffentlichen Website-Namen. Verwende es nicht statt homeTitle oder oberstem site.title. Typ, Standard und Beispiel stehen unter [ungenutztes Website-Titelfeld](/de/blog/config-site-chrome/#legacy-site-title).

Dichte und Farbe des Coderegens, Spiegelknopf, Avatarmaterial, Fragment-Vorschauanzahl, feste Startsätze und Passagedauer haben keine site.config-Felder. Sie gehören zu Layout, Stilen oder Skripten. Ein erfundener TypeScript-Name aktiviert nichts. Reduced Motion beeinflusst Effekte, ist aber kein hier neu eingeführter Konfigurationsschalter.

`/` und Sprachstartseiten hängen von i18n.defaultLocale und i18n.routing.defaultLocalePrefix ab, siehe [Sprachen und Adressen](/de/blog/config-languages/#routing). Navigation, Fußzeile, Musik und Statistik sind ebenfalls keine separaten Startseiteneinstellungen.

## Wie Änderungen prüfen?

Öffne die Zielstartseite in dev und unterscheide Titel, Einführung, Metabeschreibung und zugängliche Namen. Das Terminal braucht mindestens 1440px. Metabeschreibungen stehen im head, Knopfnamen im zugänglichen Namen oder title; sichtbare große Buchstaben allein reichen nicht.

Starte dev nach geänderten Umgebungsüberschreibungen neu. Online ist ein neuer Build mit Deployment nötig. Stoppe dev, starte npm run doctor und danach npm run preview. doctor enthält den Build; check und build müssen nicht sofort wiederholt werden. Schritte erklären [Installation](/de/blog/starter-guide-1-configure-your-site/) und [Deployment](/de/blog/starter-guide-deployment/).
