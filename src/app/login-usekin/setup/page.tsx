'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function SetupTOTP() {
  const [qrCode, setQrCode] = useState<string>('')
  const [secret, setSecret] = useState<string>('')
  const [verificationCode, setVerificationCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isConfigured, setIsConfigured] = useState(false)
  
  const router = useRouter()

  useEffect(() => {
    // Verificar se já está configurado
    checkIfConfigured()
  }, [])

  const checkIfConfigured = async () => {
    try {
      const response = await fetch('/api/admin/auth/setup-totp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: 'admin@usekin.com' }),
      })

      const data = await response.json()

      if (data.success) {
        setQrCode(data.qrCode)
        setSecret(data.secret)
      } else {
        setIsConfigured(true)
        router.push('/login-usekin')
      }
    } catch (err) {
      setError('Erro ao verificar configuração')
    }
  }

  const handleVerifySetup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Aqui você precisaria de uma API para confirmar e salvar o secret
      // Por enquanto, vamos simular o sucesso e redirecionar
      router.push('/login-usekin')
    } catch (err) {
      setError('Erro ao confirmar configuração')
    } finally {
      setLoading(false)
    }
  }

  if (isConfigured) {
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
        <div style={{ color: '#FFFFFF', textAlign: 'center' }}>
          <h2>Sistema já configurado</h2>
          <p>Redirecionando para o login...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      backgroundColor: '#000000',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, sans-serif',
      padding: '20px'
    }}>
      <Image 
        src="/icons/Icones-Site-Use-KIN-logo-branca.svg" 
        width={180} 
        height={60} 
        alt="Use KIN Logo"
      />
      
      <div style={{ 
        marginTop: '48px', 
        width: '100%',
        maxWidth: '500px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        alignItems: 'center'
      }}>
        <div style={{
          color: '#FFFFFF',
          fontSize: '24px',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 600,
          textAlign: 'center'
        }}>
          Configuração de Autenticação
        </div>

        <div style={{
          color: '#AAAAAA',
          fontSize: '16px',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 300,
          textAlign: 'center',
          lineHeight: 1.5
        }}>
          Escaneie este QR Code com o Google Authenticator
        </div>

        {qrCode && (
          <div style={{
            backgroundColor: '#FFFFFF',
            padding: '20px',
            borderRadius: '12px',
            border: '2px solid #333333'
          }}>
            <Image 
              src={qrCode} 
              width={200} 
              height={200} 
              alt="QR Code para Google Authenticator"
            />
          </div>
        )}

        <div style={{
          color: '#AAAAAA',
          fontSize: '14px',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 300,
          textAlign: 'center',
          lineHeight: 1.5
        }}>
          Ou digite manualmente este código no app:<br/>
          <span style={{ 
            color: '#DAA520',
            fontFamily: 'monospace',
            fontSize: '16px',
            wordBreak: 'break-all'
          }}>
            {secret}
          </span>
        </div>

        <form onSubmit={handleVerifySetup} style={{ 
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{
            color: '#FFFFFF',
            fontSize: '16px',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 300,
            textAlign: 'center'
          }}>
            Digite o código de 6 dígitos para confirmar:
          </div>
          
          <input
            type="text"
            placeholder="Código de 6 dígitos"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
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
            {loading ? 'Verificando...' : 'CONFIRMAR CONFIGURAÇÃO'}
          </button>
        </form>
        
        {error && (
          <div style={{
            color: '#F0484A',
            fontSize: '14px',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}
      </div>
    </div>
  )
}
