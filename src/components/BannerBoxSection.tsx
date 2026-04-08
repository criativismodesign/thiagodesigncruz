"use client";

import Image from "next/image";
import Link from "next/link";

// Array de dados dos banners
const banners = [
  {
    id: 'esquerdo',
    image: '/images/banners/banner-box-esquerdo.jpg',
    cta: { label: 'ENTRE EM CONTATO AGORA!', href: '#' },
  },
  {
    id: 'direito',
    image: '/images/banners/banner-box-direito.jpg',
    cta: { label: 'ENTRE EM CONTATO AGORA!', href: '#' },
  },
];

export default function BannerBoxSection() {
  return (
    <section className="w-full flex flex-row">
      {banners.map((banner) => (
        <div
          key={banner.id}
          className="relative overflow-hidden"
          style={{
            width: '50%',
            height: '750px',
          }}
        >
          {/* Imagem de fundo */}
          <Image
            src={banner.image}
            alt={`Banner ${banner.id}`}
            fill
            className="object-cover"
            style={{ zIndex: 0 }}
          />

          {/* Bloco de conteúdo */}
          <div
            className="relative flex flex-col justify-center"
            style={{
              zIndex: 1,
              padding: '65px',
              height: '100%',
            }}
          >
            {/* Título - Bloco 1: PERSO NALIZE */}
            <div
              className="font-extrabold uppercase"
              style={{
                fontSize: '50px',
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
              className="font-light uppercase"
              style={{
                fontSize: '50px',
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
              className="inline-block font-extrabold uppercase rounded-full transition-all"
              style={{
                fontSize: '15px',
                color: '#FFFFFF',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 800,
                backgroundColor: 'transparent',
                border: '1px solid #FFFFFF',
                borderRadius: '999px',
                padding: '14px 36px',
                marginTop: '32px',
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
