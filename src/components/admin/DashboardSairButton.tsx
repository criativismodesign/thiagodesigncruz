"use client"

export default function DashboardSairButton() {
  const handleSair = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    window.location.href = '/login-usekin'
  }

  return (
    <button onClick={handleSair} style={{ color: '#888', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 14 }}>
      Sair
    </button>
  )
}
