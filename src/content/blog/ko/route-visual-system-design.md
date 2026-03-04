---
title: '라우트 기반 비주얼 시스템 설계'
subtitle: '페이지 목적에 맞는 분위기 분리'
description: 'Anglefeint가 읽기 단계에 맞춰 시각 분위기를 분리하는 방법을 설명합니다.'
pubDate: '2026-03-03'
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

- / : Matrix 분위기의 첫 화면
- /:lang/blog : cyber 아카이브 탐색 화면
- /:lang/blog/[slug] : AI 독서 인터페이스
- /:lang/about : hacker 프로필 화면

핵심 원칙은 배경은 읽기를 지원해야 한다입니다.

홈은 인상 형성, 목록은 탐색 효율, 상세는 본문 집중, About은 맥락 보강이라는 역할을 분리했습니다。

이 방식은 스타일 정체성을 유지하면서도 콘텐츠 우선순위를 안정적으로 지켜 줍니다.
