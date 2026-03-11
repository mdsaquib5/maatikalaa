'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useSellerStore } from '../../store/SellerStore';

interface AuthGuardProps {
    children: ReactNode;
    requireAuth?: boolean;
}

export default function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
    const { isAuthenticated } = useSellerStore();
    const router = useRouter();

    useEffect(() => {
        if (requireAuth && !isAuthenticated) {
            router.replace('/login');
        } else if (!requireAuth && isAuthenticated) {
            router.replace('/overview');
        }
    }, [isAuthenticated, requireAuth, router]);

    if (requireAuth && !isAuthenticated) {
        return (
            <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-primary)' }}>
                <div className="spinner spinner--light" style={{ width: 36, height: 36 }} />
            </div>
        );
    }

    return <>{children}</>;
}
