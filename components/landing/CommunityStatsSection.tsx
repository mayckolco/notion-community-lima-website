import { Calendar, Mic, Users } from "lucide-react";

interface CommunityStatsSectionProps {
  speakerCount: number;
  eventCount: number;
}

const STATS_CONFIG = [
  {
    key: "speakers",
    icon: Mic,
    getValue: (props: CommunityStatsSectionProps) => props.speakerCount,
    label: "Speakers",
    suffix: "+",
  },
  {
    key: "events",
    icon: Calendar,
    getValue: (props: CommunityStatsSectionProps) => props.eventCount,
    label: "Charlas realizadas",
    suffix: "+",
  },
  {
    key: "community",
    icon: Users,
    getValue: () => 500,
    label: "Miembros en WhatsApp",
    suffix: "+",
  },
] as const;

export function CommunityStatsSection({
  speakerCount,
  eventCount,
}: CommunityStatsSectionProps) {
  const props = { speakerCount, eventCount };

  return (
    <section className="border-t border-border/60 px-4 sm:px-6 py-12 sm:py-16">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {STATS_CONFIG.map(({ key, icon: Icon, getValue, label, suffix }) => (
            <div
              key={key}
              className="rounded-xl border border-border bg-card p-6 text-center shadow-soft space-y-2"
            >
              <div className="flex justify-center">
                <span className="grid h-9 w-9 place-items-center rounded-md bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
              </div>
              <p className="font-serif text-3xl sm:text-4xl text-primary tabular-nums">
                {getValue(props)}
                {suffix}
              </p>
              <p className="text-sm text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
