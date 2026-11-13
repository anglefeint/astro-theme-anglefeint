---
title: Визуальный дизайн по маршрутам
subtitle: У каждого этапа чтения своя атмосфера.
description: У каждого этапа чтения своя атмосфера.
pubDate: '2026-03-03'
heroImage: ../../../assets/blog/default-covers/cyber-02.webp
aiModel: anglefeint-core
aiMode: analysis
aiState: stable
updatedDate: '2026-11-14'
---

Разным задачам читателя соответствуют разные атмосферы:

- Главная: Matrix для первого впечатления.
- Blog List и теги: Cyberpunk для поиска интересного.
- Статьи: AI для долгого чтения.
- About: Hacker для автора и инструментов.
- Fragments: просмотр в атмосфере Cyberpunk.
- Decoder Lab: локальные инструменты с сетевым фоном.

По умолчанию главная имеет языковой префикс, а `/` ведёт на главную языка по умолчанию, изначально `/en/`. `defaultLocalePrefix: 'never'` меняет только эту главную; другие маршруты сохраняют префиксы.

About, Decoder, теги и Fragments включаются независимо. Fragments по умолчанию выключен. Поля описаны в справочнике.

Читать дальше: [Архитектура Anglefeint: четыре слоя для поддержки и повторного использования](/ru/blog/architecture-of-anglefeint/) · [Справочник настроек: языки, адреса, переводы и откат](/ru/blog/config-languages/)
