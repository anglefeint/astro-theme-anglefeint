import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const ABSOLUTE_URL_SCHEME_REGEX = /^[a-z][a-z\d+.-]*:/i;

function normalizeSourceLink(value: string): string {
  const trimmed = value.trim();
  return ABSOLUTE_URL_SCHEME_REGEX.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function isValidSourceLink(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

const sourceLinkSchema = z
  .string()
  .trim()
  .min(1)
  .transform(normalizeSourceLink)
  .refine(isValidSourceLink, {
    message: 'sourceLinks entries must be valid HTTP(S) URLs or bare domains.',
  });

const blog = defineCollection({
  // Load Markdown and MDX files in the `src/content/blog/` directory.
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  // Type-check frontmatter using a schema
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      subtitle: z.string().optional(),
      description: z.string(),
      // Transform string to Date object
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      heroImage: image().optional(),
      context: z.string().optional(),
      readMinutes: z.number().int().positive().optional(),
      aiModel: z.string().optional(),
      aiMode: z.string().optional(),
      aiState: z.string().optional(),
      aiLatencyMs: z.number().int().nonnegative().optional(),
      aiConfidence: z.number().min(0).max(1).optional(),
      wordCount: z.number().int().nonnegative().optional(),
      tokenCount: z.number().int().nonnegative().optional(),
      author: z.string().optional(),
      tags: z.array(z.string()).optional(),
      canonicalTopic: z.string().optional(),
      sourceLinks: z.array(sourceLinkSchema).optional(),
    }),
});

export const collections = { blog };
