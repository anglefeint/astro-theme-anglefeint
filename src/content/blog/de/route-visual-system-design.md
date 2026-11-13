---
title: Visuelle Gestaltung nach Route
subtitle: Jede Lesestufe erhält ihre Atmosphäre.
description: Jede Lesestufe erhält ihre Atmosphäre.
pubDate: '2026-03-03'
heroImage: ../../../assets/blog/default-covers/cyber-02.webp
aiModel: anglefeint-core
aiMode: analysis
aiState: stable
updatedDate: '2026-11-14'
---

Jede Seite erfüllt eine andere Aufgabe:

- Startseite: Matrix für den ersten Eindruck.
- Blog List und Tags: Cyberpunk zum Entdecken.
- Artikel: AI für längeres Lesen.
- About: Hacker für Autor und Werkzeuge.
- Fragments: Cyberpunk zum Durchstöbern.
- Decoder Lab: lokale Werkzeuge mit Netzwerkhintergrund.

Standardmäßig hat die Startseite ein Sprachpräfix; `/` führt zur Startseite der Standardsprache, anfangs `/en/`. `defaultLocalePrefix: 'never'` ändert nur diese Startseite; andere Routen behalten ihre Präfixe.

About, Decoder, Tags und Fragments haben unabhängige Schalter. Fragments ist standardmäßig deaktiviert. Die Felder stehen im Lexikon.

Weiterlesen: [Anglefeint-Architektur: vier Ebenen für Wartbarkeit und Wiederverwendung](/de/blog/architecture-of-anglefeint/) · [Konfigurationsverzeichnis: Sprachen, Adressen und Fallback](/de/blog/config-languages/)
