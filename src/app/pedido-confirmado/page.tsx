"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Clock, XCircle, ArrowRight } from "lucide-react";
import { Suspense } from "react";

function OrderContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");
  const status = searchParams.get("status");
  const paymentStatus = searchParams.get("collection_status") || status;

  const isPending = paymentStatus === "pending";
  const isFailed = paymentStatus === "rejected" || paymentStatus === "failure";

  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      {isFailed ? (
        <XCircle className="mx-auto h-20 w-20 text-red-500 mb-6" />
      ) : isPending ? (
        <Clock className="mx-auto h-20 w-20 text-yellow-500 mb-6" />
      ) : (
        <CheckCircle className="mx-auto h-20 w-20 text-[var(--success)] mb-6" />
      )}

      <h1 className="text-3xl font-bold text-white mb-3">
        {isFailed
          ? "Pagamento não aprovado"
          : isPending
            ? "Pagamento Pendente"
            : "Pedido Confirmado!"}
      </h1>

      <p className="text-[var(--muted-foreground)] mb-4 leading-relaxed">
        {isFailed
          ? "Houve um problema com o pagamento. Tente novamente ou escolha outro método."
          : isPending
            ? "Seu pagamento está sendo processado. Você receberá uma confirmação em breve."
            : "Obrigado pela sua compra! Você receberá um email com os detalhes do pedido e informações de rastreamento em breve."}
      </p>

      {orderId && (
        <p className="text-sm text-[var(--muted-foreground)] mb-8">
          Nº do pedido: <span className="font-mono text-white">{orderId}</span>
        </p>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        {isFailed ? (
          <Link
            href="/checkout"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white"
          >
            Tentar Novamente
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <Link
            href="/produtos"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white"
          >
            Continuar Comprando
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
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

export default function OrderConfirmedPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-lg px-4 py-20 text-center">
          <div className="animate-pulse h-20 w-20 rounded-full bg-[var(--border)] mx-auto mb-6" />
          <div className="animate-pulse h-8 bg-[var(--border)] rounded w-3/4 mx-auto mb-3" />
          <div className="animate-pulse h-4 bg-[var(--border)] rounded w-full mx-auto" />
        </div>
      }
    >
      <OrderContent />
    </Suspense>
  );
}
