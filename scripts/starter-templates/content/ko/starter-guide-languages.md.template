---
tags: ['anglefeint', 'starter']
title: '사용 가이드 7: 더 많은 언어의 독자 맞이하기'
subtitle: '언어와 홈 주소를 선택하고 현지화 문구를 작성한 뒤 글과 Fragments의 번역을 추가합니다.'
description: '실제 설정을 기준으로 언어 활성화·비활성화, 기본 언어, 홈 라우트, 대체 동작, 새 언어 추가와 글·Fragments의 다국어 연결을 설명합니다.'
pubDate: '2026-11-13'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/hacker-01.webp'
---

이 글은 입문 가이드의 7 / 8편입니다. [전체 가이드 순서](/ko/blog/starter-guide-1-configure-your-site/#tutorial-order) · [필드별 설정 사전](/ko/blog/config-reference/).

처음에는 한 언어로만 쓰고 나중에 번역을 추가해도 됩니다. 테마는 다국어 UI와 라우트를 제공하지만 글을 자동 번역하지는 않습니다. 언어 활성화, UI 문구 수정, 번역 글 게시는 서로 다른 작업입니다.

아래 설정은 모두 `src/site.config.ts`의 기존 `defineThemeConfig({...})`에 합칩니다. 원래 `i18n`과 다른 개인 설정을 유지하고 같은 이름의 객체를 중복 추가하지 마세요.

## 1. 필요한 언어부터 결정하기

기본으로 아홉 언어를 활성화하며 기본 언어는 `en`입니다.

| 코드      | 언어               |
| --------- | ------------------ |
| `en`      | English            |
| `zh`      | 简体中文           |
| `zh-hant` | 繁體中文           |
| `ja`      | 日本語             |
| `ko`      | 한국어             |
| `es`      | Español            |
| `pt-br`   | Português (Brasil) |
| `de`      | Deutsch            |
| `ru`      | Русский            |

중국어 간체와 영어만 남기면서 기본 언어를 중국어 간체로 바꾸고 싶다면 다음 설정을 선택할 수 있습니다. 이런 조정이 필요 없다면 프로젝트 기본값을 유지하세요.

```ts
i18n: {
  defaultLocale: 'zh',
  locales: {
    zh: { meta: { enabled: true } },
    en: { meta: { enabled: true } },
    ja: { meta: { enabled: false } },
    ko: { meta: { enabled: false } },
    es: { meta: { enabled: false } },
    'pt-br': { meta: { enabled: false } },
    de: { meta: { enabled: false } },
    ru: { meta: { enabled: false } },
    'zh-hant': { meta: { enabled: false } },
  },
},
```

설정은 기본값과 병합하므로 언어를 생략해도 꺼지지 않습니다. `meta.enabled: false`를 명시해야 합니다. 기본 언어는 항상 활성화되므로 `defaultLocale: 'zh'`를 지정하면서 zh를 꺼서 숨기려고 하면 안 됩니다.

언어를 끄면 테마 언어 입구와 해당 표준 페이지 생성을 중단하지만 디렉터리의 글 파일은 삭제하지 않습니다. 다시 켜면 남아 있는 콘텐츠를 다시 생성할 수 있습니다. 언어 코드를 바꾸면 표시 이름만이 아니라 디렉터리와 주소도 바뀌므로 기존 사이트는 이전 링크를 직접 처리해야 합니다.

## 2. 기본 언어 홈 주소 선택하기

기존 `i18n`에 `routing`을 추가하거나 수정하세요.

```ts
i18n: {
  defaultLocale: 'zh',
  routing: { defaultLocalePrefix: 'never' },
},
```

기본 언어가 zh인 예시입니다.

| 설정                  | `/`                        | `/zh/`          | `/en/`               |
| --------------------- | -------------------------- | --------------- | -------------------- |
| `'always'`, 테마 기본 | `/zh/`로 정적 이동         | 중국어 간체 홈  | 영어 홈(활성화 필요) |
| `'never'`             | 중국어 간체 홈을 직접 표시 | `/`로 정적 이동 | 영어 홈(활성화 필요) |

기본 언어는 설정이 정하며 방문자 브라우저 언어에 따라 자동 전환하지 않습니다. 빌드한 HTML 이동 페이지를 사용하므로 앱 서버는 필요하지 않습니다. 방문할 때 이동 안내가 잠시 보일 수 있습니다.

**이 설정은 기본 언어 홈에만 영향을 줍니다.** 중국어 간체 블로그, 글, About, Decoder, Fragments는 계속 `/zh/`를 유지합니다. `/zh/blog/my-first-post/`가 `/blog/my-first-post/`로 바뀌지는 않습니다. 기본 언어를 바꿔도 기존 콘텐츠 파일을 옮기거나 번역하지 않습니다.

## 3. 언어별 홈과 UI 문구 작성하기

해당 언어 아래에 문구를 설정하세요.

```ts
i18n: {
  locales: {
    zh: {
      meta: { label: '简体中文' },
      site: {
        homeTitle: '小林的数字花园',
        hero: '记录开发、阅读和生活。',
      },
      messages: {
        siteDescription: '小林的个人博客，分享项目和学习笔记。',
        nav: { home: '首页', blog: '文章', about: '关于我' },
      },
    },
    en: {
      site: {
        homeTitle: "Lin's Digital Garden",
        hero: 'Notes on code, books and everyday life.',
      },
      messages: { siteDescription: 'Projects and learning notes by Lin.' },
    },
  },
},
```

- `meta.label`은 언어 메뉴 이름입니다. “简体中文”을 “中文”으로 바꿔도 코드 zh나 URL을 바꾸지 않습니다.
- `site.homeTitle`은 현재 언어 홈의 보이는 대제목만 바꿉니다. 사이트 전체 이름은 최상위 `site.title`이나 환경 덮어쓰기 값이 정합니다.
- `site.hero`는 홈 대제목 아래에 보이는 소개입니다.
- `messages.siteDescription`은 홈 메타 설명이며 보이는 소개는 아닙니다. 최상위 `site.description`만 바꿔도 내장 홈 설명이 대체되지 않을 수 있습니다.
- `messages.nav`는 해당 UI 입구의 문구만 바꾸며 라우트나 글 콘텐츠는 바꾸지 않습니다.

마찬가지로 `i18n.locales.<코드>.about`은 해당 언어 About 콘텐츠, `messages` 아래 모듈은 UI 문구를 수정합니다. About과 Decoder는 계속 전역 기능 스위치가 제어하며 번역을 썼다고 자동 활성화되지 않습니다. 예시는 [페이지와 기능 꾸미기](/ko/blog/starter-guide-3-comments-about-and-theme-toggles/)를 참고하세요.

언어 메타데이터와 기본 홈 주소는 [언어 사전](/ko/blog/config-languages/#registry), 홈 세 문구의 차이는 [홈 사전](/ko/blog/config-home/#home-title)에 있습니다.

## 4. 입력하지 않은 필드가 어디서 오는지 이해하기

`meta.fallback`은 설정 대체 언어를 선택합니다. 중국어 간체 설정이 없을 때 영어를 참고하려면 다음을 합칠 수 있습니다.

```ts
i18n: {
  locales: {
    zh: { meta: { fallback: ['en'] } },
  },
},
```

en은 프로젝트 언어 설정에 존재해야 합니다. 비기본 언어의 필수 대체 연결에는 기본 언어가 추가됩니다. 자기 자신, 중복 항목, 없는 언어는 걸러집니다. 배열은 전체를 대체하므로 여러 대체 언어의 순서는 한 번에 모두 쓰세요.

필드마다 대체 규칙은 다릅니다.

| 콘텐츠                          | 현재 동작                                                                                                                            |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| 일반 `messages`                 | 내장 영어에서 시작해 대체 연결 순서로 내장 언어 팩과 개인 덮어쓰기를 병합하며 현재 언어가 우선합니다. 내장 번역도 병합에 참여합니다. |
| 홈 `homeTitle`                  | 현재 언어와 대체 언어에서 앞뒤 공백을 제거한 비어 있지 않은 제목을 차례로 찾고 마지막에는 사이트 이름을 씁니다.                      |
| 홈 `hero`                       | 현재·대체 언어에서 정의된 값을 찾습니다. `''`는 의도적 비우기이므로 다음 언어로 넘어가지 않습니다.                                   |
| About 설정                      | 기본 About부터 대체 연결에 따라 각 언어의 개인 About 설정을 병합합니다.                                                              |
| 홈 `messages.home.transmission` | 현재 언어 개인 설정 → 영어 개인 설정 → `Knock, knock.`를 독립 사용하며 일반 문구의 전체 대체 연결은 따르지 않습니다.                 |

따라서 영어 내비게이션을 바꿔도 기존 중국어 간체 내장 내비게이션이 영어 설정 문구로 바뀐다는 뜻은 아닙니다. 특정 언어 UI를 바꾸려면 해당 언어에서 덮어쓰세요. 언어 페이지를 꺼도 설정이 삭제되지는 않으며 대체 연결에 남은 설정은 여전히 보완에 참여할 수 있습니다.

대체는 설정과 UI 문구만 채웁니다. 영어 글을 중국어 간체 블로그에 자동 포함하거나 다른 언어 파일을 생성하지 않습니다. 콘텐츠 번역 서비스로 생각하지 마세요.

## 5. 새 언어 추가하기

예를 들어 프랑스어는 기존 locales에 fr을 추가하고 앞서 켜거나 끈 언어 설정은 유지하세요.

```ts
i18n: {
  locales: {
    fr: {
      meta: {
        label: 'Français',
        hreflang: 'fr',
        ogLocale: 'fr_FR',
        enabled: true,
        fallback: ['en'],
      },
      site: {
        homeTitle: 'Le jardin de Lin',
        hero: 'Notes de lecture et projets.',
      },
      messages: {
        siteDescription: 'Le blog personnel de Lin.',
        nav: { home: 'Accueil', blog: 'Articles', about: 'À propos' },
      },
    },
  },
},
```

fr은 디렉터리와 라우트 코드입니다. 표준 소문자 코드를 권장합니다. 생성 명령은 `fr`, `pt-br`, `zh-hant`처럼 두세 글자와 선택적인 하이픈 접미사 하나를 받으며 경로나 공백은 안 됩니다. 예시는 기존 기본 언어를 유지하며 프랑스어를 자동으로 기본 언어로 바꾸지 않습니다.

`hreflang`은 페이지 대체 언어 링크의 식별자이며 생략하면 언어 코드를 사용합니다. `ogLocale`은 Open Graph의 언어·지역 식별자로 경로 코드와 형식이 다릅니다. 예시는 fr_FR입니다. 메타 정보는 본문을 번역하지 않으며 검색 엔진 수록을 보장하지 않습니다.

새 언어에는 완전한 내장 번역 팩이 없습니다. 위 조각은 몇 입구만 번역하며 나머지는 대체값을 사용합니다. 완전한 프랑스어 UI가 필요하면 검색, 페이지 나누기, 댓글 안내, 도구, About 등의 문구도 추가하세요. 실제 페이지에 나타날 내용부터 시작하면 되며 글 하나를 표시하려고 테마 구현부터 수정할 필요는 없습니다.

## 6. 글의 번역 추가하기

중국어 간체와 영어 글 뼈대를 함께 만듭니다.

```bash
npm run new-post -- my-first-post --locales zh,en
```

`src/content/blog/zh/my-first-post.md`에는 중국어 간체, `src/content/blog/en/my-first-post.md`에는 영어를 씁니다. 새 언어 예시는 `npm run new-post -- french-note --locales fr`로 만든 다음 직접 콘텐츠를 작성할 수 있습니다.

기존 중국어 간체 글을 번역하려면 대상 언어 디렉터리에 복사하고 파일 기본 이름을 유지한 뒤 제목, 소개, 본문을 번역해도 됩니다. 상대 이미지 경로는 새 파일 위치에서 계산하므로 디렉터리 깊이가 바뀌면 확인하세요. 같은 파일이 있으면 생성 명령은 건너뛰며 원고를 덮어쓰지 않습니다.

번역 연결은 언어 디렉터리를 제외한 전체 slug를 사용합니다. zh/my-first-post와 en/my-first-post는 번역입니다. 영어 파일 이름을 my-story로 바꾸면 제목이 같아도 다른 글이며 자동 연결하지 않습니다. 중첩 디렉터리도 같아야 합니다.

글 페이지의 언어 메뉴는 같은 slug의 대상 글이 있으면 번역으로, 없으면 해당 언어 블로그 목록으로 갑니다. 검색 엔진용 대체 언어 링크는 실제 존재하는 활성 번역만 선언하며 목록을 다른 언어 글인 것처럼 표시하지 않습니다.

`--locales`는 파일만 만들며 언어를 켜지 않습니다. 생략 시 `ANGLEFEINT_LOCALES`를 먼저 보고 없으면 프로젝트 활성 언어를 사용합니다. 명시적 매개변수는 환경변수보다 우선합니다. 뼈대 생성과 본문 번역은 별도 작업입니다.

## 7. Fragments와 다른 페이지의 언어 전환

Fragment 번역은 같은 frontmatter `id`로 연결하며 파일 이름으로 찾지 않습니다. 나중에 추가하려면 원본을 대상 언어 디렉터리로 복사해 id와 pubDate를 유지하고 제목·본문을 번역하세요. new-fragment 재실행은 새 정체성을 만들므로 같은 내용의 번역 추가에 쓰면 안 됩니다.

같은 `npm run new-fragment -- --locales zh,en` 호출은 ID와 타임스탬프를 공유하는 두 언어 뼈대를 만듭니다. 목록 언어 전환은 항상 대상 언어 첫 페이지로 가며 같은 번역을 바로 찾는다고 보장하지 않습니다. 전체 규칙은 [Fragment 게시하기](/ko/blog/starter-guide-5-fragments/)에 있습니다.

글 댓글의 다국어 공유는 `theme.comments.shareAcrossLocales`를 별도로 켜야 하며 기본은 꺼짐입니다. Fragment 댓글은 같은 ID로 공유합니다. UI 언어와 토론 연결은 별개이며 댓글 본문은 자동 번역하지 않습니다. [독자에게 댓글 받기](/ko/blog/starter-guide-4-giscus-comments/)를 참고하세요.

`new-page` 사용자 Astro 페이지는 활성 언어에 라우트를 만들지만 소스 파일은 하나입니다. 언어별 콘텐츠를 제공해야 하며 언어마다 페이지를 자동 복사하거나 번역하지 않습니다.

## 8. 수정 후 확인할 결과

먼저 dev에서 활성 언어의 홈을 각각 열어 메뉴 이름, 홈 제목, 소개, About을 확인하세요. 번역이 있는 글과 없는 글을 하나씩 확인해 언어 전환을 점검합니다. 언어 목록과 디렉터리 코드는 정확히 일치해야 합니다.

배포 전에 dev를 멈추고 실행하세요.

```bash
npm run doctor
npm run preview
```

doctor는 검사와 빌드를 포함하므로 성공 직후 check나 build를 다시 실행할 필요는 없습니다. 빌드 뒤 preview에서 언어별 검색을 확인하세요. 인덱스는 현재 언어만 검색하며 모든 언어를 섞지 않습니다. 활성 언어별 RSS는 `/<코드>/rss.xml`이며 해당 언어 글만 포함합니다.

도메인이 맞는지 확인하고 `dist/` 전체를 다시 배포하세요. 언어 활성화·비활성화, 기본 주소, 콘텐츠 변경 모두 재빌드가 필요합니다. 로컬 설정만 바꿔서는 온라인 페이지가 바뀌지 않습니다. 재배포 시 이전 산출물을 정리해야 하며 언어 끄기는 이전 URL의 자동 리다이렉트가 아닙니다.

| 현상                                  | 먼저 확인할 사항                                                                                      |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| 메뉴에 불필요한 언어가 남음           | 덮어쓰기만 삭제하고 enabled: false를 명시하지 않았는지 확인하세요.                                    |
| 기본 언어를 끌 수 없음                | 여전히 defaultLocale인지 확인하고 먼저 새 기본 언어를 선택하세요.                                     |
| 파일은 만들었는데 페이지가 없음       | 언어 활성화, 일치하는 디렉터리 코드, 재빌드를 확인하세요.                                             |
| 페이지에 영어가 남음                  | 새 언어에서 일부 문구만 덮어썼거나 About 콘텐츠가 빠졌는지 확인하세요.                                |
| 제목 변경이 보이지 않음               | 전역 site.title, 홈 homeTitle, hero, 페이지 messages 중 무엇을 바꿨는지와 환경 덮어쓰기를 확인하세요. |
| 언어 전환 후 목록으로 이동            | 같은 slug 번역이 없는 경우의 현재 대체 동작입니다.                                                    |
| never 설정 후에도 글 언어 접두사 존재 | 이 스위치는 기본 언어 홈만 바꾸므로 예상된 동작입니다.                                                |

사이트 정보와 업그레이드는 [설치 가이드](/ko/blog/starter-guide-1-configure-your-site/), 일상 글쓰기는 [첫 글 쓰기](/ko/blog/starter-guide-2-languages-and-routing/)를 참고하세요.

## 가이드 탐색과 설정 조회

[이전 글: 독자에게 댓글 받기](/ko/blog/starter-guide-4-giscus-comments/) · [다음 글: 내 도메인에 블로그 배포하기](/ko/blog/starter-guide-deployment/) · [여덟 편의 가이드 시작 페이지](/ko/blog/starter-guide-1-configure-your-site/#tutorial-order).

관련 필드: [언어, 주소, 대체값](/ko/blog/config-languages/), [언어 간 댓글 공유](/ko/blog/config-comments/). 전체 경로, 기본값, 제한은 [설정 사전 시작 페이지](/ko/blog/config-reference/)를 참고하세요.
