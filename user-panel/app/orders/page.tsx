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
            <main style={{ minHeight: '100vh', background: 'var(--color-bg-dark)', color: '#fff', paddingTop: '120px', paddingBottom: '80px' }}>
                <div className="container" style={{ maxWidth: '900px' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '40px' }}>Your Orders</h1>

                    {isLoading ? (
                        <div style={{ textAlign: 'center', opacity: 0.5, padding: '100px' }}>Fetching your order history...</div>
                    ) : orders.length === 0 ? (
                        <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.02)', padding: '80px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <FiPackage size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
                            <p style={{ color: 'rgba(255,255,255,0.5)' }}>No orders placed yet.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {orders.map((order: any) => (
                                <div key={order._id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '24px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', alignItems: 'flex-start' }}>
                                        <div>
                                            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: 700, letterSpacing: '1px' }}>ORDER #{order._id.slice(-6).toUpperCase()}</p>
                                            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div style={{ 
                                            display: 'flex', alignItems: 'center', gap: '8px', 
                                            background: order.orderStatus === 'DELIVERED' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(250, 204, 21, 0.1)', 
                                            padding: '8px 16px', borderRadius: '100px',
                                            border: `1px solid ${order.orderStatus === 'DELIVERED' ? 'rgba(74, 222, 128, 0.2)' : 'rgba(250, 204, 21, 0.2)'}`
                                        }}>
                                            {order.orderStatus === 'DELIVERED' ? <FiCheckCircle color="#4ADE80" /> : <FiCircle color="#FACC15" />}
                                            <span style={{ 
                                                fontSize: '0.8rem', fontWeight: 700, 
                                                color: order.orderStatus === 'DELIVERED' ? '#4ADE80' : '#FACC15' 
                                            }}>
                                                {order.orderStatus || 'PLACED'}
                                            </span>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        {order.items.map((item: any, idx: number) => (
                                            <div key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                                <div style={{ width: '60px', height: '60px', borderRadius: '12px', overflow: 'hidden', background: 'rgba(255,255,255,0.05)' }}>
                                                    <img src={item.productId?.images[0]?.url || '/placeholder.png'} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <p style={{ fontWeight: 600 }}>{item.productId?.productName}</p>
                                                    <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>Size: {item.size || 'N/A'} • Qty: {item.quantity || item.qty || 1}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '20px 0' }} />

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                        <div>
                                            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>
                                                Payment: <span style={{ color: '#fff' }}>{order.paymentStatus} via {order.paymentMethod}</span>
                                            </p>
                                            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', maxWidth: '400px' }}>
                                                Deliver to: {order.shippingAddress || 'N/A'} • {order.phone || ''}
                                            </p>
                                        </div>
                                        <p style={{ fontSize: '1.2rem', fontWeight: 800 }}>₹{order.totalAmount.toLocaleString('en-IN')}</p>
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
