import { addWeeks, getDay, isAfter, isBefore, parseISO, setHours } from "date-fns";
import { listLumaEvents } from "./client";
import { nextTuesdays } from "@/lib/dates";
import { upsertSlot } from "@/lib/notion/slots";

export async function syncTuesdays(): Promise<{ synced: number; created: number }> {
  const now = new Date();
  const until = addWeeks(now, 8);
  const upcomingTuesdays = nextTuesdays(8, now);

  let synced = 0;
  let created = 0;

  const lumaKey = process.env.LUMA_API_KEY;
  const lumaCalendarId = process.env.LUMA_CALENDAR_ID;

  const lumaEventsByDate = new Map<string, { id: string; url: string }>();

  if (lumaKey && lumaCalendarId) {
    try {
      const events = await listLumaEvents(lumaCalendarId, lumaKey);

      for (const event of events) {
        const start = parseISO(event.start_at);
        if (!isAfter(start, now) || !isBefore(start, until)) continue;
        if (getDay(start) !== 2) continue; // Only Tuesdays

        const dateKey = setHours(start, 19).toISOString().slice(0, 16);
        lumaEventsByDate.set(dateKey, { id: event.api_id, url: event.url });
      }
    } catch (err) {
      console.error("[sync-luma] Luma API unavailable, proceeding without it:", err);
    }
  }

  for (const tuesday of upcomingTuesdays) {
    const dateKey = tuesday.toISOString().slice(0, 16);
    const lumaData = lumaEventsByDate.get(dateKey);

    await upsertSlot({
      fecha: tuesday.toISOString(),
      lumaEventId: lumaData?.id,
      lumaUrl: lumaData?.url,
    });

    if (lumaData) {
      synced++;
    } else {
      created++;
    }
  }

  return { synced, created };
}
