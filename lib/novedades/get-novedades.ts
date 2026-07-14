import { unstable_cache } from "next/cache";
import { NOTION_NOVEDADES, type Novedad } from "@/lib/content/novedades";
import { fetchNotionNews } from "./fetch-notion";

export const NOVEDADES_CACHE_TAG = "notion-novedades";

async function loadNovedades(): Promise<Novedad[]> {
  const remote = await fetchNotionNews();
  if (remote.length === 0) return NOTION_NOVEDADES;

  const remoteUrls = new Set(remote.map((n) => n.url).filter(Boolean));
  const manual = NOTION_NOVEDADES.filter((n) => !n.url || !remoteUrls.has(n.url));

  return [...remote, ...manual].slice(0, 8);
}

export const getNovedades = unstable_cache(loadNovedades, ["notion-novedades"], {
  revalidate: 86400,
  tags: [NOVEDADES_CACHE_TAG],
});
