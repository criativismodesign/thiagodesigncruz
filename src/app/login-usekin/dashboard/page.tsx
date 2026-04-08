'use client'

import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      // Limpar cookie de sessão
      document.cookie = 'admin-session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      
      // Redirecionar para login
      router.push('/login-usekin')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      minHeight: '100vh',
      fontFamily: 'Inter, sans-serif',
      padding: '40px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '40px',
          paddingBottom: '20px',
          borderBottom: '1px solid #E5E5E5'
        }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 700,
            color: '#292929',
            margin: 0
          }}>
            Painel Use KIN
          </h1>
          
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: '#F0484A',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: 600,
              fontFamily: 'Inter, sans-serif',
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#D63638'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F0484A'}
          >
            SAIR
          </button>
        </div>

        {/* Conteúdo Principal */}
        <div style={{
          backgroundColor: '#F8F9FA',
          borderRadius: '12px',
          padding: '40px',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 600,
            color: '#292929',
            marginBottom: '16px'
          }}>
            Bem-vindo ao Painel Use KIN
          </h2>
          
          <p style={{
            fontSize: '16px',
            color: '#AAAAAA',
            lineHeight: 1.6,
            marginBottom: '32px'
          }}>
            Sistema de administração Use KIN está funcionando corretamente.<br/>
            Esta é uma página placeholder - funcionalidades serão implementadas posteriormente.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginTop: '40px'
          }}>
            {/* Cards de informações */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              padding: '24px',
              border: '1px solid #E5E5E5'
            }}>
              <div style={{
                fontSize: '14px',
                color: '#AAAAAA',
                marginBottom: '8px'
              }}>
                Status do Sistema
              </div>
              <div style={{
                fontSize: '20px',
                fontWeight: 600,
                color: '#46A520'
              }}>
                Online
              </div>
            </div>

            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              padding: '24px',
              border: '1px solid #E5E5E5'
            }}>
              <div style={{
                fontSize: '14px',
                color: '#AAAAAA',
                marginBottom: '8px'
              }}>
                Versão
              </div>
              <div style={{
                fontSize: '20px',
                fontWeight: 600,
                color: '#292929'
              }}>
                1.0.0
              </div>
            </div>

            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              padding: '24px',
              border: '1px solid #E5E5E5'
            }}>
              <div style={{
                fontSize: '14px',
                color: '#AAAAAA',
                marginBottom: '8px'
              }}>
                Ambiente
              </div>
              <div style={{
                fontSize: '20px',
                fontWeight: 600,
                color: '#292929'
              }}>
                {process.env.NODE_ENV === 'production' ? 'Produção' : 'Desenvolvimento'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
