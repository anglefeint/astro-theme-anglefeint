---
tags: ['anglefeint', 'config']
title: '配置字典：Decoder'
subtitle: '独立解码页面、About 内嵌工具与延伸阅读卡片。'
description: '以实际代码查阅 Decoder 开关、文本与任务文案、阅读列表和封面配置，说明默认值、限制及当前生效范围。'
pubDate: '2026-11-13'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/hacker-01.webp'
---

想先找到配置文件，读[安装与站点信息](/zh/blog/starter-guide-1-configure-your-site/)；页面启停见[页面与功能定制教程](/zh/blog/starter-guide-3-comments-about-and-theme-toggles/)。本文用于查字段，其他模块从[配置字典总入口](/zh/blog/config-reference/)进入。

这里的“阅读卡片”是 Decoder 页面底部的延伸阅读链接，不是 Blog List 的文章卡片，也不会根据博客文章自动生成。默认值来自当前主题包，不能把 demo 的覆盖值当成主题默认值。

<a id="page-enabled"></a>

## theme.enableDecoderPage：独立页面开关

- **类型 / 默认值：** boolean / true。
- **作用与状态：** 生效。为启用语言生成 `/<语言>/decoder/` 独立页面；公共导航及 About 弹窗中的完整工具跳转入口随之启停。
- **限制：** 关闭独立页面不关闭 About 的内嵌文本解码器；About 自身由 theme.enableAboutPage 控制。它也不删除已公开内容或保证清除旧部署文件。改配置后需要重新构建部署。
- **示例：** `theme: { enableDecoderPage: false }`。

| 功能                  | 独立 Decoder 页面       | About 内嵌解码器                                    |
| --------------------- | ----------------------- | --------------------------------------------------- |
| 文本格式解码          | 有                      | 有                                                  |
| Token call / 地址检查 | 有                      | 无                                                  |
| 多步骤历史、JSON 导出 | 有                      | 无                                                  |
| 阅读卡片、致敬文字    | 有                      | 无                                                  |
| 工具内通用文字        | messages.decoder        | messages.decoder                                    |
| 标题与入口文字        | messages.decoderPage 等 | About 的 sidebar.decryptor / modals.decryptor.title |

About 的旧 header、keysLabel、currentPassphraseLabel、masterKeyLabel、transientKeyLabel 仍被类型接受，但当前 Decoder 不读取，见[About 工具字段](/zh/blog/config-about/#modal-fields)。改这些旧字段不会改变本页。

<a id="text-messages"></a>

## messages.decoder：通用文本工具文案

完整前缀是 `i18n.locales.<语言>.messages.decoder.`。每项均为可省略的 **string**；默认取内置当前语言文案及语言回退链。下面列中文 / 英文默认值，每行的示例是字段值。所有字段都是条件生效：有对应工具、操作或状态时使用；不设置也有默认值。空字符串会覆盖文案，不是关闭控件的方式；错误查找的部分分支还会回退到其他提示。

| 字段          | 中文 / 英文默认值                                                                        | 作用与限制                                                  | 示例值                         |
| ------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------- | ------------------------------ |
| `input`       | 输入 / Input                                                                             | 输入区域标签和历史步骤中的原始输入标签                      | `"原始内容"`                   |
| `placeholder` | 粘贴编码后的文本… / Paste encoded text…                                                  | 输入框占位提示；不预填内容                                  | `"粘贴需要解码的文本"`         |
| `format`      | 格式 / Format                                                                            | 文本格式选择器标签；不增加或删除支持格式                    | `"编码格式"`                   |
| `auto`        | 自动识别 / Auto detect                                                                   | 自动识别选项文字；不改变识别算法                            | `"自动判断"`                   |
| `decode`      | 解码 / Decode                                                                            | 提交解码按钮文字                                            | `"开始解码"`                   |
| `clear`       | 清空 / Clear                                                                             | 清空按钮；清理当前输入、输出和步骤                          | `"清空内容"`                   |
| `copy`        | 复制结果 / Copy result                                                                   | 复制结果按钮文字；按钮在有可复制结果时启用                  | `"复制结果"`                   |
| `reuse`       | 将结果作为输入 / Use result as input                                                     | 使用结果继续输入按钮；过长结果不能回填                      | `"继续解码"`                   |
| `supported`   | 支持的解码格式 / Supported formats                                                       | 支持格式说明的前缀                                          | `"支持格式"`                   |
| `html`        | HTML 实体 / HTML entities                                                                | HTML 实体格式名称，不改变解码规则                           | `"HTML 实体"`                  |
| `unicode`     | Unicode 转义 / Unicode escapes                                                           | Unicode 转义格式名称，不改变解码规则                        | `"Unicode 转义"`               |
| `jwtWarning`  | 未验证签名，解码内容不代表可信。 / Signature not verified; decoded claims are untrusted. | JWT 提示；独立页说明和 JWT 成功状态使用，不能靠文案启用验签 | `"仅解码，不验证签名。"`       |
| `copied`      | 结果已复制。 / Result copied.                                                            | 剪贴板复制成功状态                                          | `"已复制结果"`                 |
| `copyFailed`  | 无法复制，请选中结果手动复制。 / Copy unavailable. Select the result and copy it.        | 剪贴板复制失败状态，不是解码失败                            | `"无法复制，请手动选择文本。"` |
| `output`      | 解码结果 / Decoded text                                                                  | 结果区标题、无障碍名称及历史步骤中的输出标签                | `"解码结果"`                   |
| `local`       | 仅在当前浏览器处理，不上传内容。 / Processed in this browser. Nothing is uploaded.       | 工具底部的本地处理说明；不是禁用整站网络请求的开关          | `"输入由浏览器本地处理。"`     |
| `ready`       | 准备就绪。 / Ready.                                                                      | 初始及重置后的就绪状态                                      | `"等待输入"`                   |
| `running`     | 正在解码… / Decoding…                                                                    | 处理及显示过程中的状态                                      | `"处理中"`                     |
| `done`        | 解码完成 / Decoded                                                                       | 成功状态，可附加格式名及 JWT 提示                           | `"完成"`                       |
| `empty`       | 请先输入编码文本。 / Enter encoded text first.                                           | 空输入错误                                                  | `"请先输入内容。"`             |
| `tooLong`     | 最多输入 16,384 个字符。 / Input limit: 16,384 characters.                               | 超过输入上限的错误；地址任务有更小上限，改文字不改限制      | `"输入超过限制。"`             |
| `invalid`     | 内容不符合所选编码格式。 / Invalid encoding for the selected format.                     | 无效数据及未匹配其他错误文案时的兜底                        | `"无法解析，请检查输入。"`     |
| `binary`      | 解码后的数据不是 UTF-8 文本。 / The decoded data is not UTF-8 text.                      | 二进制数据或不能安全显示为 UTF-8 文本时的提示               | `"结果不是可读文本。"`         |
| `unknown`     | 无法识别编码，请手动选择格式。 / Could not identify the encoding. Choose a format.       | 自动识别没有找到可用格式时的提示                            | `"无法识别，请手动选择格式。"` |
| `ambiguous`   | 存在多种可能的编码，请手动选择格式。 / More than one format matches. Choose a format.    | 自动识别得到多个候选时的提示                                | `"存在多种可能，请选择格式。"` |
| `example`     | 示例 / Example                                                                           | 示例按钮文字；示例内容由实现提供，不能用此字段替换          | `"试用示例"`                   |

<a id="page-messages"></a>

## messages.decoderPage：独立页面与任务文案

完整前缀是 `i18n.locales.<语言>.messages.decoderPage.`。下表三十一项均为可省略的 **string**，默认规则与上表相同；类型与示例值均按字符串填写。除 fullTool 还用于 About 的完整工具链接外，这组字段主要用于独立页。内嵌工具没有相应任务，不会因填写文字出现完整模式。

| 字段            | 中文 / 英文默认值                                                                                                                                                                                                                                                                                                                                                                                                             | 状态、作用与限制                                                                                                           | 示例值                                         |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `description`   | 逐步解码文本，在本地解析代币调用并检查地址。 / Decode text in steps, inspect token calls and check addresses locally.                                                                                                                                                                                                                                                                                                         | 条件生效：页面元描述及标题下介绍，也用于 WebApplication 结构化数据                                                         | `"本地解码文本、解析调用并检查地址。"`         |
| `fullTool`      | 解码实验室 / DECODER LAB                                                                                                                                                                                                                                                                                                                                                                                                      | 条件生效：页面 h1、结构化数据名称、工具说明区域无障碍名称，以及 About 弹窗跳转链接文字；不替换文档标题中固定的 Decoder Lab | `"我的解码工具"`                               |
| `task`          | 任务 / Task                                                                                                                                                                                                                                                                                                                                                                                                                   | 条件生效：三类任务选项卡组的无障碍名称                                                                                     | `"选择任务"`                                   |
| `textTask`      | 文本解码 / Text decoding                                                                                                                                                                                                                                                                                                                                                                                                      | 条件生效：文本任务选项卡和说明标题                                                                                         | `"文本解码"`                                   |
| `callTask`      | 代币调用 / Token call                                                                                                                                                                                                                                                                                                                                                                                                         | 条件生效：代币调用选项卡、说明标题、历史格式名；还拼入浏览器文档标题                                                       | `"代币调用解析"`                               |
| `addressTask`   | 地址检查 / Address inspection                                                                                                                                                                                                                                                                                                                                                                                                 | 条件生效：地址任务选项卡、说明标题和历史格式名                                                                             | `"地址格式检查"`                               |
| `addressHint`   | 检查数字货币地址格式：EVM／HyperEVM（0x…）、TRON（T…／41…）、Bitcoin。解析编码、长度及可用的校验和；比特币还检查网络匹配，显示地址类型和 scriptPubKey。不查询余额或交易。 / Check cryptocurrency address format: EVM / HyperEVM (0x…), TRON (T… / 41…), Bitcoin. Inspect encoding, length and available checksums; Bitcoin also shows address type, network compatibility and scriptPubKey. No balance or transaction lookup. | 条件生效：地址模式输入框说明及无障碍描述的一部分                                                                           | `"粘贴需要检查的地址。"`                       |
| `chain`         | 体系 / Ecosystem                                                                                                                                                                                                                                                                                                                                                                                                              | 条件生效：体系下拉框标签；EVM 等实际选项固定，不由文案扩展                                                                 | `"地址体系"`                                   |
| `decimals`      | 小数位数 / Decimals                                                                                                                                                                                                                                                                                                                                                                                                           | 条件生效：代币小数位数输入标签；非法精度产生 decimals 错误时也用此文字作为提示                                             | `"代币小数位数"`                               |
| `precisionHint` | 可选，请填写代币精度；无法从调用数据推断。 / Optional. Enter the token precision; it cannot be inferred from calldata.                                                                                                                                                                                                                                                                                                        | 条件生效：代币精度可选输入说明；修改文案不会设置默认精度                                                                   | `"如需可读金额，请填写代币精度。"`             |
| `network`       | 比特币网络 / Bitcoin network                                                                                                                                                                                                                                                                                                                                                                                                  | 条件生效：Bitcoin 网络下拉框标签；不改变网络选项                                                                           | `"Bitcoin 网络"`                               |
| `history`       | 处理步骤 / Processing steps                                                                                                                                                                                                                                                                                                                                                                                                   | 条件生效：处理步骤区域标题及无障碍名称                                                                                     | `"处理历史"`                                   |
| `back`          | 从这一步继续 / Continue from this step                                                                                                                                                                                                                                                                                                                                                                                        | 条件生效：历史记录中“从这一步继续”按钮，回填该步输出并切回文本任务                                                         | `"继续处理此结果"`                             |
| `export`        | 导出步骤 / Export steps                                                                                                                                                                                                                                                                                                                                                                                                       | 条件生效：步骤导出按钮；导出为 JSON 文件，不是截图                                                                         | `"导出 JSON"`                                  |
| `limits`        | 最多 10 步，输入上限 16,384 字符，不自动请求网络。 / Up to 10 steps. Input: 16,384 characters. No automatic network requests.                                                                                                                                                                                                                                                                                                 | 条件生效：步骤区限制说明；仅是文案，不改变实际限制                                                                         | `"最多 10 步，输入不超过 16,384 字符。"`       |
| `callNotice`    | 按所选 ERC-20／TRC-20 规则解释，未验证合约身份或执行结果；可读金额取决于提供的精度。 / Interpreted using the selected ERC-20/TRC-20 schema. Contract identity and execution are not verified; amounts require supplied decimals.                                                                                                                                                                                              | 条件生效：调用模式提示及说明段落，解释解析能力边界                                                                         | `"解析不代表链上验证。"`                       |
| `addressNotice` | 格式检查不代表地址归属、账户存在或可信；EVM／TRON 地址无法标识具体网络。 / Format checks do not prove ownership, account existence or trust. EVM/TRON addresses do not identify a specific network.                                                                                                                                                                                                                           | 条件生效：地址模式及说明段落的边界提示                                                                                     | `"格式正确不代表地址可信。"`                   |
| `unsupported`   | 不支持此调用，仅支持 transfer、approve 和 transferFrom。 / Unsupported call. Only transfer, approve and transferFrom are supported.                                                                                                                                                                                                                                                                                           | 条件生效：不支持的任务体系或调用方法的错误                                                                                 | `"仅支持 transfer、approve 和 transferFrom。"` |
| `checksum`      | 地址校验和错误。 / Invalid address checksum.                                                                                                                                                                                                                                                                                                                                                                                  | 条件生效：校验和错误                                                                                                       | `"地址校验和无效。"`                           |
| `length`        | 参数长度不正确。 / Incorrect argument length.                                                                                                                                                                                                                                                                                                                                                                                 | 条件生效：ABI 参数长度错误                                                                                                 | `"调用参数长度不符。"`                         |
| `wrongNetwork`  | 地址与所选比特币网络不匹配。 / Address does not match the selected Bitcoin network.                                                                                                                                                                                                                                                                                                                                           | 条件生效：Bitcoin 地址与所选网络不匹配                                                                                     | `"地址与当前 Bitcoin 网络不符。"`              |
| `stepLimit`     | 最多保留 10 步，请清空历史后重新开始。 / Maximum 10 steps. Clear the input history to start again.                                                                                                                                                                                                                                                                                                                            | 条件生效：步骤达到上限的错误，不能用文字调大上限                                                                           | `"步骤已满，请清空后重试。"`                   |
| `budget`        | 历史记录达到内存限制，请清空。 / History memory limit reached. Clear the history.                                                                                                                                                                                                                                                                                                                                             | 条件生效：历史输入与输出达到内存预算的错误                                                                                 | `"历史内容过多，请清空。"`                     |
| `addressParse`  | 解析地址编码 / Parse address encoding                                                                                                                                                                                                                                                                                                                                                                                         | 条件生效：地址历史子步骤：解析编码                                                                                         | `"解析地址"`                                   |
| `addressCheck`  | 检查格式与校验和 / Check format and checksum                                                                                                                                                                                                                                                                                                                                                                                  | 条件生效：地址历史子步骤：检查格式和校验和                                                                                 | `"检查格式"`                                   |
| `addressResult` | 展示地址表示 / Show address representation                                                                                                                                                                                                                                                                                                                                                                                    | 条件生效：地址或调用历史子步骤：展示地址表示                                                                               | `"展示地址结果"`                               |
| `callParse`     | 解析方法选择器与 ABI 参数 / Parse selector and ABI arguments                                                                                                                                                                                                                                                                                                                                                                  | 条件生效：调用历史子步骤：解析选择器和参数                                                                                 | `"解析调用参数"`                               |
| `rawOnly`       | 保留原始整数，尚未提供精度 / Keep raw integer; decimals not supplied                                                                                                                                                                                                                                                                                                                                                          | 条件生效：未填精度时的调用历史子步骤                                                                                       | `"保留原始整数"`                               |
| `amountResult`  | 使用提供的精度转换金额 / Format amount using supplied decimals                                                                                                                                                                                                                                                                                                                                                                | 条件生效：提供精度后的调用历史子步骤                                                                                       | `"按精度显示金额"`                             |
| `inputHint`     | 选择任务并粘贴原始数据后解码；代币调用需要 calldata，不是交易哈希。 / Choose a task, paste the source data, then decode. Token calls require calldata, not a transaction hash.                                                                                                                                                                                                                                                | 条件生效：独立页调用说明段落；需要 calldata，不是交易哈希                                                                  | `"粘贴 calldata 后解析。"`                     |
| `loadFailed`    | 解码模块加载失败，请刷新页面后重试。 / Decoder module could not load. Refresh the page and try again.                                                                                                                                                                                                                                                                                                                         | 条件生效：独立页动态加载加密解析模块失败时的错误；不是所有页面通用的网络错误                                               | `"解析模块加载失败，请刷新重试。"`             |

文档标题当前拼成 Decoder Lab | Base64 · JWT · 加上 callTask 文案；没有单独的 decoderPage.title 字段。fullTool 不会替换其中固定的 Decoder Lab。页内没有把所有品牌名、网络名、格式名都做成配置；修改文字也不会增加新任务。

<a id="readings"></a>

## messages.decoderPage.readings：阅读区

完整前缀仍是 `i18n.locales.<语言>.messages.decoderPage`。`readings` 本身是可省略的对象；其默认值在语言文案中未设置，由阅读组件根据当前语言提供内置文字及 16 张卡片。组件不认识的语言使用英文默认阅读内容；这是阅读组件自己的默认，不是每种语言都有相同标题。

| 字段             | 类型 / 默认值                                               | 状态、作用与限制                                                                                                          | 示例值                                                           |
| ---------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| readings.tribute | string，可省略 / 内置当前语言致敬文字，中文及英文全文见下文 | 条件生效：独立页面底部致敬段落；空字符串隐藏段落，不隐藏卡片。按纯文字渲染，部分“密码朋克”词自动加粗，不解析配置中的 HTML | '感谢这些思想与工具的作者。'                                     |
| readings.links   | DecoderReading[]，可省略 / 内置 16 项列表，见下文           | 条件生效：整组替换默认卡片，顺序按数组，不与默认列表拼接；无配置条数上限。空数组隐藏卡片，不隐藏致敬段落                  | [{ title: '我的文章', href: '/zh/blog/welcome-to-anglefeint/' }] |

readings.links 的每个元素有以下五个字段。表中“无”指自定义条目没有自动补值，不表示内置卡片没有这些信息。

| 字段（完整相对路径）    | 类型 / 默认值           | 状态、作用与限制                                                                                                                                  | 示例值                            |
| ----------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| readings.links[].title  | string，必填 / 无       | 条件生效：卡片标题；为空或纯空白会过滤整张卡片。文字不解析 Markdown 或 HTML                                                                       | '我的文章'                        |
| readings.links[].href   | string，必填 / 无       | 条件生效：整卡跳转地址；只接受以 HTTP(S):// 或单个 / 开头的值，双斜杠协议相对地址、mailto、锚点和普通相对路径被过滤。只是前缀检查，不验证目标存在 | '/zh/blog/welcome-to-anglefeint/' |
| readings.links[].author | string，可省略 / 未设置 | 条件生效：与年份以中点连接显示；空值不显示，不自动取 site.author                                                                                  | '作者名'                          |
| readings.links[].year   | string，可省略 / 未设置 | 条件生效：显示年份或说明文字；不解析为日期、不参与排序。填写字符串，不填数字                                                                      | '2026'                            |
| readings.links[].cover  | string，可省略 / 未设置 | 条件生效：内置封面标识，或 HTTP(S):// 地址、单个 / 开头的图片路径；空值、未知标识、不支持的路径不展示封面，不过滤卡片                             | 'privacy-code'                    |

卡片链接在新标签页打开，带 noopener noreferrer；站内根路径会按 Astro 的 BASE_URL 加前缀，配置时不要再次手动添加同一部署前缀。href 和自定义 cover 没有自动 trim，填写时不要加首尾空格。

内置封面标识有以下十六个：

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

自定义图片例如 public/images/decoder/my-cover.webp 对应配置 /images/decoder/my-cover.webp，不写 public 前缀，也不写 src/assets 下的源码路径。阅读封面以 16:9 区域裁切显示。内置封面使用响应式尺寸；自定义路径或远程封面直接以 img 输出，不会自动进入博客封面的多尺寸生成管线。请自行准备适当大小；加载失败不会自动换成内置图。空封面也能保留纯文字卡片。

只隐藏阅读区而保留工具：

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

### 默认致敬文字和卡片

中文默认致敬文字：谨此致敬密码朋克与数字自由的先行者：他们以思想和代码，推动加密通信、个人隐私与自由，以及数字货币的发展。

英文默认致敬文字：In tribute to the cypherpunks and pioneers of digital freedom, whose ideas and code advanced private communication, individual liberty and digital money.

下面按实际顺序列出全部默认卡片；空白作者或年份表示未设置。默认外链包含主题附带的来源参数；这是内置数据，不会自动加到你自定义的 href 上。

| 封面标识                          | 中文标题 / 英文标题                                                                             | 作者                  | 年份 | href                                                                                                                                                                                                           |
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

## 合并配置示例

写入 `src/site.config.ts` 现有的 `defineThemeConfig({...})`；保留 import、export 和其他个人设置，不要重复创建 theme 或 i18n。以下只覆盖中文，其他语言仍按自己的配置与回退链解析，详见[多语言教程](/zh/blog/starter-guide-languages/)。

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

## 这些能力和限制不由 site.config 配置

- **文本：** 固定支持 Base64 / Base64URL、URL、Hex、HTML 实体、Unicode 转义、JWT。自动识别只接受一个成功候选；多个候选要求手动选格式。每次提交处理一层，不是自动循环解码。JWT 只解析内容，不验证签名；输出作为文本显示，不执行解码得到的 HTML 或脚本。
- **输入与历史：** 输入上限 16,384 个 JavaScript UTF-16 码元；地址任务另有 128 码元上限。完整页历史最多 10 步，累计输入与输出最多 262,144 码元。继续步骤或使用结果才形成处理链，普通新提交会清理旧链；导出当前步骤为 decoder-results.json。内存预算不是“262 KB 图片大小”。改 limits、tooLong 或 stepLimit 文案不改变任何限制。
- **调用与地址：** 调用支持 transfer、approve、transferFrom；体系为 EVM / HyperEVM / TRON，Bitcoin 不支持代币调用。精度由读者输入，默认留空，保留原始整数；允许 0–255 的规范整数字符串，不能用配置预设默认精度。地址检查支持 EVM / HyperEVM、TRON、Bitcoin 的已实现格式和校验规则；它不证明归属、余额或可信度。
- **网络与隐私：** 解码逻辑不请求 RPC 或上传输入；模块、样式、图片和站点自身的统计等仍可能请求网络。“本地处理”不代表整个页面离线可用。复制依赖浏览器剪贴板能力；导出文件包含当前步骤的原始输入与输出。
- **界面默认：** 初始为文本任务、自动识别；体系默认 EVM，Bitcoin 网络默认 Mainnet。没有公开的 defaultTask、defaultFormat、maxSteps、RPC URL、支持链清单、示例输入列表或背景开关。减少动态效果由系统偏好处理。

当前字典涉及的 Decoder 字段都有消费位置，没有额外的 Decoder 兼容配置需要填写。About 中不再消费的旧字段已在前文单独指出；文案字段只是显示内容，不能当作算法参数。返回[配置字典总入口](/zh/blog/config-reference/)查其他模块。
