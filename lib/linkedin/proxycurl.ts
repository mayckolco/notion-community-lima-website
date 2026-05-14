export interface PCDate { day?: number; month?: number; year?: number }

export interface PCExperience {
  title?: string;
  company?: string;
  description?: string | null;
  location?: string | null;
  starts_at?: PCDate | null;
  ends_at?: PCDate | null;
}

export interface PCEducation {
  school?: string;
  degree_name?: string | null;
  field_of_study?: string | null;
  starts_at?: PCDate | null;
  ends_at?: PCDate | null;
}

export interface PCProfile {
  fullName: string | null;
  headline: string | null;
  summary: string | null;
  profilePicture: string | null;
  skills: string[];
  experiences: PCExperience[];
  educations: PCEducation[];
  url: string;
}

export async function scrapeLinkedIn(url: string): Promise<PCProfile | null> {
  const apiKey = process.env.PROXYCURL_API_KEY;
  if (!apiKey) return null;

  const params = new URLSearchParams({
    linkedin_profile_url: url,
    use_cache: "if-present",
    fallback_to_cache: "on-error",
  });

  let res: Response;
  try {
    res = await fetch(`https://nubela.co/proxycurl/api/v2/linkedin?${params}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
      signal: AbortSignal.timeout(8000),
    });
  } catch {
    return null;
  }

  if (!res.ok) return null;

  const data = await res.json() as Record<string, unknown>;
  if (!data.first_name && !data.full_name) return null;

  const skills = ((data.skills ?? []) as Array<string | { name?: string }>)
    .map((s) => (typeof s === "string" ? s : (s.name ?? "")))
    .filter(Boolean);

  return {
    fullName: (data.full_name as string | undefined) ?? ([data.first_name, data.last_name].filter(Boolean).join(" ") || null),
    headline: (data.headline as string) ?? null,
    summary: (data.summary as string) ?? null,
    profilePicture: (data.profile_pic_url as string) ?? null,
    skills,
    experiences: (data.experiences as PCExperience[]) ?? [],
    educations: (data.education as PCEducation[]) ?? [],
    url: url,
  };
}
