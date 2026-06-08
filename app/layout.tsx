import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: "Postula como Speaker · AI First Founders",
  description:
    "Comparte tu experiencia construyendo con IA. Postula para hablar un martes de 7–8 pm en la comunidad AI First Founders.",
  openGraph: {
    title: "Postula como Speaker · AI First Founders",
    description: "Comparte tu experiencia construyendo con IA en la comunidad AI First Founders.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
        <Toaster />
        <Analytics />
      </body>
      {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
      )}
    </html>
  );
}
