'use client';

import { MdMenu, MdNotifications, MdSearch } from 'react-icons/md';
import { useSellerAuth } from '@/store/useSellerAuth';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

interface TopbarProps {
    collapsed: boolean;
    onMenuClick: () => void;
    pageTitle: string;
    pageCrumb?: string;
}

export default function Topbar({ collapsed, onMenuClick, pageTitle, pageCrumb }: TopbarProps) {
    const { seller } = useSellerAuth();
    
    const { data: ordersData } = useQuery({
        queryKey: ['seller-orders'],
        queryFn: async () => {
            const res = await api.get('/orders/seller-orders');
            return res.data;
        }
    });

    const initials = seller?.name
        ? seller.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
        : 'S';

    const orders = ordersData?.orders || [];
    const newOrderCount = orders.filter((o: any) => o.orderStatus === 'PENDING').length;

    return (
        <header className={`topbar ${collapsed ? 'topbar--collapsed' : ''}`}>
            <div className="topbar__left">
                <button className="topbar__menu-btn" onClick={onMenuClick} id="topbar-menu-btn">
                    <MdMenu />
                </button>
                <div>
                    <h1 className="topbar__page-title">{pageTitle}</h1>
                    {pageCrumb && <p className="topbar__page-crumb">{pageCrumb}</p>}
                </div>
            </div>

            <div className="topbar__right">
                <button className="topbar__icon-btn" title="Search" id="topbar-search-btn">
                    <MdSearch />
                </button>
                <button className="topbar__icon-btn" title="Notifications" id="topbar-notif-btn">
                    <MdNotifications />
                    {newOrderCount > 0 && (
                        <span className="topbar__badge">{newOrderCount}</span>
                    )}
                </button>
                <div className="topbar__seller-chip">
                    <div className="topbar__seller-avatar">
                        {initials}
                    </div>
                    <span className="topbar__seller-name">{seller?.name ?? 'Seller'}</span>
                </div>
            </div>
        </header>
    );
}
