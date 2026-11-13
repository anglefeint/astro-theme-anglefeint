---
tags: ['anglefeint', 'starter']
title: 'Anleitung 7: Den Blog für weitere Sprachen öffnen'
subtitle: 'Sprachen wählen, Startseitenadressen und Oberflächentexte anpassen und Übersetzungen ergänzen.'
description: 'Sprachaktivierung, Routing, Texte, Fallbacks sowie Artikel- und Fragment-Übersetzungen im tatsächlichen Standardablauf.'
pubDate: '2026-11-13'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/hacker-01.webp'
---

Dies ist Teil 7 von 8 der Einführung. [Reihenfolge aller Tutorials](/de/blog/starter-guide-1-configure-your-site/#tutorial-order) · [Konfiguration nach Feldern](/de/blog/config-reference/).

Du kannst zunächst nur in einer Sprache schreiben und später Übersetzungen hinzufügen. Das Theme bietet mehrsprachige Oberfläche und Routen, übersetzt aber keine Artikel. Sprache aktivieren, Oberflächentext ändern und eine Übersetzung veröffentlichen sind drei unterschiedliche Schritte.

Vereinige sämtliche folgenden Einstellungen mit dem vorhandenen `defineThemeConfig({...})` in `src/site.config.ts`. Erhalte `i18n` und persönliche Einstellungen, ohne gleichnamige Objekte doppelt hinzuzufügen.

## 1. Benötigte Sprachen auswählen

Standardmäßig sind neun Sprachen aktiv, Standardsprache ist `en`:

| Code      | Sprache            |
| --------- | ------------------ |
| `en`      | English            |
| `zh`      | 简体中文           |
| `zh-hant` | 繁體中文           |
| `ja`      | 日本語             |
| `ko`      | 한국어             |
| `es`      | Español            |
| `pt-br`   | Português (Brasil) |
| `de`      | Deutsch            |
| `ru`      | Русский            |

Für nur Chinesisch und Englisch mit Chinesisch als Standardsprache kannst du diese Konfiguration wählen. Ohne diesen Wunsch behalte die Vorgaben:

```ts
i18n: {
  defaultLocale: 'zh',
  locales: {
    zh: { meta: { enabled: true } },
    en: { meta: { enabled: true } },
    ja: { meta: { enabled: false } },
    ko: { meta: { enabled: false } },
    es: { meta: { enabled: false } },
    'pt-br': { meta: { enabled: false } },
    de: { meta: { enabled: false } },
    ru: { meta: { enabled: false } },
    'zh-hant': { meta: { enabled: false } },
  },
},
```

Weglassen deaktiviert eine Sprache nicht, da Vorgaben vereinigt werden. Setze ausdrücklich `meta.enabled: false`. Die Standardsprache bleibt immer aktiv; mit `defaultLocale: 'zh'` kannst du zh nicht zugleich verbergen.

Deaktivieren entfernt Theme-Einstiege und Standardseiten, löscht aber keine Dateien des Sprachordners. Nach erneutem Aktivieren können erhaltene Inhalte wieder gebaut werden. Ein geänderter Sprachcode ändert Ordner und URLs, nicht nur den Anzeigenamen. Bestehende Websites müssen alte Links selbst behandeln.

## 2. Adresse der Standardstartseite wählen

Ergänze oder ändere `routing` im vorhandenen `i18n`:

```ts
i18n: {
  defaultLocale: 'zh',
  routing: { defaultLocalePrefix: 'never' },
},
```

Bei Standardsprache zh:

| Einstellung                | `/`                                 | `/zh/`                           | `/en/`                            |
| -------------------------- | ----------------------------------- | -------------------------------- | --------------------------------- |
| `'always'`, Theme-Standard | Statische Weiterleitung nach `/zh/` | Chinesische Startseite           | Englische Startseite, falls aktiv |
| `'never'`                  | Direkt chinesische Startseite       | Statische Weiterleitung nach `/` | Englische Startseite, falls aktiv |

Die Konfiguration legt die Standardsprache fest; die Browsersprache des Besuchers ändert sie nicht automatisch. Weiterleitungen sind gebaute HTML-Seiten und brauchen keinen App-Server. Dabei kann kurz ein Weiterleitungshinweis erscheinen.

**Diese Einstellung betrifft nur die Startseite der Standardsprache.** Chinesischer Blog, Artikel, About, Decoder und Fragments behalten `/zh/`, etwa `/zh/blog/my-first-post/`, statt automatisch `/blog/my-first-post/` zu werden. Ein Wechsel der Standardsprache verschiebt und übersetzt keine vorhandenen Dateien.

## 3. Startseite und Oberfläche je Sprache ausfüllen

Setze Texte in der jeweiligen Sprache, etwa:

```ts
i18n: {
  locales: {
    zh: {
      meta: { label: '简体中文' },
      site: {
        homeTitle: '小林的数字花园',
        hero: '记录开发、阅读和生活。',
      },
      messages: {
        siteDescription: '小林的个人博客，分享项目和学习笔记。',
        nav: { home: '首页', blog: '文章', about: '关于我' },
      },
    },
    en: {
      site: {
        homeTitle: "Lin's Digital Garden",
        hero: 'Notes on code, books and everyday life.',
      },
      messages: { siteDescription: 'Projects and learning notes by Lin.' },
    },
  },
},
```

- `meta.label` ist der Sprachmenüname. „简体中文“ in „中文“ umzubenennen ändert weder Code zh noch URL.
- `site.homeTitle` ändert nur die sichtbare große Überschrift dieser Startseite. Der globale Name bleibt oberstes `site.title` oder dessen Umgebungsüberschreibung.
- `site.hero` ist die sichtbare Einführung unter dem Titel.
- `messages.siteDescription` ist die Metabeschreibung, nicht die sichtbare Einführung. Nur oberstes `site.description` zu ändern ersetzt nicht zwingend die integrierte Startseitenbeschreibung.
- `messages.nav` ändert Beschriftungen, keine Routen oder Artikel.

Ebenso ändert `i18n.locales.<Sprachcode>.about` die About-Inhalte, und Module unter `messages` ändern ihre Oberflächentexte. Globale Funktionsschalter gelten weiterhin für About, Decoder und andere Seiten. Übersetzungen aktivieren sie nicht automatisch. Beispiele zeigt [Seiten und Funktionen anpassen](/de/blog/starter-guide-3-comments-about-and-theme-toggles/).

Sprachmetadaten und Startseitenadressen stehen im [Sprachenverzeichnis](/de/blog/config-languages/#registry); die drei Startseitentexte im [Startseitenverzeichnis](/de/blog/config-home/#home-title).

## 4. Woher fehlende Felder stammen

`meta.fallback` wählt Konfigurations-Fallback-Sprachen. Für Englisch als Ergänzung fehlender chinesischer Werte vereinige:

```ts
i18n: {
  locales: {
    zh: { meta: { fallback: ['en'] } },
  },
},
```

Hier muss en in der Projektkonfiguration existieren. Die Standardsprache wird bei anderen Sprachen in die nötige Kette eingefügt. Selbstreferenzen, Duplikate und unbekannte Sprachen werden entfernt. Arrays ersetzen vollständig; gib mehrere Fallbacks gemeinsam in der gewünschten Reihenfolge an.

Nicht alle Felder folgen derselben Regel:

| Inhalt                       | Aktuelles Verhalten                                                                                                                                               |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Normale `messages`           | Beginnen mit integriertem Englisch und vereinigen Sprachpakete und eigene Werte entlang der Kette, aktuelle Sprache zuletzt; integrierte Übersetzungen wirken mit |
| Startseiten-`homeTitle`      | Erster nichtleerer, getrimmter Titel der aktuellen Sprache und Fallbacks, zuletzt globaler Website-Name                                                           |
| Startseiten-`hero`           | Erster definierter Wert; `''` leert ausdrücklich und sucht nicht weiter                                                                                           |
| About                        | Beginnt mit Standard-About und vereinigt persönliche Sprachwerte entlang der Kette                                                                                |
| `messages.home.transmission` | Eigene aktuelle Sprachkonfiguration → eigene englische Konfiguration → `Knock, knock.`, ohne normale vollständige Text-Fallback-Kette                             |

Geänderte englische Navigation überschreibt daher nicht zwingend vorhandene integrierte chinesische Navigation. Überschreibe für gezielte Änderungen die jeweilige Sprache. Deaktivierte Seiten löschen keine Konfiguration; Werte einer weiterhin referenzierten Sprache können Fallbacks ergänzen.

Fallback ergänzt nur Konfiguration und Oberfläche. Er kopiert keine englischen Artikel in chinesische Listen und erzeugt keine fremdsprachigen Dateien. Es ist kein Übersetzungsdienst.

## 5. Eine neue Sprache hinzufügen

Für Französisch ergänze fr in locales und erhalte zuvor aktivierte und deaktivierte Sprachen:

```ts
i18n: {
  locales: {
    fr: {
      meta: {
        label: 'Français',
        hreflang: 'fr',
        ogLocale: 'fr_FR',
        enabled: true,
        fallback: ['en'],
      },
      site: {
        homeTitle: 'Le jardin de Lin',
        hero: 'Notes de lecture et projets.',
      },
      messages: {
        siteDescription: 'Le blog personnel de Lin.',
        nav: { home: 'Accueil', blog: 'Articles', about: 'À propos' },
      },
    },
  },
},
```

fr ist der Ordner- und Routencode. Verwende übliche Kleinbuchstaben-Codes. Der Erstellungsbefehl akzeptiert zwei bis drei Buchstaben mit optional einem Bindestrich-Suffix wie `fr`, `pt-br` oder `zh-hant`, keine Pfade oder Leerzeichen. Das Beispiel behält die Standardsprache und macht Französisch nicht automatisch zum Standard.

`hreflang` kennzeichnet alternative Sprachlinks und verwendet ohne Angabe den Sprachcode. `ogLocale` ist die Open-Graph-Sprach-/Regionskennung mit anderer Schreibweise als Pfade, etwa fr_FR. Diese Metadaten übersetzen nichts und garantieren keine Suchmaschinenaufnahme.

Neue Sprachen haben kein vollständiges integriertes Sprachpaket. Das Beispiel übersetzt nur einige Einstiege; übrige Texte fallen zurück. Für eine vollständige französische Oberfläche ergänze verwendete Such-, Seiten-, Kommentar-, Werkzeug- und About-Texte. Beginne mit tatsächlich sichtbaren Bereichen. Du musst nicht zuerst die Theme-Implementierung ändern, um einen Artikel zu zeigen.

## 6. Eine Artikelübersetzung hinzufügen

Erstelle gleichzeitig chinesische und englische Gerüste:

```bash
npm run new-post -- my-first-post --locales zh,en
```

Schreibe Chinesisch in `src/content/blog/zh/my-first-post.md` und Englisch in `src/content/blog/en/my-first-post.md`. Für Französisch kannst du `npm run new-post -- french-note --locales fr` nutzen und anschließend selbst Inhalte ausfüllen.

Für einen vorhandenen chinesischen Beitrag kannst du die Datei in den Zielsprachordner kopieren, den Dateistamm erhalten und Titel, Beschreibung und Text übersetzen. Relative Bildpfade gelten ab der neuen Position; prüfe sie bei anderer Ordnertiefe. Vorhandene gleichnamige Dateien überspringt der Befehl ohne Überschreiben.

Übersetzungen werden über den vollständigen Slug außerhalb des Sprachordners zugeordnet. zh/my-first-post und en/my-first-post sind Übersetzungen. Heißt die englische Datei my-story, ist sie ein anderer Beitrag, auch bei gleichem Titel. Verschachtelte Ordner müssen ebenfalls übereinstimmen.

Das Artikelsprachemenü öffnet die Übersetzung mit gleichem Slug, andernfalls die Blogliste der Zielsprache. Sprachalternativen für Suchmaschinen deklarieren nur tatsächlich vorhandene aktive Übersetzungen und bezeichnen keine Liste fälschlich als fremdsprachigen Artikel.

`--locales` erstellt nur gewählte Dateien und aktiviert keine Sprache. Ohne Parameter gilt zuerst `ANGLEFEINT_LOCALES`, sonst die aktiven Projektsprachen. Explizite Parameter schlagen die Umgebung. Gerüst und Übersetzung sind getrennte Schritte.

## 7. Sprachwechsel bei Fragments und anderen Seiten

Fragment-Übersetzungen teilen die frontmatter-`id`, nicht zwingend den Dateinamen. Kopiere für spätere Übersetzungen die Originaldatei in den Zielordner, erhalte id und pubDate und übersetze Titel und Text. Ein neuer new-fragment-Aufruf erzeugt eine neue Identität und ergänzt nicht dieselbe Übersetzung.

Ein Aufruf von `npm run new-fragment -- --locales zh,en` erzeugt beide Sprachgerüste mit gemeinsamer ID und Zeit. Der Listen-Sprachwechsel führt stets zur ersten Zielseite und positioniert nicht zwingend dieselbe Übersetzung. Details erklärt [Ein Fragment veröffentlichen](/de/blog/starter-guide-5-fragments/).

Artikel teilen Kommentare nur mit gesondertem `theme.comments.shareAcrossLocales`, standardmäßig aus. Fragment-Kommentare teilen sich nach ID. Oberflächensprache und Diskussionszuordnung sind unabhängig; Kommentartexte werden nicht übersetzt. Siehe [Leserkommentare](/de/blog/starter-guide-4-giscus-comments/).

Eigene Astro-Seiten aus `new-page` erzeugen Routen für aktive Sprachen, haben aber nur eine Quelldatei. Liefere sprachabhängige Inhalte selbst; weder Kopien noch Übersetzungen pro Sprache entstehen automatisch.

## 8. Ergebnisse nach Änderungen prüfen

Öffne zunächst die Startseiten deiner aktiven Sprachen in dev und prüfe Menünamen, Titel, Einführung und About. Prüfe danach einen Artikel mit und einen ohne Übersetzung. Der Sprachwechsel muss erwartungsgemäß funktionieren. Codes der Sprachliste und Ordner müssen exakt übereinstimmen.

Stoppe vor Veröffentlichung dev und führe aus:

```bash
npm run doctor
npm run preview
```

doctor enthält Prüfungen und Build. Danach brauchst du nicht direkt check oder build. Prüfe in preview die Suche jeder Sprache; der Index mischt nicht alle Sprachen. RSS liegt für jede aktive Sprache unter `/<Sprachcode>/rss.xml` und enthält nur deren Artikel.

Prüfe die Domain und veröffentliche das vollständige `dist/` erneut. Aktivierung, Standardadresse und Inhalte erfordern einen neuen Build. Lokale Konfigurationsänderungen ändern keine Online-Seite. Bereinige alte Deployment-Dateien; Deaktivierung erzeugt keine automatischen Weiterleitungen alter URLs.

| Symptom                                       | Zuerst prüfen                                                                                  |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Unerwünschte Sprache bleibt im Menü           | Nur Überschreibung entfernt statt enabled: false gesetzt?                                      |
| Standardsprache lässt sich nicht deaktivieren | Noch als defaultLocale gewählt? Zuerst neuen Standard setzen                                   |
| Datei erstellt, Seite fehlt                   | Sprache aktiv, gleicher Ordnercode, neu gebaut?                                                |
| Englische Texte bleiben                       | Nur teilweise Übersetzung oder fehlende About-Inhalte?                                         |
| Titel unverändert                             | Globales site.title, Startseiten-homeTitle, hero oder messages geändert? Umgebungswerte prüfen |
| Sprachwechsel führt zur Liste                 | Übersetzung mit gleichem Slug fehlt; das ist der aktuelle Fallback                             |
| never entfernt Artikelpräfix nicht            | Der Schalter betrifft nur die Standardstartseite; erwartetes Verhalten                         |

Website-Angaben und Upgrades erklärt das [Installationstutorial](/de/blog/starter-guide-1-configure-your-site/), tägliches Schreiben [Teil 2](/de/blog/starter-guide-2-languages-and-routing/).

## Tutorial-Navigation und Konfiguration

[Zurück: Leserkommentare](/de/blog/starter-guide-4-giscus-comments/) · [Weiter: Auf eigener Domain veröffentlichen](/de/blog/starter-guide-deployment/) · [Alle acht Tutorials](/de/blog/starter-guide-1-configure-your-site/#tutorial-order).

Passende Felder: [Sprachen, Adressen und Fallback](/de/blog/config-languages/), [Gemeinsame Diskussionen](/de/blog/config-comments/). Vollständige Pfade, Vorgaben und Grenzen stehen im [Konfigurationsverzeichnis](/de/blog/config-reference/).
