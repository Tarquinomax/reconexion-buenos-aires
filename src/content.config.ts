import { defineCollection } from 'astro:content';
// Zod se importa desde 'astro/zod' (zod v4): el re-export `z` de 'astro:content'
// esta marcado como deprecado en Astro 7 y genera avisos en `astro check`.
import * as z from 'astro/zod';
import { glob } from 'astro/loaders';

/**
 * Coleccion de blog basada en el Content Layer.
 * El esquema es estricto a proposito: cada articulo debe declarar autoria y
 * fechas, porque son las senales que sostienen E-E-A-T y el JSON-LD de Article.
 */
const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string().max(70, 'Título demasiado largo para el SERP'),
    description: z.string().min(70).max(165, 'Meta description fuera del rango óptimo'),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    /** Se excluye del listado y del sitemap mientras sea true. */
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    /** Tiempo estimado de lectura en minutos; si se omite, no se muestra. */
    readingTime: z.number().int().positive().optional(),
    cover: z
      .object({
        src: z.string(),
        alt: z.string(),
      })
      .optional(),
  }),
});

export const collections = { blog };
