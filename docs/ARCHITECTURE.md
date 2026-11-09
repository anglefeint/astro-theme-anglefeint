---
doc_id: architecture
doc_role: reference
doc_purpose: Source-of-truth architecture map for layouts, shells, routing, and SEO.
doc_scope: [architecture, routing, seo, config]
update_triggers: [architecture-change, config-change]
source_of_truth: true
sync_targets: [README.md, CLAUDE.md]
---

# Architecture Notes

## Integration boundary (0.27.0)

Anglefeint is a static Astro publishing theme distributed as a thin starter plus `@anglefeint/astro-theme`. Code defines implemented behavior; this reference follows it. Version 0.27.0 is a breaking starter transition, not a completed release. See [migration](../UPGRADING.md#0270-integration-starter-breaking-not-yet-published) and [delivery record](releases/0.27.0.md).

The consumer owns articles, assets, music/images, site-config values, custom pages and deployment secrets/settings. The package owns standard pages, defaults/types, configuration/i18n resolution, styles/effects, build integrations and CLI. A normal feature update changes the package instead of asking authors to merge page implementations. The repository root is also the maintainer demo; old root config/i18n adapters remain diagnostic compatibility fixtures, not distributed application dependencies. New starters do not receive them.

## Entrypoints and configuration

- `astro.config.mjs` calls `anglefeint(THEME_CONFIG)` from the package integration. `packages/theme/src/integration.mjs` sets aliases and registers the standard route/build integrations.
- `src/site.config.ts` contains user settings. New starters import `defineThemeConfig` and types from `@anglefeint/astro-theme/config`; the package's `project/defaults.ts`, `schema.ts` and `runtime.ts` implement defaults, deep merge and locale normalization. Objects merge recursively, undefined overrides are skipped, arrays replace whole arrays, and explicit empty strings/lists retain their existing field-specific meanings.
- `project/config/*` derives site, feature, About and social settings; `project/i18n/*` derives runtime paths, messages and sorted post selection. `@anglefeint/user-config` resolves the actual site file. `@anglefeint/site-config/*` and `@anglefeint/site-i18n/*` are integration-provided imports for theme/custom pages; the starter extends `@anglefeint/astro-theme/tsconfig` and uses injected package env types, so authors do not maintain internal directory mappings.
- The existing site-config values remain valid, including all music tracks and locale overrides. The schema/default runtime implementation is no longer copied into consumer projects. The demo's helper entry files forward to the package so its existing site-config bytes are preserved.
- PUBLIC_SITE_URL and other existing PUBLIC_SITE_* identity overrides retain precedence. `project/site-url.mjs` uses the CLI dotenv mode before Astro resolves site; Vite later supplies page runtime metadata. The integration resolves matching title/description values for machine exports. Configuration changes require rebuild/deploy.

## Static routes and content

`integration.mjs` registers package-owned files in `routes/`: `/`, robots.txt, localized Home, Blog pagination, article slugs, Tags/index archives, About, Decoder, RSS and terminal JSON. Existing getStaticPaths/content queries are preserved. Custom project pages still live in src/pages outside these paths. A copied standard route is rejected with migration guidance; `new-page` reserves standard path prefixes instead of creating collisions. The demo's development-only player preview remains project-owned and emits no production route.

`content-schema.ts` uses Astro's glob loader over the consumer's `src/content/blog/**/*.{md,mdx}`. Required frontmatter is title, description and pubDate. Optional image, author, tags, TOC/search, updatedDate, source/context and AI-stat fields retain their current validation. No draft or future-date filter is introduced. Posts are filtered by locale ID and sorted by publication date. Related articles remain within the current locale. `utils/metrics.ts` derives estimates from source text, respecting explicit overrides; these are not real AI usage or confidence measurements.

Default locale prefix mode affects Home only: always gives a root meta-refresh/noindex/canonical page; never renders the default Home at root and redirects its localized duplicate. Blog/article URLs remain localized. Configured locales, labels, hreflang/OG codes, enablement and fallback behavior come from project/i18n. Nine built-ins remain enabled by default; custom locale choices are user settings. Matching article slugs define real translations; missing translations remain menu fallbacks to archives and are omitted from article SEO alternates.

## Article statistics

`utils/metrics.ts` removes fenced/inline code, HTML, images and Markdown links, strips selected Markdown markers and collapses whitespace. CJK Han/Hiragana/Katakana/Hangul characters count individually; remaining text uses whitespace-delimited words. Math/MDX source is not specially excluded. For `safeWords = max(words, 1)`, defaults are `max(1, ceil(safeWords / 220))` minutes, `round(safeWords * 1.3)` tokens, `round(140 + min(safeWords, 2800) * 0.11)` estimated latency, and `min(0.98, 0.78 + log10(max(safeWords, 20)) * 0.04)` confidence rounded to two decimals. Explicit frontmatter overrides each field independently; overriding wordCount does not recalculate other estimates. These are deterministic presentation estimates, not model tokenization, actual AI timing or verified confidence.

## Composition and visual systems

`components/shared/ThemeFrame.astro` owns shared HTML/head/header/footer/music composition. Base/Ai/Cyber/Hacker/Matrix shells choose body classes, styles and background hooks; reusable page layouts support custom pages. `routes/*`, HomePage and BlogPost compose data and presentation together inside the package. `components/CyberAtmosphere.astro` and `scripts/cyber-rain-dust.js` now ship in the package without effect changes.

The four cinematic identities, palettes, animation parameters, responsive layouts and accessibility/reduced-motion behavior are preserved. This migration changes ownership, not visual design. [Visual Systems](VISUAL_SYSTEMS.md) records appearance/effect contracts. `effects/lifecycle.js` scopes optional effect resources and reverse cleanup. Home coordinates shared rain/mirror/rabbit/passage lifetimes; About coordinates window controls, terminal, modals, Oracle and an independent decoder clock; article effects return disposers and cancel deferred starts, with cached-page visibility recovery. No new client router or seamless-audio promise is introduced.

About retains localized contents/contact anchors, window close/minimize/fullscreen commands and local preferences. The read-only terminal keeps filesystem/commands/session/loader/Canvas renderer separate from About. Virtual paths are inert JSON/text; same-origin localized terminal JSON provides public article text on demand. Decoder Lab and About use shared codecs, bounded history/actions and numeric reveal; crypto stays lazy/local with no RPC/wallet/chain-state lookup. `theme.enableAboutPage` and `enableDecoderPage` remain independent route/navigation gates.

<a id="optional-music-player"></a>

Music remains optional/default-off with a nonempty playlist. Native audio core, tab-session storage and page-specific skins remain separate; source-based track identity, manual pause, seekable blobs, resume intent and browser autoplay/CORS limits are unchanged. The updater never manages audio files. User social links and rel/iconSrc rules keep existing static validation, ordering and safe rel tokens.

## Build integrations and SEO

The unified integration supplies MDX, the existing build-time Satteri/KaTeX Markdown processor, social-image endpoints, machine-readable exports, Pagefind and sitemap. Users should not also add the former standalone integrations to the same project. Custom unrelated integrations remain allowed. No production Node process is needed; publish all of dist/.

- `BaseHead.astro` and `utils/head.ts` provide canonical, article/WebSite/Person JSON-LD, Open Graph/Twitter and RSS discovery. `utils/article-locales.ts` discovers only enabled existing translations, with explicit SEO maps authoritative (including empty maps). Tag routes omit hreflang but retain menu language links and self-canonical. Author links appear only for the configured site author when About is enabled.
- `sitemap.mjs` wraps @astrojs/sitemap URL discovery, retaining the Home redirect filter. It reads rendered article metadata and adds lastmod from article:modified_time then article:published_time (updatedDate ?? pubDate). Non-articles and missing/invalid dates receive no invented timestamp. No filesystem/build time is used.
- Standard robots allows crawling and advertises the same-origin sitemap index. Production player-preview routes are absent. JSON, RSS, social PNGs and Markdown companions are not ordinary page sitemap entries.
- Terminal JSON sets X-Robots-Tag: noindex at its route. Static responses additionally need host metadata: the integration merges `/:locale/terminal/*` into built dist/_headers, preserving user host rules and not writing public/_headers. Cloudflare Pages/compatible hosts apply it; other platforms need equivalent configuration. Robots remains open so the crawler can read noindex. Astro preview does not enforce host header files.
- The package About-runtime validator checks built href/src/action URL attributes against the configured virtual cwd/file paths. It does not create routes for historical crawler discoveries or redirect removed template pages.
- Pagefind indexes only opted-in article content, by page language; zero-article and disabled search remain empty/off. TOC uses compiler headings, while copy/preview/progress interactions retain no-JavaScript reading and keyboard behavior.
  <a id="article-share-images"></a>

- Social images use offline fonts/assets with Satori/Sharp, metadata-keyed caching and explicit ogImage precedence. PNG optimization remains lossless; body font delivery is unchanged.
- Machine-readable exports traverse rendered public article HTML, respect noindex/off-site canonical, preserve rendered MDX/code/math and generate root/language indexes, bundles and article Markdown. Configured global/locale aiReadableContent supplements inherit per field with explicit empty suppression. Exports preserve absolute destinations, ownership collision checks and stale-output cleanup. They do not promise AI citations, copyright compliance or Google indexing.

## Upgrade contract and distribution

Consumers carry `anglefeint.projectSchema: 1` in package.json. `npx @anglefeint/astro-theme@latest upgrade` invokes the package's astro-theme bin (npm resolves its name-matching binary). It requires an npm package-lock.json for recoverable installation and checks project/lockfile family, target name/version/schema, Node and installed Astro compatibility, then backs up dependency files, installs the exact target with lifecycle scripts disabled and runs doctor. User source/config/media are not rewritten. Failure restores dependency files and attempts old-dependency reinstall; incomplete recovery reports the backup path. Same-schema skipped versions work; unknown schema/Node/Astro changes stop for deliberate migration. No cross-schema migration or automatic deployment is implemented. npm is the supported automatic manager; others are refused rather than silently converted.

Old copied skeletons intentionally require one fresh-starter migration. Deep custom standard-page replacements are not silently merged. Future public defaults/features should stay behind this integration boundary; a compatible release must not assume a user manually applied an intermediate starter patch.

The reserved-route guard compares supported source-page URLs, including Markdown/MDX, index aliases, concrete enabled-locale folders, renamed dynamic language parameters and JSON endpoints, rather than checking only old .astro filenames. A conflict stops with the original file retained. Independent custom URLs remain supported. Dependency rollback does not restore dist/: a failed build requires a successful doctor/rebuild before deployment; the CLI states this explicitly.

`scripts/starter-manifest.mjs` is maintainer-only distribution metadata. It manages the thin entry files, neutral site-config source, guidance/docs, whitelisted sample posts and their required cover/font assets. It removes obsolete generated files only in the maintainer's distribution branch; upgradeProject never invokes this sync or its deletion list. `starter-package.mjs` distributes only Astro/theme runtime dependencies, check/TypeScript dev tools and package-owned commands. Packaging must include routes/project/runtime/CLI implementations. Root maintainer tooling and tests are not consumer dependencies.

<a id="code-to-documentation-map"></a>

## Validation and source-to-document map

| Responsibility                                         | Source                                                                            | Checks                                                                                                                                                                                                                                                                                        |
| ------------------------------------------------------ | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Standard route registration and copied-route rejection | integration.mjs, routes/*                                                         | integration-upgrade unit tests, installed locale/prefix matrix, full browser suite                                                                                                                                                                                                            |
| Config defaults, aliases and locale behavior           | project/*                                                                         | config/i18n unit tests, check-integration, installed/custom-locale builds                                                                                                                                                                                                                     |
| Real sitemap dates                                     | sitemap.mjs                                                                       | article-sitemap tests, built XML/HTML comparison                                                                                                                                                                                                                                              |
| Terminal indexing and virtual path safety              | integration header writer, routes terminal endpoint, scaffold/check-about-runtime | idempotence tests, built About checks, local host HTTP response checks                                                                                                                                                                                                                        |
| Preservation and recoverable upgrade                   | cli.mjs, scaffold/upgrade.mjs                                                     | unit preflight/rollback tests and real npm exec fixture-registry upgrade using frozen schema-1 entrypoints in tests/fixtures/integration-starter-v1; future-code-lab fixtures test a localized page/menu, bundled component/client code, defaults/overrides, opt-out and collision protection |
| Published file coverage and thin starter               | package.json, starter-manifest, starter-package                                   | pack-cli, scaffold and independent installed checks                                                                                                                                                                                                                                           |
| User-visible interactions and accessibility            | components/layouts/scripts/styles                                                 | tests/e2e and music browser scenarios                                                                                                                                                                                                                                                         |

Exact local results, limitations and pending remote gates belong in [0.27.0](releases/0.27.0.md), not assumptions about published state. Documentation routing follows [DOC_SYNC_WORKFLOW](DOC_SYNC_WORKFLOW.md); historical release records remain historical.
