---
tags: ['anglefeint', 'config']
title: 'Configuration Reference: About'
subtitle: 'Profile content, contact links, tool panels, window controls and current compatibility fields.'
description: 'Types, defaults, examples and limitations for About content and messages, including unused legacy decoder labels and fallback-only fields.'
pubDate: '2026-11-13'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/hacker-01.webp'
---

To replace your introduction, start with [Customize pages and features](/en/blog/starter-guide-3-comments-about-and-theme-toggles/). For installation and the config location, see the [first tutorial](/en/blog/starter-guide-1-configure-your-site/). Other modules are in the [configuration index](/en/blog/config-reference/).

About does not read its body from a Markdown article. Content lives in `i18n.locales.<locale>.about` in `src/site.config.ts`; page and section headings live in that language's `messages.about`. Defaults below are package defaults, not the demo author's profile.

<a id="page-enabled"></a>

## theme.enableAboutPage: page switch

- **Type / default:** boolean / true.
- **Status and purpose:** Active. Generates `/<locale>/about/` for enabled languages. Disabling removes the standard About route and its destinations from public navigation and Contact entries.
- **Limits:** Does not hide a single paragraph or delete configuration. Direct visits to a disabled page do not redirect home. Rebuild and redeploy; disabling does not guarantee deletion of old deployment files or published data.
- **Example:** `theme: { enableAboutPage: false }`.

<a id="about-content"></a>

## About content and tool fields

All fields below use **`i18n.locales.<locale>.about.`**. For example, `sections.who` means `i18n.locales.en.about.sections.who`. Types describe optional input overrides before merging. Omitted values resolve through language fallback and package defaults. zh / en About defaults currently share the same English placeholder object, so one default is shown for both. Other languages may have separate translations; do not infer their defaults from these English values.

Strings have no universal length or URL-format validation: enter suitable short text, valid email addresses or links. Arrays must be string[] and replace the whole array rather than merging individual elements. Empty strings are not a general off switch; see each row. Example values belong at the matching object level.

<a id="body-fields"></a>

### Body

| Field                  | Type     | Simplified Chinese / English defaults                                                                | Status, purpose and limits                                                             | Example value                                                   |
| ---------------------- | -------- | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `metaLine`             | string   | `"$ profile booted \| mode: builder"`                                                                | Active: status line above the title; an empty string hides this line.                  | `"profile ready"`                                               |
| `sections.who`         | string   | `"Write a short introduction about yourself, your background, and your primary focus areas."`        | Active: Who paragraph body, without renaming the section.                              | `"I am a frontend developer."`                                  |
| `sections.what`        | string   | `"Describe what you build, your core skills, and the kinds of projects you want to be known for."`   | Active: What paragraph body.                                                           | `"I build my personal blog and open-source tools."`             |
| `sections.ethos`       | string[] | See [array defaults](#array-defaults): sections.ethos                                                | Active: one principle per array entry. An empty array clears entries, not the heading. | `["Make it clear first.","Ship small improvements regularly."]` |
| `sections.now`         | string   | `"Share what you are currently building, shipping, or learning."`                                    | Active: Now paragraph body.                                                            | `"I am currently learning Astro."`                              |
| `sections.contactLead` | string   | `"Add a short collaboration note (for example: open to freelance, consulting, or full-time roles)."` | Active: start of the contact paragraph, joined with following labels and links.        | `"Feel free to get in touch."`                                  |
| `sections.signature`   | string   | `"> Replace with your own signature."`                                                               | Active: bottom quotation, also included in virtual about.md.                           | `"Stay curious."`                                               |

<a id="contact-fields"></a>

### Contact

| Field                 | Type   | Simplified Chinese / English defaults | Status, purpose and limits                                                                                                                         | Example value                   |
| --------------------- | ------ | ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| `contact.email`       | string | `"you@example.com"`                   | Conditional: an email empty after trimming hides its link and contactEmailLead. The original string is used in the link; avoid surrounding spaces. | `"hello@example.com"`           |
| `contact.githubUrl`   | string | `"https://github.com/yourname"`       | Active: contact-link URL, independent of social.links. Empty text does not hide the entire link; use a complete HTTPS URL.                         | `"https://github.com/yourname"` |
| `contact.githubLabel` | string | `"GitHub"`                            | Active: visible contact-link text; it need not be named GitHub.                                                                                    | `"My GitHub"`                   |

<a id="tool-fields"></a>

### Tool entries

| Field                | Type   | Simplified Chinese / English defaults | Status, purpose and limits                                                                                                  | Example value      |
| -------------------- | ------ | ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| `sidebar.dlData`     | string | `"DL Data"`                           | Active: DL Data sidebar button and accessible name; renaming does not change behavior.                                      | `"Data panel"`     |
| `sidebar.ai`         | string | `"AI"`                                | Active: AI sidebar button and accessible name.                                                                              | `"My tool stack"`  |
| `sidebar.decryptor`  | string | `"Decryptor"`                         | Active: sidebar decoder entry, not internal tool-button text.                                                               | `"Decoder tools"`  |
| `sidebar.help`       | string | `"Help"`                              | Active: sidebar keyboard-panel entry.                                                                                       | `"Keyboard"`       |
| `sidebar.allScripts` | string | `"All Scripts"`                       | Active: sidebar article directory for the current language.                                                                 | `"All articles"`   |
| `scriptsPath`        | string | `"/root/bash/scripts"`                | Active: displayed article-directory path, virtual-file prefix and initial terminal directory. Not a server/local disk path. | `"/home/me/notes"` |

<a id="label-fields"></a>

### General labels

| Field                       | Type   | Simplified Chinese / English defaults | Status, purpose and limits                                                                                                   | Example value   |
| --------------------------- | ------ | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | --------------- |
| `labels.modalOutput`        | string | `"Output"`                            | Not used for opened tool titles; only the initial dialog HTML placeholder, replaced by the relevant modals title on opening. | `"Output"`      |
| `labels.modalClose`         | string | `"Close"`                             | Active: accessible text for tool-dialog and body-window close controls; does not disable functionality.                      | `"Close"`       |
| `labels.responseOutput`     | string | `"Output"`                            | Active: OUTPUT label above the body panel.                                                                                   | `"OUTPUT"`      |
| `labels.contactEmailLead`   | string | `"Reach me via"`                      | Conditional: before the email link when email is nonempty.                                                                   | `"Email:"`      |
| `labels.contactConnectLead` | string | `"or connect on"`                     | Active: always before the contact link, even without email; ensure the sentence still reads naturally.                       | `"or visit"`    |
| `labels.backToTop`          | string | `"Back to top"`                       | Conditional: back-to-top tooltip and accessible name, without changing its threshold.                                        | `"Back to top"` |
| `labels.quickAccess`        | string | `"Quick access"`                      | Active: accessible name of sidebar tool navigation.                                                                          | `"Quick tools"` |
| `labels.contactEmailLabel`  | string | `"email"`                             | Conditional: visible email-link text, not its address; shown only with nonempty email.                                       | `"Send email"`  |

<a id="modal-fields"></a>

### Tool dialogs

| Field                                     | Type     | Simplified Chinese / English defaults                  | Status, purpose and limits                                                                                                                | Example value                               |
| ----------------------------------------- | -------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| `modals.dlData.title`                     | string   | `"Downloading..."`                                     | Conditional: data-animation dialog title.                                                                                                 | `"Data transfer"`                           |
| `modals.dlData.subtitle`                  | string   | `"Critical Data"`                                      | Conditional: subtitle inside the data-animation dialog; animation only, no file download.                                                 | `"Demo data"`                               |
| `modals.ai.title`                         | string   | `"AI"`                                                 | Conditional: AI text-panel title.                                                                                                         | `"Tools and workflows"`                     |
| `modals.ai.lines`                         | string[] | See [array defaults](#array-defaults): modals.ai.lines | Conditional: static plain text joined with line breaks, without an AI request. Empty arrays leave an empty pre but the panel still opens. | `["~ $ tools --list","Astro / TypeScript"]` |
| `modals.decryptor.title`                  | string   | `"Hacker Decryptor"`                                   | Conditional: current decoder dialog title; still consumed.                                                                                | `"Local decoder"`                           |
| `modals.decryptor.header`                 | string   | `"Calculating Hashes"`                                 | Currently unused: old calculator body text, not read by DecoderForm.                                                                      | `"Calculating"`                             |
| `modals.decryptor.keysLabel`              | string   | `"keys tested"`                                        | Currently unused; does not change the current decoder.                                                                                    | `"Keys tried"`                              |
| `modals.decryptor.currentPassphraseLabel` | string   | `"Current passphrase:"`                                | Currently unused; does not change the current decoder.                                                                                    | `"Current passphrase"`                      |
| `modals.decryptor.masterKeyLabel`         | string   | `"Master key"`                                         | Currently unused; does not change the current decoder.                                                                                    | `"Master key"`                              |
| `modals.decryptor.transientKeyLabel`      | string   | `"Transient key"`                                      | Currently unused; does not change the current decoder.                                                                                    | `"Transient key"`                           |
| `modals.help.title`                       | string   | `"Help"`                                               | Conditional: keyboard-panel title.                                                                                                        | `"Keyboard panel"`                          |
| `modals.help.statsLabel`                  | string   | `"Stats & Achievements"`                               | Conditional: keyboard statistics heading; empty strings fall back to built-in English.                                                    | `"Typing statistics"`                       |
| `modals.help.typedPrefix`                 | string   | `"You typed:"`                                         | Conditional: typed-character count prefix; empty strings fall back to built-in English.                                                   | `"Typed:"`                                  |
| `modals.help.typedSuffix`                 | string   | `"characters"`                                         | Conditional: typed-character count suffix; empty strings fall back to built-in English.                                                   | `"characters"`                              |
| `modals.allScripts.title`                 | string   | `"/root/bash/scripts"`                                 | Conditional: article-directory dialog title, independent of scriptsPath; not synchronized automatically.                                  | `"Article directory"`                       |

<a id="effect-fields"></a>

### Effects

| Field                      | Type     | Simplified Chinese / English defaults                          | Status, purpose and limits                                                                                                                | Example value            |
| -------------------------- | -------- | -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| `effects.backgroundLines`  | string[] | See [array defaults](#array-defaults): effects.backgroundLines | Not displayed on the standard About page; only consumed by the fallback without an interactive terminal session. Not a background switch. | `["~ $ hello","ready"]`  |
| `effects.scrollToasts.p30` | string   | `"context parsed"`                                             | Conditional: toast at 30% scroll progress; empty strings fall back to context parsed.                                                     | `"You made it this far"` |
| `effects.scrollToasts.p60` | string   | `"inference stable"`                                           | Conditional: toast at 60% scroll progress; empty strings fall back to inference stable.                                                   | `"Keep exploring"`       |
| `effects.scrollToasts.p90` | string   | `"output finalized"`                                           | Conditional: toast at 90% scroll progress; empty strings fall back to output finalized.                                                   | `"Thanks for reading"`   |

Body strings render as ordinary text, not Markdown or HTML. Styles preserve paragraph line breaks. Bold, link syntax and HTML tags do not become rich text. Clearing body text does not remove headings or contents entries. Section order and the five anchors who / what / ethos / now / contact are fixed.

For `scriptsPath`, use a short absolute virtual directory starting with /, such as /home/me/notes. Avoid newlines, null characters and file-conflicting paths. Terminal paths normalize ., .. and repeated slashes. Paths over 1024 characters or with illegal control characters may prevent virtual-filesystem initialization. This neither executes a system shell nor reads arbitrary server directories. Files come from generated current-language articles and `about.md`; All Scripts is not a configurable executable-script list.

DL Data is only a progress animation, not a real download. Default model/latency text in the AI panel is static display, not live model state. Replace it with accurate personal information or clearly identify it as demonstration content.

The script inserts Help's three statistics strings into panel HTML. Use trusted short plain text rather than external inputs. Empty strings fall back to English rather than clearing these labels. Other About body and AI-line text use different rendering; do not assume every configuration field supports HTML.

Scroll toasts use whole-document progress. Once scrolling begins, each threshold fires at most once per initialization. This is neither words-read tracking nor AI processing progress; there is no public threshold or duration setting. Empty strings do not disable toasts.

<a id="array-defaults"></a>

### Defaults for the three arrays

These are complete actual zh / en default arrays. Order and blank lines are meaningful. An override replaces every element.

**sections.ethos**

```json
[
  "Prioritize clarity before complexity.",
  "Favor maintainable systems over one-off solutions.",
  "Ship in small iterations and learn from feedback.",
  "Communicate directly and document decisions."
]
```

**modals.ai.lines**

```json
[
  "~ $ ai --status --verbose",
  "",
  "model: anglefeint-core",
  "mode: reasoning + builder",
  "context window: 128k",
  "tools: codex / cursor / claude-code",
  "latency: 120-220ms",
  "safety: guardrails enabled",
  "",
  ">> system online",
  ">> ready for execution"
]
```

**effects.backgroundLines**

```json
[
  "~ $ ls -la",
  "total 42",
  "drwxr-xr-x  12 user  staff   384  Jan 12  about  blog  projects",
  "drwxr-xr-x   8 user  staff   256  Jan 11  .config  .ssh  keys",
  "-rw-r--r--   1 user  staff  2048  Jan 10  README.md  .env.gpg",
  "-rwxr-xr-x   1 user  staff   512  Jan  9  deploy.sh  script",
  "~ $ cat .motd",
  ">> welcome | access granted"
]
```

<a id="about-messages"></a>

## Page headings and shared control messages

These go under `i18n.locales.<locale>.messages`, outside the about content object. All are optional strings using built-in locale text and fallback. Only Simplified Chinese / English defaults are shown. Set each example on the matching field. Text changes do not toggle functionality or change section IDs.

### messages.about

| Field               | Simplified Chinese / English defaults                                                                   | Purpose and limits                                                                                                                         | Example value                          |
| ------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------- |
| `about.title`       | About — Hacker Ethos / About — Hacker Ethos                                                             | Conditional: page title, body h1, body-window title and virtual about.md title.                                                            | `"About me"`                           |
| `about.description` | 我是谁、我在做什么，以及背后的黑客精神。 / Who I am, what I build, and the hacker ethos behind my work. | Conditional: page meta description; does not add a paragraph beneath the heading.                                                          | `"My background, work and interests."` |
| `about.who`         | 我是谁 / Who I Am                                                                                       | Conditional: Who heading and table-of-contents entry, without changing body or anchor.                                                     | `"Who I Am"`                           |
| `about.what`        | 我在构建什么 / What I Build                                                                             | Conditional: What heading and table-of-contents entry.                                                                                     | `"What I do"`                          |
| `about.ethos`       | 黑客精神 / Hacker Ethos                                                                                 | Conditional: Ethos heading and table-of-contents entry.                                                                                    | `"My principles"`                      |
| `about.now`         | 现在 / Now                                                                                              | Conditional: Now heading and table-of-contents entry.                                                                                      | `"What I am working on"`               |
| `about.contact`     | 联系 / Contact                                                                                          | Conditional: Contact heading and table-of-contents entry; anchor remains contact.                                                          | `"Contact me"`                         |
| `about.regenerate`  | 重播扫描 / Replay scan                                                                                  | Conditional: bottom replay-scan button text, tooltip and accessible name. Runs a visual scan only, without AI requests or body generation. | `"Scan again"`                         |

### messages.windowControls

| Field                       | Simplified Chinese / English defaults | Purpose and limits                                                                             | Example value  |
| --------------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------- | -------------- |
| `windowControls.collapse`   | 折叠内容 / Collapse content           | Conditional: body-window minimize and tool-dialog collapse text.                               | `"Minimize"`   |
| `windowControls.expand`     | 放大窗口 / Expand window              | Conditional: tool-dialog maximize text; body-window fullscreen uses fullscreen.                | `"Expand"`     |
| `windowControls.restore`    | 还原窗口 / Restore window             | Conditional: window restore and reopening text.                                                | `"Restore"`    |
| `windowControls.fullscreen` | 全屏阅读 / Full screen                | Conditional: body-window browser-fullscreen action text, without changing browser permissions. | `"Fullscreen"` |

### messages.scriptFolders

| Field                     | Simplified Chinese / English defaults                                                                        | Purpose and limits                                                                                | Example value                      |
| ------------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- | ---------------------------------- |
| `scriptFolders.copyTitle` | 复制文章标题 / Copy article title                                                                            | Conditional: All Scripts copy-title tooltip and accessible name; does not copy full article text. | `"Copy title"`                     |
| `scriptFolders.copied`    | 标题已复制。 / Title copied.                                                                                 | Conditional: successful copy status.                                                              | `"Title copied"`                   |
| `scriptFolders.failed`    | 无法自动复制，已选中完整标题，请手动复制。 / Copy unavailable. The full title is selected; copy it manually. | Conditional: failed-copy status; empty strings may fall back to English in the script.            | `"Copy failed. Copy it manually."` |

<a id="example"></a>

## A configuration example to merge

Merge into existing `defineThemeConfig({...})` in `src/site.config.ts`, retaining imports, exports and personal settings. Do not duplicate theme or i18n objects.

```ts
theme: { enableAboutPage: true },
i18n: {
  locales: {
    en: {
      about: {
        metaLine: '$ profile ready',
        sections: {
          who: 'I am a frontend developer.',
          what: 'I build my personal blog and open-source tools.',
          ethos: ['Make it clear first.', 'Ship small improvements regularly.'],
          now: 'I am currently learning Astro.',
          contactLead: 'Feel free to get in touch.',
          signature: 'Stay curious.',
        },
        contact: {
          email: 'hello@example.com',
          githubUrl: 'https://github.com/yourname',
          githubLabel: 'GitHub',
        },
        scriptsPath: '/home/me/notes',
        modals: {
          allScripts: { title: 'Article directory' },
          ai: { lines: ['~ $ tools --list', 'Astro / TypeScript'] },
        },
      },
      messages: {
        about: { title: 'About me', description: 'My background, work and interests.' },
      },
    },
  },
},
```

The language fallback chain merges recursively from lower to higher priority. The current language overrides fallback languages, with base About settings filling remaining gaps. Arrays replace entirely; undefined does not overwrite existing values. Configuring only en does not change every language. See the [language tutorial](/en/blog/starter-guide-languages/) for enabled languages and fallback chains.

<a id="boundaries"></a>

## Related settings and unavailable controls

- **Navigation and contents:** `i18n.locales.<locale>.messages.nav.about` controls the public About entry and reopening entry after closing the window. Type string; Simplified Chinese default “关于” / English “About”; example “About me”. `messages.blog.toc` names the About contents heading and accessible name: string, Simplified Chinese default “文章目录” / English “On this page”; example “Page contents”. It also affects article contents; see [article messages](/en/blog/config-article/#article-messages).
- **Full decoder page:** `theme.enableDecoderPage` is boolean, default true. `theme: { enableDecoderPage: false }` disables the standalone Decoder page and full-tool link from the dialog, without disabling the embedded About decoder. Tool internals use `messages.decoder` and `messages.decoderPage`; see the [Decoder reference](/en/blog/config-decoder/). They do not use the five old decryptor body fields above.
- **Terminal:** `messages.terminal` holds shared interaction messages, independently of `about.effects.backgroundLines`. The terminal is a bounded browser virtual filesystem; configuration cannot authorize local programs. Its sixteen fields, placeholders and unused status are covered in the [terminal reference](/en/blog/config-terminal/).
- **Windows and animation:** There are no public About-specific panel-size, initially-closed, body-fade, tool-hiding, contents-order, Oracle-renaming or independent shutdown settings. Runtime/local storage manages window state. Without JavaScript the body remains readable, but tools are not guaranteed. Body text is visible immediately without a scroll observer. Runtime handles reduced-motion preferences; this article does not add a switch.
- **Contact:** About contact is independent of `social.links`. Changing footer social links does not update the About paragraph.

The five old decryptor body fields remain accepted by types but are unused. `backgroundLines` has only a fallback consumer; `modalOutput` is an initial placeholder. These statuses are explicit above. Do not use these fields to configure current tools or change the implementation to match obsolete text.
