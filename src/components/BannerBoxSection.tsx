"use client";

import Image from "next/image";
import Link from "next/link";

// Array de dados dos banners
const banners = [
  {
    id: 'esquerdo',
    image: '/imagens/hero/DUAL-BANNER-ESQUERDO-SITE-USE-KIN-LISTA-VIP-960x750px.jpg',
    cta: { 
      label: 'ENTRE EM CONTATO AGORA!', 
      href: 'https://wa.me/5562981316462?text=Ol%C3%A1!%20Quero%20saber%20mais%20sobre%20como%20funciona%20para%20personalizar%20uma%20camiseta.' 
    },
  },
  {
    id: 'direito',
    image: '/imagens/hero/DUAL-BANNER-DIREITO-SITE-USE-KIN-LISTA-VIP-960x750px.jpg',
    cta: { 
      label: 'ENTRE EM CONTATO AGORA!', 
      href: 'https://wa.me/5562981316462?text=Ol%C3%A1!%20Quero%20saber%20mais%20sobre%20como%20funciona%20para%20personalizar%20uma%20desckpad.' 
    },
  },
];

export default function BannerBoxSection() {
  return (
    <section className="w-full flex flex-col lg:flex-row">
      {banners.map((banner) => (
        <div
          key={banner.id}
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '960/750',
            overflow: 'hidden',
          }}
          className="lg:w-1/2"
        >
          {/* Imagem de fundo */}
          <Image
            src={banner.image}
            alt={banner.id}
            fill
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />

          {/* Bloco de conteúdo */}
          <div
            className="relative flex flex-col justify-center lg:!p-[65px]"
            style={{
              zIndex: 1,
              padding: '32px 24px',
              height: '100%',
            }}
          >
            {/* Título - Bloco 1: PERSO NALIZE */}
            <div
              className="font-extrabold uppercase lg:!text-[50px]"
              style={{
                fontSize: '30px',
                color: '#FFFFFF',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 800,
                lineHeight: '1.1',
                textTransform: 'uppercase',
              }}
            >
              PERSO
              <br />
              NALIZE
            </div>

            {/* Título - Bloco 2: DO SEU JEITO */}
            <div
              className="font-light uppercase lg:!text-[50px]"
              style={{
                fontSize: '30px',
                color: '#FFFFFF',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 300,
                lineHeight: '1.1',
                textTransform: 'uppercase',
                marginTop: '0',
              }}
            >
              DO SEU
              <br />
              JEITO
            </div>

            {/* Botão */}
            <Link
              href={banner.cta.href}
              className="inline-block font-extrabold uppercase rounded-full transition-all lg:!mt-[32px] lg:!text-[15px] lg:!p-[14px_36px]"
              style={{
                fontSize: '13px',
                color: '#FFFFFF',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 800,
                backgroundColor: 'transparent',
                border: '1px solid #FFFFFF',
                borderRadius: '999px',
                padding: '12px 24px',
                marginTop: '16px',
                width: 'fit-content',
                textDecoration: 'none',
                transition: 'color 0.3s ease, border-color 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#DAA520';
                e.currentTarget.style.borderColor = '#DAA520';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#FFFFFF';
                e.currentTarget.style.borderColor = '#FFFFFF';
              }}
            >
              {banner.cta.label}
            </Link>
          </div>
        </div>
      ))}
    </section>
  );
}
