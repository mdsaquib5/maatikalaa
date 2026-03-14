'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { SellerProvider } from '@/app/store/SellerStore';
import { useState } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000,
                retry: 1,
            },
        },
    }));

    return (
        <QueryClientProvider client={queryClient}>
            <SellerProvider>
                {children}
                <Toaster
                    position="bottom-right"
                    toastOptions={{
                        style: {
                            background: '#1a1a1a',
                            color: '#fff',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            fontSize: '14px',
                        },
                        success: {
                            iconTheme: {
                                primary: '#f9d3ad',
                                secondary: '#1a1a1a',
                            },
                        },
                    }}
                />
            </SellerProvider>
        </QueryClientProvider>
    );
}
