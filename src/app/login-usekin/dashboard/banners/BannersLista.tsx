'use client'

export default function BannersLista({ banners }: { banners: any[] }) {
  return (
    <div>
      {/* Conteúdo - o menu está no layout.tsx compartilhado */}
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
