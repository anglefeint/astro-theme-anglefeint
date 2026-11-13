---
tags: ['anglefeint', 'starter']
title: 'User Guide 6: Let Readers Leave Comments'
subtitle: 'Connect Giscus, enable article or fragment comments, and choose whether translations share discussions.'
description: 'Prepare Giscus and configure mappings, multilingual discussion sharing and fragment-specific behavior, with troubleshooting for configuration and loading.'
pubDate: '2026-11-10'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

This is part 6 of 8. [See the full tutorial sequence](/en/blog/starter-guide-1-configure-your-site/#tutorial-order) · [Look up configuration fields](/en/blog/config-reference/).

Anglefeint uses Giscus for comments, off by default. Articles and fragments have separate switches. Comments and reactions are stored in your configured GitHub Discussions, without a separate database for the static blog.

Configure the repository once, then choose whether translated articles share discussions. Do not edit article templates or paste a script into each article.

## 1. Prepare a GitHub repository and category

Open the [Giscus configuration page in Simplified Chinese](https://giscus.app/zh-CN), then:

1. Choose your public GitHub repository, either the blog repository or a separate comments repository.
2. Enable Discussions.
3. Install and authorize the Giscus application for that repository.
4. Select a discussion category and note the generated repository/category values.

Giscus generates a script. The theme only needs its field values:

| Generated Giscus attribute | Theme setting                                                  |
| -------------------------- | -------------------------------------------------------------- |
| `data-repo`                | `theme.comments.repo`, such as `yourname/your-repository`.     |
| `data-repo-id`             | `theme.comments.repoId`, the repository ID rather than name.   |
| `data-category`            | `theme.comments.category`, the actual category name.           |
| `data-category-id`         | `theme.comments.categoryId`, the category ID rather than name. |

Do not use example IDs, repository URLs or your username as actual IDs. The category need not be Announcements; use the selected name and matching ID. No Giscus npm package, GitHub token or password is required.

Comments depend on external Giscus/GitHub connectivity. Posting requires GitHub authorization, and visitors can also participate directly in the GitHub Discussion. The theme does not provide anonymous commenting. See [Giscus documentation](https://giscus.app/zh-CN) for service behavior.

## 2. Enable ordinary article comments

Merge into the existing `defineThemeConfig({...})` in `src/site.config.ts`:

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

Replace account, repository, category and both ID placeholders. Edit existing `theme`/`comments` fields without duplicating their objects or removing other settings.

This enables article comments associated by URL pathname. `/zh/blog/my-first-post/` and `/en/blog/my-first-post/` are different paths, so they do not share a discussion by default. Cross-language sharing defaults to `false`. If it was previously enabled, restore its mapping as described below rather than changing only this example.

The article component appears only when comments are enabled and all four repository/category fields are supplied. Missing values may leave no comment region. Placeholders generally satisfy local nonempty checks but do not verify remote setup. No per-article frontmatter switch exists; `comments: false` cannot disable only one article.

Example `lang: ''` makes the interface follow the article language. The actual theme default is fixed `lang: 'en'`, so clear it explicitly to follow the page. `zh` maps to `zh-CN`, `zh-hant` to `zh-TW`, and `pt-br` to `pt`. This changes interface text, not readers' comments.

## 3. Confirm that comments are connected

Save configuration, open an article locally and find its comment area. Check the repository/discussion and the login, comment and reaction controls. An initially empty discussion does not imply failure: Giscus may create it on the first comment/reaction, not merely on opening the page.

Stop dev before publication, then run:

```bash
npm run doctor
npm run preview
```

doctor includes checking and building; another immediate build is unnecessary. preview serves local output without publishing; production needs redeployment. A successful build establishes that local configuration/pages can be generated, not that real permissions and service connectivity work in a browser.

Article `loading: 'lazy'` is the Giscus iframe loading hint. It does not mean the theme waits for scrolling before outputting the client script: articles include asynchronous Giscus script loading. Fragment dialogs instead load the client after clicking a comment button.

See the [Giscus reference](/en/blog/config-comments/#connection) for every parameter's type, default and example. Existing discussions especially require checking mapping/sharing constraints.

## 4. Choose how articles map to discussions

Keep `pathname` for ordinary use. Understand the mapping before changing an existing comment site:

| `mapping`    | Association and limits                                                                                            |
| ------------ | ----------------------------------------------------------------------------------------------------------------- |
| `'pathname'` | URL path without the domain; changing article paths may change discussions.                                       |
| `'url'`      | Full URL; domain changes can alter association.                                                                   |
| `'title'`    | Browser document title; changing article or site titles can affect association.                                   |
| `'og:title'` | Page Open Graph title.                                                                                            |
| `'specific'` | A configured fixed `term`, required to be nonempty outside sharing mode.                                          |
| `'number'`   | Existing discussion number in `number`, not an issue number; this mode does not create discussions automatically. |

Giscus looks up the discussions; the theme keeps no local comments database. `strict: '1'` reduces fuzzy matching of similar titles; its default is `'0'`.

Outside sharing mode, `term` and `number` are global settings. A fixed term in specific mode makes every article using that configuration seek one discussion. Number mode likewise points to one fixed discussion. Neither automatically assigns separate discussions per post.

With article comments enabled, specific requires a nonempty trimmed term, and number requires a positive integer string such as `'42'`, not number `42`, `'0'` or a decimal. Invalid values fail configuration checks and can prevent dev/build.

## 5. Share comments between translations of one article

To share a discussion between Chinese and English translations while keeping different posts separate, retain real connection fields and merge:

```ts
theme: {
  comments: {
    // 保留 enabled: true 和自己的 repo、repoId、category、categoryId。
    shareAcrossLocales: true,
    mapping: 'specific',
    term: '',
    number: '',
    strict: '1',
    lang: '',
  },
},
```

Sharing requires specific, empty term/number, and strict string `'1'`. Empty term is deliberate: the article fills it with its full slug without the language directory, rather than sharing one fixed term across all posts.

For example, `src/content/blog/zh/my-first-post.md` and `src/content/blog/en/my-first-post.md` both use `my-first-post`. Nested `guides/setup` and `other/setup` retain their full paths and remain different discussions. Matching slugs identify translations, not similar titles or bodies.

With sharing and article comments enabled, wrong mapping, nonempty term/number or strict other than `'1'` explicitly fails. Standard routes pass the slug. Custom BlogPost callers must provide a valid articleSlug too. Interface language still follows lang; comment bodies are not translated.

Check two translations of one post and then another post. The first pair should share a discussion and the third remain independent. Interface language or comment-frame appearance alone does not prove sharing.

### What happens to existing comments?

The theme does not merge, move or delete old discussions. Enabling sharing may select another discussion; old comments can remain on GitHub without appearing under the new association.

Before switching, save the original repository, category, mapping, term, number and strict. To restore, set `shareAcrossLocales: false` and restore those original values. Turning sharing off while retaining specific with an empty term causes an error. If migration is necessary, inspect GitHub data and associations first; no automatic migration is provided.

## 6. Enable fragment comments independently

For fragment-only comments, supply the same repository/category connection and set:

```ts
theme: {
  fragments: {
    enabled: true,
    comments: { enabled: true },
  },
  comments: {
    enabled: false,
    repo: 'yourname/your-repository',
    repoId: 'REPLACE_WITH_REPO_ID',
    category: 'Announcements',
    categoryId: 'REPLACE_WITH_CATEGORY_ID',
  },
},
```

`theme.comments.enabled: false` disables articles only. Fragments use `theme.fragments.comments.enabled`. Keep article comments true if also needed; fragment setup does not require changing existing article mappings.

Fragments force specific, strict matching and `fragment/<id>`, ignoring article mapping, term, number, shareAcrossLocales and fixed lang. The interface follows the current page, and translations with the same ID share a discussion. Reactions, color theme and input position reuse common settings. Missing any of the four connection values causes an explicit fragment configuration error.

The first click inserts the client; closing retains it for reopening or switching fragments. Failure or about 15 seconds without readiness offers retry. Loading text is not proof of connection. See [publishing fragments](/en/blog/starter-guide-5-fragments/) for IDs and sharing rules.

## Optional display and loading settings

All fields below belong to `theme.comments`; defaults usually suffice.

| Field              | Theme default | Purpose                                                                                                                          |
| ------------------ | ------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `reactionsEnabled` | `'1'`         | Main discussion-post reactions; `'0'` disables the area.                                                                         |
| `inputPosition`    | `'bottom'`    | Input above or below comments: `'top'`/`'bottom'`.                                                                               |
| `theme`            | `'dark'`      | Giscus iframe theme identifier; use its supported values, not a blog-theme switch.                                               |
| `strict`           | `'0'`         | Article strict matching; shared articles and fragments require `'1'`.                                                            |
| `emitMetadata`     | `'0'`         | Giscus sends discussion metadata to its parent, not article publication metadata. Fragments force it on for readiness detection. |
| `lang`             | `'en'`        | Fixed article-comment language; `''` follows the page. Fragments always follow their page.                                       |
| `loading`          | `'lazy'`      | Article iframe `'lazy'`/`'eager'`; fragment iframes use eager after opening.                                                     |
| `crossorigin`      | `'anonymous'` | Script cross-origin mode, `'anonymous'`/`'use-credentials'`; normally unchanged, and not a replacement for GitHub login.         |

`enabled` and `shareAcrossLocales` are booleans. `strict`, `reactionsEnabled` and `emitMetadata` use strings `'0'`/`'1'`. Do not mix their types.

## Troubleshoot missing or mismatched comments

| Symptom                                         | Check in this order                                                                                        |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| No article comment region                       | Article enabled, all four connection values present; fragment switches do not enable articles.             |
| Enabling fragments causes a configuration error | Supply all repository/category values, not only the switch.                                                |
| Remote error or persistent loading              | Real IDs, public repository, Discussions, app authorization, matching category, connectivity and blockers. |
| Different posts show one discussion             | Global fixed term/number, sharing configuration and Giscus's actual match result.                          |
| Translations do not share                       | shareAcrossLocales, matching slugs and sharing mapping constraints.                                        |
| Comments “disappear” after changing mapping     | Inspect old GitHub discussions first; do not repeatedly rename, change IDs or delete data.                 |
| Comment interface stays English                 | Article lang defaults en; set `''` to follow the page. This does not translate replies.                    |
| Local changes not live                          | Rebuild and deploy; confirm the live site uses the new configuration.                                      |

Disable article comments with `theme.comments.enabled: false` and fragment comments with `theme.fragments.comments.enabled: false`. They remove the corresponding entry/embed without deleting GitHub Discussions. The updater does not migrate discussions. Preserve mappings before upgrading and verify afterward; see [installation](/en/blog/starter-guide-1-configure-your-site/).

## Tutorial navigation and configuration reference

[Previous: adjust pages and features](/en/blog/starter-guide-3-comments-about-and-theme-toggles/) · [Next: make the blog available in more languages](/en/blog/starter-guide-languages/) · [All eight tutorials](/en/blog/starter-guide-1-configure-your-site/#tutorial-order).

Related fields: [Giscus parameters and shared discussions](/en/blog/config-comments/), [fragment comment switch](/en/blog/config-fragments/). Full paths, defaults and limits are in the [reference index](/en/blog/config-reference/).
