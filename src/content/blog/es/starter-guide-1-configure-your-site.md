---
title: 'Anglefeint Starter Guide 1: Site Configuration'
subtitle: 'Qué cambiar primero después de crear el starter'
description: 'Las primeras opciones reales para usuarios son la identidad del sitio, social links, el toggle de About y el reemplazo del contenido inicial.'
pubDate: '2026-03-07'
heroImage: '../../../assets/blog/default-covers/cyber-02.webp'
---

Si creaste tu proyecto con el starter de Anglefeint, el primer punto de entrada es `src/site.config.ts`.

Campos que conviene revisar primero:

- `site.title`
- `site.description`
- `site.url`
- `site.author`
- `site.tagline`
- `social.links`
- `theme.enableAboutPage`

`site.description` es la descripción por defecto del sitio; la home cae a ese valor cuando el locale actual no define `messages.siteDescription`.

Puedes crear un post nuevo con:

```bash
npm run new-post -- your-first-post
```

- [Starter Guide 2](/es/blog/starter-guide-2-languages-and-routing/)
- [Starter Guide 3](/es/blog/starter-guide-3-comments-about-and-theme-toggles/)
