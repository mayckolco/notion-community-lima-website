# AIFF Speakers — AGENTS.md

Plataforma de postulación de speakers para AI First Founders.
Notion es el único backend (sin DB externa). La web pública lee/escribe vía Notion API.

## Stack
- Next.js 14 (App Router) + TypeScript strict
- Tailwind + shadcn/ui (nova-base)
- Notion API (`@notionhq/client` v5) como único backend
- Vercel (hosting + cron functions)

## Base de datos Notion
- `Speaker Slots` → DB_SLOTS_ID = `848e18913aa845048723cf4c158ee5a5`
- `Speakers`      → DB_SPEAKERS_ID = `c0ab88424420478482abb29790b1a872`

## Comandos
- `pnpm dev`        — dev server en localhost:3000
- `pnpm typecheck`  — tsc --noEmit
- `pnpm lint`       — eslint
- `pnpm test`       — vitest
- `pnpm test:notion`— corre scripts/test-notion.ts

## Estructura del repo
```
app/
  page.tsx                  # Landing /
  postular/
    page.tsx                # Grid de 8 slots disponibles
    [slotId]/page.tsx       # Formulario del speaker
  gracias/page.tsx          # Confirmación post-envío
  api/
    slots/route.ts          # GET — lista slots próximos 8 semanas
    apply/route.ts          # POST — reserva + crea Speaker en Notion
    cron/sync-luma/route.ts # Cron cada hora — sincroniza con Luma
components/
  SlotCard.tsx
  SpeakerForm.tsx
  PhotoUpload.tsx
  ui/                       # shadcn/ui components
lib/
  notion/
    client.ts               # singleton @notionhq/client
    slots.ts                # listSlots, getSlot, lockSlot
    speakers.ts             # createSpeaker, uploadPhoto
  luma/
    client.ts               # Luma API client
    sync.ts                 # syncTuesdays()
  dates.ts                  # nextTuesdays(n)
  schemas.ts                # zod schemas
scripts/
  test-notion.ts            # valida conexión a Notion
```

## Reglas
- TypeScript strict, sin `any`.
- NOTION_TOKEN nunca llega al cliente — toda llamada a Notion es server-side via API routes.
- Validar toda entrada de usuario con zod.
- Anti-race en /api/apply: re-leer slot antes de bloquearlo; si otro ganó la carrera, archivar Speaker recién creado y devolver 409.
- Commits convencionales: feat: / fix: / chore: / docs: / test:
- Nunca commitear .env*

## Variables de entorno requeridas
```
NOTION_TOKEN=secret_xxx
DB_SLOTS_ID=848e18913aa845048723cf4c158ee5a5
DB_SPEAKERS_ID=c0ab88424420478482abb29790b1a872
LUMA_API_KEY=          # opcional — si tienes Luma Plus
LUMA_CALENDAR_ID=      # opcional
CRON_SECRET=           # para proteger el endpoint del cron
```
