import Link from 'next/link'

export default function DashboardPage() {
  return (
    <>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: '#292929', marginBottom: 8 }}>Dashboard</h1>
      <p style={{ color: '#888', marginBottom: 32, fontSize: 14 }}>Gerencie seu e-commerce Use KIN</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24 }}>
        <Link href="/login-usekin/dashboard/produtos" style={{ textDecoration: 'none' }}>
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E5E5', padding: 24, cursor: 'pointer' }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#292929', marginBottom: 8 }}>Produtos</h2>
            <p style={{ color: '#888', fontSize: 14 }}>Gerencie os produtos da loja</p>
          </div>
        </Link>
        <Link href="/login-usekin/dashboard/colecoes" style={{ textDecoration: 'none' }}>
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E5E5', padding: 24, cursor: 'pointer' }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#292929', marginBottom: 8 }}>Coleções</h2>
            <p style={{ color: '#888', fontSize: 14 }}>Gerencie as coleções de produtos</p>
          </div>
        </Link>
        <Link href="/login-usekin/dashboard/banners" style={{ textDecoration: 'none' }}>
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E5E5', padding: 24, cursor: 'pointer' }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#292929', marginBottom: 8 }}>Banners</h2>
            <p style={{ color: '#888', fontSize: 14 }}>Gerencie os banners da loja</p>
          </div>
        </Link>
        <Link href="/login-usekin/dashboard/banners-categoria" style={{ textDecoration: 'none' }}>
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E5E5', padding: 24, cursor: 'pointer' }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#292929', marginBottom: 8 }}>Banners Categoria</h2>
            <p style={{ color: '#888', fontSize: 14 }}>Gerencie os banners por categoria</p>
          </div>
        </Link>
        <Link href="/login-usekin/dashboard/pedidos" style={{ textDecoration: 'none' }}>
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E5E5', padding: 24, cursor: 'pointer' }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#292929', marginBottom: 8 }}>Pedidos</h2>
            <p style={{ color: '#888', fontSize: 14 }}>Visualize e gerencie os pedidos</p>
          </div>
        </Link>
        <Link href="/login-usekin/dashboard/cupons" style={{ textDecoration: 'none' }}>
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E5E5', padding: 24, cursor: 'pointer' }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#292929', marginBottom: 8 }}>Cupons</h2>
            <p style={{ color: '#888', fontSize: 14 }}>Gerencie os cupons de desconto</p>
          </div>
        </Link>
        <Link href="/login-usekin/dashboard/dados-envio" style={{ textDecoration: 'none' }}>
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E5E5', padding: 24, cursor: 'pointer' }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#292929', marginBottom: 8 }}>Dados de Envio</h2>
            <p style={{ color: '#888', fontSize: 14 }}>Configure os dados de envio</p>
          </div>
        </Link>
        <Link href="/login-usekin/dashboard/configuracoes" style={{ textDecoration: 'none' }}>
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E5E5', padding: 24, cursor: 'pointer' }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#292929', marginBottom: 8 }}>Configurações</h2>
            <p style={{ color: '#888', fontSize: 14 }}>Configure as configurações da loja</p>
          </div>
        </Link>
      </div>
    </>
  )
}
