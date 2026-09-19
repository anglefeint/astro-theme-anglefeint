---
title: 'Modelo de actualización: iniciar con starter y actualizar con npm'
subtitle: 'Ruta única para operar el tema'
description: 'Flujo recomendado para iniciar y actualizar proyectos con Anglefeint.'
pubDate: '2026-03-03'
updatedDate: '2026-09-19'
heroImage: '../../../assets/blog/default-covers/hacker-01.webp'
aiModel: 'anglefeint-core'
aiMode: 'analysis'
aiState: 'stable'
aiLatencyMs: 165
aiConfidence: 0.97
wordCount: 690
tokenCount: 1040
---

Un problema típico en temas es que iniciar es fácil pero actualizar es costoso. Anglefeint define una ruta clara.

Inicialización:

```bash
npm create astro@latest -- --template anglefeint/astro-theme-anglefeint#starter
```

Actualizaciones compatibles solo del paquete:

`npm update` actualiza el paquete del tema, no la configuración local, las rutas, los adaptadores ni las integraciones de Astro. Si las notas de versión requieren cambios de estructura, crea el starter más reciente en un directorio nuevo y migra tus artículos y ajustes personales. No sobrescribas los nuevos archivos auxiliares de configuración con los antiguos. Consulta la [guía de actualización](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md).

```bash
npm update @anglefeint/astro-theme
npm run doctor
```

`npm update` respeta el rango de `package.json`: `^0.5.1` no incluye `0.6.0`. Para una actualización compatible fuera del rango, sigue las notas de versión e instala una versión de destino explícita, no `@latest` sin comprobarla. Verifica las versiones con `npm ls @anglefeint/astro-theme astro`.

En el starter actual, `doctor` ya incluye las comprobaciones y la compilación. Cuando termine correctamente, revisa el sitio con `npm run preview`. Solo si informa de diferencias entre los adaptadores generados y las plantillas locales, ejecuta `npm run sync-adapters` y repite `npm run doctor`; esto no descarga plantillas del repositorio original. Los proyectos antiguos pueden tener otros scripts: consulta su `package.json` y la guía de actualización.

Así, el núcleo evoluciona vía paquete npm.

Para cambios mayores de Astro, revisa primero la guía oficial de migración y luego ejecuta las verificaciones del proyecto.
