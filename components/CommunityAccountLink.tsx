import Link from "next/link";
import { getCommunitySession } from "@/lib/auth/community-session";
import { cn } from "@/lib/utils";

interface CommunityAccountLinkProps {
  href?: string;
  loggedInHref?: string;
  className?: string;
  children: React.ReactNode;
}

export function CommunityAccountLink({
  href = "/login",
  loggedInHref = "/cuenta/perfil",
  className,
  children,
}: CommunityAccountLinkProps) {
  const session = getCommunitySession();
  const targetHref = session ? loggedInHref : href;

  return (
    <Link href={targetHref} className={cn(className)}>
      {children}
    </Link>
  );
}
