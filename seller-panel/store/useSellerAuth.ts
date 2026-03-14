import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Seller {
    _id: string;
    name: string;
    email: string;
    phone?: string;
}

interface SellerAuthState {
    seller: Seller | null;
    isAuthenticated: boolean;
    setAuth: (seller: Seller) => void;
    clearAuth: () => void;
}

export const useSellerAuth = create<SellerAuthState>()(
    persist(
        (set) => ({
            seller: null,
            isAuthenticated: false,
            setAuth: (seller) => set({ seller, isAuthenticated: true }),
            clearAuth: () => set({ seller: null, isAuthenticated: false }),
        }),
        {
            name: 'seller-storage',
        }
    )
);
