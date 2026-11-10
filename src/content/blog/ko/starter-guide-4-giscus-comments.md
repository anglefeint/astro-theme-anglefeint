---
tags: ['anglefeint', 'starter']
title: '사용 가이드 4: Giscus 댓글 설정'
description: '사용 가이드 4: Giscus 댓글 설정'
pubDate: '2026-11-10'
updatedDate: '2026-11-10'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

`src/site.config.ts`의 기존 `defineThemeConfig({...})`에 아래 `theme.comments` 설정을 병합하세요. 다른 설정을 유지하고 `theme` 또는 `comments` 키를 중복으로 만들지 마세요.

`shareAcrossLocales: false` — `mapping: 'pathname'`

## 댓글 설정 가이드

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

## 같은 글의 번역끼리 댓글 공유

댓글과 언어 간 공유는 기본적으로 꺼져 있습니다. 경로별 댓글은 위 설정을 사용하세요. 번역끼리 하나의 토론을 공유하려면 저장소와 카테고리 값을 유지하고 매핑 옵션을 다음과 같이 바꾸세요:

```ts
theme: {
  comments: {
    // 기존 enabled, repo, repoId, category, categoryId 값을 유지하세요.
    shareAcrossLocales: true,
    mapping: 'specific',
    term: '',
    number: '',
    strict: '1',
    lang: '',
  },
},
```

공유 모드에서는 mapping이 specific, term과 number가 빈 문자열, strict가 문자열 1이어야 합니다. 글이 언어 접두사가 없는 전체 slug를 data-term으로 전달합니다. 아홉 언어에서 cypherpunk-ideals-ai-and-the-future-of-crypto를 함께 사용합니다. guides/setup과 other/setup은 서로 다른 토론입니다. slug가 없으면 오류가 발생합니다. 번역에는 같은 slug를 사용하세요. lang이 비어 있으면 페이지 언어를 따르고, 지정하면 고정됩니다. 댓글 본문은 번역하지 않고 토론과 반응을 공유합니다.

공유를 끄면 사용자 지정 mapping, term, number, strict는 그대로 동작합니다. specific은 비어 있지 않은 term, number는 양의 정수 문자열이 필요합니다. 공유와 댓글이 켜진 상태에서 잘못된 mapping, 비어 있지 않은 term/number, 1이 아닌 strict는 설정 오류입니다. 번역 두 개와 다른 글에서 연결을 확인하세요. 댓글 작성에는 GitHub 인증이 필요합니다. 기존 comments 객체에 병합하고 다른 설정을 덮어쓰지 마세요.

기존 토론을 자동으로 합치거나 이동하거나 삭제하지 않습니다. 공유를 켜면 다른 토론에 연결되어 이전 댓글이 보이지 않을 수 있습니다. 변경 전에 mapping, term, number, strict를 저장하세요. 복원하려면 shareAcrossLocales: false로 설정하고 원래 값을 되돌리세요. 기존 댓글의 이전이 필요하면 GitHub에서 직접 검토하고 처리하세요. 테마는 자동 이전하지 않습니다.

기존 통합 starter는 이 옵션이 포함된 테마 릴리스로 먼저 업그레이드하세요. 설정을 바꾼 뒤 다시 빌드하고 배포하며 프로덕션 미리보기에서 댓글을 확인하세요.

```bash
npx @anglefeint/astro-theme@latest upgrade
npm run build
npm run preview
```

[← 사용 가이드 3](/ko/blog/starter-guide-3-comments-about-and-theme-toggles/)
