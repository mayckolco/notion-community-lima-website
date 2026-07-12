import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { ADMIN_SPEAKER_ID } from "@/lib/config/roles";
import { cn } from "@/lib/utils";

interface SpeakerPortalLinkProps {
  href?: string;
  className?: string;
  children: React.ReactNode;
}

export function SpeakerPortalLink({
  href = "/portal/login",
  className,
  children,
}: SpeakerPortalLinkProps) {
  const session = getSession();
  const targetHref = session
    ? session.speakerId === ADMIN_SPEAKER_ID
      ? "/portal/admin"
      : "/portal"
    : href;

  return (
    <Link href={targetHref} className={cn(className)}>
      {children}
    </Link>
  );
}
