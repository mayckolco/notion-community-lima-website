# Guía del Proyecto : Claude Perú Website

Documento vivo que define la visión, el plan de desarrollo y el estado de cada funcionalidad.
**Regla de mantenimiento**: cada vez que se complete, agregue o descarte una funcionalidad, actualizar este archivo en el mismo commit.

Última actualización: 2026-07-11 (auth comunidad vs speakers)

---

## 1. Visión del proyecto

Landing page **100% informativa** sobre el ecosistema Claude (Anthropic) y sus productos, que además funciona como hub de la comunidad Claude Perú:

- Anunciar **eventos** y permitir **aplicar como speaker**
- Ofrecer **formaciones** (programas para profesionales y empresas)
- Centralizar **recursos** de aprendizaje
- Mostrar **proyectos** de la comunidad

**Objetivos de calidad** (criterios que toda página nueva debe cumplir):

- Óptima para **convertir** (CTAs claros, jerarquía visual, fricción mínima)
- Fácil de **scrollear y entender** (secciones cortas, copy directo)
- **UX/UI** de primer nivel, consistente con el design system Claude Perú
- **Responsive** (mobile-first, probado en 375px / 768px / 1280px)
- Optimizada para **SEO, GEO y AEO** (metadata, datos estructurados, contenido que responde preguntas)
- Medición con **Google Analytics** (eventos de conversión, no solo pageviews)

## 2. Arquitectura de navegación (objetivo)

Secciones principales del navbar:

| Sección | Ruta | Estado |
|---|---|---|
| Eventos | `/eventos` | ✅ Creada (`/calendario` redirige 301 aquí) |
| Comunidad | `/comunidad` | ✅ Mapa interactivo con miembros desde Notion (`DB_COMUNIDAD_ID`) |
| Proyectos | `/proyectos` | ✅ v2 con showcase de proyectos |
| Recursos | `/recursos` | ✅ v2 con filtros y grabaciones |
| Programas ▾ Profesionales | `/programas/profesionales` | ✅ Creada (`/programas` es página índice) |
| Programas ▾ Empresas | `/programas/empresas` | 🔒 Bloqueado (pronto) : página coming soon, sin link en nav/footer |
| Sobre nosotros | `/nosotros` | ✅ v2 con historia y cómo participar |

Secundarias (fuera del menú principal o en footer): `/directorio` (speakers), `/aplicar`, `/login` (comunidad), `/portal/login` (speakers), `/portal`, `/portal/admin`.

**Contactos oficiales** (usar siempre estos valores):

- WhatsApp directo: `https://wa.me/51946542990`
- Comunidad WhatsApp: `https://chat.whatsapp.com/CvBaizXWjtZCstUgXlJqi3`
- Instagram: `https://instagram.com/claudeperucommunity` (@claudeperucommunity)

## 3. Plan de desarrollo

### Fase 0 : Base ya construida ✅

- [x] Next.js 14 App Router + TypeScript strict + Tailwind + shadcn/ui
- [x] Backend Notion (slots + speakers), llamadas solo server-side
- [x] Auth magic link speakers (Resend + HMAC + cookie `aiff_session`) en `/portal/login`
- [x] Auth comunidad: registro/login en `/login` → Notion Clowdianos (`DB_COMUNIDAD_ID`) + cookie `aiff_community_session`
- [x] Flujo speaker: `/aplicar` → formulario → `/portal` con covers, fotos, grabaciones
- [x] Páginas base: landing, directorio, calendario, proyectos, recursos, programas, nosotros
- [x] Google Analytics cargado en `app/layout.tsx` (G-FGDCTV5ZEV)
- [x] Rebrand a Claude Perú + design system aplicado
- [x] Deploy en Vercel → `https://speakers.mayckolco.com`

### Fase 1 : Estructura y elementos globales ✅ (2026-07-10)

Objetivo: dejar la navegación y los elementos comunes alineados a la visión.

- [x] **Botón flotante de WhatsApp**: `components/WhatsAppButton.tsx` fijo abajo a la derecha, global vía `app/layout.tsx`, enlaza a `https://wa.me/51946542990`, con `aria-label`, 56px táctil y evento GA `click_whatsapp`.
- [x] **Navbar objetivo**: Eventos, Comunidad, Proyectos, Recursos, Programas (dropdown: Profesionales / Empresas), Sobre nosotros. Dropdown con `aria-expanded`, cierre con Escape/click-fuera, y sublinks en menú móvil.
- [x] **Footer completo**: 3 columnas (marca+redes, Explora, Comunidad) con Instagram @claudeperucommunity, comunidad WhatsApp, directorio/aplicar, y disclaimer de comunidad independiente no afiliada a Anthropic.
- [x] **Página `/eventos`**: absorbe `/calendario` con metadata propia. Redirect 301 `/calendario` → `/eventos` en `next.config.mjs`. Sección de eventos pasados con grabaciones desde Notion.
- [x] **Split de Programas**: `/programas` como índice con dos tracks. `/programas/profesionales` con catálogo completo: 6 cursos, 3 programas y 3 rutas (Chat, Cowork, Code; cero a experto; cohortes de 10; virtual y presencial 3–4 h; pre-reserva WhatsApp). `/programas/empresas` bloqueado con "(pronto)" hasta lanzamiento (`PROGRAMAS_EMPRESAS_PUBLIC = false`).

### Fase 2 : Contenido informativo sobre Claude (el corazón del sitio) ✅ (2026-07-10)

Objetivo: convertirse en la referencia en español-Perú sobre Claude y sus productos.

- [x] **Landing renovada**: hero orientado a conversión (unirse a la comunidad + próximo evento), sección "¿Qué es Claude?", productos (Claude app, Claude Code, API), prueba social (speakers, testimonios), CTA final.
- [x] **Sección novedades de Claude**: bloque en landing y `/recursos` con lanzamientos de Anthropic (`lib/content/novedades.ts`), mantenida manualmente.
- [x] **Recursos v2**: recursos categorizados con filtros (`RecursosFilter`), contenido estático + grabaciones de charlas desde Notion.
- [x] **Proyectos v2**: showcase de proyectos de la comunidad con stack y enlaces (`lib/content/proyectos.ts`).
- [x] **Sobre nosotros v2**: historia, misión, equipo/organizadores, cómo participar (asistir, ser speaker, colaborar).

### Fase 3 : SEO / GEO / AEO y analítica ✅ (2026-07-10)

Objetivo: máxima visibilidad en buscadores y en motores de respuesta (ChatGPT, Perplexity, Google AI Overviews).

- [x] **Metadata por página**: helper `createPageMetadata()` en `lib/seo/metadata.ts` con OG + Twitter cards en todas las páginas públicas. OG image renovada con paleta Claude Perú.
- [x] **Datos estructurados (JSON-LD)**: `Organization` (landing), `FAQPage` (landing + recursos), `Event` (eventos), `Course` (programas), `BreadcrumbList` (páginas internas), `Person` (directorio/speaker).
- [x] **Infraestructura SEO**: `sitemap.ts` dinámico con speakers, `robots.ts`, canonical URLs vía metadata, `lang="es-PE"` en layout.
- [x] **AEO**: sección FAQ en landing (`LANDING_FAQ`) y recursos (`RECURSOS_FAQ`) con respuestas directas.
- [x] **GEO**: `CommunityStatsSection` con datos citable (speakers, charlas, miembros WhatsApp).
- [x] **GA4 eventos de conversión**: `click_whatsapp`, `join_community`, `apply_speaker`, `register_event`, `click_instagram` implementados vía `lib/seo/analytics.ts`. *Pendiente manual: marcarlos como conversiones en el dashboard de GA4.*
- [x] **Performance**: imágenes con `next/image` en todo el sitio; fonts Inter + Fraunces optimizadas en layout.

### Fase 4 : Conversión y crecimiento ✅ (2026-07-10)

Objetivo: que el tráfico se convierta en miembros activos.

- [x] **CTA principal unificado**: `JoinCommunityButton` en navbar (desktop + móvil), hero, CTAs de página y `FooterCTA` global en todas las páginas con footer.
- [x] **Newsletter / captura de email**: `NewsletterForm` (nombre + email) + `POST /api/newsletter` con Resend y webhook n8n (`etiqueta: claude-peru-website`). Ubicado en footer global.
- [x] **Página de gracias por conversión**: `/gracias?tipo=speaker` (verificación de speaker) y `/gracias?tipo=newsletter` (suscripción). Contenido dinámico por flujo.
- [x] **Testimonios y social proof**: `lib/content/testimonials.ts` ampliado a 14 testimonios con roles (Asistente, Speaker, Organizador).
- [ ] **A/B de copy en CTAs** : diferido: sin tráfico suficiente aún para experimentar.

### Fase 5 : Mejora continua (backlog) ✅ (2026-07-10)

- [x] **Buscador interno de recursos**: campo de búsqueda en `RecursosFilter` (título, descripción, speaker, categoría).
- [x] **Modo claro/oscuro**: `ThemeProvider` + `ThemeToggle` en navbar, paleta dark en `globals.css`, `darkMode: class` en Tailwind.
- [ ] **Versión en inglés** : diferido: sin demanda confirmada aún.
- [x] **Automatizar novedades Anthropic**: `fetchAnthropicNews()` desde RSS con fallback manual, cache 24h (`getNovedades`), cron `/api/cron/sync-novedades` diario.
- [x] **Panel admin ampliado**: búsqueda de webinars/speakers, tab de speakers, quick links (eventos, directorio, aplicar), stats mejoradas.

## 4. Definición de "hecho" (DoD) por funcionalidad

Una funcionalidad se marca `[x]` solo si:

1. `pnpm lint` y `pnpm typecheck` pasan
2. Probada en móvil (375px) y desktop (1280px)
3. Metadata/SEO de la página incluida (si es página nueva)
4. Eventos de GA agregados (si tiene CTA)
5. Este archivo actualizado

## 5. Registro de cambios de la guía

| Fecha | Cambio |
|---|---|
| 2026-07-10 | Creación de la guía con visión, arquitectura de navegación y plan en 5 fases |
| 2026-07-10 | Fase 1 completada: WhatsApp flotante, navbar con dropdown, footer nuevo, `/eventos` con redirect, split de programas |
| 2026-07-10 | Fase 2 completada: landing renovada, novedades Claude, recursos v2 con filtros, proyectos v2, nosotros v2, grabaciones en eventos |
| 2026-07-10 | Fase 3 completada: SEO metadata helper, JSON-LD, FAQ/AEO, stats GEO, sitemap dinámico, GA4 eventos, lang es-PE |
| 2026-07-10 | Fase 4 completada: CTA unificado navbar/footer, newsletter con Resend, gracias multi-flujo, testimonios ampliados |
| 2026-07-10 | Fase 5 completada: buscador recursos, dark mode, novedades RSS automáticas, panel admin ampliado |
| 2026-07-11 | Catálogo programas profesionales: 6 cursos, 3 programas, 3 rutas (Chat/Cowork/Code), pre-reserva WhatsApp, precios virtual/presencial |
| 2026-07-11 | Programas empresas bloqueados (pronto): nav/footer deshabilitados, página coming soon, excluido del sitemap |
| 2026-07-11 | Auth separado: `/login` comunidad (mapa + Notion Clowdianos), `/portal/login` speakers, `/portal/admin` admin |
