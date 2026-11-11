---
tags: ['anglefeint', 'starter']
title: '사용자 가이드 5: 조각 게시하기'
description: '짧은 생각을 Markdown으로 기록하고 선택적으로 팝업 댓글을 사용합니다.'
pubDate: '2026-11-11'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

기존 블로그는 테마를 0.29.0 이상으로 먼저 업그레이드하세요:

```bash
npx @anglefeint/astro-theme@latest upgrade
```

`src/site.config.ts`의 기존 theme에 합칩니다. 조각과 댓글은 기본적으로 꺼져 있습니다. 메뉴는 Decoder Lab 아래에 표시됩니다.

```ts
theme: {
  fragments: { enabled: true, pageSize: 20, comments: { enabled: false } },
},
```

활성화한 뒤 `/<locale>/fragments/`로 이동하세요. `pageSize`는 1–100의 정수입니다. 파일은 `.md`를 사용하며 초안이나 미래 날짜를 필터링하지 않습니다. 아직 공개하지 않을 조각은 `src/content/fragments/` 밖에 보관하세요.

활성화된 모든 언어에 같은 조각의 골격 만들기:

모든 활성 언어를 기본으로 생성하려면 테마 0.31.0 이상이 필요합니다. 먼저 업그레이드하세요. 0.29–0.30에서는 `--locales`로 명시해야 합니다.

```bash
npx @anglefeint/astro-theme@latest new-fragment
```

`new-post`와 동일하게 기본적으로 프로젝트의 모든 활성 언어에 같은 ID와 타임스탬프를 공유하는 골격을 만듭니다. 자동 번역은 하지 않습니다. 우선순위는 `--locales` → `ANGLEFEINT_LOCALES` → 활성 언어입니다. 명시한 목록은 공백 제거, 소문자 변환, 중복 제거를 거치며 설정을 읽지 않고 지정 언어 디렉터리만 만듭니다. 언어 활성화 설정은 바꾸지 않습니다.

새 starter는 `npm run new-fragment`도 제공합니다. 기존 프로젝트는 스크립트 추가 없이 npx를 사용할 수 있습니다.

```bash
npx @anglefeint/astro-theme@latest new-fragment --locales en,zh
npx @anglefeint/astro-theme@latest new-fragment --locales ko
```

`src/content/fragments/<locale>/`의 Markdown을 편집합니다. 제목은 선택 사항입니다:

나중에 번역을 추가하려면 원본 Markdown을 대상 언어 폴더로 복사하고 id를 유지한 채 본문을 번역하세요.

```md
---
id: 550e8400-e29b-41d4-a716-446655440000
pubDate: 2026-11-11T08:30:00+08:00
---

조각.
```

수정하거나 파일 이름을 바꿔도 id를 유지합니다. 같은 조각의 번역만 ID를 공유합니다. 같은 언어에서 ID가 중복되면 빌드가 실패합니다. pubDate에 시간과 시간대를 포함합니다. UTC로 표시하고 최신순으로 정렬합니다.

팝업 댓글은 `theme.fragments.comments.enabled`를 true로 설정하고 `theme.comments`의 repo, repoId, category, categoryId를 Giscus 값으로 채웁니다. 저장소 설정은 가이드 4를 참고하세요. 글 댓글은 꺼 둘 수 있습니다. [Giscus](https://giscus.app/) · [4](../starter-guide-4-giscus-comments/)

```ts
theme: {
  fragments: { enabled: true, comments: { enabled: true } },
  comments: {
    repo: 'yourname/your-repository',
    repoId: 'R_...',
    category: 'Your category',
    categoryId: 'DIC_...',
  },
},
```

조각은 specific, 엄격한 일치, `fragment/<id>`를 사용합니다. 글의 mapping, term, number, shareAcrossLocales, lang을 사용하지 않으며 UI는 페이지 언어를 따릅니다. 같은 ID의 번역은 댓글과 반응을 공유합니다. 글 토론 연결은 유지됩니다. 첫 클릭에서 댓글 클라이언트를 로드합니다. 닫으면 팝업을 숨기며, 다시 열거나 다른 조각으로 전환할 때 같은 댓글 인스턴스를 재사용합니다.

정적 게시입니다. Markdown 수정 후 다시 빌드하고 배포합니다. 온라인 작성 화면은 없습니다. 글 검색, RSS, 글 Markdown 내보내기와 분리됩니다. 이미지는 `public/images/`에 두고 `/images/...`로 참조합니다.

테마를 0.29.0 이상으로 업그레이드하고 설정으로 켭니다. 개인 콘텐츠, 설정, 음악, 이미지는 보존됩니다. 개인 가이드는 덮어쓰지 않으므로 최신 demo를 참고하세요. GitHub 토론을 합치거나 삭제하지 않습니다.

댓글은 원격으로 불러옵니다. Giscus가 준비될 때까지 로딩을 표시하고 실패하거나 15초가 지나면 다시 시도를 제공합니다. 네트워크나 설정을 확인하세요. 글과 같은 Giscus 연동을 재사용하므로 Giscus npm 패키지를 따로 설치할 필요가 없으며 기존 글의 연결도 바꾸지 않습니다.

```bash
npm run build
```

0.32.0 이상 페이지 탐색 개선: 조각은 Blog와 페이지 번호, 네온 스타일, 설정한 기준에 따라 표시되는 페이지 이동 입력란을 공유합니다. `theme.pagination`은 두 목록에 공통으로 적용되며, 조각의 페이지당 개수는 계속 `theme.fragments.pageSize`로 별도 설정합니다.

## 안정적인 공유 링크 (0.32.0 이상)

0.32.0 이상 공유 기능: 날짜 링크로 목록의 해당 조각을 찾고 옆에서 링크를 복사할 수 있습니다. 공유 주소는 `/ko/fragments/#fragment-ID`이며 ID는 Markdown frontmatter의 id입니다. 현재 페이지에 없을 때만 언어별 소형 정적 인덱스를 읽어 해당 페이지로 이동합니다. 내용 추가, 날짜 또는 pageSize 변경 후 다시 빌드하고 ID는 유지하세요. 페이지 간 위치 찾기와 복사에는 JavaScript가 필요합니다.

실제 탐색 주소에는 페이지 번호가 있을 수 있으므로 공유할 때는 날짜 링크나 복사 버튼을 사용하세요. 기존 페이지는 오래된 앵커를 보정하지만 사라진 페이지 번호는 사이트의 일반 404로 처리됩니다. 이 기능은 404 페이지를 가로채지 않습니다.

조각이 없거나 네트워크가 실패하면 안내하며 반복 이동하지 않습니다. 클립보드가 차단되면 수동 복사용 링크를 보여줍니다. 이 기능은 테마 0.32.0 이상이 필요합니다. 자동 위치 찾기를 사용하기 전에 업그레이드하세요.
