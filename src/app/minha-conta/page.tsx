"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  User, 
  ShoppingBag, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  XCircle,
  Edit,
  LogOut,
  Home,
  CreditCard,
  MapPin,
  Phone,
  Mail
} from "lucide-react";
import { toast } from "sonner";

function formatarCPF(valor: string): string {
  const nums = valor.replace(/\D/g, '').slice(0, 11)
  if (nums.length <= 3) return nums
  if (nums.length <= 6) return `${nums.slice(0,3)}.${nums.slice(3)}` 
  if (nums.length <= 9) return `${nums.slice(0,3)}.${nums.slice(3,6)}.${nums.slice(6)}` 
  return `${nums.slice(0,3)}.${nums.slice(3,6)}.${nums.slice(6,9)}-${nums.slice(9)}` 
}

function validarCPF(cpf: string): boolean {
  const nums = cpf.replace(/\D/g, '')
  if (nums.length !== 11) return false
  if (/^(\d)\1+$/.test(nums)) return false
  let soma = 0
  for (let i = 0; i < 9; i++) soma += parseInt(nums[i]) * (10 - i)
  let resto = (soma * 10) % 11
  if (resto === 10 || resto === 11) resto = 0
  if (resto !== parseInt(nums[9])) return false
  soma = 0
  for (let i = 0; i < 10; i++) soma += parseInt(nums[i]) * (11 - i)
  resto = (soma * 10) % 11
  if (resto === 10 || resto === 11) resto = 0
  return resto === parseInt(nums[10])
}

interface Order {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  trackingCode?: string;
}

interface UserData {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  addresses: Array<{
    id: string;
    label: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  }>;
}

export default function MinhaContaPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "profile" | "addresses">("overview");
  const [orders, setOrders] = useState<Order[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState<any[]>([])
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<any>(null)
  const [addressForm, setAddressForm] = useState({
    label: 'Casa',
    zipCode: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    isDefault: false,
  })
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [passwordForm, setPasswordForm] = useState({ senhaAtual: '', novaSenha: '', confirmarSenha: '' })
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      fetchUserData();
      fetchOrders();
      fetchAddresses();
    }
  }, [status, router]);

  const fetchUserData = async () => {
    try {
      const res = await fetch("/api/user/profile");
      if (res.ok) {
        const data = await res.json();
        setUserData(data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/user/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchAddresses = async () => {
    try {
      const resAddresses = await fetch('/api/user/address')
      const addressData = await resAddresses.json()
      setAddresses(Array.isArray(addressData) ? addressData : [])
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const buscarCep = async (cep: string) => {
    const cepLimpo = cep.replace(/\D/g, '')
    if (cepLimpo.length !== 8) return
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
      const data = await res.json()
      if (!data.erro) {
        setAddressForm(prev => ({
          ...prev,
          street: data.logradouro || '',
          neighborhood: data.bairro || '',
          city: data.localidade || '',
          state: data.uf || '',
        }))
      }
    } catch {}
  };

  const handleSalvarEndereco = async () => {
    try {
      const method = editingAddress ? 'PUT' : 'POST'
      const url = editingAddress ? `/api/user/address/${editingAddress.id}` : '/api/user/address'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addressForm)
      })
      if (res.ok) {
        const resAddresses = await fetch('/api/user/address')
        const data = await resAddresses.json()
        setAddresses(data)
        setShowAddressForm(false)
        setEditingAddress(null)
        setAddressForm({ label: 'Casa', zipCode: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '', isDefault: false })
      }
    } catch (error) {
      alert('Erro ao salvar endereço')
    }
  };

  const handleAlterarSenha = async () => {
    setPasswordError('')
    if (passwordForm.novaSenha !== passwordForm.confirmarSenha) {
      setPasswordError('As senhas não coincidem')
      return
    }
    if (passwordForm.novaSenha.length < 6) {
      setPasswordError('Nova senha deve ter pelo menos 6 caracteres')
      return
    }
    try {
      const res = await fetch('/api/user/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senhaAtual: passwordForm.senhaAtual, novaSenha: passwordForm.novaSenha })
      })
      const data = await res.json()
      if (res.ok) {
        setPasswordSuccess(true)
        setPasswordForm({ senhaAtual: '', novaSenha: '', confirmarSenha: '' })
        setShowPasswordForm(false)
        setTimeout(() => setPasswordSuccess(false), 3000)
      } else {
        setPasswordError(data.error || 'Erro ao alterar senha')
      }
    } catch {
      setPasswordError('Erro ao alterar senha')
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData) return;

    if (userData.cpf && !validarCPF(userData.cpf)) {
      toast.error('CPF inválido. Verifique o número digitado.')
      return
    }

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userData.name,
          phone: userData.phone,
          cpf: userData.cpf,
        }),
      });

      if (res.ok) {
        toast.success("Dados atualizados com sucesso!");
        setEditingProfile(false);
      } else {
        toast.error("Erro ao atualizar dados");
      }
    } catch (error) {
      toast.error("Erro ao atualizar dados");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "paid":
        return <CreditCard className="h-4 w-4 text-blue-500" />;
      case "shipped":
        return <Truck className="h-4 w-4 text-purple-500" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
  switch (status) {
    case "pending":
    case "aguardando_pagamento":
      return "Aguardando Pagamento"
    case "paid":
    case "pago":
    case "approved":
      return "Pago"
    case "pagamento_confirmado":
      return "Pagamento Confirmado"
    case "em_producao":
      return "Em Produção"
    case "em_logistica":
      return "Em Logística"
    case "shipped":
    case "enviado":
      return "Enviado"
    case "delivered":
    case "entregue":
      return "Entregue"
    case "cancelled":
    case "cancelado":
      return "Cancelado"
    default:
      return status
  }
}

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-[#292929]">Carregando...</div>
      </div>
    );
  }

  if (!session || !userData) {
    return null;
  }

  const userInitials = userData.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const recentOrders = orders.filter(o => o.status !== 'cancelado' && o.status !== 'cancelled').slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="rounded-2xl border border-[#E5E5E5] bg-white p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-[#DAA520] flex items-center justify-center text-white text-xl font-bold">
                {userInitials}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#292929]">{userData.name}</h1>
                <p className="text-[#AAAAAA]">{userData.email}</p>
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 px-4 py-2 bg-[#F0484A] text-white rounded-lg hover:bg-[#F0484A]/90 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-[#E5E5E5]">
          {[
            { id: "overview", label: "Visão Geral", icon: Home },
            { id: "orders", label: "Meus Pedidos", icon: ShoppingBag },
            { id: "profile", label: "Meus Dados", icon: User },
            { id: "addresses", label: "Endereços", icon: MapPin },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-[#DAA520] text-[#DAA520]"
                  : "border-transparent text-[#AAAAAA] hover:text-[#292929]"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="rounded-2xl border border-[#E5E5E5] bg-white p-6">
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-[#F5F5F5] rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="h-8 w-8 text-[#DAA520]" />
                    <div>
                      <p className="text-2xl font-bold text-[#292929]">{orders.length}</p>
                      <p className="text-sm text-[#AAAAAA]">Total de Pedidos</p>
                    </div>
                  </div>
                </div>
                <div className="bg-[#F5F5F5] rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-8 w-8 text-[#46A520]" />
                    <div>
                      <p className="text-2xl font-bold text-[#292929]">
                        {orders.filter((o) => o.status === "delivered").length}
                      </p>
                      <p className="text-sm text-[#AAAAAA]">Pedidos Entregues</p>
                    </div>
                  </div>
                </div>
                <div className="bg-[#F5F5F5] rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-8 w-8 text-[#F0484A]" />
                    <div>
                      <p className="text-2xl font-bold text-[#292929]">
                        {orders.filter((o) => o.status === "pending" || o.status === "paid").length}
                      </p>
                      <p className="text-sm text-[#AAAAAA]">Pedidos em Andamento</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div>
                <h2 className="text-xl font-bold text-[#292929] mb-4">Pedidos Recentes</h2>
                {recentOrders.length > 0 ? (
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="bg-[#F5F5F5] rounded-xl p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div>
                            <p className="font-medium text-[#292929]">Pedido #{order.id.slice(-8)}</p>
                            <p className="text-sm text-[#AAAAAA]">{formatDate(order.createdAt)}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(order.status)}
                              <span className="text-sm text-[#292929]">{getStatusText(order.status)}</span>
                            </div>
                            <p className="font-bold text-[#292929]">{formatCurrency(order.total)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#AAAAAA]">Você ainda não tem pedidos.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div>
              <h2 className="text-xl font-bold text-[#292929] mb-6">Histórico de Pedidos</h2>
              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.filter(o => o.status !== 'cancelado' && o.status !== 'cancelled').map((order) => (
                    <div key={order.id} style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E5E5', padding: 20, marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                        <div>
                          <p style={{ fontWeight: 700, color: '#292929', fontSize: 15, marginBottom: 4 }}>
                            Pedido #{order.id.slice(-8).toUpperCase()}
                          </p>
                          <p style={{ fontSize: 13, color: '#888' }}>{formatDate(order.createdAt)}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            {getStatusIcon(order.status)}
                            <span style={{ fontSize: 13, color: '#292929' }}>{getStatusText(order.status)}</span>
                          </div>
                          <p style={{ fontWeight: 700, color: '#292929', fontSize: 16 }}>{formatCurrency(order.total)}</p>
                        </div>
                      </div>

                      <div style={{ borderTop: '1px solid #F0F0F0', marginTop: 16, paddingTop: 16 }}>
                        <p style={{ fontWeight: 600, color: '#292929', fontSize: 13, marginBottom: 8 }}>Itens do Pedido:</p>
                        <div>
                          {order.items.map((item: any, index: number) => (
                            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                              <span style={{ color: '#888' }}>{item.quantity}x {item.name}</span>
                              <span style={{ color: '#292929' }}>{formatCurrency(item.price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {order.trackingCode && (
                        <div style={{ borderTop: '1px solid #F0F0F0', marginTop: 12, paddingTop: 12 }}>
                          <p style={{ fontSize: 13, color: '#888' }}>Rastreio: <span style={{ color: '#DAA520', fontWeight: 600 }}>{order.trackingCode}</span></p>
                        </div>
                      )}

                      <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <a
                          href={`/acompanhar/${order.id.slice(-8).toLowerCase()}`}
                          style={{
                            padding: '8px 18px', borderRadius: 999, background: '#DAA520', color: '#fff',
                            textDecoration: 'none', fontSize: 13, fontWeight: 700
                          }}
                        >
                          Acompanhar Pedido
                        </a>
                        {(order.status === 'pending' || order.status === 'aguardando_pagamento') && (
                          <button
                            onClick={() => {
                              if (confirm('Tem certeza que deseja cancelar este pedido?')) {
                                fetch(`/api/user/orders/${order.id}/cancel`, { method: 'PUT' })
                                  .then(r => { 
                                    if (r.ok) {
                                      fetchOrders()
                                      setActiveTab('orders')
                                    }
                                  })
                              }
                            }}
                            style={{
                              padding: '8px 18px', borderRadius: 999, border: '1px solid #FFCCCC',
                              background: '#FFF0F0', color: '#CC0000', fontSize: 13, fontWeight: 600, cursor: 'pointer'
                            }}
                          >
                            Cancelar Pedido
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[#AAAAAA]">Você ainda não tem pedidos.</p>
              )}
            </div>
          )}

          {activeTab === "profile" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#292929]">Meus Dados</h2>
                <button
                  onClick={() => setEditingProfile(!editingProfile)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#DAA520] text-white rounded-lg hover:bg-[#46A520] transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  {editingProfile ? "Cancelar" : "Editar"}
                </button>
              </div>

              {editingProfile ? (
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[#292929] mb-2">Nome</label>
                    <input
                      type="text"
                      value={userData.name}
                      onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                      className="w-full bg-white border border-[#E5E5E5] rounded-lg px-4 py-3 text-[#292929]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#292929] mb-2">Email</label>
                    <input
                      type="email"
                      value={userData.email}
                      disabled
                      className="w-full bg-white border border-[#E5E5E5] rounded-lg px-4 py-3 text-[#292929] opacity-50"
                    />
                    <p className="text-xs text-[#AAAAAA] mt-1">
                      Para alterar o email, entre em contato com o suporte
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#292929] mb-2">Telefone</label>
                    <input
                      type="tel"
                      value={userData.phone}
                      onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                      className="w-full bg-white border border-[#E5E5E5] rounded-lg px-4 py-3 text-[#292929]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#292929] mb-2">CPF</label>
                    <input
                      type="text"
                      value={userData.cpf}
                      onChange={(e) => setUserData({ ...userData, cpf: formatarCPF(e.target.value) })}
                      className="w-full bg-white border border-[#E5E5E5] rounded-lg px-4 py-3 text-[#292929]"
                      placeholder="000.000.000-00"
                      maxLength={14}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#DAA520] text-white py-3 rounded-lg font-semibold hover:bg-[#46A520] transition-colors"
                  >
                    Salvar Alterações
                  </button>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-[#AAAAAA]" />
                    <div>
                      <p className="text-sm text-[#AAAAAA]">Nome</p>
                      <p className="text-[#292929]">{userData.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-[#AAAAAA]" />
                    <div>
                      <p className="text-sm text-[#AAAAAA]">Email</p>
                      <p className="text-[#292929]">{userData.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-[#AAAAAA]" />
                    <div>
                      <p className="text-sm text-[#AAAAAA]">Telefone</p>
                      <p className="text-[#292929]">{userData.phone || "Não informado"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-[#AAAAAA]" />
                    <div>
                      <p className="text-sm text-[#AAAAAA]">CPF</p>
                      <p className="text-[#292929]">{userData.cpf || "Não informado"}</p>
                    </div>
                  </div>
                </div>
              )}

              <div style={{ marginTop: 24, borderTop: '1px solid var(--border)', paddingTop: 24 }}>
                {!showPasswordForm ? (
                  <button onClick={() => setShowPasswordForm(true)}
                    style={{ background: 'transparent', border: '1px solid var(--border)', color: '#888', borderRadius: 999, padding: '10px 20px', cursor: 'pointer', fontSize: 14 }}>
                    Alterar Senha
                  </button>
                ) : (
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 16 }}>Alterar Senha</h3>
                    {passwordSuccess && <p style={{ color: '#46A520', marginBottom: 12, fontSize: 14 }}>Senha alterada com sucesso!</p>}
                    {passwordError && <p style={{ color: '#F0484A', marginBottom: 12, fontSize: 14 }}>{passwordError}</p>}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <input type="password" placeholder="Senha atual" value={passwordForm.senhaAtual}
                        onChange={e => setPasswordForm({...passwordForm, senhaAtual: e.target.value})}
                        style={{ background: 'var(--secondary)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#fff', width: '100%', boxSizing: 'border-box' as const }} />
                      <input type="password" placeholder="Nova senha" value={passwordForm.novaSenha}
                        onChange={e => setPasswordForm({...passwordForm, novaSenha: e.target.value})}
                        style={{ background: 'var(--secondary)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#fff', width: '100%', boxSizing: 'border-box' as const }} />
                      <input type="password" placeholder="Confirmar nova senha" value={passwordForm.confirmarSenha}
                        onChange={e => setPasswordForm({...passwordForm, confirmarSenha: e.target.value})}
                        style={{ background: 'var(--secondary)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#fff', width: '100%', boxSizing: 'border-box' as const }} />
                      <div style={{ display: 'flex', gap: 12 }}>
                        <button onClick={() => { setShowPasswordForm(false); setPasswordError('') }}
                          style={{ flex: 1, background: 'transparent', border: '1px solid var(--border)', color: '#888', borderRadius: 999, padding: '10px', cursor: 'pointer', fontSize: 14 }}>
                          Cancelar
                        </button>
                        <button onClick={handleAlterarSenha}
                          style={{ flex: 1, background: '#DAA520', color: '#fff', border: 'none', borderRadius: 999, padding: '10px', cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>
                          Salvar Senha
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "addresses" && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>Meus Endereços</h2>
                {!showAddressForm && (
                  <button
                    onClick={() => { setShowAddressForm(true); setEditingAddress(null) }}
                    style={{ background: '#DAA520', color: '#fff', border: 'none', borderRadius: 999, padding: '10px 20px', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}
                  >
                    + Adicionar Endereço
                  </button>
                )}
              </div>

              {/* Lista de endereços */}
              {!showAddressForm && (
                <>
                  {addresses.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '48px 0', color: '#888' }}>
                      <p>Nenhum endereço cadastrado</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      {addresses.map(addr => (
                        <div key={addr.id} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, position: 'relative' }}>
                          {addr.isDefault && (
                            <span style={{ position: 'absolute', top: 12, right: 12, background: '#DAA520', color: '#fff', fontSize: 11, padding: '2px 8px', borderRadius: 999, fontWeight: 600 }}>
                              Padrão
                            </span>
                          )}
                          <p style={{ fontWeight: 600, color: '#fff', marginBottom: 4 }}>{addr.label}</p>
                          <p style={{ color: '#888', fontSize: 14 }}>{addr.street}, {addr.number} {addr.complement && `- ${addr.complement}`}</p>
                          <p style={{ color: '#888', fontSize: 14 }}>{addr.neighborhood} - {addr.city}/{addr.state}</p>
                          <p style={{ color: '#888', fontSize: 14 }}>CEP: {addr.zipCode}</p>
                          <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                            <button
                              onClick={() => {
                                setEditingAddress(addr)
                                setAddressForm({ label: addr.label, zipCode: addr.zipCode, street: addr.street, number: addr.number, complement: addr.complement || '', neighborhood: addr.neighborhood, city: addr.city, state: addr.state, isDefault: addr.isDefault })
                                setShowAddressForm(true)
                              }}
                              style={{ background: 'transparent', border: '1px solid #DAA520', color: '#DAA520', borderRadius: 8, padding: '6px 16px', cursor: 'pointer', fontSize: 13 }}
                            >
                              Editar
                            </button>
                            <button
                              onClick={async () => {
                                if (!confirm('Excluir este endereço?')) return
                                await fetch(`/api/user/address/${addr.id}`, { method: 'DELETE' })
                                setAddresses(addresses.filter(a => a.id !== addr.id))
                              }}
                              style={{ background: 'transparent', border: '1px solid #F0484A', color: '#F0484A', borderRadius: 8, padding: '6px 16px', cursor: 'pointer', fontSize: 13 }}
                            >
                              Excluir
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Formulário de endereço */}
              {showAddressForm && (
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 600, color: '#fff', marginBottom: 20 }}>
                    {editingAddress ? 'Editar Endereço' : 'Novo Endereço'}
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                      <label style={{ fontSize: 13, color: '#888', display: 'block', marginBottom: 6 }}>Identificação</label>
                      <select value={addressForm.label} onChange={e => setAddressForm({...addressForm, label: e.target.value})}
                        style={{ width: '100%', background: 'var(--secondary)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#fff' }}>
                        <option value="Casa">Casa</option>
                        <option value="Trabalho">Trabalho</option>
                        <option value="Outro">Outro</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: 13, color: '#888', display: 'block', marginBottom: 6 }}>CEP *</label>
                      <input
                        value={addressForm.zipCode}
                        onChange={e => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 8)
                          const formatted = val.length > 5 ? `${val.slice(0,5)}-${val.slice(5)}` : val
                          setAddressForm({...addressForm, zipCode: formatted})
                          if (val.length === 8) buscarCep(val)
                        }}
                        placeholder="00000-000"
                        maxLength={9}
                        style={{ width: '100%', background: 'var(--secondary)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#fff', boxSizing: 'border-box' as const }}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12 }}>
                      <div>
                        <label style={{ fontSize: 13, color: '#888', display: 'block', marginBottom: 6 }}>Rua *</label>
                        <input value={addressForm.street} onChange={e => setAddressForm({...addressForm, street: e.target.value})}
                          style={{ width: '100%', background: 'var(--secondary)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#fff', boxSizing: 'border-box' as const }} />
                      </div>
                      <div>
                        <label style={{ fontSize: 13, color: '#888', display: 'block', marginBottom: 6 }}>Número *</label>
                        <input value={addressForm.number} onChange={e => setAddressForm({...addressForm, number: e.target.value})}
                          style={{ width: 100, background: 'var(--secondary)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#fff' }} />
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: 13, color: '#888', display: 'block', marginBottom: 6 }}>Complemento</label>
                      <input value={addressForm.complement} onChange={e => setAddressForm({...addressForm, complement: e.target.value})}
                        placeholder="Apto, bloco, etc."
                        style={{ width: '100%', background: 'var(--secondary)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#fff', boxSizing: 'border-box' as const }} />
                    </div>
                    <div>
                      <label style={{ fontSize: 13, color: '#888', display: 'block', marginBottom: 6 }}>Bairro *</label>
                      <input value={addressForm.neighborhood} onChange={e => setAddressForm({...addressForm, neighborhood: e.target.value})}
                        style={{ width: '100%', background: 'var(--secondary)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#fff', boxSizing: 'border-box' as const }} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12 }}>
                      <div>
                        <label style={{ fontSize: 13, color: '#888', display: 'block', marginBottom: 6 }}>Cidade *</label>
                        <input value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})}
                          style={{ width: '100%', background: 'var(--secondary)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#fff', boxSizing: 'border-box' as const }} />
                      </div>
                      <div>
                        <label style={{ fontSize: 13, color: '#888', display: 'block', marginBottom: 6 }}>UF *</label>
                        <input value={addressForm.state} onChange={e => setAddressForm({...addressForm, state: e.target.value})} maxLength={2}
                          style={{ width: 70, background: 'var(--secondary)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#fff' }} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <input type="checkbox" id="isDefault" checked={addressForm.isDefault}
                        onChange={e => setAddressForm({...addressForm, isDefault: e.target.checked})}
                        style={{ width: 16, height: 16, accentColor: '#DAA520' }} />
                      <label htmlFor="isDefault" style={{ fontSize: 14, color: '#888', cursor: 'pointer' }}>Definir como endereço padrão</label>
                    </div>
                    <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                      <button onClick={() => { setShowAddressForm(false); setEditingAddress(null) }}
                        style={{ flex: 1, background: 'transparent', border: '1px solid var(--border)', color: '#888', borderRadius: 999, padding: '12px', cursor: 'pointer', fontSize: 14 }}>
                        Cancelar
                      </button>
                      <button onClick={handleSalvarEndereco}
                        style={{ flex: 1, background: '#DAA520', color: '#fff', border: 'none', borderRadius: 999, padding: '12px', cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>
                        Salvar Endereço
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
