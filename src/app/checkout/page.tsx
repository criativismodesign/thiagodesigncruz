"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart-store";
import { Loader2, Lock, CreditCard, QrCode, Barcode } from "lucide-react";
import { toast } from "sonner";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<
    "pix" | "credit" | "boleto"
  >("pix");
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
  const shipping = subtotal >= 250 ? 0 : 19.9;
  const discount = paymentMethod === "pix" ? subtotal * 0.1 : 0;
  const total = subtotal + shipping - discount;

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
    setLoading(true);
    // Simular processamento
    await new Promise((resolve) => setTimeout(resolve, 2000));
    toast.success("Pedido realizado com sucesso!");
    clearCart();
    router.push("/pedido-confirmado");
    setLoading(false);
  };

  if (items.length === 0) {
    router.push("/carrinho");
    return null;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-center gap-2 mb-8">
        <Lock className="h-5 w-5 text-[var(--success)]" />
        <h1 className="text-3xl font-bold text-white">Checkout Seguro</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-8 lg:grid-cols-5"
      >
        {/* Form */}
        <div className="lg:col-span-3 space-y-6">
          {/* Personal Info */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
            <h2 className="text-lg font-bold text-white mb-4">
              Dados Pessoais
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm text-[var(--muted-foreground)] mb-1">
                  Nome completo
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--secondary)] px-4 py-2.5 text-sm text-white focus:border-[var(--primary)] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--muted-foreground)] mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--secondary)] px-4 py-2.5 text-sm text-white focus:border-[var(--primary)] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--muted-foreground)] mb-1">
                  Telefone
                </label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--secondary)] px-4 py-2.5 text-sm text-white focus:border-[var(--primary)] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--muted-foreground)] mb-1">
                  CPF
                </label>
                <input
                  type="text"
                  required
                  value={form.cpf}
                  onChange={(e) => setForm({ ...form, cpf: e.target.value })}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--secondary)] px-4 py-2.5 text-sm text-white focus:border-[var(--primary)] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
            <h2 className="text-lg font-bold text-white mb-4">Endereço</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm text-[var(--muted-foreground)] mb-1">
                  CEP
                </label>
                <input
                  type="text"
                  required
                  value={form.cep}
                  onChange={(e) => setForm({ ...form, cep: e.target.value })}
                  onBlur={handleCepLookup}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--secondary)] px-4 py-2.5 text-sm text-white focus:border-[var(--primary)] focus:outline-none"
                  placeholder="00000-000"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm text-[var(--muted-foreground)] mb-1">
                  Rua
                </label>
                <input
                  type="text"
                  required
                  value={form.street}
                  onChange={(e) => setForm({ ...form, street: e.target.value })}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--secondary)] px-4 py-2.5 text-sm text-white focus:border-[var(--primary)] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--muted-foreground)] mb-1">
                  Número
                </label>
                <input
                  type="text"
                  required
                  value={form.number}
                  onChange={(e) => setForm({ ...form, number: e.target.value })}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--secondary)] px-4 py-2.5 text-sm text-white focus:border-[var(--primary)] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--muted-foreground)] mb-1">
                  Complemento
                </label>
                <input
                  type="text"
                  value={form.complement}
                  onChange={(e) =>
                    setForm({ ...form, complement: e.target.value })
                  }
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--secondary)] px-4 py-2.5 text-sm text-white focus:border-[var(--primary)] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--muted-foreground)] mb-1">
                  Bairro
                </label>
                <input
                  type="text"
                  required
                  value={form.neighborhood}
                  onChange={(e) =>
                    setForm({ ...form, neighborhood: e.target.value })
                  }
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--secondary)] px-4 py-2.5 text-sm text-white focus:border-[var(--primary)] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--muted-foreground)] mb-1">
                  Cidade
                </label>
                <input
                  type="text"
                  required
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--secondary)] px-4 py-2.5 text-sm text-white focus:border-[var(--primary)] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--muted-foreground)] mb-1">
                  Estado
                </label>
                <input
                  type="text"
                  required
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--secondary)] px-4 py-2.5 text-sm text-white focus:border-[var(--primary)] focus:outline-none"
                  placeholder="UF"
                />
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
            <h2 className="text-lg font-bold text-white mb-4">Pagamento</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => setPaymentMethod("pix")}
                className={`flex items-center gap-3 rounded-xl border p-4 transition-colors ${
                  paymentMethod === "pix"
                    ? "border-[var(--primary)] bg-[var(--primary)]/10"
                    : "border-[var(--border)] hover:border-[var(--primary)]/50"
                }`}
              >
                <QrCode className="h-5 w-5 text-[var(--accent)]" />
                <div className="text-left">
                  <p className="text-sm font-medium text-white">Pix</p>
                  <p className="text-xs text-[var(--success)]">10% off</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("credit")}
                className={`flex items-center gap-3 rounded-xl border p-4 transition-colors ${
                  paymentMethod === "credit"
                    ? "border-[var(--primary)] bg-[var(--primary)]/10"
                    : "border-[var(--border)] hover:border-[var(--primary)]/50"
                }`}
              >
                <CreditCard className="h-5 w-5 text-[var(--accent)]" />
                <div className="text-left">
                  <p className="text-sm font-medium text-white">Cartão</p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    Até 12x
                  </p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("boleto")}
                className={`flex items-center gap-3 rounded-xl border p-4 transition-colors ${
                  paymentMethod === "boleto"
                    ? "border-[var(--primary)] bg-[var(--primary)]/10"
                    : "border-[var(--border)] hover:border-[var(--primary)]/50"
                }`}
              >
                <Barcode className="h-5 w-5 text-[var(--accent)]" />
                <div className="text-left">
                  <p className="text-sm font-medium text-white">Boleto</p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    3 dias úteis
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-2">
          <div className="sticky top-24 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
            <h2 className="text-lg font-bold text-white mb-4">
              Resumo do Pedido
            </h2>
            <div className="space-y-2 text-sm mb-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between text-[var(--muted-foreground)]"
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
            <div className="space-y-2 border-t border-[var(--border)] pt-4 text-sm">
              <div className="flex justify-between text-[var(--muted-foreground)]">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[var(--muted-foreground)]">
                <span>Frete</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-[var(--success)]">Grátis</span>
                  ) : (
                    formatCurrency(shipping)
                  )}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[var(--success)]">
                  <span>Desconto Pix</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-white text-base border-t border-[var(--border)] pt-3">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] py-3.5 text-sm font-semibold text-white shadow-lg shadow-[var(--primary)]/25 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Lock className="h-4 w-4" />
              )}
              {loading ? "Processando..." : "Finalizar Pedido"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
