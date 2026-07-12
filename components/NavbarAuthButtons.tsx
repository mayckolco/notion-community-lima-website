"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface AuthStatus {
  speaker: { href: string } | null;
  community: { href: string } | null;
}

interface NavbarAuthButtonsProps {
  variant?: "desktop" | "mobile";
  onClose?: () => void;
}

export function NavbarAuthButtons({
  variant = "desktop",
  onClose,
}: NavbarAuthButtonsProps) {
  const [status, setStatus] = useState<AuthStatus | null>(null);

  useEffect(() => {
    fetch("/api/auth/status", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: AuthStatus | null) => setStatus(data))
      .catch(() => setStatus({ speaker: null, community: null }));
  }, []);

  const speakerHref = status?.speaker?.href ?? "/portal/login";
  const speakerLabel = status?.speaker ? "Mi portal" : "Soy speaker";
  const communityHref = status?.community?.href ?? "/login";
  const communityLabel = status?.community ? "Mi cuenta" : "Ingresar";

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
