"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Clock, XCircle, ArrowRight } from "lucide-react";
import { Suspense, useState } from "react";

function OrderContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");
  const status = searchParams.get("status");
  const paymentStatus = searchParams.get("collection_status") || status;

  const isPending = paymentStatus === "pending";
  const isFailed = paymentStatus === "rejected" || paymentStatus === "failure";
  const isSuccess = !isPending && !isFailed;

  const orderIdCurto = orderId ? orderId.slice(-8).toUpperCase() : null
  const [criandoConta, setCriandoConta] = useState(false)
  const [senha, setSenha] = useState('')
  const [contaCriada, setContaCriada] = useState(false)
  const [erroConta, setErroConta] = useState('')
  const [carregando, setCarregando] = useState(false)

  const handleCriarConta = async () => {
    if (!senha || senha.length < 6) {
      setErroConta('Senha deve ter pelo menos 6 caracteres')
      return
    }
    setCarregando(true)
    setErroConta('')
    try {
      const res = await fetch('/api/auth/register-after-purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, password: senha })
      })
      const data = await res.json()
      if (res.ok) {
        setContaCriada(true)
        setCriandoConta(false)
      } else {
        setErroConta(data.error || 'Erro ao criar conta')
      }
    } catch {
      setErroConta('Erro ao criar conta')
    } finally {
      setCarregando(false)
    }
  }

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

      {isSuccess && !contaCriada && (
        <div style={{ marginTop: 32, padding: 24, background: '#F9F9F9', borderRadius: 16, border: '1px solid #E5E5E5', textAlign: 'center' }}>
          {!criandoConta ? (
            <>
              <p style={{ fontSize: 14, color: '#888', marginBottom: 16 }}>
                Crie uma conta para acompanhar seus pedidos com facilidade
              </p>
              <button
                onClick={() => setCriandoConta(true)}
                style={{ padding: '10px 24px', borderRadius: 999, background: '#292929', color: '#DAA520', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700 }}
              >
                Criar conta grátis
              </button>
            </>
          ) : (
            <div style={{ maxWidth: 320, margin: '0 auto' }}>
              <p style={{ fontSize: 15, fontWeight: 600, color: '#292929', marginBottom: 16 }}>
                Crie sua senha para acessar sua conta
              </p>
              <input
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                style={{ width: '100%', border: '1px solid #E5E5E5', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#292929', marginBottom: 12, boxSizing: 'border-box' as const }}
              />
              {erroConta && <p style={{ fontSize: 13, color: '#F0484A', marginBottom: 12 }}>{erroConta}</p>}
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => setCriandoConta(false)}
                  style={{ flex: 1, padding: '10px', borderRadius: 999, border: '1px solid #E5E5E5', background: '#fff', color: '#888', cursor: 'pointer', fontSize: 13 }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCriarConta}
                  disabled={carregando}
                  style={{ flex: 1, padding: '10px', borderRadius: 999, background: '#DAA520', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}
                >
                  {carregando ? 'Criando...' : 'Criar Conta'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {contaCriada && (
        <div style={{ marginTop: 32, padding: 24, background: '#DCFCE7', borderRadius: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🎉</div>
          <p style={{ fontSize: 15, fontWeight: 700, color: '#16A34A', marginBottom: 8 }}>Conta criada com sucesso!</p>
          <p style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>Faça login para acompanhar seus pedidos</p>
          <a href="/login" style={{ padding: '10px 24px', borderRadius: 999, background: '#16A34A', color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 700 }}>
            Fazer Login
          </a>
        </div>
      )}
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
