---
tags: ['anglefeint', 'starter']
title: 'User Guide 2: Write Your First Post'
subtitle: 'Create a post, set its title and date, write the body, and organize it with headings, tags, code and formulas.'
description: 'Create posts using the default workflow and preview them locally; reference supported fields, Markdown and MDX, contents, tags, search and statistics.'
pubDate: '2026-03-07'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/cyber-03.webp'
---

This is part 2 of 8. [See the full tutorial sequence](/en/blog/starter-guide-1-configure-your-site/#tutorial-order) · [Look up configuration fields](/en/blog/config-reference/).

After [installation and site setup](/en/blog/starter-guide-1-configure-your-site/), daily writing mainly means editing files under `src/content/blog/`. Put per-post details such as title and date in frontmatter at the top of the file. The site name, default author and global switches remain in `src/site.config.ts`.

First create and preview a post using the default workflow, then choose languages if needed. Read the field reference later as required.

## 1. Create a post using the default workflow

In the project root, the directory containing `package.json`, run:

```bash
npm run new-post -- my-first-post
```

If you ran this in the first tutorial, open the existing file and continue writing. Existing files are skipped, not overwritten.

Without `--locales` or `ANGLEFEINT_LOCALES`, the command creates `src/content/blog/<locale>/my-first-post.md` for every enabled language. The initial configuration enables nine languages and therefore creates nine skeletons; changed language switches determine the current selection. It does not translate the body.

Choose the language file you want to edit. Its address is `/<locale>/blog/my-first-post/`, and its list is `/<locale>/blog/`. For example, English uses `/en/blog/my-first-post/` and Chinese `/zh/blog/my-first-post/`, provided the corresponding language is enabled. No manual route is needed.

`my-first-post` is the post slug. Use lowercase letters, numbers and hyphens, such as `learning-astro-1`; spaces, underscores and `/` are invalid. Renaming the file changes its URL without automatically redirecting the old address.

The command supplies a title, description, current UTC date and placeholder body. If `src/assets/blog/default-covers/` contains WebP, PNG or JPEG images, it also randomly chooses a cover. With no images, `heroImage` is omitted; no cover is downloaded. Replace the generated text, date and image afterward.

### Create only selected languages

These are optional alternatives to the default command. Select zh for Chinese only, or en,zh for English and Chinese. You do not need to run every example:

```bash
# Create Chinese only
npm run new-post -- my-first-post --locales zh

# Create English and Chinese
npm run new-post -- my-first-post --locales en,zh
```

When `--locales` is omitted, enabled project languages are used unless `ANGLEFEINT_LOCALES` is set. The complete precedence is `--locales` → `ANGLEFEINT_LOCALES` → enabled languages. New files from one invocation share the chosen cover; existing files remain unchanged.

The command creates files without translating or enabling languages. Put translations in the corresponding language directory with the same slug. The article language menu opens a matching translation when one exists; otherwise it opens the target language's blog list.

## 2. Set the title, description and dates

Open the generated file. YAML frontmatter is the section between the first two `---` lines; the body follows. You can begin with this example, retaining an existing `heroImage` if desired:

```md
---
title: 'My first post'
description: 'How I set up my blog with Anglefeint.'
pubDate: '2026-11-13'
tags: ['astro', 'notes']
---

This is my first post. I will write about what I learn and the problems I encounter.

## Why I started this blog

Write down ideas and leave useful clues for my future self.

### Start with a small problem

Today I will document installation and deployment.
```

Replace the date with the actual publication date. `title`, `description` and `pubDate` are required; `tags` is optional. The page already displays the title, so the body usually starts at `##` instead of repeating `# My first post`.

- `title` supplies the article title, list title and associated metadata.
- `description` supplies the introduction and page metadata. Without an explicit `context`, it also appears as the context line below the title.
- `pubDate` determines list order, newest first.
- After substantive changes to a published post, add a truthful `updatedDate`. It is displayed and preferred by the sitemap, but does not replace `pubDate` for sorting.

Use quoted `YYYY-MM-DD` dates. For an exact time, use ISO with a timezone, such as `'2026-11-13T09:00:00+08:00'`. Article pages display UTC dates, so timezone conversion can change the day.

**There is no draft or scheduled-publication filter.** Other-language skeletons also become public during the build. Complete the content you need and move unready files outside `src/content/blog/`. `draft: true`, a future `pubDate` and `search: false` cannot make an article private.

## 3. Write the body and organize it with headings

Leave an empty line between paragraphs. Common Markdown syntax includes:

```md
A paragraph can include **bold text**, _emphasis_ and `inline code`.

- First point
- Second point

[Link text](https://example.com/)

> This is a quotation.
```

Using `##` and `###` creates a table of contents automatically. It appears to the right on wide screens and before the body on narrow screens. Without level-two or level-three headings, it is hidden. Deeper headings may appear in the body but are not included in this contents list.

To disable the contents for one post, add this to its existing frontmatter:

```yaml
toc: false
```

Omitting `toc` inherits `theme.toc.enabled` from `src/site.config.ts`, which defaults to on. `toc: true` can override a global off setting. The contents uses compiler-provided Markdown headings; headings generated inside MDX components or raw HTML/JSX are not automatically collected.

### Organize posts with tags

Set `tags: ['astro', 'notes']` in frontmatter to generate tag links and the current language's tag archive without manual routes. For the enabled Chinese language, visit `/zh/tags/`.

Tags are case-sensitive: `Astro` and `astro` are different. Outer whitespace is trimmed, and duplicates within one post count once. Use generated links: Chinese and special characters have stable encoding, so do not guess paths. Renaming a tag changes its link.

Global `theme.tags.enabled: false` disables tag links and page generation without removing the posts.

## 4. Insert code and mathematical formulas

Use a three-backtick fence followed by the language name:

````md
```js
const message = 'Hello, world!';
console.log(message);
```
````

Article code blocks receive a copy button automatically, preserving line breaks and indentation. It copies text; JavaScript in a code block is not executed. If the clipboard is unavailable, a failure message appears and you can select the text manually. The button requires JavaScript.

Mathematics is enabled by default without another plugin installation. Use `$...$` inline, or put a display formula between separate `$$` lines:

```md
The saved amount is $C_{saved}$.

$$
\frac{a}{b} = x_1 + x_2
$$
```

Escape an ambiguous literal dollar sign as `\$`; inline and fenced code remain unchanged. KaTeX renders formulas during compilation. Its mathematical syntax is supported, not complete LaTeX documents. Invalid formulas fail compilation or building with source information. Long display formulas scroll horizontally.

Merge `math: { enabled: false }` into the existing `theme` in `src/site.config.ts` to disable mathematics globally. Keep titles and descriptions plain text rather than relying on mathematical rendering there.

### When should I use MDX?

Use `.md` for ordinary writing. Use `.mdx` when importing and rendering components. The theme collects both extensions and supports mathematics in MDX without another processor.

`new-post` creates `.md`. Rename it to `.mdx` when needed, retaining frontmatter. Do not keep `.md` and `.mdx` with the same basename in one language as separate posts: they resolve to the same article URL. Components and expressions must follow MDX syntax; changing the extension does not make arbitrary text valid MDX.

## 5. Add images

Body images can sit beside the article or in `public/images/`. Add the actual file before referencing it:

```md
![Describe what is in the photo](./photo.jpg)

![Describe what is in the photo](/images/photo.jpg)
```

The first path is relative to the article file. The second maps to `public/images/photo.jpg`, omitting `public` from the URL. The description becomes alternative text.

To change the cover, place `cover.jpg` beside the article and set `heroImage: ./cover.jpg` in frontmatter. This field accepts local images and may be omitted. Body images, covers and sharing images serve different purposes; changing the cover does not insert it into the body.

Ordinary body images open a larger preview when clicked or focused and activated with Enter/Space. Close it with Esc, the close button or backdrop. Covers and images inside links/buttons are excluded. The preview uses the image source already selected by the browser; it does not fetch a higher-resolution original or offer gallery navigation.

Normal dev, build and doctor runs, including CI, reuse correct responsive files and automatically prepare missing, stale or modified derivatives. Commit the original images and content. Committing `src/assets/blog/covers/manifest.json` and `generated/` allows reuse across checkouts, but these generated files are not a prerequisite for automatic preparation. Missing originals, unsafe paths and invalid image inputs still fail validation.

**Version note:** Automatic image preparation during normal builds and CI doctor runs requires 0.36.2 or later. With 0.36.1, first run dev or `prepare-covers` to prepare derivatives. Explicit `prepare-covers --check` and configuration sync remain read-only. Persistent derivatives cover article covers and fragment-local images; ordinary article body images retain the existing Markdown/MDX image pipeline.

## 6. Preview locally and prepare to publish

Run `npm run dev` and open `/<locale>/blog/my-first-post/`, such as English `/en/blog/my-first-post/` or Chinese `/zh/blog/my-first-post/`, below the printed terminal address. Check the title, date, body, contents, tags and images. For new translations, check language-switch destinations too.

Stop dev before publication, then run:

```bash
npm run doctor
npm run preview
```

doctor includes checks and a build; do not immediately repeat check or build after success. preview serves the built `dist/` without publishing. Fix build errors before deployment and do not deploy leftover output after failure.

### Why does search not find my post in dev?

The full-text index is generated during building. `npm run dev` shows a development notice in the search interface. Search for a sentence from the body in the built preview to check full search and article navigation.

By default, search covers article titles and bodies in the current language. Add `search: false` to frontmatter to exclude one post; omission includes it. This does not remove it from lists, RSS, sitemap or public links. Global `theme.search.enabled: false` disables both the entry point and index generation.

Rebuild and redeploy after content changes to update live search. Formulas and decorative UI are not search body content.

For types, defaults and currently unused fields, open the [article configuration reference](/en/blog/config-article/#frontmatter). Independent search rules are in the [search reference](/en/blog/config-search/#article-search). The following is a writing-oriented quick reference.

## Optional reference: other article fields

These are article frontmatter fields, not members of `site` or `theme` in `src/site.config.ts`. Ordinary posts need not fill them all.

### Title area and images

| Field       | Current behavior                                                                                                                                        |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `subtitle`  | Optional subtitle; not repeated when identical to the context line.                                                                                     |
| `context`   | Text below the title; defaults to `description`. `''` hides this line without changing page metadata.                                                   |
| `author`    | Per-post author; omitted or whitespace-only uses the site author.                                                                                       |
| `heroImage` | Optional local cover used by lists and article detail.                                                                                                  |
| `ogImage`   | Explicit sharing preview, before automatic images; accepts an article-relative image, a public path such as `/images/share.png`, or an HTTPS image URL. |

Posts without `ogImage` receive a 1200×630 sharing image containing title, author and site name. It does not replace the body cover. Global `theme.socialImage.enabled: false` stops automatic generation; explicit `ogImage` still works, while other posts fall back to the cover or site default. Rebuild and redeploy after changes; sharing platforms may cache old images.

### OUTPUT statistics and optional status text

| Field               | Current behavior                                                   |
| ------------------- | ------------------------------------------------------------------ |
| `wordCount`         | Overrides the automatic word/character count; nonnegative integer. |
| `tokenCount`        | Independently overrides the token estimate; nonnegative integer.   |
| `aiModel`           | Author-supplied model label in the title status area and OUTPUT.   |
| `aiMode`, `aiState` | Author-supplied mode and state text in the title status area.      |

Without overrides, counts are estimated from the body source: Han characters, kana and Hangul count individually; other text is mainly split on whitespace. Default tokens are `round(max(automaticWordCount, 1) × 1.3)`, an estimate rather than a real model tokenizer. Overriding `wordCount` does not recalculate tokens; set both separately if necessary.

Some Markdown is stripped, but this is not a complete count of visible prose: formulas and MDX source can affect it. Values of 1,000 or more display with one decimal and `k`. Model, mode and state only display text; they do not connect AI services, verify authorship or execute tasks.

### Compatibility and fields without current display effects

- `readMinutes`, `aiLatencyMs`, `aiConfidence`: accepted for old posts, but article pages no longer display reading time, latency or confidence. Their retained types are positive integer, nonnegative integer and number from 0–1 respectively. New posts need not set them.
- `canonicalTopic`: accepts a string but is not connected to pages, canonical URLs or exports; it creates no topic or article URL change.
- `sourceLinks`: accepts source URL arrays, supporting HTTP(S) and adding `https://` to bare domains. It currently validates data only, without displaying references or adding them to exports. Write Markdown links in the body for readers to see them.

Unsupported custom fields do not automatically create features; `draft`, for example, does not provide draft behavior. Prefer the supported fields and normal body syntax above.

## Tutorial navigation and configuration reference

[Previous: install the blog and make it yours](/en/blog/starter-guide-1-configure-your-site/) · [Next: add images to posts and fragments](/en/blog/starter-guide-images/) · [All eight tutorials](/en/blog/starter-guide-1-configure-your-site/#tutorial-order).

Related fields: [article fields, contents and OUTPUT](/en/blog/config-article/), [tags and lists](/en/blog/config-blog-list/), [search inclusion](/en/blog/config-search/). Full paths, defaults and limits are in the [reference index](/en/blog/config-reference/).
