'use client'

import Link from 'next/link'

interface Produto {
  id: string
  nome: string
  tipo: string
  categoria: string
  precoAtual: number
  status: string
}

interface Props {
  produtos: Produto[]
}

export default function ProdutosLista({ produtos }: Props) {
  const handleExcluir = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await fetch(`/api/admin/produtos/${id}`, { method: 'DELETE' })
        window.location.reload()
      } catch (error) {
        console.error('Erro ao excluir produto:', error)
        alert('Erro ao excluir produto')
      }
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F5F5F5' }}>
      {/* Header navegação */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E5E5E5', padding: '16px 32px', display: 'flex', alignItems: 'center', gap: 24 }}>
        <span style={{ fontWeight: 700, fontSize: 18, color: '#292929' }}>Use KIN Admin</span>
        <Link href="/login-usekin/dashboard" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Dashboard</Link>
        <Link href="/login-usekin/dashboard/produtos" style={{ background: '#2563eb', color: '#fff', padding: '6px 16px', borderRadius: 8, textDecoration: 'none', fontSize: 14 }}>Produtos</Link>
        <Link href="/login-usekin/dashboard/colecoes" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Coleções</Link>
        <Link href="/login-usekin/dashboard/banners" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Banners</Link>
        <Link href="/login-usekin/dashboard/banners-categoria" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Banners Categoria</Link>
        <Link href="/login-usekin/dashboard/dados-envio" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Dados de Envio</Link>
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
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#292929', margin: 0 }}>Produtos</h1>
          <Link
            href="/login-usekin/dashboard/produtos/novo"
            style={{ background: '#DAA520', color: '#fff', border: 'none', borderRadius: 999, padding: '10px 24px', cursor: 'pointer', fontWeight: 700, fontSize: 14, textDecoration: 'none', display: 'inline-block' }}
          >
            + Novo Produto
          </Link>
        </div>

        {/* Tabela */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E5E5', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#F8F9FA' }}>
              <tr>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#666', textTransform: 'uppercase' }}>Nome</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#666', textTransform: 'uppercase' }}>Tipo</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#666', textTransform: 'uppercase' }}>Categoria</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#666', textTransform: 'uppercase' }}>Preço</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#666', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#666', textTransform: 'uppercase' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtos.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: '#888' }}>Nenhum produto encontrado</td>
                </tr>
              ) : (
                produtos.map(produto => (
                  <tr key={produto.id} style={{ borderBottom: '1px solid #F5F5F5' }}>
                    <td style={{ padding: '12px 16px', fontSize: 14, color: '#292929' }}>{produto.nome}</td>
                    <td style={{ padding: '12px 16px', fontSize: 14, color: '#292929' }}>{produto.tipo}</td>
                    <td style={{ padding: '12px 16px', fontSize: 14, color: '#292929' }}>{produto.categoria}</td>
                    <td style={{ padding: '12px 16px', fontSize: 14, color: '#292929' }}>R$ {produto.precoAtual ? Number(produto.precoAtual).toFixed(2) : '0.00'}</td>
                    <td style={{ padding: '12px 16px', fontSize: 14, color: '#292929' }}>{produto.status}</td>
                    <td style={{ padding: '12px 16px', display: 'flex', gap: 8 }}>
                      <Link 
                        href={`/login-usekin/dashboard/produtos/${produto.id}`}
                        style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', cursor: 'pointer', fontSize: 12, textDecoration: 'none' }}
                      >
                        Editar
                      </Link>
                      <button 
                        onClick={() => handleExcluir(produto.id)}
                        style={{ background: '#F0484A', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', cursor: 'pointer', fontSize: 12 }}
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
