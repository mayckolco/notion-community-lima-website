import type { Testimonial } from "@/lib/content/testimonials";
import { TESTIMONIALS } from "@/lib/content/testimonials";

function TestimonialCard({ name, text, initials, role }: Testimonial) {
  return (
    <article className="rounded-3xl border-2 border-foreground/80 bg-card p-6 shadow-soft space-y-4">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
          {initials}
        </span>
        <div className="min-w-0">
          <p className="font-semibold text-foreground truncate">{name}</p>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
            {role}
          </p>
        </div>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
    </article>
  );
}

function TestimonialColumn({
  items,
  direction,
  duration,
  className,
}: {
  items: Testimonial[];
  direction: "up" | "down";
  duration: number;
  className?: string;
}) {
  const loop = [...items, ...items];

  return (
    <div className={`relative flex-1 min-w-0 overflow-hidden ${className ?? ""}`}>
      <div
        className="flex flex-col gap-4"
        style={{
          animation: `${direction === "up" ? "marquee-up" : "marquee-down"} ${duration}s linear infinite`,
        }}
      >
        {loop.map((item, i) => (
          <TestimonialCard key={`${item.name}-${i}`} {...item} />
        ))}
      </div>
    </div>
  );
}

function splitIntoColumns(items: Testimonial[], columns: number): Testimonial[][] {
  const result: Testimonial[][] = Array.from({ length: columns }, () => []);
  items.forEach((item, i) => {
    result[i % columns].push(item);
  });
  return result;
}

export function TestimonialsMarquee() {
  const [col1, col2, col3] = splitIntoColumns(TESTIMONIALS, 3);

  return (
    <section aria-labelledby="testimonials-heading" className="border-t border-border/60 px-4 sm:px-6 py-12 sm:py-20">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="space-y-2 max-w-3xl">
          <p className="text-xs uppercase tracking-widest text-primary">Social proof</p>
          <h2 id="testimonials-heading" className="font-serif text-2xl sm:text-3xl lg:text-4xl tracking-tight text-balance">
            Opiniones reales de asistentes y speakers
          </h2>
        </div>

        <div
          aria-hidden="true"
          className="relative h-[520px] sm:h-[640px] overflow-hidden motion-reduce:[&_div]:![animation-play-state:paused]"
          style={{
            maskImage: "linear-gradient(to bottom, transparent, black 8%, black 92%, transparent)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent, black 8%, black 92%, transparent)",
          }}
        >
          <div className="flex gap-4 sm:gap-6 h-full">
            <TestimonialColumn items={col1} direction="up" duration={38} />
            <TestimonialColumn items={col2} direction="down" duration={44} className="hidden sm:block" />
            <TestimonialColumn items={col3} direction="up" duration={40} className="hidden lg:block" />
          </div>
        </div>
      </div>
    </section>
  );
}
