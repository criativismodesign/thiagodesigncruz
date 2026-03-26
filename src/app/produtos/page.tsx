"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Shirt,
  Mouse,
  SlidersHorizontal,
  Grid3X3,
  LayoutList,
} from "lucide-react";

const allProducts = [
  { id: "1", name: "Camiseta Nebulosa Cósmica", slug: "camiseta-nebulosa-cosmica", price: 89.9, comparePrice: 119.9, type: "camiseta", tag: "Novo", sizes: ["P", "M", "G", "GG"] },
  { id: "2", name: "Mouse Pad Aurora Boreal", slug: "mousepad-aurora-boreal", price: 59.9, comparePrice: 79.9, type: "mousepad", tag: "Mais Vendido", sizes: [] },
  { id: "3", name: "Camiseta Dragão Oriental", slug: "camiseta-dragao-oriental", price: 99.9, comparePrice: 129.9, type: "camiseta", tag: "Destaque", sizes: ["P", "M", "G", "GG"] },
  { id: "4", name: "Mouse Pad Galáxia Neon", slug: "mousepad-galaxia-neon", price: 69.9, comparePrice: null, type: "mousepad", tag: null, sizes: [] },
  { id: "5", name: "Camiseta Samurai Cyber", slug: "camiseta-samurai-cyber", price: 109.9, comparePrice: 139.9, type: "camiseta", tag: "Edição Limitada", sizes: ["P", "M", "G", "GG"] },
  { id: "6", name: "Mouse Pad Floresta Mística", slug: "mousepad-floresta-mistica", price: 54.9, comparePrice: null, type: "mousepad", tag: null, sizes: [] },
  { id: "7", name: "Camiseta Lobo Geométrico", slug: "camiseta-lobo-geometrico", price: 94.9, comparePrice: null, type: "camiseta", tag: null, sizes: ["P", "M", "G", "GG"] },
  { id: "8", name: "Mouse Pad Oceano Digital", slug: "mousepad-oceano-digital", price: 64.9, comparePrice: 84.9, type: "mousepad", tag: "Promoção", sizes: [] },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

export default function ProductsPage() {
  const [filter, setFilter] = useState<"todos" | "camiseta" | "mousepad">("todos");
  const [sortBy, setSortBy] = useState<"recent" | "price-asc" | "price-desc">("recent");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filtered = allProducts
    .filter((p) => filter === "todos" || p.type === filter)
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return 0;
    });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Nossos Produtos</h1>
        <p className="mt-2 text-[var(--muted-foreground)]">
          Camisetas e mouse pads com designs exclusivos
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter("todos")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              filter === "todos"
                ? "bg-[var(--primary)] text-white"
                : "bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-white"
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilter("camiseta")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              filter === "camiseta"
                ? "bg-[var(--primary)] text-white"
                : "bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-white"
            }`}
          >
            <Shirt className="h-4 w-4" /> Camisetas
          </button>
          <button
            onClick={() => setFilter("mousepad")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              filter === "mousepad"
                ? "bg-[var(--primary)] text-white"
                : "bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-white"
            }`}
          >
            <Mouse className="h-4 w-4" /> Mouse Pads
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="h-4 w-4 text-[var(--muted-foreground)]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="rounded-lg border border-[var(--border)] bg-[var(--secondary)] px-3 py-2 text-sm text-white focus:border-[var(--primary)] focus:outline-none"
            >
              <option value="recent">Mais Recentes</option>
              <option value="price-asc">Menor Preço</option>
              <option value="price-desc">Maior Preço</option>
            </select>
          </div>

          <div className="flex rounded-lg border border-[var(--border)] overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 ${viewMode === "grid" ? "bg-[var(--primary)] text-white" : "bg-[var(--secondary)] text-[var(--muted-foreground)]"}`}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 ${viewMode === "list" ? "bg-[var(--primary)] text-white" : "bg-[var(--secondary)] text-[var(--muted-foreground)]"}`}
            >
              <LayoutList className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Product count */}
      <p className="mb-6 text-sm text-[var(--muted-foreground)]">
        {filtered.length} produto{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* Products Grid */}
      <div className={viewMode === "grid" ? "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "flex flex-col gap-4"}>
        {filtered.map((product) => (
          <Link
            key={product.id}
            href={`/produtos/${product.slug}`}
            className={`group rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden transition-all duration-300 hover:border-[var(--primary)]/50 hover:shadow-xl hover:shadow-[var(--primary)]/5 hover:-translate-y-1 ${
              viewMode === "list" ? "flex flex-row" : ""
            }`}
          >
            <div className={`relative bg-[var(--secondary)] flex items-center justify-center overflow-hidden ${
              viewMode === "list" ? "w-48 h-48 shrink-0" : "aspect-square"
            }`}>
              <div className="text-[var(--muted-foreground)]/30">
                {product.type === "camiseta" ? (
                  <Shirt className="h-20 w-20" />
                ) : (
                  <Mouse className="h-20 w-20" />
                )}
              </div>
              {product.tag && (
                <span className="absolute top-3 left-3 rounded-lg bg-[var(--primary)] px-3 py-1 text-xs font-bold text-white">
                  {product.tag}
                </span>
              )}
            </div>
            <div className="p-5">
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)] mb-1">
                {product.type === "camiseta" ? "Camiseta" : "Mouse Pad"}
              </p>
              <h3 className="font-semibold text-white group-hover:text-[var(--accent)] transition-colors">
                {product.name}
              </h3>
              {product.sizes.length > 0 && (
                <div className="mt-2 flex gap-1">
                  {product.sizes.map((size) => (
                    <span key={size} className="rounded border border-[var(--border)] px-1.5 py-0.5 text-[10px] text-[var(--muted-foreground)]">
                      {size}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-2 flex items-center gap-2">
                <span className="text-lg font-bold text-white">
                  {formatCurrency(product.price)}
                </span>
                {product.comparePrice && (
                  <span className="text-sm text-[var(--muted-foreground)] line-through">
                    {formatCurrency(product.comparePrice)}
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-[var(--success)]">
                {formatCurrency(product.price * 0.9)} no Pix
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
