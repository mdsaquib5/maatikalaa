'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { useState, useEffect } from 'react';
import { useCart } from '@/store/useCart';
import toast from 'react-hot-toast';
import { FiChevronLeft, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';

export default function ProductDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { addToCart } = useCart();
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [activeImg, setActiveImg] = useState('');

    const { data, isLoading } = useQuery({
        queryKey: ['product', id],
        queryFn: async () => {
            const res = await api.get(`/products/get-product/${id}`);
            return res.data;
        }
    });

    // Set initial image
    useEffect(() => {
        if (data?.product?.images?.length > 0 && !activeImg) {
            setActiveImg(data.product.images[0].url);
        }
    }, [data, activeImg]);

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
                    className="btn-back-link"
                >
                    <FiChevronLeft /> Back to Shop
                </button>

                <div className="product-detail-layout">

                    {/* Image Section */}
                    <div className="sticky-sidebar">
                        <div className="theme-card product-detail-image-main">
                            <img
                                src={activeImg || p.images[0]?.url || '/placeholder.png'}
                                alt={p.productName}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {p.images.length > 1 && (
                            <div className="product-detail__thumbs">
                                {p.images.map((img: any, i: number) => (
                                    <div 
                                        key={img.url || i} 
                                        onClick={() => setActiveImg(img.url)}
                                        className={`theme-card item-card-img--thumb product-detail-image-main cursor-pointer transition-all ${
                                            (activeImg === img.url || (!activeImg && i === 0)) ? 'ring-2 ring-accent scale-95 opacity-80' : 'hover:opacity-80'
                                        }`}
                                    >
                                        <img src={img.url} alt="" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Details Section */}
                    <div className="product-detail__info">
                        <div>
                            <span className="theme-badge mb-24">Artisan Crafted</span>
                            <h1 className="theme-title theme-title-large">{p.productName}</h1>

                            <div className="product-detail__meta">
                                <span className="text-price-large">₹{p.price.toLocaleString('en-IN')}</span>
                                <span className={`status-badge ${p.stock > 0 ? 'status-badge--delivered' : 'status-badge--pending'}`}>
                                    {p.stock > 0 ? `In Stock (${p.stock} available)` : 'Sold Out'}
                                </span>
                            </div>

                            <p className="text-body product-detail-desc">
                                {p.description}
                            </p>

                            {/* Sizes */}
                            {p.sizes?.length > 0 && (
                                <div className="mb-40">
                                    <p className="theme-section-label">SELECT SIZE</p>
                                    <div className="product-detail__sizes">
                                        {p.sizes.map((s: string) => (
                                            <button
                                                key={s}
                                                onClick={() => setSelectedSize(s)}
                                                className={`payment-method-btn size-btn-circle ${selectedSize === s ? 'payment-method-btn--active' : ''}`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quantity */}
                            <div className="mb-40">
                                <p className="theme-section-label">QUANTITY</p>
                                <div className="quantity-control qty-control-detail">
                                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="quantity-control__btn"><FiMinus /></button>
                                    <span className="quantity-control__value">{quantity}</span>
                                    <button onClick={() => setQuantity(q => Math.min(p.stock, q + 1))} className="quantity-control__btn"><FiPlus /></button>
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="product-detail__actions">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={p.stock <= 0}
                                    className="theme-button btn-cta-large"
                                >
                                    <FiShoppingBag size={22} />
                                    ADD TO CART
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
