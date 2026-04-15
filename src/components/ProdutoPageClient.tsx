'use client'

import { useState } from 'react'
import { useCartStore } from '@/store/cart-store'
import { ShoppingCart, Plus, Minus, Heart } from 'lucide-react'

interface ProdutoPageClientProps {
  produto: {
    id: string
    nome: string
    precoAtual: number
    precoDe?: number
    descricaoCurta?: string
    imagens: { url: string; ordem: number }[]
    cores: string[]
    tipo: string
    slug: string
  }
}

export default function ProdutoPageClient({ produto }: ProdutoPageClientProps) {
  const { addItem } = useCartStore()
  const [corSelecionada, setCorSelecionada] = useState(produto.cores[0] || '')
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState('M')
  const [quantidade, setQuantidade] = useState(1)
  const [imagemSelecionada, setImagemSelecionada] = useState(0)

  const tamanhos = ['P', 'M', 'G', 'GG']

  const handleAddToCart = () => {
    addItem({
      id: `${produto.id}-${corSelecionada}-${tamanhoSelecionado}`,
      name: produto.nome,
      price: produto.precoAtual,
      image: produto.imagens[0]?.url,
      type: produto.tipo as 'camiseta' | 'mousepad',
      size: tamanhoSelecionado,
      color: corSelecionada,
      slug: produto.slug
    })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Imagens do Produto */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
            {produto.imagens[imagemSelecionada] ? (
              <img
                src={produto.imagens[imagemSelecionada].url}
                alt={produto.nome}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="text-gray-400">Imagem não disponível</span>
              </div>
            )}
          </div>
          
          {/* Miniaturas */}
          {produto.imagens.length > 1 && (
            <div className="flex space-x-2">
              {produto.imagens.map((imagem, index) => (
                <button
                  key={imagem.ordem}
                  onClick={() => setImagemSelecionada(index)}
                  className={`h-20 w-20 overflow-hidden rounded border-2 ${
                    imagemSelecionada === index ? 'border-blue-500' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={imagem.url}
                    alt={`${produto.nome} ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Informações do Produto */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{produto.nome}</h1>
            {produto.descricaoCurta && (
              <p className="mt-2 text-gray-600">{produto.descricaoCurta}</p>
            )}
          </div>

          {/* Preço */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-3xl font-bold text-gray-900">
                {formatCurrency(produto.precoAtual)}
              </span>
              {produto.precoDe && produto.precoDe > produto.precoAtual && (
                <span className="text-lg text-gray-500 line-through">
                  {formatCurrency(produto.precoDe)}
                </span>
              )}
            </div>
            <p className="text-sm text-green-600">
              Ou 10% de desconto no Pix
            </p>
          </div>

          {/* Cores */}
          {produto.cores.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Cor</h3>
              <div className="flex space-x-2">
                {produto.cores.map((cor) => (
                  <button
                    key={cor}
                    onClick={() => setCorSelecionada(cor)}
                    className={`h-8 w-8 rounded-full border-2 ${
                      corSelecionada === cor ? 'border-blue-500' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: cor }}
                    title={cor}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Tamanhos (apenas para camisetas) */}
          {produto.tipo === 'camiseta' && (
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Tamanho</h3>
              <div className="flex space-x-2">
                {tamanhos.map((tamanho) => (
                  <button
                    key={tamanho}
                    onClick={() => setTamanhoSelecionado(tamanho)}
                    className={`px-4 py-2 border ${
                      tamanhoSelecionado === tamanho
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 text-gray-700'
                    } rounded-md`}
                  >
                    {tamanho}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantidade */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">Quantidade</h3>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
                className="p-2 border border-gray-300 rounded-md"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center">{quantidade}</span>
              <button
                onClick={() => setQuantidade(quantidade + 1)}
                className="p-2 border border-gray-300 rounded-md"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="space-y-3">
            <button
              onClick={handleAddToCart}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-md font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Adicionar ao Carrinho</span>
            </button>
            
            <button className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-md font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
              <Heart className="h-5 w-5" />
              <span>Adicionar aos Favoritos</span>
            </button>
          </div>

          {/* Informações Adicionais */}
          <div className="border-t pt-6">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Informações</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>Envio em até 5 dias úteis</p>
              <p>Troca gratuita em 30 dias</p>
              <p>100% Algodão (camisetas) / Poliester (mouse pads)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
