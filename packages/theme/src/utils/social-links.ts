import { realpathSync, statSync } from 'node:fs';
import { isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SOCIAL_ICON_PATHS, type SocialLink } from './social-icons.ts';

/** Resolve against Astro's publicDir, never the package or process working directory. */
export function resolveSocialLinks(links: SocialLink[], publicDir: URL, base = '/') {
  return links.map((link, index) => {
    const fail = (message: string): never => {
      throw new Error(`[Anglefeint] social.links[${index}] (${link.label}): ${message}`);
    };
    if (link.iconSrc !== undefined && typeof link.iconSrc !== 'string') {
      fail('iconSrc must be a local image path, e.g. /icons/community.svg.');
    }
    const source = link.iconSrc?.trim();
    if (source) {
      if (
        !source.startsWith('/') ||
        source.startsWith('//') ||
        /[\\%?#:\u0000-\u001f]/.test(source) ||
        source.split('/').some((part) => part === '.' || part === '..') ||
        !/\.(svg|png|webp)$/i.test(source)
      )
        fail(
          'iconSrc must start with / and name a local SVG, PNG or WebP in public/ (no URL, query or traversal).'
        );
      let root: string;
      let file: string;
      try {
        root = realpathSync(fileURLToPath(publicDir));
        file = realpathSync(resolve(root, source.slice(1)));
        if (!statSync(file).isFile()) fail(`iconSrc is not a file: ${source}`);
      } catch {
        return fail(
          `iconSrc file not found: ${source}. Add it to your Astro publicDir (public/ by default).`
        );
      }
      const inside = relative(root, file);
      if (isAbsolute(inside) || inside === '..' || inside.startsWith(`..${sep}`)) {
        fail('iconSrc must stay inside publicDir.');
      }
      return {
        ...link,
        iconSrc: `${base.replace(/\/$/, '')}${source.split('/').map(encodeURIComponent).join('/')}`,
      };
    }
    if (link.icon && !Object.hasOwn(SOCIAL_ICON_PATHS, link.icon)) {
      fail(`Unknown icon "${link.icon}". Use a supported name, iconSrc, or omit icon for text.`);
    }
    return { ...link, iconSrc: undefined };
  });
}
