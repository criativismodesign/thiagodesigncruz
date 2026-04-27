'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const menuItems = [
  { href: '/login-usekin/dashboard', label: 'Início' },
  { href: '/login-usekin/dashboard/produtos', label: 'Produtos' },
  { href: '/login-usekin/dashboard/colecoes', label: 'Coleções' },
  { href: '/login-usekin/dashboard/pedidos', label: 'Pedidos' },
  { href: '/login-usekin/dashboard/pedidos-avulso', label: 'Pedidos Avulsos' },
  { href: '/login-usekin/dashboard/banners', label: 'Banners' },
  { href: '/login-usekin/dashboard/banners-categoria', label: 'Banners Categoria' },
  { href: '/login-usekin/dashboard/cupons', label: 'Cupons' },
  { href: '/login-usekin/dashboard/dados-envio', label: 'Dados de Envio' },
  { href: '/login-usekin/dashboard/configuracoes', label: 'Configurações' },
]

export default function DashboardMenu() {
  const pathname = usePathname()

  return (
    <nav style={{ flex: 1, padding: '12px 0' }}>
      {menuItems.map((item) => {
        const ativo = pathname === item.href || (item.href !== '/login-usekin/dashboard' && pathname.startsWith(item.href))
        return (
          <Link key={item.href} href={item.href} style={{
            display: 'block',
            padding: '10px 20px',
            color: ativo ? '#DAA520' : '#CCC',
            textDecoration: 'none',
            fontSize: 14,
            fontWeight: ativo ? 700 : 400,
            background: ativo ? '#2A2A2A' : 'transparent',
            borderLeft: ativo ? '3px solid #DAA520' : '3px solid transparent',
          }}>
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
