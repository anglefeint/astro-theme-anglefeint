---
tags: ['anglefeint', 'config']
title: 'Referencia de configuración: inicio'
subtitle: 'Título, presentación, entradas recientes y efectos Matrix'
description: 'Tipos, valores, límites y ejemplos de los campos de inicio usados por el tema.'
pubDate: '2026-11-13'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

[Vuelve al índice de configuración](/es/blog/config-reference/). Aquí se documentan los campos usados realmente por el inicio, sin cambiar el tema ni confundir ajustes personales del demo con valores predeterminados.

Sustituye `<locale>` por un código activo. Los ejemplos usan es y solo afectan español; no cambian inglés ni activan idiomas. Combina los fragmentos en el defineThemeConfig existente de `src/site.config.ts` y conserva los otros campos theme, i18n y site.

## 1. Título de inicio, presentación y descripción de metadatos

<a id="home-title"></a>

### `i18n.locales.<locale>.site.homeTitle`

- **Tipo:** `string` opcional.
- **Predeterminado del tema:** sin definir. Los idiomas integrados no tienen homeTitle independiente y terminan usando el nombre global, por defecto My Blog.
- **Función:** título visible del inicio.
- **Estado y límites:** condicional. Busca título recortado no vacío en idioma actual y respaldos, después usa nombre global. `''` o espacios no lo ocultan. No cambia el nombre global de pestañas, navegación, pie, RSS ni SEO.

<a id="home-hero"></a>

### `i18n.locales.<locale>.site.hero`

- **Tipo:** `string` opcional.
- **Predeterminado del tema:** presentación integrada por idioma. Chino simplificado: «在这里写一段站点简介，并告诉读者你将发布什么类型的内容。» Inglés: «Write a short introduction for your site and what readers can expect from your posts.» Los demás tienen valores propios.
- **Función:** presentación visible bajo el título.
- **Estado y límites:** condicional. Busca valor definido en idioma actual/respaldo. `''` vacía deliberadamente y detiene el respaldo. Solo texto plano, sin Markdown/HTML ni cambios de metadatos.

<a id="home-description"></a>

### `i18n.locales.<locale>.messages.siteDescription`

- **Tipo:** sustitución `string` opcional.
- **Predeterminado del tema:** texto integrado resuelto. Chino simplificado: «电影感网页界面与 AI 时代工程实践文章。» Inglés: «Cinematic web interfaces and AI-era engineering essays.»
- **Función:** descripción del head de inicio, no presentación visible.
- **Estado y límites:** condicional. Primero se resuelven mensajes/respaldo; solo una string resultante vacía usa descripción global. Texto vacío no desactiva todas las descripciones, y espacios no se recortan automáticamente a ausencia.

Pueden configurarse juntos, pero son independientes:

```ts
i18n: {
  locales: {
    es: {
      site: {
        homeTitle: 'Mi jardín digital',
        hero: 'Apuntes de desarrollo, lecturas y vida cotidiana.',
      },
      messages: { siteDescription: 'Proyectos y apuntes personales.' },
    },
  },
},
```

<a id="site-fallbacks"></a>

### Campos compartidos: `site.title`, `site.description`

En inicio, site.title es el respaldo final sin homeTitle válido; site.description respalda metadatos de idioma vacíos. Ninguno es exclusivo de inicio. Tipos, valores, entorno y ejemplos están en [identidad del sitio](/es/blog/config-site-chrome/#identity).

## 2. Cantidad de entradas recientes

<a id="latest-count"></a>

### `theme.homeLatestCount`

- **Tipo:** `number`.
- **Predeterminado del tema:** `3`.
- **Función:** toma las primeras N entradas del idioma ordenadas por pubDate descendente. Si hay menos, muestra las existentes. La cantidad adyacente es mostrado/total real del idioma.
- **Estado y límites:** activo, usa slice sin validación específica de entero positivo. Usa enteros positivos razonables, no negativos, fracciones, NaN ni Infinity. `0` produce lista vacía y aviso sin entradas aunque existan; no oculta toda la zona.
- **Alcance independiente:** no fija tamaño Blog List ni el máximo fijo de tres fragments de inicio.

```ts
theme: { homeLatestCount: 5 },
```

Títulos, fechas y extractos proceden del contenido, no de subcampos aquí. No se rellena el inicio con entradas de otros idiomas.

## 3. Avisos de arranque y estado inferior

<a id="startup-switches"></a>

Los tres son `boolean` activos, `true` por defecto. False solo oculta su zona; omitir conserva el valor.

| Ruta completa               | Función                                      | Límites                                                              |
| --------------------------- | -------------------------------------------- | -------------------------------------------------------------------- |
| `theme.home.showInitialize` | Sección de arranque Initialize/done.         | No controla contenido de inicio ni carga de fondo.                   |
| `theme.home.showFollow`     | Aviso Wake Up/Follow The White Rabbit.       | Independiente del anterior; no necesario para navegar.               |
| `theme.home.showTrace`      | Estado inferior PIRATE SIGNAL/TRACE PROGRAM. | No controla la terminal ancha. Texto ambiental, no rastreo/red real. |

```ts
theme: {
  home: {
    showInitialize: false,
    showFollow: true,
    showTrace: false,
  },
},
```

Desactivar los dos primeros elimina su componente de arranque. No hay campos site.config para frases fijas, estado inferior ni tiempos. No inventes startupText o traceText.

## 4. Textos de la interfaz de inicio

<a id="home-messages"></a>

Son sustituciones `string` opcionales bajo `i18n.locales.<locale>.messages.home`. Los campos normales usan respaldo de mensajes. La tabla muestra chino simplificado / inglés; otros idiomas integrados tienen textos propios.

| Segmento final | Predeterminado chino simplificado / inglés                      | Función y límites                                                                                 |
| -------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `latest`       | 最新 / Latest                                                   | Título de recientes; no afecta orden/cantidad.                                                    |
| `viewAll`      | 全部 / All                                                      | Entrada al archivo y descripción accesible del enlace de archivo de fragments; no cambia destino. |
| `noPosts`      | 该语言暂时没有文章。 / No posts available in this language yet. | Aviso latestPosts vacío, no control de borradores/publicación.                                    |
| `openDoor`     | 开门 / Open door                                                | Nombre accesible/etiqueta de vista de la cerradura ancha; no suele ser encabezado permanente.     |

Son condicionales a la existencia de sus zonas. Strings vacías quitan texto, no contenedores/funciones, y pueden eliminar nombres útiles. Usa controles de función para visibilidad.

```ts
i18n: {
  locales: {
    es: {
      messages: {
        home: {
          latest: 'Últimas entradas',
          viewAll: 'Todas las entradas',
          noPosts: 'Todavía no hay entradas.',
          openDoor: 'Abrir vista del pasillo',
        },
      },
    },
  },
},
```

<a id="home-transmission"></a>

### `i18n.locales.<locale>.messages.home.transmission`

- **Tipo:** sustitución `string` opcional.
- **Predeterminado del tema:** `'Knock, knock.'` compartido por idiomas, incluido chino, sin ajustes personales.
- **Función:** texto seleccionable y desplazable de terminal ancha.
- **Estado y límites:** condicional; visible desde 1440px. Orden especial: ajuste personal actual → ajuste personal inglés → frase predeterminada, no cadena normal completa. `''` vacía texto sin ocultar terminal ni cerrar pasillo.

Para texto compartido por idiomas sin sustitución propia:

```ts
i18n: {
  locales: {
    es: { messages: { home: { transmission: 'Deja aquí una pequeña pista.' } } },
  },
},
```

El mismo campo en es solo cambia español. El texto no mide señales reales ni altera cerradura/pasillo.

<a id="message-hero"></a>

### `i18n.locales.<locale>.messages.home.hero`

- **Tipo:** sustitución `string` opcional.
- **Predeterminado del tema:** presentación integrada por idioma; chino simplificado/inglés coinciden con site.hero de arriba.
- **Función:** presentación de respaldo solo si getSiteHero no encuentra valor definido actual/respaldo.
- **Estado y límites:** condicional, no obsoleto. Todo idioma integrado ya tiene site.hero; cambiar solo esto normalmente no afecta. site.hero `''` no lo activa. Edita normalmente site.hero directamente.

```ts
i18n: {
  locales: {
    es: { messages: { home: { hero: 'Introducción usada cuando site.hero no tiene un valor disponible.' } } },
  },
},
```

El ejemplo documenta ruta/tipo, sin imponerse al site.hero de mayor prioridad. No elimines valores ni modifiques dependencias para cambiar la presentación.

## 5. Transición Matrix al abrir una entrada

<a id="home-passage"></a>

### `theme.effects.enableHomePassage`

- **Tipo:** `boolean`.
- **Predeterminado del tema:** `false`.
- **Función:** los clics normales de inicio en títulos recientes y navegación de blog marcada reproducen la transición antes de navegar. Dura unos ocho segundos y navega al completarse o por recuperación ante error.
- **Estado y límites:** condicional, requiere JavaScript. Movimiento reducido, modificadores, botones distintos al izquierdo, descargas, URLs externas y nuevas ventanas conservan conducta nativa. No retrasa el texto de inicio ni controla Oracle/pasillo de About o pantalla ancha.

```ts
theme: { effects: { enableHomePassage: true } },
```

Apagado, navega directamente. No ofrece duración, colores ni destino configurables; no añadas homePassageDuration inexistente.

## 6. Ajustes compartidos también usados en inicio

<a id="shared-settings"></a>

No son exclusivos de inicio. Esta tabla describe su uso aquí; sus módulos principales los definen por completo.

| Ruta completa                                    | Relación con inicio                                                                                      | Referencia principal                                                   |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `theme.fragments.enabled`                        | Muestra avatar si hay fragments del idioma; también controla lista completa. Máximo tres vistas previas. | [Control Fragments](/es/blog/config-fragments/#enabled)                |
| `i18n.locales.<locale>.messages.blog.allPosts`   | Tooltip de cantidad reciente y nombre accesible del archivo.                                             | [Textos compartidos de lista](/es/blog/config-blog-list/#tag-messages) |
| `i18n.locales.<locale>.messages.fragments.title` | Nombre accesible del avatar, no texto a su lado.                                                         | [Textos Fragments](/es/blog/config-fragments/#fragment-messages)       |
| `i18n.locales.<locale>.messages.fragments.close` | Nombre accesible de cerrar vista, no forma del botón.                                                    | [Textos Fragments](/es/blog/config-fragments/#fragment-messages)       |

Si falta aun activo, comprueba fragments del idioma actual. No copies IDs para forzar el avatar. Consulta [límites de imagen/código](/es/blog/config-fragments/#preview-and-links) y [publicar fragments](/es/blog/starter-guide-5-fragments/).

## 7. Ajustes de inicio no disponibles actualmente

<a id="unsupported-settings"></a>

`messages.siteTitle` no cambia actualmente los nombres estándar de inicio/sitio. Usa homeTitle o site.title superior. Tipo, valor y ejemplo conservados en [campo de título sin uso](/es/blog/config-site-chrome/#legacy-site-title).

No hay campos site.config para densidad/color de lluvia, botón espejo, recursos del avatar, cantidad de fragments previos, frases fijas ni duración de transición. Pertenecen a layouts/estilos/scripts; añadir nombres TypeScript arbitrarios no los implementa. Reduced Motion afecta presentación, pero no es un nuevo control aquí.

La relación `/`/inicios localizados usa i18n.defaultLocale e i18n.routing.defaultLocalePrefix; consulta [idiomas/direcciones](/es/blog/config-languages/#routing). Navegación, pie, música y estadísticas también son compartidos.

## ¿Cómo verificar los cambios?

Abre el idioma destino en dev y distingue título visible, presentación, metadatos y nombres accesibles. Revisa terminal a 1440px o más. Inspecciona head y nombres/title de botones, no solo encabezados visibles.

Reinicia dev si cambia entorno. Producción requiere compilar/desplegar. Antes de publicar, detén dev, ejecuta npm run doctor y npm run preview. doctor ya compila; no repitas check/build inmediatamente. Consulta [instalación](/es/blog/starter-guide-1-configure-your-site/) y [despliegue](/es/blog/starter-guide-deployment/).
