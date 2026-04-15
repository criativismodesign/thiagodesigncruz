import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin-session')?.value
  if (!session || session !== process.env.ADMIN_SESSION_TOKEN) {
    redirect('/login-usekin')
  }

  const menuItems = [
    { href: '/login-usekin/dashboard', label: 'Início' },
    { href: '/login-usekin/dashboard/produtos', label: 'Produtos' },
    { href: '/login-usekin/dashboard/colecoes', label: 'Coleções' },
    { href: '/login-usekin/dashboard/pedidos', label: 'Pedidos' },
    { href: '/login-usekin/dashboard/banners', label: 'Banners' },
    { href: '/login-usekin/dashboard/banners-categoria', label: 'Banners Categoria' },
    { href: '/login-usekin/dashboard/cupons', label: 'Cupons' },
    { href: '/login-usekin/dashboard/dados-envio', label: 'Dados de Envio' },
    { href: '/login-usekin/dashboard/configuracoes', label: 'Configurações' },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F5F5F5' }}>
      <aside style={{
        width: 220,
        background: '#1A1A1A',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto',
      }}>
        <div style={{ padding: '24px 20px', borderBottom: '1px solid #2A2A2A' }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#DAA520', letterSpacing: 2 }}>USEKIN</div>
          <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>Painel Admin</div>
        </div>
        <nav style={{ flex: 1, padding: '12px 0' }}>
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href} style={{
              display: 'block',
              padding: '10px 20px',
              color: '#CCC',
              textDecoration: 'none',
              fontSize: 14,
            }}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div style={{ padding: '16px 20px', borderTop: '1px solid #2A2A2A' }}>
          <form action="/api/admin/logout" method="POST">
            <button type="submit" style={{ color: '#888', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 14 }}>
              Sair
            </button>
          </form>
        </div>
      </aside>
      <main style={{ flex: 1, overflow: 'auto' }}>
        {children}
      </main>
    </div>
  )
}
