import { MetadataRoute } from "next";
import { listDirectorySpeakers } from "@/lib/notion/speakers";
import { PROGRAMAS_EMPRESAS_PUBLIC } from "@/lib/content/constants";
import { SITE_URL } from "@/lib/seo/site";

const STATIC_ROUTES: MetadataRoute.Sitemap = [
  { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
  { url: `${SITE_URL}/eventos`, changeFrequency: "weekly", priority: 0.9 },
  { url: `${SITE_URL}/comunidad`, changeFrequency: "weekly", priority: 0.85 },
  { url: `${SITE_URL}/recursos`, changeFrequency: "weekly", priority: 0.8 },
  { url: `${SITE_URL}/proyectos`, changeFrequency: "monthly", priority: 0.7 },
  { url: `${SITE_URL}/nosotros`, changeFrequency: "monthly", priority: 0.8 },
  { url: `${SITE_URL}/directorio`, changeFrequency: "weekly", priority: 0.8 },
  { url: `${SITE_URL}/aplicar`, changeFrequency: "weekly", priority: 0.9 },
  { url: `${SITE_URL}/programas`, changeFrequency: "monthly", priority: 0.7 },
  { url: `${SITE_URL}/programas/profesionales`, changeFrequency: "monthly", priority: 0.8 },
  ...(PROGRAMAS_EMPRESAS_PUBLIC
    ? [{ url: `${SITE_URL}/programas/empresas`, changeFrequency: "monthly" as const, priority: 0.7 }]
    : []),
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const speakers = await listDirectorySpeakers().catch(() => []);

  const speakerRoutes: MetadataRoute.Sitemap = speakers.map((speaker) => ({
    url: `${SITE_URL}/directorio/${speaker.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    ...STATIC_ROUTES.map((route) => ({ ...route, lastModified: now })),
    ...speakerRoutes,
  ];
}
