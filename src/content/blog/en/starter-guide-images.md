---
tags: ['anglefeint', 'starter']
title: 'User Guide 3: Add Images to Posts and Fragments'
subtitle: 'Add originals, use the correct paths, prepare responsive files, and choose covers and sharing previews.'
description: 'Understand the separate pipelines for article body images, covers, fragments and social images, including preparation, Git commits and deployment troubleshooting.'
pubDate: '2026-11-13'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/cyber-03.webp'
---

This is part 3 of 8. [See the full tutorial sequence](/en/blog/starter-guide-1-configure-your-site/#tutorial-order) · [Look up configuration fields](/en/blog/config-reference/).

You do not need to produce multiple sizes manually or replace article references with generated filenames. Add the original, reference it in an article or fragment, and let the local development service prepare responsive files.

This tutorial assumes the starter's default `src/` and `public/` directories. First distinguish the image's purpose:

| Purpose         | Where to configure it                                                    | Current handling                                                                                |
| --------------- | ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| Article body    | Markdown or MDX image                                                    | Existing Markdown/MDX pipeline; outside the persistent cover-preparation scope below.           |
| Article cover   | Article frontmatter `heroImage`                                          | Responsive files prepared locally and shared by lists and article detail.                       |
| Fragment image  | Markdown image, reference-style image or HTML `img` in the fragment body | Supported local images use the same persistent responsive files in lists and homepage previews. |
| Sharing preview | Article `ogImage` or site `site.ogImage`                                 | Separate sharing-image logic, not a cover thumbnail.                                            |

## 1. Add the original to the project

An image used by one post can sit beside it:

```text
src/content/blog/en/
  my-first-post.md
  photo.jpg
  cover.jpg
```

Fragments can likewise keep images beside their Markdown. Shared images can go in `public/images/`:

```text
public/images/
  shared-photo.jpg
  fragments/
    my-photo.png
```

Create these directories if absent. Prefer simple letters, numbers and hyphens in filenames, avoiding case confusion. URL paths use `/`, not local `C:\...`, `D:\...` or backslash paths. On a case-sensitive host, `Photo.jpg` and `photo.jpg` may be different files.

Keep the original. Generated WebP files are display derivatives, not replacement backups.

## 2. Insert an image in an article body

In the article Markdown, insert:

```md
![Describe what is in this photo](./photo.jpg)
```

`./photo.jpg` is relative to the article file; in the directory example, it is the neighboring `photo.jpg`. For a public file, use:

```md
![Describe what is in this photo](/images/shared-photo.jpg)
```

This corresponds to `public/images/shared-photo.jpg`, omitting `public` from the URL. Bracketed text is alternative text: describe the image rather than writing only “image.”

Ordinary body images support clicking or focus plus Enter/Space to open a larger preview. Esc, the close button or backdrop closes it. Covers and images inside links/buttons are excluded. The preview uses the browser-selected source rather than downloading a higher-resolution original, and is not a gallery.

Running `prepare-covers` does not mean every body image has been compressed. It processes cover pools, article cover references and fragment-local images. A public image in an ordinary article body may still download the original file. Choose appropriate body-image sizes, especially avoiding multi-megabyte screenshots.

## 3. Set an article cover

Put `cover.jpg` beside the article, then add or edit its existing frontmatter:

```yaml
heroImage: ./cover.jpg
```

`heroImage` is optional. When provided, it must reference a local project image, not a direct HTTPS URL. Do not treat `/images/cover.jpg` as a public URL for this field: its path rules differ from body images.

For centralized cover management, use `src/assets/blog/covers/originals/`. With the article at `src/content/blog/en/my-first-post.md` and original at `src/assets/blog/covers/originals/my-cover.jpg`, write:

```yaml
heroImage: ../../../assets/blog/covers/originals/my-cover.jpg
```

The cover does not insert itself into the body. It appears in blog/tag lists and the article cover area. Layouts may crop the visible area, but generated files retain their original ratio and do not automatically choose a person or subject as the focal point.

Automatic `new-post` cover selection only reads `src/assets/blog/default-covers/`. Putting an image in `covers/originals/` does not add it to that random selection; explicitly reference new originals in the article.

## 4. Add images to fragments

With `theme.fragments.enabled: false`, dev, build and prepare-covers/doctor skip image references in Fragment content. Originals and derivatives are no longer required for images included solely through those references. Article-cover references and the `src/assets/blog/default-covers/` and `src/assets/blog/covers/originals/` pools still undergo preparation and validation, even if an image is used only in Fragments. Disabling deletes no files; re-enabling restores Fragment image processing.

**Version note:** Disabled-content image isolation requires 0.36.1 or later; 0.36.0 does not include it. Do not assume older versions provide this behavior.

Put the original at `public/images/fragments/my-photo.png`, then write this in an existing fragment body:

```md
![Describe the image accompanying this fragment](/images/fragments/my-photo.png)
```

Alternatively put `photo.png` beside the fragment and use `![Image description](./photo.png)`. Adding a file to public alone does not trigger a universal image-library scan: reference it in an actual fragment.

Reference-style images are supported:

```md
![Image description][photo]

[photo]: /images/fragments/my-photo.png
```

Use HTML when you need manual dimensions:

```html
<img src="/images/fragments/my-photo.png" alt="Image description" width="640" height="360" />
```

These dimensions are examples; use your image's actual proportions. Supported local images receive missing width/height attributes. Existing dimensions are retained; if only one is supplied, the other is computed from the source ratio. Incorrect existing dimensions are not corrected automatically.

The first image on each fragment-list page loads with priority; other images and homepage thumbnails use lazy loading. Homepage previews have a maximum height and crop overflow. They are not complete image viewers: click the card to open the original fragment. See [publishing fragments](/en/blog/starter-guide-5-fragments/) for creation, stable IDs and comments.

## 5. Prepare responsive files and run explicit checks

After first referencing an image or replacing its original, start the local development server from the project root:

```bash
npm run dev
```

Normal `npm run dev`, `npm run build` and `npm run doctor`, including CI, prepare missing, stale or modified responsive files automatically. dev also reacts to changes in relevant sources and references. To prepare images without starting a page or full checks, stop dev and run:

```bash
npx @anglefeint/astro-theme prepare-covers
```

To validate existing files without generating replacements:

```bash
npx @anglefeint/astro-theme prepare-covers --check
```

The process need not re-encode everything. It uses source, recipe and output hashes to determine reuse. Changed originals update their derivatives; individual missing or modified outputs are repaired selectively. Do not edit the manifest, rename generated files or put generated URLs back into articles.

Current preparation rules:

- Static raster images become WebP with quality 80: a lossy encoding target, not a lossless pixel guarantee.
- Candidate widths are 400, 640, 800, 960 and 1200px, retaining sizes suitable for the source. Its width is added when needed up to 1200px, without upscaling small images.
- EXIF orientation is corrected, aspect ratio retained, and no alternate composition crops are generated.
- SVG and multiframe animation retain their original formats rather than becoming static WebP. A single-frame GIF may be processed as static; extension alone does not determine passthrough.
- The default-cover pool, originals pool and actual references define the scope. Not every public image is converted.

The browser chooses candidates using `srcset`, `sizes`, display size and pixel density. Users need not maintain separate size directories. The maximum candidate is 1200px, so large high-density screens are not guaranteed original-level detail.

## 6. What should I commit, and what happens during deployment?

Prepared files are organized as follows:

```text
src/assets/blog/covers/
  originals/      # If using this originals directory
  manifest.json  # Source, dimensions, recipe and output hashes
  generated/     # Persistent responsive files
```

Commit article/fragment Markdown and newly added or replaced originals. Keeping `manifest.json` and `generated/` in Git is recommended for reuse across checkouts; build can also prepare them when absent. Automatic preparation never commits files to Git for you.

Commit originals stored in public or beside articles too, not only originals/. Fragment derivatives also live in this directory despite its blog/covers name.

Stop dev before publication and run local `npm run doctor`. After success, use `npm run preview` to inspect the build. doctor already includes building, so another immediate build is unnecessary. Hosting still uses `npm run build`, output `dist`, with all files deployed.

**Deployment builds and CI doctor prepare supported image derivatives automatically**, reusing correct output and repairing missing, stale or modified files. This does not require a deployment-platform image cache. Missing originals, unsafe paths, unsupported inputs and generation errors still fail validation. Explicit `prepare-covers --check` and configuration sync remain read-only.

**Version note:** Automatic image preparation during normal builds and CI doctor runs requires 0.36.2 or later. With 0.36.1, first run dev or `prepare-covers` to prepare derivatives. Explicit `prepare-covers --check` and configuration sync remain read-only.

Used derivatives are copied to `_blog-covers/` in build output. Do not upload only HTML or omit that directory. Old, unused generated files are not automatically deleted; check references before cleaning and avoid deleting needed originals.

See [article heroImage/ogImage](/en/blog/config-article/#frontmatter) and [fragment preview rules](/en/blog/config-fragments/#preview-and-links) for field distinctions.

## 7. Which image appears when sharing a link?

A sharing image is the preview on a link card, distinct from the visible page cover.

By default, each article generates a 1200×630 PNG during building, containing title, author and site name. No image service or browser generation is required. Rebuild and redeploy after changing those values. `theme.footer.showCredits` also controls theme credit on automatically generated sharing images, without modifying uploaded custom images.

### Choose a sharing image for one article

Put `share.png` beside the article and add:

```yaml
ogImage: ./share.png
```

Or use `public/images/share.png` with `ogImage: /images/share.png`. HTTPS image URLs are also supported. The article image schema handles relative files; public paths are checked for file existence. Remote availability depends on the other server.

### Set a fallback for pages without their own image

Merge into the existing top-level `site` in `src/site.config.ts`:

```ts
site: {
  ogImage: '/images/site-share.jpg',
},
```

First add `public/images/site-share.jpg`. `site.ogImage` also accepts HTTPS URLs. Omission or a blank value uses the theme's built-in 1200×630 default. Article-relative paths are not valid here.

Current priority:

1. Explicit article `ogImage`.
2. Generated article sharing image while enabled.
3. Article `heroImage` when `theme.socialImage.enabled` is off.
4. `site.ogImage` for a page without a specific image, then the built-in default.

Changing only `site.ogImage` therefore does not replace automatic article sharing images. Fragment pages and their `#ID` links share the site fallback, without individual cards generated per fragment.

Automatic sharing images live in `dist/_social/`. Platforms read deployed metadata and may cache old images; seeing a new image locally does not mean their previews refresh immediately.

## 8. Troubleshoot image problems

| Symptom                                        | Check first                                                                                                            |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Image missing                                  | File existence, exact case and paths relative to the current Markdown; omit `public` from public URLs.                 |
| Cover preparation fails                        | `heroImage` must be a local project file rather than remote/public URL; see the full terminal error.                   |
| missing/stale/modified derivatives             | Run build or prepare-covers to repair them; --check is read-only. Verify originals if repair fails.                    |
| Public file has no generated sizes             | Is it actually referenced by a fragment? Ordinary article-body public images are outside this derivative scan.         |
| GIF/SVG remains large                          | Multiframe/vector files pass through; this command neither converts animations to video nor compresses them.           |
| Remote fragment image is slow or shifts layout | Remote files are not converted or measured locally. Optimize the source and supply correct dimensions.                 |
| Works locally but not after deployment         | Check that originals are committed, build succeeds, all dist files are deployed, and resource paths are not rewritten. |
| Sharing preview stays old                      | Check rebuild/deployment, article-specific image priority and sharing-platform caches.                                 |

If you customize Astro srcDir, publicDir or base-prefixed sources, prepare through that project's dev configuration. Standalone prepare-covers uses the default directories. Partial image support for base paths does not imply whole-theme support for arbitrary subdirectory deployments.

For installation/upgrades, see [install the blog and make it yours](/en/blog/starter-guide-1-configure-your-site/). See [write your first post](/en/blog/starter-guide-2-languages-and-routing/) for article fields and body syntax.

## Tutorial navigation and configuration reference

[Previous: write your first post](/en/blog/starter-guide-2-languages-and-routing/) · [Next: publish a fragment](/en/blog/starter-guide-5-fragments/) · [All eight tutorials](/en/blog/starter-guide-1-configure-your-site/#tutorial-order).

Related fields: [article covers and sharing images](/en/blog/config-article/), [fragment image previews](/en/blog/config-fragments/), [site sharing fallback](/en/blog/config-site-chrome/). Full paths, defaults and limits are in the [reference index](/en/blog/config-reference/).
