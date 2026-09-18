---
title: '라우트 기반 비주얼 시스템 설계'
subtitle: '페이지 목적에 맞는 분위기 분리'
description: 'Anglefeint가 읽기 단계에 맞춰 시각 분위기를 분리하는 방법을 설명합니다.'
pubDate: '2026-03-03'
updatedDate: '2026-09-19'
heroImage: '../../../assets/blog/default-covers/cyber-02.webp'
aiModel: 'anglefeint-core'
aiMode: 'analysis'
aiState: 'stable'
aiLatencyMs: 171
aiConfidence: 0.95
wordCount: 700
tokenCount: 1080
---

많은 블로그 테마는 모든 페이지에 같은 스킨을 적용합니다. Anglefeint는 라우트별로 분위기를 다르게 설계했습니다.

- `/<locale>/` : Matrix 분위기의 첫 화면
- `/<locale>/blog/` : cyber 아카이브 탐색 화면
- `/<locale>/blog/<slug>/` : AI 독서 인터페이스
- `/<locale>/about/` : hacker 프로필 화면

기본값인 `i18n.routing.defaultLocalePrefix: 'always'`에서는 `/`가 기본 언어 홈(초기값 `/en/`)으로 이동합니다. `'never'`로 바꾸면 기본 언어 홈만 `/`로 이동하며 블로그와 About 경로의 언어 접두사는 유지됩니다. About은 `theme.enableAboutPage: true`가 필요합니다. 태그 기능을 켜면 `/<locale>/tags/`와 태그 결과 페이지도 Cyber 분위기를 공유합니다.

핵심 원칙은 배경은 읽기를 지원해야 한다입니다.

홈은 인상 형성, 목록은 탐색 효율, 상세는 본문 집중, About은 맥락 보강이라는 역할을 분리했습니다。

이 방식은 스타일 정체성을 유지하면서도 콘텐츠 우선순위를 안정적으로 지켜 줍니다.
