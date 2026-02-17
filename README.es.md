# Anglefeint

Un tema Astro cinematografico con varias atmosferas para publicacion personal.

## Idiomas

- [English](README.md)
- [简体中文](README.zh-CN.md)
- [日本語](README.ja.md)
- Espanol (este archivo)
- [한국어](README.ko.md)

## Demo en vivo

- https://demo.anglefeint.com/

## Stack tecnico

- Astro 5
- TypeScript
- Colecciones de contenido con Markdown + MDX
- Generacion de sitio estatico (SSG)
- Compatible con Cloudflare Workers / Pages

## Requisitos

- Node.js 18+ (LTS recomendado)
- Gestor de paquetes: npm / pnpm / yarn / bun

## Vista por rutas

- Inicio (`/`): estilo terminal tipo Matrix
- Lista del blog (`/:lang/blog`): ambiente cyberpunk
- Post (`/:lang/blog/[slug]`): interfaz de lectura estilo IA
- About (`/:lang/about`): perfil opcional estilo hacker

## Caracteristicas

- Salida estatica con Astro 5
- Soporte para Markdown + MDX
- Idiomas incluidos: `en`, `ja`, `ko`, `es`, `zh`
- RSS por idioma
- Soporte de sitemap + robots
- Configuracion centralizada (sitio, tema, About, redes sociales)
- Footer fijo al fondo en paginas cortas

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
3. Edita contenido de About en `src/config/about.ts`.
4. Activa/desactiva About con `ENABLE_ABOUT_PAGE` en `src/config/theme.ts`.
5. Reemplaza posts de ejemplo en `src/content/blog/<locale>/`.

## Licencia

MIT License. Ver `LICENSE`.
