---
tags: ['anglefeint', 'starter']
title: 'Guía 3: añadir imágenes a entradas y fragments'
subtitle: 'Originales, portadas, archivos adaptativos e imágenes compartidas'
description: 'Añade imágenes, prepara derivados persistentes localmente y publica todos los recursos necesarios.'
pubDate: '2026-11-13'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/cyber-03.webp'
---

Esta es la parte 3 de 8. [Consulta el orden completo](/es/blog/starter-guide-1-configure-your-site/#tutorial-order) · [Busca campos de configuración](/es/blog/config-reference/).

No necesitas producir varios tamaños manualmente ni sustituir las referencias por nombres generados. Añade el original, úsalo en una entrada o fragment y deja que el servidor de desarrollo local prepare los archivos adaptativos.

Este tutorial supone los directorios predeterminados `src/` y `public/` del starter. Distingue primero el propósito de la imagen:

| Propósito                 | Dónde configurarlo                                     | Tratamiento actual                                                                                          |
| ------------------------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| Cuerpo de entrada         | Imagen Markdown o MDX                                  | Flujo Markdown/MDX existente; fuera de la preparación persistente de portadas descrita abajo.               |
| Portada de entrada        | `heroImage` del frontmatter                            | Archivos adaptativos preparados localmente, compartidos por listas y detalle.                               |
| Imagen de fragment        | Imagen Markdown, de referencia o HTML `img` del cuerpo | Las imágenes locales admitidas usan los mismos derivados persistentes en listas y vistas previas de inicio. |
| Vista previa al compartir | `ogImage` individual o `site.ogImage`                  | Lógica independiente para compartir, no una miniatura de portada.                                           |

## 1. Añadir el original al proyecto

Una imagen usada por una sola entrada puede estar a su lado:

```text
src/content/blog/zh/
  my-first-post.md
  photo.jpg
  cover.jpg
```

También puedes poner imágenes junto al Markdown de un fragment. Las compartidas pueden ir en `public/images/`:

```text
public/images/
  shared-photo.jpg
  fragments/
    my-photo.png
```

Crea los directorios si faltan. Prefiere letras simples, números y guiones; evita confundir mayúsculas. Las URLs usan `/`, no rutas locales `C:\...`, `D:\...` ni barras invertidas. En un alojamiento sensible a mayúsculas, `Photo.jpg` y `photo.jpg` pueden ser archivos distintos.

Conserva el original. Los WebP generados son derivados de visualización, no copias de seguridad sustitutivas.

## 2. Insertar una imagen en el cuerpo de una entrada

En el Markdown, inserta:

```md
![这张照片里有什么](./photo.jpg)
```

`./photo.jpg` es relativo al archivo de entrada; en el ejemplo de directorios corresponde al archivo vecino. Para un archivo público, usa:

```md
![这张照片里有什么](/images/shared-photo.jpg)
```

Corresponde a `public/images/shared-photo.jpg`, sin `public` en la URL. El texto entre corchetes es alternativo: describe la imagen en vez de poner solo «imagen».

Las imágenes normales del cuerpo admiten pulsación o foco y Enter/Espacio para abrir una vista ampliada. Cierra con Esc, botón o fondo. Se excluyen portadas e imágenes dentro de enlaces/botones. La vista usa la fuente seleccionada por el navegador; no descarga un original mayor ni es una galería.

Ejecutar `prepare-covers` no comprime todas las imágenes del cuerpo. Procesa bancos de portadas, referencias de portada e imágenes locales de fragments. Una imagen pública de un cuerpo normal puede seguir descargando el original. Elige dimensiones adecuadas y evita capturas de varios megabytes.

## 3. Establecer una portada

Pon `cover.jpg` junto a la entrada y añade o edita su frontmatter:

```yaml
heroImage: ./cover.jpg
```

`heroImage` es opcional. Si existe, debe referenciar una imagen local del proyecto, no una URL HTTPS directa. No trates `/images/cover.jpg` como URL pública para este campo: sus reglas difieren de las imágenes del cuerpo.

Para gestionar portadas centralmente, usa `src/assets/blog/covers/originals/`. Si la entrada está en `src/content/blog/zh/my-first-post.md` y el original en `src/assets/blog/covers/originals/my-cover.jpg`, escribe:

```yaml
heroImage: ../../../assets/blog/covers/originals/my-cover.jpg
```

La portada no se inserta sola en el cuerpo. Aparece en listas de entradas/etiquetas y la zona de portada del detalle. El diseño puede recortar la zona visible, pero los derivados conservan la proporción original y no eligen automáticamente una persona o sujeto como foco.

La selección aleatoria de `new-post` solo lee `src/assets/blog/default-covers/`. Añadir una imagen a `covers/originals/` no la incluye en esa selección; referencia explícitamente los originales nuevos.

## 4. Añadir imágenes a fragments

Con `theme.fragments.enabled: false`, dev, build y prepare-covers/doctor omiten referencias de imágenes del contenido de Fragments. No exigen originales ni derivados de imágenes incluidas únicamente por esas referencias. Las referencias de portada y los conjuntos `src/assets/blog/default-covers/` y `src/assets/blog/covers/originals/` siguen preparándose y validándose, aunque una imagen se use solo en Fragments. No se borran archivos; reactivar restablece el procesamiento de Fragments.

**Nota de versión:** El aislamiento de imágenes al desactivar requiere 0.36.1 o posterior; no está en 0.36.0. No lo supongas disponible en versiones anteriores.

Pon el original en `public/images/fragments/my-photo.png` y escribe esto en el cuerpo de un fragment existente:

```md
![这条碎片的配图说明](/images/fragments/my-photo.png)
```

También puedes poner `photo.png` junto al fragment y usar `![配图说明](./photo.png)`. Añadir un archivo a public no inicia un escaneo universal de imágenes: debe estar referenciado por un fragment real.

Se admiten imágenes de referencia:

```md
![配图说明][photo]

[photo]: /images/fragments/my-photo.png
```

Usa HTML para dimensiones manuales:

```html
<img src="/images/fragments/my-photo.png" alt="配图说明" width="640" height="360" />
```

Estas dimensiones son ejemplos; utiliza la proporción real. Las imágenes locales admitidas reciben width/height ausentes. Se conservan las dimensiones existentes; si solo hay una, se calcula la otra con la proporción de origen. No se corrigen dimensiones existentes incorrectas.

La primera imagen de cada página de lista carga con prioridad; las restantes y las miniaturas de inicio usan carga diferida. Las vistas previas de inicio tienen altura máxima y recortan el exceso. No son visores completos: pulsa la tarjeta para abrir el fragment. Consulta [publicar fragments](/es/blog/starter-guide-5-fragments/) para creación, IDs estables y comentarios.

## 5. Preparar archivos adaptativos localmente

Tras referenciar por primera vez una imagen o sustituir su original, inicia el desarrollo local desde la raíz:

```bash
npm run dev
```

dev prepara archivos ausentes u obsoletos y responde a cambios de originales y referencias pertinentes. `npm run doctor` local también los prepara antes de verificar y compilar. Para prepararlos sin iniciar páginas ni comprobaciones completas, detén dev y ejecuta:

```bash
npx @anglefeint/astro-theme prepare-covers
```

Para validar los archivos existentes sin generar sustitutos:

```bash
npx @anglefeint/astro-theme prepare-covers --check
```

No hace falta recodificarlo todo. Se comparan hashes de origen, receta y salida para decidir qué reutilizar. Cambiar originales actualiza sus derivados; las salidas individuales ausentes o modificadas se reparan selectivamente. No edites el manifiesto, renombres archivos generados ni pongas sus URLs en las entradas.

Reglas actuales:

- Los raster estáticos se convierten a WebP con calidad 80: objetivo con pérdidas, sin garantía de píxeles idénticos.
- Los anchos candidatos son 400, 640, 800, 960 y 1200px, conservando los adecuados al origen. Se añade su ancho cuando hace falta hasta 1200px, sin ampliar imágenes pequeñas.
- Se corrige orientación EXIF y conserva proporción, sin crear recortes de composición alternativos.
- SVG y animaciones de varios fotogramas mantienen su formato, sin convertirse en WebP estático. Un GIF de un fotograma puede procesarse como estático; la extensión por sí sola no determina el tratamiento.
- El banco predeterminado, el de originales y las referencias reales delimitan el alcance. No se convierte toda imagen pública.

El navegador elige candidatos con `srcset`, `sizes`, tamaño visible y densidad de píxeles. No necesitas directorios separados por tamaño. El máximo es 1200px, sin garantizar detalle equivalente al original en pantallas grandes de alta densidad.

## 6. Qué guardar en Git y qué ocurre al desplegar

Los archivos preparados se organizan así:

```text
src/assets/blog/covers/
  originals/      # 如果使用这个原图目录
  manifest.json  # 来源、尺寸、规则与输出哈希
  generated/     # 持久响应式文件
```

Guarda conjuntamente:

1. Markdown de entradas/fragments y originales nuevos o sustituidos.
2. Todo `src/assets/blog/covers/`, incluidos manifiesto y generados.

Guarda también los originales de public o junto a entradas, no solo originals/. Los derivados de fragments también están aquí pese al nombre blog/covers.

Detén dev antes de publicar y ejecuta `npm run doctor` local. Después usa `npm run preview` para revisar la compilación. doctor ya compila: no repitas inmediatamente. El alojamiento sigue usando `npm run build`, salida `dist` y todos sus archivos.

**Las compilaciones de despliegue validan y copian los derivados preparados sin generar los ausentes.** doctor en CI también solo valida. Si faltan, están obsoletos o modificados, falla: prepara localmente, guarda en Git y vuelve a desplegar. Este flujo persistente no depende de que el alojamiento conserve la caché de imágenes Astro.

Los derivados usados se copian a `_blog-covers/` en la salida. No subas solo HTML ni omitas ese directorio. Los generados antiguos sin uso no se borran automáticamente; revisa referencias antes de limpiar y no elimines originales necesarios.

Consulta [heroImage/ogImage](/es/blog/config-article/#frontmatter) y [reglas de vista previa de fragments](/es/blog/config-fragments/#preview-and-links) para distinguir campos.

## 7. Qué imagen aparece al compartir un enlace

Es la vista previa de la tarjeta de enlace, distinta de la portada visible.

Por defecto, cada entrada genera durante la compilación un PNG 1200×630 con título, autor y nombre del sitio. No necesita servicio de imágenes ni navegador. Recompila y despliega si cambias esos valores. `theme.footer.showCredits` también controla el crédito del tema en estas imágenes automáticas, sin modificar imágenes personalizadas subidas.

### Elegir la imagen para compartir de una entrada

Pon `share.png` junto a la entrada y añade:

```yaml
ogImage: ./share.png
```

O usa `public/images/share.png` con `ogImage: /images/share.png`. También admite URLs HTTPS. El schema de imágenes procesa archivos relativos; se comprueba la existencia de rutas públicas. La disponibilidad remota depende del otro servidor.

### Definir el respaldo para páginas sin imagen propia

Combina dentro del `site` superior existente en `src/site.config.ts`:

```ts
site: {
  ogImage: '/images/site-share.jpg',
},
```

Añade primero `public/images/site-share.jpg`. `site.ogImage` también admite HTTPS. Si falta o está en blanco, usa la imagen integrada 1200×630 del tema. Aquí no valen rutas relativas a una entrada.

Prioridad actual:

1. `ogImage` explícita de la entrada.
2. Imagen automática de entrada mientras esté activa.
3. `heroImage` cuando `theme.socialImage.enabled` está desactivado.
4. `site.ogImage` para páginas sin imagen específica; después, el respaldo integrado.

Cambiar solo `site.ogImage` no sustituye las automáticas de entrada. Las páginas de fragments y sus enlaces `#ID` comparten el respaldo global, sin tarjeta individual generada por fragment.

Las automáticas están en `dist/_social/`. Las plataformas leen metadatos publicados y pueden mantener cachés antiguas; ver la imagen nueva localmente no actualiza sus vistas inmediatamente.

## 8. Resolver problemas de imágenes

| Síntoma                                              | Qué comprobar primero                                                                                      |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Falta una imagen                                     | Existencia, mayúsculas exactas y rutas relativas al Markdown; omite `public` en URLs públicas.             |
| Falla la preparación de portada                      | `heroImage` debe ser un archivo local, no URL remota/pública; lee el error completo.                       |
| Derivados missing/stale/modified                     | Detén dev, ejecuta prepare-covers local, guarda originales, manifiesto y generados, y recompila.           |
| Archivo público sin tamaños generados                | ¿Está referenciado por un fragment? Las imágenes públicas de cuerpos normales quedan fuera.                |
| GIF/SVG sigue pesando mucho                          | Animaciones/vector pasan sin conversión; no se convierten a vídeo ni se comprimen con este comando.        |
| Imagen remota de fragment lenta o desplaza el diseño | No se convierte ni mide localmente. Optimiza el origen y añade dimensiones correctas.                      |
| Funciona localmente pero no publicado                | Comprueba que originales y generados estén en Git, todo dist publicado y rutas sin reescrituras indebidas. |
| La vista al compartir sigue antigua                  | Revisa compilación/despliegue, prioridad de imagen individual y cachés de plataformas.                     |

Si personalizas srcDir, publicDir o fuentes con base de Astro, prepara a través de dev de ese proyecto. prepare-covers independiente usa los directorios predeterminados. La compatibilidad parcial de imágenes con base no implica que todo el tema admita cualquier despliegue en subdirectorios.

Para instalar/actualizar, consulta [instalar el blog y poner tus datos](/es/blog/starter-guide-1-configure-your-site/). Consulta [escribir tu primera entrada](/es/blog/starter-guide-2-languages-and-routing/) para campos y sintaxis.

## Navegación de tutoriales y diccionario de configuración

[Anterior: escribir tu primera entrada](/es/blog/starter-guide-2-languages-and-routing/) · [Siguiente: publicar un fragment](/es/blog/starter-guide-5-fragments/) · [Los ocho tutoriales](/es/blog/starter-guide-1-configure-your-site/#tutorial-order).

Campos relacionados: [portadas e imágenes compartidas](/es/blog/config-article/), [vistas previas de fragments](/es/blog/config-fragments/), [respaldo global](/es/blog/config-site-chrome/). El [índice](/es/blog/config-reference/) contiene rutas, valores y límites.
