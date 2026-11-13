---
tags: ['anglefeint', 'starter']
title: 'User Guide 8: Publish the Blog on Your Own Domain'
subtitle: 'Confirm the public address, finish local checks and image preparation, deploy static files and connect your domain.'
description: 'Static deployment, domains and environment overrides, build/image files, search and public exports, plus optional GA4.'
pubDate: '2026-11-13'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/ai-01.webp'
---

This is part 8 of 8. [See the full tutorial sequence](/en/blog/starter-guide-1-configure-your-site/#tutorial-order) · [Look up configuration fields](/en/blog/config-reference/).

Once the blog works locally, publication involves three tasks: confirm the final domain, generate all static files, and have hosting serve them at that domain. The theme does not buy domains, change DNS or log in to hosting for you.

The starter builds a static website by default. Production needs neither a persistent Node.js service nor an SSR adapter for these pages. This guide assumes npm and default output `dist/`.

## 1. Confirm the public address

Prepare a domain you control, such as `https://blog.example.com`. Merge into existing top-level `site` in `src/site.config.ts`:

```ts
site: {
  url: 'https://blog.example.com',
},
```

Use the final public address, not localhost, an article URL or a hosting dashboard URL. Retain the other site settings.

This value generates canonical URLs, RSS, sitemap, sharing images and public content links. It neither changes the local dev address nor automatically points an unbound domain at your website.

### Check old environment overrides

`PUBLIC_SITE_URL` in `.env`, applicable `.env.*` files or hosting build settings overrides the configuration. If changing site.url leaves the old domain, inspect all these locations. Ordinary dev uses development mode and build uses production; custom `--mode` also reads its corresponding files, so checking only `.env` is insufficient.

Remove unnecessary overrides and use site.url, or set correct values in each build environment. Rebuild after changes rather than manually editing one URL in old output.

### Deploy at the domain root

The theme currently assumes a domain root such as `https://blog.example.com/`. Subdirectories such as `https://example.com/my-blog/` require further adaptation. Astro base alone does not establish compatibility for every page/resource.

Choose hosting that serves a root website, static directory index.html files and direct subpage URLs. With GitHub Pages, prefer its site-domain/custom-domain setup. A generic project-subdirectory tutorial does not prove that deployment mode is supported here. See [Astro deployment documentation](https://docs.astro.build/en/guides/deploy/) and its hosting guides.

## 2. Prepare all required source files

Deploy your own blog project and the branch holding your actual content, rather than treating the theme maintainer demo as a personal blog. Include project configuration, content, dependency manifests and resources.

After adding/replacing local covers or fragment images, prepare responsive files using local dev/doctor, then commit:

- Articles, fragments, custom pages and `src/site.config.ts`.
- Referenced originals, public images, icons and required music/resources.
- All `src/assets/blog/covers/`, including manifest.json, generated/ and used originals/.
- `package.json`, `package-lock.json` and original Astro/hosting configuration.

Originals may also live beside articles or in public; commit those locations too. See [images](/en/blog/starter-guide-images/) for preparation details.

**Ordinary deployment builds validate and copy persistent images without generating replacements.** CI doctor also only validates. Missing, stale or modified files cause failure. Prepare and commit locally before redeployment rather than relying on host image caches.

Git-based deployment does not require committing node_modules, `.astro` or dist; the platform installs dependencies and builds output. Do not upload local dependencies as a static website. If environment files are not committed, configure necessary variables on the platform. PUBLIC_ values are public site information, not a place for secrets.

## 3. Check and preview actual build output locally

Stop dev with Ctrl+C, confirm the terminal is at the project root, then run:

```bash
npm run doctor
npm run preview
```

Open preview's printed address. Check home, posts, images, language menu and article search, plus entries for newly enabled languages/pages. External services such as comments require actual browser connectivity; a passing build cannot prove remote permissions.

The commands have different responsibilities:

| Command           | Responsibility                                                                                     |
| ----------------- | -------------------------------------------------------------------------------------------------- |
| `npm run dev`     | Local development and related image preparation; no built full-text index.                         |
| `npm run doctor`  | Local image preparation, Astro checks and build; About runtime configuration checked when enabled. |
| `npm run check`   | Calls the same doctor in the current starter; do not run both consecutively.                       |
| `npm run build`   | Builds the site, validating persistent images without doctor's local generation step.              |
| `npm run preview` | Serves existing dist without building or publishing.                                               |

Fix any error before deployment. Do not publish leftover dist after failure. doctor already produces a build, so immediately repeating check/build is unnecessary. Stop preview with Ctrl+C.

## 4. Deploy the entire static output

You can connect Git for hosted builds or upload a local build manually. Both serve equivalent static output.

### Option 1: Build from Git on the host

Connect your repository and configure:

| Setting          | Current starter value                                                                       |
| ---------------- | ------------------------------------------------------------------------------------------- |
| Build branch     | The branch where you maintain blog content.                                                 |
| Project root     | Directory containing the blog's package.json, not necessarily repository root.              |
| Node.js          | Meets project/dependency requirements; current starter specifies 22.12.0 or newer.          |
| Installation     | npm projects can use `npm ci`, requiring committed package-lock.json matching package.json. |
| Build command    | `npm run build`                                                                             |
| Output directory | `dist`, relative to project root.                                                           |

If hosting already installs dependencies, do not add a duplicate install command. If a full script is required, install before build. Do not stack doctor, check and build or add server-side image generation to conceal missing commits.

Use the platform's actual framework preset, branch and installation controls. Choose static output. npm run dev and npm run preview are not production startup commands.

### Option 2: Upload a local build

After local doctor succeeds, upload all `dist/` contents to the site's document root. Select dist if asked for an output directory; upload files inside it if asked for website files. Do not add an extra dist path layer.

Include `_astro/`, `_blog-covers/`, `_social/`, search indexes and every other generated file in addition to HTML. Underscore directories are not disposable temporary files; omitting them breaks styles, scripts, images or search.

Use complete deployment/replacement when republishing. Merely overlaying new files can retain deleted posts, old pages and disabled languages. Deleting local Markdown does not delete previously uploaded HTML automatically.

## 5. Connect the domain on the host, then configure DNS

Add the custom domain on the hosting platform. Use the actual records it supplies in your domain's DNS management. Apex/subdomain record types and targets may differ; do not copy an example IP.

Wait for domain validation and HTTPS certificate readiness, then open the public address. If using apex, www or other alternative hosts, select a primary address, redirect alternatives at the host and set site.url to the primary.

Canonical metadata is not an HTTP redirect. site.url does not perform DNS changes, certificate issuance or multi-domain redirects. Hosting/domain settings handle those. Rebuild and redeploy after changing the primary domain, updating any old environment override too.

## 6. Check published pages and public output

Open a direct article URL through the public domain and refresh it. Navigation from home alone does not prove direct paths work. Check images, code styles, language switching and search. Features tested only in dev must also be checked in the built site.

The theme already supplies these static outputs; do not install duplicate integrations:

| Example address                                | Purpose                                                              |
| ---------------------------------------------- | -------------------------------------------------------------------- |
| `/robots.txt`                                  | Crawl rules and sitemap address, not access control.                 |
| `/sitemap-index.xml`                           | Sitemap entry; links should use the public domain.                   |
| `/zh/rss.xml`                                  | Chinese article feed; replace zh for other enabled languages.        |
| `/llms.txt`                                    | Main AI-readable index.                                              |
| `/zh/llms.txt`, `/zh/llms-full.txt`            | Language index/full-text bundle when exportable content exists.      |
| `/zh/blog/my-first-post/index.md`              | Public article Markdown; replace the example slug.                   |
| `/zh/fragments/index.md`, `/zh/about/index.md` | Public content when pages are enabled and satisfy export conditions. |

Sitemap article dates use updatedDate, then pubDate, without inventing a new date per build. Disabled languages/pages need not have exports. Article search: false is not privacy and does not suppress other public output.

AI exports contain public articles and enabled Fragments/About. Comments and decorative tools are excluded. Actual noindex or off-site-canonical pages are excluded. A user file conflicting with a generated path stops the build instead of being overwritten. Rebuilt export files and discovery links must be deployed together.

Metadata and text improve discovery/readability but do not guarantee indexing, AI citations or traffic.

### Hosting response headers

The build merges `X-Robots-Tag: noindex` for `/:locale/terminal/*` into dist/_headers, preserving rules without changing source public/_headers. Compatible hosts apply that file; others need equivalent header configuration.

Astro preview does not simulate hosting _headers. Check the actual production response to verify headers rather than only the file's existence. This rule does not require a Node server.

See [environment priority](/en/blog/config-site-chrome/#environment) and [public supplement fields](/en/blog/config-analytics-ai/#supplement) for exact definitions.

## 7. Optionally add AI-readable context

Normal publication needs no extra configuration. To explain the site or link resources, merge at the top level:

```ts
aiReadableContent: {
  notes: '本站记录个人学习过程，内容可能持续修订。',
  links: [{ label: '项目主页', href: 'https://example.com/project' }],
},
```

notes accepts Markdown; links require label and href. Use public HTTP(S) URLs. Relative targets, including root paths, resolve against the site address. This is public site context, not replacement article text or an article privacy restriction.

Use `i18n.locales.<代码>.aiReadableContent` for language overrides. For example, provide Chinese notes without extra links:

```ts
i18n: {
  locales: {
    zh: {
      aiReadableContent: {
        notes: '中文内容是作者自己的学习笔记。',
        links: [],
      },
    },
  },
},
```

Omitted fields inherit global values. notes: '' or links: [] explicitly hides that part. Supplements enter relevant indexes, full-text bundles and article Markdown. Only enter information you intend to publish, and rebuild after changes.

## 8. Optionally enable GA4 analytics

Google analytics scripts are off by default. Obtain the G- Measurement ID from your Google Analytics web data stream; see [Google's instructions](https://support.google.com/analytics/answer/9539598). The theme only accepts G- IDs, not numeric property IDs, GTM container IDs or other identifiers.

Merge at the top level alongside site:

```ts
analytics: {
  googleAnalyticsId: 'G-XXXXXXXXXX',
},
```

Replace the placeholder with your real ID; an empty string disables it. Invalid formatting causes configuration errors. One ID can cover every language, distinguished by URL paths. Do not paste a separate script per atmosphere/language.

The loader appears only in production builds with an ID, not dev. It skips reporting on localhost, its subdomains and loopback addresses. LAN IPs or remote preview domains can report; not all previews are excluded.

After redeployment, visit the public address and check GA4 realtime reports. Script blocking, networks and analytics settings affect results. Avoid installing the same analytics through manual code, GTM or another tool as well. No consent-management UI is bundled; add a suitable solution if needed.

## 9. Troubleshoot deployment

| Symptom                                    | Check first                                                                                  |
| ------------------------------------------ | -------------------------------------------------------------------------------------------- |
| npm ci fails                               | Node/dependency requirements and a committed package-lock consistent with package.json.      |
| Image missing/stale/modified               | Prepare locally, commit originals/manifest/generated, and do not bypass platform validation. |
| Build succeeds but pages return 404        | Output directory, branch, root/index support and unsupported subpath deployment.             |
| Home works but article refresh returns 404 | Real static subpaths, full output publication and accidental SPA fallbacks.                  |
| Missing styles, images or search           | Full dist deployment, resource directories and path rewriting.                               |
| Canonical/RSS still uses example domain    | site.url, PUBLIC_SITE_URL, dotenv mode and a new build/deployment.                           |
| Configuration changes not live             | Correct project/branch/latest commit, not only local edits.                                  |
| Deleted post remains reachable             | Stale output/cache; check full replacement and hosting caches.                               |
| No GA4 data                                | Real G- ID, production build, nonlocal address and script blocking.                          |

For routine updates: edit/prepare locally → check/preview → commit sources → build/deploy. See [installation](/en/blog/starter-guide-1-configure-your-site/) for upgrades and [languages](/en/blog/starter-guide-languages/) for language paths.

## Tutorial navigation and configuration reference

This completes first publication. Return to the relevant tutorial or dictionary for later changes.

[Previous: make the blog available in more languages](/en/blog/starter-guide-languages/) · [All eight tutorials](/en/blog/starter-guide-1-configure-your-site/#tutorial-order).

Related fields: [domain and environment overrides](/en/blog/config-site-chrome/), [GA4 and AI-readable context](/en/blog/config-analytics-ai/), [search resources](/en/blog/config-search/). Full paths, defaults and limits are in the [reference index](/en/blog/config-reference/).
