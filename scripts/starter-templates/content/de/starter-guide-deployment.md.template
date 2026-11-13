---
tags: ['anglefeint', 'starter']
title: 'Anleitung 8: Den Blog auf der eigenen Domain veröffentlichen'
subtitle: 'Domain festlegen, statische Dateien prüfen und vollständig bereitstellen.'
description: 'Quellen, lokale Prüfung, Hosting, DNS, öffentliche Ausgaben, optionale KI-Ergänzungen und GA4.'
pubDate: '2026-11-13'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/ai-01.webp'
---

Dies ist Teil 8 von 8 der Einführung. [Reihenfolge aller Tutorials](/de/blog/starter-guide-1-configure-your-site/#tutorial-order) · [Konfiguration nach Feldern](/de/blog/config-reference/).

Wenn der Blog lokal läuft, besteht Veröffentlichung aus drei Aufgaben: endgültige Domain festlegen, vollständige statische Dateien erzeugen und sie vom Hosting unter dieser Domain ausliefern lassen. Das Theme kauft keine Domain, ändert kein DNS und meldet dich nicht automatisch bei Plattformen an.

Der Starter baut standardmäßig eine statische Website. In Produktion braucht Node.js nicht dauerhaft zu laufen, und ein SSR-Adapter ist dafür unnötig. Die Beispiele verwenden npm und das Standard-Ausgabeverzeichnis `dist/`.

## 1. Die endgültige Website-URL festlegen

Verwende eine eigene Domain, etwa `https://blog.example.com`. Vereinige im vorhandenen obersten `site` von `src/site.config.ts`:

```ts
site: {
  url: 'https://blog.example.com',
},
```

Trage die endgültige öffentliche Adresse ein, nicht localhost, einen Beitrag oder die Hosting-Konsole. Erhalte andere Website-Angaben.

Der Wert dient canonical, RSS, Sitemap, Freigabebildern und öffentlichen Inhaltslinks. Er ändert keine lokale Entwicklungsadresse und verbindet keine noch ungebundene Domain automatisch mit der Website.

### Alte Umgebungsüberschreibungen prüfen

`PUBLIC_SITE_URL` in `.env`, passenden `.env.*`-Dateien oder der Hosting-Build-Umgebung hat Vorrang. Bleibt nach site.url-Änderung die alte Domain, prüfe diese Stellen. Gewöhnliches dev nutzt development, gewöhnliches build production. Bei eigenem `--mode` gilt auch dessen Konfiguration; prüfe nicht nur `.env`.

Entferne unnötige Variablen und verwende site.url oder setze für getrennte Umgebungen jeweils korrekte Werte. Baue neu, statt nur einen Link im alten Ergebnis von Hand zu ändern.

### Im Domain-Stamm bereitstellen

Das Theme ist derzeit für `https://blog.example.com/` ausgelegt. Ein Unterpfad wie `https://example.com/my-blog/` benötigt zusätzliche Anpassungen. Allein Astro base zu setzen macht nicht alle Seiten und Ressourcen kompatibel.

Wähle Hosting mit Domain-Stamm, statischen Verzeichnis-index.html und echten Unterseitenpfaden. Verwende bei GitHub Pages bevorzugt Website-/Custom-Domain-Deployment; eine Anleitung für Projekt-Unterpfade belegt keine Unterstützung dieses Themes. Plattformdetails stehen in [Astros Deployment-Dokumentation](https://docs.astro.build/en/guides/deploy/) und den verlinkten Hosting-Anleitungen.

## 2. Quelldateien vollständig vorbereiten

Veröffentliche dein eigenes Blogprojekt und dessen Inhaltsbranch, nicht die Demo des Theme-Wartungsrepositorys als persönlichen Blog. Quellen brauchen mindestens Konfiguration, Inhalte, Abhängigkeitslisten und Ressourcen.

Normale Aufrufe von dev, build und doctor bereiten neue oder ersetzte Titel- und Fragment-Bilder automatisch vor. Committe diese Quelldateien:

- Artikel, Fragments, eigene Seiten und `src/site.config.ts`.
- Referenzierte Originale, public-Bilder, Symbole und tatsächlich benötigte Musik.
- Verwendete Originale unter `src/assets/blog/covers/originals/`. Manifest und generated-Dateien im Git werden zur Wiederverwendung empfohlen; fehlende Varianten werden automatisch erzeugt.
- `package.json`, `package-lock.json` sowie vorhandene Astro- und Hosting-Konfiguration.

Originale können neben Artikeln oder in public liegen und müssen dort ebenfalls committet werden, nicht nur originals. Details erklärt [Bilder hinzufügen](/de/blog/starter-guide-images/).

Normale Aufrufe von dev, build und doctor, auch in CI, verwenden korrekte Bildvarianten wieder und ergänzen oder reparieren fehlende, veraltete oder veränderte Dateien automatisch. Committe Inhalte und referenzierte Originalbilder. Das Committen von `src/assets/blog/covers/manifest.json` und `generated/` wird zur Wiederverwendung empfohlen, ist aber keine Voraussetzung für die automatische Vorbereitung. Fehlende Originale, unsichere Pfade und ungültige Eingaben führen weiterhin zu Fehlern. Dies setzt keinen erhaltenen Bildcache der Hosting-Plattform voraus.

**Versionshinweis:** Die automatische Bildvorbereitung bei normalen Builds und doctor in CI erfordert mindestens 0.36.2. Führe mit 0.36.1 zuerst dev oder `prepare-covers` aus, um Bildvarianten vorzubereiten. Explizites `prepare-covers --check` und Konfigurations-Sync bleiben schreibgeschützt.

Git-basierte Deployments brauchen weder node_modules noch `.astro` oder dist im Commit. Die Plattform installiert und baut selbst. Lade keine lokalen Abhängigkeitsordner als Website hoch. Nicht eingecheckte Umgebungswerte musst du auf der Plattform setzen. PUBLIC_-Werte sind öffentliche Website-Angaben und ungeeignet für geheime Zugangsdaten.

## 3. Den echten Build lokal prüfen

Stoppe dev mit Ctrl+C, wechsle in den Projektstamm und führe aus:

```bash
npm run doctor
npm run preview
```

Öffne die angezeigte preview-URL und prüfe Startseite, Beiträge, Bilder, Sprachmenü und Suche. Prüfe neue Sprachen und optionale Seiten ebenfalls. Externe Dienste wie Kommentare erfordern eine echte Browserverbindung; ein lokaler Build beweist keine Remote-Rechte.

Die Befehle haben unterschiedliche Aufgaben:

| Befehl            | Aufgabe                                                                                                             |
| ----------------- | ------------------------------------------------------------------------------------------------------------------- |
| `npm run dev`     | Lokale Entwicklung mit Bildvorbereitung, ohne fertigen Volltextindex                                                |
| `npm run doctor`  | Bilder vorbereiten (auch in CI), Astro prüfen und bauen; bei aktivem About auch dessen Laufzeitkonfiguration prüfen |
| `npm run check`   | Ruft im aktuellen Starter ebenfalls doctor auf; nicht direkt hintereinander nötig                                   |
| `npm run build`   | Bereitet Bildvarianten vor oder verwendet sie wieder und baut die Website                                           |
| `npm run preview` | Liefert vorhandenes dist aus, ohne Neubau oder Veröffentlichung                                                     |

Behebe Fehler vor Deployment und verwende kein Rest-dist. Nach erfolgreichem doctor ist der Build vorhanden; check und build musst du nicht unmittelbar wiederholen. Ctrl+C beendet preview.

## 4. Alle statischen Dateien bereitstellen

Du kannst ein Git-Repository mit Plattform-Build verbinden oder lokal bauen und hochladen. Beide liefern dieselbe statische Ausgabe.

### Variante 1: Hosting baut aus Git

Verbinde dein Repository und konfiguriere:

| Punkt         | Einstellung des aktuellen Starters                                              |
| ------------- | ------------------------------------------------------------------------------- |
| Build-Branch  | Der Branch mit deinen tatsächlichen Bloginhalten                                |
| Projektstamm  | Ordner mit der Blog-package.json, nicht zwingend der äußere Repository-Stamm    |
| Node.js       | Projekt- und Abhängigkeitsanforderungen erfüllen; Starter aktuell ab 22.12.0    |
| Installation  | Für npm `npm ci` mit eingecheckter, zu package.json passender package-lock.json |
| Build-Befehl  | `npm run build`                                                                 |
| Ausgabeordner | `dist` relativ zum Projektstamm                                                 |

Installiert die Plattform automatisch, füge keine zweite Installation hinzu. Verlangt sie ein vollständiges Skript, installiere vor build. Wiederhole nicht doctor, check und build. Automatische Varianten können fehlende Originale aus nicht erstellten Commits nicht wiederherstellen.

Framework-Preset, Branch und Installationsschritte richten sich nach der Plattform. Wähle statische Ausgabe; npm run dev und npm run preview sind keine Produktionsstartbefehle.

### Variante 2: Lokales Build-Ergebnis hochladen

Nach erfolgreichem doctor lade den gesamten Inhalt von `dist/` in den Website-Stamm des Hostings. Bei Ordnerauswahl wähle dist, bei Dateiupload dessen Inhalt, ohne zusätzliche dist-Pfadebene.

Neben HTML gehören `_astro/`, `_blog-covers/`, `_social/`, Suchindex und alle weiteren tatsächlichen Build-Dateien dazu. Unterstrichordner sind keine entbehrlichen temporären Dateien. Nur HTML führt zu fehlenden Stilen, Skripten, Bildern oder Suche.

Verwende beim erneuten Veröffentlichen vollständiges Deployment/Ersetzen. Nur neue Dateien zu überschreiben kann gelöschte Beiträge, alte Seiten und Sprachen erhalten. Lokales Markdown-Löschen entfernt kein manuell hochgeladenes altes HTML automatisch.

## 5. Domain im Hosting verbinden und DNS setzen

Füge zuerst die eigene Domain auf der Plattform hinzu. Übertrage dann deren tatsächliche DNS-Werte in die Domainverwaltung. Apex- und Subdomain-Einträge können unterschiedliche Typen und Ziele brauchen. Kopiere keine Beispiel-IP.

Warte auf bestätigte Domain und HTTPS-Zertifikat und öffne die öffentliche Adresse. Für mehrere Adressen wie Domain ohne Präfix und www wähle eine Hauptadresse und richte Hosting-Weiterleitungen der anderen ein. site.url enthält dieselbe Hauptadresse.

canonical ist Metadatum, keine Zugriffsweiterleitung. site.url erledigt weder DNS, Zertifikate noch Multi-Domain-Redirects. Nach Domainwechsel baue und veröffentliche neu und aktualisiere alte Umgebungswerte.

## 6. Seiten und öffentliche Ausgaben nach Veröffentlichung prüfen

Öffne einen direkten Artikellink auf der Domain und lade neu. Nur erfolgreiche Navigation von der Startseite beweist nicht alle Pfade. Prüfe Bilder, Codestile, Sprachwechsel und Suche. Nur in dev geprüfte Funktionen müssen auch im gebauten Ergebnis bestätigt werden.

Das Theme integriert diese statischen Ausgaben bereits; installiere keine zweite gleichartige Integration:

| Beispieladresse                                | Zweck                                                                     |
| ---------------------------------------------- | ------------------------------------------------------------------------- |
| `/robots.txt`                                  | Crawler-Regeln und Sitemap-Adresse, keine Zugriffskontrolle               |
| `/sitemap-index.xml`                           | Sitemap-Einstieg mit endgültiger Domain                                   |
| `/zh/rss.xml`                                  | Chinesischer Artikel-Feed, zh für andere aktive Sprachen ersetzen         |
| `/llms.txt`                                    | Gesamtindex KI-lesbarer Inhalte                                           |
| `/zh/llms.txt`、`/zh/llms-full.txt`            | Sprachindex und Volltextsammlung, falls exportierbare Inhalte existieren  |
| `/zh/blog/my-first-post/index.md`              | Öffentliche Markdown-Ausgabe des Beitrags; Beispiel-Slug ersetzen         |
| `/zh/fragments/index.md`、`/zh/about/index.md` | Öffentliche Inhalte bei aktivierter Seite und erfüllten Exportbedingungen |

Das Sitemap-Änderungsdatum nutzt updatedDate, sonst pubDate, statt bei jedem Build ein neues Datum zu erfinden. Deaktivierte Sprachen/Seiten erzeugen nicht zwingend Ausgaben. search: false macht Artikel nicht privat und verhindert andere öffentliche Exporte nicht.

KI-Exporte enthalten öffentliche Artikel sowie aktive Fragments- und About-Inhalte. Kommentare und dekorative Werkzeugoberflächen gehören nicht zum Text. Tatsächlich noindex gesetzte oder mit fremdem canonical versehene Seiten werden ausgeschlossen. Kollisionen mit Nutzerdateien stoppen den Build statt sie zu überschreiben. Exporte und Entdeckungslinks aktualisieren sich beim Build und müssen mit bereitgestellt werden.

Metadaten und Textausgaben helfen bei Entdeckung und Lesen, garantieren aber weder Suchmaschinenaufnahme noch KI-Zitate oder mehr Zugriffe.

### Hosting-Response-Header unterscheiden

Der Build ergänzt in dist/_headers `X-Robots-Tag: noindex` für `/:locale/terminal/*`, erhält bestehende Regeln und ändert public/_headers nicht. Unterstützende Hostingdienste wenden die Datei an; andere benötigen gleichwertige Header-Konfiguration.

Astro preview simuliert _headers-Regeln nicht. Prüfe echte Serverantworten für deren Wirkung; eine vorhandene lokale Datei genügt nicht. Ein Node-Server ist dafür unnötig.

Domain- und Umgebungsprioritäten stehen im [Website-Verzeichnis](/de/blog/config-site-chrome/#environment), öffentliche Ergänzungen im [GA4-/KI-Verzeichnis](/de/blog/config-analytics-ai/#supplement).

## 7. Öffentliche KI-Lesehinweise bei Bedarf ergänzen

Normales Veröffentlichen braucht dies nicht. Für Website-Hintergrund oder zusätzliche Quellen vereinige auf oberster Ebene:

```ts
aiReadableContent: {
  notes: 'Diese Website dokumentiert meinen Lernprozess. Inhalte können überarbeitet werden.',
  links: [{ label: 'Projektseite', href: 'https://example.com/project' }],
},
```

notes unterstützt Markdown; links braucht label und href je Eintrag. Verwende öffentliche HTTP(S)-Ziele; relative Angaben einschließlich Wurzelpfaden werden gegen die Website-Adresse aufgelöst. Es ist öffentliche Ergänzung, kein Ersatz des Artikeltexts und keine Privatsphäre-Einschränkung.

Sprachwerte stehen in `i18n.locales.<Sprachcode>.aiReadableContent`. Für eigene chinesische Notizen ohne Zusatzlinks:

```ts
i18n: {
  locales: {
    zh: {
      aiReadableContent: {
        notes: '中文内容是作者自己的学习笔记。',
        links: [],
      },
    },
  },
},
```

Fehlende Felder erben globale Werte; notes: '' oder links: [] verbergen den jeweiligen Teil ausdrücklich. Die Angaben gelangen in Indizes, Volltextsammlungen und einzelne Markdown-Dateien. Prüfe vorab, ob sie öffentlich sein dürfen, und baue nach Änderungen neu.

## 8. GA4 bei Bedarf aktivieren

Standardmäßig lädt kein Google-Statistikskript. Hole bei Bedarf eine Measurement ID mit G- aus dem Web-Datenstream von Google Analytics, siehe [Google-Hilfe](https://support.google.com/analytics/answer/9539598). Das Theme akzeptiert nur G-IDs, keine numerischen Property-IDs, GTM-Container oder andere Kennungen.

Vereinige auf oberster Ebene neben site:

```ts
analytics: {
  googleAnalyticsId: 'G-XXXXXXXXXX',
},
```

Setze die echte ID; leer deaktiviert. Falsche Formate verursachen Konfigurationsfehler. Eine ID erfasst alle Sprachen, die du nach Pfad unterscheiden kannst. Kein Skript pro Sprache oder Atmosphäre nötig.

Der Loader erscheint nur im Produktionsbuild mit ID, nicht in dev. Bei localhost, dessen Subdomains und lokalen Loopback-Adressen überspringt er Meldungen. Produktionsbuilds unter LAN-IP oder Remote-Vorschau können dagegen melden. Nicht jede preview ist ausgeschlossen.

Prüfe nach neuem Deployment unter der öffentlichen Adresse die GA4-Echtzeitberichte. Blocker, Netzwerk und Dienstkonfiguration können Daten verhindern. Installiere Statistik nicht zusätzlich per Hand, GTM oder anderen Injektoren doppelt. Ein Zustimmungsmanagement ist nicht enthalten; integriere es bei Bedarf selbst.

## 9. Deployment-Fehler und falsche Online-Ergebnisse

| Symptom                              | Zuerst prüfen                                                                                          |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| npm ci scheitert                     | Node-/Paketanforderungen und eingecheckte, passende package-lock                                       |
| Bilder missing/stale/modified        | build repariert Varianten; bei Fehlern committete Originale, sichere Pfade und gültige Eingaben prüfen |
| Build erfolgreich, Seite 404         | Ausgabeordner, Branch, Stamm und index-Unterstützung; nicht angepasster Unterpfad?                     |
| Startseite geht, Artikel-Reload 404  | Echte statische Unterpfade, nur Startseite bereitgestellt oder falscher SPA-Fallback?                  |
| Stile, Bilder oder Suche fehlen      | Gesamtes dist mit Ressourcenordnern bereitgestellt, keine Pfadumschreibung?                            |
| canonical/RSS zeigt Beispieldomain   | site.url, PUBLIC_SITE_URL, Modus-Umgebung und neuer Build/Deployment                                   |
| Online trotz Änderungen unverändert  | Richtiges Projekt, Branch und neuester Commit statt nur lokaler Änderung?                              |
| Gelöschter Artikel bleibt erreichbar | Alte Deployment-Dateien oder Caches; vollständiges Ersetzen und Hosting-Cache prüfen                   |
| Keine GA4-Daten                      | Echte G-ID, Produktionsbuild, nichtlokale Adresse und nicht blockiertes Skript?                        |

Der tägliche Ablauf bleibt „lokal bearbeiten und vorbereiten → prüfen und Vorschau → Quellen committen → bauen und bereitstellen“. Upgrades erklärt das [Installationstutorial](/de/blog/starter-guide-1-configure-your-site/), Sprachpfade [Teil 7](/de/blog/starter-guide-languages/).

## Tutorial-Navigation und Konfiguration

Damit ist die erste Veröffentlichung abgeschlossen. Spätere Änderungen findest du im passenden Tutorial oder Konfigurationsverzeichnis.

[Zurück: Weitere Sprachen](/de/blog/starter-guide-languages/) · [Alle acht Tutorials](/de/blog/starter-guide-1-configure-your-site/#tutorial-order).

Passende Felder: [Domain und Umgebungswerte](/de/blog/config-site-chrome/), [GA4 und KI-Ergänzungen](/de/blog/config-analytics-ai/), [Suchressourcen](/de/blog/config-search/). Vollständige Pfade, Vorgaben und Grenzen stehen im [Konfigurationsverzeichnis](/de/blog/config-reference/).
