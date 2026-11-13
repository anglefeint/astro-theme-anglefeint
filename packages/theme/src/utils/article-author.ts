/** Keep the byline and generated share-image identity identical. */
export function resolveArticleAuthor(author: string | undefined, fallback: string): string {
  return author?.trim() || fallback;
}
