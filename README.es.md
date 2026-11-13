[English](README.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Português (Brasil)](README.pt-BR.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [繁體中文](README.zh-Hant.md)

<p align="center">
  <a href="https://demo.anglefeint.com/es/">
    <img src="public/images/theme-previews/anglefeint-brand.webp" alt="Anglefeint — Matrix / Cyberpunk / Hacker / AI" width="1600" />
  </a>
</p>

<p align="center">Un tema Astro de publicación personal con atmósferas cinematográficas para lectores humanos y agentes de IA.</p>

Genera automáticamente `llms.txt`, índices multilingües, recopilaciones de texto completo y Markdown de artículos para facilitar la lectura y cita por agentes de IA, con soporte para GEO (optimización para motores generativos).

<p align="center">
  <a href="https://demo.anglefeint.com/es/">Demo en vivo</a>
  ·
  <a href="https://github.com/anglefeint/astro-theme-anglefeint">Repositorio</a>
</p>

<p align="center">
  <a href="#ai-assistant">Asistente de IA</a> · <a href="#installation">Instalación</a> · <a href="#setup">Configuración</a> · <a href="#writing">Escribir</a> · <a href="#upgrade">Actualizar</a> · <a href="#deployment">Compilar y desplegar</a>
</p>

<p align="center">
  <img alt="Astro" src="https://img.shields.io/badge/Astro-7.3.7-BC52EE?logo=astro&logoColor=white" />
  <img alt="Node" src="https://img.shields.io/badge/Node.js-22.12%2B-339933?logo=node.js&logoColor=white" />
  <img alt="Locales" src="https://img.shields.io/badge/i18n-9%20languages-0A7EA4" />
  <img alt="Deployment" src="https://img.shields.io/badge/Deploy-Static%20Hosting-0A7EA4" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT-2EA043" />
</p>

## ¿Qué ofrece Anglefeint?

Escribe entradas en Markdown/MDX y registra ideas breves con Fragments. Incluye idiomas, búsqueda, etiquetas, índice, copia de código, vista de imágenes, fórmulas e imágenes automáticas para compartir. Activa comentarios, música y GA4 cuando los necesites.

| Página              | Atmósfera visual                                                   |
| ------------------- | ------------------------------------------------------------------ |
| Inicio              | Matrix: lluvia verde de código, terminal y avatar de píxeles       |
| Blog y etiquetas    | Cyberpunk: neón, lluvia y haces de luz urbana                      |
| About               | Hacker: presentación, terminal virtual y herramientas interactivas |
| Detalle de artículo | IA: red de fondo, monitores y panel de lectura OUTPUT              |

La compilación también genera Markdown público de artículos, About y Fragments, `llms.txt` y recopilaciones multilingües para herramientas de IA sin servidor de producción adicional. No garantiza indexación ni citas de modelos.

<a id="ai-assistant"></a>

## Colaborar con un asistente de IA

Puedes pedir a Cursor, Codex o Claude Code que configure el sitio y gestione contenido siguiendo `AGENTS.md` del proyecto actual. `CLAUDE.md` y reglas Cursor existentes apuntan a la guía correspondiente. Explica primero qué quieres cambiar; que el asistente revise configuración real y esta sección, y consulte el diccionario del demo cuando necesite detalles de campos.

Para desarrollar el tema, empieza por [AGENTS.md](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/AGENTS.md) y la [guía de contribución](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/CONTRIBUTING.md). Quien usa el blog no necesita aprender antes el proceso de publicación de los mantenedores.

<a id="installation"></a>

## 1. Instalar e iniciar

Necesitas **Node.js 22.12.0 o posterior**. La plantilla usa **Astro 7**. Ejecuta donde quieras guardar el blog:

```bash
npm create astro@latest -- my-blog --template anglefeint/astro-theme-anglefeint#starter --no-ai
cd my-blog
npm run dev
```

En el asistente de creación, acepta instalar las dependencias (Yes). `--no-ai` evita generar instrucciones genéricas adicionales; el starter ya incluye las del tema. Si decidiste omitir la instalación, ejecuta `npm install` dentro de `my-blog` antes de iniciar dev.

Abre la dirección de terminal. En un proyecto existente basta `npm install` y `npm run dev` en su directorio; no crees otro. Detén con Ctrl+C. Los comandos siguientes se ejecutan en la raíz; puedes detener dev o abrir otra terminal.

Proyectos nuevos también admiten `pnpm install`/`pnpm dev`; conserva un solo gestor por proyecto. Los ejemplos usan npm y el actualizador automático solo admite proyectos npm.

Pasos detallados: [instalar el blog y poner tus datos](https://demo.anglefeint.com/es/blog/starter-guide-1-configure-your-site/).

<a id="setup"></a>

## 2. Primera configuración: tus datos

El proyecto ya incluye `src/site.config.ts`. **Abre y edita ese archivo; no crees otro archivo ni declares otro objeto de configuración.**

Añade este `site` dentro del `defineThemeConfig({ ... })` existente y sustituye nombre, autor, presentación y dominio. El starter omite `site` y usa defaults del tema. Si ya existe, modifica sus campos conservando ajustes, sin duplicar objeto. Mantén import, export y demás configuración.

```ts
site: {
  title: 'Mi blog',
  author: 'Tu nombre',
  description: 'Proyectos, lecturas y vida cotidiana.',
  url: 'https://your-domain.example',
},
```

Solo cambia información global, no idiomas. Sin `homeTitle` localizado independiente, el título visible de inicio usa `title` global. Puedes cambiar presentación, About y redes; campos en los enlaces al final de sección.

`site.url` es dirección pública final, no dev local. `PUBLIC_SITE_URL` del despliegue prima; revísalo si persiste un dominio antiguo.

Inicialmente nueve idiomas activos, inglés predeterminado y `/` redirige a `/en/`. Leer este README no requiere cambiar idioma del blog. Para otro predeterminado o ciertos idiomas, sigue [idiomas](https://demo.anglefeint.com/es/blog/starter-guide-languages/). Omitir no desactiva, predeterminado siempre activo y no hay traducción automática. Borra ejemplos tras copia/commit, sin borrar imágenes aún referenciadas.

Tutoriales: [instalación y primeros ajustes](https://demo.anglefeint.com/es/blog/starter-guide-1-configure-your-site/), [idiomas y dirección de inicio](https://demo.anglefeint.com/es/blog/starter-guide-languages/). Referencia: [sitio e interfaz pública](https://demo.anglefeint.com/es/blog/config-site-chrome/), [inicio](https://demo.anglefeint.com/es/blog/config-home/).

<a id="writing"></a>

## 3. Escribir tu primera entrada

Desde la raíz:

```bash
npm run new-post -- my-first-post
```

Sin `--locales` ni `ANGLEFEINT_LOCALES`, lee todos los idiomas activos y crea estructuras con mismo nombre en cada uno. Inicialmente nueve archivos; si cambiaste idiomas, usa selección actual. No traduce cuerpos ni sobrescribe existentes.

Están en `src/content/blog/<locale>/my-first-post.md`, con URL `/<locale>/blog/my-first-post/` y lista `/<locale>/blog/`. Inglés en `src/content/blog/en/my-first-post.md`, chino en `src/content/blog/zh/my-first-post.md`. Abre el que necesites y cambia título, descripción y cuerpo, sin crear rutas manuales. Ejemplo mínimo:

```md
---
title: 'Mi primera entrada'
description: 'Reflexiones al empezar este blog.'
pubDate: '2026-11-13'
---

Escribe el contenido aquí.
```

Solo muestra campos obligatorios; puedes conservar portada y opcionales generados. Nombres normales en minúsculas, números y guiones, como `my-first-post`.

Para archivos solo de idiomas concretos, usa `--locales`. Son alternativas, no ejecutes todas:

```bash
# Solo inglés
npm run new-post -- my-first-post --locales en

# Solo chino
npm run new-post -- my-first-post --locales zh

# Idiomas seleccionados
npm run new-post -- my-first-post --locales en,zh
```

`--locales` elige archivos, no activa idioma; debe estar activo para generar página. Los archivos nuevos de una llamada comparten portada aleatoria predeterminada si hay imágenes en el banco; existentes no se sobrescriben.

`ANGLEFEINT_LOCALES` también elige idiomas: `--locales` → entorno → activos. Bash admite `ANGLEFEINT_LOCALES=zh,en npm run new-post -- my-first-post`; en PowerShell usa los comandos `--locales` anteriores.

**No hay ocultación automática de borradores ni fechas futuras.** Las estructuras de todos los idiomas se publican al compilar. Termina las necesarias y mueve fuera de la colección lo no preparado. `draft: true` y `search: false` no hacen privada una entrada.

Tutoriales: [primera entrada](https://demo.anglefeint.com/es/blog/starter-guide-2-languages-and-routing/), [imágenes](https://demo.anglefeint.com/es/blog/starter-guide-images/). Referencia: [detalle y frontmatter](https://demo.anglefeint.com/es/blog/config-article/).

## 4. Publicar un fragment

Fragments admite texto breve, imágenes o código. **El tema y starter nuevo lo desactivan por defecto; el demo lo activa por separado.** Para activarlo, establece `fragments.enabled: true` dentro del `theme` existente en `src/site.config.ts`. Es estructura combinada; no dupliques theme:

```ts
theme: {
  fragments: { enabled: true },
},
```

Si ya está true, no lo añadas; si false, cámbialo. Controla lista y vista de inicio; comentarios siguen apagados.

Crea un fragment; por defecto genera estructuras de la misma identidad en todos los idiomas activos:

```bash
npm run new-fragment
```

Para seleccionar idiomas, elige parámetros:

```bash
# Solo chino
npm run new-fragment -- --locales zh

# Idiomas seleccionados
npm run new-fragment -- --locales en,zh
```

Cada ejecución crea uno nuevo. Son alternativas según necesidad, no pasos consecutivos. Elegir idioma CLI no cambia controles del sitio.

Archivos en `src/content/fragments/<locale>/`, nombres como `2026-11-13-aB3dE6gH.md`; la terminal muestra los reales. Edita cuerpo y conserva el ID alfanumérico de ocho caracteres; traducciones de la misma ejecución comparten ID y fecha. Para continuar uno existente no repitas creación.

Lista en `/<locale>/fragments/`, por ejemplo `/en/fragments/` o `/zh/fragments/`. Si hay contenido actual aparece avatar de vista previa en inicio. Enlace estable `/<locale>/fragments/#ID`: no uses página como identidad. Cambiar ID afecta enlaces/comentarios; estos apagados por defecto.

Tutorial: [publicar un fragment](https://demo.anglefeint.com/es/blog/starter-guide-5-fragments/). Referencia: [Fragments](https://demo.anglefeint.com/es/blog/config-fragments/).

## 5. Crear páginas personalizadas

Entradas con `new-post`; proyectos o portafolio independientes con `new-page`:

```bash
npm run new-page -- projects
```

Genera `src/pages/[lang]/projects.astro` con `base` predeterminado. Edita y visita `/<locale>/projects/`, por ejemplo `/en/projects/`. Un archivo genera todos los idiomas activos; no traduce ni añade navegación automáticamente.

`--theme` permite `base`, `matrix`, `cyber`, `hacker`, `ai`; por ejemplo `npm run new-page -- portfolio --theme cyber` crea otra página Cyberpunk.

Se admiten rutas anidadas:

```bash
npm run new-page -- projects/labs --theme hacker
```

Cada segmento usa minúsculas, números y guiones, no mayúsculas, guiones bajos ni barras iniciales/finales. No sobrescribe archivos ni recrea rutas estándar reservadas.

Pasos: [personalizar páginas](https://demo.anglefeint.com/es/blog/starter-guide-3-comments-about-and-theme-toggles/).

## 6. Preparar imágenes y conservar archivos generados

El cuerpo usa Markdown normal; pon `photo.jpg` junto a la entrada y escribe `![Descripción de la imagen](./photo.jpg)`. Portada en frontmatter `heroImage: ./cover.jpg`, con archivo preparado antes; URLs públicas sin prefijo public.

Portadas e imágenes locales compatibles de fragments requieren derivados adaptativos persistentes. Prepáralos localmente o comprueba los actuales:

```bash
npx @anglefeint/astro-theme prepare-covers
npx @anglefeint/astro-theme prepare-covers --check
```

dev, build y doctor (también en CI) reutilizan los derivados válidos y completan los ausentes, obsoletos o dañados. Conserva originales y `src/assets/blog/covers/`, con manifiesto y generados, para reutilizarlos. Los originales ausentes o inválidos siguen causando errores.

**Nota de versión:** La preparación automática de imágenes durante build y doctor en CI requiere 0.36.2 o posterior. Con 0.36.1, ejecuta primero dev o `prepare-covers` para preparar los derivados. `prepare-covers --check` y la sincronización de configuración siguen siendo comprobaciones de solo lectura.

No significa comprimir todas las imágenes de cuerpos normales. Alcance, rutas e imágenes compartidas en el [tutorial de imágenes](https://demo.anglefeint.com/es/blog/starter-guide-images/).

<a id="reference"></a>

## Configurar funciones según necesidad

Aquí puedes completar comandos y primeras operaciones. Para personalizar, abre tutorial o campo pertinente. El diccionario explica tipos, valores, límites, ejemplos y estado sin uso.

| Qué quieres hacer                          | Tutorial                                                                                                                                                                             | Diccionario                                                                                                                                                                                  |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Inicio, identidad, navegación, redes y pie | [Páginas y funciones](https://demo.anglefeint.com/es/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                                         | [Inicio](https://demo.anglefeint.com/es/blog/config-home/), [sitio público](https://demo.anglefeint.com/es/blog/config-site-chrome/)                                                         |
| Cantidades, etiquetas y paginación         | [Páginas y funciones](https://demo.anglefeint.com/es/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                                         | [Blog List y etiquetas](https://demo.anglefeint.com/es/blog/config-blog-list/)                                                                                                               |
| Índice, matemáticas, OUTPUT o búsqueda     | [Primera entrada](https://demo.anglefeint.com/es/blog/starter-guide-2-languages-and-routing/)                                                                                        | [Artículos](https://demo.anglefeint.com/es/blog/config-article/), [búsqueda](https://demo.anglefeint.com/es/blog/config-search/)                                                             |
| About, terminal o Decoder                  | [Páginas y funciones](https://demo.anglefeint.com/es/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                                         | [About](https://demo.anglefeint.com/es/blog/config-about/), [terminal](https://demo.anglefeint.com/es/blog/config-terminal/), [Decoder](https://demo.anglefeint.com/es/blog/config-decoder/) |
| Música o comentarios                       | [Música](https://demo.anglefeint.com/es/blog/starter-guide-3-comments-about-and-theme-toggles/), [comentarios](https://demo.anglefeint.com/es/blog/starter-guide-4-giscus-comments/) | [Música](https://demo.anglefeint.com/es/blog/config-music/), [Giscus y discusión multilingüe](https://demo.anglefeint.com/es/blog/config-comments/)                                          |
| Idiomas, estadísticas o texto público      | [Idiomas](https://demo.anglefeint.com/es/blog/starter-guide-languages/), [despliegue](https://demo.anglefeint.com/es/blog/starter-guide-deployment/)                                 | [Idiomas y respaldo](https://demo.anglefeint.com/es/blog/config-languages/), [GA4 y contexto IA](https://demo.anglefeint.com/es/blog/config-analytics-ai/)                                   |

Si no sabes dónde está un campo, usa el [índice de configuración](https://demo.anglefeint.com/es/blog/config-reference/). Cambiar textos de un idioma no traduce contenido; configuración y contenido necesitan recompilar/desplegar.

<a id="upgrade"></a>

## 7. Actualizar un blog existente

Una instalación nueva omite esta sección y sigue a [verificación, preview y primer despliegue](#deployment).

Guarda cambios, por ejemplo con Git; detén dev y preview. Desde la raíz original, comprueba compatibilidad y actualiza:

```bash
npx @anglefeint/astro-theme@latest upgrade --check
npx @anglefeint/astro-theme@latest upgrade
```

`--check` no modifica, instala ni compila. La actualización real admite starter de integración con npm, `package-lock.json` y `anglefeint.projectSchema: 1`. Proyectos pnpm/yarn/bun no deben borrar lockfile para eludirlo.

Actualiza dependencia y ejecuta doctor, conservando entradas, configuración, música, imágenes y páginas propias. Copia los dos archivos de dependencias en `.anglefeint/backups/`; no es copia completa. Si falla instalación/comprobación, restaura archivos e intenta reinstalar anteriores. No publiques `dist/` sobrante tras fallo.

Usa `npx @anglefeint/astro-theme@latest upgrade --to <version>` para versión explícita compatible, sustituyendo el marcador. No admite bajar automáticamente. Tras éxito ya comprobó/compiló: usa `npm run preview` sin build inmediato. No publica ni migra Astro incompatible automáticamente.

Esqueletos copiados anteriores a 0.27 requieren starter nuevo, conservar viejo y migrar contenido/recursos; sin actualización directa. No copies rutas estándar ni adaptadores antiguos.

Detalles y recuperación: [actualizar proyecto existente](https://demo.anglefeint.com/es/blog/starter-guide-1-configure-your-site/), [guía de actualización](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md), [versiones](https://github.com/anglefeint/astro-theme-anglefeint/releases).

<a id="deployment"></a>

## 8. Verificar, previsualizar y desplegar por primera vez

Detén dev en la raíz, comprueba/compila y previsualiza:

```bash
npm run doctor
npm run preview
```

`npm run doctor` incluye comprobación/compilación; `npm run check` es sinónimo: elige uno. Tras éxito no repitas check/build inmediatamente. Para solo Astro/TypeScript sin compilar, `npm run check:no-build`. preview muestra localmente, Ctrl+C detiene, no sube web. Búsqueda real en preview compilado; dev solo muestra aviso.

Si solo quieres compilar, usa este grupo alternativo; elige uno:

```bash
npm run build
npm run preview
```

Con pnpm usa `pnpm run doctor`/`pnpm preview` o `pnpm build`/`pnpm preview`. No abrevies a `pnpm doctor`: invoca el diagnóstico propio de pnpm. Elige un grupo sin duplicar compilaciones.

Primer despliegue estático:

1. Pon dirección final en `site.url` o `PUBLIC_SITE_URL` y guarda fuentes, originales y derivados.
2. Compilación del alojamiento `npm run build` y salida `dist`. Si subes manualmente, **todo el contenido dist** compilado correctamente.
3. Incluye `_astro/`, `pagefind/`, `_social/` y textos públicos; no solo HTML.
4. Publica en raíz con soporte de index por directorio. Subrutas arbitrarias aún requieren adaptación; base Astro no garantiza todo el sitio.
5. Completa dominio/HTTPS en alojamiento y comprueba inicio, artículos, idiomas, imágenes y búsqueda.

La salida es estática, sin Node.js permanente ni adaptador extra. Cabecera noindex de JSON terminal se combina en `dist/_headers`; plataformas compatibles la aplican, otras necesitan equivalente. Astro preview no simula cabeceras del host. Tras cambios recompila y despliega completo.

Pasos: [publicar en tu dominio](https://demo.anglefeint.com/es/blog/starter-guide-deployment/).

## Licencia

Este tema usa [MIT License](LICENSE).

## Vistas previas

![Anglefeint — Four cinematic worlds](public/images/theme-previews/promo-overview.jpg)

![Anglefeint — Cyberpunk Cards and List](public/images/theme-previews/promo-cyberpunk.jpg)

![Anglefeint — Hacker About and Decoder Lab](public/images/theme-previews/promo-hacker.jpg)

![Anglefeint — AI reading and GEO](public/images/theme-previews/promo-ai.jpg)

### Vista al compartir

![Imagen predeterminada de Anglefeint](https://raw.githubusercontent.com/anglefeint/astro-theme-anglefeint/main/packages/theme/src/assets/theme/social/anglefeint-og.jpg)

### Capturas de páginas

| Inicio                                                         | Lista de blog                                                             |
| -------------------------------------------------------------- | ------------------------------------------------------------------------- |
| ![Home preview](public/images/theme-previews/preview-home.jpg) | ![Blog Cards preview](public/images/theme-previews/preview-blog-list.jpg) |

| Blog · modo lista                                                          |
| -------------------------------------------------------------------------- |
| ![Blog List view](public/images/theme-previews/preview-blog-list-mode.jpg) |

| Artículo                                                                 |
| ------------------------------------------------------------------------ |
| ![Blog post preview](public/images/theme-previews/preview-blog-post.jpg) |

| About                                                            |
| ---------------------------------------------------------------- |
| ![About preview](public/images/theme-previews/preview-about.jpg) |

| Paginación de blog                                                                   | Artículos relacionados                                                                |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| ![Paginación de blog](public/images/theme-previews/preview-blog-list-pagination.jpg) | ![Artículos relacionados](public/images/theme-previews/preview-blog-post-related.jpg) |

| Decoder Lab                                                      |
| ---------------------------------------------------------------- |
| ![Decoder Lab](public/images/theme-previews/preview-decoder.jpg) |

| Decoder Lab · recursos cypherpunk                                                    |
| ------------------------------------------------------------------------------------ |
| ![Decoder Lab resources](public/images/theme-previews/preview-decoder-resources.jpg) |
