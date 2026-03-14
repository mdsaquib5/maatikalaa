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

    if (isLoading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>Loading piece...</div>;
    if (!data?.product) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>Piece not found</div>;

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
        <main style={{ minHeight: '100vh', background: 'var(--color-bg-dark)', color: '#fff', paddingTop: '100px' }}>
            <div className="container">
                <button 
                    onClick={() => router.back()}
                    style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px' }}
                >
                    <FiChevronLeft /> Back to Shop
                </button>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'flex-start' }}>
                    
                    {/* Image Section */}
                    <div style={{ position: 'sticky', top: '120px' }}>
                        <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '24px', overflow: 'hidden', aspectRatio: '1/1', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <img 
                                src={p.images[0]?.url || '/placeholder.png'} 
                                alt={p.productName} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                        {p.images.length > 1 && (
                            <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                                {p.images.slice(1).map((img: any, i: number) => (
                                    <div key={i} style={{ width: '80px', height: '80px', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                                        <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Details Section */}
                    <div>
                        <span style={{ color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '2px', fontWeight: 700 }}>Artisan Crafted</span>
                        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginTop: '12px', marginBottom: '24px' }}>{p.productName}</h1>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                            <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>₹{p.price.toLocaleString('en-IN')}</span>
                            <span style={{ color: p.stock > 0 ? '#4ADE80' : '#F87171', fontSize: '0.85rem', fontWeight: 600 }}>
                                {p.stock > 0 ? `In Stock (${p.stock} available)` : 'Sold Out'}
                            </span>
                        </div>

                        <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, fontSize: '1rem', marginBottom: '40px' }}>
                            {p.description}
                        </p>

                        {/* Sizes */}
                        {p.sizes?.length > 0 && (
                            <div style={{ marginBottom: '40px' }}>
                                <p style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '16px' }}>SELECT SIZE</p>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    {p.sizes.map((s: string) => (
                                        <button
                                            key={s}
                                            onClick={() => setSelectedSize(s)}
                                            style={{
                                                width: '56px', height: '56px', borderRadius: '12px', border: '2px solid',
                                                borderColor: selectedSize === s ? '#fff' : 'rgba(255,255,255,0.1)',
                                                background: selectedSize === s ? '#fff' : 'transparent',
                                                color: selectedSize === s ? '#000' : '#fff',
                                                fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s'
                                            }}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity */}
                        <div style={{ marginBottom: '40px' }}>
                            <p style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '16px' }}>QUANTITY</p>
                            <div style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '8px' }}>
                                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{ background: 'none', border: 'none', color: '#fff', padding: '8px', cursor: 'pointer' }}><FiMinus /></button>
                                <span style={{ width: '40px', textAlign: 'center', fontWeight: 700 }}>{quantity}</span>
                                <button onClick={() => setQuantity(q => Math.min(p.stock, q + 1))} style={{ background: 'none', border: 'none', color: '#fff', padding: '8px', cursor: 'pointer' }}><FiPlus /></button>
                            </div>
                        </div>

                        {/* CTA */}
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <button 
                                onClick={handleAddToCart}
                                disabled={p.stock <= 0}
                                style={{
                                    flex: 1, background: '#fff', color: '#000', borderRadius: '16px', padding: '20px',
                                    fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', gap: '12px', transition: 'all 0.3s ease'
                                }}
                            >
                                <FiShoppingBag size={20} />
                                ADD TO CART
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
