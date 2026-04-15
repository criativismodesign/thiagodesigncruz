'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingCart, Eye } from 'lucide-react'

interface Produto {
  id: string
  nome: string
  slug: string
  precoAtual: number
  precoDe?: number
  imagens: { url: string; ordem: number }[]
  tipo: string
  categoria: string
}

interface RelatedProductsProps {
  produtoAtual: {
    id: string
    categoria: string
    tipo: string
  }
}

export default function RelatedProducts({ produtoAtual }: RelatedProductsProps) {
  const [produtosRelacionados, setProdutosRelacionados] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProdutosRelacionados = async () => {
      try {
        const response = await fetch('/api/products')
        const data = await response.json()
        
        // Filtrar produtos relacionados (mesma categoria ou tipo, exceto o produto atual)
        const relacionados = data.filter((produto: Produto) => 
          produto.id !== produtoAtual.id && 
          (produto.categoria === produtoAtual.categoria || produto.tipo === produtoAtual.tipo)
        ).slice(0, 4) // Limitar a 4 produtos
        
        setProdutosRelacionados(relacionados)
      } catch (error) {
        console.error('Erro ao buscar produtos relacionados:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProdutosRelacionados()
  }, [produtoAtual])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  if (loading || produtosRelacionados.length === 0) {
    return null
  }

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Produtos Relacionados</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {produtosRelacionados.map((produto) => (
          <div key={produto.id} className="group">
            <div className="relative overflow-hidden rounded-lg bg-gray-100">
              {produto.imagens[0] ? (
                <img
                  src={produto.imagens[0].url}
                  alt={produto.nome}
                  className="h-64 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="h-64 w-full flex items-center justify-center bg-gray-200">
                  <span className="text-gray-400">Sem imagem</span>
                </div>
              )}
              
              {/* Botões de Ação */}
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
                <Link
                  href={`/produtos/${produto.slug}`}
                  className="p-2 bg-white rounded-full text-gray-900 hover:bg-gray-100"
                >
                  <Eye className="h-4 w-4" />
                </Link>
                <button className="p-2 bg-white rounded-full text-gray-900 hover:bg-gray-100">
                  <ShoppingCart className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                <Link href={`/produtos/${produto.slug}`}>
                  {produto.nome}
                </Link>
              </h3>
              
              <div className="mt-2 flex items-center space-x-2">
                <span className="text-lg font-bold text-gray-900">
                  {formatCurrency(produto.precoAtual)}
                </span>
                {produto.precoDe && produto.precoDe > produto.precoAtual && (
                  <span className="text-sm text-gray-500 line-through">
                    {formatCurrency(produto.precoDe)}
                  </span>
                )}
              </div>
              
              <div className="mt-2 flex items-center space-x-2 text-sm text-gray-600">
                <span className="px-2 py-1 bg-gray-100 rounded">
                  {produto.tipo}
                </span>
                <span className="px-2 py-1 bg-gray-100 rounded">
                  {produto.categoria}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
