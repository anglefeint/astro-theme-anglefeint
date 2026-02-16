---
name: document-project-readme
description: Analyzes project code and updates README with tech stack, architecture, and per-page documentation (type, style, CSS effects, JS effects). Use when documenting a web project, updating README, or performing page-by-page visual/technical analysis.
---

# Document Project README

Instructs the agent to analyze project code and write or update the README with structured sections: tech choices, architecture, and per-page breakdown (type, style, CSS effects, JS effects).

## Workflow

1. **Read project code** — `package.json`, config files, layouts, page files, global styles.
2. **Update README** — Add or expand sections using the template below.
3. **Verify** — Ensure all referenced files and effects are accurate.

## README Template

Use this structure when documenting. Adapt section names to match the project's actual pages (home, blog list, blog detail, about, etc.).

```markdown
# [Project Name]

[Brief intro]

## Tech Stack

- Framework: [name + version]
- Integrations: [list]
- Styling: [e.g., vanilla CSS, Tailwind, scoped styles]
- Content: [e.g., Content Collections, CMS]
- Output: [static, SSR, hybrid]

## Architecture

[1–2 paragraphs: content pipeline, routing, key patterns]

## Routes

- [file] — [route] — [one-line description]

## [Page Name] (`/[route]`)

**Type:** [e.g., landing, list, detail, static]
**Style:** [visual theme, e.g., Matrix rain, Blade Runner cyberpunk]
**CSS effects:** [bullet list: gradients, scanlines, animations, etc.]
**JS effects:** [bullet list: canvas, event handlers, dynamic behavior]
```

## Analysis Checklist

When analyzing each page:

| Section | What to extract |
|--------|------------------|
| **Tech** | `package.json` dependencies, `astro.config` / framework config |
| **Architecture** | File layout, content collections, data flow, output mode |
| **Page type** | Landing, list (paginated?), detail (dynamic slug?), static |
| **Style** | Color palette, typography, body/page classes, visual theme |
| **CSS effects** | Gradients, overlays, keyframes, pseudo-elements, backdrop-filter |
| **JS effects** | Canvas animations, scroll handlers, mouse tracking, modals, event listeners |

## Key File Locations (Astro-style projects)

- `package.json` — dependencies, scripts
- `astro.config.mjs` / `vite.config` — site URL, integrations
- `src/content.config.ts` — content schema
- `src/styles/global.css` — shared styles, page-specific blocks (e.g. `body.br-page`)
- `src/pages/index.astro` — home
- `src/pages/blog/[...page].astro` — blog list (often paginated)
- `src/pages/blog/[...slug].astro` — blog detail (wraps layout)
- `src/layouts/BlogPost.astro` — post detail layout (often contains mesh, hero, modals)
- Inline `<style>` and `<script>` in each page/layout — page-specific effects

## Example Output (from anglefeint-site)

**Home (`/`)** — Type: landing. Style: Matrix green-on-black. CSS: scanlines (`::before`), radial highlight (`::after` with `--matrix-mx/my`), main panel glass. JS: canvas falling-char rain (`requestAnimationFrame`), mouse→CSS vars for spotlight, `prefers-reduced-motion` disables canvas.

**Blog list (`/blog`)** — Type: paginated list (9 per page). Style: Blade Runner / cyberpunk. CSS: rain drops (4 types), scanlines, spotlight sweep, haze, dust, vignette, card hover glow, title glitch, image scan sweep. JS: none (CSS-only animations).

**Blog detail (`/blog/[slug]`)** — Type: article. Style: AI terminal mesh. CSS: SVG node network (58 points), hex grid, noise, glow, read-progress bar, back-to-top, paragraph reveal. JS: read progress + toast at 30/60/90%, hero canvas (edge detect → pixelate → reveal → glitch), Red Queen monitor (ImageDecoder playlist), mouse-glow, Regenerate button scan reset.
