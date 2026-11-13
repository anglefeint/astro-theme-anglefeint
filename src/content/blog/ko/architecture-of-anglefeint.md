---
title: 'Anglefeint 아키텍처: 왜 4계층 조합인가'
subtitle: 'ThemeFrame -> Shell -> Layout -> Page'
description: 'Anglefeint가 4계층 구조를 선택한 이유와 유지보수 측면의 이점을 설명합니다.'
pubDate: '2026-03-03'
heroImage: '../../../assets/blog/default-covers/ai-02.webp'
aiModel: 'anglefeint-core'
aiMode: 'analysis'
aiState: 'stable'
updatedDate: '2026-11-14'
---

Anglefeint는 네 가지 역할을 조합합니다.

- ThemeFrame: 문서, SEO, 탐색, 푸터, 음악의 공통 구성.
- Shell: 페이지별 스타일과 배경 분위기.
- Layout: 본문, 커버, 보조 영역의 배치.
- Page: 콘텐츠와 설정을 읽고 페이지를 구성.

이는 역할 구분이며 모든 페이지가 같은 네 컴포넌트를 중첩한다는 뜻은 아닙니다. 공통 구조는 일관성을 담당하고 각 페이지는 데이터와 상호작용을 유지합니다.

표준 경로, 기본값, 테마 구현은 `@anglefeint/astro-theme`에 있습니다. starter에는 글, 자료, `src/site.config.ts`, 사용자 페이지, 배포 설정이 남습니다. 업데이트하려고 표준 페이지를 복사할 필요가 없습니다. 사이트 설정은 한 진입점에서, 글과 Fragments는 각 콘텐츠 디렉터리에서 관리합니다.

이어서 읽기: [라우트 기반 비주얼 시스템 설계](/ko/blog/route-visual-system-design/) · [설정 사전: 사이트 이름, 도메인, 공용 내비게이션, 소셜, 푸터](/ko/blog/config-site-chrome/)
