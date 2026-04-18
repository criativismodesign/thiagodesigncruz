import Link from "next/link";
import { Palette, Heart, Award, Users } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre Nós",
  description:
    "Conheça a Thiago Design Cruz. Criamos camisetas e mouse pads com designs exclusivos e personalizados. Qualidade premium e arte em cada peça.",
  alternates: {
    canonical: "https://thiagodesigncruz.com.br/sobre",
  },
  openGraph: {
    title: "Sobre a Thiago Design Cruz",
    description:
      "Criamos camisetas e mouse pads com designs exclusivos e personalizados. Qualidade premium e arte em cada peça.",
    url: "https://thiagodesigncruz.com.br/sobre",
  },
};

export default function AboutPage() {
  return (
    <main className="px-4 py-10 lg:px-[120px] lg:py-[100px]">
      {/* Hero */}
      <div className="text-center mb-16">
        <div className="inline-flex rounded-2xl bg-[var(--primary)]/10 p-4 mb-6">
          <Palette className="h-10 w-10 text-[var(--primary)]" />
        </div>
        <h1 style={{
          fontSize: 'clamp(28px, 5vw, 48px)',
          fontWeight: 600,
          color: '#292929',
          textTransform: 'uppercase',
          marginBottom: '16px',
          fontFamily: 'Inter, sans-serif'
        }}>
          SOBRE A THIAGO DESIGN CRUZ
        </h1>
        <p style={{
          fontSize: '18px',
          color: '#AAAAAA',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 400,
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          Transformamos ideias em arte vestível. Cada peça é criada com paixão,
          qualidade e atenção aos detalhes.
        </p>
      </div>

      {/* Story */}
      <section style={{ marginBottom: '64px' }}>
        <h2 style={{
          fontSize: '32px',
          fontWeight: 600,
          color: '#292929',
          textTransform: 'uppercase',
          marginBottom: '24px',
          fontFamily: 'Inter, sans-serif'
        }}>
          Nossa História
        </h2>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          fontSize: '18px',
          color: '#AAAAAA',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 400,
          lineHeight: 1.6
        }}>
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
      <section style={{ marginBottom: '64px' }}>
        <h2 style={{
          fontSize: '32px',
          fontWeight: 600,
          color: '#292929',
          textTransform: 'uppercase',
          marginBottom: '32px',
          fontFamily: 'Inter, sans-serif'
        }}>
          Nossos Valores
        </h2>
        <div style={{
          display: 'grid',
          gap: '24px'
        }}
        className="grid-cols-1 lg:grid-cols-2"
        >
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
              style={{
                borderRadius: '16px',
                border: '1px solid #E5E5E5',
                backgroundColor: '#FFFFFF',
                padding: '24px'
              }}
            >
              <div style={{
                marginBottom: '16px',
                display: 'inline-flex',
                borderRadius: '12px',
                backgroundColor: '#DAA52020',
                padding: '12px'
              }}>
                <value.icon style={{ height: '24px', width: '24px', color: '#DAA520' }} />
              </div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 600,
                color: '#292929',
                marginBottom: '8px',
                fontFamily: 'Inter, sans-serif'
              }}>
                {value.title}
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#AAAAAA',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400,
                lineHeight: 1.5
              }}>
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        textAlign: 'center',
        borderRadius: '16px',
        border: '1px solid #E5E5E5',
        background: 'linear-gradient(135deg, #DAA52010, #46A52010)',
        padding: '48px'
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 600,
          color: '#292929',
          marginBottom: '16px',
          fontFamily: 'Inter, sans-serif'
        }}>
          Pronto para criar algo incrível?
        </h2>
        <p style={{
          color: '#AAAAAA',
          marginBottom: '32px',
          maxWidth: '400px',
          margin: '0 auto 32px',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 400,
          fontSize: '16px'
        }}>
          Explore nossa coleção ou crie seu próprio design personalizado.
        </p>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          flexWrap: 'wrap'
        }}>
          <Link
            href="/categorias/todos-produtos"
            style={{
              borderRadius: '999px',
              backgroundColor: '#DAA520',
              color: '#FFFFFF',
              padding: '12px 32px',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              fontSize: '16px',
              textDecoration: 'none'
            }}
          >
            Ver Produtos
          </Link>
          <Link
            href="/criar-design"
            style={{
              borderRadius: '999px',
              border: '1px solid #DAA520',
              backgroundColor: 'transparent',
              color: '#DAA520',
              padding: '12px 32px',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              fontSize: '16px',
              textDecoration: 'none'
            }}
          >
            Criar Design
          </Link>
        </div>
      </section>
    </main>
  );
}
