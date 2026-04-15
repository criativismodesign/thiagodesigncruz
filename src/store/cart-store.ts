import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItem {
  id: string
  name: string
  price: number
  image?: string
  type: 'camiseta' | 'mousepad'
  size?: string
  color?: string
  quantity: number
  slug?: string
}

interface FreteInfo {
  nome: string
  preco: number
  prazo: string
}

interface CartStore {
  items: CartItem[]
  freteInfo: FreteInfo | null
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
  setFreteInfo: (info: FreteInfo | null) => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      freteInfo: null,
      
      addItem: (item) => {
        const existingItem = get().items.find((i) => i.id === item.id)
        if (existingItem) {
          set((state) => ({
            items: state.items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          }))
        } else {
          set((state) => ({ items: [...state.items, { ...item, quantity: 1 }] }))
        }
      },
      
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),
      
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i
          ),
        })),
      
      clearCart: () => set({ items: [], freteInfo: null }),
      
      getTotal: () => {
        const items = get().items
        return items.reduce((total, item) => total + item.price * item.quantity, 0)
      },
      
      getItemCount: () => {
        const items = get().items
        return items.reduce((total, item) => total + item.quantity, 0)
      },
      
      setFreteInfo: (info) => set({ freteInfo: info }),
    }),
    {
      name: 'cart-storage',
    }
  )
)
