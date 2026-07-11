import { unstable_cache } from "next/cache";
import { CLAUDE_NOVEDADES, type Novedad } from "@/lib/content/novedades";
import { fetchAnthropicNews } from "./fetch-anthropic";

export const NOVEDADES_CACHE_TAG = "anthropic-novedades";

async function loadNovedades(): Promise<Novedad[]> {
  const remote = await fetchAnthropicNews();
  if (remote.length === 0) return CLAUDE_NOVEDADES;

  const remoteUrls = new Set(remote.map((n) => n.url).filter(Boolean));
  const manual = CLAUDE_NOVEDADES.filter((n) => !n.url || !remoteUrls.has(n.url));

  return [...remote, ...manual].slice(0, 8);
}

export const getNovedades = unstable_cache(loadNovedades, ["anthropic-novedades"], {
  revalidate: 86400,
  tags: [NOVEDADES_CACHE_TAG],
});
