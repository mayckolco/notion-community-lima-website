const LUMA_BASE = "https://api.lu.ma/public/v1";

export interface LumaEvent {
  api_id: string;
  name: string;
  start_at: string;
  end_at: string;
  url: string;
}

export async function listLumaEvents(calendarId: string, apiKey: string): Promise<LumaEvent[]> {
  const params = new URLSearchParams({
    calendar_api_id: calendarId,
    pagination_limit: "50",
  });

  const res = await fetch(`${LUMA_BASE}/calendar/list-events?${params}`, {
    headers: {
      "x-luma-api-key": apiKey,
    },
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    throw new Error(`Luma API error: ${res.status} ${await res.text()}`);
  }

  const data = (await res.json()) as { entries?: Array<{ event: LumaEvent }> };
  return (data.entries ?? []).map((e) => e.event);
}
