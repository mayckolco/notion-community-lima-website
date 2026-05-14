import { ApifyClient } from "apify-client";

const ACTOR_ID = process.env.APIFY_LINKEDIN_ACTOR ?? "supreme_coder/linkedin-profile-scraper";

export interface LinkedInProfile {
  fullName: string | null;
  headline: string | null;
  summary: string | null;
  profilePicture: string | null;
  skills: string[];
  url: string;
}

interface ApifyRawResult {
  firstName?: string;
  lastName?: string;
  headline?: string;
  summary?: string;
  pictureUrl?: string;
  skills?: Array<{ name?: string } | string>;
  inputUrl?: string;
}

export async function scrapeLinkedInProfile(
  linkedinUrl: string
): Promise<LinkedInProfile | null> {
  const token = process.env.APIFY_TOKEN;
  if (!token) throw new Error("APIFY_TOKEN is not set");

  const client = new ApifyClient({ token });

  const run = await client.actor(ACTOR_ID).call({
    urls: [{ url: linkedinUrl }],
  });

  const { items } = await client.dataset(run.defaultDatasetId).listItems();

  if (!items.length) return null;

  const raw = items[0] as ApifyRawResult;

  const fullName = [raw.firstName, raw.lastName].filter(Boolean).join(" ") || null;

  const skills = (raw.skills ?? []).map((s) =>
    typeof s === "string" ? s : (s.name ?? "")
  ).filter(Boolean);

  return {
    fullName,
    headline: raw.headline ?? null,
    summary: raw.summary ?? null,
    profilePicture: raw.pictureUrl ?? null,
    skills,
    url: linkedinUrl,
  };
}
