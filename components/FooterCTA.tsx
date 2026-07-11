import { JoinCommunityButton } from "@/components/JoinCommunityButton";
import { NewsletterForm } from "@/components/NewsletterForm";

export function FooterCTA() {
  return (
    <div className="border-b border-border/60 bg-primary/[0.04]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-start">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-widest text-primary">Comunidad</p>
            <h2 className="font-serif text-2xl sm:text-3xl tracking-tight text-balance">
              Únete a los builders que ya construyen con{" "}
              <span className="gradient-text">Claude</span>
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
              Webinars semanales, meetups en Lima y una red de founders peruanos
              usando IA en producción.
            </p>
            <JoinCommunityButton location="footer_cta" />
          </div>

          <div className="space-y-3 rounded-xl border border-border bg-card p-5 sm:p-6 shadow-soft">
            <p className="text-xs uppercase tracking-widest text-primary">Newsletter</p>
            <h3 className="font-serif text-lg">No te pierdas nada</h3>
            <NewsletterForm location="footer" />
          </div>
        </div>
      </div>
    </div>
  );
}
