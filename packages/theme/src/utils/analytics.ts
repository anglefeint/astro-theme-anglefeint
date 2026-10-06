/** Empty means disabled. A measurement ID is public, not a secret/API key. */
export function normalizeGoogleAnalyticsId(value: unknown): string {
  if (value === undefined) return '';
  if (typeof value !== 'string' || (value.trim() && !/^G-[A-Z0-9]+$/.test(value.trim()))) {
    throw new Error(
      '[analytics.googleAnalyticsId] Expected a GA4 Measurement ID such as G-XXXXXXXXXX, or an empty string to disable analytics.'
    );
  }
  return value.trim();
}
