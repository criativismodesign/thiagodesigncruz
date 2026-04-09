import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import NovaColecaoClient from './NovaColecaoClient'

export default async function NovaColecaoPage() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin-session')?.value
  if (!session || session !== process.env.ADMIN_SESSION_TOKEN) {
    redirect('/login-usekin')
  }
  return <NovaColecaoClient />
}
