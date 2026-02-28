/**
 * Single user-facing config entry for Anglefeint.
 * Edit this file only. Other files under src/config/* and src/i18n/* are adapters.
 */

export type LocaleCode = 'en' | 'ja' | 'ko' | 'es' | 'zh';

export interface SocialLink {
	href: string;
	label: string;
	icon?: 'mastodon' | 'twitter' | 'github';
}

type DeepPartial<T> = {
	[K in keyof T]?: T[K] extends Array<infer U>
		? Array<DeepPartial<U>>
		: T[K] extends object
			? DeepPartial<T[K]>
			: T[K];
};

export interface ThemeConfig {
	site: {
		title: string;
		description: string;
		url: string;
		author: string;
		tagline: string;
		heroByLocale: Record<LocaleCode, string>;
	};
	theme: {
		blogPageSize: number;
		homeLatestCount: number;
		enableAboutPage: boolean;
	};
	i18n: {
		defaultLocale: LocaleCode;
		supportedLocales: LocaleCode[];
		localeLabels: Record<LocaleCode, string>;
	};
	social: {
		links: SocialLink[];
	};
	about: {
		metaLine: string;
		sections: {
			who: string;
			what: string;
			ethos: string[];
			now: string;
			contactLead: string;
			signature: string;
		};
		contact: {
			email: string;
			githubUrl: string;
			githubLabel: string;
		};
		sidebar: {
			dlData: string;
			ai: string;
			decryptor: string;
			help: string;
			allScripts: string;
		};
		scriptsPath: string;
		modals: {
			dlData: {
				title: string;
				subtitle: string;
			};
			ai: {
				title: string;
				lines: string[];
			};
			decryptor: {
				title: string;
				header: string;
				keysLabel: string;
				currentPassphraseLabel: string;
				masterKeyLabel: string;
				transientKeyLabel: string;
			};
			help: {
				title: string;
				statsLabel: string;
				typedPrefix: string;
				typedSuffix: string;
			};
			allScripts: {
				title: string;
			};
		};
		effects: {
			backgroundLines: string[];
			scrollToasts: {
				p30: string;
				p60: string;
				p90: string;
			};
		};
	};
}

const defaultThemeConfig: ThemeConfig = {
	site: {
		title: 'My Blog',
		description: 'Cinematic web interfaces, AI-era engineering notes, and system architecture essays.',
		url: 'https://example.com',
		author: 'Your Name',
		tagline: 'Built with Astro.',
		heroByLocale: {
			en: 'Write a short introduction for your site and what readers can expect from your posts.',
			ja: 'このサイトの紹介文と、読者がどんな記事を期待できるかを書いてください。',
			ko: '사이트 소개와 방문자가 어떤 글을 기대할 수 있는지 간단히 작성하세요.',
			es: 'Escribe una breve presentación del sitio y qué tipo de contenido encontrarán tus lectores.',
			zh: '在这里写一段站点简介，并告诉读者你将发布什么类型的内容。',
		},
	},
	theme: {
		blogPageSize: 9,
		homeLatestCount: 3,
		enableAboutPage: true,
	},
	i18n: {
		defaultLocale: 'en',
		supportedLocales: ['en', 'ja', 'ko', 'es', 'zh'],
		localeLabels: {
			en: 'English',
			ja: '日本語',
			ko: '한국어',
			es: 'Español',
			zh: '中文',
		},
	},
	social: {
		links: [],
	},
	about: {
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
			contactLead: 'Add a short collaboration note (for example: open to freelance, consulting, or full-time roles).',
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
		modals: {
			dlData: {
				title: 'Downloading...',
				subtitle: 'Critical Data',
			},
			ai: {
				title: 'AI',
				lines: [
					'~ $ model --status',
					'',
					'inference: stable',
					'context: 8k tokens',
					'latency: < 200ms',
					'',
					'>> system online',
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
	},
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
	return Object.prototype.toString.call(value) === '[object Object]';
}

function deepMerge<T>(base: T, override: DeepPartial<T>): T {
	if (!isPlainObject(base) || !isPlainObject(override)) return (override as T) ?? base;
	const result: Record<string, unknown> = { ...(base as Record<string, unknown>) };
	for (const [key, value] of Object.entries(override)) {
		if (value === undefined) continue;
		const existing = result[key];
		if (Array.isArray(value)) {
			result[key] = value;
			continue;
		}
		if (isPlainObject(existing) && isPlainObject(value)) {
			result[key] = deepMerge(existing, value);
			continue;
		}
		result[key] = value;
	}
	return result as T;
}

export function defineThemeConfig(config: DeepPartial<ThemeConfig>): ThemeConfig {
	return deepMerge(defaultThemeConfig, config);
}

/**
 * Edit this object only.
 * Omitted fields safely fall back to theme defaults.
 */
export const THEME_CONFIG = defineThemeConfig({
	// Example:
	// site: { title: "Bruce's VoidTemple" },
});

