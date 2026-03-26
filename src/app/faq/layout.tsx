import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Perguntas Frequentes",
  description:
    "Respostas para as perguntas mais frequentes sobre pedidos, entregas, trocas, pagamento e personalização na Thiago Design Cruz.",
  alternates: {
    canonical: "https://thiagodesigncruz.com.br/faq",
  },
  openGraph: {
    title: "FAQ | Thiago Design Cruz",
    description:
      "Respostas para as perguntas mais frequentes sobre pedidos, entregas, trocas e personalização.",
    url: "https://thiagodesigncruz.com.br/faq",
  },
};

export default function FaqLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
