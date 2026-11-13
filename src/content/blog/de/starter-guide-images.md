---
tags: ['anglefeint', 'starter']
title: 'Anleitung 3: Bilder zu Beiträgen und Fragments hinzufügen'
subtitle: 'Originale ablegen, Titelbilder setzen, responsive Varianten vorbereiten und Dateien bereitstellen.'
description: 'Bildpfade, Titelbilder, Fragment-Bilder, persistente responsive Dateien, Freigabebilder und Fehlersuche.'
pubDate: '2026-11-13'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/cyber-03.webp'
---

Dies ist Teil 3 von 8 der Einführung. [Reihenfolge aller Tutorials](/de/blog/starter-guide-1-configure-your-site/#tutorial-order) · [Konfiguration nach Feldern](/de/blog/config-reference/).

Du musst weder mehrere Bildgrößen von Hand erstellen noch Beitragslinks auf generierte Dateinamen umstellen. Lege Originale ab, verweise aus Beitrag oder Fragment darauf und lasse den lokalen Entwicklungsserver die responsiven Dateien vorbereiten.

Dieser Artikel verwendet die Standardordner `src/` und `public/` des Starters. Unterscheide zuerst die Verwendung:

| Verwendung             | Wo angeben                                                  | Aktuelle Verarbeitung                                                                                          |
| ---------------------- | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Bilder im Beitragstext | Markdown-Bilder oder Bilder in MDX                          | Bisherige Markdown-/MDX-Verarbeitung; nicht Teil der folgenden persistenten Titelbildvorbereitung              |
| Artikel-Titelbild      | `heroImage` im frontmatter                                  | Responsive Dateien lokal vorbereiten; Liste und Detailseite verwenden dieselben Varianten                      |
| Fragment-Bilder        | Markdown-Bilder, Referenzbilder oder HTML-`img` im Fragment | Unterstützte lokale Bilder nutzen dieselben persistenten responsiven Dateien für Liste und Startseitenvorschau |
| Freigabe-Vorschaubild  | `ogImage` des Beitrags oder `site.ogImage`                  | Eigene Freigabebild-Logik, nicht gleich Titelbild-Thumbnails                                                   |

## 1. Originale im Projekt ablegen

Ein Bild für nur einen Beitrag kann neben dessen Datei liegen:

```text
src/content/blog/zh/
  my-first-post.md
  photo.jpg
  cover.jpg
```

Für Fragments gilt dasselbe: Bilder können neben der Markdown-Datei liegen. Gemeinsam genutzte Bilder kannst du in `public/images/` ablegen:

```text
public/images/
  shared-photo.jpg
  fragments/
    my-photo.png
```

Erstelle fehlende Ordner bei Bedarf. Verwende einfache englische Namen, Zahlen und Bindestriche, um Verwechslungen bei Großschreibung zu vermeiden. URL-Pfade verwenden `/`, keine Computerpfade wie `C:\...` oder `D:\...` und keine Backslashes. Auf Systemen mit Beachtung der Großschreibung sind `Photo.jpg` und `photo.jpg` nicht unbedingt dieselbe Datei.

Erhalte die Originale. Die später erzeugten WebP-Dateien sind Anzeigevarianten, kein Ersatz-Backup.

## 2. Bilder in den Beitragstext einfügen

Füge an der gewünschten Stelle in Markdown ein:

```md
![这张照片里有什么](./photo.jpg)
```

`./photo.jpg` ist relativ zur aktuellen Beitragsdatei und verweist im obigen Beispiel auf die Datei daneben. Für public-Dateien schreibe:

```md
![这张照片里有什么](/images/shared-photo.jpg)
```

Das entspricht `public/images/shared-photo.jpg`. `public` gehört nicht in die URL. Der Text in eckigen Klammern ist der Alternativtext. Beschreibe den tatsächlichen Inhalt statt nur „Bild“ zu schreiben.

Normale Textbilder öffnen sich per Klick oder mit Fokus und Enter/Leertaste. Esc, Schließen oder Hintergrund schließen sie. Titelbilder und Bilder in Links oder Knöpfen nehmen nicht teil. Die Vergrößerung verwendet die bereits ausgewählte Browser-Quelle, lädt kein hochauflösenderes Original und ist keine Galerie.

`prepare-covers` komprimiert nicht automatisch jedes Textbild. Es verarbeitet den Titelbild-Quellpool, Titelbildreferenzen und lokale Fragment-Bilder. Normale public-Bilder im Artikeltext können weiterhin direkt das Original laden. Wähle passende Dateigrößen, besonders bei Screenshots mit mehreren MB.

## 3. Ein Artikel-Titelbild festlegen

Lege `cover.jpg` neben den Beitrag und ergänze oder ändere im vorhandenen frontmatter:

```yaml
heroImage: ./cover.jpg
```

`heroImage` ist optional und muss bei Verwendung auf eine lokale Bilddatei im Projekt zeigen, nicht auf eine HTTPS-URL. `/images/cover.jpg` ist hier keine public-URL-Schreibweise; die Regeln unterscheiden sich von Textbildern.

Für zentrale Verwaltung neuer Titelbilder kannst du `src/assets/blog/covers/originals/` verwenden. Liegt der Artikel unter `src/content/blog/zh/my-first-post.md` und das Original unter `src/assets/blog/covers/originals/my-cover.jpg`, schreibe:

```yaml
heroImage: ../../../assets/blog/covers/originals/my-cover.jpg
```

Das Titelbild wird nicht automatisch in den Text eingefügt. Es erscheint in Blog-/Taglisten und im Titelbildbereich der Detailseite. Das Layout kann sichtbare Bereiche zuschneiden, die erzeugten Bilddateien behalten jedoch ihr Seitenverhältnis. Der Prozess wählt keinen Personen- oder Motivfokus für dich.

`new-post` wählt automatische Titelbilder nur aus `src/assets/blog/default-covers/`. Ein Bild in `covers/originals/` wird dadurch nicht automatisch gewählt; verweise selbst darauf.

## 4. Bilder in Fragments verwenden

Bei `theme.fragments.enabled: false` überspringen dev, build und prepare-covers/doctor Bildverweise im Fragments-Inhalt. Nur über diese Verweise aufgenommene Bilder benötigen dann keine Originale oder Ableitungen. Artikel-Cover-Verweise und die Pools `src/assets/blog/default-covers/` und `src/assets/blog/covers/originals/` werden weiterhin vorbereitet und geprüft, auch bei ausschließlich für Fragments verwendeten Bildern. Dateien bleiben erhalten; erneutes Aktivieren setzt die Fragments-Verarbeitung fort.

**Versionshinweis:** Bildisolierung bei deaktivierten Fragments erfordert mindestens 0.36.1 und fehlt in 0.36.0. Setze dieses Verhalten in älteren Versionen nicht voraus.

Lege das Original unter `public/images/fragments/my-photo.png` ab und schreibe im vorhandenen Fragment:

```md
![这条碎片的配图说明](/images/fragments/my-photo.png)
```

Alternativ lege `photo.png` daneben und verwende `![配图说明](./photo.png)`. Nur das Ablegen eines Bilds in public startet keinen allgemeinen Bildbibliothek-Scan; es muss tatsächlich in einem Fragment referenziert sein.

Referenzbilder werden ebenfalls unterstützt:

```md
![配图说明][photo]

[photo]: /images/fragments/my-photo.png
```

Für manuelle Maße kannst du HTML nutzen:

```html
<img src="/images/fragments/my-photo.png" alt="配图说明" width="640" height="360" />
```

Die Maße sind Beispiele. Setze das tatsächliche Seitenverhältnis. Bei unterstützten lokalen Bildern ergänzt der Prozess fehlende Breite und Höhe. Vorhandene Maße bleiben bestehen; fehlt nur eine Dimension, wird sie aus dem Originalverhältnis berechnet. Falsche vorhandene Maße werden nicht automatisch korrigiert.

Das erste Bild jeder Fragment-Listenseite lädt standardmäßig bevorzugt, weitere Bilder und Startseiten-Thumbnails lazy. Die Startseite zeigt nur eine höhenbegrenzte Vorschau mit abgeschnittenem Überhang, keinen vollständigen Bildbetrachter. Ein Kartenklick führt zum Originalfragment. Erstellung, stabile IDs und Kommentare erklärt [Ein Fragment veröffentlichen](/de/blog/starter-guide-5-fragments/).

## 5. Responsive Dateien lokal vorbereiten

Nach der ersten Bildreferenz oder dem Ersetzen eines Originals starte im Projektstamm den lokalen Entwicklungsserver:

```bash
npm run dev
```

dev bereitet fehlende oder veraltete Dateien vor. Änderungen relevanter Quellen und Referenzen lösen Aktualisierungen aus. Lokales `npm run doctor` bereitet ebenfalls zuerst vor, prüft und baut dann. Wenn du nur Bilder vorbereiten willst, stoppe dev und führe aus:

```bash
npx @anglefeint/astro-theme prepare-covers
```

Für reine Prüfung ohne Nachgenerieren:

```bash
npx @anglefeint/astro-theme prepare-covers --check
```

Nicht jedes Mal werden alle Bilder neu kodiert. Hashes von Originalen, Verarbeitungsregeln und Ausgaben bestimmen die Wiederverwendung. Geänderte Originale aktualisieren ihre Varianten; einzelne fehlende oder veränderte Ausgaben werden gezielt repariert. Ändere Manifest oder generierte Dateinamen nicht von Hand und trage generierte URLs nicht in Beiträge ein.

Aktuelle Regeln:

- Statische Rasterbilder erzeugen WebP mit Qualität 80. Das ist ein verlustbehaftetes Kodierungsziel, keine Garantie identischer Pixel.
- Kandidatenbreiten sind 400, 640, 800, 960 und 1200px. Je nach Original bleiben passende Größen und nötigenfalls die Quellbreite bis 1200px. Kleine Bilder werden nicht vergrößert.
- EXIF-Ausrichtung wird berücksichtigt, das Seitenverhältnis bleibt erhalten. Es entstehen keine anders komponierten Zuschnitte.
- SVG und Mehrbild-Animationen behalten ihr Format. Ein GIF mit nur einem Bild kann statisch verarbeitet werden; die Erweiterung allein entscheidet nicht.
- Standard-Titelbildpool, originals-Pool und tatsächliche Referenzen definieren den Umfang. Nicht alle public-Bilder werden umgewandelt.

Der Browser wählt anhand von `srcset`, `sizes`, Bildschirm und Pixeldichte. Nutzer brauchen keine Größenordner zu pflegen. Da die größte Variante 1200px hat, sind auf großen Displays mit hoher Pixeldichte nicht immer Originaldetails garantiert.

## 6. Welche Dateien committen und wie bereitstellen?

Nach Vorbereitung liegen die Dateien hier:

```text
src/assets/blog/covers/
  originals/      # 如果使用这个原图目录
  manifest.json  # 来源、尺寸、规则与输出哈希
  generated/     # 持久响应式文件
```

Committe gemeinsam:

1. Artikel- oder Fragment-Markdown und neue oder ersetzte Originalbilder.
2. Das gesamte `src/assets/blog/covers/` mit Manifest und generierten Dateien.

Originale in public oder neben Artikeln musst du ebenfalls dort committen, nicht nur originals. Auch Fragment-Varianten liegen im Ordner blog/covers.

Stoppe vor Veröffentlichung dev und führe lokal `npm run doctor` aus. Danach kannst du mit `npm run preview` den Build ansehen. doctor enthält den Build bereits; ein sofortiger weiterer build ist unnötig. Die Hosting-Plattform verwendet weiterhin `npm run build` und das Ausgabeverzeichnis `dist`; veröffentliche dessen gesamten Inhalt.

**Deployment-Builds prüfen und kopieren vorbereitete responsive Dateien, erzeugen sie aber nicht neu.** Dasselbe gilt für doctor in CI. Fehlende, veraltete oder veränderte Varianten führen zu Fehlern. Bereite sie lokal vor, committe und veröffentliche erneut. Dieser persistente Bildablauf hängt nicht von einem erhaltenen Astro-Bildcache der Plattform ab.

Verwendete Varianten werden nach `_blog-covers/` im Build kopiert. Lade nicht nur HTML hoch und lasse diesen Ordner nicht aus. Alte ungenutzte generated-Dateien werden nicht automatisch entfernt. Prüfe Referenzen vor einer Bereinigung und lösche keine benötigten Originale.

Unterschiede der Felder erklären [heroImage und ogImage](/de/blog/config-article/#frontmatter) und die [Fragment-Vorschauregeln](/de/blog/config-fragments/#preview-and-links).

## 7. Welches Bild erscheint beim Teilen?

Ein Freigabebild gehört zur Linkvorschau und ist nicht das Titelbild der Seite.

Standardmäßig erzeugt der Build ein 1200×630-PNG aus Titel, Autor und Website-Name, ohne Bilddienst oder Browser. Baue und veröffentliche nach Änderungen erneut. `theme.footer.showCredits` steuert auch die Theme-Nennung auf automatisch erzeugten Freigabebildern, verändert aber keine hochgeladenen eigenen Bilder.

### Ein Freigabebild für einen Beitrag setzen

Lege `share.png` neben den Artikel und setze im frontmatter:

```yaml
ogImage: ./share.png
```

Oder verwende `public/images/share.png` mit `ogImage: /images/share.png`. Das Feld unterstützt auch direkte HTTPS-Bild-URLs. Relative lokale Bilder verarbeitet das Artikelschema; public-Pfade werden auf Existenz geprüft. Die Verfügbarkeit externer Bilder hängt vom fremden Server ab.

### Ein Standardbild für Seiten ohne eigenes Bild festlegen

Vereinige im vorhandenen obersten `site` von `src/site.config.ts`:

```ts
site: {
  ogImage: '/images/site-share.jpg',
},
```

Lege vorher die Datei unter `public/images/site-share.jpg` ab. `site.ogImage` unterstützt auch HTTPS-Bild-URLs. Fehlend oder leer verwendet es das integrierte 1200×630-Standardbild. Artikelrelative Pfade sind hier nicht erlaubt.

Die aktuelle Reihenfolge:

1. Ausdrücklich gesetztes `ogImage` des Beitrags.
2. Automatisches Artikel-Freigabebild, wenn aktiviert.
3. `heroImage` nach Deaktivierung von `theme.socialImage.enabled`.
4. `site.ogImage` bei Seiten ohne eigenes Bild, zuletzt das integrierte Standardbild.

Nur `site.ogImage` zu ändern ersetzt daher keine automatischen Artikelbilder. Fragments und ihre `#ID`-Links teilen das Website-Standardbild, ohne einzelne Karten pro Fragment.

Automatische Bilder liegen unter `dist/_social/`. Plattformen lesen die Metadaten der veröffentlichten Seite und können alte Bilder cachen. Eine neue lokale Vorschau bedeutet keine sofortige Aktualisierung dort.

## 8. Probleme systematisch prüfen

| Symptom                                              | Zuerst prüfen                                                                                                          |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Bild fehlt                                           | Existenz, Großschreibung und relativen Pfad ab aktueller Markdown-Datei; kein `public` in public-URLs                  |
| Titelbildvorbereitung scheitert                      | Ist `heroImage` eine lokale Projektdatei statt externer oder public-URL? Vollständiger Fehler im Terminal              |
| missing/stale/modified derivatives                   | dev stoppen, lokal prepare-covers ausführen, Originale, Manifest und generated committen, neu bauen                    |
| Bild in public erzeugt keine Größen                  | Wird es tatsächlich im Fragment referenziert? Normale public-Bilder im Beitragstext gehören nicht zu diesem Scan       |
| GIF oder SVG bleibt groß                             | Mehrbild- und Vektordateien bleiben im Original; der Befehl konvertiert keine Videos und komprimiert keine Animationen |
| Externes Fragment-Bild langsam oder mit Layoutsprung | Keine lokale Konvertierung oder automatische Ermittlung externer Maße; Quelle optimieren und korrekte Maße setzen      |
| Lokal vorhanden, veröffentlicht fehlend              | Sind Originale und generated committet, das gesamte dist bereitgestellt und Ressourcenpfade unverändert?               |
| Freigabebild veraltet                                | Neu gebaut und veröffentlicht? Hat ein Artikelbild Vorrang vor dem Website-Standard? Plattform-Cache?                  |

Bei eigenen Astro srcDir-/publicDir-Einstellungen oder Quellpfaden mit base verwende die dev-Vorbereitung dieses Projekts. Der eigenständige prepare-covers-Befehl verwendet Standardordner. Teilweise base-Unterstützung bei Bildern bedeutet nicht, dass das gesamte Theme beliebige Unterverzeichnis-Deployments unterstützt.

Installation und Updates erklärt [Blog installieren und eigene Angaben eintragen](/de/blog/starter-guide-1-configure-your-site/), Text und Beitragsfelder [Den ersten Beitrag schreiben](/de/blog/starter-guide-2-languages-and-routing/).

## Tutorial-Navigation und Konfiguration

[Zurück: Den ersten Beitrag schreiben](/de/blog/starter-guide-2-languages-and-routing/) · [Weiter: Ein Fragment veröffentlichen](/de/blog/starter-guide-5-fragments/) · [Alle acht Tutorials](/de/blog/starter-guide-1-configure-your-site/#tutorial-order).

Passende Felder: [Artikel-Titelbilder und Freigabebilder](/de/blog/config-article/), [Fragment-Bildvorschau](/de/blog/config-fragments/), [Website-Standardbild](/de/blog/config-site-chrome/). Vollständige Pfade, Vorgaben und Grenzen stehen im [Konfigurationsverzeichnis](/de/blog/config-reference/).
