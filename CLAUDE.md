# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev              # dev server on localhost:3000
pnpm build            # production build
pnpm lint             # ESLint
pnpm typecheck        # tsc --noEmit
pnpm test             # vitest (unit tests)
pnpm test:notion      # test Notion connection (scripts/test-notion.ts)
vercel --prod         # deploy to production
```

Use `pnpm` exclusively : npm/yarn are blocked by package.json engines.

## Architecture

**Next.js 14 App Router** with TypeScript strict mode. Deployed on Vercel (`notion-community-lima-website` project).

**Production URL**: `https://notion.mayckolco.com`

### Backend: Notion-only

Notion is the sole database. All Notion calls are server-side only : `NOTION_TOKEN` never reaches the client.

- `lib/notion/client.ts` : singleton Notion client + env var accessors
- `lib/notion/portal.ts` : `fetchSlot`, `PortalSpeaker`, `PortalSlot` types
- `lib/notion/slots.ts` : slot/event queries
- `lib/notion/speakers.ts` : speaker queries
- `lib/notion/comunidad.ts` : community members (`DB_COMUNIDAD_ID`)
- `lib/notion/proyectos.ts` : member projects (`DB_PROYECTOS_ID`, optional)
- `lib/notion/bootcamp.ts` : bootcamp dates and registrations

**Notion DBs:**
- `DB_SPEAKERS_ID` : speakers with status: `Aplicado / Confirmado / Realizado / Bloqueado`
- `DB_SLOTS_ID` : speaking slots with covers (6 images), photos, Luma URL, Meet URL, recording URL. Legacy alias: `DB_SESSIONS_ID`
- `DB_COMUNIDAD_ID` : community members (mapa, perfil, login)
- `DB_PROYECTOS_ID` : optional — member-submitted projects
- `DB_BOOTCAMP_DATES_ID` : bootcamp cohort dates
- Inscripciones bootcamp : DB resuelta desde relación `Persona` (override opcional `DB_BOOTCAMP_REGISTROS_ID`)

### Auth: Dual Magic Link

**Speakers** — email → Resend → HMAC token → `aiff_session` cookie (7 days, httpOnly):
- `lib/auth/session.ts` : `createSessionToken`, `parseSessionToken`, `getSession`
- Protected routes: `/portal/**` (except `/portal/login`)

**Comunidad** — email → Resend → HMAC token → `aiff_community_session` cookie:
- `lib/auth/community-session.ts` : `createCommunitySessionToken`, `getCommunitySession`
- Protected routes: `/cuenta/**`

- `lib/auth/magic-link.ts` : token generation for email verification
- `middleware.ts` : Edge Runtime cookie presence check only (no crypto); full HMAC validation in Server Components

### API Routes (`app/api/`)

| Route | Purpose |
|---|---|
| `auth/request`, `auth/verify`, `auth/logout` | Speaker magic link auth |
| `auth/status` | Session status check |
| `comunidad/auth/request`, `comunidad/auth/verify`, `comunidad/auth/logout` | Community magic link auth |
| `comunidad/register` | Community member registration |
| `comunidad/perfil` | Member profile CRUD |
| `comunidad/proyectos`, `comunidad/proyectos/[id]` | Member projects |
| `comunidad/admin` | Community admin actions |
| `slots/`, `slots/[slotId]/{meet,luma,grabacion,linkedin}` | Slot management |
| `apply/` | Submit speaker application |
| `bootcamp/fechas`, `bootcamp/inscripcion`, `bootcamp/encuesta` | Bootcamp checkout flow |
| `download/`, `file/` | Proxy for Notion S3 file downloads |
| `newsletter/` | Newsletter signup (Resend + n8n webhook `notion-lima-website`) |
| `cron/sync-luma/` | Cron job to sync Luma event data |
| `cron/sync-novedades/` | Cron job to sync Notion blog RSS |
| `verify/` | Email verification landing |

### Key Pages

| Route | Description |
|---|---|
| `/` | Landing page |
| `/comunidad` | Public community map |
| `/eventos` | Events calendar (301 from `/calendario`) |
| `/aplicar`, `/aplicar/[slotId]` | Speaker application |
| `/login`, `/login/sent` | Community registro/login (magic link) |
| `/cuenta/*` | Authenticated member portal (perfil, mapa, sesiones, proyectos, configuraciones, admin) |
| `/portal/login` | Speaker magic link login |
| `/portal`, `/portal/charla/[slotId]`, `/portal/admin` | Speaker portal |
| `/programas`, `/programas/profesionales`, `/programas/checkout` | Programs and bootcamp checkout |
| `/directorio`, `/nosotros`, `/recursos`, `/gracias`, `/verificando` | Community pages |

### Components

- `CharlaCard.tsx` : `"use client"`, hover orange style, B&W default
- `CoversGallery.tsx` : `"use client"`, lightbox with Esc/←/→ navigation, downloads via `/api/download`
- `SpeakerForm.tsx` : react-hook-form + zod validation
- `WhatIsNotionSection`, `NotionProductsSection`, `NotionNovedadesSection` : landing sections
- `ui/` : shadcn/ui components

### Data Validation

All user input validated with **zod**. Schemas in `lib/schemas.ts`.

## Rules

- `GUIA-PROYECTO.md` is the living development roadmap : when a feature is completed, added, or dropped, update its checklist in the same commit
- TypeScript strict : no `any`
- All Notion API calls must be server-side (Route Handlers or Server Components)
- Validate all input with zod at API boundaries
- `/api/download` is the required proxy for all Notion S3 file URLs (they expire and require CORS proxying)
- Fonts: Inter (`--font-sans`) + PT Serif (`--font-serif`) + VT323 (`--font-pixel`)
- Vercel project name is `notion-community-lima-website`
- GA4: `G-1D2VSCG9LR` via `NEXT_PUBLIC_GA_MEASUREMENT_ID` (Vercel production/preview/development)

## Environment Variables

```
NOTION_TOKEN
DB_SLOTS_ID
DB_SESSIONS_ID          # optional legacy alias for DB_SLOTS_ID
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
