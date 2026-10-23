/// <reference types="astro/client" />

/**
 * Variables de entorno usadas por el sitio.
 * SITE_URL es provista por Vercel (SITE ya viene tipada por astro/client).
 */
interface ImportMetaEnv {
  readonly SITE_URL?: string;
}
