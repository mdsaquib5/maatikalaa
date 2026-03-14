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
            <main className="theme-container">
                <div className="container checkout-container">
                    <h1 className="theme-title">Checkout</h1>

                    <div className="two-col-grid checkout-grid">
                        
                        {/* Shipping & Payment */}
                        <div className="flex flex-col gap-32">
                            <div className="theme-card">
                                <div className="flex items-center gap-12 mb-24">
                                    <FiTruck size={20} className="text-accent" />
                                    <h2 className="item-card-title mb-0">Shipping Information</h2>
                                </div>
                                <div className="grid gap-16">
                                    <input placeholder="Street Address" value={address} onChange={e => setAddress(e.target.value)} className="theme-input" />
                                    <div className="grid grid-cols-2 gap-16">
                                        <input placeholder="City" value={city} onChange={e => setCity(e.target.value)} className="theme-input" />
                                        <input placeholder="Zip Code" value={zip} onChange={e => setZip(e.target.value)} className="theme-input" />
                                    </div>
                                    <input placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} className="theme-input" />
                                </div>
                            </div>

                            <div className="theme-card">
                                <div className="flex items-center gap-12 mb-24">
                                    <FiCreditCard size={20} className="text-accent" />
                                    <h2 className="item-card-title mb-0">Payment Method</h2>
                                </div>
                                <div className="flex gap-16">
                                    <button 
                                        onClick={() => setPaymentMethod('RAZORPAY')}
                                        className={`payment-method-btn ${paymentMethod === 'RAZORPAY' ? 'payment-method-btn--active' : ''}`}
                                    >
                                        Razorpay / Cards
                                    </button>
                                    <button 
                                        onClick={() => setPaymentMethod('COD')}
                                        className={`payment-method-btn ${paymentMethod === 'COD' ? 'payment-method-btn--active' : ''}`}
                                    >
                                        Cash on Delivery
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Summary */}
                        <aside className="item-list-container">
                            <div className="theme-card">
                                <div className="flex items-center gap-12 mb-24">
                                    <FiPackage size={20} className="text-accent" />
                                    <h2 className="item-card-title mb-0">Summary</h2>
                                </div>
                                <div className="summary-details">
                                    {items.map(item => (
                                        <div key={item.id} className="summary-row text-sm">
                                            <span className="summary-row--label">{item.name} x {item.quantity}</span>
                                            <span className="summary-row--value">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="summary-total">
                                    <span className="summary-total__label">Total</span>
                                    <span className="summary-total__value">₹{totalAmount().toLocaleString('en-IN')}</span>
                                </div>

                                <button 
                                    onClick={handleCheckout}
                                    disabled={loading}
                                    className="theme-button w-full mt-32"
                                >
                                    {loading ? 'Processing...' : 'PLACE ORDER'}
                                </button>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>
        </ProtectedRoute>
    );
}
