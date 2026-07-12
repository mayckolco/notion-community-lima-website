const ALLOWED_HOSTS = [
  "notion.so",
  "amazonaws.com",
  "secure.notion-static.com",
  "prod-files-secure.s3",
];

export function isAllowedNotionFileUrl(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return ALLOWED_HOSTS.some(
      (host) => hostname === host || hostname.endsWith(`.${host}`)
    );
  } catch {
    return false;
  }
}

export function notionFileUrl(url: string): string {
  return `/api/file?url=${encodeURIComponent(url)}`;
}
