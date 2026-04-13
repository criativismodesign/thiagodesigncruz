import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import DashboardSairButton from '@/components/admin/DashboardSairButton'

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin-session')?.value
  const validToken = process.env.ADMIN_SESSION_TOKEN

  if (!session || !validToken || session !== validToken) {
    redirect('/login-usekin')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F5F5F5' }}>
      <div style={{ background: '#fff', borderBottom: '1px solid #E5E5E5', padding: '16px 32px', display: 'flex', alignItems: 'center', gap: 24 }}>
        <span style={{ fontWeight: 700, fontSize: 18, color: '#292929' }}>Use KIN Admin</span>
        <a href="/login-usekin/dashboard" style={{ background: '#2563eb', color: '#fff', padding: '6px 16px', borderRadius: 8, textDecoration: 'none', fontSize: 14 }}>Dashboard</a>
        <a href="/login-usekin/dashboard/produtos" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Produtos</a>
        <a href="/login-usekin/dashboard/colecoes" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Coleções</a>
        <a href="/login-usekin/dashboard/banners" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Banners</a>
        <a href="/login-usekin/dashboard/banners-categoria" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Banners Categoria</a>
        <a href="/login-usekin/dashboard/pedidos" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Pedidos</a>
        <a href="/login-usekin/dashboard/cupons" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Cupons</a>
        <a href="/login-usekin/dashboard/dados-envio" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Dados de Envio</a>
        <a href="/login-usekin/dashboard/configuracoes" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Configurações</a>
        <div style={{ marginLeft: 'auto' }}>
          <DashboardSairButton />
        </div>
      </div>

      <div style={{ padding: '32px' }}>
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
              <h2 style={{ fontSize: 18, fontWeight: 600, color: '#292929', marginBottom: 8 }}>Banners Hero</h2>
              <p style={{ color: '#888', fontSize: 14 }}>Gerencie os banners da página inicial</p>
            </div>
          </Link>

          <Link href="/login-usekin/dashboard/banners-categoria" style={{ textDecoration: 'none' }}>
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E5E5', padding: 24, cursor: 'pointer' }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: '#292929', marginBottom: 8 }}>Banners Categoria</h2>
              <p style={{ color: '#888', fontSize: 14 }}>Imagens dos banners das páginas de categoria</p>
            </div>
          </Link>

          <Link href="/login-usekin/dashboard/cupons" style={{ textDecoration: 'none' }}>
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E5E5', padding: 24, cursor: 'pointer' }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: '#292929', marginBottom: 8 }}>Cupons</h2>
              <p style={{ color: '#888', fontSize: 14 }}>Gerencie cupons de desconto</p>
            </div>
          </Link>

          <Link href="/login-usekin/dashboard/dados-envio" style={{ textDecoration: 'none' }}>
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E5E5', padding: 24, cursor: 'pointer' }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: '#292929', marginBottom: 8 }}>Dados de Envio</h2>
              <p style={{ color: '#888', fontSize: 14 }}>Configurações de frete e dimensões</p>
            </div>
          </Link>

          <Link href="/login-usekin/dashboard/configuracoes" style={{ textDecoration: 'none' }}>
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E5E5', padding: 24, cursor: 'pointer' }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: '#292929', marginBottom: 8 }}>Configurações</h2>
              <p style={{ color: '#888', fontSize: 14 }}>Textos padrão e configurações do site</p>
            </div>
          </Link>

          <Link href="/login-usekin/dashboard/pedidos" style={{ textDecoration: 'none' }}>
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E5E5', padding: 24, cursor: 'pointer' }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: '#292929', marginBottom: 8 }}>Pedidos</h2>
              <p style={{ color: '#888', fontSize: 14 }}>Gerencie os pedidos dos clientes</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
