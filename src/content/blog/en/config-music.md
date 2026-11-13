---
tags: ['anglefeint', 'config']
title: 'Configuration Reference: Music Player'
subtitle: 'Enable music, configure tracks, audio paths and interface messages.'
description: 'Player switches, track types, defaults, loading and multilingual messages, including validation and session-resume limits.'
pubDate: '2026-11-13'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

To add a song first, see [music setup](/en/blog/starter-guide-3-comments-about-and-theme-toggles/). Configuration location is explained in [installation](/en/blog/starter-guide-1-configure-your-site/); other modules are in the [reference index](/en/blog/config-reference/).

Configure `theme.music` in `src/site.config.ts`. The package defaults to off with an empty playlist and no bundled tracks. These are package defaults, not the demo playlist.

<a id="enabled"></a>

## theme.music.enabled: player switch

- **Type / default:** boolean / false.
- **Status and purpose:** active. Standard shared layouts render the player only when enabled with at least one valid track.
- **Limits:** true without tracks does not show a player. Disabled music has no effective playlist and skips per-track validation. It does not delete config/public audio or prevent direct access to published files.
- **Example:** `theme: { music: { enabled: false } }`.

This is a global switch, not per-homepage/per-language. Standard shared-layout pages use one playlist; custom pages determine whether to use that framework.

<a id="tracks"></a>

## theme.music.tracks: playlist

- **Type / default:** MusicTrack[] / []. Three fields per entry appear below.
- **Status and purpose:** conditional on music being enabled; list and track changes follow array order. No public count limit.
- **Limits:** must be an array while enabled. Empty is valid but normalizes the effective player to off. Arrays replace rather than append to defaults/old playlists. Retain every wanted track when adding entries.
- **Example value:** [{ title: 'A song of mine', artist: 'Author', src: '`/music/my-song.mp3`' }].

Titles/artists/URLs belong to this global array, not localized messages. Switching page language does not change playlists. Third-party playlist objects/sharing URLs are not substitutes for this array.

<a id="track-fields"></a>

### Track fields

Full prefix: `theme.music.tracks[]`. “None” means no automatically supplied value for custom tracks.

| Field  | Type / default                            | Status, purpose and limits                                                                                                                                                           | Example value        |
| ------ | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------- |
| title  | string, required / none                   | Conditional: song name in main, collapsed and playlist views. Must be nonempty; trimmed. Blank names fail rather than using filename/audio metadata.                                 | 'A song of mine'     |
| artist | optional string / unset, normalized to '' | Conditional: artist in main view/playlist. Must be string if supplied; trimmed. Empty does not use site author or audio metadata.                                                    | 'Author'             |
| src    | string, required / none                   | Conditional: source must begin with a single / or lowercase https:// and contain no whitespace/backslashes. HTTPS must parse as a URL. File existence/audio content are not checked. | '/music/my-song.mp3' |

title/artist render as text without Markdown/HTML. There are no public cover, lyrics, duration, album, track-ID or per-track-volume fields.

Important src rules:

- Prefer `public/music/` and /music/filename URLs, without public, Windows disk or src/assets paths. Other valid root paths are accepted; /music/ and audio extensions are not mandatory validators.
- http://, //example.com/file.mp3, data:, blob: and ordinary relative paths are rejected. HTTPS prefix checks are case-sensitive; examples use lowercase https://.
- Literal spaces are invalid. URL-encode paths if needed, but valid encoding does not prove the file exists. Do not add surrounding whitespace.
- Root paths receive Astro BASE_URL at render time; do not duplicate deployment prefixes. HTTPS values remain unchanged.
- Valid configuration does not prove browser support/accessibility. Platform sharing pages are not direct audio. Remote fetch requires CORS; playback in a separate tab does not establish cross-origin readability.

Resume matches src, not title. Prefer distinct URLs. Duplicate src is not rejected, but restoring finds the first matching entry.

<a id="example"></a>

## Mergeable playlist example

Prepare `public/music/my-song.mp3` yourself; this is a sample path, not generated audio. Merge into existing `defineThemeConfig({...})` in `src/site.config.ts`, retaining imports/exports/other settings without duplicate theme objects.

```ts
theme: {
  music: {
    enabled: true,
    tracks: [
      {
        title: 'A song of mine',
        artist: 'Author',
        src: '/music/my-song.mp3',
      },
    ],
  },
},
```

Set `enabled: false` to stop the player without deleting tracks. Development configuration must reload; production must rebuild/deploy. Merely uploading an audio file does not register it in tracks.

<a id="music-messages"></a>

## messages.music: nineteen interface/accessibility messages

Full prefix: `i18n.locales.<locale>.messages.music.`. Each is an optional **string** using built-in language text/fallback. The table lists Simplified Chinese / English defaults and sample values. Effects require a rendered player and the relevant state/control. Empty text overrides messages rather than hiding functionality, and may remove useful accessible names.

| Field      | Simplified Chinese / English default                                                                            | Purpose and limits                                                                | Example value                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ---------------------------------------- |
| `label`    | 音乐播放器 / Music player                                                                                       | Player aside accessible name, not visible AUDIO CHANNEL text.                     | `"Music player"`                         |
| `play`     | 播放 / Play                                                                                                     | Play-button accessible name; visible label remains PLAY.                          | `"Play"`                                 |
| `pause`    | 暂停 / Pause                                                                                                    | Pause/loading accessible name; visible label PAUSE.                               | `"Pause"`                                |
| `prev`     | 上一首 / Previous                                                                                               | Previous-button accessible name; visible PREV.                                    | `"Previous"`                             |
| `next`     | 下一首 / Next                                                                                                   | Next-button accessible name; visible NEXT.                                        | `"Next"`                                 |
| `open`     | 展开播放器 / Open player                                                                                        | Collapsed open-button accessible name; visible OPEN.                              | `"Open player"`                          |
| `close`    | 收起播放器 / Collapse player                                                                                    | Expanded collapse-button accessible name; visible MIN. Collapsing does not pause. | `"Collapse player"`                      |
| `progress` | 播放进度 / Progress                                                                                             | Progress-slider accessible name; does not change seeking range.                   | `"Progress"`                             |
| `volume`   | 音量 / Volume                                                                                                   | Volume-slider accessible name; does not set initial volume. Visible label LVL.    | `"Volume"`                               |
| `queue`    | 歌单 / Playlist                                                                                                 | Playlist-toggle accessible name; QUEUE and SHOW/HIDE stay fixed.                  | `"Expand or collapse playlist"`          |
| `mute`     | 静音 / Mute                                                                                                     | Unmuted-state mute accessible name; visible MUTE.                                 | `"Mute"`                                 |
| `unmute`   | 取消静音 / Unmute                                                                                               | Zero-volume restore accessible name; visible UNMUTE.                              | `"Restore volume"`                       |
| `idle`     | 就绪 / Ready                                                                                                    | SIGNAL status at initialization/track changes.                                    | `"Waiting to play"`                      |
| `loading`  | 加载中 / Loading                                                                                                | SIGNAL status while downloading/waiting.                                          | `"Loading the song"`                     |
| `playing`  | 播放中 / Playing                                                                                                | SIGNAL status during playback.                                                    | `"Playing"`                              |
| `paused`   | 已暂停 / Paused                                                                                                 | SIGNAL status when paused.                                                        | `"Paused"`                               |
| `blocked`  | 浏览器阻止了自动播放，请点击 PLAY 继续播放。 / Click Play to continue. Your browser blocked automatic playback. | Browser playback-permission rejection; editing cannot remove the restriction.     | `"Press play to continue."`              |
| `error`    | 播放失败，请重试或切换歌曲。 / Unable to play. Try again or select another track.                               | Audio request/playback or player-module mounting failure.                         | `"The song could not load. Try again."`  |
| `noScript` | 请启用 JavaScript 使用播放器。 / Enable JavaScript to use the player.                                           | noscript notice without JavaScript; no alternative native audio controls.         | `"Enable JavaScript to use the player."` |

These are not replacements for every visible terminal-UI label. PLAY/PAUSE, PREV/NEXT, OPEN/MIN, MUTE/UNMUTE, QUEUE, SHOW/HIDE, TRACKS, LVL, AUDIO CHANNEL, STATE, SIGNAL and STANDBY are fixed implementation labels/codes. Configurable fields supply accessible names or visible SIGNAL statuses. A button remaining English does not mean its accessible-name field is unused.

For example, override only English loading/error messages:

```ts
i18n: {
  locales: {
    en: {
      messages: {
        music: {
          loading: 'Loading the song',
          error: 'The song could not load. Try again.',
        },
      },
    },
  },
},
```

See [languages](/en/blog/starter-guide-languages/) for enabling/fallback. Messages follow language; the playlist remains global.

<a id="loading"></a>

## When does audio download, and why can it take time?

On first use without saved resume state, UI initialization downloads no audio. Play, previous, next or playlist selection requests the chosen track. Expanding the panel/queue does not download all songs. Restoring the tab's playback state can request a track automatically.

The player downloads the full track into a Blob before handing it to Audio; it is not progressive streaming playback. Downloaded content supports seeking even if the server ignores Range. Large files increase initial delay/memory. The theme does not transcode, compress or create alternative bitrates.

Pause/resume reuses the current audio/Blob. Switching tracks aborts incomplete downloads and releases the previous resource; switching back may request it again. HTTP-cache reuse is separate from permanent player caching. Failure does not automatically skip the bad track; click play to retry. Browser permission rejection shows blocked and requires user action.

Remote downloads need successful responses and CORS. There are no proxy, authorization-header or custom-credential settings. Same-site public files need no cross-origin setup. Editing status messages does not fix paths, permissions or formats.

<a id="runtime-state"></a>

## Playback, resume and appearance: fixed behavior and boundaries

| Item                          | Current behavior                                                                                                                           | Public site.config field?               |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------- |
| Initial track                 | First track when no saved match; matching uses resolved src.                                                                               | No defaultTrack.                        |
| Initial volume                | Initially 0.5, then may restore tab-session volume.                                                                                        | No defaultVolume.                       |
| Mute                          | Sets volume to zero; restores remembered nonzero volume without stopping downloads/playback.                                               | No separate mute option.                |
| Automatic advance             | Next item on end, last wraps to first; not shuffle.                                                                                        | No shuffle/repeat/loop field.           |
| Resume                        | sessionStorage stores src, position, volume, collapsed state and resume intention; attempts same-tab resume subject to browser permission. | No autoplay/resume option.              |
| Initial panel state           | Standard player starts collapsed. Initial component parameters override saved visual preference; BFCache has separate restoration.         | No theme.music.collapsed.               |
| Collapse, expand and playlist | UI changes without pausing; Escape collapses an expanded panel.                                                                            | No site.config keyboard-shortcut field. |
| Page atmosphere               | Shared framework selects Matrix/Cyber/Hacker/AI/base by page, not music genre.                                                             | No theme.music.scene.                   |
| Animation                     | Matrix effects depend on playback, page visibility and collapse state, respecting reduced motion. Effect failure should not stop audio.    | No dedicated music-effect switch.       |

sessionStorage is session state, not permanent cloud storage or cross-tab synchronization. Playback can work without saving but cannot guarantee restoration or uninterrupted navigation. Without JavaScript, noScript appears and interaction is unavailable.

Component/layout parameters `initiallyCollapsed`, `musicInitiallyCollapsed` and `scene` are not public site.config fields. Adding them under `theme.music` has no effect. Standard pages start collapsed; users expand them. Track titles do not switch page atmosphere.

Both configuration fields, three track fields and nineteen messages have consumers. There are no extra compatibility/retired music settings to fill. Accessible labels, fixed English text and session state are distinguished above. Return to the [reference index](/en/blog/config-reference/).
