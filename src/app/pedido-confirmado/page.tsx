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
  const isSuccess = !isPending && !isFailed;

  const orderIdCurto = orderId ? orderId.slice(-8).toUpperCase() : null

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '64px 24px', textAlign: 'center' }}>
      
      {/* Ícone */}
      <div style={{ fontSize: 72, marginBottom: 24, lineHeight: 1 }}>
        {isFailed ? 'â' : isPending ? 'â³' : 'ð'}
      </div>

      {/* Título */}
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#292929', marginBottom: 12 }}>
        {isFailed ? 'Pagamento não aprovado' : isPending ? 'Pagamento Pendente' : 'Pedido Confirmado!'}
      </h1>

      {/* Descrição */}
      <p style={{ fontSize: 15, color: '#888', lineHeight: 1.7, marginBottom: 24, maxWidth: 440, margin: '0 auto 24px' }}>
        {isFailed
          ? 'Houve um problema com o pagamento. Tente novamente ou escolha outro método.'
          : isPending
          ? 'Seu pagamento está sendo processado. Você receberá uma confirmação em breve.'
          : 'Obrigado pela sua compra! Assim que confirmarmos o pagamento, seu pedido entrará em produção.'}
      </p>

      {/* ID do pedido */}
      {orderIdCurto && isSuccess && (
        <div style={{ background: '#F9F9F9', border: '1px solid #E5E5E5', borderRadius: 12, padding: '16px 24px', marginBottom: 32, display: 'inline-block' }}>
          <p style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>Número do seu pedido</p>
          <p style={{ fontSize: 22, fontWeight: 700, color: '#292929', fontFamily: 'monospace', letterSpacing: 2 }}>
            #{orderIdCurto}
          </p>
          <p style={{ fontSize: 12, color: '#AAA', marginTop: 4 }}>Guarde este número para acompanhar sua compra</p>
        </div>
      )}

      {/* Botões */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', marginTop: 8 }}>
        {isFailed ? (
          <a href="/checkout" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '14px 32px', borderRadius: 999, background: '#DAA520', color: '#fff',
            textDecoration: 'none', fontSize: 15, fontWeight: 700
          }}>
            Tentar Novamente
          </a>
        ) : (
          <>
            {orderIdCurto && (
              <a href={`/acompanhar/${orderIdCurto.toLowerCase()}`} style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '14px 32px', borderRadius: 999, background: '#DAA520', color: '#fff',
                textDecoration: 'none', fontSize: 15, fontWeight: 700
              }}>
                ð Acompanhar Pedido
              </a>
            )}
            <a href="/minha-conta" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 28px', borderRadius: 999, border: '1px solid #E5E5E5', color: '#292929',
              textDecoration: 'none', fontSize: 14, fontWeight: 500
            }}>
              Minha Conta
            </a>
            <a href="/categorias/todos-produtos" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 28px', borderRadius: 999, border: '1px solid #E5E5E5', color: '#888',
              textDecoration: 'none', fontSize: 14
            }}>
              Continuar Comprando
            </a>
          </>
        )}
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
