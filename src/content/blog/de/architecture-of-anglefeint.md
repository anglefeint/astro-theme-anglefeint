---
title: 'Anglefeint-Architektur: vier Ebenen für Wartbarkeit und Wiederverwendung'
subtitle: ThemeFrame → Shell → Layout → Page
description: ThemeFrame → Shell → Layout → Page
pubDate: '2026-03-03'
heroImage: ../../../assets/blog/default-covers/ai-02.webp
aiModel: anglefeint-core
aiMode: analysis
aiState: stable
aiLatencyMs: 168
aiConfidence: 0.96
updatedDate: '2026-10-03'
---

Die Architektur stand vor der visuellen Ausarbeitung fest. Unklare Strukturen machen jede neue Funktion teurer.

- ThemeFrame: gemeinsamer Rahmen und globale Seitenhülle.
- Shell: Atmosphäre und visuelle Hülle einer Route.
- Layout: Zusammenstellung der Seitenstruktur.
- Page: Inhalte und Routendaten.

So können Stil und Inhalt unabhängig wachsen. Gemeinsame Implementierung liegt in @anglefeint/astro-theme, Inhalte und Konfiguration bleiben im Starter. Kompatible Änderungen lassen sich über das Paket aktualisieren, mit weniger manuellen Kopien und Konflikten.

site.config.ts bündelt die öffentlichen Einstellungen. Adapter bleiben generiert oder synchronisiert, damit Nutzer nicht verstreute Dateien durchsuchen müssen.

Das bringt schlanke Seiten, Verhalten nur dort, wo es gebraucht wird, geringe Kopplung zwischen Gestaltung, Routing und Inhalt sowie wiederverwendbare Bausteine für neue Seiten.

Kreativer Ausdruck an der Oberfläche und betriebliche Stabilität darunter machen ein Theme auch jenseits der Demo brauchbar.
