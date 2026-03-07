---
title: 'Anglefeint Starter Guide 2: Languages and Routing'
subtitle: 'default locale, fallback, URL 규칙'
description: '단일 locale registry로 routing, labels, fallback, messages, hero, About content를 관리합니다.'
pubDate: '2026-03-07'
heroImage: '../../../assets/blog/default-covers/cyber-03.webp'
---

다국어 설정은 `src/site.config.ts` 의 `i18n` 에 모여 있습니다.

핵심 항목:

- `i18n.defaultLocale`
- `i18n.routing.defaultLocalePrefix`
- `i18n.locales`
- `meta.label`
- `meta.hreflang`
- `meta.ogLocale`
- `meta.enabled`
- `meta.fallback`
- `messages`
- `site.hero`
- `about`

`defaultLocalePrefix` 가 `'always'` 면 기본 언어 홈은 `/<default-locale>/` 이고, `'never'` 면 `/` 가 canonical 홈이 됩니다.

글 파일은 계속 `src/content/blog/<locale>/` 아래에 둡니다.

- [Starter Guide 1](/ko/blog/starter-guide-1-configure-your-site/)
- [Starter Guide 3](/ko/blog/starter-guide-3-comments-about-and-theme-toggles/)
