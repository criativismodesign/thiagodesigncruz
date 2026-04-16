import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import DashboardMenu from '@/components/admin/DashboardMenu'
import LogoutButton from '@/components/admin/LogoutButton'

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
        <DashboardMenu />
        <div style={{ padding: '16px 20px', borderTop: '1px solid #2A2A2A' }}>
          <LogoutButton />
        </div>
      </aside>
      <main style={{ flex: 1, overflow: 'auto' }}>
        {children}
      </main>
    </div>
  )
}
