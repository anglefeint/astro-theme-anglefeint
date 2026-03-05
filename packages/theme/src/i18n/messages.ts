import type { Locale } from './config';

export type Messages = {
  siteTitle: string;
  siteDescription: string;
  langLabel: string;
  nav: {
    home: string;
    blog: string;
    about: string;
    status: string;
  };
  home: {
    hero: string;
    latest: string;
    viewAll: string;
    noPosts: string;
  };
  about: {
    title: string;
    description: string;
    who: string;
    what: string;
    ethos: string;
    now: string;
    contact: string;
    regenerate: string;
  };
  blog: {
    title: string;
    pageTitle: string;
    archiveDescription: string;
    pageDescription: string;
    previous: string;
    next: string;
    jumpTo: string;
    jumpGo: string;
    jumpInputLabel: string;
    backToBlog: string;
    backToTop: string;
    related: string;
    comments: string;
    responseOutput: string;
    heroMonitor: string;
    heroSignalSync: string;
    heroModelOnline: string;
    regenerate: string;
    toastP10: string;
    toastP30: string;
    toastP60: string;
    toastDone: string;
  };
};

export const DEFAULT_MESSAGES: Record<Locale, Messages> = {
  en: {
    siteTitle: 'Angle Feint',
    siteDescription: 'Cinematic web interfaces and AI-era engineering essays.',
    langLabel: 'Language',
    nav: { home: 'Home', blog: 'Blog', about: 'About', status: 'system: online' },
    home: {
      hero: 'Write a short introduction for your site and what readers can expect from your posts.',
      latest: 'Latest Posts',
      viewAll: 'View all posts',
      noPosts: 'No posts available in this language yet.',
    },
    about: {
      title: 'About — Hacker Ethos',
      description: 'Who I am, what I build, and the hacker ethos behind my work.',
      who: 'Who I Am',
      what: 'What I Build',
      ethos: 'Hacker Ethos',
      now: 'Now',
      contact: 'Contact',
      regenerate: 'Regenerate',
    },
    blog: {
      title: 'Blog',
      pageTitle: 'Blog - Page',
      archiveDescription: 'Essays on AI-era craft, web engineering, and system architecture.',
      pageDescription: 'Blog archive page',
      previous: 'Previous',
      next: 'Next',
      jumpTo: 'Jump to page',
      jumpGo: 'Go',
      jumpInputLabel: 'Page number',
      backToBlog: 'Back to blog',
      backToTop: 'Back to top',
      related: 'Related',
      comments: 'Comments',
      responseOutput: 'Output',
      heroMonitor: 'neural monitor',
      heroSignalSync: 'signal sync active',
      heroModelOnline: 'model online',
      regenerate: 'Regenerate',
      toastP10: 'context parsed 10%',
      toastP30: 'context parsed 30%',
      toastP60: 'inference stable 60%',
      toastDone: 'output finalized',
    },
  },
  ja: {
    siteTitle: 'Angle Feint',
    siteDescription: '映画的なWebインターフェースとAI時代のエンジニアリング考察。',
    langLabel: '言語',
    nav: { home: 'ホーム', blog: 'ブログ', about: 'プロフィール', status: 'system: online' },
    home: {
      hero: 'このサイトの紹介文と、読者がどんな記事を期待できるかを書いてください。',
      latest: '最新記事',
      viewAll: 'すべての記事を見る',
      noPosts: 'この言語の記事はまだありません。',
    },
    about: {
      title: 'About — Hacker Ethos',
      description: '私について、作るもの、そしてハッカー精神。',
      who: '私について',
      what: '作るもの',
      ethos: 'ハッカー精神',
      now: '現在',
      contact: '連絡先',
      regenerate: '再生成',
    },
    blog: {
      title: 'ブログ',
      pageTitle: 'ブログ - ページ',
      archiveDescription: 'AI時代のクラフト、Web開発、システム設計に関する記事。',
      pageDescription: 'ブログ一覧ページ',
      previous: '前へ',
      next: '次へ',
      jumpTo: 'ページ移動',
      jumpGo: '移動',
      jumpInputLabel: 'ページ番号',
      backToBlog: 'ブログへ戻る',
      backToTop: '先頭へ戻る',
      related: '関連記事',
      comments: 'コメント',
      responseOutput: '出力',
      heroMonitor: 'ニューラルモニター',
      heroSignalSync: 'シグナル同期中',
      heroModelOnline: 'モデルオンライン',
      regenerate: '再生成',
      toastP10: '文脈解析 10%',
      toastP30: '文脈解析 30%',
      toastP60: '推論安定 60%',
      toastDone: '出力確定',
    },
  },
  ko: {
    siteTitle: 'Angle Feint',
    siteDescription: '시네마틱 웹 인터페이스와 AI 시대 엔지니어링 에세이.',
    langLabel: '언어',
    nav: { home: '홈', blog: '블로그', about: '소개', status: 'system: online' },
    home: {
      hero: '사이트 소개와 방문자가 어떤 글을 기대할 수 있는지 간단히 작성하세요.',
      latest: '최신 글',
      viewAll: '모든 글 보기',
      noPosts: '이 언어에는 아직 게시물이 없습니다.',
    },
    about: {
      title: 'About — Hacker Ethos',
      description: '나와 내가 만드는 것, 그리고 해커 정신.',
      who: '나는 누구인가',
      what: '무엇을 만드는가',
      ethos: '해커 정신',
      now: '지금',
      contact: '연락처',
      regenerate: '재생성',
    },
    blog: {
      title: '블로그',
      pageTitle: '블로그 - 페이지',
      archiveDescription: 'AI 시대의 개발 감각, 웹 엔지니어링, 시스템 아키텍처 에세이.',
      pageDescription: '블로그 아카이브 페이지',
      previous: '이전',
      next: '다음',
      jumpTo: '페이지 이동',
      jumpGo: '이동',
      jumpInputLabel: '페이지 번호',
      backToBlog: '블로그로 돌아가기',
      backToTop: '맨 위로',
      related: '관련 글',
      comments: '댓글',
      responseOutput: '출력',
      heroMonitor: '뉴럴 모니터',
      heroSignalSync: '신호 동기화 활성',
      heroModelOnline: '모델 온라인',
      regenerate: '재생성',
      toastP10: '컨텍스트 파싱 10%',
      toastP30: '컨텍스트 파싱 30%',
      toastP60: '추론 안정화 60%',
      toastDone: '출력 완료',
    },
  },
  es: {
    siteTitle: 'Angle Feint',
    siteDescription: 'Interfaces web cinematográficas y ensayos de ingeniería en la era de IA.',
    langLabel: 'Idioma',
    nav: { home: 'Inicio', blog: 'Blog', about: 'Sobre mí', status: 'system: online' },
    home: {
      hero: 'Escribe una breve presentación del sitio y qué tipo de contenido encontrarán tus lectores.',
      latest: 'Últimas publicaciones',
      viewAll: 'Ver todas las publicaciones',
      noPosts: 'Aún no hay publicaciones en este idioma.',
    },
    about: {
      title: 'About — Hacker Ethos',
      description: 'Quién soy, qué construyo y el ethos hacker detrás de mi trabajo.',
      who: 'Quién soy',
      what: 'Qué construyo',
      ethos: 'Ethos hacker',
      now: 'Ahora',
      contact: 'Contacto',
      regenerate: 'Regenerar',
    },
    blog: {
      title: 'Blog',
      pageTitle: 'Blog - Página',
      archiveDescription:
        'Ensayos sobre oficio en la era de IA, ingeniería web y arquitectura de sistemas.',
      pageDescription: 'Página del archivo del blog',
      previous: 'Anterior',
      next: 'Siguiente',
      jumpTo: 'Ir a página',
      jumpGo: 'Ir',
      jumpInputLabel: 'Número de página',
      backToBlog: 'Volver al blog',
      backToTop: 'Volver arriba',
      related: 'Relacionados',
      comments: 'Comentarios',
      responseOutput: 'Salida',
      heroMonitor: 'monitor neural',
      heroSignalSync: 'sincronización de señal activa',
      heroModelOnline: 'modelo en línea',
      regenerate: 'Regenerar',
      toastP10: 'contexto analizado 10%',
      toastP30: 'contexto analizado 30%',
      toastP60: 'inferencia estable 60%',
      toastDone: 'salida finalizada',
    },
  },
  zh: {
    siteTitle: 'Angle Feint',
    siteDescription: '电影感网页界面与 AI 时代工程实践文章。',
    langLabel: '语言',
    nav: { home: '首页', blog: '博客', about: '关于', status: 'system: online' },
    home: {
      hero: '在这里写一段站点简介，并告诉读者你将发布什么类型的内容。',
      latest: '最新文章',
      viewAll: '查看全部文章',
      noPosts: '该语言暂时没有文章。',
    },
    about: {
      title: 'About — Hacker Ethos',
      description: '我是谁、我在做什么，以及背后的黑客精神。',
      who: '我是谁',
      what: '我在构建什么',
      ethos: '黑客精神',
      now: '现在',
      contact: '联系',
      regenerate: '重新生成',
    },
    blog: {
      title: '博客',
      pageTitle: '博客 - 第',
      archiveDescription: '关于 AI 时代开发、Web 工程与系统架构的文章。',
      pageDescription: '博客归档页',
      previous: '上一页',
      next: '下一页',
      jumpTo: '跳转到页',
      jumpGo: '跳转',
      jumpInputLabel: '页码',
      backToBlog: '返回博客',
      backToTop: '返回顶部',
      related: '相关文章',
      comments: '评论',
      responseOutput: '输出',
      heroMonitor: '神经监视器',
      heroSignalSync: '信号同步中',
      heroModelOnline: '模型在线',
      regenerate: '重新生成',
      toastP10: '语境解析 10%',
      toastP30: '语境解析 30%',
      toastP60: '推理稳定 60%',
      toastDone: '输出完成',
    },
  },
};

export function getMessages(locale: Locale): Messages {
  return DEFAULT_MESSAGES[locale];
}
