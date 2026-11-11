export type FragmentMessages = {
  title: string;
  description: string;
  empty: string;
  comments: string;
  close: string;
  previous: string;
  next: string;
  loading: string;
  error: string;
  retry: string;
};
export const FRAGMENT_LABELS: Record<string, FragmentMessages> = {
  en: {
    title: 'Fragments',
    description: 'Brief thoughts, kept along the way.',
    empty: 'No fragments yet.',
    comments: 'Comments',
    close: 'Close',
    previous: 'Previous',
    next: 'Next',
    loading: 'Loading comments…',
    error: 'Unable to load comments. Check your network or comment settings, then retry.',
    retry: 'Retry',
  },
  zh: {
    title: '碎片',
    description: '沿途记录的几句话。',
    empty: '还没有碎片。',
    comments: '评论',
    close: '关闭',
    previous: '上一页',
    next: '下一页',
    loading: '正在加载评论…',
    error: '评论未能加载，请检查网络或评论配置后重试。',
    retry: '重试',
  },
  'zh-hant': {
    title: '碎片',
    description: '沿途記錄的幾句話。',
    empty: '還沒有碎片。',
    comments: '留言',
    close: '關閉',
    previous: '上一頁',
    next: '下一頁',
    loading: '正在載入留言…',
    error: '留言未能載入，請檢查網路或留言設定後重試。',
    retry: '重試',
  },
  ja: {
    title: '断片',
    description: '日々の短い思いを残す場所。',
    empty: 'まだ断片はありません。',
    comments: 'コメント',
    close: '閉じる',
    previous: '前へ',
    next: '次へ',
    loading: 'コメントを読み込み中…',
    error: 'コメントを読み込めません。ネットワークやコメント設定を確認して再試行してください。',
    retry: '再試行',
  },
  ko: {
    title: '조각',
    description: '일상의 짧은 생각을 기록합니다.',
    empty: '아직 조각이 없습니다.',
    comments: '댓글',
    close: '닫기',
    previous: '이전',
    next: '다음',
    loading: '댓글 로딩 중…',
    error: '댓글을 불러오지 못했습니다. 네트워크나 댓글 설정을 확인하고 다시 시도하세요.',
    retry: '다시 시도',
  },
  es: {
    title: 'Fragmentos',
    description: 'Pensamientos breves del camino.',
    empty: 'Todavía no hay fragmentos.',
    comments: 'Comentarios',
    close: 'Cerrar',
    previous: 'Anterior',
    next: 'Siguiente',
    loading: 'Cargando comentarios…',
    error: 'No se pudieron cargar los comentarios. Revisa la red o la configuración y reintenta.',
    retry: 'Reintentar',
  },
  'pt-br': {
    title: 'Fragmentos',
    description: 'Breves pensamentos pelo caminho.',
    empty: 'Ainda não há fragmentos.',
    comments: 'Comentários',
    close: 'Fechar',
    previous: 'Anterior',
    next: 'Próxima',
    loading: 'Carregando comentários…',
    error:
      'Não foi possível carregar os comentários. Verifique a rede ou a configuração e tente novamente.',
    retry: 'Tentar novamente',
  },
  de: {
    title: 'Fragmente',
    description: 'Kurze Gedanken am Wegesrand.',
    empty: 'Noch keine Fragmente.',
    comments: 'Kommentare',
    close: 'Schließen',
    previous: 'Zurück',
    next: 'Weiter',
    loading: 'Kommentare werden geladen…',
    error:
      'Kommentare konnten nicht geladen werden. Netzwerk oder Einstellungen prüfen und erneut versuchen.',
    retry: 'Erneut versuchen',
  },
  ru: {
    title: 'Фрагменты',
    description: 'Короткие мысли по пути.',
    empty: 'Фрагментов пока нет.',
    comments: 'Комментарии',
    close: 'Закрыть',
    previous: 'Назад',
    next: 'Далее',
    loading: 'Загрузка комментариев…',
    error: 'Не удалось загрузить комментарии. Проверьте сеть или настройки и повторите попытку.',
    retry: 'Повторить',
  },
};
