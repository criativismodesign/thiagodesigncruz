"use client";

import Image from "next/image";
import Link from "next/link";
import SectionHeader from "./SectionHeader";

const collections = [
  {
    id: 1,
    slug: 'my-life-my-style',
    imageCamiseta: '/images/products/placeholder-colecao-384x512.jpg',
    imageMousepad: '/images/products/placeholder-mousepad-colecao-336x158.jpg',
    supertitle1: 'ORIGINAL USE KIN - MY LIFE MY STYLE',
    supertitle2: 'COLEETION | STREET ART',
  },
  {
    id: 2,
    slug: 'immortals',
    imageCamiseta: '/images/products/placeholder-colecao-384x512.jpg',
    imageMousepad: '/images/products/placeholder-mousepad-colecao-336x158.jpg',
    supertitle1: 'ORIGINAL USE KIN - IMMORTALS',
    supertitle2: 'COLEETION | INK SERIES',
  },
  {
    id: 3,
    slug: 'colecao-3',
    imageCamiseta: '/images/products/placeholder-colecao-384x512.jpg',
    imageMousepad: '/images/products/placeholder-mousepad-colecao-336x158.jpg',
    supertitle1: 'ORIGINAL USE KIN - 3ª COLEÇÃO',
    supertitle2: 'COLEETION | EM BREVE',
  },
  {
    id: 4,
    slug: 'colecao-4',
    imageCamiseta: '/images/products/placeholder-colecao-384x512.jpg',
    imageMousepad: '/images/products/placeholder-mousepad-colecao-336x158.jpg',
    supertitle1: 'ORIGINAL USE KIN - 4ª COLEÇÃO',
    supertitle2: 'COLEETION | EM BREVE',
  },
];

export default function CollectionsSection() {
  return (
    <section 
      className="w-full"
      style={{ 
        backgroundColor: '#FFFFFF',
        paddingTop: '100px',
        paddingBottom: '100px',
        paddingLeft: '120px',
        paddingRight: '120px'
      }}
    >
      {/* Section Header */}
      <div className="mb-[60px]">
        <SectionHeader 
          title="COLEÇÕES USE KIN"
          subtitle="ORIGINAL COLLECTION | SERIES COLLECTIBLES"
        />
      </div>

      {/* Collections Grid */}
      <div 
        className="grid"
        style={{ 
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '24px'
        }}
      >
        {collections.map((collection) => (
          <Link
            key={collection.id}
            href={`/colecao/${collection.slug}`}
            className="block transition-transform hover:scale-105"
            style={{ textDecoration: 'none' }}
          >
            <div className="w-full">
              {/* Images Block */}
              <div className="relative">
                {/* Camiseta Image (Base) */}
                <Image
                  src={collection.imageCamiseta}
                  alt={`${collection.supertitle1} - Camiseta`}
                  width={384}
                  height={512}
                  className="w-full h-auto object-cover"
                />
                
                {/* Mousepad Image (Overlay) */}
                <div 
                  className="absolute"
                  style={{ 
                    top: '-22px',
                    left: '50%',
                    transform: 'translateX(-50%)'
                  }}
                >
                  <Image
                    src={collection.imageMousepad}
                    alt={`${collection.supertitle1} - Mousepad`}
                    width={336}
                    height={158}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>

              {/* Text Block */}
              <div style={{ paddingTop: '16px', textAlign: 'center' }}>
                {/* Supertítulo Linha 1 */}
                <p 
                  className="font-normal uppercase"
                  style={{ 
                    fontSize: '14px',
                    color: '#292929',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400,
                    lineHeight: '1.4'
                  }}
                >
                  {collection.supertitle1}
                </p>

                {/* Supertítulo Linha 2 */}
                <p 
                  className="font-normal uppercase"
                  style={{ 
                    fontSize: '14px',
                    color: '#292929',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400
                  }}
                >
                  {collection.supertitle2}
                </p>

                {/* VER TODAS COLEÇÃO Button */}
                <div
                  className="font-bold text-white rounded-full transition-all hover:brightness-110 cursor-pointer"
                  style={{ 
                    fontSize: '15px',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 700,
                    backgroundColor: '#DAA520',
                    padding: '14px',
                    borderRadius: '999px',
                    width: '60%',
                    margin: '16px auto 0',
                    textAlign: 'center'
                  }}
                >
                  VER TODAS COLEÇÃO
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Mobile Responsiveness */}
      <style jsx>{`
        @media (max-width: 768px) {
          .section-container {
            padding-top: 60px !important;
            padding-bottom: 60px !important;
            padding-left: 24px !important;
            padding-right: 24px !important;
          }
          .collections-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .collection-button {
            width: 80% !important;
          }
        }
      `}</style>

      <style jsx global>{`
        .section-container {
          padding-top: 100px;
          padding-bottom: 100px;
          padding-left: 120px;
          padding-right: 120px;
        }
        .collections-grid {
          grid-template-columns: repeat(4, 1fr);
        }
        .collection-button {
          width: 60%;
        }
      `}</style>
    </section>
  );
}
