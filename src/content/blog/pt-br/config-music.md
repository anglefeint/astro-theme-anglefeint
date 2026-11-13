---
tags: ['anglefeint', 'config']
title: 'Referência de configuração: player de música'
subtitle: 'Playlist, carregamento e textos do player'
description: 'Tipos, padrões, limites de URLs, textos acessíveis e comportamento do player de música.'
pubDate: '2026-11-13'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

Para adicionar sua primeira música, leia o [tutorial de música](/pt-br/blog/starter-guide-3-comments-about-and-theme-toggles/). Veja o arquivo em [instalação e informações do site](/pt-br/blog/starter-guide-1-configure-your-site/) e os outros módulos no [índice de configuração](/pt-br/blog/config-reference/).

As opções ficam em `theme.music` de `src/site.config.ts`. O player vem desativado, com playlist vazia e sem músicas padrão. Os padrões abaixo são do pacote, não da playlist pessoal do demo.

<a id="enabled"></a>

## theme.music.enabled: ativar o player

- **Tipo / padrão:** boolean / false.
- **Estado e efeito:** ativo. O framework das páginas padrão só renderiza o player quando true e a playlist tem ao menos uma faixa válida.
- **Limites:** true sem faixas não mostra o player. Desativado, as faixas não entram na playlist efetiva e a validação individual é pulada. Não apaga configurações ou áudio de public, nem impede acesso direto a arquivos públicos.
- **Exemplo:** `theme: { music: { enabled: false } }`.

É uma configuração global, não um controle por página inicial ou idioma. Páginas padrão com o framework público compartilham a playlist; não toca só na página inicial. Páginas personalizadas decidem se usam esse framework.

<a id="tracks"></a>

## theme.music.tracks: lista de faixas

- **Tipo / padrão:** MusicTrack[] / []. Os três campos por item estão abaixo.
- **Estado e efeito:** condicional à música ativa. Exibe e troca faixas na ordem do array, sem limite público de quantidade.
- **Limites:** precisa ser array quando ativo. Array vazio é válido, mas desativa o estado efetivo do player. Substituir o array troca tudo, sem mesclar padrões ou playlist anterior. Preserve os itens desejados ao acrescentar músicas.
- **Exemplo:** [{ title: 'Uma música minha', artist: 'Autor', src: '`/music/my-song.mp3`' }].

Títulos, artistas e URLs pertencem a este array global, não aos textos i18n. Trocar o idioma não troca a playlist. Não use objetos de playlist de plataformas nem links de compartilhamento como se fossem esse array.

<a id="track-fields"></a>

### Campos de cada faixa

Prefixo completo: `theme.music.tracks[]`. “Nenhum” significa que itens personalizados não recebem preenchimento automático.

| Campo  | Tipo / padrão                                        | Estado, efeito e limites                                                                                                                                                                         | Exemplo              |
| ------ | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------- |
| title  | string, obrigatório / nenhum                         | Condicional: nome na área principal, no título recolhido e na playlist. String não vazia, com espaços nas extremidades removidos. Título em branco gera erro; não deriva do arquivo ou metadados | 'Uma música minha'   |
| artist | string, opcional / não definido; normalizado para '' | Condicional: artista na área principal e na playlist. Precisa ser string quando informado, com trim. Vazio não usa o autor do site nem metadados do áudio                                        | 'Autor'              |
| src    | string, obrigatório / nenhum                         | Condicional: fonte de áudio. Começa com um único / ou https:// minúsculo, sem espaços ou barras invertidas. HTTPS também precisa ser uma URL válida; não verifica existência ou formato de áudio | '/music/my-song.mp3' |

title e artist são texto simples, sem Markdown ou HTML. Não existem campos públicos de capa, letra, duração, álbum, ID independente ou volume por faixa.

Distinga os limites de src:

- Para arquivos locais, prefira `public/music/` e /music/nome-do-arquivo na configuração, sem public, caminho de disco Windows ou fonte src/assets. Outros caminhos raiz válidos são aceitos; não exige /music/ nem verifica áudio pela extensão.
- Não aceita http://, //example.com/file.mp3, data:, blob: ou caminhos relativos comuns. O prefixo HTTPS distingue maiúsculas; use https:// minúsculo.
- URLs não podem conter espaços literais. Codifique o caminho se necessário, mas codificação correta não comprova a existência no servidor. Não acrescente espaços nas extremidades.
- Caminhos raiz recebem BASE_URL do Astro na renderização; não duplique o prefixo em subcaminhos de implantação. URLs HTTPS não mudam.
- Formato correto significa apenas configuração válida. O arquivo deve ser acessível e compatível com o navegador. Página de compartilhamento não é URL direta de áudio. Fontes externas são baixadas por fetch e devem permitir CORS para seu site; tocar numa nova aba não comprova permissão CORS.

O player usa src para restaurar a faixa salva. Prefira URLs distintas. Duplicatas não são proibidas, mas a restauração escolhe a primeira correspondência. O título não é a identidade de restauração.

<a id="example"></a>

## Exemplo de playlist para mesclar

Prepare `public/music/my-song.mp3` por conta própria. O caminho é ilustrativo; o tema não gera o áudio. Mescle no `defineThemeConfig({...})` existente em `src/site.config.ts`, preservando import, export e configurações pessoais, sem duplicar theme.

```ts
theme: {
  music: {
    enabled: true,
    tracks: [
      {
        title: 'Uma música minha',
        artist: 'Autor',
        src: '/music/my-song.mp3',
      },
    ],
  },
},
```

Para desativar, use `enabled: false`, sem esvaziar a playlist. O servidor dev precisa reler a configuração; produção exige nova compilação e implantação. Apenas enviar áudio sem registrar tracks não o acrescenta automaticamente.

<a id="music-messages"></a>

## messages.music: dezenove textos de interface e acessibilidade

Prefixo completo: `i18n.locales.<locale>.messages.music.`. Cada item é uma **string** opcional, com padrões integrados do idioma atual e fallback. A tabela mostra apenas padrões em chinês simplificado / inglês; os exemplos são valores de campo. Aplicam-se quando o player e o controle ou estado correspondente existem. String vazia substitui o texto, não oculta a função e pode remover um nome acessível claro.

| Campo      | Padrão em chinês simplificado / inglês                                                                          | Efeito e limites                                                                        | Exemplo                                                  |
| ---------- | --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `label`    | 音乐播放器 / Music player                                                                                       | Nome acessível do aside do player; não é o texto superior AUDIO CHANNEL                 | `"Reprodutor de música"`                                 |
| `play`     | 播放 / Play                                                                                                     | Nome acessível do botão; o texto visível continua PLAY                                  | `"Reproduzir"`                                           |
| `pause`    | 暂停 / Pause                                                                                                    | Nome acessível ao reproduzir ou carregar; texto visível PAUSE                           | `"Pausar"`                                               |
| `prev`     | 上一首 / Previous                                                                                               | Nome acessível do botão anterior; texto visível PREV                                    | `"Faixa anterior"`                                       |
| `next`     | 下一首 / Next                                                                                                   | Nome acessível do botão seguinte; texto visível NEXT                                    | `"Próxima faixa"`                                        |
| `open`     | 展开播放器 / Open player                                                                                        | Nome acessível do botão de abrir quando recolhido; texto visível OPEN                   | `"Abrir reprodutor"`                                     |
| `close`    | 收起播放器 / Collapse player                                                                                    | Nome acessível do botão de recolher; texto visível MIN. Recolher não pausa              | `"Recolher reprodutor"`                                  |
| `progress` | 播放进度 / Progress                                                                                             | Nome acessível do controle de progresso; não altera a posição nem o intervalo navegável | `"Progresso da reprodução"`                              |
| `volume`   | 音量 / Volume                                                                                                   | Nome acessível do volume, sem definir volume padrão; rótulo visível LVL                 | `"Volume"`                                               |
| `queue`    | 歌单 / Playlist                                                                                                 | Nome acessível do botão da playlist; QUEUE e SHOW / HIDE são fixos                      | `"Abrir ou recolher lista de músicas"`                   |
| `mute`     | 静音 / Mute                                                                                                     | Nome acessível para silenciar; texto visível MUTE                                       | `"Silenciar"`                                            |
| `unmute`   | 取消静音 / Unmute                                                                                               | Nome acessível para restaurar o volume quando zero; texto visível UNMUTE                | `"Ativar som"`                                           |
| `idle`     | 就绪 / Ready                                                                                                    | Texto SIGNAL inicial ou após trocar de faixa                                            | `"Aguardando reprodução"`                                |
| `loading`  | 加载中 / Loading                                                                                                | Texto SIGNAL ao baixar ou aguardar a reprodução                                         | `"Carregando música"`                                    |
| `playing`  | 播放中 / Playing                                                                                                | Texto SIGNAL durante a reprodução                                                       | `"Reproduzindo"`                                         |
| `paused`   | 已暂停 / Paused                                                                                                 | Texto SIGNAL em pausa                                                                   | `"Pausado"`                                              |
| `blocked`  | 浏览器阻止了自动播放，请点击 PLAY 继续播放。 / Click Play to continue. Your browser blocked automatic playback. | Aviso de permissão de reprodução negada; alterar o texto não remove a restrição         | `"Clique em reproduzir para continuar."`                 |
| `error`    | 播放失败，请重试或切换歌曲。 / Unable to play. Try again or select another track.                               | Estado de falha de solicitação/reprodução ou de montagem do módulo do player            | `"Não foi possível carregar a música; tente novamente."` |
| `noScript` | 请启用 JavaScript 使用播放器。 / Enable JavaScript to use the player.                                           | Aviso noscript quando JavaScript está desativado, sem controle nativo alternativo       | `"Ative JavaScript para usar o reprodutor."`             |

Não é uma tabela para substituir todo texto visível do terminal. PLAY / PAUSE, PREV / NEXT, OPEN / MIN, MUTE / UNMUTE, QUEUE, SHOW / HIDE, TRACKS, LVL, AUDIO CHANNEL, STATE, SIGNAL e STANDBY são fixos na implementação. Campos configuráveis fornecem nomes acessíveis ou estados visíveis na linha SIGNAL. Um botão continuar em inglês não significa que o campo não foi aplicado.

Por exemplo, substitua só os avisos de carregamento e erro em português brasileiro:

```ts
i18n: {
  locales: {
    'pt-br': {
      messages: {
        music: {
          loading: 'Carregando música',
          error: 'Não foi possível carregar a música; tente novamente.',
        },
      },
    },
  },
},
```

Veja ativação e fallback no [tutorial de idiomas](/pt-br/blog/starter-guide-languages/). Os textos seguem o idioma; as faixas continuam globais.

<a id="loading"></a>

## Quando o áudio é baixado e por que há espera?

No primeiro uso, sem estado salvo de continuação, inicializar a interface não baixa áudio. Reproduzir, anterior, próxima ou selecionar uma faixa solicita apenas o áudio escolhido. Abrir painel ou playlist não baixa a lista inteira. Restaurar reprodução na mesma aba também pode solicitar automaticamente a faixa selecionada.

O player baixa o áudio inteiro, converte para Blob e só então entrega a Audio. Não é streaming com reprodução parcial. Assim, mesmo quando o servidor ignora Range, o conteúdo baixado permite mudar a posição. Arquivos grandes aumentam espera e memória. O tema não transcodifica, comprime nem gera taxas de bits alternativas.

Pausar e reproduzir reutiliza o áudio e Blob atuais. Mudar de faixa cancela downloads pendentes e libera recursos antigos; voltar pode solicitar de novo. Cache HTTP do navegador e servidor é uma camada separada, não um cache permanente de todas as músicas no player. Falhas não pulam automaticamente a faixa; clique em reproduzir para tentar outra vez. Permissão negada mostra blocked e exige ação do usuário.

Fontes externas precisam permitir CORS e retornar sucesso. Não há opção de proxy, cabeçalhos de autorização ou credenciais personalizadas. Áudio em public no mesmo site não precisa de CORS extra. Mudar mensagens não corrige caminhos, permissões ou formatos.

<a id="runtime-state"></a>

## Reprodução, retomada e aparência: comportamentos fixos e limites

| Item                     | Comportamento atual                                                                                                                                                         | Campo de site.config?                           |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| Faixa padrão             | Seleciona a primeira faixa se não houver faixa salva correspondente; compara src resolvido                                                                                  | Não; sem defaultTrack                           |
| Volume padrão            | Primeiro uso: 0.5; depois pode restaurar o volume salvo na mesma aba                                                                                                        | Não; sem defaultVolume                          |
| Silenciar                | Define volume zero; restaura o volume não zero lembrado. Não interrompe download nem pausa                                                                                  | Não; sem configuração mute independente         |
| Próxima faixa automática | Ao terminar, segue para a próxima e volta à primeira após a última; sem aleatoriedade                                                                                       | Não; sem shuffle / repeat / loop                |
| Retomar reprodução       | sessionStorage salva URL, posição, volume, recolhimento e intenção de retomar. Tenta retomar na navegação da mesma aba ou restauração, sujeito às permissões                | Não; sem autoplay / resume                      |
| Estado inicial do painel | Componente padrão recolhido; o parâmetro inicial tem prioridade sobre preferências salvas. A restauração BFCache tem lógica própria                                         | Não; sem theme.music.collapsed                  |
| Painel e playlist        | Só alteram a interface, sem pausar. Escape recolhe o painel aberto                                                                                                          | Não; sem campo para mudar atalhos               |
| Estilo da página         | O framework escolhe Matrix / Cyber / Hacker / AI ou base pela página atual, não pelo gênero musical                                                                         | Não; sem theme.music.scene                      |
| Animação                 | Matrix usa efeitos próprios conforme reprodução, visibilidade da página e recolhimento, respeitando redução de movimento do sistema. Falhas visuais não devem impedir áudio | Não; sem controle exclusivo de efeitos musicais |

sessionStorage guarda estado de sessão, sem registro permanente na nuvem ou sincronização entre abas. Restrições de armazenamento não impedem o player, mas a restauração não é garantida. Não há garantia de reprodução contínua e sem interrupções entre páginas. Sem JavaScript, aparece noScript e os controles não funcionam.

Parâmetros de componentes e layouts como `initiallyCollapsed`, `musicInitiallyCollapsed` e `scene` não são campos públicos de site.config. Adicioná-los a `theme.music` não os ativa. Páginas padrão começam recolhidas e o usuário pode expandir. Títulos e faixas não mudam automaticamente a atmosfera.

Os dois campos de música, três campos de faixa e dezenove textos são consumidos atualmente. Não há campos adicionais de compatibilidade ou desativados a preencher. As diferenças entre acessibilidade, inglês fixo e estado de sessão estão acima. Volte ao [índice de configuração](/pt-br/blog/config-reference/) para outros módulos.
