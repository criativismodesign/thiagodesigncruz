"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice: number | null;
  image: string;
  type: string;
  tag?: string;
}

interface RelatedProductsProps {
  currentProductType: string;
  currentProductId: string;
}

export default function RelatedProducts({ currentProductType, currentProductId }: RelatedProductsProps) {
  // Mock data - in a real app, this would come from an API
  const allProducts: Product[] = [
    {
      id: "1",
      name: "Camiseta Nebulosa Cósmica",
      slug: "camiseta-nebulosa-cosmica",
      price: 89.9,
      comparePrice: 119.9,
      image: "/placeholder-shirt-1.svg",
      type: "camiseta",
      tag: "Novo",
    },
    {
      id: "2",
      name: "Mouse Pad Aurora Boreal",
      slug: "mousepad-aurora-boreal",
      price: 59.9,
      comparePrice: 79.9,
      image: "/placeholder-mousepad-1.svg",
      type: "mousepad",
      tag: "Mais Vendido",
    },
    {
      id: "3",
      name: "Camiseta Dragão Oriental",
      slug: "camiseta-dragao-oriental",
      price: 99.9,
      comparePrice: 129.9,
      image: "/placeholder-shirt-2.svg",
      type: "camiseta",
      tag: "Destaque",
    },
    {
      id: "4",
      name: "Mouse Pad Galáxia Neon",
      slug: "mousepad-galaxia-neon",
      price: 69.9,
      comparePrice: null,
      image: "/placeholder-mousepad-2.svg",
      type: "mousepad",
    },
    {
      id: "5",
      name: "Camiseta Samurai Cyber",
      slug: "camiseta-samurai-cyber",
      price: 109.9,
      comparePrice: 139.9,
      image: "/placeholder-shirt-3.svg",
      type: "camiseta",
      tag: "Edição Limitada",
    },
    {
      id: "6",
      name: "Mouse Pad Floresta Mística",
      slug: "mousepad-floresta-mistica",
      price: 54.9,
      comparePrice: null,
      image: "/placeholder-mousepad-3.svg",
      type: "mousepad",
    },
    {
      id: "7",
      name: "Camiseta Lobo Geométrico",
      slug: "camiseta-lobo-geometrico",
      price: 94.9,
      comparePrice: null,
      image: "/placeholder-shirt-4.svg",
      type: "camiseta",
    },
    {
      id: "8",
      name: "Mouse Pad Oceano Digital",
      slug: "mousepad-oceano-digital",
      price: 64.9,
      comparePrice: 84.9,
      image: "/placeholder-mousepad-4.svg",
      type: "mousepad",
      tag: "Promoção",
    },
  ];

  // Filter products by type (same category) and exclude current product
  const relatedProducts = allProducts
    .filter(product => product.type === currentProductType && product.id !== currentProductId)
    .slice(0, 4); // Limit to 4 products

  if (relatedProducts.length === 0) {
    return null;
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <section className="mt-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white">Você Também Pode Gostar</h2>
        <Link
          href={`/produtos?categoria=${currentProductType === "camiseta" ? "camisetas" : "mousepads"}`}
          className="flex items-center gap-2 text-[var(--accent)] hover:text-white transition-colors"
        >
          Ver Todos
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <div
            key={product.id}
            className="group rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden transition-all duration-300 hover:border-[var(--primary)]/50 hover:shadow-xl hover:shadow-[var(--primary)]/10"
          >
            {/* Product Image */}
            <div className="relative aspect-square overflow-hidden bg-[var(--secondary)]">
              <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-30 transition-opacity">
                {product.type === "camiseta" ? (
                  <svg className="h-24 w-24 text-[var(--muted-foreground)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                ) : (
                  <svg className="h-24 w-24 text-[var(--muted-foreground)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={1} />
                  </svg>
                )}
              </div>
              
              {/* Tag */}
              {product.tag && (
                <div className="absolute top-3 left-3 rounded-full bg-[var(--primary)] px-3 py-1 text-xs font-semibold text-white">
                  {product.tag}
                </div>
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Link
                  href={`/produtos/${product.slug}`}
                  className="rounded-lg bg-white text-black px-4 py-2 text-sm font-semibold hover:bg-gray-200 transition-colors"
                >
                  Ver Produto
                </Link>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-4">
              <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-[var(--accent)] transition-colors">
                {product.name}
              </h3>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-white">
                      {formatCurrency(product.price)}
                    </span>
                    {product.comparePrice && (
                      <span className="text-sm text-[var(--muted-foreground)] line-through">
                        {formatCurrency(product.comparePrice)}
                      </span>
                    )}
                  </div>
                  {product.comparePrice && (
                    <div className="text-xs text-[var(--success)]">
                      {Math.round((1 - product.price / product.comparePrice) * 100)}% OFF
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
