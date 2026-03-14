import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    size?: string;
    sellerId: string;
}

interface CartState {
    items: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string, size?: string) => void;
    updateQuantity: (id: string, quantity: number, size?: string) => void;
    clearCart: () => void;
    totalAmount: () => number;
}

export const useCart = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            addToCart: (item) => {
                const existing = get().items.find(i => i.id === item.id && i.size === item.size);
                if (existing) {
                    set({
                        items: get().items.map(i => 
                            (i.id === item.id && i.size === item.size) 
                                ? { ...i, quantity: i.quantity + item.quantity } 
                                : i
                        )
                    });
                } else {
                    set({ items: [...get().items, item] });
                }
            },
            removeFromCart: (id, size) => set({
                items: get().items.filter(i => !(i.id === id && i.size === size))
            }),
            updateQuantity: (id, quantity, size) => set({
                items: get().items.map(i =>
                    (i.id === id && i.size === size) ? { ...i, quantity } : i
                )
            }),
            clearCart: () => set({ items: [] }),
            totalAmount: () => get().items.reduce((acc, i) => acc + (i.price * i.quantity), 0),
        }),
        {
            name: 'maatikala-cart',
        }
    )
);
