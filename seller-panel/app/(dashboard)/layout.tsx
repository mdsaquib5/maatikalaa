import { ReactNode } from 'react';
import { SellerProvider } from '../store/SellerStore';
import { ToastProvider } from '../components/ui/Toast';

export default function DashboardRootLayout({ children }: { children: ReactNode }) {
    return (
        <SellerProvider>
            <ToastProvider>
                {children}
            </ToastProvider>
        </SellerProvider>
    );
}
