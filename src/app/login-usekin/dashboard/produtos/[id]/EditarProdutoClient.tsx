'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Colecao {
  id: string
  nome: string
}

interface Produto {
  id: string
  nome: string
  tipo: string
  categoria: string
  colecaoId: string | null
  precoAtual: number
  precoDe: number | null
  cores: string[]
  descricaoCurta: string | null
  descricaoLonga: string | null
  entregaPrazo: string | null
  informacoes: string | null
  imagemGuiaTamanhos: string | null
  status: string
  ordemSecao: number
  imagens: { id: string; url: string; ordem: number; isPrincipal: boolean }[]
  estoque: { id: string; tamanho: string | null; cor: string | null; quantidade: number; minimo: number }[]
}

interface Props {
  produto: Produto
  colecoes: Colecao[]
}

export default function EditarProdutoClient({ produto, colecoes }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nome: produto.nome || '',
    tipo: produto.tipo || 'camiseta',
    categoria: produto.categoria || 'avulso',
    precoAtual: produto.precoAtual?.toString() || '',
    precoDe: produto.precoDe?.toString() || '',
    cores: produto.cores || [],
    descricaoCurta: produto.descricaoCurta || '',
    descricaoLonga: produto.descricaoLonga || '',
    entregaPrazo: produto.entregaPrazo || '',
    informacoes: produto.informacoes || '',
    status: produto.status || 'ativo',
    ordemSecao: produto.ordemSecao?.toString() || '0',
    colecaoId: produto.colecaoId || ''
  })

  // Extrair dados das imagens e estoque do produto
  const imagemPrincipal = produto.imagens.find(img => img.isPrincipal)?.url || ''
  const miniaturas = produto.imagens.filter(img => !img.isPrincipal).sort((a, b) => a.ordem - b.ordem).map(img => img.url)
  const guiaTamanhos = produto.imagemGuiaTamanhos || ''
  
  // Converter array de estoque para objeto Record<string, number>
  const estoqueInicial: Record<string, number> = {}
  produto.estoque.forEach(item => {
    if (item.tamanho && item.cor) {
      estoqueInicial[`${item.tamanho}-${item.cor}`] = item.quantidade
    } else {
      estoqueInicial['geral'] = item.quantidade
    }
  })
  
  const [imagemPrincipalState, setImagemPrincipalState] = useState<string>(imagemPrincipal)
  const [miniaturasState, setMiniaturasState] = useState<string[]>(miniaturas)
  const [guiaTamanhosState, setGuiaTamanhosState] = useState<string>(guiaTamanhos)
  const [estoque, setEstoque] = useState<Record<string, number>>(estoqueInicial)
  const [estoqueMinimo, setEstoqueMinimo] = useState(produto.estoque[0]?.minimo || 3)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = {
        ...formData,
        precoAtual: parseFloat(formData.precoAtual) || 0,
        precoDe: formData.precoDe ? parseFloat(formData.precoDe) : null,
        ordemSecao: parseInt(formData.ordemSecao) || 0,
        imagemPrincipal: imagemPrincipalState,
        miniaturas: miniaturasState.filter(Boolean),
        imagemGuiaTamanhos: guiaTamanhosState,
        estoque,
        estoqueMinimo
      }

      const response = await fetch(`/api/admin/produtos/${produto.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        router.push('/login-usekin/dashboard/produtos')
      } else {
        throw new Error('Erro ao atualizar produto')
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

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, tipo: string, index?: number) => {
    const file = e.target.files?.[0]
    if (!file) return
    const formDataUpload = new FormData()
    formDataUpload.append('file', file)
    formDataUpload.append('pasta', 'produtos')
    const response = await fetch('/api/admin/upload', { method: 'POST', body: formDataUpload })
    const data = await response.json()
    if (data.success) {
      if (tipo === 'principal') setImagemPrincipalState(data.url)
      else if (tipo === 'miniatura' && index !== undefined) {
        const novas = [...miniaturasState]
        novas[index] = data.url
        setMiniaturasState(novas)
      } else if (tipo === 'guia') setGuiaTamanhosState(data.url)
    }
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
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#292929', margin: 0 }}>Editar Produto</h1>
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
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5', borderRadius: 6, fontSize: 14, color: '#292929' }}
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
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5', borderRadius: 6, fontSize: 14, color: '#292929' }}
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
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5', borderRadius: 6, fontSize: 14, color: '#292929' }}
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
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5', borderRadius: 6, fontSize: 14, color: '#292929' }}
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
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5', borderRadius: 6, fontSize: 14, color: '#292929' }}
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
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5', borderRadius: 6, fontSize: 14, color: '#292929' }}
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
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5', borderRadius: 6, fontSize: 14, color: '#292929' }}
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
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5', borderRadius: 6, fontSize: 14, color: '#292929' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Seção Upload de Imagens */}
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E5E5', padding: 24, marginTop: 24 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#292929', marginBottom: 8 }}>Imagens do Produto</h2>
            <p style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>
              {formData.tipo === 'camiseta'
                ? 'Imagens: 0/5 (1 principal 816x1093px + até 4 miniaturas 197x264px)'
                : 'Imagens: 0/9 (1 principal 821x393px + até 8 miniaturas 200x96px)'}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              {/* Imagem principal */}
              <div
                onClick={() => document.getElementById('upload-principal')?.click()}
                style={{
                  width: formData.tipo === 'camiseta' ? 100 : 160,
                  height: formData.tipo === 'camiseta' ? 133 : 77,
                  border: '2px dashed #E5E5E5', borderRadius: 8, cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  background: imagemPrincipalState ? 'transparent' : '#F9F9F9', overflow: 'hidden'
                }}
              >
                {imagemPrincipalState
                  ? <img src={imagemPrincipalState} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <><span style={{ fontSize: 24, color: '#AAAAAA' }}>+</span><span style={{ fontSize: 11, color: '#AAAAAA' }}>Principal</span></>
                }
              </div>
              <input id="upload-principal" type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleUpload(e, 'principal')} />

              {/* Miniaturas */}
              {Array.from({ length: formData.tipo === 'camiseta' ? 4 : 8 }).map((_, i) => (
                <div key={i}
                  onClick={() => document.getElementById(`upload-mini-${i}`)?.click()}
                  style={{
                    width: formData.tipo === 'camiseta' ? 80 : 120,
                    height: formData.tipo === 'camiseta' ? 107 : 58,
                    border: '2px dashed #E5E5E5', borderRadius: 8, cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    background: miniaturasState[i] ? 'transparent' : '#F9F9F9', overflow: 'hidden'
                  }}
                >
                  {miniaturasState[i]
                    ? <img src={miniaturasState[i]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <><span style={{ fontSize: 18, color: '#AAAAAA' }}>+</span><span style={{ fontSize: 10, color: '#AAAAAA' }}>Adicionar</span></>
                  }
                </div>
              ))}
              {Array.from({ length: formData.tipo === 'camiseta' ? 4 : 8 }).map((_, i) => (
                <input key={i} id={`upload-mini-${i}`} type="file" accept="image/*" style={{ display: 'none' }}
                  onChange={e => handleUpload(e, 'miniatura', i)} />
              ))}
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
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5', borderRadius: 6, fontSize: 14, resize: 'vertical', color: '#292929' }}
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
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5', borderRadius: 6, fontSize: 14, resize: 'vertical', color: '#292929' }}
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
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5', borderRadius: 6, fontSize: 14, resize: 'vertical', color: '#292929' }}
                  />
                </div>
              )}

              {formData.tipo === 'camiseta' && (
                <div style={{ marginTop: 16 }}>
                  <label style={{ fontSize: 14, fontWeight: 500, color: '#292929', display: 'block', marginBottom: 6 }}>
                    Imagem Guia de Tamanhos
                  </label>
                  <div
                    onClick={() => document.getElementById('upload-guia')?.click()}
                    style={{
                      width: 200, height: 150, border: '2px dashed #E5E5E5', borderRadius: 8,
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: guiaTamanhosState ? 'transparent' : '#F9F9F9', overflow: 'hidden'
                    }}
                  >
                    {guiaTamanhosState
                      ? <img src={guiaTamanhosState} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <span style={{ color: '#AAAAAA', fontSize: 13 }}>+ Adicionar imagem</span>
                    }
                  </div>
                  <input id="upload-guia" type="file" accept="image/*" style={{ display: 'none' }}
                    onChange={e => handleUpload(e, 'guia')} />
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
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5', borderRadius: 6, fontSize: 14, resize: 'vertical', color: '#292929' }}
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

          {/* Seção Estoque */}
          {formData.tipo === 'camiseta' && (
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E5E5', padding: 24, marginTop: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: '#292929', marginBottom: 16 }}>Estoque</h2>
              <table style={{ borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '8px 16px', color: '#292929', fontSize: 14, textAlign: 'left' }}></th>
                    <th style={{ padding: '8px 16px', color: '#292929', fontSize: 14 }}>PRETO</th>
                    <th style={{ padding: '8px 16px', color: '#292929', fontSize: 14 }}>BRANCO</th>
                  </tr>
                </thead>
                <tbody>
                  {['P', 'M', 'G', 'GG'].map(tam => (
                    <tr key={tam}>
                      <td style={{ padding: '8px 16px', fontWeight: 600, color: '#292929', fontSize: 14 }}>{tam}</td>
                      {['preto', 'branco'].map(cor => (
                        <td key={cor} style={{ padding: '8px 16px' }}>
                          <input type="number" min="0"
                            value={estoque[`${tam}-${cor}`] || 0}
                            onChange={e => setEstoque({...estoque, [`${tam}-${cor}`]: parseInt(e.target.value) || 0})}
                            style={{ width: 70, border: '1px solid #E5E5E5', borderRadius: 8, padding: '6px 10px', textAlign: 'center', fontSize: 14, color: '#292929' }}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                <label style={{ fontSize: 14, color: '#292929' }}>Mínimo para aviso:</label>
                <input type="number" value={estoqueMinimo}
                  onChange={e => setEstoqueMinimo(parseInt(e.target.value) || 3)}
                  style={{ width: 70, border: '1px solid #E5E5E5', borderRadius: 8, padding: '6px 10px', fontSize: 14, color: '#292929' }}
                />
              </div>
            </div>
          )}

          {formData.tipo === 'mousepad' && (
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E5E5', padding: 24, marginTop: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: '#292929', marginBottom: 16 }}>Estoque</h2>
              <div style={{ display: 'flex', gap: 24, alignItems: 'flex-end' }}>
                <div>
                  <label style={{ fontSize: 14, fontWeight: 500, color: '#292929', display: 'block', marginBottom: 6 }}>Quantidade</label>
                  <input type="number" min="0"
                    value={estoque['geral'] || 0}
                    onChange={e => setEstoque({ geral: parseInt(e.target.value) || 0 })}
                    style={{ width: 100, border: '1px solid #E5E5E5', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#292929' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 14, fontWeight: 500, color: '#292929', display: 'block', marginBottom: 6 }}>Mínimo para aviso</label>
                  <input type="number" min="0"
                    value={estoqueMinimo}
                    onChange={e => setEstoqueMinimo(parseInt(e.target.value) || 3)}
                    style={{ width: 100, border: '1px solid #E5E5E5', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#292929' }}
                  />
                </div>
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
