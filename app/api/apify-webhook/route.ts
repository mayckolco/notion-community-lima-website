import { NextRequest, NextResponse } from "next/server";
import { ApifyClient } from "apify-client";
import { appendLinkedInContent, updateSpeakerBio } from "@/lib/notion/speakers";

interface ApifyWebhookPayload {
  eventType: string;
  eventData?: {
    actorRunDefaultDatasetId?: string;
  };
}

interface HarvestRawResult {
  headline?: string;
  about?: string;
  experience?: unknown[];
  education?: unknown[];
  error?: string;
}

export async function POST(req: NextRequest) {
  const speakerId = req.nextUrl.searchParams.get("speakerId");
  if (!speakerId) {
    return NextResponse.json({ error: "missing speakerId" }, { status: 400 });
  }

  const token = process.env.APIFY_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "no token" }, { status: 500 });
  }

  let payload: ApifyWebhookPayload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }

  if (payload.eventType !== "ACTOR.RUN.SUCCEEDED") {
    return NextResponse.json({ ok: true });
  }

  const datasetId = payload.eventData?.actorRunDefaultDatasetId;
  if (!datasetId) {
    return NextResponse.json({ error: "no dataset" }, { status: 400 });
  }

  const client = new ApifyClient({ token });
  const { items } = await client.dataset(datasetId).listItems();

  if (!items.length) return NextResponse.json({ ok: true });

  const raw = items[0] as HarvestRawResult;

  if (raw.error) {
    console.error("[apify-webhook] actor returned error:", raw.error);
    return NextResponse.json({ ok: true });
  }

  const bio = raw.about;

  if (bio) {
    await updateSpeakerBio(speakerId, bio).catch((e) =>
      console.error("[apify-webhook] updateSpeakerBio failed:", e.message)
    );
  }

  await appendLinkedInContent(speakerId, {
    headline: raw.headline,
    summary: bio,
    positions: raw.experience as Parameters<typeof appendLinkedInContent>[1]["positions"],
    educations: raw.education as Parameters<typeof appendLinkedInContent>[1]["educations"],
  }).catch((e) =>
    console.error("[apify-webhook] appendLinkedInContent failed:", e.message, JSON.stringify(e.body ?? e.code))
  );

  return NextResponse.json({ ok: true });
}
