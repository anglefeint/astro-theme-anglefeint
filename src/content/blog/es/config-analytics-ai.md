---
tags: ['anglefeint', 'config']
title: 'Referencia de configuración: GA4 y contexto para IA'
subtitle: 'Estadísticas y complementos públicos para máquinas'
description: 'Tipos, valores, validación y herencia de analytics y aiReadableContent.'
pubDate: '2026-11-13'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/ai-02.webp'
---

Las cadenas chinas de los ejemplos bajo `locales.zh` son intencionales: ilustran cómo personalizar el contenido chino sin cambiar los demás idiomas. Los valores predeterminados chino/inglés de las tablas son citas del tema, no traducciones pendientes.

Para publicar por primera vez, consulta [despliegue](/es/blog/starter-guide-deployment/) para ID y textos públicos. El archivo se explica en [instalación](/es/blog/starter-guide-1-configure-your-site/); otros módulos en el [índice](/es/blog/config-reference/).

Ambos grupos están al nivel superior de `src/site.config.ts`, junto a site/theme. analytics controla estadísticas; aiReadableContent añade contexto público. Son independientes: estadísticas no necesitan complemento IA, y generar texto no necesita ID.

<a id="analytics"></a>

## analytics.googleAnalyticsId: identificador GA4

| Ruta                        | Tipo / predeterminado                                     | Estado, función y límites                                                                                                                                                                 | Ejemplo                               |
| --------------------------- | --------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| analytics                   | { googleAnalyticsId: string } / { googleAnalyticsId: '' } | Contenedor de configuración; admite sustituciones parciales, sin enabled separado                                                                                                         | { googleAnalyticsId: 'G-XXXXXXXXXX' } |
| analytics.googleAnalyticsId | string / ''                                               | Condicional: ID válido, producción y sin exclusión local. Vacío/espacios desactiva; se recorta. Regex ^G-[A-Z0-9]+$ exige mayúsculas. Formato inválido lanza error al resolver componente | 'G-XXXXXXXXXX'                        |

Es Measurement ID de flujo web GA4, no ID numérico de propiedad, contenedor GTM, UA antiguo ni secreto API. Sustituye el ejemplo por uno real. No exige longitud fija ni consulta Google para verificar el flujo. Pasar regex no significa recibir datos.

```ts
analytics: {
  googleAnalyticsId: 'G-XXXXXXXXXX',
},
```

Desactiva con:

```ts
analytics: { googleAnalyticsId: '' },
```

Combina en `defineThemeConfig({...})` sin duplicar analytics. Un ID cubre páginas de framework compartido en todos los idiomas, sin campos por idioma/página.

### ¿Cuándo carga?

| Entorno o dirección                              | Comportamiento actual                                                                |
| ------------------------------------------------ | ------------------------------------------------------------------------------------ |
| npm run dev                                      | Sin cargador. Se analizan campos antes: formato inválido no necesariamente se ignora |
| Producción, ID vacío                             | Sin cargador                                                                         |
| Producción en localhost o subdominio .localhost  | Retorna antes de inicializar cola o solicitar Google                                 |
| Producción en 127.*, 0.0.0.0, ::1 o [::1]        | También se omite; hostname se compara en minúsculas                                  |
| Producción en IP LAN o dominio remoto de preview | No se excluye solo por ser preview; con ID intenta cargar                            |
| Dominio público de producción con ID válido      | Inicializa gtag una vez e inserta cliente asíncrono                                  |

Inicializa js/config sin enviar manualmente otro page_view, consultas ni eventos del reproductor. El cargador tiene marca de una ejecución, pero no detecta otra instalación manual/GTM. Evita duplicados.

Conserva window.dataLayer/window.gtag existentes. Sin interfaz de consentimiento, configuración automática de este, proxy, exclusión de dominios ni eventos propios. Ninguna variable PUBLIC_GA_* sustituye automáticamente ID. Implementa entorno explícitamente en site.config; no espera nombres arbitrarios.

El componente trata adaptadores antiguos sin ANALYTICS como no configurados. Es compatibilidad interna, no otro campo público. Usa analytics.googleAnalyticsId.

<a id="supplement"></a>

## aiReadableContent: contexto público global

Objeto MachineReadableSupplement opcional, sin definir por defecto. Omitirlo sigue generando salidas para máquinas, sin contexto extra. {} no desactiva exportaciones.

| Ruta completa                   | Tipo / predeterminado                                                 | Estado, función y límites                                                                                                           | Ejemplo                                                                  |
| ------------------------------- | --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| aiReadableContent.notes         | string opcional / sin definir, salida vacía                           | Condicional: contexto público Markdown. Vacío/espacios omite sección. No sustituye cuerpo ni son instrucciones IA privadas          | 'Este sitio reúne apuntes personales que pueden revisarse.'              |
| aiReadableContent.links         | { label: string; href: string }[] opcional / sin definir, lista vacía | Condicional: enlaces extra públicos. Array sustituye; [] limpia. Sin límite público ni descarga automática del destino              | [{ label: 'Página del proyecto', href: 'https://example.com/project/' }] |
| aiReadableContent.links[].label | string obligatoria / ninguno                                          | Condicional: no vacío tras trim; pliega saltos a espacios y escapa barras/corchetes. No busca título del destino                    | 'Página del proyecto'                                                    |
| aiReadableContent.links[].href  | string obligatoria / ninguno                                          | Condicional: no vacío, resuelto contra raíz pública; solo HTTP(S) sin credenciales. Inválido falla, sin verificar existencia/acceso | 'https://example.com/project/'                                           |

notes/links no tienen ajuste general de longitud y deben respetar tipos. Tipo erróneo, etiquetas vacías, protocolos no web o credenciales pueden impedir compilar. No ejecuta comandos ni llama modelos para generar contexto.

### Markdown y enlaces relativos

notes conserva texto, formato y código Markdown. Enlaces, imágenes y definiciones de referencia analizados se vuelven absolutos, con validación HTTP(S) sin credenciales. Los enlaces de ejemplo en código no se reescriben. No es validador completo de HTML arbitrario ni servicio de capturas.

Se resuelve contra **raíz pública del sitio, incluido base de Astro**, no artículo ni idioma actual. Para https://example.com/project/:

| href o destino Markdown configurado | Resultado                            |
| ----------------------------------- | ------------------------------------ |
| zh/blog/                            | https://example.com/project/zh/blog/ |
| /zh/blog/                           | https://example.com/zh/blog/         |
| https://docs.example.com/guide/     | Misma URL externa                    |

Un / inicial usa raíz del dominio, sin conservar /project/. Difiere del prefijo BASE_URL en música; no mezcles reglas. mailto:, tel:, file: y javascript: no se admiten aquí. Los enlaces normales de contacto tienen reglas de exportación propias, no implican mismos protocolos en complementos.

### Ejemplo global

```ts
aiReadableContent: {
  notes: 'Este sitio reúne apuntes personales que pueden revisarse. Consulta la [lista de entradas](es/blog/).',
  links: [
    { label: 'Página del proyecto', href: 'https://example.com/project/' },
  ],
},
```

<a id="locale-supplement"></a>

## aiReadableContent por idioma

Prefijo `i18n.locales.<locale>.aiReadableContent`, opcional y sin definir. Igual semántica global, heredando campo a campo si se omiten:

| Campo relativo | Tipo / predeterminado                                            | Función y límites                                                                           | Ejemplo                                             |
| -------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| notes          | string opcional / hereda notes global                            | Condicional: contexto público del idioma. Vacío/espacios limpia sin respaldo de otro idioma | 'El contenido en chino se actualiza continuamente.' |
| links          | { label: string; href: string }[] opcional / hereda links global | Condicional: sustituye todo array; [] limpia, no añade al global                            | []                                                  |
| links[].label  | string obligatoria / ninguno                                     | Requerido en elementos propios; misma validación/escape global                              | 'Artículos en chino'                                |
| links[].href   | string obligatoria / ninguno                                     | Requerido en elementos propios; resuelve contra raíz pública, no directorio de idioma       | 'zh/blog/'                                          |

Para notas chinas sin enlaces extra chinos:

```ts
i18n: {
  locales: {
    zh: {
      aiReadableContent: {
        notes: '中文内容持续更新。',
        links: [],
      },
    },
  },
},
```

Cambiar notes sigue heredando links global; {} hereda ambos. undefined se ignora, no limpia. No usa meta.fallback ni copia complementos ingleses/otros. Consulta [respaldo](/es/blog/config-languages/#fallback).

llms.txt raíz siempre usa contexto global. Los ajustes por idioma van a índice, colectánea y Markdown de ese idioma. Limpiar todos no evita contexto global inválido, pues la raíz aún lo resuelve.

<a id="outputs"></a>

## Qué archivos públicos reciben el complemento

Rutas relativas a raíz pública, con prefijo de despliegue cuando corresponda. Índices/colectáneas requieren contenido real exportado; el complemento no crea artículos.

| Salida                                          | Posición y contenido del complemento                                                                                          |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| llms.txt                                        | Entrada raíz. notes global antes de directorios, links como sección extra. Puede contener contexto sin documentos exportables |
| `<locale>/llms.txt`                             | Índice del idioma con complemento resuelto y enlaces existentes bajo Articles/Fragments/About                                 |
| `<locale>/llms-full.txt`                        | Colectánea integral del idioma, con contexto/enlaces antes del contenido                                                      |
| index.md de entrada u otro Markdown equivalente | Separador, marcador de contexto y complemento tras el cuerpo, distinguido del texto del autor                                 |
| `<locale>/about/index.md`                       | Biografía/contacto públicos y panel IA estático accesible, con complemento final; no toda configuración de herramientas       |
| `<locale>/fragments/index.md`                   | Páginas reunidas con enlaces ID estables y complemento, sin duplicar colectánea por página                                    |

Markdown individual sigue HTML compilado: index.html → index.md. Salidas Astro personalizadas pueden diferir: no inventes rutas ni sobrescribas generados. Las páginas exportadas reciben enlaces de descubrimiento a Markdown e índices.

Solo exporta artículos/About/Fragments marcados, indexables públicamente y canonical misma origen. Inicio, listas, formularios Decoder e iframes no son artículos exportados normales. Convierte enlaces/código/tablas del contenido compilado; no empaqueta configuración arbitraria no renderizada. El panel IA estático accesible de About es público: trata así su texto.

search: false excluye Pagefind, no exportaciones. Vaciar notes/links no desactiva cuerpo. No hay aiReadableContent.enabled, exclusión individual, endpoint IA, parámetros de modelo ni API key. Ofrece información pública legible, sin garantizar rastreo, cita ni ranking.

El generador protege archivos homónimos fuera de su historial y falla en colisión. No crees rutas llms.txt/Markdown competidoras en public/dist. Corrige fuentes, recompila y despliega todo. Compilar bien no prueba actualización pública ni lectura por modelos.

<a id="boundaries"></a>

## Ajustes relacionados y límites

- URLs dependen de site.url, entorno y base Astro. Título/descripción raíz usan contexto actual. Consulta [despliegue](/es/blog/starter-guide-deployment/); editar URL en notes no cambia canonical.
- Idiomas afectan generación estándar, no limpieza del alojamiento. Complementos no traducen; consulta [contexto por idioma](/es/blog/config-languages/#ai-context).
- GA4 controla estadísticas, no búsqueda/RSS/exportaciones. Complementos estáticos no tienen botón, grupo de traducciones ni control de estadísticas.
- ID GA4 y todos los complementos tienen consumidores. Sin campos obsoletos extra; faltar ramas de adaptador antiguo solo desactiva por compatibilidad.

Recompila/despliega tras cambiar. Navegador, red o flujo pueden bloquear estadísticas; comprobar texto local no verifica informes reales. Vuelve al [índice](/es/blog/config-reference/).
