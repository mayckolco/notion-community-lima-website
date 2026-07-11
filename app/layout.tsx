import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600"],
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://claude.mayckolco.com"),
  title: {
    default: "Claude Community",
    template: "%s · Claude Community",
  },
  description:
    "La comunidad peruana de builders que construyen con Claude. Webinars cada lunes, meetups en Lima y networking con founders de IA en Perú.",
  keywords: ["Claude", "Anthropic", "inteligencia artificial", "IA", "Perú", "Lima", "comunidad", "builders", "founders", "webinars"],
  authors: [{ name: "Claude Community" }],
  creator: "Claude Community",
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: "https://claude.mayckolco.com",
    siteName: "Claude Community",
    title: "Claude Community",
    description:
      "La comunidad peruana de builders que construyen con Claude. Webinars cada lunes, meetups en Lima y networking con founders de IA en Perú.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Claude Community" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Claude Community",
    description:
      "La comunidad peruana de builders que construyen con Claude. Webinars cada lunes, meetups en Lima y networking con founders de IA en Perú.",
    images: ["/opengraph-image"],
  },
  alternates: {
    canonical: "https://claude.mayckolco.com",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="min-h-screen bg-background text-foreground font-sans antialiased">
        {children}
        <WhatsAppButton />
        <Toaster />
        <Analytics />
      </body>
      {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
      )}
    </html>
  );
}
