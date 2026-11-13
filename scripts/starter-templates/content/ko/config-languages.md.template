---
tags: ['anglefeint', 'config']
title: '설정 사전: 언어 활성화, 주소, UI 번역과 대체값'
subtitle: '언어 등록, 기본 언어, 페이지 주소와 콘텐츠별 대체 규칙입니다.'
description: '실제 코드로 i18n 필드의 타입, 기본값, 활성화 규칙, 홈 접두사, UI 번역, 대체 연결, 콘텐츠·SEO 범위를 설명합니다.'
pubDate: '2026-11-13'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/hacker-01.webp'
---

언어 활성화·번역 게시 절차는 [다국어 가이드](/ko/blog/starter-guide-languages/), 설정 위치는 [설치와 사이트 정보](/ko/blog/starter-guide-1-configure-your-site/)를 참고하세요. 다른 모듈은 [설정 사전 시작 페이지](/ko/blog/config-reference/)에 있습니다.

i18n 등록·주소·해석 규칙을 다룹니다. 홈, 글, Fragments, About, Decoder, 음악, 댓글 등의 전체 문구는 각 사전에서 보세요. 기본값은 demo 덮어쓰기가 아닌 패키지 기준입니다.

<a id="registry"></a>

## i18n.defaultLocale와 i18n.locales

| 전체 경로             | 타입 / 테마 기본값                                                  | 상태·역할·제한                                                                                                                                                                         | 예시                                                       |
| --------------------- | ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| i18n.defaultLocale    | string / 'en'                                                       | 적용: 루트 홈의 표시·이동 언어, 필수 대체값, 기본 언어 링크를 정합니다. 빈 문자열은 정규화 시 en이며 브라우저로 자동 결정하지 않습니다. 항상 활성이라 enabled: false로 끌 수 없습니다. | i18n: { defaultLocale: 'zh' }                              |
| i18n.locales          | Record<string, LocaleConfig> / 아래 내장 아홉 언어                  | 적용: 키는 디렉터리·주소 코드입니다. 재귀 병합하므로 내장 언어 생략은 삭제가 아닙니다. 새 언어의 자동 번역 팩은 없으며 문구·내용을 준비해야 합니다.                                    | i18n: { locales: { fr: { meta: { label: 'Français' } } } } |
| `i18n.locales.<语言>` | LocaleConfig, 부분 덮어쓰기 / 내장 언어는 기존 설정, 새 코드는 없음 | 적용: meta, site, messages, about, aiReadableContent입니다. 생략 필드는 병합·대체 규칙을 사용하며 빈 객체로 언어를 지울 수 없습니다.                                                   | locales: { zh: { meta: { enabled: false } } }              |

언어 키는 메뉴 이름·hreflang과 다릅니다. EN을 en, zh-CN 디렉터리를 zh로 자동 변경하지 않습니다. 디렉터리·설정·명령에 zh, en, pt-br, zh-hant 같은 소문자 코드를 통일하세요. 콘텐츠 CLI는 두세 글자와 선택적 하이픈 구간 하나를 받습니다. 런타임 정규화는 완전한 코드·경로 검증기가 아니므로 경로나 임의 문장부호를 쓰지 마세요.

기본 언어가 미등록이면 코드를 label로 하는 설정을 추가합니다. 콘텐츠·번역 준비를 대신하지 않습니다. defaultLocale 변경은 기존 파일을 옮기지 않습니다.

### 내장 언어의 실제 기본값

덮어쓰기 전 유효 메타데이터입니다. 아홉 언어가 활성이고 기본 en의 대체는 비어 있으며 나머지는 en입니다. 객체 등록 순서를 유지하고 meta.label로 정렬하지 않습니다. 별도 언어 메뉴 순서 필드는 없습니다.

| 코드      | meta.label         | meta.hreflang | meta.ogLocale | 유효 enabled | 유효 fallback |
| --------- | ------------------ | ------------- | ------------- | ------------ | ------------- |
| `en`      | English            | `en`          | `en_US`       | true         | `[]`          |
| `ja`      | 日本語             | `ja`          | `ja_JP`       | true         | `["en"]`      |
| `ko`      | 한국어             | `ko`          | `ko_KR`       | true         | `["en"]`      |
| `es`      | Español            | `es`          | `es_ES`       | true         | `["en"]`      |
| `zh`      | 简体中文           | `zh-CN`       | `zh_CN`       | true         | `["en"]`      |
| `pt-br`   | Português (Brasil) | `pt-BR`       | `pt_BR`       | true         | `["en"]`      |
| `de`      | Deutsch            | `de`          | `de_DE`       | true         | `["en"]`      |
| `ru`      | Русский            | `ru`          | `ru_RU`       | true         | `["en"]`      |
| `zh-hant` | 繁體中文           | `zh-Hant`     | `zh_TW`       | true         | `["en"]`      |

<a id="meta"></a>

## `i18n.locales.<语言>.meta`: 다섯 메타데이터 필드

상대 필드는 meta 안에 있습니다. 내장 기본값은 위 표, 새 언어에서 생략한 정규화 규칙은 아래 표입니다. 부분 덮어쓰기를 지원하므로 매번 모든 필드를 다시 쓸 필요는 없습니다.

| 상대 경로     | 타입 / 새 언어에서 생략 시                                    | 상태·역할·제한                                                                                                                                  | 예시 값      |
| ------------- | ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| meta.label    | string / 언어 코드                                            | 적용: 메뉴 이름입니다. 빈 문자열도 코드로 대체하며 공백만 있어도 trim하지 않습니다. 디렉터리·주소는 바꾸지 않습니다.                            | 'Français'   |
| meta.hreflang | string, 생략 가능 / 언어 코드                                 | 적용: 표준 html lang, hreflang, 일부 구조화 데이터입니다. 경로 키는 안 바꿉니다. 빈 문자열은 코드로 대체하고 형식 검증은 없습니다.              | 'fr'         |
| meta.ogLocale | string, 생략 가능 / 미설정                                    | 조건부: Open Graph·alternate 메타 정보입니다. 없거나 비면 태그를 생략하고 지역을 자동 추론하지 않습니다. 내장값도 빈 문자열로 지울 수 있습니다. | 'fr_FR'      |
| meta.enabled  | boolean, 생략 가능 / true                                     | 적용: 비기본 언어는 false만 끄고 기본 언어는 항상 켭니다. 표준 페이지·메뉴를 제어하며 파일·사용자 페이지를 삭제하거나 권한을 제어하지 않습니다. | false        |
| meta.fallback | string[], 생략 가능 / 비기본은 기본 언어 추가, 기본은 빈 배열 | 적용: 직접 대체 연결입니다. 전체 배열을 대체하며 자기 자신·중복·빈값·미등록을 거릅니다. 비기본에는 최종적으로 기본 언어를 추가합니다.           | ['zh', 'en'] |

hreflang과 ogLocale로 언어 키를 대체하지 마세요. 사용자 언어의 지역 관례를 자동 보장하지 않으므로 실제 콘텐츠에 맞는 메타값을 쓰세요.

<a id="routing"></a>

## i18n.routing.defaultLocalePrefix: 기본 홈 주소

- **타입 / 기본값:** 'always' | 'never' / 'always'.
- **상태와 역할:** 적용하지만 현재 기본 언어 홈의 표준 입구만 바꿉니다. 모든 페이지의 접두사를 없애지 않습니다. 빈 문자열은 공개 타입이 아니며 런타임은 always로 보지만 잘못된 값에 의존하지 마세요.
- **제한:** /blog/, /about/ 등 무접두사 페이지를 만들지 않습니다. 재빌드·재배포해야 하며 이전 링크·호스팅 리다이렉트는 자동 이전하지 않습니다.
- **예시:** i18n: { routing: { defaultLocalePrefix: 'never' } }.

기본 언어 en일 때:

| 주소              | always                      | never                       |
| ----------------- | --------------------------- | --------------------------- |
| /                 | /en/으로 정적 HTML 이동     | 영어 홈 표시                |
| /en/              | 영어 홈 표시                | /로 정적 HTML 이동          |
| /en/blog/         | 영어 목록                   | 영어 목록                   |
| /en/blog/my-post/ | 영어 글                     | 영어 글                     |
| /en/about/        | 기능 활성 시 영어 About     | 기능 활성 시 영어 About     |
| /zh/              | 언어 활성 시 중국어 간체 홈 | 언어 활성 시 중국어 간체 홈 |

루트·언어 홈 사이에는 canonical·noindex가 있는 meta refresh 정적 페이지를 씁니다. 방문자 위치 선택이나 서버 301 설정은 아닙니다. 내부 경로 도구는 보통 `/<코드>/.../`를 만들며 루트 홈 처리는 각 입구가 담당합니다.

<a id="overrides"></a>

## site, messages, about: 덮어쓰기 위치

전체 접두사는 `i18n.locales.<语言>`입니다. 객체는 재귀 병합, 배열은 전체 대체, undefined는 덮어쓰지 않습니다. 빈 문자열·false·빈 배열은 유지하며 필드가 뜻을 정합니다.

| 상대 경로      | 타입 / 기본값                                                                | 역할·제한·예시                                                                                                                     | 필드 설명                                          |
| -------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| site           | { homeTitle?: string; hero?: string } / 언어별 내장 홈 설정                  | 홈 언어 내용만 담고 최상위 정체성을 대체하지 않습니다. 예: site: { homeTitle: '我的博客' }                                         | [홈 사전](/ko/blog/config-home/#site-fallbacks)    |
| site.homeTitle | string, 생략 가능 / 미설정                                                   | 직접 대체 언어 순서로 trim 후 비어 있지 않은 제목을 찾고 마지막은 SITE_TITLE입니다. 예시 '我的博客'. 빈 문자열도 계속 대체합니다.  | [홈 대제목](/ko/blog/config-home/#home-title)      |
| site.hero      | string, 생략 가능 / 내장 언어 소개, 새 언어는 없음                           | 첫 정의된 값을 찾으며 빈 문자열은 멈춥니다. 없으면 messages.home.hero도 있습니다. 예시 '记录项目与生活。'.                         | [홈 소개](/ko/blog/config-home/#home-hero)         |
| messages       | DeepPartial<Messages> / 설정 덮어쓰기는 보통 미설정, 런타임에 내장 문구 추가 | 버튼·상태·메타 설명입니다. 예: messages: { nav: { home: '主页' } }. 문구만 바꾸며 기능·번역을 만들지 않습니다.                     | [사전 시작](/ko/blog/config-reference/)            |
| about          | DeepPartial<AboutConfig> / 내장 언어 About                                   | 기본 About부터 대체 연결로 재귀 병합합니다. 예: about: { sections: { who: '我是一名开发者。' } }. Markdown 본문에서 읽지 않습니다. | [About 사전](/ko/blog/config-about/#about-content) |

언어별 실제 hero 기본값입니다. 기본 설정에는 homeTitle이 없습니다. 아래 각 언어 문자열은 코드의 원값입니다.

| 언어      | site.hero 기본값                                                                           |
| --------- | ------------------------------------------------------------------------------------------ |
| `en`      | Write a short introduction for your site and what readers can expect from your posts.      |
| `ja`      | このサイトの紹介文と、読者がどんな記事を期待できるかを書いてください。                     |
| `ko`      | 사이트 소개와 방문자가 어떤 글을 기대할 수 있는지 간단히 작성하세요.                       |
| `es`      | Escribe una breve presentación del sitio y qué tipo de contenido encontrarán tus lectores. |
| `zh`      | 在这里写一段站点简介，并告诉读者你将发布什么类型的内容。                                   |
| `pt-br`   | Apresente seu site e conte o que os leitores encontrarão nos seus artigos.                 |
| `de`      | Stelle deine Website kurz vor und beschreibe, was Leser in deinen Beiträgen erwartet.      |
| `ru`      | Кратко представьте свой сайт и расскажите, какие статьи здесь найдут читатели.             |
| `zh-hant` | 簡短介紹你的網站，並告訴讀者這裡會有哪些內容。                                             |

<a id="fallback"></a>

## 대체 연결의 정확한 순서

fr의 유효 meta.fallback이 ['zh', 'en']이면 fr → zh → en으로 직접 찾거나 역순 병합합니다. zh 자체 fallback을 더 펼치지 않으므로 ja를 쓰려면 fr 배열에 직접 넣으세요.

1. fallback을 생략하거나 []여도 비기본에는 기본 언어가 추가됩니다. 기본 언어는 비어 있어도 되고 다른 등록 언어를 지정할 수도 있습니다.
2. 자기 자신·중복·미등록을 걸러냅니다. 활성 여부가 아닌 등록 여부이므로 꺼진 언어도 대체에 참여합니다.
3. 비기본에 기본 언어가 없으면 끝에 추가합니다. 이미 있으면 원래 위치를 유지하며 끝으로 옮기지 않습니다.
4. 일반 messages는 내장 영어부터 시작해 유효 연결 역순으로 각 언어의 내장 팩, 개인 덮어쓰기를 차례로 병합합니다. 현재 언어 내장 번역이 대체 언어의 개인 문구를 덮어쓸 수도 있습니다.

en nav.home을 'Start'로 바꿔도 zh의 내장 “首页”가 자동 변경되지 않습니다. 중국어 간체는 zh.messages.nav.home을 직접 덮어쓰세요. 새 언어는 대체 언어 UI를 받을 수 있지만 완전한 해당 언어 번역이 자동 생성되지는 않습니다.

콘텐츠마다 같은 알고리즘을 쓰지 않습니다.

| 콘텐츠                     | 현재 동작                                                                                                      |
| -------------------------- | -------------------------------------------------------------------------------------------------------------- |
| 일반 messages              | 내장 영어 → 대체 언어 팩·덮어쓰기 → 현재 언어 팩·덮어쓰기                                                      |
| site.homeTitle             | 직접 연결에서 비어 있지 않은 trim 값, 마지막 사이트 제목                                                       |
| site.hero                  | 직접 연결의 정의된 값이며 빈 문자열에서 멈춤                                                                   |
| about                      | DEFAULT_ABOUT_CONFIG부터 직접 연결 역순 병합                                                                   |
| messages.home.transmission | 예외: 현재 언어 개인값 → 영어 개인값 → 내장 영어 문구입니다. 전체 일반 연결이 아니며 현재 기본은 Knock, knock. |
| aiReadableContent          | 해당 언어 필드로 최상위 보충을 덮어쓰며 meta.fallback은 안 씁니다. 다음 절 참조                                |
| 글·Fragment 본문           | UI 대체를 쓰지 않고 해당 언어 자체 콘텐츠만 읽습니다.                                                          |

영어 글을 중국어 목록에 넣거나 번역 파일을 만들거나 다른 언어를 검색해 홈 개수를 채우거나 다른 slug를 번역으로 간주하지 않습니다.

<a id="common-messages"></a>

## 언어 선택기와 공통 문구

`i18n.locales.<语言>.messages`의 선택적 string이며 일반 문구 연결을 따릅니다. siteTitle은 현재 표준 사이트 정체성을 바꾸지 않습니다. 타입·기본값·미사용 상태는 [사이트 사전](/ko/blog/config-site-chrome/#legacy-site-title)에 있습니다.

| 상대 필드       | 중국어 간체 / 영어 기본값                                                                        | 상태·역할·제한                                                                                    | 예시 값                |
| --------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- | ---------------------- |
| langLabel       | 语言 / Language                                                                                  | 적용: 선택기 안내·접근성 문구입니다. 선택 이름은 meta.label입니다.                                | '选择语言'             |
| siteDescription | 电影感网页界面与 AI 时代工程实践文章。 / Cinematic web interfaces and AI-era engineering essays. | 조건부: 홈 메타 설명이며 가시 소개·전체 공통 설명은 아닙니다. 다른 페이지는 자체 출처가 있습니다. | '我的项目与学习笔记。' |

기능 문구는 해당 사전을 보세요. 타입에 있어도 소비 위치가 없으면 적용되지 않습니다. 댓글 iframe은 theme.comments.lang도 따르며 기본 영어입니다. [댓글 사전](/ko/blog/config-comments/#appearance)을 참고하세요.

<a id="ai-context"></a>

## aiReadableContent: 언어별 공개 보충의 특별 대체 규칙

`i18n.locales.<语言>.aiReadableContent`는 notes / links별로 최상위만 덮어쓰며 meta.fallback을 쓰지 않습니다. 생략은 전역 상속, 빈 notes·links는 비우기이고 {}는 전역을 지우지 않습니다.

타입·기본값·검증·예시는 [AI 읽기 보충 사전](/ko/blog/config-analytics-ai/#locale-supplement)에 있습니다. 페이지 번역·About 본문이 아니며 모두 공개입니다. 링크는 공개 루트 기준이고 단일 / 시작은 base를 건너뜁니다. [링크 해석](/ko/blog/config-analytics-ai/#supplement)을 참고하세요.

<a id="examples"></a>

## 병합 가능한 설정 예시

src/site.config.ts의 기존 defineThemeConfig({...})에 합치고 개인 설정을 보존하며 i18n을 중복 생성하지 마세요. 두 언어만 적어도 내장 아홉 언어와 재귀 병합하므로 나머지가 자동 꺼지지 않습니다.

### 중국어 간체 페이지만 유지하기

```ts
i18n: {
  defaultLocale: 'zh',
  routing: { defaultLocalePrefix: 'always' },
  locales: {
    zh: { meta: { enabled: true, label: '中文' } },
    en: { meta: { enabled: false } },
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

기본 zh는 끌 수 없습니다. 영어 페이지를 꺼도 등록된 설정은 대체에 참여합니다. 루트 홈을 원하면 always를 never로 바꾸세요. 글은 계속 /zh/blog/.../에 있습니다.

### 프랑스어와 UI 문구 추가하기

```ts
i18n: {
  locales: {
    fr: {
      meta: {
        label: 'Français',
        hreflang: 'fr',
        ogLocale: 'fr_FR',
        enabled: true,
        fallback: ['zh', 'en'],
      },
      site: {
        homeTitle: 'Mon blog',
        hero: 'Mes projets et mes notes.',
      },
      messages: {
        langLabel: 'Langue',
        nav: { home: 'Accueil', blog: 'Articles', about: 'À propos' },
      },
    },
  },
},
```

몇 문구만 추가하는 예시이며 전체 프랑스어 팩은 아닙니다. src/content/blog/fr/에 글, src/content/fragments/fr/에 Fragment를 게시해야 합니다. CLI는 활성 언어의 임시 파일을 만들 뿐 자동 번역하지 않습니다.

<a id="content-and-seo"></a>

## 주소·콘텐츠 전환·SEO 범위

- 공용 메뉴는 활성 언어만 나열하고 기본적으로 현재 하위 경로를 유지합니다. 특정 라우트는 자체 목적지를 제공할 수 있으며 임의 페이지의 번역이 존재함을 보장하는 검색기는 아닙니다.
- 표준 글은 언어를 뺀 전체 slug로 찾고 있으면 번역, 없으면 대상 Blog List로 갑니다. SEO는 실제 같은 slug만 선언하고 목록을 번역 글로 간주하지 않습니다. 기본 언어도 없으면 x-default 글 주소를 만들지 않습니다.
- Fragments 전환은 대상 첫 목록이며 현재 ID로 번역을 찾지 않습니다. ID 토론 공유는 별도입니다. 비활성화가 원본·GitHub 토론을 삭제하지 않습니다.
- meta.label은 메뉴만 바꾸고 언어 키는 주소·디렉터리를 바꿉니다. 자동 이전·Accept-Language·브라우저·국가 자동 선택은 없습니다.
- 메시지는 텍스트 설정이며 임의 HTML·Markdown의 통합 렌더러가 아닙니다. 줄바꿈·배열·형식 지원은 해당 사전을 보세요. 배열 대체가 메뉴·기능 추가는 아닙니다.
- 독립 languageOrder, autoDetect, 누락 자동 번역, 전체 무접두사 라우트, 언어별 공용 목록 필드는 없습니다. 사용자 페이지 localeHrefs / seoLocaleHrefs는 컴포넌트 인수이며 site.config가 아닙니다.

저장 후 개발 설정을 다시 읽고 정식 사이트는 재빌드·재배포하세요. 언어 끄기는 이전 호스팅 파일 정리나 비공개 보호가 아닙니다. [설정 사전 시작 페이지](/ko/blog/config-reference/)에서 계속 조회하세요.
