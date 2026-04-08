'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { authenticator } from 'otplib'

export default function LoginUseKIN() {
  const [step, setStep] = useState<1 | 2>(1)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [totpCode, setTotpCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const router = useRouter()

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/auth/verify-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success) {
        setStep(2)
      } else {
        setError(data.error || 'Credenciais inválidas')
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor')
    } finally {
      setLoading(false)
    }
  }

  const handleTotpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Validar TOTP localmente com secret fixo
      const secret = 'JVOVM5Y2BYDEAW2M'
      const isValid = authenticator.verify({
        token: totpCode,
        secret: secret
      })

      if (!isValid) {
        setError('Código inválido ou expirado')
        return
      }

      // Verificar se TOTP está configurado no banco
      const statusResponse = await fetch('/api/admin/auth/confirm-totp', {
        method: 'GET',
      })

      const statusData = await statusResponse.json()

      if (!statusData.configured) {
        setError('TOTP não configurado. Faça o setup primeiro.')
        return
      }

      // Criar cookie de sessão
      document.cookie = 'admin-session=64769881-10dc-463f-bced-1637fe764447; path=/; max-age=604800; secure; samesite=strict'
      
      router.push('/login-usekin/dashboard')
    } catch (err) {
      setError('Erro ao conectar com o servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      backgroundColor: '#000000',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, sans-serif'
    }}>
      <Image 
        src="/icons/Icones-Site-Use-KIN-logo-branca.svg" 
        width={180} 
        height={60} 
        alt="Use KIN Logo"
      />
      
      <div style={{ 
        marginTop: '48px', 
        width: '400px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {step === 1 ? (
          <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                backgroundColor: '#111111',
                border: '1px solid #333333',
                borderRadius: '8px',
                padding: '14px 20px',
                color: '#FFFFFF',
                fontSize: '16px',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 300,
                outline: 'none'
              }}
            />
            
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                backgroundColor: '#111111',
                border: '1px solid #333333',
                borderRadius: '8px',
                padding: '14px 20px',
                color: '#FFFFFF',
                fontSize: '16px',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 300,
                outline: 'none'
              }}
            />
            
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: '#DAA520',
                color: '#FFFFFF',
                fontSize: '15px',
                fontWeight: 700,
                fontFamily: 'Inter, sans-serif',
                padding: '14px',
                width: '100%',
                borderRadius: '999px',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.3s ease'
              }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#46A520')}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#DAA520')}
            >
              {loading ? 'Carregando...' : 'CONTINUAR'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleTotpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              color: '#FFFFFF',
              fontSize: '16px',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 300,
              textAlign: 'center',
              marginBottom: '8px'
            }}>
              Abra o Google Authenticator e digite o código
            </div>
            
            <input
              type="text"
              placeholder="Código de 6 dígitos"
              value={totpCode}
              onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              required
              maxLength={6}
              style={{
                backgroundColor: '#111111',
                border: '1px solid #333333',
                borderRadius: '8px',
                padding: '14px 20px',
                color: '#FFFFFF',
                fontSize: '16px',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 300,
                outline: 'none',
                textAlign: 'center',
                letterSpacing: '4px'
              }}
            />
            
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: '#DAA520',
                color: '#FFFFFF',
                fontSize: '15px',
                fontWeight: 700,
                fontFamily: 'Inter, sans-serif',
                padding: '14px',
                width: '100%',
                borderRadius: '999px',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.3s ease'
              }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#46A520')}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#DAA520')}
            >
              {loading ? 'Carregando...' : 'ENTRAR'}
            </button>
          </form>
        )}
        
        {error && (
          <div style={{
            color: '#F0484A',
            fontSize: '14px',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            marginTop: '8px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}
      </div>
    </div>
  )
}
