---
tags: ['anglefeint', 'config']
title: 'Referencia de configuración: sitio, navegación, redes y pie'
subtitle: 'Identidad global y componentes públicos compartidos'
description: 'Tipos, valores, entorno y límites de site, social, navegación y footer.'
pubDate: '2026-11-13'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/matrix-01.webp'
---

Para sustituir tus datos, empieza por [instalación e identidad](/es/blog/starter-guide-1-configure-your-site/). El dominio está en [despliegue](/es/blog/starter-guide-deployment/). Otros módulos en el [índice](/es/blog/config-reference/).

Configura en src/site.config.ts. Los valores son del paquete, no nombre, cuentas o dominio del autor del demo. Combina en defineThemeConfig({...}) conservando imports, exports y demás módulos.

<a id="identity"></a>

## site: seis campos globales de identidad

Objeto con campos omitibles en entrada parcial. Son condicionales: cada consumidor usa su valor, pero entorno o parámetros de página más específicos pueden primar.

| Ruta completa      | Tipo            | Predeterminado del tema                                                                 | Función, límites y ejemplo                                                                                                                                                                              |
| ------------------ | --------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `site.title`       | string          | `"My Blog"`                                                                             | Marca de cabecera, copyright, RSS, datos estructurados y algunos textos/imágenes compartidas. No es el título visible de inicio. Sin respaldo universal ante vacío. Ejemplo `"Mi blog"`                 |
| `site.description` | string          | `"Cinematic web interfaces, AI-era engineering notes, and system architecture essays."` | Una fuente de descripción global/para máquinas. Inicio prefiere messages.siteDescription; About/listas tienen propias. No cambia todas las páginas. Ejemplo `"Proyectos, lecturas y vida cotidiana."`   |
| `site.url`         | string          | `"https://example.com"`                                                                 | URL pública absoluta para Astro site, canonical, RSS, sitemap y exportación. HTTP(S) real, no entrada. No compra dominio ni configura DNS/certificados/despliegue. Ejemplo `"https://blog.example.com"` |
| `site.author`      | string          | `"Your Name"`                                                                           | Autor predeterminado/datos estructurados, sustituible por entrada. Copyright usa site.title, no author; About/email no se actualizan. Ejemplo `"Álex"`                                                  |
| `site.tagline`     | string          | `""`                                                                                    | Frase adicional del pie recortada. Vacío se oculta. Antiguo valor exacto Built with Astro. también se omite para evitar duplicar. Ejemplo `"Mantén la curiosidad y sigue creando."`                     |
| `site.ogImage`     | string opcional | `""`                                                                                    | Imagen global sin otra prioritaria. Vacío usa integrada. Ruta pública local o HTTPS, no avatar ni sustitución masiva de heroImage. Ejemplo `"/images/share.webp"`                                       |

site.title difiere de `i18n.locales.<locale>.site.homeTitle`: primero identidad global, segundo solo título visible localizado. Este busca valor no vacío en cadena y al final nombre global. Consulta [título de inicio](/es/blog/config-home/#home-title). messages.siteTitle no controla actualmente ninguno; no cambia marca con él.

site.description tampoco es presentación visible: usa `i18n.locales.<locale>.site.hero`; metadatos de inicio tienen messages.siteDescription. Consulta [prioridad de inicio](/es/blog/config-home/#site-fallbacks). Cambiar identidad global no reescribe perfil About existente.

### Prioridad y rutas de imagen compartida

El head usa site.ogImage solo sin imagen de página. ogImage individual, automáticas o portada pueden primar; consulta [frontmatter](/es/blog/config-article/#frontmatter). Con generación automática global no esperes sustituir todas las imágenes con site.ogImage.

/images/share.webp corresponde a public/images/share.webp y debe existir antes. Ausentes, fuera de publicDir o rutas inválidas fallan al resolver respaldo. Locales reciben base y parámetro de versión de contenido. HTTPS mantiene URL sin validar descarga. Vacío/espacios usa imagen integrada, no elimina metadatos.

site.ogImage usa strings, no objetos de import Astro. frontmatter.ogImage admite otros tipos. Sin PUBLIC_SITE_OG_IMAGE. No cambia heroImage.

<a id="environment"></a>

## Sustituciones de entorno y prioridad del dominio

Son variables, no campos site.config adicionales. Todas strings; sin definir usan su campo site. La coalescencia nula no trata vacío como ausente.

| Variable de entorno     | Sustituye        | Ejemplo                                     |
| ----------------------- | ---------------- | ------------------------------------------- |
| PUBLIC_SITE_TITLE       | site.title       | PUBLIC_SITE_TITLE=Mi blog                   |
| PUBLIC_SITE_DESCRIPTION | site.description | PUBLIC_SITE_DESCRIPTION=Proyectos y apuntes |
| PUBLIC_SITE_AUTHOR      | site.author      | PUBLIC_SITE_AUTHOR=Lin                      |
| PUBLIC_SITE_TAGLINE     | site.tagline     | PUBLIC_SITE_TAGLINE=Mantén la curiosidad    |
| PUBLIC_SITE_URL         | site.url         | PUBLIC_SITE_URL=https://blog.example.com    |

La integración lee PUBLIC_SITE_URL mediante modos dotenv Vite de dev/build/--mode y alinea Astro site con URLs públicas. Entorno de proceso prima sobre dotenv. No cambies solo site.url olvidando PUBLIC_SITE_URL del alojamiento. Vacío puede borrar texto o invalidar URL; no restaura defaults.

SITE_URL de página conserva import.meta.env.SITE como respaldo intermedio: PUBLIC_SITE_URL → SITE → site.url. Integración estándar establece Astro site desde entorno o configuración y head prefiere Astro.site. SITE es compatibilidad de adaptador, no segundo dominio recomendado.

Dominio y subruta son distintos. Configura base, salida y DNS/HTTPS según tutorial. Añadir subdirectorio a site.url no mueve todo. Reinicia dev y recompila/despliega producción; no configura redirecciones de servidor.

<a id="navigation"></a>

## Navegación pública: entradas fijas y controles

Sin array nav público, orden ni elementos personalizados. La cabecera se compone así:

| Posición                | Origen y límites actuales                                                                        |
| ----------------------- | ------------------------------------------------------------------------------------------------ |
| Marca                   | site.title / entorno; enlaza al inicio del idioma actual                                         |
| Inicio, Blog            | Entradas estándar siempre presentes. Etiquetas messages.nav.home / blog; texto no cambia destino |
| About                   | theme.enableAboutPage, boolean true. theme: { enableAboutPage: false } quita página y entrada    |
| Decoder bajo Frontier   | theme.enableDecoderPage, boolean true. Etiqueta fija Decoder Lab                                 |
| Fragments bajo Frontier | theme.fragments.enabled, boolean false. Etiqueta messages.fragments.title                        |
| Contacto bajo Frontier  | Con About activo; messages.about.contact y /about/#contact del idioma. Independiente de Decoder  |
| Búsqueda                | theme.search.enabled, boolean true. Consulta [búsqueda](/es/blog/config-search/#enabled)         |
| Idioma y estado         | Idiomas activos, meta.label y textos estáticos de abajo. No son listas de enlaces arbitrarios    |

Frontier es fijo; solo se omite sin hijos. messages.decoderPage.fullTool afecta página completa y enlace del pie, no Decoder Lab fijo de cabecera.

Para idiomas/URLs consulta [límites de idiomas](/es/blog/config-languages/#content-and-seo). About, Fragments y Decoder conservan sus diccionarios. Etiquetas vacías no desactivan navegación y pueden dejar botones confusos o destinos retenidos.

<a id="chrome-messages"></a>

### Siete textos de cabecera y pie

Prefijo `i18n.locales.<locale>.messages`. Strings opcionales con textos integrados/respaldo. Solo chino simplificado / inglés. Condicionales a existencia de zona. Texto plano, no Markdown/HTML arbitrario.

| Campo relativo     | Predeterminado chino simplificado / inglés | Función y límites                                         | Ejemplo               |
| ------------------ | ------------------------------------------ | --------------------------------------------------------- | --------------------- |
| `nav.home`         | 首页 / Home                                | Texto de inicio, no cambia ruta                           | `"Inicio"`            |
| `nav.blog`         | 博客 / Blog                                | Texto de blog, no cambia ruta                             | `"Entradas"`          |
| `nav.about`        | 关于 / About                               | Texto de About, usado también para reabrir ventana        | `"Sobre mí"`          |
| `nav.status`       | system: online / system: online            | Estado estático; no vigila redes, APIs ni servicios       | `"Sistema conectado"` |
| `nav.statusAria`   | 系统状态 / System status                   | Nombre accesible del estado, no control de monitorización | `"Estado del sitio"`  |
| `footer.theme`     | 主题： / Theme by                          | Prefijo de crédito; enlace/nombre Anglefeint fijos        | `"Tema de"`           |
| `footer.builtWith` | 构建工具： / Built with                    | Prefijo de crédito Astro; enlace/nombre fijos             | `"Creado con"`        |

messages.langLabel nombra el control; opciones usan meta.label. Consulta [textos de idioma](/es/blog/config-languages/#common-messages). Contacto y Fragments reutilizan sus mensajes, sin nuevos nav.

<a id="social"></a>

## social.links: redes compartidas

- **Tipo / predeterminado:** SocialLink[] / []; cinco campos abajo.
- **Estado y función:** activo. Cabecera/pie comparten orden. Sustituye todo array, sin límite público ni variante por idioma.
- **Límites:** [] no oculta todo: muestra iconos Mastodon, Twitter y GitHub no pulsables, con aviso en dev. Un elemento real con href vacío sigue siendo enlace, no icono de referencia.
- **Ejemplo:** [{ label: 'GitHub', href: 'https://github.com/yourname', icon: 'github' }].

El email/GitHub de About es independiente; no actualiza su párrafo. Sin theme.social.enabled ni hidePlaceholders. showPlaceholdersWhenEmpty es prop del layout.

<a id="social-fields"></a>

### Cinco campos de SocialLink

Prefijo social.links[]. Los obligatorios no tienen valores automáticos. Aunque los tipos parciales acepten elementos parciales, aporta entradas completas válidas.

| Campo   | Tipo / predeterminado                                                  | Estado, función y límites                                                                                                                                    | Ejemplo                       |
| ------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------- |
| href    | string obligatoria / ninguno                                           | Activo: destino sin validación unificada de protocolo, acceso o vacío ni BASE_URL automático. Usa HTTPS completo o ruta interna correcta; no verifica cuenta | 'https://github.com/yourname' |
| label   | string obligatoria / ninguno                                           | Activo: nombre accesible y texto sin icono. No busca títulos/nombres automáticamente. Usa etiqueta significativa no vacía                                    | 'GitHub'                      |
| rel     | string opcional / sin definir; salida con noopener noreferrer al menos | Activo: tokens por espacios, minúsculos y únicos; elimina opener y conserva protección. Vacío no quita protección; no string causa error                     | 'me nofollow'                 |
| icon    | SocialIcon integrado opcional / sin definir                            | Condicional: uno de doce nombres, sin iconSrc. Desconocidos no vacíos causan error. No deduce por URL. Sin iconos usa label                                  | 'github'                      |
| iconSrc | string opcional / sin definir                                          | Condicional: SVG/PNG/WebP local publicDir; ruta no vacía válida prima sobre icon. Espacios equivalen a omitido; no string/ruta inválida fallan               | '/icons/community.svg'        |

Los enlaces reales abren pestaña nueva. rel propio se combina con protección. label no interpreta HTML. Los nombres integrados son exactos y sensibles a mayúsculas:

```text
mastodon
twitter
github
youtube
bluesky
linkedin
discord
telegram
instagram
facebook
whatsapp
line
```

### Restricciones de iconos personalizados

public/icons/community.svg corresponde a iconSrc: '/icons/community.svg'. Debe estar en publicDir real, no assets del paquete ni src/assets. Empieza por un solo / y no puede ser URL, dirección //, consulta/fragmento, ruta porcentual ni contener segmentos . / ... Rechaza barras invertidas, dos puntos y controles.

La compilación exige archivo regular real dentro de publicDir; rechaza escape por symlink. Codifica espacios normales y nombres chinos: no precodifiques. Añade base a iconos, sin cambiar href. No admite JPG/GIF aquí.

Con iconSrc válido, icon no participa. Tamaño/espaciado son props, no campos SocialLink.

<a id="footer"></a>

## theme.footer: enlaces y créditos

| Ruta completa              | Tipo / predeterminado                  | Estado, función y límites                                                                                                                      | Ejemplo                                                       |
| -------------------------- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| theme.footer.showCredits   | boolean / true                         | Activo: créditos enlazados del tema/Astro sin quitar copyright, redes, tagline ni enlaces. También crédito de imágenes automáticas, no propias | false                                                         |
| theme.footer.links         | { label: string; href: string }[] / [] | Activo: enlaces en orden; sustituye todo array, no cabecera. Layout puede añadir Decoder: [] no garantiza ausencia de enlaces                  | [{ label: 'Proyecto', href: 'https://example.com/project/' }] |
| theme.footer.links[].label | string obligatoria / ninguno           | Condicional: etiqueta visible plana, no obtenida del destino                                                                                   | 'Proyecto'                                                    |
| theme.footer.links[].href  | string obligatoria / ninguno           | Condicional: destino sin cambios, sin validación de iconos ni prefijo base. Proporciona rutas correctas. Misma pestaña por defecto             | 'https://example.com/project/'                                |

Enlaces propios preceden a los añadidos por layout, sin deduplicar. Decoder activo añade enlace de herramienta con messages.decoderPage.fullTool. Desactiva función si no la necesitas; vaciar footer.links no la quita.

Copyright usa año de compilación y SITE_TITLE efectivo, sin ajustes propios de año/copyright. site.tagline va separado. Se omite el antiguo valor recortado Built with Astro.. showCredits: false no elimina otras frases ni créditos ya presentes en imágenes.

<a id="examples"></a>

## Ejemplos de sitio y enlaces compartidos

Conserva datos ya configurados y combina solo lo necesario:

```ts
site: {
  title: 'El blog de Lin',
  description: 'Proyectos, lecturas y vida cotidiana.',
  url: 'https://blog.example.com',
  author: 'Lin',
  tagline: 'Mantén la curiosidad y sigue creando.',
},
social: {
  links: [
    { label: 'GitHub', href: 'https://github.com/yourname', icon: 'github' },
    { label: 'Página del proyecto', href: 'https://example.com/project/' },
  ],
},
theme: {
  footer: {
    showCredits: true,
    links: [{ label: 'Proyecto', href: 'https://example.com/project/' }],
  },
},
```

Sustituye cuentas, dominios y enlaces; el tema no verifica online. Prepara archivos antes de iconSrc o site.ogImage locales.

Para cambiar solo navegación/prefijos de crédito en español:

```ts
i18n: {
  locales: {
    es: {
      messages: {
        nav: { home: 'Inicio', blog: 'Entradas', about: 'Sobre mí' },
        footer: { theme: 'Tema de', builtWith: 'Creado con' },
      },
    },
  },
},
```

<a id="legacy-site-title"></a>

## Sin uso actual: messages.siteTitle

Ruta `i18n.locales.<locale>.messages.siteTitle`. String opcional; chino simplificado/inglés tienen 'Angle Feint'. Inicio e identidad estándar no lo leen: sin uso actual. siteTitle: 'Mi blog' no los renombra.

Usa `i18n.locales.<locale>.site.homeTitle` para título visible y site.title superior para marca. Consulta [inicio](/es/blog/config-home/#home-title) e [identidad](#identity). No necesitas este campo conservado para renombrar.

<a id="boundaries"></a>

## Compatibilidad y campos no consumidos

- Los seis site, sociales/pie y siete mensajes tienen consumidores, condicionados por prioridad de imagen, entorno y controles.
- Built with Astro. en site.tagline es compatibilidad especial de default antiguo; no significa desactivar cualquier tagline.
- messages.siteTitle no se consume. Tipo aceptado no implica consumidor.
- homeHref, localeHrefs, extraLinks, showPlaceholdersWhenEmpty e iconSize son props, no site.config. Sin nav público, control de iconos de referencia, plantilla copyright ni monitorización independiente.

Guarda/prepara archivos y recompila/despliega. Cambios de entorno requieren recargar modo pertinente. Confirma dominio, enlaces, cuentas y páginas reales en el despliegue; tipos locales no prueban éxito. Vuelve al [índice](/es/blog/config-reference/).
