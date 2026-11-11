[English](README.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Português (Brasil)](README.pt-BR.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [繁體中文](README.zh-Hant.md)

<p align="center">
  <a href="https://demo.anglefeint.com/en/">
    <img src="public/images/theme-previews/anglefeint-brand.webp" alt="Anglefeint — Matrix / Cyberpunk / Hacker / AI" width="1600" />
  </a>
</p>

<p align="center">A cinematic, multi-atmosphere Astro theme for personal publishing — built for human readers and AI agents.</p>

Automatically generates `llms.txt`, multilingual indexes, full-text bundles and article Markdown for AI agents to read and cite, supporting GEO (Generative Engine Optimization).

<p align="center">
  <a href="https://demo.anglefeint.com/">Live Demo</a>
  ·
  <a href="https://github.com/anglefeint/astro-theme-anglefeint">Repository</a>
</p>

<p align="center">
  <a href="#ai-assistant">AI assistant</a> · <a href="#installation">Install</a> · <a href="#setup">Site configuration</a> · <a href="#writing">Write posts</a> · <a href="#upgrade">Upgrade</a> · <a href="#deployment">Build and deploy</a>
</p>

<p align="center">
  <img alt="Astro" src="https://img.shields.io/badge/Astro-7.3.7-BC52EE?logo=astro&logoColor=white" />
  <img alt="Node" src="https://img.shields.io/badge/Node.js-22.12%2B-339933?logo=node.js&logoColor=white" />
  <img alt="Locales" src="https://img.shields.io/badge/i18n-9%20languages-0A7EA4" />
  <img alt="Deployment" src="https://img.shields.io/badge/Deploy-Static%20Hosting-0A7EA4" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT-2EA043" />
</p>

<a id="ai-assistant"></a>

## Use an AI assistant

Use Cursor, Codex or Claude Code to configure your site, write posts and customize pages. Start with the current project’s AGENTS.md; code and actual configuration define behavior. CLAUDE.md and Cursor rules point to the same instructions.

- **Blog users (starter)**: Read [AGENTS.md](https://github.com/anglefeint/astro-theme-anglefeint/blob/starter/AGENTS.md), then the [configuration](https://github.com/anglefeint/astro-theme-anglefeint/blob/starter/src/content/blog/en/starter-guide-1-configure-your-site.md) / [writing](https://github.com/anglefeint/astro-theme-anglefeint/blob/starter/src/content/blog/en/starter-guide-2-languages-and-routing.md) guides as needed.
- **Theme maintainers (main)**: Read [AGENTS.md](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/AGENTS.md) → [AI workflow](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/docs/AI_WORKFLOW.md). Consult [architecture](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/docs/ARCHITECTURE.md) for implementation structure and follow [doc-sync workflow](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/docs/DOC_SYNC_WORKFLOW.md) to update documentation after code changes.

<a id="installation"></a>

## Install

This template is built on **Astro 7**.

Use Node.js 22.12.0 or newer. Run these commands from the directory where you want to create your blog, then open the address printed by the development server.

```bash
npm create astro@latest -- my-blog --template anglefeint/astro-theme-anglefeint#starter --no-install --no-ai
cd my-blog
npm install
npm run dev
```

Already created your blog? Run `npm install` and `npm run dev` in that project; do not create a second copy. Stop dev with Ctrl+C before running other commands, or use another terminal. For pnpm, use `pnpm install` and `pnpm dev`.

<a id="setup"></a>

## Site configuration

Edit the existing configuration object in `src/site.config.ts`. This is the single entry for site identity, social links, About content and theme options. Keep the imports/exports and merge settings into the existing object.

```ts
export const THEME_CONFIG = defineThemeConfig({
  site: {
    title: 'My Blog',
    author: 'Your Name',
    description: 'My notes and projects.',
    url: 'https://your-domain.example',
  },
});
```

Set `site.url` to your actual website address. If `PUBLIC_SITE_URL` is set, it overrides this value. Rebuild and redeploy after changing content or configuration.

<a id="writing"></a>

## Create New Post

Start with one English article:

```bash
npm run new-post -- my-first-post --locales en
```

Edit the title, description and body in `src/content/blog/en/my-first-post.md`. To create matching skeletons in every enabled language, omit `--locales`: initially this creates nine files, without translating them. Existing files are preserved.

Slug rule: use lowercase letters, numbers, and hyphens only (example: `my-first-post`).
If images exist in `src/assets/blog/default-covers/`, each invocation randomly selects one cover and uses it for all newly created locale files. Existing files are preserved; you can replace `heroImage` later.
Optional locale override:

```bash
npm run new-post -- my-first-post --locales en,zh
# or
ANGLEFEINT_LOCALES=en,zh npm run new-post -- my-first-post
```

The `ANGLEFEINT_LOCALES=...` syntax is for Bash/POSIX shells. In PowerShell, use the `--locales` command above.

How URL works:

- File: `src/content/blog/<locale>/my-first-post.md`
- URL: `/<locale>/blog/my-first-post/`
- Blog list: `/<locale>/blog/`
- You do not need to add routes manually. Astro generates them from content files at build time.

`--locales` creates article files but does not enable languages. Add/enable each target locale in `src/site.config.ts` for its routes to be generated.

## Create New Page

`new-post` creates blog content only. For custom pages, use:

```bash
npm run new-page -- projects --theme base
```

Available themes: `base`, `ai`, `cyber`, `hacker`, `matrix`.
The command creates `src/pages/[lang]/projects.astro` with locale routes via `getStaticPaths()`.
Slug rule: lowercase letters, numbers, and hyphens only; nested paths are allowed (example: `projects/labs`). `_` and uppercase are invalid.

Examples (choose one for `projects`; running all five will fail after the first because the file already exists):

```bash
npm run new-page -- projects --theme base
npm run new-page -- projects --theme ai
npm run new-page -- projects --theme cyber
npm run new-page -- projects --theme hacker
npm run new-page -- projects --theme matrix
```

## Fragments

Fragments requires theme 0.29.0 or newer. Upgrade existing blogs before using the configuration and command below.

Publish brief thoughts as Markdown, with optional popup comments. Merge this into the existing theme object in src/site.config.ts. Fragments and its comments are off by default. The menu appears below Decoder Lab.

```ts
fragments: { enabled: true, pageSize: 20, comments: { enabled: false } },
```

All-enabled-language defaults require theme 0.31.0 or newer. Upgrade first; on 0.29–0.30, pass `--locales` explicitly.

```bash
npx @anglefeint/astro-theme@latest new-fragment
```

Like `new-post`, the default creates skeletons for all enabled project languages, sharing one ID and timestamp; it does not translate content. Locale priority is `--locales` → `ANGLEFEINT_LOCALES` → enabled project languages. Explicit lists are trimmed, lowercased and deduplicated; they skip config loading and create only the requested locale directories, without enabling languages in site configuration.

```bash
npx @anglefeint/astro-theme@latest new-fragment --locales en,zh
npx @anglefeint/astro-theme@latest new-fragment --locales en
```

Sharing in 0.32.0+: dates link to a fragment within the feed, with a copy-link control beside them. Share `/en/fragments/#ID`, using the Markdown frontmatter ID. If the fragment is not on the current page, a small language-specific static index locates its current page automatically. Rebuild after adding content, changing dates or pageSize; keep IDs unchanged. Cross-page locating and copying require JavaScript.

Pagination in 0.32.0+: Fragments shares Blog’s page-number controls, neon styles and optional page jump. `theme.pagination` controls both lists; `theme.fragments.pageSize` still sets the Fragment page size independently.

[User Guide 5: Publish Fragments](https://demo.anglefeint.com/en/blog/starter-guide-5-fragments/)

<a id="upgrade"></a>

## Upgrade the theme

The integration starter keeps standard pages, configuration defaults, translations and build features in the theme package. Your articles, `src/site.config.ts`, music, images and custom pages remain in your project.

For integration starters using npm, run the command below from the project root. It checks project/Node/Astro compatibility, backs up dependency files, installs an exact theme version and runs doctor. On failure it restores dependency files and attempts to reinstall the previous dependencies. Rebuild output is ready for your normal deployment; the command does not publish your site.

```bash
npx @anglefeint/astro-theme@latest upgrade
```

Pre-0.27 projects require a one-time fresh-starter migration: create a new template in a separate directory, migrate articles and resources, and merge personal values into the new site configuration. Do not copy the old standard routes, adapters or default/schema/runtime helpers. Keep article slugs, locale paths, music/image URLs and hosting settings.

The automatic updater currently supports npm only and refuses pnpm/yarn/bun lockfiles. `--check` previews compatibility without changing files; `--to 0.27.1` selects an exact release. Read the [upgrade guide](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md) and [GitHub Releases](https://github.com/anglefeint/astro-theme-anglefeint/releases), especially for Astro or starter-schema changes.

<a id="deployment"></a>

## Build and deploy

```bash
npm run build
```

The build produces a static website in `dist/`. Publish **all contents** of that directory to any static host. No production Node.js server or hosting adapter is required.

To check the built website locally, run `npm run preview`; preview does not publish it. Alternatively, `npm run doctor` includes checks and a build.

Serve the site at the domain root, with directory index support. Subpath hosting requires additional adaptation; setting Astro `base` alone is insufficient.

Article sitemap dates use `updatedDate`, falling back to `pubDate`; keep them accurate. The theme integration adds terminal JSON `X-Robots-Tag: noindex` rules to the built `dist/_headers`, preserving existing host rules and leaving your source file unchanged. Cloudflare Pages/compatible static hosts apply these rules; other hosts need equivalent response-header settings. Verify the deployed response; Astro preview does not apply host rules.

<a id="reference"></a>

## Feature and configuration reference

Blog and tag archives support Cards/List switching and remember your choice in this browser.

### Homepage effects and decoder tools

Optional Matrix passage: `theme.effects.enableHomePassage` defaults to `false`. When enabled, homepage post links use an 8-second green passage before navigation. About’s `Oracle` button works independently: each click selects one of four scene palettes without repeating the previous palette; drag to look around after arrival, right-click to walk back, and use Escape or × to close. Reduced motion keeps native home navigation and a static Oracle preview.

On wide screens (1440px and above), the bottom-right terminal shows `Knock, knock.`. Text remains selectable and scrollable; activate its keyhole button to unlock the shared corridor preview. Set `i18n.locales.en.messages.home.transmission` in `src/site.config.ts` once for all languages, then override `i18n.locales.<code>.messages.home.transmission` only where needed. Resolution is current-language configuration → English configuration → `Knock, knock.`; this differs from normal UI-message fallback. Configuration changes require rebuilding and redeploying.

Homepage switches in `src/site.config.ts`: `theme.home.showInitialize` controls the Initialize/done sequence, `showFollow` controls Wake Up/Follow, and `showTrace` controls the lower-right terminal status. All default to `true`; set each to `false` to hide it independently. 0.18.1: The two bottom status items start hidden and reveal independently on mouse hover or text selection; select-all reveals both, and the glowing cursor follows only the trace.

About includes a localized section directory and a highlighted Contact section. The directory sits beside the reading panel on wide screens and inside it on smaller screens. Frontier’s Contact link opens `/<locale>/about/#contact`; disabling About removes that link while Decoder Lab keeps its own switch.

About window controls close, minimize or fullscreen the reading panel, with browser-local state and matching terminal commands. The integration starter updates this standard page with the package; pre-0.27 projects follow the one-time migration above.

About includes **Hacker Decryptor**: decode Base64/Base64URL, URL-encoded text, hexadecimal, HTML entities, Unicode escapes and JWT header/payload locally in your browser, with automatic format detection and a numeric result reveal matched to the page palette. Open Decryptor from the About sidebar; no API or extra setup is needed.

The full **Decoder Lab** is available at `/<locale>/decoder/`, with local text-processing history, ERC-20/TRC-20 call interpretation (EVM/HyperEVM/TRON), and EVM/TRON/Bitcoin address inspection. Open it from the About decoder dialog. Set `theme.enableDecoderPage: false` in `src/site.config.ts` to omit the page and its link independently of About. No RPC, wallet connection or API key is required.

Since 0.20.0: the independent **Frontier** arrow in the header also opens Decoder Lab. The illustrated resources link to original essays and reference/project websites; no essay text is reproduced. Customize the tribute and complete card list in `src/site.config.ts` at `i18n.locales.<code>.messages.decoderPage.readings` (`tribute`, `links`). Empty text hides the tribute; `links: []` hides the cards. All configured entries render, with up to eight per desktop row. See the [configuration example](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/packages/theme/README.md#decoder-reading-configuration).

Decoder Lab takes its visual inspiration from the **cypherpunk** movement, in tribute to its contributions to human freedom, privacy and open code. Its peer-to-peer network motif and local processing reflect the idea of keeping tools and data in the hands of the individual.

## Requirements

- Node.js `22.12.0+` (LTS recommended)
- The 0.8.0 starter's documented commands passed Linux acceptance with npm on Node 22 and pnpm 10 on Node 24. Yarn/bun were not tested. See the [dated acceptance record](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/docs/releases/0.8.0.md).

## Check and preview before publishing

After configuring your site and writing your article, stop the development server and run:

```bash
npm run doctor
npm run preview
```

`doctor` includes checks and a build, so you do not need to run `npm run check` again. Open the URL printed by `preview`; stop it with `Ctrl+C`. Preview is local only and does not publish your site.

For a build and preview without the full checks, use this alternative:

```bash
npm run build
npm run preview
```

With pnpm, use `pnpm doctor` then `pnpm preview`; the build-only alternative is `pnpm build` then `pnpm preview`.

The static output is `dist/`. Configure your host to run `npm run build` and serve `dist/`; follow the [Astro deployment guide](https://docs.astro.build/en/guides/deploy/). Verify your production domain, article, language menu and search after deploying.

## AI-readable content

The matching starter automatically generates `/llms.txt`, per-language indexes/full-text bundles and article Markdown companions during `npm run build`. No extra configuration is needed; publish all of `dist/` as usual. Files are available after build/preview. Existing projects: see [UPGRADING.md](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md).

Optional `aiReadableContent.notes` (Markdown) and `aiReadableContent.links` (`{ label, href }[]`) in `src/site.config.ts` add site-provided context to indexes, full-text bundles and individual Markdown articles. Override either field at `i18n.locales.<code>.aiReadableContent`; omitted fields inherit globally, while `notes: ''` / `links: []` hide them. See [configuration and upgrade details](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md#optional-machine-readable-context).

## First Setup: Site Identity and Home URL

Before publishing, edit the existing `defineThemeConfig({...})` object in `src/site.config.ts`. Merge these fields into your settings; keep the file's imports/exports and any existing locale or feature configuration. Replace the example title, author and `https://your-domain.example` with your own values.

```ts
export const THEME_CONFIG = defineThemeConfig({
  site: {
    title: 'My Personal Blog',
    author: 'Your Name',
    url: 'https://your-domain.example',
  },
  i18n: {
    defaultLocale: 'en',
    routing: {
      defaultLocalePrefix: 'never',
    },
  },
});
```

**Choose how visitors reach your homepage:**

- `'always'` (the theme default): `/` redirects to `/<default-locale>/`, initially `/en/`. Visitors may briefly see **“Redirecting to home…”** before reaching the homepage.
- `'never'` (the example above): `/` directly displays the default-language homepage, avoiding that intermediate page when visiting the root URL. `/<default-locale>/` redirects back to `/`.

Choose an enabled locale such as `en`, `zh`, `ja`, `ko` or `es` for `defaultLocale`. This setting changes the default-language **homepage** only; blog/article routes still have language prefixes, such as `/en/blog/`.

Set `site.url` to your real production origin so canonical links, feeds and sitemap URLs use the correct domain. If you have set `PUBLIC_SITE_URL` in an environment file or your hosting build settings, it overrides `site.url`; update it too. After changing configuration, rebuild and redeploy (`npm run build`, or let your connected hosting build run). Editing the local file alone does not update the live site.

## Choose your languages

To customize the homepage's large heading per language, set `i18n.locales.<code>.site.homeTitle` in `src/site.config.ts`, for example `zh: { site: { homeTitle: '我的数字花园' } }`. It works for built-in and newly configured languages. Missing or whitespace-only headings follow that language's `meta.fallback` chain, then use the global `site.title` (or `PUBLIC_SITE_TITLE`). Only the visible homepage heading changes; browser titles, navigation, footer, RSS and SEO site identity retain the global site name. Rebuild and redeploy after changing configuration.

Nine languages are enabled by default: `en`, `ja`, `ko`, `es`, `zh`, `pt-br`, `de`, `ru`, `zh-hant`. English remains the default. In `src/site.config.ts`, set `i18n.locales.<code>.meta.enabled: false` for each unwanted language; omitting an override does not disable it, and the default locale stays enabled. `new-post` initially creates nine article skeletons, not automatic translations. To create only one: `npm run new-post -- my-post --locales en`.

## Languages

[English](README.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Português (Brasil)](README.pt-BR.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [繁體中文](README.zh-Hant.md)

## Preview

![Anglefeint — Four cinematic worlds](public/images/theme-previews/promo-overview.jpg)

![Anglefeint — Cyberpunk Cards and List](public/images/theme-previews/promo-cyberpunk.jpg)

![Anglefeint — Hacker About and Decoder Lab](public/images/theme-previews/promo-hacker.jpg)

![Anglefeint — AI reading and GEO](public/images/theme-previews/promo-ai.jpg)

### Sharing previews

![Default Anglefeint sharing image](https://raw.githubusercontent.com/anglefeint/astro-theme-anglefeint/main/packages/theme/src/assets/theme/social/anglefeint-og.jpg)

The built-in 1200×630 image is the default link preview for pages without their own image, including Fragments. Replace it with `site.ogImage`.

Articles generate their own 1200×630 PNG during `npm run build`, using the article title, author and site name. This is automatic generation at build time; opening a shared link uses the static image, with no image API or extra browser JavaScript. Rebuild and redeploy after changing these fields.

An article’s frontmatter `ogImage` takes priority over automatic generation. When `theme.socialImage.enabled` is `false`, its `heroImage` takes priority over the site default; the bundled image is the final fallback.

### Page screenshots

| Home                                                           | Blog Cards                                                                |
| -------------------------------------------------------------- | ------------------------------------------------------------------------- |
| ![Home preview](public/images/theme-previews/preview-home.jpg) | ![Blog Cards preview](public/images/theme-previews/preview-blog-list.jpg) |

| Blog · List                                                                |
| -------------------------------------------------------------------------- |
| ![Blog List view](public/images/theme-previews/preview-blog-list-mode.jpg) |

| Blog Post                                                                |
| ------------------------------------------------------------------------ |
| ![Blog post preview](public/images/theme-previews/preview-blog-post.jpg) |

| About                                                            |
| ---------------------------------------------------------------- |
| ![About preview](public/images/theme-previews/preview-about.jpg) |

| Blog pagination                                                                   | Article related posts                                                                |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| ![Blog pagination](public/images/theme-previews/preview-blog-list-pagination.jpg) | ![Article related posts](public/images/theme-previews/preview-blog-post-related.jpg) |

| Decoder Lab                                                      |
| ---------------------------------------------------------------- |
| ![Decoder Lab](public/images/theme-previews/preview-decoder.jpg) |

| Decoder Lab · Cypherpunk resources                                                   |
| ------------------------------------------------------------------------------------ |
| ![Decoder Lab resources](public/images/theme-previews/preview-decoder-resources.jpg) |

## Route Atmospheres

- `/<default-locale>/` (with `/` redirecting there by default): Matrix-inspired terminal landing
- `/:lang/blog`: cyberpunk archive mood
- `/:lang/blog/[slug]`: AI-interface reading layout
- `/:lang/about`: optional hacker-style profile page

## Theme Naming Contract

- Theme variants: `base`, `ai`, `cyber`, `hacker`, `matrix`
- Internal selectors/scripts use aligned prefixes: `ai-*`, `cyber-*`, `hacker-*`
- Core composition follows: `ThemeFrame -> Shell -> Layout -> Page`

## Features

- Pagefind article search in the current language
- Automatic article contents and static tag archives
- Code-block copy and article-body image preview
- Astro 7 static output
- Markdown + MDX content collections
- Starter ships sample locales: `en`, `ja`, `ko`, `es`, `zh`, `pt-br`, `de`, `ru`, `zh-hant`
- Per-locale RSS feeds
- Sitemap + robots support
- Config-driven customization
- Sticky footer (viewport-bottom on short pages)

## Theme Setup

1. Optionally copy `.env.example` to `.env` to override site identity; otherwise use `src/site.config.ts`.
2. Edit `src/site.config.ts`:
   - `site.title`, `site.description`, `site.url`, `site.author`, `site.tagline` for site identity and default metadata
   - `i18n.defaultLocale` to set the canonical root locale
   - `i18n.routing.defaultLocalePrefix` to choose whether the default locale lives at `/<default-locale>/` (default) or `/`
   - `i18n.locales` to add/remove supported locales from a single source
   - `i18n.locales.<code>.messages` for localized UI copy overrides
   - `i18n.locales.<code>.meta.label` for the language menu name (`zh` defaults to `简体中文`); changing it does not change URLs
   - `i18n.locales.<code>.site.hero` for localized home hero copy
   - `i18n.locales.<code>.about` for localized About content/runtime text
   - `social.links` for header/footer links
   - `theme.enableAboutPage` for About route/nav toggle
   - `theme.effects.enableHomePassage` to enable/disable the 8-second homepage click passage (disabled by default; About’s Oracle button offers the scene independently)
   - `theme.effects.enableRedQueen` to enable/disable the post-side monitor effect
   - `theme.comments` to enable and configure Giscus (core IDs + behavior options)
3. Replace starter posts in `src/content/blog/<locale>/`.
4. Set your real site URL (`PUBLIC_SITE_URL` or `src/site.config.ts`) before production deploy.

About body paragraphs and the signature preserve line breaks in configuration strings: `\n` starts a new line and `\n\n` leaves a blank line. Long sentences still wrap. This is plain text, not Markdown or HTML; do not insert `<br>`.

The footer separates copyright, theme/Astro credits and your optional `site.tagline` into independent groups, followed by social icons. Built-in credits follow the page language; your tagline stays unchanged across languages. Empty taglines take no space, and long text wraps on mobile. Existing configuration and `PUBLIC_SITE_TAGLINE` overrides still work; no migration is needed. Optional `theme.footer.links` entries (`label`, `href`) appear between copyright and credits, separated by dots; labels retain your configured text. The default is an empty array. These links are independent of `social.links` and `showCredits`.

Notes:

- `site.description` is the site-level default. The home page first uses the resolved `messages.siteDescription`, including built-in and fallback-language messages; only an empty resolved value falls back to `site.description`. Changing `site.description` alone does not replace built-in home descriptions.
- Locale config is deep-merged with defaults. Disable an unwanted language with `i18n.locales.<code>.meta.enabled = false`; omitting its override does not remove it. The default locale remains enabled.
- Locale metadata currently supports `label`, `hreflang`, `ogLocale`, `enabled`, and `fallback`.

### Optional: Google Analytics 4

In the existing `defineThemeConfig({...})` object in `src/site.config.ts`, add or edit this top-level setting (next to `site`, not inside `theme`):

```ts
analytics: {
  googleAnalyticsId: 'G-XXXXXXXXXX',
},
```

Copy the **Measurement ID** (`G-...`) from Google Analytics → Admin → Data streams → your Web stream. This is not the property name or numeric property ID. Leave the value empty to disable tracking. One ID covers every language and themed page; compare languages by page path. Rebuild and redeploy, then visit the live site and check the GA4 Realtime report.

Development mode and localhost/loopback previews do not send data. Remote previews and LAN-address previews do track when configured. The default starter loads no Google script. Do not also install the same tracking through GTM, Zaraz or a manual snippet. This option does not include a consent banner or consent management; if your site requires these, arrange them before enabling tracking. Script blockers can prevent data collection. The integration starter supplies this wiring; pre-0.27 projects follow the [upgrade guide](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md).

### Optional: Giscus Comments

`shareAcrossLocales: false` (default) — `mapping: 'pathname'`

Comments are disabled by default. To enable:

1. In `src/site.config.ts`, set `theme.comments.enabled = true`.
2. Fill:
   - `theme.comments.repo`
   - `theme.comments.repoId`
   - `theme.comments.category`
   - `theme.comments.categoryId`
3. Optionally customize:
   - `theme.comments.shareAcrossLocales` (`false`)
   - `theme.comments.mapping`
   - `theme.comments.term` (required when `mapping = "specific"`) — `shareAcrossLocales: false`
   - `theme.comments.number` (required when `mapping = "number"`)
   - `theme.comments.strict`
   - `theme.comments.reactionsEnabled`
   - `theme.comments.emitMetadata`
   - `theme.comments.inputPosition` (`top` or `bottom`)
   - `theme.comments.theme`
   - `theme.comments.lang`
   - `theme.comments.loading`
   - `theme.comments.crossorigin`

`shareAcrossLocales: false`: Missing core IDs hides the comments block. When comments are enabled, an empty `term` for `mapping="specific"` or an invalid positive-integer `number` for `mapping="number"` throws a configuration error and can stop dev/build.

The CLI uses enabled locales from the merged config. Config errors stop generation; `--locales` or `ANGLEFEINT_LOCALES` explicitly overrides that lookup.

Comments and cross-language sharing are off by default. For ordinary path-based comments, use the setup above. To share one discussion across translations, keep your repository/category fields and replace the mapping options with:

```ts
theme: {
  comments: {
    // Keep your enabled, repo, repoId, category and categoryId values.
    shareAcrossLocales: true,
    mapping: 'specific',
    term: '',
    number: '',
    strict: '1',
    lang: '',
  },
},
```

In shared mode, mapping must be specific, term and number must be empty, and strict must be 1. The article supplies its own locale-independent slug as data-term. For example, nine translations use cypherpunk-ideals-ai-and-the-future-of-crypto; guides/setup and other/setup remain different discussions. A missing slug is an error. Translations must use identical slugs. lang: empty follows the page language; an explicit lang remains fixed. Comments are not translated. Share only discussions and reactions.

When sharing is off, custom mapping/term/number/strict retain their current behavior: specific requires a nonempty term and number requires a positive integer string. When sharing is on, conflicting mapping, nonempty term/number or strict other than 1 causes a configuration error while comments are enabled. Open two translations and another article to check the discussion association. Visitors need GitHub authorization to comment. Merge these fields into your existing comments object; do not replace unrelated settings.

Existing discussions are not automatically merged, moved or deleted. Enabling sharing can select a different discussion, so old comments may not appear there. Before switching, record your original mapping, term, number and strict. To restore the previous association, set shareAcrossLocales: false and restore those exact values. If you need old comments in the shared discussion, review and migrate manually on GitHub; the theme performs no migration.

[Comments setup guide](https://demo.anglefeint.com/en/blog/starter-guide-4-giscus-comments/)

## Configuration Surface

- Single entry: `src/site.config.ts`
- Environment override supported: `PUBLIC_*` vars for site identity

## Social links

Configure `social.links` in `src/site.config.ts`; the header and footer share the array order. Add only the links you use:

```ts
// src/site.config.ts — defineThemeConfig({ ... })
social: {
  links: [
    { href: "https://www.youtube.com/@your-channel", label: "YouTube", icon: "youtube" },
    { href: "https://bsky.app/profile/your-handle.bsky.social", label: "Bluesky", icon: "bluesky" },
  ],
},
```

Built-in `icon` names: `mastodon`, `twitter`, `github`, `youtube`, `bluesky`, `linkedin`, `discord`, `telegram`, `instagram`, `facebook`, `whatsapp`, `line`.

Optional `rel` accepts space-separated relations, such as `me` or `me nofollow`, for any link (built-in icon, custom image or text). Omitted/blank values keep `noopener noreferrer`; values are lowercased and deduplicated, these protections are always retained, and conflicting `opener` is ignored. Nothing automatically adds `me` based on the platform. Use `me` only for your own identity. For [Mastodon verification](https://docs.joinmastodon.org/user/profile/#link-verification), deploy first, then save an HTTPS website URL in your Mastodon profile fields. Use a page containing the backlink, such as `/en/`; a root HTML redirect page may not contain it. Verification is performed by your Mastodon server, not the theme.

```ts
{ href: "https://mastodon.social/@yourname", label: "Mastodon", icon: "mastodon", rel: "me" },
```

For a custom image, put `community.svg` in `public/icons/`, then set `iconSrc: "/icons/community.svg"` on the link. Local SVG, PNG and WebP are supported; use a path starting with `/`, without a remote URL, query, fragment or encoded characters. Astro’s `base` is added automatically. Missing files or unsupported icon names stop dev/build with a configuration error.

`iconSrc` takes priority over `icon`; omit both for a text link. Built-in icons inherit the menu color; custom images retain their own colors. `label` supplies the accessible name. Footer links wrap as needed; the header keeps one horizontally scrollable row when space is limited. header social icons remain hidden at widths of 720px and below, while footer links remain visible. Empty `links` retains the three non-clickable placeholders. Rebuild and deploy after configuration changes.

## Docs

- [Architecture](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/docs/ARCHITECTURE.md)
- [Visual systems](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/docs/VISUAL_SYSTEMS.md)
- [Submission checklist](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/docs/THEME_SUBMISSION_CHECKLIST.md)
- [Theme listing draft](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/ASTRO_THEME_LISTING.md)
- [Upgrading guide](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md)
- [Changelog](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/CHANGELOG.md)

## Article Search

Search is enabled by default. The header button searches article titles and body text in the current language. `npm run build` generates the index automatically, deployed with the static site without a search server or account.

Set `theme.search.enabled: false` in `src/site.config.ts` to disable the entry and index generation. Use `search: false` in article frontmatter to exclude one article. Navigation, contents panels, related posts, comments and decorative status text are excluded.

Test full search with `npm run build` followed by `npm run preview`. `npm run dev` shows a development notice instead of live search. Rebuild after editing articles to update the index.

## Article Contents

Article pages automatically show a collapsible table of contents for Markdown `##` and `###` headings. On wide screens it sticks beside the article on the right; on narrower screens it appears before the body. It opens by default and is hidden when there are no matching headings. Long titles wrap, and headings keep their original text without added numbering.

Set `theme.toc.enabled` in `src/site.config.ts` to change the site default (initially `true`). In an article's frontmatter, `toc: false` hides its contents and `toc: true` shows them even if the site default is off. Omit `toc` to inherit the site default.

MDX Markdown headings are supported. Headings generated inside components or written as raw HTML/JSX are not automatically collected. Custom layouts using `BlogPost` must pass the `headings` returned by Astro's `render(post)`; omitting them leaves the contents hidden.

## Tag browsing

Add `tags: ["Astro", "frontend"]` to an article's frontmatter. Builds automatically generate a tag directory and paginated article lists for each enabled language. Blog pages link to the directory; article tags link to matching lists. Untagged articles remain unchanged. Disable browsing with `theme: { tags: { enabled: false } }` in `src/site.config.ts`.

Names are case-sensitive; surrounding spaces and duplicate tags are removed. Lowercase URL-safe names retain readable paths; other names use stable encoded paths, so Chinese and punctuation remain distinct. Renaming a tag changes its URL. No separate tag registry or command is needed.

Open `/<locale>/tags/` directly or use the blog's Tags link. An article tag opens `/<locale>/tags/<tagSlug>/`. With no tags in that language, the directory is empty and its blog navigation entry is hidden.

## Code block copy

Code blocks automatically show a copy button in the upper-right corner. Write ordinary Markdown fenced code; no extra configuration is needed. Clipboard access requires HTTPS or localhost; failures show a manual-copy message.

## Image preview

Unlinked images in article bodies open a larger preview on click or Enter/Space. Close with Escape, the close button, or the backdrop; reading position is preserved. Linked images keep their original navigation.

Preview displays the image source already selected by the browser; it does not retrieve a higher-resolution original. Hero images and images inside links or buttons are excluded.

## Article share images

Available in 0.5.0 with its matching starter; 0.4.0 does not include this feature.

`npm run build` automatically creates a 1200×630 PNG for each article without an `ogImage`, using its title, author and site name. Generation uses bundled fonts, with no image API or browser JavaScript. The article's `heroImage` is independent.

Automatic cards use a bundled code-rain, terminal and neon-network background, with your own site name, title and author. The small `Theme by Anglefeint` credit at the bottom right follows `theme.footer.showCredits` (default `true`); set it to `false` to hide both footer credits and this image credit. Rebuild and redeploy after changing it. Custom `ogImage` files are never modified. The artwork works offline and adds no browser JavaScript.

Set `ogImage: ./share.png` in article frontmatter to use your own image beside the article, or `ogImage: /images/share.png` for `public/images/share.png`. HTTPS image URLs are also supported; their availability and caching remain your responsibility. Missing local images fail the build.

Disable automatic generation with `theme: { socialImage: { enabled: false } }` in `src/site.config.ts`. Explicit `ogImage` still wins; other articles fall back to their hero or the existing default image. Rebuild and deploy after changes. Generated files are in `dist/_social/`; the article HTML's `og:image` gives the exact URL. Content-dependent URLs help with updates, but platforms may cache link previews.

The bundled font covers the starter's Latin, Cyrillic, simplified/traditional Chinese, Japanese and Korean sample text. Very long titles are shortened on the image only; emoji and other writing systems are not guaranteed. Generation adds build time and installation size, without adding a font download to article pages.

## Credits

- Parts of the base typography CSS are adapted from Bear Blog defaults (MIT).
  Source note is preserved in `src/styles/global.css`.

## Optional music player

The public demo enables eight example tracks from Free Music Archive; the starter keeps music disabled. See [demo music credits](https://demo.anglefeint.com/music/credits.html) for creators, sources and individual licenses (CC0 1.0 or CC BY 4.0). These recordings are separate from the theme code’s MIT license and are not included in the npm package or starter. When adding or reusing music, follow its own license and attribution requirements.

Disabled by default. Put audio files in `public/music/` and merge this into `src/site.config.ts`:

```ts
theme: {
  music: {
    enabled: true,
    tracks: [{ title: 'My Song', src: '/music/my-song.mp3' }],
  },
},
```

0.18.1: when enabled, the player starts compact on each new page; click OPEN to expand. Track position, volume and playback resume remain independent of this initial size.

Each track accepts `title`, `src` and optional `artist`. HTTPS audio URLs are also supported. An empty playlist hides the player. On the first visit, audio loads only after clicking PLAY. The tab session remembers the track, position and volume. If playback was active, navigating, reloading or returning with Back/Forward attempts to resume at the saved position; manual pause stays paused. A short gap is expected, not seamless playback. If the browser blocks automatic playback, click PLAY to continue. A removed track is not replaced automatically. Without storage, manual playback still works but session resume is unavailable.

Playback downloads the complete track into a browser Blob before starting, so seeking does not require HTTP Range support. Large files or slow connections increase startup time and memory use. Pause/resume reuses the loaded track; changing tracks releases it. Navigation loads the track again (the browser HTTP cache may help). External audio hosts must allow cross-origin fetch (CORS); putting files in `public/music/` avoids this requirement.

## License

MIT License. See `LICENSE`.

## Mathematical formulas

Markdown and MDX articles support LaTeX-style math globally by default. Write `$C_{saved}$` inline or put a formula between separate `$$` lines. No per-post flag or extra plugin installation is needed.

```markdown
Inline: $C_{saved}$

$$
\frac{a}{b}
$$
```

Disable with `theme: { math: { enabled: false } }` in `src/site.config.ts`. Escape literal dollars as `\$` when ambiguous; code spans and fenced code remain literal. Disabling math restores normal MDX rules, including JavaScript expressions in braces.

Rendering happens at build time with local KaTeX styles/fonts and accessible MathML, without a browser math engine. Long display formulas scroll horizontally. Invalid formulas stop the build with a source/error message. Keep titles and descriptions plain text; formulas are excluded from search indexing. Supported math is KaTeX syntax, not complete LaTeX documents.

In the 0.27+ integration starter, the theme package wires the Markdown processor automatically, including math. Only pre-0.27 copied skeletons require the one-time migration; do not copy processor or adapter implementations into a new project.

## Article statistics

The displayed words are a heuristic count of source text (CJK characters individually, other text mainly by whitespace). Tokens default to `round(max(words, 1) × 1.3)`, not a model tokenizer or actual AI usage. Counts at 1,000 or more use one decimal and `k`. Frontmatter `wordCount`, `tokenCount` and `readMinutes` override their values independently; changing only wordCount does not recalculate tokens. Formula/MDX source can affect the estimates.

## Default sharing image and short Fragment IDs (0.33.0+)

Set site.ogImage in src/site.config.ts to a public-root image path (for example /images/share.jpg, stored at public/images/share.jpg) or an HTTPS URL. Merge the property into your existing site settings. Leave it blank to use the bundled 1200×630 Anglefeint artwork. Fragments and all of its #ID sharing links use this default. Article-specific and automatically generated article images retain priority; with automatic generation disabled, an article hero also takes priority over the site default. Rebuild and deploy after changing images; sharing platforms may cache previews.

```ts
export const THEME_CONFIG = defineThemeConfig({
  site: { ogImage: '/images/share.jpg' },
});
```

new-fragment generates an eight-character Nano ID from case-sensitive letters and digits, checks existing Markdown IDs across languages and retries collisions. All languages from one invocation share the ID and timestamp. Fragment IDs must be exactly eight alphanumeric characters. Old UUID/long-ID entries are not supported: delete and repost them rather than expecting migration or old-link compatibility. Keep the new ID stable after publishing; changing it creates a new comment association.
