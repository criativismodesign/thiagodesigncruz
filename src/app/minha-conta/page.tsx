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

interface Order {
  id: string;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
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

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      fetchUserData();
      fetchOrders();
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

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData) return;

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userData.name,
          phone: userData.phone,
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
        return "Pendente";
      case "paid":
        return "Pago";
      case "shipped":
        return "Enviado";
      case "delivered":
        return "Entregue";
      case "cancelled":
        return "Cancelado";
      default:
        return status;
    }
  };

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

  const recentOrders = orders.slice(0, 3);

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
                  {orders.map((order) => (
                    <div key={order.id} className="bg-[#F5F5F5] rounded-xl p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                        <div>
                          <p className="font-medium text-[#292929] text-lg">Pedido #{order.id.slice(-8)}</p>
                          <p className="text-sm text-[#AAAAAA]">{formatDate(order.createdAt)}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(order.status)}
                            <span className="text-sm text-[#292929]">{getStatusText(order.status)}</span>
                          </div>
                          <p className="font-bold text-[#292929] text-lg">{formatCurrency(order.total)}</p>
                        </div>
                      </div>
                      
                      <div className="border-t border-[#E5E5E5] pt-4">
                        <p className="font-medium text-[#292929] mb-2">Itens do Pedido:</p>
                        <div className="space-y-2">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span className="text-[#AAAAAA]">
                                {item.quantity}x {item.name}
                              </span>
                              <span className="text-[#292929]">{formatCurrency(item.price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {order.trackingCode && (
                        <div className="border-t border-[#E5E5E5] pt-4 mt-4">
                          <p className="font-medium text-[#292929] mb-2">Código de Rastreamento:</p>
                          <p className="text-[#DAA520]">{order.trackingCode}</p>
                        </div>
                      )}
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
                </div>
              )}
            </div>
          )}

          {activeTab === "addresses" && (
            <div>
              <h2 className="text-xl font-bold text-[#292929] mb-6">Meus Endereços</h2>
              {userData.addresses?.length > 0 ? (
                <div className="space-y-4">
                  {userData.addresses.map((address) => (
                    <div key={address.id} className="bg-[#F5F5F5] rounded-xl p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-[#292929] mb-2">{address.label}</p>
                          <p className="text-[#AAAAAA]">
                            {address.street}, {address.number} {address.complement && `- ${address.complement}`}
                          </p>
                          <p className="text-[#AAAAAA]">
                            {address.neighborhood}, {address.city} - {address.state}
                          </p>
                          <p className="text-[#AAAAAA]">CEP: {address.zipCode}</p>
                        </div>
                        <button className="text-[#DAA520] hover:text-[#46A520]">
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MapPin className="h-12 w-12 text-[#AAAAAA] mx-auto mb-4" />
                  <p className="text-[#AAAAAA] mb-4">Você ainda não tem endereços cadastrados.</p>
                  <button className="bg-[#DAA520] text-white px-6 py-2 rounded-lg hover:bg-[#46A520] transition-colors">
                    Adicionar Endereço
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
