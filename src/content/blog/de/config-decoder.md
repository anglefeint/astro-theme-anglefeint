---
tags: ['anglefeint', 'config']
title: 'Konfigurationsverzeichnis: Decoder'
subtitle: 'Seitenschalter, Text- und Aufgabentexte sowie weiterführende Lesekarten.'
description: 'Alle Decoder-Felder mit Typen, Vorgaben, vollständigen Standardkarten und Grenzen lokaler Verarbeitung.'
pubDate: '2026-11-13'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/hacker-01.webp'
---

Den Konfigurationsort erklärt [Installation](/de/blog/starter-guide-1-configure-your-site/), Seitenschalter [Seiten und Funktionen anpassen](/de/blog/starter-guide-3-comments-about-and-theme-toggles/). Hier schlägst du Felder nach; andere Module im [Gesamtverzeichnis](/de/blog/config-reference/).

„Lesekarten“ sind weiterführende Links unten im Decoder, keine Blog-List-Karten und nicht automatisch aus Artikeln erzeugt. Vorgaben stammen aus dem Paket, nicht der Demo.

<a id="page-enabled"></a>

## theme.enableDecoderPage: eigenständige Seite

- **Typ / Standard:** boolean / true.
- **Wirkung und Status:** wirksam. Erzeugt `/<语言>/decoder/` für aktive Sprachen. Öffentliche Navigation und About-Link zum vollständigen Tool folgen dem Schalter.
- **Grenzen:** Deaktiviert nicht den eingebetteten About-Textdecoder. About hat theme.enableAboutPage. Löscht keine öffentlichen Inhalte oder garantiert alte Deployment-Bereinigung. Änderungen brauchen Build und Deployment.
- **Beispiel:** `theme: { enableDecoderPage: false }`.

| Funktion                        | Eigene Decoder-Seite      | Eingebettet in About                             |
| ------------------------------- | ------------------------- | ------------------------------------------------ |
| Textdekodierung                 | Ja                        | Ja                                               |
| Token call / Adressprüfung      | Ja                        | Nein                                             |
| Mehrschrittverlauf, JSON-Export | Ja                        | Nein                                             |
| Lesekarten und Würdigung        | Ja                        | Nein                                             |
| Gemeinsame Werkzeugtexte        | messages.decoder          | messages.decoder                                 |
| Titel und Einstiege             | messages.decoderPage usw. | About sidebar.decryptor / modals.decryptor.title |

Alte About-header, keysLabel, currentPassphraseLabel, masterKeyLabel und transientKeyLabel bleiben typakzeptiert, werden aber nicht gelesen, siehe [About-Werkzeugfelder](/de/blog/config-about/#modal-fields). Änderungen wirken hier nicht.

<a id="text-messages"></a>

## messages.decoder: gemeinsame Textwerkzeuge

Präfix `i18n.locales.<语言>.messages.decoder.`. Alle optionale **string**, Standard aus integrierter aktueller Sprache und Fallback. Tabelle zeigt vereinfachtes Chinesisch/Englisch und Feldwerte als Beispiele. Alle bedingt beim jeweiligen Werkzeug, Zustand oder Vorgang; ohne Eingabe gelten Vorgaben. Leer überschreibt, verbirgt keine Steuerung. Einige Fehlerzweige fallen zusätzlich auf andere Hinweise zurück.

| Feld          | Standard vereinfachtes Chinesisch / Englisch                                             | Wirkung und Grenzen                                                             | Beispiel                       |
| ------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------ |
| `input`       | 输入 / Input                                                                             | Eingabelabel und ursprüngliche Eingabe im Verlauf                               | `"原始内容"`                   |
| `placeholder` | 粘贴编码后的文本… / Paste encoded text…                                                  | Placeholder ohne vorbelegten Inhalt                                             | `"粘贴需要解码的文本"`         |
| `format`      | 格式 / Format                                                                            | Formatwahl-Label, erweitert oder entfernt keine Formate                         | `"编码格式"`                   |
| `auto`        | 自动识别 / Auto detect                                                                   | Autodetect-Option ohne Algorithmusänderung                                      | `"自动判断"`                   |
| `decode`      | 解码 / Decode                                                                            | Dekodierknopftext                                                               | `"开始解码"`                   |
| `clear`       | 清空 / Clear                                                                             | Leeren von aktueller Eingabe, Ausgabe und Schritten                             | `"清空内容"`                   |
| `copy`        | 复制结果 / Copy result                                                                   | Kopierknopf, nur bei kopierbarem Ergebnis aktiv                                 | `"复制结果"`                   |
| `reuse`       | 将结果作为输入 / Use result as input                                                     | Ergebnis als Eingabe; zu lange Ergebnisse lassen sich nicht zurückfüllen        | `"继续解码"`                   |
| `supported`   | 支持的解码格式 / Supported formats                                                       | Präfix der unterstützten Formate                                                | `"支持格式"`                   |
| `html`        | HTML 实体 / HTML entities                                                                | Name für HTML-Entities, keine Regeländerung                                     | `"HTML 实体"`                  |
| `unicode`     | Unicode 转义 / Unicode escapes                                                           | Name für Unicode-Escapes, keine Regeländerung                                   | `"Unicode 转义"`               |
| `jwtWarning`  | 未验证签名，解码内容不代表可信。 / Signature not verified; decoded claims are untrusted. | JWT-Warnung in eigener Seite und Erfolgsstatus, aktiviert keine Signaturprüfung | `"仅解码，不验证签名。"`       |
| `copied`      | 结果已复制。 / Result copied.                                                            | Erfolgreiches Zwischenablagekopieren                                            | `"已复制结果"`                 |
| `copyFailed`  | 无法复制，请选中结果手动复制。 / Copy unavailable. Select the result and copy it.        | Kopierfehler, kein Dekodierfehler                                               | `"无法复制，请手动选择文本。"` |
| `output`      | 解码结果 / Decoded text                                                                  | Ausgabetitel/-name und Verlaufs-Ausgabelabel                                    | `"解码结果"`                   |
| `local`       | 仅在当前浏览器处理，不上传内容。 / Processed in this browser. Nothing is uploaded.       | Lokale Verarbeitung unten, kein globaler Netzwerkschalter                       | `"输入由浏览器本地处理。"`     |
| `ready`       | 准备就绪。 / Ready.                                                                      | Anfangs-/Resetbereitschaft                                                      | `"等待输入"`                   |
| `running`     | 正在解码… / Decoding…                                                                    | Verarbeitung und Anzeige                                                        | `"处理中"`                     |
| `done`        | 解码完成 / Decoded                                                                       | Erfolg mit möglichem Formatnamen/JWT-Hinweis                                    | `"完成"`                       |
| `empty`       | 请先输入编码文本。 / Enter encoded text first.                                           | Leere Eingabe                                                                   | `"请先输入内容。"`             |
| `tooLong`     | 最多输入 16,384 个字符。 / Input limit: 16,384 characters.                               | Eingabelimitfehler. Adressaufgabe hat kleineres Limit; Text ändert es nicht     | `"输入超过限制。"`             |
| `invalid`     | 内容不符合所选编码格式。 / Invalid encoding for the selected format.                     | Ungültige Daten und Fallback anderer nicht zugeordneter Fehler                  | `"无法解析，请检查输入。"`     |
| `binary`      | 解码后的数据不是 UTF-8 文本。 / The decoded data is not UTF-8 text.                      | Binärdaten oder nicht sicher als UTF-8 darstellbare Ergebnisse                  | `"结果不是可读文本。"`         |
| `unknown`     | 无法识别编码，请手动选择格式。 / Could not identify the encoding. Choose a format.       | Kein geeigneter Autodetect-Kandidat                                             | `"无法识别，请手动选择格式。"` |
| `ambiguous`   | 存在多种可能的编码，请手动选择格式。 / More than one format matches. Choose a format.    | Mehrere Autodetect-Kandidaten                                                   | `"存在多种可能，请选择格式。"` |
| `example`     | 示例 / Example                                                                           | Beispielknopftext, ersetzt keine eingebauten Beispiele                          | `"试用示例"`                   |

<a id="page-messages"></a>

## messages.decoderPage: Seite und Aufgaben

Präfix `i18n.locales.<语言>.messages.decoderPage.`. Einunddreißig optionale **string** mit denselben Standardregeln und String-Beispielen. Hauptsächlich eigene Seite, zusätzlich fullTool im About-Link. Texte schaffen keine fehlenden Aufgaben des eingebetteten Werkzeugs.

| Feld            | Standard vereinfachtes Chinesisch / Englisch                                                                                                                                                                                                                                                                                                                                                                                  | Status, Wirkung und Grenzen                                                                                                          | Beispiel                                       |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------- |
| `description`   | 逐步解码文本，在本地解析代币调用并检查地址。 / Decode text in steps, inspect token calls and check addresses locally.                                                                                                                                                                                                                                                                                                         | Bedingt: Metabeschreibung, Einführung und WebApplication-Daten                                                                       | `"本地解码文本、解析调用并检查地址。"`         |
| `fullTool`      | 解码实验室 / DECODER LAB                                                                                                                                                                                                                                                                                                                                                                                                      | Bedingt: h1, strukturierter Name, zugänglicher Infobereich und About-Volltoollink. Ersetzt nicht festes Decoder Lab im Dokumenttitel | `"我的解码工具"`                               |
| `task`          | 任务 / Task                                                                                                                                                                                                                                                                                                                                                                                                                   | Bedingt: zugänglicher Name der drei Aufgaben-Tabs                                                                                    | `"选择任务"`                                   |
| `textTask`      | 文本解码 / Text decoding                                                                                                                                                                                                                                                                                                                                                                                                      | Bedingt: Text-Tab und Erklärungsüberschrift                                                                                          | `"文本解码"`                                   |
| `callTask`      | 代币调用 / Token call                                                                                                                                                                                                                                                                                                                                                                                                         | Bedingt: Token-Tab, Erklärung, Verlaufsformat und Teil des Browsertitels                                                             | `"代币调用解析"`                               |
| `addressTask`   | 地址检查 / Address inspection                                                                                                                                                                                                                                                                                                                                                                                                 | Bedingt: Adress-Tab, Erklärung und Verlaufsformat                                                                                    | `"地址格式检查"`                               |
| `addressHint`   | 检查数字货币地址格式：EVM／HyperEVM（0x…）、TRON（T…／41…）、Bitcoin。解析编码、长度及可用的校验和；比特币还检查网络匹配，显示地址类型和 scriptPubKey。不查询余额或交易。 / Check cryptocurrency address format: EVM / HyperEVM (0x…), TRON (T… / 41…), Bitcoin. Inspect encoding, length and available checksums; Bitcoin also shows address type, network compatibility and scriptPubKey. No balance or transaction lookup. | Bedingt: Eingabehilfe im Adressmodus und Teil zugänglicher Beschreibung                                                              | `"粘贴需要检查的地址。"`                       |
| `chain`         | 体系 / Ecosystem                                                                                                                                                                                                                                                                                                                                                                                                              | Bedingt: Ökosystemwahl-Label; EVM und andere Optionen bleiben fest                                                                   | `"地址体系"`                                   |
| `decimals`      | 小数位数 / Decimals                                                                                                                                                                                                                                                                                                                                                                                                           | Bedingt: Präzisionseingabelabel, auch Hinweis bei decimals-Fehler                                                                    | `"代币小数位数"`                               |
| `precisionHint` | 可选，请填写代币精度；无法从调用数据推断。 / Optional. Enter the token precision; it cannot be inferred from calldata.                                                                                                                                                                                                                                                                                                        | Bedingt: optionale Präzisionshilfe, kein Standardwert                                                                                | `"如需可读金额，请填写代币精度。"`             |
| `network`       | 比特币网络 / Bitcoin network                                                                                                                                                                                                                                                                                                                                                                                                  | Bedingt: Bitcoin-Netzwerkauswahlname, keine Optionsänderung                                                                          | `"Bitcoin 网络"`                               |
| `history`       | 处理步骤 / Processing steps                                                                                                                                                                                                                                                                                                                                                                                                   | Bedingt: Verlaufstitel und zugänglicher Name                                                                                         | `"处理历史"`                                   |
| `back`          | 从这一步继续 / Continue from this step                                                                                                                                                                                                                                                                                                                                                                                        | Bedingt: setzt historische Ausgabe als Eingabe und wechselt zum Textmodus                                                            | `"继续处理此结果"`                             |
| `export`        | 导出步骤 / Export steps                                                                                                                                                                                                                                                                                                                                                                                                       | Bedingt: Schritte als JSON exportieren, kein Screenshot                                                                              | `"导出 JSON"`                                  |
| `limits`        | 最多 10 步，输入上限 16,384 字符，不自动请求网络。 / Up to 10 steps. Input: 16,384 characters. No automatic network requests.                                                                                                                                                                                                                                                                                                 | Bedingt: Grenzhinweis, keine tatsächliche Limitänderung                                                                              | `"最多 10 步，输入不超过 16,384 字符。"`       |
| `callNotice`    | 按所选 ERC-20／TRC-20 规则解释，未验证合约身份或执行结果；可读金额取决于提供的精度。 / Interpreted using the selected ERC-20/TRC-20 schema. Contract identity and execution are not verified; amounts require supplied decimals.                                                                                                                                                                                              | Bedingt: Aufrufmodus-Hinweis und Erklärung seiner Grenzen                                                                            | `"解析不代表链上验证。"`                       |
| `addressNotice` | 格式检查不代表地址归属、账户存在或可信；EVM／TRON 地址无法标识具体网络。 / Format checks do not prove ownership, account existence or trust. EVM/TRON addresses do not identify a specific network.                                                                                                                                                                                                                           | Bedingt: Adressmodus-/Erklärungshinweis seiner Grenzen                                                                               | `"格式正确不代表地址可信。"`                   |
| `unsupported`   | 不支持此调用，仅支持 transfer、approve 和 transferFrom。 / Unsupported call. Only transfer, approve and transferFrom are supported.                                                                                                                                                                                                                                                                                           | Bedingt: nicht unterstützte Aufgabenökosysteme/Methoden                                                                              | `"仅支持 transfer、approve 和 transferFrom。"` |
| `checksum`      | 地址校验和错误。 / Invalid address checksum.                                                                                                                                                                                                                                                                                                                                                                                  | Bedingt: Prüfsummenfehler                                                                                                            | `"地址校验和无效。"`                           |
| `length`        | 参数长度不正确。 / Incorrect argument length.                                                                                                                                                                                                                                                                                                                                                                                 | Bedingt: falsche ABI-Argumentlänge                                                                                                   | `"调用参数长度不符。"`                         |
| `wrongNetwork`  | 地址与所选比特币网络不匹配。 / Address does not match the selected Bitcoin network.                                                                                                                                                                                                                                                                                                                                           | Bedingt: Bitcoin-Adresse passt nicht zum gewählten Netzwerk                                                                          | `"地址与当前 Bitcoin 网络不符。"`              |
| `stepLimit`     | 最多保留 10 步，请清空历史后重新开始。 / Maximum 10 steps. Clear the input history to start again.                                                                                                                                                                                                                                                                                                                            | Bedingt: Schrittlimitfehler, Text erhöht kein Limit                                                                                  | `"步骤已满，请清空后重试。"`                   |
| `budget`        | 历史记录达到内存限制，请清空。 / History memory limit reached. Clear the history.                                                                                                                                                                                                                                                                                                                                             | Bedingt: Verlaufs-Ein-/Ausgabe überschreitet Speicherbudget                                                                          | `"历史内容过多，请清空。"`                     |
| `addressParse`  | 解析地址编码 / Parse address encoding                                                                                                                                                                                                                                                                                                                                                                                         | Bedingt: Adress-Verlaufsunterpunkt Kodierung                                                                                         | `"解析地址"`                                   |
| `addressCheck`  | 检查格式与校验和 / Check format and checksum                                                                                                                                                                                                                                                                                                                                                                                  | Bedingt: Adress-Verlaufsunterpunkt Format und Prüfsumme                                                                              | `"检查格式"`                                   |
| `addressResult` | 展示地址表示 / Show address representation                                                                                                                                                                                                                                                                                                                                                                                    | Bedingt: Adress-/Aufrufunterpunkt Darstellung                                                                                        | `"展示地址结果"`                               |
| `callParse`     | 解析方法选择器与 ABI 参数 / Parse selector and ABI arguments                                                                                                                                                                                                                                                                                                                                                                  | Bedingt: Aufrufunterpunkt Selektor und ABI                                                                                           | `"解析调用参数"`                               |
| `rawOnly`       | 保留原始整数，尚未提供精度 / Keep raw integer; decimals not supplied                                                                                                                                                                                                                                                                                                                                                          | Bedingt: Aufrufunterpunkt ohne Präzision                                                                                             | `"保留原始整数"`                               |
| `amountResult`  | 使用提供的精度转换金额 / Format amount using supplied decimals                                                                                                                                                                                                                                                                                                                                                                | Bedingt: Aufrufunterpunkt mit Präzision                                                                                              | `"按精度显示金额"`                             |
| `inputHint`     | 选择任务并粘贴原始数据后解码；代币调用需要 calldata，不是交易哈希。 / Choose a task, paste the source data, then decode. Token calls require calldata, not a transaction hash.                                                                                                                                                                                                                                                | Bedingt: Aufruferklärung braucht calldata, keinen Transaktionshash                                                                   | `"粘贴 calldata 后解析。"`                     |
| `loadFailed`    | 解码模块加载失败，请刷新页面后重试。 / Decoder module could not load. Refresh the page and try again.                                                                                                                                                                                                                                                                                                                         | Bedingt: dynamisches Kryptomodul der eigenen Seite konnte nicht laden, kein globaler Netzwerkfehler                                  | `"解析模块加载失败，请刷新重试。"`             |

Der Dokumenttitel ist derzeit Decoder Lab | Base64 · JWT · plus callTask. Kein separates decoderPage.title. fullTool ersetzt nicht festes Decoder Lab. Nicht alle Marken-, Netzwerk- oder Formatnamen sind konfigurierbar. Textänderungen fügen keine Aufgaben hinzu.

<a id="readings"></a>

## messages.decoderPage.readings: Lesebereich

Weiterhin Präfix `i18n.locales.<语言>.messages.decoderPage`. readings ist ein optionales Objekt, in Sprachtext-Vorgaben nicht gesetzt. Die Lesekomponente liefert pro Sprache eigene Texte und 16 Karten. Unbekannte Sprachen nutzen englische Inhalte. Das ist der Komponentenstandard, nicht überall derselbe Titel.

| Feld             | Typ / Standard                                                            | Status, Wirkung und Grenzen                                                                                                          | Beispiel                                                         |
| ---------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| readings.tribute | string, optional / integrierte Sprachwürdigung, Chinesisch/Englisch unten | Bedingt: Würdigung unten. Leer verbirgt Absatz, nicht Karten. Klartext, einige Cypherpunk-Wörter automatisch fett, kein eigenes HTML | '感谢这些思想与工具的作者。'                                     |
| readings.links   | DecoderReading[], optional / 16 integrierte Einträge unten                | Bedingt: ersetzt alle Karten in Array-Reihenfolge ohne Anhängen oder öffentliche Höchstzahl. [] verbirgt Karten, nicht Würdigung     | [{ title: '我的文章', href: '/zh/blog/welcome-to-anglefeint/' }] |

Jeder links-Eintrag hat fünf Felder. „Keiner“ bedeutet keinen automatischen Wert eigener Einträge, nicht fehlende Angaben integrierter Karten.

| Vollständiger relativer Feldpfad | Typ / Standard                   | Status, Wirkung und Grenzen                                                                                                                                                        | Beispiel                          |
| -------------------------------- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| readings.links[].title           | string, Pflicht / keiner         | Bedingt: Kartentitel, leer/Leerraum filtert ganze Karte. Kein Markdown/HTML                                                                                                        | '我的文章'                        |
| readings.links[].href            | string, Pflicht / keiner         | Bedingt: ganze Karte verlinkt. Nur HTTP(S):// oder einzelnes /. Protokollrelative //, mailto, Anker und normale relative Pfade entfallen. Nur Präfixprüfung, keine Existenzprüfung | '/zh/blog/welcome-to-anglefeint/' |
| readings.links[].author          | string, optional / nicht gesetzt | Bedingt: mit Jahr durch Mittelpunkt verbunden. Leer verborgen, kein site.author-Fallback                                                                                           | '作者名'                          |
| readings.links[].year            | string, optional / nicht gesetzt | Bedingt: Jahr oder Hinweis als String, keine Datumsauswertung/Sortierung. Keine Zahl eintragen                                                                                     | '2026'                            |
| readings.links[].cover           | string, optional / nicht gesetzt | Bedingt: integrierter Covername, HTTP(S):// oder einzelner /-Bildpfad. Leer, unbekannt oder unzulässig ohne Cover, Karte bleibt                                                    | 'privacy-code'                    |

Karten öffnen neue Tabs mit noopener noreferrer. Interne Wurzelpfade erhalten Astro BASE_URL; füge denselben Präfix nicht doppelt hinzu. href und eigene cover werden nicht automatisch getrimmt; keine Rand-Leerzeichen.

Sechzehn integrierte Coverkennungen:

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

public/images/decoder/my-cover.webp entspricht /images/decoder/my-cover.webp, ohne public-Präfix oder src/assets-Quellpfad. Cover erscheinen im beschnittenen 16:9-Bereich. Integrierte Bilder haben responsive Größen; eigene Pfade/externe Bilder sind direkte img und gehören nicht automatisch zur Blogcover-Pipeline. Bereite passende Größen selbst vor. Ladefehler wechseln nicht auf integrierte Bilder. Ohne Cover bleibt eine Textkarte.

Nur Lesebereich verbergen, Tool behalten:

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

### Standardwürdigung und Karten

Standard vereinfachtes Chinesisch: 谨此致敬密码朋克与数字自由的先行者：他们以思想和代码，推动加密通信、个人隐私与自由，以及数字货币的发展。

Standard Englisch: In tribute to the cypherpunks and pioneers of digital freedom, whose ideas and code advanced private communication, individual liberty and digital money.

Alle Standardkarten in tatsächlicher Reihenfolge; leere Autor-/Jahreswerte sind nicht gesetzt. Externe Standardlinks enthalten mitgelieferte Herkunftsparameter. Diese werden eigenen href nicht automatisch hinzugefügt.

| Coverkennung                      | Standardtitel vereinfachtes Chinesisch / Englisch                                               | Autor                 | Jahr | href                                                                                                                                                                                                           |
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

## Beispiel zum Vereinigen

Vereinige mit bestehendem `defineThemeConfig({...})` in `src/site.config.ts`. Erhalte import, export und persönliche Werte ohne doppeltes theme/i18n. Das Beispiel ändert nur Chinesisch; andere Sprachen folgen eigenen Werten und Fallbacks, siehe [Sprachentutorial](/de/blog/starter-guide-languages/).

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

## Fähigkeiten und Grenzen ohne site.config-Felder

- **Text:** Fest Base64/Base64URL, URL, Hex, HTML-Entities, Unicode-Escapes und JWT. Auto akzeptiert genau einen erfolgreichen Kandidaten, mehrere erfordern manuelle Auswahl. Ein Submit verarbeitet eine Ebene statt automatischer Schleife. JWT wird gelesen, nicht signaturgeprüft. Ausgabe bleibt Text, ohne HTML/Skriptausführung.
- **Eingabe und Verlauf:** Höchstens 16.384 JavaScript-UTF-16-Codeeinheiten, bei Adressen 128. Eigene Seite höchstens zehn Schritte und kumuliert 262.144 Codeeinheiten Ein-/Ausgaben. Fortsetzen oder Wiederverwenden bildet eine Kette, gewöhnlicher neuer Submit leert die alte. Export heißt decoder-results.json. Speicherbudget bedeutet nicht „262 KB Bildgröße“. limits/tooLong/stepLimit ändern keine Grenzen.
- **Aufrufe und Adressen:** transfer, approve und transferFrom für EVM/HyperEVM/TRON, keine Bitcoin-Tokenaufrufe. Präzision vom Leser, zunächst leer mit Rohintegern. Erlaubt sind kanonische Ganzzahlstrings 0–255, kein Konfigurationsstandard. Adressen unterstützen implementierte Formate/Prüfungen von EVM/HyperEVM, TRON und Bitcoin, beweisen weder Eigentum, Guthaben noch Vertrauen.
- **Netzwerk und Privatsphäre:** Dekodierung lädt kein RPC und keine Eingaben hoch. Module, CSS, Bilder und Website-Statistik können trotzdem Netzwerk brauchen. Lokal bedeutet keine komplette Offline-Seite. Kopieren braucht Browser-Zwischenablage, Export enthält ursprüngliche Ein-/Ausgaben der aktuellen Schritte.
- **UI-Vorgaben:** Textaufgabe und Autoformat, EVM, Bitcoin Mainnet. Keine defaultTask, defaultFormat, maxSteps, RPC-URL, Chainliste, Beispielliste oder Hintergrundschalter. Reduzierte Bewegung folgt Systemeinstellung.

Alle hier beschriebenen Decoder-Felder haben Verbraucher. Keine zusätzlichen Kompatibilitätsfelder nötig. Alte ungenutzte About-Texte sind gesondert benannt. Texte sind keine Algorithmusparameter. Weitere Module im [Gesamtverzeichnis](/de/blog/config-reference/).
