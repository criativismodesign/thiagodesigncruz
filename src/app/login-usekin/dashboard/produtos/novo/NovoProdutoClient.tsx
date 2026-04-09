'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Colecao {
  id: string
  nome: string
}

interface Props {
  colecoes: Colecao[]
}

export default function NovoProdutoClient({ colecoes }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nome: '',
    tipo: 'camiseta',
    categoria: 'avulso',
    precoAtual: '',
    precoDe: '',
    cores: [] as string[],
    descricaoCurta: '',
    descricaoLonga: '',
    entregaPrazo: '',
    informacoes: '',
    status: 'ativo',
    ordemSecao: '0',
    colecaoId: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = {
        ...formData,
        precoAtual: parseFloat(formData.precoAtual) || 0,
        precoDe: formData.precoDe ? parseFloat(formData.precoDe) : null,
        ordemSecao: parseInt(formData.ordemSecao) || 0
      }

      const response = await fetch('/api/admin/produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        router.push('/login-usekin/dashboard/produtos')
      } else {
        throw new Error('Erro ao criar produto')
      }
    } catch (error) {
      console.error('Erro ao salvar produto:', error)
      alert('Erro ao salvar produto')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F5F5F5' }}>
      {/* Header navegação */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E5E5E5', padding: '16px 32px', display: 'flex', alignItems: 'center', gap: 24 }}>
        <span style={{ fontWeight: 700, fontSize: 18, color: '#292929' }}>Use KIN Admin</span>
        <Link href="/login-usekin/dashboard" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Dashboard</Link>
        <Link href="/login-usekin/dashboard/produtos" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Produtos</Link>
        <Link href="/login-usekin/dashboard/colecoes" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Coleções</Link>
        <Link href="/login-usekin/dashboard/banners" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Banners</Link>
        <div style={{ marginLeft: 'auto' }}>
          <button
            onClick={async () => {
              await fetch('/api/admin/logout', { method: 'POST' })
              window.location.href = '/login-usekin'
            }}
            style={{ color: '#888', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 14 }}
          >
            Sair
          </button>
        </div>
      </div>

      {/* Conteúdo */}
      <div style={{ padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#292929', margin: 0 }}>Novo Produto</h1>
          <Link
            href="/login-usekin/dashboard/produtos"
            style={{ background: '#6B7280', color: '#fff', border: 'none', borderRadius: 999, padding: '10px 24px', cursor: 'pointer', fontWeight: 700, fontSize: 14, textDecoration: 'none', display: 'inline-block' }}
          >
            Cancelar
          </Link>
        </div>

        <form onSubmit={handleSubmit} style={{ maxWidth: '800px' }}>
          {/* Seção 1 - Informações Básicas */}
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E5E5', padding: '24px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#292929', margin: '0 0 20px 0' }}>Informações Básicas</h2>
            
            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#292929', marginBottom: '4px' }}>
                  Nome *
                </label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => handleChange('nome', e.target.value)}
                  required
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5', borderRadius: 6, fontSize: 14 }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#292929', marginBottom: '4px' }}>
                    Tipo
                  </label>
                  <select
                    value={formData.tipo}
                    onChange={(e) => handleChange('tipo', e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5', borderRadius: 6, fontSize: 14 }}
                  >
                    <option value="camiseta">Camiseta</option>
                    <option value="mousepad">Mousepad</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#292929', marginBottom: '4px' }}>
                    Categoria
                  </label>
                  <select
                    value={formData.categoria}
                    onChange={(e) => handleChange('categoria', e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5', borderRadius: 6, fontSize: 14 }}
                  >
                    <option value="avulso">Avulso</option>
                    <option value="colecao">Coleção</option>
                  </select>
                </div>
              </div>

              {formData.categoria === 'colecao' && (
                <div>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#292929', marginBottom: '4px' }}>
                    Coleção
                  </label>
                  <select
                    value={formData.colecaoId}
                    onChange={(e) => handleChange('colecaoId', e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5', borderRadius: 6, fontSize: 14 }}
                  >
                    <option value="">Selecione uma coleção</option>
                    {colecoes.length === 0 ? (
                      <option value="" disabled>Nenhuma coleção cadastrada</option>
                    ) : (
                      colecoes.map(colecao => (
                        <option key={colecao.id} value={colecao.id}>
                          {colecao.nome}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#292929', marginBottom: '4px' }}>
                    Preço Atual *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.precoAtual}
                    onChange={(e) => handleChange('precoAtual', e.target.value)}
                    required
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5', borderRadius: 6, fontSize: 14 }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#292929', marginBottom: '4px' }}>
                    Preço "DE"
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.precoDe}
                    onChange={(e) => handleChange('precoDe', e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5', borderRadius: 6, fontSize: 14 }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#292929', marginBottom: '4px' }}>
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5', borderRadius: 6, fontSize: 14 }}
                  >
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#292929', marginBottom: '4px' }}>
                    Ordem na Seção
                  </label>
                  <input
                    type="number"
                    value={formData.ordemSecao}
                    onChange={(e) => handleChange('ordemSecao', e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5', borderRadius: 6, fontSize: 14 }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Seção 2 - Textos */}
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E5E5', padding: '24px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#292929', margin: '0 0 20px 0' }}>Textos</h2>
            
            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#292929', marginBottom: '4px' }}>
                  Descrição Curta
                </label>
                <textarea
                  value={formData.descricaoCurta}
                  onChange={(e) => handleChange('descricaoCurta', e.target.value)}
                  rows={3}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5', borderRadius: 6, fontSize: 14, resize: 'vertical' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#292929', marginBottom: '4px' }}>
                  Descrição Longa
                </label>
                <textarea
                  value={formData.descricaoLonga}
                  onChange={(e) => handleChange('descricaoLonga', e.target.value)}
                  rows={5}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5', borderRadius: 6, fontSize: 14, resize: 'vertical' }}
                />
              </div>

              {formData.tipo === 'camiseta' && (
                <div>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#292929', marginBottom: '4px' }}>
                    Entrega e Prazo
                  </label>
                  <textarea
                    value={formData.entregaPrazo}
                    onChange={(e) => handleChange('entregaPrazo', e.target.value)}
                    rows={3}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5', borderRadius: 6, fontSize: 14, resize: 'vertical' }}
                  />
                </div>
              )}

              {formData.tipo === 'mousepad' && (
                <div>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#292929', marginBottom: '4px' }}>
                    Informações
                  </label>
                  <textarea
                    value={formData.informacoes}
                    onChange={(e) => handleChange('informacoes', e.target.value)}
                    rows={3}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5', borderRadius: 6, fontSize: 14, resize: 'vertical' }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Seção 3 - Cores (só camiseta) */}
          {formData.tipo === 'camiseta' && (
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E5E5', padding: '24px', marginBottom: '24px' }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: '#292929', margin: '0 0 20px 0' }}>Cores</h2>
              
              <div style={{ display: 'flex', gap: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', fontSize: 14 }}>
                  <input
                    type="checkbox"
                    checked={formData.cores.includes('preto')}
                    onChange={(e) => {
                      if (e.target.checked) {
                        handleChange('cores', [...formData.cores, 'preto'])
                      } else {
                        handleChange('cores', formData.cores.filter(c => c !== 'preto'))
                      }
                    }}
                    style={{ marginRight: '8px' }}
                  />
                  Preto
                </label>

                <label style={{ display: 'flex', alignItems: 'center', fontSize: 14 }}>
                  <input
                    type="checkbox"
                    checked={formData.cores.includes('branco')}
                    onChange={(e) => {
                      if (e.target.checked) {
                        handleChange('cores', [...formData.cores, 'branco'])
                      } else {
                        handleChange('cores', formData.cores.filter(c => c !== 'branco'))
                      }
                    }}
                    style={{ marginRight: '8px' }}
                  />
                  Branco
                </label>
              </div>
            </div>
          )}

          {/* Botões */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => router.push('/login-usekin/dashboard/produtos')}
              style={{ padding: '10px 24px', border: '1px solid #E5E5E5', borderRadius: 999, fontSize: 14, cursor: 'pointer', background: '#fff' }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{ padding: '10px 24px', background: '#DAA520', color: '#fff', border: 'none', borderRadius: 999, fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
