---
tags: ['anglefeint', 'config']
title: 'Konfigurationsverzeichnis: Website, Navigation, soziale Links und Fußzeile'
subtitle: 'Globale Identität, Domain-Priorität, öffentliche Einstiege und Linkfelder.'
description: 'Alle Website-, Social- und Fußzeilenfelder einschließlich Umgebung, Bildpfaden und ungenutztem siteTitle.'
pubDate: '2026-11-13'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/matrix-01.webp'
---

Für erste eigene Angaben lies [Installation und Website-Angaben](/de/blog/starter-guide-1-configure-your-site/), für Domain und Deployment [Veröffentlichen](/de/blog/starter-guide-deployment/). Andere Module im [Gesamtverzeichnis](/de/blog/config-reference/).

Die Werte liegen in src/site.config.ts. Vorgaben stammen aus dem Paket, nicht von Namen, Konten und Domains der Demo. Erhalte import, export und andere Module im bestehenden defineThemeConfig({...}) und vereinige benötigte Ausschnitte.

<a id="identity"></a>

## site: sechs globale Identitätsfelder

site ist ein Objekt; alle Felder dürfen in Teilkonfigurationen fehlen. Sie wirken bedingt beim jeweiligen Leser. Umgebungsüberschreibungen und speziellere Seitenparameter können Vorrang haben.

| Vollständiger Pfad | Typ              | Theme-Standard                                                                          | Wirkung, Grenzen und Beispiel                                                                                                                                                                                              |
| ------------------ | ---------------- | --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `site.title`       | string           | `"My Blog"`                                                                             | Marke im Header, Copyrightname, RSS-Titel, strukturierte Website-Daten sowie einige Seiten und Freigabebilder. Nicht derselbe wie großer Startseitentitel. Kein einheitlicher Leerstring-Fallback; etwa `"我的博客"`       |
| `site.description` | string           | `"Cinematic web interfaces, AI-era engineering notes, and system architecture essays."` | Eine Quelle globaler und Maschinenindex-Beschreibung. Startseite bevorzugt messages.siteDescription, About/Listen haben eigene Werte. Ersetzt nicht jede Seite; etwa `"记录项目、阅读和生活。"`                            |
| `site.url`         | string           | `"https://example.com"`                                                                 | Öffentliche absolute HTTP(S)-Adresse für Astro site, canonical, RSS, Sitemap und Exporte. Kein einzelner Artikel. Kauft keine Domain und erledigt weder DNS, Zertifikat noch Deployment; etwa `"https://blog.example.com"` |
| `site.author`      | string           | `"Your Name"`                                                                           | Standardautor und strukturierte Daten; Artikel-author überschreibt. Copyright nutzt title, nicht author. About-Text und E-Mail ändern sich nicht automatisch; etwa `"小林"`                                                |
| `site.tagline`     | string           | `""`                                                                                    | Getrimmter Zusatzsatz in Fußzeile, leer verborgen. Exakt alter Standard Built with Astro. bleibt ebenfalls verborgen gegen doppelte Nennung; etwa `"保持好奇，持续构建。"`                                                 |
| `site.ogImage`     | string, optional | `""`                                                                                    | Globales Freigabebild ohne vorrangiges Seitenbild. Leerraum nutzt Theme-Bild. Lokaler public-Pfad oder HTTPS-URL, kein Avatar oder Massen-Titelbildersatz; etwa `"/images/share.webp"`                                     |

site.title ist global, `i18n.locales.<语言>.site.homeTitle` nur die sichtbare Startseitenüberschrift der Sprache. Letztere sucht nichtleere Sprach-Fallbacks und zuletzt globalen Namen; siehe [Startseitentitel](/de/blog/config-home/#home-title). messages.siteTitle steuert beide derzeit nicht.

site.description ist nicht die sichtbare Einführung. Diese verwendet `i18n.locales.<语言>.site.hero`, die Startseitenmetabeschreibung zusätzlich messages.siteDescription. Priorität im [Startseitenverzeichnis](/de/blog/config-home/#site-fallbacks). Globale Änderungen ersetzen keine vorhandene persönliche About-Vorstellung.

### Freigabebild-Priorität und Pfade

site.ogImage greift bei fehlendem Seitenbild im öffentlichen head. Artikel-ogImage, automatisches Bild und Titelbild können vorrangig sein, siehe [Artikelverzeichnis](/de/blog/config-article/#frontmatter). Es ersetzt keine automatischen Bilder bei aktiver Erzeugung.

/images/share.webp entspricht public/images/share.webp und muss vorher existieren. Fehlende Datei, Überschreiten von publicDir oder ungültiger Pfad werfen bei Auflösung Fehler. Lokale Bilder erhalten base und Inhaltsversionsparameter. HTTPS bleibt extern ohne Downloadvalidierung. Leer/Leerraum verwendet das Theme-Bild statt Metadaten zu entfernen.

site.ogImage ist ein String, kein Astro-image-import-Objekt. Artikel-frontmatter.ogImage hat andere Typen. Keine PUBLIC_SITE_OG_IMAGE-Überschreibung und keine Änderung von heroImage.

<a id="environment"></a>

## Umgebung und Domain-Priorität

Dies sind gelesene Umgebungsvariablen, keine zusätzlichen site.config-Felder. Alle string; ohne Angabe gilt das site-Feld. Nullish coalescing behandelt leer nicht automatisch als fehlend.

| Variable                | Vorrang vor      | Beispiel                                 |
| ----------------------- | ---------------- | ---------------------------------------- |
| PUBLIC_SITE_TITLE       | site.title       | PUBLIC_SITE_TITLE=我的博客               |
| PUBLIC_SITE_DESCRIPTION | site.description | PUBLIC_SITE_DESCRIPTION=项目与学习笔记   |
| PUBLIC_SITE_AUTHOR      | site.author      | PUBLIC_SITE_AUTHOR=小林                  |
| PUBLIC_SITE_TAGLINE     | site.tagline     | PUBLIC_SITE_TAGLINE=保持好奇             |
| PUBLIC_SITE_URL         | site.url         | PUBLIC_SITE_URL=https://blog.example.com |

Die Integration liest PUBLIC_SITE_URL entsprechend dev/build und --mode mit Vite-dotenv, damit Astro site und öffentliche URLs übereinstimmen. Bestehende Prozesswerte schlagen dotenv. Vergiss Hosting-PUBLIC_SITE_URL nicht, wenn nur site.url geändert wurde. Leer kann Text entfernen oder URLs ungültig machen, stellt keine Vorgaben wieder her.

Seitenseitiges SITE_URL behält import.meta.env.SITE als Kompatibilitätsstufe: PUBLIC_SITE_URL → SITE → site.url. Die Standardintegration setzt Astro site aus Umgebung/Konfiguration, head bevorzugt zudem Astro.site. SITE ist Adapter-Fallback, keine empfohlene separate Domainquelle.

Domain und Unterpfad sind verschieden. Astro base, Hosting-Ausgabe und DNS/HTTPS folgen dem Deployment-Tutorial. Beliebige Unterordner in site.url verschieben nicht alle Routen. Starte dev nach Änderung neu, online baue und veröffentliche erneut. Server-Redirects entstehen nicht.

<a id="navigation"></a>

## Öffentliche Navigation: feste Einstiege plus Schalter

Kein öffentliches nav-Array, keine Reihenfolge oder eigene Menüfelder. Standardheader:

| Position                 | Quelle und Grenzen                                                                                                |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| Markenname               | site.title/Umgebung, führt zur aktuellen Sprachstartseite                                                         |
| Startseite, Blog         | Beide immer erhalten; messages.nav.home/blog ändern Beschriftung, nicht Ziel                                      |
| About                    | theme.enableAboutPage, boolean, Standard true; etwa theme: { enableAboutPage: false } entfernt Seite und Einstieg |
| Decoder unter Frontier   | theme.enableDecoderPage, boolean, Standard true; Headertext fest Decoder Lab                                      |
| Fragments unter Frontier | theme.fragments.enabled, boolean, Standard false; Label messages.fragments.title                                  |
| Contact unter Frontier   | Bei aktivem About; messages.about.contact, führt zu /about/#contact der Sprache, unabhängig von Decoder           |
| Suche                    | theme.search.enabled, boolean, Standard true; [Suchverzeichnis](/de/blog/config-search/#enabled)                  |
| Sprache und Status       | Aktive Sprachen, meta.label und statische Texte unten; keine freie Linkliste                                      |

Frontier-Name und -Titel sind fest; nur ohne alle Untereinträge entfällt es. messages.decoderPage.fullTool ändert Werkzeugseite und Fußzeilenlink, nicht Header-Decoder Lab.

Sprachen und Adressen stehen im [Sprachenverzeichnis](/de/blog/config-languages/#content-and-seo), About/Fragments/Decoder in eigenen Verzeichnissen. Leere Labels deaktivieren Navigation nicht und lassen unklare Knöpfe zurück.

<a id="chrome-messages"></a>

### Sieben Header- und Fußzeilentexte

Präfix `i18n.locales.<语言>.messages`, optionale string mit Sprachvorgaben und Fallback. Tabelle zeigt vereinfachtes Chinesisch/Englisch. Alle bedingt bei vorhandenem Bereich und Klartext ohne Markdown/HTML.

| Relatives Feld     | Standard vereinfachtes Chinesisch / Englisch | Wirkung und Grenzen                                              | Beispiel     |
| ------------------ | -------------------------------------------- | ---------------------------------------------------------------- | ------------ |
| `nav.home`         | 首页 / Home                                  | Startseitentext, keine Routenänderung                            | `"首页"`     |
| `nav.blog`         | 博客 / Blog                                  | Blogtext, keine Routenänderung                                   | `"文章"`     |
| `nav.about`        | 关于 / About                                 | About-Navigation und Wiederöffnen des Textfensters               | `"关于我"`   |
| `nav.status`       | system: online / system: online              | Statischer Headerstatus, keine Netzwerk-/API-/Gesundheitsmessung | `"系统在线"` |
| `nav.statusAria`   | 系统状态 / System status                     | Zugänglicher Statusname, kein Monitoring-Schalter                | `"站点状态"` |
| `footer.theme`     | 主题： / Theme by                            | Präfix der Nennung; Anglefeint-Linktext/-ziel fest               | `"主题来自"` |
| `footer.builtWith` | 构建工具： / Built with                      | Astro-Präfix, Linktext/-ziel fest                                | `"使用"`     |

messages.langLabel gehört zur Sprachsteuerung, meta.label zu Optionen, siehe [Sprachtexte](/de/blog/config-languages/#common-messages). Contact/Fragments nutzen ihre Module, keine erfundenen messages.nav-Felder.

<a id="social"></a>

## social.links: gemeinsame soziale Links

- **Typ / Standard:** SocialLink[] / [], fünf Felder unten.
- **Status und Wirkung:** wirksam in Header/Fußzeile in Array-Reihenfolge. Vollständiger Ersatz, ohne öffentliche Höchstzahl oder Sprachlisten.
- **Grenzen:** [] verbirgt nicht alles. Es zeigt drei nicht klickbare Mastodon-/Twitter-/GitHub-Platzhalter, in dev mit Konfigurationshinweis. Leeres href eines echten Eintrags bleibt Link, nicht Platzhalter.
- **Beispiel:** [{ label: 'GitHub', href: 'https://github.com/yourname', icon: 'github' }].

About-E-Mail und GitHub-Kontakt sind unabhängig. Kein theme.social.enabled oder hidePlaceholders; showPlaceholdersWhenEmpty ist Layoutparameter.

<a id="social-fields"></a>

### Fünf Felder jedes SocialLink

Präfix social.links[]. Pflichtfelder haben keine Ergänzung; auch wenn partielle Typen Teilobjekte erlauben, gib vollständige gültige Einträge an.

| Feld    | Typ / Standard                                                           | Status, Wirkung und Grenzen                                                                                                                                                        | Beispiel                      |
| ------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| href    | string, Pflicht / keiner                                                 | Wirksam: Zieladresse. Keine einheitliche Protokoll-/Existenz-/Nichtleerprüfung oder BASE_URL-Ergänzung. Vollständiges HTTPS oder korrekter interner Pfad, kein verifiziertes Konto | 'https://github.com/yourname' |
| label   | string, Pflicht / keiner                                                 | Wirksam: zugänglicher Name, ohne Symbol auch sichtbar. Kein automatischer Plattform-/Zieltitel; klar und nichtleer                                                                 | 'GitHub'                      |
| rel     | string, optional / nicht gesetzt, zuletzt mindestens noopener noreferrer | Wirksam: Leerraum-getrennte Beziehungen, klein, dedupliziert, opener entfernt, Neufensterschutz erhalten. Leer hebt Schutz nicht auf; Nichtstring ist Fehler                       | 'me nofollow'                 |
| icon    | integriertes SocialIcon, optional / nicht gesetzt                        | Bedingt: einer von zwölf Namen unten, ohne iconSrc verwendet. Unbekannt nichtleer ist Fehler; keine URL-Erkennung. Ohne beides label-Text                                          | 'github'                      |
| iconSrc | string, optional / nicht gesetzt                                         | Bedingt: lokaler SVG/PNG/WebP-Pfad in publicDir; gültig nichtleer vor icon. Nur Leerraum gilt als fehlend; falscher Typ/Regelverstoß ist Fehler                                    | '/icons/community.svg'        |

Echte Links öffnen neue Tabs. rel wird mit Schutzmarkern vereinigt. Labels sind kein HTML. Namen sind exakt und großschreibungsabhängig:

```text
mastodon
twitter
github
youtube
bluesky
linkedin
discord
telegram
instagram
facebook
whatsapp
line
```

### Dateiregeln eigener Symbole

public/icons/community.svg entspricht iconSrc: '/icons/community.svg'. Es muss eine echte Datei im publicDir sein, kein Paketasset oder src/assets. Ein einzelner Anfangs-/; keine URL, protokollrelative Adresse, Query/Fragment, Prozentkodierung oder . / ..-Segmente. Backslash, Doppelpunkt und Steuerzeichen sind verboten.

Der Build prüft Existenz, Datei und realen Pfad innerhalb publicDir, auch gegen ausbrechende Symlinks. Leerzeichen und chinesische Dateinamen kodiert die Komponente selbst; keine vorab prozentkodierten Pfade. Ausgaben erhalten Astro base. Symbolpriorität ändert href-Rohbehandlung nicht. JPG, GIF und andere Formate sind hier nicht unterstützt.

Bei gültigem iconSrc zählt icon nicht. Symbolgröße und Abstand sind Layoutparameter, keine SocialLink-Felder.

<a id="footer"></a>

## theme.footer: Links und Nennung

| Vollständiger Pfad         | Typ / Standard                         | Status, Wirkung und Grenzen                                                                                                                                          | Beispiel                                                  |
| -------------------------- | -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| theme.footer.showCredits   | boolean / true                         | Wirksam: Theme-/Astro-Links. Entfernt nicht Copyright, soziale Links, Satz oder weitere Links. Steuert auch Nennung automatischer Artikelbilder, nicht eigene Bilder | false                                                     |
| theme.footer.links         | { label: string; href: string }[] / [] | Wirksam: eigene Links in Array-Reihenfolge, vollständiger Ersatz ohne Headeränderung. Layout kann Decoder ergänzen; [] garantiert keine linklose Fußzeile            | [{ label: '项目', href: 'https://example.com/project/' }] |
| theme.footer.links[].label | string, Pflicht / keiner               | Bedingt: sichtbarer Klartextname ohne automatischen Zieltitel                                                                                                        | '项目'                                                    |
| theme.footer.links[].href  | string, Pflicht / keiner               | Bedingt: unverändertes Ziel ohne Symbolpfadprüfung oder automatisches base; interne Pfade selbst korrekt setzen. Standard im aktuellen Tab                           | 'https://example.com/project/'                            |

Eigene Links stehen vor Layout-Ergänzungen, ohne Deduplizierung. Aktiver Decoder ergänzt den vollständigen Werkzeuglink mit messages.decoderPage.fullTool. Deaktiviere bei Bedarf Decoder selbst, statt footer.links zu leeren.

Copyright zeigt fest Build-Jahr und wirksamen SITE_TITLE, ohne eigene copyright/year-Felder. site.tagline erscheint unabhängig von Nennungen; alter getrimmter Standard Built with Astro. entfällt aus Kompatibilität. showCredits false entfernt weder weitere Sätze noch bestehende Bildnennungen.

<a id="examples"></a>

## Beispiele für Identität und Links

Erhalte persönliche Angaben und vereinige nur benötigte Felder:

```ts
site: {
  title: '小林的博客',
  description: '记录项目、阅读和生活。',
  url: 'https://blog.example.com',
  author: '小林',
  tagline: '保持好奇，持续构建。',
},
social: {
  links: [
    { label: 'GitHub', href: 'https://github.com/yourname', icon: 'github' },
    { label: '项目主页', href: 'https://example.com/project/' },
  ],
},
theme: {
  footer: {
    showCredits: true,
    links: [{ label: '项目', href: 'https://example.com/project/' }],
  },
},
```

Ersetze Konten, Domains und Links. Das Theme prüft sie nicht online. Eigene Symbole und globale Bilder brauchen zuerst passende public-Dateien, dann iconSrc oder site.ogImage.

Nur chinesische Navigation und Präfixe:

```ts
i18n: {
  locales: {
    zh: {
      messages: {
        nav: { home: '首页', blog: '文章', about: '关于我' },
        footer: { theme: '主题来自', builtWith: '使用' },
      },
    },
  },
},
```

<a id="legacy-site-title"></a>

## Derzeit ungenutzt: messages.siteTitle

`i18n.locales.<语言>.messages.siteTitle` ist optionale string-Überschreibung; vereinfachtes Chinesisch und Englisch haben beide 'Angle Feint'. Standardstartseitentitel und globale Identität lesen es nicht. Status „derzeit ungenutzt“. siteTitle: '我的博客' ändert diese Namen nicht.

Startseitentitel verwendet `i18n.locales.<语言>.site.homeTitle`, öffentliche Marke oberstes site.title; siehe [Startseite](/de/blog/config-home/#home-title) und [Identität](#identity). Zum Umbenennen ist dieses reservierte Feld unnötig.

<a id="boundaries"></a>

## Kompatibilität und unwirksame Felder

- Alle sechs site-Felder, soziale/Fußzeilenfelder und sieben Texte haben Verbraucher. Bildpriorität, Umgebung und Funktionsschalter entscheiden über konkrete Seitenwirkung.
- Built with Astro. in site.tagline ist eine explizite Altstandard-Sonderregel, kein Verbot beliebiger Sätze.
- messages.siteTitle bleibt ungenutzt. Ein akzeptierter Typ bedeutet keinen Seitenverbrauch.
- homeHref, localeHrefs, extraLinks, showPlaceholdersWhenEmpty und iconSize sind Komponentenparameter, keine site.config-Felder. Kein öffentliches nav-Array, Platzhalterschalter, Copyrighttemplate oder separates Statusmonitoring.

Nach Konfiguration und Dateien neu bauen und veröffentlichen. Geänderte Umgebungen müssen im passenden Modus neu gelesen werden. Domain, Erreichbarkeit, Remote-Konten und Online-Wirkung prüfst du in deinem Deployment; lokale Typprüfung beweist sie nicht. Weitere Module im [Gesamtverzeichnis](/de/blog/config-reference/).
