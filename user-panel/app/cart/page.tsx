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
            <main className="full-page-center">
                <div className="empty-state">
                    <div className="empty-state__icon"><FiShoppingBag size={80} /></div>
                    <h1 className="empty-state__title">Your Cart is Empty</h1>
                    <p className="empty-state__text">Explore our collection and find something unique.</p>
                    <Link href="/shop" className="theme-button">
                        Browse Gallery
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="theme-container">
            <div className="container">
                <h1 className="theme-title">Your Collection</h1>

                <div className="two-col-grid">
                    
                    {/* Items List */}
                    <div className="item-list-container">
                        {items.map((item) => (
                            <div key={`${item.id}-${item.size}`} className="theme-card">
                                <div className="item-card-row">
                                    <div className="item-card-img">
                                        <img src={item.image} alt={item.name} />
                                    </div>
                                    
                                    <div className="item-card-info">
                                        <h3 className="item-card-title">{item.name}</h3>
                                        {item.size && <span className="theme-badge">SIZE: {item.size}</span>}
                                        <p className="item-card-price">₹{item.price.toLocaleString('en-IN')}</p>
                                    </div>

                                    <div className="quantity-control">
                                        <button 
                                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1), item.size)} 
                                            className="quantity-control__btn"
                                        >
                                            <FiMinus size={14} />
                                        </button>
                                        <span className="quantity-control__value">{item.quantity}</span>
                                        <button 
                                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.size)} 
                                            className="quantity-control__btn"
                                        >
                                            <FiPlus size={14} />
                                        </button>
                                    </div>

                                    <button 
                                        className="remove-btn"
                                        onClick={() => {
                                            removeFromCart(item.id, item.size);
                                            toast.success('Removed from cart');
                                        }}
                                    >
                                        <FiTrash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <aside className="sticky-sidebar">
                        <div className="theme-card">
                            <h2 className="item-card-title mb-24">Order Summary</h2>
                            
                            <div className="summary-details">
                                <div className="summary-row">
                                    <span className="summary-row--label">Subtotal</span>
                                    <span className="summary-row--value">₹{totalAmount().toLocaleString('en-IN')}</span>
                                </div>
                                <div className="summary-row">
                                    <span className="summary-row--label">Shipping</span>
                                    <span className="cart-summary__shipping-free">FREE</span>
                                </div>
                            </div>
                            
                            <div className="summary-total">
                                <span className="summary-total__label">Total</span>
                                <span className="summary-total__value">₹{totalAmount().toLocaleString('en-IN')}</span>
                            </div>

                            <button 
                                onClick={() => router.push('/checkout')}
                                className="theme-button w-full mt-32"
                            >
                                PROCEED TO CHECKOUT
                                <FiArrowRight />
                            </button>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}
