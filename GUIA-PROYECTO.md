# Guía del Proyecto — Claude Perú Website

Documento vivo que define la visión, el plan de desarrollo y el estado de cada funcionalidad.
**Regla de mantenimiento**: cada vez que se complete, agregue o descarte una funcionalidad, actualizar este archivo en el mismo commit.

Última actualización: 2026-07-10 (Fase 1 completada)

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
| Proyectos | `/proyectos` | Existe (revisar contenido en Fase 2) |
| Recursos | `/recursos` | Existe (revisar contenido en Fase 2) |
| Programas ▾ Profesionales | `/programas/profesionales` | ✅ Creada (`/programas` es página índice) |
| Programas ▾ Empresas | `/programas/empresas` | ✅ Creada |
| Sobre nosotros | `/nosotros` | Existe (revisar contenido en Fase 2) |

Secundarias (fuera del menú principal o en footer): `/directorio` (speakers), `/aplicar`, `/login`, `/portal`.

**Contactos oficiales** (usar siempre estos valores):

- WhatsApp directo: `https://wa.me/51946542990`
- Comunidad WhatsApp: `https://chat.whatsapp.com/CvBaizXWjtZCstUgXlJqi3`
- Instagram: `https://instagram.com/claudeperucommunity` (@claudeperucommunity)

## 3. Plan de desarrollo

### Fase 0 — Base ya construida ✅

- [x] Next.js 14 App Router + TypeScript strict + Tailwind + shadcn/ui
- [x] Backend Notion (slots + speakers), llamadas solo server-side
- [x] Auth magic link (Resend + HMAC + cookie `aiff_session`)
- [x] Flujo speaker: `/aplicar` → formulario → `/portal` con covers, fotos, grabaciones
- [x] Páginas base: landing, directorio, calendario, proyectos, recursos, programas, nosotros
- [x] Google Analytics cargado en `app/layout.tsx` (G-FGDCTV5ZEV)
- [x] Rebrand a Claude Perú + design system aplicado
- [x] Deploy en Vercel → `https://speakers.mayckolco.com`

### Fase 1 — Estructura y elementos globales ✅ (2026-07-10)

Objetivo: dejar la navegación y los elementos comunes alineados a la visión.

- [x] **Botón flotante de WhatsApp**: `components/WhatsAppButton.tsx` fijo abajo a la derecha, global vía `app/layout.tsx`, enlaza a `https://wa.me/51946542990`, con `aria-label`, 56px táctil y evento GA `click_whatsapp`.
- [x] **Navbar objetivo**: Eventos, Proyectos, Recursos, Programas (dropdown: Profesionales / Empresas), Sobre nosotros. Dropdown con `aria-expanded`, cierre con Escape/click-fuera, y sublinks en menú móvil.
- [x] **Footer completo**: 3 columnas (marca+redes, Explora, Comunidad) con Instagram @claudeperucommunity, comunidad WhatsApp, directorio/aplicar, y disclaimer de comunidad independiente no afiliada a Anthropic.
- [x] **Página `/eventos`**: absorbe `/calendario` con metadata propia. Redirect 301 `/calendario` → `/eventos` en `next.config.mjs`. *Pendiente para Fase 2: sección de eventos pasados con grabaciones.*
- [x] **Split de Programas**: `/programas` como índice con dos tracks, `/programas/profesionales` (programa "Claude para principiantes") y `/programas/empresas` (capacitaciones a medida, CTA WhatsApp). Cada una con metadata propia.

### Fase 2 — Contenido informativo sobre Claude (el corazón del sitio)

Objetivo: convertirse en la referencia en español-Perú sobre Claude y sus productos.

- [ ] **Landing renovada**: hero orientado a conversión (unirse a la comunidad + próximo evento), sección "¿Qué es Claude?", productos (Claude app, Claude Code, API), prueba social (speakers, testimonios), CTA final.
- [ ] **Sección novedades de Claude**: página o bloque con lanzamientos y noticias de productos Anthropic (modelos, features), mantenida manualmente al inicio.
- [ ] **Recursos v2**: recursos categorizados (empezar con Claude, prompting, Claude Code, API/builders), con filtros simples y contenido propio de la comunidad (grabaciones de charlas).
- [ ] **Proyectos v2**: showcase de proyectos de la comunidad con capturas, stack y enlaces.
- [ ] **Sobre nosotros v2**: historia, misión, equipo/organizadores, cómo participar (asistir, ser speaker, colaborar).

### Fase 3 — SEO / GEO / AEO y analítica

Objetivo: máxima visibilidad en buscadores y en motores de respuesta (ChatGPT, Perplexity, Google AI Overviews).

- [ ] **Metadata por página**: `title`/`description` únicos vía Metadata API de Next, Open Graph + Twitter cards con imagen OG propia.
- [ ] **Datos estructurados (JSON-LD)**: `Organization` (global), `Event` (cada evento), `FAQPage` (preguntas frecuentes), `Course` (programas), `BreadcrumbList`.
- [ ] **Infraestructura SEO**: `sitemap.ts`, `robots.ts`, canonical URLs, `lang="es-PE"`.
- [ ] **AEO**: sección FAQ en landing y páginas clave, redactada como respuestas directas a preguntas reales ("¿Qué es Claude?", "¿Cómo uso Claude en Perú?", "¿Claude es gratis?").
- [ ] **GEO**: contenido citable — datos concretos de la comunidad (número de eventos, speakers, miembros), definiciones claras, encabezados jerárquicos.
- [ ] **GA4 eventos de conversión**: `click_whatsapp`, `join_community`, `apply_speaker`, `register_event`, `click_instagram`. Marcarlos como conversiones en GA4.
- [ ] **Performance**: Lighthouse ≥90 en mobile (LCP, CLS), `next/image` en todas las imágenes, fonts ya optimizadas.

### Fase 4 — Conversión y crecimiento

Objetivo: que el tráfico se convierta en miembros activos.

- [ ] **CTA principal unificado**: "Únete a la comunidad" (WhatsApp community) presente en hero, navbar o footer de todas las páginas.
- [ ] **Newsletter / captura de email**: formulario simple (Resend ya está integrado) para anunciar eventos y novedades.
- [ ] **Página de gracias por conversión** (`/gracias` ya existe — revisar y conectar a los nuevos flujos).
- [ ] **Testimonios y social proof**: ampliar `TestimonialsMarquee` con casos reales de asistentes/speakers.
- [ ] **A/B de copy en CTAs** (opcional, cuando haya tráfico suficiente).

### Fase 5 — Mejora continua (backlog)

- [ ] Buscador interno de recursos
- [ ] Modo claro/oscuro (hoy solo un tema)
- [ ] Versión en inglés (si hay demanda)
- [ ] Automatizar sección de novedades desde fuentes de Anthropic
- [ ] Panel admin más completo en `/portal/admin`

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
