import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { getCommunitySession } from "@/lib/auth/community-session";
import { ADMIN_SPEAKER_ID } from "@/lib/config/roles";
import { Button } from "@/components/ui/button";

interface NavbarAuthButtonsProps {
  variant?: "desktop" | "mobile";
  onClose?: () => void;
}

function getSpeakerPortalHref(speakerId: string): string {
  return speakerId === ADMIN_SPEAKER_ID ? "/portal/admin" : "/portal";
}

export function NavbarAuthButtons({
  variant = "desktop",
  onClose,
}: NavbarAuthButtonsProps) {
  const speakerSession = getSession();
  const communitySession = getCommunitySession();

  const speakerHref = speakerSession
    ? getSpeakerPortalHref(speakerSession.speakerId)
    : "/portal/login";
  const speakerLabel = speakerSession ? "Mi portal" : "Soy speaker";

  const communityHref = communitySession ? "/cuenta/perfil" : "/login";
  const communityLabel = communitySession ? "Mi cuenta" : "Ingresar";

  if (variant === "mobile") {
    return (
      <div className="px-6 py-4 border-t border-border/60 space-y-3">
        <Button
          size="sm"
          className="w-full"
          render={<Link href={speakerHref} onClick={onClose} />}
        >
          {speakerLabel}
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="w-full"
          render={<Link href={communityHref} onClick={onClose} />}
        >
          {communityLabel}
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="hidden sm:block">
        <Button size="sm" render={<Link href={speakerHref} />}>
          {speakerLabel}
        </Button>
      </div>
      <Button size="sm" variant="outline" render={<Link href={communityHref} />}>
        {communityLabel}
      </Button>
    </>
  );
}
