"use client";

import { sendGAEvent } from "@next/third-parties/google";
import { GA_EVENTS } from "@/lib/seo/analytics";

interface RegisterEventLinkProps {
  href: string;
  slotId: string;
  className?: string;
  children: React.ReactNode;
}

export function RegisterEventLink({
  href,
  slotId,
  className,
  children,
}: RegisterEventLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() =>
        sendGAEvent("event", GA_EVENTS.registerEvent, { slot_id: slotId })
      }
    >
      {children}
    </a>
  );
}
