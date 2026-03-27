"use client";

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
  const { items, removeItem, updateQuantity, getTotal, clearCart } =
    useCartStore();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-[var(--muted-foreground)]/30 mb-6" />
        <h1 className="text-2xl font-bold text-white mb-2">
          Seu carrinho está vazio
        </h1>
        <p className="text-[var(--muted-foreground)] mb-8">
          Que tal explorar nossos produtos?
        </p>
        <Link
          href="/produtos"
          className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white"
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
  
  let shipping = subtotal >= 250 ? 0 : 19.9;
  let pixDiscount = subtotal * 0.1;
  
  // Special pricing for test product only
  if (isTestProductOnly && items.length > 0) {
    shipping = 0; // Free shipping
    pixDiscount = subtotal + 19.90 - 0.10; // Discount to make total exactly R$0.10
  }
  
  const total = subtotal + shipping;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Carrinho</h1>
        <button
          onClick={clearCart}
          className="text-sm text-[var(--muted-foreground)] hover:text-red-400 transition-colors"
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
              className="flex gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4"
            >
              <div className="h-24 w-24 shrink-0 rounded-xl bg-[var(--secondary)] flex items-center justify-center">
                {item.type === "camiseta" ? (
                  <Shirt className="h-10 w-10 text-[var(--muted-foreground)]/30" />
                ) : (
                  <Mouse className="h-10 w-10 text-[var(--muted-foreground)]/30" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white truncate">
                  {item.name}
                </h3>
                <div className="mt-1 flex flex-wrap gap-2 text-xs text-[var(--muted-foreground)]">
                  {item.size && <span>Tamanho: {item.size}</span>}
                  {item.color && <span>Cor: {item.color}</span>}
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="inline-flex items-center rounded-lg border border-[var(--border)]">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          Math.max(1, item.quantity - 1)
                        )
                      }
                      className="px-2 py-1 text-[var(--muted-foreground)] hover:text-white"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="px-3 py-1 text-sm text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                      className="px-2 py-1 text-[var(--muted-foreground)] hover:text-white"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-white">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-[var(--muted-foreground)] hover:text-red-400 transition-colors"
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
          <div className="sticky top-24 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
            <h2 className="text-lg font-bold text-white mb-4">
              Resumo do Pedido
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-[var(--muted-foreground)]">
                <span>
                  Subtotal ({items.length} item
                  {items.length !== 1 ? "s" : ""})
                </span>
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
              <div className="border-t border-[var(--border)] pt-3 flex justify-between font-bold text-white text-base">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between text-[var(--success)] text-xs">
                <span>No Pix (10% off)</span>
                <span>{formatCurrency(total - pixDiscount)}</span>
              </div>
            </div>

            {shipping > 0 && (
              <p className="mt-4 text-xs text-[var(--muted-foreground)] bg-[var(--secondary)] rounded-lg p-3">
                Falta {formatCurrency(250 - subtotal)} para frete grátis!
              </p>
            )}

            <Link
              href="/checkout"
              className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] py-3 text-sm font-semibold text-white shadow-lg shadow-[var(--primary)]/25 hover:shadow-[var(--primary)]/40 transition-all"
            >
              <CreditCard className="h-4 w-4" />
              Finalizar Compra
            </Link>

            <Link
              href="/produtos"
              className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] py-3 text-sm font-medium text-[var(--muted-foreground)] hover:text-white transition-colors"
            >
              Continuar Comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
