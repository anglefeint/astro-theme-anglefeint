import js from '@eslint/js';
import globals from 'globals';

export default [
  {
    ignores: ['dist/**', '.astro/**', 'node_modules/**'],
  },
  js.configs.recommended,
  {
    files: ['scripts/**/*.{js,mjs}', 'packages/**/*.{js,mjs}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      'no-console': 'off',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }],
    },
  },
];
