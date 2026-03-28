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
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-white">Carregando...</div>
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
    <div className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-xl font-bold">
                {userInitials}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{userData.name}</h1>
                <p className="text-[var(--muted-foreground)]">{userData.email}</p>
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--destructive)] text-white rounded-lg hover:bg-[var(--destructive)]/90 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-[var(--border)]">
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
                  ? "border-[var(--primary)] text-white"
                  : "border-transparent text-[var(--muted-foreground)] hover:text-white"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-[var(--secondary)] rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="h-8 w-8 text-[var(--primary)]" />
                    <div>
                      <p className="text-2xl font-bold text-white">{orders.length}</p>
                      <p className="text-sm text-[var(--muted-foreground)]">Total de Pedidos</p>
                    </div>
                  </div>
                </div>
                <div className="bg-[var(--secondary)] rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-8 w-8 text-[var(--success)]" />
                    <div>
                      <p className="text-2xl font-bold text-white">
                        {orders.filter((o) => o.status === "delivered").length}
                      </p>
                      <p className="text-sm text-[var(--muted-foreground)]">Pedidos Entregues</p>
                    </div>
                  </div>
                </div>
                <div className="bg-[var(--secondary)] rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-8 w-8 text-[var(--accent)]" />
                    <div>
                      <p className="text-2xl font-bold text-white">
                        {orders.filter((o) => o.status === "pending" || o.status === "paid").length}
                      </p>
                      <p className="text-sm text-[var(--muted-foreground)]">Pedidos em Andamento</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Pedidos Recentes</h2>
                {recentOrders.length > 0 ? (
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="bg-[var(--secondary)] rounded-xl p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div>
                            <p className="font-medium text-white">Pedido #{order.id.slice(-8)}</p>
                            <p className="text-sm text-[var(--muted-foreground)]">{formatDate(order.createdAt)}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(order.status)}
                              <span className="text-sm text-white">{getStatusText(order.status)}</span>
                            </div>
                            <p className="font-bold text-white">{formatCurrency(order.total)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[var(--muted-foreground)]">Você ainda não tem pedidos.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div>
              <h2 className="text-xl font-bold text-white mb-6">Histórico de Pedidos</h2>
              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="bg-[var(--secondary)] rounded-xl p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                        <div>
                          <p className="font-medium text-white text-lg">Pedido #{order.id.slice(-8)}</p>
                          <p className="text-sm text-[var(--muted-foreground)]">{formatDate(order.createdAt)}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(order.status)}
                            <span className="text-sm text-white">{getStatusText(order.status)}</span>
                          </div>
                          <p className="font-bold text-white text-lg">{formatCurrency(order.total)}</p>
                        </div>
                      </div>
                      
                      <div className="border-t border-[var(--border)] pt-4">
                        <p className="font-medium text-white mb-2">Itens do Pedido:</p>
                        <div className="space-y-2">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span className="text-[var(--muted-foreground)]">
                                {item.quantity}x {item.name}
                              </span>
                              <span className="text-white">{formatCurrency(item.price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {order.trackingCode && (
                        <div className="border-t border-[var(--border)] pt-4 mt-4">
                          <p className="font-medium text-white mb-2">Código de Rastreamento:</p>
                          <p className="text-[var(--accent)]">{order.trackingCode}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[var(--muted-foreground)]">Você ainda não tem pedidos.</p>
              )}
            </div>
          )}

          {activeTab === "profile" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Meus Dados</h2>
                <button
                  onClick={() => setEditingProfile(!editingProfile)}
                  className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary)]/90 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  {editingProfile ? "Cancelar" : "Editar"}
                </button>
              </div>

              {editingProfile ? (
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Nome</label>
                    <input
                      type="text"
                      value={userData.name}
                      onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                      className="w-full bg-[var(--secondary)] border border-[var(--border)] rounded-lg px-4 py-3 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Email</label>
                    <input
                      type="email"
                      value={userData.email}
                      disabled
                      className="w-full bg-[var(--secondary)] border border-[var(--border)] rounded-lg px-4 py-3 text-white opacity-50"
                    />
                    <p className="text-xs text-[var(--muted-foreground)] mt-1">
                      Para alterar o email, entre em contato com o suporte
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Telefone</label>
                    <input
                      type="tel"
                      value={userData.phone}
                      onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                      className="w-full bg-[var(--secondary)] border border-[var(--border)] rounded-lg px-4 py-3 text-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[var(--primary)] text-white py-3 rounded-lg font-semibold hover:bg-[var(--primary)]/90 transition-colors"
                  >
                    Salvar Alterações
                  </button>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-[var(--muted-foreground)]" />
                    <div>
                      <p className="text-sm text-[var(--muted-foreground)]">Nome</p>
                      <p className="text-white">{userData.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-[var(--muted-foreground)]" />
                    <div>
                      <p className="text-sm text-[var(--muted-foreground)]">Email</p>
                      <p className="text-white">{userData.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-[var(--muted-foreground)]" />
                    <div>
                      <p className="text-sm text-[var(--muted-foreground)]">Telefone</p>
                      <p className="text-white">{userData.phone || "Não informado"}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "addresses" && (
            <div>
              <h2 className="text-xl font-bold text-white mb-6">Meus Endereços</h2>
              {userData.addresses?.length > 0 ? (
                <div className="space-y-4">
                  {userData.addresses.map((address) => (
                    <div key={address.id} className="bg-[var(--secondary)] rounded-xl p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-white mb-2">{address.label}</p>
                          <p className="text-[var(--muted-foreground)]">
                            {address.street}, {address.number} {address.complement && `- ${address.complement}`}
                          </p>
                          <p className="text-[var(--muted-foreground)]">
                            {address.neighborhood}, {address.city} - {address.state}
                          </p>
                          <p className="text-[var(--muted-foreground)]">CEP: {address.zipCode}</p>
                        </div>
                        <button className="text-[var(--primary)] hover:text-[var(--primary)]/80">
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MapPin className="h-12 w-12 text-[var(--muted-foreground)] mx-auto mb-4" />
                  <p className="text-[var(--muted-foreground)] mb-4">Você ainda não tem endereços cadastrados.</p>
                  <button className="bg-[var(--primary)] text-white px-6 py-2 rounded-lg hover:bg-[var(--primary)]/90 transition-colors">
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
