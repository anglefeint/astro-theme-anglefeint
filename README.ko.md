# Anglefeint

개인 퍼블리싱을 위한 시네마틱 멀티 무드 Astro 테마입니다.

## 언어

- [English](README.md)
- [简体中文](README.zh-CN.md)
- [日本語](README.ja.md)
- [Español](README.es.md)
- 한국어 (현재 문서)

## 라이브 데모

- https://demo.anglefeint.com/

## 기술 스택

- Astro 5
- TypeScript
- Markdown + MDX 콘텐츠 컬렉션
- 정적 사이트 생성(SSG)
- Cloudflare Workers / Pages 배포 가능

## 요구 사항

- Node.js 18+ (LTS 권장)
- 패키지 매니저: npm / pnpm / yarn / bun

## 라우트별 분위기

- 홈 (`/`): Matrix 스타일 터미널 랜딩
- 블로그 목록 (`/:lang/blog`): 사이버펑크 아카이브 무드
- 글 상세 (`/:lang/blog/[slug]`): AI 인터페이스형 읽기 레이아웃
- About (`/:lang/about`): 선택형 해커 스타일 프로필

## 주요 기능

- Astro 5 정적 출력
- Markdown + MDX 지원
- 기본 로케일: `en`, `ja`, `ko`, `es`, `zh`
- 로케일별 RSS 피드
- sitemap + robots 지원
- 설정 중심 구조(사이트, 테마, About, 소셜 링크)
- 짧은 페이지에서도 하단 고정 Footer

## 빠른 시작

```bash
npm install
npm run dev
```

빌드 및 미리보기:

```bash
npm run build
npm run preview
```

`pnpm` 사용 예시:

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
```

## 테마 설정

1. `.env.example` 를 `.env` 로 복사하고 사이트 정보를 설정합니다.
2. `src/config/social.ts` 에서 소셜 링크를 수정합니다.
3. `src/config/about.ts` 에서 About 콘텐츠를 수정합니다.
4. `src/config/theme.ts` 의 `ENABLE_ABOUT_PAGE` 로 About 노출을 제어합니다.
5. `src/content/blog/<locale>/` 의 샘플 글을 교체합니다.

## 라이선스

MIT License. `LICENSE` 를 참고하세요.
