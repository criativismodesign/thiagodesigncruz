import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Entre em contato com a Thiago Design Cruz. Tire suas dúvidas, faça orçamentos ou envie sugestões. Atendemos por email e WhatsApp.",
  alternates: {
    canonical: "https://thiagodesigncruz.com.br/contato",
  },
  openGraph: {
    title: "Contato | Thiago Design Cruz",
    description:
      "Entre em contato conosco. Tire dúvidas, faça orçamentos ou envie sugestões.",
    url: "https://thiagodesigncruz.com.br/contato",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
