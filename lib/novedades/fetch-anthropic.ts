import type { Novedad, NovedadTag } from "@/lib/content/novedades";

const RSS_URLS = [
  "https://www.anthropic.com/index.xml",
  "https://www.anthropic.com/rss.xml",
  "https://www.anthropic.com/news/rss",
];

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseRssItems(xml: string): Array<{
  title: string;
  link: string;
  description: string;
  pubDate: string;
}> {
  const items: Array<{
    title: string;
    link: string;
    description: string;
    pubDate: string;
  }> = [];

  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match: RegExpExecArray | null;

  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    const title = block.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i)?.[1]?.trim();
    const link = block.match(/<link>([\s\S]*?)<\/link>/i)?.[1]?.trim();
    const description =
      block.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i)?.[1]?.trim() ?? "";
    const pubDate = block.match(/<pubDate>([\s\S]*?)<\/pubDate>/i)?.[1]?.trim() ?? "";

    if (title && link) {
      items.push({
        title: stripHtml(title),
        link,
        description: stripHtml(description),
        pubDate,
      });
    }
  }

  return items;
}

function inferTag(title: string, description: string): NovedadTag {
  const text = `${title} ${description}`.toLowerCase();
  if (text.includes("api") || text.includes("sdk") || text.includes("mcp")) return "api";
  if (text.includes("security") || text.includes("seguridad") || text.includes("safety")) return "seguridad";
  if (text.includes("claude code") || text.includes("product") || text.includes("feature")) return "producto";
  return "modelo";
}

function toIsoDate(pubDate: string): string {
  const parsed = new Date(pubDate);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().split("T")[0];
  }
  return new Date().toISOString().split("T")[0];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

export async function fetchAnthropicNews(): Promise<Novedad[]> {
  for (const url of RSS_URLS) {
    try {
      const res = await fetch(url, {
        headers: { Accept: "application/rss+xml, application/xml, text/xml" },
        next: { revalidate: 86400 },
      });
      if (!res.ok) continue;

      const xml = await res.text();
      const items = parseRssItems(xml);
      if (items.length === 0) continue;

      return items.slice(0, 6).map((item) => ({
        id: `anthropic-${slugify(item.title)}`,
        fecha: toIsoDate(item.pubDate),
        titulo: item.title,
        resumen: item.description.slice(0, 280) || "Novedad de Anthropic.",
        url: item.link,
        tag: inferTag(item.title, item.description),
      }));
    } catch {
      continue;
    }
  }

  return [];
}
