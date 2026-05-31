---
doc_id: upgrading
doc_role: ops-guide
doc_purpose: Upgrade procedures for starter users and template-based projects.
doc_scope: [upgrade, release, package]
update_triggers: [release-change, package-change, command-change]
source_of_truth: true
depends_on: [docs/PACKAGING_WORKFLOW.md, docs/PACKAGE_RELEASE.md]
---

# Upgrading Anglefeint

This guide explains the recommended upgrade path for projects created from the starter branch.

## Official Path

Projects created from:

`npm create astro@latest -- --template anglefeint/astro-theme-anglefeint#starter`

should upgrade with:

1. `npm update @anglefeint/astro-theme`
2. `npm install`
3. `npm run doctor`
4. If `doctor` reports adapter drift: `npm run sync-adapters`
5. `npm run check`
6. `npm run build`

This keeps theme core upgrades package-driven through npm and avoids manual file synchronization.

## Scaffold Command Upgrade

Projects created from older starter versions may still route scaffold commands through local wrapper files:

```txt
scripts/new-post.mjs
scripts/new-page.mjs
```

Those wrappers are no longer the recommended integration point because local project files do not update when the npm package updates. Use package-owned bins instead:

```bash
npm install @anglefeint/astro-theme@latest
npm pkg set scripts.new-post="anglefeint-new-post"
npm pkg set scripts.new-page="anglefeint-new-page"
npm install
npm run new-post -- --help
npm run new-page -- --help
```

After this migration, users can keep the same daily commands:

```bash
npm run new-post -- my-post
npm run new-page -- projects --theme matrix
```

The direct package commands also remain available:

```bash
npx anglefeint-new-post my-post
npx anglefeint-new-page projects --theme matrix
```

## Validation Checklist

After every upgrade:

1. `npm install`
2. `npm run doctor`
3. `npm run build`
4. Check routes:

- `/`
- `/<default-locale>/`
- `/:lang/blog`
- `/:lang/blog/[slug]`
- `/robots.txt`
- `/sitemap-index.xml`

## Notes

- Review `CHANGELOG.md` before upgrading.
- For Astro major-version migrations, follow the official Astro guide first:
  - https://docs.astro.build/en/guides/upgrade-to/
- `consts` has been removed. If your code imported from `src/consts` or `@anglefeint/astro-theme/consts`,
  migrate to `src/config/site.ts` fields (`SITE_TITLE`, `SITE_DESCRIPTION`, `SITE_URL`, `SITE_AUTHOR`, `SITE_TAGLINE`, `SITE_HERO_BY_LOCALE`).
