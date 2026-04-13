"use client";

import { useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cart-store";
import {
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  ArrowLeft,
  CreditCard,
  Shirt,
  Mouse,
} from "lucide-react";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, clearCart, setFreteInfo } =
    useCartStore();
  
  const [cep, setCep] = useState('')
  const [freteOpcoes, setFreteOpcoes] = useState<any[]>([])
  const [freteSelecionado, setFreteSelecionado] = useState<any>(null)
  const [loadingFrete, setLoadingFrete] = useState(false)
  const [erroFrete, setErroFrete] = useState('')

  const calcularFrete = async () => {
    const cepLimpo = cep.replace(/\D/g, '')
    if (cepLimpo.length !== 8) {
      setErroFrete('CEP inválido')
      return
    }
    setLoadingFrete(true)
    setErroFrete('')
    setFreteOpcoes([])
    setFreteSelecionado(null)
    try {
      const produtos = items.map(item => ({
        tipo: item.type,
        tamanho: item.size,
        quantidade: item.quantity,
      }))
      const response = await fetch('/api/frete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cepDestino: cepLimpo, produtos })
      })
      const data = await response.json()
      if (data.fretes?.length > 0) {
        setFreteOpcoes(data.fretes)
        const primeiroFrete = data.fretes[0]
        setFreteSelecionado(primeiroFrete)
        setFreteInfo({ nome: primeiroFrete.nome, preco: primeiroFrete.preco, prazo: primeiroFrete.prazo })
      } else {
        setErroFrete('Nenhuma opção encontrada para este CEP')
      }
    } catch {
      setErroFrete('Erro ao calcular frete')
    } finally {
      setLoadingFrete(false)
    }
  }

  const formatCep = (value: string) => {
    const nums = value.replace(/\D/g, '').slice(0, 8)
    return nums.length > 5 ? `${nums.slice(0, 5)}-${nums.slice(5)}` : nums
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center bg-white">
        <ShoppingBag className="mx-auto h-16 w-16 text-[#AAAAAA]/30 mb-6" />
        <h1 className="text-2xl font-bold text-[#292929] mb-2">
          Seu carrinho está vazio
        </h1>
        <p className="text-[#AAAAAA] mb-8">
          Que tal explorar nossos produtos?
        </p>
        <Link
          href="/produtos"
          className="inline-flex items-center gap-2 rounded-xl bg-[#DAA520] px-6 py-3 text-sm font-semibold text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Ver Produtos
        </Link>
      </div>
    );
  }

  const subtotal = getTotal();
  
  // Check if cart contains only test product
  const isTestProductOnly = items.every(item => 
    item.name === "Camiseta e Mouse Pad Teste"
  );
  
  const shipping = isTestProductOnly 
  ? 0 
  : subtotal >= 250 
    ? 0 
    : freteSelecionado 
      ? freteSelecionado.preco 
      : 0 // não soma frete até o cliente escolher
  let pixDiscount = subtotal * 0.1;
  
  // Special pricing for test product only
  if (isTestProductOnly && items.length > 0) {
    pixDiscount = subtotal + 19.90 - 1.00; // Discount to make total exactly R$1.00
  }
  
  const total = subtotal + shipping;
  const podeFinalizarCompra = isTestProductOnly || subtotal >= 250 || freteSelecionado !== null

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 bg-white">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-[#292929]">Carrinho</h1>
        <button
          onClick={clearCart}
          className="text-sm text-[#AAAAAA] hover:text-[#F0484A] transition-colors"
        >
          Limpar carrinho
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 rounded-2xl border border-[#E5E5E5] bg-white p-4"
            >
              <div className="h-24 w-24 shrink-0 rounded-xl bg-[#F5F5F5] overflow-hidden flex items-center justify-center">
                {item.image ? (
                  <img 
                    src={item.image} 
                    alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
                  />
                ) : item.type === "camiseta"
                  ? <Shirt className="h-10 w-10 text-[#AAAAAA]/30" />
                  : <Mouse className="h-10 w-10 text-[#AAAAAA]/30" />
                }
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[#292929] truncate">
                  {item.name}
                </h3>
                <div className="mt-1 flex flex-wrap gap-2 text-xs text-[#AAAAAA]">
                  {item.size && <span>Tamanho: {item.size}</span>}
                  {item.color && <span>Cor: {item.color}</span>}
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="inline-flex items-center rounded-lg border border-[#E5E5E5]">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          Math.max(1, item.quantity - 1)
                        )
                      }
                      className="px-2 py-1 text-[#AAAAAA] hover:text-[#292929]"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="px-3 py-1 text-sm text-[#292929]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                      className="px-2 py-1 text-[#AAAAAA] hover:text-[#292929]"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-[#292929]">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-[#AAAAAA] hover:text-[#F0484A] transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-[#E5E5E5] bg-[#292929] p-6">
            <h2 className="text-lg font-bold text-white mb-4">
              Resumo do Pedido
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-[#AAAAAA]">
                <span>
                  Subtotal ({items.length} item
                  {items.length !== 1 ? "s" : ""})
                </span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              
              {/* Campo CEP */}
              <div style={{ marginTop: 8, marginBottom: 8 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 8 }}>Calcular Frete</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    value={cep}
                    onChange={e => setCep(formatCep(e.target.value))}
                    placeholder="00000-000"
                    maxLength={9}
                    style={{ flex: 1, border: '1px solid #E5E5E5', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#fff', background: '#1a1a1a' }}
                  />
                  <button
                    onClick={calcularFrete}
                    disabled={loadingFrete}
                    style={{ background: '#DAA520', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}
                  >
                    {loadingFrete ? '...' : 'OK'}
                  </button>
                </div>
                {erroFrete && <p style={{ fontSize: 12, color: '#F0484A', marginTop: 6 }}>{erroFrete}</p>}
                
                {/* Opções de frete */}
                {freteOpcoes.length > 0 && (
                  <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {freteOpcoes.map(frete => (
                      <div
                        key={frete.id}
                        onClick={() => {
  setFreteSelecionado(frete)
  setFreteInfo({ nome: frete.nome, preco: frete.preco, prazo: frete.prazo })
}}
                        style={{
                          padding: '8px 12px', borderRadius: 8, cursor: 'pointer',
                          border: freteSelecionado?.id === frete.id ? '2px solid #DAA520' : '1px solid #E5E5E5',
                          background: freteSelecionado?.id === frete.id ? 'rgba(218,165,32,0.1)' : '#1a1a1a',
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                        }}
                      >
                        <div>
                          <p style={{ fontSize: 12, fontWeight: 600, color: '#fff', margin: 0 }}>{frete.empresa} - {frete.nome}</p>
                          <p style={{ fontSize: 11, color: '#AAAAAA', margin: 0 }}>{frete.prazo} dias úteis</p>
                        </div>
                        <p style={{ fontSize: 13, fontWeight: 700, color: '#DAA520', margin: 0 }}>
                          R$ {frete.preco.toFixed(2).replace('.', ',')}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex justify-between text-[#AAAAAA]">
                <span>Frete</span>
                <span>
                  {subtotal >= 250 
                    ? <span style={{ color: '#46A520' }}>Grátis</span>
                    : freteSelecionado 
                      ? formatCurrency(freteSelecionado.preco)
                      : <span style={{ color: '#DAA520', fontSize: 12 }}>Calcule o frete</span>
                  }
                </span>
              </div>
              <div className="border-t border-[#E5E5E5] pt-3 flex justify-between font-bold text-white text-base">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between text-[#46A520] text-xs">
                <span>No Pix (10% off)</span>
                <span>{formatCurrency(total - pixDiscount)}</span>
              </div>
            </div>

            {shipping > 0 && (
              <p className="mt-4 text-xs text-[#AAAAAA] bg-[#1a1a1a] rounded-lg p-3">
                Falta {formatCurrency(250 - subtotal)} para frete grátis!
              </p>
            )}

            {podeFinalizarCompra ? (
              <Link
                href="/checkout"
                className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#46A520] py-3 text-sm font-semibold text-white shadow-lg shadow-[#46A520]/25 hover:shadow-[#46A520]/40 transition-all"
              >
                <CreditCard className="h-4 w-4" />
                Finalizar Compra
              </Link>
            ) : (
              <button 
                disabled
                style={{ marginTop: 24, width: '100%', padding: '12px', borderRadius: 12, background: '#E5E5E5', color: '#AAAAAA', border: 'none', fontSize: 14, fontWeight: 600, cursor: 'not-allowed' }}
              >
                Selecione o frete para continuar
              </button>
            )}

            <Link
              href="/produtos"
              className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-xl border border-[#E5E5E5] py-3 text-sm font-medium text-[#AAAAAA] hover:text-[#DAA520] transition-colors"
            >
              Continuar Comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
