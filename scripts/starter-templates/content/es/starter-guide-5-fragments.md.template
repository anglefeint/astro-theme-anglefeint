---
tags: ['anglefeint', 'starter']
title: 'Guía 4: publicar un fragment'
subtitle: 'Notas breves con imágenes, código e identidad estable'
description: 'Activa Fragments, crea contenido, comparte enlaces estables y configura comentarios opcionales.'
pubDate: '2026-11-11'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

Esta es la parte 4 de 8. [Consulta el orden completo](/es/blog/starter-guide-1-configure-your-site/#tutorial-order) · [Busca campos de configuración](/es/blog/config-reference/).

Una idea, imagen o fragmento de código no necesita una entrada completa. Fragments los muestra cronológicamente en una página propia y ofrece una vista reciente en el inicio.

Esta guía supone el starter de integración actual. Si un proyecto antiguo no tiene estos comandos o funciones, sigue primero la sección de actualización de [instalación](/es/blog/starter-guide-1-configure-your-site/).

## 1. Activar la lista de fragments

Abre `src/site.config.ts` y combina `fragments` dentro del `theme` existente. Edita los campos coincidentes sin crear otro objeto:

```ts
theme: {
  fragments: {
    enabled: true,
    pageSize: 20,
    comments: { enabled: false },
  },
},
```

| Campo                              | Valor predeterminado y propósito real                                                                                |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `theme.fragments.enabled`          | `false`; al activar genera listas de los idiomas activos y permite la vista de inicio si ese idioma tiene contenido. |
| `theme.fragments.pageSize`         | `20`; fragments por página, entero 1–100, independiente de la paginación del blog.                                   |
| `theme.fragments.comments.enabled` | `false`; activa diálogos de comentarios, que también requieren los datos de repositorio Giscus de abajo.             |

Ejecuta `npm run dev` local y abre `/<locale>/fragments/`, por ejemplo `/en/fragments/` o `/zh/fragments/`, bajo la dirección mostrada. El idioma debe estar activo. Una lista vacía es válida sin crear un archivo de página manual. Desactivar Fragments elimina su lista generada y entrada de inicio sin borrar Markdown.

## 2. Crear fragments con el flujo predeterminado

Desde la raíz, ejecuta:

```bash
npm run new-fragment
```

Sin `--locales` ni `ANGLEFEINT_LOCALES`, crea las estructuras de un fragment en todos los idiomas activos: nueve archivos inicialmente. Están en `src/content/fragments/<locale>/` y comparten ID y hora de publicación por ejecución, sin traducirse. La terminal muestra las rutas reales. Los nombres se parecen a `2026-11-13-q8Lm3XzP.md`, con fecha UTC e ID aleatorio. Abre el archivo generado en vez de recrear ese nombre de ejemplo.

Para chino únicamente, puedes usar `npm run new-fragment -- --locales zh`; para varios idiomas, `--locales en,zh`. Elige una alternativa, no todas. Esos argumentos no activan idiomas. Antes de publicar, mueve las estructuras sin terminar fuera del directorio de fragments.

**Cada ejecución crea un fragment nuevo.** Para continuar uno existente, edita el archivo original en vez de repetir la creación. No necesita argumento slug y no sobrescribe archivos existentes.

El starter actual incluye `new-fragment`. Si falta en uno antiguo, confirma primero la actualización del tema y usa su CLI:

```bash
npx @anglefeint/astro-theme new-fragment
```

Es una alternativa al comando anterior, no un segundo paso para crear «el mismo» fragment.

## 3. Sustituir el cuerpo de ejemplo y conservar el ID

El archivo empieza con frontmatter; el cuerpo comienza tras el segundo `---`. Conserva `id` y `pubDate` generados y sustituye el contenido. Esto muestra solo el formato: no reemplaces tu ID por el ejemplo:

```md
---
id: 'q8Lm3XzP'
pubDate: '2026-11-13T09:00:00+08:00'
---

Hoy resolví un problema que llevaba tiempo pendiente; anoto este pequeño avance.
```

Actualmente se admiten tres campos:

| Campo     | Cómo rellenarlo                                                                                                                  |
| --------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `id`      | Obligatorio: exactamente ocho letras ASCII o dígitos, distinguiendo mayúsculas. El comando lo genera y comprueba IDs existentes. |
| `pubDate` | Fecha interpretable obligatoria. Prefiere la marca ISO generada o indica hora y zona.                                            |
| `title`   | String opcional mostrado como título de tarjeta; puede omitirse.                                                                 |

Para añadir título, pon `title: 'Un pequeño avance'` en ese frontmatter. Fragments no exige `description` de artículos ni ofrece `heroImage` de portada; añade las imágenes al cuerpo.

Se ordena por `pubDate` descendente y después ID cuando coincide la hora, no por nombre. Las horas se muestran en UTC y pueden diferir de tu zona. Editar cuerpo o nombre no cambia la identidad de enlaces/comentarios; editar fecha cambia posición y paginación.

**Conserva el ID después de publicar.** Duplicados dentro de un idioma son errores; fragments distintos no deben reutilizarlo. UUID antiguos e IDs largos no son válidos. Haz copia del contenido antes de resolver compatibilidad: IDs, enlaces y comentarios antiguos no se migran automáticamente. Un cambio masivo de IDs no es simple limpieza de archivos.

Solo se recoge `.md` bajo `src/content/fragments/`, no `.mdx`. No hay filtro de borrador o fecha futura. Ni `draft: true` ni una fecha futura ocultan contenido; mantén fuera lo que no esté listo.

## 4. Añadir imágenes, código y fórmulas

Usa párrafos, enlaces, listas y citas Markdown normales. Por ejemplo:

```md
![Captura de este avance](/images/fragments/progress.png)
```

Añade primero `public/images/fragments/progress.png`. También puedes poner `photo.png` junto al fragment y referenciar `![Descripción de la imagen](./photo.png)`. Consulta sintaxis, dimensiones y requisitos de Git en [añadir imágenes](/es/blog/starter-guide-images/).

Conserva cercas e indentación del código:

````md
```js
const progress = {
  done: true,
};
```
````

Los bloques muestran contenido sin ejecutar JavaScript. No supongas que los controles de copiar código o ampliar imágenes de las entradas también se aplican aquí; la lista de fragments no usa actualmente esas interacciones.

Con matemáticas globales activas, se admite `$x_1$` en línea y fórmulas entre líneas `$$`. El renderizado de compilación falla si son inválidas. `theme.math.enabled` desactiva el procesamiento globalmente. Consulta la sintaxis en [escribir entradas](/es/blog/starter-guide-2-languages-and-routing/).

dev, build y doctor (incluido CI) preparan selectivamente los derivados compatibles y reutilizan los válidos. Guarda Markdown y originales; conservar también `src/assets/blog/covers/` permite reutilizarlos. No publiques el cuerpo sin sus imágenes.

**Nota de versión:** La preparación automática de imágenes durante build y doctor en CI requiere 0.36.2 o posterior. Con 0.36.1, ejecuta primero dev o `prepare-covers` para preparar los derivados. `prepare-covers --check` y la sincronización de configuración siguen siendo comprobaciones de solo lectura.

## 5. Vista de inicio y paginación

Con Fragments activo y contenido en el idioma actual, aparece un avatar de píxeles bajo la cabecera de inicio. Ábrelo para ver hasta los tres fragments más recientes. No necesita otro control de inicio y `homeLatestCount` de entradas no cambia esta cantidad.

La vista puede incluir texto, primera imagen utilizable y extracto del primer bloque de código, no todo el cuerpo. Imágenes/código tienen altura limitada y recorte; se omiten elementos posteriores. Pulsa la tarjeta para abrir el fragment. El pie «cantidad vista / total del idioma →» abre la lista completa. Con dos muestra `2 / 2`, no siempre tres. Sin contenido no hay entrada de inicio.

La lista completa usa `theme.fragments.pageSize`. En el ejemplo chino, la primera página es `/zh/fragments/` y la segunda `/zh/fragments/2/`. La apariencia y salto comparten `theme.pagination`; `blogPageSize` no define esta cantidad.

Cambiar idioma en la lista abre la primera página del destino, no necesariamente la misma traducción o número de página. Las cantidades pueden diferir; cada idioma tiene su total.

## 6. Compartir un fragment

No hay páginas individuales de detalle. Comparte el enlace de fecha o el botón de copiar adyacente, por ejemplo:

```text
https://your-domain.example/zh/fragments/#q8Lm3XzP
```

Sustituye dominio e ID. Esos enlaces usan la raíz de lista más el ID, independientemente de su página actual. Añadir contenido o cambiar fecha/pageSize actualiza el índice de posición tras recompilar y desplegar.

Si está en otra página, JavaScript carga bajo demanda el índice estático del idioma, navega y lo localiza. La paginación normal funciona sin JavaScript; la localización entre páginas y la copia no. Si el portapapeles está bloqueado, se ofrece un enlace seleccionable para copiar manualmente.

No uses direcciones con `/2/` como enlaces permanentes. Las páginas antiguas existentes pueden corregir anclas obsoletas, pero un número ya inexistente devuelve 404 normal; el script no controla las páginas 404. Contenido eliminado, IDs desconocidos o fallos de índice muestran un aviso sin restaurar fragments borrados.

Los enlaces comparten la imagen de la lista del idioma, sin imágenes individuales por ID. Consulta [imágenes para compartir](/es/blog/starter-guide-images/) para cambiarla.

## 7. Añadir una traducción del mismo fragment

Para crear solo estructuras china e inglesa, usa esto en lugar del comando predeterminado:

```bash
npm run new-fragment -- --locales zh,en
```

Los archivos de una ejecución comparten ID y hora. Traduce los cuerpos tú mismo. `--locales` elige archivos sin activar idiomas. Prioridad: `--locales` → `ANGLEFEINT_LOCALES` → idiomas activos; omitir argumentos no traduce.

Para añadir inglés a un fragment chino existente, cópialo a `src/content/fragments/en/`, conserva `id` y `pubDate` y traduce título/cuerpo. Repetir la creación asigna otro ID y no añade traducción de la misma identidad. Se puede compartir ID entre idiomas, no entre dos archivos de uno solo.

IDs coincidentes comparten discusiones de fragments. IDs distintos no se asocian por texto o nombres iguales.

## 8. Activar comentarios opcionalmente

Déjalos apagados si solo quieres publicar notas. Para respuestas, sigue primero el [tutorial Giscus](/es/blog/starter-guide-4-giscus-comments/) para preparar repositorio público, Discussions, aplicación y categoría, obtener IDs reales y combinar:

```ts
theme: {
  fragments: {
    enabled: true,
    comments: { enabled: true },
  },
  comments: {
    repo: 'yourname/your-repository',
    repoId: 'REPLACE_WITH_REPO_ID',
    category: 'Announcements',
    categoryId: 'REPLACE_WITH_CATEGORY_ID',
  },
},
```

Sustituye cuenta, repositorio, categoría y ambos IDs. Conserva los demás ajustes `theme.comments`. Faltar campos causa errores de configuración; los valores de ejemplo no prueban la validez remota. No necesitas pegar scripts Giscus ni instalar otro paquete npm.

El control es `theme.fragments.comments.enabled`. No hace falta activar `theme.comments.enabled` de entradas para fragments. Si las entradas ya usan comentarios, conserva ese ajuste.

Fragments fuerza `specific`, coincidencia estricta y `fragment/<id>`. Ignora mapping, term, number, shareAcrossLocales y lang fijo de entradas. La interfaz sigue el idioma de página; IDs iguales comparten discusiones/reacciones sin traducir comentarios. Otros ajustes visuales compartidos proceden de `theme.comments`.

El cliente carga al pulsar comentarios de una tarjeta. Al cerrar se conserva para reutilizar al reabrir o cambiar de fragment. Los fallos o unos 15 segundos sin estar listo permiten reintentar. El texto de carga no demuestra conexión correcta. Publicar requiere autorización GitHub.

Cambiar IDs no migra comentarios antiguos; borrar fragments no borra discusiones GitHub. Evalúa su migración por separado: el tema no las combina automáticamente.

## 9. Comprobar antes de publicar

Revisa contenido, hora, inicio y paginación en dev. Detén dev antes de publicar y ejecuta:

```bash
npm run doctor
npm run preview
```

doctor incluye preparación local de imágenes, verificaciones y compilación; no repitas build inmediatamente después. Usa preview compilado para comprobar enlaces/posición, imágenes y diálogos si están configurados. Preview no publica: despliega los archivos estáticos actualizados.

Fragments no entra en la búsqueda de artículos ni en su RSS. La compilación genera `/zh/fragments/index.md` del idioma (sustituye `zh` para otros), con fragments públicos, IDs, fechas, cuerpos y enlaces estables; lo incluye en los índices para IA. Es una salida pública, no copia privada; excluye comentarios.

- Falta la lista: revisa Fragments y el idioma destino.
- Falta el avatar: comprueba contenido del idioma actual; otro idioma no lo rellena.
- Falla crear por archivos antiguos: revisa el formato de IDs del frontmatter; la creación lee Markdown para evitar colisiones.
- Error de ID duplicado al compilar: comprueba archivos duplicados en un idioma; las traducciones pertenecen a otro directorio.
- Error de imágenes: prepara y guarda originales, manifiesto y derivados según el [tutorial de imágenes](/es/blog/starter-guide-images/).
- Fallo de comentarios: comprueba IDs reales, acceso de aplicación, categoría, red y bloqueos. No cambies repetidamente los IDs de fragments.

Para actualizar, consulta el [primer tutorial](/es/blog/starter-guide-1-configure-your-site/).

## Navegación de tutoriales y diccionario de configuración

[Anterior: añadir imágenes a entradas y fragments](/es/blog/starter-guide-images/) · [Siguiente: ajustar páginas y funciones](/es/blog/starter-guide-3-comments-about-and-theme-toggles/) · [Los ocho tutoriales](/es/blog/starter-guide-1-configure-your-site/#tutorial-order).

Campos relacionados: [controles, paginación y contenido de fragments](/es/blog/config-fragments/), [comentarios de fragments](/es/blog/config-comments/). El [índice](/es/blog/config-reference/) contiene rutas, valores y límites.
