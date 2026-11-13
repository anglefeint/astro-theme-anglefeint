---
tags: ['anglefeint', 'config']
title: 'Referencia de configuración: About'
subtitle: 'Presentación, contacto, herramientas y ventanas'
description: 'Tipos, valores y límites de About, con campos de respaldo y antiguos sin uso.'
pubDate: '2026-11-13'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/hacker-01.webp'
---

Para cambiar tu presentación, empieza por [páginas y funciones](/es/blog/starter-guide-3-comments-about-and-theme-toggles/). Instalación y archivo en el [primer tutorial](/es/blog/starter-guide-1-configure-your-site/). Otros módulos en el [índice](/es/blog/config-reference/).

About no lee cuerpo de un artículo Markdown. El contenido está en `i18n.locales.<语言>.about` de `src/site.config.ts`; títulos de página/secciones en `messages.about` del idioma. Valores del paquete, no perfil del demo.

<a id="page-enabled"></a>

## theme.enableAboutPage: control de página

- **Tipo / predeterminado:** boolean / true.
- **Estado y función:** activo. Genera `/<语言>/about/` para idiomas activos. Apagar quita ruta estándar y destinos de navegación pública/Contacto.
- **Límites:** no oculta solo un párrafo ni borra config. Visitar ruta desactivada no redirige a inicio. Recompila/despliega; no garantiza borrar archivos o datos ya publicados.
- **Ejemplo:** `theme: { enableAboutPage: false }`.

<a id="about-content"></a>

## Contenido About y campos de herramientas

Todos usan **`i18n.locales.<语言>.about.`**. Por ejemplo `sections.who` es `i18n.locales.zh.about.sections.who`. Tipos de sustituciones opcionales antes de combinar. Lo omitido se resuelve con respaldo/defaults. zh / en comparten actualmente el mismo objeto de ejemplo inglés; se muestra una vez. Otros pueden tener traducciones propias: no deduzcas sus defaults de estos.

Sin validación universal de longitud/URL: usa textos cortos y emails/enlaces válidos. Arrays deben ser string[] y sustituyen enteros, no elementos. Vacío no apaga en general: revisa cada fila. Ejemplos van al nivel correspondiente.

<a id="body-fields"></a>

### Cuerpo

| Campo                  | Tipo     | Predeterminado chino simplificado / inglés                                                           | Estado, función y límites                                       | Ejemplo                             |
| ---------------------- | -------- | ---------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- | ----------------------------------- |
| `metaLine`             | string   | `"$ profile booted \| mode: builder"`                                                                | Activo: estado sobre título; vacío oculta línea                 | `"profile ready"`                   |
| `sections.who`         | string   | `"Write a short introduction about yourself, your background, and your primary focus areas."`        | Activo: cuerpo Who, no cambia encabezado                        | `"我是一名前端开发者。"`            |
| `sections.what`        | string   | `"Describe what you build, your core skills, and the kinds of projects you want to be known for."`   | Activo: cuerpo What                                             | `"我在构建个人博客与开源工具。"`    |
| `sections.ethos`       | string[] | Consulta [arrays predeterminados](#array-defaults): sections.ethos                                   | Activo: principio por elemento. [] quita elementos, no título   | `["先保证清晰。","持续小步交付。"]` |
| `sections.now`         | string   | `"Share what you are currently building, shipping, or learning."`                                    | Activo: cuerpo Now                                              | `"最近在学习 Astro。"`              |
| `sections.contactLead` | string   | `"Add a short collaboration note (for example: open to freelance, consulting, or full-time roles)."` | Activo: inicio de contacto unido a etiquetas/enlaces siguientes | `"欢迎交流。"`                      |
| `sections.signature`   | string   | `"> Replace with your own signature."`                                                               | Activo: cita inferior y about.md virtual                        | `"保持好奇。"`                      |

<a id="contact-fields"></a>

### Contacto

| Campo                 | Tipo   | Predeterminado chino simplificado / inglés | Estado, función y límites                                                                                | Ejemplo                         |
| --------------------- | ------ | ------------------------------------------ | -------------------------------------------------------------------------------------------------------- | ------------------------------- |
| `contact.email`       | string | `"you@example.com"`                        | Condicional: email vacío tras trim oculta enlace y contactEmailLead. Enlace usa original: evita espacios | `"hello@example.com"`           |
| `contact.githubUrl`   | string | `"https://github.com/yourname"`            | Activo: URL independiente de social.links. Vacío no oculta enlace entero; usa HTTPS completo             | `"https://github.com/yourname"` |
| `contact.githubLabel` | string | `"GitHub"`                                 | Activo: etiqueta visible, no exige llamarse GitHub                                                       | `"我的 GitHub"`                 |

<a id="tool-fields"></a>

### Entradas de herramientas

| Campo                | Tipo   | Predeterminado chino simplificado / inglés | Estado, función y límites                                                                        | Ejemplo            |
| -------------------- | ------ | ------------------------------------------ | ------------------------------------------------------------------------------------------------ | ------------------ |
| `sidebar.dlData`     | string | `"DL Data"`                                | Activo: botón DL Data y nombre accesible; renombrar no cambia conducta                           | `"数据面板"`       |
| `sidebar.ai`         | string | `"AI"`                                     | Activo: botón IA y nombre accesible                                                              | `"我的工具栈"`     |
| `sidebar.decryptor`  | string | `"Decryptor"`                              | Activo: entrada de decoder, no botones internos                                                  | `"解码工具"`       |
| `sidebar.help`       | string | `"Help"`                                   | Activo: entrada al panel de teclado                                                              | `"键盘"`           |
| `sidebar.allScripts` | string | `"All Scripts"`                            | Activo: directorio de artículos del idioma                                                       | `"全部文章"`       |
| `scriptsPath`        | string | `"/root/bash/scripts"`                     | Activo: ruta mostrada, prefijo virtual y directorio inicial de terminal. No servidor/disco local | `"/home/me/notes"` |

<a id="label-fields"></a>

### Etiquetas generales

| Campo                       | Tipo   | Predeterminado chino simplificado / inglés | Estado, función y límites                                                         | Ejemplo        |
| --------------------------- | ------ | ------------------------------------------ | --------------------------------------------------------------------------------- | -------------- |
| `labels.modalOutput`        | string | `"Output"`                                 | No titula herramientas abiertas; solo HTML inicial sustituido por modals al abrir | `"输出"`       |
| `labels.modalClose`         | string | `"Close"`                                  | Activo: texto accesible de cierres de herramienta/cuerpo; no desactiva            | `"关闭"`       |
| `labels.responseOutput`     | string | `"Output"`                                 | Activo: etiqueta OUTPUT sobre cuerpo                                              | `"OUTPUT"`     |
| `labels.contactEmailLead`   | string | `"Reach me via"`                           | Condicional: antes de email no vacío                                              | `"邮箱："`     |
| `labels.contactConnectLead` | string | `"or connect on"`                          | Activo: siempre antes de enlace de contacto aun sin email; redacta natural        | `"也可以访问"` |
| `labels.backToTop`          | string | `"Back to top"`                            | Condicional: tooltip/nombre accesible, no cambia umbral                           | `"回到顶部"`   |
| `labels.quickAccess`        | string | `"Quick access"`                           | Activo: nombre accesible de navegación lateral                                    | `"快捷工具"`   |
| `labels.contactEmailLabel`  | string | `"email"`                                  | Condicional: texto de enlace email, no dirección; solo con email no vacío         | `"发邮件"`     |

<a id="modal-fields"></a>

### Diálogos de herramientas

| Campo                                     | Tipo     | Predeterminado chino simplificado / inglés                          | Estado, función y límites                                                                 | Ejemplo                                     |
| ----------------------------------------- | -------- | ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------- |
| `modals.dlData.title`                     | string   | `"Downloading..."`                                                  | Condicional: título de animación de datos                                                 | `"数据传输"`                                |
| `modals.dlData.subtitle`                  | string   | `"Critical Data"`                                                   | Condicional: subtítulo de animación, sin descarga real                                    | `"演示数据"`                                |
| `modals.ai.title`                         | string   | `"AI"`                                                              | Condicional: título de panel IA                                                           | `"工具与工作流"`                            |
| `modals.ai.lines`                         | string[] | Consulta [arrays predeterminados](#array-defaults): modals.ai.lines | Condicional: texto estático unido por saltos, sin pedir IA. [] deja pre vacío, panel abre | `["~ $ tools --list","Astro / TypeScript"]` |
| `modals.decryptor.title`                  | string   | `"Hacker Decryptor"`                                                | Condicional: título actual de diálogo decoder, aún consumido                              | `"本地解码工具"`                            |
| `modals.decryptor.header`                 | string   | `"Calculating Hashes"`                                              | Sin uso actual: cuerpo antiguo, DecoderForm no lo lee                                     | `"计算中"`                                  |
| `modals.decryptor.keysLabel`              | string   | `"keys tested"`                                                     | Sin uso actual; no cambia decoder actual                                                  | `"已尝试密钥"`                              |
| `modals.decryptor.currentPassphraseLabel` | string   | `"Current passphrase:"`                                             | Sin uso actual; no cambia decoder actual                                                  | `"当前口令"`                                |
| `modals.decryptor.masterKeyLabel`         | string   | `"Master key"`                                                      | Sin uso actual; no cambia decoder actual                                                  | `"主密钥"`                                  |
| `modals.decryptor.transientKeyLabel`      | string   | `"Transient key"`                                                   | Sin uso actual; no cambia decoder actual                                                  | `"临时密钥"`                                |
| `modals.help.title`                       | string   | `"Help"`                                                            | Condicional: título de teclado                                                            | `"键盘面板"`                                |
| `modals.help.statsLabel`                  | string   | `"Stats & Achievements"`                                            | Condicional: título de estadísticas; vacío usa inglés integrado                           | `"输入统计"`                                |
| `modals.help.typedPrefix`                 | string   | `"You typed:"`                                                      | Condicional: prefijo de conteo; vacío usa inglés                                          | `"已输入："`                                |
| `modals.help.typedSuffix`                 | string   | `"characters"`                                                      | Condicional: sufijo de conteo; vacío usa inglés                                           | `"个字符"`                                  |
| `modals.allScripts.title`                 | string   | `"/root/bash/scripts"`                                              | Condicional: título de directorio independiente de scriptsPath, sin sincronía automática  | `"文章目录"`                                |

<a id="effect-fields"></a>

### Efectos

| Campo                      | Tipo     | Predeterminado chino simplificado / inglés                                  | Estado, función y límites                                                               | Ejemplo                 |
| -------------------------- | -------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ----------------------- |
| `effects.backgroundLines`  | string[] | Consulta [arrays predeterminados](#array-defaults): effects.backgroundLines | No visible en About estándar; solo respaldo sin sesión interactiva. No control de fondo | `["~ $ hello","ready"]` |
| `effects.scrollToasts.p30` | string   | `"context parsed"`                                                          | Condicional: aviso al 30%; vacío usa context parsed                                     | `"读到这里了"`          |
| `effects.scrollToasts.p60` | string   | `"inference stable"`                                                        | Condicional: aviso al 60%; vacío usa inference stable                                   | `"继续探索"`            |
| `effects.scrollToasts.p90` | string   | `"output finalized"`                                                        | Condicional: aviso al 90%; vacío usa output finalized                                   | `"感谢阅读"`            |

El cuerpo es texto normal, no Markdown/HTML. Estilos conservan saltos; negrita, enlaces y etiquetas no se vuelven texto rico. Vaciar no quita encabezados/índice. Orden y anclas who / what / ethos / now / contact son fijos.

Para `scriptsPath` usa directorio virtual absoluto corto con /, como /home/me/notes. Evita saltos, nulos y conflictos con archivos. Normaliza ., .. y barras repetidas. Más de 1024 caracteres o controles ilegales pueden impedir inicialización. No ejecuta shell ni lee servidor arbitrario. Archivos vienen de artículos actuales generados y `about.md`; All Scripts no es lista de scripts ejecutables configurables.

DL Data es animación de progreso, no descarga. Modelo/latencia IA por defecto son estáticos, no estado real. Usa información veraz o indica demostración.

El script inserta las tres strings estadísticas de Help en HTML. Usa texto corto fiable, no entradas externas. Vacío usa inglés, no borra etiquetas. Cuerpo About y líneas IA tienen otro renderizado: no todos los campos admiten HTML.

Los avisos usan progreso de documento completo. Tras comenzar scroll, cada umbral aparece una vez por inicialización. No mide palabras leídas ni IA; sin umbral/duración públicos. Vacío no desactiva avisos.

<a id="array-defaults"></a>

### Valores de los tres arrays

Arrays reales completos de zh / en. Orden y líneas vacías importan. Una sustitución reemplaza todo.

**sections.ethos**

```json
[
  "Prioritize clarity before complexity.",
  "Favor maintainable systems over one-off solutions.",
  "Ship in small iterations and learn from feedback.",
  "Communicate directly and document decisions."
]
```

**modals.ai.lines**

```json
[
  "~ $ ai --status --verbose",
  "",
  "model: anglefeint-core",
  "mode: reasoning + builder",
  "context window: 128k",
  "tools: codex / cursor / claude-code",
  "latency: 120-220ms",
  "safety: guardrails enabled",
  "",
  ">> system online",
  ">> ready for execution"
]
```

**effects.backgroundLines**

```json
[
  "~ $ ls -la",
  "total 42",
  "drwxr-xr-x  12 user  staff   384  Jan 12  about  blog  projects",
  "drwxr-xr-x   8 user  staff   256  Jan 11  .config  .ssh  keys",
  "-rw-r--r--   1 user  staff  2048  Jan 10  README.md  .env.gpg",
  "-rwxr-xr-x   1 user  staff   512  Jan  9  deploy.sh  script",
  "~ $ cat .motd",
  ">> welcome | access granted"
]
```

<a id="about-messages"></a>

## Encabezados y controles compartidos

Bajo `i18n.locales.<语言>.messages`, fuera del contenido about. Strings opcionales con valores integrados/respaldo. Solo chino simplificado / inglés. Cada ejemplo en su campo. Texto no activa funciones ni cambia IDs.

### messages.about

| Campo               | Predeterminado chino simplificado / inglés                                                              | Función y límites                                                                           | Ejemplo                    |
| ------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------- |
| `about.title`       | About — Hacker Ethos / About — Hacker Ethos                                                             | Condicional: título de página, h1, ventana y about.md virtual                               | `"关于我"`                 |
| `about.description` | 我是谁、我在做什么，以及背后的黑客精神。 / Who I am, what I build, and the hacker ethos behind my work. | Condicional: metadescripción, no párrafo bajo encabezado                                    | `"我的经历、工作与兴趣。"` |
| `about.who`         | 我是谁 / Who I Am                                                                                       | Condicional: título Who e índice, no cuerpo ni ancla                                        | `"我是谁"`                 |
| `about.what`        | 我在构建什么 / What I Build                                                                             | Condicional: título What e índice                                                           | `"我在做什么"`             |
| `about.ethos`       | 黑客精神 / Hacker Ethos                                                                                 | Condicional: título Ethos e índice                                                          | `"我的原则"`               |
| `about.now`         | 现在 / Now                                                                                              | Condicional: título Now e índice                                                            | `"最近在忙"`               |
| `about.contact`     | 联系 / Contact                                                                                          | Condicional: título Contact e índice; ancla sigue contact                                   | `"联系我"`                 |
| `about.regenerate`  | 重播扫描 / Replay scan                                                                                  | Condicional: repetir escaneo, tooltip y nombre accesible; solo visual, sin IA ni generación | `"重新扫描"`               |

### messages.windowControls

| Campo                       | Predeterminado chino simplificado / inglés | Función y límites                                          | Ejemplo    |
| --------------------------- | ------------------------------------------ | ---------------------------------------------------------- | ---------- |
| `windowControls.collapse`   | 折叠内容 / Collapse content                | Condicional: minimizar cuerpo/plegar diálogo               | `"最小化"` |
| `windowControls.expand`     | 放大窗口 / Expand window                   | Condicional: maximizar diálogo; cuerpo usa fullscreen      | `"放大"`   |
| `windowControls.restore`    | 还原窗口 / Restore window                  | Condicional: restaurar/reabrir                             | `"还原"`   |
| `windowControls.fullscreen` | 全屏阅读 / Full screen                     | Condicional: fullscreen del navegador sin cambiar permisos | `"全屏"`   |

### messages.scriptFolders

| Campo                     | Predeterminado chino simplificado / inglés                                                                   | Función y límites                                                               | Ejemplo                  |
| ------------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------- | ------------------------ |
| `scriptFolders.copyTitle` | 复制文章标题 / Copy article title                                                                            | Condicional: tooltip/nombre de copiar título en All Scripts, no artículo entero | `"复制标题"`             |
| `scriptFolders.copied`    | 标题已复制。 / Title copied.                                                                                 | Condicional: estado de copia correcta                                           | `"标题已复制"`           |
| `scriptFolders.failed`    | 无法自动复制，已选中完整标题，请手动复制。 / Copy unavailable. The full title is selected; copy it manually. | Condicional: fallo; vacío puede usar inglés en script                           | `"复制失败，请手动复制"` |

<a id="example"></a>

## Ejemplo para combinar

Combina en `defineThemeConfig({...})` de `src/site.config.ts` conservando imports, exports y ajustes, sin duplicar theme/i18n.

```ts
theme: { enableAboutPage: true },
i18n: {
  locales: {
    zh: {
      about: {
        metaLine: '$ profile ready',
        sections: {
          who: '我是一名前端开发者。',
          what: '我在构建个人博客与开源工具。',
          ethos: ['先保证清晰。', '持续小步交付。'],
          now: '最近在学习 Astro。',
          contactLead: '欢迎交流。',
          signature: '保持好奇。',
        },
        contact: {
          email: 'hello@example.com',
          githubUrl: 'https://github.com/yourname',
          githubLabel: 'GitHub',
        },
        scriptsPath: '/home/me/notes',
        modals: {
          allScripts: { title: '文章目录' },
          ai: { lines: ['~ $ tools --list', 'Astro / TypeScript'] },
        },
      },
      messages: {
        about: { title: '关于我', description: '我的经历、工作与兴趣。' },
      },
    },
  },
},
```

La cadena combina recursivamente de menor a mayor prioridad. Idioma actual supera respaldos; About base completa huecos. Arrays sustituyen; undefined no sobrescribe. Configurar solo zh no cambia todos. Consulta [idiomas](/es/blog/starter-guide-languages/) para activación y respaldo.

<a id="boundaries"></a>

## Ajustes relacionados y controles no disponibles

- **Navegación e índice:** `i18n.locales.<语言>.messages.nav.about` controla entrada pública y reabrir tras cerrar. string, chino «关于» / inglés «About»; ejemplo «关于我». `messages.blog.toc` nombra índice y nombre accesible: string, chino «文章目录» / inglés «On this page»; ejemplo «本页目录». También artículos; consulta [textos](/es/blog/config-article/#article-messages).
- **Decoder completo:** `theme.enableDecoderPage` boolean true. `theme: { enableDecoderPage: false }` quita página/enlace completo sin desactivar embebido About. Internos usan `messages.decoder`/`messages.decoderPage`; consulta [Decoder](/es/blog/config-decoder/), no los cinco campos antiguos de arriba.
- **Terminal:** `messages.terminal` contiene interacción compartida, independiente de `about.effects.backgroundLines`. Sistema virtual acotado en navegador: config no autoriza programas locales. Dieciséis campos, marcadores y estado sin uso en [terminal](/es/blog/config-terminal/).
- **Ventanas/animación:** sin controles públicos About de tamaño, cerrado inicial, fade, ocultar herramientas, orden de índice, renombrar Oracle ni apagado independiente. Runtime/almacenamiento gestionan estado. Sin JavaScript el cuerpo se lee, herramientas no garantizadas. Texto visible inmediatamente sin observador de scroll. Runtime respeta movimiento reducido; aquí no se añade control.
- **Contacto:** independiente de `social.links`; modificar redes del pie no actualiza párrafo.

Los cinco campos antiguos decryptor se aceptan pero no se consumen. `backgroundLines` solo respaldo; `modalOutput` solo placeholder inicial. Estados explícitos arriba. No los uses para herramientas actuales ni cambies código para igualar texto obsoleto.
