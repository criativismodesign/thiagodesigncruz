import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { PrismaClient } from '@prisma/client'
import { notFound } from 'next/navigation'
import ProdutoForm from '../ProdutoForm'

const prisma = new PrismaClient()

interface PageProps {
  params: { id: string }
}

export default async function EditarProdutoPage({ params }: PageProps) {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin-session')?.value
  
  if (!session || session !== process.env.ADMIN_SESSION_TOKEN) {
    redirect('/login-usekin')
  }

  // Buscar produto pelo ID
  let produto = null
  try {
    produto = await prisma.produto.findUnique({
      where: { id: params.id }
    })
  } catch (error) {
    console.error('Erro ao buscar produto:', error)
  }

  if (!produto) {
    notFound()
  }

  // Buscar coleções para o select
  let colecoes = []
  try {
    colecoes = await prisma.colecao.findMany({
      orderBy: { nome: 'asc' }
    })
  } catch (error) {
    console.error('Erro ao buscar coleções:', error)
    colecoes = []
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F5F5F5' }}>
      {/* Header navegação */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E5E5E5', padding: '16px 32px', display: 'flex', alignItems: 'center', gap: 24 }}>
        <span style={{ fontWeight: 700, fontSize: 18, color: '#292929' }}>Use KIN Admin</span>
        <a href="/login-usekin/dashboard" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Dashboard</a>
        <a href="/login-usekin/dashboard/produtos" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Produtos</a>
        <a href="/login-usekin/dashboard/colecoes" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Coleções</a>
        <a href="/login-usekin/dashboard/banners" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Banners</a>
        <div style={{ marginLeft: 'auto' }}>
          <button
            onClick={async () => {
              await fetch('/api/admin/logout', { method: 'POST' })
              window.location.href = '/login-usekin'
            }}
            style={{ color: '#888', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 14 }}
          >
            Sair
          </button>
        </div>
      </div>

      {/* Conteúdo */}
      <div style={{ padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#292929', margin: 0 }}>Editar Produto</h1>
          <a
            href="/login-usekin/dashboard/produtos"
            style={{ background: '#6B7280', color: '#fff', border: 'none', borderRadius: 999, padding: '10px 24px', cursor: 'pointer', fontWeight: 700, fontSize: 14, textDecoration: 'none', display: 'inline-block' }}
          >
            Cancelar
          </a>
        </div>

        <ProdutoForm produto={produto} colecoes={colecoes} />
      </div>
    </div>
  )
}
