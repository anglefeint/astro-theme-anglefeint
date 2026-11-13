---
tags: ['anglefeint', 'config']
title: 'Configuration Reference: Homepage'
subtitle: 'Look up homepage titles, introduction, latest posts, prompts, widescreen terminal and passage navigation.'
description: 'Types, theme defaults, scope, limits and mergeable examples for homepage fields, with shared settings and unsupported controls.'
pubDate: '2026-11-13'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

[Back to the reference index](/en/blog/config-reference/). This documents fields actually used by the homepage, without changing theme code or treating the demo's personal settings as defaults.

Replace `<locale>` with an enabled language code. Examples use en, affecting English only without changing other languages or enabling a language. Merge fragments into the existing defineThemeConfig object in `src/site.config.ts`, preserving other theme, i18n and site fields.

## 1. Homepage title, introduction and metadata description

<a id="home-title"></a>

### `i18n.locales.<locale>.site.homeTitle`

- **Type:** optional `string`.
- **Theme default:** unset. Built-in languages have no separate homeTitle and ultimately use the site name, default My Blog.
- **Purpose:** visible homepage title.
- **Status and limits:** conditional. Looks for a trimmed nonempty title in the current language and fallback languages, then uses the global name. `''` or whitespace cannot hide it. It does not change the global name in browser titles, navigation, footer, RSS or SEO.

<a id="home-hero"></a>

### `i18n.locales.<locale>.site.hero`

- **Type:** optional `string`.
- **Theme default:** a built-in introduction per language. Simplified Chinese: “在这里写一段站点简介，并告诉读者你将发布什么类型的内容。” English: “Write a short introduction for your site and what readers can expect from your posts.” Others have their own values.
- **Purpose:** visible introduction beneath the homepage title.
- **Status and limits:** conditional. Finds a defined current/fallback value. `''` deliberately clears it and stops fallback. Plain text only, without Markdown/HTML or changes to page metadata.

<a id="home-description"></a>

### `i18n.locales.<locale>.messages.siteDescription`

- **Type:** optional `string` override.
- **Theme default:** resolved built-in language text. Simplified Chinese: “电影感网页界面与 AI 时代工程实践文章。” English: “Cinematic web interfaces and AI-era engineering essays.”
- **Purpose:** description passed to the homepage head, not visible introduction.
- **Status and limits:** conditional. Message resolution/fallback happens first; only an empty resolved string falls back to global description. Empty text does not disable every page description, and whitespace is not automatically trimmed into absence.

The three fields can be configured together but remain independent:

```ts
i18n: {
  locales: {
    en: {
      site: {
        homeTitle: 'My digital garden',
        hero: 'Development, reading and everyday life.',
      },
      messages: { siteDescription: 'Personal projects and study notes.' },
    },
  },
},
```

<a id="site-fallbacks"></a>

### Shared fields: `site.title`, `site.description`

For the homepage, site.title is the final fallback without a valid homeTitle; site.description is the fallback for empty language metadata. Neither is homepage-only. Types, defaults, environment overrides and examples are defined in the [site identity reference](/en/blog/config-site-chrome/#identity).

## 2. Latest post count

<a id="latest-count"></a>

### `theme.homeLatestCount`

- **Type:** `number`.
- **Theme default:** `3`.
- **Purpose:** takes the first N current-language posts sorted by descending pubDate. Fewer available posts show only what exists. The adjacent count is actual displayed/total in that language.
- **Status and limits:** active, using array slice without dedicated positive-integer validation. Use reasonable positive integers, not negatives, fractions, NaN or Infinity. `0` produces an empty list and no-posts notice even when articles exist; it does not hide the entire area.
- **Independent scope:** does not set Blog List page size or the fixed maximum of three fragment previews.

```ts
theme: { homeLatestCount: 5 },
```

Article titles, dates and excerpts come from content, not subfields here. The homepage does not automatically fill missing entries with other-language posts.

## 3. Startup prompts and bottom status

<a id="startup-switches"></a>

All three fields are active `boolean` values defaulting to `true`. False hides only its area; omission retains the default.

| Full path                   | Purpose                                         | Limits                                                                                        |
| --------------------------- | ----------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `theme.home.showInitialize` | Initialize/done startup section.                | Does not control homepage content or background loading.                                      |
| `theme.home.showFollow`     | Wake Up/Follow The White Rabbit prompt.         | Independent of the previous section; not required for navigation.                             |
| `theme.home.showTrace`      | Bottom PIRATE SIGNAL/TRACE PROGRAM status area. | Does not control the widescreen terminal. Atmospheric text, not real tracking/network status. |

```ts
theme: {
  home: {
    showInitialize: false,
    showFollow: true,
    showTrace: false,
  },
},
```

Disabling both first switches removes their startup-text component. No site.config fields customize fixed startup sentences, bottom status text or timings. Do not invent startupText or traceText.

## 4. Homepage interface messages

<a id="home-messages"></a>

These optional `string` overrides live under `i18n.locales.<locale>.messages.home`. Ordinary fields use message fallback. Listed defaults are Simplified Chinese / English; other built-in languages have their own text.

| Final path segment | Simplified Chinese default / English default                    | Purpose and limits                                                                                        |
| ------------------ | --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `latest`           | 最新 / Latest                                                   | Latest-post area heading; does not affect sorting/count.                                                  |
| `viewAll`          | 全部 / All                                                      | Article archive entry and accessible description for the fragment archive link; destination unchanged.    |
| `noPosts`          | 该语言暂时没有文章。 / No posts available in this language yet. | Empty latestPosts notice, not a draft/publication control.                                                |
| `openDoor`         | 开门 / Open door                                                | Accessible name/preview label for the widescreen keyhole button, not generally a persistent body heading. |

These are conditional on their areas existing. Empty strings clear text, not containers/features, and may remove useful button names. Use feature switches for visibility.

```ts
i18n: {
  locales: {
    en: {
      messages: {
        home: {
          latest: 'Latest updates',
          viewAll: 'All articles',
          noPosts: 'There are no articles here yet.',
          openDoor: 'Open the corridor preview',
        },
      },
    },
  },
},
```

<a id="home-transmission"></a>

### `i18n.locales.<locale>.messages.home.transmission`

- **Type:** optional `string` override.
- **Theme default:** `'Knock, knock.'` shared by languages, including Chinese, without personal overrides.
- **Purpose:** selectable, scrollable text in the widescreen terminal.
- **Status and limits:** conditional; visible at viewport widths of at least 1440px. Special order: current-language personal configuration → English personal configuration → default sentence, not the complete ordinary chain. `''` clears text without hiding the terminal or closing the corridor.

For shared text used by languages without their own override:

```ts
i18n: {
  locales: {
    en: { messages: { home: { transmission: 'Leave a small clue here.' } } },
  },
},
```

Setting the same field in zh overrides Chinese only. Text changes neither measure real network signals nor change keyhole/corridor behavior.

<a id="message-hero"></a>

### `i18n.locales.<locale>.messages.home.hero`

- **Type:** optional `string` override.
- **Theme default:** built-in language introduction; Simplified Chinese/English match site.hero above.
- **Purpose:** fallback introduction only when getSiteHero finds no defined current/fallback value.
- **Status and limits:** conditional, not deprecated. Every built-in language already has site.hero, so changing this alone usually has no visible effect. Setting site.hero to `''` does not activate it. Normally edit site.hero directly.

```ts
i18n: {
  locales: {
    en: { messages: { home: { hero: 'An introduction used only when site.hero is unavailable.' } } },
  },
},
```

The example documents path/type rather than overriding higher-priority site.hero. Do not remove defaults or modify dependency source merely to change the introduction.

## 5. Matrix passage when opening a post

<a id="home-passage"></a>

### `theme.effects.enableHomePassage`

- **Type:** `boolean`.
- **Theme default:** `false`.
- **Purpose:** ordinary homepage clicks on latest titles and marked blog navigation play the Matrix passage before navigating. The normal timeline is about eight seconds, with completion/error fallback navigation.
- **Status and limits:** conditional; JavaScript required. Reduced motion, modifier clicks, non-left clicks, downloads, external URLs and new-window targets retain native behavior. It does not delay homepage text or control About Oracle/widescreen previews.

```ts
theme: { effects: { enableHomePassage: true } },
```

With the switch off, these links navigate directly. It exposes no duration, scene-color or destination setting; do not add an unsupported homePassageDuration.

## 6. Shared settings also used by the homepage

<a id="shared-settings"></a>

These fields are not homepage-only. This table documents homepage usage; their main modules define them fully.

| Full path                                        | Homepage relationship                                                                                   | Main reference                                                    |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `theme.fragments.enabled`                        | Shows the avatar if that language has fragments; also controls the full list. Preview maximum is three. | [Fragments switch](/en/blog/config-fragments/#enabled)            |
| `i18n.locales.<locale>.messages.blog.allPosts`   | Latest-post count tooltip and archive accessible name.                                                  | [Shared list text](/en/blog/config-blog-list/#tag-messages)       |
| `i18n.locales.<locale>.messages.fragments.title` | Avatar accessible name, not text beside it.                                                             | [Fragment messages](/en/blog/config-fragments/#fragment-messages) |
| `i18n.locales.<locale>.messages.fragments.close` | Homepage preview close accessible name, not button shape.                                               | [Fragment messages](/en/blog/config-fragments/#fragment-messages) |

If enabled but missing, check current-language fragments. Do not copy existing IDs to force the avatar to appear. See [preview image/code limits](/en/blog/config-fragments/#preview-and-links) and [publishing fragments](/en/blog/starter-guide-5-fragments/).

## 7. Homepage settings not currently provided

<a id="unsupported-settings"></a>

`messages.siteTitle` does not currently change standard homepage/global site names. Use homeTitle or top-level site.title instead. Its retained type, default and example are in [the unused site-title field](/en/blog/config-site-chrome/#legacy-site-title).

There are no site.config fields for code-rain density/colors, homepage mirror button, avatar assets, fragment preview count, fixed startup text or passage duration. Those belong to layouts/styles/scripts; adding arbitrary TypeScript names does not implement them. Reduced Motion affects presentation but is not a new switch in this reference.

The relationship between `/` and localized homepages uses i18n.defaultLocale and i18n.routing.defaultLocalePrefix; see [language/address routing](/en/blog/config-languages/#routing). Navigation, footer, music and analytics are shared settings too.

## How do I verify changes?

Open the target language in dev and distinguish visible title, introduction, metadata and accessible descriptions. Check terminal text at a width of at least 1440px. Inspect head metadata and button accessible names/title rather than only visible headings.

Restart dev after environment changes. Production needs rebuilding/deployment. Before publication, stop dev, run npm run doctor, then npm run preview. doctor includes building; do not immediately repeat check/build. See [installation](/en/blog/starter-guide-1-configure-your-site/) and [deployment](/en/blog/starter-guide-deployment/).
