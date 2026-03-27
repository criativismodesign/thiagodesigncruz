import Link from "next/link";
import {
  Palette,
  Truck,
  Shield,
  CreditCard,
  Star,
  ArrowRight,
  Sparkles,
  Shirt,
  Mouse,
} from "lucide-react";

const featuredProducts = [
  {
    id: "1",
    name: "Camiseta Nebulosa Cósmica",
    slug: "camiseta-nebulosa-cosmica",
    price: 0.1,
    comparePrice: null,
    image: "/placeholder-shirt-1.svg",
    type: "camiseta",
    tag: "Novo",
  },
  {
    id: "2",
    name: "Mouse Pad Aurora Boreal",
    slug: "mousepad-aurora-boreal",
    price: 0.1,
    comparePrice: null,
    image: "/placeholder-mousepad-1.svg",
    type: "mousepad",
    tag: "Mais Vendido",
  },
  {
    id: "3",
    name: "Camiseta Dragão Oriental",
    slug: "camiseta-dragao-oriental",
    price: 0.1,
    comparePrice: null,
    image: "/placeholder-shirt-2.svg",
    type: "camiseta",
    tag: "Destaque",
  },
  {
    id: "4",
    name: "Mouse Pad Galáxia Neon",
    slug: "mousepad-galaxia-neon",
    price: 0.1,
    comparePrice: null,
    image: "/placeholder-mousepad-2.svg",
    type: "mousepad",
    tag: null,
  },
  {
    id: "5",
    name: "Camiseta Samurai Cyber",
    slug: "camiseta-samurai-cyber",
    price: 0.1,
    comparePrice: null,
    image: "/placeholder-shirt-3.svg",
    type: "camiseta",
    tag: "Edição Limitada",
  },
  {
    id: "6",
    name: "Mouse Pad Floresta Mística",
    slug: "mousepad-floresta-mistica",
    price: 0.1,
    comparePrice: null,
    image: "/placeholder-mousepad-3.svg",
    type: "mousepad",
    tag: null,
  },
];

const testimonials = [
  {
    name: "Lucas M.",
    rating: 5,
    comment:
      "Qualidade incrível! A estampa ficou exatamente como eu criei no editor. Super recomendo!",
  },
  {
    name: "Ana P.",
    rating: 5,
    comment:
      "O mouse pad é sensacional, cores vibrantes e material premium. Já é o segundo que compro!",
  },
  {
    name: "Rafael S.",
    rating: 5,
    comment:
      "Camiseta muito confortável e a estampa não desbota. Entrega rápida e embalagem caprichada.",
  },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/20 via-transparent to-[var(--accent)]/10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-[var(--primary)]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[var(--accent)]/10 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--secondary)] px-4 py-1.5 mb-6">
              <Sparkles className="h-4 w-4 text-[var(--accent)]" />
              <span className="text-sm text-[var(--muted-foreground)]">
                Crie designs únicos do seu jeito
              </span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
              <span className="block text-white">Sua Arte,</span>
              <span className="block gradient-text mt-2">Seu Estilo</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-[var(--muted-foreground)] leading-relaxed">
              Camisetas e mouse pads com estampas personalizadas. Use nosso
              editor para criar sua própria arte ou escolha entre nossos designs
              exclusivos feitos à mão.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/produtos"
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-[var(--primary)]/25 hover:shadow-[var(--primary)]/40 transition-all duration-300 hover:-translate-y-0.5"
              >
                Ver Produtos
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/criar-design"
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--secondary)] px-8 py-3.5 text-base font-semibold text-white hover:bg-[var(--border)] transition-all duration-300"
              >
                <Palette className="h-5 w-5 text-[var(--accent)]" />
                Crie Sua Arte
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Link
            href="/produtos?categoria=camisetas"
            className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[var(--card)] to-[var(--secondary)] p-8 sm:p-12 transition-all duration-300 hover:border-[var(--primary)]/50 hover:shadow-xl hover:shadow-[var(--primary)]/10"
          >
            <div className="relative z-10">
              <div className="mb-4 inline-flex rounded-xl bg-[var(--primary)]/10 p-3">
                <Shirt className="h-8 w-8 text-[var(--primary)]" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Camisetas</h3>
              <p className="text-[var(--muted-foreground)] mb-4">
                Camisetas premium com estampas exclusivas. Disponíveis em
                diversos tamanhos.
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-[var(--accent)] group-hover:gap-2 transition-all">
                Explorar <ArrowRight className="h-4 w-4" />
              </span>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Shirt className="h-40 w-40 text-[var(--primary)]" />
            </div>
          </Link>

          <Link
            href="/produtos?categoria=mousepads"
            className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[var(--card)] to-[var(--secondary)] p-8 sm:p-12 transition-all duration-300 hover:border-[var(--accent)]/50 hover:shadow-xl hover:shadow-[var(--accent)]/10"
          >
            <div className="relative z-10">
              <div className="mb-4 inline-flex rounded-xl bg-[var(--accent)]/10 p-3">
                <Mouse className="h-8 w-8 text-[var(--accent)]" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Mouse Pads
              </h3>
              <p className="text-[var(--muted-foreground)] mb-4">
                Mouse pads com qualidade gamer e designs únicos. Superfície
                otimizada.
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-[var(--accent)] group-hover:gap-2 transition-all">
                Explorar <ArrowRight className="h-4 w-4" />
              </span>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Mouse className="h-40 w-40 text-[var(--accent)]" />
            </div>
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Produtos em Destaque
          </h2>
          <p className="mt-3 text-[var(--muted-foreground)]">
            Confira nossos designs mais populares
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProducts.map((product, index) => (
            <Link
              key={product.id}
              href={`/produtos/${product.slug}`}
              className="group rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden transition-all duration-300 hover:border-[var(--primary)]/50 hover:shadow-xl hover:shadow-[var(--primary)]/5 hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative aspect-square bg-[var(--secondary)] flex items-center justify-center overflow-hidden">
                <div className="text-6xl text-[var(--muted-foreground)]/30">
                  {product.type === "camiseta" ? (
                    <Shirt className="h-24 w-24" />
                  ) : (
                    <Mouse className="h-24 w-24" />
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

        <div className="mt-12 text-center">
          <Link
            href="/produtos"
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-6 py-3 text-sm font-medium text-white hover:bg-[var(--secondary)] transition-colors"
          >
            Ver Todos os Produtos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Custom Design CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-to-br from-[var(--primary)]/20 via-[var(--card)] to-[var(--accent)]/20 p-8 sm:p-16">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-10 left-10 w-32 h-32 bg-[var(--primary)]/20 rounded-full blur-2xl" />
            <div className="absolute bottom-10 right-10 w-48 h-48 bg-[var(--accent)]/20 rounded-full blur-2xl" />
          </div>
          <div className="relative z-10 text-center">
            <div className="inline-flex rounded-2xl bg-[var(--primary)]/10 p-4 mb-6">
              <Palette className="h-12 w-12 text-[var(--accent)]" />
            </div>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Crie Sua Própria Arte
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[var(--muted-foreground)] leading-relaxed">
              Use nosso editor online para criar estampas únicas. Escolha entre
              camiseta ou mouse pad, faça upload das suas imagens, adicione
              textos e crie algo verdadeiramente seu.
            </p>
            <Link
              href="/criar-design"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-[var(--primary)]/25 hover:shadow-[var(--primary)]/40 transition-all duration-300 hover:-translate-y-0.5"
            >
              Abrir Editor
              <Sparkles className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            O Que Nossos Clientes Dizem
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-yellow-500 text-yellow-500"
                  />
                ))}
              </div>
              <p className="text-[var(--muted-foreground)] leading-relaxed mb-4">
                &ldquo;{testimonial.comment}&rdquo;
              </p>
              <p className="font-semibold text-white">{testimonial.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="border-t border-[var(--border)] bg-[var(--card)]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto mb-4 inline-flex rounded-xl bg-[var(--primary)]/10 p-3">
                <Truck className="h-6 w-6 text-[var(--primary)]" />
              </div>
              <h3 className="font-semibold text-white">Frete Grátis</h3>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                Acima de R$250
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 inline-flex rounded-xl bg-[var(--primary)]/10 p-3">
                <CreditCard className="h-6 w-6 text-[var(--primary)]" />
              </div>
              <h3 className="font-semibold text-white">Parcelamento</h3>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                Em até 12x sem juros
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 inline-flex rounded-xl bg-[var(--primary)]/10 p-3">
                <Shield className="h-6 w-6 text-[var(--primary)]" />
              </div>
              <h3 className="font-semibold text-white">Pagamento Seguro</h3>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                Seus dados protegidos
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 inline-flex rounded-xl bg-[var(--primary)]/10 p-3">
                <Palette className="h-6 w-6 text-[var(--primary)]" />
              </div>
              <h3 className="font-semibold text-white">Design Exclusivo</h3>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                Crie sua própria arte
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
