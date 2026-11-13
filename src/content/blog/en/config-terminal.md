---
tags: ['anglefeint', 'config']
title: 'Configuration Reference: Terminal Prompts and Read-Only Reader'
subtitle: 'Sixteen About terminal messages, placeholders and configuration boundaries.'
description: 'Types, defaults, placeholders, empty-value fallback and current usage of terminal text, including unused readerTitle.'
pubDate: '2026-11-13'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/hacker-01.webp'
---

For file location, see [installation and site identity](/en/blog/starter-guide-1-configure-your-site/); for content/tools, see [About](/en/blog/config-about/). Other modules are in the [reference index](/en/blog/config-reference/).

The standard site's interactive virtual terminal is hosted by About. These fields customize prompts, errors and read-only reader accessible names, without executing a local/server shell. The homepage widescreen author text uses messages.home.transmission, documented in [homepage configuration](/en/blog/config-home/#home-transmission), not this message group.

<a id="messages"></a>

## The sixteen messages.terminal fields

Full prefix: `i18n.locales.<locale>.messages.terminal`. Every field is an optional string override, defaulting to built-in language text and the ordinary fallback chain. The table lists Simplified Chinese / English defaults and sample field values. Effects require enabled About, initialized terminal and the corresponding command result/reader mode.

| Field           | Simplified Chinese / English default                                                                                                | Status, purpose and limits                                                                                                       | Example value                                                          |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `commandInput`  | 终端命令 / Terminal command                                                                                                         | Conditional: accessible name of the command input; neither the prompt path nor visible panel title.                              | `"Terminal input"`                                                     |
| `hint`          | 输入 help 开始探索。Tab 补全唯一路径，↑/↓ 查看历史命令。 / Type help to explore. Tab completes a unique path; ↑/↓ recalls commands. | Conditional: initialization hint. Startup also runs virtual pwd. Empty text clears the hint without disabling the terminal.      | `"Type help to see commands."`                                         |
| `help`          | 只读虚拟文件，不会在服务器执行命令。 / Read-only virtual files. No commands run on a server.                                        | Conditional: explanatory line in help; fixed command help follows. Empty text does not hide the full list.                       | `"Browse public articles read-only, without running system commands."` |
| `syntax`        | 引号或转义未结束。 / Unclosed quote or escape.                                                                                      | Conditional: unterminated quote/escape. Empty text falls back to the syntax key.                                                 | `"Unclosed quote or escape."`                                          |
| `usage`         | 用法：{value} / Usage: {value}                                                                                                      | Conditional: wrong argument count. {value} becomes usage text; empty text falls back to usage.                                   | `"Usage: {value}"`                                                     |
| `unknown`       | 不支持此命令：{value} / Command not supported: {value}                                                                              | Conditional: unsupported command. {value} becomes the command name. Text cannot add commands.                                    | `"Unsupported command: {value}"`                                       |
| `notFound`      | 文件或目录不存在：{value} / No such file or directory: {value}                                                                      | Conditional: missing virtual path. {value} is the requested path, not an HTTP status.                                            | `"Not found: {value}"`                                                 |
| `notDirectory`  | 不是目录：{value} / Not a directory: {value}                                                                                        | Conditional: cd target is not a directory; {value} is the target path.                                                           | `"Not a directory: {value}"`                                           |
| `isDirectory`   | 这是目录：{value} / Is a directory: {value}                                                                                         | Conditional: cat/vi/vim/view target is not a file; {value} is the target path.                                                   | `"Not a file: {value}"`                                                |
| `failed`        | 无法读取：{value} / Unable to read: {value}                                                                                         | Conditional: generic read failure; {value} is the path, without automatically appended original error details.                   | `"Unable to read: {value}"`                                            |
| `tooLarge`      | 文件超过阅读大小限制：{value} / File exceeds the reading limit: {value}                                                             | Conditional: file exceeds the read limit. {value} is its path; editing text does not raise the limit.                            | `"File too large: {value}"`                                            |
| `empty`         | （空目录） / (empty directory)                                                                                                      | Conditional: ls has no entries; not an empty-file-body notice.                                                                   | `"The directory is empty."`                                            |
| `loading`       | 正在读取… / Loading…                                                                                                                | Conditional: Canvas input-position message while a command is pending; empty falls back to ..., without changing network policy. | `"Loading…"`                                                           |
| `readerTitle`   | 文章阅读器 / Article reader                                                                                                         | Currently unused: types/default text remain, but reader title uses the file title or path. This cannot override it.              | `"Article reader"`                                                     |
| `readerHint`    | 只读 · 输入 :q 并回车退出 · Esc 关闭 / Read only · :q + Enter to exit · Esc to close                                                | Conditional: read-only reader hint. Empty falls back to :q; text does not change shortcuts or exit commands.                     | `"Read only · :q + Enter to exit · Esc to close"`                      |
| `readerCommand` | 阅读器命令 / Reader command                                                                                                         | Conditional: accessible name of the reader input; empty falls back to the terminal input name.                                   | `"Reader command input"`                                               |

<a id="placeholders"></a>

## {value} placeholders and empty strings

usage, unknown, notFound, notDirectory, isDirectory, failed and tooLarge use the literal {value} placeholder. Only its first occurrence is replaced. Keep it once to display a command/path; unsupported {path}/{command} names do not work. Replacement values render as text, not executable code.

There is no universal empty-string feature-disable rule. Those error fields and syntax fall back to their field keys when empty. loading falls back to ..., readerHint to :q, and readerCommand to the original input label. Empty hint/help/empty clear corresponding text without removing the terminal, fixed command help or directories.

readerTitle is unused, not a title-control switch. Its default string remaining in language packs does not establish a rendered effect.

<a id="example"></a>

## Mergeable English example

Merge into existing defineThemeConfig({...}) in src/site.config.ts, retaining other settings without duplicating i18n. Chinese-only overrides do not automatically change other languages; see [language fallback](/en/blog/config-languages/#fallback).

```ts
i18n: {
  locales: {
    en: {
      messages: {
        terminal: {
          commandInput: 'Terminal input',
          hint: 'Type help to see commands.',
          help: 'Browse public articles read-only, without running system commands.',
          usage: 'Usage: {value}',
          notFound: 'Not found: {value}',
          failed: 'Unable to read: {value}',
          tooLarge: 'File too large: {value}',
          readerHint: 'Read only · :q + Enter to exit · Esc to close',
          readerCommand: 'Reader command input',
        },
      },
    },
  },
},
```

<a id="shared-settings"></a>

## Other configuration used by the terminal

| Configuration                             | Terminal relationship                                                                                                    | Main reference                                                   |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| theme.enableAboutPage                     | boolean, default true. Disabling standard About also removes its terminal.                                               | [About switch](/en/blog/config-about/#page-enabled)              |
| `i18n.locales.<locale>.about.scriptsPath` | string, default /root/bash/scripts. Virtual path prefix/initial directory, not server storage.                           | [About tool settings](/en/blog/config-about/#tool-fields)        |
| `i18n.locales.<locale>.about.sections`    | Public biography contributes to virtual about.md, not command-error messages.                                            | [About body](/en/blog/config-about/#body-fields)                 |
| Current-language articles                 | Automatically populate the virtual filesystem; article JSON loads on demand, without manual registration in site.config. | [Writing posts](/en/blog/starter-guide-2-languages-and-routing/) |

About sidebar.allScripts and modals.allScripts.title rename tool entries/directory dialogs, not terminal commands. effects.backgroundLines is not an effective initial-hint override in an interactive session; see [About effect fields](/en/blog/config-about/#effect-fields) for its fallback-only status.

<a id="limits"></a>

## Fixed capabilities and limits, not site.config fields

- Virtual commands include help, clear, pwd, ls, cd, cat, vi, vim and view. About also handles open, close, minimize, maximize and restore window commands. Implementation determines available commands; changing help/unknown cannot add system commands.
- vi/vim/view open a read-only reader, not an editor. Enter :q, :q! or q and press Enter to exit; Esc also closes reading mode. readerHint changes only guidance.
- Default command input limit is 512 JavaScript UTF-16 code units, with 50 history entries. File reads default to 262,144 code units; excess gives tooLarge. Network responses have separate bounded-read protection; this is not an upload-size allowance.
- Articles load on demand from same-origin JSON. It is neither an arbitrary-URL downloader nor a local-directory reader. Virtual text files/directories need not trigger network requests.
- Font, colors, input/history/read limits may be internal component/function parameters, but have no public site.config paths. There is no API key setup, SSH, real shell or remote AI connection.

Reload development configuration after saving; rebuild/redeploy production. Trigger the relevant command/reader mode to check text rather than only looking at a static heading. In particular, readerTitle currently changes nothing. Return to the [reference index](/en/blog/config-reference/).
