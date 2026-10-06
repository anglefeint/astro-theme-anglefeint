/** Public demo configuration. Starter uses scripts/starter-templates/site.config.ts.template. */
import { defineThemeConfig } from './site.config.defaults.ts';

export type {
  AboutConfig,
  LocaleCode,
  LocaleConfig,
  LocaleMetaConfig,
  LocaleSiteConfig,
  NormalizedLocaleConfig,
  NormalizedThemeI18nConfig,
  SocialLink,
  ThemeConfig,
  ThemeI18nConfig,
} from './site.config.schema.ts';
export { DEFAULT_ABOUT_CONFIG, defineThemeConfig } from './site.config.defaults.ts';
export { normalizeI18nConfig } from './site.config.runtime.ts';

export const THEME_CONFIG = defineThemeConfig({
  analytics: { googleAnalyticsId: '' }, // Optional GA4 Measurement ID (G-...).
  site: {
    title: 'Anglefeint',
    author: 'Anglefeint',
    url: 'https://demo.anglefeint.com',
    description:
      'A lightweight Astro theme with four cinematic atmospheres: Matrix, Cyberpunk, Hacker and AI.',
    tagline: '',
  },
  i18n: {
    locales: {
      'pt-br': {
        site: {
          hero: 'Escreva seu blog em um mundo cinematográfico. Chuva de código Matrix, noites de neon Cyberpunk, terminais Hacker e interfaces de IA em um tema Astro leve.',
        },
        about: {
          metaLine: '$ anglefeint --mode cinematic --output static',
          sections: {
            who: 'Anglefeint é um tema Astro de código aberto para blogs pessoais com identidade cinematográfica.',
            what: 'Quatro atmosferas e um único fluxo de publicação: Matrix no início, Cyberpunk na navegação, Hacker na página Sobre e IA na leitura.',
            ethos: [
              'Preserve a atmosfera e mantenha a implementação leve.',
              'Simplifique a escrita e a publicação.',
              'Ative os recursos conforme a necessidade e mantenha a configuração clara.',
              'Desenvolva em público e evolua com o uso real.',
            ],
            now: 'Busca, tags, sumário, cópia de código, visualização de imagens e imagens de compartilhamento estão incluídos. Música e comentários são opcionais.',
            contactLead: 'Dúvidas, ideias ou trabalhos para compartilhar? Visite o projeto no ',
            signature: '> Quatro atmosferas. Suas histórias.',
          },
          contact: {
            email: '',
            githubUrl: 'https://github.com/anglefeint/astro-theme-anglefeint',
            githubLabel: 'GitHub',
          },
          labels: {
            contactConnectLead: '',
          },
        },
      },
      de: {
        site: {
          hero: 'Dein Blog in einer filmischen Welt: Matrix-Coderegen, Cyberpunk-Neonnächte, Hacker-Terminals und KI-Oberflächen in einem schlanken Astro-Theme.',
        },
        about: {
          metaLine: '$ anglefeint --mode cinematic --output static',
          sections: {
            who: 'Anglefeint ist ein quelloffenes Astro-Theme für persönliche Blogs mit filmischer Identität.',
            what: 'Vier Atmosphären, ein Veröffentlichungsablauf: Matrix auf der Startseite, Cyberpunk beim Stöbern, Hacker im Profil und KI beim Lesen.',
            ethos: [
              'Eine lebendige Atmosphäre mit schlanker Umsetzung verbinden.',
              'Schreiben und Veröffentlichen einfach machen.',
              'Optionale Funktionen bei Bedarf aktivieren und Einstellungen verständlich halten.',
              'Offen entwickeln und aus der tatsächlichen Nutzung lernen.',
            ],
            now: 'Suche, Tags, Inhaltsverzeichnis, Code-Kopieren, Bildvorschau und automatisch erzeugte Vorschaubilder sind integriert. Musik und Kommentare lassen sich bei Bedarf aktivieren.',
            contactLead: 'Fragen, Ideen oder eigene Projekte? Besuche das Projekt auf ',
            signature: '> Vier Atmosphären. Deine Geschichten.',
          },
          contact: {
            email: '',
            githubUrl: 'https://github.com/anglefeint/astro-theme-anglefeint',
            githubLabel: 'GitHub',
          },
          labels: {
            contactConnectLead: '',
          },
        },
      },
      ru: {
        site: {
          hero: 'Превратите блог в кинематографичный мир: дождь кода Matrix, неоновые ночи Cyberpunk, терминалы Hacker и интерфейсы ИИ в одной лёгкой теме Astro.',
        },
        about: {
          metaLine: '$ anglefeint --mode cinematic --output static',
          sections: {
            who: 'Anglefeint — открытая тема Astro для личных блогов с кинематографичным характером.',
            what: 'Четыре атмосферы, один процесс публикации: Matrix на главной, Cyberpunk в списках, Hacker на странице автора и ИИ в статьях.',
            ethos: [
              'Сохранять выразительную атмосферу и лёгкую реализацию.',
              'Делать написание и публикацию простыми.',
              'Включать дополнительные функции по необходимости и сохранять понятные настройки.',
              'Разрабатывать открыто и улучшать на основе реального использования.',
            ],
            now: 'Встроены поиск, теги, оглавление, копирование кода, просмотр изображений и автоматические изображения для ссылок. Музыка и комментарии включаются по желанию.',
            contactLead:
              'Есть вопросы, идеи или работы, которыми хочется поделиться? Откройте проект на ',
            signature: '> Четыре атмосферы. Ваши истории.',
          },
          contact: {
            email: '',
            githubUrl: 'https://github.com/anglefeint/astro-theme-anglefeint',
            githubLabel: 'GitHub',
          },
          labels: {
            contactConnectLead: '',
          },
        },
      },
      'zh-hant': {
        site: {
          hero: '把你的部落格寫進電影裡。Matrix 的程式碼雨、Cyberpunk 的霓虹雨夜、Hacker 終端與 AI 介面，盡在一個輕量的 Astro 主題。',
        },
        about: {
          metaLine: '$ anglefeint --mode cinematic --output static',
          sections: {
            who: 'Anglefeint 是開源的 Astro 主題，為個人部落格帶來電影感與鮮明個性。',
            what: '四種氛圍，一套發布流程：首頁是 Matrix，文章列表是 Cyberpunk，關於頁是 Hacker，閱讀介面是 AI。',
            ethos: [
              '保留鮮明氛圍，讓實作保持輕量。',
              '讓寫作與發布簡單直接。',
              '需要時才開啟選用功能，讓設定清楚易懂。',
              '公開開發，根據實際使用經驗持續改善。',
            ],
            now: '內建搜尋、標籤、文章目錄、程式碼複製、圖片預覽與自動分享圖。音樂與留言可依需要啟用。',
            contactLead: '有問題、建議或作品想分享？歡迎前往專案的 ',
            signature: '> 四種氛圍，你的故事。',
          },
          contact: {
            email: '',
            githubUrl: 'https://github.com/anglefeint/astro-theme-anglefeint',
            githubLabel: 'GitHub',
          },
          labels: {
            contactConnectLead: '',
          },
        },
      },
      en: {
        site: {
          hero: 'Write your blog into a cinematic world. Matrix code rain, Cyberpunk neon nights, Hacker terminals and AI interfaces — one lightweight Astro theme.',
        },
        about: {
          metaLine: '$ anglefeint --mode cinematic --output static',
          sections: {
            who: 'Anglefeint is an open-source Astro theme for personal blogs with a cinematic identity.',
            what: 'Four atmospheres, one publishing workflow: Matrix on the homepage, Cyberpunk for browsing, Hacker on About and AI for reading articles.',
            ethos: [
              'Keep the atmosphere vivid and the implementation lightweight.',
              'Make writing and publishing straightforward.',
              'Keep optional features optional and configuration understandable.',
              'Build in the open and improve through real use.',
            ],
            now: 'Search, tags, article contents, code copying, image previews and automatic share images are built in. Music and comments can be enabled when you need them.',
            contactLead: 'Questions, ideas or something to share? Visit the project on ',
            signature: '> Four atmospheres. Your stories.',
          },
          contact: {
            email: '',
            githubUrl: 'https://github.com/anglefeint/astro-theme-anglefeint',
            githubLabel: 'GitHub',
          },
          labels: {
            contactConnectLead: '',
          },
        },
      },
      zh: {
        site: {
          hero: '把你的博客写进电影里。Matrix 的代码雨、Cyberpunk 的霓虹雨夜、Hacker 的终端与 AI 的未来界面，一个轻量的 Astro 主题。',
        },
        about: {
          metaLine: '$ anglefeint --mode cinematic --output static',
          sections: {
            who: 'Anglefeint 是一个开源 Astro 主题，为希望个人博客拥有电影感与鲜明个性的人而设计。',
            what: '四种氛围，一套写作方式：首页是 Matrix，文章列表是 Cyberpunk，About 是 Hacker，正文阅读是 AI。',
            ethos: [
              '保留鲜明的视觉氛围，让实现保持轻量。',
              '让写作与发布简单直接。',
              '可选功能按需开启，配置清楚易懂。',
              '开放开发，用真实使用反馈持续改进。',
            ],
            now: '主题已内置搜索、标签、文章目录、代码复制、图片预览和自动分享图。音乐与评论可按需要开启。',
            contactLead: '问题、建议或作品分享，欢迎前往项目的 ',
            signature: '> 四种氛围，你的故事。',
          },
          contact: {
            email: '',
            githubUrl: 'https://github.com/anglefeint/astro-theme-anglefeint',
            githubLabel: 'GitHub',
          },
          labels: {
            contactConnectLead: '',
          },
        },
      },
      ja: {
        site: {
          hero: 'あなたのブログに、映画のような世界を。Matrix のコードの雨、Cyberpunk のネオンに染まる雨の夜、Hacker の端末、AI の未来的な画面を、軽量な Astro テーマに。',
        },
        about: {
          metaLine: '$ anglefeint --mode cinematic --output static',
          sections: {
            who: 'Anglefeint は、映画のような雰囲気と個性を持つ個人ブログのための、オープンソースの Astro テーマです。',
            what: '4 つの雰囲気を、ひとつの投稿フローで。ホームは Matrix、記事一覧は Cyberpunk、About は Hacker、記事本文は AI をイメージしています。',
            ethos: [
              '鮮明な世界観を保ちながら、実装は軽量に。',
              '執筆と公開をシンプルに。',
              '必要な機能だけを有効にし、設定はわかりやすく。',
              'オープンに開発し、実際の利用から改善する。',
            ],
            now: '検索、タグ、目次、コードのコピー、画像プレビュー、共有画像の自動生成を備えています。音楽とコメントは必要に応じて有効にできます。',
            contactLead: '質問、提案、作品の紹介は、プロジェクトのこちらのページへ：',
            signature: '> 4 つの世界観。あなたの物語。',
          },
          contact: {
            email: '',
            githubUrl: 'https://github.com/anglefeint/astro-theme-anglefeint',
            githubLabel: 'GitHub',
          },
          labels: {
            contactConnectLead: '',
          },
        },
      },
      ko: {
        site: {
          hero: '블로그를 영화 속 세계로. Matrix의 코드 비, Cyberpunk의 비 내리는 네온 거리, Hacker의 터미널, AI의 미래적인 화면을 하나의 가벼운 Astro 테마에 담았습니다.',
        },
        about: {
          metaLine: '$ anglefeint --mode cinematic --output static',
          sections: {
            who: 'Anglefeint는 영화 같은 분위기와 뚜렷한 개성을 원하는 개인 블로그를 위한 오픈 소스 Astro 테마입니다.',
            what: '하나의 글쓰기 방식으로 네 가지 분위기를 만듭니다. 홈은 Matrix, 글 목록은 Cyberpunk, About은 Hacker, 본문 읽기는 AI를 담았습니다.',
            ethos: [
              '강렬한 분위기를 유지하면서 구현은 가볍게 만듭니다.',
              '글쓰기와 발행을 간단하게 만듭니다.',
              '필요한 기능만 켜고 설정은 이해하기 쉽게 유지합니다.',
              '공개적으로 개발하고 실제 사용 경험을 바탕으로 개선합니다.',
            ],
            now: '검색, 태그, 목차, 코드 복사, 이미지 미리보기, 공유 이미지 자동 생성이 내장되어 있습니다. 음악과 댓글은 필요할 때 켤 수 있습니다.',
            contactLead: '질문, 제안, 작품 공유는 프로젝트의 다음 페이지를 이용해 주세요: ',
            signature: '> 네 가지 분위기. 당신의 이야기.',
          },
          contact: {
            email: '',
            githubUrl: 'https://github.com/anglefeint/astro-theme-anglefeint',
            githubLabel: 'GitHub',
          },
          labels: {
            contactConnectLead: '',
          },
        },
      },
      es: {
        site: {
          hero: 'Dale a tu blog una atmósfera de cine. La lluvia de código de Matrix, las noches de neón de Cyberpunk, las terminales Hacker y las interfaces de IA, en un tema ligero de Astro.',
        },
        about: {
          metaLine: '$ anglefeint --mode cinematic --output static',
          sections: {
            who: 'Anglefeint es un tema de Astro de código abierto para blogs personales con identidad cinematográfica.',
            what: 'Cuatro ambientes y una sola forma de publicar: Matrix en el inicio, Cyberpunk en la lista de artículos, Hacker en About e IA en la lectura.',
            ethos: [
              'Mantener una estética marcada y una implementación ligera.',
              'Facilitar la escritura y la publicación.',
              'Activar solo lo necesario y mantener una configuración comprensible.',
              'Desarrollar en abierto y mejorar con el uso real.',
            ],
            now: 'Incluye búsqueda, etiquetas, índice del artículo, copia de código, vista ampliada de imágenes e imágenes para compartir generadas automáticamente. La música y los comentarios se activan cuando los necesitas.',
            contactLead: '¿Preguntas, ideas o algo que compartir? Visita el proyecto en ',
            signature: '> Cuatro ambientes. Tus historias.',
          },
          contact: {
            email: '',
            githubUrl: 'https://github.com/anglefeint/astro-theme-anglefeint',
            githubLabel: 'GitHub',
          },
          labels: {
            contactConnectLead: '',
          },
        },
      },
    },
  },
});
