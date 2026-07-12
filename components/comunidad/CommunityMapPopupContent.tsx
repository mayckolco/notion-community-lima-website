import { ClaudeCodeLogo } from "@/components/comunidad/ClaudeCodeLogo";

interface CommunityMapPopupContentProps {
  ciudad: string;
  count: number;
}

export function CommunityMapPopupContent({
  ciudad,
  count,
}: CommunityMapPopupContentProps) {
  return (
    <div className="min-w-[7.5rem] rounded-lg bg-[#f5f0eb] px-4 py-3 text-center space-y-2">
      <div className="flex justify-center">
        <ClaudeCodeLogo className="h-9 w-9" />
      </div>
      <p className="font-serif text-lg leading-tight text-foreground">{ciudad}</p>
      <p className="text-muted-foreground text-sm">
        {count} {count === 1 ? "persona" : "personas"}
      </p>
    </div>
  );
}
