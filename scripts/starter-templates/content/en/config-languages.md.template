---
tags: ['anglefeint', 'config']
title: 'Configuration Reference: Languages, URLs, Messages and Fallback'
subtitle: 'Register and enable languages, choose homepage addressing and understand each fallback mechanism.'
description: 'Actual i18n field types, defaults, merge order, routing limits, content behavior and examples for built-in and custom languages.'
pubDate: '2026-11-13'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/hacker-01.webp'
---

For step-by-step language activation or publishing translations, start with the [language tutorial](/en/blog/starter-guide-languages/). See [Installation and site identity](/en/blog/starter-guide-1-configure-your-site/) for the config file and the [configuration index](/en/blog/config-reference/) for other modules.

This page covers i18n registration, addressing and resolution, without repeating every module's messages. Per-field defaults and examples for Home, articles, Fragments, About, Decoder, music and comments belong to their references. Defaults below come from the package, not demo overrides.

<a id="registry"></a>

## i18n.defaultLocale and i18n.locales

| Full path             | Type / theme default                                                      | Status, purpose and limits                                                                                                                                                                                                 | Example                                                    |
| --------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| i18n.defaultLocale    | string / 'en'                                                             | Active: root homepage language/redirect, required fallback and default-language links. Empty strings normalize to en. No browser-language detection. The default language is always enabled, regardless of enabled: false. | i18n: { defaultLocale: 'zh' }                              |
| i18n.locales          | Record<string, LocaleConfig> / nine built-in languages below              | Active: keys define language codes, content directories and URLs. Recursive merging means omitting a built-in language does not delete it. New languages need your own messages and content.                               | i18n: { locales: { fr: { meta: { label: 'Français' } } } } |
| `i18n.locales.<语言>` | Partial LocaleConfig / built-ins have existing settings; new codes do not | Active: contains meta, site, messages, about and aiReadableContent. Omitted fields follow merging/fallback; an empty object does not clear an existing language.                                                           | locales: { zh: { meta: { enabled: false } } }              |

A language key is neither its menu name nor hreflang. EN is not automatically normalized to en, nor zh-CN directories to zh. Use consistent lowercase codes in directories, configuration and creation commands, such as zh, en, pt-br and zh-hant. Scaffolding accepts two or three letters with an optional hyphenated segment. Runtime normalization is not a comprehensive language-code/path validator: do not enter paths or arbitrary punctuation.

If the default language is unregistered, normalization adds an entry labeled with its code. This does not prepare content or translations. Changing defaultLocale does not move existing files.

### Actual built-in defaults

Without overrides, all nine languages are enabled. Default language en has no fallback; others fall back to en. Ordering follows configuration registration, not meta.label. There is no independent menu-order field.

| Code      | meta.label         | meta.hreflang | meta.ogLocale | Effective enabled | Effective fallback |
| --------- | ------------------ | ------------- | ------------- | ----------------- | ------------------ |
| `en`      | English            | `en`          | `en_US`       | true              | `[]`               |
| `ja`      | 日本語             | `ja`          | `ja_JP`       | true              | `["en"]`           |
| `ko`      | 한국어             | `ko`          | `ko_KR`       | true              | `["en"]`           |
| `es`      | Español            | `es`          | `es_ES`       | true              | `["en"]`           |
| `zh`      | 简体中文           | `zh-CN`       | `zh_CN`       | true              | `["en"]`           |
| `pt-br`   | Português (Brasil) | `pt-BR`       | `pt_BR`       | true              | `["en"]`           |
| `de`      | Deutsch            | `de`          | `de_DE`       | true              | `["en"]`           |
| `ru`      | Русский            | `ru`          | `ru_RU`       | true              | `["en"]`           |
| `zh-hant` | 繁體中文           | `zh-Hant`     | `zh_TW`       | true              | `["en"]`           |

<a id="meta"></a>

## `i18n.locales.<语言>.meta`: five metadata fields

Relative fields below belong inside meta. Built-in defaults are above; normalization for new languages is below. Input supports partial overrides, so types do not require rewriting every field each time.

| Relative path | Type / when omitted for a new language                                      | Status, purpose and limits                                                                                                                                                                             | Example value |
| ------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------- |
| meta.label    | string / language code                                                      | Active: language-menu option name. Empty strings also use the code; whitespace is not trimmed. Does not rename directories or URLs.                                                                    | 'Français'    |
| meta.hreflang | optional string / language code                                             | Active: standard-page html lang, hreflang and some structured-data language values. Does not change the path key. Empty strings fall back to the code; no format validation.                           | 'fr'          |
| meta.ogLocale | optional string / unset                                                     | Conditional: Open Graph locale and available alternate metadata. Unset/empty values omit the tag; region codes are not inferred. Empty overrides clear built-in values.                                | 'fr_FR'       |
| meta.enabled  | optional boolean / true                                                     | Active: only false disables a non-default language. The default is always enabled. Affects standard pages and menus, not files or custom pages; not access control.                                    | false         |
| meta.fallback | optional string[] / non-default adds default language; default starts empty | Active: direct configuration fallback chain. Arrays replace entirely. Self, duplicates, empty strings and unregistered codes are removed. Non-default languages always ultimately include the default. | ['zh', 'en']  |

hreflang and ogLocale are distinct and do not replace the language key. Custom-language metadata is not automatically made regionally correct; use values matching actual content.

<a id="routing"></a>

## i18n.routing.defaultLocalePrefix: default homepage address

- **Type / default:** 'always' | 'never' / 'always'.
- **Status and purpose:** Active, currently changes only the default homepage's canonical entry, not all default-language prefixes. Empty strings are outside the public type; runtime treats invalid values as always, which should not be relied upon.
- **Limits:** Does not generate unprefixed /blog/, /about/, etc. Rebuild and redeploy after changes. Existing links and hosting redirects are not migrated automatically.
- **Example:** i18n: { routing: { defaultLocalePrefix: 'never' } }.

Assuming defaultLocale en:

| Address           | always                         | never                          |
| ----------------- | ------------------------------ | ------------------------------ |
| /                 | Static HTML redirect to /en/   | English homepage               |
| /en/              | English homepage               | Static HTML redirect to /      |
| /en/blog/         | English blog list              | English blog list              |
| /en/blog/my-post/ | English article                | English article                |
| /en/about/        | English About, when enabled    | English About, when enabled    |
| /zh/              | Chinese homepage, when enabled | Chinese homepage, when enabled |

Redirects between root and localized homepages are static meta-refresh pages with canonical and noindex. They neither detect visitor location nor configure a server 301. Internal locale-path helpers normally still create `/<代码>/.../`; each entry decides whether to use the root homepage.

<a id="overrides"></a>

## Where site, messages and about overrides belong

The full prefix is `i18n.locales.<语言>`. Objects merge recursively; arrays replace entirely; undefined does not overwrite existing values. Empty strings, false and empty arrays remain, interpreted by each field.

| Relative path  | Type / default                                                                         | Purpose, limits and example                                                                                                                                             | Field reference                                          |
| -------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| site           | { homeTitle?: string; hero?: string } / built-in localized homepage settings           | Localized homepage content only; does not replace top-level site identity. Example: site: { homeTitle: '我的博客' }                                                     | [Homepage](/en/blog/config-home/#site-fallbacks)         |
| site.homeTitle | optional string / unset                                                                | Uses the first nonempty trimmed title in the current/direct fallback languages, finally SITE_TITLE. Example '我的博客'. Empty strings do not stop fallback.             | [Homepage heading](/en/blog/config-home/#home-title)     |
| site.hero      | optional string / built-in locale introduction; unset for new languages                | First defined value in the chain. Empty strings clear it and stop fallback. If none exists, messages.home.hero is the final homepage backup. Example '记录项目与生活。' | [Homepage introduction](/en/blog/config-home/#home-hero) |
| messages       | DeepPartial<Messages> / locale overrides usually unset; runtime adds built-in messages | Buttons, status, meta descriptions, etc. Example messages: { nav: { home: '主页' } }. Changes text without adding functionality or translating content.                 | [Configuration index](/en/blog/config-reference/)        |
| about          | DeepPartial<AboutConfig> / built-in localized About settings                           | Recursively merges the chain over base About. Example about: { sections: { who: '我是一名开发者。' } }. Does not read Markdown body automatically.                      | [About](/en/blog/config-about/#about-content)            |

Exact built-in hero defaults follow. The default configuration does not supply homeTitle:

| Language  | site.hero default                                                                          |
| --------- | ------------------------------------------------------------------------------------------ |
| `en`      | Write a short introduction for your site and what readers can expect from your posts.      |
| `ja`      | このサイトの紹介文と、読者がどんな記事を期待できるかを書いてください。                     |
| `ko`      | 사이트 소개와 방문자가 어떤 글을 기대할 수 있는지 간단히 작성하세요.                       |
| `es`      | Escribe una breve presentación del sitio y qué tipo de contenido encontrarán tus lectores. |
| `zh`      | 在这里写一段站点简介，并告诉读者你将发布什么类型的内容。                                   |
| `pt-br`   | Apresente seu site e conte o que os leitores encontrarão nos seus artigos.                 |
| `de`      | Stelle deine Website kurz vor und beschreibe, was Leser in deinen Beiträgen erwartet.      |
| `ru`      | Кратко представьте свой сайт и расскажите, какие статьи здесь найдут читатели.             |
| `zh-hant` | 簡短介紹你的網站，並告訴讀者這裡會有哪些內容。                                             |

<a id="fallback"></a>

## Exact fallback order

For a current language fr whose effective meta.fallback is ['zh', 'en'], resolution uses fr → zh → en directly, or merges in reverse. It does not expand zh's own fallback. To include ja, explicitly add ja to fr's array.

1. Omitting fallback or setting [] still adds the default language for non-default languages. The default may have no fallback or specify other registered languages.
2. Self, duplicates and unregistered codes are removed. Registration, not enablement, is checked: disabled languages can still supply configuration fallback.
3. If a non-default language omits the default, it is appended. If explicitly present, its original position is retained rather than moved to the end.
4. Ordinary messages start from built-in English, process the effective chain in reverse, and merge each language's built-in package followed by personal overrides. Thus a current language's built-in translation can override personal text from a fallback language.

Changing en nav.home to 'Start' therefore does not change built-in zh “首页”. Override zh.messages.nav.home directly. New languages without a built-in package can inherit interface text, but do not receive complete automatic translations.

Different content uses different fallback algorithms:

| Content                     | Current behavior                                                                                                                                                                  |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ordinary messages           | Built-in English → fallback-language built-ins and overrides → current-language built-ins and overrides.                                                                          |
| site.homeTitle              | First nonempty trimmed value in the direct chain, then global site title.                                                                                                         |
| site.hero                   | First defined value in the direct chain; empty strings stop lookup.                                                                                                               |
| about                       | Starts with base DEFAULT_ABOUT_CONFIG; merges locale settings in reverse direct-chain order.                                                                                      |
| messages.home.transmission  | Special case: current-language personal value → English personal value → built-in English author text. Does not use the full ordinary chain. Current built-in text: Knock, knock. |
| aiReadableContent           | Locale fields override the global supplement, without meta.fallback. See below.                                                                                                   |
| Article and fragment bodies | No message fallback; each language reads only its own content.                                                                                                                    |

Fallback does not add English articles to Chinese lists, generate translated files, search other languages to fill homepage counts or treat different slugs as translations.

<a id="common-messages"></a>

## Language selector and shared text

These optional string fields live under `i18n.locales.<语言>.messages` and use ordinary message resolution. Localized siteTitle currently does not change standard site identity; its type, default and unused status are in the [site reference](/en/blog/config-site-chrome/#legacy-site-title).

| Relative field  | Simplified Chinese / English defaults                                                            | Status, purpose and limits                                                                                                                     | Example value          |
| --------------- | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| langLabel       | 语言 / Language                                                                                  | Active: public language-selector tooltip and accessible name, not option names. Options use meta.label.                                        | '选择语言'             |
| siteDescription | 电影感网页界面与 AI 时代工程实践文章。 / Cinematic web interfaces and AI-era engineering essays. | Conditional: homepage meta description, not the visible introduction or a description shared by all pages. Other pages have their own sources. | '我的项目与学习笔记。' |

Use module references for internal feature messages. A field with no consumer does not become active just because its type exists. The comment iframe also follows theme.comments.lang, fixed to English by default; see [comments](/en/blog/config-comments/#appearance).

<a id="ai-context"></a>

## aiReadableContent: special locale supplement fallback

`i18n.locales.<语言>.aiReadableContent` overrides global notes / links independently and does not use meta.fallback. Omitted fields inherit global values. Empty notes or an empty links array explicitly clear them; {} alone does not clear global content.

Types, defaults, validation and complete examples are in the [AI-readable context reference](/en/blog/config-analytics-ai/#locale-supplement). This is neither translation nor About body; all supplements are public. Links resolve relative to the published site root. A leading / bypasses deployment base; see [link resolution](/en/blog/config-analytics-ai/#supplement).

<a id="examples"></a>

## Configuration examples to merge

Merge into existing defineThemeConfig({...}) in src/site.config.ts, preserving personal settings without duplicating i18n. These objects still recursively merge with nine built-in languages; mentioning only two does not disable the others.

### Keep only Chinese pages

```ts
i18n: {
  defaultLocale: 'zh',
  routing: { defaultLocalePrefix: 'always' },
  locales: {
    zh: { meta: { enabled: true, label: '中文' } },
    en: { meta: { enabled: false } },
    ja: { meta: { enabled: false } },
    ko: { meta: { enabled: false } },
    es: { meta: { enabled: false } },
    'pt-br': { meta: { enabled: false } },
    de: { meta: { enabled: false } },
    ru: { meta: { enabled: false } },
    'zh-hant': { meta: { enabled: false } },
  },
},
```

Default language zh cannot be disabled. Disabled English can still supply registered fallback configuration. For a root homepage, change always to never; articles remain at /zh/blog/.../.

### Add French and supply your own text

```ts
i18n: {
  locales: {
    fr: {
      meta: {
        label: 'Français',
        hreflang: 'fr',
        ogLocale: 'fr_FR',
        enabled: true,
        fallback: ['zh', 'en'],
      },
      site: {
        homeTitle: 'Mon blog',
        hero: 'Mes projets et mes notes.',
      },
      messages: {
        langLabel: 'Langue',
        nav: { home: 'Accueil', blog: 'Articles', about: 'À propos' },
      },
    },
  },
},
```

This supplies only a few French messages, not a full language package. Publish articles in src/content/blog/fr/ and fragments in src/content/fragments/fr/. Scaffolding defaults to placeholders for enabled languages; it does not translate bodies.

<a id="content-and-seo"></a>

## URL, switching and SEO boundaries

- The public language menu lists enabled languages and normally retains the current subpath; specific routes can supply their own destinations. It is not a guaranteed translation finder for arbitrary pages.
- Standard article pages find translations by full slug excluding language directories. Existing translations are linked; otherwise the menu goes to that language's Blog List. SEO declares only existing same-slug articles, never a list as a translation. Missing default-language translations do not create fake x-default article URLs.
- Fragments switches to the target language's list homepage without finding the current ID's translation. Same-ID discussion sharing is separate. Disabling languages deletes neither files nor GitHub discussions.
- meta.label changes menu text only; language keys change URL/directory conventions. Old links are not migrated. Language is not chosen from Accept-Language, browser settings or country.
- Shared message objects are text settings, not a universal arbitrary HTML/Markdown renderer. Check each module for newlines, arrays and formatting. Array replacement does not append functionality or menu items.
- There are no public independent languageOrder, autoDetect, automatic missing-translation, globally unprefixed-route or locale-specific shared-playlist fields. Custom-page localeHrefs / seoLocaleHrefs are component props, not site.config fields.

Reload development configuration after saving. Production sites require rebuilding and redeploying. Disabling languages is not a way to clean old hosting files or protect private content. Return to the [configuration index](/en/blog/config-reference/).
