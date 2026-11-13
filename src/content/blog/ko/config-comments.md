---
tags: ['anglefeint', 'config']
title: '설정 사전: Giscus 댓글과 다국어 토론 공유'
subtitle: '글과 Fragments의 독립 스위치, 토론 매핑, 언어, 공유 규칙입니다.'
description: '실제 코드로 모든 Giscus 공통 설정을 조회하고 기본값, 타입, 검증 조건, 글 번역 공유, Fragment 덮어쓰기 규칙을 설명합니다.'
pubDate: '2026-11-13'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

처음 설정한다면 저장소 준비·매개변수 취득이 있는 [독자에게 댓글 받기](/ko/blog/starter-guide-4-giscus-comments/)를 읽으세요. 위치는 [설치와 사이트 정보](/ko/blog/starter-guide-1-configure-your-site/), 다른 모듈은 [설정 사전 시작 페이지](/ko/blog/config-reference/)에 있습니다.

공통 설정은 src/site.config.ts의 theme.comments이며 기본은 꺼짐입니다. demo 개인 저장소가 아닌 패키지 기본값을 나열합니다. ID·저장소는 페이지에 출력하는 공개 연결 정보이므로 GitHub 접근 토큰 등 비밀을 넣지 마세요.

<a id="controls"></a>

## 두 댓글 스위치 구분하기

| 경로                             | 타입 / 기본값   | 상태·역할·제한                                                                                                                            | 예시                                                                 |
| -------------------------------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| theme.comments.enabled           | boolean / false | 조건부 적용: 글 댓글이며 Fragment 버튼은 제어하지 않습니다. 연결 필드가 없으면 영역이 안 나올 수 있으며 원격 검증 성공을 뜻하지 않습니다. | theme: { comments: { enabled: true } }                               |
| theme.fragments.comments.enabled | boolean / false | 조건부 적용: 목록 댓글이며 theme.fragments.enabled도 true여야 합니다. 글과 독립이며 필수 연결 누락은 페이지 생성 오류입니다.              | theme: { fragments: { enabled: true, comments: { enabled: true } } } |

글에는 comments: false frontmatter 스위치가 없으며 Fragment별 스위치도 없습니다. 홈 미리보기에는 버튼이 없습니다. [Fragments 사전](/ko/blog/config-fragments/#comments-enabled)을 참고하세요.

## theme.comments 전체 필드

전체 접두사는 theme.comments.입니다. repo의 경로는 theme.comments.repo입니다. 입력 부분 설정에서는 모두 생략할 수 있으며 테마 기본값을 채웁니다. 문자열 플래그는 따옴표를 유지하며 true/false나 숫자로 쓰지 마세요.

모두 조건부 적용입니다. 글은 활성화·출력 조건이 필요하고 Fragments는 일부만 쓰며 나머지를 덮어쓰거나 무시합니다. 공통 “빈 문자열로 기본값 복구” 규칙은 없습니다. 명시적 매핑 검증 외에 타입·비어 있지 않음은 원격 Giscus 유효성을 뜻하지 않습니다.

<a id="connection"></a>

### 저장소와 카테고리

| 필드         | 타입   | 기본값 | 역할·조건·제한                                                                                                                             | 예시 값                           |
| ------------ | ------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------- |
| `repo`       | string | `""`   | GitHub owner/repo입니다. 글은 truthy, Fragments는 trim 후 비어 있지 않아야 합니다. 앞뒤 공백을 넣지 마세요. 원격 권한은 검사하지 않습니다. | `"your-account/blog-discussions"` |
| `repoId`     | string | `""`   | Giscus가 제공하는 저장소 ID이며 이름·숫자 순번·접근 토큰이 아닙니다. 글과 Fragments가 공유합니다.                                          | `"YOUR_REPOSITORY_ID"`            |
| `category`   | string | `""`   | Giscus가 제공하는 카테고리 이름이며 categoryId와 맞춰야 합니다. 글 태그가 아닙니다.                                                        | `"Announcements"`                 |
| `categoryId` | string | `""`   | Giscus 카테고리 ID이며 이름이 아닙니다. 글은 truthy, Fragments는 trim 후 비어 있지 않아야 하며 원격 진위는 확인하지 않습니다.              | `"YOUR_CATEGORY_ID"`              |

<a id="mapping"></a>

### 글 매핑과 엄격한 일치

| 필드      | 타입                                                                   | 기본값       | 역할·조건·제한                                                                                                                                  | 예시 값                 |
| --------- | ---------------------------------------------------------------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| `mapping` | 'pathname' \| 'url' \| 'title' \| 'og:title' \| 'specific' \| 'number' | `"pathname"` | 글과 토론 연결 방식입니다. 아래 값을 참고하세요. 공유는 specific 필수이고 Fragments는 쓰지 않습니다.                                            | `"pathname"`            |
| `term`    | string                                                                 | `""`         | 비공유 specific에서는 trim 후 비어 있지 않은 전역 고정 term입니다. 공유는 비워야 하며 렌더링 시 slug를 넣습니다. 다른 모드에는 보내지 않습니다. | `"my-fixed-discussion"` |
| `number`  | string                                                                 | `""`         | 비공유 number에서 안전 범위의 양의 정수 문자열입니다. 앞자리 0·플러스·소수는 안 됩니다. 공유는 비워야 하며 다른 모드에는 보내지 않습니다.       | `"42"`                  |
| `strict`  | '0' \| '1'                                                             | `"0"`        | 글 엄격한 일치 문자열이며 boolean이 아닙니다. 공유는 1 필수, Fragments도 1로 덮어씁니다. 같은 제목 토론을 자동 병합하지 않습니다.               | `"1"`                   |

<a id="appearance"></a>

### 표시, 언어, 로드

| 필드               | 타입                             | 기본값        | 역할·조건·제한                                                                                                                                                 | 예시 값       |
| ------------------ | -------------------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| `reactionsEnabled` | '0' \| '1'                       | `"1"`         | 주 토론 반응 영역입니다. 글·Fragments가 공유하며 모든 댓글 조작을 끄는 것은 아닙니다.                                                                          | `"1"`         |
| `emitMetadata`     | '0' \| '1'                       | `"0"`         | Giscus가 부모 창으로 메타데이터를 보냅니다. 글은 설정을 전달하며 통계를 자동 표시하지 않습니다. Fragments는 로드·전환 판단을 위해 1입니다.                     | `"0"`         |
| `inputPosition`    | 'top' \| 'bottom'                | `"bottom"`    | 목록 위·아래 입력창 위치이며 글·Fragments 공유입니다. 페이지 전체 댓글 영역 위치는 바꾸지 않습니다.                                                            | `"top"`       |
| `theme`            | string                           | `"dark"`      | Giscus iframe 테마이며 블로그 장면이 아닙니다. 글·Fragments 공유이고 지원 이름 검증·자동 장면 전환은 없습니다.                                                 | `"dark"`      |
| `lang`             | string                           | `"en"`        | 글 댓글 UI 언어입니다. 비어 있지 않으면 직접 전달하고 빈 문자열은 페이지 언어로 매핑합니다. Fragments는 무시하고 항상 페이지를 따릅니다. 본문 번역은 없습니다. | `""`          |
| `loading`          | 'lazy' \| 'eager'                | `"lazy"`      | 글 iframe 로드 힌트이며 client.js 전체 지연이 아닙니다. Fragments는 eager지만 클릭 뒤 클라이언트를 넣습니다.                                                   | `"lazy"`      |
| `crossorigin`      | 'anonymous' \| 'use-credentials' | `"anonymous"` | 클라이언트 script의 속성입니다. 글·Fragments 공유이며 저장소 자격 증명·GitHub token·권한 해결 스위치가 아닙니다.                                               | `"anonymous"` |

<a id="sharing"></a>

## theme.comments.shareAcrossLocales: 번역 글 공유

- **타입 / 기본값:** boolean, 생략 가능 / false.
- **상태와 역할:** 글 댓글 활성 시 조건부 적용합니다. 같은 전체 slug의 번역은 같은 토론, 다른 slug는 분리합니다.
- **제한:** mapping 'specific', trim 후 빈 term·number, 문자열 '1'인 strict가 필수입니다. 불만족은 설정 오류이며 스위치만 켜면 안 됩니다. 글 댓글 꺼짐은 이 제약을 건너뛰지만 Fragments 자체 연결 검사는 남습니다.
- **예시:** 아래 공유 조각입니다. 댓글 번역·이전 토론 병합·Fragment 바인딩 변경은 하지 않습니다.

| 글 파일                              | 공유 실제 term |
| ------------------------------------ | -------------- |
| src/content/blog/zh/my-first-post.md | my-first-post  |
| src/content/blog/en/my-first-post.md | my-first-post  |
| src/content/blog/zh/guides/setup.md  | guides/setup   |
| src/content/blog/en/other/setup.md   | other/setup    |

언어를 뺀 전체 slug로 연결하며 제목, canonicalTopic, 본문으로 번역을 찾지 않습니다. 표준 라우트는 articleSlug를 전달합니다. 직접 BlogPost를 쓰는 페이지도 비어 있지 않고 앞뒤 공백·빈 경로·. / .. 구간이 없는 전체 slug를 전달해야 합니다. 이 컴포넌트 인수는 site.config가 아닙니다.

같은 저장소·카테고리의 여러 사이트가 같은 slug면 같은 토론을 찾을 수 있습니다. 도메인별 별도 데이터베이스가 아닙니다. 경로를 유지하면 제목 변경은 term을 바꾸지 않지만 slug·저장소·분류·전략은 다른 토론에 연결될 수 있습니다.

<a id="mapping-values"></a>

## mapping 값의 뜻

| 값       | Giscus 근거            | 제한·예시                                                                            |
| -------- | ---------------------- | ------------------------------------------------------------------------------------ |
| pathname | URL 경로               | 기본입니다. 언어 경로가 다르며 경로 변경이 연결을 바꿀 수 있습니다.                  |
| url      | 전체 페이지 URL        | 도메인·주소 변경이 영향을 줄 수 있습니다.                                            |
| title    | 문서 title             | 글·사이트 제목 변경이 영향을 줍니다. 본문 h1만 보는 것이 아닙니다.                   |
| og:title | 페이지 Open Graph 제목 | 기존 메타 정보를 쓰며 theme.comments에서 제목을 입력하지 않습니다.                   |
| specific | 지정 term              | 비공유는 전역 고정 단어, 공유는 글별 slug입니다.                                     |
| number   | 기존 Discussion 번호   | 전역 고정 번호이며 '42' 같은 문자열입니다. issue 번호가 아니고 자동 생성도 없습니다. |

연결·생성은 Giscus가 담당합니다. 토론이 없으면 첫 댓글·반응 시 만들 수 있으며 열기만으로 생성 보장은 없습니다. 공개 저장소, Discussions, Giscus 앱이 필요합니다. 가이드와 [공식 설정](https://giscus.app/)을 참고하세요. 테마는 로컬 댓글 DB를 저장하지 않습니다.

strict '1'은 토론 본문의 제목 해시로 매칭하며 테마가 두 제목을 로컬 비교하는 것이 아닙니다. 이전 토론은 매칭 표식 보완이 필요할 수 있습니다. [엄격한 일치 설명](https://github.com/giscus/giscus/blob/main/ADVANCED-USAGE.md#data-strict)을 참고하세요. 공유·매핑 변경은 이전 토론을 이전·병합·삭제하지 않습니다. 이전 댓글은 GitHub에 남아도 새 연결에 없을 수 있으므로 기존 토론과 새 term의 대응을 먼저 확인하세요.

비공유의 고정 specific term은 모든 글이 같은 토론을 찾게 하며 number도 전역 고정입니다. 글마다 ID 자동 할당이 아닙니다. 현재 매핑과 무관한 term/number는 보내지 않지만 둘 다 trim하므로 null·숫자로 대체하지 마세요.

<a id="examples"></a>

## 병합 가능한 예시

src/site.config.ts의 기존 defineThemeConfig({...})에 합치고 import, export, 개인 설정을 유지하며 theme를 중복 생성하지 마세요. 연결 네 값은 자신의 Giscus에서 얻어야 합니다. 자리표시자는 구조 설명용이지 온라인 검증용이 아닙니다.

### 경로별로 분리한 글 댓글

```ts
theme: {
  comments: {
    enabled: true,
    repo: 'your-account/blog-discussions',
    repoId: 'YOUR_REPOSITORY_ID',
    category: 'Announcements',
    categoryId: 'YOUR_CATEGORY_ID',
    shareAcrossLocales: false,
    mapping: 'pathname',
    lang: '',
  },
},
```

### 같은 글 번역의 토론 공유

내 연결 필드를 유지하고 매핑을 합치세요.

```ts
theme: {
  comments: {
    enabled: true,
    shareAcrossLocales: true,
    mapping: 'specific',
    term: '',
    number: '',
    strict: '1',
    lang: '',
  },
},
```

lang 기본은 'en'이며 페이지 따라가기가 아닙니다. 예시에서 빈 문자열로 명시 활성화합니다. zh→zh-CN, zh-hant→zh-TW, pt-br→pt이며 나머지는 직접 전달합니다. 언어 지원은 서비스가 결정합니다. UI만 바꾸며 토론 정체성·댓글 번역은 바꾸지 않습니다. theme.comments는 전역이며 i18n.locales에 각각 복사하지 않습니다.

theme 문자열은 Giscus로 직접 전달하며 예시는 'dark', 'light'입니다. 지원 테마·사용자 CSS URL은 Giscus가 담당하며 바깥 AI 패널을 바꾸지 않습니다. [공식 테마](https://github.com/giscus/giscus/blob/main/ADVANCED-USAGE.md#data-theme)를 참고하세요. 패키지는 CSS 내용·접근성을 검증하지 않습니다.

<a id="fragment-overrides"></a>

## Fragments가 쓰는 공통 설정

| 공통 필드                                              | Fragment 실제 동작                                                                                                          |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| repo / repoId / category / categoryId                  | 공유하며 trim 후 네 항목 모두 비어 있지 않아야 합니다. 원값을 전달하므로 공백을 넣지 마세요. 원격 권한은 검증하지 않습니다. |
| theme / reactionsEnabled / inputPosition / crossorigin | 원래 설정 공유                                                                                                              |
| enabled                                                | 글 스위치 대신 theme.fragments.comments.enabled                                                                             |
| shareAcrossLocales                                     | 사용하지 않습니다. 같은 안정적 ID가 이미 같은 토론을 가리킵니다.                                                            |
| mapping / term / number                                | specific, term `fragment/<ID>` 고정이며 number는 안 보냅니다.                                                               |
| strict / emitMetadata                                  | '1' / '1' 고정                                                                                                              |
| lang                                                   | 공통 lang 대신 현재 페이지 언어 매핑                                                                                        |
| loading                                                | eager 고정이지만 첫 댓글 버튼 클릭 뒤 클라이언트 삽입                                                                       |

Fragment만 켜고 글은 끄는 예시입니다.

```ts
theme: {
  comments: {
    enabled: false,
    repo: 'your-account/blog-discussions',
    repoId: 'YOUR_REPOSITORY_ID',
    category: 'Announcements',
    categoryId: 'YOUR_CATEGORY_ID',
  },
  fragments: { enabled: true, comments: { enabled: true } },
},
```

같은 ID 번역은 `fragment/<ID>`를 공유하며 글 slug와는 별도 규칙입니다. 정렬·페이지 변경을 위해 ID를 바꾸지 마세요. 첫 클릭에 로드하고 닫아도 iframe은 유지합니다. 전환은 Giscus 설정 메시지로 갱신하며 약 15초 유효 결과가 없으면 실패·재시도입니다. 공개 타임아웃·사전 로드 설정은 없습니다. Fragments만 원해도 글 댓글을 함께 켰다면 글 매핑 검증이 실행됩니다.

<a id="messages"></a>

## 페이지 자체의 댓글 문구

`i18n.locales.<locale>.messages` 아래의 선택적 string입니다. 현재 언어 내장 문구·대체값을 사용합니다. 해당 객체에 예시 값을 쓰며 바깥 라벨만 바꾸고 iframe 내부 버튼은 바꾸지 않습니다. 표는 중국어 간체 / 영어 기본값과 한국어 예시입니다.

| 상대 필드            | 중국어 간체 / 영어 기본값                                                                                                 | 상태·역할·제한                                                              | 한국어 예시 값                      |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ----------------------------------- |
| `blog.comments`      | 评论 / Comments                                                                                                           | 조건부 적용: 글 댓글 영역의 접근 가능한 이름이며 추가 가시 제목은 아닙니다. | `"글 토론"`                         |
| `fragments.comments` | 评论 / Comments                                                                                                           | 조건부 적용: Fragment 댓글 버튼·팝업 제목입니다.                            | `"토론 참여"`                       |
| `fragments.close`    | 关闭 / Close                                                                                                              | 조건부 적용: 팝업 닫기이며 홈 창 닫기 이름에도 씁니다.                      | `"창 닫기"`                         |
| `fragments.loading`  | 正在加载评论… / Loading comments…                                                                                         | 조건부 적용: Fragment 댓글 로드 상태입니다.                                 | `"토론을 불러오는 중…"`             |
| `fragments.error`    | 评论未能加载，请检查网络或评论配置后重试。 / Unable to load comments. Check your network or comment settings, then retry. | 조건부 적용: Fragment 댓글 실패입니다.                                      | `"현재 토론을 이용할 수 없습니다."` |
| `fragments.retry`    | 重试 / Retry                                                                                                              | 조건부 적용: Fragment 댓글 재시도 버튼입니다.                               | `"다시 불러오기"`                   |

나머지는 [글 사전](/ko/blog/config-article/#article-messages)과 [Fragments 사전](/ko/blog/config-fragments/#fragment-messages)에 있습니다. iframe 언어는 이 필드가 아닌 위 lang 규칙입니다.

<a id="limits"></a>

## 로드·검증 범위

글은 비동기 client.js를 출력합니다. loading: 'lazy'는 iframe에 전달하며 스크롤까지 script를 미룬다는 뜻이 아닙니다. Fragments는 템플릿을 먼저 출력하고 클릭 후 클라이언트를 넣습니다. eager는 클릭 뒤 iframe 동작입니다. [공식 로드 설명](https://giscus.app/)을 참고하세요.

로컬 코드는 글 매핑 제약·Fragment 필수를 검사하지만 GitHub 로그인, 앱 권한, 공개 여부, 카테고리, 네트워크, 서비스 가용성을 증명하지 않습니다. 글 연결이 비면 렌더링하지 않을 수 있고 공백만 있어도 출력 조건을 통과할 수 있으므로 올바른 설정으로 취급하지 마세요. Fragments의 검사는 더 엄격해도 ID 진위는 확인하지 않습니다.

모든 theme.comments 필드는 소비 위치가 있지만 전부 Fragments에 적용되지는 않습니다. 개별 글 스위치, 자체 호스팅 주소, 정렬, 관리자 token, 로컬 DB 설정은 없습니다. 클라이언트는 https://giscus.app/client.js 고정입니다. Giscus 저장소 설정은 추가 site.config 필드가 아닙니다.

설정 후 재빌드·재배포해야 하며 빌드 통과가 실제 서비스 확인은 아닙니다. 이전 토론 이전·권한은 GitHub/Giscus에서 처리해야 하며 저장만으로 자동 완료되지 않습니다. [설정 시작 페이지](/ko/blog/config-reference/)에서 다른 모듈을 보세요.
