---
doc_id: starter_agent_guide
doc_role: user-guide
doc_purpose: Instructions for AI assistants working on this personal blog.
doc_scope: [agent-guidance, setup, commands, config]
update_triggers: [workflow-change, command-change, config-change]
source_of_truth: true
depends_on: [README.md]
sync_targets: [CLAUDE.md, .cursor/rules/00-repo.mdc]
---

# Working on this blog

This is a personal blog built from the Anglefeint starter. Help its owner configure the site, write content and customize pages. Follow the owner's requests, preserve their existing work, and reply in their language.

## Start here

Read [README.md](README.md) or the owner's language version, then inspect `package.json` and the existing `src/site.config.ts`. Read only the tutorial needed for the task:

- [Setup and deployment](src/content/blog/en/starter-guide-1-configure-your-site.md)
- [Writing and content](src/content/blog/en/starter-guide-2-languages-and-routing.md)
- [Optional features](src/content/blog/en/starter-guide-3-comments-about-and-theme-toggles.md)

The same guides exist under `src/content/blog/<locale>/`. Actual local configuration and code determine behavior; examples should be merged into the existing configuration.

## Where to work

| Task | Location |
| --- | --- |
| Site name, domain, author, languages, About, social links, feature switches | `src/site.config.ts` |
| Articles | `src/content/blog/<locale>/<slug>.md` or `.mdx` |
| Article-relative images | Beside the article |
| Public images, icons and audio | `public/`; URLs omit `public`, e.g. `/music/song.mp3` |
| New custom pages | `npm run new-page -- projects --theme cyber`, then edit the generated page |

Keep configuration imports/exports and merge into the existing `defineThemeConfig({...})` object. Arrays replace earlier arrays: preserve entries when adding tracks or links. Inspect `.env` and hosting overrides when site identity behaves differently from the file.

Builds generate llms indexes and article Markdown automatically. Do not add a conflicting public/llms.txt placeholder.

The theme package owns standard routes, configuration defaults/types, i18n, effects and build integrations. Do not copy those implementations into this project or edit node_modules. Use src/site.config.ts, custom CSS and new custom pages for personal changes. Standard Home, Blog, Tags, About, Decoder, RSS and terminal paths are reserved; choose other paths for custom pages. Public configuration comes from @anglefeint/astro-theme/config.

Upgrade this integration starter with `npm run upgrade` (npm projects). It invokes the latest package's upgrade command, checks Node/Astro compatibility and project schema, backs up dependency files, updates dependencies and runs doctor. User source/configuration/media are not rewritten. A failed validation restores dependency files and attempts to reinstall the previous dependencies. Preserve the owner's package manager: the automatic updater currently refuses pnpm/yarn/bun lockfiles. Pre-0.27 projects need the documented fresh-starter migration; do not run destructive in-place conversion.

## Content and languages

- Create one article with `npm run new-post -- my-post --locales en` (use the requested locale). Without `--locales`, it creates skeletons for all enabled languages, not translations.
- Required article frontmatter: `title`, `description`, `pubDate`. Slugs use lowercase letters, numbers and hyphens. Matching translations use the same slug.
- Omitted locale settings inherit defaults. Disable unwanted languages with `meta.enabled: false`; keep the default locale enabled. `--locales` does not enable languages.
- There is no draft or future-date publication filter. Keep unfinished articles outside `src/content/blog/`.
- The default homepage prefix setting only changes the homepage; article routes remain `/<locale>/blog/<slug>/`.
- Add music the owner is permitted to use and preserve required attribution. The starter includes no demo recordings.

## Validate and finish

Use the package manager already chosen by the owner; README gives npm and pnpm commands. From the project root:

- `npm run dev` for local editing. Search requires a built preview.
- `npm run check:no-build` for a quick Astro type check.
- `npm run doctor` before delivery: it includes checks and a build. Then `npm run preview` and verify the changed pages. Do not repeat `check` and `build` after a successful `doctor` without a reason.
- Do not recreate generated adapters: this starter uses package-owned runtime modules.

For a custom page, available themes are `base`, `ai`, `cyber`, `hacker`, `matrix`; creation does not add a navigation item or translate its body. Preserve the four page atmospheres, accessibility, reduced motion and mobile usability when changing visuals.

Report what changed, what was verified and any remaining limitations. Local preview does not publish the site. Follow the owner's deployment instructions; this blog does not need the upstream theme's npm publishing or starter synchronization workflow.


## Fragments

Read `src/content/blog/en/starter-guide-5-fragments.md` (or its localized version). This optional feature and its popup comments default off. User Markdown belongs in `src/content/fragments/<locale>/`; preserve stable frontmatter IDs and all user files. Use `npx @anglefeint/astro-theme@latest new-fragment` for one default-language skeleton, or `--locales en,zh` for shared-ID translations. New starters also offer `npm run new-fragment`. Enable through existing `theme.fragments`; do not copy standard routes into this project. Comment mapping is independent of article comments. Rebuild/redeploy after changes.
