import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { headers } from 'next/headers'
import DashboardSairButton from '@/components/admin/DashboardSairButton'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || ''
  
  // Função para verificar se página está ativa
  const isActive = (path: string) => {
    return pathname.includes(path)
  }
  const cookieStore = await cookies()
  const session = cookieStore.get('admin-session')?.value
  const validToken = process.env.ADMIN_SESSION_TOKEN

  if (!session || !validToken || session !== validToken) {
    redirect('/login-usekin')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F5F5F5' }}>
      <div style={{ background: '#fff', borderBottom: '1px solid #E5E5E5', padding: '16px 32px', display: 'flex', alignItems: 'center', gap: 24 }}>
        <span style={{ fontWeight: 700, fontSize: 18, color: '#292929' }}>Use KIN Admin</span>
        <Link 
          href="/login-usekin/dashboard" 
          style={{ 
            background: isActive('/dashboard') && !isActive('/dashboard/') ? '#2563eb' : 'transparent', 
            color: isActive('/dashboard') && !isActive('/dashboard/') ? '#fff' : '#888', 
            padding: '6px 16px', 
            borderRadius: 8, 
            textDecoration: 'none', 
            fontSize: 14 
          }}
        >
          Dashboard
        </Link>
        <Link 
          href="/login-usekin/dashboard/produtos" 
          style={{ 
            background: isActive('/produtos') ? '#2563eb' : 'transparent', 
            color: isActive('/produtos') ? '#fff' : '#888', 
            padding: '6px 16px', 
            borderRadius: 8, 
            textDecoration: 'none', 
            fontSize: 14 
          }}
        >
          Produtos
        </Link>
        <Link 
          href="/login-usekin/dashboard/colecoes" 
          style={{ 
            background: isActive('/colecoes') ? '#2563eb' : 'transparent', 
            color: isActive('/colecoes') ? '#fff' : '#888', 
            padding: '6px 16px', 
            borderRadius: 8, 
            textDecoration: 'none', 
            fontSize: 14 
          }}
        >
          Coleções
        </Link>
        <Link 
          href="/login-usekin/dashboard/banners" 
          style={{ 
            background: isActive('/banners') ? '#2563eb' : 'transparent', 
            color: isActive('/banners') ? '#fff' : '#888', 
            padding: '6px 16px', 
            borderRadius: 8, 
            textDecoration: 'none', 
            fontSize: 14 
          }}
        >
          Banners
        </Link>
        <Link 
          href="/login-usekin/dashboard/banners-categoria" 
          style={{ 
            background: isActive('/banners-categoria') ? '#2563eb' : 'transparent', 
            color: isActive('/banners-categoria') ? '#fff' : '#888', 
            padding: '6px 16px', 
            borderRadius: 8, 
            textDecoration: 'none', 
            fontSize: 14 
          }}
        >
          Banners Categoria
        </Link>
        <Link 
          href="/login-usekin/dashboard/pedidos" 
          style={{ 
            background: isActive('/pedidos') ? '#2563eb' : 'transparent', 
            color: isActive('/pedidos') ? '#fff' : '#888', 
            padding: '6px 16px', 
            borderRadius: 8, 
            textDecoration: 'none', 
            fontSize: 14 
          }}
        >
          Pedidos
        </Link>
        <Link 
          href="/login-usekin/dashboard/cupons" 
          style={{ 
            background: isActive('/cupons') ? '#2563eb' : 'transparent', 
            color: isActive('/cupons') ? '#fff' : '#888', 
            padding: '6px 16px', 
            borderRadius: 8, 
            textDecoration: 'none', 
            fontSize: 14 
          }}
        >
          Cupons
        </Link>
        <Link 
          href="/login-usekin/dashboard/dados-envio" 
          style={{ 
            background: isActive('/dados-envio') ? '#2563eb' : 'transparent', 
            color: isActive('/dados-envio') ? '#fff' : '#888', 
            padding: '6px 16px', 
            borderRadius: 8, 
            textDecoration: 'none', 
            fontSize: 14 
          }}
        >
          Dados de Envio
        </Link>
        <Link 
          href="/login-usekin/dashboard/configuracoes" 
          style={{ 
            background: isActive('/configuracoes') ? '#2563eb' : 'transparent', 
            color: isActive('/configuracoes') ? '#fff' : '#888', 
            padding: '6px 16px', 
            borderRadius: 8, 
            textDecoration: 'none', 
            fontSize: 14 
          }}
        >
          Configurações
        </Link>
        <div style={{ marginLeft: 'auto' }}>
          <DashboardSairButton />
        </div>
      </div>

      <div style={{ padding: '32px' }}>
        {children}
      </div>
    </div>
  )
}
