---
tags: ['anglefeint', 'config']
title: 'Konfigurationsverzeichnis: virtuelles Terminal'
subtitle: 'Befehlshinweise, Fehlertexte und schreibgeschützter Artikelreader.'
description: 'Alle Terminaltexte mit Typen, Vorgaben, Platzhaltern, ungenutzten Feldern und festen Grenzen.'
pubDate: '2026-11-13'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/hacker-01.webp'
---

Den Konfigurationsort erklärt [Installation und Website-Angaben](/de/blog/starter-guide-1-configure-your-site/), Inhalte und Werkzeuge das [About-Verzeichnis](/de/blog/config-about/). Andere Module findest du im [Gesamtverzeichnis](/de/blog/config-reference/).

Das interaktive virtuelle Terminal liegt auf der Standardwebsite in About. Hier änderst du Befehls-, Fehler- und zugängliche Reader-Texte. Es führt keine lokale oder Server-Shell aus. Der Autorentext im Breitbild-Terminal der Startseite gehört dagegen zu messages.home.transmission, siehe [Startseite](/de/blog/config-home/#home-transmission).

<a id="messages"></a>

## Die sechzehn Felder von messages.terminal

Vollständiger Präfix: `i18n.locales.<语言>.messages.terminal`. Jedes Feld ist eine optionale string-Überschreibung mit integriertem Sprachtext und gewöhnlicher Fallback-Kette. Die Tabelle zeigt nur Vorgaben für vereinfachtes Chinesisch/Englisch; Beispiele sind Feldwerte. Wirksamkeit verlangt aktives About, erfolgreiche Terminalinitialisierung und den jeweiligen Befehlszustand oder Lesemodus.

| Feld            | Standard vereinfachtes Chinesisch / Englisch                                                                                        | Status, Wirkung und Grenzen                                                                                                     | Beispiel                               |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `commandInput`  | 终端命令 / Terminal command                                                                                                         | Bedingt: zugänglicher Eingabename, weder Prompt-Pfad noch sichtbarer Paneltitel                                                 | `"终端输入"`                           |
| `hint`          | 输入 help 开始探索。Tab 补全唯一路径，↑/↓ 查看历史命令。 / Type help to explore. Tab completes a unique path; ↑/↓ recalls commands. | Bedingt: Initialisierungshinweis; Start führt auch virtuelles pwd aus. Leer leert nur den Hinweis                               | `"输入 help 查看命令。"`               |
| `help`          | 只读虚拟文件，不会在服务器执行命令。 / Read-only virtual files. No commands run on a server.                                        | Bedingt: Erklärungszeile von help; feste Befehlshilfe folgt weiterhin. Leer verbirgt nicht die ganze Liste                      | `"只读浏览公开文章，不运行系统命令。"` |
| `syntax`        | 引号或转义未结束。 / Unclosed quote or escape.                                                                                      | Bedingt: offene Anführungszeichen oder Escape; leer fällt auf Schlüssel syntax zurück                                           | `"引号或转义未结束。"`                 |
| `usage`         | 用法：{value} / Usage: {value}                                                                                                      | Bedingt: falsche Argumentanzahl; {value} wird Befehlssyntax, leer fällt auf usage zurück                                        | `"用法：{value}"`                      |
| `unknown`       | 不支持此命令：{value} / Command not supported: {value}                                                                              | Bedingt: nicht unterstützter Befehl; {value} ist dessen Name. Texte erzeugen keine Befehle                                      | `"不支持命令：{value}"`                |
| `notFound`      | 文件或目录不存在：{value} / No such file or directory: {value}                                                                      | Bedingt: virtuelle Datei/Verzeichnis fehlt; {value} ist der angefragte Pfad, kein HTTP-Status                                   | `"未找到：{value}"`                    |
| `notDirectory`  | 不是目录：{value} / Not a directory: {value}                                                                                        | Bedingt: cd-Ziel ist kein Verzeichnis; {value} ist der Zielpfad                                                                 | `"不是目录：{value}"`                  |
| `isDirectory`   | 这是目录：{value} / Is a directory: {value}                                                                                         | Bedingt: cat/vi/vim/view-Ziel ist keine Datei; {value} ist der Zielpfad                                                         | `"目标不是文件：{value}"`              |
| `failed`        | 无法读取：{value} / Unable to read: {value}                                                                                         | Bedingt: allgemeiner Lesefehler; {value} ist der Pfad. Ursprüngliche Fehlerdetails werden nicht angehängt                       | `"读取失败：{value}"`                  |
| `tooLarge`      | 文件超过阅读大小限制：{value} / File exceeds the reading limit: {value}                                                             | Bedingt: Datei überschreitet Leselimit; {value} ist der Pfad. Ändert nur Text, nicht das Limit                                  | `"文件过大：{value}"`                  |
| `empty`         | （空目录） / (empty directory)                                                                                                      | Bedingt: ls hat keine Einträge; kein Hinweis für leeren Dateiinhalt                                                             | `"目录为空。"`                         |
| `loading`       | 正在读取… / Loading…                                                                                                                | Bedingt: Canvas-Eingabe während Ausführung; leer fällt auf ... zurück, keine andere Ladestrategie                               | `"正在读取…"`                          |
| `readerTitle`   | 文章阅读器 / Article reader                                                                                                         | Derzeit ungenutzt: Typ und Sprachwerte bleiben, tatsächlicher Titel ist Datei-title oder path. Überschreibt den Lesetitel nicht | `"文章阅读器"`                         |
| `readerHint`    | 只读 · 输入 :q 并回车退出 · Esc 关闭 / Read only · :q + Enter to exit · Esc to close                                                | Bedingt: Reader-Hinweis; leer fällt auf :q zurück. Ändert keine Befehle oder Tastenkürzel                                       | `"只读 · :q 回车退出 · Esc 关闭"`      |
| `readerCommand` | 阅读器命令 / Reader command                                                                                                         | Bedingt: zugänglicher Reader-Eingabename; leer fällt auf den ursprünglichen Terminalnamen zurück                                | `"阅读器命令输入"`                     |

<a id="placeholders"></a>

## Platzhalter {value} und leere Strings

usage, unknown, notFound, notDirectory, isDirectory, failed und tooLarge verwenden den wörtlichen Platzhalter {value}. Das Skript ersetzt nur die erste Stelle. Erhalte eine für Befehl oder Pfad; {path} und {command} sind nicht unterstützt. Ersetzungen bleiben Text und werden nicht ausgeführt.

Es gibt keine gemeinsame Regel „leer deaktiviert“. Die genannten Befehlsfehler und syntax fallen bei leer auf ihren Schlüssel zurück; loading auf ..., readerHint auf :q und readerCommand auf den bisherigen Eingabenamen. hint, help und empty können ihren Text leeren, entfernen aber weder Terminal noch feste Hilfe oder Verzeichnisse.

readerTitle ist ungenutzt, kein Schalter für den sichtbaren Lesetitel. Seine integrierte Zeichenfolge hat derzeit keinen Verbraucher.

<a id="example"></a>

## Chinesisches Beispiel zum Vereinigen

Vereinige mit dem vorhandenen defineThemeConfig({...}) in src/site.config.ts. Erhalte andere Werte und lege i18n nicht doppelt an. Nur chinesische Überschreibungen ändern andere Sprachen nicht automatisch. Fallbacks erklärt das [Sprachenverzeichnis](/de/blog/config-languages/#fallback).

```ts
i18n: {
  locales: {
    zh: {
      messages: {
        terminal: {
          commandInput: '终端输入',
          hint: '输入 help 查看命令。',
          help: '只读浏览公开文章，不运行系统命令。',
          usage: '用法：{value}',
          notFound: '未找到：{value}',
          failed: '读取失败：{value}',
          tooLarge: '文件过大：{value}',
          readerHint: '只读 · :q 回车退出 · Esc 关闭',
          readerCommand: '阅读器命令输入',
        },
      },
    },
  },
},
```

<a id="shared-settings"></a>

## Welche weiteren Einstellungen nutzt das Terminal?

| Konfiguration                           | Wirkung im Terminal                                                                                                               | Hauptbeschreibung                                                     |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| theme.enableAboutPage                   | boolean, Standard true; ohne Standard-About auch kein Terminal dieser Seite                                                       | [About-Schalter](/de/blog/config-about/#page-enabled)                 |
| `i18n.locales.<语言>.about.scriptsPath` | string, Standard /root/bash/scripts; virtueller Präfix und Startordner, kein Serverlaufwerk                                       | [About-Werkzeuge](/de/blog/config-about/#tool-fields)                 |
| `i18n.locales.<语言>.about.sections`    | Öffentliche Vorstellung wird Teil von virtuellem about.md, keine Terminalfehlertexte                                              | [About-Text](/de/blog/config-about/#body-fields)                      |
| Artikel der aktuellen Sprache           | Automatisch im virtuellen Verzeichnis; laden bei Bedarf generiertes Artikel-JSON ohne manuelle Einzelregistrierung in site.config | [Beiträge schreiben](/de/blog/starter-guide-2-languages-and-routing/) |

About-sidebar.allScripts und modals.allScripts.title ändern nur Werkzeugeinstieg und Verzeichnisdialog, keine Terminalbefehle. effects.backgroundLines ersetzt in der aktuellen interaktiven session den Starthinweis nicht wirksam. Details zum Fallback stehen unter [About-Effekte](/de/blog/config-about/#effect-fields).

<a id="limits"></a>

## Feste Fähigkeiten und Grenzen, keine site.config-Felder

- Virtuelle Befehle umfassen help, clear, pwd, ls, cd, cat, vi, vim und view. About ergänzt open, close, minimize, maximize und restore. Die Implementierung legt sie fest; help- oder unknown-Texte fügen keine Systembefehle hinzu.
- vi/vim/view öffnen einen schreibgeschützten Reader, keinen Editor. :q, :q! oder q mit Enter beendet ihn; Esc schließt ebenfalls. readerHint ändert nur den Hinweis.
- Befehle erlauben standardmäßig höchstens 512 JavaScript-UTF-16-Codeeinheiten, die Historie 50 Einträge. Dateilesen erlaubt 262.144 Codeeinheiten; darüber erscheint tooLarge. Netzwerkantworten besitzen zusätzliche begrenzte Leseabsicherung. Das ist kein Upload-Dateigrößenlimit.
- Artikel-JSON lädt bei Bedarf von derselben Herkunft. Das Terminal ist kein Downloader beliebiger URLs und liest keine beliebigen lokalen Verzeichnisse. Virtuelle Klartextdateien und Verzeichnisse benötigen nicht unbedingt Netzwerkanfragen.
- Schriftgröße, Farbe, Font, Eingabelimit, Historienlänge und Leselimit sind interne Parameter ohne öffentliche site.config-Pfade. Es gibt keinen API Key und keine Verbindung zu SSH, echter Shell oder Remote-KI.

Lade nach dem Speichern die Entwicklungskonfiguration neu und baue/veröffentliche die öffentliche Website erneut. Löse zum Prüfen die jeweiligen Befehle oder den Lesemodus aus; der statische Seitentitel genügt nicht. Insbesondere readerTitle verändert aktuell nichts. Zurück zum [Gesamtverzeichnis](/de/blog/config-reference/).
