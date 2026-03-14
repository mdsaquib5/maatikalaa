'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import ProtectedRoute from '@/app/components/providers/ProtectedRoute';
import { FiPackage, FiCircle, FiCheckCircle } from 'react-icons/fi';

export default function UserOrdersPage() {
    const { data, isLoading } = useQuery({
        queryKey: ['user-orders'],
        queryFn: async () => {
            const res = await api.get('/orders/user-orders');
            return res.data;
        }
    });

    const orders = data?.orders || [];

    return (
        <ProtectedRoute>
            <main className="theme-container">
                <div className="container" style={{ maxWidth: '900px' }}>
                    <h1 className="theme-title">Your Orders</h1>

                    {isLoading ? (
                        <div className="full-page-center" style={{ minHeight: 'auto', padding: '100px' }}>
                             <div className="spinner mb-24" style={{ margin: '0 auto 20px' }} />
                             Fetching your order history...
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="empty-state theme-card" style={{ padding: '80px' }}>
                            <FiPackage size={48} className="empty-state__icon" />
                            <p className="text-body">No orders placed yet.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-24">
                            {orders.map((order: any) => (
                                <div key={order._id} className="theme-card">
                                    <div className="flex justify-between mb-24 align-start">
                                        <div>
                                            <p className="theme-section-label" style={{ marginBottom: '4px' }}>ORDER #{order._id.slice(-6).toUpperCase()}</p>
                                            <p className="text-sm text-body">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className={`status-badge ${order.orderStatus === 'DELIVERED' ? 'status-badge--delivered' : 'status-badge--pending'}`}>
                                            {order.orderStatus === 'DELIVERED' ? <FiCheckCircle /> : <FiCircle />}
                                            <span>
                                                {order.orderStatus || 'PLACED'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="order-item-list">
                                        {order.items.map((item: any, idx: number) => (
                                            <div key={idx} className="order-product-row">
                                                <div className="order-product-img">
                                                    <img src={item.productId?.images[0]?.url || '/placeholder.png'} alt="" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-600 text-heading">{item.productId?.productName}</p>
                                                    <p className="text-sm text-body flex items-center gap-12">
                                                        <span className="theme-badge" style={{ padding: '2px 8px', fontSize: '0.65rem' }}>{item.size || 'N/A'}</span>
                                                        <span>Qty: {item.quantity || item.qty || 1}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="divider-line" style={{ margin: '20px 0' }} />

                                    <div className="flex justify-between items-center align-end">
                                        <div>
                                            <p className="text-sm text-body" style={{ marginBottom: '4px' }}>
                                                Payment: <span className="text-heading font-600">{order.paymentStatus} via {order.paymentMethod}</span>
                                            </p>
                                            <p className="text-sm text-muted" style={{ maxWidth: '400px' }}>
                                                Deliver to: {order.shippingAddress || 'N/A'}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-muted" style={{ marginBottom: '2px' }}>Total Amount</p>
                                            <p className="text-xl font-800 text-accent">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </ProtectedRoute>
    );
}
