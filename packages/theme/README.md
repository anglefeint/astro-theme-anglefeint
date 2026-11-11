# @anglefeint/astro-theme

Core package for the Anglefeint theme, built for **Astro 7**.

## 0.30.0 effects and Fragments presentation

Standard pages now compose fourteen reusable visual groups from the package's `effects/` directory. Custom Astro pages can optionally import these components and explicit DOM bindings through `@anglefeint/astro-theme/effects/*`; see the [API reference](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/docs/REUSABLE_EFFECTS.md). No UI library or new configuration is required. Fragments gains compact cards/title styling and a signal loading state with a fixed dialog heading/close control; long comments scroll within the body. Existing fragment IDs and Giscus mappings are preserved. Personal-blog feed/comment defaults remain off, and demo examples/settings are not copied by upgrades. See the [release record](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/docs/releases/0.30.0.md) for actual publication status.

## 0.27.2 search build completion fix

This patch fixes an intermittent search-index build failure by using Pagefind's public in-memory API and awaiting complete file writes in the theme integration. The previous `writeFiles()` and current `getFiles()` are both public Pagefind APIs; the change is in our file-output handoff, while Pagefind continues to generate indexes and provide browser search. Pagefind itself is unchanged: no fork, dependency patch or private API. Search settings, index formats, URLs and browser behavior stay the same; no site-config migration is needed for integration starters. See the [release record](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/docs/releases/0.27.2.md) for actual delivery status.

## 0.27.1 pnpm build fix

Use 0.27.1 or newer for integration starters: it fixes automatic social-image builds with isolated pnpm dependencies. Rendering, fonts and public URLs stay the same. No content/config migration is needed from 0.27.0; see the [patch release record](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/docs/releases/0.27.1.md).

## 0.27.0 integration architecture

The theme package now owns standard routes, configuration defaults/types/runtime, translations, internal font assets and build integrations. The thin starter retains articles, `src/site.config.ts`, music/images, custom pages and personal hosting settings. See the [release record](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/docs/releases/0.27.0.md) for delivery status and verification.

```js
import { defineConfig } from 'astro/config';
import anglefeint from '@anglefeint/astro-theme/integration';
import { THEME_CONFIG } from './src/site.config';
export default defineConfig({ integrations: [anglefeint(THEME_CONFIG)] });
```

In site.config.ts, import `defineThemeConfig` and types from `@anglefeint/astro-theme/config`. The starter tsconfig extends `@anglefeint/astro-theme/tsconfig`, keeping internal type/alias mappings upgradeable. Standard routes are injected with their existing behavior; no generated config/i18n adapters or local standard-page implementations are needed. Keep custom pages outside reserved Home/Blog/Tags/About/Decoder/RSS/terminal paths. Add unrelated integrations deliberately; do not duplicate the theme's MDX/search/social/machine-readable/sitemap integrations.

npm integration starters can run `npx @anglefeint/astro-theme@latest upgrade` (or `npm run upgrade`). `--check` is a read-only project preflight; `--to <version>` selects a release. The tool checks schema/Node/Astro compatibility, backs up dependency files, installs the exact version with lifecycle scripts disabled and runs doctor. User files are never rewritten. Failure restores dependency files and attempts previous-dependency installation; incomplete recovery is reported with the backup path. Automatic upgrades require an npm package-lock.json (run npm install first) and support npm only; unsupported lockfile families, old skeletons and unknown schemas stop before writes. Deployment is separate.

Pre-0.27 projects need a one-time fresh-starter migration preserving content, config values, music/images and URLs. Do not copy old standard routes or config helpers into the new skeleton. See [Upgrading](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md). The historical version-specific starter requirements below apply to old copied skeletons, not additional files required by the new integration starter. Astro peer support remains `^7.3.5`; Node is `>=22.12.0`.

Article sitemap lastmod follows rendered updatedDate/pubDate. Terminal JSON noindex rules are merged into built dist/_headers without overwriting user source rules; compatible static hosts apply them, while other hosts need equivalent headers. Verify the deployed HTTP response. Neither the SEO features nor upgrade tool promise search indexing.

## Fragments (0.29.0+)

Pagination in 0.32.0+: Fragments reuses Blog's page-number controls, neon styles and threshold-based jump input through `theme.pagination`. `theme.fragments.pageSize` remains independent. Requires theme 0.32.0 or later.

Sharing in 0.32.0+: dates link to the fragment within its feed, with a compact copy control. Share `/<locale>/fragments/#ID`, using the existing frontmatter id. Off-page targets load a small static language index only when needed and navigate to their current page. Rebuild after changing content, dates or pageSize, keeping IDs stable. Cross-page locating/copying requires JavaScript; denied clipboard access exposes a selectable URL. Missing entries/load errors show feedback and stale destinations cannot bounce between pages. Use the date link/copy control rather than the numbered browser address; removed page numbers retain the host's normal 404. This sharing behavior requires theme 0.32.0 or later.

Optional short-form Markdown lives in `src/content/fragments/<locale>/`. Enable with `theme.fragments: { enabled: true }`; the menu appears below Decoder Lab at `/<locale>/fragments/`. The feed defaults off, uses `pageSize: 20` (1–100), and has its own `comments.enabled: false` default. A custom fragments route is reserved only when this feature is enabled.

From 0.31.0, `new-fragment` follows `new-post`, creating skeletons for all enabled project languages by default, sharing one ID and timestamp without automatic translation. Locale priority is `--locales` → `ANGLEFEINT_LOCALES` → enabled project languages. Both commands use the same parser: trim whitespace, lowercase codes, remove duplicates and validate syntax. Explicit lists bypass config loading and do not enable routes or change site configuration. Use `npx @anglefeint/astro-theme@latest new-fragment --locales en,zh` for selected languages or `--locales zh` for one. Versions 0.29–0.30 default to the default language; upgrade to 0.31.0 or use explicit lists. Existing projects need no new npm script. Keep frontmatter `id` stable; `pubDate` includes time and timezone, `title` is optional. Rebuild/redeploy after changes.

Article and fragment embeds share `Giscus.astro` and a single configuration/locale resolver. The popup waits for remote readiness, shows retry on errors or a 15-second timeout, and keeps its heading/close control inside the dialog. Popup comments reuse the Giscus repository/category IDs, theme, reactions and input position from `theme.comments`, independently of article enabled/mapping/term/number/strict/sharing/lang. Each fragment uses strict specific mapping and `fragment/<id>`; translations share the ID and interface language follows the page. The same official `client.js` used by articles loads on the first comment click; closing hides the popup and switching fragments reuses its client/iframe. No Giscus npm package is required. No dependency implementation is modified and no GitHub discussions are merged/deleted. Article comments remain unchanged. The [User Guide 5 source](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/src/content/blog/en/starter-guide-5-fragments.md) documents this feature.

## Feature configuration

Homepage switches in `src/site.config.ts`: `theme.home.showInitialize` controls the Initialize/done sequence, `showFollow` controls Wake Up/Follow, and `showTrace` controls the lower-right terminal status. All default to `true`; set each to `false` to hide it independently.

Optional `theme.footer.links` adds a separate dot-separated row of `{ label, href }` links between copyright and theme credits. Empty or omitted links hide it; it is independent of social icons and `showCredits`, and labels keep their configured text across locales. Home switches and footer links require version 0.15.0 and matching starter schema/defaults/adapter changes. See [migration](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md#0150-home-switches-and-footer-links). Custom integrations map home switches to `THEME.HOME.SHOW_INITIALIZE/SHOW_FOLLOW/SHOW_TRACE` and links to `THEME.FOOTER.LINKS` through their site-config alias.

The full **Decoder Lab** is available at `/<locale>/decoder/`, with local text-processing history, ERC-20/TRC-20 call interpretation (EVM/HyperEVM/TRON), and EVM/TRON/Bitcoin address inspection. Open it from the About decoder dialog. Set `theme.enableDecoderPage: false` in `src/site.config.ts` to omit the page and its link independently of About. No RPC, wallet connection or API key is required.

Decoder Lab takes its visual inspiration from the **cypherpunk** movement, in tribute to its contributions to human freedom, privacy and open code. Its peer-to-peer network motif and local processing reflect the idea of keeping tools and data in the hands of the individual.

## Archive and homepage component wiring

The integration-owned About page provides window controls: red closes to the sidebar About entry, yellow minimizes without collapsing page height, and green makes the reading panel fullscreen. `open`, `close`, `minimize`, `maximize` and `restore` share those controls; mode and normal reading position are remembered locally, while fullscreen always requires a fresh user action. Standard integration pages update with the package; customized replacement implementations remain the owner’s responsibility. See [Upgrading](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md#0260-about-reading-window).

The current source provides Cards/List archives with browser-local view memory, linked List tags and continuous range/count metadata. Custom routes pass `BlogCards` its existing `posts` / `locale` and optional zero-based `startIndex` / full filtered `totalPosts`. Without these props, offset defaults to zero and total to the supplied list length. Custom home routes pass the complete locale-filtered count as `HomePage.totalPosts` alongside the latest-post slice. These are component props; no site-schema or adapter update is needed. The integration supplies those props for standard routes; custom route authors supply their own data. See the 0.24.0 section of [Upgrading](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md#0240-archive-views-and-homepage-counts).

## Decoder reading configuration

Since 0.20.1: four additional cards link to Satoshi Nakamoto’s November 6, 2008 reply on P2P and freedom, Nick Szabo’s 1996 smart-contract essay, David Chaum’s 1985 privacy paper and Wei Dai’s 1998 b-money proposal. Version 0.20.1 has sixteen cards, arranged in two eight-column rows on wide screens. The email is not the whitepaper announcement.

The sixteen default links include `utm_source=anglefeint&utm_medium=referral&utm_campaign=decoder_lab` for referral attribution. Replace their `href` values through the configuration below to change or remove these parameters; custom links are used as supplied, without automatically adding attribution parameters.

Since 0.20.0: the header's independent Frontier arrow opens Decoder Lab; About remains a direct link. Disabling Decoder Lab omits its arrow as well as its route and existing entries. The current source defaults to sixteen cards linking to eight original texts and eight resource/project websites; no full texts or translations are bundled.

Configure its tribute and illustrated reading cards in `src/site.config.ts` under `i18n.locales.<code>.messages.decoderPage.readings`. Omit this field to retain the localized defaults. `tribute: ''` hides the text, `links: []` hides the cards; setting both removes the section. A supplied `links` array replaces the complete list without a total item-count limit; rows have up to eight cards on wide screens. Each card takes `title`, `href`, and optional `author`, `year`, `cover`. Covers may use the bundled names `privacy-code`, `cryptographic-autonomy`, `cyberspace-freedom`, `virtual-communities`, `cypherpunk-archive`, `satoshi-institute`, `bitcoin`, `tor-project`, `signal`, `telegram`, `monero`, `gnupg`, `satoshi-freedom`, `smart-contracts`, `security-without-identification`, `b-money`, a `/images/...` public path, or an HTTPS URL; omit `cover` for a text-only card. This requires the matching Decoder route that forwards `messages.decoderPage.readings` to `DecoderReadings`.

These optional fields use the existing message fallback chain. An English-configured tribute or complete list can serve fallback locales; per-language overrides take precedence. Without these fields in site configuration, the component supplies localized built-in copy. Text is plain text, not HTML; recognized localized cypherpunk names receive automatic emphasis. Custom `links` entries need a nonempty title and an HTTP(S) or root-relative URL; invalid entries are omitted. Public image paths and internal links respect the Astro base path. Rebuild and redeploy after configuration changes.

```ts
// Inside i18n.locales.en (or another locale):
messages: {
  decoderPage: {
    readings: {
      tribute: 'Ideas and code in service of privacy and freedom.',
      links: [{ title: 'My reading', href: 'https://example.com/', cover: 'privacy-code' }],
    },
  },
},
```

About includes Hacker Decryptor for local Base64/Base64URL, URL, Hex, HTML entities, Unicode escapes and JWT header/payload decoding, with translated controls, automatic detection and a shared numeric result animation with host-specific colors.

## Install

Version 0.16.0 adds `i18n.locales.<code>.site.homeTitle` for the visible homepage heading. Non-empty trimmed text follows the locale fallback chain, then the global site name; site metadata and shared chrome remain global. Use the matching starter schema/runtime/site adapter. Custom integrations must export `getHomeTitle(locale): string` through `@anglefeint/site-config/site`; direct package defaults return `SITE_TITLE`. Older starters require migration before installing this release; see [upgrade steps](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md#0160-localized-homepage-headings).

Optional GA4 is available with the matching 0.10.0 starter. Set top-level `analytics.googleAnalyticsId: 'G-XXXXXXXXXX'` in the existing `src/site.config.ts` configuration, rebuild and deploy. Empty disables it; one Measurement ID covers all languages. Development and localhost/loopback preview are excluded; remote and LAN previews are not. Check the GA4 Realtime report on the deployed site. No consent banner/management is included; arrange consent handling before enabling where needed, and avoid duplicate GTM/Zaraz/manual tags. Upgrading npm alone does not add the new starter schema/defaults/adapter; follow [UPGRADING.md](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md). Manual package consumers map `THEME.ANALYTICS.GOOGLE_ANALYTICS_ID` through their existing site-config alias.

```bash
npm install @anglefeint/astro-theme
```

## Upgrade

For 0.21.0, merge root `"overrides": { "fflate": "0.7.5" }` into an existing consumer project before reinstalling. The matching starter already includes this patch for Satori's pinned compression dependency. A dependency package cannot enforce root overrides; see UPGRADING for the integration/config migration as well.

```bash
npm update @anglefeint/astro-theme
```

For starter projects, review the repository release notes when scaffold commands change. If an older project still routes `npm run new-post` or `npm run new-page` through local wrapper files, migrate the package scripts to the package-owned bins:

```bash
npm pkg set scripts.new-post="anglefeint-new-post"
npm pkg set scripts.new-page="anglefeint-new-page"
```

## Homepage and Oracle

The homepage adds sequential terminal text, four shuffled white-rabbit decoders and a local cracked/liquid mirror that repairs on click until refresh. Optional `theme.effects.enableHomePassage` defaults to `false`; enabling it adds an 8-second green passage to homepage post links. The matching starter maps this field to `THEME.EFFECTS.ENABLE_HOME_PASSAGE`. About adds an independent `Oracle` button with four click-selected palettes, no immediate palette repetition, drag-to-look exploration, right-click reverse travel, and Escape/× dismissal. Reduced motion uses native home navigation and a static Oracle preview. Migration of starter schema/defaults/adapters and the About route is required for the complete feature; see [UPGRADING.md](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md). The existing optional music player selects its presentation by page atmosphere; audio configuration and playback controls are unchanged.

The wide-screen homepage terminal uses the same passage player as About. Its text can be selected and scrolled; the separate keyhole button starts the preview. Configure `i18n.locales.en.messages.home.transmission` once in the matching starter’s `src/site.config.ts`, then optionally override individual languages. Resolution is current-language configuration → English configuration → `Knock, knock.`. This requires the updated starter message adapter as well as the package; updating npm alone does not replace project-owned adapters.

## Usage in Starter/Site

Optional music (0.7.0) requires the matching starter schema/defaults and theme adapter. It is disabled by default and ships no songs. Configure `theme.music` in `src/site.config.ts` with `enabled: true` and `tracks: [{ title: 'My Song', src: '/music/my-song.mp3' }]`; place the file in `public/music/` or use an HTTPS audio URL. First visits load audio after Play; version 0.8.1 attempts to resume active tab sessions after navigation, with a click required when the browser blocks playback. See the repository README and upgrade guide before updating an older starter.

**0.18.1 presentation:** `MusicDeck` starts compact in its initial HTML. Pass `initiallyCollapsed={false}` for an expanded entry on desktop or mobile, or true for a compact entry. Explicit initialization overrides viewport and stored presentation; users can still toggle manually. `ThemeFrame` forwards the same option as `musicInitiallyCollapsed`. These are component props, not new `theme.music` configuration fields. Playback resume remains independent; BFCache restores the latest saved presentation. The homepage's enabled status items also start hidden and reveal independently on hover or selection; select-all reveals both and the block cursor follows only the trace. These changes require 0.18.1 or later.

Article share images require the matching starter's `theme.socialImage.enabled` config/adapter and `socialImage()` from `@anglefeint/astro-theme/social-image` in Astro's integrations. The package owns the prerendered PNG endpoint, Satori/Sharp rendering, offline fonts and the bundled neon-network background. Cards retain the user's site/title/author; `theme.footer.showCredits: false` also hides the bottom-right `Theme by Anglefeint` image credit. Rebuild and deploy to update generated URLs; custom `ogImage` files are never stamped. Article `ogImage` overrides generation independently of `heroImage`; see the repository README for image paths and the disable switch. This capability requires 0.5.0 and its matching starter; 0.4.0 does not include it.

Use the package exports in your pages/layout wiring, for example:

```astro
---
import HomePage from '@anglefeint/astro-theme/layouts/HomePage.astro';
---

<HomePage {...Astro.props} />
```

For content schema:

```ts
export { collections } from '@anglefeint/astro-theme/content-schema';
```

`sourceLinks` in blog frontmatter accepts standard `http(s)` URLs and bare domains such as `github.com/anglefeint/astro-theme-anglefeint`. Bare domains are normalized to `https://...` during schema parsing.

## Article contents

From 0.25.0, article metadata shows the existing `author` frontmatter value or site author; only a site-author name with About enabled links to that localized page and adds its URL to article structured data. H2/H3 copy icons reuse existing IDs, copy canonical section URLs and show success inline, with a manual-copy field on failure. No new required configuration or project-route changes are needed from the matching 0.24.1 starter.

Since 0.8.5, `BlogPost` automatically discovers enabled, existing same-slug translations for standard `/<locale>/blog/<slug>/` article URLs. Existing 0.8.3/0.8.4 starters need only a compatible package update, rebuild and deployment; no route edits or new author settings are required. SEO alternates exclude missing translations while language-menu `localeHrefs` keeps its fallbacks. `x-default` is omitted when the default-language translation is absent. The optional `seoLocaleHrefs` introduced in 0.8.4 remains an explicit override, including an empty map to emit none. Custom routes outside the standard pattern require that override to emit alternates; automatic discovery does not guess their URLs.

`BlogPost` accepts optional `headings` from `const { Content, headings } = await render(post)`. Pass these alongside the article data to enable its native, collapsible table of contents for Markdown h2/h3 headings. The panel sticks to the right on wide screens and appears before the body on narrow screens. No headings means no contents. The optional boolean frontmatter field `toc` overrides `THEME.TOC.ENABLED` (default `true`); starter users configure the default with `theme.toc.enabled`. MDX component-generated and raw HTML/JSX headings are not collected automatically.

## Site Config Injection

This package reads site-specific config from alias imports:

- `@anglefeint/site-config/site`
- `@anglefeint/site-config/theme`
- `@anglefeint/site-config/social`
- `@anglefeint/site-i18n/config`
- `@anglefeint/site-i18n/messages`

In the starter/site project, map these aliases to `src/config/*` and `src/i18n/*` in both Vite and TS config.

Package installation alone does not configure these aliases. Manual integrations must provide them explicitly; bundled fallback configuration files do not automatically resolve missing aliases.

Giscus comments are configured from site-side `theme.comments` (core IDs + behavior fields like `mapping`, `inputPosition`, `theme`, and `lang`). If required core fields are not set, comments are not rendered. With sharing disabled (the default), when `mapping="specific"` set `term`; when `mapping="number"` set `number`. Optional `shareAcrossLocales: true` requires `mapping: 'specific'`, empty `term` and `number`, and `strict: '1'`. Standard article pages supply their complete locale-independent slug as the term; custom BlogPost usages must pass `articleSlug`. Conflicting configuration or missing slugs fail explicitly. Language behavior is unchanged: empty `lang` follows the page, explicit `lang` remains fixed (default en). Existing discussions are not merged or deleted. Disable sharing and restore the original mapping fields to restore old associations.

## CLI

- `anglefeint-new-post`
- `anglefeint-new-page`

The post CLI executes your trusted `src/site.config.ts` with Jiti and uses the merged, enabled locale registry. Configuration failures stop generation before writing posts. `--locales` takes precedence over `ANGLEFEINT_LOCALES`, then configured locales; explicit overrides skip config loading. Missing configuration requires an explicit override. Existing posts are never overwritten.

Explicit locale overrides create content files only. They do not add/enable locales in site configuration; routes still require the target locale to be enabled. When images exist in `src/assets/blog/default-covers/`, each invocation randomly selects one cover for all newly created locale files. Existing files are preserved; you can change `heroImage` afterward. Selection is not determined by the slug.

Examples:

```bash
# create one post slug in all default locales
npx anglefeint-new-post my-first-post

# create post only for selected locales
npx anglefeint-new-post my-first-post --locales en,fr

# or via environment variable
ANGLEFEINT_LOCALES=en,fr npx anglefeint-new-post my-first-post

# create a custom page with theme variant
npx anglefeint-new-page projects --theme base
npx anglefeint-new-page projects --theme ai
npx anglefeint-new-page projects --theme cyber
npx anglefeint-new-page projects --theme hacker
npx anglefeint-new-page projects --theme matrix
```

Run these inside a project with the theme installed. `npx` resolves the package's local binaries; a local npm installation does not put them on your ordinary terminal's PATH. Starter projects already provide `npm run new-post -- ...` and `npm run new-page -- ...`. The environment-variable example uses POSIX shell syntax. For most users, `#starter` is the recommended installation path.

## Machine-readable articles

The matching starter also preconfigures the build-only `@anglefeint/astro-theme/machine-readable` integration. Normal builds generate `/llms.txt`, per-language indexes/full-text bundles and article Markdown companions, with discovery links in article HTML. Site identity, URLs, languages and public metadata come from existing settings/pages; no extra configuration or server is needed. Custom integrations can call `machineReadable({ title, description })` in `astro.config.mjs`. Remove the old `public/llms.txt` placeholder when migrating; user-authored conflicting files are never overwritten. Exports skip noindex pages and exclude navigation/player/decorative content; `search: false` controls site search, not public Markdown. Files are available after build/preview, not during dev. See [UPGRADING.md](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md) for existing projects.

## Static article search

Register `import search from '@anglefeint/astro-theme/search'` in Astro's integrations with `search({ enabled: THEME.SEARCH.ENABLED })`. After build, the integration writes `pagefind/` into Astro's output directory. The package owns the dependency, indexing hook and dialog; the starter supplies configuration and integration registration. Only `BlogPost` panels marked `data-anglefeint-search` are indexed, limited to title, subtitle and body. Frontmatter `search: false` excludes an article. The default `theme.search.enabled: true` controls both UI and indexing.

Indexes load only after opening search, using the current HTML language. Full search works in build + preview and deployed static output. Dev mode displays instructions. This integration targets static output and requires no search server.

## Tag browsing

Version 0.3.0 supports `theme.tags.enabled` (default `true`) and article `tags: string[]`. Starter-owned `/[lang]/tags/` routes generate static per-language archives using package tag utilities and shared blog cards. Include the new routes when adopting this feature; updating the npm package alone does not install routes. Use the matching current starter.

## Music session resume

With the existing `theme.music` configuration, 0.8.1 attempts to resume active tab sessions after navigation or reload. Manual pause stays paused. First visits do not autoplay; blocked attempts show a localized click-to-continue message. Brief interruptions are possible. No ClientRouter, new dependency or configuration field is required. See the main README for configuration and UPGRADING for compatible starter requirements.

Audio is fully downloaded into a browser Blob before playback, making seeking independent of HTTP Range support. Large tracks and slow connections increase startup time and memory use. External audio hosts must allow cross-origin fetch (CORS); same-origin files in `public/music/` need no CORS configuration. Pause/resume reuses the loaded track; switching tracks releases it. Page navigation loads the track again, subject to browser HTTP caching.

## Social link relations

Each `social.links` entry accepts optional `rel: 'me'` or other space-separated values such as `'me nofollow'`, independently of its platform/icon. The theme lowercases and deduplicates tokens, always retains `noopener noreferrer`, and ignores conflicting `opener`. Omitted/blank `rel` preserves existing behavior. Built-in icons, local images and text links all support it; no arbitrary HTML attributes are exposed.

Use `me` only for your own identity. For [Mastodon verification](https://docs.joinmastodon.org/user/profile/#link-verification), deploy the website, then save its HTTPS URL in your Mastodon profile fields. Use a page containing the backlink (for example `/en/`); a root HTML redirect page may not contain it. Links are present in static HTML, but successful verification depends on the Mastodon server reaching the page and matching the profile URL. No configuration migration is needed for matching 0.11.x starters; install `@anglefeint/astro-theme@^0.12.0` explicitly when upgrading across the minor-version range.

## About line breaks

About body paragraphs and the signature preserve configured line breaks (`\n` / `\n\n`) while long text still wraps. Content remains plain text; Markdown and `<br>` are not interpreted. No configuration migration is needed.

## Footer credits

Copyright, localized theme/Astro credits and optional `site.tagline` occupy separate groups, followed by social icons. Empty taglines take no space; long text wraps on mobile. Credits follow the page language, while your custom tagline stays unchanged across languages. Existing settings and `PUBLIC_SITE_TAGLINE` overrides work without schema or adapter migration.

The footer displays the build year and site title, with linked Anglefeint/Astro credits by default. With the matching 0.8.0 starter configuration, set `theme.footer.showCredits: false` to omit both credit links. Copyright and custom `site.tagline` remain; the former default tagline `Built with Astro.` is represented by the built-in credit to avoid duplication. The new tagline default is empty. See User Guide 3 and UPGRADING before updating an older starter.

## Code block copy

Article-body `pre > code` blocks include an automatic upper-right copy button with localized success/failure feedback. Copy uses `code.textContent` and the browser Clipboard API; HTTPS/localhost and browser permission are required. Inline code is excluded. No additional dependency, configuration switch or author markup is required.

## Image preview

Article-body images outside links/buttons include a native modal preview with keyboard/backdrop dismissal and localized labels. Hero images are excluded. The preview uses `currentSrc || src`, not a separately fetched full-resolution original, and restores scrolling/focus on dismissal. It is initialized with the article runtime; no images means no modal. There is no gallery navigation, gesture zoom or configuration switch. No additional dependency or author markup is required.

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

The 0.27+ integration starter wires the Markdown processor automatically. Only pre-0.27 copied skeletons require the one-time migration described in the upgrade guide; new integration projects do not copy processor or adapter implementations.

## Static deployment and article statistics

The matching starter builds static files into `dist/`. Upload its contents to a static server that serves directory `index.html` files; Cloudflare and a production Node.js process are not required. Set the public site URL before building. Optional GA4, comments and remote audio still contact their respective services.

The starter estimates words from source text and defaults tokens to `round(max(words, 1) × 1.3)`. These are neither random values nor actual AI usage. Frontmatter `wordCount`, `tokenCount` and `readMinutes` override their values independently. Formula and MDX source can affect estimates. See the repository [article statistics reference](../../docs/ARCHITECTURE.md#article-statistics) for the exact rules and display limitations.

### Optional machine-readable context

The unified integration automatically forwards machine-readable context and locale settings. In integration starters, edit only `src/site.config.ts`; do not register a second export integration or manually wire these parameters in `astro.config.mjs`. Configure optional `aiReadableContent.notes` (Markdown) and `aiReadableContent.links` (`{ label, href }[]`), with field-wise overrides at `i18n.locales.<code>.aiReadableContent`. Omitted fields inherit globally; empty strings/arrays hide them. Root indexes use global context; language indexes/full-text and individual Markdown use localized context, separate from article text. See [configuration, link resolution and migration](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md#optional-machine-readable-context). Policies express author intent, not guaranteed crawler compliance.

## Default sharing image and short Fragment IDs (0.33.0+)

Set site.ogImage in src/site.config.ts to a public-root image path (for example /images/share.jpg, stored at public/images/share.jpg) or an HTTPS URL. Merge the property into your existing site settings. Leave it blank to use the bundled 1200×630 Anglefeint artwork. Fragments and all of its #ID sharing links use this default. Article-specific and automatically generated article images retain priority; with automatic generation disabled, an article hero also takes priority over the site default. Rebuild and deploy after changing images; sharing platforms may cache previews.

```ts
export const THEME_CONFIG = defineThemeConfig({
  site: { ogImage: '/images/share.jpg' },
});
```

new-fragment generates an eight-character Nano ID from case-sensitive letters and digits, checks existing Markdown IDs across languages and retries collisions. All languages from one invocation share the ID and timestamp. Fragment IDs must be exactly eight alphanumeric characters. Old UUID/long-ID entries are not supported: delete and repost them rather than expecting migration or old-link compatibility. Keep the new ID stable after publishing; changing it creates a new comment association.
