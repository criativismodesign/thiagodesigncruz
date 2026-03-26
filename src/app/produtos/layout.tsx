import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Produtos",
  description:
    "Explore nossa coleção de camisetas e mouse pads personalizados. Designs exclusivos, qualidade premium e entrega para todo o Brasil.",
  alternates: {
    canonical: "https://thiagodesigncruz.com.br/produtos",
  },
  openGraph: {
    title: "Produtos | Thiago Design Cruz",
    description:
      "Camisetas e mouse pads personalizados com designs exclusivos. Qualidade premium.",
    url: "https://thiagodesigncruz.com.br/produtos",
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
