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

`npm create astro@latest -- --template voidtem/astro-theme-anglefeint#starter`

should upgrade with:

1. `npm update @anglefeint/astro-theme`
2. `npm install`
3. `npm run check`
4. `npm run build`

This keeps theme core upgrades package-driven through npm and avoids manual file synchronization.

## Validation Checklist

After every upgrade:

1. `npm install`
2. `npm run build`
3. Check routes:
- `/`
- `/en/`
- `/:lang/blog`
- `/:lang/blog/[slug]`
- `/robots.txt`
- `/sitemap-index.xml`

## Notes

- Review `CHANGELOG.md` before upgrading.
- For Astro major-version migrations, follow the official Astro guide first:
  - https://docs.astro.build/en/guides/upgrade-to/
