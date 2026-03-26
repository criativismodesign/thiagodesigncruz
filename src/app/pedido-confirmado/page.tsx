import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";

export default function OrderConfirmedPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <CheckCircle className="mx-auto h-20 w-20 text-[var(--success)] mb-6" />
      <h1 className="text-3xl font-bold text-white mb-3">
        Pedido Confirmado!
      </h1>
      <p className="text-[var(--muted-foreground)] mb-8 leading-relaxed">
        Obrigado pela sua compra! Você receberá um email com os detalhes do
        pedido e informações de rastreamento em breve.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/produtos"
          className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white"
        >
          Continuar Comprando
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-6 py-3 text-sm font-medium text-[var(--muted-foreground)] hover:text-white transition-colors"
        >
          Voltar ao Início
        </Link>
      </div>
    </div>
  );
}
