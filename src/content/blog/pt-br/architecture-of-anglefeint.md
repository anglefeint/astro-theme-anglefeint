---
title: 'Arquitetura do Anglefeint: quatro camadas para manutenção e reutilização'
subtitle: ThemeFrame → Shell → Layout → Page
description: ThemeFrame → Shell → Layout → Page
pubDate: '2026-03-03'
heroImage: ../../../assets/blog/default-covers/ai-02.webp
aiModel: anglefeint-core
aiMode: analysis
aiState: stable
aiLatencyMs: 168
aiConfidence: 0.96
updatedDate: '2026-10-03'
---

A arquitetura veio antes do acabamento visual. Uma estrutura pouco clara torna cada recurso novo mais caro.

- ThemeFrame: estrutura compartilhada e moldura global.
- Shell: atmosfera e envoltório visual de cada rota.
- Layout: composição da estrutura da página.
- Page: conteúdo e dados da rota.

Essa separação permite mudar estilo e conteúdo de forma independente. A implementação compartilhada fica no pacote @anglefeint/astro-theme, enquanto o starter mantém conteúdo e configuração. Atualizações compatíveis podem seguir pelo pacote, reduzindo cópias manuais e conflitos.

site.config.ts concentra a configuração pública. Os adaptadores continuam gerados ou sincronizados, para que quem só quer publicar não precise procurar opções por muitos arquivos.

O resultado é uma escolha prática: páginas leves, comportamento onde necessário, menos acoplamento entre visual, rotas e conteúdo, e componentes reutilizáveis para novas páginas.

Expressão criativa na superfície e estabilidade operacional por baixo tornam o tema útil além da demonstração.
