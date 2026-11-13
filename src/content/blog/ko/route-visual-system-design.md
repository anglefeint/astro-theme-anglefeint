---
title: '라우트 기반 비주얼 시스템 설계'
subtitle: '페이지 목적에 맞는 분위기 분리'
description: 'Anglefeint가 읽기 단계에 맞춰 시각 분위기를 분리하는 방법을 설명합니다.'
pubDate: '2026-03-03'
heroImage: '../../../assets/blog/default-covers/cyber-02.webp'
aiModel: 'anglefeint-core'
aiMode: 'analysis'
aiState: 'stable'
updatedDate: '2026-11-14'
---

페이지마다 독자의 목적이 달라 분위기를 나눕니다.

- 홈: 첫인상을 만드는 Matrix.
- Blog List와 태그: 발견을 위한 Cyberpunk.
- 글 상세: 긴 글을 읽는 AI.
- About: 저자와 도구를 소개하는 Hacker.
- Fragments: Cyberpunk 탐색 분위기.
- Decoder Lab: 로컬 디코딩 도구와 네트워크 배경.

기본적으로 홈에도 언어 접두사가 있고 `/`는 기본 언어 홈인 초기 `/en/`로 이동합니다. `defaultLocalePrefix: 'never'`는 그 홈만 바꾸며 블로그 등의 경로에는 언어 접두사가 남습니다.

About, Decoder, 태그, Fragments는 별도의 스위치가 있으며 Fragments는 기본적으로 꺼져 있습니다. 설정 사전에서 필드를 확인하세요.

이어서 읽기: [Anglefeint 아키텍처: 왜 4계층 조합인가](/ko/blog/architecture-of-anglefeint/) · [설정 사전: 언어 활성화, 주소, UI 번역과 대체값](/ko/blog/config-languages/)
