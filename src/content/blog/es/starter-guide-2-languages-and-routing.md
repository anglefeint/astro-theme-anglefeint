---
title: 'Anglefeint Starter Guide 2: Languages and Routing'
subtitle: 'default locale, fallback y reglas de URL'
description: 'El registro único de locales controla routing, labels, fallback, messages, hero y About content.'
pubDate: '2026-03-07'
heroImage: '../../../assets/blog/default-covers/cyber-03.webp'
---

La configuración multilenguaje vive en `src/site.config.ts` dentro de `i18n`.

Campos clave:

- `i18n.defaultLocale`
- `i18n.routing.defaultLocalePrefix`
- `i18n.locales`
- `meta.label`
- `meta.hreflang`
- `meta.ogLocale`
- `meta.enabled`
- `meta.fallback`
- `messages`
- `site.hero`
- `about`

Si `defaultLocalePrefix` es `'always'`, la home del locale por defecto es `/<default-locale>/`. Si es `'never'`, `/` pasa a ser la home canonical.

Los posts siguen viviendo en `src/content/blog/<locale>/`.

- [Starter Guide 1](/es/blog/starter-guide-1-configure-your-site/)
- [Starter Guide 3](/es/blog/starter-guide-3-comments-about-and-theme-toggles/)
