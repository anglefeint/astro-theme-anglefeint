---
tags: ['anglefeint', 'config']
title: 'Referencia de configuración: Blog List y etiquetas'
subtitle: 'Listas, paginación y textos compartidos'
description: 'Tipos, valores, límites y ejemplos del archivo, etiquetas y paginación.'
pubDate: '2026-11-13'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/cyber-03.webp'
---

**Nota de versión:** La validación estricta de `blogPageSize` requiere 0.36.1 o posterior; no está en 0.36.0. En versiones anteriores, introduce igualmente un entero positivo razonable.

[Vuelve al índice](/es/blog/config-reference/). Esta página cubre archivo de blog, directorio y listas de etiquetas y paginación compartida. Sigue el código actual; cantidades y colores del demo no son valores predeterminados.

El blog chino está en `/zh/blog/`, segunda página `/zh/blog/2/` y etiquetas `/zh/tags/`. Usa enlaces generados para etiquetas. Sustituye zh para otro idioma; la dirección de inicio predeterminada no quita prefijos de estas rutas.

Combina ejemplos en defineThemeConfig de `src/site.config.ts`. Actualiza theme, i18n y pagination existentes conservando valores, sin duplicar objetos.

## 1. Entradas por página

<a id="page-size"></a>

### `theme.blogPageSize`

- **Tipo:** `number`.
- **Predeterminado:** `10`.
- **Función:** cantidad compartida de archivo y listas por etiqueta. Filtra por idioma y ordena pubDate descendente.
- **Estado:** activo.
- **Límites:** Debe ser un entero positivo seguro. Cero, negativos, fracciones, NaN, Infinity y valores fuera del rango seguro fallan explícitamente al resolver la configuración; no se truncan ni restauran al valor predeterminado. Cero no desactiva la paginación.
- **Alcance:** no cambia recientes de inicio ni tamaño Fragments. El directorio de etiquetas no pagina con este campo.

```ts
theme: { blogPageSize: 12 },
```

Un blog vacío genera primera página. Con una sola página se oculta paginación. Recompila/despliega al cambiar tamaño; páginas altas pueden desaparecer sin redirecciones automáticas.

No ordena por updatedDate, nombre ni clics. No hay filtro de borradores/fechas futuras ni clave de orden configurable; consulta [escribir tu primera entrada](/es/blog/starter-guide-2-languages-and-routing/).

## 2. Entradas y páginas de etiquetas

<a id="tags-enabled"></a>

### `theme.tags.enabled`

- **Tipo:** `boolean`.
- **Predeterminado:** `true`.
- **Función:** controla entradas del tema, directorio, listas y enlaces de etiquetas en tarjetas/artículos.
- **Estado:** activo.
- **Límites:** false no borra tags, entradas ni archivos publicados; no filtra blog por etiqueta. El atajo de blog necesita etiquetas del idioma actual. Un directorio activo vacío muestra su aviso.

```ts
theme: { tags: { enabled: false } },
```

Proceden de arrays `tags` de frontmatter, sin registro site.config. Se recortan espacios, quitan vacías y duplicados por entrada. Importan mayúsculas: Astro y astro son distintas.

El directorio ordena cantidad descendente y después texto en empate. Caracteres especiales, chino, nombres reservados y largos usan codificación estable; sigue enlaces generados. Renombrar puede cambiar ruta sin conservar URL anterior.

Las tarjetas muestran hasta dos etiquetas, sin campo de cantidad. No limita tags por entrada ni las válidas del directorio.

## 3. Ventana de páginas y formulario de salto

<a id="pagination-window"></a>

### `theme.pagination.windowSize`

- **Tipo:** `number`.
- **Predeterminado:** `7`.
- **Función:** influye en números, extremos y puntos suspensivos, no entradas por página.
- **Estado:** condicional: solo con más de una página.
- **Límites:** números normales se redondean hacia abajo y limitan a 5–21. No garantiza ese total exacto entre números, anterior/siguiente y puntos. Usa entero finito.

<a id="jump-threshold"></a>

### `theme.pagination.showJumpThreshold`

- **Tipo:** `number`.
- **Predeterminado:** `12`.
- **Función:** permite entrada solo con páginas estrictamente mayores al umbral y jump.enabled true.
- **Estado:** condicional.
- **Límites:** números normales se redondean hacia abajo, mínimo 1. Por defecto 12 oculta y 13 muestra. Cuenta páginas, no entradas; cero no significa siempre.

<a id="jump-enabled"></a>

### `theme.pagination.jump.enabled`

- **Tipo:** `boolean`.
- **Predeterminado:** `true`.
- **Función:** permite formulario de salto.
- **Estado y límites:** requiere superar umbral. false quita solo formulario, no enlaces. Saltar necesita JavaScript; enlaces normales no.

<a id="jump-enter"></a>

### `theme.pagination.jump.enterToGo`

- **Tipo:** `boolean`.
- **Predeterminado:** `true`.
- **Función:** permite navegar con Enter en número.
- **Estado y límites:** solo si existe formulario. false bloquea Enter, conserva botón. El cliente quita no dígitos y limita destino a páginas reales; no admite URLs arbitrarias.

Pueden combinarse:

```ts
theme: {
  pagination: {
    windowSize: 9,
    showJumpThreshold: 8,
    jump: { enabled: true, enterToGo: false },
  },
},
```

Fragments comparte conducta, pero usa su pageSize para cantidad. No se aplican solo a una etiqueta concreta.

## 4. Estrategia visual de paginación

<a id="style-enabled"></a>

### `theme.pagination.style.enabled`

- **Tipo:** `boolean`.
- **Predeterminado:** `true`.
- **Función:** activa variantes del contenedor y botones.
- **Estado y límites:** condicional. false usa base 1, sin quitar paginación, cambiar cantidades ni desactivar efectos Cyberpunk. No controla tarjetas ni colores aleatorios de Cards/List.

<a id="style-mode"></a>

### `theme.pagination.style.mode`

- **Tipo:** `'random' | 'sequential' | 'fixed'`.
- **Predeterminado:** `'random'`.
- **Función:** elige estrategia visual.
- **Estado y límites:** solo si style.enabled true:

| Modo       | Comportamiento actual                                                                                                                                    |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| random     | Variante inicial estable al compilar; el cliente vuelve a elegir variantes aleatorias para contenedor/botones. Puede repetirse; no es animación continua |
| sequential | Elige contenedor por número de página y botones por posición. Pueden tener colores distintos; no rota con el tiempo                                      |
| fixed      | Usa fixedVariant para contenedor y botones                                                                                                               |

Sin JavaScript queda el HTML estático inicial, sin selección aleatoria cliente.

<a id="style-variants"></a>

### `theme.pagination.style.variants`

- **Tipo:** `number`.
- **Predeterminado:** `9`.
- **Función:** número de variantes 1–N, no array de selección ni temas del sitio.
- **Estado y límites:** condicional. Se redondea hacia abajo y limita a 1–12. Los colores neón compartidos solo definen 1–9: 10–12 no son paletas completas extra y pueden heredar/base. Usa 1–9, normalmente 9. El rango aceptado no añade colores.

<a id="style-fixed"></a>

### `theme.pagination.style.fixedVariant`

- **Tipo:** `number`.
- **Predeterminado:** `1`.
- **Función:** selecciona variante fija.
- **Estado y límites:** se redondea hacia abajo y limita entre 1 y variants. random y sequential no la usan para fijarse. Colores completos 1–9. Usa enteros finitos.

Por ejemplo, fija la segunda:

```ts
theme: {
  pagination: {
    style: { enabled: true, mode: 'fixed', variants: 9, fixedVariant: 2 },
  },
},
```

Para estilo básico, combina `theme: { pagination: { style: { enabled: false } } }`. Elige el ejemplo necesario sin sobrescribir repetidamente uno con otro.

## 5. Títulos, descripciones y textos de paginación

<a id="archive-messages"></a>

Prefijo completo `i18n.locales.<语言>.messages.blog`. Cada campo es sustitución `string` opcional, visible según uso de título/aviso/control. Se resuelve con textos integrados/respaldo. Solo se muestran chino simplificado e inglés; otros tienen sus valores.

| Campo                | Predeterminado chino simplificado / inglés                                                                       | Función y límites                                                                                                          |
| -------------------- | ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `title`              | 博客 / Blog                                                                                                      | Título de primera página y sección oculta; no renombra entradas ni botones fijos de vista                                  |
| `pageTitle`          | 博客 - 第 / Blog - Page                                                                                          | Prefijo de título de páginas posteriores de blog/etiquetas; añade número, sin procesar marcadores personalizados           |
| `archiveDescription` | 关于 AI 时代开发、Web 工程与系统架构的文章。 / Essays on AI-era craft, web engineering, and system architecture. | Metadescripción de primera página y directorio de etiquetas, no extractos de tarjetas                                      |
| `pageDescription`    | 博客归档页 / Blog archive page                                                                                   | Prefijo de metadescripción posterior; añade número y punto. No se usa en el mismo lugar de listas de artículos de etiqueta |

```ts
i18n: {
  locales: {
    zh: {
      messages: {
        blog: {
          title: '文章归档',
          pageTitle: '文章归档 - 第',
          archiveDescription: '项目、阅读与学习笔记。',
          pageDescription: '文章归档分页',
        },
      },
    },
  },
},
```

<a id="pagination-messages"></a>

Los campos de paginación comparten prefijo y tipo:

| Campo            | Predeterminado chino simplificado / inglés | Función y límites                                               |
| ---------------- | ------------------------------------------ | --------------------------------------------------------------- |
| `previous`       | 上一页 / Previous                          | Texto y nombre accesible de anterior; no está en primera página |
| `next`           | 下一页 / Next                              | Texto y nombre accesible de siguiente; no está en última        |
| `paginationAria` | 分页导航 / Pagination                      | Nombre accesible de nav, no otro título visible                 |
| `jumpTo`         | 跳转到页 / Jump to page                    | Texto junto al número; aparece si cumple condiciones            |
| `jumpInputLabel` | 页码 / Page number                         | Etiqueta accesible oculta; no cambia formato                    |
| `jumpGo`         | 跳转 / Go                                  | Texto de envío, no cambia ruta destino                          |

Etiquetas y Fragments los comparten. Blog añade respaldo inglés para jumpTo/jumpInputLabel/jumpGo vacíos; etiquetas pasa los valores resueltos directamente. No uses strings vacías para ocultar controles entre páginas. Usa jump.enabled y nombres accesibles significativos.

```ts
i18n: {
  locales: {
    zh: {
      messages: {
        blog: {
          previous: '前一页',
          next: '后一页',
          paginationAria: '文章分页',
          jumpTo: '前往第几页',
          jumpInputLabel: '目标页码',
          jumpGo: '前往',
        },
      },
    },
  },
},
```

## 6. Directorio de etiquetas y entradas compartidas

<a id="tag-messages"></a>

También usan `i18n.locales.<语言>.messages.blog`, strings opcionales y respaldo normal. Sus zonas deben existir:

| Campo         | Predeterminado chino simplificado / inglés | Función y límites                                                                     |
| ------------- | ------------------------------------------ | ------------------------------------------------------------------------------------- |
| `tags`        | 标签 / Tags                                | Atajo, títulos y nombres accesibles de directorio/lista; no cambia etiquetas ni slugs |
| `allPosts`    | 全部文章 / All posts                       | Texto para volver a todas, también en inicio; no cambia cantidad                      |
| `noTags`      | 暂无标签 / No tags yet.                    | Mensaje de directorio vacío, no blog vacío                                            |
| `taggedPosts` | 文章 / Posts                               | Descripción de cantidad y página de etiqueta; no fija cantidad manual                 |

```ts
i18n: {
  locales: {
    zh: {
      messages: {
        blog: {
          tags: '按标签浏览',
          allPosts: '返回全部文章',
          noTags: '暂时没有可浏览的标签。',
          taggedPosts: '篇文章',
        },
      },
    },
  },
},
```

Vacío no desactiva funciones y puede dejar enlaces vacíos o descripciones incompletas. Desactiva con theme.tags.enabled, no false ni string vacía en messages.

## 7. Cards/List, portadas y otros límites

<a id="view-and-limits"></a>

Esto describe implementación, no campos adicionales:

- Blog y etiquetas comparten Cards/List. Sin preferencia guardada, cards es inicial. JavaScript permite cambiar; localStorage se comparte entre blog, etiquetas e idiomas. Sin almacenamiento cambia, sin garantizar persistencia.
- No hay campos para vista inicial, ocultar selector, sus textos, columnas ni colores. Selector y barra usan tablas locales del componente, con inglés para idiomas nuevos sin entrada. messages.blog.title no los cambia.
- Las tarjetas muestran título, fecha, portada y hasta dos etiquetas. Sin ajustes de extracto, candidatos prioritarios de portada ni ordenar por updatedDate. Cambiar metadescripción no añade description a tarjetas.
- Los primeros dos candidatos con portada usan eager/high; demás lazy. Ocultar en List no garantiza que no descarguen. Consulta preparación/tamaños en [imágenes](/es/blog/starter-guide-images/).
- Cambiar idioma en blog mantiene página si existe, si no primera. En etiquetas busca mismo texto: primera página de esa etiqueta o directorio si no existe. No traduce ni asocia sinónimos.
- Cantidad y transición de inicio están en [inicio](/es/blog/config-home/). Navegación, búsqueda, pie y comentarios no se redefinen aquí.

No se encontraron campos solo de compatibilidad específicos. blogView, showExcerpt y cardTheme no existen; claves arbitrarias no crean funciones.

## Cómo comprobar cambios

En dev revisa primera y siguientes páginas, directorio y lista por etiqueta. El salto requiere páginas suficientes; fijo debe diferir de aleatorio. Inspecciona head para metadescripciones; títulos visibles no verifican etiquetas ocultas ni nombres accesibles.

Tras tamaño o nombres de tags, recompila y despliega completamente evitando archivos antiguos. Antes de publicar, detén dev, ejecuta npm run doctor y npm run preview. doctor ya compila; no repitas check/build inmediatamente. Consulta [instalación](/es/blog/starter-guide-1-configure-your-site/) y [despliegue](/es/blog/starter-guide-deployment/).
