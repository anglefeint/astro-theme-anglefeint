---
title: 'Anglefeint Starter Guide 3: Configure Comments, About, and Theme Toggles'
subtitle: 'Giscus, About content, home counts, pagination, and post effects'
description: 'The verified theme toggles in Anglefeint: Giscus comments, About content, Red Queen effect, home post counts, and blog pagination settings.'
pubDate: '2026-03-07'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

Once your site identity and languages are in place, the next layer is feature toggles.

## Enable Giscus comments

The minimum working configuration is:

```ts
theme: {
  comments: {
    enabled: true,
    repo: 'owner/repo',
    repoId: '...',
    category: 'Announcements',
    categoryId: '...',
    mapping: 'pathname',
  },
}
```

The current starter consumes:

- `enabled`
- `repo`
- `repoId`
- `category`
- `categoryId`
- `mapping`
- `term`
- `number`
- `strict`
- `reactionsEnabled`
- `emitMetadata`
- `inputPosition`
- `theme`
- `lang`
- `loading`
- `crossorigin`

Validation to remember:

- `mapping: 'specific'` requires `term`
- `mapping: 'number'` requires a positive integer `number`

## Customize the About page content

Use:

```ts
i18n.locales.<code>.about
```

That configuration drives About page body text, sidebar labels, modal content, and About runtime strings.

## Toggle the Red Queen post effect

Use:

```ts
theme: {
  effects: {
    enableRedQueen: true,
  },
}
```

## Control home and blog counts

```ts
theme: {
  blogPageSize: 9,
  homeLatestCount: 3,
}
```

## Tune blog pagination

These fields are live in the current archive pagination:

- `windowSize`
- `showJumpThreshold`
- `jump.enabled`
- `jump.enterToGo`
- `style.enabled`
- `style.mode`
- `style.variants`
- `style.fixedVariant`

## One important boundary

Route atmospheres such as the Matrix home, Cyber blog list, AI blog post layout, and Hacker About layout are route-owned theme systems. Use config for supported toggles and content, not for arbitrary structural restyling.

## Read the full series

- [Starter Guide 1: Configure Your Site](/en/blog/starter-guide-1-configure-your-site/)
- [Starter Guide 2: Configure Languages and Routing](/en/blog/starter-guide-2-languages-and-routing/)
