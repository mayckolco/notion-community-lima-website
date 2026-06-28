# AIFF Speakers — AGENTS.md

Plataforma de speakers para AI First Founders.
Notion es el único backend. La web lee/escribe vía Notion API.

**Producción**: `https://speakers.mayckolco.com`
**Vercel project**: `aiff-speakers` (`prj_ktuUoksDJ2iz4Ro24LQAcUfSWE8i`)
**Repo GitHub**: `mayckolco/aiff-speakers`

## Stack
- Next.js 14 (App Router) + TypeScript strict
- Tailwind + shadcn/ui
- Notion API (`@notionhq/client` v5) como único backend
- Auth: magic link via Resend + HMAC session cookie (`aiff_session`)
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

### Speaker Slots (`DB_SLOTS_ID`)
| Propiedad Notion | Campo código | Tipo |
|---|---|---|
| Título | `titulo` | title |
| Descripción | `descripcion` | rich_text |
| Fecha | `fecha` | date |
| Luma URL | `lumaUrl` | url |
| Meet URL | `webinarUrl` | url — link en vivo del meet |
| Webinar URL | `grabacionUrl` | url — grabación post-evento |
| Herramientas | `herramientas[]` | multi_select |
| Estado | `estado` | status |
| Fotos | `fotos[]` | files |
| Cover | `covers[]` | files — 6 covers: Instagram, Storie, LinkedIn, Cover 3, Cover 2, Cover 1 |

## Comandos
```bash
pnpm dev          # dev server en localhost:3000
pnpm tsc --noEmit # type check
pnpm lint         # eslint
pnpm test         # vitest
vercel --prod     # deploy a producción
```

## Estructura del repo
```
app/
  page.tsx                        # Landing /
  portal/
    page.tsx                      # Portal del speaker (SpeakerHeader + CharlaCards)
    charla/[slotId]/page.tsx      # Detalle de charla (fecha, meet, grabación, covers, agenda)
  aplicar/
    page.tsx                      # Grid de slots disponibles
    [slotId]/page.tsx             # Formulario de postulación
  login/
    page.tsx                      # Login magic link
    sent/page.tsx
  verificando/page.tsx            # Verificación de token
  gracias/page.tsx
  api/
    auth/{request,verify,logout}/ # Auth magic link
    slots/route.ts
    apply/route.ts
    download/route.ts             # Proxy descarga archivos Notion S3
    cron/sync-luma/route.ts
components/
  CharlaCard.tsx                  # "use client" — tarjeta de charla con hover naranja
  CoversGallery.tsx               # "use client" — lightbox + descarga de covers
  SlotCard.tsx
  SpeakerForm.tsx
  PhotoUpload.tsx
  ui/                             # shadcn/ui
lib/
  notion/
    client.ts
    portal.ts                     # PortalSpeaker, PortalSlot, fetchSlot (exported)
    slots.ts
    speakers.ts
  auth/
    session.ts                    # HMAC session cookie
    magic-link.ts
  email.ts
  luma/
  schemas.ts
  utils.ts
middleware.ts                     # Protege /portal/:path*
```

## Portal del speaker
- `/portal`: solo `SpeakerHeader` + grid de charlas (`CharlaCard`)
- Cards: hover naranja (`border-orange-500/60 bg-orange-950/20`), B&W por defecto
- Botones por card: Luma · Meet · Ver grabación (si existe) · Ver más
- "Ver más" → navega a `/portal/charla/[slotId]`

## Página de detalle de charla
- Valida que el slot pertenezca al speaker autenticado
- Secciones: header, fecha y accesos (3 cols: Luma / Meet / Grabación), covers gallery, fotos, placeholders futuros, agenda
- Botón "Volver al portal" → `bg-orange-500`
- Covers: grid 2×3, lightbox con Esc/←/→, descarga via `/api/download` (proxy)

## Reglas
- TypeScript strict, sin `any`
- NOTION_TOKEN nunca llega al cliente — toda llamada a Notion es server-side
- Validar toda entrada con zod
- Commits convencionales: `feat:` / `fix:` / `chore:` / `docs:` / `test:`
- Nunca commitear `.env*`
- El proyecto Vercel es `aiff-speakers` — no crear `speaker-platform` (fue eliminado)

## Variables de entorno
```
NOTION_TOKEN
DB_SLOTS_ID=848e18913aa845048723cf4c158ee5a5
DB_SPEAKERS_ID=c0ab88424420478482abb29790b1a872
EMAIL_VERIFICATION_SECRET
CRON_SECRET
RESEND_API_KEY
RESEND_FROM_EMAIL=AI First Founders <hola@mayckolco.com>
NEXT_PUBLIC_BASE_URL=https://speakers.mayckolco.com
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-FGDCTV5ZEV
```
