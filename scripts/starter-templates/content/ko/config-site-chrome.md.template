---
tags: ['anglefeint', 'config']
title: '설정 사전: 사이트 이름, 도메인, 공용 내비게이션, 소셜, 푸터'
subtitle: '사이트 정체성, 환경 덮어쓰기, 고정 내비게이션과 공용 링크입니다.'
description: '실제 코드로 site, social, footer, 내비게이션 문구의 타입, 기본값, 제한, 환경 덮어쓰기, 호환·미적용 설정을 조회합니다.'
pubDate: '2026-11-13'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/matrix-01.webp'
---

처음 내 정보를 바꾼다면 [설치와 사이트 정보](/ko/blog/starter-guide-1-configure-your-site/), 도메인 배포는 [배포 가이드](/ko/blog/starter-guide-deployment/)를 읽으세요. 다른 모듈은 [설정 사전 시작 페이지](/ko/blog/config-reference/)에 있습니다.

설정은 src/site.config.ts이며 기본값은 demo 개인 정보가 아닌 테마 패키지 기준입니다. 기존 defineThemeConfig({...})의 import, export, 다른 모듈을 유지하며 합치세요.

<a id="identity"></a>

## site: 사이트 정체성 여섯 필드

site는 객체이며 부분 설정에서는 모든 필드를 생략할 수 있습니다. 아래는 모두 조건부 적용으로 실제 페이지에서 읽을 때 사용하며 환경·페이지의 구체적 인수가 우선할 수 있습니다.

| 전체 경로          | 타입              | 테마 기본값                                                                             | 역할·제한·예시                                                                                                                                                                                     |
| ------------------ | ----------------- | --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `site.title`       | string            | `"My Blog"`                                                                             | 헤더 브랜드, 푸터 저작권, RSS, 구조화 데이터, 일부 페이지·자동 공유 이미지의 사이트 이름입니다. 홈 대제목과는 다르며 통합 빈 문자열 대체는 없습니다. 예시 `"내 블로그"`.                           |
| `site.description` | string            | `"Cinematic web interfaces, AI-era engineering notes, and system architecture essays."` | 전역 설명·기계 읽기 인덱스 출처 중 하나입니다. 홈은 messages.siteDescription이 우선이며 About·목록은 자체 설명이 있어 모든 페이지를 바꾸지 않습니다. 예시 `"프로젝트, 독서와 일상을 기록합니다."`. |
| `site.url`         | string            | `"https://example.com"`                                                                 | Astro site, canonical, RSS, sitemap, 공개 내보내기의 HTTP(S) 절대 주소입니다. 글 URL은 안 됩니다. 도메인 구매·DNS·인증서·게시를 수행하지 않습니다. 예시 `"https://blog.example.com"`.              |
| `site.author`      | string            | `"Your Name"`                                                                           | 기본 작성자·구조화 데이터입니다. 글 author가 덮어쓸 수 있습니다. 저작권은 site.title이며 About·메일도 자동 변경되지 않습니다. 예시 `"민수"`.                                                       |
| `site.tagline`     | string            | `""`                                                                                    | 푸터 추가 문구이며 trim 후 비면 숨깁니다. 옛 기본 Built with Astro.도 크레딧 중복 방지로 숨깁니다. 예시 `"호기심을 품고 꾸준히 만듭니다."`.                                                        |
| `site.ogImage`     | string，생략 가능 | `""`                                                                                    | 페이지·글 우선 이미지가 없을 때 전역 공유 이미지입니다. 공백은 내장 이미지를 쓰며 로컬 public·HTTPS를 지원합니다. 홈 아바타·글 표지 일괄 교체는 아닙니다. 예시 `"/images/share.webp"`.             |

site.title은 전역 이름, `i18n.locales.<locale>.site.homeTitle`은 해당 언어 홈 대제목입니다. 후자는 비어 있지 않은 언어 대체값을 찾고 최종적으로 사이트 이름을 씁니다. [홈 제목](/ko/blog/config-home/#home-title)을 참고하세요. messages.siteTitle은 현재 표준 정체성·대제목에 사용하지 않습니다.

site.description도 보이는 홈 소개가 아닙니다. 소개는 `i18n.locales.<locale>.site.hero`, 메타 설명에는 messages.siteDescription도 있습니다. [홈 사전](/ko/blog/config-home/#site-fallbacks)을 참고하세요. 정체성을 바꿔도 이미 쓴 About을 자동 변경하지 않습니다.

### 공유 이미지 우선순위와 경로

site.ogImage는 공용 head에 페이지 이미지가 없을 때만 씁니다. 글 ogImage·자동 생성·표지가 우선할 수 있습니다. [글 사전](/ko/blog/config-article/#frontmatter)을 참고하세요. 자동 공유 이미지가 켜져 있으면 모든 글을 site.ogImage로 바꿀 수 없습니다.

/images/share.webp는 public/images/share.webp이며 파일을 먼저 준비하세요. 없음·publicDir 밖·잘못된 경로는 대체 이미지 해석 시 오류입니다. 로컬에는 base·콘텐츠 버전 매개변수를 추가하며 HTTPS는 원격 주소를 유지하고 다운로드 검증하지 않습니다. 빈 값·공백은 내장 이미지이며 공유 메타 삭제가 아닙니다.

site.ogImage에는 문자열을 쓰고 Astro image import 객체를 바로 넣지 마세요. 글 frontmatter.ogImage와 타입이 다릅니다. PUBLIC_SITE_OG_IMAGE 덮어쓰기는 없고 heroImage도 바꾸지 않습니다.

<a id="environment"></a>

## 환경 덮어쓰기와 도메인 우선순위

site.config 필드가 아닌 현재 읽는 환경변수입니다. 모두 string이며 없으면 site 필드를 씁니다. null 병합을 쓰므로 빈 문자열은 미설정이 아닙니다.

| 환경변수                | 우선 덮어쓰기    | 예시                                         |
| ----------------------- | ---------------- | -------------------------------------------- |
| PUBLIC_SITE_TITLE       | site.title       | PUBLIC_SITE_TITLE=내 블로그                  |
| PUBLIC_SITE_DESCRIPTION | site.description | PUBLIC_SITE_DESCRIPTION=프로젝트와 학습 노트 |
| PUBLIC_SITE_AUTHOR      | site.author      | PUBLIC_SITE_AUTHOR=민수                      |
| PUBLIC_SITE_TAGLINE     | site.tagline     | PUBLIC_SITE_TAGLINE=호기심을 잃지 않기       |
| PUBLIC_SITE_URL         | site.url         | PUBLIC_SITE_URL=https://blog.example.com     |

통합은 dev/build·--mode에 맞는 Vite dotenv 모드로 PUBLIC_SITE_URL을 읽어 Astro site와 공개 주소를 맞춥니다. 기존 프로세스 환경이 dotenv보다 우선합니다. 호스팅의 PUBLIC_SITE_URL을 잊고 site.url만 바꾸지 마세요. 빈 문자열은 문구를 지우거나 URL을 무효화하며 기본값 복구가 아닙니다.

페이지 SITE_URL에는 import.meta.env.SITE 중간 대체가 남아 있습니다: PUBLIC_SITE_URL → SITE → site.url. 표준 통합은 환경·설정 URL로 Astro site를 정하고 head는 Astro.site를 우선합니다. SITE는 호환 대체이며 또 다른 독립 도메인 설정으로 권장하지 않습니다.

도메인과 공개 하위 경로는 다릅니다. Astro base, 호스팅 출력, DNS/HTTPS는 배포 가이드를 따라야 합니다. site.url에 디렉터리를 넣어도 모든 라우트가 옮겨지지 않습니다. dev 재시작·온라인 재빌드·재배포가 필요하며 서버 리다이렉트는 설정하지 않습니다.

<a id="navigation"></a>

## 공용 내비게이션: 고정 입구와 스위치

공개 nav 배열, 메뉴 순서, 사용자 메뉴 항목은 없습니다. 표준 헤더는 다음처럼 구성합니다.

| 위치                 | 현재 출처·제한                                                                                             |
| -------------------- | ---------------------------------------------------------------------------------------------------------- |
| 브랜드               | site.title·환경값이며 현재 언어 홈으로 갑니다.                                                             |
| 홈·Blog              | 항상 유지하며 messages.nav.home / blog로 문구만 바꿉니다.                                                  |
| About                | theme.enableAboutPage, boolean, 기본 true입니다. theme: { enableAboutPage: false }는 페이지·입구를 끕니다. |
| Frontier의 Decoder   | theme.enableDecoderPage, boolean, 기본 true이며 헤더 문구는 Decoder Lab 고정입니다.                        |
| Frontier의 Fragments | theme.fragments.enabled, boolean, 기본 false이며 messages.fragments.title입니다.                           |
| Frontier의 Contact   | About 활성 시 messages.about.contact를 쓰며 현재 /about/#contact로 갑니다. Decoder와 독립입니다.           |
| 검색                 | theme.search.enabled, boolean, 기본 true입니다. [검색 사전](/ko/blog/config-search/#enabled) 참조          |
| 언어·상태            | 활성 언어, meta.label, 아래 정적 상태입니다. 언어 옵션은 임의 링크 목록이 아닙니다.                        |

Frontier 제목·이름은 고정이며 하위 항목이 모두 없으면 렌더링하지 않습니다. messages.decoderPage.fullTool은 전체 도구·푸터에 적용하지만 헤더 Decoder Lab은 바꾸지 않습니다.

[언어 사전](/ko/blog/config-languages/#content-and-seo)과 각 모듈을 참고하세요. 빈 라벨로 내비게이션을 끄면 주소나 불명확한 버튼이 남습니다.

<a id="chrome-messages"></a>

### 헤더·푸터 문구 일곱 개

전체 접두사는 `i18n.locales.<locale>.messages`이며 선택적 string입니다. 내장 언어·대체값을 쓰고 표에는 중국어 간체 / 영어 기본값과 한국어 예시를 나열합니다. 해당 영역에서 조건부 적용하며 일반 텍스트이고 Markdown·임의 HTML은 해석하지 않습니다.

| 상대 필드          | 중국어 간체 / 영어 기본값       | 역할·제한                                                        | 한국어 예시 값    |
| ------------------ | ------------------------------- | ---------------------------------------------------------------- | ----------------- |
| `nav.home`         | 首页 / Home                     | 홈 메뉴 문구이며 라우트는 안 바꿉니다.                           | `"홈"`            |
| `nav.blog`         | 博客 / Blog                     | Blog 입구 문구이며 라우트는 안 바꿉니다.                         | `"글"`            |
| `nav.about`        | 关于 / About                    | About 메뉴와 본문 창 다시 열기 입구에도 씁니다.                  | `"내 소개"`       |
| `nav.status`       | system: online / system: online | 정적 헤더 상태이며 네트워크·API·서비스 건강을 검사하지 않습니다. | `"시스템 온라인"` |
| `nav.statusAria`   | 系统状态 / System status        | 상태 영역 접근 가능한 이름이며 서비스 검사 스위치가 아닙니다.    | `"사이트 상태"`   |
| `footer.theme`     | 主题： / Theme by               | 테마 크레딧 접두사이며 Anglefeint 링크 문구·목적지는 고정입니다. | `"테마 제작"`     |
| `footer.builtWith` | 构建工具： / Built with         | Astro 크레딧 접두사이며 링크 문구·목적지는 고정입니다.           | `"사용 기술"`     |

messages.langLabel은 언어 컨트롤, meta.label은 옵션 이름입니다. [언어 문구](/ko/blog/config-languages/#common-messages)를 참고하세요. Contact·Fragments는 각 모듈 문구이며 messages.nav에 임의 필드를 만들지 마세요.

<a id="social"></a>

## social.links: 헤더·푸터 공유 소셜 링크

- **타입 / 기본값:** SocialLink[] / []. 다섯 항목 필드는 아래와 같습니다.
- **상태와 역할:** 적용되며 헤더·푸터가 배열순으로 공유합니다. 전체 대체이며 개수 상한·언어별 입구는 없습니다.
- **제한:** []도 전체 영역을 숨기지 않습니다. Mastodon·Twitter·GitHub의 클릭 불가 아이콘을 표시하고 dev는 설정 안내도 표시합니다. 기존 항목의 빈 href는 이 자리표시자가 아니라 계속 링크로 출력합니다.
- **예시 값:** [{ label: 'GitHub', href: 'https://github.com/yourname', icon: 'github' }].

About 연락처와 독립입니다. theme.social.enabled·hidePlaceholders 스위치는 없으며 showPlaceholdersWhenEmpty는 레이아웃 인수입니다.

<a id="social-fields"></a>

### SocialLink의 다섯 필드

접두사는 social.links[]이며 필수는 자동 보완이 없습니다. 부분 타입이 허용해도 유효한 전체 항목을 쓰세요.

| 필드    | 타입 / 기본값                                             | 상태·역할·제한                                                                                                                                                            | 예시 값                       |
| ------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| href    | string, 필수 / 없음                                       | 적용: 실제 주소입니다. 프로토콜·도달성·비어 있지 않음을 통합 검증하거나 BASE_URL을 붙이지 않습니다. 전체 HTTPS·올바른 내부 경로를 쓰고 인증된 계정이라고 취급하지 마세요. | 'https://github.com/yourname' |
| label   | string, 필수 / 없음                                       | 적용: 접근 가능한 이름이며 아이콘이 없으면 가시 텍스트입니다. 플랫폼·페이지 제목을 자동 취득하지 않으므로 명확한 비영 이름을 쓰세요.                                      | 'GitHub'                      |
| rel     | string, 생략 가능 / 미설정, 최종 최소 noopener noreferrer | 적용: 공백 구분 관계이며 소문자·중복 제거·opener 제거·새 창 보호를 유지합니다. 빈 문자열도 보호 해제가 아니며 비문자열은 오류입니다.                                      | 'me nofollow'                 |
| icon    | 내장 SocialIcon, 생략 가능 / 미설정                       | 조건부: 아래 열두 이름 중 하나이며 iconSrc가 없을 때 사용합니다. 미지원 비영 이름은 오류이고 URL로 자동 추론하지 않습니다. 둘 다 없으면 label입니다.                      | 'github'                      |
| iconSrc | string, 생략 가능 / 미설정                                | 조건부: publicDir의 로컬 SVG/PNG/WebP이며 유효 비영 경로는 icon보다 우선합니다. 공백은 미설정, 비문자열·규칙 위반은 오류입니다.                                           | '/icons/community.svg'        |

실제 링크는 모두 새 탭이며 rel은 보호와 합칩니다. 라벨은 HTML을 해석하지 않습니다. 내장 이름은 정확히 대소문자를 구분합니다.

```text
mastodon
twitter
github
youtube
bluesky
linkedin
discord
telegram
instagram
facebook
whatsapp
line
```

### 사용자 아이콘 파일 제한

public/icons/community.svg는 iconSrc: '/icons/community.svg'입니다. 실제 publicDir 파일이며 패키지·src/assets가 아닙니다. 단일 /로 시작하고 URL, 프로토콜 상대 주소, 쿼리·조각·퍼센트 인코딩, . / .. 구간은 안 됩니다. 역슬래시·콜론·제어 문자도 거부합니다.

빌드에서 존재·파일 여부·실제 경로의 publicDir 내부 여부를 검사하며 심볼릭 링크로 밖으로 나가도 거부합니다. 일반 공백·중국어 파일명은 컴포넌트가 인코딩하므로 미리 퍼센트 인코딩하지 마세요. 아이콘에 base를 붙이지만 href는 원값 처리입니다. JPG·GIF는 미지원입니다.

유효 iconSrc가 있으면 icon은 선택에 참여하지 않습니다. 크기·간격은 레이아웃 인수이며 SocialLink 필드가 아닙니다.

<a id="footer"></a>

## theme.footer: 링크와 크레딧

| 전체 경로                  | 타입 / 기본값                          | 상태·역할·제한                                                                                                                                        | 예시 값                                                       |
| -------------------------- | -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| theme.footer.showCredits   | boolean / true                         | 적용: 테마·Astro 링크 크레딧입니다. 저작권·소셜·짧은 문구·기타 링크는 남깁니다. 자동 공유 이미지 크레딧에도 참여하나 사용자 이미지는 바꾸지 않습니다. | false                                                         |
| theme.footer.links         | { label: string; href: string }[] / [] | 적용: 배열순 사용자 링크이며 전체 대체, 헤더에는 영향 없습니다. 레이아웃이 Decoder를 추가할 수 있어 []도 링크 없음 보장은 아닙니다.                   | [{ label: '프로젝트', href: 'https://example.com/project/' }] |
| theme.footer.links[].label | string, 필수 / 없음                    | 조건부: 일반 텍스트 가시 이름이며 목표 제목을 자동 취득하지 않습니다.                                                                                 | '프로젝트'                                                    |
| theme.footer.links[].href  | string, 필수 / 없음                    | 조건부: 원값 주소입니다. 아이콘 같은 경로 검증·base 자동 추가는 없으므로 올바르게 쓰세요. 기본은 현재 탭입니다.                                       | 'https://example.com/project/'                                |

사용자 링크 뒤 레이아웃 추가 링크가 나오며 중복 제거는 없습니다. Decoder 활성 시 전체 도구 링크를 messages.decoderPage.fullTool로 추가합니다. 불필요하면 기능 스위치로 끄세요. footer.links를 비워 제거할 수 없습니다.

저작권은 빌드 연도와 유효 SITE_TITLE 고정이며 copyright/year 설정은 없습니다. site.tagline은 독립이고 trim 후 Built with Astro.는 옛 기본 호환으로 숨깁니다. showCredits: false는 다른 문구·이미지 크레딧을 자동 제거하지 않습니다.

<a id="examples"></a>

## 병합 가능한 사이트·공용 링크 예시

현재 개인 정보를 유지하며 필요한 필드만 합치세요.

```ts
site: {
  title: '민수의 블로그',
  description: '프로젝트, 독서와 일상을 기록합니다.',
  url: 'https://blog.example.com',
  author: '민수',
  tagline: '호기심을 품고 꾸준히 만듭니다.',
},
social: {
  links: [
    { label: 'GitHub', href: 'https://github.com/yourname', icon: 'github' },
    { label: '프로젝트 홈페이지', href: 'https://example.com/project/' },
  ],
},
theme: {
  footer: {
    showCredits: true,
    links: [{ label: '프로젝트', href: 'https://example.com/project/' }],
  },
},
```

계정·도메인·링크를 내 것으로 바꾸세요. 테마는 온라인 검증하지 않습니다. 아이콘·전역 공유 이미지는 먼저 public 파일을 넣고 iconSrc·site.ogImage를 쓰세요.

한국어 내비게이션·크레딧 접두사만 바꾸는 예시입니다.

```ts
i18n: {
  locales: {
    ko: {
      messages: {
        nav: { home: '홈', blog: '글', about: '내 소개' },
        footer: { theme: '테마 제작', builtWith: '사용 기술' },
      },
    },
  },
},
```

<a id="legacy-site-title"></a>

## 현재 미사용: messages.siteTitle

전체는 `i18n.locales.<locale>.messages.siteTitle`, 선택적 string이며 중국어 간체·영어 내장 기본 모두 'Angle Feint'입니다. 현재 표준 홈 대제목·공용 사이트 정체성은 읽지 않으므로 “현재 미사용”입니다. siteTitle: '내 블로그'도 이름을 바꾸지 않습니다.

홈은 `i18n.locales.<locale>.site.homeTitle`, 브랜드는 최상위 site.title입니다. [홈 제목](/ko/blog/config-home/#home-title)과 [사이트 정체성](#identity)을 참고하세요. 이름 변경을 위해 이 보존 필드를 채울 필요는 없습니다.

<a id="boundaries"></a>

## 호환·미적용 범위

- site 여섯 필드, 소셜·푸터, 문구 일곱 개 모두 소비 위치가 있습니다. 이미지 우선순위·환경·입구 스위치에 따라 실제 적용이 다릅니다.
- site.tagline의 Built with Astro.는 옛 기본 호환 특수값입니다. 모든 문구를 끈다는 뜻은 아닙니다.
- messages.siteTitle은 위의 미사용 상태이며 타입 허용이 읽기 사용은 아닙니다.
- homeHref, localeHrefs, extraLinks, showPlaceholdersWhenEmpty, iconSize는 컴포넌트 인수입니다. 공개 nav 배열, 소셜 자리표시자 스위치, 저작권 템플릿, 상태 검사 설정은 없습니다.

설정 저장·파일 준비 뒤 재빌드·재배포하고 환경 변경은 해당 모드를 다시 읽으세요. 도메인·링크 접근·원격 계정·온라인 효과는 내 배포에서 확인해야 하며 로컬 타입 검사만으로 성공을 판단하지 마세요. [설정 사전 시작 페이지](/ko/blog/config-reference/)에서 다른 모듈을 보세요.
