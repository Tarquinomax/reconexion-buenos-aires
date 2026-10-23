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

/**
 * Identificadores canonicos del grafo. Las entidades se declaran UNA sola vez
 * por pagina bajo estos `@id` fijos (espejo exacto del maestro GEO/E-E-A-T);
 * el resto de los nodos las referencia por puntero `{ '@id' }` y nunca las
 * re-declara inline, para evitar contaminacion conceptual ante RankBrain/MUM.
 */
export const ID = {
  business: `${SITE.url}/#localbusiness`,
  person: `${SITE.url}/#person`,
  website: `${SITE.url}/#website`,
  serviceReconectiva: `${SITE.url}/#service-reconectiva`,
  serviceLaReconexion: `${SITE.url}/#service-la-reconexion`,
  serviceMascotas: `${SITE.url}/#service-mascotas`,
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
    // HealthAndBeautyBusiness (NO MedicalBusiness): la practica no es un
    // establecimiento de salud regulado. Se mantiene LocalBusiness como
    // supertipo para conservacion del tipo ante validadores estrictos.
    '@type': ['HealthAndBeautyBusiness', 'LocalBusiness'],
    '@id': ID.business,
    name: `${PRACTITIONER.name} - La Reconexión Presencial CABA`,
    additionalName: SITE.name,
    legalName: BUSINESS.legalName,
    url: SITE.url,
    email: BUSINESS.email,
    telephone: BUSINESS.phone,
    priceRange: BUSINESS.priceRange,
    image: absoluteUrl(SITE.defaultImage),
    logo: absoluteUrl(BUSINESS.logo),
    sameAs: BUSINESS.sameAs,
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
    // Tarifa fija universal de La Reconexión (U$D 333) reflejada en el negocio.
    // El valor numerico exacto con currency se declara ademas en el Offer del
    // Service #service-la-reconexion; aqui se usa la notacion microdata U$S.
    hasPriceSpecification: {
      '@type': 'PriceSpecification',
      price: String(BUSINESS.laReconexionPriceUsd),
      priceCurrency: 'USD',
      name: 'La Reconexión® Presencial — tarifa fija universal',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: BUSINESS.geo.latitude,
      longitude: BUSINESS.geo.longitude,
    },
    areaServed: areaServedMarkets(),
    openingHoursSpecification: openingHoursSpecification(),
    availableLanguage: ['es'],
  };
}

/**
 * areaServed del negocio: mercados objetivos declarados como entidades
 * administrativas reales (Country / AdministrativeArea), sin fragmentar el
 * dominio en paginas por provincia o pais. 'Online' se excluye porque no es
 * un lugar valido en Schema.org; la modalidad remota se declara aparte via
 * `availableChannel` en los nodos Service.
 */
const AREA_SERVED_SCHEMA_TYPES: Record<string, { '@type': 'Country' | 'AdministrativeArea' }> = {
  Argentina: { '@type': 'Country' },
  España: { '@type': 'Country' },
  LATAM: { '@type': 'AdministrativeArea' },
};

function areaServedMarkets(): JsonLdNode[] {
  const nodes: JsonLdNode[] = [
    // Nivel local (SSOT): el consultorio fisico de Recoleta, CABA.
    {
      '@type': 'Place',
      name: 'Recoleta, Ciudad Autónoma de Buenos Aires',
      geo: {
        '@type': 'GeoCoordinates',
        latitude: BUSINESS.geo.latitude,
        longitude: BUSINESS.geo.longitude,
      },
    },
  ];
  for (const name of BUSINESS.areaServed) {
    const schemaType = AREA_SERVED_SCHEMA_TYPES[name];
    if (schemaType) nodes.push({ ...schemaType, name });
  }
  return nodes;
}

/**
 * Canal de entrega remoto/virtual para los nodos Service. La modalidad a
 * distancia queda explicita sin crear rutas fisicas por provincia o pais:
 * cubre todas las areas definidas en `areaServedMarkets()`.
 */
function remoteServiceChannel(serviceUrl: string, serviceId: string): JsonLdNode {
  return {
    '@type': 'ServiceChannel',
    '@id': `${serviceUrl}#channel-remoto`,
    name: 'Sesión a distancia (modalidad virtual)',
    serviceUrl: absoluteUrl(serviceUrl),
    providesService: { '@id': serviceId },
    availableLanguage: ['es'],
    serviceOperator: { '@id': ID.business },
  };
}

/** Entidad autoral. Sostiene la senal E-E-A-T del contenido. */
export function personNode(): JsonLdNode {
  return {
    '@type': 'Person',
    '@id': ID.person,
    name: PRACTITIONER.name,
    jobTitle: 'Facilitador Certificado de Sanación Reconectiva y La Reconexión',
    // Tripletas EAV maestras: la descripcion consolida certificador, fecha y
    // casuistica verificada (SSOT: PRACTITIONER.masteryLabel / sessionsDelivered).
    description: `Formado y certificado oficialmente en Buenos Aires en ${PRACTITIONER.masteryLabel} por el Dr. Eric Pearl y The Reconnection, con más de una década de práctica continua y más de ${PRACTITIONER.sessionsDelivered.toLocaleString('es-AR')} sesiones individuales facilitadas.`,
    url: absoluteUrl('/sobre-mi'),
    image: absoluteUrl(PRACTITIONER.image),
    worksFor: { '@id': ID.business },
    // Subordinacion explicita dentro del @graph: la biografia es la entidad
    // principal de la pagina y esta queda descriptada bajo la persona.
    describes: { '@id': `${SITE.url}/sobre-mi#webpage` },
    knowsAbout: [
      'Sanación Reconectiva',
      'La Reconexión',
      'Bioenergética',
      'Campos de energía, luz e información',
      'Acompañamiento en procesos de salud integrativa',
    ],
    hasCredential: {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'certificate',
      name: `${PRACTITIONER.certificationLevel} · The Reconnection LLC`,
      dateCreated: PRACTITIONER.masteryDate,
    },
    ...(PRACTITIONER.sameAs.length > 0 ? { sameAs: PRACTITIONER.sameAs } : {}),
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

export type VideoObjectOptions = {
  /** Identificador estable del video dentro del grafo (ej: `${url}#video-abc123`). */
  id: string;
  name: string;
  description: string;
  /** Ruta interna o URL absoluta de la miniatura (>= 120x90, ideal 1920x1080). */
  thumbnailUrl: string;
  /** Fecha de subida en ISO 8601 (ej: '2026-09-01T12:00:00Z'). */
  uploadDate: string;
  /** Duracion en formato ISO 8601 duration (ej: 'PT5M30S'). */
  duration: string;
  /** Enlace directo al archivo de video. Al menos contentUrl o embedUrl es requerido. */
  contentUrl?: string;
  /** URL del player embebido (YouTube, Vimeo, etc.). */
  embedUrl?: string;
  /** Autoria para E-E-A-T: por defecto la practicante (ID.person). */
  creatorId?: string;
  /** Contador de interacciones visible; 0 si no se conoce aun. */
  userInteractionCount?: number;
};

/**
 * Nodo VideoObject. Incluye creator por @id para reforzar E-E-A-T e
 * interactionStatistic con WatchAction, tal como espera Google.
 */
export function videoNode(options: VideoObjectOptions): JsonLdNode {
  return {
    '@type': 'VideoObject',
    '@id': options.id,
    name: options.name,
    description: options.description,
    thumbnailUrl: absoluteUrl(options.thumbnailUrl),
    uploadDate: options.uploadDate,
    duration: options.duration,
    ...(options.contentUrl ? { contentUrl: options.contentUrl } : {}),
    ...(options.embedUrl ? { embedUrl: options.embedUrl } : {}),
    creator: { '@id': options.creatorId ?? ID.person },
    interactionStatistic: {
      '@type': 'InteractionCounter',
      interactionType: { '@type': 'WatchAction' },
      userInteractionCount: options.userInteractionCount ?? 0,
    },
  };
}

export function webPageNode(options: {
  url: string;
  title: string;
  description: string;
  hasBreadcrumb: boolean;
  datePublished?: string;
  dateModified?: string;
  /** @id de la entidad principal (Service, VideoObject, etc.) para vincular la pagina. */
  mainEntityId?: string;
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
    ...(options.mainEntityId ? { mainEntity: { '@id': options.mainEntityId } } : {}),
    ...(options.hasBreadcrumb ? { breadcrumb: { '@id': `${options.url}#breadcrumb` } } : {}),
    ...(options.datePublished ? { datePublished: options.datePublished } : {}),
    ...(options.dateModified ? { dateModified: options.dateModified } : {}),
  };
}

export type FaqEntry = { question: string; answer: string };

/**
 * Nodo FAQPage con sub-nodos Question/Answer individuales y `@id` estables.
 * Cada Question referencia su Answer por `@id` (aceptado por Google Rich Results)
 * y `dateModified` alimenta la frescura del contenido. La pagina que lo hospeda
 * debe vincularlo como entidad principal via `mainEntityId: `${url}#faq``.
 */
export function faqNode(
  entries: Array<FaqEntry & { id?: string; dateModified?: string }>,
  pageUrl: string,
): JsonLdNode {
  const slugify = (value: string): string =>
    value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60);

  return {
    '@type': 'FAQPage',
    '@id': `${pageUrl}#faq`,
    mainEntity: entries.map((entry, index) => {
      const questionId = `${pageUrl}#faq-q-${entry.id ?? String(index + 1).padStart(2, '0')}-${slugify(entry.question)}`;
      const answerId = `${questionId}-answer`;
      return {
        '@type': 'Question',
        '@id': questionId,
        name: entry.question,
        acceptedAnswer: {
          '@type': 'Answer',
          '@id': answerId,
          text: entry.answer,
        },
        answeredBy: { '@id': ID.business },
        ...(entry.dateModified ? { dateModified: entry.dateModified } : {}),
      };
    }),
  };
}

export function serviceNode(options: {
  name: string;
  description: string;
  url: string;
  serviceType: string;
  /** Declara el canal virtual (#channel-remoto) del servicio. Falso en procesos 100% presenciales. */
  remote?: boolean;
  /** Oferta con precio numerico (USD). Se emite solo si se provee, para no inventar datos. */
  offer?: { price: number; priceCurrency?: string };
  /**
   * `@id` canonico del servicio dentro del grafo maestro (ID.serviceReconectiva /
   * ID.serviceLaReconexion). Si se omite, se deriva de la URL (`${url}#service`).
   */
  id?: string;
}): JsonLdNode {
  const serviceId = options.id ?? `${options.url}#service`;
  return {
    '@type': 'Service',
    '@id': serviceId,
    name: options.name,
    description: options.description,
    serviceType: options.serviceType,
    url: options.url,
    provider: { '@id': ID.business },
    // Mismos mercados que el negocio (Argentina / LATAM / España), sin
    // fragmentar el dominio en paginas por provincia o pais.
    areaServed: areaServedMarkets(),
    // Entrega explicita a distancia: canal virtual apto para todas las areas.
    ...(options.remote === false ? {} : { availableChannel: remoteServiceChannel(options.url, serviceId) }),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: options.serviceType,
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: { '@id': serviceId },
          ...(options.offer
            ? {
                price: String(options.offer.price),
                priceCurrency: options.offer.priceCurrency ?? 'USD',
                availability: 'https://schema.org/InStock',
              }
            : {}),
        },
      ],
    },
    audience: { '@type': 'Audience', audienceType: 'Personas adultas' },
  };
}

/**
 * Servicio de Sanación para mascotas. Declara el mismo canal remoto que el
 * resto de los servicios (entrega a distancia, apto para todos los mercados
 * de `areaServedMarkets()`). El caso real de Scubby se incorpora como
 * sub-nodo con datos clínicos, foto y autor pendientes de validación por el
 * cliente antes de publicar.
 */
export function petServiceNode(): JsonLdNode {
  const url = '/mascotas';
  // `@id` absoluto, consistente con el resto de entidades canonicas del grafo.
  const serviceId = `${SITE.url}/#service-mascotas`;
  return {
    '@type': 'Service',
    '@id': serviceId,
    name: 'Sanación para mascotas',
    description:
      'Sesiones a distancia de Sanación Reconectiva dirigidas a perros y gatos (cobertura global). Sostén complementario, no veterinario: ante cualquier síntoma, consultá a un médico veterinario matriculado.',
    serviceType: 'Sanación Reconectiva® para Mascotas a Distancia',
    url: absoluteUrl(url),
    provider: { '@id': ID.business },
    // Entrega explicita a distancia: mismo patron de canal que los demas servicios.
    availableChannel: remoteServiceChannel(url, serviceId),
    areaServed: areaServedMarkets(),
    audience: { '@type': 'Audience', audienceType: 'Tutores de perros y gatos' },
    // Evidencias clínicas declaradas como sub-nodos MedicalCaseStudy dentro del
    // @graph. Los datos numéricos provienen del informe original de laboratorio
    // (Protocolo N° 305353) aportado por la tutora; las fotos se referencian en
    // su estado original, sin ediciones.
    subjectOf: [
      {
        '@type': 'MedicalCaseStudy',
        '@id': `${url}#caso-reina`,
        name: 'Caso Real de Reina',
        description:
          'Gata de 17 años con vómitos persistentes y riñones e hígado deteriorados. Tras sesiones de Sanación Reconectiva a distancia facilitadas el 15 de octubre de 2014, recuperó de forma súbita la energía y el apetito.',
        about: 'Fallo hepático y renal en felino de 17 años. Sesiones a distancia: 15/10/2014.',
        medicalIndication: 'Cuadro de vómitos con deterioro hepático y renal diagnosticado por veterinario.',
        medicalTherapy: 'Sesiones de Sanación Reconectiva a distancia, complementarias al tratamiento veterinario en curso.',
        outcome: 'Recuperación súbita de energía y apetito documentada por la tutora tras las sesiones.',
        dateOfDiagnosis: '2014-10-15',
        image: absoluteUrl('/images/reina.webp'),
        author: 'María M.',
        relevantSpecialty: 'Medicina veterinaria (felinos)',
        status: 'Completed',
        studyLocation: { '@id': ID.business },
        isPartOf: { '@id': serviceId },
      },
      {
        '@type': 'MedicalCaseStudy',
        '@id': `${url}#caso-scubby`,
        name: 'Caso Real de Scubby',
        description:
          'Perro de 3 años, La Plata, con cuadro crítico: hematocrito de 4,3% (referencia 37–55%), hemoglobina 2,6 g/dl, glóbulos rojos 0,8 millones/µl y leucocitos 25.300 /µl. Informe de laboratorio del 11/ago/2015 (Protocolo N° 305353).',
        about: 'Cuadro crítico canino con hematocrito al 4,3%. Informe de laboratorio: 11/Agosto/2015, Protocolo N° 305353.',
        medicalIndication:
          'Anemia severa: hematocrito 4,3% (manual 3%) vs referencia 37–55%; hemoglobina 2,6 g/dl vs 12–18 g/dl; glóbulos rojos 0,8 millones/µl vs 5,5–8,5 millones/µl; leucocitos 25.300 /µl vs 6.000–18.000 /µl.',
        medicalTherapy:
          'Sanación Reconectiva a distancia solicitada por la tutora Lorena T. mientras el veterinario mantenía el tratamiento y evaluaba una transfusión.',
        outcome:
          'Los veterinarios compartieron el estudio con sus colegas ante la evolución observada tras las sesiones.',
        dateOfDiagnosis: '2015-08-11',
        image: absoluteUrl('/images/scubby.webp'),
        author: 'Lorena T.',
        relevantSpecialty: 'Medicina veterinaria (caninos)',
        status: 'Completed',
        studyLocation: { '@id': ID.business },
        isPartOf: { '@id': serviceId },
      },
    ],
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
