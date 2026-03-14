'use client';

import { useCart } from '@/store/useCart';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiTrash2, FiMinus, FiPlus, FiArrowRight, FiShoppingBag } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function CartPage() {
    const { items, removeFromCart, updateQuantity, totalAmount } = useCart();
    const router = useRouter();

    if (items.length === 0) {
        return (
            <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-dark)', color: '#fff' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ marginBottom: '24px', opacity: 0.2 }}><FiShoppingBag size={80} /></div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '16px' }}>Your Cart is Empty</h1>
                    <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '32px' }}>Explore our collection and find something unique.</p>
                    <Link href="/shop" style={{ background: '#fff', color: '#000', padding: '14px 32px', borderRadius: '12px', fontWeight: 700, textDecoration: 'none' }}>
                        Browse Gallery
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main style={{ minHeight: '100vh', background: 'var(--color-bg-dark)', color: '#fff', paddingTop: '120px', paddingBottom: '80px' }}>
            <div className="container">
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '48px' }}>Your Collection</h1>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '48px', alignItems: 'flex-start' }}>
                    
                    {/* Items List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', background: 'rgba(255,255,255,0.05)', borderRadius: '24px', overflow: 'hidden' }}>
                        {items.map((item) => (
                            <div key={`${item.id}-${item.size}`} style={{ background: 'rgba(20,20,20,0.6)', padding: '24px', display: 'flex', gap: '24px', alignItems: 'center' }}>
                                <div style={{ width: '100px', height: '100px', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px' }}>{item.name}</h3>
                                    {item.size && <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>SIZE: {item.size}</p>}
                                    <p style={{ fontSize: '1rem', fontWeight: 700 }}>₹{item.price.toLocaleString('en-IN')}</p>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '4px' }}>
                                    <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1), item.size)} style={{ background: 'none', border: 'none', color: '#fff', padding: '8px', cursor: 'pointer' }}><FiMinus size={14} /></button>
                                    <span style={{ width: '30px', textAlign: 'center', fontWeight: 700, fontSize: '0.9rem' }}>{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1, item.size)} style={{ background: 'none', border: 'none', color: '#fff', padding: '8px', cursor: 'pointer' }}><FiPlus size={14} /></button>
                                </div>

                                <button 
                                    onClick={() => {
                                        removeFromCart(item.id, item.size);
                                        toast.success('Removed from cart');
                                    }}
                                    style={{ background: 'rgba(248,113,113,0.1)', border: 'none', color: '#F87171', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                >
                                    <FiTrash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div style={{ position: 'sticky', top: '120px' }}>
                        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '32px' }}>
                            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '24px' }}>Order Summary</h2>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: 'rgba(255,255,255,0.5)' }}>
                                <span>Subtotal</span>
                                <span>₹{totalAmount().toLocaleString('en-IN')}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', color: 'rgba(255,255,255,0.5)' }}>
                                <span>Shipping</span>
                                <span style={{ color: '#4ADE80' }}>Calculated at next step</span>
                            </div>
                            
                            <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', marginBottom: '24px' }} />
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
                                <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>Total</span>
                                <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>₹{totalAmount().toLocaleString('en-IN')}</span>
                            </div>

                            <button 
                                onClick={() => router.push('/checkout')}
                                style={{
                                    width: '100%', background: '#fff', color: '#000', borderRadius: '16px', padding: '18px',
                                    fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', gap: '12px', transition: 'all 0.3s ease'
                                }}
                            >
                                PROCEED TO CHECKOUT
                                <FiArrowRight />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
