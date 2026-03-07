---
title: 'Anglefeint Starter Guide 3: Comments, About, and Toggles'
subtitle: 'Giscus, About, pagination, post effects'
description: '현재 실제로 동작하는 확장 설정은 Giscus comments, About content, Red Queen effect, home counts, pagination 입니다.'
pubDate: '2026-03-07'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

이 글은 다음 설정을 다룹니다.

- `theme.comments.*`
- `i18n.locales.<code>.about`
- `theme.effects.enableRedQueen`
- `theme.blogPageSize`
- `theme.homeLatestCount`
- `theme.pagination.*`

Giscus 에서는 `enabled`, `repo`, `repoId`, `category`, `categoryId`, `mapping` 등이 실제로 소비됩니다. `mapping: 'specific'` 는 `term`, `mapping: 'number'` 는 양의 정수 `number` 가 필요합니다.

About 본문과 modal 텍스트는 `i18n.locales.<code>.about` 에서 옵니다.

- [Starter Guide 1](/ko/blog/starter-guide-1-configure-your-site/)
- [Starter Guide 2](/ko/blog/starter-guide-2-languages-and-routing/)
