import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import LogoutButton from '@/components/admin/LogoutButton'
import Link from 'next/link'

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin-session')?.value
  const validToken = process.env.ADMIN_SESSION_TOKEN

  if (!session || !validToken || session !== validToken) {
    redirect('/login-usekin')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F5F5F5' }}>
      <div style={{
        background: '#FFFFFF',
        borderBottom: '1px solid #E5E5E5',
        padding: '16px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span style={{ fontSize: 20, fontWeight: 600, color: '#292929' }}>
          Painel Use KIN
        </span>
        <LogoutButton />
      </div>
      <div style={{ padding: '48px 40px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 600, color: '#292929' }}>
          Bem-vindo ao Painel Use KIN
        </h1>
        <p style={{ color: '#AAAAAA', marginTop: 8 }}>
          Selecione uma opção no menu para começar.
        </p>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginTop: '48px'
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
          
          <div style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            padding: '32px',
            border: '1px solid #E5E5E5',
            opacity: 0.7
          }}>
            <h3 style={{ fontSize: 20, fontWeight: 600, color: '#292929', margin: '0 0 8px 0' }}>
              Produtos
            </h3>
            <p style={{ color: '#666666', margin: 0, fontSize: 14 }}>
              Gerencie os produtos (em breve)
            </p>
          </div>
          
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
      </div>
    </div>
  )
}
