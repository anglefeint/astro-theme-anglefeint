---
tags: ['anglefeint', 'starter']
title: '사용 가이드 3: 필요한 기능 켜기와 사용자 설정'
subtitle: '음악, 댓글, About, 페이지 나누기, 기능 스위치, 다국어를 필요에 따라 설정합니다.'
description: '음악, 댓글, About, 페이지 나누기, 기능 스위치, 다국어를 필요에 따라 설정합니다.'
pubDate: '2026-03-07'
updatedDate: '2026-09-19'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

## 기본 상태부터 보고 필요한 것만 변경

함께 제공되는 0.8.0 starter를 기준으로 설명합니다. 모든 TypeScript 예제는 `src/site.config.ts`의 `defineThemeConfig({...})` 객체에 합칩니다. 변경할 항목만 설정하세요.

| 기능                                  | 기본 상태              |
| ------------------------------------- | ---------------------- |
| 검색, 글 목차, 태그, 자동 공유 이미지 | 켜짐                   |
| 본문 이미지 미리보기, 코드 복사       | 자동 적용, 설정 불필요 |
| About, 글의 Red Queen 모니터          | 켜짐                   |
| 음악, Giscus 댓글                     | 꺼짐                   |
| 홈 최신 글 / 블로그 페이지당 글       | 3 / 9                  |

## 1. 음악 플레이어 켜기

음원을 `public/music/my-song.mp3`에 넣고 아래 설정을 추가합니다. 폴더가 없으면 만드세요.

```ts
theme: {
  music: {
    enabled: true,
    tracks: [
      { title: 'My Song', artist: 'Artist Name', src: '/music/my-song.mp3' },
    ],
  },
},
```

주소에는 `public`을 넣지 않습니다. 곡마다 `title`, `src`는 필수이고 `artist`는 선택입니다. 곡을 늘리려면 `tracks` 배열에 객체를 추가하세요. HTTPS 음원 직링크도 가능하지만 로컬 디스크 경로나 음악 서비스 공유 페이지는 음원 주소가 아닙니다. 공백과 역슬래시를 피하고 간단한 파일명을 쓰세요. 곡은 기본 제공하지 않습니다.

재생 목록이 비면 플레이어를 표시하지 않습니다. 활성 상태에서 제목이나 주소 형식이 잘못되면 설정 오류가 납니다. 공통 테마 레이아웃을 쓰는 페이지에 표시되며 페이지별 스위치는 없습니다. 데스크톱에서는 왼쪽 아래에 있고 모바일에서는 페이지마다 접힌 상태로 시작합니다. 펼치면 맨 위로 가기 버튼을 잠시 숨깁니다.

먼저 `/music/my-song.mp3`를 직접 열어 접근 여부를 확인하고 페이지에서 PLAY를 누르세요. 재생 조작 후 음원을 불러오며 페이지를 여는 것만으로 재생하지 않습니다. 재생을 시작한 뒤에는 곡이 끝나면 다음 곡을 자동 재생하고, 마지막 곡 다음에는 첫 곡으로 돌아갑니다. 같은 탭 세션에서 곡, 위치, 볼륨을 저장합니다. 페이지 이동 시 일시 정지되며 다음 페이지에서 재생을 눌러야 이어집니다. 페이지 사이의 끊김 없는 재생은 아닙니다. 저장소를 사용할 수 없어도 재생은 되지만 상태 기억은 보장되지 않습니다. `enabled: false`로 끕니다.

## 2. Giscus 댓글 켜기

[Giscus 설정 페이지](https://giscus.app/)에 따라 공개 GitHub 저장소, Discussions, Giscus 앱, 카테고리를 준비합니다. 생성된 설정에서 실제 repository/category ID를 가져옵니다.

```ts
theme: {
  comments: {
    enabled: true,
    repo: 'yourname/your-repository',
    repoId: 'REPLACE_WITH_REPO_ID',
    category: 'Announcements',
    categoryId: 'REPLACE_WITH_CATEGORY_ID',
    mapping: 'pathname',
    lang: '',
  },
},
```

두 `REPLACE_WITH_...` 값과 실제 카테고리 이름을 바꾸세요. 테마 설정만 입력하면 되며 글마다 Giscus script 전체를 붙일 필요는 없습니다.

댓글은 글 페이지에 표시됩니다. 핵심 repo/category 네 필드가 없으면 렌더링하지 않으며 임시 값을 넣어도 제대로 작동하지 않습니다. `lang: ''`는 글 언어를 따릅니다(`zh`는 `zh-CN`). 기본값은 고정된 `en`입니다.

일반적으로 `mapping: 'pathname'`을 유지하면 글 경로에 토론을 연결합니다. `specific`은 비어 있지 않은 `term`, `number`는 양의 정수를 문자열로 지정한 `number`가 필요합니다. 두 모드에서 필수 값이 없거나 잘못되면 오류가 납니다.

글 하단에서 확인하고 없으면 ID, 저장소 권한, 네트워크, 브라우저 차단을 확인하세요. `inputPosition`, `theme`, `reactionsEnabled` 등은 기본값을 유지해도 됩니다. `strict`와 `reactionsEnabled`는 문자열 `'0'` / `'1'`을 사용합니다.

## 3. About 내용 교체하기

About은 기본으로 켜져 있습니다. 페이지 템플릿 대신 언어별 설정으로 본문을 바꿉니다.

```ts
i18n: {
  locales: {
    ko: {
      about: {
        metaLine: '$ profile booted | mode: builder',
        sections: {
          who: 'Introduce yourself here.',
          what: 'Describe what you build.',
          ethos: ['Keep learning.', 'Build useful things.'],
          now: 'What you are working on now.',
          contactLead: 'Get in touch.',
          signature: '> Your signature',
        },
        contact: {
          email: 'you@example.com',
          githubUrl: 'https://github.com/yourname',
          githubLabel: 'GitHub',
        },
      },
    },
  },
},
```

이 예제는 한국어 About만 바꿉니다. 다른 언어도 각각 작성해야 하며 자동 번역하지 않습니다. `sidebar`, `labels`, `modals`, `effects`도 재정의할 수 있지만 먼저 본문과 연락처를 바꾸면 됩니다. About 도구 창은 테마의 상호작용 예시이며 문구를 채운다고 실제 AI 서비스와 연결되지 않습니다.

`/ko/about/`에서 본문과 이메일·GitHub 링크를 확인하세요. `theme.enableAboutPage: false`는 메뉴를 숨기고 About 경로 생성도 중단합니다. 변경 후 다시 빌드하세요.

## 4. 글 수와 페이지 나누기 조정

앞의 두 개수만 설정해도 됩니다. 페이지 나누기 모양을 고정하려면 `pagination`을 추가하세요.

```ts
theme: {
  homeLatestCount: 3,
  blogPageSize: 9,
  pagination: {
    windowSize: 7,
    showJumpThreshold: 12,
    jump: { enabled: true, enterToGo: true },
    style: { enabled: true, mode: 'fixed', variants: 9, fixedVariant: 1 },
  },
},
```

`homeLatestCount`는 홈의 최신 글 수, `blogPageSize`는 블로그 페이지당 글 수이며 태그 글 목록도 같은 값을 사용합니다. 적절한 양의 정수를 지정하세요.

`windowSize`는 페이지 번호 표시 범위로 코드에서 5–21로 제한하며 페이지당 글 수와 다릅니다. 이동 입력창은 `jump.enabled`가 참이고 총 페이지 수가 `showJumpThreshold`를 넘을 때만 표시됩니다. 기본은 12페이지 초과입니다. `enterToGo`는 Enter 이동을 제어합니다.

스타일 모드는 `fixed`, `sequential`, `random`입니다. 예제는 첫 번째 변형에 고정합니다. 기본 `random`은 언어, 경로, 페이지 정보 등을 바탕으로 안정적으로 선택하므로 새로고침마다 바뀌지 않습니다. `style.enabled: false`는 기본 변형을 쓸 뿐 페이지 나누기를 끄지 않습니다. 글이 충분히 쌓이면 목록 하단에서 확인하세요.

## 5. 필요 없는 부가 기능 끄기

아래는 끌 수 있는 옵션을 보여주는 예이지 전부 끄라는 권장은 아닙니다. 변경할 항목만 남기세요.

```ts
theme: {
  enableAboutPage: false,
  effects: { enableRedQueen: false },
  search: { enabled: false },
  toc: { enabled: false },
  tags: { enabled: false },
  socialImage: { enabled: false },
},
```

`enableRedQueen`은 글의 Red Queen 모니터만 제어하며 AI 테마 전체나 모든 효과를 끄지 않습니다. `toc`는 사이트 기본값이라 개별 글의 `toc: true`가 우선합니다. `socialImage`를 꺼도 수동 `ogImage`는 유지됩니다. 검색과 태그는 입구와 빌드 결과물에 함께 영향을 줍니다. 네 가지 분위기는 기존 레이아웃으로 결정되며 사이트 전체를 네 테마 사이에서 전환하는 설정은 없습니다.

## 6. 언어 추가와 홈 주소 변경

프랑스어를 추가하는 예입니다.

```ts
i18n: {
  locales: {
    fr: {
      meta: { label: 'Français', hreflang: 'fr', ogLocale: 'fr_FR', enabled: true, fallback: ['en'] },
      site: { hero: 'Bienvenue sur mon blog.' },
      messages: { nav: { home: 'Accueil' }, siteDescription: 'Mes notes et projets.' },
    },
  },
},
```

이후 `npm run new-post -- french-note --locales fr`로 콘텐츠를 만듭니다. UI 문구, 홈 소개, About, 글 번역은 직접 작성해야 합니다. `fallback`은 누락된 설정과 문구를 보완할 뿐 글을 번역하거나 다른 언어의 글을 목록에 넣지 않습니다. 필요한 경우 기본 언어가 대체 언어 체인에 추가됩니다.

메뉴 언어 이름은 `meta.label`로 바꿉니다. 예를 들어 `zh`의 기본 이름은 “简体中文”입니다. `hreflang` / `ogLocale`은 언어 메타 정보이며 표시 이름을 바꿔도 언어 코드나 URL은 바뀌지 않습니다.

기본 `i18n.routing.defaultLocalePrefix: 'always'`는 `/`를 기본 언어 홈으로 보냅니다. `'never'`는 `/`를 기본 언어 홈으로 쓰고 `/<기본 언어>/`를 `/`로 보냅니다. 기본 언어 홈에만 적용하며 `/ko/blog/`를 `/blog/`로 바꾸지 않습니다.

## 7. 설정 합치기와 검증

예를 들어 글 수와 음악은 하나의 `theme` 안에 합칩니다.

```ts
theme: {
  homeLatestCount: 5,
  music: {
    enabled: true,
    tracks: [{ title: 'My Song', src: '/music/my-song.mp3' }],
  },
},
```

기존 `theme.comments` 등도 같은 객체에 유지하세요. 예제로 자신의 설정 전체를 덮어쓰지 마세요. 배열은 전체를 교체하므로 곡이나 소셜 링크를 추가할 때 기존 항목도 남겨야 합니다.

개발 화면에서 기능을 확인하고 `npm run check`, `npm run build`를 실행합니다. 검색은 빌드 후 `npm run preview`로 확인합니다. `npm run doctor`는 더 넓은 검사를 포함하므로 프로젝트나 업그레이드 문제를 진단할 때 사용하세요. 변경 사항 공개에는 빌드 결과물 재배포가 필요합니다.

## 8. 푸터 출처 표시 또는 숨기기

푸터에는 빌드 시점의 연도와 `site.title`이 표시됩니다. 기본적으로 테마와 Astro 링크도 표시됩니다: `© 2026 My Blog · Theme by Anglefeint · Built with Astro`. 연도는 고정값이 아니라 빌드 시 생성됩니다.

두 기술 출처를 모두 숨기려면 다음 설정을 `src/site.config.ts`에 병합하세요:

```ts
export const THEME_CONFIG = defineThemeConfig({
  theme: {
    footer: { showCredits: false },
  },
});
```

`showCredits: true`로 다시 표시할 수 있습니다. 숨기면 두 링크가 모두 제거되고 저작권 줄은 유지됩니다. 선택 사항인 `site.tagline`은 이 스위치와 별개로 사용자 지정 일반 텍스트를 추가합니다. 기본값은 빈 문자열이며, 이전 기본값인 `Built with Astro.`는 중복을 방지하기 위해 내장 출처로 처리합니다. `All rights reserved`는 추가하지 않습니다.

공개 데모는 별도의 사이트 이름, 도메인, 번역된 소개를 사용합니다. 새 starter는 일반 기본값을 유지하며, 사용자는 계속 `src/site.config.ts`에서 설정합니다. 이전 starter를 업그레이드할 때는 업그레이드 안내에 따라 해당 설정 파일도 이전하세요. npm 패키지만 업데이트하면 이전 어댑터에 이 옵션이 추가되지 않습니다.

## 이 가이드 시리즈

- [사용 가이드 1: 블로그 시작하기](/ko/blog/starter-guide-1-configure-your-site/)
- [사용 가이드 2: 글 작성과 콘텐츠 관리](/ko/blog/starter-guide-2-languages-and-routing/)
- [사용 가이드 3: 필요한 기능 켜기와 사용자 설정](/ko/blog/starter-guide-3-comments-about-and-theme-toggles/)
