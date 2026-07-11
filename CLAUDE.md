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

Use `pnpm` exclusively — npm/yarn are blocked by package.json engines.

## Architecture

**Next.js 14 App Router** with TypeScript strict mode. Deployed on Vercel (`aiff-speakers` project).

**Production URL**: `https://speakers.mayckolco.com`

### Backend: Notion-only

Notion is the sole database. All Notion calls are server-side only — `NOTION_TOKEN` never reaches the client.

- `lib/notion/client.ts` — singleton Notion client + env var accessors (`getDbSlotsId`, `getDbSpeakersId`)
- `lib/notion/portal.ts` — `fetchSlot`, `PortalSpeaker`, `PortalSlot` types
- `lib/notion/slots.ts` — slot queries
- `lib/notion/speakers.ts` — speaker queries

**Notion DBs:**
- `DB_SPEAKERS_ID` — speakers with status: `Registrado / Confirmado / Realizado / Bloqueado`
- `DB_SLOTS_ID` — speaking slots with covers (6 images: Instagram, Storie, LinkedIn, Cover 3/2/1), photos, Luma URL, Meet URL, recording URL

### Auth: Magic Link

Flow: email → Resend → HMAC token → `aiff_session` cookie (7 days, httpOnly).

- `lib/auth/session.ts` — `createSessionToken`, `parseSessionToken`, `getSession` (HMAC SHA-256)
- `lib/auth/magic-link.ts` — token generation for email verification
- `middleware.ts` — Edge Runtime cookie presence check only (no crypto); full HMAC validation in Server Components via `getSession()`
- Protected routes: `/portal/**`

### API Routes (`app/api/`)

| Route | Purpose |
|---|---|
| `auth/request` | Send magic link email via Resend |
| `auth/verify` | Validate token, set session cookie |
| `auth/logout` | Clear session cookie |
| `slots/` | List available slots |
| `apply/` | Submit speaker application |
| `download/` | Proxy for Notion S3 file downloads (covers/photos) |
| `cron/sync-luma/` | Cron job to sync Luma event data |
| `verify/` | Email verification landing |

### Key Pages

| Route | Description |
|---|---|
| `/` | Landing page |
| `/aplicar` | Grid of available slots |
| `/aplicar/[slotId]` | Speaker application form |
| `/login` | Magic link login |
| `/verificando` | Token verification |
| `/portal` | Authenticated speaker portal (CharlaCards) |
| `/portal/charla/[slotId]` | Slot detail: date, Meet, recording, covers gallery, photos |
| `/portal/admin` | Admin area |
| `/directorio`, `/nosotros`, `/programas`, `/proyectos`, `/recursos`, `/calendario` | Community pages |

### Components

- `CharlaCard.tsx` — `"use client"`, hover orange style (`border-orange-500/60 bg-orange-950/20`), B&W default
- `CoversGallery.tsx` — `"use client"`, lightbox with Esc/←/→ navigation, downloads via `/api/download`
- `SpeakerForm.tsx` — react-hook-form + zod validation
- `ui/` — shadcn/ui components

### Data Validation

All user input validated with **zod**. Schemas in `lib/schemas.ts`.

## Rules

- `GUIA-PROYECTO.md` is the living development roadmap — when a feature is completed, added, or dropped, update its checklist in the same commit
- TypeScript strict — no `any`
- All Notion API calls must be server-side (Route Handlers or Server Components)
- Validate all input with zod at API boundaries
- `/api/download` is the required proxy for all Notion S3 file URLs (they expire and require CORS proxying)
- Fonts: Inter (`--font-sans`) + Fraunces (`--font-serif`)
- Vercel project name is `aiff-speakers` — do not create `speaker-platform`

## Environment Variables

```
NOTION_TOKEN
DB_SLOTS_ID=848e18913aa845048723cf4c158ee5a5
DB_SPEAKERS_ID=c0ab88424420478482abb29790b1a872
EMAIL_VERIFICATION_SECRET
CRON_SECRET
RESEND_API_KEY
RESEND_FROM_EMAIL=Claude Perú <hola@mayckolco.com>
NEXT_PUBLIC_BASE_URL=https://speakers.mayckolco.com
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-FGDCTV5ZEV
```
