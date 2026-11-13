---
tags: ['anglefeint', 'starter']
title: '사용 가이드 6: 독자에게 댓글 받기'
subtitle: 'Giscus를 연결해 글이나 Fragment 댓글을 켜고 다국어 버전의 토론 공유 여부를 선택합니다.'
description: 'Giscus 준비, 테마 설정, 글 토론 매핑, 다국어 공유, Fragment 댓글의 차이와 자주 발생하는 설정·로드 문제를 설명합니다.'
pubDate: '2026-11-10'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

이 글은 입문 가이드의 6 / 8편입니다. [전체 가이드 순서](/ko/blog/starter-guide-1-configure-your-site/#tutorial-order) · [필드별 설정 사전](/ko/blog/config-reference/).

Anglefeint는 Giscus로 댓글을 제공하며 기본은 꺼짐입니다. 글과 Fragments를 각각 켤 수 있습니다. 댓글과 반응은 설정한 GitHub Discussions에 저장하므로 정적 블로그에 별도의 댓글 데이터베이스를 배포할 필요는 없습니다.

저장소 설정을 한 번 마친 뒤 번역문 토론의 공유 여부를 선택하세요. 댓글을 위해 글 템플릿을 수정하거나 글마다 script를 붙일 필요는 없습니다.

## 1. GitHub 저장소와 카테고리 준비하기

[Giscus 설정 페이지(중국어)](https://giscus.app/zh-CN)를 열고 다음을 확인하세요.

1. 내 공개 GitHub 저장소를 댓글 저장 위치로 사용합니다. 블로그 저장소나 별도 댓글 저장소 모두 가능합니다.
2. 저장소에서 Discussions를 활성화합니다.
3. 그 저장소에 Giscus 앱을 설치하고 권한을 줍니다.
4. 토론 카테고리를 선택하고 페이지가 생성한 저장소와 카테고리 정보를 기록합니다.

설정 페이지는 script를 생성하지만 테마에는 다음 필드 값만 필요합니다.

| Giscus 속성        | 테마 입력 위치                                        |
| ------------------ | ----------------------------------------------------- |
| `data-repo`        | `theme.comments.repo`, 예: `yourname/your-repository` |
| `data-repo-id`     | `theme.comments.repoId`, 저장소 이름이 아닌 ID        |
| `data-category`    | `theme.comments.category`, 실제 카테고리 이름         |
| `data-category-id` | `theme.comments.categoryId`, 카테고리 이름이 아닌 ID  |

예시 ID, 저장소 URL, 내 사용자 이름을 실제 ID처럼 쓰지 마세요. 카테고리 이름이 꼭 Announcements인 것은 아닙니다. 선택한 실제 이름과 ID를 쓰세요. Giscus npm 패키지, GitHub token, 비밀번호는 필요하지 않습니다.

댓글은 외부 서비스이므로 페이지가 Giscus와 GitHub에 연결될 수 있어야 합니다. 방문자는 GitHub 인증 후 댓글을 남기며 해당 GitHub Discussion에서 직접 참여할 수도 있습니다. 테마 자체는 익명 방명록을 제공하지 않습니다. 외부 서비스의 실제 동작은 [Giscus 공식 설명](https://giscus.app/zh-CN)을 따릅니다.

## 2. 일반 글 댓글부터 켜기

`src/site.config.ts`의 기존 `defineThemeConfig({...})`에 합치세요.

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

계정, 저장소, 카테고리, 두 ID 자리표시자를 바꾸세요. 기존 `theme`나 `comments`가 있다면 필드만 수정하고 다른 설정은 유지하세요. 같은 이름의 객체를 중복 생성하지 마세요.

이 예시는 글 댓글을 켜고 글 URL 경로에 토론을 연결합니다. `/zh/blog/my-first-post/`와 `/en/blog/my-first-post/`는 다른 경로이므로 기본적으로 같은 토론을 공유하지 않습니다. 언어 간 공유의 기본값은 `false`입니다. 이미 공유를 켰다면 아래 설명에 따라 매핑도 복구해야 하며 이 예시만 바꾸면 안 됩니다.

글 페이지는 댓글이 켜져 있고 저장소·카테고리 네 필드가 있어야 컴포넌트를 출력합니다. 빠져 있으면 댓글 영역이 없을 수 있습니다. 자리표시자는 보통 로컬 비어 있지 않음 검사만 통과하며 원격 저장소 설정 성공을 증명하지 않습니다. 현재 개별 글 frontmatter 댓글 스위치는 없으므로 `comments: false`로 특정 글만 끌 수 없습니다.

예시의 `lang: ''`는 댓글 UI를 글 언어에 맞춥니다. 실제 테마 기본은 고정 `lang: 'en'`이므로 페이지를 따르려면 명시적으로 비워야 합니다. `zh`는 `zh-CN`, `zh-hant`는 `zh-TW`, `pt-br`는 `pt`로 대응합니다. UI 문구만 바꾸며 방문자 댓글은 번역하지 않습니다.

## 3. 실제 댓글 연결 확인하기

저장한 뒤 로컬 개발 페이지에서 글 하나를 열고 아래 댓글 영역을 찾으세요. 올바른 저장소 토론인지, 로그인·댓글·반응 입구가 동작하는지 확인할 수 있습니다. 처음 빈 토론이라고 실패는 아닙니다. Giscus는 첫 댓글이나 반응 때 토론을 만들 수 있으며 페이지를 열자마자 기록을 생성한다고 보장하지 않습니다.

배포 전에 dev를 멈추고 실행하세요.

```bash
npm run doctor
npm run preview
```

doctor는 검사와 빌드를 포함하므로 성공 직후 build를 반복할 필요는 없습니다. preview는 로컬 빌드 결과만 표시하며 게시하지 않습니다. 정식 사이트는 다시 배포해야 합니다. 빌드 통과는 로컬 설정과 페이지 생성만 확인하므로 브라우저에서 실제 저장소 권한·서비스 연결을 확인하는 작업을 대체하지 않습니다.

글의 기본은 `loading: 'lazy'`입니다. Giscus iframe에 전달하는 로드 방식이지 스크롤할 때까지 클라이언트 script를 출력하지 않는다는 뜻은 아닙니다. 글 페이지에는 비동기 Giscus 스크립트를 출력합니다. 반면 Fragment 팝업은 댓글 버튼을 눌러야 클라이언트를 로드합니다.

모든 매개변수의 타입, 기본값, 예시는 [Giscus 사전](/ko/blog/config-comments/#connection)을 참고하세요. 기존 댓글이 있다면 매핑과 공유 제약을 특히 확인하세요.

## 4. 글과 토론의 연결 방식 선택하기

일반적으로 `pathname`을 유지하면 됩니다. 바꿀 필요가 있다면 매핑 근거부터 이해하세요. 이미 댓글이 있는 사이트는 임의로 바꾸지 마세요.

| `mapping` 값 | 연결 근거와 제한                                                                                           |
| ------------ | ---------------------------------------------------------------------------------------------------------- |
| `'pathname'` | 도메인을 제외한 페이지 URL 경로입니다. 글 경로를 바꾸면 다른 토론에 연결될 수 있습니다.                    |
| `'url'`      | 전체 페이지 URL입니다. 도메인 변경도 연결에 영향을 줄 수 있습니다.                                         |
| `'title'`    | 브라우저 페이지 title입니다. 글이나 사이트 제목 변경이 연결에 영향을 줄 수 있습니다.                       |
| `'og:title'` | 페이지 Open Graph 제목입니다.                                                                              |
| `'specific'` | 입력한 고정 `term`입니다. 비공유 모드에서는 비어 있으면 안 됩니다.                                         |
| `'number'`   | `number`에 입력한 기존 discussion 번호입니다. issue 번호가 아니며 이 모드는 토론을 자동 생성하지 않습니다. |

토론 조회는 Giscus에 맡기며 테마가 로컬 댓글 데이터베이스를 만들지 않습니다. 엄격한 일치 `strict: '1'`은 유사 제목의 모호한 매칭을 줄입니다. 기본값은 `'0'`입니다.

비공유 모드의 `term`, `number`는 사이트 전체 설정입니다. `specific`과 고정 term을 쓰면 이 설정의 글들이 같은 토론을 찾으며 `number`도 고정 번호로 향합니다. 글마다 다른 토론을 자동 할당하는 스위치가 아닙니다.

글 댓글 활성화 시 검증합니다. `specific`의 term은 공백 제거 후 비어 있지 않아야 합니다. `number`는 `'42'` 같은 양의 정수 문자열이며 숫자 `42`, `'0'`, 소수는 안 됩니다. 잘못된 매개변수는 설정 검사를 실패시켜 dev나 build를 막을 수 있습니다.

## 5. 같은 글의 번역문에서 댓글 공유하기

중국어 간체와 영어 번역은 공유하고 다른 글은 독립 토론을 쓰려면 실제 저장소·카테고리 필드를 유지한 채 매핑 부분을 합치세요.

```ts
theme: {
  comments: {
    // 保留 enabled: true 和自己的 repo、repoId、category、categoryId。
    shareAcrossLocales: true,
    mapping: 'specific',
    term: '',
    number: '',
    strict: '1',
    lang: '',
  },
},
```

공유 모드는 specific, 빈 term, 빈 number, 문자열 `'1'`인 strict를 요구합니다. 빈 term은 의도적입니다. 글 페이지가 언어 디렉터리를 제외한 전체 slug를 채우므로 모든 글이 한 고정 단어를 사용하는 것은 아닙니다.

예를 들어 `src/content/blog/zh/my-first-post.md`와 `src/content/blog/en/my-first-post.md`는 모두 `my-first-post`를 사용합니다. 중첩 콘텐츠의 `guides/setup`, `other/setup`은 전체 경로를 유지하므로 서로 다른 토론입니다. 번역은 같은 slug를 유지해야 하며 제목·본문 유사도로 찾지 않습니다.

공유와 글 댓글이 켜졌을 때 잘못된 mapping, 비어 있지 않은 term／number, `'1'`이 아닌 strict는 명시적 오류를 냅니다. 일반 패키지 라우트는 글 slug를 전달합니다. BlogPost를 직접 사용하는 페이지도 유효한 articleSlug를 전달해야 합니다. UI 언어는 계속 lang이 정하며 댓글 본문을 자동 번역하지 않습니다.

확인할 때 같은 글의 두 번역과 다른 글 하나를 여세요. 앞의 둘은 같은 토론이고 세 번째는 독립이어야 합니다. UI 언어나 댓글창 모양만 보고 공유 성공으로 판단하지 마세요.

### 기존 댓글은 어떻게 되나요?

테마는 이전 토론을 병합·이동·삭제하지 않습니다. 공유를 켜면 선택되는 토론이 바뀌어 원래 댓글은 GitHub에 남아도 새 연결에는 안 보일 수 있습니다.

전환 전에 저장소, 카테고리, mapping, term, number, strict를 저장하세요. 이전 연결을 복구하려면 `shareAcrossLocales: false`로 설정하고 원래 값도 복원하세요. 공유만 끄고 빈 term의 specific을 남기면 오류입니다. 토론 정리가 필요하면 GitHub의 기존 데이터와 연결을 먼저 확인하세요. 자동 마이그레이션은 제공하지 않습니다.

## 6. Fragment 댓글은 독립적으로 켜기

Fragments만 댓글을 받으려면 같은 저장소·카테고리 정보를 입력하고 설정하세요.

```ts
theme: {
  fragments: {
    enabled: true,
    comments: { enabled: true },
  },
  comments: {
    enabled: false,
    repo: 'yourname/your-repository',
    repoId: 'REPLACE_WITH_REPO_ID',
    category: 'Announcements',
    categoryId: 'REPLACE_WITH_CATEGORY_ID',
  },
},
```

`theme.comments.enabled: false`는 글 댓글만 끕니다. Fragment는 `theme.fragments.comments.enabled`를 사용합니다. 글에도 댓글이 필요하면 true를 유지해도 됩니다. Fragments 때문에 글의 기존 매핑을 바꿀 필요는 없습니다.

Fragment는 specific, 엄격한 일치, `fragment/<id>`를 고정 사용합니다. 글 mapping, term, number, shareAcrossLocales, 고정 lang은 사용하지 않습니다. UI는 페이지 언어를 따르고 같은 ID의 번역은 토론을 공유합니다. 반응, 색상 테마, 입력창 위치는 공통 설정을 재사용합니다. 저장소·카테고리 네 필드가 없으면 Fragment 댓글 활성화 시 바로 설정 오류가 납니다.

목록 카드의 댓글 버튼을 처음 눌러야 로드합니다. 팝업을 닫아도 인스턴스를 유지하며 다시 열거나 Fragment를 바꾸면 재사용합니다. 실패하거나 약 15초 동안 준비되지 않으면 재시도를 제공합니다. 로드 안내는 연결 성공의 증거가 아닙니다. 게시, ID, 공유 규칙은 [Fragment 게시하기](/ko/blog/starter-guide-5-fragments/)를 참고하세요.

## 필요하면 조정하기: 표시와 로드 옵션

아래 필드는 모두 `theme.comments`에 있으며 보통 기본값을 유지하면 됩니다.

| 필드               | 테마 기본값   | 용도                                                                                                                                             |
| ------------------ | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `reactionsEnabled` | `'1'`         | discussion 본문 반응을 표시합니다. `'0'`이면 끕니다.                                                                                             |
| `inputPosition`    | `'bottom'`    | 댓글 입력창 위치입니다. `'top'`／`'bottom'`을 선택합니다.                                                                                        |
| `theme`            | `'dark'`      | Giscus에 전달하는 배색 이름이며 지원값은 설정 페이지를 따릅니다. 블로그 테마 전환이 아닙니다.                                                    |
| `strict`           | `'0'`         | 글의 엄격한 일치입니다. 글 공유 모드와 Fragments는 `'1'`을 강제합니다.                                                                           |
| `emitMetadata`     | `'0'`         | Giscus가 부모 페이지로 토론 메타데이터를 보냅니다. 글 발행 메타 정보가 아닙니다. Fragments는 준비 상태 판단을 위해 켭니다.                       |
| `lang`             | `'en'`        | 글 댓글 UI의 고정 언어입니다. `''`는 페이지를 따르며 Fragments는 항상 페이지를 따릅니다.                                                         |
| `loading`          | `'lazy'`      | 글 iframe은 `'lazy'`／`'eager'`를 사용합니다. Fragment 팝업은 연 뒤 eager를 사용합니다.                                                          |
| `crossorigin`      | `'anonymous'` | 클라이언트 스크립트 교차 출처 속성입니다. `'anonymous'`／`'use-credentials'`를 선택하며 보통 수정할 필요 없고 GitHub 로그인을 대체하지 않습니다. |

`enabled`, `shareAcrossLocales`는 불리언 true／false입니다. `strict`, `reactionsEnabled`, `emitMetadata`는 문자열 `'0'`／`'1'`을 사용합니다. 비슷해 보여도 타입을 혼용하지 마세요.

## 댓글이 없거나 연결이 잘못될 때

| 현상                        | 확인 순서                                                                                                     |
| --------------------------- | ------------------------------------------------------------------------------------------------------------- |
| 글에 댓글 영역이 전혀 없음  | 글 스위치가 true인지, 저장소·카테고리 네 필드가 있는지 확인하세요. Fragment 스위치는 글을 제어하지 않습니다.  |
| Fragments를 켜자 설정 오류  | 스위치만 켜지 말고 저장소·카테고리 필드 전체를 넣었는지 확인하세요.                                           |
| 원격 오류 또는 계속 로드 중 | 실제 ID, 공개 저장소, Discussions, 앱의 저장소 권한, 카테고리 일치, 네트워크·차단기의 요청 방해를 확인하세요. |
| 다른 글에서 같은 토론 표시  | 전체 고정 term／number를 썼는지, 올바른 공유 설정이 없는지와 Giscus의 실제 매칭 결과를 확인하세요.            |
| 번역이 공유되지 않음        | shareAcrossLocales, 같은 slug, 공유 매핑 제약을 확인하세요.                                                   |
| 매핑 변경 후 “댓글 사라짐”  | GitHub에서 이전 토론부터 확인하세요. 복구하려고 제목·ID를 반복 변경하거나 토론을 삭제하지 마세요.             |
| 댓글 UI가 계속 영어         | 글 lang 기본은 en입니다. 페이지를 따르려면 `''`로 설정하세요. 방문자 댓글은 번역하지 않습니다.                |
| 로컬 수정이 온라인에 없음   | 재빌드·재배포했는지, 온라인이 이전 설정을 쓰는지 확인하세요.                                                  |

글은 `theme.comments.enabled: false`, Fragments는 `theme.fragments.comments.enabled: false`로 끕니다. 해당 입구·임베드를 멈출 뿐 GitHub Discussions 데이터를 삭제하지 않습니다. 업그레이드는 토론을 이전하지 않습니다. 기존 매핑을 보존하고 업그레이드 뒤 연결을 확인하세요. 절차는 [설치 가이드](/ko/blog/starter-guide-1-configure-your-site/)에 있습니다.

## 가이드 탐색과 설정 조회

[이전 글: 페이지와 기능을 취향에 맞게 조정하기](/ko/blog/starter-guide-3-comments-about-and-theme-toggles/) · [다음 글: 더 많은 언어의 독자 맞이하기](/ko/blog/starter-guide-languages/) · [여덟 편의 가이드 시작 페이지](/ko/blog/starter-guide-1-configure-your-site/#tutorial-order).

관련 필드: [Giscus 매개변수와 토론 공유](/ko/blog/config-comments/), [Fragment 댓글 스위치](/ko/blog/config-fragments/). 전체 경로, 기본값, 제한은 [설정 사전 시작 페이지](/ko/blog/config-reference/)를 참고하세요.
