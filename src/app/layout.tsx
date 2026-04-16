import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Inter as InterFont } from "next/font/google";
import { Header } from "@/components/layout/header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { Providers } from "@/components/providers";
import { Toaster } from "sonner";
import { WebsiteJsonLd, OrganizationJsonLd } from "@/components/seo/json-ld";

const inter = Inter({ subsets: ["latin"] });
const interFont = InterFont({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = "https://thiagodesigncruz.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Thiago Design Cruz | Camisetas & Mouse Pads Personalizados",
    template: "%s | Thiago Design Cruz",
  },
  description:
    "Crie suas próprias estampas! Camisetas e mouse pads com designs exclusivos feitos por você. Qualidade premium, entrega para todo o Brasil.",
  keywords: [
    "camisetas personalizadas",
    "mouse pad personalizado",
    "estampas customizadas",
    "design personalizado",
    "camisetas criativas",
    "camiseta com estampa",
    "mousepad gamer",
    "presente personalizado",
    "loja de camisetas",
    "camisetas online",
  ],
  authors: [{ name: "Thiago Design Cruz" }],
  creator: "Thiago Design Cruz",
  publisher: "Thiago Design Cruz",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "Thiago Design Cruz | Camisetas & Mouse Pads Personalizados",
    description:
      "Crie suas próprias estampas! Camisetas e mouse pads com designs exclusivos. Qualidade premium, entrega para todo o Brasil.",
    url: siteUrl,
    siteName: "Thiago Design Cruz",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Thiago Design Cruz | Camisetas & Mouse Pads Personalizados",
    description:
      "Crie suas próprias estampas! Camisetas e mouse pads com designs exclusivos.",
  },
  verification: {
    google: "google-site-verification-code",
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-96.png',
    apple: '/apple-touch-icon.png',
    other: [
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '192x192',
        url: '/favicon-192.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '512x512',
        url: '/favicon-512.png',
      },
    ],
  },
  manifest: '/site.webmanifest',
  category: "e-commerce",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} ${interFont.variable}`}>
        <WebsiteJsonLd />
        <OrganizationJsonLd />
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
          <WhatsAppButton />
          <Toaster 
            position="top-right" 
            richColors 
            offset={{ top: 140 }}
            toastOptions={{
              style: {
                marginTop: '0px',
              }
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
