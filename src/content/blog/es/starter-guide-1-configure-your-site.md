---
tags: ['anglefeint', 'starter']
title: 'Guía 1: Configura tu blog'
subtitle: 'Instala el starter, configura el sitio y los idiomas, sustituye los ejemplos y publica tu blog.'
description: 'Instala el starter, configura el sitio y los idiomas, sustituye los ejemplos y publica tu blog.'
pubDate: '2026-03-07'
updatedDate: '2026-11-10'
heroImage: '../../../assets/blog/default-covers/cyber-02.webp'
---

## Empieza por lo esencial

Esta serie corresponde al starter actual y explica la puesta en marcha, la escritura y las funciones opcionales. No necesitas conocer todos los ajustes para empezar. Sustituye la identidad del sitio y el contenido, y conserva los demás valores predeterminados. Estas guías son artículos normales: puedes probar su índice, la copia de código y la búsqueda.

## 1. Instala y abre el sitio localmente

Con Node.js 22.12.0 o posterior, ejecuta:

```bash
npm create astro@latest -- my-blog --template anglefeint/astro-theme-anglefeint#starter --no-install --no-ai
```

El comando crea `my-blog` sin instalar dependencias. Ejecútalo desde el directorio padre; si cambias el nombre, actualiza tanto el comando como cd. Después instala e inicia:

```bash
cd my-blog
npm install
npm run dev
```

Abre la URL indicada en la terminal; el puerto puede cambiar si está ocupado. Con pnpm, usa el mismo comando de creación y después `pnpm install` y `pnpm dev` en lugar de los comandos npm de instalación e inicio.

## 2. Cambia el nombre, la presentación y los enlaces

Abre `src/site.config.ts`. Conserva sus importaciones y exportaciones y edita el objeto de `defineThemeConfig({...})`. Este es un ejemplo completo de la declaración de configuración: sustituye el dominio, el nombre, los textos y los enlaces.

```ts
export const THEME_CONFIG = defineThemeConfig({
  site: {
    title: 'My Blog',
    description: 'My notes and projects.',
    url: 'https://example.com',
    author: 'Your Name',
    tagline: '',
  },
  i18n: {
    defaultLocale: 'es',
    locales: {
      es: {
        site: { hero: 'Welcome to my blog.' },
        messages: { siteDescription: 'My notes and projects.' },
      },
    },
  },
  social: {
    links: [{ href: 'https://github.com/yourname', label: 'GitHub', icon: 'github' }],
  },
});
```

`site.title` es el nombre del sitio. En `site.url` indica la URL completa de publicación: afecta a canonical, RSS, sitemap y las direcciones de imágenes para compartir. `site.author` es el autor predeterminado de los artículos y `site.tagline` es el texto del pie.

El pie separa el copyright, los créditos del tema/Astro y el texto opcional `site.tagline`, con los iconos sociales debajo. Los créditos siguen el idioma de la página; tu texto se conserva en todos los idiomas. El texto vacío no ocupa espacio y los textos largos se ajustan en móviles. La configuración existente y `PUBLIC_SITE_TAGLINE` siguen funcionando; no hace falta migrar.

La presentación bajo el título principal de inicio se configura mediante `site.hero` del idioma actual. `site.description` es la descripción general predeterminada, mientras que la metadescripción de inicio da prioridad a `messages.siteDescription` del idioma. Cambiar solo `site.description` no sustituye la presentación visible.

Los iconos sociales admiten `github`, `twitter`, `mastodon`, `youtube`, `bluesky`, `linkedin`, `discord`, `telegram`, `instagram`, `facebook`, `whatsapp`, `line`. Para una imagen propia, guarda un SVG/PNG/WebP local en `public/icons/` y asigna `iconSrc: "/icons/community.svg"`: tiene prioridad sobre `icon` y conserva sus colores. Omite ambos campos para mostrar texto. Consulta las reglas de rutas y ejemplos en el [README](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/README.es.md). Usa `social: { links: [] }` para quitar todos los enlaces. Una lista vacía sigue mostrando tres iconos de muestra sin enlace (Mastodon, Twitter y GitHub) en la cabecera y el pie de página; si la lista contiene elementos, solo se muestran los configurados. Las variables de entorno como `PUBLIC_SITE_TITLE` y `PUBLIC_SITE_URL` tienen prioridad sobre el archivo; compruébalas si un cambio no se refleja.

En el starter integrado 0.27+, el paquete del tema lee `PUBLIC_SITE_URL` del `.env` raíz o del entorno de compilación y lo prioriza sobre `site.url` para canonical, RSS, sitemap e imágenes sociales. Reinicia desarrollo o recompila tras cambiarlo. Conserva la integración en `astro.config.mjs`; no hacen falta un resolvedor local de URL ni adapters copiados. Las estructuras anteriores a 0.27 necesitan la migración inicial de la guía de actualización.

## 3. Conserva los idiomas que necesites

Por defecto están activos `en`, `ja`, `ko`, `es`, `zh`, `pt-br`, `de`, `ru` y `zh-hant`. El primer ejemplo establece `es` como idioma predeterminado, pero no desactiva los demás. Para usar solo español, integra lo siguiente en tu `i18n` existente y conserva los textos de inicio anteriores:

```ts
i18n: {
  defaultLocale: 'es',
  locales: {
    en: { meta: { enabled: false } },
    ja: { meta: { enabled: false } },
    ko: { meta: { enabled: false } },
    es: { meta: { enabled: true } },
    zh: { meta: { enabled: false } },
    'pt-br': { meta: { enabled: false } },
    de: { meta: { enabled: false } },
    ru: { meta: { enabled: false } },
    'zh-hant': { meta: { enabled: false } },
  },
},
```

La configuración se combina recursivamente con los valores predeterminados. Omitir un idioma no lo elimina: hay que indicar `meta.enabled: false`. El idioma predeterminado permanece activo. Estos ajustes controlan el menú y las rutas, pero no traducen artículos ni borran archivos. Abre `/es/` y revisa el selector de idiomas.

## 4. Sustituye los ejemplos y escribe tu primer artículo

Los artículos están en `src/content/blog/<idioma>/`. Cada idioma predeterminado incluye `welcome-to-anglefeint.md` y tres archivos `starter-guide-*.md`, incluida esta guía. Tras hacer una copia de seguridad, puedes eliminar los Markdown de ejemplo que no quieras o conservar las guías como referencia. No borres los directorios de configuración ni imágenes que sigan usando otros artículos.

```bash
npm run new-post -- my-first-post
```

El comando crea archivos con el mismo nombre para los idiomas activos; no traduce el texto. Edita el título, la descripción y el cuerpo en `src/content/blog/es/my-first-post.md` y visita `/es/blog/my-first-post/`. La guía 2 explica los campos, las imágenes y las etiquetas.

## 5. Comprueba, compila y publica

Durante el desarrollo usa `npm run dev`. Antes de publicar, ejecuta desde el proyecto:

```bash
npm run doctor
npm run preview
```

`doctor` comprueba el proyecto y lo compila en `dist/`, con el índice de búsqueda y las imágenes sociales predeterminadas. Si termina correctamente, no hace falta ejecutar check ni build otra vez. `preview` muestra ese resultado localmente; no lo publica. Deténlo con Ctrl+C.

En el alojamiento estático, establece `npm run build` como comando de compilación y `dist` como directorio de salida. Cambia antes `site.url` por tu dominio real. Consulta la [guía de despliegue de Astro](https://docs.astro.build/en/guides/deploy/) para conectar el repositorio, configurar el dominio y publicar en tu plataforma. Comprueba después inicio, artículos, cambio de idioma, búsqueda y `/<idioma>/rss.xml`. Cada cambio de contenido o configuración requiere compilar y desplegar de nuevo.

Cloudflare es opcional. Consulta la [configuración por plataforma en README](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/README.es.md#deployment), incluida la limitación actual de publicar en la raíz del dominio.

## 6. Recuerda tres reglas de configuración

Mantén una sola clave `theme` y una sola `i18n` en el mismo objeto. Integra los ajustes de cada función en los objetos existentes, sin duplicar claves. Los campos omitidos conservan los valores predeterminados; las matrices, como canciones o enlaces sociales, se sustituyen enteras.

En el starter integrado 0.27+, el paquete proporciona páginas estándar, valores predeterminados y funciones de build. Tus ajustes permanecen en `src/site.config.ts`. Actualizar el tema no reescribe artículos, música, imágenes ni páginas propias. Las estructuras anteriores a 0.27 requieren la migración inicial de la [guía](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md).

## En esta serie

- [Guía 1: Configura tu blog](/es/blog/starter-guide-1-configure-your-site/)
- [Guía 2: Escribe y organiza el contenido](/es/blog/starter-guide-2-languages-and-routing/)
- [Guía 3: Activa y personaliza funciones opcionales](/es/blog/starter-guide-3-comments-about-and-theme-toggles/)

---

## Actualizar el tema

El paquete gestiona páginas estándar, valores predeterminados, traducciones y funciones de compilación. Tus artículos, `src/site.config.ts`, música, imágenes y páginas propias permanecen en el proyecto.

En el nuevo starter de integración con npm, ejecuta lo siguiente desde la raíz. Comprueba compatibilidad, guarda los archivos de dependencias, instala una versión exacta y ejecuta doctor. Si falla, restaura los archivos e intenta reinstalar las dependencias anteriores. Publica después con tu proceso habitual; no despliega automáticamente.

```bash
npx @anglefeint/astro-theme@latest upgrade
```

Los proyectos anteriores a 0.27 necesitan una migración inicial a un starter nuevo. Créalo en otra carpeta, copia artículos y recursos y combina tus ajustes con el nuevo site config. No copies rutas estándar antiguas, adapters ni helpers defaults/schema/runtime. Conserva slugs, rutas de idioma, URL de música e imágenes y ajustes del alojamiento.

El actualizador automático admite solo npm y rechaza bloqueos de pnpm/yarn/bun. `--check` comprueba sin escribir; `--to 0.27.1` elige versión. Consulta la [guía](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md) y [GitHub Releases](https://github.com/anglefeint/astro-theme-anglefeint/releases).

Si falla la actualización, no publiques `dist/`: restaurar dependencias no restaura la compilación anterior. Corrige el error y ejecuta `npm run doctor` con éxito antes de desplegar. Con pnpm, revisa la compatibilidad y actualiza manualmente con `pnpm add @anglefeint/astro-theme@latest` y `pnpm run doctor`, conservando tu lockfile.

## Imagen predeterminada y IDs cortos de Fragment (0.33.0+)

Añade site.ogImage a la configuración site existente en src/site.config.ts. Acepta una ruta desde public (/images/share.jpg corresponde a public/images/share.jpg) o una URL HTTPS. Si queda vacío, se usa la imagen Anglefeint incluida de 1200×630. Fragments y todos sus enlaces #ID comparten esta imagen. Las imágenes propias y generadas de los artículos conservan la prioridad; con la generación desactivada, la portada del artículo también precede a la imagen del sitio. Reconstruye y despliega después de cambiarla; las plataformas pueden mantener la vista previa en caché.

```ts
export const THEME_CONFIG = defineThemeConfig({
  site: { ogImage: '/images/share.jpg' },
});
```
