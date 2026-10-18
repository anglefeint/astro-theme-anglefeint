---
tags: ['anglefeint', 'starter']
title: 'Guía 3: Activa y personaliza funciones opcionales'
subtitle: 'Configura música, comentarios, About, paginación, funciones e idiomas solo cuando los necesites.'
description: 'Configura música, comentarios, About, paginación, funciones e idiomas solo cuando los necesites.'
pubDate: '2026-03-07'
updatedDate: 2026-10-18
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

## Consulta los valores predeterminados antes de cambiar

Esta guía corresponde al starter actual. Integra todos los fragmentos TypeScript en el objeto `defineThemeConfig({...})` de `src/site.config.ts`. Configura solo aquello que quieras cambiar.

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

En la primera visita, el audio solo se carga al pulsar PLAY. La sesión de la pestaña recuerda pista, posición y volumen. Si se estaba reproduciendo, al navegar, recargar o usar Atrás/Adelante se intenta continuar desde la posición guardada; una pausa manual se mantiene. Puede haber una breve interrupción: no es reproducción continua entre páginas. Si el navegador bloquea la reproducción automática, pulsa PLAY. Si se elimina la pista, no se reproduce otra automáticamente. Sin almacenamiento, la reproducción manual sigue funcionando, pero no se puede reanudar la sesión. Comprueba primero que `/music/my-song.mp3` sea accesible. Al terminar una pista se reproduce la siguiente; después de la última se vuelve a la primera. Usa `enabled: false` para desactivar el reproductor.

Antes de reproducir, se descarga la pista completa y se convierte en un Blob del navegador, por lo que el salto de posición no depende de HTTP Range. Los archivos grandes o las conexiones lentas aumentan la espera y el uso de memoria. Pausar y continuar reutiliza la pista cargada; cambiar de pista libera la anterior. Al navegar se vuelve a cargar, aunque la caché HTTP del navegador puede ayudar. Los servidores de audio externos deben permitir descargas entre orígenes (CORS); los archivos del mismo sitio en `public/music/` no requieren esa configuración.

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

Los párrafos y la firma de About conservan los saltos de línea de la configuración: `\n` cambia de línea y `\n\n` deja una línea en blanco. Las frases largas siguen ajustándose. Es texto plano, sin Markdown ni HTML; no insertes `<br>`.

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

### Decoder Lab: un homenaje a los cypherpunks

La estética de Decoder Lab se inspira en el movimiento **cypherpunk**, como homenaje a sus contribuciones a la libertad humana, la privacidad y el código abierto. Su red entre pares y el procesamiento local reflejan la idea de mantener las herramientas y los datos en manos de cada persona.

Compartimos esta convicción: **la privacidad y la libertad no pueden depender únicamente de la buena voluntad de quienes tienen el poder.** Cada persona debería poder proteger sus comunicaciones, elegir qué revelar y a quién, y verificar por sí misma cuando sea posible, sin depositar toda su confianza en gobiernos, plataformas u otros terceros.

**«Cypherpunks write code».** Esta frase de [A Cypherpunk’s Manifesto](https://www.activism.net/cypherpunk/manifesto.html) expresa una forma de actuar: convertir ideales en software útil y publicar el código para que otros puedan examinarlo, usarlo y ampliarlo. Honramos ese compromiso con la autonomía individual mediante la tecnología.

Decoder Lab refleja ese espíritu con procesamiento local, código fuente examinable y una red entre pares como motivo visual.

La versión completa de **Decoder Lab** está en `/<locale>/decoder/`: historial local, interpretación ERC-20/TRC-20 (EVM/HyperEVM/TRON) e inspección de direcciones EVM/TRON/Bitcoin. Ábrela desde el diálogo de About. Usa `theme.enableDecoderPage: false` en `src/site.config.ts` para desactivar la página y su enlace independientemente de About. No requiere RPC, cartera ni clave API.

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

Comprueba la función en desarrollo y ejecuta `npm run doctor` y `npm run preview`. Doctor incluye comprobaciones y compilación; no repitas check y build si termina correctamente. Verifica la búsqueda en la vista previa compilada y despliega el nuevo resultado para publicar.

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

Estas opciones de inicio/pie son cambios locales sin publicar; npm 0.14.0 y el starter público aún no las incluyen. Requieren cambios tanto en el starter como en el paquete; consulta la [migración pendiente](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md#unreleased-home-switches-and-footer-links).

En `src/site.config.ts`, `theme.home.showInitialize` controla Initialize/done, `showFollow` controla Wake Up/Follow y `showTrace` controla el estado inferior derecho. Todos valen `true` por defecto; `false` oculta cada sección por separado.

La opción `theme.footer.links` añade una fila independiente al pie: cada entrada contiene `label` y `href`, con puntos entre enlaces. Omitirla o usar un array vacío oculta la fila. Las etiquetas mantienen el texto configurado en todos los idiomas; no depende de los iconos sociales ni de `showCredits`.

```ts
theme: {
  home: { showInitialize: true, showFollow: true, showTrace: true },
  footer: {
    links: [{ label: "Source", href: "https://github.com/your-name/your-repo" }],
  },
},
```

Las tarjetas automáticas usan un fondo incluido de lluvia de código, terminales y redes de neón, con tu propio nombre de sitio, título y autor. El pequeño crédito `Theme by Anglefeint` abajo a la derecha sigue `theme.footer.showCredits` (por defecto `true`); con `false` se ocultan los créditos del pie y de la imagen. Vuelve a compilar y desplegar tras cambiarlo. Los archivos `ogImage` personalizados no se modifican. El fondo funciona sin conexión y no añade JavaScript al navegador.

La demo pública utiliza su propio nombre, dominio e introducciones traducidas. Un starter nuevo conserva valores genéricos y se sigue configurando en `src/site.config.ts`. Al actualizar un starter antiguo, migra también los archivos de configuración indicados en la guía de actualización; actualizar solo el paquete npm no añade esta opción a los adaptadores antiguos.

## En esta serie

- [Guía 1: Configura tu blog](/es/blog/starter-guide-1-configure-your-site/)
- [Guía 2: Escribe y organiza el contenido](/es/blog/starter-guide-2-languages-and-routing/)
- [Guía 3: Activa y personaliza funciones opcionales](/es/blog/starter-guide-3-comments-about-and-theme-toggles/)

## Fórmulas matemáticas

Los artículos Markdown y MDX admiten matemáticas de estilo LaTeX de forma global y predeterminada. Usa `$C_{saved}$` en línea o una fórmula entre líneas separadas con `$$`. No hacen falta opciones por artículo ni instalar plugins adicionales.

```markdown
Inline: $C_{saved}$

$$
\frac{a}{b}
$$
```

Desactiva con `theme: { math: { enabled: false } }` en `src/site.config.ts`. Escapa los dólares ambiguos como `\$`; el código permanece literal. Al desactivar se recuperan las reglas normales de MDX, incluidas las expresiones JavaScript entre llaves.

Se renderiza durante la compilación, con estilos y fuentes locales y MathML accesible, sin motor matemático en el navegador. Las fórmulas largas tienen desplazamiento horizontal. Los errores detienen la compilación indicando origen y causa. Mantén títulos y descripciones en texto plano; las fórmulas se excluyen de la búsqueda. Se admite la sintaxis matemática de KaTeX, no documentos LaTeX completos.

Los proyectos anteriores necesitan la migración inicial del starter y la configuración explicada en la guía de actualización; actualizar solo el paquete no conecta el procesador Markdown.

$C_{saved}$

$$
\frac{a}{b} = x_1 + x_2 + x_3 + x_4 + x_5 + x_6 + x_7 + x_8 + x_9 + x_{10}
$$
