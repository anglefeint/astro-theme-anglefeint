---
tags: ['anglefeint', 'config']
title: 'Referencia de configuración: terminal'
subtitle: 'Terminal virtual y lector de solo lectura de About'
description: 'Tipos, valores, marcadores y límites de los textos de terminal, incluidos los campos sin uso.'
pubDate: '2026-11-13'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/hacker-01.webp'
---

Consulta el archivo en [instalación e identidad](/es/blog/starter-guide-1-configure-your-site/) y contenido/herramientas en [About](/es/blog/config-about/). Otros módulos están en el [índice](/es/blog/config-reference/).

About aloja la terminal virtual interactiva del sitio estándar. Estos campos personalizan avisos, errores y nombres accesibles del lector de solo lectura; no ejecutan una shell local o de servidor. El texto del autor de la terminal ancha de inicio usa messages.home.transmission, documentado en [inicio](/es/blog/config-home/#home-transmission), no este grupo.

<a id="messages"></a>

## Los dieciséis campos messages.terminal

Prefijo completo: `i18n.locales.<locale>.messages.terminal`. Todos son sustituciones string opcionales; usan los textos integrados y la cadena normal de respaldo. La tabla muestra valores predeterminados en chino simplificado / inglés y ejemplos. Requieren About activo, terminal inicializada y el resultado de comando o modo de lectura correspondiente.

| Campo           | Predeterminado chino simplificado / inglés                                                                                          | Estado, función y límites                                                                                      | Ejemplo                                                                          |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `commandInput`  | 终端命令 / Terminal command                                                                                                         | Condicional: nombre accesible de entrada; no ruta del prompt ni título visible.                                | `"Entrada del terminal"`                                                         |
| `hint`          | 输入 help 开始探索。Tab 补全唯一路径，↑/↓ 查看历史命令。 / Type help to explore. Tab completes a unique path; ↑/↓ recalls commands. | Condicional: aviso inicial. También se ejecuta pwd virtual. Vacío quita el aviso sin desactivar terminal.      | `"Escribe help para ver los comandos."`                                          |
| `help`          | 只读虚拟文件，不会在服务器执行命令。 / Read-only virtual files. No commands run on a server.                                        | Condicional: explicación en help; después va ayuda fija de comandos. Vacío no quita la lista completa.         | `"Consulta entradas públicas en modo lectura; no ejecuta comandos del sistema."` |
| `syntax`        | 引号或转义未结束。 / Unclosed quote or escape.                                                                                      | Condicional: comilla/escape sin terminar. Vacío usa la clave syntax.                                           | `"Comillas o escape sin cerrar."`                                                |
| `usage`         | 用法：{value} / Usage: {value}                                                                                                      | Condicional: número de argumentos incorrecto. {value} es la sintaxis de uso; vacío usa usage.                  | `"Uso: {value}"`                                                                 |
| `unknown`       | 不支持此命令：{value} / Command not supported: {value}                                                                              | Condicional: comando no admitido; {value} es el nombre. El texto no añade comandos.                            | `"Comando no compatible: {value}"`                                               |
| `notFound`      | 文件或目录不存在：{value} / No such file or directory: {value}                                                                      | Condicional: ruta virtual ausente. {value} es la ruta solicitada, no estado HTTP.                              | `"No se encontró: {value}"`                                                      |
| `notDirectory`  | 不是目录：{value} / Not a directory: {value}                                                                                        | Condicional: cd apunta a algo que no es directorio; {value} es la ruta.                                        | `"No es un directorio: {value}"`                                                 |
| `isDirectory`   | 这是目录：{value} / Is a directory: {value}                                                                                         | Condicional: cat/vi/vim/view no apunta a archivo; {value} es la ruta.                                          | `"El destino no es un archivo: {value}"`                                         |
| `failed`        | 无法读取：{value} / Unable to read: {value}                                                                                         | Condicional: fallo general de lectura; {value} es la ruta, sin añadir detalles originales automáticamente.     | `"No se pudo leer: {value}"`                                                     |
| `tooLarge`      | 文件超过阅读大小限制：{value} / File exceeds the reading limit: {value}                                                             | Condicional: archivo sobre el límite. {value} es la ruta; cambiar texto no aumenta límite.                     | `"Archivo demasiado grande: {value}"`                                            |
| `empty`         | （空目录） / (empty directory)                                                                                                      | Condicional: ls sin elementos; no aviso de cuerpo de archivo vacío.                                            | `"El directorio está vacío."`                                                    |
| `loading`       | 正在读取… / Loading…                                                                                                                | Condicional: mensaje en la entrada Canvas mientras hay comando pendiente; vacío usa ..., sin cambiar red.      | `"Leyendo…"`                                                                     |
| `readerTitle`   | 文章阅读器 / Article reader                                                                                                         | Sin uso actual: conserva tipos/textos, pero el lector titula con el archivo o su ruta. No permite sustituirlo. | `"Lector de entradas"`                                                           |
| `readerHint`    | 只读 · 输入 :q 并回车退出 · Esc 关闭 / Read only · :q + Enter to exit · Esc to close                                                | Condicional: ayuda del lector. Vacío usa :q; no cambia atajos ni comandos de salida.                           | `"Solo lectura · :q y Enter para salir · Esc para cerrar"`                       |
| `readerCommand` | 阅读器命令 / Reader command                                                                                                         | Condicional: nombre accesible de entrada del lector; vacío usa el nombre de entrada de terminal.               | `"Entrada de comandos del lector"`                                               |

<a id="placeholders"></a>

## Marcadores {value} y strings vacías

usage, unknown, notFound, notDirectory, isDirectory, failed y tooLarge usan el marcador literal {value}. Solo se sustituye la primera aparición. Consérvalo una vez para mostrar comando/ruta; {path}/{command} no funcionan. Se muestran como texto, no código ejecutable.

No hay regla universal de string vacía para desactivar funciones. Esos errores y syntax usan sus claves si están vacíos. loading usa ..., readerHint :q y readerCommand la etiqueta original. hint/help/empty vacíos quitan su texto sin eliminar terminal, ayuda fija ni directorios.

readerTitle no se consume: no controla título. Que su string siga en los paquetes no demuestra efecto renderizado.

<a id="example"></a>

## Ejemplo en español para combinar

Combina en defineThemeConfig({...}) de src/site.config.ts, conservando otros ajustes y sin duplicar i18n. Las sustituciones en español no cambian otros idiomas automáticamente; consulta [respaldo de idiomas](/es/blog/config-languages/#fallback).

```ts
i18n: {
  locales: {
    es: {
      messages: {
        terminal: {
          commandInput: 'Entrada del terminal',
          hint: 'Escribe help para ver los comandos.',
          help: 'Consulta entradas públicas en modo lectura; no ejecuta comandos del sistema.',
          usage: 'Uso: {value}',
          notFound: 'No se encontró: {value}',
          failed: 'No se pudo leer: {value}',
          tooLarge: 'Archivo demasiado grande: {value}',
          readerHint: 'Solo lectura · :q y Enter para salir · Esc para cerrar',
          readerCommand: 'Entrada de comandos del lector',
        },
      },
    },
  },
},
```

<a id="shared-settings"></a>

## Otra configuración utilizada por la terminal

| Configuración                             | Relación con terminal                                                                                       | Referencia principal                                                 |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| theme.enableAboutPage                     | boolean, true por defecto. Desactivar About estándar elimina también su terminal.                           | [Control About](/es/blog/config-about/#page-enabled)                 |
| `i18n.locales.<locale>.about.scriptsPath` | string, /root/bash/scripts por defecto. Prefijo/directorio virtual inicial, no almacenamiento del servidor. | [Herramientas About](/es/blog/config-about/#tool-fields)             |
| `i18n.locales.<locale>.about.sections`    | La biografía pública contribuye a about.md virtual, no a errores de comandos.                               | [Cuerpo About](/es/blog/config-about/#body-fields)                   |
| Entradas del idioma actual                | Rellenan el sistema virtual; JSON de artículos bajo demanda, sin registro manual en site.config.            | [Escribir entradas](/es/blog/starter-guide-2-languages-and-routing/) |

sidebar.allScripts y modals.allScripts.title de About renombrarán entradas de herramienta/diálogos, no comandos. effects.backgroundLines no sustituye realmente la ayuda inicial interactiva; consulta su estado de solo respaldo en [efectos About](/es/blog/config-about/#effect-fields).

<a id="limits"></a>

## Capacidades y límites fijos, no campos site.config

- Los comandos virtuales incluyen help, clear, pwd, ls, cd, cat, vi, vim y view. About también maneja open, close, minimize, maximize y restore de ventana. La implementación decide comandos; cambiar help/unknown no añade comandos del sistema.
- vi/vim/view abren un lector de solo lectura, no editor. Escribe :q, :q! o q y Enter para salir; Esc cierra. readerHint solo cambia ayuda.
- Entrada limitada por defecto a 512 unidades UTF-16 JavaScript, con 50 comandos de historial. Lectura a 262.144 unidades; exceso muestra tooLarge. Las respuestas de red tienen protección separada de lectura; no es permiso de tamaño de subida.
- Las entradas cargan bajo demanda desde JSON de misma origen. No descarga URLs arbitrarias ni lee directorios locales. Archivos y directorios virtuales pueden no necesitar red.
- Fuente, colores y límites de entrada/historial/lectura pueden ser parámetros internos, sin rutas públicas site.config. No hay API key, SSH, shell real ni IA remota.

Recarga la configuración de desarrollo al guardar y recompila/despliega producción. Activa comando/modo de lectura correspondiente para comprobar el texto, no solo un título estático. En especial, readerTitle no cambia nada actualmente. Vuelve al [índice](/es/blog/config-reference/).
