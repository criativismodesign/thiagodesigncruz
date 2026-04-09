export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, padding: 0, fontFamily: 'Inter, sans-serif', background: '#F5F5F5' }}>
        {children}
      </body>
    </html>
  )
}
