---
tags: ['anglefeint', 'starter']
title: 'Guía 2: escribir tu primera entrada'
subtitle: 'Crear, escribir y previsualizar contenido'
description: 'Crea una entrada con el flujo predeterminado y aprende frontmatter, etiquetas, código, fórmulas e imágenes.'
pubDate: '2026-03-07'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/cyber-03.webp'
---

Esta es la parte 2 de 8. [Consulta el orden completo](/es/blog/starter-guide-1-configure-your-site/#tutorial-order) · [Busca campos de configuración](/es/blog/config-reference/).

Tras la [instalación y configuración del sitio](/es/blog/starter-guide-1-configure-your-site/), escribir consiste sobre todo en editar archivos de `src/content/blog/`. Pon título, fecha y demás datos de cada entrada en su frontmatter inicial. El nombre del sitio, el autor predeterminado y los controles globales siguen en `src/site.config.ts`.

Crea y previsualiza primero una entrada con el flujo predeterminado; elige idiomas después si hace falta. Consulta la referencia de campos cuando la necesites.

## 1. Crear una entrada con el flujo predeterminado

Desde la raíz del proyecto, donde está `package.json`, ejecuta:

```bash
npm run new-post -- my-first-post
```

Si ya lo hiciste en el primer tutorial, abre el archivo existente y continúa escribiendo. Los archivos existentes se omiten, no se sobrescriben.

Sin `--locales` ni `ANGLEFEINT_LOCALES`, crea `src/content/blog/<语言代码>/my-first-post.md` para cada idioma activo. La configuración inicial activa nueve idiomas y crea nueve estructuras; si cambias los controles de idioma, se usa la selección actual. No traduce el cuerpo.

Elige el archivo de idioma que quieras editar. Su dirección es `/<语言代码>/blog/my-first-post/` y su lista `/<语言代码>/blog/`. Por ejemplo, inglés usa `/en/blog/my-first-post/` y chino `/zh/blog/my-first-post/`, siempre que estén activos. No necesitas crear rutas manualmente.

`my-first-post` es el slug. Usa minúsculas, números y guiones, como `learning-astro-1`; no se permiten espacios, guiones bajos ni `/`. Cambiar el nombre cambia la URL sin redirigir automáticamente la anterior.

El comando añade título, descripción, fecha UTC actual y cuerpo de ejemplo. Si `src/assets/blog/default-covers/` tiene imágenes WebP, PNG o JPEG, elige además una portada al azar. Sin imágenes, omite `heroImage`; no descarga una portada. Sustituye después textos, fecha e imagen.

### Crear solo determinados idiomas

Son alternativas opcionales al comando predeterminado. zh crea solo chino; en,zh crea inglés y chino. No necesitas ejecutar todos los ejemplos:

```bash
# 只创建中文
npm run new-post -- my-first-post --locales zh

# 创建英文和中文
npm run new-post -- my-first-post --locales en,zh
```

Sin `--locales` se usan los idiomas activos, salvo que exista `ANGLEFEINT_LOCALES`. Prioridad completa: `--locales` → `ANGLEFEINT_LOCALES` → idiomas activos. Los archivos nuevos de una ejecución comparten portada; los existentes no cambian.

El comando crea archivos sin traducir ni activar idiomas. Pon las traducciones en su directorio de idioma con el mismo slug. El menú de idioma abre la traducción equivalente si existe; si no, abre la lista de entradas del idioma de destino.

## 2. Definir título, descripción y fechas

Abre el archivo generado. El frontmatter YAML está entre las dos primeras líneas `---`; después viene el cuerpo. Puedes empezar con este ejemplo y conservar `heroImage` si ya existe:

```md
---
title: '我的第一篇文章'
description: '记录我用 Anglefeint 搭建博客的过程。'
pubDate: '2026-11-13'
tags: ['astro', '笔记']
---

这是我的第一篇文章。我准备在这里记录学习过程和遇到的问题。

## 为什么开始写博客

写下自己的想法，也给以后的自己留下线索。

### 先从一个小问题开始

今天先记录安装和发布过程。
```

Sustituye la fecha por la fecha real de publicación. `title`, `description` y `pubDate` son obligatorios; `tags` es opcional. La página ya muestra el título, así que el cuerpo suele comenzar con `##` sin repetir `# 我的第一篇文章`.

- `title` aporta el título de entrada, de lista y los metadatos asociados.
- `description` aporta la presentación y los metadatos. Sin `context` explícito, también aparece bajo el título como línea de contexto.
- `pubDate` ordena las listas de más reciente a más antigua.
- Tras cambios importantes en una entrada publicada, añade un `updatedDate` veraz. Se muestra y tiene preferencia en sitemap, pero no sustituye `pubDate` para ordenar.

Usa fechas `YYYY-MM-DD` entre comillas. Para una hora exacta, usa ISO con zona, por ejemplo `'2026-11-13T09:00:00+08:00'`. Las páginas muestran fechas UTC; la conversión puede cambiar el día.

**No existe filtro de borradores ni publicación programada.** Las estructuras de otros idiomas también se hacen públicas al compilar. Termina el contenido necesario y mueve fuera de `src/content/blog/` lo que no esté listo. `draft: true`, una `pubDate` futura y `search: false` no convierten una entrada en privada.

## 3. Escribir y organizar el cuerpo con encabezados

Deja una línea vacía entre párrafos. Esta es sintaxis Markdown habitual:

```md
这是一段正文，可以使用 **加粗**、_强调_ 和 `行内代码`。

- 第一个要点
- 第二个要点

[链接文字](https://example.com/)

> 这是一段引用。
```

`##` y `###` generan automáticamente el índice de contenido. Aparece a la derecha en pantallas anchas y antes del cuerpo en estrechas. Sin encabezados de nivel dos o tres, se oculta. Los niveles más profundos pueden aparecer en el cuerpo, pero no en ese índice.

Para desactivarlo en una entrada, añade al frontmatter existente:

```yaml
toc: false
```

Omitir `toc` hereda `theme.toc.enabled` de `src/site.config.ts`, activo por defecto. `toc: true` puede imponerse al apagado global. El índice usa los encabezados Markdown que proporciona el compilador; no recoge automáticamente los generados dentro de componentes MDX o HTML/JSX sin procesar.

### Organizar entradas con etiquetas

Añade `tags: ['astro', '笔记']` al frontmatter para generar enlaces y el archivo de etiquetas del idioma sin rutas manuales. Si chino está activo, visita `/zh/tags/`.

Se distinguen mayúsculas: `Astro` y `astro` son diferentes. Se recortan espacios exteriores y los duplicados de una entrada cuentan una vez. Usa los enlaces generados: chino y caracteres especiales tienen codificación estable, no adivines las rutas. Renombrar una etiqueta cambia su enlace.

`theme.tags.enabled: false` desactiva globalmente enlaces y generación de páginas de etiquetas sin eliminar las entradas.

## 4. Insertar código y fórmulas

Usa una cerca de tres acentos graves seguida del lenguaje:

````md
```js
const message = 'Hello, world!';
console.log(message);
```
````

Los bloques reciben automáticamente un botón para copiar con saltos e indentación. Copia texto; no ejecuta JavaScript del bloque. Si el portapapeles no está disponible, muestra un error y puedes seleccionar manualmente el texto. El botón requiere JavaScript.

Las matemáticas están activas por defecto sin instalar otro plugin. Usa `$...$` en línea o una fórmula de bloque entre líneas separadas `$$`:

```md
保存量为 $C_{saved}$。

$$
\frac{a}{b} = x_1 + x_2
$$
```

Escapa un dólar literal ambiguo como `\$`; el código en línea y los bloques no cambian. KaTeX renderiza al compilar. Admite sintaxis matemática, no documentos LaTeX completos. Una fórmula inválida hace fallar la compilación con información de origen. Las fórmulas largas permiten desplazamiento horizontal.

Combina `math: { enabled: false }` dentro del `theme` existente en `src/site.config.ts` para desactivar matemáticas globalmente. Mantén títulos y descripciones como texto plano, sin depender del renderizado matemático.

### ¿Cuándo usar MDX?

Usa `.md` para escritura normal y `.mdx` para importar y renderizar componentes. El tema recoge ambas extensiones y admite matemáticas en MDX sin otro procesador.

`new-post` crea `.md`. Si hace falta, renómbralo a `.mdx` conservando el frontmatter. No mantengas `.md` y `.mdx` con el mismo nombre base como entradas distintas en un idioma: resuelven a la misma URL. Componentes y expresiones deben respetar MDX; cambiar la extensión no hace válido cualquier texto.

## 5. Añadir imágenes

Las imágenes del cuerpo pueden estar junto a la entrada o en `public/images/`. Añade el archivo real antes de referenciarlo:

```md
![照片内容的描述](./photo.jpg)

![照片内容的描述](/images/photo.jpg)
```

La primera ruta es relativa al archivo de entrada. La segunda corresponde a `public/images/photo.jpg`, omitiendo `public` de la URL. La descripción se convierte en texto alternativo.

Para cambiar la portada, coloca `cover.jpg` junto a la entrada y usa `heroImage: ./cover.jpg` en frontmatter. Acepta imágenes locales y se puede omitir. Las imágenes del cuerpo, portadas e imágenes para compartir son distintas; cambiar la portada no la inserta en el cuerpo.

Las imágenes normales del cuerpo abren una vista ampliada al pulsarlas o enfocarlas y activar Enter/Espacio. Cierra con Esc, el botón o el fondo. Se excluyen portadas e imágenes dentro de enlaces/botones. La vista usa la fuente ya elegida por el navegador; no busca un original mayor ni ofrece navegación de galería.

Tras añadir o sustituir una portada, dev o doctor local prepara archivos adaptativos. Guarda el original y todo `src/assets/blog/covers/`, incluidos manifest.json y generated/. La compilación de despliegue y doctor en CI solo los validan: fallan si faltan, están obsoletos o modificados, sin codificar en el servidor. Los derivados persistentes cubren portadas y las imágenes locales de fragments; las imágenes normales del cuerpo conservan el flujo Markdown/MDX existente.

## 6. Previsualizar localmente y preparar la publicación

Ejecuta `npm run dev` y abre `/<语言代码>/blog/my-first-post/` bajo la dirección de terminal, por ejemplo `/en/blog/my-first-post/` en inglés o `/zh/blog/my-first-post/` en chino. Revisa título, fecha, cuerpo, índice, etiquetas e imágenes. En traducciones nuevas, comprueba también el selector de idioma.

Detén dev antes de publicar y ejecuta:

```bash
npm run doctor
npm run preview
```

doctor incluye comprobaciones y compilación; tras completarlo no repitas inmediatamente check ni build. preview sirve el `dist/` compilado sin publicarlo. Resuelve los errores antes del despliegue y no publiques restos de una compilación fallida.

### ¿Por qué la búsqueda no encuentra mi entrada en dev?

El índice de texto completo se genera al compilar. `npm run dev` muestra un aviso de desarrollo en la búsqueda. Busca una frase del cuerpo en preview compilado para comprobar resultados y navegación.

Por defecto se buscan títulos y cuerpos del idioma actual. Añade `search: false` al frontmatter para excluir una entrada; omitirlo la incluye. No la quita de listas, RSS, sitemap ni enlaces públicos. `theme.search.enabled: false` desactiva tanto la entrada de búsqueda como la generación del índice.

Recompila y despliega tras cambiar contenido para actualizar la búsqueda pública. Las fórmulas y la interfaz decorativa no son texto del índice.

Consulta tipos, valores y campos sin uso en el [diccionario de artículos](/es/blog/config-article/#frontmatter). Las reglas de búsqueda están en el [diccionario de búsqueda](/es/blog/config-search/#article-search). A continuación tienes una referencia rápida para escribir.

## Referencia opcional: otros campos de entrada

Son campos del frontmatter, no miembros de `site` o `theme` en `src/site.config.ts`. Una entrada normal no necesita rellenarlos todos.

### Zona del título e imágenes

| Campo       | Comportamiento actual                                                                                                                         |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `subtitle`  | Subtítulo opcional; no se repite si coincide con la línea de contexto.                                                                        |
| `context`   | Texto bajo el título; usa `description` por defecto. `''` lo oculta sin cambiar metadatos.                                                    |
| `author`    | Autor individual; omitido o solo espacios usa el autor del sitio.                                                                             |
| `heroImage` | Portada local opcional para listas y detalle.                                                                                                 |
| `ogImage`   | Vista previa explícita para compartir, anterior a las automáticas; acepta imagen relativa, ruta pública como `/images/share.png` o URL HTTPS. |

Sin `ogImage` se genera una imagen 1200×630 con título, autor y sitio. No sustituye la portada. `theme.socialImage.enabled: false` impide generarla automáticamente; `ogImage` explícita sigue funcionando y las demás entradas usan portada o imagen global. Recompila y despliega tras cambios; las plataformas pueden conservar imágenes antiguas en caché.

### Estadísticas OUTPUT y textos de estado opcionales

| Campo               | Comportamiento actual                                                      |
| ------------------- | -------------------------------------------------------------------------- |
| `wordCount`         | Sustituye el conteo automático de palabras/caracteres; entero no negativo. |
| `tokenCount`        | Sustituye independientemente la estimación de tokens; entero no negativo.  |
| `aiModel`           | Etiqueta de modelo aportada por el autor en estado del título y OUTPUT.    |
| `aiMode`, `aiState` | Modo y estado aportados por el autor en la zona de estado del título.      |

Sin sustituciones, los conteos se estiman a partir del código del cuerpo: caracteres Han, kana y Hangul cuentan individualmente; el resto se divide principalmente por espacios. Los tokens por defecto son `round(max(自动字词数, 1) × 1.3)`, una estimación, no un tokenizador real. Cambiar `wordCount` no recalcula tokens; cambia ambos si hace falta.

Se elimina parte del Markdown, pero no es un conteo completo de prosa visible: fórmulas y código MDX pueden influir. Valores desde 1.000 se muestran con un decimal y `k`. Modelo, modo y estado solo muestran texto: no conectan IA, verifican autoría ni ejecutan tareas.

### Compatibilidad y campos sin efecto visual actual

- `readMinutes`, `aiLatencyMs`, `aiConfidence`: se aceptan por compatibilidad, pero ya no se muestran tiempo de lectura, latencia ni confianza. Sus tipos siguen siendo entero positivo, entero no negativo y número 0–1, respectivamente. No los necesitas en entradas nuevas.
- `canonicalTopic`: admite string, sin conexión con páginas, canonical ni exportaciones; no crea temas ni cambia URLs.
- `sourceLinks`: admite arrays de URLs, HTTP(S) y añade `https://` a dominios sin protocolo. Actualmente solo valida datos; no muestra fuentes ni las exporta. Escribe enlaces Markdown en el cuerpo para mostrarlos.

Los campos personalizados no admitidos no crean funciones automáticamente: `draft` no crea borradores. Prefiere los campos compatibles y la sintaxis normal descrita arriba.

## Navegación de tutoriales y diccionario de configuración

[Anterior: instalar el blog y poner tus datos](/es/blog/starter-guide-1-configure-your-site/) · [Siguiente: añadir imágenes a entradas y fragments](/es/blog/starter-guide-images/) · [Los ocho tutoriales](/es/blog/starter-guide-1-configure-your-site/#tutorial-order).

Campos relacionados: [entradas, índice y OUTPUT](/es/blog/config-article/), [etiquetas y listas](/es/blog/config-blog-list/), [inclusión en búsqueda](/es/blog/config-search/). El [índice de configuración](/es/blog/config-reference/) contiene rutas completas, valores y límites.
