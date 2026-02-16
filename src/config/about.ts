/**
 * About page content and runtime behavior configuration.
 * Used by src/pages/[lang]/about.astro and public/scripts/about-effects.js.
 */
export const ABOUT_CONFIG = {
	metaLine: '$ profile booted | mode: builder',
	sections: {
		who: 'I am a product-minded engineer who treats software as craft: clear intent, fast iteration, and accountable execution.',
		what: 'I build web systems with Astro, TypeScript, and modern CSS, focused on content platforms, interface quality, and AI-era user experiences that remain performant and understandable.',
		ethos: [
			'Curiosity before certainty: test assumptions early.',
			'Craft before noise: ship clean interfaces and readable systems.',
			'Open collaboration: document decisions so teams can move together.',
			'Autonomy with accountability: own outcomes, not just output.',
		],
		now: 'Currently building a publish-ready Astro cyberpunk theme with configurable visual modes, stronger accessibility defaults, and reusable page variants.',
		contactLead: 'Open to collaboration on frontend architecture, theme systems, and product UX.',
		signature: '> ship small, learn fast',
	},
	contact: {
		email: 'hello@example.com',
		githubUrl: 'https://github.com',
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
			'drwxr-xr-x  12 void  staff   384  Jan 12  about  blog  projects',
			'drwxr-xr-x   8 void  staff   256  Jan 11  .config  .ssh  keys',
			'-rw-r--r--   1 void  staff  2048  Jan 10  README.md  .env.gpg',
			'-rwxr-xr-x   1 void  staff   512  Jan  9  deploy.sh  hack',
			'~ $ cat .motd',
			'>> welcome to the void | access granted',
		],
		scrollToasts: {
			p30: 'context parsed',
			p60: 'inference stable',
			p90: 'output finalized',
		},
	},
} as const;

