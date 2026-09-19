---
title: '업그레이드 모델: starter 초기화, 이후 npm 업데이트'
subtitle: '초기화 경로와 업데이트 경로를 단순화'
description: 'Anglefeint 프로젝트의 권장 초기화/업그레이드 흐름을 정리합니다.'
pubDate: '2026-03-03'
updatedDate: '2026-09-19'
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

```bash
npm create astro@latest -- --template anglefeint/astro-theme-anglefeint#starter
```

호환되는 패키지만 업데이트:

`npm update`는 테마 패키지만 업데이트하며 로컬 설정, 라우트, 어댑터, Astro 통합 파일은 변경하지 않습니다. 릴리스 노트에서 프로젝트 구조 변경을 요구하면 새 디렉터리에 최신 starter를 만들고 글과 개인 설정을 옮기세요. 새 설정 보조 파일을 이전 파일로 덮어쓰지 마세요. [업그레이드 가이드](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md)를 참고하세요.

```bash
npm update @anglefeint/astro-theme
npm run doctor
```

`npm update`는 `package.json`에 지정된 범위 안에서만 업데이트합니다. `^0.5.1`에는 `0.6.0`이 포함되지 않습니다. 호환되지만 범위를 벗어나는 업데이트는 릴리스 노트에 따라 대상 버전을 명시하고, 무조건 `@latest`를 설치하지 마세요. `npm ls @anglefeint/astro-theme astro`로 실제 버전을 확인하세요.

현재 starter의 `doctor`에는 검사와 빌드가 포함됩니다. 성공한 뒤 `npm run preview`로 사이트를 확인하세요. 생성된 어댑터와 로컬 템플릿이 일치하지 않는다는 메시지가 있을 때만 `npm run sync-adapters`를 실행한 뒤 `npm run doctor`를 다시 실행하세요. 이 명령은 상위 저장소의 템플릿을 다운로드하지 않습니다. 이전 프로젝트의 스크립트는 다를 수 있으므로 로컬 `package.json`과 업그레이드 가이드를 확인하세요.

핵심 업데이트를 패키지 중심으로 처리할 수 있어 운영이 단순해집니다。

Astro 메이저 업그레이드는 공식 가이드를 먼저 확인한 뒤, 프로젝트 검증 명령을 실행하세요。
