---
tags: ['anglefeint', 'starter']
title: 'Anleitung 4: Ein Fragment veröffentlichen'
subtitle: 'Kurze Gedanken, Bilder und Code mit stabilen IDs und optionalen Kommentaren veröffentlichen.'
description: 'Fragments aktivieren, erstellen, übersetzen und teilen; Bilder, Startseitenvorschau, Seiteneinteilung und Kommentare.'
pubDate: '2026-11-11'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

Dies ist Teil 4 von 8 der Einführung. [Reihenfolge aller Tutorials](/de/blog/starter-guide-1-configure-your-site/#tutorial-order) · [Konfiguration nach Feldern](/de/blog/config-reference/).

Für einen Gedanken, ein Bild oder ein Stück Code brauchst du keinen vollständigen Artikel. Fragments ordnet solche Inhalte zeitlich in einer eigenen Liste und bietet auf der Startseite eine Vorschau aktueller Einträge.

Dieses Tutorial gilt für den integrierten Starter. Fehlen in einem vorhandenen Projekt Befehle oder Funktionen, aktualisiere es zuerst nach [Blog installieren und eigene Angaben eintragen](/de/blog/starter-guide-1-configure-your-site/).

## 1. Fragment-Liste aktivieren

Öffne `src/site.config.ts` und vereinige `fragments` mit dem vorhandenen `theme`. Ergänze oder ändere dessen Felder, statt gleichnamige Objekte doppelt anzulegen:

```ts
theme: {
  fragments: {
    enabled: true,
    pageSize: 20,
    comments: { enabled: false },
  },
},
```

| Feld                               | Standardwert und Wirkung                                                                                           |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `theme.fragments.enabled`          | Standard `false`; erzeugt Listen für aktive Sprachen und erlaubt eine Startseitenvorschau bei vorhandenen Inhalten |
| `theme.fragments.pageSize`         | Standard `20`; Einträge pro Seite, Ganzzahl von 1 bis 100, unabhängig von der Blog-Seitengröße                     |
| `theme.fragments.comments.enabled` | Standard `false`; aktiviert den Kommentar-Dialog, benötigt außerdem die später beschriebene Giscus-Konfiguration   |

Starte lokal `npm run dev` und öffne `/<Sprachcode>/fragments/` unter der Terminal-Adresse, etwa `/en/fragments/` oder `/zh/fragments/`. Die Sprache muss im Projekt aktiv sein. Ohne Inhalte erscheint eine leere Liste, ohne manuell angelegte Seitendatei. Deaktivierte Fragments erzeugen weder Liste noch Startseiteneinstieg, löschen aber keine Markdown-Dateien.

## 2. Ein Fragment nach dem Standardablauf erstellen

Führe im Projektstamm aus:

```bash
npm run new-fragment
```

Ohne `--locales` oder `ANGLEFEINT_LOCALES` erzeugt der Befehl Gerüste desselben Fragments für alle aktiven Sprachen, anfangs neun. Sie liegen in `src/content/fragments/<Sprachcode>/` und teilen bei einem Aufruf ID und Veröffentlichungszeit, werden aber nicht übersetzt. Das Terminal nennt die tatsächlichen Pfade. Ein Dateiname wie `2026-11-13-q8Lm3XzP.md` enthält UTC-Datum und Zufalls-ID. Öffne deine erzeugte Datei, statt diesen Beispielnamen manuell anzulegen.

Für nur Chinesisch verwende alternativ `npm run new-fragment -- --locales zh`, für mehrere Sprachen `--locales en,zh`. Wähle eine passende Variante, führe nicht alle aus. Die Befehle aktivieren keine Sprachen. Entferne unfertige fremdsprachige Gerüste vor der Veröffentlichung aus dem Fragment-Verzeichnis.

**Jeder Aufruf erstellt ein neues Fragment.** Für bestehende Inhalte bearbeite die Originaldatei, statt den Erstellungsbefehl erneut aufzurufen. Ein Slug ist nicht nötig und vorhandene Dateien werden nicht überschrieben.

Der aktuelle Starter enthält `new-fragment`. Fehlt das Skript in einem älteren Projekt, prüfe zuerst das Upgrade und verwende dann die Projekt-CLI:

```bash
npx @anglefeint/astro-theme new-fragment
```

Dies ersetzt den vorherigen Befehl. Führe nicht beide aus, um vermeintlich denselben Eintrag zu erstellen.

## 3. Platzhaltertext ersetzen, ID erhalten

Oben steht frontmatter, nach dem zweiten `---` der Text. Erhalte `id` und `pubDate` und ersetze den Platzhalter. Das folgende Beispiel zeigt nur das Format; überschreibe deine ID nicht mit seiner:

```md
---
id: 'q8Lm3XzP'
pubDate: '2026-11-13T09:00:00+08:00'
---

Heute habe ich ein Problem gelöst, das mich lange beschäftigt hat. Ein kleiner Fortschritt, den ich festhalten möchte.
```

Fragments unterstützen derzeit drei frontmatter-Felder:

| Feld      | Eingabe                                                                                                                                                 |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`      | Pflicht, genau 8 englische Buchstaben und Ziffern, Großschreibung relevant. Der Befehl erzeugt die ID und prüft vorhandene IDs; du musst keine erfinden |
| `pubDate` | Pflicht, parsebares Veröffentlichungsdatum. Behalte vorzugsweise den erzeugten ISO-Zeitstempel oder verwende Zeit und Zeitzone                          |
| `title`   | Optionaler String als Kartenüberschrift; auch ohne Titel lässt sich veröffentlichen                                                                     |

Ergänze für einen Titel etwa `title: 'Ein kleiner Fortschritt'` im selben frontmatter. Ein Fragment braucht kein `description` und hat kein Artikel-`heroImage`. Bilder gehören in den Text.

Die Liste sortiert nach `pubDate` absteigend und bei gleicher Zeit nach ID, nicht Dateinamen. Angezeigt wird UTC, möglicherweise abweichend von deiner lokalen Zeit. Nur Text oder Dateiname zu ändern ändert weder Kommentar- noch Freigabeidentität. Datumsänderungen beeinflussen Reihenfolge und Seite.

**Erhalte veröffentlichte IDs.** Doppelte IDs innerhalb einer Sprache sind Fehler. Verschiedene Fragments dürfen sie nicht wiederverwenden. Alte UUIDs und lange IDs entsprechen nicht dem aktuellen Format. Sichere Originalinhalte vor einer Kompatibilitätsanpassung; das Theme migriert alte IDs, Links und Kommentare nicht automatisch. Massenänderungen von IDs sind keine gewöhnliche Dateiaufräumaktion.

Gesammelt werden nur `.md`-Dateien unter `src/content/fragments/`, keine `.mdx`. Es gibt keine Filter für Entwürfe oder zukünftige Daten: `draft: true` und zukünftige Zeiten verstecken nichts. Nicht öffentliche Inhalte gehören außerhalb dieses Ordners.

## 4. Bilder, Code und Formeln ergänzen

Normale Markdown-Absätze, Links, Listen und Zitate funktionieren. Ein Bild etwa:

```md
![Screenshot dieses Fortschritts](/images/fragments/progress.png)
```

Lege zuerst die Datei unter `public/images/fragments/progress.png` ab. Alternativ lege `photo.png` neben das Fragment und verwende `![Bildbeschreibung](./photo.png)`. Weitere Formen, Größen und Git-Anforderungen erklärt [Bilder hinzufügen](/de/blog/starter-guide-images/).

Code behält Markdown-Zäune und Einrückung:

````md
```js
const progress = {
  done: true,
};
```
````

Codeblöcke zeigen Inhalt, führen JavaScript aber nicht aus. Artikel-Kopierknöpfe oder Bildvergrößerung gelten nicht automatisch für Fragments; die Liste bindet beide Artikelinteraktionen derzeit nicht ein.

Bei global aktivierter Mathematik funktionieren `$x_1$` inline und eigenständige Formeln zwischen zwei `$$`-Zeilen. Sie werden beim Build gerendert; ungültige Formeln können Kompilierung oder Build scheitern lassen. `theme.math.enabled` deaktiviert diese Verarbeitung. Die Syntax erklärt [Den ersten Beitrag schreiben](/de/blog/starter-guide-2-languages-and-routing/).

Normale Aufrufe von dev, build und doctor, auch in CI, verwenden korrekte Bildvarianten wieder und ergänzen oder reparieren fehlende, veraltete oder veränderte Dateien automatisch. Committe Inhalte und referenzierte Originalbilder. Das Committen von `src/assets/blog/covers/manifest.json` und `generated/` wird zur Wiederverwendung empfohlen, ist aber keine Voraussetzung für die automatische Vorbereitung. Fehlende Originale, unsichere Pfade und ungültige Eingaben führen weiterhin zu Fehlern. Vergiss keine referenzierten Originalbilder.

**Versionshinweis:** Die automatische Bildvorbereitung bei normalen Builds und doctor in CI erfordert mindestens 0.36.2. Führe mit 0.36.1 zuerst dev oder `prepare-covers` aus, um Bildvarianten vorzubereiten. Explizites `prepare-covers --check` und Konfigurations-Sync bleiben schreibgeschützt.

## 5. Startseitenvorschau und Seiteneinteilung

Bei aktivierten Fragments und Inhalten der aktuellen Sprache zeigt die Startseite unter dem Header einen Pixelavatar. Er öffnet bis zu drei neueste Einträge. Eine zusätzliche Startseiteneinstellung ist nicht nötig; `homeLatestCount` steuert nur Artikel, nicht Fragments.

Die Vorschau kann Text, das erste geeignete Bild und den ersten Codeblock enthalten, nicht den vollständigen Inhalt. Bilder und Code sind höhenbegrenzt und werden abgeschnitten. Mehrere Bilder oder Codeblöcke erscheinen nicht vollständig. Die ganze Karte führt zum Fragment, „Vorschauanzahl / Gesamtanzahl der Sprache →“ unten zur vollständigen Liste. Bei zwei Einträgen steht `2 / 2`, nicht immer drei. Leere Listen haben keinen Startseiteneinstieg.

Die vollständige Liste verwendet `theme.fragments.pageSize`. Ihre erste Seite ist etwa `/zh/fragments/`, die zweite `/zh/fragments/2/`. Aussehen und Seitenwechsel teilen `theme.pagination`; `blogPageSize` bestimmt nicht die Fragment-Anzahl.

Ein Sprachwechsel öffnet die erste Seite der Zielsprache, nicht zwingend dieselbe Übersetzung oder Seitennummer. Übersetzungsanzahlen dürfen abweichen; jede Sprache zählt unabhängig.

## 6. Ein Fragment teilen

Fragments erscheinen in Listen und erhalten keine eigene Detailseite pro Eintrag. Teile den Datumslink oder verwende den Kopierknopf daneben, etwa:

```text
https://your-domain.example/zh/fragments/#q8Lm3XzP
```

Ersetze Domain und ID durch echte Werte. Datum und Kopierknopf verwenden Listenwurzel plus ID, unabhängig von der derzeitigen Seite. Neue Inhalte, Datums- oder pageSize-Änderungen aktualisieren nach Build und Deployment auch den Positionsindex.

Liegt das Ziel auf einer anderen Seite, lädt JavaScript bei Bedarf den statischen Sprachindex, wechselt auf seine Seite und positioniert es. Ohne JavaScript bleiben Seiten manuell erreichbar, automatischer Seitenwechsel und Kopierknopf jedoch nicht. Bei eingeschränkter Zwischenablage erscheint ein auswählbarer Link zum manuellen Kopieren.

Teile URLs mit `/2/` aus der Adressleiste nicht als dauerhafte Links. Noch vorhandene alte Seiten können veraltete Anker korrigieren; nicht mehr vorhandene Seitennummern führen dagegen zur normalen 404, die das Skript nicht übernimmt. Gelöschte Inhalte, unbekannte IDs und Indexfehler melden einen Hinweis, stellen aber nichts wieder her.

Alle Freigabelinks verwenden dasselbe Seiten-Freigabebild der jeweiligen Fragment-Liste, kein eigenes Bild pro ID. Das Standardbild erklärt das [Bildertutorial](/de/blog/starter-guide-images/).

## 7. Übersetzungen desselben Fragments ergänzen

Für nur chinesische und englische Gerüste kannst du den Standardbefehl ersetzen durch:

```bash
npm run new-fragment -- --locales zh,en
```

Dateien desselben Aufrufs teilen ID und Zeitstempel. Übersetze den Text selbst. `--locales` wählt Dateien, aktiviert keine Sprache. Die Priorität lautet `--locales` → `ANGLEFEINT_LOCALES` → aktive Projektsprachen. Auch ohne Parameter erfolgt keine automatische Übersetzung.

Für eine spätere englische Fassung eines chinesischen Fragments kopiere die Originaldatei nach `src/content/fragments/en/`, erhalte `id` und `pubDate` und übersetze Titel und Text. Starte nicht erneut den Erstellungsbefehl: Er würde eine andere ID vergeben. Übersetzungen desselben Fragments dürfen sprachübergreifend dieselbe ID teilen, aber pro Sprache darf sie nur einmal existieren.

Übersetzungen mit gleicher ID teilen Fragment-Kommentare. Verschiedene IDs werden nicht durch gleiche Texte oder Dateinamen verknüpft.

## 8. Kommentare bei Bedarf aktivieren

Zum reinen Notieren können Kommentare aus bleiben. Bereite bei Bedarf nach dem [Giscus-Tutorial](/de/blog/starter-guide-4-giscus-comments/) ein öffentliches Repository, Discussions, die Giscus-App und eine Kategorie vor. Trage die echten IDs in die vorhandene Konfiguration ein:

```ts
theme: {
  fragments: {
    enabled: true,
    comments: { enabled: true },
  },
  comments: {
    repo: 'yourname/your-repository',
    repoId: 'REPLACE_WITH_REPO_ID',
    category: 'Announcements',
    categoryId: 'REPLACE_WITH_CATEGORY_ID',
  },
},
```

Ersetze Konto, Repository, Kategorie und beide ID-Platzhalter. Erhalte weitere vorhandene `theme.comments`-Einstellungen. Fehlende der vier Repository-/Kategorieangaben sind Konfigurationsfehler; Platzhalter beweisen keine gültige Remote-Konfiguration. Weder ein eingefügtes Giscus-Skript noch ein zusätzliches npm-Paket ist nötig.

Der Fragment-Schalter lautet `theme.fragments.comments.enabled`. `theme.comments.enabled` für Artikel muss dafür nicht true sein. Bereits aktivierte Artikelkommentare kannst du beibehalten.

Fragments verwenden fest `specific`, strenge Zuordnung und `fragment/<id>`. Artikel-mapping, term, number, shareAcrossLocales und festes lang gelten nicht. Die Oberfläche folgt der Seitensprache; Übersetzungen gleicher ID teilen Diskussion und Reaktionen. Kommentartexte werden nicht übersetzt. Andere gemeinsame Aussehenseinstellungen kommen weiterhin aus `theme.comments`.

Der Client lädt erst beim Kommentar-Klick auf einer Listenkarte. Schließen erhält die Instanz für erneutes Öffnen oder Fragmentwechsel. Bei Fehlern oder etwa 15 Sekunden ohne Bereitschaft erscheint Wiederholen. Ein Ladehinweis beweist keine erfolgreiche Verbindung. Zum Kommentieren benötigen Besucher GitHub-Autorisierung.

ID-Änderungen verschieben alte Kommentare nicht. Das Löschen eines Fragments löscht keine GitHub-Diskussion. Beurteile nötige Migrationen selbst; das Theme führt nichts automatisch zusammen.

## 9. Vor Veröffentlichung prüfen

Prüfe in dev Inhalt, Zeit, Startseitenvorschau und Seiteneinteilung. Stoppe dev vor Veröffentlichung und führe aus:

```bash
npm run doctor
npm run preview
```

doctor enthält lokale Bildvorbereitung, Prüfungen und Build; ein sofortiger weiterer build ist unnötig. Prüfe in der gebauten preview Freigabe-Positionierung und Bilder sowie konfigurierte Kommentar-Dialoge. Die Vorschau veröffentlicht nicht. Erst erneutes Deployment aktualisierter statischer Dateien ändert die Website.

Fragments gehören nicht zur Artikel-Volltextsuche oder zum Artikel-RSS. Der Build erzeugt `/zh/fragments/index.md` für diese Sprache (ersetze `zh` bei anderen), vereint öffentliche Fragments mit ID, Zeit, Text und stabilen Links und nimmt sie in den KI-lesbaren Index auf. Das ist öffentliche Ausgabe, kein privates Backup; Kommentare sind nicht enthalten.

- Liste fehlt: Prüfe Fragment-Schalter und aktive Zielsprache.
- Startseitenavatar fehlt: Prüfe tatsächliche Inhalte der aktuellen Sprache. Inhalte anderer Sprachen reichen nicht.
- Erstellungsbefehl scheitert an alten Dateien: Prüfe ID-Formate im frontmatter; der Ersteller liest vorhandene Markdown-IDs zur Kollisionsprüfung.
- Doppelte ID im Build: Prüfe doppelte Dateien innerhalb einer Sprache. Übersetzungen gehören in einen anderen Sprachordner.
- Bild-Build scheitert: Bereite Originale, Manifest und Varianten nach dem [Bildertutorial](/de/blog/starter-guide-images/) vor und committe sie.
- Kommentare scheitern: Prüfe echte IDs, App-Freigabe, Kategorie, Netzwerk und Browserblockaden. Ändere nicht ständig die Fragment-ID.

Upgrades erklärt der [erste Teil](/de/blog/starter-guide-1-configure-your-site/).

## Tutorial-Navigation und Konfiguration

[Zurück: Bilder hinzufügen](/de/blog/starter-guide-images/) · [Weiter: Seiten und Funktionen anpassen](/de/blog/starter-guide-3-comments-about-and-theme-toggles/) · [Alle acht Tutorials](/de/blog/starter-guide-1-configure-your-site/#tutorial-order).

Passende Felder: [Fragment-Schalter, Seiteneinteilung und Inhalte](/de/blog/config-fragments/), [Fragment-Kommentare](/de/blog/config-comments/). Vollständige Pfade, Vorgaben und Grenzen stehen im [Konfigurationsverzeichnis](/de/blog/config-reference/).
