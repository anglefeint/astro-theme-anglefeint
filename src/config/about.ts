/**
 * About page content and runtime behavior configuration.
 * Used by src/pages/[lang]/about.astro and public/scripts/about-effects.js.
 */
export const ABOUT_CONFIG = {
	metaLine: '$ profile booted | mode: builder',
	sections: {
		who: 'Write a short introduction about yourself, your background, and what you care about.',
		what: 'Describe what you build, your core skills, and the kind of projects you want to be known for.',
		ethos: [
			'Add 3-4 principles that guide how you work.',
			'Use concise lines that are easy to scan.',
			'Focus on practical values your readers can understand quickly.',
			'Keep wording personal, clear, and honest.',
		],
		now: 'Share what you are currently building or learning.',
		contactLead: 'Add a short collaboration note (for example: open to freelance, consulting, or full-time roles).',
		signature: '> replace with your own signature',
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
