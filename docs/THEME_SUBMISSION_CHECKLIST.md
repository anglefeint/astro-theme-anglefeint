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

## Recommended

- Add type check support (`astro check`) and run once before submit
- Include preview screenshots for:
  - Home
  - Blog list
  - Blog detail
  - About (if enabled)
- Verify i18n routes:
  - `/`
  - `/en/` (redirect behavior)
  - `/:lang/blog`
  - `/:lang/blog/[slug]`
- Verify SEO output:
  - canonical
  - hreflang
  - sitemap
  - robots
- Confirm theme remains config-driven:
  - `src/config/site.ts`
  - `src/config/theme.ts`
  - `src/config/about.ts`
  - `src/config/social.ts`

## Project-Specific Risk Checks

- Blog post effects do not break content readability on low-end devices
- Left monitor playback:
  - opens only when ready
  - runs one sequence
  - collapses after playback
  - replay button works repeatedly
- About route behavior follows `ENABLE_ABOUT_PAGE`
