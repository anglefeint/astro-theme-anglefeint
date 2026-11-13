---
tags: ['anglefeint', 'starter']
title: 'User Guide 5: Adjust Pages and Features to Your Liking'
subtitle: 'Customize the homepage, About, Decoder, social links, footer, music and pagination by the area you want to change.'
description: 'Make small configuration changes to page content and features, with actual defaults, scope, merging rules and local checks.'
pubDate: '2026-03-07'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

This is part 5 of 8. [See the full tutorial sequence](/en/blog/starter-guide-1-configure-your-site/#tutorial-order) · [Look up configuration fields](/en/blog/config-reference/).

Once the blog runs, start with the area you want to change. You need not fill every field or copy all examples.

Merge TypeScript fragments into the existing `defineThemeConfig({...})` in `src/site.config.ts`. Keep only one `theme`, one `i18n` and one `social` per object. Edit matching fields, retaining other personal settings. Objects merge with defaults; arrays replace entire arrays, so include all links, tracks or entries you want to retain.

This is a task-oriented guide to common settings, not the complete field dictionary. Find your target area and read its section.

## 1. Adjust homepage prompts and effects

See [installation and personal information](/en/blog/starter-guide-1-configure-your-site/) for the distinction between site name, homepage title and introduction. These settings adjust prompt sections and interactions:

```ts
theme: {
  home: {
    showInitialize: true,
    showFollow: true,
    showTrace: true,
  },
  effects: { enableHomePassage: false },
},
```

| Field                             | Default | What changes                                                                                                                                       |
| --------------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `theme.home.showInitialize`       | `true`  | Shows the Initialize/done startup text; false hides that section.                                                                                  |
| `theme.home.showFollow`           | `true`  | Shows the Wake Up/Follow prompt; false hides it independently.                                                                                     |
| `theme.home.showTrace`            | `true`  | Shows the bottom PIRATE SIGNAL/TRACE area; false hides it.                                                                                         |
| `theme.effects.enableHomePassage` | `false` | Allows homepage post-title links to play an approximately eight-second Matrix passage before navigation; reduced motion retains direct navigation. |

These fields do not disable all code rain or change the global palette. `showTrace` does not control the lower-right widescreen terminal.

### Change the widescreen terminal text

It defaults to `Knock, knock.`. Set English first to provide shared text for languages without their own override:

```ts
i18n: {
  locales: {
    en: { messages: { home: { transmission: '记录想法，也留下一点线索。' } } },
  },
},
```

For language-specific text, set its `messages.home.transmission`. This field uses current-language configuration → English configuration → `Knock, knock.`, rather than the complete normal message fallback chain. The terminal appears in wide layouts; absence on a phone is not a configuration failure. Clicking the keyhole opens the corridor preview.

About's Oracle entry uses an independent scene preview, unaffected by the homepage passage switch. These terminal/status texts create atmosphere rather than reporting actual machines, networks or security.

See the [homepage reference](/en/blog/config-home/#startup-switches) for complete definitions.

## 2. Replace About with your introduction

Open `/zh/about/` for the Chinese example. Body and contact details are configured per language, without editing theme page templates:

```ts
i18n: {
  locales: {
    zh: {
      about: {
        metaLine: '$ profile | building and learning',
        sections: {
          who: '我是小林，喜欢开发与写作。',
          what: '这里记录我的项目和学习笔记。',
          ethos: ['保持好奇。', '把想法变成可以使用的东西。'],
          now: '最近在整理个人博客。',
          contactLead: '欢迎联系我。',
          signature: '> 谢谢你来这里。',
        },
        contact: {
          email: 'you@example.com',
          githubUrl: 'https://github.com/yourname',
          githubLabel: 'GitHub',
        },
      },
    },
  },
},
```

Replace the sample name and addresses. `metaLine` is the panel's top status text. `who`, `what`, `ethos` and `now` hold biography, work, principles and current activity. `contactLead` introduces contact details; `signature` is the signature. `ethos` is a string array and replaces all previous entries when supplied.

Paragraphs and signature are plain text. `\n` creates a line break and `\n\n` a blank line. Markdown/HTML are not parsed; do not use `<br>`. This example changes Simplified Chinese only. Other languages need their own text; no translation happens automatically. Missing fields use the language's configuration fallback rules.

Window controls close, minimize or fullscreen the panel and store its state locally in the browser. AI output and download progress are theme interactions, not connections to an AI service activated by entering text. Decoder tools process input locally in the browser.

To remove About, set `enableAboutPage: false` in `theme`; the default is `true`. This removes standard About routes and related public navigation/contact entries. Links you wrote in bodies or footer are not deleted automatically; review them too.

See [About fields](/en/blog/config-about/#about-content) for more content settings, and [terminal messages](/en/blog/config-terminal/#messages) for command prompts and the read-only reader.

## 3. Adjust Decoder and reading cards

Decoder Lab is enabled by default at `/zh/decoder/` in the Chinese example. Its visuals honor cypherpunks and digital-freedom pioneers; local processing and peer-to-peer imagery reflect personal control over tools and data.

It decodes text, interprets supported token calls and checks address formats without RPC, wallet connection or an API key. It does not query balances, execute transactions or prove ownership. Providing calldata does not verify a contract's real behavior.

Set `enableDecoderPage: false` in `theme` to disable the standalone page and theme-provided links independently. Disabling About does not disable Decoder, or vice versa. Maintain custom links yourself.

Tribute text and reading cards are configured per language. For example, replace the Chinese list:

```ts
i18n: {
  locales: {
    zh: {
      messages: {
        decoderPage: {
          readings: {
            tribute: '思想与代码，让隐私和自由更进一步。',
            links: [
              { title: '我的阅读资料', href: 'https://example.com/', author: '作者名', year: '2026' },
            ],
          },
        },
      },
    },
  },
},
```

`tribute: ''` hides the tribute and `links: []` hides cards. Omission retains defaults. Each entry requires `title` and `href`; `author`, `year` and `cover` are optional. A cover can be a built-in name such as `privacy-code` or `bitcoin`, a public image path or HTTPS URL. Omission gives a text-only card.

`links` replaces the whole list rather than appending. Include old entries to retain them. These are links you provide, not automatically fetched/reprinted articles or verified external resources.

See the [Decoder reference](/en/blog/config-decoder/#readings) for entry types, built-in covers and defaults.

## 4. Adjust social links and footer

Basic social accounts use `social.links`, sharing array order between header and footer. For a custom icon, first add `public/icons/community.svg`:

```ts
social: {
  links: [
    { href: 'https://github.com/yourname', label: 'GitHub', icon: 'github' },
    { href: 'https://example.com/community', label: '我的社区', iconSrc: '/icons/community.svg' },
  ],
},
```

`iconSrc` supports local public SVG, PNG and WebP paths beginning with `/`, not remote URLs, queries, fragments or encoded characters. It overrides `icon` and preserves image colors. If both are absent, the label appears as text. `label` supplies the accessible name. Missing files or unsupported built-in icon names cause configuration errors.

Optional `rel` describes link relationships. For example, use `rel: 'me'` for your Mastodon account. The theme retains `noopener noreferrer` and does not add `me` automatically by platform. Identity verification belongs to the platform: deploy the site first, then provide the actual page containing the reciprocal link in your profile. Verification is not guaranteed by the theme.

Header social links are hidden on mobile; the footer retains them. `links: []` leaves three non-clickable placeholders rather than hiding the area.

### Footer credits, text and extra links

```ts
site: { tagline: '保持好奇，持续记录。' },
theme: {
  footer: {
    showCredits: true,
    links: [{ label: '项目源码', href: 'https://github.com/yourname/your-project' }],
  },
},
```

- `site.tagline` is plain custom text. An empty string hides it, and it is not translated automatically. The old default `Built with Astro.` is treated as built-in credit to prevent duplication.
- `theme.footer.showCredits` defaults to `true`, controlling the theme and Astro credits. Turning it off retains copyright, custom text and extra links. It also controls theme credit on automatic article sharing images, not custom images.
- `theme.footer.links` defaults to an empty array and appears between copyright and credits, independently of social icons. Labels retain your text, are not translated, and are unaffected by showCredits.

Copyright uses the global site name and the build-time year. Rebuild and deploy after changing text, credits or year-dependent output.

See [social fields](/en/blog/config-site-chrome/#social-fields) and [footer fields](/en/blog/config-site-chrome/#footer) for icon paths and credit/link rules.

## 5. Enable the music player

Add your audio at `public/music/my-song.mp3`, then merge:

```ts
theme: {
  music: {
    enabled: true,
    tracks: [{ title: '我的一首歌', artist: '作者', src: '/music/my-song.mp3' }],
  },
},
```

Music defaults to off and includes no tracks. Every entry needs `title` and `src`; `artist` is optional. An empty playlist hides the player. Retain wanted entries when expanding the array. Audio URLs omit `public`, cannot be local disk paths or platform sharing pages, and may be direct HTTPS URLs. Avoid spaces/backslashes. Empty titles or invalid URL formats cause configuration errors; valid formatting does not prove file availability.

The player appears on pages using the shared theme layout, without per-page visibility switches. Each new page starts collapsed. On first use, PLAY triggers audio loading. Tracks advance in order and wrap from last to first. Expanding the mobile player temporarily hides back-to-top.

The tab session remembers track, position and volume. Active playback attempts to resume after navigation/reload; a manual pause remains paused. Playback is not seamless and browsers may block automatic resume. Without storage, manual playback works without session resume.

The implementation downloads the whole track into a Blob before playing, so seeking does not depend on server Range support. Large files increase waiting and memory. Remote hosts must allow CORS; same-site public files need no cross-origin setup. Confirm the audio URL is available. Disable music with `theme.music.enabled: false`.

See the [music reference](/en/blog/config-music/#track-fields) for track fields, status messages and resume limits.

## 6. Adjust list counts and pagination

```ts
theme: {
  homeLatestCount: 3,
  blogPageSize: 10,
  pagination: {
    windowSize: 7,
    showJumpThreshold: 12,
    jump: { enabled: true, enterToGo: true },
    style: { enabled: true, mode: 'fixed', variants: 9, fixedVariant: 1 },
  },
},
```

`homeLatestCount` defaults to 3 homepage posts; `blogPageSize` defaults to 10 posts per blog/tag page. Use reasonable positive integers. Neither controls the homepage's fixed maximum of three fragment previews. Full fragment lists use `theme.fragments.pageSize`.

`windowSize` defaults to 7 and controls the page-number window, not items per page; rendering limits it to 5–21. Jump controls require `jump.enabled` true and total pages greater than `showJumpThreshold`, defaulting to more than 12. `enterToGo` permits Enter navigation.

The default style mode is `random`; this example selects `fixed` to pin a variant. `sequential` follows page order. Client initialization in `random` picks again and may repeat colors. Without JavaScript, static build-time pagination remains. `variants` controls the number of selectable variants, clamped during rendering to 1–12; `fixedVariant` is limited to that range.

`style.enabled: false` uses a basic style without removing pagination. Blog, tags and Fragments share these settings; consider all three.

See [Blog List and tags](/en/blog/config-blog-list/#pagination-window) for complete ranges, variants and interface text.

## 7. Disable only the features you do not need

These switches have distinct scopes. Do not disable the whole table merely to configure one feature.

| Configuration path             | Default | Effect of false                                                       |
| ------------------------------ | ------- | --------------------------------------------------------------------- |
| `theme.enableAboutPage`        | `true`  | Stops About generation and hides related theme entries.               |
| `theme.enableDecoderPage`      | `true`  | Stops Decoder generation and hides related theme entries.             |
| `theme.effects.enableRedQueen` | `true`  | Hides the article Red Queen monitor, not all AI-page effects.         |
| `theme.search.enabled`         | `true`  | Disables article-search UI and index generation.                      |
| `theme.toc.enabled`            | `true`  | Disables default contents; per-post `toc: true` still overrides.      |
| `theme.tags.enabled`           | `true`  | Disables tag links/pages without deleting posts.                      |
| `theme.math.enabled`           | `true`  | Disables Markdown/MDX mathematical processing.                        |
| `theme.socialImage.enabled`    | `true`  | Stops automatic article sharing images; explicit ogImage still works. |

For example, merge only `theme: { effects: { enableRedQueen: false } }` to hide the monitor without changing search, music or About.

Comments and fragments default to off and need not be enabled for other features. See [Giscus comments](/en/blog/starter-guide-4-giscus-comments/) and [fragments](/en/blog/starter-guide-5-fragments/) when needed. Contents, formulas and sharing images are explained in [writing posts](/en/blog/starter-guide-2-languages-and-routing/) and [images](/en/blog/starter-guide-images/).

## 8. Create a custom page for your work

To present projects separately, run this at the project root:

```bash
npm run new-page -- projects
```

It creates `src/pages/[lang]/projects.astro` with the default `base` layout, generating `/<语言代码>/projects/` for enabled languages, such as `/en/projects/` or `/zh/projects/`. Edit that Astro file's body. It does not translate content or add a header navigation item. Link it from the body or footer links.

Add `--theme` when you want a specific atmosphere. For example, `npm run new-page -- portfolio --theme cyber` creates another Cyberpunk page. Options are `base`, `ai`, `cyber`, `hacker` and `matrix`. This selects the new page's layout, not a global theme switch. Slugs use lowercase letters, numbers and hyphens, with nested paths such as `projects/labs` supported. Avoid reserved standard routes. Existing files cause an error, so do not run five theme commands for the same path consecutively.

## 9. Confirm saved changes

Open the changed page in dev and check content, links and feature entries. For old environment overrides, follow [the first tutorial](/en/blog/starter-guide-1-configure-your-site/). Diagnose missing icons, audio requests and external links by their paths/network rather than repeatedly overwriting the whole configuration.

Stop dev before publication, then run:

```bash
npm run doctor
npm run preview
```

doctor includes local preparation, checks and building. Do not immediately repeat check or build after success. Verify search in built preview; preview itself does not publish. Redeploy all of `dist/` for live changes, because saving configuration locally does not update production.

## Tutorial navigation and configuration reference

[Previous: publish a fragment](/en/blog/starter-guide-5-fragments/) · [Next: let readers leave comments](/en/blog/starter-guide-4-giscus-comments/) · [All eight tutorials](/en/blog/starter-guide-1-configure-your-site/#tutorial-order).

Related fields: [homepage](/en/blog/config-home/), [About](/en/blog/config-about/), [terminal](/en/blog/config-terminal/), [Decoder](/en/blog/config-decoder/), [navigation, social links and footer](/en/blog/config-site-chrome/), [music](/en/blog/config-music/), [lists and pagination](/en/blog/config-blog-list/). Full paths, defaults and limits are in the [reference index](/en/blog/config-reference/).
