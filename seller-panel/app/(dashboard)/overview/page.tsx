'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useSellerStore } from '../../store/SellerStore';
import {
    MdInventory, MdShoppingBag, MdAttachMoney, MdTrendingUp,
    MdTrendingDown, MdShoppingCart, MdImage
} from 'react-icons/md';

function getStatusBadge(status: string) {
    const map: Record<string, { cls: string; label: string }> = {
        placed: { cls: 'badge--info', label: 'Placed' },
        packing: { cls: 'badge--warning', label: 'Packing' },
        shipped: { cls: 'badge--accent', label: 'Shipped' },
        out_for_delivery: { cls: 'badge--warning', label: 'Out for Delivery' },
        delivered: { cls: 'badge--success', label: 'Delivered' },
    };
    const d = map[status] ?? { cls: 'badge--neutral', label: status };
    return <span className={`badge ${d.cls}`}>{d.label}</span>;
}

export default function OverviewPage() {
    const { seller, isAuthenticated, products, orders } = useSellerStore();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) router.replace('/login');
    }, [isAuthenticated, router]);

    if (!isAuthenticated) return null;

    const totalRevenue = orders
        .filter(o => o.payment.status === 'paid')
        .reduce((sum, o) => sum + o.payment.amount, 0);
    const newOrders = orders.filter(o => o.status === 'placed').length;
    const recentOrders = [...orders].sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()).slice(0, 5);

    const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`;

    const initials = seller?.name
        ? seller.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : 'S';

    return (
        <DashboardLayout pageTitle="Overview" pageCrumb="Dashboard • Overview">
            {/* Seller Profile Card */}
            <div className="seller-profile-card">
                <div className="seller-profile-card__avatar">
                    {seller?.avatar ? <img src={seller.avatar} alt={seller.name} /> : initials}
                </div>
                <div className="seller-profile-card__info">
                    <h2 className="seller-profile-card__name">{seller?.name ?? 'Seller'}</h2>
                    <p className="seller-profile-card__email">{seller?.email}</p>
                    <span className="seller-profile-card__id">
                        # {seller?.id}
                    </span>
                </div>
            </div>

            {/* Stats */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-card__icon"><MdInventory /></div>
                    <div className="stat-card__body">
                        <p className="stat-card__label">Total Products</p>
                        <p className="stat-card__value">{products.length}</p>
                        <p className="stat-card__change stat-card__change--up">
                            <MdTrendingUp size={12} /> Active listings
                        </p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-card__icon"><MdShoppingBag /></div>
                    <div className="stat-card__body">
                        <p className="stat-card__label">Total Orders</p>
                        <p className="stat-card__value">{orders.length}</p>
                        <p className="stat-card__change stat-card__change--up">
                            <MdTrendingUp size={12} /> {newOrders} new
                        </p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-card__icon"><MdAttachMoney /></div>
                    <div className="stat-card__body">
                        <p className="stat-card__label">Total Revenue</p>
                        <p className="stat-card__value">{fmt(totalRevenue)}</p>
                        <p className="stat-card__change stat-card__change--up">
                            <MdTrendingUp size={12} /> Paid orders
                        </p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-card__icon"><MdShoppingCart /></div>
                    <div className="stat-card__body">
                        <p className="stat-card__label">Pending</p>
                        <p className="stat-card__value">{newOrders}</p>
                        <p className="stat-card__change stat-card__change--down">
                            <MdTrendingDown size={12} /> Need action
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
                    {recentOrders.length === 0 ? (
                        <div className="empty-state" style={{ padding: '40px' }}>
                            <div className="empty-state__icon"><MdShoppingBag /></div>
                            <p className="empty-state__title">No orders yet</p>
                            <p className="empty-state__text">Add products to start receiving orders.</p>
                        </div>
                    ) : (
                        <div className="recent-orders-mini">
                            {recentOrders.map(order => (
                                <div key={order.id} className="recent-order-item">
                                    <div className="recent-order-item__img">
                                        {order.productImage ? (
                                            <img src={order.productImage} alt={order.productName} />
                                        ) : (
                                            <MdImage size={18} style={{ color: 'var(--color-text-muted)', opacity: 0.4 }} />
                                        )}
                                    </div>
                                    <div className="recent-order-item__meta">
                                        <p className="recent-order-item__id">{order.id}</p>
                                        <p className="recent-order-item__name">{order.productName}</p>
                                        <p className="recent-order-item__date">
                                            {new Date(order.orderDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </p>
                                    </div>
                                    <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                                        {getStatusBadge(order.status)}
                                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-accent-primary)' }}>
                                            ₹{order.payment.amount.toLocaleString('en-IN')}
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
