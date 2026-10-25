# DESIGN.md — Reconexión Buenos Aires

Fuente de verdad visual, tipográfica y de producto.
Todo cambio de UI, tono o estructura debe respetar este documento.

---

## 1. Producto

**Qué es**
Web app navegable de un facilitador certificado de Sanación Reconectiva® y La Reconexión® en Buenos Aires.

**Qué no es**
- Landing page kilométrica
- Sitio de promesas terapéuticas
- CMS genérico

**Arquitectura de navegación**
Páginas separadas (no una sola página larga):
- Home (portada corta)
- Sanación Reconectiva
- La Reconexión
- Sobre mí
- Testimonios
- FAQ
- Entrevistas
- Mascotas
- Contacto / Reserva
- Blog
- Legales

La navegación principal debe permitir acceso directo a cada sección, como en el sitio WordPress original.

---

## 2. Principios de diseño

1. **Serenidad arquitectónica** — Calma, claridad, espacio. Nada grita.
2. **Honestidad visual** — Sin hype, sin stock genérico, sin promesas visuales de “curación”.
3. **Web app, no landing** — Secciones cortas, navegables, con jerarquía clara.
4. **Rendimiento primero** — Estático, sin JS pesado, animaciones solo si aportan y respetan `prefers-reduced-motion`.
5. **Accesibilidad base** — Contraste AA, foco visible, semántica correcta.

---

## 3. Tipografía

| Uso | Familia | Peso |
|-----|---------|------|
| Títulos (h1–h4) | Playfair Display | 400–700 |
| Cuerpo | Geist | 400–700 |

- Auto-hospedadas (Fontsource). Cero Google Fonts en runtime.
- Títulos: `letter-spacing: -0.015em`, `text-wrap: balance`.
- Cuerpo: `text-wrap: pretty`.

---

## 4. Color — “Serenidad Arquitectónica”

### Tokens institucionales

| Token | Valor | Uso |
|-------|-------|-----|
| Cream | `#FCF9F8` | Fondo global |
| Bosque 700 | `#2C3E35` | Texto principal, títulos |
| Bronce 500 | `#8C7853` | Acento, foco, detalles |

### Escalas de apoyo (legacy + uso controlado)

- **Terracota** — CTAs secundarios, acentos cálidos, hover.
- **Salvia** — Acentos fríos suaves, secciones alternativas.
- **Stone** — Bordes, textos secundarios, UI neutra.

### Reglas
- Fondo siempre cream o stone-50.
- Texto principal sobre cream ≥ AA.
- Nunca usar colores saturados de “salud / wellness genérico” (verdes neón, lilas, etc.).
- Selection: bronce-200 sobre bosque-900.

---

## 5. Espaciado y layout

- Contenedor principal: `max-width: 80rem` (`container-page`).
- Contenedor de prosa: `max-width: 44rem` (`container-prose`).
- Ritmo de sección: `--spacing-section` (5rem) / `--spacing-section-lg` (7.5rem).
- Radio orgánico: `--radius-organic: 1.75rem`.
- Padding horizontal: 1.25rem móvil → 2rem desktop.

**Grid**
- Preferir grillas simples (2–3 columnas).
- Evitar Bento densos en páginas de contenido.
- Bento solo si aporta legibilidad (ej. casos mascotas, features cortas).

---

## 6. Componentes base

### Botones
- Forma: `rounded-full`.
- Variantes:
  - `primary` → fondo oscuro (stone-900 / bosque), texto claro.
  - `secondary` → borde + fondo claro.
  - `ghost` → solo texto.
- Hover sutil: `translate-y: -0.5` + transición orgánica.
- Tamaños: `md`, `lg`, `link`.

### Cards
- Fondo stone-50 o cream.
- Borde stone-200.
- Radio orgánico.
- Sin sombras pesadas; preferir elevación mínima.

### Secciones
- Alternancia: fondo cream / muted (stone-50).
- Eyebrow en uppercase + tracking amplio + color terracota/salvia.
- Título display + lead corto.

### Navegación
- Header sticky.
- Menú claro, labels cortos.
- Dock inferior opcional en móvil (ya existe NavigationDock).

---

## 7. Movimiento

**Permitido**
- Fade-up / fade-in de entrada (ya implementado con `data-reveal`).
- Hover sutil en botones y cards.
- Transiciones de 300–700ms con `--ease-organic`.

**Prohibido por defecto**
- Scroll-jacking
- Parallax pesado
- WebGL / 3D en páginas de contenido
- Page transitions que bloqueen navegación
- Animaciones que no respeten `prefers-reduced-motion`

**Criterio**
El movimiento debe sentirse sereno. Si distrae o baja LCP/CLS, no entra.

---

## 8. Tono de voz (contenido)

- Primera persona o “nosotros” según contexto, pero siempre cercano y argentino (voseo).
- Sin promesas de curación, diagnóstico ni sustitución médica.
- Lenguaje claro, sin jerga pseudocientífica inflada.
- Disclaimer médico siempre presente en servicios y footer.
- Preferir hechos verificables (fecha de certificación, modalidad, duración) sobre adjetivos.

**Evitar**
- “Extraordinario”, “milagroso”, “cura”, “garantizado”.
- Afirmaciones sobre ADN / campo cuántico presentadas como hecho científico.
- Testimonios inventados o sin autorización.

---

## 9. Modalidad de servicio (regla de producto)

Definir y unificar en todo el sitio:
- ¿Presencial + a distancia?
- ¿Solo a distancia?

Hasta que el cliente confirme, no se inventa. Hoy hay inconsistencia: algunos textos dicen “exclusivamente a distancia” y otros “presencial y a distancia”.

---

## 10. Assets

- Fotos reales preferidas (consultorio, practicante, casos). Evitar stock genérico.
- OG image propia (hoy placeholder SVG).
- Favicon y logo definidos.
- Imágenes en `/public/images` optimizadas (webp).

---

## 11. Stack (no negociable por ahora)

- Astro 7 (output estático)
- Tailwind CSS 4
- TypeScript
- Vercel
- Sin CMS, sin backend

Cualquier librería de animación nueva debe justificarse por valor real y peso.

---

## 12. Checklist antes de publicar un cambio

- [ ] ¿Respeta la navegación por páginas (web app)?
- [ ] ¿Contraste y foco OK?
- [ ] ¿Hay placeholders o TODOs visibles?
- [ ] ¿El tono evita promesas médicas?
- [ ] ¿Modalidad de servicio es consistente?
- [ ] ¿Animaciones respetan reduced-motion?
- [ ] ¿Datos de negocio (NAP, nombre, precios) vienen de `consts.ts`?

---

*Última actualización: 2025-10-25*
*Este archivo manda sobre cualquier decisión visual o de tono del proyecto.*
