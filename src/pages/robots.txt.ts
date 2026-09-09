import type { APIRoute } from 'astro';
import { SITE } from '../consts';

/**
 * robots.txt generado en build para que la URL del sitemap siga a `site`
 * y no quede desincronizada al cambiar de dominio o de entorno.
 */
export const GET: APIRoute = () => {
  const body = `User-agent: *
Allow: /
Disallow: /legal/

# Los agentes de IA generativa se bloquean por defecto.
# TODO(cliente): revisar esta decision si se busca visibilidad en respuestas generativas.
User-agent: GPTBot
Disallow: /

User-agent: CCBot
Disallow: /

Sitemap: ${new URL('sitemap-index.xml', SITE.url).href}
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
