export function validateBlogPageSize(value: number): number {
  if (!Number.isSafeInteger(value) || value < 1)
    throw new Error('theme.blogPageSize must be a positive safe integer.');
  return value;
}
