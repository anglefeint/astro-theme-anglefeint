---
tags: ['anglefeint', 'config']
title: 'Configuration Reference: Giscus Comments and Shared Discussions'
subtitle: 'Article and fragment switches, connection values, mapping and multilingual sharing.'
description: 'All comment fields with types, defaults, overrides, validation limits and examples, including shared article discussions and fragment IDs.'
pubDate: '2026-11-13'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

For initial setup, read [Let readers leave comments](/en/blog/starter-guide-4-giscus-comments/) for repository preparation and parameter retrieval. See [Installation and site identity](/en/blog/starter-guide-1-configure-your-site/) for the config file and the [configuration index](/en/blog/config-reference/) for other modules.

Shared settings live in theme.comments in src/site.config.ts. Comments default to off. Defaults below belong to the theme package, not the demo's connected personal repository. Repository IDs and parameters are public connection information included in pages. Never enter GitHub access tokens or other secrets.

<a id="controls"></a>

## Distinguish the two switches

| Path                             | Type / default  | Status, purpose and limits                                                                                                                                                                     | Example                                                              |
| -------------------------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| theme.comments.enabled           | boolean / false | Conditional: article comments only, not fragment buttons. Missing connection values may suppress the area; rendering does not validate the remote service.                                     | theme: { comments: { enabled: true } }                               |
| theme.fragments.comments.enabled | boolean / false | Conditional: fragment-list comments; also requires theme.fragments.enabled. Independent of article comments. Missing required connection values cause an error when generating fragment pages. | theme: { fragments: { enabled: true, comments: { enabled: true } } } |

Articles have no per-post comments: false frontmatter switch. Fragments likewise have no per-entry switch; homepage fragment previews show no comment button. See the [Fragments reference](/en/blog/config-fragments/#comments-enabled).

## Every theme.comments field

All fields below have the prefix theme.comments.; for example, repo means theme.comments.repo. Each may be omitted from partial input and filled by theme defaults. String flags must stay quoted, not booleans or numbers.

All are conditional: article comments must be enabled and eligible for output. Fragments use only a subset and override or ignore the rest. Empty strings do not universally restore defaults; see each row. Correct types and nonempty values do not prove valid remote Giscus configuration, apart from explicitly checked mapping constraints.

<a id="connection"></a>

### Repository and category

| Field        | Type   | Default | Purpose, conditions and limits                                                                                                                                                        | Example value                     |
| ------------ | ------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| `repo`       | string | `""`    | GitHub owner/repo. Articles require a truthy value to render; fragments additionally require nonempty trimmed text. Avoid surrounding whitespace; remote permissions are not checked. | `"your-account/blog-discussions"` |
| `repoId`     | string | `""`    | Repository ID from Giscus, not its name, a numeric sequence or an access token. Shared by articles and fragments.                                                                     | `"YOUR_REPOSITORY_ID"`            |
| `category`   | string | `""`    | Discussion category name provided by Giscus, paired with categoryId; not an article tag.                                                                                              | `"Announcements"`                 |
| `categoryId` | string | `""`    | Giscus category ID, not its name. Articles require truthiness, fragments nonempty trimmed text; remote validity is not checked.                                                       | `"YOUR_CATEGORY_ID"`              |

<a id="mapping"></a>

### Article mapping and strict matching

| Field     | Type                                                                   | Default      | Purpose, conditions and limits                                                                                                                                                                           | Example value           |
| --------- | ---------------------------------------------------------------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| `mapping` | 'pathname' \| 'url' \| 'title' \| 'og:title' \| 'specific' \| 'number' | `"pathname"` | Article-to-discussion mapping; values explained below. Sharing requires specific. Fragments ignore this field.                                                                                           | `"pathname"`            |
| `term`    | string                                                                 | `""`         | Non-shared articles use this in specific mode; must be nonempty after trimming. A fixed site-wide term. Sharing requires it empty and supplies the article slug at render time. Not sent in other modes. | `"my-fixed-discussion"` |
| `number`  | string                                                                 | `""`         | Used for non-shared number mode: a trimmed positive safe-integer string without leading zeros, plus signs or decimals. Sharing requires it empty. Not sent in other modes.                               | `"42"`                  |
| `strict`  | '0' \| '1'                                                             | `"0"`        | Article strict-matching flag, a string rather than boolean. Sharing requires 1; fragments force 1. Does not merge discussions with identical titles.                                                     | `"1"`                   |

<a id="appearance"></a>

### Appearance, language and loading

| Field              | Type                             | Default       | Purpose, conditions and limits                                                                                                                                                             | Example value |
| ------------------ | -------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------- |
| `reactionsEnabled` | '0' \| '1'                       | `"1"`         | Shows reactions on the discussion post; shared by articles/fragments. Does not disable all commenting actions.                                                                             | `"1"`         |
| `emitMetadata`     | '0' \| '1'                       | `"0"`         | Requests discussion metadata messages to the parent. Articles pass the setting without automatically displaying counts. Fragments force 1 to track loading and discussion changes.         | `"0"`         |
| `inputPosition`    | 'top' \| 'bottom'                | `"bottom"`    | Comment input above/below the list; shared by articles/fragments. Does not move the entire comments area.                                                                                  | `"top"`       |
| `theme`            | string                           | `"dark"`      | Giscus iframe theme, not Matrix/Cyber/Hacker/AI. Shared by articles/fragments; names are not validated and do not follow page scenes automatically.                                        | `"dark"`      |
| `lang`             | string                           | `"en"`        | Article comment interface language. Nonempty values pass directly; empty values map from page language. Fragments always follow the page and ignore this. Does not translate comment text. | `""`          |
| `loading`          | 'lazy' \| 'eager'                | `"lazy"`      | Article iframe loading hint, not deferred insertion of all client.js. Fragments force eager but insert the client only after a click.                                                      | `"lazy"`      |
| `crossorigin`      | 'anonymous' \| 'use-credentials' | `"anonymous"` | crossorigin on the Giscus client script, shared by articles/fragments. Not a repository credential, GitHub token or permissions fix.                                                       | `"anonymous"` |

<a id="sharing"></a>

## theme.comments.shareAcrossLocales: share article discussions

- **Type / default:** Optional boolean / false.
- **Status and purpose:** Conditional on article comments being enabled. Language versions with the same full slug share one discussion; different slugs remain separate.
- **Limits:** Requires mapping 'specific', empty trimmed term and number, and string strict '1'. Otherwise configuration errors occur; changing only the boolean is insufficient. These enabled-mode constraints are skipped when article comments are off, but fragment connection checks still apply.
- **Example:** Shared settings below. Sharing does not translate comments, merge existing discussions or change fragment associations.

| Article file                         | Actual shared term |
| ------------------------------------ | ------------------ |
| src/content/blog/zh/my-first-post.md | my-first-post      |
| src/content/blog/en/my-first-post.md | my-first-post      |
| src/content/blog/zh/guides/setup.md  | guides/setup       |
| src/content/blog/en/other/setup.md   | other/setup        |

Association uses the complete slug without its language directory, not article title, canonicalTopic or body. Standard article routes supply articleSlug. Custom BlogPost calls must also supply a nonempty complete slug without surrounding whitespace, empty segments or . / .. segments. This component prop is not a site.config field.

Multiple sites using the same repository, category and slug may reach the same discussion. Domains do not provide additional database isolation. With the path retained, title changes do not change the shared term. Changing slug, repository, category or mapping strategy may select another discussion.

<a id="mapping-values"></a>

## What mapping values mean

| Value    | Giscus matches using       | Limits and examples                                                                                               |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| pathname | Page URL path              | Default; language paths usually differ. Changing paths may change the association.                                |
| url      | Full page URL              | Changing domain or address may change the association.                                                            |
| title    | Document title             | Changing article or site titles may change the association; not just the body h1.                                 |
| og:title | Page Open Graph title      | Reads existing metadata; theme.comments does not set the title.                                                   |
| specific | Specified term             | A fixed site-wide term without sharing; generated from each article slug with sharing.                            |
| number   | Existing Discussion number | A fixed site-wide number such as string '42'; not an issue number and does not create a discussion automatically. |

Giscus handles matching and creation. A missing discussion may be created on the first comment or reaction; opening a page alone does not guarantee creation. The repository must be public, enable Discussions and install the Giscus app; see the tutorial and [official setup](https://giscus.app/). The theme has no local comment database.

With strict '1', Giscus matches using a title hash in discussion bodies, rather than the theme locally comparing titles. Existing discussions may need matching markers; see [strict matching](https://github.com/giscus/giscus/blob/main/ADVANCED-USAGE.md#data-strict). Enabling sharing or changing mapping does not migrate, merge or delete old discussions. Old comments can remain on GitHub while disappearing from a new association. Identify existing discussions and new terms before migration.

Without sharing, specific plus a fixed term sends all articles using that configuration to the same discussion. number likewise selects one site-wide discussion. Neither automatically assigns an ID per article. Irrelevant term/number values are not sent, but the theme still trims both configuration strings; never substitute null or numbers.

<a id="examples"></a>

## Configuration examples to merge

Merge into existing defineThemeConfig({...}) in src/site.config.ts, retaining imports, exports and personal settings without duplicating theme. Get all four connection values from your own Giscus setup; placeholders illustrate structure and cannot validate a live setup.

### Separate article comments by path

```ts
theme: {
  comments: {
    enabled: true,
    repo: 'your-account/blog-discussions',
    repoId: 'YOUR_REPOSITORY_ID',
    category: 'Announcements',
    categoryId: 'YOUR_CATEGORY_ID',
    shareAcrossLocales: false,
    mapping: 'pathname',
    lang: '',
  },
},
```

### Share one discussion across translations

Keep your own connection values and merge these mapping settings:

```ts
theme: {
  comments: {
    enabled: true,
    shareAcrossLocales: true,
    mapping: 'specific',
    term: '',
    number: '',
    strict: '1',
    lang: '',
  },
},
```

The actual lang default is 'en', not follow-page. The example explicitly uses an empty string to enable page-language mapping: zh becomes zh-CN, zh-hant becomes zh-TW, pt-br becomes pt; other codes pass directly. Giscus determines supported languages. Changing language changes the interface, not discussion identity or posted text. theme.comments is site-wide and is not duplicated under i18n.locales.

The theme string passes directly to Giscus; common values include 'dark' and 'light'. Giscus owns supported themes and custom CSS URLs; these do not change the outer AI panel. See [official theme guidance](https://github.com/giscus/giscus/blob/main/ADVANCED-USAGE.md#data-theme). The package does not validate custom CSS content or accessibility.

<a id="fragment-overrides"></a>

## Which shared settings do fragments use?

| Shared field                                           | Actual fragment behavior                                                                                                                          |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| repo / repoId / category / categoryId                  | Shared. All four must be nonempty after trimming. Original values are passed, so omit surrounding whitespace. Remote permissions are not checked. |
| theme / reactionsEnabled / inputPosition / crossorigin | Uses shared values.                                                                                                                               |
| enabled                                                | Ignores the article switch; uses theme.fragments.comments.enabled.                                                                                |
| shareAcrossLocales                                     | Unused; the same stable ID already binds the same discussion.                                                                                     |
| mapping / term / number                                | Forces specific, term `fragment/<ID>`, and sends no number.                                                                                       |
| strict / emitMetadata                                  | Forces '1' / '1'.                                                                                                                                 |
| lang                                                   | Ignores shared lang; always maps the current fragment page language.                                                                              |
| loading                                                | Forces eager, but inserts the client only on the first comment-button click.                                                                      |

For example, enable only fragment comments while disabling article comments:

```ts
theme: {
  comments: {
    enabled: false,
    repo: 'your-account/blog-discussions',
    repoId: 'YOUR_REPOSITORY_ID',
    category: 'Announcements',
    categoryId: 'YOUR_CATEGORY_ID',
  },
  fragments: { enabled: true, comments: { enabled: true } },
},
```

Multilingual fragments with the same ID share `fragment/<ID>`, independently of article-slug sharing. Do not change stable IDs to reorder or repaginate entries. The dialog loads on its first click and retains its iframe after closing. Switching entries sends Giscus configuration messages. About 15 seconds without a valid result shows failure/retry. There is no public timeout or preloading setting. Enabling article comments still runs their mapping validation even if your main intention is fragment comments.

<a id="messages"></a>

## The page's own comment text

These optional string fields sit under `i18n.locales.<locale>.messages`, using built-in language messages and fallback. Put examples in the corresponding object. They change outer labels, not buttons inside the iframe. Only Simplified Chinese / English defaults are shown.

| Relative field       | Simplified Chinese / English defaults                                                                                     | Status, purpose and limits                                                                               | Example value                              |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| `blog.comments`      | 评论 / Comments                                                                                                           | Conditional: accessible name of the article comments region, not another visible heading.                | `"Article discussion"`                     |
| `fragments.comments` | 评论 / Comments                                                                                                           | Conditional: fragment comment button and dialog title.                                                   | `"Join the discussion"`                    |
| `fragments.close`    | 关闭 / Close                                                                                                              | Conditional: dialog close button; also the accessible name of the homepage fragment-window close button. | `"Close window"`                           |
| `fragments.loading`  | 正在加载评论… / Loading comments…                                                                                         | Conditional: fragment comment loading state.                                                             | `"Loading discussion…"`                    |
| `fragments.error`    | 评论未能加载，请检查网络或评论配置后重试。 / Unable to load comments. Check your network or comment settings, then retry. | Conditional: fragment comment failure message.                                                           | `"Discussion is temporarily unavailable."` |
| `fragments.retry`    | 重试 / Retry                                                                                                              | Conditional: retry button after fragment comment failure.                                                | `"Reload"`                                 |

Other text appears in the [article reference](/en/blog/config-article/#article-messages) and [Fragments reference](/en/blog/config-fragments/#fragment-messages). These fields do not choose the iframe language; the lang rules above do.

<a id="limits"></a>

## Loading and validation boundaries

Articles output asynchronous client.js; loading: 'lazy' is passed to the iframe and does not wait for scrolling before inserting the script. Fragments output a template first and insert the client on click; eager describes the iframe after clicking. [Official loading guidance](https://giscus.app/) distinguishes those layers.

Local checks validate article mapping constraints and fragment required fields, not GitHub sign-in, app authorization, repository visibility, category correctness, connectivity or service availability. Empty article connection fields can suppress rendering. Whitespace-only values may still meet article output conditions and are not valid configuration. Fragment nonempty checks are stricter but do not validate IDs remotely.

Every theme.comments field currently has a consumer, but not every field applies to fragments; overrides are listed above. There is no public per-article switch, self-hosted service address, comment-order field, administrator token or local database setting. The client URL is fixed at https://giscus.app/client.js. Giscus repository configuration does not create additional site.config fields.

Rebuild and deploy after changes. A passing build does not validate the live comment service. Discussion migration and permissions must be handled in GitHub/Giscus, not by saving site.config. Return to the [configuration index](/en/blog/config-reference/) for other modules.
