import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const localized = z.object({ vi: z.string(), en: z.string() });
const services = defineCollection({ loader: glob({ base: './src/content/services', pattern: '**/*.md' }), schema: z.object({ title: localized, excerpt: localized, icon: z.string(), order: z.number() }) });
const news = defineCollection({ loader: glob({ base: './src/content/news', pattern: '**/*.md' }), schema: z.object({ title: localized, excerpt: localized, date: z.coerce.date(), category: localized, image: z.string().optional() }) });
const documents = defineCollection({ loader: glob({ base: './src/content/documents', pattern: '**/*.md' }), schema: z.object({ title: localized, excerpt: localized, file: z.string(), date: z.coerce.date(), category: localized }) });
export const collections = { services, news, documents };
