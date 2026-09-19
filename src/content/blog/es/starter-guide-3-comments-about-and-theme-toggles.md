---
tags: ['anglefeint', 'starter']
title: 'Guía 3: Activa y personaliza funciones opcionales'
subtitle: 'Configura música, comentarios, About, paginación, funciones e idiomas solo cuando los necesites.'
description: 'Configura música, comentarios, About, paginación, funciones e idiomas solo cuando los necesites.'
pubDate: '2026-03-07'
updatedDate: '2026-09-19'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

## Consulta los valores predeterminados antes de cambiar

Esta guía corresponde al starter 0.8.0. Integra todos los fragmentos TypeScript en el objeto `defineThemeConfig({...})` de `src/site.config.ts`. Configura solo aquello que quieras cambiar.

| Función                                                          | Estado predeterminado          |
| ---------------------------------------------------------------- | ------------------------------ |
| Búsqueda, índice, etiquetas, imágenes automáticas para compartir | Activas                        |
| Ampliación de imágenes del cuerpo y copia de código              | Automáticas; sin configuración |
| About y monitor Red Queen de los artículos                       | Activos                        |
| Música y comentarios Giscus                                      | Desactivados                   |
| Artículos recientes en inicio / artículos por página del blog    | 3 / 9                          |

## 1. Activa el reproductor de música

Coloca tu audio en `public/music/my-song.mp3` (crea la carpeta si hace falta) y añade:

```ts
theme: {
  music: {
    enabled: true,
    tracks: [
      { title: 'My Song', artist: 'Artist Name', src: '/music/my-song.mp3' },
    ],
  },
},
```

La URL no incluye `public`. Cada pista necesita `title` y `src`; `artist` es opcional. Añade más objetos a `tracks` para más canciones. También se admiten enlaces HTTPS directos a audio, pero no rutas de disco local ni páginas para compartir de servicios musicales. Evita espacios y barras invertidas y usa nombres sencillos. No se incluyen canciones.

Una lista vacía oculta el reproductor. Si está activo, un título o formato de dirección incorrecto provoca un error de configuración. Aparece en páginas con el diseño compartido del tema; no hay un interruptor por página. En escritorio está abajo a la izquierda. En móvil, cada página empieza con el reproductor contraído; al expandirlo se oculta temporalmente el botón de volver arriba.

Abre primero `/music/my-song.mp3` para comprobar el acceso y pulsa PLAY en la página. El audio se carga al realizar una acción de reproducción; abrir una página no inicia la música. Una vez iniciada, al terminar una pista se reproduce automáticamente la siguiente y, después de la última, se vuelve a la primera. Pista, posición y volumen se guardan durante la sesión de la misma pestaña. Cambiar de página pausa la reproducción; pulsa reproducir en la siguiente para continuar. No hay reproducción ininterrumpida entre páginas. Sin almacenamiento disponible se puede reproducir, pero no se garantiza recordar el estado. `enabled: false` lo desactiva.

## 2. Activa los comentarios Giscus

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

## 3. Sustituye el contenido de About

About está activo por defecto. Configura el texto por idioma sin editar la plantilla de la página:

```ts
i18n: {
  locales: {
    es: {
      about: {
        metaLine: '$ profile booted | mode: builder',
        sections: {
          who: 'Introduce yourself here.',
          what: 'Describe what you build.',
          ethos: ['Keep learning.', 'Build useful things.'],
          now: 'What you are working on now.',
          contactLead: 'Get in touch.',
          signature: '> Your signature',
        },
        contact: {
          email: 'you@example.com',
          githubUrl: 'https://github.com/yourname',
          githubLabel: 'GitHub',
        },
      },
    },
  },
},
```

El ejemplo solo cambia About en español. Completa los demás idiomas por separado: no hay traducción automática. También puedes sobrescribir `sidebar`, `labels`, `modals` y `effects`; empieza por el cuerpo y los datos de contacto. Las ventanas de herramientas de About son demostraciones interactivas del tema, no conexiones a un servicio real de IA por rellenar textos.

Visita `/es/about/` y comprueba el cuerpo y los enlaces de correo y GitHub. `theme.enableAboutPage: false` oculta la entrada del menú y detiene la generación de rutas de About. Vuelve a compilar después.

## 4. Ajusta las cantidades y la paginación

Puedes configurar solo las dos primeras cantidades. Añade `pagination` si quieres fijar su apariencia:

```ts
theme: {
  homeLatestCount: 3,
  blogPageSize: 9,
  pagination: {
    windowSize: 7,
    showJumpThreshold: 12,
    jump: { enabled: true, enterToGo: true },
    style: { enabled: true, mode: 'fixed', variants: 9, fixedVariant: 1 },
  },
},
```

`homeLatestCount` controla los artículos recientes de inicio. `blogPageSize` controla los artículos por página del blog y también se usa en las listas de etiquetas. Usa enteros positivos razonables.

`windowSize` controla la ventana de números de página, limitada por el código a 5–21; no es la cantidad de artículos. El campo para saltar aparece solo si `jump.enabled` es verdadero y el total supera `showJumpThreshold` (más de 12 páginas por defecto). `enterToGo` controla el salto con Enter.

Los modos de estilo son `fixed`, `sequential` y `random`. El ejemplo fija la variante 1. El modo predeterminado `random` selecciona una variante estable a partir del idioma, la ruta y datos de página; no cambia aleatoriamente en cada recarga. `style.enabled: false` utiliza la variante básica sin desactivar la paginación. Comprueba el pie de la lista cuando haya suficientes artículos.

## 5. Desactiva mejoras que no necesites

Estos son ajustes disponibles para desactivar funciones, no una recomendación de desactivarlas todas. Conserva solo los que quieras cambiar:

```ts
theme: {
  enableAboutPage: false,
  effects: { enableRedQueen: false },
  search: { enabled: false },
  toc: { enabled: false },
  tags: { enabled: false },
  socialImage: { enabled: false },
},
```

`enableRedQueen` controla únicamente el monitor Red Queen del artículo, no todo el tema AI ni todos los efectos. `toc` es el valor general y un artículo puede anularlo con `toc: true`. Desactivar `socialImage` no afecta al `ogImage` manual. Los ajustes de búsqueda y etiquetas afectan tanto a las entradas como a los archivos generados. Los diseños existentes determinan las cuatro atmósferas; no hay un selector global para cambiar todo el sitio entre los cuatro temas.

## 6. Añade idiomas y ajusta la URL de inicio

Por ejemplo, añade francés:

```ts
i18n: {
  locales: {
    fr: {
      meta: { label: 'Français', hreflang: 'fr', ogLocale: 'fr_FR', enabled: true, fallback: ['en'] },
      site: { hero: 'Bienvenue sur mon blog.' },
      messages: { nav: { home: 'Accueil' }, siteDescription: 'Mes notes et projets.' },
    },
  },
},
```

Después crea contenido con `npm run new-post -- french-note --locales fr`. Proporciona los textos de interfaz, presentación de inicio, About y artículos traducidos. `fallback` aporta configuración y textos ausentes; no traduce artículos ni introduce los de otros idiomas en la lista. El idioma predeterminado se añade a la cadena de respaldo cuando hace falta.

Cambia `meta.label` para renombrar un idioma en el menú; por ejemplo, `zh` muestra “简体中文” por defecto. `hreflang` / `ogLocale` son metadatos de idioma. Cambiar la etiqueta no altera el código ni la URL.

El valor predeterminado `i18n.routing.defaultLocalePrefix: 'always'` redirige `/` al inicio del idioma predeterminado. `'never'` sirve ese inicio en `/` y redirige `/<idioma-predeterminado>/` a `/`. Solo afecta a ese inicio: `/es/blog/` no pasa a ser `/blog/`.

## 7. Integra los ajustes y verifica

Por ejemplo, combina la cantidad de artículos y la música en un único objeto `theme`:

```ts
theme: {
  homeLatestCount: 5,
  music: {
    enabled: true,
    tracks: [{ title: 'My Song', src: '/music/my-song.mp3' }],
  },
},
```

Conserva ajustes existentes como `theme.comments` en ese mismo objeto. No sobrescribas toda tu configuración con un ejemplo. Las matrices se reemplazan enteras, así que conserva las canciones o enlaces anteriores al añadir entradas.

Comprueba la función en desarrollo y ejecuta `npm run check` y `npm run build`. Verifica la búsqueda con `npm run preview` tras compilar. Usa `npm run doctor` para diagnosticar problemas del proyecto o de actualización; incluye comprobaciones más amplias. Para publicar los cambios debes desplegar el nuevo resultado.

## 8. Mostrar u ocultar los créditos del pie de página

El pie muestra el año de la compilación y `site.title`. De forma predeterminada también enlaza al tema y a Astro: `© 2026 My Blog · Theme by Anglefeint · Built with Astro`. El año se genera al compilar; no es un valor fijo.

Para ocultar ambos créditos técnicos, combina este ajuste con tu configuración en `src/site.config.ts`:

```ts
export const THEME_CONFIG = defineThemeConfig({
  theme: {
    footer: { showCredits: false },
  },
});
```

Usa `showCredits: true` para volver a mostrarlos. Al ocultarlos se eliminan ambos enlaces, pero se mantiene la línea de copyright. El campo opcional `site.tagline` añade texto propio independientemente de este interruptor. Está vacío por defecto; el valor anterior `Built with Astro.` se trata como el crédito integrado para evitar duplicados. No se añade `All rights reserved`.

La demo pública utiliza su propio nombre, dominio e introducciones traducidas. Un starter nuevo conserva valores genéricos y se sigue configurando en `src/site.config.ts`. Al actualizar un starter antiguo, migra también los archivos de configuración indicados en la guía de actualización; actualizar solo el paquete npm no añade esta opción a los adaptadores antiguos.

## En esta serie

- [Guía 1: Configura tu blog](/es/blog/starter-guide-1-configure-your-site/)
- [Guía 2: Escribe y organiza el contenido](/es/blog/starter-guide-2-languages-and-routing/)
- [Guía 3: Activa y personaliza funciones opcionales](/es/blog/starter-guide-3-comments-about-and-theme-toggles/)
