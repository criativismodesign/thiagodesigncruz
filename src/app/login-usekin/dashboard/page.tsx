import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import Link from 'next/link'

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin-session')?.value
  const validToken = process.env.ADMIN_SESSION_TOKEN

  if (!session || !validToken || session !== validToken) {
    redirect('/login-usekin')
  }

  return (
    <AdminLayout title="Dashboard">
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px'
      }}>
        <Link href="/login-usekin/dashboard/colecoes" style={{
          textDecoration: 'none',
          display: 'block'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            padding: '32px',
            border: '1px solid #E5E5E5',
            transition: 'all 0.2s',
            cursor: 'pointer'
          }}>
            <h3 style={{ fontSize: 20, fontWeight: 600, color: '#292929', margin: '0 0 8px 0' }}>
              Coleções
            </h3>
            <p style={{ color: '#666666', margin: 0, fontSize: 14 }}>
              Gerencie as coleções de produtos
            </p>
          </div>
        </Link>
        
        <Link href="/login-usekin/dashboard/banners" style={{
          textDecoration: 'none',
          display: 'block'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            padding: '32px',
            border: '1px solid #E5E5E5',
            transition: 'all 0.2s',
            cursor: 'pointer'
          }}>
            <h3 style={{ fontSize: 20, fontWeight: 600, color: '#292929', margin: '0 0 8px 0' }}>
              Banners Hero
            </h3>
            <p style={{ color: '#666666', margin: 0, fontSize: 14 }}>
              Gerencie os banners da página inicial
            </p>
          </div>
        </Link>
        
        <Link href="/login-usekin/dashboard/produtos" style={{
          textDecoration: 'none',
          display: 'block'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            padding: '32px',
            border: '1px solid #E5E5E5',
            transition: 'all 0.2s',
            cursor: 'pointer'
          }}>
            <h3 style={{ fontSize: 20, fontWeight: 600, color: '#292929', margin: '0 0 8px 0' }}>
              Produtos
            </h3>
            <p style={{ color: '#666666', margin: 0, fontSize: 14 }}>
              Gerencie os produtos
            </p>
          </div>
        </Link>
        
        <div style={{
          background: '#FFFFFF',
          borderRadius: '12px',
          padding: '32px',
          border: '1px solid #E5E5E5',
          opacity: 0.7
        }}>
          <h3 style={{ fontSize: 20, fontWeight: 600, color: '#292929', margin: '0 0 8px 0' }}>
            Pedidos
          </h3>
          <p style={{ color: '#666666', margin: 0, fontSize: 14 }}>
            Visualize os pedidos (em breve)
          </p>
        </div>
      </div>
    </AdminLayout>
  )
}
