<h1 align="center">Anglefeint</h1>
<p align="center">개인 퍼블리싱을 위한 시네마틱 멀티 무드 Astro 테마입니다.</p>

<p align="center">
  <a href="https://demo.anglefeint.com/">라이브 데모</a>
  ·
  <a href="https://github.com/anglefeint/astro-theme-anglefeint">저장소</a>
  ·
  <a href="https://github.com/anglefeint/astro-theme-anglefeint/blob/main/ASTRO_THEME_LISTING.md">테마 제출 문안</a>
</p>

<p align="center">
  <img alt="Astro" src="https://img.shields.io/badge/Astro-7.3.2-BC52EE?logo=astro&logoColor=white" />
  <img alt="Node" src="https://img.shields.io/badge/Node.js-22.12%2B-339933?logo=node.js&logoColor=white" />
  <img alt="Locales" src="https://img.shields.io/badge/i18n-en%20%7C%20ja%20%7C%20ko%20%7C%20es%20%7C%20zh-0A7EA4" />
  <img alt="Deployment" src="https://img.shields.io/badge/Deploy-Cloudflare%20Workers-F38020?logo=cloudflare&logoColor=white" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT-2EA043" />
</p>

## 템플릿 설치

```bash
npm create astro@latest -- --template anglefeint/astro-theme-anglefeint#starter
```

pnpm을 사용하려면 위의 npm 명령으로 템플릿을 생성하고(의존성 설치는 건너뛰기), 생성된 프로젝트 디렉터리에서 실행하세요:

```bash
pnpm install
```

## 요구 사항

- Node.js `22.12.0+` (LTS 권장)
- 0.8.0 starter의 문서 명령은 Linux에서 npm + Node 22, pnpm 10 + Node 24로 검증했습니다. yarn/bun은 테스트하지 않았습니다. [검증 기록](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/docs/releases/0.8.0.md)을 참고하세요.

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

품질 점검 명령:

```bash
npm run doctor
npm run check
```

`pnpm` 사용:

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
```

## 테마 업그레이드

`#starter`로 만든 프로젝트에서는 대상 릴리스가 기존 starter 및 Astro와 호환되고 로컬 구조를 변경할 필요가 없을 때만 실행하세요:

```bash
npm update @anglefeint/astro-theme
npm run doctor
```

`npm update`는 `package.json`에 지정된 범위 안에서만 업데이트합니다. `^0.5.1`에는 `0.6.0`이 포함되지 않습니다. 호환되지만 범위를 벗어나는 업데이트는 릴리스 노트에 따라 대상 버전을 명시하고, 무조건 `@latest`를 설치하지 마세요. `npm ls @anglefeint/astro-theme astro`로 실제 버전을 확인하세요.

현재 starter의 `doctor`에는 검사와 빌드가 포함됩니다. 성공한 뒤 `npm run preview`로 사이트를 확인하세요. 생성된 어댑터와 로컬 템플릿이 일치하지 않는다는 메시지가 있을 때만 `npm run sync-adapters`를 실행한 뒤 `npm run doctor`를 다시 실행하세요. 이 명령은 상위 저장소의 템플릿을 다운로드하지 않습니다. 이전 프로젝트의 스크립트는 다를 수 있으므로 로컬 `package.json`과 업그레이드 가이드를 확인하세요.

릴리스 노트에 starter 구조 변경이 있으면 새 디렉터리에 최신 템플릿을 만들고 글, 이미지, 개인 설정을 옮기는 것을 권장합니다. 새 설정 보조 파일을 이전 파일로 덮어쓰지 마세요. `npm update`는 패키지만 업데이트하며 모든 이전 starter의 직접 업그레이드를 보장하지 않습니다. [업그레이드 안내](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md)를 참고하세요.

커스텀 코드가 `src/consts` 또는 `@anglefeint/astro-theme/consts` 를 참조하고 있다면 `src/config/site.ts` 로 마이그레이션하세요.

Astro 메이저 버전 마이그레이션은 먼저 공식 가이드를 확인하세요:

- https://docs.astro.build/en/guides/upgrade-to/
- 이후 위 업그레이드 가이드의 검증 체크리스트를 따르세요.

## 새 글 만들기

설정에서 활성화된 모든 로케일에 같은 slug 글을 한 번에 생성합니다:

```bash
npm run new-post -- my-first-post
```

Slug 규칙: 소문자 영문, 숫자, 하이픈만 사용하세요 (예: `my-first-post`).
`src/assets/blog/default-covers/` 에 기본 커버가 있으면 slug 해시 기반으로 안정적인 기본 이미지가 자동 할당됩니다 (`heroImage` 는 나중에 직접 변경 가능).
선택 로케일 지정:

```bash
npm run new-post -- my-first-post --locales en,fr
# 또는
ANGLEFEINT_LOCALES=en,fr npm run new-post -- my-first-post
```

`ANGLEFEINT_LOCALES=...` 문법은 Bash/POSIX 셸용입니다. PowerShell에서는 위의 `--locales` 명령을 사용하세요.

URL 규칙:

- 파일: `src/content/blog/ko/my-first-post.md`
- URL: `/ko/blog/my-first-post/`
- 블로그 목록: `/ko/blog/`
- 라우트를 수동으로 추가할 필요가 없습니다. Astro가 빌드 시 자동 생성합니다.

`--locales`는 글 파일만 만들며 언어를 활성화하지 않습니다. 라우트를 생성하려면 `src/site.config.ts`에서 해당 언어를 추가하거나 활성화하세요.

## 새 페이지 만들기

`new-post` 는 블로그 글만 생성합니다. 커스텀 페이지는 아래 명령으로 생성하세요:

```bash
npm run new-page -- projects --theme base
```

지원 테마: `base`, `ai`, `cyber`, `hacker`, `matrix`.  
명령은 `src/pages/[lang]/projects.astro` 를 만들고 `getStaticPaths()` 로 모든 로케일 라우트를 생성합니다.
slug 규칙: 소문자, 숫자, 하이픈만 허용하며 중첩 경로(예: `projects/labs`)를 지원합니다. `_` 와 대문자는 허용되지 않습니다.

예시 (`projects`에 사용할 명령 하나만 선택하세요. 연속 실행하면 두 번째부터 파일이 이미 있어 실패합니다):

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

| 홈                                                             | 블로그 목록                                                              |
| -------------------------------------------------------------- | ------------------------------------------------------------------------ |
| ![Home preview](public/images/theme-previews/preview-home.png) | ![Blog list preview](public/images/theme-previews/preview-blog-list.png) |

| 글 상세                                                                       |
| ----------------------------------------------------------------------------- |
| ![Blog post preview](public/images/theme-previews/preview-blog-post-open.png) |

| About                                                            |
| ---------------------------------------------------------------- |
| ![About preview](public/images/theme-previews/preview-about.png) |

## 라우트별 분위기

- `/<default-locale>/` (기본적으로 `/` 는 여기로 리다이렉트): Matrix 스타일 터미널 랜딩
- `/:lang/blog`: 사이버펑크 아카이브 무드
- `/:lang/blog/[slug]`: AI 인터페이스형 읽기 레이아웃
- `/:lang/about`: 선택형 해커 스타일 About 페이지

## 테마 네이밍 규약

- 테마 파라미터: `base`, `ai`, `cyber`, `hacker`, `matrix`
- 내부 셀렉터/스크립트 접두사: `ai-*`, `cyber-*`, `hacker-*`
- 기본 구성 레이어: `ThemeFrame -> Shell -> Layout -> Page`

## 주요 기능

- 현재 언어의 Pagefind 글 검색
- 자동 글 목차와 정적 태그 목록
- 코드 복사와 본문 이미지 미리보기
- Astro 7 정적 출력
- Markdown + MDX 콘텐츠 컬렉션
- 스타터에 포함된 예시 로케일: `en`, `ja`, `ko`, `es`, `zh`
- 로케일별 RSS 피드
- sitemap + robots 지원
- 설정 중심의 커스터마이징
- 짧은 페이지에서도 Footer 하단 고정

## 테마 설정

1. 환경 변수로 사이트 정보를 덮어쓰려는 경우에만 `.env.example`을 `.env`로 복사합니다. 그렇지 않으면 `src/site.config.ts`를 사용합니다.
2. `src/site.config.ts` 를 수정합니다:
   - `site.title`, `site.description`, `site.url`, `site.author`, `site.tagline`: 사이트 정체성과 기본 메타데이터
   - `i18n.defaultLocale`: 기본 언어를 설정
   - `i18n.routing.defaultLocalePrefix`: 기본 언어를 `/<default-locale>/`(기본값) 또는 `/` 중 어디에 둘지 설정
   - `i18n.locales`: 지원 언어를 한 곳에서 추가/제거하는 단일 소스
   - `i18n.locales.<code>.messages`: 로케일별 UI 문구 오버라이드
   - `i18n.locales.<code>.meta.label`: 언어 메뉴 표시 이름 (`zh` 기본값은 `简体中文`). 이름을 바꿔도 URL은 변경되지 않습니다
   - `i18n.locales.<code>.site.hero`: 로케일별 홈 hero 문구 오버라이드
   - `social.links`: 소셜 링크
   - `i18n.locales.<code>.about`: 로케일별 About 콘텐츠와 런타임 문구
   - `theme.enableAboutPage`: About 노출 제어
   - `theme.effects.enableRedQueen`: 글 상세 사이드 모니터 이펙트 on/off
   - `theme.comments`: Giscus 활성화/설정 (핵심 ID + 동작 파라미터)
3. `src/content/blog/<locale>/` 의 샘플 글을 교체합니다.

### 선택: Giscus 댓글

댓글은 기본적으로 비활성화되어 있습니다. 활성화하려면:

1. `src/site.config.ts` 에서 `theme.comments.enabled = true` 로 설정합니다.
2. 필수 항목을 입력합니다:
   - `theme.comments.repo`
   - `theme.comments.repoId`
   - `theme.comments.category`
   - `theme.comments.categoryId`
3. 선택 항목:
   - `theme.comments.mapping`
   - `theme.comments.term` (`mapping = "specific"` 일 때 필수)
   - `theme.comments.number` (`mapping = "number"` 일 때 필수)
   - `theme.comments.strict`
   - `theme.comments.reactionsEnabled`
   - `theme.comments.emitMetadata`
   - `theme.comments.inputPosition` (`top` 또는 `bottom`)
   - `theme.comments.theme`
   - `theme.comments.lang`
   - `theme.comments.loading`
   - `theme.comments.crossorigin`

핵심 ID가 없으면 댓글을 표시하지 않습니다. 댓글 활성화 시 `mapping="specific"`의 `term`이 비어 있거나 `mapping="number"`의 `number`가 양의 정수 문자열이 아니면 설정 오류로 개발 서버 또는 빌드가 중단될 수 있습니다.

CLI는 병합된 설정에서 활성화된 언어를 사용합니다. 설정 오류는 생성을 중단하며, 명시적인 `--locales` 또는 `ANGLEFEINT_LOCALES`는 설정을 읽지 않고 언어를 지정합니다.

## 설정 표면

- 단일 엔트리: `src/site.config.ts`
- 홈 설명은 내장 및 대체 언어 문구를 포함한 `messages.siteDescription`을 우선 사용하고, 비어 있을 때만 `site.description`을 사용합니다.
- 언어 설정은 기본값과 깊게 병합됩니다. 비활성화하려면 `i18n.locales.<code>.meta.enabled = false`를 사용합니다. 기본 언어는 항상 활성화됩니다.
- 어댑터 레이어(직접 수정 비권장): `src/config/site.ts`, `src/config/theme.ts`, `src/config/about.ts`, `src/config/social.ts`
- 사이트 정보는 `PUBLIC_*` 환경 변수로도 덮어쓸 수 있습니다

## 문서

- [아키텍처](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/docs/ARCHITECTURE.md)
- [비주얼 시스템](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/docs/VISUAL_SYSTEMS.md)
- [제출 체크리스트](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/docs/THEME_SUBMISSION_CHECKLIST.md)
- [테마 등록 초안](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/ASTRO_THEME_LISTING.md)
- [업그레이드 가이드](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md)
- [변경 이력](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/CHANGELOG.md)

## 글 검색

검색은 기본적으로 켜져 있습니다. 헤더에서 현재 언어의 글 제목과 본문을 검색합니다. `npm run build`가 색인을 자동 생성하여 정적 사이트와 함께 배포합니다. 별도 서버나 계정은 필요하지 않습니다.

`src/site.config.ts`의 `theme.search.enabled: false`로 검색과 색인 생성을 끕니다. 글 frontmatter의 `search: false`는 해당 글만 제외합니다. 탐색 메뉴, 목차, 관련 글, 댓글과 장식 문구는 수집하지 않습니다.

로컬 검색은 `npm run build` 실행 후 `npm run preview`로 확인하세요. `npm run dev`는 개발 안내를 표시합니다. 글을 수정한 뒤 다시 빌드하면 색인이 갱신됩니다.

## 글 목차

글 페이지는 Markdown `##`, `###` 제목으로 접을 수 있는 목차를 자동 생성하며 넓은 화면에서는 본문 오른쪽에 고정되고 좁은 화면에서는 본문 앞에 표시됩니다. 기본적으로 펼쳐집니다. 해당 제목이 없으면 숨깁니다. 긴 제목은 줄바꿈되며 번호를 추가하지 않습니다.

`src/site.config.ts`의 `theme.toc.enabled`로 사이트 기본값(처음에는 `true`)을 설정합니다. 글 frontmatter의 `toc: false`는 목차를 숨기고, `toc: true`는 사이트 기본값이 꺼져 있어도 표시합니다. 생략하면 사이트 설정을 따릅니다.

MDX의 Markdown 제목은 지원하지만 컴포넌트에서 생성하거나 HTML/JSX로 작성한 제목은 자동 수집하지 않습니다. 사용자 정의 글 라우트는 `render(post)`의 `headings`를 `BlogPost`에 전달해야 합니다. 전달하지 않으면 목차가 표시되지 않습니다.

## 태그 탐색

글 frontmatter에 `tags: ["Astro", "프론트엔드"]`를 추가하면 빌드 시 언어별 태그 목록과 페이지별 글 목록이 생성됩니다. 태그가 없는 글은 그대로 유지됩니다. `src/site.config.ts`에서 `theme: { tags: { enabled: false } }`로 끌 수 있습니다. 대소문자를 구분하며 앞뒤 공백과 중복을 제거합니다. 특수 이름은 안정적인 URL로 인코딩되며 이름 변경 시 URL도 바뀝니다. 추가 명령은 필요하지 않습니다.

`/<locale>/tags/`에 직접 접속하거나 블로그의 태그 링크를 이용할 수 있습니다. 글의 태그는 `/<locale>/tags/<tagSlug>/`를 엽니다. 해당 언어에 태그가 없으면 목록은 비어 있고 블로그의 태그 진입 링크는 숨겨집니다.

## 코드 복사

코드 블록 오른쪽 위에 복사 버튼이 자동으로 표시됩니다. 일반 Markdown을 사용하면 되며 추가 설정은 없습니다. HTTPS 또는 localhost가 필요하고 실패 시 수동 복사 안내가 표시됩니다.

## 본문 이미지 미리보기

본문에서 링크가 없는 이미지는 클릭 또는 Enter/Space로 확대할 수 있습니다. Esc, 닫기 버튼 또는 배경으로 닫으며 읽던 위치를 유지합니다. 링크가 있는 이미지는 기존 이동 동작을 유지합니다.

브라우저가 이미 선택한 이미지 소스를 표시하며 더 높은 해상도의 원본을 별도로 가져오지 않습니다. 대표 이미지와 링크 또는 버튼 안의 이미지는 제외됩니다.

## 글 공유 이미지

0.5.0 및 해당 starter에서 사용할 수 있으며, 0.4.0에는 포함되지 않습니다.

`npm run build`는 `ogImage`가 없는 글에 제목·작성자·사이트 이름을 담은 1200×630 PNG를 생성합니다. 본문의 `heroImage`는 바뀌지 않습니다. 글 옆 이미지는 `ogImage: ./share.png`, public 이미지는 `ogImage: /images/share.png`로 지정합니다. HTTPS 주소도 지원하지만 가용성과 캐시는 제공자에게 달려 있습니다. 로컬 파일이 없으면 오류가 발생합니다.

`src/site.config.ts`에서 `theme: { socialImage: { enabled: false } }`로 자동 생성을 끌 수 있습니다. 직접 지정한 이미지는 항상 우선하며, 나머지는 기존 표지 또는 기본 이미지로 돌아갑니다. 변경 후 다시 빌드하고 배포하세요. 생성 파일은 `dist/_social/`에 있으며 글 HTML의 `og:image`에서 정확한 URL을 확인할 수 있습니다. 외부 플랫폼의 링크 캐시는 바로 갱신되지 않을 수 있습니다.

내장 폰트로 기본 5개 언어를 지원하며 이미지 API나 브라우저 JS는 필요 없습니다. 긴 제목은 이미지에서만 줄입니다. 모든 이모지와 문자 체계를 보장하지는 않습니다. 빌드 시간과 설치 용량은 늘지만 글 페이지에서 이 폰트를 추가로 다운로드하지 않습니다.

## 라이선스

MIT License. `LICENSE` 를 참고하세요.

## 선택적 음악 플레이어

기본적으로 비활성화되어 있습니다. 오디오를 `public/music/`에 넣고 다음 설정을 `src/site.config.ts`에 병합하세요:

```ts
theme: {
  music: {
    enabled: true,
    tracks: [{ title: 'My Song', src: '/music/my-song.mp3' }],
  },
},
```

각 곡에 `title`, `src`를 지정하며 `artist`는 선택 사항입니다. HTTPS 오디오 URL도 지원합니다. 목록이 비어 있으면 표시하지 않습니다. 재생을 눌러야 오디오를 불러옵니다. 같은 탭 세션에서 곡, 재생 위치, 음량을 기억하지만 페이지 이동 후에는 다시 재생을 눌러야 합니다. 페이지 간 끊김 없는 재생은 지원하지 않습니다.
