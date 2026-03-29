'use client';

import { useAuth } from '@/store/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, _hasHydrated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Only redirect if hydration is complete and user is not authenticated
        if (_hasHydrated && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, _hasHydrated, router]);

    // Show nothing or a loader until hydrated
    if (!_hasHydrated) return (
        <div className="full-page-center">
            <div className="spinner mb-24" />
            <p className="text-body font-500">Checking your artisan access...</p>
        </div>
    );

    if (!isAuthenticated) return null;

    return <>{children}</>;
}
