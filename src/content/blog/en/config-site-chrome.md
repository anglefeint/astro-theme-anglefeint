---
tags: ['anglefeint', 'config']
title: 'Configuration Reference: Site Identity, Navigation, Social Links and Footer'
subtitle: 'Site name and domain, shared navigation messages, social icons and footer attribution.'
description: 'Actual site fields, environment precedence, social-link validation, footer controls and unused localized siteTitle compatibility settings.'
pubDate: '2026-11-13'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/matrix-01.webp'
---

To replace your information, start with [Installation and site identity](/en/blog/starter-guide-1-configure-your-site/). Domain publishing is in the [deployment tutorial](/en/blog/starter-guide-deployment/). Other modules are in the [configuration index](/en/blog/config-reference/).

Settings live in src/site.config.ts. Defaults are package defaults, not the demo author's name, accounts or domain. Merge snippets into existing defineThemeConfig({...}), retaining imports, exports and other modules.

<a id="identity"></a>

## site: six global identity fields

site is an object whose fields may all be omitted from partial input. Every row is conditional: actual page consumers use the value, while environment overrides or more-specific page parameters may take precedence.

| Full path          | Type            | Theme default                                                                           | Purpose, limits and example                                                                                                                                                                                                                      |
| ------------------ | --------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `site.title`       | string          | `"My Blog"`                                                                             | Header brand, footer copyright name, RSS title, structured-data site name, and site information on some pages/generated share images. Not the homepage heading. No universal empty-string fallback. Example `"My blog"`.                         |
| `site.description` | string          | `"Cinematic web interfaces, AI-era engineering notes, and system architecture essays."` | One source of global and machine-readable descriptions. Homepage prefers messages.siteDescription; About/lists have their own sources. Does not replace every page description. Example `"Projects, reading and everyday life."`.                |
| `site.url`         | string          | `"https://example.com"`                                                                 | Public absolute site address for Astro site, canonical, RSS, sitemap and public exports. Use a real HTTP(S) address, not an article URL. Does not buy domains, configure DNS/certificates or publish code. Example `"https://blog.example.com"`. |
| `site.author`      | string          | `"Your Name"`                                                                           | Default author and structured data, overridable per article. Footer copyright uses site.title, not author. About body/email do not update automatically. Example `"Alex"`.                                                                       |
| `site.tagline`     | string          | `""`                                                                                    | Additional footer phrase, trimmed on rendering. Empty text is hidden. Exact trimmed legacy default Built with Astro. is also hidden to avoid duplicate attribution. Example `"Stay curious and keep building."`.                                 |
| `site.ogImage`     | optional string | `""`                                                                                    | Global share image when no higher-priority page/article image exists. Blank values use the bundled image. A local public path or HTTPS URL, not a homepage avatar or bulk hero-image replacement. Example `"/images/share.webp"`.                |

site.title differs from `i18n.locales.<locale>.site.homeTitle`: the former is global identity, the latter only a localized visible homepage heading. The latter finds a nonempty value through the locale chain, finally using the global name. See [homepage title](/en/blog/config-home/#home-title). messages.siteTitle currently controls neither standard identity nor homepage headings; do not expect branding to change through it.

site.description is not the visible homepage introduction either. That uses `i18n.locales.<locale>.site.hero`; homepage metadata also has messages.siteDescription. See [homepage precedence](/en/blog/config-home/#site-fallbacks). Global identity changes do not rewrite an existing About profile.

### Share-image priority and paths

The shared head uses site.ogImage only without a page image. Article ogImage, generated share images or covers can take precedence; see [article frontmatter](/en/blog/config-article/#frontmatter). Global automatic share images mean site.ogImage cannot be expected to replace every article image.

Local /images/share.webp corresponds to public/images/share.webp and must exist first. Missing files, paths outside publicDir or invalid paths cause errors when resolving the fallback. Local images receive deployment base and a content-version parameter. HTTPS images retain their remote URL without download validation. Empty/whitespace values use the theme image, rather than removing sharing metadata.

site.ogImage takes strings, not Astro image-import objects. Article frontmatter.ogImage supports different types. No PUBLIC_SITE_OG_IMAGE override exists; this field does not change heroImage.

<a id="environment"></a>

## Environment overrides and domain precedence

These are environment variables, not additional site.config fields. All are strings; unset values use the corresponding site field. Nullish coalescing does not treat empty strings as unset.

| Environment variable    | Overrides        | Example                                          |
| ----------------------- | ---------------- | ------------------------------------------------ |
| PUBLIC_SITE_TITLE       | site.title       | PUBLIC_SITE_TITLE=My Blog                        |
| PUBLIC_SITE_DESCRIPTION | site.description | PUBLIC_SITE_DESCRIPTION=Projects and study notes |
| PUBLIC_SITE_AUTHOR      | site.author      | PUBLIC_SITE_AUTHOR=Alex                          |
| PUBLIC_SITE_TAGLINE     | site.tagline     | PUBLIC_SITE_TAGLINE=Stay curious                 |
| PUBLIC_SITE_URL         | site.url         | PUBLIC_SITE_URL=https://blog.example.com         |

Integration reads PUBLIC_SITE_URL using Vite dotenv modes for dev/build and --mode, keeping Astro site and public URLs aligned. Existing process environment wins over dotenv. Do not update only site.url while forgetting a deployment-platform PUBLIC_SITE_URL. Empty strings may clear text or invalidate the URL; they do not restore defaults.

Page-side SITE_URL retains import.meta.env.SITE as an intermediate fallback: PUBLIC_SITE_URL → SITE → site.url. Standard integration sets Astro site from PUBLIC_SITE_URL or configured URL, and page head prefers Astro.site. SITE is adapter compatibility fallback, not a recommended second domain setting.

Domain and deployment subpath are distinct. Configure Astro base, hosting output and DNS/HTTPS using the deployment tutorial. Adding an arbitrary subdirectory to site.url does not move every route. Restart dev and rebuild/redeploy production after changes. Server redirects are not configured automatically.

<a id="navigation"></a>

## Public navigation: fixed entries and feature switches

There is no public nav array, menu-order field or custom menu-item setting. Standard header entries are assembled as follows:

| Position                 | Current source and limits                                                                                                |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| Brand                    | site.title / environment override; links to the current-language homepage.                                               |
| Home, Blog               | Both standard entries always remain. Labels use messages.nav.home / blog; text does not change destinations.             |
| About                    | theme.enableAboutPage, boolean, default true. theme: { enableAboutPage: false } disables the page and entry.             |
| Decoder under Frontier   | theme.enableDecoderPage, boolean, default true. Header label is fixed as Decoder Lab.                                    |
| Fragments under Frontier | theme.fragments.enabled, boolean, default false. Label uses messages.fragments.title.                                    |
| Contact under Frontier   | Appears when About is enabled; uses messages.about.contact and current-language /about/#contact. Independent of Decoder. |
| Search                   | theme.search.enabled, boolean, default true. See [search](/en/blog/config-search/#enabled).                              |
| Language and status      | Enabled languages, meta.label and static status messages below. Language options are not arbitrary link lists.           |

The component fixes the Frontier heading/name; it is omitted only without any children. Changing messages.decoderPage.fullTool affects the full tool page and footer tool link, not the fixed header Decoder Lab label.

For languages/URLs, see [language boundaries](/en/blog/config-languages/#content-and-seo). About, Fragments and Decoder settings remain in their own references. Empty labels do not disable navigation and can leave unclear buttons or retained destinations.

<a id="chrome-messages"></a>

### Seven header/footer messages

The full prefix is `i18n.locales.<locale>.messages`. All are optional strings using built-in locale messages and fallback. Only Simplified Chinese / English defaults are shown. All are conditional on their navigation/attribution area existing. Values render as text, not Markdown or arbitrary HTML.

| Relative field     | Simplified Chinese / English defaults | Purpose and limits                                                            | Example value     |
| ------------------ | ------------------------------------- | ----------------------------------------------------------------------------- | ----------------- |
| `nav.home`         | 首页 / Home                           | Home navigation text; does not change the route.                              | `"Home"`          |
| `nav.blog`         | 博客 / Blog                           | Blog entry text; does not change the route.                                   | `"Articles"`      |
| `nav.about`        | 关于 / About                          | About entry text, also used to reopen the body window.                        | `"About me"`      |
| `nav.status`       | system: online / system: online       | Static header status text; does not monitor networks, APIs or service health. | `"System online"` |
| `nav.statusAria`   | 系统状态 / System status              | Accessible name of the status area, not a monitoring switch.                  | `"Site status"`   |
| `footer.theme`     | 主题： / Theme by                     | Theme attribution prefix; Anglefeint link text and destination are fixed.     | `"Theme by"`      |
| `footer.builtWith` | 构建工具： / Built with               | Astro attribution prefix; Astro link text and destination are fixed.          | `"Built with"`    |

messages.langLabel names the language control; options use meta.label. See [language messages](/en/blog/config-languages/#common-messages). Contact and Fragments reuse module messages rather than new messages.nav fields.

<a id="social"></a>

## social.links: shared header/footer social links

- **Type / default:** SocialLink[] / []; five item fields are below.
- **Status and purpose:** Active. Header/footer share the array in order. Arrays replace entirely. There is no public maximum count or per-language version.
- **Limits:** [] does not hide the region completely: standard components show non-clickable Mastodon, Twitter and GitHub placeholders, with a development hint in dev. An existing item with empty href still renders a link rather than becoming a placeholder.
- **Example:** [{ label: 'GitHub', href: 'https://github.com/yourname', icon: 'github' }].

About email/GitHub contact settings are separate; this array does not update that paragraph. There is no site.config theme.social.enabled or hidePlaceholders switch. showPlaceholdersWhenEmpty is a layout prop.

<a id="social-fields"></a>

### Five fields per SocialLink

The full prefix is social.links[]. Required fields have no automatic values. Even if partial input types accept partial items, provide complete valid entries.

| Field   | Type / default                                                        | Status, purpose and limits                                                                                                                                                                            | Example value                 |
| ------- | --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| href    | required string / none                                                | Active: destination URL. No unified protocol, reachability or nonempty validation, nor automatic BASE_URL prefix. Use complete HTTPS URLs or correct internal paths; this is not a verified account.  | 'https://github.com/yourname' |
| label   | required string / none                                                | Active: accessible name and visible text when no icon exists. Platform names/page titles are not fetched automatically. Supply a meaningful nonempty label.                                           | 'GitHub'                      |
| rel     | optional string / unset; output contains at least noopener noreferrer | Active: whitespace-separated relationship tokens, lowercased, deduplicated, with opener removed and new-window protection retained. Empty strings do not remove protection. Non-strings cause errors. | 'me nofollow'                 |
| icon    | optional built-in SocialIcon / unset                                  | Conditional: one of twelve names below, used without iconSrc. Unknown nonempty names cause errors. Platforms are not inferred from URLs. Without either icon source, label text is used.              | 'github'                      |
| iconSrc | optional string / unset                                               | Conditional: custom local SVG/PNG/WebP path in publicDir; a valid nonempty path takes priority over icon. Whitespace means unset; non-strings or invalid paths cause errors.                          | '/icons/community.svg'        |

All real entries open a new tab. Custom rel merges with protection tokens. Text labels do not parse HTML. Built-in icon names are exact and case-sensitive:

```text
mastodon
twitter
github
youtube
bluesky
linkedin
discord
telegram
instagram
facebook
whatsapp
line
```

### Custom icon file restrictions

public/icons/community.svg corresponds to iconSrc: '/icons/community.svg'. Files must be in the actual publicDir, not package assets or src/assets. Paths must start with one / and cannot be URLs, protocol-relative addresses, query/fragment URLs, percent-encoded paths or contain . / .. segments. Backslashes, colons and control characters are rejected.

Build checks require an existing regular file whose resolved real path stays inside publicDir; escaping through symlinks is rejected. Components encode ordinary spaces and Chinese filenames, so do not percent-encode them first. Output icon paths receive Astro base; this does not change the unchanged href handling. JPG and GIF are not supported here.

With valid iconSrc, icon does not participate in selection. Icon size/spacing are component layout props, not SocialLink fields.

<a id="footer"></a>

## theme.footer: footer links and attribution

| Full path                  | Type / default                         | Status, purpose and limits                                                                                                                                                                    | Example value                                                |
| -------------------------- | -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| theme.footer.showCredits   | boolean / true                         | Active: shows linked theme/Astro attribution without removing copyright, socials, tagline or other links. Also affects generated article share-image attribution, not supplied custom images. | false                                                        |
| theme.footer.links         | { label: string; href: string }[] / [] | Active: custom footer links in array order; whole-array replacement. Does not change the header. Layouts may append Decoder, so [] does not guarantee no footer links.                        | [{ label: 'Project', href: 'https://example.com/project/' }] |
| theme.footer.links[].label | required string / none                 | Conditional: visible plain-text label; not retrieved from the destination.                                                                                                                    | 'Project'                                                    |
| theme.footer.links[].href  | required string / none                 | Conditional: destination passed unchanged, without social-icon-style validation or automatic base prefix. Supply correct internal paths. Navigates in the same tab by default.                | 'https://example.com/project/'                               |

Custom links precede layout-appended links and are not deduplicated. Enabled Decoder adds a full-tool link to the public frame using messages.decoderPage.fullTool. Disable the standalone feature if unnecessary; clearing footer.links does not remove it.

Copyright uses the build year and effective SITE_TITLE, without independent copyright/year settings. site.tagline appears separately from attribution. The trimmed legacy default Built with Astro. is omitted. showCredits: false neither removes other phrases nor attribution already present in images.

<a id="examples"></a>

## Site and shared-link examples to merge

Keep personal information already configured and merge only required fields:

```ts
site: {
  title: 'Alex’s blog',
  description: 'Projects, reading and everyday life.',
  url: 'https://blog.example.com',
  author: 'Alex',
  tagline: 'Stay curious and keep building.',
},
social: {
  links: [
    { label: 'GitHub', href: 'https://github.com/yourname', icon: 'github' },
    { label: 'Project home', href: 'https://example.com/project/' },
  ],
},
theme: {
  footer: {
    showCredits: true,
    links: [{ label: 'Project', href: 'https://example.com/project/' }],
  },
},
```

Replace example accounts, domains and links with your own; the theme does not validate them online. Prepare public files before configuring custom social iconSrc or site.ogImage.

To change only English navigation and attribution prefixes:

```ts
i18n: {
  locales: {
    en: {
      messages: {
        nav: { home: 'Home', blog: 'Articles', about: 'About me' },
        footer: { theme: 'Theme by', builtWith: 'Built with' },
      },
    },
  },
},
```

<a id="legacy-site-title"></a>

## Currently unused: messages.siteTitle

Full path: `i18n.locales.<locale>.messages.siteTitle`. An optional string override, with both Simplified Chinese / English built-in defaults 'Angle Feint'. Standard homepage headings and global identity currently do not read it; status: currently unused. For example, siteTitle: 'My blog' does not rename these areas.

Use `i18n.locales.<locale>.site.homeTitle` for homepage headings and top-level site.title for the public brand. See [homepage title](/en/blog/config-home/#home-title) and [site identity](#identity). This retained field is unnecessary for renaming.

<a id="boundaries"></a>

## Compatibility and unused-field boundaries

- All six site fields, social/footer fields and seven messages have consumers, but image priority, environment overrides and feature switches determine actual page output.
- Built with Astro. in site.tagline is a special legacy-default compatibility value. Suppression does not mean arbitrary taglines are disabled.
- messages.siteTitle is unused as described above. Accepted types do not imply a page consumer.
- homeHref, localeHrefs, extraLinks, showPlaceholdersWhenEmpty and iconSize are component props, not site.config fields. No public nav array, social-placeholder switch, copyright template or independent status monitoring exists.

After saving and preparing files, rebuild and deploy. Environment changes require reloading the appropriate mode. Confirm domains, link reachability, remote accounts and actual pages on your deployment; passing local types alone cannot prove success. Return to the [configuration index](/en/blog/config-reference/).
