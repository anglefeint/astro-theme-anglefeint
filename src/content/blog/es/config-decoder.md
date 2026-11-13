---
tags: ['anglefeint', 'config']
title: 'Referencia de configuración: Decoder'
subtitle: 'Herramientas locales, textos y lecturas'
description: 'Tipos, valores, ejemplos y límites de Decoder, sus textos y tarjetas de lectura.'
pubDate: '2026-11-13'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/hacker-01.webp'
---

Consulta el archivo en [instalación e identidad](/es/blog/starter-guide-1-configure-your-site/), y controles en [páginas y funciones](/es/blog/starter-guide-3-comments-about-and-theme-toggles/). Es referencia de campos; otros módulos están en el [índice](/es/blog/config-reference/).

Las «tarjetas de lectura» son los enlaces al final de Decoder, no tarjetas Blog List. No se generan automáticamente de entradas. Valores del paquete actual, no del demo.

<a id="page-enabled"></a>

## theme.enableDecoderPage: página independiente

- **Tipo / predeterminado:** boolean / true.
- **Función y estado:** activo. Genera `/<语言>/decoder/` en idiomas activos y controla enlaces completos de cabecera y diálogo About.
- **Límites:** apagar página no desactiva decoder de texto embebido. theme.enableAboutPage controla About. No borra contenido ni garantiza limpieza del alojamiento. Recompila/despliega.
- **Ejemplo:** `theme: { enableDecoderPage: false }`.

| Función                                    | Decoder independiente      | Decoder embebido About                           |
| ------------------------------------------ | -------------------------- | ------------------------------------------------ |
| Decodificar texto                          | Sí                         | Sí                                               |
| Llamadas de tokens / comprobar direcciones | Sí                         | No                                               |
| Historial por pasos / exportar JSON        | Sí                         | No                                               |
| Lecturas / homenaje                        | Sí                         | No                                               |
| Textos internos compartidos                | messages.decoder           | messages.decoder                                 |
| Título y entrada                           | messages.decoderPage, etc. | About sidebar.decryptor / modals.decryptor.title |

header, keysLabel, currentPassphraseLabel, masterKeyLabel y transientKeyLabel antiguos de About siguen aceptados por tipos, no leídos. Consulta [herramientas About](/es/blog/config-about/#modal-fields). No cambian esta página.

<a id="text-messages"></a>

## messages.decoder: textos compartidos de herramientas

Prefijo `i18n.locales.<语言>.messages.decoder.`. Todos **string** opcionales con textos integrados/respaldo. Abajo chino simplificado / inglés y ejemplos individuales. Condicionales a herramienta/acción/estado; omitir conserva. Vacío sustituye sin apagar; algunas búsquedas de error recurren además a otros textos.

| Campo         | Predeterminado chino simplificado / inglés                                               | Función y límites                                         | Ejemplo                        |
| ------------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------- | ------------------------------ |
| `input`       | 输入 / Input                                                                             | Etiqueta de entrada y original en historial               | `"原始内容"`                   |
| `placeholder` | 粘贴编码后的文本… / Paste encoded text…                                                  | Placeholder, no rellena contenido                         | `"粘贴需要解码的文本"`         |
| `format`      | 格式 / Format                                                                            | Etiqueta de selector, no añade/quita formatos             | `"编码格式"`                   |
| `auto`        | 自动识别 / Auto detect                                                                   | Texto de opción automática, no algoritmo                  | `"自动判断"`                   |
| `decode`      | 解码 / Decode                                                                            | Texto de envío                                            | `"开始解码"`                   |
| `clear`       | 清空 / Clear                                                                             | Botón que limpia entrada, salida y pasos                  | `"清空内容"`                   |
| `copy`        | 复制结果 / Copy result                                                                   | Copia de resultado; activo si hay algo copiable           | `"复制结果"`                   |
| `reuse`       | 将结果作为输入 / Use result as input                                                     | Reutiliza como entrada, no resultados demasiado largos    | `"继续解码"`                   |
| `supported`   | 支持的解码格式 / Supported formats                                                       | Prefijo de formatos compatibles                           | `"支持格式"`                   |
| `html`        | HTML 实体 / HTML entities                                                                | Nombre HTML entities, no decodificación                   | `"HTML 实体"`                  |
| `unicode`     | Unicode 转义 / Unicode escapes                                                           | Nombre Unicode escapes, no decodificación                 | `"Unicode 转义"`               |
| `jwtWarning`  | 未验证签名，解码内容不代表可信。 / Signature not verified; decoded claims are untrusted. | Advertencia JWT en explicación/éxito; no activa firma     | `"仅解码，不验证签名。"`       |
| `copied`      | 结果已复制。 / Result copied.                                                            | Copia correcta                                            | `"已复制结果"`                 |
| `copyFailed`  | 无法复制，请选中结果手动复制。 / Copy unavailable. Select the result and copy it.        | Fallo de portapapeles, no decodificación                  | `"无法复制，请手动选择文本。"` |
| `output`      | 解码结果 / Decoded text                                                                  | Título/nombre accesible y etiqueta de historial           | `"解码结果"`                   |
| `local`       | 仅在当前浏览器处理，不上传内容。 / Processed in this browser. Nothing is uploaded.       | Nota local, no desactiva toda red del sitio               | `"输入由浏览器本地处理。"`     |
| `ready`       | 准备就绪。 / Ready.                                                                      | Estado inicial/reinicio                                   | `"等待输入"`                   |
| `running`     | 正在解码… / Decoding…                                                                    | Estado procesando/mostrando                               | `"处理中"`                     |
| `done`        | 解码完成 / Decoded                                                                       | Éxito, puede añadir formato/advertencia JWT               | `"完成"`                       |
| `empty`       | 请先输入编码文本。 / Enter encoded text first.                                           | Error vacío                                               | `"请先输入内容。"`             |
| `tooLong`     | 最多输入 16,384 个字符。 / Input limit: 16,384 characters.                               | Error límite, direcciones tienen menor; no cambia límites | `"输入超过限制。"`             |
| `invalid`     | 内容不符合所选编码格式。 / Invalid encoding for the selected format.                     | Datos inválidos y error de respaldo sin coincidencia      | `"无法解析，请检查输入。"`     |
| `binary`      | 解码后的数据不是 UTF-8 文本。 / The decoded data is not UTF-8 text.                      | Aviso de binario/UTF-8 no mostrable de forma segura       | `"结果不是可读文本。"`         |
| `unknown`     | 无法识别编码，请手动选择格式。 / Could not identify the encoding. Choose a format.       | Sin formato autodetectado utilizable                      | `"无法识别，请手动选择格式。"` |
| `ambiguous`   | 存在多种可能的编码，请手动选择格式。 / More than one format matches. Choose a format.    | Varios candidatos automáticos                             | `"存在多种可能，请选择格式。"` |
| `example`     | 示例 / Example                                                                           | Texto del botón ejemplo; implementación da datos          | `"试用示例"`                   |

<a id="page-messages"></a>

## messages.decoderPage: página y tareas independientes

Prefijo `i18n.locales.<语言>.messages.decoderPage.`. Treinta y una **string** opcionales con la misma regla. Tipos/ejemplos strings. Salvo fullTool, que nombra enlace completo About, sirven principalmente a página independiente. Añadir textos no añade tareas completas al embebido.

| Campo           | Predeterminado chino simplificado / inglés                                                                                                                                                                                                                                                                                                                                                                                    | Estado, función y límites                                                                                                                  | Ejemplo                                        |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------- |
| `description`   | 逐步解码文本，在本地解析代币调用并检查地址。 / Decode text in steps, inspect token calls and check addresses locally.                                                                                                                                                                                                                                                                                                         | Condicional: metadescripción, presentación y datos estructurados WebApplication                                                            | `"本地解码文本、解析调用并检查地址。"`         |
| `fullTool`      | 解码实验室 / DECODER LAB                                                                                                                                                                                                                                                                                                                                                                                                      | Condicional: h1, nombre estructurado, nombre accesible de explicación y enlace About. No sustituye Decoder Lab fijo en título de documento | `"我的解码工具"`                               |
| `task`          | 任务 / Task                                                                                                                                                                                                                                                                                                                                                                                                                   | Condicional: nombre accesible del grupo de tres tareas                                                                                     | `"选择任务"`                                   |
| `textTask`      | 文本解码 / Text decoding                                                                                                                                                                                                                                                                                                                                                                                                      | Condicional: pestaña/explicación de texto                                                                                                  | `"文本解码"`                                   |
| `callTask`      | 代币调用 / Token call                                                                                                                                                                                                                                                                                                                                                                                                         | Condicional: pestaña, explicación, formato de historial y parte del título de navegador                                                    | `"代币调用解析"`                               |
| `addressTask`   | 地址检查 / Address inspection                                                                                                                                                                                                                                                                                                                                                                                                 | Condicional: pestaña, explicación y formato de historial de direcciones                                                                    | `"地址格式检查"`                               |
| `addressHint`   | 检查数字货币地址格式：EVM／HyperEVM（0x…）、TRON（T…／41…）、Bitcoin。解析编码、长度及可用的校验和；比特币还检查网络匹配，显示地址类型和 scriptPubKey。不查询余额或交易。 / Check cryptocurrency address format: EVM / HyperEVM (0x…), TRON (T… / 41…), Bitcoin. Inspect encoding, length and available checksums; Bitcoin also shows address type, network compatibility and scriptPubKey. No balance or transaction lookup. | Condicional: explicación de entrada de dirección y parte de descripción accesible                                                          | `"粘贴需要检查的地址。"`                       |
| `chain`         | 体系 / Ecosystem                                                                                                                                                                                                                                                                                                                                                                                                              | Condicional: etiqueta de ecosistema; opciones EVM etc. fijas, no extensibles con texto                                                     | `"地址体系"`                                   |
| `decimals`      | 小数位数 / Decimals                                                                                                                                                                                                                                                                                                                                                                                                           | Condicional: etiqueta de decimales y errores                                                                                               | `"代币小数位数"`                               |
| `precisionHint` | 可选，请填写代币精度；无法从调用数据推断。 / Optional. Enter the token precision; it cannot be inferred from calldata.                                                                                                                                                                                                                                                                                                        | Condicional: ayuda opcional de precisión; no fija valor predeterminado                                                                     | `"如需可读金额，请填写代币精度。"`             |
| `network`       | 比特币网络 / Bitcoin network                                                                                                                                                                                                                                                                                                                                                                                                  | Condicional: etiqueta de red Bitcoin, no opciones                                                                                          | `"Bitcoin 网络"`                               |
| `history`       | 处理步骤 / Processing steps                                                                                                                                                                                                                                                                                                                                                                                                   | Condicional: título/nombre accesible del historial                                                                                         | `"处理历史"`                                   |
| `back`          | 从这一步继续 / Continue from this step                                                                                                                                                                                                                                                                                                                                                                                        | Condicional: continuar desde paso; reutiliza salida y vuelve a texto                                                                       | `"继续处理此结果"`                             |
| `export`        | 导出步骤 / Export steps                                                                                                                                                                                                                                                                                                                                                                                                       | Condicional: exporta JSON, no captura                                                                                                      | `"导出 JSON"`                                  |
| `limits`        | 最多 10 步，输入上限 16,384 字符，不自动请求网络。 / Up to 10 steps. Input: 16,384 characters. No automatic network requests.                                                                                                                                                                                                                                                                                                 | Condicional: explica límites, no los cambia                                                                                                | `"最多 10 步，输入不超过 16,384 字符。"`       |
| `callNotice`    | 按所选 ERC-20／TRC-20 规则解释，未验证合约身份或执行结果；可读金额取决于提供的精度。 / Interpreted using the selected ERC-20/TRC-20 schema. Contract identity and execution are not verified; amounts require supplied decimals.                                                                                                                                                                                              | Condicional: aviso y límites de interpretación de llamadas                                                                                 | `"解析不代表链上验证。"`                       |
| `addressNotice` | 格式检查不代表地址归属、账户存在或可信；EVM／TRON 地址无法标识具体网络。 / Format checks do not prove ownership, account existence or trust. EVM/TRON addresses do not identify a specific network.                                                                                                                                                                                                                           | Condicional: aviso y límites de direcciones                                                                                                | `"格式正确不代表地址可信。"`                   |
| `unsupported`   | 不支持此调用，仅支持 transfer、approve 和 transferFrom。 / Unsupported call. Only transfer, approve and transferFrom are supported.                                                                                                                                                                                                                                                                                           | Condicional: error de ecosistema/método no admitido                                                                                        | `"仅支持 transfer、approve 和 transferFrom。"` |
| `checksum`      | 地址校验和错误。 / Invalid address checksum.                                                                                                                                                                                                                                                                                                                                                                                  | Condicional: error checksum                                                                                                                | `"地址校验和无效。"`                           |
| `length`        | 参数长度不正确。 / Incorrect argument length.                                                                                                                                                                                                                                                                                                                                                                                 | Condicional: longitud de argumentos ABI                                                                                                    | `"调用参数长度不符。"`                         |
| `wrongNetwork`  | 地址与所选比特币网络不匹配。 / Address does not match the selected Bitcoin network.                                                                                                                                                                                                                                                                                                                                           | Condicional: dirección Bitcoin no coincide con red elegida                                                                                 | `"地址与当前 Bitcoin 网络不符。"`              |
| `stepLimit`     | 最多保留 10 步，请清空历史后重新开始。 / Maximum 10 steps. Clear the input history to start again.                                                                                                                                                                                                                                                                                                                            | Condicional: máximo de pasos, no amplía límite                                                                                             | `"步骤已满，请清空后重试。"`                   |
| `budget`        | 历史记录达到内存限制，请清空。 / History memory limit reached. Clear the history.                                                                                                                                                                                                                                                                                                                                             | Condicional: presupuesto de memoria de entrada/salida                                                                                      | `"历史内容过多，请清空。"`                     |
| `addressParse`  | 解析地址编码 / Parse address encoding                                                                                                                                                                                                                                                                                                                                                                                         | Condicional: subpaso de analizar dirección                                                                                                 | `"解析地址"`                                   |
| `addressCheck`  | 检查格式与校验和 / Check format and checksum                                                                                                                                                                                                                                                                                                                                                                                  | Condicional: subpaso de formato/checksum                                                                                                   | `"检查格式"`                                   |
| `addressResult` | 展示地址表示 / Show address representation                                                                                                                                                                                                                                                                                                                                                                                    | Condicional: subpaso de representación en direcciones/llamadas                                                                             | `"展示地址结果"`                               |
| `callParse`     | 解析方法选择器与 ABI 参数 / Parse selector and ABI arguments                                                                                                                                                                                                                                                                                                                                                                  | Condicional: subpaso de selector/argumentos                                                                                                | `"解析调用参数"`                               |
| `rawOnly`       | 保留原始整数，尚未提供精度 / Keep raw integer; decimals not supplied                                                                                                                                                                                                                                                                                                                                                          | Condicional: subpaso sin decimales                                                                                                         | `"保留原始整数"`                               |
| `amountResult`  | 使用提供的精度转换金额 / Format amount using supplied decimals                                                                                                                                                                                                                                                                                                                                                                | Condicional: subpaso tras aplicar precisión                                                                                                | `"按精度显示金额"`                             |
| `inputHint`     | 选择任务并粘贴原始数据后解码；代币调用需要 calldata，不是交易哈希。 / Choose a task, paste the source data, then decode. Token calls require calldata, not a transaction hash.                                                                                                                                                                                                                                                | Condicional: instrucciones de calldata, no hash de transacción                                                                             | `"粘贴 calldata 后解析。"`                     |
| `loadFailed`    | 解码模块加载失败，请刷新页面后重试。 / Decoder module could not load. Refresh the page and try again.                                                                                                                                                                                                                                                                                                                         | Condicional: fallo de módulo dinámico independiente, no error universal de red                                                             | `"解析模块加载失败，请刷新重试。"`             |

El título combina Decoder Lab | Base64 · JWT · con callTask. Sin decoderPage.title separado. fullTool no reemplaza Decoder Lab fijo. Marca, redes y formatos no son todos configurables; texto no añade tareas.

<a id="readings"></a>

## messages.decoderPage.readings: lecturas

Prefijo sigue `i18n.locales.<语言>.messages.decoderPage`. `readings` objeto opcional sin definir en mensajes predeterminados. El componente da texto localizado y 16 tarjetas. Idioma desconocido usa inglés propio del componente, no mismos títulos en todos.

| Campo            | Tipo / predeterminado                                                                        | Estado, función y límites                                                                                                                  | Ejemplo                                                          |
| ---------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| readings.tribute | string opcional / homenaje integrado localizado, chino simplificado e inglés completos abajo | Condicional: homenaje inferior. Vacío oculta párrafo, no tarjetas. Texto plano con términos cypherpunk resaltados automáticamente, no HTML | '感谢这些思想与工具的作者。'                                     |
| readings.links   | DecoderReading[] opcional / lista integrada de 16 abajo                                      | Condicional: sustituye todas en orden, sin concatenar ni límite configurable. [] oculta tarjetas, no homenaje                              | [{ title: '我的文章', href: '/zh/blog/welcome-to-anglefeint/' }] |

Cada readings.links tiene cinco campos. «Ninguno» indica que no se aporta automáticamente a elementos propios, no ausencia en integrados.

| Campo relativo completo | Tipo / predeterminado         | Estado, función y límites                                                                                                      | Ejemplo                           |
| ----------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | --------------------------------- |
| readings.links[].title  | string obligatoria / ninguno  | Condicional: título. Vacío/espacios filtra toda tarjeta. Sin Markdown/HTML                                                     | '我的文章'                        |
| readings.links[].href   | string obligatoria / ninguno  | Condicional: toda tarjeta enlaza; solo HTTP(S):// o / único. Filtra //, mailto, anclas y relativos. No verifica existencia     | '/zh/blog/welcome-to-anglefeint/' |
| readings.links[].author | string opcional / sin definir | Condicional: con año separado por punto medio; vacío oculto sin respaldo site.author                                           | '作者名'                          |
| readings.links[].year   | string opcional / sin definir | Condicional: año/anotación, no fecha ni orden. Usa string, no número                                                           | '2026'                            |
| readings.links[].cover  | string opcional / sin definir | Condicional: identificador integrado, HTTP(S):// o /imagen. Vacío, desconocido o no admitido omite portada sin filtrar tarjeta | 'privacy-code'                    |

Abren pestaña con noopener noreferrer. Rutas raíz reciben BASE_URL: no dupliques prefijo. href/cover propios no se recortan: evita espacios exteriores.

Hay dieciséis identificadores integrados:

```text
privacy-code
cryptographic-autonomy
cyberspace-freedom
virtual-communities
satoshi-freedom
smart-contracts
security-without-identification
b-money
cypherpunk-archive
satoshi-institute
bitcoin
tor-project
signal
telegram
monero
gnupg
```

public/images/decoder/my-cover.webp corresponde a /images/decoder/my-cover.webp, sin public ni src/assets. Portadas recortadas 16:9. Integradas usan tamaños adaptativos; propias/remotas salen como img directamente, sin flujo de variantes de blog. Prepara tamaños adecuados. Fallos no vuelven a integradas automáticamente. Sin portada pueden ser texto.

Ocultar solo lecturas, conservando herramienta:

```ts
i18n: {
  locales: {
    zh: {
      messages: {
        decoderPage: { readings: { tribute: '', links: [] } },
      },
    },
  },
},
```

<a id="reading-defaults"></a>

### Homenaje y tarjetas predeterminados

Homenaje chino simplificado: 谨此致敬密码朋克与数字自由的先行者：他们以思想和代码，推动加密通信、个人隐私与自由，以及数字货币的发展。

Homenaje inglés: In tribute to the cypherpunks and pioneers of digital freedom, whose ideas and code advanced private communication, individual liberty and digital money.

Todas las tarjetas en orden real. Autor/año vacíos significa sin definir. URLs externas integradas incluyen parámetros de origen del paquete: datos que no se añaden a href personalizados.

| Identificador de portada          | Títulos predeterminados chino simplificado / inglés                                             | Autor                 | Año  | href                                                                                                                                                                                                           |
| --------------------------------- | ----------------------------------------------------------------------------------------------- | --------------------- | ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `privacy-code`                    | 密码朋克宣言 / A Cypherpunk’s Manifesto                                                         | Eric Hughes           | 1993 | `https://www.activism.net/cypherpunk/manifesto.html?utm_source=anglefeint&utm_medium=referral&utm_campaign=decoder_lab`                                                                                        |
| `cryptographic-autonomy`          | 加密无政府主义宣言 / The Crypto Anarchist Manifesto                                             | Timothy C. May        | 1988 | `https://www.activism.net/cypherpunk/crypto-anarchy.html?utm_source=anglefeint&utm_medium=referral&utm_campaign=decoder_lab`                                                                                   |
| `cyberspace-freedom`              | 网络空间独立宣言 / A Declaration of the Independence of Cyberspace                              | John Perry Barlow     | 1996 | `https://www.eff.org/cyberspace-independence?utm_source=anglefeint&utm_medium=referral&utm_campaign=decoder_lab`                                                                                               |
| `virtual-communities`             | 加密无政府主义与虚拟社区 / Crypto Anarchy and Virtual Communities                               | Timothy C. May        | 1994 | `https://nakamotoinstitute.org/library/virtual-communities/?utm_source=anglefeint&utm_medium=referral&utm_campaign=decoder_lab`                                                                                |
| `satoshi-freedom`                 | 比特币点对点电子现金论文——关于 P2P 与自由的回复 / Bitcoin P2P e-cash paper — on P2P and freedom | Satoshi Nakamoto      | 2008 | `https://satoshi.nakamotoinstitute.org/emails/cryptography/4/?utm_source=anglefeint&utm_medium=referral&utm_campaign=decoder_lab`                                                                              |
| `smart-contracts`                 | 智能合约：数字市场的基石 / Smart Contracts: Building Blocks for Digital Markets                 | Nick Szabo            | 1996 | `https://www.fon.hum.uva.nl/rob/Courses/InformationInSpeech/CDROM/Literature/LOTwinterschool2006/szabo.best.vwh.net/smart_contracts_2.html?utm_source=anglefeint&utm_medium=referral&utm_campaign=decoder_lab` |
| `security-without-identification` | 不依赖身份识别的安全 / Security without Identification                                          | David Chaum           | 1985 | `https://chaum.com/security-without-identification/?utm_source=anglefeint&utm_medium=referral&utm_campaign=decoder_lab`                                                                                        |
| `b-money`                         | b-money / b-money                                                                               | Wei Dai               | 1998 | `https://nakamotoinstitute.org/library/b-money/?utm_source=anglefeint&utm_medium=referral&utm_campaign=decoder_lab`                                                                                            |
| `cypherpunk-archive`              | cryptoanarchy.wiki / cryptoanarchy.wiki                                                         | cryptoanarchy.wiki    |      | `https://cryptoanarchy.wiki/?utm_source=anglefeint&utm_medium=referral&utm_campaign=decoder_lab`                                                                                                               |
| `satoshi-institute`               | 中本聪研究所 / Satoshi Nakamoto Institute                                                       | nakamotoinstitute.org |      | `https://nakamotoinstitute.org/?utm_source=anglefeint&utm_medium=referral&utm_campaign=decoder_lab`                                                                                                            |
| `bitcoin`                         | Bitcoin / Bitcoin                                                                               | bitcoin.org           |      | `https://bitcoin.org/?utm_source=anglefeint&utm_medium=referral&utm_campaign=decoder_lab`                                                                                                                      |
| `tor-project`                     | Tor Project / Tor Project                                                                       | torproject.org        |      | `https://www.torproject.org/?utm_source=anglefeint&utm_medium=referral&utm_campaign=decoder_lab`                                                                                                               |
| `signal`                          | Signal / Signal                                                                                 | signal.org            |      | `https://signal.org/?utm_source=anglefeint&utm_medium=referral&utm_campaign=decoder_lab`                                                                                                                       |
| `telegram`                        | Telegram / Telegram                                                                             | telegram.org          |      | `https://telegram.org/?utm_source=anglefeint&utm_medium=referral&utm_campaign=decoder_lab`                                                                                                                     |
| `monero`                          | Monero / Monero                                                                                 | getmonero.org         |      | `https://www.getmonero.org/?utm_source=anglefeint&utm_medium=referral&utm_campaign=decoder_lab`                                                                                                                |
| `gnupg`                           | GnuPG / GnuPG                                                                                   | gnupg.org             |      | `https://gnupg.org/?utm_source=anglefeint&utm_medium=referral&utm_campaign=decoder_lab`                                                                                                                        |

<a id="example"></a>

## Ejemplo para combinar

Usa `defineThemeConfig({...})` existente de `src/site.config.ts`; conserva imports, exports y ajustes sin duplicar theme/i18n. Solo sustituye chino. Otros mantienen su config/respaldo; consulta [idiomas](/es/blog/starter-guide-languages/).

```ts
theme: { enableDecoderPage: true },
i18n: {
  locales: {
    zh: {
      messages: {
        decoder: {
          input: '原始内容',
          decode: '开始解码',
        },
        decoderPage: {
          fullTool: '我的解码工具',
          description: '本地解码文本、解析调用并检查地址。',
          readings: {
            tribute: '延伸阅读',
            links: [
              {
                title: '欢迎来到我的博客',
                href: '/zh/blog/welcome-to-anglefeint/',
                author: '作者名',
                year: '2026',
                cover: 'privacy-code',
              },
            ],
          },
        },
      },
    },
  },
},
```

<a id="fixed-behavior"></a>

## Capacidades y límites fuera de site.config

- **Texto:** Base64 / Base64URL, URL, Hex, entidades HTML, escapes Unicode y JWT fijos. Auto acepta exactamente un candidato correcto; varios requieren selección. Cada envío decodifica una capa, sin recursión automática. JWT se analiza sin verificar firma. Salida texto, nunca ejecuta HTML/scripts decodificados.
- **Entrada/historial:** máximo 16.384 unidades UTF-16 JavaScript; direcciones 128 adicionalmente. Historial independiente hasta 10 pasos y 262.144 unidades acumuladas. Continuar/reutilizar encadena; envío nuevo normal limpia cadena anterior. Exporta decoder-results.json. Memoria no es «imagen de 262 KB». limits, tooLong y stepLimit no cambian límites.
- **Llamadas/direcciones:** transfer, approve y transferFrom en EVM / HyperEVM / TRON. No llamadas de tokens Bitcoin. Decimals del usuario vacío por defecto conserva enteros; acepta strings enteras canónicas 0–255. Config no predefine precisión. Comprueba formatos/checksums implementados EVM / HyperEVM, TRON y Bitcoin. No prueba propiedad, saldo ni confianza.
- **Red/privacidad:** decodificar no hace RPC ni sube entrada. Módulos, estilos, imágenes y estadísticas sí pueden usar red. «Local» no hace offline toda página. Copia depende de portapapeles; exportaciones contienen originales y salidas actuales.
- **Interfaz:** inicia texto/autodetección, ecosistema EVM y Bitcoin Mainnet. Sin defaultTask, defaultFormat, maxSteps, RPC, lista de cadenas, ejemplos ni control de fondo públicos. Movimiento reducido sigue sistema.

Todos los campos Decoder tienen consumidores, sin compatibilidad extra. Antiguos About sin uso indicados arriba. Textos cambian presentación, no algoritmos. Vuelve al [índice](/es/blog/config-reference/).
