import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function ColecoesPage() {
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link 
            href="/login-usekin/dashboard" 
            style={{ 
              textDecoration: 'none', 
              color: '#666666',
              fontSize: 14,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span> Voltar ao Dashboard</span>
          </Link>
          <span style={{ fontSize: 20, fontWeight: 600, color: '#292929' }}>
            Gestão de Coleções
          </span>
        </div>
        <Link href="/login-usekin/dashboard">
          <button style={{
            background: 'transparent',
            border: '1px solid #E5E5E5',
            borderRadius: 999,
            padding: '8px 20px',
            cursor: 'pointer',
            fontSize: 14,
            color: '#292929'
          }}>
            Sair
          </button>
        </Link>
      </div>
      
      <div style={{ padding: '48px 40px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '32px'
        }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 600, color: '#292929', margin: 0 }}>
              Coleções
            </h1>
            <p style={{ color: '#AAAAAA', marginTop: 8, margin: 0 }}>
              Gerencie as coleções de produtos Use KIN
            </p>
          </div>
          <button style={{
            background: '#DAA520',
            border: 'none',
            borderRadius: 999,
            padding: '12px 24px',
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 600,
            color: '#FFFFFF'
          }}>
            + Nova Coleção
          </button>
        </div>

        <div style={{
          background: '#FFFFFF',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #E5E5E5'
        }}>
          <p style={{ color: '#666666', textAlign: 'center', padding: '40px 0' }}>
            Interface de gestão de coleções em desenvolvimento...
          </p>
        </div>
      </div>
    </div>
  )
}
