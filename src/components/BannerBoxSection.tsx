'use client'

import { useState } from 'react'

export default function BannerBoxSection() {
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
      background: 'linear-gradient(135deg, #DAA520 0%, #B8860B 100%)', 
      padding: '80px 20px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat',
        opacity: 0.3
      }} />
      
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto',
        position: 'relative',
        zIndex: 1
      }}>
        <h2 style={{ 
          fontSize: '48px', 
          fontWeight: 'bold', 
          marginBottom: '24px',
          color: '#fff',
          textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
        }}>
          Design Que Transforma
        </h2>
        <p style={{ 
          fontSize: '20px', 
          marginBottom: '40px', 
          color: '#fff',
          lineHeight: '1.6',
          maxWidth: '600px',
          margin: '0 auto 40px auto'
        }}>
          Camisetas e mouse pads com arte exclusiva. Express sua personalidade com qualidade e estilo que só a Thiago Design Cruz oferece.
        </p>
        
        <div style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <a
            href="/produtos"
            style={{
              display: 'inline-block',
              padding: '16px 32px',
              background: '#fff',
              color: '#DAA520',
              textDecoration: 'none',
              borderRadius: '50px',
              fontSize: '18px',
              fontWeight: '600',
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
              transition: 'all 0.3s ease'
            }}
          >
            Explorar Coleções
          </a>
          <a
            href="/criar-design"
            style={{
              display: 'inline-block',
              padding: '16px 32px',
              background: 'transparent',
              color: '#fff',
              border: '2px solid #fff',
              textDecoration: 'none',
              borderRadius: '50px',
              fontSize: '18px',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
          >
            Criar Seu Design
          </a>
        </div>
      </div>
    </div>
  )
}
