---
tags: ['anglefeint', 'starter']
title: 'Anleitung 6: Lesern Kommentare ermöglichen'
subtitle: 'Giscus verbinden und Diskussionen für Artikel, Fragments und Übersetzungen zuordnen.'
description: 'Repository-Einrichtung, Zuordnungsarten, gemeinsame Diskussionen, Fragment-Dialoge und Fehlersuche.'
pubDate: '2026-11-10'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

Dies ist Teil 6 von 8 der Einführung. [Reihenfolge aller Tutorials](/de/blog/starter-guide-1-configure-your-site/#tutorial-order) · [Konfiguration nach Feldern](/de/blog/config-reference/).

Anglefeint verwendet Giscus für standardmäßig deaktivierte Kommentare. Artikel und Fragments lassen sich getrennt aktivieren. Kommentare und Reaktionen liegen in deinen GitHub Discussions; eine zusätzliche Kommentardatenbank für den statischen Blog ist nicht nötig.

Richte zuerst ein Repository ein und entscheide danach über gemeinsame Diskussionen für Übersetzungen. Ändere dafür keine Artikeltemplates und füge nicht in jeden Beitrag ein Skript ein.

## 1. GitHub-Repository und Kategorie vorbereiten

Öffne die [Giscus-Konfigurationsseite](https://giscus.app/de) und folge den Schritten:

1. Wähle ein eigenes öffentliches GitHub-Repository. Es kann der Blog selbst oder ein separates Kommentar-Repository sein.
2. Aktiviere Discussions im Repository.
3. Installiere und autorisiere die Giscus-App für dieses Repository.
4. Wähle eine Diskussionskategorie und notiere die erzeugten Repository- und Kategorieangaben.

Die Seite erzeugt ein Skript. Das Theme benötigt nur dessen Feldwerte:

| Erzeugtes Giscus-Attribut | Theme-Feld                                                  |
| ------------------------- | ----------------------------------------------------------- |
| `data-repo`               | `theme.comments.repo`, etwa `yourname/your-repository`      |
| `data-repo-id`            | `theme.comments.repoId`, Repository-ID, nicht dessen Name   |
| `data-category`           | `theme.comments.category`, tatsächlicher Kategoriename      |
| `data-category-id`        | `theme.comments.categoryId`, Kategorie-ID, nicht deren Name |

Beispiel-IDs, Repository-URLs und Benutzername sind keine echten IDs. Die Kategorie muss nicht Announcements heißen; verwende deine Auswahl und passende ID. Ein Giscus-npm-Paket, GitHub-Token oder Passwort ist nicht erforderlich.

Kommentare sind ein externer Dienst. Die Seite muss Giscus und GitHub erreichen können. Besucher brauchen zum Kommentieren GitHub-Autorisierung und können auch direkt in der GitHub Discussion teilnehmen. Das Theme bietet keine anonymen Kommentare. Das Verhalten des Dienstes erklärt [Giscus offiziell](https://giscus.app/de).

## 2. Zunächst Artikelkommentare aktivieren

Vereinige im vorhandenen `defineThemeConfig({...})` von `src/site.config.ts`:

```ts
theme: {
  comments: {
    enabled: true,
    repo: 'yourname/your-repository',
    repoId: 'REPLACE_WITH_REPO_ID',
    category: 'Announcements',
    categoryId: 'REPLACE_WITH_CATEGORY_ID',
    mapping: 'pathname',
    lang: '',
  },
},
```

Ersetze Konto, Repository, Kategorie und beide ID-Platzhalter. Ändere Felder in bestehenden `theme`- oder `comments`-Objekten und erhalte andere Einstellungen, statt sie doppelt anzulegen.

Das Beispiel aktiviert Artikelkommentare und ordnet nach URL-Pfad zu. `/zh/blog/my-first-post/` und `/en/blog/my-first-post/` sind verschiedene Pfade und teilen standardmäßig keine Diskussion. Sprachübergreifendes Teilen ist standardmäßig `false`. War es zuvor aktiv, stelle die Zuordnung nach den späteren Hinweisen wieder her; nur diesen Ausschnitt zu ersetzen reicht nicht.

Eine Artikelseite gibt die Komponente nur bei aktivierten Kommentaren und vier vollständigen Repository-/Kategorieangaben aus. Fehlen sie, kann der Bereich ganz fehlen. Platzhalter erfüllen oft nur lokale Nichtleer-Prüfungen und belegen keine gültige Remote-Einrichtung. Ein frontmatter-Schalter pro Artikel existiert nicht; `comments: false` schaltet keinen einzelnen Beitrag aus.

`lang: ''` im Beispiel folgt der Artikelsprache. Die Theme-Vorgabe ist tatsächlich fest `lang: 'en'`; zum Folgen der Seite musst du ausdrücklich leeren. `zh` wird auf `zh-CN`, `zh-hant` auf `zh-TW` und `pt-br` auf `pt` abgebildet. Das verändert nur die Oberfläche, nicht Besuchertexte.

## 3. Die tatsächliche Verbindung prüfen

Speichere und öffne lokal einen Artikel. Prüfe unten, ob die Diskussion des richtigen Repositorys sowie Anmeldung, Kommentare und Reaktionen verfügbar sind. Eine leere Diskussion ist nicht automatisch ein Fehler: Giscus kann sie erst bei der ersten Antwort oder Reaktion erstellen, nicht zwingend beim Seitenaufruf.

Stoppe vor Veröffentlichung dev und führe aus:

```bash
npm run doctor
npm run preview
```

doctor enthält Prüfungen und Build; danach ist kein sofortiger weiterer build nötig. preview zeigt nur lokale Build-Dateien. Online musst du erneut bereitstellen. Ein erfolgreicher Build belegt lokale Konfiguration und Seitenerzeugung, nicht Remote-Rechte und Dienstverbindung im Browser.

Artikel verwenden standardmäßig `loading: 'lazy'` für das Giscus-iframe. Das bedeutet nicht, dass das Client-Skript erst beim Scrollen ausgegeben wird: Artikel enthalten ein asynchrones Giscus-Skript. Fragment-Dialoge laden den Client dagegen erst nach dem Kommentar-Klick.

Typen, Vorgaben und Beispiele stehen im [Giscus-Verzeichnis](/de/blog/config-comments/#connection). Prüfe bei bestehenden Kommentaren insbesondere Zuordnung und Freigabegrenzen.

## 4. Die Zuordnung von Artikeln zu Diskussionen wählen

Für normale Nutzung reicht `pathname`. Verstehe vor Änderungen die Zuordnung; wechsle auf Websites mit vorhandenen Kommentaren nicht unbedacht:

| `mapping`    | Grundlage und Grenzen                                                                              |
| ------------ | -------------------------------------------------------------------------------------------------- |
| `'pathname'` | URL-Pfad ohne Domain; Pfadänderungen können andere Diskussionen zuordnen                           |
| `'url'`      | Vollständige URL; auch Domainwechsel können die Zuordnung ändern                                   |
| `'title'`    | Browser-Seitentitel; Artikel- oder Website-Titeländerungen können wirken                           |
| `'og:title'` | Open-Graph-Titel der Seite                                                                         |
| `'specific'` | Fester `term`; außerhalb des Teilmodus muss er nichtleer sein                                      |
| `'number'`   | Vorhandene Discussion-Nummer in `number`, keine Issue-Nummer; erzeugt keine Diskussion automatisch |

Giscus sucht die Diskussion; das Theme führt keine lokale Kommentardatenbank. `strict: '1'` reduziert unscharfe Treffer ähnlicher Titel. Standard ist `'0'`.

Ohne Sprachfreigabe sind `term` und `number` globale Kommentarwerte. Ein fester term mit specific lässt alle betroffenen Artikel dieselbe Diskussion suchen; number verweist ebenfalls auf eine feste Nummer. Sie vergeben nicht automatisch getrennte Diskussionen pro Beitrag.

Bei aktivierten Artikelkommentaren prüft das Theme: specific braucht einen nach Trimmen nichtleeren term. number muss ein positiver Ganzzahl-String wie `'42'` sein, nicht die Zahl `42`, `'0'` oder ein Dezimalwert. Ungültige Werte können dev oder build blockieren.

## 5. Übersetzungen desselben Artikels teilen Kommentare

Für eine gemeinsame Diskussion chinesischer und englischer Übersetzungen bei getrennten Artikeln behalte die echten Repository-/Kategoriewerte und vereinige:

```ts
theme: {
  comments: {
    // enabled: true und eigene Werte für repo, repoId, category und categoryId beibehalten.
    shareAcrossLocales: true,
    mapping: 'specific',
    term: '',
    number: '',
    strict: '1',
    lang: '',
  },
},
```

Der Teilmodus verlangt specific, leeren term, leere number und strict als String `'1'`. Der leere term ist beabsichtigt: Die Artikelseite setzt den vollständigen Slug ohne Sprachordner ein, statt alle Artikel auf ein fixes Wort zu legen.

`src/content/blog/zh/my-first-post.md` und `src/content/blog/en/my-first-post.md` verwenden beide `my-first-post`. Verschachtelte Inhalte wie `guides/setup` und `other/setup` behalten ihren vollständigen Pfad und bleiben getrennt. Übersetzungen müssen denselben Slug haben; Titel- oder Textähnlichkeit wird nicht geprüft.

Bei aktivierten Artikelkommentaren und Teilen führen falsches mapping, nichtleere term/number oder anderes strict als `'1'` ausdrücklich zu Fehlern. Paket-Routen liefern den Slug. Eigene BlogPost-Aufrufe brauchen ebenfalls ein gültiges articleSlug. Die Oberfläche folgt weiter lang; Kommentartexte werden nicht übersetzt.

Prüfe beide Übersetzungen und einen anderen Beitrag. Die ersten beiden müssen dieselbe Diskussion haben, der dritte eine eigene. Oberflächensprache oder Aussehen des Felds allein beweisen kein Teilen.

### Was passiert mit bestehenden Kommentaren?

Das Theme vereinigt, verschiebt und löscht keine alten Diskussionen. Der Teilmodus kann eine andere Diskussion wählen. Alte Kommentare können dadurch auf GitHub vorhanden sein, aber unter der neuen Zuordnung fehlen.

Sichere vorher Repository, Kategorie, mapping, term, number und strict. Für die alte Zuordnung setze `shareAcrossLocales: false` und stelle diese Werte wieder her. Nur Teilen auszuschalten und specific mit leerem term zu behalten ist ein Fehler. Prüfe nötige Aufräumarbeiten und Beziehungen zuerst auf GitHub. Das Theme migriert nicht automatisch.

## 6. Fragment-Kommentare unabhängig aktivieren

Für Kommentare nur bei Fragments trage dieselben Repository-/Kategorieangaben ein und setze:

```ts
theme: {
  fragments: {
    enabled: true,
    comments: { enabled: true },
  },
  comments: {
    enabled: false,
    repo: 'yourname/your-repository',
    repoId: 'REPLACE_WITH_REPO_ID',
    category: 'Announcements',
    categoryId: 'REPLACE_WITH_CATEGORY_ID',
  },
},
```

`theme.comments.enabled: false` deaktiviert nur Artikel. Fragments verwenden `theme.fragments.comments.enabled`. Bei Bedarf dürfen Artikel weiterhin true sein. Ihre bestehende Zuordnung muss für Fragments nicht geändert werden.

Fragments verwenden fest specific, strenge Zuordnung und `fragment/<id>`. Artikel-mapping, term, number, shareAcrossLocales und festes lang gelten nicht. Die Oberfläche folgt der Seitensprache; gleiche IDs teilen Diskussionen. Reaktionen, Farbschema und Eingabeposition verwenden gemeinsame Werte. Fehlen die vier Verbindungsangaben, ist das Aktivieren ein Konfigurationsfehler.

Der erste Kommentar-Klick lädt den Client. Schließen erhält die Instanz für erneutes Öffnen oder Fragmentwechsel. Nach Fehler oder etwa 15 Sekunden ohne Bereitschaft erscheint Wiederholen. Ein Ladehinweis beweist keine Verbindung. Veröffentlichung, IDs und Freigabelinks erklärt [Ein Fragment veröffentlichen](/de/blog/starter-guide-5-fragments/).

## Bei Bedarf: Anzeige und Laden

Alle folgenden Felder liegen in `theme.comments`. Normalerweise reichen Vorgaben.

| Feld               | Theme-Standard | Zweck                                                                                                                            |
| ------------------ | -------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `reactionsEnabled` | `'1'`          | Reaktionen auf den Discussion-Hauptbeitrag; `'0'` deaktiviert                                                                    |
| `inputPosition`    | `'bottom'`     | Eingabefeld oben oder unten, `'top'`/`'bottom'`                                                                                  |
| `theme`            | `'dark'`       | Giscus-Farbschema nach dessen Konfigurationsseite, kein Blog-Theme-Wechsel                                                       |
| `strict`           | `'0'`          | Strenge Artikelzuordnung; geteilte Artikel und Fragments erzwingen `'1'`                                                         |
| `emitMetadata`     | `'0'`          | Giscus sendet Diskussionsmetadaten an die Elternseite, keine Artikelmetadaten; Fragments erzwingen es zur Bereitschaftserkennung |
| `lang`             | `'en'`         | Feste Sprache für Artikel; `''` folgt der Seite. Fragments folgen immer der Seite                                                |
| `loading`          | `'lazy'`       | Artikel-iframe `'lazy'`/`'eager'`; geöffnete Fragment-Dialoge verwenden eager                                                    |
| `crossorigin`      | `'anonymous'`  | Skriptattribut `'anonymous'`/`'use-credentials'`; normalerweise unverändert lassen, kein Ersatz für GitHub-Anmeldung             |

`enabled` und `shareAcrossLocales` sind boolean true/false. `strict`, `reactionsEnabled` und `emitMetadata` verwenden Strings `'0'`/`'1'`. Verwechsle die Typen nicht wegen ähnlicher Darstellung.

## Fehlende Kommentare oder falsche Zuordnung

| Symptom                                          | Prüfreihenfolge                                                                                              |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| Kein Artikel-Kommentarbereich                    | Artikel aktiv, alle vier Verbindungsfelder vollständig? Fragment-Schalter gilt nicht für Artikel             |
| Konfigurationsfehler nach Fragment-Aktivierung   | Alle vier Repository-/Kategoriewerte statt nur des Schalters gesetzt?                                        |
| Remote-Fehler oder dauerhaftes Laden             | Echte IDs, öffentliches Repository, aktive Discussions, App-Rechte, passende Kategorie, Netzwerk und Blocker |
| Verschiedene Artikel zeigen dieselbe Diskussion  | Fester globaler term/number oder fehlende Teilmodus-Regeln? Tatsächlichen Giscus-Treffer prüfen              |
| Übersetzungen teilen nicht                       | shareAcrossLocales aktiv, gleicher Slug und gültige Teilmodus-Zuordnung?                                     |
| Kommentare nach Zuordnungswechsel „verschwunden“ | Alte Diskussionen zuerst auf GitHub prüfen; nicht wiederholt Titel/IDs ändern oder Diskussionen löschen      |
| Oberfläche bleibt englisch                       | Artikel-lang ist standardmäßig en; `''` folgt der Seite, übersetzt aber keine Besuchertexte                  |
| Lokal geändert, online unverändert               | Neu gebaut und bereitgestellt oder weiterhin alte Konfiguration online?                                      |

`theme.comments.enabled: false` deaktiviert Artikel, `theme.fragments.comments.enabled: false` Fragments. Beide entfernen nur Einstiege/Einbettungen, keine GitHub-Discussions-Daten. Der Upgrader migriert Diskussionen nicht. Sichere Zuordnungen vor dem Update und prüfe sie danach. Schritte stehen im [Installationstutorial](/de/blog/starter-guide-1-configure-your-site/).

## Tutorial-Navigation und Konfiguration

[Zurück: Seiten und Funktionen anpassen](/de/blog/starter-guide-3-comments-about-and-theme-toggles/) · [Weiter: Weitere Sprachen](/de/blog/starter-guide-languages/) · [Alle acht Tutorials](/de/blog/starter-guide-1-configure-your-site/#tutorial-order).

Passende Felder: [Giscus und geteilte Diskussionen](/de/blog/config-comments/), [Fragment-Kommentarschalter](/de/blog/config-fragments/). Vollständige Pfade, Vorgaben und Grenzen stehen im [Konfigurationsverzeichnis](/de/blog/config-reference/).
