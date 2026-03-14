'use client';

import { useState, ReactNode, useEffect } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useSellerAuth } from '@/store/useSellerAuth';
import { useRouter } from 'next/navigation';

interface DashboardLayoutProps {
    children: ReactNode;
    pageTitle: string;
    pageCrumb?: string;
}

export default function DashboardLayout({ children, pageTitle, pageCrumb }: DashboardLayoutProps) {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { isAuthenticated } = useSellerAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace('/login');
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) return null;

    return (
        <div className="dashboard">
            <Sidebar
                collapsed={collapsed}
                mobileOpen={mobileOpen}
                onCollapse={() => setCollapsed(c => !c)}
                onMobileClose={() => setMobileOpen(false)}
            />
            <div className={`main-content ${collapsed ? 'main-content--collapsed' : ''}`}>
                <Topbar
                    collapsed={collapsed}
                    onMenuClick={() => setMobileOpen(m => !m)}
                    pageTitle={pageTitle}
                    pageCrumb={pageCrumb}
                />
                <main className="main-content__inner page-enter">
                    {children}
                </main>
            </div>
        </div>
    );
}
