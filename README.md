# Reconexión Buenos Aires

Sitio institucional de Sanación Reconectiva y La Reconexión (Buenos Aires).
Sitio estático generado con Astro, desplegado en Vercel detrás de Cloudflare.

## Stack

| Capa | Tecnología | Versión instalada |
| --- | --- | --- |
| Framework | Astro (`output: 'static'`) | 7.3.2 |
| Bundler | Vite | 8.2.2 |
| Estilos | Tailwind CSS vía `@tailwindcss/vite` | 4.3.3 |
| Tipografía | Fonts API de Astro (auto-hospedaje, provider Fontsource) | — |
| Tipos | TypeScript + `@astrojs/check` | 5.9.3 / 0.9.10 |
| SEO | `@astrojs/sitemap` + JSON-LD `@graph` propio | 3.7.4 |
| Hosting | Vercel (estático) + Cloudflare DNS/Proxy | — |

> `typescript` queda fijado en la rama 5.x porque `@astrojs/check@0.9.10`
> declara `peerDependencies: typescript ^5 || ^6`.

## Comandos

```bash
npm install          # instalar dependencias
npm run dev          # servidor de desarrollo en http://localhost:4321
npm run check        # diagnóstico de tipos en .astro/.ts
npm run build        # astro check && astro build  -> ./dist
npm run build:ci     # build sin type-check (diagnóstico de fallos)
npm run preview      # servir ./dist localmente
```

**Verificación de compilación:**

```bash
npm run build
```

Resultado esperado: `14 page(s) built`, `0 errors` en `astro check` y la carpeta
`dist/` con `sitemap-index.xml` y `robots.txt`.

## Estructura

```
src/
├── components/       # UI: Header, Footer, CookieConsent y primitivas
├── content/blog/     # Artículos en Markdown (Content Layer)
├── layouts/          # BaseLayout (SEO + JSON-LD) y LegalLayout
├── lib/schema.ts     # Constructores de JSON-LD (@graph)
├── pages/            # Rutas del sitio
├── styles/global.css # Tokens de diseño y capa base de Tailwind
├── consts.ts         # Fuente única de verdad (NAP, navegación, disclaimer)
└── content.config.ts # Esquema de la colección de blog
```

## Decisiones de arquitectura

- **JSON-LD como grafo único.** Cada página emite un solo bloque `@graph` con
  nodos referenciados por `@id` (`HealthAndBeautyBusiness`, `Person`, `WebSite`,
  `WebPage` y los específicos de la ruta). Evita duplicar la entidad de negocio
  y le permite al buscador resolver las relaciones.
- **`HealthAndBeautyBusiness`, no `MedicalBusiness`.** Declarar un tipo médico
  sin habilitación sanitaria es un riesgo regulatorio y de acción manual.
- **Sin `Review`/`AggregateRating` en testimonios.** Sin un servicio verificable
  detrás, el marcado de reseñas expone el dominio a penalizaciones.
- **CSP en dos planos.** Astro genera la CSP con hashes de scripts y estilos y
  la emite como `<meta>` en build. `frame-ancestors` viaja como cabecera en
  `vercel.json`, porque los navegadores lo ignoran cuando llega por `<meta>`.
- **Privacidad por defecto.** No se carga ningún script de terceros hasta que
  exista consentimiento explícito. El consentimiento se versiona y se registra
  con marca temporal.
- **Tipografías auto-hospedadas.** Cero peticiones a CDN de terceros: mejor LCP
  y sin transferencia de IP a Google Fonts.
- **Páginas legales `noindex` y fuera del sitemap.** No aportan valor de
  búsqueda y diluyen el presupuesto de rastreo; siguen enlazadas internamente.

## Configuración pendiente antes de publicar

Los valores marcados como `PLACEHOLDER` o `TODO(cliente)` deben reemplazarse:

1. `src/consts.ts` — dominio real, nombre de la practicante, NAP completo,
   teléfono en formato E.164, coordenadas y perfiles verificables (`sameAs`).
2. `astro.config.mjs` — `SITE_URL` debe coincidir con `SITE.url`.
3. Imagen Open Graph definitiva en `/public/og/` en formato JPG o PNG de
   1200×630 (las redes sociales no renderizan SVG) y actualizar
   `SITE.defaultImage`.
4. `/public/apple-touch-icon.png` (180×180) y su `<link>` en `BaseLayout.astro`.
5. Fotografías reales en portada y en «Sobre mí», usando `<Image />` de
   `astro:assets`.
6. Revisión por asesoría legal de los tres documentos de `/legal/`.
7. Testimonios reales, con autorización escrita conservada.

## Despliegue

Vercel detecta el framework automáticamente; `vercel.json` fija el
comportamiento explícito:

- `cleanUrls: true` y `trailingSlash: false` — URLs canónicas sin barra final.
- Cabeceras de seguridad: HSTS con `preload`, `X-Content-Type-Options`,
  `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` y COOP/CORP.
- Cache inmutable de un año para `/_assets/*` y archivos de fuentes.

En Cloudflare, mantener el proxy activo y **desactivar** Auto Minify y Rocket.
Loader: reescriben el HTML y romperían los hashes de la CSP.
