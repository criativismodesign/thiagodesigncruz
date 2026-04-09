import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import ProdutosClient from './ProdutosClient'

export default async function ProdutosPage() {
  // Verificar autenticação
  const cookieStore = await cookies()
  const session = cookieStore.get('admin-session')?.value
  const validToken = process.env.ADMIN_SESSION_TOKEN

  if (!session || !validToken || session !== validToken) {
    redirect('/login-usekin')
  }

  return <ProdutosClient />
}
