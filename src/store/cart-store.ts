import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  stockQuantity: number;
  category?: string;
  slaughterService?: boolean;
  slaughterFee?: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateSlaughterService: (id: string, slaughterService: boolean) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id && i.slaughterService === item.slaughterService);
          
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === item.id && i.slaughterService === item.slaughterService
                  ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.stockQuantity) }
                  : i
              ),
            };
          }
          
          return { items: [...state.items, item] };
        });
      },
      
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },
      
      updateQuantity: (id, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }));
      },

      updateSlaughterService: (id, slaughterService) => {
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, slaughterService } : item
          ),
        });
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      getTotal: () => {
        const state = get();
        return state.items.reduce((total, item) => {
          const itemTotal = item.price * item.quantity;
          const slaughterTotal = item.slaughterService && item.slaughterFee 
            ? item.slaughterFee * item.quantity 
            : 0;
          return total + itemTotal + slaughterTotal;
        }, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
