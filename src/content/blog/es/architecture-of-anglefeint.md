---
title: 'Arquitectura de Anglefeint: por qué una composición de cuatro capas'
subtitle: 'ThemeFrame -> Shell -> Layout -> Page'
description: 'Explicación práctica de la arquitectura de Anglefeint y de cómo mejora el mantenimiento a largo plazo.'
pubDate: '2026-03-03'
heroImage: '../../../assets/blog/default-covers/ai-02.webp'
aiModel: 'anglefeint-core'
aiMode: 'analysis'
aiState: 'stable'
aiLatencyMs: 168
aiConfidence: 0.96
wordCount: 760
tokenCount: 1180
---

En este tema, la arquitectura se definió antes que el acabado visual. Cuando la estructura no está clara, cada cambio futuro cuesta más.

Anglefeint usa cuatro capas:

- ThemeFrame: marco común y estructura base
- Shell: atmósfera visual por ruta
- Layout: composición estructural de página
- Page: contenido y datos de ruta

Esta separación permite evolucionar estilo y contenido de forma independiente.

A nivel de repositorio, el núcleo vive en @anglefeint/astro-theme y starter se enfoca en contenido y configuración. Así, la actualización se concentra en el paquete y no en copiar archivos manualmente.

La configuración de usuario se centraliza en site.config.ts. Un solo punto de entrada reduce fricción y facilita el mantenimiento.
