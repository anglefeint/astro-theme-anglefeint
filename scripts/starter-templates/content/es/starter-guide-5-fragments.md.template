---
tags: ['anglefeint', 'starter']
title: 'Guía 5: Publicar fragmentos'
description: 'Publica ideas breves en Markdown con comentarios opcionales en un diálogo.'
pubDate: '2026-11-11'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

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

Crea un fragmento en el idioma predeterminado:

```bash
npx @anglefeint/astro-theme@latest new-fragment
```

--locales en,zh crea archivos con un mismo ID, sin traducir. Solo admite idiomas habilitados. El starter nuevo también ofrece npm run new-fragment; los usuarios existentes pueden usar npx sin añadir scripts.

Edita el Markdown generado en `src/content/fragments/<locale>/`. El título es opcional:

Para añadir una traducción después, copia el Markdown original a la carpeta del idioma, conserva id y traduce el cuerpo.

```md
---
id: 550e8400-e29b-41d4-a716-446655440000
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
