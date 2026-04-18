import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from 'next/script'
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

const siteUrl = "https://usekin.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "UseKIN | Camisetas & Mouse Pads Personalizados",
    template: "%s | UseKIN",
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
  authors: [{ name: "UseKIN" }],
  creator: "UseKIN",
  publisher: "UseKIN",
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
    title: "UseKIN | Camisetas & Mouse Pads Personalizados",
    description:
      "Crie suas próprias estampas! Camisetas e mouse pads com designs exclusivos. Qualidade premium, entrega para todo o Brasil.",
    url: siteUrl,
    siteName: "UseKIN",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: `${siteUrl}/imagens/hero/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "UseKIN - Moda Geek Premium",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UseKIN | Camisetas & Mouse Pads Personalizados",
    description:
      "Crie suas próprias estampas! Camisetas e mouse pads com designs exclusivos.",
  },
  verification: {
    google: "IUFVWQStFMAvUouAIIONwMF8EW1m7pBQLQX8x0Il3R4",
  },
  themeColor: '#ffffff',
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
      <body className={`${inter.className} ${interFont.variable}`} style={{ overflowX: 'hidden', maxWidth: '100vw' }}>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-N4EGGQ2TS6"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-N4EGGQ2TS6');
          `}
        </Script>
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
