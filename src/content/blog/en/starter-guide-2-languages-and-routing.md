---
title: 'Anglefeint Starter Guide 2: Configure Languages and Routing'
subtitle: 'How locales, fallback, and default-locale URLs work'
description: 'Use the single locale registry in src/site.config.ts to drive routing, labels, fallback behavior, messages, hero copy, and About content.'
pubDate: '2026-03-07'
heroImage: '../../../assets/blog/default-covers/cyber-03.webp'
---

Anglefeint uses a single locale registry in `src/site.config.ts`.

That means routing, locale labels, fallback behavior, localized UI copy, localized home hero text, and localized About content all come from one place.

## The core i18n shape

```ts
i18n: {
  defaultLocale: 'en',
  routing: {
    defaultLocalePrefix: 'always',
  },
  locales: {
    en: {
      meta: {
        label: 'English',
        hreflang: 'en',
        ogLocale: 'en_US',
      },
      site: {
        hero: 'Your localized home hero copy.',
      },
      messages: {
        nav: { home: 'Home' },
      },
      about: {
        metaLine: '$ profile booted | mode: builder',
      },
    },
  },
}
```

## Choose the default locale and URL mode

- `i18n.defaultLocale`
- `i18n.routing.defaultLocalePrefix`

If `defaultLocalePrefix` is `'always'`:

- the default locale home is `/<default-locale>/`
- `/` redirects there

If `defaultLocalePrefix` is `'never'`:

- `/` becomes the canonical home for the default locale
- `/<default-locale>/` redirects back to `/`

## Locale metadata that is live today

- `label`
- `hreflang`
- `ogLocale`
- `enabled`
- `fallback`

`enabled` affects route generation and the language switcher. `fallback` affects localized messages, hero copy, and About content resolution.

## The localized fields most users will edit

1. `i18n.locales.<code>.messages`
2. `i18n.locales.<code>.site.hero`
3. `i18n.locales.<code>.about`

## Content files still matter

Localized posts still live in:

```text
src/content/blog/<locale>/
```

If a blog detail page does not exist in the target locale, the language switcher falls back to that locale's blog index.

## Read next

- [Starter Guide 1: Configure Your Site](/en/blog/starter-guide-1-configure-your-site/)
- [Starter Guide 3: Configure Comments, About, and Theme Toggles](/en/blog/starter-guide-3-comments-about-and-theme-toggles/)
