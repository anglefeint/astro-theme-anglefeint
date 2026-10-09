import { deepMerge, type DeepPartial } from '@anglefeint/astro-theme/utils/merge';
import type { ThemeConfig, AboutConfig } from './site.config.schema.ts';

export const DEFAULT_ABOUT_CONFIG: AboutConfig = {
  metaLine: '$ profile booted | mode: builder',
  sections: {
    who: 'Write a short introduction about yourself, your background, and your primary focus areas.',
    what: 'Describe what you build, your core skills, and the kinds of projects you want to be known for.',
    ethos: [
      'Prioritize clarity before complexity.',
      'Favor maintainable systems over one-off solutions.',
      'Ship in small iterations and learn from feedback.',
      'Communicate directly and document decisions.',
    ],
    now: 'Share what you are currently building, shipping, or learning.',
    contactLead:
      'Add a short collaboration note (for example: open to freelance, consulting, or full-time roles).',
    signature: '> Replace with your own signature.',
  },
  contact: {
    email: 'you@example.com',
    githubUrl: 'https://github.com/yourname',
    githubLabel: 'GitHub',
  },
  sidebar: {
    dlData: 'DL Data',
    ai: 'AI',
    decryptor: 'Decryptor',
    help: 'Help',
    allScripts: 'All Scripts',
  },
  scriptsPath: '/root/bash/scripts',
  labels: {
    modalOutput: 'Output',
    modalClose: 'Close',
    responseOutput: 'Output',
    contactEmailLead: 'Reach me via',
    contactConnectLead: 'or connect on',
    backToTop: 'Back to top',
    quickAccess: 'Quick access',
    contactEmailLabel: 'email',
  },
  modals: {
    dlData: {
      title: 'Downloading...',
      subtitle: 'Critical Data',
    },
    ai: {
      title: 'AI',
      lines: [
        '~ $ ai --status --verbose',
        '',
        'model: anglefeint-core',
        'mode: reasoning + builder',
        'context window: 128k',
        'tools: codex / cursor / claude-code',
        'latency: 120-220ms',
        'safety: guardrails enabled',
        '',
        '>> system online',
        '>> ready for execution',
      ],
    },
    decryptor: {
      title: 'Password Decryptor',
      header: 'Calculating Hashes',
      keysLabel: 'keys tested',
      currentPassphraseLabel: 'Current passphrase:',
      masterKeyLabel: 'Master key',
      transientKeyLabel: 'Transient key',
    },
    help: {
      title: 'Help',
      statsLabel: 'Stats & Achievements',
      typedPrefix: 'You typed:',
      typedSuffix: 'characters',
    },
    allScripts: {
      title: '/root/bash/scripts',
    },
  },
  effects: {
    backgroundLines: [
      '~ $ ls -la',
      'total 42',
      'drwxr-xr-x  12 user  staff   384  Jan 12  about  blog  projects',
      'drwxr-xr-x   8 user  staff   256  Jan 11  .config  .ssh  keys',
      '-rw-r--r--   1 user  staff  2048  Jan 10  README.md  .env.gpg',
      '-rwxr-xr-x   1 user  staff   512  Jan  9  deploy.sh  script',
      '~ $ cat .motd',
      '>> welcome | access granted',
    ],
    scrollToasts: {
      p30: 'context parsed',
      p60: 'inference stable',
      p90: 'output finalized',
    },
  },
};

const defaultThemeConfig: ThemeConfig = {
  analytics: { googleAnalyticsId: '' },
  site: {
    title: 'My Blog',
    description:
      'Cinematic web interfaces, AI-era engineering notes, and system architecture essays.',
    url: 'https://example.com',
    author: 'Your Name',
    tagline: '',
  },
  theme: {
    footer: { showCredits: true },
    music: { enabled: false, tracks: [] },
    blogPageSize: 9,
    homeLatestCount: 3,
    enableAboutPage: true,
    tags: { enabled: true },
    math: { enabled: true },
    toc: { enabled: true },
    search: { enabled: true },
    socialImage: { enabled: true },
    pagination: {
      windowSize: 7,
      showJumpThreshold: 12,
      jump: {
        enabled: true,
        enterToGo: true,
      },
      style: {
        enabled: true,
        mode: 'random',
        variants: 9,
        fixedVariant: 1,
      },
    },
    effects: {
      enableRedQueen: true,
    },
    comments: {
      enabled: false,
      repo: '',
      repoId: '',
      category: '',
      categoryId: '',
      mapping: 'pathname',
      term: '',
      number: '',
      strict: '0',
      reactionsEnabled: '1',
      emitMetadata: '0',
      inputPosition: 'bottom',
      theme: 'dark',
      lang: 'en',
      loading: 'lazy',
      crossorigin: 'anonymous',
    },
  },
  i18n: {
    defaultLocale: 'en',
    locales: {
      en: {
        meta: {
          label: 'English',
          hreflang: 'en',
          ogLocale: 'en_US',
        },
        site: {
          hero: 'Write a short introduction for your site and what readers can expect from your posts.',
        },
        about: DEFAULT_ABOUT_CONFIG,
      },
      ja: {
        meta: {
          label: '日本語',
          hreflang: 'ja',
          ogLocale: 'ja_JP',
          fallback: ['en'],
        },
        site: {
          hero: 'このサイトの紹介文と、読者がどんな記事を期待できるかを書いてください。',
        },
        about: DEFAULT_ABOUT_CONFIG,
      },
      ko: {
        meta: {
          label: '한국어',
          hreflang: 'ko',
          ogLocale: 'ko_KR',
          fallback: ['en'],
        },
        site: {
          hero: '사이트 소개와 방문자가 어떤 글을 기대할 수 있는지 간단히 작성하세요.',
        },
        about: DEFAULT_ABOUT_CONFIG,
      },
      es: {
        meta: {
          label: 'Español',
          hreflang: 'es',
          ogLocale: 'es_ES',
          fallback: ['en'],
        },
        site: {
          hero: 'Escribe una breve presentación del sitio y qué tipo de contenido encontrarán tus lectores.',
        },
        about: DEFAULT_ABOUT_CONFIG,
      },
      zh: {
        meta: {
          label: '简体中文',
          hreflang: 'zh-CN',
          ogLocale: 'zh_CN',
          fallback: ['en'],
        },
        site: {
          hero: '在这里写一段站点简介，并告诉读者你将发布什么类型的内容。',
        },
        about: DEFAULT_ABOUT_CONFIG,
      },
      'pt-br': {
        meta: {
          label: 'Português (Brasil)',
          hreflang: 'pt-BR',
          ogLocale: 'pt_BR',
          fallback: ['en'],
        },
        site: {
          hero: 'Apresente seu site e conte o que os leitores encontrarão nos seus artigos.',
        },
        about: {
          metaLine: '$ profile booted | mode: builder',
          sections: {
            who: 'Apresente-se, conte sua trajetória e suas principais áreas de interesse.',
            what: 'Descreva o que você cria, suas habilidades e os projetos pelos quais quer ser reconhecido.',
            ethos: [
              'Priorize a clareza antes da complexidade.',
              'Prefira sistemas fáceis de manter a soluções pontuais.',
              'Publique em pequenas etapas e aprenda com o retorno das pessoas.',
              'Comunique-se de forma direta e registre suas decisões.',
            ],
            now: 'Conte o que você está criando, publicando ou aprendendo agora.',
            contactLead: 'Escreva uma breve nota sobre oportunidades de colaboração.',
            signature: '> Substitua pela sua assinatura.',
          },
          contact: {
            email: 'you@example.com',
            githubUrl: 'https://github.com/yourname',
            githubLabel: 'GitHub',
          },
          sidebar: {
            dlData: 'Baixar dados',
            ai: 'IA',
            decryptor: 'Decodificador',
            help: 'Ajuda',
            allScripts: 'Todos os scripts',
          },
          scriptsPath: '/root/bash/scripts',
          labels: {
            modalOutput: 'Saída',
            modalClose: 'Fechar',
            responseOutput: 'Saída',
            contactEmailLead: 'Entre em contato por',
            contactConnectLead: 'ou encontre-me no',
            backToTop: 'Voltar ao topo',
            quickAccess: 'Acesso rápido',
            contactEmailLabel: 'e-mail',
          },
          modals: {
            dlData: {
              title: 'Baixando…',
              subtitle: 'Dados importantes',
            },
            ai: {
              title: 'AI',
              lines: [
                '~ $ ai --status --verbose',
                '',
                'model: anglefeint-core',
                'mode: reasoning + builder',
                'context window: 128k',
                'tools: codex / cursor / claude-code',
                'latency: 120-220ms',
                'safety: guardrails enabled',
                '',
                '>> system online',
                '>> ready for execution',
              ],
            },
            decryptor: {
              title: 'Decodificador de senhas',
              header: 'Calculando hashes',
              keysLabel: 'chaves testadas',
              currentPassphraseLabel: 'Frase-senha atual:',
              masterKeyLabel: 'Chave mestra',
              transientKeyLabel: 'Chave temporária',
            },
            help: {
              title: 'Ajuda',
              statsLabel: 'Estatísticas e conquistas',
              typedPrefix: 'Você digitou:',
              typedSuffix: 'caracteres',
            },
            allScripts: {
              title: '/root/bash/scripts',
            },
          },
          effects: {
            backgroundLines: [
              '~ $ ls -la',
              'total 42',
              'drwxr-xr-x  12 user  staff   384  Jan 12  about  blog  projects',
              'drwxr-xr-x   8 user  staff   256  Jan 11  .config  .ssh  keys',
              '-rw-r--r--   1 user  staff  2048  Jan 10  README.md  .env.gpg',
              '-rwxr-xr-x   1 user  staff   512  Jan  9  deploy.sh  script',
              '~ $ cat .motd',
              '>> welcome | access granted',
            ],
            scrollToasts: {
              p30: 'contexto analisado 30%',
              p60: 'inferência estável 60%',
              p90: 'saída concluída',
            },
          },
        },
      },
      de: {
        meta: {
          label: 'Deutsch',
          hreflang: 'de',
          ogLocale: 'de_DE',
          fallback: ['en'],
        },
        site: {
          hero: 'Stelle deine Website kurz vor und beschreibe, was Leser in deinen Beiträgen erwartet.',
        },
        about: {
          metaLine: '$ profile booted | mode: builder',
          sections: {
            who: 'Stelle dich, deinen Hintergrund und deine wichtigsten Interessengebiete kurz vor.',
            what: 'Beschreibe deine Projekte, deine Fähigkeiten und wofür du bekannt sein möchtest.',
            ethos: [
              'Klarheit geht vor Komplexität.',
              'Bevorzuge wartbare Systeme gegenüber Einzellösungen.',
              'Veröffentliche in kleinen Schritten und lerne aus Rückmeldungen.',
              'Kommuniziere direkt und dokumentiere Entscheidungen.',
            ],
            now: 'Erzähle, woran du gerade arbeitest oder was du lernst.',
            contactLead: 'Ergänze einen kurzen Hinweis zu möglichen Kooperationen.',
            signature: '> Hier steht deine eigene Signatur.',
          },
          contact: {
            email: 'you@example.com',
            githubUrl: 'https://github.com/yourname',
            githubLabel: 'GitHub',
          },
          sidebar: {
            dlData: 'Daten laden',
            ai: 'KI',
            decryptor: 'Entschlüsseler',
            help: 'Hilfe',
            allScripts: 'Alle Skripte',
          },
          scriptsPath: '/root/bash/scripts',
          labels: {
            modalOutput: 'Ausgabe',
            modalClose: 'Schließen',
            responseOutput: 'Ausgabe',
            contactEmailLead: 'Kontakt per',
            contactConnectLead: 'oder über',
            backToTop: 'Nach oben',
            quickAccess: 'Schnellzugriff',
            contactEmailLabel: 'E-Mail',
          },
          modals: {
            dlData: {
              title: 'Download läuft…',
              subtitle: 'Wichtige Daten',
            },
            ai: {
              title: 'AI',
              lines: [
                '~ $ ai --status --verbose',
                '',
                'model: anglefeint-core',
                'mode: reasoning + builder',
                'context window: 128k',
                'tools: codex / cursor / claude-code',
                'latency: 120-220ms',
                'safety: guardrails enabled',
                '',
                '>> system online',
                '>> ready for execution',
              ],
            },
            decryptor: {
              title: 'Passwort-Entschlüsseler',
              header: 'Hashes werden berechnet',
              keysLabel: 'getestete Schlüssel',
              currentPassphraseLabel: 'Aktuelle Passphrase:',
              masterKeyLabel: 'Hauptschlüssel',
              transientKeyLabel: 'Temporärer Schlüssel',
            },
            help: {
              title: 'Hilfe',
              statsLabel: 'Statistiken und Erfolge',
              typedPrefix: 'Eingegeben:',
              typedSuffix: 'Zeichen',
            },
            allScripts: {
              title: '/root/bash/scripts',
            },
          },
          effects: {
            backgroundLines: [
              '~ $ ls -la',
              'total 42',
              'drwxr-xr-x  12 user  staff   384  Jan 12  about  blog  projects',
              'drwxr-xr-x   8 user  staff   256  Jan 11  .config  .ssh  keys',
              '-rw-r--r--   1 user  staff  2048  Jan 10  README.md  .env.gpg',
              '-rwxr-xr-x   1 user  staff   512  Jan  9  deploy.sh  script',
              '~ $ cat .motd',
              '>> welcome | access granted',
            ],
            scrollToasts: {
              p30: 'Kontext analysiert 30%',
              p60: 'Inferenz stabil 60%',
              p90: 'Ausgabe abgeschlossen',
            },
          },
        },
      },
      ru: {
        meta: {
          label: 'Русский',
          hreflang: 'ru',
          ogLocale: 'ru_RU',
          fallback: ['en'],
        },
        site: {
          hero: 'Кратко представьте свой сайт и расскажите, какие статьи здесь найдут читатели.',
        },
        about: {
          metaLine: '$ profile booted | mode: builder',
          sections: {
            who: 'Кратко расскажите о себе, своём опыте и основных интересах.',
            what: 'Опишите, что вы создаёте, свои навыки и проекты, которыми хотите запомниться.',
            ethos: [
              'Ставьте ясность выше сложности.',
              'Выбирайте поддерживаемые системы вместо разовых решений.',
              'Выпускайте небольшие изменения и учитесь на обратной связи.',
              'Общайтесь прямо и документируйте решения.',
            ],
            now: 'Расскажите, над чем работаете и чему учитесь сейчас.',
            contactLead: 'Добавьте краткую информацию о возможном сотрудничестве.',
            signature: '> Замените своей подписью.',
          },
          contact: {
            email: 'you@example.com',
            githubUrl: 'https://github.com/yourname',
            githubLabel: 'GitHub',
          },
          sidebar: {
            dlData: 'Скачать данные',
            ai: 'ИИ',
            decryptor: 'Дешифратор',
            help: 'Помощь',
            allScripts: 'Все скрипты',
          },
          scriptsPath: '/root/bash/scripts',
          labels: {
            modalOutput: 'Вывод',
            modalClose: 'Закрыть',
            responseOutput: 'Вывод',
            contactEmailLead: 'Напишите мне на',
            contactConnectLead: 'или найдите меня на',
            backToTop: 'Наверх',
            quickAccess: 'Быстрый доступ',
            contactEmailLabel: 'электронную почту',
          },
          modals: {
            dlData: {
              title: 'Загрузка…',
              subtitle: 'Важные данные',
            },
            ai: {
              title: 'AI',
              lines: [
                '~ $ ai --status --verbose',
                '',
                'model: anglefeint-core',
                'mode: reasoning + builder',
                'context window: 128k',
                'tools: codex / cursor / claude-code',
                'latency: 120-220ms',
                'safety: guardrails enabled',
                '',
                '>> system online',
                '>> ready for execution',
              ],
            },
            decryptor: {
              title: 'Дешифратор паролей',
              header: 'Вычисление хешей',
              keysLabel: 'ключей проверено',
              currentPassphraseLabel: 'Текущая парольная фраза:',
              masterKeyLabel: 'Главный ключ',
              transientKeyLabel: 'Временный ключ',
            },
            help: {
              title: 'Помощь',
              statsLabel: 'Статистика и достижения',
              typedPrefix: 'Вы ввели:',
              typedSuffix: 'символов',
            },
            allScripts: {
              title: '/root/bash/scripts',
            },
          },
          effects: {
            backgroundLines: [
              '~ $ ls -la',
              'total 42',
              'drwxr-xr-x  12 user  staff   384  Jan 12  about  blog  projects',
              'drwxr-xr-x   8 user  staff   256  Jan 11  .config  .ssh  keys',
              '-rw-r--r--   1 user  staff  2048  Jan 10  README.md  .env.gpg',
              '-rwxr-xr-x   1 user  staff   512  Jan  9  deploy.sh  script',
              '~ $ cat .motd',
              '>> welcome | access granted',
            ],
            scrollToasts: {
              p30: 'контекст обработан 30%',
              p60: 'вывод стабилен 60%',
              p90: 'обработка завершена',
            },
          },
        },
      },
      'zh-hant': {
        meta: {
          label: '繁體中文',
          hreflang: 'zh-Hant',
          ogLocale: 'zh_TW',
          fallback: ['en'],
        },
        site: {
          hero: '簡短介紹你的網站，並告訴讀者這裡會有哪些內容。',
        },
        about: {
          metaLine: '$ profile booted | mode: builder',
          sections: {
            who: '簡短介紹你自己、你的背景與主要關注的領域。',
            what: '描述你打造的事物、核心技能，以及希望讓人認識的專案。',
            ethos: [
              '先追求清楚，再處理複雜度。',
              '選擇容易維護的系統，避免一次性的解法。',
              '以小步迭代發布，並從回饋中學習。',
              '直接溝通，記錄決策。',
            ],
            now: '分享你目前正在開發、發布或學習的事物。',
            contactLead: '簡單說明你期待的合作機會。',
            signature: '> 換成你自己的簽名。',
          },
          contact: {
            email: 'you@example.com',
            githubUrl: 'https://github.com/yourname',
            githubLabel: 'GitHub',
          },
          sidebar: {
            dlData: '下載資料',
            ai: 'AI',
            decryptor: '解密器',
            help: '說明',
            allScripts: '所有指令碼',
          },
          scriptsPath: '/root/bash/scripts',
          labels: {
            modalOutput: '輸出',
            modalClose: '關閉',
            responseOutput: '輸出',
            contactEmailLead: '歡迎透過',
            contactConnectLead: '或前往',
            backToTop: '回到頂端',
            quickAccess: '快速存取',
            contactEmailLabel: '電子郵件聯絡',
          },
          modals: {
            dlData: {
              title: '下載中…',
              subtitle: '重要資料',
            },
            ai: {
              title: 'AI',
              lines: [
                '~ $ ai --status --verbose',
                '',
                'model: anglefeint-core',
                'mode: reasoning + builder',
                'context window: 128k',
                'tools: codex / cursor / claude-code',
                'latency: 120-220ms',
                'safety: guardrails enabled',
                '',
                '>> system online',
                '>> ready for execution',
              ],
            },
            decryptor: {
              title: '密碼解密器',
              header: '計算雜湊值',
              keysLabel: '已測試金鑰',
              currentPassphraseLabel: '目前通行片語：',
              masterKeyLabel: '主金鑰',
              transientKeyLabel: '暫時金鑰',
            },
            help: {
              title: '說明',
              statsLabel: '統計與成就',
              typedPrefix: '你已輸入：',
              typedSuffix: '個字元',
            },
            allScripts: {
              title: '/root/bash/scripts',
            },
          },
          effects: {
            backgroundLines: [
              '~ $ ls -la',
              'total 42',
              'drwxr-xr-x  12 user  staff   384  Jan 12  about  blog  projects',
              'drwxr-xr-x   8 user  staff   256  Jan 11  .config  .ssh  keys',
              '-rw-r--r--   1 user  staff  2048  Jan 10  README.md  .env.gpg',
              '-rwxr-xr-x   1 user  staff   512  Jan  9  deploy.sh  script',
              '~ $ cat .motd',
              '>> welcome | access granted',
            ],
            scrollToasts: {
              p30: '上下文解析 30%',
              p60: '推論穩定 60%',
              p90: '輸出完成',
            },
          },
        },
      },
    },
    routing: {
      defaultLocalePrefix: 'always',
    },
  },
  social: {
    links: [],
  },
};

export function defineThemeConfig(config: DeepPartial<ThemeConfig>): ThemeConfig {
  return deepMerge(defaultThemeConfig, config);
}
