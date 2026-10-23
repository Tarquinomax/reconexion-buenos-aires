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
  /**
   * Debe coincidir con `site` en astro.config.mjs.
   * Se lee de import.meta.env.SITE_URL (Vercel) o import.meta.env.SITE (Astro),
   * de modo que canonical y JSON-LD nunca divergen entre entornos.
   */
  url: import.meta.env.SITE_URL ?? import.meta.env.SITE ?? 'https://reconexionbuenosaires.com',
  locale: 'es-AR',
  lang: 'es',
  themeColor: '#fcf9f8',
  defaultTitle: 'Reconexión Buenos Aires | Sanación Reconectiva y La Reconexión',
  defaultDescription:
    'Sesiones de Sanación Reconectiva y La Reconexión en Buenos Aires. Práctica presencial y a distancia, explicada con claridad, límites honestos y acompañamiento respetuoso.',
  /** Imagen social por defecto (1200x630). Vive en /public. */
  defaultImage: '/og/og-default.svg', // PLACEHOLDER: sustituir por .jpg definitivo
  twitter: '', // PLACEHOLDER: '@usuario' si existe
} as const;

/** Datos del facilitador — alimentan Schema.org Person y la señal E-E-A-T. */
export const PRACTITIONER = {
  name: 'José A.', // PLACEHOLDER: confirmar apellido completo antes de publicar
  jobTitle: 'Facilitador Oficial de The Reconnection LLC (Sanación Reconectiva y La Reconexión)',
  /** Certificación Nivel III por The Reconnection LLC (organización global oficial). */
  certificationLevel: 'Nivel III — The Reconnection LLC',
  /** Etiqueta corta de acreditación para badges/insignias de UI. */
  credentialBadge: 'Facilitador Certificado',
  yearsOfPractice: 12,
  sessionsDelivered: 1100,
  /** Año/mes de la certificación de Maestría citada por el cliente. */
  masteryDate: '2012-09',
  masteryLabel: 'septiembre de 2012',
  image: '/img/practicante.jpg', // PLACEHOLDER
  sameAs: [
    // PLACEHOLDER: perfiles verificables refuerzan la entidad ante buscadores.
    // 'https://www.instagram.com/...',
    // 'https://www.linkedin.com/in/...',
  ] as string[],
} as const;

/** NAP (Name, Address, Phone) — debe ser idéntico en Google Business Profile. */
export const BUSINESS = {
  legalName: 'Reconexión Buenos Aires',
  email: 'contacto@reconexionbuenosaires.com',
  /** Formato E.164, requerido por Schema.org y por los enlaces tel:/wa.me */
  phone: '+5491136680356',
  phoneDisplay: '+54 9 11 3668-0356',
  whatsapp: '5491136680356', // sin '+', formato wa.me
  address: {
    streetAddress: 'Av. Alvear, Recoleta', // PLACEHOLDER: confirmar numero exacto de calle
    addressLocality: 'Ciudad Autónoma de Buenos Aires',
    addressRegion: 'CABA',
    postalCode: 'C1127', // PLACEHOLDER: confirmar codigo postal exacto de Recoleta
    addressCountry: 'AR',
  },
  geo: {
    latitude: -34.595856,
    longitude: -58.392926,
  },
  /** Logo cuadrado para Schema.org (recomendado >= 112x112px). */
  logo: '/img/logo.svg', // PLACEHOLDER: sustituir por el logo real cuando exista
  areaServed: ['Recoleta, CABA', 'Argentina', 'LATAM', 'España', 'Online'],
  /** Perfiles externos verificables (redes sociales / Google Maps CID) para la entidad. */
  sameAs: [
    // PLACEHOLDER:
    // 'https://www.instagram.com/...',
    // 'https://maps.google.com/?cid=...',
  ] as string[],
  openingHours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '10:00', closes: '19:00' },
    { days: ['Saturday'], opens: '10:00', closes: '14:00' },
  ],
  priceRange: '$$',
} as const;

/**
 * Diccionario centralizado de días de atención (inglés Schema.org -> español UI).
 * Evita hardcodeos en las plantillas: contacto.astro y cualquier vista de horarios
 * deben leer de aqui. Las claves coinciden con los valores de `openingHours.days`.
 */
export const DIAS_SEMANA: Record<string, string> = {
  Monday: 'Lunes',
  Tuesday: 'Martes',
  Wednesday: 'Miércoles',
  Thursday: 'Jueves',
  Friday: 'Viernes',
  Saturday: 'Sábado',
  Sunday: 'Domingo',
};

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
  { href: '/entrevistas', label: 'Entrevistas', hint: 'Videos del Dr. Eric Pearl en español' },
  { href: '/mascotas', label: 'Mascotas', hint: 'Sanación Reconectiva para perros y gatos' },
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
