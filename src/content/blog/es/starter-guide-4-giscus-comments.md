---
tags: ['anglefeint', 'starter']
title: 'Guía 4: Configurar comentarios Giscus'
description: 'Guía 4: Configurar comentarios Giscus'
pubDate: '2026-11-10'
updatedDate: '2026-11-10'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

Integra los siguientes campos de `theme.comments` en el objeto `defineThemeConfig({...})` existente de `src/site.config.ts`. Conserva los demás ajustes y evita duplicar las claves `theme` o `comments`.

`shareAcrossLocales: false` — `mapping: 'pathname'`

## Guía de comentarios

En la [configuración de Giscus](https://giscus.app/), prepara un repositorio público de GitHub, activa Discussions, instala la aplicación y elige una categoría. Obtén los ID reales de repositorio/categoría de la configuración generada:

```ts
theme: {
  comments: {
    enabled: true,
    repo: 'yourname/your-repository',
    repoId: 'REPLACE_WITH_REPO_ID',
    category: 'Announcements',
    categoryId: 'REPLACE_WITH_CATEGORY_ID',
    mapping: 'pathname',
    lang: '',
  },
},
```

Sustituye ambos `REPLACE_WITH_...` y utiliza el nombre real de la categoría. Rellena solo la configuración del tema; no pegues el script completo de Giscus en cada artículo.

Los comentarios aparecen en los artículos. Si falta alguno de los cuatro campos principales de repo/categoría, no se renderizan. Los valores de ejemplo no son una configuración válida. `lang: ''` sigue el idioma del artículo (`zh` pasa a `zh-CN`); por defecto está fijado a `en`.

Conserva `mapping: 'pathname'` para asociar discusiones a las rutas. `specific` necesita un `term` no vacío; `number` necesita un entero positivo escrito como cadena en `number`. La ausencia o invalidez de esos parámetros en tales modos provoca errores.

Comprueba el final del artículo. Si no aparecen, revisa ID, permisos del repositorio, conexión y bloqueos del navegador. Opciones como `inputPosition`, `theme` y `reactionsEnabled` pueden conservar sus valores predeterminados. `strict` y `reactionsEnabled` usan cadenas `'0'` / `'1'`.

## Compartir comentarios entre traducciones

Los comentarios y la opción de compartir están desactivados por defecto. Para comentarios por ruta, usa la configuración anterior. Para compartir una discusión entre traducciones, conserva los datos del repositorio y categoría y sustituye las opciones de asociación por:

```ts
theme: {
  comments: {
    // Conserva tus valores de enabled, repo, repoId, category y categoryId.
    shareAcrossLocales: true,
    mapping: 'specific',
    term: '',
    number: '',
    strict: '1',
    lang: '',
  },
},
```

Compartir exige mapping specific, term y number vacíos y strict como cadena 1. Cada artículo proporciona a data-term su slug completo sin idioma. Las nueve traducciones usan cypherpunk-ideals-ai-and-the-future-of-crypto; guides/setup y other/setup siguen siendo discusiones distintas. Un slug ausente provoca un error. Las traducciones deben tener el mismo slug. lang vacío sigue el idioma de la página; un valor explícito lo fija. No se traducen los mensajes: se comparten discusión y reacciones.

Sin compartir, mapping, term, number y strict mantienen su comportamiento: specific necesita term no vacío; number necesita un entero positivo como cadena. Con comentarios y uso compartido activos, mapping incompatible, term/number no vacíos o strict distinto de 1 generan un error claro. Comprueba dos traducciones y otro artículo. Comentar requiere autorización de GitHub. Integra los campos en comments sin sustituir otros ajustes.

No se fusionan, trasladan ni eliminan discusiones existentes automáticamente. Activar esta opción puede asociar otra discusión y los comentarios antiguos no aparecerán allí. Guarda mapping, term, number y strict antes de cambiar. Para restaurar la asociación, usa shareAcrossLocales: false y recupera los valores originales. Si necesitas trasladar comentarios, revísalos y gestiónalos manualmente en GitHub; el tema no los migra.

En un starter integrado existente, actualiza primero a una versión del tema que incluya esta opción. Tras cambiar la configuración, reconstruye y despliega; comprueba los comentarios en la vista previa de producción.

```bash
npx @anglefeint/astro-theme@latest upgrade
npm run build
npm run preview
```

[← Guía 3](/es/blog/starter-guide-3-comments-about-and-theme-toggles/)
