import { ApifyClient } from "apify-client";

const ACTOR_ID = process.env.APIFY_LINKEDIN_ACTOR ?? "harvestapi/linkedin-profile-scraper";

export interface LinkedInProfile {
  fullName: string | null;
  headline: string | null;
  summary: string | null;
  profilePicture: string | null;
  skills: string[];
  url: string;
}

interface HarvestExperience {
  position?: string;
  companyName?: string;
  duration?: string;
  description?: string | null;
  location?: string;
  startDate?: { month?: string; year?: number; text?: string };
  endDate?: { month?: string; year?: number; text?: string } | null;
}

interface HarvestEducation {
  schoolName?: string;
  degree?: string;
  fieldOfStudy?: string | null;
  period?: string;
  startDate?: { month?: string; year?: number; text?: string };
  endDate?: { month?: string; year?: number; text?: string } | null;
}

interface HarvestRawResult {
  firstName?: string;
  lastName?: string;
  headline?: string;
  about?: string;
  photo?: string;
  skills?: Array<{ name?: string } | string>;
  experience?: HarvestExperience[];
  education?: HarvestEducation[];
}

export interface LinkedInFullData {
  fullName: string | null;
  headline: string | null;
  summary: string | null;
  profilePicture: string | null;
  skills: string[];
  experience: HarvestExperience[];
  education: HarvestEducation[];
  url: string;
}

export async function startLinkedInScrapeAsync(
  linkedinUrl: string,
  webhookUrl: string
): Promise<void> {
  const token = process.env.APIFY_TOKEN;
  if (!token) return;

  const client = new ApifyClient({ token });

  const run = await client.actor(ACTOR_ID).start({
    urls: [{ url: linkedinUrl }],
  });

  await client.webhooks().create({
    eventTypes: ["ACTOR.RUN.SUCCEEDED"],
    requestUrl: webhookUrl,
    condition: { actorRunId: run.id },
  });
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

  const raw = items[0] as HarvestRawResult;
  if ((raw as Record<string, unknown>).error) return null;

  return rawToProfile(raw, linkedinUrl);
}

export function rawToFullData(raw: HarvestRawResult, url: string): LinkedInFullData {
  const profile = rawToProfile(raw, url);
  return {
    ...profile,
    experience: raw.experience ?? [],
    education: raw.education ?? [],
  };
}

function rawToProfile(raw: HarvestRawResult, url: string): LinkedInProfile {
  const fullName = [raw.firstName, raw.lastName].filter(Boolean).join(" ") || null;
  const skills = (raw.skills ?? []).map((s) =>
    typeof s === "string" ? s : (s.name ?? "")
  ).filter(Boolean);

  return {
    fullName,
    headline: raw.headline ?? null,
    summary: raw.about ?? null,
    profilePicture: raw.photo ?? null,
    skills,
    url,
  };
}
