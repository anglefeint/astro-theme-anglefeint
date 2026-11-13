---
title: 'Diseño visual por rutas'
subtitle: 'Una atmósfera para cada etapa de lectura'
description: 'Cómo Anglefeint separa atmósferas visuales por ruta sin perder foco en el contenido.'
pubDate: '2026-03-03'
heroImage: '../../../assets/blog/default-covers/cyber-02.webp'
aiModel: 'anglefeint-core'
aiMode: 'analysis'
aiState: 'stable'
updatedDate: '2026-11-14'
---

Cada página responde a una tarea diferente:

- Inicio: Matrix para la primera impresión.
- Blog List y etiquetas: Cyberpunk para descubrir contenido.
- Artículos: AI para lectura larga.
- About: Hacker para el autor y las herramientas.
- Fragments: navegación Cyberpunk.
- Decoder Lab: herramientas locales con fondo de red.

Por defecto, el inicio lleva prefijo de idioma y `/` dirige al inicio del idioma predeterminado, inicialmente `/en/`. `defaultLocalePrefix: 'never'` solo cambia ese inicio; las otras rutas conservan sus prefijos.

About, Decoder, etiquetas y Fragments tienen interruptores independientes. Fragments está desactivado por defecto. El diccionario explica los campos.

Sigue leyendo: [Arquitectura de Anglefeint: por qué una composición de cuatro capas](/es/blog/architecture-of-anglefeint/) · [Referencia de configuración: idiomas, direcciones y respaldo](/es/blog/config-languages/)
