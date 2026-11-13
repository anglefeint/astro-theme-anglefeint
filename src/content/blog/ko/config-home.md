---
tags: ['anglefeint', 'config']
title: '설정 사전: 홈'
subtitle: '홈 제목, 소개, 최신 글, 안내 문구, 와이드스크린 터미널, 클릭 이동 효과의 실제 설정을 조회합니다.'
description: '홈 필드의 타입, 테마 기본값, 적용 범위, 제한, 병합 가능한 예시와 공유 설정, 현재 제공하지 않는 스위치를 설명합니다.'
pubDate: '2026-11-13'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

[설정 사전 시작 페이지로 돌아가기](/ko/blog/config-reference/). 실제 홈이 사용하는 필드를 설명합니다. 테마 코드를 바꾸거나 데모의 개인 설정을 기본값으로 간주하지 않습니다.

아래 `<locale>`는 프로젝트의 실제 활성 언어 코드로 바꾸세요. 예시는 ko이며 한국어 설정만 바꿉니다. 영어를 자동 변경하거나 언어를 활성화하지 않습니다. 모든 조각은 `src/site.config.ts`의 기존 defineThemeConfig 객체에 합치고 theme, i18n, site가 있다면 다른 필드를 유지하세요.

## 1. 홈 대제목, 소개, 메타 설명

<a id="home-title"></a>

### `i18n.locales.<locale>.site.homeTitle`

- **타입**: 선택적 `string`.
- **테마 기본값**: 미설정입니다. 내장 언어에는 별도 homeTitle이 없으며 최종적으로 사이트 이름(기본 My Blog)을 씁니다.
- **역할**: 홈에 보이는 대제목.
- **상태와 제한**: 조건부 적용입니다. 현재·대체 언어에서 앞뒤 공백을 제거한 비어 있지 않은 제목을 순서대로 찾고 모두 없으면 사이트 이름을 씁니다. `''`나 공백으로 숨길 수 없습니다. 브라우저 제목, 내비게이션, 푸터, RSS, SEO의 사이트 이름은 바꾸지 않습니다.

<a id="home-hero"></a>

### `i18n.locales.<locale>.site.hero`

- **타입**: 선택적 `string`.
- **테마 기본값**: 내장 언어별 소개가 있습니다. 중국어 간체 기본값은 “在这里写一段站点简介，并告诉读者你将发布什么类型的内容。”이며 영어 기본값은 “Write a short introduction for your site and what readers can expect from your posts.”입니다. 다른 언어는 각 내장값을 사용합니다.
- **역할**: 홈 대제목 아래에 보이는 소개.
- **상태와 제한**: 조건부 적용입니다. 현재·대체 언어의 정의된 값을 찾습니다. `''`는 의도적 비우기이며 더 대체하지 않습니다. 일반 텍스트이므로 Markdown·HTML을 해석하지 않으며 페이지 메타 설명도 바꾸지 않습니다.

<a id="home-description"></a>

### `i18n.locales.<locale>.messages.siteDescription`

- **타입**: 선택적 덮어쓰기이며 값은 `string`.
- **테마 기본값**: 현재 언어의 내장 문구입니다. 중국어 간체 기본값은 “电影感网页界面与 AI 时代工程实践文章。”이며 영어 기본값은 “Cinematic web interfaces and AI-era engineering essays.”입니다.
- **역할**: 홈에서 페이지 head로 전달하는 설명이며 보이는 소개는 아닙니다.
- **상태와 제한**: 조건부 적용입니다. UI 문구와 대체값을 해석한 뒤 사용하며 결과가 빈 문자열일 때만 전역 description으로 대체합니다. 빈 문자열은 전체 설명 끄기 스위치가 아니며 공백 문자열을 자동 trim해 설명 없음으로 만들지도 않습니다.

세 필드는 독립된 역할로 함께 설정할 수 있습니다.

```ts
i18n: {
  locales: {
    ko: {
      site: {
        homeTitle: '나의 디지털 정원',
        hero: '개발, 독서와 일상을 기록합니다.',
      },
      messages: { siteDescription: '개인 프로젝트와 학습 노트.' },
    },
  },
},
```

<a id="site-fallbacks"></a>

### 관련 공통 필드: `site.title`, `site.description`

여기서는 홈과의 관계만 설명합니다. site.title은 유효한 homeTitle이 없을 때의 최종 제목이며 site.description은 홈의 언어별 메타 설명이 비었을 때의 대체값입니다. 홈 전용 필드가 아닙니다. 타입, 테마 기본값, 환경 덮어쓰기, 전체 예시는 [사이트 정체성 사전](/ko/blog/config-site-chrome/#identity)을 참고하세요.

## 2. 최신 글 수

<a id="latest-count"></a>

### `theme.homeLatestCount`

- **타입**: `number`.
- **테마 기본값**: `3`.
- **역할**: 현재 언어 글을 pubDate 내림차순으로 정렬해 앞 N개를 홈에 표시합니다. N보다 적으면 실제 글만 표시하고 옆 개수는 실제 개수／해당 언어 전체 개수입니다.
- **상태와 제한**: 적용됩니다. 현재 배열 slice를 직접 쓰며 양의 정수 전용 검증은 없습니다. 적절한 양의 정수를 권장하며 음수, 소수, NaN, Infinity는 쓰지 마세요. `0`은 글이 있어도 빈 목록과 “글 없음” 안내를 표시하며 전체 최신 글 영역을 숨기는 스위치는 아닙니다.
- **독립 범위**: Blog List 페이지당 수나 홈 Fragment 최대 세 개 미리보기 수를 바꾸지 않습니다.

```ts
theme: { homeLatestCount: 5 },
```

제목, 날짜, 요약은 글 콘텐츠에서 오며 이 필드의 하위 설정은 아닙니다. 홈에는 다른 언어의 콘텐츠로 자동 보충하는 기능이 없습니다.

## 3. 시작 안내와 하단 상태

<a id="startup-switches"></a>

세 필드 모두 `boolean`, 테마 기본값 `true`, 적용 상태입니다. false는 해당 부분만 숨기며 생략하면 기본값을 유지합니다.

| 전체 경로                   | 역할                                           | 제한                                                                                         |
| --------------------------- | ---------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `theme.home.showInitialize` | Initialize／done 시작 문구                     | 해당 부분만 제어하며 홈 본문이나 배경 로드를 제어하지 않습니다.                              |
| `theme.home.showFollow`     | Wake Up／Follow The White Rabbit 안내          | 앞부분과 독립적이며 페이지 탐색 활성 조건이 아닙니다.                                        |
| `theme.home.showTrace`      | 홈 아래 PIRATE SIGNAL／TRACE PROGRAM 상태 영역 | 와이드스크린 터미널은 제어하지 않습니다. 분위기 문구이며 실제 추적·네트워크 상태가 아닙니다. |

```ts
theme: {
  home: {
    showInitialize: false,
    showFollow: true,
    showTrace: false,
  },
},
```

앞의 두 항목을 모두 끄면 시작 문구 컴포넌트를 제거합니다. 현재 고정 시작 문장, 하단 고정 문구, 시간 매개변수를 바꾸는 site.config 필드는 없습니다. startupText, traceText 같은 이름을 추측하지 마세요.

## 4. 홈 UI 문구

<a id="home-messages"></a>

모두 `i18n.locales.<locale>.messages.home`의 선택적 `string` 덮어쓰기이며 일반 필드는 UI 대체 규칙을 따릅니다. 아래는 중국어 간체와 영어의 내장 기본값이며 다른 언어는 각 문구가 있습니다.

| 전체 경로의 마지막 부분 | 중국어 간체 기본값 / 영어 기본값                                | 역할과 제한                                                                                      |
| ----------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `latest`                | 最新 / Latest                                                   | 최신 글 영역 제목입니다. 정렬·개수는 바꾸지 않습니다.                                            |
| `viewAll`               | 全部 / All                                                      | 홈 글 보관함 입구와 Fragment 보관함 링크의 접근성 설명에 사용하며 목적지는 바꾸지 않습니다.      |
| `noPosts`               | 该语言暂时没有文章。 / No posts available in this language yet. | latestPosts가 비었을 때 안내입니다. 초안·게시 제어가 아닙니다.                                   |
| `openDoor`              | 开门 / Open door                                                | 터미널 열쇠구멍 버튼의 접근 가능한 이름과 미리보기 라벨입니다. 항상 보이는 본문 제목은 아닙니다. |

해당 영역이 있을 때만 가시·접근성 효과가 있는 조건부 필드입니다. 빈 문자열은 문구를 비우지만 컨테이너나 기능을 끄지 않으며 버튼 이름의 의미를 없앨 수도 있습니다. 표시는 기능 스위치로 제어하세요.

```ts
i18n: {
  locales: {
    ko: {
      messages: {
        home: {
          latest: '최근 업데이트',
          viewAll: '모든 글',
          noPosts: '아직 글이 없습니다.',
          openDoor: '복도 미리보기 열기',
        },
      },
    },
  },
},
```

<a id="home-transmission"></a>

### `i18n.locales.<locale>.messages.home.transmission`

- **타입**: 선택적 `string` 덮어쓰기.
- **테마 기본값**: `'Knock, knock.'`. 중국어 간체를 포함해 개인 덮어쓰기가 없으면 공유합니다.
- **역할**: 터미널 안의 선택·스크롤 가능한 텍스트.
- **상태와 제한**: 조건부 적용입니다. 뷰포트 너비 1440px 이상에서 표시합니다. 현재 언어 개인 설정 → 영어 개인 설정 → 기본 문장 순서이며 일반 문구의 전체 대체 연결은 쓰지 않습니다. `''`는 문구만 비우고 터미널을 숨기거나 복도를 끄지 않습니다.

별도 덮어쓰기가 없는 언어가 공유할 문구의 예시입니다.

```ts
i18n: {
  locales: {
    en: { messages: { home: { transmission: 'Leave a small trace here.' } } },
  },
},
```

ko의 같은 위치에 쓰면 한국어만 덮어씁니다. 문구 수정은 실제 네트워크 신호를 조회하거나 열쇠구멍의 복도 열기를 바꾸지 않습니다.

<a id="message-hero"></a>

### `i18n.locales.<locale>.messages.home.hero`

- **타입**: 선택적 `string` 덮어쓰기.
- **테마 기본값**: 현재 언어 내장 소개이며 중국어 간체·영어는 위 site.hero 기본 문장과 같습니다.
- **역할**: getSiteHero가 현재·대체 언어에서 정의된 값을 얻지 못했을 때만 홈 소개의 대체 문구로 씁니다.
- **상태와 제한**: 조건부 적용이며 폐기 필드가 아닙니다. 하지만 모든 내장 언어에 site.hero가 있으므로 보통 이 필드만 바꿔도 보이지 않습니다. site.hero를 `''`로 해도 사용하지 않습니다. 일반적으로 site.hero를 직접 바꾸세요.

```ts
i18n: {
  locales: {
    ko: { messages: { home: { hero: '사용 가능한 site.hero가 없을 때만 쓰는 소개입니다.' } } },
  },
},
```

경로·타입을 설명하는 예시이며 더 높은 우선순위의 site.hero를 우회하지 않습니다. 소개 변경을 위해 기본 설정을 삭제하거나 의존성 소스를 수정할 필요는 없습니다.

## 5. 글을 누를 때 Matrix 이동 효과

<a id="home-passage"></a>

### `theme.effects.enableHomePassage`

- **타입**: `boolean`.
- **테마 기본값**: `false`.
- **역할**: 홈 최신 글 제목이나 해당 효과가 있는 내비게이션 블로그 입구의 일반 클릭에서 Matrix 이동 효과 후 탐색합니다. 정상 타임라인은 약 8초이며 완료·예외 시 이동 처리가 있습니다.
- **상태와 제한**: 조건부 적용이며 JavaScript가 필요합니다. 동작 줄이기, 보조키 클릭, 비왼쪽 클릭, 다운로드, 외부 링크, 새 창 대상 등은 원래 동작을 유지합니다. 홈 본문 출현을 늦추거나 About Oracle·터미널 미리보기를 제어하지 않습니다.

```ts
theme: { effects: { enableHomePassage: true } },
```

끄면 링크는 바로 이동합니다. 시간, 장면 색상, 목적지 설정은 제공하지 않으므로 homePassageDuration 같은 비공개 필드를 추가하지 마세요.

## 6. 홈이 사용하는 공유 설정

<a id="shared-settings"></a>

홈 전용은 아닙니다. 여기서는 사용 관계만 설명하며 전체 정의는 주 사전에서 봅니다.

| 전체 경로                                        | 홈 사용 관계                                                                                           | 주 설명                                                       |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------- |
| `theme.fragments.enabled`                        | 현재 언어에 내용이 있을 때 아바타 입구를 표시하며 전체 목록도 제어합니다. 미리보기는 최대 세 개입니다. | [Fragments 스위치](/ko/blog/config-fragments/#enabled)        |
| `i18n.locales.<locale>.messages.blog.allPosts`   | 최신 글 개수 안내와 보관함 입구의 접근 가능한 이름                                                     | [목록 공유 문구](/ko/blog/config-blog-list/#tag-messages)     |
| `i18n.locales.<locale>.messages.fragments.title` | 아바타 입구의 접근 가능한 이름이며 옆의 표시 제목은 아닙니다.                                          | [Fragment 문구](/ko/blog/config-fragments/#fragment-messages) |
| `i18n.locales.<locale>.messages.fragments.close` | 미리보기 닫기 버튼의 접근 가능한 이름이며 그림은 바꾸지 않습니다.                                      | [Fragment 문구](/ko/blog/config-fragments/#fragment-messages) |

켜도 아바타가 없다면 현재 언어의 Fragment부터 확인하세요. 표시를 위해 ID를 복제하지 마세요. 이미지·코드·높이 규칙은 [Fragments 사전](/ko/blog/config-fragments/#preview-and-links), 게시 절차는 [Fragment 게시하기](/ko/blog/starter-guide-5-fragments/)를 참고하세요.

## 7. 현재 제공하지 않는 홈 설정

<a id="unsupported-settings"></a>

`messages.siteTitle`은 현재 표준 홈이나 공용 사이트 이름을 바꾸지 않습니다. homeTitle이나 최상위 site.title을 대신하지 마세요. 타입, 기본값, 예시는 [현재 미사용 사이트 제목 필드](/ko/blog/config-site-chrome/#legacy-site-title)에 있습니다.

코드 비 밀도·색상, 홈 거울 버튼, 아바타 소재, Fragment 미리보기 수, 고정 시작 문장, 이동 시간은 현재 site.config 필드가 없습니다. 레이아웃·스타일·스크립트 구현에 속하며 TypeScript 예시에 임의 이름을 넣어도 적용되지 않습니다. Reduced Motion은 표현에 영향을 주지만 이 글에서 새로 추가하는 설정은 아닙니다.

`/`와 언어 홈의 관계는 i18n.defaultLocale, i18n.routing.defaultLocalePrefix가 제어합니다. 전체 정의는 [언어·주소 사전](/ko/blog/config-languages/#routing)을 참고하세요. 공용 내비게이션, 푸터, 음악, 통계도 홈 독립 설정은 아닙니다.

## 변경 후 확인 방법

먼저 dev에서 대상 언어 홈을 열고 제목, 소개, 메타 설명, 접근성 설명 중 무엇을 바꿨는지 확인하세요. 터미널 문구는 너비 1440px 이상에서, 메타 설명은 head에서, 버튼 이름은 접근 가능한 이름이나 title로 확인해야 하며 큰 글자가 보이는지만 보면 안 됩니다.

환경 덮어쓰기 변경 후 dev를 다시 시작하세요. 정식 사이트는 재빌드·재배포가 필요합니다. 배포 전 dev를 멈추고 npm run doctor, npm run preview를 실행할 수 있습니다. doctor는 빌드를 포함하므로 check·build를 바로 반복할 필요는 없습니다. [설치 가이드](/ko/blog/starter-guide-1-configure-your-site/)와 [배포 가이드](/ko/blog/starter-guide-deployment/)를 참고하세요.
