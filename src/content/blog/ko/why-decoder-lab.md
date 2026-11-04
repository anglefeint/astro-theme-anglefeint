---
title: 'Decoder Lab을 만든 이유'
subtitle: '사이퍼펑크에 대한 경의를 실용적인 도구로'
description: '인류의 자유와 프라이버시에 대한 기여를 기리고 로컬 도구와 수정 가능한 자료 링크를 제공.'
pubDate: '2026-11-04'
heroImage: '../../../assets/blog/default-covers/hacker-02.webp'
tags: ['Cypherpunk', 'Decoder Lab', 'Anglefeint']
---

Decoder Lab을 만든 첫 번째 이유는 사이퍼펑크(Cypherpunk)와 디지털 자유의 선구자들이 인류에 남긴 기여를 기리기 위해서입니다. 그들의 사상과 코드는 암호 통신, 개인의 프라이버시와 자유, 디지털 화폐를 발전시키며 정보를 보호하고 자유롭게 소통하고 자율적으로 협력할 도구를 넓혔습니다.

그 경의를 실제로 쓸 수 있는 기능으로도 표현하고자 텍스트 디코딩, 지원되는 토큰 호출 분석과 주소 형식 검사를 블로그에 넣었으며, 지갑 연결이나 API 키, RPC 없이 브라우저에서 로컬로 처리해 테마의 터미널·네트워크 이미지와 연결했습니다.

[Decoder Lab](/ko/decoder/) 하단의 자료 URL은 모두 수정할 수 있으며 `src/site.config.ts`의 `i18n.locales.<code>.messages.decoderPage.readings.links`에서 항목별 title과 href를 설정해 전체 목록을 자신의 추천으로 바꾸거나 빈 배열로 숨길 수 있습니다.
