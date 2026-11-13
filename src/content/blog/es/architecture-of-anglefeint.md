---
title: 'Arquitectura de Anglefeint: por qué una composición de cuatro capas'
subtitle: 'ThemeFrame -> Shell -> Layout -> Page'
description: 'Explicación práctica de la arquitectura de Anglefeint y de cómo mejora el mantenimiento a largo plazo.'
pubDate: '2026-03-03'
heroImage: '../../../assets/blog/default-covers/ai-02.webp'
aiModel: 'anglefeint-core'
aiMode: 'analysis'
aiState: 'stable'
updatedDate: '2026-11-14'
---

Anglefeint combina cuatro responsabilidades:

- ThemeFrame: documento, SEO, navegación, pie y música compartidos.
- Shell: estilos y ambiente de cada página.
- Layout: disposición del texto, portadas y áreas auxiliares.
- Page: consulta de contenido y configuración, y composición.

No obliga a anidar cuatro componentes iguales en cada página. La estructura común aporta coherencia; cada página conserva sus datos e interacciones.

Rutas estándar, valores predeterminados e implementación pertenecen a `@anglefeint/astro-theme`. El starter conserva artículos, recursos, `src/site.config.ts`, páginas propias y ajustes de despliegue. Actualizar no exige copiar páginas estándar. La configuración tiene una entrada; artículos y Fragments permanecen en sus directorios.

Sigue leyendo: [Diseño visual por rutas](/es/blog/route-visual-system-design/) · [Referencia de configuración: sitio, navegación, redes y pie](/es/blog/config-site-chrome/)
