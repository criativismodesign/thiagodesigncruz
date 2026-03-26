"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    category: "Pedidos e Entregas",
    questions: [
      {
        q: "Qual o prazo de entrega?",
        a: "O prazo de entrega varia de 5 a 15 dias úteis após a confirmação do pagamento, dependendo da sua localização. Produtos personalizados podem levar até 3 dias úteis adicionais para produção.",
      },
      {
        q: "Como posso rastrear meu pedido?",
        a: "Após o envio, você receberá um e-mail com o código de rastreamento. Também é possível acompanhar pelo painel da sua conta na seção 'Meus Pedidos'.",
      },
      {
        q: "Vocês entregam em todo o Brasil?",
        a: "Sim! Entregamos para todas as regiões do Brasil através dos Correios e transportadoras parceiras.",
      },
      {
        q: "O frete é grátis?",
        a: "Oferecemos frete grátis para compras acima de R$ 199,90 para todo o Brasil. Abaixo desse valor, o frete é calculado com base no CEP de destino.",
      },
    ],
  },
  {
    category: "Produtos",
    questions: [
      {
        q: "Qual a qualidade das camisetas?",
        a: "Nossas camisetas são 100% algodão penteado, com gramatura de 30.1, proporcionando conforto e durabilidade. As estampas são feitas com tecnologia DTF (Direct to Film), garantindo cores vibrantes e resistência a lavagens.",
      },
      {
        q: "Os mouse pads são resistentes à água?",
        a: "Nossos mouse pads possuem superfície de tecido de alta precisão com base de borracha antiderrapante. Embora não sejam à prova d'água, são resistentes a respingos leves. Recomendamos evitar contato prolongado com líquidos.",
      },
      {
        q: "Posso criar meu próprio design?",
        a: "Sim! Temos uma ferramenta de design online onde você pode fazer upload de imagens, adicionar textos e criar composições únicas para camisetas e mouse pads. Acesse a seção 'Criar Design' no menu.",
      },
      {
        q: "Quais tamanhos de camiseta estão disponíveis?",
        a: "Oferecemos tamanhos P, M, G, GG e XGG. Confira nossa tabela de medidas na página de cada produto para escolher o tamanho ideal.",
      },
    ],
  },
  {
    category: "Pagamento",
    questions: [
      {
        q: "Quais formas de pagamento são aceitas?",
        a: "Aceitamos Pix, cartão de crédito (até 12x sem juros), cartão de débito e boleto bancário. O Pix oferece desconto de 5% no valor total.",
      },
      {
        q: "O pagamento é seguro?",
        a: "Sim! Utilizamos criptografia SSL e processamos pagamentos através do Mercado Pago, uma das plataformas mais seguras do Brasil.",
      },
      {
        q: "Posso parcelar minha compra?",
        a: "Sim, aceitamos parcelamento em até 12x sem juros no cartão de crédito para compras acima de R$ 50,00.",
      },
    ],
  },
  {
    category: "Trocas e Devoluções",
    questions: [
      {
        q: "Posso trocar ou devolver um produto?",
        a: "Sim, você tem até 7 dias corridos após o recebimento para solicitar a troca ou devolução, conforme o Código de Defesa do Consumidor. O produto deve estar em perfeito estado, sem uso.",
      },
      {
        q: "Produtos personalizados podem ser trocados?",
        a: "Produtos com design personalizado só podem ser trocados em caso de defeito de fabricação. Como são feitos sob encomenda, não aceitamos devoluções por arrependimento.",
      },
      {
        q: "Como solicito uma troca?",
        a: "Entre em contato conosco pelo e-mail contato@thiagodesigncruz.com.br ou pelo WhatsApp informando o número do pedido e o motivo da troca. Nossa equipe responderá em até 24 horas.",
      },
    ],
  },
];

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <div className="inline-flex rounded-2xl bg-[var(--primary)]/10 p-4 mb-6">
          <HelpCircle className="h-10 w-10 text-[var(--primary)]" />
        </div>
        <h1 className="text-4xl font-bold text-white sm:text-5xl mb-4">
          Perguntas Frequentes
        </h1>
        <p className="text-lg text-[var(--muted-foreground)]">
          Encontre respostas rápidas para as dúvidas mais comuns.
        </p>
      </div>

      <div className="space-y-10">
        {faqs.map((section) => (
          <div key={section.category}>
            <h2 className="text-xl font-bold text-white mb-4">
              {section.category}
            </h2>
            <div className="space-y-3">
              {section.questions.map((item, idx) => {
                const id = `${section.category}-${idx}`;
                const isOpen = openItems.has(id);
                return (
                  <div
                    key={id}
                    className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden"
                  >
                    <button
                      onClick={() => toggleItem(id)}
                      className="flex w-full items-center justify-between px-5 py-4 text-left"
                    >
                      <span className="text-sm font-medium text-white pr-4">
                        {item.q}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-[var(--muted-foreground)] transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-4">
                        <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                          {item.a}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8">
        <p className="text-[var(--muted-foreground)] mb-4">
          Não encontrou o que procurava?
        </p>
        <a
          href="/contato"
          className="inline-flex rounded-xl bg-[var(--primary)] px-8 py-3 font-semibold text-white hover:bg-[var(--primary)]/90 transition-colors"
        >
          Fale Conosco
        </a>
      </div>
    </main>
  );
}
