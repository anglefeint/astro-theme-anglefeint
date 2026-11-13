---
title: 'Arquitetura do Anglefeint: quatro camadas para manutenção e reutilização'
subtitle: ThemeFrame → Shell → Layout → Page
description: ThemeFrame → Shell → Layout → Page
pubDate: '2026-03-03'
heroImage: ../../../assets/blog/default-covers/ai-02.webp
aiModel: anglefeint-core
aiMode: analysis
aiState: stable
updatedDate: '2026-11-14'
---

O Anglefeint combina quatro responsabilidades:

- ThemeFrame: documento, SEO, navegação, rodapé e música compartilhados.
- Shell: estilos e atmosfera da página.
- Layout: disposição do texto, capas e áreas auxiliares.
- Page: leitura de conteúdo e configuração, e composição.

Não é obrigatório aninhar quatro componentes iguais em toda página. A estrutura comum oferece consistência; cada página mantém seus dados e interações.

Rotas padrão, valores iniciais e implementação pertencem a `@anglefeint/astro-theme`. O starter mantém artigos, recursos, `src/site.config.ts`, páginas próprias e ajustes de implantação. Atualizar não exige copiar páginas padrão. A configuração tem uma entrada; artigos e Fragments ficam em seus diretórios.

Continue lendo: [Design visual por rota](/pt-br/blog/route-visual-system-design/) · [Referência de configuração: identidade, navegação e rodapé](/pt-br/blog/config-site-chrome/)
