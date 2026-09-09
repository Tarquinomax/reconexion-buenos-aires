// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

/**
 * URL canonica del sitio.
 * Se sobreescribe con la variable de entorno SITE_URL en Vercel
 * (Project Settings -> Environment Variables) para entornos de preview.
 */
const SITE_URL = process.env.SITE_URL ?? 'https://www.reconexionbuenosaires.com.ar';

export default defineConfig({
  site: SITE_URL,
  output: 'static',
  trailingSlash: 'never',
  compressHTML: true,

  // Navegacion instantanea: precarga los enlaces al entrar en viewport.
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },

  build: {
    // Inyecta el CSS critico inline cuando conviene al LCP.
    inlineStylesheets: 'auto',
    assets: '_assets',
  },

  image: {
    // Solo se permiten origenes remotos explicitos (defensa contra SSRF en el optimizador).
    domains: [],
    remotePatterns: [],
  },

  security: {
    // CSP generada en build con hashes de scripts/estilos propios.
    // Se emite como <meta http-equiv="content-security-policy">.
    csp: {
      algorithm: 'SHA-256',
      directives: [
        "default-src 'self'",
        "img-src 'self' data: blob:",
        "font-src 'self' data:",
        "connect-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        // `frame-ancestors` NO se declara aqui: los navegadores lo ignoran
        // cuando la CSP llega por <meta>. Se envia como cabecera en vercel.json.
        'upgrade-insecure-requests',
      ],
    },
  },

  // Tipografias auto-hospedadas: cero requests a terceros (RGPD/LGPD) y
  // preload + font-display optimizados para CLS.
  fonts: [
    {
      name: 'Fraunces',
      cssVariable: '--font-fraunces',
      provider: fontProviders.fontsource(),
      weights: [400, 600],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['Iowan Old Style', 'Georgia', 'serif'],
      optimizedFallbacks: true,
    },
    {
      name: 'Inter',
      cssVariable: '--font-inter',
      provider: fontProviders.fontsource(),
      weights: ['400 700'],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['system-ui', 'Segoe UI', 'Helvetica Neue', 'sans-serif'],
      optimizedFallbacks: true,
    },
  ],

  integrations: [
    sitemap({
      filter: (page) => !page.includes('/legal/') && !page.includes('/gracias'),
      i18n: undefined,
      changefreq: 'monthly',
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
    build: {
      cssMinify: 'lightningcss',
    },
  },
});
