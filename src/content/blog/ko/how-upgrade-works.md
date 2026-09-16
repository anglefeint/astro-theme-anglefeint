---
title: '업그레이드 모델: starter 초기화, 이후 npm 업데이트'
subtitle: '초기화 경로와 업데이트 경로를 단순화'
description: 'Anglefeint 프로젝트의 권장 초기화/업그레이드 흐름을 정리합니다.'
pubDate: '2026-03-03'
heroImage: '../../../assets/blog/default-covers/hacker-01.webp'
aiModel: 'anglefeint-core'
aiMode: 'analysis'
aiState: 'stable'
aiLatencyMs: 165
aiConfidence: 0.97
wordCount: 690
tokenCount: 1040
---

테마 운영에서 자주 생기는 문제는 초기화는 쉽지만 업그레이드가 어렵다는 점입니다。 Anglefeint는 경로를 표준화합니다。

초기화:

npm create astro@latest -- --template anglefeint/astro-theme-anglefeint#starter

호환되는 패키지만 업데이트:

`npm update`는 테마 패키지만 업데이트하며 로컬 설정, 라우트, 어댑터, Astro 통합 파일은 변경하지 않습니다. 릴리스 노트에서 프로젝트 구조 변경을 요구하면 새 디렉터리에 최신 starter를 만들고 글과 개인 설정을 옮기세요. 새 설정 보조 파일을 이전 파일로 덮어쓰지 마세요. [업그레이드 가이드](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md)를 참고하세요.

npm update @anglefeint/astro-theme
npm install
npm run check
npm run build

핵심 업데이트를 패키지 중심으로 처리할 수 있어 운영이 단순해집니다。

Astro 메이저 업그레이드는 공식 가이드를 먼저 확인한 뒤, 프로젝트 검증 명령을 실행하세요。
