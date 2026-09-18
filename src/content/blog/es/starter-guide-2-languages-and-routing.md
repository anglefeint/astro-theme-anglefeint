---
tags: ['anglefeint', 'starter']
title: 'Guía 2: Escribe y organiza el contenido'
subtitle: 'Crea artículos y utiliza portadas, etiquetas, índice, imágenes ampliadas, copia de código, búsqueda e imágenes para compartir.'
description: 'Crea artículos y utiliza portadas, etiquetas, índice, imágenes ampliadas, copia de código, búsqueda e imágenes para compartir.'
pubDate: '2026-03-07'
updatedDate: '2026-09-19'
heroImage: '../../../assets/blog/default-covers/cyber-03.webp'
---

## Escribe en los archivos de contenido

Esta guía presupone que completaste la instalación y los ajustes de la guía 1. Las funciones generales se configuran en `src/site.config.ts`; el título, las etiquetas y las opciones de un artículo van en su frontmatter, entre las dos líneas `---` al principio del Markdown. Son lugares distintos.

## 1. Crea un artículo y entiende su URL

Desde la raíz del proyecto, ejecuta:

```bash
npm run new-post -- my-first-post
```

Por defecto se crean archivos para los idiomas activos. Para crear solo la versión española, usa este comando en lugar del anterior; no ejecutes ambos:

```bash
npm run new-post -- my-first-post --locales es
```

Se crea `src/content/blog/es/my-first-post.md`, cuya URL es `/es/blog/my-first-post/`. El slug admite letras minúsculas, números y guiones, sin espacios ni guiones bajos. Los archivos existentes se omiten, nunca se sobrescriben.

`--locales` elige los archivos que se crearán, pero no activa idiomas. Las rutas siguen dependiendo de la configuración del sitio. Conserva el mismo nombre de archivo en las traducciones y redacta cada versión. Si cambias a un idioma sin traducción de ese artículo, se abre su lista de artículos.

## 2. Escribe el frontmatter y elige una portada

Coloca este frontmatter al principio del archivo y escribe el cuerpo después del segundo `---`:

```yaml
---
title: 'My first post'
description: 'What I learned while building my blog.'
pubDate: '2026-09-18'
tags: ['astro', 'notes']
---
```

`title`, `description` y `pubDate` son obligatorios. `subtitle`, `updatedDate` y `author` son opcionales; si omites el autor se utiliza el del sitio. Las listas se ordenan por `pubDate`, del más reciente al más antiguo. Actualmente no hay filtro de borradores ni publicación programada: ni `draft: true` ni una fecha futura ocultan el artículo. Guarda los textos sin terminar fuera del directorio de contenido.

Para la portada, usa `heroImage: ./cover.jpg` y coloca el archivo junto al artículo, o conserva la ruta local asignada por el comando de creación. La asignación automática solo ocurre si hay imágenes en `src/assets/blog/default-covers/`; no descarga imágenes. `heroImage` es opcional. El tiempo de lectura y otras métricas del contenido se calculan automáticamente, por lo que normalmente no necesitan valores manuales.

Son estimaciones, no mediciones obtenidas de un servicio de IA. Los valores de frontmatter `readMinutes`, `wordCount`, `tokenCount`, `aiLatencyMs` y `aiConfidence` tienen prioridad sobre el cálculo automático; omítelos para usar estimaciones. Algunos artículos de demostración contienen valores fijos como ejemplo visual.

## 3. Genera el índice con encabezados

Escribe encabezados normales de segundo y tercer nivel:

```md
## First topic

Write your explanation here.

### A closer look

Add details here.
```

El índice está activo por defecto y se genera a partir de `##` y `###`. Aparece a la derecha en pantallas amplias y antes del cuerpo en pantallas estrechas; si no hay encabezados compatibles, no aparece. Puedes probar el de esta página.

Para desactivarlo en un artículo, añade al frontmatter existente:

```yaml
toc: false
```

`toc: true` puede anular la desactivación global; si se omite, se hereda `theme.toc.enabled`. Los encabezados Markdown normales de MDX funcionan, pero no se recopilan automáticamente los generados dentro de componentes o HTML/JSX sin procesar.

## 4. Organiza los artículos con etiquetas

Añade `tags: ["astro", "notes"]` al frontmatter. No necesitas configurar etiquetas aparte ni crear rutas manualmente. La compilación genera un índice de etiquetas y listas paginadas por idioma. Tanto la entrada de etiquetas del blog como las etiquetas del artículo son enlaces; comprueba `/es/tags/`.

Se distinguen mayúsculas y minúsculas: `Astro` y `astro` son diferentes. Se eliminan espacios al principio y al final, y una etiqueta repetida en el mismo artículo cuenta una vez. Los caracteres no latinos y especiales se codifican en URL estables: usa los enlaces generados en vez de adivinarlos. Renombrar una etiqueta cambia su enlace. Los artículos sin etiquetas siguen apareciendo. `theme.tags.enabled: false` desactiva las entradas y la generación de páginas de etiquetas.

## 5. Amplía imágenes y copia código sin configurar nada

Las imágenes del cuerpo pueden estar junto al artículo o en `public/images/`. Estas son dos alternativas; añade el archivo correspondiente antes de usarlas:

```md
![A description of the image](./photo.jpg)

![A description of the image](/images/photo.jpg)
```

Haz clic en una imagen normal del cuerpo, o pulsa Enter/Espacio cuando tenga el foco, para ampliarla. Cierra con Esc, el botón de cierre o el fondo. Se excluyen las portadas y las imágenes dentro de enlaces o botones. Se usa la fuente ya seleccionada por el navegador: no se descarga automáticamente un original de mayor resolución ni se ofrece navegación por una galería.

Para el código utiliza bloques Markdown normales:

````md
```js
console.log('Hello, world!');
```
````

Aparece un botón de copia en la esquina superior derecha que conserva sangría y saltos de línea. Pruébalo en HTTPS o localhost. Si falla el acceso al portapapeles, se pide copiar manualmente. Ninguna de estas funciones requiere un interruptor adicional.

## 6. Comprueba la búsqueda tras compilar

La búsqueda está activa por defecto y consulta títulos y cuerpos de artículos del idioma actual. `npm run build` genera el índice. Ejecuta `npm run preview`, abre la búsqueda de la cabecera y busca una frase de un artículo para comprobar su enlace. `npm run dev` muestra un aviso de desarrollo, no búsqueda de texto completo en tiempo real.

Para excluir un artículo del índice, añade a su frontmatter:

```yaml
search: false
```

No es una opción de privacidad ni de borrador: el artículo sigue accesible por URL y en las listas. `theme.search.enabled: false` desactiva la entrada global y la generación del índice. Vuelve a compilar cuando cambien los artículos.

## 7. Imágenes automáticas y personalizadas para compartir

Por defecto, la compilación genera un PNG de 1200×630 para artículos sin `ogImage`, usando el título, el autor del artículo (o del sitio) y el nombre del sitio. No necesitas una API de imágenes ni diseñar cada una. Esto no cambia la portada `heroImage`.

Para elegir tu imagen, coloca `share.png` junto al artículo y añade al frontmatter:

```yaml
ogImage: ./share.png
```

También puedes usar `ogImage: /images/share.png` para `public/images/share.png`, o una URL HTTPS directa a una imagen. Si falta un archivo local habrá un error; las imágenes externas dependen del servicio que las aloja.

Un `ogImage` explícito tiene prioridad. `theme.socialImage.enabled: false` solo desactiva la generación automática: las imágenes manuales siguen funcionando, y los demás artículos usan la portada o la imagen predeterminada. Inspecciona `og:image` en el HTML compilado. Las imágenes generadas están en `dist/_social/`. Las plataformas pueden conservar en caché una vista previa antigua tras volver a publicar. La fuente incluida no garantiza todos los emojis ni sistemas de escritura.

## 8. Usa new-page para una página independiente

Por ejemplo, crea una página de presentación de proyectos:

```bash
npm run new-page -- projects --theme cyber
```

Se crea `src/pages/[lang]/projects.astro`, que genera `/<idioma>/projects/` para los idiomas activos. Edita ese archivo Astro para añadir contenido. No traduce el cuerpo ni añade automáticamente una entrada a la cabecera.

Elige un solo `--theme`: `base`, `ai`, `cyber`, `hacker` o `matrix`. Se admiten rutas anidadas como `projects/labs`, usando minúsculas, números y guiones. Una página existente produce un error: no ejecutes seguidas las cinco variantes para la misma ruta. Para artículos sigue usando `new-post`.

## En esta serie

- [Guía 1: Configura tu blog](/es/blog/starter-guide-1-configure-your-site/)
- [Guía 2: Escribe y organiza el contenido](/es/blog/starter-guide-2-languages-and-routing/)
- [Guía 3: Activa y personaliza funciones opcionales](/es/blog/starter-guide-3-comments-about-and-theme-toggles/)
