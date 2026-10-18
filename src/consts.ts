/**
 * Fuente unica de verdad del sitio.
 * Todo dato de negocio (NAP, contacto, autoria, precios) se define aqui
 * para mantener coherencia entre UI, metadatos SEO y JSON-LD.
 *
 * TODO(cliente): reemplazar los valores marcados como PLACEHOLDER antes de publicar.
 */

export const SITE = {
  name: 'Reconexión Buenos Aires',
  shortName: 'Reconexión BA',
  /** Debe coincidir con `site` en astro.config.mjs */
  url: 'https://www.reconexionbuenosaires.com.ar', // PLACEHOLDER
  locale: 'es-AR',
  lang: 'es',
  themeColor: '#fafaf9',
  defaultTitle: 'Reconexión Buenos Aires | Sanación Reconectiva y La Reconexión',
  defaultDescription:
    'Sesiones de Sanación Reconectiva y La Reconexión en Buenos Aires. Práctica presencial y a distancia, explicada con claridad, límites honestos y acompañamiento respetuoso.',
  /** Imagen social por defecto (1200x630). Vive en /public. */
  defaultImage: '/og/og-default.svg', // PLACEHOLDER: sustituir por .jpg definitivo
  twitter: '', // PLACEHOLDER: '@usuario' si existe
} as const;

/** Datos de la practicante — alimentan Schema.org Person y la señal E-E-A-T. */
export const PRACTITIONER = {
  name: 'José A.',
  jobTitle: 'Facilitador Certificado de Sanación Reconectiva y La Reconexión',
  /** Año/mes de la certificación de Maestría citada por el cliente. */
  masteryDate: '2012-09',
  masteryLabel: 'septiembre de 2012',
  image: '/img/practicante.jpg', // se corregirá en fase posterior
  sameAs: [
    'https://wa.me/5491136680356',
    'https://www.tiktok.com/@reconexionbuenosaires',
    'https://www.facebook.com/lareconexionbuenosaires',
    'https://vimeo.com/reconexionbuenosaires',
    'https://x.com/Sanacion333',
    'https://ar.pinterest.com/reconexionbuenosaires',
    'https://www.youtube.com/@Reconexion333',
  ] as string[],
} as const;

/** NAP (Name, Address, Phone) — debe ser idéntico en Google Business Profile. */
export const BUSINESS = {
  legalName: 'Reconexión Buenos Aires',
  email: 'reconexionbuenosaires@proton.me',
  /** Formato E.164, requerido por Schema.org y por los enlaces tel:/wa.me */
  phone: '+5491136680356',
  phoneDisplay: '+54 9 11 3668-0356',
  whatsapp: '5491136680356', // sin '+', formato wa.me
  address: {
    streetAddress: 'Consultorio en Recoleta', // zona real
    addressLocality: 'Ciudad Autónoma de Buenos Aires',
    addressRegion: 'CABA',
    postalCode: 'C1425', // temporal hasta confirmar
    addressCountry: 'AR',
  },
  geo: {
    latitude: -34.5885, // temporal
    longitude: -58.4106, // temporal
  },
  areaServed: ['Ciudad Autónoma de Buenos Aires', 'Gran Buenos Aires', 'Argentina', 'Online'],
  openingHours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '10:00', closes: '19:00' },
    { days: ['Saturday'], opens: '10:00', closes: '14:00' },
  ],
  priceRange: '$$',
} as const;

/**
 * Definición única de cada Service (Schema.org). El mismo `@id` se emite en el home
 * y en su página de servicio: nombre y descripción deben ser idénticos en ambos.
 * La meta description de cada página es independiente.
 */
export const SERVICES = {
  sanacionReconectiva: {
    name: 'Sesión de Sanación Reconectiva',
    description:
      'Sesión individual de Sanación Reconectiva en Buenos Aires, presencial o a distancia, con encuadre claro y sin promesas de curación.',
  },
  laReconexion: {
    name: 'La Reconexión',
    description: 'Proceso de dos sesiones en días consecutivos que se realiza una única vez en la vida.',
  },
} as const;

export type NavItem = {
  href: string;
  label: string;
  /** Descripción corta usada en el menú móvil y en enlaces contextuales. */
  hint?: string;
};

export const NAV_PRIMARY: NavItem[] = [
  { href: '/sanacion-reconectiva', label: 'Sanación Reconectiva', hint: 'Qué es y cómo es una sesión' },
  { href: '/la-reconexion', label: 'La Reconexión', hint: 'El proceso de dos sesiones' },
  { href: '/sobre-mi', label: 'Sobre mí', hint: 'Trayectoria y formación' },
  { href: '/testimonios', label: 'Testimonios', hint: 'Experiencias en contexto' },
  { href: '/faq', label: 'Preguntas frecuentes', hint: 'Dudas y límites del servicio' },
  { href: '/blog', label: 'Blog', hint: 'Artículos y recursos' },
];

export const NAV_LEGAL: NavItem[] = [
  { href: '/legal/privacidad', label: 'Política de Privacidad' },
  { href: '/legal/cookies', label: 'Política de Cookies' },
  { href: '/legal/terminos', label: 'Términos y Condiciones' },
];

/**
 * Aviso legal-sanitario. Se muestra en el footer, en FAQ, en testimonios
 * y en las páginas de servicio. Es el eje de confianza del proyecto.
 */
export const MEDICAL_DISCLAIMER =
  'La Sanación Reconectiva y La Reconexión no son un tratamiento médico ni psicológico, no diagnostican, no curan enfermedades y no sustituyen ninguna indicación profesional. No interrumpas ni modifiques un tratamiento prescrito. Ante cualquier síntoma, consultá a un profesional de la salud matriculado.';

/** Ultima revisión de los documentos legales (ISO 8601). */
export const LEGAL_LAST_UPDATE = '2026-09-09';
