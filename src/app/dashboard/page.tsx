"use client";

import { useState } from "react";
import {
  BarChart3,
  Eye,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Download,
  Users,
  Package,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

const mockData = {
  summary: {
    revenue: 15680.0,
    revenueChange: 12.5,
    orders: 47,
    ordersChange: 8.3,
    pageViews: 3420,
    pageViewsChange: 15.2,
    conversionRate: 3.8,
    conversionChange: -0.5,
  },
  topProducts: [
    { name: "Camiseta Nebulosa Cósmica", views: 456, sales: 23, revenue: 2067.7 },
    { name: "Mouse Pad Aurora Boreal", views: 389, sales: 31, revenue: 1856.9 },
    { name: "Camiseta Dragão Oriental", views: 312, sales: 18, revenue: 1798.2 },
    { name: "Camiseta Samurai Cyber", views: 287, sales: 15, revenue: 1648.5 },
    { name: "Mouse Pad Galáxia Neon", views: 265, sales: 22, revenue: 1537.8 },
  ],
  recentOrders: [
    { id: "#1047", customer: "Lucas M.", total: 189.8, status: "entregue", date: "2024-01-15" },
    { id: "#1046", customer: "Ana P.", total: 119.8, status: "enviado", date: "2024-01-14" },
    { id: "#1045", customer: "Rafael S.", total: 249.7, status: "processando", date: "2024-01-14" },
    { id: "#1044", customer: "Maria L.", total: 89.9, status: "entregue", date: "2024-01-13" },
    { id: "#1043", customer: "Pedro A.", total: 179.8, status: "cancelado", date: "2024-01-12" },
  ],
};

const statusColors: Record<string, string> = {
  entregue: "text-[var(--success)] bg-[var(--success)]/10",
  enviado: "text-blue-400 bg-blue-400/10",
  processando: "text-yellow-400 bg-yellow-400/10",
  cancelado: "text-red-400 bg-red-400/10",
};

export default function DashboardPage() {
  const [period, setPeriod] = useState("30d");

  const exportToExcel = () => {
    const headers = ["Produto", "Visualizações", "Vendas", "Receita"];
    const rows = mockData.topProducts.map((p) => [
      p.name,
      p.views.toString(),
      p.sales.toString(),
      p.revenue.toFixed(2),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `analytics-${period}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-[var(--accent)]" />
            Dashboard
          </h1>
          <p className="mt-1 text-[var(--muted-foreground)]">
            Visão geral das métricas do seu e-commerce
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="rounded-lg border border-[var(--border)] bg-[var(--secondary)] px-3 py-2 text-sm text-white focus:outline-none"
          >
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="90d">Últimos 90 dias</option>
            <option value="365d">Último ano</option>
          </select>
          <button
            onClick={exportToExcel}
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--secondary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--border)] transition-colors"
          >
            <Download className="h-4 w-4" />
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="rounded-xl bg-[var(--primary)]/10 p-2.5">
              <DollarSign className="h-5 w-5 text-[var(--primary)]" />
            </div>
            <span
              className={`inline-flex items-center gap-0.5 text-xs font-medium ${
                mockData.summary.revenueChange >= 0
                  ? "text-[var(--success)]"
                  : "text-red-400"
              }`}
            >
              {mockData.summary.revenueChange >= 0 ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              {Math.abs(mockData.summary.revenueChange)}%
            </span>
          </div>
          <p className="text-2xl font-bold text-white">
            {formatCurrency(mockData.summary.revenue)}
          </p>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">
            Receita total
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="rounded-xl bg-[var(--accent)]/10 p-2.5">
              <Package className="h-5 w-5 text-[var(--accent)]" />
            </div>
            <span
              className={`inline-flex items-center gap-0.5 text-xs font-medium ${
                mockData.summary.ordersChange >= 0
                  ? "text-[var(--success)]"
                  : "text-red-400"
              }`}
            >
              {mockData.summary.ordersChange >= 0 ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              {Math.abs(mockData.summary.ordersChange)}%
            </span>
          </div>
          <p className="text-2xl font-bold text-white">
            {mockData.summary.orders}
          </p>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">
            Pedidos
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="rounded-xl bg-blue-500/10 p-2.5">
              <Eye className="h-5 w-5 text-blue-400" />
            </div>
            <span className="inline-flex items-center gap-0.5 text-xs font-medium text-[var(--success)]">
              <ArrowUpRight className="h-3 w-3" />
              {mockData.summary.pageViewsChange}%
            </span>
          </div>
          <p className="text-2xl font-bold text-white">
            {mockData.summary.pageViews.toLocaleString("pt-BR")}
          </p>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">
            Visualizações
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="rounded-xl bg-yellow-500/10 p-2.5">
              <TrendingUp className="h-5 w-5 text-yellow-400" />
            </div>
            <span
              className={`inline-flex items-center gap-0.5 text-xs font-medium ${
                mockData.summary.conversionChange >= 0
                  ? "text-[var(--success)]"
                  : "text-red-400"
              }`}
            >
              {mockData.summary.conversionChange >= 0 ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              {Math.abs(mockData.summary.conversionChange)}%
            </span>
          </div>
          <p className="text-2xl font-bold text-white">
            {mockData.summary.conversionRate}%
          </p>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">
            Taxa de conversão
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Products */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-[var(--accent)]" />
            Produtos Mais Vendidos
          </h2>
          <div className="space-y-3">
            {mockData.topProducts.map((product, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-xl bg-[var(--secondary)] p-3"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-xs font-bold text-[var(--primary)]">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {product.name}
                    </p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {product.views} views • {product.sales} vendas
                    </p>
                  </div>
                </div>
                <span className="text-sm font-bold text-white">
                  {formatCurrency(product.revenue)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-[var(--accent)]" />
            Pedidos Recentes
          </h2>
          <div className="space-y-3">
            {mockData.recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between rounded-xl bg-[var(--secondary)] p-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono text-[var(--muted-foreground)]">
                    {order.id}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {order.customer}
                    </p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {new Date(order.date).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">
                    {formatCurrency(order.total)}
                  </p>
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      statusColors[order.status]
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cart Abandonment Alert */}
      <div className="mt-6 rounded-2xl border border-yellow-500/30 bg-yellow-500/5 p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-yellow-400">
              Abandono de Carrinho
            </h3>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              12 carrinhos foram abandonados nos últimos 7 dias (valor estimado:{" "}
              {formatCurrency(1890.5)}). Considere enviar emails de recuperação
              para aumentar as conversões.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
