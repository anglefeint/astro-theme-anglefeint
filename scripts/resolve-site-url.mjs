import { loadEnv } from 'vite';

// Astro config is evaluated before import.meta.env is populated. Read the
// same dotenv mode here so Astro.site and page-level metadata use one origin.
export function resolveSiteUrl(fallback, envDir, args = process.argv.slice(2)) {
  const modeIndex = args.indexOf('--mode');
  const mode =
    (modeIndex >= 0 ? args[modeIndex + 1] : undefined) ??
    args.find((arg) => arg.startsWith('--mode='))?.slice('--mode='.length) ??
    (args.includes('dev') ? 'development' : 'production');
  const env = loadEnv(mode, envDir, 'PUBLIC_');
  return env.PUBLIC_SITE_URL ?? fallback;
}
