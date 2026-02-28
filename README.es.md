---
doc_id: readme_es
doc_role: localized-user-guide
doc_purpose: Guia en espanol para instalacion, uso y actualizacion del tema.
doc_scope: [setup, commands, themes, config, routing]
update_triggers: [sync-from-readme-en]
source_of_truth: false
depends_on: [README.md]
---

<h1 align="center">Anglefeint</h1>
<p align="center">Un tema Astro cinematografico con varias atmosferas para publicacion personal.</p>

<p align="center">
  <a href="https://demo.anglefeint.com/">Demo en vivo</a>
  ·
  <a href="https://github.com/voidtem/astro-theme-anglefeint">Repositorio</a>
  ·
  <a href="ASTRO_THEME_LISTING.md">Ficha de listado</a>
</p>

<p align="center">
  <img alt="Astro" src="https://img.shields.io/badge/Astro-5.x-BC52EE?logo=astro&logoColor=white" />
  <img alt="Node" src="https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white" />
  <img alt="Locales" src="https://img.shields.io/badge/i18n-en%20%7C%20ja%20%7C%20ko%20%7C%20es%20%7C%20zh-0A7EA4" />
  <img alt="Deployment" src="https://img.shields.io/badge/Deploy-Cloudflare%20Workers-F38020?logo=cloudflare&logoColor=white" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT-2EA043" />
</p>

## Instalacion con plantilla

```bash
npm create astro@latest -- --template voidtem/astro-theme-anglefeint#starter
```

Con `pnpm`:

```bash
pnpm create astro@latest --template voidtem/astro-theme-anglefeint#starter
```

## Requisitos

- Node.js `18+` (LTS recomendado)
- Gestor de paquetes: `npm`, `pnpm`, `yarn` o `bun`

## Inicio rapido

```bash
npm install
npm run dev
```

Build y preview:

```bash
npm run build
npm run preview
```

Con `pnpm`:

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
```

## Actualizar tema

Para proyectos creados desde `#starter`:

```bash
npm update @anglefeint/astro-theme
npm install
npm run check
npm run build
```

## Crear nuevo post

Crea el mismo slug para todos los idiomas (`en`, `ja`, `ko`, `es`, `zh`):

```bash
npm run new-post -- my-first-post
```

Regla del slug: usa solo minusculas, numeros y guiones (ejemplo: `my-first-post`).
Si existen portadas por defecto en `src/assets/blog/default-covers/`, el script asigna una portada estable por hash de slug (puedes cambiar `heroImage` despues).

## Crear nueva pagina

`new-post` solo crea contenido del blog. Para paginas personalizadas usa:

```bash
npm run new-page -- projects --theme base
```

Temas disponibles: `base`, `ai`, `cyber`, `hacker`, `matrix`.  
El comando genera `src/pages/[lang]/projects.astro` y publica todas las rutas por idioma con `getStaticPaths()`.

Ejemplos:

```bash
npm run new-page -- projects --theme base
npm run new-page -- projects --theme ai
npm run new-page -- projects --theme cyber
npm run new-page -- projects --theme hacker
npm run new-page -- projects --theme matrix
```

## Idiomas

[English](README.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · Espanol (este archivo) · [한국어](README.ko.md)

## Vista previa

| Inicio | Lista del blog |
| --- | --- |
| ![Home preview](public/images/theme-previews/preview-home.png) | ![Blog list preview](public/images/theme-previews/preview-blog-list.png) |

| Post (monitor abierto) | Post (monitor plegado) |
| --- | --- |
| ![Blog post open preview](public/images/theme-previews/preview-blog-post-open.png) | ![Blog post collapsed preview](public/images/theme-previews/preview-blog-post-collapsed.png) |

| About |
| --- |
| ![About preview](public/images/theme-previews/preview-about.png) |

## Ambiente por ruta

- `/`: portada tipo terminal Matrix
- `/:lang/blog`: ambiente de archivo cyberpunk
- `/:lang/blog/[slug]`: lectura estilo interfaz de IA
- `/:lang/about`: pagina About opcional con estilo hacker

## Contrato de nombres del tema

- Variantes de tema: `base`, `ai`, `cyber`, `hacker`, `matrix`
- Prefijos internos en selectores y scripts: `ai-*`, `cyber-*`, `hacker-*`
- Composicion base: `ThemeFrame -> Shell -> Layout -> Page`

## Caracteristicas

- Salida estatica con Astro 5
- Colecciones de contenido Markdown + MDX
- Idiomas incluidos: `en`, `ja`, `ko`, `es`, `zh`
- RSS por idioma
- Soporte para sitemap + robots
- Personalizacion orientada a configuracion
- Footer fijo abajo en paginas cortas

## Configuracion del tema

1. Copia `.env.example` a `.env` y define la identidad del sitio.
2. Edita `src/site.config.ts`:
   - `social.links` para enlaces sociales
   - `about` para contenido y textos runtime de About
   - `theme.enableAboutPage` para activar/desactivar About
3. Reemplaza posts de ejemplo en `src/content/blog/<locale>/`.

## Superficie de configuracion

- Entrada unica: `src/site.config.ts`
- Capa adaptadora (no editar directamente): `src/config/site.ts`, `src/config/theme.ts`, `src/config/about.ts`, `src/config/social.ts`
- La identidad del sitio tambien se puede sobrescribir con variables `PUBLIC_*`

## Documentacion

- Arquitectura: `docs/ARCHITECTURE.md`
- Sistemas visuales: `docs/VISUAL_SYSTEMS.md`
- Checklist de envio: `docs/THEME_SUBMISSION_CHECKLIST.md`
- Borrador de listado: `ASTRO_THEME_LISTING.md`
- Guia de actualizacion: `UPGRADING.md`
- Historial de cambios: `CHANGELOG.md`

## Licencia

MIT License. Ver `LICENSE`.
