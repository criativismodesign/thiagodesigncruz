'use client'

export default function LogoutButton() {
  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    window.location.href = '/login-usekin'
  }

  return (
    <button onClick={handleLogout} style={{
      background: 'transparent',
      border: '1px solid #E5E5E5',
      borderRadius: 999,
      padding: '8px 20px',
      cursor: 'pointer',
      fontSize: 14,
      color: '#292929'
    }}>
      Sair
    </button>
  )
}

