'use client'

export default function BannersLista({ banners }: { banners: any[] }) {
  return (
    <div style={{ minHeight: '100vh', background: '#F5F5F5' }}>
      {/* Header navegação padrão */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E5E5E5', padding: '16px 32px', display: 'flex', alignItems: 'center', gap: 24 }}>
        <span style={{ fontWeight: 700, fontSize: 18, color: '#292929' }}>Use KIN Admin</span>
        <a href="/login-usekin/dashboard" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Dashboard</a>
        <a href="/login-usekin/dashboard/produtos" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Produtos</a>
        <a href="/login-usekin/dashboard/colecoes" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Coleções</a>
        <a href="/login-usekin/dashboard/banners" style={{ background: '#2563eb', color: '#fff', padding: '6px 16px', borderRadius: 8, textDecoration: 'none', fontSize: 14 }}>Banners</a>
        <a href="/login-usekin/dashboard/banners-categoria" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Banners Categoria</a>
        <a href="/login-usekin/dashboard/pedidos" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Pedidos</a>
        <a href="/login-usekin/dashboard/cupons" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Cupons</a>
        <a href="/login-usekin/dashboard/dados-envio" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Dados de Envio</a>
        <a href="/login-usekin/dashboard/configuracoes" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Configurações</a>
        <div style={{ marginLeft: 'auto' }}>
          <button onClick={async () => { await fetch('/api/admin/logout', { method: 'POST' }); window.location.href = '/login-usekin' }}
            style={{ color: '#888', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 14 }}>Sair</button>
        </div>
      </div>

      <div style={{ padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#292929', margin: 0 }}>Banners</h1>
        </div>

        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E5E5', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E5E5E5' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 14, color: '#292929' }}>Ordem</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 14, color: '#292929' }}>Título</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 14, color: '#292929' }}>Supertítulo</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 14, color: '#292929' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 14, color: '#292929' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {banners.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: '48px', textAlign: 'center', color: '#888' }}>Nenhum banner encontrado</td></tr>
              ) : (
                banners.map(banner => (
                  <tr key={banner.id} style={{ borderBottom: '1px solid #F5F5F5' }}>
                    <td style={{ padding: '12px 16px', fontSize: 14, color: '#292929' }}>{banner.ordem}</td>
                    <td style={{ padding: '12px 16px', fontSize: 14, color: '#292929', fontWeight: 500 }}>{banner.titulo}</td>
                    <td style={{ padding: '12px 16px', fontSize: 14, color: '#888' }}>{banner.supertitulo}</td>
                    <td style={{ padding: '12px 16px', fontSize: 14 }}>
                      <span style={{ background: banner.ativo ? '#E6F4EA' : '#FFF3E0', color: banner.ativo ? '#2E7D32' : '#E65100', padding: '4px 10px', borderRadius: 999, fontSize: 12 }}>
                        {banner.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <a href={`/login-usekin/dashboard/banners/${banner.id}`}
                        style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', cursor: 'pointer', fontSize: 12, textDecoration: 'none' }}>
                        Editar
                      </a>
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
