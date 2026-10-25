/**
 * Fuente unica de verdad del sitio.
 * Todo dato de negocio (NAP, contacto, autoria) se define aqui
 * para mantener coherencia entre UI, metadatos SEO y JSON-LD.
 *
 * Datos tomados del sitio WordPress oficial (reconexionbuenosaires.wordpress.com).
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
    'Frecuencias de Luz e Información en Buenos Aires y a distancia. Facilitador Certificado por The Reconnection. Sanación Reconectiva a distancia y La Reconexión presencial en CABA.',
  defaultImage: '/og/og-default.svg',
  twitter: '@Sanacion333',
} as const;

/** Datos del facilitador — alimentan Schema.org Person y la señal E-E-A-T. */
export const PRACTITIONER = {
  name: 'José A.',
  jobTitle: 'Facilitador Certificado de Sanación Reconectiva y La Reconexión',
  certificationLevel: 'Nivel I y II (Sanación Reconectiva) · Nivel III (La Reconexión) — The Reconnection',
  yearsOfPractice: 12,
  sessionsDelivered: 1100,
  masteryDate: '2012-09',
  masteryLabel: 'septiembre de 2012',
  image: '/img/practicante.jpg',
  sameAs: [
    'https://www.facebook.com/lareconexionbuenosaires/',
    'https://www.youtube.com/@Reconexion333',
    'https://vimeo.com/reconexionbuenosaires',
    'https://x.com/Sanacion333',
    'https://ar.pinterest.com/reconexionbuenosaires/',
  ] as string[],
  videoTestimonio: 'https://www.youtube.com/watch?v=TWVJc_DTp9o',
} as const;

/** NAP (Name, Address, Phone) — debe ser idéntico en Google Business Profile. */
export const BUSINESS = {
  legalName: 'Reconexión Buenos Aires',
  email: 'reconexionbuenosaires@proton.me',
  phone: '+5491136680356',
  phoneDisplay: '+54 9 11 3668-0356',
  whatsapp: '5491136680356',
  address: {
    streetAddress: 'Av. Alvear, Recoleta',
    addressLocality: 'Ciudad Autónoma de Buenos Aires',
    addressRegion: 'CABA',
    postalCode: 'C1127',
    addressCountry: 'AR',
  },
  geo: {
    latitude: -34.595856,
    longitude: -58.392926,
  },
  logo: '/img/logo.svg',
  areaServed: ['Ciudad Autónoma de Buenos Aires', 'Argentina', 'LATAM', 'España', 'Online'],
  sameAs: [
    'https://www.facebook.com/lareconexionbuenosaires/',
    'https://www.youtube.com/@Reconexion333',
    'https://vimeo.com/reconexionbuenosaires',
    'https://x.com/Sanacion333',
    'https://ar.pinterest.com/reconexionbuenosaires/',
  ] as string[],
  openingHours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '16:00' },
  ],
  priceRange: '$$',
} as const;

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
  hint?: string;
};

/** Orden alineado al menú del sitio WordPress original. */
export const NAV_PRIMARY: NavItem[] = [
  { href: '/sobre-mi', label: 'Quién soy', hint: 'Trayectoria y formación' },
  { href: '/la-reconexion', label: 'La Reconexión', hint: 'Proceso presencial en CABA' },
  { href: '/sanacion-reconectiva', label: 'Sanación Reconectiva', hint: 'Sesiones a distancia' },
  { href: '/entrevistas', label: 'Entrevistas', hint: 'Dr. Eric Pearl' },
  { href: '/testimonios', label: 'Testimonios', hint: 'Experiencias y videos' },
  { href: '/faq', label: 'Preguntas', hint: 'Dudas frecuentes' },
  { href: '/contacto', label: 'Reserva', hint: 'Turnos y contacto' },
  { href: '/mascotas', label: 'Mascotas', hint: 'Sesiones a distancia para animales' },
  { href: '/blog', label: 'Blog', hint: 'Artículos y recursos' },
];

export const NAV_LEGAL: NavItem[] = [
  { href: '/legal/privacidad', label: 'Política de Privacidad' },
  { href: '/legal/cookies', label: 'Política de Cookies' },
  { href: '/legal/terminos', label: 'Términos y Condiciones' },
];

/** Descargo del sitio WordPress oficial. */
export const MEDICAL_DISCLAIMER =
  'La Sanación Reconectiva® y La Reconexión® son enfoques de bienestar integral y armonización energética. No constituyen prácticas médicas, no son tratamientos médicos, no diagnostican ni pretenden curar enfermedades. Como enseñó el Dr. Eric Pearl desde 1985: se sana la persona, no la enfermedad. Consulte siempre a su profesional médico de confianza ante cualquier condición de salud.';

export const LEGAL_LAST_UPDATE = '2026-09-09';
