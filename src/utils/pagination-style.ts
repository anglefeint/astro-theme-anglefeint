type PaginationStyleMode = 'random' | 'sequential' | 'fixed';
type PaginationStableBy = 'page' | 'locale' | 'slug';

interface PaginationStyleConfig {
  ENABLED: boolean;
  MODE: PaginationStyleMode;
  VARIANTS: number;
  FIXED_VARIANT: number;
  STABLE_BY: PaginationStableBy;
}

interface ResolvePaginationVariantOptions {
  currentPage: number;
  totalPages: number;
  locale: string;
  pathname: string;
  config: PaginationStyleConfig;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function int(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.floor(value);
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
    variant = clamp(int(options.config.FIXED_VARIANT), 1, variants);
  } else if (mode === 'sequential') {
    variant = ((Math.max(1, int(options.currentPage)) - 1) % variants) + 1;
  } else {
    const stableBy = options.config.STABLE_BY;
    const seedKey =
      stableBy === 'locale'
        ? options.locale
        : stableBy === 'slug'
          ? options.pathname
          : `${options.locale}:${options.currentPage}:${options.totalPages}`;
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
    variant = clamp(int(options.config.FIXED_VARIANT), 1, variants);
  } else if (mode === 'sequential') {
    variant = (int(options.index) % variants) + 1;
  } else {
    variant = (hashString(options.seed) % variants) + 1;
  }

  return { className: `pg-var-${variant}`, variant };
}
