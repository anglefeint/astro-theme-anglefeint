---
tags: ['anglefeint', 'starter']
title: '사용 가이드 1: 블로그 설치와 내 정보 설정'
subtitle: '블로그를 로컬에서 실행하고 내 정보를 설정한 뒤 기본 흐름에 따라 글을 만들고 필요하면 언어와 홈 문구를 조정합니다.'
description: '설치와 실행부터 개인 정보, 기본 글 생성 흐름, 로컬 확인까지 안내합니다. 홈 문구와 언어는 필요할 때 조정하며 기존 프로젝트의 업그레이드는 글 끝에서 설명합니다.'
pubDate: '2026-03-07'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/cyber-02.webp'
---

이 글은 입문 가이드의 1 / 8편입니다. [전체 가이드 순서](/ko/blog/starter-guide-1-configure-your-site/#tutorial-order) · [필드별 설정 사전](/ko/blog/config-reference/).

이 글을 읽으면 내 컴퓨터에서 블로그를 실행하고 사이트 이름, 홈 소개, 연락처를 내 정보로 바꾼 다음 어디에서 글을 쓰는지 알 수 있습니다. 음악, 댓글, 페이지 꾸미기는 필요할 때 설정하면 됩니다.

이미 Anglefeint 프로젝트가 있다면 원래 프로젝트의 설정을 수정하세요. 테마를 업데이트하려면 글 끝의 “기존 프로젝트 업그레이드”를 참고하면 되며 블로그를 새로 설치할 필요는 없습니다.

<a id="tutorial-order"></a>

## 여덟 편의 가이드는 어떤 순서로 읽나요?

처음 사용한다면 아래 순서대로 읽으세요. Fragments, 댓글, 다국어 조정은 선택 사항이며 설치를 마치기 위해 켤 필요가 없습니다. 한국어 가이드를 읽는다고 프로젝트의 기본 언어를 바꿀 필요는 없습니다. 언어를 조정하고 싶을 때 해당 장을 따라 하세요. 나중에 특정 필드만 바꾸고 싶다면 [설정 사전의 시작 페이지](/ko/blog/config-reference/)에서 바로 찾을 수 있습니다.

| 순서 | 가이드                                                                                             | 읽고 나면 할 수 있는 일                                                |
| ---- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| 1    | [블로그 설치와 내 정보 설정](/ko/blog/starter-guide-1-configure-your-site/)                        | 블로그를 실행하고 내 정보를 수정하며 기본 흐름을 이해합니다.           |
| 2    | [첫 글 쓰기](/ko/blog/starter-guide-2-languages-and-routing/)                                      | 글을 만들고 날짜, 제목, 태그, 코드, 수식을 작성합니다.                 |
| 3    | [글과 Fragments에 이미지 넣기](/ko/blog/starter-guide-images/)                                     | 원본을 넣고 표지를 설정하며 이미지를 준비하고 파생 파일을 커밋합니다.  |
| 4    | [Fragment 게시하기](/ko/blog/starter-guide-5-fragments/)                                           | Fragment를 만들고 안정적인 ID를 유지하며 이미지와 코드를 넣습니다.     |
| 5    | [페이지와 기능을 취향에 맞게 조정하기](/ko/blog/starter-guide-3-comments-about-and-theme-toggles/) | 페이지 내용, 음악, 페이지 나누기를 조정하고 사용자 페이지를 만듭니다.  |
| 6    | [독자에게 댓글 받기](/ko/blog/starter-guide-4-giscus-comments/)                                    | Giscus를 연결하고 글, Fragments, 번역문의 토론 연결 방식을 선택합니다. |
| 7    | [더 많은 언어의 독자 맞이하기](/ko/blog/starter-guide-languages/)                                  | 사용할 언어와 홈 주소를 선택하고 번역 콘텐츠를 추가합니다.             |
| 8    | [내 도메인에 블로그 배포하기](/ko/blog/starter-guide-deployment/)                                  | 빌드 결과를 확인하고 전체 파일을 배포하며 도메인을 연결합니다.         |

각 글의 시작이나 끝에서 언제든 이 목차로 돌아와 다음 단계로 이동하거나 필요한 내용을 찾을 수 있습니다.

## 1. 블로그 설치하고 열기

먼저 Node.js 22.12.0 이상과 npm을 준비하세요. 터미널에서 다음 두 명령을 실행해 버전 번호가 나오는지 확인합니다.

```bash
node --version
npm --version
```

프로젝트를 둘 디렉터리에서 블로그를 만드세요. 다음 명령은 `my-blog` 폴더를 만들며 의존성을 자동으로 설치하지는 않습니다.

```bash
npm create astro@latest -- my-blog --template anglefeint/astro-theme-anglefeint#starter --no-install --no-ai
cd my-blog
npm install
npm run dev
```

`my-blog`를 다른 폴더 이름으로 바꿔도 됩니다. 그때는 `cd` 뒤의 이름도 함께 바꾸세요. 터미널에 나온 로컬 주소를 여세요. 포트가 사용 중이면 달라질 수 있으므로 포트 번호를 미리 단정하지 마세요. 개발 서버는 계속 실행되며 `Ctrl+C`로 멈춥니다.

이후 명령은 모두 `package.json`이 있는 프로젝트 루트에서 실행합니다. 기존 프로젝트를 다시 열 때는 그 디렉터리로 이동해 `npm run dev`만 실행하면 됩니다. 최초 설치 시나 의존성이 바뀌었을 때만 `npm install`이 필요합니다.

이 글은 npm을 사용합니다. pnpm으로 새 프로젝트를 사용한다면 설치와 실행 명령을 `pnpm install`, `pnpm dev`로 바꿀 수 있지만 글 끝의 자동 업그레이드는 현재 npm 프로젝트만 지원합니다. 한 프로젝트에서는 같은 패키지 관리자를 계속 사용하세요.

## 2. 사이트 정보와 홈 문구를 내 것으로 바꾸기

설치한 프로젝트에는 이미 `src/site.config.ts`가 있으므로 이 파일을 바로 편집하면 됩니다. 설정 파일을 새로 만들거나 설정 객체를 다시 선언할 필요는 없습니다. starter는 기본적으로 `site`를 생략하고 테마 기본값을 사용합니다. 기존 `defineThemeConfig({ ... })` 안에 다음 필드를 넣으세요. 이미 `site`가 있다면 그 안의 필드만 수정하고 나머지 개인 설정을 유지하세요. 같은 이름의 객체를 중복 추가하지 말고 기존 import, export와 나머지 내용도 유지하세요.

```ts
site: {
  title: '小林的博客',
  description: '记录开发、阅读和生活。',
  url: 'https://example.com',
  author: '小林',
  tagline: '保持好奇，持续记录。',
},
```

위 예시는 기존 객체 내부의 멤버만 보여 주며 새로운 전체 설정 파일이 아닙니다. 이름, 문구, 도메인을 내 것으로 바꾸세요. 기본 언어나 활성 언어 목록은 바뀌지 않습니다. `site.url`에는 로컬 미리보기나 특정 글의 주소 대신 `https://your-domain.example`처럼 최종 공개 도메인을 넣으세요. 아직 도메인이 없다면 예시를 잠시 두어도 되지만 정식 배포 전에 바꾸세요. 현재 테마는 도메인 루트에 배포하는 방식이며 Astro `base`만 설정했다고 하위 디렉터리 배포가 지원되는 것은 아닙니다.

각 필드는 다음을 제어합니다.

| 필드               | 실제 역할                                                                                                                              |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| `site.title`       | 페이지 제목, 내비게이션, 푸터 등에 쓰는 사이트 전체 이름입니다. 홈 제목을 따로 정하지 않으면 홈 대제목의 최종 대체값으로도 사용합니다. |
| `site.author`      | 작성자를 따로 지정하지 않은 글에 사용하는 기본 작성자입니다.                                                                           |
| `site.url`         | canonical, RSS, sitemap, 공유 이미지 등의 출력에 사용하는 사이트 주소입니다.                                                           |
| `site.description` | 사이트 전체의 기본 설명입니다. 홈은 해석된 `messages.siteDescription`을 우선 사용하며 그 값이 비어 있을 때만 이 값을 사용합니다.       |
| `site.tagline`     | 푸터의 사용자 문구입니다. `''`로 설정하면 이 문구는 표시하지 않으며 테마와 Astro 크레딧은 별도의 스위치로 제어합니다.                  |

### 필요하면 언어별 홈 문구 바꾸기

홈에 보이는 소개와 홈 메타 설명은 해당 언어 아래에 입력해야 합니다. 아래는 프로젝트의 기본 영어 홈 예시입니다. 기존 설정 객체에 `i18n`을 추가하거나 합치고, 같은 이름의 객체가 이미 있으면 해당 필드만 수정하세요.

```ts
i18n: {
  locales: {
    en: {
      site: { hero: 'Notes on projects, reading and everyday life.' },
      messages: { siteDescription: 'Personal projects and learning notes by Lin.' },
    },
  },
},
```

`i18n.locales.en.site.hero`는 영어 홈 대제목 아래에 보이는 소개를, `messages.siteDescription`은 그 페이지의 SEO 설명을 제어합니다. 앞의 값을 `''`로 설정하면 보이는 소개만 비워지고 뒤의 설명은 비워지지 않습니다. en을 다른 활성 언어 코드로 바꾸면 그 언어의 문구를 수정할 수 있습니다. 기본 언어는 바뀌지 않으며 다른 언어로 자동 번역하지도 않습니다.

홈 대제목은 기본적으로 사이트 전체 이름을 사용합니다. 다르게 쓰려면 같은 `en.site`에 `homeTitle`을 추가하고 기존 `hero`를 유지하세요.

```ts
site: {
  homeTitle: "Lin's Digital Garden",
  hero: 'Notes on projects, reading and everyday life.',
},
```

여기서 `site`는 최상위 `site`가 아니라 `i18n.locales.en` 안에 있습니다. `homeTitle`은 홈에서 보이는 대제목만 바꾸며 브라우저 제목, 내비게이션, 푸터, RSS의 사이트 전체 이름을 바꾸지 않습니다. 생략하거나 공백만 있으면 해당 언어의 대체값 연결을 따라 찾다가 마지막에는 사이트 전체 이름을 사용합니다. 전체 필드는 [홈 설정 사전](/ko/blog/config-home/#home-title)을 참고하세요.

### 내 소셜 링크 넣기

기존 설정 객체에서 `social.links`를 추가하거나 수정하고 `yourname`을 실제 계정으로 바꾸세요.

```ts
social: {
  links: [{ href: 'https://github.com/yourname', label: 'GitHub', icon: 'github' }],
},
```

각 링크에는 `href`(목적지 주소)와 `label`(접근 가능한 이름)을 입력하며 `icon`은 선택적인 내장 아이콘 이름입니다. `github`, `twitter`, `mastodon`, `youtube`, `bluesky`, `linkedin`, `discord`, `telegram`, `instagram`, `facebook`, `whatsapp`, `line`을 지원합니다.

`social.links`는 상단과 푸터에 함께 사용하며 배열 순서대로 표시합니다. 모바일 너비에서는 상단 소셜 입구만 숨기고 푸터는 유지합니다. 배열은 기본 목록 전체를 대체하므로 새 계정을 추가할 때 계속 보여 줄 항목도 남겨 두세요. 아직 계정을 넣지 않으려면 `social: { links: [] }`를 사용할 수 있습니다. 빈 목록은 클릭할 수 없는 자리표시 아이콘 세 개를 유지하며 전체 영역을 숨기는 것은 아닙니다.

### 바꿨는데 변화가 없나요?

먼저 프로젝트 루트의 `.env`, 적용되는 다른 `.env.*` 파일, 호스팅 플랫폼의 빌드 환경에 예전 덮어쓰기 값이 있는지 확인하세요.

- `PUBLIC_SITE_TITLE`은 사이트 이름을 덮어씁니다.
- `PUBLIC_SITE_AUTHOR`는 기본 작성자를 덮어씁니다.
- `PUBLIC_SITE_URL`은 사이트 주소를 덮어씁니다.
- `PUBLIC_SITE_DESCRIPTION`은 사이트 전체 기본 설명을 덮어쓰지만, 비어 있지 않은 홈의 언어별 설명을 대체하지는 않습니다.
- `PUBLIC_SITE_TAGLINE`은 푸터 사용자 문구를 덮어씁니다.

덮어쓰기가 필요 없다면 해당 변수를 지우고 설정 파일로 통일하면 됩니다. 테마 사용을 위해 `.env`를 새로 만들 필요는 없습니다. 환경변수를 바꿨다면 개발 서버를 다시 시작하세요. 공개 사이트는 다시 빌드하고 배포해야 하며 로컬 파일을 저장해도 온라인 페이지가 바로 바뀌지는 않습니다.

## 3. 기본 언어는 우선 유지하고 필요할 때 조정하기

초기 설정은 `en`, `ja`, `ko`, `es`, `zh`, `pt-br`, `de`, `ru`, `zh-hant` 아홉 언어를 활성화하며 기본 언어는 `en`입니다. `/`에 접속하면 `/en/`으로 이동합니다. 한국어 가이드를 읽는다고 블로그를 한국어로 바꿀 필요는 없으며 첫 글을 만들기 위해 다른 언어를 끌 필요도 없습니다.

기본 언어를 바꾸거나 일부 언어만 남기거나 기본 언어의 홈에 루트 주소 `/`를 바로 사용하려면 [일곱 번째 가이드: 더 많은 언어의 독자 맞이하기](/ko/blog/starter-guide-languages/)를 따르세요. 선택적인 설정입니다. 언어 설정을 생략해도 비활성화되지 않습니다. 끄려면 `meta.enabled: false`를 명시해야 하며 기본 언어는 항상 활성화됩니다. 언어를 꺼도 글 파일은 삭제하지 않습니다.

언어 설정의 타입, 기본값과 주소 관계는 [언어 설정 사전](/ko/blog/config-languages/#registry)을 참고하세요. 글과 홈 문구는 자동 번역하지 않으므로 다음 기본 생성 흐름에서 어떤 언어 파일이 생겼는지 확인하세요.

## 4. 예시를 내 글로 바꾸기

글은 `src/content/blog/<locale>/` 아래에 있습니다. starter의 `welcome-to-anglefeint.md`, `starter-guide-*.md`, `config-*.md`는 환영 예시, 8개 튜토리얼, 설정 사전을 위한 일반 블로그 글입니다. 백업하거나 Git에 커밋한 뒤 언어별로 필요한 글을 남기거나 삭제하세요. 환영 글과 튜토리얼만 지우면 사전은 남습니다. 다른 콘텐츠가 참조하는 이미지는 삭제하지 마세요.

기본 흐름으로 글을 만듭니다.

```bash
npm run new-post -- my-first-post
```

`--locales`나 `ANGLEFEINT_LOCALES`를 지정하지 않으면 프로젝트의 모든 활성 언어에 같은 이름의 뼈대 파일을 만듭니다. 초기 설정에서는 아홉 개가 생깁니다. 자동 번역은 하지 않으며 같은 이름의 파일이 있으면 건너뛰고 기존 내용을 덮어쓰지 않습니다.

`src/content/blog/<locale>/my-first-post.md`를 열어 제목, 소개, 본문을 작성하세요. 주소는 `/<locale>/blog/my-first-post/`입니다. 예를 들어 영어 파일은 en 디렉터리에 있으며 주소는 `/en/blog/my-first-post/`, 중국어 간체는 zh 디렉터리와 `/zh/blog/my-first-post/`입니다. 공개 전에 미완성 파일이나 공개할 생각이 없는 뼈대는 콘텐츠 디렉터리 밖으로 옮기세요. 자동으로 숨겨지는 초안이 아닙니다.

특정 언어만 만들고 싶다면 `npm run new-post -- my-first-post --locales zh`를 사용할 수 있고 여러 언어는 `--locales en,zh`로 지정합니다. 선택적인 사용법이므로 모든 예시를 반복 실행할 필요는 없습니다. `--locales` 자체는 언어를 활성화하지 않습니다.

글 필드, 표지, 코드와 수식의 자세한 작성법은 [글 쓰기와 콘텐츠 관리](/ko/blog/starter-guide-2-languages-and-routing/)를 참고하세요.

## 5. 로컬에서 결과 확인하기

개발 페이지로 돌아가 사이트 이름과 홈 소개가 바뀌었는지, 언어 메뉴가 예상대로인지, 내 글이 열리는지, 소셜 링크가 실제 계정으로 연결되는지 확인하세요. 다른 언어 디렉터리의 글은 해당 언어가 활성화되어 있을 때만 경로를 생성합니다.

빌드 결과를 확인하기 전에 `Ctrl+C`로 개발 서버를 멈추고 실행하세요.

```bash
npm run doctor
npm run preview
```

로컬 `doctor`는 없거나 오래된 반응형 이미지 파일을 준비하고 Astro 검사를 수행한 다음 사이트를 빌드합니다. About이 켜져 있으면 관련 런타임 설정도 검사합니다. 성공 직후 `check`나 `build`를 반복 실행할 필요는 없습니다. 어떤 단계든 실패하면 터미널 오류부터 해결하고 `doctor`를 다시 실행하세요. 실패한 뒤 남은 `dist/`를 배포에 사용하지 마세요.

`preview`는 `dist/`에 이미 빌드된 정적 사이트를 엽니다. 터미널에 나온 주소로 접속하면 되며 인터넷에 블로그를 게시하지는 않습니다. 글 검색은 빌드 뒤 미리보기에서 확인해야 하며 `dev`는 실시간 전문 검색을 제공하지 않습니다. `Ctrl+C`로 미리보기를 멈춥니다.

나중에 배포할 때 호스팅 플랫폼의 빌드 명령은 `npm run build`, 출력 디렉터리는 `dist`이며 안의 모든 파일을 배포해야 합니다. 로컬 이미지를 추가하거나 바꾸면 먼저 로컬에서 dev나 doctor를 실행하고 원본과 생성된 `src/assets/blog/covers/` 디렉터리 전체를 커밋하세요. 배포 빌드와 CI doctor는 이 반응형 파일을 검사만 하며 없거나 오래되면 실패합니다. 플랫폼에서 추가 생성하지 않습니다. 콘텐츠나 설정을 수정하면 다시 빌드하고 배포해야 합니다.

## 기존 프로젝트 업그레이드

새로 설치한 블로그는 이 절을 실행하지 않아도 됩니다. 기존 프로젝트는 먼저 내 변경 사항을 Git에 커밋하는 등의 방법으로 저장한 다음 개발 서버와 미리보기를 멈추고 기존 프로젝트 루트에서 실행하세요.

```bash
npx @anglefeint/astro-theme@latest upgrade --check
```

`--check`는 대상 버전을 조회하고 프로젝트, Node.js, Astro 호환성을 검사합니다. 프로젝트 파일을 수정하지 않으며 설치나 빌드도 실행하지 않습니다. 통과를 확인한 다음 실제 업그레이드를 실행하세요.

```bash
npx @anglefeint/astro-theme@latest upgrade
```

자동 업그레이드는 npm을 사용하며 `package-lock.json`이 있는 통합형 starter에 적용됩니다. 프로젝트 `package.json`에는 `anglefeint.projectSchema: 1`이 있어야 하며 표준 페이지는 테마 패키지가 제공합니다. pnpm, yarn, bun 잠금 파일을 발견하면 중단합니다. 검사를 우회하려고 자신의 잠금 파일을 지우지 마세요. npm 이외 프로젝트는 기존 패키지 관리자로 대상 버전의 호환성을 확인한 다음 의존성을 업데이트하고 프로젝트 doctor를 실행해야 합니다. 자동 업그레이드는 이 경로의 롤백을 제공하지 않습니다.

업그레이드는 테마 의존성을 업데이트하고 doctor를 실행하며 글, 설정, 음악, 이미지, 사용자 페이지를 다시 쓰지 않습니다. `package.json`, `package-lock.json`을 `.anglefeint/backups/`에 백업하지만 전체 사이트 백업은 아닙니다. 설치나 doctor가 실패하면 두 의존성 파일을 복구하고 원래 의존성 재설치를 시도합니다. 복구 설치도 실패하면 터미널 오류에 따라 의존성을 고친 뒤 `npm run doctor`를 성공적으로 실행하세요. 이전 빌드 산출물은 함께 복구하지 않으므로 실패 후 `dist/`를 배포하지 마세요.

Node.js, Astro, starter schema가 호환되지 않으면 멈추며 Astro를 자동 마이그레이션하지 않습니다. `--to`로 호환되는 명시적인 테마 버전을 지정할 수 있지만 자동 다운그레이드는 지원하지 않습니다. 변경 내용은 [GitHub Releases](https://github.com/anglefeint/astro-theme-anglefeint/releases)를 참고하세요. 업그레이드 성공 후에는 `npm run preview`로 이미 빌드된 결과를 확인하고 기존 배포 흐름을 따르면 됩니다. 업그레이드를 위해 바로 한 번 더 빌드할 필요는 없습니다.

0.27 이전의 복사형 구형 골격은 제자리 자동 업그레이드를 지원하지 않습니다. 다른 디렉터리에 이 글의 방법으로 새 starter를 설치하고 기존 프로젝트를 유지한 채 글과 자원을 새 프로젝트로 옮기세요. 개인 설정값은 새 `src/site.config.ts`에 합치세요. 이전 표준 라우트, adapter, defaults/schema/runtime 보조 파일은 복사하지 마세요. 글 slug, 언어 경로, 음악과 이미지 URL, 도메인과 호스팅 설정을 확인한 뒤 로컬 검사와 배포를 마치세요.

## 가이드 탐색과 설정 조회

[다음 글: 첫 글 쓰기](/ko/blog/starter-guide-2-languages-and-routing/) · [여덟 편의 가이드 시작 페이지](/ko/blog/starter-guide-1-configure-your-site/#tutorial-order).

관련 필드: [사이트, 소셜, 푸터](/ko/blog/config-site-chrome/), [홈 제목과 소개](/ko/blog/config-home/), [언어 설정](/ko/blog/config-languages/). 전체 경로, 기본값, 제한 사항은 [설정 사전 시작 페이지](/ko/blog/config-reference/)를 참고하세요.
