---
title: Design visual por rota
subtitle: Cada etapa da leitura tem sua atmosfera.
description: Cada etapa da leitura tem sua atmosfera.
pubDate: '2026-03-03'
heroImage: ../../../assets/blog/default-covers/cyber-02.webp
aiModel: anglefeint-core
aiMode: analysis
aiState: stable
updatedDate: '2026-11-14'
---

Cada página atende a uma tarefa diferente:

- Início: Matrix para a primeira impressão.
- Blog List e tags: Cyberpunk para descobrir conteúdo.
- Artigos: AI para leitura longa.
- About: Hacker para o autor e as ferramentas.
- Fragments: navegação Cyberpunk.
- Decoder Lab: ferramentas locais com fundo de rede.

Por padrão, o início tem prefixo de idioma e `/` leva ao início do idioma padrão, inicialmente `/en/`. `defaultLocalePrefix: 'never'` altera somente esse início; outras rotas mantêm seus prefixos.

About, Decoder, tags e Fragments têm controles independentes. Fragments vem desativado. O dicionário explica os campos.

Continue lendo: [Arquitetura do Anglefeint: quatro camadas para manutenção e reutilização](/pt-br/blog/architecture-of-anglefeint/) · [Referência de configuração: idiomas, endereços e fallback](/pt-br/blog/config-languages/)
