---
title: 'Diseño visual por rutas'
subtitle: 'Una atmósfera para cada etapa de lectura'
description: 'Cómo Anglefeint separa atmósferas visuales por ruta sin perder foco en el contenido.'
pubDate: '2026-03-03'
updatedDate: '2026-09-19'
heroImage: '../../../assets/blog/default-covers/cyber-02.webp'
aiModel: 'anglefeint-core'
aiMode: 'analysis'
aiState: 'stable'
aiLatencyMs: 171
aiConfidence: 0.95
wordCount: 700
tokenCount: 1080
---

Muchos temas aplican el mismo estilo a todas las páginas. Anglefeint usa un sistema visual por ruta.

- `/<locale>/` : atmósfera Matrix para la primera impresión
- `/<locale>/blog/` : ambiente cyber para explorar archivos
- `/<locale>/blog/<slug>/` : interfaz AI para lectura enfocada
- `/<locale>/about/` : estilo hacker para perfil

Con el valor predeterminado `i18n.routing.defaultLocalePrefix: 'always'`, `/` redirige al inicio del idioma predeterminado (inicialmente `/en/`). Con `'never'`, solo ese inicio pasa a `/`; el blog y About conservan el prefijo de idioma. About requiere `theme.enableAboutPage: true`. Si las etiquetas están activas, `/<locale>/tags/` y sus páginas de resultados comparten la atmósfera Cyber.

La regla central es: el fondo debe apoyar la lectura.

Cada ruta cumple un objetivo distinto: identidad, exploración, lectura profunda y contexto del autor.

Este enfoque mantiene personalidad visual fuerte sin romper la jerarquía de contenido.
