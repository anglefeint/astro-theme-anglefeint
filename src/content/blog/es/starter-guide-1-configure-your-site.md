---
tags: ['anglefeint', 'starter']
title: 'Guía 1: instalar el blog y poner tus datos'
subtitle: 'Instalación, información personal y flujo predeterminado'
description: 'Instala Anglefeint, configura tus datos y conoce los pasos iniciales y la actualización.'
pubDate: '2026-03-07'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/cyber-02.webp'
---

Esta es la parte 1 de 8. [Consulta el orden completo de los tutoriales](/es/blog/starter-guide-1-configure-your-site/#tutorial-order) · [Busca campos de configuración](/es/blog/config-reference/).

Al terminar, podrás abrir el blog en tu equipo, cambiar el nombre del sitio, la presentación de inicio y los datos de contacto, y localizar dónde escribir tu primera entrada. La música, los comentarios y la personalización de páginas pueden esperar hasta que los necesites.

Si ya tienes un proyecto Anglefeint, modifica ese proyecto. Para actualizar el tema, utiliza «Actualizar un proyecto existente» más abajo; no necesitas instalarlo otra vez.

<a id="tutorial-order"></a>

## ¿En qué orden debo leer los ocho tutoriales?

Para una primera instalación, sigue este orden. Fragments, los comentarios y los cambios de idioma son opcionales; instalar el blog no exige activarlos. El idioma de la documentación no determina el idioma predeterminado del sitio. Consulta la sección de idiomas cuando quieras cambiarlo. Para buscar un campo concreto después, abre el [índice de configuración](/es/blog/config-reference/).

| Orden | Tutorial                                                                                                 | Qué podrás hacer después                                                                    |
| ----- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| 1     | [Instalar el blog y poner tus datos](/es/blog/starter-guide-1-configure-your-site/)                      | Ejecutar el blog, sustituir los datos personales y entender el flujo predeterminado.        |
| 2     | [Escribir tu primera entrada](/es/blog/starter-guide-2-languages-and-routing/)                           | Crear entradas, definir fechas y usar encabezados, etiquetas, código y fórmulas.            |
| 3     | [Añadir imágenes a entradas y fragments](/es/blog/starter-guide-images/)                                 | Añadir originales, elegir portadas, preparar imágenes y guardar los derivados en Git.       |
| 4     | [Publicar un fragment](/es/blog/starter-guide-5-fragments/)                                              | Crear un fragment, conservar su ID estable y añadir imágenes y código.                      |
| 5     | [Ajustar las páginas y funciones a tu gusto](/es/blog/starter-guide-3-comments-about-and-theme-toggles/) | Cambiar contenido, música y paginación, y crear páginas personalizadas.                     |
| 6     | [Permitir comentarios de lectores](/es/blog/starter-guide-4-giscus-comments/)                            | Conectar Giscus y elegir cómo comparten discusiones las entradas, fragments y traducciones. |
| 7     | [Ofrecer el blog en más idiomas](/es/blog/starter-guide-languages/)                                      | Elegir idiomas, ajustar las direcciones de inicio y añadir traducciones.                    |
| 8     | [Publicar el blog en tu dominio](/es/blog/starter-guide-deployment/)                                     | Comprobar los archivos compilados, desplegarlos completos y conectar un dominio.            |

Los enlaces al principio y al final de cada tutorial vuelven aquí para que puedas continuar o buscar un tema concreto.

## 1. Instalar y abrir el blog

Prepara Node.js 22.12.0 o posterior y npm. Ejecuta estos comandos en una terminal y comprueba que ambos muestran una versión:

```bash
node --version
npm --version
```

Crea el blog en el directorio donde guardas los proyectos. El asistente crea `my-blog`; acepta instalar las dependencias (Yes):

```bash
npm create astro@latest -- my-blog --template anglefeint/astro-theme-anglefeint#starter --no-ai
cd my-blog
npm run dev
```

Si elegiste omitir la instalación, ejecuta `npm install` dentro de `my-blog` antes de `npm run dev`. `--no-ai` evita instrucciones genéricas adicionales del asistente; el starter ya incluye las del tema.

Puedes sustituir `my-blog` por otro nombre; cambia también el comando `cd`. Abre la dirección local que muestra la terminal. No supongas que el puerto es fijo: puede cambiar si está ocupado. Mantén el servidor de desarrollo en ejecución y detenlo con `Ctrl+C`.

Ejecuta los siguientes comandos desde la raíz del proyecto, el directorio que contiene `package.json`. Al volver a un proyecto existente, entra en ese directorio y ejecuta `npm run dev`. Solo necesitas `npm install` para instalar las dependencias por primera vez o cuando cambien.

Este tutorial utiliza npm. Los proyectos nuevos con pnpm pueden usar `pnpm install` y `pnpm dev`, pero el actualizador automático descrito abajo solo admite proyectos npm. Utiliza un único gestor por proyecto.

## 2. Cambiar la información del sitio y los textos de inicio

El proyecto instalado ya incluye `src/site.config.ts`. Edita ese archivo; no crees otro archivo de configuración ni declares un objeto nuevo. El starter omite `site` y usa los valores del tema. Añade estos campos dentro del `defineThemeConfig({ ... })` existente. Si ya existe `site`, modifica sus campos y conserva el resto de tus ajustes en vez de duplicarlo. Mantén los imports, exports y demás contenido del archivo.

```ts
site: {
  title: 'El blog de Lin',
  description: 'Apuntes de desarrollo, lecturas y vida cotidiana.',
  url: 'https://example.com',
  author: 'Lin',
  tagline: 'Mantén la curiosidad y sigue escribiendo.',
},
```

Es un fragmento del objeto existente, no un archivo completo nuevo. Sustituye el nombre, los textos y el dominio. No cambia los idiomas predeterminados ni los activos. Pon en `site.url` el dominio público definitivo, por ejemplo `https://your-domain.example`, no la dirección local ni la URL de una entrada. Puedes mantener temporalmente el ejemplo si aún no tienes dominio, pero cámbialo antes del despliegue. El tema espera actualmente publicarse en la raíz de un dominio; establecer solo `base` de Astro no garantiza compatibilidad completa con subdirectorios.

Los campos cumplen estas funciones:

| Campo              | Función real                                                                                                                                  |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `site.title`       | Nombre global en los títulos de página, navegación, pie y otras salidas; último recurso para el título de inicio si no hay uno independiente. |
| `site.author`      | Autor predeterminado para entradas sin autor propio.                                                                                          |
| `site.url`         | Dirección pública para URLs canonical, RSS, sitemap y archivos compartidos.                                                                   |
| `site.description` | Descripción global de respaldo; el inicio prefiere el valor resuelto de `messages.siteDescription` y solo usa este si está vacío.             |
| `site.tagline`     | Texto personalizado del pie; `''` lo oculta. Los créditos del tema y Astro tienen un control separado.                                        |

### Cambiar opcionalmente los textos de inicio de un idioma

Configura la presentación visible y la descripción de metadatos bajo el idioma correspondiente. Este ejemplo utiliza el inicio inglés predeterminado del proyecto. Añade o combina `i18n` dentro del objeto existente; si ya está, modifica sus campos:

```ts
i18n: {
  locales: {
    en: {
      site: { hero: 'Notes on projects, reading and everyday life.' },
      messages: { siteDescription: 'Personal projects and learning notes by Lin.' },
    },
  },
},
```

`i18n.locales.en.site.hero` controla la presentación visible bajo el título del inicio inglés; `messages.siteDescription` controla la descripción SEO. Poner `''` en el primero vacía la presentación sin borrar el segundo. Sustituye en por otro código de idioma activo para editar sus textos. Esto no cambia el idioma predeterminado ni traduce los demás.

El título de inicio usa por defecto el nombre global. Para uno diferente, añade `homeTitle` al mismo `en.site`, conservando `hero`:

```ts
site: {
  homeTitle: "Lin's Digital Garden",
  hero: 'Notes on projects, reading and everyday life.',
},
```

Este `site` está dentro de `i18n.locales.en`, no en el `site` superior. `homeTitle` solo cambia el título visible del inicio, no el nombre global de pestañas, navegación, pie ni RSS. Si se omite o está en blanco, se recorre la cadena de respaldo de idiomas antes de usar el nombre global. Consulta la definición completa en el [diccionario de inicio](/es/blog/config-home/#home-title).

### Añadir tus enlaces sociales

Añade o edita `social.links` en el objeto existente y sustituye `yourname` por tu cuenta:

```ts
social: {
  links: [{ href: 'https://github.com/yourname', label: 'GitHub', icon: 'github' }],
},
```

Cada elemento necesita `href` (destino) y `label` (nombre accesible). `icon` es un nombre opcional de icono integrado. Se admiten `github`, `twitter`, `mastodon`, `youtube`, `bluesky`, `linkedin`, `discord`, `telegram`, `instagram`, `facebook`, `whatsapp` y `line`.

La cabecera y el pie comparten `social.links` en el orden del array. Los enlaces sociales de cabecera se ocultan en pantallas móviles; los del pie permanecen. Los arrays sustituyen toda la lista predeterminada, así que incluye todos los elementos que quieras conservar. Usa `social: { links: [] }` si aún no tienes cuentas. La lista vacía mantiene tres iconos no pulsables de referencia, sin ocultar toda la zona.

### ¿Has cambiado algo y no ves diferencias?

Comprueba si hay sustituciones antiguas en `.env` de la raíz, otros `.env.*` aplicables y el entorno de compilación de tu alojamiento:

- `PUBLIC_SITE_TITLE` sustituye el nombre del sitio.
- `PUBLIC_SITE_AUTHOR` sustituye el autor predeterminado.
- `PUBLIC_SITE_URL` sustituye la dirección del sitio.
- `PUBLIC_SITE_DESCRIPTION` sustituye la descripción global, pero no una descripción de inicio localizada no vacía.
- `PUBLIC_SITE_TAGLINE` sustituye el texto personalizado del pie.

Elimina las sustituciones innecesarias y usa el archivo de configuración. No necesitas un `.env` solo para usar el tema. Reinicia dev si cambias variables de entorno. Las páginas publicadas exigen recompilar y volver a desplegar; guardar un archivo local no cambia la web pública.

## 3. Mantener los idiomas predeterminados y ajustarlos si hace falta

La configuración inicial activa `en`, `ja`, `ko`, `es`, `zh`, `pt-br`, `de`, `ru` y `zh-hant`, con `en` como predeterminado. Visitar `/` redirige a `/en/`. El idioma de la documentación no obliga a cambiar el sitio a chino ni a desactivar otros idiomas antes de crear una entrada.

Para cambiar el predeterminado, conservar solo ciertos idiomas o servir su inicio directamente en `/`, sigue la [parte 7: ofrecer el blog en más idiomas](/es/blog/starter-guide-languages/). Es opcional. Omitir un idioma no lo desactiva: establece explícitamente `meta.enabled: false`. El idioma predeterminado permanece activo. Desactivar un idioma no borra sus entradas.

Consulta tipos, valores y direcciones en el [diccionario de idiomas](/es/blog/config-languages/#registry). El tema no traduce automáticamente entradas ni textos de inicio. Fíjate en qué archivos crea el comando predeterminado de abajo.

## 4. Sustituir los ejemplos por tus entradas

Las entradas están en `src/content/blog/<locale>/`. `welcome-to-anglefeint.md`, `starter-guide-*.md` y `config-*.md` son artículos normales del starter: bienvenida, ocho tutoriales y diccionario de configuración. Tras una copia o commit, conserva o elimina contenido por idioma. Borrar bienvenida y tutoriales no elimina el diccionario. No borres imágenes aún referenciadas.

Crea una entrada con el flujo predeterminado:

```bash
npm run new-post -- my-first-post
```

Sin `--locales` ni `ANGLEFEINT_LOCALES`, crea estructuras equivalentes para todos los idiomas activos: nueve archivos en la configuración inicial. No traduce contenido. Omite los archivos existentes en lugar de sobrescribirlos.

Abre `src/content/blog/<locale>/my-first-post.md` y edita título, descripción y cuerpo. Su dirección es `/<locale>/blog/my-first-post/`. Por ejemplo, el archivo inglés está en en y usa `/en/blog/my-first-post/`; el chino está en zh y usa `/zh/blog/my-first-post/`. Antes de publicar, mueve fuera del directorio de contenido los borradores que no quieras hacer públicos: no se ocultan automáticamente.

Para crear solo un idioma, puedes usar `npm run new-post -- my-first-post --locales zh`; para varios, `--locales en,zh`. Elige el formato que necesites en lugar de ejecutar todos los ejemplos. `--locales` no activa un idioma por sí mismo.

Consulta [escribir y gestionar contenido](/es/blog/starter-guide-2-languages-and-routing/) para campos, portadas, código y fórmulas.

## 5. Confirmar el resultado localmente

Comprueba las páginas de desarrollo: nombre y presentación propios, menú de idiomas correcto, entrada accesible y enlaces sociales reales. Los archivos en otros directorios de idioma solo generan rutas mientras esos idiomas estén activos.

Antes de comprobar la compilación, detén dev con `Ctrl+C` y ejecuta:

```bash
npm run doctor
npm run preview
```

El `doctor` local prepara las imágenes adaptativas ausentes o desactualizadas, ejecuta las comprobaciones Astro y compila. Si About está activo, también verifica su configuración de ejecución. Tras completarlo, no repitas inmediatamente `check` ni `build`. Si falla algo, resuelve el error de terminal y repite `doctor`; no publiques el `dist/` sobrante de una compilación fallida.

`preview` sirve la web estática compilada en `dist/`; abre la dirección mostrada. No publica el blog en internet. Prueba la búsqueda en esta vista compilada, pues `dev` no tiene búsqueda real de texto completo. Detén preview con `Ctrl+C`.

Para desplegar, usa `npm run build`, salida `dist` y todos sus archivos. Las imágenes locales utilizadas se preparan automáticamente en dev, build y doctor, también en CI: los derivados correctos se reutilizan y solo se regeneran los ausentes, obsoletos o dañados. Conserva los originales; guardar también `src/assets/blog/covers/` permite reutilizarlos sin depender de la caché del alojamiento. Los cambios requieren recompilar y desplegar.

**Nota de versión:** La preparación automática de imágenes durante build y doctor en CI requiere 0.36.2 o posterior. Con 0.36.1, ejecuta primero dev o `prepare-covers` para preparar los derivados. `prepare-covers --check` y la sincronización de configuración siguen siendo comprobaciones de solo lectura.

## Actualizar un proyecto existente

Omite esta sección en una instalación nueva. En un proyecto existente, guarda primero los cambios, por ejemplo con Git, detén dev y preview y ejecuta desde su raíz original:

```bash
npx @anglefeint/astro-theme@latest upgrade --check
```

`--check` consulta la versión objetivo y comprueba compatibilidad del proyecto, Node.js y Astro sin modificar archivos, instalar ni compilar. Si termina bien, ejecuta la actualización real:

```bash
npx @anglefeint/astro-theme@latest upgrade
```

La actualización automática admite starters de integración con npm y `package-lock.json`. `package.json` debe contener `anglefeint.projectSchema: 1` y las páginas estándar deben proceder del paquete del tema. Un lockfile de pnpm, yarn o bun detiene el actualizador; no lo borres para eludir esta protección. Otros gestores deben actualizar dependencias con su gestor original tras revisar compatibilidad y ejecutar doctor. El actualizador automático no ofrece reversión en ese caso.

El actualizador cambia la dependencia del tema y ejecuta doctor sin reescribir entradas, configuración, música, imágenes ni páginas personalizadas. Guarda `package.json` y `package-lock.json` en `.anglefeint/backups/`; no es una copia completa del sitio. Si falla la instalación o doctor, restaura ambos archivos e intenta reinstalar las dependencias anteriores. Si la restauración también falla, resuelve el error y ejecuta correctamente `npm run doctor`. La salida compilada anterior no se restaura: no publiques `dist/` tras un fallo.

Una incompatibilidad de Node.js, Astro o schema detiene la actualización; las migraciones Astro no son automáticas. `--to` elige una versión explícita compatible del tema, pero no admite bajar automáticamente de versión. Consulta los cambios en [GitHub Releases](https://github.com/anglefeint/astro-theme-anglefeint/releases). Tras actualizar, usa `npm run preview` para revisar el resultado ya compilado y despliega normalmente; no hace falta compilar inmediatamente otra vez.

Los esqueletos copiados anteriores a 0.27 no se actualizan en el mismo directorio. Instala un starter nuevo en otro directorio, conserva el proyecto antiguo, migra entradas y recursos y combina los valores personales en el nuevo `src/site.config.ts`. No copies rutas estándar, adaptadores ni helpers antiguos de defaults/schema/runtime. Comprueba slugs, rutas de idioma, música, imágenes, dominio y alojamiento; completa después las verificaciones locales y el despliegue.

## Navegación de tutoriales y diccionario de configuración

[Siguiente: escribir tu primera entrada](/es/blog/starter-guide-2-languages-and-routing/) · [Los ocho tutoriales](/es/blog/starter-guide-1-configure-your-site/#tutorial-order).

Campos relacionados: [sitio, redes y pie](/es/blog/config-site-chrome/), [título y presentación de inicio](/es/blog/config-home/), [idiomas](/es/blog/config-languages/). El [índice de configuración](/es/blog/config-reference/) contiene rutas completas, valores y límites.
