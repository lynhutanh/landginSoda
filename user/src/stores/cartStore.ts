import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  condition: number;
  images: string[];
  kocId: string;
  kocUsername: string;
  kocName: string;
  status: 'available' | 'holding' | 'sold';
  description?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  clearCartByKoc: (kocId: string) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          // Vì đồ pass độc bản, nếu sản phẩm đã có trong giỏ thì giữ nguyên
          const exists = state.items.some((i) => i._id === item._id);
          if (exists) return state;
          return { items: [...state.items, item] };
        }),
      removeItem: (itemId) =>
        set((state) => ({
          items: state.items.filter((i) => i._id !== itemId)
        })),
      clearCart: () => set({ items: [] }),
      clearCartByKoc: (kocId) =>
        set((state) => ({
          items: state.items.filter((i) => i.kocId !== kocId)
        }))
    }),
    {
      name: 'koc-passdo-cart'
    }
  )
);
