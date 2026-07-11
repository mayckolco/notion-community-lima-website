"use client";

import { sendGAEvent } from "@next/third-parties/google";
import { GA_EVENTS } from "@/lib/seo/analytics";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WHATSAPP_COMMUNITY_URL } from "@/lib/content/constants";
import { cn } from "@/lib/utils";

interface JoinCommunityButtonProps {
  location: string;
  size?: "default" | "lg" | "sm";
  variant?: "default" | "outline" | "link";
  showArrow?: boolean;
  children?: React.ReactNode;
}

export function JoinCommunityButton({
  location,
  size = "lg",
  variant = "default",
  showArrow = true,
  children = "Únete a la comunidad",
}: JoinCommunityButtonProps) {
  const isCompact = size === "sm" || variant === "link";

  return (
    <Button
      size={size === "sm" ? "sm" : size === "lg" ? "lg" : "default"}
      variant={variant}
      className={cn(!isCompact && "min-h-[52px]", "touch-manipulation")}
      render={
        <a
          href={WHATSAPP_COMMUNITY_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => sendGAEvent("event", GA_EVENTS.joinCommunity, { location })}
        />
      }
    >
      {children}
      {showArrow && <ArrowRight className="h-5 w-5 ml-2" strokeWidth={1.75} />}
    </Button>
  );
}
