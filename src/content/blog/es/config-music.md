---
tags: ['anglefeint', 'config']
title: 'Referencia de configuración: reproductor de música'
subtitle: 'Lista global, textos y límites de reproducción'
description: 'Tipos, valores, validación, carga y restauración del reproductor de música.'
pubDate: '2026-11-13'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

Para añadir una canción, consulta [configuración de música](/es/blog/starter-guide-3-comments-about-and-theme-toggles/). El archivo se explica en [instalación](/es/blog/starter-guide-1-configure-your-site/); otros módulos están en el [índice](/es/blog/config-reference/).

Configura `theme.music` en `src/site.config.ts`. El paquete la desactiva con lista vacía y sin pistas incluidas. Son los valores del paquete, no la lista del demo.

<a id="enabled"></a>

## theme.music.enabled: control del reproductor

- **Tipo / predeterminado:** boolean / false.
- **Estado y función:** activo. Los layouts estándar lo muestran solo si está activo y tiene alguna pista válida.
- **Límites:** true sin pistas no lo muestra. Desactivado no tiene lista efectiva y omite validar pistas. No borra configuración/audio público ni impide acceso directo a archivos publicados.
- **Ejemplo:** `theme: { music: { enabled: false } }`.

Es global, no por inicio/idioma. Las páginas estándar comparten lista; las personalizadas eligen usar ese framework.

<a id="tracks"></a>

## theme.music.tracks: lista de reproducción

- **Tipo / predeterminado:** MusicTrack[] / []. Cada elemento tiene los tres campos de abajo.
- **Estado y función:** condicional a música activa; orden y cambios siguen el array. Sin límite público de cantidad.
- **Límites:** debe ser array al estar activo. Vacío es válido pero normaliza el reproductor a apagado. Sustituye, no añade a listas previas; conserva todas las pistas deseadas.
- **Ejemplo:** [{ title: '我的一首歌', artist: '作者', src: '`/music/my-song.mp3`' }].

Títulos/artistas/URLs son globales, no messages localizados. Cambiar idioma no cambia lista. Objetos de listas de terceros o URLs de compartir no sustituyen este array.

<a id="track-fields"></a>

### Campos de pista

Prefijo completo: `theme.music.tracks[]`. «Ninguno» indica que no se suministra valor automático a pistas propias.

| Campo  | Tipo / predeterminado                           | Estado, función y límites                                                                                                                                       | Ejemplo              |
| ------ | ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| title  | string obligatoria / ninguno                    | Condicional: nombre en vista principal, plegada y lista. No vacío tras recortar. Un nombre en blanco falla; no usa nombre de archivo ni metadatos               | '我的一首歌'         |
| artist | string opcional / sin definir, normalizada a '' | Condicional: artista en vista principal/lista. Debe ser string si existe y se recorta. Vacío no usa autor del sitio ni metadatos                                | '作者'               |
| src    | string obligatoria / ninguno                    | Condicional: empieza por un solo / o https:// en minúsculas, sin espacios ni barras invertidas. HTTPS debe ser URL válida. No comprueba existencia ni contenido | '/music/my-song.mp3' |

title/artist son texto, sin Markdown/HTML. No hay campos públicos de portada, letra, duración, álbum, ID ni volumen por pista.

Reglas importantes de src:

- Prefiere `public/music/` y URLs /music/archivo, sin public, disco Windows ni src/assets. Se admiten otras rutas raíz válidas; /music/ y extensiones de audio no son validadores obligatorios.
- Se rechazan http://, //example.com/file.mp3, data:, blob: y rutas relativas normales. El prefijo HTTPS distingue mayúsculas; usa https:// minúsculo.
- Espacios literales inválidos. Puedes codificar URL, pero eso no prueba existencia. No añadas espacios exteriores.
- A las rutas raíz se añade Astro BASE_URL al renderizar; no dupliques prefijos. HTTPS no cambia.
- Configuración válida no prueba acceso/compatibilidad del navegador. Una página de compartir no es audio directo. El fetch remoto necesita CORS; reproducir en otra pestaña no demuestra lectura entre orígenes.

La restauración compara src, no título. Prefiere URLs distintas. Duplicados src no fallan, pero se restaura la primera coincidencia.

<a id="example"></a>

## Ejemplo de lista para combinar

Prepara tú `public/music/my-song.mp3`: es una ruta de ejemplo, no audio generado. Combina en `defineThemeConfig({...})` de `src/site.config.ts`; conserva imports/exports y ajustes sin duplicar theme.

```ts
theme: {
  music: {
    enabled: true,
    tracks: [
      {
        title: '我的一首歌',
        artist: '作者',
        src: '/music/my-song.mp3',
      },
    ],
  },
},
```

`enabled: false` detiene el reproductor sin borrar pistas. Recarga configuración dev; recompila/despliega producción. Subir audio no lo registra en tracks.

<a id="music-messages"></a>

## messages.music: diecinueve textos de interfaz y accesibilidad

Prefijo completo: `i18n.locales.<语言>.messages.music.`. Todos son **string** opcionales con textos integrados/respaldo. La tabla muestra chino simplificado / inglés y ejemplos. Necesitan reproductor renderizado y estado/control correspondiente. Vacío sustituye texto sin ocultar función y puede quitar nombres accesibles útiles.

| Campo      | Predeterminado chino simplificado / inglés                                                                      | Función y límites                                                      | Ejemplo                                |
| ---------- | --------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | -------------------------------------- |
| `label`    | 音乐播放器 / Music player                                                                                       | Nombre accesible del aside, no texto visible AUDIO CHANNEL             | `"音乐播放器"`                         |
| `play`     | 播放 / Play                                                                                                     | Nombre accesible de reproducir; texto visible PLAY                     | `"播放"`                               |
| `pause`    | 暂停 / Pause                                                                                                    | Nombre accesible de pausa/carga; visible PAUSE                         | `"暂停"`                               |
| `prev`     | 上一首 / Previous                                                                                               | Nombre accesible de anterior; visible PREV                             | `"上一首"`                             |
| `next`     | 下一首 / Next                                                                                                   | Nombre accesible de siguiente; visible NEXT                            | `"下一首"`                             |
| `open`     | 展开播放器 / Open player                                                                                        | Nombre accesible de abrir plegado; visible OPEN                        | `"展开播放器"`                         |
| `close`    | 收起播放器 / Collapse player                                                                                    | Nombre accesible de plegar; visible MIN. No pausa                      | `"收起播放器"`                         |
| `progress` | 播放进度 / Progress                                                                                             | Nombre accesible de progreso; no cambia rango de búsqueda              | `"播放进度"`                           |
| `volume`   | 音量 / Volume                                                                                                   | Nombre accesible de volumen; no fija volumen inicial. Visible LVL      | `"音量"`                               |
| `queue`    | 歌单 / Playlist                                                                                                 | Nombre accesible de lista; QUEUE y SHOW/HIDE son fijos                 | `"展开或收起歌单"`                     |
| `mute`     | 静音 / Mute                                                                                                     | Nombre accesible para silenciar; visible MUTE                          | `"静音"`                               |
| `unmute`   | 取消静音 / Unmute                                                                                               | Nombre accesible para restaurar desde cero; visible UNMUTE             | `"恢复音量"`                           |
| `idle`     | 就绪 / Ready                                                                                                    | Estado SIGNAL inicial y al cambiar pista                               | `"等待播放"`                           |
| `loading`  | 加载中 / Loading                                                                                                | Estado SIGNAL durante descarga/espera                                  | `"正在加载歌曲"`                       |
| `playing`  | 播放中 / Playing                                                                                                | Estado SIGNAL al reproducir                                            | `"正在播放"`                           |
| `paused`   | 已暂停 / Paused                                                                                                 | Estado SIGNAL en pausa                                                 | `"已暂停"`                             |
| `blocked`  | 浏览器阻止了自动播放，请点击 PLAY 继续播放。 / Click Play to continue. Your browser blocked automatic playback. | Rechazo de permiso del navegador; cambiar texto no elimina restricción | `"请点击播放以继续。"`                 |
| `error`    | 播放失败，请重试或切换歌曲。 / Unable to play. Try again or select another track.                               | Fallo de solicitud/reproducción o montaje del módulo                   | `"歌曲未能加载，请重试。"`             |
| `noScript` | 请启用 JavaScript 使用播放器。 / Enable JavaScript to use the player.                                           | Aviso noscript; no hay controles nativos alternativos                  | `"启用 JavaScript 后可以使用播放器。"` |

No sustituyen todas las etiquetas visibles. PLAY/PAUSE, PREV/NEXT, OPEN/MIN, MUTE/UNMUTE, QUEUE, SHOW/HIDE, TRACKS, LVL, AUDIO CHANNEL, STATE, SIGNAL y STANDBY son textos/códigos fijos. Los campos configurables aportan nombres accesibles o estados SIGNAL visibles. Que el botón siga en inglés no significa que su nombre accesible no se use.

Por ejemplo, cambia solo carga/error chinos:

```ts
i18n: {
  locales: {
    zh: {
      messages: {
        music: {
          loading: '正在加载歌曲',
          error: '歌曲未能加载，请重试。',
        },
      },
    },
  },
},
```

Consulta activación/respaldo en [idiomas](/es/blog/starter-guide-languages/). Los textos siguen el idioma; la lista es global.

<a id="loading"></a>

## ¿Cuándo descarga audio y por qué tarda?

Sin estado de restauración, inicializar la interfaz no descarga audio. Play, anterior, siguiente o seleccionar pista lo solicita. Expandir panel/lista no descarga todas. Restaurar estado de pestaña sí puede solicitar una pista automáticamente.

Descarga la pista completa a Blob antes de entregarla a Audio; no es streaming progresivo. Permite buscar posición aunque el servidor ignore Range. Archivos grandes aumentan espera y memoria. No transcodifica, comprime ni genera calidades alternativas.

Pausa/reanudar reutiliza Audio/Blob actual. Cambiar pista aborta descargas incompletas y libera recursos previos; volver puede solicitar otra vez. Caché HTTP no es caché permanente del reproductor. Un fallo no salta de pista: pulsa reproducir para reintentar. Rechazo de permiso muestra blocked y requiere acción del usuario.

Descargas remotas exigen respuesta correcta y CORS. No hay proxy, cabeceras de autorización ni credenciales personalizadas. Los archivos locales no necesitan configuración cruzada. Cambiar estados no repara rutas, permisos ni formatos.

<a id="runtime-state"></a>

## Reproducción, restauración y apariencia: comportamiento fijo y límites

| Elemento                 | Comportamiento actual                                                                                                              | ¿Campo público site.config?               |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| Pista inicial            | Primera pista sin coincidencia guardada; se compara src resuelto                                                                   | No hay defaultTrack                       |
| Volumen inicial          | 0.5 inicialmente; puede restaurar volumen de sesión                                                                                | No hay defaultVolume                      |
| Silencio                 | Pone volumen a cero y restaura el anterior no nulo sin detener descarga ni reproducción                                            | Sin opción separada de silencio           |
| Avance automático        | Siguiente al terminar; última vuelve a primera, sin aleatorio                                                                      | Sin shuffle/repeat/loop                   |
| Restauración             | sessionStorage guarda src, posición, volumen, plegado e intención; intenta retomar en la misma pestaña según permisos              | Sin autoplay/resume                       |
| Panel inicial            | Empieza plegado. Parámetros iniciales del componente priman sobre preferencia guardada; BFCache restaura por separado              | Sin theme.music.collapsed                 |
| Plegar, expandir y lista | Cambios visuales sin pausa; Escape pliega el panel expandido                                                                       | Sin campo de atajos                       |
| Atmósfera                | El framework elige Matrix/Cyber/Hacker/AI/base según página, no género musical                                                     | Sin theme.music.scene                     |
| Animación                | Los efectos Matrix dependen de reproducción, visibilidad y plegado, respetando movimiento reducido; su fallo no debe detener audio | Sin control dedicado de efectos de música |

sessionStorage es estado de sesión, no nube permanente ni sincronización entre pestañas. Sin guardado puede reproducir, sin garantizar restauración ni continuidad al navegar. Sin JavaScript aparece noScript y no hay interacción.

Los parámetros de componente/layout `initiallyCollapsed`, `musicInitiallyCollapsed` y `scene` no son campos públicos site.config. Añadirlos bajo `theme.music` no hace nada. Las páginas estándar empiezan plegadas; el usuario expande. Los títulos no cambian la atmósfera.

Los dos campos, tres campos de pista y diecinueve textos tienen consumidores. No hay ajustes extra de compatibilidad/retirados que rellenar. Arriba se distinguen nombres accesibles, inglés fijo y sesión. Vuelve al [índice](/es/blog/config-reference/).
