---
tags: ['anglefeint', 'config']
title: 'Configuration Reference: GA4 Analytics and AI-Readable Context'
subtitle: 'Measurement ID, production loading rules and public machine-readable site supplements.'
description: 'Types, defaults, validation, output locations, language overrides and boundaries for GA4 and AI-readable context.'
pubDate: '2026-11-13'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/ai-02.webp'
---

For first publication, see [deployment](/en/blog/starter-guide-deployment/) for ID setup and public text. Configuration location is in [installation](/en/blog/starter-guide-1-configure-your-site/); other modules are in the [reference index](/en/blog/config-reference/).

Both groups are top-level `src/site.config.ts` settings alongside site/theme. analytics controls traffic reporting; aiReadableContent adds public site context. They are independent: analytics needs no AI supplement, and text generation needs no analytics ID.

<a id="analytics"></a>

## analytics.googleAnalyticsId: GA4 identifier

| Path                        | Type / default                                            | Status, purpose and limits                                                                                                                                                                                        | Example value                         |
| --------------------------- | --------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| analytics                   | { googleAnalyticsId: string } / { googleAnalyticsId: '' } | Configuration container; partial overrides suffice. No separate enabled field.                                                                                                                                    | { googleAnalyticsId: 'G-XXXXXXXXXX' } |
| analytics.googleAnalyticsId | string / ''                                               | Conditional: valid ID, production build and no local-host skip match. Empty/whitespace disables it; trimmed. Pattern ^G-[A-Z0-9]+$ requires uppercase letters. Invalid format throws during component resolution. | 'G-XXXXXXXXXX'                        |

This is the GA4 web-stream Measurement ID, not a numeric property ID, GTM container, old UA ID or API secret. Replace the format placeholder with a real value. Validation enforces no fixed length and does not contact Google to prove the stream exists. Passing the regex does not mean reports are received.

```ts
analytics: {
  googleAnalyticsId: 'G-XXXXXXXXXX',
},
```

Disable with:

```ts
analytics: { googleAnalyticsId: '' },
```

Merge into existing `defineThemeConfig({...})` without duplicate analytics. One ID covers shared-framework pages across languages. No per-language/per-page ID fields exist.

### When does it load?

| Environment or address                               | Current behavior                                                                                  |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| npm run dev                                          | No analytics loader. Fields are still parsed first, so invalid format is not necessarily ignored. |
| Production, empty ID                                 | No analytics loader.                                                                              |
| Production on localhost or a .localhost subdomain    | Returns before initializing the theme queue or requesting Google.                                 |
| Production on 127.* addresses, 0.0.0.0, ::1 or [::1] | Also skipped; hostname comparison is lowercase.                                                   |
| Production on a LAN IP or remote preview domain      | Not excluded merely because it is a preview; configured IDs attempt loading.                      |
| Production public domain with a valid-format ID      | Initializes gtag once and asynchronously inserts the Google client.                               |

The theme initializes js/config commands without manually sending another page_view, search terms or player events. Its loader has a once-only marker, but cannot detect another analytics installation through manual scripts/GTM. Avoid duplicates yourself.

Existing window.dataLayer/window.gtag are preserved. There is no consent UI, automatic consent setup, reporting proxy, excluded-domain list or custom-event configuration. No dedicated PUBLIC_GA_* variable overrides the ID automatically. Implement environment decisions explicitly in your site.config rather than expecting arbitrary variable names to be read.

The public component treats old custom adapters without ANALYTICS as unconfigured. This is an internal compatibility fallback, not another public configuration path. Set analytics.googleAnalyticsId.

<a id="supplement"></a>

## aiReadableContent: global public context

An optional MachineReadableSupplement object, unset by default. Machine-readable output is still generated when omitted, simply without this extra context. {} does not disable exports.

| Full path                       | Type / default                                                        | Status, purpose and limits                                                                                                                                  | Example value                                                 |
| ------------------------------- | --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| aiReadableContent.notes         | optional string / unset, empty output                                 | Conditional: adds public Markdown site context. Empty/whitespace omits this part. Neither article-body replacement nor private AI instructions.             | '本站内容是个人学习笔记，可能持续修订。'                      |
| aiReadableContent.links         | optional { label: string; href: string }[] / unset, empty output list | Conditional: public extra links. Array replaces; [] clears. No public item limit or automatic target-content fetching.                                      | [{ label: '项目主页', href: 'https://example.com/project/' }] |
| aiReadableContent.links[].label | string, required / none                                               | Conditional: nonempty after trimming. Output folds newlines to spaces and escapes backslashes/brackets. No automatic target-title fetching.                 | '项目主页'                                                    |
| aiReadableContent.links[].href  | string, required / none                                               | Conditional: nonempty, resolved against the public root URL, HTTP(S) only without credentials. Invalid values fail; existence/reachability is not verified. | 'https://example.com/project/'                                |

notes/links have no general character-length setting and must use the expected types. Wrong types, blank labels, non-web protocols or credential-bearing URLs may stop builds. The theme neither executes embedded commands nor calls models to generate context.

### Markdown and relative links

notes retains Markdown text, formatting and code. Parsed Markdown links, images and reference definitions become absolute URLs, with HTTP(S)/no-credentials validation. Code-block example links are not rewritten as live targets. This is not a complete arbitrary-HTML validator or screenshot service.

Resolution uses the **public site root URL, including Astro base**, not the article URL or current language directory. For public root https://example.com/project/:

| Configured href or Markdown target | Resolution                           |
| ---------------------------------- | ------------------------------------ |
| zh/blog/                           | https://example.com/project/zh/blog/ |
| /zh/blog/                          | https://example.com/zh/blog/         |
| https://docs.example.com/guide/    | The same external URL.               |

A single leading / resolves from the domain root, not automatically keeping /project/. This differs from music's BASE_URL prefixing; do not mix rules. mailto:, tel:, file: and javascript: are not supported in these extra links. Normal body contact links have separate export rules and do not imply the supplement accepts the same schemes.

### Global example

```ts
aiReadableContent: {
  notes: '本站内容是个人学习笔记，可能持续修订。详情见[文章列表](zh/blog/)。',
  links: [
    { label: '项目主页', href: 'https://example.com/project/' },
  ],
},
```

<a id="locale-supplement"></a>

## Language-specific aiReadableContent

Full prefix: `i18n.locales.<语言>.aiReadableContent`, also optional and unset by default. Fields have the global semantics, inheriting individually when omitted:

| Relative field | Type / default                                                     | Purpose and limits                                                                                        | Example value        |
| -------------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- | -------------------- |
| notes          | optional string / inherits global notes                            | Conditional: language-specific public context. Empty/whitespace clears without another-language fallback. | '中文内容持续更新。' |
| links          | optional { label: string; href: string }[] / inherits global links | Conditional: replaces the entire extra-link array. [] clears rather than appending to global links.       | []                   |
| links[].label  | string, required / none                                            | Required on custom entries, with global validation/escaping rules.                                        | '中文文章'           |
| links[].href   | string, required / none                                            | Required on custom entries; resolution still uses public root, not language directory.                    | 'zh/blog/'           |

For Chinese notes without extra Chinese links:

```ts
i18n: {
  locales: {
    zh: {
      aiReadableContent: {
        notes: '中文内容持续更新。',
        links: [],
      },
    },
  },
},
```

Overriding notes still inherits global links; {} inherits both. undefined is ignored rather than clearing. This object does not use meta.fallback or copy English/other-language supplements. See [language fallback](/en/blog/config-languages/#fallback).

Root llms.txt always uses global context. Language overrides apply to that language's index, bundle and per-document Markdown. Clearing every language cannot bypass invalid global context, since the root still resolves it.

<a id="outputs"></a>

## Which public files receive the supplement?

Paths are relative to the public root, with deployment prefixes when applicable. Language indexes/bundles require actual exported content; a language supplement does not create articles.

| Output                                  | Supplement position and contents                                                                                                                        |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| llms.txt                                | Root entry. Global notes precede language directories; links form an extra-links section. Can contain global context even without exportable documents. |
| `<语言>/llms.txt`                       | Language index using its resolved supplement and linking existing documents under Articles/Fragments/About.                                             |
| `<语言>/llms-full.txt`                  | Language full-text bundle, with context/links before document contents.                                                                                 |
| Article index.md or equivalent Markdown | Separator, site-context marker and effective supplement appended after the original body, distinct from authored text.                                  |
| `<语言>/about/index.md`                 | Public About biography/contact and reachable static AI panel, with the same appended supplement; not all tool runtime configuration.                    |
| `<语言>/fragments/index.md`             | Combined fragment pages with stable ID links and appended supplement, not duplicate full-text bundles for each page.                                    |

Individual Markdown paths follow built HTML: index.html becomes index.md. Custom Astro output styles may differ, so do not invent paths and overwrite generated files. Exported pages also receive discovery links to Markdown and language indexes.

Only marked, publicly indexable, same-origin-canonical articles/About/Fragments are exported. Home, lists, Decoder forms and comment iframes are not ordinary exported articles. Body links/code/tables are converted from built content; arbitrary unrendered configuration is not bundled publicly. About's reachable static AI panel is public content, so treat its text accordingly.

search: false excludes Pagefind, not machine-readable exports. Clearing notes/links does not disable body export. There are no aiReadableContent.enabled, per-post exclusion, AI endpoint, model-parameter or API-key fields. These files expose readable public information without guaranteeing model crawling, citation or ranking.

The generator protects same-name files outside its ownership history and fails on collision. Do not manually create competing llms.txt/Markdown paths in public or dist. Fix sources, rebuild and deploy complete output. A successful build proves neither production update nor model consumption.

<a id="boundaries"></a>

## Related settings and configuration boundaries

- Public URLs depend on site.url, environment overrides and Astro base. Root index title/description use current site context. See [deployment](/en/blog/starter-guide-deployment/); editing a URL inside notes does not change canonical metadata.
- Language switches affect standard-page generation, not cleanup of old hosted files. Supplements do not create translations; see [language context](/en/blog/config-languages/#ai-context).
- GA4 controls analytics, not search/RSS/machine exports. Static supplements have no UI button, translation-message group or statistics switch.
- GA4 ID and all supplement fields have consumers. No additional obsolete fields need filling; missing old adapter branches mean compatibility-disabled behavior only.

Rebuild/redeploy after changes. Analytics can be blocked by browser, network or stream settings; local text generation checks do not verify real reporting. Return to the [reference index](/en/blog/config-reference/).
