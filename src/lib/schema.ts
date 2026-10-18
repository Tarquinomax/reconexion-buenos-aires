/**
 * Constructores de JSON-LD (Schema.org).
 *
 * Estrategia: un unico bloque `@graph` por pagina con nodos referenciados por `@id`.
 * Esto evita duplicar la entidad de negocio en cada plantilla y le permite a los
 * buscadores resolver las relaciones (WebPage -> isPartOf -> WebSite -> publisher).
 */
import { BUSINESS, PRACTITIONER, SITE } from '../consts';

export type JsonLdNode = Record<string, unknown>;

/** Devuelve una URL absoluta y canonica a partir de una ruta interna. */
export function absoluteUrl(path: string): string {
  return new URL(path, SITE.url).href.replace(/\/$/, '') || SITE.url;
}

export const ID = {
  business: `${SITE.url}/#business`,
  person: `${SITE.url}/#practitioner`,
  website: `${SITE.url}/#website`,
  sanacionReconectiva: `${SITE.url}/#sanacion-reconectiva`,
  laReconexion: `${SITE.url}/#la-reconexion`,
  theReconnection: `${SITE.url}/#the-reconnection`,
  ericPearl: `${SITE.url}/#eric-pearl`,
} as const;

function openingHoursSpecification(): JsonLdNode[] {
  return BUSINESS.openingHours.map((block) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: block.days,
    opens: block.opens,
    closes: block.closes,
  }));
}

/** Entidad de negocio local. HealthAndBeautyBusiness es el tipo mas honesto: no es MedicalBusiness. */
export function businessNode(): JsonLdNode {
  return {
    '@type': ['HealthAndBeautyBusiness', 'LocalBusiness'],
    '@id': ID.business,
    name: SITE.name,
    legalName: BUSINESS.legalName,
    url: SITE.url,
    email: BUSINESS.email,
    telephone: BUSINESS.phone,
    priceRange: BUSINESS.priceRange,
    image: absoluteUrl(SITE.defaultImage),
    description: SITE.defaultDescription,
    founder: { '@id': ID.person },
    employee: { '@id': ID.person },
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS.address.streetAddress,
      addressLocality: BUSINESS.address.addressLocality,
      addressRegion: BUSINESS.address.addressRegion,
      postalCode: BUSINESS.address.postalCode,
      addressCountry: BUSINESS.address.addressCountry,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: BUSINESS.geo.latitude,
      longitude: BUSINESS.geo.longitude,
    },
    areaServed: BUSINESS.areaServed.map((name) => ({ '@type': 'Place', name })),
    openingHoursSpecification: openingHoursSpecification(),
    availableLanguage: ['es'],
  };
}

/** Entidad autoral. Sostiene la senal E-E-A-T del contenido. */
export function personNode(): JsonLdNode {
  return {
    '@type': 'Person',
    '@id': ID.person,
    name: PRACTITIONER.name,
    jobTitle: PRACTITIONER.jobTitle,
    url: absoluteUrl('/sobre-mi'),
    image: absoluteUrl(PRACTITIONER.image),
    worksFor: { '@id': ID.business },
    knowsAbout: [
      { '@id': ID.sanacionReconectiva },
      { '@id': ID.laReconexion },
    ],
    hasCredential: {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'certificate',
      name: 'Maestría en Sanación Reconectiva',
      dateCreated: PRACTITIONER.masteryDate,
      recognizedBy: { '@id': ID.theReconnection },
    },
    ...(PRACTITIONER.sameAs.length > 0 ? { sameAs: PRACTITIONER.sameAs } : {}),
  };
}

/** Concepto: Sanación Reconectiva. Destino de `knowsAbout` y, en fases posteriores, de `about`. */
export function sanacionReconectivaNode(): JsonLdNode {
  return {
    '@type': ['Thing', 'DefinedTerm'],
    '@id': ID.sanacionReconectiva,
    name: 'Sanación Reconectiva',
    creator: { '@id': ID.ericPearl },
    description:
      'Forma de acceso a un espectro de frecuencias de energía, luz e información orientada a restablecer el equilibrio integral en los niveles físico, mental, emocional y espiritual.',
    inLanguage: 'es',
  };
}

/** Concepto: La Reconexión. */
export function laReconexionNode(): JsonLdNode {
  return {
    '@type': ['Thing', 'DefinedTerm'],
    '@id': ID.laReconexion,
    name: 'La Reconexión',
    creator: { '@id': ID.ericPearl },
    description:
      'Proceso de reconexión con el universo que profundiza la Sanación Reconectiva. Se realiza una sola vez en la vida, en dos sesiones presenciales.',
    inLanguage: 'es',
  };
}

/** Organización que otorga la certificación (`recognizedBy`). */
export function theReconnectionOrgNode(): JsonLdNode {
  return {
    '@type': 'Organization',
    '@id': ID.theReconnection,
    name: 'The Reconnection',
    founder: { '@id': ID.ericPearl },
    url: 'https://www.reconnectivehealing.com/',
    sameAs: ['https://www.reconnectivehealing.com/'],
  };
}

/** Originador de ambas prácticas. */
export function ericPearlNode(): JsonLdNode {
  return {
    '@type': 'Person',
    '@id': ID.ericPearl,
    name: 'Dr. Eric Pearl',
    jobTitle: 'Originador de la Sanación Reconectiva y La Reconexión',
  };
}

export function websiteNode(): JsonLdNode {
  return {
    '@type': 'WebSite',
    '@id': ID.website,
    url: SITE.url,
    name: SITE.name,
    inLanguage: SITE.locale,
    publisher: { '@id': ID.business },
  };
}

export type BreadcrumbEntry = { name: string; item: string };

export function breadcrumbNode(entries: BreadcrumbEntry[], pageUrl: string): JsonLdNode {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${pageUrl}#breadcrumb`,
    itemListElement: entries.map((entry, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: entry.name,
      item: absoluteUrl(entry.item),
    })),
  };
}

export function webPageNode(options: {
  url: string;
  title: string;
  description: string;
  hasBreadcrumb: boolean;
  datePublished?: string;
  dateModified?: string;
}): JsonLdNode {
  return {
    '@type': 'WebPage',
    '@id': `${options.url}#webpage`,
    url: options.url,
    name: options.title,
    description: options.description,
    inLanguage: SITE.locale,
    isPartOf: { '@id': ID.website },
    about: { '@id': ID.business },
    ...(options.hasBreadcrumb ? { breadcrumb: { '@id': `${options.url}#breadcrumb` } } : {}),
    ...(options.datePublished ? { datePublished: options.datePublished } : {}),
    ...(options.dateModified ? { dateModified: options.dateModified } : {}),
  };
}

export type FaqEntry = { question: string; answer: string };

export function faqNode(entries: FaqEntry[], pageUrl: string): JsonLdNode {
  return {
    '@type': 'FAQPage',
    '@id': `${pageUrl}#faq`,
    mainEntity: entries.map((entry) => ({
      '@type': 'Question',
      name: entry.question,
      acceptedAnswer: { '@type': 'Answer', text: entry.answer },
    })),
  };
}

/** Referencia a un nodo del mismo `@graph`. */
export type JsonLdRef = { '@id': string };

export function serviceNode(options: {
  name: string;
  description: string;
  url: string;
  /** Referencia al concepto (DefinedTerm) que presta el servicio. */
  serviceType: JsonLdRef;
  category?: JsonLdRef;
}): JsonLdNode {
  return {
    '@type': 'Service',
    '@id': `${options.url}#service`,
    name: options.name,
    description: options.description,
    serviceType: options.serviceType,
    ...(options.category ? { category: options.category } : {}),
    url: options.url,
    provider: { '@id': ID.business },
    areaServed: BUSINESS.areaServed.map((name) => ({ '@type': 'Place', name })),
    audience: { '@type': 'Audience', audienceType: 'Personas adultas' },
  };
}

export function articleNode(options: {
  url: string;
  title: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
}): JsonLdNode {
  return {
    '@type': 'Article',
    '@id': `${options.url}#article`,
    headline: options.title,
    description: options.description,
    datePublished: options.datePublished,
    dateModified: options.dateModified ?? options.datePublished,
    inLanguage: SITE.locale,
    mainEntityOfPage: { '@id': `${options.url}#webpage` },
    author: { '@id': ID.person },
    publisher: { '@id': ID.business },
    image: absoluteUrl(options.image ?? SITE.defaultImage),
  };
}

/** Ensambla el documento final `@context` + `@graph`. */
export function buildGraph(nodes: JsonLdNode[]): string {
  return JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@graph': nodes,
    },
    null,
    0,
  );
}
