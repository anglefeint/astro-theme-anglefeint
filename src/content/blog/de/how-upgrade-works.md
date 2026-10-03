---
title: 'Updates: mit dem Starter beginnen, später das Paket aktualisieren'
subtitle: Ein klarer Ablauf für Einrichtung und Wartung.
description: Ein klarer Ablauf für Einrichtung und Wartung.
pubDate: '2026-03-03'
updatedDate: '2026-10-03'
heroImage: ../../../assets/blog/default-covers/hacker-01.webp
aiModel: anglefeint-core
aiMode: analysis
aiState: stable
aiLatencyMs: 165
aiConfidence: 0.97
---

Beginne mit dem öffentlichen Template. Für kompatible Paketaktualisierungen nutze npm update @anglefeint/astro-theme und danach npm run doctor.

npm update bleibt im Bereich von package.json: ^0.5.1 umfasst 0.6.0 nicht. Lies die Versionshinweise und installiere bei Bedarf eine konkrete Version statt blind @latest. npm ls @anglefeint/astro-theme astro zeigt installierte Versionen.

Das Paket aktualisiert keine lokalen Einstellungen, Routen, Adapter oder Integrationen des Starters. Bei Strukturänderungen erstelle einen neuen Starter in einem anderen Ordner und übertrage Inhalte und persönliche Einstellungen. Neue Hilfsdateien nicht mit alten überschreiben.

doctor enthält bereits Prüfungen und Build. Danach npm run preview verwenden. npm run sync-adapters nur bei Abweichungen zwischen generierten Adaptern und lokalen Vorlagen ausführen; es lädt keine neuen Vorlagen herunter. Alte Projekte können andere Skripte haben.

Bei Astro-Hauptversionen zuerst die offizielle Migration befolgen. Weitere Hinweise stehen in der [Upgrade-Anleitung](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md).
