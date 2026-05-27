import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    cluster: z.string(),
    primaryKeyword: z.string(),
    secondaryKeywords: z.array(z.string()).optional(),
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),
    heroImageCredit: z.object({
      photographer: z.string(),
      profileUrl: z.string().url(),
      photoUrl: z.string().url(),
    }).optional(),
    author: z.string().default('Kseniia'),
    readingTime: z.number().optional(),
    tags: z.array(z.string()).optional(),
    affiliates: z.array(z.string()).optional(),
    draft: z.boolean().default(false),
  }),
});

const pillars = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    emoji: z.string(),
    order: z.number().default(0),
  }),
});

export const collections = { posts, pillars };
