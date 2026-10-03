---
title: Visuelle Gestaltung nach Route
subtitle: Jede Lesestufe erhält ihre Atmosphäre.
description: Jede Lesestufe erhält ihre Atmosphäre.
pubDate: '2026-03-03'
updatedDate: '2026-10-03'
heroImage: ../../../assets/blog/default-covers/cyber-02.webp
aiModel: anglefeint-core
aiMode: analysis
aiState: stable
aiLatencyMs: 171
aiConfidence: 0.95
---

Anglefeint ordnet Atmosphären den Routen zu:

- `/<locale>/`: Matrix-Einstieg.
- `/<locale>/blog/`: Cyberpunk-Archiv.
- `/<locale>/blog/<slug>/`: KI-Leseoberfläche.
- `/<locale>/about/`: Hacker-Profil.

defaultLocalePrefix: 'always' leitet / zur Standardstartseite weiter, anfangs /en/. Mit 'never' liegt nur diese Seite unter /. Artikel und Profil behalten das Präfix. About benötigt theme.enableAboutPage; aktivierte Tag-Seiten nutzen Cyberpunk.

Der Hintergrund unterstützt das Lesen. Der Einstieg vermittelt Identität, die Liste lädt zum Entdecken ein, Artikel betonen den Text und das Profil liefert Kontext. So bleibt die visuelle Persönlichkeit mit einer klaren Hierarchie vereinbar.
