---
tags: ['anglefeint', 'config']
title: 'Referencia de configuración: idiomas, direcciones y respaldo'
subtitle: 'Registro, traducciones de interfaz y prioridades'
description: 'Tipos, valores, restricciones y ejemplos de activación de idiomas, URLs y resolución de textos.'
pubDate: '2026-11-13'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/hacker-01.webp'
---

Las cadenas chinas de los ejemplos bajo `locales.zh` son intencionales: ilustran cómo personalizar el contenido chino sin cambiar los demás idiomas. Los valores predeterminados chino/inglés de las tablas son citas del tema, no traducciones pendientes.

Para activar idiomas o publicar traducciones paso a paso, empieza por [idiomas](/es/blog/starter-guide-languages/). Consulta el archivo en [instalación](/es/blog/starter-guide-1-configure-your-site/) y otros módulos en el [índice](/es/blog/config-reference/).

Cubre registro i18n, direcciones y resolución, sin repetir todos los textos de cada módulo. Inicio, artículos, Fragments, About, Decoder, música y comentarios tienen sus referencias. Valores del paquete, no del demo.

<a id="registry"></a>

## i18n.defaultLocale e i18n.locales

| Ruta completa           | Tipo / predeterminado del tema                                  | Estado, función y límites                                                                                                                                                            | Ejemplo                                                    |
| ----------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------- |
| i18n.defaultLocale      | string / 'en'                                                   | Activo: idioma/redirección raíz, respaldo obligatorio y enlaces predeterminados. Vacío normaliza a en. Sin detección de navegador. Predeterminado siempre activo, aun enabled: false | i18n: { defaultLocale: 'zh' }                              |
| i18n.locales            | Record<string, LocaleConfig> / nueve idiomas integrados abajo   | Activo: claves definen códigos, directorios y URLs. Combinación recursiva: omitir integrado no lo borra. Nuevos requieren textos/contenido propios                                   | i18n: { locales: { fr: { meta: { label: 'Français' } } } } |
| `i18n.locales.<locale>` | LocaleConfig parcial / integrados con ajustes, nuevos sin ellos | Activo: contiene meta, site, messages, about y aiReadableContent. Omitidos siguen combinación/respaldo; {} no limpia idioma                                                          | locales: { zh: { meta: { enabled: false } } }              |

La clave no es etiqueta de menú ni hreflang. EN no normaliza a en, ni directorios zh-CN a zh. Usa códigos minúsculos coherentes en directorios, config y creación: zh, en, pt-br, zh-hant. Scaffolding admite dos/tres letras y segmento opcional con guion. La normalización runtime no valida integralmente códigos/rutas: no uses rutas ni puntuación arbitraria.

Si el predeterminado no está registrado, se añade etiquetado con su código. No prepara contenido ni traducciones. Cambiar defaultLocale no mueve archivos.

### Valores integrados reales

Sin ajustes, nueve activos. en predeterminado no tiene respaldo; otros usan en. Orden de registro, no meta.label. Sin campo de orden independiente.

| Código    | meta.label         | meta.hreflang | meta.ogLocale | enabled efectivo | fallback efectivo |
| --------- | ------------------ | ------------- | ------------- | ---------------- | ----------------- |
| `en`      | English            | `en`          | `en_US`       | true             | `[]`              |
| `ja`      | 日本語             | `ja`          | `ja_JP`       | true             | `["en"]`          |
| `ko`      | 한국어             | `ko`          | `ko_KR`       | true             | `["en"]`          |
| `es`      | Español            | `es`          | `es_ES`       | true             | `["en"]`          |
| `zh`      | 简体中文           | `zh-CN`       | `zh_CN`       | true             | `["en"]`          |
| `pt-br`   | Português (Brasil) | `pt-BR`       | `pt_BR`       | true             | `["en"]`          |
| `de`      | Deutsch            | `de`          | `de_DE`       | true             | `["en"]`          |
| `ru`      | Русский            | `ru`          | `ru_RU`       | true             | `["en"]`          |
| `zh-hant` | 繁體中文           | `zh-Hant`     | `zh_TW`       | true             | `["en"]`          |

<a id="meta"></a>

## `i18n.locales.<locale>.meta`: cinco metadatos

Los campos relativos van dentro de meta. Valores integrados arriba y normalización de nuevos abajo. Entrada parcial: no necesitas reescribir todos.

| Ruta relativa | Tipo / si se omite en idioma nuevo                                                      | Estado, función y límites                                                                                                                                            | Ejemplo      |
| ------------- | --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| meta.label    | string / código de idioma                                                               | Activo: opción del menú. Vacío usa código; espacios no se recortan. No renombra directorios/URLs                                                                     | 'Français'   |
| meta.hreflang | string opcional / código                                                                | Activo: html lang, hreflang y parte de datos estructurados. No cambia clave de ruta. Vacío usa código; sin validar formato                                           | 'fr'         |
| meta.ogLocale | string opcional / sin definir                                                           | Condicional: locale Open Graph y alternativas. Omitido/vacío omite etiqueta; no deduce región. Vacío borra integrado                                                 | 'fr_FR'      |
| meta.enabled  | boolean opcional / true                                                                 | Activo: solo false desactiva no predeterminado. Predeterminado siempre activo. Afecta estándar/menú, no archivos ni páginas propias; no control de acceso            | false        |
| meta.fallback | string[] opcional / no predeterminado añade predeterminado; predeterminado inicia vacío | Activo: cadena directa de configuración. Arrays sustituyen; elimina sí mismo, duplicados, vacíos y desconocidos. No predeterminado siempre incluye al predeterminado | ['zh', 'en'] |

hreflang y ogLocale son distintos y no sustituyen clave. Metadatos nuevos no se vuelven regionalmente correctos solos; usa valores acordes al contenido.

<a id="routing"></a>

## i18n.routing.defaultLocalePrefix: dirección del inicio predeterminado

- **Tipo / predeterminado:** 'always' | 'never' / 'always'.
- **Estado y función:** activo; actualmente solo cambia entrada canonical del inicio predeterminado, no todos sus prefijos. Vacío fuera del tipo; runtime trata inválidos como always, sin depender de ello.
- **Límites:** no genera /blog/, /about/, etc. sin prefijo. Recompila/despliega. No migra enlaces ni redirecciones del alojamiento.
- **Ejemplo:** i18n: { routing: { defaultLocalePrefix: 'never' } }.

Suponiendo defaultLocale en:

| Dirección         | always                           | never                         |
| ----------------- | -------------------------------- | ----------------------------- |
| /                 | Redirección HTML estática a /en/ | Inicio inglés                 |
| /en/              | Inicio inglés                    | Redirección HTML estática a / |
| /en/blog/         | Lista inglesa                    | Lista inglesa                 |
| /en/blog/my-post/ | Artículo inglés                  | Artículo inglés               |
| /en/about/        | About inglés, si activo          | About inglés, si activo       |
| /zh/              | Inicio chino, si activo          | Inicio chino, si activo       |

Las redirecciones son meta-refresh estático con canonical/noindex. No detectan ubicación ni configuran 301. Helpers internos suelen crear `/<locale>/.../`; cada entrada decide usar raíz.

<a id="overrides"></a>

## Dónde sustituir site, messages y about

Prefijo `i18n.locales.<locale>`. Objetos se combinan recursivamente; arrays sustituyen; undefined no sobrescribe. Vacío, false y [] se mantienen e interpretan por campo.

| Ruta relativa  | Tipo / predeterminado                                                                           | Función, límites y ejemplo                                                                                                                                           | Referencia                                           |
| -------------- | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| site           | { homeTitle?: string; hero?: string } / ajustes de inicio integrados                            | Solo inicio localizado; no sustituye identidad superior. Ejemplo site: { homeTitle: 'Mi blog' }                                                                      | [Inicio](/es/blog/config-home/#site-fallbacks)       |
| site.homeTitle | string opcional / sin definir                                                                   | Primer título recortado no vacío en cadena directa, después SITE_TITLE. Ejemplo 'Mi blog'. Vacío no detiene respaldo                                                 | [Título de inicio](/es/blog/config-home/#home-title) |
| site.hero      | string opcional / presentación integrada; nuevos sin definir                                    | Primer definido en cadena. Vacío limpia y detiene. Sin ninguno, messages.home.hero es último respaldo. Ejemplo 'Proyectos y vida cotidiana.'                         | [Presentación](/es/blog/config-home/#home-hero)      |
| messages       | DeepPartial<Messages> / sustituciones locales normalmente sin definir; runtime añade integrados | Botones, estados, metadescripciones, etc. Ejemplo messages: { nav: { home: 'Inicio' } }. Solo texto, no funciones ni traducción de cuerpos                           | [Índice](/es/blog/config-reference/)                 |
| about          | DeepPartial<AboutConfig> / About integrado localizado                                           | Combina cadena recursivamente sobre About base. Ejemplo about: { sections: { who: 'Me dedico al desarrollo de software.' } }. No lee cuerpo Markdown automáticamente | [About](/es/blog/config-about/#about-content)        |

Valores hero exactos integrados a continuación. No existe homeTitle en defaults:

| Idioma    | Predeterminado site.hero                                                                   |
| --------- | ------------------------------------------------------------------------------------------ |
| `en`      | Write a short introduction for your site and what readers can expect from your posts.      |
| `ja`      | このサイトの紹介文と、読者がどんな記事を期待できるかを書いてください。                     |
| `ko`      | 사이트 소개와 방문자가 어떤 글을 기대할 수 있는지 간단히 작성하세요.                       |
| `es`      | Escribe una breve presentación del sitio y qué tipo de contenido encontrarán tus lectores. |
| `zh`      | 在这里写一段站点简介，并告诉读者你将发布什么类型的内容。                                   |
| `pt-br`   | Apresente seu site e conte o que os leitores encontrarão nos seus artigos.                 |
| `de`      | Stelle deine Website kurz vor und beschreibe, was Leser in deinen Beiträgen erwartet.      |
| `ru`      | Кратко представьте свой сайт и расскажите, какие статьи здесь найдут читатели.             |
| `zh-hant` | 簡短介紹你的網站，並告訴讀者這裡會有哪些內容。                                             |

<a id="fallback"></a>

## Orden exacto de respaldo

Con fr actual y meta.fallback efectivo ['zh', 'en'], usa fr → zh → en directamente o combina al revés. No expande el fallback de zh. Para incluir ja, añádelo a fr explícitamente.

1. Omitir fallback o usar [] aún añade predeterminado a no predeterminados. El predeterminado puede no tener o indicar otros registrados.
2. Elimina sí mismo, duplicados y desconocidos. Comprueba registro, no activación: desactivados aún pueden dar configuración.
3. Si falta el predeterminado en un no predeterminado, se añade. Si ya está, conserva su posición, no se mueve al final.
4. messages parte de inglés integrado, recorre cadena efectiva al revés y combina paquete integrado seguido de ajustes propios. La traducción integrada actual puede superar texto personal de respaldo.

Por eso en nav.home 'Start' no cambia «首页» integrado zh. Sustituye zh.messages.nav.home directamente. Idiomas nuevos sin paquete heredan interfaz, no traducción completa automática.

Cada contenido usa algoritmo distinto:

| Contenido                      | Conducta actual                                                                                                                   |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| messages normales              | Inglés integrado → integrados/ajustes de respaldo → integrados/ajustes actuales                                                   |
| site.homeTitle                 | Primer recortado no vacío de cadena directa, después nombre global                                                                |
| site.hero                      | Primer definido de cadena directa; vacío detiene búsqueda                                                                         |
| about                          | Parte de DEFAULT_ABOUT_CONFIG y combina cadena directa al revés                                                                   |
| messages.home.transmission     | Caso especial: personal actual → personal inglés → texto de autor inglés integrado. No usa cadena completa. Actual: Knock, knock. |
| aiReadableContent              | Campos del idioma sustituyen global, sin meta.fallback. Véase abajo                                                               |
| Cuerpos de artículos/fragments | Sin respaldo de mensajes; cada idioma lee solo su contenido                                                                       |

No añade artículos ingleses a listas chinas, genera archivos traducidos, rellena inicio con otros idiomas ni relaciona slugs distintos.

<a id="common-messages"></a>

## Selector y textos compartidos

Strings opcionales en `i18n.locales.<locale>.messages`, resolución normal. siteTitle localizado no cambia identidad estándar; tipo, valor y estado sin uso en [sitio](/es/blog/config-site-chrome/#legacy-site-title).

| Campo relativo  | Predeterminado chino simplificado / inglés                                                       | Estado, función y límites                                                                                                         | Ejemplo                                   |
| --------------- | ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| langLabel       | 语言 / Language                                                                                  | Activo: tooltip/nombre accesible de selector, no opciones. Estas usan meta.label                                                  | 'Elegir idioma'                           |
| siteDescription | 电影感网页界面与 AI 时代工程实践文章。 / Cinematic web interfaces and AI-era engineering essays. | Condicional: metadescripción de inicio, no presentación visible ni descripción de todas las páginas. Otras tienen fuentes propias | 'Mis proyectos y apuntes de aprendizaje.' |

Textos internos en cada módulo. Un tipo existente sin consumidor no se activa por ello. El iframe de comentarios también usa theme.comments.lang, inglés fijo por defecto; consulta [comentarios](/es/blog/config-comments/#appearance).

<a id="ai-context"></a>

## aiReadableContent: respaldo especial de complemento

`i18n.locales.<locale>.aiReadableContent` sustituye notes / links globales independientemente, sin meta.fallback. Omitidos heredan. notes vacío o links [] limpian explícitamente; {} no limpia global.

Tipos, valores, validación y ejemplos en [contexto IA](/es/blog/config-analytics-ai/#locale-supplement). No es traducción ni cuerpo About: todo es público. Enlaces relativos a raíz publicada; / inicial evita base. Consulta [resolución](/es/blog/config-analytics-ai/#supplement).

<a id="examples"></a>

## Ejemplos para combinar

Combina en defineThemeConfig({...}) de src/site.config.ts conservando ajustes sin duplicar i18n. Los objetos siguen combinándose con nueve idiomas: mencionar dos no desactiva otros.

### Mantener solo páginas chinas

```ts
i18n: {
  defaultLocale: 'zh',
  routing: { defaultLocalePrefix: 'always' },
  locales: {
    zh: { meta: { enabled: true, label: '中文' } },
    en: { meta: { enabled: false } },
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

zh predeterminado no puede desactivarse. Inglés desactivado aún da respaldo registrado. Para inicio raíz, cambia always a never; artículos siguen en /zh/blog/.../.

### Añadir francés y sus textos

```ts
i18n: {
  locales: {
    fr: {
      meta: {
        label: 'Français',
        hreflang: 'fr',
        ogLocale: 'fr_FR',
        enabled: true,
        fallback: ['zh', 'en'],
      },
      site: {
        homeTitle: 'Mon blog',
        hero: 'Mes projets et mes notes.',
      },
      messages: {
        langLabel: 'Langue',
        nav: { home: 'Accueil', blog: 'Articles', about: 'À propos' },
      },
    },
  },
},
```

Solo aporta algunos mensajes, no paquete completo. Publica en src/content/blog/fr/ y src/content/fragments/fr/. Creación genera estructuras de idiomas activos sin traducir cuerpos.

<a id="content-and-seo"></a>

## Límites de URLs, cambio de idioma y SEO

- Menú lista idiomas activos y normalmente conserva subruta; rutas específicas pueden dar destinos propios. No garantiza encontrar traducciones en cualquier página.
- Artículos estándar buscan slug completo sin directorio. Enlazan traducción existente o Blog List destino. SEO solo declara mismas-slug reales, nunca lista como traducción. Falta de traducción predeterminada no inventa x-default.
- Fragments abre primera página destino sin buscar ID actual. Compartir discusiones por ID es separado. Desactivar no borra archivos ni discusiones GitHub.
- meta.label solo cambia texto; claves cambian URLs/directorios. No migra enlaces. No elige idioma por Accept-Language, navegador ni país.
- messages configura texto, no renderizador universal HTML/Markdown. Consulta saltos, arrays y formato por módulo. Sustituir arrays no añade funciones ni menús.
- Sin languageOrder, autoDetect, traducción automática ausente, rutas globalmente sin prefijo ni lista musical por idioma. localeHrefs / seoLocaleHrefs son props, no site.config.

Recarga desarrollo al guardar; recompila/despliega producción. Desactivar idiomas no limpia hosting antiguo ni protege contenido privado. Vuelve al [índice](/es/blog/config-reference/).
