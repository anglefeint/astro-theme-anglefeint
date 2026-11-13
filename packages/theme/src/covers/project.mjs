import path from 'node:path';
import { loadProjectModule } from '../scaffold/project-config.mjs';
import { prepareCovers } from './prepare.mjs';

/** CLI preparation observes the same optional-content boundary as Astro. */
export async function prepareProjectCovers({ root = process.cwd(), check = false } = {}) {
  const { THEME_CONFIG } = await loadProjectModule(path.resolve(root, 'src/site.config.ts'));
  return prepareCovers({
    root,
    check,
    fragmentsEnabled: THEME_CONFIG.theme.fragments?.enabled ?? false,
  });
}
