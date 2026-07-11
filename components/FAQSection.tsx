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
    <section className="border-t border-border/60 px-4 sm:px-6 py-12 sm:py-20">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-widest text-primary">FAQ</p>
          <h2 className="font-serif text-2xl sm:text-3xl tracking-tight">{title}</h2>
          {subtitle && (
            <p className="text-muted-foreground leading-relaxed">{subtitle}</p>
          )}
        </div>

        <div className="space-y-3">
          {faqs.map((faq) => (
            <details
              key={faq.id}
              className="group rounded-xl border border-border bg-card shadow-soft open:border-primary/30 transition-colors"
            >
              <summary className="cursor-pointer list-none px-5 py-4 font-medium text-sm sm:text-base flex items-center justify-between gap-4 touch-manipulation [&::-webkit-details-marker]:hidden">
                {faq.question}
                <span className="text-primary text-lg leading-none shrink-0 group-open:rotate-45 transition-transform">
                  +
                </span>
              </summary>
              <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-3">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
