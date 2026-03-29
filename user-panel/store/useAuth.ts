import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    _id: string;
    name: string;
    email: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    _hasHydrated: boolean;
    setAuth: (user: User) => void;
    clearAuth: () => void;
}

export const useAuth = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            _hasHydrated: false,
            setAuth: (user) => set({ user, isAuthenticated: true }),
            clearAuth: () => set({ user: null, isAuthenticated: false }),
        }),
        {
            name: 'user-auth',
            onRehydrateStorage: () => (state) => {
                if (state) state._hasHydrated = true;
            },
        }
    )
);
