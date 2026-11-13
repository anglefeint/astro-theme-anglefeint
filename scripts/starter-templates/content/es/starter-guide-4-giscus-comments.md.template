---
tags: ['anglefeint', 'starter']
title: 'Guía 6: permitir comentarios de lectores'
subtitle: 'Giscus, discusiones y traducciones'
description: 'Configura Giscus para entradas y fragments y elige cómo compartir discusiones entre idiomas.'
pubDate: '2026-11-10'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

Esta es la parte 6 de 8. [Consulta el orden completo](/es/blog/starter-guide-1-configure-your-site/#tutorial-order) · [Busca campos de configuración](/es/blog/config-reference/).

Anglefeint usa Giscus para comentarios, desactivado por defecto. Entradas y fragments tienen controles separados. Comentarios y reacciones se guardan en tus GitHub Discussions configuradas, sin base de datos separada para el blog estático.

Configura el repositorio una vez y elige después si las traducciones comparten discusiones. No edites plantillas ni pegues scripts en cada entrada.

## 1. Preparar un repositorio GitHub y una categoría

Abre la [configuración de Giscus en chino simplificado](https://giscus.app/zh-CN) y:

1. Elige un repositorio público tuyo, el del blog o uno separado para comentarios.
2. Activa Discussions.
3. Instala y autoriza la aplicación Giscus para ese repositorio.
4. Selecciona categoría y apunta los valores generados de repositorio/categoría.

Giscus genera un script. El tema solo necesita sus valores:

| Atributo generado  | Ajuste del tema                                                |
| ------------------ | -------------------------------------------------------------- |
| `data-repo`        | `theme.comments.repo`, por ejemplo `yourname/your-repository`. |
| `data-repo-id`     | `theme.comments.repoId`, ID del repositorio, no su nombre.     |
| `data-category`    | `theme.comments.category`, nombre real de categoría.           |
| `data-category-id` | `theme.comments.categoryId`, ID de categoría, no su nombre.    |

No uses IDs de ejemplo, URLs del repositorio ni tu usuario como IDs. La categoría no tiene que ser Announcements: usa el nombre elegido y su ID correspondiente. No necesitas paquete npm Giscus, token GitHub ni contraseña.

Depende de conectividad externa Giscus/GitHub. Publicar requiere autorización GitHub; también puedes participar directamente en la discusión de GitHub. El tema no ofrece comentarios anónimos. Consulta el servicio en la [documentación Giscus](https://giscus.app/zh-CN).

## 2. Activar comentarios normales de entradas

Combina en el `defineThemeConfig({...})` existente de `src/site.config.ts`:

```ts
theme: {
  comments: {
    enabled: true,
    repo: 'yourname/your-repository',
    repoId: 'REPLACE_WITH_REPO_ID',
    category: 'Announcements',
    categoryId: 'REPLACE_WITH_CATEGORY_ID',
    mapping: 'pathname',
    lang: '',
  },
},
```

Sustituye cuenta, repositorio, categoría y ambos IDs. Edita `theme`/`comments` existentes sin duplicar objetos ni quitar otros ajustes.

Activa comentarios asociados por pathname de URL. `/zh/blog/my-first-post/` y `/en/blog/my-first-post/` son rutas distintas y no comparten discusión por defecto. Compartir entre idiomas es `false` inicialmente. Si ya estaba activo, restaura su mapping según lo explicado abajo en vez de cambiar solo este ejemplo.

El componente aparece solo con comentarios activos y los cuatro campos de conexión. Si faltan puede no aparecer la zona. Los valores de ejemplo suelen superar comprobaciones locales de no vacío, sin verificar el servicio remoto. No existe control frontmatter individual; `comments: false` no desactiva una sola entrada.

`lang: ''` del ejemplo hace que siga el idioma de la entrada. El valor real predeterminado es fijo `lang: 'en'`: vacíalo explícitamente para seguir la página. `zh` se transforma en `zh-CN`, `zh-hant` en `zh-TW` y `pt-br` en `pt`. Cambia la interfaz, no traduce comentarios.

## 3. Confirmar la conexión

Guarda la configuración, abre una entrada local y busca comentarios. Comprueba repositorio/discusión y controles de acceso, comentario y reacción. Una discusión vacía inicialmente no indica fallo: Giscus puede crearla con la primera respuesta/reacción, no simplemente al abrir.

Detén dev antes de publicar y ejecuta:

```bash
npm run doctor
npm run preview
```

doctor comprueba y compila; no repitas inmediatamente build. preview sirve la salida local sin publicarla; producción necesita despliegue. Compilar bien demuestra generación local, no permisos reales ni conectividad del servicio en un navegador.

`loading: 'lazy'` es una indicación para el iframe. No significa que el tema espere al scroll para emitir el cliente: las entradas incluyen script Giscus asíncrono. Los diálogos de fragments sí cargan tras pulsar comentarios.

Consulta tipos, valores y ejemplos en [Giscus](/es/blog/config-comments/#connection). En discusiones existentes, revisa especialmente restricciones de asociación y compartición.

## 4. Elegir la asociación de entradas con discusiones

Mantén `pathname` para uso normal. Antes de cambiar un sitio con comentarios, entiende mapping:

| `mapping`    | Asociación y límites                                                                                |
| ------------ | --------------------------------------------------------------------------------------------------- |
| `'pathname'` | Ruta sin dominio; cambiar rutas puede cambiar discusiones.                                          |
| `'url'`      | URL completa; cambiar dominio puede afectar asociación.                                             |
| `'title'`    | Título del documento en navegador; cambiar título o nombre del sitio puede afectar.                 |
| `'og:title'` | Título Open Graph de la página.                                                                     |
| `'specific'` | `term` fijo configurado, no vacío fuera del modo compartido.                                        |
| `'number'`   | Número de discusión existente en `number`, no número de issue; no crea discusiones automáticamente. |

Giscus busca las discusiones; el tema no guarda base local. `strict: '1'` reduce coincidencias difusas entre títulos similares; por defecto es `'0'`.

Fuera del modo compartido, `term` y `number` son globales. Un term fijo hace que todas las entradas busquen una misma discusión; number también apunta a una sola. No asignan discusiones separadas automáticamente.

Con comentarios de entradas activos, specific exige term no vacío tras trim; number exige string entera positiva como `'42'`, no número `42`, `'0'` ni decimal. Valores inválidos fallan y pueden impedir dev/build.

## 5. Compartir comentarios entre traducciones de una entrada

Para compartir entre chino e inglés conservando separadas entradas distintas, mantiene los campos reales y combina:

```ts
theme: {
  comments: {
    // Conserva enabled: true y tus valores de repo, repoId, category y categoryId.
    shareAcrossLocales: true,
    mapping: 'specific',
    term: '',
    number: '',
    strict: '1',
    lang: '',
  },
},
```

Requiere specific, term/number vacíos y strict string `'1'`. term vacío es deliberado: la entrada añade su slug completo sin directorio de idioma, en vez de un term fijo para todas.

Por ejemplo, `src/content/blog/zh/my-first-post.md` y `src/content/blog/en/my-first-post.md` usan `my-first-post`. Las anidadas `guides/setup` y `other/setup` conservan rutas completas y discusiones distintas. Slugs iguales identifican traducciones, no títulos o cuerpos similares.

Con compartición y comentarios activos, mapping incorrecto, term/number no vacíos o strict distinto de `'1'` fallan explícitamente. Las rutas estándar pasan el slug. Los usuarios de BlogPost personalizado también deben dar un articleSlug válido. lang sigue controlando la interfaz; no traduce los cuerpos.

Comprueba dos traducciones de una entrada y luego otra entrada. Las primeras deben compartir discusión; la tercera no. Ver solo idioma o apariencia del marco no demuestra compartición.

### ¿Qué ocurre con comentarios existentes?

El tema no combina, mueve ni borra discusiones antiguas. Activar compartición puede seleccionar otra; los comentarios pueden seguir en GitHub sin aparecer con la asociación nueva.

Antes de cambiar, guarda repositorio, categoría, mapping, term, number y strict originales. Para restaurar, usa `shareAcrossLocales: false` y esos valores. Desactivar compartición dejando specific y term vacío causa error. Si necesitas migrar, revisa primero datos y asociaciones GitHub; no hay migración automática.

## 6. Activar comentarios de fragments independientemente

Para comentar solo fragments, proporciona la misma conexión y establece:

```ts
theme: {
  fragments: {
    enabled: true,
    comments: { enabled: true },
  },
  comments: {
    enabled: false,
    repo: 'yourname/your-repository',
    repoId: 'REPLACE_WITH_REPO_ID',
    category: 'Announcements',
    categoryId: 'REPLACE_WITH_CATEGORY_ID',
  },
},
```

`theme.comments.enabled: false` solo desactiva entradas. Fragments usa `theme.fragments.comments.enabled`. Mantén true en entradas si las necesitas; configurar fragments no exige cambiar asociaciones existentes de entradas.

Fragments fuerza specific, coincidencia estricta y `fragment/<id>`, ignorando mapping, term, number, shareAcrossLocales y lang fijo de entradas. La interfaz sigue la página y las traducciones con mismo ID comparten discusión. Reacciones, colores y posición reutilizan ajustes comunes. Faltar cualquiera de los cuatro datos causa error explícito.

La primera pulsación inserta el cliente; cerrar lo conserva para reabrir o cambiar fragment. Un fallo o unos 15 segundos sin estar listo ofrecen reintento. El texto de carga no prueba conexión. Consulta [publicar fragments](/es/blog/starter-guide-5-fragments/) para IDs y enlaces.

## Ajustes opcionales de presentación y carga

Todos están en `theme.comments`; suelen bastar los valores predeterminados.

| Campo              | Predeterminado del tema | Propósito                                                                                                                    |
| ------------------ | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `reactionsEnabled` | `'1'`                   | Reacciones de la publicación principal de discusión; `'0'` desactiva la zona.                                                |
| `inputPosition`    | `'bottom'`              | Entrada encima/debajo: `'top'`/`'bottom'`.                                                                                   |
| `theme`            | `'dark'`                | Identificador de tema del iframe Giscus; usa sus valores, no cambia el tema del blog.                                        |
| `strict`           | `'0'`                   | Coincidencia estricta de entradas; compartidas y fragments requieren `'1'`.                                                  |
| `emitMetadata`     | `'0'`                   | Giscus envía metadatos de discusión al padre, no metadatos de publicación. Fragments lo fuerza para detectar disponibilidad. |
| `lang`             | `'en'`                  | Idioma fijo de entradas; `''` sigue la página. Fragments siempre la sigue.                                                   |
| `loading`          | `'lazy'`                | Iframe de entradas `'lazy'`/`'eager'`; fragments usa eager tras abrir.                                                       |
| `crossorigin`      | `'anonymous'`           | Modo del script `'anonymous'`/`'use-credentials'`; normalmente no cambia ni sustituye acceder a GitHub.                      |

`enabled` y `shareAcrossLocales` son booleanos. `strict`, `reactionsEnabled` y `emitMetadata` usan strings `'0'`/`'1'`. No mezcles tipos.

## Resolver comentarios ausentes o mal asociados

| Síntoma                                        | Qué revisar en orden                                                                                     |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| No hay zona de comentarios de entrada          | Entradas activas y cuatro datos presentes; activar fragments no activa entradas.                         |
| Activar fragments causa error                  | Proporciona todos los campos, no solo el control.                                                        |
| Error remoto o carga permanente                | IDs reales, repositorio público, Discussions, aplicación autorizada, categoría correcta, red y bloqueos. |
| Entradas distintas muestran una discusión      | term/number global fijo, configuración compartida y coincidencia real de Giscus.                         |
| Traducciones no comparten                      | shareAcrossLocales, slugs iguales y restricciones de mapping.                                            |
| Comentarios «desaparecen» tras cambiar mapping | Revisa primero GitHub; no renombres ni cambies IDs o borres repetidamente.                               |
| Interfaz sigue en inglés                       | lang es en por defecto; usa `''` para seguir la página. No traduce respuestas.                           |
| Cambios locales no están públicos              | Recompila, despliega y comprueba que producción usa la nueva configuración.                              |

Desactiva entradas con `theme.comments.enabled: false` y fragments con `theme.fragments.comments.enabled: false`. Quitan la entrada/incrustación sin borrar GitHub Discussions. El actualizador no migra discusiones. Conserva mappings antes de actualizar y comprueba después; consulta [instalación](/es/blog/starter-guide-1-configure-your-site/).

## Navegación de tutoriales y diccionario de configuración

[Anterior: ajustar páginas y funciones](/es/blog/starter-guide-3-comments-about-and-theme-toggles/) · [Siguiente: ofrecer el blog en más idiomas](/es/blog/starter-guide-languages/) · [Los ocho tutoriales](/es/blog/starter-guide-1-configure-your-site/#tutorial-order).

Campos relacionados: [parámetros Giscus y discusiones compartidas](/es/blog/config-comments/), [control de fragments](/es/blog/config-fragments/). El [índice](/es/blog/config-reference/) contiene rutas, valores y límites.
