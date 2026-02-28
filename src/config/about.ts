/**
 * About page content and runtime behavior configuration.
 * Used by src/pages/[lang]/about.astro and public/scripts/about-effects.js.
 */
export const ABOUT_CONFIG = {
	metaLine: '$ profile booted | mode: builder',
	sections: {
		who: 'I build digital products that balance visual narrative, writing clarity, and engineering reliability.',
		what: 'I focus on frontend architecture, content systems, and multilingual publishing workflows for modern web teams.',
		ethos: [
			'Design for clarity first, then add style with purpose.',
			'Prefer maintainable systems over one-off visual hacks.',
			'Ship in small iterations and improve from real feedback.',
			'Keep communication direct, specific, and accountable.',
		],
		now: 'Currently exploring AI-assisted content workflows and performance-aware visual systems for static-first sites.',
		contactLead: 'Open to collaboration on design-heavy developer tools, documentation systems, and publication platforms.',
		signature: '> Signal received.',
	},
	contact: {
		email: 'voidtem@users.noreply.github.com',
		githubUrl: 'https://github.com/voidtem',
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
