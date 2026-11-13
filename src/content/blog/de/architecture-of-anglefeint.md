---
title: 'Anglefeint-Architektur: vier Ebenen für Wartbarkeit und Wiederverwendung'
subtitle: ThemeFrame → Shell → Layout → Page
description: ThemeFrame → Shell → Layout → Page
pubDate: '2026-03-03'
heroImage: ../../../assets/blog/default-covers/ai-02.webp
aiModel: anglefeint-core
aiMode: analysis
aiState: stable
updatedDate: '2026-11-14'
---

Anglefeint kombiniert vier Aufgabenbereiche:

- ThemeFrame: gemeinsames Dokument, SEO, Navigation, Footer und Musik.
- Shell: seitenspezifische Stile und Hintergrund.
- Layout: Anordnung von Text, Titelbildern und ergänzenden Bereichen.
- Page: Inhalte und Konfiguration lesen, die Seite zusammensetzen.

Es ist keine Pflicht, auf jeder Seite dieselben vier Komponenten zu verschachteln. Gemeinsame Struktur sorgt für Konsistenz; Seiten behalten eigene Daten und Interaktionen.

Standardrouten, Vorgaben und Implementierung gehören zu `@anglefeint/astro-theme`. Der Starter behält Artikel, Medien, `src/site.config.ts`, eigene Seiten und Deployment-Einstellungen. Updates erfordern kein Kopieren von Standardseiten. Die Konfiguration hat einen Einstiegspunkt; Artikel und Fragments bleiben in ihren Inhaltsverzeichnissen.

Weiterlesen: [Visuelle Gestaltung nach Route](/de/blog/route-visual-system-design/) · [Konfigurationsverzeichnis: Website, Navigation, soziale Links und Fußzeile](/de/blog/config-site-chrome/)
