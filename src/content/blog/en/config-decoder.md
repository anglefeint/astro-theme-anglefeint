---
tags: ['anglefeint', 'config']
title: 'Configuration Reference: Decoder'
subtitle: 'Standalone and embedded tools, localized messages, reading cards and fixed processing limits.'
description: 'Decoder settings and exact defaults, including all tool messages, custom reading cards, unused About labels and algorithm boundaries.'
pubDate: '2026-11-13'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/hacker-01.webp'
---

For the config location, see [Installation and site identity](/en/blog/starter-guide-1-configure-your-site/). For page switches, see [Customize pages and features](/en/blog/starter-guide-3-comments-about-and-theme-toggles/). This page is a field reference; other modules are in the [configuration index](/en/blog/config-reference/).

“Reading cards” here means further-reading links at the bottom of Decoder, not Blog List article cards. They are not automatically generated from blog articles. Defaults come from the current package, not demo overrides.

<a id="page-enabled"></a>

## theme.enableDecoderPage: standalone-page switch

- **Type / default:** boolean / true.
- **Purpose and status:** Active. Generates `/<语言>/decoder/` for enabled languages and controls full-tool navigation from the public header and About dialog.
- **Limits:** Disabling the standalone page does not disable the embedded About text decoder. theme.enableAboutPage controls About itself. It neither deletes published content nor guarantees cleanup of old deployment files. Rebuild and redeploy after changes.
- **Example:** `theme: { enableDecoderPage: false }`.

| Feature                          | Standalone Decoder         | Embedded About decoder                           |
| -------------------------------- | -------------------------- | ------------------------------------------------ |
| Text-format decoding             | Yes                        | Yes                                              |
| Token call / address checks      | Yes                        | No                                               |
| Multi-step history / JSON export | Yes                        | No                                               |
| Reading cards / tribute          | Yes                        | No                                               |
| Shared internal tool text        | messages.decoder           | messages.decoder                                 |
| Title and entry text             | messages.decoderPage, etc. | About sidebar.decryptor / modals.decryptor.title |

About's old header, keysLabel, currentPassphraseLabel, masterKeyLabel and transientKeyLabel remain type-accepted but are not read by the current Decoder. See [About tool fields](/en/blog/config-about/#modal-fields). They do not change this page.

<a id="text-messages"></a>

## messages.decoder: shared text-tool messages

Full prefix: `i18n.locales.<语言>.messages.decoder.`. Every field is an optional **string**, resolved through built-in locale text and fallback. Simplified Chinese / English defaults and individual example values are below. All are conditional on a tool/action/state appearing; omission retains defaults. Empty strings override text without disabling controls; some error-lookup branches additionally fall back to other messages.

| Field         | Simplified Chinese / English defaults                                                    | Purpose and limits                                                                               | Example value                  |
| ------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------ |
| `input`       | 输入 / Input                                                                             | Input-area label and original-input label in history.                                            | `"原始内容"`                   |
| `placeholder` | 粘贴编码后的文本… / Paste encoded text…                                                  | Input placeholder; does not prefill content.                                                     | `"粘贴需要解码的文本"`         |
| `format`      | 格式 / Format                                                                            | Format-selector label; does not add/remove formats.                                              | `"编码格式"`                   |
| `auto`        | 自动识别 / Auto detect                                                                   | Automatic-format option text; does not change detection.                                         | `"自动判断"`                   |
| `decode`      | 解码 / Decode                                                                            | Decode submit-button text.                                                                       | `"开始解码"`                   |
| `clear`       | 清空 / Clear                                                                             | Clear button; clears current input, output and steps.                                            | `"清空内容"`                   |
| `copy`        | 复制结果 / Copy result                                                                   | Copy-result text; enabled when a copyable result exists.                                         | `"复制结果"`                   |
| `reuse`       | 将结果作为输入 / Use result as input                                                     | Reuse-result input button; overly long results cannot be reused.                                 | `"继续解码"`                   |
| `supported`   | 支持的解码格式 / Supported formats                                                       | Supported-format description prefix.                                                             | `"支持格式"`                   |
| `html`        | HTML 实体 / HTML entities                                                                | HTML entity format name, without changing decoding.                                              | `"HTML 实体"`                  |
| `unicode`     | Unicode 转义 / Unicode escapes                                                           | Unicode escape format name, without changing decoding.                                           | `"Unicode 转义"`               |
| `jwtWarning`  | 未验证签名，解码内容不代表可信。 / Signature not verified; decoded claims are untrusted. | JWT warning in standalone explanation/success states. Text cannot enable signature verification. | `"仅解码，不验证签名。"`       |
| `copied`      | 结果已复制。 / Result copied.                                                            | Successful clipboard copy status.                                                                | `"已复制结果"`                 |
| `copyFailed`  | 无法复制，请选中结果手动复制。 / Copy unavailable. Select the result and copy it.        | Clipboard copy failure, not decoding failure.                                                    | `"无法复制，请手动选择文本。"` |
| `output`      | 解码结果 / Decoded text                                                                  | Result heading, accessible name and history output label.                                        | `"解码结果"`                   |
| `local`       | 仅在当前浏览器处理，不上传内容。 / Processed in this browser. Nothing is uploaded.       | Local-processing note; does not disable all site networking.                                     | `"输入由浏览器本地处理。"`     |
| `ready`       | 准备就绪。 / Ready.                                                                      | Initial/reset ready state.                                                                       | `"等待输入"`                   |
| `running`     | 正在解码… / Decoding…                                                                    | Processing/display state.                                                                        | `"处理中"`                     |
| `done`        | 解码完成 / Decoded                                                                       | Success state, possibly followed by format name and JWT warning.                                 | `"完成"`                       |
| `empty`       | 请先输入编码文本。 / Enter encoded text first.                                           | Empty-input error.                                                                               | `"请先输入内容。"`             |
| `tooLong`     | 最多输入 16,384 个字符。 / Input limit: 16,384 characters.                               | Input-limit error; address tasks have a smaller limit. Text does not change limits.              | `"输入超过限制。"`             |
| `invalid`     | 内容不符合所选编码格式。 / Invalid encoding for the selected format.                     | Invalid-data and unmatched-error fallback.                                                       | `"无法解析，请检查输入。"`     |
| `binary`      | 解码后的数据不是 UTF-8 文本。 / The decoded data is not UTF-8 text.                      | Binary/non-safely-displayable UTF-8 result warning.                                              | `"结果不是可读文本。"`         |
| `unknown`     | 无法识别编码，请手动选择格式。 / Could not identify the encoding. Choose a format.       | No usable auto-detected format.                                                                  | `"无法识别，请手动选择格式。"` |
| `ambiguous`   | 存在多种可能的编码，请手动选择格式。 / More than one format matches. Choose a format.    | Multiple candidate formats from auto-detection.                                                  | `"存在多种可能，请选择格式。"` |
| `example`     | 示例 / Example                                                                           | Example-button text; implementation supplies examples, not this field.                           | `"试用示例"`                   |

<a id="page-messages"></a>

## messages.decoderPage: standalone page and task messages

Full prefix: `i18n.locales.<语言>.messages.decoderPage.`. These thirty-one optional **string** fields use the same defaults rule. Supply strings for types/examples. Apart from fullTool also naming About's full-tool link, these primarily serve the standalone page. Adding text does not give embedded tools standalone tasks.

| Field           | Simplified Chinese / English defaults                                                                                                                                                                                                                                                                                                                                                                                         | Status, purpose and limits                                                                                                                                         | Example value                                  |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------- |
| `description`   | 逐步解码文本，在本地解析代币调用并检查地址。 / Decode text in steps, inspect token calls and check addresses locally.                                                                                                                                                                                                                                                                                                         | Conditional: Page meta description and introduction, also WebApplication structured data.                                                                          | `"本地解码文本、解析调用并检查地址。"`         |
| `fullTool`      | 解码实验室 / DECODER LAB                                                                                                                                                                                                                                                                                                                                                                                                      | Conditional: Page h1, structured-data name, explanation-area accessible name and full-tool link from About. Does not replace fixed Decoder Lab in document titles. | `"我的解码工具"`                               |
| `task`          | 任务 / Task                                                                                                                                                                                                                                                                                                                                                                                                                   | Conditional: Accessible name of the three-task tab group.                                                                                                          | `"选择任务"`                                   |
| `textTask`      | 文本解码 / Text decoding                                                                                                                                                                                                                                                                                                                                                                                                      | Conditional: Text-task tab and explanation heading.                                                                                                                | `"文本解码"`                                   |
| `callTask`      | 代币调用 / Token call                                                                                                                                                                                                                                                                                                                                                                                                         | Conditional: Token-call tab, explanation heading and history format name; also included in browser document title.                                                 | `"代币调用解析"`                               |
| `addressTask`   | 地址检查 / Address inspection                                                                                                                                                                                                                                                                                                                                                                                                 | Conditional: Address-task tab, explanation heading and history format name.                                                                                        | `"地址格式检查"`                               |
| `addressHint`   | 检查数字货币地址格式：EVM／HyperEVM（0x…）、TRON（T…／41…）、Bitcoin。解析编码、长度及可用的校验和；比特币还检查网络匹配，显示地址类型和 scriptPubKey。不查询余额或交易。 / Check cryptocurrency address format: EVM / HyperEVM (0x…), TRON (T… / 41…), Bitcoin. Inspect encoding, length and available checksums; Bitcoin also shows address type, network compatibility and scriptPubKey. No balance or transaction lookup. | Conditional: Address-input explanation and part of its accessible description.                                                                                     | `"粘贴需要检查的地址。"`                       |
| `chain`         | 体系 / Ecosystem                                                                                                                                                                                                                                                                                                                                                                                                              | Conditional: Ecosystem select label; actual options such as EVM are fixed, not extended by text.                                                                   | `"地址体系"`                                   |
| `decimals`      | 小数位数 / Decimals                                                                                                                                                                                                                                                                                                                                                                                                           | Conditional: Token-decimals input label; also used for decimals errors.                                                                                            | `"代币小数位数"`                               |
| `precisionHint` | 可选，请填写代币精度；无法从调用数据推断。 / Optional. Enter the token precision; it cannot be inferred from calldata.                                                                                                                                                                                                                                                                                                        | Conditional: Optional precision-input hint; changing text sets no default precision.                                                                               | `"如需可读金额，请填写代币精度。"`             |
| `network`       | 比特币网络 / Bitcoin network                                                                                                                                                                                                                                                                                                                                                                                                  | Conditional: Bitcoin-network select label; does not change options.                                                                                                | `"Bitcoin 网络"`                               |
| `history`       | 处理步骤 / Processing steps                                                                                                                                                                                                                                                                                                                                                                                                   | Conditional: Processing-history heading and accessible name.                                                                                                       | `"处理历史"`                                   |
| `back`          | 从这一步继续 / Continue from this step                                                                                                                                                                                                                                                                                                                                                                                        | Conditional: History continue-from-this-step button; reuses step output and returns to text mode.                                                                  | `"继续处理此结果"`                             |
| `export`        | 导出步骤 / Export steps                                                                                                                                                                                                                                                                                                                                                                                                       | Conditional: Step-export button; exports JSON, not a screenshot.                                                                                                   | `"导出 JSON"`                                  |
| `limits`        | 最多 10 步，输入上限 16,384 字符，不自动请求网络。 / Up to 10 steps. Input: 16,384 characters. No automatic network requests.                                                                                                                                                                                                                                                                                                 | Conditional: History limits explanation only; does not change limits.                                                                                              | `"最多 10 步，输入不超过 16,384 字符。"`       |
| `callNotice`    | 按所选 ERC-20／TRC-20 规则解释，未验证合约身份或执行结果；可读金额取决于提供的精度。 / Interpreted using the selected ERC-20/TRC-20 schema. Contract identity and execution are not verified; amounts require supplied decimals.                                                                                                                                                                                              | Conditional: Call-mode notice and explanation of parsing boundaries.                                                                                               | `"解析不代表链上验证。"`                       |
| `addressNotice` | 格式检查不代表地址归属、账户存在或可信；EVM／TRON 地址无法标识具体网络。 / Format checks do not prove ownership, account existence or trust. EVM/TRON addresses do not identify a specific network.                                                                                                                                                                                                                           | Conditional: Address-mode notice and explanation of checking boundaries.                                                                                           | `"格式正确不代表地址可信。"`                   |
| `unsupported`   | 不支持此调用，仅支持 transfer、approve 和 transferFrom。 / Unsupported call. Only transfer, approve and transferFrom are supported.                                                                                                                                                                                                                                                                                           | Conditional: Error for unsupported ecosystems/call methods.                                                                                                        | `"仅支持 transfer、approve 和 transferFrom。"` |
| `checksum`      | 地址校验和错误。 / Invalid address checksum.                                                                                                                                                                                                                                                                                                                                                                                  | Conditional: Checksum error.                                                                                                                                       | `"地址校验和无效。"`                           |
| `length`        | 参数长度不正确。 / Incorrect argument length.                                                                                                                                                                                                                                                                                                                                                                                 | Conditional: ABI argument-length error.                                                                                                                            | `"调用参数长度不符。"`                         |
| `wrongNetwork`  | 地址与所选比特币网络不匹配。 / Address does not match the selected Bitcoin network.                                                                                                                                                                                                                                                                                                                                           | Conditional: Bitcoin address mismatch with selected network.                                                                                                       | `"地址与当前 Bitcoin 网络不符。"`              |
| `stepLimit`     | 最多保留 10 步，请清空历史后重新开始。 / Maximum 10 steps. Clear the input history to start again.                                                                                                                                                                                                                                                                                                                            | Conditional: Step-limit error; text cannot increase the limit.                                                                                                     | `"步骤已满，请清空后重试。"`                   |
| `budget`        | 历史记录达到内存限制，请清空。 / History memory limit reached. Clear the history.                                                                                                                                                                                                                                                                                                                                             | Conditional: History input/output memory-budget error.                                                                                                             | `"历史内容过多，请清空。"`                     |
| `addressParse`  | 解析地址编码 / Parse address encoding                                                                                                                                                                                                                                                                                                                                                                                         | Conditional: Address history substep: parse encoding.                                                                                                              | `"解析地址"`                                   |
| `addressCheck`  | 检查格式与校验和 / Check format and checksum                                                                                                                                                                                                                                                                                                                                                                                  | Conditional: Address history substep: check format/checksum.                                                                                                       | `"检查格式"`                                   |
| `addressResult` | 展示地址表示 / Show address representation                                                                                                                                                                                                                                                                                                                                                                                    | Conditional: Address/call history substep: show address representation.                                                                                            | `"展示地址结果"`                               |
| `callParse`     | 解析方法选择器与 ABI 参数 / Parse selector and ABI arguments                                                                                                                                                                                                                                                                                                                                                                  | Conditional: Call history substep: parse selector/arguments.                                                                                                       | `"解析调用参数"`                               |
| `rawOnly`       | 保留原始整数，尚未提供精度 / Keep raw integer; decimals not supplied                                                                                                                                                                                                                                                                                                                                                          | Conditional: Call history substep without supplied decimals.                                                                                                       | `"保留原始整数"`                               |
| `amountResult`  | 使用提供的精度转换金额 / Format amount using supplied decimals                                                                                                                                                                                                                                                                                                                                                                | Conditional: Call history substep after applying supplied decimals.                                                                                                | `"按精度显示金额"`                             |
| `inputHint`     | 选择任务并粘贴原始数据后解码；代币调用需要 calldata，不是交易哈希。 / Choose a task, paste the source data, then decode. Token calls require calldata, not a transaction hash.                                                                                                                                                                                                                                                | Conditional: Standalone call instructions: requires calldata, not a transaction hash.                                                                              | `"粘贴 calldata 后解析。"`                     |
| `loadFailed`    | 解码模块加载失败，请刷新页面后重试。 / Decoder module could not load. Refresh the page and try again.                                                                                                                                                                                                                                                                                                                         | Conditional: Standalone dynamically imported parsing-module failure, not a universal network error.                                                                | `"解析模块加载失败，请刷新重试。"`             |

The document title currently combines Decoder Lab | Base64 · JWT · with callTask. There is no separate decoderPage.title. fullTool does not replace the fixed Decoder Lab. Brand, network and format names are not all configurable; changing text does not add tasks.

<a id="readings"></a>

## messages.decoderPage.readings: reading section

Full prefix remains `i18n.locales.<语言>.messages.decoderPage`. `readings` is an optional object, unset in default language messages. The reading component supplies localized built-in text and 16 cards. Unrecognized languages use its English defaults; this is component-specific fallback, not identical titles for all languages.

| Field            | Type / default                                                                          | Status, purpose and limits                                                                                                                                                             | Example value                                                    |
| ---------------- | --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| readings.tribute | optional string / built-in localized tribute; full Simplified Chinese and English below | Conditional: standalone bottom tribute. Empty strings hide the paragraph, not cards. Plain text with some cypherpunk terms emphasized automatically; configuration HTML is not parsed. | '感谢这些思想与工具的作者。'                                     |
| readings.links   | optional DecoderReading[] / built-in 16-item list below                                 | Conditional: replaces all default cards in array order, without concatenation or a configuration count limit. Empty arrays hide cards, not the tribute.                                | [{ title: '我的文章', href: '/zh/blog/welcome-to-anglefeint/' }] |

Each readings.links item has five fields. “None” means no automatic value for custom items, not that built-in cards lack the information.

| Full relative field     | Type / default          | Status, purpose and limits                                                                                                                                                                                 | Example value                     |
| ----------------------- | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| readings.links[].title  | required string / none  | Conditional: card title. Empty/whitespace titles filter out the whole card. No Markdown/HTML parsing.                                                                                                      | '我的文章'                        |
| readings.links[].href   | required string / none  | Conditional: whole-card destination; accepts only HTTP(S):// or a single leading /. Protocol-relative //, mailto, anchors and ordinary relative paths are filtered. Prefix checks do not verify existence. | '/zh/blog/welcome-to-anglefeint/' |
| readings.links[].author | optional string / unset | Conditional: shown with year separated by a middle dot; empty values hidden, without site.author fallback.                                                                                                 | '作者名'                          |
| readings.links[].year   | optional string / unset | Conditional: displayed year or annotation. Not parsed as dates or used for sorting. Enter a string, not a number.                                                                                          | '2026'                            |
| readings.links[].cover  | optional string / unset | Conditional: built-in cover identifier, HTTP(S):// or image path starting with one /. Empty, unknown or unsupported values omit the cover without filtering the card.                                      | 'privacy-code'                    |

Cards open new tabs with noopener noreferrer. Internal root paths receive Astro BASE_URL; do not add the deployment prefix twice. href and custom cover values are not automatically trimmed: avoid surrounding spaces.

Sixteen built-in cover identifiers are available:

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

public/images/decoder/my-cover.webp corresponds to /images/decoder/my-cover.webp, without public or src/assets source paths. Covers use a cropped 16:9 region. Built-ins use responsive sizes; custom paths/remote covers output directly as img and do not enter the blog-cover variant pipeline. Prepare suitable sizes yourself. Failed images do not automatically switch to built-ins. Cards can remain text-only without covers.

Hide only the reading section while retaining the tool:

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

### Default tribute and cards

Simplified Chinese default tribute: 谨此致敬密码朋克与数字自由的先行者：他们以思想和代码，推动加密通信、个人隐私与自由，以及数字货币的发展。

English default tribute: In tribute to the cypherpunks and pioneers of digital freedom, whose ideas and code advanced private communication, individual liberty and digital money.

All default cards follow in their actual order. Blank author/year cells mean unset. Built-in external URLs include bundled source parameters; these are data and are not added automatically to custom href values.

| Cover identifier                  | Simplified Chinese / English titles                                                             | Author                | Year | href                                                                                                                                                                                                           |
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

## Configuration example to merge

Use existing `defineThemeConfig({...})` in `src/site.config.ts`, retaining imports, exports and personal settings without duplicating theme or i18n. This overrides only Chinese. Other languages retain their settings and fallback; see the [language tutorial](/en/blog/starter-guide-languages/).

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

## Capabilities and limits outside site.config

- **Text:** Fixed support for Base64 / Base64URL, URL, Hex, HTML entities, Unicode escapes and JWT. Auto-detection accepts exactly one successful candidate; multiple candidates require manual selection. Each submission decodes one layer, without automatic recursive decoding. JWT content is parsed without signature verification. Output renders as text and never executes decoded HTML/scripts.
- **Input and history:** Input limit: 16,384 JavaScript UTF-16 code units; address tasks additionally cap at 128. Standalone history retains at most 10 steps and 262,144 accumulated input/output code units. Continuing a step or reusing results forms a chain; ordinary new submissions clear the old chain. Current steps export as decoder-results.json. The memory budget is not a “262 KB image size”. limits, tooLong and stepLimit text does not change limits.
- **Calls and addresses:** Calls support transfer, approve and transferFrom for EVM / HyperEVM / TRON. Bitcoin token calls are unsupported. Reader-supplied decimals default empty, retaining raw integers; canonical integer strings 0–255 are accepted. Configuration cannot preset precision. Address checking supports implemented EVM / HyperEVM, TRON and Bitcoin formats/checksums. It proves neither ownership, balances nor trust.
- **Networking and privacy:** Decoding makes no RPC requests and uploads no input. Modules, styles, images and site analytics may still use the network. “Local processing” does not make the full page offline-capable. Copying depends on clipboard support; exports contain original inputs/outputs of current steps.
- **Interface defaults:** Starts in text mode with auto-detection; ecosystem defaults EVM and Bitcoin network Mainnet. No public defaultTask, defaultFormat, maxSteps, RPC URL, supported-chain list, sample-input list or background switch exists. Reduced motion follows system preference.

All Decoder fields here have consumers; there are no additional Decoder compatibility settings to fill. Unused About legacy fields are identified above. Text fields control display, not algorithms. Return to the [configuration index](/en/blog/config-reference/).
