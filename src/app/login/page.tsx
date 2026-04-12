"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Palette, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const result = await signIn("credentials", {
          email: form.email,
          password: form.password,
          redirect: false,
        });

        if (result?.error) {
          toast.error(result.error);
        } else {
          toast.success("Login realizado com sucesso!");
          router.push("/");
          router.refresh();
        }
      } else {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        const data = await res.json();

        if (!res.ok) {
          toast.error(data.error);
        } else {
          toast.success("Conta criada! Fazendo login...");
          await signIn("credentials", {
            email: form.email,
            password: form.password,
            redirect: false,
          });
          router.push("/");
          router.refresh();
        }
      }
    } catch {
      toast.error("Erro inesperado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12 bg-white">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <img 
              src="/icons/logo.svg" 
              alt="Use KIN Logo" 
              style={{ width: "205.57px", height: "74.75px" }}
            />
          </Link>
          <h1 className="text-2xl font-bold text-[#292929]">
            {isLogin ? "Entrar na sua conta" : "Criar sua conta"}
          </h1>
          <p className="mt-2 text-sm text-[#AAAAAA]">
            {isLogin
              ? "Acesse sua conta para continuar comprando"
              : "Cadastre-se para começar a comprar"}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-[#E5E5E5] bg-white p-6 space-y-4"
        >
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-[#292929] mb-1.5">
                Nome completo
              </label>
              <input
                type="text"
                required={!isLogin}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-[#E5E5E5] bg-white px-4 py-2.5 text-sm text-[#292929] placeholder:text-[#AAAAAA] focus:border-[#DAA520] focus:outline-none focus:ring-1 focus:ring-[#DAA520]"
                placeholder="Seu nome"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#292929] mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-lg border border-[#E5E5E5] bg-white px-4 py-2.5 text-sm text-[#292929] placeholder:text-[#AAAAAA] focus:border-[#DAA520] focus:outline-none focus:ring-1 focus:ring-[#DAA520]"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#292929] mb-1.5">
              Senha
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full rounded-lg border border-[#E5E5E5] bg-white px-4 py-2.5 pr-10 text-sm text-[#292929] placeholder:text-[#AAAAAA] focus:border-[#DAA520] focus:outline-none focus:ring-1 focus:ring-[#DAA520]"
                placeholder="Mínimo 6 caracteres"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#AAAAAA] hover:text-[#292929]"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-[#292929] mb-1.5">
                Telefone (opcional)
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full rounded-lg border border-[#E5E5E5] bg-white px-4 py-2.5 text-sm text-[#292929] placeholder:text-[#AAAAAA] focus:border-[#DAA520] focus:outline-none focus:ring-1 focus:ring-[#DAA520]"
                placeholder="(XX) XXXXX-XXXX"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#DAA520] py-2.5 text-sm font-semibold text-white hover:bg-[#46A520] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isLogin ? "Entrar" : "Criar Conta"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#AAAAAA]">
          {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-medium text-[#DAA520] hover:text-[#46A520] transition-colors"
          >
            {isLogin ? "Cadastre-se" : "Faça login"}
          </button>
        </p>
      </div>
    </div>
  );
}
