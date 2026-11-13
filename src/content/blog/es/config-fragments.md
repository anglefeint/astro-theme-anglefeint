---
tags: ['anglefeint', 'config']
title: 'Referencia de configuración: Fragments'
subtitle: 'Lista, vistas previas, comentarios e identidad estable'
description: 'Campos públicos, valores y límites de Fragments, con textos y comportamiento fijo.'
pubDate: '2026-11-13'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

Para publicar, lee [publicar un fragment](/es/blog/starter-guide-5-fragments/). Esta página es una referencia de campos. Consulta ubicación de configuración en [instalación](/es/blog/starter-guide-1-configure-your-site/) y todos los módulos en el [índice](/es/blog/config-reference/).

Los valores son del paquete del tema, no del demo. Combina en `defineThemeConfig({...})` de `src/site.config.ts` sin duplicar theme/i18n.

## Localizar el ajuste

| Qué cambiar                          | Ruta o ubicación                                                             |
| ------------------------------------ | ---------------------------------------------------------------------------- |
| Lista y entrada de inicio            | `theme.fragments.enabled`                                                    |
| Elementos por página completa        | `theme.fragments.pageSize`                                                   |
| Comentarios independientes           | `theme.fragments.comments.enabled`, conexión compartida con `theme.comments` |
| Título, descripción, avisos y cierre | `i18n.locales.<locale>.messages.fragments`                                   |
| Números y salto de página            | `theme.pagination` y textos `messages.blog`                                  |
| ID, hora y título individual         | Frontmatter Markdown, no site.config                                         |
| Cantidad, altura y avatar de inicio  | Sin campos públicos correspondientes actualmente                             |

<a id="enabled"></a>

## theme.fragments.enabled: activar fragments

- **Tipo / predeterminado:** boolean / `false`.
- **Estado / función:** activo. Carga `src/content/fragments/<locale>/**/*.md`, genera listas e índices de posición de idiomas activos y entrada de inicio si ese idioma tiene contenido.
- **Límites:** apagado no carga colección ni genera listas, sin borrar archivos. Activo sin contenido muestra estado vacío y no entrada de inicio. Solo carga `.md`, no `.mdx`.
- **Ejemplo:** `theme: { fragments: { enabled: true } }`.

Primera página `/<locale>/fragments/`; después `/<locale>/fragments/2/`, sin añadir `/1/` manual. Activa antes el idioma; consulta [idiomas](/es/blog/starter-guide-languages/).

Con `theme.fragments.enabled: false`, dev, build y prepare-covers/doctor omiten referencias de imágenes del contenido de Fragments. No exigen originales ni derivados de imágenes incluidas únicamente por esas referencias. Las referencias de portada y los conjuntos `src/assets/blog/default-covers/` y `src/assets/blog/covers/originals/` siguen preparándose y validándose, aunque una imagen se use solo en Fragments. No se borran archivos; reactivar restablece el procesamiento de Fragments.

**Nota de versión:** El aislamiento de imágenes al desactivar requiere 0.36.1 o posterior; no está en 0.36.0. No lo supongas disponible en versiones anteriores.

<a id="page-size"></a>

## theme.fragments.pageSize: tamaño de lista completa

- **Tipo / predeterminado:** number / `20`.
- **Estado / función:** activo; decide paginación e índice ID/página.
- **Límites:** **entero seguro de 1–100**. Fracciones, cero, negativos y fuera de rango fallan, sin ajuste automático. Se valida aun con Fragments apagado. Inicio sigue mostrando hasta tres, independientemente de esto o `theme.homeLatestCount`.
- **Ejemplo:** `theme: { fragments: { pageSize: 10 } }`.

Cada idioma ordena pubDate descendente y, en empate, ID por `localeCompare`. No ordena por archivo ni filtra fechas futuras. Cambiar tamaño mueve tarjetas: comparte enlaces estables.

<a id="comments-enabled"></a>

## theme.fragments.comments.enabled: comentarios

- **Tipo / predeterminado:** boolean / `false`.
- **Estado / función:** condicional. Con Fragments activo añade botón de comentarios a cada tarjeta completa, que abre diálogo compartido. No hay botón de comentarios en inicio.
- **Límites:** independiente de `theme.comments.enabled` de artículos. Requiere conexión Giscus compartida; faltar campos falla al generar páginas, aun vacías. Permisos/servicio deben funcionar remotamente.
- **Ejemplo:** `theme: { fragments: { enabled: true, comments: { enabled: true } } }`.

Activar sin comentarios:

```ts
theme: {
  fragments: {
    enabled: true,
    pageSize: 10,
    comments: { enabled: false },
  },
},
```

Para comentar solo fragments, mantén artículos false y configura repo, repoId, category y categoryId. Tipos/valores/validación en [conexión](/es/blog/config-comments/#connection), y [ejemplos exclusivos de fragments](/es/blog/config-comments/#fragment-overrides). Lo local no prueba IDs/permisos remotos.

Asocia `fragment/<ID-estable>`; IDs iguales comparten discusión entre idiomas. Ignora mapping, term, number y shareAcrossLocales de artículos. Fuerza specific, strict `'1'`, emitMetadata `'1'` e idioma de página en vez de `theme.comments.lang`. Los comentarios de artículos activos siguen su validación propia.

Tema, reacciones y posición se comparten. La primera pulsación inserta cliente; eager significa inmediatamente después de pulsar, no al cargar página. Cerrar conserva iframe; cambiar fragment cambia discusión. Unos 15 segundos sin respuesta válida muestran fallo/reintento. No hay campo de timeout.

<a id="fragment-messages"></a>

## Textos de interfaz: messages.fragments

Prefijo: `i18n.locales.<locale>.messages.fragments`. Todos **string**, cambian texto, no conducta; usan valores integrados/respaldo. La tabla muestra chino simplificado / inglés. Omitir conserva; string vacía sustituye y no garantiza quitar control. Los ejemplos van dentro de fragments.

| Campo            | Predeterminado chino simplificado / inglés                                                                                | Estado, función y límites                                                                          | Ejemplo                                                    |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `title`          | 碎片 / Fragments                                                                                                          | Condicional: título de página/lista y nombre accesible de inicio, no título individual             | `title: 'Notas breves'`                                    |
| `description`    | 沿途记录的几句话。 / Brief thoughts, kept along the way.                                                                  | Condicional: presentación visible y metadatos de lista; no aparece en ventana desplegada de inicio | `description: 'Pequeños apuntes del trabajo y la vida.'`   |
| `empty`          | 还没有碎片。 / No fragments yet.                                                                                          | Condicional: lista completa vacía; no fuerza la entrada de inicio                                  | `empty: 'Vuelve más tarde.'`                               |
| `comments`       | 评论 / Comments                                                                                                           | Condicional: texto del botón con comentarios activos                                               | `comments: 'Participar en el debate'`                      |
| `close`          | 关闭 / Close                                                                                                              | Condicional: cierre del diálogo y nombre accesible de cierre en inicio                             | `close: 'Cerrar ventana'`                                  |
| `previous`       | 上一页 / Previous                                                                                                         | **Sin uso actual:** admitido por tipos, pero paginación usa messages.blog.previous                 | `previous: 'Página anterior'`                              |
| `next`           | 下一页 / Next                                                                                                             | **Sin uso actual:** admitido por tipos, pero paginación usa messages.blog.next                     | `next: 'Página siguiente'`                                 |
| `loading`        | 正在加载评论… / Loading comments…                                                                                         | Condicional: estado de carga de comentarios                                                        | `loading: 'Conectando con el debate…'`                     |
| `error`          | 评论未能加载，请检查网络或评论配置后重试。 / Unable to load comments. Check your network or comment settings, then retry. | Condicional: fallo de comentarios, no del índice de posición                                       | `error: 'El debate no está disponible; reintenta.'`        |
| `retry`          | 重试 / Retry                                                                                                              | Condicional: botón de reintento tras fallo de carga                                                | `retry: 'Reconectar'`                                      |
| `copyLink`       | 复制碎片链接 / Copy fragment link                                                                                         | Condicional: title y nombre accesible de compartir; JavaScript activa el botón                     | `copyLink: 'Copiar enlace de esta nota'`                   |
| `linkCopied`     | 链接已复制 / Link copied                                                                                                  | Condicional: copia correcta                                                                        | `linkCopied: 'Copiado'`                                    |
| `copyLinkFailed` | 未能自动复制，请复制下方链接。 / Unable to copy automatically. Copy the link below.                                       | Condicional: fallo de portapapeles, ofrece copia manual                                            | `copyLinkFailed: 'Copia este enlace manualmente.'`         |
| `notFound`       | 找不到这条碎片，它可能已被移除。 / Fragment not found. It may have been removed.                                          | Condicional: fallo de localizar ID estable, no 404 general                                         | `notFound: 'Esta nota ya no existe.'`                      |
| `indexError`     | 暂时无法定位这条碎片，请刷新页面后重试。 / Unable to locate this fragment. Refresh the page and try again.                | Condicional: fallo al solicitar o validar índice de posición                                       | `indexError: 'No se pudo localizar; recarga y reintenta.'` |

Por ejemplo, sustituye solo título/descripción en español:

```ts
i18n: {
  locales: {
    es: {
      messages: {
        fragments: {
          title: 'Notas breves',
          description: 'Pequeños apuntes del trabajo y la vida.',
        },
      },
    },
  },
},
```

<a id="shared-settings"></a>

## Ajustes compartidos usados por Fragments

| Ruta                                                                                                           | Predeterminado y función                                   | Límites, ejemplos y referencia                                                                                                                                                                  |
| -------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `theme.pagination.*`                                                                                           | Comparte los ocho campos/valores de paginación Blog List   | Solo aparece con varias páginas; ejemplo `theme: { pagination: { windowSize: 5 } }`. Tipos/rangos/ejemplos en [paginación](/es/blog/config-blog-list/#pagination-window) y siguientes secciones |
| `i18n.locales.<locale>.messages.blog.previous`、`next`、`paginationAria`、`jumpTo`、`jumpInputLabel`、`jumpGo` | string, texto integrado para etiquetas visibles/accesibles | Ejemplo `previous: 'Página anterior'`; consulta [textos de paginación](/es/blog/config-blog-list/#pagination-messages), no los campos homónimos de fragments                                    |
| `i18n.locales.<locale>.messages.blog.backToTop`                                                                | string, texto integrado                                    | Botón volver arriba de lista completa; ejemplo `backToTop: 'Volver arriba'`. Consulta [textos de artículos](/es/blog/config-article/#article-messages)                                          |
| `i18n.locales.<locale>.messages.home.viewAll`                                                                  | string, texto integrado                                    | Nombre accesible del archivo en pie de inicio, combinado con título de fragments; ejemplo `viewAll: 'Ver todo'`. Consulta [inicio](/es/blog/config-home/#home-messages)                         |
| `theme.math.enabled`                                                                                           | boolean / `true`                                           | Las listas solo incluyen estilos matemáticos en páginas que los necesitan. Ejemplo `theme: { math: { enabled: false } }`; consulta [matemáticas](/es/blog/config-article/#feature-switches)     |

Consulta [Giscus](/es/blog/config-comments/) para conexión/presentación. El mapping de artículos no controla asociación de fragments. Índice de contenido, OUTPUT y Red Queen no controlan estas listas, que tampoco tienen selector Cards/List de Blog List.

<a id="content-fields"></a>

## Tres campos frontmatter por fragment

Pertenecen al Markdown de `src/content/fragments/<locale>/`, **no a site.config**. El schema público tiene estos tres, sin compatibilidad adicional.

| Campo     | Tipo / predeterminado                          | Función, estado y límites                                                                                                     | Ejemplo                               |
| --------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| `id`      | string obligatoria / ninguno                   | Activo. Ocho letras/dígitos ASCII exactos, único en el idioma. Enlaces y comentarios dependen de él; consérvalo tras publicar | `id: 'aB3dE6gH'`                      |
| `pubDate` | Valor convertible a Date obligatorio / ninguno | Activo. Fecha interpretable; ordena y se muestra en UTC. Prefiere ISO con zona para evitar ambigüedad                         | `pubDate: '2026-11-13T08:00:00.000Z'` |
| `title`   | string opcional / sin definir                  | Condicional. Título opcional de tarjeta/inicio. Puede omitirse; no se genera desde el nombre de archivo                       | `title: 'Un pequeño hallazgo de hoy'` |

```md
---
id: 'aB3dE6gH'
pubDate: '2026-11-13T08:00:00.000Z'
title: 'Un pequeño hallazgo de hoy'
---

Escribe aquí el contenido. Añade imágenes y código directamente en el cuerpo Markdown.
```

`npm run new-fragment -- --locales zh,en` genera archivos con nuevo ID y hora actual compartidos. Cada ejecución crea identidad nueva. Conserva el ID al añadir traducciones. Puede coincidir entre idiomas, no dentro de uno. Los archivos pueden renombrarse; el ID no debe depender de nombre/página. Formatos antiguos no se migran automáticamente; cambiar IDs rompe identidad de comentarios/enlaces.

`description`, `heroImage`, `tags`, `draft` y `comments` individual no tienen consumidores. No copies frontmatter completo de artículos. En especial, `draft: true` no crea borrador privado; mantén lo no preparado fuera de las colecciones activas.

<a id="preview-and-links"></a>

## Conducta fija de vistas, imágenes y enlaces

No hay campos públicos adicionales para:

- **Cantidad en inicio:** últimos tres del idioma actual o menos disponibles. El pie muestra vistos/total del idioma; otros no rellenan ausentes.
- **Extracto:** obtiene texto, primera imagen HTTP(S) utilizable y primer bloque de código del HTML renderizado. Texto hasta 180 puntos Unicode; código hasta ocho líneas/800 puntos, con puntos suspensivos al recortar. Las tarjetas recortan exceso de altura; la lista conserva el contenido. Títulos separados. No es Markdown completo; no hay previewCount/previewHeight.
- **Imágenes:** archivos locales admitidos reciben dimensiones/srcset del manifiesto. No garantiza optimizar remotos/no admitidos. Primera imagen de cada página eager/high; resto lazy, todas decoding asíncrono. Consulta [imágenes](/es/blog/starter-guide-images/) para originales, variantes y validación; no necesita heroImage.
- **Enlaces estables:** `/<locale>/fragments/#<ID>`. El índice encuentra página y navega si hace falta, aun tras añadir o cambiar pageSize. Borrar/cambiar IDs pierde destino. Sin JavaScript funciona paginación, sin garantizar localización/copiar entre páginas.
- **Idiomas:** abre primera página destino, no necesariamente mismo ID.
- **Salida pública:** Markdown combinado `/<locale>/fragments/index.md`. No activa búsqueda/RSS de artículos. No publiques datos sensibles.

Recursos de avatar, hover, bordes y altura de código no son campos site.config. Vuelve al [índice](/es/blog/config-reference/) para opciones compatibles.
