[English](README.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Português (Brasil)](README.pt-BR.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [繁體中文](README.zh-Hant.md)

<p align="center">
  <a href="https://demo.anglefeint.com/ko/">
    <img src="public/images/theme-previews/anglefeint-brand.webp" alt="Anglefeint — Matrix / Cyberpunk / Hacker / AI" width="1600" />
  </a>
</p>

<p align="center">사람과 AI 에이전트를 위한 영화 같은 여러 분위기의 Astro 개인 출판 테마.</p>

`llms.txt`, 다국어 인덱스, 전문 모음, 글 Markdown을 자동 생성해 AI 에이전트가 읽고 인용하도록 돕고 GEO(생성형 엔진 최적화)를 지원합니다.

<p align="center">
  <a href="https://demo.anglefeint.com/">라이브 데모</a>
  ·
  <a href="https://github.com/anglefeint/astro-theme-anglefeint">저장소</a>
</p>

<p align="center">
  <a href="#ai-assistant">AI 도우미</a> · <a href="#installation">설치</a> · <a href="#setup">사이트 설정</a> · <a href="#writing">글 쓰기</a> · <a href="#upgrade">업그레이드</a> · <a href="#deployment">빌드·배포</a>
</p>

<p align="center">
  <img alt="Astro" src="https://img.shields.io/badge/Astro-7.3.7-BC52EE?logo=astro&logoColor=white" />
  <img alt="Node" src="https://img.shields.io/badge/Node.js-22.12%2B-339933?logo=node.js&logoColor=white" />
  <img alt="Locales" src="https://img.shields.io/badge/i18n-9%20languages-0A7EA4" />
  <img alt="Deployment" src="https://img.shields.io/badge/Deploy-Static%20Hosting-0A7EA4" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT-2EA043" />
</p>

## Anglefeint로 무엇을 할 수 있나요?

Markdown／MDX로 글을 쓰고 Fragments로 짧은 생각을 기록합니다. 다국어, 검색, 태그, 목차, 코드 복사, 이미지 미리보기, 수식, 자동 글 공유 이미지를 제공합니다. 댓글, 음악, GA4는 필요할 때 켤 수 있습니다.

| 페이지           | 시각적 분위기                               |
| ---------------- | ------------------------------------------- |
| 홈               | Matrix: 녹색 코드 비, 터미널, 픽셀 아바타   |
| 블로그·태그 목록 | Cyberpunk: 네온, 비, 도시 광선              |
| About            | Hacker: 자기소개, 가상 터미널, 대화형 도구  |
| 글 상세          | AI: 네트워크 배경, 모니터, OUTPUT 읽기 패널 |

빌드 시 공개 글, About, Fragments의 Markdown, `llms.txt`, 다국어 전문 모음도 생성합니다. 별도 운영 서버 없이 AI 도구가 읽도록 돕지만 모델 수록·인용을 보장하지는 않습니다.

<a id="ai-assistant"></a>

## AI 도우미와 협업하기

Cursor, Codex, Claude Code가 현재 프로젝트의 `AGENTS.md`에 따라 사이트 설정과 콘텐츠 관리를 하도록 요청할 수 있습니다. 기존 `CLAUDE.md`와 Cursor 규칙도 해당 지침을 가리킵니다. 바꾸려는 내용을 설명하고 실제 설정과 이 문서의 해당 절을 확인하게 한 뒤 필드 세부 내용이 필요하면 demo 사전을 참고하세요.

테마 개발에 참여하려면 저장소의 [AGENTS.md](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/AGENTS.md)와 [기여 가이드](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/CONTRIBUTING.md)부터 읽으세요. 블로그 사용자가 유지보수자의 배포 흐름을 먼저 배울 필요는 없습니다.

<a id="installation"></a>

## 1. 설치하고 실행하기

**Node.js 22.12.0 이상**이 필요하며 템플릿은 **Astro 7** 기반입니다. 블로그를 둘 디렉터리에서 실행하세요.

```bash
npm create astro@latest -- my-blog --template anglefeint/astro-theme-anglefeint#starter --no-install --no-ai
cd my-blog
npm install
npm run dev
```

터미널에 출력된 주소를 여세요. 기존 프로젝트는 원래 디렉터리에서 `npm install`, `npm run dev`만 실행하면 되며 다시 만들 필요는 없습니다. Ctrl+C로 멈추세요. 이후 명령은 루트에서 실행하며 dev를 멈추거나 다른 터미널을 사용하세요.

새 프로젝트는 `pnpm install`, `pnpm dev`도 가능합니다. 한 프로젝트에서는 같은 패키지 관리자를 유지하세요. 아래는 npm 기준이며 자동 업그레이드는 현재 npm만 지원합니다.

자세한 절차: [블로그 설치와 내 정보 설정](https://demo.anglefeint.com/ko/blog/starter-guide-1-configure-your-site/).

<a id="setup"></a>

## 2. 첫 설정: 내 정보로 바꾸기

프로젝트에는 이미 `src/site.config.ts`가 있습니다. **이 파일을 바로 수정하면 되며 새 설정 파일이나 설정 객체를 선언할 필요는 없습니다.**

기존 `defineThemeConfig({ ... })` 안에 아래 `site`를 넣고 이름, 작성자, 소개, 도메인을 내 것으로 바꾸세요. starter는 `site`를 생략하고 기본값을 사용합니다. 이미 있다면 필드만 바꾸고 다른 설정을 유지하세요. 같은 객체를 중복 추가하지 말고 기존 import, export와 설정도 유지하세요.

```ts
site: {
  title: '我的博客',
  author: '你的名字',
  description: '记录项目、阅读和生活。',
  url: 'https://your-domain.example',
},
```

전역 정보만 수정하며 언어는 바꾸지 않습니다. 언어별 `homeTitle`이 없으면 홈 대제목은 전역 `title`입니다. 홈 소개, About, 소셜 링크도 내 것으로 바꿀 수 있으며 아래 가이드·사전에 필드가 있습니다.

`site.url`은 로컬 dev가 아닌 정식 공개 주소입니다. 배포 환경의 `PUBLIC_SITE_URL`이 우선하므로 이전 도메인이 계속 나오면 확인하세요.

초기에는 아홉 언어가 켜져 있고 기본 언어는 영어이며 `/`는 `/en/`으로 갑니다. 한국어 README를 읽는다고 블로그를 한국어로 바꿀 필요는 없습니다. 기본·활성 언어를 조정하려면 [언어 가이드](https://demo.anglefeint.com/ko/blog/starter-guide-languages/)를 따르세요. 생략한 언어도 유지하고 기본 언어는 항상 켜며 글은 자동 번역하지 않습니다. 예시 글은 백업·Git 커밋 후 삭제할 수 있지만 참조 중인 이미지는 지우지 마세요.

가이드: [설치와 첫 설정](https://demo.anglefeint.com/ko/blog/starter-guide-1-configure-your-site/), [언어와 홈 주소](https://demo.anglefeint.com/ko/blog/starter-guide-languages/). 필드 참조: [사이트·공용 UI](https://demo.anglefeint.com/ko/blog/config-site-chrome/), [홈](https://demo.anglefeint.com/ko/blog/config-home/).

<a id="writing"></a>

## 3. 첫 글 쓰기

프로젝트 루트에서 글을 만드세요.

```bash
npm run new-post -- my-first-post
```

`--locales`나 `ANGLEFEINT_LOCALES`를 지정하지 않으면 모든 활성 언어에 같은 이름의 뼈대 파일을 만듭니다. 초기 아홉 언어 설정에서는 아홉 파일이며 언어 스위치를 바꿨다면 그 목록을 따릅니다. 본문은 자동 번역하지 않으며 기존 파일을 덮어쓰지 않습니다.

파일은 `src/content/blog/<locale>/my-first-post.md`, 글은 `/<locale>/blog/my-first-post/`, 목록은 `/<locale>/blog/`입니다. 예를 들어 영어 파일은 `src/content/blog/en/my-first-post.md`, 중국어 간체는 `src/content/blog/zh/my-first-post.md`입니다. 필요한 파일을 열어 제목·설명·본문을 바꾸세요. 라우트를 직접 만들 필요는 없습니다. 최소 콘텐츠 예시입니다.

```md
---
title: '我的第一篇文章'
description: '记录这次开始写博客的想法。'
pubDate: '2026-11-13'
---

这里开始写正文。
```

필수만 보여 줍니다. 생성 파일의 표지·선택 필드는 유지해도 됩니다. 일반 글 이름은 `my-first-post`처럼 소문자 영문·숫자·하이픈입니다.

특정 언어만 만들 때 `--locales`를 쓰세요. 선택적 사용법이므로 모두 실행할 필요는 없습니다.

```bash
# 只生成英文
npm run new-post -- my-first-post --locales en

# 只生成中文
npm run new-post -- my-first-post --locales zh

# 生成指定的多种语言
npm run new-post -- my-first-post --locales en,zh
```

`--locales`는 파일만 선택하고 언어를 켜지 않습니다. 해당 언어가 설정에서 활성화되어야 페이지를 만듭니다. 같은 호출의 새 파일은 무작위 기본 표지를 공유하며(소스 풀에 이미지가 있을 때), 기존 파일은 유지합니다.

`ANGLEFEINT_LOCALES` 환경변수도 가능하며 우선순위는 `--locales` → 환경변수 → 활성 언어입니다. Bash는 `ANGLEFEINT_LOCALES=zh,en npm run new-post -- my-first-post`, PowerShell은 위 `--locales`를 쓰면 됩니다.

**현재 초안·미래 날짜 자동 숨김은 없습니다.** 각 언어의 뼈대도 빌드와 함께 공개되므로 배포 전에 완성하고 미공개 파일은 컬렉션 밖으로 옮기세요. `draft: true`, `search: false`는 비공개가 아닙니다.

가이드: [첫 글 쓰기](https://demo.anglefeint.com/ko/blog/starter-guide-2-languages-and-routing/), [이미지 추가](https://demo.anglefeint.com/ko/blog/starter-guide-images/). 참조: [글 상세·frontmatter](https://demo.anglefeint.com/ko/blog/config-article/).

## 4. Fragment 게시하기

짧은 문구, 이미지, 코드에 적합합니다. **테마·새 starter는 기본 꺼짐이고 demo에서 별도로 켰습니다.** 내 블로그에서 사용하려면 `src/site.config.ts`의 기존 `theme`에 `fragments.enabled: true`를 설정하세요. 아래는 병합한 구조이며 theme를 중복 생성하지 마세요.

```ts
theme: {
  fragments: { enabled: true },
},
```

이미 true면 추가할 필요 없고 false면 바꾸세요. 목록·홈 입구를 제어하며 댓글은 계속 기본 꺼짐입니다.

그다음 Fragment 하나를 만듭니다. 기본은 모든 활성 언어에 같은 콘텐츠의 뼈대를 만듭니다.

```bash
npm run new-fragment
```

특정 언어만 원하면 매개변수를 선택하세요.

```bash
# 只生成中文
npm run new-fragment -- --locales zh

# 生成指定的多种语言
npm run new-fragment -- --locales en,zh
```

실행마다 새 항목이 생깁니다. 대체 사용법이므로 필요에 따라 고르고 모두 실행하지 마세요. CLI 언어 선택은 사이트 언어 스위치를 바꾸지 않습니다.

파일은 `src/content/fragments/<locale>/`, 이름은 `2026-11-13-aB3dE6gH.md` 형태이며 실제 경로는 터미널에 나옵니다. 본문을 편집하고 생성된 영문·숫자 8자리 ID를 유지하세요. 같은 호출의 번역은 ID·시간을 공유합니다. 같은 콘텐츠를 계속 쓸 때는 명령을 다시 실행하지 마세요.

목록은 `/<locale>/fragments/`이며 예시는 `/en/fragments/`, `/zh/fragments/`입니다. 해당 언어 홈에 콘텐츠가 있으면 아바타 입구를 표시합니다. 안정적 공유는 `/<locale>/fragments/#ID`이며 페이지 번호를 정체성으로 쓰지 마세요. ID 변경은 링크·댓글을 바꿉니다. 댓글 기본은 꺼짐입니다.

가이드: [Fragment 게시하기](https://demo.anglefeint.com/ko/blog/starter-guide-5-fragments/). 참조: [Fragments](https://demo.anglefeint.com/ko/blog/config-fragments/).

## 5. 사용자 페이지 만들기

글은 `new-post`, 프로젝트 소개·작품 등 독립 페이지는 `new-page`입니다.

```bash
npm run new-page -- projects
```

`src/pages/[lang]/projects.astro`를 만들며 기본은 `base`입니다. 편집한 다음 `/<locale>/projects/`, 예를 들어 `/en/projects/`로 여세요. 소스 하나로 모든 활성 언어에 페이지를 만들지만 자동 번역·내비게이션 추가는 없습니다.

스타일이 필요하면 `--theme`로 `base`, `matrix`, `cyber`, `hacker`, `ai`를 고릅니다. 예를 들어 `npm run new-page -- portfolio --theme cyber`는 별도 Cyberpunk 페이지입니다.

중첩 경로도 지원합니다.

```bash
npm run new-page -- projects/labs --theme hacker
```

경로 각 구간은 소문자·숫자·하이픈이며 대문자·밑줄·앞뒤 슬래시는 쓰지 않습니다. 기존 파일은 덮어쓰지 않으며 테마 표준 예약 경로도 재생성할 수 없습니다.

절차: [페이지 꾸미기](https://demo.anglefeint.com/ko/blog/starter-guide-3-comments-about-and-theme-toggles/).

## 6. 이미지 준비와 생성 파일 유지

본문에는 일반 Markdown 이미지를 씁니다. 글 옆의 `photo.jpg`는 `![이미지 설명](./photo.jpg)`입니다. 표지는 실제 파일을 먼저 두고 frontmatter의 `heroImage: ./cover.jpg`로 설정합니다. public URL에는 public 접두사를 넣지 않습니다.

표지·지원되는 Fragment 로컬 이미지는 영구 반응형 파일이 필요합니다. 로컬 준비 또는 현재 산출물 검사에 사용하세요.

```bash
npx @anglefeint/astro-theme prepare-covers
npx @anglefeint/astro-theme prepare-covers --check
```

로컬 dev·doctor는 없거나 오래된 파생 파일을 준비하고 build·CI doctor는 검사만 하며 배포 측에서 생성하지 않습니다. 원본과 `src/assets/blog/covers/` 전체(`manifest.json`, `generated/` 포함)를 Git에 커밋하세요. missing／stale／modified는 로컬 준비·커밋 뒤 재빌드합니다.

모든 일반 본문 이미지가 압축되었다는 뜻은 아닙니다. 범위·경로·공유 규칙은 [이미지 가이드](https://demo.anglefeint.com/ko/blog/starter-guide-images/)에 있습니다.

<a id="reference"></a>

## 필요에 맞는 기능 설정

자주 쓰는 명령·첫 작업은 여기서 마칠 수 있습니다. 기능 조정이 필요할 때 해당 가이드·필드 설명을 여세요. 사전은 타입·기본값·제한·예시·현재 미사용 상태를 설명합니다.

| 하려는 작업                    | 가이드                                                                                                                                                                           | 설정 사전                                                                                                                                                                                  |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 홈·사이트·내비게이션·소셜·푸터 | [페이지·기능](https://demo.anglefeint.com/ko/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                                             | [홈](https://demo.anglefeint.com/ko/blog/config-home/), [사이트·공용 UI](https://demo.anglefeint.com/ko/blog/config-site-chrome/)                                                          |
| 목록 수·태그·페이지 나누기     | [페이지·기능](https://demo.anglefeint.com/ko/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                                             | [Blog List·태그](https://demo.anglefeint.com/ko/blog/config-blog-list/)                                                                                                                    |
| 목차·수식·OUTPUT·검색 참여     | [첫 글 쓰기](https://demo.anglefeint.com/ko/blog/starter-guide-2-languages-and-routing/)                                                                                         | [글 상세](https://demo.anglefeint.com/ko/blog/config-article/), [검색·콘텐츠 발견](https://demo.anglefeint.com/ko/blog/config-search/)                                                     |
| About·터미널·Decoder           | [페이지·기능](https://demo.anglefeint.com/ko/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                                             | [About](https://demo.anglefeint.com/ko/blog/config-about/), [터미널](https://demo.anglefeint.com/ko/blog/config-terminal/), [Decoder](https://demo.anglefeint.com/ko/blog/config-decoder/) |
| 음악·댓글                      | [음악](https://demo.anglefeint.com/ko/blog/starter-guide-3-comments-about-and-theme-toggles/), [독자 댓글](https://demo.anglefeint.com/ko/blog/starter-guide-4-giscus-comments/) | [음악](https://demo.anglefeint.com/ko/blog/config-music/), [Giscus·다국어 토론](https://demo.anglefeint.com/ko/blog/config-comments/)                                                      |
| 언어·통계·공개 보충            | [다국어](https://demo.anglefeint.com/ko/blog/starter-guide-languages/), [배포](https://demo.anglefeint.com/ko/blog/starter-guide-deployment/)                                    | [언어·대체값](https://demo.anglefeint.com/ko/blog/config-languages/), [GA4·AI 보충](https://demo.anglefeint.com/ko/blog/config-analytics-ai/)                                              |

위치를 모르겠다면 [사전 시작 페이지](https://demo.anglefeint.com/ko/blog/config-reference/)에서 찾으세요. 한 언어 문구를 바꿔도 콘텐츠는 자동 번역하지 않습니다. 설정·콘텐츠 변경은 재빌드·재배포가 필요합니다.

<a id="upgrade"></a>

## 7. 기존 블로그 업그레이드

새 설치라면 이 절을 건너뛰고 [검사·미리보기·첫 배포](#deployment)로 가세요.

먼저 Git 커밋 등으로 변경을 저장하고 dev·preview를 멈추세요. 기존 프로젝트 루트에서 호환성을 검사한 다음 업그레이드합니다.

```bash
npx @anglefeint/astro-theme@latest upgrade --check
npx @anglefeint/astro-theme@latest upgrade
```

`--check`는 파일 변경·설치·빌드를 하지 않습니다. 실제 업그레이드는 npm, `package-lock.json`, `anglefeint.projectSchema: 1`이 있는 통합 starter에 적용합니다. pnpm／yarn／bun 잠금 파일을 지워 제한을 우회하지 마세요.

테마 의존성을 업데이트하고 doctor를 실행하며 글·설정·음악·이미지·사용자 페이지를 유지합니다. 의존성 파일 두 개를 `.anglefeint/backups/`에 보관하지만 전체 사이트 백업은 아닙니다. 설치·검사 실패 시 복구하고 이전 의존성 재설치를 시도합니다. 실패 후 남은 `dist/`를 배포하지 마세요.

특정 버전은 `npx @anglefeint/astro-theme@latest upgrade --to <버전>`으로 지정하며 자리표시자를 호환되는 명시 버전으로 바꾸세요. 자동 다운그레이드는 없습니다. 성공 시 검사·빌드를 마쳤으므로 `npm run preview`를 바로 쓰며 build를 반복할 필요는 없습니다. 자동 게시·비호환 Astro 이전은 하지 않습니다.

0.27 이전 복사형 골격은 별도 starter를 만들고 기존 프로젝트를 유지하며 개인 콘텐츠·자원을 옮겨야 합니다. 제자리 업그레이드는 안 됩니다. 이전 표준 라우트·adapter 구현은 복사하지 마세요.

절차·복구: [기존 프로젝트 업그레이드](https://demo.anglefeint.com/ko/blog/starter-guide-1-configure-your-site/), [업그레이드 가이드](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md), [버전 기록](https://github.com/anglefeint/astro-theme-anglefeint/releases).

<a id="deployment"></a>

## 8. 검사·미리보기·첫 배포

루트에서 dev를 멈추고 검사·빌드한 다음 미리보세요.

```bash
npm run doctor
npm run preview
```

`npm run doctor`는 검사·빌드이며 `npm run check`는 같은 명령이므로 하나만 쓰세요. 성공 직후 check·build를 반복할 필요는 없습니다. 빌드 없이 Astro／TypeScript만 검사하려면 `npm run check:no-build`를 씁니다. preview는 로컬 결과만 보여 주며 Ctrl+C로 멈추고 업로드하지 않습니다. 실제 검색도 빌드 뒤 preview에서 확인하며 dev는 개발 안내만 표시합니다.

검사 전체 없이 빌드만 필요하면 다음 대안을 고르세요. 두 묶음 중 하나만 사용합니다.

```bash
npm run build
npm run preview
```

pnpm 프로젝트는 `pnpm run doctor`／`pnpm preview` 또는 `pnpm build`／`pnpm preview`입니다. `pnpm doctor`로 줄이면 pnpm 자체 진단 명령이 실행될 수 있으므로 줄이지 마세요. 한 묶음만 선택하며 빌드를 반복할 필요는 없습니다.

첫 정적 호스팅 배포에서는:

1. `site.url` 또는 `PUBLIC_SITE_URL`을 정식 주소로 정하고 소스·원본·생성 파일을 커밋하세요.
2. 플랫폼 빌드 명령은 `npm run build`, 출력은 `dist`입니다. 수동 업로드는 성공적으로 빌드한 **dist의 전체 내용**을 올리세요.
3. `_astro/`, `pagefind/`, `_social/`, 공개 텍스트 등 전체 산출물을 유지하고 HTML만 올리지 마세요.
4. 도메인 루트와 디렉터리 index 라우트를 사용하세요. 임의 하위 경로는 추가 조정이 필요하며 Astro base만으로 전체 지원이 되지 않습니다.
5. 플랫폼에 따라 도메인·HTTPS를 연결하고 홈·글·언어·이미지·검색을 확인하세요.

정적 산출물이므로 운영 Node.js 서버·추가 adapter는 필요 없습니다. 터미널 JSON의 noindex 헤더는 `dist/_headers`에 합치며 지원 플랫폼은 적용하고 다른 플랫폼은 동등 설정이 필요합니다. Astro preview는 호스팅 헤더를 흉내 내지 않습니다. 콘텐츠·설정이 바뀌면 전체 재빌드·재배포하세요.

자세한 절차: [내 도메인에 블로그 배포하기](https://demo.anglefeint.com/ko/blog/starter-guide-deployment/).

## 라이선스

이 테마는 [MIT License](LICENSE)를 따릅니다.

## 미리보기

![Anglefeint — Four cinematic worlds](public/images/theme-previews/promo-overview.jpg)

![Anglefeint — Cyberpunk Cards and List](public/images/theme-previews/promo-cyberpunk.jpg)

![Anglefeint — Hacker About and Decoder Lab](public/images/theme-previews/promo-hacker.jpg)

![Anglefeint — AI reading and GEO](public/images/theme-previews/promo-ai.jpg)

### 공유 미리보기

![Anglefeint 기본 공유 이미지](https://raw.githubusercontent.com/anglefeint/astro-theme-anglefeint/main/packages/theme/src/assets/theme/social/anglefeint-og.jpg)

### 페이지 스크린샷

| 홈                                                             | 블로그 목록                                                               |
| -------------------------------------------------------------- | ------------------------------------------------------------------------- |
| ![Home preview](public/images/theme-previews/preview-home.jpg) | ![Blog Cards preview](public/images/theme-previews/preview-blog-list.jpg) |

| Blog · 목록 보기                                                           |
| -------------------------------------------------------------------------- |
| ![Blog List view](public/images/theme-previews/preview-blog-list-mode.jpg) |

| 글 페이지                                                                |
| ------------------------------------------------------------------------ |
| ![Blog post preview](public/images/theme-previews/preview-blog-post.jpg) |

| About                                                            |
| ---------------------------------------------------------------- |
| ![About preview](public/images/theme-previews/preview-about.jpg) |

| 블로그 페이지 나누기                                                                   | 관련 글                                                                |
| -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| ![블로그 페이지 나누기](public/images/theme-previews/preview-blog-list-pagination.jpg) | ![관련 글](public/images/theme-previews/preview-blog-post-related.jpg) |

| Decoder Lab                                                      |
| ---------------------------------------------------------------- |
| ![Decoder Lab](public/images/theme-previews/preview-decoder.jpg) |

| Decoder Lab · 사이퍼펑크 자료                                                        |
| ------------------------------------------------------------------------------------ |
| ![Decoder Lab resources](public/images/theme-previews/preview-decoder-resources.jpg) |
