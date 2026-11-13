---
tags: ['anglefeint', 'starter']
title: 'Guía 8: publicar el blog en tu dominio'
subtitle: 'Compilación estática, alojamiento y dominio público'
description: 'Verifica el blog, despliega todos los recursos y configura dominio, estadísticas y contexto público para IA.'
pubDate: '2026-11-13'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/ai-01.webp'
---

Las cadenas chinas de los ejemplos bajo `locales.zh` son intencionales: ilustran cómo personalizar el contenido chino sin cambiar los demás idiomas. Los valores predeterminados chino/inglés de las tablas son citas del tema, no traducciones pendientes.

Esta es la parte 8 de 8. [Consulta el orden completo](/es/blog/starter-guide-1-configure-your-site/#tutorial-order) · [Busca campos de configuración](/es/blog/config-reference/).

Cuando funcione localmente, publicar tiene tres tareas: confirmar dominio final, generar todos los archivos estáticos y hacer que el alojamiento los sirva en él. El tema no compra dominios, cambia DNS ni inicia sesión por ti.

El starter compila una web estática por defecto. Estas páginas no requieren servicio Node.js permanente ni adaptador SSR en producción. La guía supone npm y salida `dist/` predeterminada.

## 1. Confirmar la dirección pública

Prepara un dominio que controles, como `https://blog.example.com`. Combina en el `site` superior existente de `src/site.config.ts`:

```ts
site: {
  url: 'https://blog.example.com',
},
```

Usa la dirección pública final, no localhost, una entrada ni el panel del alojamiento. Conserva los otros ajustes.

Genera canonical, RSS, sitemap, imágenes compartidas y enlaces públicos. No cambia la dirección dev ni apunta automáticamente un dominio sin vincular a la web.

### Revisar sustituciones antiguas del entorno

`PUBLIC_SITE_URL` de `.env`, `.env.*` aplicables o entorno del alojamiento sustituye la configuración. Si site.url no quita el dominio viejo, revisa todo ello. dev usa development y build production; `--mode` personalizado lee sus propios archivos. Revisar solo `.env` no basta.

Elimina sustituciones innecesarias y usa site.url, o define valores correctos en cada entorno. Recompila tras cambiar; no edites manualmente una sola URL en la salida antigua.

### Publicar en la raíz del dominio

El tema supone actualmente raíz, como `https://blog.example.com/`. Subdirectorios como `https://example.com/my-blog/` requieren adaptación adicional. base de Astro por sí solo no hace compatibles todas las páginas/recursos.

Elige alojamiento para raíz, index.html estáticos y acceso directo a subpáginas. En GitHub Pages, prefiere dominio de sitio/dominio personalizado. Una guía genérica de subdirectorio de proyecto no prueba compatibilidad aquí. Consulta [despliegue de Astro](https://docs.astro.build/en/guides/deploy/) y las guías de alojamiento.

## 2. Preparar todos los archivos fuente necesarios

Despliega tu propio proyecto y rama de contenido, no el demo del mantenedor como blog personal. Incluye configuración, contenido, manifiestos de dependencias y recursos.

Tras añadir/sustituir portadas locales o imágenes de fragments, prepara derivados con dev/doctor local y guarda:

- Entradas, fragments, páginas propias y `src/site.config.ts`.
- Originales referenciados, imágenes públicas, iconos y música/recursos necesarios.
- Todo `src/assets/blog/covers/`, con manifest.json, generated/ y originals/ usado.
- `package.json`, `package-lock.json` y configuración Astro/alojamiento original.

Los originales también pueden estar junto a entradas o en public; guarda esos directorios. Consulta la preparación en [imágenes](/es/blog/starter-guide-images/).

**Build y doctor preparan los derivados necesarios, también en CI.** Reutilizan los válidos y regeneran los ausentes, obsoletos o dañados; no necesitan que el alojamiento conserve cachés. Un original inexistente, una ruta que escape del proyecto o una imagen ilegible siguen causando un error. Guarda originales y, para reutilizar los resultados, también manifiesto y derivados.

**Nota de versión:** La preparación automática de imágenes durante build y doctor en CI requiere 0.36.2 o posterior. Con 0.36.1, ejecuta primero dev o `prepare-covers` para preparar los derivados. `prepare-covers --check` y la sincronización de configuración siguen siendo comprobaciones de solo lectura.

Con Git no necesitas guardar node_modules, `.astro` ni dist: la plataforma instala y compila. No subas dependencias locales como web estática. Si no guardas archivos de entorno, configura las variables necesarias en la plataforma. PUBLIC_ es información pública, no lugar para secretos.

## 3. Comprobar y previsualizar la compilación real local

Detén dev con Ctrl+C, confirma que estás en la raíz y ejecuta:

```bash
npm run doctor
npm run preview
```

Abre la dirección de preview. Comprueba inicio, entradas, imágenes, idiomas y búsqueda, incluidas las nuevas páginas/idiomas. Servicios externos como comentarios requieren conexión real de navegador; compilar bien no prueba permisos remotos.

Los comandos tienen responsabilidades distintas:

| Comando           | Responsabilidad                                                                                    |
| ----------------- | -------------------------------------------------------------------------------------------------- |
| `npm run dev`     | Desarrollo y preparación de imágenes; sin índice compilado de texto completo.                      |
| `npm run doctor`  | Preparación local, comprobaciones Astro y compilación; verifica About en ejecución si está activo. |
| `npm run check`   | Llama al mismo doctor del starter actual; no ejecutes ambos seguidos.                              |
| `npm run build`   | Compila y valida derivados persistentes sin la generación local de doctor.                         |
| `npm run preview` | Sirve dist existente sin compilar ni publicar.                                                     |

Resuelve errores antes del despliegue. No publiques dist sobrante tras fallos. doctor ya compila: repetir check/build inmediatamente es innecesario. Detén preview con Ctrl+C.

## 4. Desplegar toda la salida estática

Puedes conectar Git para compilar en el alojamiento o subir una compilación local. Ambos sirven salida estática equivalente.

### Opción 1: compilar desde Git en el alojamiento

Conecta el repositorio y configura:

| Ajuste                 | Valor del starter actual                                                                   |
| ---------------------- | ------------------------------------------------------------------------------------------ |
| Rama                   | La que mantiene tu contenido.                                                              |
| Raíz del proyecto      | Directorio de package.json del blog, no necesariamente raíz del repositorio.               |
| Node.js                | Compatible con proyecto/dependencias; el starter exige actualmente 22.12.0 o posterior.    |
| Instalación            | npm puede usar `npm ci`; requiere package-lock.json guardado y coherente con package.json. |
| Comando de compilación | `npm run build`                                                                            |
| Directorio de salida   | `dist`, relativo a la raíz del proyecto.                                                   |

Si ya instala dependencias, no dupliques la instalación. Si exige script completo, instala antes de compilar. No apiles doctor, check y build ni generes imágenes en servidor para ocultar archivos sin guardar.

Usa los controles reales de framework, rama e instalación de la plataforma. Elige salida estática. npm run dev y npm run preview no son comandos de producción.

### Opción 2: subir una compilación local

Tras doctor correcto, sube todo el contenido de `dist/` a la raíz documental. Elige dist si pide directorio de salida; sus archivos interiores si pide archivos de web. No añadas otra capa dist en la URL.

Incluye `_astro/`, `_blog-covers/`, `_social/`, índices de búsqueda y todo archivo generado además de HTML. Los directorios con guion bajo no son temporales desechables; omitirlos rompe estilos, scripts, imágenes o búsqueda.

Al republicar sustituye completamente la salida. Superponer archivos puede conservar entradas borradas, páginas viejas e idiomas desactivados. Borrar Markdown local no borra HTML ya publicado.

## 5. Vincular dominio en el alojamiento y configurar DNS

Añade el dominio personalizado en la plataforma. Usa sus registros reales en la gestión DNS del dominio. Raíz/subdominios pueden necesitar tipos y destinos distintos; no copies una IP de ejemplo.

Espera validación y certificado HTTPS y abre la dirección pública. Si usas raíz, www u otros hosts alternativos, elige principal, redirige alternativas en el alojamiento y pon el principal en site.url.

Canonical no es una redirección HTTP. site.url no cambia DNS, emite certificados ni redirige dominios. Eso pertenece al alojamiento/dominio. Recompila y despliega tras cambiar principal; actualiza también sustituciones antiguas de entorno.

## 6. Comprobar páginas y salidas públicas

Abre una entrada directamente con dominio público y recarga. Navegar solo desde inicio no prueba acceso directo. Revisa imágenes, estilos de código, idiomas y búsqueda. Lo comprobado en dev debe revisarse también compilado.

El tema ya proporciona estas salidas; no instales integraciones duplicadas:

| Dirección de ejemplo                           | Propósito                                                                       |
| ---------------------------------------------- | ------------------------------------------------------------------------------- |
| `/robots.txt`                                  | Reglas de rastreo y dirección sitemap, no control de acceso.                    |
| `/sitemap-index.xml`                           | Entrada sitemap; los enlaces deben usar dominio público.                        |
| `/zh/rss.xml`                                  | Feed de entradas chinas; sustituye zh por otros idiomas activos.                |
| `/llms.txt`                                    | Índice principal para IA.                                                       |
| `/zh/llms.txt`, `/zh/llms-full.txt`            | Índice/colectánea integral del idioma si hay contenido exportable.              |
| `/zh/blog/my-first-post/index.md`              | Markdown público de entrada; sustituye el slug.                                 |
| `/zh/fragments/index.md`, `/zh/about/index.md` | Contenido público con páginas activas y condiciones de exportación satisfechas. |

Las fechas de sitemap usan updatedDate y después pubDate; no inventan fecha nueva por compilación. Idiomas/páginas desactivados pueden no tener exportaciones. search: false no da privacidad ni impide otras salidas públicas.

Las exportaciones IA contienen entradas públicas y Fragments/About activos. Excluyen comentarios y herramientas decorativas, así como páginas con noindex real o canonical externo. Un archivo tuyo en conflicto con un destino generado detiene la compilación sin sobrescribirlo. Publica juntos exportaciones y enlaces de descubrimiento nuevos.

Los metadatos y textos mejoran descubrimiento/lectura, sin garantizar indexación, citas IA ni tráfico.

### Cabeceras de respuesta del alojamiento

La compilación combina `X-Robots-Tag: noindex` para `/:locale/terminal/*` en dist/_headers, conservando reglas y sin cambiar public/_headers fuente. Los alojamientos compatibles lo aplican; otros necesitan cabeceras equivalentes.

Astro preview no simula _headers. Comprueba la respuesta real en producción, no solo la existencia del archivo. No requiere servidor Node.

Consulta definiciones en [prioridad de entorno](/es/blog/config-site-chrome/#environment) y [complementos públicos](/es/blog/config-analytics-ai/#supplement).

## 7. Añadir contexto para IA opcionalmente

Publicar normalmente no exige ajustes extra. Para explicar el sitio o enlazar recursos, combina al nivel superior:

```ts
aiReadableContent: {
  notes: 'Este sitio recoge mi aprendizaje personal y su contenido puede revisarse.',
  links: [{ label: 'Página del proyecto', href: 'https://example.com/project' }],
},
```

notes admite Markdown; links requiere label y href. Usa URLs HTTP(S) públicas. Los destinos relativos, incluidas rutas raíz, se resuelven contra la dirección del sitio. Es contexto público, no sustituto de cuerpo ni restricción de privacidad.

Usa `i18n.locales.<locale>.aiReadableContent` por idioma. Por ejemplo, notas chinas sin enlaces adicionales:

```ts
i18n: {
  locales: {
    zh: {
      aiReadableContent: {
        notes: '中文内容是作者自己的学习笔记。',
        links: [],
      },
    },
  },
},
```

Lo omitido hereda valores globales. notes: '' o links: [] oculta explícitamente esa parte. Los complementos entran en índices, colectáneas y Markdown pertinente. Introduce solo información pública y recompila tras cambiar.

## 8. Activar GA4 opcionalmente

Los scripts Google están apagados por defecto. Obtén el Measurement ID G- de tu flujo web Analytics; consulta [instrucciones de Google](https://support.google.com/analytics/answer/9539598). Solo admite IDs G-, no números de propiedad, contenedores GTM ni otros.

Combina al nivel superior junto a site:

```ts
analytics: {
  googleAnalyticsId: 'G-XXXXXXXXXX',
},
```

Sustituye por tu ID real; string vacía desactiva. Formato inválido causa error. Un ID puede cubrir todos los idiomas, distinguidos por rutas. No pegues scripts distintos por atmósfera/idioma.

El cargador solo aparece en producción con ID, no dev. Omite localhost, subdominios y direcciones loopback. IPs LAN o dominios remotos de preview pueden informar; no toda vista previa se excluye.

Tras desplegar, visita el dominio y revisa tiempo real GA4. Bloqueos, red y ajustes afectan resultados. Evita instalar lo mismo mediante scripts manuales, GTM u otras herramientas. No incluye gestión de consentimiento; añade una solución adecuada si la necesitas.

## 9. Resolver problemas de despliegue

| Síntoma                                      | Qué comprobar primero                                                              |
| -------------------------------------------- | ---------------------------------------------------------------------------------- |
| Falla npm ci                                 | Requisitos Node/dependencias y package-lock guardado coherente con package.json.   |
| Imagen missing/stale/modified                | Prepara localmente, guarda originales/manifiesto/generados y no omitas validación. |
| Compila pero páginas 404                     | Salida, rama, soporte raíz/index y subdirectorio no admitido.                      |
| Inicio funciona pero recargar entrada da 404 | Rutas estáticas reales, publicación completa y fallback SPA accidental.            |
| Faltan estilos, imágenes o búsqueda          | Todo dist desplegado, directorios de recursos y reescritura.                       |
| Canonical/RSS usa dominio de ejemplo         | site.url, PUBLIC_SITE_URL, modo dotenv y nueva compilación/despliegue.             |
| Cambios no públicos                          | Proyecto/rama/commit correctos, no solo edición local.                             |
| Entrada borrada aún accesible                | Salida/caché vieja; revisa sustitución completa y cachés del alojamiento.          |
| Sin datos GA4                                | ID G- real, producción, dirección no local y bloqueos.                             |

Para actualizar contenido: editar/preparar local → verificar/preview → guardar fuentes → compilar/desplegar. Consulta [instalación](/es/blog/starter-guide-1-configure-your-site/) para actualización y [idiomas](/es/blog/starter-guide-languages/) para rutas.

## Navegación de tutoriales y diccionario de configuración

Aquí termina la primera publicación. Para cambios posteriores vuelve al tutorial o diccionario pertinente.

[Anterior: ofrecer el blog en más idiomas](/es/blog/starter-guide-languages/) · [Los ocho tutoriales](/es/blog/starter-guide-1-configure-your-site/#tutorial-order).

Campos relacionados: [dominio y entorno](/es/blog/config-site-chrome/), [GA4 y contexto para IA](/es/blog/config-analytics-ai/), [recursos de búsqueda](/es/blog/config-search/). Rutas, valores y límites en el [índice](/es/blog/config-reference/).
