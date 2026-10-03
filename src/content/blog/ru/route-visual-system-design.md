---
title: Визуальный дизайн по маршрутам
subtitle: У каждого этапа чтения своя атмосфера.
description: У каждого этапа чтения своя атмосфера.
pubDate: '2026-03-03'
updatedDate: '2026-10-03'
heroImage: ../../../assets/blog/default-covers/cyber-02.webp
aiModel: anglefeint-core
aiMode: analysis
aiState: stable
aiLatencyMs: 171
aiConfidence: 0.95
---

Anglefeint распределяет оформление по маршрутам:

- `/<locale>/`: главная Matrix.
- `/<locale>/blog/`: архив Cyberpunk.
- `/<locale>/blog/<slug>/`: интерфейс чтения ИИ.
- `/<locale>/about/`: хакерский профиль.

defaultLocalePrefix: 'always' перенаправляет / на основную главную, изначально /en/. При 'never' только она переезжает на /. Статьи и профиль сохраняют префикс. About требует theme.enableAboutPage; включённые страницы тегов используют Cyberpunk.

Фон помогает чтению. Главная задаёт характер, список приглашает исследовать, статья выделяет текст, а профиль даёт контекст. Выразительность сохраняется вместе с понятной иерархией.
