import { ApifyClient } from "apify-client";

// Actor configurable — por defecto: curious_coder/linkedin-profile-scraper
// Puedes cambiarlo con APIFY_LINKEDIN_ACTOR en .env.local
const ACTOR_ID = process.env.APIFY_LINKEDIN_ACTOR ?? "2SyF0bVxmgGr8IVCZ";

export interface LinkedInProfile {
  fullName: string | null;
  headline: string | null;
  summary: string | null;
  profilePicture: string | null;
  skills: string[];
  url: string;
}

interface ApifyRawResult {
  fullName?: string;
  firstName?: string;
  lastName?: string;
  headline?: string;
  summary?: string;
  about?: string;
  profilePicture?: string;
  photoUrl?: string;
  imgUrl?: string;
  skills?: Array<{ name?: string } | string>;
  linkedInUrl?: string;
  url?: string;
}

export async function scrapeLinkedInProfile(
  linkedinUrl: string
): Promise<LinkedInProfile | null> {
  const token = process.env.APIFY_TOKEN;
  if (!token) throw new Error("APIFY_TOKEN is not set");

  const client = new ApifyClient({ token });

  const run = await client.actor(ACTOR_ID).call({
    profileUrls: [linkedinUrl],
  });

  const { items } = await client.dataset(run.defaultDatasetId).listItems();

  if (!items.length) return null;

  const raw = items[0] as ApifyRawResult;

  const joinedName = [raw.firstName, raw.lastName].filter(Boolean).join(" ");
  const fullName = raw.fullName ?? (joinedName || null);

  const skills = (raw.skills ?? []).map((s) =>
    typeof s === "string" ? s : (s.name ?? "")
  ).filter(Boolean);

  return {
    fullName,
    headline: raw.headline ?? null,
    summary: raw.summary ?? raw.about ?? null,
    profilePicture: raw.profilePicture ?? raw.photoUrl ?? raw.imgUrl ?? null,
    skills,
    url: linkedinUrl,
  };
}
