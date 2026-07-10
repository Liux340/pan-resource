import { defineCollection, z } from 'astro:content';

const resources = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string(),
    cover: z.string().optional(),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    publishDate: z.string(),
    updateDate: z.string().optional(),
    夸克链接: z.string().optional(),
    百度链接: z.string().optional(),
    迅雷链接: z.string().optional(),
    recommended: z.boolean().default(false),
    popular: z.boolean().default(false),
  }),
});

export const collections = { resources };