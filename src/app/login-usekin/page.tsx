'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function LoginUseKIN() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    
    const data = await res.json()
    console.log('Resposta da API:', data)
    
    if (data.success) {
      document.cookie = `admin-session-check=true; path=/` 
      window.location.href = '/login-usekin/dashboard'
    } else {
      setError(data.error || 'Email ou senha inválidos')
    }
    setLoading(false)
  }

  return (
    <div style={{
      backgroundColor: '#000000',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      margin: 0,
      padding: 0
    }}>
      <Image 
        src="/icons/Icones-Site-Use-KIN-logo-branca.svg" 
        width={180} 
        height={60} 
        alt="Use KIN Logo"
      />
      
      <form onSubmit={handleLogin} style={{
        marginTop: '48px',
        width: '400px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 300,
            fontSize: '16px',
            backgroundColor: '#111111',
            border: '1px solid #333333',
            borderRadius: '8px',
            padding: '14px 20px',
            color: '#FFFFFF',
            outline: 'none'
          }}
        />
        
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          required
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 300,
            fontSize: '16px',
            backgroundColor: '#111111',
            border: '1px solid #333333',
            borderRadius: '8px',
            padding: '14px 20px',
            color: '#FFFFFF',
            outline: 'none'
          }}
        />
        
        <button
          type="submit"
          disabled={loading}
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 'bold',
            fontSize: '15px',
            color: '#FFFFFF',
            backgroundColor: '#DAA520',
            border: 'none',
            borderRadius: '999px',
            padding: '14px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e: any) => {
            if (!loading) e.target.style.backgroundColor = '#46A520'
          }}
          onMouseOut={(e: any) => {
            if (!loading) e.target.style.backgroundColor = '#DAA520'
          }}
        >
          {loading ? 'Entrando...' : 'ENTRAR'}
        </button>
        
        {error && (
          <div style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            fontSize: '14px',
            color: '#F0484A',
            marginTop: '8px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}
      </form>
    </div>
  )
}
