import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import DashboardSairButton from '@/components/admin/LogoutButton'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = await headers()
  const token = headersList.get('authorization')

  if (!token || token !== process.env.ADMIN_SESSION_TOKEN) {
    redirect('/login-usekin')
  }

  return (
    <div>
      <div style={{ padding: '32px' }}>
        {children}
      </div>
    </div>
  )
}
