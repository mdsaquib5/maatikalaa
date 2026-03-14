'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useSellerAuth } from '@/store/useSellerAuth';
import api from '@/lib/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
    MdSearch, MdShoppingBag, MdImage, MdFilterList,
    MdCheckCircle, MdRadioButtonUnchecked
} from 'react-icons/md';

const ORDER_STATUSES: { value: string; label: string }[] = [
    { value: 'all', label: 'All Orders' },
    { value: 'PENDING', label: 'Placed' },
    { value: 'PACKING', label: 'Packing' },
    { value: 'SHIPPED', label: 'Shipped' },
    { value: 'DELIVERED', label: 'Delivered' },
];

const STATUS_FLOW = ['PENDING', 'PACKING', 'SHIPPED', 'DELIVERED'];

function statusBadge(status: string) {
    const map: Record<string, { cls: string; label: string }> = {
        PENDING: { cls: 'badge--info', label: 'Placed' },
        PACKING: { cls: 'badge--warning', label: 'Packing' },
        SHIPPED: { cls: 'badge--accent', label: 'Shipped' },
        DELIVERED: { cls: 'badge--success', label: 'Delivered' },
        CANCELLED: { cls: 'badge--error', label: 'Cancelled' },
    };
    const d = map[status] || { cls: 'badge--neutral', label: status || 'Placed' };
    return <span className={`badge ${d.cls}`}>{d.label}</span>;
}

function paymentBadge(status: string) {
    const map: Record<string, { cls: string; label: string }> = {
        PAID: { cls: 'badge--success', label: 'Paid' },
        PENDING: { cls: 'badge--warning', label: 'Pending' },
        FAILED: { cls: 'badge--error', label: 'Failed' },
    };
    const d = map[status] || { cls: 'badge--neutral', label: status };
    return <span className={`badge ${d.cls}`}>{d.label}</span>;
}

function OrderDetailModal({ order, onClose, onStatusChange, updating }: {
    order: any;
    onClose: () => void;
    onStatusChange: (status: string) => void;
    updating: boolean;
}) {
    const currentIdx = STATUS_FLOW.indexOf(order.orderStatus);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
                <div className="modal__header">
                    <h3 className="modal__title">Order #{order._id.slice(-6).toUpperCase()}</h3>
                    <button className="modal__close" onClick={onClose}>✕</button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                    <div>
                        <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Product(s)</p>
                        {order.items.map((item: any, i: number) => (
                            <div key={i} className="order-product" style={{ marginBottom: '8px' }}>
                                <div className="order-product__img">
                                    {item.productId?.images?.[0]?.url ? (
                                        <img src={item.productId.images[0].url} alt={item.productId.productName} />
                                    ) : (
                                        <div className="order-product__img-placeholder"><MdImage /></div>
                                    )}
                                </div>
                                <div className="order-product__details">
                                    <p className="order-product__name">{item.productId?.productName}</p>
                                    <p className="order-product__meta">Size: {item.size || 'N/A'} · Qty: {item.quantity || item.qty || 1}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div>
                        <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Customer</p>
                        <p className="order-customer__name">{order.userId?.name}</p>
                        <p className="order-customer__phone">{order.userId?.email}</p>
                        <p className="order-customer__phone">{order.phone || 'No phone provided'}</p>
                        <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '8px', lineHeight: '1.4' }}>
                            {order.shippingAddress || 'No address provided'}
                        </p>
                    </div>

                    <div>
                        <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Payment</p>
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-heading)', fontWeight: 600, marginBottom: '4px' }}>
                            ₹{order.sellerTotalAmount.toLocaleString('en-IN')}
                        </p>
                        <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}>via {order.paymentMethod}</p>
                        {paymentBadge(order.paymentStatus)}
                    </div>

                    <div>
                        <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Order Date</p>
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-heading)' }}>
                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                weekday: 'short', day: 'numeric', month: 'long', year: 'numeric'
                            })}
                        </p>
                    </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--color-glass-border)', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
                    <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Status Tracker</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0', overflowX: 'auto' }}>
                        {STATUS_FLOW.map((s, idx) => {
                            const done = idx <= currentIdx;
                            const active = idx === currentIdx;
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
                                            fontSize: '14px'
                                        }}>
                                            {done && !active ? <MdCheckCircle size={14} /> : <MdRadioButtonUnchecked size={12} />}
                                        </div>
                                        <span style={{ fontSize: '0.62rem', fontWeight: active ? 700 : 500, color: done ? 'var(--color-accent-primary)' : 'var(--color-text-muted)' }}>
                                            {s}
                                        </span>
                                    </div>
                                    {idx < STATUS_FLOW.length - 1 && (
                                        <div style={{ flex: 1, height: 2, background: done && idx < currentIdx ? 'var(--color-accent-primary)' : 'var(--color-glass-border)', margin: '0 4px', marginBottom: '20px' }} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Update Status:</span>
                    <select
                        className="order-status-select"
                        value={order.orderStatus}
                        onChange={e => onStatusChange(e.target.value)}
                        disabled={updating}
                    >
                        {STATUS_FLOW.map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                    <button className="btn btn--secondary btn--sm" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
}

export default function OrdersPage() {
    const { isAuthenticated } = useSellerAuth();
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['seller-orders'],
        queryFn: async () => {
            const res = await api.get('/orders/seller-orders');
            return res.data;
        },
        enabled: isAuthenticated,
    });

    const updateStatusMutation = useMutation({
        mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
            const res = await api.put('/orders/update-status', { orderId, status });
            return res.data;
        },
        onSuccess: () => {
            toast.success('Order status updated');
            queryClient.invalidateQueries({ queryKey: ['seller-orders'] });
            if (selectedOrder) {
                const updated = data.orders.find((o: any) => o._id === selectedOrder._id);
                setSelectedOrder(updated);
            }
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Failed to update order');
        }
    });

    if (!isAuthenticated) return null;

    const orders = data?.orders || [];

    const filtered = orders.filter((o: any) => {
        const matchSearch =
            o._id.toLowerCase().includes(search.toLowerCase()) ||
            o.items[0]?.productId?.productName.toLowerCase().includes(search.toLowerCase()) ||
            o.userId?.name.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'all' || o.orderStatus === statusFilter;
        return matchSearch && matchStatus;
    });

    const handleStatusChange = (status: string) => {
        if (!selectedOrder) return;
        updateStatusMutation.mutate({ orderId: selectedOrder._id, status });
    };

    const fmt = (n: any) => {
        if (n === null || n === undefined) return '₹0';
        return `₹${Number(n).toLocaleString('en-IN')}`;
    };

    return (
        <DashboardLayout pageTitle="All Orders" pageCrumb="Dashboard • Orders">
            {selectedOrder && (
                <OrderDetailModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onStatusChange={handleStatusChange}
                    updating={updateStatusMutation.isPending}
                />
            )}

            <div className="section-header">
                <div className="section-header__left">
                    <h2 className="section-header__title">All Orders</h2>
                    <p className="section-header__subtitle">{orders.length} total order{orders.length !== 1 ? 's' : ''}</p>
                </div>
            </div>

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
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="orders-table-wrap">
                {isLoading ? (
                    <div style={{ padding: '80px', textAlign: 'center', opacity: 0.5 }}>Loading orders...</div>
                ) : filtered.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state__icon"><MdShoppingBag /></div>
                        <p className="empty-state__title">No orders found</p>
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
                            {filtered.map((order: any) => (
                                <tr key={order._id}>
                                    <td><span className="order-id">#{order._id.slice(-6).toUpperCase()}</span></td>
                                    <td>
                                        <div className="order-product">
                                            <div className="order-product__img">
                                                {order.items[0]?.productId?.images?.[0]?.url ? (
                                                    <img src={order.items[0].productId.images[0].url} alt={order.items[0].productId.productName} />
                                                ) : (
                                                    <div className="order-product__img-placeholder"><MdImage /></div>
                                                )}
                                            </div>
                                            <div className="order-product__details">
                                                <p className="order-product__name">{order.items[0]?.productId?.productName}</p>
                                                {order.items.length > 1 && <p className="order-product__meta">+{order.items.length - 1} more</p>}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <p className="order-customer__name">{order.userId?.name}</p>
                                        <p className="order-customer__phone">{order.userId?.email}</p>
                                    </td>
                                    <td style={{ whiteSpace: 'nowrap' }}>
                                        <span className="badge badge--neutral" style={{ marginRight: '4px' }}>{order.items[0]?.size || 'N/A'}</span>
                                        <span style={{ fontSize: '0.82rem', color: 'var(--color-text-body)' }}>× {order.items[0]?.quantity || order.items[0]?.qty || 1}</span>
                                    </td>
                                    <td>
                                        <p style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-accent-primary)', marginBottom: '4px' }}>
                                            {fmt(order.sellerTotalAmount)}
                                        </p>
                                        {paymentBadge(order.paymentStatus)}
                                    </td>
                                    <td style={{ whiteSpace: 'nowrap' }}>
                                        <p style={{ fontSize: '0.82rem' }}>{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </td>
                                    <td>
                                        <select
                                            className="order-status-select"
                                            value={order.orderStatus || 'PENDING'}
                                            onChange={(e) => updateStatusMutation.mutate({ orderId: order._id, status: e.target.value })}
                                            disabled={updateStatusMutation.isPending && selectedOrder?._id === order._id}
                                            style={{ fontSize: '0.75rem', padding: '4px 24px 4px 8px' }}
                                        >
                                            {STATUS_FLOW.map(s => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        <button className="btn btn--secondary btn--sm" onClick={() => setSelectedOrder(order)}>Details</button>
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
