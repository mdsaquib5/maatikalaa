'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { useState } from 'react';
import { useCart } from '@/store/useCart';
import toast from 'react-hot-toast';
import { FiChevronLeft, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';

export default function ProductDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { addToCart } = useCart();
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);

    const { data, isLoading } = useQuery({
        queryKey: ['product', id],
        queryFn: async () => {
            const res = await api.get(`/products/get-product/${id}`);
            return res.data;
        }
    });

    if (isLoading) return <div className="full-page-center">Loading piece...</div>;
    if (!data?.product) return <div className="full-page-center">Piece not found</div>;

    const p = data.product;

    const handleAddToCart = () => {
        if (p.sizes?.length > 0 && !selectedSize) {
            toast.error('Please select a size');
            return;
        }
        addToCart({
            id: p._id,
            name: p.productName,
            price: p.price,
            image: p.images[0]?.url || '/placeholder.png',
            quantity,
            size: selectedSize,
            sellerId: p.sellerId
        });
        toast.success(`${p.productName} added to cart`);
    };

    return (
        <main className="theme-container">
            <div className="container">
                <button 
                    onClick={() => router.back()}
                    className="flex items-center gap-8 text-body font-600 mb-24"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: '40px' }}
                >
                    <FiChevronLeft /> Back to Shop
                </button>

                <div className="grid gap-32" style={{ gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'flex-start' }}>
                    
                    {/* Image Section */}
                    <div className="sticky-sidebar">
                        <div className="theme-card" style={{ padding: '0', overflow: 'hidden', aspectRatio: '1/1' }}>
                            <img 
                                src={p.images[0]?.url || '/placeholder.png'} 
                                alt={p.productName} 
                                className="w-full h-full"
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                        {p.images.length > 1 && (
                            <div className="flex gap-12" style={{ marginTop: '16px' }}>
                                {p.images.slice(1).map((img: any, i: number) => (
                                    <div key={i} className="theme-card" style={{ width: '80px', height: '80px', padding: '0', overflow: 'hidden' }}>
                                        <img src={img.url} alt="" className="w-full h-full" style={{ objectFit: 'cover' }} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Details Section */}
                    <div>
                        <span className="theme-badge mb-24">Artisan Crafted</span>
                        <h1 className="theme-title" style={{ marginTop: '12px', marginBottom: '24px', fontSize: '3.5rem' }}>{p.productName}</h1>
                        
                        <div className="flex items-center gap-24 mb-32">
                            <span className="text-xl font-800" style={{ color: 'var(--color-accent-primary)' }}>₹{p.price.toLocaleString('en-IN')}</span>
                            <span className={`status-badge ${p.stock > 0 ? 'status-badge--delivered' : 'status-badge--pending'}`}>
                                {p.stock > 0 ? `In Stock (${p.stock} available)` : 'Sold Out'}
                            </span>
                        </div>

                        <p className="text-body" style={{ lineHeight: 1.8, fontSize: '1.1rem', marginBottom: '40px' }}>
                            {p.description}
                        </p>

                        {/* Sizes */}
                        {p.sizes?.length > 0 && (
                            <div style={{ marginBottom: '40px' }}>
                                <p className="theme-section-label">SELECT SIZE</p>
                                <div className="flex gap-12">
                                    {p.sizes.map((s: string) => (
                                        <button
                                            key={s}
                                            onClick={() => setSelectedSize(s)}
                                            className={`payment-method-btn ${selectedSize === s ? 'payment-method-btn--active' : ''}`}
                                            style={{ width: '60px', height: '60px' }}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity */}
                        <div style={{ marginBottom: '40px' }}>
                            <p className="theme-section-label">QUANTITY</p>
                            <div className="quantity-control" style={{ padding: '8px', display: 'inline-flex' }}>
                                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="quantity-control__btn" style={{ padding: '10px' }}><FiMinus /></button>
                                <span className="quantity-control__value" style={{ width: '50px', fontSize: '1.1rem' }}>{quantity}</span>
                                <button onClick={() => setQuantity(q => Math.min(p.stock, q + 1))} className="quantity-control__btn" style={{ padding: '10px' }}><FiPlus /></button>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="flex gap-16">
                            <button 
                                onClick={handleAddToCart}
                                disabled={p.stock <= 0}
                                className="theme-button flex-1"
                                style={{ padding: '24px', fontSize: '1rem' }}
                            >
                                <FiShoppingBag size={22} />
                                ADD TO CART
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
