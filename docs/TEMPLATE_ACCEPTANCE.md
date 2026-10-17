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

## Complementary checks

`tests/e2e/home-status.spec.mjs` checks independent pirate/trace hover and selection, select-all, unrelated selections, trace-only cursor activation, unchanged reveal geometry and compact desktop/mobile bottom spacing. Touch coverage uses the browser Selection API with reduced motion; it does not automate native long-press handles. These are local source checks, not evidence that npm or the public starter already contains the changes.

The Home lifecycle browser suite also checks that hover/focus and text clicks do not initialize the terminal, long messages remain scrollable/selectable, keyhole insertion can be cancelled, one paused instance is reused and idle/pagehide releases its canvas. It exercises the projected door hit area, retained WebGL programs, drag/click separation, right-click return while facing forward, About close-button keyboard access and Escape. Unit coverage in `tests/passage-timeline.unit.test.mjs` checks fixed views, camera orientation/return rays, reverse sampling and compact geometry bounds. `tests/home-transmission.test.mjs` executes the message adapter with configuration fixtures to verify local → English → default text without changing UI translation resolution. These local tests do not establish delivered npm/starter behavior until installed/remote acceptance runs against that delivery.

`tests/e2e/home-effects-lifecycle.spec.mjs` instruments browser frame ownership and mirror texture allocation to check repeated visibility events, cached pagehide/pageshow, live reduced-motion changes and repair cleanup. It complements cinematic visual regression, rather than proving the absence of all possible memory leaks. Oracle/passage and music scene exploratory evidence belongs in the matching release ledger; the existing public-template check does not claim exhaustive coverage of every new animation.

Mathematics coverage combines unit tests for parsing/escaping/MDX/errors, nine-language Chromium article checks for MathML/local CSS and mobile scrolling, and the independent installed build matrix with actual `.md`/`.mdx` formulas and a disabled-math build. Disabling restores normal MDX expressions, so the disabled MDX fixture intentionally uses brace-free prose. The matrix checks formula output/exclusions and the absence of the stylesheet link when disabled; it does not claim to remove unused assets from the build directory. Search intentionally excludes entire formula subtrees while keeping surrounding prose. Public-template delivery checks exercise the published processor through the formula examples in the nine bundled guides.

| Command                                      | Source under test                                      | Purpose                                                                                                                                                                                                    |
| -------------------------------------------- | ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run e2e`                                | Current local main build                               | Chromium regression tests: desktop/mobile navigation, SEO, search, tags, TOC, clipboard, image preview, About interactions, footer credits, effects, reduced motion and nine-language reading-panel widths |
| `npm run check:installed -- --build --audit` | Locally packed theme and current managed starter files | Independent package installation; CLI/config/adapter checks; en/zh/pt-br/de/ru/zh-hant × homepage prefix matrix; feature switches; security audit                                                          |
| `npm run check:template`                     | Public GitHub `#starter` and npm package               | Fresh consumer installation, all starter script entries, documented command scenarios, configuration changes, dev/preview HTTP checks and Chromium interactions                                            |

The public-template check deliberately does not overlay local changes. Use it after starter delivery; use `check:installed` before delivery. Do not interpret a passing public-template run as verification of unpublished runtime changes.

Installed builds check English shared terminal text, a Chinese override and an unbundled French locale inheriting English while homepage headings remain escaped. Public-template customization checks English/Chinese terminal text in generated output and English in the browser. Heading checks accept presentation classes on h1 rather than depending on a bare opening tag.

Both installed-starter and public-template acceptance run `scripts/check-starter-guidance.mjs` against the consumer files: shared AGENTS instructions, Claude's import, Cursor's always-applied rule, available command names, guide links and README metadata relationships. The remote check also records this result. These checks establish valid delivered entry files and executable workflows; they do not run authenticated sessions in the three AI products or guarantee a model's decisions.

Entry formats follow the official [Codex AGENTS.md instructions](https://developers.openai.com/codex/guides/agents-md/), [Cursor rules](https://cursor.com/docs/rules) and [Claude Code project memory/imports](https://code.claude.com/docs/en/memory). Keep tool adapters thin and retain the shared consumer guide as the instruction source.

[Reading-width regression](../tests/e2e/reading-width.spec.mjs) checks Home and a representative article in all nine built-in languages at 320/390/720/721/740/768/800/820/900/1440px with reduced motion. It allows at most 1px of rounding tolerance for page overflow and panel bounds, and asserts a 720px content width at 1440px. This is part of local main E2E, not the public-template matrix; exact test counts and execution results belong in the [release ledger](releases/README.md).

Each public-template run gives the downloader a fresh `XDG_CACHE_HOME` inside its temporary directory. This prevents create-astro's archive downloader from silently substituting an older cached starter after a network failure. The normal public template command remains unchanged; failed downloads must be diagnosed and retried rather than accepted as current-template evidence.

`npm run check:upgrade` adds a targeted package-only regression check against frozen real 0.8.3 and 0.8.4 starter commits. It installs the locally packed theme without overlaying current routes, audits dependencies, creates partial/full translation fixtures, and runs each old project's checks/build. It asserts canonical, hreflang, OG and menu behavior and hashes source files before/after installation and build to detect rewrites. Evidence is stored in ignored `acceptance-results/upgrade-*`; successful temporary projects are removed. This is a bounded compatibility test, not a guarantee for every historical or customized starter. The referenced commits must exist in local Git history.

The installed-starter matrix also pairs configured social links with the `always` mode and empty links with `never`: all twelve built-ins, one local PNG override and a text link are checked in both shared menus across nine languages and the available shells. Resolver unit tests cover paths, base prefixes and invalid input. Separate release browser evidence records layout, keyboard navigation and image loading; HTML assertions alone do not establish those visual properties.

## Local execution

### GA4 coverage

`npm run test` includes `tests/analytics.unit.test.mjs`: Measurement ID validation, localhost/loopback exclusion, duplicate initialization prevention and preservation of queued consent commands. It executes the actual loader in a simulated browser environment; it does not contact Google.

`npm run check:installed -- --build --audit` checks generated GA4 markup in every built-in language while varying six default locales. The `always` prefix fixtures enable GA4 and About; the `never` fixtures disable both. Home, blog and article HTML are checked for exactly one configured loader or none; About HTML is checked in the enabled fixtures. These switches are paired, not independently permuted.

The regular Chromium E2E suite and public-template check do not enable GA4. The separate production/dev/Chromium fixture recorded for [0.10.0](releases/0.10.0.md) is local release evidence, not a committed reusable command. None of these checks proves that events reached a real GA4 property; confirm that separately on the deployed site using the owner's Measurement ID and Realtime report.

### Music and general commands

The music fixture also checks compact initial HTML in all four scenes with JavaScript disabled, then exercises omitted/true/false `initiallyCollapsed` props at desktop and mobile sizes with opposing stored presentation. Explicit expanded initialization survives narrowing and simulated BFCache restoration; manual toggling remains available. Preview requests use the port returned by Astro, avoiding an unrelated service when the preferred port is occupied. These checks do not modify site defaults, require a new configuration field or establish delivery of unpublished source.

`node scripts/check-music-browser.mjs` builds an isolated Astro fixture with the real MusicDeck component and generated test audio, serves the audio as HTTP 200 without Range support, then checks Blob playback and real pointer seeking while playing/paused, dragging, compact seeking, session resume, manual pause, reload/browser-policy fallback, five-language blocked messages, mobile storage denial and missing sources in Chromium. It does not alter demo configuration or disable autoplay policy. Back navigation is exercised and BFCache persisted events are additionally simulated; this is not a Safari/Firefox or subjective listening check. This fixture verifies independence from HTTP Range; it does not validate external-host CORS, every media format or every browser. The same fixture loads all four real shell styles and verifies distinct palettes, live CSS-token inheritance, Hacker neutral borders/monospace/compact corners, and mobile expansion without horizontal overflow. Results are saved in ignored `acceptance-results/music-browser.json`; successful fixtures are removed and failed fixtures retained for diagnosis.

```bash
npm install
npm run e2e:install
npm run e2e
npm run check:installed -- --build --audit
npm run check:template
npm run check:template -- --pnpm
```

The pnpm variant runs pnpm 10 through `npm exec --package=pnpm@10`; no global pnpm installation is required. Both variants create a new project with the README's npm template command, then use their chosen package manager. The `dev` and `preview` servers use ports 4381 (npm) and 4382 (pnpm); do not run two instances of the same variant simultaneously. The existing E2E suite owns port 4321 and refuses to reuse an unrelated server. Plain `npm run dev` also defaults to 4321; stop a development server using that port before E2E, or start development on another port with `npm run dev -- --port 4323`.

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
- Security audit blocks all findings and audit errors. The former static-cache exception has been retired; see the historical review in [Package Release](PACKAGE_RELEASE.md#temporary-static-cache-advisory-review-2026-10-03).

The command list is maintained explicitly rather than blindly executing prose scraped from README. Review changes to the nine READMEs and tutorials against this list; a script-coverage assertion alone cannot prove that every documented command variant is covered.

## Configuration and browser coverage

About newline browser checks measure the actual separation of lines and blank lines in paragraphs/signatures at 1440/390/320px, including long-text wrapping and unaffected headings/sidebar whitespace. The independent installed build matrix supplies multiline About configuration and verifies that its line feeds survive HTML generation.

The footer browser regression checks all nine built-in languages across Home, Blog, About and article pages at 1440/721/390/320px: localized credits, separate copyright/credit groups, no empty tagline row and bounded layout. The installed-package matrix checks custom tagline preservation with credits both enabled and disabled; assertions use credit link destinations rather than English wording so translations remain valid.

Article SEO checks parse built HTML for Chinese-only, Chinese/Japanese, English/Chinese and five-language fixtures. They verify self-canonical URLs, exact reciprocal hreflang sets, conditional `x-default`, OG alternate locales and language-menu fallbacks. The installed matrix exercises English, Chinese, Brazilian Portuguese, German, Russian and Traditional Chinese defaults with both homepage prefix modes; public-template acceptance checks the delivered default-English starter. `tests/head-locales.unit.test.mjs` additionally covers an empty explicit map, omitted-map compatibility and exclusion of unenabled locale keys.

The temporary project is first tested with defaults. Search must return current-language results at desktop and mobile widths; article TOC and copy controls must render, and music must be absent. The local main E2E suite separately exercises copying, image-preview dismissal, search retry/backdrop handling, tag navigation and other interactions.

Next, the consumer test changes site title/author/URL, homepage introduction, enabled languages and a language label, home/article page sizes, About, search, tags, TOC, social images, Red Queen and music settings. It asserts a representative set of their outputs: two menu languages, custom label/hero, one home article, paginated blog output, omitted About/disabled-language/tag/search routes, absent article TOC and `.env` domain in generated metadata/feed/sitemap. The installed build matrix provides additional disabled social-image and custom-image checks.

Music uses a generated silent WAV in the temporary project. Chromium verifies no audio request before Play, real playback status after Play, pause and mobile collapse/expand. This does not test every audio format or remote audio provider. No sample music is added to the published template.

Giscus account setup, real comment submission, platform deployment and human assessment of visual attractiveness remain separate manual checks. Chromium is the only browser currently covered; passing it is not evidence for Safari or Firefox. No test changes signature effects to make assertions pass.

## Evidence and cleanup

Creation uses `--no-ai` to preserve the template's shared `AGENTS.md` and tool entries. Current create-astro otherwise replaces the root guide with generic Astro instructions; README and tutorial creation commands use the same flag. This skips the creator's generated instructions, while retaining the template's AI guidance.

Social relation coverage: unit checks exercise omitted/blank values, opt-in `me`, multiple tokens, case/whitespace normalization, duplicates, conflicting `opener` and non-string errors. The independent installed-starter build matrix checks static header/footer attributes with built-in, custom-image and text links, opted-in and non-opted-in Mastodon links, and empty social lists across default-language/routing variants. These checks do not claim a real Mastodon account verification or test arbitrary hosting redirects.

`check:template` writes per-command logs, `report.json`, screenshots and a failure trace to `acceptance-results/template-<manager>-<timestamp>/`. This directory is separate from Playwright's `test-results/`, which Playwright clears at startup. Reports include actual Node/package versions, executed scripts, expected rejections, HTTP routes and overall success.

Successful temporary projects are removed after test servers stop. Failed projects are retained for diagnosis, with the path printed and recorded; remove only that exact verified temporary directory after investigating. Reports remain in the ignored evidence directory. `e2e` retains traces and screenshots on failure, even without retries.

## GitHub Linux runner

`.github/workflows/template-acceptance.yml` provides a **manual** `workflow_dispatch` workflow. Once committed to GitHub's default branch, use Actions → Template acceptance → Run workflow. It has no push/deployment trigger and only read access to repository contents.

The matrix uses Ubuntu with Node 22/npm and Node 24/pnpm 10. It installs Chromium and system libraries, runs public-template acceptance in both jobs, runs main E2E in the npm job and uploads evidence for 14 days, including on failure. A local success does not establish that the Linux workflow has run; record its actual run URL and conclusions separately.

## Local working-tree acceptance: Decoder Lab and shared numeric reveal (2026-10-18, unreleased)

Local checks passed 121 unit tests and a 199-page build with nine About payloads and nine Decoder pages. Forty Chromium cases across `decoder-page.spec.mjs`, `hacker-decoder.spec.mjs`, `cinematic-effects.spec.mjs`, `about-modules.spec.mjs` , `terminal-shell.spec.mjs` and `decoder-edge-cases.spec.mjs` cover localized static canonical/hreflang, mobile layouts, text branching/export, byte-safe crypto, exact amount updates, EVM/HyperEVM/TRON calls, Bitcoin address/script output, no external data requests, lazy crypto loading, animation cancellation and the shared About window controls. Existing text, clipboard, reduced-motion and safe-output regressions remain covered. Node tests verify EIP-55, TRON checksums, Bitcoin legacy/witness scripts, ABI padding/length/selector rejection, uint256 precision, bounded history, the independent page flag and future-locale fallback.

The route `src/pages/[lang]/decoder.astro` is newly starter-owned and listed in the manifest; shared components/scripts/styles/i18n remain package-owned. The quick form now comes from a shared static template, and its runtime validator checks that template. Decoder uses keyboard-accessible task tabs, equal desktop editor columns across the page, and the shared floating player with a dedicated lab skin. Geometry assertions check the left gutter, equal pane widths, viewport-centered split and original fixed bottom-left player position. Narrow layouts stack the editors. No npm publication, starter delivery or remote installed-template acceptance is claimed here. Bundle measurements and screenshots are local evidence under ignored `acceptance-results/`; final release validation remains separate.

About modularity acceptance adds standalone terminal tests for separate instances, caller-supplied geometry, bounded input, reduced motion, hidden-page pause, abort/dispose and unavailable Canvas. Browser coverage confirms Decoder reveal without terminal Canvas support and three repeated pagehide/bfcache restoration cycles, including progress cancellation on tool close. Oracle disposal also releases the passage and restores page interaction.

All Scripts browser acceptance covers the real trigger, localized article navigation, equal card heights across rows, three-line title clamping, full-title native tooltips, exact clipboard copying and wheel scrolling inside a height-constrained window.

Virtual-terminal acceptance covers JSON paths/quoting, cwd and directory commands, cat/vi reading, path completion, static-body lazy loading/cache, read-only views in the original Canvas, :q/Escape, narrow-screen layout and cancellation of delayed reads on disposal. No shell process or external service is involved.

Decoder edge-case coverage exercises each text format through valid, malformed and recovery flows, explicit Base64URL, UTF-8/binary rejection, upper-bound output, HTML inert text, surrogate pairs and JWT object validation. Address examples run for every ecosystem and Bitcoin network; checksum/network errors, uppercase prefixes, malformed calldata and precision recovery are checked. The page status is visible in the task header and carries explicit error/success state.

Live development-server acceptance uses `PLAYWRIGHT_BASE_URL=http://127.0.0.1:4351` with the shared Playwright configuration to attach without starting preview. Eleven edge-case cases are included in both dev and built-preview suites, including correct fixtures, failed lazy-module imports and reload recovery in English/Chinese. An expired Vite optimized-dependency cache was observed returning 504 on dev while built preview passed; restarting the dev server restored module loading. A final live check must follow build/check work before reporting the running service healthy.

Decoder SEO/crossfade acceptance: `npm run check` passes 121 unit tests, Astro reports zero errors/warnings, and the build validates nine About routes. The related browser suite passes 40 cases, including static HTML SEO with JavaScript disabled across nine locales, localized footer links, WebApplication metadata, simultaneous partial opacity of result/numeric layers, and canvas/wrapper cleanup. The total animation lasts 1.5–3 seconds, including its shared final 1.2 second crossfade.

Final documentation-workflow validation on 2026-10-18 also runs 18 live-dev cases (edge cases plus the full Decoder page suite) against port 4351 after restarting the service following check/build. These verify dynamic range timing, the included 1200ms crossfade, static SEO, and host-specific Canvas colors/opacity. The Lab uses result currentColor, digit alpha 1 and no trail; About retains its amber/pale-gold treatment. Player background alpha is 35% only in the Lab. Evidence: `acceptance-results/decoder-final-check.log`, `decoder-final-lint.log`, `decoder-final-browser.log`, `decoder-final-live.log` and `decoder-final-doc-suggestions.log`. No publication or remote delivery was performed.

The 0.18.0 published-package and public-starter delivery, corrected installed export/declaration contracts, full 107-case browser coverage with the corrected smoke rerun, music fixture update and remote Decoder workflows are recorded in [the release note](releases/0.18.0.md). The earlier working-tree evidence above remains historical; it is not a production hosting verification.
