import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Providers } from "@/components/providers";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Thiago Design Cruz | Camisetas & Mouse Pads Personalizados",
  description:
    "Crie suas próprias estampas! Camisetas e mouse pads com designs exclusivos feitos por você. Qualidade premium, entrega para todo o Brasil.",
  keywords: [
    "camisetas personalizadas",
    "mouse pad personalizado",
    "estampas customizadas",
    "design personalizado",
    "camisetas criativas",
  ],
  openGraph: {
    title: "Thiago Design Cruz",
    description: "Camisetas & Mouse Pads com estampas personalizadas",
    url: "https://thiagodesigncruz.com.br",
    siteName: "Thiago Design Cruz",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Providers>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <Toaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  );
}
