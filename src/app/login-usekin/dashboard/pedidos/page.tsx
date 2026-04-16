import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import PedidosClient from './PedidosClient'

export default async function PedidosPage() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin-session')?.value
  if (!session || session !== process.env.ADMIN_SESSION_TOKEN) {
    redirect('/login-usekin')
  }
  return <PedidosClient />
}
