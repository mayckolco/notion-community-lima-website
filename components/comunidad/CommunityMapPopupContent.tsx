interface CommunityMapPopupContentProps {
  ciudad: string;
  count: number;
}

export function CommunityMapPopupContent({
  ciudad,
  count,
}: CommunityMapPopupContentProps) {
  return (
    <div className="min-w-[8.5rem] px-1 py-0.5 text-center">
      <p className="font-serif text-xl font-semibold leading-tight text-[#2B2622]">
        {ciudad}
      </p>
      <p className="mt-1 text-sm text-[#6B6560]">
        {count} {count === 1 ? "persona" : "personas"}
      </p>
    </div>
  );
}
