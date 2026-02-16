# Theme Submission Checklist

Use this before submitting to an Astro theme listing/review.

## Required

- Build passes: `npm run build`
- Repository includes license file (`LICENSE`)
- README has working setup commands
- Demo URL is public and stable
- Repository URL points to this theme
- No placeholder listing fields remain (e.g. `<YOUR_DEMO_URL>`)

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
