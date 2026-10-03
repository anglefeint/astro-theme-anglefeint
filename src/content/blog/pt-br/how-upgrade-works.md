---
title: 'Como atualizar: starter primeiro, pacote depois'
subtitle: Um caminho claro para criar e manter seu blog.
description: Um caminho claro para criar e manter seu blog.
pubDate: '2026-03-03'
updatedDate: '2026-10-03'
heroImage: ../../../assets/blog/default-covers/hacker-01.webp
aiModel: anglefeint-core
aiMode: analysis
aiState: stable
aiLatencyMs: 165
aiConfidence: 0.97
---

Comece com o template público. Atualizações compatíveis do pacote usam npm update @anglefeint/astro-theme, seguido de npm run doctor.

npm update respeita a faixa em package.json: ^0.5.1 não inclui 0.6.0. Consulte as notas e instale uma versão explícita quando necessário, sem escolher @latest às cegas. npm ls @anglefeint/astro-theme astro mostra as versões instaladas.

O pacote não atualiza configuração, rotas, adaptadores ou integrações locais do starter. Quando a estrutura muda, crie um starter novo em outra pasta e migre seu conteúdo e configurações pessoais. Não sobrescreva os novos auxiliares com arquivos antigos.

doctor já inclui verificações e compilação. Depois use npm run preview. Execute npm run sync-adapters somente se houver divergência entre os adaptadores gerados e os templates locais; isso não baixa templates novos. Projetos antigos podem ter scripts diferentes.

Para mudanças de versão principal do Astro, siga primeiro a documentação oficial. Consulte o [guia de atualização](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md).
