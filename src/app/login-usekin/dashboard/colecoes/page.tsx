import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import ColecoesClient from './ColecoesClient'

export default async function ColecoesPage() {
  // Verificar autenticação
  const cookieStore = await cookies()
  const session = cookieStore.get('admin-session')?.value
  const validToken = process.env.ADMIN_SESSION_TOKEN

  if (!session || !validToken || session !== validToken) {
    redirect('/login-usekin')
  }

  return (
    <AdminLayout title="Coleções">
      <ColecoesClient />
    </AdminLayout>
  )
}
