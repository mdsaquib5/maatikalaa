'use client';

import { useCart } from '@/store/useCart';
import { useAuth } from '@/store/useAuth';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import ProtectedRoute from '@/app/components/providers/ProtectedRoute';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { FiCreditCard, FiPackage, FiTruck } from 'react-icons/fi';
import Script from 'next/script';

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function CheckoutPage() {
    const { items, totalAmount, clearCart } = useCart();
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'COD' | 'RAZORPAY'>('RAZORPAY');

    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [zip, setZip] = useState('');
    const [phone, setPhone] = useState('');

    useEffect(() => {
        if (items.length === 0) {
            router.push('/shop');
        }
    }, [items, router]);

    const handleCheckout = async () => {
        if (!address || !city || !zip || !phone) {
            toast.error('Please fill all shipping details');
            return;
        }

        setLoading(true);
        try {
            const orderData = {
                items: items.map(i => ({
                    productId: i.id,
                    quantity: i.quantity,
                    size: i.size
                })),
                totalAmount: totalAmount(),
                paymentMethod,
                shippingAddress: `${address}, ${city}, ${zip}`,
                phone
            };

            const res = await api.post('/orders/create-order', orderData);

            if (paymentMethod === 'COD') {
                toast.success('Order placed successfully!');
                clearCart();
                router.push('/orders');
            } else {
                const { razorpayOrder, order } = res.data;
                const options = {
                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_rYf63XvL6vUvU3', // Need to make sure this is available or user's key
                    amount: razorpayOrder.amount,
                    currency: razorpayOrder.currency,
                    name: 'Maatikalaa',
                    description: 'Handcrafted Piece Purchase',
                    order_id: razorpayOrder.id,
                    handler: async (response: any) => {
                        try {
                            await api.post('/orders/verify-payment', {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                            });
                            toast.success('Payment successful! Order confirmed.');
                            clearCart();
                            router.push('/orders');
                        } catch (err) {
                            toast.error('Payment verification failed');
                        }
                    },
                    prefill: {
                        name: user?.name,
                        email: user?.email,
                        contact: phone,
                    },
                    theme: {
                        color: '#0a0a0a',
                    },
                };
                const rzp = new window.Razorpay(options);
                rzp.open();
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Checkout failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProtectedRoute>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />
            <main style={{ minHeight: '100vh', background: 'var(--color-bg-dark)', color: '#fff', paddingTop: '120px', paddingBottom: '80px' }}>
                <div className="container" style={{ maxWidth: '1000px' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '40px' }}>Checkout</h1>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '48px' }}>
                        
                        {/* Shipping & Payment */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '32px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                                    <FiTruck size={20} color="#fff" />
                                    <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Shipping Information</h2>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                                    <input placeholder="Street Address" value={address} onChange={e => setAddress(e.target.value)} style={{ padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                        <input placeholder="City" value={city} onChange={e => setCity(e.target.value)} style={{ padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                                        <input placeholder="Zip Code" value={zip} onChange={e => setZip(e.target.value)} style={{ padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                                    </div>
                                    <input placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} style={{ padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                                </div>
                            </div>

                            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '32px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                                    <FiCreditCard size={20} color="#fff" />
                                    <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Payment Method</h2>
                                </div>
                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <button 
                                        onClick={() => setPaymentMethod('RAZORPAY')}
                                        style={{ 
                                            flex: 1, padding: '16px', borderRadius: '12px', border: '2px solid', 
                                            borderColor: paymentMethod === 'RAZORPAY' ? '#fff' : 'rgba(255,255,255,0.1)',
                                            background: paymentMethod === 'RAZORPAY' ? 'rgba(255,255,255,0.1)' : 'transparent',
                                            color: '#fff', cursor: 'pointer', fontWeight: 600
                                        }}
                                    >
                                        Razorpay / Cards
                                    </button>
                                    <button 
                                        onClick={() => setPaymentMethod('COD')}
                                        style={{ 
                                            flex: 1, padding: '16px', borderRadius: '12px', border: '2px solid', 
                                            borderColor: paymentMethod === 'COD' ? '#fff' : 'rgba(255,255,255,0.1)',
                                            background: paymentMethod === 'COD' ? 'rgba(255,255,255,0.1)' : 'transparent',
                                            color: '#fff', cursor: 'pointer', fontWeight: 600
                                        }}
                                    >
                                        Cash on Delivery
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Summary */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '32px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                                    <FiPackage size={20} color="#fff" />
                                    <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Summary</h2>
                                </div>
                                {items.map(item => (
                                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.9rem' }}>
                                        <span style={{ color: 'rgba(255,255,255,0.6)' }}>{item.name} x {item.quantity}</span>
                                        <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                                    </div>
                                ))}
                                <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '20px 0' }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.2rem' }}>
                                    <span>Total</span>
                                    <span>₹{totalAmount().toLocaleString('en-IN')}</span>
                                </div>
                                <button 
                                    onClick={handleCheckout}
                                    disabled={loading}
                                    style={{ 
                                        width: '100%', background: '#fff', color: '#000', borderRadius: '16px', padding: '18px', 
                                        fontWeight: 700, border: 'none', cursor: 'pointer', marginTop: '32px' 
                                    }}
                                >
                                    {loading ? 'Processing...' : 'PLACE ORDER'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </ProtectedRoute>
    );
}
