import { clamp, int } from './number';
import { selectVisualVariant } from './visual-variant.js';

type PaginationStyleMode = 'random' | 'sequential' | 'fixed';

interface PaginationStyleConfig {
  ENABLED: boolean;
  MODE: PaginationStyleMode;
  VARIANTS: number;
  FIXED_VARIANT: number;
}

interface ResolvePaginationVariantOptions {
  currentPage: number;
  totalPages: number;
  locale: string;
  pathname: string;
  config: PaginationStyleConfig;
}

function hashString(value: string): number {
  let hash = 5381;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 33) ^ value.charCodeAt(i);
  }
  return Math.abs(hash) >>> 0;
}

export function resolvePaginationVariant(options: ResolvePaginationVariantOptions): {
  className: string;
  variant: number;
} {
  const variants = clamp(int(options.config.VARIANTS), 1, 12);
  if (!options.config.ENABLED) {
    return { className: 'cyber-pg-v1', variant: 1 };
  }

  const mode = options.config.MODE;
  let variant = 1;

  if (mode === 'fixed') {
    variant = selectVisualVariant({
      count: variants,
      mode,
      fixed: int(options.config.FIXED_VARIANT),
    });
  } else if (mode === 'sequential') {
    variant = selectVisualVariant({
      count: variants,
      mode,
      index: Math.max(1, int(options.currentPage)) - 1,
    });
  } else {
    const seedKey = `${options.locale}:${options.pathname}:${options.currentPage}:${options.totalPages}`;
    variant = (hashString(seedKey) % variants) + 1;
  }

  return {
    className: `cyber-pg-v${variant}`,
    variant,
  };
}

interface ResolvePaginationItemVariantOptions {
  seed: string;
  index: number;
  config: PaginationStyleConfig;
}

export function resolvePaginationItemVariant(options: ResolvePaginationItemVariantOptions): {
  className: string;
  variant: number;
} {
  const variants = clamp(int(options.config.VARIANTS), 1, 12);
  if (!options.config.ENABLED) {
    return { className: 'pg-var-1', variant: 1 };
  }

  const mode = options.config.MODE;
  let variant = 1;
  if (mode === 'fixed') {
    variant = selectVisualVariant({
      count: variants,
      mode,
      fixed: int(options.config.FIXED_VARIANT),
    });
  } else if (mode === 'sequential') {
    variant = selectVisualVariant({ count: variants, mode, index: int(options.index) });
  } else {
    variant = (hashString(options.seed) % variants) + 1;
  }

  return { className: `pg-var-${variant}`, variant };
}
