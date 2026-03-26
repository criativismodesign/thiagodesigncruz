"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/store/cart-store";
import {
  ShoppingCart,
  User,
  Menu,
  X,
  Search,
  Palette,
  ChevronDown,
} from "lucide-react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { data: session } = useSession();
  const itemCount = useCartStore((state) => state.getItemCount());

  return (
    <header className="glass-effect sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--accent)]">
              <Palette className="h-6 w-6 text-white" />
            </div>
            <span className="text-lg font-bold gradient-text hidden sm:block">
              Thiago Design Cruz
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/produtos"
              className="text-sm font-medium text-[var(--muted-foreground)] hover:text-white transition-colors"
            >
              Produtos
            </Link>
            <div className="group relative">
              <button className="flex items-center gap-1 text-sm font-medium text-[var(--muted-foreground)] hover:text-white transition-colors">
                Categorias
                <ChevronDown className="h-4 w-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 rounded-lg bg-[var(--card)] border border-[var(--border)] shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <Link
                  href="/produtos?categoria=camisetas"
                  className="block px-4 py-2.5 text-sm text-[var(--muted-foreground)] hover:text-white hover:bg-[var(--secondary)] first:rounded-t-lg transition-colors"
                >
                  Camisetas
                </Link>
                <Link
                  href="/produtos?categoria=mousepads"
                  className="block px-4 py-2.5 text-sm text-[var(--muted-foreground)] hover:text-white hover:bg-[var(--secondary)] last:rounded-b-lg transition-colors"
                >
                  Mouse Pads
                </Link>
              </div>
            </div>
            <Link
              href="/criar-design"
              className="text-sm font-medium text-[var(--accent)] hover:text-white transition-colors"
            >
              Crie Sua Arte
            </Link>
            <Link
              href="/sobre"
              className="text-sm font-medium text-[var(--muted-foreground)] hover:text-white transition-colors"
            >
              Sobre
            </Link>
            <Link
              href="/contato"
              className="text-sm font-medium text-[var(--muted-foreground)] hover:text-white transition-colors"
            >
              Contato
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="rounded-lg p-2 text-[var(--muted-foreground)] hover:text-white hover:bg-[var(--secondary)] transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>

            <Link
              href="/carrinho"
              className="relative rounded-lg p-2 text-[var(--muted-foreground)] hover:text-white hover:bg-[var(--secondary)] transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--primary)] text-[10px] font-bold text-white">
                  {itemCount}
                </span>
              )}
            </Link>

            {session ? (
              <Link
                href="/minha-conta"
                className="rounded-lg p-2 text-[var(--muted-foreground)] hover:text-white hover:bg-[var(--secondary)] transition-colors"
              >
                <User className="h-5 w-5" />
              </Link>
            ) : (
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--primary)]/80 transition-colors"
              >
                Entrar
              </Link>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-[var(--muted-foreground)] hover:text-white md:hidden"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="pb-4 animate-fade-in">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
              <input
                type="text"
                placeholder="Buscar produtos..."
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--secondary)] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-[var(--border)] pb-4 md:hidden animate-fade-in">
            <nav className="flex flex-col gap-1 pt-4">
              <Link
                href="/produtos"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-4 py-2.5 text-sm text-[var(--muted-foreground)] hover:text-white hover:bg-[var(--secondary)]"
              >
                Produtos
              </Link>
              <Link
                href="/produtos?categoria=camisetas"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-4 py-2.5 text-sm text-[var(--muted-foreground)] hover:text-white hover:bg-[var(--secondary)]"
              >
                Camisetas
              </Link>
              <Link
                href="/produtos?categoria=mousepads"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-4 py-2.5 text-sm text-[var(--muted-foreground)] hover:text-white hover:bg-[var(--secondary)]"
              >
                Mouse Pads
              </Link>
              <Link
                href="/criar-design"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-4 py-2.5 text-sm font-medium text-[var(--accent)] hover:bg-[var(--secondary)]"
              >
                Crie Sua Arte
              </Link>
              <Link
                href="/sobre"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-4 py-2.5 text-sm text-[var(--muted-foreground)] hover:text-white hover:bg-[var(--secondary)]"
              >
                Sobre
              </Link>
              <Link
                href="/contato"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-4 py-2.5 text-sm text-[var(--muted-foreground)] hover:text-white hover:bg-[var(--secondary)]"
              >
                Contato
              </Link>
              {!session && (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-2 rounded-lg bg-[var(--primary)] px-4 py-2.5 text-center text-sm font-medium text-white"
                >
                  Entrar
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
