import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
		schema: ({ image }) =>
			z.object({
				title: z.string(),
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
				sourceLinks: z.array(z.string().url()).optional(),
			}),
});

export const collections = { blog };
