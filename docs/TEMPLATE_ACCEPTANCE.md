---
doc_id: template_acceptance
doc_role: runbook
doc_purpose: Reproducible consumer command, configuration and browser acceptance for the public starter.
doc_scope: [validation, commands, starter, starter-sync]
update_triggers: [command-change, script-change, config-change, workflow-change]
source_of_truth: true
audience: [maintainer, agent]
depends_on:
  [
    docs/AI_WORKFLOW.md,
    docs/MAINTAINER_WORKFLOW.md,
    scripts/check-template.mjs,
    playwright.config.mjs,
  ]
---

# Template acceptance

Run from the maintainer checkout, not from a user's starter. These tools do not publish, push or alter the real site's configuration. They need network access and installed maintainer dependencies. A passing run covers the recorded scenarios and versions, not every browser, hosting provider or possible user configuration.

## Three complementary checks

| Command                                      | Source under test                                      | Purpose                                                                                                                                                         |
| -------------------------------------------- | ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run e2e`                                | Current local main build                               | 28 Chromium tests: desktop/mobile navigation, SEO, search, tags, TOC, clipboard, image preview, About interactions, effects and reduced motion                  |
| `npm run check:installed -- --build --audit` | Locally packed theme and current managed starter files | Independent package installation; CLI/config/adapter checks; en/zh × homepage prefix matrix; feature switches; security audit                                   |
| `npm run check:template`                     | Public GitHub `#starter` and npm package               | Fresh consumer installation, all starter script entries, documented command scenarios, configuration changes, dev/preview HTTP checks and Chromium interactions |

The public-template check deliberately does not overlay local changes. Use it after starter delivery; use `check:installed` before delivery. Do not interpret a passing public-template run as verification of unpublished runtime changes.

## Local execution

```bash
npm install
npm run e2e:install
npm run e2e
npm run check:installed -- --build --audit
npm run check:template
npm run check:template -- --pnpm
```

The pnpm variant runs pnpm 10 through `npm exec --package=pnpm@10`; no global pnpm installation is required. Both variants create a new project with the README's npm template command, then use their chosen package manager. The `dev` and `preview` servers use ports 4381 (npm) and 4382 (pnpm); do not run two instances of the same variant simultaneously. The existing E2E suite owns port 4321 and refuses to reuse an unrelated server. It does not use the normal development server on 4323.

The environment-variable CLI example is exercised through the child process environment, which also works on Windows. The literal `ANGLEFEINT_LOCALES=... command` README example requires a POSIX shell; PowerShell users can use `--locales`. Page theme examples are alternatives: duplicate page creation is tested as an expected rejection and must preserve the original file.

## Consumer command coverage

- Template creation and dependency installation, including a fresh npm package rather than a workspace link.
- `new-post` help, configured languages, explicit languages, environment languages and their precedence; existing content is preserved.
- `new-page` help, all five themes and a nested route; duplicate files, invalid slugs and invalid themes are rejected.
- Installed CLI entry points through npm exec (the underlying execution path used by npx).
- Deliberately drifted adapter: both `check:adapters` and `doctor` must fail, then `sync-adapters` must restore it.
- Compatible package update and reinstall preserve site configuration and article content. This tests the current starter's version range, not migration from an arbitrary historical starter.
- Each consumer `package.json` script is executed; a new untested script makes coverage fail. This includes `check:no-build`, `check:about-runtime`, `check`, `doctor`, `build`, `astro`, `dev` and `preview`.
- `check:workspace-link` intentionally skips in an installed consumer; the report marks this as not applicable, not a workspace-link validation.
- Security audit fails the run on reported vulnerabilities or audit errors.

The command list is maintained explicitly rather than blindly executing prose scraped from README. Review changes to the five READMEs and tutorials against this list; a script-coverage assertion alone cannot prove that every documented command variant is covered.

## Configuration and browser coverage

The temporary project is first tested with defaults. Search must return current-language results at desktop and mobile widths; article TOC and copy controls must render, and music must be absent. The local main E2E suite separately exercises copying, image-preview dismissal, search retry/backdrop handling, tag navigation and other interactions.

Next, the consumer test changes site title/author/URL, homepage introduction, enabled languages and a language label, home/article page sizes, About, search, tags, TOC, social images, Red Queen and music settings. It asserts a representative set of their outputs: two menu languages, custom label/hero, one home article, paginated blog output, omitted About/disabled-language/tag/search routes, absent article TOC and `.env` domain in generated metadata/feed/sitemap. The installed build matrix provides additional disabled social-image and custom-image checks.

Music uses a generated silent WAV in the temporary project. Chromium verifies no audio request before Play, real playback status after Play, pause and mobile collapse/expand. This does not test every audio format or remote audio provider. No sample music is added to the published template.

Giscus account setup, real comment submission, platform deployment and human assessment of visual attractiveness remain separate manual checks. Chromium is the only browser currently covered; passing it is not evidence for Safari or Firefox. No test changes signature effects to make assertions pass.

## Evidence and cleanup

`check:template` writes per-command logs, `report.json`, screenshots and a failure trace to `acceptance-results/template-<manager>-<timestamp>/`. This directory is separate from Playwright's `test-results/`, which Playwright clears at startup. Reports include actual Node/package versions, executed scripts, expected rejections, HTTP routes and overall success.

Successful temporary projects are removed after test servers stop. Failed projects are retained for diagnosis, with the path printed and recorded; remove only that exact verified temporary directory after investigating. Reports remain in the ignored evidence directory. `e2e` retains traces and screenshots on failure, even without retries.

## GitHub Linux runner

`.github/workflows/template-acceptance.yml` provides a **manual** `workflow_dispatch` workflow. Once committed to GitHub's default branch, use Actions → Template acceptance → Run workflow. It has no push/deployment trigger and only read access to repository contents.

The matrix uses Ubuntu with Node 22/npm and Node 24/pnpm 10. It installs Chromium and system libraries, runs public-template acceptance in both jobs, runs main E2E in the npm job and uploads evidence for 14 days, including on failure. A local success does not establish that the Linux workflow has run; record its actual run URL and conclusions separately.
