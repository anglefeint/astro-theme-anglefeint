---
tags: ['anglefeint', 'starter']
title: '사용 가이드 4: Fragment 게시하기'
subtitle: 'Markdown으로 짧은 생각을 기록하고 이미지나 코드를 넣어 안정적인 링크로 공유합니다. 댓글은 필요할 때 켜세요.'
description: 'Fragments 활성화와 Markdown 생성·편집부터 홈 미리보기, 페이지 나누기와 공유, 다국어, 선택적인 Giscus 댓글까지 안내합니다.'
pubDate: '2026-11-11'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

이 글은 입문 가이드의 4 / 8편입니다. [전체 가이드 순서](/ko/blog/starter-guide-1-configure-your-site/#tutorial-order) · [필드별 설정 사전](/ko/blog/config-reference/).

짧은 생각, 이미지 한 장, 코드 한 조각을 기록하려고 완전한 글을 쓸 필요는 없습니다. Fragments는 이런 콘텐츠를 시간순의 별도 목록에 모으고 홈에 최근 콘텐츠 미리보기 입구를 제공합니다.

현재의 통합형 starter를 기준으로 설명합니다. 기존 프로젝트에 해당 명령이나 기능이 없다면 [블로그 설치와 내 정보 설정](/ko/blog/starter-guide-1-configure-your-site/)의 업그레이드 설명을 먼저 따르세요.

## 1. Fragment 목록 켜기

`src/site.config.ts`를 열고 다음 `fragments`를 기존 `theme` 객체에 합치세요. 이미 `theme`가 있으면 필드만 추가하거나 수정하고 같은 이름의 객체를 중복 생성하지 마세요.

```ts
theme: {
  fragments: {
    enabled: true,
    pageSize: 20,
    comments: { enabled: false },
  },
},
```

| 필드                               | 기본값과 실제 역할                                                                                                   |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `theme.fragments.enabled`          | 기본 `false`입니다. 켜면 활성 언어에 Fragment 목록을 생성하며 콘텐츠가 있는 홈에 미리보기 입구를 표시할 수 있습니다. |
| `theme.fragments.pageSize`         | 기본 `20`입니다. 페이지당 개수이며 1–100 정수여야 합니다. 블로그 페이지당 글 수와는 독립적입니다.                    |
| `theme.fragments.comments.enabled` | 기본 `false`입니다. Fragment 댓글 팝업을 켜며 아래의 Giscus 저장소 설정도 필요합니다.                                |

로컬에서 `npm run dev`를 실행하고 터미널 주소 아래의 `/<locale>/fragments/`를 여세요. 예를 들어 `/en/fragments/`, `/zh/fragments/`이며 해당 언어가 프로젝트에서 활성화되어 있어야 합니다. 콘텐츠가 없으면 빈 목록을 표시하며 페이지 파일을 먼저 만들 필요는 없습니다. Fragments를 끄면 목록을 생성하지 않고 홈 입구도 숨기지만 Markdown 파일은 삭제하지 않습니다.

## 2. 기본 흐름으로 Fragment 만들기

프로젝트 루트에서 실행하세요.

```bash
npm run new-fragment
```

`--locales`나 `ANGLEFEINT_LOCALES`를 지정하지 않으면 모든 활성 언어에 같은 Fragment의 뼈대를 만듭니다. 초기 설정에서는 아홉 개를 만듭니다. 파일은 `src/content/fragments/<locale>/`에 있으며 같은 호출에서 ID와 게시 시간을 공유하지만 자동 번역하지는 않습니다. 터미널이 실제 경로를 출력합니다. 파일 이름은 `2026-11-13-q8Lm3XzP.md`처럼 UTC 날짜와 무작위 ID를 포함합니다. 이 예시 이름으로 직접 만들지 말고 방금 생성된 파일을 여세요.

중국어 간체만 만들려면 `npm run new-fragment -- --locales zh`, 여러 언어는 `--locales en,zh`를 사용할 수 있습니다. 대체 사용법이므로 필요한 하나를 고르고 모두 실행하지 마세요. 해당 언어를 자동 활성화하지 않습니다. 공개 전에 미완성 다른 언어 뼈대는 Fragment 콘텐츠 디렉터리 밖으로 옮기세요.

**명령을 실행할 때마다 새 Fragment를 만듭니다.** 기존 내용을 수정할 때는 원래 파일을 편집하세요. 같은 내용을 계속 쓰려고 생성 명령을 다시 실행하지 마세요. slug를 정할 필요는 없으며 기존 파일을 덮어쓰지 않습니다.

현재 starter에는 `new-fragment` 스크립트가 있습니다. 구형 프로젝트에 이 스크립트가 없다면 테마가 업데이트되었는지 확인한 뒤 프로젝트 CLI를 사용하세요.

```bash
npx @anglefeint/astro-theme new-fragment
```

앞의 생성 명령을 대신하는 문법입니다. “같은” Fragment를 만들려고 둘 다 실행하지 마세요.

## 3. 임시 본문을 바꾸고 ID 유지하기

생성 파일 위쪽은 frontmatter이고 두 번째 `---` 뒤부터 본문입니다. 생성된 `id`, `pubDate`를 유지하고 임시 본문을 내 생각으로 바꾸세요. 아래는 형식 예시이므로 예시 ID로 자신의 ID를 덮어쓰지 마세요.

```md
---
id: 'q8Lm3XzP'
pubDate: '2026-11-13T09:00:00+08:00'
---

今天把一个困扰很久的问题解决了，记下这个小进展。
```

현재 지원하는 frontmatter는 세 가지입니다.

| 필드      | 작성 방법                                                                                                                               |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `id`      | 필수입니다. 영문·숫자 정확히 8자리이며 대소문자를 구분합니다. 생성 명령이 만들고 기존 ID와 중복 검사하므로 직접 고안할 필요는 없습니다. |
| `pubDate` | 필수이며 해석 가능한 게시 날짜입니다. 생성된 ISO 시간을 유지하거나 시간과 시간대가 있는 값을 권장합니다.                                |
| `title`   | 선택 문자열이며 입력하면 목록 카드 제목으로 표시합니다. 없어도 정상 게시할 수 있습니다.                                                 |

제목을 넣으려면 같은 frontmatter에 `title: '一个小进展'` 같은 값을 추가하면 됩니다. 글과 달리 `description`은 필요하지 않으며 글 표지 `heroImage`도 없습니다. 이미지는 본문에 씁니다.

목록은 `pubDate` 최신순이며 시간이 같으면 ID로 정렬합니다. 파일 이름순이 아닙니다. 페이지는 UTC 시간을 표시하므로 입력한 로컬 시간대와 다를 수 있습니다. 본문이나 파일 이름만 바꿔도 댓글·공유 정체성은 유지됩니다. 날짜를 바꾸면 정렬과 소속 페이지가 달라집니다.

**게시 뒤 ID를 유지하세요.** 같은 언어에 중복 ID가 있으면 오류가 나며 서로 다른 Fragment에 ID를 재사용하지 마세요. 이전 UUID나 긴 ID는 현재 형식에 맞지 않습니다. 원본 콘텐츠를 백업한 뒤 호환 처리를 하세요. 테마는 이전 ID, 공유 링크, 댓글의 자동 마이그레이션을 제공하지 않습니다. ID 일괄 변경을 일반 파일 정리처럼 취급하지 마세요.

현재 `src/content/fragments/` 아래의 `.md`만 수집하며 `.mdx` Fragment는 지원하지 않습니다. 초안·미래 날짜 필터가 없으므로 `draft: true`나 미래 시간으로 숨길 수 없습니다. 공개 준비가 안 된 내용은 이 디렉터리 밖에 두세요.

## 4. 이미지, 코드, 수식 넣기

일반 Markdown 문단, 링크, 목록, 인용을 사용할 수 있습니다. 이미지 예시는 다음과 같습니다.

```md
![这次进展的截图](/images/fragments/progress.png)
```

먼저 실제 파일을 `public/images/fragments/progress.png`에 넣으세요. Fragment 옆에 `photo.png`를 두고 `![설명](./photo.png)`로 참조해도 됩니다. 다른 문법, 파일 크기, Git 커밋 요구 사항은 [글과 Fragments에 이미지 넣기](/ko/blog/starter-guide-images/)를 참고하세요.

코드는 Markdown 펜스와 들여쓰기를 유지하세요.

````md
```js
const progress = {
  done: true,
};
```
````

코드 블록은 콘텐츠 표시이며 JavaScript를 썼다고 실행하지 않습니다. 글 페이지의 코드 복사 버튼이나 이미지 확대가 Fragments에도 적용된다고 생각하지 마세요. 현재 Fragment 목록은 이 두 글 전용 동작에 연결하지 않습니다.

사이트 수식이 켜져 있으면 Fragments도 `$x_1$` 인라인과 두 줄의 `$$` 사이 독립 수식을 지원합니다. 빌드 시 렌더링하며 잘못된 수식은 컴파일·빌드를 실패시킵니다. `theme.math.enabled`를 끄면 수식 처리를 끕니다. 문법은 [첫 글 쓰기](/ko/blog/starter-guide-2-languages-and-routing/)를 참고하세요.

로컬 dev나 doctor는 지원하는 Fragment 이미지의 반응형 파일을 준비합니다. Fragment Markdown, 원본과 `src/assets/blog/covers/` 전체를 커밋하세요. 배포 빌드·CI doctor는 검사만 하며 플랫폼에서 추가 생성하지 않습니다. 본문만 커밋하고 이미지 파일을 빠뜨리지 마세요.

## 5. 홈 미리보기와 목록 페이지 나누기

Fragments를 켜고 현재 언어에 콘텐츠가 있으면 홈 header 아래에 픽셀 아바타 입구가 나옵니다. 열면 최신 최대 세 개를 미리 봅니다. 별도의 홈 설정은 필요 없으며 글 개수 설정인 `homeLatestCount`에도 영향을 받지 않습니다.

미리보기는 텍스트, 첫 사용 가능한 이미지, 첫 코드 블록의 요약을 포함하며 전체 본문은 아닙니다. 이미지와 코드의 높이를 제한하고 넘치는 부분을 자릅니다. 여러 이미지나 코드 블록을 전부 표시하지 않습니다. 카드 전체를 누르면 해당 Fragment로 이동하고 하단의 “미리보기 개수 / 현재 언어 전체 개수 →”는 전체 목록으로 이동합니다. 두 개가 있으면 `2 / 2`이며 세 개로 고정되지 않습니다. 빈 목록은 홈 입구를 표시하지 않습니다.

전체 목록은 `theme.fragments.pageSize`로 나눕니다. 첫 페이지는 `/zh/fragments/`, 두 번째는 `/zh/fragments/2/`입니다(중국어 간체 예시). 페이지 나누기 외형과 이동은 `theme.pagination`을 공유하지만 블로그의 `blogPageSize`는 Fragment 페이지당 개수를 정하지 않습니다.

목록에서 언어를 전환하면 대상 언어의 첫 페이지로 갑니다. 같은 번역이나 페이지 번호를 유지한다고 보장하지 않습니다. 번역 개수는 다를 수 있고 각 언어의 전체 개수를 따로 계산합니다.

## 6. Fragment 하나 공유하기

Fragments는 목록에 표시하며 개별 상세 페이지를 만들지 않습니다. 외부에 공유하려면 카드 날짜 링크나 옆의 링크 복사 버튼을 사용하세요.

```text
https://your-domain.example/zh/fragments/#q8Lm3XzP
```

도메인과 ID를 실제 값으로 바꾸세요. 날짜 링크와 복사 버튼은 목록 루트 경로와 ID를 사용하므로 현재 몇 번째 페이지에 있는지에 의존하지 않습니다. 새 콘텐츠, 날짜, pageSize를 변경하고 다시 빌드·배포하면 위치 인덱스도 갱신됩니다.

대상 Fragment가 현재 페이지에 없으면 JavaScript로 현재 언어의 정적 인덱스를 필요할 때 읽고 해당 페이지로 이동해 위치를 찾습니다. JavaScript가 없어도 페이지를 탐색할 수 있지만 페이지 간 자동 위치 이동과 복사 버튼은 사용할 수 없습니다. 클립보드 권한이 제한되면 직접 복사할 수 있도록 선택 가능한 링크를 제공합니다.

주소창의 `/2/` 링크를 장기 공유 주소로 쓰지 마세요. 여전히 존재하는 이전 페이지는 오래된 앵커를 수정할 수 있지만 이전 페이지 번호가 사라졌다면 기존 404로 들어갑니다. 위치 스크립트는 404를 처리하지 않습니다. 콘텐츠 삭제, ID 없음, 인덱스 로드 실패 시 안내하며 삭제한 Fragment를 복구하지는 않습니다.

모든 Fragment 공유 링크는 해당 언어 목록의 페이지 공유 이미지를 사용하며 ID별 이미지는 만들지 않습니다. 기본 이미지 변경은 [이미지 가이드의 공유 이미지 설명](/ko/blog/starter-guide-images/)을 참고하세요.

## 7. 같은 Fragment의 번역 추가하기

중국어 간체와 영어 뼈대만 준비하려면 앞의 기본 명령 대신 다음을 사용하세요.

```bash
npm run new-fragment -- --locales zh,en
```

같은 명령으로 만든 각 언어 파일은 ID와 타임스탬프를 공유하며 본문은 직접 번역해야 합니다. `--locales`는 생성할 파일만 선택하며 언어를 활성화하지 않습니다. 우선순위는 `--locales` → `ANGLEFEINT_LOCALES` 환경변수 → 프로젝트 활성 언어이며 매개변수를 생략해도 자동 번역 기능은 없습니다.

나중에 기존 중국어 간체 Fragment의 영어 번역을 추가하려면 원래 파일을 `src/content/fragments/en/`에 복사하고 `id`, `pubDate`를 유지한 뒤 제목과 본문을 번역하세요. 같은 내용의 번역을 추가하려고 생성 명령을 다시 실행하면 다른 ID를 할당합니다. 같은 Fragment의 번역은 언어 간 ID를 공유할 수 있지만 같은 언어에 같은 ID 파일 두 개를 두면 안 됩니다.

같은 ID의 번역은 Fragment 댓글을 공유합니다. 다른 ID는 문구나 파일 이름이 같아도 자동 연결하지 않습니다.

## 8. 필요할 때 댓글 켜기

기록만 하고 싶다면 댓글을 꺼 두어도 됩니다. 댓글을 받으려면 [Giscus 댓글 가이드](/ko/blog/starter-guide-4-giscus-comments/)에 따라 공개 저장소, Discussions, Giscus 앱, 토론 카테고리를 준비하고 실제 ID를 얻은 뒤 기존 설정에 합치세요.

```ts
theme: {
  fragments: {
    enabled: true,
    comments: { enabled: true },
  },
  comments: {
    repo: 'yourname/your-repository',
    repoId: 'REPLACE_WITH_REPO_ID',
    category: 'Announcements',
    categoryId: 'REPLACE_WITH_CATEGORY_ID',
  },
},
```

계정, 저장소, 카테고리, 두 ID 자리표시자를 바꾸세요. 기존 `theme.comments`가 있다면 다른 설정을 유지하세요. 저장소·카테고리 네 필드가 없으면 설정 오류가 나며 자리표시자를 넣었다고 원격 설정이 유효한 것은 아닙니다. Giscus script를 붙이거나 추가 Giscus npm 패키지를 설치할 필요는 없습니다.

Fragment 댓글 스위치는 `theme.fragments.comments.enabled`입니다. 이를 위해 글 댓글의 `theme.comments.enabled`를 true로 바꿀 필요는 없습니다. 이미 글 댓글을 사용한다면 내 설정을 계속 유지해도 됩니다.

Fragment 댓글은 `specific`, 엄격한 일치와 `fragment/<id>`를 고정 사용합니다. 글의 mapping, term, number, shareAcrossLocales, 고정 lang을 사용하지 않습니다. UI는 현재 페이지 언어를 따르고 같은 ID의 번역은 토론과 반응을 공유하며 댓글 본문은 자동 번역하지 않습니다. 나머지 공유 외형 설정은 계속 `theme.comments`에서 가져옵니다.

목록 카드의 댓글 버튼을 눌러야 클라이언트를 로드합니다. 팝업을 닫아도 인스턴스를 유지하고 다시 열거나 Fragment를 바꾸면 재사용합니다. 클라이언트 실패 또는 약 15초 동안 준비되지 않으면 재시도를 표시합니다. 네트워크 로드 안내를 댓글 연결 성공으로 간주하지 마세요. 방문자가 댓글을 작성하려면 GitHub 인증이 필요합니다.

ID를 바꿔도 이전 댓글이 이동하지 않으며 Fragment를 삭제해도 GitHub 토론을 삭제하지 않습니다. 토론 이전이 필요하면 직접 판단해 처리하고 테마가 자동 병합한다고 기대하지 마세요.

## 9. 배포 전 확인

dev에서 콘텐츠, 시간, 홈 미리보기, 페이지 나누기를 확인하세요. 배포 전에 dev를 멈추고 실행합니다.

```bash
npm run doctor
npm run preview
```

doctor는 로컬 이미지 준비, 검사, 빌드를 포함하므로 성공 직후 build를 반복할 필요는 없습니다. 빌드 뒤 preview에서 공유 위치 이동과 이미지를 확인하고 댓글을 설정했다면 팝업도 확인하세요. 미리보기는 사이트를 게시하지 않습니다. 갱신된 정적 산출물을 다시 배포해야 온라인 콘텐츠가 바뀝니다.

Fragments는 글 전문 검색이나 글 RSS에 들어가지 않습니다. 빌드 시 언어별 `/zh/fragments/index.md`를 만들며 다른 언어는 `zh`를 바꿉니다. 해당 언어의 공개 Fragments를 합치고 ID, 시간, 본문, 안정적 링크를 유지하며 AI 읽기용 인덱스에도 포함합니다. 공개 출력이며 비공개 백업은 아닙니다. 댓글은 포함하지 않습니다.

- 목록이 없음: fragments 스위치와 대상 언어의 활성 여부를 확인하세요.
- 홈에 아바타가 없음: 현재 언어에 실제 Fragment가 있는지 확인하세요. 다른 언어의 콘텐츠만으로는 충분하지 않습니다.
- 기존 파일 때문에 생성 명령 실패: 기존 frontmatter ID 형식을 확인하세요. 생성기는 기존 Markdown ID를 읽어 중복 검사합니다.
- 빌드에서 중복 ID 보고: 같은 언어에 두 파일을 복사했는지 확인하세요. 번역은 다른 언어 디렉터리에 두어야 합니다.
- 이미지 빌드 실패: [이미지 가이드](/ko/blog/starter-guide-images/)에 따라 원본, manifest, 파생 파일을 준비하고 커밋하세요.
- 댓글 실패: 실제 저장소 ID, 앱 권한, 카테고리, 네트워크, 브라우저 차단을 확인하고 Fragment ID를 반복 변경하지 마세요.

업그레이드는 [첫 가이드의 업그레이드 설명](/ko/blog/starter-guide-1-configure-your-site/)을 참고하세요.

## 가이드 탐색과 설정 조회

[이전 글: 글과 Fragments에 이미지 넣기](/ko/blog/starter-guide-images/) · [다음 글: 페이지와 기능을 취향에 맞게 조정하기](/ko/blog/starter-guide-3-comments-about-and-theme-toggles/) · [여덟 편의 가이드 시작 페이지](/ko/blog/starter-guide-1-configure-your-site/#tutorial-order).

관련 필드: [Fragment 스위치, 페이지 나누기, 콘텐츠 필드](/ko/blog/config-fragments/), [Fragment 댓글](/ko/blog/config-comments/). 전체 경로, 기본값, 제한은 [설정 사전 시작 페이지](/ko/blog/config-reference/)를 참고하세요.
