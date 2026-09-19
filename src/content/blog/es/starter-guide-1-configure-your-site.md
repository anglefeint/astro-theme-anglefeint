---
tags: ['anglefeint', 'starter']
title: 'Guía 1: Configura tu blog'
subtitle: 'Instala el starter, configura el sitio y los idiomas, sustituye los ejemplos y publica tu blog.'
description: 'Instala el starter, configura el sitio y los idiomas, sustituye los ejemplos y publica tu blog.'
pubDate: '2026-03-07'
updatedDate: '2026-09-19'
heroImage: '../../../assets/blog/default-covers/cyber-02.webp'
---

## Empieza por lo esencial

Esta serie corresponde al starter 0.8.0 y explica la puesta en marcha, la escritura y las funciones opcionales. No necesitas conocer todos los ajustes para empezar. Sustituye la identidad del sitio y el contenido, y conserva los demás valores predeterminados. Estas guías son artículos normales: puedes probar su índice, la copia de código y la búsqueda.

## 1. Instala y abre el sitio localmente

Con Node.js 22.12.0 o posterior, ejecuta:

```bash
npm create astro@latest -- --template anglefeint/astro-theme-anglefeint#starter
```

Elige un directorio en el asistente, por ejemplo `my-blog`. Entra en el directorio que realmente hayas creado: ajusta la primera línea siguiente. Si el asistente ya instaló las dependencias, omite `npm install`.

```bash
cd my-blog
npm install
npm run dev
```

Abre la URL local que aparece en la terminal; el puerto puede cambiar si está ocupado. Con pnpm también puedes crear la plantilla mediante el comando npm anterior, omitir la instalación de dependencias en el asistente y ejecutar después `pnpm install` y `pnpm dev`.

## 2. Cambia el nombre, la presentación y los enlaces

Abre `src/site.config.ts`. Conserva sus importaciones y exportaciones y edita el objeto de `defineThemeConfig({...})`. Este es un ejemplo completo de la declaración de configuración: sustituye el dominio, el nombre, los textos y los enlaces.

```ts
export const THEME_CONFIG = defineThemeConfig({
  site: {
    title: 'My Blog',
    description: 'My notes and projects.',
    url: 'https://example.com',
    author: 'Your Name',
    tagline: 'Built with Astro.',
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

La presentación bajo el título principal de inicio se configura mediante `site.hero` del idioma actual. `site.description` es la descripción general predeterminada, mientras que la metadescripción de inicio da prioridad a `messages.siteDescription` del idioma. Cambiar solo `site.description` no sustituye la presentación visible.

Los iconos sociales admiten `github`, `twitter` y `mastodon`. Usa `social: { links: [] }` para quitar todos los enlaces. Una lista vacía sigue mostrando tres iconos de muestra sin enlace (Mastodon, Twitter y GitHub) en la cabecera y el pie de página; si la lista contiene elementos, solo se muestran los configurados. Las variables de entorno como `PUBLIC_SITE_TITLE` y `PUBLIC_SITE_URL` tienen prioridad sobre el archivo; compruébalas si un cambio no se refleja.

Define `PUBLIC_SITE_URL=https://your-domain.example` en el archivo `.env` de la raíz del proyecto o en el entorno de compilación del alojamiento para reemplazar `site.url`. Reinicia el servidor de desarrollo o vuelve a compilar tras cambiarlo. Comprueba que los enlaces canonical, RSS, sitemap y las URL absolutas de imágenes sociales utilicen ese dominio. Se necesitan el `astro.config.mjs` y el script de resolución de URL correspondientes del starter; actualizar solo el paquete npm del tema no actualiza estos archivos.

## 3. Conserva los idiomas que necesites

Por defecto están activos `en`, `ja`, `ko`, `es` y `zh`. El primer ejemplo establece `es` como idioma predeterminado, pero no desactiva los demás. Para usar solo español, integra lo siguiente en tu `i18n` existente y conserva los textos de inicio anteriores:

```ts
i18n: {
  defaultLocale: 'es',
  locales: {
    en: { meta: { enabled: false } },
    ja: { meta: { enabled: false } },
    ko: { meta: { enabled: false } },
    es: { meta: { enabled: true } },
    zh: { meta: { enabled: false } },
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
npm run check
npm run build
npm run preview
```

`check` revisa la configuración y los adaptadores, los archivos Astro y la configuración de About compilada. `build` genera el sitio estático en `dist/`, con el índice de búsqueda y, por defecto, las imágenes automáticas para compartir. `preview` sirve el resultado localmente; no lo publica en Internet. Detén la vista previa con Ctrl+C.

En el alojamiento estático, establece `npm run build` como comando de compilación y `dist` como directorio de salida. Cambia antes `site.url` por tu dominio real. Consulta la [guía de despliegue de Astro](https://docs.astro.build/en/guides/deploy/) para conectar el repositorio, configurar el dominio y publicar en tu plataforma. Comprueba después inicio, artículos, cambio de idioma, búsqueda y `/<idioma>/rss.xml`. Cada cambio de contenido o configuración requiere compilar y desplegar de nuevo.

## 6. Recuerda tres reglas de configuración

Edita el objeto de `src/site.config.ts`; no pegues los ejemplos en adaptadores generados como `src/config/*`.

Mantén una sola clave `theme` y una sola `i18n` en el mismo objeto. Integra los ajustes de cada función en los objetos existentes, sin duplicar claves. Los campos omitidos conservan los valores predeterminados; las matrices, como canciones o enlaces sociales, se sustituyen enteras.

Actualizar el paquete npm de un proyecto antiguo no actualiza automáticamente sus archivos locales del starter. Si faltan funciones o ajustes de estas guías, consulta la [guía de actualización](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md). No elimines archivos auxiliares de configuración solo para ocultar errores.

## En esta serie

- [Guía 1: Configura tu blog](/es/blog/starter-guide-1-configure-your-site/)
- [Guía 2: Escribe y organiza el contenido](/es/blog/starter-guide-2-languages-and-routing/)
- [Guía 3: Activa y personaliza funciones opcionales](/es/blog/starter-guide-3-comments-about-and-theme-toggles/)
