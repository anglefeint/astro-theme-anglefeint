---
title: 'Anglefeint Starter Guide 3: Comments, About, and Toggles'
subtitle: 'Giscus, About, pagination y efectos del post'
description: 'Las opciones avanzadas que hoy sí están activas son Giscus comments, About content, Red Queen effect, home counts y pagination.'
pubDate: '2026-03-07'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

Esta guía cubre:

- `theme.comments.*`
- `i18n.locales.<code>.about`
- `theme.effects.enableRedQueen`
- `theme.blogPageSize`
- `theme.homeLatestCount`
- `theme.pagination.*`

En Giscus se consumen realmente `enabled`, `repo`, `repoId`, `category`, `categoryId`, `mapping` y los demás campos documentados. `mapping: 'specific'` requiere `term` y `mapping: 'number'` requiere un `number` entero positivo.

El contenido y los textos runtime de About salen de `i18n.locales.<code>.about`.

- [Starter Guide 1](/es/blog/starter-guide-1-configure-your-site/)
- [Starter Guide 2](/es/blog/starter-guide-2-languages-and-routing/)
