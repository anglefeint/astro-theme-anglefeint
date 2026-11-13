---
tags: ['anglefeint', 'config']
title: 'Konfigurationsverzeichnis: Sprachen, Adressen und Fallback'
subtitle: 'Sprachregister, Metadaten, Startseitenrouting und Textauflösung.'
description: 'Alle i18n-Felder mit effektiven Vorgaben, direkter Fallback-Kette, Überschreibungsregeln und SEO-Grenzen.'
pubDate: '2026-11-13'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/hacker-01.webp'
---

Für Sprachaktivierung und Übersetzungen folge dem [Sprachentutorial](/de/blog/starter-guide-languages/). Den Konfigurationsort erklärt [Installation](/de/blog/starter-guide-1-configure-your-site/), andere Module das [Gesamtverzeichnis](/de/blog/config-reference/).

Hier stehen i18n-Registrierung, Adressen und Auflösungsregeln, nicht sämtliche Modultexte. Deren einzelne Vorgaben und Beispiele findest du bei Startseite, Artikel, Fragments, About, Decoder, Musik und Kommentaren. Vorgaben hier stammen aus dem Paket, nicht persönlichen Demo-Überschreibungen.

<a id="registry"></a>

## i18n.defaultLocale und i18n.locales

| Vollständiger Pfad    | Typ / Theme-Standard                                                                     | Status, Wirkung und Grenzen                                                                                                                                                           | Beispiel                                                   |
| --------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| i18n.defaultLocale    | string / 'en'                                                                            | Wirksam: Sprache der Root-Startseite/Weiterleitung, notwendige Fallbacks und Standardlinks. Leer normalisiert zu en. Keine Browsererkennung. Standard stets aktiv trotz enabled false | i18n: { defaultLocale: 'zh' }                              |
| i18n.locales          | Record<string, LocaleConfig> / neun Sprachen unten                                       | Wirksam: Schlüssel bestimmen Ordner und URLs. Rekursives Mischen; Weglassen löscht keine integrierte Sprache. Neue Sprache braucht eigene Texte und Inhalte                           | i18n: { locales: { fr: { meta: { label: 'Français' } } } } |
| `i18n.locales.<语言>` | LocaleConfig, teilweise überschreibbar / integrierte Konfiguration, bei neuem Code keine | Wirksam: meta, site, messages, about, aiReadableContent. Fehlende Felder folgen Merge/Fallback; {} löscht keine Sprache                                                               | locales: { zh: { meta: { enabled: false } } }              |

Schlüssel sind weder Anzeigename noch hreflang. EN wird nicht automatisch en, zh-CN-Ordner nicht zh. Halte Ordner, Konfiguration und CLI mit Kleinbuchstaben wie zh/en/pt-br/zh-hant konsistent. Die Inhalts-CLI akzeptiert zwei bis drei Buchstaben mit optional einem Bindestrichsegment. Die Laufzeitnormalisierung ist keine vollständige Sprachcode-/Pfadprüfung; keine Pfade oder beliebige Satzzeichen verwenden.

Eine unregistrierte Standardsprache wird mit Code als label ergänzt. Das ersetzt weder Inhalte noch Übersetzungen. defaultLocale verschiebt keine Dateien.

### Tatsächliche integrierte Vorgaben

Ohne Überschreibung sind alle neun aktiv. Standard en hat keinen Fallback, andere en. Die Reihenfolge entspricht der Registrierung, nicht meta.label-Sortierung. Kein eigener Menüreihenfolgeschalter.

| Code      | meta.label         | meta.hreflang | meta.ogLocale | Effektives enabled | Effektiver fallback |
| --------- | ------------------ | ------------- | ------------- | ------------------ | ------------------- |
| `en`      | English            | `en`          | `en_US`       | true               | `[]`                |
| `ja`      | 日本語             | `ja`          | `ja_JP`       | true               | `["en"]`            |
| `ko`      | 한국어             | `ko`          | `ko_KR`       | true               | `["en"]`            |
| `es`      | Español            | `es`          | `es_ES`       | true               | `["en"]`            |
| `zh`      | 简体中文           | `zh-CN`       | `zh_CN`       | true               | `["en"]`            |
| `pt-br`   | Português (Brasil) | `pt-BR`       | `pt_BR`       | true               | `["en"]`            |
| `de`      | Deutsch            | `de`          | `de_DE`       | true               | `["en"]`            |
| `ru`      | Русский            | `ru`          | `ru_RU`       | true               | `["en"]`            |
| `zh-hant` | 繁體中文           | `zh-Hant`     | `zh_TW`       | true               | `["en"]`            |

<a id="meta"></a>

## `i18n.locales.<语言>.meta`: fünf Metadatenfelder

Relative Felder in meta. Integrierte Vorgaben oben, Normalisierung fehlender Werte neuer Sprachen unten. Partielle Eingabe bedeutet nicht, dass du alles neu schreiben musst.

| Relativer Pfad | Typ / bei fehlender neuer Sprache                                            | Status, Wirkung und Grenzen                                                                                                                                       | Beispiel     |
| -------------- | ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| meta.label     | string / Sprachcode                                                          | Wirksam: Menüname. Leer fällt auf Code zurück, Leerraum wird nicht getrimmt. Ändert keine Ordner/URLs                                                             | 'Français'   |
| meta.hreflang  | string, optional / Sprachcode                                                | Wirksam: html lang, hreflang und einige strukturierte Daten. Kein Pfadschlüssel. Leer fällt auf Code, ohne Formatprüfung                                          | 'fr'         |
| meta.ogLocale  | string, optional / nicht gesetzt                                             | Bedingt: Open-Graph-Sprache und vorhandene alternate-Metadaten. Fehlend/leer kein Tag, keine automatische Region. Leer überschreibt integrierte Vorgabe           | 'fr_FR'      |
| meta.enabled   | boolean, optional / true                                                     | Wirksam: Nur false deaktiviert Nichtstandard. Standard immer aktiv. Standardseiten/Menü betroffen, keine Dateien/eigenen Seiten gelöscht, keine Zugriffskontrolle | false        |
| meta.fallback  | string[], optional / Standard wird bei anderen ergänzt, Standard selbst leer | Wirksam: direkte Konfigurationskette. Array ersetzt, Selbstreferenzen, Duplikate, leere und unregistrierte Codes entfernt. Nichtstandard erhält immer Standard    | ['zh', 'en'] |

hreflang und ogLocale sind verschieden und ersetzen nicht den Schlüssel. Das Theme garantiert keine regional passenden Metadaten eigener Sprachen; wähle zum Inhalt passende Werte.

<a id="routing"></a>

## i18n.routing.defaultLocalePrefix: Standardstartseitenadresse

- **Typ / Standard:** 'always' | 'never' / 'always'.
- **Status und Wirkung:** wirksam, aber nur kanonischer Einstieg der Standardstartseite, nicht Entfernen aller Standardpräfixe. Leer ist kein öffentlicher Typwert und fällt intern auf always; verlasse dich nicht auf ungültige Eingaben.
- **Grenzen:** Keine automatischen präfixlosen /blog/ oder /about/. Änderung braucht Build und Deployment, migriert weder alte Links noch Hosting-Redirects.
- **Beispiel:** i18n: { routing: { defaultLocalePrefix: 'never' } }.

Bei defaultLocale en:

| Adresse           | always                              | never                               |
| ----------------- | ----------------------------------- | ----------------------------------- |
| /                 | Statisches HTML nach /en/           | Englische Startseite                |
| /en/              | Englische Startseite                | Statisches HTML nach /              |
| /en/blog/         | Englische Liste                     | Englische Liste                     |
| /en/blog/my-post/ | Englischer Artikel                  | Englischer Artikel                  |
| /en/about/        | Englisches About, falls aktiv       | Englisches About, falls aktiv       |
| /zh/              | Chinesische Startseite, falls aktiv | Chinesische Startseite, falls aktiv |

Root-/Sprachstartseiten verwenden statische meta-refresh-Seiten mit canonical und noindex, keine Standortwahl zur Laufzeit und keine konfigurierte Server-301. Interne Pfadwerkzeuge erzeugen meist weiter `/<代码>/.../`; konkrete Einstiege behandeln den Root-Wechsel.

<a id="overrides"></a>

## Wo site, messages und about überschreiben?

Präfix `i18n.locales.<语言>`. Objekte rekursiv, Arrays vollständig ersetzt, undefined überschreibt nicht. Leer, false und [] bleiben erhalten; Bedeutung je Feld.

| Relativer Pfad | Typ / Standard                                                                                   | Wirkung, Grenzen und Beispiel                                                                                              | Einzelbeschreibung                                 |
| -------------- | ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| site           | { homeTitle?: string; hero?: string } / integrierte Startseitenwerte                             | Nur sprachbezogene Startseite statt oberster Identität; etwa site: { homeTitle: '我的博客' }                               | [Startseite](/de/blog/config-home/#site-fallbacks) |
| site.homeTitle | string, optional / nicht gesetzt                                                                 | Direkte Kette nach getrimmtem nichtleerem Titel, zuletzt SITE_TITLE; etwa '我的博客'. Leer stoppt Fallback nicht           | [Titel](/de/blog/config-home/#home-title)          |
| site.hero      | string, optional / integrierte Spracheinführung, neue Sprache ungesetzt                          | Erster definierter Wert, leer stoppt ausdrücklich; ohne Treffer messages.home.hero. Etwa '记录项目与生活。'                | [Einführung](/de/blog/config-home/#home-hero)      |
| messages       | DeepPartial<Messages> / meist keine Konfigurationsüberschreibung, integrierte Texte zur Laufzeit | Knöpfe, Status, Metabeschreibungen, etwa messages: { nav: { home: '主页' } }. Nur Texte, keine Funktionen oder Übersetzung | [Gesamtverzeichnis](/de/blog/config-reference/)    |
| about          | DeepPartial<AboutConfig> / integrierte Sprachkonfiguration                                       | Ab Basis entlang Kette rekursiv, etwa about: { sections: { who: '我是一名开发者。' } }. Kein automatisches Markdown-Lesen  | [About](/de/blog/config-about/#about-content)      |

Exakte integrierte hero-Vorgaben; homeTitle bleibt ungesetzt:

| Sprache   | Standard site.hero                                                                         |
| --------- | ------------------------------------------------------------------------------------------ |
| `en`      | Write a short introduction for your site and what readers can expect from your posts.      |
| `ja`      | このサイトの紹介文と、読者がどんな記事を期待できるかを書いてください。                     |
| `ko`      | 사이트 소개와 방문자가 어떤 글을 기대할 수 있는지 간단히 작성하세요.                       |
| `es`      | Escribe una breve presentación del sitio y qué tipo de contenido encontrarán tus lectores. |
| `zh`      | 在这里写一段站点简介，并告诉读者你将发布什么类型的内容。                                   |
| `pt-br`   | Apresente seu site e conte o que os leitores encontrarão nos seus artigos.                 |
| `de`      | Stelle deine Website kurz vor und beschreibe, was Leser in deinen Beiträgen erwartet.      |
| `ru`      | Кратко представьте свой сайт и расскажите, какие статьи здесь найдут читатели.             |
| `zh-hant` | 簡短介紹你的網站，並告訴讀者這裡會有哪些內容。                                             |

<a id="fallback"></a>

## Exakte Fallback-Reihenfolge

Bei fr mit effektivem meta.fallback ['zh', 'en'] gilt fr → zh → en. Direktes Suchen oder rückwärtiges Vereinigen dieser Liste, ohne zh-eigene Fallbacks weiter aufzulösen. Für ja muss ja direkt in fr stehen.

1. Ohne fallback oder mit [] erhält Nichtstandard trotzdem die Standardsprache. Standard darf ohne Kette oder mit anderen registrierten Sprachen sein.
2. Selbstreferenzen, Duplikate und unbekannte Sprachen entfallen. Registrierung zählt, nicht Aktivierung; deaktivierte Werte dürfen ergänzen.
3. Fehlender Standard wird am Ende ergänzt. Ist er explizit enthalten, bleibt seine Position statt nach hinten zu wandern.
4. Normale messages beginnen mit integriertem Englisch. Entlang der umgekehrten effektiven Kette wird je Sprache erst das integrierte Paket, dann persönliche Überschreibung vereinigt. Auch integrierte aktuelle Texte können persönliche Fallback-Texte überdecken.

en.nav.home 'Start' ersetzt daher nicht automatisch integriertes zh „首页“. Überschreibe zh.messages.nav.home. Neue Sprachen ohne Paket erben Oberfläche, bekommen aber keine vollständige eigene Übersetzung.

Nicht alle Inhalte teilen einen Algorithmus:

| Inhalt                     | Aktuelles Verhalten                                                                                                            |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Normale messages           | Integriertes Englisch → Fallback-Pakete und eigene Werte → aktuelles Paket und eigene Werte                                    |
| site.homeTitle             | Nichtleerer getrimmter Wert direkter Kette, dann globaler Titel                                                                |
| site.hero                  | Definierter Wert direkter Kette, leer beendet Suche                                                                            |
| about                      | DEFAULT_ABOUT_CONFIG, dann direkte Kette rückwärts vereinigt                                                                   |
| messages.home.transmission | Sonderfall: persönlicher aktueller Wert → persönlicher englischer → integrierter englischer Autorentext, derzeit Knock, knock. |
| aiReadableContent          | Sprachfelder über globalem Supplement ohne meta.fallback, siehe unten                                                          |
| Artikel-/Fragment-Text     | Keine Textfallbacks, nur Inhalte der jeweiligen Sprache                                                                        |

Fallback kopiert keine englischen Artikel in chinesische Listen, erzeugt keine Übersetzungen, füllt keine Startseitenzahlen aus anderen Sprachen und erkennt verschiedene Slugs nicht als Übersetzungen.

<a id="common-messages"></a>

## Sprachsteuerung und gemeinsame Texte

Optionale string unter `i18n.locales.<语言>.messages` mit normaler Kette. Lokalisiertes siteTitle ändert derzeit keine Standardidentität; Typ, Vorgaben und Status unter [Website](/de/blog/config-site-chrome/#legacy-site-title).

| Relatives Feld  | Standard vereinfachtes Chinesisch / Englisch                                                     | Status, Wirkung und Grenzen                                                                                             | Beispiel               |
| --------------- | ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| langLabel       | 语言 / Language                                                                                  | Wirksam: Tooltip/zugänglicher Name der Sprachwahl, keine Optionsnamen. Dafür meta.label                                 | '选择语言'             |
| siteDescription | 电影感网页界面与 AI 时代工程实践文章。 / Cinematic web interfaces and AI-era engineering essays. | Bedingt: Startseitenmetabeschreibung, keine sichtbare oder universelle Beschreibung. Andere Seiten haben eigene Quellen | '我的项目与学习笔记。' |

Modultexte stehen in ihren Verzeichnissen. Typische Existenz ohne Verbraucher macht kein Feld wirksam. Giscus folgt zusätzlich theme.comments.lang, standardmäßig fest Englisch, siehe [Kommentare](/de/blog/config-comments/#appearance).

<a id="ai-context"></a>

## aiReadableContent: besondere Sprachvererbung

`i18n.locales.<语言>.aiReadableContent` überschreibt notes/links einzeln global, ohne meta.fallback. Fehlend erbt, leere notes oder links leeren ausdrücklich. {} allein leert nichts.

Typen, Vorgaben, Validierung und Beispiele unter [KI-Leseergänzungen](/de/blog/config-analytics-ai/#locale-supplement). Keine Seitenübersetzung oder About-Text, alle Ergänzungen öffentlich. Relative Links lösen gegen Veröffentlichungswurzel auf. Ein Anfangs-/ überspringt base, siehe [Linkauflösung](/de/blog/config-analytics-ai/#supplement).

<a id="examples"></a>

## Beispiele zum Vereinigen

Vereinige mit bestehendem defineThemeConfig({...}) in src/site.config.ts, erhalte persönliche Werte, ohne i18n zu duplizieren. Die Beispiele mischen weiter rekursiv mit neun Vorgabesprachen. Nur zwei anzugeben schaltet andere nicht aus.

### Nur chinesische Seiten

```ts
i18n: {
  defaultLocale: 'zh',
  routing: { defaultLocalePrefix: 'always' },
  locales: {
    zh: { meta: { enabled: true, label: '中文' } },
    en: { meta: { enabled: false } },
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

Standard zh bleibt aktiv. Deaktiviertes Englisch darf weiter Fallback liefern. Für Root-Startseite ersetze always durch never; Artikel bleiben /zh/blog/.../.

### Französisch mit eigenen Oberflächentexten ergänzen

```ts
i18n: {
  locales: {
    fr: {
      meta: {
        label: 'Français',
        hreflang: 'fr',
        ogLocale: 'fr_FR',
        enabled: true,
        fallback: ['zh', 'en'],
      },
      site: {
        homeTitle: 'Mon blog',
        hero: 'Mes projets et mes notes.',
      },
      messages: {
        langLabel: 'Langue',
        nav: { home: 'Accueil', blog: 'Articles', about: 'À propos' },
      },
    },
  },
},
```

Nur einige französische Texte, kein vollständiges Paket. Veröffentliche zusätzlich unter src/content/blog/fr/, Fragments unter src/content/fragments/fr/. Die CLI erstellt standardmäßig Platzhalter für aktive Sprachen, übersetzt aber nicht.

<a id="content-and-seo"></a>

## Adressen, Inhaltswechsel und SEO-Grenzen

- Das öffentliche Menü listet aktive Sprachen und behält normalerweise den Seitenunterpfad. Routen können eigene Ziele liefern. Kein Übersetzungsfinder mit Existenzgarantie für beliebige Seiten.
- Standardartikel suchen vollständigen Slug ohne Sprachordner. Vorhanden öffnet Übersetzung, sonst Blog List. SEO deklariert nur existierende gleichnamige Artikel, keine Liste als Übersetzung. Fehlt auch Standardübersetzung, wird kein x-default-Artikel erfunden.
- Fragments wechseln zur ersten Zielseite, nicht nach ID. Gleiche ID für Diskussionen ist unabhängig. Deaktivierung löscht weder Dateien noch GitHub-Diskussionen.
- meta.label ändert Namen, Sprachschlüssel ändern URLs und Ordner. Keine Migration alter Links oder Wahl per Accept-Language, Browser oder Land.
- Messages sind Texte, kein allgemeiner HTML-/Markdown-Renderer. Zeilenumbrüche, Arrays und Format hängen vom Modul ab. Array-Ersatz fügt keine Menüs oder Funktionen an.
- Kein languageOrder, autoDetect, automatische fehlende Übersetzung, global präfixlose Routen oder sprachabhängige gemeinsame Playlist. localeHrefs/seoLocaleHrefs eigener Seiten sind Komponentenparameter.

Lade Entwicklungskonfiguration neu und baue/veröffentliche online erneut. Deaktivierung bereinigt keine alten Hosting-Dateien und schützt keine privaten Inhalte. Weitere Module im [Gesamtverzeichnis](/de/blog/config-reference/).
