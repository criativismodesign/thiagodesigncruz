'use client'

import { useState } from 'react'

interface Produto {
  id: string
  nome: string
  tipo: string
  categoria: string
  precoAtual: number
  precoDe?: number | null
  status: string
}

interface Props {
  produtosIniciais: Produto[]
}

export default function ProdutosClient({ produtosIniciais }: Props) {
  const [produtos, setProdutos] = useState<Produto[]>(produtosIniciais)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nome: '',
    tipo: 'camiseta',
    categoria: 'avulso',
    precoAtual: '',
    precoDe: '',
    status: 'ativo',
  })

  const handleSubmit = async () => {
    if (!formData.nome || !formData.precoAtual) {
      alert('Nome e preço são obrigatórios')
      return
    }
    
    setLoading(true)
    try {
      const response = await fetch('/api/admin/produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      const data = await response.json()
      
      if (data.success) {
        setShowModal(false)
        setFormData({ nome: '', tipo: 'camiseta', categoria: 'avulso', precoAtual: '', precoDe: '', status: 'ativo' })
        const listResponse = await fetch('/api/admin/produtos')
        const novosProdutos = await listResponse.json()
        setProdutos(novosProdutos)
      } else {
        alert('Erro: ' + data.error)
      }
    } catch (error) {
      alert('Erro ao salvar: ' + error)
    } finally {
      setLoading(false)
    }
  }

  const handleExcluir = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return
    
    try {
      await fetch(`/api/admin/produtos/${id}`, { method: 'DELETE' })
      setProdutos(produtos.filter(p => p.id !== id))
    } catch (error) {
      alert('Erro ao excluir: ' + error)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F5F5F5' }}>
      {/* Header navegação */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E5E5E5', padding: '16px 32px', display: 'flex', alignItems: 'center', gap: 24 }}>
