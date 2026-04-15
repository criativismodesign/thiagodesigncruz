'use client'

import { useState } from 'react'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      if (response.ok) {
        setMessage('E-mail cadastrado com sucesso!')
        setEmail('')
      } else {
        setMessage('Erro ao cadastrar e-mail. Tente novamente.')
      }
    } catch (error) {
      setMessage('Erro ao cadastrar e-mail. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      background: '#292929', 
      color: '#fff', 
      padding: '60px 20px',
      textAlign: 'center' 
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ 
          fontSize: '32px', 
          fontWeight: 'bold', 
          marginBottom: '16px' 
        }}>
          Receba Novidades
        </h2>
        <p style={{ 
          fontSize: '18px', 
          marginBottom: '32px', 
          color: '#AAAAAA' 
        }}>
          Cadastre-se para receber lançamentos exclusivos e promoções especiais
        </p>
        
        <form onSubmit={handleSubmit} style={{ 
          display: 'flex', 
          gap: '12px',
          maxWidth: '400px',
          margin: '0 auto'
        }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Seu melhor e-mail"
            required
            style={{
              flex: 1,
              padding: '12px 16px',
              border: '1px solid #E5E5E5',
              borderRadius: '8px',
              fontSize: '16px',
              background: '#fff',
              color: '#292929'
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px 24px',
              background: '#DAA520',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? '...' : 'Cadastrar'}
          </button>
        </form>
        
        {message && (
          <p style={{ 
            marginTop: '16px', 
            fontSize: '14px',
            color: message.includes('sucesso') ? '#46A520' : '#F0484A'
          }}>
            {message}
          </p>
        )}
      </div>
    </div>
  )
}
