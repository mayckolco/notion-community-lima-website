import type { Metadata } from "next";
import { Inter, PT_Serif, VT323 } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { OG_IMAGE_PATH, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600"],
});

const ptSerif = PT_Serif({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const vt323 = VT323({
  subsets: ["latin"],
  variable: "--font-pixel",
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Notion",
    "Notion Community",
    "Lima",
    "Perú",
    "comunidad",
    "productividad",
    "bases de datos",
    "gestión de proyectos",
    "meetups",
    "workspace",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [{ url: OG_IMAGE_PATH, width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE_PATH],
  },
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: [{ url: "/favicon.webp", type: "image/webp", sizes: "512x512" }],
    apple: [{ url: "/favicon.webp", type: "image/webp", sizes: "512x512" }],
    shortcut: ["/favicon.webp"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-PE" className={`${inter.variable} ${ptSerif.variable} ${vt323.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground font-sans antialiased">
        <a href="#main-content" className="skip-link">
          Saltar al contenido principal
        </a>
        <ThemeProvider>
          <div id="main-content" tabIndex={-1} className="outline-none">
            {children}
          </div>
          <WhatsAppButton />
          <Toaster />
          <Analytics />
        </ThemeProvider>
      </body>
      {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
      )}
    </html>
  );
}
