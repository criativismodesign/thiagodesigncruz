import Link from 'next/link'

export default function TermosPage() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '60px 24px', textAlign: 'center' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#292929', marginBottom: 16 }}>Termos e Políticas</h1>
      <p style={{ fontSize: 15, color: '#444', lineHeight: 1.8, marginBottom: 40 }}>Acesse nossas políticas completas:</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 400, margin: '0 auto' }}>
        {[
          { href: '/politicas/privacidade', label: 'Política de Privacidade' },
          { href: '/politicas/reembolso', label: 'Política de Reembolso e Devoluções' },
          { href: '/politicas/troca', label: 'Política de Troca' },
          { href: '/politicas/entrega', label: 'Entrega e Prazo' },
          { href: '/contato', label: 'Fale Conosco' },
        ].map((item) => (
          <Link key={item.href} href={item.href} style={{ display: 'block', padding: '14px 24px', background: '#F9F9F9', border: '1px solid #E5E5E5', borderRadius: 8, color: '#292929', textDecoration: 'none', fontSize: 15, fontWeight: 500 }}>
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
