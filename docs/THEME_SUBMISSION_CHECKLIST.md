---
doc_id: submission_checklist
doc_role: submission-checklist
doc_purpose: Checklist used before submitting or resubmitting the theme.
doc_scope: [submission, review-checks, screenshots, seo]
update_triggers: [submission-change, seo-change, visual-change]
source_of_truth: true
depends_on: [README.md, docs/ARCHITECTURE.md, docs/VISUAL_SYSTEMS.md]
---

# Theme Submission Checklist

Use this before submitting to an Astro theme listing/review.

## Required

- Build passes: `npm run build`
- Repository includes license file (`LICENSE`)
- README has working setup commands
- Demo URL is public and stable
- Repository URL points to this theme
- No placeholder listing fields remain (e.g. `<YOUR_DEMO_URL>`)
- Theme screenshots meet portal constraints (combined max 5MB, 16:9 ratio, width >= 1280px)
- `PUBLIC_SITE_URL` is set to your real domain (no placeholder URL in canonical/hreflang)

## Recommended

- Add type check support (`astro check`) and run once before submit
- Include preview screenshots for:
  - Home
  - Blog list
  - Blog detail
  - About (if enabled)
- Verify i18n routes:
  - `/` (redirect behavior when `/<default-locale>/` is canonical)
  - `/<default-locale>/`
  - `/:lang/blog`
  - `/:lang/blog/[slug]`
- Verify SEO output:
  - canonical
  - hreflang
  - sitemap
  - robots
- Confirm theme remains config-driven:
  - `src/site.config.ts` (single user-facing entry)
  - `src/config/site.ts` (adapter)
  - `src/config/theme.ts` (adapter)
  - `src/config/about.ts` (adapter)
  - `src/config/social.ts` (adapter)

## Project-Specific Risk Checks

- For the pending share-image feature, verify generated PNGs and OG/Twitter/JSON-LD URLs, explicit local/public overrides and the disabled fallback in the installed starter. Do not advertise this as available in 0.4.0; wait for coordinated package/starter delivery.

- Blog post effects do not break content readability on low-end devices
- Left monitor playback:
  - opens only when ready
  - runs one sequence
  - collapses after playback
  - replay button works repeatedly
- About route behavior follows `theme.enableAboutPage`
- Verify search on build + preview, including current-language results, empty/error feedback and backdrop/Escape dismissal; dev intentionally shows an indexing notice.
- Verify article contents beside the body on wide screens and before it on narrow screens, including no-heading and per-article disabled cases.
- Verify tag directory/archive links, empty locales and disabled routes; tag pages keep canonical metadata but intentionally omit hreflang links.
- Verify code copy success/failure in an allowed Clipboard API context and that image preview restores reading position and preserves linked-image navigation.
- Verify wide-screen reading notifications stay outside the article border and do not overlap the TOC or return-to-top control. Existing browser coverage is indexed in `docs/ARCHITECTURE.md`.
