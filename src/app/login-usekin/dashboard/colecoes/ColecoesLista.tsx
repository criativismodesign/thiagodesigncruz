'use client'
import { useRouter } from 'next/navigation'

export default function ColecoesLista({ colecoes }: { colecoes: any[] }) {
  const router = useRouter()

  const handleExcluir = async (id: string, nome: string) => {
    if (!confirm(`Tem certeza que deseja excluir a coleção "${nome}"?`)) return
    await fetch(`/api/admin/colecoes/${id}`, { method: 'DELETE' })
    router.refresh()
  }

  return (
    <div>
      {/* Conteúdo - o menu está no layout.tsx compartilhado */}
      <div style={{ padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#292929', margin: 0 }}>Coleções</h1>
          <a href="/login-usekin/dashboard/colecoes/nova"
            style={{ background: '#DAA520', color: '#fff', borderRadius: 999, padding: '10px 24px', textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
            + Nova Coleção
          </a>
        </div>

        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E5E5', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E5E5E5' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 14, color: '#292929' }}>Nome</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 14, color: '#292929' }}>Subtítulo</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 14, color: '#292929' }}>Visível Home</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 14, color: '#292929' }}>Ordem</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 14, color: '#292929' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 14, color: '#292929' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {colecoes.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: '#888' }}>Nenhuma coleção encontrada</td></tr>
              ) : (
                colecoes.map(colecao => (
                  <tr key={colecao.id} style={{ borderBottom: '1px solid #F5F5F5' }}>
                    <td style={{ padding: '12px 16px', fontSize: 14, color: '#292929', fontWeight: 500 }}>{colecao.nome}</td>
                    <td style={{ padding: '12px 16px', fontSize: 14, color: '#888' }}>{colecao.subtitulo}</td>
                    <td style={{ padding: '12px 16px', fontSize: 14 }}>
                      <span style={{ background: colecao.visivelHome ? '#E6F4EA' : '#F5F5F5', color: colecao.visivelHome ? '#2E7D32' : '#888', padding: '4px 10px', borderRadius: 999, fontSize: 12 }}>
                        {colecao.visivelHome ? 'Sim' : 'Não'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 14, color: '#292929' }}>{colecao.ordemHome}</td>
                    <td style={{ padding: '12px 16px', fontSize: 14 }}>
                      <span style={{ background: colecao.status === 'ativa' ? '#E6F4EA' : '#FFF3E0', color: colecao.status === 'ativa' ? '#2E7D32' : '#E65100', padding: '4px 10px', borderRadius: 999, fontSize: 12 }}>
                        {colecao.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', display: 'flex', gap: 8 }}>
                      <a href={`/login-usekin/dashboard/colecoes/${colecao.id}`}
                        style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', cursor: 'pointer', fontSize: 12, textDecoration: 'none' }}>
                        Editar
                      </a>
                      <button onClick={() => handleExcluir(colecao.id, colecao.nome)}
                        style={{ background: '#F0484A', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', cursor: 'pointer', fontSize: 12 }}>
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
