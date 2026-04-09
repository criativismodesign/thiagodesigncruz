import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { PrismaClient } from '@prisma/client'
import ConfiguracoesClient from './ConfiguracoesClient'

const prisma = new PrismaClient()

export default async function ConfiguracoesPage() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin-session')?.value
  if (!session || session !== process.env.ADMIN_SESSION_TOKEN) {
    redirect('/login-usekin')
  }

  const configs: any[] = await prisma.configSite.findMany()
  const configMap: Record<string, string> = {}
  configs.forEach(c => { configMap[c.chave] = c.valor })

  return <ConfiguracoesClient configs={configMap} />
}
