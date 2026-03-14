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
                <div className="container orders-container">
                    <h1 className="theme-title">Your Orders</h1>

                    {isLoading ? (
                        <div className="full-page-center pt-80">
                             <div className="spinner mb-24" />
                             <p className="text-body">Fetching your order history...</p>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="empty-state theme-card">
                            <FiPackage size={48} className="empty-state__icon mb-24" />
                            <p className="text-body">No orders placed yet.</p>
                        </div>
                    ) : (
                        <div className="orders-list">
                            {orders.map((order: any) => (
                                <div key={order._id} className="theme-card">
                                    <div className="order-card__header mb-24">
                                        <div>
                                            <p className="theme-section-label mb-8">ORDER #{order._id.slice(-6).toUpperCase()}</p>
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
                                                <div className="order-product__info">
                                                    <p className="font-600 text-heading">{item.productId?.productName}</p>
                                                    <div className="order-product__meta mt-8">
                                                        <span className="theme-badge badge-mini">{item.size || 'N/A'}</span>
                                                        <span className="text-sm text-body">Qty: {item.quantity || item.qty || 1}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="divider-line mt-24 mb-24" />

                                    <div className="order-card__footer">
                                        <div>
                                            <p className="text-sm text-body mb-8">
                                                Payment: <span className="text-heading font-600">{order.paymentStatus} via {order.paymentMethod}</span>
                                            </p>
                                            <p className="text-sm text-muted max-w-400">
                                                Deliver to: {order.shippingAddress || 'N/A'}
                                            </p>
                                        </div>
                                        <div className="order-total-block">
                                            <p className="text-xs text-muted mb-4">Total Amount</p>
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
