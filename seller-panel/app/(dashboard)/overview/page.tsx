'use client';

import { useSellerAuth } from '@/store/useSellerAuth';
import api from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../components/layout/DashboardLayout';
import {
    MdInventory, MdShoppingBag, MdAttachMoney, MdTrendingUp,
    MdTrendingDown, MdShoppingCart, MdImage
} from 'react-icons/md';
import { Product, Order } from '../../store/SellerStore';

function getStatusBadge(status: string) {
    const map: Record<string, { cls: string; label: string }> = {
        'PENDING': { cls: 'badge--warning', label: 'Pending' },
        'PAID': { cls: 'badge--success', label: 'Paid' },
        'FAILED': { cls: 'badge--error', label: 'Failed' },
    };
    const d = map[status] ?? { cls: 'badge--neutral', label: status };
    return <span className={`badge ${d.cls}`}>{d.label}</span>;
}

export default function OverviewPage() {
    const { seller, isAuthenticated } = useSellerAuth();
    const router = useRouter();

    const { data: productsData, isLoading: productsLoading } = useQuery({
        queryKey: ['seller-products'],
        queryFn: async () => {
            const res = await api.get('/products/seller-products');
            return res.data;
        },
        enabled: isAuthenticated,
    });

    const { data: ordersData, isLoading: ordersLoading } = useQuery({
        queryKey: ['seller-orders'],
        queryFn: async () => {
            const res = await api.get('/orders/seller-orders');
            return res.data;
        },
        enabled: isAuthenticated,
    });

    if (!isAuthenticated) return null;

    const products: Product[] = productsData?.products || [];
    const orders: Order[] = ordersData?.orders || [];

    const totalRevenue = orders
        .filter(o => o.paymentStatus === 'PAID')
        .reduce((sum, o) => sum + o.sellerTotalAmount, 0);
    
    const newOrders = orders.filter(o => o.paymentStatus === 'PAID').length;
    const recentOrders = [...orders].slice(0, 5);

    const fmt = (n: any) => {
        if (n === null || n === undefined) return '₹0';
        return `₹${Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
    };

    const initials = seller?.name
        ? seller.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : 'S';

    const isLoading = productsLoading || ordersLoading;

    return (
        <DashboardLayout pageTitle="Overview" pageCrumb="Dashboard • Overview">
            {/* Seller Profile Card */}
            <div className="seller-profile-card">
                <div className="seller-profile-card__avatar">
                    {initials}
                </div>
                <div className="seller-profile-card__info">
                    <h2 className="seller-profile-card__name">{seller?.name ?? 'Seller'}</h2>
                    <p className="seller-profile-card__email">{seller?.email}</p>
                    <span className="seller-profile-card__id">
                        # {seller?._id}
                    </span>
                </div>
            </div>

            {/* Stats */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-card__icon"><MdInventory /></div>
                    <div className="stat-card__body">
                        <p className="stat-card__label">Total Products</p>
                        <p className="stat-card__value">{isLoading ? '...' : products.length}</p>
                        <p className="stat-card__change stat-card__change--up">
                            <MdTrendingUp size={12} /> Active listings
                        </p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-card__icon"><MdShoppingBag /></div>
                    <div className="stat-card__body">
                        <p className="stat-card__label">Total Orders</p>
                        <p className="stat-card__value">{isLoading ? '...' : orders.length}</p>
                        <p className="stat-card__change stat-card__change--up">
                            <MdTrendingUp size={12} /> {newOrders} paid
                        </p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-card__icon"><MdAttachMoney /></div>
                    <div className="stat-card__body">
                        <p className="stat-card__label">Total Revenue</p>
                        <p className="stat-card__value">{isLoading ? '...' : fmt(totalRevenue)}</p>
                        <p className="stat-card__change stat-card__change--up">
                            <MdTrendingUp size={12} /> Confirmed sales
                        </p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-card__icon"><MdShoppingCart /></div>
                    <div className="stat-card__body">
                        <p className="stat-card__label">Pending</p>
                        <p className="stat-card__value">{isLoading ? '...' : orders.filter(o => o.paymentStatus === 'PENDING').length}</p>
                        <p className="stat-card__change stat-card__change--down">
                            <MdTrendingDown size={12} /> Unpaid/COD
                        </p>
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="card">
                <div className="card__header">
                    <h2 className="card__title">Recent Orders</h2>
                    <button className="btn btn--secondary btn--sm" onClick={() => router.push('/orders')}>
                        View All
                    </button>
                </div>
                <div className="card__body" style={{ padding: '16px' }}>
                    {isLoading ? (
                        <div style={{ padding: '40px', textAlign: 'center', opacity: 0.5 }}>Loading orders...</div>
                    ) : recentOrders.length === 0 ? (
                        <div className="empty-state" style={{ padding: '40px' }}>
                            <div className="empty-state__icon"><MdShoppingBag /></div>
                            <p className="empty-state__title">No orders yet</p>
                            <p className="empty-state__text">Add products to start receiving orders.</p>
                        </div>
                    ) : (
                        <div className="recent-orders-mini">
                            {recentOrders.map(order => (
                                <div key={order._id} className="recent-order-item">
                                    <div className="recent-order-item__img">
                                        {order.items[0]?.productId?.images?.[0]?.url ? (
                                            <img src={order.items[0].productId.images[0].url} alt={order.items[0].productId.productName} />
                                        ) : (
                                            <MdImage size={18} style={{ color: 'var(--color-text-muted)', opacity: 0.4 }} />
                                        )}
                                    </div>
                                    <div className="recent-order-item__meta">
                                        <p className="recent-order-item__id">#{order._id.slice(-6).toUpperCase()}</p>
                                        <p className="recent-order-item__name">{order.items[0]?.productId?.productName} {order.items.length > 1 ? `+${order.items.length - 1} more` : ''}</p>
                                        <p className="recent-order-item__date">
                                            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </p>
                                    </div>
                                    <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                                        {getStatusBadge(order.paymentStatus)}
                                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-accent-primary)' }}>
                                            {fmt(order.sellerTotalAmount)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
