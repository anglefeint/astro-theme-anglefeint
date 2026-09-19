<h1 align="center">Anglefeint</h1>
<p align="center">Un tema Astro cinematográfico con varias atmósferas para publicación personal.</p>

<p align="center">
  <a href="https://demo.anglefeint.com/">Demo en vivo</a>
  ·
  <a href="https://github.com/anglefeint/astro-theme-anglefeint">Repositorio</a>
  ·
  <a href="https://github.com/anglefeint/astro-theme-anglefeint/blob/main/ASTRO_THEME_LISTING.md">Ficha de listado</a>
</p>

<p align="center">
  <img alt="Astro" src="https://img.shields.io/badge/Astro-7.3.2-BC52EE?logo=astro&logoColor=white" />
  <img alt="Node" src="https://img.shields.io/badge/Node.js-22.12%2B-339933?logo=node.js&logoColor=white" />
  <img alt="Locales" src="https://img.shields.io/badge/i18n-en%20%7C%20ja%20%7C%20ko%20%7C%20es%20%7C%20zh-0A7EA4" />
  <img alt="Deployment" src="https://img.shields.io/badge/Deploy-Cloudflare%20Workers-F38020?logo=cloudflare&logoColor=white" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT-2EA043" />
</p>

## Instalación con plantilla

```bash
npm create astro@latest -- --template anglefeint/astro-theme-anglefeint#starter
```

Para pnpm, crea la plantilla con el comando npm anterior (omite la instalación de dependencias), entra en el proyecto generado y ejecuta:

```bash
pnpm install
```

## Requisitos

- Node.js `22.12.0+` (LTS recomendado)
- Los comandos documentados del starter 0.8.0 pasaron las pruebas en Linux con npm + Node 22 y pnpm 10 + Node 24. No se probaron yarn/bun. Consulta el [registro de validación](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/docs/releases/0.8.0.md).

## Inicio rápido

```bash
npm install
npm run dev
```

Build y preview:

```bash
npm run build
npm run preview
```

Comandos de calidad:

```bash
npm run doctor
npm run check
```

Con `pnpm`:

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
```

## Actualizar tema

En proyectos creados desde `#starter`, ejecuta lo siguiente solo si la versión de destino es compatible con tu starter y Astro y no requiere cambios de estructura local:

```bash
npm update @anglefeint/astro-theme
npm run doctor
```

`npm update` respeta el rango de `package.json`: `^0.5.1` no incluye `0.6.0`. Para una actualización compatible fuera del rango, sigue las notas de versión e instala una versión de destino explícita, no `@latest` sin comprobarla. Verifica las versiones con `npm ls @anglefeint/astro-theme astro`.

En el starter actual, `doctor` ya incluye las comprobaciones y la compilación. Cuando termine correctamente, revisa el sitio con `npm run preview`. Solo si informa de diferencias entre los adaptadores generados y las plantillas locales, ejecuta `npm run sync-adapters` y repite `npm run doctor`; esto no descarga plantillas del repositorio original. Los proyectos antiguos pueden tener otros scripts: consulta su `package.json` y la guía de actualización.

Si las notas de versión incluyen cambios del starter, crea la plantilla actual en un directorio nuevo y migra tu contenido y ajustes personales. No sobrescribas los nuevos archivos auxiliares de configuración con los antiguos. `npm update` solo actualiza el paquete; no se garantiza la actualización directa de todos los starters históricos. Consulta la [guía de actualización](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md).

Si tu código personalizado aún importa `src/consts` o `@anglefeint/astro-theme/consts`, mígralo a `src/config/site.ts`.

Para migraciones de versiones mayores de Astro, revisa primero la guía oficial:

- https://docs.astro.build/en/guides/upgrade-to/
- después sigue la lista de verificación de la guía de actualización enlazada arriba.

## Crear nuevo post

Crea el mismo slug para todos los idiomas habilitados en la configuración:

```bash
npm run new-post -- my-first-post
```

Regla del slug: usa solo minúsculas, números y guiones (ejemplo: `my-first-post`).
Si existen portadas por defecto en `src/assets/blog/default-covers/`, el script asigna una portada estable por hash de slug (puedes cambiar `heroImage` después).
Override opcional de idiomas:

```bash
npm run new-post -- my-first-post --locales en,fr
# o
ANGLEFEINT_LOCALES=en,fr npm run new-post -- my-first-post
```

La sintaxis `ANGLEFEINT_LOCALES=...` es para Bash y shells POSIX. En PowerShell, usa el comando con `--locales` de arriba.

Cómo funciona la URL:

- Archivo: `src/content/blog/es/my-first-post.md`
- URL: `/es/blog/my-first-post/`
- Lista del blog: `/es/blog/`
- No necesitas crear rutas a mano. Astro las genera automáticamente en build.

`--locales` solo crea archivos de artículos; no habilita idiomas. Añade o habilita cada idioma en `src/site.config.ts` para generar sus rutas.

## Crear nueva página

`new-post` solo crea contenido del blog. Para páginas personalizadas usa:

```bash
npm run new-page -- projects --theme base
```

Temas disponibles: `base`, `ai`, `cyber`, `hacker`, `matrix`.  
El comando genera `src/pages/[lang]/projects.astro` y publica todas las rutas por idioma con `getStaticPaths()`.
Regla de slug: solo minúsculas, números y guiones; se permiten rutas anidadas (ejemplo: `projects/labs`). `_` y mayúsculas no son válidos.

Ejemplos (elige uno para `projects`; si ejecutas los cinco, fallarán a partir del segundo porque el archivo ya existe):

```bash
npm run new-page -- projects --theme base
npm run new-page -- projects --theme ai
npm run new-page -- projects --theme cyber
npm run new-page -- projects --theme hacker
npm run new-page -- projects --theme matrix
```

## Idiomas

[English](README.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · Español (este archivo) · [한국어](README.ko.md)

## Vista previa

| Inicio                                                         | Lista del blog                                                           |
| -------------------------------------------------------------- | ------------------------------------------------------------------------ |
| ![Home preview](public/images/theme-previews/preview-home.png) | ![Blog list preview](public/images/theme-previews/preview-blog-list.png) |

| Post                                                                          |
| ----------------------------------------------------------------------------- |
| ![Blog post preview](public/images/theme-previews/preview-blog-post-open.png) |

| About                                                            |
| ---------------------------------------------------------------- |
| ![About preview](public/images/theme-previews/preview-about.png) |

## Ambiente por ruta

- `/<default-locale>/` (por defecto `/` redirige aquí): portada tipo terminal Matrix
- `/:lang/blog`: ambiente de archivo cyberpunk
- `/:lang/blog/[slug]`: lectura estilo interfaz de IA
- `/:lang/about`: página About opcional con estilo hacker

## Contrato de nombres del tema

- Variantes de tema: `base`, `ai`, `cyber`, `hacker`, `matrix`
- Prefijos internos en selectores y scripts: `ai-*`, `cyber-*`, `hacker-*`
- Composición base: `ThemeFrame -> Shell -> Layout -> Page`

## Características

- Búsqueda de artículos con Pagefind en el idioma actual
- Índice automático del artículo y archivos estáticos por etiqueta
- Copia de código y vista previa de imágenes del artículo
- Salida estática con Astro 7
- Colecciones de contenido Markdown + MDX
- El starter incluye idiomas de ejemplo: `en`, `ja`, `ko`, `es`, `zh`
- RSS por idioma
- Soporte para sitemap + robots
- Personalización orientada a configuración
- Footer fijo abajo en páginas cortas

## Configuración del tema

1. Copia opcionalmente `.env.example` a `.env` para sobrescribir la identidad con variables de entorno; en otro caso, usa `src/site.config.ts`.
2. Edita `src/site.config.ts`:
   - `site.title`, `site.description`, `site.url`, `site.author`, `site.tagline` para identidad del sitio y metadatos por defecto
   - `i18n.defaultLocale` para definir el idioma por defecto
   - `i18n.routing.defaultLocalePrefix` para elegir si el idioma por defecto vive en `/<default-locale>/` (por defecto) o en `/`
   - `i18n.locales` como fuente única para agregar o quitar idiomas soportados
   - `i18n.locales.<code>.messages` para sobrescribir textos de UI por idioma
   - `i18n.locales.<code>.meta.label` para el nombre del menú de idiomas (`zh` usa `简体中文` por defecto); cambiarlo no modifica las URL
   - `i18n.locales.<code>.site.hero` para sobrescribir el hero de la home por idioma
   - `social.links` para enlaces sociales
   - `i18n.locales.<code>.about` para contenido y textos runtime de About por idioma
   - `theme.enableAboutPage` para activar/desactivar About
   - `theme.effects.enableRedQueen` para activar/desactivar el monitor lateral en posts
   - `theme.comments` para activar y configurar Giscus (IDs base + parámetros de comportamiento)
3. Reemplaza posts de ejemplo en `src/content/blog/<locale>/`.

### Opcional: comentarios con Giscus

Los comentarios vienen desactivados por defecto. Para activarlos:

1. En `src/site.config.ts`, define `theme.comments.enabled = true`.
2. Completa los campos requeridos:
   - `theme.comments.repo`
   - `theme.comments.repoId`
   - `theme.comments.category`
   - `theme.comments.categoryId`
3. Campos opcionales:
   - `theme.comments.mapping`
   - `theme.comments.term` (obligatorio cuando `mapping = "specific"`)
   - `theme.comments.number` (obligatorio cuando `mapping = "number"`)
   - `theme.comments.strict`
   - `theme.comments.reactionsEnabled`
   - `theme.comments.emitMetadata`
   - `theme.comments.inputPosition` (`top` o `bottom`)
   - `theme.comments.theme`
   - `theme.comments.lang`
   - `theme.comments.loading`
   - `theme.comments.crossorigin`

Si faltan los IDs principales, no se muestran comentarios. Con comentarios activos, un `term` vacío para `mapping="specific"` o un `number` que no sea una cadena de entero positivo para `mapping="number"` provoca un error de configuración y puede detener dev/build.

El CLI usa los idiomas habilitados de la configuración combinada. Los errores detienen la generación; `--locales` o `ANGLEFEINT_LOCALES` permite elegir idiomas sin cargar la configuración.

## Superficie de configuración

- Entrada única: `src/site.config.ts`
- La descripción de inicio prioriza `messages.siteDescription` resuelto, incluidos textos integrados y de idiomas de respaldo; solo un valor vacío usa `site.description`.
- Los idiomas se combinan con los valores predeterminados. Use `i18n.locales.<code>.meta.enabled = false` para desactivar uno; omitirlo no lo elimina. El idioma predeterminado sigue activo.
- Capa adaptadora (no editar directamente): `src/config/site.ts`, `src/config/theme.ts`, `src/config/about.ts`, `src/config/social.ts`
- La identidad del sitio también se puede sobrescribir con variables `PUBLIC_*`

## Documentación

- [Arquitectura](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/docs/ARCHITECTURE.md)
- [Sistemas visuales](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/docs/VISUAL_SYSTEMS.md)
- [Checklist de envío](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/docs/THEME_SUBMISSION_CHECKLIST.md)
- [Borrador de listado](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/ASTRO_THEME_LISTING.md)
- [Guía de actualización](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md)
- [Historial de cambios](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/CHANGELOG.md)

## Búsqueda de artículos

La búsqueda está activada por defecto. La cabecera permite buscar títulos y contenido de artículos en el idioma actual. `npm run build` genera el índice automáticamente y lo publica con el sitio estático, sin servidor ni cuenta adicional.

En `src/site.config.ts`, `theme.search.enabled: false` desactiva la búsqueda y el índice. El frontmatter `search: false` excluye un artículo. No se indexan navegación, índices de contenido, artículos relacionados, comentarios ni texto decorativo.

Para probar la búsqueda local, ejecuta `npm run build` y después `npm run preview`. `npm run dev` muestra un aviso de desarrollo. Vuelve a compilar después de editar artículos.

## Índice del artículo

Los artículos generan un índice plegable a partir de los encabezados Markdown `##` y `###`. En pantallas amplias permanece a la derecha del artículo; en pantallas estrechas aparece antes del contenido. Se muestra abierto por defecto y se oculta si no hay encabezados compatibles. Los títulos largos se ajustan al ancho y no se añade numeración.

Configura `theme.toc.enabled` en `src/site.config.ts` para cambiar el valor predeterminado del sitio (inicialmente `true`). En el frontmatter del artículo, `toc: false` oculta el índice y `toc: true` lo muestra incluso si el sitio lo desactiva por defecto. Si se omite, hereda la configuración del sitio.

Se admiten encabezados Markdown en MDX, pero no se recopilan automáticamente los generados por componentes ni los escritos como HTML/JSX. Las rutas personalizadas deben pasar a `BlogPost` los `headings` devueltos por `render(post)`; si se omiten, el índice queda oculto.

## Navegación por etiquetas

Añade `tags: ["Astro", "frontend"]` al frontmatter. La compilación genera un directorio de etiquetas y listas paginadas por idioma. Los artículos sin etiquetas siguen funcionando. Desactiva la función con `theme: { tags: { enabled: false } }` en `src/site.config.ts`. Los nombres distinguen mayúsculas; se eliminan espacios exteriores y duplicados. Los nombres especiales usan rutas codificadas estables; cambiar un nombre cambia su URL. No requiere comandos adicionales.

Puedes abrir `/<locale>/tags/` directamente o desde el enlace de etiquetas del blog. Una etiqueta del artículo abre `/<locale>/tags/<tagSlug>/`. Si el idioma no tiene etiquetas, el directorio queda vacío y el blog oculta ese enlace.

## Copiar código

Los bloques de código incluyen un botón de copia automático. Usa Markdown normal, sin configuración adicional. Requiere HTTPS o localhost; si falla, se indica que selecciones el código manualmente.

## Vista previa de imágenes

Las imágenes sin enlace del artículo se amplían con un clic o Enter/Espacio. Cierra con Esc, el botón o el fondo, conservando la posición de lectura. Las imágenes enlazadas mantienen su navegación.

La vista previa usa la fuente de imagen ya seleccionada por el navegador; no descarga un original de mayor resolución. Excluye la portada y las imágenes dentro de enlaces o botones.

## Imágenes para compartir artículos

Disponible desde 0.5.0 con el starter correspondiente; 0.4.0 no incluye esta función.

`npm run build` genera un PNG de 1200×630 con el título, autor y nombre del sitio para artículos sin `ogImage`. No cambia `heroImage`. Usa `ogImage: ./share.png` para una imagen junto al artículo, o `ogImage: /images/share.png` para `public/images/share.png`. También admite HTTPS; la disponibilidad y caché dependen del proveedor. Los archivos locales inexistentes producen un error.

En `src/site.config.ts`, `theme: { socialImage: { enabled: false } }` desactiva la generación. Las imágenes explícitas siguen teniendo prioridad; los demás artículos usan su portada o la imagen predeterminada. Reconstruye y despliega tras cambiar contenido. Los PNG están en `dist/_social/`; `og:image` del HTML indica la URL exacta. Las plataformas pueden conservar vistas previas en caché.

Las fuentes incluidas cubren los cinco idiomas iniciales, sin API de imágenes ni JS de navegador. Los títulos largos se abrevian solo en la imagen. No se garantizan todos los emojis ni otros sistemas de escritura. Aumentan el tiempo de compilación y el tamaño de instalación, pero las páginas no descargan estas fuentes adicionales.

## Licencia

MIT License. Ver `LICENSE`.

## Reproductor de música opcional

Desactivado por defecto. Coloca el audio en `public/music/` y combina esta configuración con la de `src/site.config.ts`:

```ts
theme: {
  music: {
    enabled: true,
    tracks: [{ title: 'My Song', src: '/music/my-song.mp3' }],
  },
},
```

Cada pista acepta `title`, `src` y un `artist` opcional. También admite URL HTTPS de audio. Una lista vacía oculta el reproductor. El audio se carga al pulsar Reproducir. Se recuerdan pista, posición y volumen durante la sesión de la pestaña; tras navegar, pulsa Reproducir para continuar. No ofrece reproducción ininterrumpida entre páginas.
