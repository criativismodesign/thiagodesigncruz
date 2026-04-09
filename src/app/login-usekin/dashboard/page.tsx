import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import LogoutButton from '@/components/admin/LogoutButton'

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
      </div>
    </div>
  )
}
