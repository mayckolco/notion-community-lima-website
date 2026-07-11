import type { FAQItem } from "@/lib/content/faq";

interface FAQSectionProps {
  faqs: FAQItem[];
  title?: string;
  subtitle?: string;
}

export function FAQSection({
  faqs,
  title = "Preguntas frecuentes",
  subtitle,
}: FAQSectionProps) {
  return (
    <section aria-labelledby="faq-heading" className="border-t border-border/60 px-4 sm:px-6 py-12 sm:py-20">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-widest text-primary">FAQ</p>
          <h2 id="faq-heading" className="font-serif text-2xl sm:text-3xl tracking-tight">{title}</h2>
          {subtitle && (
            <p className="text-muted-foreground leading-relaxed">{subtitle}</p>
          )}
        </div>

        <div className="space-y-3" role="list">
          {faqs.map((faq) => (
            <details
              key={faq.id}
              role="listitem"
              className="group rounded-xl border border-border bg-card shadow-soft open:border-primary/30 transition-colors duration-200"
            >
              <summary className="cursor-pointer list-none px-5 py-4 font-medium text-sm sm:text-base flex items-center justify-between gap-4 touch-manipulation select-none [&::-webkit-details-marker]:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 rounded-xl">
                <span>{faq.question}</span>
                <span
                  aria-hidden="true"
                  className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-border/60 text-primary text-sm leading-none group-open:rotate-45 transition-transform duration-200"
                >
                  +
                </span>
              </summary>
              <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-3">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
