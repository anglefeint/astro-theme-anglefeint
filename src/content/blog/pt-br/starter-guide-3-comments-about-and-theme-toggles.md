---
tags:
  - anglefeint
  - starter
title: 'Guia 3: Recursos opcionais'
subtitle: 'Música, comentários, Sobre, paginação e opções visuais.'
description: 'Música, comentários, Sobre, paginação e opções visuais.'
pubDate: '2026-03-07'
updatedDate: '2026-11-12'
heroImage: ../../../assets/blog/default-covers/matrix-02.webp
---

## Conteúdo legível por IA

O build inclui artigos públicos, Fragments e About habilitados em `/llms.txt`, índices e textos completos por idioma. As URLs Markdown dos artigos não mudam. Cada idioma tem `/pt-br/fragments/index.md` e `/pt-br/about/index.md` (substitua o idioma). Fragments reúne todas as páginas públicas, preservando ID, data, corpo e links estáveis `/<locale>/fragments/#ID`. O HTML anuncia o Markdown. Disponível após `npm run build` e no preview; publique todo `dist/`.

About exporta a biografia pública, contatos e o painel de texto AI acessível; exclui configurações do terminal, ferramentas e decoração. Não exporta comentários. Páginas/idiomas desativados, conteúdo removido, noindex e canonical externos são excluídos; reconstruir limpa arquivos gerados e links obsoletos. Arquivos do usuário são protegidos e conflitos interrompem o build. Suplementos do site/idioma valem para todos os documentos. JSON-LD inclui o idioma; About usa AboutPage. Sem nova configuração, servidor ou biblioteca UI, nem garantia de indexação ou citação por IA.

## Música

Coloque o áudio em public/music/ e mescle:

```ts
theme: {
  music: { enabled: true, tracks: [{ title: 'My Song', src: '/music/my-song.mp3' }] },
},
```

Faixas aceitam title, src e artist opcional. Sem faixas, o player fica oculto. A primeira reprodução exige clique. A sessão guarda faixa, posição e volume; retomar depende das permissões do navegador, e pode haver uma pausa entre páginas. Ao terminar a última faixa, a primeira recomeça.

O arquivo completo é baixado antes de tocar; arquivos grandes aumentam espera e memória. Faixas externas exigem CORS. Prefira arquivos locais. enabled: false desativa o player.

## Comentários Giscus

[Guia de comentários](/pt-br/blog/starter-guide-4-giscus-comments/)

## Página Sobre

Os parágrafos e a assinatura de Sobre preservam quebras de linha da configuração: `\n` inicia outra linha e `\n\n` deixa uma linha em branco. Frases longas continuam quebrando automaticamente. É texto simples, sem Markdown ou HTML; não insira `<br>`.

Edite i18n.locales['pt-br'].about: sections (who, what, ethos, now, contactLead, signature), contact (email, githubUrl, githubLabel), sidebar, labels, modals e effects. ethos é uma lista. Edite os demais idiomas separadamente. As ferramentas da página são demonstrações visuais, não serviços reais de IA. Um e-mail vazio oculta o link. theme.enableAboutPage: false remove página e navegação.

### Decoder Lab: uma homenagem aos cypherpunks

O visual do Decoder Lab se inspira no movimento **cypherpunk**, em homenagem às suas contribuições à liberdade humana, à privacidade e ao código aberto. A rede ponto a ponto e o processamento local refletem a ideia de manter ferramentas e dados nas mãos de cada pessoa.

Compartilhamos esta convicção: **privacidade e liberdade não podem depender apenas da boa vontade de quem detém o poder.** Cada pessoa deve poder proteger suas comunicações, escolher o que revelar e a quem, e verificar por conta própria quando possível, sem depositar toda a confiança em governos, plataformas ou outros terceiros.

**“Cypherpunks write code.”** Essa frase de [A Cypherpunk’s Manifesto](https://www.activism.net/cypherpunk/manifesto.html) expressa uma forma de agir: transformar ideais em software utilizável e publicar o código para que outras pessoas possam examiná-lo, usá-lo e desenvolvê-lo. Homenageamos esse compromisso com a autonomia individual por meio da tecnologia.

O Decoder Lab reflete esse espírito com processamento local, código-fonte que pode ser examinado e uma rede ponto a ponto como motivo visual.

A versão completa do **Decoder Lab** fica em `/<locale>/decoder/`: histórico local, interpretação ERC-20/TRC-20 (EVM/HyperEVM/TRON) e inspeção de endereços EVM/TRON/Bitcoin. Abra pelo diálogo do About. Use `theme.enableDecoderPage: false` em `src/site.config.ts` para desativar página e link independentemente do About. Sem RPC, conexão de carteira ou chave API.

## Contagens e recursos

```ts
theme: {
  homeLatestCount: 3, blogPageSize: 10,
  enableAboutPage: true, effects: { enableRedQueen: true },
  search: { enabled: true }, toc: { enabled: true }, tags: { enabled: true },
  socialImage: { enabled: true }, footer: { showCredits: true },
},
```

Use false para desativar um recurso. enableRedQueen controla somente o monitor do artigo. toc: true no artigo pode prevalecer sobre a configuração global. socialImage desativa geração, mas mantém ogImage manual. Os ambientes são definidos pelos layouts, não por um seletor global.

homeLatestCount controla recentes; blogPageSize controla listas e tags. pagination.windowSize varia de 5 a 21. A entrada de salto aparece quando jump.enabled é true e o total excede showJumpThreshold, inicialmente 12. jump.enterToGo controla Enter.

Os modos são `fixed`, `sequential` e `random`. Com JavaScript, o padrão `random` escolhe novamente as cores do contêiner e dos botões a cada carregamento; os resultados podem se repetir. Sem JavaScript, o HTML gerado mantém uma variante estável do contêiner e cores estáticas nos botões. `style.enabled: false` usa a variante básica sem desativar a paginação.

## Mais idiomas e endereço inicial

Adicione um código em i18n.locales com meta (label, hreflang, ogLocale, enabled, fallback), site.hero, messages e about. Depois crie artigos com --locales. fallback fornece textos de configuração ausentes; não traduz artigos nem mistura idiomas nas listas. O idioma padrão entra na cadeia de fallback quando necessário. Alterar label muda apenas o nome no menu.

defaultLocalePrefix: 'always' redireciona / para a página inicial localizada; 'never' faz o inverso para o idioma padrão. As rotas dos artigos continuam localizadas.

## Rodapé e verificação

footer.showCredits: false oculta os créditos do tema e do Astro, preservando o ano gerado e site.title. site.tagline adiciona texto independente. O antigo valor Built with Astro. é tratado como crédito interno para evitar duplicação.

Em `src/site.config.ts`, `theme.home.showInitialize` controla Initialize/done, `showFollow` controla Wake Up/Follow e `showTrace` controla o status inferior direito. Todos são `true` por padrão; `false` oculta cada parte separadamente.

A opção `theme.footer.links` adiciona uma linha independente ao rodapé: cada item contém `label` e `href`, com pontos entre os links. Omitir a opção ou usar um array vazio oculta a linha. Os rótulos mantêm o texto configurado em todos os idiomas; a linha é independente dos ícones sociais e de `showCredits`.

```ts
theme: {
  home: { showInitialize: true, showFollow: true, showTrace: true },
  footer: {
    links: [{ label: "Source", href: "https://github.com/your-name/your-repo" }],
  },
},
```

Os cartões automáticos usam um fundo incluído de chuva de código, terminais e redes de neon, com o nome do seu site, título e autor. O pequeno crédito `Theme by Anglefeint` no canto inferior direito segue `theme.footer.showCredits` (padrão `true`); `false` oculta os créditos do rodapé e da imagem. Compile e publique novamente após alterar. Arquivos `ogImage` personalizados não são modificados. O fundo funciona offline e não adiciona JavaScript ao navegador.

Mescle todas as opções no mesmo theme ou i18n. Listas substituem listas anteriores. Teste em desenvolvimento, execute npm run doctor e use npm run preview para conferir a busca. Reconstrua e publique para aplicar mudanças.

- [Guia 1: Configure seu blog](/pt-br/blog/starter-guide-1-configure-your-site/)
- [Guia 2: Escreva e organize conteúdo](/pt-br/blog/starter-guide-2-languages-and-routing/)
- [Guia 3: Recursos opcionais](/pt-br/blog/starter-guide-3-comments-about-and-theme-toggles/)

## Fórmulas matemáticas

Artigos Markdown e MDX aceitam matemática no estilo LaTeX globalmente por padrão. Use `$C_{saved}$` em linha ou uma fórmula entre linhas separadas com `$$`. Não é necessário configurar cada artigo nem instalar plugins adicionais.

```markdown
Inline: $C_{saved}$

$$
\frac{a}{b}
$$
```

Desative com `theme: { math: { enabled: false } }` em `src/site.config.ts`. Escape dólares ambíguos como `\$`; trechos de código permanecem literais. Ao desativar, voltam as regras normais de MDX, incluindo expressões JavaScript entre chaves.

A renderização ocorre na compilação, com estilos e fontes locais e MathML acessível, sem motor matemático no navegador. Fórmulas longas têm rolagem horizontal. Erros interrompem a compilação indicando origem e causa. Mantenha títulos e descrições em texto simples; fórmulas ficam fora da busca. O suporte é à sintaxe matemática do KaTeX, não a documentos LaTeX completos.

No starter integrado 0.27+, o pacote conecta automaticamente o processador Markdown e as fórmulas. Somente estruturas anteriores a 0.27 precisam da migração inicial; não copie implementações de processadores nem adapters para o projeto novo.

$C_{saved}$

$$
\frac{a}{b} = x_1 + x_2 + x_3 + x_4 + x_5 + x_6 + x_7 + x_8 + x_9 + x_{10}
$$

---

## Atualizar o tema

O pacote mantém páginas padrão, valores padrão, traduções e funções de build. Artigos, `src/site.config.ts`, músicas, imagens e páginas próprias ficam no projeto.

No novo starter de integração com npm, execute na raiz o comando abaixo. Ele verifica compatibilidade, faz backup dos arquivos de dependências, instala uma versão exata e executa doctor. Em caso de falha, restaura os arquivos e tenta reinstalar as dependências anteriores. Publique pelo fluxo habitual; não há deploy automático.

```bash
npx @anglefeint/astro-theme@latest upgrade
```

Projetos anteriores a 0.27 precisam migrar uma vez para um starter novo. Crie-o em outra pasta, copie artigos e recursos e combine os valores pessoais no novo site config. Não copie rotas padrão antigas, adapters ou helpers defaults/schema/runtime. Preserve slugs, caminhos de idiomas, URLs de músicas/imagens e configurações de hospedagem.

O atualizador automático suporta apenas npm e rejeita lockfiles pnpm/yarn/bun. `--check` verifica sem escrever; `--to 0.27.1` escolhe a versão. Veja o [guia](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md) e [GitHub Releases](https://github.com/anglefeint/astro-theme-anglefeint/releases).

Se a atualização falhar, não publique `dist/`: restaurar dependências não restaura o build anterior. Resolva o erro e execute `npm run doctor` com sucesso antes do deploy. Com pnpm, confira a compatibilidade e atualize manualmente com `pnpm add @anglefeint/astro-theme@latest` e `pnpm run doctor`, mantendo seu lockfile.
