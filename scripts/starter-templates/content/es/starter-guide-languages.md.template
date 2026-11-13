---
tags: ['anglefeint', 'starter']
title: 'Guía 7: ofrecer el blog en más idiomas'
subtitle: 'Idiomas activos, direcciones, textos y traducciones'
description: 'Elige idiomas y direcciones y añade traducciones conservando el flujo predeterminado.'
pubDate: '2026-11-13'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/hacker-01.webp'
---

Las cadenas chinas de los ejemplos bajo `locales.zh` son intencionales: ilustran cómo personalizar el contenido chino sin cambiar los demás idiomas. Los valores predeterminados chino/inglés de las tablas son citas del tema, no traducciones pendientes.

Esta es la parte 7 de 8. [Consulta el orden completo](/es/blog/starter-guide-1-configure-your-site/#tutorial-order) · [Busca campos de configuración](/es/blog/config-reference/).

Puedes escribir ahora en un idioma y traducir después. El tema proporciona interfaces y rutas multilingües, no traducción automática de entradas. Activar un idioma, cambiar la interfaz y publicar una traducción son operaciones separadas.

Combina toda configuración en el `defineThemeConfig({...})` existente de `src/site.config.ts`, conservando `i18n` y tus ajustes sin duplicar objetos.

## 1. Elegir los idiomas necesarios

Inicialmente hay nueve activos, con `en` predeterminado:

| Código    | Idioma             |
| --------- | ------------------ |
| `en`      | English            |
| `zh`      | 简体中文           |
| `zh-hant` | 繁體中文           |
| `ja`      | 日本語             |
| `ko`      | 한국어             |
| `es`      | Español            |
| `pt-br`   | Português (Brasil) |
| `de`      | Deutsch            |
| `ru`      | Русский            |

Si quieres solo chino e inglés y chino como predeterminado, elige este ajuste. De lo contrario conserva los valores del proyecto:

```ts
i18n: {
  defaultLocale: 'zh',
  locales: {
    zh: { meta: { enabled: true } },
    en: { meta: { enabled: true } },
    ja: { meta: { enabled: false } },
    ko: { meta: { enabled: false } },
    es: { meta: { enabled: false } },
    'pt-br': { meta: { enabled: false } },
    de: { meta: { enabled: false } },
    ru: { meta: { enabled: false } },
    'zh-hant': { meta: { enabled: false } },
  },
},
```

Omitir no desactiva, porque se combina con valores predeterminados. Pon explícitamente `meta.enabled: false`. El idioma predeterminado siempre permanece activo: con `defaultLocale: 'zh'` no puedes esperar ocultar zh desactivándolo.

Desactivar elimina su entrada del selector y detiene páginas estándar, sin borrar entradas. Reactivar recupera el contenido conservado. Cambiar código cambia directorios y URLs, no solo etiqueta; los sitios existentes deben gestionar sus enlaces antiguos.

## 2. Elegir la dirección de inicio predeterminada

Añade o edita `routing` en el `i18n` existente:

```ts
i18n: {
  defaultLocale: 'zh',
  routing: { defaultLocalePrefix: 'never' },
},
```

Con zh como ejemplo predeterminado:

| Ajuste                     | `/`                           | `/zh/`                     | `/en/`                        |
| -------------------------- | ----------------------------- | -------------------------- | ----------------------------- |
| `'always'`, predeterminado | Redirección estática a `/zh/` | Inicio chino               | Inicio inglés, si está activo |
| `'never'`                  | Inicio chino directamente     | Redirección estática a `/` | Inicio inglés, si está activo |

La configuración decide el idioma predeterminado; el idioma del navegador no lo cambia automáticamente. Las redirecciones son HTML generado sin servidor de aplicación y pueden mostrar brevemente un aviso.

**Solo afecta al inicio del idioma predeterminado.** Blog, entradas, About, Decoder y Fragments chinos conservan `/zh/`, por ejemplo `/zh/blog/my-first-post/`, no `/blog/my-first-post/`. Cambiar el predeterminado no mueve ni traduce archivos.

## 3. Proporcionar textos de inicio e interfaz por idioma

Configúralos bajo su idioma, por ejemplo:

```ts
i18n: {
  locales: {
    zh: {
      meta: { label: '简体中文' },
      site: {
        homeTitle: '小林的数字花园',
        hero: '记录开发、阅读和生活。',
      },
      messages: {
        siteDescription: '小林的个人博客，分享项目和学习笔记。',
        nav: { home: '首页', blog: '文章', about: '关于我' },
      },
    },
    en: {
      site: {
        homeTitle: "Lin's Digital Garden",
        hero: 'Notes on code, books and everyday life.',
      },
      messages: { siteDescription: 'Projects and learning notes by Lin.' },
    },
  },
},
```

- `meta.label` es la etiqueta del menú. Cambiar «简体中文» a «中文» no renombra zh ni sus URLs.
- `site.homeTitle` cambia solo el título visible de inicio de ese idioma. El nombre global sigue en `site.title` superior o su sustitución de entorno.
- `site.hero` es la presentación visible bajo el título.
- `messages.siteDescription` son metadatos de inicio, no la presentación. Cambiar solo `site.description` superior puede no sustituir la descripción integrada.
- `messages.nav` cambia etiquetas sin cambiar rutas ni artículos.

Asimismo, `i18n.locales.<locale>.about` cambia About localizado y los módulos `messages` sus textos de interfaz. About y Decoder siguen necesitando sus controles globales; traducir no activa páginas. Consulta ejemplos en [personalizar páginas y funciones](/es/blog/starter-guide-3-comments-about-and-theme-toggles/).

Consulta metadatos/direcciones en [idiomas](/es/blog/config-languages/#registry) y los tres textos diferentes de inicio en [campos de inicio](/es/blog/config-home/#home-title).

## 4. Entender de dónde vienen los valores omitidos

`meta.fallback` elige idiomas de respaldo de configuración. Para usar inglés en la configuración china simplificada ausente, combina:

```ts
i18n: {
  locales: {
    zh: { meta: { fallback: ['en'] } },
  },
},
```

en debe existir en el registro. Los idiomas no predeterminados reciben el predeterminado como respaldo necesario. Se filtran autorreferencias, duplicados y desconocidos. Los arrays se sustituyen completos: indica todo el orden deseado.

Cada campo tiene sus reglas:

| Contenido                              | Comportamiento actual                                                                                                                                            |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `messages` normales                    | Parte del inglés integrado y combina paquetes y ajustes personales por la cadena, con mayor prioridad al actual. Las traducciones integradas también participan. |
| `homeTitle` de inicio                  | Busca título recortado no vacío en idioma actual y respaldos; después usa nombre global.                                                                         |
| `hero` de inicio                       | Usa el primer valor definido; `''` vacía explícitamente y detiene el respaldo.                                                                                   |
| About                                  | Parte del About predeterminado y combina ajustes personales por la cadena.                                                                                       |
| `messages.home.transmission` de inicio | Valor personal actual → personal inglés → `Knock, knock.`, fuera de la cadena normal completa.                                                                   |

Cambiar la navegación inglesa no sustituye automáticamente la china integrada. Pon ajustes en el idioma que quieras cambiar. Desactivar páginas no borra configuración; sus valores registrados aún pueden participar como respaldo.

El respaldo solo completa configuración e interfaz. No añade entradas inglesas al blog chino ni genera traducciones. No traduce contenido.

## 5. Añadir un idioma nuevo

Por ejemplo, añade fr a locales manteniendo los ajustes anteriores de activación:

```ts
i18n: {
  locales: {
    fr: {
      meta: {
        label: 'Français',
        hreflang: 'fr',
        ogLocale: 'fr_FR',
        enabled: true,
        fallback: ['en'],
      },
      site: {
        homeTitle: 'Le jardin de Lin',
        hero: 'Notes de lecture et projets.',
      },
      messages: {
        siteDescription: 'Le blog personnel de Lin.',
        nav: { home: 'Accueil', blog: 'Articles', about: 'À propos' },
      },
    },
  },
},
```

fr es el código de directorio/ruta. Usa códigos normalizados en minúsculas. La creación acepta dos o tres letras y un sufijo opcional con guion, como `fr`, `pt-br` o `zh-hant`, no rutas ni espacios. Este ejemplo conserva el predeterminado, sin convertir francés en tal.

`hreflang` identifica alternativas de idioma y usa el código como respaldo. `ogLocale` es idioma/región Open Graph, como fr_FR, no formato de URL. Ninguno traduce ni garantiza indexación.

Un idioma nuevo no tiene paquete integrado completo. El ejemplo traduce algunas entradas; lo demás usa respaldo. Para una interfaz francesa completa, proporciona textos de búsqueda, paginación, comentarios, herramientas y About que utilices. Empieza por las zonas visibles; no necesitas modificar la implementación del tema solo para mostrar una entrada.

## 6. Añadir la traducción de una entrada

Crea estructuras china e inglesa equivalentes:

```bash
npm run new-post -- my-first-post --locales zh,en
```

Escribe chino en `src/content/blog/zh/my-first-post.md` e inglés en `src/content/blog/en/my-first-post.md`. Para el idioma nuevo, usa `npm run new-post -- french-note --locales fr` y escribe su contenido.

Para traducir una entrada china existente, cópiala al directorio destino con mismo nombre base y traduce título, descripción y cuerpo. Las imágenes relativas se resuelven desde el archivo nuevo; revisa rutas si cambia la profundidad. La creación omite existentes sin sobrescribirlos.

Se compara el slug completo sin directorio de idioma. zh/my-first-post y en/my-first-post coinciden; renombrar inglés a my-story crea otra entrada aun con título idéntico. Las rutas anidadas también deben coincidir.

El menú abre traducción de mismo slug si existe; si no, la lista del idioma. Los enlaces SEO alternativos solo anuncian traducciones reales activas, sin etiquetar una lista como traducción.

`--locales` elige archivos sin activar idiomas. Sin él, `ANGLEFEINT_LOCALES` prima sobre idiomas activos; los argumentos explícitos priman sobre entorno. Crear estructuras y traducir cuerpos son acciones separadas.

## 7. Idiomas de fragments y otras páginas

Los fragments se relacionan por `id` de frontmatter, no nombre. Copia uno al idioma destino, conserva id/pubDate y traduce título/cuerpo. Repetir new-fragment crea otra identidad, no una traducción.

Una ejecución `npm run new-fragment -- --locales zh,en` crea estructuras con ID/hora compartidos. Cambiar idioma de lista siempre abre la primera página destino, sin garantizar el mismo fragment traducido. Consulta [fragments](/es/blog/starter-guide-5-fragments/).

Compartir comentarios de artículos necesita `theme.comments.shareAcrossLocales`, apagado por defecto. Fragments comparte por ID. Idioma de interfaz y asociación de discusiones son diferentes; las respuestas no se traducen. Consulta [comentarios](/es/blog/starter-guide-4-giscus-comments/).

Las páginas Astro de `new-page` generan rutas activas desde un archivo. Proporciona tú contenido según idioma; no copia ni traduce fuentes separadas por idioma.

## 8. Comprobar lo modificado

En dev, abre los inicios de todos los idiomas activos y revisa etiquetas, título/presentación y About. Prueba una entrada con traducción y otra sin ella. Los directorios y códigos configurados deben coincidir exactamente.

Detén dev antes de publicar y ejecuta:

```bash
npm run doctor
npm run preview
```

doctor comprueba y compila; no repitas check/build inmediatamente. Comprueba la búsqueda de cada idioma en preview compilado: busca solo el idioma actual, no una colección multilingüe combinada. El `/<locale>/rss.xml` de cada idioma activo solo tiene sus entradas.

Confirma dominio y despliega todo `dist/`. Controles de idioma, direcciones y contenido necesitan recompilar; editar localmente no actualiza producción. Retira salidas antiguas: desactivar idiomas no genera redirecciones para URLs viejas.

| Síntoma                                | Qué revisar primero                                                       |
| -------------------------------------- | ------------------------------------------------------------------------- |
| Un idioma no deseado sigue en menú     | ¿Solo eliminaste su ajuste en vez de enabled: false?                      |
| No puedes desactivar el predeterminado | ¿Sigue siendo defaultLocale? Elige otro antes.                            |
| Archivo creado sin página              | Idioma activo, código exacto y compilación nueva.                         |
| Sigue apareciendo inglés               | Sustituciones incompletas del nuevo idioma o falta About.                 |
| Cambiar título no afecta               | ¿Es site.title global, homeTitle/hero o messages? Revisa también entorno. |
| Cambiar idioma abre lista              | Falta traducción de mismo slug; es el respaldo actual.                    |
| Entradas conservan prefijo con never   | Solo cambia el inicio predeterminado; es normal.                          |

Consulta [instalación](/es/blog/starter-guide-1-configure-your-site/) para identidad/actualización y [escritura](/es/blog/starter-guide-2-languages-and-routing/) para publicar a diario.

## Navegación de tutoriales y diccionario de configuración

[Anterior: permitir comentarios](/es/blog/starter-guide-4-giscus-comments/) · [Siguiente: publicar en tu dominio](/es/blog/starter-guide-deployment/) · [Los ocho tutoriales](/es/blog/starter-guide-1-configure-your-site/#tutorial-order).

Campos relacionados: [idiomas, direcciones y respaldo](/es/blog/config-languages/), [comentarios compartidos](/es/blog/config-comments/). Rutas, valores y límites en el [índice](/es/blog/config-reference/).
