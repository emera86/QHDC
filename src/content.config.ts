import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { RECIPE_CATEGORIES } from './data/taxonomy';

const recipes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/recipes' }),
  schema: z.object({
    title: z.string(),
    author: z.string().optional(),
    categories: z.array(z.enum(RECIPE_CATEGORIES)).min(1),
    tags: z.array(z.string().trim().min(1)).default([]),
    // Reservado para conservar las categorías originales al migrar, junto con su auditoría.
    originalCategories: z.array(z.string()).default([]),
    categoryMappingNote: z.string().optional(),
    summary: z.string(),
    prepTime: z.string().optional(),
    cookTime: z.string().optional(),
    servings: z.string().optional(),
    difficulty: z.string().optional(),
    images: z.array(z.object({ src: z.string().min(1), alt: z.string() })).default([]),
    demo: z.literal(true).default(true),
  }),
});

export const collections = { recipes };
