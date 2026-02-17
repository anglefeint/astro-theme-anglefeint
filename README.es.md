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
npm create astro@latest -- --template voidtem/astro-theme-anglefeint
```

Con `pnpm`:

```bash
pnpm create astro@latest --template voidtem/astro-theme-anglefeint
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

## Caracteristicas

- Salida estatica con Astro 5
- Colecciones de contenido Markdown + MDX
- Idiomas incluidos: `en`, `ja`, `ko`, `es`, `zh`
- RSS por idioma
- Soporte para sitemap + robots
- Personalizacion orientada a configuracion
- Footer fijo abajo en paginas cortas

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

## Configuracion del tema

1. Copia `.env.example` a `.env` y define la identidad del sitio.
2. Actualiza enlaces sociales en `src/config/social.ts`.
3. Edita el contenido de About en `src/config/about.ts`.
4. Activa o desactiva About con `ENABLE_ABOUT_PAGE` en `src/config/theme.ts`.
5. Reemplaza posts de ejemplo en `src/content/blog/<locale>/`.

## Superficie de configuracion

- Identidad del sitio: `src/config/site.ts` (o variables `PUBLIC_*`)
- Comportamiento del tema: `src/config/theme.ts`
- Contenido de About: `src/config/about.ts`
- Enlaces sociales: `src/config/social.ts`

## Documentacion

- Arquitectura: `docs/ARCHITECTURE.md`
- Sistemas visuales: `docs/VISUAL_SYSTEMS.md`
- Checklist de envio: `docs/THEME_SUBMISSION_CHECKLIST.md`
- Borrador de listado: `ASTRO_THEME_LISTING.md`

## Licencia

MIT License. Ver `LICENSE`.
