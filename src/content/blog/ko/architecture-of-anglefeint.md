---
title: 'Anglefeint 아키텍처: 왜 4계층 조합인가'
subtitle: 'ThemeFrame -> Shell -> Layout -> Page'
description: 'Anglefeint가 4계층 구조를 선택한 이유와 유지보수 측면의 이점을 설명합니다.'
pubDate: '2026-03-03'
heroImage: '../../../assets/blog/default-covers/ai-02.webp'
aiModel: 'anglefeint-core'
aiMode: 'analysis'
aiState: 'stable'
aiLatencyMs: 168
aiConfidence: 0.96
wordCount: 760
tokenCount: 1180
---

이 테마는 시각 효과보다 구조를 먼저 정했습니다. 구조가 불명확하면 기능 추가와 수정 비용이 빠르게 커지기 때문입니다.

Anglefeint는 4계층으로 구성됩니다.

- ThemeFrame: 공통 프레임과 전역 골격
- Shell: 라우트별 분위기 레이어
- Layout: 페이지 구조 조합
- Page: 콘텐츠와 라우팅 데이터

이 분리는 스타일 변경과 콘텐츠 변경을 분리해 줍니다. 스타일을 바꿔도 콘텐츠 로직을 다시 짤 필요가 없습니다.

레포 구조에서도 핵심 구현은 @anglefeint/astro-theme 패키지로 두고, starter는 콘텐츠/설정 중심으로 유지합니다. 업그레이드 경로를 패키지 업데이트 중심으로 단순화하기 위함입니다.

사용자 설정은 site.config.ts를 중심으로 모아 두었습니다. 단일 진입점은 학습 비용과 운영 비용을 모두 낮춥니다.
