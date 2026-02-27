---
doc_id: readme_ko
doc_role: localized-user-guide
doc_purpose: 한국어 사용자용 설치, 사용, 업그레이드 안내.
doc_scope: [setup, commands, themes, config, routing]
update_triggers: [sync-from-readme-en]
source_of_truth: false
depends_on: [README.md]
---

<h1 align="center">Anglefeint</h1>
<p align="center">개인 퍼블리싱을 위한 시네마틱 멀티 무드 Astro 테마입니다.</p>

<p align="center">
  <a href="https://demo.anglefeint.com/">라이브 데모</a>
  ·
  <a href="https://github.com/voidtem/astro-theme-anglefeint">저장소</a>
  ·
  <a href="ASTRO_THEME_LISTING.md">테마 제출 문안</a>
</p>

<p align="center">
  <img alt="Astro" src="https://img.shields.io/badge/Astro-5.x-BC52EE?logo=astro&logoColor=white" />
  <img alt="Node" src="https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white" />
  <img alt="Locales" src="https://img.shields.io/badge/i18n-en%20%7C%20ja%20%7C%20ko%20%7C%20es%20%7C%20zh-0A7EA4" />
  <img alt="Deployment" src="https://img.shields.io/badge/Deploy-Cloudflare%20Workers-F38020?logo=cloudflare&logoColor=white" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT-2EA043" />
</p>

## 템플릿 설치

```bash
npm create astro@latest -- --template voidtem/astro-theme-anglefeint#starter
```

`pnpm` 사용:

```bash
pnpm create astro@latest --template voidtem/astro-theme-anglefeint#starter
```

## 요구 사항

- Node.js `18+` (LTS 권장)
- 패키지 매니저: `npm`, `pnpm`, `yarn`, `bun`

## 빠른 시작

```bash
npm install
npm run dev
```

빌드 및 미리보기:

```bash
npm run build
npm run preview
```

`pnpm` 사용:

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
```

## 테마 업그레이드

`#starter` 로 생성한 프로젝트는 아래로 업그레이드합니다:

```bash
npm update @anglefeint/astro-theme
npm install
npm run check
npm run build
```

## 새 글 만들기

모든 로케일(`en`, `ja`, `ko`, `es`, `zh`)에 같은 slug 글을 한 번에 생성합니다:

```bash
npm run new-post -- my-first-post
```

Slug 규칙: 소문자 영문, 숫자, 하이픈만 사용하세요 (예: `my-first-post`).
`src/assets/blog/default-covers/` 에 기본 커버가 있으면 slug 해시 기반으로 안정적인 기본 이미지가 자동 할당됩니다 (`heroImage` 는 나중에 직접 변경 가능).

## 새 페이지 만들기

`new-post` 는 블로그 글만 생성합니다. 커스텀 페이지는 아래 명령으로 생성하세요:

```bash
npm run new-page -- projects --theme base
```

지원 테마: `base`, `ai`, `cyber`, `hacker`, `matrix`.  
명령은 `src/pages/[lang]/projects.astro` 를 만들고 `getStaticPaths()` 로 모든 로케일 라우트를 생성합니다.

예시:

```bash
npm run new-page -- projects --theme base
npm run new-page -- projects --theme ai
npm run new-page -- projects --theme cyber
npm run new-page -- projects --theme hacker
npm run new-page -- projects --theme matrix
```

## 언어

[English](README.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [Español](README.es.md) · 한국어 (현재 문서)

## 미리보기

| 홈 | 블로그 목록 |
| --- | --- |
| ![Home preview](public/images/theme-previews/preview-home.png) | ![Blog list preview](public/images/theme-previews/preview-blog-list.png) |

| 글 상세 (모니터 열림) | 글 상세 (모니터 접힘) |
| --- | --- |
| ![Blog post open preview](public/images/theme-previews/preview-blog-post-open.png) | ![Blog post collapsed preview](public/images/theme-previews/preview-blog-post-collapsed.png) |

| About |
| --- |
| ![About preview](public/images/theme-previews/preview-about.png) |

## 라우트별 분위기

- `/`: Matrix 스타일 터미널 랜딩
- `/:lang/blog`: 사이버펑크 아카이브 무드
- `/:lang/blog/[slug]`: AI 인터페이스형 읽기 레이아웃
- `/:lang/about`: 선택형 해커 스타일 About 페이지

## 테마 네이밍 규약

- 테마 파라미터: `base`, `ai`, `cyber`, `hacker`, `matrix`
- 내부 셀렉터/스크립트 접두사: `ai-*`, `cyber-*`, `hacker-*`
- 기본 구성 레이어: `ThemeFrame -> Shell -> Layout -> Page`

## 주요 기능

- Astro 5 정적 출력
- Markdown + MDX 콘텐츠 컬렉션
- 기본 로케일: `en`, `ja`, `ko`, `es`, `zh`
- 로케일별 RSS 피드
- sitemap + robots 지원
- 설정 중심의 커스터마이징
- 짧은 페이지에서도 Footer 하단 고정

## 테마 설정

1. `.env.example` 를 `.env` 로 복사하고 사이트 정보를 설정합니다.
2. `src/config/social.ts` 에서 소셜 링크를 수정합니다.
3. `src/config/about.ts` 에서 About 콘텐츠를 수정합니다.
4. `src/config/theme.ts` 의 `ENABLE_ABOUT_PAGE` 로 About 노출을 제어합니다.
5. `src/content/blog/<locale>/` 의 샘플 글을 교체합니다.

## 설정 표면

- 사이트 정보: `src/config/site.ts` (또는 `PUBLIC_*` 환경 변수)
- 테마 동작: `src/config/theme.ts`
- About 콘텐츠: `src/config/about.ts`
- 소셜 링크: `src/config/social.ts`

## 문서

- 아키텍처: `docs/ARCHITECTURE.md`
- 비주얼 시스템: `docs/VISUAL_SYSTEMS.md`
- 제출 체크리스트: `docs/THEME_SUBMISSION_CHECKLIST.md`
- 테마 등록 초안: `ASTRO_THEME_LISTING.md`
- 업그레이드 가이드: `UPGRADING.md`
- 변경 이력: `CHANGELOG.md`

## 라이선스

MIT License. `LICENSE` 를 참고하세요.
