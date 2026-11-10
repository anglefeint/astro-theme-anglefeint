---
tags: ['anglefeint', 'starter']
title: 'Anleitung 4: Giscus-Kommentare einrichten'
description: 'Anleitung 4: Giscus-Kommentare einrichten'
pubDate: '2026-11-10'
updatedDate: '2026-11-10'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

Ergänze die folgenden `theme.comments`-Felder im bestehenden `defineThemeConfig({...})` in `src/site.config.ts`. Behalte andere Einstellungen und lege keine doppelten `theme`- oder `comments`-Schlüssel an.

`shareAcrossLocales: false` — `mapping: 'pathname'`

## Anleitung für Kommentare

Richte ein öffentliches Repository mit Discussions ein, installiere die App und hole die IDs von [giscus.app](https://giscus.app/).

```ts
theme: {
  comments: {
    enabled: true, repo: 'yourname/your-repository',
    repoId: 'REPLACE_WITH_REPO_ID', category: 'Announcements',
    categoryId: 'REPLACE_WITH_CATEGORY_ID', mapping: 'pathname', lang: '',
  },
},
```

Ersetze IDs und Kategorie. Kein Skript pro Beitrag nötig. Fehlende Pflichtfelder verhindern die Anzeige. lang: '' folgt der Beitragssprache: pt-br wird pt, zh-hant wird zh-TW und zh wird zh-CN. Standardmäßig ist Englisch fest eingestellt.

mapping: 'pathname' ordnet Diskussionen dem Pfad zu. 'specific' braucht term, 'number' eine positive Ganzzahl als Zeichenfolge in number. Ungültige Werte erzeugen Fehler. strict und reactionsEnabled verwenden '0' oder '1'. Bei Problemen IDs, Rechte, Verbindung und Browserblockaden prüfen.

## Kommentare zwischen Übersetzungen teilen

Kommentare und sprachübergreifendes Teilen sind standardmäßig aus. Für pfadbezogene Kommentare verwende die Einrichtung oben. Um eine Diskussion zwischen Übersetzungen zu teilen, behalte Repository und Kategorie und ersetze die Zuordnungsoptionen durch:

```ts
theme: {
  comments: {
    // Behalte deine Werte für enabled, repo, repoId, category und categoryId.
    shareAcrossLocales: true,
    mapping: 'specific',
    term: '',
    number: '',
    strict: '1',
    lang: '',
  },
},
```

Teilen erfordert mapping specific, leere term und number sowie strict als Zeichenfolge 1. Jeder Beitrag übergibt seinen vollständigen Slug ohne Sprachpräfix als data-term. Neun Übersetzungen nutzen cypherpunk-ideals-ai-and-the-future-of-crypto; guides/setup und other/setup bleiben getrennt. Ein fehlender Slug führt zu einem Fehler. Übersetzungen müssen denselben Slug verwenden. Ein leeres lang folgt der Seitensprache, ein expliziter Wert bleibt fest. Texte werden nicht übersetzt; Diskussion und Reaktionen werden geteilt.

Ohne Teilen bleiben eigene mapping-, term-, number- und strict-Werte unverändert: specific braucht ein nicht leeres term, number eine positive Ganzzahl als Zeichenfolge. Bei aktivierten Kommentaren und Teilen führen widersprüchliches mapping, nicht leere term/number oder strict ungleich 1 zu einem Konfigurationsfehler. Prüfe zwei Übersetzungen und einen anderen Beitrag. Schreiben erfordert GitHub-Autorisierung. Ergänze das bestehende comments-Objekt, ohne andere Einstellungen zu überschreiben.

Bestehende Diskussionen werden nicht automatisch zusammengeführt, verschoben oder gelöscht. Teilen kann eine andere Diskussion auswählen, in der alte Kommentare fehlen. Sichere vorher mapping, term, number und strict. Zum Wiederherstellen setze shareAcrossLocales: false und stelle die ursprünglichen Werte wieder her. Falls alte Kommentare übertragen werden sollen, prüfe und erledige das manuell auf GitHub; das Theme migriert sie nicht.

Aktualisiere einen bestehenden Integration-Starter zuerst auf eine Theme-Version mit dieser Option. Nach Konfigurationsänderungen neu bauen und veröffentlichen; prüfe Kommentare in der Produktionsvorschau.

```bash
npx @anglefeint/astro-theme@latest upgrade
npm run build
npm run preview
```

[← Anleitung 3](/de/blog/starter-guide-3-comments-about-and-theme-toggles/)
