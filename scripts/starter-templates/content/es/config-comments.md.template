---
tags: ['anglefeint', 'config']
title: 'Referencia de configuración: Giscus y discusiones multilingües'
subtitle: 'Conexión, asociación, presentación y comentarios de fragments'
description: 'Tipos, valores y restricciones de Giscus y la compartición de discusiones entre idiomas.'
pubDate: '2026-11-13'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

Para empezar, lee [permitir comentarios](/es/blog/starter-guide-4-giscus-comments/) para preparar repositorio y obtener parámetros. Consulta el archivo en [instalación](/es/blog/starter-guide-1-configure-your-site/) y otros módulos en el [índice](/es/blog/config-reference/).

Los ajustes compartidos están en theme.comments de src/site.config.ts. Apagados por defecto. Los valores son del paquete, no del repositorio personal conectado al demo. IDs y parámetros son información pública incluida en páginas. No introduzcas tokens GitHub ni secretos.

<a id="controls"></a>

## Distinguir los dos controles

| Ruta                             | Tipo / predeterminado | Estado, función y límites                                                                                                                               | Ejemplo                                                              |
| -------------------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| theme.comments.enabled           | boolean / false       | Condicional: solo entradas, no botones de fragments. Faltar conexión puede ocultar zona; renderizar no valida servicio remoto                           | theme: { comments: { enabled: true } }                               |
| theme.fragments.comments.enabled | boolean / false       | Condicional: lista de fragments, requiere theme.fragments.enabled. Independiente de artículos. Faltar conexión requerida causa error al generar páginas | theme: { fragments: { enabled: true, comments: { enabled: true } } } |

No hay frontmatter comments: false por artículo. Tampoco control individual por fragment; las vistas de inicio no muestran comentarios. Consulta [Fragments](/es/blog/config-fragments/#comments-enabled).

## Todos los campos theme.comments

Todos llevan prefijo theme.comments.; por ejemplo repo es theme.comments.repo. Pueden omitirse en entradas parciales y completarse con defaults. Los indicadores string deben ir entre comillas, no booleanos/números.

Son condicionales: comentarios de artículos activos y elegibles para salida. Fragments usa solo parte y fuerza/ignora el resto. Vacío no restaura defaults universalmente: revisa cada fila. Tipo correcto y no vacío no prueban validez Giscus remota, aparte de restricciones explícitas de mapping.

<a id="connection"></a>

### Repositorio y categoría

| Campo        | Tipo   | Predeterminado | Función, condiciones y límites                                                                                                             | Ejemplo                           |
| ------------ | ------ | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------- |
| `repo`       | string | `""`           | GitHub propietario/repositorio. Artículos exigen valor truthy; fragments no vacío tras trim. Evita espacios; no comprueba permisos remotos | `"your-account/blog-discussions"` |
| `repoId`     | string | `""`           | ID de repositorio Giscus, no nombre, secuencia numérica ni token. Compartido por artículos/fragments                                       | `"YOUR_REPOSITORY_ID"`            |
| `category`   | string | `""`           | Nombre de categoría proporcionado por Giscus con su categoryId; no etiqueta de artículo                                                    | `"Announcements"`                 |
| `categoryId` | string | `""`           | ID de categoría Giscus, no nombre. Artículos exigen truthy, fragments no vacío tras trim; sin validación remota                            | `"YOUR_CATEGORY_ID"`              |

<a id="mapping"></a>

### Asociación de artículos y coincidencia estricta

| Campo     | Tipo                                                                   | Predeterminado | Función, condiciones y límites                                                                                                                                        | Ejemplo                 |
| --------- | ---------------------------------------------------------------------- | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| `mapping` | 'pathname' \| 'url' \| 'title' \| 'og:title' \| 'specific' \| 'number' | `"pathname"`   | Asociación de artículos, valores explicados abajo. Compartir exige specific. Fragments ignora                                                                         | `"pathname"`            |
| `term`    | string                                                                 | `""`           | Para artículos no compartidos en specific; no vacío tras trim. Fijo global. Compartir exige vacío y usa slug al renderizar. No se envía en otros modos                | `"my-fixed-discussion"` |
| `number`  | string                                                                 | `""`           | Modo number no compartido: string de entero seguro positivo tras trim, sin ceros iniciales, signo más ni decimales. Compartir exige vacío. No se envía en otros modos | `"42"`                  |
| `strict`  | '0' \| '1'                                                             | `"0"`          | Indicador estricto string, no booleano. Compartir exige 1; fragments fuerza 1. No combina discusiones de títulos iguales                                              | `"1"`                   |

<a id="appearance"></a>

### Apariencia, idioma y carga

| Campo              | Tipo                             | Predeterminado | Función, condiciones y límites                                                                                                                 | Ejemplo       |
| ------------------ | -------------------------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| `reactionsEnabled` | '0' \| '1'                       | `"1"`          | Reacciones de la publicación de discusión, compartido. No desactiva todas las acciones de comentario                                           | `"1"`         |
| `emitMetadata`     | '0' \| '1'                       | `"0"`          | Solicita metadatos de discusión al padre. Artículos lo pasan sin mostrar conteos automáticamente. Fragments fuerza 1 para carga/cambios        | `"0"`         |
| `inputPosition`    | 'top' \| 'bottom'                | `"bottom"`     | Entrada encima/debajo, compartido; no mueve toda la zona                                                                                       | `"top"`       |
| `theme`            | string                           | `"dark"`       | Tema de iframe Giscus, no Matrix/Cyber/Hacker/AI. Compartido, sin validar nombres ni seguir escena automáticamente                             | `"dark"`      |
| `lang`             | string                           | `"en"`         | Idioma de interfaz de artículos. No vacío se pasa directo; vacío se mapea desde página. Fragments ignora y sigue página. No traduce respuestas | `""`          |
| `loading`          | 'lazy' \| 'eager'                | `"lazy"`       | Indicación iframe de artículos, no toda inserción client.js. Fragments fuerza eager, pero inserta tras clic                                    | `"lazy"`      |
| `crossorigin`      | 'anonymous' \| 'use-credentials' | `"anonymous"`  | crossorigin del script compartido; no credenciales de repositorio, token ni arreglo de permisos                                                | `"anonymous"` |

<a id="sharing"></a>

## theme.comments.shareAcrossLocales: compartir discusiones de artículos

- **Tipo / predeterminado:** boolean opcional / false.
- **Estado y función:** condicional a comentarios activos. Versiones de mismo slug completo comparten discusión; slugs distintos quedan separados.
- **Límites:** exige mapping 'specific', term/number vacíos tras trim y strict string '1'. Si no, error; cambiar solo booleano no basta. Se omiten estas restricciones al apagar artículos, pero sigue validación de conexión de fragments.
- **Ejemplo:** ajustes compartidos abajo. No traduce comentarios, combina discusiones ni altera asociación de fragments.

| Archivo de artículo                  | term compartido real |
| ------------------------------------ | -------------------- |
| src/content/blog/zh/my-first-post.md | my-first-post        |
| src/content/blog/en/my-first-post.md | my-first-post        |
| src/content/blog/zh/guides/setup.md  | guides/setup         |
| src/content/blog/en/other/setup.md   | other/setup          |

Usa slug completo sin directorio de idioma, no título, canonicalTopic ni cuerpo. Las rutas estándar aportan articleSlug. BlogPost personalizado también necesita slug completo no vacío, sin espacios exteriores, segmentos vacíos ni . / ... Es un prop, no campo site.config.

Varios sitios con mismo repositorio, categoría y slug pueden llegar a la misma discusión. El dominio no aísla base de datos. Mantener ruta hace que cambiar título no altere term. Cambiar slug, repositorio, categoría o mapping puede seleccionar otra discusión.

<a id="mapping-values"></a>

## Significado de mapping

| Valor    | Giscus compara              | Límites y ejemplos                                                                           |
| -------- | --------------------------- | -------------------------------------------------------------------------------------------- |
| pathname | Ruta URL                    | Predeterminado; idiomas suelen tener rutas distintas. Cambiar rutas puede cambiar asociación |
| url      | URL completa                | Cambiar dominio/dirección puede cambiar asociación                                           |
| title    | Título de documento         | Cambiar título de artículo/sitio puede cambiarla; no solo h1                                 |
| og:title | Título Open Graph           | Lee metadatos existentes; theme.comments no define título                                    |
| specific | term especificado           | Fijo global sin compartir; generado del slug individual al compartir                         |
| number   | Número Discussion existente | Número global fijo como string '42'; no issue ni crea discusión automáticamente              |

Giscus resuelve coincidencia/creación. Una discusión ausente puede crearse con primer comentario/reacción, no necesariamente al abrir. Repositorio público, Discussions y aplicación Giscus obligatorios; consulta tutorial y [configuración oficial](https://giscus.app/). El tema no tiene base local.

Con strict '1', Giscus usa hash de título en cuerpos, no comparación local del tema. Las existentes pueden necesitar marcadores; consulta [coincidencia estricta](https://github.com/giscus/giscus/blob/main/ADVANCED-USAGE.md#data-strict). Cambiar mapping/compartición no migra, combina ni borra. Pueden seguir en GitHub y desaparecer de la nueva asociación. Identifica discusiones y terms antes de migrar.

Sin compartir, specific con term fijo dirige todos los artículos a una misma discusión; number también es global. No asignan IDs por entrada. Los valores no pertinentes no se envían, pero ambas strings se recortan siempre: no uses null ni números.

<a id="examples"></a>

## Ejemplos para combinar

Combina en defineThemeConfig({...}) de src/site.config.ts y conserva imports, exports y ajustes sin duplicar theme. Obtén los cuatro datos de tu Giscus; los ejemplos no validan una conexión real.

### Separar artículos por ruta

```ts
theme: {
  comments: {
    enabled: true,
    repo: 'your-account/blog-discussions',
    repoId: 'YOUR_REPOSITORY_ID',
    category: 'Announcements',
    categoryId: 'YOUR_CATEGORY_ID',
    shareAcrossLocales: false,
    mapping: 'pathname',
    lang: '',
  },
},
```

### Compartir discusión entre traducciones

Conserva tus datos y combina estos ajustes:

```ts
theme: {
  comments: {
    enabled: true,
    shareAcrossLocales: true,
    mapping: 'specific',
    term: '',
    number: '',
    strict: '1',
    lang: '',
  },
},
```

lang predeterminado es 'en', no sigue página. El ejemplo lo vacía para mapear: zh → zh-CN, zh-hant → zh-TW, pt-br → pt; otros pasan directamente. Giscus decide idiomas soportados. Cambiar idioma no cambia identidad ni texto publicado. theme.comments es global, no se duplica bajo i18n.locales.

La string theme pasa a Giscus; valores habituales 'dark'/'light'. Giscus gestiona temas y URLs CSS, sin cambiar panel IA exterior. Consulta [temas oficiales](https://github.com/giscus/giscus/blob/main/ADVANCED-USAGE.md#data-theme). El paquete no valida CSS personalizado ni accesibilidad.

<a id="fragment-overrides"></a>

## Qué ajustes comparten los fragments

| Campo compartido                                       | Conducta real en fragments                                                                                                 |
| ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| repo / repoId / category / categoryId                  | Compartido. Los cuatro no vacíos tras trim. Se pasan originales: evita espacios exteriores. Sin comprobar permisos remotos |
| theme / reactionsEnabled / inputPosition / crossorigin | Usa valores compartidos                                                                                                    |
| enabled                                                | Ignora control de artículos; usa theme.fragments.comments.enabled                                                          |
| shareAcrossLocales                                     | Sin uso: mismo ID estable ya vincula discusión                                                                             |
| mapping / term / number                                | Fuerza specific, term `fragment/<ID>` y no envía number                                                                    |
| strict / emitMetadata                                  | Fuerza '1' / '1'                                                                                                           |
| lang                                                   | Ignora lang compartido y mapea idioma actual                                                                               |
| loading                                                | Fuerza eager; inserta cliente en primer clic de comentarios                                                                |

Por ejemplo, activa solo fragments y desactiva artículos:

```ts
theme: {
  comments: {
    enabled: false,
    repo: 'your-account/blog-discussions',
    repoId: 'YOUR_REPOSITORY_ID',
    category: 'Announcements',
    categoryId: 'YOUR_CATEGORY_ID',
  },
  fragments: { enabled: true, comments: { enabled: true } },
},
```

IDs iguales entre idiomas comparten `fragment/<ID>`, independientemente de slugs de artículos. No cambies IDs estables para reordenar/paginar. El diálogo carga al primer clic y conserva iframe al cerrar; cambiar tarjeta envía configuración Giscus. Unos 15 segundos sin respuesta válida muestran fallo/reintento. No hay timeout ni precarga públicos. Activar artículos valida su mapping aunque tu intención principal sea comentar fragments.

<a id="messages"></a>

## Textos propios de la página

Estas strings opcionales están bajo `i18n.locales.<locale>.messages` con textos integrados/respaldo. Pon ejemplos en su objeto. Cambian etiquetas exteriores, no botones del iframe. Solo se muestran chino simplificado / inglés.

| Campo relativo       | Predeterminado chino simplificado / inglés                                                                                | Estado, función y límites                                                  | Ejemplo                                         |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ----------------------------------------------- |
| `blog.comments`      | 评论 / Comments                                                                                                           | Condicional: nombre accesible de zona de artículos, no otro título visible | `"Debate de la entrada"`                        |
| `fragments.comments` | 评论 / Comments                                                                                                           | Condicional: botón y título de diálogo de fragments                        | `"Participar en el debate"`                     |
| `fragments.close`    | 关闭 / Close                                                                                                              | Condicional: cierre de diálogo y nombre accesible del cierre de inicio     | `"Cerrar ventana"`                              |
| `fragments.loading`  | 正在加载评论… / Loading comments…                                                                                         | Condicional: carga de comentarios de fragments                             | `"Cargando debate…"`                            |
| `fragments.error`    | 评论未能加载，请检查网络或评论配置后重试。 / Unable to load comments. Check your network or comment settings, then retry. | Condicional: fallo de comentarios de fragments                             | `"El debate no está disponible temporalmente."` |
| `fragments.retry`    | 重试 / Retry                                                                                                              | Condicional: reintento tras fallo de fragments                             | `"Volver a cargar"`                             |

Otros textos están en [artículos](/es/blog/config-article/#article-messages) y [Fragments](/es/blog/config-fragments/#fragment-messages). No eligen idioma iframe; lo hace lang.

<a id="limits"></a>

## Límites de carga y validación

Artículos emiten client.js asíncrono; loading: 'lazy' va al iframe, sin esperar scroll para insertar script. Fragments emite plantilla e inserta cliente al clicar; eager describe iframe posterior al clic. [Carga oficial](https://giscus.app/) distingue capas.

Las comprobaciones locales validan mapping de artículos y campos requeridos de fragments, no login, autorización, visibilidad, categoría, red ni disponibilidad. Campos vacíos de artículos pueden suprimir zona. Solo espacios pueden superar condiciones de salida, pero no son configuración válida. Fragments comprueba más estrictamente vacío, sin validar IDs remotamente.

Todos los campos tienen consumidores, pero no todos se aplican a fragments; arriba se detallan sustituciones. No hay control individual, servicio propio, orden, token administrador ni base local. El cliente está fijado a https://giscus.app/client.js. Configurar Giscus no crea campos adicionales.

Recompila/despliega tras cambios. Compilar no valida el servicio real. Gestiona migración y permisos en GitHub/Giscus, no solo guardando site.config. Vuelve al [índice](/es/blog/config-reference/).
