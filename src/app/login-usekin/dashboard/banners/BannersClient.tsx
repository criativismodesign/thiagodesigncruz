'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface HeroBanner {
  id: string
  imagem?: string
  supertitulo?: string
  titulo: string
  descricao?: string
  textoBotao: string
  linkBotao?: string
  ordem: number
  ativo: boolean
}

export default function BannersClient() {
  const [banners, setBanners] = useState<HeroBanner[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingBanner, setEditingBanner] = useState<HeroBanner | null>(null)
  const [formData, setFormData] = useState({
    imagem: '',
    supertitulo: '',
    titulo: '',
    descricao: '',
    textoBotao: 'VER COLEÇÃO',
    linkBotao: '',
    ordem: 0,
    ativo: true
  })

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/admin/hero-banners')
      if (response.ok) {
        const data = await response.json()
        setBanners(data)
      }
    } catch (error) {
      console.error('Erro ao buscar banners:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingBanner 
        ? `/api/admin/hero-banners/${editingBanner.id}`
        : '/api/admin/hero-banners'
      
      const method = editingBanner ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setShowModal(false)
        setEditingBanner(null)
        setFormData({
          imagem: '',
          supertitulo: '',
          titulo: '',
          descricao: '',
          textoBotao: 'VER COLEÇÃO',
          linkBotao: '',
          ordem: 0,
          ativo: true
        })
        fetchBanners()
      }
    } catch (error) {
      console.error('Erro ao salvar banner:', error)
    }
  }

  const handleEdit = (banner: HeroBanner) => {
    setEditingBanner(banner)
    setFormData({
      imagem: banner.imagem || '',
      supertitulo: banner.supertitulo || '',
      titulo: banner.titulo,
      descricao: banner.descricao || '',
      textoBotao: banner.textoBotao,
      linkBotao: banner.linkBotao || '',
      ordem: banner.ordem,
      ativo: banner.ativo
    })
    setShowModal(true)
  }

  const handleImageUpload = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('pasta', 'banners')

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        setFormData(prev => ({ ...prev, imagem: data.url }))
      }
    } catch (error) {
      console.error('Erro ao fazer upload:', error)
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <div>Carregando...</div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F5F5F5' }}>
      {/* Header navegação */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E5E5E5', padding: '16px 32px', display: 'flex', alignItems: 'center', gap: 24 }}>
