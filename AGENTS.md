# Notion Community Lima : AGENTS.md

Plataforma web de la comunidad Notion en Lima.
Notion es el único backend. La web lee/escribe vía Notion API.

**Producción**: `https://notion.mayckolco.com`
**Vercel project**: `notion-community-lima-website`
**Repo GitHub**: `mayckolco/notion-community-lima-website`

## Stack
- Next.js 14 (App Router) + TypeScript strict
- Tailwind + shadcn/ui
- Notion API (`@notionhq/client` v5) como único backend
- Auth dual: magic link via Resend + HMAC session cookies (`aiff_session` speakers, `aiff_community_session` comunidad)
- Vercel (hosting + cron functions)

## Base de datos Notion

### Speakers (`DB_SPEAKERS_ID`)
| Propiedad Notion | Campo código | Tipo |
|---|---|---|
| Nombre completo | `nombre` | title |
| Email | `email` | email |
| Foto | `foto` | files |
| Biografía | `biografia` | rich_text |
| Rol | `rol` | rich_text |
| Empresa | `empresa` | rich_text |
| LinkedIn | `linkedin` | url |
| Estado | `estado` | status (Aplicado / Confirmado / Realizado / Bloqueado) |
| Slot | `slots[]` | relation → Speaker Slots |

### Speaker Slots (`DB_SLOTS_ID`, alias legacy `DB_SESSIONS_ID`)
| Propiedad Notion | Campo código | Tipo |
|---|---|---|
| Título | `titulo` | title |
| Descripción | `descripcion` | rich_text |
| Fecha | `fecha` | date |
| Luma URL | `lumaUrl` | url |
| Meet URL | `webinarUrl` | url : link en vivo del meet |
| Webinar URL | `grabacionUrl` | url : grabación post-evento |
| Herramientas | `herramientas[]` | multi_select |
| Estado | `estado` | status |
| Fotos | `fotos[]` | files |
| Cover | `covers[]` | files : 6 covers: Instagram, Storie, LinkedIn, Cover 3, Cover 2, Cover 1 |

### Comunidad (`DB_COMUNIDAD_ID`)
Miembros de la comunidad: perfil, ubicación (mapa), tipo (miembro/admin).

### Proyectos (`DB_PROYECTOS_ID`, opcional)
Proyectos enviados por miembros desde `/cuenta/proyectos`.

### Bootcamp dates DB (`DB_BOOTCAMP_DATES_ID`)

Notion database: `39d2acb3e8858025a599e6bb30fb65e1`

| Propiedad Notion | Uso en código |
|---|---|
| `Nombre del programa` | title |
| `Fecha` | date (futuras) |
| `Modalidad` | select: `Virtual` / `Presencial` |
| `Estado` | status: `Confirmado` (opciones en Notion: Pendiente, Reservado, Confirmado, Cancelado) |
| `Persona` | relation → inscritos (cupos) |

La integración de Notion debe tener acceso a esta base de datos.

Inscripciones del checkout: la DB de destino se resuelve automáticamente desde la relación `Persona` (override opcional con `DB_BOOTCAMP_REGISTROS_ID`).

## Comandos
```bash
pnpm dev          # dev server en localhost:3000
pnpm typecheck    # tsc --noEmit
pnpm lint         # eslint
pnpm test         # vitest
vercel --prod     # deploy a producción
```

## Estructura del repo
```
app/
  page.tsx                        # Landing /
  comunidad/page.tsx              # Mapa público de miembros
  eventos/page.tsx                # Calendario de eventos
  cuenta/
    layout.tsx                    # Nav del portal miembro
    perfil/page.tsx
    mapa/page.tsx
    sesiones/page.tsx
    proyectos/page.tsx
    configuraciones/page.tsx
    admin/page.tsx
  portal/
    page.tsx                      # Portal del speaker (CharlaCards)
    charla/[slotId]/page.tsx      # Detalle de charla
    admin/page.tsx
  aplicar/
    page.tsx                      # Grid de slots disponibles
    [slotId]/page.tsx             # Formulario de postulación
  login/
    page.tsx                      # Login/registro comunidad
    sent/page.tsx
  programas/
    page.tsx                      # Índice programas
    profesionales/page.tsx        # Catálogo + Notion Bootcamp
    checkout/page.tsx             # Checkout bootcamp (Yape)
    empresas/page.tsx             # Coming soon
  verificando/page.tsx
  gracias/page.tsx
  api/
    auth/{request,verify,logout,status}/
    comunidad/{auth,register,perfil,proyectos,admin}/
    bootcamp/{fechas,inscripcion,encuesta}/
    slots/route.ts
    apply/route.ts
    download/route.ts
    newsletter/route.ts
    cron/{sync-luma,sync-novedades}/route.ts
components/
  landing/                        # WhatIsNotionSection, NotionProductsSection, etc.
  cuenta/                         # MemberProjectsPanel, CuentaNav, etc.
  programas/                      # CheckoutForm, BootcampFechaCard, etc.
  CharlaCard.tsx
  CoversGallery.tsx
  ui/                             # shadcn/ui
lib/
  notion/
    client.ts
    portal.ts
    slots.ts
    speakers.ts
    comunidad.ts
    proyectos.ts
    bootcamp.ts
  auth/
    session.ts                    # HMAC speaker cookie
    community-session.ts          # HMAC community cookie
    magic-link.ts
  content/
    bootcamp.ts                   # NOTION_BOOTCAMP, checkout URLs
  novedades/
    fetch-notion.ts               # RSS Notion blog
    get-novedades.ts
  seo/
    site.ts                       # SITE_NAME = "Notion Community Lima"
    analytics.ts                  # GA4 conversion events (pending GA4 setup)
  webhooks/newsletter.ts          # n8n webhook notion-lima-website
middleware.ts                     # Protege /portal/:path* y /cuenta/:path*
```

## Auth dual

| Audiencia | Login | Cookie | Rutas |
|---|---|---|---|
| Speakers | `/portal/login` | `aiff_session` | `/portal/**` |
| Comunidad | `/login` | `aiff_community_session` | `/cuenta/**` |

## Portal del speaker
- `/portal`: grid de charlas (`CharlaCard`)
- Cards: hover naranja (`border-orange-500/60 bg-orange-950/20`), B&W por defecto
- Botones por card: Luma · Meet · Ver grabación (si existe) · Ver más
- "Ver más" → `/portal/charla/[slotId]`

## Portal del miembro (`/cuenta`)
- Perfil, mapa, sesiones asistidas, proyectos, configuraciones
- Admin comunidad en `/cuenta/admin` (emails en `lib/config/community-roles.ts`)

## Notion Bootcamp
- Slug: `notion-bootcamp` (redirect 301 desde `claude-bootcamp`)
- Checkout: `/programas/checkout?programa=notion-bootcamp&modalidad=virtual|presencial&fecha=<id>`
- Referencia de pago Yape: prefijo `NCL-`

## Reglas
- TypeScript strict, sin `any`
- NOTION_TOKEN nunca llega al cliente : toda llamada a Notion es server-side
- Validar toda entrada con zod
- Commits convencionales: `feat:` / `fix:` / `chore:` / `docs:` / `test:`
- Nunca commitear `.env*`
- El proyecto Vercel es `notion-community-lima-website`
- GA4: `G-1D2VSCG9LR` via `NEXT_PUBLIC_GA_MEASUREMENT_ID` in Vercel

## Variables de entorno
```
NOTION_TOKEN
DB_SLOTS_ID
DB_SESSIONS_ID          # optional legacy alias
DB_SPEAKERS_ID
DB_COMUNIDAD_ID
DB_PROYECTOS_ID         # optional
DB_BOOTCAMP_DATES_ID
# optional: DB_BOOTCAMP_REGISTROS_ID
EMAIL_VERIFICATION_SECRET
CRON_SECRET
RESEND_API_KEY
RESEND_FROM_EMAIL=Notion Community Lima <hola@yourdomain.com>
RESEND_AUDIENCE_ID      # optional
NEXT_PUBLIC_BASE_URL=https://notion.mayckolco.com
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-1D2VSCG9LR
LUMA_API_KEY            # optional
LUMA_CALENDAR_ID        # optional
```
