"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart-store";
import { useSession } from "next-auth/react";
import { Loader2, Lock, CreditCard, QrCode, Barcode } from "lucide-react";
import { toast } from "sonner";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

const formatCPF = (value: string) => {
  const nums = value.replace(/\D/g, '').slice(0, 11)
  if (nums.length <= 3) return nums
  if (nums.length <= 6) return `${nums.slice(0,3)}.${nums.slice(3)}` 
  if (nums.length <= 9) return `${nums.slice(0,3)}.${nums.slice(3,6)}.${nums.slice(6)}` 
  return `${nums.slice(0,3)}.${nums.slice(3,6)}.${nums.slice(6,9)}-${nums.slice(9)}` 
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart, freteInfo } = useCartStore();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<
    "pix" | "credit" | "boleto"
  >("pix");
  const [enderecoSalvo, setEnderecoSalvo] = useState<any>(null);
  const [alterandoEndereco, setAlterandoEndereco] = useState(false);
  const [cupomCodigo, setCupomCodigo] = useState('');
  const [cupomAplicado, setCupomAplicado] = useState<any>(null);
  const [cupomErro, setCupomErro] = useState('');
  const [cupomLoading, setCupomLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    cpf: "",
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
  });

  const subtotal = getTotal();
  
  // Check if cart contains only test product
  const isTestProductOnly = items.every(item => 
    item.name === "Camiseta e Mouse Pad Teste"
  );
  
  let shipping = isTestProductOnly ? 0 : subtotal >= 250 ? 0 : (freteInfo?.preco || 19.9);
  let discount = paymentMethod === "pix" ? subtotal * 0.1 : 0;
  
  // Special pricing for test product only
  if (isTestProductOnly && items.length > 0) {
    shipping = 0; // Free shipping
    discount = subtotal + 19.90 - 1.00; // Discount to make total exactly R$1.00
  }
  
  // Ensure discount never exceeds subtotal - minimum payment (R$1.00)
  const maxDiscount = subtotal - 1.00;

  useEffect(() => {
    if (session?.user) {
      fetch('/api/user/profile')
        .then(r => r.json())
        .then(data => {
          setForm(prev => ({
            ...prev,
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
          }))
          // Preencher endereço padrão se existir
          const endPadrao = data.addresses?.find((a: any) => a.isDefault) || data.addresses?.[0]
          if (endPadrao) {
            setForm(prev => ({
              ...prev,
              cep: endPadrao.zipCode || '',
              street: endPadrao.street || '',
              number: endPadrao.number || '',
              complement: endPadrao.complement || '',
              neighborhood: endPadrao.neighborhood || '',
              city: endPadrao.city || '',
              state: endPadrao.state || '',
            }))
            setEnderecoSalvo(endPadrao)
          }
        })
    }
  }, [session])

  const aplicarCupom = async () => {
    if (!cupomCodigo.trim()) return
    setCupomLoading(true)
    setCupomErro('')
    try {
      const res = await fetch('/api/cupom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo: cupomCodigo, total: subtotal + shipping })
      })
      const data = await res.json()
      if (data.success) {
        setCupomAplicado(data.cupom)
      } else {
        setCupomErro(data.error || 'Cupom inválido')
      }
    } catch {
      setCupomErro('Erro ao validar cupom')
    } finally {
      setCupomLoading(false)
    }
  }

  if (discount > maxDiscount) {
    discount = maxDiscount;
  }
  
  const descontoCupom = cupomAplicado ? cupomAplicado.desconto : 0
  const total = subtotal + shipping - discount - descontoCupom;

  const handleCepLookup = async () => {
    if (form.cep.length < 8) return;
    try {
      const res = await fetch(
        `https://viacep.com.br/ws/${form.cep.replace(/\D/g, "")}/json/`
      );
      const data = await res.json();
      if (!data.erro) {
        setForm((prev) => ({
          ...prev,
          street: data.logradouro || prev.street,
          neighborhood: data.bairro || prev.neighborhood,
          city: data.localidade || prev.city,
          state: data.uf || prev.state,
        }));
      }
    } catch {
      /* ignore */
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Carrinho vazio");
      return;
    }

    if (!form.name || !form.email || !form.cpf || !form.cep || !form.street || !form.number || !form.neighborhood || !form.city || !form.state) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            size: item.size,
            color: item.color,
            customDesign: item.customDesign,
          })),
          payer: {
            name: form.name,
            email: form.email,
            phone: form.phone,
            cpf: form.cpf,
          },
          shippingAddress: {
            street: form.street,
            number: form.number,
            complement: form.complement,
            neighborhood: form.neighborhood,
            city: form.city,
            state: form.state,
            zipCode: form.cep,
          },
          shippingCost: shipping,
          discount,
          cupomId: cupomAplicado?.id || null,
          cupomDesconto: descontoCupom,
          paymentMethod,
        }),
      });

      const data = await res.json();
      console.log("Payment API response:", data);

      if (!res.ok) {
        console.error("Payment API error:", data);
        throw new Error(data.error || "Erro ao processar pagamento");
      }

      // Redirect to MercadoPago checkout for all payment methods
      console.log("Redirecting to:", data.initPoint || data.sandboxInitPoint);
      
      if (typeof window !== 'undefined') {
        if (data.initPoint) {
          // Clear cart only after successful redirect
          clearCart();
          window.location.href = data.initPoint;
        } else if (data.sandboxInitPoint) {
          // Clear cart only after successful redirect
          clearCart();
          window.location.href = data.sandboxInitPoint;
        } else {
          console.error("No payment URL returned:", data);
          toast.error("Erro ao gerar link de pagamento");
        }
      } else {
        console.error("Window not available");
        toast.error("Erro ao redirecionar para pagamento");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao processar pagamento"
      );
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', textAlign: 'center' }}>
        <h1 style={{ color: '#292929', marginBottom: '20px' }}>Checkout</h1>
        <p style={{ color: '#888', marginBottom: '20px' }}>Seu carrinho está vazio.</p>
        <button
          onClick={() => router.push('/categorias/todos-produtos')}
          style={{
            background: '#DAA520',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '12px 24px',
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 600
          }}
        >
          Continuar Comprando
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 bg-white">
      <div className="flex items-center gap-2 mb-8">
        <Lock className="h-5 w-5 text-[#46A520]" />
        <h1 className="text-3xl font-bold text-[#292929]">Checkout Seguro</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-8 lg:grid-cols-5"
      >
        {/* Form */}
        <div className="lg:col-span-3 space-y-6">
          {/* Personal Info */}
          <div className="rounded-2xl border border-[#E5E5E5] bg-white p-6">
            <h2 className="text-lg font-bold text-[#292929] mb-4">
              Dados Pessoais
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm text-[#AAAAAA] mb-1">
                  Nome completo
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={`w-full rounded-lg border border-[#E5E5E5] px-4 py-2.5 text-sm focus:outline-none ${
                  enderecoSalvo && !alterandoEndereco 
                    ? 'bg-[#f0f0f0] text-[#666]' 
                    : 'bg-[#F5F5F5] text-[#292929] focus:border-[#DAA520]'
                }`}
                readOnly={enderecoSalvo && !alterandoEndereco}
                />
              </div>
              <div>
                <label className="block text-sm text-[#AAAAAA] mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={`w-full rounded-lg border border-[#E5E5E5] px-4 py-2.5 text-sm focus:outline-none ${
                  enderecoSalvo && !alterandoEndereco 
                    ? 'bg-[#f0f0f0] text-[#666]' 
                    : 'bg-[#F5F5F5] text-[#292929] focus:border-[#DAA520]'
                }`}
                readOnly={enderecoSalvo && !alterandoEndereco}
                />
              </div>
              <div>
                <label className="block text-sm text-[#AAAAAA] mb-1">
                  Telefone
                </label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={`w-full rounded-lg border border-[#E5E5E5] px-4 py-2.5 text-sm focus:outline-none ${
                  enderecoSalvo && !alterandoEndereco 
                    ? 'bg-[#f0f0f0] text-[#666]' 
                    : 'bg-[#F5F5F5] text-[#292929] focus:border-[#DAA520]'
                }`}
                readOnly={enderecoSalvo && !alterandoEndereco}
                />
              </div>
              <div>
                <label className="block text-sm text-[#AAAAAA] mb-1">
                  CPF
                </label>
                <input
                  type="text"
                  required
                  value={form.cpf}
                  onChange={e => setForm({ ...form, cpf: formatCPF(e.target.value) })}
                  className="w-full rounded-lg border border-[#E5E5E5] bg-[#F5F5F5] px-4 py-2.5 text-sm text-[#292929] focus:border-[#DAA520] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="rounded-2xl border border-[#E5E5E5] bg-white p-6">
            <h2 className="text-lg font-bold text-[#292929] mb-4">Endereço</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm text-[#AAAAAA] mb-1">
                  CEP
                </label>
                <input
                  type="text"
                  required
                  value={form.cep}
                  onChange={(e) => setForm({ ...form, cep: e.target.value })}
                  onBlur={handleCepLookup}
                  className={`w-full rounded-lg border border-[#E5E5E5] px-4 py-2.5 text-sm focus:outline-none ${
                  enderecoSalvo && !alterandoEndereco 
                    ? 'bg-[#f0f0f0] text-[#666]' 
                    : 'bg-[#F5F5F5] text-[#292929] focus:border-[#DAA520]'
                }`}
                readOnly={enderecoSalvo && !alterandoEndereco}
                  placeholder="00000-000"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm text-[#AAAAAA] mb-1">
                  Rua
                </label>
                <input
                  type="text"
                  required
                  value={form.street}
                  onChange={(e) => setForm({ ...form, street: e.target.value })}
                  className={`w-full rounded-lg border border-[#E5E5E5] px-4 py-2.5 text-sm focus:outline-none ${
                  enderecoSalvo && !alterandoEndereco 
                    ? 'bg-[#f0f0f0] text-[#666]' 
                    : 'bg-[#F5F5F5] text-[#292929] focus:border-[#DAA520]'
                }`}
                readOnly={enderecoSalvo && !alterandoEndereco}
                />
              </div>
              <div>
                <label className="block text-sm text-[#AAAAAA] mb-1">
                  Número
                </label>
                <input
                  type="text"
                  required
                  value={form.number}
                  onChange={(e) => setForm({ ...form, number: e.target.value })}
                  className={`w-full rounded-lg border border-[#E5E5E5] px-4 py-2.5 text-sm focus:outline-none ${
                  enderecoSalvo && !alterandoEndereco 
                    ? 'bg-[#f0f0f0] text-[#666]' 
                    : 'bg-[#F5F5F5] text-[#292929] focus:border-[#DAA520]'
                }`}
                readOnly={enderecoSalvo && !alterandoEndereco}
                />
              </div>
              <div>
                <label className="block text-sm text-[#AAAAAA] mb-1">
                  Complemento
                </label>
                <input
                  type="text"
                  value={form.complement}
                  onChange={(e) =>
                    setForm({ ...form, complement: e.target.value })
                  }
                  className={`w-full rounded-lg border border-[#E5E5E5] px-4 py-2.5 text-sm focus:outline-none ${
                  enderecoSalvo && !alterandoEndereco 
                    ? 'bg-[#f0f0f0] text-[#666]' 
                    : 'bg-[#F5F5F5] text-[#292929] focus:border-[#DAA520]'
                }`}
                readOnly={enderecoSalvo && !alterandoEndereco}
                />
              </div>
              <div>
                <label className="block text-sm text-[#AAAAAA] mb-1">
                  Bairro
                </label>
                <input
                  type="text"
                  required
                  value={form.neighborhood}
                  onChange={(e) =>
                    setForm({ ...form, neighborhood: e.target.value })
                  }
                  className={`w-full rounded-lg border border-[#E5E5E5] px-4 py-2.5 text-sm focus:outline-none ${
                  enderecoSalvo && !alterandoEndereco 
                    ? 'bg-[#f0f0f0] text-[#666]' 
                    : 'bg-[#F5F5F5] text-[#292929] focus:border-[#DAA520]'
                }`}
                readOnly={enderecoSalvo && !alterandoEndereco}
                />
              </div>
              <div>
                <label className="block text-sm text-[#AAAAAA] mb-1">
                  Cidade
                </label>
                <input
                  type="text"
                  required
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className={`w-full rounded-lg border border-[#E5E5E5] px-4 py-2.5 text-sm focus:outline-none ${
                  enderecoSalvo && !alterandoEndereco 
                    ? 'bg-[#f0f0f0] text-[#666]' 
                    : 'bg-[#F5F5F5] text-[#292929] focus:border-[#DAA520]'
                }`}
                readOnly={enderecoSalvo && !alterandoEndereco}
                />
              </div>
              <div>
                <label className="block text-sm text-[#AAAAAA] mb-1">
                  Estado
                </label>
                <input
                  type="text"
                  required
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className={`w-full rounded-lg border border-[#E5E5E5] px-4 py-2.5 text-sm focus:outline-none ${
                  enderecoSalvo && !alterandoEndereco 
                    ? 'bg-[#f0f0f0] text-[#666]' 
                    : 'bg-[#F5F5F5] text-[#292929] focus:border-[#DAA520]'
                }`}
                readOnly={enderecoSalvo && !alterandoEndereco}
                  placeholder="UF"
                />
              </div>
            </div>
            {enderecoSalvo && !alterandoEndereco && (
              <button
                type="button"
                onClick={() => setAlterandoEndereco(true)}
                style={{ background: 'transparent', border: '1px solid #DAA520', color: '#DAA520', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontSize: 13, marginTop: 8 }}
              >
                Mudar endereço de entrega
              </button>
            )}
          </div>

          {/* Payment */}
          <div className="rounded-2xl border border-[#E5E5E5] bg-white p-6">
            <h2 className="text-lg font-bold text-[#292929] mb-4">Pagamento</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => setPaymentMethod("pix")}
                className={`flex items-center gap-3 rounded-xl border p-4 transition-colors ${
                  paymentMethod === "pix"
                    ? "border-[#DAA520] bg-[#DAA520]/10"
                    : "border-[#E5E5E5] hover:border-[#DAA520]/50"
                }`}
              >
                <QrCode className="h-5 w-5 text-[#DAA520]" />
                <div className="text-left">
                  <p className="text-sm font-medium text-[#292929]">Pix</p>
                  <p className="text-xs text-[#46A520]">10% off</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("credit")}
                className={`flex items-center gap-3 rounded-xl border p-4 transition-colors ${
                  paymentMethod === "credit"
                    ? "border-[#DAA520] bg-[#DAA520]/10"
                    : "border-[#E5E5E5] hover:border-[#DAA520]/50"
                }`}
              >
                <CreditCard className="h-5 w-5 text-[#DAA520]" />
                <div className="text-left">
                  <p className="text-sm font-medium text-[#292929]">Cartão</p>
                  <p className="text-xs text-[#AAAAAA]">
                    Até 12x
                  </p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("boleto")}
                className={`flex items-center gap-3 rounded-xl border p-4 transition-colors ${
                  paymentMethod === "boleto"
                    ? "border-[#DAA520] bg-[#DAA520]/10"
                    : "border-[#E5E5E5] hover:border-[#DAA520]/50"
                }`}
              >
                <Barcode className="h-5 w-5 text-[#DAA520]" />
                <div className="text-left">
                  <p className="text-sm font-medium text-[#292929]">Boleto</p>
                  <p className="text-xs text-[#AAAAAA]">
                    3 dias úteis
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-2">
          <div className="sticky top-24 rounded-2xl border border-[#E5E5E5] bg-[#292929] p-6">
            <h2 className="text-lg font-bold text-white mb-4">
              Resumo do Pedido
            </h2>
            <div className="space-y-2 text-sm mb-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between text-[#AAAAAA]"
                >
                  <span className="truncate pr-2">
                    {item.quantity}x {item.name}
                  </span>
                  <span className="shrink-0">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="space-y-2 border-t border-[#E5E5E5] pt-4 text-sm">
              <div className="flex justify-between text-[#AAAAAA]">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#AAAAAA]">
                <span>Frete {freteInfo ? `(${freteInfo.nome})` : ''}</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-[#46A520]">Grátis</span>
                  ) : (
                    formatCurrency(shipping)
                  )}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[#46A520]">
                  <span>Desconto Pix</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}
              {cupomAplicado && (
                <div className="flex justify-between text-[#46A520]">
                  <span>Cupom ({cupomAplicado.codigo})</span>
                  <span>-{formatCurrency(cupomAplicado.desconto)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-white text-base border-t border-[#E5E5E5] pt-3">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#46A520] py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#46A520]/25 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Lock className="h-4 w-4" />
              )}
              {loading ? "Processando..." : "Finalizar Pedido"}
            </button>

            {/* Campo Cupom */}
            <div style={{ marginTop: 16 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 8 }}>Cupom de Desconto</p>
              {cupomAplicado ? (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'rgba(70,165,32,0.1)', border: '1px solid #46A520', borderRadius: 8 }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#46A520', margin: 0 }}>{'\u2713'} {cupomAplicado.codigo}</p>
                    <p style={{ fontSize: 12, color: '#888', margin: 0 }}>-R$ {cupomAplicado.desconto.toFixed(2).replace('.', ',')}</p>
                  </div>
                  <button onClick={() => { setCupomAplicado(null); setCupomCodigo('') }}
                    style={{ background: 'transparent', border: 'none', color: '#F0484A', cursor: 'pointer', fontSize: 12 }}>
                    Remover
                  </button>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      value={cupomCodigo}
                      onChange={e => setCupomCodigo(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                      placeholder="C\u00d3DIGO DO CUPOM"
                      style={{ flex: 1, background: 'var(--secondary)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 12px', fontSize: 13, color: '#fff', textTransform: 'uppercase' }}
                    />
                    <button onClick={aplicarCupom} disabled={cupomLoading}
                      style={{ background: '#DAA520', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 16px', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                      {cupomLoading ? '...' : 'Aplicar'}
                    </button>
                  </div>
                  {cupomErro && <p style={{ fontSize: 12, color: '#F0484A', marginTop: 6 }}>{cupomErro}</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
