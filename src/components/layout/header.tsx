"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/store/cart-store";
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const [collectionsDropdownOpen, setCollectionsDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { data: session } = useSession();
  const itemCount = useCartStore((state) => state.getItemCount());
  const pathname = usePathname();

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  const isActiveLink = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-white" style={{ height: "120px" }}>
      <div className="h-full flex items-center justify-between px-[120px] max-w-[1920px] mx-auto">
        
        {/* Logo - Coluna Esquerda */}
        <div className="flex-shrink-0">
          <Link href="/" className="flex items-center">
            <img 
              src="/icons/logo.svg" 
              alt="Use KIN Logo" 
              style={{ width: "205.57px", height: "74.75px" }}
            />
          </Link>
        </div>

        {/* Menu de Navegação - Coluna Centro */}
        <nav className="hidden lg:flex items-center justify-center flex-1">
          <div className="flex items-center gap-8 font-inter">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                isActiveLink("/") ? "text-[#DAA520]" : "text-[#292929] hover:text-[#D8D8D8]"
              }`}
            >
              HOME
            </Link>
            
            {/* Dropdown PRODUTOS */}
            <div 
              className="relative"
              onMouseEnter={() => setProductsDropdownOpen(true)}
              onMouseLeave={() => setProductsDropdownOpen(false)}
            >
              <button className="flex items-center gap-1 text-sm font-medium text-[#292929] hover:text-[#D8D8D8] transition-colors">
                PRODUTOS
                <ChevronDown className="h-4 w-4" />
              </button>
              
              {productsDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-[#EFEFEF] border border-[#D8D8D8] shadow-[0px_5px_5px_rgba(0,0,0,0.15)]">
                  <Link
                    href="/produtos/camisetas"
                    className="block px-4 py-3 text-sm text-[#292929] hover:text-[#DAA520] transition-colors"
                  >
                    Camisetas Oversizeds
                  </Link>
                  <Link
                    href="/produtos/mousepad"
                    className="block px-4 py-3 text-sm text-[#292929] hover:text-[#DAA520] transition-colors"
                  >
                    Mouse Pad / Desckpad
                  </Link>
                </div>
              )}
            </div>

            {/* Dropdown COLEÇÕES */}
            <div 
              className="relative"
              onMouseEnter={() => setCollectionsDropdownOpen(true)}
              onMouseLeave={() => setCollectionsDropdownOpen(false)}
            >
              <button className="flex items-center gap-1 text-sm font-medium text-[#292929] hover:text-[#D8D8D8] transition-colors">
                COLEÇÕES
                <ChevronDown className="h-4 w-4" />
              </button>
              
              {collectionsDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-[#EFEFEF] border border-[#D8D8D8] shadow-[0px_5px_5px_rgba(0,0,0,0.15)]">
                  <Link
                    href="/colecoes/my-life-my-style"
                    className="block px-4 py-3 text-sm text-[#292929] hover:text-[#DAA520] transition-colors"
                  >
                    My Life My Style
                  </Link>
                  <Link
                    href="/colecoes/immortals"
                    className="block px-4 py-3 text-sm text-[#292929] hover:text-[#DAA520] transition-colors"
                  >
                    IMMORTALS
                  </Link>
                  <Link
                    href="/colecoes/lancamento-3"
                    className="block px-4 py-3 text-sm text-[#292929] hover:text-[#DAA520] transition-colors"
                  >
                    3º Lançamento
                  </Link>
                  <Link
                    href="/colecoes/lancamento-4"
                    className="block px-4 py-3 text-sm text-[#292929] hover:text-[#DAA520] transition-colors"
                  >
                    4º Lançamento
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/sobre"
              className={`text-sm font-medium transition-colors ${
                isActiveLink("/sobre") ? "text-[#DAA520]" : "text-[#292929] hover:text-[#D8D8D8]"
              }`}
            >
              SOBRE
            </Link>
            
            <Link
              href="/contato"
              className={`text-sm font-medium transition-colors ${
                isActiveLink("/contato") ? "text-[#DAA520]" : "text-[#292929] hover:text-[#D8D8D8]"
              }`}
            >
              CONTATO
            </Link>
          </div>
        </nav>

        {/* Ícones e Botão - Coluna Direita */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {/* Ícone Busca */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2"
          >
            <img 
              src="/icons/pesquisa.svg" 
              alt="Pesquisar" 
              className="w-5 h-5"
              style={{ filter: "invert(16%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(96%) contrast(90%)" }}
            />
          </button>

          {/* Ícone Carrinho */}
          <Link href="/carrinho" className="relative p-2">
            <img 
              src="/icons/carrinho.svg" 
              alt="Carrinho" 
              className="w-5 h-5"
              style={{ filter: "invert(16%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(96%) contrast(90%)" }}
            />
            {itemCount > 0 && (
              <span 
                className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center text-[10px] font-bold text-white rounded-full"
                style={{ backgroundColor: "#F0484A" }}
              >
                {itemCount}
              </span>
            )}
          </Link>

          {/* Botão ENTRAR / Usuário Logado */}
          {session ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-4 py-2 text-white font-bold rounded transition-colors"
                style={{ backgroundColor: "#DAA520" }}
              >
                <img 
                  src="/icons/usuario.svg" 
                  alt="Usuário" 
                  className="w-4 h-4"
                />
                <span className="text-sm">
                  {session.user?.name?.split(" ")[0] || "MINHA CONTA"}
                </span>
                <ChevronDown className={`h-4 w-4 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
              </button>
              
              {userMenuOpen && (
                <div className="absolute right-0 mt-1 w-64 bg-[#EFEFEF] border border-[#D8D8D8] shadow-[0px_5px_5px_rgba(0,0,0,0.15)]">
                  {/* Header do Dropdown */}
                  <div className="border-b border-[#D8D8D8] p-4">
                    <p className="text-sm font-bold text-[#292929] truncate">
                      {session.user?.name}
                    </p>
                    <p className="text-xs text-[#AAAAAA] truncate">
                      {session.user?.email}
                    </p>
                  </div>
                  
                  {/* Itens do Dropdown */}
                  <div className="p-2">
                    <Link
                      href="/minha-conta"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 w-full px-3 py-2 text-sm text-[#292929] hover:text-[#DAA520] rounded transition-colors"
                    >
                      <img 
                        src="/icons/engrenagem.svg" 
                        alt="Configurações" 
                        className="w-4 h-4"
                      />
                      Minha Conta
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-3 py-2 text-sm text-[#292929] hover:text-[#F0484A] rounded transition-colors text-left"
                    >
                      <img 
                        src="/icons/sair.svg" 
                        alt="Sair" 
                        className="w-4 h-4"
                      />
                      Sair
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 px-5 py-2.5 text-white font-bold rounded transition-colors"
              style={{ backgroundColor: "#DAA520" }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#46A520"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#DAA520"}
            >
              <img 
                src="/icons/usuario.svg" 
                alt="Usuário" 
                className="w-4 h-4"
              />
              ENTRAR
            </Link>
          )}

          {/* Menu Hambúrguer Mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2"
          >
            <div className="w-6 h-0.5 bg-[#292929] mb-1.5"></div>
            <div className="w-6 h-0.5 bg-[#292929] mb-1.5"></div>
            <div className="w-6 h-0.5 bg-[#292929]"></div>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {searchOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-[#D8D8D8] px-[120px] py-4">
          <div className="relative max-w-[1920px] mx-auto">
            <img 
              src="/icons/pesquisa.svg" 
              alt="Pesquisar" 
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
              style={{ filter: "invert(16%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(96%) contrast(90%)" }}
            />
            <input
              type="text"
              placeholder="Buscar produtos..."
              className="w-full pl-10 pr-4 py-2 border border-[#D8D8D8] rounded text-[#292929] placeholder-[#AAAAAA] focus:outline-none focus:border-[#DAA520]"
              autoFocus
            />
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-[#D8D8D8] lg:hidden">
          <nav className="px-[120px] py-4 space-y-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`block py-2 text-sm font-medium ${
                isActiveLink("/") ? "text-[#DAA520]" : "text-[#292929]"
              }`}
            >
              HOME
            </Link>
            <Link
              href="/produtos/camisetas"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-[#292929]"
            >
              Camisetas Oversizeds
            </Link>
            <Link
              href="/produtos/mousepad"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-[#292929]"
            >
              Mouse Pad / Desckpad
            </Link>
            <Link
              href="/colecoes/my-life-my-style"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-[#292929]"
            >
              My Life My Style
            </Link>
            <Link
              href="/colecoes/immortals"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-[#292929]"
            >
              IMMORTALS
            </Link>
            <Link
              href="/colecoes/lancamento-3"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-[#292929]"
            >
              3º Lançamento
            </Link>
            <Link
              href="/colecoes/lancamento-4"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-[#292929]"
            >
              4º Lançamento
            </Link>
            <Link
              href="/sobre"
              onClick={() => setMobileMenuOpen(false)}
              className={`block py-2 text-sm font-medium ${
                isActiveLink("/sobre") ? "text-[#DAA520]" : "text-[#292929]"
              }`}
            >
              SOBRE
            </Link>
            <Link
              href="/contato"
              onClick={() => setMobileMenuOpen(false)}
              className={`block py-2 text-sm font-medium ${
                isActiveLink("/contato") ? "text-[#DAA520]" : "text-[#292929]"
              }`}
            >
              CONTATO
            </Link>
            {!session && (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-5 py-2.5 text-white font-bold rounded"
                style={{ backgroundColor: "#DAA520" }}
              >
                <img 
                  src="/icons/usuario.svg" 
                  alt="Usuário" 
                  className="w-4 h-4"
                />
                ENTRAR
              </Link>
            )}
          </nav>
        </div>
      )}

      <style jsx>{`
        .font-inter {
          font-family: 'Inter', sans-serif;
        }
      `}</style>
    </header>
  );
}
