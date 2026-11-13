---
tags: ['anglefeint', 'starter']
title: 'User Guide 4: Publish a Fragment'
subtitle: 'Record short thoughts in Markdown, add images or code, share stable links, and optionally enable comments.'
description: 'Enable Fragments, create and edit Markdown, use homepage previews, pagination and stable IDs, and optionally connect Giscus comments.'
pubDate: '2026-11-11'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

This is part 4 of 8. [See the full tutorial sequence](/en/blog/starter-guide-1-configure-your-site/#tutorial-order) · [Look up configuration fields](/en/blog/config-reference/).

A thought, image or code snippet need not become a full article. Fragments lists them chronologically on a dedicated page and offers a recent-content preview on the homepage.

This guide assumes the current integration starter. If an older project lacks these commands or features, follow the upgrade section in [installation](/en/blog/starter-guide-1-configure-your-site/) before continuing.

## 1. Enable the fragment list

Open `src/site.config.ts` and merge `fragments` into its existing `theme`. Edit matching fields rather than creating another object:

```ts
theme: {
  fragments: {
    enabled: true,
    pageSize: 20,
    comments: { enabled: false },
  },
},
```

| Field                              | Default and actual purpose                                                                                           |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `theme.fragments.enabled`          | `false`; enabling generates lists for enabled languages and allows homepage previews when that language has content. |
| `theme.fragments.pageSize`         | `20`; fragments per list page, an integer from 1–100, independent of blog page size.                                 |
| `theme.fragments.comments.enabled` | `false`; enables fragment comment dialogs, also requiring the Giscus repository fields below.                        |

Run local `npm run dev` and open `/<locale>/fragments/`, for example `/en/fragments/` or `/zh/fragments/`, under the printed address. The language must be enabled. An empty list is valid without a manually created page file. Disabling Fragments removes its generated list and homepage entry without deleting Markdown.

## 2. Create fragments using the default workflow

From the project root, run:

```bash
npm run new-fragment
```

Without `--locales` or `ANGLEFEINT_LOCALES`, the command creates skeletons of one fragment in all enabled languages: nine files initially. They live under `src/content/fragments/<locale>/`, sharing one ID and publication time per invocation, without automatic translation. The terminal prints actual paths. Names resemble `2026-11-13-q8Lm3XzP.md`, containing a UTC date and random ID. Open the generated file rather than manually recreating this example filename.

For Chinese only, optionally use `npm run new-fragment -- --locales zh`; use `--locales en,zh` for selected languages. Choose one alternative, not every example. These arguments do not enable languages. Before publication, move unfinished language skeletons outside the fragment content directory.

**Every invocation creates a new fragment.** Edit the original file to continue an existing fragment instead of rerunning creation. No slug argument is needed, and existing files are not overwritten.

The current starter includes `new-fragment`. If an old project lacks the script, first confirm the theme is updated, then use its CLI:

```bash
npx @anglefeint/astro-theme new-fragment
```

This is an alternative to the preceding creation command, not a second step for creating “the same” fragment.

## 3. Replace the placeholder body and keep the ID

Generated files begin with frontmatter; the body starts after the second `---`. Keep the generated `id` and `pubDate` and replace placeholder content. This shows the format only; do not replace your own ID with the example:

```md
---
id: 'q8Lm3XzP'
pubDate: '2026-11-13T09:00:00+08:00'
---

Today I solved a problem that had bothered me for a while. A small step worth recording.
```

Fragments currently support three frontmatter fields:

| Field     | How to fill it                                                                                                    |
| --------- | ----------------------------------------------------------------------------------------------------------------- |
| `id`      | Required, exactly eight case-sensitive ASCII letters or digits. The command generates it and checks existing IDs. |
| `pubDate` | Required, parseable publication date. Prefer the generated ISO timestamp, or specify a time and timezone.         |
| `title`   | Optional string displayed as the list card title; omission is valid.                                              |

To add a title, put `title: 'A small milestone'` in the same frontmatter. Fragments do not require the article `description` or provide article-cover `heroImage`; add images to the body.

Lists sort by `pubDate`, newest first, then ID for equal times, not filename. Displayed times use UTC and may differ from the entered local timezone. Editing the body or filename does not change sharing/comment identity; editing the date changes position and pagination.

**Keep the ID after publication.** Duplicates within one language are errors; unrelated fragments must not reuse an ID. Old UUIDs and longer IDs are invalid. Back up original content before addressing compatibility: old IDs, sharing links and comments are not automatically migrated. Bulk ID changes are not ordinary file housekeeping.

Only `.md` under `src/content/fragments/` is collected, not `.mdx`. There is no draft/future-date filter. Neither `draft: true` nor future dates hide content; keep unready fragments outside this directory.

## 4. Add images, code and formulas

Use ordinary Markdown paragraphs, links, lists and quotations. For example:

```md
![Screenshot of this progress](/images/fragments/progress.png)
```

First add `public/images/fragments/progress.png`. Alternatively put `photo.png` beside the fragment and reference `![Image description](./photo.png)`. More syntax, sizing and Git requirements are in [adding images](/en/blog/starter-guide-images/).

Retain fences and indentation for code:

````md
```js
const progress = {
  done: true,
};
```
````

Code blocks display content without executing JavaScript. Do not assume article code-copy or image-enlargement controls apply to fragments; the fragment list does not currently use those article interactions.

With global mathematics enabled, fragments support inline `$x_1$` and display formulas between separate `$$` lines. Build-time rendering fails on invalid formulas. `theme.math.enabled` disables mathematical processing globally. See [writing posts](/en/blog/starter-guide-2-languages-and-routing/) for syntax.

Normal dev, build and doctor runs, including CI, reuse correct responsive files and automatically prepare missing, stale or modified derivatives. Commit the original images and content. Committing `src/assets/blog/covers/manifest.json` and `generated/` allows reuse across checkouts, but these generated files are not a prerequisite for automatic preparation. Missing originals, unsafe paths and invalid image inputs still fail validation. Do not commit the body while omitting its source images.

**Version note:** Automatic image preparation during normal builds and CI doctor runs requires 0.36.2 or later. With 0.36.1, first run dev or `prepare-covers` to prepare derivatives. Explicit `prepare-covers --check` and configuration sync remain read-only.

## 5. Homepage preview and pagination

When Fragments is enabled and the current language has content, a pixel avatar appears below the homepage header. Open it to preview up to the latest three fragments. No separate homepage switch is required, and article `homeLatestCount` does not control this count.

The preview can contain text, the first usable image and an excerpt of the first code block, not the full body. Images/code are height-limited and cropped; additional images and blocks are omitted. Click the card to open its fragment. The footer's “preview count / current-language total →” opens the full list. With two fragments it shows `2 / 2`, rather than always three. Empty lists have no homepage entry.

The full list uses `theme.fragments.pageSize`. In the Chinese example its first page is `/zh/fragments/`, second `/zh/fragments/2/`. Pagination appearance and jump behavior share `theme.pagination`; blog `blogPageSize` does not set fragment page size.

Switching list languages opens the target language's first page, not necessarily the same translated fragment or page number. Translation counts may differ, and each language has its own total.

## 6. Share a fragment

Fragments appear in a list without individual detail pages. Share the card's date link or adjacent copy-link button, for example:

```text
https://your-domain.example/zh/fragments/#q8Lm3XzP
```

Replace the domain and ID. Date/copy links use the list root plus ID, independent of the fragment's current page. Adding content or changing dates/pageSize updates the positioning index after rebuilding and deployment.

If the target is on another page, JavaScript loads the language's static index on demand, navigates to that page and locates it. Ordinary pagination remains usable without JavaScript, but cross-page positioning and copying do not. If clipboard copying is blocked, a selectable link is offered for manual copying.

Do not use an address containing `/2/` as a permanent sharing link. Existing old pages can correct stale anchors, but a page number that no longer exists returns the usual 404; the positioning script does not control 404 pages. Deleted content, unknown IDs or index-load errors display a message rather than restoring removed fragments.

Fragment links share the language list's page-sharing image, without individual images per ID. See [sharing-image guidance](/en/blog/starter-guide-images/) to change the default.

## 7. Add a translation of the same fragment

To generate only Chinese and English skeletons, use this instead of the default command:

```bash
npm run new-fragment -- --locales zh,en
```

Files generated by one invocation share an ID and timestamp. Translate bodies yourself. `--locales` selects files without enabling languages. Precedence is `--locales` → `ANGLEFEINT_LOCALES` → enabled project languages; omitting arguments does not translate content.

To add English to an existing Chinese fragment, copy the original into `src/content/fragments/en/`, keep `id` and `pubDate`, and translate title/body. Rerunning creation assigns a new ID and cannot add a translation of the same identity. Translations may share an ID across languages; two files in one language may not.

Matching IDs share fragment discussions. Different IDs are not associated merely because text or filenames match.

## 8. Optionally enable comments

Leave comments off if you only want to publish notes. For reader replies, first follow the [Giscus tutorial](/en/blog/starter-guide-4-giscus-comments/) to prepare a public repository, Discussions, the application and category, obtain real IDs, then merge:

```ts
theme: {
  fragments: {
    enabled: true,
    comments: { enabled: true },
  },
  comments: {
    repo: 'yourname/your-repository',
    repoId: 'REPLACE_WITH_REPO_ID',
    category: 'Announcements',
    categoryId: 'REPLACE_WITH_CATEGORY_ID',
  },
},
```

Replace the account, repository, category and both ID placeholders. Retain other existing `theme.comments` settings. Missing repository/category fields cause configuration errors; placeholders do not prove remote settings are valid. No Giscus script paste or additional npm package is needed.

The fragment switch is `theme.fragments.comments.enabled`. You need not enable article `theme.comments.enabled` for fragments. If articles already use comments, retain their existing setting.

Fragments force `specific`, strict matching and `fragment/<id>`. They ignore article mapping, term, number, shareAcrossLocales and fixed lang. The interface follows the page language; matching IDs share discussions/reactions without translating comments. Other shared presentation settings come from `theme.comments`.

The client loads after clicking a list card's comment button. Closing retains the instance for reuse when reopening or switching fragments. Client failures or roughly 15 seconds without readiness provide retry. Loading text is not proof of a successful connection. Posting requires GitHub authorization.

Changing IDs does not migrate old comments, and deleting a fragment does not delete GitHub discussions. Assess discussion migration separately; the theme does not merge them automatically.

## 9. Check before publishing

Check content, time, homepage previews and pagination in dev. Stop dev before publication, then run:

```bash
npm run doctor
npm run preview
```

doctor includes local image preparation, checks and building; do not immediately repeat build after success. Use built preview to check sharing/positioning and images, plus comment dialogs if configured. Preview does not publish: deploy updated static files for live changes.

Fragments are not included in article full-text search or article RSS. Building produces the language's `/zh/fragments/index.md` (replace `zh` for others), combining its public fragments with IDs, dates, bodies and stable links, and includes it in AI-readable indexes. It is public output, not a private backup; comments are excluded.

- Missing list: check the Fragments and target-language switches.
- Missing avatar: confirm that the current language has fragments. Content in another language does not fill it.
- Creation fails on old files: check existing frontmatter ID formats; creation reads Markdown IDs to detect collisions.
- Duplicate-ID build error: check for duplicate files within one language; translations belong in another language directory.
- Image build failure: check that referenced originals exist, are committed and use safe, supported paths. Build repairs derivatives automatically; explicit `prepare-covers --check` only reports problems. See the [image tutorial](/en/blog/starter-guide-images/).
- Comment failure: check real repository IDs, application access, category, network and blocking. Do not repeatedly change fragment IDs.

For upgrades, see [the first tutorial](/en/blog/starter-guide-1-configure-your-site/).

## Tutorial navigation and configuration reference

[Previous: add images to posts and fragments](/en/blog/starter-guide-images/) · [Next: adjust pages and features](/en/blog/starter-guide-3-comments-about-and-theme-toggles/) · [All eight tutorials](/en/blog/starter-guide-1-configure-your-site/#tutorial-order).

Related fields: [fragment switches, pagination and content](/en/blog/config-fragments/), [fragment comments](/en/blog/config-comments/). Full paths, defaults and limits are in the [reference index](/en/blog/config-reference/).
