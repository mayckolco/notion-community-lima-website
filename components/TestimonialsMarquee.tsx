interface Testimonial {
  name: string;
  text: string;
  initials: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Ana Montero",
    initials: "AM",
    text: "Muy contenta con la metodología y la organización de los webinars. Es una comunidad completa y práctica, con casos reales de builders peruanos usando Claude.",
  },
  {
    name: "Rubén Triviño",
    initials: "RT",
    text: "Sin duda, una buenísima decisión unirme a Claude Perú. Aprendí a automatizar flujos con Claude Code y conectar APIs sin partir de cero.",
  },
  {
    name: "Jorge Cortizas",
    initials: "JC",
    text: "Me abrió un mundo nuevo de posibilidades. Tenía muchas ideas en la cabeza, pero sentía que estaba limitado por no saber por dónde empezar con IA.",
  },
  {
    name: "Diego Rodríguez",
    initials: "DR",
    text: "Asistí a un webinar sobre agentes con Claude y fue muy generoso en todos los sentidos: demos en vivo, recursos y tiempo para preguntas.",
  },
  {
    name: "Eva Palacios",
    initials: "EP",
    text: "Estoy muy satisfecha de haberme unido a esta comunidad. Me siento motivada para empezar a construir productos con Claude y compartir lo que aprendo.",
  },
  {
    name: "Wilkin Daniel",
    initials: "WD",
    text: "Muy buena experiencia para aprender Claude desde cero. Fue gratificante porque no tenía base previa y ahora ya tengo un proyecto en marcha.",
  },
  {
    name: "Jor Balda",
    initials: "JB",
    text: "Definitivamente recomiendo Claude Perú a cualquiera que quiera dar un salto de calidad construyendo con IA. La red de contactos vale oro.",
  },
  {
    name: "Lucía Vargas",
    initials: "LV",
    text: "Los meetups mensuales son lo mejor: conoces gente increíble, ves demos en vivo y sales con ideas concretas para tu próximo side project.",
  },
  {
    name: "Carlos Mendoza",
    initials: "CM",
    text: "La calidad de los speakers es altísima. Cada charla trae aprendizajes aplicables al día siguiente, no teoría abstracta.",
  },
];

function TestimonialCard({ name, text, initials }: Testimonial) {
  return (
    <article className="rounded-3xl border-2 border-foreground/80 bg-card p-6 shadow-soft space-y-4">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
          {initials}
        </span>
        <p className="font-semibold text-foreground">{name}</p>
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
    <section className="border-t border-border/60 px-4 sm:px-6 py-12 sm:py-20">
      <div className="max-w-6xl mx-auto space-y-10">
        <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl tracking-tight text-balance max-w-3xl">
          Opiniones reales de builders reales
        </h2>

        <div
          className="relative h-[520px] sm:h-[640px] overflow-hidden"
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
