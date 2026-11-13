---
tags: ['anglefeint', 'config']
title: 'Referencia de configuración: detalle de artículos'
subtitle: 'Controles, frontmatter, OUTPUT y textos'
description: 'Tipos, valores, límites y ejemplos de artículos, incluidos campos de compatibilidad o sin uso.'
pubDate: '2026-11-13'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/ai-02.webp'
---

**Nota de versión:** La respuesta en vivo al movimiento reducido y la coherencia entre autor y clave de imagen social requieren 0.36.1 o posterior; no están en 0.36.0.

[Vuelve al índice](/es/blog/config-reference/). Distingue archivos: funciones/textos globales en `src/site.config.ts`; títulos, fechas, imágenes y estadísticas individuales en frontmatter Markdown/MDX. No los intercambies.

Describe rutas estándar del paquete. En idiomas activos proporcionan índice, estadísticas, traducciones y hasta tres entradas más según contenido. Llamadas BlogPost personalizadas deben aportar props pertinentes, no esperan toda la conducta de rutas automáticamente.

## 1. Controles globales

<a id="feature-switches"></a>

Son `boolean` de theme en site.config, `true` por defecto. Cada fila incluye ejemplo para combinar. Elige según necesidad; no aconseja apagar todo.

| Ruta completa                  | Función y condiciones                                                                                  | Límites y ejemplo                                                                                                         |
| ------------------------------ | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| `theme.toc.enabled`            | Índice por defecto desde encabezados Markdown de segundo/tercer nivel del compilador; oculto sin ellos | toc: true/false individual prima. No recoge HTML interno/componentes automáticamente. Ejemplo `toc: { enabled: false }`   |
| `theme.math.enabled`           | Matemáticas Markdown/MDX; estilos solo si el cuerpo tiene marcadores                                   | Global sin control por artículo. Expresiones inválidas fallan; apagar cambia análisis. Ejemplo `math: { enabled: false }` |
| `theme.effects.enableRedQueen` | Monitor Red Queen junto a artículos                                                                    | false no quita red de fondo, Canvas de portada ni atmósfera IA. Ejemplo `effects: { enableRedQueen: false }`              |
| `theme.search.enabled`         | Entrada e índice de búsqueda. Consulta [búsqueda](/es/blog/config-search/#enabled)                     | search: false excluye artículo; true no supera global apagado. Ejemplo `search: { enabled: false }`                       |
| `theme.tags.enabled`           | Enlaces y directorio/lista de etiquetas                                                                | false no borra tags. Ejemplo `tags: { enabled: false }`; [alcance](/es/blog/config-blog-list/#tags-enabled)               |
| `theme.socialImage.enabled`    | Imágenes automáticas 1200×630 sin ogImage explícita                                                    | false conserva ogImage y usa portada/sitio; no oculta portadas. Ejemplo `socialImage: { enabled: false }`                 |

Condicionados por contenido, regiones y prioridades. Por ejemplo, desactiva índice manteniendo lo demás:

```ts
theme: { toc: { enabled: false } },
```

Los terceros niveles se anidan bajo segundos; terceros sueltos también entran. Cuarto y más no. El cuerpo aparece directamente; el índice no es requisito de carga.

## 2. Autor, créditos, imagen compartida y comentarios relacionados

<a id="shared-controls"></a>

Pertenecen a módulos compartidos; aquí solo su efecto en artículos:

| Ruta completa              | Efecto en artículos                                                                  | Referencia principal                                           |
| -------------------------- | ------------------------------------------------------------------------------------ | -------------------------------------------------------------- |
| `site.author`              | Autor de respaldo si falta/vacío; también imagen automática                          | [Identidad](/es/blog/config-site-chrome/#identity)             |
| `theme.enableAboutPage`    | Con About activo y autor igual al global, enlaza About localizado; si no texto plano | [Control About](/es/blog/config-about/#page-enabled)           |
| `theme.footer.showCredits` | Crédito en imágenes automáticas, no modifica propias                                 | [Pie](/es/blog/config-site-chrome/#footer)                     |
| `site.ogImage`             | Respaldo de imagen sin otra prioritaria                                              | [Identidad y prioridad](/es/blog/config-site-chrome/#identity) |
| `theme.comments.enabled`   | Requiere conexión completa y mapping válido. Sin control individual frontmatter      | [Giscus](/es/blog/config-comments/#controls)                   |

## 3. Campos por artículo: no site.config

<a id="frontmatter"></a>

Son los 22 campos frontmatter, no claves nuevas site.config. Tipos parten de entrada del autor; fechas se convierten en Date e imágenes locales en metadatos.

### Contenido y metadatos

| Campo         | Tipo y comportamiento predeterminado                         | Función, límites y ejemplo                                                                                            |
| ------------- | ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| `title`       | string obligatoria, sin predeterminado                       | Título/metadatos, no nombre global. Ejemplo `title: 'Mis notas'`                                                      |
| `description` | string obligatoria, sin predeterminado                       | Metadescripción y contexto si context omitido, no cuerpo. Ejemplo `description: 'Notas de una sesión de depuración.'` |
| `pubDate`     | Fecha interpretable obligatoria, sin predeterminado          | Fecha, orden y metadatos. UTC en detalle; futuro no oculta. Ejemplo `pubDate: '2026-11-13'`                           |
| `updatedDate` | Fecha opcional, sin definir                                  | Fecha visible/prioridad sitemap, no orden pubDate. Ejemplo `updatedDate: '2026-11-14'`                                |
| `author`      | string opcional; falta/vacía usa autor global                | No crea página de autor. Ejemplo `author: 'Autor invitado'`                                                           |
| `subtitle`    | string opcional, sin definir                                 | Subtítulo visible, no repetido si igual a context. Ejemplo `subtitle: 'Del síntoma a la causa'`                       |
| `context`     | string opcional; omitida usa description                     | Contexto bajo título. Vacío oculta línea sin borrar meta. Ejemplo `context: 'Resolver un problema concreto.'`         |
| `tags`        | Array string opcional; sin elementos al omitir               | Depende también de tags global. Ejemplo `tags: ['astro', 'notas']`                                                    |
| `heroImage`   | Ruta de imagen local opcional; sin portada al omitir         | URLs remotas/públicas no siguen esta regla. Ejemplo `heroImage: ./cover.jpg`; prepara archivo                         |
| `ogImage`     | Imagen local/ruta pública/HTTPS opcional; respaldo al omitir | No cambia portada. Ejemplo `ogImage: /images/share.png`; prepara archivo                                              |
| `toc`         | boolean opcional; hereda índice global                       | true supera global false, pero requiere encabezados. Ejemplo `toc: false`                                             |
| `search`      | boolean opcional; true predeterminado                        | false excluye búsqueda sin ocultar artículo, RSS, sitemap ni IA. Ejemplo `search: false`                              |

Empieza con obligatorios y añade según necesidad:

```yaml
---
title: 'Mis notas'
description: 'Notas de una sesión de depuración.'
pubDate: '2026-11-13'
subtitle: 'Del síntoma al diagnóstico'
context: 'Resolver un problema concreto.'
tags: ['astro', 'notas']
toc: true
search: true
---
```

Sin controles individuales de borrador, programación, comentarios, Red Queen ni matemáticas. Mantén lo no terminado fuera. Claves desconocidas no protegen privacidad.

<a id="output-fields"></a>

### Estadísticas OUTPUT y textos de estado

| Campo        | Tipo y comportamiento predeterminado                                | Función, límites y ejemplo                                                                         |
| ------------ | ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `wordCount`  | Entero no negativo opcional; calculado del cuerpo                   | Sustitución independiente. Ejemplo `wordCount: 800`; no cambia tokenCount                          |
| `tokenCount` | Entero no negativo opcional; round(max(conteo automático, 1) × 1.3) | Estimación, no tokenizador ni uso real. Ejemplo `tokenCount: 1040`                                 |
| `aiModel`    | string opcional; sin etiqueta si falta                              | Estado y OUTPUT sin verificar modelo. Ejemplo `aiModel: 'Nombre del modelo indicado por el autor'` |
| `aiMode`     | string opcional; sin etiqueta si falta                              | Solo modo, sin ejecutar. Ejemplo `aiMode: 'notes'`                                                 |
| `aiState`    | string opcional; sin etiqueta si falta                              | Solo estado sin verificación. Ejemplo `aiState: 'edited'`                                          |

El conteo elimina parte de Markdown, código y enlaces. Ideogramas CJK, kana y coreano cuentan caracteres; otros mayormente palabras por espacios. Matemáticas y MDX influyen. wordCount no recalcula tokenCount. Desde 1.000 se muestra decimal y k sin alterar valor.

```yaml
wordCount: 800
tokenCount: 1040
aiModel: 'Nombre del modelo indicado por el autor'
aiMode: 'notes'
aiState: 'edited'
```

<a id="legacy-frontmatter"></a>

### Compatibilidad y campos sin uso actual

| Campo            | Tipo / predeterminado                      | Estado, límites y ejemplo                                                                                                              |
| ---------------- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| `readMinutes`    | Entero positivo opcional, sin definir      | Solo compatibilidad; no muestra tiempo. `readMinutes: 3` no lo restaura                                                                |
| `aiLatencyMs`    | Entero no negativo opcional, sin definir   | Solo compatibilidad; no muestra latencia. `aiLatencyMs: 150` no mide                                                                   |
| `aiConfidence`   | Número 0–1 opcional, sin definir           | Solo compatibilidad; no muestra confianza. `aiConfidence: 0.9` no evalúa precisión                                                     |
| `canonicalTopic` | string opcional, sin definir               | Sin uso actual. `canonicalTopic: 'astro'` no crea tema ni cambia canonical                                                             |
| `sourceLinks`    | Array de direcciones opcional, sin definir | Solo valida/normaliza HTTP(S), añade https a dominios. `sourceLinks: ['https://example.com/']` no muestra referencias ni exporta texto |

Pon referencias Markdown en el cuerpo para mostrarlas. Aceptar campos antiguos no implica conservar interfaz ni exige borrarlos para actualizar.

## 4. Textos de interfaz de artículos

<a id="article-messages"></a>

Prefijo `i18n.locales.<locale>.messages.blog`. Todos strings opcionales con resolución normal. Tabla chino simplificado / inglés. Ejemplos son miembros del objeto blog, no frontmatter.

Los activos dependen de zona visible. Vacío puede quitar etiqueta sin función; conserva nombres accesibles. Los sin uso no tienen efecto.

| Campo                | Predeterminado chino simplificado / inglés | Función y límites                                              | Estado         | Ejemplo de miembro                                |
| -------------------- | ------------------------------------------ | -------------------------------------------------------------- | -------------- | ------------------------------------------------- |
| `rqBadge`            | 监视器信号 / monitor feed                  | Insignia requiere Red Queen; no monitorización real            | Condicional    | `rqBadge: "Señal del monitor"`                    |
| `rqReplayAria`       | 重放监视器信号 / Replay monitor feed       | Nombre accesible de repetición, no cambia recursos/estrategia  | Condicional    | `rqReplayAria: "Repetir señal del monitor"`       |
| `backToTop`          | 返回顶部 / Back to top                     | Nombre accesible volver arriba; depende de scroll              | Condicional    | `backToTop: "Volver arriba"`                      |
| `toastP10`           | 语境解析 10% / context parsed 10%          | Aviso temprano de lectura, no progreso IA                      | Condicional    | `toastP10: "Contexto analizado al 10 %"`          |
| `toastP30`           | 语境解析 30% / context parsed 30%          | Progreso de lectura, no análisis semántico                     | Condicional    | `toastP30: "Contexto analizado al 30 %"`          |
| `toastP60`           | 推理稳定 60% / inference stable 60%        | Progreso de lectura, no inferencia de modelo                   | Condicional    | `toastP60: "Inferencia estable al 60 %"`          |
| `toastDone`          | 输出完成 / output finalized                | Fin de lectura, no prueba de generación/validación             | Condicional    | `toastDone: "Salida completada"`                  |
| `metaPublished`      | 发布 / published                           | Etiqueta de publicación, no cambia fecha                       | Condicional    | `metaPublished: "Publicado"`                      |
| `metaAuthor`         | 作者 / by                                  | Etiqueta de autor, no valor                                    | Condicional    | `metaAuthor: "Autor"`                             |
| `metaUpdated`        | 更新 / updated                             | Etiqueta de actualización; requiere updatedDate                | Condicional    | `metaUpdated: "Actualizado"`                      |
| `systemStatusAria`   | 模型状态 / Model status                    | Nombre accesible del estado; necesita algún campo              | Condicional    | `systemStatusAria: "Estado del modelo"`           |
| `systemModelLabel`   | 模型 / model                               | Etiqueta de modelo con aiModel, también OUTPUT                 | Condicional    | `systemModelLabel: "Modelo"`                      |
| `systemModeLabel`    | 模式 / mode                                | Etiqueta de modo; requiere aiMode                              | Condicional    | `systemModeLabel: "Modo"`                         |
| `systemStateLabel`   | 状态 / state                               | Etiqueta de estado; requiere aiState                           | Condicional    | `systemStateLabel: "Estado"`                      |
| `promptContextLabel` | 语境 / Context                             | Etiqueta de contexto; requiere no vacío                        | Condicional    | `promptContextLabel: "Contexto"`                  |
| `heroMonitor`        | 神经监视器 / neural monitor                | Texto de monitor de portada; necesita heroImage                | Condicional    | `heroMonitor: "Monitor neuronal"`                 |
| `heroSignalSync`     | 信号同步中 / signal sync active            | Texto decorativo estático, no comprueba sincronización         | Condicional    | `heroSignalSync: "Sincronizando señal"`           |
| `heroModelOnline`    | 模型在线 / model online                    | Texto decorativo estático, no comprueba servicio               | Condicional    | `heroModelOnline: "Modelo conectado"`             |
| `toc`                | 文章目录 / On this page                    | Nombre de índice, con control y encabezados válidos            | Condicional    | `toc: "Índice de entradas"`                       |
| `responseOutput`     | 输出 / Output                              | Nombre de barra OUTPUT; no controla contenido                  | Condicional    | `responseOutput: "Salida"`                        |
| `statsWords`         | 词 / words                                 | Etiqueta de palabras, no valor                                 | Condicional    | `statsWords: "Palabras"`                          |
| `statsTokens`        | 令牌 / tokens                              | Etiqueta de tokens, no estimación                              | Condicional    | `statsTokens: "Tokens"`                           |
| `copySectionLink`    | 复制本节链接 / Copy section link           | Nombre accesible de copiar enlace h2/h3; no cambia ancla       | Condicional    | `copySectionLink: "Copiar enlace a esta sección"` |
| `regenerate`         | 重播扫描 / Replay scan                     | Texto de repetir escaneo, solo visual                          | Condicional    | `regenerate: "Repetir escaneo"`                   |
| `relatedAria`        | 相关文章 / Related posts                   | Nombre accesible de relacionados; necesita otros               | Condicional    | `relatedAria: "Entradas relacionadas"`            |
| `related`            | 相关文章 / Related                         | Título relacionado, no cambia lógica                           | Condicional    | `related: "Entradas relacionadas"`                |
| `backToBlogAria`     | 返回博客 / Back to blog                    | Nombre accesible para volver al blog                           | Condicional    | `backToBlogAria: "Volver al blog"`                |
| `backToBlog`         | 返回博客 / Back to blog                    | Texto visible para volver, no destino                          | Condicional    | `backToBlog: "Volver al blog"`                    |
| `comments`           | 评论 / Comments                            | Nombre accesible de comentarios; requiere configuración válida | Condicional    | `comments: "Comentarios"`                         |
| `metaReadMinutes`    | 分钟阅读 / min read                        | Sin uso; no restaura lectura                                   | Sin uso actual | `metaReadMinutes: "minutos de lectura"`           |
| `latencyLabel`       | 延迟估计 / latency est                     | Sin uso; no restaura latencia                                  | Sin uso actual | `latencyLabel: "Latencia estimada"`               |
| `confidenceLabel`    | 置信度 / confidence                        | Sin uso; no restaura confianza                                 | Sin uso actual | `confidenceLabel: "Confianza"`                    |

Etiquetas de estado, portada y avisos crean ambiente, no miden salud de modelos, red ni exactitud. regenerate solo repite escaneo visual sin reescribir ni pedir IA.

Por ejemplo, cambia OUTPUT y copia de sección:

```ts
i18n: {
  locales: {
    es: {
      messages: {
        blog: {
          responseOutput: 'Contenido',
          statsWords: 'Palabras',
          statsTokens: 'Tokens estimados',
          copySectionLink: 'Copiar la dirección de esta sección',
          regenerate: 'Repetir el efecto de escaneo',
        },
      },
    },
  },
},
```

Volver al blog sigue a lista del idioma. Relacionados son hasta tres recientes del mismo idioma excluyendo actual, sin ranking IA ni campos de cantidad/similitud. related/relatedAria solo cambian textos/accesibilidad.

<a id="interaction-messages"></a>

### Textos de copia y vista de imagen

Prefijo `i18n.locales.<locale>.messages`. Strings opcionales condicionales; no cambian permisos, fuentes ni crean control de función.

| Sufijo de ruta       | Predeterminado chino simplificado / inglés                          | Función y límites                                  | Ejemplo de miembro                                                             |
| -------------------- | ------------------------------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------ |
| `codeCopy.copy`      | 复制代码 / Copy code                                                | Texto de copiar código, no cambia contenido        | `codeCopy: { copy: "Copiar código" }`                                          |
| `codeCopy.copied`    | 已复制 / Copied                                                     | Éxito al copiar código/enlace de sección           | `codeCopy: { copied: "Copiado" }`                                              |
| `codeCopy.failed`    | 复制失败，请手动选择代码。 / Copy failed. Select the code manually. | Fallo de copia, no concede permiso de portapapeles | `codeCopy: { failed: "No se pudo copiar; selecciona el código manualmente." }` |
| `imagePreview.open`  | 查看大图 / View image                                               | Nombre accesible de entrada/diálogo de vista       | `imagePreview: { open: "Ver imagen ampliada" }`                                |
| `imagePreview.close` | 关闭图片预览 / Close image preview                                  | Nombre accesible de cerrar; no cambia fuente       | `imagePreview: { close: "Cerrar vista de imagen" }`                            |

```ts
i18n: {
  locales: {
    es: {
      messages: {
        codeCopy: { copy: 'Copiar contenido', copied: 'Contenido copiado', failed: 'No se pudo copiar; selecciona el contenido manualmente.' },
        imagePreview: { open: 'Ampliar esta imagen', close: 'Cerrar imagen' },
      },
    },
  },
},
```

Copiar sección solo se adjunta a h2/h3 del cuerpo con ID y reutiliza codeCopy.copied/failed. Copia y vista requieren JavaScript. Vista normal excluye portadas e imágenes en enlaces/botones y usa fuente ya elegida, no original aparte. Ninguna tiene enabled site.config.

## 5. Límites actuales y verificación

La página del artículo responde a cambios de la preferencia del sistema de movimiento reducido sin recargar. Al activarla, la portada y la red de fondo quedan estáticas y Red Queen se detiene y oculta; al desactivarla, los efectos vuelven con sus tiempos de inicio habituales. No se reinicia el progreso de lectura ni se vuelven a enlazar copia de código, enlaces de sección o vistas previas. No hay un nuevo interruptor site.config.

Cuerpo y panel aparecen directamente y quedan estáticos. Redes de fondo, luces del título y portada son independientes. Sin controles públicos globales de escena IA, duración de entrada, respiración, cantidad relacionada, vista de imagen ni copia. Claves arbitrarias no los activan.

locale, articleSlug, headings, filePath, related, localeHrefs y seoLocaleHrefs son props BlogPost, no site.config/frontmatter. Rutas estándar los suministran; entradas normales no los configuran manualmente.

En dev revisa contenido con/sin encabezados y portadas, copia, enlaces de sección y vistas. Búsqueda en preview compilado. Antes de publicar, detén dev, npm run doctor y npm run preview. No repitas check/build tras éxito; producción cambia al desplegar.

Consulta [instalación/actualización](/es/blog/starter-guide-1-configure-your-site/), [escribir entradas](/es/blog/starter-guide-2-languages-and-routing/) y [despliegue](/es/blog/starter-guide-deployment/).
