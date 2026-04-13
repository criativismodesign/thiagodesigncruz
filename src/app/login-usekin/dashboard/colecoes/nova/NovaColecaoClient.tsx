'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NovaColecaoClient() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nome: '',
    subtitulo: '',
    visivelHome: false,
    ordemHome: 0,
    status: 'ativa',
  })
  const [imagemCamiseta, setImagemCamiseta] = useState<string>('')
  const [imagemMousepad, setImagemMousepad] = useState<string>('')
  const [imagemBannerCategoria, setImagemBannerCategoria] = useState<string>('')

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, tipo: 'camiseta' | 'mousepad' | 'bannerCategoria') => {
    const file = e.target.files?.[0]
    if (!file) return
    const formDataUpload = new FormData()
    formDataUpload.append('file', file)
    formDataUpload.append('pasta', 'colecoes')
    const response = await fetch('/api/admin/upload', { method: 'POST', body: formDataUpload })
    const data = await response.json()
    if (data.success) {
      if (tipo === 'camiseta') setImagemCamiseta(data.url)
      else if (tipo === 'mousepad') setImagemMousepad(data.url)
      else if (tipo === 'bannerCategoria') setImagemBannerCategoria(data.url)
    }
  }

  const handleSalvar = async () => {
    if (!formData.nome || !formData.subtitulo) {
      alert('Nome e subtítulo são obrigatórios')
      return
    }
    setLoading(true)
    try {
      const response = await fetch('/api/admin/colecoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, imagemCamiseta, imagemMousepad, imagemBannerCategoria })
      })
      if (response.ok) {
        router.push('/login-usekin/dashboard/colecoes')
      } else {
        const data = await response.json()
        alert('Erro: ' + data.error)
      }
    } catch (error) {
      alert('Erro ao salvar: ' + error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F5F5F5' }}>
      {/* Header navegação padrão */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E5E5E5', padding: '16px 32px', display: 'flex', alignItems: 'center', gap: 24 }}>
