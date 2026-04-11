import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import Link from 'next/link'

export default async function DashboardPage() {
  console.log('Dashboard: verificando sessão...')
  const cookieStore = await cookies()
  const session = cookieStore.get('admin-session')?.value
  const validToken = process.env.ADMIN_SESSION_TOKEN

  console.log('Dashboard: sessão encontrada:', !!session)
  console.log('Dashboard: token válido:', !!validToken)
  console.log('Dashboard: sessão == token?', session === validToken)

  if (!session || !validToken || session !== validToken) {
    console.log('Dashboard: redirecionando para login - sessão inválida')
    redirect('/login-usekin')
  }

  console.log('Dashboard: sessão válida - renderizando dashboard')

  return (
    <div style={{ padding: '40px', background: '#F5F5F5', minHeight: '100vh' }}>
      <h1 style={{ fontSize: 32, color: '#292929', marginBottom: '20px' }}>
        Dashboard - Use KIN Admin
      </h1>
      <p style={{ color: '#666666', marginBottom: '40px' }}>
        Dashboard está funcionando! Sessão válida.
      </p>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px'
      }}>
        <div style={{
          background: '#FFFFFF',
          borderRadius: '12px',
          padding: '32px',
          border: '1px solid #E5E5E5'
        }}>
          <h3 style={{ fontSize: 20, fontWeight: 600, color: '#292929', margin: '0 0 8px 0' }}>
            Coleções
          </h3>
          <p style={{ color: '#666666', margin: 0, fontSize: 14 }}>
            Gerencie as coleções de produtos
          </p>
        </div>
        
        <div style={{
          background: '#FFFFFF',
          borderRadius: '12px',
          padding: '32px',
          border: '1px solid #E5E5E5'
        }}>
          <h3 style={{ fontSize: 20, fontWeight: 600, color: '#292929', margin: '0 0 8px 0' }}>
            Banners Hero
          </h3>
          <p style={{ color: '#666666', margin: 0, fontSize: 14 }}>
            Gerencie os banners da página inicial
          </p>
        </div>
        
        <div style={{
          background: '#FFFFFF',
          borderRadius: '12px',
          padding: '32px',
          border: '1px solid #E5E5E5'
        }}>
          <h3 style={{ fontSize: 20, fontWeight: 600, color: '#292929', margin: '0 0 8px 0' }}>
            Produtos
          </h3>
          <p style={{ color: '#666666', margin: 0, fontSize: 14 }}>
            Gerencie os produtos
          </p>
        </div>
      </div>
    </div>
  )
}
