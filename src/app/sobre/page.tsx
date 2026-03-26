import Link from "next/link";
import { Palette, Heart, Award, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="text-center mb-16">
        <div className="inline-flex rounded-2xl bg-[var(--primary)]/10 p-4 mb-6">
          <Palette className="h-10 w-10 text-[var(--primary)]" />
        </div>
        <h1 className="text-4xl font-bold text-white sm:text-5xl mb-4">
          Sobre a <span className="gradient-text">Thiago Design Cruz</span>
        </h1>
        <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">
          Transformamos ideias em arte vestível. Cada peça é criada com paixão,
          qualidade e atenção aos detalhes.
        </p>
      </div>

      {/* Story */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-6">Nossa História</h2>
        <div className="space-y-4 text-[var(--muted-foreground)] leading-relaxed">
          <p>
            A Thiago Design Cruz nasceu da paixão por arte e design. O que
            começou como um hobby de criar estampas para camisetas entre amigos
            se transformou em uma marca que leva criatividade e estilo para
            pessoas em todo o Brasil.
          </p>
          <p>
            Acreditamos que cada pessoa é única e merece expressar sua
            personalidade através do que veste e dos acessórios que usa. Por
            isso, além de nossa coleção exclusiva, oferecemos a possibilidade de
            criar designs totalmente personalizados.
          </p>
          <p>
            Utilizamos as melhores técnicas de impressão, como DTF (Direct to
            Film) e sublimação, garantindo cores vibrantes e durabilidade
            excepcional em cada produto.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-8">Nossos Valores</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {[
            {
              icon: Heart,
              title: "Paixão pela Arte",
              description:
                "Cada design é criado com amor e dedicação. Valorizamos a originalidade e a expressão artística em tudo que fazemos.",
            },
            {
              icon: Award,
              title: "Qualidade Premium",
              description:
                "Usamos materiais de primeira linha e técnicas avançadas de impressão para garantir produtos que duram.",
            },
            {
              icon: Users,
              title: "Foco no Cliente",
              description:
                "Seu satisfação é nossa prioridade. Oferecemos atendimento personalizado e suporte em todas as etapas.",
            },
            {
              icon: Palette,
              title: "Criatividade Sem Limites",
              description:
                "Incentivamos nossos clientes a criar designs únicos. Nossa ferramenta de personalização torna isso fácil.",
            },
          ].map((value) => (
            <div
              key={value.title}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6"
            >
              <div className="mb-4 inline-flex rounded-xl bg-[var(--primary)]/10 p-3">
                <value.icon className="h-6 w-6 text-[var(--primary)]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {value.title}
              </h3>
              <p className="text-sm text-[var(--muted-foreground)]">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[var(--primary)]/10 to-[var(--accent)]/10 p-12">
        <h2 className="text-2xl font-bold text-white mb-4">
          Pronto para criar algo incrível?
        </h2>
        <p className="text-[var(--muted-foreground)] mb-8 max-w-md mx-auto">
          Explore nossa coleção ou crie seu próprio design personalizado.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/produtos"
            className="rounded-xl bg-[var(--primary)] px-8 py-3 font-semibold text-white hover:bg-[var(--primary)]/90 transition-colors"
          >
            Ver Produtos
          </Link>
          <Link
            href="/criar-design"
            className="rounded-xl border border-[var(--border)] px-8 py-3 font-semibold text-white hover:bg-[var(--secondary)] transition-colors"
          >
            Criar Design
          </Link>
        </div>
      </section>
    </main>
  );
}
