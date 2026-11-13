---
tags: ['anglefeint', 'config']
title: 'Konfigurationsverzeichnis: Musikplayer'
subtitle: 'Playlist, Audioquellen, zugängliche Texte und Sitzungsfortsetzung.'
description: 'Alle Musik- und Spurfelder mit Vorgaben, Ladeverhalten, Grenzen und neunzehn Oberflächentexten.'
pubDate: '2026-11-13'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

Für das erste Lied lies [Musik einrichten](/de/blog/starter-guide-3-comments-about-and-theme-toggles/). Den Konfigurationsort erklärt [Installation und Website-Angaben](/de/blog/starter-guide-1-configure-your-site/), andere Module das [Gesamtverzeichnis](/de/blog/config-reference/).

Einstellungen liegen unter `theme.music` in `src/site.config.ts`. Standardmäßig ist der Player aus und die Liste leer, ohne mitgelieferte Lieder. Die folgenden Vorgaben stammen aus dem Theme-Paket, nicht der persönlichen Demo-Liste.

<a id="enabled"></a>

## theme.music.enabled: Player-Schalter

- **Typ / Standard:** boolean / false.
- **Status und Wirkung:** wirksam. Nur true und mindestens ein gültiges Lied lassen den öffentlichen Rahmen der Standardseiten den Player rendern.
- **Grenzen:** true ohne Spuren zeigt nichts. Deaktiviert gelangen Spuren nicht in die aktive Laufzeitliste und Einzelvalidierungen entfallen. Konfiguration und public-Audio werden nicht gelöscht; direkter Zugriff auf öffentliche Dateien bleibt möglich.
- **Beispiel:** `theme: { music: { enabled: false } }`.

Globaler Schalter, nicht pro Startseite oder Sprache. Standardseiten mit öffentlichem Rahmen teilen die Liste; Wiedergabe ist nicht auf die Startseite beschränkt. Eigene Seiten entscheiden selbst über diesen Rahmen.

<a id="tracks"></a>

## theme.music.tracks: Spurliste

- **Typ / Standard:** MusicTrack[] / []. Die drei Eintragsfelder folgen unten.
- **Status und Wirkung:** bedingt bei aktivierter Musik. Array-Reihenfolge bestimmt Liste und Wechsel, ohne öffentliche Höchstanzahl.
- **Grenzen:** Aktiv muss es ein Array sein. Leer ist gültig, deaktiviert aber den effektiven Player. Neue Arrays ersetzen vollständig statt alte Listen oder Vorgaben zu erweitern. Erhalte weiter benötigte Einträge.
- **Beispielwert:** [{ title: '我的一首歌', artist: '作者', src: '`/music/my-song.mp3`' }].

Titel, Künstler und Adresse liegen global hier, nicht in i18n. Sprachwechsel wechseln nicht automatisch die Liste. Playlist-Objekte oder Freigabelinks anderer Plattformen sind kein Ersatz für dieses Array.

<a id="track-fields"></a>

### Felder jeder Spur

Präfix: `theme.music.tracks[]`. „Keiner“ bedeutet keine automatisch ergänzten Werte eigener Einträge.

| Feld   | Typ / Standard                                       | Status, Wirkung und Grenzen                                                                                                                                                   | Beispiel             |
| ------ | ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| title  | string, Pflicht / keiner                             | Bedingt: Name im Hauptbereich, eingeklappten Titel und Playlist. Nichtleerer String; Rand-Leerraum wird entfernt. Leere Titel sind Fehler, kein Dateiname-/Metadaten-Fallback | '我的一首歌'         |
| artist | string, optional / nicht gesetzt, normalisiert zu '' | Bedingt: Künstlertext im Hauptbereich und in der Liste. Wenn gesetzt string; trimmt Rand-Leerraum. Kein Website-Autor oder Audio-Metadaten-Fallback                           | '作者'               |
| src    | string, Pflicht / keiner                             | Bedingt: Audioquelle mit einzelnem / oder kleinem https://, ohne Leerraum oder Backslash. HTTPS muss URL-parsebar sein; Existenz und Audioinhalt werden nicht geprüft         | '/music/my-song.mp3' |

title und artist sind Klartext ohne Markdown/HTML. Es gibt keine öffentlichen Felder für Cover, Lyrics, Dauer, Album, eigene ID oder Spurlautstärke.

Unterscheide src-Regeln:

- Lokale Dateien vorzugsweise in `public/music/` mit /music/Dateiname, ohne public-Präfix, Windows-Laufwerk oder src/assets-Quellpfad. Andere passende Wurzelpfade sind erlaubt; /music/ und Audio-Endungen werden nicht erzwungen.
- Nicht erlaubt: http://, //example.com/file.mp3, data:, blob: und gewöhnliche relative Pfade. HTTPS-Präfixe unterscheiden Großschreibung; verwende kleines https://.
- Keine direkten Leerzeichen. URL-kodiere Pfadteile bei Bedarf; korrektes Encoding garantiert keine vorhandene Datei. Keine Leerzeichen vor oder nach der URL.
- Wurzelpfade erhalten beim Rendern Astro BASE_URL. Ergänze denselben Unterpfad nicht doppelt. HTTPS bleibt unverändert.
- Gültiges Format bedeutet nur erfolgreiche Konfiguration. Der Browser muss die Datei unterstützen und erreichen. Plattform-Freigabeseiten sind keine direkten Audioquellen. Externe Quellen laden per fetch und müssen CORS für die Website erlauben. Abspielen in einem neuen Tab beweist keine CORS-Erlaubnis.

Der Player stellt gespeicherte Spuren per src wieder her. Verwende je Lied unterschiedliche Adressen. Doppelte src sind nicht verboten, aber Wiederherstellung trifft den ersten Eintrag. Der Titel ist kein Wiederherstellungsschlüssel.

<a id="example"></a>

## Playlist-Beispiel zum Vereinigen

Bereite `public/music/my-song.mp3` selbst vor. Der Beispielpfad erzeugt keine Audiodatei. Vereinige mit dem bestehenden `defineThemeConfig({...})` in `src/site.config.ts`, erhalte import, export und persönliche Einstellungen und lege theme nicht doppelt an.

```ts
theme: {
  music: {
    enabled: true,
    tracks: [
      {
        title: '我的一首歌',
        artist: '作者',
        src: '/music/my-song.mp3',
      },
    ],
  },
},
```

Zum Abschalten reicht `enabled: false`; die Liste muss nicht leer werden. Die Entwicklung muss Konfiguration neu lesen, online sind Build und Deployment nötig. Ein hochgeladenes Audio ohne tracks-Eintrag wird nicht automatisch aufgenommen.

<a id="music-messages"></a>

## messages.music: neunzehn Oberflächen- und zugängliche Texte

Präfix: `i18n.locales.<语言>.messages.music.`. Alle sind optionale **string** mit integrierter aktueller Sprache und Fallback-Kette. Die Tabelle zeigt vereinfachtes Chinesisch/Englisch, die Beispielspalte Feldwerte. Voraussetzung sind gerenderter Player und entsprechender Zustand. Leer überschreibt Text, verbirgt keine Funktion und kann zugängliche Namen entfernen.

| Feld       | Standard vereinfachtes Chinesisch / Englisch                                                                    | Wirkung und Grenzen                                                          | Beispiel                               |
| ---------- | --------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | -------------------------------------- |
| `label`    | 音乐播放器 / Music player                                                                                       | Zugänglicher Name des aside, nicht AUDIO CHANNEL oben                        | `"音乐播放器"`                         |
| `play`     | 播放 / Play                                                                                                     | Zugänglicher Abspielname; sichtbar bleibt PLAY                               | `"播放"`                               |
| `pause`    | 暂停 / Pause                                                                                                    | Zugänglicher Name während Spielen/Laden; sichtbar PAUSE                      | `"暂停"`                               |
| `prev`     | 上一首 / Previous                                                                                               | Zugänglicher Vorherige-Spur-Name; sichtbar PREV                              | `"上一首"`                             |
| `next`     | 下一首 / Next                                                                                                   | Zugänglicher Nächste-Spur-Name; sichtbar NEXT                                | `"下一首"`                             |
| `open`     | 展开播放器 / Open player                                                                                        | Zugänglicher Aufklappname; sichtbar OPEN                                     | `"展开播放器"`                         |
| `close`    | 收起播放器 / Collapse player                                                                                    | Zugänglicher Einklappname; sichtbar MIN. Einklappen pausiert nicht           | `"收起播放器"`                         |
| `progress` | 播放进度 / Progress                                                                                             | Zugänglicher Fortschrittsreglername; ändert keine Position oder Sprungspanne | `"播放进度"`                           |
| `volume`   | 音量 / Volume                                                                                                   | Zugänglicher Lautstärkereglername; setzt keine Startlautstärke. Sichtbar LVL | `"音量"`                               |
| `queue`    | 歌单 / Playlist                                                                                                 | Zugänglicher Playlist-Knopf; QUEUE, SHOW/HIDE sind fest                      | `"展开或收起歌单"`                     |
| `mute`     | 静音 / Mute                                                                                                     | Zugänglicher Stummschaltname bei Ton; sichtbar MUTE                          | `"静音"`                               |
| `unmute`   | 取消静音 / Unmute                                                                                               | Zugänglicher Wiederherstellungsname bei Lautstärke null; sichtbar UNMUTE     | `"恢复音量"`                           |
| `idle`     | 就绪 / Ready                                                                                                    | SIGNAL-Text anfangs oder nach Spurwechsel                                    | `"等待播放"`                           |
| `loading`  | 加载中 / Loading                                                                                                | SIGNAL während Download oder Warten                                          | `"正在加载歌曲"`                       |
| `playing`  | 播放中 / Playing                                                                                                | SIGNAL während Wiedergabe                                                    | `"正在播放"`                           |
| `paused`   | 已暂停 / Paused                                                                                                 | SIGNAL während Pause                                                         | `"已暂停"`                             |
| `blocked`  | 浏览器阻止了自动播放，请点击 PLAY 继续播放。 / Click Play to continue. Your browser blocked automatic playback. | Hinweis bei verweigerter Wiedergabe; Text hebt die Sperre nicht auf          | `"请点击播放以继续。"`                 |
| `error`    | 播放失败，请重试或切换歌曲。 / Unable to play. Try again or select another track.                               | Audioanfrage-/Wiedergabefehler und fehlgeschlagenes Mount-Modul              | `"歌曲未能加载，请重试。"`             |
| `noScript` | 请启用 JavaScript 使用播放器。 / Enable JavaScript to use the player.                                           | noscript-Hinweis ohne native Ersatz-Audiosteuerung                           | `"启用 JavaScript 后可以使用播放器。"` |

Das ist keine Ersetzung sämtlicher sichtbarer Terminal-UI-Texte. PLAY/PAUSE, PREV/NEXT, OPEN/MIN, MUTE/UNMUTE, QUEUE, SHOW/HIDE, TRACKS, LVL, AUDIO CHANNEL, STATE, SIGNAL und STANDBY sind implementierungsfest. Felder ändern zugängliche Namen oder sichtbare SIGNAL-Zustände. Englische Knopftexte beweisen nicht, dass ein Feld unwirksam ist.

Nur chinesische Lade- und Fehlerhinweise überschreiben:

```ts
i18n: {
  locales: {
    zh: {
      messages: {
        music: {
          loading: '正在加载歌曲',
          error: '歌曲未能加载，请重试。',
        },
      },
    },
  },
},
```

Sprachaktivierung und Fallback erklärt das [Sprachentutorial](/de/blog/starter-guide-languages/). Texte folgen der Sprache, das Spurarray bleibt global.

<a id="loading"></a>

## Wann lädt Audio, und warum entsteht Wartezeit?

Ohne gespeicherten Fortsetzungszustand startet die erste UI-Initialisierung keinen Audiodownload. Erst Abspielen, vorherige/nächste Spur oder Playlist-Auswahl fordert die Quelle an. Nur Panel oder Liste zu öffnen lädt nicht alle Lieder. Gespeicherte Tab-Fortsetzung kann dagegen eine Quelle automatisch anfordern.

Der Player lädt derzeit die vollständige Datei, erzeugt einen Blob und übergibt ihn an Audio. Es ist kein Streaming nach den ersten Bytes. Dadurch lässt sich heruntergeladenes Audio auch ohne Range-Unterstützung positionieren. Große Dateien erhöhen Startwartezeit und Speicherbedarf. Das Theme transkodiert oder komprimiert nicht und erzeugt keine Bitratenvarianten.

Erneutes Spielen nach Pause nutzt dieselbe Audioinstanz und denselben Blob. Spurwechsel bricht unvollständige Downloads ab und gibt alte Ressourcen frei. Zurückwechseln kann neu laden. HTTP-Caches von Server und Browser sind eine andere Ebene; der Player hält nicht dauerhaft alle Lieder vor. Fehler überspringen kein Lied automatisch. Wiederholen geht per Play. Verweigerte Browserrechte zeigen blocked und erfordern Benutzeraktion.

Externe Quellen brauchen CORS und erfolgreiche Antworten. Es gibt keine Proxy-, Authentifizierungsheader- oder eigene Credentials-Konfiguration. Gleichursprüngliche public-Audios brauchen keine zusätzliche Cross-Origin-Konfiguration. Hinweisänderungen reparieren keine Pfad-, Rechte- oder Formatprobleme.

<a id="runtime-state"></a>

## Wiedergabe, Fortsetzung und Aussehen: feste Grenzen

| Punkt              | Aktuelles Verhalten                                                                                                                                                                                      | site.config-Feld?                     |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| Startspur          | Erste ohne passenden gespeicherten Eintrag; Schlüssel ist aufgelöstes src                                                                                                                                | Nein, kein defaultTrack               |
| Startlautstärke    | Erst 0.5, danach gespeicherte Lautstärke desselben Tabs                                                                                                                                                  | Nein, kein defaultVolume              |
| Stumm              | Lautstärke null; Wiederherstellen nutzt letzte nichtnull Lautstärke, stoppt Download und Wiedergabe nicht                                                                                                | Nein, keine eigene mute-Konfiguration |
| Nächste Spur       | Nach Ende nächste, nach letzter erste, nicht zufällig                                                                                                                                                    | Nein, kein shuffle/repeat/loop        |
| Fortsetzen         | sessionStorage merkt Adresse, Position, Lautstärke, eingeklappten Zustand und Fortsetzungsabsicht. Versucht im selben Tab nach Navigation/Wiederherstellung weiterzuspielen, abhängig von Browserrechten | Nein, kein autoplay/resume            |
| Anfangszustand     | Standardkomponente eingeklappt; initiale Parameter schlagen gespeicherte Anzeigepräferenz. BFCache hat eigene Wiederherstellung                                                                          | Nein, kein theme.music.collapsed      |
| Panel und Playlist | Ändern nur UI, pausieren nicht; Escape klappt das Panel ein                                                                                                                                              | Nein, kein Shortcut-Feld              |
| Seitenstil         | Öffentlicher Rahmen wählt Matrix/Cyber/Hacker/AI oder Basis anhand der Seite, nicht des Liedtyps                                                                                                         | Nein, kein theme.music.scene          |
| Animation          | Matrix-eigene Effekte folgen Wiedergabe, Sichtbarkeit und Panelzustand sowie reduzierter Bewegung. Effektfehler sollen Audio nicht blockieren                                                            | Nein, kein Musik-Effektschalter       |

sessionStorage ist Sitzungszustand, keine dauerhafte Cloudaufzeichnung und keine Tab-Synchronisierung. Bei eingeschränktem Speicher funktioniert der Player weiterhin, ohne garantierte Wiederherstellung. Seitenwechsel sind nicht garantiert lückenlos. Ohne JavaScript erscheint noScript, Interaktionen fehlen.

Komponentenparameter wie `initiallyCollapsed`, `musicInitiallyCollapsed` und `scene` sind keine öffentlichen site.config-Felder. Ergänze sie nicht in `theme.music`. Standardseiten beginnen eingeklappt und lassen sich öffnen. Spur- und Titeltexte wechseln keine Atmosphäre automatisch.

Beide Musikfelder, drei Spurfelder und neunzehn Texte haben Verbraucher. Es gibt keine weiteren Kompatibilitäts- oder stillgelegten Felder zu setzen. Zugängliche Namen, festes Englisch und Sitzung wurden oben unterschieden. Weitere Module im [Gesamtverzeichnis](/de/blog/config-reference/).
