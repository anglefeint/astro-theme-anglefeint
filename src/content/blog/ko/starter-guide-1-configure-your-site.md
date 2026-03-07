---
title: 'Anglefeint Starter Guide 1: Site Configuration'
subtitle: 'starter 생성 직후 먼저 바꿔야 할 항목'
description: '가장 먼저 확인할 사용자 설정은 site 정보, social links, About 토글, starter 글 교체입니다.'
pubDate: '2026-03-07'
heroImage: '../../../assets/blog/default-covers/cyber-02.webp'
---

Anglefeint starter를 만들었다면 첫 진입점은 `src/site.config.ts` 입니다.

먼저 확인할 항목:

- `site.title`
- `site.description`
- `site.url`
- `site.author`
- `site.tagline`
- `social.links`
- `theme.enableAboutPage`

`site.description` 은 사이트 기본 설명이며, 홈은 `messages.siteDescription` 이 없을 때 여기로 fallback 됩니다.

새 글은 다음 명령으로 생성할 수 있습니다.

```bash
npm run new-post -- your-first-post
```

- [Starter Guide 2](/ko/blog/starter-guide-2-languages-and-routing/)
- [Starter Guide 3](/ko/blog/starter-guide-3-comments-about-and-theme-toggles/)
