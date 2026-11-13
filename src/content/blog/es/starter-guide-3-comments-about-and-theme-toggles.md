---
tags: ['anglefeint', 'starter']
title: 'Guía 5: ajustar páginas y funciones a tu gusto'
subtitle: 'Personalizar el blog sin cambiar sus plantillas'
description: 'Ajusta inicio, About, Decoder, música, redes, pie, paginación y páginas personalizadas.'
pubDate: '2026-03-07'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

Esta es la parte 5 de 8. [Consulta el orden completo](/es/blog/starter-guide-1-configure-your-site/#tutorial-order) · [Busca campos de configuración](/es/blog/config-reference/).

Cuando el blog funcione, empieza por la zona que quieras cambiar. No necesitas rellenar todos los campos ni copiar todos los ejemplos.

Combina los fragmentos TypeScript en el `defineThemeConfig({...})` existente de `src/site.config.ts`. Mantén un único `theme`, `i18n` y `social` por objeto. Edita los campos coincidentes conservando los demás ajustes. Los objetos se combinan con los valores predeterminados; los arrays sustituyen arrays completos: incluye todos los enlaces, pistas o elementos que quieras mantener.

Esta guía organiza ajustes frecuentes por tareas, no es el diccionario completo. Busca tu zona y lee su sección.

## 1. Ajustar los avisos y efectos de inicio

Consulta [instalación y datos personales](/es/blog/starter-guide-1-configure-your-site/) para distinguir nombre global, título y presentación de inicio. Estos campos cambian avisos e interacciones:

```ts
theme: {
  home: {
    showInitialize: true,
    showFollow: true,
    showTrace: true,
  },
  effects: { enableHomePassage: false },
},
```

| Campo                             | Predeterminado | Qué cambia                                                                                                                                                     |
| --------------------------------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `theme.home.showInitialize`       | `true`         | Muestra el texto de arranque Initialize/done; false oculta esa sección.                                                                                        |
| `theme.home.showFollow`           | `true`         | Muestra Wake Up/Follow; false lo oculta independientemente.                                                                                                    |
| `theme.home.showTrace`            | `true`         | Muestra PIRATE SIGNAL/TRACE inferior; false lo oculta.                                                                                                         |
| `theme.effects.enableHomePassage` | `false`        | Permite una transición Matrix de unos ocho segundos antes de navegar desde títulos de entradas del inicio; movimiento reducido conserva la navegación directa. |

No desactivan toda la lluvia de código ni cambian la paleta global. `showTrace` no controla la terminal inferior derecha de pantalla ancha.

### Cambiar el texto de la terminal ancha

Por defecto es `Knock, knock.`. Configura primero inglés como texto compartido para idiomas sin sustitución propia:

```ts
i18n: {
  locales: {
    es: { messages: { home: { transmission: 'Anota tus ideas y deja algunas pistas.' } } },
  },
},
```

Para texto por idioma, usa `messages.home.transmission`. Sigue configuración actual → configuración inglesa → `Knock, knock.`, no toda la cadena normal de respaldo. La terminal aparece en diseños anchos; que no salga en un móvil no indica fallo. Pulsar la cerradura abre la vista del pasillo.

Oracle de About usa una escena independiente, no afectada por el control de transición de inicio. Estos textos de terminal/estado crean ambiente; no informan de equipos, redes ni seguridad reales.

Consulta las definiciones completas en el [diccionario de inicio](/es/blog/config-home/#startup-switches).

## 2. Sustituir About por tu presentación

Abre `/es/about/` para el ejemplo en español. Cuerpo y contacto se configuran por idioma, sin editar plantillas de página del tema:

```ts
i18n: {
  locales: {
    es: {
      about: {
        metaLine: '$ profile | building and learning',
        sections: {
          who: 'Soy Lin y me gusta desarrollar y escribir.',
          what: 'Aquí registro mis proyectos y lo que aprendo.',
          ethos: ['Mantén la curiosidad.', 'Convertir ideas en herramientas útiles.'],
          now: 'Estoy organizando mi blog personal.',
          contactLead: 'Ponte en contacto conmigo.',
          signature: '> Gracias por pasar por aquí.',
        },
        contact: {
          email: 'you@example.com',
          githubUrl: 'https://github.com/yourname',
          githubLabel: 'GitHub',
        },
      },
    },
  },
},
```

Sustituye nombre y direcciones. `metaLine` es el estado superior del panel. `who`, `what`, `ethos` y `now` contienen biografía, trabajo, principios y actividad actual. `contactLead` presenta el contacto; `signature` es la firma. `ethos` es un array de strings y sustituye todos los elementos anteriores.

Párrafos y firma son texto plano. `\n` crea salto y `\n\n` una línea vacía. No se interpreta Markdown/HTML; no uses `<br>`. El ejemplo solo cambia español. Los otros idiomas necesitan sus textos; no se traducen automáticamente. Los campos ausentes usan las reglas de respaldo del idioma.

Los controles de ventana cierran, minimizan o amplían el panel y guardan estado local en el navegador. La salida IA y el progreso de descarga son interacciones del tema, no conexiones a un servicio activadas por introducir texto. Las herramientas Decoder procesan localmente en el navegador.

Para quitar About, usa `enableAboutPage: false` en `theme`; el valor predeterminado es `true`. Quita rutas estándar y entradas públicas de navegación/contacto relacionadas. No borra enlaces escritos por ti en cuerpos o pie; revísalos también.

Consulta más campos en [About](/es/blog/config-about/#about-content) y los comandos y lector de solo lectura en [textos de terminal](/es/blog/config-terminal/#messages).

## 3. Ajustar Decoder y las tarjetas de lectura

Decoder Lab está activo por defecto en `/es/decoder/` para el ejemplo en español. Su estética homenajea a cypherpunks y pioneros de libertad digital; el procesamiento local y las imágenes P2P expresan control personal de herramientas y datos.

Decodifica texto, interpreta llamadas de tokens admitidas y comprueba formatos de dirección sin RPC, wallet ni API key. No consulta saldos, ejecuta transacciones ni prueba propiedad. Introducir calldata no verifica el comportamiento real de un contrato.

`enableDecoderPage: false` en `theme` desactiva independientemente la página y los enlaces del tema. Desactivar About no desactiva Decoder, ni viceversa. Mantén tú los enlaces personalizados.

Homenaje y tarjetas se configuran por idioma. Por ejemplo, sustituye la lista en español:

```ts
i18n: {
  locales: {
    es: {
      messages: {
        decoderPage: {
          readings: {
            tribute: 'Las ideas y el código impulsan la privacidad y la libertad.',
            links: [
              { title: 'Mis lecturas', href: 'https://example.com/', author: 'Nombre del autor', year: '2026' },
            ],
          },
        },
      },
    },
  },
},
```

`tribute: ''` oculta el homenaje y `links: []` las tarjetas. Omitir conserva los valores por defecto. Cada elemento necesita `title` y `href`; `author`, `year` y `cover` son opcionales. La portada puede ser un nombre integrado como `privacy-code` o `bitcoin`, una ruta pública o HTTPS. Omitirla crea tarjeta solo de texto.

`links` sustituye toda la lista, no añade al final. Incluye los elementos antiguos para conservarlos. Son enlaces que aportas tú; no se descargan/republican artículos ni se verifican recursos automáticamente.

Consulta tipos, portadas integradas y valores en [Decoder](/es/blog/config-decoder/#readings).

## 4. Ajustar redes sociales y pie

`social.links` comparte orden entre cabecera y pie. Para un icono personalizado, añade primero `public/icons/community.svg`:

```ts
social: {
  links: [
    { href: 'https://github.com/yourname', label: 'GitHub', icon: 'github' },
    { href: 'https://example.com/community', label: 'Mi comunidad', iconSrc: '/icons/community.svg' },
  ],
},
```

`iconSrc` admite rutas públicas locales SVG, PNG y WebP que empiezan por `/`, no URLs remotas, consultas, fragmentos ni caracteres codificados. Prima sobre `icon` y conserva colores. Si ambos faltan, muestra label como texto. `label` aporta el nombre accesible. Un archivo ausente o icono integrado no admitido causa error de configuración.

`rel` opcional describe relaciones. Por ejemplo, `rel: 'me'` para Mastodon. El tema mantiene `noopener noreferrer` y no añade `me` por plataforma. La verificación depende de esta: publica primero y proporciona en el perfil la página real que contiene el enlace recíproco. El tema no garantiza verificar identidad.

Los enlaces sociales de cabecera se ocultan en móvil; los del pie permanecen. `links: []` deja tres iconos no pulsables, no oculta la zona.

### Créditos, texto y enlaces adicionales del pie

```ts
site: { tagline: 'Mantén la curiosidad y sigue escribiendo.' },
theme: {
  footer: {
    showCredits: true,
    links: [{ label: 'Código fuente del proyecto', href: 'https://github.com/yourname/your-project' }],
  },
},
```

- `site.tagline` es texto plano personalizado. Una string vacía lo oculta; no se traduce automáticamente. El valor antiguo `Built with Astro.` se considera crédito integrado para evitar duplicarlo.
- `theme.footer.showCredits` es `true` por defecto y controla créditos del tema y Astro. Apagarlo conserva copyright, texto y enlaces. También controla el crédito en imágenes automáticas para compartir, no en personalizadas.
- `theme.footer.links` es un array vacío por defecto y aparece entre copyright y créditos, independientemente de iconos sociales. Conserva tus etiquetas sin traducirlas y no depende de showCredits.

Copyright usa el nombre global y el año de compilación. Recompila y despliega si cambias textos, créditos o salidas dependientes del año.

Consulta [campos sociales](/es/blog/config-site-chrome/#social-fields) y [pie](/es/blog/config-site-chrome/#footer) para reglas de iconos, créditos y enlaces.

## 5. Activar el reproductor de música

Añade audio a `public/music/my-song.mp3` y combina:

```ts
theme: {
  music: {
    enabled: true,
    tracks: [{ title: 'Una canción mía', artist: 'Autor', src: '/music/my-song.mp3' }],
  },
},
```

La música está apagada por defecto y no incluye pistas. Cada una necesita `title` y `src`; `artist` es opcional. Una lista vacía oculta el reproductor. Conserva los elementos deseados al ampliarla. Las URLs omiten `public`; no pueden ser rutas de disco o páginas de compartir de plataformas; sí URLs HTTPS directas. Evita espacios/barras invertidas. Títulos vacíos o formatos inválidos causan errores; formato válido no demuestra disponibilidad.

El reproductor aparece en páginas con el layout compartido, sin controles por página. Cada página nueva empieza plegada. PLAY carga el audio al primer uso. Avanza en orden y vuelve al principio tras la última pista. Expandirlo en móvil oculta temporalmente volver arriba.

La sesión de pestaña recuerda pista, posición y volumen. La reproducción activa intenta retomarse tras navegar/recargar; una pausa manual sigue en pausa. No es continua y el navegador puede bloquear reanudar automáticamente. Sin almacenamiento, la reproducción manual funciona sin restauración.

Se descarga la pista completa a un Blob antes de reproducir, así que buscar posición no depende de Range del servidor. Archivos grandes aumentan espera y memoria. Los servidores remotos necesitan CORS; los locales no. Comprueba la URL real. Desactiva con `theme.music.enabled: false`.

Consulta [música](/es/blog/config-music/#track-fields) para campos, estados y límites de restauración.

## 6. Ajustar cantidades y paginación

```ts
theme: {
  homeLatestCount: 3,
  blogPageSize: 10,
  pagination: {
    windowSize: 7,
    showJumpThreshold: 12,
    jump: { enabled: true, enterToGo: true },
    style: { enabled: true, mode: 'fixed', variants: 9, fixedVariant: 1 },
  },
},
```

`homeLatestCount` usa 3 entradas de inicio por defecto; `blogPageSize`, 10 por página de blog/etiqueta. Usa enteros positivos razonables. Ninguno cambia el máximo fijo de tres vistas de fragments; sus listas usan `theme.fragments.pageSize`.

`windowSize` usa 7 y controla la ventana de números, no elementos por página; el renderizado limita a 5–21. El salto requiere `jump.enabled` true y más páginas que `showJumpThreshold`, por defecto más de 12. `enterToGo` permite saltar con Enter.

El estilo predeterminado es `random`; el ejemplo elige `fixed` para fijar variante. `sequential` sigue el orden de página. La inicialización cliente de `random` vuelve a elegir y puede repetir colores. Sin JavaScript queda la paginación estática compilada. `variants` controla variantes disponibles, limitada a 1–12 al renderizar; `fixedVariant` se limita a ese rango.

`style.enabled: false` aplica estilo básico sin quitar paginación. Blog, etiquetas y Fragments comparten ajustes; considera los tres.

Consulta rangos, variantes y textos en [Blog List y etiquetas](/es/blog/config-blog-list/#pagination-window).

## 7. Desactivar solo lo que no necesitas

Cada control tiene un alcance distinto. No desactives toda la tabla para configurar una función.

| Ruta                           | Predeterminado | Efecto de false                                                               |
| ------------------------------ | -------------- | ----------------------------------------------------------------------------- |
| `theme.enableAboutPage`        | `true`         | Deja de generar About y oculta entradas relacionadas del tema.                |
| `theme.enableDecoderPage`      | `true`         | Deja de generar Decoder y oculta sus entradas.                                |
| `theme.effects.enableRedQueen` | `true`         | Oculta el monitor Red Queen de artículos, no todos los efectos IA.            |
| `theme.search.enabled`         | `true`         | Desactiva interfaz e índice de búsqueda de artículos.                         |
| `theme.toc.enabled`            | `true`         | Desactiva el índice por defecto; `toc: true` individual aún prima.            |
| `theme.tags.enabled`           | `true`         | Desactiva enlaces/páginas de etiquetas sin borrar entradas.                   |
| `theme.math.enabled`           | `true`         | Desactiva matemáticas Markdown/MDX.                                           |
| `theme.socialImage.enabled`    | `true`         | Impide imágenes automáticas compartidas; ogImage explícita sigue funcionando. |

Por ejemplo, combina solo `theme: { effects: { enableRedQueen: false } }` para ocultar el monitor sin cambiar búsqueda, música ni About.

Comentarios y fragments están apagados por defecto y no son necesarios para otras funciones. Consulta [Giscus](/es/blog/starter-guide-4-giscus-comments/) y [fragments](/es/blog/starter-guide-5-fragments/) cuando los necesites. Índice, fórmulas e imágenes compartidas están en [escritura](/es/blog/starter-guide-2-languages-and-routing/) e [imágenes](/es/blog/starter-guide-images/).

## 8. Crear una página personalizada para tu trabajo

Para presentar proyectos por separado, ejecuta en la raíz:

```bash
npm run new-page -- projects
```

Crea `src/pages/[lang]/projects.astro` con layout `base` predeterminado y genera `/<locale>/projects/` para idiomas activos, por ejemplo `/en/projects/` o `/zh/projects/`. Edita el cuerpo de ese archivo Astro. No traduce ni añade navegación de cabecera. Enlázalo desde el cuerpo o pie.

Añade `--theme` para una atmósfera concreta. Por ejemplo, `npm run new-page -- portfolio --theme cyber` crea otra página Cyberpunk. Las opciones son `base`, `ai`, `cyber`, `hacker` y `matrix`. Selecciona el layout nuevo, no cambia globalmente el tema. Los slugs admiten minúsculas, números, guiones y rutas anidadas como `projects/labs`. Evita rutas estándar reservadas. Si existe archivo da error: no ejecutes cinco comandos de tema para la misma ruta consecutivamente.

## 9. Confirmar cambios guardados

Abre la página modificada en dev y revisa contenido, enlaces y entradas. Para sustituciones antiguas de entorno, consulta el [primer tutorial](/es/blog/starter-guide-1-configure-your-site/). Diagnostica iconos, audio y enlaces por rutas/red en vez de sobrescribir toda la configuración repetidamente.

Detén dev antes de publicar y ejecuta:

```bash
npm run doctor
npm run preview
```

doctor incluye preparación local, verificaciones y compilación. No repitas check/build inmediatamente si termina bien. Comprueba búsqueda en preview compilado; preview no publica. Despliega todo `dist/`, pues guardar configuración local no actualiza producción.

## Navegación de tutoriales y diccionario de configuración

[Anterior: publicar un fragment](/es/blog/starter-guide-5-fragments/) · [Siguiente: permitir comentarios](/es/blog/starter-guide-4-giscus-comments/) · [Los ocho tutoriales](/es/blog/starter-guide-1-configure-your-site/#tutorial-order).

Campos relacionados: [inicio](/es/blog/config-home/), [About](/es/blog/config-about/), [terminal](/es/blog/config-terminal/), [Decoder](/es/blog/config-decoder/), [navegación, redes y pie](/es/blog/config-site-chrome/), [música](/es/blog/config-music/), [listas y paginación](/es/blog/config-blog-list/). Rutas, valores y límites en el [índice](/es/blog/config-reference/).
