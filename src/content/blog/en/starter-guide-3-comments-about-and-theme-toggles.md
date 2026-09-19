---
tags: ['anglefeint', 'starter']
title: 'User Guide 3: Enable and Customize Optional Features'
subtitle: 'Configure music, comments, About, pagination, feature switches, and languages only when you need them.'
description: 'Configure music, comments, About, pagination, feature switches, and languages only when you need them.'
pubDate: '2026-03-07'
updatedDate: '2026-09-19'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

## Check the defaults before changing anything

This guide covers the accompanying 0.8.0 starter. Merge all TypeScript snippets into the `defineThemeConfig({...})` object in `src/site.config.ts`. Configure only what you want to change.

| Feature                                                  | Default                     |
| -------------------------------------------------------- | --------------------------- |
| Search, table of contents, tags, automatic social images | On                          |
| Body image previews and code copying                     | Automatic; no configuration |
| About and the Red Queen article monitor                  | On                          |
| Music and Giscus comments                                | Off                         |
| Latest homepage posts / posts per blog page              | 3 / 9                       |

## 1. Enable the music player

Put your audio at `public/music/my-song.mp3` (create the directory if necessary), then add:

```ts
theme: {
  music: {
    enabled: true,
    tracks: [
      { title: 'My Song', artist: 'Artist Name', src: '/music/my-song.mp3' },
    ],
  },
},
```

The URL omits `public`. Each track requires `title` and `src`; `artist` is optional. Add more objects to `tracks` for more songs. Direct HTTPS audio URLs also work; local disk paths and music-platform sharing pages are not audio URLs. Avoid spaces and backslashes, and prefer simple filenames. No songs are bundled.

An empty playlist hides the player. With music enabled, invalid titles or URL formats cause configuration errors. The player mounts on pages using the shared theme layout; there is no per-page visibility switch. It sits at the lower left on desktop. On mobile, each page starts collapsed; expanding it temporarily hides back-to-top.

First open `/music/my-song.mp3` directly to confirm access, then click PLAY on the page. Audio loads after a playback action; opening a page does not start playback. Once playing, the next track starts automatically when the current one ends, returning to the first track after the last. Track, position, and volume are saved within the same tab session. Navigation pauses playback; click play on the next page to resume. Playback is not seamless across pages. If storage is unavailable, playback still works without reliable memory. Set `enabled: false` to turn it off.

## 2. Enable Giscus comments

Use the [Giscus setup page](https://giscus.app/): prepare a public GitHub repository, enable Discussions, install the Giscus app, and select a category. Copy the actual repository/category IDs from its generated configuration:

```ts
theme: {
  comments: {
    enabled: true,
    repo: 'yourname/your-repository',
    repoId: 'REPLACE_WITH_REPO_ID',
    category: 'Announcements',
    categoryId: 'REPLACE_WITH_CATEGORY_ID',
    mapping: 'pathname',
    lang: '',
  },
},
```

Replace both `REPLACE_WITH_...` values, and use your actual category name. Fill in the theme configuration only; do not paste the full Giscus script into each post.

Comments appear on article pages. Missing core repo/category fields prevent rendering; placeholders do not make a working configuration. `lang: ''` follows the article language (`zh` maps to `zh-CN`); the default is fixed to `en`.

Keep `mapping: 'pathname'` to associate discussions with article paths. `specific` requires a nonempty `term`; `number` requires a positive integer as a string in `number`. Invalid or missing parameters for these modes throw errors.

Check the bottom of a post. If comments are absent, check IDs, repository permissions, connectivity, and browser blocking. Optional fields such as `inputPosition`, `theme`, and `reactionsEnabled` can retain defaults. `strict` and `reactionsEnabled` take strings `'0'` / `'1'`.

## 3. Replace About content

About is enabled by default. Configure its content per language without editing the page template:

```ts
i18n: {
  locales: {
    en: {
      about: {
        metaLine: '$ profile booted | mode: builder',
        sections: {
          who: 'Introduce yourself here.',
          what: 'Describe what you build.',
          ethos: ['Keep learning.', 'Build useful things.'],
          now: 'What you are working on now.',
          contactLead: 'Get in touch.',
          signature: '> Your signature',
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

This changes only English About content; fill in other locales separately, as nothing is automatically translated. `sidebar`, `labels`, `modals`, and `effects` also support overrides. Start with the body and contact details. About tool windows are theme demonstrations; writing their text does not connect a real AI service.

Visit `/en/about/` to check the body, email, and GitHub links. Set `theme.enableAboutPage: false` to hide the navigation item and stop generating About routes. Rebuild after changing it.

## 4. Adjust post counts and pagination

You may set only the first two counts; add `pagination` when you want a fixed pagination appearance:

```ts
theme: {
  homeLatestCount: 3,
  blogPageSize: 9,
  pagination: {
    windowSize: 7,
    showJumpThreshold: 12,
    jump: { enabled: true, enterToGo: true },
    style: { enabled: true, mode: 'fixed', variants: 9, fixedVariant: 1 },
  },
},
```

`homeLatestCount` controls recent posts on the homepage. `blogPageSize` controls posts per blog page and is also used by tag post lists. Use reasonable positive integers.

`windowSize` controls the page-number window, clamped to 5–21, not the number of posts per page. The jump input appears only when `jump.enabled` is true and total pages exceed `showJumpThreshold` (over 12 by default). `enterToGo` controls jumping with Enter.

Style modes are `fixed`, `sequential`, and `random`. The example fixes variant 1. Default `random` selects a stable variant from language, path, page information, and related inputs; it does not reshuffle on every refresh. `style.enabled: false` uses the basic variant, without disabling pagination. Check the list footer once you have enough posts.

## 5. Disable enhancements you do not need

These are available off switches, not a recommendation to disable everything. Keep only fields you want to change:

```ts
theme: {
  enableAboutPage: false,
  effects: { enableRedQueen: false },
  search: { enabled: false },
  toc: { enabled: false },
  tags: { enabled: false },
  socialImage: { enabled: false },
},
```

`enableRedQueen` controls only the article Red Queen monitor, not the entire AI theme or all effects. `toc` is a site default that a post’s `toc: true` can override. Disabling `socialImage` leaves manual `ogImage` working. Search and tag switches affect both their entries and generated output. Existing layouts determine the four page atmospheres; there is no global selector that switches the whole site among the four themes.

## 6. Add languages and adjust the homepage URL

For example, add French:

```ts
i18n: {
  locales: {
    fr: {
      meta: { label: 'Français', hreflang: 'fr', ogLocale: 'fr_FR', enabled: true, fallback: ['en'] },
      site: { hero: 'Bienvenue sur mon blog.' },
      messages: { nav: { home: 'Accueil' }, siteDescription: 'Mes notes et projets.' },
    },
  },
},
```

Then create content with `npm run new-post -- french-note --locales fr`. Provide interface text, a homepage introduction, About, and post translations yourself. `fallback` supplies missing configuration/text; it neither translates posts nor inserts other languages’ posts into a list. The default locale is added to the fallback chain when needed.

Change `meta.label` to rename a language in the menu; for example, `zh` defaults to “简体中文”. `hreflang` / `ogLocale` describe language metadata. Changing the displayed name does not change the locale code or URL.

The default `i18n.routing.defaultLocalePrefix: 'always'` redirects `/` to the default-language homepage. `'never'` serves that homepage at `/` and redirects `/<default-locale>/` back to `/`. This affects only the default homepage, not blog paths: `/en/blog/` does not become `/blog/`.

## 7. Merge settings and verify

For example, combine the post count and music in one `theme` object:

```ts
theme: {
  homeLatestCount: 5,
  music: {
    enabled: true,
    tracks: [{ title: 'My Song', src: '/music/my-song.mp3' }],
  },
},
```

Keep existing settings such as `theme.comments` in that same object. Do not overwrite your configuration with a whole example. Arrays replace previous arrays, so retain existing tracks or social links when adding entries.

Check the feature in development, then run `npm run check` and `npm run build`. Test search with `npm run preview` after building. Use `npm run doctor` when diagnosing project or upgrade problems; it performs broader checks. Deploy the new output to publish changes.

## 8. Show or hide footer credits

The footer displays the current build year and your `site.title`. By default it also links to the theme and Astro: `© 2026 My Blog · Theme by Anglefeint · Built with Astro`. The year is generated during the build, not hard-coded.

To hide both technical credits, merge this setting into `src/site.config.ts`:

```ts
export const THEME_CONFIG = defineThemeConfig({
  theme: {
    footer: { showCredits: false },
  },
});
```

Set `showCredits: true` to restore them. Hiding credits removes both links; it keeps the copyright line. An optional `site.tagline` adds your own plain text independently of this switch. Its default is empty; the former default `Built with Astro.` is treated as the built-in credit to avoid duplication. No `All rights reserved` text is added.

The public demo uses its own name, domain and translated introduction. A fresh starter keeps generic defaults, and you still configure your site only in `src/site.config.ts`. If you upgrade an older starter, use the matching configuration files described in the upgrade guide; updating only the npm package does not add this option to old adapters.

## In this series

- [User Guide 1: Set Up Your Blog](/en/blog/starter-guide-1-configure-your-site/)
- [User Guide 2: Write and Organize Content](/en/blog/starter-guide-2-languages-and-routing/)
- [User Guide 3: Enable and Customize Optional Features](/en/blog/starter-guide-3-comments-about-and-theme-toggles/)
