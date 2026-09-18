import { DEFAULT_LOCALE, type Locale } from './config';

export type Messages = {
  music: {
    mute: string;
    unmute: string;
    label: string;
    play: string;
    pause: string;
    prev: string;
    next: string;
    open: string;
    close: string;
    progress: string;
    volume: string;
    queue: string;
    idle: string;
    loading: string;
    playing: string;
    paused: string;
    error: string;
    noScript: string;
  };
  imagePreview: { open: string; close: string };
  codeCopy: { copy: string; copied: string; failed: string };
  search: {
    label: string;
    close: string;
    placeholder: string;
    hint: string;
    loading: string;
    empty: string;
    error: string;
    retry: string;
    more: string;
    results: string;
    dev: string;
  };
  siteTitle: string;
  siteDescription: string;
  langLabel: string;
  nav: {
    home: string;
    blog: string;
    about: string;
    status: string;
    statusAria: string;
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
    tags: string;
    allPosts: string;
    noTags: string;
    taggedPosts: string;
    toc: string;
    responseOutput: string;
    rqBadge: string;
    rqReplayAria: string;
    metaPublished: string;
    metaUpdated: string;
    metaReadMinutes: string;
    systemStatusAria: string;
    systemModelLabel: string;
    systemModeLabel: string;
    systemStateLabel: string;
    promptContextLabel: string;
    latencyLabel: string;
    confidenceLabel: string;
    statsWords: string;
    statsTokens: string;
    heroMonitor: string;
    heroSignalSync: string;
    heroModelOnline: string;
    regenerate: string;
    relatedAria: string;
    backToBlogAria: string;
    paginationAria: string;
    toastP10: string;
    toastP30: string;
    toastP60: string;
    toastDone: string;
  };
};

export const DEFAULT_MESSAGES: Record<string, Messages> = {
  en: {
    music: {
      mute: 'Mute',
      unmute: 'Unmute',
      label: 'Music player',
      play: 'Play',
      pause: 'Pause',
      prev: 'Previous',
      next: 'Next',
      open: 'Open player',
      close: 'Collapse player',
      progress: 'Progress',
      volume: 'Volume',
      queue: 'Playlist',
      idle: 'Ready',
      loading: 'Loading',
      playing: 'Playing',
      paused: 'Paused',
      error: 'Unable to play. Try again or select another track.',
      noScript: 'Enable JavaScript to use the player.',
    },
    imagePreview: { open: 'View image', close: 'Close image preview' },
    codeCopy: {
      copy: 'Copy code',
      copied: 'Copied',
      failed: 'Copy failed. Select the code manually.',
    },
    search: {
      label: 'Search',
      close: 'Close search',
      placeholder: 'Search articles…',
      hint: 'Search articles in the current language.',
      loading: 'Searching…',
      empty: 'No matching articles.',
      error: 'Search could not load. Please try again.',
      retry: 'Retry',
      more: 'Load more',
      results: '{count} articles found',
      dev: 'To test full search locally, run npm run build, then npm run preview.',
    },
    siteTitle: 'Angle Feint',
    siteDescription: 'Cinematic web interfaces and AI-era engineering essays.',
    langLabel: 'Language',
    nav: {
      home: 'Home',
      blog: 'Blog',
      about: 'About',
      status: 'system: online',
      statusAria: 'System status',
    },
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
      regenerate: 'Replay scan',
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
      tags: 'Tags',
      allPosts: 'All posts',
      noTags: 'No tags yet.',
      taggedPosts: 'Posts',
      toc: 'On this page',
      responseOutput: 'Output',
      rqBadge: 'monitor feed',
      rqReplayAria: 'Replay monitor feed',
      metaPublished: 'published',
      metaUpdated: 'updated',
      metaReadMinutes: 'min read',
      systemStatusAria: 'Model status',
      systemModelLabel: 'model',
      systemModeLabel: 'mode',
      systemStateLabel: 'state',
      promptContextLabel: 'Context',
      latencyLabel: 'latency est',
      confidenceLabel: 'confidence',
      statsWords: 'words',
      statsTokens: 'tokens',
      heroMonitor: 'neural monitor',
      heroSignalSync: 'signal sync active',
      heroModelOnline: 'model online',
      regenerate: 'Replay scan',
      relatedAria: 'Related posts',
      backToBlogAria: 'Back to blog',
      paginationAria: 'Pagination',
      toastP10: 'context parsed 10%',
      toastP30: 'context parsed 30%',
      toastP60: 'inference stable 60%',
      toastDone: 'output finalized',
    },
  },
  ja: {
    music: {
      mute: 'ミュート',
      unmute: 'ミュート解除',
      label: '音楽プレーヤー',
      play: '再生',
      pause: '一時停止',
      prev: '前の曲',
      next: '次の曲',
      open: 'プレーヤーを開く',
      close: 'プレーヤーを折りたたむ',
      progress: '再生位置',
      volume: '音量',
      queue: 'プレイリスト',
      idle: '準備完了',
      loading: '読み込み中',
      playing: '再生中',
      paused: '一時停止中',
      error: '再生できません。再試行するか別の曲を選んでください。',
      noScript: 'プレーヤーを使うには JavaScript を有効にしてください。',
    },
    imagePreview: { open: '画像を拡大', close: '画像を閉じる' },
    codeCopy: {
      copy: 'コードをコピー',
      copied: 'コピーしました',
      failed: 'コピーできません。手動で選択してください。',
    },
    search: {
      label: '検索',
      close: '検索を閉じる',
      placeholder: '記事を検索…',
      hint: '現在の言語の記事を検索します。',
      loading: '検索中…',
      empty: '一致する記事がありません。',
      error: '検索を読み込めませんでした。再試行してください。',
      retry: '再試行',
      more: 'もっと見る',
      results: '{count} 件の記事',
      dev: 'ローカル検索は npm run build の後、npm run preview で確認できます。',
    },
    siteTitle: 'Angle Feint',
    siteDescription: '映画的なWebインターフェースとAI時代のエンジニアリング考察。',
    langLabel: '言語',
    nav: {
      home: 'ホーム',
      blog: 'ブログ',
      about: 'プロフィール',
      status: 'system: online',
      statusAria: 'システム状態',
    },
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
      regenerate: 'スキャン再生',
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
      tags: 'タグ',
      allPosts: 'すべての記事',
      noTags: 'タグはまだありません。',
      taggedPosts: '記事',
      toc: '目次',
      responseOutput: '出力',
      rqBadge: 'モニターフィード',
      rqReplayAria: 'モニターフィードを再生',
      metaPublished: '公開',
      metaUpdated: '更新',
      metaReadMinutes: '分で読了',
      systemStatusAria: 'モデル状態',
      systemModelLabel: 'モデル',
      systemModeLabel: 'モード',
      systemStateLabel: '状態',
      promptContextLabel: 'コンテキスト',
      latencyLabel: '推定レイテンシ',
      confidenceLabel: '信頼度',
      statsWords: '語',
      statsTokens: 'トークン',
      heroMonitor: 'ニューラルモニター',
      heroSignalSync: 'シグナル同期中',
      heroModelOnline: 'モデルオンライン',
      regenerate: 'スキャン再生',
      relatedAria: '関連記事',
      backToBlogAria: 'ブログへ戻る',
      paginationAria: 'ページネーション',
      toastP10: '文脈解析 10%',
      toastP30: '文脈解析 30%',
      toastP60: '推論安定 60%',
      toastDone: '出力確定',
    },
  },
  ko: {
    music: {
      mute: '음소거',
      unmute: '음소거 해제',
      label: '음악 플레이어',
      play: '재생',
      pause: '일시 정지',
      prev: '이전 곡',
      next: '다음 곡',
      open: '플레이어 열기',
      close: '플레이어 접기',
      progress: '재생 위치',
      volume: '음량',
      queue: '재생 목록',
      idle: '준비됨',
      loading: '불러오는 중',
      playing: '재생 중',
      paused: '일시 정지됨',
      error: '재생할 수 없습니다. 다시 시도하거나 다른 곡을 선택하세요.',
      noScript: '플레이어를 사용하려면 JavaScript를 활성화하세요.',
    },
    imagePreview: { open: '이미지 확대', close: '이미지 닫기' },
    codeCopy: {
      copy: '코드 복사',
      copied: '복사됨',
      failed: '복사하지 못했습니다. 코드를 직접 선택해 주세요.',
    },
    search: {
      label: '검색',
      close: '검색 닫기',
      placeholder: '글 검색…',
      hint: '현재 언어의 글을 검색합니다.',
      loading: '검색 중…',
      empty: '일치하는 글이 없습니다.',
      error: '검색을 불러오지 못했습니다. 다시 시도해 주세요.',
      retry: '다시 시도',
      more: '더 보기',
      results: '글 {count}개',
      dev: '로컬 검색은 npm run build 실행 후 npm run preview로 확인하세요.',
    },
    siteTitle: 'Angle Feint',
    siteDescription: '시네마틱 웹 인터페이스와 AI 시대 엔지니어링 에세이.',
    langLabel: '언어',
    nav: {
      home: '홈',
      blog: '블로그',
      about: '소개',
      status: 'system: online',
      statusAria: '시스템 상태',
    },
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
      regenerate: '스캔 재생',
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
      tags: '태그',
      allPosts: '전체 글',
      noTags: '아직 태그가 없습니다.',
      taggedPosts: '글',
      toc: '목차',
      responseOutput: '출력',
      rqBadge: '모니터 피드',
      rqReplayAria: '모니터 피드 다시 재생',
      metaPublished: '게시',
      metaUpdated: '수정',
      metaReadMinutes: '분 읽기',
      systemStatusAria: '모델 상태',
      systemModelLabel: '모델',
      systemModeLabel: '모드',
      systemStateLabel: '상태',
      promptContextLabel: '컨텍스트',
      latencyLabel: '지연 추정',
      confidenceLabel: '신뢰도',
      statsWords: '단어',
      statsTokens: '토큰',
      heroMonitor: '뉴럴 모니터',
      heroSignalSync: '신호 동기화 활성',
      heroModelOnline: '모델 온라인',
      regenerate: '스캔 재생',
      relatedAria: '관련 글',
      backToBlogAria: '블로그로 돌아가기',
      paginationAria: '페이지네이션',
      toastP10: '컨텍스트 파싱 10%',
      toastP30: '컨텍스트 파싱 30%',
      toastP60: '추론 안정화 60%',
      toastDone: '출력 완료',
    },
  },
  es: {
    music: {
      mute: 'Silenciar',
      unmute: 'Activar sonido',
      label: 'Reproductor de música',
      play: 'Reproducir',
      pause: 'Pausar',
      prev: 'Anterior',
      next: 'Siguiente',
      open: 'Abrir reproductor',
      close: 'Contraer reproductor',
      progress: 'Progreso',
      volume: 'Volumen',
      queue: 'Lista de reproducción',
      idle: 'Listo',
      loading: 'Cargando',
      playing: 'Reproduciendo',
      paused: 'En pausa',
      error: 'No se puede reproducir. Reintenta o selecciona otra pista.',
      noScript: 'Activa JavaScript para usar el reproductor.',
    },
    imagePreview: { open: 'Ampliar imagen', close: 'Cerrar imagen' },
    codeCopy: {
      copy: 'Copiar código',
      copied: 'Copiado',
      failed: 'No se pudo copiar. Selecciona el código manualmente.',
    },
    search: {
      label: 'Buscar',
      close: 'Cerrar búsqueda',
      placeholder: 'Buscar artículos…',
      hint: 'Busca artículos en el idioma actual.',
      loading: 'Buscando…',
      empty: 'No se encontraron artículos.',
      error: 'No se pudo cargar la búsqueda. Inténtalo de nuevo.',
      retry: 'Reintentar',
      more: 'Cargar más',
      results: '{count} artículos encontrados',
      dev: 'Para probar la búsqueda local, ejecuta npm run build y luego npm run preview.',
    },
    siteTitle: 'Angle Feint',
    siteDescription: 'Interfaces web cinematográficas y ensayos de ingeniería en la era de IA.',
    langLabel: 'Idioma',
    nav: {
      home: 'Inicio',
      blog: 'Blog',
      about: 'Sobre mí',
      status: 'system: online',
      statusAria: 'Estado del sistema',
    },
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
      regenerate: 'Repetir escaneo',
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
      tags: 'Etiquetas',
      allPosts: 'Todos los artículos',
      noTags: 'Todavía no hay etiquetas.',
      taggedPosts: 'Artículos',
      toc: 'En esta página',
      responseOutput: 'Salida',
      rqBadge: 'monitor de señal',
      rqReplayAria: 'Reproducir monitor de señal',
      metaPublished: 'publicado',
      metaUpdated: 'actualizado',
      metaReadMinutes: 'min de lectura',
      systemStatusAria: 'Estado del modelo',
      systemModelLabel: 'modelo',
      systemModeLabel: 'modo',
      systemStateLabel: 'estado',
      promptContextLabel: 'Contexto',
      latencyLabel: 'latencia est',
      confidenceLabel: 'confianza',
      statsWords: 'palabras',
      statsTokens: 'tokens',
      heroMonitor: 'monitor neural',
      heroSignalSync: 'sincronización de señal activa',
      heroModelOnline: 'modelo en línea',
      regenerate: 'Repetir escaneo',
      relatedAria: 'Publicaciones relacionadas',
      backToBlogAria: 'Volver al blog',
      paginationAria: 'Paginación',
      toastP10: 'contexto analizado 10%',
      toastP30: 'contexto analizado 30%',
      toastP60: 'inferencia estable 60%',
      toastDone: 'salida finalizada',
    },
  },
  zh: {
    music: {
      mute: '静音',
      unmute: '取消静音',
      label: '音乐播放器',
      play: '播放',
      pause: '暂停',
      prev: '上一首',
      next: '下一首',
      open: '展开播放器',
      close: '收起播放器',
      progress: '播放进度',
      volume: '音量',
      queue: '歌单',
      idle: '就绪',
      loading: '加载中',
      playing: '播放中',
      paused: '已暂停',
      error: '播放失败，请重试或切换歌曲。',
      noScript: '请启用 JavaScript 使用播放器。',
    },
    imagePreview: { open: '查看大图', close: '关闭图片预览' },
    codeCopy: { copy: '复制代码', copied: '已复制', failed: '复制失败，请手动选择代码。' },
    search: {
      label: '搜索',
      close: '关闭搜索',
      placeholder: '搜索文章…',
      hint: '搜索当前语言的文章。',
      loading: '正在搜索…',
      empty: '没有找到匹配的文章。',
      error: '搜索加载失败，请重试。',
      retry: '重试',
      more: '加载更多',
      results: '找到 {count} 篇文章',
      dev: '本地完整搜索请先运行 npm run build，再运行 npm run preview。',
    },
    siteTitle: 'Angle Feint',
    siteDescription: '电影感网页界面与 AI 时代工程实践文章。',
    langLabel: '语言',
    nav: {
      home: '首页',
      blog: '博客',
      about: '关于',
      status: 'system: online',
      statusAria: '系统状态',
    },
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
      regenerate: '重播扫描',
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
      tags: '标签',
      allPosts: '全部文章',
      noTags: '暂无标签',
      taggedPosts: '文章',
      toc: '文章目录',
      responseOutput: '输出',
      rqBadge: '监视器信号',
      rqReplayAria: '重放监视器信号',
      metaPublished: '发布',
      metaUpdated: '更新',
      metaReadMinutes: '分钟阅读',
      systemStatusAria: '模型状态',
      systemModelLabel: '模型',
      systemModeLabel: '模式',
      systemStateLabel: '状态',
      promptContextLabel: '语境',
      latencyLabel: '延迟估计',
      confidenceLabel: '置信度',
      statsWords: '词',
      statsTokens: '令牌',
      heroMonitor: '神经监视器',
      heroSignalSync: '信号同步中',
      heroModelOnline: '模型在线',
      regenerate: '重播扫描',
      relatedAria: '相关文章',
      backToBlogAria: '返回博客',
      paginationAria: '分页导航',
      toastP10: '语境解析 10%',
      toastP30: '语境解析 30%',
      toastP60: '推理稳定 60%',
      toastDone: '输出完成',
    },
  },
};

export function getMessages(locale: Locale): Messages {
  return DEFAULT_MESSAGES[locale] ?? DEFAULT_MESSAGES[DEFAULT_LOCALE];
}
