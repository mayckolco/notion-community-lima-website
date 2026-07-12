export type CommunityRole = "miembro" | "admin";

const COMMUNITY_ADMIN_EMAILS: string[] = [
  "mayckolco@gmail.com",
];

export function isCommunityAdminEmail(email: string): boolean {
  return COMMUNITY_ADMIN_EMAILS.includes(email.toLowerCase().trim());
}

export function resolveCommunityRole(
  email: string,
  notionTipo: string | null
): CommunityRole {
  if (isCommunityAdminEmail(email)) return "admin";
  if (notionTipo?.toLowerCase() === "admin") return "admin";
  return "miembro";
}
