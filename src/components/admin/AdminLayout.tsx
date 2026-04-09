'use client'
import Link from 'next/link'
import LogoutButton from '@/components/admin/LogoutButton'
import { usePathname } from 'next/navigation'

interface AdminLayoutProps {
  children: React.ReactNode
  title?: string
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const pathname = usePathname()

  const navItems = [
    { href: '/login-usekin/dashboard', label: 'Dashboard' },
    { href: '/login-usekin/dashboard/produtos', label: 'Produtos' },
    { href: '/login-usekin/dashboard/colecoes', label: 'Coleções' },
    { href: '/login-usekin/dashboard/banners', label: 'Banners' }
  ]

  const isActive = (href: string) => {
    if (href === '/login-usekin/dashboard') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F5F5F5' }}>
      {/* Header de Navegação */}
      <div style={{
        background: '#FFFFFF',
        borderBottom: '1px solid #E5E5E5',
        padding: '16px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <span style={{ fontSize: 20, fontWeight: 600, color: '#292929' }}>
            Use KIN Admin
          </span>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  textDecoration: 'none',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: 14,
                  fontWeight: 500,
                  transition: 'all 0.2s',
                  ...(isActive(item.href)
                    ? {
                        background: '#007BFF',
                        color: '#FFFFFF'
                      }
                    : {
                        color: '#666666',
                        ':hover': {
                          background: '#F8F9FA',
                          color: '#292929'
                        }
                      })
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        
        <LogoutButton />
      </div>

      {/* Conteúdo da Página */}
      <div style={{ padding: '48px 40px' }}>
        {title && (
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: 28, fontWeight: 600, color: '#292929', margin: 0 }}>
              {title}
            </h1>
            <p style={{ color: '#AAAAAA', marginTop: 8, margin: 0 }}>
              Gerencie {title.toLowerCase()} Use KIN
            </p>
          </div>
        )}
        
        {children}
      </div>
    </div>
  )
}
