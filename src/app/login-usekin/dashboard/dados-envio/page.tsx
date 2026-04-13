import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { PrismaClient } from '@prisma/client'
import DadosEnvioClient from './DadosEnvioClient'

const prisma = new PrismaClient()

async function getConfigEnvio() {
  try {
    const config = await prisma.configSite.findUnique({
      where: { chave: 'dados_envio' }
    })
    return config?.valor ? JSON.parse(config.valor) : {}
  } catch {
    return {}
  }
}

export default async function DadosEnvioPage() {
  const cookieStore = cookies()
  const authCookie = cookieStore.get('auth-token')

  if (!authCookie?.value) {
    redirect('/login-usekin')
  }

  const config = await getConfigEnvio()

  return <DadosEnvioClient initialData={config} />
}
