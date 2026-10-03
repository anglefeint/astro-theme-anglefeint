---
title: Design visual por rota
subtitle: Cada etapa da leitura tem sua atmosfera.
description: Cada etapa da leitura tem sua atmosfera.
pubDate: '2026-03-03'
updatedDate: '2026-10-03'
heroImage: ../../../assets/blog/default-covers/cyber-02.webp
aiModel: anglefeint-core
aiMode: analysis
aiState: stable
aiLatencyMs: 171
aiConfidence: 0.95
---

Anglefeint distribui atmosferas por rota:

- `/<locale>/`: início Matrix.
- `/<locale>/blog/`: arquivo Cyberpunk.
- `/<locale>/blog/<slug>/`: leitura em interface de IA.
- `/<locale>/about/`: perfil hacker.

defaultLocalePrefix: 'always' redireciona / para a página inicial padrão, inicialmente /en/. Com 'never', só essa página passa a /. Artigos e Sobre mantêm prefixo. About depende de theme.enableAboutPage; páginas de tags usam Cyberpunk quando ativadas.

O fundo apoia a leitura. O início estabelece identidade, a lista convida à exploração, o artigo destaca o texto e Sobre fornece contexto. Assim, a personalidade visual convive com uma hierarquia clara.
