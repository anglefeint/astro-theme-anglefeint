---
tags: ['anglefeint', 'starter']
title: 'Guía 5: Publicar fragmentos'
description: 'Publica ideas breves en Markdown con comentarios opcionales en un diálogo.'
pubDate: '2026-11-11'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
updatedDate: '2026-11-12'
---

Desde 0.33.2, Fragments comparte el botón de volver arriba de los artículos: aparece al desplazarse y respeta la preferencia de movimiento reducido. No requiere configuración.

Si ya tienes un blog, actualiza primero al tema 0.29.0 o posterior:

```bash
npx @anglefeint/astro-theme@latest upgrade
```

Añade estos campos al theme existente de `src/site.config.ts`. Fragmentos y comentarios están desactivados por defecto. El menú aparece debajo de Decoder Lab.

```ts
theme: {
  fragments: { enabled: true, pageSize: 20, comments: { enabled: false } },
},
```

Tras activarlo, visita `/<locale>/fragments/`. `pageSize` admite enteros de 1 a 100. Los archivos usan `.md`; no se filtran borradores ni fechas futuras, así que guarda los fragmentos aún no publicados fuera de `src/content/fragments/`.

Crea esqueletos del mismo fragmento en todos los idiomas habilitados:

La generación predeterminada para todos los idiomas habilitados requiere el tema 0.31.0 o posterior. Actualiza primero; en 0.29–0.30, indica `--locales` explícitamente.

```bash
npx @anglefeint/astro-theme@latest new-fragment
```

Como `new-post`, por defecto crea esqueletos para todos los idiomas habilitados del proyecto con un mismo ID y fecha y hora; no traduce el contenido. Prioridad: `--locales` → `ANGLEFEINT_LOCALES` → idiomas habilitados. Las listas explícitas eliminan espacios y duplicados y se convierten a minúsculas; omiten la lectura de configuración y crean solo los directorios solicitados, sin habilitar idiomas en la configuración.

Los starters nuevos también ofrecen `npm run new-fragment`; los proyectos existentes pueden usar npx sin añadir scripts.

```bash
npx @anglefeint/astro-theme@latest new-fragment --locales en,zh
npx @anglefeint/astro-theme@latest new-fragment --locales es
```

Edita el Markdown generado en `src/content/fragments/<locale>/`. El título es opcional:

Para añadir una traducción después, copia el Markdown original a la carpeta del idioma, conserva id y traduce el cuerpo.

```md
---
id: 'q8Lm3XzP'
pubDate: 2026-11-11T08:30:00+08:00
---

Fragmentos.
```

Conserva id al editar o renombrar. Solo las traducciones del mismo fragmento comparten ID. Duplicados en un idioma impiden compilar. pubDate incluye hora y zona; se muestra en UTC y se ordena del más reciente al más antiguo.

Activa `theme.fragments.comments.enabled` y completa repo, repoId, category y categoryId en `theme.comments` con los valores de Giscus. Consulta la Guía 4. Los comentarios de artículos pueden seguir desactivados. [Giscus](https://giscus.app/) · [4](../starter-guide-4-giscus-comments/)

```ts
theme: {
  fragments: { enabled: true, comments: { enabled: true } },
  comments: {
    repo: 'yourname/your-repository',
    repoId: 'R_...',
    category: 'Your category',
    categoryId: 'DIC_...',
  },
},
```

Se usa specific, coincidencia estricta y `fragment/<id>`. Se ignoran mapping, term, number, shareAcrossLocales y lang de artículos; la interfaz sigue el idioma de página. Traducciones con igual ID comparten comentarios y reacciones. No cambian las discusiones de artículos. El cliente de comentarios se carga en el primer clic. Cerrar oculta el diálogo; al volver a abrirlo o cambiar de fragmento se reutiliza la misma instancia.

Publicación estática: edita Markdown, compila y despliega. No hay formulario de publicación en línea. No se incluye en búsqueda de artículos, RSS ni exportación Markdown de artículos. Usa imágenes en `public/images/` mediante `/images/...`.

Actualiza al tema 0.29.0 o posterior y activa la configuración. Se conservan contenido, configuración, música e imágenes personales. Las guías personales no se sobrescriben: consulta el demo actual. No se fusionan ni eliminan discusiones de GitHub.

Los comentarios se cargan remotamente. La indicación de carga permanece hasta que Giscus esté listo; un error o 15 segundos de espera muestra Reintentar. Revisa la red o la configuración. El diálogo reutiliza la integración Giscus de los artículos; no hace falta instalar otro paquete npm de Giscus y sus asociaciones no cambian.

```bash
npm run build
```

Mejora de paginación desde 0.32.0: los fragmentos comparten con Blog los números de página, los estilos de neón y el salto de página que aparece según el umbral configurado. `theme.pagination` controla ambas listas; `theme.fragments.pageSize` sigue definiendo por separado los fragmentos por página.

## Enlaces estables para compartir (0.32.0+)

Función de compartir desde 0.32.0: la fecha enlaza al fragmento dentro de la lista y tiene un control para copiar el enlace al lado. Comparte `/es/fragments/#ID`, con el id del frontmatter Markdown. Solo si el fragmento no está en la página actual se carga un pequeño índice estático por idioma para ir a su página. Reconstruye tras añadir contenido o cambiar fechas o pageSize, conservando los ID. La localización entre páginas y la copia requieren JavaScript.

La dirección de navegación puede incluir un número de página; comparte mediante la fecha o el control de copia. Las páginas antiguas que aún existen corrigen anclas desactualizadas; un número de página eliminado sigue mostrando el 404 normal del sitio. Esta función no intercepta páginas 404.

Si falta el fragmento o falla la red, se muestra un aviso sin saltos repetidos. Si el portapapeles está bloqueado, aparece un enlace seleccionable para copiar manualmente. Esta función requiere el tema 0.32.0 o posterior; actualiza antes de usar la localización automática.

## Imagen predeterminada y IDs cortos de Fragment (0.33.0+)

Añade site.ogImage a la configuración site existente en src/site.config.ts. Acepta una ruta desde public (/images/share.jpg corresponde a public/images/share.jpg) o una URL HTTPS. Si queda vacío, se usa la imagen Anglefeint incluida de 1200×630. Fragments y todos sus enlaces #ID comparten esta imagen. Las imágenes propias y generadas de los artículos conservan la prioridad; con la generación desactivada, la portada del artículo también precede a la imagen del sitio. Reconstruye y despliega después de cambiarla; las plataformas pueden mantener la vista previa en caché.

```ts
export const THEME_CONFIG = defineThemeConfig({
  site: { ogImage: '/images/share.jpg' },
});
```

new-fragment genera un Nano ID de ocho letras y dígitos, distingue mayúsculas y minúsculas, comprueba los IDs Markdown de todos los idiomas y reintenta las colisiones. Una ejecución comparte ID y fecha entre idiomas. Solo se aceptan IDs alfanuméricos de exactamente ocho caracteres. Los UUID e IDs largos antiguos no están admitidos: elimina y vuelve a publicar las entradas; no hay migración ni compatibilidad de enlaces antiguos. Conserva el nuevo ID publicado; cambiarlo crea otra asociación de comentarios.
