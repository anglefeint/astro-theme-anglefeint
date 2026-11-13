---
tags: ['anglefeint', 'config']
title: 'Referência de configuração: avisos do terminal e leitor somente leitura'
subtitle: 'Os dezesseis textos do terminal virtual de About, seus marcadores e limites de configuração.'
description: 'Tipos, padrões reais, marcadores, fallback de valores vazios e estado dos textos do terminal, incluindo readerTitle sem uso atual.'
pubDate: '2026-11-13'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/hacker-01.webp'
---

Veja o arquivo de configuração em [instalação e informações do site](/pt-br/blog/starter-guide-1-configure-your-site/), os textos e ferramentas na [referência de About](/pt-br/blog/config-about/) e outros módulos no [índice geral](/pt-br/blog/config-reference/).

Nas páginas padrão, About contém o terminal virtual interativo. Estes campos alteram avisos, erros e nomes acessíveis do leitor somente leitura; não executam shell local nem do servidor. O terminal largo da página inicial usa messages.home.transmission, na [referência inicial](/pt-br/blog/config-home/#home-transmission), não este conjunto.

<a id="messages"></a>

## Os dezesseis campos de messages.terminal

O prefixo completo é `i18n.locales.<语言>.messages.terminal`. Todos são substituições string opcionais, usando as mensagens internas do idioma atual e seu fallback comum por padrão. A tabela mostra apenas os valores reais em chinês simplificado/inglês; exemplos representam o valor do campo. About precisa estar habilitado, o terminal deve inicializar e o comando ou modo correspondente precisa ser acionado.

| Campo           | Padrão em chinês simplificado / inglês                                                                                              | Estado, efeito e limites                                                                                                     | Valor de exemplo                       |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `commandInput`  | 终端命令 / Terminal command                                                                                                         | Condicional: nome acessível da entrada, sem alterar o caminho do prompt nem o título visível.                                | `"终端输入"`                           |
| `hint`          | 输入 help 开始探索。Tab 补全唯一路径，↑/↓ 查看历史命令。 / Type help to explore. Tab completes a unique path; ↑/↓ recalls commands. | Condicional: aviso inicial de About; a inicialização também executa pwd virtual. Vazio limpa o aviso, sem fechar o terminal. | `"输入 help 查看命令。"`               |
| `help`          | 只读虚拟文件，不会在服务器执行命令。 / Read-only virtual files. No commands run on a server.                                        | Condicional: explicação exibida por help, seguida da ajuda fixa de comandos. Vazio não oculta toda a lista.                  | `"只读浏览公开文章，不运行系统命令。"` |
| `syntax`        | 引号或转义未结束。 / Unclosed quote or escape.                                                                                      | Condicional: aspas ou escape não concluídos. Vazio usa a chave syntax.                                                       | `"引号或转义未结束。"`                 |
| `usage`         | 用法：{value} / Usage: {value}                                                                                                      | Condicional: quantidade incorreta de argumentos; {value} recebe o uso do comando. Vazio usa a chave usage.                   | `"用法：{value}"`                      |
| `unknown`       | 不支持此命令：{value} / Command not supported: {value}                                                                              | Condicional: comando não suportado; {value} é seu nome. Trocar o texto não adiciona comandos.                                | `"不支持命令：{value}"`                |
| `notFound`      | 文件或目录不存在：{value} / No such file or directory: {value}                                                                      | Condicional: arquivo/diretório virtual ausente; {value} é o caminho, não um status HTTP remoto.                              | `"未找到：{value}"`                    |
| `notDirectory`  | 不是目录：{value} / Not a directory: {value}                                                                                        | Condicional: destino de cd não é diretório; {value} é o caminho.                                                             | `"不是目录：{value}"`                  |
| `isDirectory`   | 这是目录：{value} / Is a directory: {value}                                                                                         | Condicional: destino de cat/vi/vim/view não é arquivo; {value} é o caminho.                                                  | `"目标不是文件：{value}"`              |
| `failed`        | 无法读取：{value} / Unable to read: {value}                                                                                         | Condicional: falha genérica de leitura; {value} é o caminho, sem anexar detalhes brutos do erro.                             | `"读取失败：{value}"`                  |
| `tooLarge`      | 文件超过阅读大小限制：{value} / File exceeds the reading limit: {value}                                                             | Condicional: arquivo excede o limite de leitura; {value} é o caminho. Muda só a mensagem, não o limite.                      | `"文件过大：{value}"`                  |
| `empty`         | （空目录） / (empty directory)                                                                                                      | Condicional: ls sem entradas; não é uma mensagem para conteúdo vazio de um arquivo.                                          | `"目录为空。"`                         |
| `loading`       | 正在读取… / Loading…                                                                                                                | Condicional: aviso na posição de entrada do Canvas enquanto um comando aguarda. Vazio usa ..., sem mudar o carregamento.     | `"正在读取…"`                          |
| `readerTitle`   | 文章阅读器 / Article reader                                                                                                         | Sem uso atual: tipo e texto interno permanecem, mas o leitor usa title ou path do arquivo. Não muda seu título.              | `"文章阅读器"`                         |
| `readerHint`    | 只读 · 输入 :q 并回车退出 · Esc 关闭 / Read only · :q + Enter to exit · Esc to close                                                | Condicional: instrução do leitor somente leitura; vazio usa :q. O texto não altera atalhos nem comandos de saída.            | `"只读 · :q 回车退出 · Esc 关闭"`      |
| `readerCommand` | 阅读器命令 / Reader command                                                                                                         | Condicional: nome acessível da entrada do leitor; vazio usa o nome da entrada original do terminal.                          | `"阅读器命令输入"`                     |

<a id="placeholders"></a>

## O marcador {value} e strings vazias

usage, unknown, notFound, notDirectory, isDirectory, failed e tooLarge usam o marcador literal {value}. O script substitui apenas a primeira ocorrência. Preserve uma ocorrência para mostrar comando ou caminho; {path}, {command} e outros nomes não são suportados. O valor é mostrado como texto, sem execução.

Não existe uma regra única de “string vazia desliga o recurso”. Os erros acima e syntax usam o nome da chave quando vazios; loading usa ..., readerHint usa :q e readerCommand usa o nome acessível da entrada original. hint, help e empty podem limpar seu texto sem remover o terminal, a ajuda fixa ou o diretório.

readerTitle não é usado atualmente. Mesmo com uma string padrão no pacote de idioma, não controla o título exibido no leitor.

<a id="example"></a>

## Exemplo mesclável em chinês simplificado

Mescle no defineThemeConfig({...}) existente em src/site.config.ts. Preserve outras opções e não crie outro i18n. Alterar apenas chinês não muda os demais idiomas; veja [fallback de idiomas](/pt-br/blog/config-languages/#fallback).

```ts
i18n: {
  locales: {
    zh: {
      messages: {
        terminal: {
          commandInput: '终端输入',
          hint: '输入 help 查看命令。',
          help: '只读浏览公开文章，不运行系统命令。',
          usage: '用法：{value}',
          notFound: '未找到：{value}',
          failed: '读取失败：{value}',
          tooLarge: '文件过大：{value}',
          readerHint: '只读 · :q 回车退出 · Esc 关闭',
          readerCommand: '阅读器命令输入',
        },
      },
    },
  },
},
```

<a id="shared-settings"></a>

## Que outras configurações o terminal usa?

| Configuração                            | Efeito no terminal                                                                                                        | Referência principal                                                   |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| theme.enableAboutPage                   | boolean, padrão true; desligar remove About padrão e, portanto, seu terminal.                                             | [Opção About](/pt-br/blog/config-about/#page-enabled)                  |
| `i18n.locales.<语言>.about.scriptsPath` | string, padrão /root/bash/scripts; prefixo virtual e diretório inicial, não um caminho de disco do servidor.              | [Ferramentas About](/pt-br/blog/config-about/#tool-fields)             |
| `i18n.locales.<语言>.about.sections`    | A apresentação pública participa do about.md virtual; não são mensagens de erro do terminal.                              | [Corpo de About](/pt-br/blog/config-about/#body-fields)                |
| Artigos do idioma atual                 | Entram automaticamente no diretório virtual; JSON de artigo é lido sob demanda, sem registrar cada artigo em site.config. | [Escrever artigos](/pt-br/blog/starter-guide-2-languages-and-routing/) |

sidebar.allScripts e modals.allScripts.title de About alteram só a entrada da ferramenta e o popup de diretório, sem renomear comandos. effects.backgroundLines não substitui o aviso inicial na sessão interativa atual; seu uso de fallback está em [efeitos de About](/pt-br/blog/config-about/#effect-fields).

<a id="limits"></a>

## Capacidades e limites fixos, não campos site.config

- Os comandos virtuais incluem help, clear, pwd, ls, cd, cat, vi, vim e view. About também conecta open, close, minimize, maximize e restore aos controles de janela. A implementação define a lista: alterar help ou unknown não adiciona comandos de sistema.
- vi/vim/view abre um leitor somente leitura, não um editor. Digite :q, :q! ou q e Enter para sair; Esc também fecha a leitura. readerHint só altera a instrução, não o comando ou os atalhos.
- A entrada aceita por padrão até 512 unidades de código JavaScript UTF-16; o histórico guarda até 50 comandos. Arquivos têm limite padrão de leitura de 262.144 unidades, excedido com aviso tooLarge. Há outra proteção para leitura de respostas de rede: não interprete esse número como tamanho de upload permitido.
- Artigos são lidos sob demanda em JSON de mesma origem. Não é um baixador de URLs arbitrárias nem leitor de diretórios locais. Arquivos virtuais de texto e diretórios podem funcionar sem solicitar rede.
- Tamanho, cores, fonte, limites de entrada, histórico e leitura são parâmetros internos de componentes ou funções, sem caminhos públicos site.config correspondentes. Não há API key configurada nem conexão SSH, shell real ou IA remota.

Recarregue a configuração de desenvolvimento depois de salvar e reconstrua/publique o site real. Para conferir textos, acione os comandos ou o modo de leitura, em vez de olhar só o título estático; readerTitle especialmente não muda a interface. Volte ao [índice geral](/pt-br/blog/config-reference/) para outros módulos.
