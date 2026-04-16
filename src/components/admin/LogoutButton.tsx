'use client'

export default function LogoutButton() {
  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    window.location.href = '/login-usekin'
  }

  return (
    <button onClick={handleLogout}
      style={{ color: '#EF4444', background: 'transparent', border: '1px solid #EF4444', borderRadius: 8, cursor: 'pointer', fontSize: 14, padding: '8px 16px', width: '100%', fontWeight: 600 }}>
      Sair
    </button>
  )
}

