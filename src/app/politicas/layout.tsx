import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Políticas",
  description:
    "Política de Privacidade, Termos de Uso, Política de Trocas e Devoluções, e Política de Envio da Thiago Design Cruz.",
  alternates: {
    canonical: "https://thiagodesigncruz.com.br/politicas",
  },
  openGraph: {
    title: "Políticas | Thiago Design Cruz",
    description:
      "Política de Privacidade, Termos de Uso, Trocas e Devoluções, e Política de Envio.",
    url: "https://thiagodesigncruz.com.br/politicas",
  },
};

export default function PoliciesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
