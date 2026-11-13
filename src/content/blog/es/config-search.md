---
tags: ['anglefeint', 'config']
title: 'Referencia de configuración: búsqueda y descubrimiento'
subtitle: 'Índice de artículos y otras entradas de contenido'
description: 'Tipos, valores, textos, idiomas y límites de la búsqueda interna y el descubrimiento de contenido.'
pubDate: '2026-11-13'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/cyber-02.webp'
---

Empieza por [escribir entradas](/es/blog/starter-guide-2-languages-and-routing/) o [preview/despliegue](/es/blog/starter-guide-deployment/). Consulta el archivo en [instalación](/es/blog/starter-guide-1-configure-your-site/) y otros módulos en el [índice](/es/blog/config-reference/).

La búsqueda recupera artículos de índices compilados. Recientes de inicio, etiquetas, recomendaciones y RSS son otras entradas, no todas controladas por búsqueda. Los valores vienen del tema, no del demo.

<a id="enabled"></a>

## theme.search.enabled: control global

- **Tipo / predeterminado:** boolean / true.
- **Estado y función:** activo. Cabeceras muestran entrada, artículos participantes reciben marcadores y la compilación produce recursos estáticos Pagefind.
- **Límites:** false quita entrada estándar e indexación de esta compilación. search: true individual no supera apagado global. No borra artículos, evita indexación en internet ni limpia índices antiguos publicados.
- **Ejemplo:** theme: { search: { enabled: false } }.

Único campo hoja público theme.search. Sin URL de servidor, API key, directorio, orden, pesos ni control entre idiomas. Pagefind compila búsqueda estática sin backend desplegado.

<a id="article-search"></a>

## search individual: no es campo site.config

| Ubicación                                                   | Tipo / predeterminado                                    | Estado, función y límites                                                                                                             | Ejemplo       |
| ----------------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| frontmatter.search de `src/content/blog/<语言>/某篇文章.md` | boolean opcional / sin definir en schema; true en layout | Condicional: raíz de índice con búsqueda global activa. False no elimina listas, recomendaciones, RSS, exportaciones ni URLs públicas | search: false |

Para excluir un artículo, añade al frontmatter:

```yaml
search: false
```

No uses theme.search: false ni search: false superior. No es privacidad. No hay filtro de borrador/fecha futura; mantén contenido sin terminar fuera. Consulta [campos de artículos](/es/blog/config-article/#frontmatter).

### ¿Qué se indexa?

Los artículos estándar emiten data-anglefeint-search si ambos controles permiten. Incluye título, subtítulo visible y cuerpo. context idéntico al subtítulo se trata una vez en esa posición, no como campo independiente para todos los context.

Navegación, reproductor, pie, comentarios y relacionados quedan fuera del cuerpo. frontmatter.description no es el extracto directo de esta UI; tags no son filtros configurables. Pagefind devuelve metadatos de título/extractos. No hace OCR ni transcribe audio/vídeo.

About, Fragments, Decoder, inicio y listas no tienen raíz de indexación de artículos y no pasan a resultados al activar búsqueda. Las páginas personalizadas deben implementar el contrato de marcadores; claves arbitrarias site.config no lo añaden.

<a id="messages"></a>

## messages.search: once textos

Prefijo `i18n.locales.<语言>.messages.search.`. Strings opcionales con textos integrados/respaldo. Abajo chino simplificado / inglés y valores de ejemplo. Condicionales a entrada/interfaz/estado correspondiente.

| Campo         | Predeterminado chino simplificado / inglés                                                                                           | Función, límites y marcadores                                                                            | Ejemplo                             |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| `label`       | 搜索 / Search                                                                                                                        | Nombre accesible/tooltip y título del diálogo, no consulta                                               | `"搜索文章"`                        |
| `close`       | 关闭搜索 / Close search                                                                                                              | Nombre accesible/tooltip de cerrar; esc/icono fijos                                                      | `"关闭搜索"`                        |
| `placeholder` | 搜索文章… / Search articles…                                                                                                         | Placeholder y etiqueta accesible; no rellena consulta                                                    | `"输入文章关键词"`                  |
| `hint`        | 搜索当前语言的文章。 / Search articles in the current language.                                                                      | Aviso de producción antes de consulta                                                                    | `"搜索当前语言的文章。"`            |
| `loading`     | 正在搜索… / Searching…                                                                                                               | Estado buscando/preparando, no ajuste de tiempo/carga                                                    | `"正在查找…"`                       |
| `empty`       | 没有找到匹配的文章。 / No matching articles.                                                                                         | Sin resultados; también puede aparecer sin índice del idioma                                             | `"没有找到相关文章。"`              |
| `error`       | 搜索加载失败，请重试。 / Search could not load. Please try again.                                                                    | Fallo de manifiesto, módulo o detalles, no error de compilación                                          | `"搜索暂时不可用，请重试。"`        |
| `retry`       | 重试 / Retry                                                                                                                         | Reintenta cargar motor, no recompila índice en navegador                                                 | `"重新加载"`                        |
| `more`        | 加载更多 / Load more                                                                                                                 | Carga lote adicional sin cambiar tamaño                                                                  | `"更多结果"`                        |
| `results`     | 找到 {count} 篇文章 / {count} articles found                                                                                         | Total encontrado. Conserva literal {count}; sustituye primera aparición. No es número de tarjetas vistas | `"共找到 {count} 篇文章"`           |
| `dev`         | 本地完整搜索请先运行 npm run build，再运行 npm run preview。 / To test full search locally, run npm run build, then npm run preview. | Aviso dev sin búsqueda real; editarlo no genera índices                                                  | `"请构建后在 preview 中测试搜索。"` |

Se muestran como texto, no HTML ejecutable. Vacío sustituye etiquetas sin ocultar controles y puede perjudicar nombres accesibles. {count} no se añade automáticamente a results personalizado; consérvalo una vez.

### Ejemplo para combinar

Combina en defineThemeConfig({...}) de src/site.config.ts, conserva imports/exports/ajustes sin duplicar theme/i18n:

```ts
theme: { search: { enabled: true } },
i18n: {
  locales: {
    zh: {
      messages: {
        search: {
          label: '搜索文章',
          placeholder: '输入文章关键词',
          results: '共找到 {count} 篇文章',
          empty: '没有找到相关文章。',
        },
      },
    },
  },
},
```

<a id="language-and-loading"></a>

## Idioma, recursos y resultados

- pagefind/ compilado contiene anglefeint.json y módulos. Abrir búsqueda carga manifiesto/motor; script UI ya viene con páginas con entrada. No todo espera clic.
- Rutas incluyen BASE_URL Astro. Omitir pagefind/, desplegar solo HTML o reescribir recursos a HTML puede fallar. Sin campo público de ruta de índice.
- Compara html lang con manifiesto sin mayúsculas. Sin índice actual devuelve vacío, no inglés de respaldo. El idioma efectivo de página, no fallback de textos, elige artículos.
- Espera unos 200ms al escribir. IME espera fin de composición; enviar formulario puede buscar ya. Vacío no busca. Tiempo no configurable ni solicitud IA.
- Cada lote carga hasta ocho detalles y después «más». Sin pageSize. El conteo es total, no lote. Solo conserva URLs misma origen; extractos texto/mark, no HTML arbitrario.
- Pagefind decide orden. Sin ranking/recomendación del tema; fallback de textos no añade otro idioma.

Consulta [metadatos de idioma](/es/blog/config-languages/#meta). Textos de búsqueda cambian UI, no generan contenido ni idiomas de índice.

<a id="preview"></a>

## ¿Por qué no hay búsqueda real en dev?

El índice se genera tras compilar Astro, no con npm run dev. Dev muestra messages.search.dev y no busca lo escrito. Es conducta prevista, no falta configuración.

Prepara contenido y ejecuta:

```bash
npm run build
npm run preview
```

preview sirve compilación. Recompila tras cambiar artículos, metadatos, inclusión o rutas para probar índice nuevo. Despliega páginas y pagefind juntos. Editar en dev no actualiza índices públicos.

Sin artículos indexables se genera manifiesto vacío reconocible para resultados vacíos. Un error de indexación detiene compilación, no publica falso éxito. Retry recarga recursos existentes: no repara builds ni crea artículos en el navegador del visitante.

<a id="discovery"></a>

## Ajustes de otras entradas de contenido

Reutilizan campos/valores de sus módulos, sin crear configuración de búsqueda:

| Ruta o ubicación                                | Tipo / predeterminado            | Función, límites y ejemplo                                                                           | Referencia                                                      |
| ----------------------------------------------- | -------------------------------- | ---------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| theme.homeLatestCount                           | number / 3                       | Recientes de inicio, p. ej. theme: { homeLatestCount: 5 }; no lote de búsqueda ni relacionados       | [Cantidad de inicio](/es/blog/config-home/#latest-count)        |
| theme.blogPageSize                              | number / 10                      | Por página blog/etiquetas, p. ej. theme: { blogPageSize: 8 }; no resultados                          | [Paginación](/es/blog/config-blog-list/#page-size)              |
| theme.tags.enabled                              | boolean / true                   | Etiquetas y páginas, p. ej. theme: { tags: { enabled: false } }; no borra tags ni desactiva búsqueda | [Control etiquetas](/es/blog/config-blog-list/#tags-enabled)    |
| frontmatter.tags de artículo                    | string[] opcional / sin definir  | Archivos/etiquetas, p. ej. ['Astro', '随笔']; no relevancia ni lista permitida de búsqueda           | [Campos de artículo](/es/blog/config-article/#frontmatter)      |
| `i18n.locales.<语言>.messages.blog.related`     | string / textos integrados abajo | Título de relacionados, solo texto; ejemplo '继续阅读'                                               | [Textos de artículo](/es/blog/config-article/#article-messages) |
| `i18n.locales.<语言>.messages.blog.relatedAria` | string / textos integrados abajo | Nombre accesible de relacionados; ejemplo '其他文章'                                                 | [Textos de artículo](/es/blog/config-article/#article-messages) |

Relacionados son los tres más recientes del idioma, excluyendo el actual; no similitud de tags/contenido/canonicalTopic. Sin relatedCount, control propio ni lista manual site.config. Sin otros artículos desaparece zona. search: false aún puede recomendarse.

| Texto                     | Predeterminado chino simplificado / inglés |
| ------------------------- | ------------------------------------------ |
| messages.blog.related     | 相关文章 / Related                         |
| messages.blog.relatedAria | 相关文章 / Related posts                   |

<a id="public-outputs"></a>

## RSS, SEO y exportaciones no son búsqueda interna

| Entrada                     | Conducta y relación actual                                                                                                                                                                                                                 |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/<语言>/rss.xml`           | Feed de resúmenes por idioma activo. Título usa nombre global; descripción messages.blog.archiveDescription. Ítems usan title, description, pubDate y URL. search: false no excluye. No es texto completo; sin control RSS en theme.search |
| Metadatos y buscadores      | Independiente de búsqueda interna. search: false no añade noindex, desactiva sitemap ni controla rastreo externo                                                                                                                           |
| Texto público para máquinas | Artículos/About/Fragments tienen exportación aparte de Pagefind. Consulta [contexto de idioma](/es/blog/config-languages/#ai-context). search: false no es filtro privado                                                                  |

Usa nombres, dominios y descripciones reales. Consulta [despliegue](/es/blog/starter-guide-deployment/) para URLs y [descripciones de listas](/es/blog/config-blog-list/#archive-messages) para archiveDescription RSS. Sin resultados internos no significa contenido no público.

Controles global/individual y los once textos se consumen. Sin campos antiguos extra. canonicalTopic no usado no se vuelve categoría por estar cerca de búsqueda; consulta [compatibilidad de artículos](/es/blog/config-article/#legacy-frontmatter). No se exponen búsqueda combinada multilingüe, OCR, estadísticas de consultas, pesos ni tipos configurables.

Vuelve al [índice](/es/blog/config-reference/).
