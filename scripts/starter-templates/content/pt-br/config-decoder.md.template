---
tags: ['anglefeint', 'config']
title: 'Referência de configuração: Decoder'
subtitle: 'Textos das ferramentas, tarefas e leitura adicional'
description: 'Campos Decoder, padrões de interface e leitura, limites de processamento e configurações antigas.'
pubDate: '2026-11-13'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/hacker-01.webp'
---

Para localizar a configuração, veja [instalação e informações do site](/pt-br/blog/starter-guide-1-configure-your-site/); para ativar páginas, veja [páginas e recursos](/pt-br/blog/starter-guide-3-comments-about-and-theme-toggles/). Este artigo é uma referência de campos. Outros módulos estão no [índice de configuração](/pt-br/blog/config-reference/).

“Cards de leitura” são os links adicionais no fim do Decoder, não cards do Blog List nem entradas geradas automaticamente das publicações. Os padrões vêm do pacote atual, não das substituições do demo.

<a id="page-enabled"></a>

## theme.enableDecoderPage: ativar a página independente

- **Tipo / padrão:** boolean / true.
- **Efeito e estado:** ativo. Gera `/<语言>/decoder/` para idiomas ativos e controla os links de ferramenta completa na navegação e janela About.
- **Limites:** desativar não desliga o decoder de texto embutido no About, controlado por theme.enableAboutPage. Não apaga conteúdo público nem garante limpar arquivos antigos da hospedagem. Recompile/publique após alterar.
- **Exemplo:** `theme: { enableDecoderPage: false }`.

| Recurso                               | Página Decoder independente   | Decoder embutido no About                           |
| ------------------------------------- | ----------------------------- | --------------------------------------------------- |
| Decodificação de texto                | Sim                           | Sim                                                 |
| Token call / inspeção de endereço     | Sim                           | Não                                                 |
| Histórico de etapas e exportação JSON | Sim                           | Não                                                 |
| Cards de leitura e homenagem          | Sim                           | Não                                                 |
| Textos gerais da ferramenta           | messages.decoder              | messages.decoder                                    |
| Título e entrada                      | messages.decoderPage e outros | sidebar.decryptor / modals.decryptor.title de About |

header, keysLabel, currentPassphraseLabel, masterKeyLabel e transientKeyLabel antigos do About ainda são aceitos pelo tipo, mas não lidos pelo Decoder atual. Veja [campos de ferramentas About](/pt-br/blog/config-about/#modal-fields). Alterá-los não muda esta página.

<a id="text-messages"></a>

## messages.decoder: textos gerais de decodificação

Prefixo completo: `i18n.locales.<语言>.messages.decoder.`. Cada campo é **string** opcional, com padrão integrado do idioma atual e fallback. A tabela mostra padrões em chinês simplificado / inglês e exemplos de valores. Todos são condicionais à ferramenta, ação ou estado correspondente; omitir mantém o padrão. Vazio sobrescreve texto sem desativar controle; alguns ramos de erro ainda usam outras mensagens como fallback.

| Campo         | Padrão em chinês simplificado / inglês                                                   | Efeito e limites                                                                        | Exemplo                        |
| ------------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------ |
| `input`       | 输入 / Input                                                                             | Rótulo de entrada e entrada original nas etapas do histórico                            | `"原始内容"`                   |
| `placeholder` | 粘贴编码后的文本… / Paste encoded text…                                                  | Placeholder, sem preencher conteúdo                                                     | `"粘贴需要解码的文本"`         |
| `format`      | 格式 / Format                                                                            | Rótulo do formato, sem acrescentar ou remover formatos                                  | `"编码格式"`                   |
| `auto`        | 自动识别 / Auto detect                                                                   | Texto da identificação automática, sem mudar algoritmo                                  | `"自动判断"`                   |
| `decode`      | 解码 / Decode                                                                            | Texto do botão de decodificar                                                           | `"开始解码"`                   |
| `clear`       | 清空 / Clear                                                                             | Botão que limpa entrada, saída e etapas atuais                                          | `"清空内容"`                   |
| `copy`        | 复制结果 / Copy result                                                                   | Texto do botão de cópia, habilitado com resultado copiável                              | `"复制结果"`                   |
| `reuse`       | 将结果作为输入 / Use result as input                                                     | Botão para continuar com a saída; resultados longos demais não são reaplicados          | `"继续解码"`                   |
| `supported`   | 支持的解码格式 / Supported formats                                                       | Prefixo da lista de formatos suportados                                                 | `"支持格式"`                   |
| `html`        | HTML 实体 / HTML entities                                                                | Nome de entidades HTML, sem mudar regras                                                | `"HTML 实体"`                  |
| `unicode`     | Unicode 转义 / Unicode escapes                                                           | Nome de escapes Unicode, sem mudar regras                                               | `"Unicode 转义"`               |
| `jwtWarning`  | 未验证签名，解码内容不代表可信。 / Signature not verified; decoded claims are untrusted. | Aviso JWT nas instruções e estado de sucesso; texto não ativa verificação de assinatura | `"仅解码，不验证签名。"`       |
| `copied`      | 结果已复制。 / Result copied.                                                            | Sucesso de cópia no clipboard                                                           | `"已复制结果"`                 |
| `copyFailed`  | 无法复制，请选中结果手动复制。 / Copy unavailable. Select the result and copy it.        | Falha de cópia, não falha de decodificação                                              | `"无法复制，请手动选择文本。"` |
| `output`      | 解码结果 / Decoded text                                                                  | Título, nome acessível e rótulo de saída no histórico                                   | `"解码结果"`                   |
| `local`       | 仅在当前浏览器处理，不上传内容。 / Processed in this browser. Nothing is uploaded.       | Aviso local no fim; não desativa toda rede do site                                      | `"输入由浏览器本地处理。"`     |
| `ready`       | 准备就绪。 / Ready.                                                                      | Estado inicial e após redefinir                                                         | `"等待输入"`                   |
| `running`     | 正在解码… / Decoding…                                                                    | Estado durante processamento e apresentação                                             | `"处理中"`                     |
| `done`        | 解码完成 / Decoded                                                                       | Sucesso, podendo incluir formato e aviso JWT                                            | `"完成"`                       |
| `empty`       | 请先输入编码文本。 / Enter encoded text first.                                           | Erro de entrada vazia                                                                   | `"请先输入内容。"`             |
| `tooLong`     | 最多输入 16,384 个字符。 / Input limit: 16,384 characters.                               | Erro de limite; endereços têm limite menor. Alterar não muda limites                    | `"输入超过限制。"`             |
| `invalid`     | 内容不符合所选编码格式。 / Invalid encoding for the selected format.                     | Dados inválidos e fallback sem outro erro correspondente                                | `"无法解析，请检查输入。"`     |
| `binary`      | 解码后的数据不是 UTF-8 文本。 / The decoded data is not UTF-8 text.                      | Dados binários ou impossíveis de exibir como UTF-8 seguro                               | `"结果不是可读文本。"`         |
| `unknown`     | 无法识别编码，请手动选择格式。 / Could not identify the encoding. Choose a format.       | Identificação automática sem formato válido                                             | `"无法识别，请手动选择格式。"` |
| `ambiguous`   | 存在多种可能的编码，请手动选择格式。 / More than one format matches. Choose a format.    | Identificação automática com múltiplos candidatos                                       | `"存在多种可能，请选择格式。"` |
| `example`     | 示例 / Example                                                                           | Texto do botão de exemplo; não substitui o conteúdo definido na implementação           | `"试用示例"`                   |

<a id="page-messages"></a>

## messages.decoderPage: página independente e tarefas

Prefixo completo: `i18n.locales.<语言>.messages.decoderPage.`. Os 31 campos são **string** opcionais, com as mesmas regras. Preencha tipos e exemplos como strings. Além de fullTool no link About, atendem principalmente à página independente. O decoder embutido não ganha tarefas de modo completo por configurar seus textos.

| Campo           | Padrão em chinês simplificado / inglês                                                                                                                                                                                                                                                                                                                                                                                        | Estado, efeito e limites                                                                                                            | Exemplo                                        |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `description`   | 逐步解码文本，在本地解析代币调用并检查地址。 / Decode text in steps, inspect token calls and check addresses locally.                                                                                                                                                                                                                                                                                                         | Condicional: metadescrição, apresentação abaixo do título e dados estruturados WebApplication                                       | `"本地解码文本、解析调用并检查地址。"`         |
| `fullTool`      | 解码实验室 / DECODER LAB                                                                                                                                                                                                                                                                                                                                                                                                      | Condicional: h1, nome estruturado, nome acessível das instruções e link no About; não troca Decoder Lab fixo do título do documento | `"我的解码工具"`                               |
| `task`          | 任务 / Task                                                                                                                                                                                                                                                                                                                                                                                                                   | Condicional: nome acessível do grupo de três tarefas                                                                                | `"选择任务"`                                   |
| `textTask`      | 文本解码 / Text decoding                                                                                                                                                                                                                                                                                                                                                                                                      | Condicional: aba e título explicativo da tarefa de texto                                                                            | `"文本解码"`                                   |
| `callTask`      | 代币调用 / Token call                                                                                                                                                                                                                                                                                                                                                                                                         | Condicional: aba, instruções e nome no histórico de chamadas; também compõe o título do navegador                                   | `"代币调用解析"`                               |
| `addressTask`   | 地址检查 / Address inspection                                                                                                                                                                                                                                                                                                                                                                                                 | Condicional: aba, instruções e nome no histórico de endereços                                                                       | `"地址格式检查"`                               |
| `addressHint`   | 检查数字货币地址格式：EVM／HyperEVM（0x…）、TRON（T…／41…）、Bitcoin。解析编码、长度及可用的校验和；比特币还检查网络匹配，显示地址类型和 scriptPubKey。不查询余额或交易。 / Check cryptocurrency address format: EVM / HyperEVM (0x…), TRON (T… / 41…), Bitcoin. Inspect encoding, length and available checksums; Bitcoin also shows address type, network compatibility and scriptPubKey. No balance or transaction lookup. | Condicional: instruções da entrada no modo endereço e parte da descrição acessível                                                  | `"粘贴需要检查的地址。"`                       |
| `chain`         | 体系 / Ecosystem                                                                                                                                                                                                                                                                                                                                                                                                              | Condicional: rótulo do ecossistema; opções reais EVM etc. são fixas                                                                 | `"地址体系"`                                   |
| `decimals`      | 小数位数 / Decimals                                                                                                                                                                                                                                                                                                                                                                                                           | Condicional: rótulo de precisão; também usado em erros decimals de precisão inválida                                                | `"代币小数位数"`                               |
| `precisionHint` | 可选，请填写代币精度；无法从调用数据推断。 / Optional. Enter the token precision; it cannot be inferred from calldata.                                                                                                                                                                                                                                                                                                        | Condicional: instrução da precisão opcional, sem definir valor padrão                                                               | `"如需可读金额，请填写代币精度。"`             |
| `network`       | 比特币网络 / Bitcoin network                                                                                                                                                                                                                                                                                                                                                                                                  | Condicional: rótulo da rede Bitcoin, sem mudar opções                                                                               | `"Bitcoin 网络"`                               |
| `history`       | 处理步骤 / Processing steps                                                                                                                                                                                                                                                                                                                                                                                                   | Condicional: título e nome acessível da área de etapas                                                                              | `"处理历史"`                                   |
| `back`          | 从这一步继续 / Continue from this step                                                                                                                                                                                                                                                                                                                                                                                        | Condicional: continuar do histórico, reaplica a saída e volta à tarefa de texto                                                     | `"继续处理此结果"`                             |
| `export`        | 导出步骤 / Export steps                                                                                                                                                                                                                                                                                                                                                                                                       | Condicional: botão para exportar etapas em JSON, não captura de tela                                                                | `"导出 JSON"`                                  |
| `limits`        | 最多 10 步，输入上限 16,384 字符，不自动请求网络。 / Up to 10 steps. Input: 16,384 characters. No automatic network requests.                                                                                                                                                                                                                                                                                                 | Condicional: instrução dos limites, sem alterar valores                                                                             | `"最多 10 步，输入不超过 16,384 字符。"`       |
| `callNotice`    | 按所选 ERC-20／TRC-20 规则解释，未验证合约身份或执行结果；可读金额取决于提供的精度。 / Interpreted using the selected ERC-20/TRC-20 schema. Contract identity and execution are not verified; amounts require supplied decimals.                                                                                                                                                                                              | Condicional: aviso e instruções do modo chamada, explicando limites                                                                 | `"解析不代表链上验证。"`                       |
| `addressNotice` | 格式检查不代表地址归属、账户存在或可信；EVM／TRON 地址无法标识具体网络。 / Format checks do not prove ownership, account existence or trust. EVM/TRON addresses do not identify a specific network.                                                                                                                                                                                                                           | Condicional: aviso de limites do modo endereço e instruções                                                                         | `"格式正确不代表地址可信。"`                   |
| `unsupported`   | 不支持此调用，仅支持 transfer、approve 和 transferFrom。 / Unsupported call. Only transfer, approve and transferFrom are supported.                                                                                                                                                                                                                                                                                           | Condicional: erro de ecossistema ou método de chamada não suportado                                                                 | `"仅支持 transfer、approve 和 transferFrom。"` |
| `checksum`      | 地址校验和错误。 / Invalid address checksum.                                                                                                                                                                                                                                                                                                                                                                                  | Condicional: erro de checksum                                                                                                       | `"地址校验和无效。"`                           |
| `length`        | 参数长度不正确。 / Incorrect argument length.                                                                                                                                                                                                                                                                                                                                                                                 | Condicional: erro de tamanho de argumentos ABI                                                                                      | `"调用参数长度不符。"`                         |
| `wrongNetwork`  | 地址与所选比特币网络不匹配。 / Address does not match the selected Bitcoin network.                                                                                                                                                                                                                                                                                                                                           | Condicional: endereço Bitcoin incompatível com a rede escolhida                                                                     | `"地址与当前 Bitcoin 网络不符。"`              |
| `stepLimit`     | 最多保留 10 步，请清空历史后重新开始。 / Maximum 10 steps. Clear the input history to start again.                                                                                                                                                                                                                                                                                                                            | Condicional: erro ao atingir etapas; texto não amplia o limite                                                                      | `"步骤已满，请清空后重试。"`                   |
| `budget`        | 历史记录达到内存限制，请清空。 / History memory limit reached. Clear the history.                                                                                                                                                                                                                                                                                                                                             | Condicional: erro de orçamento de memória do histórico de entradas/saídas                                                           | `"历史内容过多，请清空。"`                     |
| `addressParse`  | 解析地址编码 / Parse address encoding                                                                                                                                                                                                                                                                                                                                                                                         | Condicional: subetapa de histórico para analisar codificação do endereço                                                            | `"解析地址"`                                   |
| `addressCheck`  | 检查格式与校验和 / Check format and checksum                                                                                                                                                                                                                                                                                                                                                                                  | Condicional: subetapa de formato e checksum                                                                                         | `"检查格式"`                                   |
| `addressResult` | 展示地址表示 / Show address representation                                                                                                                                                                                                                                                                                                                                                                                    | Condicional: subetapa de representação de endereço em endereços ou chamadas                                                         | `"展示地址结果"`                               |
| `callParse`     | 解析方法选择器与 ABI 参数 / Parse selector and ABI arguments                                                                                                                                                                                                                                                                                                                                                                  | Condicional: subetapa de seletor e argumentos de chamada                                                                            | `"解析调用参数"`                               |
| `rawOnly`       | 保留原始整数，尚未提供精度 / Keep raw integer; decimals not supplied                                                                                                                                                                                                                                                                                                                                                          | Condicional: subetapa de chamada sem precisão informada                                                                             | `"保留原始整数"`                               |
| `amountResult`  | 使用提供的精度转换金额 / Format amount using supplied decimals                                                                                                                                                                                                                                                                                                                                                                | Condicional: subetapa após informar precisão                                                                                        | `"按精度显示金额"`                             |
| `inputHint`     | 选择任务并粘贴原始数据后解码；代币调用需要 calldata，不是交易哈希。 / Choose a task, paste the source data, then decode. Token calls require calldata, not a transaction hash.                                                                                                                                                                                                                                                | Condicional: instruções da página independente; exige calldata, não hash de transação                                               | `"粘贴 calldata 后解析。"`                     |
| `loadFailed`    | 解码模块加载失败，请刷新页面后重试。 / Decoder module could not load. Refresh the page and try again.                                                                                                                                                                                                                                                                                                                         | Condicional: falha de carregamento dinâmico do módulo criptográfico da página, não erro de rede universal                           | `"解析模块加载失败，请刷新重试。"`             |

O título do documento concatena Decoder Lab | Base64 · JWT · e callTask. Não existe decoderPage.title separado; fullTool não substitui Decoder Lab fixo. Nem toda marca, rede ou formato é configurável, e textos não acrescentam tarefas.

<a id="readings"></a>

## messages.decoderPage.readings: área de leitura

O prefixo continua `i18n.locales.<语言>.messages.decoderPage`. `readings` é objeto opcional, não definido nos textos padrão; o componente fornece texto e 16 cards conforme o idioma. Idiomas desconhecidos pelo componente usam inglês. É um padrão próprio da leitura, não um título idêntico em todos os idiomas.

| Campo            | Tipo / padrão                                                                             | Estado, efeito e limites                                                                                                                                                         | Exemplo                                                          |
| ---------------- | ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| readings.tribute | string, opcional / homenagem integrada do idioma; textos chinês e inglês completos abaixo | Condicional: homenagem ao fim da página; vazio oculta o parágrafo, não os cards. Texto simples, com destaque automático de algumas palavras cypherpunk, sem HTML da configuração | '感谢这些思想与工具的作者。'                                     |
| readings.links   | DecoderReading[], opcional / 16 itens integrados abaixo                                   | Condicional: substitui todos os cards na ordem do array, sem mesclar ou limite público. [] oculta cards sem ocultar homenagem                                                    | [{ title: '我的文章', href: '/zh/blog/welcome-to-anglefeint/' }] |

Cada item de readings.links tem cinco campos. “Nenhum” indica ausência de valor automático em itens personalizados, não ausência nos cards integrados.

| Campo, caminho relativo completo | Tipo / padrão                   | Estado, efeito e limites                                                                                                                                                          | Exemplo                           |
| -------------------------------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| readings.links[].title           | string, obrigatório / nenhum    | Condicional: título; vazio ou só espaços remove o card inteiro. Sem Markdown/HTML                                                                                                 | '我的文章'                        |
| readings.links[].href            | string, obrigatório / nenhum    | Condicional: destino do card. Só HTTP(S):// ou um único / inicial. Filtra protocolo relativo //, mailto, âncoras e caminhos relativos comuns. Só verifica prefixo, não existência | '/zh/blog/welcome-to-anglefeint/' |
| readings.links[].author          | string, opcional / não definido | Condicional: autor unido ao ano por ponto médio. Vazio não aparece; não usa site.author automaticamente                                                                           | '作者名'                          |
| readings.links[].year            | string, opcional / não definido | Condicional: ano ou nota textual; não vira data nem altera ordem. Use string, não número                                                                                          | '2026'                            |
| readings.links[].cover           | string, opcional / não definido | Condicional: identificador integrado, HTTP(S):// ou caminho de imagem com um único / inicial. Vazio, desconhecido ou incompatível omite capa, sem remover card                    | 'privacy-code'                    |

Cards abrem nova aba com noopener noreferrer. Caminhos raiz internos recebem BASE_URL do Astro; não duplique o prefixo. href e cover personalizado não recebem trim; evite espaços nas extremidades.

Há dezesseis identificadores de capa integrados:

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

public/images/decoder/my-cover.webp corresponde a /images/decoder/my-cover.webp, sem public ou caminho de fonte src/assets. Capas são cortadas em 16:9. Integradas têm tamanhos responsivos; caminhos personalizados e remotos usam img diretamente e não entram automaticamente na geração de múltiplos tamanhos de capas do blog. Prepare dimensões adequadas. Falhas não trocam automaticamente por capa integrada. Sem capa ainda há card textual.

Para ocultar só a leitura e manter a ferramenta:

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

### Homenagem e cards padrão

Homenagem padrão em chinês simplificado: 谨此致敬密码朋克与数字自由的先行者：他们以思想和代码，推动加密通信、个人隐私与自由，以及数字货币的发展。

Homenagem padrão em inglês: In tribute to the cypherpunks and pioneers of digital freedom, whose ideas and code advanced private communication, individual liberty and digital money.

Todos os cards seguem na ordem real. Autor ou ano em branco significa não definido. URLs externas padrão incluem parâmetros de origem fornecidos com o tema; eles não são acrescentados aos href personalizados.

| Identificador da capa             | Título em chinês simplificado / inglês                                                          | Autor                 | Ano  | href                                                                                                                                                                                                           |
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

## Exemplo para mesclar

Mescle ao `defineThemeConfig({...})` existente em `src/site.config.ts`; preserve import, export e configurações pessoais, sem duplicar theme ou i18n. O exemplo altera só chinês; outros idiomas usam configurações e fallback próprios. Veja o [tutorial multilíngue](/pt-br/blog/starter-guide-languages/).

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

## Capacidades e limites não configuráveis em site.config

- **Texto:** Base64/Base64URL, URL, Hex, entidades HTML, escapes Unicode e JWT fixos. Identificação automática aceita um único candidato; múltiplos exigem escolha manual. Cada envio processa uma camada, sem decodificação recursiva automática. JWT apenas analisa, sem verificar assinatura. A saída é texto e não executa HTML/scripts decodificados.
- **Entrada e histórico:** até 16.384 unidades UTF-16 JavaScript, com 128 para endereços. A página completa mantém até 10 etapas e 262.144 unidades acumuladas entre entradas e saídas. Continuar uma etapa ou reutilizar resultado forma uma cadeia; novo envio comum limpa a anterior. Exporta as etapas atuais em decoder-results.json. O orçamento não significa “imagem de 262 KB”. Alterar limits, tooLong ou stepLimit não muda limites.
- **Chamadas e endereços:** transfer, approve e transferFrom em EVM/HyperEVM/TRON; Bitcoin não tem chamadas de token. Precisão vem do leitor, vazia por padrão para preservar o inteiro. Aceita string canônica de inteiro 0–255, sem opção para predefinir precisão. Inspeção de endereços cobre formatos/checksums implementados de EVM/HyperEVM, TRON e Bitcoin, sem comprovar titularidade, saldo ou confiança.
- **Rede e privacidade:** decodificação não solicita RPC nem envia entradas. Módulos, estilos, imagens e estatísticas do site ainda podem usar rede. “Processamento local” não garante página inteira offline. Cópia depende do clipboard do navegador; exportações incluem entrada original e saída das etapas atuais.
- **Interface padrão:** começa em tarefa de texto e identificação automática; ecossistema EVM e rede Bitcoin Mainnet. Sem defaultTask, defaultFormat, maxSteps, RPC URL, lista de redes, exemplos personalizados ou controle de fundo públicos. Redução de movimento segue o sistema.

Todos os campos Decoder deste dicionário são consumidos. Não há configuração adicional de compatibilidade a preencher. Os campos antigos não usados do About foram distinguidos acima. Textos são apresentação, não parâmetros algorítmicos. Volte ao [índice de configuração](/pt-br/blog/config-reference/).
