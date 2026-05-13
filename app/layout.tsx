import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Postula como Speaker · AI First Founders",
  description:
    "Comparte lo que construiste con IA. Postula para hablar un martes de 7–8 pm en la comunidad AI First Founders.",
  openGraph: {
    title: "Postula como Speaker · AI First Founders",
    description: "Comparte lo que construiste con IA en la comunidad AI First Founders.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
