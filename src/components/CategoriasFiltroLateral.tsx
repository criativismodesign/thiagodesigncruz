'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

interface Colecao {
  id: string
  nome: string
  slug: string
}

interface Props {
  colecoes: Colecao[]
  bannerLateral?: string
  bannerLateralMousepad?: string
  chaveBanner?: string
  bannerLateralLink?: string
  bannerLateralMousepadLink?: string
}

export default function CategoriasFiltroLateral({ colecoes, bannerLateral, bannerLateralMousepad, chaveBanner, bannerLateralLink, bannerLateralMousepadLink }: Props) {
  const pathname = usePathname()
  const [originalCollectionExpanded, setOriginalCollectionExpanded] = useState(true)

  const categorias = [
    { label: 'Todos Produtos', href: '/categorias/todos-produtos', sublinhas: [] },
    { label: 'Oversizeds', href: '/categorias/oversizeds', sublinhas: [] },
    { label: 'MousePad/Deskpad', href: '/categorias/mousepads', sublinhas: [] },
    {
      label: 'Original Collection',
      href: '/categorias/original-collection',
      sublinhas: colecoes.map(c => ({
        label: c.nome,
        href: `/categorias/original-collection/${c.slug}`,
      }))
    },
  ]

  return (
    <div style={{ backgroundColor: '#FFFFFF', marginRight: '24px' }}
    className="w-full lg:w-[386px] lg:mt-[100px] lg:mb-[100px] lg:sticky lg:top-[100px]"
    >
      {/* TÍTULO */}
        <h2 style={{
          fontSize: '16px',
          fontWeight: 600,
          color: '#292929',
          textTransform: 'uppercase',
          fontFamily: 'Inter, sans-serif',
          marginBottom: '16px'
        }}>
          CATEGORIAS PRODUTOS
        </h2>

        {/* LINHA DIVISÓRIA */}
        <div style={{ position: 'relative', width: '386px', marginBottom: '32px' }}>
          {/* Linha base - fina */}
          <div style={{
            width: '386px', 
            height: '1px', 
            background: '#C4C4C4'
          }} />
          {/* Linha destaque - sobreposta no início */}
          <div style={{
            position: 'absolute', 
            top: 0, 
            left: 0,
            width: '100px', 
            height: '3px', 
            background: '#F0484A',
            marginTop: '-1px'
          }} />
        </div>

        {/* LISTA DE CATEGORIAS */}
        <div>
          {categorias.map((categoria, index) => (
            <div key={index}>
              {/* Item principal */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <Link
                  href={categoria.href}
                  style={{
                    fontSize: '14px',
                    fontWeight: pathname === categoria.href ? 700 : 400,
                    color: pathname === categoria.href ? '#DAA520' : '#292929',
                    fontFamily: 'Inter, sans-serif',
                    textDecoration: 'none',
                    padding: '10px 0',
                    transition: 'color 0.2s ease',
                    flex: 1
                  }}
                  onMouseEnter={(e) => {
                    if (pathname !== categoria.href) {
                      e.currentTarget.style.color = '#DAA520'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (pathname !== categoria.href) {
                      e.currentTarget.style.color = '#292929'
                    }
                  }}
                >
                  {categoria.label}
                </Link>
                
                {/* Botão +/- para Original Collection */}
                {categoria.sublinhas.length > 0 && (
                  <button
                    onClick={() => setOriginalCollectionExpanded(!originalCollectionExpanded)}
                    style={{
                      fontSize: '14px',
                      fontWeight: 700,
                      color: '#292929',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '10px 0',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#DAA520'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#292929'
                    }}
                  >
                    {originalCollectionExpanded ? '-' : '+'}
                  </button>
                )}
              </div>

              {/* Sublinhas - Original Collection */}
              {categoria.sublinhas.length > 0 && originalCollectionExpanded && (
                <div>
                  {categoria.sublinhas.map((sublinha, subIndex) => (
                    <Link
                      key={subIndex}
                      href={sublinha.href}
                      style={{
                        fontSize: '14px',
                        fontWeight: pathname === sublinha.href ? 700 : 400,
                        color: pathname === sublinha.href ? '#DAA520' : '#BABABA',
                        fontFamily: 'Inter, sans-serif',
                        textDecoration: 'none',
                        padding: '8px 0 8px 20px',
                        display: 'block',
                        transition: 'color 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (pathname !== sublinha.href) {
                          e.currentTarget.style.color = '#DAA520'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (pathname !== sublinha.href) {
                          e.currentTarget.style.color = '#BABABA'
                        }
                      }}
                    >
                      {sublinha.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        
      {/* RESPONSIVIDADE */}
      <style jsx>{`
        @media (max-width: 768px) {
          div[style*="width: 386px"] {
            width: 100%;
            margin: 0;
            padding: 24px;
            position: relative;
            top: 0;
          }
          
          div[style*="margin: 48px auto 0"] {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}
