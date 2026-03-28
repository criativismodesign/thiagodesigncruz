"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCartStore } from "@/store/cart-store";
import {
  Shirt,
  Mouse,
  ShoppingCart,
  Minus,
  Plus,
  Star,
  Truck,
  Shield,
  ArrowLeft,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import ProductGallery from "@/components/product/ProductGallery";
import ProductDetails from "@/components/product/ProductDetails";
import RelatedProducts from "@/components/product/RelatedProducts";

const productsDB: Record<string, {
  id: string; name: string; slug: string; price: number; comparePrice: number | null;
  type: string; description: string; sizes: string[]; colors: string[];
}> = {
  "camiseta-nebulosa-cosmica": {
    id: "1", name: "Camiseta Nebulosa Cósmica", slug: "camiseta-nebulosa-cosmica",
    price: 89.9, comparePrice: 119.9, type: "camiseta",
    description: "Camiseta premium com estampa exclusiva de nebulosa cósmica. Tecido 100% algodão penteado, estampa em DTG de alta resolução que não desbota. Perfeita para quem ama o universo e quer um visual único.",
    sizes: ["P", "M", "G", "GG"], colors: ["Preto", "Branco", "Azul Marinho"],
  },
  "mousepad-aurora-boreal": {
    id: "2", name: "Mouse Pad Aurora Boreal", slug: "mousepad-aurora-boreal",
    price: 59.9, comparePrice: 79.9, type: "mousepad",
    description: "Mouse pad gamer com design exclusivo de aurora boreal. Superfície de microfibra premium, base de borracha antiderrapante. Ideal para gaming e uso profissional.",
    sizes: [], colors: [],
  },
  "camiseta-dragao-oriental": {
    id: "3", name: "Camiseta Dragão Oriental", slug: "camiseta-dragao-oriental",
    price: 99.9, comparePrice: 129.9, type: "camiseta",
    description: "Camiseta com arte de dragão oriental em estilo tradicional japonês. Impressão DTG de alta qualidade em algodão premium. Design exclusivo feito à mão.",
    sizes: ["P", "M", "G", "GG"], colors: ["Preto", "Vermelho"],
  },
  "camiseta-teste-pagamento": {
    id: "test", name: "Camiseta e Mouse Pad Teste", slug: "camiseta-teste-pagamento",
    price: 1.0, comparePrice: null, type: "camiseta",
    description: "Produto de teste para validar sistema de pagamento MercadoPago. Valor simbólico de R$1,00 com frete grátis para testar checkout completo.",
    sizes: ["P", "M", "G", "GG"], colors: ["Preto", "Branco"],
  },
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const product = productsDB[slug];
  const addItem = useCartStore((s) => s.addItem);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Produto não encontrado</h1>
        <Link href="/produtos" className="text-[var(--accent)] hover:underline">
          Voltar para produtos
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (product.sizes.length > 0 && !selectedSize) {
      toast.error("Selecione um tamanho");
      return;
    }
    addItem({
      id: "",
      productId: product.slug,
      name: product.name,
      price: product.price,
      image: "",
      quantity,
      size: selectedSize || undefined,
      color: selectedColor || undefined,
      type: product.type,
    });
    toast.success("Produto adicionado ao carrinho!");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/produtos"
        className="inline-flex items-center gap-1 text-sm text-[var(--muted-foreground)] hover:text-white transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar para produtos
      </Link>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Product Image */}
        <ProductGallery 
          images={[
            `/placeholder-${product.type}-1.svg`,
            `/placeholder-${product.type}-2.svg`,
            `/placeholder-${product.type}-3.svg`,
          ]}
          productName={product.name}
        />

        {/* Product Info */}
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-[var(--accent)] mb-2">
            {product.type === "camiseta" ? "Camiseta" : "Mouse Pad"}
          </p>
          <h1 className="text-3xl font-bold text-white">{product.name}</h1>

          <div className="mt-3 flex items-center gap-2">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
              ))}
            </div>
            <span className="text-sm text-[var(--muted-foreground)]">(12 avaliações)</span>
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-white">{formatCurrency(product.price)}</span>
            {product.comparePrice && (
              <span className="text-lg text-[var(--muted-foreground)] line-through">
                {formatCurrency(product.comparePrice)}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-[var(--success)]">
            {formatCurrency(product.price * 0.9)} no Pix (10% off)
          </p>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">
            ou 12x de {formatCurrency(product.price / 12)} sem juros
          </p>

          <p className="mt-6 text-[var(--muted-foreground)] leading-relaxed">
            {product.description}
          </p>

          {/* Size selector */}
          {product.sizes.length > 0 && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-white mb-2">Tamanho</label>
              <div className="flex gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                      selectedSize === size
                        ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                        : "border-[var(--border)] text-[var(--muted-foreground)] hover:border-white hover:text-white"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color selector */}
          {product.colors.length > 0 && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-white mb-2">Cor</label>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                      selectedColor === color
                        ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                        : "border-[var(--border)] text-[var(--muted-foreground)] hover:border-white hover:text-white"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-white mb-2">Quantidade</label>
            <div className="inline-flex items-center rounded-lg border border-[var(--border)]">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 text-[var(--muted-foreground)] hover:text-white"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="px-4 py-2 text-white font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 text-[var(--muted-foreground)] hover:text-white"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            className="mt-8 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] py-3.5 text-base font-semibold text-white shadow-lg shadow-[var(--primary)]/25 hover:shadow-[var(--primary)]/40 transition-all"
          >
            <ShoppingCart className="h-5 w-5" />
            Adicionar ao Carrinho
          </button>

          {/* Benefits */}
          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-3 text-sm text-[var(--muted-foreground)]">
              <Truck className="h-4 w-4 text-[var(--success)]" />
              Frete grátis acima de R$250
            </div>
            <div className="flex items-center gap-3 text-sm text-[var(--muted-foreground)]">
              <Shield className="h-4 w-4 text-[var(--success)]" />
              Pagamento 100% seguro
            </div>
            <div className="flex items-center gap-3 text-sm text-[var(--muted-foreground)]">
              <Check className="h-4 w-4 text-[var(--success)]" />
              Troca grátis em até 30 dias
            </div>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <ProductDetails type={product.type as "camiseta" | "mousepad"} />

      {/* Related Products */}
      <RelatedProducts 
        currentProductType={product.type}
        currentProductId={product.id}
      />
    </div>
  );
}
