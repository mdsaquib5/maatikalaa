'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useSellerStore, Order, OrderStatus, PaymentStatus } from '../../store/SellerStore';
import { useToast } from '../../components/ui/Toast';
import {
    MdSearch, MdShoppingBag, MdImage, MdFilterList,
    MdCheckCircle, MdLocalShipping, MdInventory, MdRadioButtonUnchecked
} from 'react-icons/md';

/* ─────────────────────────────────────────────────────────────────────────── */

const ORDER_STATUSES: { value: OrderStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All Orders' },
    { value: 'placed', label: 'Placed' },
    { value: 'packing', label: 'Packing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'out_for_delivery', label: 'Out for Delivery' },
    { value: 'delivered', label: 'Delivered' },
];

const STATUS_FLOW: OrderStatus[] = ['placed', 'packing', 'shipped', 'out_for_delivery', 'delivered'];

function statusBadge(status: OrderStatus) {
    const map: Record<OrderStatus, { cls: string; label: string }> = {
        placed: { cls: 'badge--info', label: 'Placed' },
        packing: { cls: 'badge--warning', label: 'Packing' },
        shipped: { cls: 'badge--accent', label: 'Shipped' },
        out_for_delivery: { cls: 'badge--warning', label: 'Out for Delivery' },
        delivered: { cls: 'badge--success', label: 'Delivered' },
    };
    const d = map[status];
    return <span className={`badge ${d.cls}`}>{d.label}</span>;
}

function paymentBadge(status: PaymentStatus) {
    const map: Record<PaymentStatus, { cls: string; label: string }> = {
        paid: { cls: 'badge--success', label: 'Paid' },
        pending: { cls: 'badge--warning', label: 'Pending' },
        failed: { cls: 'badge--error', label: 'Failed' },
        refunded: { cls: 'badge--neutral', label: 'Refunded' },
    };
    const d = map[status];
    return <span className={`badge ${d.cls}`}>{d.label}</span>;
}

/* ─────────────────────────────────────────────────────────────────────────── */

function OrderDetailModal({ order, onClose, onStatusChange }: {
    order: Order;
    onClose: () => void;
    onStatusChange: (status: OrderStatus) => void;
}) {
    const currentIdx = STATUS_FLOW.indexOf(order.status);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
                <div className="modal__header">
                    <h3 className="modal__title">Order {order.id}</h3>
                    <button className="modal__close" onClick={onClose}>✕</button>
                </div>

                {/* Order Details Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                    {/* Product */}
                    <div>
                        <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Product</p>
                        <div className="order-product">
                            <div className="order-product__img">
                                {order.productImage ? (
                                    <img src={order.productImage} alt={order.productName} />
                                ) : (
                                    <div className="order-product__img-placeholder"><MdImage /></div>
                                )}
                            </div>
                            <div className="order-product__details">
                                <p className="order-product__name">{order.productName}</p>
                                <p className="order-product__meta">Size: {order.size} · Qty: {order.quantity}</p>
                                <p className="order-product__meta">Total items: {order.totalItems}</p>
                            </div>
                        </div>
                    </div>

                    {/* Customer */}
                    <div>
                        <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Customer</p>
                        <p className="order-customer__name">{order.customer.name}</p>
                        <p className="order-customer__address">{order.customer.address}</p>
                        <p className="order-customer__phone">{order.customer.phone}</p>
                    </div>

                    {/* Payment */}
                    <div>
                        <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Payment</p>
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-heading)', fontWeight: 600, marginBottom: '4px' }}>
                            ₹{order.payment.amount.toLocaleString('en-IN')}
                        </p>
                        <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}>via {order.payment.method}</p>
                        {paymentBadge(order.payment.status)}
                    </div>

                    {/* Date / Order */}
                    <div>
                        <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Order Date</p>
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-heading)' }}>
                            {new Date(order.orderDate).toLocaleDateString('en-IN', {
                                weekday: 'short', day: 'numeric', month: 'long', year: 'numeric'
                            })}
                        </p>
                        <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                            {new Date(order.orderDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                </div>

                {/* Status Stepper */}
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--color-glass-border)', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
                    <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Order Status</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0', overflowX: 'auto' }}>
                        {STATUS_FLOW.map((s, idx) => {
                            const done = idx <= currentIdx;
                            const active = idx === currentIdx;
                            const labels: Record<OrderStatus, string> = {
                                placed: 'Placed',
                                packing: 'Packing',
                                shipped: 'Shipped',
                                out_for_delivery: 'Out for Delivery',
                                delivered: 'Delivered',
                            };
                            return (
                                <div key={s} style={{ display: 'flex', alignItems: 'center', flex: idx < STATUS_FLOW.length - 1 ? 1 : 'none' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', minWidth: '60px' }}>
                                        <div style={{
                                            width: 28, height: 28,
                                            borderRadius: '50%',
                                            background: done ? (active ? 'var(--color-accent-primary)' : 'rgba(249,211,173,0.15)') : 'var(--color-glass-bg)',
                                            border: `2px solid ${done ? 'var(--color-accent-primary)' : 'var(--color-glass-border)'}`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: done ? (active ? '#0a0a0a' : 'var(--color-accent-primary)') : 'var(--color-text-muted)',
                                            fontSize: '0.7rem',
                                            flexShrink: 0,
                                        }}>
                                            {done && !active ? <MdCheckCircle size={14} /> : <MdRadioButtonUnchecked size={12} />}
                                        </div>
                                        <span style={{
                                            fontSize: '0.62rem',
                                            fontWeight: active ? 700 : 500,
                                            color: done ? 'var(--color-accent-primary)' : 'var(--color-text-muted)',
                                            textAlign: 'center',
                                            lineHeight: 1.3,
                                            whiteSpace: 'nowrap',
                                        }}>
                                            {labels[s]}
                                        </span>
                                    </div>
                                    {idx < STATUS_FLOW.length - 1 && (
                                        <div style={{
                                            flex: 1,
                                            height: 2,
                                            background: done && idx < currentIdx ? 'var(--color-accent-primary)' : 'var(--color-glass-border)',
                                            margin: '0 4px',
                                            marginBottom: '20px',
                                        }} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Update Status */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Update Status:</span>
                    <select
                        className="order-status-select"
                        value={order.status}
                        onChange={e => onStatusChange(e.target.value as OrderStatus)}
                    >
                        {STATUS_FLOW.map(s => (
                            <option key={s} value={s}>
                                {s === 'out_for_delivery' ? 'Out for Delivery' : s.charAt(0).toUpperCase() + s.slice(1)}
                            </option>
                        ))}
                    </select>
                    <button className="btn btn--secondary btn--sm" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────────────────── */

export default function OrdersPage() {
    const { isAuthenticated, orders, updateOrderStatus } = useSellerStore();
    const { showToast } = useToast();
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        if (!isAuthenticated) router.replace('/login');
    }, [isAuthenticated, router]);

    if (!isAuthenticated) return null;

    const filtered = orders.filter(o => {
        const matchSearch =
            o.id.toLowerCase().includes(search.toLowerCase()) ||
            o.productName.toLowerCase().includes(search.toLowerCase()) ||
            o.customer.name.toLowerCase().includes(search.toLowerCase()) ||
            o.customer.phone.includes(search);
        const matchStatus = statusFilter === 'all' || o.status === statusFilter;
        return matchSearch && matchStatus;
    });

    // Sort newest first
    const sorted = [...filtered].sort((a, b) =>
        new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
    );

    const handleStatusChange = (status: OrderStatus) => {
        if (!selectedOrder) return;
        updateOrderStatus(selectedOrder.id, status);
        // Update local ref too
        setSelectedOrder(prev => prev ? { ...prev, status } : null);
        showToast(`Order ${selectedOrder.id} updated to "${status.replace('_', ' ')}".`, 'success');
    };

    const handleInlineStatusChange = (orderId: string, status: OrderStatus) => {
        updateOrderStatus(orderId, status);
        showToast(`Order status updated.`, 'success');
    };

    const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`;

    return (
        <DashboardLayout pageTitle="All Orders" pageCrumb="Dashboard • Orders">
            {selectedOrder && (
                <OrderDetailModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onStatusChange={handleStatusChange}
                />
            )}

            <div className="section-header">
                <div className="section-header__left">
                    <h2 className="section-header__title">All Orders</h2>
                    <p className="section-header__subtitle">{orders.length} total order{orders.length !== 1 ? 's' : ''}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="filter-row">
                <div className="search-bar" style={{ maxWidth: '340px', width: '100%' }}>
                    <span className="search-bar__icon"><MdSearch /></span>
                    <input
                        id="order-search"
                        type="text"
                        className="search-bar__input"
                        placeholder="Search by ID, product, customer…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <MdFilterList style={{ color: 'var(--color-text-muted)' }} />
                    {ORDER_STATUSES.map(s => (
                        <button
                            key={s.value}
                            className={`btn btn--sm ${statusFilter === s.value ? 'btn--primary' : 'btn--secondary'}`}
                            onClick={() => setStatusFilter(s.value)}
                            id={`filter-${s.value}`}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="orders-table-wrap">
                {sorted.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state__icon"><MdShoppingBag /></div>
                        <p className="empty-state__title">No orders found</p>
                        <p className="empty-state__text">Try changing your filters or search terms.</p>
                    </div>
                ) : (
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Product</th>
                                <th>Customer</th>
                                <th>Size / Qty</th>
                                <th>Payment</th>
                                <th>Order Date</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sorted.map(order => (
                                <tr key={order.id}>
                                    <td>
                                        <span className="order-id">{order.id}</span>
                                    </td>
                                    <td>
                                        <div className="order-product">
                                            <div className="order-product__img">
                                                {order.productImage ? (
                                                    <img src={order.productImage} alt={order.productName} />
                                                ) : (
                                                    <div className="order-product__img-placeholder"><MdImage /></div>
                                                )}
                                            </div>
                                            <div className="order-product__details">
                                                <p className="order-product__name">{order.productName}</p>
                                                <p className="order-product__meta">Total: {order.totalItems} item{order.totalItems !== 1 ? 's' : ''}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <p className="order-customer__name">{order.customer.name}</p>
                                        <p className="order-customer__phone">{order.customer.phone}</p>
                                        <p className="order-customer__address" style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {order.customer.address}
                                        </p>
                                    </td>
                                    <td style={{ whiteSpace: 'nowrap' }}>
                                        <span className="badge badge--neutral" style={{ marginRight: '4px' }}>{order.size}</span>
                                        <span style={{ fontSize: '0.82rem', color: 'var(--color-text-body)' }}>× {order.quantity}</span>
                                    </td>
                                    <td>
                                        <p style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-accent-primary)', marginBottom: '4px' }}>
                                            {fmt(order.payment.amount)}
                                        </p>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '6px' }}>{order.payment.method}</p>
                                        {paymentBadge(order.payment.status)}
                                    </td>
                                    <td style={{ whiteSpace: 'nowrap' }}>
                                        <p style={{ fontSize: '0.82rem', color: 'var(--color-text-heading)' }}>
                                            {new Date(order.orderDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </p>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                                            {new Date(order.orderDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </td>
                                    <td>
                                        {statusBadge(order.status)}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                                            <button
                                                id={`order-detail-${order.id}`}
                                                className="btn btn--secondary btn--sm"
                                                onClick={() => setSelectedOrder(order)}
                                            >
                                                Details
                                            </button>
                                            <select
                                                className="order-status-select"
                                                value={order.status}
                                                onChange={e => handleInlineStatusChange(order.id, e.target.value as OrderStatus)}
                                                title="Update status"
                                            >
                                                {STATUS_FLOW.map(s => (
                                                    <option key={s} value={s}>
                                                        {s === 'out_for_delivery' ? 'Out for Delivery' : s.charAt(0).toUpperCase() + s.slice(1)}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </DashboardLayout>
    );
}
